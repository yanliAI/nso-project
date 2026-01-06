<script lang="ts" setup>
import type { EchartsUIType } from '@vben/plugins/echarts';

import { onMounted, ref } from 'vue';

import { EchartsUI, useEcharts } from '@vben/plugins/echarts';
import { requestClient } from '#/api/request';
import * as echarts from '@vben/plugins/echarts';

const chartRef = ref<EchartsUIType>();
const { renderEcharts } = useEcharts(chartRef);


const chartData = defineModel('chartData');
// 真实后端数据
const annularList = [
  { value: 24, name: "<4H" ,itemStyle: { color: '#62daab'}},
  { value: 8, name: "4-12H" ,itemStyle: { color: '#1e9493'}},
  { value: 0, name: "12-24H" ,itemStyle: { color: '#6395fa'}},
  { value: 0, name: ">24H" ,itemStyle: { color: '#f56e53'}}
];

// 颜色
const colorList = {
  物理机: '#62daab',
  虚拟机: '#f56e53',
};

// 组装数据
const newAnnularList = annularList.map((item) => {
  return {
    ...item,
    itemStyle: {
      color: colorList[item.name],
    },
  };
});

// 配置项
const option = {
  backgroundColor: "#fff",
  title: {
    text: "总计",
    subtext: 0 ,
    left: "center", // 对齐方式居中
    top: "43%", // 距离顶部
    textStyle: {
      // 文字配置
      color: "#000", // 文字颜色
      fontSize: 15, // 字号
      align: "center", // 对齐方式
    },
    subtextStyle: {
      color: '#222',
      fontSize: 16,
      fontWeight: 400
    }
  },
  tooltip: {
    show: true,
    // formatter: "{a} <br/>{b}: {c} (个) ({d}%)",
  },
  legend: {
    bottom: "1%",
    left: 'center',
    icon: "circle", //icon 长方形 circle 圆形 arrow箭头型 diamond菱形
  },
  series: [
    {
      name: "总计",
      type: "pie",
      minAngle: 30,
      radius: ["30%", "50%"],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 0,
        borderColor: "#fff",
        borderWidth: 2,
      },
      label: {
        show: true,
        position: "outside",
        formatter: (params) => {
         let label = params.name + '\n' + params.value + '个\n' + params.percent + '%';
         return label;
        },
        color: 'inherit'
      },
      labelLine: {
        show: true,
        length: 20,
        length2: 30,
      },
      data: chartData.value,
    },
  ],
};

onMounted(async() => {
  let sum = 0;
  for(let i = 0; i<chartData.value.length; i++) {
    sum += chartData.value[i].value;
  }
  option.title.subtext = sum + '(个)';
  renderEcharts(option);
});

</script>

<template>
  <EchartsUI ref="chartRef" />
</template>
