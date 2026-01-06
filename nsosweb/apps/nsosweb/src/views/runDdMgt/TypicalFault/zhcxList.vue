<template>
  <el-container class="h-full bg-white">
    <el-header height="100px">
      <el-form label-width="auto" ref="ruleFormRef" :model="data.formData" :inline="true" label-position="right"
        class="demo-form-inline">
        <el-row class="pt-3">
          <el-col :span="4">
            <el-form-item label="故障编号：">
              <el-input v-model="data.formData.faultCode" placeholder="请输入故障编号" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="处置过程：">
              <el-input v-model="data.formData.disposeRecord" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发生时间：">
              <el-date-picker v-model="data.formData.timeRange" type="datetimerange" format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss" range-separator="-" start-placeholder="开始" end-placeholder="结束"
                style="width: 100%;" @clear="clearTime"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <div class="more-and-buttons">
              <div class="buttons">
                <el-popover placement="bottom" :width="800" trigger="click" content="更多查询条件">
                  <template #reference>
                    <el-button type="primary" @click="toggleAdvancedSearch" text style="margin-left: 10px; font-size: 12px">更多>></el-button>
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
                            <el-input v-model="data.formData.measure" clearable></el-input>
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
                <el-button type="primary" class="ml-4" :icon="Search" @click="query">查询</el-button>
                <el-button type="primary" class="ml-4" :icon="Delete" @click="add">批量关联</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row >
          <!-- <el-col :span="4">
            <el-form-item label="关联告警：">
              <el-input v-model="data.formData.faultAlarm" clearable></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="4">
            <el-form-item label="关联关键字：">
              <el-input v-model="data.formData.keyword" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="系统名称：">
              <el-select v-model="data.formData.sysArray" multiple placeholder="选择系统信息" collapse-tags
                collapse-tags-tooltip :max-collapse-tags="2" clearable filterable class="ml-0" @change="changeSystem"
                style="width: 500px">
                <el-option v-for="item in dropList.NSOS_SYSTEM_INFO" :key="item.value" :label="item.label"
                  :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="关联措施：">
              <el-input v-model="data.formData.disposeRecord" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-main style="height: calc(100% - 145px)">
      <el-table ref="scheduleListTable" :data="data.tableData" show-overflow-tooltip border size="small" @selection-change="handleSelectionChange" style="height: 100%" >
        <el-table-column type="selection" align="center" width="40"/>
        <el-table-column type="index" label="#" align="center" width="40" />
        <el-table-column prop="isGL" label="关联故障库" width="80" align="center">
          <template #default="scope">
            <el-button link type="primary" size="small" v-if="scope.row.isGL === '否'" @click="addone(scope.row)">未关联</el-button>
            <span v-if="scope.row.isGL === '是'">已关联</span>
          </template>
        </el-table-column>
        <el-table-column prop="faultInfo" label="故障信息" width="300" header-align="center"></el-table-column>
        <el-table-column prop="faultCode" label="故障编号" width="120" align="center"></el-table-column>
        <el-table-column prop="faultSys" label="系统名称" column-key="NSOS_SYSTEM_INFO" :formatter="formatDrop" width="150" align="center"></el-table-column>
        <!-- <el-table-column prop="faultAlarm" label="关联告警" width="420" header-align="center" :show-overflow-tooltip="false">
          <template #default="scope">
            <el-tooltip :raw-content="true" :content="formatInfo(scope.row.faultAlarm)" placement="top" :popper-class="'custom-tooltip'" >
              <div class="custom-cell" >{{ scope.row.faultAlarm }}</div>
            </el-tooltip>
          </template>
        </el-table-column> -->
        <el-table-column prop="keyword" label="关联关键字" width="240" header-align="center" :show-overflow-tooltip="false">
          <template #default="scope">
            <el-tooltip :raw-content="true" :content="formatInfo(scope.row.keyword)" placement="top" :popper-class="'custom-tooltip'" >
              <div class="custom-cell" >{{ scope.row.keyword }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="disposeRecord" label="故障处置过程" width="300" header-align="center" :show-overflow-tooltip="false">
          <template #default="scope">
            <el-tooltip :raw-content="true" :content="formatInfo(scope.row.disposeRecord)" placement="top" :popper-class="'custom-tooltip'" >
              <div class="custom-cell" >{{ scope.row.disposeRecord }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="reformRecord" label="关联措施" width="300" header-align="center" :show-overflow-tooltip="false">
          <template #default="scope">
            <el-tooltip :raw-content="true" :content="formatInfo(scope.row.reformRecord)" placement="top" :popper-class="'custom-tooltip'" >
              <div class="custom-cell" >{{ scope.row.reformRecord }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="faultOccurTime" label="故障发生时间" width="130" :formatter="tDateTimeFormat" align="center"></el-table-column>
        <el-table-column prop="faultRestoreTime" label="故障恢复时间" width="130" :formatter="tDateTimeFormat" align="center"></el-table-column>
        <el-table-column prop="effectBusiDuration" label="影响业务时长(小时)" width="130" align="center"></el-table-column>
        <el-table-column prop="faultReasonType" label="故障原因分类(标准)" column-key="NSOS_FAULT_REASON_TYPE" :formatter="formatDrop" width="125" align="center"> </el-table-column>
        <el-table-column prop="faultDesc" label="作业导致故障描述" width="220" header-align="center" align = "left"></el-table-column>
        <el-table-column prop="eventLevel" label="事件级别" column-key="NSOS_EVENT_LEVEL" :formatter="formatDrop" width="80" align="center"></el-table-column>
        <el-table-column prop="directReason" label="直接原因" width="220" header-align="center" align="left"></el-table-column>
        <el-table-column prop="radicallyReason" label="根本原因" width="220" header-align="center" align="left"></el-table-column>
        <el-table-column prop="radicallyReasonClass" label="根本原因大类" column-key="NSOS_RADICALLY_REASON_CLASS" :formatter="formatDrop" width="90" align="center"></el-table-column>
        <el-table-column prop="radicallyReasonType" label="根本原因小类" column-key="NSOS_RADICALLY_REASON_TYPE" :formatter="formatDrop" width="90" align="center"></el-table-column>
        <el-table-column prop="similarityProblem" label="根因共性问题提炼" column-key="NSOS_SIMILARITY_PROBLEM" :formatter="formatDrop" width="220" header-align="center" align="left"></el-table-column>
        <el-table-column prop="faultDutyOrg" label="故障责任单位" width="120" column-key="NSOS_ORG_NAME" :formatter="formatDrop" align="center"></el-table-column>
        <el-table-column prop="faultFollowOrg" label="故障跟进单位" width="120" column-key="NSOS_ORG_NAME" :formatter="formatDrop" align="center"></el-table-column>
        <el-table-column prop="faultFollowPeople" label="故障跟进人" width="120" column-key="NSOS_USER_NAME" :formatter="formatDrop" align="center"></el-table-column>
        <el-table-column prop="isInvolveReaverse" label="是否涉及反措" column-key="NSOS_IS_INVOLVE_REAVERSE" :formatter="formatDrop" width="90" align="center"></el-table-column>
        <el-table-column prop="isReaversed" label="反措是否完成" column-key="NSOS_IS_REAVERSED" :formatter="formatDrop" width="90" align="center"></el-table-column>
        <el-table-column prop="measure" label="技术整改措施" width="220" header-align="center" :show-overflow-tooltip="false">
          <template #default="scope">
            <el-tooltip :raw-content="true" :content="formatInfo(scope.row.measure)" placement="top" :popper-class="'custom-tooltip'" >
              <div class="custom-cell" >{{ scope.row.measure }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer height="45px">
      <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" class="mt-1" :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="currentChange"></el-pagination>
    </el-footer>

    <Modal class="w-[800px] h-[400px]" title="模板信息" :footer="false" :closeOnClickModal="false" :draggable="true">
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
import { ElForm, ElFormItem, ElRow, ElCol, ElTable, ElTableColumn, ElPagination, ElMain, ElContainer, ElHeader, ElFooter, ElTabs, ElTabPane, ElMessageBox, ElMessage, ElDialog } from 'element-plus'
import { onMounted, reactive, ref,computed } from 'vue';
import { requestClient } from '#/api/request'
import { useDropStore } from '#/store'
import { queryData2, toExcel } from './cmdTemplateMethod.ts'
import { useVbenModal } from '@vben/common-ui'
import TemplateDiaLog from './TemplateDiaLog.vue'
import TemplateDiaLogA from './TemplateDiaLogA.vue'
import { tDateFormat, tDateTimeFormat, formatDrop, lookFlow } from '#/utils/commonUtil.ts'

const dropList = reactive({})
onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = ['NSOS_GL_ALARM','NSOS_GL_KEYWORD','NSOS_RELATE_RZ','NSOS_GL_MEASURE','NSOS_SYSTEM_INFO','NSOS_FAULT_REASON_TYPE','NSOS_EVENT_LEVEL','NSOS_RADICALLY_REASON_CLASS','NSOS_RADICALLY_REASON_TYPE','NSOS_SIMILARITY_PROBLEM','NSOS_IS_INVOLVE_REAVERSE','NSOS_IS_REAVERSED','NSOS_ORG_NAME','NSOS_USER_NAME']
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
  }else {
    data.formData.startTime = null;
    data.formData.endTime = null;
  }
  const { list, count, pageNo } = await queryData2(data.formData)

  data.tableData = list
  data.pageInfo.pageNo = pageNo
  data.pageInfo.total = count
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

const addone = async (row) => {
  try {
    const selectedRows = ref([])
    selectedRows.value.push(row)
    await requestClient.post(import.meta.env.VITE_NSOSGZ + '/typicalFault/add', selectedRows.value)
    selectedRows.value = []
    ElMessage.success('添加成功！')
  }  catch (error) {
    console.error('添加失败！:', error)
  }finally{
    query()
  }
}

const add = async (row) => {
  try {
    const filteredData = selectedRows.value.filter(item => item.isGL === "否");
    await requestClient.post(import.meta.env.VITE_NSOSGZ + '/typicalFault/add', filteredData)
    selectedRows.value = []
    ElMessage.success('添加成功！')
  } catch (error) {
    console.error('添加失败！:', error)
  }finally{
    query()
  }
}

const closeDiaLog = () => {
  modalApi.close()
}

const closeDiaLogA = () => {
  modalApiA.close()
}

const toExcelClick = async () => {
  toExcel(data.formData, '指令模板维护导出excel.xlsx')
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
  color: #409EFF; /* 蓝色字体 */
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
  max-width: 500px;     /* 限制最大宽度 */
  line-height: 1.8;
  white-space: pre-line; /* 保留换行符 */
}
</style>
