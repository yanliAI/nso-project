<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';

import { Download, Search, Refresh } from '@element-plus/icons-vue';
import {
  ElTable,
  ElTableColumn,
  ElContainer,
  ElFormItem,
  ElDialog,
  ElForm,
  ElCard,
  ElInput,
  ElButton,
  ElSelect,
  ElRow,
  ElCol,
  ElTabs,
  ElPagination,
  ElMessage,
  ElMessageBox,
  type FormInstance,
} from 'element-plus';

import {
  getAllDesc,
  getAllSqType,
  getAllUnits,
  getStatisticsByTime,
} from '#/api';
import { downloadFile } from '#/utils/download.ts';

// 头部表单
const queryForm = reactive({
  alarmDesc: '',
  alarmSqId: '',
  alarmSqName: '',
  date: '',
  manufacturer: '',
  sqType: '',
  sqUnit: '',
  timeRange: [],
  timeType: '',
});

// 表格
const data = reactive({
  tableData: [],
  pageInfo: {
    pageSize: 5,
    pageNo: 1,
    total: 10,
  },
});

// 获取全部的异常类型
const errorTypes = ref([]);
async function getAbnormalTypes() {
  try {
    const res = await getAllDesc();
    if (res) {
      errorTypes.value = res;
    }
  } catch (error) {
    console.error('获取异常类型失败:', error);
  }
}

const sqTypes = [
  '服务器',
  '存储器',
  '网络交换机',
  '防火墙',
  '负载均衡',
  '中间件',
  '数据库',
];
// 获取全部的设施类型
const facilitiesTypes = ref([]);
async function getFacilitiesTypes() {
  try {
    const res = await getAllSqType();
    if (res) {
      facilitiesTypes.value = res;
    }
  } catch (error) {
    console.error('获取设施类型失败:', error);
  }
}

// 获取全部运维单位
const unitTypes = ref([]);
async function getAllUnit() {
  try {
    const res = await getAllUnits();
    if (res) {
      unitTypes.value = res;
    }
  } catch (error) {
    console.error('获取运维单位失败:', error);
  }
}

// 查询数据
async function queryData() {
  // console.log('queryForm',queryForm)
  try {
    if (queryForm.timeType === '4' && queryForm.timeRange.length > 0) {
      queryForm.startTime = queryForm.timeRange[0];
      queryForm.endTime = queryForm.timeRange[1];
      queryForm.date = '';
    } else {
      queryForm.startTime = '';
      queryForm.endTime = '';
    }
    const res = await getStatisticsByTime(queryForm);
    if (res) {
      data.tableData = res;
    }
  } catch (error) {
    console.error('查询数据失败:', error);
  }
}

// 下载文件
async function downloadAttachment(row: any) {
  try {
    await downloadFile(
      import.meta.env.VITE_NSOSFS + '/monitorAlarmLog/statisticsByTime/export',
      queryForm,
      '预警分析清单-时间纬度.xlsx',
      'post',
    );
  } catch {}
}

// 重置表单方法
function reset() {
  Object.assign(queryForm, {
    alarmDesc: '',
    alarmSqId: '',
    alarmSqName: '',
    date: '',
    manufacturer: '',
    sqType: '',
    sqUnit: '',
    timeRange: [],
    timeType: '',
  });
  // 可选：手动触发一次查询（根据需求决定）
  queryData();
}

// 根据时间类型显示统计时间单位
const pickerByDay = ref('1');
const dateType = {
  '1': 'date',
  '2': 'month',
  '3': 'year',
  '4': 'daterange',
};
function changeTimeType(val: any) {
  pickerByDay.value = val;
  queryForm.date = '';
}

onMounted(() => {
  getAbnormalTypes();
  getFacilitiesTypes();
  getAllUnit();
  queryData();
});

// 点击异常次数，显示详情
const openDialog = ref(false);
function getAlarmDetails(val: any) {
  cardData.sqType = val.sqType;
  cardData.itemData = val.alarmLogList;
  openDialog.value = true;
}
const cardData = reactive({
  sqType: '',
  itemData: [],
});

const cardItemName = [
  {
    itemZhName: '设施ID',
    itemKey: 'alarmSqId',
  },
  {
    itemZhName: '设施名称',
    itemKey: 'alarmSqName',
  },
  {
    itemZhName: '设施类型',
    itemKey: 'facilityType',
  },
  {
    itemZhName: '上游设施ID',
    itemKey: 'upSqId',
  },
  {
    itemZhName: '上游设施名称',
    itemKey: 'upSqName',
  },
  {
    itemZhName: '上游设施类型',
    itemKey: 'upSqType',
  },
  {
    itemZhName: '生产厂家',
    itemKey: 'manufacturer',
  },
  {
    itemZhName: '运维单位',
    itemKey: 'alarmSqYunit',
  },
  {
    itemZhName: '设施IP',
    itemKey: 'sqIp',
  },
  {
    itemZhName: '异常时间',
    itemKey: 'alarmTime',
  },
  {
    itemZhName: '异常类型',
    itemKey: 'alarmDesc',
  },
  {
    itemZhName: '异常持续时间',
    itemKey: 'alarmKeepTime',
  },
];
</script>
<template>
  <div>
    <div style="padding: 0 20px">
      <el-form :inline="true" :model="queryForm" label-position="right">
        <el-form-item label="时间纬度类型:" style="width: 335px">
          <el-select
            v-model="queryForm.timeType"
            placeholder="时间纬度类型"
            @change="changeTimeType"
            class="demo-form-inline"
            clearable
          >
            <el-option label="按日" value="1" />
            <el-option label="按月" value="2" />
            <el-option label="按年" value="3" />
            <el-option label="自定义" value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="统计区间:" style="width: 335px">
          <el-date-picker
            v-if="pickerByDay !== '4'"
            v-model="queryForm.date"
            :type="dateType[pickerByDay]"
            placeholder=""
            :value-format="
              pickerByDay === '3'
                ? 'YYYY'
                : pickerByDay === '2'
                  ? 'YYYY-MM'
                  : 'YYYY-MM-DD'
            "
          />
          <el-date-picker
            v-else
            v-model="queryForm.timeRange"
            type="daterange"
            :size="size"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="设施ID:" style="width: 335px">
          <el-input v-model="queryForm.alarmSqId" clearable />
        </el-form-item>
        <el-form-item label="设施名称:" style="width: 335px">
          <el-input v-model="queryForm.alarmSqName" clearable />
        </el-form-item>
        <!-- <el-col :span="4">
            <el-form-item label="分析时间:">
              <el-date-picker
                  v-model="queryForm.timeRange"
                  type="daterange"
                  :size="size"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                />
            </el-form-item>
          </el-col> -->
        <el-form-item label="生产厂家:" style="width: 335px">
          <el-input v-model="queryForm.manufacturer" clearable />
        </el-form-item>
        <el-form-item label="运维单位:" style="width: 335px">
          <el-select
            v-model="queryForm.sqUnit"
            placeholder="请选择运维单位"
            clearable
          >
            <el-option
              v-for="(item, index) in unitTypes"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设施类型:" style="width: 335px">
          <el-select
            v-model="queryForm.sqType"
            placeholder="请选择设施类型"
            clearable
          >
            <el-option
              v-for="(item, index) in facilitiesTypes"
              :key="index"
              :label="sqTypes[Number(item) - 1]"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="异常类型:" style="width: 335px">
          <el-select
            v-model="queryForm.alarmDesc"
            placeholder="请选择异常类型"
            clearable
          >
            <el-option
              v-for="(item, index) in errorTypes"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item style="width: auto">
          <el-button type="primary" :icon="Search" @click="queryData"
            >查询</el-button
          >
          <el-button type="info" :icon="Refresh" @click="reset">重置</el-button>
          <el-button type="primary" @click="downloadAttachment" :icon="Download"
            >导出</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div style="padding: 10px 20px 10px 20px">
      <el-table ref="tab" border stripe :data="data.tableData" height="680px">
        <el-table-column align="center" type="index" />
        <el-table-column type="selection" />
        <el-table-column prop="" align="center" label="设施ID">
          <template #default="scope">
            <span
              style="color: #32b0f2 !important; cursor: pointer"
              @click="getAlarmDetails(scope.row)"
              >{{ scope.row.alarmSqId }}</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="alarmSqName" align="center" label="设施名称" />
        <el-table-column prop="alarmTimes" align="center" label="异常次数" />
        <!-- <el-table-column align="center" label="异常次数">
          <template #default="scope">
            <span style="color: #32b0f2 !important; cursor: pointer" @click="getAlarmDetails(scope.row)">{{ scope.row.alarmTimes }}</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="facilityType" align="center" label="设施类型">
          <template #default="scope">
            <span>{{ sqTypes[Number(scope.row.facilityType - 1)] }}</span>
          </template>
        </el-table-column>
        sqTypes
        <el-table-column prop="manufacturer" align="center" label="生产厂家" />
        <el-table-column prop="alarmSqYunit" align="center" label="运维单位" />
        <el-table-column prop="upSqId" align="center" label="上游设施ID" />
        <el-table-column prop="upSqName" align="center" label="上游设施名称" />
        <el-table-column prop="sqIp" align="center" label="设施IP" />
        <el-table-column prop="alarmTime" align="center" label="分析时间" />
      </el-table>
    </div>
    <el-dialog
      v-model="openDialog"
      title="异常详情"
      width="1000"
      class="system-detail-dialog"
    >
      <div class="flex-container" style="padding: 10px 20px; height: 660px">
        <div
          style="
            background: #f1f3f6;
            height: 600px;
            overflow-y: auto;
            border-bottom: 1px solid #e4e4e7;
          "
        >
          <div
            v-for="(cardItem, cardIndex) in cardData.itemData"
            :key="cardIndex"
          >
            <el-card style="margin: 10px; background: white" shadow="always">
              <div
                style="
                  display: flex;
                  flex-wrap: wrap;
                  width: 100%;
                  padding: 0 10px;
                "
              >
                <div
                  v-for="(item, index) in cardItemName"
                  :key="index"
                  style="
                    width: calc(100% / 3);
                    height: 30px;
                    line-height: 30px;
                    font-size: 14px;
                  "
                >
                  <span
                    style="
                      color: #9ea69e;
                      width: 100px;
                      display: inline-block;
                      text-align: right;
                    "
                    >{{ item.itemZhName }}:</span
                  >
                  <span
                    style="margin-left: 10px"
                    v-if="
                      item.itemKey === 'upSqType' ||
                      item.itemKey === 'facilityType'
                    "
                  >
                    {{ sqTypes[Number(cardItem[item.itemKey]) - 1] }}</span
                  >
                  <span style="margin-left: 10px" v-else>{{
                    item.itemKey === 'alarmKeepTime'
                      ? `${cardItem[item.itemKey]}h`
                      : cardItem[item.itemKey]
                  }}</span>
                </div>
              </div>
            </el-card>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="less" scoped>
// :deep(.el-form-item) {
//   width: 250px;
//   .el-form-item__content {
//     display: flex;
//     justify-content: flex-end;
//   }
//   .el-form-item__label {
//     width: 100px;
//     text-align: right;
//     font-size: 14px;
//     font-weight: 500;
//     // line-height: 32px;
//     color: #515a6e;
//   }
// }
.demo-form-inline .el-input {
  --el-input-width: 100%;
}

.demo-form-inline .el-select {
  --el-select-width: 100%;
}

:deep(.el-date-editor.el-input, .el-date-editor.el-input__wrapper) {
  width: 100%;
}
:deep(.el-form--inline .el-form-item) {
  width: calc(100% - 20px);
  margin-right: 20px;
  margin-bottom: 12px;
}

// 分页
:deep(.el-pagination button) {
  border: 1px solid #efefef;
  color: #2074c9;
  // box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
:deep(.el-pagination > .is-last) {
  border-left: none;
}
:deep(.el-pager li.is-active) {
  background: #169bd5;
  color: #fff;
}
:deep(.el-pager li) {
  border: 1px solid #efefef;
  border-left: none;
  color: #027db4;
}

// 弹窗
//:deep(.el-dialog__title) {
//  color: black;
//  font-size: 20px;
//  font-weight: 500;
//}
</style>
