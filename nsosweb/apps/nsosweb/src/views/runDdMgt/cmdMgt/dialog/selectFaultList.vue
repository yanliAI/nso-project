<template>
  <el-container class="h-full bg-white">
    <el-header height="54px">
      <el-form label-width="auto" ref="faultHandleForm" :model="data.form" :inline="true" label-position="right" class="demo-form-inline pt-[9px]">
        <el-row>
          <el-col :span="5">
            <el-form-item label="故障编号:" prop="faultCode">
              <el-input v-model="data.form.faultCode" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="故障名称:" prop="faultInfo">
              <el-input v-model="data.form.faultInfo" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="系统名称:" prop="faultSys" filterable>
              <el-select v-model="data.form.faultSys" clearable>
                <el-option v-for="item in dropList.NSOS_SYSTEM_INFO" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-popover :visible="data.moreVisible" placement="bottom" trigger="click" width="600px">
              <template #reference>
                <el-button type="primary" @click="data.moreVisible = !data.moreVisible" text style="margin-left: 10px; font-size: 12px">更多>></el-button>
              </template>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="发生时间:" prop="faultOccurTime">
                    <el-date-picker v-model="data.form.faultOccurTime" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" clearable />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="设备主人:" prop="deviceOwner">
                    <el-input v-model="data.form.deviceOwner" clearable />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-popover>
            <el-button type="primary" :icon="Search" @click="query()">查询</el-button>
            <el-button type="info" :icon="RefreshLeft" @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-main style="height: calc(100% - 99px)">
      <el-table ref="faultHandleTable" :data="data.tableData" show-overflow-tooltip border size="small" style="height: 100%">
        <el-table-column type="index" label="序号" align="center" fixed width="50" />
        <el-table-column prop="faultCode" label="故障编号" align="center" fixed width="140">
          <template #default="scope">
            <div class="clickable primary">
              {{ scope.row.faultCode }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="faultInfo" label="故障名称" align="left" header-align="center" />
        <el-table-column prop="faultStatus" label="故障类别" column-key="NSOS_FAULT_TYPE" :formatter="formatDrop" align="center" width="100" />
        <el-table-column prop="faultSys" label="系统名称" column-key="NSOS_SYSTEM_INFO" :formatter="formatDrop" align="center" width="200" />
        <el-table-column prop="deviceOwner" label="设备主人" align="center" width="90" />
        <el-table-column label="故障发生时间" prop="faultOccurTime" :formatter="tDateTimeFormat" align="center" width="140" />
        <el-table-column label="操作" width="50" align="center">
          <template #default="scope">
            <div class="clickable primary" @click="linkClick(scope.row.faultCode)">关联</div>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer height="45px">
      <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" class="mt-1" :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="currentChange"></el-pagination>
    </el-footer>
  </el-container>
</template>
<script setup>
import { Page } from '@vben/common-ui'
import { ElTable, ElTableColumn, ElFormItem, ElForm, ElInput, ElButton, ElPagination, ElMessage, ElMessageBox, ElDialog, ElRow, ElCol, ElMain, ElContainer, ElHeader, ElFooter, ElTabs, ElTabPane, ElPopover } from 'element-plus'
import { reactive, ref, onMounted, computed, nextTick } from 'vue'
import { requestClient } from '#/api/request'
import { useDropStore } from '#/store'
import { Edit, Search, Delete, RefreshLeft, Plus, Share } from '@element-plus/icons-vue'
import { tDateTimeFormat, formatDrop } from '#/utils/commonUtil.ts'
import { downloadFile } from '#/utils/download.ts'

const dropList = reactive({})
const faultStatusFilterList = computed(() => {
  return dropList.NSOS_FAULT_STATUS?.filter((option) => option.value !== '3')
})
const emit = defineEmits([])
onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = ['NSOS_FAULT_STATUS', 'NSOS_SYS_NAME', 'NSOS_SYSTEM_INFO', 'NSOS_SYS_LEVEL', 'NSOS_OPERATE_SCHEMA', 'NSOS_FAULT_TYPE', 'NSOS_OPERATE_ORG', 'NSOS_DISPATCH_PERSON']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)
  query()
})
const faultHandleTable = ref()
const faultHandleForm = ref()

const data = reactive({
  tableData: [],
  form: {},
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0
  }
})

const refreshList = (showmask) => {
  emit('refreshList', showmask)
}
const query = async (showmask) => {
  data.form.faultStatus = '1'

  data.form.startFaultOccurTime = data.form.faultOccurTime?.[0]
  data.form.endFaultOccurTime = data.form.faultOccurTime?.[1]
  data.form.pageSize = data.pageInfo.pageSize
  data.form.pageNo = data.pageInfo.pageNo
  const { list, pageNo, count } = await getFlowTableApi(data.form, showmask)
  data.tableData = list
  data.pageInfo.pageNo = pageNo
  data.pageInfo.total = count
}

const reset = () => {
  data.form = {}
  query()
}
async function getFlowTableApi(params, showmask) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/info/query', params, { showmask: showmask })
}
const handleSizeChange = (val) => {
  data.pageInfo.pageSize = val
  query()
}
const linkClick = (faultCode) => {
  emit('afterLinkFault', faultCode)
}
const currentChange = (val) => {
  data.pageInfo.pageNo = val
  query()
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
