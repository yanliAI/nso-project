<template>
  <Page auto-content-height>
    <div class="w-full h-full">
      <el-container class="h-full bg-white">
        <el-header height="53px">
          <el-form label-width="100px" ref="ruleFormRef" :model="data.formData" :inline="true" label-position="right" class="demo-form-inline mt-[10px]">
            <el-row>
              <el-col :span="4">
                <el-form-item label="系统编号:" prop="systemNo">
                  <el-input v-model="data.formData.systemNo" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="系统名称:" prop="systemName">
                  <el-input v-model="data.formData.systemName" clearable />
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
            <el-table-column type="selection" width="40" fixed align="center" v-if="!disabled" />
            <el-table-column type="index" fixed width="45" label="#" align="center" />
            <el-table-column label="系统编号" fixed width="250" align="center">
              <template #default="scope">
                <span class="primary cmdcode" @click="editRule(scope.row)">{{ scope.row.systemNo }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="systemName" label="系统名称" width="300" align="left" header-align="center" />
            <el-table-column prop="sysLevel" label="系统等级" column-key="NSOS_SYS_LEVEL" :formatter="formatDrop" align="center" width="150" />
            <el-table-column prop="sysUserNum" label="系统用户总数" width="120" align="center" />
            <el-table-column prop="businessUnit" label="业务所属单位" align="center" width="140" />
            <el-table-column prop="businessDept" label="业务所属部门" align="center" width="140" />
            <el-table-column prop="usingUnit" label="使用单位" align="center" width="140" />
            <el-table-column prop="disLevel" label="调管层级" width="100" align="center" />
            <el-table-column prop="operateOrg" label="运维单位" align="center" width="140" />
            <el-table-column prop="operateSubOrg" label="运维下属单位" align="center" width="140" />
            <el-table-column prop="deviceOwner" label="设备主人" align="center" width="120" />
            <el-table-column prop="ip" label="IP地址" width="250" align="center" />
            <el-table-column label="操作" width="65" fixed="right" align="center">
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
      <ModalA class="w-[800px] h-[410px]" :title="data.sysId ? '编辑' : '添加'" :footer="false" :closeOnClickModal="false" :draggable="true">
        <AddSystemInfo :sysId="data.sysId" @close="modalApiA.close()" @ok="addok"></AddSystemInfo>
      </ModalA>
    </div>
  </Page>
</template>
<script setup>
import { Page } from '@vben/common-ui'
import { onMounted, reactive, ref, watch, nextTick } from 'vue'
import { ElForm, ElFormItem, ElRow, ElCol, ElTable, ElTableColumn, ElPagination, ElMain, ElContainer, ElHeader, ElFooter, ElMessageBox, ElMessage, ElNotification } from 'element-plus'
import { Search, RefreshLeft, Plus, Delete, Download, Operation, Notification } from '@element-plus/icons-vue'
import { tDateFormat, formatDateTime, tDateTimeFormat, formatDrop } from '#/utils/commonUtil.ts'
import { useDropStore } from '#/store'
import { useVbenModal } from '@vben/common-ui'
import AddSystemInfo from './addSystemInfo.vue'
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
  sysId: null,
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0
  }
})
const tableDataRef = ref()
const dropList = reactive({})
onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = ['NSOS_SYS_LEVEL', 'NSOS_ORG_NAME', 'NSOS_OPERATE_ORG']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)

  query(true)
})

const query = async (showmask) => {
  data.formData.pageSize = data.pageInfo.pageSize
  data.formData.pageNo = data.pageInfo.pageNo

  const { list, count, pageNo } = await requestClient.post(import.meta.env.VITE_BASIC + '/systemInfo/queryData', data.formData)
  data.tableData = list
  data.pageInfo.pageNo = pageNo
  data.pageInfo.total = count
}
const addok = () => {
  query()
  modalApiA.close()
}
const editRule = (row) => {
  data.sysId = row.id
  modalApiA.open()
}
const refreshClick = () => {
  data.formData = {}
}
const handleSizeChange = (val) => {
  data.pageInfo.pageSize = val;
  query();
};
const currentChange = (val) => {
  data.pageInfo.pageNo = val;
  query();
};
const deleteClick = (index) => {
  let ids = data.tableData[index].id
  ElMessageBox.confirm('确认是否删除选中的记录? ', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    if (ids != '') {
      await requestClient.get(import.meta.env.VITE_BASIC + '/systemInfo/deleteSys', { params: { ids: ids } })
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
      await requestClient.get(import.meta.env.VITE_BASIC + '/systemInfo/deleteSys', { params: { ids: ids.substring(0, ids.length - 1) } })
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
