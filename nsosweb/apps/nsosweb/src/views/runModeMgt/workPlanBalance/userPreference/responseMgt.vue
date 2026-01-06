<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';

import { Download, Search, Refresh,Plus } from '@element-plus/icons-vue';
import {
  ElTable,
  ElTableColumn,
  ElContainer,
  ElFormItem,
  ElDialog,
  ElForm,
  ElCard,
  ElInput,
  ElButton,
  ElSelect,
  ElRow,
  ElCol,
  ElTabs,
  ElPagination,
  ElMessage,
  ElMessageBox,
  type FormInstance,
} from 'element-plus';
import {
  getCommonRespnseApi,
  insertCommonRespnseApi,
  getRespnseModulesApi,
  deleteCommonRespnseApi
} from '#/api';
import { useAccessStore, useUserStore } from '@vben/stores';
import { downloadFile } from '#/utils/download.ts';
const userStore = useUserStore();
// 头部表单
const queryForm = reactive({
  mid: '',
  userid: ''
});
const submitFormRef = ref(null);
const submitForm = reactive({
  mid: '',
  content:'',
  userid:''
})

const editFormRef = ref(null);
const editForm = reactive({
  id:'',
  mid: '',
  content:'',
  userid:''
})
const modules = ref([])

// 表格
const data = reactive({
  tableData: [],
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0,
  },
});

// 自定义验证规则
const formRules: FormRules = {
  mid: [{ required: true, message: '请选择功能模块', trigger: 'change' }],
  content: [
    { required: true, message: '请填写回复内容', trigger: 'blur' },
  ]
};

const insertDialog = ref(false)
const editDialog = ref(false)

// 获取模块名列表
async function getRespnseModules(){
    try {
    const res = await getRespnseModulesApi();
    if (res) {
      modules.value = res;
    }
  } catch (error) {
    console.error('查询数据失败:', error);
  }
}


// 打开新增弹窗
function openInsertDialog(){
  
  insertDialog.value= true;
  submitFormRef.value?.resetFields();
  
}

// 新增回复
async function handleInsert(){
  if (!submitFormRef.value) return;
  try {
    const isValid = await submitFormRef.value.validate();
    if (!isValid) return;
    submitForm.userid = userStore.userInfo.logincode
    await insertCommonRespnseApi(submitForm);
    ElMessage.success('更新成功');
    insertDialog.value = false;
    submitFormRef.value.resetFields();
    await queryData();
  } catch {
    // 这里不会执行，因为验证错误已被捕获
    console.log('提交失败');
  }
}

// 打开编辑弹窗
function openEditDialog(row){
  Object.assign(editForm, row)
  editDialog.value = true;
}

// 更新回复
async function handleEdit(){
  if (!editFormRef.value) return;
  try {
    const isValid = await editFormRef.value.validate();
    if (!isValid) return;
    editForm.userid = userStore.userInfo.logincode
    await insertCommonRespnseApi(editForm);
    ElMessage.success('更新成功!');
    editDialog.value = false;
    editFormRef.value.resetFields();
    await queryData();
  } catch {
    // 这里不会执行，因为验证错误已被捕获
    console.log('提交失败');
  }
}

// 删除回复
async function deleteCommonRespnse(row){
  try {
    await deleteCommonRespnseApi([row.id]);
    ElMessage.success('删除成功');
    await queryData();

  } catch (error) {
    console.error('查询数据失败:', error);
  }
}

// 查询数据
async function queryData() {
  try {
    queryForm.userid = userStore.userInfo.logincode
    const res = await getCommonRespnseApi({
      ...queryForm,...data.pageInfo
    });
    if (res) {
      data.tableData = res.records;
      data.pageInfo.total = res.total
    }
  } catch (error) {
    console.error('查询数据失败:', error);
  }
}

// 重置查询
async function reset() {
  queryForm.mid = ''
  data.pageInfo.pageNo = 1
  queryData()
}

// 根据mid查找模块名
function getMnameById(data, mid) {
  const item = data.find(item => item.id === mid);
  return item ? item.mname : null; // 如果找不到返回 null
}

onMounted(() => {
  queryData();
  getRespnseModules()
});

const handleSizeChange = (size: number) => {
  data.pageInfo.pageSize = size
  queryData()
}

const handlePageChange = (page: number) => {
  data.pageInfo.pageNo = page
  queryData()
}


</script>
<template>
  <div>
    <div style="padding: 0 20px">
      <el-form :inline="true" :model="queryForm" label-position="right">
        <el-form-item label="功能模块:" prop="mid" style="width: 300px">
          <el-select v-model="queryForm.mid">
            <el-option  v-for="item in modules" :label=item.mname :value=item.id />
          </el-select>
        </el-form-item>
        <el-form-item style="width: 300px">
          <el-button type="primary" :icon="Search" @click="queryData()">查询</el-button>
          <el-button type="primary" :icon="Refresh" @click="reset()">重置</el-button>
          <el-button type="primary" :icon="Plus" @click="openInsertDialog()">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="padding: 10px 20px 10px 20px">
      <el-table ref="tab" border stripe :data="data.tableData" height="680px">
        <el-table-column align="center" type="index" />
         <el-table-column prop="mname" label="功能模块" align="center" width="300px" >
            <template #default="scope">
              <span>{{ getMnameById(modules,scope.row.mid)}}</span>
            </template>
          </el-table-column>
        
        <el-table-column prop="content" label="回复内容" align="center">
            <template #default="scope">
              <el-tooltip effect="light" :content="scope.row.content" placement="bottom" popper-class="custom-tooltip">
                <span class="max-lines">{{ scope.row.content }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
        <el-table-column label="操作" align="center" width="300px">
            <template #default="{ row, $index }">
              <el-button type="primary" link @click="deleteCommonRespnse(row)">删除</el-button>
              <el-button type="primary" link @click="openEditDialog(row)">编辑</el-button>
            </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 15px;">
         <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" :total="data.pageInfo.total" @size-change="handleSizeChange" @current-change="handlePageChange" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
    </div>
    <el-dialog title="新增回复" v-model="insertDialog" width="650">
     <el-form
        ref="submitFormRef"
        :model="submitForm"
        :rules="formRules"
        label-width="auto"
      >
        <el-form-item label="功能模块:" prop="mid" style="width: 600px" required>
          <el-select v-model="submitForm.mid">
            <el-option  v-for="item in modules" :label=item.mname :value=item.id />
          </el-select>
        </el-form-item>
        <el-form-item label="回复内容:" prop="content" style="width: 600px" required>
            <el-input v-model="submitForm.content" type="textarea" :rows="4"  show-word-limit maxlength="100"> </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="insertDialog = false">取消</el-button>
        <el-button type="primary" @click="handleInsert()"
          >确定</el-button
        >
      </span>
    </template>
    </el-dialog>
    <el-dialog title="编辑回复" v-model="editDialog" width="650">
     <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="formRules"
        label-width="auto"
      >
        <el-form-item label="功能模块:" prop="mid" style="width: 600px" required>
          <el-select v-model="editForm.mid">
            <el-option  v-for="item in modules" :label=item.mname :value=item.id />
          </el-select>
        </el-form-item>
        <el-form-item label="回复内容:" prop="content" style="width: 600px" required>
            <el-input v-model="editForm.content" type="textarea" :rows="4"  show-word-limit maxlength="100"> </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="editDialog = false">取消</el-button>
        <el-button type="primary" @click="handleEdit()"
          >确定</el-button
        >
      </span>
    </template>
    </el-dialog>
  </div>
</template>
<style lang="less" scoped>
.flex-container {
  display: flex; /* 启用 Flex 布局 */
  width: 100%; /* 容器宽度 100% */
  height: 100%; /* 可选：设置容器高度 */
  gap: 10px;
}

.left,
.right {
  flex: 1; /* 各占 50% */
  min-width: 0; /* 防止内容溢出 */
  box-sizing: border-box; /* 边框和内边距计入宽度 */
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

.max-lines {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /* 限制显示行数 */
  overflow: hidden;
  text-overflow: ellipsis;
}

</style>
