<template>
  <el-container class="h-full bg-white">
    <el-header height="95px">
      <el-form label-width="auto" :model="data.formData" :inline="true" label-position="right" class="demo-form-inline mt-2">
        <el-row>
          <el-col :span="5">
            <el-form-item label="值长:" prop="shiftSupervisor">
              <el-input v-model="data.formData.shiftSupervisor" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="安全检测:" prop="securityCheck">
              <el-input v-model="data.formData.securityCheck" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="值班员:" prop="peopleName">
              <el-input v-model="data.formData.peopleName" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="处理时间:" prop="handleTime">
              <el-date-picker v-model="data.formData.handleTime" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="作业开始时间:" prop="commandTime">
              <el-date-picker v-model="data.formData.commandTime" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="计划单号:" prop="planCode">
              <el-input v-model="data.formData.planCode" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="变更单号:" prop="changeCode">
              <el-input v-model="data.formData.changeCode" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="1" style="display: flex; justify-content: flex-end">
            <el-button type="primary" @click="query">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-main style="height: calc(100% - 140px)">
      <el-table :data="data.tableData" border size="small" style="height: 100%" 
      stripe :header-cell-style="{ backgroundColor: '#F2F3F5', color: '#666666', fontSize: '14px', height: '40px', textAlign: 'center' }">
        <el-table-column type="selection" align="center" />
        <el-table-column type="index" label="#" align="center" width="40" />
        <el-table-column prop="shiftSupervisor" label="值长" align="center" width="150" />
        <el-table-column prop="securityCheck" label="安全检测" align="center" width="150" />
        <el-table-column prop="shiftPeople" label="值班员" align="center" width="200" />
        <el-table-column prop="handleTime" label="处理时间" :formatter="tDateTimeFormat" align="center" width="150" />
        <el-table-column prop="planCode" label="计划单号" align="center" width="150" />
        <el-table-column prop="changeCode" label="变更单号" align="center" width="150" />
        <el-table-column prop="taskName" label="作业名称" align="center" width="150" />
        <el-table-column prop="riskLevel" label="风险等级" align="center" width="150" />
        <el-table-column prop="urgentLevel" label="紧急程度" align="center" width="150" />
        <el-table-column prop="taskType" label="类型" align="center" width="150" />
        <el-table-column prop="taskStartTime" label="作业开始时间" :formatter="tDateTimeFormat" align="center" width="150" />
        <el-table-column prop="taskEndTime" label="作业结束时间" :formatter="tDateTimeFormat" align="center" width="150" />
        <el-table-column prop="taskRange" label="影响范围" align="center" width="150" />
        <el-table-column prop="taskContent" label="作业内容"  align="center" width="150" />
        <el-table-column prop="taskDept" label="作业单位" align="center" width="150" />
        <el-table-column prop="taskChargePeople" label="作业负责人" align="center" width="120" />
      </el-table>
    </el-main>
    <el-footer height="45px">
      <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" class="mt-1"
        :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange" @current-change="currentChange"></el-pagination>
    </el-footer>
  </el-container>
</template>
<script setup>
import { Page } from '@vben/common-ui';
import { ElForm, ElFormItem, ElRow, ElCol, ElTable, ElTableColumn, ElPagination, 
         ElMain, ElContainer, ElHeader, ElFooter, 
         ElTabs, ElTabPane, ElMessageBox, ElMessage, ElDialog } from 'element-plus';
import { reactive, ref, onMounted } from 'vue';
import { useDropStore } from '#/store';
import { tDateTimeFormat, formatDrop } from '#/utils/commonUtil.ts';

const dropList = reactive({});
onMounted(async () => {
  const dropStore = useDropStore();
  const dropType = [];
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);
  query();
});

const data = reactive({
  tableData: [
    {
      id: '1',
      shiftSupervisor: '刘溪',
      securityCheck: '陈焱宇',
      shiftPeople: '张立坚、唐晓明、彭俊威',
      handleTime: '2025-03-10 01:15:34.000',
      planCode: 'PLAN20250327001',
      changeCode: 'CH202503270002',
      taskName: '作业名称',
      riskLevel: '高',
      urgentLevel: '紧急',
      taskType: '紧急工作牌',
      taskStartTime: '2025-03-10 01:15:34.000',
      taskEndTime: '2025-03-10 01:15:34.000',
      taskRange: '影响范围',
      taskContent: '作业内容xxx',
      taskDept: '作业单位xxx',
      taskChargePeople: '张工',
    },
    {
      id: '2',
      shiftSupervisor: '刘溪',
      securityCheck: '陈焱宇',
      shiftPeople: '张立坚、唐晓明、彭俊威',
      handleTime: '2025-03-10 01:15:34.000',
      planCode: 'PLAN20250327001',
      changeCode: 'CH202503270002',
      taskName: '作业名称',
      riskLevel: '高',
      urgentLevel: '紧急',
      taskType: '紧急工作牌',
      taskStartTime: '2025-03-10 01:15:34.000',
      taskEndTime: '2025-03-10 01:15:34.000',
      taskRange: '影响范围',
      taskContent: '作业内容xxx',
      taskDept: '作业单位xxx',
      taskChargePeople: '张工',
    },
  ],
  formData: {},
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0,
  },
});

const query = async () => {
  data.formData.pageSize = data.pageInfo.pageSize;
  data.formData.pageNo = data.pageInfo.pageNo;
  // const { list, pageNo, count } = await queryData(data.formData);
  // data.tableData = list;
  // data.pageInfo.pageNo = pageNo;
  // data.pageInfo.total = count;
};

const handleSizeChange = (val) => {
  data.pageInfo.pageSize = val;
  query();
};

const currentChange = (val) => {
  data.pageInfo.pageNo = val;
  query();
};
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
