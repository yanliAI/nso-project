<template>
  <Page auto-content-height>
    <el-container>
      <el-form :inline="true" :model="queryForm" label-position="right" style="padding: 16px 20px 0">
        <el-form-item label="工单编号:" prop="oid">
          <el-input v-model="queryForm.oid" clearable maxlength="100" />
        </el-form-item>
        <el-form-item label="计划时间:" prop="daterange">
          <el-date-picker v-model="queryForm.daterange" type="daterange" start-placeholder="请选择" end-placeholder="请选择" format="YYYY-MM-DD" value-format="YYYY-MM-DD" @change="handleChangeDate" style="width: 300px" />
        </el-form-item>
        <el-form-item label="当前节点:" prop="taskName">
          <el-input v-model="queryForm.taskName" clearable maxlength="100" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :icon="Search" @click="query">查询</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-main>
        <el-table border stripe ref="table" :data="tableData" @selection-change="handleSelectionChange" style="width: 100%; height: 700px">
          <el-table-column type="index" align="center" />
          <el-table-column type="selection" />
          <el-table-column prop="oid" label="工单编号" align="center">
            <template #default="scope">
              <span style="color: #0000ed; cursor: pointer" @click="toWorkOrderDetail(scope.row.oid)">{{ scope.row.oid }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="工单标题" align="center">
            <template #default="scope">
              <el-tooltip effect="light" :content="scope.row.title" placement="bottom" popper-class="custom-tooltip">
                <span class="max-lines">{{ scope.row.title }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="creatorName" label="创建人" align="center" />
          <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>

          <el-table-column prop="unitName" label="创建部门" align="center">
            <template #default="scope">
              <el-tooltip effect="light" :content="scope.row.unitName" placement="bottom" popper-class="custom-tooltip">
                <span class="max-lines">{{ scope.row.unitName }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="taskName" label="当前节点" align="center"></el-table-column>
          <el-table-column prop="workStartTime" label="作业开始时间" align="center"></el-table-column>
          <el-table-column prop="workEndTime" label="作业结束时间" align="center"></el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <el-pagination :current-page="currentPage" :page-size="pageSize" :total="total" @size-change="handleSizeChange" @current-change="handlePageChange" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </el-footer>
    </el-container>
  </Page>
</template>

<script lang="ts" setup>
import { ElTable, ElTableColumn, ElFormItem, ElForm, ElInput, ElButton, ElSelect, ElOption, ElPagination, ElContainer, ElHeader, ElMain, ElFooter, ElDialog, ElMessage, ElMessageBox, ElText, ElLink, ElTag, ElTooltip } from 'element-plus'
import { Search, Download, Aim, CircleCheck, Setting } from '@element-plus/icons-vue'
import { Page } from '@vben/common-ui'
import { ref, reactive, computed, onMounted } from 'vue'
import { getworkPlanTasksApi } from '#/api'
import moment from 'moment'
import { useRouter } from 'vue-router'
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)
const table = ref(null)
const tableData = ref([])
const selectedRows = ref([])
const router = useRouter()

const currentDate = moment().format('YYYY-MM-DD')
// 三个月前的时间
const threeMonthsAgo = moment().subtract(3, 'months').format('YYYY-MM-DD')
const rangeDate = ref([])

const queryForm = reactive({
  daterange: '',
  taskName: '',
  oid:''
})


let param = {
  data: {
    pageSize: pageSize.value,
    pageNum: currentPage.value,
    paramList: [
      {
        key: 'idate',
        type: 'ge',
        value: moment(currentDate).format('YYYYMMDD'),
        svalue: currentDate,
        name: '创建开始日期',
        control: 'day'
      },
      {
        key: 'idate',
        type: 'le',
        value: moment(threeMonthsAgo).format('YYYYMMDD'),
        svalue: threeMonthsAgo,
        name: '创建结束日期',
        control: 'day'
      },
            {
        key:"oid",
        value:'',
        type:'likeRight'
      },
      {
        key: 'taskName',
        type: 'eq',
        value: ''
      },
      {
        key: 'status',
        type: 'ne',
        value: '-1', // 有效
        name: '工单状态',
        control: '_status',
        dict: '_status'
      },
      {
        key: 'mid',
        value: 879,
        type: 'eq'
      },
      {
        key: 'wfid',
        type: 'eq',
        value: 20185 // 总部运调中心
      },

    ]
  }
}

      // {
      //   key: 'wfid',
      //   type: 'eq',
      //   value: 20185 // 总部运调中心
      // },
// 更新查询参数
const updateParam = () => {
  param.data.pageSize = pageSize.value;
  param.data.pageNum = currentPage.value;

  // 更新日期范围
  const [startDate, endDate] = queryForm.daterange 
    ? [queryForm.daterange[0], queryForm.daterange[1]]
    : [currentDate, threeMonthsAgo];

  param.data.paramList[0].value = moment(startDate).format('YYYYMMDD');
  param.data.paramList[0].svalue = startDate;
  param.data.paramList[1].value = moment(endDate).format('YYYYMMDD');
  param.data.paramList[1].svalue = endDate;

  // 更新oid、节点
  param.data.paramList[2].value = queryForm.oid;
  param.data.paramList[3].value = queryForm.taskName;

}

// 跳转
const toWorkOrderDetail = (oid) => {
  router.push({
    path: '/workPlanBalance/jobInfo',
    query: { oid: oid,type:'1'}
  })
}

/**
 * 查询
 */
const query = async () => {
  try {
    updateParam()
    const response = await getworkPlanTasksApi(param)
    tableData.value = response.data.data
    total.value = response.data.count
  } catch {}
}

const reset = () => {
  queryForm.daterange = ''
  queryForm.taskName = ''
  query()
}

const handleSelectionChange = (val) => {
  selectedRows.value = val
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  query()
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  query()
}

onMounted(() => {
  rangeDate.value.push(threeMonthsAgo)
  rangeDate.value.push(currentDate)
  queryForm.daterange = rangeDate.value
  query()
})
</script>

<style scoped>
.el-main {
  padding-top: 0;
}
.cell {
  text-align: center;
}
.max-lines {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /* 限制显示行数 */
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
