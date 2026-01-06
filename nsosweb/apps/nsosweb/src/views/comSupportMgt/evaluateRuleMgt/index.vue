<template>
  <Page auto-content-height>
    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane label="规则配置" name="dispatchRule">
        <EvaluateDispatchRule :busiType="busiType" />
      </el-tab-pane>
      <!-- <el-tab-pane label="运维序列" name="maintainRule">
        <EvaluateMaintainRule />
      </el-tab-pane> -->
    </el-tabs>
  </Page>
</template>
<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue';
import { ElTabs, ElTabPane } from 'element-plus';
import { Page } from '@vben/common-ui';
import EvaluateDispatchRule from './evaluateDispatchRule.vue'
import EvaluateMaintainRule from './evaluateMaintainRule.vue'

const activeName = ref('dispatchRule');
const busiType = ref('ydpj');
onMounted(async () => {
  const path = window.location.href;
  busiType.value = path.split('/').pop();
});
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
</style>
