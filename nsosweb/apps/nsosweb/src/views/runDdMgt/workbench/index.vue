<template>
  <Page auto-content-height class="workbench-bg">
    <div class="mian-up">
      <TodayTask v-if="role === 'YDZZ'" @statsQuery="statsQuery" @changeTab="changeTab" :deptCode="deptCode" :deptRight="deptRight"></TodayTask>
      <TodayTaskForAq v-else-if="role === 'AQ'" @statsQuery="statsQuery" @changeTab="changeTab" :deptCode="deptCode" :deptRight="deptRight"></TodayTaskForAq>
      <TodayTaskForYx v-else-if="role === 'YX'" @statsQuery="statsQuery" @changeTab="changeTab" :deptCode="deptCode" :deptRight="deptRight"></TodayTaskForYx>
    </div>
    <div class="mian-down">
      <TaskCenter ref="taskCenterRef" :role="role" :deptCode="deptCode" :statsParams="data.statsParams"></TaskCenter>
    </div>
  </Page>
</template>
<script setup>
import { Page } from '@vben/common-ui';
import { ref, onMounted, reactive } from 'vue';
import TodayTask from './todayTask.vue';
import TodayTaskForAq from './todayTaskForAq.vue';
import TodayTaskForYx from './todayTaskForYx.vue';
import TaskCenter from './taskCenter.vue';
import { getRole } from './workbenchMethod.ts'
const taskCenterRef = ref()
const statsQuery = (params) => {
  data.statsParams = params
  taskCenterRef.value.statsQuery(params);
}
const changeTab = (type) => {
  taskCenterRef.value.changeTab(type);
}
const role = ref('')
const deptCode = ref('')
const deptRight = ref(false)
const data = reactive({
  statsParams: {},
});
onMounted(async () => {
  const { tRole, tDeptCode, tDeptRight } = await getRole()
  role.value = tRole
  deptCode.value = tDeptCode
  deptRight.value = tDeptRight
});
</script>
<style scoped>
.main-body {
  width: 100%;
  height: 100%;
}

.mian-up {
  width: 100%;
  height: 280px;
}

.mian-down {
  width: 100%;
  height: calc(100% - 280px);
}

.workbench-bg {
  /* background: url("/images/ydgzt/bg-full.png") no-repeat; */
  /* background-size: 100% 102%; */
}
</style>
