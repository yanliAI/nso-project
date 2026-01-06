<template>
  <el-container class="h-full bg-white">
    <el-header height="50px">
      <el-form label-width="auto" :model="data.formData" :inline="true" label-position="right"
        class="demo-form-inline mt-2">
        <el-row>
          <el-col :span="4" style="display: flex; ">
            <el-button type="primary" class="ml-4" :icon="Plus" @click="add">新增</el-button>
            <el-button type="primary" class="ml-4" :icon="Delete" @click="batchDelete">批量删除</el-button>
            <el-button type="primary" class="ml-4" :icon="Search" @click="query">查询</el-button>
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
          width="120" />
        <el-table-column prop="templateName" align="center" width="180">
          <template #header>
            <span style="color: red">*</span>
            <span>类别名称</span>
          </template>
        </el-table-column>
        <el-table-column prop="slDeptStr"  align="left">
          <template #header>
            <span style="color: red">*</span>
            <span>关联模板</span>
          </template>
          <template #default="scope">
            <!-- <el-button type="text" @click="console.log(scope.row.slDeptStr)">{{ scope.row.slDeptStr }}</el-button> -->
            <span v-for="(item, index) in splitStr(scope.row.slDeptStr)" :key="index" class="clickable-tag">
              <el-button type="text" @click="edit2(item)">{{ item }}；</el-button>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="isGtzz" label="是否启用挂图作战" column-key="NSOS_YES_OR_NO" :formatter="formatDrop"
          align="center" width="150" />
        <el-table-column prop="creatorId" label="创建人" column-key="NSOS_USER_NAME" :formatter="formatDrop" align="center"
          width="100" />
        <el-table-column prop="createTime" label="创建时间" :formatter="tDateTimeFormat" align="center" width="130" />
        <el-table-column prop="updatorId" label="最后修改人" column-key="NSOS_USER_NAME" :formatter="formatDrop" align="center" width="100" />
        <el-table-column prop="updateTime" label="最后修改时间" :formatter="tDateTimeFormat" align="center" width="130" />
        <el-table-column label="操作" align="center" width="150">
          <template #default="scope">
            <!-- <el-button type="text" @click="showTemplateDialog(scope.row)">编辑</el-button> -->
            <el-button type="text" @click="add2(scope.row)">编辑</el-button>
            <el-button link type="danger" size="small" @click="batchDeleteOne(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer height="45px">
      <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" class="mt-1"
        :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange" @current-change="currentChange"></el-pagination>
    </el-footer>

    <Modal class="w-[800px] h-[250px]" title="类别信息" :footer="false" :closeOnClickModal="false" :draggable="true">
      <TemplateDiaLog :formData="data.selectedRow" @close="addClose" @closeDiaLog="closeDiaLog" @query="query">
      </TemplateDiaLog>
    </Modal>

    <ModalB class="w-[1200px] h-[800px]" title="选择指令模板" :footer="false" :closeOnClickModal="false" :draggable="true">
      <TemplateList :typeCode="code" @closeDiaLog2="closeDiaLog2" />
    </ModalB>

    <ModalC class="w-[800px] h-[380px]" title="模板信息详情" :footer="false" :closeOnClickModal="false" :draggable="true">
      <TemplateDiaLog2 :formData="data.selectedRow" @close="addClose" @closeDiaLog="closeDiaLog" @query="query">
      </TemplateDiaLog2>
    </ModalC>
  </el-container>
</template>
<script setup>
import { Page } from '@vben/common-ui';
import { Search, Delete, Plus, Download, Operation } from '@element-plus/icons-vue';
import { ElForm, ElFormItem, ElRow, ElCol, ElTable, ElTableColumn, ElPagination,
         ElMain, ElContainer, ElHeader, ElFooter, ElLink,
         ElTabs, ElTabPane, ElMessageBox, ElMessage, ElDialog } from 'element-plus';
import { reactive, ref, onMounted } from 'vue';
import { requestClient } from '#/api/request';
import { useDropStore } from '#/store';
import { queryData } from './cmdTemplateMethod.ts';
import { useVbenModal } from '@vben/common-ui';
import TemplateDiaLog from './TemplateDiaLog.vue';
import TemplateDiaLog2 from './TemplateDiaLog2.vue';
import { tDateFormat, tDateTimeFormat, formatDrop, lookFlow } from '#/utils/commonUtil.ts';
import TemplateList from './templateList.vue'

const dropList = reactive({});
const nameList = ref([]);
const templateDialogVisible = ref(false);
onMounted(async () => {
  const dropStore = useDropStore();
  const dropType = ['NSOS_USER_NAME', 'NSOS_ORG_NAME', 'NSOS_CMD_FL','NSOS_CMD_TYPE','NSOS_CMD_TEMPLATE','NSOS_YES_OR_NO'];
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
  data.tableData = list;
  data.pageInfo.pageNo = pageNo;
  data.pageInfo.total = count;
  formatEntity();
};

const formatEntity = () => {
  if (!data.tableData) return
  data.tableData.forEach(r => {
    let sldw = eval(r.glTemplateName)
    let l = ''
    if (sldw && sldw.length > 0) {
      sldw.forEach(d => {
        dropList.NSOS_CMD_TEMPLATE.forEach(o => {
          if (d == o.value) {
            l += o.label + '；'
          }
        })
      })
    }
    r.slDeptStr = l
  })
}

// 分割名称方法
const splitNames = (str) => {
  return str
    ? str.split('-').filter(item => item.trim()) // 分割并过滤空值
    : []
}

const splitStr = (str) => {
  return  str
    ? str.split("；").filter(item => item.trim() !== "")
    : ""
}

const handleCellClick = (row, column, cell, event) => {

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
  data.selectedRow = row;
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

const edit2 = async (item) => {
  const response = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/commandTemplate/queryOneData',{"templateName": item});
  data.selectedRow = response;
  modalApiC.open()
}

const queryName = async () => {

  var name = code.value

  const response = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/commandTemplate/getNameList',name);
  nameList.value = response;
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

const batchDeleteOne = (row) => {
  ElMessageBox.confirm('确定要删除吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    batchDeleteOnes(row);
  }).catch(() => {
    ElMessage.info('已取消删除');
  });
};
const batchDeleteOnes = async (row) => {
  try {
    const selectedRows = ref([]);
    selectedRows.value.push(row);
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
const [ModalC, modalApiC] = useVbenModal({
  onCancel() {
    modalApiC.close();
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
