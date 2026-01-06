<template>
  <Page auto-content-height>
    <el-tabs v-model="activeTab" type="card" class="my-tabs">
      <el-tab-pane label="规则库" name="tab-rules" lazy>
        <RuleList></RuleList>
      </el-tab-pane>
      <el-tab-pane label="白名单" name="tab-whiteList" lazy>
        <WhiteList></WhiteList>
      </el-tab-pane>
    </el-tabs>
  </Page>
</template>

<script lang="ts" setup>
import {
  ElTabs,
  ElTabPane,
  ElTable,
  ElTableColumn,
  ElFormItem,
  ElForm,
  ElInput,
  ElButton,
  ElSelect,
  ElOption,
  ElPagination,
  ElContainer,
  ElMain,
  ElFooter,
  ElRow,
  ElCol,
  ElDialog,
  ElMessage,
  ElMessageBox,
  ElLink,
  ElTag,
} from 'element-plus';
import { Page } from '@vben/common-ui';
import { ref, reactive, computed, onMounted, nextTick } from 'vue';
import RuleList from './ruleList.vue';
import WhiteList from './whiteList.vue';

defineOptions({
  name: 'FixedValueRuleMgt',
});

const activeTab = ref('tab-rules');

onMounted(() => {});
</script>

<style scoped>
.my-tabs {
  height: 100%;
}
.el-main {
  padding-top: 0;
}
.cell {
  text-align: center;
}
</style>
