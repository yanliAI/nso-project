<template>
  <div class="w-full h-full pt-2">
    <el-form label-width="auto" ref="ruleFormRef" :model="formData" :rules="formRules" :disabled="disabled" :inline="true" label-position="right" class="demo-form-inline">
      <el-row>
        <el-col :span="8">
          <el-form-item label="系统名称:" prop="faultSys">
            <el-select v-model="formData.faultSys" @change="sysChange" filterable>
              <el-option v-for="item in dropList.NSOS_SYSTEM_INFO" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="系统等级:" prop="sysLevel">
            <el-input v-model="formData.sysLevel" clearable disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="运维单位:" prop="operateOrg">
            <el-input v-model="formData.operateOrg" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="系统设备主人:" prop="deviceOwnerName">
            <el-input v-model="formData.deviceOwnerName" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系方式:" prop="deviceMasterPhone">
            <el-input v-model="formData.deviceMasterPhone" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="故障发生时间:" prop="faultOccurTime">
            <el-date-picker v-model="formData.faultOccurTime" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="故障类别:" prop="faultType" filterable>
            <el-select v-model="formData.faultType">
              <el-option v-for="item in dropList.NSOS_FAULT_TYPE" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="运维模式:" prop="operateSchema">
            <el-select v-model="formData.operateSchema" filterable>
              <el-option v-for="item in dropList.NSOS_OPERATE_SCHEMA" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="问题来源:" prop="problemSource">
            <el-select v-model="formData.problemSource" filterable>
              <el-option v-for="item in dropList.NSOS_PROBLEM_SOURCE" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否影响业务:" prop="isYxyw">
            <el-select v-model="formData.isYxyw" filterable>
              <el-option v-for="item in dropList.NSOS_YES_OR_NO" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="故障定位时间:" prop="faultDwTime">
            <el-date-picker v-model="formData.faultDwTime" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row>
        <el-col :span="24">
          <el-form-item label="故障现象:" prop="operateSchema" filterable>
            <el-input v-model="formData.operateSchema" :rows="2" maxlength="300" show-word-limit type="textarea" placeholder="请输入故障现象" clearable/>
          </el-form-item>
        </el-col>
      </el-row> -->
      <el-row>
        <el-col :span="24">
          <el-form-item label="故障名称:" prop="faultInfo">
            <el-input v-model="formData.faultInfo" :rows="2" maxlength="300" show-word-limit type="textarea" placeholder="请输入故障名称" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="影响范围及程度:" prop="effectRange">
            <el-input v-model="formData.effectRange" :rows="2" maxlength="1000" show-word-limit type="textarea" placeholder="请输入影响范围及程度" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="填报调度员:" prop="fillDispatcherName">
            <!-- <el-select v-model="formData.fillDispatcher" disabled>
              <el-option v-for="item in dropList.NSOS_USER_NAME" :key="item.value" :label="item.label" :value="item.value" />
            </el-select> -->
            <el-input v-model="formData.fillDispatcherName" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="填报时间:">
            <el-date-picker v-model="formData.fillTime" type="datetime" disabled clearable />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { ElForm, ElFormItem, ElRow, ElCol } from 'element-plus'
import { useDropStore } from '#/store'
import { requestClient } from '#/api/request'
import { ElMessage } from 'element-plus'
import { getSystemInfo } from './faultDetailMethod.ts'

const dropList = reactive({})

const formData = defineModel('formData')
const disabled = defineModel('disabled')
const ruleFormRef = ref()
const data = reactive({
  rules: []
})
const formRules = reactive({
  faultSys: [{ required: true, message: '请选择系统名称', trigger: 'change' }],
  // sysLevel: [{ required: true, message: '请选择系统等级', trigger: 'change' }],
  operateOrg: [
    { required: true, message: '请输入运维单位', trigger: 'blur' },
    { min: 0, max: 100, message: '内容长度最大不能超过100', trigger: 'blur' }
  ],
  deviceOwnerName: [
    { required: true, message: '请输入系统设备主人', trigger: 'blur' },
    { min: 0, max: 100, message: '内容长度最大不能超过100', trigger: 'blur' }
  ],
  operateSchema: [{ min: 0, max: 100, message: '内容长度最大不能超过100', trigger: 'blur' }],
  faultOccurTime: [{ required: true, message: '请选择故障发生时间', trigger: 'blur' }],
  deviceMasterPhone: [{ pattern: /^1[3456789]\d{9}$/, message: '请输入有效的电话号码', trigger: 'blur' }],
  faultInfo: [
    { required: true, message: '请输入故障名称', trigger: 'blur' },
    { min: 0, max: 300, message: '内容长度最大不能超过300', trigger: 'blur' }
  ],
  effectRange: [
    { required: true, message: '请输入影响范围及程度', trigger: 'blur' },
    { min: 0, max: 1000, message: '内容长度最大不能超过1000', trigger: 'blur' }
  ],
  problemSource: [{ required: true, message: '请选择故障类别', trigger: 'change' }],
  faultType: [{ required: true, message: '请选择故障类别', trigger: 'change' }],
  fillDispatcher: [{ required: true, message: '请输入填报调度员', trigger: 'blur' }],
  fillTime: [{ required: true, message: '请选择填报时间', trigger: 'blur' }]
})
onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = ['NSOS_SYS_LEVEL', 'NSOS_OPERATE_SCHEMA', 'NSOS_FAULT_TYPE', 'NSOS_OPERATE_ORG', 'NSOS_SYSTEM_INFO', 'NSOS_PROBLEM_SOURCE', 'NSOS_YES_OR_NO']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)
})
watch(formData, async (newval) => {
  if (newval) {
    await ruleFormRef.value.clearValidate()
  }
})
const validateForm = async (callback) => {
  await ruleFormRef.value.validate(callback)
}

// 保存
const saveData = async () => {
  await ruleFormRef.value.validate((valid) => {
    if (valid) {
      saveGzxx()
    }
  })
}
const saveGzxx = async () => {
  try {
    await requestClient.post(import.meta.env.VITE_NSOSGZ + '/info/save', formData.value)
    ElMessage.success('故障信息保存成功！')
  } catch {
    ElMessage.error('故障信息保存失败！')
  }
}
const sysChange = async (val) => {
  if (val) {
    const {SYS_GRADE, ACCOUNT_CODE, ACCOUNT_NAME, BELONG_CODE, BELONG_NAME, NETWORKAREA} = await getSystemInfo({cmdbId: val})
    formData.value.sysLevel = SYS_GRADE
    formData.value.deviceOwnerName = ACCOUNT_NAME
    formData.value.deviceOwner = ACCOUNT_CODE
    formData.value.operateOrg = BELONG_NAME
    formData.value.deviceMasterPhone = NETWORKAREA
  }
}
defineExpose({
  validateForm,
  saveData
})
</script>
<style scoped>
.demo-form-inline .el-input {
  --el-input-width: 100%;
}

.demo-form-inline .el-select {
  --el-select-width: 100%;
}

:deep(.el-date-editor.el-input, .el-date-editor.el-input__wrapper) {
  width: 100%;
}

:deep(.el-form--inline .el-form-item) {
  width: 100% !important;
  margin-right: 0 !important;
  margin-bottom: 15px !important;
}
</style>
