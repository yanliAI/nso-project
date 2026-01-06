<template>
    <el-tabs ref="myTab" v-model="data.tabIndex" @tab-remove="removeTab" type="card" class="w-full h-full bg-white demo-tabs">
      <el-tab-pane label="已复令" name="todoList" :closable="false">
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><Reading /></el-icon>
            <span>指令（{{data.num3}}）</span>
          </span>
        </template>
        <CmdDoneList ref="cmdListRef3" @updateTatol="updateTatol" ></CmdDoneList>
      </el-tab-pane>
      <el-tab-pane label="复盘简报" name="todoList2" :closable="false">
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><Tickets /></el-icon>
            <span>复盘简报（{{data.num4}}）</span>
          </span>
        </template>
        <ReviewBriefingDone @updateTatol="updateTatol1"></ReviewBriefingDone>
      </el-tab-pane>
      <el-tab-pane label="复盘报告" name="todoList3" :closable="false">
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><DataAnalysis /></el-icon>
            <span>复盘报告（{{data.num5}}）</span>
          </span>
        </template>
        <ReviewReportDone @updateTatol="updateTatol2"></ReviewReportDone>
      </el-tab-pane>
      <el-tab-pane label="复盘整改" name="todoList4" :closable="false">
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><FirstAidKit /></el-icon>
            <span>复盘整改（{{data.num6}}）</span>
          </span>
        </template>
        <ReviewCorrectionDone @updateTatol="updateTatol3"></ReviewCorrectionDone>
      </el-tab-pane>
      <el-tab-pane label="值班任务填报" name="todoList5" :closable="false">
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><Notebook /></el-icon>
            <span>值班任务填报（{{data.num7}}）</span>
          </span>
        </template>
        <!-- <DutyTaskFillingDone @updateTatol="updateTatol4"></DutyTaskFillingDone> -->
        <DutyTaskYSB @updateTatol="updateTatol4"/>
      </el-tab-pane>
      <el-tab-pane label="通知/催办信息" name="todoList6" :closable="false">
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><Notebook /></el-icon>
            <span>通知/催办信息{{data.num8}}）</span>
          </span>
        </template>
        <NotifyRecordDone @updateTatol="updateTatol5"></NotifyRecordDone>
      </el-tab-pane>
    </el-tabs>
</template>
<script setup>
import { Page } from '@vben/common-ui';
import { onMounted, reactive, ref } from 'vue';
import { ElTabs, ElTabPane} from 'element-plus';
import CmdTodoList from '../cmdMgt/cmdTodoList.vue'
import CmdDoneList from '../cmdMgt/cmdDoneList.vue'
import ReviewBriefingDone from './reviewBriefingDone.vue'
import ReviewReportDone from './reviewReportDone.vue'
import ReviewCorrectionDone from './reviewCorrectionDone.vue'
import DutyTaskFillingDone from './dutyTaskFillingDone.vue'
import NotifyRecordDone from './notifyRecordDone.vue'
import { Tickets, Position, ChatLineSquare, CircleCheck, Delete, DocumentChecked, Reading,DataAnalysis,FirstAidKit,Notebook } from '@element-plus/icons-vue';
import DutyTaskYSB from '/src/views/runDdMgt/dutyTaskFill/dutyTask-YSB.vue'

const data = reactive({
  tabIndex: 'todoList',
  tabArr: [],
  num3: 0,
  num4: 0,
  num5: 0,
  num6: 0,
  num7: 0,
  num8: 0,
})
const cmdListRef3 = ref()

const emit = defineEmits(['updateTitle'])
onMounted(async () => {
  queryCount();
});

const refreshList = (showmask) => {
  cmdListRef3.value.query(showmask)
}
const updateTatol = (type, val) => {
  //eval('data.num'+type+' = ' + val)
  if(type === '5'){
    eval('data.num'+'3'+' = ' + val)
  }
  const count =  data.num3 + data.num4 + data.num5 + data.num6 + data.num7 + data.num8;
  emit('updateTitle', count)
}
const updateTatol1 = (val) => {
  data.num4 = val;
  const count =  data.num3 + data.num4 + data.num5 + data.num6 + data.num7 + data.num8;
  emit('updateTitle', count)
}
const updateTatol2 = (val) => {
  data.num5 = val;
  const count =  data.num3 + data.num4 + data.num5 + data.num6 + data.num7 + data.num8;
  emit('updateTitle', count)
}
const updateTatol3 = (val) => {
  data.num6 = val;
  const count =  data.num3 + data.num4 + data.num5 + data.num6 + data.num7 + data.num8;
  emit('updateTitle', count)
}
const updateTatol4 = (t, val) => {
  data.num7 = val;
  const count =  data.num3 + data.num4 + data.num5 + data.num6 + data.num7 + data.num8;
  emit('updateTitle', count)
}
const updateTatol5 = (val) => {
  data.num8 = val;
  const count =  data.num3 + data.num4 + data.num5 + data.num6 + data.num7 + data.num8;
  emit('updateTitle', count)
}

const queryCount = async () => {
  const count =  data.num3 + data.num4 + data.num5 + data.num6 + data.num7 + data.num8;
  emit('updateTitle', count)
}
</script>
<style scoped>
:deep(.el-tab-pane) {
  width: 100%;
  height: 100%;
}

:deep(.el-tabs__header){
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
</style>
