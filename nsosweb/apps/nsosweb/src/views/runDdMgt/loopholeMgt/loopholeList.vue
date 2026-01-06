<template>
  <el-tabs ref="myTab" v-model="data.tabIndex" @tab-remove="removeTab" type="card" class="w-full h-full bg-white">
    <el-tab-pane label="漏洞管理" name="list" :closable="false">
      <el-container class="h-full bg-white">
        <el-header height="95px">
          <el-form label-width="auto" ref="flowForm" :model="data.form" :inline="true" label-position="right" class="demo-form-inline">
            <el-row>
              <el-col :span="4">
                <el-form-item label="编号:" prop="infoCode">
                  <el-input v-model="data.form.infoCode" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="类别:" prop="infoType">
                  <el-select v-model="data.form.infoType" clearable>
                    <el-option v-for="item in dropList.NSOS_INFO_TYPE" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="发现时间" prop="discoverTime">
                  <el-date-picker v-model="data.form.discoverTime" type="daterange" range-separator="-" 
                    start-placeholder="起始时间" end-placeholder="结束时间" />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="系统名称" prop="systemName">
                  <el-input v-model="data.form.systemName" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item>
                  <el-button type="primary" @click="query">查询</el-button>
                  <el-button type="info" @click="reset">重置</el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-button type="primary" :icon="Share" @click="toExcelClick">导出</el-button>
                <el-button type="primary" :icon="Plus" @click="add('2')">新增系统漏洞</el-button>
                <el-button type="primary" :icon="Plus" @click="add('1')">新增终端威胁</el-button>
                <el-button type="primary" :icon="Delete" @click="del">删除</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-header>
        <el-main style="height: calc(100% - 145px)">
          <el-table ref="workFlowTab" :data="data.tableData" border size="small" style="height: 100%">
            <el-table-column type="selection" align="center" />
            <el-table-column type="index" label="序号" align="center" />
            <el-table-column prop="infoCode" label="编号" align="center">
              <template #default="scope">
                <div @click="showDetail(scope.row)" class="clickable primary">
                  {{ scope.row.infoCode }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="infoType" label="类别" column-key="NSOS_INFO_TYPE" :formatter="formatDrop" align="center" />
            <el-table-column prop="discoverTime" label="发现时间" :formatter="tDateTimeFormat" align="center" />
            <el-table-column prop="discoverMan" label="发现人" align="center" />
            <el-table-column prop="infoStatus" label="状态" column-key="NSOS_INFO_STATUS" :formatter="formatDrop" align="center" />
            <el-table-column prop="systemName" label="系统名称" align="center" />
            <el-table-column prop="loopholeLevel" label="漏洞级别" column-key="NSOS_LOOPHOLE_LEVEL" :formatter="formatDrop" align="center" />
            <el-table-column prop="correcteTime" label="整改截止时间" :formatter="tDateTimeFormat" align="center" />
            <el-table-column prop="infoDescribe" label="漏洞信息" align="center" />
          </el-table>
        </el-main>
        <el-footer height="45px">
          <el-pagination v-model:current-page="data.pageInfo.pageNo" v-model:page-size="data.pageInfo.pageSize" class="mt-1"
            :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange" @current-change="currentChange"></el-pagination>
        </el-footer>
      </el-container>
    </el-tab-pane>
    <el-tab-pane v-for="item in data.tabArr" :key="item.name" :label="item.title" :name="item.name" closable>
      <SystemLoophole v-if="item.type === '2'" :id="item.id"></SystemLoophole>
      <TerminalThreat v-if="item.type === '1'" :id="item.id"></TerminalThreat>
    </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts" setup>
import {
  ElTable,
  ElTableColumn,
  ElFormItem,
  ElForm,
  ElInput,
  ElButton,
  ElSelect,
  ElRow,
  ElCol,
  ElPagination,
  ElMessage,
  ElMessageBox,
  ElDatePicker,
  ElTabs, ElTabPane, ElMain, ElContainer, ElHeader, ElFooter,
  type FormInstance,
} from 'element-plus';
import { Plus, Delete, Share } from '@element-plus/icons-vue';
import { reactive, ref, onMounted, nextTick } from 'vue';
import { requestClient } from '#/api/request';
import { useDropStore } from '#/store';
import SystemLoophole from './loopholeDetail/systemLoophole.vue';
import TerminalThreat from './loopholeDetail/terminalThreat.vue';
import { tDateFormat, tDateTimeFormat, formatDrop } from '#/utils/commonUtil.ts';
import { downloadFile } from '#/utils/download.ts';

const dropList: any = reactive({});

onMounted(async () => {
  const dropStore = useDropStore();
  const dropType = ['NSOS_INFO_TYPE', 'NSOS_INFO_STATUS', 'NSOS_LOOPHOLE_LEVEL'];
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);
  nextTick().then(() => {
    query();
  });
});
const workFlowTab = ref();
const flowForm = ref<FormInstance>();

const data = reactive({
  dialogShow: false,
  tableData: [],
  rowInfo: {},
  title: '',
  form: {
    infoCode: '',
    infoType: '',
    discoverTime: [],
    systemName: '',
  },
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0,
  },
  tabIndex: 'list',
  tabArr: [],
});

interface queryParams {
  infoCode: string;
  infoType: string;
  start: string;
  end: string;
  systemName: string;
  pageNo: number;
  pageSize: number;
}

const params: queryParams = reactive({
  infoCode: '',
  infoType: '',
  start: '',
  end: '',
  systemName: '',
  pageNo: data.pageInfo.pageNo,
  pageSize: data.pageInfo.pageSize,
});

async function getFlowTableApi(params: queryParams) {
  return requestClient.post(
    import.meta.env.VITE_NSOSGZ + '/loopholeSecurityInfo/query',
    params,
  );
}

async function batchDeleteApi(params: Object[]) {
  return requestClient.post(
    import.meta.env.VITE_NSOSGZ + '/loopholeSecurityInfo/batchDelete',
    params,
  );
}

const query = async () => {
  params.infoCode = data.form.infoCode;
  params.infoType = data.form.infoType;
  params.systemName = data.form.systemName;
  if(data.form.discoverTime?.[0]){
    params.start = data.form.discoverTime[0].getTime();
  }else {
    params.start = null;
  }
  if(data.form.discoverTime?.[1]){
    params.end = data.form.discoverTime[1].getTime();
  }else {
    params.end = null;
  }
  console.log(params);
  const { list, pageNo, count } = await getFlowTableApi(params);
  data.tableData = list;
  data.pageInfo.pageNo = pageNo;
  data.pageInfo.total = count;
};

const del = () => {
  if (workFlowTab.value.getSelectionRows().length === 0) {
    ElMessage.warning('请先选择要删除的流程');
    return;
  }
  ElMessageBox.confirm('确定要删除这些流程吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      batchDel();
    })
    .catch(() => {
      ElMessage.info('已取消删除');
    });
};

const batchDel = async () => {
  try {
    await batchDeleteApi(workFlowTab.value.getSelectionRows());
    query();
    ElMessage.success('删除成功');
  } catch (error) {
    console.error('删除分类失败:', error);
    ElMessage.error('删除分类失败');
  }
};

const reset = () => {
  data.form.infoCode = '';
  data.form.infoType = '';
  data.form.systemName = '';
  data.form.discoverTime = [];
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

const add = (type) => {
  showDetail(null, type);
}

const showDetail = (row: any, type: string) => {
  let tabArr = data.tabArr;
  let tab;
  if (row) {
    tabArr.some((item) => {
      if (item.id == row.id) {
        tab = item;
        return true;
      }
    });
  }

  if (!tab) {
    tab = {}
    tab.name = new Date().getTime() + '';
    if (row) {
      // 已保存工单tab信息
      tab.title = row.infoCode ? row.infoCode : "未编号";
      tab.id = row.id
      tab.type = row.infoType
    } else {
      // 新增工单tab信息
      tab.title = "新增";
      tab.id = null
      tab.type = type
    }
    tabArr.push(tab);
  }
  data.tabIndex = tab.name;
}

const removeTab = (targetName: string) => {
  let tabArr = data.tabArr;
  let tab;

  let tabIndex = data.tabIndex;
  if (tabIndex === targetName) {
    tabIndex = 'list';
    let nextTab;
    tabArr.forEach(function(tab, index) {
      if (tab.name === targetName) {
        nextTab = tabArr[index + 1] || tabArr[index - 1];
        if (nextTab) {
          tabIndex = nextTab.name;
        }
      }
    });
  }
  data.tabIndex = tabIndex;
  for (var i = 0; i < tabArr.length; i++) {
    if (tabArr[i].name == targetName) {
      tabArr.splice(i, 1);
      break;
    }
  }
}

const toExcelClick = async () => {
  data.form.pageSize = data.pageInfo.pageSize
  data.form.pageNo = data.pageInfo.pageNo
  toExcel(data.form, '漏洞管理导出excel.xlsx')
}

async function toExcel(params: any, excelName: string) {
  return downloadFile(import.meta.env.VITE_NSOSGZ + '/loopholeSecurityInfo/toExcel', params, excelName);
}
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

:deep(.el-tabs) {
  width: 100%;
  height: 100%;
}

:deep(.el-tab-pane) {
  width: 100%;
  height: 100%;
}
</style>
