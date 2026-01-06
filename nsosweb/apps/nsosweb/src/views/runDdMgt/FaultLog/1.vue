<template>
  <el-container class="h-full bg-white">
    <el-header height="50px">
      <el-button @click="openDialog('12345', '1', '1')">打开弹窗</el-button>
      <el-button @click="openDialogTwo('12345', '1', '1','2')">打开弹窗</el-button>
    </el-header>
    <Modal class="w-[1400px] h-[800px]" title="通知催办详情" :footer="false" :closeOnClickModal="false" :draggable="true">
      <NotificationDialog :ticketNumber="ticketNumber" :reportType="reportType" :notificationType="notificationType" @closeDiaLog="closeDiaLog" ></NotificationDialog>
    </Modal>

    <ModalA class="w-[1400px] h-[800px]" title="故障闭环整改催办信息" :footer="false" :closeOnClickModal="false" :draggable="true">
      <FaultReformNotifyRecordDialog :faultCode="faultCode"  :measureCode="measureCode" :measureContent="measureContent" :recordType="recordType" @closeDiaLog="closeDiaLogA" ></FaultReformNotifyRecordDialog>
    </ModalA>
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
import { useDropStore } from '#/store';;
import { useVbenModal } from '@vben/common-ui';
import NotificationDialog from './NotificationDialog2.vue';
import FaultReformNotifyRecordDialog from './FaultReformNotifyRecordDialog2.vue';
import { tDateFormat, tDateTimeFormat, formatDrop, lookFlow } from '#/utils/commonUtil.ts';

const dropList = reactive({});
const ticketNumber = ref('');
const reportType = ref('');
const notificationType = ref('');

const faultCode = ref('');
const measureCode = ref('');
const measureContent = ref('');
const recordType = ref('');

onMounted(async () => {
  const dropStore = useDropStore();
  const dropType = ['NSOS_USER_NAME', 'NSOS_ORG_NAME', 'NSOS_CMD_FL','NSOS_CMD_TYPE'];
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);
});
const scheduleListTable = ref();
const selectedRows = ref([]);

const data = reactive({
  selectedRow: {},
});

const openDialog = (tn, rt, nt) => {
      ticketNumber.value = tn;
      reportType.value = rt;
      notificationType.value = nt;
      modalApi.open();
    };

    const openDialogTwo = (tn, rt, nt,st) => {
      faultCode.value = tn;
      measureCode.value = rt;
      measureContent.value = nt
      recordType.value = st;
      modalApiA.open();
    };

const closeDiaLog = () => {
  modalApi.close();
}

const closeDiaLogA = () => {
  modalApiA.close();
}

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
});
const [ModalA, modalApiA] = useVbenModal({
  onCancel() {
    modalApiA.close();
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
