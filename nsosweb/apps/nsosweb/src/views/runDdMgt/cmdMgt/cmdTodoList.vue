<template>
  <div class="w-full h-full">
    <el-tabs ref="myTab" v-model="data.tabIndex" @tab-remove="removeTab" type="card" @tab-change="tabChange" class="w-full h-full bg-white">
      <el-tab-pane label="全部记录" name="list" :closable="false">
        <el-container class="h-full bg-white">
          <el-header height="35px">
            <el-form label-width="70px" ref="ruleFormRef" :model="data.formData" size="small" :inline="true" label-position="right" class="demo-form-inline mt-1">
              <el-row>
                <el-col :span="4">
                  <el-form-item label="编号:" prop="commandCode">
                    <el-input v-model="data.formData.commandCode" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="名称:" prop="commandTitle">
                    <el-input v-model="data.formData.commandTitle" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="类型:" filterable>
                    <el-select v-model="cmdLx" clearable>
                      <el-option v-for="item in dropList.NSOS_CMD_FL" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="类别:" filterable>
                    <el-select v-model="data.formData.commandType" filterable clearable>
                      <el-option v-for="item in data.cmdLbDrop" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8" class="">
                  <el-button type="primary" class="ml-4" :icon="Search" @click="query(null)">查询</el-button>
                  <el-button type="info" plain class="ml-4" :icon="RefreshLeft" @click="refreshClick">重置</el-button>
                </el-col>
              </el-row>
            </el-form>
          </el-header>
          <el-main style="height: calc(100% - 75px)">
            <el-table :data="data.tableData" border show-overflow-tooltip size="small" style="height: 100%" stripe>
              <el-table-column type="index" fixed width="40" label="#" align="center" />
              <el-table-column label="编号" fixed width="200" align="center">
                <template #default="scope">
                  <span class="primary cmdcode" @click="showDetail(scope.row, true)">{{ scope.row.commandCode }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="commandFl" column-key="NSOS_CMD_FL" :formatter="formatDrop" label="类型" width="100" align="center" />
              <el-table-column prop="commandType" column-key="NSOS_CMD_TYPE" :formatter="formatDrop" label="类别" width="140" align="center" />
              <el-table-column prop="commandTitle" label="名称" align="left" header-align="center" />
              <el-table-column prop="wcTime" label="完成时限" :formatter="tDateTimeFormat" width="150" align="center" />
              <el-table-column v-if="queryState == '3'" header-align="center" width="90" label="是否超时签收" align="center">
                <template #default="scope">
                  <span v-if="data.serverTime - scope.row.flTime > findCsLimit(scope.row.commandType, scope.row.commandStatus)" class="text-red-600">是</span>
                  <span v-else>否</span>
                </template>
              </el-table-column>
              <el-table-column v-if="queryState == '4'" header-align="center" width="90" label="是否超时复令" align="center">
                <template #default="scope">
                  <span v-if="data.serverTime > scope.row.wcTime" class="text-red-600">是</span>
                  <span v-else>否</span>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="nodeName" label="当前环节" width="120" align="center"/> -->
              <el-table-column prop="commander" label="发令人" column-key="NSOS_USER_NAME" :formatter="formatDrop" width="100" align="center" />
              <el-table-column prop="flDept" label="发令单位" column-key="NSOS_ORG_NAME" :formatter="formatDrop" width="140" align="center" />
              <el-table-column prop="flTime" label="发令时间" :formatter="tDateTimeFormat" width="130" align="center" />
              <el-table-column label="流程跟踪" width="75" align="center">
                <template #default="scope">
                  <el-tooltip content="流程跟踪" placement="bottom" effect="light">
                    <Operation v-if="scope.row.processInsId" class="abgh text-red-600 cursor-pointer primary m-auto" @click="lookFlow(scope.row.processId, scope.row.processInsId)" style="width: 18px; height: 18px" />
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
          <ElFooter height="40px">
            <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" class="mt-1" :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="currentChange"></el-pagination>
          </ElFooter>
        </el-container>
      </el-tab-pane>
      <el-tab-pane v-for="item in data.tabArr" :key="item.name" :label="item.title" :name="item.name" closable>
        <CmdDetail :cmdId="item.id" :oprateFlow="item.oprateFlow" :oprateFlowStatus="queryState" :tabName="item.name" @afterAdd="afterAdd($event, item)" @refreshList="refreshList" @removeTab="removeTab"></CmdDetail>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import { Page } from '@vben/common-ui'
import { onMounted, reactive, ref, watch, nextTick } from 'vue'
import { ElForm, ElFormItem, ElRow, ElCol, ElTable, ElTableColumn, ElPagination, ElMain, ElContainer, ElHeader, ElFooter, ElTabs, ElTabPane } from 'element-plus'
import { Search, RefreshLeft, Plus, Download, Operation } from '@element-plus/icons-vue'
import { tDateFormat, tDateTimeFormat, formatDrop, lookFlow, getHoursDifference } from '#/utils/commonUtil.ts'
import { useDropStore } from '#/store'
import { queryTodoList, toExcel } from './cmdMgtMethod.ts'
import CmdDetail from './cmdDetail.vue'

const emit = defineEmits(['refreshList', 'updateTatol'])
const queryState = defineModel('queryState')
const cmdLx = ref()
const data = reactive({
  tabIndex: 'list',
  tabArr: [],
  tableData: [],
  formData: {},
  cmdLbDrop: [],
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0
  },
  csRulesList: [],
  serverTime: null
})
const dropList = reactive({})
onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = ['NSOS_COMMAND_STATE_SL', 'NSOS_ORG_NAME', 'NSOS_USER_NAME', 'NSOS_CMD_TYPE', 'NSOS_NOTICE_TYPE', 'NSOS_CMD_FL']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)
  query()
})

const query = async (showmask) => {
  data.formData.pageSize = data.pageInfo.pageSize
  data.formData.pageNo = data.pageInfo.pageNo
  data.formData.commandFl = cmdLx.value
  if (queryState && queryState.value) {
    data.formData.commandStatus = queryState.value
  }
  const { list, count, pageNo, serverTime, csRulesList } = await queryTodoList(data.formData, { showmask: showmask })
  data.tableData = list
  data.pageInfo.pageNo = pageNo
  data.pageInfo.total = count
  data.serverTime = serverTime
  data.csRulesList = csRulesList
  console.log(data.csRulesList)
  emit('updateTatol', queryState.value, count)
  formatEntity()
  refreshCmdType()
}
const refreshCmdType = async () => {
  const dropStore = useDropStore()
  const dropType = ['NSOS_CMD_TYPE']
  await dropStore.refreshDrops(dropType)
  dropStore.get(dropList, dropType)
}
const formatEntity = () => {
  if (!data.tableData) return
  data.tableData.forEach((r) => {
    let sldw = eval(r.slDept)
    let l = ''
    if (sldw && sldw.length > 0) {
      sldw.forEach((d) => {
        dropList.NSOS_ORG_NAME.forEach((o) => {
          if (d == o.value) {
            l += o.label + '；'
          }
        })
      })
    }
    r.slDept = l
  })
}
watch(cmdLx, (newval) => {
  data.cmdLbDrop = dropList.NSOS_CMD_TYPE?.filter((option) => option.filter === newval)
})
const refreshClick = () => {
  data.formData = {}
  cmdLx.value = null
}
const findCsLimit = (commandType, commandStatus) => {
  if (data.csRulesList) {
    let csList = data.csRulesList.filter((c) => c.commandTypeCode == commandType && c.commandState == commandStatus)
    if (csList && csList.length > 0) {
      return csList[0].timeoutLimit ? csList[0].timeoutLimit*60*60*1000 : 2*60*60*1000
    }
  }
  return 2*60*60*1000
}
const toExcelClick = async () => {
  data.formData.pageSize = data.pageInfo.pageSize
  data.formData.pageNo = data.pageInfo.pageNo
  toExcel(data.formData, '指令管理导出excel.xlsx')
}
const refreshList = (showmask) => {
  // query(showmask)
  emit('refreshList', showmask)
}
const showDetail = (row, oprateFlow) => {
  let tabArr = data.tabArr
  let tab
  if (row) {
    tabArr.some((item) => {
      if (item.id == row.id) {
        tab = item
        return true
      }
    })
  }

  if (!tab) {
    tab = {}
    tab.name = new Date().getTime() + ''
    tab.oprateFlow = oprateFlow
    if (row) {
      // 已保存工单tab信息
      tab.title = row.commandCode ? row.commandCode : '未编号'
      tab.id = row.id
    } else {
      // 新增工单tab信息
      tab.title = '新增指令'
      tab.id = null
    }
    tabArr.push(tab)
  }
  data.tabIndex = tab.name
}
const afterAdd = (row, tabPane) => {
  tabPane.id = row.id
  tabPane.title = row.commandCode

  // 更新头部信息
  data.tabArr.some((item) => {
    if (item.name === tabPane.name) {
      item.title = tabPane.title
      return true
    }
  })
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
const handleSizeChange = (val) => {
  data.pageInfo.pageSize = val
  query()
}
const currentChange = (val) => {
  data.pageInfo.pageNo = val
  query()
}
const showDetailForWorkbench = (row) => {
  nextTick().then(() => {
    showDetail(row, row.oprateFlow === 'true' ? true : false)
  })
}
defineExpose({
  query,
  showDetailForWorkbench
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
  margin-bottom: 12px;
}

:deep(.el-main) {
  padding: 0;
}

:deep(.el-tabs) {
  --el-tabs-header-height: 30px;
}

:deep(.el-tabs__item) {
  font-size: 12px;
}

:deep(.el-tabs__header) {
  margin-bottom: 4px;
}

.primary {
  color: hsl(var(--primary));
}

.cmdcode {
  cursor: pointer;
}

.cmdcode:hover {
  text-decoration: underline;
}
</style>
