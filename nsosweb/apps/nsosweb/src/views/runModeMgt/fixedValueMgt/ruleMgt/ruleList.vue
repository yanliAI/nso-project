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
        <el-form-item label="所属单位：" prop="unitName">
          <el-input
            style="width: 180px"
            v-model="queryForm.unitName"
            clearable
            maxlength="50"
          />
        </el-form-item>
        <el-form-item label="对象名称：" prop="objectName">
          <el-input
            style="width: 180px"
            v-model="queryForm.objectName"
            clearable
            maxlength="50"
          />
        </el-form-item>
        <el-form-item label="IP地址：" prop="ipAddress">
          <el-input
            style="width: 180px"
            v-model="queryForm.ipAddress"
            clearable
            maxlength="50"
          />
        </el-form-item>

        <el-form-item label="资源类型：" prop="resourceType">
          <el-select
            v-model="queryForm.resourceType"
            style="width: 180px"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option label="数据库" value="1"></el-option>
            <el-option label="中间件" value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :icon="Search" @click="query"
            >查询</el-button
          >
          <el-button type="primary" :icon="Plus" @click="addRule"
            >新增</el-button
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
          height="620"
        >
          <el-table-column type="index" align="center" />
          <!-- <el-table-column type="selection" /> -->
          <el-table-column prop="unitName" label="所属单位" align="center">
          </el-table-column>

          <el-table-column prop="objectName" label="对象名称" align="center">
          </el-table-column>

          <el-table-column prop="resourceType" label="资源类型" align="center">
            <template #default="scope">
              {{ resourceTypeMap[scope.row.resourceType] }}
            </template>
          </el-table-column>

          <el-table-column prop="ipAddress" label="IP地址" align="center">
          </el-table-column>
          <el-table-column prop="updaterId" label="修改人" align="center">
          </el-table-column>
          <el-table-column prop="dbArch" label="时间段" align="center">
            <template #default="{ row }">
              {{ row.startTime }}~{{ row.endTime }}
            </template>
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
            <el-form-item label="所属单位：" prop="unitName">
              <el-input
                v-model="modalFormData.unitName"
                clearable
                style="width: 100%"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="对象名称：" prop="objectName">
              <el-input
                v-model="modalFormData.objectName"
                clearable
                style="width: 100%"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资源类型：" prop="resourceType">
              <el-select
                v-model="modalFormData.resourceType"
                placeholder="请选择"
                clearable
                filterable
                style="width: 100%"
              >
                <el-option
                  v-for="item in Object.keys(resourceTypeMap)"
                  :key="item"
                  :label="resourceTypeMap[item]"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="ip地址：" prop="ipAddress">
              <el-input
                v-model="modalFormData.ipAddress"
                clearable
                maxlength="50"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="时间段：" prop="timeRange">
              <el-time-picker
                v-model="modalFormData.timeRange"
                is-range
                range-separator="~"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                format="HH:mm"
                value-format="HH:mm"
                :default-value="[
                  new Date(0, 0, 0, 0, 0, 0),
                  new Date(0, 0, 0, 23, 0, 0),
                ]"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="修改人：" prop="updaterId">
              <el-input v-model="modalFormData.updaterId" clearable disabled />
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
  queryFixedValueRuleListApi,
  saveFixedValueRuleDataApi,
  deleteFixedValueRuleDataApi,
} from '#/api';
import { downloadFile } from '#/utils/download.ts';
import { validateIP, validateIPv6 } from '#/utils/validateUtil.ts';

defineOptions({
  name: 'FixedValueMiddleware',
});

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
});
const resourceTypeMap = {
  '1': '数据库',
  '2': '中间件',
};
const loading = ref(false);

const queryFormRef = ref();
const queryForm = reactive({});

const modalTitle = ref('');
const disabledValue = ref(true);
const modalFormRef = ref();
const modalFormData = ref({});

const rules = reactive({
  vulnerabilityName: [{ required: true, message: '请输入漏洞名称' }],
  discoveryDate: [{ required: true, message: '请选择发现时间' }],
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
  modalFormData.value.timeRange = [row.startTime, row.endTime];
};

const editData = async (row) => {
  modalTitle.value = '规则修改';
  disabledValue.value = false;
  modalApi.open();
  modalFormData.value = { ...row };
  modalFormData.value.timeRange = [row.startTime, row.endTime];
};

const saveData = async (row) => {
  if (modalFormData.value.ipAddress) {
    if (
      !validateIP(modalFormData.value.ipAddress) &&
      !validateIPv6(modalFormData.value.ipAddress)
    ) {
      ElMessage.warning('请输入有效的IP地址');
      return;
    }
  }
  let params = { ...modalFormData.value };
  if (modalFormData.value?.timeRange) {
    params.startTime = modalFormData.value?.timeRange[0] || '';
    params.endTime = modalFormData.value?.timeRange[1] || '';
  }

  try {
    let result = await saveFixedValueRuleDataApi(params);
    if (result) {
      ElMessage.success('保存成功！');
      modalApi.close();
      query();
    } else {
      ElMessage.error('保存失败');
    }
  } catch (error) {}
};

const deleteData = (row) => {
  ElMessageBox.confirm('确定要删除这条数据吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        let result = await deleteFixedValueRuleDataApi([row.id]);
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
    const result = await queryFixedValueRuleListApi(params);
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
