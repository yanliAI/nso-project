<template>
  <div class="w-full h-full">
    <el-tabs ref="myTab" v-model="data.tabIndex" @tab-remove="removeTab" type="card" @tab-change="tabChange" class="w-full h-full bg-white">
      <el-tab-pane label="全部记录" name="list" :closable="false">
  <el-container class="h-full bg-white">
    <el-header height="40px">
      <el-form label-width="auto" ref="ruleFormRef"  :model="data.formData" :inline="true" label-position="right"  class="demo-form-inline mt-1">
        <el-row :gutter="20">
          <el-col :span="4">
            <el-form-item label="标题/任务内容:">
              <el-input v-model="data.formData.taskcontent" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="传来人:">
              <!-- <el-input v-model="data.formData.transMan" placeholder="请输入" clearable></el-input> -->
              <el-select v-model="data.formData.transMan" filterable clearable>
                  <el-option v-for="item in dropList.NSOS_USER_NAME" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="传来时间:">
              <el-date-picker v-model="data.formData.timeRange" type="datetimerange" format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss" range-separator="-" start-placeholder="开始" end-placeholder="结束"
                style="width: 100%;" @clear="clearTime"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="4" class="">
            <el-button type="primary" class="ml-4" :icon="Search" @click="query">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-main style="height: calc(100% - 80px);">
      <el-table :data="data.tableData" border  style="height: 100%;" stripe :header-cell-style="{ backgroundColor: '#F2F3F5', color: '#666666', fontSize: '14px', height: '40px', textAlign: 'center' }">
        <el-table-column type="index" fixed width="50" label="#" align="center" />
        <el-table-column prop="businesstype" label="业务类别" width="150" column-key="NSOS_BUSINESS_TYPE" :formatter="formatDrop" align="center"></el-table-column>
        <el-table-column prop="faultCode" label="单号/编号" width="220" align="center">
          <template #default="scope">
            <a @click="showDetail(scope.row)" class="my-text-link">
              {{ scope.row.faultCode }}
            </a>
          </template>
        </el-table-column>
        <el-table-column prop="taskcontent" label="标题/任务内容"   align="left">
          <template #default="scope">
            <a @click="showDetail(scope.row)" class="my-text-link">
              {{ scope.row.taskcontent }}
            </a>
          </template>
        </el-table-column>
        <el-table-column prop="transMan" label="传来人" width="150" column-key="NSOS_USER_NAME" :formatter="formatDrop" align="center"></el-table-column>
        <el-table-column prop="transTime" label="传来时间" width="250" :formatter="tDateTimeFormat" align="center"></el-table-column>
        <el-table-column prop="havingTime" label="停留时间(天)" width="150" align="center"></el-table-column>
      </el-table>
    </el-main>
    <el-footer height="40px">
      <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" class="mt-1"
        :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange" @current-change="currentChange"></el-pagination>
    </el-footer>
  </el-container>
</el-tab-pane>
      <el-tab-pane v-for="item in data.tabArr" :key="item.name" :label="item.title" :name="item.name" closable>
        <component :is="item.comp" :faultId="item.faultId" :readonly="true"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { Page } from '@vben/common-ui';
import { onMounted, reactive, ref,computed } from 'vue';
import {ElIcon,ElRow,ElCol,ElTable, ElTableColumn,ElFormItem,ElForm,ElInput,ElButton,ElSelect,ElPagination,ElContainer,ElHeader,ElMain,ElFooter,ElDialog,ElMessage,ElMessageBox,ElLink, SIZE_INJECTION_KEY} from 'element-plus';
import { Search, RefreshLeft, Plus, Download } from '@element-plus/icons-vue';
import { tDateFormat, tDateTimeFormat, formatDrop } from '#/utils/commonUtil.ts';
import { requestClient } from '#/api/request';
import { useDropStore } from '#/store';
import { queryData2,queryDataCount } from './cmdMgtMethod.ts'
import detailPage from '../faultMgt/faultReplayDetail/index.vue'

const data = reactive({
  tabIndex: 'list',
  tabArr: [],
  tableData: [],
  formData: {},
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0,
  },
})
const dropList = reactive({});
const emit = defineEmits(['updateTatol'])
onMounted(async () => {
  const dropStore = useDropStore();
  const dropType = ['NSOS_BUSINESS_TYPE','NSOS_USER_NAME']
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);
  query()
  queryCount();
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
  data.formData.editState = '1';
  data.formData.businesstype = 3;

  const { list, count, pageNo } = await queryData2(data.formData)
  queryCount();

  data.tableData = list
  data.pageInfo.pageNo = pageNo;
  data.pageInfo.total = count;
}

const queryCount = async () => {
  data.formData.pageSize = null
  data.formData.pageNo = null
  data.formData.editState = '1';

  const  count = await queryDataCount(data.formData)
  emit('updateTatol', count)
}

const refreshList = (showmask) => {
  query(showmask)
  emit('refreshList', showmask)
}
/**
 * 打开详情
 */
 const showDetail = (row) => {
  let tabArr = data.tabArr
  let tab
  if (row) {
    tabArr.some((item) => {
      if (item.faultId == row.id) {
        tab = item
        return true
      }
    })
  }

  if (!tab) {
    tab = {}
    tab.name = new Date().getTime() + ''
    if (row) {
      // 已保存工单tab信息
      tab.title = row.faultCode ? row.faultCode : '未编号'
      tab.faultId = row.id
    } else {
      // 新增工单tab信息
      tab.title = '新增'
      tab.faultId = null
    }
    tab.comp = detailPage
    tabArr.push(tab)
  }
  data.tabIndex = tab.name
  data.tabArr = tabArr
}

/**
 * 关闭详情
 */
const removeTab = (targetName) => {
  let tabArr = data.tabArr
  let tab

  let tabIndex = data.tabIndex
  if (tabIndex === targetName) {
    tabIndex = 'list'
    let nextTab
    tabArr.forEach(function (tab, index) {
      if (tab.name === targetName) {
        nextTab = tabArr[index + 1] || tabArr[index - 1]
        if (nextTab) {
          tabIndex = nextTab.name
        }
      }
    })
  }
  data.tabIndex = tabIndex
  for (var i = 0; i < tabArr.length; i++) {
    if (tabArr[i].name == targetName) {
      tabArr.splice(i, 1)
      break
    }
  }
}


const handleSizeChange = (val) => {
  data.pageInfo.pageSize = val;
  query();
};

const currentChange = (val) => {
  data.pageInfo.pageNo = val;
  query();
};


function clearTime() {
  data.formData.timeRange = [];
}

defineExpose({
  query
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

.primary{
  color: hsl(var(--primary));
}

.cmdcode{
  cursor: pointer;
}

.cmdcode:hover{
  text-decoration: underline;
}

.my-text-link {
  font-size: 12px;
  margin: 0 10px;
  color: var(--el-color-primary);
  cursor: pointer;
}

.my-text-link:hover {
  text-decoration: underline;
}
</style>
