<template>
  <div>
    <el-container>
      <el-form :inline="true" :model="queryForm" label-position="right" style="padding: 20px 20px 0">
        <el-form-item label="部署系统名称:">
          <el-input v-model="queryForm.deploySystemName" clearable maxlength="150" />
        </el-form-item>
        <el-form-item label="设备主人:">
          <el-input v-model="queryForm.deviceOwner" clearable maxlength="150" />
        </el-form-item>
        <el-form-item label="设备主人所属部门:">
          <el-input v-model="queryForm.deviceOwnerDeptName" clearable maxlength="400" />
        </el-form-item>
        <el-form-item label="cmdbId编码:">
          <el-input v-model="queryForm.cmdbId" clearable maxlength="400" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="query">查询</el-button>
          <el-button type="primary" @click="openInsertDialog">新增</el-button>
          <el-button type="danger" @click="handleDelete">删除</el-button>
          
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-main>
        <el-table border stripe ref="table" :data="tableData" @selection-change="handleSelectionChange" style="width: 100%; height: 700px">
          <el-table-column type="selection" width="40" align="center" />
          <el-table-column type="index" align="center" />
          <el-table-column prop="deploySystemName" label="部署系统名称" align="center"></el-table-column>
          <el-table-column prop="cmdbId" label="cmdbId编码" align="center" />
          <el-table-column prop="url" label="拨测地址" align="center" />
          
          <el-table-column prop="deviceOwner" label="设备主人" align="center"> </el-table-column>
          <el-table-column prop="deviceOwnerId" label="设备主人账号" align="center"> </el-table-column>
          <el-table-column prop="deviceOwnerDeptName" label="设备主人所属部门" align="center"> </el-table-column>

          <el-table-column label="操作" align="center">
            <template #default="scope">
              <el-button type="primary" link @click="openEditDialog(scope.row)"> 编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <el-pagination :current-page="currentPage" :page-size="pageSize" :total="total" @size-change="handleSizeChange" @current-change="handlePageChange" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </el-footer>
    </el-container>
    <el-dialog v-model="insertDialogVisible" width="800" title="新增系统">
      <el-form ref="insertFormRef" :inline="true" :rules="rules" :model="insertForm" label-position="right" label-width="150px" style="padding: 16px 20px 0">
        <el-row>
          <el-col :span="12">
            <el-form-item label="部署系统名称:" prop="deploySystemName" style="width: 100%" required>
              <el-input v-model="insertForm.deploySystemName" clearable maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备主人:" prop="deviceOwner" style="width: 100%" required>
              <el-input v-model="insertForm.deviceOwner" style="width: 100%" clearable maxlength="100" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="一级系统名称:" prop="primarySystemName" style="width: 100%" required>
              <el-input v-model="insertForm.primarySystemName" clearable maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="二级系统名称:" prop="secondarySystemName" style="width: 100%" required>
              <el-input v-model="insertForm.secondarySystemName" clearable maxlength="100" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备主人账号:" prop="deviceOwnerId" style="width: 100%" required>
              <el-input v-model="insertForm.deviceOwnerId" clearable maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="cmdbId编码:" prop="cmdbId" style="width: 100%" required>
              <el-input v-model="insertForm.cmdbId" clearable maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>
                <el-form-item label="拨测地址:" prop="url" style="width: 100%" required>
          <el-input v-model="insertForm.url" type="textarea" :rows="1" clearable maxlength="400" />
        </el-form-item>
        <el-form-item label="设备主人所属部门:" prop="deviceOwnerDeptName" style="width: 100%" required>
          <el-input v-model="insertForm.deviceOwnerDeptName" type="textarea" :rows="3" clearable maxlength="400" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="insertDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleInsert()">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="editDialogVisible" width="800" title="编辑系统">
      <el-form ref="editFormRef" :inline="true" :rules="rules" :model="editForm" label-position="right" label-width="150px" style="padding: 16px 20px 0">
        <el-row>
          <el-col :span="12">
            <el-form-item label="部署系统名称:" prop="deploySystemName" style="width: 100%" required>
              <el-input v-model="editForm.deploySystemName" clearable maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备主人:" prop="deviceOwner" style="width: 100%" required>
              <el-input v-model="editForm.deviceOwner" style="width: 100%" clearable maxlength="100" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="一级系统名称:" prop="primarySystemName" style="width: 100%" required>
              <el-input v-model="editForm.primarySystemName" clearable maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="二级系统名称:" prop="secondarySystemName" style="width: 100%" required>
              <el-input v-model="editForm.secondarySystemName" clearable maxlength="100" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备主人账号:" prop="deviceOwnerId" style="width: 100%" required>
              <el-input v-model="editForm.deviceOwnerId" clearable maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="cmdbId编码:" prop="cmdbId" style="width: 100%" required>
              <el-input v-model="editForm.cmdbId" clearable maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>
                        <el-form-item label="拨测地址:" prop="url" style="width: 100%" required>
          <el-input v-model="insertForm.url" type="textarea" :rows="1" clearable maxlength="400" />
        </el-form-item>
        <el-form-item label="设备主人所属部门:" prop="deviceOwnerDeptName" style="width: 100%" required>
          <el-input v-model="editForm.deviceOwnerDeptName" type="textarea" :rows="3" clearable maxlength="400" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleEdit()">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ElTable, ElTableColumn, ElFormItem, ElForm, ElInput, ElButton, ElSelect, ElOption, ElPagination, ElContainer, ElHeader, ElMain, ElFooter, ElDialog, ElMessage, ElMessageBox, ElText, ElLink, ElTag, ElTooltip } from 'element-plus'
import { Search, Download, Aim, CircleCheck, Setting } from '@element-plus/icons-vue'
import { ref, reactive, computed, onMounted } from 'vue'
import { getModeProbeSystemListApi, updateModeProbeSystemApi, deleteModeProbeSystemApi } from '#/api'
import { useRouter } from 'vue-router'
import { useAccessStore, useUserStore } from '@vben/stores'
const emit = defineEmits(['custom-event', 'sendCount'])
const router = useRouter()
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)
const table = ref(null)
const tableData = ref([])
const selectedRows = ref([])

const insertDialogVisible = ref(false)
const insertFormRef = ref()
const insertForm = reactive({
  deviceOwnerId: '',
  cmdbId: '',
  url:'',
  deploySystemName: '',
  deviceOwner: '',
  deviceOwnerDeptName: '',
  primarySystemName: '',
  secondarySystemName: ''
})

const editDialogVisible = ref(false)
const editFormRef = ref()
const editForm = reactive({
  id: '',
  deviceOwnerId: '',
  cmdbId: '',
  url:'',
  deploySystemName: '',
  deviceOwner: '',
  deviceOwnerDeptName: '',
  primarySystemName: '',
  secondarySystemName: ''
})

const queryForm = reactive({
  cmdbId: '',
  deploySystemName: '',
  deviceOwner: '',
  deviceOwnerDeptName: ''
})

/**
 * 查询
 */
const query = async () => {
  try {
    const response = await getModeProbeSystemListApi({
      ...queryForm,
      pageSize: pageSize.value,
      pageNo: currentPage.value
    })
    tableData.value = response.records
    total.value = response.total
  } catch {}
}

/**
 *
 *新增/编辑
 */

function openInsertDialog() {
  Object.assign(insertForm, {
  deviceOwnerId: '',
  cmdbId: '',
  url:'',
  deploySystemName: '',
  deviceOwner: '',
  deviceOwnerDeptName: '',
  primarySystemName: '',
  secondarySystemName: ''
  })
  insertDialogVisible.value = true
}

function openEditDialog(row) {
  editDialogVisible.value = true
  Object.assign(editForm, row)
}

const rules = {
  url:[ { required: true, message: '请输入拨测地址', trigger: 'blur' },],
  deviceOwnerId: [
    { required: true, message: '请输入设备主人账号', trigger: 'blur' },
    { max: 100, message: '设备主人账号不能超过100个字符', trigger: 'blur' }
  ],
  deploySystemName: [
    { required: true, message: '请输入所属单位', trigger: 'blur' },
    { max: 100, message: '所属单位长度不能超过100个字符', trigger: 'blur' }
  ],
  deviceOwner: [
    { required: true, message: '请输入设备主人', trigger: 'blur' },
    { max: 100, message: '设备主人长度不能超过100个字符', trigger: 'blur' }
  ],
  primarySystemName: [
    { required: true, message: '请输入一级系统名称', trigger: 'blur' },
    { max: 100, message: '一级系统名称长度不能超过100个字符', trigger: 'blur' }
  ],
  secondarySystemName: [
    { required: true, message: '请输入二级系统名称', trigger: 'blur' },
    { max: 100, message: '二级系统名称长度不能超过100个字符', trigger: 'blur' }
  ],
  deviceOwnerDeptName: [
    { required: true, message: '请输入设备主人所属单位', trigger: 'blur' },
    { max: 100, message: '设备主人所属单位长度不能超过100个字符', trigger: 'blur' }
  ],
  cmdbId: [
    { required: true, message: '请输入cmdbId编码', trigger: 'blur' },
    { max: 50, message: 'cmdbId编码长度不能超过50个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_-]+$/, message: 'cmdbId编码只能包含字母、数字、下划线和横线', trigger: 'blur' }
  ]
}

// 新增数据
async function handleInsert() {
  try {
    insertFormRef.value.validate(async (valid) => {
      if (valid) {
        const res = await updateModeProbeSystemApi(insertForm)
        ElMessage.success('新增成功!')
        insertDialogVisible.value = false
        query()
      }
    })
  } catch (error) {}
}

// 编辑数据
async function handleEdit() {
  try {
    editFormRef.value.validate(async (valid) => {
      if (valid) {
        const res = await updateModeProbeSystemApi(editForm)
        ElMessage.success('更新成功!')
        editDialogVisible.value = false
        query()
      }
    })
  } catch (error) {}
}


/**
 * 
 * 批量删除
 */

function handleDelete() {
  if(selectedRows.value.length===0) {
    ElMessage.warning('请选择一条数据!')
    return
  }
  ElMessageBox.confirm('确定要删除选中的数据吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await deleteModeProbeSystemApi(selectedRows.value)
      ElMessage.success('删除成功!')
      query()
    })
    .catch(() => {
      // ElMessage.info('已取消删除')
    })
}
const handleSelectionChange = (val) => {
  
  selectedRows.value = val.map(item=>item.id)
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  query()
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  query()
}

function reset(){
  Object.assign(queryForm,{
    cmdbId: '',
    deploySystemName: '',
    deviceOwner: '',
    deviceOwnerDeptName: ''
  })
  query()
}
onMounted(() => {
  query()
})
</script>

<style scoped>
.el-main {
  padding-top: 0;
}
.cell {
  text-align: center;
}
.max-lines {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /* 限制显示行数 */
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
