<template>
  <el-form
    :inline="true"
    :model="formData"
    :rules="rules"
    label-position="right"
    label-width="auto"
    style="padding: 0px 20px 0"
    disabled
  >
    <el-row :gutter="80">
      <el-col :span="16">
        <el-form-item label="作业计划标题：" prop="planTitle">
          <el-input
            v-model="formData.planTitle"
            clearable
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="计划来源：" prop="planFrom">
          <el-input v-model="formData.planFrom" clearable style="width: 100%" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="80">
      <el-col :span="16">
        <el-form-item label="工作地点：" prop="workLocation">
          <el-input
            v-model="formData.workLocation"
            clearable
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="是否发布作业：" prop="isRelease">
          <el-select v-model="formData.isRelease" clearable style="width: 100%">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="80">
      <el-col :span="8">
        <el-form-item label="作业计划类型：" prop="workType">
          <el-select v-model="formData.workType" clearable style="width: 100%">
            <el-option label="紧急作业" value="1"></el-option>
            <el-option label="临时作业" value="2"></el-option>
            <el-option label="计划作业" value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="是否重保：" prop="isGuarantee">
          <el-select
            v-model="formData.isGuarantee"
            clearable
            style="width: 100%"
          >
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="重保名称：" prop="guaranteeName">
          <el-input
            v-model="formData.guaranteeName"
            clearable
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="80">
      <el-col :span="8">
        <el-form-item label="系涉及网省协同：" prop="isProvinceCollaboration">
          <el-select
            v-model="formData.isProvinceCollaboration"
            clearable
            style="width: 100%"
          >
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="作业环境：" prop="workEnvironment">
          <el-select
            v-model="formData.workEnvironment"
            clearable
            style="width: 100%"
          >
            <el-option label="生产环境" value="1"></el-option>
            <el-option label="仿真环境" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <!-- <el-col :span="8">
        <el-form-item label="关联工单：" prop="planCode">
          <el-input v-model="formData.planCode" clearable style="width: 100%" />
        </el-form-item>
      </el-col> -->
    </el-row>

    <el-form-item label="运行方式变更情况：" prop="changesOperat">
      <el-input
        v-model="formData.changesOperat"
        clearable
        style="width: 100%"
      />
    </el-form-item>
    <el-form-item label="作业内容：" prop="workTasks">
      <el-input v-model="formData.workTasks" clearable style="width: 100%" />
    </el-form-item>
    <el-form-item label="工作要求的安全措施：" prop="safetyMeasure">
      <el-input
        v-model="formData.safetyMeasure"
        clearable
        style="width: 100%"
      />
    </el-form-item>

    <el-row :gutter="80">
      <el-col :span="8">
        <el-form-item label="工作负责人：" prop="workLeader">
          <div
            v-for="(item, index) in formData.workLeader"
            :Key="index"
            :style="`color: ${item.color}; background-color: ${item.backColor};
                  border: 1px solid ${item.borderColor}; border-radius: 5px; padding: 0px 8px`"
          >
            {{ item.name }}
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="专责监护人：" prop="responsibleGuardian">
          <div
            v-for="(item, index) in formData.responsibleGuardian"
            :Key="index"
            :style="`color: ${item.color}; background-color: ${item.backColor};
                  border: 1px solid ${item.borderColor}; border-radius: 5px; padding: 0px 8px`"
          >
            {{ item.name }}
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="工作班员：" prop="workClass">
          <div
            v-for="(item, index) in formData.workClass"
            :Key="index"
            :style="`color: ${item.color}; background-color: ${item.backColor};
                  border: 1px solid ${item.borderColor}; border-radius: 5px; margin-right: 8px; padding: 0px 8px`"
          >
            {{ item.name }}
          </div>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="堡垒机账号：" prop="fortressAccount">
      <el-input
        v-model="formData.fortressAccount"
        clearable
        style="width: 100%"
      />
    </el-form-item>

    <el-row :gutter="80">
      <el-col :span="8">
        <el-form-item label="作业人数：" prop="workNum">
          <el-input v-model="formData.workNum" clearable style="width: 100%" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="预授权作业：" prop="isAuthorize">
          <el-select
            v-model="formData.isAuthorize"
            clearable
            style="width: 100%"
          >
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="作业对象类型：" prop="wordObject">
          <div
            v-for="(item, index) in formData.wordObject"
            :Key="index"
            :style="`color: ${item.color}; background-color: ${item.backColor};
                  border: 1px solid ${item.borderColor}; border-radius: 5px; margin-right: 8px; padding: 0px 8px`"
          >
            {{ item.name }}
          </div>
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="堡垒机敏感命令：" prop="sensitiveCommands">
      <el-input
        v-model="formData.sensitiveCommands"
        clearable
        style="width: 100%"
      />
    </el-form-item>

    <el-form-item label="作业单位：" prop="taskDept">
      <el-input v-model="formData.taskDept" clearable style="width: 100%" />
    </el-form-item>

    <el-form-item label="业务部门：" prop="departName">
      <el-input v-model="formData.departName" clearable style="width: 100%" />
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import {
  ElRow,
  ElCol,
  ElFormItem,
  ElForm,
  ElInput,
  ElSelect,
  ElOption,
  ElDialog,
  ElMessage,
  ElMessageBox,
  ElText,
  ElLink,
  ElTag,
} from 'element-plus';
import {
  Search,
  Download,
  Monitor,
  CircleCheck,
} from '@element-plus/icons-vue';
import { ref, reactive, computed, onMounted } from 'vue';

defineOptions({
  name: 'IntelligentAllocationBaseInfo',
});

const formData = defineModel('detailData');
if (formData.value) {
  formData.value.workLeader = formData.value.workLeader
    ?.split(',')
    .map((item) => ({
      name: item,
      color: '#1890FF',
      backColor: '#e6f7ff',
      borderColor: '#91d5ff',
    }));

  formData.value.responsibleGuardian = formData.value.responsibleGuardian
    ?.split(',')
    .map((item) => ({
      name: item,
      color: '#1890FF',
      backColor: '#e6f7ff',
      borderColor: '#91d5ff',
    }));
  formData.value.workClass = formData.value.workClass
    ?.split(',')
    .map((item) => ({
      name: item,
      color: '#1890FF',
      backColor: '#e6f7ff',
      borderColor: '#91d5ff',
    }));

  formData.value.wordObject = formData.value.wordObject
    ?.split(',')
    .map((item) => ({
      name: item,
      color: '#1890FF',
      backColor: '#e6f7ff',
      borderColor: '#91d5ff',
    }));
}


const rules = reactive({
  planTitle: [{ required: true, message: '请输入作业计划标题' }],
  planFrom: [{ required: true, message: '请输入计划来源' }],
  workLocation: [{ required: true, message: '请输入工作地点' }],
  workType: [{ required: true, message: '请选择作业计划类型' }],
  isGuarantee: [{ required: true, message: '请选择是否重保' }],
  workEnvironment: [{ required: true, message: '请选择作业环境' }],
  taskDept: [{ required: true, message: '请输入作业单位' }],
  departName: [{ required: true, message: '请输入业务部门' }],
});

onMounted(() => {});
</script>

<style scoped>
::v-deep .el-form-item {
  width: 100%;
}
</style>
