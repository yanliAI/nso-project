<template>
  <div style="padding: 0px 20px 0">
    <el-form
      ref="formRef"
      :inline="true"
      :model="formData"
      :rules="rules"
      label-position="right"
      label-width="auto"
      :disabled="disabledValue"
    >
      <el-row :gutter="80">
        <el-col :span="12">
          <el-form-item label="情报名称" prop="intelligenceName">
            <el-input
              v-model="formData.intelligenceName"
              clearable
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="情报来源：" prop="source">
            <el-input v-model="formData.source" clearable style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="80">
        <el-col :span="12">
          <el-form-item label="情报来源时间：" prop="discoveryDate">
            <el-date-picker
              v-model="formData.discoveryDate"
              type="date"
              placeholder="请选择"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD HH:mm:ss"
              style="width: 100%"
              :disabled-date="disabledDate"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="处置情况：" prop="handlingStatus">
            <el-select
              v-model="formData.handlingStatus"
              clearable
              style="width: 100%"
              disabled
            >
              <el-option label="已下令" value="2"></el-option>
              <el-option label="已处置" value="1"></el-option>
              <el-option label="未处置" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="80">
        <el-col :span="12">
          <el-form-item label="威胁等级：" prop="threatRiskLevel">
            <el-select
              v-model="formData.threatRiskLevel"
              clearable
              style="width: 100%"
            >
              <el-option label="高危" value="高危"></el-option>
              <el-option label="中危" value="中危"></el-option>
              <el-option label="低危" value="低危"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="威胁类型：" prop="threatType">
            <el-input
              v-model="formData.threatType"
              clearable
              style="width: 100%"
            />
            <!-- <el-select
              v-model="formData.threatType"
              clearable
              style="width: 100%"
            >
              <el-option label="类型一" value="1"></el-option>
              <el-option label="类型二" value="2"></el-option>
            </el-select> -->
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="情报内容：" prop="intelligenceContent">
        <el-input
          v-model="formData.intelligenceContent"
          clearable
          :rows="4"
          type="textarea"
          style="width: 100%"
        />
      </el-form-item>
    </el-form>
    <div class="flex" style="justify-content: flex-end">
      <el-button @click="emit('closeDialog')">{{
        disabledValue ? '关闭' : '取消'
      }}</el-button>
      <el-button type="primary" @click="validateForm" v-if="!disabledValue"
        >保存</el-button
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  ElRow,
  ElCol,
  ElFormItem,
  ElForm,
  ElInput,
  ElSelect,
  ElOption,
  ElDialog,
  ElMessage,
  ElMessageBox,
  ElText,
  ElLink,
  ElTag,
} from 'element-plus';
import {
  Search,
  Download,
  Monitor,
  CircleCheck,
} from '@element-plus/icons-vue';
import { ref, reactive, computed, onMounted } from 'vue';
import {
  getThreatIntelligenceDetailApi,
  saveThreatIntelligenceDataApi,
} from '#/api';

defineOptions({
  name: 'ThreatDetail',
});
const detailId = defineModel('detailId');
const disabledValue = defineModel('disabled');
const emit = defineEmits(['closeDialog']);
const formRef = ref();
const formData = ref({});

const validateForm = async () => {
  if (!formRef.value) return false;
  formRef.value.validate(async (valid, fields) => {
    if (valid) {
      try {
        let params = { ...formData.value };
        if (detailId.value) {
          params.id = detailId.value;
        }
        let result = await saveThreatIntelligenceDataApi(params);
        if (result) {
          ElMessage.success('保存成功');
          emit('closeDialog', { refresh: true });
        }
      } catch {}
    } else {
      console.log('fields==', fields);
      ElMessage.warning('请输入必填项！');
    }
  });
};

const getDetailInfo = async () => {
  if (!detailId.value) {
    return;
  }
  try {
    formData.value = await getThreatIntelligenceDetailApi(detailId.value);
  } catch {}
};
const disabledDate = (time) => {
  return time.getTime() > Date.now();
};

const rules = reactive({
  intelligenceName: [{ required: true, message: '请输入情报名称' }],
  // source: [{ required: true, message: '请输入情报来源' }],
});
defineExpose({
  formData,
  validateForm,
});
onMounted(() => {
  getDetailInfo();
});
</script>

<style scoped>
::v-deep .el-form-item {
  width: 100%;
}
</style>
