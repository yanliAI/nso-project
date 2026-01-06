<template>
  <Page auto-content-height>
    <el-container class="h-full bg-white">
      <el-container>
        <el-header height="45px">
          <el-form label-width="auto" ref="ruleFormRef" :model="data.formData" :inline="true" label-position="right" class="demo-form-inline mt-2">
            <el-row>
              <el-col :span="4">
                <el-form-item label="文档名称:" prop="fileName">
                  <el-input clearable v-model="data.formData.fileName" />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="创建人:" prop="creatorName">
                  <el-input clearable v-model="data.formData.creatorName" />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="文档目录:" prop="saveDirectory">
                  <el-select v-model="data.formData.saveDirectory" clearable filterable>
                    <el-option v-for="item in dropList.NSOS_KNOW_CONTEN" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8" class="">
                <el-button type="primary" class="ml-4" :icon="Search" @click="query">查询</el-button>
                <el-button type="info" plain class="ml-4" :icon="RefreshLeft" @click="refresh">重置</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-header>
        <el-main style="height: calc(100%-90px)">
          <el-table :data="data.tableData" border size="small" style="height: 100%; width: 100%" ref="knowledgeTab">
            <el-table-column type="index" fixed width="40" label="#" align="center" />
            <el-table-column type="selection" width="40" align="center" />
            <el-table-column prop="fileType" width="60" label="类型" align="center">
              <template #default="scope">
                <div class="flex" style="justify-content: center">
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
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="fileName" label="文件名称" align="center" />
            <el-table-column prop="remark" label="标签" align="center" />
            <el-table-column prop="creatorName" label="上传人" align="center" />
            <el-table-column prop="createTime" label="上传时间" :formatter="tDateTimeFormat" align="center" />
            <el-table-column prop="fileStatus" label="状态" column-key="NSOS_KNOWLEDGE_STATUS" :formatter="formatDrop" align="center" />
            <el-table-column prop="dataType" label="资料类型" column-key="NSOS_KNOW_DATATYPE" :formatter="formatDrop" align="center" />
            <el-table-column prop="saveDirectory" label="目录" column-key="NSOS_KNOW_CONTEN" :formatter="formatDrop" align="center" />
            <el-table-column label="操作" align="center" width="200px">
              <template #default="scope">
                <el-button type="primary" link size="small" @click="clickPreview(scope.row.id, scope.row.fileType)">查看</el-button>
                <el-button type="primary" link size="small" @click="download(scope.row)">下载</el-button>
                <el-button type="primary" link size="small" @click="examineFile(scope.row)">审核</el-button>
                <el-button type="danger" link size="small" @click="failFile(scope.row)">退回</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
        <el-footer height="45px">
          <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" class="mt-1" :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="currentChange"></el-pagination>
        </el-footer>
      </el-container>
    </el-container>

    <Modal class="h-[650px] w-[1000px]" title="预览" :footer="false" :closeOnClickModal="false" :draggable="true">
      <FilePreview :url="data.curPreviewUrl" :fileType="data.curFileType"></FilePreview>
    </Modal>
  </Page>
</template>
<script setup lang="ts">
import { Page } from '@vben/common-ui'
import { ElPagination, ElTree, ElText, ElIcon, ElContainer, ElHeader, ElMain, ElAside, ElFooter, ElRow, ElCol, ElForm, ElFormItem, ElTable, ElTableColumn, ElMessage, ElMessageBox } from 'element-plus'
import { Folder, CirclePlusFilled, FolderOpened, RefreshLeft, Search, Management, Delete, Upload, Download } from '@element-plus/icons-vue'
import { reactive, ref, onMounted } from 'vue'
import { useUserStore } from '@vben/stores'
import { tDateFormat, tDateTimeFormat, formatDrop } from '#/utils/commonUtil.ts'
import { requestClient } from '#/api/request';
import axios from 'axios'
import { useAccessStore } from '@vben/stores'
import { useVbenModal } from '@vben/common-ui'
import { queryFile, deleteFile, queryTree } from '../knowledgeMgt/knowledgeMgt.ts'
import { useDropStore } from '#/store'
import FilePreview from '../knowledgeMgt/filePreview.vue'

const dropList: any = reactive({})
const userStore = useUserStore()
const knowledgeTab = ref()

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close()
  }
})

const closeUpload = () => {
  modalApiA.close()
  query()
}

const closeContent = () => {
  modalApiB.close()
  query()
}

const data = reactive({
  catalogueNum: 0,
  tableData: [],
  treeData: [],
  treeSize: 0,
  formData: {
    fileName: null,
    creatorName: null,
    saveDirectory: null
  },
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0
  },
  catalogShow: false,
  uploadShow: false,
  curPreviewUrl: '',
  curFileType: null
})

onMounted(async () => {
  const dropStore = useDropStore()
  await dropStore.initDrops(['NSOS_KNOW_CONTEN', 'NSOS_KNOW_DATATYPE', 'NSOS_USER_NAME', 'NSOS_KNOWLEDGE_STATUS'])
  dropStore.get(dropList, ['NSOS_KNOW_CONTEN', 'NSOS_KNOW_DATATYPE', 'NSOS_USER_NAME', 'NSOS_KNOWLEDGE_STATUS'])
  query()
  let treeInfo = await queryTree()
  data.treeData = treeInfo.treeData
  data.treeSize = treeInfo.total
})

const query = async () => {
  data.formData.pageSize = data.pageInfo.pageSize
  data.formData.pageNo = data.pageInfo.pageNo
  data.formData.fileStatus = '0'
  const { list, count, pageNo } = await queryFile(data.formData)
  data.tableData = list
  data.pageInfo.pageNo = pageNo
  data.pageInfo.total = count
}

const download = async (row) => {
  const accessStore = useAccessStore()
  axios.defaults.headers.post['Authorization'] = formatToken(accessStore.accessToken)
  axios({
    method: 'post',
    url: import.meta.env.VITE_NSOSZH + '/knowAttachment/downLoad',
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
    // 设置下载文件名item
    link.setAttribute('download', row.fileName + '.' + row.fileType)
    document.body.appendChild(link)

    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  })
}

const clickPreview = (id, fileType) => {
  modalApi.open()
  data.curPreviewUrl = import.meta.env.VITE_NSOSZH + '/knowAttachment/preview?objectId=' + id
  data.curFileType = fileType
}

const examineFile = async(row) => {
  await requestClient.post(import.meta.env.VITE_NSOSZH + '/knowAttachment/examineFile',row)
  query()
}

const failFile = async(row) => {
  await requestClient.post(import.meta.env.VITE_NSOSZH + '/knowAttachment/failFile',row)
  query()
}

function formatToken(token) {
  return token ? `Bearer ${token}` : null
}

function typeContains(type, types) {
  return types.indexOf(type) >= 0
}

const handleSizeChange = (val: number) => {
  data.pageInfo.pageSize = val
  query()
}

const currentChange = (val: number) => {
  data.pageInfo.pageNo = val
  query()
}

const switchCatalog = (isOpen: boolean) => {
  data.catalogShow = isOpen
}

const switchUpload = () => {
  modalApiA.open()
}

const refresh = () => {
  data.formData.fileName = ''
  data.formData.creatorName = ''
  data.formData.saveDirectory = ''
  query()
}
</script>
<style lang="css" scoped>
.demo-form-inline .el-input {
  --el-input-width: 100%;
}

.demo-form-inline .el-select {
  --el-select-width: 100%;
}

:deep(.el-date-editor.el-input, .el-date-editor.el-input__wrapper) {
  width: 100%;
}

:deep(.el-form--inline .el-form-item) {
  width: calc(100% - 20px);
  margin-right: 20px;
  margin-bottom: 12px;
}

:deep(.el-main) {
  padding: 0;
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
