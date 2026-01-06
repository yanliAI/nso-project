<template>
  <div class="w-full h-full pt-2">
    <el-form label-width="110px" ref="ruleFormRef" :model="formData" :rules="formRules" :inline="true" label-position="right" class="demo-form-inline">
      <el-row>
        <el-col :span="12">
          <el-form-item label="所属单位:" prop="affUnit">
            <el-select v-model="formData.affUnit" filterable :disabled="formData.id != null">
              <el-option v-for="item in dropList.NSOS_ORG_NAME" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属系统:" prop="affSys">
            <el-select v-model="formData.affSys" filterable :disabled="formData.id != null">
              <el-option v-for="item in dropList.NSOS_SYSTEM_INFO" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="资产名称:" prop="assetName">
            <el-input v-model="formData.assetName" :rows="1" maxlength="100" show-word-limit type="textarea" placeholder="请输入资产名称" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="资产类型:" prop="assetType">
            <el-select v-model="formData.assetType" filterable>
              <el-option v-for="item in dropList.NSOS_ASSET_TYPE" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="IP地址:" prop="ipAddress">
            <el-input v-model="formData.ipAddress" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="版本号:" prop="assetVersion">
            <el-input v-model="formData.assetVersion" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否完成整改:" prop="isRestore">
            <el-select v-model="formData.isRestore" filterable>
              <el-option v-for="item in dropList.NSOS_YES_OR_NO" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" v-if="formData.isRestore == 'N'">
          <el-form-item label="计划完成整改时间:" prop="planTime">
            <el-date-picker v-model="formData.planTime" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="formData.isRestore == 'N'">
        <el-col :span="24">
          <el-form-item label="应对措施:" prop="counterMeasures">
            <el-input v-model="formData.counterMeasures" :rows="4" maxlength="1000" show-word-limit type="textarea" placeholder="请输入应对措施" clearable />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="text-center pt-[10px] pb-[15px]">
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
import { saveFlawAsset, initFlawAsset } from '../cmdMgtMethod.ts'
import { Tickets, Close } from '@element-plus/icons-vue'
const dropList = reactive({})

const formData = ref({
  affUnit: null,
  affSys: null
})
const cmdCode = defineModel('cmdCode')
const id = defineModel('id')
const emit = defineEmits(['close', 'ok'])
const ruleFormRef = ref()
const data = reactive({
  rules: []
})
const formRules = reactive({
  affUnit: [{ required: true, message: '请选择所属单位', trigger: 'change' }],
  affSys: [{ required: true, message: '请选择所属系统', trigger: 'change' }],
  assetName: [
    { required: true, message: '请输入资产名称', trigger: 'blur' },
    { min: 0, max: 100, message: '内容长度最大不能超过100', trigger: 'blur' }
  ],
  planTime: [{ required: true, message: '请选择计划完成整改时间', trigger: 'blur' }],
  ipAddress: [{ pattern: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, message: '请输入有效的IP地址', trigger: 'blur' }],
  counterMeasures: [
    { required: true, message: '请输入应对措施', trigger: 'blur' },
    { min: 0, max: 1000, message: '内容长度最大不能超过1000', trigger: 'blur' }
  ],
  assetVersion: [{ min: 0, max: 30, message: '内容长度最大不能超过30', trigger: 'blur' }]
})
onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = ['NSOS_YES_OR_NO', 'NSOS_ORG_NAME', 'NSOS_SYSTEM_INFO', 'NSOS_USER_NAME', 'NSOS_ASSET_TYPE']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)

  formData.value = await initFlawAsset({ id: id.value, cmdCode: cmdCode.value })
})

// 保存
const saveData = async () => {
  await ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      dropList.NSOS_ORG_NAME.forEach((d) => {
        if (d.value == formData.value.affUnit) {
          formData.value.affUnit = d.label
        }
      })
      dropList.NSOS_SYSTEM_INFO.forEach((d) => {
        if (d.value == formData.value.affSys) {
          formData.value.affSys = d.label
        }
      })
      await saveFlawAsset(formData.value)
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

:deep(.el-form-item__label) {
  align-items: center;
  line-height: normal;
  text-align: right;
}

:deep(.el-form--inline .el-form-item) {
  width: 100% !important;
  margin-right: 0 !important;
  margin-bottom: 15px !important;
}
</style>
