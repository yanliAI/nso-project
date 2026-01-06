<template>
  <div class="w-full h-full pt-2">
    <el-form label-width="auto" ref="ruleFormRef" :model="formData" :rules="formRules" :inline="true" label-position="right" class="demo-form-inline">
      <el-row>
        <el-col :span="10">
          <el-form-item label="确认人:" prop="qrr">
            <el-input v-model="formData.qrr" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="4">
        </el-col>
        <el-col :span="10">
          <el-form-item label="确认时间:" prop="qrsj">
            <el-date-picker v-model="formData.qrsj" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="审核意见:" prop="shyj">
            <el-input v-model="formData.shyj" :rows="2" maxlength="256" show-word-limit type="textarea" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { ElForm, ElFormItem, ElRow, ElCol } from 'element-plus';
import type { FormInstance } from 'element-plus'

const dropList: any = reactive({});

const formData: any = defineModel('formData')
const ruleFormRef: any = ref<FormInstance>()
onMounted(async () => {
});
const validateForm = async (callback) => {
  await ruleFormRef.value.validate(callback)
}
defineExpose({
  validateForm
});
</script>
<style scoped>
.demo-form-inline .el-input {
  --el-input-width: 100%;
}

:deep(.el-date-editor.el-input, .el-date-editor.el-input__wrapper){
  width: 100%;
}

:deep(.el-form--inline .el-form-item){
  width: calc(100% - 20px);
  margin-right: 20px;
}
</style>
