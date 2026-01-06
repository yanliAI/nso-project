<template>
  <div class="w-full h-full pt-2">
    <el-form label-width="auto" ref="ruleFormRef" :model="formData" :rules="formRules" :inline="true" :disabled="disabled" label-position="right" class="demo-form-inline">
      <el-row>
        <el-col :span="8">
          <el-form-item label="记录人:" prop="recorderId">
            <!-- <el-select v-model="formData.recorderId" disabled>
              <el-option v-for="item in dropList.NSOS_USER_NAME" :key="item.value" :label="item.label" :value="item.value" />
            </el-select> -->
            <el-input v-model="formData.recorderId" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="记录时间:" prop="recordingTime">
            <el-date-picker v-model="formData.recordingTime" type="datetime" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="IP地址:" prop="ip">
            <el-input v-model="formData.ip" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="单位:" prop="unitId">
            <!-- <el-select v-model="formData.unitName" filterable clearable>
              <el-option v-for="item in dropList.NSOS_ORG_NAME" :key="item.value" :label="item.label" :value="item.value" />
            </el-select> -->
            <OrgTreeSelect v-model="formData.unitId" @updateName="(v) => (formData.unitName = v)" filterable></OrgTreeSelect>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="系统名称:" prop="systemName">
            <el-select v-model="formData.systemName" filterable>
              <el-option v-for="item in dropList.NSOS_SYSTEM_INFO" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="异常类型:" prop="defectType">
            <el-select v-model="formData.defectType" filterable @change="changeDefectType">
              <el-option v-for="item in dropList.NSOS_DEFECT_TYPE" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="紧急程度:" prop="emergencyLevel">
            <el-select v-model="formData.emergencyLevel">
              <el-option v-for="item in dropList.NSOS_EMERGENCY_LEVEL" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="反馈时限:" prop="deadLine">
            <!-- <el-input v-model="formData.deadLine"  clearable/> -->
            <el-date-picker v-model="formData.deadLine" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="缺陷处置策略:" prop="disposalStrategy" filterable>
            <el-input v-model="formData.disposalStrategy" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="异常运行描述:" prop="abnormalDescription">
            <el-input v-model="formData.abnormalDescription" :rows="2" maxlength="256" show-word-limit type="textarea" placeholder="请输入故障信息" clearable />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { ElForm, ElFormItem, ElRow, ElCol } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { useDropStore } from '#/store'
import { useAccessStore, useUserStore } from '@vben/stores'
import OrgTreeSelect from '#/views/basic/common/orgTreeSelect.vue'
import { requestClient } from '#/api/request';

const userStore = useUserStore()

const dropList: any = reactive({})

const formData = defineModel('formData')
const disabled = defineModel('disabled')
const ruleFormRef: any = ref<FormInstance>()
const formRules = reactive({
  unitId: [{ required: true, message: '请选择单位', trigger: 'blur' }],
  defectType: [{ required: true, message: '请选择异常类型', trigger: 'blur' }],
  systemName: [{ required: true, message: '请选择系统', trigger: 'blur' }]
})
onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = ['NSOS_DEFECT_TYPE', 'NSOS_EMERGENCY_LEVEL', 'NSOS_FAULT_TYPE', 'NSOS_OPERATE_ORG', 'NSOS_SYSTEM_INFO', 'NSOS_ORG_NAME', 'NSOS_USER_NAME']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)
})

const validateForm = async (callback) => {
  await ruleFormRef.value.validate(callback)
}

const changeDefectType = async () => {
  let params = { params: { id: formData.value.defectType } }
  formData.value.disposalStrategy = await (requestClient.get(import.meta.env.VITE_NSOSZH + '/defectTypeManage/query', params))
}

defineExpose({
  validateForm
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
  width: calc(100% - 20px);
  margin-right: 20px;
}
</style>
