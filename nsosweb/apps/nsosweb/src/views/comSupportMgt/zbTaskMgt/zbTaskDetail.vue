<template>
  <div class="main-d">
    <div class="gbzjd">
      <el-anchor class="jknb" :offset="90" type="default" :container="containerRef" direction="vertical" @click="handleClick">
        <el-anchor-link href="#part1" title="基础信息"></el-anchor-link>
        <el-anchor-link href="#part2" title="保障系统"></el-anchor-link>
        <el-anchor-link href="#part3" title="关联支撑系统"></el-anchor-link>
      </el-anchor>
    </div>
    <div class="w-full h-full">
      <div class="head-d">
        <div class="flex items-center h-6">
          <div class="w-[493px] font-bold text-lg">保障任务工单</div>
          <div class="flex items-center cursor-pointer primary delcss"></div>
          <div class="flex-1 text-right pr-2">
            <el-button type="primary" :icon="Tickets" v-if="data.orderData && data.orderData.guaranteeStatus == '1'" @click="saveClick" size="small">保存</el-button>
            <el-button type="primary" :icon="Promotion" v-if="data.orderData && data.orderData.id && data.orderData.guaranteeStatus == '1'" @click="sendClick('2', '提交')" size="small">提交</el-button>
            <el-button type="primary" :icon="Promotion" v-if="data.orderData && data.orderData.id && data.orderData.guaranteeStatus == '2'" @click="sendClick('3', '审核')" size="small">审核</el-button>
            <el-button type="primary" :icon="Promotion" v-if="data.orderData && data.orderData.id && data.orderData.guaranteeStatus == '3'" @click="sendClick('4', '发布')" size="small">发布</el-button>
            <el-button type="danger" :icon="Delete" v-if="data.orderData.id && data.orderData.guaranteeStatus == '1'" @click="deleteClick" size="small">删除</el-button>
          </div>
        </div>
      </div>
      <div class="body-d" ref="containerRef">
        <div class="body-c">
          <el-collapse v-model="activeNames">
            <el-collapse-item :icon="CaretRight" name="1">
              <template #title>
                <div class="flex items-center primary">
                  <div class="mnjkg mt-[-1px] mr-[2px]"></div>
                  <div class="ml-1 font-bold">基础信息</div>
                </div>
              </template>
              <div id="part1" class="part-b">
                <el-form label-width="110px" ref="ruleFormRef" :model="data.orderData" :rules="formRules" :disabled="data.disabled" :inline="true" label-position="right" class="demo-form-inline mt-2">
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="工单号:" prop="guaranteeNo">
                        <el-input v-model="data.orderData.guaranteeNo" clearable disabled />
                      </el-form-item>
                    </el-col>
                    <el-col :span="16">
                      <el-form-item label="保障任务名称:" prop="guaranteeTitle">
                        <el-input v-model="data.orderData.guaranteeTitle" clearable />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="保障开始时间:" prop="guaranteeStartTime">
                        <el-date-picker v-model="data.orderData.guaranteeStartTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" clearable />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="保障结束时间:" prop="guaranteeEndTime">
                        <el-date-picker v-model="data.orderData.guaranteeEndTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" clearable />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="实际结束时间:" prop="sjwcTime">
                        <el-date-picker v-model="data.orderData.sjwcTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" clearable />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="核心保障时段:" prop="coreTime">
                        <el-input v-model="data.orderData.coreTime" :rows="2" maxlength="500" show-word-limit type="textarea" clearable />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="备注:" prop="remark">
                        <el-input v-model="data.orderData.remark" :rows="2" maxlength="500" show-word-limit type="textarea" clearable />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="创建人:" prop="creatorName">
                        <el-input v-model="data.orderData.creatorName" clearable disabled />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="创建时间:" prop="createTime">
                        <el-date-picker v-model="data.orderData.createTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" disabled clearable />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
                <div class="mt-2">
                  <AttachFileA ref="attachListRef" :disabled="data.disabled" :parentId="data.orderData.id ? data.orderData.id : data.bakId" moduleId="ZB_TASK_FILE" :inAdvance="data.orderData.id ? false : true">
                    <template v-slot:title>
                      <span>保障任务附件：</span>
                    </template>
                  </AttachFileA>
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item :icon="CaretRight" name="2">
              <template #title>
                <div class="flex items-center primary">
                  <div class="mnjkg mt-[-1px] mr-[2px]"></div>
                  <div class="ml-1 font-bold">保障系统</div>
                </div>
              </template>
              <div id="part2" class="part-b">
                <BzSystem :disabled="data.disabled" :formData="data.orderData"></BzSystem>
              </div>
            </el-collapse-item>
            <el-collapse-item :icon="CaretRight" name="3">
              <template #title>
                <div class="flex items-center primary">
                  <div class="mnjkg mt-[-1px] mr-[2px]"></div>
                  <div class="ml-1 font-bold">关联支撑系统</div>
                </div>
              </template>
              <div id="part3" class="part-b">
                <div class="pt-[2px] pb-[6px]">
                  <RelaSystem :disabled="data.disabled" :formData="data.orderData"></RelaSystem>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref, watch, computed } from 'vue'
import { CaretRight, Expand, Tickets, HelpFilled, Operation, Finished, Download, Share, Promotion, Back, Checked, Comment, SuccessFilled, List, Delete, BottomRight, Check, Close, Plus, MuteNotification } from '@element-plus/icons-vue'
import { ElNotification, ElMessage, ElMessageBox, ElCollapse, ElCollapseItem, ElTable, ElTableColumn, ElCheckbox, ElAnchor, ElAnchorLink } from 'element-plus'
import { formatDateTime, lookFlow, tDateTimeFormat, formatDateZw, numberToChinese, formatToken, formatDrop } from '#/utils/commonUtil.ts'
import { useDropStore } from '#/store'
import { useUserStore } from '@vben/stores'
import { useVbenModal } from '@vben/common-ui'
import { requestClient } from '#/api/request'
import AttachFileA from '#/views/basic/attach/attachFileA.vue'
import BzSystem from './bzSystem.vue'
import RelaSystem from './relaSystem.vue'

const dropList = reactive({})
const orderId = defineModel('orderId')
const tabName = defineModel('tabName')
const containerRef = ref()
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
  disabled: false,
  bakId: null,
})
const orderType = [
  { label: '台账异常', value: '1' },
  { label: '资产变更', value: '2' }
]
const formData = reactive({})
const opinionFormRef = ref()

const formRules = reactive({
  coreTime: [
    { required: true, message: '请输入核心保障时段', trigger: 'blur' },
    { min: 0, max: 500, message: '内容长度最大不能超过500', trigger: 'blur' }
  ],
  guaranteeTitle: [
    { required: true, message: '请输入保障任务名称', trigger: 'blur' },
    { min: 0, max: 500, message: '内容长度最大不能超过500', trigger: 'blur' }
  ],
  guaranteeEndTime: [{ required: true, message: '请选择保障结束时间', trigger: 'change' }],
  guaranteeStartTime: [{ required: true, message: '请选择保障开始时间', trigger: 'change' }]
})
onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = ['NSOS_USER_NAME']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)
  const { orderData, bakId } = await requestClient.get(import.meta.env.VITE_NSOSGZ + '/applyInfo/initData', { params: { id: orderId.value } })
  data.orderData = orderData
  data.bakId = bakId
  if (data.orderData.id && data.orderData.guaranteeStatus > 1) {
    data.disabled = true
  }
  formatEntity()
})
const formatEntity = () => {
  data.orderData.guaranteeStartTime = formatDateTime(data.orderData.guaranteeStartTime)
  data.orderData.guaranteeEndTime = formatDateTime(data.orderData.guaranteeEndTime)
  data.orderData.sjwcTime = formatDateTime(data.orderData.sjwcTime)
  data.orderData.createTime = formatDateTime(data.orderData.createTime)
}
const saveClick = async () => {
  try {
    data.orderData = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/applyInfo/saveZbTask', data.orderData ,{ params: { bakId: data.bakId } })
    ElNotification({
      title: '提示',
      message: '保存成功！',
      type: 'success'
    })
  } catch (error) {
    ElMessage.error('保存失败！')
    return
  }
  formatEntity()
  emit('refreshList')
  emit('afterAdd', data.orderData)
}
const sendClick = async (nextStatus, type) => {
  ElMessageBox.confirm('确认是否' + type + '? ', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    data.orderData = await requestClient.get(import.meta.env.VITE_NSOSGZ + '/applyInfo/updateStatus', { params: { id: data.orderData.id, nextStatus: nextStatus } })
    formatEntity()
    emit('removeTab', tabName.value)
    emit('refreshList')
    ElNotification({
      title: '提示',
      message: '' + type + '成功！',
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
    await requestClient.post(import.meta.env.VITE_NSOSGZ + '/applyInfo/deleteDataByVo', data.orderData)
    emit('removeTab', tabName.value)
    emit('refreshList')
    ElNotification({
      title: '提示',
      message: '删除成功！',
      type: 'success'
    })
  })
}
const handleClick = (e) => {
  e.preventDefault()
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

.gbzjd {
  position: absolute;
  top: 0;
  left: 0;
  width: 20%;
}

.jknb {
  width: 60%;
  margin: auto;
  margin-top: 100px;
}
</style>
