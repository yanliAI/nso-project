<template>
  <Page auto-content-height>
  <div style="width: 100%; height: 100%;">
    <el-container class="h-full bg-white">
      <el-header height="40px">
      <el-form label-width="auto" ref="formRef" :model="formData" :rules="formRules" :inline="true"
        label-position="right" class="demo-form-inline">
        <el-row >
          <el-col :span="8">
            <el-form-item label="故障单号:" prop="faultCode">
              <el-input v-model="formData.faultCode" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
              <el-form-item label="通知类型：" prop="reportType" style="margin-bottom: 18px">
                <el-select v-model="formData.recordType" clearable>
                <el-option v-for="item in dropList.NSOS_RECORD_TYPE" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
              </el-form-item>
            </el-col>
      </el-row>
      </el-form>
    </el-header>
    <el-main style="height: calc(100% - 90px);">
      <el-table border :data="notificationList" style="width: 100%" @selection-change="handleSelectionChange" stripe :header-cell-style="{ backgroundColor: '#F2F3F5', color: '#666666', fontSize: '14px', height: '40px', textAlign: 'center' }">
      <el-table-column type="index" fixed label="#" width="50" align="center"></el-table-column>
      <el-table-column prop="faultCode" label="故障单号" width="150" align="center"></el-table-column>
      <el-table-column prop="measureContent" label="措施内容" width="150" align="center"></el-table-column>
      <el-table-column prop="notifyMan" label="通知人" width="100" align="center"></el-table-column>
      <el-table-column prop="notifyTime" label="通知时间" :formatter="tDateTimeFormat" width="180" align="center"></el-table-column>
      <el-table-column prop="notifyComtent" label="联系内容" ></el-table-column>
      <el-table-column prop="notifyResult" label="通知结果" width="100" align="center" column-key="NSOS_NOTIFY_RESULT" :formatter="formatDrop"></el-table-column>
      <el-table-column prop="notifyTarget" label="联系人" width="100" align="center"></el-table-column>
      <el-table-column prop="notifyType" label="通知方式" width="100" align="center" column-key="NSOS_NOTIFY_TYPE" :formatter="formatDrop"></el-table-column>
      <el-table-column prop="contact" label="联系方式" width="100" align="center"></el-table-column>
    </el-table>

    <h3>&nbsp;</h3>
    <h3 class="section-title">催办详情</h3>
    <el-form :inline="true" :model="notificationForm" :rules="rules" ref="notificationFormRef" label-width="120px"
      class="notification-form">
      <el-row >
          <el-col :span="8">
            <el-form-item label="联系人" prop="notifyTarget">
              <el-input v-model="notificationForm.notifyTarget"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="通知方式" prop="notifyType">
               <el-select v-model="notificationForm.notifyType" placeholder="请选择通知方式">
                 <el-option v-for="item in dropList.NSOS_NOTIFY_TYPE" :key="item.value"  :label="item.label" :value="item.value"/>
                </el-select>
             </el-form-item>
          </el-col>
        <el-col :span="8">
          <el-form-item label="联系方式" prop="contact">
        <el-input v-model="notificationForm.contact"></el-input>
      </el-form-item>
        </el-col>
      </el-row>
      <el-row >
          <el-col :span="24">
            <el-form-item label="联系内容" prop="notifyComtent" >
          <el-input v-model="notificationForm.notifyComtent" type="textarea" :rows="2"></el-input>
        </el-form-item>
          </el-col>
      </el-row>
      <el-row >
          <el-col :span="8">
            <el-form-item label="通知结果" prop="notifyResult">
        <el-select v-model="notificationForm.notifyResult" placeholder="请选择通知结果">
            <el-option v-for="item in dropList.NSOS_NOTIFY_RESULT" :key="item.value"  :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="通知人">
        <el-input v-model="notificationForm.notifyMan" disabled></el-input>
      </el-form-item>
          </el-col>
        <el-col :span="8">
          <el-form-item label="通知时间">
        <el-input v-model="notificationForm.notifyTime" disabled></el-input>
      </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    </el-main>
    <el-footer height="50px">
      <div style="width: 100%; height: 15px">

      </div>
      <div style=" justify-content: center;height: 35px" class="flex">
        <el-button type="primary" @click="handleSend">发送</el-button>
        <el-button @click="attachClose">取消</el-button>
      </div>
    </el-footer>
    </el-container>
  </div>
</Page>
</template>
<script setup>
import { onMounted, reactive,ref, watch } from 'vue';
import {ElIcon,ElRow,ElCol,ElTable, ElTableColumn,ElFormItem,ElForm,ElInput,ElButton,ElSelect,ElPagination,ElContainer,ElHeader,ElMain,ElFooter,ElDialog,ElMessage,ElMessageBox,ElLink, SIZE_INJECTION_KEY} from 'element-plus';

import { useDropStore } from '#/store';
import { requestClient } from '#/api/request';

import AttachFile from '../../basic/attach/attachFile.vue'
import AttachList from '../../basic/attach/attachList.vue'
import { Search, Delete, Plus, Download, Upload } from '@element-plus/icons-vue';
import { useVbenModal } from '@vben/common-ui';
import { tDateFormat, tDateTimeFormat, formatDrop, lookFlow } from '#/utils/commonUtil.ts';

const emit = defineEmits(['closeDiaLog','query'])
const dropList = reactive({});

const faultCode = defineModel('faultCode')
const measureCode = defineModel('measureCode')
const measureContent = defineModel('measureContent')
const recordType = defineModel('recordType')
const formData = reactive({
      faultCode: faultCode,
      measureCode: measureCode,
      measureContent: measureContent,
      recordType: recordType,
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

    const rules = {
      notifyTarget: [{ required: true, message: '联系人为必填项', trigger: 'blur' }],
      notifyType: [{ required: true, message: '通知方式为必填项', trigger: 'blur' }],
      contact: [{ required: true, message: '联系方式为必填项', trigger: 'blur' }],
      notifyComtent: [{ required: true, message: '通知内容为必填项', trigger: 'blur' }],
    };

    const handleSelectionChange = (val) => {
      selectedRows.value = val;
    };

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

onMounted(async () => {
  const dropStore = useDropStore();
  const dropType = ['NSOS_REPORT_TYPE','NSOS_RECORD_TYPE','NSOS_NOTIFY_RESULT','NSOS_NOTIFY_TYPE']
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);
  fetchNotificationList();
});

const attachClick = () => {
  modalApi.open()
}

const attachClose =() => {
  emit('closeDiaLog');
}

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
});

const handleSubmit = async () => {
  try {
    // 执行表单验证
    await formRef.value.validate()

    // 验证通过后提交逻辑
    save();
  } catch (error) {
    ElMessage.error('请检查表单填写是否正确')
  }
}

const save = async () => {
  console.log(formData.value);
  try{
    let fd = JSON.parse(JSON.stringify(formData.value))
    console.log(fd)
    fd.slDept = JSON.stringify(fd.slDept)
    console.log(fd)
    const response = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/commandTemplate/add', fd);
  }catch {
    ElMessage.error('保存失败')
  }finally{
    emit('closeDiaLog');
    emit('query');
  }

}
</script>
<style scoped>
.head-d{
  width: 100%;
  height: 55px;
  border-bottom: 1px solid #ebebeb;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  border-bottom: 2px solid #409EFF; /* 蓝色下划线 */
  padding-bottom: 5px;
  margin-bottom: 20px;
}
</style>
