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
        <el-form-item label="系统名称：" prop="sysName">
          <el-select
            v-model="addFormData.sysName"
            placeholder="请选择系统名称"
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
        <el-form-item label="应急预案名称：" prop="planName">
          <el-input
            v-model="addFormData.planName"
            placeholder="请输入应急预案名称"
          />
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="应急预案版本号：" prop="versionName">
          <el-input
            v-model="addFormData.versionName"
            placeholder="请输入应急预案版本号"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="50">
      <el-col :span="8">
        <el-form-item label="预案类型：" prop="planType">
          <el-select
            v-model="addFormData.planType"
            placeholder="请选择预案类型"
            clearable
            filterable
          >
            <el-option
              v-for="(item, index) in planTypeList"
              :key="index"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="颁布日期：" prop="enactmentDate">
          <el-date-picker
            v-model="addFormData.enactmentDate"
            type="date"
            placeholder="请选择颁布日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="修订日期：" prop="updateDate">
          <el-date-picker
            v-model="addFormData.updateDate"
            type="date"
            placeholder="请选择修订日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="50">
      <el-col :span="8">
        <el-form-item label="设备主人：" prop="deviceOwner">
          <el-select
            v-model="addFormData.deviceOwner"
            placeholder="请选择设备主人"
            clearable
            filterable
          >
            <el-option
              v-for="(item, index) in deviceOwnerList"
              :key="index"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="16">
        <el-form-item label="补充信息：" prop="remark">
          <el-input v-model="addFormData.remark" placeholder="请输入补充信息" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item>
      <el-col :span="24" style="text-align: center; margin-top: 50px">
        <el-button type="primary" :icon="Monitor" @click="submission"
          >发布</el-button
        >
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
  Monitor,
  DocumentChecked,
  Close,
  RefreshLeft,
} from '@element-plus/icons-vue';
import { ref, reactive, computed, onMounted } from 'vue';
import { requestClient } from '#/api/request';

defineOptions({
  name: 'AddPlan',
});

const tabName = defineModel('tabName');
const emit = defineEmits(['removeTab']);

const addForm = ref();
// 新增预案表单数据
const addFormData = reactive({
  sysName: '',
  planName: '',
  versionName: '',
  planType: '',
  enactmentDate: '',
  updateDate: '',
  deviceOwner: '',
  remark: '',
});

const addFormRules = reactive({
  sysName: [{ required: true, message: '请选择系统名称' }],
  planName: [{ required: true, message: '请输入应急预案名称' }],
  versionName: [{ required: true, message: '请输入应急预案版本号' }],
  planType: [{ required: true, message: '请选择预案类型' }],
  deviceOwner: [{ required: true, message: '请选择设备主人' }],
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
// 存储预案类型列表
const planTypeList = ref([
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

// 存储所有设备主人的列表
const deviceOwnerList = ref([
  {
    name: '张某三',
    id: 1,
    value: '1',
  },
  {
    name: '李某四',
    id: 2,
    value: '2',
  },
  {
    name: '王某五',
    id: 3,
    value: '3',
  },
]);

const submission = async () => {
  await addForm.value?.validate((valid, fields) => {
    if (valid) {
      console.log('submit!');
    } else {
      ElMessage.warning('请输入必填项！');
    }
  });
};

// 重置表单
const resetForm = () => {
  addForm.value?.resetFields();
};

// 关闭标签页
const closeTab = () => {
  ElMessageBox.confirm('确认是否关闭新增预案页?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    emit('removeTab', tabName.value);
  });
};
</script>

<style lang="less" scoped></style>
