<template>
  <el-container class="h-full bg-white">
    <el-header height="100px">
      <el-form label-width="auto" ref="ruleFormRef" :model="data.formData" :inline="true" label-position="right" class="demo-form-inline">
        <el-row class="pt-3">
          <el-col :span="4">
            <el-form-item label="故障编号：">
              <el-input v-model="data.formData.faultCode" placeholder="请输入故障编号" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="处置过程：">
              <el-input v-model="data.formData.disposeRecord" clearable placeholder="请输入处置过程"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="发生时间：">
              <el-date-picker v-model="data.formData.timeRange" type="datetimerange" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" range-separator="-" start-placeholder="开始" end-placeholder="结束" style="width: 100%" @clear="clearTime"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <div class="more-and-buttons">
              <div class="buttons">
                <el-popover placement="bottom" :width="800" trigger="click" content="更多查询条件">
                  <template #reference>
                    <el-button type="primary" @click="toggleAdvancedSearch" text style="margin-left: 10px; font-size: 12px">更多>></el-button>
                  </template>
                  <el-form :model="data.formData">
                    <el-row :gutter="20">
                      <el-col :span="24">
                        <el-form-item label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;故障信息：">
                          <el-input v-model="data.formData.faultInfo" clearable></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;直接原因：">
                          <el-input v-model="data.formData.directReason" clearable></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;根本原因：">
                          <el-input v-model="data.formData.radicallyReason" clearable></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;根本原因(大类)：" filterable>
                          <!-- <el-input v-model="data.formData.radicallyReasonClass"></el-input> -->
                          <el-select v-model="data.formData.radicallyReasonClass" clearable>
                            <el-option v-for="item in dropList.NSOS_RADICALLY_REASON_CLASS" :key="item.value" :label="item.label" :value="item.value" />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="根本原因(小类)：" filterable>
                          <!-- <el-input v-model="data.formData.radicallyReasonType"></el-input> -->
                          <el-select v-model="data.formData.radicallyReasonType" filterable clearable>
                            <el-option v-for="item in dropList.NSOS_RADICALLY_REASON_TYPE" :key="item.value" :label="item.label" :value="item.value" />
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="24">
                        <el-form-item label="根本共性问题提炼：" filterable>
                          <el-select v-model="data.formData.similarityProblem" clearable>
                            <el-option v-for="item in dropList.NSOS_SIMILARITY_PROBLEM" :key="item.value" :label="item.label" :value="item.value" />
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="24">
                        <div>
                          <el-form-item label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;技术整改措施：">
                            <el-input v-model="data.formData.measure" clearable></el-input>
                          </el-form-item>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;分类：" filterable>
                          <el-select v-model="data.formData.faultReasonType" clearable>
                            <el-option v-for="item in dropList.NSOS_FAULT_REASON_TYPE" :key="item.value" :label="item.label" :value="item.value" />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;问题来源：">
                          <!-- <el-input v-model="data.formData.problemSource" clearable></el-input> -->
                          <el-select v-model="data.formData.problemSource" clearable>
                              <el-option v-for="item in dropList.NSOS_PROBLEM_SOURCE" :key="item.value" :label="item.label" :value="item.value" />
                            </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <div>
                          <el-form-item label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;事件级别：" filterable>
                            <el-select v-model="data.formData.eventLevel" clearable>
                              <el-option v-for="item in dropList.NSOS_EVENT_LEVEL" :key="item.value" :label="item.label" :value="item.value" />
                            </el-select>
                          </el-form-item>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div>
                          <el-form-item label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;运维模式：">
                            <!-- <el-input v-model="data.formData.operateSchema" clearable></el-input> -->
                            <el-select v-model="data.formData.operateSchema" clearable>
                              <el-option v-for="item in dropList.NSOS_OPERATE_SCHEMA" :key="item.value" :label="item.label" :value="item.value" />
                            </el-select>
                          </el-form-item>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="24">
                        <el-form-item label="&nbsp;&nbsp;&nbsp;&nbsp;影响范围及程度：" filterable>
                          <el-input v-model="data.formData.effectRange" clearable></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </el-popover>
                <el-button type="primary" class="ml-4" :icon="Search" @click="query">查询</el-button>
                <el-button type="primary" class="ml-4" :icon="Plus" @click="add">新增</el-button>
                <el-button type="primary" class="ml-4" :icon="Delete" @click="batchDelete">批量删除</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <!-- <el-col :span="4">
            <el-form-item label="关联告警：">
              <el-select v-model="data.formData.gjArray" multiple placeholder="选择关联告警" collapse-tags
                collapse-tags-tooltip :max-collapse-tags="2" clearable filterable class="ml-0" @change="changeSystem"
                style="width: 500px">
                <el-option v-for="item in dropList.NSOS_GL_ALARM" :key="item.label" :label="item.label"
                  :value="item.label" />
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="4">
            <el-form-item label="关联关键字：">
              <!-- <el-select v-model="data.formData.xxArray" multiple placeholder="选择关联现象" collapse-tags
                collapse-tags-tooltip :max-collapse-tags="2" clearable filterable class="ml-0" @change="changeSystem"
                style="width: 500px">
                <el-option v-for="item in dropList.NSOS_GL_KEYWORD" :key="item.label" :label="item.label"
                  :value="item.label" />
              </el-select> -->
              <el-select v-model="data.formData.keyword" clearable filterable placeholder="选择关联关键字">
                <el-option v-for="item in dropList.NSOS_GL_KEYWORD" :key="item.value" :label="item.label" :value="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="关联措施：">
              <el-select v-model="data.formData.csArray" multiple placeholder="选择关联措施" collapse-tags collapse-tags-tooltip :max-collapse-tags="1" clearable filterable class="ml-0" @change="changeSystem" style="width: 500px">
                <el-option v-for="item in dropList.NSOS_GL_MEASURE" :key="item.label" :label="item.label" :value="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="系统名称：">
              <el-select v-model="data.formData.sysArray" multiple placeholder="选择系统信息" collapse-tags collapse-tags-tooltip :max-collapse-tags="1" clearable filterable class="ml-0" @change="changeSystem" style="width: 500px">
                <el-option v-for="item in dropList.NSOS_SYSTEM_INFO" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
           <el-col :span="8">
            <div class="more-and-buttons">
              <div class="buttons">
                <el-button type="primary" class="ml-4" :icon="Download" @click="toExcelClick">导入</el-button>
                <el-button type="primary" class="ml-4" :icon="Download" @click="toExcelOut">导出</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-main style="height: calc(100% - 145px)">
      <el-table ref="scheduleListTable" :data="data.tableData" border show-overflow-tooltip size="small" @selection-change="handleSelectionChange" style="height: 100%">
        <el-table-column type="selection" align="center" fixed width="40" />
        <el-table-column type="index" label="#" align="center" fixed width="40" />
        <el-table-column prop="faultInfo" label="故障信息" fixed width="200" header-align="center" align="left"></el-table-column>
        <el-table-column prop="faultCode" label="故障编号" fixed width="120" align="center">
          <template #default="scope">
            <div @click="edit(scope.row)" class="clickable primary">
              {{ scope.row.faultCode }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="faultSys" label="系统名称" column-key="NSOS_SYSTEM_INFO" :formatter="formatDrop" width="160" align="center"></el-table-column>
        <!-- <el-table-column prop="faultAlarm" label="关联告警" width="300" header-align="center" :show-overflow-tooltip="false">
          <template #default="scope">
            <el-tooltip :raw-content="true" :content="formatInfo(scope.row.faultAlarm)" placement="top" :popper-class="'custom-tooltip'" >
              <div class="custom-cell" >{{ scope.row.faultAlarm }}</div>
            </el-tooltip>
          </template>
        </el-table-column> -->
        <el-table-column prop="keyword" label="关联关键字" width="300" header-align="center" :show-overflow-tooltip="false">
          <template #default="scope">
            <el-tooltip :raw-content="true" :content="formatInfo(scope.row.keyword)" placement="top" :popper-class="'custom-tooltip'">
              <div class="custom-cell">{{ scope.row.keyword }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="disposeRecord" label="故障处置过程" width="300" header-align="center" :show-overflow-tooltip="false">
          <template #default="scope">
            <el-tooltip :raw-content="true" :content="formatInfo(scope.row.disposeRecord)" placement="top" :popper-class="'custom-tooltip'">
              <div class="custom-cell">{{ scope.row.disposeRecord }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="reformRecord" label="关联措施" width="300" header-align="center" :show-overflow-tooltip="false">
          <template #default="scope">
            <el-tooltip :raw-content="true" :content="formatInfo(scope.row.reformRecord)" placement="top" :popper-class="'custom-tooltip'">
              <div class="custom-cell">{{ scope.row.reformRecord }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="problemSource" label="问题来源" column-key="NSOS_PROBLEM_SOURCE" :formatter="formatDrop" width="130" align="center"> </el-table-column>
        <el-table-column prop="faultOccurTime" label="故障发生时间" width="130" :formatter="tDateTimeFormat" align="center"></el-table-column>
        <el-table-column prop="faultRestoreTime" label="故障恢复时间" width="130" :formatter="tDateTimeFormat" align="center"></el-table-column>
        <el-table-column prop="effectBusiDuration" label="影响业务时长(小时)" width="130" align="center"></el-table-column>
        <el-table-column prop="faultReasonType" label="故障原因分类(标准)" column-key="NSOS_FAULT_REASON_TYPE" :formatter="formatDrop" width="130" align="center"> </el-table-column>
        <el-table-column prop="faultDesc" label="作业导致故障描述" width="160" header-align="center" align="left"></el-table-column>
        <el-table-column prop="eventLevel" label="事件级别" column-key="NSOS_EVENT_LEVEL" :formatter="formatDrop" width="70" align="center"></el-table-column>
        <el-table-column prop="directReason" label="直接原因" width="150" header-align="center" align="left"></el-table-column>
        <el-table-column prop="radicallyReason" label="根本原因" width="150" header-align="center" align="left"></el-table-column>
        <el-table-column prop="radicallyReasonClass" label="根本原因大类" column-key="NSOS_RADICALLY_REASON_CLASS" :formatter="formatDrop" width="100" align="center"></el-table-column>
        <el-table-column prop="radicallyReasonType" label="根本原因小类" column-key="NSOS_RADICALLY_REASON_TYPE" :formatter="formatDrop" width="100" align="center"></el-table-column>
        <el-table-column prop="similarityProblem" label="根因共性问题提炼" column-key="NSOS_SIMILARITY_PROBLEM" :formatter="formatDrop" width="120" align="center"></el-table-column>
        <el-table-column prop="faultDutyOrgName" label="故障责任单位" width="120"  align="center"></el-table-column>
        <el-table-column prop="faultFollowOrgName" label="故障跟进单位" width="120"  align="center"></el-table-column>
        <el-table-column prop="faultFollowPeopleName" label="故障跟进人" width="120" align="center"></el-table-column>
        <el-table-column prop="isInvolveReaverse" label="是否涉及反措" column-key="NSOS_YES_OR_NO" :formatter="formatDrop" width="100" align="center"></el-table-column>
        <el-table-column prop="isReaversed" label="反措是否完成" column-key="NSOS_IS_REAVERSED" :formatter="formatDrop" width="100" align="center"></el-table-column>
        <el-table-column prop="isDomesticFailure" label="是否涉及国产软硬件故障" column-key="NSOS_YES_OR_NO" :formatter="formatDrop" width="170" align="center"></el-table-column>
        <el-table-column prop="isEventLevel" label="事件级别（如涉及）" column-key="NSOS_IS_EVENT_LEVEL" :formatter="formatDrop" width="130" align="center"></el-table-column>
        <el-table-column prop="isReview" label="三运早例会是否复盘" column-key="NSOS_YES_OR_NO" :formatter="formatDrop" width="130" align="center"></el-table-column>
        <el-table-column prop="reviewTime" label="复盘时间" width="130" :formatter="tDateTimeFormat" align="center"></el-table-column>
        <el-table-column prop="completionStatus" label="整改完成情况"  width="150" header-align="center" align="left"></el-table-column>
        <el-table-column prop="isReport" label="是否上报数字化部" column-key="NSOS_YES_OR_NO" :formatter="formatDrop" width="130" align="center"></el-table-column>
        <el-table-column prop="faultType" label="分类" column-key="NSOS_FAULT_TYPE" :formatter="formatDrop" width="130" align="center"></el-table-column>
        <el-table-column prop="faultBelongSubsys" label="故障所属子系统" column-key="NSOS_SYSTEM_INFO" :formatter="formatDrop" width="130" align="center"></el-table-column>
        <el-table-column prop="sysLevel" label="故障系统/设备级别" column-key="NSOS_SYS_LEVEL" :formatter="formatDrop" width="150" align="center"></el-table-column>
        <el-table-column prop="operateSchema" label="运维模式" column-key="NSOS_OPERATE_SCHEMA" :formatter="formatDrop" width="120" align="center"></el-table-column>
        <el-table-column prop="deviceOwner" label="设备主人" width="100" align="center"></el-table-column>
        <el-table-column prop="isAffectBusi" label="是否影响业务" column-key="NSOS_YES_OR_NO" :formatter="formatDrop" width="130" align="center"></el-table-column>
        <el-table-column prop="faultScopeAssociation" label="关联故障范围" width="150" header-align="center" align="left"></el-table-column>
        <el-table-column prop="effectRange" label="影响范围及程度" width="150" header-align="center" align="left"></el-table-column>
        <el-table-column prop="faultFindTime" label="故障发现时间" width="130" :formatter="tDateTimeFormat" align="center"></el-table-column>
        <el-table-column prop="faultResponseTime" label="故障响应时间" width="130" :formatter="tDateTimeFormat" align="center"></el-table-column>
        <el-table-column prop="faultLocateTime" label="故障定位时间" width="130" :formatter="tDateTimeFormat" align="center"></el-table-column>
        <el-table-column prop="faultDisposeTime" label="故障处置时间" width="130" :formatter="tDateTimeFormat" align="center"></el-table-column>
        <el-table-column prop="faultDuration" label="故障持续时长" width="100" align="center"></el-table-column>
        <el-table-column prop="faultBriefingSubmitTime" label="故障简报提交时间" width="170" :formatter="tDateTimeFormat" align="center"></el-table-column>
        <el-table-column prop="hasAlarm" label="是否产出告警" column-key="NSOS_YES_OR_NO" :formatter="formatDrop" width="130" align="center"></el-table-column>
        <el-table-column prop="isTipical" label="是否典型故障" column-key="NSOS_YES_OR_NO" :formatter="formatDrop" width="130" align="center"></el-table-column>
        <el-table-column prop="reportCommitTime" label="故障分析报告提交时间" width="170" :formatter="tDateTimeFormat" align="center"></el-table-column>
        <el-table-column prop="tecFollowPeopleName" label="技术组跟进人" width="120" align="center"></el-table-column>
        <el-table-column prop="associactionSysDuration" label="关联影响系统时长" width="130" align="center"></el-table-column>
        <el-table-column prop="taskFaultOrgName" label="作业导致故障责任单位部门" width="170" align="center"></el-table-column>
        <el-table-column prop="isRing" label="是否闭环" column-key="NSOS_YES_OR_NO" :formatter="formatDrop" width="100" align="center"></el-table-column>
        <el-table-column prop="isHandover" label="是否移交安监" column-key="NSOS_YES_OR_NO" :formatter="formatDrop" width="130" align="center"></el-table-column>

        <el-table-column prop="measure" label="技术整改措施" width="300" header-align="center" align="left" :show-overflow-tooltip="false">
          <template #default="scope">
            <el-tooltip :raw-content="true" :content="formatInfo(scope.row.measure)" placement="top" :popper-class="'custom-tooltip'">
              <div class="custom-cell">{{ scope.row.measure }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="100">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="edit(scope.row)">编辑</el-button>
            <el-button link type="danger" size="small" @click="batchDeleteOne(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer height="45px">
      <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" class="mt-1" :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="currentChange"></el-pagination>
    </el-footer>

    <Modal class="w-[1200px] h-[800px]" title="添加信息" :footer="false" :closeOnClickModal="false" :draggable="true">
      <TemplateDiaLog :formData="data.selectedRow" @close="addClose" @closeDiaLog="closeDiaLog" @query="query"></TemplateDiaLog>
    </Modal>

    <ModalA class="w-[800px] h-[380px]" title="模板信息" :footer="false" :closeOnClickModal="false" :draggable="true">
      <TemplateDiaLogA :formData="data.selectedRow" @close="addCloseA" @closeDiaLog="closeDiaLogA" @query="query"></TemplateDiaLogA>
    </ModalA>
  </el-container>
</template>
<script setup>
import { Page } from '@vben/common-ui'
import { Search, Delete, Plus, Download, Operation } from '@element-plus/icons-vue'
import { ElForm, ElFormItem, ElRow, ElCol, ElTable, ElTableColumn, ElPagination, ElMain, ElContainer, ElHeader, ElFooter, ElTabs, ElTabPane, ElMessageBox, ElMessage, ElDialog, ElNotification } from 'element-plus'
import { onMounted, reactive, ref, computed } from 'vue'
import { requestClient } from '#/api/request'
import { useDropStore } from '#/store'
import { queryData, toExcel } from './cmdTemplateMethod.ts'
import { useVbenModal } from '@vben/common-ui'
import TemplateDiaLog from './TemplateDiaLog.vue'
import TemplateDiaLogA from './TemplateDiaLogA.vue'
import { tDateFormat, tDateTimeFormat, formatDrop, lookFlow } from '#/utils/commonUtil.ts'
import { downloadFile } from '#/utils/download.ts'

const dropList = reactive({})
onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = ['NSOS_SYS_LEVEL','NSOS_OPERATE_SCHEMA','NSOS_FAULT_TYPE','NSOS_IS_EVENT_LEVEL', 'NSOS_GL_ALARM', 'NSOS_GL_KEYWORD', 'NSOS_RELATE_RZ','NSOS_PROBLEM_SOURCE', 'NSOS_GL_MEASURE', 'NSOS_SYSTEM_INFO', 'NSOS_FAULT_REASON_TYPE', 'NSOS_EVENT_LEVEL', 'NSOS_RADICALLY_REASON_CLASS', 'NSOS_RADICALLY_REASON_TYPE', 'NSOS_SIMILARITY_PROBLEM', 'NSOS_YES_OR_NO', 'NSOS_IS_REAVERSED', 'NSOS_ORG_NAME', 'NSOS_USER_NAME']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)
  query()
})
const scheduleListTable = ref()
const selectedRows = ref([])

const data = reactive({
  tableData: [],
  formData: {},
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0
  },
  selectedRow: {}
})

const query = async () => {
  data.formData.pageSize = data.pageInfo.pageSize
  data.formData.pageNo = data.pageInfo.pageNo
  if (data.formData.timeRange) {
    data.formData.startTime = data.formData.timeRange[0]
    data.formData.endTime = data.formData.timeRange[1]
  } else {
    data.formData.startTime = null
    data.formData.endTime = null
  }
  const { list, count, pageNo } = await queryData(data.formData)

  data.tableData = list
  data.pageInfo.pageNo = pageNo
  data.pageInfo.total = count
}

const toExcelOut = () => {
  data.formData.pageSize = data.pageInfo.pageSize
  data.formData.pageNo = data.pageInfo.pageNo
  if (data.formData.timeRange) {
    data.formData.startTime = data.formData.timeRange[0]
    data.formData.endTime = data.formData.timeRange[1]
  } else {
    data.formData.startTime = null
    data.formData.endTime = null
  }

  downloadFile(import.meta.env.VITE_NSOSGZ + '/typicalFault/toExcel', data.formData)
}

const handleSelectionChange = (val) => {
  selectedRows.value = val
}

const handleSizeChange = (val) => {
  data.pageInfo.pageSize = val
  query()
}

const currentChange = (val) => {
  data.pageInfo.pageNo = val
  query()
}

const add = () => {
  data.selectedRow = {}
  modalApi.open()
}

const toExcelClick = () => {
  modalApiA.open()
}

const closeDiaLog = () => {
  modalApi.close()
}

const closeDiaLogA = () => {
  modalApiA.close()
}

const edit = (row) => {
  console.log(row)
  data.selectedRow = row
  modalApi.open()
}

const xq = (row) => {
  console.log(row)
  data.selectedRow = row
  modalApiA.open()
}

const batchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要删除的数据')
    return
  }
  ElMessageBox.confirm('确定要删除这些数据吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      batchDeleteBatch()
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}

const batchDeleteOne = (row) => {
  ElMessageBox.confirm('确定要删除吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      batchDeleteOnes(row)
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}
const batchDeleteOnes = async (row) => {
  try {
    const selectedRows = ref([])
    selectedRows.value.push(row)
    console.log(111)
    console.log(selectedRows.value)
    await requestClient.post(import.meta.env.VITE_NSOSGZ + '/typicalFault/deletebatchData', selectedRows.value)
    query()
    selectedRows.value = []
    ElMessage.success('删除成功！')
  } catch (error) {
    console.error('删除失败:', error)
    query()
    ElMessage.error('删除失败！')
  }
}

const batchDeleteBatch = async () => {
  try {
    await requestClient.post(import.meta.env.VITE_NSOSGZ + '/typicalFault/deletebatchData', selectedRows.value)
    query()
    selectedRows.value = []
    ElMessage.success('删除成功！')
  } catch (error) {
    console.error('删除失败:', error)
    query()
    ElMessage.error('删除失败！')
  }
}

// 提取首行用于单元格显示
const splitFirstLine = (text) => {
  return text ? text.split(/(?=\d+\.)/)[0] : text
}

const formatInfo = (text) => {
  return text ? text.replace(/(\d+\.)/g, '<br>$1').replace('<br>', '') : text
}

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close()
  }
})
const [ModalA, modalApiA] = useVbenModal({
  onCancel() {
    modalApiA.close()
  }
})

defineExpose({
  query
})
</script>
<style scoped>
.primary {
  color: hsl(var(--primary));
}

.clickable {
  cursor: pointer;
}

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

:deep(.el-main) {
  padding: 0;
}

.more-and-buttons {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.more-text {
  font-weight: bold;
  color: #409eff; /* 蓝色字体 */
  cursor: pointer;
}

.buttons {
  display: flex;
  align-items: center;
}

.buttons .el-button {
  margin-left: 10px;
}

.buttons .el-button:first-child {
  margin-left: 0;
}

/* 单元格溢出省略 */
.custom-cell {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; /* 单行截断 */
}

/* Tooltip 多行展示 */
.el-tooltip__popper {
  line-height: 1.5;
  white-space: pre-line;
}

/* 自定义 Tooltip 换行样式 */
.custom-tooltip {
  max-width: 500px; /* 限制最大宽度 */
  line-height: 1.8;
  white-space: pre-line; /* 保留换行符 */
}
</style>
