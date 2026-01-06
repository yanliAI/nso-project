<template>
  <div class="main-bd">
    <el-tabs v-model="activeName">
      <el-tab-pane label="告警任务" name="gj">
        <DutyLogGj />
      </el-tab-pane>
      <el-tab-pane label="故障任务" name="gz">
        <DutyLogGz />
      </el-tab-pane>
      <el-tab-pane label="漏洞任务" name="ld">
        <DutyLogLd />
      </el-tab-pane>
      <el-tab-pane label="指令任务" name="zl">
        <DutyLogZl />
      </el-tab-pane>
      <el-tab-pane label="通知任务" name="tz">
        <DutyLogTz />
      </el-tab-pane>
      <el-tab-pane label="作业任务" name="zy">
        <DutyLogZy />
      </el-tab-pane>
      <el-tab-pane label="重保任务" name="zb">
        <DutyLogZb />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { ElTabs, ElTabPane } from 'element-plus';
import { Page } from '@vben/common-ui';
import DutyLogGj from './dutyLog-gj.vue'
import DutyLogGz from './dutyLog-gz.vue'
import DutyLogLd from './dutyLog-ld.vue'
import DutyLogZl from './dutyLog-zl.vue'
import DutyLogTz from './dutyLog-tz.vue'
import DutyLogZy from './dutyLog-zy.vue'
import DutyLogZb from './dutyLog-zb.vue' 
const activeName = ref('gj');
</script>
<style scoped>
.main-bd {
  width: 100%;
  height: 100%;
}

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
  background-color: #fff;
  padding: 10px 0;
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

/*基础样式*/
:deep(.el-tabs__item) {
  color: #666666;
  background-color: #f0f2f6;
  border-radius: 10px;
  transform: scale(0.95);
}
/*悬浮样式*/
:deep(.el-tabs__item:hover) {
  color: #3e7eff !important;
}
/*选中样式*/
:deep(.el-tabs__item.is-active) {
  color: #fff !important;
  font-weight: bold;
  background-color: #3e7eff;
  border-radius: 8px;
}
/*隐藏tab下面的一横*/
:deep(.el-tabs__active-bar) {
  display: none;
}
</style>
