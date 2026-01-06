<template>
  <el-container class="h-full bg-white">
    <el-header height="50px">
      <el-form label-width="auto" :model="data.formData" :inline="true" label-position="right"
        class="demo-form-inline mt-2">
        <el-row>
          <el-col :span="4" style="display: flex; ">
            <!-- <el-button type="primary" class="ml-4" :icon="Search" @click="query">查询</el-button> -->
            <el-button type="primary" class="ml-4" :icon="Plus" @click="add">新增</el-button>
            <el-button type="primary" class="ml-4" :icon="Delete" @click="batchDelete">删除</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-main style="height: calc(100% - 95px)">
      <el-table ref="scheduleListTable" :data="data.tableData" border size="small"
        @selection-change="handleSelectionChange" style="height: 100%" stripe
        :header-cell-style="{ backgroundColor: '#F2F3F5', color: '#666666', fontSize: '14px', height: '40px', textAlign: 'center' }">
        <el-table-column type="selection" align="center" />
        <el-table-column type="index" label="#" align="center" width="40" />
        <el-table-column prop="commandFl" label="类型" column-key="NSOS_CMD_FL" :formatter="formatDrop" align="center"
          width="200" />
        <el-table-column prop="templateName" label="类别" align="center" width="300" />
        <el-table-column prop="glTemplateName" label="关联模板" align="left">
          <template #default="{ row }">
            <div class="name-container">
              <!-- 分割字符串并过滤空值 -->
              <span v-for="(name, index) in splitNames(row.glTemplateName)" :key="index" class="name-item">
                {{ name }}；
              </span>

              <!-- 空数据占位符 -->
              <span v-if="!row.templateName">-</span>
            </div>
          </template>
          <!-- <template #default="{ row }">
            <el-button type="text" @click="showTemplateDialog(row)">选择模板</el-button>
          </template> -->
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template #default="scope">
            <!-- <el-button type="text" @click="showTemplateDialog(scope.row)">编辑</el-button> -->
            <el-button type="text" @click="add2(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer height="45px">
      <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" class="mt-1"
        :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange" @current-change="currentChange"></el-pagination>
    </el-footer>

    <Modal class="w-[800px] h-[250px]" title="新增模板" :footer="false" :closeOnClickModal="false" :draggable="true">
      <TemplateDiaLog :formData="data.selectedRow" @close="addClose" @closeDiaLog="closeDiaLog" @query="query">
      </TemplateDiaLog>
    </Modal>

    <ModalB class="w-[1200px] h-[800px]" title="选择指令模板" :footer="false" :closeOnClickModal="false" :draggable="true">
      <TemplateList :typeCode="code" @closeDiaLog2="closeDiaLog2" />
    </ModalB>
  </el-container>
</template>
<script setup>
import { Page } from '@vben/common-ui';
import { Search, Delete, Plus, Download, Operation } from '@element-plus/icons-vue';
import { ElForm, ElFormItem, ElRow, ElCol, ElTable, ElTableColumn, ElPagination,
         ElMain, ElContainer, ElHeader, ElFooter,
         ElTabs, ElTabPane, ElMessageBox, ElMessage, ElDialog } from 'element-plus';
import { reactive, ref, onMounted } from 'vue';
import { requestClient } from '#/api/request';
import { useDropStore } from '#/store';
import { queryData } from './cmdTemplateMethod.ts';
import { useVbenModal } from '@vben/common-ui';
import TemplateDiaLog from './TemplateDiaLog.vue';
import { tDateFormat, tDateTimeFormat, formatDrop, lookFlow } from '#/utils/commonUtil.ts';
import TemplateList from './templateList.vue'

const dropList = reactive({});
const nameList = ref([]);
const templateDialogVisible = ref(false);
onMounted(async () => {
  const dropStore = useDropStore();
  const dropType = ['NSOS_USER_NAME', 'NSOS_ORG_NAME', 'NSOS_CMD_FL','NSOS_CMD_TYPE','NSOS_CMD_TEMPLATE'];
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);
  query();
});
const scheduleListTable = ref();
const selectedRows = ref([]);
const code = ref(-1);

const data = reactive({
  tableData: [],
  formData: {},
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0,
  },
  selectedRow: {},
});

const query = async () => {
  data.formData.pageSize = data.pageInfo.pageSize;
  data.formData.pageNo = data.pageInfo.pageNo;
  const { list, pageNo, count } = await queryData(data.formData);
  console.log(list);
  data.tableData = list;
  data.pageInfo.pageNo = pageNo;
  data.pageInfo.total = count;
  console.log(dropList.NSOS_CMD_TEMPLATE)
};

// 分割名称方法
const splitNames = (str) => {
  return str
    ? str.split('-').filter(item => item.trim()) // 分割并过滤空值
    : []
}

const showTemplateDialog = (row) => {
  code.value = row.commandTypeCode
  modalApiB.open()
};

const closeDiaLog2 = () => {
  modalApiB.close();
  query();
}

const handleSelectionChange = (val) => {
  selectedRows.value = val;
};

const handleSizeChange = (val) => {
  data.pageInfo.pageSize = val;
  query();
};

const currentChange = (val) => {
  data.pageInfo.pageNo = val;
  query();
};

const add = () => {
  data.selectedRow = {};
  modalApi.open()
}

const add2 = (row) => {
  //let t = row;
  //data.selectedRow = t;
  //data.selectedRow.glTemplateName = ['8388843215D44D5F9F2968344D34DBD2']
  //console.log(data.selectedRow)
  //data.selectedRow = row;
  //console.log(data.selectedRow)
  modalApi.open()
}

const closeDiaLog = () => {
  modalApi.close();
}



const edit = (row) => {
  data.selectedRow = row;
  modalApi.open()
}

const queryName = async () => {

  var name = code.value

  const response = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/commandTemplate/getNameList',name);
  console.log(response)
  nameList.value = response;
  console.log(nameList)
}

const batchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要删除的数据');
    return;
  }
  ElMessageBox.confirm('确定要删除这些数据吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    batchDeleteBatch();
  }).catch(() => {
    ElMessage.info('已取消删除');
  });
};

const batchDeleteBatch = async () => {
  try {
    await requestClient.post(import.meta.env.VITE_NSOSGZ + '/disposeCommandType/deletebatchData', selectedRows.value);
    query();
    selectedRows.value = [];
    ElMessage.success('删除成功');
  } catch (error) {
    console.error('删除失败:', error);
    query();
    //ElMessage.error(error.message);
  }
}

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
});
const [ModalB, modalApiB] = useVbenModal({
  onCancel() {
    modalApiB.close();
  },
});

</script>
<style scoped>
.primary{
  color: hsl(var(--primary));
}

.clickable {
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

/* .name-container {

  display: flex;
  flex-direction: column;
  gap: 8px;
}

.name-item {
  word-break: break-all;
  padding: 4px 0;
  line-height: 1.5;
}


.name-container span {
  color: #909399;
  font-style: italic;
} */
</style>
