<script lang="ts" setup>


import {
  AnalysisChartCard,
} from '@vben/common-ui';



import AnalyticsVisitsData from '../../dashboard/analytics/analytics-visits-data.vue';
import One from './one.vue';
import Two from './two.vue';
import Three from './three.vue';
import Four from './four.vue';
import Five from './five.vue';
import Six from './six.vue';
import Seven from './seven.vue';
import Eight from './eight.vue';
import Nine from './nine.vue';

import { Page } from '@vben/common-ui';
import { ElForm,ElLink, ElFormItem, ElText,ElRow, ElCol, ElTable,ElTabs, ElTabPane, ElTableColumn, ElPagination, ElMain, ElContainer, ElHeader, ElFooter,ElMessage,ElMessageBox} from 'element-plus';
import { Tickets } from '@element-plus/icons-vue'
import { ref } from 'vue';
import ResourceUsageDialog from './ResourceUsageDialog.vue';
import ResourceSurplusDialog from './ResourceSurplusDialog.vue';
import ResourceApplicationDialog from './ResourceApplicationDialog.vue';

const dialogVisible = ref(false);
const dialogVisible2 = ref(false);
const dialogVisible3 = ref(false);
const openDialog = () => {
  dialogVisible.value = true;
};
const openDialog2 = () => {
  dialogVisible2.value = true;
};
const openDialog3 = () => {
  dialogVisible3.value = true;
};

</script>

<template>
<Page auto-content-height>
    <div style="width:100%;height: 100%; background-color: white;" >

      <div style="width:100%; height: 33%; border-top-width: 2px;" class="flex">
        <div style="width: 2%; height: 90%;  margin-top: 15px; margin-bottom: 15px;"></div>
        <div style="width: 33%; height: 100%;    ">
          <el-row>
            <el-col :span="21"><el-icon style="padding-top: 6px;" color="#409eff"><Tickets /></el-icon><strong>&nbsp;计算资源使用情况</strong></el-col>
            <el-col :span="3"><el-text class="mx-1" type="info" @click="openDialog()" style="cursor:pointer">更多>></el-text></el-col>
            <ResourceUsageDialog  :visible="dialogVisible" @update:visible="dialogVisible = $event" />
          </el-row>
          <One />
        </div>
        <div style="width: 2%; height: 90%; border-right-width: 2px; margin-top: 15px; margin-bottom: 15px;"></div>
        <div style="width: 2%; height: 90%;  margin-top: 15px; margin-bottom: 15px;"></div>
        <div style="width: 33%; height: 100%;   ">
          <el-row>
            <el-col :span="21"><el-icon style="padding-top: 6px;" color="#409eff"><Tickets /></el-icon><strong>&nbsp;内存资源使用情况</strong></el-col>
            <el-col :span="3"><el-text class="mx-1" type="info" @click="openDialog()" style="cursor:pointer">更多>></el-text></el-col>
          </el-row>
          <Two />
        </div>
        <div style="width: 2%; height: 90%; border-right-width: 2px; margin-top: 15px; margin-bottom: 15px;"></div>
        <div style="width: 2%; height: 90%;  margin-top: 15px; margin-bottom: 15px;"></div>
        <div style="width: 33%; height: 100%;  ">
          <el-row>
            <el-col :span="21"><el-icon style="padding-top: 6px;" color="#409eff"><Tickets /></el-icon><strong>&nbsp;存储资源使用情况</strong></el-col>
            <el-col :span="3"><el-text class="mx-1" type="info" @click="openDialog()" style="cursor:pointer">更多>></el-text></el-col>
          </el-row>
          <Three />
        </div>
      </div>

      <div style="width:100%; height: 33%;" class="flex">
        <div style="width: 2%; height: 90%;  margin-top: 15px; margin-bottom: 15px;"></div>
        <div style="width: 33%; height: 100%;  border-top-width: 2px;  ">
          <el-row>
            <el-col :span="21"><el-icon style="padding-top: 6px;" color="#5f40ff"><Tickets /></el-icon><strong>&nbsp;计算资源余量分析</strong></el-col>
            <el-col :span="3"><el-text class="mx-1" type="info" @click="openDialog2()" style="cursor:pointer">更多>></el-text></el-col>
            <ResourceSurplusDialog  :visible="dialogVisible2" @update:visible="dialogVisible2 = $event" />
          </el-row>
          <Four />
        </div>
        <div style="width: 2%; height: 90%; border-right-width: 2px; margin-top: 15px; margin-bottom: 15px;"></div>
        <div style="width: 2%; height: 90%;  margin-top: 15px; margin-bottom: 15px;"></div>
        <div style="width: 33%; height: 100%;   border-top-width: 2px;">
          <el-row>
            <el-col :span="21"><el-icon style="padding-top: 6px;" color="#5f40ff"><Tickets /></el-icon><strong>&nbsp;内存资源余量分析</strong></el-col>
            <el-col :span="3"><el-text class="mx-1" type="info" @click="openDialog2()" style="cursor:pointer">更多>></el-text></el-col>
          </el-row>
          <Five />
        </div>
        <div style="width: 2%; height: 90%; border-right-width: 2px; margin-top: 15px; margin-bottom: 15px;"></div>
        <div style="width: 2%; height: 90%;  margin-top: 15px; margin-bottom: 15px;"></div>
        <div style="width: 33%; height: 100%;  border-top-width: 2px;">
          <el-row>
            <el-col :span="21"><el-icon style="padding-top: 6px;" color="#5f40ff"><Tickets /></el-icon><strong>&nbsp;存储资源余量分析</strong></el-col>
            <el-col :span="3"><el-text class="mx-1" type="info" @click="openDialog2()" style="cursor:pointer">更多>></el-text></el-col>
          </el-row>
          <Six />
        </div>
      </div>

      <div style="width:100%; height: 33%;" class="flex">
        <div style="width: 2%; height: 90%;  margin-top: 15px; margin-bottom: 15px;"></div>
        <div style="width: 33%; height: 100%;  border-top-width: 2px;  ">
          <el-row>
            <el-col :span="21"><el-icon style="padding-top: 6px;" color="#ff406a"><Tickets /></el-icon><strong>&nbsp;计算资源申请平衡</strong></el-col>
            <el-col :span="3"><el-text class="mx-1" type="info" @click="openDialog3()" style="cursor:pointer">更多>></el-text></el-col>
            <ResourceApplicationDialog  :visible="dialogVisible3" @update:visible="dialogVisible3 = $event" />
          </el-row>
          <Seven />
        </div>
        <div style="width: 2%; height: 90%; border-right-width: 2px; margin-top: 15px; margin-bottom: 15px;"></div>
        <div style="width: 2%; height: 90%;  margin-top: 15px; margin-bottom: 15px;"></div>
        <div style="width: 33%; height: 100%;   border-top-width: 2px;">
          <el-row>
            <el-col :span="21"><el-icon style="padding-top: 6px;" color="#ff406a"><Tickets /></el-icon><strong>&nbsp;内存资源申请平衡</strong></el-col>
            <el-col :span="3"><el-text class="mx-1" type="info" @click="openDialog3()" style="cursor:pointer">更多>></el-text></el-col>
          </el-row>
          <Eight />
        </div>
        <div style="width: 2%; height: 90%; border-right-width: 2px; margin-top: 15px; margin-bottom: 15px;"></div>
        <div style="width: 2%; height: 90%;  margin-top: 15px; margin-bottom: 15px;"></div>
        <div style="width: 33%; height: 100%;  border-top-width: 2px;">
          <el-row>
            <el-col :span="21"><el-icon style="padding-top: 6px;" color="#ff406a"><Tickets /></el-icon><strong>&nbsp;存储资源申请平衡</strong></el-col>
            <el-col :span="3"><el-text class="mx-1" type="info" @click="openDialog3()" style="cursor:pointer">更多>></el-text></el-col>
          </el-row>
          <Nine />
        </div>
      </div>

    </div>
</Page>
</template>

<style>

</style>
