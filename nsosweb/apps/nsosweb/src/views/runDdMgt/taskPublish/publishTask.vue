<template>
  <el-container class="w-full h-full pt-2">
    <el-header height="180px">
      <el-form label-width="110px" ref="ruleFormRef" :model="data.taskForm.tasksInfoVO" :rules="formRules">
        <el-row>
          <el-col :span="24">
            <el-form-item label="排班任务名称:" prop="tasksName">
              <el-input v-model="data.taskForm.tasksInfoVO.tasksName" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="排班开始时间:" prop="dutyStartTime">
              <el-date-picker v-model="data.taskForm.tasksInfoVO.dutyStartTime" :disabled-date="disableBeforeToday" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" @change="startTimeChange"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排班结束时间:" prop="dutyEndTime">
              <el-date-picker v-model="data.taskForm.tasksInfoVO.dutyEndTime" :disabled-date="disableEndTime" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" :default-time="defaultEndTime"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="模板名称:" prop="templateId">
              <el-select v-model="data.taskForm.tasksInfoVO.templateId" filterable clearable @change="queryTemplateData('hand')">
                <el-option v-for="item in dropList.NSOS_DUTY_TEMPLATENAME" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="完成时限:" prop="doneLine">
              <el-date-picker v-model="data.taskForm.tasksInfoVO.doneLine" :disabled-date="disableBeforeToday" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="靶标单位:" prop="targetOrg">
              <el-select v-model="data.taskForm.tasksInfoVO.targetOrg" :disabled="gkdwFilterList.length===0" placeholder="" filterable clearable>
                <el-option v-for="item in gkdwFilterList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位排序:" prop="UnitSort" v-if="data.taskForm.tasksInfoVO.templateId">
              <el-button color="#1a5dff" v-if="data.taskForm.tasksInfoVO.defaultOrder === 'Y'" size="small" plain @click="openSort">默认</el-button>
              <el-button color="#13c264" v-else size="small" plain @click="openSort">已设置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-main style="height: calc(100% - 220px)">
      <el-table :data="data.orgTableData" border size="small" style="height: 100%">
        <el-table-column type="index" width="40" label="#" align="center" />
        <el-table-column prop="deptName" label="单位" align="center" />
        <el-table-column prop="orgName" label="组织角色" align="center" />
        <el-table-column prop="manName" label="人员角色" align="center" />
      </el-table>
    </el-main>
    <el-footer height="40px">
      <div style="display: flex; align-items: center; justify-content: center; height: 100%">
        <el-button v-if="data.taskForm.tasksInfoVO.templateId" type="primary" @click="openPreviewDialog">预览</el-button>
        <el-button v-if="canSave" type="primary" @click="saveTask">保存</el-button>
        <el-button type="primary" @click="publishTask">发布</el-button>
        <el-button @click="cancle">取消</el-button>
      </div>
    </el-footer>
  </el-container>
  <Modal class="h-[400px] w-[600px]" title="单位排序" :footer="false" :closeOnClickModal="false" :draggable="true">
    <UnitSort :taskInfo="data.taskForm" @cancleSort="cancleSort" @saveSort="saveSort"/>
  </Modal>
  <ModalB class="h-[800px] w-[1600px]" style="overflow: hidden" title="排班预览" :footer="false" :closeOnClickModal="false" :draggable="true">
    <task-preview :templateId="data.templateId" />
  </ModalB>
</template>
<script setup>
import { ref, reactive, onMounted, defineEmits, computed } from 'vue'
import { useVbenModal } from '@vben/common-ui'
import { ElInput, ElContainer, ElHeader, ElMain, ElFooter, ElRow, ElCol, ElTable, ElForm, ElFormItem, ElButton, ElPagination, ElDatePicker, ElSelect, ElOption, ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { queryTemplateApi, publichTaskApi, deleteTaskApi, saveTaskApi } from './taskPublishMethod.ts'
import { tDateFormat, formatDateTime, tDateTimeFormat, formatDrop } from '#/utils/commonUtil.ts'
import { useDropStore } from '#/store'
import { toCamelCase } from '@vben/utils'
import UnitSort from './unitSort.vue'
import taskPreview from './taskPreview.vue'

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close()
  }
})
const [ModalB, modalApiB] = useVbenModal({
  onCancel() {
    modalApiB.close()
  }
})
const ruleFormRef = ref()
const formRules = reactive({
  tasksName: [
    { required: true, message: '请输入排班任务名称', trigger: 'blur' },
  ],
  dutyStartTime: [
    { required: true, message: '请选择排班开始时间', trigger: 'blur' },
  ],
  dutyEndTime: [
    { required: true, message: '请选择排班结束时间', trigger: 'blur' }
  ],
  templateId: [
    { required: true, message: '请选择模板', trigger: 'blur' }
  ],
  doneLine: [
    { required: true, message: '请选择完成时限', trigger: 'blur' }
  ],
})
onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = ['NSOS_DUTY_TEMPLATENAME', 'NSOS_ORG_NAME_SLDW']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)

  data.taskForm.tasksInfoVO = taskData.value
  data.taskForm.tasksInfoVO.dutyStartTime = formatDateTime(data.taskForm.tasksInfoVO.dutyStartTime)
  data.taskForm.tasksInfoVO.dutyEndTime = formatDateTime(data.taskForm.tasksInfoVO.dutyEndTime)
  data.taskForm.tasksInfoVO.doneLine = formatDateTime(data.taskForm.tasksInfoVO.doneLine)
  if (!data.taskForm.tasksInfoVO.defaultOrder) {
    data.taskForm.tasksInfoVO.defaultOrder = 'Y'
  }
  queryTemplateData('auto')
})
const gkdwFilterList = ref([])
const data = reactive({
  taskForm: {
    tasksInfoVO: {
    },
    sortData: [],
  },
  orgTableData: [],
  gkdw: ['010000', '030000', '040000', '050000', '070000', '060000', '090000'],
  unitMap: new Map(),
  unitData: [],
  templateId: null,
})
const emit = defineEmits(['closeModal'])
const taskData = defineModel('taskData')
const canSave = defineModel('canSave')
const dropList = reactive({})
const defaultEndTime = new Date(2000, 1, 1, 23, 59, 59)

const saveTask = async () => {
  if (!data.taskForm.tasksInfoVO.tasksName || !data.taskForm.tasksInfoVO.dutyStartTime || !data.taskForm.tasksInfoVO.dutyEndTime || !data.taskForm.tasksInfoVO.templateId || !data.taskForm.tasksInfoVO.doneLine) {
    ElMessage.warning('请填写完整的任务信息！')
    return
  }
  if (data.taskForm.tasksInfoVO.dutyStartTime >= data.taskForm.tasksInfoVO.dutyEndTime) {
    ElMessage.warning('结束时间不得早于开始时间!')
    return
  }
  try {
    await saveTaskApi(data.taskForm)
    emit('closeModal')
    ElNotification({
      title: '提示',
      message: '保存成功！',
      type: 'success',
    })
  } catch (error) {
    ElMessage.error('保存失败！')
  }
}

const publishTask = async () => {
  // if (!data.taskForm.tasksInfoVO.tasksName || !data.taskForm.tasksInfoVO.dutyStartTime || !data.taskForm.tasksInfoVO.dutyEndTime || !data.taskForm.tasksInfoVO.templateId || !data.taskForm.tasksInfoVO.doneLine) {
  //   ElMessage.warning('请填写完整的任务信息！')
  //   return
  // }
  await ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      if (data.taskForm.tasksInfoVO.dutyStartTime >= data.taskForm.tasksInfoVO.dutyEndTime) {
        ElMessage.warning('结束时间不得早于开始时间！')
        return
      }
      try {
        await publichTaskApi(data.taskForm)
        emit('closeModal')
        ElNotification({
          title: '提示',
          message: '发布成功！',
          type: 'success',
        })
      } catch (error) {
        ElMessage.error('发布失败！')
      }
    } else {
      ElMessage.warning('请输入必填项！')
    }
  })
}

const cancle = () => {
  emit('closeModal')
}

const openSort = () => {
  modalApi.open()
}

const queryTemplateData = async (type) => {
  if (type === 'hand') {
    data.taskForm.tasksInfoVO.defaultOrder = 'Y'
    data.taskForm.sortData = []
    data.taskForm.tasksInfoVO.status = '0'
  }
  data.unitMap = new Map()
  const list = await queryTemplateApi({ templateId: data.taskForm.tasksInfoVO.templateId })
  data.orgTableData = list
  list.forEach((item) => {
    if (!data.unitMap.has(item.deptCode)) {
      data.unitMap.set(item.deptCode, {
        value: item.deptCode,
        label: item.deptName
      })
    }
  })
  gkdwFilterList.value = Array.from(data.unitMap.values()).filter((option) => data.gkdw.includes(option.value))
}

const disableBeforeToday = (time) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return time.getTime() < today.getTime()
}

const disableEndTime = (time) => {
  if(!data.taskForm.tasksInfoVO.dutyStartTime) {
    return true;
  }
  const start = new Date(data.taskForm.tasksInfoVO.dutyStartTime);
  start.setHours(0,0,0,0);
  return time.getTime() < start.getTime()
}

const startTimeChange = (value) => {
  if(data.taskForm.tasksInfoVO.dutyEndTime && value > data.taskForm.tasksInfoVO.dutyEndTime) {
    data.taskForm.tasksInfoVO.dutyEndTime = null;
  }
}

function cancleSort() {
  modalApi.close();
}

function saveSort(sortData,isChange) {
  data.taskForm.sortData = sortData
  data.taskForm.tasksInfoVO.defaultOrder = isChange === 'Y' ? 'N' : 'Y';
  console.log(data.taskForm.sortData)
  modalApi.close();
}

const openPreviewDialog = async () => {
  data.templateId = data.taskForm.tasksInfoVO.templateId
  modalApiB.open()
}
</script>
<style scoped>
:deep(.el-main){
  padding: 0;
}

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
  margin-bottom: 15px;
}

:deep(.el-form-item){
  width: calc(100% - 20px);
  margin-right: 20px;
  margin-bottom: 15px;
}
</style>
