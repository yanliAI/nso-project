<template>
  <div class="h-full w-full">
    <el-upload ref="uploadRef" class="w-full" v-model:file-list="fileList" drag :auto-upload="false" multiple :on-change="handleFileChange" accept=".xlsx">
          <!-- <template #trigger>
            <el-button type="primary">请选择导入文件</el-button>
          </template>
          <template #tip>
            <div class="el-upload__tip">只支持.xlsx类型文件上传</div>
          </template> -->
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <template #tip>
            <div class="el-upload__tip flex">
              <span class="flex-1">只支持.xlsx类型文件上传</span>
              <el-button link type="primary" class="mt-[-2px]" size="small" @click="downloadTemplate"> 点击下载导入模板文件 </el-button>
            </div>
          </template>
        </el-upload>
    <div class="text-center pt-[10px] pb-[15px]">
      <el-button type="primary" class="ml-4" :icon="Upload" @click="submitUpload">导入</el-button>
      <el-button type="info" class="ml-4" :icon="Close" @click="emit('close')">取消</el-button>
    </div>
  </div>
</template>

<script setup>
import { ElRow, ElCol, ElButton, ElMessage, ElProgress, ElUpload, ElMessageBox, ElTooltip } from 'element-plus'
import { reactive, ref, onMounted, defineExpose, defineEmits, defineProps } from 'vue'
import { Upload, Close, UploadFilled  } from '@element-plus/icons-vue'
import { formatDate, formatDateTime, formatToken } from '#/utils/commonUtil.ts'
import { useUserStore, useAccessStore } from '@vben/stores'
import axios from 'axios'
import { downloadFile } from '#/utils/download.ts'
const props = defineProps({
  taskData: {
    type: Object,
    default: {}
  }
})
const accessStore = useAccessStore()
const uploadRef = ref()
const fileList = ref([])
const emit = defineEmits(['close', 'ok'])
const cmdCode = defineModel('cmdCode')

defineExpose({
  submitUpload
})
onMounted(async () => {})

// 下载导入模板
async function downloadTemplate() {
  toExcel({}, 'cmdb资产导入模板.xlsx')
}

async function toExcel(params, excelName) {
  return downloadFile(import.meta.env.VITE_NSOSGZ + '/flawAsset/downLoadCmdbTempFile', params, excelName)
}

/**
 * 手动上传
 */
async function submitUpload() {
  const taskData = props.taskData
  if (!fileList.value.length) {
    ElMessage.warning('请先选择文件')
    return
  }

  const formData = new FormData()
  fileList.value.forEach((file) => {
    formData.append('files', file.raw) // 多文件 key 要一致
  })
  formData.append('cmdCode', cmdCode.value)

  try {
    const res = await axios.post(import.meta.env.VITE_NSOSGZ + '/flawAsset/importTemplateData', formData, {
      headers: {
        Authorization: formatToken(accessStore.accessToken)
      }
    })

    if (res.data.ok) {
      ElMessage.success(`导入成功!`)
      emit('ok')
    } else {
      ElMessage.error(`导入失败!`)
    }

    // 清空文件
    uploadRef.value.clearFiles()
    fileList.value = []
  } catch (err) {
    ElMessage.success(`导入失败!`)
    console.log('导入失败 :>>', err)
  }
}

/**
 * 文件列表变化时进行文件校验
 */
const handleFileChange = (file, fileList) => {
  // 校验类型
  // const isExcel = file.raw.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  // 校验大小 (单位：字节)
  const isLt10M = file.size / 1024 / 1024 < 1024
  // if (!isExcel) {
  //   ElMessage.error('只能上传 .xlsx 格式的文件')
  //   resetFileList()
  //   return
  // }
  if (!isLt10M) {
    ElMessage.error('文件大小不能超过 1024MB')
    resetFileList()
    return
  }
}

const resetFileList = () => {
  // 清空上传列表
  if (uploadRef.value) {
    uploadRef.value.clearFiles()
  }
}
</script>

<style></style>
