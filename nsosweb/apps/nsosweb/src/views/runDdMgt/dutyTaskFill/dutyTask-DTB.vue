<template>
  <el-container class="h-full bg-white">
    <el-header height="100px">
      <el-form label-width="auto" :model="data.formData" :inline="true" label-position="right" label-suffix=": " class="mt-2 demo-form-inline">
        <el-row>
          <el-col :span="8">
            <el-form-item label="任务名称" prop="tasksName">
              <el-input v-model="data.formData.tasksName" clearable style="width: 400px" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="填报截止时间" prop="doneLine">
              <el-date-picker v-model="data.formData.doneLine" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="排班开始时间" prop="dutyStartTime">
              <el-date-picker v-model="data.formData.dutyStartTime" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="排班结束时间" prop="dutyEndTime">
              <el-date-picker v-model="data.formData.dutyEndTime" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="3" class="flex items-center">
            <el-button type="primary" @click="query()" :icon="Search">查询</el-button>
            <el-button type="info" :icon="RefreshLeft"  @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-main style="height: calc(100% - 100px)">
      <el-table :data="data.tableData" border size="small" style="height: 100%" stripe :header-cell-style="{ backgroundColor: '#F2F3F5', color: '#666666', fontSize: '14px', height: '40px', textAlign: 'center' }">
        <el-table-column type="selection" align="center" />
        <el-table-column type="index" label="#" align="center" width="40" />
        <el-table-column prop="tasksName" label="任务名称" align="center" width="250" />
        <el-table-column prop="creatorId" label="创建人" align="center" width="150" />
        <el-table-column prop="dutyStartTime" label="排班开始时间" align="center" :formatter="tDateTimeFormat" />
        <el-table-column prop="dutyEndTime" label="排班结束时间" :formatter="tDateTimeFormat" align="center" />
        <el-table-column prop="doneLine" label="填报截止时间" :formatter="tDateTimeFormat" align="center" />
        <el-table-column prop="receiveDeptName" label="填报单位" align="center" width="300" />
        <el-table-column label="操作" width="250" align="center">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="openCalendarFill(scope.row)"> 在线填报 </el-button>
            <el-button link type="primary" size="small" @click="openTemplateImport(scope.row)"> 模板导入 </el-button>
            <!-- <el-button link type="primary" size="small"> 查看详情 </el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer height="45px">
      <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" class="mt-1" :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="currentChange"></el-pagination>
    </el-footer>
  </el-container>

  <!-- <el-dialog v-model="calendarVisible" title="排班日历填报" width="90%" top="5vh" >
    <CalendarFill ref="calendar"></CalendarFill>
  </el-dialog> -->
  <RegisterCalendarModal class="w-[90%]" :title="calendarModelTitile" :footer="false" :closeOnClickModal="true" :draggable="true" headerClass="head-md">
    <CalendarFill ref="calendar" :dutyTaskId="data.dutyTaskId" :taskData="data.taskData" @refreshList="refreshList"></CalendarFill>
  </RegisterCalendarModal>
  <RegisterTemplateModal class="w-[400px]" title="模板导入" :draggable="true" :footer="true" >
    <TemplateImport ref="templateRef" :taskData="data.taskData" @successfullyImport="successfullyImport"></TemplateImport>
    <template #footer>
        <el-button type="primary" @click="handleTemplateImport()">导入</el-button>
        <el-button type="info" @click="templateModal.close()">取消</el-button>
      </template>
  </RegisterTemplateModal>
</template>
<script setup>
import { Page } from '@vben/common-ui'
import { ElForm, ElFormItem, ElRow, ElCol, ElTable, ElTableColumn, ElPagination, ElMain, ElContainer, ElHeader, ElFooter, ElTabs, ElTabPane, ElMessageBox, ElMessage, ElDialog, ElInput, ElDatePicker } from 'element-plus'
import { reactive, ref, onMounted, defineExpose } from 'vue'
import { tDateTimeFormat } from '#/utils/commonUtil.ts'
import CalendarFill from './calendar/calendarFill.vue'
import { queryHwDutyFillingTask } from './dutyTaskFillMethods.ts'
import { useVbenModal } from '@vben/common-ui'
import { useUserStore } from '@vben/stores'
import TemplateImport from './templateImport.vue'
import { Search, RefreshLeft} from '@element-plus/icons-vue'
// const [Modal, modalApi] = useVbenModal({
//   onCancel() {
//     modalApi.close()
//   }
// })
// 日历填报弹窗
const [RegisterCalendarModal, calendarModal] = useVbenModal({
  // onCancel() {
  //   calendarModal.close()
  // }
})
// 模板操作弹窗
const [RegisterTemplateModal, templateModal] = useVbenModal({
  // onCancel() {
  //   templateModal.close()
  // }
})

const id = defineModel('dtbid')
const code = defineModel('code')
const tabName = defineModel('tabName')
const emit = defineEmits(['refresh','updateTatol'])


const userStore = useUserStore()
const templateRef = ref();
const calendarVisible = ref(false)
const calendarModelTitile = ref('排班日历填报')
const data = reactive({
  tableData: [],
  formData: {},
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0
  },
  dutyTaskId: '',
  taskData: {}
})
onMounted(async () => {
  await query()
  if(id.value){
  // await query()
  openCalendarFill(data.tableData.filter((item) => item.receiveDeptCode === code.value)?.[0])
  }
})
defineExpose({
  query,
})
const openCalendarFill = (row) => {
  // calendarVisible.value = true;
  data.dutyTaskId = row.id
  data.taskData = row
  calendarModelTitile.value = `${row.tasksName}-${row.receiveDeptName}`
  calendarModal.open()
}
const openTemplateImport = (row) => {
  data.taskData = row
  data.dutyTaskId = row.id
  calendarModelTitile.value = `${row.tasksName}-${row.receiveDeptName}`
  templateModal.open()
}

function successfullyImport() {
  templateModal.close()
  calendarModal.open()
}

async function query() {
  data.formData.pageSize = data.pageInfo.pageSize
  data.formData.pageNo = data.pageInfo.pageNo
  if(code.value) {
    data.formData.id = id.value;
    data.formData.receiveDeptCode = code.value;
  }else {
    data.formData.receiveDeptCode = userStore.userInfo.logincode === 'admin' ? null : userStore.userInfo.provinceCode
  }
  // console.log('userInfo :>>', userStore.userInfo)
  let doneLine = data.formData.doneLine
  let dutyStartTime = data.formData.dutyStartTime
  let dutyEndTime = data.formData.dutyEndTime
  for (const key in data.formData) {
    if (key.startsWith('start') || key.startsWith('end')) {
      data.formData[key] = null
    }
  }
  if (doneLine != null) {
    data.formData.startDoneLine = doneLine[0]
    data.formData.endDoneLine = doneLine[1]
  }
  if (dutyStartTime != null) {
    data.formData.startDutyStartTime = dutyStartTime[0]
    data.formData.endDutyStartTime = dutyStartTime[1]
  }
  if (dutyEndTime != null) {
    data.formData.startDutyEndTime = dutyEndTime[0]
    data.formData.endDutyEndTime = dutyEndTime[1]
  }
  const { list, count, pageNo } = await queryHwDutyFillingTask(data.formData)
  data.tableData = list
  data.pageInfo.pageNo = pageNo
  data.pageInfo.total = count
  emit('updateTatol', '1', count)
}
const handleSizeChange = (val) => {
  data.pageInfo.pageSize = val
  query()
}

const currentChange = (val) => {
  data.pageInfo.pageNo = val
  query()
}
// 重置查询条件
const reset = () => {
  data.formData = {}
}
async function refreshList() {
  calendarModal.close()
  emit('refresh',tabName.value)
  await query()
}
async function handleTemplateImport(){
  if (templateRef.value) {
    await templateRef.value.submitUpload()
  }
}
</script>

<style scope>
.demo-form-inline .el-input {
  --el-input-width: 100% !important;
}

.el-main{
  padding: 0;
}

:deep(.head-md h2) {
  font-size: 14px;
}
</style>
