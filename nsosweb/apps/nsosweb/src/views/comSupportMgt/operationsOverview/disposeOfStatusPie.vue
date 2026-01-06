<script lang="ts" setup>
import type { EchartsUIType } from '@vben/plugins/echarts';

import { onBeforeMount, onMounted, ref, watch } from 'vue';

import { EchartsUI, useEcharts } from '@vben/plugins/echarts';
import { requestClient } from '#/api/request';
import * as echarts from '@vben/plugins/echarts';

const chartRef = ref<EchartsUIType>();
const { renderEcharts } = useEcharts(chartRef);
// const chart = ref(null);
// let myChart = null;

// 真实后端数据
// const annularList = [
//   { value: 24, name: "处置中" ,itemStyle: { color: '#62daab'}},
//   { value: 8, name: "已恢复" ,itemStyle: { color: '#f56e53'}},
//   { value: 0, name: "已闭环" ,itemStyle: { color: '#6395fa'}}
// ];

const chartData: any = defineModel('chartData');

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
    icon: "circle",
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
         let label = params.name;
         if (label === '已闭环') {
          label = '处理完成,' + label;
         }
         if (label === '已恢复') {
          label = '处理成功,' + label;
         }
         label += '\n' + params.value + '个\n' + params.percent + '%';
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

// watch(
//   () => chartData,
//   (newData) => {
//     renderEcharts(newData);
//   },
//   { immediate: true}
// )

// onBeforeMount(() => {
//   if (myChart) {
//     myChart.dispose();
//     myChart = null;
//   }
// })

</script>

<template>
  <EchartsUI ref="chartRef" />
</template>
