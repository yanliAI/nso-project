<template>
  <div style="width: 100%; height: 100%">
    <el-container style="height: 100%">
      <el-aside width="20%">
        <el-tree :data="data.treeData" default-expand-all @node-click="selectNode"></el-tree>
      </el-aside>
      <el-container class="h-full bg-white">
        <el-header height="50px">
          <el-form label-width="auto" ref="dispatchRuleForm" :model="data.form" :inline="true" label-position="right" class="demo-form-inline mt-2">
            <el-row>
              <el-col :span="5">
                <el-form-item label="评价项目:" prop="evaluateItemName">
                  <span class="primary">{{ data.form.evaluateItemName }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="规范化要求:" prop="normalizeRequire">
                  <el-input v-model="data.form.normalizeRequire" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="评分依据:" prop="evaluateAccording">
                  <el-input v-model="data.form.evaluateAccording" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="9" style="display: flex; justify-content: flex-end">
                  <el-button type="primary" @click="query">查询</el-button>
                  <el-button type="primary" @click="add">添加</el-button>
                  <el-button type="primary" @click="del">删除</el-button>
                  <el-button type="primary" @click="save">保存</el-button>
                  <el-button type="primary" @click="release">发布</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-header>
        <el-main style="height: calc(100% - 50px)">
          <el-form ref="ruleFormRef" :model="data" :rules="formRules">
            <el-table ref="dispatchRuleTable" :data="data.tableData" border size="small" style="height: 100%" 
              :row-class-name="tableRowClassName" @cell-click="onClickEdit">
              <el-table-column type="index" label="#" align="center" />
              <el-table-column type="selection" align="center" />
              <el-table-column prop="evaluateItemCode" label="评价项编码" align="center">
                <template #default="scope">
                  <el-form-item class="unedit_item" :prop="'tableData.' + scope.$index + '.evaluateItemCode'" :rules="formRules.evaluateItemCode">
                    <el-input v-if="data.editingRow === scope.row && data.editingCol === scope.column.property" 
                      v-model="scope.row.evaluateItemCode" @change="handleEdit(scope.row)">
                    </el-input>
                    <span v-else>
                      {{ scope.row.evaluateItemCode }}
                    </span>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="evaluateItemName" label="评价项目" align="center">
                <template #default="scope">
                  <el-form-item class="unedit_item" :prop="'tableData.' + scope.$index + '.evaluateItemName'" :rules="formRules.evaluateItemName">
                    <el-input v-if="data.editingRow === scope.row && data.editingCol === scope.column.property && !scope.row.id" 
                      v-model="scope.row.evaluateItemName" @change="handleEdit(scope.row)">
                    </el-input>
                    <span v-else>
                      {{ scope.row.evaluateItemName }}
                    </span>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="normalizeRequire" label="规范化要求" align="center">
                <template #default="scope">
                  <el-form-item class="unedit_item" :prop="'tableData.' + scope.$index + '.normalizeRequire'" :rules="formRules.normalizeRequire">
                    <el-input v-if="data.editingRow === scope.row && data.editingCol === scope.column.property"  
                      v-model="scope.row.normalizeRequire" @change="handleEdit(scope.row)">
                    </el-input>
                    <span v-else>
                      {{ scope.row.normalizeRequire }}
                    </span>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="normalScore" label="标准分" align="center">
                <template #default="scope">
                  <el-form-item class="unedit_item" :prop="'tableData.' + scope.$index + '.normalScore'" :rules="formRules.normalScore">
                    <el-input v-if="data.editingRow === scope.row && data.editingCol === scope.column.property"  
                      v-model="scope.row.normalScore" @change="handleEdit(scope.row)" type="number" :disabled="isScoreDisabled(scope.row)">
                    </el-input>
                    <span v-else>
                      {{ scope.row.normalScore }}
                    </span>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="evaluateWay" label="评分方法" align="center" width="400">
                <template #default="scope">
                  <el-input v-if="data.editingRow === scope.row && data.editingCol === scope.column.property"  
                    v-model="scope.row.evaluateWay" @change="handleEdit(scope.row)">
                  </el-input>
                  <span v-else>
                    {{ scope.row.evaluateWay }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="evaluateAccording" label="评分依据" align="center">
                <template #default="scope">
                  <el-input v-if="data.editingRow === scope.row && data.editingCol === scope.column.property"  
                    v-model="scope.row.evaluateAccording" @change="handleEdit(scope.row)">
                  </el-input>
                  <span v-else>
                    {{ scope.row.evaluateAccording }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="uperEvaluateItemCode" label="上级评价项" column-key="NSOS_EVALUATE_MAINTAIN_ITEM" :formatter="formatDrop"  align="center" />
            </el-table>
          </el-form>
        </el-main>
      </el-container>
    </el-container>

    <Modal class="w-[1000px] h-[380px]" title="运维工作评价发布" :footer="false" :closeOnClickModal="false" :draggable="true" headerClass="head-md">
      <MaintainRelease @releaseCancel="releaseCancel"></MaintainRelease>
    </Modal>
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
  ElRow, ElCol, ElMain, ElContainer, ElHeader, ElFooter, ElTabs, ElTabPane, ElAside, ElTree, ElNotification,
  type FormInstance,
} from 'element-plus';
import { reactive, ref, onMounted, nextTick } from 'vue';
import { requestClient } from '#/api/request';
import { useDropStore } from '#/store';
import { formatDrop } from '#/utils/commonUtil.ts';
import { useVbenModal } from '@vben/common-ui';
import MaintainRelease from './maintainRelease.vue';

const dropList: any = reactive({});

onMounted(async () => {
  const dropStore = useDropStore();
  const dropType = ['NSOS_EVALUATE_MAINTAIN_ITEM'];
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);
  data.tableData = await getFlowTableApi(params);
  data.allTableData = data.tableData;
  queryTree();
});
const dispatchRuleTable = ref();
const dispatchRuleForm = ref<FormInstance>();

const data = reactive({
  tableData: [],
  rowInfo: {},
  title: '',
  form: {
    evaluateItemName: '',
    normalizeRequire: '',
    evaluateAccording: '',
  },
  pageInfo: {
    pageSize: 100,
    pageNo: 1,
    total: 0,
  },
  treeData: [],
  nodeData: {},
  updateList: [],
  deleteList: [],
  editingRow: null,
  editingCol: null,
  allTableData: [],
});

interface queryParams {
  evaluateItemName?: string;
  normalizeRequire?: string;
  evaluateAccording?: string;
  pageNo: number;
  pageSize: number;
}

const params: queryParams = reactive({
  evaluateItemName: data.form.evaluateItemName,
  normalizeRequire: data.form.normalizeRequire,
  evaluateAccording: data.form.evaluateAccording,
  pageNo: data.pageInfo.pageNo,
  pageSize: data.pageInfo.pageSize,
});

async function getFlowTableApi(params: queryParams) {
  return requestClient.post(
    import.meta.env.VITE_NSOSZH + '/evaluateMaintainRule/query',
    params,
  );
}

const query = async () => {
  params.evaluateItemName = data.form.evaluateItemName;
  params.normalizeRequire = data.form.normalizeRequire;
  params.evaluateAccording = data.form.evaluateAccording;
  data.tableData = await getFlowTableApi(params);
};

async function getTreeDataApi() {
  return requestClient.post(
    import.meta.env.VITE_NSOSZH + '/evaluateMaintainRule/queryTree',
  );
}

const queryTree = async () => {
  data.treeData = await getTreeDataApi();
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

const selectNode = (nodeData) => {
  data.nodeData = nodeData;
  data.form.evaluateItemName = nodeData.label;
  query();
}

interface tableRow {
  evaluateItemCode: string;
  evaluateItemName: string;
  evaluateItemLevel: number;
}

const tableRowClassName = ({row, rowIndex}: {
  row: tableRow
  rowIndex: number
}) => {
  if (row.evaluateItemLevel === 1) {
    return 'warning-row'
  } else if (row.evaluateItemLevel === 2) {
    return 'success-row'
  }
  return ''
}

const add = () => {
  if (data.form.evaluateItemName == null || data.form.evaluateItemName == '') {
    ElMessage.warning('请先选择评价项');
    return;
  }
  let newRow = {
    uperEvaluateItemCode: data.nodeData.data.evaluateItemCode,
    evaluateItemLevel: data.nodeData.data.evaluateItemLevel + 1,
    rcOrder: -1
  }
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
  if (dispatchRuleTable.value.getSelectionRows().length === 0) {
    ElMessage.warning('请先选择要删除的评价项');
    return;
  }
  let selectList = dispatchRuleTable.value.getSelectionRows();
  let upperCodeSet = [...new Set(data.tableData.map(data => data.uperEvaluateItemCode))];
  for (let i = 0; i < selectList.length; i++) {
    if (upperCodeSet.includes(selectList[i].evaluateItemCode)) {
      ElMessage.warning('该项存在子评价项，不允许删除');
      return;
    }
  }

  ElMessageBox.confirm('确定要删除选中的评价项吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    data.deleteList = dispatchRuleTable.value.getSelectionRows();
    data.tableData = data.tableData.filter(row => !dispatchRuleTable.value.getSelectionRows().includes(row));
  }).catch(() => {
    ElMessage.info('已取消删除');
  });
};

const ruleFormRef = ref()
const formRules = reactive({
  evaluateItemCode: [
    { required: true, message: '', trigger: 'blur' },
  ],
  evaluateItemName: [
    { required: true, message: '', trigger: 'blur' },
  ],
  normalizeRequire: [
    { required: true, message: '', trigger: 'blur' },
  ],
  normalScore: [
    { required: true, message: '', trigger: 'blur' },
  ],
  rcOrder: [
    { required: true, message: '', trigger: 'blur' },
  ],
})

async function saveDataApi(param: object) {
  return requestClient.post(
    import.meta.env.VITE_NSOSZH + '/evaluateMaintainRule/save',
    param,
  );
}

async function duplicateValid() {
  let itemCodeAddList = data.updateList.filter(data => data.id == null).map(data => data.evaluateItemCode);
  let itemCodeList = data.allTableData.map(data => data.evaluateItemCode);
  let codeMixed = itemCodeAddList.filter(data => itemCodeList.includes(data));
  if (codeMixed.length > 0) {
    return false;
  }
  return true;
};

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

      // 校验重复项
      if (await duplicateValid()) {
        await saveDataApi(param.value);
        ElNotification({
          title: '提示',
          message: '保存成功！',
          type: 'success',
        })
        query();
        queryTree();
        data.updateList = [];
        data.deleteList = [];
      } else {
        ElMessage.warning('存在重复项！');
      }
    } else {
      ElMessage.warning('请输入必填项！');
    }
  })
};

function isScoreDisabled(row) {
  if (!row.id) {
    return false;
  }
  let targetCode = row.evaluateItemCode;
  let upperCodeSet = [...new Set(data.allTableData.map(data => data.uperEvaluateItemCode))];
  if (upperCodeSet.includes(targetCode)) {
    return true;
  }
  return false;
}

const release = () => {
  modalApi.open();
};
const [Modal, modalApi] = useVbenModal({
  oncancel() {
    modalApi.close();
  },
});
const releaseCancel = () => {
  modalApi.close();
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

:deep(.el-tree-node.is-current > .el-tree-node__content) {
    background: #EAEFFF;
    border-radius: 4px;
    color: hsl(var(--primary));
}

:deep(.el-table .warning-row) {
  --el-table-tr-bg-color: var(--el-color-warning);
}
:deep(.el-table .success-row) {
  --el-table-tr-bg-color: var(--el-color-success);
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
