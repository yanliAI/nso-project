<template>
  <Page auto-content-height>
    <el-tabs ref="myTab" v-model="data.tabIndex" @tab-remove="removeTab" type="card" class="w-full h-full bg-white demo-tabs">
      <el-tab-pane label="待签收" name="todoList" :closable="false">
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><Position /></el-icon>
            <span>待签收（{{ data.num3 }}）</span>
          </span>
        </template>
        <CmdTodoList ref="cmdListRef1" :queryState="'3'" @refreshList="refreshList" @updateTatol="updateTatol"></CmdTodoList>
      </el-tab-pane>
      <el-tab-pane label="待复令" name="todoList1" :closable="false">
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><ChatLineSquare /></el-icon>
            <span>待复令（{{ data.num4 }}）</span>
          </span>
        </template>
        <CmdTodoList ref="cmdListRef2" :queryState="'4'" @refreshList="refreshList" @updateTatol="updateTatol"></CmdTodoList>
      </el-tab-pane>
      <el-tab-pane label="已办任务" name="todoList3" :closable="false">
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><Reading /></el-icon>
            <span>已办任务（{{ data.num5 }}）</span>
          </span>
        </template>
        <CmdDoneList ref="cmdListRef3" @refreshList="refreshList" @updateTatol="updateTatol"></CmdDoneList>
      </el-tab-pane>
    </el-tabs>
    <el-tooltip content="点击立即刷新所有待办" placement="bottom">
      <div class="timeer" @click="timingClick">刷新（{{ timing }}）</div>
    </el-tooltip>
  </Page>
</template>
<script setup>
import { Page } from '@vben/common-ui'
import { onMounted, reactive, ref } from 'vue'
import { ElTabs, ElTabPane } from 'element-plus'
import CmdTodoList from './cmdTodoList.vue'
import CmdDoneList from './cmdDoneList.vue'
import { Tickets, Position, ChatLineSquare, CircleCheck, Delete, DocumentChecked, Reading } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'

const data = reactive({
  tabIndex: 'todoList',
  tabArr: [],
  num3: 0,
  num4: 0,
  num5: 0
})
const cmdListRef1 = ref()
const cmdListRef2 = ref()
const cmdListRef3 = ref()
const timing = ref(60)
function setTime() {
  if (timing.value == 0) {
    timing.value = 60
    cmdListRef1.value.query()
    cmdListRef2.value.query()
    cmdListRef3.value.query()
  } else {
    timing.value--
  }
}
function timingClick() {
  timing.value = 60
  refreshList()
}
const refreshList = (showmask) => {
  cmdListRef1.value.query(showmask)
  cmdListRef2.value.query(showmask)
  cmdListRef3.value.query(showmask)
}
const updateTatol = (type, val) => {
  eval('data.num' + type + ' = ' + val)
}

// 接收运调工作台跳转参数
const route = useRoute()
const workbenchData = ref(route.query)

onMounted(() => {
  if (route.query.id) {
    const ref = route.query.commandStatus === '1' ? cmdListRef1 : cmdListRef2
    data.tabIndex = route.query.commandStatus === '1' ? 'todoList' : 'todoList1'
    ref.value.showDetailForWorkbench(route.query)
  }
  setInterval(setTime, 1000)
})
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
  top: 14px;
  right: 10px;
  width: 72px;
  font-size: 14px;
  color: red;
  cursor: pointer;
}
</style>
