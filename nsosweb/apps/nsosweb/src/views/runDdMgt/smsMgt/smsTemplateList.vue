<template>
  <div class="w-full h-full">
    <el-container class="h-full bg-white">
      <el-header height="50px">
        <el-form label-width="auto" ref="ruleFormRef" :model="data.formData" :inline="true" label-position="right" class="demo-form-inline">
          <el-row class="mt-2">
            <el-col :span="4">
              <el-form-item label="单位:" prop="orgName">
                <el-input v-model="data.formData.orgName" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="模板名称:" prop="templateName">
                <el-input v-model="data.formData.templateName" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-button type="primary" class="ml-4" :icon="Plus" @click="modalApiA.open()">新增</el-button>
              <el-button type="primary" class="ml-4" :icon="Search" @click="query()">查询</el-button>
              <el-button type="info" plain class="ml-4" :icon="RefreshLeft" @click="refreshClick">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <el-main style="height: calc(100% - 90px)">
        <el-table ref="tableDataRef" :data="data.tableData" border size="small" style="height: 100%">
          <el-table-column type="index" label="#" align="center" width="45" />
          <el-table-column prop="templateName" label="模板名称" align="center" width="150" />
          <el-table-column prop="templateContent" label="模板内容" align="left" header-align="center" width="" />
          <el-table-column prop="sendMode" label="发送方式" align="center" width="150" />
          <el-table-column prop="state" label="模板状态" column-key="NSOS_YES_OR_NO" :formatter="formatDrop" align="center" width="150" />
          <el-table-column prop="orgName" label="所属单位" align="center" width="150" />
          <el-table-column prop="creatorId" label="创建人" align="center" width="150" />
          <el-table-column prop="createTime" label="创建时间" :formatter="tDateTimeFormat" align="center" width="150" />
          <el-table-column prop="updatorId" label="最后修改人" align="center" width="150" />
          <el-table-column prop="updateTime" label="最后修改时间" :formatter="tDateTimeFormat" align="center" width="150" />
          <el-table-column label="操作" width="150" fixed="right" align="center">
            <template #default="scope">
              <!-- <el-button type="primary" link size="small" @click="query()">查看</el-button> -->
              <el-button type="primary" link size="small" @click="edit(scope.row)">编辑</el-button>
              <el-button type="danger" link size="small" @click="del(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <ElFooter height="40px">
        <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" class="mt-1" :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="currentChange"></el-pagination>
      </ElFooter>
    </el-container>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref, watch, nextTick } from 'vue'
import { ElForm, ElFormItem, ElRow, ElCol, ElTable, ElTableColumn, ElPagination, ElMain, ElContainer, ElHeader, ElFooter, ElMessageBox, ElMessage, ElNotification } from 'element-plus'
import { Search, RefreshLeft, Plus, Delete, Download, Operation, Notification } from '@element-plus/icons-vue'
import { tDateFormat, formatDateTime, tDateTimeFormat, formatDrop } from '#/utils/commonUtil.ts'
import { useDropStore } from '#/store'
import { useVbenModal } from '@vben/common-ui'
import { requestClient } from '#/api/request'
import { queryTemplateData } from './smsMgtMethod.ts'

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close()
  }
})

const data = reactive({
  tableData: [],
  formData: {},
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
  const dropType = ['NSOS_YES_OR_NO']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)

  query()
})

const query = async () => {
  data.formData.pageSize = data.pageInfo.pageSize
  data.formData.pageNo = data.pageInfo.pageNo

  const { list, count, pageNo } = await queryTemplateData(data.formData)
  data.tableData = list
  data.pageInfo.pageNo = pageNo
  data.pageInfo.total = count
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

const edit = (row) => {
}
const del = (index) => {
}
</script>
<style scoped>
.primary{
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

:deep(.el-date-editor.el-input, .el-date-editor.el-input__wrapper){
  width: 100%;
}

:deep(.el-form--inline .el-form-item){
  width: calc(100% - 20px);
  margin-right: 20px;
  margin-bottom: 12px;
}

:deep(.el-main){
  padding: 0;
}
</style>
