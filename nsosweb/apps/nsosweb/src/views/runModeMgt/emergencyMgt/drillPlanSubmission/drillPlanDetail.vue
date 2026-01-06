<template>
  <el-form
    ref="addForm"
    label-width="auto"
    :model="addFormData"
    :rules="addFormRules"
    label-position="right"
    style="padding: 16px 20px 0"
  >
    <el-row v-if="planId" :gutter="50">
      <el-col :span="8">
        <el-form-item label="演练名称：" prop="drillName">
          <el-input
            v-model="addFormData.drillName"
            placeholder="请输入演练名称"
            disabled
          />
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="应急演练时间：" prop="drillTime">
          <el-date-picker
            v-model="addFormData.drillTime"
            type="date"
            placeholder="请选择"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 100%"
            disabled
          />
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="负责人：" prop="leader">
          <el-select
            v-model="addFormData.leader"
            placeholder="请选择"
            filterable
            disabled
          >
            <el-option
              v-for="item in leaderList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="附件：">
      <div v-for="item in addFormData.files" :key="item.id" style="width: 100%">
        <el-button type="primary" link>{{ item.name }}</el-button>
      </div>
    </el-form-item>

    <el-form-item label="演练计划：">
      <el-table
        ref="sceneTableRef"
        border
        stripe
        :data="tableData"
        style="width: 100%"
        max-height="400"
      >
        <el-table-column type="index" align="center" label="序号" width="80" />
        <el-table-column prop="drillScene" label="演练场景" align="center">
          <template #default="{ row }">
            <el-input v-model="row.drillScene" placeholder="请输入" />
          </template>
        </el-table-column>
        <el-table-column prop="leader" label="负责人" align="center">
          <template #default="{ row }">
            <el-select v-model="row.leader" placeholder="请选择" filterable>
              <el-option
                v-for="item in leaderList"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="planDrillTime" label="计划时间" align="center">
          <template #default="{ row }">
            <el-date-picker
              v-model="row.planDrillTime"
              type="date"
              placeholder="请选择"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>

    <el-form-item>
      <el-col :span="24" style="text-align: center; margin-top: 50px">
        <el-button type="info" :icon="Close" @click="closeTab">关闭</el-button>
      </el-col>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import {
  ElFormItem,
  ElForm,
  ElTable,
  ElTableColumn,
  ElInput,
  ElButton,
  ElSelect,
  ElOption,
  ElRow,
  ElCol,
  ElDialog,
  ElMessage,
  ElMessageBox,
} from 'element-plus';
import {
  Plus,
  Monitor,
  DocumentChecked,
  Close,
  RefreshLeft,
} from '@element-plus/icons-vue';

import { ref, reactive, computed, onMounted, nextTick } from 'vue';
import { requestClient } from '#/api/request';

defineOptions({
  name: 'DrillPlanDetail',
});

const tabName = defineModel('tabName');
const planId = defineModel('planId');
console.log('planId==', planId.value, 'tabName==', tabName.value);
const emit = defineEmits(['removeTab']);

const addForm = ref();
// 新增表单数据
const addFormData = reactive({
  drillName: '',
  sysName: '',
  emergencyPlan: '',
  drillTime: '',
  leader: '',
  files: [
    {
      name: '附件一.png',
      id: '111',
    },
    {
      name: '附件二.docx',
      id: '222',
    },
  ],
});

const addFormRules = reactive({
  drillName: [{ required: true, message: '请输入演练名称' }],
  sysName: [{ required: true, message: '请选择演练系统' }],
  leader: [{ required: true, message: '请选择负责人' }],
  drillTime: [{ required: true, message: '请选择应急演练时间' }],
});
const sceneTableRef = ref();
let tableData = ref([]);

// 存储所有系统的列表
const systemList = ref([
  {
    name: '电网管理平台一',
    id: 1,
    value: '1',
  },
  {
    name: '电网管理平台二',
    id: 2,
    value: '2',
  },
  {
    name: '电网管理平台三',
    id: 3,
    value: '3',
  },
]);
// 存储应急预案列表
const emergencyPlanList = ref([
  {
    name: '专项',
    id: 1,
    value: '1',
  },
  {
    name: '综合',
    id: 2,
    value: '2',
  },
  {
    name: '应急',
    id: 3,
    value: '3',
  },
]);

const leaderList = reactive([
  { name: '张三', value: '张三' },
  { name: '张三', value: '张三' },
  { name: '张三', value: '张三' },
]);

// 关闭标签页
const closeTab = () => {
  emit('removeTab', tabName.value);
};

onMounted(() => {});
</script>

<style lang="less" scoped></style>
