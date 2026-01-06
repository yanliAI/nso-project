<template>
  <el-dialog title="故障闭环整改催办信息" :model-value="visible" width="80%" :before-close="handleClose" custom-class="custom-dialog">
    <div class="data-display">
      <span class="data-item">
        <span class="label">故障单号：</span>
        <span class="value blue-text">{{ formData.faultCode }}</span>
      </span>
      <span class="data-item">
        <span class="label">通知类型：</span>
        <el-select v-model="formData.recordType" style="width: 150px" disabled>
            <el-option v-for="item in dropList.NSOS_RECORD_TYPE" :key="item.value"  :label="item.label" :value="item.value"/>
        </el-select>
      </span>
    </div>

    <h3 class="label">催办列表</h3>
    <el-table border :data="notificationList" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="faultCode" label="故障单号"></el-table-column>
      <el-table-column prop="measureContent" label="措施内容"></el-table-column>
      <el-table-column prop="notifyMan" label="通知人"></el-table-column>
      <el-table-column prop="notifyTime" label="通知时间" :formatter="formatTimestamp"></el-table-column>
      <el-table-column prop="notifyComtent" label="联系内容"></el-table-column>
      <el-table-column prop="notifyResult" label="通知结果">
        <template #default="scope">
          {{ getnotifyResultLabel(scope.row.notifyResult) }}
        </template>
      </el-table-column>
      <el-table-column prop="notifyTarget" label="联系人"></el-table-column>
      <el-table-column prop="notifyType" label="通知方式">
        <template #default="scope">
          {{ getnotifyTypeLabel(scope.row.notifyType) }}
        </template>
      </el-table-column>
      <el-table-column prop="contact" label="联系方式"></el-table-column>
    </el-table>


    <h3>&nbsp;</h3>
    <h3>&nbsp;</h3>
    <h3>&nbsp;</h3>
    <h3 class="section-title">催办详情</h3>
    <el-form :inline="true" :model="notificationForm" :rules="rules" ref="notificationFormRef" label-width="120px"
      class="notification-form">
      <el-form-item label="联系人" prop="notifyTarget">
        <el-input v-model="notificationForm.notifyTarget"></el-input>
      </el-form-item>
      <el-form-item label="通知方式" prop="notifyType">
        <el-select v-model="notificationForm.notifyType" placeholder="请选择通知方式">
            <el-option v-for="item in dropList.NSOS_NOTIFY_TYPE" :key="item.value"  :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="联系方式" prop="contact">
        <el-input v-model="notificationForm.contact"></el-input>
      </el-form-item>
      <div>
        <el-form-item label="联系内容" prop="notifyComtent" style="width: 80%;">
          <el-input v-model="notificationForm.notifyComtent" type="textarea" :rows="2"></el-input>
        </el-form-item>
      </div>
      <el-form-item label="通知结果" prop="notifyResult">
        <el-select v-model="notificationForm.notifyResult" placeholder="请选择通知结果">
            <el-option v-for="item in dropList.NSOS_NOTIFY_RESULT" :key="item.value"  :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="通知人">
        <el-input v-model="notificationForm.notifyMan" disabled></el-input>
      </el-form-item>
      <el-form-item label="通知时间">
        <el-input v-model="notificationForm.notifyTime" disabled></el-input>
      </el-form-item>
      <div class="button-container">
        <el-form-item >
          <el-button type="primary" @click="handleSend">发送</el-button>
          <el-button @click="handleClose" style="margin-left: 50px;">取消</el-button>
        </el-form-item>
      </div>
    </el-form>

  </el-dialog>
</template>

<script>
import { ref, reactive, onMounted, watch } from 'vue';
import {ElTable,ElTableColumn,ElFormItem,ElForm,ElInput,ElButton,ElSelect,ElPagination,ElContainer,ElHeader,ElMain,ElFooter,ElDialog,ElMessage,ElMessageBox,ElLink, SIZE_INJECTION_KEY} from 'element-plus';
import { requestClient } from '#/api/request';
import { useDropStore } from '#/store';

export default {
  props: {
    faultCode: {
      type: String,
      required: true,
    },
    measureCode: {
      type: String,
      required: true,
    },
    measureContent: {
      type: String,
      required: true,
    },
    recordType: {
      type: String,
      required: true,
    },
    visible: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['update:visible'],
  setup(props, { emit }) {
    const formData = reactive({
      faultCode: props.faultCode,
      measureCode: props.measureCode,
      measureContent: props.measureContent,
      recordType: props.recordType,
    });

    const notificationForm = reactive({
      notifyTarget: '',
      notifyType: '',
      contact: '',
      notifyComtent: '',
      notifyResult: '',
      notifyMan: 'admin', // 假设系统登录人为 'admin'
      notifyTime: new Date().toLocaleString(),
      faultCode: formData.faultCode,
      measureCode: formData.measureCode,
      measureContent:formData.measureContent,
      recordType: formData.recordType,
    });

    const notificationFormRef = ref(null);

    const notificationList = ref([]);

    const dropList = reactive({});

    const rules = {
      notifyTarget: [{ required: true, message: '联系人为必填项', trigger: 'blur' }],
      notifyType: [{ required: true, message: '通知方式为必填项', trigger: 'blur' }],
      contact: [{ required: true, message: '联系方式为必填项', trigger: 'blur' }],
      notifyComtent: [{ required: true, message: '通知内容为必填项', trigger: 'blur' }],
    };

    const getnotifyTypeLabel = (value) => {
      const option = dropList.NSOS_NOTIFY_TYPE.find(option => option.value === value);
      return option ? option.label : '';
    };

    const getnotifyResultLabel = (value) => {
      const option = dropList.NSOS_NOTIFY_RESULT.find(option => option.value === value);
      return option ? option.label : '';
    };

    const gettzlxLabel = (value) => {
      const option = dropList.NSOS_RECORD_TYPE.find(option => option.value === value);
      return option ? option.label : '';
    };

    const getReportTypeLabel = (value) => {
      const option = dropList.NSOS_REPORT_TYPE.find(option => option.value === value);
      return option ? option.label : '';
    };

    const handleSelectionChange = (val) => {
      selectedRows.value = val;
    };

    function formatTimestamp(row, column, cellValue) {
      const date = new Date(cellValue);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    const fetchNotificationList = async () => {
      // 模拟从服务器获取通知列表
      // 这里可以替换为实际的 API 请求
      const response = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/faultReformNotifyRecord/queryDataLists', {
        "faultCode": formData.faultCode,
      });
      notificationList.value = response.list;
    };

    const add = async () => {
      const parm = {
        "notifyTarget": notificationForm.notifyTarget,
        "notifyType": notificationForm.notifyType,
        "contact": notificationForm.contact,
        "notifyComtent": notificationForm.notifyComtent,
        "notifyResult": notificationForm.notifyResult,
        "faultCode": formData.faultCode,
        "measureCode": formData.measureCode,
        "measureContent": formData.measureContent,
        "recordType": formData.recordType,
      }
      const response = await  requestClient.post(import.meta.env.VITE_NSOSGZ + '/faultReformNotifyRecord/add', parm);
      fetchNotificationList();
    }

    const handleSend = async () => {
      notificationFormRef.value.validate((valid) => {
        if (!valid) {
          ElMessage.error('请检查必填项');
          return;
        }

        // 设置通知人和通知时间
        notificationForm.notifyMan = '';
        notificationForm.notifyTime = '';

        // 模拟保存到服务器
        // 这里可以替换为实际的 API 请求
        //const response =   requestClient.post(import.meta.env.VITE_NSOSGZ + '/reportNotifyRecord/add', notificationForm);
        add();
        //notificationList.value.push({ ...notificationForm });

        // 清空表单
        notificationForm.notifyTarget = '';
        notificationForm.notifyType = '';
        notificationForm.contact = '';
        notificationForm.notifyComtent = '';
        notificationForm.notifyResult = '';

        ElMessage.success('发送成功');
      });
    };

    const handleClose = () => {
      emit('update:visible', false);
    };


    watch(
      () => props.visible,
      (newVal) => {
        if (newVal) {
          // 更新 formData
          formData.faultCode = props.faultCode;
          formData.measureCode = props.measureCode;
          formData.measureContent = props.measureContent;
          formData.recordType = props.recordType;
          fetchNotificationList();
        }
      }
    );

    onMounted(async () => {
      const dropStore = useDropStore();
      await dropStore.initDrops(['NSOS_RECORD_TYPE','NSOS_NOTIFY_TYPE','NSOS_NOTIFY_RESULT','NSOS_REPORT_TYPE']);
      dropStore.get(dropList, ['NSOS_RECORD_TYPE','NSOS_NOTIFY_TYPE','NSOS_NOTIFY_RESULT','NSOS_REPORT_TYPE']);
      if (props.visible) {
        formData.faultCode = props.faultCode;
        formData.measureCode = props.measureCode;
        formData.measureContent = props.measureContent;
        formData.recordType = props.recordType;
        fetchNotificationList();
      }
    });

    return {
      formData,
      notificationForm,
      notificationFormRef,
      notificationList,
      rules,
      getnotifyTypeLabel,
      getnotifyResultLabel,
      handleSend,
      handleClose,
      handleSelectionChange,
      formatTimestamp,
      add,
      dropList,
      gettzlxLabel,
      getReportTypeLabel,
    };
  },
};
</script>

<style scoped>
.custom-dialog .el-dialog__header {
  background-color: #409EFF; /* 蓝色背景 */
  color: white; /* 白色文字 */
  padding: 10px 20px; /* 保留必要的 padding */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.custom-dialog .el-dialog__title {
  font-size: 16px;
  font-weight: bold;
  margin: 0; /* 移除默认的 margin */
}

.custom-dialog .el-dialog__headerbtn {
  top: 10px; /* 调整关闭按钮的顶部位置 */
  right: 10px; /* 调整关闭按钮的右边距 */
}

.custom-dialog .el-dialog__headerbtn .el-dialog__close {
  color: white; /* 关闭按钮颜色为白色 */
}

.data-display {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.data-item {
  display: flex;
  align-items: center;
  margin-right: 80px; /* 调整间隔 */
}

.data-item:last-child {
  margin-right: 0; /* 最后一个项不需要右边距 */
}

.label {
  font-weight: bold;
  margin-right: 5px;
}

.blue-text {
  color: #409EFF; /* 蓝色字体 */
}

.el-select {
  width: 180px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  border-bottom: 2px solid #409EFF; /* 蓝色下划线 */
  padding-bottom: 5px;
  margin-bottom: 20px;
}

.notification-form {
  margin: 0 auto; /* 使表单居中 */
  max-width: 80%; /* 设置最大宽度 */
}

.el-form-item {
  margin-bottom: 15px;
}

.el-form-item__label {
  color: #333; /* 标签颜色 */
}

.el-form-item__content {
  display: flex;
  align-items: center;
}

.button-container {
  display: flex;
  justify-content: center;
}
</style>
