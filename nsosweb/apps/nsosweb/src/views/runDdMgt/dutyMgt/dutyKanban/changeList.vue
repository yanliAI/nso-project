<template>
  <el-container class="h-full bg-white">
    <el-header height="48px">
      <el-form label-width="auto" :model="data.formData" :inline="true" label-position="right" class="demo-form-inline mt-2">
        <el-row>
          <el-col :span="5">
            <el-form-item label="工单编码:" prop="alertCode">
              <el-input v-model="data.formData.swapCode" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="被申请值值班日期:" prop="alertName">
              <el-date-picker v-model="data.formData.requestedShiftDate" value-format="YYYY-MM-DD" type="date" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="被申请值值班人员:" prop="handleStatus">
              <el-input v-model="data.formData.requestedEmployeeName" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="状态:" filterable>
              <el-select v-model="data.formData.status" filterable clearable>
                <el-option v-for="item in chStatus" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-popover :visible="data.moreVisible" placement="bottom" trigger="click" width="600px">
              <template #reference>
                <el-button type="primary" @click="data.moreVisible = !data.moreVisible" text style="margin-left: 10px; font-size: 12px">更多>></el-button>
              </template>
              <el-row>
                <el-col :span="12">
                  <el-col :span="5">
                    <el-form-item label="申请值值班日期:" prop="alertCode">
                      <el-date-picker v-model="data.formData.originalShiftDate" value-format="YYYY-MM-DD" type="date" clearable />
                    </el-form-item>
                  </el-col>
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
        <el-table-column prop="swapCode" label="工单编码" align="center" />
        <el-table-column prop="originalShiftDate" label="申请值值班日期" :formatter="tDateFormat" align="center" />
        <el-table-column prop="originalShiftName" label="申请值值班班次" align="center" />
        <el-table-column prop="requesterEmployeeName" label="申请值值班人员" align="center" />
        <el-table-column prop="requestedShiftDate" label="被申请值值班日期" :formatter="tDateFormat" align="center" />
        <el-table-column prop="requestedShiftName" label="被申请值值班班次" align="center" />
        <el-table-column prop="requestedEmployeeName" label="被申请值值班人员" align="center" />
        <el-table-column prop="status" label="状态" align="center">
          <template #default="scope">
            <span v-if="scope.row.status == 'P'" class="text-[#4266ff]">{{ chStatus.filter((d) => d.value == scope.row.status)[0]?.label }}</span>
            <span v-if="scope.row.status == 'A'" class="text-[#2fb445]">{{ chStatus.filter((d) => d.value == scope.row.status)[0]?.label }}</span>
            <span v-if="scope.row.status == 'R'" class="text-[red]">{{ chStatus.filter((d) => d.value == scope.row.status)[0]?.label }}</span>
            <span v-if="scope.row.status == 'C'">{{ chStatus.filter((d) => d.value == scope.row.status)[0]?.label }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="200">
          <template #default="scope">
            <el-button v-if="scope.row.status == 'P' && scope.row.requestedEmployeeId == userStore.userInfo.logincode" link type="primary" size="small" @click="assess(scope.row.id, 'A', '同意')">同意</el-button>
            <el-button v-if="scope.row.status == 'P' && scope.row.requesterEmployeeId == userStore.userInfo.logincode" link type="primary" size="small" @click="assess(scope.row.id, 'C', '取消')">取消</el-button>
            <el-button v-if="scope.row.status == 'P' && scope.row.requestedEmployeeId == userStore.userInfo.logincode" link type="primary" size="small" @click="assess(scope.row.id, 'R', '拒绝')">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer height="45px">
      <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" class="mt-1" :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="currentChange"></el-pagination>
    </el-footer>
  </el-container>
</template>
<script setup>
import { Page } from '@vben/common-ui'
import { ElForm, ElFormItem, ElRow, ElCol, ElTable, ElTableColumn, ElPagination, ElMain, ElContainer, ElHeader, ElFooter, ElTabs, ElTabPane, ElMessageBox, ElNotification, ElMessage, ElDialog, ElRadioGroup, ElRadioButton } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
import { useDropStore } from '#/store'
import { useUserStore } from '@vben/stores'
import { tDateFormat, formatDrop } from '#/utils/commonUtil.ts'
import { requestClient } from '#/api/request'
import { useVbenModal } from '@vben/common-ui'
import { Search, RefreshLeft } from '@element-plus/icons-vue'

const dropList = reactive({})
const userStore = useUserStore()
onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = []
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)

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
  }
})
const chStatus = [
  { label: '待处理', value: 'P' },
  { label: '已批准', value: 'A' },
  { label: '已拒绝', value: 'R' },
  { label: '已取消', value: 'C' }
]
const refreshClick = () => {
  data.formData = {}
}
const query = async () => {
  data.formData.pageSize = data.pageInfo.pageSize
  data.formData.pageNo = data.pageInfo.pageNo

  data.formData.startSubmitTime = data.formData.subTime?.[0]
  data.formData.endSubmitTime = data.formData.subTime?.[1]

  const { list, pageNo, count } = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/swapRequests/queryData', data.formData)
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
const assess = async (id, nextStatus, type) => {
  ElMessageBox.confirm('确认是否' + type + '?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try{
      await requestClient.get(import.meta.env.VITE_NSOSGZ + '/swapRequests/updateStatus', { params: { id: id, nextStatus: nextStatus } })
    } catch(err){
      query()
      return
    }
    query()
    ElNotification({
      title: '提示',
      message: '操作成功！',
      type: 'success'
    })
  })
}
defineExpose({
  query,
  data
})
</script>
<style scoped>
.primary {
  color: #4266ff;
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
</style>
