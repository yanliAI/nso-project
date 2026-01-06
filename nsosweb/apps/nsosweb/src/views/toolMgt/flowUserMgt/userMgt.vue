<template>
  <div class="app-container p-4">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="用户账号" prop="email">
        <el-input
          v-model="queryParams.email"
          placeholder="请输入用户账号"
          clearable
          style="width: 200px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item label="用户名称" prop="firstName">
        <el-input
          v-model="queryParams.firstName"
          placeholder="请输入用户名称"
          clearable
          style="width: 200px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleQuery"
          >查询</el-button
        >
        <el-button type="primary" :icon="Plus" @click="modalApi.open()"
          >新增</el-button
        >
        <el-button
          type="danger"
          :icon="Delete"
          :disabled="multiple"
          @click="handleDelete('')"
          >删除</el-button
        >

        <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table
      ref="tables"
      :data="list"
      border
      stripe
      @selection-change="handleSelectionChange"
      height="700px"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column type="index" width="50" align="center" />
      <el-table-column
        label="用户ID"
        align="center"
        prop="id"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="用户名称"
        align="center"
        prop="firstName"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="部门名称" align="center" prop="lastName" />
      <el-table-column
        label="用户账号"
        align="center"
        prop="email"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-button
            type="danger"
            link
            :icon="Delete"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <div class="mt-2">
      <el-pagination
        v-model:current-page="queryParams.pageNo"
        v-model:page-size="queryParams.pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <Modal
      class="w-[1200px]"
      title="新增流程管理用户"
      :footer="false"
      :draggable="true"
    >
      <UserPageList ref="userPageListRef" :flowUserList="list"></UserPageList>
      <div class="my-2 flex justify-end">
        <el-button type="" @click="modalApi.close">取消</el-button>
        <el-button type="primary" @click="postUserList">确认</el-button>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useVbenModal } from '@vben/common-ui';
import {
  getFlowUserListApi,
  postFlowUserListApi,
  deleteFlowUserApi,
} from '#/api';

import {
  ElForm,
  ElFormItem,
  ElInput,
  ElSelect,
  ElOption,
  ElDatePicker,
  ElButton,
  ElRow,
  ElCol,
  ElTable,
  ElTableColumn,
  ElDialog,
  ElMessage,
  ElMessageBox,
  ElPagination,
  ElTransfer,
} from 'element-plus';

import {
  Search,
  Refresh,
  Delete,
  Download,
  Edit,
  View,
  Plus
} from '@element-plus/icons-vue';
import UserPageList from './userPageList.vue';

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
});

// 遮罩层
const loading = ref(true);
// 选中数组
const ids = ref([]);
// 非多个禁用
const multiple = ref(true);
// 总条数
const total = ref(0);
// 表格数据
const list = ref([]);
// 查询参数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 20,
});

// 表单引用
const queryForm = ref(null);
const tables = ref(null);
const userPageListRef = ref();

async function getList() {
  loading.value = true;
  try {
    let result = await getFlowUserListApi(queryParams);
    list.value = result.records;
    total.value = result.total;
    loading.value = false;
  } catch {}
}

/** 删除按钮操作 */
async function handleDelete(row) {
  let operIds = undefined;
  let tips = '';
  if (row) {
    operIds = [row.id];
    tips = '是否确认删除此流程用户？';
  } else {
    operIds = ids.value;
    tips = '是否确认删除选中的流程用户？';
  }
  ElMessageBox.confirm(tips, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      let result = await deleteFlowUserApi(operIds);
      if (result) {
        getList();
        ElMessage.success('删除成功！');
      }
    })
    .catch(() => {});
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.pageNo = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  resetForm(queryForm.value);
  queryParams.pageNo = 1;
  getList();
}

const handleSizeChange = (val) => {
  queryParams.pageSize = val;
  getList();
};

const handleCurrentChange = (val) => {
  queryParams.pageNo = val;
  getList();
};

// 重置表单
function resetForm(formEl) {
  if (!formEl) return;
  formEl.resetFields();
}

const postUserList = async () => {
  const userList = userPageListRef.value.selectedRows;
  if (!userList || userList.length <= 0) {
    ElMessage.warning('请先选择用户');
  }
  // const filterList = userList.filter((item) => !item.flag);
  // if (filterList.length <= 0) {
  //   ElMessage.success('添加成功！');
  //   modalApi.close();
  //   return;
  // }
  const params = userList.map((item) => ({
    id: item.logincode,
    email: item.logincode,
    firstName: item.username,
    lastName: item.orgFullName,
  }));
  try {
    const result = await postFlowUserListApi(params);
    if (result) {
      ElMessage.success('添加成功！');
      modalApi.close();
      getList();
    }
  } catch {}
};

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.id);
  multiple.value = !selection.length;
}

onMounted(() => {
  getList();
});
</script>

<style scoped lang="less">
.dialog-form .el-form-item {
  width: 100%;
}

:deep(.el-transfer-panel) {
  width: 350px;
}
</style>
