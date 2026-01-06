<template>
  <el-container class="h-full bg-white">
    <el-header height="60px">
      <el-form label-width="auto" ref="ruleFormRef" :model="data.formData" :inline="true" label-position="right" class="demo-form-inline">
        <el-row class="pt-3">
          <el-col :span="4">
            <el-form-item label="下拉编号：">
              <el-input v-model="data.formData.extCode " placeholder="请输入下拉编号：" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="下拉名称：">
              <el-input v-model="data.formData.extName" clearable placeholder="请输入下拉名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <div class="more-and-buttons">
              <div class="buttons">
                <el-button type="primary" class="ml-4" :icon="Search" @click="query">查询</el-button>
                <el-button type="primary" class="ml-4" :icon="Refresh" @click="refresh">刷新</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-main style="height: calc(100% - 145px)">
      <el-table ref="scheduleListTable" :data="data.tableData" border show-overflow-tooltip size="small" @selection-change="handleSelectionChange" style="height: 100%">
        <el-table-column type="selection" align="center" fixed width="40" />
        <el-table-column type="index" label="#" align="center" fixed width="40" />
        <el-table-column prop="extCode" label="下拉编号"  align="center"></el-table-column>
        <el-table-column prop="extName" label="下拉名称"  align="center"></el-table-column>
        <el-table-column prop="useFlag" label="是否使用（Y/N）"   align="center"></el-table-column>
      </el-table>
    </el-main>
    <el-footer height="45px">
      <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" class="mt-1" :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="currentChange"></el-pagination>
    </el-footer>

  </el-container>
</template>
<script setup>
import { Page } from '@vben/common-ui'
import { Search, Delete, Plus, Download, Operation } from '@element-plus/icons-vue'
import { ElForm, ElFormItem, ElRow, ElCol, ElTable, ElTableColumn, ElPagination, ElMain, ElContainer, ElHeader, ElFooter, ElTabs, ElTabPane, ElMessageBox, ElMessage, ElDialog, ElNotification } from 'element-plus'
import { onMounted, reactive, ref, computed } from 'vue'
import { requestClient } from '#/api/request'
import { useDropStore } from '#/store'
import { queryData } from './selectQueryMethod.ts'
import { useVbenModal } from '@vben/common-ui'
import { tDateFormat, tDateTimeFormat, formatDrop, lookFlow } from '#/utils/commonUtil.ts'
import { downloadFile } from '#/utils/download.ts'

const dropList = reactive({})
onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = ['NSOS_SYS_LEVEL','NSOS_OPERATE_SCHEMA','NSOS_FAULT_TYPE','NSOS_IS_EVENT_LEVEL', 'NSOS_GL_ALARM', 'NSOS_GL_KEYWORD', 'NSOS_RELATE_RZ','NSOS_PROBLEM_SOURCE', 'NSOS_GL_MEASURE', 'NSOS_SYSTEM_INFO', 'NSOS_FAULT_REASON_TYPE', 'NSOS_EVENT_LEVEL', 'NSOS_RADICALLY_REASON_CLASS', 'NSOS_RADICALLY_REASON_TYPE', 'NSOS_SIMILARITY_PROBLEM', 'NSOS_YES_OR_NO', 'NSOS_IS_REAVERSED', 'NSOS_ORG_NAME', 'NSOS_USER_NAME']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)
  query()
})
const scheduleListTable = ref()
const selectedRows = ref([])

const data = reactive({
  tableData: [],
  formData: {},
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0
  },
  selectedRow: {}
})

const query = async () => {
  data.formData.pageSize = data.pageInfo.pageSize
  data.formData.pageNo = data.pageInfo.pageNo
  const { list, count, pageNo } = await queryData(data.formData)

  data.tableData = list
  data.pageInfo.pageNo = pageNo
  data.pageInfo.total = count
}

const refresh = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要更新的数据')
    return
  }
  try {
    await requestClient.post(import.meta.env.VITE_NSOSGZ + '/extendProperty/refresh', selectedRows.value)
    query()
    selectedRows.value = []
    ElMessage.success('更新成功！')
  } catch (error) {
    console.error('更新失败:', error)
    query()
    ElMessage.error('更新失败！')
  }
}

const handleSelectionChange = (val) => {
  selectedRows.value = val
}

const handleSizeChange = (val) => {
  data.pageInfo.pageSize = val
  query()
}

const currentChange = (val) => {
  data.pageInfo.pageNo = val
  query()
}



// 提取首行用于单元格显示
const splitFirstLine = (text) => {
  return text ? text.split(/(?=\d+\.)/)[0] : text
}

const formatInfo = (text) => {
  return text ? text.replace(/(\d+\.)/g, '<br>$1').replace('<br>', '') : text
}
defineExpose({
  query
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

.more-and-buttons {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.more-text {
  font-weight: bold;
  color: #409eff; /* 蓝色字体 */
  cursor: pointer;
}

.buttons {
  display: flex;
  align-items: center;
}

.buttons .el-button {
  margin-left: 10px;
}

.buttons .el-button:first-child {
  margin-left: 0;
}

/* 单元格溢出省略 */
.custom-cell {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; /* 单行截断 */
}

/* Tooltip 多行展示 */
.el-tooltip__popper {
  line-height: 1.5;
  white-space: pre-line;
}

/* 自定义 Tooltip 换行样式 */
.custom-tooltip {
  max-width: 500px; /* 限制最大宽度 */
  line-height: 1.8;
  white-space: pre-line; /* 保留换行符 */
}
</style>
