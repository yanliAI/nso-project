<template>
  <el-form
    :inline="true"
    :model="formData"
    :rules="rules"
    label-position="right"
    label-width="auto"
    style="padding: 0px 20px 0"
  >
    <el-row :gutter="80">
      <el-col :span="16">
        <el-form-item label="作业计划标题：" prop="jobTitle">
          <el-input
            v-model="formData.jobTitle"
            clearable
            disabled
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="计划来源：" prop="planSource">
          <el-input
            v-model="formData.jobTitle"
            clearable
            disabled
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="80">
      <el-col :span="16">
        <el-form-item label="工作地点：" prop="workPlace">
          <el-input
            v-model="formData.workPlace"
            clearable
            disabled
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="是否发布作业：" prop="isPublishJob">
          <el-select
            v-model="formData.isPublishJob"
            clearable
            disabled
            style="width: 100%"
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="80">
      <el-col :span="8">
        <el-form-item label="作业计划类型：" prop="jobType">
          <el-select
            v-model="formData.jobType"
            clearable
            disabled
            style="width: 100%"
          >
            <el-option label="计划作业" :value="1"></el-option>
            <el-option label="临时作业计划" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="是否重保：" prop="isZB">
          <el-select
            v-model="formData.isZB"
            clearable
            disabled
            style="width: 100%"
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="重保名称：" prop="ZBName">
          <el-input
            v-model="formData.ZBName"
            clearable
            disabled
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="80">
      <el-col :span="8">
        <el-form-item label="系涉及网省协同：" prop="isWSXT">
          <el-select
            v-model="formData.isWSXT"
            clearable
            disabled
            style="width: 100%"
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="作业环境：" prop="jobEnv">
          <el-select
            v-model="formData.jobEnv"
            clearable
            disabled
            style="width: 100%"
          >
            <el-option label="生产环境" :value="1"></el-option>
            <el-option label="仿真环境" :value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="关联工单：" prop="linkOrder">
          <el-input
            v-model="formData.linkOrder"
            clearable
            disabled
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="运行方式变更情况：" prop="YXFSBGQK">
      <el-input
        v-model="formData.YXFSBGQK"
        clearable
        disabled
        style="width: 100%"
      />
    </el-form-item>
    <el-form-item label="作业内容：" prop="jobContent">
      <el-input
        v-model="formData.jobContent"
        clearable
        disabled
        style="width: 100%"
      />
    </el-form-item>
    <el-form-item label="工作要求的安全措施：" prop="safetyMeasure">
      <el-input
        v-model="formData.safetyMeasure"
        clearable
        disabled
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
        <el-form-item label="专责监护人：" prop="soleGuardian">
          <div
            v-for="(item, index) in formData.soleGuardian"
            :Key="index"
            :style="`color: ${item.color}; background-color: ${item.backColor};
                  border: 1px solid ${item.borderColor}; border-radius: 5px; padding: 0px 8px`"
          >
            {{ item.name }}
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="工作班员：" prop="shiftMan">
          <div
            v-for="(item, index) in formData.shiftMan"
            :Key="index"
            :style="`color: ${item.color}; background-color: ${item.backColor};
                  border: 1px solid ${item.borderColor}; border-radius: 5px; margin-right: 8px; padding: 0px 8px`"
          >
            {{ item.name }}
          </div>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="堡垒机账号：" prop="fortressMachineAccount">
      <el-input
        v-model="formData.fortressMachineAccount"
        clearable
        disabled
        style="width: 100%"
      />
    </el-form-item>

    <el-row :gutter="80">
      <el-col :span="8">
        <el-form-item label="作业人数：" prop="workersNumber">
          <el-input
            v-model="formData.workersNumber"
            clearable
            disabled
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="预授权作业：" prop="PreAuthorizedOperation">
          <el-select
            v-model="formData.PreAuthorizedOperation"
            clearable
            disabled
            style="width: 100%"
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="作业对象类型：" prop="jobObjectType">
          <div
            v-for="(item, index) in formData.jobObjectType"
            :Key="index"
            :style="`color: ${item.color}; background-color: ${item.backColor};
                  border: 1px solid ${item.borderColor}; border-radius: 5px; margin-right: 8px; padding: 0px 8px`"
          >
            {{ item.name }}
          </div>
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item
      label="堡垒机敏感命令："
      prop="fortressMachineSensitiveCommand"
    >
      <el-input
        v-model="formData.fortressMachineSensitiveCommand"
        clearable
        disabled
        style="width: 100%"
      />
    </el-form-item>

    <el-form-item label="作业单位：" prop="OperatingUnit">
      <el-input
        v-model="formData.OperatingUnit"
        clearable
        disabled
        style="width: 100%"
      />
    </el-form-item>

    <el-form-item label="业务部门：" prop="businessUnit">
      <el-input
        v-model="formData.businessUnit"
        clearable
        disabled
        style="width: 100%"
      />
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
import { requestClient } from '#/api/request';

defineOptions({
  name: 'BalanceMgtBaseInfo',
});

interface Props {
  jobTitle?: string;
  planSource?: string;
  workPlace?: string;
  isPublishJob?: number;
  jobType?: number;
  isZB?: number;
  ZBName?: string;
  isWSXT?: number;
  jobEnv?: number;
  linkOrder?: string;
  YXFSBGQK?: string;
  jobContent?: string;
  safetyMeasure?: string;
  workLeader?: Array<any>;
  soleGuardian?: Array<any>;
  shiftMan?: Array<any>;
  fortressMachineAccount?: string;
  workersNumber?: string;
  PreAuthorizedOperation?: number;
  jobObjectType?: Array<any>;
  fortressMachineSensitiveCommand?: string;
  OperatingUnit?: string;
  businessUnit?: string;
}
const formData = withDefaults(defineProps<Props>(), {
  jobTitle: '电子商城紧急整改漏洞',
  planSource: '系统缺陷',
  workPlace: '云升科学园B2-1601',
  isPublishJob: 0,
  jobType: 1,
  isZB: 0,
  ZBName: '非重保时段',
  isWSXT: 0,
  jobEnv: 1,
  linkOrder: '未关联',
  YXFSBGQK: '运行方式无变更',
  jobContent: '电子商城漏洞越权',
  safetyMeasure: '电子商城漏洞越权',
  workLeader: [
    {
      name: '张三',
      color: '#1890FF',
      backColor: '#e6f7ff',
      borderColor: '#91d5ff',
    },
  ],
  soleGuardian: [
    {
      name: '李四',
      color: '#1890FF',
      backColor: '#e6f7ff',
      borderColor: '#91d5ff',
    },
  ],
  shiftMan: [
    {
      name: '赵六',
      color: '#1890FF',
      backColor: '#e6f7ff',
      borderColor: '#91d5ff',
    },
    {
      name: '李思',
      color: '#1890FF',
      backColor: '#e6f7ff',
      borderColor: '#91d5ff',
    },
  ],
  fortressMachineAccount: 'jianrui@csg.cn,vrx_zhangsy@csg.cn.liyn4@csg.cn',
  workersNumber: '3人',
  PreAuthorizedOperation: 0,
  jobObjectType: [
    {
      name: '主机',
      color: '#1890FF',
      backColor: '#e6f7ff',
      borderColor: '#91d5ff',
    },
    {
      name: '应用系统',
      color: '#1890FF',
      backColor: '#e6f7ff',
      borderColor: '#91d5ff',
    },
  ],
  fortressMachineSensitiveCommand: '无',
  OperatingUnit: '南方电网产业投资集团有限责任公司\南方电网互联网服务公司',
  businessUnit: '南方电网产业投资集团有限责任公司\南方电网互联网服务公司',
});
// const formData = reactive({
//   jobTitle: '电子商城紧急整改漏洞',
//   planSource: '系统缺陷',
//   workPlace: '云升科学园B2-1601',
//   isPublishJob: '0',
//   jobType: '1',
//   isZB: '0',
//   ZBName: '非重保时段',
//   isWSXT: '0',
//   jobEnv: '1',
//   linkOrder: '未关联',
//   YXFSBGQK: '运行方式无变更',
//   jobContent: '电子商城漏洞越权',
//   safetyMeasure: '电子商城漏洞越权',
//   workLeader: [
//     {
//       name: '张三',
//       color: '#1890FF',
//       backColor: '#e6f7ff',
//       borderColor: '#91d5ff',
//     },
//   ],
//   soleGuardian: [
//     {
//       name: '李四',
//       color: '#1890FF',
//       backColor: '#e6f7ff',
//       borderColor: '#91d5ff',
//     },
//   ],
//   shiftMan: [
//     {
//       name: '赵六',
//       color: '#1890FF',
//       backColor: '#e6f7ff',
//       borderColor: '#91d5ff',
//     },
//     {
//       name: '李思',
//       color: '#1890FF',
//       backColor: '#e6f7ff',
//       borderColor: '#91d5ff',
//     },
//   ],
//   fortressMachineAccount: 'jianrui@csg.cn,vrx_zhangsy@csg.cn.liyn4@csg.cn',
//   workersNumber: '3人',
//   PreAuthorizedOperation: '0',
//   jobObjectType: [
//     {
//       name: '主机',
//       color: '#1890FF',
//       backColor: '#e6f7ff',
//       borderColor: '#91d5ff',
//     },
//     {
//       name: '应用系统',
//       color: '#1890FF',
//       backColor: '#e6f7ff',
//       borderColor: '#91d5ff',
//     },
//   ],
//   fortressMachineSensitiveCommand: '无',
//   OperatingUnit: '南方电网产业投资集团有限责任公司\南方电网互联网服务公司',
//   businessUnit: '南方电网产业投资集团有限责任公司\南方电网互联网服务公司',
// });

const rules = reactive({
  jobTitle: [{ required: true, message: '请输入作业计划标题' }],
  planSource: [{ required: true, message: '请输入计划来源' }],
  workPlace: [{ required: true, message: '请输入工作地点' }],
  jobType: [{ required: true, message: '请选择作业计划类型' }],
  isZB: [{ required: true, message: '请选择是否重保' }],
  jobEnv: [{ required: true, message: '请选择作业环境' }],
  OperatingUnit: [{ required: true, message: '请输入作业单位' }],
  businessUnit: [{ required: true, message: '请输入业务部门' }],
});

onMounted(() => {});
</script>

<style scoped>
::v-deep .el-form-item {
  width: 100%;
}
</style>
