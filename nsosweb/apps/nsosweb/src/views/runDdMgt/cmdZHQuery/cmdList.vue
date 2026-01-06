<template>
  <el-container class="h-full bg-white">
    <el-header height="70px">
      <el-form label-width="70px" ref="ruleFormRef" size="small" :model="data.formData" :inline="true" label-position="right" class="demo-form-inline mt-1">
              <el-row>
                <el-col :span="4">
            <el-form-item label="发布年份:" filterable>
              <el-select v-model="data.formData.year" filterable clearable>
                <el-option v-for="item in dropList.NSOS_FL_YEAR" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
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
            <el-form-item label="受令单位:" filterable>
              <el-select v-model="data.formData.slArray" filterable clearable>
                <el-option v-for="item in dropList.NSOS_ORG_NAME" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
                <el-col :span="8" class="">
                  <el-popover :visible="data.moreVisible" placement="bottom" :width="900">
                    <template #reference>
                      <el-button type="primary" @click="data.moreVisible = !data.moreVisible" text style="margin-left: 10px; font-size: 12px">更多>></el-button>
                    </template>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="完成时限:" filterable>
                          <el-date-picker v-model="data.formData.timeRange" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" start-placeholder="开始时间" end-placeholder="结束时间"/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="发令时间:" filterable>
                          <el-date-picker v-model="data.formData.timeRange2" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" start-placeholder="开始时间" end-placeholder="结束时间"/>
                        </el-form-item>
                      </el-col>
                    </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="发令单位:" prop="flDept">
                      <el-input v-model="data.cmdData.flDeptName" disabled />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="发令人:" prop="commander">
                      <el-input v-model="data.cmdData.commanderName" disabled />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="关联信息:" prop="faultCode">
                      <el-input v-model="data.formData.faultCode"  clearable />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="具体内容:" prop="cmdContent">
                      <el-input v-model="data.formData.cmdContent" :rows="2" maxlength="1600" show-word-limit type="textarea" placeholder="请输入具体内容" clearable />
                    </el-form-item>
                  </el-col>
                </el-row>
                  </el-popover>
                  <el-button type="primary" class="ml-4" :icon="Search" @click="query">查询</el-button>
                  <el-button type="primary" class="ml-4" :icon="Download" @click="toExcelClick">导出</el-button>
                  <el-button type="info" plain class="ml-4" :icon="RefreshLeft" @click="refreshClick">重置</el-button>
                </el-col>
              </el-row>
              <el-row>
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
          <el-col :span="4">
            <el-form-item label="指令状态:" filterable>
              <el-select v-model="data.formData.commandStatus" filterable clearable>
                <el-option v-for="item in dropList.NSOS_COMMAND_STATE" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-main style="height: calc(100% - 115px)">
      <el-table :data="data.tableData" border show-overflow-tooltip size="small" style="height: 100%;" stripe>
        <el-table-column type="index" fixed width="40" label="#" align="center"/>
          <el-table-column label="编号" fixed width="180" align="center">
            <template #default="scope">
              <span class="primary cmdcode" @click="edit(scope.row)">{{scope.row.commandCode}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="commandFl" column-key="NSOS_CMD_FL" :formatter="formatDrop" label="类型" width="70" align="center"/>
          <el-table-column prop="commandType" column-key="NSOS_CMD_TYPE" :formatter="formatDrop" label="类别" width="80" align="center"/>
          <el-table-column prop="commandStatus" label="处置状态" column-key="NSOS_COMMAND_STATE" :formatter="formatDrop" align="center"  width="80" />
          <el-table-column prop="commandTitle" label="名称" align="left" header-align="center"/>
          <el-table-column prop="slDept" label="受令单位"  width="350" header-align="center" align="left"/>
          <el-table-column prop="wcTime" label="完成时限" :formatter="tDateTimeFormat" width="130" align="center"/>
          <el-table-column prop="flDeptName" label="发令单位" width="120" align="center"/>
          <el-table-column prop="commanderName" label="发令人" width="90" align="center"/>
          <el-table-column prop="flTime" label="发令时间"  :formatter="tDateTimeFormat" width="130" align="center"/>
          <el-table-column prop="updateTime" label="终结时间"  :formatter="tDateTimeFormat" width="130" align="center"/>
      </el-table>
    </el-main>
    <el-footer height="45px">
      <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" class="mt-1"
        :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange" @current-change="currentChange"></el-pagination>
    </el-footer>

    <Modal class="w-[1200px] h-[700px]" title="详情" :footer="false" :closeOnClickModal="false" :draggable="true">
      <CmdDetail :cmdId="data.selectedRow.id" :cmdFl="data.selectedRow.cmdFl" ></CmdDetail>
    </Modal>

  </el-container>
</template>
<script setup>
import { Page } from '@vben/common-ui';
import { Search, Delete, Plus, Download, Operation } from '@element-plus/icons-vue';
import { ElForm, ElFormItem, ElRow, ElCol, ElTable, ElTableColumn, ElPagination,
         ElMain, ElContainer, ElHeader, ElFooter,
         ElTabs, ElTabPane, ElMessageBox, ElMessage, ElDialog } from 'element-plus';
import { reactive, ref, onMounted,watch } from 'vue';
import { requestClient } from '#/api/request';
import { useDropStore } from '#/store';
import { queryData, toExcel } from './cmdTemplateMethod.ts'
import { useVbenModal } from '@vben/common-ui';
import CmdDetail from '../cmdMgt/cmdDetail.vue';
import { tDateFormat, tDateTimeFormat, formatDrop, lookFlow } from '#/utils/commonUtil.ts';

const dropList = reactive({});
onMounted(async () => {
  const dropStore = useDropStore();
  const dropType = ['NSOS_ORG_NAME_SLDW', 'NSOS_CMD_FL','NSOS_CMD_TYPE','NSOS_COMMAND_STATE','NSOS_NOTICE_TYPE','NSOS_FL_YEAR'];
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);
  query();
});
const scheduleListTable = ref();
const selectedRows = ref([]);

const cmdLx = ref()
const data = reactive({
  tableData: [],
  formData: {},
  cmdLbDrop: [],
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0,
  },
  selectedRow: {},
});

const query = async () => {
  data.formData.pageSize = data.pageInfo.pageSize;
  data.formData.pageNo = data.pageInfo.pageNo;

  if (data.formData.timeRange) {
    data.formData.startWcTime = data.formData.timeRange[0]
    data.formData.endWcTime = data.formData.timeRange[1]
  }else {
    data.formData.startWcTime = null;
    data.formData.endWcTime = null;
  }
  if (data.formData.timeRange2) {
    data.formData.startFlTime = data.formData.timeRange2[0]
    data.formData.endFlTime = data.formData.timeRange2[1]
  }else {
    data.formData.startFlTime = null;
    data.formData.endFlTime = null;
  }

  data.formData.commandFl = cmdLx.value
  const { list, pageNo, count } = await queryData(data.formData);
  console.log(list);
  data.tableData = list;
  data.pageInfo.pageNo = pageNo;
  data.pageInfo.total = count;

  formatEntity()
  refreshCmdType()
};

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
        dropList.NSOS_ORG_NAME_SLDW.forEach(o => {
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
  query()
}

const handleSelectionChange = (val) => {
  selectedRows.value = val;
};

const handleSizeChange = (val) => {
  data.pageInfo.pageSize = val;
  query();
};

const currentChange = (val) => {
  data.pageInfo.pageNo = val;
  query();
};

const add = () => {
  data.selectedRow = {};
  modalApi.open()
}

const closeDiaLog = () => {
  modalApi.close();
}

const edit = (row) => {
  console.log(row)
  data.selectedRow = row;
  modalApi.open()
}

const toExcelClick = async () => {
  toExcel(data.formData, '指令综合查询导出.xlsx')
}

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
});
</script>
<style scoped>
.primary{
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
