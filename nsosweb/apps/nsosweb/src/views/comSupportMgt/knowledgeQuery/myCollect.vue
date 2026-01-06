<template>
  <el-container class="h-full bg-white">
    <el-header height="45px">
      <el-form label-width="auto" ref="ruleFormRef" :model="data.formData" :inline="true" label-position="right" class="demo-form-inline">
        <el-row>
          <el-col :span="4">
            <el-form-item label="文件名称:">
              <el-input v-model="data.formData.fileName" clearable />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="4">
            <el-form-item label="文件ID:">
              <el-input v-model="data.formData.id" clearable />
            </el-form-item>
          </el-col> -->
          <el-col :span="4">
            <!-- <el-form-item label="资料类型:" filterable>
              <el-select v-model="data.formData.dataType" @focus="queryDataType" clearable>
                <el-option v-for="item in dataTypeList" :key="item" :value="item" />
              </el-select>
            </el-form-item> -->
            <el-form-item label="资料类型:" prop="dataType">
              <el-select v-model="data.formData.dataType" clearable filterable>
                <el-option v-for="item in dropList.NSOS_KNOW_DATATYPE" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="4">
            <el-form-item label="所属专业:" filterable>
              <el-select v-model="data.formData.major" clearable>
                <el-option v-for="item in dropList.NSOS_COMMAND_STATE" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="4">
            <el-form-item label="标签:">
              <el-input v-model="data.formData.remark" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4" class="">
            <el-button type="primary" class="ml-4" :icon="Search" @click="query">查询</el-button>
            <el-button type="info" plain class="ml-4" :icon="RefreshLeft" @click="refreshClick">重置</el-button>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="4">
            <el-form-item label="标签:">
              <el-input v-model="data.formData.label" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="最后更新人:">
              <el-input v-model="data.formData.updatorId" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="创建时间:">
              <el-date-picker v-model="data.formData.createTime" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" clearable/>
            </el-form-item>
          </el-col>
        </el-row> -->
      </el-form>
    </el-header>
    <el-main style="height: calc(100% - 90px)">
      <el-table :data="data.tableData" border size="small" style="height: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="index" fixed width="30" label="#" align="center" />
        <el-table-column type="selection" width="40" align="center" />
        <el-table-column prop="fileType" label="类型" width="60" align="center">
          <template #default="scope">
            <div class="flex items-center" style="justify-content: center">
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
        <el-table-column prop="remark" label="标签" width="150" align="center" />
        <el-table-column prop="creatorName" label="上传人" width="150" align="center" />
        <el-table-column prop="createTime" label="上传时间" :formatter="tDateTimeFormat" width="300" align="center" />
        <el-table-column prop="fileStatus" column-key="NSOS_KNOWLEDGE_STATUS" :formatter="formatDrop" label="状态" width="150" align="center" />
        <el-table-column prop="dataType" column-key="NSOS_KNOW_DATATYPE" :formatter="formatDrop" label="资料类型" width="150" align="center" />
        <el-table-column prop="saveDirectory" column-key="NSOS_KNOW_CONTEN" :formatter="formatDrop" label="目录" width="200" align="center" />
        <el-table-column label="操作" width="200" align="center">
          <template #default="scope">
            <el-button type="primary" link size="small" @click="preview(scope.row.id, scope.row.fileType)">查看</el-button>
            <el-button type="primary" link size="small" @click="download(scope.row)">下载</el-button>
            <el-button type="primary" v-if="scope.row.isCollect === 'N'" link size="small" @click="collectFile(scope.row)">收藏</el-button>
            <el-button type="primary" v-if="scope.row.isCollect === 'Y'" link size="small" @click="cancleCollect(scope.row)">取消收藏</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer height="45px">
      <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" class="mt-1" :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="currentChange"></el-pagination>
    </el-footer>
  </el-container>
  <Modal class="h-[650px] w-[1000px]" title="预览" :footer="false" :closeOnClickModal="false" :draggable="true">
    <FilePreview :url="data.curPreviewUrl" :fileType="data.curFileType"></FilePreview>
  </Modal>
</template>
<script setup>
import { Page } from '@vben/common-ui'
import { onMounted, reactive, ref } from 'vue'
import { ElForm, ElFormItem, ElRow, ElCol, ElTable, ElTableColumn, ElPagination, ElMain, ElContainer, ElHeader, ElFooter, ElTabs, ElTabPane } from 'element-plus'
import { Search, RefreshLeft, Plus, Download } from '@element-plus/icons-vue'
import { tDateFormat, tDateTimeFormat, formatDrop } from '#/utils/commonUtil.ts'
import { useDropStore } from '#/store'
import { requestClient } from '#/api/request'
import axios from 'axios'
import { useAccessStore } from '@vben/stores'
import { queryData, toExcel } from './kQMethod.ts'
import { useVbenModal } from '@vben/common-ui'
import FilePreview from './filePreview.vue'

const selectedRows = ref([])
const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close()
  }
})
const data = reactive({
  tableData: [],
  formData: {},
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0
  },
  curPreviewUrl: '',
  curFileType: null
})
const dropList = reactive({})
const contentList = ref([])
const dataTypeList = ref([])
const emit = defineEmits(['addTab', 'setPreview'])

const preview = async (id, fileType) => {
  // await emit('setPreview', id, fileType)
  // emit('addTab')
  modalApi.open()
  data.curPreviewUrl = import.meta.env.VITE_NSOSZH + '/knowAttachment/preview?objectId=' + id
  data.curFileType = fileType
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

const collectFile = async (row) => {
  await requestClient.post(import.meta.env.VITE_NSOSZH + '/knowAttachment/collectFile', row)
  query()
}

const cancleCollect = async (row) => {
  await requestClient.post(import.meta.env.VITE_NSOSZH + '/knowAttachment/cancleCollect', row)
  query()
}

function formatToken(token) {
  return token ? `Bearer ${token}` : null
}
onMounted(async () => {
  //query()
  const dropStore = useDropStore()
  const dropType = ['NSOS_KNOWLEDGE_STATUS', 'NSOS_KNOW_DATATYPE', 'NSOS_KNOW_CONTEN']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)
  query()
})

const query = async () => {
  data.formData.pageSize = data.pageInfo.pageSize
  data.formData.pageNo = data.pageInfo.pageNo
  data.formData.isCollect = 'Y'
  const response = await requestClient.post(import.meta.env.VITE_NSOSZH + '/knowAttachment/queryDataMH', data.formData)
  data.tableData = response.list
  data.pageInfo.pageNo = response.pageNo
  data.pageInfo.total = response.count
  queryContent()
  queryDataType()
}

const queryContent = async () => {
  const response = await requestClient.post(import.meta.env.VITE_NSOSZH + '/knowContensInfo/queryContent2')
  contentList.value = response
  //console.log(contentList[0])
}

const queryDataType = async () => {
  const response = await requestClient.post(import.meta.env.VITE_NSOSZH + '/knowDataType/queryDataType2')
  dataTypeList.value = response
}

const refreshClick = () => {
  data.formData = {}
  query()
}

const toExcelClick = async () => {
  data.formData.pageSize = data.pageInfo.pageSize
  data.formData.pageNo = data.pageInfo.pageNo
  //toExcel(data.formData, '指令管理导出excel.xlsx')
}

const handleSizeChange = (val) => {
  data.pageInfo.pageSize = val
  query()
}

const currentChange = (val) => {
  data.pageInfo.pageNo = val
  query()
}
const handleSelectionChange = (val) => {
  selectedRows.value = val
}
function typeContains(type, types) {
  return types.indexOf(type) >= 0
}
defineExpose({
  query
})
</script>
<style scoped>
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

.primary {
  color: hsl(var(--primary));
}

.cmdcode {
  cursor: pointer;
}

.cmdcode:hover {
  text-decoration: underline;
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
