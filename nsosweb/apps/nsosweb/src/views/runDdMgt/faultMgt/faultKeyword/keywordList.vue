<template>
  <el-container class="h-full bg-white">
    <el-header height="50px">
      <el-form label-width="100px" :model="data.formData" :inline="true" label-position="right" class="demo-form-inline mt-2">
        <el-row>
          <el-col :span="12">
            <el-form-item label="故障关键字:" prop="keywordContent">
              <el-input v-model="data.formData.keywordContent" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="padding-left: 20px">
            <el-button type="primary" class="ml-4" :icon="Search" @click="query">查询</el-button>
            <el-button type="primary" class="ml-4" :icon="Plus" @click="add">新增</el-button>
            <el-button type="primary" class="ml-4" :icon="Delete" @click="batchDelete">批量删除</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-main style="height: calc(100% - 95px)">
      <el-table
        ref="scheduleListTable"
        :data="data.tableData"
        border
        size="small"
        @selection-change="handleSelectionChange"
        style="height: 100%"
        stripe
        :header-cell-style="{
          backgroundColor: '#F2F3F5',
          color: '#666666',
          fontSize: '14px',
          height: '40px',
          textAlign: 'center'
        }"
      >
        <el-table-column type="selection" align="center" />
        <el-table-column type="index" label="#" align="center" width="50" />
        <el-table-column prop="keywordContent" label="关键字" />
        <el-table-column prop="updatorName" label="最后修改人" align="center" width="100" />
        <el-table-column prop="updateTime" label="最后修改时间" :formatter="tDateTimeFormat" align="center" width="130" />
        <el-table-column label="操作" align="center" width="100">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="edit(scope.row)">编辑</el-button>
            <el-button link type="danger" size="small" @click="batchDeleteOne(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer height="45px">
      <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" class="mt-1" :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="currentChange"></el-pagination>
    </el-footer>

    <Modal class="h-[280px] w-[660px] top-[220px]" title="故障关键字信息" :footer="false" :closeOnClickModal="false" :draggable="true">
      <keyword-detail :id="data.currentId" @close="closeDiaLog" @refresh="refreshData" />
    </Modal>
  </el-container>
</template>
<script setup>
import { Search, Delete, Plus } from '@element-plus/icons-vue'
import { ElForm, ElFormItem, ElRow, ElCol, ElTable, ElTableColumn, ElPagination, ElMain, ElContainer, ElHeader, ElFooter, ElMessageBox, ElMessage } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
import { tDateTimeFormat } from '#/utils/commonUtil.ts'
import { queryByPage, remove } from './faultKeywordSelectMethod.ts'
import { useVbenModal } from '@vben/common-ui'
import keywordDetail from './keywordDetail.vue'

const emit = defineEmits(['close', 'refresh'])

onMounted(async () => {
  query()
})
const selectedRows = ref([])

const data = reactive({
  tableData: [],
  formData: {
    keywordContent: '',
    sortNames: ['updateTime'],
    sortTypes: ['asc']
  },
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0
  },
  currentId: ''
})

const query = async () => {
  data.formData.pageSize = data.pageInfo.pageSize
  data.formData.pageNo = data.pageInfo.pageNo
  const { list, pageNo, count } = await queryByPage(data.formData)
  data.tableData = list
  data.pageInfo.pageNo = pageNo
  data.pageInfo.total = count
}

const handleSelectionChange = (val) => {
  selectedRows.value = val
}

const handleSizeChange = (val) => {
  data.pageInfo.pageSize = val
  query()
}

const currentChange = (val) => {
  data.pageInfo.pageNo = val
  query()
}

const add = () => {
  data.currentId = ''
  modalApi.open()
}

const closeDiaLog = () => {
  modalApi.close()
}

const edit = (row) => {
  data.currentId = row.id
  modalApi.open()
}

const batchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要删除的数据')
    return
  }
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

const batchDeleteOne = (row) => {
  ElMessageBox.confirm('确定要删除吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      batchDeleteOnes(row)
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}
const batchDeleteOnes = async (row) => {
  try {
    const selectedRows = ref([])
    selectedRows.value.push(row)
    await remove(selectedRows.value)
    ElMessage.success('删除成功！')
    selectedRows.value = []
    refreshData()
  } catch (error) {
    ElMessage.error('删除失败！')
  }
}

const batchDeleteBatch = async () => {
  try {
    await remove(selectedRows.value)
    ElMessage.success('删除成功！')
    selectedRows.value = []
    refreshData()
  } catch (error) {
    ElMessage.error('删除失败！')
  }
}

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close()
  }
})

// 刷新数据
const refreshData = async () => {
  query()
  emit('refresh')
}
</script>
<style scoped>
.primary {
  color: hsl(var(--primary));
}

.clickable {
  cursor: pointer;
}

.demo-form-inline .el-input {
  --el-input-width: 100%;
}

.demo-form-inline .el-select {
  --el-select-width: 100%;
}

:deep(.el-form--inline .el-form-item) {
  width: calc(100% - 20px);
  margin-right: 20px;
  margin-bottom: 12px;
}

:deep(.el-main) {
  padding: 0;
}
</style>
