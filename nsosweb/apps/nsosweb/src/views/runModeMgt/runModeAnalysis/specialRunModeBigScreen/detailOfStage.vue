<script setup lang="ts">
import {
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
import { Search, Download, Top, Bottom } from '@element-plus/icons-vue';
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

// 2. 定义图表数据
const seriesNames = ['正常', '限时', '白名单', '限时白名单', '下线'];
const xAxisData = [
  '广东电网',
  '云南电网',
  '贵州电网',
  '总部',
  '深圳供电局',
  '鼎和保险',
  '超高压',
  '海南电网',
  '广西电网',
  '科研院',
  '国际公司',
  '数字集团',
  '能源院',
  '能源公司',
  '供应链集团',
  '广州电力交易中心',
  '北京分公司',
  '鼎元资产',
  '资本控股',
  '财务公司',
];

// 简化数据结构，去除不必要的嵌套
const dataSets = [
  // 数据集1
  [
    [
      345, 436, 657, 897, 367, 653, 489, 378, 589, 366, 786, 456, 678, 789, 879,
      654, 689, 368, 876, 663,
    ], // 正常
    [
      210, 410, 650, 890, 360, 650, 780, 370, 480, 360, 780, 250, 670, 780, 670,
      650, 680, 360, 870, 689,
    ], // 限时
    [
      200, 410, 650, 700, 360, 650, 509, 370, 480, 360, 900, 500, 670, 400, 670,
      650, 300, 360, 500, 366,
    ], // 白名单
    [
      478, 467, 356, 466, 360, 356, 780, 589, 480, 588, 780, 500, 670, 222, 670,
      650, 499, 360, 200, 355,
    ], // 限时白名单
    [
      356, 222, 650, 600, 455, 222, 555, 370, 333, 360, 222, 250, 367, 256, 788,
      444, 467, 466, 246, 764,
    ], // 下线
  ],
  // 数据集2（与数据集1相同，实际使用时可以不同）
  [
    [
      345, 436, 657, 897, 367, 653, 489, 378, 589, 366, 786, 456, 678, 789, 879,
      654, 689, 368, 876, 663,
    ], // 正常
    [
      210, 410, 650, 890, 360, 650, 780, 370, 480, 360, 780, 250, 670, 780, 670,
      650, 680, 360, 870, 689,
    ], // 限时
    [
      200, 410, 650, 700, 360, 650, 509, 370, 480, 360, 900, 500, 670, 400, 670,
      650, 300, 360, 500, 366,
    ], // 白名单
    [
      478, 467, 356, 466, 360, 356, 780, 589, 480, 588, 780, 500, 670, 222, 670,
      650, 499, 360, 200, 355,
    ], // 限时白名单
    [
      356, 222, 650, 600, 455, 222, 555, 370, 333, 360, 222, 250, 367, 256, 788,
      444, 467, 466, 246, 764,
    ], // 下线
  ],
];

// 3. 定义颜色数组，确保每种系列都有对应颜色
// const colors = [
//   '#00F5FF', // 正常（霓虹青）
//   '#3A7BFF', // 限时（宝石蓝）
//   '#FFD700', // 白名单（金属金）
//   '#C77DFF', // 限时白名单（薰衣草紫）
//   '#FF4D4D'  // 下线（警示红）
// ];
// ['#02BA8F', '#5CB6FF', '#FFC65C', '#834EFF', '#FF5C5C'];
function getColor(index) {
  const gradients = [
    'linear-gradient(180deg, #00D0FF 0%, #007D99 100%)',
    'linear-gradient(180deg, #0084FF 0%, #004F99 100%)',
    'linear-gradient( 180deg, #FFD900 0%, #998200 100%)',
    'linear-gradient( 180deg, #8800FF 0%, #520099 100%)',
    'linear-gradient( 156deg, rgba(255,0,0,0.9) 0%, #990000 100%)',
  ];

  const borders = [
    '2px solid rgba(0,178,230,1)',
    '2px solid #3A7BFF',
    '2px solid #FFD700',
    '2px solid #C77DFF',
    '2px solid #FF4D4D',
  ];
  const shadows = [
    '0 0 8px rgba(0, 213, 255, 0.6)', // 浅蓝色阴影
    '0 0 8px rgba(58, 123, 255, 0.6)', // 蓝色阴影
    '0 0 8px rgba(255, 215, 0, 0.6)', // 金色阴影
    '0 0 8px rgba(199, 125, 255, 0.6)', // 紫色阴影
    '0 0 8px rgba(255, 77, 77, 0.6)', // 红色阴影
  ];

  return {
    border: borders[index % borders.length],
    boxShadow: shadows[index % shadows.length],
    backgound: '#051B40',
  };
}
onMounted(() => {});
const tableData = ref([]);
// for(let i=0;i<xAxisData.length;i++) {
//   tableData.value.push({
//     company: xAxisData[i],
//     oneData: ['30','78','90','50','45'],
//     twoData: ['50','78','79','50','70'],
//     threeData: ['50','78','79','50','70'],
//     thirdData: ['30','78','89','50','66'],
//     fourData: ['30','67','90','50','45'],
//   })
// }
for (let i = 0; i < xAxisData.length; i++) {
  // 1. 随机生成一个基准总和（例如 100~500 之间的随机数）
  const totalValue = Math.floor(Math.random() * 400) + 100;

  // 2. 生成随机数组，并确保总和等于 totalValue
  const generateBalancedArray = (length) => {
    const arr = Array.from({ length: length - 1 }, () =>
      Math.floor(Math.random() * 100),
    );
    const sum = arr.reduce((a, b) => a + b, 0);
    const lastValue = Math.max(0, totalValue - sum); // 确保最后一个值非负
    return [...arr, lastValue];
  };

  // 3. 生成数据
  tableData.value.push({
    company: xAxisData[i],
    oneData: generateBalancedArray(5),
    twoData: generateBalancedArray(5),
    threeData: generateBalancedArray(5),
    thirdData: generateBalancedArray(5),
    fourData: generateBalancedArray(5),
  });
}

const labels = ['正常', '限时', '白名单', '限时白名单', '下线'];

const tooltipContent = (data, index) => {
  return `
    <div style="padding: 5px; min-width: 120px;">
      <div style="display: flex; flex-direction: column; gap: 3px;">
        <div style="display: flex; justify-content: space-between;">
          <span>正常:</span>
          <span style="font-weight: bold;">${data[0]}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>限时:</span>
          <span style="font-weight: bold;">${data[1]}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>白名单:</span>
          <span style="font-weight: bold;">${data[2]}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>限时白名单:</span>
          <span style="font-weight: bold;">${data[3]}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>下线:</span>
          <span style="font-weight: bold;">${data[4]}</span>
        </div>
      </div>
    </div>
  `;
};
</script>

<template>
  <div class="flex" style="gap: 15px; margin-right: 30px; margin-top: 20px">
    <el-table
      :data="tableData"
      border
      stripe
      style="width: 100%"
      height="750px"
    >
      <el-table-column align="center" width="120px">
        <template #header> 单位 </template>
        <template #default="scope">
          <div
            style="font-weight: 400; font-family: 'Microsoft YaHei', sans-serif"
          >
            {{ scope.row.company }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="攻击阶段1.0">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-popover
              v-for="(item, index) in scope.row.oneData"
              :key="index"
              placement="top"
              content="攻击阶段1.0"
              :width="190"
              popper-class="stage-tooltip"
              effect="light"
            >
              <template #reference>
                <div
                  :style="{
                    opacity: '0.9',
                    cursor: 'pointer',
                  }"
                >
                  <div style="text-align: center; font-size: 15px">
                    {{ item }}
                  </div>
                  <div
                    :style="{
                      ...getColor(index),
                      color: 'aliceblue',
                      width: item + 'px',
                      'min-width': '20px',
                      'max-width': '80px',
                      height: '7px',
                      cursor: 'pointer',
                      opacity: '0.9',
                      position: 'relative',
                    }"
                  ></div>
                </div>
              </template>
              <div
                style="
                  color: #ffffff;
                  text-align: center;
                  font-size: 14px;
                  font-weight: 400;
                "
              >
                运行方式
              </div>
              <div
                v-for="(modelItem, modelIndex) in seriesNames"
                style="
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  color: #ffffff;
                  margin-top: 10px;
                "
              >
                <div>{{ modelItem }}</div>
                <div>{{ scope.row.oneData[modelIndex] }}</div>
              </div>
            </el-popover>
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center" label="攻击阶段2.0">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-popover
              v-for="(item, index) in scope.row.twoData"
              :key="index"
              placement="top"
              :width="190"
              popper-class="stage-tooltip"
              effect="light"
            >
              <template #reference>
                <div
                  :style="{
                    opacity: '0.9',
                    cursor: 'pointer',
                  }"
                >
                  <div style="text-align: center; font-size: 15px">
                    {{ item }}
                  </div>
                  <div
                    :style="{
                      ...getColor(index),
                      color: 'aliceblue',
                      width: item + 'px',
                      'min-width': '20px',
                      'max-width': '80px',
                      height: '7px',
                      cursor: 'pointer',
                      opacity: '0.9',
                      position: 'relative',
                    }"
                  ></div>
                </div>
              </template>
              <div
                style="
                  color: #ffffff;
                  text-align: center;
                  font-size: 14px;
                  font-weight: 400;
                "
              >
                运行方式
              </div>
              <div
                v-for="(modelItem, modelIndex) in seriesNames"
                style="
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  color: #ffffff;
                  margin-top: 10px;
                "
              >
                <div>{{ modelItem }}</div>
                <div>{{ scope.row.twoData[modelIndex] }}</div>
              </div>
            </el-popover>
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center" label="攻击阶段3.0">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-popover
              v-for="(item, index) in scope.row.threeData"
              :key="index"
              placement="top"
              :width="190"
              popper-class="stage-tooltip"
              effect="light"
            >
              <template #reference>
                <div
                  :style="{
                    opacity: '0.9',
                    cursor: 'pointer',
                  }"
                >
                  <div style="text-align: center; font-size: 15px">
                    {{ item }}
                  </div>
                  <div
                    :style="{
                      ...getColor(index),
                      color: 'aliceblue',
                      width: item + 'px',
                      'min-width': '20px',
                      'max-width': '80px',
                      height: '7px',
                      cursor: 'pointer',
                      opacity: '0.9',
                      position: 'relative',
                    }"
                  ></div>
                </div>
              </template>
              <div
                style="
                  color: #ffffff;
                  text-align: center;
                  font-size: 14px;
                  font-weight: 400;
                "
              >
                运行方式
              </div>
              <div
                v-for="(modelItem, modelIndex) in seriesNames"
                style="
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  color: #ffffff;
                  margin-top: 10px;
                "
              >
                <div>{{ modelItem }}</div>
                <div>{{ scope.row.threeData[modelIndex] }}</div>
              </div>
            </el-popover>
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center" label="攻击阶段4.0">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-popover
              v-for="(item, index) in scope.row.fourData"
              :key="index"
              placement="top"
              :width="190"
              popper-class="stage-tooltip"
              effect="light"
            >
              <template #reference>
                <div
                  :style="{
                    opacity: '0.9',
                    cursor: 'pointer',
                  }"
                >
                  <div style="text-align: center; font-size: 15px">
                    {{ item }}
                  </div>
                  <div
                    :style="{
                      ...getColor(index),
                      color: 'aliceblue',
                      width: item + 'px',
                      'min-width': '20px',
                      'max-width': '80px',
                      height: '7px',
                      cursor: 'pointer',
                      opacity: '0.9',
                      position: 'relative',
                    }"
                  ></div>
                </div>
              </template>
              <div
                style="
                  color: #ffffff;
                  text-align: center;
                  font-size: 14px;
                  font-weight: 400;
                "
              >
                运行方式
              </div>
              <div
                v-for="(modelItem, modelIndex) in seriesNames"
                style="
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  color: #ffffff;
                  margin-top: 10px;
                "
              >
                <div>{{ modelItem }}</div>
                <div>{{ scope.row.fourData[modelIndex] }}</div>
              </div>
            </el-popover>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<style lang="less" scoped>
:deep(.el-table .el-table__cell) {
  background: #002d78;
  // background: #051B40;
  color: #f5faff;
  height: 100px;
  padding: 0px 0 !important;
  // border-bottom: none !important;
}
:deep(.el-table .cell) {
  font-size: 15px !important;
  // padding: 0 !important;
}
:deep(.el-table__header) th {
  background: linear-gradient(to bottom, #013a92, #0163cf) !important;
  font-size: 20px !important;
  height: 40px !important;
  color: #ffffff !important;
  font-weight: 600 !important;
  font-family: Microsoft YaHei;
}
// 表格底部白线
:deep(.el-table__inner-wrapper:before) {
  height: 0px;
}
:deep(.el-table__header-wrapper) {
  border-top: none !important;
}
:deep(.el-table__body-wrapper) {
  border-bottom: #0c347d 1px solid !important;
}

.box {
  margin: 15px;
  height: 370px;
  width: 100%;
  color: aliceblue;
  .box-title {
    height: 30px;
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

    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  .title-icon {
    width: 5px;
    height: 17px;
    background: linear-gradient(180deg, #3a96ff 0%, #fcfeff 45%, #ffffff 100%),
      #f5faff;
    box-shadow: 0px 0px 8px 0px rgba(32, 169, 255, 0.84);
    border-radius: 0px 0px 0px 0px;
    margin-right: 10px;
  }
}
</style>
<style lang="less">
.el-popper.stage-tooltip .el-popper__arrow::before  {
  background: #01193C !important;
}
.el-popper.stage-tooltip[data-popper-placement^=bottom]>.el-popper__arrow::before  {
  // display: none !important;
  background: #094393 !important;
  border-top-width: 3px !important;
  border-left-width: 3px !important;
  border-top-color: #1665CA !important;
  border-left-color: #1665CA !important;
}

.el-popper.stage-tooltip[data-popper-placement^=top]>.el-popper__arrow::before  {
  // display: none !important;
  background: #01193C !important;
  border-bottom-width: 4px !important;
  border-right-width: 4px !important;
  border-bottom-color: #4395FF !important;
  border-right-color: #4395FF !important;
}


.el-popper.stage-tooltip {
  padding: 8px 15px 15px;
  background: url('../../../../assets/images/specialRunMode/tooltip.png')
    no-repeat;
  background-size: 100% 100%;
  background-color: #002d78;
  border: none;
  font-weight: 400;
  font-size: 12px;
  width: 220px;
}
</style>
