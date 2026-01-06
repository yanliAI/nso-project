<template>
  <div class="w-full h-full">
    <div class="h-[60%]">
      <el-container class="h-full bg-white">
        <el-header height="35px">
          <el-form label-width="auto" ref="formRef" :model="data.formData" :rules="formRules" :inline="true" label-position="right" class="demo-form-inline pt-[10px]">
            <el-row>
              <el-col :span="8">
                <el-form-item label="通知方式:" prop="noticeType">
                  <el-select v-model="data.formData.noticeType" filterable>
                    <el-option v-for="item in dropList.NSOS_NOTIFY_TYPE" :key="item.value" :label="item.label" :value="item.value"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="16" style="display: flex; justify-content: flex-end">
                <el-button v-if="data.addFlag" type="primary" class="ml-4" @click="add">新增</el-button>
                <el-button v-if="data.delFlag" type="primary" class="ml-4" @click="batchDel">批量删除</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-header>
        <el-main style="height: calc(100% - 35px)">
          <el-table ref='noticeTable' border size="small" style="height: 100%" :data="data.tableData" @selection-change="handleSelectionChange">
            <!-- <el-table-column type="selection" width="40" align="center" /> -->
            <el-table-column type="index" label="#" width="50" align="center" />
            <el-table-column prop="orgName" label="单位" width="" align="left" header-align="center">
              <!-- <template #default="scope">
                <el-input v-if="data.editingRow === scope.row && data.editingCol === scope.column.property"  
                  v-model="scope.row.orgName">
                </el-input>
                <span v-else>
                  {{ scope.row.orgName }}
                </span>
              </template> -->
            </el-table-column>
            <el-table-column prop="employeeName" label="接收人" width="200" align="center">
              <!-- <template #default="scope">
                <el-input v-if="data.editingRow === scope.row && data.editingCol === scope.column.property"  
                  v-model="scope.row.employeeName">
                </el-input>
                <span v-else>
                  {{ scope.row.employeeName }}
                </span>
              </template> -->
            </el-table-column>
            <el-table-column prop="mobilePhone" label="接收手机号" width="200" align="center">
              <!-- <template #default="scope">
                <el-input v-if="data.editingRow === scope.row && data.editingCol === scope.column.property"  
                  v-model="scope.row.mobilePhone" type="number">
                </el-input>
                <span v-else>
                  {{ scope.row.mobilePhone }}
                </span>
              </template> -->
            </el-table-column>
            <!-- <el-table-column label="操作" width="150" align="center">
              <template #default="scope">
                <el-button link type="danger" size="small" @click="del(scope.row)">删除</el-button>
              </template>
            </el-table-column> -->
          </el-table>
        </el-main>
      </el-container>
    </div>
    <div class="h-[40%]">
      <el-form label-width="auto" ref="contentformRef" :model="data.formData" :rules="contentFormRules" :inline="true" label-position="right" class="demo-form-inline">
        <el-form-item label="联系内容:" prop="noticeContent" class="items-center pl-5">
          <el-input v-model="data.formData.noticeContent" :rows="4" maxlength="1000" pxow-word-limit type="textarea" placeholder="请输入联系内容" clearable />
        </el-form-item>
      </el-form>
      <div style="height: 75px; justify-content: center; align-items: center" class="flex">
        <el-button type="primary" @click="batchSubmit">批量提交</el-button>
        <el-button type="info" @click="cancel">取消</el-button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { ElIcon, ElRow, ElCol, ElTable, ElTableColumn, ElFormItem, ElForm, ElInput, ElButton, ElSelect, ElPagination, ElContainer, ElHeader, ElMain, ElFooter, ElDialog, ElMessage, ElMessageBox, ElNotification } from 'element-plus';
import { useDropStore } from '#/store';
import { useVbenModal } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';
import { queryNoticeData, cmdUrge } from '/src/views/runDdMgt/cmdMgt/cmdMgtMethod.ts'

const addFlag = defineModel("addFlag")
const delFlag = defineModel("delFlag")
const cmdData = defineModel("cmdData")
const emit = defineEmits(['closeDiaLog', 'query'])
const userStore = useUserStore();
const dropList = reactive({});
const noticeTable = ref();
const data = reactive({
  tableData: [],
  formData: {},
  editingRow: null,
  editingCol: null,
  addFlag: null,
  delFlag: null,
});
const selectedRows = ref([])
const formRef = ref()
const contentformRef = ref()

onMounted(async () => {
  data.addFlag = addFlag.value
  data.delFlag = delFlag.value
  const dropStore = useDropStore();
  const dropType = ['NSOS_NOTIFY_TYPE']
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);
  data.formData.noticeType= '1';

  const { noticePersonList, noticeContent } = await queryNoticeData(cmdData.value);
  data.tableData = noticePersonList;
  data.formData.noticeContent = noticeContent;
});

const formRules = reactive({
  noticeType: [{ required: true, message: '请选择通知方式', trigger: 'blur' }],
  mobilePhone: [{ required: true, message: '请填写接收手机号', trigger: 'blur' }],
  noticeContent: [{ required: true, message: '请填写联系内容', trigger: 'blur' }],
});

const contentFormRules = reactive({
  noticeContent: [{ required: true, message: '请填写联系内容', trigger: 'blur' }],
});

const add = () => {
  let newRow = {}
  data.tableData = [newRow, ...data.tableData];
}

const handleSelectionChange = (val) => {
  selectedRows.value = val
}

const batchDel = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要删除的数据');
    return;
  }
  data.tableData = data.tableData.filter(
    (item) => !selectedRows.value.find((row) => row.id === item.id)
  );
  selectedRows.value = [];
}

const onClickEdit = (row, column, event) => {
  data.editingRow = row;
  data.editingCol = column.property;
}

const del = (row) => {
  const delRow = ref([])
  delRow.value.push(row)
  data.tableData = data.tableData.filter(
    (item) => !delRow.value.find((row) => row.id === item.id)
  );
}

const batchSubmit = async () => {
  if (data.tableData.length == 0) {
    ElNotification({
      title: '提示',
      message: '接收人员数据为空，无法催办！',
      type: 'info'
    })
    return
  }
  data.formData.noticePersonList = data.tableData
  let count = 0
  await contentformRef.value.validate(async (valid) => {
    if (count > 0) return;
    count++;
    if (valid) {
      await cmdUrge(data.formData, { params: {cmdId: cmdData.value.id, cmdCode: cmdData.value.commandCode, cmdStatus: cmdData.value.commandStatus, module: 'YDGZT'} })
      ElNotification({
        title: '提示',
        message: '催办成功！',
        type: 'success'
      })
      emit('closeDiaLog')
      emit('query')
    } else {
      ElMessage.warning('请输入必填项！')
    }
  })
}

const cancel = () => {
  emit('closeDiaLog')
}
</script>
<style scoped>
.demo-form-inline .el-input {
  --el-input-width: 100%;
}

.demo-form-inline .el-select {
  --el-select-width: 100%;
}

:deep(.el-form--inline .el-form-item){
  width: calc(100% - 20px);
  margin-right: 20px;
}

:deep(.el-main){
  padding: var(--el-main-padding) !important;
}

</style>
