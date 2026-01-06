<template>
  <Page auto-content-height>
    <el-tabs type="border-card" ref="myTab" v-model="data.tabIndex" @tab-remove="removeTab">
      <el-tab-pane label="缺陷通知管理" name="list" :closable="false">
        <el-container class="h-full bg-white">
          <el-header height="90px">
            <el-form label-width="auto" ref="ruleFormRef" :model="formData" :inline="true" label-position="right" class="demo-form-inline">
              <el-row>
                <el-col :span="4">
                  <el-form-item label="单号:" prop="effectRange">
                    <el-input v-model="data.formData.defectCode" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="状态:" prop="effectRange">
                    <el-select v-model="data.formData.defectStatus" disabled clearable>
                      <el-option v-for="item in dropList.NSOS_DEFECT_STATUS" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="发现时间:" filterable>
                    <el-date-picker v-model="data.formData.recordingTime" type="datetimerange" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss.SSS" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" style="width: 100%" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="系统名称:" prop="effectRange">
                    <el-select v-model="data.formData.systemName" filterable clearable>
                      <el-option v-for="item in dropList.NSOS_SYSTEM_INFO" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <div>
                  <el-button type="primary" class="ml-4" :icon="Tickets" @click="onSearch">查询</el-button>
                  <el-button type="primary" class="publish-button" :icon="Histogram" @click="toExcelClick">导出</el-button>
                  <el-button type="info" plain class="ml-4" :icon="Close" @click="reset">重置</el-button>
                </div>
              </el-row>
            </el-form>
          </el-header>

          <el-main style="height: calc(100% - 135px)">
            <!-- <div style="margin-left: 20px; margin-bottom: 5px; margin-top: 20px">
              <el-button type="primary" class="publish-button" :icon="Histogram" @click="toExcelClick">导出</el-button>
              <el-button type="primary" class="publish-button" :icon="Plus" @click="add">新增</el-button>
              <el-button type="primary" class="publish-button" :icon="Delete" @click="batchDelete">删除</el-button>
            </div> -->
            <el-table :data="data.tableData" border size="small" style="height: 100%" show-overflow-tooltip @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="40" align="center" />
              <el-table-column type="index" label="#" width="40" align="center" />
              <el-table-column prop="defectCode" label="单号" width="120" align="center">
                <template #default="scope">
                  <!-- <el-link type="primary" @click="showDetail(scope.row)">{{ scope.row.defectCode }}</el-link> -->
                  <span class="value blue-text" @click="showDetail(scope.row)" style="cursor: pointer">{{ scope.row.defectCode }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="defectStatus" label="状态" width="150" align="center">
                <template #default="scope">
                  {{ getdefectStatusLabel(scope.row.defectStatus) }}
                </template>
              </el-table-column>
              <el-table-column prop="unitName" label="单位" width="200" align="center" />
              <el-table-column prop="systemName" label="所属系统" width="150" align="center" column-key="NSOS_SYSTEM_INFO" :formatter="formatDrop" />
              <el-table-column prop="defectType" label="异常类型" width="120" align="center">
                <template #default="scope">
                  {{ getdefectTypeLabel(scope.row.defectType) }}
                </template>
              </el-table-column>
              <el-table-column prop="ip" label="IP地址" width="150" align="center" />
              <el-table-column prop="abnormalDescription" label="异常描述" align="left" header-align="center" />
              <el-table-column prop="recordingTime" label="发生时间" :formatter="formatTimestamp" width="150" align="center" />
            </el-table>
          </el-main>
          <el-footer height="45px">
            <el-pagination size="small" background layout="total, sizes, prev, pager, next, jumper" :current-page="currentPage" :page-size="pageSize" :total="total" @size-change="handleSizeChange" @current-change="handlePageChange" :page-sizes="[20, 50, 100, 200]" class="mt-2" />
          </el-footer>
        </el-container>
      </el-tab-pane>
      <el-tab-pane v-for="item in data.tabArr" :key="item.name" :label="item.title" :name="item.name" closable>
        <FaultDetail :faultId="item.faultId" :flag="'2'" @removeTab="removeTab" :name="item.name" @onSearch="onSearch"></FaultDetail>
      </el-tab-pane>
    </el-tabs>
  </Page>
</template>
<script setup>
import { Page } from '@vben/common-ui'
import { onMounted, reactive, ref, nextTick } from 'vue'
import { ElForm, ElLink, ElFormItem, ElRow, ElCol, ElTable, ElTabs, ElTabPane, ElTableColumn, ElPagination, ElMain, ElContainer, ElHeader, ElFooter, ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Plus, Histogram, Tickets, Close } from '@element-plus/icons-vue'
import { requestClient } from '#/api/request'
import { useDropStore } from '#/store'
import FaultDetail from '../defectNotificationMgtDetail/index.vue'
import { toExcelCl } from './defectNotiMgtMethods.ts'
import { tDateTimeFormat, formatDrop } from '#/utils/commonUtil.ts'

const data = reactive({
  tableData: [],
  formData: {
    defectCode: '',
    defectStatus: '',
    recordingTime: [],
    systemName: ''
  },
  tabIndex: 'list',
  tabArr: []
})
const dropList = reactive({})
const total = ref(0)
const pageSize = ref(20)
const currentPage = ref(1)

const onSearch = async () => {
  // 模拟从服务器获取数据
  // 这里可以替换为实际的 API 请求
  const response = await requestClient.post(import.meta.env.VITE_NSOSZH + '/defectNoticeInfo/mHQueryDataListByPagePagination', {
    pageNo: currentPage.value,
    pageSize: pageSize.value,
    defectCode: data.formData.defectCode,
    defectStatus: data.formData.defectStatus,
    startTime: data.formData.recordingTime[0],
    endTime: data.formData.recordingTime[1],
    systemName: data.formData.systemName
  })
  data.tableData = response.list
  total.value = response.count
}

const batchDelete = () => {
  /*   if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要删除的数据');
    return;
  } */
  ElMessageBox.confirm('确定要删除这些数据吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      batchDeleteBatch()
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}

const batchDeleteBatch = async () => {
  try {
    await requestClient.post(import.meta.env.VITE_NSOSZH + '/defectNoticeInfo/deletebatchData')
    onSearch()
    ElMessage.success('删除成功')
  } catch (error) {
    ElMessage.error('删除数据失败')
  }
}

const reset = () => {
  data.formData.defectCode = ''
  // data.formData.defectStatus = ''
  data.formData.recordingTime = ''
  data.formData.systemName = ''
  onSearch()
}

const handleSelectionChange = (val) => {
  selectedRows.value = val
}

const handleSizeChange = (size) => {
  pageSize.value = size
  onSearch()
}

const handlePageChange = (newPage) => {
  currentPage.value = newPage
  onSearch()
}

const getdefectStatusLabel = (value) => {
  const option = dropList.NSOS_DEFECT_STATUS.find((option) => option.value === value)
  return option ? option.label : ''
}

const getdefectTypeLabel = (value) => {
  const option = dropList.NSOS_DEFECT_TYPE.find((option) => option.value === value)
  return option ? option.label : ''
}

const add = () => {
  showDetail(null)
}

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
      tab.title = row.defectCode ? row.defectCode : '未编号'
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

const toExcelClick = async () => {
  toExcelCl(data.formData, '缺陷通知管理导出excel.xlsx')
}

function formatTimestamp(row, column, cellValue) {
  if (cellValue) {
    const date = new Date(cellValue)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }
}

onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = ['NSOS_DEFECT_STATUS', 'NSOS_DEFECT_STATUS', 'NSOS_DEFECT_TYPE', 'NSOS_SYSTEM_INFO', 'NSOS_ORG_NAME']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)

  data.formData.defectStatus = '2'
  nextTick().then(() => {
    onSearch()
  })
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

.publish-button {
  border-radius: 4px;
}

:deep(.el-tabs) {
  width: 100%;
  height: 100%;
}

:deep(.el-tab-pane) {
  width: 100%;
  height: 100%;
}

:deep(.p-1) {
  padding: 0rem;
}

.blue-text {
  color: #409eff; /* 蓝色字体 */
}
</style>
