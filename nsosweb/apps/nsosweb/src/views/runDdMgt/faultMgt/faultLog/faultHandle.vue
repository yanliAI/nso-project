<template>
  <el-tabs ref="myTab" v-model="data.tabIndex" type="card" @tab-remove="removeTab" @tab-change="tabChange" class="w-full h-full bg-white">
    <el-tab-pane label="当值全部记录" name="list" :closable="false">
      <el-container class="h-full bg-white">
        <el-header height="54px">
          <el-form label-width="auto" ref="faultHandleForm" :model="data.form" :inline="true" label-position="right" class="demo-form-inline pt-[9px]">
            <el-row>
              <el-col :span="3">
                <el-form-item label="故障编号:" prop="faultCode">
                  <el-input v-model="data.form.faultCode" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="故障名称:" prop="faultInfo">
                  <el-input v-model="data.form.faultInfo" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="系统名称:" prop="faultSys" filterable>
                  <el-select v-model="data.form.faultSys" clearable>
                    <el-option v-for="item in dropList.NSOS_SYSTEM_INFO" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="发生时间:" prop="faultOccurTime">
                  <el-date-picker v-model="data.form.faultOccurTime" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" clearable />
                </el-form-item>
              </el-col>
              <!-- <el-col :span="4">
                <el-form-item label="处置状态:" prop="faultStatus" filterable>
                  <el-select v-model="data.form.faultStatus" clearable>
                    <el-option v-for="item in faultStatusFilterList" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col> -->
              <el-col :span="9">
                <el-popover :visible="data.moreVisible" placement="bottom" trigger="click" width="600px">
                  <template #reference>
                    <el-button type="primary" @click="data.moreVisible = !data.moreVisible" text style="margin-left: 10px; font-size: 12px">更多>></el-button>
                  </template>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="系统等级:" prop="sysLevel" filterable>
                        <el-select v-model="data.form.sysLevel" clearable>
                          <el-option v-for="item in dropList.NSOS_SYS_LEVEL" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="运维单位:" prop="operateOrg" filterable>
                        <el-select v-model="data.form.operateOrg" clearable>
                          <el-option v-for="item in dropList.NSOS_OPERATE_ORG" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="设备主人:" prop="deviceOwner">
                        <el-input v-model="data.form.deviceOwner" clearable />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="影响范围:" prop="effectRange">
                        <el-input v-model="data.form.effectRange" clearable />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="故障类别:" prop="faultType" filterable>
                        <el-select v-model="data.form.faultType" clearable>
                          <el-option v-for="item in dropList.NSOS_FAULT_TYPE" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="问题来源:" prop="problemSource" filterable>
                        <el-select v-model="data.form.problemSource" clearable>
                          <el-option v-for="item in dropList.NSOS_PROBLEM_SOURCE" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-popover>
                <el-button type="primary" :icon="Search" @click="query()">查询</el-button>
                <el-button type="primary" v-if="queryState == '1'" :icon="Plus" @click="add">新增</el-button>
                <el-button type="primary" :icon="Share" @click="toExcelClick()">导出</el-button>
                <el-button type="primary" v-if="queryState == '1'" :icon="Delete" @click="del">删除</el-button>
                <el-button type="info" :icon="RefreshLeft" @click="reset">重置</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-header>
        <el-main style="height: calc(100% - 99px)">
          <el-table ref="faultHandleTable" :data="data.tableData" show-overflow-tooltip border size="small" style="height: 100%">
            <el-table-column type="selection" align="center" fixed width="40" />
            <el-table-column type="index" label="序号" align="center" fixed width="50" />
            <el-table-column prop="faultCode" label="故障编号" align="center" fixed width="140">
              <template #default="scope">
                <div @click="showDetail(scope.row)" class="clickable primary">
                  {{ scope.row.faultCode }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="faultInfo" label="故障名称" align="left" width="400" header-align="center" />
            <el-table-column prop="faultType" label="故障类别" column-key="NSOS_FAULT_TYPE" :formatter="formatDrop" align="center" width="100" />
            <el-table-column prop="faultStatus" label="故障状态" column-key="NSOS_FAULT_STATUS" :formatter="formatDrop" align="center" width="100" />
            <el-table-column prop="problemSource" label="问题来源" column-key="NSOS_PROBLEM_SOURCE" :formatter="formatDrop" align="center" width="100" />
            <el-table-column prop="labelDesc" label="标签" align="center" width="100">
              <template #default="scope">
                <div @click="editLabel(scope.row)" class="clickable primary" style="display: flex; justify-content: center">
                  <span v-if="scope.row.labelDesc">{{ scope.row.labelDesc }}</span>
                  <Edit v-else class="primary" style="width: 20px; height: 20px" />
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="faultSys" label="系统名称" column-key="NSOS_SYSTEM_INFO" :formatter="formatDrop" align="center" width="200" />
            <el-table-column prop="sysLevel" label="系统等级" align="center" width="150" />
            <!-- <el-table-column prop="operateSchema" label="运维模式" column-key="NSOS_OPERATE_SCHEMA" :formatter="formatDrop" align="center" width="90" /> -->
            <el-table-column prop="operateOrg" label="运维单位" align="center" width="120" />
            <el-table-column prop="deviceOwnerName" label="设备主人" align="center" width="90" />
            <el-table-column prop="deviceMasterPhone" label="联系方式" align="center" width="90" />
            <el-table-column label="故障发生时间" prop="faultOccurTime" :formatter="tDateTimeFormat" align="center" width="140" />
            <el-table-column label="故障恢复时间" prop="faultRestoreTime" :formatter="tDateTimeFormat" align="center" width="140" />
            <el-table-column label="故障持续时间" align="center" width="100">
              <template #default="scope">
                <span class="text-[red]">{{ getHoursDifference(scope.row.faultOccurTime, scope.row.faultRestoreTime ? scope.row.faultRestoreTime : new Date()) }} 小时</span>
              </template>
            </el-table-column>
            <el-table-column prop="effectRange" label="故障影响范围及程度" align="left" width="400" header-align="center" />
          </el-table>
        </el-main>
        <el-footer height="45px">
          <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" class="mt-1" :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="currentChange"></el-pagination>
        </el-footer>
      </el-container>
    </el-tab-pane>
    <el-tab-pane v-for="item in data.tabArr" :key="item.name" :label="item.title" :name="item.name" closable>
      <FaultDetail ref="faultDetailRef" :faultId="item.faultId" :tabName="item.name" @afterAdd="afterAdd($event, item)" @refreshList="refreshList" @removeTab="removeTab"></FaultDetail>
    </el-tab-pane>
    <el-dialog v-model="data.labelVisible" title="标签填报" width="30%" center>
      <LabelEdit :labelDesc="data.labelDesc" :showBtn="queryState" @labelCancel="data.labelVisible = false" @labelConfirm="labelConfirm"></LabelEdit>
    </el-dialog>
  </el-tabs>
</template>
<script setup>
import { Page } from '@vben/common-ui'
import { ElTable, ElTableColumn, ElFormItem, ElForm, ElInput, ElButton, ElPagination, ElMessage, ElMessageBox, ElDialog, ElRow, ElCol, ElMain, ElContainer, ElHeader, ElFooter, ElTabs, ElTabPane, ElPopover } from 'element-plus'
import { reactive, ref, onMounted, computed, nextTick } from 'vue'
import { requestClient } from '#/api/request'
import { useDropStore } from '#/store'
import FaultDetail from '../faultLogDetail/index.vue'
import LabelEdit from '/src/views/basic/common/labelEdit.vue'
import { Edit, Search, Delete, RefreshLeft, Plus, Share } from '@element-plus/icons-vue'
import { tDateTimeFormat, formatDrop, getHoursDifference } from '#/utils/commonUtil.ts'
import { downloadFile } from '#/utils/download.ts'

const dropList = reactive({})
const faultStatusFilterList = computed(() => {
  return dropList.NSOS_FAULT_STATUS?.filter((option) => option.value !== '3')
})
const queryState = defineModel('queryState')
const emit = defineEmits(['updateTatol', 'refreshList'])
onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = ['NSOS_FAULT_STATUS', 'NSOS_SYS_NAME', 'NSOS_PROBLEM_SOURCE', 'NSOS_SYSTEM_INFO', 'NSOS_SYS_LEVEL', 'NSOS_OPERATE_SCHEMA', 'NSOS_FAULT_TYPE', 'NSOS_OPERATE_ORG', 'NSOS_DISPATCH_PERSON']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)
  query()
  console.log(queryState.value);
  
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
  },
  tabIndex: 'list',
  tabArr: [],
  editRow: {},
  labelVisible: false,
  labelDesc: '',
  handleCode: '',
  moreVisible: false
})

async function getFlowTableApi(params, showmask) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/info/query', params, { showmask: showmask })
}

async function batchDeleteApi(params) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/info/batchDelete', params)
}
const refreshList = (showmask) => {
  emit('refreshList', showmask)
}
const query = async (showmask) => {
  if (queryState && queryState.value) {
    data.form.faultStatus = queryState.value
    if (queryState.value == '2') {
      data.form.replayStatus = '2'
    }
  }
  data.form.startFaultOccurTime = data.form.faultOccurTime?.[0]
  data.form.endFaultOccurTime = data.form.faultOccurTime?.[1]
  data.form.pageSize = data.pageInfo.pageSize
  data.form.pageNo = data.pageInfo.pageNo
  const { list, pageNo, count } = await getFlowTableApi(data.form, showmask)
  data.tableData = list
  data.pageInfo.pageNo = pageNo
  data.pageInfo.total = count

  emit('updateTatol', queryState.value, count)
}

const del = () => {
  if (faultHandleTable.value.getSelectionRows().length === 0) {
    ElMessage.warning('请先选择要删除的故障单')
    return
  }
  ElMessageBox.confirm('确定要删除选中的故障单吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      batchDel()
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}

const batchDel = async () => {
  try {
    await batchDeleteApi(faultHandleTable.value.getSelectionRows())
    query()
    ElMessage.success('删除成功')
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

const reset = () => {
  data.form = {}
  query()
}

const handleSizeChange = (val) => {
  data.pageInfo.pageSize = val
  query()
}

const currentChange = (val) => {
  data.pageInfo.pageNo = val
  query()
}

const add = () => {
  showDetail(null)
}

const showDetail = (row) => {
  data.moreVisible = false
  let tabArr = data.tabArr
  let tab
  if (row) {
    tabArr.some((item) => {
      if (item.faultId == row.id) {
        tab = item
        return true
      }
    })
  }

  if (!tab) {
    tab = {}
    tab.name = new Date().getTime() + ''
    if (row) {
      // 已保存工单tab信息
      tab.title = row.faultCode ? row.faultCode : '未编号'
      tab.faultId = row.id
    } else {
      // 新增工单tab信息
      tab.title = '新增'
      tab.faultId = null
    }
    tabArr.push(tab)
  }
  data.tabIndex = tab.name
}
const afterAdd = (row, tabPane) => {
  tabPane.faultId = row.id
  tabPane.title = row.faultCode

  // 更新头部信息
  data.tabArr.some((item) => {
    if (item.name === tabPane.name) {
      item.title = tabPane.title
      return true
    }
  })
  query(false)
}
const removeTab = (targetName) => {
  let tabArr = data.tabArr
  let tab

  let tabIndex = data.tabIndex
  if (tabIndex === targetName) {
    tabIndex = 'list'
    let nextTab
    tabArr.forEach(function (tab, index) {
      if (tab.name === targetName) {
        nextTab = tabArr[index + 1] || tabArr[index - 1]
        if (nextTab) {
          tabIndex = nextTab.name
        }
      }
    })
  }
  data.tabIndex = tabIndex
  for (var i = 0; i < tabArr.length; i++) {
    if (tabArr[i].name == targetName) {
      tabArr.splice(i, 1)
      break
    }
  }
}

const editLabel = (row) => {
  data.editRow = row
  data.labelDesc = row.labelDesc
  data.labelVisible = true
}

const labelConfirm = async (newLabel) => {
  data.editRow.labelDesc = newLabel
  await saveDataApi(data.editRow)
  data.labelVisible = false
}

async function saveDataApi(row) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/info/save', row)
}
const tabChange = () => {
  data.moreVisible = false
}

const showDetailForWorkbench = (row) => {
  nextTick().then(() => {
    showDetail(row)
  })
}
const toExcelClick = () => {
  if (queryState && queryState.value) {
    data.form.faultStatus = queryState.value
    if (queryState.value == '2') {
      data.form.replayStatus = '2'
    }
  }
  data.form.startFaultOccurTime = data.form.faultOccurTime?.[0]
  data.form.endFaultOccurTime = data.form.faultOccurTime?.[1]

  downloadFile(import.meta.env.VITE_NSOSGZ + '/info/toExcel', data.form)
}
defineExpose({ query, showDetailForWorkbench })
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
