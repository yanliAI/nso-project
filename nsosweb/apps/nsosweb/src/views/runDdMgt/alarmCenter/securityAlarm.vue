<template>
  <el-container class="h-full bg-white">
    <el-header height="48px">
      <el-form label-width="auto" :model="data.formData" :inline="true" label-position="right" class="demo-form-inline mt-2">
        <el-row>
          <el-col :span="4">
            <el-form-item label="系统名称:" prop="applicationSystemName">
              <el-input v-model="data.formData.applicationSystemName" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="告警内容:" prop="alertDesc">
              <el-input v-model="data.formData.alertDesc" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="源IP:" prop="attackerIp">
              <el-input v-model="data.formData.attackerIp" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="目的IP:" prop="victimIp">
              <el-input v-model="data.formData.victimIp" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-popover :visible="data.moreVisible" placement="bottom" trigger="click" width="600px">
              <template #reference>
                <el-button type="primary" @click="data.moreVisible = !data.moreVisible" text style="margin-left: 10px; font-size: 12px">更多>></el-button>
              </template>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="告警时间:">
                    <el-date-picker v-model="data.formData.timeRange" type="datetimerange" format="YYYY-MM-DD HH:mm:ss.SSS" value-format="YYYY-MM-DD HH:mm:ss.SSS" range-separator="-" start-placeholder="开始" end-placeholder="结束" style="width: 100%" @clear="clearTime"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="模块名称:" prop="cmdbModelName">
                    <el-input v-model="data.formData.cmdbModelName" clearable />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-popover>
            <el-button type="primary" :icon="Search" @click="query">查询</el-button>
            <el-button type="primary" :icon="Share" @click="toExcelClick">导出</el-button>
            <el-button type="info" plain class="ml-4" :icon="RefreshLeft" @click="refreshClick">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-main style="height: calc(100% - 90px)">
      <el-table ref="securityAlarmTable" :data="data.tableData" border size="small" style="height: 100%" show-overflow-tooltip :row-style="setRowStyle">
        <!-- <el-table-column type="selection" align="center" /> -->
        <el-table-column type="index" label="#" align="center" fixed width="50" />
        <!-- <el-table-column prop="alertSource" label="告警来源" align="center" width="160" /> -->
        <el-table-column prop="alertName" label="告警名称" fixed align="center" width="160" />
        <el-table-column prop="alertDesc" label="告警内容" width="400" header-align="center" />
        <el-table-column prop="applicationSystemName" label="系统名称" width="160" header-align="center" />
        <el-table-column prop="cmdbModelName" label="模块名称" width="160" header-align="center" />

        <el-table-column prop="latestAlertTime" label="最新告警时间" :formatter="tDateTimeFormat" align="center" width="130" />
        <el-table-column prop="firstAlertTime" label="首次告警时间" :formatter="tDateTimeFormat" align="center" width="130" />
        <!-- <el-table-column prop="cmdbUnitName" label="所属单位" align="center" width="110" /> -->
        <el-table-column prop="attackerIp" label="源IP" align="center" width="240" />
        <el-table-column prop="victimIp" label="目的IP" align="center" width="240" />
        <!-- <el-table-column prop="severity" label="危害等级" align="center" column-key="NSOS_DANGER_LEVEL" :formatter="formatDrop" width="70" /> -->
        <el-table-column prop="attackCount" label="攻击次数" align="center" width="65" />
        <!-- <el-table-column prop="ydHandleType" label="处置状态" align="center" column-key="NSOS_YDHANDLE_TYPE" :formatter="formatDrop" width="70" /> -->
        <el-table-column label="操作" fixed="right" align="center" width="100">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="assess(scope.row)">研判</el-button>
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
      <LabelEdit :labelDesc="data.labelDesc" :assessData="data.assessData" @labelCancel="data.labelVisible = false" @labelConfirm="labelConfirm"></LabelEdit>
    </el-dialog>
    <el-dialog v-model="data.assessVisible" title="告警研判" width="20%" center>
      <div style="text-align: center">
        <!-- <el-button link type="primary" @click="toCmd(data.assessData, 1)">IP封堵</el-button> -->
        <el-button link type="primary" @click="toCmd(data.assessData, 2)">转故障</el-button>
        <el-button link type="primary" @click="editLabel(data.assessData)">转优化</el-button>
        <el-button link type="primary" @click="editLabel(data.assessData)">忽略</el-button>
        <el-button link type="primary" @click="editLabel(data.assessData)">消缺处理</el-button>
        <el-button link type="primary" @click="editLabel(data.assessData)">打标记</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>
<script setup>
import { Page } from '@vben/common-ui'
import { ElForm, ElFormItem, ElRow, ElCol, ElTable, ElTableColumn, ElPagination, ElMain, ElContainer, ElHeader, ElFooter, ElTabs, ElTabPane, ElMessageBox, ElMessage, ElDialog, ElRadioGroup, ElRadioButton } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
import { useDropStore } from '#/store'
import { tDateTimeFormat, formatDrop } from '#/utils/commonUtil.ts'
import { queryData, add, add2, toExcel } from './alarmCenterMethod.ts'
import { useVbenModal } from '@vben/common-ui'
import FaultFillIn from './faultFillIn.vue'
import LabelEdit from '/src/views/basic/common/labelEdit.vue'
import { Search, RefreshLeft, Plus, Delete, Download, Operation, Notification, Check, Tickets, Share } from '@element-plus/icons-vue'

const dropList = reactive({})
onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = ['NSOS_ORG_NAME', 'NSOS_DANGER_LEVEL', 'NSOS_YDHANDLE_TYPE']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)
  //data.formData.ydHandleType = '0';
  query()
})
const securityAlarmTable = ref()

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
  rowData: {}
})

const query = async () => {
  data.formData.pageSize = data.pageInfo.pageSize
  data.formData.pageNo = data.pageInfo.pageNo

  if (data.formData.timeRange) {
    data.formData.startTime = data.formData.timeRange[0]
    data.formData.endTime = data.formData.timeRange[1]
  } else {
    data.formData.startTime = null
    data.formData.endTime = null
  }

  const { list, pageNo, count } = await queryData(data.formData)
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

const cmdSave = async () => {
  const parm = {
    alertId: data.rowData.alertId
  }
  await add(parm)
  await add2(data.rowData)
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
  const parm = {
    notes: newLabel,
    alertId: row.alertId
  }
  await add(parm)
  await add2(row)
  await query()
}

const assess = (row) => {
  data.assessData = row
  data.assessVisible = true
}

const closeDiaLog = () => {
  modalApi.close()
}
const refreshClick = () => {
  data.formData = {}
}
const toExcelClick = () => {
  toExcel(data.formData, '告警中心导出.xlsx')
}

const setRowStyle = ({ row, rowIndex }) => {
  if (row.itemStyle) {
    return {
      backgroundColor: row.itemStyle
    }
  }
  return {}
}

defineExpose({
  query, data
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
