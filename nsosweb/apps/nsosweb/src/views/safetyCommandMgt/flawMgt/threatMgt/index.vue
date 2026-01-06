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
        <!-- <el-form-item label="数据来源:">
          <el-input v-model="queryForm.source" style="width: 150px" clearable />
        </el-form-item> -->

        <el-form-item>
          <el-button type="primary" :icon="Search" @click="query"
            >查询</el-button
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
          <!-- <el-table-column
            prop="handlingStatus"
            label="处置情况"
            align="center"
            width="150"
          >
            <template #default="scope">
              {{ handlingStatuslMap[scope.row.handlingStatus] }}
            </template>
          </el-table-column> -->

          <el-table-column label="操作" align="center" width="200">
            <template #default="{ row, $index }">
              <el-button type="primary" link @click="analysisData(row)"
                >分析
              </el-button>
              <el-button type="primary" link @click="monitorData()"
                >监视
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
      width="1080"
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
          <ElFormItem label="IP地址:" prop="sourceIp" style="width: 180px">
            <ElInput v-model="queryForm1.sourceIp" clearable />
          </ElFormItem>
          <ElFormItem label="告警:" prop="alarm" style="width: 180px">
            <ElInput v-model="queryForm1.alarm" clearable />
          </ElFormItem>
          <ElFormItem label="指令:" prop="order" style="width: 180px">
            <ElInput v-model="queryForm1.order" clearable />
          </ElFormItem>
          <ElFormItem label="漏洞:" prop="closeLoop" style="width: 180px">
            <ElInput v-model="queryForm1.closeLoop" clearable />
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
      <div style="padding-top: 10px" v-if="!isEmpty">
        <div class="box">
          <div class="box-left">
            <div
              style="
                width: 300px;
                height: 50px;
                font-size: 20px;
                font-weight: 700;
                text-align: center;
              "
            >
              [{{ tableData1[0]?.sourceNetworkPartition }}]
            </div>
            <div class="item-left">
              <div class="item-text">
                <span>{{ tableData1[0]?.origionSysName }}</span>
              </div>
            </div>
          </div>
          <div class="box-center">
            <div class="box-link">
              <div class="pos">
                网闸<br />{{ tableData1[0]?.dataExchangeGateway }}
              </div>
            </div>
            <div class="box-link1">=============================>></div>
          </div>
          <div class="box-right">
            <div
              style="
                width: 300px;
                height: 50px;
                font-size: 20px;
                font-weight: 700;
                text-align: center;
              "
            >
              [{{ tableData1[0]?.sourceNetworkPartition }}]
            </div>
            <div class="item-right">
              <div class="item-text">
                <span style="color: #02a0ec">{{
                  tableData1[0]?.targetSysName
                }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="box1">
          <div class="box-content">
            <div class="pos1">网络策略:</div>
            <div
              class="pos2"
              @click="monitorData(tableData1[0]?.sourceIp)"
              style="text-decoration: underline; cursor: pointer"
            >
              {{ tableData1[0]?.sourceIp }}:{{ tableData1[0]?.sourcePort }}
            </div>
            <div class="pos3">{{ tableData1[0]?.dataExchangeGateway }}</div>
            <div class="pos4">
              {{ tableData1[0]?.targetIp }}:{{ tableData1[0]?.targetPort }}
            </div>
          </div>
        </div>
      </div>
      <div
        style="
          padding-top: 10px;
          height: 500px;
          background: rgba(239, 239, 239, 1);
          width: 1040;
        "
        v-else
      >
        <el-empty description="暂无数据" :image-size="100" />
      </div>
    </ElDialog>
    <ElDialog
      v-model="dialogData.monitorVisible"
      width="1080"
      class="system-detail-dialog"
      @close="dialogData.monitorVisible = false"
    >
      <div>
        <ElForm
          :inline="true"
          ref="queryFormRef1"
          :model="queryForm1"
          label-position="right"
        >
          <ElFormItem label="IP地址:" prop="sourceIp" style="width: 180px">
            <ElInput v-model="queryForm1.sourceIp" clearable />
          </ElFormItem>
          <ElFormItem label="告警:" prop="alarm" style="width: 180px">
            <ElInput v-model="queryForm1.alarm" clearable />
          </ElFormItem>
          <ElFormItem label="指令:" prop="order" style="width: 180px">
            <ElInput v-model="queryForm1.order" clearable />
          </ElFormItem>
          <ElFormItem label="漏洞:" prop="closeLoop" style="width: 180px">
            <ElInput v-model="queryForm1.closeLoop" clearable />
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
      <div style="padding-top: 10px" v-if="!isEmpty">
        <div class="box" style="padding-bottom: 15px">
          <div class="box-left">
            <div
              style="
                width: 300px;
                height: 50px;
                font-size: 20px;
                font-weight: 700;
                text-align: center;
              "
            >
              [{{ tableData1[0]?.sourceNetworkPartition }}]
            </div>
            <div class="item-left">
              <div class="item-text">
                <span>{{ tableData1[0]?.origionSysName }}</span>
              </div>
            </div>
          </div>
          <div class="box-center">
            <div class="box-link1" style="height: 100%; padding-top: 40px">
              -------------------------------------------------------<br />-------------------------------------------------------
            </div>
          </div>
          <div class="box-right">
            <div
              style="
                width: 300px;
                height: 50px;
                font-size: 20px;
                font-weight: 700;
                text-align: center;
              "
            >
              [{{ tableData1[0]?.targetNetworkPartition }}]
            </div>
            <div class="item-right">
              <div class="item-text">
                <span style="color: #02a0ec">{{
                  tableData1[0]?.targetSysName
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        style="
          padding-top: 10px;
          height: 500px;
          background: rgba(239, 239, 239, 1);
          width: 1040;
        "
        v-else
      >
        <el-empty description="暂无数据" :image-size="100" />
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
  ElEmpty,
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
import { ref, reactive, computed, onMounted } from 'vue';
import {
  getThreatIntelligenceDataApi,
  getSysRelateInfo,
  searchAppDomainSystemInfo,
} from '#/api';

const dialogData = reactive({
  visible: false,
  monitorVisible: false,
});

const handlingStatuslMap = {
  '0': '未处置',
  '1': '已处置',
  '2': '已下令',
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
  intelligenceName: '',
  threatType: '',
  threatRiskLevel: [],
  source: '',
  handlingStatus: [],
});

const queryFormRef1 = ref();
const queryForm1 = reactive({});

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

const simulateData = [
  {
    alarm: '信息泄露',
    order: '漏洞封堵',
    closeLoop: '未授权访问漏洞',
    sourceIp: '',
  },
  {
    alarm: '发现密码重置操作',
    order: '漏洞拦截',
    closeLoop: '测试漏洞',
    sourceIp: '',
  },
];

const isEmpty = ref(false);
function findSourceIP(
  data,
  alarm = '',
  order = '',
  closeLoop = '',
  sourceIp = '',
) {
  // 检查 alarm、order、closeLoop 是否不全为空
  const hasCondition = alarm !== '' || order !== '' || closeLoop !== '';

  // 查找匹配项
  const foundItem = data.find((item) => {
    const conditions = [];
    if (alarm !== '') conditions.push(item.alarm === alarm);
    if (order !== '') conditions.push(item.order === order);
    if (closeLoop !== '') conditions.push(item.closeLoop === closeLoop);
    if (sourceIp !== '') conditions.push(item.sourceIp === sourceIp);
    return conditions.length > 0 && conditions.every(Boolean);
  });

  // 如果有查询条件但未找到匹配项，返回空字符串
  if (hasCondition && !foundItem) {
    return '';
  }
  // 否则返回找到的 sourceIp 或传入的 sourceIp
  return foundItem?.sourceIp ?? sourceIp;
}

// 分析查询
async function queryData() {
  try {
    const targetIp = findSourceIP(
      simulateData,
      queryForm1.alarm,
      queryForm1.order,
      queryForm1.closeLoop,
      queryForm1.sourceIp,
    );
    if (targetIp === '') {
      isEmpty.value = true;
    } else {
      isEmpty.value = false;
    }
    const res = await getSysRelateInfo({
      pageSize: 10,
      pageNo: 1,
      sourceIp: targetIp,
    });
    if (res) {
      tableData1.value = res.list;
    }
  } catch (error) {
    console.error('查询数据失败:', error);
  }
}

// // 监视查询
// async function queryMonitorData() {
//   try {
//     const res = await searchAppDomainSystemInfo({
//       pageSize: 10,
//       pageNo:1,
//       ...queryForm1,
//     });
//     if (res) {
//       tableData1.value = res.list;
//     }
//   } catch (error) {
//     console.error('查询数据失败:', error);
//   }
// }

const reset = () => {
  queryForm.daterange = '';
  queryForm.intelligenceName = '';
  queryForm.threatType = '';
  queryForm.threatRiskLevel = [];
  queryForm.source = '';
  queryForm.handlingStatus = [];
  query();
};

function reset1() {
  queryFormRef1.value?.resetFields();
  queryForm1.sourceIp = '';
  queryData();
  // tableData1.value = []
}

// function reset2(){
//   queryFormRef1.value?.resetFields();
//   queryMonitorData()
//   // tableData1.value = []
// }
// 分析
function analysisData() {
  queryForm1.sourceIp = '';
  queryForm1.alarm = '';
  queryForm1.order = '';
  queryForm1.closeLoop = '';
  dialogData.visible = true;
  queryData();
  // queryForm1.sourceIp = tableData1.value[0]?.sourceIp
}

// 监视
async function monitorData(ipAdress) {
  console.log('ssss', ipAdress);
  if (ipAdress && ipAdress !== '') {
    queryForm1.sourceIp = ipAdress;
  } else {
    queryForm1.sourceIp = '';
    queryForm1.alarm = '';
    queryForm1.order = '';
    queryForm1.closeLoop = '';
  }
  dialogData.monitorVisible = true;
  queryData();
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

onMounted(() => {
  query();
});
</script>

<style scoped>
.box1 {
  width: 1040px;
  height: 200px;
  background: rgba(239, 239, 239, 1);
  .box-content {
    margin-left: 240px;
    height: 120px;
    width: 500px;
    background: url('../../../../assets/images/flawMgt/bottom.png') 100%
      no-repeat;
    background-size: 100% 100%;
    position: relative;
    .pos1 {
      width: 75px;
      position: absolute;
      color: red;
      font-size: 16px;
      font-weight: 600;
      left: 0;
      top: 50px;
    }
    .pos2 {
      width: 100px;
      text-align: center;
      position: absolute;
      color: red;
      font-size: 15px;
      font-weight: 600;
      left: 50px;
      bottom: 0px;
    }
    .pos3 {
      width: 100px;
      text-align: center;
      position: absolute;
      color: red;
      font-size: 15px;
      font-weight: 600;
      left: 230px;
      bottom: 0px;
    }
    .pos4 {
      width: 100px;
      text-align: center;
      position: absolute;
      color: red;
      font-size: 15px;
      font-weight: 600;
      left: 415px;
      bottom: 0px;
    }
  }
}
.box {
  width: 1040px;
  padding: 10px 10px 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(239, 239, 239, 1);
  .box-left {
    width: 300px;
    height: 100%;
  }
  .box-center {
    width: calc(100% - 600px);
    height: 100%;
    .box-link {
      height: 200px;
      width: 80%;
      margin-left: 40px;
      background: url('../../../../assets/images/flawMgt/center.png') 100%
        no-repeat;
      background-size: 100% 100%;
      position: relative;
      .pos {
        width: 100px;
        text-align: center;
        position: absolute;
        color: red;
        font-size: 15px;
        font-weight: 600;
        left: 125px;
        top: 110px;
      }
    }
    .box-link1 {
      padding-top: 10px;
      height: 190px;
      width: 100%;
      line-height: 0.3;
      text-align: center;
      color: #787c05;
      font-weight: 800;
      vertical-align: middle;
    }
  }
  .box-right {
    width: 300px;
    height: 100%;
  }

  .item-left {
    width: 300px;
    height: 300px;
    background: url('../../../../assets/images/flawMgt/left.png') 100% no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .item-text {
      color: #65ac15;
      text-align: center;
      font-weight: 600;
      line-height: 1.5;
    }
  }
  .item-right {
    width: 300px;
    height: 300px;
    background: url('../../../../assets/images/flawMgt/right.png') 100%
      no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .item-text {
      line-height: 1.5;
      color: #65ac15;
      text-align: center;
      font-weight: 600;
    }
  }
}
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
