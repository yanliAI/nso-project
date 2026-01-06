<script lang="ts" setup>
import type { EchartsUIType } from '@vben/plugins/echarts';

import { onMounted, ref } from 'vue';

import { EchartsUI, useEcharts } from '@vben/plugins/echarts';
import { requestClient } from '#/api/request';
import * as echarts from '@vben/plugins/echarts';

const chartRef = ref<EchartsUIType>();
const { renderEcharts } = useEcharts(chartRef);

const chartData = defineModel('chartData')

// 配置项
const option = {
  // 坐标轴线
  axisLine: {
    show: true, // 显示坐标轴线
    lineStyle: {
      color: '#CCCCCC', // 坐标轴线颜色
    },
  },
  backgroundColor: '#FFFFFF',
  grid: {
    top: "13%",
    bottom: "10%",
    left: '10%',
    right: '6%',
  },
  tooltip: {
    trigger: "axis",
    formatter: function (params) {
      var relVal = params[0].name
      for (var i = 0, l = params.length; i < l; i++) {
        relVal += '<div style="display: flex;justify-content: space-between;">' +
          '<div style="margin-top: 5px;margin-right: 40px;">' + params[i].marker + params[i].seriesName + '</div>'
          + '<div style="margin-top: 5px;font-weight: bold;">' + params[i].value + '(个)' + '</div>'
          + '</div>'
      }
      return relVal
    },
    axisPointer: {
      type: "cross",
      label: {
        show: false
      }
    }
  },
  legend: {
    data: ["处置中", "已恢复","已闭环"],
    top: "0%",
    icon: "icon", //icon 长方形 circle 圆形 arrow箭头型 diamond菱形
    itemWidth: 20,
    itemHeight: 14,
    textStyle: {
      inside: true,
      color: '#333333',
      padding: [11, 0, 10, 0],
      align: 'left',
      verticalAlign: 'center',
      fontSize: 14,
      rich: {},
    },
  },
  xAxis: {
    data: [
      "一类关键系统",
      "二类关键系统",
      "三类关键系统",
    ],
    axisLine: {
      show: true, //隐藏X轴轴线
      lineStyle: {
        color: '#333333'
      }
    },
    axisTick: {
      show: false //隐藏X轴刻度
    },

    axisPointer: {
      "type": "shadow"
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: '#CCCCCC'
      }
    },
    axisLabel: {
      show: true,
      textStyle: {
        color: "#666666" //X轴文字颜色
      },
    },

  },
  yAxis: [{
    type: "value",
    scale: false, // 禁止自动缩放
    name: "",
    splitLine: {
      show: true,
      lineStyle: {
        color: '#CCCCCC',
        // 设置边框类型，可选值：'solid', 'dashed', 'dotted'
        borderType: 'solid',
        // 设置边框宽度
        width: 1,
        // 设置边框颜色
        color: '#CCCCCC'
      }
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      formatter: function (value) {
        // value大于1000时除以1000并拼接k，小于1000按原格式显示
        if (value >= 1000) {
          value = value / 1000 + "k";
        } else if (value < 1000) {
          value;
        }
        return value;
      },
      textStyle: {
        color: '#333333' // 设置 y 轴标签文字的颜色为绿色
      }
    },
  },
  ],
  series: [{
    name: "处置中",
    type: "bar",
    label: {
      show: true,
      position: 'top',
      color: "#62daab",
      fontWeight: 'bold',
      fontSize: 14,
    },
    barWidth: 20,//使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用
    barGap: '0%',
    color: '#62daab',
    data: [],
  },
  {
    name: "已恢复",
    type: "bar",
    barWidth: 20,
    label: {
      show: true,
      position: 'top',
      color: "#f56e53",
      fontSize: 14,
      fontWeight: 'bold',
    },
    barGap: '0%',
    color: '#f56e53',
    data: [],
  },
  {
    name: "已闭环",
    type: "bar",
    barWidth: 20,
    label: {
      show: true,
      position: 'top',
      color: "#6395fa",
      fontSize: 14,
      fontWeight: 'bold',
    },
    barGap: '0%',
    color: '#6395fa',
    data: [],
  },
  ],
  // 增加 barGap 来增加同一类目下不同系列之间的间距
  barGap: '50%'
};

onMounted(async() => {
  option.xAxis.data = chartData.value.xAxis;
  for(let i=0;i<chartData.value.series.length;i++) {
    if(chartData.value.series[i].name === '处置中') {
      option.series[0].data = chartData.value.series[i].data;
    }
    if(chartData.value.series[i].name === '已恢复') {
      option.series[1].data = chartData.value.series[i].data;
    }
    if(chartData.value.series[i].name === '已闭环') {
      option.series[2].data = chartData.value.series[i].data;
    }
  }
  renderEcharts(option);
});
</script>

<template>
  <EchartsUI ref="chartRef" />
</template>
