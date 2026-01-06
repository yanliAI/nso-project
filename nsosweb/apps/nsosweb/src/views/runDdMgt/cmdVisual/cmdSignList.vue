<template>
  <el-table ref="faultHandleTable" :data="data.tableData" show-overflow-tooltip border size="small" style="height: 100%">
    <el-table-column type="index" label="序号" align="center" fixed width="50" />
    <el-table-column label="编号" prop="commandCode" fixed width="200" align="center" />
    <el-table-column prop="commandFl" column-key="NSOS_CMD_FL" :formatter="formatDrop" label="类型" width="100" align="center" />
    <el-table-column prop="commandType" column-key="NSOS_CMD_TYPE" :formatter="formatDrop" label="类别" width="100" align="center" />
    <el-table-column prop="commandTitle" label="名称" align="left" width="250" header-align="center" />
    <el-table-column prop="wcTime" label="完成时限" :formatter="tDateTimeFormat" width="150" align="center" />
    <el-table-column prop="signDwCode" label="复令单位" width="150" column-key="NSOS_ORG_NAME" :formatter="formatDrop" align="center" />
    <el-table-column prop="signMan" label="复令人" column-key="NSOS_USER_NAME" :formatter="formatDrop" align="center" />
    <el-table-column label="复令时间" width="130" align="center">
      <template #default="props">
        <span v-if="props.row.isComplate == 'Y'">{{ formatDateTime(props.row.opTime) }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="isComplate" label="是否复令" width="80" align="center">
      <template #default="props">
        <span v-if="props.row.isComplate == 'Y'" >已复令</span>
        <span v-else class="text-red-600">未复令</span>
      </template>
    </el-table-column>
    <el-table-column header-align="center" width="80" label="是否超时" align="center">
      <template #default="scope">
        <span v-if="scope.row.opTime > new Date(scope.row.wcTime)" class="text-red-600">是</span>
        <span v-else>否</span>
      </template>
    </el-table-column>
  </el-table>
</template>
<script setup>
import { Page } from '@vben/common-ui'
import { ElTable, ElTableColumn, ElFormItem, ElForm, ElInput, ElButton, ElPagination, ElMessage, ElMessageBox, ElDialog, ElRow, ElCol, ElMain, ElContainer, ElHeader, ElFooter, ElTabs, ElTabPane, ElPopover } from 'element-plus'
import { reactive, ref, onMounted, computed, nextTick } from 'vue'
import { requestClient } from '#/api/request'
import { useDropStore } from '#/store'
import { Edit, Search, Delete, RefreshLeft, Plus, Share } from '@element-plus/icons-vue'
import { formatDateTime, tDateTimeFormat, formatDrop } from '#/utils/commonUtil.ts'

const dropList = reactive({})
const activeIndex = defineModel('activeIndex')
const dwbm = defineModel('dwbm')
const emit = defineEmits([])
onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = ['NSOS_CMD_FL', 'NSOS_CMD_TYPE']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)
  query()
})

const data = reactive({
  tableData: []
})

const query = async () => {
  data.tableData = await requestClient.get(import.meta.env.VITE_NSOSGZ + '/command/queryCmdSldwList', { params: { dwbm: dwbm.value, activeIndex: activeIndex.value } })
}

defineExpose({})
</script>
<style scoped>
.primary {
  color: hsl(var(--primary));
}

.clickable {
  cursor: pointer;
}

:deep(.el-tab-pane) {
  width: 100%;
  height: 100%;
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

:deep(.el-form-item) {
  width: calc(100% - 20px);
  margin-right: 20px;
  margin-bottom: 12px;
}

:deep(.el-main) {
  padding: 0;
}

.popover {
  display: flex;
  align-items: center;
  margin-right: 16px;
  font-size: 13px;
  cursor: pointer;
}
</style>
