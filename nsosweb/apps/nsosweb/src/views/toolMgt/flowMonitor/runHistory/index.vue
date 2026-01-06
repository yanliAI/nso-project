<template>
  <div style="padding: 20px">
    <el-form :inline="true" :model="searchParams" label-position="right">
      <el-form-item label="流程名称:">
        <el-input v-model="searchParams.name" style="width: 200px" clearable />
      </el-form-item>
      <el-form-item label="业务号:">
        <el-input
          v-model="searchParams.bussinesskey"
          style="width: 200px"
          clearable
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
      <el-table-column prop="processInstanceId" label="流程实例编号" />
      <el-table-column prop="businessKey" label="业务号" />
      <el-table-column prop="name" label="流程名称" />
      <el-table-column prop="currentTask" label="当前节点" />
      <el-table-column prop="assignee" label="当前处理人" />
      <el-table-column prop="ended" label="是否结束">
        <template #default="scope">
          {{ scope.row.ended ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="开始时间" />
      <el-table-column prop="endTime" label="结束时间" />
      <el-table-column prop="startUserId" label="发起人" />
      <el-table-column prop="operation" label="操作" width="240">
        <template #default="scope">
          <el-button
            type="primary"
            link
            @click="showHistory(scope.$index, scope.row)"
            >查看历史</el-button
          >
          <el-button
            v-if="!scope.row.suspended"
            type="primary"
            link
            @click="showVariable(scope.$index, scope.row)"
            >查看变量</el-button
          >
          <el-button
            v-if="scope.row.status !== '0'"
            type="primary"
            link
            @click="processProgressCard(scope.row)"
            >流程进度</el-button
          >
        </template>
      </el-table-column>
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

    <el-dialog title="执行记录" v-model="showHistoryDialog" width="80%">
      <el-table :data="historyList" height="500" border>
        <el-table-column prop="taskName" label="活动名称" />
        <el-table-column prop="type" label="活动类型" />
        <el-table-column prop="assignee" label="办理人" />
        <el-table-column prop="comment" label="审批意见" />
        <el-table-column prop="startTime" label="开始时间" />
        <el-table-column prop="endTime" label="结束时间" />
      </el-table>
      <template #footer>
        <el-button @click="showHistoryDialog = false">取 消</el-button>
        <el-button type="primary" @click="showHistoryDialog = false"
          >确 定</el-button
        >
      </template>
    </el-dialog>

    <el-dialog title="流程变量" v-model="showVariableDialog" width="80%">
      <el-table :data="variablesList" height="500" border>
        <el-table-column prop="variableName" label="变量名" />
        <el-table-column prop="variableTypeName" label="变量类型" />
        <el-table-column prop="value" label="变量值" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="lastUpdatedTime" label="最后修改时间" />
      </el-table>
      <template #footer>
        <el-button @click="showVariableDialog = false">取 消</el-button>
        <el-button type="primary" @click="showVariableDialog = false"
          >确 定</el-button
        >
      </template>
    </el-dialog>

    <Modal
      class="h-[80%] w-[80%]"
      title="流程进度"
      :footer="false"
      :draggable="true"
    >
      <ProcessProgress
        :processImgUrl="processImgUrl"
        :processInstanceId="processInfo.processInstanceId"
      ></ProcessProgress>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getListHistoryProcess, getListByTypeAndId } from '#/api';
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
} from 'element-plus';
import { Search, Refresh } from '@element-plus/icons-vue';
import { useVbenModal } from '@vben/common-ui';
import ProcessProgress from '#/views/process/processProgress/index.vue';

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
});

const searchParams = ref({
  name: '',
  bussinesskey: '',
  pageSize: 10,
  pageNum: 1,
});
const processImgUrl = ref('');
const processInfo = ref({});
const showHistoryDialog = ref(false);
const showVariableDialog = ref(false);
const historyList = ref([]);
const variablesList = ref([]);

// 计算属性
const tableData = ref([]);
const total = ref(0);

// 生命周期
onMounted(() => {
  getListHistoryProcessByParamsAndRender(searchParams.value);
});

// 方法
const getListHistoryProcessByParamsAndRender = async (params) => {
  try {
    const { pageNum = 1, pageSize = 10, name = '', bussinesskey = '' } = params;
    const res = await getListHistoryProcess({
      pageSize,
      pageNum,
      isAsc: 'asc',
      name,
      bussinesskey,
    });
    tableData.value = res.records;
    total.value = res.total;
  } catch (error) {
    console.error('获取流程历史失败:', error);
    ElMessage.error('获取流程历史失败');
  }
};

const search = () => {
  getListHistoryProcessByParamsAndRender(searchParams.value);
};

const reset = () => {
  searchParams.value.name = '';
  searchParams.value.bussinesskey = '';
  getListHistoryProcessByParamsAndRender(searchParams.value);
};

const handleSizeChange = (val) => {
  searchParams.value.pageSize = val;
  getListHistoryProcessByParamsAndRender(searchParams.value);
};

const handleCurrentChange = (val) => {
  searchParams.value.pageNum = val;
  getListHistoryProcessByParamsAndRender(searchParams.value);
};

const showHistory = async (index, row) => {
  try {
    const { processInstanceId } = row;
    showHistoryDialog.value = true;
    const res = await getListByTypeAndId('history', processInstanceId, {
      pageSize: 100,
      pageNum: 1,
      isAsc: 'asc',
    });
    console.log('获取到历史', res);
    historyList.value = res.records;
  } catch (error) {
    console.error('获取历史记录失败:', error);
    ElMessage.error('获取历史记录失败');
  }
};

const showVariable = async (index, row) => {
  try {
    const { processInstanceId } = row;
    showVariableDialog.value = true;
    const res = await getListByTypeAndId('variables', processInstanceId, {
      pageSize: 100,
      pageNum: 1,
      isAsc: 'asc',
    });
    console.log('获取到变量', res);
    variablesList.value = res.records;
  } catch (error) {
    console.error('获取变量失败:', error);
    ElMessage.error('获取变量失败');
  }
};

const processProgressCard = (row) => {
  processInfo.value = row;
  processImgUrl.value = `${import.meta.env.VITE_NSOSFS}/flow/monitor/traceProcess/${row.processInstanceId}`;
  modalApi.open();
};
</script>

<style scoped></style>
