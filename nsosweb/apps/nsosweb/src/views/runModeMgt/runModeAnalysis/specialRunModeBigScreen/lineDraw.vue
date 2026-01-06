<template>
  <div style="margin-top: 20px;">
    <EchartsUI ref="lineChartRef" height="280px" />
  </div>
</template>
<script setup lang="ts">
import type { EchartsUIType } from '@vben/plugins/echarts'
// import type { EchartsUIType } from '@vben/plugins/echarts'
import { echarts, EchartsUI, useEcharts } from '@vben/plugins/echarts'
import {getSpecialRunModeStaticApi } from '#/api'
import { nextTick, onMounted, onUnmounted,computed, reactive, ref,watch } from 'vue'
import moment from 'moment'
const lineChartRef = ref<EchartsUIType>()
const renderLineEcharts = useEcharts(lineChartRef).renderEcharts;
const selectedType = defineModel('type')
const lineStartDate = defineModel('lineStartDate')
const lineEndDate = defineModel('lineEndDate')
let intervalLine: any
const XInterval = ref(1)  // 横坐标label显示间隔
const lineData = ref([])  // 折线图数据
const now = ref(moment().format('YYYY-MM-DD'))
onMounted(()=>{
  initLineChart()
})

/**
 * 获取折线图信息
 * 
 */
async function getSpecialRunModeStatic() {
  try {
    console.log('run')
    const res = await getSpecialRunModeStaticApi({
      startDate: lineStartDate.value,
      endDate: lineEndDate.value,
      type: selectedType.value
    })
    lineData.value = res
    option1.xAxis.data = lineData.value.map((item) => item.statisticsDate)
    // 为每个系列设置前后数据
    seriesConfig.forEach((config, index) => {
      const baseIdx = index * 2 // 每个系列占2个位置（before和after）
      // before数据
      option1.series[baseIdx].data = splitDataByDate(
        lineData.value.map((item) => ({
          date: item.statisticsDate,
          value: item[config.key]
        })),
        now.value,
        'before'
      )

      // after数据
      option1.series[baseIdx + 1].data = splitDataByDate(
        lineData.value.map((item) => ({
          date: item.statisticsDate,
          value: item[config.key]
        })),
        now.value,
        'after'
      )
      
    })
    await renderLineEcharts(option1)
    // renderLineEcharts(option1, true)
  } catch (error) {
  }
}

/**
 * 监听，总部/全网切换时，刷新
 * 
 */

// 使用计算属性判断是否应该获取数据
const shouldFetchData = computed(() => {
  console.log('run1')
  return lineStartDate.value && lineEndDate.value && selectedType.value
})

// 监听计算属性
watch(shouldFetchData, (newVal) => {
  console.log('run2',newVal)
  if (newVal) {
    getSpecialRunModeStatic()
  }
}, { immediate: true })

/**
 * 初始化折线图
 */
async function initLineChart(){
  await renderLineEcharts(option1)
}

const option1 = {
  tooltip: {
    show: true,
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    formatter: function (params) {
      // 过滤掉没有值的系列
      const validParams = params.filter((item) => {
        return item.value !== '-' && item.value !== null && item.value !== undefined
      })

      // 如果没有有效数据，返回空
      if (validParams.length === 0) return ''

      // 按系列名称分组，只保留每组第一个有效数据
      const seriesMap = {}
      validParams.forEach((item) => {
        if (!seriesMap[item.seriesName]) {
          seriesMap[item.seriesName] = item
        }
      })

      // 构建tooltip内容
      let result = params[0].axisValue + '<br/>'
      Object.values(seriesMap).forEach((item) => {
        result += `${item.marker} ${item.seriesName}: ${item.value}<br/>`
      })

      return result
    }
  },
  legend: {
    data: ['正常', '转冷备', '限时', '白名单', '限时白名单'],
    textStyle: {
      color: '#fff',
      fontSize: 12
    },
    top: '0%'
  },
  grid: {
    borderWidth: 0,
    left:'10%',
    top: '15%',
    bottom: '30%',
    right: '15px',
    textStyle: {
      color: '#fff'
    }
  },
  dataZoom: [
    {
      type: 'inside',
      xAxisIndex: 0,
      startValue: 60,
      end: 100,
      zoomOnMouseWheel: true,
      moveOnMouseMove: true
    }
  ],
  xAxis: {
    type: 'category',
    splitLine: {
      show: false,
    },
    axisTick: { show: false },
    splitArea: { show: false },
    axisLabel: {
      margin: 15,
      formatter: (value) => value,
      color: '#ffffff',
      fontSize: '10px',
      rotate: 30
    },
    axisLine: {
      show: false,
      lineStyle: { color: '#ffffff' }
    },
    data: lineData.value.map((item) => item.statisticsDate)
  },
  yAxis: {
    type: 'value',
    axisLine: {
      show: false,
      lineStyle: { color: '#1C82C5' }
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: 'rgba(4, 187, 255, .2)',
        type: 'solid'
      }
    },
    axisLabel: {
      textStyle: {
        color: '#fff',
        fontSize: '13px'
      }
    },
    axisTick: { show: false }
  },
  series: [
    {
      name: '正常',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      itemStyle: {
        color: '#5CFFBE' // 绿色
      },
      markLine: {
        symbol: 'none',
        data: [{ xAxis: now.value }],
        label: {
          show: true,
          position: 'end',
          formatter: ''
        },
        lineStyle: {
          color: '#F13310',
          type: 'dashed'
        }
      },
      lineStyle: {
        width: 3,
        color: '#5CFFBE',
        type: 'solid'
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(92, 255, 190, 0.3)' },
          { offset: 1, color: 'rgba(92, 255, 190, 0.05)' }
        ])
      },
      data: splitDataByDate(
        lineData.value.map((item) => ({
          date: item.statisticsDate,
          value: item.allOpen
        })),
        now.value,
        'before'
      )
    },
    {
      name: '正常',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 4,
      itemStyle: {
        color: '#5CFFBE' // 绿色
      },
      lineStyle: {
        width: 2,
        color: '#5CFFBE',
        type: 'dotted'
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(92, 255, 190, 0.3)' },
          { offset: 1, color: 'rgba(92, 255, 190, 0.05)' }
        ])
      },
      data: splitDataByDate(
        lineData.value.map((item) => ({
          date: item.statisticsDate,
          value: item.allOpen
        })),
       now.value,
        'after'
      )
    },
    {
      name: '转冷备',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      itemStyle: {
        color: '#F75D54' // 红色
      },
      lineStyle: {
        width: 3,
        color: '#F75D54',
        type: 'solid'
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(247, 93, 84, 0.3)' },
          { offset: 1, color: 'rgba(247, 93, 84, 0.05)' }
        ])
      },
      data: splitDataByDate(
        lineData.value.map((item) => ({
          date: item.statisticsDate,
          value: item.allClose
        })),
        now.value,
        'before'
      )
    },
    {
      name: '转冷备',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 4,
      itemStyle: {
        color: '#F75D54' // 红色
      },
      lineStyle: {
        width: 2,
        color: '#F75D54',
        type: 'dotted'
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(247, 93, 84, 0.3)' },
          { offset: 1, color: 'rgba(247, 93, 84, 0.05)' }
        ])
      },
      data: splitDataByDate(
        lineData.value.map((item) => ({
          date: item.statisticsDate,
          value: item.allClose
        })),
        now.value,
        'after'
      )
    },
    {
      name: '限时',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      itemStyle: {
        color: '#3B96FF' // 蓝色
      },
      lineStyle: {
        width: 3,
        color: '#3B96FF',
        type: 'solid'
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(59, 150, 255, 0.3)' },
          { offset: 1, color: 'rgba(59, 150, 255, 0.05)' }
        ])
      },
      data: splitDataByDate(
        lineData.value.map((item) => ({
          date: item.statisticsDate,
          value: item.timeLimited
        })),
        now.value,
        'before'
      )
    },
    {
      name: '限时',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 4,
      itemStyle: {
        color: '#3B96FF' // 蓝色
      },
      lineStyle: {
        width: 2,
        color: '#3B96FF',
        type: 'dotted'
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(59, 150, 255, 0.3)' },
          { offset: 1, color: 'rgba(59, 150, 255, 0.05)' }
        ])
      },
      data: splitDataByDate(
        lineData.value.map((item) => ({
          date: item.statisticsDate,
          value: item.timeLimited
        })),
        now.value,
        'after'
      )
    },
    {
      name: '白名单',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      itemStyle: {
        color: '#E4C827' // 黄色
      },
      lineStyle: {
        width: 3,
        color: '#E4C827',
        type: 'solid'
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(228, 200, 39, 0.3)' },
          { offset: 1, color: 'rgba(228, 200, 39, 0.05)' }
        ])
      },
      data: splitDataByDate(
        lineData.value.map((item) => ({
          date: item.statisticsDate,
          value: item.whitelist
        })),
        now.value,
        'before'
      )
    },
    {
      name: '白名单',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 4,
      itemStyle: {
        color: '#E4C827' // 黄色
      },
      lineStyle: {
        width: 2,
        color: '#E4C827',
        type: 'dotted'
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(228, 200, 39, 0.3)' },
          { offset: 1, color: 'rgba(228, 200, 39, 0.05)' }
        ])
      },
      data: splitDataByDate(
        lineData.value.map((item) => ({
          date: item.statisticsDate,
          value: item.whitelist
        })),
        now.value,
        'after'
      )
    },
    {
      name: '限时白名单',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      itemStyle: {
        color: '#834EFF' // 紫色
      },
      lineStyle: {
        width: 3,
        color: '#834EFF',
        type: 'solid'
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(131, 78, 255, 0.3)' },
          { offset: 1, color: 'rgba(131, 78, 255, 0.05)' }
        ])
      },
      data: splitDataByDate(
        lineData.value.map((item) => ({
          date: item.statisticsDate,
          value: item.limitedWhitelist
        })),
        now.value,
        'before'
      )
    },
    {
      name: '限时白名单',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 4,
      itemStyle: {
        color: '#834EFF' // 紫色
      },
      lineStyle: {
        width: 2,
        color: '#834EFF',
        type: 'dotted'
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(131, 78, 255, 0.3)' },
          { offset: 1, color: 'rgba(131, 78, 255, 0.05)' }
        ])
      },
      data: splitDataByDate(
        lineData.value.map((item) => ({
          date: item.statisticsDate,
          value: item.limitedWhitelist
        })),
        now.value,
        'after'
      )
    }
  ]
}

// 各类关键词
const seriesConfig = [
  { key: 'allOpen', name: '正常', color: '#5CFFBE' },
  { key: 'allClose', name: '转冷备', color: '#F75D54' },
  { key: 'timeLimited', name: '限时', color: '#3B96FF' },
  { key: 'whitelist', name: '白名单', color: '#E4C827' },
  { key: 'limitedWhitelist', name: '限时白名单', color: '#834EFF' }
]


/**
 * @description 返回曲线图各类数据
 * @param data
 * @param splitDate
 * @param flag  判断返回过去实线数据/未来虚线数据
 */
function splitDataByDate(data, splitDate, flag) {
  const beforeSplit = []
  const afterSplit = []

  data.forEach((item) => {
    if (item.date < splitDate) {
      beforeSplit.push(item.value)
      afterSplit.push('-')
    } else if (item.date === splitDate) {
      beforeSplit.push(item.value)
      afterSplit.push(item.value)
    } else {
      afterSplit.push(item.value)
    }
  })

  return flag === 'before' ? beforeSplit : afterSplit
}
</script>

