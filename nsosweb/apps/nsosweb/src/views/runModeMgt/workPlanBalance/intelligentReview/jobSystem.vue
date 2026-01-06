<template>
  <div>
    <div style="margin: 0 0 10px 18px">
      <el-text type="danger"
        >说明：停服指信息系统对外服务全部或部分中断</el-text
      >
    </div>

    <el-form
      :inline="true"
      :model="formData"
      label-position="right"
      label-width="auto"
      style="padding: 0 20px"
      disabled
    >
      <el-row :gutter="100">
        <el-col :span="8">
          <el-form-item label="停服开始时间：">
            <el-date-picker
              v-model="formData.stopStatTime"
              type="datetime"
              placeholder="请选择停服开始时间"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="停服结束时间：">
            <el-date-picker
              v-model="formData.stopEndTime"
              type="datetime"
              placeholder="请选择停服结束时间"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="停服总时长：">
            <span style="color: #ff0000">{{
              calculateDuration(formData.stopStatTime, formData.stopEndTime)
            }}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <h2 style="margin: 0 0 10px 18px; font-weight: bold; color: #333">
      作业系统
    </h2>
    <el-table
      border
      stripe
      ref="table"
      :data="formData.taskWorkOSList"
      max-height="300"
    >
      <el-table-column type="index" label="#" align="center" />
      <!-- <el-table-column label="操作" prop="operation" align="center" width="120">
        <template #default="{ row }">
          <el-button type="primary" link @click="">查看</el-button>
          <el-button type="primary" link @click="">调整</el-button>
        </template>
      </el-table-column> -->
      <el-table-column prop="systemName" label="系统名称" align="center">
      </el-table-column>
      <el-table-column prop="deviceOwner" label="设备主人" align="center">
      </el-table-column>
      <el-table-column
        prop="deviceOwnerAccount"
        label="设备主人数认账号"
        align="center"
        width="180"
      ></el-table-column>
      <el-table-column prop="businessOwner" label="业务负责人" align="center">
      </el-table-column>
      <el-table-column
        prop="businessOwnerAccount"
        label="业务负责人数认账号"
        align="center"
        width="180"
      ></el-table-column>
      <el-table-column label="停服开始/结束时间" align="center">
        <template #default="scope">
          <p>{{ scope.row.stopStatTime }}</p>
          <p>{{ scope.row.stopEndTime }}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="stopTotalTime"
        label="停服总时长"
        align="center"
        width="100"
      >
        <template #default="scope">
          {{ calculateDuration(scope.row.stopStatTime, scope.row.stopEndTime) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="isInterDay"
        label="跨天作业"
        align="center"
        width="100"
      >
        <template #default="scope">
          {{ scope.row.isInterDay == 1 ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="userTotal"
        label="影响用户数"
        align="center"
        width="100"
      >
      </el-table-column>
    </el-table>
    <el-form
      :inline="true"
      :model="formData"
      label-position="right"
      label-width="auto"
      style="padding: 0 20px"
    >
      <el-row :gutter="100">
        <el-col :span="8">
          <el-form-item label="涉及核心功能：" style="margin: 10px 0 0">
            <span>{{ isCore }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="影响业务：" style="margin: 10px 0 0">
            <span>{{ isEffectService }}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import {
  ElRow,
  ElCol,
  ElFormItem,
  ElForm,
  ElDatePicker,
  ElTable,
  ElTableColumn,
  ElInput,
  ElSelect,
  ElOption,
  ElDialog,
  ElMessage,
  ElMessageBox,
  ElText,
  ElLink,
  ElTag,
} from 'element-plus';

import { ref, reactive, computed, onMounted } from 'vue';
import { calculateDuration } from '#/utils/commonUtil.ts';

defineOptions({
  name: 'IntelligentReviewJobSystem',
});

const formData = defineModel('detailData');

const isCore = computed(() => {
  if (
    !formData.value.taskWorkOSList ||
    formData.value.taskWorkOSList.list <= 0
  ) {
    return '否';
  }
  return formData.value.taskWorkOSList[0].isCore == 1 ? '是' : '否';
});
const isEffectService = computed(() => {
  if (
    !formData.value.taskWorkOSList ||
    formData.value.taskWorkOSList.list <= 0
  ) {
    return '否';
  }
  return formData.value.taskWorkOSList[0].isEffectService == 1 ? '是' : '否';
});

onMounted(() => {});
</script>

<style scoped>
::v-deep .el-form-item {
  width: 100%;
}
</style>
