<template>
  <el-tabs ref="myTab" v-model="data.tabIndex" @tab-remove="removeTab">
    <el-tab-pane label="列表记录" name="list" :closable="false">
      <el-container class="h-full bg-white">
        <el-header height="95px">
          <el-form label-width="auto" :model="data.formData" :inline="true" label-position="right" class="demo-form-inline mt-2">
            <el-row>
              <el-col :span="5">
                <el-form-item label="所属系统:" prop="belongsSystem">
                  <el-input v-model="data.formData.belongsSystem" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="系统模块:" prop="sysModule">
                  <el-input v-model="data.formData.sysModule" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="资源名称:" prop="resourceName">
                  <el-input v-model="data.formData.resourceName" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="告警状态:" prop="handleContent" filterable>
                  <el-select v-model="data.formData.handleContent" clearable>
                    <el-option v-for="item in dropList.NSOS_INFO_SUBMISSION_STATUS" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-form-item label="告警发生时间:" prop="alarmOccurTimeSt">
                  <el-date-picker v-model="data.formData.alarmOccurTimeSt" value-format="YYYY-MM-DD HH:mm:ss" clearable/>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="-&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" prop="alarmOccurTimeEd">
                  <el-date-picker v-model="data.formData.alarmOccurTimeEd" value-format="YYYY-MM-DD HH:mm:ss" clearable/>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="告警内容:" prop="alarmContent">
                  <el-input v-model="data.formData.alarmContent" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="4" style="display: flex; justify-content: flex-end">
                <el-button type="primary" @click="query">查询</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-header>
        <el-main style="height: calc(100% - 145px)">
          <el-table ref="alarmFaultTable" :data="data.tableData" border size="small" style="height: 100%">
            <el-table-column type="selection" align="center"  width="40"/>
            <el-table-column type="index" label="#" align="center" width="40" />
            <el-table-column prop="alarmOccurTime" label="告警发生时间" :formatter="tDateTimeFormat" width="130" align="center"/>
            <el-table-column prop="alarmLevel" label="告警级别" column-key="NSOS_INFO_SUBMISSION_TYPE" :formatter="formatDrop" align="center" width="80" />
            <el-table-column prop="alarmContent" label="告警明细"align="left" header-align="center"/>
            <el-table-column prop="belongsSystem" label="所属系统" align="center" width="100" />
            <el-table-column prop="belongsSubSystem" label="所属子应用" align="center" width="100" />
            <el-table-column prop="sysModule" label="所属子模块" align="center" width="100" />
            <el-table-column prop="resourceType" label="资源类型" column-key="NSOS_BK_OS_TYPE" :formatter="formatDrop" align="center" width="80" />
            <el-table-column prop="resourceName" label="资源名称" align="center" width="100" />
            <el-table-column prop="labelDesc" label="标签" align="left" header-align="center" width="150" />
            <el-table-column prop="handleContent" label="处置状态" column-key="NSOS_INFO_SUBMISSION_STATUS" :formatter="formatDrop" align="center" width="80" />
            <el-table-column prop="handleTime" label="处置时间" :formatter="tDateTimeFormat" width="150" align="center"/>
            <el-table-column prop="handleMan" label="处置人" width="120" align="center"/>
            <el-table-column prop="faultCode" label="故障工单号" align="center" width="140">
              <template #default="scope">
                <div @click="showDetail(scope.row)" class="clickable primary">
                  {{ scope.row.faultCode }}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
        <el-footer height="45px">
          <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" class="mt-1"
            :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange" @current-change="currentChange"></el-pagination>
        </el-footer>
      </el-container>
    </el-tab-pane>
    <el-tab-pane v-for="item in data.tabArr" :key="item.name" :label="item.title" :name="item.name" closable>
    </el-tab-pane>
  </el-tabs>
</template>
<script setup>
import { Page } from '@vben/common-ui';
import { ElForm, ElFormItem, ElRow, ElCol, ElTable, ElTableColumn, ElPagination, 
         ElMain, ElContainer, ElHeader, ElFooter, ElTabs, ElTabPane, ElMessageBox, ElMessage } from 'element-plus';
import { reactive, ref, onMounted } from 'vue';
import { requestClient } from '#/api/request';
import { useDropStore } from '#/store';
import { tDateTimeFormat, formatDrop } from '#/utils/commonUtil.ts';
import { queryGjData } from './faultReceiveMethod.ts';

const dropList = reactive({});

onMounted(async () => {
  const dropStore = useDropStore();
  const dropType = ['NSOS_INFO_SUBMISSION_STATUS', 'NSOS_INFO_SUBMISSION_TYPE', 'NSOS_BK_OS_TYPE'];
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);
  query();
});
const alarmFaultTable = ref();

const data = reactive({
  tableData: [],
  formData: {},
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0,
  },
  tabIndex: 'list',
  tabArr: [],
});

const query = async () => {
  data.formData.pageSize = data.pageInfo.pageSize;
  data.formData.pageNo = data.pageInfo.pageNo;
  const { list, pageNo, count } = await queryGjData(data.formData);
  data.tableData = list;
  data.pageInfo.pageNo = pageNo;
  data.pageInfo.total = count;
};

const handleSizeChange = (val) => {
  data.pageInfo.pageSize = val;
  query();
};

const currentChange = (val) => {
  data.pageInfo.pageNo = val;
  query();
};

const showDetail = (row) => {
  let tabArr = data.tabArr;
  let tab;
  if (row) {
    tabArr.some((item) => {
      if (item.faultId == row.id) {
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
      tab.title = row.yfbzgdh ? row.yfbzgdh : "未编号";
      tab.faultId = row.id
    } else {
      // 新增工单tab信息
      tab.title = "新增";
      tab.faultId = null
    }
    tabArr.push(tab);
  }
  data.tabIndex = tab.name;
}

const removeTab = (targetName) => {
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
