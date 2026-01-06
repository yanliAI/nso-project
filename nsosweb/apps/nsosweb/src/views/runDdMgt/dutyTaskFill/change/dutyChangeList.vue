<template>
  <div class="fill-whole">
    <el-tabs ref="myTab" v-model="data.activeTab" type="card" @tab-remove="removeTab" class="h-full w-full bg-white">
      <el-tab-pane label="全部记录" name="LIST" :closable="false">
        <el-container class="h-full bg-white">
          <el-header height="50px">
            <el-form label-width="auto" :model="data.formData" :inline="true" label-position="right" class="demo-form-inline mt-2">
              <el-row>
                <el-col :span="5">
                  <el-form-item label="变更单号:" prop="sheetNo" style="width: 100%">
                    <el-input v-model="data.formData.sheetNo" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6" style="padding-left: 20px">
                  <el-button type="primary" class="ml-4" :icon="Search" @click="query">查询</el-button>
                </el-col>
              </el-row>
            </el-form>
          </el-header>
          <el-main style="height: calc(100% - 95px)">
            <el-table
              ref="mytable"
              :data="data.tableData"
              border
              size="small"
              style="height: 100%"
              stripe
              :header-cell-style="{
                backgroundColor: '#F2F3F5',
                color: '#666666',
                height: '40px',
                textAlign: 'center'
              }"
            >
              <el-table-column type="index" label="#" align="center" width="40" />
              <el-table-column label="变更单号" align="center" width="120">
                <template #default="scope">
                  <a class="primary clickable" @click="showDetail(scope.row)">{{ scope.row.sheetNo }}</a>
                </template>
              </el-table-column>
              <el-table-column prop="dutyTaskName" label="值班任务" width="220" />
              <el-table-column prop="creatorName" label="发起人" align="center" width="100" />
              <el-table-column prop="createTime" label="发起时间" :formatter="tDateTimeFormat" align="center" width="130" />
              <el-table-column label="流程状态" align="center" width="80">
                <template #default="scope">
                  <span v-if="scope.row.flowState === 0" style="color: #bebebe">待提交</span>
                  <span v-if="scope.row.flowState === 1" style="color: #ffa500">待审核</span>
                  <span v-if="scope.row.flowState === 2" style="color: #32cd32">已审核</span>
                  <span v-else></span>
                </template>
              </el-table-column>
              <el-table-column prop="changeInfo" label="变更信息" />
            </el-table>
          </el-main>
          <el-footer height="45px">
            <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" class="mt-1" :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="currentChange"></el-pagination>
          </el-footer>
        </el-container>
      </el-tab-pane>
      <el-tab-pane v-for="item in data.tabArr" :key="item.name" :label="item.title" :name="item.name" closable>
        <component :is="item.comp" :wfId="item.wfId" @refreshList="emit('refresh')" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import { Search } from '@element-plus/icons-vue'
import { ElForm, ElFormItem, ElRow, ElCol, ElTable, ElTableColumn, ElPagination, ElMain, ElContainer, ElHeader, ElFooter, ElTabs, ElTabPane, ElMessageBox, ElMessage, ElDialog } from 'element-plus'
import { reactive, ref, onMounted, defineExpose } from 'vue'
import { requestClient } from '#/api/request'
import { queryByPage } from './dutyChangeMethod.ts'
import { tDateFormat, tDateTimeFormat, formatDrop, lookFlow } from '#/utils/commonUtil.ts'
import detailPage from './dutyChangeDetail.vue'
const props = defineProps({
  flowState: Number
})
const emit = defineEmits(['amount', 'refresh'])

onMounted(async () => {
  data.formData.flowState = props.flowState
})
const mytable = ref()

const data = reactive({
  tableData: [],
  formData: {
    flowState: '',
    sheetNo: '',
    sortNames: ['updateTime'],
    sortTypes: ['desc']
  },
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0
  },
  activeTab: 'LIST',
  tabArr: []
})

const query = async () => {
  data.formData.pageSize = data.pageInfo.pageSize
  data.formData.pageNo = data.pageInfo.pageNo
  const { list, pageNo, count } = await queryByPage(data.formData)
  data.tableData = list
  data.pageInfo.pageNo = pageNo
  data.pageInfo.total = count
  if (props.flowState === 1) {
    emit('amount', 'DSH', data.pageInfo.total)
  } else if (props.flowState === 2) {
    emit('amount', 'YSH', data.pageInfo.total)
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

defineExpose({
  query
})

/**
 * 打开详情
 */
const showDetail = (row) => {
  let tabArr = data.tabArr
  let tab
  if (row) {
    tabArr.some((item) => {
      if (item.wfId == row.id) {
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
      tab.wfId = row.id
    } else {
      // 新增工单tab信息
      tab.title = '新增'
      tab.wfId = null
    }
    tab.comp = detailPage
    tabArr.push(tab)
  }
  data.activeTab = tab.name
  data.tabArr = tabArr
}

/**
 * 关闭详情
 */
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

.clickable:hover {
  text-decoration: underline;
}
</style>
