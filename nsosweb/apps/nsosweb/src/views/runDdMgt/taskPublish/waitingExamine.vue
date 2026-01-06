<template>
  <el-container class="h-full bg-white">
    <el-header height="45px">
      <el-form label-width="80px" ref="ruleFormRef" :model="data.formData" :inline="true" label-position="right" class="demo-form-inline mt-1">
        <el-row>
          <el-col :span="4">
            <el-form-item label="任务名称:" prop="tasksName">
              <el-input v-model="data.formData.tasksName" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" :icon="Search" @click="query">查询</el-button>
            <el-button type="info" plain :icon="RefreshLeft" @click="refreshClick">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-main style="height: calc(100% - 75px)">
      <el-table :data="data.tableData" border size="small" style="height: calc(100% - 35px)" ref="taskTab">
        <el-table-column type="index" fixed width="40" label="#" align="center" />
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="tasksName" label="任务名称" align="center" />
        <el-table-column prop="dutyStartTime" label="护网开始时间" align="center" :formatter="tDateTimeFormat" />
        <el-table-column prop="dutyEndTime" label="护网结束时间" align="center" :formatter="tDateTimeFormat" />
        <el-table-column prop="creatorId" label="创建人" align="center" />
        <el-table-column prop="createTime" label="创建时间" align="center" :formatter="tDateTimeFormat" />
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="openPreviewDialog(scope.row.id)">排班预览</el-button>
            <el-button link type="primary" size="small" @click="examineTask(scope.row.id)">审核通过</el-button>
            <el-button link type="danger" size="small" @click="returnTask(scope.row.id)">回退</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer height="40px">
      <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" class="mt-1" :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="currentChange" />
    </el-footer>
  </el-container>
  <Modal class="h-[500px] w-[800px]" title="回退" :footer="false" :closeOnClickModal="false" :draggable="true">
    <div style="height: calc(100% - 0.5rem); width: 100%">
      <el-header height="30px">
        <el-form label-width="80px" ref="ruleFormRef" :model="data.unitFormData" :inline="true" label-position="right" size="small" class="demo-form-inline mt-1">
          <el-row>
            <el-col :span="8">
              <el-form-item label="单位名称:" prop="deptName">
                <el-input v-model="data.unitFormData.deptName" size="small" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-button type="primary" :icon="Search" @click="queryUnit(data.taskId)" size="small">查询</el-button>
              <el-button type="danger" size="small" :icon="ZoomOut" @click="returnSelectedUnit">批量回退</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <el-main style="height: calc(100% - 30px); padding: 0">
        <el-table :data="data.unitData" border size="small" style="height: 100%" ref="unitTab">
          <el-table-column type="index" width="40" label="#" align="center" />
          <el-table-column type="selection" width="40" align="center" />
          <el-table-column prop="deptName" label="单位名称" width="250" align="center" />
          <el-table-column prop="writePerson" label="上报人" align="center" />
          <el-table-column label="上报时间" width="180" align="center">
            <template #default="props">
              <span v-if="props.row.status == '2'">{{ formatDateTime(props.row.writeTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="操作" align="center">
            <template #default="props">
              <el-button link type="danger" size="small" @click="returnUnit(props.row.id)">回退</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </div>
  </Modal>
  <ModalB class="h-[800px] w-[1600px]" style="overflow: hidden" title="排班预览" :footer="false" :closeOnClickModal="false" :draggable="true">
    <task-roster :task-id="data.selectItemId" />
  </ModalB>
</template>
<script setup>
import { ref, reactive, onMounted, watch, defineExpose } from 'vue'
import { ElContainer, ElHeader, ElMain, ElFooter, ElRow, ElCol, ElTable, ElForm, ElFormItem, ElButton, ElPagination, ElMessageBox, ElMessage } from 'element-plus'
import { queryExamine, examineTaskApi, queryUnitInfo, returnUnitApi } from './taskPublishMethod.ts'
import { useVbenModal } from '@vben/common-ui'
import PublishTask from './publishTask.vue'
import { tDateFormat, tDateTimeFormat, formatDateTime } from '#/utils/commonUtil.ts'
import { Search, ZoomOut, Plus, Delete, RefreshLeft } from '@element-plus/icons-vue'
import taskRoster from './taskRoster.vue'

const emit = defineEmits(['updateTatol','refreshList'])
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

const data = reactive({
  formData: {},
  TableData: [],
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0
  },
  selectItemId: null,
  unitData: [],
  taskId: null,
  unitFormData: {},
})
const taskTab = ref()
const unitTab = ref()
const activeName = defineModel('activeName');
onMounted(async () => {
  query()
})

// watch(activeName, (newVal) => {
//   if(activeName.value === 'waitingExamine') {
//     query();
//   }
// });

const query = async () => {
  data.formData.pageSize = data.pageInfo.pageSize
  data.formData.pageNo = data.pageInfo.pageNo
  const { list, count, pageNo } = await queryExamine(data.formData)
  data.tableData = list
  data.pageInfo.pageNo = pageNo
  data.pageInfo.total = count
  emit('updateTatol', '3', count)
}

defineExpose({
  query
})

const examineTask = async (taskId) => {
  ElMessageBox.confirm('确定审核通过该值班任务吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await examineTaskApi({ taskId: taskId })
      await query()
      emit('refreshList','examine')
    })
    .catch(() => {
      ElMessage.info('取消')
    })
}

const returnTask = async (taskId) => {
  modalApi.open()
  data.taskId = taskId
  await queryUnit(taskId)
}

const queryUnit = async (taskId) => {
  let params = { dutyTaskId: taskId, status: '2',deptName: data.unitFormData.deptName }
  let list = await queryUnitInfo(params)
  data.unitData = list
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
      await queryUnit(data.taskId)
      await query()
      emit('refreshList','publish')
    })
    .catch(() => {
      ElMessage.info('取消回退')
    })
}

const returnSelectedUnit = async () => {
  if (unitTab.value.getSelectionRows().length === 0) {
    ElMessage.warning('请先选择要回退的单位')
    return
  }
  ElMessageBox.confirm('确定要回退这些单位吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      const unitIdList = unitTab.value.getSelectionRows().map((item) => item.id)
      let params = { unitIdList: unitIdList, dutyTaskId: data.taskId }
      await returnUnitApi(params)
      await queryUnit()
      query()
    })
    .catch(() => {
      ElMessage.info('取消回退')
    })
}

function refreshClick() {
  data.formData.tasksName = ''
}

const openPreviewDialog = async (id) => {
  data.selectItemId = id
  modalApiB.open()
}

const closeModal = async () => {
  modalApi.close()
}

const handleSizeChange = (val) => {
  data.pageInfo.pageSize = val
  query()
}

const currentChange = (val) => {
  data.pageInfo.pageNo = val
  query()
}
</script>
<style scoped>
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
