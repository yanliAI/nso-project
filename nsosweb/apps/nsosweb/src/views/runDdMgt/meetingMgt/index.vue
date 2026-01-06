<template>
  <Page auto-content-height>
    <el-tabs v-model="activeName">
      <el-tab-pane label="发起会议" name="meetingCreate">
        <MeetingCreate />
      </el-tab-pane>
      <el-tab-pane label="会议记录" name="meetingRecord">
        <MeetingRecord />
      </el-tab-pane>
    </el-tabs>
  </Page>
</template>
<script setup>
import { ref } from 'vue';
import { ElTabs, ElTabPane } from 'element-plus';
import { Page } from '@vben/common-ui';
import MeetingCreate from './meetingCreate.vue'
import MeetingRecord from './meetingRecord.vue'
const activeName = ref('meetingCreate');
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
  margin: 0;
}
</style>
