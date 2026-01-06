<template>
  <div class="w-full h-full pt-2">
    <el-form label-width="auto" ref="ruleFormRef" :model="formData" :rules="formRules" :inline="true" :disabled="disabled" label-position="right" class="demo-form-inline">
      <el-row>
        <el-col :span="8">
          <el-form-item label="现场签收人:" prop="signMan">
            <!-- <el-select v-model="formData.signMan" disabled>
              <el-option v-for="item in dropList.NSOS_USER_NAME" :key="item.value" :label="item.label" :value="item.value" />
            </el-select> -->
            <el-input v-model="formData.signMan" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="签收时间:" prop="signTime">
            <el-date-picker v-model="formData.signTime" type="datetime" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="签收部门:" prop="signDept">
            <!-- <el-select v-model="formData.signDept" filterable clearable>
              <el-option v-for="item in dropList.NSOS_ORG_NAME" :key="item.value" :label="item.label" :value="item.value" />
            </el-select> -->
            <OrgTreeSelect v-model="formData.signDept" @updateName="(v) => (formData.signDeptName = v)" disabled></OrgTreeSelect>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="缺陷是否定位:" prop="isPosit">
            <!-- <el-input v-model="formData.isPosit" disabled /> -->
            <el-radio-group v-model="formData.isPosit">
              <el-radio value="1" size="large">是</el-radio>
              <el-radio value="2" size="large">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="解决办法:" prop="solution">
            <el-input v-model="formData.solution" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="缺陷等级:" prop="defectLevel" filterable>
            <el-select v-model="formData.defectLevel">
              <el-option v-for="item in dropList.NSOS_DEFECT_LEVEL" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="缺陷原因:" prop="defectReason" filterable>
            <el-input v-model="formData.defectReason" :rows="2" maxlength="256" show-word-limit type="textarea" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="缺陷措施:" prop="defectMeasures">
            <el-input v-model="formData.defectMeasures" :rows="2" maxlength="256" show-word-limit type="textarea" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="处理过程说明:" prop="processDescription">
            <el-input v-model="formData.processDescription" :rows="2" maxlength="256" show-word-limit type="textarea" />
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
import OrgTreeSelect from '#/views/basic/common/orgTreeSelect.vue'

const dropList: any = reactive({})

const formData: any = defineModel('formData')
const disabled = defineModel('disabled')
const ruleFormRef: any = ref<FormInstance>()
const formRules = reactive({})

onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = ['NSOS_DEFECT_TYPE', 'NSOS_DEFECT_LEVEL', 'NSOS_SYSTEM_INFO', 'NSOS_ORG_NAME', 'NSOS_USER_NAME']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)
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
