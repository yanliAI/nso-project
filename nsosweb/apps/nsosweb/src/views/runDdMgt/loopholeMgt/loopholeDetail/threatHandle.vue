<template>
  <div class="w-full h-full pt-2">
    <el-form label-width="auto" ref="ruleFormRef" :model="formData" :rules="formRules" :inline="true" label-position="right" class="demo-form-inline">
      <el-row>
        <el-col :span="10">
          <el-form-item label="处理人:" prop="clr">
            <el-input v-model="formData.clr" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="4">
        </el-col>
        <el-col :span="10">
          <el-form-item label="处理时间:" prop="clsj">
            <el-date-picker v-model="formData.clsj" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="处理措施:" prop="clcs">
            <el-input v-model="formData.clcs" :rows="2" maxlength="256" show-word-limit type="textarea" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="处理结果:" prop="cljg">
            <el-input v-model="formData.shyj" :rows="2" maxlength="256" show-word-limit type="textarea" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <span class="primary" style="padding-left: 3%">+附件</span>
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
const formRules = reactive({
  clcs: [
    { required: true, message: '请输入处理措施', trigger: 'blur' },
    { min: 0, max: 256, message: '内容长度最大不能超过256', trigger: 'blur' },
  ],
  cljg: [
    { required: true, message: '请输入处理结果', trigger: 'blur' },
    { min: 0, max: 256, message: '内容长度最大不能超过256', trigger: 'blur' },
  ],
})
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

.primary{
  color: hsl(var(--primary));
}
</style>
