<script setup lang="ts">
import type { EchartsUIType } from '@vben/plugins/echarts';

import { onMounted, reactive, ref } from 'vue';

import { EchartsUI, useEcharts } from '@vben/plugins/echarts';

import { Download, Refresh, Search } from '@element-plus/icons-vue';
import {
  ElCard,
  ElCol,
  ElForm,
  ElFormItem,
  ElInput,
  ElRow,
  ElTable,
  ElTableColumn,
} from 'element-plus';

import { getCharts, getReturnAnalysis } from '#/api';
import { downloadFile } from '#/utils/download.ts';
const lineChartRef = ref<EchartsUIType>();
const stackedBarChartRef = ref<EchartsUIType>();
const thirdBarChartRef = ref<EchartsUIType>();
const { renderEcharts: renderLineChart } = useEcharts(lineChartRef);
const { renderEcharts: renderStackedBarChart } = useEcharts(stackedBarChartRef);
const { renderEcharts: renderBarChart } = useEcharts(thirdBarChartRef);
// 颜色配置
const colors = [
  '#b6a2de',
  '#5ab1ef',
  '#67e0e3',
  '#ffb980',
  '#d87a80',
  '#8d98b3',
];
// 头部表单
const queryForm = reactive({
  applicationPurpose: '',
  deploymentArea: '',
  hostName: '',
  ipAddress: '',
  locationHost: '',
  osName: '',
  pageNo: 1,
  pageSize: 10, // 通常pageSize默认设为10
  total: 0,
  permissionIds: [],
  resourceType: '',
  subUnit: true,
  systemName: '',
  unitId: '',
  unitIds: [],
});

const avgYear = ref(0);  // 第二表格副标题
const data = reactive({
  tableData: [],
  pageInfo: {
    pageSize: 5,
    pageNo: 1,
    total: 10,
  },
});
const pieDataSets = [
  {
    title: '运行年限',
    data: [],
  },
  {
    title: '退运设备平均运行年限',
    subTitle: { value: 0 },
    data: [],
  },
  {
    title: '操作系统',
    data: [],
  },
];
onMounted(() => {
  queryData();
  queryChartsData();
});

// 查询数据
async function queryData() {
  try {
    const res = await getReturnAnalysis(queryForm);
    if (res) {
      data.tableData = res.list;
      queryForm.total = res.total;
    }
  } catch (error) {
    console.error('查询数据失败:', error);
  }
}

// 查询图标数据
async function queryChartsData() {
  try {
    const res = await getCharts();
    pieDataSets[0].data[0] = res.pie;
    pieDataSets[0].data[1] = res.pieData;
    pieDataSets[1].data[0] = res.avgYearType;
    pieDataSets[1].data[1] = res.avgYearData;
    pieDataSets[2].data[0] = res.osType;
    pieDataSets[2].data[1] = res.osData;
    pieDataSets[1].subTitle.value = res.avgYear;
    // 渲染折线图
    drawPieChart(pieDataSets[0]);
    drawBarChart(pieDataSets[1]);
    drawBarChart1(pieDataSets[2]);
  } catch (error) {
    console.error('查询数据失败:', error);
  }
}

// 导出数据
async function exportData() {
  try {
    await downloadFile(
      import.meta.env.VITE_NSOSFS + '/returnAnalysis/export',
      queryForm,
      '退运分析结果.xlsx',
      'post',
    );
  } catch {}
}

// 重置数据
// 重置表单方法
function reset() {
  Object.assign(queryForm, {
    applicationPurpose: '',
    deploymentArea: '',
    hostName: '',
    ipAddress: '',
    locationHost: '',
    osName: '',
    pageNo: 1,
    pageSize: 10, // 保留分页大小默认值
    permissionIds: [],
    resourceType: '',
    subUnit: true, // 根据需求决定是否重置为默认值
    systemName: '',
    unitId: '',
    unitIds: [],
    total: '', // 如果total需要重置，否则可移除
  });
  // 可选：手动触发一次查询（根据需求决定）
  queryData();
}

// 绘制折线图
function drawPieChart(dataSet: any) {
  const [names, values] = dataSet.data;
  renderLineChart({
    tooltip: { trigger: 'item' },
    title: {
      text: dataSet.title,
      top: '0',
      left: '0',
      textStyle: { fontSize: 15 },
    },
    legend: {
      orient: 'vertical',
      top: '27%',
      right: '0',
      data: names,
    },
    series: [
      {
        name: dataSet.title,
        type: 'pie',
        radius: ['0', '70%'],
        center: ['35%', '45%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 0,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: { show: false, position: 'center' },
        emphasis: {
          label: { show: true, fontSize: '18', fontWeight: 'bold' },
        },
        labelLine: { show: false },
        data: names.map((name: string, i: number) => ({
          name,
          value: values[i], // 使用对应的数值
          itemStyle: { color: colors[i % colors.length] },
        })),
      },
    ],
  });
}
function drawBarChart(dataSet: any) {
  // 解构出分类名称和数值
  const [categories, values] = dataSet.data;

  renderStackedBarChart({
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    title: [
      {
        text: dataSet.title,
        top: '0',
        left: '0',
        textStyle: {
          fontSize: 15,
          fontWeight: 'bold',
        },
      },
      {
        // 动态拼接富文本
        text: `{a|${dataSet.subTitle.value}}{b|年}`,
        top: '25px',
        left: '0',
        textStyle: {
          rich: {
            a: {
              // 数字部分样式
              fontSize: 20,
              color: '#333',
              fontWeight: 'bold',
            },
            b: {
              // 单位部分样式
              fontSize: 15,
              color: '#333',
              padding: [0, 0, 2, 5], // 微调单位位置
            },
          },
        },
      },
    ],
    legend: {
      show: false, // 单一系列不需要图例
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '13%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: categories, // 直接使用分类数组
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: dataSet.title,
        type: 'bar',
        barWidth: '10%',
        emphasis: {
          focus: 'series',
        },
        data: values.map((value: number, index: number) => ({
          value,
          itemStyle: {
            color: '#FF9900', // 按索引取颜色
            borderRadius: [0, 0, 0, 0], // 顶部圆角
          },
        })),
      },
    ],
  });
}
function drawBarChart1(dataSet: any) {
  // 解构出分类名称和数值
  const [categories, values] = dataSet.data;

  renderBarChart({
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    title: [
      {
        text: dataSet.title,
        top: '0',
        left: '0',
        textStyle: {
          fontSize: 15,
          fontWeight: 'bold',
        },
      },
    ],
    legend: {
      show: false, // 单一系列不需要图例
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '13%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: categories, // 直接使用分类数组
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: dataSet.title,
        type: 'bar',
        barWidth: '10%',
        emphasis: {
          focus: 'series',
        },
        data: values.map((value: number, index: number) => ({
          value,
          itemStyle: {
            color: '#3DCCA6', // 按索引取颜色
            borderRadius: [0, 0, 0, 0], // 顶部圆角
          },
        })),
      },
    ],
  });
}
</script>

<template>
  <div class="h-full bg-white">
    <!-- <div class="header">
      <el-button style="background: #1e79f7; color: white"
        >退运智能分析</el-button
      >
    </div> -->
    <div>
      <div class="title">
        <span style="margin-left: 10px">设备状况分析</span>
      </div>
      <div class="first-container">
        <div class="child-item">
          <ElCard
            style="margin: 0 80px; width: calc(100% - 200px); min-width: 220px"
          >
            <EchartsUI ref="lineChartRef" style="height: 215px" />
          </ElCard>
        </div>
        <div class="child-item">
          <ElCard
            style="margin: 0 80px; width: calc(100% - 200px); min-width: 220px"
          >
            <EchartsUI ref="stackedBarChartRef" style="height: 215px" />
          </ElCard>
        </div>
        <div class="child-item">
          <ElCard
            style="margin: 0 80px; width: calc(100% - 200px); min-width: 220px"
          >
            <EchartsUI ref="thirdBarChartRef" style="height: 215px" />
          </ElCard>
        </div>
      </div>
      <div class="title" style="border-bottom: 1px solid gainsboro">
        <span style="margin-left: 10px">现役设备退运分析</span>
      </div>
      <div style="margin: 20px 20px 0 20px; border-bottom: 1px solid gainsboro">
        <ElForm :inline="true" :model="queryForm" label-position="right">
          <ElRow>
            <ElCol :span="5">
              <ElFormItem label="资源类型:">
                <el-select
                  v-model="queryForm.resourceType"
                  filterable
                  clearable
                  style="width: 180px;"
                >
                  <el-option label="物理机" value="2" />
                  <el-option label="虚拟机" value="1" />
                </el-select>
              </ElFormItem>
            </ElCol>
            <ElCol :span="5">
              <ElFormItem label="应用系统名称:">
                <ElInput v-model="queryForm.systemName" clearable />
              </ElFormItem>
            </ElCol>
            <ElCol :span="5">
              <ElFormItem label="应用用途:">
                <ElInput v-model="queryForm.applicationPurpose" clearable />
              </ElFormItem>
            </ElCol>
            <ElCol :span="5">
              <ElFormItem label="部署区域:">
                <ElInput v-model="queryForm.deploymentArea" clearable />
              </ElFormItem>
            </ElCol>
            <ElCol :span="3" style="display: flex; justify-content: flex-end" />
          </ElRow>
          <ElRow>
            <ElCol :span="5">
              <ElFormItem label="IP地址:">
                <ElInput v-model="queryForm.ipAddress" clearable />
              </ElFormItem>
            </ElCol>
            <ElCol :span="5">
              <ElFormItem label="操作系统:">
                <ElInput v-model="queryForm.osName" clearable />
              </ElFormItem>
            </ElCol>
            <ElCol :span="5">
              <ElFormItem label="主机名称:">
                <ElInput v-model="queryForm.hostName" clearable />
              </ElFormItem>
            </ElCol>
            <ElCol :span="5">
              <ElFormItem label="机房位置:">
                <ElInput v-model="queryForm.locationHost" clearable />
              </ElFormItem>
            </ElCol>
            <ElCol :span="4" style="display: flex; justify-content: flex-end">
              <el-button type="primary" :icon="Search" @click="queryData"
                >查询</el-button
              >
              <ElButton type="info" :icon="Refresh" @click="reset"
                >重置</ElButton
              >
              <ElButton
                type="primary"
                :icon="Download"
                @click="exportData"
                style="margin-bottom: 5px"
                >导出</ElButton
              >
            </ElCol>
          </ElRow>
        </ElForm>
      </div>
      <div style="padding: 0 20px 10px 20px">
        <ElTable ref="tab" border stripe :data="data.tableData" height="400px">
          <ElTableColumn type="selection" />
          <ElTableColumn type="index" />
          <ElTableColumn align="center" label="资源类型">
            <template #default="scope">
              <span>{{
                scope.row.resourceType === '2' ? '物理机' : '虚拟机'
              }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn
            prop="systemName"
            align="center"
            label="应用系统名称"
          />
          <ElTableColumn
            prop="suggestedTime"
            align="center"
            label="建议退运时间"
          />
          <ElTableColumn
            prop="applicationPurpose"
            align="center"
            label="应用用途"
          />
          <ElTableColumn prop="networkArea" align="center" label="网络区域" />
          <ElTableColumn prop="usedYears" align="center" label="使用期限(年)" >
                        <template #default="scope">
              <span>{{ scope.row.usedYears }}</span>
            </template>
          </ElTableColumn>
          <ElTableColumn
            prop="ipNum"
            align="center"
            label="IP地址/IP地址数量"
          />
          <ElTableColumn
            prop="systemArchitecture"
            align="center"
            label="体系架构"
          />
          <ElTableColumn prop="osName" align="center" label="操作系统" />
          <ElTableColumn prop="hostName" align="center" label="主机名称" />
          <ElTableColumn prop="cpu" align="center" label="CPU(核)" />
          <ElTableColumn prop="memory" align="center" label="内存(GB)" />
          <ElTableColumn prop="dataDisk" align="center" label="数据盘(GB)" />
          <!-- <ElTableColumn prop="storageType" align="center" label="存储类型" /> -->
          <ElTableColumn align="center" label="存储类型">
            <template #default="scope">
              <span>{{
                scope.row.storageType === '1' ? '硬盘存储' : scope.row.storageType === '2' ? '阵列存储' : '网络存储'
              }}</span>
            </template>
          </ElTableColumn>
          
          <ElTableColumn
            prop="storageCapacity"
            align="center"
            label="存储量(GB)"
          />
          <ElTableColumn
            prop="locationHost"
            align="center"
            label="主机机房位置"
          />
          <ElTableColumn prop="ipAddress" align="center" label="主机IP地址" />
          <ElTableColumn prop="version" align="center" label="部署软件及版本" />
        </ElTable>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.header {
  height: 35px;
}
:deep(.el-form-item) {
  .el-form-item__content {
    display: flex;
    justify-content: flex-end;
  }
  .el-form-item__label {
    width: 100px;
    text-align: right;
    font-size: 14px;
    font-weight: 500;
    // line-height: 32px;
    color: #515a6e;
  }
}
.title {
  display: flex;
  align-items: center;
  position: relative;
  height: 40px;
  padding: 15px 15px;
  margin: 0 20px;
  color: black;
  font-weight: 500;
  &::before {
    position: absolute;
    top: 12px;
    left: 10px;
    height: 15px;
    width: 5px;
    content: '';
    background-color: rgb(202, 124, 23);
  }
}
.first-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  height: 235px;
  margin-bottom: 10px;

  .child-item {
    height: 100%;
    flex: 1;
    min-width: 300px;
    background-color: white;
    padding: 10px;
    max-width: calc(100% / 3);
    // border-radius: 8px;
    // margin: 10px;
    > div {
      width: 100%;
      height: 100%;
    }
  }
}
// 第一个容器特殊布局
// .first-container {
//   border-bottom: 2px solid #f0f0f0;
//   & :nth-child(1) { flex: 1; }
//   & :nth-child(2) { flex: 1; }
// }
.second-container {
  min-height: 540px;
  background-color: white;
}
</style>
