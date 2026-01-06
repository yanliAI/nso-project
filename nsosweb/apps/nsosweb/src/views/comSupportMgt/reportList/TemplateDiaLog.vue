<template>
  <div style="width: 100%; height: 100%">
    <div style="height: calc(100% - 1px)">
      <el-form label-width="auto" ref="formRef" :model="formData" :rules="formRules" :inline="true" label-position="right" class="demo-form-inline">
        <el-row>
          <el-col :span="12">
            <el-form-item label="年份:" prop="reportMon">
              <!-- <el-input v-model="formData.reportMon"  /> -->
              <el-date-picker v-model="formData.reportMon" type="datetime" disabled clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位:" prop="unit">
              <el-select v-model="formData.unit" placeholder="选择单位" clearable filterable>
                <el-option v-for="item in dropList.NSOS_ORG_NAME_SLDW" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="报表名称:" prop="reportName">
              <el-input v-model="formData.reportName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生成时间:" prop="generateTime">
              <!-- <el-input v-model="formData.generateTime" disabled /> -->
              <el-date-picker v-model="formData.generateTime" type="datetime" disabled clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="附件:">
              <el-button type="primary" class="ml-0" :icon="Upload" @click="attachClick">附件上传</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="width: 100%; height: 230px">
        <AttachList ref="attachFileRef" :parentId="id" :showPreview="false"></AttachList>
      </div>
      <div style="width: 100%; height: 20px"></div>
      <div style="justify-content: center; height: 35px" class="flex">
        <el-button type="primary" @click="handleSubmit">保存</el-button>
        <el-button @click="attachClose">取消</el-button>
      </div>
    </div>

    <Modal class="w-[700px]" title="附件编辑" :footer="false" :closeOnClickModal="false" :draggable="true">
      <AttachFile :parentId="id" @afterUpload="attachFileRef.queryData()" close="addClose"></AttachFile>
    </Modal>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useDropStore } from '#/store'
import { requestClient } from '#/api/request'
import { ElMessage } from 'element-plus'
import AttachFile from '../../basic/attach/attachFile.vue'
import AttachList from '../../basic/attach/attachList.vue'
import { Search, Delete, Plus, Download, Upload } from '@element-plus/icons-vue'
import { useVbenModal } from '@vben/common-ui'
import { tDateTimeFormat, formatDateTime, formatDrop, lookFlow } from '#/utils/commonUtil.ts'

const formData = defineModel('formData')
const emit = defineEmits(['closeDiaLog', 'query'])
const dropList = reactive({})
const id = ref('1')

const formRef = ref(null)
const attachFileRef = ref()
// 验证规则
const formRules = reactive({
  reportMon: [
    {
      required: true,
      message: '请输入',
      trigger: 'change'
    }
  ],
  unit: [
    {
      required: true,
      message: '请输入',
      trigger: 'change'
    }
  ],
  reportName: [
    {
      required: true,
      message: '请输入',
      trigger: 'change'
    }
  ],
  generateTime: [
    {
      required: true,
      message: '请输入',
      trigger: 'change'
    }
  ],
  isEnable: [
    {
      required: true,
      message: '请选择是否启用',
      trigger: 'change'
    }
  ]
  // upload: [{ required: true, message: '请上传附件', trigger: 'change' }],
})

// 输入过滤：实时限制只能输入数字
const handleNumberInput = (value) => {
  formData.finishLimit = value.replace(/[^\d]/g, '')
}

onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = ['NSOS_ORG_NAME_SLDW', 'NSOS_ORG_NAME_SLDW', 'NSOS_REPORT_DIMENSION', 'NSOS_REPORT_ISENABLE', 'NSOS_USER_NAME']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)
  if (formData) {
    id.value = formData.value.id
  }
})

const attachClick = async () => {
  const response = await requestClient.post(import.meta.env.VITE_NSOSZH + '/reportInfo/save', formData.value)
  formData.value = response
  id.value = response.id
  modalApi.open()
}

const attachClose = () => {
  emit('closeDiaLog')
}

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close()
  }
})

const handleSubmit = async () => {
  try {
    // 执行表单验证
    await formRef.value.validate()

    // 验证通过后提交逻辑
    save()
  } catch (error) {
    ElMessage.error('请检查表单填写是否正确')
  }
}

const save = async () => {
  try {
    const response = await requestClient.post(import.meta.env.VITE_NSOSZH + '/reportInfo/save', formData.value)
  } catch {
    ElMessage.error('保存失败')
  } finally {
    emit('closeDiaLog')
    emit('query')
  }
}

const handleDateChange = () => {
  formData.value.reportMon = formData.value.reportMon.getTime()
}
</script>
<style scoped>
.head-d {
  width: 100%;
  height: 55px;
  border-bottom: 1px solid #ebebeb;
}
</style>
