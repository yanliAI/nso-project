<template>
  <div class="flex" style="width: 100%; height: 100%; flex-direction: column">
    <el-container>
      <el-form
        :inline="true"
        :model="queryForm"
        label-position="right"
        style="padding: 16px 20px 0"
      >
        <el-form-item label="情报来源时间:">
          <el-date-picker
            v-model="queryForm.daterange"
            type="daterange"
            start-placeholder="请选择"
            end-placeholder="请选择"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            @change="handleChangeDate"
            style="width: 260px"
          />
        </el-form-item>
        <el-form-item label="情报名称:">
          <el-input
            v-model="queryForm.intelligenceName"
            style="width: 200px"
            clearable
          />
        </el-form-item>
        <el-form-item label="威胁类型:">
          <el-input
            v-model="queryForm.threatType"
            style="width: 200px"
            clearable
          />
        </el-form-item>
        <el-form-item label="威胁等级：" prop="threatRiskLevel">
          <el-select
            v-model="queryForm.threatRiskLevel"
            clearable
            multiple
            style="width: 200px"
          >
            <el-option label="高危" value="高危"></el-option>
            <el-option label="中危" value="中危"></el-option>
            <el-option label="低危" value="低危"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处置情况：" prop="handlingStatus">
          <el-select
            v-model="queryForm.handlingStatus"
            clearable
            multiple
            style="width: 200px"
          >
            <el-option label="已下令" value="2"></el-option>
            <el-option label="已处置" value="1"></el-option>
            <el-option label="未处置" value="0"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="数据来源:">
          <el-input v-model="queryForm.source" style="width: 150px" clearable />
        </el-form-item> -->

        <el-form-item>
          <el-button type="primary" :icon="Search" @click="query"
            >查询</el-button
          >
          <el-button type="primary" :icon="Plus" @click="addData"
            >新增</el-button
          >
          <el-upload
            ref="uploadRef"
            :action="uploadUrl"
            :headers="headers"
            :on-success="handleSuccess"
            :on-error="handleError"
            :before-upload="beforeUpload"
            name="file"
            :show-file-list="false"
            accept=".xlsx,.xls,.csv"
            class="flex items-center"
            style="margin: 0 10px"
          >
            <template #trigger>
              <el-button type="primary" :icon="Upload">导入</el-button>
            </template>

            <!-- <el-button class="ml-3" type="success" @click="submitUpload">
              导入
            </el-button> -->
          </el-upload>
          <el-button type="primary" :icon="Download" @click="downloadTemplate"
            >下载模板</el-button
          >

          <el-button type="danger" :icon="Delete" @click="deleteData"
            >删除</el-button
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
          <el-table-column
            prop="intelligenceName"
            label="情报名称"
            align="center"
          >
          </el-table-column>
          <!-- <el-table-column prop="source" label="情报来源" align="center">
          </el-table-column> -->
          <!-- <el-table-column
            prop="intelligenceValue"
            label="情报值"
            align="center"
          >
          </el-table-column> -->
          <el-table-column
            prop="threatType"
            label="威胁类型"
            align="center"
            width="120"
          >
            <!-- <template #default="scope">
              {{ riskLevelMap[scope.row.threatType] }}
            </template> -->
          </el-table-column>
          <el-table-column
            prop="threatRiskLevel"
            label="威胁等级"
            align="center"
            width="120"
          >
            <!-- <template #default="scope">
              {{ riskLevelMap[scope.row.threatRiskLevel] }}
            </template> -->
          </el-table-column>
          <!-- <el-table-column
            prop="responseStatus"
            label="响应状态"
            align="center"
          >
          </el-table-column> -->
          <el-table-column
            prop="discoveryDate"
            label="来源时间"
            align="center"
            width="150"
          >
          </el-table-column>
          <el-table-column
            prop="intelligenceContent"
            label="情报内容"
            align="center"
          >
            <template #default="scope">
              <el-tooltip
                effect="light"
                :content="scope.row.intelligenceContent"
                placement="bottom"
                popper-class="custom-tooltip"
              >
                <span class="max-lines">{{
                  scope.row.intelligenceContent
                }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            prop="handlingStatus"
            label="处置情况"
            align="center"
            width="150"
          >
            <template #default="scope">
              {{ handlingStatuslMap[scope.row.handlingStatus] }}
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center" width="200">
            <template #default="{ row, $index }">
              <el-button
                type="primary"
                link
                @click="editDetail(row)"
                v-if="row.handlingStatus == 0"
                >修改
              </el-button>
              <el-button type="primary" link @click="lookJobDetail(row)"
                >详情
              </el-button>
              <el-button
                type="primary"
                link
                @click="handleJudgment(row)"
                v-if="row.handlingStatus == 0"
                >研判
              </el-button>
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

    <!-- 详情弹框 -->
    <el-dialog v-model="showDetail" :title="dialogTitle" width="1200">
      <ThreatDetail
        v-if="showDetail"
        :detailId="selectOrderId"
        :disabled="disabled"
        @closeDialog="closeDetailDialog"
      ></ThreatDetail>
      <!-- <template #footer>
        <div class="dialog-footer">
          <el-button @click="showDetail = false">取消</el-button>
          <el-button type="primary" @click="saveData"
            >保存</el-button
          >
        </div>
      </template> -->
    </el-dialog>

    <!-- 威胁情报信息弹框 -->
    <Modal
      title="威胁情报信息"
      class="custom-modal w-[1100px]"
      :footer="false"
      :closeOnClickModal="true"
      :draggable="false"
      :fullscreenButton="false"
      :closable="false"
      :zIndex="900"
    >
      <template #description>
        <div class="custom-dialog-header">
          <div>
            <el-button
              type="primary"
              @click="issueInstruction(alertId)"
              :disabled="!isAfterDisplayText"
            >
              生成指令
            </el-button>
            <el-button type="primary" @click="misstatement(alertId)">
              已研判
            </el-button>
            <el-button @click="modalApi.close()">关闭</el-button>
          </div>
        </div>
      </template>
      <HandleDialog
        ref="alarmDetailRef"
        :alertId="alertId"
        :openType="dialogData.type"
        @afterDisplayText="isAfterDisplayText = true"
      ></HandleDialog>
    </Modal>

    <ModalB
      title="生成指令"
      class="custom-modal w-[1100px]"
      :footer="false"
      :closeOnClickModal="true"
      :draggable="false"
      :fullscreenButton="false"
      :zIndex="910"
    >
      <CmdDetail
        :cmdFl="'1'"
        :czjyText="`处置建议：\n${alarmDetailRef.czjyText}`"
        @afterAdd="onSubmit($event)"
      ></CmdDetail>
    </ModalB>
  </div>
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
  Delete,
  RefreshLeft,
  Setting,
  Download,
  Upload,
  Plus,
} from '@element-plus/icons-vue';
import { Page } from '@vben/common-ui';
import { ref, reactive, computed, onMounted } from 'vue';
import { useAccessStore, useUserStore } from '@vben/stores';
import { useVbenModal } from '@vben/common-ui';
import {
  getThreatIntelligenceDataApi,
  deleteThreatIntelligenceDataApi,
  changeThreatStatusApi,
} from '#/api';
import { downloadFile } from '#/utils/download.ts';
import ThreatDetail from './threatDetail.vue';
import HandleDialog from './handleDialog.vue';
import CmdDetail from '#/views/runDdMgt/cmdMgt/cmdDetail.vue';

defineOptions({
  name: 'ThreatIntelligence',
});
const alarmDetailRef = ref();
const alertId = ref([]);
const isAfterDisplayText = ref(false);
const dialogData = reactive({
  visible: false,
  type: 0,
});
const cmdDialogData = reactive({
  visible: false,
});
const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
});

const [ModalB, modalApiB] = useVbenModal({
  onCancel() {
    modalApiB.close();
  },
});
const uploadUrl = `${import.meta.env.VITE_NSOSSECURITY}/threatIntelligence/import`;
const accessStore = useAccessStore();
const formatToken = (token) => {
  return token ? `Bearer ${token}` : null;
};
// 请求头
const headers = ref({
  Authorization: formatToken(accessStore.accessToken),
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
const handlingStatuslMap = {
  '0': '未处置',
  '1': '已处置',
  '2': '已下令',
};

// 是否显示详情信息
const showDetail = ref(false);
const dialogTitle = ref('');
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
  intelligenceName: '',
  threatType: '',
  threatRiskLevel: [],
  source: '',
  handlingStatus: [],
});

/**
 * 查询
 */
const query = async () => {
  try {
    const response = await getThreatIntelligenceDataApi({
      pageNo: currentPage.value,
      pageSize: pageSize.value,
      startTime: queryForm.daterange && queryForm.daterange[0],
      endTime: queryForm.daterange && queryForm.daterange[1],
      intelligenceName: queryForm.intelligenceName,
      threatType: queryForm.threatType,
      threatRiskLevel: queryForm.threatRiskLevel,
      source: queryForm.source,
      handlingStatus: queryForm.handlingStatus,
    });
    tableData.value = response.records;
    total.value = response.total;
  } catch {}
};

const reset = () => {
  queryForm.daterange = '';
  queryForm.intelligenceName = '';
  queryForm.threatType = '';
  queryForm.threatRiskLevel = [];
  queryForm.source = '';
  queryForm.handlingStatus = [];
  query();
};

const addData = () => {
  selectOrderId.value = '';
  dialogTitle.value = '新增威胁情报';
  disabled.value = false;
  showDetail.value = true;
};

const lookJobDetail = (row) => {
  selectOrderId.value = row.id;
  dialogTitle.value = '威胁情报详情';
  disabled.value = true;
  showDetail.value = true;
};
const editDetail = (row) => {
  dialogTitle.value = '修改威胁情报';
  selectOrderId.value = row.id;
  disabled.value = false;
  showDetail.value = true;
};

const handleJudgment = (row) => {
  alertId.value = [row.id];
  isAfterDisplayText.value = false;
  // dialogData.visible = true;
  modalApi.open();
  dialogData.type = row.handlingStatus;
};

const issueInstruction = (alertId) => {
  // cmdDialogData.visible = true;
  modalApiB.open();
};

const misstatement = async (id) => {
  ElMessageBox.confirm('是否确认已研判?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    // 修改状态为已处置
    let params = alertId.value.map((item) => {
      return { id: item, status: '1' };
    });
    const result = await changeThreatStatusApi(params);

    if (result) {
      ElMessage.success('已处置');
      // dialogData.visible = false;
      modalApi.close();
      query();
    } else ElMessage.error('研判失败');
  });
};

/**
 * 提交后 修改研判状态并刷新数据
 */
const onSubmit = async (data) => {
  // 发令成功，关闭弹窗
  // cmdDialogData.visible = false;
  modalApiB.close();
  // 修改状态为下令已研判
  let params = alertId.value.map((item) => {
    return { id: item, status: '1', cmdId: data.id };
  });
  try {
    const result = await changeThreatStatusApi(params);
    // dialogData.visible = false;
    modalApi.close();
  } catch {
    return;
  }
  query();
};

const deleteData = async () => {
  if (selectedRows.value.length <= 0) {
    ElMessage.warning('请选择要删除的数据');
    return;
  }
  ElMessageBox.confirm('确定要删除所选数据吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      let ids = selectedRows.value.map((item) => item.id);
      let result = await deleteThreatIntelligenceDataApi(ids);
      if (result) {
        ElMessage.success('删除成功');
        query();
      }
    })
    .catch(() => {});
};

const closeDetailDialog = (data) => {
  showDetail.value = false;
  if (data && data.refresh) {
    query();
  }
};

const downloadTemplate = async () => {
  try {
    await downloadFile(
      import.meta.env.VITE_NSOSSECURITY + '/threatIntelligence/exprotTemplate',
      {},
      '威胁情报导入模板.xlsx',
    );
  } catch {}
};

// 上传前的校验
const beforeUpload = (file) => {
  const isAcceptType = ['xlsx', 'xls', 'csv'].some((ext) =>
    file.name.toLowerCase().endsWith(ext),
  );
  if (!isAcceptType) {
    ElMessage.error('只能上传xlsx/xls/csv文件');
    return false;
  }

  const isLt10M = file.size / 1024 / 1024 < 10;
  if (!isLt10M) {
    ElMessage.error('文件大小不能超过10MB');
    return false;
  }
  return true;
};

// 上传成功处理
const handleSuccess = (response, file) => {
  console.log('response', response);
  if (response.code === 0) {
    ElMessage.success(response.msg || '上传成功');
    // 执行成功后的操作
    query();
  } else {
    ElMessage.error(response.msg || '上传失败');
  }
};

// 上传失败处理
const handleError = (error, file) => {
  ElMessage.error(`上传失败: ${error.message}`);
  console.error('上传错误:', error);
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

.custom-dialog-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
}
</style>
<style>
.custom-tooltip {
  max-width: 500px; /* 设置最大宽度 */
  word-wrap: break-word; /* 强制换行 */
  white-space: normal; /* 允许换行（覆盖默认的 nowrap） */
}
.custom-modal {
  /* background-color: #363f5c; */
  /* color: white; */
  border-width: 0;
  h2 {
    font-size: 18px;
  }

  > div:first-child {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  > div:nth-child(2) {
    padding: 10px 8px;
  }
  > button {
    color: #999;
  }
}
</style>
