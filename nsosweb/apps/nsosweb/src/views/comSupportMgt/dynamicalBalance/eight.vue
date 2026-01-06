<script lang="ts" setup>
import type { EchartsUIType } from '@vben/plugins/echarts';

import { onMounted, ref } from 'vue';

import { EchartsUI3, useEcharts } from '@vben/plugins/echarts';
import { requestClient } from '#/api/request';
import * as echarts from '@vben/plugins/echarts';

const chartRef = ref<EchartsUIType>();
const { renderEcharts } = useEcharts(chartRef);

const zyxqData = [2002, 1500];
const kyzyData = [1000,1000];

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
    top: "25%",
    bottom: "10%", //也可设置left和right设置距离来控制图表的大小
  },
  tooltip: {
    trigger: "axis",
    formatter: function (params) {
      var relVal = params[0].name
      for (var i = 0, l = params.length; i < l; i++) {
        relVal += '<div style="display: flex;justify-content: space-between;">' +
          '<div style="margin-top: 5px;margin-right: 40px;">' + params[i].marker + params[i].seriesName + '</div>'
          + '<div style="margin-top: 5px;font-weight: bold;">' + params[i].value + '(MB)' + '</div>'
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
    data: ["资源需求", "可用资源"],
    top: "10%",

    //  icon: "circle", //icon 长方形 circle 圆形 arrow箭头型 diamond菱形
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
      "物理机",
      "虚拟机(容器)",
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
    name: "资源需求",
    type: "bar",
    label: {
      show: true,
      position: 'top',
      color: "#6cdbf5",
      fontWeight: 'bold',
      fontSize: 14,
      formatter: function (params) {
        return params.value + 'MB';
      }
    },
    barWidth: 30,//使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用
    color: '#6cdbf5',
    data: zyxqData,
  },
  {
    name: "可用资源",
    type: "bar",
    barWidth: 30,
    label: {
      show: true,
      position: 'top',
      color: "#71ECC2",
      fontSize: 14,
      fontWeight: 'bold',
      formatter: function (params) {
        return params.value + 'MB';
      }
    },
    color: '#71ECC2',
    data: kyzyData,
  },
  ],
  // 增加 barGap 来增加同一类目下不同系列之间的间距
  barGap: '80%'
};

const query = async () => {
  const response = await requestClient.get(import.meta.env.VITE_NSOSZH + '/itResourceRequestInfo/queryZYSQQK');
  let len1 = 1;
  let len2 = 0
  response.forEach(function(item,index) {
    if(item.bkRequestType == '资源需求'){
      zyxqData[len1] = item.bkMem;
      len1 -= 1;
    }else{
      kyzyData[len2] = item.bkMem;
      len2 += 1;
    }
    })
    option.series[0].data = zyxqData;
    option.series[1].data = kyzyData;
};

onMounted(async() => {
  await query();
  renderEcharts(option);
});
</script>

<template>
  <EchartsUI3 ref="chartRef" />
</template>
