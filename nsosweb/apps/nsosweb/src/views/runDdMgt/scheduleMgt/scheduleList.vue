<template>
  <el-container class="h-full bg-white">
    <el-header height="50px">
      <el-form label-width="auto" :model="data.formData" :inline="true" label-position="right" class="demo-form-inline mt-2">
        <el-row>
          <el-col :span="4">
            <el-form-item label="班次名称:" prop="shiftName">
              <el-input v-model="data.formData.shiftName" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="值长:" prop="shiftSupervisor">
              <el-input v-model="data.formData.shiftSupervisor" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="人员姓名:" prop="peopleName">
              <el-input v-model="data.formData.peopleName" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="时间范围:" prop="shiftTimeSt">
              <el-date-picker v-model="data.formData.shiftTimeSt" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="-&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" prop="shiftTimeEd">
              <el-date-picker v-model="data.formData.shiftTimeEd" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="4" style="display: flex; justify-content: flex-end">
            <el-button type="primary" @click="query">查询</el-button>
            <el-button type="primary" @click="add">新增</el-button>
            <el-button type="primary" @click="toExcelClick">导出</el-button>
            <el-button type="primary" @click="batchDelete">删除</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-main style="height: calc(100% - 95px)">
      <el-table ref="scheduleListTable" :data="data.tableData" border size="small" style="height: 100%" 
      stripe :header-cell-style="{ backgroundColor: '#F2F3F5', color: '#666666', fontSize: '14px', height: '40px', textAlign: 'center' }">
        <el-table-column type="selection" align="center" />
        <el-table-column type="index" label="#" align="center" width="40" />
        <el-table-column prop="shiftName" label="班次名称" align="center" width="200" />
        <el-table-column prop="shiftSupervisor" label="值长" align="center" width="200" />
        <el-table-column prop="securityCheck" label="安全检测" align="center" width="200" />
        <el-table-column prop="shiftPeople" label="值班员" align="center" />
        <el-table-column prop="startTime" label="开始时间" :formatter="tDateTimeFormat" align="center" width="150" />
        <el-table-column prop="endTime" label="结束时间" :formatter="tDateTimeFormat" align="center" width="150" />
        <el-table-column prop="month" label="月份" align="center" width="100" />
        <el-table-column label="操作" align="center" width="120">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="edit(scope.row)">编辑</el-button>
            <el-button link type="danger" size="small" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer height="45px">
      <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" class="mt-1"
        :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange" @current-change="currentChange"></el-pagination>
    </el-footer>

    <Modal class="w-[1000px] h-[280px]" title="新增排班" :footer="false" :closeOnClickModal="false" :draggable="true">
      <ScheduleDiaLog :formData="data.selectedRow" @close="addClose"></ScheduleDiaLog>
    </Modal>
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
import { queryData } from './scheduleMgtMethod.ts';
import { useVbenModal } from '@vben/common-ui';
import ScheduleDiaLog from './scheduleDiaLog.vue';

const dropList = reactive({});
onMounted(async () => {
  const dropStore = useDropStore();
  const dropType = ['NSOS_ALARM_STATUS', 'NSOS_ALARM_LEVEL'];
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);
  query();
});
const scheduleListTable = ref();

const data = reactive({
  tableData: [
    {
      id: '1',
      shiftName: '3月12日（早班甲）',
      shiftSupervisor: '刘溪',
      securityCheck: '陈焱宇',
      shiftPeople: '张立坚、唐晓明、彭俊威',
      startTime: '2025-3-12 9:00',
      endTime: '2025-3-12 18:00',
      month: '2025-03',
    },
    {
      id: '2',
      shiftName: '3月12日（早班乙）',
      shiftSupervisor: '李文轩',
      securityCheck: '陈士强',
      shiftPeople: '张立坚、乔曙、邱东飞',
      startTime: '2025-3-12 18:00',
      endTime: '2025-3-13 9:00',
      month: '2025-03',
    },
    {
      id: '3',
      shiftName: '3月12日（早班丙）',
      shiftSupervisor: '刘溪',
      securityCheck: '陈焱宇',
      shiftPeople: '张立坚、唐晓明、彭俊威',
      startTime: '2025-3-13 9:00',
      endTime: '2025-3-13 18:00',
      month: '2025-03',
    }
  ],
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

const add = () => {
  data.selectedRow = {};
  modalApi.open()
}
const toExcelClick = () => {

}
const batchDelete = () => {

}
const edit = (row) => {
  data.selectedRow = row;
  modalApi.open()
}
const del = () => {

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
