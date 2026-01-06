<template>
  <div class="contain">
    <div class="left">
      <ElTabs ref="myTab" v-model="currentSelectedItem" type="card">
        <el-tab-pane
          label="全部分类"
          name="all"
          :closable="false"
          style="
            background: gainsboro;
            padding-right: 10px;
            padding-left: 10px;
            padding-top: 1px;
            height: 500px;
          "
        >
          <div v-for="(item, index) in tableData">
            <div
              style="
                background: white;
                height: 100px;
                width: 100%;
                margin: 10px 0;
              "
              @click="handleStatus(item)"
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
                  <div>
                    <el-tag
                      type="primary"
                      effect="dark"
                      style="
                        height: 20px;
                        margin: 5px 10px 5px 10px;
                        border-radius: 0;
                      "
                      >{{ (item?.taskProgressList === null || item?.taskProgressList.length===0)? '待处置':'处置中'}}</el-tag>
                  </div>
                </div>
              </div>
              <div class="content">
                <div class="content-first">
                  <div class="item-content">
                    <span class="item" style="width: 60px; text-align: right"
                      >编号:</span
                    >{{ item.alarmId }}
                  </div>
                  <div class="item-content">
                    <span class="item">故障设备:</span>{{ item.alarmSqName }}
                  </div>
                  <div class="item-content">
                    <span class="item">告警级别:</span>{{ item.alarmLevel }}
                  </div>
                  <div class="item-content">
                    <span class="item" style="width: 100px; text-align: right"
                      >设施运维模式:</span
                    >{{
                      item.alarmSqYmode == 1
                        ? '运调检测'
                        : item.alarmSqYmode == 2
                          ? '运维发现'
                          : '运服报障'
                    }}
                  </div>
                </div>
                <div class="content-first">
                  <div class="item-content">
                    <span class="item" style="width: 60px; text-align: right"
                      >生产厂家:</span
                    >{{ item.manufacturer }}
                  </div>
                  <div class="item-content">
                    <span class="item">运维单位:</span>{{ item.alarmSqYunit }}
                  </div>
                  <div class="item-content">
                    <span class="item">设施类型:</span>{{ sqTypes[Number(item.facilityType) - 1]  }}
                  </div>
                  <div class="item-content">
                    <span class="item" style="width: 100px; text-align: right"
                      >影响范围及程度:</span
                    >{{ item.incidence }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <!-- <el-tab-pane label="故障" name="fault" :closable="false">
          <div>故障</div>
        </el-tab-pane>
        <el-tab-pane label="重大异常" name="majorException" :closable="false">
          <div>重大异常</div>
        </el-tab-pane>
        <el-tab-pane label="一般异常" name="generalException" :closable="false">
          <div>一般异常</div>
        </el-tab-pane> -->
      </ElTabs>
    </div>
    <div class="right">
      
      <div style="font-size: 18px;font-weight: 700; color: black; padding-left: 80px; padding-top: 20px; padding-bottom: 20px;">{{ handleData.alarmDesc }}</div>
      <div style=" padding: 10px 10px 10px 120px;" v-if="handleData?.taskProgressList?.length > 0">
      <el-steps direction="vertical" :active="handleData?.taskProgressList.length" space="70px" finish-status="success">
        <el-step
          v-for="(item, index) in handleData.taskProgressList"
          :key="index"
        >
        <template #title>
          <span>{{progressOption[item.progressCode]}}</span>

        </template>
          <template #description>
            <div class="description-container">
              <div class="description-item">{{item.processTime}}</div>
              <div class="description">处理人:{{item.personnel}}<br/>{{item.taskContent}} </div>
            </div>
          </template>
        </el-step>

      </el-steps>
      </div>
      <div v-else  style="text-align: center;margin-top: 200px;">
        <el-empty description="暂无处理数据" :image-size="100" />
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
  eleId: {
    type: String,
    default: '' // 默认值
  }
})

// 进度枚举
const progressOption = {
  '1':'故障告警',
  '2':'故障初报',
  '3':'故障定位',
  '4':'下令处置',
  '5':'故障恢复',
  '6':'故障复盘'
}
const sqTypes = [
  '服务器',
  '存储器',
  '网络交换机',
  '防火墙',
  '负载均衡',
  '中间件',
  '数据库',
];
// 获取右上角统计数据
async function queryData() {
  try {
    const res = await getTopoalarmInfoById(props.eleId);
    if (res) {
      tableData.value = res;
      handleData.value = tableData.value[0]
    }
  } catch (error) {
    console.error('查询数据失败:', error);
  }
}
onMounted(() => {
  queryData();
});

// 显示处置状态
function handleStatus(item) {
  handleData.value = item;
}

// tableData.value = [
//   {
//     type: '故障',
//     title: '"1.12"信息安全运行监测预警系统登录失败',
//     id: '1234556',
//     device: '预警系统',
//     deviceLevel: '三级',
//     level: '1级',
//     sourceChannel: '省级运调中心',
//     unit: '信通中心',
//     isAffect: '是',
//     incidence: '全网',
//     occurrenceTime: '2025年3月12日 01:29:00',
//     duration: '2小时',
//     status: '待签收',
//   },
//   {
//     type: '一般异常',
//     title: '故障1',
//     id: '1234556',
//     device: '预警系统',
//     deviceLevel: '三级',
//     level: '1级',
//     sourceChannel: '省级运调中心',
//     unit: '信通中心',
//     isAffect: '是',
//     incidence: '全网',
//     occurrenceTime: '2025年3月12日 01:29:00',
//     duration: '2小时',
//     status: '待处置',
//   },
//   {
//     type: '重大异常',
//     title: '故障1',
//     id: '1234556',
//     device: '预警系统',
//     deviceLevel: '三级',
//     level: '1级',
//     sourceChannel: '省级运调中心',
//     unit: '信通中心',
//     isAffect: '是',
//     incidence: '全网',
//     occurrenceTime: '2025年3月12日 01:29:00',
//     duration: '2小时',
//     status: '待处置',
//   },
// ];
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
  height: 600px;
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
    background-color: #DCDCDC;
    padding-left: 30px ;
  }
}
.content {
  padding: 0 10px;
}
.content-first {
  display: flex;
  height: 30px;
  align-items: center;
  justify-content: center;
  .item-content {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    .item {
      display: inline-block;
      margin-right: 10px;
    }
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
