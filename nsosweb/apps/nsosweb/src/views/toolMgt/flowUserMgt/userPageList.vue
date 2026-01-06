<template>
  <div class="app-container p-4">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="用户账号" prop="loginCode">
        <el-input
          v-model="queryParams.loginCode"
          placeholder="请输入用户账号"
          clearable
          style="width: 200px"
        />
      </el-form-item>

      <el-form-item label="用户名称" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入用户名称"
          clearable
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="部门名称" prop="orgName">
        <el-input
          v-model="queryParams.orgName"
          placeholder="请输入部门名称"
          clearable
          style="width: 200px"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleQuery"
          >查询</el-button
        >

        <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table
      ref="tableRef"
      :data="list"
      border
      stripe
      @selection-change="handleSelectionChange"
      @row-click="(row) => tableRef.toggleRowSelection(row)"
      height="500px"
    >
      <el-table-column type="selection" align="center" />
      <el-table-column type="index" width="50" align="center" />
      <el-table-column
        label="用户ID"
        align="center"
        prop="userId"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="用户名称"
        align="center"
        prop="username"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="部门名称" align="center" prop="orgFullName" />
      <el-table-column
        label="用户账号"
        align="center"
        prop="logincode"
        :show-overflow-tooltip="true"
      />
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, computed } from 'vue';
import { getUserListApi } from '#/api';

// Element Plus components
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

// Icons
import {
  Search,
  Refresh,
  Delete,
  Download,
  Edit,
  View,
} from '@element-plus/icons-vue';

const flowUserList = defineModel('flowUserList');

// 遮罩层
const loading = ref(true);
// 存储 userId -> 对象
const selectedItemsMap = ref(new Map());
// 总条数
const total = ref(0);
// 表格数据
const list = ref([]);
// 查询参数
const queryParams = ref({
  pageNo: 1,
  pageSize: 20,
});

// 表单引用
const queryForm = ref(null);
const tableRef = ref(null);

const getUserList = async () => {
  loading.value = true;
  try {
    const result = await getUserListApi({ ...queryParams.value });
    list.value = result.records;
    total.value = result.total;

    nextTick(() => {
      restoreSelection();
      loading.value = false;
    });
  } catch (e) {
    loading.value = false;
  }
};

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNo = 1;
  getUserList();
}

/** 重置按钮操作 */
function resetQuery() {
  resetForm(queryForm.value);
  queryParams.value.pageNo = 1;
  getUserList();
}

const handleSizeChange = (val) => {
  queryParams.value.pageSize = val;
  // 切换分页大小时回到第一页
  queryParams.value.pageNo = 1;
  getUserList();
};

const handleCurrentChange = (val) => {
  queryParams.value.pageNo = val;
  getUserList();
};

// 重置表单
function resetForm(formEl) {
  if (!formEl) return;
  formEl.resetFields();
}

const handleSelectionChange = (selection) => {
  if (loading.value) {
    // 数据变更期间忽略选择变化事件
    return;
  }
  // 获取当前页选中的ID
  const currentPageSelectedIds = selection.map((item) => item.userId);

  // 更新全局选中状态
  list.value.forEach((item) => {
    if (currentPageSelectedIds.includes(item.userId)) {
      selectedItemsMap.value.set(item.userId, item);
    } else {
      selectedItemsMap.value.delete(item.userId);
    }
  });
};

// 恢复选中状态
const restoreSelection = () => {
  if (!tableRef.value) return;

  // 清除当前所有选择
  // tableRef.value.clearSelection();

  // 设置当前页的选中状态
  list.value.forEach((row) => {
    const ids = Array.from(selectedItemsMap.value.keys());
    if (ids.includes(row.userId)) {
      nextTick(() => {
        tableRef.value.toggleRowSelection(row, true);
      });
    }
  });
};

const selectedRows = computed(() => {
  return Array.from(selectedItemsMap.value.values()) || [];
});

defineExpose({ selectedRows });
onMounted(() => {
  // flowUserList.value.forEach((item) => {
  //   selectedItemsMap.value.set(item.id, {
  //     userId: item.id,
  //     logincode: item.email,
  //     username: item.firstName,
  //     orgFullName: item.lastName,
  //     flag: true,
  //   });
  // });
  getUserList();
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
