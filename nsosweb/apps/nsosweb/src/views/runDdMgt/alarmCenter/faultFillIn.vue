<template>
  <div class="w-full h-full pt-2">
    <el-form label-width="auto" ref="ruleFormRef" :model="formData" :rules="formRules" :disabled="disabled" :inline="true" label-position="right" class="demo-form-inline">
      <el-row>
        <el-col :span="8">
          <el-form-item label="系统名称:" prop="faultSys">
            <el-select v-model="formData.faultSys" filterable>
              <el-option v-for="item in dropList.NSOS_SYSTEM_INFO" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="系统等级:" prop="sysLevel" filterable>
            <el-select v-model="formData.sysLevel">
              <el-option v-for="item in dropList.NSOS_SYS_LEVEL" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="运维单位:" prop="operateOrg" filterable>
            <el-select v-model="formData.operateOrg">
              <el-option v-for="item in dropList.NSOS_OPERATE_ORG" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="系统设备主人:" prop="deviceOwner">
            <el-input v-model="formData.deviceOwner" clearable />
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
          <el-form-item label="故障类别:" prop="faultType" filterable>
            <el-select v-model="formData.faultType">
              <el-option v-for="item in dropList.NSOS_FAULT_TYPE" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="填报调度员:" prop="fillDispatcher">
            <el-select v-model="formData.fillDispatcher" disabled>
              <el-option v-for="item in dropList.NSOS_USER_NAME" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="填报时间:" prop="fillTime">
            <el-date-picker v-model="formData.fillTime" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" disabled clearable />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div style=" justify-content: center;height: 35px" class="flex mb-[15px] mt-[10px]">
        <el-button type="primary" :icon="Tickets" @click="saveData">保存</el-button>
        <el-button :icon="Close" @click="attachClose">取消</el-button>
    </div>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { ElForm, ElFormItem, ElRow, ElCol } from 'element-plus'
import { tDateFormat, formatDateTime, formatDrop, lookFlow } from '#/utils/commonUtil.ts';
import { useDropStore } from '#/store'
import { requestClient } from '#/api/request'
import { ElMessage } from 'element-plus'
import { useAccessStore, useUserStore } from '@vben/stores';
import { add2 } from './alarmCenterMethod.ts';
import { Tickets, Close } from '@element-plus/icons-vue'

const userStore = useUserStore();

const dropList = reactive({})

const formData = ref({})
const disabled = defineModel('disabled')
const rowData = defineModel('rowData')
const emit = defineEmits(['closeDiaLog','query','cmdSave'])
const ruleFormRef = ref()
const data = reactive({
  rules: []
})
const formRules = reactive({
  faultSys: [{ required: true, message: '请选择系统名称', trigger: 'change' }],
  sysLevel: [{ required: true, message: '请选择系统等级', trigger: 'change' }],
  operateOrg: [{ required: true, message: '请选择运维单位', trigger: 'change' }],
  deviceOwner: [
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
  faultType: [{ required: true, message: '请选择故障类别', trigger: 'change' }],
  fillDispatcher: [{ required: true, message: '请输入填报调度员', trigger: 'blur' }],
  fillTime: [{ required: true, message: '请选择填报时间', trigger: 'blur' }]
})
onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = ['NSOS_SYS_LEVEL', 'NSOS_OPERATE_SCHEMA', 'NSOS_FAULT_TYPE', 'NSOS_OPERATE_ORG', 'NSOS_SYSTEM_INFO', 'NSOS_USER_NAME']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)
  formData.value.fillDispatcher = userStore.userInfo?.logincode
  formData.value.fillTime = formatDateTime(new Date())
  formData.value.faultInfo =  rowData.value.alertDesc ? rowData.value.alertDesc : rowData.value.alertName
  formData.value.effectRange = '源IP：' +  rowData.value.attackerIp + '；' + '目的IP：' + rowData.value.victimIp
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
    let data = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/info/save', formData.value)
    emit('cmdSave', data.faultCode);
    ElMessage.success('故障信息保存成功！')
    emit('closeDiaLog');
  } catch {
    ElMessage.error('故障信息保存失败！')
  }
}

const attachClose =() => {
  emit('closeDiaLog');
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
