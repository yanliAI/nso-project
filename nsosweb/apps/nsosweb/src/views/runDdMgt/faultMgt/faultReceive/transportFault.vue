<template>
  <div class="w-full h-full">
    <el-tabs ref="myTab" v-model="data.tabIndex" @tab-remove="removeTab" type="card" class="w-full h-full bg-white">
      <el-tab-pane label="列表记录" name="list" :closable="false">
        <el-container class="h-full bg-white">
          <el-header height="105px">
            <el-form label-width="auto" :model="data.formData" :inline="true" label-position="right" class="demo-form-inline mt-2">
              <el-row>
                <el-col :span="5">
                  <el-form-item label="运服报障工单号:" prop="callFaultCode">
                    <el-input v-model="data.formData.callFaultCode" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="系统名称:" prop="faultSys">
                    <el-select v-model="data.formData.faultSys" clearable filterable>
                      <el-option v-for="item in dropList.NSOS_SYSTEM_INFO" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="系统等级:" prop="sysLevel">
                    <el-select v-model="data.formData.sysLevel" clearable filterable>
                      <el-option v-for="item in dropList.NSOS_SYS_LEVEL" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="运维单位:" prop="operateOrg">
                    <el-select v-model="data.formData.operateOrg" clearable filterable>
                      <el-option v-for="item in dropList.NSOS_OPERATE_ORG" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="报障时间:" prop="faultOccurTime">
                    <el-date-picker v-model="data.formData.faultOccurTime" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" start-placeholder="开始时间" end-placeholder="结束时间" clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="故障名称:" prop="faultInfo">
                    <el-input v-model="data.formData.faultInfo" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="影响范围及程度:" prop="effectRange">
                    <el-input v-model="data.formData.effectRange" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4" style="display: flex; justify-content: flex-end">
                  <el-button type="primary" @click="query">查询</el-button>
                  <el-button type="primary" v-if="queryState == '1'" @click="batchConfirmFault">批量确认</el-button>
                  <!-- <el-button type="primary" @click="fallback">退回</el-button> -->
                </el-col>
              </el-row>
            </el-form>
          </el-header>
          <el-main style="height: calc(100% - 155px)">
            <el-table ref="transportFaultTable" :data="data.tableData" border size="small" style="height: 100%">
              <el-table-column type="selection" align="center" width="40"/>
              <el-table-column type="index" label="#" align="center" width="40" />
              <el-table-column prop="callFaultCode" label="运服报障工单号" align="center" width="120">
                <template #default="scope">
                  <!-- <div @click="showDetail(scope.row)" class="clickable primary"> -->
                    {{ scope.row.callFaultCode }}
                  <!-- </div> -->
                </template>
              </el-table-column>
              <el-table-column prop="faultSys" label="系统名称" column-key="NSOS_SYSTEM_INFO" :formatter="formatDrop" align="center" width="90" />
              <el-table-column prop="sysLevel" label="系统等级" column-key="NSOS_SYS_LEVEL" :formatter="formatDrop" align="center" width="90" />
              <el-table-column prop="operateOrg" label="运维单位" column-key="NSOS_OPERATE_ORG" :formatter="formatDrop" align="center" width="90" />
              <el-table-column prop="deviceOwner" label="系统设备主人" align="center" width="90" />
              <el-table-column prop="deviceMasterPhone" label="联系方式" align="center" width="90" />
              <el-table-column prop="faultOccurTime" label="故障发生时间" :formatter="tDateTimeFormat" width="130" align="center"/>
              <el-table-column prop="faultInfo" label="故障名称" width="" header-align="center" />
              <el-table-column prop="effectRange" label="影响范围及程度" width="" header-align="center" />
              <el-table-column prop="faultType" label="故障类别" column-key="NSOS_FAULT_TYPE" :formatter="formatDrop" align="center" width="90" />
              <el-table-column prop="fillDispatcher" label="填报调度员" column-key="NSOS_USER_NAME" :formatter="formatDrop" align="center" width="100" />
              <el-table-column prop="fillTime" label="填报时间" :formatter="tDateTimeFormat" width="130" align="center"/>
              <el-table-column prop="faultCode" label="故障单号" align="center" width="120" v-if="queryState != '1'">
                <template #default="scope">
                  <div @click="showGzDetail(scope.row.faultCode)" class="clickable primary">
                    {{ scope.row.faultCode }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="100" v-if="queryState == '1'">
                <template #default="scope">
                  <el-button link type="primary" size="small" @click="confirmFault(scope.row)" :disabled="scope.row.faultCode">确认故障</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
          <el-footer height="45px">
            <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" class="mt-1"
              :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange" @current-change="currentChange"></el-pagination>
          </el-footer>
        </el-container>
      </el-tab-pane>
      <el-tab-pane v-for="item in data.tabArr" :key="item.name" :label="item.title" :name="item.name" closable>
      </el-tab-pane>
    </el-tabs>
    <Modal class="w-[1600px] h-[650px]" :title="data.selectedFault + ' 详情'" :footer="false" :closeOnClickModal="false" :draggable="true">
      <FaultDetail :faultId="data.faultId"></FaultDetail>
    </Modal>
  </div>
</template>
<script setup>
import { Page } from '@vben/common-ui';
import { ElForm, ElFormItem, ElRow, ElCol, ElTable, ElTableColumn, ElPagination, 
         ElMain, ElContainer, ElHeader, ElFooter, ElTabs, ElTabPane, ElMessageBox, ElMessage, ElNotification } from 'element-plus';
import { reactive, ref, onMounted } from 'vue';
import { requestClient } from '#/api/request';
import { useDropStore } from '#/store';
import { tDateTimeFormat, formatDrop } from '#/utils/commonUtil.ts';
import { queryData, confirm, batchConfirm, getFaultId } from './faultReceiveMethod.ts';
import { useVbenModal } from '@vben/common-ui'
import FaultDetail from '/src/views/runDdMgt/faultMgt/faultLogDetail/index.vue'

const dropList = reactive({});
const emit = defineEmits(['updateTotal'])
const queryState = defineModel('queryState')
const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close()
  }
})
onMounted(async () => {
  const dropStore = useDropStore();
  const dropType = ['NSOS_SYSTEM_INFO', 'NSOS_SYS_LEVEL', 'NSOS_OPERATE_ORG', 'NSOS_FAULT_TYPE', 'NSOS_USER_NAME'];
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);
  query();
});
const transportFaultTable = ref();

const data = reactive({
  tableData: [],
  formData: {},
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0,
  },
  tabIndex: 'list',
  tabArr: [],
});

const query = async () => {
  data.formData.startFaultOccurTime = data.formData.faultOccurTime?.[0]
  data.formData.endFaultOccurTime = data.formData.faultOccurTime?.[1]
  if (queryState && queryState.value) {
    data.formData.faultStatus = queryState.value
  }
  data.formData.pageSize = data.pageInfo.pageSize;
  data.formData.pageNo = data.pageInfo.pageNo;
  const { list, pageNo, count } = await queryData(data.formData);
  data.tableData = list;
  data.pageInfo.pageNo = pageNo;
  data.pageInfo.total = count;
  emit('updateTotal', queryState.value, count)
};

const handleSizeChange = (val) => {
  data.pageInfo.pageSize = val;
  query();
};

const currentChange = (val) => {
  data.pageInfo.pageNo = val;
  query();
};

const showDetail = (row) => {
  let tabArr = data.tabArr;
  let tab;
  if (row) {
    tabArr.some((item) => {
      if (item.faultId == row.id) {
        tab = item;
        return true;
      }
    });
  }

  if (!tab) {
    tab = {}
    tab.name = new Date().getTime() + '';
    if (row) {
      // 已保存工单tab信息
      tab.title = row.callFaultCode ? row.callFaultCode : "未编号";
      tab.faultId = row.id
    } else {
      // 新增工单tab信息
      tab.title = "新增";
      tab.faultId = null
    }
    tabArr.push(tab);
  }
  data.tabIndex = tab.name;
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

const confirmFault = async (row) => {
  ElMessageBox.confirm(
    '是否要将 ' + row.callFaultCode + ' 确认故障? ',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    try {
      await confirm(row)
      ElNotification({
        title: '提示',
        message: '确认故障成功！',
        type: 'success'
      })
      query()
    } catch (error) {
      ElMessage.error('确认故障失败！')
    }
  }).catch(() => {
    ElMessage.info('已取消确认故障');
  });
}
const batchConfirmFault = () => {
  let rows = transportFaultTable.value.getSelectionRows()
  if (rows.length === 0) {
    ElMessage.warning('请先选择要确认故障的工单');
    return
  }
  
  let codes = '';
  let existCodes = '';
  for (let i = 0; i < rows.length; i++) {
    codes += rows[i].callFaultCode + '，';
    if (rows[i].faultCode) {
      existCodes += rows[i].callFaultCode + '，';
    }
  }
  if (existCodes.length > 0) {
    ElMessage.warning(existCodes.slice(0, -1) + ' 已确认故障，请不要重复确认');
    return
  }

  ElMessageBox.confirm(
    '是否要将 ' + codes.slice(0, -1) + ' 确认故障? ',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    try {
      await batchConfirm(rows)
      ElNotification({
        title: '提示',
        message: '确认故障成功！',
        type: 'success'
      })
      query()
    } catch (error) {
      ElMessage.error('确认故障失败！')
    }
  }).catch(() => {
    ElMessage.info('已取消确认故障');
  });
}
const fallback = () => {

}
const showGzDetail = async (val) => {
  data.selectedFault = val
  data.faultId = await getFaultId({ faultCode: val })
  modalApi.open()
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
</style>
