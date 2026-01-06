 <template>
  <el-container class="h-full bg-white">
    <el-header height="45px">
      <el-form label-width="auto" :inline="true" :model="queryForm" label-position="right" class="demo-form-inline">
        <el-row>
          <el-col :span="8">
            <el-form-item label="分类名称:">
              <el-input v-model="queryForm.workbenceClassName" clearable />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="4">
            <el-form-item label="省编码:">
              <el-input v-model="queryForm.provinceCode" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="局编码:">
              <el-input v-model="queryForm.bureauCode" clearable />
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
      <el-table border size="small" style="height: 100%;" ref="workflowTab" :data="workbenceClassTab" @selection-change="handleSelectionChange">
        <el-table-column type="index" fixed width="70" label="#" align="center" />
        <el-table-column type="selection" width="70" align="center" />
        <el-table-column prop="workbenceClassCode" label="分类编码" width="250" align="center"></el-table-column>
        <el-table-column prop="workbenceClassName" label="分类名称"  align="center"></el-table-column>
        <el-table-column prop="workbenceClassOrder" label="分类排序号" width="180" align="center"></el-table-column>
        <el-table-column prop="provinceCode" label="省编码" width="180"  align="center"></el-table-column>
        <el-table-column prop="bureauCode" label="局编码" width="180"  align="center"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button size="small" @click="editData(scope.row)">编辑</el-button>
            <!-- <el-button size="small" type="primary" @click="deleteOneData(scope.row.id)">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer height="45px">
      <el-pagination :current-page="currentPage" :page-size="pageSize" :total="total" class="mt-1"
        @size-change="handleSizeChange" @current-change="handlePageChange" :page-sizes="[20, 50, 100, 200]"
        layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    </el-footer>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" :before-close="handleClose">
      <el-form :model="form" label-width="100px">
        <el-form-item label="分类编码">
          <el-input v-model="form.workbenceClassCode"></el-input>
        </el-form-item>
        <el-form-item label="分类名称">
          <el-input v-model="form.workbenceClassName"></el-input>
        </el-form-item>
        <el-form-item label="分类排序号">
          <el-input v-model="form.workbenceClassOrder" type="number" placeholder="请输入子类排序号(数字)"></el-input>
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
import { Search, RefreshLeft, Plus, Delete } from '@element-plus/icons-vue';

var index = ref(-1);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);
const workflowTab = ref(null);
const dialogVisible = ref(false);
const dialogTitle = ref('');
const selectedRows = ref([]);
const workbenceClassTab = ref([]);
const queryForm = reactive({
  workbenceClassName: '',
  provinceCode: '',
  bureauCode: ''
});
const form = reactive({
  workbenceClassCode: '',
  workbenceClassName: '',
  workbenceClassOrder: '',
  provinceCode: '',
  bureauCode: '',
});

const add = () => {
  dialogTitle.value = '新增分类';
  form.id = null;
  form.workbenceClassCode = '';
  form.workbenceClassName = '';
  form.workbenceClassOrder = '';
  form.provinceCode = '';
  form.bureauCode = '';
  dialogVisible.value = true;
}

const query = async () => {
  const response = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/odWorkbenchClassTemplate/mHQueryDataListByPagePagination', {
    "pageNo": currentPage.value,
    "pageSize": pageSize.value,
    //"sortFieldName": 'workbenceClassOrder',
    //"sortType": 'asc',
    "workbenceClassName": queryForm.workbenceClassName,
    "provinceCode": queryForm.provinceCode,
    "bureauCode": queryForm.bureauCode
  });
  workbenceClassTab.value = response.list;
  total.value = response.count;
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
    await requestClient.post(import.meta.env.VITE_NSOSGZ + '/odWorkbenchClassTemplate/deletebatchData', selectedRows.value);
    query();
    selectedRows.value = [];
    ElMessage.success('批量删除成功');
  } catch (error) {
    console.error('批量删除分类失败:', error);
    query();
    //ElMessage.error(error.message);
  }
}

const reset = () => {
  queryForm.workbenceClassName = '';
  queryForm.provinceCode = '';
  queryForm.bureauCode = '';
  query();
}

const editData = (row) => {
  dialogTitle.value = '编辑分类';
  form.workbenceClassCode = row.workbenceClassCode;
  form.workbenceClassName = row.workbenceClassName;
  form.workbenceClassOrder = row.workbenceClassOrder;
  form.provinceCode = row.provinceCode;
  form.bureauCode = row.bureauCode;
  dialogVisible.value = true;
  index.value = workbenceClassTab.value.findIndex((item) => item.id === row.id);
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
      await requestClient.post(import.meta.env.VITE_NSOSGZ + '/odWorkbenchClassTemplate/deleteOneData', {"id": id});
      query();
      ElMessage.success('删除成功');
  }catch (error) {
      console.error('删除分类失败:', error);
      ElMessage.error('删除分类失败');
  }
}

const submitForm = async () => {
  const parm = {
    "workbenceClassCode": form.workbenceClassCode,
    "workbenceClassName": form.workbenceClassName,
    "workbenceClassOrder": form.workbenceClassOrder,
    "provinceCode": form.provinceCode,
    "bureauCode": form.bureauCode
  }
  if (index.value !== -1) {
    var temp = workbenceClassTab.value[index.value];
    temp.workbenceClassCode = form.workbenceClassCode;
    temp.workbenceClassName = form.workbenceClassName;
    temp.workbenceClassOrder = form.workbenceClassOrder;
    temp.provinceCode = form.provinceCode;
    temp.bureauCode = form.bureauCode;
    var response = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/odWorkbenchClassTemplate/add', temp);
    index.value = -1;
  }else{
     response = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/odWorkbenchClassTemplate/add', parm);
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

onMounted(() => {
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
