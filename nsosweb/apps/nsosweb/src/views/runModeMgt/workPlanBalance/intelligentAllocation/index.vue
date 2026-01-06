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
          <el-button type="primary" :icon="Plus" @click="addData"
            >新增</el-button
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
                @click="lookJobDetail(scope.row, 1)"
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
            prop="isProvinceCollaboration"
            label="是否网省协同"
            align="center"
          >
            <template #default="scope">
              <span v-if="scope.row.isProvinceCollaboration == 1">是</span>
              <span v-else-if="scope.row.isProvinceCollaboration == 2">否</span>
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

          <el-table-column label="操作" prop="operation" align="center">
            <template #default="{ row, $index }">
              <el-button type="primary" link @click="lookJobDetail(row, 0)"
                >查看详情</el-button
              >
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
      :disabled="disabled"
      @closeDetailPage="closeDetailPage"
    ></job-detail>

    <!-- 规则设置弹框 -->
    <el-dialog v-model="ruleDialogData.visible" title="规则设置" width="1400">
      <el-tabs v-model="ruleDialogData.activeTab" type="card" class="my-tabs">
        <el-tab-pane label="作业量" name="tab-workload">
          <el-button
            type="primary"
            :icon="Plus"
            class="mb-2"
            @click="addWorkloadRule"
            >添加</el-button
          >
          <el-table border stripe :data="ruleDialogData.workloadRuleList">
            <el-table-column
              type="index"
              label="序号"
              align="center"
              width="100"
            />
            <el-table-column prop="category" label="类别" align="center">
              <template #default="{ row, $index }">
                <el-input
                  v-if="row.editable"
                  v-model="row.category"
                  clearable
                  maxlength="50"
                ></el-input>
                <span v-else>{{ row.category }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="limitValue" label="值" align="center">
              <template #default="{ row, $index }">
                <el-input
                  v-if="row.editable"
                  v-model="row.limitValue"
                  @input="($event) => handleInput($event, $index, 'limitValue')"
                  maxlength="8"
                  clearable
                ></el-input>
                <span v-else>{{ row.limitValue }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="说明" align="center">
              <template #default="{ row, $index }">
                <el-input
                  v-if="row.editable"
                  v-model="row.description"
                  clearable
                  maxlength="100"
                ></el-input>
                <span v-else>{{ row.description }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template #default="{ row, $index }">
                <el-button
                  type="danger"
                  link
                  @click="deleteWorkloadRule($index)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="流程分发矩阵" name="tab-dispatch">
          <el-button
            type="primary"
            :icon="Plus"
            class="mb-2"
            @click="addDispatchRule"
            >添加</el-button
          >
          <el-table border stripe :data="ruleDialogData.dispatchMatrixRuleList">
            <el-table-column type="index" label="序号" align="center" />
            <el-table-column
              prop="objectType"
              label="作业对象类型"
              align="center"
              width="120"
            >
              <template #default="{ row, $index }">
                <el-input
                  v-if="row.editable"
                  v-model="row.objectType"
                  clearable
                  maxlength="50"
                ></el-input>
                <span v-else>{{ row.objectType }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="department"
              label="分部"
              align="center"
              width="120"
            >
              <template #default="{ row, $index }">
                <el-input
                  v-if="row.editable"
                  v-model="row.department"
                  clearable
                  maxlength="50"
                ></el-input>
                <span v-else>{{ row.department }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-for="(item, i) in ruleDialogData.dispatColumns"
              :key="i"
              :prop="item.prop"
              :label="item.label"
              align="center"
            >
              <template #default="scope">
                <el-switch
                  v-if="scope.row.editable"
                  v-model="scope.row[item.prop]"
                  :active-value="true"
                  :inactive-value="false"
                  style="
                    --el-switch-on-color: #13ce66;
                    --el-switch-off-color: #ff4949;
                  "
                />
                <el-icon v-else-if="scope.row[item.prop]"><Select /></el-icon>
                <el-icon v-else><SemiSelect /></el-icon>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template #default="{ row, $index }">
                <el-button
                  type="danger"
                  link
                  @click="deleteDispatchRule($index)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="ruleDialogData.visible = false">关闭</el-button>
          <el-button type="primary" @click="saveRules">保存</el-button>
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
  ElTabs,
  ElTabPane,
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
  Plus,
  CircleCheck,
  Setting,
  Select,
  SemiSelect,
} from '@element-plus/icons-vue';
import { Page } from '@vben/common-ui';
import { ref, reactive, computed, onMounted } from 'vue';
import {
  getTaskDistributeListApi,
  getTaskDistributeRuleApi,
  saveTaskDistributeRuleApi,
} from '#/api';
import JobDetail from './jobDetail.vue';
import { downloadFile } from '#/utils/download.ts';

defineOptions({
  name: 'IntelligentAllocation',
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
const disabled = ref(false);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);
const table = ref(null);
const tableData = ref([]);
const selectedRows = ref([]);
const queryForm = reactive({
  daterange: '',
  orderNo: '',
  jobContent: '',
  isNPCooperation: '',
  jobSys: '',
});

const ruleDialogData = ref({
  visible: false,
  activeTab: 'tab-workload',
  workloadRuleList: [],
  dispatchMatrixRuleList: [],
  dispatColumns: [
    { prop: 'securityHardening', label: '安全加固' },
    { prop: 'installationDeployment', label: '安装部署' },
    { prop: 'versionRelease', label: '版本发布' },
    { prop: 'parameterTuning', label: '参数调优' },
    { prop: 'policyEdit', label: '策略编辑' },
    { prop: 'routineMaintenance', label: '例行维护' },
    { prop: 'equipmentRack', label: '设备上下架' },
    { prop: 'equipmentRetirement', label: '设备退运' },
    { prop: 'equipmentDefect', label: '设备消缺' },
    { prop: 'experimentTest', label: '实验检测' },
    { prop: 'inspection', label: '巡视定检' },
    { prop: 'resourceOptimization', label: '资源优化' },
  ],
});

/**
 * 查询
 */
const query = async () => {
  try {
    const response = await getTaskDistributeListApi({
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
      import.meta.env.VITE_NSOSFS + '/taskDistribute/export',
      params,
      '作业智能分配数据列表.xlsx',
    );
  } catch {}
};
/**
 * 新增
 */
const addData = async () => {
  selectOrderNo.value = '';
  selectOrderId.value = '';
  disabled.value = false;
  showDetail.value = true;
};

const reset = () => {
  queryForm.daterange = '';
  queryForm.orderNo = '';
  queryForm.jobContent = '';
  queryForm.isNPCooperation = '';
  queryForm.jobSys = '';
  query();
};

const lookJobDetail = (row, type) => {
  selectOrderNo.value = row.planCode;
  selectOrderId.value = row.id;
  disabled.value = type == 0;
  showDetail.value = true;
};
const closeDetailPage = (data) => {
  showDetail.value = false;
  if (data && data.refresh) {
    query();
  }
};
const deleteWorkloadRule = (index) => {
  try {
    ruleDialogData.value.workloadRuleList.splice(index, 1);
  } catch {}
};

const addWorkloadRule = () => {
  try {
    ruleDialogData.value.workloadRuleList.push({
      editable: true,
    });
  } catch {}
};

const deleteDispatchRule = (index) => {
  try {
    ruleDialogData.value.dispatchMatrixRuleList.splice(index, 1);
  } catch {}
};

const addDispatchRule = () => {
  try {
    ruleDialogData.value.dispatchMatrixRuleList.push({
      editable: true,
    });
  } catch {}
};

/**
 * 保存规则
 */
const saveRules = async () => {
  let params = {
    dispatchMatrixRuleList: ruleDialogData.value.dispatchMatrixRuleList,
    workloadRuleList: ruleDialogData.value.workloadRuleList,
  };
  try {
    let result = await saveTaskDistributeRuleApi(params);
    if (result) {
      ElMessage.success('保存成功');
      ruleDialogData.value.visible = false;
    }
  } catch {}
};
/**
 * 规则设置
 */
const ruleSetting = async () => {
  ruleDialogData.value.visible = true;
  try {
    let result = await getTaskDistributeRuleApi();
    ruleDialogData.value.workloadRuleList = result.workloadRuleList;
    ruleDialogData.value.dispatchMatrixRuleList = result.dispatchMatrixRuleList;
  } catch {}
};

const handleInput = (value, index, key) => {
  // 实时过滤非数字字符
  try {
    ruleDialogData.value.workloadRuleList[index][key] = value.replace(
      /[^\d]/g,
      '',
    );
  } catch {}
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
