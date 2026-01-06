<template>
  <div class="w-full h-full pt-2">
    <div class="flex pb-1">
      <span>分析报告编辑信息：</span>
      <span class="flex items-center primary ml-0 cursor-pointer" @click="addRowClick" v-if="data.editable">＋添加</span>
      <span class="delcss flex items-center ml-3" @click="batchDeleteClick()" v-if="data.editable"><Delete class="h-[12px] w-[12px] mt-[0px]"></Delete><span>批量删除</span></span>
    </div>
    <el-table :data="data.tableData" ref="tableDataRef" border size="small" style="width: 100%">
      <el-table-column type="selection" width="40" align="center" v-if="data.editable" />
      <el-table-column type="index" width="40" label="#" align="center" />
      <el-table-column prop="deptName" label="单位/部门" align="center"> </el-table-column>
      <el-table-column prop="editorName" label="编辑人" width="120" align="center"> </el-table-column>
      <el-table-column prop="requireFinishTime" label="要求完成时间" width="130" align="center">
        <template #default="scope">
          <span>
            {{ formatDateTime(scope.row.requireFinishTime) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="actFinishTime" label="实际完成时间" width="130" align="center">
        <template #default="scope">
          <div>
            {{ formatDateTime(scope.row.actFinishTime) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="timeoutDuration" header-align="center" width="120" label="超时时长(小时)" align="center">
        <template #default="scope">
          <span style="color: red">
            {{ getDifferenceInHours(scope.row.requireFinishTime, scope.row.actFinishTime) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140" align="center" v-if="data.editable">
        <template #default="scope">
          <div class="flex items-center" style="justify-content: right">
            <span class="qx primary ml-2" @click="noticClick(scope.row)">通知</span>
            <span class="qx primary ml-2" @click="cbanClick(scope.row)">催办</span>
            <span class="qx primary ml-2" @click="editRow(scope.row)">编辑</span>
            <span class="delcss flex items-center ml-2" @click="deleteClick(scope.$index)"><Delete class="h-[12px] w-[12px]" /></span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="mt-2">
      <AttachFileA :key="data.fileCompKey" ref="attachListRef" v-if="data.faultCode" :parentId="data.faultCode" :moduleId="'analysisReport'" :showPreview="true" @afterUpload="afterUpload" @afterDelete="afterDelete">
        <template v-slot:title>
          <span>分析报告附件：</span>
        </template>
      </AttachFileA>
    </div>
    <ModalA class="w-[700px] h-[210px] top-[25vh]" :title="data.fmData.id ? '编辑' : '添加'" :footer="false" :closeOnClickModal="false" :draggable="true">
      <el-form label-width="auto" ref="dataFormRef" :model="data.fmData" :rules="formRules" :inline="true" label-position="right" class="h-[94px] demo-form-inline">
        <el-row>
          <el-col :span="12">
            <el-form-item label="单位/部门:" prop="dept">
              <OrgTreeSelect v-model="data.fmData.dept" @updateName="(v) => (data.fmData.deptName = v)" filterable></OrgTreeSelect>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="编辑人:" prop="editor">
              <el-input v-model="data.fmData.editorName" readonly>
                <template #append>
                  <el-button :icon="Plus" @click="userAddClick('editor', 'editorName')" />
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="要求完成时间:" prop="requireFinishTime">
              <el-date-picker v-model="data.fmData.requireFinishTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" clearable />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="text-center pt-[20px]">
        <el-button type="primary" class="ml-4" :icon="Tickets" @click="saveData" >保存</el-button>
        <el-button type="info" class="ml-4" :icon="Close" @click="modalApiA.close()">取消</el-button>
      </div>
    </ModalA>
    <ModalB class="w-[1200px] h-[650px]" title="人员选择" :footer="false" :closeOnClickModal="false" :draggable="true">
      <UserSelect @selectOk="userSelectOk"></UserSelect>
    </ModalB>
    <!-- 通知 -->
    <ModalTz class="w-[1800px] h-[800px]" title="故障复盘>故障分析报告>通知信息" :footer="false" :closeOnClickModal="false" :draggable="true">
      <notify-or-urge record-type="1" module="3" sub-module="2" :busi-code="data.faultCode" tache-code="report" tache-name="故障分析报告" :notify-target="tzcbData.userCode" :contact="tzcbData.userPhone" :content="tzcbData.content" :openAdd="tzcbData.openAdd" />
    </ModalTz>

    <!-- 催办 -->
    <ModalCb class="w-[1800px] h-[800px]" title="故障复盘>故障分析报告>催办信息" :footer="false" :closeOnClickModal="false" :draggable="true">
      <notify-or-urge record-type="2" module="3" sub-module="2" :busi-code="data.faultCode" tache-code="report" tache-name="故障分析报告" :notify-target="tzcbData.userCode" :contact="tzcbData.userPhone" :content="tzcbData.content" :openAdd="tzcbData.openAdd" />
    </ModalCb>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { ElForm, ElFormItem, ElRow, ElCol, ElNotification, ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Download, EditPen, Share, Close, Tickets, Plus } from '@element-plus/icons-vue'
import { formatDateTime, getDifferenceInHours } from '#/utils/commonUtil.ts'
import { useDropStore } from '#/store'
import { useVbenModal } from '@vben/common-ui'
import { queryReportEditByCode, saveReportEdit, updateEditQx, deleteReportEdit, initReportEdit, updateReportEdit, clearReplayReportId, getNotifyInfo } from './replayDetailMethod.ts'
import AttachFileA from '#/views/basic/attach/attachFileA.vue'
import notifyOrUrge from '/src/views/runDdMgt/notifyRecord/NotificationDialog2.vue'
import OrgTreeSelect from '#/views/basic/common/orgTreeSelect.vue'
import UserSelect from '#/views/basic/common/userSelect.vue'

const dropList = reactive({})

const formData = defineModel('formData')
const disabled = defineModel('disabled')
const tableDataRef = ref()
const data = reactive({
  faultCode: null,
  tableData: [],
  fmData: {},
  fileCompKey: '',
  editable: false
})

onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = ['NSOS_SYSTEM_INFO', 'NSOS_YES_OR_NO']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)
})
const formRules = reactive({
  dept: [{ required: true, message: '请选择单位/部门', trigger: 'change' }],
  requireFinishTime: [{ required: true, message: '请选择要求完成时间', trigger: 'blur' }],
  editor: [{ required: true, message: '请选择编辑人', trigger: 'change' }]
})
const [ModalA, modalApiA] = useVbenModal({
  onCancel() {
    modalApiA.close()
  }
})
const [ModalB, modalApiB] = useVbenModal({
  onCancel() {
    modalApiB.close()
  }
})
const [ModalTz, modalTzApi] = useVbenModal({
  onCancel() {
    modalTzApi.close()
  }
})
const [ModalCb, modalCbApi] = useVbenModal({
  onCancel() {
    modalCbApi.close()
  }
})

// 查询
const queryData = async () => {
  const res = await queryReportEditByCode({ faultCode: formData.value.faultCode, reportType: '2' })
  data.tableData = res.dataList
  let hasRight = !disabled.value
  data.editable = hasRight ? res.editable : false
}

watch(formData, async (newval) => {
  data.faultCode = formData.value.faultCode
  queryData()
})
const saveData = async () => {
  try {
    await saveReportEdit(data.fmData, { params: { faultCode: formData.value.faultCode, reportType: '2' } })
  } catch (error) {
    ElMessage.error('保存失败！')
    return
  }
  queryData()
  modalApiA.close()
  ElNotification({
    title: '提示',
    message: '保存成功！',
    type: 'success'
  })
}
const updateQx = async (id, val, index) => {
  if (id) {
    try {
      await updateEditQx({ id: id, qx: val })
      data.tableData[index].editPrivilidge = val
    } catch (error) {
      ElMessage.error('权限修改失败！')
      return
    }
  } else {
    data.tableData[index].editPrivilidge = val
  }
  ElNotification({
    title: '提示',
    message: '权限修改成功！',
    type: 'success'
  })
}
const addRowClick = async () => {
  data.fmData = await initReportEdit({ faultCode: formData.value.faultCode, reportType: '2' })

  modalApiA.open()
}

// 编辑
const editRow = async (row) => {
  data.fmData = JSON.parse(JSON.stringify(row))
  data.fmData.requireFinishTime = formatDateTime(data.fmData.requireFinishTime)
  modalApiA.open()
}

const deleteClick = (index) => {
  let ids = data.tableData[index].id
  ElMessageBox.confirm('确认是否删除选中的记录? ', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    if (ids != '') {
      await deleteReportEdit({ ids: ids })
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
      await deleteReportEdit({ ids: ids.substring(0, ids.length - 1) })
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
const onClickEdit = (row, column, event) => {
  if (column.label != '操作') {
    data.editIndex = data.tableData.indexOf(row)
  }
  event.stopPropagation()
}

// 通知和催办
const tzcbData = reactive({
  userCode: '',
  userPhone: '',
  content: '',
  openAdd: false
})
const noticClick = async (row) => {
  if (row.editor) {
    const params = {
      recordType: '1',
      tacheCode: 'report',
      faultCode: data.faultCode,
      userCode: row.editor
    }
    try {
      const res = await getNotifyInfo(params)
      tzcbData.userCode = res.userCode
      tzcbData.userPhone = res.userPhone
      tzcbData.content = res.content
      tzcbData.openAdd = res.openAdd
      modalTzApi.open()
    } catch (error) {
      console.error(error)
    }
  } else {
    ElMessage.error('编辑人为空！')
  }
}
const cbanClick = async (row) => {
  if (row.editor) {
    const params = {
      recordType: '2',
      tacheCode: 'report',
      faultCode: data.faultCode,
      userCode: row.editor
    }
    try {
      const res = await getNotifyInfo(params)
      tzcbData.userCode = res.userCode
      tzcbData.userPhone = res.userPhone
      tzcbData.content = res.content
      tzcbData.openAdd = res.openAdd
      modalCbApi.open()
    } catch (error) {
      console.error(error)
    }
  } else {
    ElMessage.error('编辑人为空！')
  }
}
const closeTz = () => {
  modalTzApi.close()
}
const closeCb = () => {
  modalCbApi.close()
}

const handleChange = (row) => {
  // if (!data.updateList.includes(row)) {
  //   data.updateList.push(row);
  // }
}

const afterUpload = async (fileList) => {
  if (fileList && fileList.length > 0) {
    const file = fileList[fileList.length - 1]
    const param = {
      faultCode: formData.value.faultCode,
      reportType: '2',
      userId: file.loginCode,
      time: formatDateTime(file.createTime)
    }
    await updateReportEdit(param)
    queryData()
  }
}

const afterDelete = async (file) => {
  clearReplayReportId(formData.value.id, file.id, '2')
}

// 刷新附件列表
const refreshAttachmentList = async () => {
  data.fileCompKey = new Date().getTime() + ''
}
const userSelectOk = (user) => {
  data.fmData[data.curUserNameProp] = user.employeeName
  data.fmData[data.curUserProp] = user.employeeAccount
  modalApiB.close()
}
const userAddClick = (codeProp, nameProp) => {
  data.curUserProp = codeProp
  data.curUserNameProp = nameProp
  modalApiB.open()
}
defineExpose({ refreshAttachmentList })
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

.el-form--inline .el-form-item {
  width: 100% !important;
  margin-right: 0 !important;
  margin-bottom: 15px !important;
}

:deep(.el-input-number) {
  width: 100%;
}

.delcss {
  color: red;
  cursor: pointer;
}

.delcss:hover {
  text-decoration: underline;
}

.primary {
  color: hsl(var(--primary));
}

.prim {
  color: #02a7f0;
}

.prim:hover {
  text-decoration: underline;
}

.qx {
  cursor: pointer;
}

.qx:hover {
  text-decoration: underline;
}

.hsqx {
  color: red;
}
</style>
