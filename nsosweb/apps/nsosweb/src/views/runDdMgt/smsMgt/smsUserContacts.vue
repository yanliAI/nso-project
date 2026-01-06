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
              <el-form-item label="人员姓名:" prop="userName">
                <el-input v-model="data.formData.userName" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="手机号码:" prop="mobileTel">
                <el-input v-model="data.formData.mobileTel" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="数认账号:" prop="mobileTel">
                <el-input v-model="data.formData.loginCode" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-button type="primary" class="ml-4" :icon="Plus" @click="add()">新增</el-button>
              <el-button type="primary" class="ml-4" :icon="Search" @click="query()">查询</el-button>
              <el-button type="info" plain class="ml-4" :icon="RefreshLeft" @click="refreshClick">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <el-main style="height: calc(100% - 90px)">
        <el-table ref="tableDataRef" :data="data.tableData" border size="small" style="height: 100%">
          <el-table-column type="index" label="#" align="center" width="45" />
          <el-table-column prop="userName" label="姓名" align="center" width="300" />
          <el-table-column prop="loginCode" label="数认账号" align="center" width="170" />
          <el-table-column prop="mobileTel" label="手机号码" align="center" width="120" />
          <el-table-column prop="userDesc" label="备注" align="left" header-align="center" width="" />
          <el-table-column prop="orgName" label="所属单位" align="center" width="200" />
          <el-table-column prop="createTime" label="创建时间" :formatter="tDateTimeFormat" align="center" width="150" />
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
    <Modal class="w-[600px] h-[450px]" :title="data.contactId ? '编辑' : '新增'" :footer="false" :closeOnClickModal="false" :draggable="true">
      <AddUser :contactId="data.contactId" :userDrop="data.userDrop" @close="modalApi.close()" @ok="addok"></AddUser>
    </Modal>
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
import { queryUserData, deleteUser, getUserDrop } from './smsMgtMethod.ts'
import AddUser from './addUser.vue'

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
  },
  contactId: null,
  userDrop: [],
})
const tableDataRef = ref()
onMounted(async () => {
  query()
})

const query = async () => {
  data.formData.pageSize = data.pageInfo.pageSize
  data.formData.pageNo = data.pageInfo.pageNo

  const { list, count, pageNo } = await queryUserData(data.formData)
  data.tableData = list
  data.pageInfo.pageNo = pageNo
  data.pageInfo.total = count

  data.userDrop = await getUserDrop()
}
const refreshClick = () => {
  data.formData = {}
  query()
}
const handleSizeChange = (val) => {
  data.pageInfo.pageSize = val;
  query();
};
const currentChange = (val) => {
  data.pageInfo.pageNo = val;
  query();
};

const addok = () => {
  query()
  modalApi.close()
}
const add = () => {
  data.contactId = null
  modalApi.open()
}
const edit = (row) => {
  data.contactId = row.contactId
  modalApi.open()
}
const del = (index) => {
  let ids = data.tableData[index].contactId
  ElMessageBox.confirm('确认是否删除选中的记录? ', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    if (ids != '') {
      await deleteUser({ ids: ids })
    }
    ElNotification({
      title: '提示',
      message: '删除成功！',
      type: 'success'
    })
    data.tableData.splice(index, 1)
  })
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
