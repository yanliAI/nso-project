<template>
  <Page auto-content-height>
    <el-container class="h-full bg-white">
      <el-header height="50px">
        <el-form ref="form" :inline="true" :model="data.form" label-position="right" class="demo-form-inline mt-2">
          <el-row>
            <el-col :span="6">
              <el-form-item label="报表名称:" prop="reportName">
                <el-input v-model="data.form.reportName" style="width: 250px" clearable> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-button type="primary" class="ml-4" :icon="Search" @click="query">查询</el-button>
                <el-button type="info" plain class="ml-4" :icon="RefreshLeft" @click="reset(form)">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <el-main style="height: calc(100% - 95px)">
        <el-table border ref="tab" :data="data.tableData" size="small" style="width: 100%; height: 100%">
          <el-table-column type="index" label="#" align="center" width="50" />
          <!-- <el-table-column type="selection" align="center" width="40" /> -->
          <el-table-column prop="reportMon" label="年月" align="center" width="80">
            <template #default="scope">
              {{ scope.row.dimension === 'Y' ? dayjs(new Date(scope.row.reportMon)).format('YYYY') : dayjs(new Date(scope.row.reportMon)).format('YYYY-MM') }}
            </template>
          </el-table-column>
          <el-table-column prop="dimension" label="维度" column-key="NSOS_REPORT_DIMENSION" :formatter="formatDrop" align="center" width="80" />
          <el-table-column prop="reportName" label="报表名称" align="center" width="300" />
          <el-table-column prop="generateTime" :formatter="formatTimestamp" label="生成时间" align="center" width="150" />
          <el-table-column label="操作" align="center" width="150">
            <template #default="scope">
              <el-button link @click="filePreviewClick(scope.row.templateId, 'docx')" class="pubp-button">预览</el-button>
              <el-button link @click="downloadClick(scope.row)" class="pubp-button">下载</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer height="45px">
        <el-pagination v-model:current-page="data.pageInfo.pageNo" v-model:page-size="data.pageInfo.pageSize" :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="currentChange"></el-pagination>
      </el-footer>

      <Modal class="w-[800px] h-[500px]" title="模板信息" :footer="false" :closeOnClickModal="false" :draggable="true">
        <TemplateDiaLog :formData="data.selectedRow" @close="addClose" @closeDiaLog="closeDiaLog" @query="query"></TemplateDiaLog>
      </Modal>

      <ModalA class="w-[1000px] h-[650px]" title="预览" :footer="false" :closeOnClickModal="false" :draggable="true">
        <FilePreview :url="data.curPreviewUrl" :fileType="data.curFileType"></FilePreview>
      </ModalA>
    </el-container>
  </Page>
</template>

<script lang="ts" setup>
import { ElTable, ElTableColumn, ElFormItem, ElForm, ElInput, ElButton, ElRow, ElCol, ElPagination, ElContainer, ElMessage, type FormInstance } from 'element-plus'
import { Page } from '@vben/common-ui'
import { Search, RefreshLeft } from '@element-plus/icons-vue'
import { reactive, ref, onMounted, nextTick } from 'vue'
import { requestClient } from '#/api/request'
import TemplateDiaLog from './TemplateDiaLog.vue'
import { useAccessStore, useUserStore } from '@vben/stores'
import axios from 'axios'
import FilePreview from '../../basic/attach/filePreview.vue'
import { useVbenModal } from '@vben/common-ui'
import { tDateFormat, tDateTimeFormat, formatDrop, lookFlow, formatDateTime, formatToken } from '#/utils/commonUtil.ts'
import { useDropStore } from '#/store'
import dayjs from 'dayjs'

onMounted(async () => {
  nextTick().then(() => {
    query()
  })

  const dropStore = useDropStore()
  const dropType = ['NSOS_ORG_NAME_SLDW', 'NSOS_REPORT_DIMENSION', 'NSOS_REPORT_ISENABLE', 'NSOS_USER_NAME']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)
})
const tab = ref()
const form = ref<FormInstance>()
const dropList = reactive({})

const data = reactive({
  tableData: [],
  form: {
    reportName: ''
  },
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0
  },
  selectedRow: {},
  curPreviewUrl: null,
  curFileType: null
})

interface queryParams {
  reportName: string
  pageNo: number
  pageSize: number
}

const params: queryParams = reactive({
  reportName: '',
  pageNo: data.pageInfo.pageNo,
  pageSize: data.pageInfo.pageSize
})

async function getTableApi(params: queryParams) {
  return requestClient.post(import.meta.env.VITE_NSOSZH + '/reportInfo/queryInfo', params)
}

const query = async () => {
  params.reportName = data.form.reportName
  const { list, pageNo, count } = await getTableApi(params)
  data.tableData = list
  data.pageInfo.pageNo = pageNo
  data.pageInfo.total = count
}

const reset = (form: FormInstance) => {
  if (!form) return
  form.resetFields()
  query()
}

const handleSizeChange = (val: number) => {
  data.pageInfo.pageSize = val
  params.pageSize = val
  query()
}

const currentChange = (val: number) => {
  data.pageInfo.pageNo = val
  params.pageNo = val
  query()
}

function formatTimestamp(row, column, cellValue) {
  const date = new Date(cellValue)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

function formatYear(row, column, cellValue) {
  const date = new Date(cellValue)
  const year = date.getFullYear()
  return `${year}`
}

const edit = (row) => {
  row.generateTime = formatDateTime(row.generateTime)
  const date = new Date(row.reportMon)
  const year = date.getFullYear()
  row.reportMon = formatDateTime(date.getTime())
  data.selectedRow = row
  modalApi.open()
}

const closeDiaLog = () => {
  modalApi.close()
}

const downloadClick = async (row) => {
  const parm = { params: { parentId: row.templateId, moduleId: 'customReport', userId: null } }
  const response = await requestClient.get(import.meta.env.VITE_BASIC + '/attachFileInfo/queryAttachList', parm)

  if (response == null || response.length == 0) {
    ElMessage.error('没有文件可以下载！')
    return
  }

  const accessStore = useAccessStore()
  axios.defaults.headers.post['Authorization'] = formatToken(accessStore.accessToken)
  axios({
    method: 'post',
    url: import.meta.env.VITE_BASIC + '/attachFileInfo/downLoadTwo',
    responseType: 'blob',
    params: { parentId: row.templateId, moduleId: 'customReport' }
  }).then((res) => {
    var blob = new Blob([res.data], {
      type: 'application/x-msdownload;charset=UTF-8'
    })
    // 创建一个blob的对象链接
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    // 设置下载文件名
    link.setAttribute('download', response[0].name + '.' + response[0].fileType)
    document.body.appendChild(link)

    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  })
}

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close()
  }
})

const [ModalA, modalApiA] = useVbenModal({
  onCancel() {
    modalApiA.close()
  }
})

const filePreviewClick = async (id, fileType) => {
  const parm = { params: { parentId: id, moduleId: 'customReport', userId: null } }
  const response = await requestClient.get(import.meta.env.VITE_BASIC + '/attachFileInfo/queryAttachList', parm)

  if (response == null || response.length == 0) {
    ElMessage.error('没有报表可以预览！')
    return
  }
  
  modalApiA.open()
  data.curPreviewUrl = import.meta.env.VITE_BASIC + '/attachFileInfo/preview?objectId=' + response[0].id
  data.curFileType = response[0].fileType
}

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

.pb-button {
  color: #006be6;
  font-size: small;
}

.pubp-button {
  color: #006be6;
  font-size: small;
}
</style>
