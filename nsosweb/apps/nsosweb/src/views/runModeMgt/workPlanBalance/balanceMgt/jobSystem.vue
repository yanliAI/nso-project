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
    >
      <el-row :gutter="100">
        <el-col :span="8">
          <el-form-item label="停服开始时间：">
            <el-date-picker
              v-model="formData.stopStartTime"
              type="dateTime"
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
              type="dateTime"
              placeholder="请选择停服结束时间"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="停服总时长：">
            <span style="color: #ff0000">{{ formData.stopTotalTime }}</span>
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
      :data="formData.tableData"
      max-height="300"
    >
      <el-table-column type="index" label="#" align="center" />
      <el-table-column label="操作" prop="operation" align="center" width="120">
        <template #default="{ row }">
          <el-button type="primary" link @click="">查看</el-button>
          <el-button type="primary" link @click="">调整</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="sysName" label="系统名称" align="center">
      </el-table-column>
      <el-table-column prop="equipmentOwner" label="设备主人" align="center">
      </el-table-column>
      <el-table-column
        prop="equipmentOwnerAccount"
        label="设备主人数认账号"
        align="center"
        width="180"
      ></el-table-column>
      <el-table-column prop="leaderName" label="业务负责人" align="center">
      </el-table-column>
      <el-table-column
        prop="leaderAccount"
        label="业务负责人数认账号"
        align="center"
        width="180"
      ></el-table-column>
      <el-table-column label="停服开始/结束时间" align="center">
        <template #default="scope">
          <p>{{ scope.row.stopStartTime }}</p>
          <p>{{ scope.row.stopEndTime }}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="stopTotalTime"
        label="停服总时长"
        align="center"
        width="100"
      >
      </el-table-column>
      <el-table-column
        prop="isCrossDayOperation"
        label="跨天作业"
        align="center"
        width="100"
      >
      </el-table-column>
      <el-table-column
        prop="affectUsers"
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
            <span>{{ formData.isInvolveCore }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="影响业务：" style="margin: 10px 0 0">
            <span>{{ formData.isAffectedService }}</span>
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
import { requestClient } from '#/api/request';

defineOptions({
  name: 'BalanceMgtJobSystem',
});

interface Props {
  stopStartTime?: string;
  stopEndTime?: string;
  stopTotalTime?: string;
  isInvolveCore?: string;
  isAffectedService?: string;
  tableData?: Array<any>;
}
const formData = withDefaults(defineProps<Props>(), {
  stopStartTime: '2024-10-24 19:00',
  stopEndTime: '2024-10-26 19:00',
  stopTotalTime: '48小时0分钟',
  isInvolveCore: '否',
  isAffectedService: '是',
  tableData: [
    {
      sysName: '电子商城',
      equipmentOwner: '数据库服务器1',
      equipmentOwnerAccount: 'lisi@csg.cn',
      leaderName: '张山',
      stopStartTime: '2024-1-1 12:00:00',
      stopEndTime: '2024-1-1 12:00:00',
    },
    {
      sysName: '电子商城',
      equipmentOwner: '数据库服务器1',
      equipmentOwnerAccount: 'lisi@csg.cn',
      leaderName: '张山',
      stopStartTime: '2024-1-1 12:00:00',
      stopEndTime: '2024-1-1 12:00:00',
    },
    {
      sysName: '电子商城',
      equipmentOwner: '数据库服务器1',
      equipmentOwnerAccount: 'lisi@csg.cn',
      leaderName: '张山',
      stopStartTime: '2024-1-1 12:00:00',
      stopEndTime: '2024-1-1 12:00:00',
    },
  ],
});

onMounted(() => {});
</script>

<style scoped>
::v-deep .el-form-item {
  width: 100%;
}
</style>
