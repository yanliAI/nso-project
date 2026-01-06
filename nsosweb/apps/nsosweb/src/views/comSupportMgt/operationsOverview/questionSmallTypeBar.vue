<script lang="ts" setup>
import type { EchartsUIType } from '@vben/plugins/echarts';

import { onMounted, ref, reactive } from 'vue';

import { EchartsUI, useEcharts } from '@vben/plugins/echarts';
import { requestClient } from '#/api/request';
import * as echarts from '@vben/plugins/echarts';

const chartRef = ref<EchartsUIType>();
const { renderEcharts } = useEcharts(chartRef);

const chartData = defineModel('chartData');
const mydata = reactive({
  sum: 0
});

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
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        show: false,
      },
    },
  },
  xAxis: {
    data: [],
    axisLine: {
      show: true, //隐藏X轴轴线
      lineStyle: {
        color: '#333333',
      },
    },
    axisTick: {
      show: false, //隐藏X轴刻度
    },

    axisPointer: {
      type: 'shadow',
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: '#CCCCCC',
      },
    },
    axisLabel: {
      show: true,
      textStyle: {
        color: '#666666', //X轴文字颜色
      },
    },
  },
  yAxis: [
    {
      type: 'value',
      scale: false, // 禁止自动缩放
      name: '',
      splitLine: {
        show: true,
        lineStyle: {
          color: '#CCCCCC',
          // 设置边框类型，可选值：'solid', 'dashed', 'dotted'
          borderType: 'solid',
          // 设置边框宽度
          width: 1,
          // 设置边框颜色
          color: '#CCCCCC',
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        formatter: function (value) {
          // value大于1000时除以1000并拼接k，小于1000按原格式显示
          if (value >= 1000) {
            value = value / 1000 + 'k';
          } else if (value < 1000) {
            value;
          }
          return value;
        },
        textStyle: {
          color: '#333333', // 设置 y 轴标签文字的颜色为绿色
        },
      },
    },
  ],
  series: [
    {
      type: 'bar',
      label: {
        show: true,
        position: 'top',
        fontWeight: 'bold',
        fontSize: 14,
        color: 'inherit',
        formatter: (params) => {
          let percent;
          if (!params.value || params.value === 0 || mydata.sum === 0) {
            percent = 0;
          } else {
            percent = ((params.value * 100) / mydata.sum).toFixed(2);
          }
          let label = params.name + '\n' + params.value + '个\n占比' + percent + '%';
          return label;
        },
      },
      barWidth: 30, //使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用
      itemStyle: {
        color: function (params) {
          let colorList = ['#62daab', '#6395fa', '#1e9493'];
          return colorList[params.dataIndex];
        },
      },
      data: [],
    },
  ],
  // 增加 barGap 来增加同一类目下不同系列之间的间距
  barGap: '50%',
};

onMounted(async () => {
  const data = chartData.value.data;
  let count = 0;
  data.forEach(d => {
    count += d;
  });
  mydata.sum = count;
  option.xAxis.data = chartData.value.xAxis;
  option.series[0].data = data;
  renderEcharts(option);
});
</script>

<template>
  <EchartsUI ref="chartRef" />
</template>
