<template>
  <div class="w-full h-full">
    <el-table :data="data.tableData" size="small" style="width: 100%; height: 100%">
      <el-table-column type="index" fixed width="40" label="#" align="center" />
      <el-table-column prop="name" label="文件名称" align="left">
        <template #default="scope">
          <div class="flex items-center">
            <div v-if="typeContains(scope.row.fileType, 'xlsx')" class="file-icon execls"></div>
            <div v-else-if="typeContains(scope.row.fileType, 'mp3apewavflacwmampegogg')" class="file-icon yy"></div>
            <div v-else-if="typeContains(scope.row.fileType, 'mp4aviwmvrmvbflv')" class="file-icon sp"></div>
            <div v-else-if="typeContains(scope.row.fileType, 'rarzip7zgztar')" class="file-icon ys"></div>
            <div v-else-if="typeContains(scope.row.fileType, 'docxrtf')" class="file-icon word"></div>
            <div v-else-if="typeContains(scope.row.fileType, 'txt')" class="file-icon txt"></div>
            <div v-else-if="typeContains(scope.row.fileType, 'pdf')" class="file-icon pdf"></div>
            <div v-else-if="typeContains(scope.row.fileType, 'pngjpgjpeggifsvg')" class="file-icon tp"></div>
            <div v-else-if="typeContains(scope.row.fileType, 'htmlcssjs')" class="file-icon html"></div>
            <div v-else-if="typeContains(scope.row.fileType, 'exe')" class="file-icon exe"></div>
            <div v-else class="file-icon qt"></div>
            <div class="flex-1 ml-1">{{ scope.row.name }}.{{ scope.row.fileType }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="size" label="大小" width="80" :formatter="formatFileSize" align="center"> </el-table-column>
      <el-table-column prop="loginName" label="上传人"  width="80" align="center" />
      <!-- <el-table-column prop="dwName" label="单位" width="80" align="center"/> -->
      <el-table-column prop="createTime" label="上传时间" :formatter="tDateTimeFormat" width="130" align="center" />
      <el-table-column label="操作" :width="data.showPreview ? '80' : '60'" align="center">
        <template #default="scope">
          <div class="flex items-center">
            <div class="flex-1"></div>
            <el-tooltip content="预览" placement="bottom" effect="light">
              <View v-if="data.showPreview && judgePreview(scope.row.fileType)" class="w-[12px] h-[12px] abgh primary mr-2" @click="filePreviewClick(scope.row.id, scope.row.fileType)"></View>
            </el-tooltip>
            <el-tooltip content="下载" placement="bottom" effect="light">
              <Download class="w-[12px] h-[12px] abgh primary" @click="downloadClick(scope.row)" />
            </el-tooltip>
            <el-tooltip content="删除" placement="bottom" effect="light">
              <Delete v-if="!showDelete" class="w-[12px] h-[12px] abgh ml-2 text-[red]" @click="deleteClick(scope.row)" />
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <Modal class="w-[1000px] h-[650px]" title="预览" :footer="false" :closeOnClickModal="false" :draggable="true">
      <FilePreview :url="data.curPreviewUrl" :fileType="data.curFileType"></FilePreview>
    </Modal>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import axios from 'axios'
import { useAccessStore } from '@vben/stores'
import { ElMessage, ElTable, ElTableColumn, ElMessageBox } from 'element-plus'
import { Download, Delete, View } from '@element-plus/icons-vue'
import { requestClient } from '#/api/request'
import { tDateTimeFormat, formatDrop, formatToken } from '#/utils/commonUtil.ts'
import FilePreview from './filePreview.vue'
import { useVbenModal } from '@vben/common-ui'
import { useDropStore } from '#/store'
import { useUserStore } from '@vben/stores'

const parentId = defineModel('parentId')
const moduleId = defineModel('moduleId')
const userId = defineModel('userId')
const showPreview = defineModel('showPreview')
const showDelete = defineModel('showDelete')

const emit = defineEmits(['afterUpload', 'afterDelete'])
const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close()
  }
})
const data = reactive({
  tableData: [],
  curPreviewUrl: null,
  curFileType: null,
  showPreview: true
})
const userStore = useUserStore()
onMounted(async () => {
  if (showPreview.value == true || showPreview.value == false) {
    data.showPreview = showPreview.value
  }

  queryData()
})
watch(parentId, (newval) => {
  queryData()
})
async function queryData() {
  if (!parentId.value) {
    return
  }
  let params = { params: { parentId: parentId.value, moduleId: moduleId.value, userId: userId.value }, showmask: false }
  data.tableData = await requestClient.get(import.meta.env.VITE_BASIC + '/attachFileInfo/queryAttachList', params)
}
const filePreviewClick = (id, fileType) => {
  modalApi.open()
  data.curPreviewUrl = import.meta.env.VITE_BASIC + '/attachFileInfo/preview?objectId=' + id
  data.curFileType = fileType
}
const downloadClick = (row) => {
  const accessStore = useAccessStore()
  axios.defaults.headers.post['Authorization'] = formatToken(accessStore.accessToken)
  axios({
    method: 'post',
    url: import.meta.env.VITE_BASIC + '/attachFileInfo/downLoad',
    responseType: 'blob',
    params: { objectId: row.id }
  }).then((res) => {
    var blob = new Blob([res.data], {
      type: 'application/x-msdownload;charset=UTF-8'
    })
    // 创建一个blob的对象链接
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    // 设置下载文件名
    link.setAttribute('download', row.name + '.' + row.fileType)
    document.body.appendChild(link)

    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  })
}
const deleteClick = (row) => {
  // 网级运调中心角色可以删所有附件，其它人只能删除自己上传的附件
  let deleteRight = false
  if (userStore.userInfo && userStore.userInfo.rolecodes && userStore.userInfo.rolecodes.includes('1001')) {
    deleteRight = true
  } else {
    if (userStore.userInfo.logincode === row.loginCode) {
      deleteRight = true
    }
  }
  if (deleteRight) {
    ElMessageBox.confirm('确认是否删除?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      await requestClient.get(import.meta.env.VITE_BASIC + '/attachFileInfo/fileDelete', { params: { objectIds: row.id }, showmask: false })
      queryData()
      emit('afterUpload')
      emit('afterDelete', row)
      ElMessage({
        title: '提示',
        message: '删除成功！',
        type: 'success'
      })
    })
  } else {
    ElMessage({
      title: '提示',
      message: '您无权删除该附件！',
      type: 'warning'
    })
  }
}
function judgePreview(type) {
  if (type == 'docx' || type == 'txt' || type == 'pdf' || typeContains(type, 'pngjpgjpeggifsvg')) {
    return true
  }
  return false
}
function typeContains(type, types) {
  return types.indexOf(type) >= 0
}
function formatFileSize(row) {
  let fileSize = row.size
  if (fileSize == '-') {
    return '-'
  }
  if (fileSize == null) {
    return 0
  }
  if (fileSize < 1024) {
    return fileSize + 'B'
  } else if (fileSize < 1024 * 1024) {
    let temp = fileSize / 1024
    temp = temp.toFixed(2)
    return temp + 'KB'
  } else if (fileSize < 1024 * 1024 * 1024) {
    let temp = fileSize / (1024 * 1024)
    temp = temp.toFixed(2)
    return temp + 'M'
  } else {
    let temp = fileSize / (1024 * 1024 * 1024)
    temp = temp.toFixed(2)
    return temp + 'G'
  }
}
defineExpose({ queryData, data })
</script>
<style scoped>
.abgh {
  cursor: pointer;
}

.primary {
  color: hsl(var(--primary));
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

.file-icon {
  width: 16px;
  height: 16px;
  margin-top: -1px;
  cursor: default;
}

.yy {
  background: url('/images/attach/yy.png') center no-repeat;
  background-size: 100% 100%;
}

.sp {
  background: url('/images/attach/sp.png') center no-repeat;
  background-size: 100% 100%;
}

.ys {
  background: url('/images/attach/ys.png') center no-repeat;
  background-size: 100% 100%;
}

.exe {
  background: url('/images/attach/exe.png') center no-repeat;
  background-size: 100% 100%;
}

.word {
  background: url('/images/attach/word.png') center no-repeat;
  background-size: 100% 100%;
}

.execls {
  background: url('/images/attach/excel.png') center no-repeat;
  background-size: 100% 100%;
}

.txt {
  background: url('/images/attach/txt.png') center no-repeat;
  background-size: 100% 100%;
}

.pdf {
  background: url('/images/attach/pdf.png') center no-repeat;
  background-size: 100% 100%;
}

.tp {
  background: url('/images/attach/tp.png') center no-repeat;
  background-size: 100% 100%;
}

.qt {
  background: url('/images/attach/qt.png') center no-repeat;
}

.html {
  background: url('/images/attach/html.png') center no-repeat;
  background-size: 100% 100%;
}
</style>
