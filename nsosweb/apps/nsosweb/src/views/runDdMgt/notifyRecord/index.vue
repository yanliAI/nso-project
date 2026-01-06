<template>
  <el-container class="h-full bg-white">
    <el-header height="50px">
      <el-button @click="openDialog()">打开弹窗</el-button>
    </el-header>
    <Modal class="w-[1800px] h-[800px]" :title="recordType === '1' ? '通知信息' : '催办信息'" :footer="false" :closeOnClickModal="false" :draggable="true">
      <NotificationDialog :notifyTarget="notifyTarget" :contact="contact" :recordType="recordType" :module="module" :subModule="subModule" :busiCode="busiCode" :tacheCode="tacheCode" :tacheName="tacheName" @closeDiaLog="closeDiaLog"></NotificationDialog>
    </Modal>
  </el-container>
</template>
<script setup>
import { Page } from '@vben/common-ui'
import { Search, Delete, Plus, Download, Operation } from '@element-plus/icons-vue'
import { ElForm, ElFormItem, ElRow, ElCol, ElTable, ElTableColumn, ElPagination, ElMain, ElContainer, ElHeader, ElFooter, ElTabs, ElTabPane, ElMessageBox, ElMessage, ElDialog } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
import { requestClient } from '#/api/request'
import { useDropStore } from '#/store'
import { useVbenModal } from '@vben/common-ui'
import NotificationDialog from './NotificationDialog2.vue'
import { tDateFormat, tDateTimeFormat, formatDrop, lookFlow } from '#/utils/commonUtil.ts'

const dropList = reactive({})
const recordType = '1' // 1通知，2催办
const module = '1' // 1运调工作台，2指令管理，3故障管理
const subModule = '1' // 2故障复盘
const busiCode = '1008611' // 业务单号
const tacheCode = 'bm' // 随便定
const tacheName = '签收' // 随便定

const notifyTarget = 'admin' // 接收人编码loginCode
const contact = '888888' //联系方式

onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = ['NSOS_USER_NAME', 'NSOS_ORG_NAME', 'NSOS_CMD_FL', 'NSOS_CMD_TYPE']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)
})
const scheduleListTable = ref()
const selectedRows = ref([])

const data = reactive({
  selectedRow: {}
})

const openDialog = () => {
  modalApi.open()
}

const closeDiaLog = () => {
  modalApi.close()
}

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close()
  }
})
</script>
<style scoped>
.primary {
  color: hsl(var(--primary));
}

.clickable {
  cursor: pointer;
}

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
  margin-bottom: 12px;
}

:deep(.el-main) {
  padding: 0;
}
</style>
