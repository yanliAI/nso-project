<template>
  <div>
    <div style="margin: 0 0 10px 18px">
      <el-text type="danger"
        >说明：系统根据作业台账清单的时间自动计算开始时间和结束时间；停机：指主机、中间件、数据库等提供的服务终端</el-text
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
          <el-form-item label="作业计划开始时间：">
            <el-date-picker
              v-model="formData.preWorkStartTime"
              type="datetime"
              placeholder="请选择作业计划开始时间"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="作业计划结束时间：">
            <el-date-picker
              v-model="formData.preWorkEndTime"
              type="datetime"
              placeholder="请选择作业计划结束时间"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="作业计划总时长：">
            <span style="color: #ff0000">{{ formData.preWorkTotalTime }}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="100">
        <el-col :span="8">
          <el-form-item label="停机开始时间：">
            <el-date-picker
              v-model="formData.downStartTime"
              type="datetime"
              placeholder="请选择停机开始时间"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="停机结束时间：">
            <el-date-picker
              v-model="formData.downEndTime"
              type="datetime"
              placeholder="请选择停机结束时间"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="停机总时长：">
            <span style="color: #ff0000">{{ formData.downTotalTime }}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <h2 style="margin: 0 0 10px 18px; font-weight: bold; color: #333">
      作业台账清单
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
      <el-table-column prop="sysName" label="所属信息系统名称" align="center">
      </el-table-column>
      <el-table-column prop="configName" label="配置项名称" align="center">
      </el-table-column>
      <el-table-column prop="ip" label="ip" align="center"> </el-table-column>
      <el-table-column prop="leaderName" label="业务负责人" align="center">
      </el-table-column>
      <el-table-column
        prop="leaderAccount"
        label="业务负责人数认账号"
        align="center"
        width="180"
      >
      </el-table-column>
      <el-table-column prop="equipmentOwner" label="设备主人" align="center">
      </el-table-column>
      <el-table-column label="作业开始/结束时间" align="center">
        <template #default="scope">
          <p>{{ scope.row.jobStartTime }}</p>
          <p>{{ scope.row.jobEndTime }}</p>
        </template>
      </el-table-column>
      <el-table-column label="停机开始/结束时间" align="center">
        <template #default="scope">
          <p>{{ scope.row.downStartTime }}</p>
          <p>{{ scope.row.downEndTime }}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="downTotalTime"
        label="停机时长"
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
  name: 'BalanceMgtAccountsList',
});

interface Props {
  preWorkStartTime?: string;
  preWorkEndTime?: string;
  preWorkTotalTime?: string;
  downStartTime?: string;
  downEndTime?: string;
  downTotalTime?: string;
  tableData?: Array<any>;
}
const formData = withDefaults(defineProps<Props>(), {
  preWorkStartTime: '2024-10-24 19:00',
  preWorkEndTime: '2024-10-26 19:00',
  preWorkTotalTime: '48小时0分钟',
  downStartTime: '2024-10-24 19:00',
  downEndTime: '2024-10-26 19:00',
  downTotalTime: '48小时0分钟',
  tableData: [
    {
      sysName: '电子商城',
      configName: '数据库服务器1',
      ip: '127.0.0.1',
      leaderName: '张山',
    },
    {
      sysName: '电子商城',
      configName: '数据库服务器1',
      ip: '127.0.0.1',
      leaderName: '张山',
    },
    {
      sysName: '电子商城',
      configName: '数据库服务器1',
      ip: '127.0.0.1',
      leaderName: '张山',
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
