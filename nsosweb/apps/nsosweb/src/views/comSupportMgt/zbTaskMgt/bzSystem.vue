<template>
  <div class="w-full h-full pt-2">
    <div class="flex pb-1">
      <span>保障系统编辑信息：</span>
      <span class="flex items-center primary ml-0 cursor-pointer" @click="addRowClick" v-if="formData && formData.id && data.editable">＋添加</span>
      <span class="delcss flex items-center ml-3" @click="batchDeleteClick()" v-if="formData && formData.id && data.editable"><Delete class="h-[12px] w-[12px] mt-[0px]"></Delete><span>批量删除</span></span>
    </div>
    <el-table :data="data.tableData" ref="tableDataRef" border size="small" style="width: 100%">
      <el-table-column type="selection" width="40" align="center" v-if="data.editable" />
      <el-table-column type="index" width="40" label="#" align="center" />
      <el-table-column prop="systemNo" label="系统名称" column-key="NSOS_SYSTEM_INFO" :formatter="formatDrop" width="200" align="center"></el-table-column>
      <el-table-column prop="guaranteeType" label="保障策略类别" width="120" align="center">
        <template #default="scope">
          {{ bzclType.filter((d) => d.value == scope.row.guaranteeType)[0]?.label }}
        </template>
      </el-table-column>
      <el-table-column prop="cycle " label="周期" width="90" align="center">
        <template #default="scope">
          {{ bqType.filter((d) => d.value == scope.row.cycle)[0]?.label }}
        </template>
      </el-table-column>
      <el-table-column prop="guaranteeUnitName" label="保障单位" width="200" align="center"> </el-table-column>
      <el-table-column prop="guaranteeRequire" label="保障策略要求" width="250" align="center"> </el-table-column>
      <el-table-column prop="planStartTime" label="计划开始时间" width="130" :formatter="tDateTimeFormat" align="center"> </el-table-column>
      <el-table-column prop="planEndTime" label="计划完成时间" width="130" :formatter="tDateTimeFormat" align="center"> </el-table-column>
      <el-table-column label="操作" :width="data.editable ? 125 : 90" fixed="right" align="center">
        <template #default="scope">
          <div class="" >
            <span class="qx primary m-auto" v-if="scope.row.guaranteeType == '3'" @click="xjclClick(scope.row.id)">巡检策略</span>
            <span class="qx primary ml-2" v-if="data.editable" @click="editRow(scope.row)">编辑</span>
            <span class="delcss ml-2" v-if="data.editable" @click="deleteClick(scope.$index)"><Delete class="inline-flex h-[12px] w-[12px] mt-[-2.5px]" /></span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <ModalA class="w-[800px] h-[350px] top-[25vh]" :title="data.fmData.id ? '编辑' : '添加'" :footer="false" :closeOnClickModal="false" :draggable="true">
      <el-form label-width="120px" ref="dataFormRef" :model="data.fmData" :rules="formRules" :inline="true" label-position="right" class="h-[230px] demo-form-inline">
        <el-row>
          <el-col :span="12">
            <el-form-item label="系统名称:" prop="systemNo">
              <el-select v-model="data.fmData.systemNo" filterable clearable>
                <el-option v-for="item in dropList.NSOS_SYSTEM_INFO" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="保障单位:" prop="guaranteeUnit">
              <OrgTreeSelect v-model="data.fmData.guaranteeUnit" @updateName="(v) => (data.fmData.guaranteeUnitName = v)" filterable></OrgTreeSelect>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="保障策略类别:" prop="guaranteeType">
              <el-select v-model="data.fmData.guaranteeType" filterable clearable>
                <el-option v-for="item in bzclType" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="周期:" prop="cycle">
              <el-select v-model="data.fmData.cycle" filterable clearable>
                <el-option v-for="item in bqType" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="保障策略要求:" prop="guaranteeRequire">
              <el-input v-model="data.fmData.guaranteeRequire" :rows="3" maxlength="500" show-word-limit type="textarea" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="计划完成时间:" prop="planStartTime">
              <el-date-picker v-model="data.fmData.planStartTime" type="date" value-format="YYYY-MM-DD" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="要求完成时间:" prop="planEndTime">
              <el-date-picker v-model="data.fmData.planEndTime" type="date" value-format="YYYY-MM-DD" clearable />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="text-center pt-[20px]">
        <el-button type="primary" class="ml-4" :icon="Tickets" @click="saveData">保存</el-button>
        <el-button type="info" class="ml-4" :icon="Close" @click="modalApiA.close()">取消</el-button>
      </div>
    </ModalA>
    <ModalB class="w-[1200px] h-[650px]" title="人员选择" :footer="false" :closeOnClickModal="false" :draggable="true">
      <UserSelect @selectOk="userSelectOk"></UserSelect>
    </ModalB>
    <ModalC class="w-[1000px] h-[260px] top-[25vh]" title="巡检策略" :footer="false" :closeOnClickModal="false" :draggable="true">
      <el-form label-width="130px" :model="data.xjData" :rules="formRules" :disabled="!data.editable" :inline="true" label-position="right" class="h-[140px] demo-form-inline">
        <el-row>
          <el-col :span="8">
            <el-form-item label="巡检开始时间:" prop="xjStartTime">
              <el-date-picker v-model="data.xjData.xjStartTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="巡检结束时间:" prop="xjEndTime">
              <el-date-picker v-model="data.xjData.xjEndTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="巡检评率(次/天):" prop="xjRate">
              <el-select v-model="data.xjData.xjRate" @change="xjRateChange" filterable clearable>
                <el-option v-for="item in rateType" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col v-if="data.xjData.xjRate && data.xjData.xjRate >= 1" :span="8">
            <el-form-item label="巡检时间1:" prop="time1">
              <el-time-select v-model="data.xjData.time1" start="00:00:00" step="00:15:00" end="23:59:59" format="HH:mm:ss" />
            </el-form-item>
          </el-col>
          <el-col v-if="data.xjData.xjRate && data.xjData.xjRate >= 2" :span="8">
            <el-form-item label="巡检时间2:" prop="time2">
              <el-time-select v-model="data.xjData.time2" start="00:00:00" step="00:15:00" end="23:59:59" format="HH:mm:ss" />
            </el-form-item>
          </el-col>
          <el-col v-if="data.xjData.xjRate && data.xjData.xjRate >= 3" :span="8">
            <el-form-item label="巡检时间3:" prop="time3">
              <el-time-select v-model="data.xjData.time3" start="00:00:00" step="00:15:00" end="23:59:59" format="HH:mm:ss" />
            </el-form-item>
          </el-col>
          <el-col v-if="data.xjData.xjRate && data.xjData.xjRate >= 4" :span="8">
            <el-form-item label="巡检时间4:" prop="time4">
              <el-time-select v-model="data.xjData.time4" start="00:00:00" step="00:15:00" end="23:59:59" format="HH:mm:ss" />
            </el-form-item>
          </el-col>
          <el-col v-if="data.xjData.xjRate && data.xjData.xjRate >= 5" :span="8">
            <el-form-item label="巡检时间5:" prop="time5">
              <el-time-select v-model="data.xjData.time5" start="00:00:00" step="00:15:00" end="23:59:59" format="HH:mm:ss" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="text-center pt-[20px]">
        <el-button type="primary" class="ml-4" :icon="Tickets" :disabled="!data.editable" @click="saveXjclData">保存</el-button>
        <el-button type="info" class="ml-4" :icon="Close" @click="modalApiC.close()">取消</el-button>
      </div>
    </ModalC>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { ElForm, ElFormItem, ElRow, ElCol, ElNotification, ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Download, EditPen, Share, Plus, Tickets, Close } from '@element-plus/icons-vue'
import { formatDateTime, formatDate, tDateTimeFormat, formatDrop } from '#/utils/commonUtil.ts'
import { useDropStore } from '#/store'
import { useVbenModal } from '@vben/common-ui'
import AttachFileA from '#/views/basic/attach/attachFileA.vue'
import OrgTreeSelect from '#/views/basic/common/orgTreeSelect.vue'
import UserSelect from '#/views/basic/common/userSelect.vue'
import { requestClient } from '#/api/request'

const dropList = reactive({})

const formData = defineModel('formData')
const disabled = defineModel('disabled')
const dataFormRef = ref()
const tableDataRef = ref()
const data = reactive({
  faultCode: null,
  tableData: [],
  fmData: {},
  xjData: {},
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
  guaranteeRequire: [
    { required: true, message: '请输入保障策略要求', trigger: 'blur' },
    { min: 0, max: 500, message: '内容长度最大不能超过500', trigger: 'blur' }
  ],
  systemNo: [{ required: true, message: '请选择系统名称', trigger: 'change' }],
  guaranteeUnit: [{ required: true, message: '请选择保障单位', trigger: 'change' }],
  guaranteeType: [{ required: true, message: '请选择保障策略类别', trigger: 'change' }],
  cycle: [{ required: true, message: '请选择周期', trigger: 'change' }],
  planStartTime: [{ required: true, message: '请选择计划完成时间', trigger: 'blur' }],
  planEndTime: [{ required: true, message: '请选择要求完成时间', trigger: 'blur' }],
  time1: [{ required: true, message: '请选择巡检时间1', trigger: 'change' }],
  time2: [{ required: true, message: '请选择巡检时间2', trigger: 'change' }],
  time3: [{ required: true, message: '请选择巡检时间3', trigger: 'change' }],
  time4: [{ required: true, message: '请选择巡检时间4', trigger: 'change' }],
  time5: [{ required: true, message: '请选择巡检时间5', trigger: 'change' }],
  xjStartTime: [{ required: true, message: '请选择巡检开始时间', trigger: 'blur' }],
  xjEndTime: [{ required: true, message: '请选择巡检时间', trigger: 'blur' }],
  xjRate: [{ required: true, message: '请选择巡检频率', trigger: 'change' }],
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
const bzclType = [
  { label: '业务保障策略', value: '1' },
  { label: '应急响应策略', value: '2' },
  { label: '巡检策略', value: '3' },
  { label: '值守策略', value: '4' },
  { label: '作业管控策略', value: '5' }
]
const rateType = [
  { label: '1次/天', value: '1' },
  { label: '2次/天', value: '2' },
  { label: '3次/天', value: '3' },
  { label: '4次/天', value: '4' },
  { label: '5次/天', value: '5' }
]
const bqType = [
  { label: '一次性', value: '1' },
  { label: '周期', value: '2' }
]
// 查询
const queryData = async () => {
  data.tableData = await requestClient.get(import.meta.env.VITE_NSOSGZ + '/secureOsInfo/querySecureOsByCode', { params: { guaranteeNo: formData.value.guaranteeNo, guaranteeOsType: '1' } })
  data.editable = !disabled.value
}

watch(formData, async (newval) => {
  data.faultCode = formData.value.faultCode
  queryData()
})

const saveData = async () => {
  await dataFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await requestClient.post(import.meta.env.VITE_NSOSGZ + '/secureOsInfo/saveSecureOs', data.fmData)
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

const addRowClick = async () => {
  data.fmData = await requestClient.get(import.meta.env.VITE_NSOSGZ + '/secureOsInfo/initSecureOs', { params: { guaranteeNo: formData.value.guaranteeNo, guaranteeOsType: '1' } })
  modalApiA.open()
}

// 编辑
const editRow = async (row) => {
  data.fmData = JSON.parse(JSON.stringify(row))
  data.fmData.planStartTime = formatDate(data.fmData.planStartTime)
  data.fmData.planEndTime = formatDate(data.fmData.planEndTime)
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
      await requestClient.get(import.meta.env.VITE_NSOSGZ + '/secureOsInfo/deleteSecureOs', { params: { ids: ids } })
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
      await requestClient.get(import.meta.env.VITE_NSOSGZ + '/secureOsInfo/deleteSecureOs', { params: { ids: ids.substring(0, ids.length - 1) } })
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
const xjclClick = async (id) => {
  data.xjData = await requestClient.get(import.meta.env.VITE_NSOSGZ + '/secureInspectionStrategy/queryByOsId', { params: { osId: id } })
  modalApiC.open()

  data.xjData.xjStartTime = formatDateTime(data.xjData.xjStartTime)
  data.xjData.xjEndTime = formatDateTime(data.xjData.xjEndTime)

  data.xjData.time1 = null
  data.xjData.time2 = null
  data.xjData.time3 = null
  data.xjData.time4 = null
  data.xjData.time5 = null
  if (data.xjData.xjRate) {
    let ts = data.xjData.xjTime.split(';')

    if (ts.length > 0) {
      for (let i = 0; i < ts.length; i++) {
        data.xjData['time' + (i+1)] = ts[i]
      }
    }
    console.log(data.xjData);
    
  }
}
const saveXjclData = async () => {
  if (data.xjData.xjRate) {
    let rate = parseInt(data.xjData.xjRate)
    let xjTime = ''
    for (let i = 1; i <= rate; i++) {
      xjTime += data.xjData['time'+i] + ';'
    }
    data.xjData.xjTime = xjTime
  }
  try {
    await requestClient.post(import.meta.env.VITE_NSOSGZ + '/secureInspectionStrategy/saveXjData', data.xjData)
    modalApiC.close()
    ElNotification({
      title: '提示',
      message: '保存成功！',
      type: 'success'
    })
  } catch (error) {
    ElMessage.error('保存失败！')
    return
  }
}
const xjRateChange = (v) => {
  if (v == '1') {
    data.xjData.timeSlot = [1]
  } else if (v == '2') {
    data.xjData.timeSlot = [1, 2]
  } else if (v == '3') {
    data.xjData.timeSlot = [1, 2, 3]
  } else if (v == '4') {
    data.xjData.timeSlot = [1, 2, 3, 4]
  } else if (v == '5') {
    data.xjData.timeSlot = [1, 2, 3, 4, 5]
  }
}
const afterDelete = async (file) => {
  clearReplayReportId(formData.value.id, file.id, '1')
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
