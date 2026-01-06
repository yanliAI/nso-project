<template>
  <el-container class="h-full bg-white">
    <el-aside style="width: 12%">
      <div class="mt-2 flex">
        <el-text size="large" style="color: #3c57fe" tag="b" class="flex">
          <div @click="add2" style="cursor:pointer">&nbsp;&nbsp;&nbsp;专家分组 </div>
          <el-icon :size="20" style="margin-left: 30px; cursor: pointer">
            <CirclePlusFilled @click="catalogueClick" />
          </el-icon>
        </el-text>
      </div>
      <div class="mt-2 flex" @click="allClick" style="cursor:pointer">
        <el-text size="large" style="color: #3c57fe" tag="b" >
          &nbsp;&nbsp;&nbsp;全部({{ data.treeSize }})
        </el-text>
      </div>
      <el-tree  :expand-icon="ExpandIcon"  :collapse-icon="CollapseIcon" style="max-width: 600px" :data="data.treeData" :default-expanded-keys="data.defaultExpandedKeys"
        node-key="id" @node-click="handleNodeClick" />
    </el-aside>
    <el-main>
      <el-container class="h-full">
        <el-header height="45px" style="padding-top: 6px">
          <el-form label-width="auto" ref="ruleFormRef" :model="data.formData" :inline="true" label-position="right"
            class="demo-form-inline">
            <el-row>
              <el-col :span="4">
                <el-form-item label="姓名:" prop="expertName">
                  <el-input v-model="data.formData.expertName" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="手机:" prop="telPhone">
                  <el-input v-model="data.formData.telPhone" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-button type="primary" class="ml-4" :icon="Search" @click="onQueryClick">查询</el-button>
                <el-button type="primary" class="ml-4" :icon="Plus" @click="add">新增</el-button>
                <el-button type="primary" class="ml-4" :icon="Delete" @click="batchDelete">批量删除</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-header>
        <el-main style="height: calc(100% - 90px)">
          <el-table :data="data.tableData" border size="small" style="height: 100%" stripe @selection-change="handleSelectionChange" @cell-click="showUnitInput" :header-cell-style="{ backgroundColor: '#F2F3F5', color: '#666666', fontSize: '14px', height: '40px', textAlign: 'center' }">
            <el-table-column type="index" width="40" fixed label="#" align="center" />
            <el-table-column type="selection" fixed />
            <el-table-column prop="expertId" column-key="NSOS_PIM_NAME" :formatter="formatDrop" label="专家组" fixed width="150" align="center"> </el-table-column>
            <el-table-column prop="expertName" column-key="NSOS_USER_NAME" :formatter="formatDrop" label="姓名" align="center" fixed width="150"> </el-table-column>
            <el-table-column prop="systemName" column-key="NSOS_SYSTEM_INFO" :formatter="formatDrop" label="关联系统" align="center" fixed width="150"> </el-table-column>
            <el-table-column prop="telPhone" label="手机" align="center" width="150"> </el-table-column>
            <el-table-column prop="orgName" label="单位路由" align="center"> </el-table-column>
            <el-table-column label="操作" align="center" width="150">
              <template #default="scope">
                <el-button link type="primary" size="small" @click="xq(scope.row)">详情</el-button>
                <el-button link type="primary" size="small" @click="edit(scope.row)">编辑</el-button>
                <el-button link type="danger" size="small" @click="batchDeleteOne(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
        <el-footer height="45px">
          <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" class="mt-1"
            :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]"
            layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
            @current-change="currentChange"></el-pagination>
        </el-footer>

        <Modal class="w-[800px] h-[270px]" title="新增" :footer="false" :closeOnClickModal="false" :draggable="true">
      <TemplateDiaLog :formData="data.selectedRow" @close="addClose" @closeDiaLog="closeDiaLog" @query="query"></TemplateDiaLog>
    </Modal>

    <ModalA class="w-[800px] h-[200px]" title="详情信息" :footer="false" :closeOnClickModal="false" :draggable="true">
      <TemplateDiaLogA :formData="data.selectedRow" @close="addCloseA" @closeDiaLog="closeDiaLogA" @query="query"></TemplateDiaLogA>
    </ModalA>

    <ModalB class="w-[1200px] h-[600px]" title="专家组信息" :footer="false" :closeOnClickModal="false" :draggable="true">
      <ExpertGroupDiaLog :formData="data.selectedRow" @close="addCloseB" @closeDiaLog="closeDiaLogB" @query="query" @treeChange="treeChange"></ExpertGroupDiaLog>
    </ModalB>
      </el-container>
    </el-main>
  </el-container>
  <AddCatalogue v-if="data.catalogShow" @switchCatalog="switchCatalog" @query="query" @treeChange="treeChange"
    style="width: 700px; height: 400px" />
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { Search, Plus,Delete, Position,CirclePlusFilled,Finished,ArrowDownBold, ArrowRightBold  } from '@element-plus/icons-vue';
import {
ElForm,
ElFormItem,
ElRow,
ElIcon,
ElCol,
ElTable,
ElTableColumn,
ElPagination,
ElMain,
ElContainer,
ElAside,
ElHeader,
ElFooter,
ElMessage,
ElMessageBox,
ElTree
} from 'element-plus';
import AddCatalogue from './addCatalogue.vue';
import { useDropStore } from '#/store';
import { tDateFormat, tDateTimeFormat, formatDrop, lookFlow } from '#/utils/commonUtil.ts';
import { getTreeData, getDataList, saveDataList } from './commandMgtMethod.ts'
import { requestClient } from '#/api/request';
import { useVbenModal } from '@vben/common-ui'
import TemplateDiaLog from './TemplateDiaLog.vue'
import TemplateDiaLogA from './TemplateDiaLogA.vue'
import ExpertGroupDiaLog from './expertGroupDiaLog.vue'

const data = reactive({
formData: {},
tableData: [],
treeData: [],
updateList: [],
defaultExpandedKeys: [],
catalogShow: false,
hasUnsavedRow: false,
treeSize: 0,
editIndex: -1,
pageInfo: {
  pageSize: 20,
  pageNo: 1,
  total: 0,
},
selectedRow: {}
});
const dropList = reactive({});
const selectedRows = ref([]);
var tableRowEditId = ref(null);
var tableColEditId = ref(null);
var index = ref(-1);
var flag = ref(-1)
const ExpandIcon = ArrowDownBold;
const CollapseIcon = ArrowRightBold;

onMounted( async() => {
const dropStore = useDropStore();
const dropType = ['NSOS_PIM_NAME','NSOS_USER_NAME','NSOS_SYSTEM_INFO']
await dropStore.initDrops(dropType);
dropStore.get(dropList, dropType);
query();
data.treeData = await getTreeData();
data.treeSize = data.treeData.length;
})

const treeChange = async () => {
  data.treeData = await getTreeData();
  data.treeSize = data.treeData.length;
}

const query = async () => {
data.formData.pageSize = data.pageInfo.pageSize;
data.formData.pageNo = data.pageInfo.pageNo;

const { list, count, pageNo } = await getDataList(data.formData);
data.tableData = list;
data.pageInfo.pageNo = pageNo;
data.pageInfo.total = count;
}

function onQueryClick() {
query();
}

const allClick = () => {
  data.formData.expertId = null;
  query();
}

const catalogueClick = () => {
switchCatalog(true);
};


const switchCatalog = (isOpen: boolean) => {
data.catalogShow = isOpen;
};

const handleSizeChange = (val) => {
data.pageInfo.pageSize = val;
query();
}

const currentChange = (val) => {
data.pageInfo.pageNo = val;
query();
}

const handleNodeClick = async (node: Tree) => {
if(data.hasUnsavedRow) {
  ElMessage.warning('数据未保存');
  return;
}
data.formData.expertId = node.id;
query();
};

const handleSelectionChange = (val) => {
  selectedRows.value = val;
};

const add = () => {
  data.selectedRow = {}
  modalApi.open()
}

const add2 = () => {
  data.selectedRow = {}
  modalApiB.open()
}

const closeDiaLog = () => {
  modalApi.close()
}

const closeDiaLogA = () => {
  modalApiA.close()
}

const closeDiaLogB = () => {
  modalApiB.close()
}

const edit = (row) => {
  //console.log(row)
  data.selectedRow = row
  modalApi.open()
}

const xq = (row) => {
  //console.log(row)
  data.selectedRow = row
  modalApiA.open()
}

const batchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要删除的数据')
    return
  }
  ElMessageBox.confirm('确定要删除这些数据吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      batchDeleteBatch()
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}

const batchDeleteOne = (row) => {
  ElMessageBox.confirm('确定要删除吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      batchDeleteOnes(row)
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}
const batchDeleteOnes = async (row) => {
  try {
    const selectedRows = ref([])
    selectedRows.value.push(row)
    console.log(111)
    console.log(selectedRows.value)
    await requestClient.post(import.meta.env.VITE_NSOSGZ + '/expertInfo/deletebatchData', selectedRows.value)
    query()
    selectedRows.value = []
    ElMessage.success('删除成功！')
  } catch (error) {
    console.error('删除失败:', error)
    query()
    ElMessage.error('删除失败！')
  }
}

const batchDeleteBatch = async () => {
  try {
    await requestClient.post(import.meta.env.VITE_NSOSGZ + '/expertInfo/deletebatchData', selectedRows.value)
    query()
    selectedRows.value = []
    ElMessage.success('删除成功！')
  } catch (error) {
    console.error('删除失败:', error)
    query()
    ElMessage.error('删除失败！')
  }
}

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close()
  }
})
const [ModalA, modalApiA] = useVbenModal({
  onCancel() {
    modalApiA.close()
  }
})
const [ModalB, modalApiB] = useVbenModal({
  onCancel() {
    modalApiB.close()
  }
})
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

</style>
