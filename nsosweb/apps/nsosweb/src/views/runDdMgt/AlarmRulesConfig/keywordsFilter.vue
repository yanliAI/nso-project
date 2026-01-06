<template>
  <Page auto-content-height>
  <el-container class="h-full bg-white">
    <el-header height="45px"
      ><el-form
        ref="keywordForm"
        :inline="true"
        :model="data.form"
        label-position="right"
        class="demo-form-inline"
      >
        <el-row>
          <el-col :span="4"
            ><el-form-item label="关键字:" prop="keywords">
              <el-input v-model="data.form.keywords" clearable /> </el-form-item
          ></el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="add">新增</el-button>
              <el-button type="primary" @click="del">删除</el-button>
              <el-button type="primary" @click="query">查询</el-button>
              <el-button type="primary" @click="save">保存</el-button>
              <el-button type="info" @click="reset(keywordForm)">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-main style="height: calc(100%-90px)"
      ><el-table
        border
        ref="keywordTab"
        :data="data.tableData"
        style="width: 100%; height: 100%"
        @row-dblclick="onClickEdit"
      >
        <el-table-column type="index" />
        <el-table-column type="selection" />
        <el-table-column prop="filterCode" label="参数编码">
          <template #default="scope">
            <span v-show="scope.$index !== data.editIndex">
              {{ scope.row.filterCode }}
            </span>
            <el-input
              v-show="scope.$index === data.editIndex"
              v-model="scope.row.filterCode"
              @change="handleChange(scope.row)"
            >
            </el-input>
          </template>
        </el-table-column>
        <el-table-column prop="keywords" label="关键字">
          <template #default="scope">
            <el-input
              v-if="scope.$index === data.editIndex"
              v-model="scope.row.keywords"
              @change="handleChange(scope.row)"
            >
            </el-input>
            <span v-else>
              {{ scope.row.keywords }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="isValid" label="是否有效">
          <template #default="scope">
            <el-select
              v-if="scope.$index === data.editIndex"
              v-model="scope.row.isValid"
              @change="handleChange(scope.row)"
              clearable
            >
              <el-option
                v-for="item in dropList.NSOS_YES_OR_NO"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <span v-else>
              {{
                scope.row.isValid
                  ? scope.row.isValid === dropList.NSOS_YES_OR_NO[0].value
                    ? dropList.NSOS_YES_OR_NO[0].label
                    : dropList.NSOS_YES_OR_NO[1].label
                  : ''
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="orderNo" label="排序号">
          <template #default="scope">
            <el-input
              v-if="scope.$index === data.editIndex"
              v-model="scope.row.orderNo"
              @change="handleChange(scope.row)"
            >
            </el-input>
            <span v-else>
              {{ scope.row.orderNo }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="updatorId" label="最后修改人" />
        <el-table-column
          prop="updateTime"
          label="最后修改时间"
          :formatter="formatTimestamp"
        /> </el-table
    ></el-main>
    <el-footer height="45px"
      ><el-pagination
        v-model:current-page="data.pageInfo.pageNo"
        v-model:page-size="data.pageInfo.pageSize"
        :total="data.pageInfo.total"
        :page-sizes="[20, 50, 100, 200]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="currentChange"
      ></el-pagination
    ></el-footer>
    <addDialog
      v-if="data.dialogShow"
      :title="data.title"
      :rowInfo="data.rowInfo"
      @switchDialog="switchDialog"
      @query="query"
      style="width: 500px; height: 220px"
    />
  </el-container>
</Page>
</template>

<script lang="ts" setup>
import {
  ElRow,
  ElCol,
  ElContainer,
  ElHeader,
  ElMain,
  ElFooter,
  ElTable,
  ElTableColumn,
  ElFormItem,
  ElForm,
  ElInput,
  ElButton,
  ElPagination,
  ElMessage,
  ElMessageBox,
  ElSelect,
  type FormInstance,
} from 'element-plus';
import { reactive, ref, onMounted, nextTick } from 'vue';
import { requestClient } from '#/api/request';
import { useDropStore } from '#/store';

const dropList: any = reactive({});

onMounted(async () => {
  const dropStore = useDropStore();
  await dropStore.initDrops(['NSOS_YES_OR_NO']);
  dropStore.get(dropList, ['NSOS_YES_OR_NO']);
  nextTick().then(() => {
    query();
  });
});
const keywordTab = ref();
const keywordForm = ref<FormInstance>();

const data = reactive({
  dialogShow: false,
  tableData: [],
  updateList: [],
  rowInfo: {},
  title: '',
  form: {
    keywords: '',
    isValid: '',
  },
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0,
  },
  editIndex: -1,
});

const switchDialog = (isOpen: boolean) => {
  data.dialogShow = isOpen;
};

interface queryParams {
  keywords: string;
  pageNo: number;
  pageSize: number;
}

const params: queryParams = reactive({
  keywords: data.form.keywords,
  pageNo: data.pageInfo.pageNo,
  pageSize: data.pageInfo.pageSize,
});

async function getFlowTableApi(params: queryParams) {
  return requestClient.post(
    import.meta.env.VITE_NSOSGZ + '/keywordsFilter/query',
    params,
  );
}

async function batchDeleteApi(params: Object[]) {
  return requestClient.post(
    import.meta.env.VITE_NSOSGZ + '/keywordsFilter/batchDelete',
    params,
  );
}

const query = async () => {
  params.keywords = data.form.keywords;
  const { list, pageNo, count } = await getFlowTableApi(params);
  data.tableData = list;
  data.pageInfo.pageNo = pageNo;
  data.pageInfo.total = count;
};

const add = () => {
  if (!data.tableData) {
    data.tableData = [{}];
  } else {
    data.tableData.push({});
  }
  data.editIndex = data.tableData.length - 1;
};

const del = () => {
  if (keywordTab.value.getSelectionRows().length === 0) {
    ElMessage.warning('请先选择要删除项');
    return;
  }
  ElMessageBox.confirm('确定要删除这些项目吗?', '提示', {
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
    await batchDeleteApi(keywordTab.value.getSelectionRows());
    query();
    ElMessage.success('删除成功');
  } catch (error) {
    console.error('删除分类失败:', error);
    ElMessage.error('删除分类失败');
  }
};

const reset = (keywordForm: FormInstance | undefined) => {
  if (!keywordForm) return;
  keywordForm.resetFields();
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
  if (cellValue === '' || !cellValue) {
    return '';
  }
  const date = new Date(cellValue);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function formatIsValid(row, column, cellValue) {
  if (cellValue === '' || !cellValue) {
    return '';
  }
  for (let i = 0; i < dropList.NSOS_YES_OR_NO.length; i++) {
    if (dropList.NSOS_YES_OR_NO[i].value === cellValue) {
      return dropList.NSOS_YES_OR_NO[i].label;
    }
  }
}

function onClickEdit(row, column, event) {
  data.editIndex = data.tableData.indexOf(row);
}

async function saveDataApi(param: Object[]) {
  return requestClient.post(
    import.meta.env.VITE_NSOSGZ + '/keywordsFilter/batchSave',
    param,
  );
}

async function save() {
  await saveDataApi(data.updateList);
  query();
  data.editIndex = -1;
}

function handleChange(row) {
  if (!data.updateList.includes(row)) {
    data.updateList.push(row);
  }
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

.option-edit:hover {
  cursor: pointer;
}
</style>
