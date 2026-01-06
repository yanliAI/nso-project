<template>
  <Page auto-content-height>
    <el-tabs type="border-card" ref="myTab" v-model="data.tabIndex" @tab-remove="removeTab">
      <el-tab-pane label="评价列表" name="list" :closable="false">
        <el-container class="h-full bg-white">
          <el-header height="100px">
            <el-form label-width="auto" ref="ruleFormRef" :model="formData" :inline="true" label-position="right" class="demo-form-inline mt-2">
              <el-row>
                <el-col :span="6">
                  <el-form-item label="单位:" prop="evaluateUini">
                    <el-select v-model="data.formData.evaluateUini" type="month" clearable filterable :disabled="!data.deptRight">
                      <el-option v-for="item in dropList.NSOS_ORG_NAME_SJJC" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="评价标题:" prop="evaluateName">
                    <el-input v-model="data.formData.evaluateName" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="2"></el-col>
                <el-col :span="10">
                  <el-button type="primary" class="ml-4" :icon="Search" @click="query">查询</el-button>
                  <!-- <el-button type="primary" class="ml-4" :icon="Finished" @click="save">保存</el-button> -->
                  <el-button type="primary" class="ml-4" :icon="Histogram" @click="addAnalysis">排名分析</el-button>
                  <el-button type="info" plain class="ml-4" :icon="RefreshLeft" @click="reset">重置</el-button>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <el-form-item label="评价维度:" prop="evaluateTimeType">
                    <el-select v-model="data.formData.evaluateTimeType" type="month" filterable>
                      <el-option v-for="item in dropList.NSOS_EVALUATE_TIMETYPE" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="时间:" prop="evaluateMonth">
                    <el-date-picker v-if="data.formData.evaluateTimeType === '1'" v-model="data.formData.evaluateMonth" type="month" value-format="YYYY-MM-DD HH:mm:ss" />
                    <el-date-picker v-else v-model="data.formData.evaluateMonth" type="year" value-format="YYYY-MM-DD HH:mm:ss" />
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="备注说明:" prop="remark">
                    <el-input v-model="data.formData.remark" clearable />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-header>
          <el-main style="height: calc(100% - 140px)">
            <el-table :data="data.tableData" border size="small" style="height: 100%" @selection-change="handleSelectionChange">
              <!-- <el-table-column type="selection" align="center" /> -->
              <el-table-column type="index" label="#" align="center" />
              <el-table-column prop="evaluateUini" label="单位" column-key="NSOS_ORG_NAME_SJJC" :formatter="formatDrop" align="center" />
              <el-table-column prop="evaluateTimeType" label="评价维度" column-key="NSOS_EVALUATE_TIMETYPE" :formatter="formatDrop" align="center" />
              <el-table-column prop="evaluateMonth" label="时间" align="center">
                <template #default="scope">
                  {{ scope.row.evaluateTimeType === '2' ? dayjs(new Date(scope.row.evaluateMonth)).format('YYYY') : dayjs(new Date(scope.row.evaluateMonth)).format('YYYY-MM') }}
                </template>
              </el-table-column>
              <el-table-column prop="evaluateName" label="评价活动标题" align="center">
                <template #default="scope">
                  <span class="value blue-text" @click="showDetail(scope.row)">{{ scope.row.evaluateName }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="evaluateStatus" label="活动状态" column-key="NSOS_EVALUATE_STATUS" :formatter="formatDrop" align="center" />
              <el-table-column prop="finalScore" label="最终评分" align="center" />
              <el-table-column prop="remark" width="600px" label="备注说明" align="left" header-align="center" />
            </el-table>
          </el-main>
          <el-footer height="45px">
            <el-pagination size="small" background layout="total, sizes, prev, pager, next, jumper" :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" :total="data.pageInfo.total" @size-change="handleSizeChange" @current-change="handlePageChange" :page-sizes="[20, 50, 100, 200]" class="mt-2" />
          </el-footer>
        </el-container>
      </el-tab-pane>
      <el-tab-pane v-for="item in data.tabArr" :key="item.name" :label="item.title" :name="item.name" closable>
        <EvaluateDetail @removeTab="removeTab" :evaluateCode="item.evaluateCode" :evaluateStatus="item.evaluateStatus" :evaluateUini="item.evaluateUini" :provinceCode="item.provinceCode" :name="item.name" :userDept="data.userDept" @query="query"></EvaluateDetail>
      </el-tab-pane>
      <el-tab-pane v-for="item in data.tabAnalysis" :key="item.name" :label="item.title" :name="item.name" closable>
        <RankingAnalysis @removeTab="removeTab" :name="item.name" @query="query"></RankingAnalysis>
      </el-tab-pane>
    </el-tabs>
  </Page>
</template>
<script setup>
import { Page } from '@vben/common-ui'
import { onMounted, reactive, ref, nextTick } from 'vue'
import { ElForm, ElLink, ElFormItem, ElRow, ElCol, ElTable, ElTabs, ElTabPane, ElTableColumn, ElPagination, ElMain, ElContainer, ElHeader, ElFooter, ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Plus, Histogram, Search, RefreshLeft, Finished, Promotion } from '@element-plus/icons-vue'
import { requestClient } from '#/api/request'
import { queryData } from './evaluateManageMethod.ts'
import { useDropStore } from '#/store'
import { formatDrop } from '#/utils/commonUtil.ts'
import EvaluateDetail from '../ydEvaluateManageDetail/index.vue'
import RankingAnalysis from './rankingAnalysis.vue'
import dayjs from 'dayjs'

const data = reactive({
  tableData: [],
  formData: {
    evaluateUini: '',
    evaluateTimeType: '1',
    evaluateMonth: '',
    evaluateName: '',
    remark: '',
    evaluateType: '1'
  },
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0
  },
  tabIndex: 'list',
  tabArr: [],
  tabAnalysis: [],
  deptRight: null,
  userDept: null,
})
const dropList = reactive({})

const query = async () => {
  data.formData.pageNo = data.pageInfo.pageNo
  // if (data.formData.evaluateMonth) {
  //   data.formData.evaluateMonth = data.formData.evaluateMonth.getTime()
  // }
  const { dataList, dept, deptRight } = await queryData(data.formData)
  data.tableData = dataList.list
  data.pageInfo.pageNo = dataList.pageNo
  data.pageInfo.total = dataList.count
  data.formData.evaluateUini = dept
  data.deptRight = deptRight

  data.userDept = dept
}

const reset = () => {
  data.formData.evaluateUini = ''
  data.formData.evaluateName = ''
  data.formData.evaluateTimeType = ''
  data.formData.evaluateMonth = ''
  data.formData.remark = ''
  query()
}

const handleSelectionChange = (val) => {
  selectedRows.value = val
}

const handleSizeChange = (size) => {
  data.pageInfo.pageSize = size
  query()
}

const handlePageChange = (newPage) => {
  data.pageInfo.pageNo = newPage
  query()
}

const addAnalysis = () => {
  showAnalysis(null)
}

const showAnalysis = (row) => {
  let tabArr = data.tabAnalysis
  let tab
  if (row) {
    tabArr.some((item) => {
      if (title === '排名分析') {
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
      tab.title = '排名分析'
      tab.faultId = null
    }
    tabArr.push(tab)
  }
  data.tabIndex = tab.name
}

const showDetail = (row) => {
  let tabArr = data.tabArr
  let tab
  if (row) {
    tabArr.some((item) => {
      if (item.evaluateCode == row.evaluateCode) {
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
      tab.title = row.evaluateName ? row.evaluateName : '未编号'
      tab.evaluateCode = row.evaluateCode
      tab.evaluateStatus = row.evaluateStatus
      tab.evaluateUini = row.evaluateUini
      tab.provinceCode = row.provinceCode
    }
    tabArr.push(tab)
  }
  data.tabIndex = tab.name
}

const removeTab = (targetName) => {
  let tabArr = data.tabArr
  let tabArr2 = data.tabAnalysis
  let tab
  let tabIndex = data.tabIndex
  if (tabIndex === targetName) {
    tabIndex = 'list'
    let nextTab
    let nextTab2
    tabArr.forEach(function (tab, index) {
      if (tab.name === targetName) {
        nextTab = tabArr[index + 1] || tabArr[index - 1]
        if (nextTab) {
          tabIndex = nextTab.name
        }
      }
    })
    tabArr2.forEach(function (tab, index) {
      if (tab.name === targetName) {
        nextTab = tabArr2[index + 1] || tabArr2[index - 1]
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
  for (var i = 0; i < tabArr2.length; i++) {
    if (tabArr2[i].name == targetName) {
      tabArr2.splice(i, 1)
      break
    }
  }
}

onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = ['NSOS_EVALUATE_TIMETYPE', 'NSOS_EVALUATE_STATUS', 'NSOS_ORG_NAME_SJJC']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)
  nextTick().then(() => {
    query()
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
  cursor: pointer;
}
</style>
