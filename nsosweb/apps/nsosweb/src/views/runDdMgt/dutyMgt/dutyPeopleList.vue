<template>
  <div class="h-full">
    <el-container class="h-full bg-white">
      <el-header height="50px">
        <el-form label-width="auto" :model="data.formData" :inline="true" label-position="right" class="demo-form-inline mt-2">
          <el-row class="mt-2">
            <el-col :span="4">
              <el-form-item label="姓名:" prop="loginName">
                <el-input v-model="data.formData.loginName" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="账号:" prop="loginCode">
                <el-input v-model="data.formData.loginCode" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="岗位:">
                <el-select v-model="data.formData.postType" filterable clearable>
                  <el-option v-for="item in dropList.NSOS_PB_POST" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="组织全路径:" prop="orgFullPath">
                <el-input v-model="data.formData.orgFullPath" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" :icon="Search" @click="query">查询</el-button>
              <el-button type="primary" :icon="Plus" @click="add">新增</el-button>
              <el-button type="danger" :icon="Delete" @click="batchDel">删除</el-button>
              <el-button type="info" plain class="ml-4" :icon="RefreshLeft" @click="refreshClick">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <el-main style="height: calc(100% - 95px)">
        <el-table ref="dutyListTable" :data="data.tableData" border size="small" style="height: 100%">
          <el-table-column type="selection" align="center" />
          <el-table-column type="index" label="#" align="center" width="40" />
          <el-table-column prop="loginName" label="姓名" align="center" width="150" />
          <el-table-column prop="loginCode" label="账号" align="center" width="150" />
          <el-table-column prop="postType" label="岗位" column-key="NSOS_PB_POST" :formatter="formatDrop" align="center" width="150" />
          <!-- <el-table-column prop="mobileTel" label="手机号码" align="center" width="200" /> -->
          <!-- <el-table-column prop="sex" label="性别" column-key="NSOS_STAFF_SEX" :formatter="formatDrop" align="center" width="150" /> -->
          <!-- <el-table-column prop="validFlag" label="是否有效" column-key="NSOS_YES_OR_NO" :formatter="formatDrop" align="center" width="150" /> -->
          <el-table-column prop="orgFullPath" label="单位路径" align="left" header-align="center" width="" />
          <el-table-column label="操作" align="center" width="120">
            <template #default="scope">
              <el-button type="primary" link size="small" @click="edit(scope.row)">编辑</el-button>
              <el-button type="danger" link size="small" @click="del(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer height="45px">
        <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" class="mt-1" :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="currentChange"></el-pagination>
      </el-footer>
    </el-container>
    <Modal class="w-[500px]" :title="data.curTitle" :footer="false" :closeOnClickModal="false" :draggable="true">
      <el-form label-width="100px" ref="ruleFormRef" :rules="formRules" :model="data.curMeb" :inline="true" label-position="right" class="demo-form-inline mt-1">
        <el-row>
          <el-col :span="24">
            <el-form-item label="人员名称:" prop="loginName">
              <el-input v-model="data.curMeb.loginName" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="登录账号:" prop="loginCode">
              <el-input v-model="data.curMeb.loginCode" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="岗位:" prop="postType">
              <el-select v-model="data.curMeb.postType" clearable>
                <el-option v-for="item in dropList.NSOS_PB_POST" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="text-center pt-[10px] pb-[15px]">
        <el-button type="primary" class="ml-4" :icon="Tickets" @click="saveEditData">保存</el-button>
        <el-button type="info" class="ml-4" :icon="Close" @click="modalApi.close()">取消</el-button>
      </div>
    </Modal>
  </div>
</template>
<script setup>
import { Page } from '@vben/common-ui'
import { ElForm, ElFormItem, ElRow, ElCol, ElTable, ElTableColumn, ElPagination, ElMain, ElContainer, ElHeader, ElFooter, ElTabs, ElTabPane, ElMessageBox, ElMessage, ElDialog, ElNotification } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
import { Delete, Search, Plus, RefreshLeft, Close, Tickets } from '@element-plus/icons-vue'
import { useDropStore } from '#/store'
import { tDateTimeFormat, formatDrop } from '#/utils/commonUtil.ts'
import { queryPeopleData, deletePeopleData, saveQualifyInfo } from './dutyMgtMethod.ts'
import { useVbenModal } from '@vben/common-ui'

const dropList = reactive({})
onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = ['NSOS_PB_POST', 'NSOS_STAFF_SEX', 'NSOS_YES_OR_NO']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)
  query()
})
const dutyListTable = ref()
const ruleFormRef = ref()
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
  selectedRow: {},
  operList: {},
  curMeb: null
})
const formRules = reactive({
  postType: [{ required: true, message: '请选择岗位', trigger: 'change' }],
  loginCode: [
    { required: true, message: '请输入登录账号', trigger: 'blur' },
    { min: 0, max: 40, message: '内容长度最大不能超过40', trigger: 'blur' }
  ],
  loginName: [
    { required: true, message: '请输入登录名称', trigger: 'blur' },
    { min: 0, max: 40, message: '内容长度最大不能超过40', trigger: 'blur' }
  ]
})
const query = async () => {
  data.formData.pageSize = data.pageInfo.pageSize
  data.formData.pageNo = data.pageInfo.pageNo

  const { list, pageNo, count } = await queryPeopleData(data.formData)
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

const toExcelClick = () => {}

const add = () => {
  data.curMeb = {}
  data.curTitle = '新增'
  modalApi.open()
}

const saveEditData = async () => {
  await ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await saveQualifyInfo(data.curMeb)
        modalApi.close()
        query()
        ElNotification({
          title: '提示',
          message: '保存成功！',
          type: 'success'
        })
      } catch (error) {
        ElMessage.error('保存失败！')
      }
    } else {
      ElMessage.warning('请输入必填项！')
    }
  })
}
const batchDel = () => {
  let rows = dutyListTable.value.getSelectionRows()

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
      await deletePeopleData({ ids: ids.substring(0, ids.length - 1) })
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
const edit = (row) => {
  data.curMeb = row
  data.curTitle = '编辑'
  modalApi.open()
}
const del = (index) => {
  let ids = data.tableData[index].id
  ElMessageBox.confirm('确认是否删除选中的记录? ', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    if (ids != '') {
      await deletePeopleData({ ids: ids })
    }
    ElNotification({
      title: '提示',
      message: '删除成功！',
      type: 'success'
    })
    data.tableData.splice(index, 1)
  })
}
const refreshClick = () => {
  data.formData = {}
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

:deep(.el-date-editor.el-input, .el-date-editor.el-input__wrapper) {
  width: 100%;
}

:deep(.el-form--inline .el-form-item) {
  width: calc(100% - 20px);
  margin-right: 20px;
  margin-bottom: 12px;
}

:deep(.el-main) {
  padding: 0;
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

.el-date-editor.el-input,
.el-date-editor.el-input__wrapper {
  width: 100%;
}

:deep(.el-form--inline .el-form-item) {
  width: calc(100% - 20px);
  margin-right: 20px;
  margin-bottom: 10px;
}

.el-form--inline .el-form-item {
  width: calc(100% - 20px);
  margin-right: 20px;
  margin-bottom: 15px;
}
</style>
