<template>
  <div class="h-full">
    <el-container class="h-full bg-white">
      <el-header height="50px">
        <el-form label-width="auto" :model="data.formData" :inline="true" label-position="right" class="demo-form-inline mt-2">
          <el-row class="mt-2">
            <el-col :span="4">
              <el-form-item label="班次名称:" prop="shiftName">
                <el-input v-model="data.formData.shiftName" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="值长:" prop="zzName">
                <el-input v-model="data.formData.zzName" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="调度员:" prop="ydName">
                <el-input v-model="data.formData.ydName" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="状态:" prop="state">
                <el-select v-model="data.formData.state" filterable clearable>
                  <el-option label="当值" value="Y" />
                  <el-option label="接班中" value="J" />
                  <el-option label="交班中" value="R" />
                  <el-option label="已交班" value="N" />
                  <el-option label="系统交班" value="S" />
                  <el-option label="作废" value="Z" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-popover :visible="data.moreVisible" placement="bottom" :width="600">
                <template #reference>
                  <el-button type="primary" @click="data.moreVisible = !data.moreVisible" text style="margin-left: 10px; font-size: 12px">更多>></el-button>
                </template>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="交班时间:" prop="shiftTime">
                      <el-date-picker v-model="data.formData.shiftTime" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" clearable />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="接班时间:" prop="handTime">
                      <el-date-picker v-model="data.formData.handTime" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" clearable />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="监测员:" prop="yjName">
                      <el-input v-model="data.formData.yjName" clearable />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="备注:" prop="remark">
                      <el-input v-model="data.formData.remark" clearable />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-popover>
              <el-button type="primary" :icon="Search" @click="query">查询</el-button>
              <el-button type="primary" :icon="Setting" @click="modalApiA.open()">设置当前值</el-button>
              <el-button type="info" plain class="ml-4" :icon="RefreshLeft" @click="refreshClick">重置</el-button>
              <!-- <el-button type="primary" @click="toExcelClick">导出</el-button> -->
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <el-main style="height: calc(100% - 95px)">
        <el-table ref="dutyListTable" :data="data.tableData" border size="small" style="height: 100%">
          <el-table-column type="index" label="#" align="center" width="40" />
          <el-table-column prop="shiftName" label="班次" align="center" width="150" />
          <el-table-column prop="zzName" label="值长" align="center" width="150" />
          <el-table-column prop="ydName" label="调度员" align="left" header-align="center" width="" />
          <el-table-column prop="yjName" label="监测员" align="left" header-align="center" width="" />
          <!-- <el-table-column prop="shiftSupervisor" label="值长" align="center" width="150">
            <template #default="scope">
              {{ handleOper(scope.row.shiftId, '1') }}
            </template>
          </el-table-column>
          <el-table-column prop="securityCheck" label="安全监测员" align="left" header-align="center" width="">
            <template #default="scope">
              {{ handleOper(scope.row.shiftId, '3') }}
            </template>
          </el-table-column>
          <el-table-column prop="shiftPeople" label="调度员" align="left" header-align="center" width="">
            <template #default="scope">
              {{ handleOper(scope.row.shiftId, '2') }}
            </template>
          </el-table-column> -->
          <el-table-column prop="handTime" label="接班时间" :formatter="tDateTimeFormat" align="center" width="150" />
          <el-table-column prop="shiftTime" label="交班时间" :formatter="tDateTimeFormat" align="center" width="150" />
          <el-table-column prop="state" label="状态" align="center" width="100">
            <template #default="scope">
              <div v-if="scope.row.state === 'Y'"><span class="green-dot" />&nbsp;当值</div>
              <div v-if="scope.row.state === 'R'"><span class="orange-dot" />&nbsp;接班中</div>
              <div v-if="scope.row.state === 'J'"><span class="orange-dot" />&nbsp;交班中</div>
              <div v-if="scope.row.state === 'N'"><span class="grey-dot" />&nbsp;已交班</div>
              <div v-if="scope.row.state === 'S'"><span class="red-dot" />&nbsp;系统交班</div>
              <div v-if="scope.row.state === 'Z'"><span class="red-dot" />&nbsp;作废</div>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" align="center" width="300"></el-table-column>
          <el-table-column prop="shfitLog" label="值班日志" align="center" width="80">
            <template #default="scope">
              <div class="flex justify-center clickable">
                <Document class="primary" style="width: 18px; height: 18px" @click="shiftLogClick(scope.row.shiftId)" />
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="attachInfo" label="附件" align="center" width="200">
            <template #default="scope">
              <el-button link type="primary" size="small">{{ scope.row.attachInfo }}</el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </el-main>
      <el-footer height="45px">
        <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" class="mt-1" :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="currentChange"></el-pagination>
      </el-footer>
    </el-container>

    <Modal class="w-[1400px]" title="交接班" :footer="false" :closeOnClickModal="false" :draggable="true">
      <ShiftHandoverLog :shiftId="data.selectedShiftId" @close="addClose"></ShiftHandoverLog>
    </Modal>
    <ModalA class="w-[1000px] h-[500px]" title="设置当前值" :footer="false" :closeOnClickModal="false" :draggable="true">
      <SetCurDuty @close="modalApiA.close()" @afterShiftDuty="afterShiftDuty"></SetCurDuty>
    </ModalA>
  </div>
</template>
<script setup>
import { Page } from '@vben/common-ui'
import { ElForm, ElFormItem, ElRow, ElCol, ElTable, ElTableColumn, ElPagination, ElMain, ElContainer, ElHeader, ElFooter, ElTabs, ElTabPane, ElMessageBox, ElMessage, ElDialog } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
import { useDropStore } from '#/store'
import { tDateTimeFormat, formatDrop } from '#/utils/commonUtil.ts'
import { queryData } from './dutyMgtMethod.ts'
import { useVbenModal } from '@vben/common-ui'
import { Document, Search, Setting, RefreshLeft } from '@element-plus/icons-vue'
import ShiftHandoverLog from './shiftHandoverLog.vue'
import SetCurDuty from './dialog/setCurDuty.vue'
const dropList = reactive({})
onMounted(async () => {
  query()
})
const dutyListTable = ref()

const data = reactive({
  tableData: [],
  formData: {},
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0
  },
  operList: {},
  selectedShiftId: null
})
const [ModalA, modalApiA] = useVbenModal({
  onCancel() {
    modalApiA.close()
  }
})
const query = async () => {
  data.formData.startShiftTime = data.formData.shiftTime?.[0]
  data.formData.endShiftTime = data.formData.shiftTime?.[1]
  data.formData.startHandTime = data.formData.handTime?.[0]
  data.formData.endHandTime = data.formData.handTime?.[1]
  data.formData.pageSize = data.pageInfo.pageSize
  data.formData.pageNo = data.pageInfo.pageNo

  const { dutyData } = await queryData(data.formData)
  data.tableData = dutyData.list
  data.pageInfo.pageNo = dutyData.pageNo
  data.pageInfo.total = dutyData.count
  // data.operList = operList
}
const afterShiftDuty = async () => {
  modalApiA.close()
  query()
}
const handleSizeChange = (val) => {
  data.pageInfo.pageSize = val
  query()
}

const currentChange = (val) => {
  data.pageInfo.pageNo = val
  query()
}

const toExcelClick = () => {}
const shiftLogClick = (shiftId) => {
  data.selectedShiftId = shiftId
  modalApi.open()
}
const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close()
  }
})

const handleOper = (shiftId, type) => {
  if (shiftId && data.operList.length > 0) {
    let operStr = ''
    let filterList = data.operList.filter((oper) => oper.postType === type && oper.shiftId === shiftId)
    filterList.forEach((item) => {
      operStr += item.dutyName + ','
    })
    operStr = operStr.length > 0 ? operStr.slice(0, -1) : operStr
    return operStr
  }
}
const refreshClick = () => {
  data.formData = {}
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

:deep(.el-form-item) {
  width: calc(100% - 20px);
  margin-right: 20px;
  margin-bottom: 12px;
}

:deep(.el-popper) {
  max-width: 600px !important;
}

:deep(.el-main) {
  padding: 0;
}

.red-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #f00;
  border-radius: 50%;
}

.green-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #0dc160;
  border-radius: 50%;
}

.orange-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: orange;
  border-radius: 50%;
}

.grey-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: grey;
  border-radius: 50%;
}
</style>
