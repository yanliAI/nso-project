<template>
  <Page auto-content-height>
    <el-tabs v-model="activeTab" type="card" class="my-tabs">
      <el-tab-pane label="操作系统" name="tab-system" lazy>
        <System></System>
      </el-tab-pane>
      <el-tab-pane label="中间件" name="tab-middleware" lazy>
        <Middleware></Middleware>
      </el-tab-pane>
      <el-tab-pane label="数据库" name="tab-db" lazy>
        <Database></Database>
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
import System from './system.vue';
import Middleware from './middleware.vue';
import Database from './database.vue';

defineOptions({
  name: 'FixedAutoSupervision',
});

const activeTab = ref('tab-system');

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
