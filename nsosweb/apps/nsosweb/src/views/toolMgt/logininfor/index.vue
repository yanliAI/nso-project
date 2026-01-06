<template>
  <div class="app-container p-4">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="登录日期">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD HH:mm:ss"
          style="width: 300px"
          :default-time="defaultTime"
        />
      </el-form-item>
      <el-form-item label="登录地址" prop="ipaddr">
        <el-input
          v-model="queryParams.ipaddr"
          placeholder="请输入登录地址"
          clearable
          style="width: 200px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item label="用户名称" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入用户名称"
          clearable
          style="width: 200px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="状态"
          clearable
          style="width: 200px"
        >
          <el-option label="成功" value="0" />
          <el-option label="失败" value="1" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleQuery"
          >查询</el-button
        >
        <el-button
          type="danger"
          :icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
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
      <el-table-column label="访问编号" align="center" prop="infoId" />
      <el-table-column
        label="用户名称"
        align="center"
        prop="userName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="登录地址"
        align="center"
        prop="ipaddr"
        width="130"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="登录地点"
        align="center"
        prop="loginLocation"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="浏览器"
        align="center"
        prop="browser"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="操作系统" align="center" prop="os" />
      <el-table-column label="登录状态" align="center" prop="status">
        <template #default="scope">
          <span v-if="scope.row.status === '0'">成功</span>
          <span v-if="scope.row.status === '1'">失败</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作信息"
        align="center"
        prop="msg"
        :show-overflow-tooltip="true"
      />

      <el-table-column
        label="登录时间"
        align="center"
        prop="loginTime"
        width="160"
        sortable
        :sort-method="sortTime"
        :sort-orders="['descending', 'ascending']"
      >
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
import { getLogininforPageList, deleteLogininforApi } from '#/api';

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
    let result = await getLogininforPageList(
      addDateRange(queryParams, dateRange.value),
    );
    list.value = result.list;
    total.value = result.total;
    loading.value = false;
  } catch {}
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

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.id);
  multiple.value = !selection.length;
}

const handleSizeChange = (val) => {
  queryParams.pageSize = val;
  getList();
};

const handleCurrentChange = (val) => {
  queryParams.pageNo = val;
  getList();
};

/** 删除按钮操作 */
function handleDelete() {
  const operIds = ids.value;
  ElMessageBox.confirm(
    '是否确认删除日志编号为"' + operIds + '"的数据项？',
    '提示',
    { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' },
  )
    .then(async () => {
      let result = await deleteLogininforApi(operIds);
      if (result) {
        getList();
        ElMessage.success('删除成功');
      }
    })
    .catch(() => {});
}

/** 清空按钮操作 */
// function handleClean() {
//   ElMessageBox.confirm('是否确认清空所有操作日志数据项？')
//     .then(function () {
//       return cleanOperlog();
//     })
//     .then(() => {
//       getList();
//       ElMessage.success('清空成功');
//     })
//     .catch(() => {});
// }

// /** 导出按钮操作 */
// function handleExport() {
//   download(
//     'monitor/operlog/export',
//     {
//       ...queryParams,
//     },
//     `operlog_${new Date().getTime()}.xlsx`,
//   );
// }

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
