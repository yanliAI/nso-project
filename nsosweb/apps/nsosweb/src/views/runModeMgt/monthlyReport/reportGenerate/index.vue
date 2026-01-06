<template>
  <div class="flex h-full bg-white" style="padding: 0 20px">
    <div class="asside">
      <el-segmented
        v-model="segmentedValue"
        :options="options"
        direction="vertical"
        @change="handleSegmentedChange"
      >
        <template #default="scope">
          <div
            :class="[
              'flex',
              'items-center',
              'justify-center',
              'h-[50px]',
              'title',
            ]"
          >
            <div>{{ scope.item.label }}</div>
          </div>
        </template>
      </el-segmented>
    </div>
    <div class="main-con flex-1">
      <div id="titleGs" class="m-2 flex items-center">
        <Menu class="mr-2" style="width: 24px; height: 24px" />
        <h1 style="font-size: 16px; font-weight: bold">概述</h1>
      </div>
      <el-divider style="margin: 5px 0" />
      <div class="first-container">
        <div class="child-item">
          <EchartsUI :ref="(el) => (pieChartRefs[0].value = el)" />
        </div>
        <div class="child-item">
          <EchartsUI ref="lineChartRef" />
        </div>
      </div>
      <div class="second-container">
        <div
          class="child-item"
          v-for="(_, index) in pieChartRefs.slice(1)"
          :key="index"
        >
          <EchartsUI
            :ref="(el) => (pieChartRefs[index + 1].value = el)"
            style="border-right: 2px solid #f0f0f0"
          />
        </div>
      </div>

      <el-row :gutter="20" class="px-2">
        <el-col
          :span="12"
          v-for="(template, index) in templateList"
          :key="index"
          class="mb-4"
        >
          <el-card style="height: 100%">
            <template #header>
              <div :id="template.typeName" class="m-2 flex items-center">
                <Menu class="mr-2" style="width: 24px; height: 24px" />
                <h1 style="font-size: 16px; font-weight: bold">
                  {{ template.typeName }}
                </h1>
              </div>
            </template>

            <div>
              <div class="mt-2 flex" v-for="item in template.templates">
                <div class="flex w-[200px] justify-center">
                  【 {{ item.templateName }} 】
                </div>
                <el-tooltip
                  effect="light"
                  :content="item.remarks"
                  placement="bottom"
                  popper-class="custom-tooltip"
                >
                  <div class="max-lines flex-1">{{ item.remarks }}</div>
                </el-tooltip>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ElRow,
  ElCol,
  ElCard,
  ElTable,
  ElTableColumn,
  ElFormItem,
  ElForm,
  ElInput,
  ElButton,
  ElSelect,
  ElOption,
  ElPagination,
  ElContainer,
  ElMain,
  ElFooter,
  ElMessage,
  ElDialog,
  ElMessageBox,
  ElSegmented,
} from 'element-plus';
import {
  Search,
  RefreshLeft,
  Delete,
  Download,
  Monitor,
  CirclePlus,
  CircleCheck,
  Menu,
} from '@element-plus/icons-vue';
import type { EchartsUIType } from '@vben/plugins/echarts';
import { EchartsUI, useEcharts } from '@vben/plugins/echarts';
import { onMounted, ref } from 'vue';
import {
  getTypeCompleteStaticApi,
  getUnitCompleteStaticApi,
  getTypeTemplateStaticApi,
} from '#/api';

const segmentedValue = ref('titleGs');
const options = ref([
  {
    label: '概述',
    value: 'titleGs',
  },
]);

const handleSegmentedChange = (value) => {
  console.log(value);
  // 滚动到对应锚点位置
  const el = document.getElementById(value);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

// 创建图表引用数组
const pieChartRefs = [
  ref<EchartsUIType>(),
  ref<EchartsUIType>(),
  ref<EchartsUIType>(),
  ref<EchartsUIType>(),
  ref<EchartsUIType>(),
];
const lineChartRef = ref<EchartsUIType>();

// 创建渲染函数数组
const pieRenderers = pieChartRefs.map((ref) => useEcharts(ref).renderEcharts);
const { renderEcharts: renderLineChart } = useEcharts(lineChartRef);

// 饼图数据配置
const pieDataSets = ref([]);

const templateList = ref([]);

const getTypeCompleteStatic = async () => {
  try {
    let result = await getTypeCompleteStaticApi();
    pieDataSets.value = result
      .filter((item) =>
        [
          '重要任务',
          '故障异常',
          '并网审查',
          '数字化应用及平台隐患消缺',
          '网络安全方式安排',
        ].includes(item.typeName),
      )
      .map((item) => {
        return {
          title: item.typeName,
          graphicTitle: `总计\n${item.taskTotal}`,
          data: [
            { value: item.completedCount, name: '已完成' },
            { value: item.taskTotal - item.completedCount, name: '未完成' },
          ],
        };
      });
  } catch (error) {}
};
const getUnitCompleteStatic = async () => {
  try {
    let result = await getUnitCompleteStaticApi();
    let legends = ['任务数', '已完成', '完成率'];
    let data = {
      legends,
      xData: result.map((item) => item.unitName),
      yAxis: [
        {
          type: 'value',
          name: '数量',
          minInterval: 1, // 最小间隔为1
          axisLabel: {
            formatter: '{value}',
          },
        },
        {
          type: 'value',
          name: '完成率',
          min: 0,
          max: 100,
          axisLabel: {
            formatter: function (value) {
              // 保留2位小数并添加%符号
              return value.toFixed(2) + ' %';
            },
          },
          alignTicks: true, // 自动对齐左侧轴的刻度
        },
      ],
      yData: legends.map((item, index) => {
        let data = [];
        let type = 'bar';
        let yAxisIndex = 0;
        if (index == 0) {
          data = result.map((item2) => item2.taskTotal);
        } else if (index == 1) {
          data = result.map((item2) => item2.completedCount);
        } else if (index == 2) {
          data = result.map((item2) =>
            ((item2.completedCount / item2.taskTotal) * 100).toFixed(2),
          );
          type = 'line';
          yAxisIndex = 1;
        }
        return {
          name: item,
          type,
          data,
          yAxisIndex,
          tooltip: {
            valueFormatter: function (value) {
              return index == 2 ? (value || '-') + ' %' : value;
            },
          },
        };
      }),
    };
    // 渲染折线图
    drawLineChart(data);
  } catch (error) {}
};

const getTypeTemplateStatic = async () => {
  try {
    templateList.value = await getTypeTemplateStaticApi();
    options.value = [
      {
        label: '概述',
        value: 'titleGs',
      },
    ];
    let option = templateList.value.map((item) => ({
      label: item.typeName,
      value: item.typeName,
    }));
    options.value.push(...option);
  } catch (error) {}
};

// 颜色配置
const colors = ['#62DAAB', '#F56E53', '#ffb980', '#d87a80', '#8d98b3'];

onMounted(async () => {
  await getTypeCompleteStatic();
  await getUnitCompleteStatic();
  await getTypeTemplateStatic();
  // 渲染所有饼图
  pieRenderers.forEach((render, index) => {
    render(createPieChartOption(pieDataSets.value[index]));
  });
});

/**
 * 创建饼图配置的工厂函数
 */
function createPieChartOption(dataSet) {
  return {
    tooltip: { trigger: 'item' },
    title: {
      // text: dataSet.title,
      text: '{img|} ' + dataSet.title, // 使用富文本语法
      left: '10',
      top: '0',
      textStyle: {
        fontSize: 14,
        rich: {
          img: {
            // height: 15, // 图片高度
            // width: 15, // 图片宽度
            // backgroundColor: {
            //   image: '/images/person.jpeg', // 图片路径
            // },
          },
        },
      },
    },
    legend: {
      orient: 'horizontal',
      bottom: 0,
      left: 'center',
      data: dataSet.data.map((item) => item.name),
    },
    graphic: {
      //环形图中间添加文字
      type: 'text', //通过不同top值可以设置上下显示
      left: 'center',
      top: 'center',
      style: {
        text: `${dataSet.graphicTitle}`,
        textAlign: 'center',
        fill: '#333', //文字的颜色
        fontSize: 16,
        lineHeight: 24,
      },
    },
    series: [
      {
        name: dataSet.title,
        type: 'pie',
        radius: ['40%', '60%'],
        // center: ['50%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 0,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          position: 'outside',
          formatter: (params) => {
            return `${params.name}: ${params.value}`;
          },
        },
        emphasis: {
          label: { show: true, fontSize: '14', fontWeight: 'bold' },
        },
        // labelLine: { show: false },
        labelLine: {
          show: true,
          length: 10,
          length2: 20,
        },
        data: dataSet.data.map((item, i) => ({
          ...item,
          itemStyle: { color: colors[i % colors.length] },
        })),
      },
    ],
  };
}

// 绘制折线图
function drawLineChart(renderData) {
  renderLineChart({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999',
        },
        label: {
          formatter: function (params) {
            console.log('params==', params);
            // 对数值进行处理
            if (params.value === undefined) return '';
            if (params.axisDimension === 'y') {
              return params.axisIndex === 1
                ? parseFloat(params.value).toFixed(2) + '%'
                : parseFloat(params.value).toFixed(2);
            } else {
              return params.value;
            }
          },
          backgroundColor: '#666', // 标签背景色
          color: '#fff', // 文字颜色
        },
      },
    },
    // legend: { data: ['任务数', '已完成', '完成率'] },
    legend: { data: renderData.legends },
    grid: { left: '3%', right: '1%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      // boundaryGap: false,
      axisPointer: {
        type: 'shadow',
      },
      data: renderData.xData,
    },
    // yAxis: { type: 'value' },
    yAxis: renderData.yAxis,
    series: renderData.yData,
    // series: [
    //   {
    //     name: '邮件营销',
    //     type: 'line',
    //     stack: '总量',
    //     data: [120, 132, 101, 134, 90, 230, 210],
    //     smooth: true,
    //     lineStyle: { width: 3, color: colors[0] },
    //     itemStyle: { color: colors[0] },
    //   },
    //   {
    //     name: '联盟广告',
    //     type: 'line',
    //     stack: '总量',
    //     data: [220, 182, 191, 234, 290, 330, 310],
    //     smooth: true,
    //     lineStyle: { width: 3, color: colors[1] },
    //     itemStyle: { color: colors[1] },
    //   },
    //   {
    //     name: '视频广告',
    //     type: 'line',
    //     stack: '总量',
    //     data: [150, 232, 201, 154, 190, 330, 410],
    //     smooth: true,
    //     lineStyle: { width: 3, color: colors[2] },
    //     itemStyle: { color: colors[2] },
    //   },
    // ],
  });
}
</script>

<style lang="less" scoped>
.asside {
  height: 100%;
  max-height: calc(100vh - 50px);
  padding: 10px 10px 10px 0;
  border-right: 1px solid #ccc;
  overflow: auto;

  .title {
    min-width: 150px;
  }
}
.main-con {
  min-width: 0;
  max-height: calc(100vh - 50px);
  overflow: auto;

  scrollbar-width: none; /* Firefox隐藏滚动条 */
  -ms-overflow-style: none; /* IE和Edge隐藏滚动条 */
  /* Chrome和Safari隐藏滚动条 */
  &::-webkit-scrollbar {
    display: none;
  }
}
.first-container,
.second-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: space-between;
  height: 230px;
  margin-bottom: 10px;

  .child-item {
    flex: 1;
    min-width: 300px;
    // border-radius: 8px;
    margin: 10px;
    > div {
      width: 100%;
      height: 100%;
    }
  }
}
// 第一个容器特殊布局
.first-container {
  border-bottom: 2px solid #f0f0f0;
  & :nth-child(1) {
    flex: 1;
  }
  & :nth-child(2) {
    flex: 2;
  }
}

// 第二个容器布局
.second-container {
  .child-item {
    border-bottom: 2px solid #f0f0f0;

    & :nth-child(3) {
      border-right: none;
    }
  }
}
:deep(.el-card__header) {
  padding: 0;
}

.max-lines {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1; /* 限制显示行数 */
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

<style>
.custom-tooltip {
  max-width: 500px; /* 设置最大宽度 */
  word-wrap: break-word; /* 强制换行 */
  white-space: normal; /* 允许换行（覆盖默认的 nowrap） */
}
</style>
