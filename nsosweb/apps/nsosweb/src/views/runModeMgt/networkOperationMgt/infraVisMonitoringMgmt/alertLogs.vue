<script setup lang="ts">
import { onMounted, reactive } from 'vue';

import { Download, Search, Refresh } from '@element-plus/icons-vue';
import {
  ElButton,
  ElCol,
  ElForm,
  ElFormItem,
  ElInput,
  ElPagination,
  ElRow,
  ElSelect,
  ElTable,
  ElTableColumn,
} from 'element-plus';
import { downloadFile } from '#/utils/download.ts';
import { getmonitorAlarmSq } from '#/api';

// 头部表单
const queryForm = reactive({
  alarmId: '',
  alarmSqId: '',
  alarmSqName: '',
  context: '',
  total: 0,
  manufacturer: '',
  pageNo: 1,
  pageSize: 10,
  permissionIds: [],
  sqIp: '',
  sqType: '',
  sqUnit: '',
  subUnit: true,
  timeRange: [],
  unitId: '',
  unitIds: [],
  upSqId: '',
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

// 设施运维模式
const maintainMode = {
  '1': '运调检测',
  '2': '运维发现',
  '3': '运服报障',
};

// 设施类型枚举示例
const facilitiesTypes = [
  { label: '服务器', value: '1' },
  { label: '存储器', value: '2' },
  { label: '网络交换机', value: '3' },
  { label: '防火墙', value: '4' },
  { label: '负载均衡', value: '5' },
  { label: '中间件', value: '6' },
  { label: '数据库', value: '7' },
];
const unitOptions = ['通信公司', '大数据公司'];

// 查询数据
async function queryData() {
  try {
    const res = await getmonitorAlarmSq(queryForm);
    if (res) {
      data.tableData = res.list;
      queryForm.total = res.total;
    }
  } catch (error) {
    console.error('查询数据失败:', error);
  }
}

// 重置查询
function reset() {
  Object.assign(queryForm, {
    alarmId: '',
    alarmSqId: '',
    alarmSqName: '',
    context: '',
    total: 0,
    manufacturer: '',
    pageNo: 1,
    pageSize: 10,
    permissionIds: [],
    sqIp: '',
    sqType: '',
    sqUnit: '',
    subUnit: true,
    timeRange: [],
    unitId: '',
    unitIds: [],
    upSqId: '',
  });
  queryData()
}
onMounted(() => {
  queryData();
});

// 下载文件
async function downloadAttachment(row: any) {
  try {
    await downloadFile(
      import.meta.env.VITE_NSOSFS + '/monitorSq/alarmExport',
      queryForm,
      '告警记录.xlsx',
      'post',
    );
  } catch {}
}

// 换页查询
function currentChange(val: any) {
  queryForm.pageNo = val;
  queryData();
}

function handleSizeChange(val: number) {
  queryForm.pageSize = val;
  queryData();
}
</script>
<template>
  <div>
    <div style="padding: 0 20px">
      <ElForm :inline="true" :model="queryForm" label-position="right">
        <ElFormItem label="设施ID:" style="width: 300px">
          <ElInput v-model="queryForm.alarmSqId" clearable />
        </ElFormItem>
        <ElFormItem label="设施名称:" style="width: 300px">
          <ElInput v-model="queryForm.alarmSqName" clearable />
        </ElFormItem>
        <ElFormItem label="设施IP:" style="width: 300px">
          <ElInput v-model="queryForm.sqIp" clearable />
        </ElFormItem>
        <ElFormItem label="上游节点ID:" style="width: 300px">
          <ElInput v-model="queryForm.upSqId" clearable />
        </ElFormItem>
        <ElFormItem label="生产厂家:" style="width: 310px">
          <ElInput v-model="queryForm.manufacturer" clearable />
        </ElFormItem>
        <ElFormItem label="告警编号:" style="width: 300px">
          <ElInput v-model="queryForm.alarmId" clearable />
        </ElFormItem>
        <ElFormItem label="告警报文:" style="width: 300px">
          <ElInput v-model="queryForm.context" clearable />
        </ElFormItem>
        <ElFormItem label="运维单位:" style="width: 300px">
          <ElSelect v-model="queryForm.sqUnit" placeholder="请选择运维单位" clearable>
            <el-option
              v-for="(item, index) in unitOptions"
              :key="index"
              :label="item"
              :value="item"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="设施类型:" style="width: 300px">
          <ElSelect v-model="queryForm.sqType" placeholder="请选择设施类型" clearable>
            <el-option
              v-for="(item, index) in facilitiesTypes"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </ElSelect>
        </ElFormItem>
                <ElFormItem label="告警时间:" style="width: 310px">
          <el-date-picker
            v-model="queryForm.timeRange"
            type="daterange"
            :size="size"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </ElFormItem>
        <el-form-item style="width: auto">
          <ElButton type="primary" :icon="Search" @click="queryData">
            查询
          </ElButton>
          <ElButton type="primary" :icon="Download" @click="downloadAttachment"
            >导出</ElButton
          >
          <ElButton type="info" @click="reset" :icon="Refresh">重置</ElButton>
        </el-form-item>
      </ElForm>
    </div>
    <div style="padding: 0 20px 10px 20px">
      <ElTable ref="tab" border stripe :data="data.tableData" height="660px">
        <ElTableColumn type="index" align="center" />
        <ElTableColumn type="selection" align="center" />
        <ElTableColumn align="center" label="告警编号" width="100px">
          <template #default="scope">
            <span>{{
              scope.row.alarmId
            }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="alarmTime" align="center" label="告警时间" />
        <ElTableColumn
          prop="alarmContext"
          align="center"
          label="告警报文"
          width="350px"
        />
        <ElTableColumn align="center" label="告警设施ID">
          <template #default="scope">
            <span>{{
              scope.row.alarmSqId
            }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="alarmSqName" align="center" label="告警设施" />
        <ElTableColumn prop="alarmLevel" align="center" label="告警级别" />
        <ElTableColumn prop="alarmSqYmode" align="center" label="运维模式">
          <template #default="scope">
            <span>{{ maintainMode[scope.row.alarmSqYmode] }}</span>
          </template>
        </ElTableColumn>

        <ElTableColumn prop="alarmSqYunit" align="center" label="运维单位" />
        <ElTableColumn prop="manufacturer" align="center" label="生产厂家" />
      </ElTable>
    </div>
    <div style="padding-left: 20px; display: flex">
      <ElPagination
        v-model:current-page="queryForm.pageNo"
        v-model:page-size="queryForm.pageSize"
        :total="queryForm.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="currentChange"
      />
    </div>
  </div>
</template>
<style lang="less" scoped>
:deep(.el-form-item) {
  width: 270px;
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
</style>
