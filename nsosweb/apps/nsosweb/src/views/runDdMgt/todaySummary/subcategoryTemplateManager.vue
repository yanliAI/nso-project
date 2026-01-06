<template>
  <el-container class="h-full bg-white">
    <el-header height="45px">
      <el-form label-width="auto" :inline="true" :model="queryForm" label-position="right" class="demo-form-inline">
        <el-row>
          <el-col :span="6">
            <el-form-item label="子类名称:">
              <el-input v-model="queryForm.workbenceTypeName"  clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所属分类:" filterable>
              <el-select v-model="queryForm.workbenceClassCode"  clearable>
                <el-option v-for="item in dropList.NSOS_WORKBENCE_CLASS_CODE" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="4">
            <el-form-item label="省编码:">
              <el-input v-model="queryForm.provinceCode"  clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="局编码:">
              <el-input v-model="queryForm.bureauCode"  clearable />
            </el-form-item>
          </el-col> -->
          <el-col :span="8" class="">
            <el-button type="primary" class="ml-4" :icon="Plus" @click="add">新增</el-button>
            <el-button type="primary" class="ml-4" :icon="Delete" @click="batchDelete">批量删除</el-button>
            <el-button type="primary" class="ml-4" :icon="Search" @click="query">查询</el-button>
            <el-button type="info" plain class="ml-4" :icon="RefreshLeft" @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-main style="height: calc(100% - 90px);">
      <el-table border size="small" style="height: 100%;" ref="workflowTab" :data="workbenceTypeCode" @selection-change="handleSelectionChange">
        <el-table-column type="index" fixed width="70" label="#" align="center" />
        <el-table-column type="selection" width="70"  align="center"/>
        <el-table-column prop="workbenceTypeCode" label="子类编码" width="150" align="center"></el-table-column>
        <el-table-column prop="workbenceTypeName" label="子类名称"  heard-align="center" align="left"></el-table-column>
        <el-table-column prop="workbenceClassCode" label="所属分类" width="350" align="center" column-key="NSOS_WORKBENCE_CLASS_CODE" :formatter="formatDrop"></el-table-column>
        <el-table-column prop="workbenceTypeOrder" label="子类排序号" width="180" align="center"></el-table-column>
        <el-table-column prop="provinceCode" label="省编码" width="150" align="center"></el-table-column>
        <el-table-column prop="bureauCode" label="局编码" width="150" align="center"></el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template #default="scope">
            <el-button size="small" @click="editData(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer height="45px">
      <el-pagination :current-page="currentPage" :page-size="pageSize" :total="total" class="mt-1"
      @size-change="handleSizeChange"  @current-change="handlePageChange" :page-sizes="[20, 50, 100, 200]"
        layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    </el-footer>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" :before-close="handleClose">
      <el-form :model="form" label-width="100px">
        <el-form-item label="子类编码">
          <el-input v-model="form.workbenceTypeCode"></el-input>
        </el-form-item>
        <el-form-item label="子类名称">
          <el-input v-model="form.workbenceTypeName"></el-input>
        </el-form-item>
        <el-form-item label="子类排序号">
          <el-input v-model="form.workbenceTypeOrder" type="number" placeholder="请输入排序号(数字)"></el-input>
        </el-form-item>
        <el-form-item label="所属大类编码">
          <el-select v-model="form.workbenceClassCode" placeholder="请选择所属大类" @focus="queryClassCode">
            <!-- <el-option v-for="category in classCodes" :key="category" :value="category"></el-option> -->
            <el-option v-for="item in dropList.NSOS_WORKBENCE_CLASS_CODE" :key="item.value" :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="省编码">
          <el-input v-model="form.provinceCode"></el-input>
        </el-form-item>
        <el-form-item label="局编码">
          <el-input v-model="form.bureauCode"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false, index = -1">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </el-container>
</template>

<script lang="ts" setup>
import {ElTable,ElTableColumn,ElFormItem,ElForm,ElInput,ElButton,ElRow, ElCol,ElSelect,ElPagination,ElContainer,ElHeader,ElMain,ElFooter,ElDialog,ElMessage,ElMessageBox, SIZE_INJECTION_KEY} from 'element-plus';
import { ref, reactive, computed, onMounted } from 'vue';
import { requestClient } from '#/api/request';
import { useDropStore } from '#/store';
import { Search, RefreshLeft, Plus, Delete } from '@element-plus/icons-vue';
import { tDateTimeFormat, formatDrop } from '#/utils/commonUtil.ts';

const dropList: any = reactive({});

var index = ref(-1);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);
const workflowTab = ref(null);
const dialogVisible = ref(false);
const dialogTitle = ref('');
const selectedRows = ref([]);
const workbenceTypeCode = ref([]);
const queryForm = reactive({
  workbenceTypeName: '',
  workbenceClassCode: '',
  provinceCode: '',
  bureauCode: ''
});
const form = reactive({
  workbenceTypeCode: '',
  workbenceTypeName: '',
  workbenceTypeOrder: '',
  workbenceClassCode: '',
  provinceCode: '',
  bureauCode: '',
});

const classCodes =  ref([]);
const queryClassCode =  async () => {
  const code = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/odWorkbenchClassTemplate/returnCodeList',{});
  classCodes.value = code;
}

const add = () => {
  dialogTitle.value = '新增子类';
  form.id = null;
  form.workbenceTypeCode = '';
  form.workbenceTypeName = '';
  form.workbenceTypeOrder = '';
  form.workbenceClassCode = '';
  form.provinceCode = '';
  form.bureauCode = '';
  dialogVisible.value = true;
}

const query = async () => {
  const response = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/odWorkbenchTypeTemplate/mHqueryTypeTemplatePagePagination', {
    "pageNo": currentPage.value,
    "pageSize": pageSize.value,
    "workbenceTypeName": queryForm.workbenceTypeName,
    "workbenceClassCode": queryForm.workbenceClassCode,
    "provinceCode": queryForm.provinceCode,
    "bureauCode": queryForm.bureauCode
  });
  workbenceTypeCode.value = response.list;
  total.value = response.count;
  queryClassCode();
};

const batchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要删除的分类');
    return;
  }
  ElMessageBox.confirm('确定要批量删除这些分类吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    batchDeleteBatch();
  }).catch(() => {
    ElMessage.info('已取消批量删除');
  });
};

const batchDeleteBatch = async () => {
  try {
    //selectedRows.value.map(row => row.workbenceClassCode);
    await requestClient.post(import.meta.env.VITE_NSOSGZ + '/odWorkbenchTypeTemplate/deletebatchData', selectedRows.value);
    query();
    selectedRows.value = [];
    ElMessage.success('批量删除成功');
  } catch (error) {
    console.error('批量删除分类失败:', error);
    ElMessage.error('批量删除分类失败');
  }
}

const reset = () => {
  queryForm.workbenceTypeName = '';
  queryForm.workbenceClassCode = '';
  queryForm.provinceCode = '';
  queryForm.bureauCode = '';
  query();
}

const editData = (row) => {
  dialogTitle.value = '编辑分类';
  form.workbenceTypeCode = row.workbenceTypeCode;
  form.workbenceTypeName = row.workbenceTypeName;
  form.workbenceTypeOrder = row.workbenceTypeOrder;
  form.workbenceClassCode = row.workbenceClassCode;
  form.provinceCode = row.provinceCode;
  form.bureauCode = row.bureauCode;
  dialogVisible.value = true;
  index.value = workbenceTypeCode.value.findIndex((item) => item.id === row.id);
};

const handleClose = (done) => {
  index.value = -1;
  done();
}

const deleteOneData =  (id) => {
  ElMessageBox.confirm('确定要删除该分类吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    deleteDataOne(id);
  }).catch(() => {
    ElMessage.info('已取消删除');
  });
};

const deleteDataOne = async (id) => {
  try{
      await requestClient.post(import.meta.env.VITE_NSOSGZ + '/odWorkbenchTypeTemplate/deleteOneData', {"id": id});
      query();
      ElMessage.success('删除成功');
  }catch (error) {
      console.error('删除分类失败:', error);
      ElMessage.error('删除分类失败');
  }
}

const submitForm = async () => {
  const parm = {
    "workbenceTypeCode": form.workbenceTypeCode,
    "workbenceTypeName": form.workbenceTypeName,
    "workbenceTypeOrder": form.workbenceTypeOrder,
    "workbenceClassCode": form.workbenceClassCode,
    "provinceCode": form.provinceCode,
    "bureauCode": form.bureauCode
  }
  if (index.value !== -1) {
    var temp = workbenceTypeCode.value[index.value];
    temp.workbenceTypeCode = form.workbenceTypeCode;
    temp.workbenceTypeName = form.workbenceTypeName;
    temp.workbenceTypeOrder = form.workbenceTypeOrder;
    temp.workbenceClassCode = form.workbenceClassCode;
    temp.provinceCode = form.provinceCode;
    temp.bureauCode = form.bureauCode;
    var response = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/odWorkbenchTypeTemplate/add', temp);
    index.value = -1;
  }else{
     response = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/odWorkbenchTypeTemplate/add', parm);
  }
  query();
  dialogVisible.value = false;
  if(response.id){
  ElMessage.success('操作成功');
  }else{
    ElMessage.error('操作失败');
  }
};

const handleSelectionChange = (val) => {
  selectedRows.value = val;
};

const handleSizeChange = (size) => {
  pageSize.value = size;
  query();
}

const handlePageChange = (page) => {
  currentPage.value = page;
  query();
};

onMounted(async () => {
  query();
  const dropStore = useDropStore();
  await dropStore.initDrops(['NSOS_WORKBENCE_CLASS_CODE']);
  dropStore.get(dropList, ['NSOS_WORKBENCE_CLASS_CODE']);
  query();
});
</script>

<style scoped>
 .cell {
    text-align: center;
  }

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

.primary {
  color: hsl(var(--primary));
}
</style>
