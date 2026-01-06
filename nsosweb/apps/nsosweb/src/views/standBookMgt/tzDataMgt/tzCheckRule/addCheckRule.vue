<template>
  <div class="w-full h-full pt-2">
    <el-form label-width="110px" ref="ruleFormRef" :model="formData" :rules="formRules" :inline="true" label-position="right" class="demo-form-inline">
      <el-row>
        <el-col :span="12">
          <el-form-item label="规则编号:" prop="ruleCode">
            <el-input v-model="formData.ruleCode" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="规则名称:" prop="ruleName">
            <el-input v-model="formData.ruleName" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="核查对象:" prop="ruleTableName">
            <el-select v-model="formData.ruleTableName" filterable>
              <el-option v-for="item in hcObject" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="核查字段:" prop="ruleColumnName">
            <el-select v-model="formData.ruleColumnName" filterable>
              <el-option v-for="item in hcColumn" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="是否取反:" prop="isReverse">
            <el-select v-model="formData.isReverse" filterable>
              <el-option v-for="item in dropList.NSOS_YES_OR_NO" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="核查规则:" prop="ruleContent">
            <el-input v-model="formData.ruleContent" :rows="2" maxlength="1000" show-word-limit type="textarea" placeholder="请输入核查规则（正则表达式）" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="规则说明:" prop="ruleDescribe">
            <el-input v-model="formData.ruleDescribe" :rows="2" maxlength="1000" show-word-limit type="textarea" placeholder="请输入规则说明" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注:" prop="remark">
            <el-input v-model="formData.remark" :rows="1" maxlength="1000" show-word-limit type="textarea" placeholder="请输入备注" clearable />
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
const dataId = defineModel('dataId')
const emit = defineEmits('close')
const ruleFormRef = ref()
const data = reactive({
  rules: []
})
const hcObject = [
  {label: '系统信息', value: '1'},
  {label: '物理机', value: '2'},
  {label: '容器', value: '3'},
  {label: '组件信息', value: '4'},
]
const hcColumn = [
  {label: '系统名称', value: 'SYSTEM_NAME'},
  {label: 'IP', value: 'IP'},
] 
const formRules = reactive({
  ruleName: [
    { required: true, message: '请输入规则名称', trigger: 'blur' },
    { min: 0, max: 80, message: '内容长度最大不能超过80', trigger: 'blur' }
  ],
})
onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = ['NSOS_YES_OR_NO']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)

  formData.value = await requestClient.get(import.meta.env.VITE_BASIC + '/filesCheckRule/initData', { params: { id: dataId.value } })

})

// 保存
const saveData = async () => {
  await ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      try{
        await requestClient.post(import.meta.env.VITE_BASIC + '/filesCheckRule/saveAddData', formData.value)
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
</style>
