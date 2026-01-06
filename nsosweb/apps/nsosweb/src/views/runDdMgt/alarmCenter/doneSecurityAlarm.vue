<template>
  <el-container class="h-full bg-white">
    <el-header height="48px">
      <el-form label-width="auto" :model="data.formData" :inline="true" label-position="right" class="demo-form-inline mt-2">
        <el-row>
          <el-col :span="7">
            <el-form-item label="告警时间">
              <el-date-picker v-model="data.formData.timeRange" type="datetimerange" format="YYYY-MM-DD HH:mm:ss.SSS"
                value-format="YYYY-MM-DD HH:mm:ss.SSS" range-separator="-" start-placeholder="开始" end-placeholder="结束"
                style="width: 100%;" @clear="clearTime"></el-date-picker>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="4">
            <el-form-item label="所属单位:" prop="cmdbUnitName" >
              <el-select v-model="data.formData.cmdbUnitName" filterable clearable>
                <el-option v-for="item in dropList.NSOS_ORG_NAME" :key="item.value" :label="item.label" :value="item.label" />
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="6">
            <el-form-item label="源IP:" prop="attackerIp">
              <el-input v-model="data.formData.attackerIp" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="目的IP:" prop="victimIp">
              <el-input v-model="data.formData.victimIp" clearable />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="4">
            <el-form-item label="危害等级:" prop="severity" filterable>
              <el-select v-model="data.formData.severity" clearable>
                <el-option v-for="item in dropList.NSOS_DANGER_LEVEL" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="2" style="display: flex; justify-content: flex-end">
            <el-button type="primary" @click="query">查询</el-button>
            <!-- <el-button type="primary" @click="toExcelClick">导出</el-button> -->
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-main style="height: calc(100% - 90px)">
      <el-table ref="securityAlarmTable" :data="data.tableData" border size="small" style="height: 100%" show-overflow-tooltip>
        <!-- <el-table-column type="selection" align="center" /> -->
        <el-table-column type="index" label="#" align="center" width="50" />
        <el-table-column prop="alertName" label="告警名称" align="center" width="160" />
        <el-table-column prop="alertDesc" label="告警描述" header-align="center" />
        <el-table-column prop="latestAlertTime" label="最新告警时间" :formatter="tDateTimeFormat" align="center" width="130" />
        <el-table-column prop="firstAlertTime" label="首次告警时间" :formatter="tDateTimeFormat" align="center" width="130" />
        <!-- <el-table-column prop="cmdbUnitName" label="所属单位" align="center" width="110" /> -->
        <el-table-column prop="attackerIp" label="源IP" align="center" width="240" />
        <el-table-column prop="victimIp" label="目的IP" align="center" width="240" />
        <!-- <el-table-column prop="severity" label="危害等级" align="center" column-key="NSOS_DANGER_LEVEL" :formatter="formatDrop" width="70" /> -->
        <el-table-column prop="attackCount" label="攻击次数" align="center" width="65" />
        <el-table-column prop="notes" label="标签记录" header-align="center" align="left" width="120" />
        <el-table-column prop="ydHandleType" label="处置状态" align="center" column-key="NSOS_YDHANDLE_TYPE" :formatter="formatDrop" width="70" />
      </el-table>
    </el-main>
    <el-footer height="45px">
      <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" class="mt-1"
        :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange" @current-change="currentChange"></el-pagination>
    </el-footer>

    <Modal class="w-[1200px]" title="转故障" :footer="false" :closeOnClickModal="false" :draggable="true" zIndex="3000">
      <FaultFillInForAlarm ref="faultFillIn" :formData="data.faultData"></FaultFillInForAlarm>
    </Modal>
    <el-dialog v-model="data.labelVisible" title="标签填报" width="30%" center>
      <LabelEdit :labelDesc="data.labelDesc" @labelCancel="data.labelVisible = false" @labelConfirm="labelConfirm"></LabelEdit>
    </el-dialog>
    <el-dialog v-model="data.assessVisible" title="研判" width="20%" center>
      <div style="text-align: center">
        <el-button link type="primary" @click="toCmd(data.assessData.id, 1)">IP封堵</el-button>
        <el-button link type="primary" @click="toCmd(data.assessData.id, 2)">漏洞处置</el-button>
        <el-button link type="primary" @click="editLabel(data.assessData)">打标记</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>
<script setup>
import { Page } from '@vben/common-ui';
import { ElForm, ElFormItem, ElRow, ElCol, ElTable, ElTableColumn, ElPagination,
         ElMain, ElContainer, ElHeader, ElFooter,
         ElTabs, ElTabPane, ElMessageBox, ElMessage, ElDialog,
         ElRadioGroup, ElRadioButton } from 'element-plus';
import { reactive, ref, onMounted } from 'vue';
import { useDropStore } from '#/store';
import { tDateTimeFormat, formatDrop } from '#/utils/commonUtil.ts';
import { queryData2, toExcel } from './alarmCenterMethod.ts';
import { useVbenModal } from '@vben/common-ui';
import FaultFillInForAlarm from './faultFillInForAlarm.vue'
import LabelEdit from '/src/views/basic/common/labelEdit.vue';

const dropList = reactive({});
onMounted(async () => {
  const dropStore = useDropStore();
  const dropType = ['NSOS_ORG_NAME', 'NSOS_DANGER_LEVEL','NSOS_YDHANDLE_TYPE'];
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);
  //data.formData.ydHandleType = '1';
  query();
});
const securityAlarmTable = ref();

const data = reactive({
  tableData: [],
  formData: {},
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0,
  },
  faultData: {},
  labelVisible: false,
  labelDesc: '',
  assessVisible: false,
  assessData: {},
});

const query = async () => {
  data.formData.pageSize = data.pageInfo.pageSize;
  data.formData.pageNo = data.pageInfo.pageNo;

  if (data.formData.timeRange) {
    data.formData.startTime = data.formData.timeRange[0]
    data.formData.endTime = data.formData.timeRange[1]
  }else {
    data.formData.startTime = null;
    data.formData.endTime = null;
  }

  const { list, pageNo, count } = await queryData2(data.formData);
  data.tableData = list;
  data.pageInfo.pageNo = pageNo;
  data.pageInfo.total = count;
};

const handleSizeChange = (val) => {
  data.pageInfo.pageSize = val;
  query();
};

const currentChange = (val) => {
  data.pageInfo.pageNo = val;
  query();
};

const toCmd = (val, type) => {
  modalApi.open()
}
const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
});
const editLabel = (row) => {
  data.labelDesc = row.labelDesc;
  data.labelVisible = true;
}
const labelConfirm = (newLabel) => {
  // 调用保存方法
  // saveLabel()
  data.labelVisible = true;
}
const assess = (row) => {
  data.assessData = row;
  data.assessVisible = true;
}

const toExcelClick = () => {
  toExcel(data.formData, '告警中心导出.xlsx')
}

defineExpose({
  query
})
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

/* 基础样式：所有按钮默认无圆角 */
:deep(.el-radio-button__inner) {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-width: 80px;
  height: 32px !important;
  padding: 0;
  margin-right: 15px;
  color: #666;
  text-align: center;
  background-color: #f0f2f6;
  border-radius: 0 !important;
  transition: none !important;
}

/* 选中状态的按钮样式 */
:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  height: 32px !important;
  margin: 0;
  margin-right: 15px;
  color: #3e7eff !important;
  background-color: #fff !important;
  border-radius: 5px !important;
  box-shadow: none !important;
  transition: none !important;
}

:deep(.el-radio-button__inner:hover) {
  color: #3e7eff;
}

:deep(.el-radio-button__inner) {
  border: none !important;
}

.radio-bg {
  display: flex;
  justify-content: center;
  width: 300px;
  height: 40px;
  background-color: #f0f2f6;
  border-radius: 5px;
}
</style>
