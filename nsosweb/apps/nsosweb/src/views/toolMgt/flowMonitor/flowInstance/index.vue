<template>
  <div style="padding:20px">
    <el-form :inline="true" :model="searchParams" label-position="right">
      <el-form-item label="流程名称:">
        <el-input
          v-model="searchParams.name"
          style="width: 200px"
          clearable
        ></el-input>
      </el-form-item>
            <el-form-item label="业务号:">
        <el-input
          v-model="searchParams.bussinesskey"
          style="width: 200px"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search" :icon="Search">搜索</el-button>
        <el-button type="default" @click="reset" :icon="Refresh">重置</el-button>
        </el-form-item
      >
    </el-form>
    <el-table
      :data="tableData"
      style="width: 100%"
      border
      stripe
      height="700px"
    >
      <el-table-column
        prop="processInstanceId"
        label="流程实例编号">
      </el-table-column>
      <el-table-column
        prop="businessKey"
        label="业务号">
      </el-table-column>
      <el-table-column
        prop="name"
        label="流程名称">
      </el-table-column>
      <el-table-column
        prop="currentTask"
        label="当前节点">
      </el-table-column>
      <el-table-column
        prop="assignee"
        label="当前处理人">
      </el-table-column>
      <el-table-column
        prop="suspended"
        label="是否挂起"
        :formatter="handleSuspend"
      >
      </el-table-column>
      <el-table-column
        prop="startTime"
        label="开始时间">
      </el-table-column>
      <el-table-column
        prop="startUserId"
        label="发起人">
      </el-table-column>
      <el-table-column
        prop="operation"
        label="操作">
        <template #default="scope">
          <el-button
            type="primary"
            link
            @click="showProcess(scope.$index, scope.row)">流程进度</el-button>
          <el-button
            v-if="!scope.row.suspended"
            type="primary"
            link
            @click="handleEnable(false, scope.row)">挂起</el-button>
          <el-button
            v-else
            type="primary"
            link
            @click="handleEnable(true, scope.row)">唤醒</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px;">
      <el-pagination
        v-model:current-page="searchParams.pageNum"
        v-model:page-size="searchParams.pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  ElTable,
  ElTableColumn,
  ElContainer,
  ElFormItem,
  ElDialog,
  ElForm,
  ElInput,
  ElButton,
  ElSelect,
  ElRow,
  ElCol,
  ElPagination,
  ElMessage,
  ElMessageBox,
  ElCard,
  type FormInstance,
} from 'element-plus';
import {
  Search,
  Plus,
  Download,
  Delete,
  Refresh,
} from '@element-plus/icons-vue';
import { getListProcess, enableProcess } from "#/api"
import {openWindow} from "#/utils/commonUtil.ts"

// 响应式数据
const responseData = ref({})
const searchParams = ref({
  name: "",
  bussinesskey: "",
  pageSize: 10,
  pageNum: 1
})

// 计算属性
const tableData = ref([])
const total = ref(0);

// 生命周期
onMounted(() => {
  getListProcessByParamsAndRender(searchParams.value)
})

// 方法
const handleSuspend = (row) => {
  return row.suspended ? "是" : "否"
}

const getListProcessByParamsAndRender = async (params) => {
  const { name = "", bussinesskey = "", pageSize = 10, pageNum = 1 } = params
  try {
      const res = await getListProcess({
        pageSize,
        pageNum,
        isAsc: "asc",
        name,
        bussinesskey
      })
      tableData.value = res.records
      total.value = res.total;
  } catch (error) {
 }
}

const search = () => {
  console.log("搜索得参数", searchParams.value)
  getListProcessByParamsAndRender(searchParams.value)
}

const reset = () => {
  searchParams.value.name = ""
  searchParams.value.bussinesskey = ""
  getListProcessByParamsAndRender(searchParams.value)
}

const handleSizeChange = (val) => {
  searchParams.value.pageSize = val
  getListProcessByParamsAndRender(searchParams.value)
}

const handleCurrentChange = (val) => {
  searchParams.value.pageNum = val
  getListProcessByParamsAndRender(searchParams.value)
}

const handleEnable = async (enable, row) => {
  const { processInstanceId } = row
  await enableProcess(processInstanceId, enable)
  ElMessage.success("操作成功！")
  getListProcessByParamsAndRender(searchParams.value)
}

const showProcess = (index, row) => {
  const { processInstanceId } = row
  const url = `/flow/monitor/traceProcess/${processInstanceId}`
  openWindow(url)
}
</script>

<style scoped>
.search-bar {
  display: flex;
  margin-top: 8px;
  margin-left: 8px;
}
.search-bar > * {
  margin-right: 8px;
}
.search-bar .el-input {
  display: inline-block;
  width: 300px;
  margin-right: 10px;
}
.search-bar label {
  font-size: 14px;
  color: #606266;
  margin-right: 8px;
}
</style>
