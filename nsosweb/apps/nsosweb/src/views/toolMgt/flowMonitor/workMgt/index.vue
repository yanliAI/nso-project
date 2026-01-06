<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleTabClick" type="card">
      <el-tab-pane label="定时作业" name="1"></el-tab-pane>
      <el-tab-pane label="异步作业" name="2"></el-tab-pane>
      <el-tab-pane label="挂起作业" name="3"></el-tab-pane>
      <el-tab-pane label="死亡作业" name="4"></el-tab-pane>
    </el-tabs>

    <div style="padding: 0 20px">
      <el-form :inline="true" :model="searchParams" label-position="right">
        <el-form-item label="流程定义ID:">
          <el-input
            v-model="searchParams.processDefinitionId"
            style="width: 200px"
            clearable
          />
        </el-form-item>
        <el-form-item v-if="activeName !== '3'" label="计划执行时间:">
          <el-date-picker
            v-model="searchParams.range"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" :icon="Search"
            >搜索</el-button
          >
          <el-button type="default" @click="reset" :icon="Refresh"
            >重置</el-button
          >
        </el-form-item>
      </el-form>

      <el-table
        :data="tableData"
        style="width: 100%"
        border
        stripe
        height="700px"
      >
        <el-table-column
          v-for="(column, i) in currentColumns"
          :key="i"
          :prop="column.key"
          :label="column.label"
        />
      </el-table>

      <div style="margin-top: 20px">
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { getListJobs } from '#/api';
import { normalizeDateTimeString } from '#/utils/commonUtil.ts';
import {
  ElTable,
  ElTableColumn,
  ElContainer,
  ElFormItem,
  ElDialog,
  ElForm,
  ElInput,
  ElButton,
  ElTabs,
  ElTabPane,
  ElSelect,
  ElRow,
  ElCol,
  ElPagination,
  ElMessage,
  ElMessageBox,
  ElCard,
  type FormInstance,
} from 'element-plus';
import { Search, Refresh } from '@element-plus/icons-vue';

// 响应式数据
const responseData = ref({});
const activeName = ref('1');
const searchParams = ref({
  processDefinitionId: '',
  range: null,
  pageNum: 1,
  pageSize: 10,
});

const columns = {
  1: [
    { key: 'processDefinitionId', label: '流程定义编号' },
    { key: 'jobHandlerType', label: '作业类型' },
    { key: 'duedate', label: '计划执行时间' },
    { key: 'processInstanceId', label: '流程实例编号' },
    { key: 'retries', label: '剩余重试次数' },
  ],
  2: [
    { key: 'processDefinitionId', label: '流程定义编号' },
    { key: 'jobHandlerType', label: '作业类型' },
    { key: 'duedate', label: '计划执行时间' },
    { key: 'processInstanceId', label: '流程实例编号' },
    { key: 'retries', label: '剩余重试次数' },
  ],
  3: [
    { key: 'processDefinitionId', label: '流程定义编号' },
    { key: 'jobHandlerType', label: '作业类型' },
    { key: 'duedate', label: '计划执行时间' },
    { key: 'processInstanceId', label: '流程实例编号' },
    { key: 'retries', label: '剩余重试次数' },
  ],
  4: [
    { key: 'processDefId', label: '流程定义编号' },
    { key: 'jobHandlerType', label: '作业类型' },
    { key: 'dueDate', label: '计划执行时间' },
    { key: 'processInstanceId', label: '流程实例编号' },
    { key: 'exceptionMessage', label: '异常信息' },
  ],
};

// 计算属性
const tableData = ref([]);
const total = computed(() => responseData.value.total || 0);
const currentColumns = computed(() => columns[activeName.value]);
const transferedSearchParams = computed(() => ({
  processDefinitionId: searchParams.value.processDefinitionId,
  pageNum: searchParams.value.pageNum,
  pageSize: searchParams.value.pageSize,
  startDate: (searchParams.value.range && searchParams.value.range[0]) || '',
  endDate: (searchParams.value.range && searchParams.value.range[1]) || '',
  isAsc: 'asc',
  type: activeName.value,
}));

// 生命周期
onMounted(() => {
  getListJobByParamsAndRender(transferedSearchParams.value);
});

// 方法
const getListJobByParamsAndRender = async (params) => {
  try {
    const { type = '1', ...restParams } = params;
    const res = await getListJobs(type, restParams);
    responseData.value.total = res.total
    if (!res.records || res.records.length <= 0) {
      tableData.value = [];
      return;
    }

    // 格式化时间
    if (['1', '2', '3'].includes(activeName.value)) {
      res.records = res.records.map((item) => ({
        ...item,
        duedate: normalizeDateTimeString(item.duedate),
      }));
    } else if (activeName.value === '4') {
      res.records = res.records.map((item) => ({
        ...item,
        dueDate: normalizeDateTimeString(item.dueDate),
      }));
    }

    tableData.value = res.records;
  } catch (error) {
    console.error('获取作业列表失败:', error);
    ElMessage.error('获取作业列表失败');
  }
};

const search = () => {
  getListJobByParamsAndRender(transferedSearchParams.value);
};

const reset = () => {
  searchParams.value.processDefinitionId = '';
  searchParams.value.range = null;
  getListJobByParamsAndRender(transferedSearchParams.value);
};

const handleSizeChange = (val) => {
  searchParams.value.pageSize = val;
  getListJobByParamsAndRender(transferedSearchParams.value);
};

const handleCurrentChange = (val) => {
  searchParams.value.pageNum = val;
  getListJobByParamsAndRender(transferedSearchParams.value);
};

const handleTabClick = () => {
  getListJobByParamsAndRender(transferedSearchParams.value);
};
</script>

<style scoped>
/* .c-work-management {
  background: #FFFFFF;
  border: 1px solid #DCDFE6;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
} */
/* .el-tabs--border-card {
  border: none;
  box-shadow: none;
} */
</style>
