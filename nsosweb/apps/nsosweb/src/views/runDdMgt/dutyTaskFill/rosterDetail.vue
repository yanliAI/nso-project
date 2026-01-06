<template>
  <el-container class="h-full">
    <el-header height="100px" class="mb-1">
      <el-form label-width="auto" :model="data.formData" :inline="true" label-position="right" label-suffix=": " class="mt-2 demo-form-inline">
        <el-row>
          <el-col :span="4">
            <el-form-item label="组织角色" prop="orgRole">
              <el-input v-model="data.formData.orgRole" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="角色名称" prop="posRole">
              <el-input v-model="data.formData.posRole" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="姓名" prop="dutyPerson">
              <el-input v-model="data.formData.dutyPerson" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="电话" prop="dutyPhone">
              <el-input v-model="data.formData.dutyPhone" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="值班开始时间" prop="startTime" >
              <el-date-picker v-model="data.formData.startTimeRange" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="值班结束时间" prop="endTime">
              <el-date-picker v-model="data.formData.endTimeRange" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="2" class="flex items-center">
            <el-button type="primary" @click="query">查询</el-button>
            <el-button type="info" @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-main style="padding: 0px 10px">
      <el-table :data="data.tableData" border size="small" class="h-full" stripe :header-cell-style="{ backgroundColor: '#F2F3F5', color: '#666666', fontSize: '14px', height: '40px', textAlign: 'center' }">
        <el-table-column type="selection" align="center" />
        <el-table-column type="index" label="#" align="center" width="40" />
        <el-table-column prop="unitName" label="单位名称" align="center" width="250" />
        <el-table-column prop="orgRole" label="组织角色" align="center" width="250" />
        <el-table-column prop="posRole" label="角色名称" align="center" width="150" />
        <el-table-column prop="dutyPerson" label="姓名" align="center" width="150" />
        <el-table-column prop="dutyPhone" label="电话" align="center" width="150" />
        <!-- <el-table-column label="值班时间" align="center" width="300">
          <template #default="scope">
            <span>开始:{{ formatDateTime(scope.row.startTime) }}</span>
            <br/>
            <span>结束:{{ formatDateTime(scope.row.endTime) }}</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="startTime" label="值班开始时间" :formatter="tDateTimeFormat" align="center" width="160" />
        <el-table-column prop="endTime" label="值班结束时间" :formatter="tDateTimeFormat" align="center" width="160" />

        <el-table-column label="操作" width="150" align="center">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="openDetail(scope.row)"> 查看详情 </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer height="40px">
      <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" class="mt-1" :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="currentChange"></el-pagination>
    </el-footer>
  </el-container>
</template>

<script setup>
import { ElForm, ElFormItem, ElRow, ElCol, ElTable, ElTableColumn, ElPagination, ElMain, ElContainer, ElHeader, ElFooter, ElMessageBox, ElMessage, ElDialog, ElInput, ElDatePicker } from 'element-plus'
import { reactive, ref, onMounted, defineExpose, defineEmits, defineProps } from 'vue'
import { Search, Upload, Tickets } from '@element-plus/icons-vue'
import { tDateTimeFormat, formatDateTime } from '#/utils/commonUtil.ts'
import { queryRosterDataByPage } from './dutyTaskFillMethods.ts'
import { useUserStore } from '@vben/stores'
import { useVbenModal } from '@vben/common-ui'
const props = defineProps({
  taskData: {
    type: Object,
    default: {}
  }
})
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
  query()
})
async function query() {
  const taskData = props.taskData
  data.formData.pageSize = data.pageInfo.pageSize
  data.formData.pageNo = data.pageInfo.pageNo
  data.formData.dutyTaskId = taskData.id
  data.formData.unitId = taskData.receiveDeptCode

  let startTimeRange = data.formData.startTimeRange
  let endTimeRange = data.formData.endTimeRange
  let timeRangeProps = ['startStartTime ','endStartTime', 'startEndTime', 'endEndTime'];
  for (const key in data.formData) {
    // 重置时间范围
    if(timeRangeProps.includes(key)){
      data.formData[key] = null;
    }
  }
  if (startTimeRange != null) {
    data.formData.startStartTime = startTimeRange[0]
    data.formData.endStartTime = startTimeRange[1]
  }
  if (endTimeRange != null) {
    data.formData.startEndTime = endTimeRange[0]
    data.formData.endEndTime = endTimeRange[1]
  }
  

  // data.formData.receiveDeptCode = userStore.userInfo.logincode === 'admin' ? null : userStore.userInfo.orgcode
  const { list, count, pageNo } = await queryRosterDataByPage(data.formData)
  data.tableData = list
  data.pageInfo.pageNo = pageNo
  data.pageInfo.total = count
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
</script>

<style></style>
