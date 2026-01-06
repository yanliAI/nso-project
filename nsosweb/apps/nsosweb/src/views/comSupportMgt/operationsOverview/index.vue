<template>
  <Page auto-content-height>
    <div class="ywzl_page">
      <!-- 查询条件栏 -->
      <div class="ywzl_condition_layout ywzl_white_bg">
        <el-form ref="form" :inline="true" :model="data.formData" label-position="right" class="demo-form-inline mt-2">
          <el-row>
            <el-col :span="3" style="padding-left: 10px;">
              <el-form-item label="时间维度:">
                <el-select v-model="data.tjzq" style="width: 100px;">
                  <el-option v-for="item in data.tjzqItems" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7" v-if="data.tjzq === 'D'">
              <el-form-item label="统计时间:">
                <el-date-picker v-model="data.formData.timeRange" type="daterange" range-separator="到" start-placeholder="起始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" :clearable="false" />
              </el-form-item>
            </el-col>
            <el-col :span="4" v-if="data.tjzq === 'M'">
              <el-form-item label="统计时间:">
                <el-date-picker v-model="data.tjsj" type="month" value-format="YYYY-MM" :clearable="false" style="width: 120px;" />
              </el-form-item>
            </el-col>
            <el-col :span="4" v-if="data.tjzq === 'Y'">
              <el-form-item label="统计时间:">
                <el-date-picker v-model="data.tjsj" type="year" value-format="YYYY" :clearable="false" style="width: 120px;" />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item>
                <el-button type="primary" class="ml-4" :icon="Histogram" @click="query">统计分析</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div class="ywzl_page_layout">
        <div class="ywzl_left_area">
          <div class="ywzl_top_area">
            <!-- 模块一 -->
            <div class="ywzl_left_area ywzl_white_bg">
              <div class="ywzl_mod_headbar">
                <div class="ywzl_mod_title_icon"></div>
                <span>按处置状态(故障办理率)分析</span>
              </div>
              <div class="ywzl_mod_area">
                <DisposeOfStatusPie :chartData="data.statusPieData" v-if="data.statusPieData" />
              </div>
            </div>

            <!-- 模块二 -->
            <div class="ywzl_right_area ywzl_white_bg">
              <div class="ywzl_mod_headbar">
                <div class="ywzl_mod_title_icon"></div>
                <span>按处理时长(办理及时率)分析</span>
              </div>
              <div class="ywzl_mod_area">
                <HandleTimePie :chartData="data.timePieData" v-if="data.timePieData" />
              </div>
            </div>
          </div>

          <!-- 模块三 -->
          <div class="ywzl_bottom_area">
            <div class="ywzl_left_area ywzl_white_bg">
              <div class="ywzl_mod_headbar">
                <div class="ywzl_mod_title_icon"></div>
                <span>按系统类型分析</span>
              </div>
              <div class="ywzl_mod_area">
                <SystemTypeBar :chartData="data.sysBarData" v-if="data.sysBarData" />
              </div>
            </div>
            <div class="ywzl_right_area ywzl_white_bg">
              <div class="ywzl_mod_headbar">
                <div class="ywzl_mod_title_icon"></div>
                <span>按问题来源分析</span>
              </div>
              <div class="ywzl_mod_area">
                <QuestionOrigionPie :chartData="data.questionData" v-if="data.questionData" />
              </div>
            </div>
          </div>
        </div>
        <div class="ywzl_right_area">
          <!-- 模块四 -->
          <div class="ywzl_top_area ywzl_white_bg">
            <div class="ywzl_mod_headbar">
              <div class="ywzl_mod_title_icon"></div>
              <span>按单位分析</span>
            </div>
            <div class="ywzl_mod_area">
              <OperationsUnit :chartData="data.orgBarData" v-if="data.orgBarData" />
            </div>
          </div>
          <div class="ywzl_bottom_area">
            <!-- 模块五 -->
            <div class="ywzl_left_area ywzl_white_bg">
              <div class="ywzl_mod_headbar">
                <div class="ywzl_mod_title_icon"></div>
                <span>按问题类型(根本原因大类)分析</span>
              </div>
              <div class="ywzl_mod_area">
                <QuestionBigTypeBar :chartData="data.largeBarData" v-if="data.largeBarData" />
              </div>
            </div>

            <!-- 模块六 -->
            <div class="ywzl_right_area ywzl_white_bg">
              <div class="ywzl_mod_headbar">
                <div class="ywzl_mod_title_icon"></div>
                <span>按问题类型(根本原因小类)分析</span>
              </div>
              <div class="ywzl_mod_area">
                <QuestionSmallTypeBar :chartData="data.subBarData" v-if="data.subBarData" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Page>
</template>
<script lang="ts" setup>
import { Page } from '@vben/common-ui'
import DisposeOfStatusPie from './disposeOfStatusPie.vue'
import HandleTimePie from './handleTimePie.vue'
import SystemTypeBar from './systemTypeBar.vue'
import QuestionSmallTypeBar from './questionSmallTypeBar.vue'
import QuestionBigTypeBar from './questionBigTypeBar.vue'
import OperationsUnit from './operationsUnit.vue'
import QuestionOrigionPie from './questionOrigionPie.vue'
import { Histogram } from '@element-plus/icons-vue'
import { analyzeByStatus, analyzeByTime, analyzeByOperateOrg, analyzeBySysLevel, analyzeByLargeCatagory, analyzeBySubCatagory, analyzeQuestionSource } from './operationsOverviewMethod.ts'
import { reactive, onMounted, nextTick, watch } from 'vue'

onMounted(async () => {
  nextTick().then(() => {
    data.tjzq = 'D';
  })
})

// 获取月份最后一天
const getLastDayOfMonth = (dateStr:String) => {
  const [year, month] = dateStr.split('-').map(Number);
  const lastDay = new Date(year, month, 0);
  const day = lastDay.getDate();
  const formattedDay = day.toString().padStart(2, '0');
  const formattedMonth = month.toString().padStart(2, '0');
  return `${year}-${formattedMonth}-${formattedDay}`;
}

// 获取当前日期
const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 获取当前月份
const getCurrentMonth = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

// 获取当前年份
const getCurrentYear = () => {
  return new Date().getFullYear() + '-01-01';
}

const query = async () => {
  data.statusPieData = null
  data.timePieData = null
  data.orgBarData = null
  data.sysBarData = null
  data.largeBarData = null
  data.subBarData = null
  data.questionData = null

  // 处理时间参数
  let startTime = null;
  let endTime = null;
  if (data.tjzq === 'D') {
    if (data.formData.timeRange.length > 1) {
      startTime = data.formData.timeRange[0] + ' 00:00:00';
      endTime = data.formData.timeRange[1] + ' 23:59:59';
    }
  } else if (data.tjzq === 'M') {
    if (data.tjsj) {
      startTime = data.tjsj + '-01 00:00:00';
      endTime = getLastDayOfMonth(data.tjsj) + ' 23:59:59';
    }
  } else if (data.tjzq === 'Y') {
    if (data.tjsj) {
      if (data.tjsj.length === 4) {
        startTime = data.tjsj + '-01-01 00:00:00';
        endTime = data.tjsj + '-12-31 23:59:59';
      } else {
        startTime = data.tjsj.substring(0, 4) + '-01-01 00:00:00';
        endTime = data.tjsj.substring(0, 4) + '-12-31 23:59:59';
      }
    }
  }
  const param = {
    startTime: startTime,
    endTime: endTime
  };
  
  data.statusPieData = await analyzeByStatus(param);
  data.timePieData = await analyzeByTime(param);
  data.orgBarData = await analyzeByOperateOrg(param);
  data.sysBarData = await analyzeBySysLevel(param);
  data.largeBarData = await analyzeByLargeCatagory(param);
  data.subBarData = await analyzeBySubCatagory(param);
  data.questionData = await analyzeQuestionSource(param);
}

const data = reactive({
  formData: {
    timeRange: []
  },
  statusPieData: null,
  timePieData: null,
  orgBarData: null,
  sysBarData: null,
  largeBarData: null,
  subBarData: null,
  questionData: null,
  tjzq: '',
  tjzqItems: [
    {value: 'D', label: '日'},
    {value: 'M', label: '月'},
    {value: 'Y', label: '年'}
  ],
  tjsj: ''
})

watch(
  () => data.tjzq,
  (nv, ov) => {
    if (nv === 'D') {
      const day = getCurrentDate();
      data.formData.timeRange = [day, day];
    } else if (nv === 'M') {
      data.tjsj = getCurrentMonth();
    } else if (nv === 'Y') {
      data.tjsj = getCurrentYear();
    }
    nextTick().then(() => {
      query()
    })
  },
  { immediate: false }
)
</script>
<style scoped>
.ywzl_page {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.ywzl_condition_layout {
  width: calc(100% - 20px);
  height: 50px;
  margin: 10px 10px 15px;
}

.ywzl_page_layout {
  width: calc(100% - 20px);
  height: calc(100% - 85px);
  margin: 0 10px;
  overflow: hidden;
}

.ywzl_left_area {
  float: left;
  width: calc(50% - 7.5px);
  height: 100%;
  margin-right: 7.5px;
}

.ywzl_right_area {
  float: left;
  width: calc(50% - 7.5px);
  height: 100%;
  margin-left: 7.5px;
}

.ywzl_top_area {
  width: 100%;
  height: calc(50% - 7.5px);
}

.ywzl_bottom_area {
  width: 100%;
  height: calc(50% - 7.5px);
  margin-top: 15px;
}

.ywzl_white_bg {
  overflow: hidden;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 -0 8px rgb(20 32 111 / 10%);
}

.ywzl_mod_headbar {
  width: 100%;
  height: 30px;
  font-size: 14px;
  font-weight: 600;
  line-height: 32px;
  color: #464c5b;
}

.ywzl_mod_title_icon {
  float: left;
  width: 13px;
  height: 13px;
  margin: 11px;
  margin-right: 5px;
  background: #5a9cf8;
  border-radius: 2px;
  box-shadow: -5px -2px 1px #bdd7fc;
}

.ywzl_mod_area {
  width: 100%;
  height: calc(100% - 30px);
}

.demo-form-inline {
  font-size: 12px;
}

.demo-form-inline .el-input {
  --el-input-width: 100%;
}

.demo-form-inline .el-select {
  --el-select-width: 100%;
}

:deep(.el-date-editor.el-input, .el-date-editor.el-input__wrapper) {
  width: 100%;
}

:deep(.el-form--inline .el-form-item) {
  display: flex;
  width: calc(100% - 20px);
  margin-right: 20px;
  margin-bottom: 12px;
  line-height: 32px;
}

:deep(.el-form--inline .el-form-item__content) {
  margin-left: 10px;
}
</style>
