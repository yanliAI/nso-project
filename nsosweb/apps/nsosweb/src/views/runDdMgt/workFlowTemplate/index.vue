<script lang="ts" setup>
import { ref } from 'vue';
import { ElTabs, ElTabPane } from 'element-plus';
import { Page } from '@vben/common-ui';
import workFlowTemplate from './work-flow-template.vue';
import segmentConfig from './segment-config.vue';

const activeName = ref('first');
</script>

<template>
  <Page auto-content-height>
      <el-tabs
        type="border-card"
        v-model="activeName"
        style="height: 100%; width: 100%"
      >
        <el-tab-pane label="流程模板管理" name="first" style="height: 100%;width: 100%">
          <workFlowTemplate />
        </el-tab-pane>
        <el-tab-pane label="环节配置管理" name="second" style="height: 100%;width: 100%">
          <segmentConfig />
        </el-tab-pane>
      </el-tabs>
  </Page>
</template>
