<template>
  <div style="width: 100%; height: 100%">
    <el-container class="h-full bg-white">
      <el-header height="50px">
        <el-form label-width="auto" ref="actionTypeForm" :model="data.form" :inline="true" label-position="right" class="demo-form-inline mt-2">
          <el-row>
            <el-col :span="6">
              <el-form-item label="告警动作类型:" prop="alarmActionType">
                <el-input v-model="data.form.alarmActionType" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6" style="display: flex; justify-content: flex-end">
                <el-button type="primary" @click="add">新增</el-button>
                <el-button type="primary" @click="del">删除</el-button>
                <el-button type="primary" @click="save">保存</el-button>
                <el-button type="primary" @click="query">查询</el-button>
                <el-button type="info" @click="reset">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <el-main style="height: calc(100% - 95px)">
        <el-form ref="ruleFormRef" :model="data" :rules="formRules">
          <el-table ref="actionTypeTable" :data="data.tableData" border size="small" style="height: 100%" @cell-click="onClickEdit">
            <el-table-column type="index" label="#" align="center" />
            <el-table-column type="selection" align="center" />
            <el-table-column prop="actionCode" label="参数编码" align="center">
              <template #default="scope">
                <el-form-item class="unedit_item" :prop="'tableData.' + scope.$index + '.actionCode'" :rules="formRules.actionCode">
                  <el-input v-if="data.editingRow === scope.row && data.editingCol === scope.column.property" 
                    v-model="scope.row.actionCode" @change="handleEdit(scope.row)">
                  </el-input>
                  <span v-else>
                    {{ scope.row.actionCode }}
                  </span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="alarmActionType" label="告警动作类型" align="center">
              <template #default="scope">
                <el-form-item class="unedit_item" :prop="'tableData.' + scope.$index + '.alarmActionType'" :rules="formRules.alarmActionType">
                  <el-input v-if="data.editingRow === scope.row && data.editingCol === scope.column.property" 
                    v-model="scope.row.alarmActionType" @change="handleEdit(scope.row)">
                  </el-input>
                  <span v-else>
                    {{ scope.row.alarmActionType }}
                  </span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="isEnabled" label="是否使用" align="center">
              <template #default="scope">
                <el-select v-if="data.editingRow === scope.row && data.editingCol === scope.column.property"  
                  v-model="scope.row.isEnabled" @change="handleEdit(scope.row)">
                  <el-option v-for="item in dropList.NSOS_YES_OR_NO" :key="item.value" :label="item.label" :value="item.value"/>
                </el-select>
                <span v-else>
                  {{ dropList.NSOS_YES_OR_NO.find(i => i.value === scope.row.isEnabled)?.label }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="alarmColor" label="告警颜色" align="center">
              <template #default="scope">
                <div :style="{ background: scope.row.alarmColor }">
                  <el-color-picker v-if="data.editingRow === scope.row && data.editingCol === scope.column.property"  
                    v-model="scope.row.alarmColor" @change="handleEdit(scope.row)">
                  </el-color-picker>
                  <span v-else>
                    {{ scope.row.alarmColor }}
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="orderCode" label="排序号" align="center">
              <template #default="scope">
                <el-input v-if="data.editingRow === scope.row && data.editingCol === scope.column.property"  
                  v-model="scope.row.orderCode" @change="handleEdit(scope.row)" type="number">
                </el-input>
                <span v-else>
                  {{ scope.row.orderCode }}
                </span>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="updatorId" label="最后修改人" align="center" /> -->
            <el-table-column prop="updateTime" label="最后修改时间" :formatter="tDateTimeFormat" align="center" />
          </el-table>
        </el-form>
      </el-main>
      <el-footer height="45px">
        <el-pagination v-model:current-page="data.pageInfo.pageNo" v-model:page-size="data.pageInfo.pageSize" class="mt-1"
          :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange" @current-change="currentChange"></el-pagination>
      </el-footer>
    </el-container>

  </div>
</template>
<script lang="ts" setup>
import {
  ElTable,
  ElTableColumn,
  ElFormItem,
  ElForm,
  ElInput,
  ElButton,
  ElPagination,
  ElMessage,
  ElMessageBox,
  ElRow, ElCol, ElMain, ElContainer, ElHeader, ElFooter, ElNotification, ElColorPicker,  
  type FormInstance,
} from 'element-plus';
import { reactive, ref, onMounted, nextTick } from 'vue';
import { requestClient } from '#/api/request';
import { useDropStore } from '#/store';
import { tDateFormat, tDateTimeFormat, formatDrop } from '#/utils/commonUtil.ts';

const dropList: any = reactive({});

onMounted(async () => {
  const dropStore = useDropStore();
  const dropType = ['NSOS_YES_OR_NO'];
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);
  query();
});
const actionTypeTable = ref();
const actionTypeForm = ref<FormInstance>();

const data = reactive({
  tableData: [],
  rowInfo: {},
  title: '',
  form: {
    alarmActionType: '',
  },
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0,
  },
  updateList: [],
  deleteList: [],
  editingRow: null,
  editingCol: null,
});

interface queryParams {
  alarmActionType?: string;
  pageNo: number;
  pageSize: number;
}

const params: queryParams = reactive({
  alarmActionType: data.form.alarmActionType,
  pageNo: data.pageInfo.pageNo,
  pageSize: data.pageInfo.pageSize,
});

async function getFlowTableApi(params: queryParams) {
  return requestClient.post(
    import.meta.env.VITE_NSOSGZ + '/actionType/query',
    params,
  );
}

const query = async () => {
  params.alarmActionType = data.form.alarmActionType;
  const { list, pageNo, count } = await getFlowTableApi(params);
  data.tableData = list;
  data.pageInfo.pageNo = pageNo;
  data.pageInfo.total = count;
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

const add = () => {
  let newRow = {}
  data.tableData = [newRow, ...data.tableData];
};

function onClickEdit(row, column, event) {
  data.editingRow = row;
  data.editingCol = column.property;
}

function handleEdit(row, col) {
  if (!data.updateList.includes(row)) {
    data.updateList.push(row);
  }
}

const del = () => {
  if (actionTypeTable.value.getSelectionRows().length === 0) {
    ElMessage.warning('请先选择要删除的告警动作类型');
    return;
  }
  ElMessageBox.confirm('确定要删除选中的告警动作类型吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    data.deleteList = actionTypeTable.value.getSelectionRows();
    data.tableData = data.tableData.filter(row => !actionTypeTable.value.getSelectionRows().includes(row));
  }).catch(() => {
    ElMessage.info('已取消删除');
  });
};

const ruleFormRef = ref()
const formRules = reactive({
  actionCode: [
    { required: true, message: '', trigger: 'blur' },
  ],
  alarmActionType: [
    { required: true, message: '', trigger: 'blur' },
  ],
})

async function saveDataApi(param: object) {
  return requestClient.post(
    import.meta.env.VITE_NSOSGZ + '/actionType/save',
    param,
  );
}

async function save() {
  let count = 0;
  await ruleFormRef.value.validate(async (valid: any) => {
    if (count > 0) return;
    count++;
    if (valid) {
      let param = ref({
        updateList: data.updateList,
        deleteList: data.deleteList,
      })
      await saveDataApi(param.value);
      ElNotification({
        title: '提示',
        message: '保存成功！',
        type: 'success',
      })
      query();
      data.updateList = [];
      data.deleteList = [];
    } else {
      ElMessage.warning('请输入必填项！');
    }
  })
};

const reset = () => {
  data.form.alarmActionType = '';
  query();
}
</script>
<style scoped>
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

:deep(.el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell) {
  background-color: transparent;
}

:deep(.is-required) {
  margin-bottom: auto;
}

.primary{
  color: hsl(var(--primary));
}

:deep(.unedit_item .el-form-item__content) {
  display: block;
  line-height: 23px;
}
.unedit_item span {
  font-size: 12px;
}
</style>
