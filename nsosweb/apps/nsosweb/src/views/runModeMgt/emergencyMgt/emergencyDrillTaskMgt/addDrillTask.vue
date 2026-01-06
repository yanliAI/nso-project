<template>
  <el-form
    ref="addForm"
    label-width="auto"
    :model="addFormData"
    :rules="addFormRules"
    label-position="right"
    style="padding: 16px 20px 0"
  >
    <el-row :gutter="50">
      <el-col :span="8">
        <el-form-item label="演练名称：" prop="drillName">
          <el-input
            v-model="addFormData.drillName"
            placeholder="请输入演练名称"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="演练系统：" prop="sysName">
          <el-select
            v-model="addFormData.sysName"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option
              v-for="(item, index) in systemList"
              :key="index"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="演练形式" prop="drillForm">
          <el-select
            v-model="addFormData.drillForm"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option label="实战演练" value="1"></el-option>
            <el-option label="线上演练" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="50">
      <el-col :span="8">
        <el-form-item label="风险类型：" prop="riskType">
          <el-select
            v-model="addFormData.riskType"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option label="网络安全" value="1"></el-option>
            <el-option label="数据安全" value="2"></el-option>
            <el-option label="运行安全" value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="演练目的：" prop="drillPurpose">
          <el-input v-model="addFormData.drillPurpose" placeholder="请输入" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="演练内容：" prop="drillContent">
          <el-input v-model="addFormData.drillContent" placeholder="请输入" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="50">
      <el-col :span="8">
        <el-form-item label="应急卡片：" prop="emergencyCard">
          <el-select
            v-model="addFormData.emergencyCard"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option
              v-for="(item, index) in emergencyCardList"
              :key="index"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="应急演练时间：" prop="drillTime">
          <el-date-picker
            v-model="addFormData.drillTime"
            type="date"
            placeholder="请选择"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="演练范围：" prop="drillRange">
          <el-input v-model="addFormData.drillRange" placeholder="请输入" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="附件：">
      <el-upload
        ref="uploadRef"
        :file-list="files"
        action="#"
        :auto-upload="false"
        :on-change="handleFileChange"
        :on-remove="handleRemove"
        :before-upload="beforeUpload"
        :http-request="uploadFile"
        style="width: 50%"
      >
        <template #trigger>
          <el-button type="primary" link>
            <el-icon> <Plus /> </el-icon>附件
          </el-button>
        </template>
      </el-upload>
    </el-form-item>

    <el-form-item>
      <el-col :span="24" style="text-align: center; margin-top: 50px">
        <el-button type="primary" :icon="Monitor">发布</el-button>
        <el-button type="primary" :icon="DocumentChecked">保存</el-button>
        <el-button type="info" :icon="RefreshLeft" @click="resetForm"
          >重置</el-button
        >
        <el-button type="info" :icon="Close" @click="closeTab">关闭</el-button>
      </el-col>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import {
  ElFormItem,
  ElForm,
  ElInput,
  ElButton,
  ElSelect,
  ElOption,
  ElRow,
  ElCol,
  ElDialog,
  ElMessage,
  ElMessageBox,
} from 'element-plus';
import {
  Plus,
  Monitor,
  DocumentChecked,
  Close,
  RefreshLeft,
} from '@element-plus/icons-vue';
import type {
  UploadInstance,
  UploadProps,
  UploadRawFile,
  UploadUserFile,
} from 'element-plus';

import { ref, reactive, computed, onMounted } from 'vue';
import { requestClient } from '#/api/request';

defineOptions({
  name: 'AddDrillTask',
});

const tabName = defineModel('tabName');
const emit = defineEmits(['removeTab']);

const addForm = ref();
const uploadRef = ref<UploadInstance>();
// 附件列表
const files = ref<UploadUserFile[]>([]);
// 新增预案表单数据
const addFormData = reactive({
  drillName: '',
  sysName: '',
  drillForm: '',
  riskType: '',
  drillPurpose: '',
  drillContent: '',
  emergencyCard: '',
  drillTime: '',
  drillRange: '',
});

const addFormRules = reactive({
  drillName: [{ required: true, message: '请输入演练名称' }],
  sysName: [{ required: true, message: '请选择演练系统' }],
  drillForm: [{ required: true, message: '请选择演练形式' }],
  riskType: [{ required: true, message: '请选择风险类型' }],
  emergencyCard: [{ required: true, message: '请选择应急卡片' }],
  drillTime: [{ required: true, message: '请选择应急演练时间' }],
});

// 存储所有系统的列表
const systemList = ref([
  {
    name: '电网管理平台一',
    id: 1,
    value: '1',
  },
  {
    name: '电网管理平台二',
    id: 2,
    value: '2',
  },
  {
    name: '电网管理平台三',
    id: 3,
    value: '3',
  },
]);
// 存储应急卡片列表
const emergencyCardList = ref([
  {
    name: '专项',
    id: 1,
    value: '1',
  },
  {
    name: '综合',
    id: 2,
    value: '2',
  },
  {
    name: '应急',
    id: 3,
    value: '3',
  },
]);

// 重置表单
const resetForm = () => {
  addForm.value?.resetFields();
};

const handleFileChange = (uploadFile, uploadFiles) => {
  console.log('uploadFile==', uploadFile);
  console.log('uploadFiles==', uploadFiles);
  files.value = uploadFiles;
  console.log('files==', files.value.length);
};

// 文件上传之前判断
const beforeUpload: UploadProps['beforeUpload'] = (file: UploadRawFile) => {
  console.log('beforeUpload file=', file);
  const isLimit = file.size < 10 * 1024 * 1024;
  if (!isLimit) {
    ElMessage.error(`上传文件大小不能超过10MB!`);
    return false;
  }
};

// 删除上传文件
const handleRemove = (file) => {
  console.log('onRemoveFil==', file);
  const index = files.value.map((f) => f.name).indexOf(file.name);
  if (index > -1) {
    files.value.splice(index, 1);
  }
  console.log('files==', files.value);
};

// 上传文件
const uploadFile = async (options) => {};

// 关闭标签页
const closeTab = () => {
  ElMessageBox.confirm('确认关闭新增任务页吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    emit('removeTab', tabName.value);
  });
};
</script>

<style lang="less" scoped></style>
