<script lang="ts" setup>
import type { EchartsUIType } from '@vben/plugins/echarts';

import { onMounted, ref } from 'vue';

import { EchartsUI3, useEcharts } from '@vben/plugins/echarts';
import { requestClient } from '#/api/request';
import * as echarts from '@vben/plugins/echarts';

const chartRef = ref<EchartsUIType>();
const { renderEcharts } = useEcharts(chartRef);

// 真实后端数据
const annularList = [
  { value: 2700, name: "已使用" },
  { value: 3800, name: "未使用" },
];

// 颜色
const colorList = {
  已使用: ["#6cf5ca", "#7DBAFF"],
  未使用: ["#ff7138", "#5ddeE6"],
};

// 组装数据
const newAnnularList = annularList.map((item) => {
  return {
    ...item,
    itemStyle: {
      color: colorList[item.name][0],
    },
  };
});

// 配置项
const option = {
  backgroundColor: "#fff",
  title: {
    text: "总计",
    subtext: `0` + "(GB)",
    left: "center", // 对齐方式居中
    top: "40%", // 距离顶部
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
    formatter: "{a} <br/>{b}: {c} (GB) ({d}%)",
  },
  legend: {
    top: "93%",
  },
  series: [
    {
      name: "总计",
      type: "pie",
      radius: ["40%", "60%"],
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
          if (params.name == "已使用") {
            return "{a| " + params.value + "(GB)" + "}\n{a| " + params.percent + "%}";
          }
          else  {
            return "{b| " + params.value + "(GB)" + "}\n{b| " + params.percent + "%}";
          }
        },
        rich: {
          a: {
            color: "#6cf5ca",
            align: "left",
            padding: 4,
          },
          b: {
            color: "#ff7138",
            align: "left",
            padding: 4,
          },
          c: {
            color: "#FFC900",
            align: "left",
            padding: 4,
          },



        },
      },
      labelLine: {
        show: true,
        length: 20,
        length2: 30,
      },
      data: newAnnularList,
    },
  ],
};

const query = async () => {
  const response = await requestClient.get(import.meta.env.VITE_NSOSZH + '/itResourceInfo/queryZYYLQK');
  let sum = 0;
  response.forEach(function(item,index) {newAnnularList[index].value = item.bkDisk; sum += item.bkDisk;})
  option.title.subtext = sum + '(GB)';
  option.series[0].data = newAnnularList;
};

onMounted(async() => {
  await query();
  renderEcharts(option);
});
</script>

<template>
  <EchartsUI3 ref="chartRef" />
</template>
