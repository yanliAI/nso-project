<template>
  <div>
    <el-tabs v-model="editableTabsValue" type="card" class="demo-tabs" @tab-remove="removeTab">
      <el-tab-pane v-for="item in editableTabs" :key="item.name" :label="item.title" :name="item.name" :closable="item.name !== '1'">
        <div v-if="item.name === '1'">
          <el-container>
            <el-form :inline="true" :model="queryForm" label-position="right" style="padding: 0px 20px 0">
              <el-form-item label="工单号:">
                <el-input v-model="queryForm.oid" clearable maxlength="50" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :icon="Search" @click="query">查询</el-button>
                <el-button type="info" @click="reset">重置</el-button>
              </el-form-item>
            </el-form>
            <el-main>
              <el-table border stripe ref="table" :data="tableData" @selection-change="handleSelectionChange" style="width: 100%; height: 680px">
                <el-table-column type="index" align="center" />
                <el-table-column prop="oid" label="工单号" align="center">
                  <template #default="scope">
                    <span style="color: #0000ed; cursor: pointer" @click="addTab(scope.row.oid, scope.row.id, scope.row.procname)">{{ scope.row.oid }}</span>
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
                <el-table-column prop="taskname" label="参与节点" align="center"></el-table-column>
                <el-table-column prop="createdtime" label="待办生成时间" align="center"></el-table-column>
                <el-table-column align="center" label="操作">
                  <template #default="scope">
                    <el-button type="primary" link @click="rollbackTasks(scope.row)">撤回</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-main>
            <el-footer>
              <el-pagination :current-page="currentPage" :page-size="pageSize" :total="total" @size-change="handleSizeChange" @current-change="handlePageChange" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
            </el-footer>
          </el-container>
        </div>
        <div v-else>
          <pageControl :key="item.name" :orderType="item.orderType" :oid="item.name" :tid="item.tid"></pageControl>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { ElTable, ElTableColumn, ElFormItem, ElPopconfirm, ElForm, ElInput, ElButton, ElSelect, ElOption, ElPagination, ElContainer, ElHeader, ElMain, ElFooter, ElDialog, ElMessage, ElMessageBox, ElText, ElLink, ElTag, ElTooltip } from 'element-plus'
import { Search, Download, Aim, CircleCheck, Setting } from '@element-plus/icons-vue'
import { Page } from '@vben/common-ui'
import { ref, reactive, provide, watch, computed, onMounted } from 'vue'
import { getydTodoTasksApi, rollbackTasksApi } from '#/api'
import pageControl from './pageControl.vue'
import { useRouter } from 'vue-router'
import { useAccessStore, useUserStore } from '@vben/stores'
const emit = defineEmits(['custom-event', 'sendCount'])
const router = useRouter()
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)
const table = ref(null)
const tableData = ref([])
const selectedRows = ref([])
const userStore = useUserStore()
const queryForm = reactive({
  oid: ''
})

// tab参数
const editableTabsValue = ref('1')
const editableTabs = ref([
  {
    title: '全部记录',
    name: '1',
    content: 'Tab 1 content'
  }
])

// 祖先参数，工单提交，应刷新全部记录tab页
const submitState = ref('wait')
provide('submitState', submitState)

watch(submitState, (newData) => {
  if (newData === 'success') {
    // 删除当前tab页，跳转至全部记录页
    let deleteTab = editableTabsValue.value
    const tabs = editableTabs.value
    editableTabsValue.value = '1'
    editableTabs.value = tabs.filter((tab) => tab.name !== deleteTab)
    query()
    submitState.value = 'wait'
  }
})

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
    const baseParams = [
      {
        key: 'userid',
        value: userStore.userInfo.logincode,
        type: 'eq'
      },
      {
        key: 'status',
        value: '3',
        type: 'in'
      },
      {
        conditions: [
          {
            conn: 'or',
            conditions: [
              {
                key: 'mid',
                value: 879,
                type: 'eq',
                conn: 'and'
              },
              {
                key: 'taskname',
                value: '方式审核',
                type: 'like',
                conn: 'and'
              }
            ]
          },
          {
            key: 'mid',
            value: 109,
            type: 'eq',
            conn: 'or'
          }
        ]
      }
    ]
    const oidCondition = queryForm.oid ? [{ key: 'oid', type: 'eq', value: queryForm.oid }] : []
    let param = {
      data: {
        orderList: [
          {
            key: 'createdtime',
            order: 'desc'
          },
          {
            key: 'taskname',
            order: 'asc'
          }
        ],
        pageSize: 20,
        pageNum: 1,
        showSwipe: true,
        paramList: [...baseParams, ...oidCondition]
      }
    }
    param.data.pageSize = pageSize.value
    param.data.pageNum = currentPage.value

    const response = await getydTodoTasksApi(param)
    tableData.value = response.data.data
    total.value = response.data.count
    emit('sendCount', { count: response.data.count, type: 'done' })
    // tableData.value = date11.data
    // total.value = date11.count
  } catch {}
}

/**
 * 工单撤回
 */
function rollbackTasks(row) {
  ElMessageBox.confirm('确定要撤回本工单吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      rollback(row)
    })
    .catch(() => {
      // ElMessage.info('已取消删除')
    })
}

async function rollback(row) {
  try {
    const res = await rollbackTasksApi({
      data: {
        taskid: row.taskid
      }
    })
    await query()
    ElMessage.success('撤回成功!')
  } catch (error) {}
}

/**
 * 查看工单详情、新增工单详情页
 */

// 新增/跳转详情页
function addTab(targetName: string, id: string, procname: string) {
  const hasTab = editableTabs.value.find((tab) => tab.name === targetName)
  if (hasTab) {
    editableTabsValue.value = targetName
    return
  }

  editableTabs.value.push({
    title: targetName,
    name: targetName,
    orderType: procname,
    tid: id
  })
  editableTabsValue.value = targetName
}

// 删除tab页
function removeTab(targetName: TabPaneName) {
  const tabs = editableTabs.value
  let activeName = editableTabsValue.value
  if (activeName === targetName) {
    tabs.forEach((tab, index) => {
      if (tab.name === targetName) {
        const nextTab = tabs[index + 1] || tabs[index - 1]
        if (nextTab) {
          activeName = nextTab.name
        }
      }
    })
  }
  editableTabsValue.value = activeName
  editableTabs.value = tabs.filter((tab) => tab.name !== targetName)
}

/**
 * 跳转
 * @param oid          // 工单号
 * @param tid         // id
 * @param procname   // 业务类型
 */
// const toWorkOrderDetail = (oid, tid, procname) => {
//   if(procname==='并网管控'){
//       router.push({
//         path: '/gridConnectionAnalysis/gridOrderDetails',
//         query: { oid: oid, tid:tid, type: '3' }
//       })
//   } else{
//     router.push({
//       path: '/workPlanBalance/jobInfo',
//       query: { oid: oid, tid:tid, type: '3' }
//     })

//   }
// }

const reset = () => {
  queryForm.oid = ''
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
defineExpose({query})
</script>

<style scoped>
:deep(.el-tabs__header) {
  margin: 0 0 15px !important;
}
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
