<template>
  <div class="w-full h-full pt-2">
    <el-form label-width="auto" ref="ruleFormRef" :model="formData" :rules="formRules" :inline="true" :disabled="disabled" label-position="right" class="demo-form-inline">
      <el-row>
        <el-col :span="8">
          <el-form-item label="是否已解决:" prop="isSolve">
            <!-- <el-input v-model="formData.isPosit" disabled /> -->
            <el-radio-group v-model="formData.isSolve">
              <el-radio value="1" size="large">是</el-radio>
              <el-radio value="2" size="large">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="归档人:" prop="finishMan">
            <!-- <el-select v-model="formData.finishMan" disabled>
              <el-option v-for="item in dropList.NSOS_USER_NAME" :key="item.value" :label="item.label" :value="item.value" />
            </el-select> -->
            <el-input v-model="formData.finishMan" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="归档时间:" prop="finishTime">
            <el-date-picker v-model="formData.finishTime" type="datetime" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="归档说明:" prop="finishRemark" filterable>
            <el-input v-model="formData.finishRemark" :rows="1" maxlength="256" show-word-limit type="textarea" />
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

const dropList: any = reactive({})

const formData: any = defineModel('formData')
const disabled = defineModel('disabled')
const ruleFormRef: any = ref<FormInstance>()
const formRules = reactive({})

onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = ['NSOS_DEFECT_TYPE', 'NSOS_DEFECT_LEVEL', 'NSOS_USER_NAME']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)
  // formData.value.finishTime = new Date().getTime()
})

const validateForm = async (callback) => {
  await ruleFormRef.value.validate(callback)
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
