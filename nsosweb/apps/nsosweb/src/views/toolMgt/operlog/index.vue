<template>
  <div class="app-container p-4">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="操作日期">
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
      <el-form-item label="ip地址" prop="ip">
        <el-input
          v-model="queryParams.ip"
          placeholder="请输入ip地址"
          clearable
          style="width: 200px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="系统模块" prop="model">
        <el-input
          v-model="queryParams.model"
          placeholder="请输入系统模块"
          clearable
          style="width: 200px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作人员" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入操作人员"
          clearable
          style="width: 200px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="操作类型"
          clearable
          style="width: 200px"
        >
          <el-option label="新增" value="新增" />
          <el-option label="修改" value="修改" />
          <el-option label="删除" value="删除" />
          <el-option label="查询" value="查询" />
          <el-option label="导出" value="导出" />
          <el-option label="导入" value="导入" />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="操作状态"
          clearable
          style="width: 200px"
        >
          <el-option
            v-for="dict in dict.sys_common_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item> -->

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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5"> </el-col>
      <!-- <el-col :span="1.5">
        <el-button type="danger" plain :icon="Delete" @click="handleClean"
          >清空</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain :icon="Download" @click="handleExport"
          >导出</el-button
        >
      </el-col> -->
    </el-row>

    <el-table
      ref="tables"
      :data="list"
      border
      stripe
      @selection-change="handleSelectionChange"
      height="700px"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="日志编号" align="center" prop="id" />
      <el-table-column
        label="系统模块"
        align="center"
        prop="model"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="操作类型" align="center" prop="type">
      </el-table-column>
      <el-table-column
        label="操作人员"
        align="center"
        prop="userName"
        width="110"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="ip地址"
        align="center"
        prop="ip"
        width="130"
        :show-overflow-tooltip="true"
      />
      <!-- <el-table-column
        label="操作地点"
        align="center"
        prop="operLocation"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="操作状态" align="center" prop="status">
      </el-table-column> -->
      <el-table-column
        label="操作时间"
        align="center"
        prop="createTime"
        width="160"
        sortable
        :sort-method="sortTime"
        :sort-orders="['descending', 'ascending']"
      >
      </el-table-column>
      <!-- <el-table-column
        label="消耗时间"
        align="center"
        prop="costTime"
        width="110"
        :show-overflow-tooltip="true"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
        <template #default="scope">
          <span>{{ scope.row.costTime }}毫秒</span>
        </template>
      </el-table-column> -->
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-button
            type="primary"
            link
            :icon="View"
            @click="handleView(scope.row, scope.index)"
            >详细</el-button
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

    <!-- 操作日志详细 -->
    <el-dialog title="操作日志详细" v-model="open" width="1000px">
      <el-form
        class="dialog-form"
        :model="formData"
        label-width="100px"
        :inline="true"
      >
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="操作模块：">{{ formData.model }}</el-form-item>
            <el-form-item label="登录信息："
              >{{ formData.userName }} / {{ formData.ip }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求地址：">{{ formData.url }}</el-form-item>
            <el-form-item label="请求方式：">{{
              formData.requestMethod
            }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作方法：">{{
              formData.method
            }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="请求参数：">{{
              formData.params
            }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="返回参数：">
              <div style="max-height: 300px; overflow: auto">
                {{ formData.jsonResult }}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="操作状态：">
              <div>{{ formData.result }}</div>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item label="消耗时间："
              >{{ formData.costTime }}毫秒</el-form-item
            >
          </el-col> -->
          <el-col :span="8">
            <el-form-item label="操作时间：">{{
              formData.createTime
            }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="描述信息：">{{
              formData.description
            }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer class="dialog-footer">
        <el-button @click="open = false">关 闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { getOperlogPageList, deleteOperlogApi } from '#/api';

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
// 是否显示弹出层
const open = ref(false);
// 日期范围
const dateRange = ref([]);
// 表单参数
const formData = ref({});
// 查询参数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 20,
  ip: undefined,
  model: undefined,
  userName: undefined,
  businessType: undefined,
  status: undefined,
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
    let result = await getOperlogPageList(
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

/** 详细按钮操作 */
function handleView(row) {
  open.value = true;
  formData.value = row;
}

/** 删除按钮操作 */
function handleDelete() {
  const operIds = ids.value;
  ElMessageBox.confirm(
    '是否确认删除日志编号为"' + operIds + '"的数据项？',
    '提示',
    { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' },
  )
    .then(async () => {
      let result = await deleteOperlogApi(operIds);
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
