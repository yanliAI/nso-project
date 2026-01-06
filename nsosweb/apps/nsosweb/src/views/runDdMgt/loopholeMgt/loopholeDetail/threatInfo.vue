<template>
  <div class="w-full h-full pt-2">
    <el-form label-width="auto" ref="ruleFormRef" :model="formData" :rules="formRules" :inline="true" label-position="right" class="demo-form-inline">
      <el-row>
        <el-col :span="8">
          <el-form-item label="终端ip地址:" prop="ipAddress">
            <el-input v-model="formData.ipAddress" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="终端MAC地址:" prop="macAddress" filterable>
            <el-input v-model="formData.macAddress" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="所属单位:" prop="deptName">
            <el-input v-model="formData.deptName" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="威胁名称:" prop="infoName">
            <el-input v-model="formData.infoName" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发现人:" prop="discoverMan">
            <el-input v-model="formData.discoverMan" disabled clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发现时间:" prop="discoverTime">
            <el-date-picker v-model="formData.discoverTime" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" disabled clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="补充信息:" prop="infoDescribe">
            <el-input v-model="formData.infoDescribe" :rows="2" maxlength="256" show-word-limit type="textarea" clearable/>
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
import { useDropStore } from '#/store';

const dropList: any = reactive({});

const formData: any = defineModel('formData')
const ruleFormRef: any = ref<FormInstance>()
const formRules = reactive({
  ipAddress: [
    { required: true, message: '请输入终端ip地址', trigger: 'blur' },
  ],
  macAddress: [
    { required: true, message: '请输入终端MAC地址', trigger: 'blur' },
  ],
  deptName: [
    { required: true, message: '请输入所属单位', trigger: 'blur' },
  ],
  infoName: [
    { required: true, message: '请输入威胁名称', trigger: 'blur' },
  ],
})
onMounted(async () => {
  const dropStore = useDropStore();
  const dropType = ['NSOS_SYS_NAME', 'NSOS_OPERATE_ORG', 'NSOS_LOOPHOLE_LEVEL']
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);
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

.demo-form-inline .el-select {
  --el-select-width: 100%;
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
