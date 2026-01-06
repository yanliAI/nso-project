<template>
  <div style="padding: 20px">
    <el-form :inline="true" :model="searchParams" label-position="right">
      <el-form-item label="流程标识:">
        <el-input
          v-model="searchParams.key"
          clearable
          style="width: 200px"
        ></el-input>
      </el-form-item>
      <el-form-item label="流程名称:">
        <el-input
          v-model="searchParams.name"
          style="width: 200px"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="版本:">
        <el-select v-model="searchParams.latest" style="width: 200px">
          <el-option label="只看新版本" value="true"></el-option>
          <el-option label="全部版本" value="false"></el-option>
        </el-select>
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
      <el-table-column prop="id" label="流程定义ID"></el-table-column>
      <el-table-column prop="deploymentId" label="流程部署ID"></el-table-column>
      <el-table-column prop="key" label="流程标识"></el-table-column>
      <el-table-column prop="name" label="流程名称"></el-table-column>
      <el-table-column
        prop="resourceName"
        label="流程资源定义"
      ></el-table-column>
      <el-table-column prop="version" label="版本号"></el-table-column>
      <el-table-column prop="version" width="200" label="详情">
        <template #default="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleDefinition(scope.$index, scope.row)"
            >查看定义</el-button
          >
          <el-button
            size="mini"
            type="text"
            @click="handleProcess(scope.$index, scope.row)"
            >流程图</el-button
          >
        </template>
      </el-table-column>
      <el-table-column prop="version" label="操作" width="240">
        <template #default="scope">
          <el-button
            v-if="scope.row.suspended"
            size="mini"
            type="text"
            @click="handleActive(scope.$index, scope.row)"
            >激活</el-button
          >
          <el-button
            v-if="!scope.row.suspended"
            size="mini"
            type="text"
            @click="handleHangOff(scope.$index, scope.row)"
            >挂起</el-button
          >
          <el-button
            size="mini"
            type="text"
            @click="handleExchange(scope.$index, scope.row)"
            >转为模型</el-button
          >
          <el-button
            size="mini"
            type="text"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
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
    <el-dialog title="上传部署文件" v-model="showAddDialog" width="30%">
      <input id="deployFile" type="file" />
      <div>提示：仅允许导入"bpmn"、"xml"或"zip"格式文件！</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleUpload">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="`${type === 'hang' ? '挂起' : '激活'}流程定义`"
      v-model="showHangOffDialog"
      width="30%"
    >
      <el-switch
        v-model="suspend.value1"
        :active-text="`${type === 'hang' ? '挂起' : '激活'}关联流程实例`"
      />
      <br />
      <el-switch
        v-model="suspend.value2"
        :active-text="`定时${type === 'hang' ? '挂起' : '激活'}`"
      />
      <br />
      <el-date-picker
        :disabled="!suspend.value2"
        v-model="suspend.date"
        value-format="yyyy-MM-dd HH:mm:ss"
        type="datetime"
        :placeholder="`选择${type === 'hang' ? '挂起' : '激活'}时间`"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="showHangOffDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleSuspendRequest"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
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
import {
  Search,
  Plus,
  Download,
  Delete,
  Refresh,
} from '@element-plus/icons-vue';
import {
  getProcesslists,
  exchangeById,
  deleteProcessByDeployId,
  uploadProcess,
  suspendProcess,
  activateProcess,
} from '#/api';
import { openWindow } from '#/utils/commonUtil.ts';

// 响应式数据
const responseData = ref({});
const searchParams = ref({
  key: '',
  name: '',
  latest: 'true',
  orderByColumn: 'processSort',
  isAsc: 'asc',
  pageNum: 1,
  pageSize: 10,
});
const showAddDialog = ref(false);
const showHangOffDialog = ref(false);
const suspend = ref({
  value1: true,
  value2: false,
  date: '',
});
const currentRow = ref(null);
const type = ref('');

// 计算属性
const tableData = ref([]);
const total = ref(0);

// 生命周期
onMounted(() => {
  getListAndRenderByParams(searchParams.value);
});

// 方法
const getListAndRenderByParams = async (params) => {
  const res = await getProcesslists(params);
  tableData.value = res.records;
  total.value = res.total;
};

const handlePageChange = ({ pageNum, pageSize }) => {
  searchParams.value.pageNum = pageNum;
  searchParams.value.pageSize = pageSize;
  getListAndRenderByParams(searchParams.value);
};

const search = () => {
  getListAndRenderByParams(searchParams.value);
};

const reset = () => {
  searchParams.value.key = '';
  searchParams.value.name = '';
  searchParams.value.latest = 'true';
  getListAndRenderByParams(searchParams.value);
};

const handleDefinition = (index, row) => {
  const { deploymentId, resourceName } = row;
  const path = `/flow/manage/showProcessDefinition/${deploymentId}?resource=${resourceName}`;
  openWindow(path);
};

const handleProcess = (index, row) => {
  const { id } = row;
  console.log('id是多少', id);
  const path = `/flow/manage/showresource?pdid=${id}`;
  openWindow(path);
};

const handleExchange = async (index, row) => {
  const { id } = row;
  await exchangeById(id);
  ElMessage.success('转化成功!');
};

const handleHangOff = (index, row) => {
  showHangOffDialog.value = true;
  type.value = 'hang';
  currentRow.value = row;
};

const handleActive = (index, row) => {
  showHangOffDialog.value = true;
  type.value = 'active';
  currentRow.value = row;
};

const handleSuspendRequest = async () => {
  const { id } = currentRow.value;
  console.log('测试数据', id);
  const params = {
    flag: true,
    pdid: id,
  };

  if (suspend.value.date) {
    params.date = suspend.value.date;
  }

  try {
    if (type.value === 'hang') {
      await suspendProcess(params);
      ElMessage.success('挂起成功!');
    } else {
      await activateProcess(params);
      ElMessage.success('激活成功!');
    }
    showHangOffDialog.value = false;
    getListAndRenderByParams(searchParams.value);
  } catch (error) {
    ElMessage.error(error.message);
  }
};

const handleDelete = (index, row) => {
  ElMessageBox.confirm('确定删除该条流程信息吗？', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    const { deploymentId } = row;
    await deleteProcessByDeployId(deploymentId);
    ElMessage.success('删除成功!');
    getListAndRenderByParams(searchParams.value);
  });
};

const handleUpload = async () => {
  const deploy = document.querySelector('#deployFile');
  const uploadfile = deploy.files[0];
  await uploadProcess({ uploadfile });
  showAddDialog.value = false;
  console.log('file-name');
  getListAndRenderByParams(searchParams.value);
};

const handleSizeChange = (val) => {
  searchParams.value.pageSize = val;
  getListAndRenderByParams(searchParams.value);
};

const handleCurrentChange = (val) => {
  searchParams.value.pageNum = val;
  getListAndRenderByParams(searchParams.value);
};
</script>

<style>
.search-bar {
  display: flex;
  margin-top: 8px;
  margin-left: 8px;
}
label {
  font-size: 14px;
  color: #606266;
  margin-right: 8px;
}
.el-input {
  display: inline-block;
  width: 300px;
  margin-right: 10px;
}
.el-switch {
  margin-bottom: 16px;
}
</style>
