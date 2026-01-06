<template>
  <Page auto-content-height>
    <el-container>
      <el-form :inline="true" :model="queryForm" label-position="right" style="padding: 16px 20px 0">
        <el-form-item label="当前节点:">
          <el-input v-model="queryForm.taskName" clearable maxlength="50" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="query">查询</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-main>
        <el-table border stripe ref="table" :data="tableData" @selection-change="handleSelectionChange" style="width: 100%; height: 700px">
          <el-table-column type="index" align="center" />
          <el-table-column prop="oid" label="工单号" align="center">
            <template #default="scope">
              <span style="color: #0000ed; cursor: pointer" @click="toWorkOrderDetail(scope.row.oid)">{{ scope.row.oid }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="procname" label="业务类型" align="center"> </el-table-column>

          <el-table-column prop="title" label="标题" align="center">
            <template #default="scope">
              <el-tooltip effect="light" :content="scope.row.title" placement="bottom" popper-class="custom-tooltip">
                <span class="max-lines">{{ scope.row.title }}</span>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column prop="runame" label="提出人" align="center" />

          <el-table-column prop="title" label="提出部门" align="center">
            <template #default="scope">
              <el-tooltip effect="light" :content="scope.row.rdname" placement="bottom" popper-class="custom-tooltip">
                <span class="max-lines">{{ scope.row.rdname }}</span>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column prop="creator" label="创建人" align="center" />
          <el-table-column prop="cdepname" label="创建部门" align="center">
            <template #default="scope">
              <el-tooltip effect="light" :content="scope.row.cdepname" placement="bottom" popper-class="custom-tooltip">
                <span class="max-lines">{{ scope.row.cdepname }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="taskname" label="当前节点" align="center"></el-table-column>
          <el-table-column prop="createdtime" label="待办生成时间" align="center"></el-table-column>
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
import { getydTodoTasksApi } from '#/api'
import { useRouter } from 'vue-router'
const router = useRouter()
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)
const table = ref(null)
const tableData = ref([])
const selectedRows = ref([])

const queryForm = reactive({
  taskName: ''
})
let param = {
  data: {
    orderList: [
      {
        key: 'taskname',
        order: 'asc'
      }
    ],
    pageSize: 10,
    pageNum: 1,
    showSwipe: true,
    paramList: [
      {
        key: 'userid',
        value: 'chenxiao3@csg.cn',
        type: 'eq'
      },
      {
        key: 'status',
        value: '1',
        type: 'in'
      },
      {
        key: 'mid',
        value: 879,
        type: 'eq'
      },
      {
        key: 'taskname',
        value: '方式审核',
        type: 'like'
      }
    ]
  }
}
// chenxiao3@csg.cn
// {
//   key: 'taskname',
//   value: '方式审核',
//   type: 'like'
// }

/**
 * 查询
 */
const query = async () => {
  try {
    param.data.pageSize = pageSize.value
    param.data.pageNum = currentPage.value
    const pLength = param.data.paramList.length
    // param.data.paramList[pLength - 1].value =  queryForm.taskName === ''? '方式审核': queryForm.taskName;

    const response = await getydTodoTasksApi(param)
    tableData.value = response.data.data
    total.value = response.data.totalCount
  } catch {}
}

/**
 * 跳转
 */
// 跳转
const toWorkOrderDetail = (oid) => {
  router.push({
    path: '/workPlanBalance/jobInfo',
    query: { oid: oid, type: '2' }
  })
}

const reset = () => {
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
