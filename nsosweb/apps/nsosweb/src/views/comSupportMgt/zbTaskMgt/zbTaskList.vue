<template>
  <Page auto-content-height>
    <div class="w-full h-full">
      <el-tabs ref="myTab" v-model="data.tabIndex" @tab-remove="removeTab" type="card" class="w-full h-full bg-white demo-tabs">
        <el-tab-pane label="工单列表" name="list" :icon="Tickets" :closable="false">
          <el-container class="h-full bg-white">
            <el-header height="53px">
              <el-form label-width="100px" ref="ruleFormRef" :model="data.formData" :inline="true" label-position="right" class="demo-form-inline mt-[10px]">
                <el-row>
                  <el-col :span="4">
                    <el-form-item label="保障单号:" prop="guaranteeNo">
                      <el-input v-model="data.formData.guaranteeNo" clearable />
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="保障任务名称:" prop="guaranteeTitle">
                      <el-input v-model="data.formData.guaranteeTitle" clearable />
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="状态:" prop="sheetType">
                      <el-select v-model="data.formData.guaranteeStatus" filterable clearable>
                        <el-option v-for="item in orderStatus" :key="item.value" :label="item.label" :value="item.value" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-popover :visible="data.moreVisible" placement="bottom" trigger="click" width="600px">
                      <template #reference>
                        <el-button type="primary" @click="data.moreVisible = !data.moreVisible" text style="margin-left: 10px; font-size: 12px">更多>></el-button>
                      </template>
                      <el-row>
                        <el-col :span="24">
                          <el-form-item label="保障开始时间:" filterable>
                            <el-date-picker v-model="data.formData.gtsTime" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" start-placeholder="开始时间" end-placeholder="结束时间" />
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-popover>
                    <el-button type="primary" class="ml-4" :icon="Search" @click="query(null)">查询</el-button>
                    <el-button type="primary" :icon="Share" @click="toExcelClick()">导出</el-button>
                    <el-button type="primary" :icon="Plus" @click="add">新增</el-button>
                    <!-- <el-button type="primary" :icon="Delete" @click="del">删除</el-button> -->
                    <el-button type="info" plain class="ml-4" :icon="RefreshLeft" @click="refreshClick">重置</el-button>
                  </el-col>
                </el-row>
              </el-form>
            </el-header>
            <el-main style="height: calc(100% - 93px)">
              <el-table ref="tableDataRef" :data="data.tableData" border show-overflow-tooltip style="height: 100%" stripe>
                <el-table-column type="selection" align="center" fixed width="40" />
                <el-table-column type="index" fixed width="45" label="#" align="center" />
                <el-table-column label="工单号" fixed width="180" align="center">
                  <template #default="scope">
                    <span class="primary cmdcode" @click="showDetail(scope.row)">{{ scope.row.guaranteeNo }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="guaranteeTitle" label="保障任务名称" width="200" align="left" header-align="center" />
                <el-table-column prop="guaranteeStartTime" label="保障开始时间" :formatter="tDateTimeFormat" width="160" align="center" />
                <el-table-column prop="guaranteeEndTime" label="保障结束时间" :formatter="tDateTimeFormat" width="160" align="center" />
                <el-table-column prop="guaranteeStatus" label="工单状态" align="center" width="150">
                  <template #default="scope">
                    {{ orderStatus.filter((d) => d.value == scope.row.guaranteeStatus)[0]?.label }}
                  </template>
                </el-table-column>
                <el-table-column prop="coreTime" label="核心保障时段" align="left" header-align="center" />
                <el-table-column prop="creatorName" label="创建人" width="150" align="center" />
                <el-table-column prop="createTime" label="创建时间" :formatter="tDateTimeFormat" width="160" align="center" />
              </el-table>
            </el-main>
            <ElFooter height="40px">
              <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" class="mt-1" :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="currentChange"></el-pagination>
            </ElFooter>
          </el-container>
        </el-tab-pane>
        <el-tab-pane v-for="item in data.tabArr" :key="item.name" :label="item.title" :name="item.name" closable>
          <ZbTaskDetail :orderId="item.faultId" :tabName="item.name" @refreshList="query" @afterAdd="afterAdd($event, item)" @removeTab="removeTab"></ZbTaskDetail>
        </el-tab-pane>
      </el-tabs>
    </div>
  </Page>
</template>
<script setup>
import { Page } from '@vben/common-ui'
import { onMounted, reactive, ref, watch, nextTick } from 'vue'
import { ElForm, ElFormItem, ElRow, ElCol, ElTable, ElTableColumn, ElPagination, ElMain, ElContainer, ElHeader, ElFooter, ElMessageBox, ElMessage, ElNotification, ElTabs, ElTabPane } from 'element-plus'
import { Search, RefreshLeft, Plus, Delete, Download, Operation, Notification, Check, Tickets, Share } from '@element-plus/icons-vue'
import { tDateFormat, formatDateTime, tDateTimeFormat, formatDrop } from '#/utils/commonUtil.ts'
import { useDropStore } from '#/store'
import { useVbenModal } from '@vben/common-ui'
import { requestClient } from '#/api/request'
import { downloadFile } from '#/utils/download.ts';
import ZbTaskDetail from './zbTaskDetail.vue'

const queryState = defineModel('queryState')
const [ModalA, modalApiA] = useVbenModal({
  onCancel() {
    modalApiA.close()
  }
})

const data = reactive({
  tabIndex: 'list',
  tabArr: [],
  tableData: [],
  formData: {},
  sysId: null,
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0
  }
})
const orderStatus = [
  { label: '草稿', value: '1' },
  { label: '待审核', value: '2' },
  { label: '待发布', value: '3' },
  { label: '已发布', value: '4' },
]
const tableDataRef = ref()
const dropList = reactive({})
onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = []
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)

  query(true)
})

const query = async (showmask) => {
  data.formData.pageSize = data.pageInfo.pageSize
  data.formData.pageNo = data.pageInfo.pageNo
  data.formData.startGuaranteeStartTime = data.formData.gtsTime?.[0]
  data.formData.endGuaranteeStartTime = data.formData.gtsTime?.[1]

  const { list, count, pageNo } = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/applyInfo/query', data.formData)
  data.tableData = list
  data.pageInfo.pageNo = pageNo
  data.pageInfo.total = count
}
const refreshClick = () => {
  data.formData = {}
}
const showDetail = (row) => {
  data.moreVisible = false
  let tabArr = data.tabArr
  let tab
  if (row) {
    tabArr.some((item) => {
      if (item.faultId == row.guaranteeNo) {
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
      tab.title = row.guaranteeNo ? row.guaranteeNo : '未编号'
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
  tabPane.title = row.guaranteeNo

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
const handleSizeChange = (val) => {
  data.pageInfo.pageSize = val
  query()
}
const currentChange = (val) => {
  data.pageInfo.pageNo = val
  query()
}
const del = () => {
  if (tableDataRef.value.getSelectionRows().length === 0) {
    ElMessage.warning('请先选择要删除的保障任务单')
    return
  }
  ElMessageBox.confirm('确定要删除选中的保障任务单吗?', '提示', {
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
    await batchDeleteApi(tableDataRef.value.getSelectionRows())
    query()
    ElMessage.success('删除成功')
  } catch (error) {
    ElMessage.error('删除失败')
  }
}
async function batchDeleteApi(params) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/applyInfo/batchDelete', params)
}
const add = () => {
  showDetail(null)
}

const toExcelClick = async () => {
  downloadFile(import.meta.env.VITE_NSOSGZ + '/applyInfo/toExcel', data.formData, '保障任务发布列表.xlsx')
}
defineExpose({})
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

:deep(.el-form-item) {
  width: calc(100% - 20px);
  margin-right: 20px;
  margin-bottom: 12px;
}

:deep(.el-main) {
  padding: 0;
}

:deep(.el-tabs__header) {
  margin-bottom: 4px;
}

:deep(.el-popper) {
  max-width: 600px !important;
}

.primary {
  color: hsl(var(--primary));
}

:deep(.el-tab-pane) {
  width: 100%;
  height: 100%;
}

.cmdcode {
  cursor: pointer;
}

.cmdcode:hover {
  text-decoration: underline;
}
</style>
