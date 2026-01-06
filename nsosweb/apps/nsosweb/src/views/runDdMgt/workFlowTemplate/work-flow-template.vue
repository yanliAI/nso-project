<template>
  <Page auto-content-height>
    <el-container class="h-full bg-white">
      <el-header height="45px">
        <el-form
          ref="flowForm"
          :inline="true"
          :model="data.form"
          label-position="right"
          class="demo-form-inline"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item label="业务流程名称:" prop="workflowName">
                <el-input
                  v-model="data.form.flowName"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <div style="width: 100%">
                  <el-button type="primary" :icon="Plus" @click="add">新增</el-button>
                  <el-button type="primary" :icon="Delete" @click="del">删除</el-button>
                  <el-button type="primary" :icon="Search" @click="query">查询</el-button>
                  <el-button type="info" :icon="RefreshLeft" @click="reset">重置</el-button>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <el-main style="height: calc(100% - 45px)">
        <el-table
          border
          ref="workFlowTab"
          :data="data.tableData"
          style="width: 100%; height: 100%"
        >
          <el-table-column type="index" fixed width="70" label="#" align="center" />
          <el-table-column type="selection" width="70"  align="center"/>
          <el-table-column prop="workflowCode" label="业务流程编号"  width="230" align="center"/>
          <el-table-column prop="workflowName" label="业务流程名称" align="center"/>
          <el-table-column prop="workflowOrder" label="业务流程排序号" align="center"  width="150"/>
          <!-- <el-table-column prop="creatorId" label="创建人" align="center" column-key="NSOS_USER_NAME" :formatter="formatDrop" width="160"/>
          <el-table-column prop="createTime" label="创建时间" align="center"  width="160" :formatter="formatTimestamp"/> -->
          <el-table-column prop="updatorId" label="最后修改人" align="center" column-key="NSOS_USER_NAME" :formatter="formatDrop" width="160"/>
          <el-table-column prop="updateTime" label="最后修改时间" align="center"  width="160" :formatter="formatTimestamp"/>
          <el-table-column label="操作" align="center"  width="130">
            <template #default="{ row }">
              <a class="option-edit" @click="handleEdit(row)">编辑</a>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer height="45px">
        <el-pagination
          v-model:current-page="data.pageInfo.pageNo"
          v-model:page-size="data.pageInfo.pageSize"
          :total="data.pageInfo.total"
          :page-sizes="[20, 50, 100, 200]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="currentChange"
        ></el-pagination>
      </el-footer>
    </el-container>
    <addDialog
      v-if="data.dialogShow"
      :title="data.title"
      :rowInfo="data.rowInfo"
      @switchDialog="switchDialog"
      @query="query"
      style="width: 360px; height: 280px"
    />
  </Page>
</template>

<script lang="ts" setup>
import {
  ElTable,
  ElTableColumn,
  ElFormItem,
  ElForm,
  ElInput,
  ElButton,
  ElSelect,
  ElPagination,
  ElMessage,
  ElMessageBox,
  ElContainer,
  ElHeader,
  ElMain,
  ElFooter,
  type FormInstance,
} from 'element-plus';
import { reactive, ref, onMounted, nextTick } from 'vue';
import { Search, RefreshLeft, Plus, Delete } from '@element-plus/icons-vue';
import addDialog from './workflowAddDialog.vue';
import { requestClient } from '#/api/request';

//import { reactive, ref, onMounted } from 'vue';
import { useDropStore } from '#/store';
import { tDateTimeFormat, formatDrop } from '#/utils/commonUtil.ts';
import { useVbenModal } from '@vben/common-ui';

const dropList = reactive({});
onMounted(async () => {
  const dropStore = useDropStore();
  const dropType = ['NSOS_USER_NAME'];
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);
  query();
});

// onMounted(() => {
//   nextTick().then(() => {
//     query();
//   });
// });
const workFlowTab = ref();
const flowForm = ref<FormInstance>();

const data = reactive({
  dialogShow: false,
  tableData: [],
  rowInfo: {},
  title: '',
  form: {
    flowName: '',
    flowClassify: '',
  },
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0,
  },
});

const switchDialog = (isOpen: boolean) => {
  data.dialogShow = isOpen;
};

interface queryParams {
  workflowName?: string;
  pageNo: number;
  pageSize: number;
  sortFieldName: string;
  sortType: string;
}

const params: queryParams = reactive({
  workflowName: data.form.flowName,
  pageNo: data.pageInfo.pageNo,
  pageSize: data.pageInfo.pageSize,
});

async function getFlowTableApi(params: queryParams) {
  return requestClient.post(
    import.meta.env.VITE_NSOSGZ + '/synWorkflowInfo/query',
    params,
  );
}

const deleteList = [];

async function batchDeleteApi(params: Object[]) {
  return requestClient.post(
    import.meta.env.VITE_NSOSGZ + '/synWorkflowInfo/batchDelete',
    params,
  );
}

const query = async () => {
  params.workflowName = data.form.flowName;
  const { list, pageNo, count } = await getFlowTableApi(params);
  data.tableData = list;
  data.pageInfo.pageNo = pageNo;
  data.pageInfo.total = count;
};

const add = () => {
  data.title = '新增';
  data.dialogShow = true;
};

const del = () => {
  if (workFlowTab.value.getSelectionRows().length === 0) {
    ElMessage.warning('请先选择要删除的流程');
    return;
  }
  ElMessageBox.confirm('确定要删除这些流程吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      batchDel();
    })
    .catch(() => {
      ElMessage.info('已取消删除');
    });
};

const batchDel = async () => {
  try {
    await batchDeleteApi(workFlowTab.value.getSelectionRows());
    query();
    ElMessage.success('删除成功');
  } catch (error) {
    console.error('删除分类失败:', error);
    ElMessage.error('删除分类失败');
  }
};

const reset = () => {
  data.form.flowName = '';
  data.form.flowClassify = '';
};

const handleSizeChange = (val: number) => {
  data.pageInfo.pageSize = val;
  params.pageSize = val;
  query();
};

const currentChange = (val: number) => {
  data.pageInfo.pageNo = val;
  params.pageNo = val;
  query();
};

function formatTimestamp(row, column, cellValue) {
  const date = new Date(cellValue);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function handleEdit(val) {
  data.title = '编辑';
  data.rowInfo = val;
  data.dialogShow = true;
}
</script>
<style scoped>
.option-edit {
  color: #006be6;
}

.option-edit:hover {
  cursor: pointer;
}

.demo-form-inline .el-input {
  --el-input-width: 100%;
}

.demo-form-inline .el-select {
  --el-select-width: 100%;
}

:deep(.el-date-editor.el-input, .el-date-editor.el-input__wrapper){
  width: 100%;
}

:deep(.el-form--inline .el-form-item){
  width: calc(100% - 20px);
  margin-right: 20px;
  margin-bottom: 12px;
}

:deep(.el-main){
  padding: 0;
}
</style>
