<template>
  <div class="app-container p-4">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="登录账号" prop="logincode">
        <el-input
          v-model="queryParams.logincode"
          placeholder="请输入登录账号"
          clearable
          style="width: 200px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item label="用户名称" prop="username">
        <el-input
          v-model="queryParams.username"
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

        <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table ref="tables" :data="list" border stripe height="700px">
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
        prop="username"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="部门名称" align="center" prop="orgFullName" />
      <el-table-column
        label="登录账号"
        align="center"
        prop="logincode"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="登录时间"
        align="center"
        prop="logintime"
        :show-overflow-tooltip="true"
        width="180"
      />
      <el-table-column label="用户角色" align="center" prop="roles">
        <template #default="scope">
          <span v-if="scope.row.roles && scope.row.roles.length > 0">{{
            scope.row.roles.map((item) => item.postName).join(',')
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-button
            type="primary"
            link
            :icon="Delete"
            @click="handleForceLogout(scope.row)"
            >强退</el-button
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { getOnlinePageList, forceLogoutApi } from '#/api';

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
} from 'element-plus';

// Icons
import {
  Search,
  Refresh,
  Delete,
  Download,
  View,
} from '@element-plus/icons-vue';

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
// 日期范围
const dateRange = ref([]);
// 查询参数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 20,
});

const defaultTime = ref([
  new Date(0, 0, 0, 0, 0, 0), // 开始时间：00:00:00
  new Date(0, 0, 0, 23, 59, 59), // 结束时间：23:59:59
]);

/**
 * 按照时间排序
 * @param a
 * @param b
 */
const sortTime = (a, b) => {
  return new Date(a.createTime) - new Date(b.createTime);
};

// 表单引用
const queryForm = ref(null);
const tables = ref(null);

/** 查询操作日志 */
async function getList() {
  loading.value = true;
  try {
    let result = await getOnlinePageList(
      addDateRange(queryParams, dateRange.value),
    );
    list.value = result.records;
    total.value = result.total;
    loading.value = false;
  } catch {}
}

/** 强退按钮操作 */
async function handleForceLogout(row) {
  ElMessageBox.confirm(
    '是否确认强退名称为"' + row.username + '"的用户？',
    '提示',
    { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' },
  )
    .then(async () => {
      let result = await forceLogoutApi(row.id);
      if (result) {
        getList();
        ElMessage.success('强退成功');
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
  dateRange.value = [];
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

// 添加日期范围
function addDateRange(params, dateRange) {
  const search = params;
  search.starttime = dateRange && dateRange[0];
  search.endtime = dateRange && dateRange[1];
  return search;
}

// 重置表单
function resetForm(formEl) {
  if (!formEl) return;
  formEl.resetFields();
}

onMounted(() => {
  getList();
});
</script>

<style scoped lang="less">
.dialog-form .el-form-item {
  width: 100%;
}
</style>
