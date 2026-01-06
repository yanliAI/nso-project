<template>
  <div>
    <div style="margin: 0 0 10px 18px">
      <el-text type="danger"
        >说明：系统根据作业台账清单的时间自动计算开始时间和结束时间；停机：指主机、中间件、数据库等提供的服务中断</el-text
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
          <el-form-item label="作业计划开始时间：">
            <el-date-picker
              v-model="formData.startTime"
              type="datetime"
              placeholder="请选择"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="作业计划结束时间：">
            <el-date-picker
              v-model="formData.endTime"
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
            <span style="color: #ff0000">{{ preWorkTotalTime }}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="100">
        <el-col :span="8">
          <el-form-item label="停机开始时间：">
            <el-date-picker
              v-model="formData.haltStartTime"
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
              v-model="formData.haltEndTime"
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
            <span style="color: #ff0000">{{ downTotalTime }}</span>
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
      :data="formData.taskLedgerList"
      max-height="300"
    >
      <el-table-column type="index" label="#" align="center" />
      <!-- <el-table-column label="操作" prop="operation" align="center" width="120">
        <template #default="{ row }">
          <el-button type="primary" link @click="">查看</el-button>
          <el-button type="primary" link @click="">调整</el-button>
        </template>
      </el-table-column> -->
      <el-table-column
        prop="systemName"
        label="所属信息系统名称"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="configName" label="配置项名称" align="center">
      </el-table-column>
      <el-table-column prop="ipAddress" label="ip" align="center">
      </el-table-column>
      <el-table-column prop="businessOwner" label="业务负责人" align="center">
      </el-table-column>
      <el-table-column
        prop="businessOwnerAccount"
        label="业务负责人数认账号"
        align="center"
        width="180"
      >
      </el-table-column>
      <el-table-column prop="deviceOwner" label="设备主人" align="center">
      </el-table-column>
      <el-table-column label="作业开始/结束时间" align="center">
        <template #default="scope">
          <p>{{ scope.row.statTime }}</p>
          <p>{{ scope.row.endTime }}</p>
        </template>
      </el-table-column>
      <el-table-column label="停机开始/结束时间" align="center">
        <template #default="scope">
          <p>{{ scope.row.haltStartTime }}</p>
          <p>{{ scope.row.haltEndTime }}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="downTotalTime"
        label="停机时长"
        align="center"
        width="100"
      >
        <template #default="scope">
          {{
            calculateDuration(scope.row.haltStartTime, scope.row.haltEndTime)
          }}
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
  name: 'IntelligentReviewAccountsList',
});

const formData = defineModel('detailData');

// const formData = ref({
//   startTime: '2025-05-21 19:00',
//   endTime: '2025-05-22 19:00',
//   haltStartTime: '2025-05-21 19:00',
//   haltEndTime: '2025-05-22 19:00',
//   startTime2: '2025-05-21 19:00',
//   endTime2: '2025-05-22 19:00',
//   haltStartTime2: '2025-05-21 19:00',
//   haltEndTime2: '2025-05-22 19:00',
//   tableData: [
//     {
//       sysName: '电子商城',
//       configName: '数据库服务器1',
//       ip: '127.0.0.1',
//       leaderName: '张山',
//     },
//     {
//       sysName: '电子商城',
//       configName: '数据库服务器1',
//       ip: '127.0.0.1',
//       leaderName: '张山',
//     },
//     {
//       sysName: '电子商城',
//       configName: '数据库服务器1',
//       ip: '127.0.0.1',
//       leaderName: '张山',
//     },
//   ],
// });

// 计算预工作总时长
const preWorkTotalTime = computed(() => {
  if (!formData.value.startTime || !formData.value.endTime) {
    return '';
  }
  return calculateDuration(formData.value.startTime, formData.value.endTime);
});

// 计算停机总时长
const downTotalTime = computed(() => {
  if (!formData.value.haltStartTime || !formData.value.haltEndTime) {
    return '';
  }
  return calculateDuration(
    formData.value.haltStartTime,
    formData.value.haltEndTime,
  );
});

onMounted(() => {});
</script>

<style scoped>
::v-deep .el-form-item {
  width: 100%;
}
</style>
