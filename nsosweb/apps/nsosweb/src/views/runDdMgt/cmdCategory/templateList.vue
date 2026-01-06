<template>
  <el-container class="h-full bg-white">
    <el-header height="50px">
      <el-form label-width="auto" :model="data.formData" :inline="true" label-position="right" class="demo-form-inline mt-2">
        <el-row>
          <el-col :span="6">
            <el-form-item label="指令类型:" prop="commandFl" filterable>
              <el-select v-model="data.formData.commandFl" clearable>
                <el-option v-for="item in dropList.NSOS_CMD_FL" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="指令类别:" prop="commandTypeCode" filterable>
              <el-select v-model="data.formData.commandTypeCode" clearable>
                <el-option v-for="item in dropList.NSOS_CMD_TYPE" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="模板内容:" prop="cmdContent">
              <el-input v-model="data.formData.cmdContent" clearable />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="4">
          </el-col> -->
          <el-col :span="6" style="display: flex; justify-content: flex-end">
            <el-button type="primary" class="ml-4" :icon="Search" @click="query">查询</el-button>
            <el-button type="primary" class="ml-4"  @click="batchDelete">关联</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-main style="height: calc(100% - 95px)">
      <el-table ref="scheduleListTable" :data="data.tableData" border size="small" @selection-change="handleSelectionChange" style="height: 100%"
      stripe :header-cell-style="{ backgroundColor: '#F2F3F5', color: '#666666', fontSize: '14px', height: '40px', textAlign: 'center' }">
        <el-table-column type="selection" align="center" />
        <el-table-column type="index" label="#" align="center" width="40" />
        <el-table-column prop="templateName" label="模板名称" align="center" width="200" />
        <el-table-column prop="cmdContent" label="指令内容" align="center" />
        <el-table-column prop="slDeptStr" label="受令单位"  align="center" width="300" />
        <el-table-column prop="finishLimit" label="完成时限(小时)" align="center" width="150" />
        <!-- <el-table-column prop="shiftName" label="创建单位" align="center" width="200" /> -->
        <el-table-column prop="creatorId" label="创建人" column-key="NSOS_USER_NAME" :formatter="formatDrop" align="center" width="200" />
        <el-table-column prop="createTime" label="创建时间" :formatter="tDateTimeFormat" align="center" width="150" />
      </el-table>
    </el-main>
    <el-footer height="45px">
      <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" class="mt-1"
        :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange" @current-change="currentChange"></el-pagination>
    </el-footer>

    <Modal class="w-[1000px] h-[800px]" title="新增模板" :footer="false" :closeOnClickModal="false" :draggable="true">
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
import { reactive, ref, onMounted } from 'vue';
import { requestClient } from '#/api/request';
import { useDropStore } from '#/store';
import { queryData } from './cmdTemplateMethod2.ts';
import { useVbenModal } from '@vben/common-ui';
import TemplateDiaLog from './TemplateDiaLog.vue';
import { tDateFormat, tDateTimeFormat, formatDrop, lookFlow } from '#/utils/commonUtil.ts';

const typeCode2 = defineModel('typeCode')
const emit = defineEmits(['closeDiaLog2'])
const dropList = reactive({});
onMounted(async () => {
  const dropStore = useDropStore();
  const dropType = ['NSOS_USER_NAME', 'NSOS_ORG_NAME', 'NSOS_CMD_FL','NSOS_CMD_TYPE'];
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);
  query();
});
const scheduleListTable = ref();
const selectedRows = ref([]);

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

  formatEntity();
};

const formatEntity = () => {
  if (!data.tableData) return
  data.tableData.forEach(r => {
    let sldw = eval(r.slDept)
    let l = ''
    if (sldw && sldw.length > 0) {
      sldw.forEach(d => {
        dropList.NSOS_ORG_NAME.forEach(o => {
          if (d == o.value) {
            l += o.label + '；'
          }
        })
      })
    }
    r.slDeptStr = l
  })
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
  data.selectedRow = row;
  modalApi.open()
}
const batchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要关联的数据');
    return;
  }
  ElMessageBox.confirm('确定要关联这些数据吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    batchDeleteBatch();
  }).catch(() => {
    ElMessage.info('已取消关联');
  });
};

const batchDeleteBatch = async () => {
  try {
    selectedRows.value.forEach(item => {
      item.commandTypeCode = typeCode2.value;
   });
    await requestClient.post(import.meta.env.VITE_NSOSGZ + '/commandTemplate/glData', selectedRows.value);
    query();
    selectedRows.value = [];
    ElMessage.success('关联成功');
    emit('closeDiaLog2');
  } catch (error) {
    console.error('关联失败:', error);
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
