<template>
  <el-row :gutter="30" v-if="recordList.length > 0">
    <el-col :span="6" v-for="(item, index) in recordList" :key="index">
      <el-card shadow="always">
        <div class="record-item">
          <div class="info-item">
            <span class="info-title">计划单号：</span>
            <el-text type="primary">{{ item.planNo }}</el-text>
          </div>
          <div class="info-item">
            <span class="info-title">作业名称：</span>
            <el-text type="primary">{{ item.taskName }}</el-text>
          </div>
          <div class="info-item">
            <span class="info-title">作业类型：</span>
            <span>{{ item.workType }}</span>
          </div>
          <div class="info-item">
            <span class="info-title">作业开始时间：</span>
            <span>{{ item.taskStartTime }}</span>
          </div>
          <div class="info-item">
            <span class="info-title">作业结束时间：</span>
            <span>{{ item.taskEndTime }}</span>
          </div>
          <div class="info-item">
            <span class="info-title">风险等级：</span>
            <span :class="levelClass(item)">{{ item.riskLevel }}</span>
          </div>
          <div
            v-if="item.status == '进行中'"
            class="corner-label"
            :style="`background-color: #FF9500`"
          >
            {{ item.status }}
          </div>
          <div
            v-else-if="item.status == '已完成'"
            class="corner-label"
            :style="`background-color: #515151`"
          >
            {{ item.status }}
          </div>
          <div v-else class="corner-label">{{ item.status }}</div>
        </div>
      </el-card>
    </el-col>
  </el-row>
  <!-- <el-empty v-else></el-empty> -->
  <div v-else class="empty flex items-center">暂无数据</div>
</template>

<script setup lang="ts">
import { ElCard, ElRow, ElCol, ElText, ElEmpty } from 'element-plus';
import { ref, reactive, computed, onMounted, toRefs } from 'vue';

defineOptions({
  name: 'OperationRecord',
});
const recordData = defineModel('recordData');
const workTypeMap = {
  '1': '紧急作业',
  '2': '临时作业',
  '3': '计划作业',
};
const riskLevelMap = {
  '0': '低',
  '1': '中',
  '2': '高',
};
const recordList = recordData.value.map((item) => {
  return {
    ...item,
    workType: workTypeMap[item.workType],
    riskLevel: riskLevelMap[item.riskLevel],
  };
});

const levelClass = (item) => {
  if (item.riskLevel == '高') {
    return 'level-high';
  } else if (item.riskLevel == '中') {
    return 'level-middle';
  } else {
    return 'level-low';
  }
};
</script>

<style scoped lang="less">
::v-deep .el-card__body {
  padding: 0;
}
.record-item {
  position: relative;
  padding-left: 10px;
  padding-bottom: 10px;

  .info-title {
    color: #666;
  }

  .info-item {
    margin-top: 20px;
  }

  .info-item:first-of-type {
    margin-top: 30px;
  }

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
  // .level-low {
  //   color: #000000a5;
  //   background-color: #f5f5f5;
  //   border: 1px solid #d9d9d9;
  //   border-radius: 5px;
  //   padding: 1px 8px;
  // }
  .corner-label {
    position: absolute;
    top: -21px;
    right: -19px;
    transform: rotate(45deg);
    background-color: #00bc86;
    color: white;
    padding: 4px 20px 4px;
    font-size: 12px;
    white-space: nowrap;
    z-index: 10;
  }
}

.empty {
  height: 400px;
  color: #666;
  justify-content: center;
  background-color: #f4f4f4;
  margin: 20px;
}
</style>
