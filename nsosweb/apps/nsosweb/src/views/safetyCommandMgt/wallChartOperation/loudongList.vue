<template>
  <div
    class="flex"
    style="flex-direction: column"
    v-loading="loading"
    element-loading-text="Loading..."
    element-loading-background="rgba(122, 122, 122, 0.1)"
  >
    <!-- <div
      class="flex"
      style="padding: 10px 0; color: white; font-size: 14px"
      v-if="isShowSystemInfo"
    >
      <div class="flex items-center">
        <span
          style="
            display: inline-block;
            width: 5px;
            height: 16px;
            margin-right: 8px;
            background-color: #5470c6;
            border-radius: 1px;
          "
        />
        <span>系统名称：</span>
        <span style="font-size: 16px; font-weight: 700">
          {{ systemInfo.systemName }}
        </span>
      </div>
      <div class="flex items-center" style="margin-left: 150px">
        <span
          style="
            display: inline-block;
            width: 5px;
            height: 16px;
            margin-right: 8px;
            background-color: #5470c6;
            border-radius: 1px;
          "
        />
        <span>设备主人：</span>
        <span style="font-size: 16px; font-weight: 700">
          {{ systemInfo.deviceOwner }}
        </span>
      </div>

      <div class="flex items-center" style="margin-left: 150px">
        <span
          style="
            display: inline-block;
            width: 5px;
            height: 16px;
            margin-right: 8px;
            background-color: #5470c6;
            border-radius: 1px;
          "
        />
        <span>联系电话：</span>
        <span style="font-size: 18px; font-weight: 700">
          {{ systemInfo.phone }}
        </span>
      </div>
    </div> -->
    <el-table
      ref="table"
      :data="tableData"
      max-height="500"
      scrollbar-always-on
    >
      <el-table-column
        prop="vulnerabilityName"
        label="漏洞名称"
        align="center"
        width="150"
      >
        <template #default="scope">
          <el-tooltip
            effect="light"
            :content="scope.row.vulnerabilityName"
            placement="bottom"
          >
            <span class="max-lines">{{ scope.row.vulnerabilityName }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="discoveryDate"
        label="发现时间"
        align="center"
        sortable
        :sort-method="sortTime"
        width="120"
      >
      </el-table-column>
      <el-table-column
        prop="vulnerabilityType"
        label="漏洞类型"
        align="center"
        width="120"
      >
        <template #default="scope">
          <el-tooltip
            effect="light"
            :content="scope.row.vulnerabilityType"
            placement="bottom"
            popper-class="custom-tooltip"
          >
            <span class="max-lines">{{ scope.row.vulnerabilityType }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="riskLevel"
        label="风险等级"
        align="center"
        width="120"
      >
        <!-- <template #default="scope">
          {{ riskLevelMap[scope.row.riskLevel] }}
        </template> -->
      </el-table-column>
      <el-table-column prop="handlingStatus" label="处置状态" align="center">
        <template #default="scope">
          <span v-if="scope.row.handlingStatus == 0">未处置</span>
          <span v-else-if="scope.row.handlingStatus == 1">已处置</span>
          <span v-else-if="scope.row.handlingStatus == 2">已下令</span>
        </template>
      </el-table-column>
      <el-table-column prop="ipv4" label="IP地址" align="center" width="120">
        <template #default="scope">
          <span v-if="scope.row.ipv4">{{ scope.row.ipv4 }}</span>
          <span v-else>{{ scope.row.ipv6 }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="ipv6" label="IPv6" align="center">
      </el-table-column> -->

      <el-table-column
        prop="description"
        label="漏洞描述"
        align="center"
        width="200"
      >
        <template #default="scope">
          <el-tooltip
            effect="light"
            :content="scope.row.description"
            placement="bottom"
            popper-class="custom-tooltip"
          >
            <span class="max-lines">{{ scope.row.description }}</span>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column prop="systemName" label="系统名称" width="120">
      </el-table-column>
      <el-table-column prop="organizationName" label="运维单位" width="180">
      </el-table-column>
      <el-table-column prop="deviceOwner" label="设备主人" width="100">
      </el-table-column>
      <!-- <el-table-column prop="phone" label="联系电话" width="100">
      </el-table-column> -->

      <el-table-column label="操作" align="center" width="120" fixed="right">
        <template #default="{ row, $index }">
          <el-button type="primary" link @click="lookDetail(row)">{{
            row.handlingStatus == 0 ? '智能研判' : '查看'
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 漏洞信息弹框 -->
    <Modal
      title="告警信息"
      class="custom-modal w-[1200px]"
      :footer="false"
      :closeOnClickModal="true"
      :draggable="false"
      :fullscreenButton="false"
      :closable="false"
      :zIndex="1010"
    >
      <template #description>
        <div class="custom-dialog-header">
          <div>
            <el-button
              v-if="dialogData.type == 0"
              type="primary"
              @click="issueInstruction(alertId)"
              :disabled="!isAfterDisplayText"
            >
              生成指令
            </el-button>
            <el-button
              v-if="dialogData.type == 0"
              type="primary"
              @click="misstatement(alertId)"
            >
              已研判
            </el-button>
            <el-button @click="modalApi.close()">关闭</el-button>
          </div>
        </div>
      </template>
      <LoudongDetail
        ref="alarmDetailRef"
        :alertId="alertId"
        :openType="dialogData.type"
        @afterDisplayText="isAfterDisplayText = true"
      ></LoudongDetail>
    </Modal>

    <ModalB
      title="生成指令"
      class="custom-modal w-[1200px]"
      :footer="false"
      :closeOnClickModal="true"
      :draggable="false"
      :fullscreenButton="false"
      :zIndex="1020"
    >
      <CmdDetail
        :cmdFl="'3'"
        :sldwParams="organizationName"
        :faultCode="faultCode"
        :czjyText="`处置建议：\n${alarmDetailRef.czjyText}`"
        @afterAdd="onSubmit($event)"
      ></CmdDetail>
    </ModalB>
  </div>
</template>

<script lang="ts" setup>
import {
  ElTable,
  ElTableColumn,
  ElRow,
  ElCol,
  ElButton,
  ElMessage,
  ElMessageBox,
} from 'element-plus';
import type { EchartsUIType } from '@vben/plugins/echarts';
import { EchartsUI, useEcharts } from '@vben/plugins/echarts';

import { ref, reactive, computed, onMounted, nextTick } from 'vue';
import { useVbenModal } from '@vben/common-ui';
import {
  getVulnerabilityListWithEleIdApi,
  changeVulnerabilityInfoStatusApi,
} from '#/api';
import LoudongDetail from './loudongDetail.vue';
import CmdDetail from '#/views/runDdMgt/cmdMgt/cmdDetailSafety.vue';

defineOptions({
  name: 'WallChartLouDongList',
});

const loading = ref(false);
// 父组件传入的图元id、布防图id
const graphicId = defineModel('graphicId');
const topoId = defineModel('topoId');
const emit = defineEmits(['afterChangeState']);
const isAfterDisplayText = ref(false);
const alertId = ref([]);
// const isShowSystemInfo = ref(true);
// const systemInfo = ref({
//   deviceOwner: '',
//   phone: '',
//   systemName: '',
//   // 受令单位
//   organizationName: '',
// });
const riskLevelMap = {
  '0': '低',
  '1': '中',
  '2': '高',
};
// 下令关联信息
const faultCode = ref('');
// 受令单位
const organizationName = ref('');
const table = ref(null);
const defaultTableData = [
  {
    id: '1927733049647276034',
    vulnerabilityName: 'SQL注入漏洞',
    vulnerabilityType: '注入类漏洞（SQL注入、命令注入）',
    description:
      "在 /user/profile?id=1 接口中，id 参数未做过滤，攻击者可构造恶意输入（如 1' OR '1'='1）获取数据库敏感信息。",
    riskLevel: '2',
    discoveryDate: '2025-05-16 00:18:00',
    ipv4: '',
    ipv6: '92::43',
    handlingStatus: '0',
  },
];

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
});

const [ModalB, modalApiB] = useVbenModal({
  onCancel() {
    modalApiB.close();
  },
});
const alarmDetailRef = ref();
const tableData = ref([]);
const dialogData = reactive({
  visible: false,
  type: 0,
});
const cmdDialogData = reactive({
  visible: false,
});
const chartRef1 = ref<EchartsUIType>();
const chartRef2 = ref<EchartsUIType>();
const renderEcharts1 = useEcharts(chartRef1).renderEcharts;
const useEchart2 = useEcharts(chartRef2);
const renderEcharts2 = useEchart2.renderEcharts;
const colors = ['#ea0303', '#ff5c5c', '#ff9a5c', '#5470c6', '#73c0de'];
const colors2 = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de'];

const totalNum = ref(0);
// 配置项
let option1 = {
  color: colors,
  title: {
    text: '告警状态统计图',
    left: '10', // 对齐方式居中
    top: '5%', // 距离顶部
    textStyle: {
      // 文字配置
      color: '#fff', // 文字颜色
      fontSize: 15, // 字号
    },
  },
  // tooltip: {
  //   show: true,
  //   // formatter: "{a} <br/>{b}: {c} (个) ({d}%)",
  // },
  legend: {
    top: '90%',
    icon: 'circle',
    textStyle: {
      color: '#fff',
    },
  },
  series: [
    {
      type: 'pie',
      radius: '60%',
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 0,
        borderColor: '#fff',
        borderWidth: 0,
      },
      label: {
        show: true,
        position: 'outside',
        fontFamily: 'Microsoft YaHei',
        formatter: (params) => {
          return `{${params.dataIndex}|${params.name}: ${params.value}}`;
        },
        rich: colors.reduce((acc, color, index) => {
          acc[index] = {
            color,
            padding: 4,
            fontWeight: 'bold',
            align: 'left',
          };
          return acc;
        }, {}),
      },
      labelLine: {
        show: true,
        length: 20,
        length2: 30,
      },
      data: [],
    },
  ],
};

// 配置项
let option2 = {
  color: colors2,
  title: {
    text: '告警类型统计图',
    left: '10', // 对齐方式居中
    top: '5%', // 距离顶部
    textStyle: {
      // 文字配置
      color: '#fff', // 文字颜色
      fontSize: 15, // 字号
    },
  },
  legend: {
    top: '90%',
    icon: 'circle',
    textStyle: {
      color: '#fff',
    },
  },
  graphic: {
    //环形图中间添加文字
    type: 'text', //通过不同top值可以设置上下显示
    left: 'center',
    top: 'center',
    style: {
      text: '',
      textAlign: 'center',
      fill: '#fff', //文字的颜色
      fontSize: 16,
      lineHeight: 24,
    },
  },
  // tooltip: {
  //   show: true,
  //   // formatter: "{a} <br/>{b}: {c} (个) ({d}%)",
  // },
  tooltip: {
    trigger: 'item',
  },
  series: [
    {
      type: 'pie',
      radius: ['40%', '60%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 0,
        borderColor: '#fff',
        borderWidth: 0,
      },
      label: {
        show: true,
        position: 'outside',
        fontFamily: 'Microsoft YaHei',
        formatter: (params) => {
          return `{${params.dataIndex}|${params.name}: ${params.value}}`;
        },
        rich: colors2.reduce((acc, color, index) => {
          acc[index] = { color, padding: 4, fontWeight: 'bold', align: 'left' };
          return acc;
        }, {}),
      },
      labelLine: {
        show: true,
        length: 20,
        length2: 30,
      },
      data: [],
    },
  ],
};

/**
 * 按照时间排序
 * @param a
 * @param b
 */
const sortTime = (a, b) => {
  return new Date(a.discoveryDate) - new Date(b.discoveryDate);
};
/**
 * 按照类型拼音排序
 * @param a
 * @param b
 */
const sortType = (a, b) => {
  return a.alertType?.localeCompare(b.alertType, 'zh-Hans-CN');
};
const orderLevel = ['危急', '高危', '中危', '低危'];
const getAlertListWithId = async () => {
  if (!graphicId.value || !topoId.value) {
    return;
  }
  let result;
  try {
    result = await getVulnerabilityListWithEleIdApi({
      id: graphicId.value,
      topoId: topoId.value,
    });
  } catch {
    // tableData.value = defaultTableData;
    return;
  }
  tableData.value = result.records.map((item) => {
    return {
      systemName: item.systemInfo?.applicationSystemName,
      deviceOwner: item.systemInfo?.acountName,
      phone: item.systemInfo?.acountMobile,
      organizationName: item.systemInfo?.organizationName,
      ...item,
    };
  });

  // option1.series[0].data = [];
  // orderLevel.forEach((key) => {
  //   if (result.severityCounts.hasOwnProperty(key)) {
  //     option1.series[0].data.push({
  //       name: key,
  //       value: result.severityCounts[key],
  //     });
  //   }
  // });
  // option2.series[0].data = [];
  // Object.keys(result.countByType).forEach((key) => {
  //   totalNum.value += result.countByType[key];
  //   option2.series[0].data.push({ name: key, value: result.countByType[key] });
  // });
  // option2.graphic.style.text = `总数\n${totalNum.value}`;
  // renderEcharts1(option1);
  // renderEcharts2(option2);
};

const misstatement = async (id) => {
  ElMessageBox.confirm('是否确认已研判?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    // 修改状态为已处置
    let params = alertId.value.map((item) => {
      return { id: item, status: '1', topoId: topoId.value };
    });
    const result = await changeVulnerabilityInfoStatusApi(params);

    if (result) {
      ElMessage.success('已处置');
      // dialogData.visible = false;
      modalApi.close();
      // 刷新告警列表等数据
      getAlertListWithId();
      setTimeout(() => {
        emit('afterChangeState');
      }, 500);
    } else ElMessage.error('研判失败');
  });
};

/**
 * 提交后 修改研判状态并刷新数据
 */
const onSubmit = async (data) => {
  // 发令成功，关闭弹窗
  // cmdDialogData.visible = false;
  modalApiB.close();
  // 修改状态为下令已研判
  let params = alertId.value.map((item) => {
    return { id: item, status: '2', cmdId: data.id, topoId: topoId.value };
  });
  try {
    const result = await changeVulnerabilityInfoStatusApi(params);
  } catch {
    return;
  }
  // dialogData.visible = false;
  modalApi.close();
  // 刷新告警列表等数据
  getAlertListWithId();
  setTimeout(() => {
    emit('afterChangeState');
  }, 500);
};

const issueInstruction = (alertId) => {
  // ElMessage.success('跳转到指令下发');
  // cmdDialogData.visible = true;
  modalApiB.open();
};

const lookDetail = (row) => {
  alertId.value = [row.id];
  if (row.systemName) {
    faultCode.value = '系统名称：' + row.systemName;
  } else {
    faultCode.value = '';
  }
  if (row.organizationName) {
    organizationName.value = row.organizationName;
  } else {
    organizationName.value = '';
  }
  console.log('alertIds', alertId.value);
  isAfterDisplayText.value = false;
  // dialogData.visible = true;
  modalApi.open();
  dialogData.type = row.handlingStatus;
};

/**
 * 聚合/还原告警列表
 */
const toggleAggregationState = () => {
  if (!isAggregation.value) {
    loading.value = true;
    setTimeout(() => {
      isAggregation.value = !isAggregation.value;
      loading.value = false;
    }, 1000);
  } else {
    isAggregation.value = !isAggregation.value;
  }
};
/**
 * 暴露给父组件方法
 */
defineExpose({
  toggleAggregationState,
});

onMounted(() => {
  // renderEcharts1(option1);
  // renderEcharts2(option2);
  getAlertListWithId();
});
</script>

<style scoped lang="less">
.custom-dialog-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
}
.max-lines {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /* 限制显示行数 */
  overflow: hidden;
  text-overflow: ellipsis;
}
/* 分割线颜色 */
:deep(.el-table) {
  --el-table-border-color: #8f8f91;
}
/* 表头样式 */
:deep(.el-table__header) th,
:deep(.el-table__expanded-cell) {
  background-color: #212a41 !important; /* 表头背景色 */
  color: white; /* 表头文字颜色 */
}
/* 表体样式 */
:deep(.el-table__body) tr {
  background-color: #212a41 !important; /* 表体背景色 */
  color: #fff; /* 表体文字颜色 */
}
/* 空白表格背景色 */
:deep(.el-table__empty-block) {
  background-color: #212a41 !important;
}

/* 鼠标悬停行样式 */
:deep(.el-table__body) tr:hover > td {
  background-color: #212a41 !important;
}
:deep(.el-table__body) tr.hover-row > td.el-table__cell {
  background-color: #212a41 !important;
}
/* 斑马纹表格样式 */
:deep(.el-table__body) tr.el-table__row--striped {
  background-color: #212a41;
}

:deep(.el-table__expand-icon) {
  color: white;
}

:deep(.el-scrollbar__bar.is-horizontal) {
  height: 12px;
}

:deep(.el-dialog) {
  background-color: #363f5c;
}
:deep(.el-dialog__title) {
  color: white;
}

:deep(.head-d) {
  color: #fff;
}

:deep(.el-collapse) {
  border: none;
}

:deep(.el-collapse-item__header) {
  margin-top: 10px;
  // background-color: #141d30;
  background-color: transparent;
  border-radius: 5px 5px 0 0;
}
:deep(.el-collapse-item__wrap) {
  // background-color: #141d30;
  background-color: transparent;
  border: none;
  border-radius: 0 0 5px 5px;
}

:deep(.el-collapse-item:last-child) {
  margin: 0;
}

:deep(.el-form-item__label) {
  color: white;
}

/* 统一修改所有输入组件 */
:deep(.el-input__wrapper),
:deep(.el-select__wrapper),
:deep(.el-date-editor .el-input__wrapper),
:deep(.el-textarea__inner) {
  background-color: #2a324b !important;
  box-shadow: 0 0 0 1px #4a556f inset !important;

  &:hover {
    box-shadow: 0 0 0 1px #5d6b8f inset !important;
  }

  &.is-focus {
    box-shadow: 0 0 0 1px #409eff inset !important;
  }
}
:deep(.el-input__count) {
  background: unset !important;
}
:deep(.el-input__inner),
:deep(.el-textarea__inner),
:deep(.el-select__selected-item),
:deep(.el-range-input),
:deep(.el-range-separator) {
  color: white !important;
}
:deep(.el-select__wrapper.is-disabled .el-select__selected-item) {
  color: #575b63 !important;
}
:deep(.el-select__placeholder.is-transparent) {
  color: var(--el-text-color-placeholder) !important;
}
:deep(.el-tag) {
  background-color: #212a41;
  color: white;
}
:deep(.el-overlay),
:deep(.el-overlay-dialog) {
  width: 100%;
}
</style>

<style>
.custom-tooltip {
  max-width: 500px; /* 设置最大宽度 */
  word-wrap: break-word; /* 强制换行 */
  white-space: normal; /* 允许换行（覆盖默认的 nowrap） */
}

.custom-modal {
  background-color: #363f5c;
  color: white;
  border-width: 0;
  h2 {
    font-size: 18px;
  }

  > div:first-child {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  > div:nth-child(2) {
    padding: 10px 8px;
  }
  > button {
    color: #999;
  }
}
</style>
