<template>
  <el-container class="h-full bg-white">
    <el-main>
      <el-container class="h-full">
        <el-header height="45px" style="padding-top: 6px">
          <el-form label-width="auto" ref="ruleFormRef" :model="data.formData" :inline="true" label-position="right"
            class="demo-form-inline">
            <el-row>
            </el-row>
          </el-form>
        </el-header>
        <el-main style="height: calc(100% - 90px)">
          <el-table :data="data.tableData" border size="small" style="height: 100%" stripe @selection-change="handleSelectionChange" @cell-click="showUnitInput" :header-cell-style="{ backgroundColor: '#F2F3F5', color: '#666666', fontSize: '14px', height: '40px', textAlign: 'center' }">
            <el-table-column type="index" width="40" fixed label="#" align="center" />
            <el-table-column type="selection" fixed />
            <el-table-column prop="groupName"  label="专家组名称" fixed width="150" align="center"> </el-table-column>
            <el-table-column prop="creatorId" label="创建人" column-key="NSOS_USER_NAME" :formatter="formatDrop" align="center"
          width="70" />
        <el-table-column prop="createTime" label="创建时间" :formatter="tDateTimeFormat" align="center" width="150" />
        <el-table-column prop="updatorId" label="最后修改人" column-key="NSOS_USER_NAME" :formatter="formatDrop" align="center" width="130" />
        <el-table-column prop="updateTime" label="最后修改时间" :formatter="tDateTimeFormat" align="center" width="150" />
            <el-table-column label="操作" align="center" width="150">
              <template #default="scope">
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

        <Modal class="w-[800px] h-[400px]" title="新增" :footer="false" :closeOnClickModal="false" :draggable="true">
      <TemplateDiaLogB :formData="data.selectedRow" @close="addClose" @closeDiaLog="closeDiaLog" @treeChange="treeChanges" @query="query"></TemplateDiaLogB>
    </Modal>
      </el-container>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { Search, Plus,Delete, Position,CirclePlusFilled,Finished  } from '@element-plus/icons-vue';
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
import { useDropStore } from '#/store';
import { tDateFormat, tDateTimeFormat, formatDrop, lookFlow } from '#/utils/commonUtil.ts';
import { getTreeData, getDataLists, saveDataList } from './commandMgtMethod.ts'
import { requestClient } from '#/api/request';
import { useVbenModal } from '@vben/common-ui'
import TemplateDiaLogB from './TemplateDiaLogB.vue'

const emit = defineEmits(['treeChange']);

const treeChanges = () => {
  emit('treeChange');
}

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

onMounted( async() => {
const dropStore = useDropStore();
const dropType = ['NSOS_USER_NAME']
await dropStore.initDrops(dropType);
dropStore.get(dropList, dropType);
query();
})

const query = async () => {
data.formData.pageSize = data.pageInfo.pageSize;
data.formData.pageNo = data.pageInfo.pageNo;

const { list, count, pageNo } = await getDataLists(data.formData);
data.tableData = list;
data.pageInfo.pageNo = pageNo;
data.pageInfo.total = count;
}




const handleSizeChange = (val) => {
data.pageInfo.pageSize = val;
query();
}

const currentChange = (val) => {
data.pageInfo.pageNo = val;
query();
}


const handleSelectionChange = (val) => {
  selectedRows.value = val;
};


const attachClick = () => {
  modalApi.open()
}

const attachClose =() => {
  emit('closeDiaLog');
}


const closeDiaLog = () => {
  emit('treeChange')
  modalApi.close()
}


const edit = (row) => {
  console.log(row)
  data.selectedRow = row
  modalApi.open()
}

const xq = (row) => {
  console.log(row)
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
    await requestClient.post(import.meta.env.VITE_NSOSGZ + '/expertGroup/deletebatchData', selectedRows.value)
    emit('treeChange')
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
    await requestClient.post(import.meta.env.VITE_NSOSGZ + '/expertGroup/deletebatchData', selectedRows.value)
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
