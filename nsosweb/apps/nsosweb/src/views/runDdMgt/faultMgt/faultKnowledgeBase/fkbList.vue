<template>
  <el-container class="h-full bg-white">
    <el-header height="100px">
      <el-form label-width="auto" ref="ruleFormRef" :model="data.formData" :inline="true" label-position="right"
        class="demo-form-inline">
        <el-row :gutter="20">
          <el-col :span="4">
            <el-form-item label="故障编号：">
              <el-input v-model="data.formData.faultCode" placeholder="请输入故障编号" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="发生时间：">
              <el-date-picker v-model="data.formData.timeRange" type="datetimerange" format="YYYY-MM-DD HH:mm:ss.SSS"
                value-format="YYYY-MM-DD HH:mm:ss.SSS" range-separator="-" start-placeholder="开始" end-placeholder="结束"
                style="width: 100%;" @clear="clearTime"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="系统名称：">
              <el-select v-model="data.formData.sysArray" multiple placeholder="选择系统信息" collapse-tags
                collapse-tags-tooltip :max-collapse-tags="2" clearable filterable class="ml-0" @change="changeSystem"
                style="width: 500px">
                <el-option v-for="item in dropList.NSOS_SYSTEM_INFO" :key="item.value" :label="item.label"
                  :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <div>
            </div>
          </el-col>
          <el-col :span="4" style="padding-top: 20px">
            <div class="more-and-buttons">
              <div class="buttons">
                <el-button type="primary" class="ml-4" :icon="Search" @click="query">查询</el-button>
                <el-popover placement="bottom" :width="800" trigger="click" content="更多查询条件">
                  <template #reference>
                    <span class="more-text" @click="toggleAdvancedSearch">&nbsp;&nbsp;&nbsp;更多</span>
                  </template>
                  <el-form :model="data.formData">
                    <el-row :gutter="20">
                      <el-col :span="24">
                        <el-form-item
                          label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;故障信息：">
                          <el-input v-model="data.formData.faultInfo" clearable></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item
                          label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;直接原因：">
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
                            <el-option v-for="item in dropList.NSOS_RADICALLY_REASON_CLASS" :key="item.value"
                              :label="item.label" :value="item.value" />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="根本原因(小类)：" filterable>
                          <!-- <el-input v-model="data.formData.radicallyReasonType"></el-input> -->
                          <el-select v-model="data.formData.radicallyReasonType" filterable clearable>
                            <el-option v-for="item in dropList.NSOS_RADICALLY_REASON_TYPE" :key="item.value"
                              :label="item.label" :value="item.value" />
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="24">
                        <el-form-item label="根本共性问题提炼：" filterable>
                          <el-select v-model="data.formData.similarityProblem" clearable>
                            <el-option v-for="item in dropList.NSOS_SIMILARITY_PROBLEM" :key="item.value"
                              :label="item.label" :value="item.value" />
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="24">
                        <div>
                          <el-form-item label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;技术整改措施：">
                            <el-input v-model="data.formData.rectificationMeasure" clearable></el-input>
                          </el-form-item>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item
                          label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;分类："
                          filterable>
                          <el-select v-model="data.formData.faultReasonType" clearable>
                            <el-option v-for="item in dropList.NSOS_FAULT_REASON_TYPE" :key="item.value"
                              :label="item.label" :value="item.value" />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;报障渠道：">
                          <el-input v-model="data.formData.problemSource" clearable></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <div>
                          <el-form-item
                            label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;事件级别："
                            filterable>
                            <el-select v-model="data.formData.eventLevel" clearable>
                              <el-option v-for="item in dropList.NSOS_EVENT_LEVEL" :key="item.value" :label="item.label"
                                :value="item.value" />
                            </el-select>
                          </el-form-item>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div>
                          <el-form-item label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;运维模式：">
                            <el-input v-model="data.formData.operateSchema" clearable></el-input>
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
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">
            <el-form-item label="关联告警：">
              <el-select v-model="data.formData.gjArray" multiple placeholder="选择关联告警" collapse-tags
                collapse-tags-tooltip :max-collapse-tags="2" clearable filterable class="ml-0" @change="changeSystem"
                style="width: 500px">
                <el-option v-for="item in dropList.NSOS_RELATE_GJ" :key="item.label" :label="item.label"
                  :value="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="关联现象：">
              <el-select v-model="data.formData.xxArray" multiple placeholder="选择关联现象" collapse-tags
                collapse-tags-tooltip :max-collapse-tags="2" clearable filterable class="ml-0" @change="changeSystem"
                style="width: 500px">
                <el-option v-for="item in dropList.NSOS_RELATE_XX" :key="item.label" :label="item.label"
                  :value="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="关联日志：">
              <el-select v-model="data.formData.rzArray" multiple placeholder="选择关联日志" collapse-tags
                collapse-tags-tooltip :max-collapse-tags="2" clearable filterable class="ml-0" @change="changeSystem"
                style="width: 500px">
                <el-option v-for="item in dropList.NSOS_RELATE_RZ" :key="item.label" :label="item.label"
                  :value="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="关联措施">
              <el-select v-model="data.formData.csArray" multiple placeholder="选择关联措施" collapse-tags
                collapse-tags-tooltip :max-collapse-tags="2" clearable filterable class="ml-0" @change="changeSystem"
                style="width: 500px">
                <el-option v-for="item in dropList.NSOS_RELATE_CS" :key="item.label" :label="item.label"
                  :value="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-main style="height: calc(100% - 145px);">
      <el-table :data="tableData2" border size="small" style="height: 100%;">
        <el-table-column type="index" fixed width="40" label="#" align="center" />
        <el-table-column prop="faultInfo" label="故障信息" width="220" align="center"></el-table-column>
        <el-table-column prop="faultCode" label="故障编号" width="120" align="center"></el-table-column>
        <el-table-column prop="faultSys" label="系统名称" column-key="NSOS_SYSTEM_INFO" :formatter="formatDrop" width="180"
          align="center"></el-table-column>
        <el-table-column prop="relateGJ" label="关联告警" width="420" >
          <template #default="scope">
            <span v-html="scope.row.relateGJ.replace(/\n/g, '<br>')" />
          </template>
        </el-table-column>
        <el-table-column prop="relateXX" label="关联现象" width="240" >
          <template #default="scope">
            <span v-html="scope.row.relateXX.replace(/\n/g, '<br>')" />
          </template>
        </el-table-column>
        <el-table-column prop="relateRZ" label="关联日志" width="240" >
          <template #default="scope">
            <span v-html="scope.row.relateRZ.replace(/\n/g, '<br>')" />
          </template>
        </el-table-column>
        <el-table-column prop="relateCS" label="关联措施" width="240" >
          <template #default="scope">
            <span v-html="scope.row.relateCS.replace(/\n/g, '<br>')" />
          </template>
        </el-table-column>
        <el-table-column prop="processLog" label="故障处置过程" width="220" align="center"></el-table-column>
        <el-table-column prop="disposeMeasure" label="处置措施" width="220" align="center"></el-table-column>
        <el-table-column prop="disposeCommand" label="处置指令" width="220" align="center"></el-table-column>
        <el-table-column prop="faultOccurTime" label="故障发生时间" width="220" :formatter="tDateTimeFormat"
          align="center"></el-table-column>
        <el-table-column prop="faultRestoreTime" label="故障恢复时间" width="220" :formatter="tDateTimeFormat"
          align="center"></el-table-column>
        <el-table-column prop="effectBusiDuration" label="影响业务时长" width="220" align="center"></el-table-column>
        <el-table-column prop="faultReasonType" label="故障原因分类(标准)" column-key="NSOS_FAULT_REASON_TYPE"
          :formatter="formatDrop" width="220" align="center"> </el-table-column>
        <el-table-column prop="faultDesc" label="作业导致故障描述" width="220" align="center"></el-table-column>
        <el-table-column prop="eventLevel" label="事件级别" column-key="NSOS_EVENT_LEVEL" :formatter="formatDrop"
          width="220" align="center"></el-table-column>
        <el-table-column prop="directReason" label="直接原因" width="220" align="center"></el-table-column>
        <el-table-column prop="radicallyReason" label="根本原因" width="220" align="center"></el-table-column>
        <el-table-column prop="radicallyReasonClass" label="根本原因大类" column-key="NSOS_RADICALLY_REASON_CLASS"
          :formatter="formatDrop" width="220" align="center"></el-table-column>
        <el-table-column prop="radicallyReasonType" label="根本原因小类" column-key="NSOS_RADICALLY_REASON_TYPE"
          :formatter="formatDrop" width="220" align="center"></el-table-column>
        <el-table-column prop="similarityProblem" label="根因共性问题提炼" column-key="NSOS_SIMILARITY_PROBLEM"
          :formatter="formatDrop" width="220" align="center"></el-table-column>
        <el-table-column prop="faultDutyOrg" label="故障责任单位" width="220" align="center"></el-table-column>
        <el-table-column prop="faultFollowOrg" label="故障跟进单位" width="220" align="center"></el-table-column>
        <el-table-column prop="faultFollowPeople" label="故障跟进人" width="220" align="center"></el-table-column>
        <el-table-column prop="isInvolveReaverse" label="是否涉及反措" column-key="NSOS_IS_INVOLVE_REAVERSE"
          :formatter="formatDrop" width="220" align="center"></el-table-column>
        <el-table-column prop="isReaversed" label="反措是否完成" column-key="NSOS_IS_REAVERSED" :formatter="formatDrop"
          width="220" align="center"></el-table-column>
        <el-table-column prop="rectificationMeasure" label="技术整改措施" width="220" align="center"></el-table-column>
        <el-table-column prop="remark" label="备注" width="220" align="center">
          <template #default="scope">
            <el-input v-if="scope.row.isEditing" v-model="scope.row.remark" type="textarea" :rows="2"
              @blur="scope.row.isEditing = false"></el-input>
            <span v-else @click="scope.row.isEditing = true; index = scope.row.id;">{{ scope.row.remark }}</span>
          </template>
        </el-table-column>

        <!-- <el-table-column prop="commandStatus" fixed column-key="NSOS_COMMAND_STATE" :formatter="formatDrop" label="类型" width="120" align="center"/>
        <el-table-column prop="commandTime" label="发令时间" :formatter="tDateTimeFormat" width="150" align="center"/> -->
      </el-table>
    </el-main>
    <el-footer height="45px">
      <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" class="mt-1"
        :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange" @current-change="currentChange"></el-pagination>
    </el-footer>
  </el-container>
</template>

<script setup>
import { Page } from '@vben/common-ui';
import { onMounted, reactive, ref,computed } from 'vue';
import {ElIcon,ElRow,ElCol,ElTable, ElTableColumn,ElFormItem,ElForm,ElInput,ElButton,ElSelect,ElPagination,ElContainer,ElHeader,ElMain,ElFooter,ElDialog,ElMessage,ElMessageBox,ElLink, SIZE_INJECTION_KEY} from 'element-plus';
import { Search, RefreshLeft, Plus, Download } from '@element-plus/icons-vue';
import { tDateFormat, tDateTimeFormat, formatDrop } from '#/utils/commonUtil.ts';
import { requestClient } from '#/api/request';
import { useDropStore } from '#/store';
import { queryData } from './cmdMgtMethod.ts'

const data = reactive({
  tableData: [],
  tableData2: [],
  formData: {},
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0,
  },
})
const dropList = reactive({});
onMounted(async () => {
  const dropStore = useDropStore();
  const dropType = ['NSOS_RELATE_GJ','NSOS_RELATE_XX','NSOS_RELATE_RZ','NSOS_RELATE_CS','NSOS_SYSTEM_INFO','NSOS_FAULT_REASON_TYPE','NSOS_EVENT_LEVEL','NSOS_RADICALLY_REASON_CLASS','NSOS_RADICALLY_REASON_TYPE','NSOS_SIMILARITY_PROBLEM','NSOS_IS_INVOLVE_REAVERSE','NSOS_IS_REAVERSED']
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);
  query()
});

const mergedAlarms = computed(() => {
  if(data.tableData === null){return null}
  return data.tableData.reduce((acc, curr) => {
    if (!acc[curr.faultCode]) {
      acc[curr.faultCode] = {
        faultCode: curr.faultCode,
        relateGJ: [],
        relateXX: [],
        relateRZ: [],
        relateCS: [],
        faultInfo: curr.faultInfo,
        faultSys: curr.faultSys,
        processLog: curr.processLog,
        disposeMeasure: curr.disposeMeasure,
        disposeCommand: curr.disposeCommand,
        faultOccurTime: curr.faultOccurTime,
        faultRestoreTime: curr.faultRestoreTime,
        effectBusiDuration: curr.effectBusiDuration,
        faultReasonType: curr.faultReasonType,
        faultDesc: curr.faultDesc,
        eventLevel: curr.eventLevel,
        directReason: curr.directReason,
        radicallyReason: curr.radicallyReason,
        radicallyReasonClass: curr.radicallyReasonClass,
        radicallyReasonType: curr.radicallyReasonType,
        similarityProblem: curr.similarityProblem,
        faultDutyOrg: curr.faultDutyOrg,
        faultFollowOrg: curr.faultFollowOrg,
        faultFollowPeople: curr.faultFollowPeople,
        isInvolveReaverse: curr.isInvolveReaverse,
        isReaversed: curr.isReaversed,
        rectificationMeasure: curr.rectificationMeasure,
        remark: curr.remark,
      };
    }
    if (curr.relateGJ)acc[curr.faultCode].relateGJ.push(curr.relateGJ);
    if (curr.relateXX)acc[curr.faultCode].relateXX.push(curr.relateXX);
    if (curr.relateRZ)acc[curr.faultCode].relateRZ.push(curr.relateRZ);
    if (curr.relateCS)acc[curr.faultCode].relateCS.push(curr.relateCS);
    return acc;
  }, {});
});

const tableData2 = computed(() => {
  if(mergedAlarms.value === null){return null}
  return Object.values(mergedAlarms.value).map(item => ({
    ...item,
    relateGJ: item.relateGJ.map((gj, index) => `${index + 1}.${gj}`).join('\n'),
    relateXX: item.relateXX.map((xx, index) => `${index + 1}.${xx}`).join('\n'),
    relateRZ: item.relateRZ.map((rz, index) => `${index + 1}.${rz}`).join('\n'),
    relateCS: item.relateCS.map((cs, index) => `${index + 1}.${cs}`).join('\n'),
  }));;
});

const query = async () => {
  data.formData.pageSize = data.pageInfo.pageSize
  data.formData.pageNo = data.pageInfo.pageNo
  if (data.formData.timeRange) {
    data.formData.startTime = data.formData.timeRange[0]
    data.formData.endTime = data.formData.timeRange[1]
  }else {
    data.formData.startTime = null;
    data.formData.endTime = null;
  }
  const { list, count, pageNo } = await queryData(data.formData)

  data.tableData = list
  data.pageInfo.pageNo = pageNo;
  //data.pageInfo.total = count;
  if(tableData2.value === null){
    data.pageInfo.total = 0;
  }else{
    data.pageInfo.total = tableData2.value.length;
  }
}

const refreshClick = () => {
  data.formData = {}
}

const handleSizeChange = (val) => {
  data.pageInfo.pageSize = val;
  query();
};

const currentChange = (val) => {
  data.pageInfo.pageNo = val;
  query();
};

const changeSystem = () => {
  //console.log(data.formData.sysArray);
}

function clearTime() {
  data.formData.timeRange = [];
}

defineExpose({
  query
})
</script>



<style scoped>
.more-and-buttons {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.more-text {
  cursor: pointer;
  font-weight: bold;
  color: #409EFF; /* 蓝色字体 */
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

.demo-form-inline .el-input {
  --el-input-width: 100%;
}

.demo-form-inline .el-select {
  --el-select-width: 100%;
}

:deep(.el-date-editor.el-input, .el-date-editor.el-input__wrapper){
  width: 100%;
}

:deep(.el-form--inline .el-form-item){
  width: calc(100% - 20px);
  margin-right: 20px;
  margin-bottom: 12px;
}

:deep(.el-main){
  padding: 0;
}

.primary{
  color: hsl(var(--primary));
}

.cmdcode{
  cursor: pointer;
}

.cmdcode:hover{
  text-decoration: underline;
}
</style>
