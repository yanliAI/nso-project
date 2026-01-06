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
                    <el-form-item label="工单号:" prop="sheetNo">
                      <el-input v-model="data.formData.sheetNo" clearable />
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="工单名称:" prop="sheetTitle">
                      <el-input v-model="data.formData.sheetTitle" clearable />
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="工单类型:" prop="sheetType">
                      <el-select v-model="data.formData.sheetType" filterable clearable>
                        <el-option v-for="item in orderType" :key="item.value" :label="item.label" :value="item.value" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="工单状态:" prop="sheetStatus">
                      <el-select v-model="data.formData.sheetStatus" filterable clearable>
                        <el-option v-for="item in orderStatus" :key="item.value" :label="item.label" :value="item.value" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-button type="primary" class="ml-4" :icon="Search" @click="query(null)">查询</el-button>
                    <el-button type="primary" :icon="Plus" @click="add">新增</el-button>
                    <el-button type="info" plain class="ml-4" :icon="RefreshLeft" @click="refreshClick">重置</el-button>
                  </el-col>
                </el-row>
              </el-form>
            </el-header>
            <el-main style="height: calc(100% - 93px)">
              <el-table ref="tableDataRef" :data="data.tableData" border show-overflow-tooltip style="height: 100%" stripe>
                <el-table-column type="index" fixed width="45" label="#" align="center" />
                <el-table-column label="工单号" fixed width="180" align="center">
                  <template #default="scope">
                    <span class="primary cmdcode" @click="showDetail(scope.row)">{{ scope.row.sheetNo }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="sheetTitle" label="工单标题" width="200" align="left" header-align="center" />
                <el-table-column prop="sheetType" label="工单类型" align="center" width="150" >
                  <template #default="scope">
                    {{ orderType.filter((d) => d.value == scope.row.sheetType)[0]?.label }}
                  </template>
                </el-table-column>
                <el-table-column prop="sheetContent" label="工单内容" align="left" header-align="center" />
                <el-table-column prop="sheetStatus" label="工单状态" align="center" width="150">
                  <template #default="scope">
                    {{ orderStatus.filter((d) => d.value == scope.row.sheetStatus)[0]?.label }}
                  </template>
                </el-table-column>
                <el-table-column prop="sendMan" label="发起人" column-key="NSOS_USER_NAME" :formatter="formatDrop" width="100" align="center" />
                <el-table-column prop="sendTime" label="发起时间" :formatter="tDateTimeFormat" width="160" align="center" />
                <el-table-column prop="dealMan" label="处理人" column-key="NSOS_USER_NAME" :formatter="formatDrop" width="100" align="center" />
                <el-table-column prop="dealTime" label="处理时间" :formatter="tDateTimeFormat" width="160" align="center" />
                <el-table-column prop="dealOpinion" label="处理意见"  width="160" align="center" />
              </el-table>
            </el-main>
            <ElFooter height="40px">
              <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" class="mt-1" :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="currentChange"></el-pagination>
            </ElFooter>
          </el-container>
        </el-tab-pane>
        <el-tab-pane v-for="item in data.tabArr" :key="item.name" :label="item.title" :name="item.name" closable>
          <OrderDetail :orderId="item.faultId" :tabName="item.name" @refreshList="query" @afterAdd="afterAdd($event, item)" @removeTab="removeTab"></OrderDetail>
        </el-tab-pane>
      </el-tabs>
    </div>
  </Page>
</template>
<script setup>
import { Page } from '@vben/common-ui'
import { onMounted, reactive, ref, watch, nextTick } from 'vue'
import { ElForm, ElFormItem, ElRow, ElCol, ElTable, ElTableColumn, ElPagination, ElMain, ElContainer, ElHeader, ElFooter, ElMessageBox, ElMessage, ElNotification, ElTabs, ElTabPane } from 'element-plus'
import { Search, RefreshLeft, Plus, Delete, Download, Operation, Notification, Check, Tickets } from '@element-plus/icons-vue'
import { tDateFormat, formatDateTime, tDateTimeFormat, formatDrop } from '#/utils/commonUtil.ts'
import { useDropStore } from '#/store'
import { useVbenModal } from '@vben/common-ui'
import { requestClient } from '#/api/request'
import OrderDetail from './orderDetail.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
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
const orderType = [
  { label: '台账异常', value: '1' },
  { label: '资产变更', value: '2' }
]
const orderStatus = [
  { label: '草稿', value: '0' },
  { label: '待处理', value: '1' },
  { label: '已处理', value: '2' }
]
const tableDataRef = ref()
const dropList = reactive({})
onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = ['NSOS_SYS_LEVEL', 'NSOS_ORG_NAME', 'NSOS_USER_NAME']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)

  query(true)

  if (route.query.id && route.query.sheetNo) {
    showDetail({id: route.query.id, sheetNo: route.query.sheetNo})
  }
})

const query = async (showmask) => {
  data.formData.pageSize = data.pageInfo.pageSize
  data.formData.pageNo = data.pageInfo.pageNo

  const { list, count, pageNo } = await requestClient.post(import.meta.env.VITE_BASIC + '/filesWorksheet/queryData', data.formData)
  data.tableData = list
  data.pageInfo.pageNo = pageNo
  data.pageInfo.total = count
}
const refreshClick = () => {
  data.formData = {}
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
      tab.title = row.sheetNo ? row.sheetNo : '未编号'
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
  tabPane.title = row.sheetNo

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
