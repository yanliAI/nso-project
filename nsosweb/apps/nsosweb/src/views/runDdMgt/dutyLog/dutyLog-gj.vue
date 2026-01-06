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
            <el-form-item label="告警发生时间:" prop="alarmOccurTime">
              <el-date-picker v-model="data.formData.alarmOccurTime" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item label="告警内容:" prop="alarmContent">
              <el-input v-model="data.formData.alarmContent" clearable />
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
        <el-table-column prop="alarmOccurTime" label="告警发生时间" :formatter="tDateTimeFormat" align="center" width="150" />
        <el-table-column prop="alarmLevel" label="告警级别" align="center" width="80" />
        <el-table-column prop="alarmContent" label="告警明细" width="400" />
        <el-table-column prop="belongsSystem" label="所属系统" align="center" width="120" />
        <el-table-column prop="belongsSubSystem" label="所属子应用" align="center" width="150" />
        <el-table-column prop="sysModule" label="所属子模块" align="center" width="150" />
        <el-table-column prop="resourceType" label="资源类型" align="center" width="80" />
        <el-table-column prop="resourceName" label="资源名称" align="center" width="100" />
        <el-table-column prop="toOrder" label="告警转工单" align="center" width="150" />
        <el-table-column prop="labelDesc" label="标签" align="center" width="100" />
        <el-table-column prop="handelStatus" label="处置状态" align="center" width="100" />
        <el-table-column prop="handleTime" label="处置时间" :formatter="tDateTimeFormat" align="center" width="150" />
        <el-table-column prop="handlePeople" label="处置人" align="center" width="100" />
        <el-table-column prop="faultCode" label="故障工单号" align="center" width="150" />
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
  const dropType = ['NSOS_ALARM_STATUS', 'NSOS_ALARM_LEVEL'];
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);
  query();
});

const data = reactive({
  tableData: [],
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
