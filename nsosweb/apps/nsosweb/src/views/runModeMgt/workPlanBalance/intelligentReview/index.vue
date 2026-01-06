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
          <el-input v-model="queryForm.jobContent" clearable maxlength="100" />
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
          <el-button type="primary" :icon="Aim" @click="checkData"
            >审查</el-button
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
      :checkResult="selectCheckResult"
      :disabled="true"
      @closeDetailPage="closeDetailPage"
    ></job-detail>

    <!-- 审查结果弹框 -->
    <el-dialog v-model="dialogData.visible" title="审查结果" width="1100">
      <el-table border stripe :data="dialogData.tableData">
        <el-table-column type="index" label="序号" align="center" width="100" />
        <el-table-column
          prop="checkItem"
          label="审查内容"
          align="center"
        ></el-table-column>
        <el-table-column prop="checkResult" label="审查结论" align="center">
          <template #default="scope">
            <span
              style="color: #ff0000"
              v-if="scope.row.checkResult == '不通过'"
              >不通过</span
            >
            <span v-else>通过</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="errorReason"
          label="审查结果"
          align="center"
        ></el-table-column>
      </el-table>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogData.visible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 规则设置弹框 -->
    <el-dialog v-model="ruleDialogData.visible" title="规则设置" width="1200">
      <el-table
        border
        stripe
        :data="ruleDialogData.tableData"
        @selection-change="handleRuleSelectionChange"
      >
        <el-table-column type="selection" align="center" />
        <el-table-column type="index" label="序号" align="center" width="100" />

        <el-table-column prop="isEnabled" label="是否启用" align="center">
          <template #default="scope">
            <el-switch
              v-model="scope.row.isEnabled"
              class="ml-2"
              style="
                --el-switch-on-color: #13ce66;
                --el-switch-off-color: #ff4949;
              "
            />
          </template>
        </el-table-column>
        <el-table-column prop="checkType" label="审查类型" align="center">
          <template #default="scope">
            <span v-if="scope.row.checkType == 'fieldCheck'">字段审查</span>
            <span v-else>内容审查</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="checkItem"
          label="审查项"
          align="center"
          width="200"
        >
          <template #default="scope">
            <el-input
              v-model="scope.row.checkItem"
              :disabled="scope.row.checkType !== 'fieldCheck'"
              maxlength="50"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="fieldName"
          label="字段名称"
          align="center"
          width="200"
        >
          <template #default="scope">
            <el-select
              v-if="scope.row.checkType == 'fieldCheck'"
              v-model="scope.row.fieldName"
              style="width: 150px"
              placeholder="请选择"
              clearable
              filterable
              @change="($event) => onFieldNameChange($event, scope.$index)"
            >
              <el-option
                v-for="item in ruleDialogData.fieldsList"
                :key="item.chineseName"
                :label="item.chineseName"
                :value="item.chineseName"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="field" label="字段" align="center">
        </el-table-column>

        <el-table-column
          prop="operatRelate"
          label="运算关系"
          align="center"
          width="130"
        >
          <template #default="scope">
            <el-select
              v-if="scope.row.checkType == 'fieldCheck'"
              v-model="scope.row.operatRelate"
              style="width: 100px"
              placeholder="请选择"
              clearable
              filterable
            >
              <el-option
                v-for="item in ruleDialogData.operatorList"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="value" label="值" align="center" width="150">
          <template #default="scope">
            <el-input
              v-if="scope.row.checkType == 'fieldCheck'"
              v-model="scope.row.value"
              maxlength="20"
            ></el-input>
          </template>
        </el-table-column>

        <el-table-column label="删除" align="center">
          <template #default="scope">
            <el-button link type="danger" @click="deleteRule(scope.$index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="ruleDialogData.visible = false">关闭</el-button>
          <el-button type="primary" @click="addRule">添加</el-button>
          <el-button type="primary" @click="saveRules">保存</el-button>
          <el-button type="primary" @click="validateRules">校验逻辑</el-button>
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
  Aim,
  CircleCheck,
  Setting,
} from '@element-plus/icons-vue';
import { Page } from '@vben/common-ui';
import { ref, reactive, computed, onMounted } from 'vue';
import {
  getTaskCheckPageListApi,
  getTaskCheckRulesApi,
  getTaskCheckFieldsApi,
  getTaskCheckOperatorApi,
  taskCheckValidateApi,
  saveTaskCheckRulesApi,
  taskCheckExecuteApi,
} from '#/api';
import JobDetail from './jobDetail.vue';
import { downloadFile } from '#/utils/download.ts';

defineOptions({
  name: 'IntelligentReview',
});
const workTypeMap = {
  '1': '紧急作业',
  '2': '临时作业',
  '3': '计划作业',
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
  selectedRows: [],
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
    const response = await getTaskCheckPageListApi({
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
      import.meta.env.VITE_NSOSFS + '/taskCheck/export',
      params,
      '作业智能审查数据列表.xlsx',
    );
  } catch {}
};

/**
 * 规则设置
 */
const ruleSetting = async () => {
  ruleDialogData.value.visible = true;
  try {
    let result = await getTaskCheckRulesApi();
    ruleDialogData.value.tableData = result.rules;

    ruleDialogData.value.fieldsList = await getTaskCheckFieldsApi();
    ruleDialogData.value.operatorList = await getTaskCheckOperatorApi();
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

const lookCheckResult = (row) => {
  dialogData.value.visible = true;
  dialogData.value.tableData = row.reviewResultList;
};

const closeDetailPage = () => {
  showDetail.value = false;
};

/**
 * 字段名称切换事件监听
 */
const onFieldNameChange = (value, index) => {
  if (!value) {
    ruleDialogData.value.tableData[index].field = '';
    return;
  }
  let fieldItem = ruleDialogData.value.fieldsList.filter(
    (item) => item.chineseName === value,
  )[0];
  ruleDialogData.value.tableData[index].field = fieldItem?.fieldName;
};

/**
 * 添加规则
 */
const addRule = () => {
  ruleDialogData.value.tableData.push({
    isEnabled: true,
    checkType: 'fieldCheck',
  });
};

/**
 * 删除规则
 */
const deleteRule = (index) => {
  ElMessageBox.confirm('确定要删除此规则吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      ruleDialogData.value.tableData.splice(index, 1);
    })
    .catch(() => {});
};

const validateRules = async () => {
  if (
    !ruleDialogData.value.selectedRows ||
    ruleDialogData.value.selectedRows.length <= 0
  ) {
    ElMessage.warning('请选择需要校验的规则');
    return;
  }
  try {
    let result = await taskCheckValidateApi(
      JSON.stringify(ruleDialogData.value.selectedRows),
    );
    if (result) {
      ElMessage.success('校验成功: 规则合理！');
    }
  } catch {}
};

/**
 * 保存规则
 */
const saveRules = async () => {
  try {
    let result = await saveTaskCheckRulesApi({
      id: 1,
      rules: ruleDialogData.value.tableData,
    });
    if (result) {
      ElMessage.success('保存成功');
      ruleDialogData.value.visible = false;
    }
  } catch {}
};

/**
 * 审查
 */
const checkData = async () => {
  if (selectedRows.value.length <= 0) {
    ElMessage.warning('请选择需要审查的数据');
    return;
  }
  try {
    let result = await taskCheckExecuteApi(
      selectedRows.value.map((item) => item.id),
    );
    ElMessage.success('审查成功');
    query();
  } catch {}
};

// 选择日期后的回调
const handleChangeDate = (value) => {
  query();
};

const handleSelectionChange = (val) => {
  selectedRows.value = val;
};

const handleRuleSelectionChange = (val) => {
  ruleDialogData.value.selectedRows = val;
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
