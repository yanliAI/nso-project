<template>
  <el-container class="h-full bg-white">
    <el-header height="50px">
      <el-form label-width="auto" :model="data.form" :inline="true" label-position="right" class="demo-form-inline mt-2">
        <el-row>
          <el-col :span="4">
            <el-form-item label="模板编号:" prop="templateCode">
              <el-input v-model="data.form.templateCode" clearable> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="模板名称:" prop="templateName">
              <el-input v-model="data.form.templateName" clearable> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="报表维度：" prop="dimension">
              <el-select v-model="data.form.dimension" placeholder="请选择报表维度" clearable>
                <el-option v-for="item in dropList.NSOS_REPORT_DIMENSION" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="是否启用：" prop="isEnable">
              <el-select v-model="data.form.isEnable" placeholder="请选择是否启用" clearable>
                <el-option v-for="item in dropList.NSOS_REPORT_ISENABLE" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-button type="primary" class="ml-4" :icon="Search" @click="query">查询</el-button>
              <el-button type="primary" class="ml-4" :icon="Plus" @click="add">添加模板</el-button>
              <el-button type="info" class="ml-4" :icon="RefreshLeft" @click="reset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-main style="height: calc(100% - 95px)">
      <el-table ref="scheduleListTable" :data="data.tableData" border size="small" @selection-change="handleSelectionChange" style="height: 100%" show-overflow-tooltip>
        <el-table-column type="index" label="#" align="center" width="50" />
        <el-table-column prop="templateCode" label="模板编号" align="center" width="150" />
        <el-table-column prop="templateName" label="模板名称" align="center" width="150" />
        <el-table-column prop="reportMon" label="年月" align="center" width="80">
          <template #default="scope">
            {{ scope.row.dimension === 'Y' ? dayjs(new Date(scope.row.reportMon)).format('YYYY') : dayjs(new Date(scope.row.reportMon)).format('YYYY-MM') }}
          </template>
        </el-table-column>
        <el-table-column prop="dimension" label="维度" column-key="NSOS_REPORT_DIMENSION" :formatter="formatDrop" align="center" width="80" />
        <el-table-column prop="isEnable" label="是否启用" column-key="NSOS_REPORT_ISENABLE" :formatter="formatDrop" align="center" width="80" />
        <el-table-column prop="remark" label="备注" align="left" header-align="center" />
        <el-table-column label="模板操作" align="center" width="180">
          <template #default="scope">
            <!-- <el-button link @click="downloadClick(scope.row)" class="pubp-button">下载</el-button> -->
            <el-button link type="primary" size="small" @click="edit(scope.row)">编辑</el-button>
            <el-button link type="primary" size="small" @click="genReport(scope.row)">生成报告</el-button>
            <el-button link type="danger" size="small" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer height="45px">
      <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" class="mt-1" :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="currentChange"></el-pagination>
    </el-footer>

    <Modal class="w-[900px] h-[800px]" title="模板信息" :footer="false" :closeOnClickModal="false" :draggable="true">
      <TemplateDiaLog :formData="data.selectedRow" @close="addClose" @closeDiaLog="closeDiaLog" @query="query"></TemplateDiaLog>
    </Modal>

    <ModalA class="w-[1000px] h-[650px]" title="预览" :footer="false" :closeOnClickModal="false" :draggable="true">
      <FilePreview :url="data.curPreviewUrl" :fileType="data.curFileType"></FilePreview>
    </ModalA>
  </el-container>
</template>
<script setup>
import { Page } from '@vben/common-ui'
import { Search, Delete, Plus, Download, Operation } from '@element-plus/icons-vue'
import { ElForm, ElFormItem, ElRow, ElCol, ElTable, ElTableColumn, ElPagination, ElMain, ElContainer, ElHeader, ElFooter, ElTabs, ElTabPane, ElMessageBox, ElMessage, ElDialog } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
import { requestClient } from '#/api/request'
import { useDropStore } from '#/store'
import { queryData, toExcel, generateReport } from './cmdTemplateMethod.ts'
import { useVbenModal } from '@vben/common-ui'
import TemplateDiaLog from './TemplateDiaLog.vue'
import { tDateFormat, tDateTimeFormat, formatDrop, lookFlow, formatDateTime, formatToken } from '#/utils/commonUtil.ts'
import dayjs from 'dayjs'
import { useAccessStore, useUserStore } from '@vben/stores'
import axios from 'axios'
import FilePreview from '../../basic/attach/filePreview.vue'

const userStore = useUserStore()

const dropList = reactive({})
onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = ['NSOS_USER_NAME', 'NSOS_ORG_NAME', 'NSOS_CMD_FL', 'NSOS_CMD_TYPE', 'NSOS_REPORT_DIMENSION', 'NSOS_REPORT_ISENABLE', 'NSOS_ORG_NAME_SLDW']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)
  query()
})
const scheduleListTable = ref()
const selectedRows = ref([])

const data = reactive({
  tableData: [],
  form: {},
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0
  },
  selectedRow: {},
  curPreviewUrl: null,
  curFileType: null
})

const query = async () => {
  data.form.pageSize = data.pageInfo.pageSize
  data.form.pageNo = data.pageInfo.pageNo
  const { list, pageNo, count } = await queryData(data.form)
  data.tableData = list
  data.pageInfo.pageNo = pageNo
  data.pageInfo.total = count

  formatEntity()
}

const formatEntity = () => {
  if (!data.tableData) return
  data.tableData.forEach((r) => {
    let sldw = eval(r.slDept)
    let l = ''
    if (sldw && sldw.length > 0) {
      sldw.forEach((d) => {
        dropList.NSOS_ORG_NAME.forEach((o) => {
          if (d == o.value) {
            l += o.label + '；'
          }
        })
      })
    }
    r.slDeptStr = l
  })
}

const handleSelectionChange = (val) => {
  selectedRows.value = val
}

const handleSizeChange = (val) => {
  data.pageInfo.pageSize = val
  query()
}

const currentChange = (val) => {
  data.pageInfo.pageNo = val
  query()
}

const add = () => {
  data.selectedRow = {}
  data.selectedRow.creatorId = userStore.userInfo?.logincode
  data.selectedRow.createTime = formatDateTime(new Date())
  data.selectedRow.updatorId = userStore.userInfo?.logincode
  data.selectedRow.updateTime = formatDateTime(new Date())
  modalApi.open()
}

const closeDiaLog = () => {
  modalApi.close()
}

const closeDiaLogA = () => {
  modalApiA.close()
}

const toExcelClick = async () => {
  toExcel(data.form, '指令模板维护导出excel.xlsx')
}

const edit = (row) => {
  row.createTime = formatDateTime(row.createTime)
  row.updateTime = formatDateTime(row.updateTime)
  data.selectedRow = row
  modalApi.open()
}

const xq = (row) => {
  data.selectedRow = row
  modalApiA.open()
}

const batchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要删除的数据')
    return
  }
  ElMessageBox.confirm('确定要删除这些数据吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      batchDeleteBatch()
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}

const batchDeleteOne = (row) => {
  ElMessageBox.confirm('确定要删除吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      batchDeleteOnes(row)
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}
const batchDeleteOnes = async (row) => {
  try {
    const selectedRows = ref([])
    selectedRows.value.push(row)
    await requestClient.post(import.meta.env.VITE_NSOSGZ + '/commandTemplate/deletebatchData', selectedRows.value)
    query()
    selectedRows.value = []
    ElMessage.success('删除成功！')
  } catch (error) {
    query()
    ElMessage.error('删除失败！')
  }
}

const batchDeleteBatch = async () => {
  try {
    await requestClient.post(import.meta.env.VITE_NSOSGZ + '/commandTemplate/deletebatchData', selectedRows.value)
    query()
    selectedRows.value = []
    ElMessage.success('删除成功！')
  } catch (error) {
    query()
    ElMessage.error('删除失败！')
  }
}

const reset = () => {
  data.form.templateName = ''
  data.form.templateCode = ''
  data.form.dimension = ''
  data.form.isEnable = ''
  query()
}

function formatTimestamp(row, column, cellValue) {
  return dayjs(new Date(cellValue)).format('YYYY-MM-DD HH:mm:ss')
}

function formateDimension(row, column, cellValue) {
  for (let i = 0; i < dropList.NSOS_REPORT_DIMENSION.length; i++) {
    if (cellValue === dropList.NSOS_REPORT_DIMENSION[i].value) {
      return dropList.NSOS_REPORT_DIMENSION[i].label
    }
  }
}

function formateIsEnable(row, column, cellValue) {
  for (let i = 0; i < dropList.NSOS_REPORT_ISENABLE.length; i++) {
    if (cellValue === dropList.NSOS_REPORT_ISENABLE[i].value) {
      return dropList.NSOS_REPORT_ISENABLE[i].label
    }
  }
}

function delItemApi(id) {
  return requestClient.post(import.meta.env.VITE_NSOSZH + '/reportTemplate/del', { id })
}

const del = (val) => {
  ElMessageBox.confirm('确定要删除此项吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      try {
        delItemApi(val)
        query()
        ElMessage.success('删除成功')
      } catch (error) {
        ElMessage.error('删除失败')
      }
    })
    .catch(() => {
      ElMessage.info('已取消删除')
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

const downloadClick = async (row) => {
  const parm = { params: { parentId: row.id, moduleId: null, userId: null } }
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
    params: { parentId: row.id }
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

const genReport = async (row) => {
  await generateReport(row.id)
  ElMessage.success('报表已生成！')
}
</script>
<style scoped>
.primary {
  color: hsl(var(--primary));
}

.clickable {
  cursor: pointer;
}

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

.pubp-button {
  color: #006be6;
  font-size: small;
}
</style>
