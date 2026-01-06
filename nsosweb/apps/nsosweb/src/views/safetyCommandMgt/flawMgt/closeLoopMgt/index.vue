<template>
  <div class="flex" style="width: 100%; height: 100%; flex-direction: column">
    <el-container>
      <el-form
        :inline="true"
        :model="queryForm"
        label-position="right"
        style="padding: 16px 20px 0"
      >
        <el-form-item label="漏洞发现时间:">
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
        <el-form-item label="漏洞名称:">
          <el-input
            v-model="queryForm.vulnerabilityName"
            style="width: 200px"
            clearable
          />
        </el-form-item>
        <el-form-item label="漏洞类型:">
          <el-input
            v-model="queryForm.vulnerabilityType"
            style="width: 200px"
            clearable
          />
        </el-form-item>
        <el-form-item label="IP地址:">
          <el-input v-model="queryForm.ip" style="width: 200px" clearable />
        </el-form-item>
        <el-form-item label="风险等级：" prop="riskLevel">
          <el-select
            v-model="queryForm.riskLevel"
            clearable
            multiple
            style="width: 200px"
          >
            <el-option label="高危" value="高危"></el-option>
            <el-option label="中危" value="中危"></el-option>
            <el-option label="低危" value="低危"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="处置状态：" prop="handlingStatus">
          <el-select
            v-model="queryForm.handlingStatus"
            clearable
            multiple
            style="width: 200px"
          >
            <el-option label="未处置" value="0"></el-option>
            <el-option label="已研判-无需处置" value="1"></el-option>
            <el-option label="待签收" value="3"></el-option>
            <el-option label="待复令" value="4"></el-option>
            <el-option label="待复核" value="5"></el-option>
            <el-option label="已闭环" value="6"></el-option>
            <el-option label="已作废" value="7"></el-option>
          </el-select>
        </el-form-item> -->

        <el-form-item>
          <el-button type="primary" :icon="Search" @click="query"
            >查询</el-button
          >
          <el-button type="primary" :icon="Download" @click="exportFile"
            >导出</el-button
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
            prop="vulnerabilityName"
            label="漏洞名称"
            align="center"
            width="200"
          >
            <template #default="scope">
              <el-tooltip
                effect="light"
                :content="scope.row.vulnerabilityName"
                placement="bottom"
                popper-class="custom-tooltip"
              >
                <span class="max-lines">{{ scope.row.vulnerabilityName }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            prop="vulnerabilityType"
            label="漏洞类型"
            align="center"
            width="120"
          >
            <!-- <template #default="scope">
              {{ vulnerabilityTypeMap[scope.row.vulnerabilityType] }}
            </template> -->
          </el-table-column>
          <el-table-column
            prop="riskLevel"
            label="风险等级"
            align="center"
            width="120"
          >
            <!-- <template #default="scope">
              {{ riskLevelMap[scope.row.riskLevel] }}
            </template> -->
          </el-table-column>
          <el-table-column
            prop="applicationSystemName"
            label="所属系统"
            align="center"
          >
          </el-table-column>

          <el-table-column prop="ipv4" label="IPV4" align="center">
          </el-table-column>
          <el-table-column prop="ipv6" label="IPV6" align="center">
          </el-table-column>
          <el-table-column prop="discoveryDate" label="发现时间" align="center">
          </el-table-column>

          <el-table-column
            prop="description"
            label="漏洞描述"
            align="center"
            width="300"
          >
            <template #default="scope">
              <el-tooltip
                effect="light"
                :content="scope.row.description"
                placement="bottom"
                popper-class="custom-tooltip"
              >
                <span class="max-lines">{{ scope.row.description }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="handlingStatus"
            label="处置状态"
            align="center"
          >
            <template #default="scope">
              {{
                transformHandlingStatus(
                  scope.row.handlingStatus,
                  scope.row.commandStatus,
                )
              }}
            </template>
          </el-table-column> -->
          <el-table-column label="操作" align="center">
            <template #default="{ row, $index }">
              <el-button type="primary" link @click="analysisData(row)"
                >分析
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
    <ElDialog
      v-model="dialogData.visible"
      width="1000"
      class="system-detail-dialog"
      @close="dialogData.visible = false"
    >
      <div>
        <ElForm
          :inline="true"
          ref="queryFormRef1"
          :model="queryForm1"
          label-position="right"
        >
          <ElFormItem label="IP地址:" prop="sourceIp">
            <ElInput v-model="queryForm1.sourceIp" clearable />
          </ElFormItem>
          <ElFormItem style="width: auto">
            <ElButton type="primary" :icon="Search" @click="queryData"
              >查询</ElButton
            >
            <ElButton type="info" :icon="Refresh" @click="reset1"
              >重置</ElButton
            >
          </ElFormItem>
        </ElForm>
      </div>
      <div style="padding-top: 10px">
        <ElTable ref="tab" border stripe :data="tableData1" height="500px">
          <ElTableColumn type="index" align="center" />
          <ElTableColumn label="源系统" align="center">
            <ElTableColumn prop="sourceIp" label="IP地址" align="center" />
            <ElTableColumn prop="sourcePort" label="端口" align="center" />
            <ElTableColumn
              prop="origionSysName"
              label="系统名称"
              align="center"
            />
            <ElTableColumn
              prop="sourceNetworkPartition"
              label="系统所属网络分区"
              align="center"
            />
          </ElTableColumn>
          <ElTableColumn
            prop="dataExchangeGateway"
            align="center"
            label="数据交换网关/隔离设备"
          />
          <ElTableColumn label="目标系统" align="center">
            <ElTableColumn prop="targetIp" label="IP地址" align="center" />
            <ElTableColumn prop="targetPort" label="端口" align="center" />
            <ElTableColumn
              prop="targetSysName"
              label="系统名称"
              align="center"
            />
            <ElTableColumn
              prop="targetNetworkPartition"
              label="系统所属网络分区"
              align="center"
            />
          </ElTableColumn>
        </ElTable>
      </div>
    </ElDialog>
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
import {
  getVulnerabilityInfoDataApi,
  deleteVulnerabilityInfoDataApi,
  getSysRelateInfo,
} from '#/api';
import { downloadFile } from '#/utils/download.ts';
const dialogData = reactive({
  visible: false,
});

const commandStatusMap = {
  '1': '待审核',
  '2': '待发布',
  '3': '待签收',
  '4': '待复令',
  '5': '待复核',
  '6': '已闭环',
  '7': '已作废',
};
// 是否显示详情信息
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);
const table = ref(null);
const tableData = ref([]);
const tableData1 = ref([]);
const selectedRows = ref([]);
const queryForm = reactive({
  daterange: '',
  vulnerabilityName: '',
  vulnerabilityType: '',
  ip: '',
  riskLevel: [],
  handlingStatus: [],
  commandStatus: [],
});
const queryFormRef1 = ref();
const queryForm1 = reactive({});

/**
 * 查询
 */
const query = async () => {
  try {
    let handlingStatusList = queryForm.handlingStatus.filter(
      (item) => Number(item) <= 2,
    );
    let commandStatusList = queryForm.handlingStatus.filter(
      (item) => Number(item) > 2,
    );
    const response = await getVulnerabilityInfoDataApi({
      pageNo: currentPage.value,
      pageSize: pageSize.value,
      startTime: queryForm.daterange && queryForm.daterange[0],
      endTime: queryForm.daterange && queryForm.daterange[1],
      vulnerabilityName: queryForm.vulnerabilityName,
      vulnerabilityType: queryForm.vulnerabilityType,
      ip: queryForm.ip,
      riskLevel: queryForm.riskLevel,
      handlingStatus: handlingStatusList,
      commandStatus: commandStatusList,
    });
    tableData.value = response.records;
    total.value = response.total;
  } catch {}
};

const reset = () => {
  queryForm.daterange = '';
  queryForm.vulnerabilityName = '';
  queryForm.vulnerabilityType = '';
  queryForm.ip = '';
  queryForm.riskLevel = [];
  queryForm.handlingStatus = [];
  queryForm.commandStatus = [];
  query();
};

// 分析查询
async function queryData() {
  try {
    const res = await getSysRelateInfo({
      pageSize: 10,
      pageNo: 1,
      ...queryForm1,
    });
    if (res) {
      tableData1.value = res.list;
    }
  } catch (error) {
    console.error('查询数据失败:', error);
  }
}

function reset1() {
  queryFormRef1.value?.resetFields();
  queryData();
  // tableData1.value = []
}
// 分析
function analysisData() {
  dialogData.visible = true;
  queryData();
  // queryForm1.sourceIp = tableData1.value[0]?.sourceIp
}
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

// 导出文件

const exportFile = async () => {
  try {
    await downloadFile(
      import.meta.env.VITE_NSOSSECURITY + '/vulnerabilityInfo/export',
      queryForm,
      '漏洞台账.xlsx',
      'post',
    );
  } catch {}
};
const transformHandlingStatus = (
  handlingStatus: string,
  commandStatus: string,
) => {
  if (handlingStatus == 0) {
    return '未处置';
  }
  if (handlingStatus == 1) {
    return '已处置';
  }
  if (handlingStatus == 2) {
    return commandStatusMap[commandStatus];
  }
  return '';
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

<style>
.custom-tooltip {
  max-width: 500px; /* 设置最大宽度 */
  word-wrap: break-word; /* 强制换行 */
  white-space: normal; /* 允许换行（覆盖默认的 nowrap） */
}
</style>
