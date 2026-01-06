<template>
  <div class="w-full h-full">
    <el-tabs ref="myTab" v-model="data.tabIndex" @tab-remove="removeTab" type="card" @tab-change="tabChange" class="w-full h-full bg-white">
      <el-tab-pane label="全部记录" name="list" :closable="false">
        <el-container class="h-full bg-white">
          <el-header height="35px">
            <el-form label-width="70px" ref="ruleFormRef" size="small" :model="data.formData" :inline="true" label-position="right" class="demo-form-inline mt-1">
              <el-row>
                <el-col :span="4">
                  <el-form-item label="编号:" prop="commandCode">
                    <el-input v-model="data.formData.commandCode" clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="名称:" prop="commandTitle">
                    <el-input v-model="data.formData.commandTitle" clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="类型:">
                    <el-select v-model="cmdLx" filterable clearable>
                      <el-option v-for="item in dropList.NSOS_CMD_FL" :key="item.value" :label="item.label" :value="item.value"/>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="类别:" filterable>
                    <el-select v-model="data.formData.commandType" filterable clearable>
                      <el-option v-for="item in data.cmdLbDrop" :key="item.value" :label="item.label" :value="item.value"/>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8" class="">
                  <el-popover :visible="data.moreVisible" placement="bottom" :width="600">
                    <template #reference>
                      <el-button type="primary" @click="data.moreVisible = !data.moreVisible" text style="margin-left: 10px; font-size: 12px">更多>></el-button>
                    </template>
                    <el-row>
                      <el-col :span="24">
                        <el-form-item label="完成时限:" filterable>
                          <el-date-picker v-model="data.formData.wcTime" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" start-placeholder="开始时间" end-placeholder="结束时间"/>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24">
                        <el-form-item label="发令时间:" filterable>
                          <el-date-picker v-model="data.formData.flTime" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" start-placeholder="开始时间" end-placeholder="结束时间"/>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-popover>
                  <el-button type="primary" class="ml-4" :icon="Search" @click="query(null)">查询</el-button>
                  <el-button type="primary" v-if="queryState == '0'" class="ml-4" :icon="Plus" @click="addCmdClick('1')">添加</el-button>
                  <!-- <el-button type="primary" v-if="queryState == '0'" class="ml-4" :icon="Plus" @click="addCmdClick('2')">通知</el-button> -->
                  <!-- <el-button type="primary" class="ml-4" :icon="Download" @click="toExcelClick">导出Excel</el-button> -->
                  <el-button type="info" plain class="ml-4" :icon="RefreshLeft" @click="refreshClick">重置</el-button>
                </el-col>
              </el-row>
            </el-form>
          </el-header>
          <el-main style="height: calc(100% - 75px);">
            <el-table :data="data.tableData" border show-overflow-tooltip size="small" style="height: 100%;" stripe>
              <el-table-column type="index" fixed width="40" label="#" align="center"/>
              <el-table-column label="编号" fixed width="200" align="center">
                <template #default="scope">
                  <span class="primary cmdcode" @click="showDetail(scope.row)">{{scope.row.commandCode}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="commandFl" column-key="NSOS_CMD_FL" :formatter="formatDrop" label="类型" width="100" align="center"/>
              <el-table-column prop="commandType" column-key="NSOS_CMD_TYPE" :formatter="formatDrop" label="类别" width="140" align="center"/>
              <el-table-column prop="commandTitle" label="名称" align="left" header-align="center"/>
              <el-table-column prop="slDept" label="受令单位" width="300" align="center"/>
              <el-table-column label="签收情况" v-if="queryState == '3'" width="80" align="center">
                <template #default="scope">
                  <span class="primary cmdcode" @click="queryDealTask(scope.row.id, '1')">{{scope.row.qsNum}}</span>
                </template>
              </el-table-column>
              <el-table-column label="复令情况" v-if="queryState == '4'" width="80" align="center">
                <template #default="scope">
                  <span class="primary cmdcode" @click="queryDealTask(scope.row.id, '2')">{{scope.row.flNum}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="wcTime" label="完成时限" :formatter="tDateTimeFormat" width="150" align="center"/>
              <el-table-column prop="flDeptName" label="发令单位" v-if="queryState == '0'" width="140" align="center"/>
              <el-table-column prop="commanderName" label="发令人" width="100" align="center"/>
              <!-- <el-table-column prop="nodeName" label="当前环节" v-if="queryState != '0' && queryState != '4' && queryState != '5'" width="200" align="center"/> -->
              <el-table-column prop="flTime" label="发令时间" v-if="queryState != '0' && queryState != '1' && queryState != '2'" :formatter="tDateTimeFormat" width="150" align="center"/>
              <el-table-column prop="updateTime" label="终结时间" v-if="queryState == '6'" :formatter="tDateTimeFormat" width="150" align="center"/>
              <el-table-column label="操作" width="65" v-if="queryState != '0'" align="center">
                <template #default="scope">
                  <div>
                    <div class="flex items-center m-auto">
                      <el-tooltip content="催办" placement="bottom" effect="light">
                        <Notification v-if="scope.row.processInsId && (queryState == '3' || queryState == '4')" class="abgh text-red-600 cursor-pointer primary m-auto"  style="width:18px;height:18px" @click="urge(scope.row)"/>
                      </el-tooltip>
                      <el-tooltip content="流程跟踪" placement="bottom" effect="light">
                        <Operation v-if="scope.row.processInsId" class="abgh text-red-600 cursor-pointer primary m-auto" @click="lookFlow(scope.row.processId, scope.row.processInsId)" style="width:18px;height:18px"/>
                      </el-tooltip>
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
          <ElFooter height="40px">
            <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" class="mt-1"
                :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange" @current-change="currentChange"></el-pagination>
          </ElFooter>
        </el-container>
      </el-tab-pane>
      <el-tab-pane v-for="item in data.tabArr" :key="item.name" :label="item.title" :name="item.name" closable>
        <CmdDetail :cmdId="item.id" :cmdFl="item.cmdFl" :oprateFlow="oprateFlow" :oprateFlowStatus="queryState" :tabName="item.name" @afterAdd="afterAdd($event, item)" @afterDelete="query(false)" @refreshList="refreshList" @afterBack="emit('afterBack')" @afterNullify="afterNullify" @removeTab="removeTab"></CmdDetail>
      </el-tab-pane>
      <ModalA class="w-[800px] h-[500px]" title="签收情况" :footer="false" :closeOnClickModal="false" :draggable="true">
        <el-table :data="data.taskHqList" border size="small" style="height: 100%;">
          <el-table-column type="index" width="40" label="#" align="center"/>
          <el-table-column prop="signDwName" label="受令单位" width="250" align="center"/>
          <el-table-column prop="signManName" label="签收人" align="center"/>
          <el-table-column label="签收时间" align="center">
            <template #default="props">
              <span v-if="props.row.isComplate == 'Y'">{{formatDateTime(props.row.opTime)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="isComplate" label="是否签收" align="center">
            <template #default="props">
              <span v-if="props.row.isComplate == 'Y'" class="primary">已签收</span>
              <span v-else class="text-red-600">未签收</span>
            </template>
          </el-table-column>
        </el-table>
      </ModalA>
      <ModalB class="w-[800px] h-[500px]" title="复令情况" :footer="false" :closeOnClickModal="false" :draggable="true">
        <el-table :data="data.taskFlList" border size="small" style="height: 100%;">
          <el-table-column type="index" width="40" label="#" align="center"/>
          <el-table-column prop="signDwName" label="复令单位" align="center"/>
          <el-table-column prop="signManName" label="复令人" align="center"/>
          <el-table-column label="复令时间"   align="center">
            <template #default="props">
              <span v-if="props.row.isComplate == 'Y'">{{formatDateTime(props.row.opTime)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="isComplate" label="是否复令" width="100" align="center">
            <template #default="props">
              <span v-if="props.row.isComplate == 'Y'" class="primary">已复令</span>
              <span v-else class="text-red-600">未复令</span>
            </template>
          </el-table-column>
        </el-table>
      </ModalB>
      <ModalC class="w-[900px] h-[600px]" title="批量催办信息" :footer="false" :closeOnClickModal="false" :draggable="true">
        <BatchNoticeDialog :addFlag="false" :delFlag="false" :cmdData="data.cmdData" @closeDiaLog="modalApiC.close()" />
      </ModalC>
    </el-tabs>
  </div>
</template>
<script setup>
import { Page } from '@vben/common-ui';
import { onMounted, reactive, ref, watch, nextTick } from 'vue';
import { ElForm, ElFormItem, ElRow, ElCol, ElTable, ElTableColumn, ElPopover, ElPagination, ElMain, ElContainer, ElHeader, ElFooter, ElTabs, ElTabPane} from 'element-plus';
import { Search, RefreshLeft, Plus, Download, Operation, Notification } from '@element-plus/icons-vue';
import { tDateFormat, formatDateTime, tDateTimeFormat, formatDrop, lookFlow } from '#/utils/commonUtil.ts';
import { useDropStore } from '#/store';
import { useVbenModal } from '@vben/common-ui';
import { queryData, toExcel, querySignList } from './cmdMgtMethod.ts'
import CmdDetail from './cmdDetail.vue'
import BatchNoticeDialog from '/src/views/runDdMgt/workbench/batchNoticeDialog.vue'

const emit = defineEmits(['addCmd', 'showDetail', 'updateTatol', 'refreshList', 'afterNullify', 'afterBack'])
const queryState = defineModel('queryState')
const [ModalA, modalApiA] = useVbenModal({
  onCancel() {
    modalApiA.close();
  },
});
const [ModalB, modalApiB] = useVbenModal({
  onCancel() {
    modalApiB.close();
  },
});
const [ModalC, modalApiC] = useVbenModal({
  onCancel() {
    modalApiC.close();
  },
});
const cmdLx = ref()
const data = reactive({
  tabIndex: 'list',
  tabArr: [],
  tableData: [],
  formData: {},
  taskHqList: [],
  taskFlList: [],
  cmdLbDrop: [],
  moreVisible: false,
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0,
  },
  cmdData: null,
})
const dropList = reactive({});
const oprateFlow = ref(false)
onMounted(async () => {
  const dropStore = useDropStore();
  const dropType = ['NSOS_COMMAND_STATE','NSOS_ORG_NAME', 'NSOS_USER_NAME', 'NSOS_CMD_TYPE', 'NSOS_NOTICE_TYPE', 'NSOS_CMD_FL']
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);
  query(true)
  if (queryState.value == '1' || queryState.value == '2' || queryState.value == '5') {
    oprateFlow.value = true
  }
});

const query = async (showmask) => {
  data.moreVisible = false

  data.formData.pageSize = data.pageInfo.pageSize
  data.formData.pageNo = data.pageInfo.pageNo

  data.formData.commandFl = cmdLx.value
  data.formData.startWcTime = data.formData.wcTime?.[0]
  data.formData.endWcTime = data.formData.wcTime?.[1]
  data.formData.startFlTime = data.formData.flTime?.[0]
  data.formData.endFlTime = data.formData.flTime?.[1]
  if (queryState && queryState.value) {
    data.formData.commandStatus = queryState.value
  }
  const { list, count, pageNo } = await queryData(data.formData, {showmask: showmask})
  data.tableData = list
  data.pageInfo.pageNo = pageNo;
  data.pageInfo.total = count;
  emit('updateTatol', queryState.value, count)
  formatEntity()
  refreshCmdType()
}
const refreshCmdType = async () => {
  const dropStore = useDropStore();
  const dropType = ['NSOS_CMD_TYPE']
  await dropStore.refreshDrops(dropType);
  dropStore.get(dropList, dropType);
}
const formatEntity = () => {
  if (!data.tableData) return
  data.tableData.forEach(r => {
    let sldw = eval(r.slDept)
    let l = ''
    if (sldw && sldw.length > 0) {
      sldw.forEach(d => {
        dropList.NSOS_ORG_NAME.forEach(o => {
          if (d == o.value) {
            l += o.label + '；'
          }
        })
      })
    }
    r.slDept = l
  })
}
watch(cmdLx, (newval) => {
  data.cmdLbDrop = dropList.NSOS_CMD_TYPE?.filter(option => option.filter === newval)
})
const refreshClick = () => {
  data.formData = {}
  cmdLx.value = null
}

const queryDealTask = async (id, type) => {
  if (type == '1') {
    modalApiA.open()
  } else {
    modalApiB.open()
  }
  let params = {cmdId: id, opType: type}
  let list = await querySignList(params)
  if (type == '1') {
    data.taskHqList = list
  } else {
    data.taskFlList = list
  }
}
const formatDeptName = (acs, flag) => {
  if (acs.length > 1) {
    if (flag == 1) {
      return acs.substring(0, acs.length - 2)
    }
    if (flag == 2) {
      return acs.substring(acs.length - 2, acs.length)
    }
  }
  if (acs == '复核') {
    return data.cmdData.flDept
  }
}
const toExcelClick = async () => {
  data.formData.pageSize = data.pageInfo.pageSize
  data.formData.pageNo = data.pageInfo.pageNo
  toExcel(data.formData, '指令管理导出excel.xlsx')
}
const addCmdClick = (fl) => {
  showDetail(null, fl);
}
const refreshList = (showmask) => {
  emit('refreshList', showmask)
}
const afterNullify = (showmask) => {
  query(showmask)
  emit('afterNullify', showmask)
}
const handleSizeChange = (val) => {
  data.pageInfo.pageSize = val;
  query();
};
const showDetail = (row, fl) => {
  data.moreVisible = false
  let tabArr = data.tabArr;
  let tab;
  if (row) {
    tabArr.some((item) => {
      if (item.id == row.id) {
        tab = item;
        return true;
      }
    });
  }

  if (!tab) {
    tab = {}
    tab.name = new Date().getTime() + '';
    tab.cmdFl = fl
    if (row) {
      // 已保存工单tab信息
      tab.title = row.commandCode ? row.commandCode : "未编号";
      tab.id = row.id
    } else {
      // 新增工单tab信息
      tab.title = fl == '2' ? '新增通知' : '新增指令';
      tab.id = null
    }
    tabArr.push(tab);
  }
  data.tabIndex = tab.name;
}
const afterAdd = (row, tabPane) => {
  tabPane.id = row.id;
  tabPane.title = row.commandCode;

  // 更新头部信息
  data.tabArr.some((item) => {
      if (item.name === tabPane.name) {
          item.title = tabPane.title;
          return true;
      }
  });
  query(false)
}
const removeTab = (targetName) => {
  let tabArr = data.tabArr;
  let tab;

  let tabIndex = data.tabIndex;
  if (tabIndex === targetName) {
    tabIndex = 'list';
    let nextTab;
    tabArr.forEach(function(tab, index) {
      if (tab.name === targetName) {
        nextTab = tabArr[index + 1] || tabArr[index - 1];
        if (nextTab) {
          tabIndex = nextTab.name;
        }
      }
    });
  }
  data.tabIndex = tabIndex;
  for (var i = 0; i < tabArr.length; i++) {
    if (tabArr[i].name == targetName) {
      tabArr.splice(i, 1);
      break;
    }
  }
}
const tabChange = () => {
  data.moreVisible = false
}
const currentChange = (val) => {
  data.pageInfo.pageNo = val;
  query();
};
const showDetailForWorkbench = (row, fl) => {
  nextTick().then(() => {
    oprateFlow.value = row.oprateFlow === 'true' ? true : false;
    showDetail(row, fl);
  });
}
const urge = async (item) => {
  data.cmdData = item
  modalApiC.open()
}
defineExpose({
  query, showDetailForWorkbench, data
})
</script>
<style scoped>
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

:deep(.el-form-item){
  width: calc(100% - 20px);
  margin-right: 20px;
  margin-bottom: 12px;
}

:deep(.el-main){
  padding: 0;
}

:deep(.el-tabs){
  --el-tabs-header-height: 30px;
}

:deep(.el-tabs__item){
  font-size: 12px;
}

:deep(.el-tabs__header){
  margin-bottom: 4px;
}

:deep(.el-popper) {
  max-width: 600px!important;
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
