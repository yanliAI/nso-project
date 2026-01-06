<template>
  <el-container class="h-full bg-white">
    <el-header height="90px">
      <el-form label-width="auto" ref="ruleFormRef" :model="data.formData" :inline="true" label-position="right" class="demo-form-inline">
        <el-row>
          <el-col :span="4">
            <el-form-item label="信息编号:" prop="infoCode">
              <el-input v-model="data.formData.infoCode" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="发布时间:" prop="releaseTimeSt">
              <el-date-picker v-model="data.formData.releaseTimeSt" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="-&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" prop="releaseTimeEd">
              <el-date-picker v-model="data.formData.releaseTimeEd" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="信息内容:" prop="infoContent">
              <el-input v-model="data.formData.infoContent" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="6" style="display: flex; justify-content: flex-end">
            <el-button type="primary" class="ml-4" @click="query">查询</el-button>
            <el-button type="primary" class="ml-4" @click="addSubmissionClick">新增</el-button>
            <el-button type="primary" class="ml-4" @click="toExcelClick">导出</el-button>
            <el-button type="primary" class="ml-4" @click="del">删除</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <el-form-item label="信息分类:" prop="infoType" filterable>
              <el-select v-model="data.formData.infoType" clearable>
                <el-option v-for="item in dropList.NSOS_INFO_SUBMISSION_TYPE" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="处理单位:" prop="receiveDept" filterable>
              <el-select v-model="data.formData.receiveDeptArr" multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="4" clearable filterable class="ml-0">
                <el-option v-for="item in dropList.NSOS_ORG_NAME" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-main style="height: calc(100% - 135px);">
      <el-table ref="infoSubmissionTable" :data="data.tableData" border size="small" style="height: 100%"
      stripe :header-cell-style="{ backgroundColor: '#F2F3F5', color: '#666666', fontSize: '14px', height: '40px', textAlign: 'center' }">
        <el-table-column type="index" width="40" label="#" align="center"/>
        <el-table-column type="selection" width="40" align="center"/>
        <el-table-column label="信息编号" width="120" align="center">
          <template #default="scope">
            <span class="primary infoCode" @click="showDetail(scope.row)">{{scope.row.infoCode}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="infoTitle" label="信息标题" width="180" align="center"/>
        <el-table-column prop="infoType" column-key="NSOS_INFO_SUBMISSION_TYPE" :formatter="formatDrop" label="信息类型" width="80" align="center"/>
        <el-table-column prop="infoContent" label="信息内容" align="left"/>
        <el-table-column prop="infoStatus" column-key="NSOS_INFO_SUBMISSION_STATUS" :formatter="formatDrop" label="状态" width="80" align="center"/>
        <el-table-column prop="receiveDept" label="接收单位" width="200" align="center">
          <template #default="scope">
            <div v-for="(item, index) in scope.row.receiveDept?.split(',')" :key="index">
              {{ dropList.NSOS_ORG_NAME.find(i => i.value === item)?.label }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="attachInfo" label="信息附件" width="120" align="center"/>
        <el-table-column prop="releaseDept" column-key="NSOS_ORG_NAME" :formatter="formatDrop" label="发布单位" width="200" align="center"/>
        <el-table-column prop="releaseTime" label="发布时间" :formatter="tDateTimeFormat" width="150" align="center"/>
        <el-table-column prop="releasePeople" label="发布人" width="120" align="center"/>
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
import { onMounted, reactive, ref } from 'vue';
import { ElForm, ElFormItem, ElRow, ElCol, ElTable, ElTableColumn, ElPagination,
         ElMain, ElContainer, ElHeader, ElFooter, ElTabs, ElTabPane, ElMessageBox, ElMessage } from 'element-plus';
import { tDateTimeFormat, formatDrop } from '#/utils/commonUtil.ts';
import { useDropStore } from '#/store';
import { queryData, batchDelete, toExcel } from './infoSubmissionMethod.ts';
import { useUserStore } from '@vben/stores';

const userStore = useUserStore();
const emit = defineEmits(['addSubmission', 'showDetail'])
const infoSubmissionTable = ref()
const data = reactive({
  tableData: [],
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
  const dropType = ['NSOS_INFO_SUBMISSION_TYPE', 'NSOS_INFO_SUBMISSION_STATUS', 'NSOS_ORG_NAME'];
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);
  query();
});

const query = async () => {
  data.formData.pageSize = data.pageInfo.pageSize;
  data.formData.pageNo = data.pageInfo.pageNo;
  const { list, count, pageNo } = await queryData(data.formData);
  data.tableData = list;
  data.pageInfo.pageNo = pageNo;
  data.pageInfo.total = count;
}

const toExcelClick = async () => {
  data.formData.pageSize = data.pageInfo.pageSize
  data.formData.pageNo = data.pageInfo.pageNo
  toExcel(data.formData, '信息报送列表导出excel.xlsx')
}
const addSubmissionClick = () => {
  emit('addSubmission')
}
const handleSizeChange = (val) => {
  data.pageInfo.pageSize = val;
  query();
};
const showDetail = (row) => {
  emit('showDetail', row)
}
const currentChange = (val) => {
  data.pageInfo.pageNo = val;
  query();
};
const del = () => {
  if (infoSubmissionTable.value.getSelectionRows().length === 0) {
    ElMessage.warning('请先选择要删除的报送单');
    return;
  }
  let selectList = infoSubmissionTable.value.getSelectionRows();
  let statusList = selectList.map(data => data.infoStatus);
  if (statusList.some(data => data !== '1')){
    ElMessage.warning('不允许删除非草稿状态工单');
    return;
  }
  let releasePeopleList = selectList.map(data => data.releasePeople);
  if (releasePeopleList.some(data => data != userStore.userInfo.logincode)){
    ElMessage.warning('不允许删除非本人发布工单');
    return;
  }

  ElMessageBox.confirm('确定要删除选中的报送单吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    batchDel();
  }).catch(() => {
    ElMessage.info('已取消删除');
  });
};
const batchDel = async () => {
  try {
    await batchDelete(infoSubmissionTable.value.getSelectionRows())
    query();
    ElMessage.success('删除成功');
  } catch (error) {
    ElMessage.error('删除失败');
  }
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

:deep(.el-main){
  padding: 0;
}

.primary{
  color: hsl(var(--primary));
}

.infoCode{
  cursor: pointer;
}

.infoCode:hover{
  text-decoration: underline;
}
</style>
