<template>
  <Page auto-content-height>
    <el-container class="h-full bg-white">
      <el-header height="48px">
        <el-form label-width="auto" :model="data.formData" :inline="true" label-position="right" class="demo-form-inline mt-2">
          <el-row>
            <el-col :span="4">
              <el-form-item label="资源类型:" prop="resourceTypeName">
                <el-input v-model="data.formData.resourceTypeName" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="资源名称:" prop="resourceName">
                <el-input v-model="data.formData.resourceName" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="紧急程度:" prop="priorityId">
                <el-select v-model="data.formData.priorityId" filterable clearable>
                  <el-option v-for="item in priorityType" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="告警信息:" prop="content">
                <el-input v-model="data.formData.content" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-popover :visible="data.moreVisible" placement="bottom" trigger="click" width="600px">
                <template #reference>
                  <el-button type="primary" @click="data.moreVisible = !data.moreVisible" text style="margin-left: 10px; font-size: 12px">更多>></el-button>
                </template>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="告警发生时间:">
                      <el-date-picker v-model="data.formData.alarmTime" type="datetimerange" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" range-separator="-" start-placeholder="开始" end-placeholder="结束" style="width: 100%" @clear="clearTime"></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="最后告警时间:">
                      <el-date-picker v-model="data.formData.lastAlarmTime" type="datetimerange" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" range-separator="-" start-placeholder="开始" end-placeholder="结束" style="width: 100%" @clear="clearTime"></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-popover>
              <el-button type="primary" :icon="Search" @click="query">查询</el-button>
              <el-button type="info" plain class="ml-4" :icon="RefreshLeft" @click="refreshClick">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <el-main style="height: calc(100% - 90px)">
        <el-table ref="securityAlarmTable" :data="data.tableData" border size="small" style="height: 100%" show-overflow-tooltip>
          <el-table-column type="index" label="#" fixed align="center" width="50" />
          <el-table-column prop="id" label="索引id" align="center" width="150" />
          <el-table-column prop="source" label="告警来源" align="center" width="150" />
          <el-table-column prop="resourceTypeName" label="资源类型" align="center" width="150" />
          <el-table-column prop="resourceName" label="资源名称" align="center" width="150" />
          <el-table-column prop="metric" label="指标名称" align="center" width="150" />
          <el-table-column prop="priorityId" label="紧急程度" align="center" width="120">
            <template #default="scope">
              {{ priorityType.filter((d) => d.value == scope.row.priorityId)[0]?.label }}
            </template>
          </el-table-column>
          <el-table-column prop="alarmTime" label="告警发生时间" :formatter="tDateTimeFormat" align="center" width="150" />
          <el-table-column prop="lastAlarmTime" label="最后告警时间" :formatter="tDateTimeFormat" align="center" width="150" />
          <el-table-column prop="content" label="告警信息" header-align="center" width="350" />
          <el-table-column prop="metricValue" label="触发值" align="center" width="150" />
          <el-table-column prop="alarmCount" label="告警次数" align="center" width="120" />
          <el-table-column prop="dealStatus" label="处理状态" align="center" width="120" />
          <el-table-column prop="status" label="状态" align="center" width="120" />
          <el-table-column prop="duration" label="持续时长" align="center" width="120" />
          <el-table-column prop="durationTime" label="持续时长（s）" align="center" width="150" />
          <el-table-column prop="alarmContentDetail" label="告警明细" header-align="center" width="350" />
          <el-table-column label="操作" align="center" fixed="right" width="100">
            <template #default="scope">
              <el-button link type="primary" size="small" @click="assess(scope.row)">处置</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer height="45px">
        <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" class="mt-1" :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="currentChange"></el-pagination>
      </el-footer>

      <Modal class="w-[1200px]" title="转故障" :footer="false" :closeOnClickModal="false" :draggable="true">
        <FaultFillIn :formData="data.assessData" :rowData="data.rowData" @cmdSave="cmdSave" @close="addClose" @closeDiaLog="closeDiaLog" @query="query"></FaultFillIn>
      </Modal>

      <el-dialog v-model="data.labelVisible" title="标签填报" width="30%" center>
        <LabelEdit :labelDesc="data.assessData.remark" :assessData="data.assessData" @labelCancel="data.labelVisible = false" @labelConfirm="labelConfirm"></LabelEdit>
      </el-dialog>
      <el-dialog v-model="data.assessVisible" title="告警研判" width="20%" center>
        <div style="text-align: center">
          <!-- <el-button link type="primary" @click="toCmd(data.assessData, 1)">IP封堵</el-button> -->
          <el-button link type="primary" @click="toCmd(data.assessData, 2)">转故障</el-button>
          <el-button link type="primary" @click="editLabel(data.assessData)">打标记</el-button>
        </div>
      </el-dialog>
    </el-container>
  </Page>
</template>
<script setup>
import { Page } from '@vben/common-ui'
import { ElForm, ElFormItem, ElRow, ElCol, ElTable, ElTableColumn, ElPagination, ElMain, ElContainer, ElHeader, ElFooter, ElTabs, ElTabPane, ElMessageBox, ElNotification, ElMessage, ElDialog, ElRadioGroup, ElRadioButton } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
import { useDropStore } from '#/store'
import { tDateTimeFormat, formatDrop } from '#/utils/commonUtil.ts'
import { requestClient } from '#/api/request'
import { useVbenModal } from '@vben/common-ui'
import FaultFillIn from '../faultFillIn.vue'
import LabelEdit from '/src/views/basic/common/labelEdit.vue'
import { Search, RefreshLeft, Plus, Delete, Download, Operation, Notification, Check, Tickets, Share } from '@element-plus/icons-vue'

const dropList = reactive({})
onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = []
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)
  //data.formData.ydHandleType = '0';
  query()
})
const securityAlarmTable = ref()

const [ModalA, modalApiA] = useVbenModal({
  onCancel() {
    modalApiA.close()
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
  faultData: {},
  labelVisible: false,
  labelDesc: '',
  assessVisible: false,
  assessData: {},
  rowData: {},
  curAlert: null
})

const priorityType = [
  { label: '紧急', value: '1' },
  { label: '重要', value: '2' },
  { label: '一般', value: '3' }
]

const refreshClick = () => {
  data.formData = {}
}
const query = async () => {
  data.formData.pageSize = data.pageInfo.pageSize
  data.formData.pageNo = data.pageInfo.pageNo

  data.formData.startAlarmTime = data.formData.alarmTime?.[0]
  data.formData.endSubmitTime = data.formData.alarmTime?.[1]
  data.formData.startLastAlarmTime = data.formData.lastAlarmTime?.[0]
  data.formData.endLastAlarmTime = data.formData.lastAlarmTime?.[1]

  const { list, pageNo, count } = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/ydRunningAlarm/queryData', data.formData)
  data.tableData = list
  data.pageInfo.pageNo = pageNo
  data.pageInfo.total = count
}

const handleSizeChange = (val) => {
  data.pageInfo.pageSize = val
  query()
}

const currentChange = (val) => {
  data.pageInfo.pageNo = val
  query()
}

const toCmd = async (val, type) => {
  data.assessVisible = false
  data.rowData = val
  modalApi.open()
  //await add2(val);
  //await query()
}

const cmdSave = async (faultCode) => {
  try {
    await requestClient.get(import.meta.env.VITE_NSOSGZ + '/fullLinkAlert/addFaultCode', { params: { id: data.rowData.id, faultCode: faultCode } })
  } catch {
    return
  }

  await query()
}

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close()
  }
})
const editLabel = (row) => {
  data.labelVisible = true
}
const labelConfirm = (newLabel, row) => {
  // 调用保存方法
  saveLabel(newLabel.value, row.value)
  data.labelVisible = false
  data.assessVisible = false
}

const saveLabel = async (newLabel, row) => {
  try {
    await requestClient.get(import.meta.env.VITE_NSOSGZ + '/fullLinkAlert/addTag', { params: { id: row.id, tag: newLabel } })

    ElNotification({
      title: '提示',
      message: '标记成功！',
      type: 'success'
    })
  } catch {
    ElMessage.error('标记失败！')
    return
  }
  await query()
}

const assess = (row) => {
  data.assessData = row
  data.assessVisible = true
}
const closeDiaLog = () => {
  modalApi.close()
}

const toExcelClick = () => {
  toExcel(data.formData, '告警中心导出.xlsx')
}

defineExpose({
  query
})
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

/* 基础样式：所有按钮默认无圆角 */
:deep(.el-radio-button__inner) {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-width: 80px;
  height: 32px !important;
  padding: 0;
  margin-right: 15px;
  color: #666;
  text-align: center;
  background-color: #f0f2f6;
  border-radius: 0 !important;
  transition: none !important;
}

/* 选中状态的按钮样式 */
:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  height: 32px !important;
  margin: 0;
  margin-right: 15px;
  color: #3e7eff !important;
  background-color: #fff !important;
  border-radius: 5px !important;
  box-shadow: none !important;
  transition: none !important;
}

:deep(.el-radio-button__inner:hover) {
  color: #3e7eff;
}

:deep(.el-radio-button__inner) {
  border: none !important;
}

.radio-bg {
  display: flex;
  justify-content: center;
  width: 300px;
  height: 40px;
  background-color: #f0f2f6;
  border-radius: 5px;
}
</style>
