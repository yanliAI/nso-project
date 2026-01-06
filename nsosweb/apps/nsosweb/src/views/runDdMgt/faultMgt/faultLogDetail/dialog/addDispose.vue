<template>
  <div class="w-full h-full">
    <el-form label-width="auto" ref="ruleFormRef" :rules="formRules" :model="data.disposeData" :inline="true" size="small" label-position="right" class="demo-form-inline">
      <el-row>
        <el-col :span="8">
          <el-form-item label="时间:" prop="disposeTime">
            <el-date-picker v-model="data.disposeData.disposeTime" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" disabled clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="调度员:" prop="handledBy">
            <el-select v-model="data.disposeData.handledBy" disabled>
              <el-option v-for="item in dropList.NSOS_USER_NAME" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" class="text-right">
          <el-button type="primary" class="ml-4" :icon="Tickets" size="small" :loading="data.saveLoading" @click="saveClick">保存</el-button>
          <el-button type="info" plain class="ml-4" :icon="Close" size="small" @click="close">取消</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="环节:" prop="faultSys">
            <el-radio-group v-model="data.disposeData.disposeStep">
              <el-radio v-for="item in dropList.NSOS_FAULT_DEAL_JD" :key="item.value" :value="item.value">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="backg mb-1">
        <div class="primary pl-2 text-xs font-bold">处置进程</div>
      </div>
      <el-row>
        <el-col :span="24">
          <el-form-item label="日志内容:" prop="processLog">
            <el-input v-model="data.disposeData.processLog" :rows="4" maxlength="256" show-word-limit type="textarea" placeholder="请输入指令内容" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="backg mb-1">
      <div class="primary pl-2 text-xs font-bold">指令信息</div>
    </div>
    <div class="mt-1 h-[24px]">
      <el-button type="primary" class="ml-4" :icon="Plus" size="small" v-if="data.disposeData.id"  @click="addCmdClick">指令</el-button>
    </div>
    <div class="h-[150px]">
      <el-table :data="data.cmdList" size="small" v-if="data.disposeData.id" style="width: 100%;height: 150px;">
        <el-table-column type="index" width="40" label="#" align="center"/>
        <el-table-column prop="jd" label="指令编号" width="150" align="center"/>
        <el-table-column prop="log" label="指令内容" align="left"/>
        <el-table-column prop="jbr" label="发令人" column-key="NSOS_USER_NAME" :formatter="formatDrop" width="120" align="center"/>
      </el-table>
    </div>
    <div class="backg mb-1">
      <div class="primary pl-2 text-xs font-bold">附件信息</div>
    </div>
    <div class="mt-1 h-[24px]">
      <AttachUpload :parentId="faultCode" :moduleId="data.disposeData.id" v-if="data.disposeData.id" :size="'small'"></AttachUpload>
    </div>
    <div class="h-[200px]">
      <AttachList ref="attachListRef" :parentId="faultCode" :moduleId="data.disposeData.id" v-if="data.disposeData.id" :showPreview="false"></AttachList>
    </div>
    <Modal class="w-[1100px]" title="添加指令" :footer="false" :closeOnClickModal="false" :draggable="true" headerClass="head-md">
      <CmdDetail :cmdFl="'1'" :faultCode="faultCode" :oprateFlow="false" @close="addCmdClose"></CmdDetail>
    </Modal>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue';
import { ElForm, ElFormItem, ElRow, ElCol, ElTable, ElTableColumn, ElMessage, ElNotification} from 'element-plus';
import { Tickets, Close, Plus } from '@element-plus/icons-vue';
import { useDropStore } from '#/store';
import { initDispose, queryDisposeRecord, queryCmdByFaultCode, saveDispose } from '../faultDetailMethod.ts'
import { formatDateTime, tDateTimeFormat, formatDrop} from '#/utils/commonUtil.ts';
import { useVbenModal } from '@vben/common-ui';
import AttachList from '#/views/basic/attach/attachList.vue';
import AttachUpload from '#/views/basic/attach/attachUpload.vue';
import CmdDetail from '#/views/runDdMgt/cmdMgt/cmdDetail.vue';
const faultCode = defineModel('faultCode')
const recId = defineModel('recId')

const dropList = reactive({});

const formData = reactive({
  commandExecType: '1',
});
const data = reactive({
  disposeData: {},
  disposeList: [],
  cmdList: [],
  saveLoading: false,
});
const ruleFormRef = ref()
const emit = defineEmits(['close','refreshList'])

const formRules = reactive({
  wcTime: [
    { required: true, message: '', trigger: 'change' },
  ],
  commandType: [
    { required: true, message: '', trigger: 'blur' },
  ],
  processLog: [
    { required: true, message: '', trigger: 'blur' },
    { min: 0, max: 500, message: '内容长度最大不能超过500', trigger: 'blur' },
  ],
})
const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
});
const [ModalA, modalApiA] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
});
onMounted(async () => {
  const dropStore = useDropStore();
  const dropType = ['NSOS_FAULT_DEAL_JD', 'NSOS_USER_NAME']
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);
  data.disposeData = await initDispose({id: recId.value, faultCode: faultCode.value})
  data.cmdList = await queryCmdByFaultCode({faultCode: faultCode.value})
  data.disposeList = await queryDisposeRecord({faultCode: formData.faultCode})
  formatEntity()
});
const formatEntity = () => {
  data.disposeData.disposeTime = formatDateTime(data.disposeData.disposeTime)
}
const saveClick = async () => {
  let count = 0;
  await ruleFormRef.value.validate(async (valid) => {
    if (count > 0) return;
    count++
    if (valid) {
      data.saveLoading = true
      data.disposeData = await saveDispose(data.disposeData);
      formatEntity()
      ElNotification({
        title: '提示',
        message: '保存成功！',
        type: 'success',
      })
      data.saveLoading = false
      emit('refreshList')
    } else {
      ElMessage.warning('请输入必填项！');
    }
  })
}
const addCmdClick = () => {
  modalApi.open()
}
const addCmdClose = () => {
  modalApi.close()
}
const close = () => {
  emit('close')
}
defineExpose({
  
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

.primary{
  color: hsl(var(--primary));
}

.backg{
  display: flex;
  align-items: center;
  height: 24px;
  background: #eef5ff;
}

.part-b{
  border-top: 1px solid #c4dbf5;
  border-bottom: 1px solid #c4dbf5;
}
</style>
