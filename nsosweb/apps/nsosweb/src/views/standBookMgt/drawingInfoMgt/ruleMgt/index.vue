<template>
  <Page auto-content-height>
    <el-container>
      <el-form
        ref="queryFormRef"
        :inline="true"
        :model="queryForm"
        label-position="right"
        style="padding: 16px 20px 0"
      >
        <el-form-item label="规则编号：" prop="ruleCode">
          <el-input
            style="width: 180px"
            v-model="queryForm.ruleCode"
            clearable
          />
        </el-form-item>
        <el-form-item label="规则名称：" prop="ruleName">
          <el-input
            style="width: 180px"
            v-model="queryForm.ruleName"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="query"
            >查询</el-button
          >
          <el-button type="primary" :icon="Plus" @click="addRule"
            >新增</el-button
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
          height="720"
        >
          <el-table-column type="index" align="center" />
          <!-- <el-table-column type="selection" /> -->
          <el-table-column prop="ruleCode" label="规则编号" align="center">
          </el-table-column>

          <el-table-column prop="ruleName" label="规则名称" align="center">
          </el-table-column>

          <el-table-column prop="ruleDesc" label="规则说明" align="center">
          </el-table-column>

          <el-table-column prop="createTime" label="创建时间" align="center">
          </el-table-column>
          <el-table-column prop="creatorId" label="创建人" align="center">
          </el-table-column>

          <el-table-column
            label="操作"
            align="center"
            width="180"
            fixed="right"
          >
            <template #default="{ row }">
              <ElButton type="primary" link @click="lookSystemDetail(row)"
                >查看</ElButton
              >
              <ElButton type="primary" link @click="editData(row)"
                >编辑</ElButton
              >
              <ElButton type="danger" link @click="deleteData(row)"
                >删除</ElButton
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

    <Modal
      class="custom-modal w-[1300px]"
      :title="modalTitle"
      :footer="false"
      :closeOnClickModal="false"
      :draggable="true"
    >
      <el-form
        ref="modalFormRef"
        :inline="true"
        :model="modalFormData"
        :rules="rules"
        label-position="right"
        label-width="auto"
        :disabled="disabledValue"
        style="padding: 16px 0 0"
      >
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="规则编号：" prop="ruleCode">
              <el-input
                v-model="modalFormData.ruleCode"
                clearable
                style="width: 100%"
                disabled
              />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="创建时间：" prop="createTime">
              <el-input
                v-model="modalFormData.createTime"
                clearable
                style="width: 100%"
                disabled
              />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="创建人：" prop="creatorId">
              <el-input
                v-model="modalFormData.creatorId"
                clearable
                style="width: 100%"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="规则名称：" prop="ruleName">
              <el-input
                v-model="modalFormData.ruleName"
                clearable
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="规则说明：" prop="ruleDesc">
              <el-input
                v-model="modalFormData.ruleDesc"
                clearable
                style="width: 100%"
                type="textarea"
                :rows="3"
                maxlength="500"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div class="my-10 flex" style="justify-content: center">
        <ElButton @click="modalApi.close()">关闭</ElButton>
        <ElButton v-if="!disabledValue" type="primary" @click="saveData('')"
          >保存</ElButton
        >
      </div>
    </Modal>
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
import {
  queryDrawingInfoRuleListApi,
  saveDrawingInfoRuleListApi,
  deleteDrawingInfoRuleListApi,
} from '#/api';
import { downloadFile } from '#/utils/download.ts';

defineOptions({
  name: 'DrawingInfoRuleMgt',
});

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
});
const loading = ref(false);

const queryFormRef = ref();
const queryForm = reactive({});

const modalTitle = ref('');
const disabledValue = ref(true);
const modalFormRef = ref();
const modalFormData = ref({});

const rules = reactive({
  ruleName: [{ required: true, message: '请输入规则名称' }],
  ruleDesc: [{ required: true, message: '请输入规则说明' }],
});

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

const addRule = () => {
  modalFormData.value = {};
  modalTitle.value = '新增规则';
  disabledValue.value = false;
  modalApi.open();
};

const lookSystemDetail = async (row) => {
  modalTitle.value = '规则详情';
  disabledValue.value = true;
  modalApi.open();
  modalFormData.value = { ...row };
};

const editData = async (row) => {
  modalTitle.value = '规则修改';
  disabledValue.value = false;
  modalApi.open();
  modalFormData.value = { ...row };
};

const saveData = async (row) => {
  if (!modalFormRef.value) {
    return;
  }
  modalFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      let params = { ...modalFormData.value };
      try {
        let result = await saveDrawingInfoRuleListApi(params);
        if (result) {
          ElMessage.success('保存成功！');
          modalApi.close();
          query();
        } else {
          ElMessage.error('保存失败');
        }
      } catch (error) {}
    } else {
      ElMessage.warning('请输入必填项！');
    }
  });
};

const deleteData = (row) => {
  ElMessageBox.confirm('确定要删除这条数据吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        let result = await deleteDrawingInfoRuleListApi([row.id]);
        if (result) {
          ElMessage.success('删除成功！');
          query();
        } else {
          ElMessage.error('删除失败');
        }
      } catch (error) {}
    })
    .catch(() => {
      // ElMessage.info('已取消删除');
    });
};
/**
 * 查询
 */
const query = async () => {
  loading.value = true;
  let params = {
    pageNo: currentPage.value,
    pageSize: pageSize.value,
    ...queryForm,
  };
  try {
    const result = await queryDrawingInfoRuleListApi(params);
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
      pageNo: currentPage.value,
      pageSize: pageSize.value,
      ...queryForm,
    };
    await downloadFile(
      import.meta.env.VITE_NSOSFS + '/fixedManage/rule/export',
      params,
      '定值规则管理-规则库数据.xlsx',
    );
  } catch {}
};

onMounted(() => {
  query();
});
</script>

<style scoped>
.custom-modal {
  .el-row {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
  .el-form-item {
    width: 100%;
    margin-right: 0;
  }
}

.el-main {
  padding-top: 0;
}
.cell {
  text-align: center;
}
</style>
