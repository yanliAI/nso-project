<template>
  <div class="main-d">
    <div class="head-d">
      <div class="text-center font-bold text-lg ml-2">
        {{ dropList.NSOS_ORG_NAME?.find(i => i.value === data.submissionData.releaseDept)?.label }}信息报送
      </div>
      <div class="flex items-center h-12 line">
        <div>信息编号：<span class="primary">{{data.submissionData.infoCode}}</span></div>
      </div>
    </div>
    <div class="body-d">
      <div style="height: 75%">
        <el-form label-width="auto" ref="ruleFormRef" :model="data.submissionData" :rules="formRules" :inline="true" label-position="right" class="demo-form-inline">
          <el-row>
            <el-col :span="16">
              <el-form-item label="信息标题:" prop="infoTitle">
                <el-input v-model="data.submissionData.infoTitle" clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="信息分类:" prop="infoType" filterable>
                <el-select v-model="data.submissionData.infoType" clearable>
                  <el-option v-for="item in dropList.NSOS_INFO_SUBMISSION_TYPE" :key="item.value" :label="item.label" :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="信息内容:" prop="infoContent">
                <el-input v-model="data.submissionData.infoContent" :rows="5" type="textarea" clearable/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="信息附件:" prop="attachInfo">
                <el-button v-if="data.submissionData.id" type="primary" class="ml-0" @click="attachClick">附件上传</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="接收单位:" prop="receiveDept" filterable>
                <el-select v-model="data.submissionData.receiveDept" multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="4" clearable filterable class="ml-0">
                  <el-option v-for="item in dropList.NSOS_ORG_NAME" :key="item.value" :label="item.label" :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="发布单位:" prop="releaseDept">
                <el-select v-model="data.submissionData.releaseDept" disabled clearable>
                  <el-option v-for="item in dropList.NSOS_ORG_NAME" :key="item.value" :label="item.label" :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="发布时间:" prop="releaseTime">
                <el-date-picker v-model="data.submissionData.releaseTime" type="datetime" disabled clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="发布人:" prop="releasePeople">
                <el-input v-model="data.submissionData.releasePeople" disabled clearable/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div style="height: 25%; display: flex; justify-content: center">
        <el-button v-if="data.submissionData.infoStatus != '3'" type="primary" @click="save">保存</el-button>
        <el-button v-if="data.submissionData.id && data.submissionData.infoStatus != '3'" type="primary" @click="submit">报送</el-button>
        <el-button type="info" @click="close">关闭</el-button>
      </div>
    </div>
    <Modal class="w-[700px]" title="附件编辑" :footer="false" :closeOnClickModal="false" :draggable="true">
      <AttachFile :parentId="data.submissionData.id" close="addClose"></AttachFile>
    </Modal>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue';
import { ElForm, ElFormItem, ElRow, ElCol, ElTable, ElTableColumn, ElPagination, 
         ElMain, ElContainer, ElHeader, ElFooter, ElTabs, ElTabPane, ElNotification, ElMessage, ElMessageBox } from 'element-plus';
import { useDropStore } from '#/store';
import { initSubmission, saveSubmission, submitInfo } from './infoSubmissionMethod.ts';
import { useVbenModal } from '@vben/common-ui';
import AttachFile from '/src/views/basic/attach/attachFile.vue'

const submissionId = defineModel('submissionId')
const tabName = defineModel('tabName')
const emit = defineEmits(['afterAdd', 'refreshList', 'removeTab'])
const data = reactive({
  submissionData: {}
})
const ruleFormRef = ref()
const formRules = reactive({
  infoTitle: [
    { required: true, message: '', trigger: 'blur' },
  ],
  infoType: [
    { required: true, message: '', trigger: 'blur' },
  ],
  infoContent: [
    { required: true, message: '', trigger: 'blur' },
  ],
  receiveDept: [
    { required: true, message: '', trigger: 'blur' },
  ],
})
const dropList = reactive({});
onMounted(async () => {
  const dropStore = useDropStore();
  const dropType = ['NSOS_INFO_SUBMISSION_TYPE', 'NSOS_INFO_SUBMISSION_STATUS', 'NSOS_ORG_NAME'];
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);
  data.submissionData = await initSubmission({id: submissionId.value});
  handleMultiDeptAfter();
})

const save = async () => {
  handleMultiDeptBefore();
  data.submissionData = await saveSubmission(data.submissionData);
  handleMultiDeptAfter();
  ElNotification({
    title: '提示',
    message: '保存成功！',
    type: 'success',
  })
  emit('afterAdd', data.submissionData)
  emit('refreshList')
}
const submit = async () => {
  let count = 0;
  await ruleFormRef.value.validate(async (valid) => {
    if (count > 0) return;
    count++
    if (valid) {
      handleMultiDeptBefore();
      data.submissionData = await submitInfo(data.submissionData);
      handleMultiDeptAfter();
      ElNotification({
        title: '提示',
        message: '报送成功！',
        type: 'success',
      })
      emit('refreshList')
    } else {
      ElMessage.warning('请输入必填项！');
    }
  })
}
const close = () => {
  emit('close', tabName.value)
}
const handleMultiDeptBefore = () => {
  data.submissionData.receiveDept = data.submissionData.receiveDept?.join(',');
}
const handleMultiDeptAfter = () => {
  data.submissionData.receiveDept = data.submissionData.receiveDept?.split(',');
}

const attachClick = () => {
  modalApi.open()
}
const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
});
</script>
<style scoped>
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
  margin-bottom: 12px;
}

.main-d{
  width: 1050px;
  height: 100%;
  margin: auto;
  font-size: 16px;
}

.head-d{
  width: 100%;
  height: 100px;
}

.line{
  border-bottom: 1px solid #e7e7e7;
}

.primary{
  color: hsl(var(--primary));
}

.body-d{
  width: 100%;
  height: calc(100% - 100px);
  overflow: auto;
}


:deep(.el-form-item__label){
  font-size: 16px;
}
</style>
