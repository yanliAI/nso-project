<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'

import { useAccessStore } from '@vben/stores'

import { Delete, Histogram, Plus, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import moment from 'moment'

import { getCollectionTasksApi, getColFillProgressApi,publishCollectionTaskApi, deleteColTasksApi,getAllCollectionInfo, getAllOrgApi, getDetailsByTableCol, getFillInfo } from '#/api'
import { downloadFile } from '#/utils/download.ts'

import DetailModal from './detailModal.vue'
import InsertModal from './insertModal.vue'

const props = defineProps({
  dateType: {
    type: String,
    default: '' // 默认值
  }
})

const loading = ref(false)
const accessStore = useAccessStore()
const queryForm = reactive({
  taskName: '',
  taskType: props.dateType
})
const data = reactive({
  tableData: [],
  pageInfo: {
    pageSize: 10,
    pageNo: 1,
    total: 0
  }
})

const dialogData = reactive({
  publishVisible: false, // 发布任务
  submitVisible: false // 填报情况
})
const editModalVisible = ref(false)
const insertModalVisible = ref(false)

// 删除存储选中的行
const selectedRows = ref([])

onMounted(() => {
  getCollection() // 1月收资，2年收资
  getAllOrgList()
})

// 获取数据
async function getCollection() {
  try {
    const res = await getCollectionTasksApi({
      ...data.pageInfo,
      ...queryForm
    })
    data.tableData = res.list
    data.pageInfo.total = res.total
  } catch (error) {
    console.error('系统异常:', error)
  }
}

// 重置
function reset() {
  Object.assign(queryForm, {
    taskName: ''
  })
  data.pageInfo.pageNo = 1
  data.pageInfo.pageSize = 10
  getCollection()
}

// 删除选择变化事件
const handleSelectionChange = (selection) => {
  selectedRows.value = selection.map((row) => ({
    taskId: row.id,
    status: row.status
  }))
}

// 批量删除方法
const batchDelete = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请至少选择一条记录')
    return
  }

  const hasStatusOne = selectedRows.value.some((row) => row.status === '1')
  if (hasStatusOne) {
    ElMessage.error('不能删除"收资中"状态的任务')
    return
  }

  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedRows.value.length} 条任务吗？`, '批量删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteColTasksApi(selectedRows.value.map((item) => item.taskId))

    selectedRows.value = []
    ElMessage.success('删除成功!')
    getCollection()
  } catch (error) {
    console.error('删除操作取消或失败:', error)
  }
}

// 单个删除方法
// const deleteSingle = async (row) => {
//   try {
//     await ElMessageBox.confirm(`确定要删除任务 "${row.taskName}" 吗？`, '删除确认', {
//       confirmButtonText: '确定',
//       cancelButtonText: '取消',
//       type: 'warning'
//     })

//     await deleteColTasksApi([{ taskId: row.id }])
//     ElMessage.success('删除成功!')
//     getCollection()
//   } catch (error) {
//     console.error('删除操作取消或失败:', error)
//   }
// }

/**
 * 发布任务相关
 */
const publishParams = reactive({
  taskId: '',
  assigneeDept: [],
  date: ''
})
const publishForm = ref()
const publishRules = ref({
  assigneeDept: [{ required: true, message: '请选择单位', trigger: 'change' }],
  date: [
    { required: true, message: '请选择截止时间', trigger: 'change' },
    {
      validator: (rule, value, callback) => {
        if (value && new Date(value) < new Date()) {
          callback(new Error('截止时间不能早于当前时间'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ]
})

// 打开发布任务弹窗
function publishTask(row) {
  publishParams.taskId = row.id
  publishParams.date = ''
  publishParams.assigneeDept = []
  dialogData.publishVisible = true
}

// 任务发布
async function submitPublishForm() {
  try {
    const valid = await publishForm.value.validate()
    if (!valid) {
      return
    }
    const res = await publishCollectionTaskApi(publishParams)
    if (res.deptNames && res.deptNames.length > 0) {
      ElMessage.warning(`以下部门缺乏负责人：${res.deptNames.join('、')}`)
      return
    }
    ElMessage.success('发布成功!')
    dialogData.publishVisible = false
    await getCollection()
  } catch {}
}

/**
 * tree相关方法
 */
const selectValue = ref([])
const selectlabel = ref([])
const searchValue = ref('')
const selectRef = ref(null)
const treeRef = ref(null)
const displayTreeData = ref([])
const defaultProps = {
  children: 'children',
  label: 'name'
}
const treeData = ref([])
const selectOrgDialog = ref(false)

function openSelectOrgDailog() {
  selectlabel.value = []
  selectValue.value = []
  publishParams.assigneeDept = []
  selectOrgDialog.value = true
}

// 获取所有的组织
async function getAllOrgList() {
  try {
    const res = await getAllOrgApi()
    treeData.value = res
    displayTreeData.value = JSON.parse(JSON.stringify(treeData.value))
  } catch {}
}

const handleSearch = () => {
  if (!searchValue.value) {
    displayTreeData.value = JSON.parse(JSON.stringify(treeData.value))
    return
  }

  const flattenMatchedNodes = (nodes) => {
    let result = []
    nodes.forEach((node) => {
      if (node.name.includes(searchValue.value)) {
        result.push(node)
      } else if (node.children?.length) {
        result = result.concat(flattenMatchedNodes(node.children))
      }
    })
    return result
  }

  displayTreeData.value = flattenMatchedNodes(JSON.parse(JSON.stringify(treeData.value)))
}

const handleCheckChange = () => {
  const selectNodes = treeRef.value.getCheckedNodes()
  const nodes = selectNodes.filter((node) => !(node.children && node.children.length > 0))
  selectValue.value = nodes.map((node) => ({ assigneeDeptName: node.name, assigneeDeptId: node.id }))
  selectlabel.value = nodes.map((node) => ({ label: node.name, value: node.id }))
}

function confirmSelection() {
  publishParams.assigneeDept = selectValue.value
  selectOrgDialog.value = false
}

/**
 * 填报情况相关
 */
const submitParams = reactive({
  tableName: [],
  tableDetails: []
})

const currentTaskInfo = ref(null)
const isTableDetails = ref(false)

async function submitDetail(val) {
  isTableDetails.value = false
  dialogData.submitVisible = true
  currentTaskInfo.value = val
  try {
    const res = await getColFillProgressApi({ taskId: val.id })
    submitParams.tableName = res
  } catch {}
}

async function getFillDetails(row) {
  isTableDetails.value = true
  try {
    submitParams.tableDetails = row.progressList;
  } catch {}
}

// 导出单个表格汇总
async function exportCollectionTable(row: any) {
  try {
    const fileNameWithExt = `${row.tableName}.xlsx`
    await downloadFile(`${import.meta.env.VITE_NSOSFS}/collectionBase/exportTableExcel`, { tableId: row.tableId }, fileNameWithExt, 'post')
  } catch {}
}

// 导出当前任务所有文件
async function exportCollectionTables(taskData) {
  try {
    const fileNameWithExt = `${currentTaskInfo.value.taskName}.zip`
    await downloadFile(`${import.meta.env.VITE_NSOSFS}/collectionBase/exportTaskZip`, { taskId: currentTaskInfo.value.id }, fileNameWithExt, 'post')
  } catch {}
}


/**
 * 分页查询
 */
const handleSizeChange = (val) => {
  data.pageInfo.pageSize = val
  getCollection()
}

const handleCurrentChange = (val) => {
  data.pageInfo.pageNo = val
  getCollection()
}
</script>

<template>
  <div>
    <div>
      <el-form :inline="true" :model="queryForm" label-position="right">
        <el-form-item label="收资名称:">
          <el-input v-model="queryForm.taskName" style="width: 200px" clearable maxlength="50" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="getCollection()">搜索</el-button>
          <el-button type="success" :icon="Plus" @click="$refs.insertModal.open()">新增</el-button>
          <el-button type="danger" :icon="Delete" @click="batchDelete">删除</el-button>
          <el-button type="info" @click="reset()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table ref="tab" :data="data.tableData" border stripe height="560px" @selection-change="handleSelectionChange">
        <el-table-column type="index" />
        <el-table-column type="selection" />
        <el-table-column prop="taskName" align="center" label="收资名称" />
        <el-table-column prop="creatorName" align="center" label="创建人" />
        <el-table-column prop="createTime" align="center" label="创建时间">
          <template #default="scope">
            {{ moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column prop="tableCount" align="center" label="表格数量" />
        <el-table-column align="center" label="状态">
          <template #default="scope">
            <el-tag type="danger" v-if="scope.row.status === '0'">待发布</el-tag>
            <el-tag type="success" v-if="scope.row.status === '1'">收资中</el-tag>
            <el-tag type="success" v-if="scope.row.status === '2'">收资完成</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="300px">
          <template #default="scope">
            <el-button type="primary" link @click="$refs.detailModal.open(scope.row)">查看详情</el-button>
            <el-button type="primary" link @click="publishTask(scope.row)" v-if="scope.row.status === '0'">任务发布</el-button>
            <el-button type="primary" link @click="submitDetail(scope.row)" v-if="scope.row.status !== '0'"> 填报情况 </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin-top: 10px">
      <el-pagination v-model:current-page="data.pageInfo.pageNo" v-model:page-size="data.pageInfo.pageSize" :total="data.pageInfo.total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <!-- 弹窗区域 -->
    <DetailModal ref="detailModal" v-model:visible="editModalVisible" :date-type="dateType" @refresh="getCollection" />
    <InsertModal ref="insertModal" v-model:visible="insertModalVisible" :date-type="dateType" @refresh="getCollection" />

    <!-- 发布任务弹窗 -->
    <el-dialog v-model="dialogData.publishVisible" title="任务发布" width="1000" class="system-detail-dialog">
      <el-form ref="publishForm" :model="publishParams" :rules="publishRules" label-width="auto" style="margin: 10px 0 0 20px">
        <el-form-item label="截止时间:" prop="date" required>
          <el-date-picker v-model="publishParams.date" type="datetime" placeholder="请选择时间" value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss" style="width: 800px" />
        </el-form-item>
        <el-form-item label="选择单位:" prop="assigneeDept" style="width: 100%" required>
          <el-select v-model="publishParams.assigneeDept" placeholder="请选择" style="width: 800px" multiple @click="openSelectOrgDailog" :teleported="false" class="custom-el-select-class1">
            <el-option v-for="item in selectlabel" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item class="dialog-footer">
          <el-button @click="dialogData.publishVisible = false">取消</el-button>
          <el-button type="primary" @click="submitPublishForm">确定</el-button>
        </el-form-item>
      </el-form>

      <el-dialog v-model="selectOrgDialog" title="选择单位" width="600px">
        <div>
          <el-input v-model="searchValue" placeholder="请输入搜索内容" clearable @keyup.enter="handleSearch" style="width: 565px; margin-bottom: 10px">
            <template #append>
              <el-button :icon="Search" @click="handleSearch" />
            </template>
          </el-input>
          <el-card shadow="never">
            <el-tree :data="displayTreeData" :props="defaultProps" default-expand-all node-key="id" show-checkbox :check-strictly="false" :expand-on-click-node="true" ref="treeRef" @check-change="handleCheckChange" style="height: 500px; overflow-y: auto">
              <template #default="{ node, data }">
                <span :class="{ 'special-node': data.id === selectValue }">
                  {{ node.label }}
                </span>
              </template>
            </el-tree>
          </el-card>
        </div>

        <template #footer>
          <el-button @click="selectOrgDialog = false">取消</el-button>
          <el-button type="primary" @click="confirmSelection">确认</el-button>
        </template>
      </el-dialog>
    </el-dialog>

    <!-- 填报情况弹窗 -->
    <el-dialog v-model="dialogData.submitVisible" title="收资填报情况" width="1000" class="system-detail-dialog">
      <div v-if="!isTableDetails">
        <el-table :data="submitParams.tableName" border stripe height="500px">
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column prop="tableName" align="center" label="表格名称" />
          <el-table-column prop="collectionNumber" align="center" label="填报部门数" />
          <el-table-column prop="collectedNumber" align="center" label="已填报部门数" />
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <el-button type="primary" link @click="getFillDetails(scope.row)">查看详情</el-button>
              <el-button type="primary" link @click="exportCollectionTable(scope.row)">导出</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" :icon="Histogram" style="margin-top: 10px" @click="exportCollectionTables(submitParams.tableName)">导出</el-button>
      </div>
      <div v-else>
        <el-table :data="submitParams.tableDetails" border stripe height="500px">
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column prop="deptName" align="center" label="部门名称" />
          <el-table-column align="center" label="填报情况">
            <template #default="scope">
              {{ scope.row.status === '0' ? '未填报' : ' 已填报' }}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template #footer>
        <el-button v-if="!isTableDetails" @click="dialogData.submitVisible = false">关闭</el-button>
        <el-button v-if="isTableDetails" @click="isTableDetails = false">返回</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.custom-el-select-class1 {
  :deep(.el-select-dropdown) {
    display: none;
  }

  :deep(el-popper__arrow:before) {
    display: none;
  }
}

:deep(.el-select-dropdown__item) {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dialog-footer {
  margin-left: calc(100% - 135px);
}

:deep(.el-tag.el-tag--success) {
  --el-tag-border-color: #a7e7c4;
  --el-tag-hover-color: var(--el-color-success);
}

:deep(.el-tag.el-tag--danger) {
  --el-tag-border-color: #ea879a;
}

:deep(.el-tag) {
  --el-tag-border-radius: 0px;
}

:deep(.el-dialog__title) {
  color: black;
  font-size: 20px;
  font-weight: 500;
}
</style>
