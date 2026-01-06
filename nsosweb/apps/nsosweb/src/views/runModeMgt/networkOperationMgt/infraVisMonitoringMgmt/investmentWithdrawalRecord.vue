<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { downloadFile } from '#/utils/download.ts';
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

import { getmonitorSq, getmonitorOperation } from '#/api';

// 头部表单
const queryForm = reactive({
  facilityType: '',
  manufacturer: '',
  pageNo: 1,
  pageSize: 10,
  total: 0,
  permissionIds: [],
  sqId: '',
  sqIp: '',
  sqName: '',
  sqStatus: '',
  subUnit: true,
  timeRange: [],
  unit: '',
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
// const statusOptions = ['正常运行', '运行异常'];
const operationTypes = [
  {
    label: '投运',
    value: '1',
  },
  {
    label: '退运',
    value: '2',
  },
];

// 查询数据
async function queryData() {
  try {
    const res = await getmonitorOperation(queryForm);
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
    facilityType: '',
    manufacturer: '',
    pageNo: 1,
    pageSize: 10,
    total: 0,
    permissionIds: [],
    sqId: '',
    sqIp: '',
    sqName: '',
    sqStatus: '',
    subUnit: true,
    timeRange: [],
    unit: '',
    unitId: '',
    unitIds: [],
    upSqId: '',
  });
  queryData();
}
// 下载文件
async function downloadAttachment(row: any) {
  try {
    await downloadFile(
      import.meta.env.VITE_NSOSFS + '/monitorSq/operationSearchExport',
      queryForm,
      '投退记录.xlsx',
      'post',
    );
  } catch {}
}
// 换页查询
function currentChange(val: number) {
  queryForm.pageNo = val;
  queryData();
}

function handleSizeChange(val: number) {
  queryForm.pageSize = val;
  queryData();
}

onMounted(() => {
  queryData();
});
</script>
<template>
  <div>
    <div style="padding: 0 20px">
      <ElForm :inline="true" :model="queryForm" label-position="right">
        <ElFormItem label="设施ID:" style="width: 300px">
          <ElInput v-model="queryForm.sqId" clearable />
        </ElFormItem>
        <ElFormItem label="设施名称:" style="width: 300px">
          <ElInput v-model="queryForm.sqName" clearable />
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

        <ElFormItem label="投退类型:" style="width: 300px">
          <ElSelect
            v-model="queryForm.operationType"
            placeholder="请选择设施类型"
            clearable
          >
            <el-option
              v-for="(item, index) in operationTypes"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </ElSelect>
        </ElFormItem>

        <ElFormItem label="投退工单编号:" style="width: 300px">
          <ElInput v-model="queryForm.operationOrder" clearable />
        </ElFormItem>

        <ElFormItem label="运维单位:" style="width: 300px">
          <ElSelect v-model="queryForm.unit" placeholder="请选择运维单位" clearable>
            <el-option
              v-for="(item, index) in unitOptions"
              :key="index"
              :label="item"
              :value="item"
            />
          </ElSelect>
        </ElFormItem>

        <ElFormItem label="设施类型:" style="width: 300px">
          <ElSelect
            v-model="queryForm.facilityType"
            placeholder="请选择设施类型"
            clearable
          >
            <el-option
              v-for="(item, index) in facilitiesTypes"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </ElSelect>
        </ElFormItem>
                <ElFormItem label="投退时间:" style="width: 310px">
          <el-date-picker
            v-model="queryForm.timeRange"
            type="daterange"
            :size="size"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </ElFormItem>
        <ElFormItem style="width: auto">
          <ElButton type="primary" :icon="Search" @click="queryData"
            >查询
          </ElButton>
          <ElButton type="primary" :icon="Download" @click="downloadAttachment"
            >导出</ElButton
          >
          <ElButton type="info" @click="reset" :icon="Refresh">重置</ElButton>
        </ElFormItem>
      </ElForm>
    </div>
    <div style="padding: 0 20px 10px 20px">
      <ElTable ref="tab" border stripe :data="data.tableData" height="660px">
        <ElTableColumn type="index" align="center" />
        <ElTableColumn type="selection" align="center" />
        <ElTableColumn align="center" label="投退工单编号">
          <template #default="scope">
            <span>{{
              scope.row.operationOrder
            }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="operationTime" align="center" label="投退时间" />
        <ElTableColumn align="center" label="投退设施ID">
          <template #default="scope">
            <span>{{ scope.row.sqId }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn
          prop="sqName"
          align="center"
          label="投退设施名称"
          style="width: 250px"
        />

        <ElTableColumn prop="operationType" align="center" label="投退类型">
          <template #default="scope">
            <span>{{
              operationTypes.find((item) => {
                return item.value === scope.row.operationType;
              })?.label
            }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="upSqId" align="center" label="上游节点ID" />
        <ElTableColumn prop="facilityType" align="center" label="设施类型">
          <template #default="scope">
            <span>{{
              facilitiesTypes.find((item) => {
                return item.value === scope.row.facilityType;
              })?.label
            }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="area" align="center" label="所属区域" />
        <ElTableColumn prop="unit" align="center" label="运维单位" />
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
