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
        <el-form-item label="资源类型：" prop="resourceType">
          <el-select
            v-model="queryForm.resourceType"
            style="width: 180px"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option label="虚拟机" value="1"></el-option>
            <el-option label="物理机" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务器类型：" prop="serverType">
          <el-input
            style="width: 180px"
            v-model="queryForm.serverType"
            clearable
          />
        </el-form-item>
        <el-form-item label="IP地址：" prop="ipAddress">
          <el-input
            style="width: 180px"
            v-model="queryForm.ipAddress"
            clearable
          />
        </el-form-item>
        <el-form-item label="部署区域：" prop="deployArea">
          <el-input
            style="width: 180px"
            v-model="queryForm.deployArea"
            clearable
          />
        </el-form-item>
        <el-form-item label="操作系统：" prop="osType">
          <el-input style="width: 180px" v-model="queryForm.osType" clearable />
        </el-form-item>
        <el-form-item label="机房位置：" prop="roomLocation">
          <el-input
            style="width: 180px"
            v-model="queryForm.roomLocation"
            clearable
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :icon="Search" @click="query"
            >查询</el-button
          >
          <!-- <el-button type="primary" :icon="Plus" @click="addSystem"
            >新增</el-button
          > -->
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
          <el-table-column prop="id" label="ID" align="center" width="100">
          </el-table-column>
          <el-table-column
            prop="unitName"
            label="所属单位"
            align="center"
            width="180"
          >
          </el-table-column>

          <el-table-column
            prop="deployArea"
            label="设备区域"
            align="center"
            width="150"
          >
          </el-table-column>

          <el-table-column
            prop="resourceType"
            label="资源类型"
            align="center"
            width="150"
          >
            <template #default="scope">
              {{ resourceTypeMap[scope.row.resourceType] }}
            </template>
          </el-table-column>
          <el-table-column
            prop="osType"
            label="操作系统"
            align="center"
            width="120"
          ></el-table-column>
          <el-table-column
            prop="serverType"
            label="服务器类型"
            align="center"
            width="120"
          ></el-table-column>
          <el-table-column
            prop="deployedApp"
            label="部署的应用"
            align="center"
            width="120"
          >
          </el-table-column>
          <el-table-column
            prop="roomLocation"
            label="机房位置"
            align="center"
            width="120"
          >
          </el-table-column>
          <el-table-column
            prop="ipAddress"
            label="IP地址"
            align="center"
            width="120"
          >
          </el-table-column>
          <el-table-column
            prop="osInfo"
            label="操作系统信息"
            align="center"
            width="120"
          >
          </el-table-column>
          <el-table-column
            prop="deviceArch"
            label="设备架构"
            align="center"
            width="120"
          >
          </el-table-column>
          <el-table-column
            prop="deviceLevel"
            label="设备档次"
            align="center"
            width="120"
          >
          </el-table-column>
          <el-table-column
            prop="osBit"
            label="操作系统位数"
            align="center"
            width="120"
          >
          </el-table-column>
          <el-table-column
            prop="cpuCores"
            label="CPU(核)"
            align="center"
            width="120"
          >
          </el-table-column>
          <el-table-column
            prop="memoryGb"
            label="内存(GB)"
            align="center"
            width="120"
          >
          </el-table-column>
          <el-table-column
            prop="localDiskGb"
            label="本地磁盘(GB)"
            align="center"
            width="120"
          >
          </el-table-column>
          <el-table-column
            prop="lastModifyTime"
            label="最后修改时间"
            align="center"
            width="150"
          >
          </el-table-column>
          <el-table-column
            prop="operator"
            label="执行人"
            align="center"
            width="120"
          >
          </el-table-column>
          <el-table-column
            prop="dbArch"
            label="数据库架构"
            align="center"
            width="120"
          >
          </el-table-column>
          <el-table-column
            prop="consistentWithStandard"
            label="是否与统调定值一致"
            align="center"
            width="120"
            fixed="right"
          >
            <template #default="{ row }">
              <el-switch
                v-if="row.editable"
                v-model="row.consistentWithStandard"
                style="--el-switch-on-color: #13ce66"
                active-value="1"
                inactive-value="0"
              />
              <span v-else>{{
                row.consistentWithStandard == 1 ? '是' : '否'
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="150"
            fixed="right"
          >
            <template #default="{ row }">
              <ElButton type="primary" link @click="lookSystemDetail(row)"
                >查看</ElButton
              >
              <ElButton
                v-if="!row.editable"
                type="primary"
                link
                @click="row.editable = true"
                >编辑</ElButton
              >
              <ElButton
                v-if="row.editable"
                type="primary"
                link
                @click="saveData(row)"
                >保存</ElButton
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
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备区域：" prop="deployArea">
              <el-input
                v-model="modalFormData.deployArea"
                clearable
                style="width: 100%"
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
            <el-form-item label="操作系统：" prop="osType">
              <el-input v-model="modalFormData.osType" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="服务器类型：" prop="serverType">
              <el-input v-model="modalFormData.serverType" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="部署的应用：" prop="deployedApp">
              <el-input v-model="modalFormData.deployedApp" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="机房位置：" prop="roomLocation">
              <el-input v-model="modalFormData.roomLocation" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="ip地址：" prop="ipAddress">
              <el-input v-model="modalFormData.ipAddress" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="操作系统信息：" prop="osInfo">
              <el-input v-model="modalFormData.osInfo" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备架构：" prop="deviceArch">
              <el-input v-model="modalFormData.deviceArch" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备档次：" prop="deviceLevel">
              <el-input v-model="modalFormData.deviceLevel" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="操作系统位数：" prop="osBit">
              <el-input v-model="modalFormData.osBit" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="CPU(核)：" prop="cpuCores">
              <el-input
                v-model="modalFormData.cpuCores"
                type="number"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="内存(GB)：" prop="memoryGb">
              <el-input
                v-model="modalFormData.memoryGb"
                type="number"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="本地磁盘(GB)：" prop="localDiskGb">
              <el-input
                v-model="modalFormData.localDiskGb"
                type="number"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最后修改时间：" prop="lastModifyTime">
              <el-input
                v-model="modalFormData.lastModifyTime"
                clearable
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="执行人：" prop="operator">
              <el-input v-model="modalFormData.operator" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="数据库架构：" prop="dbArch">
              <el-input v-model="modalFormData.dbArch" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="是否与统调定值一致："
              prop="consistentWithStandard"
            >
              <el-switch
                v-model="modalFormData.consistentWithStandard"
                style="--el-switch-on-color: #13ce66"
                active-value="1"
                inactive-value="0"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div class="my-10 flex" style="justify-content: center">
        <ElButton @click="modalApi.close()">关闭</ElButton>
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
  queryFixedValueOSListApi,
  saveFixedValueOSDataApi,
  getOSDataApi,
} from '#/api';
import { downloadFile } from '#/utils/download.ts';

defineOptions({
  name: 'FixedValueSystem',
});

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
});
const resourceTypeMap = {
  '1': '虚拟机',
  '2': '物理机',
};
const loading = ref(false);

const queryFormRef = ref();
const queryForm = reactive({
  resourceType: '',
  serverType: '',
  ipAddress: '',
  deployArea: '',
  osType: '',
  roomLocation: '',
});

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

const addSystem = () => {
  modalTitle.value = '新增操作系统';
  disabledValue.value = false;
  modalApi.open();
};

const lookSystemDetail = async (row) => {
  modalTitle.value = '操作系统详情';
  disabledValue.value = true;
  modalApi.open();
  try {
    let result = await getOSDataApi(row.id);
    modalFormData.value = result;
  } catch (error) {}
};

const saveData = async (row) => {
  let params = { ...row };
  try {
    let result = await saveFixedValueOSDataApi(params);
    if (result) {
      ElMessage.success('保存成功！');
      query();
    } else {
      ElMessage.error('保存失败');
    }
  } catch (error) {
    console.log('保存操作系统信息失败：', error);
  }
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
    const result = await queryFixedValueOSListApi(params);
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
      import.meta.env.VITE_NSOSFS + '/fixedAutoSupervision/os/export',
      params,
      '定值监督-操作系统数据.xlsx',
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
