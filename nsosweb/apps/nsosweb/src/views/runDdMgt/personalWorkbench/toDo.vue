<template>
  <div class="w-full h-full">
    <el-tabs ref="myTab" v-model="data.tabIndex" @tab-remove="removeTab" type="card" class="w-full h-full bg-white demo-tabs">
      <el-tab-pane label="指令待签收" name="todoList" :closable="false">
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><Position /></el-icon>
            <span>指令-待签收（{{ data.num1 }}）</span>
          </span>
        </template>
        <CmdTodoList ref="cmdListRef1" :queryState="'3'" @refreshList="refreshList" @updateTatol="updateTatol"></CmdTodoList>
      </el-tab-pane>
      <el-tab-pane label="指令待复令" name="todoList1" :closable="false">
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><ChatLineSquare /></el-icon>
            <span>指令-待复令（{{ data.num2 }}）</span>
          </span>
        </template>
        <CmdTodoList ref="cmdListRef2" :queryState="'4'" @refreshList="refreshList" @updateTatol="updateTatol"></CmdTodoList>
      </el-tab-pane>
      <el-tab-pane label="复盘简报" name="todoList2" :closable="false">
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><Tickets /></el-icon>
            <span>复盘简报（{{ data.num3 }}）</span>
          </span>
        </template>
        <ReviewBriefing @updateTatol="updateTatol1"></ReviewBriefing>
      </el-tab-pane>
      <el-tab-pane label="复盘报告" name="todoList3" :closable="false">
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><DataAnalysis /></el-icon>
            <span>复盘报告（{{ data.num4 }}）</span>
          </span>
        </template>
        <ReviewReport ref="todoList3" @updateTatol="updateTatol2"></ReviewReport>
      </el-tab-pane>
      <el-tab-pane label="复盘整改" name="todoList4" :closable="false">
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><FirstAidKit /></el-icon>
            <span>复盘整改（{{ data.num5 }}）</span>
          </span>
        </template>
        <ReviewCorrection ref="todoList4" @updateTatol="updateTatol3"></ReviewCorrection>
      </el-tab-pane>
      <el-tab-pane label="值班任务填报" name="todoList5" :closable="false">
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><Notebook /></el-icon>
            <span>值班任务填报（{{ data.num6 }}）</span>
          </span>
        </template>
        <!-- <DutyTaskFilling @updateTatol="updateTatol4"></DutyTaskFilling> -->
        <DutyTaskDTB ref="todoList5" @updateTatol="updateTatol4" />
      </el-tab-pane>
      <el-tab-pane label="通知/催办信息" name="todoList6" :closable="false">
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><Notebook /></el-icon>
            <span>通知/催办信息（{{ data.num7 }}）</span>
          </span>
        </template>
        <NotifyRecord ref="todoList6" @updateTatol="updateTatol5"></NotifyRecord>
      </el-tab-pane>
    </el-tabs>
    <el-tooltip content="点击立即刷新所有待办" placement="bottom">
      <div class="timeer" @click="timingClick">刷新（{{ timing }}）</div>
    </el-tooltip>
  </div>
</template>
<script setup>
import { Page } from '@vben/common-ui'
import { onMounted, reactive, ref } from 'vue'
import { ElTabs, ElTabPane } from 'element-plus'
import CmdTodoList from '../cmdMgt/cmdTodoList.vue'
import CmdDoneList from '../cmdMgt/cmdDoneList.vue'
import ReviewBriefing from './reviewBriefing.vue'
import ReviewReport from './reviewReport.vue'
import ReviewCorrection from './reviewCorrection.vue'
import DutyTaskFilling from './dutyTaskFilling.vue'
import NotifyRecord from './notifyRecord.vue'
import { Tickets, Position, ChatLineSquare, CircleCheck, Delete, DocumentChecked, Reading, DataAnalysis, FirstAidKit, Notebook } from '@element-plus/icons-vue'
import DutyTaskDTB from '/src/views/runDdMgt/dutyTaskFill/dutyTask-DTB.vue'

const data = reactive({
  tabIndex: 'todoList',
  tabArr: [],
  num1: 0,
  num2: 0,
  num3: 0,
  num4: 0,
  num5: 0,
  num6: 0,
  num7: 0
})
const cmdListRef1 = ref()
const cmdListRef2 = ref()
const todoList3 = ref()
const todoList4 = ref()
const todoList5 = ref()
const todoList6 = ref()
const timing = ref(60)
const emit = defineEmits(['updateTitle'])
onMounted(async () => {
  queryCount()
  setInterval(setTime, 1000)
})

const refreshList = (showmask) => {
  cmdListRef1.value.query(showmask)
  cmdListRef2.value.query(showmask)
}
const updateTatol = (type, val) => {
  //eval('data.num'+type+' = ' + val)
  if (type === '3') {
    eval('data.num' + '1' + ' = ' + val)
  }
  if (type === '4') {
    eval('data.num' + '2' + ' = ' + val)
  }
  const count = data.num1 + data.num2 + data.num3 + data.num4 + data.num5 + data.num6 + data.num7
  emit('updateTitle', count)
}
const updateTatol1 = (val) => {
  data.num3 = val
  const count = data.num1 + data.num2 + data.num3 + data.num4 + data.num5 + data.num6 + data.num7
  emit('updateTitle', count)
}
const updateTatol2 = (val) => {
  data.num4 = val
  const count = data.num1 + data.num2 + data.num3 + data.num4 + data.num5 + data.num6 + data.num7
  emit('updateTitle', count)
}
const updateTatol3 = (val) => {
  data.num5 = val
  const count = data.num1 + data.num2 + data.num3 + data.num4 + data.num5 + data.num6 + data.num7
  emit('updateTitle', count)
}
const updateTatol4 = (t, val) => {
  data.num6 = val
  const count = data.num1 + data.num2 + data.num3 + data.num4 + data.num5 + data.num6 + data.num7
  emit('updateTitle', count)
}
const updateTatol5 = (val) => {
  data.num7 = val
  const count = data.num1 + data.num2 + data.num3 + data.num4 + data.num5 + data.num6 + data.num7
  emit('updateTitle', count)
}

const queryCount = async () => {
  const count = data.num1 + data.num2 + data.num3 + data.num4 + data.num5 + data.num6 + data.num7
  emit('updateTitle', count)
}
function setTime() {
  if (timing.value == 0) {
    timing.value = 60
    refreshData()
  } else {
    timing.value--
  }
}
function timingClick() {
  timing.value = 60
  refreshData()
}
const refreshData = () => {
  if(cmdListRef1.value) cmdListRef1.value.query(true)
  if(cmdListRef2.value) cmdListRef2.value.query(true)
  if(todoList3.value) todoList3.value.query(true)
  if(todoList4.value) todoList4.value.query(true)
  if(todoList5.value) todoList5.value.query(true)
  if(todoList6.value) todoList6.value.query(true)
}
</script>
<style scoped>
:deep(.el-tab-pane) {
  width: 100%;
  height: 100%;
}

:deep(.el-tabs__header) {
  margin-bottom: 4px;
}

.demo-tabs > .el-tabs__content {
  padding: 32px;
  font-size: 32px;
  font-weight: 600;
  color: #6b778c;
}

.demo-tabs .custom-tabs-label .el-icon {
  vertical-align: middle;
}

.demo-tabs .custom-tabs-label span {
  margin-left: 4px;
  vertical-align: middle;
}

.timeer {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 72px;
  font-size: 14px;
  color: red;
  cursor: pointer;
}
</style>
