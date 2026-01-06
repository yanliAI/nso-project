<template>
  <div style="width: 100%; height: 100%">
    <el-container class="h-full bg-white">
      <el-header height="40px">
        <el-form ref="form" :inline="true" :model="data.form" label-position="right" class="mt-1">
          <el-row>
            <el-col :span="4">
              <el-form-item label="补丁类型:" prop="patchType">
                <el-select v-model="data.form.patchType" filterable style="width: 150px" clearable>
                  <el-option v-for="item in dropList.NSOS_PATCH_TYPE" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="补丁名称:" prop="patchName">
                <el-input v-model="data.form.patchName" style="width: 150px" clearable> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="审核时间：" prop="approveTime">
                <el-date-picker v-model="data.form.approveTime" type="date" range-separator="-" placeholder="选择创建日期" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="版本号：" prop="patchVersion">
                <el-input v-model="data.form.patchVersion" style="width: 150px" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-button type="primary" :icon="Search" @click="query">查询</el-button>
                <el-button type="info" :icon="RefreshLeft" @click="reset">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <el-main style="height: calc(100% - 80px)">
        <el-table border ref="tab" :data="data.tableData" style="height: 100%" size="small">
          <el-table-column type="index" label="#" align="center" width="40" />
          <el-table-column type="selection" align="center" width="40" />
          <el-table-column prop="patchVersion" label="补丁版本" align="center" width="200" />
          <el-table-column prop="patchName" label="补丁名称" align="center" width="200" />
          <el-table-column prop="patchType" label="补丁类型" column-key="NSOS_PATCH_TYPE" :formatter="formatDrop" align="center" width="150" />
          <el-table-column prop="patchStatus" label="状态" column-key="NSOS_PATCH_STATUS" :formatter="formatDrop" align="center" width="150" />
          <el-table-column prop="updateRuler" label="规则" align="center" width="" />
          <el-table-column prop="relationLoophole" label="关联漏洞" align="center" width="150" />
          <el-table-column prop="approveBy" label="审核人" align="center" width="150" />
          <el-table-column prop="approveTime" label="审核时间" :formatter="tDateTimeFormat" align="center" width="150" />
          <el-table-column label="操作" align="center" width="180" fixed="right">
            <template #default="scope">
              <el-button type="primary" link size="small" @click="openDetail(scope.row)">查看</el-button>
              <el-button type="primary" link size="small" @click="downAllClick(scope.row)">下载</el-button>
              <el-button type="primary" link size="small" @click="queryRecord(scope.row.id)">浏览记录</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer height="40px">
        <el-pagination v-model:current-page="data.pageInfo.pageNo" v-model:page-size="data.pageInfo.pageSize" :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="currentChange"></el-pagination>
      </el-footer>
    </el-container>
    <Modal class="h-[650px] w-[1000px]" title="查看" :footer="false" :closeOnClickModal="false" :draggable="true">
      <FilePreview :url="data.curPreviewUrl" :fileType="data.curFileType"></FilePreview>
    </Modal>
    <ModalB class="h-[500px] w-[570px]" title="补丁详情" :footer="false" :closeOnClickModal="false" :draggable="true">
      <addDialog :selectedForm="data.selectedForm" :canOper="false" @query="query" @closeUpload="closeUpload"></addDialog>
    </ModalB>
    <ModalC class="w-[800px] h-[500px]" title="浏览记录" :footer="false" :closeOnClickModal="false" :draggable="true">
      <el-table :data="data.recordList" border size="small" style="height: 100%">
        <el-table-column type="index" width="40" label="#" align="center" />
        <el-table-column prop="processLog" label="操作日志" align="left" header-align="center" />
        <el-table-column prop="creatorName" label="操作人" align="center" width="150" />
        <el-table-column prop="createTime" label="操作时间" :formatter="tDateTimeFormat" align="center" width="150" />
      </el-table>
    </ModalC>
  </div>
</template>

<script lang="ts" setup>
import { ElTable, ElTableColumn, ElFormItem, ElForm, ElInput, ElButton, ElSelect, ElRow, ElCol, ElPagination, ElDatePicker, ElMessage, type FormInstance } from 'element-plus'
import { reactive, ref, onMounted, nextTick } from 'vue'
import { Search, RefreshLeft } from '@element-plus/icons-vue'
import { requestClient } from '#/api/request'
import axios from 'axios'
import { useVbenModal } from '@vben/common-ui'
import addDialog from './addDialog.vue'
import FilePreview from '#/views/basic/attach/filePreview.vue'
import { tDateFormat, tDateTimeFormat, formatDrop } from '#/utils/commonUtil.ts'
import { useAccessStore } from '@vben/stores'
import { useDropStore } from '#/store'

onMounted(() => {
  nextTick().then(async () => {
    const dropStore = useDropStore()
    await dropStore.initDrops(['NSOS_PATCH_TYPE', 'NSOS_PATCH_STATUS'])
    dropStore.get(dropList, ['NSOS_PATCH_TYPE', 'NSOS_PATCH_STATUS'])

    query()
  })
})
const dropList: any = reactive({})
const tab = ref()
const form = ref<FormInstance>()
const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close()
  }
})
const [ModalB, modalApiB] = useVbenModal({
  onCancel() {
    modalApiB.close()
  }
})
const [ModalC, modalApiC] = useVbenModal({
  onCancel() {
    modalApiC.close()
  }
})

const data = reactive({
  dialogShow: false,
  tableData: [],
  form: {
    patchName: '',
    patchType: '',
    approveTime: '',
    patchVersion: ''
  },
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0
  },
  curPreviewUrl: '',
  curFileType: null,
  selectedForm: null,
  recordList: []
})

interface queryParams {
  patchName: string
  patchType: string
  approveTime: string
  patchVersion: string
  pageNo: number
  pageSize: number
}

const params: queryParams = reactive({
  patchName: '',
  patchType: '',
  approveTime: '',
  patchVersion: '',
  pageNo: data.pageInfo.pageNo,
  pageSize: data.pageInfo.pageSize
})

async function getTableApi(params: queryParams) {
  return requestClient.post(import.meta.env.VITE_NSOSZH + '/patchInfo/queryPublishedData', params)
}

const query = async () => {
  params.patchName = data.form.patchName
  params.patchType = data.form.patchType
  if (data.form.approveTime) {
    params.approveTime = data.form.approveTime.getTime()
  } else {
    params.approveTime = ''
  }
  params.patchVersion = data.form.patchVersion
  const { list, pageNo, count } = await getTableApi(params)
  data.tableData = list
  data.pageInfo.pageNo = pageNo
  data.pageInfo.total = count
}

function formatToken(token) {
  return token ? `Bearer ${token}` : null
}

const download = async (row) => {
  const accessStore = useAccessStore()
  axios.defaults.headers.post['Authorization'] = formatToken(accessStore.accessToken)
  axios({
    method: 'post',
    url: import.meta.env.VITE_NSOSZH + '/patchInfo/downLoad',
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
  data.curPreviewUrl = import.meta.env.VITE_NSOSZH + '/patchInfo/preview?objectId=' + id
  data.curFileType = fileType
}

const reset = () => {
  data.form.patchName = ''
  data.form.patchType = ''
  data.form.approveTime = ''
  data.form.patchVersion = ''
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
  // const hours = String(date.getHours()).padStart(2, '0');
  // const minutes = String(date.getMinutes()).padStart(2, '0');
  // const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day}`
}

function translateType(row, column, cellValue) {
  for (let i = 0; i < data.patchType.length; i++) {
    if (data.patchType[i]?.value === cellValue) {
      return data.patchType[i]?.label
    }
  }
}

function translateStatus(row, column, cellValue) {
  for (let i = 0; i < data.patchStatus.length; i++) {
    if (data.patchStatus[i]?.value === cellValue) {
      return data.patchStatus[i]?.label
    }
  }
}

const closeUpload = () => {
  modalApiB.close()
}

const openDetail = (row) => {
  data.selectedForm = row
  requestClient.post(import.meta.env.VITE_NSOSZH + '/patchInfo/generateLog', row)
  modalApiB.open()
}

const queryRecord = async (id) => {
  let params = { params: { patchId: id } }
  data.recordList = await requestClient.get(import.meta.env.VITE_NSOSZH + '/patchInfo/queryLog', params)
  modalApiC.open()
}

const downAllClick = async (row) => {
  const parm = { params: { parentId: row.id, moduleId: 'PATCH_INFO' } }
  const response = await requestClient.get(import.meta.env.VITE_BASIC + '/attachFileInfo/queryAttachList', parm)

  if (response == null || response.length == 0) {
    ElMessage.error('没有文件可以下载！')
    return
  }

  const accessStore = useAccessStore()
  axios.defaults.headers.post['Authorization'] = formatToken(accessStore.accessToken)
  let params = { parentId: row.id, moduleId: 'PATCH_INFO' }
  axios({
    method: 'post',
    url: import.meta.env.VITE_BASIC + '/attachFileInfo/downLoadAll',
    responseType: 'blob',
    params: params
  }).then((res) => {
    var blob = new Blob([res.data], {
      type: 'application/x-msdownload;charset=UTF-8'
    })
    // 创建一个blob的对象链接
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    // 设置下载文件名
    link.setAttribute('download', '补丁附件.zip')
    document.body.appendChild(link)

    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  })
}
</script>
<style scoped>
.pb-button {
  color: #006be6;
}
</style>
