<template>
  <div class="contain">
    <div class="left">
      <div v-for="(item, index) in tableData">
        <el-card
          style="background: white; height: 200px; width: 100%; margin: 10px 0"
          shadow="always"
        >
          <div class="item-title">
            <div class="flex">
              <div style="width: 70px">重大异常</div>
              <div style="width: 300px; color: black; font-weight: 700">
                {{ item.alarmDesc }}
              </div>
            </div>
            <div class="flex">
              <div style="width: 190px; color: black; font-weight: 700">
                {{ item.alarmTime }}
              </div>
              <div>
                <el-tag
                  type="warning"
                  effect="dark"
                  style="
                    height: 20px;
                    margin: 5px 10px 5px 10px;
                    border-radius: 0;
                  "
                  >{{ item.alarmKeepTime }}小时</el-tag
                >
              </div>
              <!-- <div>
                <el-tag
                  type="primary"
                  effect="dark"
                  style="
                    height: 20px;
                    margin: 5px 10px 5px 10px;
                    border-radius: 0;
                  "
                  >待处置</el-tag
                >
              </div> -->
            </div>
          </div>
          <div class="content">
            <el-row style="width: 100%; margin-top: 25px;">
              <el-col :span="6">
                <span class="item">告警编号:</span>{{ item.alarmId }}
              </el-col>
              <el-col :span="6">
                <span class="item">告警设施ID:</span>{{ item.alarmSqId }}
              </el-col>
              <el-col :span="6">
                <span class="item">故障设施:</span>{{ item.alarmSqName }}
              </el-col>
              <el-col :span="6">
                <span class="item">告警级别:</span>{{ item.alarmLevel }}
              </el-col>
            </el-row>
            <el-row style="width: 100%;margin-top: 25px;">
              <el-col :span="6">
                <span class="item">设施运维模式:</span
                >{{
                  item.alarmSqYmode == 1
                    ? '运调检测'
                    : item.alarmSqYmode == 2
                      ? '运维发现'
                      : '运服报障'
                }}
              </el-col>
              <el-col :span="6">
                <span class="item">设施类型:</span
                >{{ sqTypes[Number(item.facilityType) - 1] }}
              </el-col>
              <el-col :span="6">
                <span class="item">设施IP:</span>{{ item.sqIp }}
              </el-col>
              <el-col :span="6">
                <span class="item">运维单位:</span>{{ item.alarmSqYunit }}
              </el-col>
            </el-row>
            <el-row style="width: 100%;margin-top: 25px;">
              <el-col :span="6">
                <span class="item">生产厂家:</span>{{ item.manufacturer }}
              </el-col>
              <el-col :span="18">
                <span class="item">告警报文:</span>{{ item.alarmContext }}
              </el-col>
            </el-row>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElTabs, ElSteps, ElStep, ElTag } from 'element-plus';
import { getTopoalarmInfoById } from '#/api';
const currentSelectedItem = ref('all');
const tableData = ref([]);
const handleData = ref([]);

const props = defineProps({
  detailContent: {
    type: String,
    default: '', // 默认值
  },
});

const sqTypes = [
  '服务器',
  '存储器',
  '网络交换机',
  '防火墙',
  '负载均衡',
  '中间件',
  '数据库',
];
// 进度枚举
const progressOption = {
  '1': '故障告警',
  '2': '故障初报',
  '3': '故障定位',
  '4': '下令处置',
  '5': '故障恢复',
  '6': '故障复盘',
};
// 获取右上角统计数据
tableData.value.push(props.detailContent);

onMounted(() => {});

// 显示处置状态
function handleStatus(item) {
  handleData.value = item;
}
</script>
<style scoped>
:deep(.el-step.is-vertical .el-step__line) {
  width: 5px;
  left: 7px;
}
:deep(.el-step__line) {
  border-color: #d98210;
  background-color: #d98210;
}
:deep(.el-step__title.is-success) {
  color: black;
}

:deep(.el-step__icon) {
  background: #01b613;
  width: 20px;
  height: 20px;
}
:deep(.el-icon) {
  color: #8fd396;
  font-size: 16px;
}
.contain {
  display: flex;
  height: 400px;
  .left {
    flex: 2.5;
    height: 300px;

    .item-title {
      line-height: 30px;
      height: 30px;
      border-bottom: 1px solid gainsboro;
      position: relative;
      padding-left: 20px;
      color: #9999a4;
      font-size: 15px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      /* font-weight: 500px; */
      &::before {
        content: ''; /* 固定数字 */
        position: absolute;
        left: 5px;
        top: 50%;
        transform: translateY(-50%);
        width: 10px;
        height: 10px;
        background: red;
      }
    }
  }
  .right {
    flex: 1;
    height: 520px;
    margin-top: 37px;
    margin-left: 10px;
    background-color: #dcdcdc;
    padding-left: 30px;
  }
}
.content {
  padding: 0 10px;
  margin-top: 10px;
  font-size: 15px;
  font-weight: 500;
  width: 100%;
  color: #5b5757;
}
.item {
  display: inline-block;
  margin-right: 10px;
  width: auto;
  text-align: left;
  color: black;
}
.content-first {
  display: flex;
  height: 30px;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  .item-content {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
  }
}
/* 步骤条描述容器样式 */
:deep(.el-step__description) {
  position: relative;
  min-height: 40px; /* 确保有足够空间 */
}

/* 左侧时间样式 */
.description-item {
  position: absolute;
  left: -130px; /* 调整到步骤条左侧 */
  top: -30px;
  width: 100px;
  color: #000000;
  font-size: 16px;
  font-weight: 700;
  text-align: left;
}
/* 右侧内容样式 */
.description {
  flex: 1;
  padding-left: 10px;
  font-size: 14px;
  color: rgb(144, 135, 135);
}
</style>
