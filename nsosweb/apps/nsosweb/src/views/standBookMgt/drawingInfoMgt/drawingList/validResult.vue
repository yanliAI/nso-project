<template>
  <div>
    <el-container>
      <el-form
        ref="queryFormRef"
        :inline="true"
        :model="queryForm"
        label-position="right"
        style="padding: 16px 20px 0"
      >
        <el-form-item label="图纸名称：" prop="drawingName">
          <el-input
            style="width: 180px"
            v-model="queryForm.drawingName"
            clearable
          />
        </el-form-item>
        <el-form-item label="设备名称：" prop="deviceName">
          <el-input
            style="width: 180px"
            v-model="queryForm.deviceName"
            clearable
          />
        </el-form-item>

        <el-form-item label="核查结果：" prop="checkResult">
          <el-select
            v-model="queryForm.checkResult"
            style="width: 180px"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option label="正常" value="0"></el-option>
            <el-option label="异常" value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :icon="Search" @click="query"
            >查询</el-button
          >
          <el-button type="primary" :icon="Download" @click="exportData"
            >导出</el-button
          >
          <el-button type="info" :icon="RefreshLeft" @click="resetQueryForm"
            >重置</el-button
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
          height="500"
        >
          <el-table-column type="index" align="center" />
          <!-- <el-table-column type="selection" /> -->
          <el-table-column prop="drawingName" label="图纸名称" align="center">
          </el-table-column>

          <el-table-column prop="pixelName" label="图元名称" align="center">
          </el-table-column>

          <el-table-column prop="deviceId" label="设备id" align="center">
          </el-table-column>

          <el-table-column prop="deviceName" label="设备名称" align="center">
          </el-table-column>
          <el-table-column prop="checkResult" label="核查结果" align="center">
            <template #default="{ row }">
              <span v-if="row.checkResult == 0" style="color: green">正常</span>
              <span v-else style="color: red">异常</span>
            </template>
          </el-table-column>

          <el-table-column prop="workflowState" label="流程状态" align="center">
            <template #default="{ row }">
              <span v-if="row.workflowState === '0'">无需处置</span>
              <span v-else-if="row.workflowState == 1">待治理</span>
              <span v-else-if="row.workflowState == 2">治理中</span>
              <span v-else-if="row.workflowState == 3">已治理</span>
            </template>
          </el-table-column>

          <el-table-column prop="checkTime" label="核查时间" align="center">
          </el-table-column>

          <el-table-column
            label="质量治理"
            align="center"
            width="180"
            fixed="right"
          >
            <template #default="{ row }">
              <ElButton
                v-if="row.checkResult != 0"
                type="primary"
                link
                @click="approveGovernance(row)"
                >发起</ElButton
              >
              <span v-else>—</span>
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

    <Modal
      class="custom-modal w-[1300px]"
      :title="modalTitle"
      :footer="false"
      :closeOnClickModal="false"
      :draggable="true"
    >
    </Modal>
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
  ElSwitch,
  ElPagination,
  ElContainer,
  ElMain,
  ElFooter,
  ElRow,
  ElCol,
  ElDialog,
  ElMessage,
  ElMessageBox,
  ElLink,
  ElTag,
} from 'element-plus';
import {
  Plus,
  Search,
  Delete,
  Finished,
  RefreshLeft,
  Filter,
  Download,
  Monitor,
  CirclePlus,
  CircleCheck,
} from '@element-plus/icons-vue';
import { Page } from '@vben/common-ui';
import { ref, reactive, computed, onMounted, nextTick } from 'vue';
import { useVbenModal } from '@vben/common-ui';
import { querydrawingValidResultApi, approveDrawingGovernanceApi } from '#/api';
import { downloadFile } from '#/utils/download.ts';

defineOptions({
  name: 'FixedValueMiddleware',
});

const drawingId = defineModel('drawingId');

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
});
const loading = ref(false);

const queryFormRef = ref();
const queryForm = reactive({});

const modalTitle = ref('');

const resetQueryForm = () => {
  queryFormRef.value?.resetFields();
  query();
};
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);
const table = ref(null);
const tableData = ref([]);
const selectedRows = ref([]);

const approveGovernance = async (row) => {
  ElMessageBox.confirm('确定发起治理吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      let result = await approveDrawingGovernanceApi({
        id: row.id,
      });
      ElMessage.success('发起成功！');
      query();
    } catch (error) {}
  });
};

/**
 * 查询
 */
const query = async () => {
  loading.value = true;
  let params = {
    drawingId: drawingId.value,
    pageNo: currentPage.value,
    pageSize: pageSize.value,
    ...queryForm,
  };
  try {
    const result = await querydrawingValidResultApi(params);
    tableData.value = result.records;
    total.value = result.total;
  } catch {}
  loading.value = false;
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

const exportData = async () => {
  try {
    let params = {
      drawingId: drawingId.value,
      pageNo: currentPage.value,
      pageSize: pageSize.value,
      ...queryForm,
    };
    await downloadFile(
      import.meta.env.VITE_NSOSFS + '/ledgerModel/drawingValidResult/export',
      params,
      '图纸质量-核查结果数据.xlsx',
    );
  } catch {}
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
