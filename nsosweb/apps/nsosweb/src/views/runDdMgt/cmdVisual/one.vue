<template>
  <div class="w-full h-full">
    <EchartsUI ref="chartRef" />
  </div>
</template>
<script setup>
import { EchartsUI, useEcharts } from '@vben/plugins/echarts'
import { requestClient } from '#/api/request'
import * as echarts from '@vben/plugins/echarts'
import { reactive, ref, onMounted, watch } from 'vue'
import { useVbenModal } from '@vben/common-ui'

const chartRef = ref()
const emit = defineEmits(['openFlqk'])
const { renderEcharts } = useEcharts(chartRef)
const dsInterval = ref()
const mapChart = ref()
const zzbmList = ref()
const dwbm = ref()

let myData3 = ['联庄村', '唐家堡村', '小山村', '高泉村', '寒树村', '寒水村', '中化村 ', '金华村', '好地掌村', '庙川村']
let jch = [40, 30, 20, 20, 60, 30, 10, 40, 20, 30, 40, 30, 20, 20]
let tph = [160, 300, 280, 180, 300, 240, 120, 340, 200, 250, 50, 160]
let csl = []
let option = {
  backgroundColor: 'transparent', // 核心修改点
  legend: {
    icon: 'rect',
    itemWidth: 14,
    itemHeight: 10,
    itemGap: 20,
    textStyle: {
      fontSize: 14,
      color: '#fff'
    },
    data: ['未超时', '超时数', '超时率'],
    selectedMode: false
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
      textStyle: {
        color: '#fff'
      }
    },
    textStyle: {
      color: '#fff'
    },
    backgroundColor: 'rgba(17,95,182,0.5)', //设置背景颜色
    formatter: function (params) {
      const villageName = params[0].name
      let jchValue = 0
      if (params[0].value) {
        jchValue = params[0].value
      }
      let tphValue = 0
      if (params[1].value) {
        tphValue = params[1].value
      }
      let cslValue = 0
      if (params[2].value) {
        cslValue = params[2].value
      }
      return `
        ${villageName}<br/>
        超时数：${tphValue} 条<br/>
        未超时数：${jchValue} 条<br/>
        超时率：${cslValue} %
      `
    }
  },
  grid: {
    left: '3%',
    right: '3%',
    bottom: '5%',
    top: '17%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: myData3,
    axisPointer: {
      type: 'shadow'
    },
    axisLabel: {
      fontSize: 12,
      color: '#fff',
      formatter: function (a) {
        if (a && a.length == 4) {
          return a.slice(0, 2) + '\n' + a.slice(2)
        }
        if (a && a.length > 4) {
          return a.slice(0, 3) + '\n' + a.slice(3)
        }
        return a
      },
      interval: 0,
      rotate: 0,
      margin: 15
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: '#1a5086'
      }
    },
    splitLine: {
      show: false
    },
    axisTick: {
      show: false
    }
  },
  yAxis: [
    {
      type: 'value',
      name: '(条)',
      nameTextStyle: {
        color: '#fff',
        fontSize: 14
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: 'rgba(45, 67, 119, 0.8)'
        }
      },
      min: 0,
      axisLabel: {
        show: true,
        color: '#fff'
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: true,
        lineStyle: {
          width: 0.5,
          color: '#1a5086',
          type: 'dashed'
        }
      }
    },
    {
      type: 'value',
      name: '(%)',
      position: 'right',
      nameTextStyle: {
        color: '#fff',
        fontSize: 14
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: 'rgba(45, 67, 119, 0.8)'
        }
      },
      min: 0,
      axisLabel: {
        show: true,
        color: '#fff'
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: true,
        lineStyle: {
          width: 0.5,
          color: '#1a5086',
          type: 'dashed'
        }
      }
    }
  ],
  series: [
    {
      data: tph,
      name: '未超时',
      type: 'bar',
      barWidth: '15px',
      stack: 'cmd',
      itemStyle: {
        color: 'rgba(80, 135, 236, 0.8)' // 固定颜色，无渐变
      },
      label: {
        show: true,
        position: 'inside',
        fontSize: 10,
        color: '#fff',
        formatter: '{c}'
      }
    },
    {
      data: jch,
      name: '超时数',
      type: 'bar',
      barWidth: '15px',
      stack: 'cmd',
      itemStyle: {
        color: '#1bc3d1' // 固定颜色，无渐变
      },
      label: {
        show: true,
        position: 'inside',
        fontSize: 10,
        color: '#fff',
        formatter: '{c}'
      }
    },
    {
      name: '超时率',
      data: csl,
      yAxisIndex: 1,
      showSymbol: true,
      smooth: true,
      type: 'line',
      itemStyle: {
        color: '#f9f419' // 固定颜色，无渐变
      }
    }
  ]
}

const refreshEcharts = async (zzmcData, zzbmData, csData, wcsData, cslData) => {
  option.xAxis.data = zzmcData
  zzbmList.value = zzbmData
  option.series[0].data = wcsData
  option.series[1].data = csData
  option.series[2].data = cslData
  mapChart.value = await renderEcharts(option)

  mapChart.value.on('click', function (params) {
    emit('openFlqk', zzbmList.value[params.dataIndex])
  })
}

defineExpose({ refreshEcharts })
</script>
