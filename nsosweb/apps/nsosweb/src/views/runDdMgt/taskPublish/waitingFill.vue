<template>
  <el-container class="h-full bg-white">
    <el-header height="45px">
      <el-form label-width="80px" ref="ruleFormRef" :model="data.formData" :inline="true"  label-position="right" class="demo-form-inline mt-1">
        <el-row>
          <el-col :span="4">
            <el-form-item label="任务名称:" prop="tasksName">
              <el-input v-model="data.formData.tasksName" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button type="primary"  :icon="Search" @click="query(null)">查询</el-button>
            <el-button type="info" plain  :icon="RefreshLeft" @click="refreshClick">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-main style="height: calc(100% - 75px)">
      <el-table :data="data.tableData" border size="small" style="height: calc(100% - 35px)" ref="taskTab">
        <el-table-column type="index" fixed width="40" label="#" align="center" />
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="tasksName" label="任务名称" align="center" />
        <el-table-column prop="dutyStartTime" label="排班开始时间" align="center" :formatter="tDateTimeFormat" />
        <el-table-column prop="dutyEndTime" label="排班结束时间" align="center" :formatter="tDateTimeFormat" />
        <el-table-column prop="doneLine" label="完成时限" align="center" :formatter="tDateTimeFormat" />
        <el-table-column prop="completeCount" label="已填报" align="center">
          <template #default="scope">
            <span class="primary complete-count" @click="showUnitInfo(scope.row.id, '2', scope.row.tasksName)">{{ scope.row.completeCount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="imcompleteCount" label="待填报" align="center">
          <template #default="scope">
            <span class="primary complete-count" @click="showUnitInfo(scope.row.id, '1', scope.row.tasksName)">{{ scope.row.imcompleteCount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="showAllUnitInfo(scope.row.id, scope.row.tasksName)">查看详情</el-button>
            <el-button link type="primary" size="small" @click="urgeAllUnit(scope.row.id, scope.row.tasksName)">一键督办</el-button>
            <el-button link type="danger" size="small" @click="withdraw(scope.row)">撤回</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer height="40px">
      <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" class="mt-1" :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="currentChange" />
    </el-footer>
  </el-container>
  <Modal class="h-[800px] w-[1600px]" style="overflow: hidden" title="排班预览" :footer="false" :closeOnClickModal="false" :draggable="true" zIndex="9999">
    <task-roster :task-id="data.taskId" :unit-id="data.unitId" />
  </Modal>
  <ModalB class="h-[500px] w-[800px]" title="填报情况" :footer="false" :closeOnClickModal="false" :draggable="true">
    <el-table :data="data.unitData" border size="small" style="height: 100%">
      <el-table-column type="index" width="40" label="#" align="center" />
      <el-table-column prop="deptName" label="单位名称" width="250" align="center" />
      <el-table-column prop="writePerson" v-if="data.type === '2'" label="填报人" align="center" />
      <el-table-column label="填报时间" v-if="data.type === '2'" align="center">
        <template #default="props">
          <span v-if="props.row.status == '2'">{{ formatDateTime(props.row.writeTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="是否填报" align="center">
        <template #default="props">
          <span v-if="props.row.status == '2'" class="primary">已填报</span>
          <span v-else class="text-red-600">未填报</span>
        </template>
      </el-table-column>
    </el-table>
  </ModalB>
  <ModalC class="h-[500px] w-[800px]" title="填报情况" :footer="false" :closeOnClickModal="false" :draggable="true">
    <el-table :data="data.allUnitData" border size="small" style="height: 100%">
      <el-table-column type="index" width="40" label="#" align="center" />
      <el-table-column prop="deptName" label="单位名称" width="250" align="center" />
      <el-table-column prop="status" label="是否填报" align="center">
        <template #default="props">
          <span v-if="props.row.status == '2'">已填报</span>
          <span v-else>未填报</span>
        </template>
      </el-table-column>
      <el-table-column label="填报时间" align="center">
        <template #default="props">
          <span v-if="props.row.status == '2'">{{ formatDateTime(props.row.writeTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="props">
          <div style="display: flex; gap: 10px; justify-content: center">
            <span v-if="props.row.status == '2'" class="primary option-text" @click="openPreviewDialog(props.row.deptCode)">查看内容</span>
            <span v-if="props.row.status == '2'" class="text-red-600 option-text" @click="returnUnit(props.row.id)">回退</span>
            <span v-else class="text-red-600 option-text" @click="urgeUnit(props.row.deptCode)">催办</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </ModalC>
</template>
<script setup>
import { ref, reactive, onMounted, watch, defineExpose } from 'vue'
import { ElContainer, ElHeader, ElMain, ElFooter, ElRow, ElCol, ElTable, ElForm, ElFormItem, ElButton, ElPagination, ElMessageBox, ElMessage, ElNotification } from 'element-plus'
import { tDateFormat, tDateTimeFormat, formatDrop, formatDateTime } from '#/utils/commonUtil.ts'
import { queryFilling, deleteTaskApi, queryUnitInfo, urgeUnitApi, urgeAllUnitApi, returnUnitApi, withdrawFilling } from './taskPublishMethod.ts'
import { useVbenModal } from '@vben/common-ui'
import PublishTask from './publishTask.vue'
import taskRoster from './taskRoster.vue'
import { Search, RefreshLeft, Plus, Delete } from '@element-plus/icons-vue'

const emit = defineEmits(['updateTatol'])
const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close()
  }
})

const [ModalB, modalApiB] = useVbenModal({
  onCancel() {
    modalApiB.close()
  }
})

const [ModalC, modalApiC] = useVbenModal({
  onCancel() {
    modalApiC.close()
  }
})

const data = reactive({
  formData: {},
  tableData: [],
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0
  },
  unitData: [],
  allUnitData: [],
  type: null,
  taskName: null,
  taskId: null
})
const taskTab = ref()
const activeName = defineModel('activeName')
onMounted(async () => {
  query()
})

// watch(activeName, (newVal) => {
//   if(activeName.value === 'waitingFill') {
//     query();
//   }
// });

const query = async () => {
  data.formData.pageSize = data.pageInfo.pageSize
  data.formData.pageNo = data.pageInfo.pageNo
  const { list, count, pageNo } = await queryFilling(data.formData)
  data.tableData = list
  data.pageInfo.pageNo = pageNo
  data.pageInfo.total = count
  emit('updateTatol', '2', count)
}

defineExpose({
  query
})

function refreshClick() {
  data.formData.tasksName = ''
}

const batchDel = async () => {
  if (taskTab.value.getSelectionRows().length === 0) {
    ElMessage.warning('请先选择要删除的任务')
    return
  }
  ElMessageBox.confirm('确定要删除这些任务吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await deleteTaskApi(taskTab.value.getSelectionRows())
      query()
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}

const closeModal = async () => {
  modalApi.close()
}

const showUnitInfo = async (id, type, tasksName) => {
  if (type === '1') {
    data.type = '1'
  } else {
    data.type = '2'
  }
  modalApiB.open()
  let params = { dutyTaskId: id, status: type }
  let list = await queryUnitInfo(params)
  data.unitData = list
}

const urgeUnit = async (deptCode) => {
  let params = { orgCode: deptCode, taskName: data.taskName }
  try {
    await urgeUnitApi(params)
    ElMessage.success('催办成功!')
  } catch (error) {
    ElMessage.error('催办失败!')
  }
}

const urgeAllUnit = async (id, taskName) => {
  let params = { dutyTaskId: id, tasksName: taskName }
  try {
    await urgeAllUnitApi(params)
    ElMessage.success('一键督办成功!')
  } catch (error) {
    ElMessage.error('一键督办失败!')
  }
}

const showAllUnitInfo = async (id, tasksName) => {
  modalApiC.open()
  data.taskName = tasksName
  data.taskId = id
  let params = { dutyTaskId: id, status: null }
  let list = await queryUnitInfo(params)
  data.allUnitData = list
}

const returnUnit = async (unitId) => {
  ElMessageBox.confirm('确定要回退该单位吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      const unitIdList = []
      unitIdList.push(unitId)
      let params = { unitIdList: unitIdList, dutyTaskId: data.taskId }
      await returnUnitApi(params)
      params = { dutyTaskId: data.taskId, status: null }
      let list = await queryUnitInfo(params)
      data.allUnitData = list
      await query()
      emit('refreshList', 'publish')
    })
    .catch(() => {})
}

const openPreviewDialog = async (deptCode) => {
  data.unitId = deptCode
  modalApi.open()
}

const handleSizeChange = (val) => {
  data.pageInfo.pageSize = val
  query()
}

const currentChange = (val) => {
  data.pageInfo.pageNo = val
  query()
}

const withdraw = (row) => {
  ElMessageBox.confirm('确认是否撤回选中的记录? ', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await withdrawFilling(row)
    query()
    ElNotification({
      title: '提示',
      message: '撤回成功！',
      type: 'success'
    })
  })
}
</script>
<style scoped>
.option-text {
  cursor: pointer;
}

.primary {
  color: hsl(var(--primary));
}

.complete-count {
  cursor: pointer;
}

.complete-count:hover {
  text-decoration: underline;
}

.demo-form-inline {
  margin-top: 6px;
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

:deep(.el-tabs) {
  --el-tabs-header-height: 30px;
}

:deep(.el-tabs__item) {
  font-size: 12px;
}

:deep(.el-tabs__header) {
  margin-bottom: 4px;
}
</style>
