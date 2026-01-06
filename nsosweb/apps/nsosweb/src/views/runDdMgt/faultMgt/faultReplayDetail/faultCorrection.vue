<template>
  <div class="w-full h-full pt-1">
    <div class="h-8 flex items-center pb-1">
      <div class="flex-1 flex">
        <span>整改编辑信息：</span>
        <span class="flex items-center primary ml-0 cursor-pointer" @click="addRowClick" v-if="!disabled">＋添加</span>
        <span class="delcss flex items-center ml-3" @click="batchDeleteClick" v-if="!disabled"><Delete class="h-[12px] w-[12px] mt-[0px]"></Delete><span>批量删除</span></span>
      </div>
    </div>
    <el-table :data="data.tableData" ref="tableDataRef" show-overflow-tooltip border size="small" style="width: 100%">
      <el-table-column type="selection" width="40" fixed align="center" v-if="!disabled" />
      <el-table-column type="index" width="40" label="#" fixed align="center" />
      <el-table-column prop="measureContent" width="300" header-align="center" label="措施描述">
        <template #header>
          <span style="color: red">*</span>
          <span>措施描述</span>
        </template>
        <template #default="scope">
          <span>
            {{ scope.row.measureContent }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="reformDeptName" label="整改单位" width="160" align="center">
        <template #header>
          <span style="color: red">*</span>
          <span>整改单位</span>
        </template>
      </el-table-column>
      <el-table-column prop="reformManName" label="执行人员" width="80" align="center">
        <template #header>
          <span style="color: red">*</span>
          <span>执行人员</span>
        </template>
      </el-table-column>
      <el-table-column prop="transTime" label="下发时间" width="130" align="center">
        <template #default="scope">
          <span>
            {{ formatDateTime(scope.row.transTime) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="requireFinishTime" label="要求完成时间" width="130" align="center">
        <template #header>
          <span style="color: red">*</span>
          <span>要求完成时间</span>
        </template>
        <template #default="scope">
          <span>
            {{ formatDateTime(scope.row.requireFinishTime) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="超时时间(小时)" align="center" width="100">
        <template #default="scope">
          <span style="color: red">
            {{ getDifferenceInHours(scope.row.requireFinishTime, scope.row.confirmTime) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="佐证附件" width="300" align="left" header-align="center">
        <template #default="scope">
          <div v-for="(item, index) in data.fileData[scope.row.id]" :key="'ath' + index" class="flex items-center">
            <div>
              <div v-if="typeContains(item.fileType, 'xlsx')" class="file-icon execls"></div>
              <div v-else-if="typeContains(item.fileType, 'mp3apewavflacwmampegogg')" class="file-icon yy"></div>
              <div v-else-if="typeContains(item.fileType, 'mp4aviwmvrmvbflv')" class="file-icon sp"></div>
              <div v-else-if="typeContains(item.fileType, 'rarzip7zgztar')" class="file-icon ys"></div>
              <div v-else-if="typeContains(item.fileType, 'docxrtf')" class="file-icon word"></div>
              <div v-else-if="typeContains(item.fileType, 'txt')" class="file-icon txt"></div>
              <div v-else-if="typeContains(item.fileType, 'pdf')" class="file-icon pdf"></div>
              <div v-else-if="typeContains(item.fileType, 'pngjpgjpeggifsvg')" class="file-icon tp"></div>
              <div v-else class="file-icon qt"></div>
            </div>
            <div class="flex-1 ml-1 dianji" @click="filePreviewClick(item)" style="margin: 0 3px; white-space: pre-line">{{ item.name }}.{{ item.fileType }}</div>
            <div>
              <el-tooltip content="下载" placement="bottom" effect="light">
                <Download class="w-[16px] h-[16px] dianji primary ml-0" @click="downloadClick(item)" />
              </el-tooltip>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="isRing" label="是否闭环" width="65" align="center">
        <template #default="scope">
          <span>
            {{ dropList.NSOS_YES_OR_NO.filter((d) => d.value == scope.row.isRing)[0]?.label }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="confirmTime" label="确认时间" width="130" align="center">
        <template #default="scope">
          <span>
            {{ formatDateTime(scope.row.confirmTime) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" :width="disabled ? 60 : 160" fixed="right" align="center">
        <template #default="scope">
          <div class="flex items-center" style="justify-content: right">
            <div class="operate-disabled" v-if="scope.row.isRing === 'Y'">
              <span class="cursor-pointer grey" v-if="!disabled">下发</span>
              <span class="cursor-pointer ml-2 grey" v-if="!disabled">催办</span>
              <span class="cursor-pointer ml-2 grey" v-if="!disabled">闭环</span>
              <span class="cursor-pointer ml-2 grey">编辑</span>
              <span class="ml-2" v-if="!disabled"><Delete color="grey" class="h-[12px] w-[12px]" v-if="!disabled" /></span>
            </div>
            <div class="operate-abled" v-else>
              <span class="bhzcx cursor-pointer primary" @click="flMeasureClick(scope.row)" v-if="!disabled">下发</span>
              <span class="bhzcx cursor-pointer primary ml-2" @click="cbanClick(scope.row)" v-if="!disabled">催办</span>
              <span class="bhzcx cursor-pointer primary ml-2" @click="updateRingClick(scope.row, scope.$index)" v-if="!disabled">闭环</span>
              <span class="bhzcx cursor-pointer primary ml-2" @click="editClick(scope.row)">编辑</span>
              <span class="delcss ml-2" @click="deleteClick(scope.$index)"><Delete color="red" class="h-[12px] w-[12px]" v-if="!disabled" /></span>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <ModalA class="w-[700px] h-[480px] top-[20vh]" :title="data.reformData.id ? '编辑' : '添加'" :footer="false" :closeOnClickModal="false" :draggable="true">
      <el-form label-width="auto" ref="refoFormRef" :model="data.reformData" :rules="formRules" :inline="true" :disabled="disabled" label-position="right" class="h-[160px] demo-form-inline">
        <el-row>
          <el-col :span="24">
            <el-form-item label="措施描述:" prop="measureContent">
              <el-input v-model="data.reformData.measureContent" :rows="2" maxlength="500" show-word-limit type="textarea" placeholder="请输入措施描述" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="整改单位:" prop="reformDept">
              <OrgTreeSelect v-model="data.reformData.reformDept" @updateName="(v) => (data.reformData.reformDeptName = v)" filterable></OrgTreeSelect>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="执行人员:" prop="reformMan">
              <el-input v-model="data.reformData.reformManName" readonly>
                <template #append>
                  <el-button :icon="Plus" @click="userAddClick('reformMan', 'reformManName')" />
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!-- <el-col :span="12">
            <el-form-item label="下发时间:" prop="transTime">
              <el-date-picker v-model="data.reformData.transTime"  type="datetime" value-format="YYYY-MM-DD HH:mm:ss" clearable/>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="要求完成时间:" prop="requireFinishTime">
              <el-date-picker v-model="data.reformData.requireFinishTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" clearable />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="h-[200px]">
        <AttachFileA ref="attachListRef" :parentId="data.reformData.id ? data.reformData.id : data.bakId" :inAdvance="true" @afterUpload="afterUpload" @afterDelete="deleteFile" :showPreview="false">
          <template v-slot:title>
            <span class="text-[14px] pl-[9px]">佐证附件：</span>
          </template>
        </AttachFileA>
      </div>
      <div class="text-center pt-[20px]">
        <el-button type="primary" class="ml-4" :icon="Tickets" @click="saveReformInfo" v-if="!disabled">保存</el-button>
        <el-button type="info" class="ml-4" :icon="Close" @click="modalApiA.close()" >{{ disabled ? '关闭' : '取消' }}</el-button>
      </div>
    </ModalA>
    <ModalB class="w-[1200px] h-[650px]" title="人员选择" :footer="false" :closeOnClickModal="false" :draggable="true">
      <UserSelect @selectOk="userSelectOk"></UserSelect>
    </ModalB>
    <ModalC class="w-[1000px] h-[650px]" title="预览" :footer="false" :closeOnClickModal="false" :draggable="true">
      <FilePreview :url="data.curPreviewUrl" :fileType="data.curFileType"></FilePreview>
    </ModalC>

    <!-- 催办 -->
    <ModalCb class="w-[1800px] h-[800px]" title="故障复盘>故障整改>催办信息" :footer="false" :closeOnClickModal="false" :draggable="true">
      <notify-or-urge record-type="2" module="3" sub-module="2" :busi-code="tzcbData.faultCode" tache-code="correct" tache-name="故障整改" :notify-target="tzcbData.userCode" :contact="tzcbData.userPhone" :content="tzcbData.content" :openAdd="tzcbData.openAdd" />
    </ModalCb>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { ElForm, ElFormItem, ElRow, ElCol, ElNotification, ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Finished, Close, Tickets, Plus, Download } from '@element-plus/icons-vue'
import { formatDateTime, getDifferenceInHours, formatToken } from '#/utils/commonUtil.ts'
import { useDropStore } from '#/store'
import { useAccessStore } from '@vben/stores'
import axios from 'axios'
import { useVbenModal } from '@vben/common-ui'
import { queryFaultReformByCode, saveFaultReform, updateRing, initFaultReform, reformDeleteRow, flMeasure, getNotifyInfo } from './replayDetailMethod.ts'
import AttachFileA from '#/views/basic/attach/attachFileA.vue'
import FilePreview from '#/views/basic/attach/filePreview.vue'
import { requestClient } from '#/api/request'
import notifyOrUrge from '/src/views/runDdMgt/notifyRecord/NotificationDialog2.vue'
import OrgTreeSelect from '#/views/basic/common/orgTreeSelect.vue'
import UserSelect from '#/views/basic/common/userSelect.vue'

const dropList = reactive({})

const refoFormRef = ref()
const tableDataRef = ref()
const formData = defineModel('formData')
const disabled = defineModel('disabled')
const data = reactive({
  tableData: [],
  editIndex: null,
  reformData: {},
  fileData: {},
  curPreviewUrl: null,
  curFileType: null,
  bakId: null
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
const [ModalC, modalApiC] = useVbenModal({
  onCancel() {
    modalApiC.close()
  }
})
const [ModalCb, modalCbApi] = useVbenModal({
  onCancel() {
    modalCbApi.close()
  }
})
const formRules = reactive({
  measureContent: [
    { required: true, message: '请输入措施描述', trigger: 'blur' },
    { min: 0, max: 500, message: '内容长度最大不能超过500', trigger: 'blur' }
  ],
  reformDept: [{ required: true, message: '请选择整改单位', trigger: 'change' }],
  reformMan: [{ required: true, message: '请选择执行人员', trigger: 'change' }],
  requireFinishTime: [{ required: true, message: '请选择要求完成时间', trigger: 'blur' }]
})
onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = ['NSOS_SYS_LEVEL', 'NSOS_OPERATE_SCHEMA', 'NSOS_FAULT_TYPE', 'NSOS_OPERATE_ORG', 'NSOS_SYSTEM_INFO', 'NSOS_YES_OR_NO']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)

  document.body.addEventListener('click', function (event) {
    data.editIndex = null
  })
})

// 查询
const queryData = async () => {
  data.tableData = await queryFaultReformByCode({ faultCode: formData.value.faultCode })
  if (data.tableData) {
    data.tableData.forEach(async (d) => {
      let params = { params: { parentId: d.id } }
      const list = await requestClient.get(import.meta.env.VITE_BASIC + '/attachFileInfo/queryAttachList', params, { showmask: false })
      data.fileData[d.id] = list
    })
  }
}

watch(formData, async (newval) => {
  queryData()
})
const editClick = (row) => {
  data.reformData = JSON.parse(JSON.stringify(row))
  data.reformData.requireFinishTime = formatDateTime(data.reformData.requireFinishTime)
  modalApiA.open()
}
const saveReformInfo = async () => {
  await refoFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await saveFaultReform(data.reformData, { params: { bakId: data.bakId } })
        modalApiA.close()
        ElNotification({
          title: '提示',
          message: '保存成功！',
          type: 'success'
        })
        queryData()
      } catch (error) {
        ElMessage.error('保存失败！')
        return
      }
    } else {
      ElMessage.warning('请输入必填项！')
    }
  })
}
const updateRingClick = async (row) => {
  const valid = await closeRingValid(row)
  if (valid) {
    ElMessageBox.confirm('是否确认闭环? ', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      await updateRing({ id: row.id })
      queryData()
      ElNotification({
        title: '提示',
        message: '闭环成功！',
        type: 'success'
      })
    })
  }
}
const closeRingValid = async (row) => {
  let msg = ''
  if (!row.transTime || !row.transMan) {
    msg += '请先完成措施整改'
  }
  if (msg) {
    ElMessageBox.alert(msg, '提示信息', {
      type: 'warning',
      buttonSize: 'small',
      showClose: false
    })
    return false
  } else {
    return true
  }
}

const addRowClick = async () => {
  let rs = await initFaultReform({ faultCode: formData.value.faultCode })
  data.reformData = rs.reData
  data.bakId = rs.bakId
  modalApiA.open()
}

const afterUpload = (fileList) => {
  if (data.reformData.id && fileList) {
    data.fileData[data.reformData.id] = fileList
  }
}
const deleteFile = async (file) => {
  let fileList = data.fileData[data.reformData.id]
  if (fileList) {
    for (let i = 0; i < fileList.length; i++) {
      const f = fileList[i]
      if (f.id == file.id) {
        fileList.splice(i, 1)
        break
      }
    }
  }
}
const flMeasureClick = async (row) => {
  const valid = await validateRow(row)
  if (valid) {
    ElMessageBox.confirm('是否确认下发? ', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      await flMeasure({ id: row.id })
      queryData()
      ElNotification({
        title: '提示',
        message: '下发成功！',
        type: 'success'
      })
    })
  }
}
const validateRow = async (row) => {
  let msg = ''
  if (!row.measureContent) {
    msg += '措施描述，'
  }
  if (!row.reformDept) {
    msg += '整改单位，'
  }
  if (!row.reformMan) {
    msg += '执行人员，'
  }
  if (!row.requireFinishTime) {
    msg += '要求完成时间，'
  }
  if (msg) {
    msg = msg.substring(0, msg.length - 1)
    ElMessageBox.alert('请编辑填写：' + msg, '提示信息', {
      type: 'error',
      dangerouslyUseHTMLString: true,
      buttonSize: 'small',
      showClose: false
    })
    return false
  } else {
    return true
  }
}

const deleteClick = (index) => {
  let ids = data.tableData[index].id
  ElMessageBox.confirm('确认是否删除选中的记录? ', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    if (ids != '') {
      await reformDeleteRow({ ids: ids })
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
      await reformDeleteRow({ ids: ids.substring(0, ids.length - 1) })
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
  if (column.label != '操作' && column.label != '佐证附件' && column.label != '是否闭环' && column.label != '确认时间') {
    data.editIndex = data.tableData.indexOf(row)
  }
  event.stopPropagation()
}

// 通知和催办
const tzcbData = reactive({
  userCode: '',
  userPhone: '',
  content: '',
  openAdd: false,
  faultCode: ''
})
const cbanClick = async (row) => {
  if (row.reformMan) {
    const params = {
      recordType: '2',
      tacheCode: 'correct',
      faultCode: formData.value.faultCode,
      userCode: row.reformMan
    }
    try {
      const res = await getNotifyInfo(params)
      tzcbData.userCode = res.userCode
      tzcbData.userPhone = res.userPhone
      tzcbData.content = res.content
      tzcbData.openAdd = res.openAdd
      tzcbData.faultCode = res.faultCode
      modalCbApi.open()
    } catch (error) {
      console.error(error)
    }
  } else {
    ElMessage.error('执行人员为空！')
  }
}
const closeCb = () => {
  modalCbApi.close()
}

const handleChange = (row) => {
  // if (!data.updateList.includes(row)) {
  //   data.updateList.push(row);
  // }
}
const filePreviewClick = (item) => {
  if (item.fileType == 'xls' || item.fileType == 'xlsx') {
    downloadClick(item)
    ElMessage.warning('Excel文件无法预览，请在下载后打开！')
    return
  }
  modalApiC.open()
  data.curPreviewUrl = import.meta.env.VITE_BASIC + '/attachFileInfo/preview?objectId=' + item.id
  data.curFileType = item.fileType
}
const downloadClick = (row) => {
  const accessStore = useAccessStore()
  axios.defaults.headers.post['Authorization'] = formatToken(accessStore.accessToken)
  axios({
    method: 'post',
    url: import.meta.env.VITE_BASIC + '/attachFileInfo/downLoad',
    responseType: 'blob',
    params: { objectId: row.id }
  }).then((res) => {
    var blob = new Blob([res.data], {
      type: 'application/x-msdownload;charset=UTF-8'
    })
    // 创建一个blob的对象链接
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    // 设置下载文件名
    link.setAttribute('download', row.name + '.' + row.fileType)
    document.body.appendChild(link)

    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  })
}
function typeContains(type, types) {
  return types.indexOf(type) >= 0
}

// 导入措施
const importMeasure = async () => {
  await requestClient.get(import.meta.env.VITE_NSOSGZ + '/reformRecord/importMeasure?faultCode=' + formData.value.faultCode)
  ElMessage.success('导入成功！')
  queryData()
}
const userSelectOk = (user) => {
  data.reformData[data.curUserNameProp] = user.employeeName
  data.reformData[data.curUserProp] = user.employeeAccount
  modalApiB.close()
}
const userAddClick = (codeProp, nameProp) => {
  data.curUserProp = codeProp
  data.curUserNameProp = nameProp
  modalApiB.open()
}
defineExpose({ importMeasure })
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

.operate-disabled {
  display: flex;
  align-items: center;
  justify-content: center;
  color: grey;
}

.operate-disabled > span {
  cursor: not-allowed;
}

.operate-abled {
  display: flex;
  align-items: center;
  justify-content: center;
  color: hsl(var(--primary));
}

.prim {
  color: hsl(var(--primary));
  cursor: pointer;
}

.prim:hover {
  text-decoration: underline;
}

.bhzcx:hover {
  text-decoration: underline;
}

.dianji {
  font-weight: normal;
  cursor: pointer;
}

.dianji:hover {
  text-decoration: underline;
}

.file-icon {
  width: 12px;
  height: 12px;
  margin-top: 1px;
  cursor: default;
}

.yy {
  background: url('/images/attach/yy.png') center no-repeat;
  background-size: 100% 100%;
}

.sp {
  background: url('/images/attach/sp.png') center no-repeat;
  background-size: 100% 100%;
}

.ys {
  background: url('/images/attach/ys.png') center no-repeat;
  background-size: 100% 100%;
}

.exe {
  background: url('/images/attach/exe.png') center no-repeat;
  background-size: 100% 100%;
}

.word {
  background: url('/images/attach/word.png') center no-repeat;
  background-size: 100% 100%;
}

.execls {
  background: url('/images/attach/excel.png') center no-repeat;
  background-size: 100% 100%;
}

.txt {
  background: url('/images/attach/txt.png') center no-repeat;
  background-size: 100% 100%;
}

.pdf {
  background: url('/images/attach/pdf.png') center no-repeat;
  background-size: 100% 100%;
}

.tp {
  background: url('/images/attach/tp.png') center no-repeat;
  background-size: 100% 100%;
}

.qt {
  background: url('/images/attach/qt.png') center no-repeat;
}

.html {
  background: url('/images/attach/html.png') center no-repeat;
  background-size: 100% 100%;
}
</style>
