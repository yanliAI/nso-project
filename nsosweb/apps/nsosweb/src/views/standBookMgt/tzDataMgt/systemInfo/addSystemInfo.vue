<template>
  <div class="w-full h-full pt-2">
    <el-form label-width="110px" ref="ruleFormRef" :model="formData" :rules="formRules" :inline="true" label-position="right" class="demo-form-inline">
      <el-row>
        <el-col :span="12">
          <el-form-item label="系统编号:" prop="systemNo">
            <el-input v-model="formData.systemNo" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="系统名称:" prop="systemName">
            <el-input v-model="formData.systemName" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="系统等级:" prop="sysLevel">
            <el-select v-model="formData.sysLevel" filterable>
              <el-option v-for="item in dropList.NSOS_SYS_LEVEL" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="系统用户数:" prop="sysUserNum">
            <el-input-number v-model="formData.sysUserNum" :min="1" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="业务所属单位:" prop="businessUnit">
            <el-input v-model="formData.businessUnit" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="业务所属部门:" prop="businessDept">
            <el-input v-model="formData.businessDept" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="使用单位:" prop="usingUnit">
            <el-input v-model="formData.usingUnit" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="调管层级:" prop="disLevel">
            <el-input v-model="formData.disLevel" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="运维单位:" prop="operateOrg">
            <el-input v-model="formData.operateOrg" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="运维下属单位:" prop="operateSubOrg">
            <el-input v-model="formData.operateSubOrg" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="设备主人:" prop="deviceOwner">
            <el-input v-model="formData.deviceOwner" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="IP地址:" prop="ip">
            <el-input v-model="formData.ip" clearable />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="text-center pt-[10px] pb-[20px]">
      <el-button type="primary" class="ml-4" :icon="Tickets" @click="saveData">保存</el-button>
      <el-button type="info" class="ml-4" :icon="Close" @click="emit('close')">取消</el-button>
    </div>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { ElForm, ElFormItem, ElRow, ElCol, ElMessage, ElNotification } from 'element-plus'
import { useDropStore } from '#/store'
import { requestClient } from '#/api/request'
import { Tickets, Close } from '@element-plus/icons-vue'

const dropList = reactive({})

const formData = ref({
  affUnit: null,
  affSys: null
})
const sysId = defineModel('sysId')
const emit = defineEmits('close')
const ruleFormRef = ref()
const data = reactive({
  rules: []
})

const formRules = reactive({
  systemName: [
    { required: true, message: '请输入系统名称', trigger: 'blur' },
    { min: 0, max: 80, message: '内容长度最大不能超过80', trigger: 'blur' }
  ],
})
onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = ['NSOS_SYS_LEVEL', 'NSOS_ORG_NAME', 'NSOS_OPERATE_ORG']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)
  formData.value = await requestClient.get(import.meta.env.VITE_BASIC + '/systemInfo/initSys', { params: { id: sysId.value } })
})

// 保存
const saveData = async () => {
  await ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      try{
        await requestClient.post(import.meta.env.VITE_BASIC + '/systemInfo/saveSys', formData.value)
      } catch {
        ElMessage.error('保存失败！')
        return
      }
      ElNotification({
        title: '提示',
        message: '保存成功！',
        type: 'success'
      })
      emit('ok')
    } else {
      ElMessage.warning('请输入必填项！')
    }
  })
}

defineExpose({})
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

:deep(.el-input-number) {
  width: 100%;
}
</style>
