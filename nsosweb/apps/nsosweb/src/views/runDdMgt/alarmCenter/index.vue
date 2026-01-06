<template>
  <Page auto-content-height>
    <el-tabs v-model="activeName" @tab-click="query(activeName)">
      <el-tab-pane label="实时告警" name="securityAlarm">
        <SecurityAlarm ref="DTBRef"/>
      </el-tab-pane>
      <el-tab-pane label="已处置告警" name="alarmAnalysis">
        <DoneSecurityAlarm ref="DSHRef"/>
      </el-tab-pane>
    </el-tabs>
  </Page>
</template>
<script setup>
import { ref, reactive } from 'vue';
import { ElTabs, ElTabPane } from 'element-plus';
import { Page } from '@vben/common-ui';
import SecurityAlarm from './securityAlarm.vue'
import DoneSecurityAlarm from './doneSecurityAlarm.vue'
const activeName = ref('securityAlarm');
const data = reactive({
  tabName: null,
})

const DTBRef = ref()
const DSHRef = ref()

function query(activeName) {
  if (activeName === 'securityAlarm') {
    if (DTBRef.value) {
      DTBRef.value.query()
      DSHRef.value.query()
    }
    DTBRef.value.data.moreVisible = false
  } else if (activeName === 'alarmAnalysis') {
    if (DSHRef.value) {
      DSHRef.value.query()
      DTBRef.value.query()
    }
  }
}

</script>
<style scoped>
:deep(.el-tabs){
  width: 100%;
  height: 100%;
}

:deep(.el-tab-pane) {
  width: 100%;
  height: 100%;
}

:deep(.el-tabs__header) {
  margin: 0 0 5px;
}

:deep(.el-tabs__nav-scroll) {
    padding: 10px 0;
    background-color: #fff;
}

:deep(.el-tabs__nav) {
  margin: 0 10px;
}

:deep(.el-tabs--top .el-tabs__item.is-top:nth-child(2)) {
  padding-left: 20px;
}

:deep(.el-tabs--top .el-tabs__item.is-top:last-child) {
  padding-right: 20px;
}

/* 基础样式 */
:deep(.el-tabs__item) {
  color: #666;
  background-color: #f0f2f6;
  border-radius: 10px;
  transform: scale(0.95);
}

/* 悬浮样式 */
:deep(.el-tabs__item:hover) {
  color: #3e7eff !important;
}

/* 选中样式 */
:deep(.el-tabs__item.is-active) {
  font-weight: bold;
  color: #fff !important;
  background-color: #3e7eff;
  border-radius: 8px;
}

/* 隐藏tab下面的一横 */
:deep(.el-tabs__active-bar) {
  display: none;
}
</style>
