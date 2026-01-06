<template>
  <el-container class="h-full bg-white">
    <el-header height="50px">
      <el-form label-width="auto" :model="data.formData" :inline="true" label-position="right" label-suffix=": " class="mt-2 demo-form-inline">
        <el-row>
          <el-col :span="4">
            <el-form-item label="任务名称" prop="tasksName">
              <el-input v-model="data.formData.tasksName" clearable />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="4">
            <el-form-item label="填报状态" prop="tasksName">
              <el-input v-model="data.formData.fillStatus" clearable />
            </el-form-item>
          </el-col> -->
          <el-col :span="2" class="flex items-center">
            <el-button type="primary" @click="query">查询</el-button>
            <el-button type="info" @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-main style="height: calc(100% - 70px)">
      <el-table :data="data.tableData" border size="small" style="height: 100%" stripe :header-cell-style="{ backgroundColor: '#F2F3F5', color: '#666666', fontSize: '14px', height: '40px', textAlign: 'center' }">
        <el-table-column type="selection" align="center" />
        <el-table-column type="index" label="#" align="center" width="40" />
        <el-table-column prop="tasksName" label="任务名称" align="center" width="300" />
        <el-table-column prop="receiveDeptName" label="填报单位" align="center" width="300" />
        <el-table-column prop="doneLine" label="填报截止时间" :formatter="tDateTimeFormat" align="center" width="200" />
        <el-table-column label="操作" width="150" align="center">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="showDetail(scope.row)"> 查看详情 </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer height="45px">
      <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" class="mt-1" :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="currentChange"></el-pagination>
    </el-footer>

    <!-- 详情弹窗 -->
    <Modal class="h-[800px] w-[1600px]" title="值班详情" :footer="false" :closeOnClickModal="false" :draggable="true">
      <duty-detail-list :taskId="data.taskData.id" :unitId="data.taskData.receiveDeptCode" :status="data.taskData.status" @close="closeDiaLog" />
    </Modal>
    <!-- <Modal class="w-[90%]" title="值班详情" :footer="false" :closeOnClickModal="true" :draggable="true">
      <RosterDetail ref="rosterDetailRef" :taskData="data.taskData"></RosterDetail>
    </Modal> -->
  </el-container>
</template>
<script setup>
import { Page } from '@vben/common-ui'
import { ElForm, ElFormItem, ElRow, ElCol, ElTable, ElTableColumn, ElPagination, ElMain, ElContainer, ElHeader, ElFooter, ElTabs, ElTabPane, ElMessageBox, ElMessage, ElDialog, ElInput, ElDatePicker } from 'element-plus'
import { reactive, ref, onMounted, defineExpose } from 'vue'
import { tDateTimeFormat } from '#/utils/commonUtil.ts'
import { queryHwDutyReportedTask } from './dutyTaskFillMethods.ts'
import { useUserStore } from '@vben/stores'
import { useVbenModal } from '@vben/common-ui'
import RosterDetail from './rosterDetail.vue'
import dutyDetailList from '/src/views/runDdMgt/dutyTaskFill/detail/dutyDetailList.vue'

const id = defineModel('dtbid')
const code = defineModel('code')
const emit = defineEmits(['updateTatol'])
const userStore = useUserStore()
const data = reactive({
  tableData: [],
  formData: {},
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0
  },
  taskData: {}
})
onMounted(async () => {
  await query()
  if(id.value){
  //await query()
  showDetail(data.tableData.filter((item) => item.receiveDeptCode === code.value)?.[0])
  }
})

defineExpose({
  query
})
async function query() {
  data.formData.pageSize = data.pageInfo.pageSize
  data.formData.pageNo = data.pageInfo.pageNo
  if(code.value) {
    data.formData.id = id.value;
    data.formData.receiveDeptCode = code.value;
  }else {
    data.formData.receiveDeptCode = userStore.userInfo.logincode === 'admin' ? null : userStore.userInfo.provinceCode
  }
  const { list, count, pageNo } = await queryHwDutyReportedTask(data.formData)
  data.tableData = list
  data.pageInfo.pageNo = pageNo
  data.pageInfo.total = count
  emit('updateTatol', '2', count)
}
const reset = () => {
  data.formData = {}
}
const handleSizeChange = (val) => {
  data.pageInfo.pageSize = val
  query()
}

const currentChange = (val) => {
  data.pageInfo.pageNo = val
  query()
}

// 查看详情
const showDetail = (row) => {
  data.taskData = row
  modalApi.open()
}
const closeDiaLog = () => {
  modalApi.close()
}
const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close()
  }
})
</script>

<style scope>
.demo-form-inline .el-input {
  --el-input-width: 100%;
}

:deep(.el-main){
  padding: 0;
}
</style>
