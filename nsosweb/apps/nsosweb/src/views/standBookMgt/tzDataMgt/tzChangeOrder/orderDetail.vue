<template>
  <div class="main-d">
    <div class="head-d">
      <div class="flex items-center h-6">
        <div class="w-[493px] font-bold text-lg">台账变更工单</div>
        <div class="flex items-center cursor-pointer primary delcss"></div>
        <div class="flex-1 text-right pr-2">
          <el-button type="primary" :icon="Tickets" v-if="data.orderData && data.orderData.sheetStatus == '0'" @click="saveClick" size="small">保存</el-button>
          <el-button type="primary" :icon="Promotion" v-if="data.orderData && data.orderData.id && data.orderData.sheetStatus == '0'" @click="sendClick('1', '提交')" size="small">提交</el-button>
          <el-button type="primary" :icon="Promotion" v-if="data.orderData && data.orderData.sheetStatus == '1'" @click="sendClick('2', '审核')" size="small">审核</el-button>
          <el-button type="danger" :icon="Delete" v-if="data.orderData && data.orderData.id && data.orderData.sheetStatus == '0'" @click="deleteClick" size="small">删除</el-button>
        </div>
      </div>
    </div>
    <div class="body-d">
      <div class="body-c">
        <el-collapse v-model="activeNames">
          <el-collapse-item title="工单信息" :icon="CaretRight" name="1">
            <template #title>
              <div class="flex items-center primary">
                <div class="mnjkg mt-[-1px] mr-[2px]"></div>
                <div class="ml-1 font-bold">工单信息</div>
              </div>
            </template>
            <div class="part-b">
              <el-form label-width="110px" ref="ruleFormRef" :model="data.orderData" :rules="formRules" :disabled="data.orderData.sheetStatus != '0'" :inline="true" label-position="right" class="demo-form-inline mt-2">
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="工单号:" prop="sheetNo">
                      <el-input v-model="data.orderData.sheetNo" disabled clearable />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="工单标题:" prop="sheetTitle">
                      <el-input v-model="data.orderData.sheetTitle" clearable />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="工单类型:" prop="sheetType">
                      <el-select v-model="data.orderData.sheetType" filterable>
                        <el-option v-for="item in orderType" :key="item.value" :label="item.label" :value="item.value" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="工单内容:" prop="sheetContent">
                      <el-input v-model="data.orderData.sheetContent" :rows="2" maxlength="1600" show-word-limit type="textarea" clearable />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="变更内容:" prop="bgnr">
                      <el-input v-model="data.orderData.bgnr" :rows="2" maxlength="1600" show-word-limit type="textarea" clearable />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="变更原因:" prop="bgyy">
                      <el-input v-model="data.orderData.bgyy" :rows="2" maxlength="1600" show-word-limit type="textarea" clearable />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="变更目的:" prop="bgmd">
                      <el-input v-model="data.orderData.bgmd" :rows="2" maxlength="1600" show-word-limit type="textarea" clearable />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="发起人:" prop="sendMan">
                      <el-select v-model="data.orderData.sendMan" disabled>
                        <el-option v-for="item in dropList.NSOS_USER_NAME" :key="item.value" :label="item.label" :value="item.value" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="发起时间:" prop="sendTime">
                      <el-date-picker v-model="data.orderData.sendTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" disabled clearable />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <div class="mt-2">
                <AttachFileA ref="attachListRef" :disabled="data.orderData.sheetStatus != '0'" :parentId="data.orderData.id ? data.orderData.id : data.bakId" moduleId="ORDER_FILE" :inAdvance="data.orderData.id ? false : true">
                  <template v-slot:title>
                    <span>变更工单附件：</span>
                  </template>
                </AttachFileA>
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item v-if="data.orderData && data.orderData.sheetStatus >= 1" :icon="CaretRight" name="2">
            <template #title>
              <div class="flex items-center primary">
                <div class="mnjkg mt-[-1px] mr-[2px]"></div>
                <div class="ml-1 font-bold">审批</div>
              </div>
            </template>
            <div class="part-b">
              <el-form label-width="100px" ref="opinionFormRef" :model="data.opinionData" :rules="formRules" :disabled="data.orderData.sheetStatus >= 2" :inline="true" label-position="right" class="demo-form-inline mt-2">
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="审批信息:" prop="opinion">
                      <el-input v-model="data.opinionData.opinion" :rows="3" maxlength="1000" show-word-limit type="textarea" placeholder="请输入审批信息" clearable />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-if="data.orderData.sheetStatus >= 2">
                    <el-form-item label="处理人:" prop="dealMan">
                      <el-select v-model="data.opinionData.dealMan" disabled>
                        <el-option v-for="item in dropList.NSOS_USER_NAME" :key="item.value" :label="item.label" :value="item.value" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-if="data.orderData.sheetStatus >= 2">
                    <el-form-item label="处理时间:" prop="dealTime">
                      <el-date-picker v-model="data.opinionData.dealTime" type="datetime" disabled clearable />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </el-collapse-item>

          <el-collapse-item :icon="CaretRight" name="4">
            <template #title>
              <div class="flex items-center primary">
                <div class="mnjkg mt-[-1px] mr-[2px]"></div>
                <div class="ml-1 font-bold">关联资产清单</div>
              </div>
            </template>
            <div class="part-b">
              <div class="pt-[2px] pb-[6px]">
                <div class="flex pb-1">
                  <span>资产编辑信息：</span>
                  <span class="flex items-center primary ml-0 cursor-pointer" @click="modalApiA.open()" v-if="data.orderData.id && data.orderData.sheetStatus == '0'">＋添加</span>
                  <span class="delcss flex items-center ml-3" @click="batchZzDeleteClick()" v-if="data.orderData.id && data.orderData.sheetStatus == '0'"><Delete class="h-[12px] w-[12px] mt-[0px]"></Delete><span>批量删除</span></span>
                </div>
                <el-table :data="data.tableData" ref="tableDataRef" show-overflow-tooltip border size="small" style="width: 100%; height: 300px">
                  <el-table-column type="selection" width="40" v-if="data.orderData.id && data.orderData.sheetStatus == '0'" align="center"/>
                  <el-table-column type="index" fixed width="45" label="#" align="center" />
                  <el-table-column prop="ruleName" label="规则名称" width="200" align="center" />
                  <el-table-column prop="ruleTableName" label="核查对象" width="120" align="center">
                    <template #default="scope">
                      {{ hcObject.filter((d) => d.value == scope.row.ruleTableName)[0]?.label }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="ruleColumnName" label="核查字段" width="120" align="center">
                    <template #default="scope">
                      {{ hcColumn.filter((d) => d.value == scope.row.ruleColumnName)[0]?.label }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="zcbm" label="资产编码" width="150" align="center" />
                  <el-table-column prop="zcmc" label="资产名称" width="150" align="center" />
                  <el-table-column prop="zcxx" label="资产信息" width="100" align="center" />
                  <el-table-column prop="ruleContent" label="核查规则(正则表达式)" width="300" align="left" header-align="center" />
                  <el-table-column prop="ruleDescribe" label="规则说明" width="250" align="left" header-align="center" />
                  <el-table-column prop="checkContent" label="核查内容" width="250" align="center" />
                  <el-table-column prop="checkResult" label="核查结果" width="100" align="center" />
                  <el-table-column prop="checkTime" label="核查时间" :formatter="tDateTimeFormat" width="160" align="center" />
                  <el-table-column label="操作" :width="45" v-if="data.orderData.id && data.orderData.sheetStatus == '0'" fixed="right" align="center">
                    <template #default="scope">
                      <div class="">
                        <span class="delcss m-auto" @click="deleteZzClick(scope.$index)"><Delete class="inline-flex h-[12px] w-[12px] mt-[-2.5px]" /></span>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
    <ModalA class="w-[1400px] h-[800px]" title="关联资产核查" :footer="false" :closeOnClickModal="false" :draggable="true">
      <HcResultList :sheetNo="data.orderData.sheetNo" @ok="queryZzList" @close="modalApiA.close()"></HcResultList>
    </ModalA>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref, watch, computed } from 'vue'
import { CaretRight, Expand, Tickets, HelpFilled, Operation, Finished, Download, Share, Promotion, Back, Checked, Comment, SuccessFilled, List, Delete, BottomRight, Check, Close, Plus, MuteNotification } from '@element-plus/icons-vue'
import { ElNotification, ElMessage, ElMessageBox, ElCollapse, ElCollapseItem, ElTable, ElTableColumn, ElCheckbox } from 'element-plus'
import { formatDateTime, lookFlow, tDateTimeFormat, formatDateZw, numberToChinese, formatToken, formatDrop } from '#/utils/commonUtil.ts'
import { useDropStore } from '#/store'
import AttachFileA from '#/views/basic/attach/attachFileA.vue'
import { useUserStore } from '@vben/stores'
import { useVbenModal } from '@vben/common-ui'
import { requestClient } from '#/api/request'
import HcResultList from './hcResultList.vue'

const dropList = reactive({})
const orderId = defineModel('orderId')
const tabName = defineModel('tabName')
const tableDataRef = ref()
const emit = defineEmits(['afterAdd', 'refreshList', 'removeTab', 'afterBack', 'afterDelete'])
const activeNames = ref(['1', '2', '3', '4', '5', '6'])

const data = reactive({
  orderData: {},
  opinionData: {},
  tableData: [],
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0
  },
  bakId: null
})
const [ModalA, modalApiA] = useVbenModal({
  onCancel() {
    modalApiA.close()
  }
})
const orderType = [
  { label: '台账异常', value: '1' },
  { label: '资产变更', value: '2' }
]
const hcResult = [
  { label: '合规', value: '合规' },
  { label: '不合规', value: '不合规' }
]
const hcObject = [
  { label: '系统信息', value: '1' },
  { label: '物理机', value: '2' },
  { label: '容器', value: '3' },
  { label: '组件信息', value: '4' }
]
const hcColumn = [
  { label: '系统名称', value: 'SYSTEM_NAME' },
  { label: 'IP', value: 'IP' }
]
const formData = reactive({})
const opinionFormRef = ref()

const formRules = reactive({
  sheetTitle: [
    { required: true, message: '请输入工单标题', trigger: 'blur' },
    { min: 0, max: 100, message: '内容长度最大不能超过100', trigger: 'blur' }
  ],
  sheetContent: [
    { required: true, message: '请输入工单内容', trigger: 'blur' },
    { min: 0, max: 1600, message: '内容长度最大不能超过1600', trigger: 'blur' }
  ],
  opinion: [
    { required: true, message: '请输入信息', trigger: 'blur' },
    { min: 0, max: 1000, message: '内容长度最大不能超过1000', trigger: 'blur' }
  ],
  sheetType: [{ required: true, message: '请选择工单类型', trigger: 'change' }]
})
onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = ['NSOS_USER_NAME']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)
  const { orderData, tableData, bakId } = await requestClient.get(import.meta.env.VITE_BASIC + '/filesWorksheet/initData', { params: { id: orderId.value } })
  data.orderData = orderData
  data.tableData = tableData
  data.bakId = bakId
  data.orderData.sendTime = formatDateTime(data.orderData.sendTime)

  data.opinionData.opinion = orderData.dealOpinion
  data.opinionData.dealMan = orderData.dealMan
  data.opinionData.dealTime = formatDateTime(orderData.dealTime)
})
const queryZzList = async () => {
  data.tableData = await requestClient.get(import.meta.env.VITE_BASIC + '/filesWorksheet/queryZzList', { params: { sheetNo: data.orderData.sheetNo } })
}
const saveClick = async () => {
  try {
    data.orderData = await requestClient.post(import.meta.env.VITE_BASIC + '/filesWorksheet/saveZbTask', data.orderData, { params: { bakId: data.bakId } })
    data.orderData.sendTime = formatDateTime(data.orderData.sendTime)

    ElNotification({
      title: '提示',
      message: '保存成功！',
      type: 'success'
    })
  } catch (error) {
    ElMessage.error('保存失败！')
    return
  }
  emit('refreshList')
  emit('afterAdd', data.orderData)
}
const deleteZzClick = (index) => {
  let ids = data.tableData[index].id
  ElMessageBox.confirm('确认是否删除选中的记录? ', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    if (ids != '') {
      await requestClient.get(import.meta.env.VITE_BASIC + '/filesWorksheetRela/deleteSecureOs', { params: { ids: ids } })
    }
    ElNotification({
      title: '提示',
      message: '删除成功！',
      type: 'success'
    })
    data.tableData.splice(index, 1)
  })
}
const batchZzDeleteClick = () => {
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
      await requestClient.get(import.meta.env.VITE_BASIC + '/filesWorksheetRela/deleteSecureOs', { params: { ids: ids.substring(0, ids.length - 1) } })
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
const sendClick = async (nextStatus, t) => {
  ElMessageBox.confirm('确认是否' + t + '? ', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await requestClient.get(import.meta.env.VITE_BASIC + '/filesWorksheet/sendOrder', { params: { id: orderId.value, nextStatus: nextStatus, optiton: data.opinionData.opinion } })
    emit('removeTab', tabName.value)
    emit('refreshList')
    ElNotification({
      title: '提示',
      message: t + '成功！',
      type: 'success'
    })
  })
}
const deleteClick = async () => {
  ElMessageBox.confirm('确认是否删除? ', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await requestClient.get(import.meta.env.VITE_BASIC + '/filesWorksheet/deleteOrder', { params: { id: orderId.value } })
    emit('removeTab', tabName.value)
    emit('refreshList')
    ElNotification({
      title: '提示',
      message: '删除成功！',
      type: 'success'
    })
  })
}
defineExpose({ data })
</script>
<style scoped>
/* 滚动条样式 **/
div::-webkit-scrollbar {
  width: 3px;
}

div::-webkit-scrollbar-track {
  border-radius: 4px;
}

div::-webkit-scrollbar-thumb {
  border-radius: 10px;
}

.part-b {
  border-top: 1px solid #c4dbf5;
}

.delcss {
  color: red;
  cursor: pointer;
}

.delcss:hover {
  text-decoration: underline;
}

.main-d {
  width: 100%;
  height: 100%;
  font-size: 12px;
}

.head-d {
  width: 1050px;
  height: 31px;
  padding-top: 5px;
  margin: auto;
}

.body-d {
  width: 100%;
  height: calc(100% - 40px);
  padding-top: 4px;
  overflow: auto;
}

.body-c {
  width: 1050px;
  height: calc(100% - 10px);
  margin: auto;
}

.primary {
  color: hsl(var(--primary));
}

.cmd-table tr td {
  height: 35px;
  text-align: center;
  border: 1px solid rgb(200 203 206 / 40%);
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
  width: 100% !important;
  margin-right: 0 !important;
  margin-bottom: 15px !important;
}

.required::before {
  margin-right: 1px;
  color: red;
  content: '*';
}

.dianji {
  font-weight: normal;
  cursor: pointer;
}

.dianji:hover {
  text-decoration: underline;
}

.mnjkg {
  width: 4px;
  height: 13px;
  background: #4266ff;
  border-radius: 4px;
  box-shadow: 3px 2px 1px #b2c2ff;
}

:deep(.el-form-item__label) {
  align-items: center;
  line-height: normal;
  text-align: right;
}

:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-collapse-item__header) {
  height: 35px;
  padding-left: 8px;
  background: #d9e9fc;
}
</style>
