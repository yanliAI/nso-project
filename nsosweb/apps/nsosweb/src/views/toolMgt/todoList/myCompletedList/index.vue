<template>
  <div style="padding: 20px">
    <el-form :inline="true" :model="searchParams" label-position="right">
      <el-form-item label="流程名称:">
        <el-input
          v-model="searchParams.processName"
          clearable
          style="width: 200px"
        ></el-input>
      </el-form-item>
      <el-form-item label="任务名称:">
        <el-input
          v-model="searchParams.taskName"
          clearable
          style="width: 200px"
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
    >
      <el-table-column prop="processName" label="流程名称"></el-table-column>
      <el-table-column prop="taskName" label="任务名称"></el-table-column>
      <el-table-column prop="title" label="标题"></el-table-column>
      <!-- <el-table-column
        prop="processInstanceId"
        label="流程实例编号"
      ></el-table-column>
      <el-table-column
        prop="executionId"
        label="执行实例编号"
      ></el-table-column>
      <el-table-column prop="businessKey" label="业务号"></el-table-column> -->
      <el-table-column prop="orgFullName" label="发起部门"></el-table-column>
      <el-table-column prop="starterName" label="发起人"></el-table-column>
      <el-table-column prop="assigneeName" label="办理人"></el-table-column>
      <el-table-column prop="createTime" label="任务创建时间"></el-table-column>
      <el-table-column prop="startTime" label="流程启动时间"></el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button
            type="danger"
            link
            @click="handleWithdraw(scope.$index, scope.row)"
            >撤回</el-button
          >
          <el-button type="primary" link @click="processProgressCard(scope.row)"
            >流程进度</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <div style="margin-top: 20px">
      <el-pagination
        v-model:current-page="searchParams.pageNo"
        v-model:page-size="searchParams.pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

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
import { ref, computed, onMounted } from 'vue';
import { Search, Refresh } from '@element-plus/icons-vue';
import { getMyCompleteList, withdrawProcessApi } from '#/api';
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
import { useVbenModal } from '@vben/common-ui';
import ProcessProgress from '#/views/process/processProgress/index.vue';

const emit = defineEmits(['updateNum']);
const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
});

const processImgUrl = ref('');
const processInfo = ref({});
const searchParams = ref({
  taskName: '',
  processName: '',
  pageNo: 1,
  pageSize: 10,
});

// 计算属性
const tableData = ref([]);
const total = ref(0);

// 生命周期
onMounted(() => {
  getAllTodoListByParamsAndRender(searchParams.value);
});

// 方法
const getAllTodoListByParamsAndRender = async (params) => {
  try {
    const res = await getMyCompleteList({
      pageSize: params.pageSize,
      pageNo: params.pageNo,
      processName: params.processName,
      taskName: params.taskName,
    });
    tableData.value = res.records;
    total.value = res.total;
    emit('updateNum', 'completed', res.total);
  } catch (error) {}
};

const search = () => {
  searchParams.value.pageNo = 1; // 搜索时重置页码
  getAllTodoListByParamsAndRender(searchParams.value);
};

const reset = () => {
  searchParams.value.taskName = '';
  searchParams.value.processName = '';
  searchParams.value.pageNo = 1;
  getAllTodoListByParamsAndRender(searchParams.value);
};

const handleSizeChange = (val) => {
  searchParams.value.pageSize = val;
  getAllTodoListByParamsAndRender(searchParams.value);
};

const handleCurrentChange = (val) => {
  searchParams.value.pageNo = val;
  getAllTodoListByParamsAndRender(searchParams.value);
};

const handleWithdraw = (index, row) => {
  const { formKey, taskId, businessKey } = row;
  ElMessageBox.confirm('确认撤回此流程申请吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      let result = await withdrawProcessApi(taskId);
      if (result) {
        ElMessage.success('已撤回');
        getAllTodoListByParamsAndRender(searchParams.value);
      }
    } catch {}
  });
};

const processProgressCard = (row) => {
  processInfo.value = row;
  processImgUrl.value = `${import.meta.env.VITE_NSOSFS}/flow/monitor/traceProcess/${row.processInstanceId}`;
  modalApi.open();
};
</script>

<style scoped></style>
