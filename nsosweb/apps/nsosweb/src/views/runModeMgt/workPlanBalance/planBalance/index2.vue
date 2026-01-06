
<template>
  <Page auto-content-height>
    <el-container>
      <el-form
        :inline="true"
        :model="queryForm"
        label-position="right"
        style="padding: 16px 20px 0"
      >
        <el-form-item label="作业系统:">
          <el-input v-model="queryForm.jobSys" style="width: 200px" clearable />
        </el-form-item>
        <el-form-item label="工单编号:">
          <el-input
            v-model="queryForm.orderNo"
            style="width: 270px"
            clearable
          />
        </el-form-item>
        <el-form-item label="作业内容:">
          <el-input v-model="queryForm.jobContent" clearable />
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
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="作业时间:">
          <el-date-picker
            v-model="queryForm.workTime"
            type="daterange"
            placeholder="请选择"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            @change="handleChangeWorkTime"
            style="width: 300px"
          />
        </el-form-item>

        <el-form-item label="停机时间:">
          <el-date-picker
            v-model="queryForm.stopTime"
            type="daterange"
            placeholder="请选择"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            @change="handleChangeStopTime"
            style="width: 300px"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :icon="Search" @click="query"
            >查询</el-button
          >
          <el-button type="primary" :icon="Monitor" @click="publishData"
            >平衡分析</el-button
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
          <!-- <el-table-column type="selection" /> -->
          <el-table-column prop="orderNo" label="工单编号" align="center">
            <template #default="scope">
              <el-link type="primary" @click="lookJobDetail(scope.row)">{{
                scope.row.orderNo
              }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="jobSys" label="作业系统" align="center">
          </el-table-column>
          <el-table-column
            prop="status"
            label="同步状态"
            align="center"
            width="120"
          >
            <template #default="scope">
              <el-tag v-if="scope.row.status == 1" type="success" size="large"
                >已同步<CircleCheck
                  style="width: 1em; display: inline; margin-left: 5px"
              /></el-tag>
              <span v-else></span>
            </template>
          </el-table-column>
          <el-table-column
            prop="jobType"
            label="作业类型"
            align="center"
            width="120"
          ></el-table-column>
          <el-table-column
            prop="jobContent"
            label="作业内容"
            align="center"
          ></el-table-column>
          <el-table-column label="申请作业开始/结束时间" align="center">
            <template #default="scope">
              <el-text>{{ scope.row.workStartTime }}</el-text>
              <br />
              <el-text>{{ scope.row.workEndTime }}</el-text>
            </template>
          </el-table-column>

          <el-table-column label="申请停机开始/结束时间" align="center"
            ><template #default="scope">
              <el-text>{{ scope.row.downStartTime }}</el-text>
              <br />
              <el-text>{{ scope.row.downEndTime }}</el-text>
            </template></el-table-column
          >
          <el-table-column label="是否符合作业窗口规则" align="center"
            ><template #default="scope">
              <span v-if="scope.row.isFhckzygz">是</span>
              <span v-else style="color: #ff0000">否</span>
            </template></el-table-column
          >
          <el-table-column label="是否符合交叉作业规则" align="center"
            ><template #default="scope">
              <span v-if="scope.row.isFhjczygz">是</span>
              <span v-else style="color: #ff0000">否</span>
            </template></el-table-column
          >
          <el-table-column label="是否符合重保规则" align="center"
            ><template #default="scope">
              <span v-if="scope.row.isFhzbgz">是</span>
              <span v-else style="color: #ff0000">否</span>
            </template></el-table-column
          >
          <el-table-column label="是否符合作业数量限制" align="center"
            ><template #default="scope">
              <span v-if="scope.row.isFhzyslxz">是</span>
              <span v-else style="color: #ff0000">否</span>
            </template></el-table-column
          >
          <el-table-column label="操作" align="center"
            ><template #default="scope">
              <el-button type="primary" link>推送至智能分配</el-button><br/>
              <el-button type="primary" link>取消平衡分析</el-button>
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

    <!-- <job-detail
      v-if="showDetail"
      :orderNo="selectOrderNo"
      :closeDetailPage="closeDetailPage"
    ></job-detail> -->
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
} from 'element-plus';
import {
  Search,
  Download,
  Monitor,
  CircleCheck,
} from '@element-plus/icons-vue';
import { Page } from '@vben/common-ui';
import { ref, reactive, computed, onMounted } from 'vue';
import { requestClient } from '#/api/request';

defineOptions({
  name: 'PlanBalance',
});
// 是否显示作业详细
const showDetail = ref(false);
const selectOrderNo = ref('');
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);
const table = ref(null);
const tableData = ref([
  {
    orderNo: 'TPM-00-20240828-00642',
    status: 1,
    workStartTime: '2024-9-23 11:00',
    workEndTime: '2024-9-24 11:00',
    isFhgz: true,
  },
  {
    orderNo: 'TPM-00-20240828-00642',
    status: 0,
    workStartTime: '2024-9-24 11:00',
    isFhgz: false,
  },
]);
const selectedRows = ref([]);
const queryForm = reactive({
  workTime: '',
  stopTime: '',
  orderNo: '',
  jobContent: '',
  isNPCooperation: '',
  jobSys: '',
});

/**
 * 查询
 */
const query = async () => {
  // const response = await requestClient.post(
  //   import.meta.env.VITE_NSOSGZ +
  //     '/odWorkbenchClassTemplate/mHQueryDataListByPagePagination',
  //   {
  //     pageNo: currentPage.value,
  //     pageSize: pageSize.value,
  //"sortFieldName": 'workbenceClassOrder',
  //"sortType": 'asc',
  // workbenceClassName: queryForm.workbenceClassName,
  // provinceCode: queryForm.provinceCode,
  // bureauCode: queryForm.bureauCode,
  //   },
  // );
  // tableData.value = response.list;
  // total.value = response.count;
};

/**
 * 发布数据
 */
const publishData = async () => {
  if (selectedRows.value.length <= 0) {
    ElMessage.warning('请选择需要发布的数据');
    return;
  }
  console.log('发布的数据', selectedRows.value);
};

const reset = () => {
  queryForm.date = '';
  queryForm.orderNo = '';
  queryForm.jobContent = '';
  queryForm.isNPCooperation = '';
  queryForm.jobSys = '';
  query();
};

const lookJobDetail = (row) => {
  console.log('点击了', row.orderNo);
  selectOrderNo.value = row.orderNo;
  showDetail.value = true;
};
const closeDetailPage = () => {
  showDetail.value = false;
};

// 选择日期后的回调
const handleChangeWorkTime = (value) => {
  queryForm.workTime = value;
  query();
};

// 选择日期后的回调
const handleChangeStopTime = (value) => {
  queryForm.stopTime = value;
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
</style>
