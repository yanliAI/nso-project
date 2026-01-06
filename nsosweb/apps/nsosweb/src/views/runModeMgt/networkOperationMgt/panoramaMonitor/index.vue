<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";

import { onMounted, reactive, ref } from "vue";
import { validateIP } from "#/utils/validateUtil.ts";
import {
  Search,
  Plus,
  Download,
  Delete,
  Refresh,
} from "@element-plus/icons-vue";
import {
  ElButton,
  ElCol,
  ElDialog,
  ElForm,
  ElFormItem,
  ElEmpty,
  ElImageViewer,
  ElInput,
  ElMessage,
  ElPagination,
  ElMessageBox,
  ElRow,
  ElSelect,
  ElTable,
  ElTableColumn,
} from "element-plus";

import {
  deleteMonitorSq,
  getmonitorSq,
  deleteCleanData,
  getVerfiyData,
  cleanData,
} from "#/api";
// 头部表单
const queryForm = reactive({
  facilityType: "",
  manufacturer: "",
  pageNo: 1,
  pageSize: 10,
  total: 0,
  permissionIds: [],
  sqId: "",
  sqIp: "",
  sqName: "",
  sqStatus: "",
  subUnit: true,
  timeRange: [],
  unit: "",
  unitId: "",
  unitIds: [],
  upSqId: "",
});

// 提交表单
const submitFormRef = ref<FormInstance>();
const openDetailDialog = ref(false);

const submitForm = reactive({
  drawingName: "",
  drawingRoute: "",
  area: "",
  facilityType: "",
  manufacturer: "",
  operationTime: "",
  sqIp: "",
  sqName: "",
  sqStatus: "",
  unit: "",
  upSqId: "",
  upSqName: "",
  upSqType: "",
});

// 自定义验证规则
const formRules: FormRules = {
  area: [{ required: true, message: "设施所属区域未填写", trigger: "blur" }],
  facilityType: [
    { required: true, message: "设施类型未填写", trigger: "blur" },
  ],
  manufacturer: [
    { required: true, message: "生产厂家未填写", trigger: "blur" },
  ],
  operationTime: [
    { required: true, message: "投运时间未填写", trigger: "blur" },
  ],
  sqIp: [{ required: true, message: "设施IP未填写", trigger: "blur" }],
  sqName: [{ required: true, message: "设施名称未填写", trigger: "blur" }],
  sqStatus: [{ required: true, message: "设施状态未选择", trigger: "blur" }],
  unit: [{ required: true, message: "运维单位未填写", trigger: "blur" }],
};

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
  { label: "服务器", value: "1" },
  { label: "存储器", value: "2" },
  { label: "网络交换机", value: "3" },
  { label: "防火墙", value: "4" },
  { label: "负载均衡", value: "5" },
  { label: "中间件", value: "6" },
  { label: "数据库", value: "7" },
];

const unitOptions = ["通信公司", "大数据公司"];

// 查询数据
async function queryData() {
  try {
    const res = await getmonitorSq(queryForm);
    if (res) {
      data.tableData = res.list;
      queryForm.total = res.total;
    }
  } catch (error) {
    console.error("查询数据失败:", error);
  }
}

// 重置查询
function reset() {
  Object.assign(queryForm, {
    facilityType: "",
    manufacturer: "",
    pageNo: 1,
    pageSize: 10,
    total: 0,
    permissionIds: [],
    sqId: "",
    sqIp: "",
    sqName: "",
    sqStatus: "",
    subUnit: true,
    timeRange: [],
    unit: "",
    unitId: "",
    unitIds: [],
    upSqId: "",
  });
  queryData();
}
// 删除设施
// 选中的行数据
const selectedRows = ref<any[]>([]);
// 处理选中行变化
const handleSelectionChange = (val: any[]) => {
  selectedRows.value = val;
};
// 删除选中行

// 展示细节
function showDetail(row: any) {
  openDetailDialog.value = true;
  Object.assign(submitForm, row);
}

onMounted(() => {
  queryData();
});

// 换页查询
function currentChange(val) {
  queryForm.pageNo = val;
  queryData();
}

function handleSizeChange(val: number) {
  queryForm.pageSize = val;
  queryData();
}

const cleanTable = ref([]);
// 数据清晰
async function getCleanData() {
  try {
    const res = await cleanData();
    if (res) {
      cleanTable.value = res;
    }
  } catch (error) {
    console.error("获取运维单位失败:", error);
  }
}

async function batchDeletData() {
  try {
    const res = await deleteCleanData(cleanTable.value);
  } catch (error) {
    console.error("批量删除失败:", error);
  }
}

async function openClean() {
  try {
    await getCleanData();
    
    if (cleanTable.value.length > 0) {
      const confirmResult = await ElMessageBox.confirm(
        `是否删除【${cleanTable.value}】这${cleanTable.value.length}条脏数据？`,
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      );

      if (confirmResult === 'confirm') {
        await batchDeletData(); // 等待删除操作完成
      }
    } else {
      ElMessage({
        type: "info",
        message: "已经无脏数据!",
      });
    }
  } catch (error) {
    // 处理取消操作或其他错误
    if (error !== 'cancel') {
      console.error('清理数据出错:', error);
    }
  } finally {
    await queryData(); // 无论成功或取消，最后都刷新数据
  }
}

const verifyDialog = ref(false);
const verifyTable = ref([]);
async function queryVerfiyData() {
  try {
    const res = await getVerfiyData({
      pageNo: 1,
      pageSize: 100,
      permissionIds: [],
      subUnit: true,
      unitId: "",
      unitIds: [],
    });
    if (res) {
      verifyTable.value = res.records;
    }
  } catch (error) {
    console.error("批量删除失败:", error);
  }
}
async function openVerify() {
  verifyDialog.value = true;
  queryVerfiyData();
}
</script>
<template>
  <div>
    <div style="padding: 20px 20px 0 20px">
      <el-form :inline="true" :model="queryForm" label-position="right">
        <el-form-item label="设施ID:" style="width: 300px">
          <el-input v-model="queryForm.sqId" clearable />
        </el-form-item>
        <el-form-item label="设施名称:" style="width: 300px">
          <el-input v-model="queryForm.sqName" clearable />
        </el-form-item>
        <el-form-item label="生产厂家:" style="width: 300px">
          <el-input v-model="queryForm.manufacturer" clearable />
        </el-form-item>
        <el-form-item label="运维单位:" style="width: 300px">
          <ElSelect
            v-model="queryForm.unit"
            placeholder="请选择运维单位"
            clearable
          >
            <el-option
              v-for="(item, index) in unitOptions"
              :key="index"
              :label="item"
              :value="item"
            />
          </ElSelect>
        </el-form-item>
        <el-form-item label="设施类型:" style="width: 300px">
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
        </el-form-item>
        <el-form-item style="width: auto">
          <ElButton type="primary" :icon="Search" @click="queryData"
            >查询</ElButton
          >
          <ElButton type="info" @click="reset" :icon="Refresh">重置</ElButton>
          <el-button type="primary" @click="openClean">数据清洗</el-button>
          <el-button type="primary" @click="openVerify">数据校核</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="padding: 0 20px 10px 20px">
      <ElTable
        ref="tab"
        border
        stripe
        :data="data.tableData"
        height="660px"
        @selection-change="handleSelectionChange"
      >
        <ElTableColumn type="index" align="center" />
        <ElTableColumn type="selection" align="center" />
        <ElTableColumn prop="sqId" align="center" label="设施ID">
          <template #default="scope">
            <span
              style="color: #32b0f2 !important; cursor: pointer"
              @click="showDetail(scope.row)"
              >{{ scope.row.sqId }}</span
            >
          </template>
        </ElTableColumn>
        <ElTableColumn prop="sqName" align="center" label="设施名称" />
        <ElTableColumn align="center" label="设施状态">
          <template #default="scope">
            <el-tag
              effect="dark"
              type="success"
              v-if="scope.row.sqStatus === '正常运行'"
            >
              {{ scope.row.sqStatus }}
            </el-tag>
            <el-tag effect="dark" type="warning" v-else>
              {{ scope.row.sqStatus }}
            </el-tag>
          </template>
        </ElTableColumn>
        <ElTableColumn align="center" label="上游节点ID">
          <template #default="scope">
            <span style="color: #32b0f2 !important">{{
              scope.row.upSqId
            }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="facilityType" align="center" label="设施类型">
          <template #default="scope">
            <span>{{
              facilitiesTypes.find(
                (item) => item.value === scope.row.facilityType
              )?.label || ""
            }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="manufacturer" align="center" label="生产厂家" />
        <ElTableColumn prop="unit" align="center" label="运维单位" />
        <ElTableColumn prop="area" align="center" label="设施所属区域" />
        <ElTableColumn prop="upSqName" align="center" label="上游节点名称" />
        <ElTableColumn prop="sqIp" align="center" label="设备IP" />
        <ElTableColumn prop="operationTime" align="center" label="投运时间" />
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
    <ElDialog
      v-model="openDetailDialog"
      title="设施详情"
      width="1000"
      class="system-detail-dialog"
    >
      <ElForm
        ref="submitFormRef"
        :model="submitForm"
        :rules="formRules"
        label-width="auto"
      >
        <ElRow>
          <ElCol :span="8">
            <ElFormItem label="设施名称:" prop="sqName" style="width: 100%">
              <ElInput
                v-model="submitForm.sqName"
                placeholder="请输入设施名称"
                clearable
                style="width: 250px"
                disabled
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem
              label="设施类型:"
              prop="facilityType"
              style="width: 100%"
            >
              <ElSelect
                v-model="submitForm.facilityType"
                placeholder="请选择设施类型"
                disabled
              >
                <el-option
                  v-for="(item, index) in facilitiesTypes"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </ElSelect>
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem
              label="生产厂家:"
              prop="manufacturer"
              style="width: 100%"
            >
              <ElInput
                v-model="submitForm.manufacturer"
                placeholder="请输入生产厂家"
                clearable
                style="width: 250px"
                disabled
              />
            </ElFormItem>
          </ElCol>
        </ElRow>
        <ElRow>
          <ElCol :span="8">
            <ElFormItem
              label="投运时间:"
              prop="operationTime"
              style="width: 100%"
            >
              <el-date-picker
                v-model="submitForm.operationTime"
                type="datetime"
                value-format="YYYY-MM-DD hh:mm:ss"
                disabled
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="运维单位:" prop="unit" style="width: 100%">
              <ElSelect
                v-model="submitForm.unit"
                placeholder="请选择运维单位"
                disabled
              >
                <el-option
                  v-for="(item, index) in unitOptions"
                  :key="index"
                  :label="item"
                  :value="item"
                />
              </ElSelect>
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="设施IP:" prop="sqIp" style="width: 100%">
              <ElInput
                v-model="submitForm.sqIp"
                placeholder="请输入设施IP"
                clearable
                style="width: 250px"
                disabled
              />
            </ElFormItem>
          </ElCol>
        </ElRow>
        <ElRow>
          <ElCol :span="8">
            <ElFormItem label="设施所属区域:" prop="area" style="width: 100%">
              <ElInput
                v-model="submitForm.area"
                placeholder="请输入区域"
                clearable
                style="width: 250px"
                disabled
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="设施状态:" prop="sqStatus" style="width: 100%">
              <ElSelect
                v-model="submitForm.sqStatus"
                placeholder="请输入设施状态"
                disabled
              >
                <el-option label="正常运行" value="正常运行" />
                <el-option label="运行异常" value="运行异常" />
              </ElSelect>
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem
              label="上游设施类型:"
              prop="upSqType"
              style="width: 100%"
            >
              <ElInput
                v-model="submitForm.upSqType"
                placeholder=""
                clearable
                style="width: 250px"
                disabled
              />
            </ElFormItem>
          </ElCol>
        </ElRow>
        <ElRow>
          <ElCol :span="8">
            <ElFormItem label="上游设施ID:" prop="upSqId" style="width: 100%">
              <ElInput
                v-model="submitForm.upSqId"
                placeholder=""
                clearable
                style="width: 250px"
                disabled
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem
              label="上游设施名称:"
              prop="upSqName"
              style="width: 100%"
            >
              <ElInput
                v-model="submitForm.upSqName"
                placeholder=""
                clearable
                style="width: 250px"
                disabled
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8" />
        </ElRow>
      </ElForm>
    </ElDialog>

    <ElDialog
      v-model="verifyDialog"
      title="数据校核"
      width="1000"
      class="system-detail-dialog"
    >
      <ElTable ref="tab" border stripe :data="verifyTable" height="460px">
        <ElTableColumn prop="id" align="center" label="差异清单ID" />
        <ElTableColumn prop="sqId" align="center" label="关联设施ID" />
        <ElTableColumn prop="issueType" align="center" label="问题类型" />
        <ElTableColumn prop="description" align="center" label="详细描述" />
      </ElTable>
    </ElDialog>
  </div>
</template>
<style lang="less" scoped>
:deep(.el-form-item__label) {
  width: 100px;
}
.my-empty-con {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  // background-color: #bebcbc;
  :deep(.el-empty) {
    height: 100%;
  }
  :deep(.el-empty__description) p {
    font-size: 20px;
    color: #666;
  }
}
// 弹窗
:deep(.el-dialog__title) {
  color: black;
  font-size: 20px;
  font-weight: 500;
}
</style>
