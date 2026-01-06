<template>
  <el-form
    ref="addForm"
    label-width="auto"
    :model="addFormData"
    :rules="addFormRules"
    label-position="right"
    style="padding: 16px 20px 0"
  >
    <el-row v-if="!planId" :gutter="50">
      <el-col :span="8">
        <el-form-item label="演练名称：" prop="drillName">
          <el-input
            v-model="addFormData.drillName"
            placeholder="请输入演练名称"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="关联应急预案：" prop="emergencyPlan">
          <el-select
            v-model="addFormData.emergencyPlan"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option
              v-for="(item, index) in emergencyPlanList"
              :key="index"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
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
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="!planId" :gutter="50">
      <el-col :span="8">
        <el-form-item label="系统名称：" prop="sysName">
          <el-select
            v-model="addFormData.sysName"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option
              v-for="(item, index) in systemList"
              :key="index"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="负责人：" prop="leader">
          <el-select
            v-model="addFormData.leader"
            placeholder="请选择"
            filterable
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
    <!-- 编辑时的表单信息 -->
    <el-row v-if="planId" :gutter="50">
      <el-col :span="8">
        <el-form-item label="演练名称：" prop="drillName">
          <el-input
            v-model="addFormData.drillName"
            placeholder="请输入演练名称"
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
      <el-upload
        ref="uploadRef"
        v-model:file-list="files"
        action="#"
        :auto-upload="false"
        :on-change="handleFileChange"
        :on-remove="handleRemove"
        :before-upload="beforeUpload"
        :http-request="uploadFile"
        style="width: 50%"
      >
        <template #trigger>
          <el-button type="primary" link>
            <el-icon>
              <Plus /> </el-icon
            >附件
          </el-button>
        </template>
      </el-upload>
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

        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button type="danger" link @click="deleteScene(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>

    <el-form-item label=" ">
      <el-button type="success" :icon="Plus" @click="addScene"
        >添加演练场景</el-button
      >
    </el-form-item>

    <el-form-item>
      <el-col :span="24" style="text-align: center; margin-top: 50px">
        <el-button type="primary" :icon="Monitor">发布</el-button>
        <el-button type="primary" :icon="DocumentChecked" @click="saveDate"
          >保存</el-button
        >
        <el-button type="info" :icon="RefreshLeft" @click="resetForm"
          >重置</el-button
        >
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
import type {
  UploadInstance,
  UploadProps,
  UploadRawFile,
  UploadUserFile,
} from 'element-plus';

import { ref, reactive, computed, onMounted, nextTick } from 'vue';
import { requestClient } from '#/api/request';

defineOptions({
  name: 'AddPlanSubmission',
});

const tabName = defineModel('tabName');
const planId = defineModel('planId');
console.log('planId==', planId.value, 'tabName==', tabName.value);
const emit = defineEmits(['removeTab']);

const addForm = ref();
const uploadRef = ref<UploadInstance>();
// 附件列表
const files = ref<UploadUserFile[]>([]);
// 新增表单数据
const addFormData = reactive({
  drillName: '',
  sysName: '',
  emergencyPlan: '',
  drillTime: '',
  leader: '',
});

const addFormRules = reactive({
  drillName: [{ required: true, message: '请输入演练名称' }],
  sysName: [{ required: true, message: '请选择演练系统' }],
  leader: [{ required: true, message: '请选择负责人' }],
  drillTime: [{ required: true, message: '请选择应急演练时间' }],
});
const sceneTableRef = ref();
// 默认对象
const defaultSceneBean = {
  id: '',
  drillScene: '',
  leader: '',
  planDrillTime: '',
};
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

// 重置表单
const resetForm = () => {
  addForm.value?.resetFields();
};

const saveDate = async () => {
  await addForm.value?.validate((valid, fields) => {
    if (valid) {
      console.log('submit!');
    } else {
      ElMessage.warning('请输入必填项！');
    }
  });
};

/**
 * 添加演练场景
 */
const addScene = () => {
  // 创建一个默认步骤对象的副本
  const newScene = { ...defaultSceneBean };
  newScene.id = new Date().getTime() + '';
  tableData.value.push(newScene);

  // 等待 DOM 更新后滚动到底部
  nextTick(() => {
    const tableEl = sceneTableRef.value.$el; // 获取表格的根 DOM 元素
    const tableBodyWrapper = tableEl.querySelector('.el-scrollbar__wrap'); // 获取表格内容区域的 DOM 元素
    if (tableBodyWrapper) {
      tableBodyWrapper.scrollTop = tableBodyWrapper.scrollHeight; // 滚动到底部
    }
  });
};

/**
 * 删除场景
 */
const deleteScene = (row) => {
  tableData.value = tableData.value.filter((item) => item.id !== row.id);
};

const handleFileChange = (uploadFile, uploadFiles) => {
  console.log('uploadFile==', uploadFile);
  console.log('uploadFiles==', uploadFiles);
  files.value = uploadFiles;
  console.log('files==', files.value.length);
};

// 文件上传之前判断
const beforeUpload: UploadProps['beforeUpload'] = (file: UploadRawFile) => {
  console.log('beforeUpload file=', file);
  const isLimit = file.size < 10 * 1024 * 1024;
  if (!isLimit) {
    ElMessage.error(`上传文件大小不能超过10MB!`);
    return false;
  }
};

// 删除上传文件
const handleRemove = (file) => {
  console.log('onRemoveFil==', file);
  const index = files.value.map((f) => f.name).indexOf(file.name);
  if (index > -1) {
    files.value.splice(index, 1);
  }
  console.log('files==', files.value);
};

// 上传文件
const uploadFile = async (options) => {};

// 关闭标签页
const closeTab = () => {
  ElMessageBox.confirm('确认关闭新增任务页吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    emit('removeTab', tabName.value);
  });
};

onMounted(() => {
  // 新增时，初始化一条数据
  if (!planId.value) {
    addScene();
  }
});
</script>

<style lang="less" scoped></style>
