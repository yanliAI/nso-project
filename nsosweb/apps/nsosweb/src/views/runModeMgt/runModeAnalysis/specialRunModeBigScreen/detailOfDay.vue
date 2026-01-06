<script setup lang="ts">
import {
  ElTable,
  ElTableColumn,
  ElCalendar,
  ElInput,
  ElButton,
  ElSelect,
  ElOption,
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
import { getSpecialRunModeCalendar } from '#/api';
// import data2 from './test2.js'
const props = defineProps({
  systemName: {
    type: String,
    default: '', // 默认值
  },
});
const categoryUnitName = defineModel('categoryUnitName');

const typeNameMap = ref([
  {
    runModelName: '全部开放',
    currentModeColor: '#00DE98',
    prevModeColor: 'rgba(0,222,152,0.2)',
  },
  {
    runModelName: '转冷备',
    currentModeColor: '#C80A0A',
    prevModeColor: 'rgba(200,10,10,0.2)',
  },
  {
    runModelName: '限时开放',
    currentModeColor: '#4687FF',
    prevModeColor: 'rgba(70,135,255,0.2)',
  },
  {
    runModelName: '白名单开放',
    currentModeColor: '#FFCE46',
    prevModeColor: 'rgba(255,206,70,0.2)',
  },
  {
    runModelName: '限时白名单',
    currentModeColor: '#8348D9',
    prevModeColor: 'rgba(131,72,217,0.2)',
  },
]);
const displayTime = ref(new Date()); // 当前选中日期
// 操作栏
const calendarValue = ref(new Date());
const selectedYear = ref('');
const yearOptions = ref([]);
const selectedMonth = ref('');
const monthOptions = ref([]);

/**
 * 日历日期切换事件
 */
// 顶部年月选择器，更新年月
const changeDate = () => {
  displayTime.value =
    Number(selectedYear.value) + '-' + Number(selectedMonth.value) + '-' + '1'; // 获取当前选中的时间
  calendarValue.value = new Date(
    Number(selectedYear.value),
    Number(selectedMonth.value) - 1,
  );
};

// 顶部 今天按钮响应事件， 更新日期（当天）
const showCurrentDate = () => {
  displayTime.value = new Date();
  calendarValue.value = displayTime.value;
  const year = displayTime.value.getFullYear(); // 2025
  const month = displayTime.value.getMonth() + 1; // 月份是0-11，所以需要+1
  selectedYear.value = year;
  selectedMonth.value = month;
};

//顶部 前一天，后一天按钮响应事件
const changeDay = (val: string) => {
  const newDate = new Date(displayTime.value);
  if (val === 'prev') {
    newDate.setDate(newDate.getDate() - 1);
  } else {
    newDate.setDate(newDate.getDate() + 1);
  }
  displayTime.value = newDate;
  calendarValue.value = displayTime.value;
  // 更新顶部年月日选项
  const year = displayTime.value.getFullYear(); // 2025
  const month = displayTime.value.getMonth() + 1; // 月份是0-11，所以需要+1
  selectedYear.value = year;
  selectedMonth.value = month;
};

// 日历点击，切换选中事件
function updateDate(date: string) {
  displayTime.value = date;
  const year = displayTime.value.getFullYear(); // 2025
  const month = displayTime.value.getMonth() + 1; // 月份是0-11，所以需要+1
  selectedYear.value = year;
  selectedMonth.value = month;
}

onMounted(() => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // 月份是 0-11，所以 +1

  // 设置年份选项（1949 至今）
  selectedYear.value = String(currentYear);
  for (let i = currentYear; i >= 1949; i--) {
    yearOptions.value.push(String(i));
  }

  // 设置月份选项（1-12 月）
  selectedMonth.value = String(currentMonth);
  for (let i = 1; i <= 12; i++) {
    monthOptions.value.push(String(i));
  }
  getCalendarData();
});

// 判断是否是当前月份
const isCurrentMonth = (day) => {
  const date = new Date(day);
  const current = new Date(calendarValue.value);
  return (
    date.getFullYear() === current.getFullYear() &&
    date.getMonth() === current.getMonth()
  );
};

/**
 * 获取数据并响应
 */
// 获取日历数据
const data = reactive([]);
const earliestDate = ref('2025-05-10');
async function getCalendarData() {
  try {
    const res = await getSpecialRunModeCalendar({
      deploySystemName: props.systemName,
      categoryUnitName: categoryUnitName.value
    });
    // const res = data2

    const earliestItem = res.reduce((prev, current) =>
      new Date(prev.date) < new Date(current.date) ? prev : current,
    );
    earliestDate.value = earliestItem.date;
    data.splice(0, data.length, ...res);
  } catch (error) {
    console.log(error);
  }
}

// 根据当前日期获取当前的系统运行方式（mode）
const getDateType = (date: string) => {
  if (!data || data.length === 0) return null;
  // 1. 首先尝试直接匹配
  const matchedItem = data.find((item) => item.date === date);
  if (matchedItem) return matchedItem.mode;

  // // 2. 如果没有直接匹配，开始向前追溯
  // const targetDate = new Date(date);
  // let currentDate = new Date(targetDate);

  // // 按天递减，直到找到匹配或到达最早日期
  // while (currentDate >= new Date(earliestDate.value)) {
  //   currentDate.setDate(currentDate.getDate() - 1); // 前一天

  //   const prevDateStr = currentDate.toISOString().split('T')[0];
  //   const prevItem = data.find((item) => item.date === prevDateStr);

  //   if (prevItem) return prevItem.mode;
  // }

  // 3. 如果追溯完所有日期仍未找到，返回 null
  return null;
};


// 根据当前日期获取当前的系统运行方式编号（type）
const getDateType1 = (date: string) => {
  if (!data || data.length === 0) return null;
  // 1. 首先尝试直接匹配
  const matchedItem = data.find((item) => item.date === date);
  if (matchedItem) return matchedItem.type;

  // 2. 如果没有直接匹配，开始向前追溯
  // const targetDate = new Date(date);
  // let currentDate = new Date(targetDate);

  // 按天递减，直到找到匹配或到达最早日期
  // while (currentDate >= new Date(earliestDate.value)) {
  //   currentDate.setDate(currentDate.getDate() - 1); // 前一天

  //   const prevDateStr = currentDate.toISOString().split('T')[0];
  //   const prevItem = data.find((item) => item.date === prevDateStr);

  //   if (prevItem) return prevItem.type;
  // }

  // 3. 如果追溯完所有日期仍未找到，返回 null
  return null;
};

// 获取当前日期运行方式的描述
const getDateDesc = (date: string) => {
  if (!data || data.length === 0) return null;
  // 1. 首先尝试直接匹配
  const matchedItem = data.find((item) => item.date === date);
  if (matchedItem) return matchedItem.specialRunModeDescription;

  // 2. 如果没有直接匹配，开始向前追溯
  // const targetDate = new Date(date);
  // let currentDate = new Date(targetDate);

  // // 按天递减，直到找到匹配或到达最早日期
  // while (currentDate >= new Date(earliestDate.value)) {
  //   currentDate.setDate(currentDate.getDate() - 1); // 前一天

  //   const prevDateStr = currentDate.toISOString().split('T')[0];
  //   const prevItem = data.find((item) => item.date === prevDateStr);

  //   if (prevItem) return prevItem.specialRunModeDescription;
  // }

  // 3. 如果追溯完所有日期仍未找到，返回 null
  return null;
};


// // 根据当前日期获取变更前的系统运行方式  暂时按前一天的运行方式与今天的对比，作为是否变更的一句
// 更正，需求变更  不在显示变更，更改成获取当前的运行方式，使得变更判定永远不成立。
const getPrevDay = (date: string) => {
  // if (!data || data.length === 0) return null;
  // const newdate = new Date(date);
  // newdate.setDate(newdate.getDate() - 1);
  // const year = newdate.getFullYear();
  // const month = String(newdate.getMonth() + 1).padStart(2, '0');
  // const day = String(newdate.getDate()).padStart(2, '0');
  // // 1. 首先尝试直接匹配
  // const matchedItem = data.find(
  //   (item) => item.date === `${year}-${month}-${day}`,
  // );
  // if (matchedItem) return matchedItem.mode;

  // // 2. 如果没有直接匹配，开始向前追溯
  // const targetDate = new Date(`${year}-${month}-${day}`);
  // let currentDate = new Date(targetDate);

  // // 按天递减，直到找到匹配或到达最早日期
  // while (currentDate >= new Date(data[0].date)) {
  //   currentDate.setDate(currentDate.getDate() - 1); // 前一天

  //   const prevDateStr = currentDate.toISOString().split('T')[0];
  //   const prevItem = data.find((item) => item.date === prevDateStr);

  //   if (prevItem) return prevItem.mode;
  // }

  // // 3. 如果追溯完所有日期仍未找到，返回 null
  // return null;
  if (!data || data.length === 0) return null;
  // 1. 首先尝试直接匹配
  const matchedItem = data.find((item) => item.date === date);
  if (matchedItem) return matchedItem.mode;

  // 2. 如果没有直接匹配，开始向前追溯
  const targetDate = new Date(date);
  let currentDate = new Date(targetDate);

  // 按天递减，直到找到匹配或到达最早日期
  while (currentDate >= new Date(earliestDate.value)) {
    currentDate.setDate(currentDate.getDate() - 1); // 前一天

    const prevDateStr = currentDate.toISOString().split('T')[0];
    const prevItem = data.find((item) => item.date === prevDateStr);

    if (prevItem) return prevItem.mode;
  }

  // 3. 如果追溯完所有日期仍未找到，返回 null
  return null;
};
</script>

<template>
  <div class="custom">
    <el-calendar style="border-radius: 5px" v-model="calendarValue">
      <template #header="{ date }">
        <div class="row-box">
          <div class="row-box" style="margin-left: 2px">
            <div
              class="switch-day"
              style="border-radius: 3px 0 0 3px;cursor: pointer;"
              @click="changeDay('prev')"
            >
              <img
                :src="iconTriangle"
                alt="triangle"
                class="img"
                style="transform: scaleX(-1)"
              />
            </div>
            <div
              class="switch-day"
              style="border-radius: 0px 3px 3px 0px; border-left: none;cursor: pointer;"
              @click="changeDay('next')"
            >
              <img :src="iconTriangle" alt="triangle" class="img" />
            </div>
            <el-button class="btn-today" @click="showCurrentDate()"
              >今天</el-button
            >
          </div>
          <div class="row-box" style="margin: 180px">
            <div class="date-text">{{ selectedYear }}</div>
            <el-select
              v-model="selectedYear"
              placeholder=""
              :teleported="false"
              class="select-operation"
              @change="changeDate"
            >
              <el-option
                v-for="year in yearOptions"
                :key="year"
                :label="year"
                :value="year"
              >
              </el-option>
            </el-select>
            <div class="date-text" style="margin-left: 10px; color: #536698">
              年
            </div>
            <span class="date-text" style="margin-left: 15px">
              {{ selectedMonth }}</span
            >
            <el-select
              v-model="selectedMonth"
              placeholder=""
              :teleported="false"
              class="select-operation"
              @change="changeDate"
            >
              <el-option
                v-for="month in monthOptions"
                :key="month"
                :label="month"
                :value="month"
              >
              </el-option>
            </el-select>
            <span class="date-text" style="margin-left: 10px; color: #536698"
              >月</span
            >
          </div>
        </div>
      </template>
      <template #date-cell="{ data }">
        <div
          class="item-calendar"
          :class="data.isSelected ? 'is-selected' : ''"
          @click="updateDate(data.date)"
        >
          <p class="item-text">
            <!-- {{ data.isSelected ? '✔️' : '' }} -->
            {{ data.day.split('-')[2] }}
          </p>
          <!-- 仅当前月显示以下内容 -->
          <template
            v-if="
              isCurrentMonth(data.day) &&
              (getPrevDay(data.day) === getDateType(data.day) ||
                !getPrevDay(data.day))
            "
          >
            <div
              class="item-content1 flex items-center"
              :style="{
                margin: '10px 0 0 0',
                backgroundColor:
                  typeNameMap[getDateType1(data.day) - 1]?.currentModeColor,
              }"
              :title="getDateDesc(data.day) ?? ''"
            >
              <span style="text-align: center; width: 100%">
                <!-- {{
                  (getDateType(data.day) ?? '').replace(/（.*?）/, '').trim()
                }} -->
                  {{ typeNameMap[getDateType1(data.day) - 1]?.runModelName}}
              </span>
            </div>
            <!-- 这里可以留空，或添加其他占位内容 -->
          </template>
          <!-- 非当前月显示空或简单样式 -->
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<style lang="less" scoped>
.el-calendar {
  background-color: #00399a69;
  color: white;
  .row-box {
    display: flex;
    justify-content: center;
    align-items: center;
    .switch-day {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 28px;
      height: 28px;
      background: rgba(51, 122, 255, 0.12);
      border: 1px solid #004093;
      .img {
        width: 10px;
        height: 10px;
      }
    }
    .date-text {
      font-size: 25px;
      font-weight: bold;
      white-space: nowrap;
    }
    .btn-today {
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
  }
  // :deep(.el-calendar-table:not(.is-range) td.next) {
  //   /*隐藏下个月的日期*/
  //   visibility: hidden;
  // }
  // :deep(.el-calendar-table:not(.is-range) td.prev) {
  //   /*隐藏上个月的日期*/
  //   visibility: hidden;
  // }
  // border: 2px solid #0245A3;
  .item-calendar {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 8px;
    background: #082c77;
    border: 1px solid #0245a3;
    .item-text {
      text-align: right;
      // color: #98A7C6;
    }
    .item-content {
      width: 100%;
      height: 15px;
      font-size: 12px;
      font-weight: 400;
      border-radius: 2px;
      border: none;
    }
    .item-content1 {
      width: 100%;
      height: 30px;
      font-size: 12px;
      font-weight: 400;
      border-radius: 2px;
      border: none;
    }
    // border-collapse: collapse;
  }
  .item-calendar.is-selected {
    background-color: #245bbd !important;
    color: #fff;
    font-weight: 900;
    text-align: right;
  }
  // .item-calendar[data-day-type='1'] {
  //   background-color: #0ace5c;
  // }
  // .item-calendar[data-day-type='2'] {
  //   background-color: #3b96ff;
  // }
  // .item-calendar[data-day-type='3'] {
  //   background-color: #e4c827;
  // }
  // .item-calendar[data-day-type='4'] {
  //   background-color: #4226ae;
  // }
  // .item-calendar[data-day-type='5'] {
  //   background-color: #c80a0a;
  // }

  :deep(.el-calendar__body) {
    padding: 0;
    // background: #0245A3;
    // border: 1px solid #0245A3;
  }
  :deep(.el-calendar__header) {
    padding: 0px;
    height: 50px;
    border-bottom: none;
    background: #0d2461;
  }
  .select-operation {
    :deep(.el-select__wrapper) {
      background: transparent;
      width: 10px;
      height: 15px;
      border-radius: 80%;
      gap: 2px;
      padding: 4px 2px;
      box-shadow: none !important; // 移除阴影
    }
    :deep(.el-select__placeholder) {
      font-size: 16px;
      width: 0px;
      font-weight: 500;
      color: #ffffff;
    }
    :deep(.el-select__caret) {
      color: transparent;
      margin-top: 4px;
      width: 8px;
      height: 8px;
      background-image: url('../../../../assets/images/specialRunMode/icon-triangle.png');
      background-repeat: no-repeat;
      background-position: center;
      background-size: contain;
      transform: rotate(90deg);
    }

    :deep(.el-input__inner) {
      border: none !important; // 移除输入框默认边框
      box-shadow: none !important; // 移除输入框阴影
    }
    // :deep(.el-icon){
    //   width: 0px;
    //   height: 0px;
    // }
    // :deep(.el-icon svg){
    //   width: 0px;
    //   height: 0px;
    // }
    :deep(.el-select__selection) {
      border: none !important; // 移除选择区域默认边框
    }
    :deep(.el-select-dropdown) {
      background: #012b78;
      box-shadow: inset 0px 0px 15px 1px rgba(34, 135, 255, 0.5);
      border: 1px solid #719fff;
      width: fit-content;
    }
    :deep(.el-select-dropdown__item) {
      font-size: 14px;
      font-weight: 500;
      color: #ffffff;
      text-align: center;
    }
    :deep(.el-select-dropdown__item.is-hovering) {
      background-color: skyblue;
    }
    :deep(.el-select-dropdown__item.is-selected) {
      background-color: skyblue;
    }

    :deep(.el-input__wrapper) {
      box-shadow: none !important; // 移除输入框 wrapper 的阴影
    }
  }

  :deep(.el-calendar-table thead th) {
    color: white;
    background: #00399a;
    // border: 2px solid #00399A;
    padding-right: 10px;
    text-align: right;
    border-left: 1px solid #0245a3;
    border-right: 1px solid #0245a3;
  }

  :deep(.el-calendar-table .el-calendar-day) {
    padding: 0;

    :hover {
      background-color: #0b2e88;
    }
  }

  :deep(.el-calendar-table td.is-selected) {
    background-color: #062574 !important;
  }

  // :deep(.el-calendar-table .el-calendar-day:hover) {
  //   background-color: #0b2e88;
  // }
  :deep(.el-calendar-table td.is-today) {
    color: rgb(245, 253, 251);
  }

  :deep(.el-calendar-table td) {
    border: none;
    // border-color: rgba(90, 181, 255, 0.23);
  }

  // :deep(.el-calendar-table) {
  //   border: 1px solid #0245A3;
  // }
}

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
  height: 460px;
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
</style>
