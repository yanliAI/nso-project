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
          <el-button
            type="primary"
            :icon="Histogram"
            @click="timeRangeDialogData.visible = true"
            >平衡分析</el-button
          >
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>

        <el-form-item style="float: right">
          <el-button type="primary" link @click="ruleSetting">
            <el-icon :size="24"> <Setting style="margin-right: 5px" /> </el-icon
            >规则设置</el-button
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
            prop="status"
            label="审查结果"
            align="center"
            width="120"
          >
            <template #default="scope">
              <!-- <el-tag v-if="scope.row.status == 1" type="success" size="large"
                >已发布<CircleCheck
                  style="width: 1em; display: inline; margin-left: 5px"
              /></el-tag> -->
              <el-button type="success" @click="lookCheckResult(scope.row)"
                >查看</el-button
              >
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
            <!-- <template #default="scope">
              <div v-if="scope.row.preWorkStartTime">
                <el-text tag="del">{{ scope.row.preWorkStartTime }}</el-text>
                <br />
                <el-text style="color: #ff0000">{{
                  scope.row.workStartTime
                }}</el-text>
              </div>
              <span v-else>{{ scope.row.workStartTime }}</span>
            </template> -->
          </el-table-column>
          <el-table-column
            prop="endTime"
            label="申请作业结束时间"
            align="center"
          >
            <!-- <template #default="scope">
              <div v-if="scope.row.preWorkEndTime">
                <el-text tag="del">{{ scope.row.preWorkEndTime }}</el-text>
                <br />
                <el-text style="color: #ff0000">{{
                  scope.row.workEndTime
                }}</el-text>
              </div>
              <span v-else>{{ scope.row.workEndTime }}</span>
            </template> -->
          </el-table-column>
          <el-table-column
            prop="haltStartTime"
            label="申请停机开始时间"
            align="center"
          >
            <!-- <template #default="scope">
              <div v-if="scope.row.preDownStartTime">
                <el-text tag="del">{{ scope.row.preDownStartTime }}</el-text>
                <br />
                <el-text style="color: #ff0000">{{
                  scope.row.downStartTime
                }}</el-text>
              </div>
              <span v-else>{{ scope.row.downStartTime }}</span>
            </template> -->
          </el-table-column>
          <el-table-column
            prop="haltEndTime"
            label="申请停机结束时间"
            align="center"
          >
            <!-- <template #default="scope">
              <div v-if="scope.row.preDownEndTime">
                <el-text tag="del">{{ scope.row.preDownEndTime }}</el-text>
                <br />
                <el-text style="color: #ff0000">{{
                  scope.row.downEndTime
                }}</el-text>
              </div>
              <span v-else>{{ scope.row.downEndTime }}</span>
            </template> -->
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

    <!-- 审查结果弹框 -->
    <el-dialog v-model="dialogData.visible" title="分析结果" width="800">
      <el-table border stripe :data="dialogData.tableData">
        <el-table-column prop="property" label="属性" width="400" />
        <el-table-column prop="value" label="值" />
      </el-table>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogData.visible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 规则设置弹框 -->
    <el-dialog v-model="ruleDialogData.visible" title="规则设置" width="1200">
      <el-table border stripe :data="ruleDialogData.tableData">
        <el-table-column type="index" label="序号" align="center" width="100" />
        <el-table-column prop="rule" label="字段" align="center">
        </el-table-column>
        <el-table-column prop="isUse" label="是否启用" align="center">
          <template #default="scope">
            <el-switch
              v-model="scope.row.isUse"
              active-value="1"
              inactive-value="0"
              class="ml-2"
              style="
                --el-switch-on-color: #13ce66;
                --el-switch-off-color: #ff4949;
              "
            />
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="ruleDialogData.visible = false">关闭</el-button>
          <el-button type="primary" @click="saveRules">保存</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 选择分析范围弹框 -->
    <el-dialog
      v-model="timeRangeDialogData.visible"
      title="时间范围选择"
      width="500"
    >
      <div class="flex" style="justify-content: center">
        <el-radio-group
          v-model="timeRangeDialogData.timeType"
          @change="timeRangeDialogData.timeRange = ''"
        >
          <el-radio value="month" size="large">按月</el-radio>
          <el-radio value="daterange" size="large">自定义时间范围</el-radio>
        </el-radio-group>
      </div>
      <div
        class="flex"
        style="justify-content: center; margin-top: 20px; padding: 0 40px"
      >
        <el-date-picker
          v-model="timeRangeDialogData.timeRange"
          :type="timeRangeDialogData.timeType"
          placeholder="请选择"
          start-placeholder="请选择"
          end-placeholder="请选择"
          :format="
            timeRangeDialogData.timeType == 'month' ? 'YYYY-MM' : 'YYYY-MM-DD'
          "
          :value-format="
            timeRangeDialogData.timeType == 'month' ? 'YYYY-MM' : 'YYYY-MM-DD'
          "
          style="width: 300px"
        />
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="checkData">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 分析结果弹框 -->
    <el-dialog
      v-model="checkingDialogData.visible"
      title="信息校验"
      width="1200"
    >
      <div>
        <h2 v-if="checkingDialogData.totalCount <= 0">
          该范围内没有作业单，无需检测
        </h2>
        <h2 v-else-if="!allClosed">
          共{{ checkingDialogData.totalCount }}单作业正在检测，请稍候...
        </h2>
        <h2 v-else>共{{ checkingDialogData.totalCount }}单作业已检测</h2>
        <br />
        <el-table
          border
          stripe
          :data="checkingDialogData.tableData"
          v-if="checkingDialogData.totalCount > 0"
        >
          <el-table-column prop="rule" label="规则名称" align="center">
            <template #default="scope">
              <span
                ><el-icon class="is-loading" v-if="scope.row.isLoading">
                  <Loading /></el-icon
                >{{ scope.row.rule }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="result" label="校验结果" align="center">
            <template #default="scope">
              <span v-if="scope.row.isLoading">检测中...</span>
              <span
                v-else
                :style="{
                  color: scope.row.result == '通过' ? '#13ce66' : '#ff0000',
                }"
                >{{ scope.row.result }}</span
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="checkingDialogData.visible = false"
            >确定</el-button
          >
        </div>
      </template>
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
  ElTooltip,
} from 'element-plus';
import {
  Search,
  Download,
  Histogram,
  CircleCheck,
  Setting,
  Loading,
} from '@element-plus/icons-vue';
import { Page } from '@vben/common-ui';
import { ref, reactive, computed, onMounted } from 'vue';
import {
  getTaskSchedulePageListApi,
  getScheduleConfigsApi,
  updateScheduleConfigsApi,
  taskScheduleAnalysisApi,
} from '#/api';
import JobDetail from '../intelligentAllocation/jobDetail.vue';
import { downloadFile } from '#/utils/download.ts';

defineOptions({
  name: 'IntelligentReview',
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
const selectCheckResult = ref([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);
const table = ref(null);
const tableData = ref([]);
const selectedRows = ref([]);
const dialogData = ref({
  visible: false,
  tableData: [],
});
const ruleDialogData = ref({
  visible: false,
  tableData: [],
  fieldsList: [],
  operatorList: [],
});
const timeRangeDialogData = ref({
  visible: false,
  timeType: 'month',
  timeRange: '',
});
const checkingDialogData = ref({
  visible: false,
  totalCount: 0,
  tableData: [],
});
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
    const response = await getTaskSchedulePageListApi({
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
      import.meta.env.VITE_NSOSFS + '/taskSchedule/export',
      params,
      '作业计划平衡数据列表.xlsx',
    );
  } catch {}
};

/**
 * 规则设置
 */
const ruleSetting = async () => {
  ruleDialogData.value.visible = true;
  try {
    let result = await getScheduleConfigsApi();
    ruleDialogData.value.tableData = result;
  } catch {}
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
  selectCheckResult.value = row.reviewResultList;
  showDetail.value = true;
};
const checkResultKeyMap = {
  isCompliant: '是否符合预设作业安排',
  affectedInterfaces: '涉及接口',
  impactScope: '作业影响范围',
  constraints: '限制情况',
  riskLevel: '作业等级',
};
const lookCheckResult = (row) => {
  dialogData.value.visible = true;
  if (!row.taskScheduleResult) {
    dialogData.value.tableData = [];
    return;
  }
  dialogData.value.tableData = Object.keys(checkResultKeyMap).map((key) => {
    let value = row.taskScheduleResult[key];
    if (key == 'isCompliant') {
      value = value == 1 ? '是' : '否';
    } else if (key == 'riskLevel') {
      value = riskLevelMap[value];
    }
    return { property: checkResultKeyMap[key], value };
  });
};

const closeDetailPage = () => {
  showDetail.value = false;
};

/**
 * 保存规则
 */
const saveRules = async () => {
  try {
    let result = await updateScheduleConfigsApi(ruleDialogData.value.tableData);
    if (result) {
      ElMessage.success('保存成功');
      ruleDialogData.value.visible = false;
    }
  } catch {}
};

/**
 * 平衡分析
 */
const checkData = async () => {
  if (!timeRangeDialogData.value.timeRange) {
    ElMessage.warning('请选择时间范围');
    return;
  }
  try {
    let params = {};
    if (timeRangeDialogData.value.timeType == 'month') {
      params.yearMonth = timeRangeDialogData.value.timeRange;
    } else {
      params.startTime = timeRangeDialogData.value.timeRange[0];
      params.endTime = timeRangeDialogData.value.timeRange[1];
    }

    let result = await taskScheduleAnalysisApi(params);
    checkingDialogData.value.totalCount = result.count;
    if (checkingDialogData.value.totalCount <= 0) {
      ElMessage.warning('该范围内没有作业单');
      return;
    }
    checkingDialogData.value.tableData = result.list.map((item) => ({
      ...item,
      isLoading: true,
    }));
    checkingDialogData.value.visible = true;
    timeRangeDialogData.value.visible = false;
    closeCheckLoading();
    query();
  } catch {}
};
const allClosed = ref(false);
const closeCheckLoading = () => {
  let index = 0;
  allClosed.value = false;
  const next = () => {
    if (index >= checkingDialogData.value.tableData.length) {
      allClosed.value = true;
      return;
    }
    checkingDialogData.value.tableData[index].isLoading = false;
    index++;
    setTimeout(next, 1000);
  };
  next();
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
