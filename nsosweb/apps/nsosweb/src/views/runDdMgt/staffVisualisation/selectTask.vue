<template>
  <el-container class="h-full">
    <el-header height="40px">
      <el-form
        label-width="80px"
        ref="ruleFormRef"
        :model="data.formData"
        :inline="true"
        label-position="right"
        class="demo-form-inline"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="任务名称:" prop="tasksName">
              <el-input v-model="data.formData.tasksName" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" :icon="Search" @click="query()"
              >搜索</el-button
            >
            <el-button
              type="info"
              plain
              :icon="RefreshLeft"
              @click="refreshClick"
              >重置</el-button
            >
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-main style="height: calc(100% - 85px)">
      <el-table
        :data="data.tableData"
        border
        ref="taskTab"
        size="small"
        style="height: 100%"
      >
        <el-table-column
          type="index"
          fixed
          width="40"
          label="#"
          align="center"
        />
        <el-table-column prop="tasksName" label="任务名称" width="240" />
        <el-table-column
          prop="dutyStartTime"
          :formatter="tDateTimeFormat"
          label="排班开始时间"
          align="center"
        />
        <el-table-column
          prop="dutyEndTime"
          :formatter="tDateTimeFormat"
          label="排班结束时间"
          align="center"
        />
        <el-table-column
          prop="doneLine"
          label="完成时限"
          align="center"
          :formatter="tDateTimeFormat"
        />
        <el-table-column prop="creatorId" label="创建人" align="center" />
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
          :formatter="tDateTimeFormat"
        />
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="selectTask(scope.row)">选中</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer height="40px">
      <el-pagination
        :current-page="data.pageInfo.pageNo"
        :page-size="data.pageInfo.pageSize"
        class="mt-1"
        :total="data.pageInfo.total"
        :page-sizes="[20, 50, 100, 200]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="currentChange"
      />
    </el-footer>
  </el-container>
</template>
<script setup>
import { ref, reactive, onMounted, defineEmits } from 'vue';
import {
  ElInput,
  ElContainer,
  ElHeader,
  ElMain,
  ElFooter,
  ElRow,
  ElCol,
  ElTable,
  ElForm,
  ElFormItem,
  ElButton,
  ElPagination,
} from 'element-plus';
import { useVbenModal } from '@vben/common-ui';
import {
  tDateTimeFormat,
} from '#/utils/commonUtil.ts';
import {
  queryArchive,
} from './taskPublishMethod.ts';
import { Search, RefreshLeft } from '@element-plus/icons-vue';

const emit = defineEmits(['query'])
const dropList = reactive({});
const data = reactive({
  formData: {},
  tableData: [],

  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0,
  },
});
const taskTab = ref();

onMounted(async () => {
  query();
});

const query = async () => {
  data.formData.pageSize = data.pageInfo.pageSize;
  data.formData.pageNo = data.pageInfo.pageNo;
  const { list, count, pageNo } = await queryArchive(data.formData);
  data.tableData = list;
  data.pageInfo.pageNo = pageNo;
  data.pageInfo.total = count;
};

const selectTask = async(row) => {
  emit('query',row.id);
}

const handleSizeChange = (val) => {
  data.pageInfo.pageSize = val;
  query();
};

const currentChange = (val) => {
  data.pageInfo.pageNo = val;
  query();
};
</script>
<style scoped>
.demo-form-inline {
  margin-top: 6px;
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

:deep(.el-main) {
  padding: 0;
}

:deep(.el-tabs) {
  --el-tabs-header-height: 30px;
}

:deep(.el-tabs__item) {
  font-size: 12px;
}

:deep(.el-tabs__header) {
  margin-bottom: 4px;
}

/* :deep(.el-scrollbar__wrap) {
  background-color: rgba(20, 48, 133, 0.85) !important;
} */

:deep(.el-pagination__total) {
  color: white !important;
}

:deep(.el-pagination__jump) {
  color: white;
}

:deep(.el-pagination button:disabled) {
  background-color: rgba(0, 83, 141, 0.25);
}

:deep(.el-pagination button) {
  background-color: rgba(0, 83, 141, 0.25);
}

:deep(.el-pager li) {
  background-color: transparent;
}
</style>
