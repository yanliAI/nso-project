<script lang="ts" setup>
import type { EchartsUIType } from '@vben/plugins/echarts';

import { onMounted, ref,reactive } from 'vue';

import { EchartsUI, useEcharts } from '@vben/plugins/echarts';
import { requestClient } from '#/api/request';
import { useDropStore } from '#/store';
import * as echarts from '@vben/plugins/echarts';


const chartRef = ref<EchartsUIType>();
const { renderEcharts } = useEcharts(chartRef);

const datas = reactive({
  formData: {},
})

var nameList = ["0","故障处置","漏洞整改","IP封堵","漏洞排查","信息收集","重要保障"];
var list = [
  { VALUE: 200, NAME: 1 },
  { VALUE: 300, NAME: 2 }
];

var echartData = [
   {
      value: 200,
      name: nameList[1],
      progress: 20
   },
   {
      value: 300,
      name: "实用新型",
      progress: 30
   },
   {
      value: 500,
      name: "外观设计",
      progress: 50
   }
];

var color = [
  '#1affc6',  // 发明专利颜色
  '#ffdb00',  // 实用新型颜色
  '#ba92ff',   // 外观设计颜色
  '#4b6dff',
  '#07ebff',
  '#ee803c'
];

// 修改2：直接分配颜色值
echartData.forEach((item, index) => {
  item.itemStyle = {
    color: color[index] // 直接使用颜色字符串
  };
});

const option = {
   color,
   backgroundColor: 'transparent', // 核心修改点
   series: [
      {
         type: 'pie',
         minAngle: 5,
         startAngle: 10, //起始角度
         labelLine: {
            show: true,
            length: 20,
            length2: 10,
            lineStyle: {
               width: 2
            }
         },
         label: {
            formatter: (params) => {
               const name = params.name
               return `{t|${name}}\n{f${params.dataIndex + 1}|${params.data.progress}%}`
            },
            rich: {
               t: {
                  color: '#FFF',
                  lineHeight: 20,
                  fontSize: 10,
                  align: 'left'
               },
               f1: {
                  color: '#1affc6',
                  fontSize: 10,
                  align: 'center',
                  lineHeight: 8
               },
               f2: {
                  color: '#ffdb00',
                  fontSize: 10,
                  align: 'center',
                  lineHeight: 8
               },
               f3: {
                  color: '#ba92ff',
                  fontSize: 10,
                  align: 'center',
                  lineHeight: 8
               },
               f4: {
                  color: '#4b6dff',
                  fontSize: 10,
                  align: 'center',
                  lineHeight: 8
               },
               f5: {
                  color: '#07ebff',
                  fontSize: 10,
                  align: 'center',
                  lineHeight: 8
               },
               f6: {
                  color: '#ee803c',
                  fontSize: 10,
                  align: 'center',
                  lineHeight: 8
               },
            }
         },
         center: ['50%', '50%'],
         radius: ["40%", "70%"],
         data: echartData,
      },
   ],
};


const query = async () => {
  const response = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/command/queryTypeList',datas.formData);
  list = response;

  const nameMap = {};
  dropList.NSOS_CMD_TYPE.forEach(item => {
    nameMap[item.value] = item.label;
  });
  const result = list.map(item => ({
    value: item.VALUE,
    name: nameMap[item.NAME] || item.NAME // 找不到时保留原值
  }));
  // 1.计算总值
  const total = result.reduce((sum, item) => sum + item.value, 0);
  // 2.映射数据
  echartData = result.map(item => ({
    value: item.value,
    name: item.name,
    progress: +((item.value / total * 100).toFixed(1))
  }));
  option.series[0].data = echartData;
};

const dropList = reactive({});
onMounted(async() => {
  const dropStore = useDropStore();
  const dropType = ['NSOS_CMD_TYPE'];
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);
  await query();
  renderEcharts(option);
});
</script>

<template>
  <EchartsUI ref="chartRef" />
</template>
