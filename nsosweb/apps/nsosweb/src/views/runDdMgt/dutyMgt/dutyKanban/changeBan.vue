<template>
  <el-container class="h-full bg-white">
    <el-header height="48px">
      <el-form label-width="auto" :model="data.formData" :inline="true" label-position="right" class="demo-form-inline mt-[6px]">
        <el-row>
          <el-col :span="8">
            <el-form-item label="值班日期:" prop="dutyRiqi">
              <el-date-picker v-model="data.formData.dutyRiqi" value-format="YYYY-MM-DD" :disabled-date="disabledWcDate" type="date" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="人员名称:" prop="alertName">
              <el-input v-model="data.formData.dutyName" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" :icon="Search" @click="query">查询</el-button>
            <el-button type="info" plain class="ml-4" :icon="RefreshLeft" @click="refreshClick">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-main style="height: calc(100% - 90px)">
      <el-table ref="securityAlarmTable" :data="data.tableData" border size="small" style="height: 100%" show-overflow-tooltip>
        <el-table-column type="index" label="#" fixed align="center" width="50" />
        <el-table-column prop="dutyRiqi" label="值班日期" :formatter="tDateFormat" align="center" />
        <el-table-column prop="dutyName" label="值班人员" align="center" />
        <el-table-column prop="postType" label="岗位" column-key="NSOS_PB_POST" :formatter="formatDrop" align="center" />
        <el-table-column prop="shiftName" label="班次" align="center" />
        <el-table-column label="操作" align="center" fixed="right" width="100">
          <template #default="scope">
            <el-button v-if="scope.row.rmpCode != dutyData.rmpCode" link type="primary" size="small" @click="changeShiftClick(scope.row)">申请换班</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer height="40px">
      <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" class="mt-1" :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="currentChange"></el-pagination>
    </el-footer>
    <Modal class="w-[500px] h-[355px] top-[25vh]" title="申请换班" :footer="false" :closeOnClickModal="false" :draggable="true" headerClass="head-md">
      <table class="pb-table w-full">
        <tbody>
          <tr>
            <td width="100px"></td>
            <td align="center" class="primary">申请值</td>
            <td align="center" class="red">=></td>
            <td align="center" class="red">被申请值</td>
          </tr>
          <tr>
            <td width="100px" align="right">换班日期：</td>
            <td align="center" class="primary">{{ data.changeData.originalShiftDate }}</td>
            <td align="center" class="red">=></td>
            <td align="center" class="red">{{ data.changeData.requestedShiftDate }}</td>
          </tr>
          <tr>
            <td width="100px" align="right">换班班次：</td>
            <td align="center" class="primary">{{ data.changeData.originalShiftName }}</td>
            <td align="center" class="red">=></td>
            <td align="center" class="red">{{ data.changeData.requestedShiftName }}</td>
          </tr>
          <tr>
            <td width="100px" align="right">换班人员：</td>
            <td align="center" class="primary">{{ data.changeData.requesterEmployeeName }}</td>
            <td align="center" class="red">=></td>
            <td align="center" class="red">{{ data.changeData.requestedEmployeeName }}</td>
          </tr>
          <tr>
            <td width="100px" align="right">换班原因：</td>
            <td colspan="3"><el-input v-model="data.changeData.reason" :rows="4" maxlength="500" show-word-limit type="textarea" placeholder="请输入换班原因" clearable /></td>
          </tr>
        </tbody>
      </table>
      <!-- <el-form label-width="100px" ref="ruleFormRef" :model="data" :inline="true" label-position="right" class="demo-form-inline mt-1 w-full">
        <el-row>
          <el-col :span="24">
            <el-form-item label="换班原因:">
            </el-form-item>
          </el-col>
        </el-row>
      </el-form> -->
      <div class="text-center pt-[17px] pb-[15px]">
        <el-button type="primary" class="ml-4" :icon="Tickets" @click="initiateClick()">申请换班</el-button>
        <el-button type="info" class="ml-4" :icon="Close" @click="modalApi.close()">关闭</el-button>
      </div>
    </Modal>
  </el-container>
</template>
<script setup>
import { Page } from '@vben/common-ui'
import { ElForm, ElFormItem, ElRow, ElCol, ElTable, ElTableColumn, ElPagination, ElMain, ElContainer, ElHeader, ElFooter, ElTabs, ElTabPane, ElMessageBox, ElNotification, ElMessage, ElDialog, ElRadioGroup, ElRadioButton } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
import { useDropStore } from '#/store'
import { tDateFormat, formatDrop, formatDate } from '#/utils/commonUtil.ts'
import { requestClient } from '#/api/request'
import { Tickets, Close } from '@element-plus/icons-vue'
import { useVbenModal } from '@vben/common-ui'

const emit = defineEmits(['close','afterSubmit'])

const dutyData = defineModel('dutyData')
const minDutyDate = ref()
const dropList = reactive({})
onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = ['NSOS_PB_POST', 'NSOS_PB_SHIFT']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)
  minDutyDate.value = new Date(new Date(dutyData.value.dutyRiqi).getTime() + 24 * 60 * 60 * 1000)
  data.formData.postType = dutyData.value.postType
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
  changeReason: '',
  changeData: null
})
const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close()
  }
})
const refreshClick = () => {
  data.formData = {}
}
const query = async () => {
  data.formData.pageSize = data.pageInfo.pageSize
  data.formData.pageNo = data.pageInfo.pageNo

  data.formData.startSubmitTime = data.formData.subTime?.[0]
  data.formData.endSubmitTime = data.formData.subTime?.[1]

  const { list, pageNo, count } = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/workforceManager/queryChangeBanData', data.formData, { params: { minDutyDate: formatDate(minDutyDate.value) } })
  data.tableData = list
  data.pageInfo.pageNo = pageNo
  data.pageInfo.total = count
}

const handleSizeChange = (val) => {
  data.pageInfo.pageSize = val
  query()
}
const changeShiftClick = async (row) => {
  if (dutyData.value == null) {
    ElMessage.error('申请换班的值班数据为空！')
    return
  }
  data.changeData = {}
  data.changeData.originalId = dutyData.value.id
  data.changeData.originalShiftName = dutyData.value.shiftName
  data.changeData.originalShiftDate = dutyData.value.dutyRiqi
  data.changeData.requesterEmployeeId = dutyData.value.rmpCode
  data.changeData.requesterEmployeeName = dutyData.value.dutyName

  data.changeData.requestedId = row.id
  data.changeData.requestedShiftName = row.shiftName
  data.changeData.requestedShiftDate = formatDate(row.dutyRiqi)
  data.changeData.requestedEmployeeId = row.rmpCode
  data.changeData.requestedEmployeeName = row.dutyName

  modalApi.open()
}
const initiateClick = async () => {
  ElMessageBox.confirm('确认是否申请与【' + data.changeData.requestedShiftName + data.changeData.requestedEmployeeName + '】进行换班?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await requestClient.post(import.meta.env.VITE_NSOSGZ + '/swapRequests/applyChangeShift', data.changeData)
    modalApi.close()
    emit('close')
    emit('afterSubmit')
    ElNotification({
      title: '提示',
      message: '申请成功！',
      type: 'success'
    })
  })
}
const currentChange = (val) => {
  data.pageInfo.pageNo = val
  query()
}
const disabledWcDate = (time) => {
  return time.getTime() < minDutyDate.value - 24 * 60 * 60 * 1000
}
defineExpose({})
</script>
<style scoped>
.primary {
  color: #4266ff;
}

.red{
  color: red;
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

.el-form--inline .el-form-item {
  width: calc(100% - 20px);
  margin-right: 20px;
  margin-bottom: 12px;
}

:deep(.el-main) {
  padding: 0;
}

.pb-table {
  font-size: 14px;
  border-right: 1px solid #e4e4e7;
  border-bottom: 1px solid #e4e4e7;
}

.pb-table td {
  height: 35px;
  border-top: 1px solid #e4e4e7;
  border-left: 1px solid #e4e4e7;
}
</style>
