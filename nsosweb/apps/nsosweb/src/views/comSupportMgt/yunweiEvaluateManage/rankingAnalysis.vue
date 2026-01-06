<script lang="ts" setup>
import { Page } from '@vben/common-ui';
import type { EchartsUIType } from '@vben/plugins/echarts';

import { onMounted, ref,reactive } from 'vue';
import { useDropStore } from '#/store';


import { EchartsUI2, useEcharts } from '@vben/plugins/echarts';
import { requestClient } from '#/api/request';
import { toExcel } from './rankingAnalysisMethods.ts'


const chartRef = ref<EchartsUIType>();
const { renderEcharts } = useEcharts(chartRef);

const evaluateTimeType: any = defineModel('evaluateTimeType')
const evaluateMonth: any = defineModel('evaluateMonth')

const data = reactive({
  tableData: [],
  formData: {
    evaluateMonth: evaluateMonth.value,
    evaluateTimeType: evaluateTimeType.value,
  },
  excelData: {
    evaluateMonth: evaluateMonth.value?evaluateMonth.value.getTime():'',
    evaluateTimeType: evaluateTimeType.value,
  },
  tabIndex: 'list',
  tabArr: [],
  list: [],
  ylist: [],
})
const dropList = reactive({});
const colorList = ['#00bfff','#ff7f50','#9400d3','#ff00ff','#8fbc8f'];
let name = '总得分';

const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['各单位【' + name +'】得分情况']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'value',
        axisLabel: {
            show: false,
        },
        splitLine: {
            show: false,
        },
      }
    ],
    yAxis: [
      {
        type: 'category',
        axisTick: {
          show: false
        },
        data: data.ylist,
      }
    ],
    series: [
      {
        type: 'bar',
        barWidth: 18,
        z: 2,
        itemStyle: {
          opacity: 0.8,
          color: '#00bfff',
          barBorderRadius: [0, 8, 8, 0],
        },
        name: '各单位【' + name +'】得分情况',
        label: {
          show: true,
          position: 'outside'
        },
        emphasis: {
          focus: 'series'
        },
        data: data.list,
      }
    ]
  }

const query = async (evaluateItemName: string) => {
  evaluateItemName = evaluateItemName === '总得分' ? '运维序列评价' : evaluateItemName
  const response = await requestClient.post(import.meta.env.VITE_NSOSZH + '/evaluateDetail/queryData2', {
    evaluateItemName: evaluateItemName,
    evaluateMonth: data.formData.evaluateMonth?data.formData.evaluateMonth.getTime():'',
    evaluateType: '2',
  });
  data.list = [];
  data.ylist = [];
  response.forEach(function(item,index) {data.list[index] = item.finalScore; data.ylist[index] = getUnitLabel(item.evaluateUini);})
  option.series[0].data = data.list;
  option.yAxis[0].data = data.ylist;
};

const sx = async (evaluateItemName,num) => {
  option.series[0].itemStyle.color = colorList[num];
  option.legend.data = ['各单位【' + evaluateItemName +'】得分情况'];
  option.series[0].name = '各单位【' + evaluateItemName +'】得分情况';
  await query(evaluateItemName);
  renderEcharts(option);
}

const toExcelClick = async () => {
  toExcel(data.excelData, '排名分析导出excel.xlsx')
}

const getUnitLabel = (value) => {
  const option = dropList.NSOS_ORG_NAME.find(option => option.value === value);
  return option ? option.label : '';
};

onMounted(async() => {
  const dropStore = useDropStore();
  const dropType = ['NSOS_EVALUATE_TIMETYPE', 'NSOS_EVALUATE_STATUS', 'NSOS_ORG_NAME'];
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);
  await query('总得分');
  renderEcharts(option);
});
</script>

<!-- <template>
  <div class="common-layout">
    <el-container class="h-full bg-white">
      <el-header height="100px">
        <el-form label-width="auto" ref="ruleFormRef" :model="data.formData" :inline="true" label-position="right"
          class="demo-form-inline mt-2">
          <el-row>
            <el-col :span="4">
              <el-form-item label="时间:" filterable>
                <el-date-picker v-model="data.formData.recordingTime" type="datetimer"
                  format="YYYY-MM-DD HH:mm:ss.SSS" value-format="YYYY-MM-DD HH:mm:ss.SSS"   />
              </el-form-item>
            </el-col>
            <el-col :span="16" class="">
            </el-col>
            <el-col :span="4" class="">
              <el-button type="primary" class="ml-4">查询</el-button>
              <el-button type="primary"  class="ml-4">导出列表</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <el-container style="height: calc(100% - 110px);">
        <el-aside width="20%">
          <div>
            <h3>评价项</h3>
            <div style="background-color: aquamarine; width: 80%; " >111</div>
          </div>
        </el-aside>
        <el-main style=" border-width: 6px;" >
          <EchartsUI ref="chartRef"  />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template> -->

<template>
  <Page auto-content-height>
    <el-container class="h-full bg-white">
      <el-header height="50px">
        <el-form label-width="auto" ref="ruleFormRef" :model="data.formData" :inline="true" label-position="right"
          class="demo-form-inline mt-2">
          <el-row>
            <el-col :span="4">
              <el-form-item label="评价维度:" >
                <el-select v-model="data.formData.evaluateTimeType" type="month">
                  <el-option v-for="item in dropList.NSOS_EVALUATE_TIMETYPE" :key="item.value" :label="item.label"
                    :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="时间:" filterable>
                <!-- <el-date-picker  v-model="data.formData.evaluateMonth" type="datetime" value-format="YYYY-MM-DD HH:mm:ss.SSS"/> -->
                <el-date-picker v-if="data.formData.evaluateTimeType === '1'" v-model="data.formData.evaluateMonth" type="month" />
                <el-date-picker v-else="data.formData.evaluateTimeType === '2'" v-model="data.formData.evaluateMonth" type="year" />
              </el-form-item>
            </el-col>
            <el-col :span="12" class="">
            </el-col>
            <el-col :span="4" class="">
              <el-button type="primary" class="ml-4" @click="sx('总得分',0)">查询</el-button>
              <el-button type="primary" class="ml-4" @click="toExcelClick">导出列表</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-header>

      <el-main>
        <el-row>
          <el-col :span="4">
            <div style="margin-top: 50px; margin-left: 50px;">
              <h3>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;评价项
              </h3>
              <el-row style="margin-bottom: 10px; margin-top: 10px;"><el-button
                  style="background-color: deepskyblue; width: 150px; height: 50px;" type="primary" class="ml-4"
                  @click="sx('总得分',0)">总得分</el-button></el-row>
              <el-row style="margin-bottom: 10px; margin-top: 10px;"><el-button
                  style="background-color:coral; width: 150px; height: 50px;" type="primary" class="ml-4"
                  @click="sx('基础业务',1)">基础业务</el-button></el-row>
              <el-row style="margin-bottom: 10px; margin-top: 10px;"><el-button
                  style="background-color:darkviolet; width: 150px; height: 50px;" type="primary" class="ml-4"
                  @click="sx('技术支持系统',2)">技术支持系统</el-button></el-row>
              <el-row style="margin-bottom: 10px; margin-top: 10px;"><el-button
                  style="background-color:fuchsia; width: 150px; height: 50px;" type="primary" class="ml-4"
                  @click="sx('工作质量',3)">工作质量</el-button></el-row>
              <el-row style="margin-bottom: 10px; margin-top: 10px;"><el-button
                  style="background-color:darkseagreen; width: 150px; height: 50px;" type="primary" class="ml-4"
                  @click="sx('工作成效',4)">工作成效</el-button></el-row>
            </div>
          </el-col>
          <el-col :span="20" style="border-left-width: 1px;/* border-width: 0px; */border-left-color: #409effb8;">
            <EchartsUI2 ref="chartRef" />
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </Page>
</template>
