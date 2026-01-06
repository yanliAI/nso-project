<template>
  <div style="padding: 20px">
    <el-form :inline="true" :model="searchParams" label-position="right">
      <el-form-item label="流程名称:">
        <el-input
          v-model="searchParams.name"
          style="width: 200px"
          clearable
        ></el-input>
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
      row-key="executionId"
    >
      <el-table-column prop="executionId" label="执行实例编号">
      </el-table-column>
      <el-table-column prop="name" label="流程名称"> </el-table-column>
      <el-table-column prop="currentTask" label="当前节点"> </el-table-column>
      <el-table-column prop="active" label="是否激活">
        <template #default="scope">
          {{ scope.row.active ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column prop="suspended" label="是否挂起">
        <template #default="scope">
          {{ scope.row.suspended ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="开始时间"> </el-table-column>
      <el-table-column prop="startUserId" label="发起人"> </el-table-column>
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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
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
import { Search, Refresh } from '@element-plus/icons-vue';
import { getListExecutions } from '#/api';
import { listToTree } from '#/utils/commonUtil.ts';

// 响应式数据
const tableData = ref([]);
const total = ref(0)
const searchParams = ref({
  name: '',
});

// 生命周期
onMounted(() => {
  getListExecutionsByParamsAndRender(searchParams.value);
});

// 方法
const getListExecutionsByParamsAndRender = async (params) => {
  try {
    const { name = '', pageSize = 10, pageNum = 1 } = params;
    let requestParams = { pageSize, pageNum };
    if (name) {
      requestParams.name = name;
    }

    const res = await getListExecutions(requestParams);
    const formattedData = res.map((item) => ({
      ...item,
      active: item.active,
      suspended: item.suspended,
    }));
    tableData.value = listToTree(formattedData);
  } catch (error) {
    console.error('获取执行列表失败:', error);
    ElMessage.error('获取执行列表失败');
  }
};

const search = () => {
  getListExecutionsByParamsAndRender(searchParams.value);
};

const reset = () => {
  searchParams.value.name = '';
  searchParams.value.pageNum = 1;
  getListExecutionsByParamsAndRender(searchParams.value);
};

const handleSizeChange = (val) => {
  searchParams.value.pageSize = val;
  getListExecutionsByParamsAndRender(searchParams.value);
};

const handleCurrentChange = (val) => {
  searchParams.value.pageNum = val;
  getListExecutionsByParamsAndRender(searchParams.value);
};
</script>

<style scoped></style>
