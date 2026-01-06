<template>
  <Page auto-content-height>
    <el-container class="h-full bg-white">
      <el-header height="48px">
        <el-form label-width="auto" :model="data.formData" :inline="true" label-position="right" class="demo-form-inline mt-2">
          <el-row>
            <el-col :span="4">
              <el-form-item label="工单号:" prop="num">
                <el-input v-model="data.formData.num" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="描述:" prop="description">
                <el-input v-model="data.formData.description" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="状态:" prop="state">
                <el-select v-model="data.formData.state" filterable clearable>
                  <el-option v-for="item in stateList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="当前节点:" prop="place">
                <el-input v-model="data.formData.place" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-popover :visible="data.moreVisible" placement="bottom" trigger="click" width="600px">
                <template #reference>
                  <el-button type="primary" @click="data.moreVisible = !data.moreVisible" text style="margin-left: 10px; font-size: 12px">更多>></el-button>
                </template>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="工单开始时间:">
                      <el-date-picker v-model="data.formData.startTime" type="datetimerange" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" range-separator="-" start-placeholder="开始" end-placeholder="结束" style="width: 100%" @clear="clearTime"></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="工单结束时间:">
                      <el-date-picker v-model="data.formData.finishTime" type="datetimerange" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" range-separator="-" start-placeholder="开始" end-placeholder="结束" style="width: 100%" @clear="clearTime"></el-date-picker>
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
          <el-table-column prop="num" label="工单号" align="center" width="180" />
          <el-table-column prop="description" label="描述" header-align="center" width="350" />
          <el-table-column prop="state" label="状态" align="center" width="150" />
          <el-table-column prop="place" label="当前节点" align="center" width="150" />
          <el-table-column prop="startTime" label="工单开始时间" :formatter="tDateTimeFormat" align="center" width="150" />
          <el-table-column prop="finishTime" label="工单结束时间" :formatter="tDateTimeFormat" align="center" width="150" />
          <el-table-column prop="updateTime" label="工单更新时间" :formatter="tDateTimeFormat" align="center" width="150" />
          <el-table-column prop="review" label="当前审批人" align="center" width="150" />
          <el-table-column prop="reviewGroup" label="审批组" align="center" width="150" />
          <el-table-column prop="creatorName" label="创建人" align="center" width="150" />
          <el-table-column prop="contact" label="联系人" align="center" width="150" />
          <!-- <el-table-column label="操作" align="center" fixed="right" width="100">
            <template #default="scope">
              <el-button link type="primary" size="small" @click="assess(scope.row)">处置</el-button>
            </template>
          </el-table-column> -->
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

const stateList = [
  { label: '工单审批中', value: '工单审批中' },
  { label: '工单已归档', value: '工单已归档' }
]

const refreshClick = () => {
  data.formData = {}
}
const query = async () => {
  data.formData.pageSize = data.pageInfo.pageSize
  data.formData.pageNo = data.pageInfo.pageNo

  data.formData.startStartTime = data.formData.startTime?.[0]
  data.formData.endStartTime = data.formData.startTime?.[1]
  data.formData.startFinishTime = data.formData.finishTime?.[0]
  data.formData.endFinishTime = data.formData.finishTime?.[1]

  const { list, pageNo, count } = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/ydAlertSheet/queryData', data.formData)
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
