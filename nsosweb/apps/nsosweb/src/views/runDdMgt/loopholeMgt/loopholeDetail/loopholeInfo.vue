<template>
  <div class="w-full h-full pt-2">
    <el-form label-width="auto" ref="ruleFormRef" :model="formData" :rules="formRules" :inline="true" label-position="right" class="demo-form-inline">
      <el-row>
        <el-col :span="8">
          <el-form-item label="系统名称:" prop="systemName">
            <!-- <el-select v-model="formData.systemName" filterable>
              <el-option v-for="item in dropList.NSOS_SYS_NAME" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select> -->
            <el-input v-model="formData.systemName" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="所属单位:" prop="deptName" filterable>
            <!-- <el-select v-model="formData.deptName">
              <el-option v-for="item in dropList.NSOS_OPERATE_ORG" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select> -->
            <el-input v-model="formData.deptName" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="系统设备主人:" prop="deviceOwnerName">
            <el-input v-model="formData.deviceOwnerName" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="漏洞名称:" prop="infoName">
            <el-input v-model="formData.infoName" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="漏洞级别:" prop="loopholeLevel" filterable>
            <el-select v-model="formData.loopholeLevel">
              <el-option v-for="item in dropList.NSOS_LOOPHOLE_LEVEL" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="整改截止时间:" prop="correcteTime">
            <el-date-picker v-model="formData.correcteTime" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="漏洞补充信息:" prop="infoDescribe">
            <el-input v-model="formData.infoDescribe" :rows="2" maxlength="256" show-word-limit type="textarea" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="填报人:" prop="discoverMan">
            <el-input v-model="formData.discoverMan" disabled clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="填报时间:" prop="discoverTime">
            <el-date-picker v-model="formData.discoverTime" type="datetime" disabled clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <span class="primary" style="padding-left: 10%">+附件</span>
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
  infoName: [
    { required: true, message: '请输入漏洞名称', trigger: 'blur' },
  ],
  loopholeLevel: [
    { required: true, message: '请选择漏洞级别', trigger: 'change' },
  ],
  correcteTime: [
    { required: true, message: '请选择整改时间', trigger: 'blur' },
  ],
  infoDescribe: [
    { required: true, message: '请输入漏洞补充信息', trigger: 'blur' },
    { min: 0, max: 256, message: '内容长度最大不能超过256', trigger: 'blur' },
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
