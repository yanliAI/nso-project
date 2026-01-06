<script lang="ts" setup>
import { ref } from 'vue';
import { ElTabs, ElTabPane } from 'element-plus';
import { Page } from '@vben/common-ui';
import KeywordsFilter from './keywordsFilter.vue'
import ActionType from './actionType.vue'
import AlarmConfig from './alarmConfig.vue'
import AlarmRule from './alarmRule.vue'
import JudgeLogicConfig from './judgeLogicConfig.vue'

const activeName = ref('first');
</script>

<template>
  <Page auto-content-height>
    <el-tabs type="card" v-model="activeName" class="w-full h-full bg-white">
      <el-tab-pane label="告警处置配置" name="first" style="height: 100%;width: 100%">
        <AlarmConfig />
      </el-tab-pane>
      <el-tab-pane label="诊断规则配置" name="second" style="height: 100%;width: 100%">
        <AlarmRule />
      </el-tab-pane>
      <el-tab-pane label="数据过滤关键字维护" name="third" style="height: 100%;width: 100%">
        <KeywordsFilter />
      </el-tab-pane>
      <el-tab-pane label="告警动作类型维护" name="fourth" style="height: 100%;width: 100%">
        <ActionType />
      </el-tab-pane>
      <el-tab-pane label="智能判定逻辑自定义设置" name="fifth" style="height: 100%;width: 100%">
        <JudgeLogicConfig />
      </el-tab-pane>
    </el-tabs>
  </Page>
</template>

<style scoped>
:deep(.el-tab-pane) {
  width: 100%;
  height: 100%;
}
</style>
