<template>
  <div>
    <h2 style="margin: 0 0 10px 18px; font-weight: bold; color: #333">
      关联信息系统清单：
    </h2>
    <el-table
      border
      stripe
      ref="table"
      :data="propsData.taskRelateOSList"
      max-height="300"
    >
      <el-table-column type="index" label="#" align="center" />
      <!-- <el-table-column label="操作" prop="operation" align="center" width="80">
        <template #default="{ row }">
          <el-button type="primary" link @click="">查看</el-button>
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
      <el-table-column prop="startTime" label="影响开始时间" align="center">
      </el-table-column>
      <el-table-column prop="endTime" label="影响结束时间" align="center">
      </el-table-column>
      <el-table-column
        prop="userTotal"
        label="影响用户数"
        align="center"
        width="100"
      >
      </el-table-column>
    </el-table>

    <div style="margin: 18px 0 10px 18px">
      <span style="font-weight: bold; color: #333">作业风险：</span>
      <span :class="levelClass">{{ riskLevelMap[propsData.riskLevel] }}</span>
    </div>
    <div class="table-title">基准风险管控措施</div>
    <el-table
      border
      stripe
      ref="table"
      :data="propsData.taskRiskControlList"
      max-height="300"
    >
      <el-table-column prop="workType" label="作业类型" align="center" />
      <el-table-column prop="workTasks" label="作业内容" align="center" />
      <el-table-column
        prop="isAuthorize"
        label="预授权作业"
        align="center"
        width="120"
      >
        <template #default="scope">
          {{ scope.row.isAuthorize == 1 ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column prop="riskDescribe" label="风险描述" align="center" />
      <el-table-column
        prop="riskMeasure"
        label="作业风险管控措施"
        align="center"
      />
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

defineOptions({
  name: 'BalanceMgtLinkSystemList',
});

const riskLevelMap = {
  '0': '低',
  '1': '中',
  '2': '高',
};

const propsData = defineModel('detailData');

const levelClass = computed(() => {
  const { riskLevel } = propsData.value;
  if (riskLevel == '2') {
    return 'level-high';
  } else if (riskLevel == '1') {
    return 'level-middle';
  } else {
    return 'level-low';
  }
});

onMounted(() => {});
</script>

<style scoped>
.level-high {
  color: #f5222d;
  background-color: #fef0ef;
  border: 1px solid #ffa39e;
  border-radius: 5px;
  padding: 1px 8px;
}
.level-middle {
  color: #fa541c;
  background-color: #fff2e8;
  border: 1px solid #ffbb96;
  border-radius: 5px;
  padding: 1px 8px;
}
.level-low {
  color: #1890ff;
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 5px;
  padding: 1px 8px;
}
.table-title {
  height: 30px;
  line-height: 30px;
  color: #333;
  font-weight: bold;
  text-align: center;
  background: #f9f9f9;
}
</style>
