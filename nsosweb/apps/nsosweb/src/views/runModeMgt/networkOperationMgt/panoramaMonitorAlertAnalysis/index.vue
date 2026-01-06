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
import deviceType from './deviceType.vue';
import maintenanceUnit from './maintenanceUnit.vue';
import productionFactory from './productionFactory.vue';
import timeDimension from './timeDimension.vue';
const userStore = useUserStore();
const isShow = ref(false);
const currentSelectedItem = ref('timeDimension');
if (
  userStore.userInfo.username &&
  userStore.userInfo.username === '超级管理员'
) {
  isShow.value = true;
}
</script>
<template>
  <div class="h-full" style="position: relative">
    <ElTabs ref="myTab" v-model="currentSelectedItem" type="card">
      <el-tab-pane label="时间纬度" name="timeDimension" :closable="false">
        <timeDimension />
      </el-tab-pane>
      <el-tab-pane label="设施类型" name="deviceType" :closable="false">
        <div><deviceType /></div>
      </el-tab-pane>
      <el-tab-pane label="生产厂家" name="productionFactory" :closable="false">
        <div><productionFactory /></div>
      </el-tab-pane>
      <el-tab-pane label="运维单位" name="maintenanceUnit " :closable="false">
        <div><maintenanceUnit /></div>
      </el-tab-pane>
    </ElTabs>
    <div style="position: absolute; right: 125px; top: 10px" v-show="isShow">
      <el-popover placement="top-start" :width="200" trigger="click">
        <template #reference>
          <el-button type="primary" :icon="Setting" link>提示规则库</el-button>
        </template>
        <div class="custom-popover">
          <span style="font-size: 14px; font-weight: 400">提示规则</span>
          <p>1. 异常次数超过1次的设施将纳入统计提示范围</p>
          <p>2. 发生异常且异常持续时间超过30分钟的设施将纳入统计提示范围</p>
        </div>
      </el-popover>
    </div>
    <div style="position: absolute; right: 25px; top: 10px" v-show="isShow">
      <!-- 正确嵌套结构 -->
      <el-popover
        placement="top-start"
        :width="200"
        trigger="hover"
        content="各大设施共发生6次重大异常,待处置!"
      >
        <!-- 触发元素必须放在 #reference slot 中 -->
        <template #reference>
          <el-badge value="6" class="item">
            <el-icon color="orange"><Bell /></el-icon>
          </el-badge>
        </template>
      </el-popover>
    </div>
  </div>
</template>
<style scoped lang="less">
:deep(.el-form-item__label) {
  width: 100px;
}
</style>
