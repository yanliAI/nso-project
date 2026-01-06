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
            <el-form-item label="发生时间:" prop="occurTime">
              <el-date-picker v-model="data.formData.occurTime" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item label="漏洞（威胁）内容:" prop="alarmContent">
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
        <el-table-column prop="infoType" label="漏洞（威胁）类型" align="center" width="150" />
        <el-table-column prop="infoCode" label="漏洞/威胁编号" align="center" width="150" />
        <el-table-column prop="loopholeName" label="漏洞/威胁名称" width="200" />
        <el-table-column prop="discoverTime" label="发现时间" :formatter="tDateTimeFormat" align="center" width="150" />
        <el-table-column prop="loopholeContent" label="漏洞/威胁内容" width="300" />
        <el-table-column prop="correcteTime" label="整改时限" :formatter="tDateTimeFormat" align="center" width="150" />
        <el-table-column prop="handlePeople" label="处置人员" align="center" width="100" />
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
  const dropType = ['NSOS_INFO_TYPE', 'NSOS_INFO_STATUS', 'NSOS_LOOPHOLE_LEVEL'];
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
      infoType: '漏洞',
      infoCode: 'LD20241017001',
      loopholeName: 'xxx存在xxx漏洞',
      discoverTime: '2025-03-10 01:15:34.000',
      loopholeContent: 'xxx存在xxx漏洞xxxxxx',
      correcteTime: '2025-03-10 01:15:34.000',
      handlePeople: '张工',
    },
    {
      id: '2',
      shiftSupervisor: '刘溪',
      securityCheck: '陈焱宇',
      shiftPeople: '张立坚、唐晓明、彭俊威',
      handleTime: '2025-03-10 01:15:34.000',
      infoType: '漏洞',
      infoCode: 'LD20241017001',
      loopholeName: 'xxx存在xxx漏洞',
      discoverTime: '2025-03-10 01:15:34.000',
      loopholeContent: 'xxx存在xxx漏洞xxxxxx',
      correcteTime: '2025-03-10 01:15:34.000',
      handlePeople: '张工',
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
