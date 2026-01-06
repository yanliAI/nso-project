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
      :data="!isAggregation ? beforeTableData : tableData"
      :max-height="!isAggregation ? 300 : 500"
      scrollbar-always-on
    >
      <el-table-column type="index" v-if="!isAggregation"></el-table-column>
      <el-table-column type="expand" v-if="isAggregation">
        <template #default="props">
          <div>
            <el-table :data="props.row.list">
              <el-table-column type="index"></el-table-column>
              <el-table-column width="20"> </el-table-column>
              <el-table-column
                prop="latestAlertTime"
                label="末次时间"
                width="200"
              >
              </el-table-column>
              <el-table-column prop="alertDesc" label="告警描述" width="320">
                <template #default="scope">
                  <el-tooltip
                    effect="light"
                    :content="scope.row.alertDesc"
                    placement="bottom"
                    popper-class="custom-tooltip"
                  >
                    <span class="max-lines">{{ scope.row.alertDesc }}</span>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column prop="attackerIp" label="源IP"></el-table-column>
              <el-table-column prop="victimIp" label="目的IP"></el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        prop="alertName"
        label="告警名称"
        :width="isAggregation ? 300 : 150"
      >
        <template #default="scope">
          <el-tooltip
            effect="light"
            :content="scope.row.alertName"
            placement="bottom"
            popper-class="custom-tooltip"
          >
            <span class="max-lines">{{ scope.row.alertName }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        v-if="isAggregation"
        label="数量"
        sortable
        :sort-method="sortNum"
        width="100"
      >
        <template #default="scope">
          {{ scope.row.list?.length }}
        </template>
      </el-table-column>

      <el-table-column
        v-if="!isAggregation"
        prop="latestAlertTime"
        label="末次时间"
        sortable
        :sort-method="sortTime"
        width="120"
      >
      </el-table-column>
      <el-table-column
        prop="alertType"
        label="告警类型"
        sortable
        :sort-method="sortType"
        width="120"
      >
      </el-table-column>
      <el-table-column
        v-if="!isAggregation"
        prop="alertDesc"
        label="告警描述"
        width="200"
      >
        <template #default="scope">
          <el-tooltip
            effect="light"
            :content="scope.row.alertDesc"
            placement="bottom"
            popper-class="custom-tooltip"
          >
            <span class="max-lines">{{ scope.row.alertDesc }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="newDisposeStatus" label="处置状态">
        <template #default="scope">
          <span v-if="scope.row.newDisposeStatus == 0">未研判</span>
          <span v-else-if="scope.row.newDisposeStatus == 1">已处置</span>
          <span v-else-if="scope.row.newDisposeStatus == 2">已下令</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="!isAggregation"
        prop="attackerIp"
        label="源IP"
        width="130"
      ></el-table-column>
      <el-table-column
        v-if="!isAggregation"
        prop="victimIp"
        label="目的IP"
        width="130"
      ></el-table-column>
      <el-table-column prop="systemName" label="系统名称" width="120">
      </el-table-column>
      <el-table-column prop="organizationName" label="运维单位" width="180">
      </el-table-column>
      <el-table-column prop="deviceOwner" label="设备主人" width="100">
      </el-table-column>
      <!-- <el-table-column prop="phone" label="联系电话" width="100">
      </el-table-column> -->
      <el-table-column label="操作" align="center" width="120" fixed="right">
        <template #default="scope">
          <el-button type="primary" link @click="lookDetail(scope.row)">{{
            scope.row.newDisposeStatus == 0 ? '智能研判' : '查看'
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handlePageChange"
      :page-sizes="[20, 50, 100, 200]"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
    <el-row :gutter="30" style="margin-top: 10px" v-show="!isAggregation">
      <el-col :span="12">
        <div style="border-radius: 10px; background-color: #212a41">
          <EchartsUI ref="chartRef1" height="260px" />
        </div>
      </el-col>
      <el-col :span="12">
        <div style="border-radius: 10px; background-color: #212a41">
          <EchartsUI ref="chartRef2" height="260px" />
        </div>
      </el-col>
    </el-row>

    <!-- 告警信息弹框 -->
    <el-dialog
      v-model="dialogData.visible"
      title="告警信息"
      width="1200"
      :show-close="false"
      z-index="1010"
    >
      <template #header="{ close, titleId, titleClass }">
        <div class="custom-dialog-header">
          <h4 :id="titleId" :class="titleClass">告警信息</h4>
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
            <el-button @click="dialogData.visible = false">关闭</el-button>
          </div>
        </div>
      </template>
      <AlarmDetail
        ref="alarmDetailRef"
        v-if="dialogData.visible"
        :alertId="alertId"
        :openType="dialogData.type"
        @afterDisplayText="isAfterDisplayText = true"
      ></AlarmDetail>
      <!-- <template #footer v-if="dialogData.type == 0 && isAfterDisplayText">
        <div class="dialog-footer">
          <el-button type="primary" @click="issueInstruction(alertId)">
            生成指令
          </el-button>
          <el-button type="primary" @click="misstatement(alertId)">
            已研判
          </el-button>
          <el-button @click="dialogData.visible = false">取消</el-button>
        </div>
      </template> -->
    </el-dialog>

    <el-dialog
      v-model="cmdDialogData.visible"
      title="生成指令"
      width="1200"
      class="cmd-dialog"
      z-index="1020"
    >
      <CmdDetail
        v-if="cmdDialogData.visible"
        :cmdFl="'3'"
        :sldwParams="organizationName"
        :faultCode="faultCode"
        :czjyText="`处置建议：\n${alarmDetailRef.czjyText}`"
        @afterAdd="onSubmit($event)"
      ></CmdDetail>
    </el-dialog>
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
import {
  getAlertListWithIdApi,
  getGroupAlertListWithIdApi,
  changeAlertStatusApi,
} from '#/api';
import AlarmDetail from './alarmDetail.vue';
import CmdDetail from '#/views/runDdMgt/cmdMgt/cmdDetailSafety.vue';

defineOptions({
  name: 'WallChartAlarmList',
});

const loading = ref(false);
// 父组件传入的图元id、布防图id
const graphicId = defineModel('graphicId');
const topoId = defineModel('topoId');
const emit = defineEmits(['afterChangeState']);
const isAfterDisplayText = ref(false);
const alertId = ref([]);
// const isShowSystemInfo = ref(false);
// const systemInfo = ref({
//   deviceOwner: '',
//   phone: '',
//   systemName: '',
//   // 受令单位
//   organizationName: '',
// });
// 下令关联信息
const faultCode = ref('');
// 受令单位
const organizationName = ref('');
const table = ref(null);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);
// const defaultTableData = [
//   {
//     alertName: '攻击利用-代码执行',
//     victimIp: '',
//     newDisposeStatus: '0',
//     alertCatLevel1Name: '攻击利用',
//     alertCatLevel2Name: '代码执行',
//     list: [
//       {
//         alertId: 'cecd077a-7d7d-4313-93c3-ab8d44fa13b9',
//         latestAlertTime: '2025-06-08 05:00:00',
//         alertName: '攻击利用-代码执行',
//         alertCatLevel1Name: '攻击利用',
//         alertCatLevel2Name: '代码执行',
//         alertDesc:
//           'HNAP(Home Network Administration Protocol,家庭网络管理协议)是一种基于SOAP(Simple Object Access Protocol,简单对象管理协议)的协议，和UPnP很像，通常被D-Link的”EZ”设置程序用来初始化设置路由器。D-Link设备的漏洞中存在HNAP SOAPAction-Header命令执行。',
//         victimIp: '',
//         attackerIp: '',
//         newDisposeStatus: '0',
//       },
//     ],
//     systemInfo: {
//       organizationId: '210000',
//       organizationName: '南方电网数字电网集团有限公司',
//       applicationSystemName: '电网管理平台（计财域）',
//       acountName: '于辉',
//       acountMobile: null,
//     },
//   },
// ];
const alarmDetailRef = ref();
const tableData = ref([]);
// 聚合前的表格数据
const beforeTableData = ref([]);
// 是否聚合
const isAggregation = ref(false);
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
    text: '告警等级统计图',
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
 * 按照数量排序
 * @param a
 * @param b
 */
const sortNum = (a, b) => {
  return a.list?.length - b.list?.length;
};
/**
 * 按照时间排序
 * @param a
 * @param b
 */
const sortTime = (a, b) => {
  return new Date(a.latestAlertTime) - new Date(b.latestAlertTime);
};
/**
 * 按照类型拼音排序
 * @param a
 * @param b
 */
const sortType = (a, b) => {
  return a.alertType?.localeCompare(b.alertType, 'zh-Hans-CN');
};
const handleSizeChange = (size: number) => {
  pageSize.value = size;
  getAlertListWithId();
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  getAlertListWithId();
};
const orderLevel = ['危急', '高危', '中危', '低危'];
const getAlertListWithId = async () => {
  if (!graphicId.value || !topoId.value) {
    return;
  }
  loading.value = true;
  let result;
  try {
    let params = {
      pageNo: currentPage.value,
      pageSize: pageSize.value,
      id: graphicId.value,
      topoId: topoId.value,
    };
    if (!isAggregation.value) {
      result = await getAlertListWithIdApi(params);
    } else {
      result = await getGroupAlertListWithIdApi(params);
    }
    loading.value = false;
  } catch {
    loading.value = false;
    return;
  }
  // 聚合前
  if (!isAggregation.value) {
    total.value = result.total;
    try {
      result = result.records[0];
    } catch {
      return;
    }
    beforeTableData.value = result.list.map((item) => {
      return {
        ...item,
        alertType: `${item.alertCatLevel1Name} - ${item.alertCatLevel2Name}`,
        systemName: item.systemInfo.applicationSystemName,
        deviceOwner: item.systemInfo.acountName,
        phone: item.systemInfo.acountMobile,
        organizationName: item.systemInfo.organizationName,
      };
    });
    // beforeTableData.value = tableData.value.flatMap((parent) => {
    //   return parent.list.map((child) => ({
    //     alertName: parent.alertName,
    //     newDisposeStatus: parent.newDisposeStatus,
    //     alertType: parent.alertType,
    //     systemName: parent.systemName,
    //     deviceOwner: parent.deviceOwner,
    //     phone: parent.phone,
    //     organizationName: parent.organizationName,
    //     ...child,
    //   }));
    // });
  } else {
    // 聚合后
    total.value = result.total;
    tableData.value = result.records[0].records.map((item) => {
      return {
        systemName: item.systemInfo.applicationSystemName,
        deviceOwner: item.systemInfo.acountName,
        phone: item.systemInfo.acountMobile,
        organizationName: item.systemInfo.organizationName,
        alertType: `${item.alertCatLevel1Name} - ${item.alertCatLevel2Name}`,
        ...item,
      };
    });
    return;
  }

  option1.series[0].data = [];
  orderLevel.forEach((key) => {
    if (result.severityCounts.hasOwnProperty(key)) {
      option1.series[0].data.push({
        name: key,
        value: result.severityCounts[key],
      });
    }
  });
  option2.series[0].data = [];
  totalNum.value = 0;
  Object.keys(result.countByType).forEach((key) => {
    totalNum.value += result.countByType[key];
    option2.series[0].data.push({ name: key, value: result.countByType[key] });
  });
  option2.graphic.style.text = `总数\n${totalNum.value}`;
  renderEcharts1(option1);
  renderEcharts2(option2);
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
    const result = await changeAlertStatusApi(params);

    if (result) {
      ElMessage.success('已处置');
      dialogData.visible = false;
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
  cmdDialogData.visible = false;
  // 修改状态为下令已研判
  let params = alertId.value.map((item) => {
    return { id: item, status: '2', cmdId: data.id, topoId: topoId.value };
  });
  try {
    const result = await changeAlertStatusApi(params);
  } catch {
    return;
  }
  dialogData.visible = false;
  // 刷新告警列表等数据
  getAlertListWithId();
  setTimeout(() => {
    emit('afterChangeState');
  }, 500);
};

const issueInstruction = (alertId) => {
  // ElMessage.success('跳转到指令下发');
  cmdDialogData.visible = true;
};

const lookDetail = (row) => {
  if (row.list) {
    alertId.value = row.list.map((item) => item.alertId);
  } else {
    alertId.value = [row.alertId];
  }
  console.log('alertIds', alertId.value);
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
  isAfterDisplayText.value = false;
  dialogData.visible = true;
  dialogData.type = row.newDisposeStatus;
};

/**
 * 聚合/还原告警列表
 */
const toggleAggregationState = () => {
  isAggregation.value = !isAggregation.value;
  getAlertListWithId();
};
/**
 * 暴露给父组件方法
 */
defineExpose({
  toggleAggregationState,
});

onMounted(() => {
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
// 分页样式调整
:deep(.el-pagination) {
  margin-top: 10px;
  padding: 2px 10px;
  color: white;
  background: #212a41;

  .el-pagination__total,
  .el-pagination__jump {
    color: white;
  }

  button,
  button:disabled {
    background-color: #2a324b;
    color: #a8abb2;
  }
  .el-pager li {
    background-color: #2a324b;
    color: #fff;
  }
  .el-pager li.is-active {
    color: #006be6;
  }
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
</style>
