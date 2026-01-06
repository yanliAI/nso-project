<script setup lang="ts">
import {
  ElForm,
  ElFormItem,
  ElTable,
  ElTableColumn,
  ElCalendar,
  ElInput,
  ElButton,
  ElSelect,
  ElOption,
  ElRow,
  ElCol,
  ElPagination,
  ElContainer,
  ElHeader,
  ElMain,
  ElFooter,
  ElDialog,
  ElMessage,
  ElMessageBox,
  ElLink,
  ElTag,
  ElRadioGroup,
  ElRadioButton,
} from 'element-plus';
import arrowUp from '#/assets/images/specialRunMode/arrow-up.png';
import iconTriangle from '#/assets/images/specialRunMode/icon-triangle.png';
import { Search, Download } from '@element-plus/icons-vue';
import {
  ref,
  reactive,
  computed,
  onMounted,
  onUnmounted,
  onActivated,
  onDeactivated,
  nextTick,
} from 'vue';
import moment from 'moment';
import { getDetectData } from '#/api';
import DetailOfDay from './detailOfDay.vue';
// import data1 from './test1.js';

const dialogData = ref({
  visible: false,
});

const currentSystemName = defineModel('title'); // 系统名称
const categoryUnitName = defineModel('categoryUnitName');
const sysType = defineModel('sysType');  // 系统类型
 
/**
 * 时刻判断
 */
const showDetectionTime = ref('');
const currentHour = ref('');
let intervalId2: any; // 定时器
const updateTime = () => {
  const now = moment();
  currentHour.value = now.hours();

  // 整点检测（每分钟的第0秒时检测一次是否是整点）
  if (now.minutes() === 0 && now.seconds() === 0) {
    getDetectDataByName();
  }
};

// 返回当前时刻显示类型
const getTimeType = (itemTime) => {
  const now = new Date();
  const itemHour = parseInt(itemTime.split(':')[0]);
  const hour = now.getHours();
  if (hour < itemHour) return 1; // 未来时刻
  if (hour === itemHour) return 2; // 当前时刻
  return 3; // 过去时刻
};

/**
 * 获取探测数据
 */
const systemInfo = reactive({
  systemName: '',
  systemImportanceLevel: '',
  categoryUnitName: '',
  businessDeptSystemResponsibleDeptName: '',
  deviceOwner: '',
  systemType: '',
  specialRunMode: '',
  specialRunModeDescription: '',
  url: '',
});
const tableData1 = ref([]);
async function getDetectDataByName() {
  const now = moment();
  // 生成整点时间字符串（YYYY-MM-DD HH:00:00）
  // showDetectionTime.value = now.format('YYYY-MM-DD HH:mm:ss');
  showDetectionTime.value = now.format('YYYY-MM-DD HH:00:00');

  try {
    const res = await getDetectData({ deploySystemName: currentSystemName.value, categoryUnitName: categoryUnitName.value, type:sysType.value });
    // const res = data1
    // 1. 更新右侧systemInfo的各个字段
    Object.assign(systemInfo, {
      systemName: res.systemName,
      systemImportanceLevel: res.systemImportanceLevel,
      categoryUnitName: res.categoryUnitName,
      businessDeptSystemResponsibleDeptName:
        res.businessDeptSystemResponsibleDeptName,
      deviceOwner: res.deviceOwner,
      systemType: res.systemType,
      specialRunMode: res.specialRunMode,
      specialRunModeDescription: res.specialRunModeDescription,
      url: res.url,
    });
    const sortedProbeList = [...res.modeProbeVOList].sort(
      (a, b) => a.hour - b.hour,
    );
    // 2. 更新左侧数据，处理modeProbeVOList数据并赋给tableData1
    tableData1.value = sortedProbeList.map((item) => ({
      ...item,
      time: `${item.hour}:00`,
      status: item.status === 0 ? '正常' : item.status === 1 ? '异常' : null,
      actualRunMode: item.probeResult === 0
          ? '关闭'
          : item.probeResult === 1
            ? '开放'
            : '无数据',
    }));
  } catch (error) {
    console.log('获取探测详情失败', error);
  }
}

onMounted(() => {
  getDetectDataByName();
  updateTime(); // 初始化时间
  // 每秒更新时间，确保高亮状态实时更新
  intervalId2 = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (intervalId2) clearInterval(intervalId2);
});

// 打开日历弹窗
const openDialog = () => {
  dialogData.value.visible = true;
};

// 手动探测
function startDetect() {
  // ElMessage.warning('暂未对接云盾，请等待！');
  const detectionUrl = systemInfo.url;
  window.open(detectionUrl, '_blank');
}
</script>

<template>
  <div class="custom flex" style="gap: 10px">
    <div
      style="
        flex: 1;
        border-radius: 5px;
        margin-top: 15px;
        padding-left: 10px;
        color: aliceblue;
      "
    >
      <div class="current-time">
        <div style="margin-top: 3px; width: fit-content">
          <span>最新探测时间: {{ showDetectionTime }}</span>
          <span style="margin-left: 15px"
            >探测结果:{{
              tableData1[currentHour]?.actualRunMode || '加载中'
            }}</span
          >
          <el-button class="calendar" @click="startDetect()">探测</el-button>
          <el-button class="calendar" @click="openDialog"
            >运行方式日历</el-button
          >
        </div>
      </div>
      <div class="card-grid">
        <div
          v-for="(item, index) in tableData1"
          :key="index"
          class="data-card"
          :class="{
            inactive: getTimeType(item.time) === 1,
            error:
              getTimeType(item.time) !== 1 && item.status==='异常',
          }"
          :style="{
            border: getTimeType(item.time) === 2 ? '2px solid #B27833' : '',
            borderRadius: getTimeType(item.time) === 2 ? '8px' : '',
            boxShadow:
              getTimeType(item.time) === 2 ? 'inset 0 0 5px #B27833' : 'none',
          }"
        >
          <!-- 探测正常 -->
          <div class="card-header">
            <div
              class="status-badge"
              :class="item.status === '异常' ? 'error' : 'success'"
              v-if="
                getTimeType(item.time) !== 1 "
            >         
              <!-- <span v-if="item.status !== null">{{item.status}}</span>
              <span v-else>{{item.status}}</span> -->
            </div>
            <div
              class="time"
              :style="{
                color: getTimeType(item.time) === 1 ? 'grey' : 'inherit',
                textShadow: 'none',
              }"
            >
              {{ item.time }}
              <span v-if="getTimeType(item.time) === 2" class="selected-card"
                >&#10004;</span
              >
            </div>
          </div>
          <!-- 过去探测时间 -->
          <div
            v-if="getTimeType(item.time) !== 1"
            style="display: flex; align-items: center"
            :style="{
              fontWeight: getTimeType(item.time) === 2 ? '800' : 'inherit',
            }"
          >
            <div style="width: 46px">
              <div class="plan-title" :title="item.runMode">计划</div>
              <div class="actual-title" :title="item.actualRunMode">实际</div>
            </div>
            <div style="width: 100%">
              <div
                class="plan-title truncate-text"
                :title="item.runMode"
                style="font-size: 14px; width: 100%"
              >
                {{ item.runMode || '无数据'}}
              </div>
              <div
                class="actual-title truncate-text"
                :title="item.actualRunMode"
                style="font-size: 14px; width: 100%"
              >
                {{ item.actualRunMode || '无数据' }}
              </div>
            </div>
          </div>
          <!-- 未来探测时间 -->
          <div v-if="getTimeType(item.time) === 1">
            <div
              class="value"
              :style="{
                color: getTimeType(item.time) === 1 ? 'grey' : 'inherit',
              }"
            >
              {{ item.runMode || '无数据' }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="flex: 0.85; margin-top: 55px">
      <div class="flex" style="align-items: center; padding-bottom: 15px">
        <div class="icon"></div>
        <div class="system-title">系统信息</div>
      </div>
      <el-form
        :model="systemInfo"
        label-width="120px"
        style="background: #122967; padding-top: 10px; height: 590px"
      >
        <el-form-item label="系统名称：">
          <span>{{ systemInfo.systemName }}</span>
        </el-form-item>
        <el-form-item label="关键等级：">
          <span>{{ systemInfo.systemImportanceLevel }}</span>
        </el-form-item>
        <el-form-item label="业务部门：">
          <span>{{ systemInfo.businessDeptSystemResponsibleDeptName }}</span>
        </el-form-item>
        <el-form-item label="所属单位：">
          <span>{{ systemInfo.categoryUnitName }}</span>
        </el-form-item>
        <el-form-item label="设备主人：">
          <span>{{ systemInfo.deviceOwner }}</span>
        </el-form-item>
        <el-form-item label="是否互联网：">
          <span>{{ systemInfo.systemType }}</span>
        </el-form-item>
        <el-form-item label="当前方式：">
          <span>{{ systemInfo.specialRunMode }}</span>
        </el-form-item>
        <el-form-item label="方式描述：">
          <span>{{ systemInfo.specialRunModeDescription }}</span>
        </el-form-item>
      </el-form>
    </div>
  </div>

  <el-dialog
    v-model="dialogData.visible"
    width="900"
    class="system-detail-dialog1"
    style="padding: 0 !important"
  >
    <template #header>
      <div class="dialog-header">
        <div class="dialog-title" style="margin-right: 50px; line-height: 1">
          {{currentSystemName }}日历
        </div>
      </div>
    </template>
    <div class="dialog-content">
      <DetailOfDay
        v-if="dialogData.visible"
        :systemName="currentSystemName"
        :categoryUnitName = "categoryUnitName"
      ></DetailOfDay>
    </div>
  </el-dialog>
</template>
<style lang="less" scoped>
// :deep(.el-overlay),
// :deep(.el-overlay-dialog) {
//   width: 100% !important;
//   top: 1px;
//   left: 1px;
// }
// 表单样式
.system-title {
  font-family:
    PingFang SC,
    PingFang SC;
  font-weight: 600;
  font-size: 17px;
  color: transparent;
  line-height: 17px;
  padding-left: 10px;
  background: linear-gradient(90deg, #ffffff 0%, #a3d5ff 98%);
  -webkit-background-clip: text; /* 仅渐变作用于文字 */
  background-clip: text; /* 标准语法 */
}
.icon {
  width: 5px;
  height: 15px;
  background: linear-gradient(180deg, #3a96ff 0%, #fcfeff 45%, #ffffff 100%),
    #f5faff;
  box-shadow: 0px 0px 8px 0px rgba(32, 169, 255, 0.84);
  border-radius: 0px 0px 0px 0px;
}
:deep(.el-form-item__label) {
  font-family:
    PingFang SC,
    PingFang SC;
  font-weight: 500;
  font-size: 15px;
  color: #ffffff;
}
:deep(.el-form-item__content) {
  font-family:
    PingFang SC,
    PingFang SC;
  font-weight: 400;
  font-size: 15px;
  color: #ffffff;
}

// 卡片样式
.current-time {
  margin-bottom: 10px;
  font-family:
    PingFang SC,
    PingFang SC;
  font-weight: 600;
  font-size: 18px;
  text-shadow:
    0px 0px 13px #008ee5,
    0px 7px 5px rgba(0, 0, 0, 0.55);
  text-align: left;
  font-style: normal;
  text-transform: none;
  color: #92caf7;
  line-height: 1.5;
  // display: flex;
  // justify-content: space-between;
  padding-right: 5px;

  // background: linear-gradient(90deg, #BFE7FF 0%, #3B9BF4 100%);
  // opacity: 0,1;
}
.card-grid {
  // display: grid;
  // grid-gap: 10px;
  // gap: 10px;
  // grid-template-columns: repeat(5, 1fr);
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  height: 650px;
  overflow-y: auto;
}

.data-card {
  height: 117px;
  // min-width: 150px;
  width: 150px;
  // width: 180px;
  border-radius: 4px;
  text-align: center;
  position: relative;
  background: url('../../../../assets/images/specialRunMode/bg-zhengchang4.png')
    100% no-repeat;
  background-size: 100% 100%;
  
}

.data-card.success {
  background: url('../../../../assets/images/specialRunMode/bg-zhengchang4.png')
    100% no-repeat;
  background-size: 100% 100%;
}

.data-card.error {
  background: url('../../../../assets/images/specialRunMode/bg-yichang.png')
    100% no-repeat;
  background-size: 100% 100%;
}
.data-card.unableDetect {
  background:
    linear-gradient(rgba(255, 255, 255, 0.1), rgba(129, 139, 165, 0.9)),
    url('../../../../assets/images/specialRunMode/bg-unableDetect.png') 100%
      no-repeat;
  background-size: 100% 100%;
}
.data-card.currentUnableDetect {
  background:
    linear-gradient(rgba(255, 255, 255, 0.5), rgba(228, 229, 233, 0.6)),
    url('../../../../assets/images/specialRunMode/bg-unableDetect.png') 100%
      no-repeat;
  background-size: 100% 100%;
  // border: 1px !important;
  box-shadow: 0 0 1px 1px rgba(248, 248, 249, 0.9) !important;
}
.data-card.inactive {
  background: url('../../../../assets/images/specialRunMode/bg-incative.png')
    100% no-repeat;
  // background: url('../../../../assets/images/specialRunMode/bg-weitance1.png')
  //   100% no-repeat;
  background-size: 100% 100%;
  color: #fff;
}
.data-card.currentActiveNormal {
  background: url('../../../../assets/images/specialRunMode/bg-zhengchang3.png')
    100% no-repeat;
  // background: url('../../../../assets/images/specialRunMode/bg-yichang.png')
  // 100% no-repeat;
  background-size: 100% 100%;
  color: #fff;
}
.data-card.currentActiveError {
  background: url('../../../../assets/images/specialRunMode/bg-erroractive.png')
    100% no-repeat;
  background-size: 100% 100%;
  color: #fff;
}

.card-header {
  height: 23px;
  width: 100%;
}

.time {
  position: relative;
  // top: 4px;
  // left: 60px;
  width: 100%;
  // width: calc(100% - 36px);
  // margin-top: 4px;
  padding-top: 6px;
  height: 18px;
  font-family:
    PingFang SC,
    PingFang SC;
  font-weight: 800;
  font-size: 15px;
  color: #ffffff;
  letter-spacing: 1px;
  text-shadow: 0px 0px 4px rgba(255, 255, 255, 0.51);
  text-align: center;
  font-style: normal;
  text-transform: none;
  .selected-card {
    position: absolute;
    right: 5px;
    // color: #002d78;
    color: #41b883;
  }
}

.value {
  height: 94px;
  display: flex;
  justify-content: center; // 水平居中
  align-items: center; // 垂直居中
  color: #ffc65c;
  text-shadow: 0px 4px 4px rgba(255, 181, 34, 0.25);
  font-family:
    PingFang SC,
    PingFang SC;
  font-weight: 500;
  font-size: 14px;
}

.value.warn {
  color: #f56c6c;
}

.status-badge {
  position: absolute;
  top: 6px;
  left: 9px;
  // width: 36px;
  // margin-top: 5px;
  font-family:
    PingFang SC,
    PingFang SC;
  font-weight: 500;
  font-size: 15px;
  color: #ffffff;
  text-align: center;
  font-style: normal;
  text-transform: none;
  // padding: 2px 4px;
  // border-radius: 3px;
}

.plan-title {
  height: 52px;
  line-height: 52px;
  // text-align: center;
  font-size: 13px;
  padding-left: 5px;
  color: rgba(255, 255, 255, 0.5);
  text-shadow: inset 0px 0px 4px rgba(255, 255, 255, 0.47);
}

.actual-title {
  height: 42;
  line-height: 42px;
  font-size: 13px;
  padding-left: 5px;
}

.calendar {
  font-weight: 500;
  font-size: 14px;
  margin-left: 15px;
  height: 28px;
  color: #ffffff;
  // background-color: #2D71C7;
  border-radius: 5px;
  border: none;
  background: linear-gradient(to top, #1652b4, #438ed7);
}

// .status-badge.success {
//   // background: #f0f9eb;
//   // color: #67c23a;
// }

// .status-badge.error {
//   // background: #fef0f0;
//   // color: #f56c6c;
// }

// 表格弹窗样式
.custom-table :deep(.warning-row) {
  color: #e6a23c !important; /* Element Plus 的 warning 颜色 */
  font-weight: bold;
}

/* 可选：悬停时加深背景色 */
// .custom-table :deep(.warning-row:hover > td),
// .custom-table :deep(.el-table__row--striped.warning-row:hover > td) {
//   color: #e6a23c !important;
//   background-color: #fdf6ec !important;
// }

.el-table--fit {
  background-color: #0d2461;
  border: 1px solid #0245a3 !important;
}

.dialog-header {
  padding: 5px !important;
  margin-bottom: 10px;
  width: 100%;
  height: 50px;
  background-color: #002d78;
  background: url('../../../../assets/images/specialRunMode/header-bg.png') 100%
    no-repeat;
  background-size: 100% 100%;
  .dialog-title {
    margin: 5px 0px 0 5px;
    font-size: 24px;
    font-weight: 500;
    text-align: center;
    color: white;
  }
}
.dialog-content {
  padding: 16px;
  // height: 460px;
}

.run-mode-desc {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /* 限制显示行数 */
  overflow: hidden;
  text-overflow: ellipsis;
}

:deep(.el-table__header-wrapper) {
  // border-top: 1px solid rgba(90, 181, 255, 0.23);
  border-top: 0px solid rgb(90, 181, 255, 0.1) !important;
}
:deep(.el-dialog .el-dialog__header) {
  padding: 0 !important;
}

.system-detail-dialog1 {
  :deep(.el-dialog) {
    padding: 40px !important;
  }
}

.custom {
  /* 表头样式 */
  :deep(.el-table__header) th {
    background-color: #002d78 !important; /* 表头背景色 */
    // box-shadow: inset 0px -25px 38px 0px rgba(0, 132, 255, 0.67);
    color: white; /* 表头文字颜色 */
  }
  /* 表体样式 */
  :deep(.el-table__body) tr {
    background-color: #012462; /* 表体背景色 */
    color: #fff; /* 表体文字颜色 */
  }
}

.truncate-text {
  white-space: nowrap; /* 禁止换行 */
  overflow: hidden; /* 隐藏超出部分 */
  text-overflow: ellipsis; /* 超出部分显示省略号 */
  max-width: 90px; /* 限制最大宽度（可调整） */
  display: inline-block; /* 确保宽度生效 */
}
</style>
