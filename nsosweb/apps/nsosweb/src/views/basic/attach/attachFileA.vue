<template>
  <div class="w-full h-full">
    <div class="mb-1 flex items-center h-[24px]">
      <slot name="title"></slot>
      <el-upload v-if="!disabled" class="upload-demo" :action="uploadUrl" :show-file-list="false" :http-request="fileUpload" :on-progress="uploadProgress">
        <el-button type="primary" :icon="Upload" size="small" class="btn">上传附件</el-button>
      </el-upload>
      <el-tooltip v-if="!disabled" placement="right">
        <template #content>
          <div>单个上传文件最大不超过：10Mb</div>
          <div>上传文件个数最大不超过：15个</div>
          <div>上传文件总大小不超过：100MB</div>
          <div>上传文件类型：doc | docx | xls | xlsx | txt | pdf | ppt</div>
          <div>png | jpg | jpeg | gif | svg | rar | zip | 7z | gz | tar</div>
          <div>支持批量选择文件上传</div>
        </template>
        <InfoFilled class="w-[16px] h-[16px] ml-2 text-gray-500 dianji"></InfoFilled>
      </el-tooltip>
    </div>
    <div class="attach-table mt-1">
      <AttachList ref="attachListRef" :parentId="parentId" :moduleId="moduleId" @afterUpload="emit('afterUpload')" @afterDelete="afterDelete" :showPreview="showPreview" :showDelete="showDelete"></AttachList>
    </div>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue'
import axios from 'axios'
import { useAccessStore, useUserStore } from '@vben/stores'
import { ElMessage, ElProgress, ElUpload, ElMessageBox, ElTooltip } from 'element-plus'
import { Upload, InfoFilled } from '@element-plus/icons-vue'
import AttachList from './attachList.vue'

const parentId = defineModel('parentId')
const moduleId = defineModel('moduleId')
const showPreview = defineModel('showPreview')
const showDelete = defineModel('showDelete')
const inAdvance = defineModel('inAdvance') // 预上传标志
const disabled = defineModel('disabled')
const emit = defineEmits(['afterUpload', 'afterDelete'])
const userStore = useUserStore()
const uploadList = ref()
const attachListRef = ref()
const data = reactive({
  uploadUrl: import.meta.env.VITE_BASIC + '/attachFileInfo/fileUpload',
  progressData: [],
  progTemp: []
})
onMounted(() => {
  if (!inAdvance.value) {
    inAdvance.value = false
  }
})
function formatToken(token) {
  return token ? `Bearer ${token}` : null
}
function fileUpload(fileInfo) {
  let file = fileInfo.file
  let fileName = file.name.substring(0, file.name.lastIndexOf('.'))

  let fileType = file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length).toLowerCase()
  if (!typeContains(fileType, 'docx') && !typeContains(fileType, 'xlsx') && !typeContains(fileType, 'rarzip7zgztar') && fileType != 'txt' && fileType != 'pdf' && !typeContains(fileType, 'pngjpgjpeggifsvg')) {
    ElMessage({ type: 'error', message: '不支持上传' + fileType + '类型的文件！' })
    return
  }
  // 检查文件大小，不能超过10MB
  if (file.size > 1024 * 1024 * 10) {
    ElMessage({ type: 'error', message: '上传的文件大小不能超过10Mb' })
    return
  }
  if (attachListRef.value.data.tableData && attachListRef.value.data.tableData.length >= 15) {
    ElMessage({ type: 'error', message: '上传的文件总数不能超过15个' })
    return
  }
  if (attachListRef.value.data.tableData && attachListRef.value.data.tableData.length > 0) {
    let allSize = file.size
    let repeat = false
    attachListRef.value.data.tableData.forEach((f) => {
      allSize += f.size
      if (f.name + '.' + f.fileType == fileName + '.' + fileType && file.size == f.size && f.loginCode == userStore.userInfo.logincode) {
        repeat = true
      }
    })
    if (repeat) {
      ElMessage({ type: 'error', message: '文件已存在，请勿重复上传！' })
      return
    }
    if (allSize > 1024 * 1024 * 100) {
      ElMessage({ type: 'error', message: '上传的所有文件总大小不能超过100Mb' })
      return
    }
  }

  let progress = {
    name: file.name,
    percent: 0,
    contenttype: fileType,
    size: file.size,
    uid: file.uid
  }
  data.progressData.push(progress)

  let params = new FormData()
  params.append('file', file)
  params.append('uid', file.uid)
  params.append('parentId', parentId.value)
  params.append('moduleId', moduleId.value)
  params.append('inAdvanceFlag', inAdvance.value)
  const accessStore = useAccessStore()

  axios({
    url: import.meta.env.VITE_BASIC + '/attachFileInfo/fileUpload',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: formatToken(accessStore.accessToken)
    },
    onUploadProgress: function (progressEvent) {
      if (progressEvent.lengthComputable) {
        uploadProgress(progressEvent, file)
      }
    },
    data: params
  }).then((rs) => {
    uploadComplate(rs, file)
  })
}
async function uploadComplate(rs, file) {
  let code = rs.data.code
  if (code == 0) {
    ElMessage({ type: 'success', message: '上传成功' })
    await attachListRef.value.queryData()
    emit('afterUpload', attachListRef.value.data.tableData)
    for (let i = 0; i < data.progressData.length; i++) {
      if (data.progressData[i].uid == file.uid) {
        data.progressData[i].status = 'success'
        data.progressData[i].percent = 100
        break
      }
    }
    // uploadList.value.scrollTop = uploadList.value.scrollHeight;
  } else {
    ElMessage({ type: 'error', message: '上传失败' })
    for (var i = 0; i < data.progressData.length; i++) {
      if (data.progressData[i].uid == file.uid) {
        data.progressData[i].status = 'exception'
        break
      }
    }
  }
  data.progTemp = data.progressData
  data.progressData = []
  data.progressData = data.progTemp
}
const uploadProgress = (event, file) => {
  let percent = parseInt((event.loaded / event.total) * 100)
  if (percent == 100) {
    percent = 99
  }
  for (var i = 0; i < data.progressData.length; i++) {
    if (data.progressData[i].uid == file.uid) {
      data.progressData[i].percent = percent
      break
    }
  }
}
function afterDelete(file) {
  for (let i = 0; i < data.progressData.length; i++) {
    const d = data.progressData[i]
    let dname = file.name.substring(0, d.name.lastIndexOf('.')) + '.' + d.contenttype
    if (dname == file.name + '.' + file.fileType && d.size == file.size) {
      data.progressData.splice(i, 1)
    }
  }
  emit('afterDelete', file)
}
function typeContains(type, types) {
  return types.indexOf(type) >= 0
}
function getAttachList() {
  return attachListRef.value.data.tableData
}
defineExpose({ getAttachList })
</script>
<style scoped>
.ifnobody {
  width: 100%;
  height: 85px;
  overflow: auto;
}

.jindu-d {
  position: relative;
  float: left;
  width: 50%;
  height: 40px;
}

.yy {
  position: absolute;
  top: 9px;
  left: 0;
  width: 26px;
  height: 26px;
  cursor: default;
  background: url('/images/attach/yy.png') center no-repeat;
}

.sp {
  position: absolute;
  top: 9px;
  left: 0;
  width: 26px;
  height: 26px;
  cursor: default;
  background: url('/images/attach/sp.png') center no-repeat;
}

.ys {
  position: absolute;
  top: 9px;
  left: 0;
  width: 26px;
  height: 26px;
  cursor: default;
  background: url('/images/attach/ys.png') center no-repeat;
}

.exe {
  position: absolute;
  top: 9px;
  left: 0;
  width: 26px;
  height: 26px;
  cursor: default;
  background: url('/images/attach/exe.png') center no-repeat;
}

.word {
  position: absolute;
  top: 9px;
  left: 0;
  width: 26px;
  height: 26px;
  cursor: default;
  background: url('/images/attach/word.png') center no-repeat;
}

.execls {
  position: absolute;
  top: 9px;
  left: 0;
  width: 26px;
  height: 26px;
  cursor: default;
  background: url('/images/attach/excel.png') center no-repeat;
}

.txt {
  position: absolute;
  top: 9px;
  left: 0;
  width: 26px;
  height: 26px;
  cursor: default;
  background: url('/images/attach/txt.png') center no-repeat;
}

.pdf {
  position: absolute;
  top: 9px;
  left: 0;
  width: 26px;
  height: 26px;
  cursor: default;
  background: url('/images/attach/pdf.png') center no-repeat;
}

.tp {
  position: absolute;
  top: 9px;
  left: 0;
  width: 26px;
  height: 26px;
  cursor: default;
  background: url('/images/attach/tp.png') center no-repeat;
}

.qt {
  position: absolute;
  top: 9px;
  left: 0;
  width: 26px;
  height: 26px;
  cursor: default;
  background: url('/images/attach/qt.png') center no-repeat;
}

.html {
  position: absolute;
  top: 9px;
  left: 0;
  width: 26px;
  height: 26px;
  cursor: default;
  background: url('/images/attach/html.png') center no-repeat;
}

.jinduttxt {
  height: 24px;
  padding-right: 20px;
  overflow: hidden;
  font-size: 12px;
  line-height: 24px;
  color: #888;
  text-indent: 31px;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: default;
}

.dianji {
  font-weight: normal;
  cursor: pointer;
}

.dianji:hover {
  text-decoration: underline;
}

.jindutiao {
  padding-left: 31px;
}

.abgh {
  cursor: pointer;
}

.primary {
  color: hsl(var(--primary));
}

.yhnb {
  color: red;
}

/* 滚动条样式 **/
div::-webkit-scrollbar {
  width: 6px;
}

div::-webkit-scrollbar-track {
  border-radius: 4px;
}

div::-webkit-scrollbar-thumb {
  border-radius: 10px;
}

.kkl-b {
  flex: 1;
  margin-left: 5px;
  border-top: 1px solid #c4dbf5;
}

.attach-table {
  width: 100%;
  height: calc(100% - 24px);
}
</style>
