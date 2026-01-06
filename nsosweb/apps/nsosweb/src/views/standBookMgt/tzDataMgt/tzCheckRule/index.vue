<template>
  <Page auto-content-height>
    <div class="w-full h-full">
      <el-container class="h-full bg-white">
        <el-header height="53px">
          <el-form label-width="100px" ref="ruleFormRef" :model="data.formData" :inline="true" label-position="right" class="demo-form-inline mt-[10px]">
            <el-row>
              <el-col :span="4">
                <el-form-item label="规则编号:" prop="ruleCode">
                  <el-input v-model="data.formData.ruleCode" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="规则名称:" prop="ruleName">
                  <el-input v-model="data.formData.ruleName" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-button type="primary" class="ml-4" :icon="Search" @click="query(null)">查询</el-button>
                <el-button type="primary" class="ml-4" :icon="Plus" @click="modalApiA.open()">新增</el-button>
                <el-button type="danger" class="ml-4" :icon="Delete" @click="batchDeleteClick">删除</el-button>
                <el-button type="info" plain class="ml-4" :icon="RefreshLeft" @click="refreshClick">重置</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-header>
        <el-main style="height: calc(100% - 93px)">
          <el-table ref="tableDataRef" :data="data.tableData" border show-overflow-tooltip style="height: 100%" stripe>
            <el-table-column type="selection" width="40" fixed align="center" />
            <el-table-column type="index" fixed width="45" label="#" align="center" />
            <el-table-column label="规则编码" fixed width="200" align="center">
              <template #default="scope">
                <span class="primary cmdcode" @click="editRule(scope.row)">{{ scope.row.ruleCode }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="ruleName" label="规则名称" align="left" header-align="center" />
            <el-table-column prop="ruleTableName" label="核查对象" width="120" align="center">
              <template #default="scope">
                {{ hcObject.filter((d) => d.value == scope.row.ruleTableName)[0]?.label }}
              </template>
            </el-table-column>
            <el-table-column prop="ruleColumnName" label="核查字段" width="120" align="center" >
              <template #default="scope">
                {{ hcColumn.filter((d) => d.value == scope.row.ruleColumnName)[0]?.label }}
              </template>
            </el-table-column>
            <el-table-column prop="ruleContent" label="核查规则(正则表达式)" width="250" align="left" header-align="center" />
            <el-table-column prop="ruleDescribe" label="规则说明" width="250" align="left" header-align="center" />
            <el-table-column prop="isReverse" column-key="NSOS_YES_OR_NO" :formatter="formatDrop" label="是否取反" width="120" align="center" />
            <el-table-column prop="remark" label="备注" width="300" align="left" header-align="center" />
            <el-table-column label="操作" width="65" align="center">
              <template #default="scope">
                <div class="text-[red] cursor-pointer hover:underline" @click="deleteClick(scope.$index)">删除</div>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
        <ElFooter height="40px">
          <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" class="mt-1" :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="currentChange"></el-pagination>
        </ElFooter>
      </el-container>
      <ModalA class="w-[700px] h-[450px]" :title="data.dataId ? '编辑' : '添加'" :footer="false" :closeOnClickModal="false" :draggable="true">
        <AddCheckRule :dataId="data.dataId" @close="modalApiA.close()" @ok="addok"></AddCheckRule>
      </ModalA>
    </div>
  </Page>
</template>
<script setup>
import { Page } from '@vben/common-ui'
import { onMounted, reactive, ref, watch, nextTick } from 'vue'
import { ElForm, ElFormItem, ElRow, ElCol, ElTable, ElTableColumn, ElPagination, ElMain, ElContainer, ElHeader, ElFooter, ElMessageBox, ElMessage, ElNotification  } from 'element-plus'
import { Search, RefreshLeft, Plus, Delete, Download, Operation, Notification } from '@element-plus/icons-vue'
import { tDateFormat, formatDateTime, tDateTimeFormat, formatDrop } from '#/utils/commonUtil.ts'
import { useDropStore } from '#/store'
import { useVbenModal } from '@vben/common-ui'
import AddCheckRule from './addCheckRule.vue'
import { requestClient } from '#/api/request'

const queryState = defineModel('queryState')
const [ModalA, modalApiA] = useVbenModal({
  onCancel() {
    modalApiA.close()
  }
})

const data = reactive({
  tableData: [],
  formData: {},
  dataId: null,
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0
  }
})
const hcObject = [
  { label: '系统信息', value: '1' },
  { label: '物理机', value: '2' },
  { label: '容器', value: '3' },
  { label: '组件信息', value: '4' }
]
const hcColumn = [
  {label: '系统名称', value: 'SYSTEM_NAME'},
  {label: 'IP', value: 'IP'},
] 
const tableDataRef = ref()
const dropList = reactive({})
onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = ['NSOS_YES_OR_NO']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)
  query(true)
})

const query = async (showmask) => {
  data.formData.pageSize = data.pageInfo.pageSize
  data.formData.pageNo = data.pageInfo.pageNo

  const { list, count, pageNo } = await requestClient.post(import.meta.env.VITE_BASIC + '/filesCheckRule/queryData', data.formData)
  data.tableData = list
  data.pageInfo.pageNo = pageNo
  data.pageInfo.total = count

}
const handleSizeChange = (val) => {
  data.pageInfo.pageSize = val
  query()
}
const currentChange = (val) => {
  data.pageInfo.pageNo = val
  query()
}
const editRule = (row) => {
  data.dataId = row.id
  modalApiA.open()
}
const refreshClick = () => {
  data.formData = {}
}
const addok = () => {
  query()
  modalApiA.close()
}
const deleteClick = (index) => {
  let ids = data.tableData[index].id
  ElMessageBox.confirm('确认是否删除选中的记录? ', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    if (ids != '') {
      await requestClient.get(import.meta.env.VITE_BASIC + '/filesCheckRule/deleteData', { params: { ids: ids } })
    }
    ElNotification({
      title: '提示',
      message: '删除成功！',
      type: 'success'
    })
    data.tableData.splice(index, 1)
  })
}
const batchDeleteClick = () => {
  let rows = tableDataRef.value.getSelectionRows()

  if (rows.length == 0) {
    ElMessage.warning('请勾选记录！')
    return
  }
  let ids = ''
  rows.forEach((r) => {
    if (r.id) {
      ids += r.id + ','
    }
  })
  ElMessageBox.confirm('确认是否删除选中的记录? ', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    if (ids != '') {
      await requestClient.get(import.meta.env.VITE_BASIC + '/filesCheckRule/deleteData', { params: { ids: ids.substring(0, ids.length - 1) } })
    }
    ElNotification({
      title: '提示',
      message: '删除成功！',
      type: 'success'
    })
    rows.forEach((r) => {
      for (let i = 0; i < data.tableData.length; i++) {
        if (r.id && data.tableData[i].id == r.id) {
          data.tableData.splice(i, 1)
        }
      }
    })
  })
}

const toExcelClick = async () => {
  data.formData.pageSize = data.pageInfo.pageSize
  data.formData.pageNo = data.pageInfo.pageNo
  toExcel(data.formData, '指令管理导出excel.xlsx')
}

defineExpose({})
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

:deep(.el-popper) {
  max-width: 600px !important;
}

.primary {
  color: hsl(var(--primary));
}

.cmdcode {
  cursor: pointer;
}

.cmdcode:hover {
  text-decoration: underline;
}
</style>
