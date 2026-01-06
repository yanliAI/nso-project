<template>
  <div style="width: 100%; height: 100%;">
    <div style="height: calc(100% - 1px)">
      <el-form label-width="auto" ref="formRef" :model="formData" :rules="formRules" :inline="true"
        label-position="right" class="demo-form-inline">
        <el-row >
          <el-col :span="24">
            <el-form-item label="故障信息：" prop="faultInfo">
              <el-input v-model="formData.faultInfo" maxlength="300" show-word-limit clearable></el-input>
            </el-form-item>
            </el-col>
          <el-col :span="12">
            <el-form-item label="故障编号：">
              <el-input v-model="formData.faultCode" disabled clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="系统名称：">
              <el-select v-model="formData.faultSys"  clearable filterable >
                <el-option v-for="item in dropList.NSOS_SYSTEM_INFO" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="12">
            <el-form-item label="故障发生时间：">
              <el-date-picker v-model="formData.faultOccurTime" type="datetime" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="问题来源:" prop="problemSource">
              <el-select v-model="formData.problemSource" filterable>
                <el-option v-for="item in dropList.NSOS_PROBLEM_SOURCE" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="12">
            <el-form-item label="故障恢复时间：">
              <el-date-picker v-model="formData.faultRestoreTime" type="datetime" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" ></el-date-picker>
            </el-form-item>
            </el-col>
          <el-col :span="12">
            <el-form-item label="影响业务时长：">
                <el-input-number v-model="formData.effectBusiDuration" :min="0" :max="1000000000000000000000000"  />
              </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="12">
            <el-form-item label="故障原因分类：" filterable>
              <el-select v-model="formData.faultReasonType" clearable>
                <el-option v-for="item in dropList.NSOS_FAULT_REASON_TYPE" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            </el-col>
          <el-col :span="12">
            <el-form-item label="事件级别："  filterable>
               <el-select v-model="formData.eventLevel" clearable>
                 <el-option v-for="item in dropList.NSOS_EVENT_LEVEL" :key="item.value" :label="item.label" :value="item.value" />
               </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="24">
            <el-form-item label="作业导致故障描述:" >
              <el-input v-model="formData.faultDesc" type="textarea" :rows="2" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="12">
            <el-form-item label="直接原因：">
              <el-input v-model="formData.directReason" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="根本原因：">
              <el-input v-model="formData.radicallyReason" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="12">
            <el-form-item label="根本原因(大类)：" filterable>
              <el-select v-model="formData.radicallyReasonClass" clearable>
                <el-option v-for="item in dropList.NSOS_RADICALLY_REASON_CLASS" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            </el-col>
          <el-col :span="12">
            <el-form-item label="根本原因(小类)：" filterable>
               <el-select v-model="formData.radicallyReasonType" filterable clearable>
                 <el-option v-for="item in dropList.NSOS_RADICALLY_REASON_TYPE" :key="item.value" :label="item.label" :value="item.value" />
               </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="12">
          <el-form-item label="故障责任单位:" prop="faultDutyOrgName">
            <!-- <el-select v-model="formData.faultDutyOrg" filterable>
              <el-option v-for="item in dropList.NSOS_ORG_NAME" :key="item.value" :label="item.label" :value="item.value" />
            </el-select> -->
            <OrgTreeSelect v-model="formData.faultDutyOrg" @updateName="(v) => (formData.faultDutyOrgName = v)" filterable></OrgTreeSelect>

          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="故障跟进单位:" prop="faultFollowOrgName">
            <!-- <el-select v-model="formData.faultFollowOrg" filterable>
              <el-option v-for="item in dropList.NSOS_ORG_NAME" :key="item.value" :label="item.label" :value="item.value" />
            </el-select> -->
            <OrgTreeSelect v-model="formData.faultFollowOrg" @updateName="(v) => (formData.faultFollowOrgName = v)" filterable></OrgTreeSelect>
          </el-form-item>
        </el-col>
        </el-row>
        <el-row >
          <el-col :span="12">
            <el-form-item label="故障跟进人:" prop="faultFollowPeopleName">
              <!-- <el-select v-model="formData.faultFollowPeople" filterable>
                 <el-option v-for="item in dropList.NSOS_USER_NAME" :key="item.value" :label="item.label" :value="item.value" />
              </el-select> -->
              <el-input v-model="formData.faultFollowPeopleName" readonly>
              <template #append>
                <el-button :icon="Plus" @click="userAddClick('faultFollowPeople', 'faultFollowPeopleName')"/>
              </template>
            </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否涉及反措:" >
              <el-select v-model="formData.isInvolveReaverse" filterable>
                 <el-option v-for="item in dropList.NSOS_YES_OR_NO" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="12">
            <el-form-item label="反措是否完成:" >
              <el-select v-model="formData.isReaversed" filterable>
                <el-option v-for="item in dropList.NSOS_IS_REAVERSED" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="根本共性问题提炼：" >
              <el-select v-model="formData.similarityProblem" clearable filterable>
                <el-option v-for="item in dropList.NSOS_SIMILARITY_PROBLEM" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="12">
            <el-form-item label="是否涉及国产软硬件故障:" >
              <el-select v-model="formData.isDomesticFailure" filterable>
                 <el-option v-for="item in dropList.NSOS_YES_OR_NO" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="三运早例会是否复盘:" >
              <el-select v-model="formData.isReview" filterable>
                 <el-option v-for="item in dropList.NSOS_YES_OR_NO" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="12">
            <el-form-item label="事件级别（如涉及）:" >
              <el-select v-model="formData.isEventLevel" filterable>
                 <el-option v-for="item in dropList.NSOS_IS_EVENT_LEVEL" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="复盘时间:">
              <el-date-picker v-model="formData.reviewTime" type="datetime" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="12">
            <el-form-item label="整改完成情况:" prop="completionStatus">
              <el-input v-model="formData.completionStatus" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关联关键字:" prop="keyword">
              <el-input v-model="formData.keyword" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="24">
            <el-form-item label="故障处置过程:" prop="disposeRecord">
              <el-input v-model="formData.disposeRecord" maxlength="300" show-word-limit clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="24">
            <el-form-item label="关联故障范围:" prop="faultScopeAssociation">
              <el-input v-model="formData.faultScopeAssociation" maxlength="300" show-word-limit clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="24">
            <el-form-item label="影响范围及程度:" prop="effectRange">
              <el-input v-model="formData.effectRange" maxlength="300" show-word-limit clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="12">
            <el-form-item label="是否上报数字化部:" >
              <el-select v-model="formData.isReport" filterable>
                 <el-option v-for="item in dropList.NSOS_YES_OR_NO" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分类:" >
              <el-select v-model="formData.faultType" filterable>
                 <el-option v-for="item in dropList.NSOS_FAULT_TYPE" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="12">
            <el-form-item label="故障所属子系统:" >
              <el-select v-model="formData.faultBelongSubsys" filterable>
                 <el-option v-for="item in dropList.NSOS_SYSTEM_INFO" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="故障系统/设备级别:" >
              <el-select v-model="formData.sysLevel" filterable>
                 <el-option v-for="item in dropList.NSOS_SYS_LEVEL" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="12">
            <el-form-item label="运维模式:" >
              <el-select v-model="formData.operateSchema" filterable>
                 <el-option v-for="item in dropList.NSOS_OPERATE_SCHEMA" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备主人:" >
              <el-input v-model="formData.deviceOwner" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="12">
            <el-form-item label="是否影响业务:" >
              <el-select v-model="formData.isAffectBusi" filterable>
                 <el-option v-for="item in dropList.NSOS_YES_OR_NO" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="故障发现时间:" >
              <el-date-picker v-model="formData.faultFindTime" type="datetime" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="12">
            <el-form-item label="故障响应时间:" >
              <el-date-picker v-model="formData.faultResponseTime" type="datetime" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="故障定位时间:" >
              <el-date-picker v-model="formData.faultLocateTime" type="datetime" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="12">
            <el-form-item label="故障处置时间:" >
              <el-date-picker v-model="formData.faultDisposeTime" type="datetime" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="故障简报提交时间:" >
              <el-date-picker v-model="formData.faultBriefingSubmitTime" type="datetime" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="12">
            <el-form-item label="是否产出告警:" >
              <el-select v-model="formData.hasAlarm" filterable>
                 <el-option v-for="item in dropList.NSOS_YES_OR_NO" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="故障持续时长:" >
              <el-input-number v-model="formData.faultDuration" :min="1" :max="100000" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="12">
            <el-form-item label="是否典型故障:" >
              <el-select v-model="formData.isTipical" filterable>
                 <el-option v-for="item in dropList.NSOS_YES_OR_NO" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="故障分析报告提交时间:" >
              <el-date-picker v-model="formData.reportCommitTime" type="datetime" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="12">
            <el-form-item label="技术组跟进人:" prop="tecFollowPeopleName">
              <!-- <el-select v-model="formData.tecFollowPeople" filterable>
                 <el-option v-for="item in dropList.NSOS_USER_NAME" :key="item.value" :label="item.label" :value="item.value" />
              </el-select> -->
              <el-input v-model="formData.tecFollowPeopleName" readonly>
                <template #append>
                  <el-button :icon="Plus" @click="userAddClick('tecFollowPeople', 'tecFollowPeopleName')"/>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关联影响系统时长:" >
              <el-input-number v-model="formData.associactionSysDuration" :min="1" :max="100000" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="12">
            <el-form-item label="作业导致故障责任单位部门:" prop="taskFaultOrgName">
              <!-- <el-select v-model="formData.taskFaultOrg" filterable>
                 <el-option v-for="item in dropList.NSOS_ORG_NAME" :key="item.value" :label="item.label" :value="item.value" />
              </el-select> -->
              <OrgTreeSelect v-model="formData.taskFaultOrg" @updateName="(v) => (formData.taskFaultOrgName = v)" filterable></OrgTreeSelect>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否闭环:" >
              <el-select v-model="formData.isRing" filterable>
                 <el-option v-for="item in dropList.NSOS_YES_OR_NO" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="12">
            <el-form-item label="是否移交安监:" >
              <el-select v-model="formData.isHandover" filterable>
                 <el-option v-for="item in dropList.NSOS_YES_OR_NO" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style=" justify-content: center;height: 35px" class="flex mt-[15px]">
        <el-button type="primary" @click="handleSubmit">保存</el-button>
        <el-button @click="attachClose">取消</el-button>
      </div>
    </div>

    <!-- <Modal class="w-[700px] " title="附件编辑" :footer="false" :closeOnClickModal="false" :draggable="true">
      <AttachFile :parentId="formData.id" @afterUpload="attachFileRef.queryData()" close="addClose"></AttachFile>
    </Modal> -->
    <ModalB class="w-[1200px] h-[650px]" title="人员选择" :footer="false" :closeOnClickModal="false" :draggable="true">
      <UserSelect @selectOk="userSelectOk"></UserSelect>
    </ModalB>
  </div>
</template>
<script setup>
import { onMounted, reactive,ref } from 'vue';
import { useDropStore } from '#/store';
import { requestClient } from '#/api/request';
import { ElMessage, ElNotification } from 'element-plus';
import AttachFile from '../../basic/attach/attachFile.vue'
import AttachList from '../../basic/attach/attachList.vue'
import { Search, Delete, Plus, Download, Upload } from '@element-plus/icons-vue';
import { useVbenModal } from '@vben/common-ui';
import { tDateFormat, formatDateTime, tDateTimeFormat, formatDrop, lookFlow } from '#/utils/commonUtil.ts';
import OrgTreeSelect from '#/views/basic/common/orgTreeSelect.vue'
import UserSelect from '#/views/basic/common/userSelect.vue'

const formData = defineModel('formData');
const emit = defineEmits(['closeDiaLog','query'])
const dropList = reactive({});

const formRef = ref(null)
const attachFileRef = ref()
const data = reactive({
  curProp: null,
})
// 验证规则
const formRules = reactive({
  commandFl2: [
    { required: true, message: '类型不能为空', trigger: 'blur' },
  ],
  templateName: [
    { required: true, message: '模板名称不能为空', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  cmdContent: [
    { required: true, message: '指令内容不能为空', trigger: 'blur' },
    { min: 1, message: '至少需要1个字符', trigger: 'blur' }
  ],
  finishLimit: [
    { pattern: /^\d+$/, message: '只能输入数字', trigger: 'blur' }
  ]
})

const [ModalB, modalApiB] = useVbenModal({
  onCancel() {
    modalApiB.close()
  }
})

const userSelectOk = (user) => {
  formData.value[data.curUserNameProp] = user.employeeName
  formData.value[data.curUserProp] = user.employeeAccount
  modalApiB.close()
}
const userAddClick = (codeProp, nameProp) => {
  data.curUserProp = codeProp
  data.curUserNameProp = nameProp
  modalApiB.open()
}

// 输入过滤：实时限制只能输入数字
const handleNumberInput = (value) => {
  formData.finishLimit = value.replace(/[^\d]/g, '');
};

onMounted(async () => {
  const dropStore = useDropStore();
  const dropType = ['NSOS_SYS_LEVEL','NSOS_OPERATE_SCHEMA','NSOS_FAULT_TYPE','NSOS_IS_EVENT_LEVEL','NSOS_SYSTEM_INFO','NSOS_FAULT_REASON_TYPE','NSOS_EVENT_LEVEL','NSOS_RADICALLY_REASON_CLASS','NSOS_RADICALLY_REASON_TYPE','NSOS_SIMILARITY_PROBLEM','NSOS_ORG_NAME','NSOS_USER_NAME','NSOS_YES_OR_NO','NSOS_IS_REAVERSED','NSOS_PROBLEM_SOURCE']
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);
  formData.value.faultOccurTime = formatDateTime(formData.value.faultOccurTime)
  formData.value.faultRestoreTime = formatDateTime(formData.value.faultRestoreTime)
  formData.value.reviewTime = formatDateTime(formData.value.reviewTime)

  formData.value.faultFindTime = formatDateTime(formData.value.faultFindTime)
  formData.value.faultLocateTime = formatDateTime(formData.value.faultLocateTime)
  formData.value.faultResponseTime = formatDateTime(formData.value.faultResponseTime)
  formData.value.faultDisposeTime = formatDateTime(formData.value.faultDisposeTime)
  formData.value.faultBriefingSubmitTime = formatDateTime(formData.value.faultBriefingSubmitTime)
  formData.value.reportCommitTime = formatDateTime(formData.value.reportCommitTime)

});

const attachClick = () => {
  modalApi.open()
}

const attachClose =() => {
  emit('closeDiaLog');
}

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
});

const handleSubmit = async () => {
  try {
    // 执行表单验证
    await formRef.value.validate()

    // 验证通过后提交逻辑
    save();
  } catch (error) {
    ElMessage.error('请检查表单填写是否正确')
  }
}

const save = async () => {
  try{
    const response = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/typicalFault/add2', formData.value);
    ElNotification({
      title: '提示',
      message: '保存成功！',
      type: 'success'
    })
  }catch {
    ElMessage.error('保存失败')
  }finally{
    emit('closeDiaLog');
    emit('query');
  }

}
</script>
<style scoped>
.head-d{
  width: 100%;
  height: 55px;
  border-bottom: 1px solid #ebebeb;
}
</style>
