<template>
  <el-container class="h-full bg-white">
    <el-header height="45px">
      <el-form label-width="auto" :inline="true" :model="queryForm" label-position="right" class="demo-form-inline">
        <el-row>
          <el-col :span="4">
            <el-form-item label="告警对象类别:" filterable>
              <el-select v-model="queryForm.alarmObjectType" @focus="queryObjectType" clearable>
                <el-option v-for="category in objectTypes" :key="category" :value="category"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="告警动作类型:">
              <el-input v-model="queryForm.alarmActionType" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8" class="">
            <el-button type="primary" class="ml-4" :icon="Plus" @click="add3" >新增</el-button>
            <el-button type="primary" class="ml-4" :icon="Delete" @click="batchDelete">删除</el-button>
            <el-button type="primary" class="ml-4" :icon="SuccessFilled" @click="save">保存</el-button>
            <el-button type="primary" class="ml-4" :icon="Search" @click="query">查询</el-button>
            <el-button type="info" plain class="ml-4" :icon="RefreshLeft" @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-main style="height: calc(100% - 90px);">
      <el-table border size="small" style="height: 100%;" ref="alarmRuleTab" :data="alarmRuleData" @selection-change="handleSelectionChange" @cell-click="showUnitInput">
        <el-table-column type="index" fixed width="40" label="#" align="center" />
        <el-table-column type="selection" />
        <el-table-column prop="alarmObjectType" label="告警对象类别" width="200" align="center">
          <template #default="scope">
            <el-input v-if="tableRowEditId === scope.row.id && tableColEditId === scope.column.id"
              v-model="scope.row.alarmObjectType" @mouseout="blurValueInput(scope.row,scope.column)"
              @keyup.enter="blurValueInput(scope.row,scope.column)" clearable></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="alarmLevel" label="告警级别" width="200" align="center">
          <template #default="scope">
            <el-select v-if="tableRowEditId === scope.row.id && tableColEditId === scope.column.id"
              v-model="scope.row.alarmLevel" @blur="blurValueInput(scope.row, scope.column)"
              @keyup.enter="blurValueInput(scope.row, scope.column)" clearable>
              <el-option v-for="item in dropList.NSOS_ALARM_LEVEL" :key="item.value" :label="item.label"
                :value="item.label" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="alarmActionType" label="告警动作类型" width="300" align="center">
          <template #default="scope">
            <el-input v-if="tableRowEditId === scope.row.id && tableColEditId === scope.column.id"
              v-model="scope.row.alarmActionType" @mouseout="blurValueInput(scope.row,scope.column)"
              @keyup.enter="blurValueInput(scope.row,scope.column)" clearable></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="isValid" label="是否有效" width="150" align="center">
          <template #default="scope">
            <el-select v-if="tableRowEditId === scope.row.id && tableColEditId === scope.column.id"
              v-model="scope.row.isValid" @blur="blurValueInput(scope.row, scope.column)"
              @keyup.enter="blurValueInput(scope.row, scope.column)" clearable>
              <el-option v-for="item in dropList.NSOS_YES_OR_NO" :key="item.value" :label="item.label"
                :value="item.label" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="updatorId" label="最后修改人"  align="center"></el-table-column>
        <el-table-column prop="updateTime" label="最后修改时间" :formatter="formatTimestamp"  align="center"></el-table-column>
      </el-table>
    </el-main>
    <el-footer height="45px">
      <el-pagination :current-page="currentPage" :page-size="pageSize" :total="total" class="mt-1" @size-change="handleSizeChange"
        @current-change="handlePageChange" :page-sizes="[20, 50, 100, 200]"
        layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    </el-footer>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" :before-close="handleClose">
      <el-form :model="form" label-width="100px">
        <el-form-item label="告警对象类别">
          <el-input v-model="form.alarmObjectType"></el-input>
        </el-form-item>
        <el-form-item label="告警级别">
          <el-select v-model="form.alarmLevel" placeholder="请选择">
            <!-- <el-option v-for="category in objectTypes" :key="category" :value="category"></el-option> -->
            <el-option v-for="item in dropList.NSOS_ALARM_LEVEL" :key="item.value" :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="告警动作类型">
          <el-input v-model="form.alarmActionType" type="number" placeholder="请输入排序号(数字)"></el-input>
        </el-form-item>
        <el-form-item label="是否有效">
          <el-select v-model="form.isValid" placeholder="请选择">
            <!-- <el-option v-for="category in objectTypes" :key="category" :value="category"></el-option> -->
            <el-option v-for="item in dropList.NSOS_YES_OR_NO" :key="item.value" :label="item.label"
              :value="item.value" />
          </el-select>
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
import { Search, RefreshLeft, Plus, Delete, SuccessFilled } from '@element-plus/icons-vue';

const dropList: any = reactive({});
var index = ref(-1);
var flag = ref(-1)
var tableRowEditId = ref(null);
var tableColEditId = ref(null);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);
const alarmRuleTab = ref(null);
const dialogVisible = ref(false);
const dialogTitle = ref('');
const selectedRows = ref([]);
const alarmRuleData = ref([]);

const queryForm = reactive({
  alarmObjectType: '',
  alarmActionType: ''
});
const form = reactive({
  alarmObjectType: '',
  alarmLevel: '',
  alarmActionType: '',
  isValid: '',
});

const objectTypes =  ref([]);
const queryObjectType =  async () => {
  const code = await requestClient.get(import.meta.env.VITE_NSOSGZ + '/alarmRule/returnObjectType');
  objectTypes.value = code;
}

const showUnitInput = (row: any, column: any) => {
  tableRowEditId.value = row.id;
  tableColEditId.value = column.id;
}

const blurValueInput = (row, column) => {
  tableRowEditId.value = null;
  tableColEditId.value = null;
  console.log(column.property === null);
  //editData2(row);
  form.alarmObjectType = row.alarmObjectType;
  form.alarmActionType = row.alarmActionType;
  if(row.alarmLevel === '重要' || row.alarmLevel === '普通'){
    row.alarmLevel === '重要' ? form.alarmLevel = '1' : form.alarmLevel = '2';
  }else{
    form.alarmLevel = row.alarmLevel;
  }
  if(row.isValid === '是' || row.isValid === '否'){
    row.isValid === '是' ? form.isValid = 'Y' : form.isValid = 'N';
  }else{
    form.isValid = row.isValid;
  }
  index.value = alarmRuleData.value.findIndex((item) => item.id === row.id);
  flag.value = 1;
}

const add = () => {
  dialogTitle.value = '新增';
  form.id = null;
  form.alarmObjectType = '';
  form.alarmLevel = '';
  form.alarmActionType = '';
  form.isValid = '';
  dialogVisible.value = true;
}

const add3 = () => {
  alarmRuleData.value.push({});
}

const add2 = async () => {
  form.id = null;
  form.alarmObjectType = '';
  form.alarmLevel = '';
  form.alarmActionType = '';
  form.isValid = '';
  const parm = {
    "alarmObjectType": '',
    "alarmLevel": '',
    "alarmActionType": '',
    "isValid": '',
  }
  const response = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/alarmRule/add', parm);
  query();
};

const query = async () => {
  const response = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/alarmRule/mHqueryAlarmRuleByPagePagination', {
    "pageNo": currentPage.value,
    "pageSize": pageSize.value,
    "alarmObjectType": queryForm.alarmObjectType,
    "alarmActionType": queryForm.alarmActionType
  });
  total.value = response.count;
  alarmRuleData.value = response.list;
  queryObjectType();
};

const batchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要删除的数据');
    return;
  }
  ElMessageBox.confirm('确定要批量删除这些数据吗?', '提示', {
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
    await requestClient.post(import.meta.env.VITE_NSOSGZ + '/alarmRule/deletebatchData', selectedRows.value);
    query();
    selectedRows.value = [];
    ElMessage.success('批量删除成功');
  } catch (error) {
    console.error('批量删除数据失败:', error);
    ElMessage.error('批量删除数据失败');
  }
}

const reset = () => {
  queryForm.alarmObjectType = '';
  queryForm.alarmActionType = '';
  query();
}

const editData = (row) => {
  dialogTitle.value = '编辑';
  form.alarmObjectType = row.alarmObjectType;
  form.alarmLevel = row.alarmLevel;
  form.alarmActionType = row.alarmActionType;
  form.isValid = row.isValid;
  dialogVisible.value = true;
  index.value = alarmRuleData.value.findIndex((item) => item.id === row.id);
};

const handleClose = (done) => {
  index.value = -1;
  done();
}

const save = () => {
  const errors = [];
  alarmRuleData.value.forEach((item, index) => {
      if (!item.alarmObjectType) {
        errors.push(`第 ${index + 1} 行：告警对象类别为必填项`);
      }
      if (!item.alarmLevel) {
        errors.push(`第 ${index + 1} 行：告警级别为必填项`);
      }
      if (!item.alarmActionType) {
        errors.push(`第 ${index + 1} 行：告警动作类型为必填项`);
      }
  });

  if (errors.length > 0) {
    ElMessage.error(errors.join('\n'));
    return;
  }
  if(flag.value === -1){
    ElMessage.error('没有要保存的数据');
    return;
  }
  submitForm();
}

const submitForm = async () => {
  const parm = {
    "alarmObjectType": form.alarmObjectType,
    "alarmLevel": form.alarmLevel,
    "alarmActionType": form.alarmActionType,
    "isValid": form.isValid,

  }
  if (index.value !== -1) {
    var temp = alarmRuleData.value[index.value];
    temp.alarmObjectType = form.alarmObjectType;
    temp.alarmLevel = form.alarmLevel;
    temp.alarmActionType = form.alarmActionType;
    temp.isValid = form.isValid;
    var response = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/alarmRule/add', temp);
    index.value = -1;
  }else{
     response = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/alarmRule/add', parm);
  }
  query();
  flag.value = -1;
  dialogVisible.value = false;
  form.id = null;
  form.alarmObjectType = '';
  form.alarmLevel = '';
  form.alarmActionType = '';
  form.isValid = '';
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

onMounted(async () => {
  const dropStore = useDropStore();
  await dropStore.initDrops(['NSOS_YES_OR_NO','NSOS_ALARM_LEVEL']);
  dropStore.get(dropList, ['NSOS_YES_OR_NO','NSOS_ALARM_LEVEL']);
  // query();
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
