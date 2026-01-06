<template>
  <div class="w-full h-full pt-2">
    <el-form label-width="110px" ref="ruleFormRef" :model="formData" :disabled="disabled" :inline="true" label-position="right" class="demo-form-inline">
      <el-row>
        <el-col :span="24">
          <el-form-item label="故障关键字:" prop="keyword">
            <fault-keyword-select v-model:value="formData.keyword" :key="keywordSelectCompKey" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="是否典型故障:" prop="isTipical" clearable>
            <el-select v-model="formData.isTipical" filterable>
              <el-option v-for="item in dropList.NSOS_YES_OR_NO" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="故障分析报告提交时间:" prop="reportCommitTime">
            <el-date-picker v-model="formData.reportCommitTime" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="技术组跟进人:" prop="tecFollowPeopleName">
            <!-- <el-select v-model="formData.tecFollowPeople" filterable clearable>
              <el-option v-for="item in dropList.NSOS_USER_NAME" :key="item.value" :label="item.label" :value="item.value" />
            </el-select> -->
            <el-input v-model="formData.tecFollowPeopleName" readonly>
              <template #append>
                <el-button :icon="Plus" @click="userAddClick('tecFollowPeople', 'tecFollowPeopleName')"/>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="影响业务时长(分钟):" prop="effectBusiDuration">
            <el-input-number v-model="formData.effectBusiDuration" :min="1" :max="100000" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="故障原因分类(标准):" prop="faultReasonType">
            <el-select v-model="formData.faultReasonType" filterable>
              <el-option v-for="item in dropList.NSOS_FAULT_REASON_TYPE" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="事件级别:" prop="eventLevel" filterable>
            <el-select v-model="formData.eventLevel" filterable>
              <el-option v-for="item in dropList.NSOS_EVENT_LEVEL" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="作业导致故障描述:" prop="faultDesc">
            <el-input v-model="formData.faultDesc" :rows="2" maxlength="500" show-word-limit type="textarea" placeholder="请输入故障描述" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="直接原因:" prop="directReason">
            <el-input v-model="formData.directReason" :rows="2" maxlength="500" show-word-limit type="textarea" placeholder="请输入直接原因" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="根本原因:" prop="radicallyReason">
            <el-input v-model="formData.radicallyReason" :rows="2" maxlength="500" show-word-limit type="textarea" placeholder="请输入根本原因" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="根本原因大类:" prop="radicallyReasonClass">
            <el-select v-model="formData.radicallyReasonClass" filterable>
              <el-option v-for="item in dropList.NSOS_RADICALLY_REASON_CLASS" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="根本原因小类:" prop="radicallyReasonType">
            <el-select v-model="formData.radicallyReasonType" filterable>
              <el-option v-for="item in dropList.NSOS_RADICALLY_REASON_TYPE" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="根因共性问题提炼:" prop="similarityProblem">
            <el-select v-model="formData.similarityProblem" filterable>
              <el-option v-for="item in dropList.NSOS_SIMILARITY_PROBLEM" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="故障责任单位:" prop="faultDutyOrg">
            <!-- <el-select v-model="formData.faultDutyOrg" filterable>
              <el-option v-for="item in dropList.NSOS_ORG_NAME" :key="item.value" :label="item.label" :value="item.value" />
            </el-select> -->
            <OrgTreeSelect v-model="formData.faultDutyOrg" @updateName="(v) => (formData.faultDutyOrgName = v)" filterable></OrgTreeSelect>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="故障跟进单位:" prop="faultFollowOrg">
            <!-- <el-select v-model="formData.faultFollowOrg" filterable>
              <el-option v-for="item in dropList.NSOS_ORG_NAME" :key="item.value" :label="item.label" :value="item.value" />
            </el-select> -->
            <OrgTreeSelect v-model="formData.faultFollowOrg" @updateName="(v) => (formData.faultFollowOrgName = v)" filterable></OrgTreeSelect>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="故障跟进人:" prop="faultFollowPeople">
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
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="是否涉及反措:" prop="isInvolveReaverse">
            <el-select v-model="formData.isInvolveReaverse" filterable>
              <el-option v-for="item in dropList.NSOS_YES_OR_NO" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="反措是否完成:" prop="isReaversed">
            <el-select v-model="formData.isReaversed" filterable>
              <el-option v-for="item in dropList.NSOS_IS_REAVERSED" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否移交安监:" prop="isHandover">
            <el-select v-model="formData.isHandover" filterable>
              <el-option v-for="item in dropList.NSOS_YES_OR_NO" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="是否闭环:" prop="isRing">
            <el-select v-model="formData.isRing" filterable>
              <el-option v-for="item in dropList.NSOS_YES_OR_NO" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否上报数字化部:" prop="isReport">
            <el-select v-model="formData.isReport" filterable>
              <el-option v-for="item in dropList.NSOS_YES_OR_NO" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否影响业务:" prop="isAffectBusi">
            <el-select v-model="formData.isAffectBusi" filterable>
              <el-option v-for="item in dropList.NSOS_YES_OR_NO" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="故障所属系统:" prop="faultBelongSubsys">
            <el-select v-model="formData.faultBelongSubsys" filterable>
              <el-option v-for="item in dropList.NSOS_SYSTEM_INFO" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="完成情况:" prop="finishCondition">
            <el-input v-model="formData.finishCondition" maxlength="40" show-word-limit clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="故障处置过程:" prop="faultHandlingProcess">
            <el-input v-model="formData.faultHandlingProcess" maxlength="500" show-word-limit clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="关联故障范围:" prop="faultScopeAssociation">
            <el-input v-model="formData.faultScopeAssociation" maxlength="80" show-word-limit clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="故障发生时间:" prop="faultOccurTime">
            <el-date-picker v-model="formData.faultOccurTime" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="故障发现时间:" prop="faultFindTime">
            <el-date-picker v-model="formData.faultFindTime" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="故障响应时间:" prop="faultResponseTime">
            <el-date-picker v-model="formData.faultResponseTime" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="故障定位时间:" prop="faultLocateTime">
            <el-date-picker v-model="formData.faultLocateTime" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="故障处置时间:" prop="faultDisposeTime">
            <el-date-picker v-model="formData.faultDisposeTime" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="故障恢复时间:" prop="faultRestoreTime">
            <el-date-picker v-model="formData.faultRestoreTime" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="故障简报提交时间:" prop="faultBriefingSubmitTime">
            <el-date-picker v-model="formData.faultBriefingSubmitTime" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否产出告警:" prop="hasAlarm">
            <el-select v-model="formData.hasAlarm" filterable>
              <el-option v-for="item in dropList.NSOS_YES_OR_NO" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="故障持续时长(分钟):" prop="faultDuration">
            <el-input-number v-model="formData.faultDuration" :min="1" :max="100000" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="作业导致故障责任单位部门:" prop="taskFaultOrg">
            <!-- <el-select v-model="formData.taskFaultOrg" filterable>
              <el-option v-for="item in dropList.NSOS_ORG_NAME" :key="item.value" :label="item.label" :value="item.value" />
            </el-select> -->
            <OrgTreeSelect v-model="formData.taskFaultOrg" @updateName="(v) => (formData.taskFaultOrgName = v)" filterable></OrgTreeSelect>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="计划完成时间:" prop="planEndTime">
            <el-date-picker v-model="formData.planEndTime" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="关联影响系统时长(分钟):" prop="associactionSysDuration">
            <el-input-number v-model="formData.associactionSysDuration" :min="1" :max="100000" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="是否涉及国产软硬件故障:" prop="isDomesticFailure">
            <el-select v-model="formData.isDomesticFailure" filterable>
              <el-option v-for="item in dropList.NSOS_YES_OR_NO" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="事件级别:" prop="isEventLevel" filterable>
            <el-select v-model="formData.isEventLevel">
              <el-option v-for="item in dropList.NSOS_IS_EVENT_LEVEL" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="三运早例会是否复盘:" prop="isReview">
            <el-select v-model="formData.isReview" filterable>
              <el-option v-for="item in dropList.NSOS_YES_OR_NO" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="复盘时间:" prop="reviewTime">
            <el-date-picker v-model="formData.reviewTime" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="整改完成情况:" prop="completionStatus">
            <el-input v-model="formData.completionStatus" clearable/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="备注:" prop="remark">
            <el-input v-model="formData.remark" :rows="2" maxlength="500" show-word-limit type="textarea" placeholder="请输入备注" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <div class="flex pb-1">
          <span class="required">技术整改措施:</span>
          <span class="flex items-center primary ml-3 cursor-pointer" @click="addRowClick" v-if="!disabled">＋添加</span>
          <span class="delcss flex items-center ml-3" @click="batchDeleteClick()" v-if="!disabled"><Delete class="h-[12px] w-[12px] mt-[0px]"></Delete><span>批量删除</span></span>
        </div>
        <el-table :data="data.tableData" ref="tableDataRef" border size="small" @row-click="onClickEdit" style="width: 100%">
          <el-table-column type="selection" width="40" align="center" v-if="!disabled" />
          <el-table-column type="index" width="40" label="#" align="center" />
          <el-table-column prop="measureContent" header-align="center" label="措施描述">
            <template #default="scope">
              <span>
                {{ scope.row.measureContent }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="dealOrgName" label="整改单位" width="280"></el-table-column>
          <el-table-column prop="requireFinishTime" label="要求完成时间" width="140" align="center">
            <template #default="scope">
              <span>
                {{ formatDateTime(scope.row.requireFinishTime) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="66" align="center" v-if="!disabled">
            <template #default="scope">
              <div class="flex items-center" style="justify-content: right">
                <span class="cursor-pointer flex primary ml-2" @click="editRow(scope.row)">编辑</span>
                <span class="delcss flex items-center m-auto" @click="deleteClick(scope.$index)"><Delete class="h-[12px] w-[12px]" /></span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-form>
    <ModalA class="w-[700px] h-[220px] top-[25vh]" :title="data.fmData.id ? '编辑' : '添加'" :footer="false" :closeOnClickModal="false" :draggable="true">
      <el-form label-width="auto" ref="dataFormRef" :model="data.fmData" :rules="formRules" :inline="true" label-position="right" class="h-[94px] demo-form-inline">
        <el-row>
          <el-col :span="24">
            <el-form-item label="措施描述:" prop="measureContent">
              <el-input v-model="data.fmData.measureContent" :rows="2" maxlength="500" show-word-limit type="textarea" placeholder="请输入措施描述" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="整改单位:" prop="dealOrg">
              <!-- <el-select v-model="data.fmData.dealOrg" filterable>
                <el-option v-for="item in dropList.NSOS_ORG_NAME" :key="item.value" :label="item.label" :value="item.value" />
              </el-select> -->
              <OrgTreeSelect v-model="data.fmData.dealOrg" @updateName="(v) => data.fmData.dealOrgName = v" filterable></OrgTreeSelect>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="要求完成时间:" prop="requireFinishTime">
              <el-date-picker v-model="data.fmData.requireFinishTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" clearable />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="text-center pt-[30px]">
        <el-button type="primary" class="ml-4" :icon="Tickets" @click="saveMeasureClick()">保存</el-button>
        <el-button type="info" class="ml-4" :icon="Close" @click="modalApiA.close()">取消</el-button>
      </div>
    </ModalA>
    <ModalB class="w-[1200px] h-[650px]" title="人员选择" :footer="false" :closeOnClickModal="false" :draggable="true">
      <UserSelect @selectOk="userSelectOk"></UserSelect>
    </ModalB>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { ElForm, ElFormItem, ElRow, ElCol, ElNotification, ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Tickets, Close, Plus } from '@element-plus/icons-vue'
import { formatDateTime } from '#/utils/commonUtil.ts'
import { useDropStore } from '#/store'
import { useVbenModal } from '@vben/common-ui'
import { queryReviewInfoByCode, saveFaultReviewInfo, queryMeasureByCode, saveFaultMeasure, deleteMeasure, initFaultMeasure } from './replayDetailMethod.ts'
import faultKeywordSelect from '/src/views/runDdMgt/faultMgt/faultKeyword/faultKeywordSelect.vue'
import OrgTreeSelect from '#/views/basic/common/orgTreeSelect.vue'
import UserSelect from '#/views/basic/common/userSelect.vue'

const dropList = reactive({})

const faultData = defineModel('faultData')
const formData = ref({})
const disabled = defineModel('disabled')
const ruleFormRef = ref()
const tableDataRef = ref()
const dataFormRef = ref()
const data = reactive({
  tableData: [],
  editIndex: null,
  fmData: {},
  curProp: null,
})
const formRules = reactive({
  measureContent: [
    { required: true, message: '请输入措施描述', trigger: 'blur' },
    { min: 0, max: 500, message: '内容长度最大不能超过500', trigger: 'blur' }
  ],
  dealOrg: [{ required: true, message: '请选择整改单位', trigger: 'change' }],
  requireFinishTime: [{ required: true, message: '请选择要求完成时间', trigger: 'blur' }]
})
const [ModalA, modalApiA] = useVbenModal({
  onCancel() {
    modalApiA.close()
  }
})
const [ModalB, modalApiB] = useVbenModal({
  onCancel() {
    modalApiB.close()
  }
})
onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = ['NSOS_IS_EVENT_LEVEL','NSOS_SYS_LEVEL', 'NSOS_OPERATE_SCHEMA', 'NSOS_FAULT_TYPE', 'NSOS_OPERATE_ORG', 'NSOS_SYSTEM_INFO', 'NSOS_IS_REAVERSED', 'NSOS_USER_NAME', 'NSOS_ORG_NAME', 'NSOS_YES_OR_NO', 'NSOS_FAULT_REASON_TYPE', 'NSOS_EVENT_LEVEL', 'NSOS_SIMILARITY_PROBLEM', 'NSOS_RADICALLY_REASON_CLASS', 'NSOS_RADICALLY_REASON_TYPE']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)
  document.body.addEventListener('click', function (event) {
    data.editIndex = null
  })
})
const formatEntity = () => {
  formData.value.reportCommitTime = formatDateTime(formData.value.reportCommitTime)
  formData.value.faultOccurTime = formatDateTime(formData.value.faultOccurTime)
  formData.value.faultFindTime = formatDateTime(formData.value.faultFindTime)
  formData.value.faultResponseTime = formatDateTime(formData.value.faultResponseTime)
  formData.value.faultLocateTime = formatDateTime(formData.value.faultLocateTime)
  formData.value.faultDisposeTime = formatDateTime(formData.value.faultDisposeTime)
  formData.value.faultRestoreTime = formatDateTime(formData.value.faultRestoreTime)
  formData.value.faultBriefingSubmitTime = formatDateTime(formData.value.faultBriefingSubmitTime)
  formData.value.planEndTime = formatDateTime(formData.value.planEndTime)
  formData.value.reviewTime = formatDateTime(formData.value.reviewTime)
}

const keywordSelectCompKey = ref()
watch(faultData, async (newval) => {
  formData.value = await queryReviewInfoByCode({ faultCode: faultData.value.faultCode })
  keywordSelectCompKey.value = new Date().getTime() + ''
  data.tableData = await queryMeasureByCode({ faultCode: faultData.value.faultCode })
  formatEntity()
})
const saveData = async () => {
  try {
    await saveFaultReviewInfo(formData.value)
    ElNotification({
      title: '提示',
      message: '保存成功！',
      type: 'success'
    })
  } catch (error) {
    console.error('保存技术复盘信息失败！', error)
  }
}
const saveMeasureClick = async () => {
  await dataFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await saveFaultMeasure(data.fmData)
        console.log(data.fmData);
        data.tableData = await queryMeasureByCode({ faultCode: faultData.value.faultCode })
        modalApiA.close()
        ElNotification({
          title: '提示',
          message: '保存成功！',
          type: 'success'
        })
      } catch (error) {
        console.error('保存技术整改措施失败！', error)
      }
    } else {
      ElMessage.warning('请输入必填项！')
    }
  })
}
const addRowClick = async () => {
  data.fmData = await initFaultMeasure({ faultCode: faultData.value.faultCode })

  modalApiA.open()
}

// 编辑
const editRow = async (row) => {
  data.fmData = JSON.parse(JSON.stringify(row))
  data.fmData.requireFinishTime = formatDateTime(data.fmData.requireFinishTime)
  modalApiA.open()
}

const deleteClick = (index) => {
  let ids = data.tableData[index].id
  ElMessageBox.confirm('确认是否删除选中的记录? ', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    if (ids != '') {
      await deleteMeasure({ ids: ids })
    }
    ElNotification({
      title: '提示',
      message: '删除成功！',
      type: 'success'
    })
    data.tableData.splice(index, 1)
  })
}
const batchDeleteClick = () => {
  let rows = tableDataRef.value.getSelectionRows()

  if (rows.length == 0) {
    ElMessage.warning('请勾选记录！')
    return
  }
  let ids = ''
  rows.forEach((r) => {
    if (r.id) {
      ids += r.id + ','
    }
  })
  ElMessageBox.confirm('确认是否删除选中的记录? ', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    if (ids != '') {
      await deleteMeasure({ ids: ids.substring(0, ids.length - 1) })
    }
    ElNotification({
      title: '提示',
      message: '删除成功！',
      type: 'success'
    })
    rows.forEach((r) => {
      for (let i = 0; i < data.tableData.length; i++) {
        if (r.id && data.tableData[i].id == r.id) {
          data.tableData.splice(i, 1)
        }
      }
    })
  })
}
const onClickEdit = (row, column, event) => {
  if (column.label != '操作') {
    data.editIndex = data.tableData.indexOf(row)
  }
  event.stopPropagation()
}
const handleChange = (row) => {
  // if (!data.updateList.includes(row)) {
  //   data.updateList.push(row);
  // }
}
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
defineExpose({
  saveData
})
</script>
<style scoped>
.demo-form-inline .el-input {
  --el-input-width: 100%;
}

.demo-form-inline .el-select {
  --el-select-width: 100%;
}

:deep(.el-date-editor.el-input, .el-date-editor.el-input__wrapper) {
  width: 100%;
}

.el-form--inline .el-form-item {
  width: calc(100% - 0px) !important;
  margin-right: 0 !important;
}

:deep(.el-form-item__label) {
  align-items: center;
  line-height: normal;
  text-align: right;
}

:deep(.el-input-number) {
  width: 100%;
}

.delcss {
  color: red;
  cursor: pointer;
}

.delcss:hover {
  text-decoration: underline;
}

.primary {
  color: hsl(var(--primary));
}
</style>
