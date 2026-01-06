<script setup lang="ts">
import type { EchartsUIType } from '@vben/plugins/echarts'

import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue'

import { echarts, EchartsUI, useEcharts } from '@vben/plugins/echarts'

import { ArrowLeftBold, ArrowRightBold } from '@element-plus/icons-vue'
import { ElButton, ElDialog, ElInput, ElRadioButton, ElRadioGroup, ElTable, ElTableColumn, ElMessage } from 'element-plus'
import moment from 'moment'

import { getSpecialRunModeData, getStaticDateRangeApi, getRunModeLeftDataApi, getRunModeRightDataApi, getSpecialRunModeChangeApi, getPageTitleApi } from '#/api'
// import bgHome3 from '#/assets/images/specialRunMode/bg-home3.png';
import bgHome3 from '#/assets/images/specialRunMode/4.0bg.gif'
// import bgHome6 from '#/assets/images/specialRunMode/bg-home6.png';
import bgHome1 from '#/assets/images/specialRunMode/bg-home1.png'
import bgHome2 from '#/assets/images/specialRunMode/bg-home2.png'
import bgHome from '#/assets/images/specialRunMode/bg-home.png'
import iconCircle1 from '#/assets/images/specialRunMode/icon-circle1.png'
import iconCircle2 from '#/assets/images/specialRunMode/icon-circle2.png'
import iconDown from '#/assets/images/specialRunMode/icon-down.png'
// import sunny from '#/assets/images/specialRunMode/sunny.png';
// import bgHome from '#/assets/images/specialRunMode/bg-home2.png';
import iconUp from '#/assets/images/specialRunMode/icon-up.png'
import iconInternet from '#/assets/images/specialRunMode/Internet1.png'
import iconHead from '#/assets/images/specialRunMode/isHead.png'

import DetailOfStage from './detailOfStage.vue'
import DetailOfSystem from './detailOfSystem.vue'
import LineChart from './lineDraw.vue'
import ChangeDetails from './changeDetails.vue'

defineOptions({
  name: 'SpecialRunModeBigScreen'
})

let interVal: any
const timeStr = ref<any | string>('')
const isLoading = ref(false)
const systemScopeType = ref('all')
let unit = ''
let sysName = ''
const lineChartKey = ref(0)
const type = ref(1)
const searchSystemName = ref('')
const chartType = ref('bar')
const leftTopChartRef = ref<EchartsUIType>()
// const renderEcharts = useEcharts(leftTopChartRef).renderEcharts;
const { renderEcharts } = useEcharts(leftTopChartRef)
const pageTitle = ref('公司信息系统运行方式')
const sysChangeTitle = ref('系统运行方式变化详情')
let intervalId: any
const dialogData = ref({
  visible: false
})
const stageDialogVisible = ref(false)
const changeListVisible = ref(false) // 系统变化详情弹窗
const currentChangeList = ref([])  // 存放当前点击的系统变化详情
const currentChangeType = ref('1') //点击环比/关键系统标志位
const tableData = ref([])
const sysNum = ref(0)
const sysType = ref('2')
const dialogTitle = ref('')
const categoryUnitName = ref('')
const tableRef = ref()
const systemList = reactive({
  allOpenList: [],
  timeLimitedList: [],
  whitelistList: [],
  limitedAndWhitelistList: [],
  allCloseList: []
})
const lineStartDate = ref('')
const lineEndDate = ref('')
// const timeLimitedList = ref([]);
// const whitelistList = ref([]);
// const limitedAndWhiteList = ref([]);
// const allCloseList = ref([]);
const systemTypeList = ref([
  {
    systemType: 1,
    text: '正常开放',
    color: '#5CFFBE',
    allNum: 0,
    cruxNum: 0,
    ratioNum: 0,
    key: 'allOpenList',
    changeVal: 'allOpenChangeList',
    keyChangeVal: 'allOpenKeySysList',
    into: 0,
    out: 0
  },
  {
    systemType: 2,
    text: '限时开放',
    color: '#3B96FF',
    allNum: 0,
    cruxNum: 0,
    ratioNum: 0,
    key: 'timeLimitedList',
    changeVal: 'timeLimitedChangeList',
    keyChangeVal: 'timeLimitedKeySysList',
    into: 0,
    out: 0
  },
  {
    systemType: 3,
    text: '白名单开放',
    color: '#E4C827',
    allNum: 0,
    cruxNum: 0,
    ratioNum: 0,
    key: 'whitelistList',
    changeVal: 'whitelistChangeList',
    keyChangeVal: 'whitelistKeySysList',
    into: 0,
    out: 0
  },
  {
    systemType: 4,
    text: '限时+白名单开放',
    color: '#834EFF',
    allNum: 0,
    cruxNum: 0,
    ratioNum: 0,
    key: 'limitedAndWhitelistList',
    changeVal: 'limitedAndWhitelistChangeList',
    keyChangeVal: 'limitedAndWhitelistKeySysList',
    into: 0,
    out: 0
  },
  {
    systemType: 5,
    text: '转冷备',
    color: '#F75D54',
    allNum: 0,
    cruxNum: 0,
    ratioNum: 0,
    key: 'allCloseList',
    changeVal: 'allCloseChangeList',
    keyChangeVal: 'allCloseKeySysList',
    into: 0,
    out: 0
  }
])

const changeList = ref({
})
// 倒计时
const clockInterVal = () => {
  const now = moment()
  let weekDay = ''
  switch (now.weekday()) {
    case 0: {
      weekDay = '星期日'
      break
    }
    case 1: {
      weekDay = '星期一'
      break
    }
    case 2: {
      weekDay = '星期二'
      break
    }
    case 3: {
      weekDay = '星期三'
      break
    }
    case 4: {
      weekDay = '星期四'
      break
    }
    case 5: {
      weekDay = '星期五'
      break
    }
    case 6: {
      weekDay = '星期六'
      break
    }
  }
  timeStr.value = now.format(`YYYY年MM月DD日 ${weekDay}`)
  // timeStr.value = now.format(`YYYY年MM月DD日 HH:mm:ss ${weekDay}`);
}

/**
 * 绘制柱状图信息
 */
const xAxisData = ref([])
const seriesData = ref([])
const searchNameData = ref([])

const option = {
  // backgroundColor: '#031528',
  tooltip: {
    show: true,
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    formatter: (params) => {
      // 确保 params 是数组且不为空
      if (params && params.length > 0) {
        return `${params[0].name}: ${params[0].value}`
      }
      return ''
    }
  },
  grid: {
    borderWidth: 0,
    top: '8%',
    bottom: '30%',
    right: '15px',
    textStyle: {
      color: '#fff'
    }
  },
  calculable: true,
  xAxis: [
    {
      type: 'category',
      splitLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitArea: {
        show: false
      },
      axisLabel: {
        interval: 0,
        margin: 15,
        formatter(value) {
          // 每4个字符插入换行符
          return value.replace(/(.{10})/g, '$1\n')
        },

        color: '#ffffff',
        fontSize: '10px',
        // fontWeight: 600,
        rotate: 30
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: '#ffffff'
        }
      },
      data: xAxisData.value
    }
  ],
  yAxis: {
    type: 'value',
    axisLine: {
      show: false,
      lineStyle: {
        color: '#1C82C5'
      }
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
    axisTick: {
      show: false
    }
  },

  series: [
    {
      name: '',
      type: 'bar',
      stack: '总量',
      barMaxWidth: 15,
      barGap: '10%',
      itemStyle: {
        normal: {
          show: true,
          color: new echarts.graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [
              {
                offset: 1,
                color: '#084EB8'
              },
              {
                offset: 0,
                color: '#CAE4FE'
              }
            ],
            false
          ),
          borderRadius: [1, 1, 0, 0], // 顶部圆角
          borderColor: '#CAE4FE80', // 边框颜色
          borderWidth: 1, // 边框宽度
          label: {
            show: true,
            position: 'top',
            color: '#56C1F8',
            formatter(p) {
              return p.value > 0 ? p.value : ''
            }
          }
        }
      },
      data: seriesData.value
    }
  ]
}

// 初始化图表
const chartInstance = ref()
const init = async () => {
  chartInstance.value = await renderEcharts(option)
  if (chartInstance.value) {
    chartInstance.value.getZr().on('click', (params) => {
      const pointInPixel = [params.offsetX, params.offsetY]
      if (chartInstance.value.containPixel('grid', pointInPixel)) {
        const xIndex = chartInstance.value.convertFromPixel({ seriesIndex: 0 }, pointInPixel)[0]

        // 获取对应的 searchNameData 值
        const unitFullName = searchNameData.value[xIndex] || ''
        getInfoByUnit(unitFullName) // 传递完整单位名称
      }
    })
  }
}

// 更新图表
const updateChart = () => {
  if (!xAxisData.value || !seriesData.value) {
    console.error('xAxisData or seriesData is not defined')
    return
  }
  option.xAxis[0].data = [...xAxisData.value]
  option.series[0].data = [...seriesData.value]
  renderEcharts(option, true)
  // if (chartInstance.value) {
  //   chartInstance.value.setOption(option, true);
  // }
}

/**
 * 获取标题
 */
// pageTitle
async function getPageTitle(){
  try {
    const res = await getPageTitleApi()
    pageTitle.value= res
  } catch (error) {
    
  }
}

/**
 * 获取运行方式变更记录
 */
async function getSpecialRunModeChange() {
  try {
    const res = await getSpecialRunModeChangeApi({
      type: type.value,
      pageNo: 1,
      pageSize: 10000
    })
    tableData.value = res.list
  } catch (error) {
     isLoading.value = false
  }
}

/**
 * 实时获取特殊运行方式数据
 */
const systemTypeKeys = [
  {
    key: 'allOpen',
    cruxKey: 'allOpenKeySys',
    yesterday: 'allOpenYesterday',
    yesterdayKey: 'allYesterdayOpen',
    today: 'allOpenToday',
    changeVal: 'allOpenChangeList',
  },
  {
    key: 'timeLimited',
    cruxKey: 'timeLimitedKeySys',
    yesterday: 'timeLimitedYesterday',
    yesterdayKey: 'allYesterdayLimeLimited',
    today:'timeLimitedToday',
    changeVal: 'timeLimitedChangeList',
  },
  {
    key: 'whitelist',
    cruxKey: 'whitelistKeySys',
    yesterday: 'whitelistYesterday',
    yesterdayKey: 'allYesterdayWhitelist',
    today:'whitelistToday',
     changeVal: 'whitelistChangeList',
  },
  {
    key: 'limitedAndWhitelist',
    cruxKey: 'limitedAndWhitelistKeySys',
    yesterday: 'limitedAndWhitelistYesterday',
    yesterdayKey: 'allYesterdayLimitedAndWhitelist',
    today:'limitedAndWhitelistToday',
    changeVal: 'limitedAndWhitelistChangeList',
  },
  {
    key: 'allClose',
    cruxKey: 'allCloseKeySys',
    yesterday: 'allCloseYesterday',
    yesterdayKey: 'allYesterdayClose',
    today: 'allCloseToday',
    changeVal: 'allCloseChangeList',
  }
]

/**
 * 获取运行方式左侧数据
 */
async function getRunModeLeftData(){
  try {
    const res = await getRunModeLeftDataApi({
      type: type.value
    })

    sysNum.value = 0
    // // 1. 更新柱状图
    xAxisData.value = res.unitStatisticsList.map((item) => item.unitShortName)
    searchNameData.value = res.unitStatisticsList.map((item) => item.unitName)
    seriesData.value = res.unitStatisticsList.map((item) => Number(item.num))

    // 2. 更新左上角运行系统数据
    changeList.value = res
    const headList = [1455, 149, 264, 60, 219]
    const branchList = [140, 15, 31, 7, 20]
    systemTypeKeys.forEach((item, index) => {
      if(type.value===1){
         systemTypeList.value[index].allNum = headList[index]
      } else if (type.value=== 2){
        systemTypeList.value[index].allNum = branchList[index]
      }
      if(item.cruxKey === 'allCloseKeySys'){
        systemTypeList.value[index].cruxNum = 0
      } else {
         systemTypeList.value[index].cruxNum = res[item.cruxKey] || 0
      }
     
      systemTypeList.value[index].ratioNum = res[item.key] - res[item.yesterdayKey] || 0
      sysNum.value = systemTypeList.value[index].allNum + sysNum.value
      systemTypeList.value[index].into = res[item.changeVal].filter(x => x.changeType === 1).length
      systemTypeList.value[index].out = res[item.changeVal].filter(x => x.changeType === 2).length
    })

    // 3. 更新视图
    updateChart(systemTypeKeys)
    
  } catch (error) {
    
  }
}

/**
 * 获取运行方式右侧数据
 */
async function getRunModeRightData(unit?: string, sysName?: string){
  try {
    isLoading.value = true
    const res = await getRunModeRightDataApi({
      categoryUnitName: unit || '',
      deploySystemName: sysName || '',
      type: type.value
    })
    isLoading.value = false
    systemList.allOpenList = res.allOpenList
    systemList.timeLimitedList = res.timeLimitedList
    systemList.whitelistList = res.whitelistList
    systemList.limitedAndWhitelistList = res.limitedAndWhitelistList
    systemList.allCloseList = res.allCloseList
    const headList = [1455, 149, 264, 60, 219]
    const branchList = [140,15,31,7,20]
    if(type.value===1){
      systemTypeKeys.forEach((type, index) => {
        systemTypeList.value[index].yesterday = headList[index]
        systemTypeList.value[index].today = headList[index]
      })
    } else if(type.value===2){
      systemTypeKeys.forEach((type, index) => {
        systemTypeList.value[index].yesterday = branchList[index]
        systemTypeList.value[index].today = branchList[index]
      })
    }


    if (res.searchFlag === 0 && sysName) {
      nextTick(() => {
        ElMessage.warning('未查询到系统!')
      })
    }
    
  } catch (error) {
  isLoading.value = false 
  }
}

/**
 * 获取曲线图统计时间范围
 */
async function getStaticDateRange(){
  try {
    const res =await getStaticDateRangeApi()
    lineStartDate.value = res.startDate
    lineEndDate.value = res.endDate
  } catch (error) {
    
  }
}
// 按系统名称查询
async function getDataBySystemName() {
  // unit = ''
  sysName = searchSystemName.value
  getRunModeRightData(unit, sysName)
}

// 按单位名称查询
async function getInfoByUnit(unitName: string) {
  unit = unitName
  // sysName = ''
  searchSystemName.value = ''
  getRunModeRightData(unit, sysName)
}

// 查询重置
function resetSystemData() {
  sysName = ''
  unit = ''
  searchSystemName.value = ''
  getRunModeRightData(unit, sysName)
}

// 刷新整个大屏
async function refreshSystemData() {
  unit = ''
  sysName = ''
  searchSystemName.value = ''
  getRunModeLeftData()
  getRunModeRightData(unit, sysName)
  getSpecialRunModeChange()

}

// 全网/总部切换
function onSystemScopeChange() {
  unit = ''
  sysName = ''
  if (systemScopeType.value === 'all') {
    type.value = 1
    // getRunModeData(unit, sysName)
    getRunModeLeftData()
    getRunModeRightData()
    getSpecialRunModeChange()
  } else {
    type.value = 2
    // getRunModeData(unit, sysName)
    getRunModeLeftData()
    getRunModeRightData()
    getSpecialRunModeChange()
  }
  if (chartType.value === 'line') {
    // 通过改变 key 强制重新渲染组件
    lineChartKey.value++
  }
  // console.log('systemScopeType==', systemScopeType.value);
}


/**
 * 攻击阶段切换
 */
const stageBackgrounds = [`url(${bgHome})`, `url(${bgHome1})`, `url(${bgHome2})`, `url(${bgHome3})`]
const currentStage = ref(0)
const homePageRef = ref(null)
function nextStage() {
  if (currentStage.value === 3) return
  currentStage.value += 1
  if (homePageRef.value) {
    homePageRef.value.style.backgroundImage = stageBackgrounds[currentStage.value]
  }
}
function prevStage() {
  if (currentStage.value === 0) return
  currentStage.value -= 1
  if (homePageRef.value) {
    homePageRef.value.style.backgroundImage = stageBackgrounds[currentStage.value]
  }
}

// 单位/日期切换
function chartTypeChange(){
  if(chartType.value === 'bar'){
    renderEcharts(option, true)
  }

}

/**
 * 打开弹窗
 * @param val
 */
// 运行方式时刻信息
const openDialog = (val: string, categoryName: string, type: string) => {
  dialogTitle.value = val
  categoryUnitName.value = categoryName
  sysType.value = type
  dialogData.value.visible = true
}


/**
 * 打开系统变化详情
 * @param key 运行方式类别键值名
 * @param type '1'：环比变化；'2'：关键信息系统
 */
function openChangeDetail(key,type, title) {
  if(type==='1' || key==='allCloseKeySysList'){
    currentChangeList.value = []
  } else{
    currentChangeList.value = changeList.value[key]
  }
  
  currentChangeType.value = type
  sysChangeTitle.value = title
  changeListVisible.value = true
}

// 运行方式阶段全局展示
function stageDialog() {
  stageDialogVisible.value = true
}

onMounted(async () => {
  getPageTitle()
  init()
  getPageTitle()
  getStaticDateRange()
  getRunModeLeftData()
  getRunModeRightData(unit, sysName)
  getSpecialRunModeChange()

  intervalId = setInterval(() => {
    // getRunModeData(unit, sysName);
    getRunModeLeftData()
    getRunModeRightData(unit, sysName)
    getSpecialRunModeChange();
    if (chartType.value === 'line') {
      // 通过改变 key 强制重新渲染组件
      lineChartKey.value++
    }
  }, 3_600_000);
  interVal = setInterval(() => {
    clockInterVal();
  }, 1000);
})

// 在组件卸载时清除定时器，防止内存泄漏
onUnmounted(() => {
  if (interVal) clearInterval(interVal)
  if (intervalId) clearInterval(intervalId)
  if (chartInstance.value) {
    chartInstance.value.off('click')
    chartInstance.value.dispose()
  }
})
</script>

<template>
  <div class="home-page flex flex-col" ref="homePageRef">
    <div class="page-title">
      <!-- 残特奥会运行方式 -->
       {{ pageTitle }}
    </div>
    <div class="title">
      <div class="weather">
        <!-- <div>
          当前阶段:
          <el-icon
            :size="20"
            style="color: #d1ebf3; vertical-align: -3px"
            @click="prevStage"
          >
            <ArrowLeftBold />
          </el-icon>
          攻击{{ currentStage + 1 }}.0
          <el-icon
            :size="20"
            style="color: #d1ebf3; vertical-align: -3px"
            @click="nextStage"
          >
            <ArrowRightBold />
          </el-icon>
        </div>
        <div class="btn-text" @click="stageDialog">阶段总览</div> -->
      </div>
      <div class="time">
        {{ timeStr }}
      </div>
    </div>
    <div class="flex flex-col" style="flex: 1; min-height: 0">
      <!-- 头部功能按钮区 -->
      <div class="header">
        <ElRadioGroup v-model="systemScopeType" class="type-select" @change="onSystemScopeChange">
          <ElRadioButton label="全网" value="all" />
          <ElRadioButton label="总部" value="headOffice" />
        </ElRadioGroup>

        <div>
          <!-- @keyup.enter="getDataBySystemName" class="search-input" -->
          <el-input v-model="searchSystemName" class="search-input" placeholder="请输入系统名称" />
          <ElButton type="primary" @click="getDataBySystemName"> 查询 </ElButton>
          <ElButton type="primary" @click="resetSystemData">重置</ElButton>
          <ElButton type="primary" @click="refreshSystemData">刷新</ElButton>
          <!-- <el-button type="default">下线</el-button> -->
        </div>
      </div>

      <div class="main">
        <div class="left">
          <div class="left-top">
            <div style="float: right">
                  <el-radio-group
                    v-model="chartType"
                    class="type-select-two"
                    @change="chartTypeChange"

                  >
                    <el-radio-button label="单位" value="bar" />
                    <el-radio-button label="日期" value="line" />
                  </el-radio-group>
              </div>
            <div class="title__text" >
              <span>信息系统&nbsp;</span>
              <span style="font-size: 13px; font-family: PingFang SC,PingFang SC; font-weight: 500;">(系统总量：{{type===1 ?'2147':'213' }})</span>

            </div>
            <div class="left-top-header flex">
              <div v-for="item in systemTypeList" :key="item.systemType" class="top-column">
                <div class="flex" style="justify-content: flex-start">
                  <div class="flex" style="justify-content: center">
                    <img :src="iconCircle1" style="width: 10px; height: 10px; margin-right: 5px" />
                    <span>{{ item.text }}:</span>
                  </div>
                  &nbsp; {{item.allNum }}
                </div>

                <div class="ratio-con flex" style="cursor: pointer;" @click="openChangeDetail(item.changeVal,'1', `${item.text}-信息系统运行方式变化详情`)">
                  <span style="color: #acacac; font-size: 10px">环比上升</span>
                  <!-- <span v-else style="color: #acacac; font-size: 10px">环比下降</span> -->
                  <img :src="iconUp" style="width: 8px; height: 10px; margin: 0 2px" />
                  <span
                    style="display: flex; align-items: center;"
                    >0 &nbsp;(<p style="color:#d54150; font-weight: 700;">&nbsp;0</p> &nbsp; <p style="color:#white; font-weight: 500;">|</p> &nbsp;<p style="color:#42FF48;  font-weight: 700;"> 0 &nbsp;</p> )</span
                  >
                  <!-- <span
                    style="display: flex; align-items: center;"
                    >10 &nbsp;(<p style="color:#d54150; font-weight: 700;">&nbsp;10</p> &nbsp; <p style="color:#white; font-weight: 500;">|</p> &nbsp;<p style="color:#42FF48;  font-weight: 700;"> 100 &nbsp;</p> )</span
                  > -->
                </div>
                <div class="flex" style="justify-content: flex-start; cursor: pointer;" @click="openChangeDetail(item.keyChangeVal,'2',`${item.text}-关键信息系统详情`)">
                  <div class="flex" style="justify-content: center">
                    <img :src="iconCircle2" style="width: 10px; height: 10px; margin-right: 5px" />
                    <span>关键信息系统：</span>
                  </div>
                  {{ item.cruxNum }}
                </div>
              </div>
            </div>

            <div v-show="chartType === 'bar' ">
              <EchartsUI ref="leftTopChartRef" height="280px" />
              <!-- <LineChart :type="type"></LineChart> -->
            </div>
            <div v-if="chartType === 'line'">
              <LineChart :key="lineChartKey" :type="type" :lineStartDate="lineStartDate" :lineEndDate="lineEndDate"></LineChart>
            </div>
            
          </div>
          <div class="left-bottom">
            <div class="title__text"> {{type===1?'全网':'总部'}}信息系统运行方式变更情况</div>
            <div>
              <ElTable ref="tableRef" :data="tableData" stripe max-height="375" style="margin-top: 0px">
                <ElTableColumn label="系统名称" align="center">
                  <template #default="scope">
                    <el-tooltip effect="dark" :content="scope.row.secondarySystemName" placement="top">
                      <span class="run-mode-desc">{{ scope.row.secondarySystemName }}</span>
                    </el-tooltip>
                  </template>
                </ElTableColumn>
                <ElTableColumn prop="businessDeptSystemResponsibleDeptName" label="业务部门" align="center">
                  <template #default="scope">
                    <el-tooltip effect="dark" :content="scope.row.businessDeptSystemResponsibleDeptName" placement="top">
                      <span class="run-mode-desc">{{ scope.row.businessDeptSystemResponsibleDeptName }}</span>
                    </el-tooltip>
                  </template>
                </ElTableColumn>
                <ElTableColumn prop="isNetwork" align="center" width="60">
                  <template #header>
                    <div style="white-space: normal; line-height: 1.5">是否<br />互联网</div>
                  </template>
                  <template #default="{ row, $index }">
                    <span v-if="row.isInternetApplication === 1">是</span>
                    <span v-else>否</span>
                  </template>
                </ElTableColumn>
                <ElTableColumn prop="originalMode" label="原方式" align="center" width="80" />
                <ElTableColumn prop="changedMode" label="变更后方式" align="center" width="80" />
                <ElTableColumn prop="changeDate" label="变更日期" align="center" width="80" />
                <ElTableColumn prop="executionSchedule" label="执行状态" align="center" width="60">
                  <template #default="{ row, $index }">
                    <span v-if="row.executeStatus === 1">已执行</span>
                    <span v-else>未执行</span>
                  </template>
                </ElTableColumn>
                <ElTableColumn prop="description" align="center">
                  <template #header>
                    <div style="white-space: normal; line-height: 1.5">运行方式<br />描述</div>
                  </template>
                  <template #default="scope">
                    <el-tooltip effect="dark" :content="scope.row.changedModeDesc" placement="top">
                      <span class="run-mode-desc" style="padding-right: 5px;">{{ scope.row.changedModeDesc }}</span>
                    </el-tooltip>
                  </template>
                </ElTableColumn>
              </ElTable>
            </div>
          </div>
        </div>

        <div class="right"  v-loading="isLoading" element-loading-text="加载中..." >
          <div class="right-top flex flex-col">
            <!-- <div class="icon-left-top"></div>
            <div class="icon-right-top"></div>
            <div class="icon-left-bottom"></div>
            <div class="icon-right-bottom"></div> -->
            <div class="box" v-for="(runModeitem, runModeIndex) in systemTypeList" >
              <div class="box-header">
                <div class="box-text">
                  {{ runModeitem.text }}
                  <span style="font-size: 13px; color: #ffffff">(今日系统数: {{ runModeitem.today || 0 }}</span>
                  <span style="font-size: 13px; color: #ffffff; margin-left: 12px">昨日系统数: {{ runModeitem.yesterday || 0 }})</span>
                </div>
                <div class="box-ico" :runModeType="runModeitem.text"></div>
              </div>
              <div class="right-content flex">
                <div ref="listRef" @click="openDialog(item.deploySystemName, item.categoryUnitName, item.type)" v-for="(item, index) in systemList[runModeitem.key]" :key="index">
                  <div
                    class="item-system"
                    :class="{
                      'bg-default': item.isAlarm === null || item.isAlarm === 0,
                      'bg-warning': item.isAlarm === 1
                    }"
                  >
                    <div class="item-box">
                      <el-tooltip :disabled="!item.specialRunModeDescription" :content="item.specialRunModeDescription" placement="top" effect="myCustomized">
                        <div
                          class="item-text"
                          :class="{
                            'text-highlight': item.isHighlight === 1
                          }"
                        >
                          {{ item.deploySystemName }}
                        </div>
                      </el-tooltip>
                    </div>
                    <div v-if="item.type === 2">
                      <el-tooltip content="总部系统" placement="top" effect="myCustomized">
                        <img :src="iconHead" alt=""  class="internet-icon" />
                      </el-tooltip>
                    </div>
                    <div v-if="item.isInternetApplication">
                      <el-tooltip content="互联网应用" placement="top" effect="myCustomized">
                        <img :src="iconInternet" alt=""  :class="item.type !== 2 ? 'internet-icon' : 'internet-icon1'" />
                      </el-tooltip>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ElDialog v-model="dialogData.visible" :title="dialogTitle" width="80%" top="50px" class="system-detail-dialog" style="min-width: 400px">
      <DetailOfSystem v-if="dialogData.visible" :title="dialogTitle" :categoryUnitName="categoryUnitName" :sysType="sysType" />
    </ElDialog>
    <ElDialog v-model="stageDialogVisible" title="阶段总览" width="80%" top="20px" class="system-detail-dialog">
      <DetailOfStage />
    </ElDialog>

    <ElDialog v-model="changeListVisible" :title='sysChangeTitle' width="70%" >
      <ChangeDetails :tableData="currentChangeList" :type="currentChangeType" />
    </ElDialog>
    

    
  </div>
</template>

<style lang="less" scoped>
:deep(.el-overlay),
:deep(.el-overlay-dialog) {
  width: 100%;
  top: 0px;
  left: 0px;
}
// v-loading 样式
:deep(.el-loading-mask) {
  background-color: transparent;
  // opacity: 0;
  // height: 80px;
  // width: 150px;
  // top: 50%;
  // left: 50%;
  // transform: translate(-50%, -50%);
}
:deep(.el-loading-spinner .el-loading-text) {
  color: #ffffff !important; /* 修改文本颜色 */
  font-size: 14px;
}
:deep(.el-loading-spinner .path) {
  stroke-width: 5px !important; /* 增加线条宽度 */
}

.search-input {
  display: inline;
  margin-right: 15px;

  :deep(.el-input__wrapper) {
    background-color: #1640a8; /* 蓝色背景 */
    border-color: white; /* 白色边框 */
    color: white; /* 白色文字 */
  }
  :deep(.el-input__inner) {
    color: white;
  }
}
.home-page {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: url('../../../../assets/images/specialRunMode/bg-home.png') no-repeat;
  // background-size: cover;
  background-size: 100% 100%;
  position: relative;
  // background-size: 100%;
  aspect-ratio: 16/9; /* 根据图片实际比例调整*/
  .page-title {
    position: absolute;
    top: 5.2vh;
    left: 37.5%;
    width: 25%;
    // font-size: 32px;
    // font-size: clamp(20px, 3vw, 32px); 
    font-size: calc(0.75vw + 16px);
    font-weight: 700;
    color: #ebecec;
    text-align: center;
    letter-spacing: 0.07em; 
    text-shadow: 3px 3px 8px rgba(0, 0, 0, 0.6);

    display: inline-block;
    transform: skew(-4deg);
  }
  .title,
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 48px 40px;
    // padding: 62px 40px 38px 40px;

    .time {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
      font-style: italic;
    }

    .weather {
      font-family:
        PingFang SC,
        PingFang SC;
      font-weight: 500;
      font-size: 22px;
      color: transparent;
      text-shadow: 0px 0px 6px #8ac2ff;
      text-align: left;
      font-style: normal;
      text-transform: none;
      background: linear-gradient(90deg, #b6daff 0%, #96d2ff 100%);
      -webkit-background-clip: text; /* 仅渐变作用于文字 */
      display: flex;
      align-items: center;
      justify-content: center;
      .btn-text {
        cursor: pointer;
        height: 25px;
        width: 75px;
        margin-left: 10px;
        font-weight: 400;
        font-size: 15px;
        color: #d1ebf3;
        text-shadow:
          2px 2px 2px rgba(17, 20, 22, 0.22),
          inset 0px 0px 1px #ffffff;
        text-align: center;
        line-height: 25px;
        background: url('../../../../assets/images/specialRunMode/bg-btn.png') no-repeat;
      }

      img {
        margin-right: 0.5em;
      }
    }
  }

  .header {
    padding: 0 40px;
    .type-select {
      margin: 0;
      --el-input-text-color: #b9daff;
      --el-input-icon-color: #b9daff;
      --el-text-color-placeholder: #b9daff;
      --el-text-color-regular: #ddd;
      --el-input-border: 1px solid #7ac9fb;
      --el-fill-color-blank: linear-gradient(90deg, rgba(8, 45, 123, 0.2) 0%, rgba(7, 51, 134, 0.5) 100%);

      &:deep(.el-input__wrapper.is-focus) {
        border: 1px solid #7ac9fb !important;
      }
      &:deep(.el-radio-button__inner) {
        background: rgba(1, 32, 123, 0.35);
        border: none;
      }
      &:deep(.el-input__wrapper.is-focus) {
        border: 1px solid #7ac9fb !important;
      }
      &:deep(.el-radio-button.is-active .el-radio-button__original-radio:not(:disabled) + .el-radio-button__inner) {
        background-color: rgba(158, 196, 255, 0.29);
        // opacity: 0.3;
      }
      &:deep(.el-radio-button .el-radio-button__inner) {
        border-radius: 0;
      }
    }

    // 搜索框样式
  }

  .main {
    display: grid;
    min-height: 0;
    /* 分2列 宽度比为 1:2 */
    grid-template-columns: 1.35fr 2fr;
    grid-template-rows: 1fr;
    grid-gap: 15px;
    flex: 1;
    padding: 10px 45px 60px 40px;

    .left {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;

      .left-top {
        flex: 1;
        width: 100%;
        background: url('../../../../assets/images/specialRunMode/bg-body.png') 100% no-repeat;
        background-size: 100% 100%;
        .left-top-header {
          padding: 20px 10px 20px 10px;
          color: white;
          font-size: 10px;
          justify-content: space-between;
          // gap: 12px;
          .top-column {
            margin-right: 2px;
            padding: 5px;
            min-width: 125px;
            background: url('../../../../assets/images/specialRunMode/bg-column.png') 100% no-repeat;
            background-size: 100% 100%;
          }
          .ratio-con {
            width: fit-content;
            justify-content: center;
            margin: 10px 0px 10px 0px;
            padding: 4px 0px 4px 15px;
            font-size: 9px;
            // background-color: #0b388d;
            border-radius: 2px;
          }
        }
      }

      .left-bottom {
        flex: 1;
        margin-top: 15px;
        width: 100%;
        // background: url('../../../../assets/images/specialRunMode/bg-left-top.png')
        //   no-repeat;
      }
    }

    .right {
      height: 100%;
      .right-top {
        position: relative;
        // padding: 10px;
        color: white;
        font-size: 12px;
        .box {
          border: 1px solid #2970ca;
          width: 100%;
          height: 163px;
          position: relative;
          margin-bottom: 10px;
          // overflow-y: auto;

          .box-header {
            background: url('../../../../assets/images/specialRunMode/bg-boxheader.png') no-repeat;
            // background-size: 100% 100%;
            height: 35px;
            // display: flex;
            // align-items: center;
            .box-text {
              // justify-content: center;
              padding-left: 40px;
              padding-top: 7px;
              font-family:
                PingFang SC,
                PingFang SC;
              font-weight: 500;
              font-size: 16px;
              line-height: 1.5;
              color: #cceeff;
              text-shadow: 0px 1px 8px rgba(0, 0, 0, 0.25);
            }
            .box-ico {
              position: absolute;
              right: 20px;
              top: 10px;
              height: 20px;
              width: 20px;
            }
            .box-ico[runModeType='正常开放'] {
              background: url('../../../../assets/images/specialRunMode/green.png') no-repeat;
            }
            .box-ico[runModeType='限时开放'] {
              background: url('../../../../assets/images/specialRunMode/blue.png') no-repeat;
            }
            .box-ico[runModeType='白名单开放'] {
              background: url('../../../../assets/images/specialRunMode/yellow.png') no-repeat;
            }
            .box-ico[runModeType='限时+白名单开放'] {
              background: url('../../../../assets/images/specialRunMode/purple.png') no-repeat;
            }
            .box-ico[runModeType='转冷备'] {
              background: url('../../../../assets/images/specialRunMode/red.png') no-repeat;
            }
          }
        }
        .right-content {
          padding-left: 20px;
          flex: 1;
          min-height: 0;
          height: 128px;
          flex-wrap: wrap;
          -ms-overflow-style: none; /* IE 和 Edge */
          scrollbar-width: none; /* Firefox */
          overflow: auto;
          .item-system {
            position: relative;
            width: 200px;
            height: 55px;
            margin: 5px;
            cursor: pointer;
            .item-box {
              height: 100%;
              width: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              // justify-content: space-between;
              .item-text {
                position: relative;
                text-align: center;
                font-weight: 600;
                font-size: 12px;
                color: #ffffff;
                // line-height: 1.5;
                text-shadow: inset 0px 0px 4px rgba(255, 255, 255, 0.47);
                margin: 0 25px;
              }
              .text-highlight {
                font-weight: bold;
                color: transparent; /* 文字透明 */
                background: linear-gradient(180deg, #31beff 0%, #ffffff 40%);
                -webkit-background-clip: text; /* 仅渐变作用于文字 */
                background-clip: text; /* 标准语法 */
                // padding: 0 25px;
                border: 1px solid #00bcff;
                padding: 5px;
              }
              > div:nth-child(2) {
                /* 选中第二个子元素 */
                align-self: stretch; /* 拉伸高度以匹配容器 */
                height: 100%; /* 确保高度充满 */
                display: flex;
                align-items: center; /* 内部垂直居中 */
              }
              .circle {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                // border: 1px solid white;
                flex-shrink: 0; /* 禁止被压缩 */
                margin-left: 5px;
                margin-right: 5px;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .inner-circle {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                border: 1px solid #032c8b;
                box-sizing: border-box;
              }
            }
            .internet-icon {
              position: absolute;
              top: 10px;
              left: 5px;
              width: 15px;
              height: 15px;
              // margin-top: 2px; /* 微调与第一行文本的视觉对齐 */
            }
            .internet-icon1 {
              position: absolute;
              top: 30px;
              left: 5px;
              width: 15px;
              height: 15px;
              // margin-top: 2px; /* 微调与第一行文本的视觉对齐 */
            }
          }
          .item-warning {
            position: absolute;
            top: 3px;
            right: 5px;
            width: 15px;
            height: 15px;
          }
          .bg-default {
            background: url('../../../../assets/images/specialRunMode/bg-item.png') no-repeat;
            background-size: 100% 100%;
          }
          .bg-warning {
            background: url('../../../../assets/images/specialRunMode/bg-warnning.png') no-repeat;
            background-size: 100% 100%;
          }
          // .item-system[data-system-type='0'] {
          //   background: url('../../../../assets/images/specialRunMode/bg-item.png')
          //     no-repeat;
          //   background-size: 100% 100%;
          // }
          // .item-system[data-system-type='null'] {
          //   background: url('../../../../assets/images/specialRunMode/bg-item.png')
          //     no-repeat;
          //   background-size: 100% 100%;
          // }

          // .item-system[data-system-type='1'] {
          //   background: url('../../../../assets/images/specialRunMode/bg-warnning.png')
          //     no-repeat;
          //   background-size: 100% 100%;
          // }
          // .item-system[data-system-type='3'] {
          //   background: url('../../../../assets/images/specialRunMode/bg-item3.png')
          //     no-repeat;
          // }
          // .item-system[data-system-type='4'] {
          //   background: url('../../../../assets/images/specialRunMode/bg-item4.png')
          //     no-repeat;
          // }
          // .item-system[data-system-type='5'] {
          //   background: url('../../../../assets/images/specialRunMode/bg-item5.png')
          //     no-repeat;
          // }
        }
        .right-content::-webkit-scrollbar {
          display: none; /* 或 width: 0; height: 0; */
        }
      }
      .right-bottom {
        margin-top: 15px;
        width: 100%;
        // background: url('../../../../assets/images/specialRunMode/bg-left-top.png')
        //   no-repeat;
        // background-size: 100% 100%;
        // .table-rightbottom{
        //   height: 270px;
        // }
        // height: 0px;
        // height: calc(100% - 800px);
        // margin-top: 25px;
        // width: 100%;
        // background: url('../../../../assets/images/specialRunMode/bg-left-top.png')
        //   no-repeat;
      }
    }
  }
}

.type-select-two {
      margin-top: 7px;
      margin-right: 10px;
      --el-input-text-color: #b9daff;
      --el-input-icon-color: #b9daff;
      --el-text-color-placeholder: #b9daff;
      --el-text-color-regular: #ddd;
      --el-input-border: 1px solid #7ac9fb;
      --el-fill-color-blank: linear-gradient(90deg, rgba(8, 45, 123, 0.2) 0%, rgba(7, 51, 134, 0.5) 100%);

      &:deep(.el-input__wrapper.is-focus) {
        border: 1px solid #7ac9fb !important;
      }
      &:deep(.el-radio-button__inner) {
        background: rgba(1, 32, 123, 0.35);
        border: none;
        padding: 5px;
        font-size: 13px;
      }
      &:deep(.el-input__wrapper.is-focus) {
        border: 1px solid #7ac9fb !important;
      }
      &:deep(.el-radio-button.is-active .el-radio-button__original-radio:not(:disabled) + .el-radio-button__inner) {
        background-color: rgba(46, 234, 234, 0.29);
        // opacity: 0.3;
      }
      &:deep(.el-radio-button .el-radio-button__inner) {
        border-radius: 0;
      }
    }

.title-box {
  margin: 0 30px;
  font-family: YouSheBiaoTiHei, sans-serif;
  font-weight: 400;
  font-size: 18px;
  //color: #CEDCF4;
  color: #fff;
  line-height: 1;
  text-align: left;
  font-style: normal;
  text-transform: none;
  display: flex;
  justify-content: space-between;
  background: url('../../../../assets/images/specialRunMode/bg-title1.png') no-repeat;
  background-size: 100% 100%;
  // align-items: center;
}
.title__text {
  padding: 10px 30px;
  font-family: YouSheBiaoTiHei, sans-serif;
  font-weight: 400;
  font-size: 18px;
  //color: #CEDCF4;
  color: #fff;
  line-height: 1;
  text-align: left;
  font-style: normal;
  text-transform: none;
  background: url('../../../../assets/images/specialRunMode/bg-title1.png') no-repeat;
  background-size: 100% 100%;
}
.title__text1 {
  padding: 10px 30px;
  font-family: YouSheBiaoTiHei, sans-serif;
  font-weight: 400;
  font-size: 18px;
  //color: #CEDCF4;
  color: #fff;
  line-height: 1;
  text-align: left;
  font-style: normal;
  text-transform: none;
  background: url('../../../../assets/images/specialRunMode/bg-title9.png') no-repeat;
  background-size: 100% 100%;
}
.run-mode-desc {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3; /* 限制显示行数 */
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 分割线颜色 */
:deep(.el-table) {
  --el-table-border-color: rgba(90, 181, 255, 0.23);
}
.left-bottom,
.right-bottom {
  /* 表头样式 */
  :deep(.el-table__header) th {
    background-color: #032c8d !important; /* 表头背景色 */
    color: white; /* 表头文字颜色 */
  }
  /* 表体样式 */
  :deep(.el-table__body) tr {
    background-color: #063a9f; /* 表体背景色 */
    color: #fff; /* 表体文字颜色 */
  }
}

/* 鼠标悬停行样式 */
:deep(.el-table__body) tr:hover > td {
  background-color: #0b2e88 !important;
}
/* 斑马纹表格样式 */
:deep(.el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell) {
  background-color: #002d78 !important;
}

:deep(.el-table__empty-block) {
  background-color: #0b2e88 !important;
  border-bottom: none !important;
}
// 表格底部白线
:deep(.el-table__inner-wrapper:before) {
  height: 0px;
}
:deep(.el-table__header-wrapper) {
  border-top: 1px solid rgba(90, 181, 255, 0.23);
  border-bottom-width: 0;
}

:deep(.el-table .el-table__cell) {
  // border-bottom: #0c347d 1px solid;
  border-bottom: 1px solid rgba(90, 181, 255, 0.23);
}

:deep(.el-table__body) {
  height: 100%;
}

:deep(.el-table .cell) {
  padding: 0 5px;
  // line-height: unset;
  line-height: 1.5;
  font-size: 12px;

  .align {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

:deep(.el-dialog) {
  --el-dialog-bg-color: #0d2461 !important;

  .el-dialog__title {
    font-size: 18px;
    line-height: 21px;
    font-weight: bold;
    color: transparent; /* 文字透明 */
    background: linear-gradient(180deg, #31beff 0%, #ffffff 40%);
    -webkit-background-clip: text; /* 仅渐变作用于文字 */
    background-clip: text; /* 标准语法 */
    // background: linear-gradient(90.00000000000014deg, #31BEFF 0%, #FFFFFF 40%);
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
  }
  .el-dialog__header {
    padding: 5px;
  }
}

@keyframes scroll {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-50%); /* 滚动到复制内容的位置 */
  }
}

// .border-border {
//   border-color: hsl(240deg 61% 30.58%) !important;
// }
</style>
<style>
.el-popper.is-myCustomized {
  padding: 6px 12px;
  background: #0146a1;
  box-shadow: 0px 4px 12px 0px rgba(0, 17, 59, 0.25);
  border-radius: 4px 4px 4px 4px;
  font-weight: 400;
  font-size: 12px;
  color: #ffffff;
  min-width: 10px;
  max-width: 220px;
}

.el-popper.is-myCustomized .el-popper__arrow::before {
  background: #0146a1;
  right: 0;
}
</style>
