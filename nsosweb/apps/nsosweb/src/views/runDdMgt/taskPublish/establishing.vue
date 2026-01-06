<template>
  <el-container class="h-full bg-white">
    <el-header height="45px">
      <el-form label-width="80px" ref="ruleFormRef" :model="data.formData" :inline="true" label-position="right" class="demo-form-inline mt-1">
        <el-row>
          <el-col :span="4">
            <el-form-item label="任务名称:" prop="tasksName">
              <el-input v-model="data.formData.tasksName" clearable  />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" :icon="Search" @click="query()" >查询</el-button>
            <el-button  type="primary" @click="addTask" :icon="Plus">新增</el-button>
            <el-button  type="primary" @click="batchDel" :icon="Delete">批量删除</el-button>
            <el-button type="info"  plain :icon="RefreshLeft" @click="refreshClick">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-main style="height: calc(100% - 75px)">
      <el-table :data="data.tableData" border ref="taskTab" size="small" style="height: 100%">
        <el-table-column type="index" fixed width="40" label="#" align="center" />
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="tasksName" label="任务名称" align="center" />
        <el-table-column prop="dutyStartTime" :formatter="tDateTimeFormat" label="排班开始时间" align="center" />
        <el-table-column prop="dutyEndTime" :formatter="tDateTimeFormat" label="排班结束时间" align="center" />
        <el-table-column prop="doneLine" label="完成时限" align="center" :formatter="tDateTimeFormat" />
        <el-table-column prop="creatorId" label="创建人" align="center" />
        <el-table-column prop="createTime" label="创建时间" align="center" :formatter="tDateTimeFormat" />
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="publichRowTask(scope.row)">发布</el-button>
            <el-button link type="primary" size="small" @click="openDetail(scope.row)">编辑</el-button>
            <el-button link type="primary" size="small" @click="openPreviewDialog(scope.row)">预览</el-button>
            <el-button link type="danger" size="small" @click="deleteRow(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer height="40px">
      <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" class="mt-1" :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="currentChange" />
    </el-footer>
  </el-container>
  <Modal class="h-[500px] w-[800px]" title="发布任务" :footer="false" :closeOnClickModal="false" :draggable="true">
    <PublishTask @closeModal="closeModal" :taskData="data.taskData" :canSave="data.canSave" />
  </Modal>
  <ModalB class="h-[800px] w-[1600px]" style="overflow: hidden" title="排班预览" :footer="false" :closeOnClickModal="false" :draggable="true">
    <task-preview :templateId="data.templateId" />
  </ModalB>
</template>
<script setup>
import { ref, reactive, onMounted, watch, defineExpose } from 'vue'
import { ElInput, ElContainer, ElHeader, ElMain, ElFooter, ElRow, ElCol, ElTable, ElForm, ElFormItem, ElButton, ElPagination, ElDatePicker, ElSelect, ElOption, ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { useVbenModal } from '@vben/common-ui'
import { tDateFormat, tDateTimeFormat, formatDrop, lookFlow } from '#/utils/commonUtil.ts'
import { useDropStore } from '#/store'
import { queryEstablish, deleteTaskApi, publichRowTaskApi, queryTemplateApi } from './taskPublishMethod.ts'
import PublishTask from './publishTask.vue'
import { Search, RefreshLeft, Plus, Delete } from '@element-plus/icons-vue'
import taskRoster from './taskRoster.vue'
import taskPreview from './taskPreview.vue'

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
const emit = defineEmits(['updateTatol','refreshList'])
const dropList = reactive({})
const activeName = defineModel('activeName');
const data = reactive({
  formData: {},
  tableData: [],
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0
  },
  taskData: {},
  canSave: false,
  templateId: null,
})
const taskTab = ref()

onMounted(async () => {
  query()
})

// watch(activeName, (newVal) => {
//   if(activeName.value === 'establishing') {
//     query();
//   }
// });

const openDetail = async(row) => {
  data.taskData = row;
  data.canSave = false;
  modalApi.open();
}

const addTask = async() => {
  data.taskData = {};
  data.canSave = true;
  modalApi.open();
}

const publichRowTask = async (row) => {
  try {
    await publichRowTaskApi(row)
    query()
    emit('refreshList','publish')
    ElNotification({
      title: '提示',
      message: '发布成功！',
      type: 'success',
    })
  } catch (error) {
    ElMessage.error('发布失败！')
  }
}

const query = async () => {
  data.formData.pageSize = data.pageInfo.pageSize
  data.formData.pageNo = data.pageInfo.pageNo
  const { list, count, pageNo } = await queryEstablish(data.formData)
  data.tableData = list
  data.pageInfo.pageNo = pageNo
  data.pageInfo.total = count
  emit('updateTatol', '1', count)
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

const deleteRow = async (row) => {
  ElMessageBox.confirm('确定要删除该任务吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      const deleteList = []
      deleteList.push(row)
      await deleteTaskApi(deleteList)
      query()
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}

const closeModal = async () => {
  modalApi.close()
  query()
  emit('refreshList','publish')
  emit('refreshList','save')
}

const handleSizeChange = (val) => {
  data.pageInfo.pageSize = val
  query()
}

const currentChange = (val) => {
  data.pageInfo.pageNo = val
  query()
}

const openPreviewDialog = async (row) => {
  data.templateId = row.templateId
  modalApiB.open()
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
