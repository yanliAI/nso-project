<template>
  <el-tabs ref="myTab" v-model="data.activeTab" type="card" @tab-remove="removeTab" @tab-change="data.moreVisible = false" class="h-full w-full bg-white">
    <el-tab-pane label="全部记录" name="LIST" :closable="false">
      <el-container class="h-full bg-white">
        <el-header height="45px">
          <el-form label-width="80px" ref="faultReplayForm" :model="data.form" :inline="true" label-position="right" class="demo-form-inline">
            <el-row>
              <el-col :span="4">
                <el-form-item label="故障编号:" prop="faultCode">
                  <el-input v-model="data.form.faultCode" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="故障名称:" prop="faultInfo">
                  <el-input v-model="data.form.faultInfo" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="系统名称:" prop="faultSys" filterable>
                  <el-select v-model="data.form.faultSys" clearable>
                    <el-option v-for="item in dropList.NSOS_SYSTEM_INFO" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-popover :visible="data.moreVisible" placement="bottom" trigger="click" width="600px">
                  <template #reference>
                    <el-button type="primary" @click="data.moreVisible = !data.moreVisible" text style="margin-left: 10px; font-size: 12px">更多>></el-button>
                  </template>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="典型故障:" prop="isTipical" filterable>
                        <el-select v-model="data.form.isTipical" clearable>
                          <el-option v-for="item in dropList.NSOS_YES_OR_NO" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="系统等级:" prop="sysLevel" filterable>
                        <el-select v-model="data.form.sysLevel" clearable>
                          <el-option v-for="item in dropList.NSOS_SYS_LEVEL" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="运维单位:" prop="operateOrg" filterable>
                        <el-select v-model="data.form.operateOrg" clearable>
                          <el-option v-for="item in dropList.NSOS_OPERATE_ORG" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="影响范围:" prop="effectRange">
                        <el-input v-model="data.form.effectRange" clearable />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="事件级别:" prop="eventLevel" filterable>
                        <el-select v-model="data.form.eventLevel" clearable>
                          <el-option v-for="item in dropList.NSOS_EVENT_LEVEL" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="直接原因:" prop="directReason">
                        <el-input v-model="data.form.directReason" clearable />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="根本原因:" prop="radicallyReason">
                        <el-input v-model="data.form.radicallyReason" clearable />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="根因共性问题提炼:" prop="similarityProblem" filterable>
                        <el-select v-model="data.form.similarityProblem" clearable>
                          <el-option v-for="item in dropList.NSOS_SIMILARITY_PROBLEM" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-popover>
                <el-button type="primary" :icon="Search" @click="query()">查询</el-button>
                <el-button type="primary" :icon="Share" @click="toExcelClick()">导出</el-button>
                <el-button type="info" :icon="RefreshLeft" @click="reset">重置</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-header>
        <el-main style="height: calc(100% - 90px)">
          <el-table ref="faultReplayTable" :data="data.tableData" show-overflow-tooltip border size="small" style="height: 100%">
            <!-- <el-table-column type="selection" align="center" /> -->
            <el-table-column type="index" fixed label="序号" align="center" width="45" />
            <el-table-column v-if="props.replayStatus == 3" prop="isGL" label="关联故障库" width="80" align="center" fixed>
              <template #default="scope">
                <el-button link type="primary" size="small" v-if="scope.row.isGL === '否'" @click="addone(scope.row)">未关联</el-button>
                <span v-if="scope.row.isGL === '是'">已关联</span>
              </template>
            </el-table-column>
            <el-table-column prop="faultCode" fixed label="故障编号" align="center" width="120">
              <template #default="scope">
                <div @click="showDetail(scope.row)" class="clickable primary">
                  {{ scope.row.faultCode }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="faultInfo" label="故障名称" width="300" align="left" header-align="center"/>
            <el-table-column prop="replayStatus" label="故障状态" column-key="NSOS_FAULT_STATUS_FP" :formatter="formatDrop" align="center" width="70" />
            <el-table-column prop="faultType" label="故障类别" column-key="NSOS_FAULT_TYPE" :formatter="formatDrop" align="center" width="100" />
            <el-table-column prop="problemSource" label="问题来源" column-key="NSOS_PROBLEM_SOURCE" :formatter="formatDrop" align="center" width="100" />
            <el-table-column prop="faultSys" label="故障系统" column-key="NSOS_SYSTEM_INFO" :formatter="formatDrop" align="center" width="180" />
            <el-table-column prop="effectRange" label="故障影响范围及程度" align="left" header-align="center" width="250" />
            <el-table-column prop="isTipical" label="是否典型故障" column-key="NSOS_YES_OR_NO" :formatter="formatDrop" align="center" width="90" />
            <el-table-column prop="sysLevel" label="故障系统/设备级别" column-key="NSOS_SYS_LEVEL" :formatter="formatDrop" align="center" width="150" />
            <!-- <el-table-column prop="operateSchema" label="运维模式" column-key="NSOS_OPERATE_SCHEMA" :formatter="formatDrop" align="center" width="150" /> -->
            <el-table-column prop="operateOrg" label="运维单位" align="center" width="150" />
            <el-table-column prop="eventLevel" label="事件级别" column-key="NSOS_EVENT_LEVEL" :formatter="formatDrop" align="center" width="90" />
            <el-table-column label="故障持续时间" align="center" width="100">
              <template #default="scope">
                <span class="text-[red]">{{ getHoursDifference(scope.row.faultOccurTime, scope.row.faultRestoreTime) }} 小时</span>
              </template>
            </el-table-column>
            <el-table-column prop="directReason" label="直接原因" align="left" header-align="center" width="250" />
            <el-table-column prop="radicallyReason" label="根本原因" align="left" header-align="center" width="250" />
            <el-table-column prop="similarityProblem" label="根因共性问题提炼" column-key="NSOS_SIMILARITY_PROBLEM" :formatter="formatDrop" align="center" width="200" />
          </el-table>
        </el-main>
        <el-footer height="45px">
          <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" class="mt-1" :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="currentChange"></el-pagination>
        </el-footer>
      </el-container>
    </el-tab-pane>
    <el-tab-pane v-for="item in data.tabArr" :key="item.name" :label="item.title" :name="item.name" closable>
      <component :is="item.comp" :faultId="item.faultId" :tabName="item.name" @refreshList="emit('refresh')" @close="removeTab(item.name)" />
    </el-tab-pane>
  </el-tabs>
</template>
<script setup>
import { ElTable, ElTableColumn, ElFormItem, ElForm, ElInput, ElButton, ElPagination, ElMessage, ElMessageBox, ElRow, ElCol, ElMain, ElContainer, ElHeader, ElFooter, ElTabs, ElTabPane, ElPopover } from 'element-plus'
import { reactive, ref, onMounted, computed } from 'vue'
import { requestClient } from '#/api/request'
import { useDropStore } from '#/store'
import { formatDrop, getHoursDifference } from '#/utils/commonUtil.ts'
import faultReplayDetail from '../faultReplayDetail/index.vue'
import { Search, RefreshLeft, Share } from '@element-plus/icons-vue'
import { downloadFile } from '#/utils/download.ts'

const props = defineProps({
  replayStatus: {
    type: Number,
    default: 2
  }
})
const emit = defineEmits(['amount', 'refresh'])

const dropList = reactive({})
onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = ['NSOS_FAULT_STATUS_FP', 'NSOS_SYSTEM_INFO', 'NSOS_SYS_LEVEL', 'NSOS_FAULT_TYPE','NSOS_PROBLEM_SOURCE','NSOS_OPERATE_SCHEMA', 'NSOS_OPERATE_ORG', 'NSOS_YES_OR_NO', 'NSOS_EVENT_LEVEL', 'NSOS_SIMILARITY_PROBLEM']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)
})
const faultReplayTable = ref()
const faultReplayForm = ref()

const data = reactive({
  tableData: [],
  form: {},
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0
  },
  activeTab: 'LIST',
  tabArr: [],
  moreVisible: false
})

async function getFlowTableApi(params, showmask) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/vImFaultReviewInfo/query', params, { showmask: showmask })
}
const query1 = async (showmask) => {
  data.form.replayStatus = props.replayStatus
  data.form.pageSize = data.pageInfo.pageSize
  data.form.pageNo = data.pageInfo.pageNo
  const { list, pageNo, count } = await getFlowTableApi(data.form, showmask)
  data.tableData = list
  data.pageInfo.pageNo = pageNo
  data.pageInfo.total = count
  if (props.replayStatus === 2) {
    emit('amount', 'FPZ', data.pageInfo.total)
  } else if (props.replayStatus === 3) {
    emit('amount', 'YFP', data.pageInfo.total)
  }
}


async function getFpFlowTableApi(params, showmask) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/typicalFault/fpQueryDataListByPagePagination', params, { showmask: showmask })
}
const query = async (showmask) => {
  data.form.replayStatus = props.replayStatus
  data.form.pageSize = data.pageInfo.pageSize
  data.form.pageNo = data.pageInfo.pageNo
  const { list, pageNo, count } = await getFpFlowTableApi(data.form, showmask)
  data.tableData = list
  data.pageInfo.pageNo = pageNo
  data.pageInfo.total = count
  if (props.replayStatus === 2) {
    emit('amount', 'FPZ', data.pageInfo.total)
  } else if (props.replayStatus === 3) {
    emit('amount', 'YFP', data.pageInfo.total)
  }
}

const addone = async (row) => {
  try {
    const selectedRows = ref([])
    selectedRows.value.push(row)
    await requestClient.post(import.meta.env.VITE_NSOSGZ + '/typicalFault/add', selectedRows.value)
    selectedRows.value = []
    ElMessage.success('添加成功！')
  }  catch (error) {
    console.error('添加失败！:', error)
  }finally{
    query()
  }
}



const reset = () => {
  data.form = {
    replayStatus: props.replayStatus
  }
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
const toExcelClick = () => {
  data.form.replayStatus = props.replayStatus
  downloadFile(import.meta.env.VITE_NSOSGZ + '/vImFaultReviewInfo/toExcel', data.form)
}
defineExpose({
  query
})

const showDetail = (row) => {
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
    tab.comp = faultReplayDetail
    tabArr.push(tab)
  }
  data.activeTab = tab.name
}

const removeTab = (targetName) => {
  let tabArr = data.tabArr
  let tab

  let tabIndex = data.activeTab
  if (tabIndex === targetName) {
    tabIndex = 'LIST'
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
  data.activeTab = tabIndex
  for (var i = 0; i < tabArr.length; i++) {
    if (tabArr[i].name == targetName) {
      tabArr.splice(i, 1)
      break
    }
  }
}
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

:deep(.el-form-item__label) {
  align-items: center;
  line-height: normal;
  text-align: right;
}

:deep(.el-form-item) {
  width: calc(100% - 20px);
  margin-right: 20px;
  margin-bottom: 12px;
}

:deep(.el-form--inline .el-form-item) {
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
