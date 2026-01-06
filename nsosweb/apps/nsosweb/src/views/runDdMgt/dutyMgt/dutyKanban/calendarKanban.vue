<template>
  <div class="w-full h-full bg-white">
    <div class="jsoidg flex" v-show="data.hasTodo">
      <div class="m-auto flex items-center ">
        <div class="ljsod blinking-text"></div>
        <span class="ml-[3px] text-[#d81e06] blinking-text">您有换班申请待处理！</span>
        <span class="primary text-[12px] cursor-pointer hover:underline mt-[4px]" @click="emit('transToList')">点击跳转>></span>
      </div>
    </div>
    <div>
      <el-calendar v-model="calendarvValue">
        <template #date-cell="{ data }">
          <p :class="data.isSelected ? 'is-selected' : ''">
            {{ data.day.split('-')[2] }}
          </p>
          <div class="overflow-y-auto text-[12px]" v-for="(item, index) in curDayData(data.day)" :key="'myt' + index" style="height: calc(100% - 18.36px)">
            <div :class="exceedToDay(data.day) ? 'lijgz' : 'lijgv'" class="flex items-center" @click.stop="editPbClick(item)">
              <div :class="exceedToDay(data.day) ? 'mnjkg' : 'mnjkh'" class=" mt-[0px] mr-[2px]"></div>
              <div class="ml-[3px] mhisf hover:underline">{{ dropList.NSOS_PB_SHIFT.filter((d) => d.value == item.dutyShift)[0]?.label }} - {{ dropList.NSOS_PB_POST.filter((d) => d.value == item.postType)[0]?.label }}（{{ item.dutyName }}）</div>
            </div>
            <div v-if="swData[data.day]" class="flex items-center py-[3px]">
              <div class="huan">换</div>
              <span class="ushdis" @click="emit('transToList', swData[data.day].swapCode)">{{swData[data.day].swapCode}}（待处理）</span>
            </div>
          </div>
        </template>
      </el-calendar>
    </div>
    <Modal class="w-[450px] h-[305px] top-[25vh]" title="排班信息" :footer="false" :closeOnClickModal="false" :draggable="true" headerClass="head-md">
      <el-form label-width="100px" ref="ruleFormRef" :model="data.curPb" :inline="true" label-position="right" class="demo-form-inline mt-1">
        <el-row>
          <el-col :span="24">
            <el-form-item label="值班日期:">
              <el-date-picker v-model="data.curPb.dutyRiqi" value-format="YYYY-MM-DD" type="date" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="值班班次:">
              <el-select v-model="data.curPb.dutyShift" disabled clearable>
                <el-option v-for="item in dropList.NSOS_PB_SHIFT" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="值班岗位:">
              <el-select v-model="data.curPb.postType" disabled clearable>
                <el-option v-for="item in dropList.NSOS_PB_POST" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="值班人员:">
              <el-input v-model="data.curPb.dutyName" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="text-center pt-[10px] pb-[15px]">
        <el-button type="primary" class="ml-4" v-if="exceedToDay(data.curPb.dutyRiqi)" :icon="Tickets" @click="changeBanClick">换班</el-button>
        <el-button type="info" class="ml-4" :icon="Close" @click="modalApi.close()">关闭</el-button>
      </div>
    </Modal>
    <ModalA class="w-[900px] h-[550px] top-[17vh]" :title="data.changeTitle" :footer="false" :closeOnClickModal="false" :draggable="true" headerClass="head-md">
      <ChangeBan :dutyData="data.curPb" @close="modalApiA.close()" @afterSubmit="query"></ChangeBan>
    </ModalA>
  </div>
</template>
<script setup>
import { Page } from '@vben/common-ui'
import { onMounted, reactive, ref, watch } from 'vue'
import { ElForm, ElCol, ElRow, ElCalendar, ElMessage, ElMessageBox, ElNotification, ElTabs, ElTabPane } from 'element-plus'
import { Search, Plus, DArrowRight, Tickets, Close } from '@element-plus/icons-vue'
import { useDropStore } from '#/store'
import { requestClient } from '#/api/request'
import { formatDate, formatDateTime, formatDateZw } from '#/utils/commonUtil.ts'
import { useVbenModal } from '@vben/common-ui'
import ChangeBan from './changeBan.vue'

const dropList = reactive({})
const emit = defineEmits(['transToList'])
const data = reactive({
  curPb: {},
  formData: {},
  caData: [],
  changeTitle: '',
  hasTodo: false,
})
const swData = ref({})
const calendarvValue = ref()
const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close()
  }
})
const [ModalA, modalApiA] = useVbenModal({
  onCancel() {
    modalApi.close()
  }
})
watch(calendarvValue, async (newVal,oldVal) => {
  if (newVal && oldVal) {
    if(formatDate(newVal).substring(0,7) == formatDate(oldVal).substring(0,7)){
      return
    }
  }
  query()
})

onMounted(async () => {
  const dropStore = useDropStore()
  let dropType = ['NSOS_PB_POST', 'NSOS_PB_SHIFT']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)

  setInterval(() => {
    queryTodo()
  }, 15 * 1000);
  queryTodo()
  initQuery()
})
const query = async () => {
  const {caData, serverTime, swDataMap} = await requestClient.get(import.meta.env.VITE_NSOSGZ + '/workforceManager/queryKanban', { params: { curTime: formatDateTime(calendarvValue.value) } })
  data.caData = caData
  data.serverTime = serverTime
  if (swData) swData.value = swDataMap
}
const initQuery = async () => {
  const { caData, serverTime, swDataMap } = await requestClient.get(import.meta.env.VITE_NSOSGZ + '/workforceManager/queryKanban')
  data.caData = caData
  data.serverTime = serverTime
  if (swData) swData.value = swDataMap
  calendarvValue.value = new Date(serverTime)
}
const queryTodo = async () => {
  const todoList = await requestClient.get(import.meta.env.VITE_NSOSGZ + '/swapRequests/queryTodo', {showmask: false})
  if (todoList && todoList.length > 0) {
    data.hasTodo = true
  } else {
    data.hasTodo = false
  }
}
const curDayData = (dstr) => {
  return data.caData.filter((d) => dstr == formatDate(d.dutyRiqi))
}
const exceedToDay = (day) => {
  return new Date(day + ' 23:59:59').getTime() > data.serverTime + 24 * 60 * 60 * 1000
}
const editPbClick = (item) => {
  data.curPb = item
  data.curPb.dutyRiqi = formatDate(data.curPb.dutyRiqi)
  modalApi.open()
}
const changeBanClick = () => {
  data.changeTitle = data.curPb.dutyRiqi + ' 选择换班人员'
  modalApi.close()
  modalApiA.open()
}
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

:deep(.el-calendar-table .el-calendar-day) {
  --el-calendar-cell-width: 140px;

  height: 110px;
}

:deep(.el-calendar-table thead th) {
  background: #d9e9fc;
}

.expand {
  max-height: 0; /* 你可以根据需要调整这个值 */
  overflow: hidden;
  transition: max-height 0.5s ease-out;
}

.expand.v-enter-active,
.expand.v-leave-active {
  transition: max-height 0.5s ease-out;
}

.primary {
  color: hsl(var(--primary));
}

.expand.v-enter,
.expand.v-leave-to {
  max-height: 0;
}

.lijgz {
  height: 35px;
  padding-left: 10px;
  font-size: 14px;
  font-weight: bold;
  line-height: 35px;
  color: #4266ff;
  background: #d9e9fc;
  border-radius: 4px;
}

.lijgv {
  height: 35px;
  padding-left: 10px;
  font-size: 14px;
  font-weight: bold;
  line-height: 35px;
  color: #727375;
  background: #eeeef0;
  border-radius: 4px;
}

.mhisf{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mnjkg{
  width: 4px;
  height: 13px;
  background: #4266ff;
  border-radius: 4px;
  box-shadow: 3px 2px 1px #b2c2ff;
}

.mnjkh{
  width: 4px;
  height: 13px;
  background: #727375;
  border-radius: 4px;
  box-shadow: 3px 2px 1px #c3c3c5;
}

.jsoidg{
  position: absolute;
  top: 10px;
  width: 100%;
}

.ljsod{
  width: 22px;
  height: 22px;
  background-image: url('/images/basic/laba.png');
  background-size: 100% 100%;
}

@keyframes blink {
  0% { opacity: 1; }

  50% { opacity: 0.5; }

  100% { opacity: 1; }
}

.blinking-text {
  animation: blink 1.2s infinite;
}

.huan{
  width: 20px;
  height: 20px;
  line-height: 18px;
  color: #fff;
  text-align: center;
  background-color: red;
  border-radius: 26px;
}

.ushdis{
  padding-left: 3px;
  color: red;
  text-decoration: underline;
}
</style>
