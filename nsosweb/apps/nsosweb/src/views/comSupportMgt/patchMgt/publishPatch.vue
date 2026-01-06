<template>
  <div style="width: 100%; height: 100%">
    <el-container class="h-full bg-white">
      <el-header height="80px">
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
            <el-col :span="4">
              <el-form-item label="发布时间：" prop="issueTime">
                <el-date-picker v-model="data.form.issueTime" type="date" range-separator="-" placeholder="选择创建日期" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-button type="primary" class="ml-4" :icon="Search" @click="query">查询</el-button>
                <el-button type="info" class="ml-4" :icon="RefreshLeft" @click="reset">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">
              <el-form-item>
                <el-button type="primary" class="publish-button" :icon="Plus" @click="add()">发布新补丁</el-button>
                <el-button type="primary" class="publish-button" :icon="View" @click="review()">审核</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <el-main style="height: calc(100% - 120px)">
        <el-table border ref="tab" :data="data.tableData" style="height: 100%" size="small">
          <el-table-column type="index" label="#" align="center" width="40" />
          <el-table-column type="selection" align="center" width="40" />
          <el-table-column prop="patchVersion" label="补丁版本" align="center" width="200" />
          <el-table-column prop="patchName" label="补丁名称" align="center" width="200" />
          <el-table-column prop="patchType" label="补丁类型" column-key="NSOS_PATCH_TYPE" :formatter="formatDrop" align="center" width="150" />
          <el-table-column prop="patchStatus" label="状态" column-key="NSOS_PATCH_STATUS" :formatter="formatDrop" align="center" width="150" />
          <el-table-column prop="updateRuler" label="规则" align="center" width="" />
          <el-table-column prop="relationLoophole" label="关联漏洞" align="center" width="150" />
          <el-table-column prop="issuedBy" label="发布人" align="center" width="150" />
          <el-table-column prop="issueTime" label="发布时间" :formatter="tDateTimeFormat" align="center" width="150" />
          <el-table-column label="操作" align="center" width="210" fixed="right">
            <template #default="scope">
              <el-button type="primary" link size="small" @click="openDetail(scope.row)">查看</el-button>
              <el-button type="primary" link size="small" @click="downAllClick(scope.row)" :disabled="scope.row.patchStatus === '0'">下载</el-button>
              <!-- <el-button type="primary" link size="small" @click="release(scope.row)" :disabled="scope.row.patchStatus !== '0'">发布</el-button> -->
              <el-button type="primary" link size="small" @click="queryRecord(scope.row.id)">浏览记录</el-button>
              <el-button type="danger" link size="small" @click="del(scope.$index)" :disabled="scope.row.patchStatus !== '0'">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer height="40px">
        <el-pagination v-model:current-page="data.pageInfo.pageNo" v-model:page-size="data.pageInfo.pageSize" :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="currentChange"></el-pagination>
      </el-footer>
    </el-container>
    <Modal class="h-[500px] w-[570px]" title="补丁详情" :footer="false" :closeOnClickModal="false" :draggable="true">
      <addDialog :selectedForm="data.selectedForm" :canOper="data.canOper" @query="query" @closeUpload="closeUpload"></addDialog>
    </Modal>
    <ModalB class="h-[650px] w-[1000px]" title="查看" :footer="false" :closeOnClickModal="false" :draggable="true">
      <FilePreview :url="data.curPreviewUrl" :fileType="data.curFileType"></FilePreview>
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
import { ElTable, ElTableColumn, ElFormItem, ElForm, ElInput, ElButton, ElSelect, ElRow, ElCol, ElPagination, ElMessage, ElMessageBox, ElDatePicker, ElNotification, ElMain, ElContainer, ElHeader, ElFooter, type FormInstance } from 'element-plus'
import { Plus, View, Search, RefreshLeft } from '@element-plus/icons-vue'
import { tDateTimeFormat, formatDrop } from '#/utils/commonUtil.ts'
import { reactive, ref, onMounted, nextTick } from 'vue'
import { requestClient } from '#/api/request'
import addDialog from './addDialog.vue'
import FilePreview from '#/views/basic/attach/filePreview.vue'
import axios from 'axios'
import { useVbenModal } from '@vben/common-ui'
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
    issueTime: '',
    patchStatus: ''
  },
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0
  },
  curPreviewUrl: '',
  curFileType: null,
  selectedForm: null,
  canOper: null,
  recordList: []
})

interface queryParams {
  patchName: string
  patchType: string
  issueTime: string
  patchStatus: string
  pageNo: number
  pageSize: number
}

const params: queryParams = reactive({
  patchName: '',
  patchType: '',
  issueTime: '',
  patchStatus: '',
  pageNo: data.pageInfo.pageNo,
  pageSize: data.pageInfo.pageSize
})

async function getTableApi(params: queryParams) {
  return requestClient.post(import.meta.env.VITE_NSOSZH + '/patchInfo/query', params)
}

const query = async () => {
  params.patchName = data.form.patchName
  params.patchType = data.form.patchType
  if (data.form.issueTime) {
    params.issueTime = data.form.issueTime.getTime()
  } else {
    params.issueTime = data.form.issueTime
  }
  params.patchStatus = data.form.patchStatus
  const { list, pageNo, count } = await getTableApi(params)
  data.tableData = list
  data.pageInfo.pageNo = pageNo
  data.pageInfo.total = count
}

const reset = () => {
  data.form.patchName = ''
  data.form.patchType = ''
  data.form.issueTime = ''
  data.form.patchStatus = ''
  query()
}

async function reviewApi(params: Object[]) {
  return requestClient.post(import.meta.env.VITE_NSOSZH + '/patchInfo/review', params)
}

const review = async () => {
  if (tab.value.getSelectionRows().length === 0) {
    ElMessage.warning('请先选择要审核的补丁')
    return
  }

  tab.value.getSelectionRows().forEach((t) => {
    console.log(t)
  })

  await ElMessageBox.confirm('确定要审核这些补丁吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await reviewApi(tab.value.getSelectionRows())
      query()
    })
    .catch(() => {
      ElMessage.info('已取消')
    })
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
  modalApiB.open()
  data.curPreviewUrl = import.meta.env.VITE_NSOSZH + '/patchInfo/preview?objectId=' + id
  data.curFileType = fileType
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
  modalApi.close()
}

const add = () => {
  data.selectedForm = {}
  data.canOper = true
  modalApi.open()
}

const openDetail = (row) => {
  data.selectedForm = row
  data.canOper = row.patchStatus === '0' ? true : false
  requestClient.post(import.meta.env.VITE_NSOSZH + '/patchInfo/generateLog', row)
  modalApi.open()
}

const release = async (row) => {
  ElMessageBox.confirm('确认是否发布选中的记录? ', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await requestClient.post(import.meta.env.VITE_NSOSZH + '/patchInfo/release', row)
    query()
    ElNotification({
      title: '提示',
      message: '发布成功！',
      type: 'success'
    })
  })
}

const del = (index) => {
  let ids = data.tableData[index].id
  ElMessageBox.confirm('确认是否删除选中的记录? ', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    if (ids != '') {
      await requestClient.get(import.meta.env.VITE_NSOSZH + '/patchInfo/deletePatch', { params: { ids: ids } })
    }
    ElNotification({
      title: '提示',
      message: '删除成功！',
      type: 'success'
    })
    data.tableData.splice(index, 1)
  })
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
.pubp-button {
  color: #006be6;
}
</style>
