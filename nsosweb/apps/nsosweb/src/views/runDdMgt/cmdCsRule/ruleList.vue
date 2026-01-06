<template>
  <el-container class="h-full bg-white">
    <el-header height="50px">
      <el-form label-width="auto" :model="data.formData" :inline="true" label-position="right" class="demo-form-inline mt-1">
        <el-row>
          <el-col :span="4">
            <el-form-item label="类型:">
              <el-select v-model="cmdLx" filterable clearable>
                <el-option v-for="item in dropList.NSOS_CMD_FL" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="类别名称:" filterable>
              <el-select v-model="data.formData.commandTypeCode" filterable clearable>
                <el-option v-for="item in data.cmdLbDrop" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="指令状态:" filterable>
              <el-select v-model="data.formData.commandState" filterable clearable>
                <el-option v-for="item in dropList.NSOS_COMMAND_STATE" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" >
            <el-button type="primary" class="ml-4" :icon="Search" @click="query">查询</el-button>
            <el-button type="primary" class="ml-4" :icon="Plus" @click="add">新增</el-button>
            <el-button type="primary" class="ml-4" :icon="Delete" @click="batchDelete">批量删除</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-main style="height: calc(100% - 95px)">
      <el-table ref="scheduleListTable" :data="data.tableData" border size="small" @selection-change="handleSelectionChange" style="height: 100%"
      stripe :header-cell-style="{ backgroundColor: '#F2F3F5', color: '#666666', fontSize: '14px', height: '40px', textAlign: 'center' }">
        <el-table-column type="selection" align="center" />
        <el-table-column type="index" label="#" align="center" width="50" />
        <el-table-column prop="commandFl" label="类型" column-key="NSOS_CMD_FL" :formatter="formatDrop" align="center"  width="150" />
        <el-table-column prop="commandTypeCode" label="类别名称" column-key="NSOS_CMD_TYPE" :formatter="formatDrop" align="center"  width="150" />
        <el-table-column prop="commandState" label="处置状态" column-key="NSOS_COMMAND_STATE" :formatter="formatDrop" align="center"  width="150" />
        <el-table-column prop="timeoutLimit" label="处置超时时限(小时)" align="center" width="180" />
        <el-table-column prop="urgingLimit" label="催办时限(小时)" align="center" width="120" />
        <el-table-column prop="creatorId" label="创建人" column-key="NSOS_USER_NAME" :formatter="formatDrop" align="center" width="130" />
        <el-table-column prop="createTime" label="创建时间" :formatter="tDateTimeFormat" align="center" width="200" />
        <el-table-column prop="updatorId" label="最后修改人" column-key="NSOS_USER_NAME" :formatter="formatDrop" align="center" width="130" />
        <el-table-column prop="updateTime" label="最后修改时间" :formatter="tDateTimeFormat" align="center" width="200" />
        <el-table-column label="操作" align="center" >
          <template #default="scope">
            <el-button link type="primary" size="small" @click="edit(scope.row)">编辑</el-button>
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

    <Modal class="w-[800px] h-[400px]" title="处置规则配置" :footer="false" :closeOnClickModal="false" :draggable="true">
      <TemplateDiaLog :formData="data.selectedRow" @close="addClose" @closeDiaLog="closeDiaLog" @query="query"></TemplateDiaLog>
    </Modal>

  </el-container>
</template>
<script setup>
import { Page } from '@vben/common-ui';
import { Search, Delete, Plus, Download, Operation } from '@element-plus/icons-vue';
import { ElForm, ElFormItem, ElRow, ElCol, ElTable, ElTableColumn, ElPagination,
         ElMain, ElContainer, ElHeader, ElFooter,
         ElTabs, ElTabPane, ElMessageBox, ElMessage, ElDialog } from 'element-plus';
import { reactive, ref, onMounted,watch } from 'vue';
import { requestClient } from '#/api/request';
import { useDropStore } from '#/store';
import { queryData } from './cmdTemplateMethod.ts';
import { useVbenModal } from '@vben/common-ui';
import TemplateDiaLog from './TemplateDiaLog.vue';
import { tDateFormat, tDateTimeFormat, formatDrop, lookFlow } from '#/utils/commonUtil.ts';

const dropList = reactive({});
onMounted(async () => {
  const dropStore = useDropStore();
  const dropType = ['NSOS_USER_NAME', 'NSOS_ORG_NAME', 'NSOS_CMD_FL','NSOS_CMD_TYPE','NSOS_COMMAND_STATE'];
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);
  query();
});
const scheduleListTable = ref();
const selectedRows = ref([]);

const cmdLx = ref()
const data = reactive({
  tableData: [],
  formData: {},
  cmdLbDrop: [],
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

  data.formData.commandFl = cmdLx.value
  const { list, pageNo, count } = await queryData(data.formData);
  console.log(list);
  data.tableData = list;
  data.pageInfo.pageNo = pageNo;
  data.pageInfo.total = count;

};

watch(cmdLx, (newval) => {
  data.cmdLbDrop = dropList.NSOS_CMD_TYPE?.filter(option => option.filter === newval)
})
const refreshClick = () => {
  data.formData = {}
  cmdLx.value = null
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

const closeDiaLog = () => {
  modalApi.close();
}

const edit = (row) => {
  console.log(row)
  data.selectedRow = row;
  modalApi.open()
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
    console.log(111)
    console.log(selectedRows.value)
    await requestClient.post(import.meta.env.VITE_NSOSGZ + '/disposeCommandRule/deletebatchData', selectedRows.value);
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
    await requestClient.post(import.meta.env.VITE_NSOSGZ + '/disposeCommandRule/deletebatchData', selectedRows.value);
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
</style>
