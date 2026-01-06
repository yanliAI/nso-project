<template>
  <div class="w-full h-full">
    <div class="h-8 flex items-center" v-if="!disabled">
      <!-- <div class="czjlds">处置记录</div> -->
      <div class="flex-1 text-right">
        <el-button type="primary" plain class="ml-4" :icon="Plus" v-if="faultData && faultData.id" size="small" @click="addRowClick">添加</el-button>
        <el-button type="danger" plain class="ml-4" :icon="Delete" v-if="faultData && faultData.id" size="small" @click="deleteClick">删除</el-button>
      </div>
    </div>
    <div :class="disabled ? 'flex items-center mt-[8px] mb-1' : 'flex items-center mt-[-8px] mb-1'">
      <div class="primary">现场验证</div>
      <div class="kkl-b"></div>
    </div>
    <el-table :data="data.tableData" ref="tableDataRef" border size="small" style="width: 100%">
      <el-table-column type="selection" width="40" align="center" />
      <el-table-column type="index" width="40" label="#" align="center" />
      <el-table-column prop="inspectorName" label="反馈人" width="180" align="center"></el-table-column>
      <el-table-column prop="inspectRecoverTime" label="反馈时间" width="180" align="center">
        <template #default="scope">
          <span>
            {{ scope.row.inspectRecoverTime }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="checkResult" label="是否恢复" width="180" align="center">
        <template #default="scope">
          <span>
            {{ dropList.NSOS_YES_OR_NO.filter((d) => d.value == scope.row.checkResult)[0]?.label }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="相关附件" align="left" header-align="center">
        <template #default="scope">
          <div v-for="(item, index) in data.fileData[scope.row.id]" :key="'ath' + index" class="flex items-center">
            <div v-if="typeContains(item.fileType, 'xlsx')" class="file-icon execls"></div>
            <div v-else-if="typeContains(item.fileType, 'mp3apewavflacwmampegogg')" class="file-icon yy"></div>
            <div v-else-if="typeContains(item.fileType, 'mp4aviwmvrmvbflv')" class="file-icon sp"></div>
            <div v-else-if="typeContains(item.fileType, 'rarzip7zgztar')" class="file-icon ys"></div>
            <div v-else-if="typeContains(item.fileType, 'docxrtf')" class="file-icon word"></div>
            <div v-else-if="typeContains(item.fileType, 'txt')" class="file-icon txt"></div>
            <div v-else-if="typeContains(item.fileType, 'pdf')" class="file-icon pdf"></div>
            <div v-else-if="typeContains(item.fileType, 'pngjpgjpeggifsvg')" class="file-icon tp"></div>
            <div v-else class="file-icon qt"></div>
            <div class="flex-1 ml-1 dianji" @click="filePreviewClick(item)">{{ item.name }}.{{ item.fileType }}</div>
            <el-tooltip content="下载" placement="bottom" effect="light">
              <Download class="w-[16px] h-[16px] dianji primary ml-0" @click="downloadClick(item)" />
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="!disabled" label="操作" width="50" align="center">
        <template #default="scope">
          <div class="flex items-center">
            <el-tooltip content="编辑" placement="bottom" effect="light">
              <Edit class="abgh primary m-auto" style="width: 18px; height: 18px" @click="editValidClick(scope.row)" />
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="flex items-center mt-1">
      <div class="primary">用户验证</div>
      <div class="kkl-b"></div>
    </div>
    <div class="text-right pb-[6px] mt-[-7px]" v-if="faultData && faultData.id && !disabled">
      <el-button type="primary" plain class="" @click="noticeYfValidClick" :icon="Position" size="small">通知运服验证</el-button>
    </div>
    <el-table :data="data.verifyData" border size="small" style="width: 100%" :class="disabled ? 'mt-1' : ''">
      <el-table-column type="index" width="40" label="#" align="center" />
      <el-table-column prop="notifyTime" label="通知时间" :formatter="tDateTimeFormat" align="center" />
      <el-table-column prop="notifierName" label="通知人" align="center" />
      <el-table-column prop="feedbackTime" label="运服反馈时间" :formatter="tDateTimeFormat" align="center" />
      <el-table-column prop="feedbackerName" label="反馈人" align="center" />
      <el-table-column prop="isRecover" label="用户验证是否恢复" align="center" />
    </el-table>
    <ModalA class="w-[700px] h-[380px] top-[25vh]" :title="data.verifyInfo.id ? '编辑现场验证' : '添加现场验证'" :footer="false" :closeOnClickModal="false" :draggable="true">
      <el-form label-width="auto" ref="verifyFormRef" :model="data.verifyInfo" :rules="formRules" :inline="true" label-position="right" class="h-[94px] demo-form-inline">
        <el-row>
          <el-col :span="12">
            <el-form-item label="反馈人:" prop="inspectorName">
              <!-- <el-select v-model="data.verifyInfo.inspector" filterable>
                <el-option v-for="item in dropList.NSOS_USER_NAME" :key="item.value" :label="item.label" :value="item.value" />
              </el-select> -->
              <el-input v-model="data.verifyInfo.inspectorName" readonly>
                <template #append>
                  <el-button :icon="Plus" @click="modalApiB.open()" />
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="反馈时间:" prop="inspectRecoverTime">
              <el-date-picker v-model="data.verifyInfo.inspectRecoverTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否恢复:" prop="checkResult">
              <el-select v-model="data.verifyInfo.checkResult" filterable>
                <el-option v-for="item in dropList.NSOS_YES_OR_NO" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="h-[170px]">
        <AttachFileA ref="attachListRef" :parentId="data.verifyInfo.id ? data.verifyInfo.id : data.bakId" :inAdvance="true" @afterUpload="afterUpload" @afterDelete="deleteFile" :showPreview="false"></AttachFileA>
      </div>
      <div class="text-center pt-[20px]">
        <el-button type="primary" class="ml-4" :icon="Tickets" @click="saveValidInfo" >保存</el-button>
        <el-button type="info" class="ml-4" :icon="Close" @click="modalApiA.close()" >取消</el-button>
      </div>
    </ModalA>
    <ModalB class="w-[1200px] h-[650px]" title="人员选择" :footer="false" :closeOnClickModal="false" :draggable="true">
      <UserSelect @selectOk="userSelectOk"></UserSelect>
    </ModalB>
    <ModalC class="w-[1000px] h-[650px]" title="预览" :footer="false" :closeOnClickModal="false" :draggable="true">
      <FilePreview :url="data.curPreviewUrl" :fileType="data.curFileType"></FilePreview>
    </ModalC>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { ElTable, ElTableColumn, ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { CircleCheck, Position, Plus, Delete, Edit, Upload, Download, Close, Tickets } from '@element-plus/icons-vue'
import { useDropStore } from '#/store'
import { formatDateTime, tDateTimeFormat, formatDrop, formatToken } from '#/utils/commonUtil.ts'
import { queryFaultValid, validAddRow, validDelRow, saveValid, initValid, noticeYfValid, queryDeptUserValid } from './faultDetailMethod.ts'
import { useVbenModal } from '@vben/common-ui'
import AttachFileA from '#/views/basic/attach/attachFileA.vue'
import FilePreview from '#/views/basic/attach/filePreview.vue'
import UserSelect from '#/views/basic/common/userSelect.vue'
import { requestClient } from '#/api/request'
import { useAccessStore } from '@vben/stores';
import axios from 'axios'

const dropList = reactive({})

const faultData = defineModel('faultData')
const disabled = defineModel('disabled')
const tableDataRef = ref()
const verifyFormRef = ref()
const data = reactive({
  planAction: '1',
  editIndex: null,
  updateList: [],
  tableData: [],
  verifyData: [],
  verifyInfo: {},
  fileData: {},
  curPreviewUrl: null,
  curFileType: null
})
const formRules = reactive({
  inspector: [{ required: true, message: '请选择反馈人', trigger: 'change' }],
  inspectRecoverTime: [{ required: true, message: '请选择反馈时间', trigger: 'blur' }],
  checkResult: [{ required: true, message: '请选择是否恢复', trigger: 'change' }]
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
onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = ['NSOS_YES_OR_NO']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)
})

watch(faultData, async (val) => {
  if (faultData.value.faultCode) {
    refreshList()
    const tlist = await queryDeptUserValid({ faultCode: faultData.value.faultCode })
    if (tlist) {
      data.verifyData = tlist
    }
  }
})
const refreshList = async () => {
  data.tableData = await queryFaultValid({ faultCode: faultData.value.faultCode })
  if (data.tableData) {
    data.tableData.forEach(async (d) => {
      let params = { params: { parentId: d.id } }
      const list = await requestClient.get(import.meta.env.VITE_BASIC + '/attachFileInfo/queryAttachList', params, { showmask: false })
      data.fileData[d.id] = list
    })
  }
  formatEntity()
}
const afterUpload = (fileList) => {
  if (data.verifyInfo.id && fileList) {
    data.fileData[data.verifyInfo.id] = fileList
  }
}
const deleteFile = async (file) => {
  let fileList = data.fileData[data.verifyInfo.id]
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
const formatEntity = () => {
  data.tableData.forEach((t) => {
    t.inspectRecoverTime = formatDateTime(t.inspectRecoverTime)
  })
}
const addRowClick = async () => {
  let rs = await initValid({ faultCode: faultData.value.faultCode })
  data.verifyInfo = rs.validData
  data.verifyInfo.inspectRecoverTime = formatDateTime(data.verifyInfo.inspectRecoverTime)
  data.bakId = rs.bakId

  modalApiA.open()
}
const userSelectOk = (user) => {
  data.verifyInfo.inspectorName = user.employeeName
  data.verifyInfo.inspector = user.employeeAccount
  modalApiB.close()
}
const noticeYfValidClick = async () => {
  ElMessageBox.confirm('确认是否通知运服验证? ', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const d = await noticeYfValid({ faultCode: faultData.value.faultCode })
    data.verifyData.push(d)
    ElNotification({
      title: '提示',
      message: '通知运服验证成功！',
      type: 'success'
    })
  })
}
const deleteClick = () => {
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
      await validDelRow({ ids: ids.substring(0, ids.length - 1) })
    }
    ElNotification({
      title: '提示',
      message: '删除成功！',
      type: 'success'
    })
    rows.forEach((r) => {
      for (let i = 0; i < data.tableData.length; i++) {
        if (data.tableData[i].id == r.id) {
          data.tableData.splice(i, 1)
        }
      }
    })
  })
}
const saveValidInfo = async () => {
  let count = 0
  await verifyFormRef.value.validate(async (valid) => {
    if (count > 0) return
    count++
    if (valid) {
      const vd = await saveValid(data.verifyInfo, { params: { bakId: data.bakId } })
      modalApiA.close()
      if (vd) {
        let have = false
        for (let i = 0; i < data.tableData.length; i++) {
          if (data.tableData[i].id == vd.id) {
            have = true
            break
          }
        }
        if (!have) {
          let params = { params: { parentId: vd.id } }
          const list = await requestClient.get(import.meta.env.VITE_BASIC + '/attachFileInfo/queryAttachList', params, { showmask: false })
          data.fileData[vd.id] = list
          data.tableData.push(vd)
        }
      }

      ElNotification({
        title: '提示',
        message: '保存成功！',
        type: 'success'
      })
    } else {
      ElMessage.warning('请输入必填项！')
    }
  })
}
const editValidClick = (row) => {
  data.verifyInfo = row
  modalApiA.open()
}
const onClickEdit = (row, column, event) => {
  if (column.label != '操作') {
    data.editIndex = data.tableData.indexOf(row)
  }
  event.stopPropagation()
}
const handleChange = (row) => {
  if (!data.updateList.includes(row)) {
    data.updateList.push(row)
  }
}
function typeContains(type, types) {
  return types.indexOf(type) >= 0
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
defineExpose({})
</script>
<style scoped>
.abgh {
  cursor: pointer;
}

.primary {
  color: hsl(var(--primary));
}

.kkl-b {
  flex: 1;
  margin-left: 5px;
  border-top: 1px solid #c4dbf5;
}

.gljk {
  color: #52c41a;
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

.el-form--inline .el-form-item {
  width: 100% !important;
  margin-right: 0 !important;
  margin-bottom: 15px !important;
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
