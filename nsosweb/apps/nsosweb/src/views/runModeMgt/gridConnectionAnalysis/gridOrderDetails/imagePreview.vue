<template>
  <div class="wrap">
    <!-- 加载状态 -->
    <div v-if="showLoading" v-loading="loading" element-loading-text="正在加载..." :element-loading-spinner="loadSvg" style="width: 100%; height: 100%">
      <el-empty description="加载文件失败!" style="vertical-align: middle;" />
    </div>
    
    <!-- 图片预览区域 -->
    <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; background: #f5f5f5; overflow: auto;">
      <el-image 
        :src="imageData.imageSrc" 
        :preview-src-list="imageData.imageSrcList" 
        fit="contain"
        style="max-width: 400px; max-height: 400px;"
        :z-index="9999"
      >
        <template #error>
          <div class="image-error">
            <el-icon><Picture /></el-icon>
            <span>图片加载失败</span>
          </div>
        </template>
        <template #placeholder>
          <div class="image-loading">
            <el-icon class="is-loading"><Loading /></el-icon>
            <span>加载中...</span>
          </div>
        </template>
      </el-image>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue'
import axios from 'axios'
import { useAccessStore } from '@vben/stores'
import { ElMessage, ElImage, ElEmpty, ElIcon } from 'element-plus'
import { Picture, Loading } from '@element-plus/icons-vue'

// 定义模型
const previewFileData = defineModel('fileData')

// 预览参数
const fileType = ref('')
const showLoading = ref(false)
const loading = ref(false)
const accessStore = useAccessStore()

// 图片数据
const imageData = reactive({
  imageSrc: '',
  imageSrcList: []
})

// 加载图标SVG
const loadSvg = `<svg t="1740446666718" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7580" width="48" height="48"><path d="M546.462897 266.292966c-73.410207 0-133.15531-59.727448-133.155311-133.137656C413.307586 59.762759 473.05269 0 546.462897 0c73.410207 0 133.12 59.727448 133.12 133.15531 0 73.410207-59.709793 133.137655-133.12 133.137656z m-283.453794 105.736827c-67.054345 0-121.626483-54.554483-121.626482-121.644138s54.572138-121.644138 121.626482-121.644138a121.767724 121.767724 0 0 1 121.608828 121.644138c0 67.054345-54.554483 121.644138-121.608828 121.644138zM142.547862 647.185655A107.343448 107.343448 0 0 1 35.310345 539.895172a107.343448 107.343448 0 0 1 107.237517-107.237517 107.343448 107.343448 0 0 1 107.219862 107.237517 107.343448 107.343448 0 0 1-107.219862 107.272828z m120.461241 272.595862a91.047724 91.047724 0 0 1-90.941793-90.959448 91.065379 91.065379 0 0 1 90.924138-90.941793 91.065379 91.065379 0 0 1 90.941793 90.941793c0 50.14069-40.783448 90.959448-90.924138 90.959448zM546.462897 1024a79.518897 79.518897 0 0 1-79.448276-79.448276c0-43.820138 35.645793-79.448276 79.448276-79.448276a79.518897 79.518897 0 0 1 79.43062 79.448276c0 43.820138-35.628138 79.448276-79.448276 79.448276z m287.744-134.285241a64.194207 64.194207 0 0 1-64.123587-64.123587 64.194207 64.194207 0 0 1 64.123587-64.123586 64.194207 64.194207 0 0 1 64.123586 64.123586 64.194207 64.194207 0 0 1-64.123586 64.123587z m117.848275-296.695173a52.683034 52.683034 0 0 1-52.612413-52.612414 52.683034 52.683034 0 0 1 52.612413-52.630069 52.70069 52.70069 0 0 1 52.630069 52.612414 52.718345 52.718345 0 0 1-52.630069 52.630069z m-158.667034-338.696827a40.818759 40.818759 0 1 0 81.655172 0.017655 40.818759 40.818759 0 0 0-81.655172 0z" fill="#389BFF" p-id="7581"></path></svg>`

// 监听文件数据变化
watch(previewFileData, async (newVal) => {
  if (!newVal) return
  await loadFile()
}, { immediate: true })

// 主加载函数
async function loadFile() {
  try {
    showLoading.value = true
    loading.value = true
    
    const { type } = detectFileType(previewFileData.value.name)
    fileType.value = type
    
    const response = await axios({
      method: 'post',
      responseType: 'blob',
      url: import.meta.env.VITE_NSOSFS + `/ydCommon/previewFile`,
      data: { 
        fileId: previewFileData.value.fileId, 
        idate: previewFileData.value.iDate, 
        oid: previewFileData.value.oid 
      },
      headers: {
        Authorization: formatToken(accessStore.accessToken)
      }
    })
    
    showLoading.value = false
    loading.value = false
    
    if (typeContains(type, 'pngjpgjpeggifsvg')) {
      // 创建图片URL
      const imageUrl = window.URL.createObjectURL(response.data)
      imageData.imageSrc = imageUrl
      imageData.imageSrcList = [imageUrl]
    } else {
      ElMessage.warning(`不支持的文件格式: ${type}`)
    }
  } catch (error) {
    loading.value = false
    showLoading.value = false
    ElMessage.error('文件加载失败：' + (error.message || '未知错误'))
    console.error('文件加载失败:', error)
  }
}

// zip文件中的图片加载函数
async function loadZipFile(fileData) {
  try {
    showLoading.value = true
    loading.value = true
    
    const { type } = detectFileType(fileData.entryPath)
    fileType.value = type
    
    const response = await axios({
      method: 'post',
      responseType: 'blob',
      url: import.meta.env.VITE_NSOSFS + `/ydCommon/previewZipEntry`,
      data: { 
        fileId: fileData.fileId, 
        idate: fileData.iDate, 
        oid: fileData.oid, 
        entryPath: fileData.entryPath 
      },
      headers: {
        Authorization: formatToken(accessStore.accessToken)
      }
    })
    
    showLoading.value = false
    loading.value = false
    
    if (typeContains(type, 'pngjpgjpeggifsvg')) {
      const imageUrl = window.URL.createObjectURL(response.data)
      imageData.imageSrc = imageUrl
      imageData.imageSrcList = [imageUrl]
    } else {
      ElMessage.warning(`不支持的文件格式: ${type}`)
    }
  } catch (error) {
    loading.value = false
    showLoading.value = false
    ElMessage.error('文件加载失败：' + (error.message || '未知错误'))
    console.error('文件加载失败:', error)
  }
}

// 工具函数
function formatToken(token) {
  return token ? `Bearer ${token}` : null
}

function typeContains(type, types) {
  return types.indexOf(type) >= 0
}

function detectFileType(filename) {
  if (!filename) return { extension: '', type: 'unknown' }

  const extension = filename.split('.').pop().toLowerCase()
  
  const imageTypes = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg', 'ico']
  
  if (imageTypes.includes(extension)) {
    return { extension, type: extension }
  }
  
  return { extension, type: 'unknown' }
}

// 暴露方法供外部调用
defineExpose({
  loadZipFile
})
</script>

<style scoped>
:deep(.el-image__error, .el-image__inner, .el-image__placeholder, .el-image__wrapper){
  height: 600px !important;
  overflow-y: auto;
}
.wrap {
  width: 100%;
  height: 400px;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #999;
  font-size: 14px;
}

.image-error .el-icon {
  font-size: 48px;
  margin-bottom: 8px;
  color: #dcdfe6;
}

.image-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #999;
  font-size: 14px;
}

.image-loading .el-icon {
  font-size: 48px;
  margin-bottom: 8px;
  color: #409eff;
  animation: rotate 1.5s linear infinite;
}


@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

:deep(.el-image) {
  max-width: 100%;
  max-height: 100%;
}

:deep(.el-image__inner) {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

:deep(.el-image__error) {
  display: none;
}
</style>
