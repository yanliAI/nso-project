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
            <el-col :span="6">
              <el-form-item label="业务环节名称:" prop="busiTacheName">
                <el-input
                  v-model="data.form.busiTacheName"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="协同流程名称">
                <el-select
                  v-model="data.form.workflowCode"
                  placeholder="请选择协同流程名称"
                >
                  <el-option
                    v-for="item in dropList.NSOS_WORKFLOW_NAME"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" :icon="Plus" @click="add">新增</el-button>
                <el-button type="primary" :icon="Delete" @click="del">删除</el-button>
                <el-button type="primary" :icon="Search" @click="query">查询</el-button>
                <el-button type="info" :icon="RefreshLeft" @click="reset">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <el-main style="height: calc(100% - 45px)">
        <el-table
          border
          ref="segmentTab"
          :data="data.tableData"
          style="width: 100%; height: 100%"
          size="small"
        >
          <el-table-column type="index" fixed width="50" label="#" align="center" />
          <el-table-column type="selection" width="50"  align="center"/>
          <el-table-column prop="busiTacheCode" label="业务环节代码" width="100"  align="center"/>
          <el-table-column prop="busiTacheName" label="业务环节名称" width="150"  align="center"/>
          <el-table-column prop="workflowCode"  label="协同流程名称" align="center" :formatter="CodetoName" />
          <el-table-column prop="busiTacheOrder" label="排序号" width="80"  align="center" />
          <el-table-column
            prop="processedColour"
            label="已办理环节显示颜色"
            width="150"  align="center"
          >
            <template #default="scope">
              <div :style="{ backgroundColor: scope.row.processedColour }">
                {{ scope.row.processedColour }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="processingColour"
            label="办理中环节显示颜色"
           width="150"  align="center"
          >
            <template #default="scope">
              <div :style="{ backgroundColor: scope.row.processingColour }">
                {{ scope.row.processingColour }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="unprocessedColour"
            label="未办理环节显示颜色"
           width="150"  align="center"
          >
            <template #default="scope">
              <div :style="{ backgroundColor: scope.row.unprocessedColour }">
                {{ scope.row.unprocessedColour }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="processTime" label="处理时长"  width="70" align="center"/>
          <!-- <el-table-column prop="creatorId" label="创建人" align="center" column-key="NSOS_USER_NAME" :formatter="formatDrop" width="90"/>
          <el-table-column prop="createTime" label="创建时间" align="center"  width="130" :formatter="formatTimestamp"/> -->
          <el-table-column prop="updatorId" label="最后修改人" align="center" column-key="NSOS_USER_NAME" :formatter="formatDrop" width="130"/>
          <el-table-column prop="updateTime" label="最后修改时间" align="center"  width="150" :formatter="formatTimestamp"/>
          <el-table-column label="操作" align="center">
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
  </Page>
  <addDialog
    v-if="data.dialogShow"
    :title="data.title"
    :rowInfo="data.rowInfo"
    @switchDialog="switchDialog"
    @query="query"
    style="width: 600px; height: 380px"
  />
</template>

<script lang="ts" setup>
import {
  ElTable,
  ElTableColumn,
  ElContainer,
  ElFormItem,
  ElForm,
  ElInput,
  ElButton,
  ElSelect,
  ElOption,
  ElPagination,
  ElRow,
  ElCol,
  ElMessage,
  ElMessageBox,
  type FormInstance,
} from 'element-plus';
import { reactive, ref, onMounted, nextTick } from 'vue';
import addDialog from './segmentAddDialog.vue';
import { Search, RefreshLeft, Plus, Delete } from '@element-plus/icons-vue';
import { requestClient } from '#/api/request';
import { useDropStore } from '#/store';

import { tDateTimeFormat, formatDrop } from '#/utils/commonUtil.ts';
import { useVbenModal } from '@vben/common-ui';


onMounted(async () => {
  const dropStore = useDropStore();
  await dropStore.initDrops(['NSOS_WORKFLOW_NAME','NSOS_USER_NAME']);
  dropStore.get(dropList, ['NSOS_WORKFLOW_NAME','NSOS_USER_NAME']);
  query();
  nextTick().then(() => {
    query();
  });
});


const segmentTab = ref();
const flowForm = ref<FormInstance>();
const dropList: any = reactive({});

const data = reactive({
  dialogShow: false,
  form: {
    busiTacheName: '',
    workflowCode: '',
  },
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0,
  },
  deleteList: [],
  tableData: [],
  title: '',
  rowInfo: {},
});

const switchDialog = (isOpen: boolean) => {
  data.dialogShow = isOpen;
};

interface queryParams {
  busiTacheName?: string;
  workflowCode?: string;
  pageNo: number;
  pageSize: number;
}

const params: queryParams = reactive({
  workflowCode: data.form.workflowCode,
  busiTacheName: data.form.busiTacheName,
  pageNo: data.pageInfo.pageNo,
  pageSize: data.pageInfo.pageSize,
});

async function getFlowTableApi(params: queryParams) {
  return requestClient.post(
    import.meta.env.VITE_NSOSGZ + '/synWorkflowTache/query',
    params,
  );
}

async function batchDeleteApi(params: Object[]) {
  return requestClient.post(
    import.meta.env.VITE_NSOSGZ + '/synWorkflowTache/batchDelete',
    params,
  );
}

const query = async () => {
  params.workflowCode = data.form.workflowCode;
  params.busiTacheName = data.form.busiTacheName;
  const { list, pageNo, count } = await getFlowTableApi(params);
  data.tableData = list;
  //console.log(list, pageNo, count);
  data.pageInfo.pageNo = pageNo;
  data.pageInfo.total = count;
};

const add = () => {
  data.title = '新增';
  data.dialogShow = true;
};

const del = async () => {
  if (segmentTab.value.getSelectionRows().length === 0) {
    ElMessage.warning('请先选择要删除的环节');
    return;
  }
  ElMessageBox.confirm('确定要删除这些环节吗?', '提示', {
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
    await batchDeleteApi(segmentTab.value.getSelectionRows());
    query();
    ElMessage.success('删除成功');
  } catch (error) {
    console.error('删除分类失败:', error);
    ElMessage.error('删除分类失败');
  }
};

const reset = () => {
  data.form.busiTacheName = '';
  data.form.workflowCode = '';
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

function CodetoName(row, column, cellValue) {
  for (let i = 0; i < dropList.NSOS_WORKFLOW_NAME.length; i++) {
    if (dropList.NSOS_WORKFLOW_NAME[i].value === cellValue) {
      return dropList.NSOS_WORKFLOW_NAME[i].label;
    }
  }
}

function handleEdit(val) {
  data.title = '编辑';
  data.rowInfo = val;
  data.dialogShow = true;
}
</script>

<style scoped>
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

:deep(.el-main) {
  padding: 0;
}

.option-edit {
  color: #006be6;
}

.option-edit:hover {
  cursor: pointer;
}
</style>
