<script setup lang="ts">
import { ref } from 'vue';

import {
  ElTable,
  ElTableColumn,
  ElContainer,
  ElFormItem,
  ElDialog,
  ElForm,
  ElInput,
  ElButton,
  ElSelect,
  ElRow,
  ElCol,
  ElTabs,
  ElPagination,
  ElMessage,
  ElMessageBox,
  type FormInstance,
} from 'element-plus';
import {
  Download,
  Search,
  Refresh,
  Setting,
  Bell,
} from '@element-plus/icons-vue';
import { useAccessStore, useUserStore } from '@vben/stores';

import ResponseMgt from './responseMgt.vue';
const currentSelectedItem = ref('responseSetting');

</script>
<template>
  <div class="h-full" style="position: relative">
    <ElTabs ref="myTab" v-model="currentSelectedItem" type="card">
      <el-tab-pane label="常用回复设置" name="responseSetting" :closable="false">
        <ResponseMgt />
      </el-tab-pane>
    </ElTabs>
  </div>
</template>
<style scoped lang="less">
:deep(.el-form-item__label) {
  width: 100px;
}
</style>
