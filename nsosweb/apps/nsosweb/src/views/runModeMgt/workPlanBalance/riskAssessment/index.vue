<template>
  <Page auto-content-height>
    <el-container>
      <el-form
        :inline="true"
        :model="queryForm"
        label-position="right"
        style="padding: 16px 20px 0"
      >
        <el-form-item label="作业时间:">
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
        <el-form-item label="作业系统:">
          <el-input
            v-model="queryForm.jobSys"
            style="width: 150px"
            clearable
            maxlength="50"
          />
        </el-form-item>
        <el-form-item label="作业系统IP地址:">
          <el-input
            v-model="queryForm.ipAddress"
            style="width: 150px"
            clearable
            maxlength="50"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :icon="Search" @click="query"
            >查询</el-button
          >
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>

        <el-form-item style="float: right">
          <el-button type="primary" link @click="ruleSetting">
            <el-icon :size="24"> <Setting style="margin-right: 5px" /> </el-icon
            >专家库设置</el-button
          >
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
          <el-table-column prop="ipAddress" label="IP地址" align="center">
          </el-table-column>
          <el-table-column prop="startTime" label="作业开始时间" align="center">
          </el-table-column>
          <el-table-column prop="endTime" label="作业结束时间" align="center">
          </el-table-column>
          <el-table-column
            prop="riskLevel"
            label="作业风险等级"
            align="center"
            width="120"
          >
            <template #default="scope">
              {{ riskLevelMap[scope.row.riskLevel] }}
            </template>
          </el-table-column>
          <el-table-column
            prop="assessmentResult"
            label="作业评估结果"
            align="center"
          >
            <template #default="scope">
              <span v-if="scope.row.assessmentResult == 0" style="color: red"
                >不可以实施安全作业</span
              >
              <span v-else style="color: green">可以实施安全作业</span>
            </template>
          </el-table-column>
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
      :disabled="true"
      @closeDetailPage="closeDetailPage"
    ></job-detail>

    <!-- 规则设置弹框 -->
    <el-dialog v-model="ruleDialogData.visible" title="专家库设置" width="1200">
      <ZJKSetting v-if="ruleDialogData.visible" />
      <!-- <template #footer>
        <div class="dialog-footer">
          <el-button @click="ruleDialogData.visible = false">关闭</el-button>
        </div>
      </template> -->
    </el-dialog>
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
  Aim,
  CircleCheck,
  Setting,
} from '@element-plus/icons-vue';
import { Page } from '@vben/common-ui';
import { ref, reactive, computed, onMounted } from 'vue';
import { getRiskAssessmentPageListApi } from '#/api';
import JobDetail from '../intelligentAllocation/jobDetail.vue';
import ZJKSetting from './zjkSetting.vue';

defineOptions({
  name: 'RiskAssessment',
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
const tableData = ref([]);
const selectedRows = ref([]);
const ruleDialogData = ref({
  visible: false,
  tableData: [],
  fieldsList: [],
  operatorList: [],
});
const queryForm = reactive({
  daterange: '',
  orderNo: '',
  jobSys: '',
  ipAddress: '',
});

/**
 * 查询
 */
const query = async () => {
  try {
    const response = await getRiskAssessmentPageListApi({
      pageNo: currentPage.value,
      pageSize: pageSize.value,
      startTime: queryForm.daterange && queryForm.daterange[0],
      endTime: queryForm.daterange && queryForm.daterange[1],
      systemName: queryForm.jobSys,
      planCode: queryForm.orderNo,
      ipAddress: queryForm.ipAddress,
    });
    tableData.value = response.records;
    total.value = response.total;
  } catch {}
};

/**
 * 专家库设置
 */
const ruleSetting = async () => {
  ruleDialogData.value.visible = true;
};

const reset = () => {
  queryForm.daterange = '';
  queryForm.orderNo = '';
  queryForm.jobSys = '';
  queryForm.ipAddress = '';
  query();
};

const lookJobDetail = (row) => {
  selectOrderNo.value = row.planCode;
  selectOrderId.value = row.id;
  showDetail.value = true;
};

const closeDetailPage = () => {
  showDetail.value = false;
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
</style>
