<template>
  <div>
    <el-button @click="openDialog('12345', '1', '1')">打开弹窗</el-button>
    <NotificationDialog
      :ticketNumber="ticketNumber"
      :reportType="reportType"
      :notificationType="notificationType"
      :visible="dialogVisible"
      @update:visible="dialogVisible = $event"
    />

    <el-button @click="openDialogTwo('12345', '1', '1','2')">打开弹窗</el-button>
    <FaultReformNotifyRecordDialog
      :faultCode="faultCode"
      :measureCode="measureCode"
      :measureContent="measureContent"
      :recordType="recordType"
      :visible="dialogVisibleTwo"
      @update:visible="dialogVisibleTwo = $event"
    />



  </div>



</template>

<script>
import { ref } from 'vue';
import NotificationDialog from './NotificationDialog.vue';
import FaultReformNotifyRecordDialog from './FaultReformNotifyRecordDialog.vue';
import { useVbenModal } from '@vben/common-ui';

export default {
  components: {
    NotificationDialog,
    FaultReformNotifyRecordDialog,
  },
  setup() {
    const ticketNumber = ref('');
    const reportType = ref('');
    const notificationType = ref('');
    const dialogVisible = ref(false);

    const faultCode = ref('');
    const measureCode = ref('');
    const measureContent = ref('');
    const recordType = ref('');
    const dialogVisibleTwo = ref(false);

    const openDialog = (tn, rt, nt) => {
      ticketNumber.value = tn;
      reportType.value = rt;
      notificationType.value = nt;
      dialogVisible.value = true;
    };

    const openDialogTwo = (tn, rt, nt,st) => {
      faultCode.value = tn;
      measureCode.value = rt;
      measureContent.value = nt
      recordType.value = st;
      dialogVisibleTwo.value = true;
    };

    return {
      ticketNumber,
      reportType,
      notificationType,
      dialogVisible,
      openDialog,
      faultCode,
      measureCode,
      measureContent,
      recordType,
      dialogVisibleTwo,
      openDialogTwo,
    };
  },
};
</script>

<style>
/* 添加一些基本样式 */
</style>
