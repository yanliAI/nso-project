<template>
  <Page auto-content-height>
    <el-container>
      <el-form
        :inline="true"
        :model="queryForm"
        label-position="right"
        style="padding: 16px 20px 0"
      >
        <el-form-item label="计划时间:">
          <el-date-picker
            v-model="queryForm.daterange"
            type="daterange"
            start-placeholder="请选择"
            end-placeholder="请选择"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            @change="handleChangeDate"
            style="width: 300px"
          />
        </el-form-item>
        <el-form-item label="工单编号:">
          <el-input v-model="queryForm.orderNo" clearable maxlength="50" />
        </el-form-item>
        <el-form-item label="作业内容:">
          <el-input v-model="queryForm.jobContent" clearable maxlength="50" />
        </el-form-item>
        <el-form-item label="是否网省协同:">
          <el-select
            v-model="queryForm.isNPCooperation"
            style="width: 150px"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="作业系统:">
          <el-input
            v-model="queryForm.jobSys"
            style="width: 150px"
            clearable
            maxlength="50"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :icon="Search" @click="query"
            >查询</el-button
          >
          <el-button type="primary" :icon="Download" @click="exportData"
            >导出</el-button
          >
          <el-button type="primary" :icon="Monitor" @click="publishData"
            >发布</el-button
          >
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-main>
        <el-table
          border
          stripe
          ref="table"
          :data="tableData"
          @selection-change="handleSelectionChange"
          style="width: 100%; height: 700px"
        >
          <el-table-column type="index" align="center" />
          <el-table-column type="selection" />
          <el-table-column prop="planCode" label="工单编号" align="center">
            <template #default="scope">
              <el-link
                type="primary"
                :underline="false"
                @click="lookJobDetail(scope.row)"
                >{{ scope.row.planCode }}</el-link
              >
            </template>
          </el-table-column>
          <el-table-column prop="systemName" label="作业系统" align="center">
          </el-table-column>
          <el-table-column
            prop="syncStatus"
            label="同步状态"
            align="center"
            width="120"
          >
            <template #default="scope">
              <el-tag
                v-if="scope.row.syncStatus == 1"
                type="success"
                size="large"
                >已同步<CircleCheck
                  style="width: 1em; display: inline; margin-left: 5px"
              /></el-tag>
              <span v-else>未同步</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="workType"
            label="作业类型"
            align="center"
            width="120"
          >
            <template #default="scope">
              {{ workTypeMap[scope.row.workType] }}
            </template>
          </el-table-column>
          <el-table-column prop="workTasks" label="作业内容" align="center">
            <template #default="scope">
              <el-tooltip
                effect="light"
                :content="scope.row.workTasks"
                placement="bottom"
                popper-class="custom-tooltip"
              >
                <span class="max-lines">{{ scope.row.workTasks }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            prop="startTime"
            label="申请作业开始时间"
            align="center"
          >
            <template #default="scope">
              <div v-if="scope.row.adjustStartTime">
                <el-text tag="del">{{ scope.row.startTime }}</el-text>
                <br />
                <el-text style="color: #ff0000">{{
                  scope.row.adjustStartTime
                }}</el-text>
              </div>
              <span v-else>{{ scope.row.startTime }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="endTime"
            label="申请作业结束时间"
            align="center"
          >
            <template #default="scope">
              <div v-if="scope.row.adjustEndTime">
                <el-text tag="del">{{ scope.row.endTime }}</el-text>
                <br />
                <el-text style="color: #ff0000">{{
                  scope.row.adjustEndTime
                }}</el-text>
              </div>
              <span v-else>{{ scope.row.endTime }}</span>
            </template></el-table-column
          >
          <el-table-column
            prop="haltStartTime"
            label="申请停机开始时间"
            align="center"
            ><template #default="scope">
              <div v-if="scope.row.adjustHaltStartTime">
                <el-text tag="del">{{ scope.row.haltStartTime }}</el-text>
                <br />
                <el-text style="color: #ff0000">{{
                  scope.row.adjustHaltStartTime
                }}</el-text>
              </div>
              <span v-else>{{ scope.row.haltStartTime }}</span>
            </template></el-table-column
          >
          <el-table-column
            prop="haltEndTime"
            label="申请停机结束时间"
            align="center"
            ><template #default="scope">
              <div v-if="scope.row.adjustHaltEndTime">
                <el-text tag="del">{{ scope.row.haltEndTime }}</el-text>
                <br />
                <el-text style="color: #ff0000">{{
                  scope.row.adjustHaltEndTime
                }}</el-text>
              </div>
              <span v-else>{{ scope.row.haltEndTime }}</span>
            </template></el-table-column
          >
        </el-table>
      </el-main>
      <el-footer>
        <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
          :page-sizes="[20, 50, 100, 200]"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </el-footer>
    </el-container>

    <job-detail
      v-if="showDetail"
      :orderNo="selectOrderNo"
      :orderId="selectOrderId"
      @closeDetailPage="closeDetailPage"
    ></job-detail>
  </Page>
</template>

<script lang="ts" setup>
import {
  ElTable,
  ElTableColumn,
  ElFormItem,
  ElForm,
  ElInput,
  ElButton,
  ElSelect,
  ElOption,
  ElPagination,
  ElContainer,
  ElHeader,
  ElMain,
  ElFooter,
  ElDialog,
  ElMessage,
  ElMessageBox,
  ElText,
  ElLink,
  ElTag,
  ElTooltip,
} from 'element-plus';
import {
  Search,
  Download,
  Monitor,
  CircleCheck,
} from '@element-plus/icons-vue';
import { Page } from '@vben/common-ui';
import { ref, reactive, computed, onMounted } from 'vue';
import { taskBalancepageListApi, publishTaskBalanceApi } from '#/api';
import JobDetail from './jobDetail.vue';
import { downloadFile } from '#/utils/download.ts';

defineOptions({
  name: 'BalanceMgt',
});
const workTypeMap = {
  '1': '紧急作业',
  '2': '临时作业',
  '3': '计划作业',
};
const riskLevelMap = {
  '0': '低',
  '1': '中',
  '2': '高',
};
// 是否显示作业详细
const showDetail = ref(false);
const selectOrderNo = ref('');
const selectOrderId = ref('');
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);
const table = ref(null);
const tableData = ref([
  {
    planCode: 'TPM-00-20240828-00642',
    status: 1,
    preWorkStartTime: '2024-9-23 11:00',
    workStartTime: '2024-9-24 11:00',
  },
  {
    planCode: 'TPM-00-20240828-00642',
    status: 0,
    workStartTime: '2024-9-24 11:00',
  },
]);
const selectedRows = ref([]);
const queryForm = reactive({
  daterange: '',
  orderNo: '',
  jobContent: '',
  isNPCooperation: '',
  jobSys: '',
});

/**
 * 查询
 */
const query = async () => {
  try {
    const response = await taskBalancepageListApi({
      pageNo: currentPage.value,
      pageSize: pageSize.value,
      startTime: queryForm.daterange && queryForm.daterange[0],
      endTime: queryForm.daterange && queryForm.daterange[1],
      isProvinceCollaboration: queryForm.isNPCooperation,
      systemName: queryForm.jobSys,
      planCode: queryForm.orderNo,
      workTasks: queryForm.jobContent,
    });
    tableData.value = response.records;
    total.value = response.total;
  } catch {}
};

/**
 * 导出数据
 */
const exportData = async () => {
  // if (selectedRows.value.length <= 0) {
  //   ElMessage.warning('请选择需要导出的数据');
  //   return;
  // }
  let params = {
    pageNo: currentPage.value,
    pageSize: pageSize.value,
    startTime: queryForm.daterange && queryForm.daterange[0],
    endTime: queryForm.daterange && queryForm.daterange[1],
    isProvinceCollaboration: queryForm.isNPCooperation,
    systemName: queryForm.jobSys,
    planCode: queryForm.orderNo,
    workTasks: queryForm.jobContent,
  };

  try {
    await downloadFile(
      import.meta.env.VITE_NSOSFS + '/taskBalance/export',
      params,
      '作业均衡管理数据列表.xlsx',
    );
  } catch {}
};
/**
 * 发布数据
 */
const publishData = async () => {
  if (selectedRows.value.length <= 0) {
    ElMessage.warning('请选择需要发布的数据');
    return;
  }
  ElMessageBox.confirm('确定要发布已选中的作业吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      let ids = selectedRows.value.map((item) => item.id);
      try {
        let result = await publishTaskBalanceApi(ids);
        if (result) {
          ElMessage.success('发布成功');
          query();
        }
      } catch {}
    })
    .catch(() => {});
};

const reset = () => {
  queryForm.daterange = '';
  queryForm.orderNo = '';
  queryForm.jobContent = '';
  queryForm.isNPCooperation = '';
  queryForm.jobSys = '';
  query();
};

const lookJobDetail = (row) => {
  selectOrderNo.value = row.planCode;
  selectOrderId.value = row.id;
  showDetail.value = true;
};
const closeDetailPage = (data) => {
  showDetail.value = false;
  if (data && data.refresh) {
    query();
  }
};

// 选择日期后的回调
const handleChangeDate = (value) => {
  query();
};

const handleSelectionChange = (val) => {
  selectedRows.value = val;
};

const handleSizeChange = (size: number) => {
  pageSize.value = size;
  query();
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  query();
};

onMounted(() => {
  query();
});
</script>

<style scoped>
.el-main {
  padding-top: 0;
}
.cell {
  text-align: center;
}
.max-lines {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /* 限制显示行数 */
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
