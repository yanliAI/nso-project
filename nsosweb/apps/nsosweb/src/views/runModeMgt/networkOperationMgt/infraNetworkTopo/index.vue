<script setup lang="ts">
import type { EchartsUIType } from '@vben/plugins/echarts';
import { EchartsUI, useEcharts } from '@vben/plugins/echarts';
import { onMounted, ref, reactive } from 'vue';
import { downloadFile } from '#/utils/download.ts';
import {
  deleteMonitorSq,
  getmonitorSq,
  insertMonitorSq,
  downloadDrawingApi,
} from '#/api';
import {
  ElTable,
  ElTableColumn,
  ElContainer,
  ElFormItem,
  ElDialog,
  ElForm,
  ElInput,
  ElButton,
  ElSelect,
  ElCard,
  ElRow,
  ElCol,
  ElTabs,
  ElEmpty,
  ElPagination,
  ElMessage,
  ElMessageBox,
  ElDescriptions,
  ElDescriptionsItem,
  type FormInstance,
} from 'element-plus';
import moment from 'moment';
import { Download, Menu, Location } from '@element-plus/icons-vue';
import topoDetail from './topoDetail.vue';
import {
  getTopoModeStatic,
  getTopoalarmInfo,
  getTopoElementStatic,
} from '#/api';
import Panzoom from '@panzoom/panzoom';
import alamDetail from './alamDetail.vue';
import svgImage from '#/assets/images/example.svg';
const lineChartRef = ref<EchartsUIType>();

const { renderEcharts: renderLineChart } = useEcharts(lineChartRef);
const dialogData = ref(false);
const alamDialogData = ref(false);
const detailContent = ref('');
const chartData = ref<any[]>([]);
const alarmData = ref<any[]>([]);
const wheelConRef = ref();
// 拖拽、缩放对象
const panzoom = ref(null);
// 当前缩放比例
const currentScale = ref(1);
const svgContent = ref('');
const svgConRef = ref();
const svgCon = ref();
const svgTransform = reactive({
  scaleX: 1,
  scaleY: 1,
});
const mainCon = ref();
const loading = ref(false);
const now = moment().format('YYYY-MM-DD');
// 角标数据
let louDongBadgeData = ref([]);
let louDongTipIds = ref([]);

// 颜色配置
const colors = ['#6295FA', '#63D9AA', '#637596'];

const modelOneSum = ref(0);
const modelTwoSum = ref(0);
const modelThreeSum = ref(0);
const sqList = ref([]);
const selectedSqId = ref('');
onMounted(() => {
  queryStaticData();
  queryAlarmInfo();
  queryElementInfo();
  queryData();
});

// 查询设施数据
async function queryData() {
  try {
    const res = await getmonitorSq({});
    if (res) {
      sqList.value = res.list;
    }
  } catch (error) {
    console.error('查询数据失败:', error);
  }
}

// 获取左上角统计数据
async function queryStaticData() {
  modelOneSum.value = 0;
  modelTwoSum.value = 0;
  modelThreeSum.value = 0;
  try {
    const res = await getTopoModeStatic();
    if (res) {
      chartData.value = res;
      for (let i = 0; i < res.length; i++) {
        modelOneSum.value += Number(res[i].modeOneCount);
        modelTwoSum.value += Number(res[i].modeTwoCount);
        modelThreeSum.value += Number(res[i].modeThreeCount);
      }
      drawBarChart();
    }
  } catch (error) {
    console.error('查询数据失败:', error);
  }
}

// 获取右上角统计数据
async function queryAlarmInfo() {
  try {
    const res = await getTopoalarmInfo();
    if (res) {
      alarmData.value = res;
    }
  } catch (error) {
    console.error('查询数据失败:', error);
  }
}

// 获取图元统计数据
async function queryElementInfo() {
  try {
    const res = await getTopoElementStatic();
    if (res) {
      // alarmData.value = res;
      if (res.length === 0) return;
      for (let i = 0; i < res.length; i++) {
        louDongTipIds.value.push({
          id: res[i].elementId,
          number: res[i].alertCount,
        });
      }
      updateLouDongBadgeData();
      // console.log('wwww',louDongBadgeData.value)
    }
  } catch (error) {
    console.error('查询数据失败:', error);
  }
}

const updateLouDongBadgeData = () => {
  louDongBadgeData.value = [];
  if (!svgCon.value) {
    return;
  }
  louDongBadgeData.value = louDongTipIds.value
    .filter((item) => {
      // console.log(svgCon.value.querySelector(`g[data-cell-id="${item.id}"]`))
      return svgCon.value.querySelector(`g[data-cell-id="${item.id}"]`);
    })
    .map((item) => {
      // 查找指定g标签
      const targetG = svgCon.value.querySelector(
        `g[data-cell-id="${item.id}"]`,
      );
      let position = {};
      const parentRect = mainCon.value.getBoundingClientRect();
      const gEles = targetG.querySelectorAll('g');
      const rect = gEles[0].getBoundingClientRect();
      let x = Number.parseFloat(rect.left - parentRect.left) - 4;
      let y = Number.parseFloat(rect.top - parentRect.top) - 4;
      if (gEles.length > 1) {
        x -= 4;
        // y += 5;
      }
      const width = Number.parseFloat(rect.width);
      position = {
        x: x,
        y: y,
      };
      return {
        showLabel: true,
        labelPosition: position,
        id: item.id,
        count: item.number,
      };
    });
};

// 绘制柱状图
function drawBarChart() {
  const xAxisData = chartData.value.map((item) => item.time);
  const seriesData = [
    {
      name: '运调监测',
      type: 'bar',
      data: chartData.value.map((item) => item.modeOneCount),
      itemStyle: { color: colors[0] },
      barWidth: '20%',
    },
    {
      name: '运维发现',
      type: 'bar',
      data: chartData.value.map((item) => item.modeTwoCount),
      itemStyle: { color: colors[1] },
      barWidth: '20%',
    },
    {
      name: '运服保障',
      type: 'bar',
      data: chartData.value.map((item) => item.modeThreeCount),
      itemStyle: { color: colors[2] },
      barWidth: '20%',
    },
  ];

  renderLineChart({
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    legend: {
      data: ['运调监测', '运维发现', '运服保障'],
      right: '30%',
      top: 0,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      axisLabel: {
        interval: 0,
        rotate: 30, // 如果标签过长可以旋转
      },
    },
    yAxis: {
      type: 'value',
      name: '数量',
      axisLine: { show: true },
      axisTick: { show: true },
    },
    series: seriesData,
  });
}

// 打开弹窗
const eleId = ref('');
function opendetail(item) {
  eleId.value = item.id;
  dialogData.value = true;
}


// 打开详情弹窗
function openDeatilDialog(item){
  detailContent.value = item;
  alamDialogData.value = true;

}
/**
 * 拓扑图处理
 */
// 加载本地文件
// async function loadImage() {
//   loading.value = true;
//   // 加载本地默认布防图文件
//   const response = await fetch(svgImage);
//   svgContent.value = await response.text();
//   loading.value = false;
//   if (svgCon.value) {
//     svgCon.value.innerHTML = svgContent.value;
//     // leftTopData.value.visible = true;
//     caleSvgScale();
//   }
//   getPanzoomElement();
// }

// 查看图纸
async function showImg() {
  if (svgCon.value) {
    svgCon.value.innerHTML = '';
  }
  const router = sqList.value.find((item) => {
    return item.sqId === selectedSqId.value;
  })?.drawingRoute;
  if (router && router !== '') {
    try {
      loading.value = true;
      let result = await downloadDrawingApi(router);
      const { data, status } = result;

      if (status >= 200 && status < 400) {
        // 将 &quot; 转为 "
        svgContent.value = data.replace(/&quot;/g, '"');
        if (svgCon.value) {
          svgCon.value.innerHTML = svgContent.value;
        }
        caleSvgScale();
      } else {
        ElMessage.error('图纸获取失败');
      }
      loading.value = false;
      getPanzoomElement();
    } catch (error) {
      console.log('error==', error);
      loading.value = false;
    }
  } else {
    ElMessage.warning('当前设施图纸不存在!')
  }
}

// 监听鼠标滚轮
const wheel = (event) => {
  event.preventDefault();
  panzoom.value.zoomWithWheel(event);
  currentScale.value = panzoom.value.getScale();
};

const caleSvgScale = () => {
  if (!svgContent.value) {
    return;
  }

  const matchWidth = svgContent.value.match(/width="([^"]*)"/);
  const matchHeight = svgContent.value.match(/height="([^"]*)"/);
  if (matchWidth && matchHeight) {
    let widthStr = matchWidth[1]?.replace('px', ''); // "1215px"
    let heightStr = matchHeight[1]?.replace('px', ''); // "615px"
    let rect = wheelConRef.value.getBoundingClientRect();
    // console.log('rect==', rect);
    // 计算缩放比例
    let scaleX = rect.width / Number(widthStr);
    let scaleY = rect.height / Number(heightStr);
    // console.log('scaleX==', scaleX, 'scaleY==', scaleY);
    svgTransform.scaleX = scaleX;
    svgTransform.scaleY = scaleY;
  }
};

// 拖动方法
const getPanzoomElement = () => {
  // 存放Panzoom用于后面的其他操作
  panzoom.value = Panzoom(wheelConRef.value, {
    origin: '0 0', // 位置
    // maxScale: 3, // 最大比例,默认值：4
    // minScale: 0, // 最小比例,默认值：0.125
    cursor: 'auto',
    disableZoom: false, // 禁止缩放
    disablePan: false, //禁止平移
    startScale: Math.max(svgTransform.scaleX, svgTransform.scaleY),
    startX: 0,
    startY: 0,
    overflow: 'hidden', // 溢出
    canvas: true, // 是否视为canvas
    setTransform: (elem, { scale, x, y }) => {
      // elem.style.transform = `translate(${x}px, ${y}px) scaleX(${scale})`;
      // elem.style.transform = `scaleX(${svgTransform.scaleX}) scaleY(${svgTransform.scaleY})`;

      // elem.style.transformOrigin = 'left top';

      panzoom.value.setStyle(
        'transform',
        `scale(${scale}) translate(${x}px, ${y}px)`,
      );
    },
  });
  // event 事件监听
  const elem = wheelConRef.value;
  elem.addEventListener('panzoomchange', (event) => {
    // console.log('panzoomchange', event);
    updateLouDongBadgeData();
  });
};
</script>

<template>
  <div class="h-full" style="padding: 5px">
    <div class="header">
      <el-button style="background: #1e79f7; color: white"
        >网络拓扑航班展示</el-button
      >
    </div>
    <div>
      <div class="first-container">
        <div
          class="child-item"
          style="display: flex; align-items: center; justify-content: center"
        >
          <div style="height: 100%; width: 100px; text-align: center">
            <div
              style="
                margin: 15px auto;
                font-weight: 700;
                font-size: 18px;
                color: black;
              "
            >
              {{ now }}
            </div>
            <div
              style="
                margin: 20px auto 10px auto;
                font-size: 20px;
                font-weight: 700;
              "
            >
              {{ modelOneSum }}
            </div>
            <div style="margin: 0 auto 20px auto">运调监测</div>
            <div style="margin: 10px auto; font-size: 20px; font-weight: 700">
              {{ modelTwoSum }}
            </div>
            <div style="margin: 0 auto 20px auto">运维发现</div>
            <div style="margin: 10px auto; font-size: 20px; font-weight: 700">
              {{ modelThreeSum }}
            </div>
            <div style="margin: 0 auto">运服保障</div>
          </div>
          <EchartsUI
            ref="lineChartRef"
            style="width: calc(100% - 100px); height: 100%"
          />
        </div>
        <div class="child-item" style="overflow-y: auto">
          <div class="title">告警信息</div>
          <div v-if="alarmData.length == 0">
            <el-empty description="暂无今日告警" :image-size="100" />
          </div>
          <div v-else v-for="(item, index) in alarmData">
            <div class="first-row">
              <div style="">
                <span style="cursor: pointer;" @click="openDeatilDialog(item)">【{{ item.alarmSqId }}】</span>
                <span>{{ item.alarmTime }}</span>
              </div>
              <div
                style="text-align: right; display: flex; align-items: center"
              >
                <!-- <span>{{ item.alarmSqName }}</span> -->
                <span style="margin: 0 5px"
                  ><el-tag effect="dark" type="primary" style="border-radius: 0"
                    >{{ item.alarmKeepTime }}小时</el-tag
                  ></span
                >
                <span style="margin: 0 10px"
                  ><el-tag
                    effect="dark"
                    type="warning"
                    style="border-radius: 0"
                    >{{ item.alarmLevel }}</el-tag
                  ></span
                >
                <span style="color: #323639">
                  {{ item.sqIp }}
                </span>
                <span
                  ><el-icon
                    color="#323639"
                    style="margin-left: 10px; font-size: 20px"
                    ><Location /></el-icon
                ></span>
              </div>
            </div>
            <div class="second-row">
              <span>{{ item.alarmContext }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="second-container">
        <div
          style="
            height: 50px;
            width: 100%;
            border-bottom: 1px solid #e1dcdc;
            display: flex;
            align-items: center;
            justify-content: flex-end;
          "
        >
          <el-select
            v-model="selectedSqId"
            placeholder="请选择设施"
            style="width: 200px"
          >
            <el-option
              v-for="item in sqList"
              :key="item.sqId"
              :label="item.sqName"
              :value="item.sqId"
            />
          </el-select>
          <el-button type="primary" style="margin-left: 10px" @click="showImg"
            >查询</el-button
          >
        </div>
        <div
          style="width: 100%; height: 450px; position: relative; cursor: grab"
          ref="mainCon"
          v-loading="loading"
        >
          <div
            ref="wheelConRef"
            @wheel="wheel"
            class="wheel-con"
            style="height: 400px"
          >
            <div id="svg" ref="svgCon" style="height: 100%"></div>
          </div>
          <div v-if="!svgContent" class="my-empty-con">
            <el-empty description="未加载到拓扑数据" :image-size="100" />
          </div>
          <!-- 角标 动态标签（HTML 绝对定位层） -->
          <div
            v-for="(item, index) in louDongBadgeData"
            :key="index"
            class="dynamic-label"
            :style="{
              left: `${item.labelPosition.x - 10}px`,
              top: `${item.labelPosition.y - 20}px`,
              '--scale-factor': currentScale, // 动态绑定 CSS 变量
            }"
            @click="opendetail(item)"
          >
            <div class="label-bg">
              <span class="label-text">{{ item.count }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ElDialog
      v-model="dialogData"
      width="1600"
      class="system-detail-dialog"
      @close="dialogData = false"
    >
      <topoDetail v-if="dialogData" :eleId="eleId"></topoDetail>
    </ElDialog>
      <ElDialog
      v-model="alamDialogData"
      width="1000"
      title="告警详情"
      class="system-detail-dialog"
      @close="alamDialogData = false"
    >
      <alamDetail v-if="alamDialogData" :detailContent="detailContent"></alamDetail>
    </ElDialog>
  </div>
</template>

<style lang="less" scoped>
.header {
  height: 35px;
}
.first-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: space-between;
  height: 300px;
  margin-bottom: 5px;

  .child-item {
    height: 100%;
    flex: 1;
    min-width: 300px;
    background-color: white;
    padding: 10px;
    overflow: auto; /* 允许滚动 */
    scrollbar-width: none; /* Firefox */
    // border-radius: 8px;
    // margin: 10px;
    // > div {
    //   width: 100%;
    //   height: 100%;
    // }
    .title {
      margin: 0 15px;
      padding: 5px 10px 5px 0px;
      color: black;
      font-weight: 600;
      height: 30px;
      font-size: 18px;
    }
    .first-row {
      // padding: 7px 0;
      // margin:0 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 30px;
      color: black;
      font-weight: 500;
      font-size: 16px;
    }
    .second-row {
      font-size: 16px;
      // margin:0 10px;
      padding: 5px 10px 12px 30px;
      color: #7f818b;
      border-bottom: 1px solid rgb(225, 220, 220);
      font-weight: 500;
    }
  }
  .child-item::-webkit-scrollbar {
    display: none;
  }
}

.dynamic-label {
  position: absolute;
  /* 避免遮挡 SVG 交互 */
  /* pointer-events: none; */
  cursor: pointer;
  width: 20px;
  height: 20px;
  text-align: center;
  background-color: #3f92fe;
  border-radius: 50% 50% 0 50%;
}
.label-bg {
  color: aliceblue;
  // margin-top: 3px;
  height: 100%;
  width: 100%;
  border-radius: 50%;
  // border: 1px solid gainsboro;
  background: #f56c6c;
}
// 第一个容器特殊布局
.first-container {
  border-bottom: 2px solid #f0f0f0;
  //  & :nth-child(1) {
  //    flex: 1;
  //  }
  //  & :nth-child(2) {
  //    flex: 1;
  //  }
}
.second-container {
  min-height: 500px;
  background-color: white;
  // margin: 0 10px;

  .my-empty-con {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    // background-color: #bebcbc;
    :deep(.el-empty) {
      height: 100%;
    }
    :deep(.el-empty__description) p {
      font-size: 20px;
      color: #666;
    }
  }
}
</style>
