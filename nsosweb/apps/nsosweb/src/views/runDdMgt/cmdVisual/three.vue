<script lang="ts" setup>
import type { EchartsUIType } from '@vben/plugins/echarts';

import { onMounted, ref, reactive } from 'vue';

import { EchartsUI, useEcharts } from '@vben/plugins/echarts';
import { requestClient } from '#/api/request';
import { useDropStore } from '#/store';
import * as echarts from '@vben/plugins/echarts';

const chartRef = ref<EchartsUIType>();
const { renderEcharts } = useEcharts(chartRef);

const option = {
  backgroundColor: "transparent", // 核心修改
   "legend": {
      "x": "center",
      "textStyle": {
         "color": "#6F87B1",
         "fontSize": 12
      },
      "top": 12,
      "itemWidth": 12,
      "itemHeight": 12,
      "itemGap": 5
   },
   "color": [
      {
         type: 'linear',
         x: 0,
         y: 0,
         x2: 0,
         y2: 1,
         colorStops: [
            {
               offset: 0,
               color: '#B4133D'
            },
            {
               offset: 1,
               color: '#EE5959'
            }
         ]
      },
      {
         type: 'linear',
         x: 0,
         y: 0,
         x2: 0,
         y2: 1,
         colorStops: [
            {
               offset: 0,
               color: '#F39800'
            },
            {
               offset: 1,
               color: '#F4D879'
            }
         ]
      },
      {
         type: 'linear',
         x: 0,
         y: 0,
         x2: 0,
         y2: 1,
         colorStops: [
            {
               offset: 0,
               color: '#0A6BC5'
            },
            {
               offset: 1,
               color: '#45A5DB'
            }
         ]
      },
      {
         type: 'linear',
         x: 0,
         y: 0,
         x2: 0,
         y2: 1,
         colorStops: [
            {
               offset: 0,
               color: '#16C231'
            },
            {
               offset: 1,
               color: '#82EF93'
            }
         ]
      },
   ],
   "tooltip": {
      "trigger": "axis",
      "axisPointer": {
         "type": "shadow"
      },
      textStyle: {
         color: "rgba(255, 255, 255, 1)"
      },
      backgroundColor: "rgba(0,0,0,0.8)",
      borderColor: "rgba(219, 230, 255, 0.8)",

   },
   xAxis: {
      "data": [
         "大一", "大二", "大三", "大四",
      ],
      //name: '日',
      axisLabel: {
         color: "#fff",
         fontSize: 12,
      },
      axisLine: {
         lineStyle: {
            color: '#8778D2FF'
         }
      },
      axisTick: {
         show: false
      }
   },
   yAxis: {
      nameTextStyle: {
         color: "#6F87B1",
         fontSize: 12,
      },
      axisLabel: {
         color: "#fff",
         fontSize: 12,
      },
      axisLine: {
         lineStyle: {
            color: '#A9AEB2'
         }
      },
      axisTick: {
         lineStyle: {
            color: '#A9AEB2'
         }
      },
      splitLine: {
         "show": true,
         "lineStyle": {
            "color": [
               "#8778D2FF"
            ],
            "width": 1,
            "type": 'dashed'
         },
      },
   },
   grid: {
    left: "3%",
    right: "3%",
    bottom: "5%",
    top: "20%",
    containLabel: true,
  },
   series: [
      {
         name: "不及格",
         type: "bar",
         stack: "total",
         label: {
            show: false,
            color: "#FFFFFF",
         },
         itemStyle: {
            borderRadius: [0, 0, 0, 0],
         },
         barWidth: 20,
         emphasis: {
            focus: "series",
         },
         data: [2, 3, 2, 2],
      },
      {
         name: "及格",
         type: "bar",
         stack: "total",
         label: {
            show: false,
            color: "#FFFFFF",
            formatter: "{a}",
         },
         emphasis: {
            focus: "series",
         },
         data: [2, 3, 2, 2],
      },
      {
         name: "良好",
         type: "bar",
         stack: "total",
         label: {
            show: false,
            color: "#FFFFFF",
            formatter: "{a}",
         },
         emphasis: {
            focus: "series",
         },
         data: [2, 3, 2, 2],
      },
      {
         name: "优秀",
         type: "bar",
         stack: "total",
         label: {
            show: false,
            color: "#FFFFFF",
            formatter: "{a}",
         },
         itemStyle: {
            borderRadius: [0, 0, 0, 0],
         },
         emphasis: {
            focus: "series",
         },
         data: [2, 3, 2, 2],
      },
   ],
}





const query = async () => {
  const response = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/command/queryMonthType',{});
  let list = response;

  // 1. 获取所有不重复的 TYPE 类型
  const types = [...new Set(list.map(item => item.TYPE))];
  // 结果: ['BM202501', 'BM202502', 'BM202505']
  const nameMap = {};
  dropList.NSOS_CMD_TYPE.forEach(item => {
    nameMap[item.value] = item.label;
  });
  const result = types.map(code => nameMap[code] || code);

  // 2. 生成 1-12 月的完整月份数组
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  // 结果: [1, 2, 3, ..., 12]
  option.xAxis.data = months.map(m => `${m}月`);

  // 3. 为每个 TYPE 生成对应的数据系列
  const seriesData = types.map(type => {
    // 对每个月份，查找该 TYPE 对应的 COUNT 值
    const data = months.map(month => {
      const item = list.find(d => d.MONTH === month && d.TYPE === type);
      return item ? item.COUNTS : 0; // 找不到则返回 0
    });

    return data;
  });

  const series = result.map((name, index) => ({
    name: name,
    type: "bar",
    stack: "total",
    label: {
      show: true,
      color: "#FFFFFF",
      position: 'inside',
        fontSize: 10,
      formatter: function(param) {
        if (param.value && param.value > 0) {
          return param.value
        }
        return ''
      },
    },
    itemStyle: {
      borderRadius: [0, 0, 0, 0],
    },
    emphasis: {
      focus: "series",
    },
    data: seriesData[index],
  }));
  option.series = series;

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
