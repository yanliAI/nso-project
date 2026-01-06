<template>
  <Page auto-content-height>
    <el-tabs
      v-model="activeTab"
      type="card"
      class="my-tabs"
      @tab-remove="removeTab"
    >
      <el-tab-pane label="并网清单" name="gridList">
        <el-container>
          <el-form
            ref="queryFormRef"
            :inline="true"
            :model="queryForm"
            label-position="right"
            style="padding: 16px 20px 0"
          >
            <el-form-item label="并网流程编号：" prop="id">
              <el-input style="width: 180px" v-model="queryForm.id" clearable />
            </el-form-item>
            <el-form-item label="系统级别：" prop="systemCategory">
              <el-select
                v-model="queryForm.systemCategory"
                style="width: 180px"
                placeholder="请选择"
                clearable
                filterable
              >
                <el-option label="一类关键信息系统" value="1"></el-option>
                <el-option label="二类关键信息系统" value="2"></el-option>
                <el-option label="三类关键信息系统" value="3"></el-option>
                <el-option label="一般信息系统" value="4"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="IOS系统CMDB系统编码：" prop="systemCode">
              <el-input
                style="width: 180px"
                v-model="queryForm.systemCode"
                clearable
              />
            </el-form-item>
            <el-form-item label="业务所属单位：" prop="belongUnitName">
              <el-input
                style="width: 180px"
                v-model="queryForm.belongUnitName"
                clearable
              />
            </el-form-item>
            <el-form-item label="并网系统名称：" prop="systemName">
              <el-input
                style="width: 180px"
                v-model="queryForm.systemName"
                clearable
              />
            </el-form-item>

            <el-form-item label="业务所属部门：" prop="manageDept">
              <el-input
                style="width: 180px"
                v-model="queryForm.manageDept"
                clearable
              />
            </el-form-item>
            <el-form-item label="调管层级：" prop="systemTypeId">
              <el-select
                v-model="queryForm.systemTypeId"
                style="width: 180px"
                placeholder="请选择"
                clearable
                filterable
              >
                <el-option label="网级机房部署" value="1"></el-option>
                <el-option label="省级机房部署" value="2"></el-option>
                <el-option label="网省两级机房部署" value="3"></el-option>
                <el-option label="地市级机房部署" value="4"></el-option>
                <el-option label="省地两级机房部署" value="5"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="并网环节：" prop="stageId">
              <el-select
                v-model="queryForm.stageId"
                style="width: 180px"
                placeholder="请选择"
                clearable
                filterable
              >
                <el-option label="并网前期(规划立项)阶段" value="1"></el-option>
                <el-option label="并网前期(需求设计)阶段" value="2"></el-option>
                <el-option label="并网前期(详细设计)阶段" value="3"></el-option>
                <el-option label="并网准备阶段" value="4"></el-option>
                <el-option label="并网启动阶段" value="5"></el-option>
                <el-option label="并网前期(设计)阶段" value="6"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" :icon="Search" @click="query"
                >查询</el-button
              >
              <el-button
                type="primary"
                :icon="Filter"
                @click="getNameSimilarity"
                >全局命名筛查</el-button
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
              style="width: 100%; height: 640px"
            >
              <el-table-column type="index" align="center" />
              <!-- <el-table-column type="selection" /> -->
              <el-table-column prop="id" label="并网流程编号" align="center">
                <template #default="scope">
                  <el-button type="primary" link @click="addTab(scope.row.id)">
                    {{ scope.row.id }}
                  </el-button>
                </template>
              </el-table-column>

              <el-table-column
                prop="systemName"
                label="并网系统名称"
                align="center"
              >
              </el-table-column>

              <el-table-column
                prop="systemCategory"
                label="系统级别"
                align="center"
              >
                <template #default="scope">
                  {{ systemCategoryMap[scope.row.systemCategory] }}
                </template>
              </el-table-column>
              <el-table-column
                prop="systemCode"
                label="IOS系统CMDB系统编码"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="belongUnitName"
                label="业务所属单位"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="manageDept"
                label="业务所属部门"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="systemTypeId"
                label="调管层级"
                align="center"
              >
                <template #default="scope">
                  {{ systemTypeMap[scope.row.systemTypeId] }}
                </template>
              </el-table-column>
              <el-table-column prop="stageId" label="并网环节" align="center">
                <template #default="scope">
                  {{ stageMap[scope.row.stageId] }}
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
      </el-tab-pane>
      <el-tab-pane label="规则配置" name="ruleConfiguration">
        <RuleConfiguration ref="ruleConRef"></RuleConfiguration>
        <div class="my-4 mr-10 flex" style="justify-content: right">
          <el-button type="primary" :icon="Plus" @click="showAddRuleTab"
            >新建规则</el-button
          >
          <el-button
            type="danger"
            :icon="Delete"
            @click="ruleConRef?.deleteGridConnectConfig"
            >删除当前规则</el-button
          >
          <el-button
            type="primary"
            :icon="Finished"
            @click="saveGridConnectConfig(ruleConRef)"
            >保存</el-button
          >
        </div>
      </el-tab-pane>
      <el-tab-pane
        v-if="isAddRuleTab"
        label="新建规则"
        name="addRuleConfig"
        closable
      >
        <RuleConfiguration
          ref="addRuleConRef"
          :addTag="true"
          @remove-tab="removeTab"
        ></RuleConfiguration>
        <div class="my-4 mr-10 flex" style="justify-content: right">
          <el-button :icon="RefreshLeft" @click="addRuleConRef?.resetForm"
            >重置</el-button
          >
          <el-button
            type="primary"
            :icon="Finished"
            @click="saveGridConnectConfig(addRuleConRef)"
            >保存</el-button
          >
        </div>
      </el-tab-pane>
      <el-tab-pane
        v-for="item in editableTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
        closable
      >
        <detailInfo :orderId="item.id"></detailInfo>
      </el-tab-pane>
    </el-tabs>

    <Modal
      class="h-[650px] w-[1200px]"
      title="命名筛查结果"
      :footer="false"
      :closeOnClickModal="false"
      :draggable="true"
    >
      <el-table
        v-if="modalTableData && modalTableData.length > 0"
        border
        stripe
        v-for="(itemData, index) in modalTableData"
        :key="index"
        :data="itemData"
        :show-header="index == 0"
        :row-style="setFirstRowStyle"
      >
        <el-table-column
          prop="similarityPercent"
          label="相似结果"
          align="center"
        >
          <template #default="{ row, $index }">
            <span v-if="$index == 0" style="color: #ff0000">
              {{ modalTableData[index].length - 1 }}
            </span>
            <span v-else-if="row.similarityPercent" :style="getRowStyle(row)">{{
              row.similarityPercent
            }}</span>
            <span v-else>——</span>
          </template>
        </el-table-column>

        <el-table-column prop="id" label="并网流程编号" align="center">
        </el-table-column>

        <el-table-column prop="systemName" label="并网系统名称" align="center">
        </el-table-column>
        <el-table-column
          prop="systemCode"
          label="IOS系统CMDB系统编码"
          align="center"
        >
          <template #default="{ row, $index }">
            <span
              v-if="$index != 0 && row.isCodeDuplicate"
              style="color: #ff0000"
            >
              {{ row.systemCode }}
            </span>
            <span v-else>{{ row.systemCode }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="belongUnitName"
          label="业务所属单位"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="lastApplyTime"
          label="并网完成时间"
          align="center"
        >
        </el-table-column>
      </el-table>
      <el-empty
        v-else
        description="暂无数据"
        :image-size="100"
        style="height: 500px"
      >
      </el-empty>

      <div class="mt-10 flex" style="justify-content: center">
        <el-button type="primary" @click="exportData">结果导出</el-button>
        <el-button @click="modalApi.close()">关闭</el-button>
      </div>
    </Modal>
  </Page>
</template>

<script lang="ts" setup>
import {
  ElTabs,
  ElTabPane,
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
  ElMain,
  ElFooter,
  ElEmpty,
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
import { queryGridConnectDataListApi, getNameSimilarityApi } from '#/api';
import { downloadFile } from '#/utils/download.ts';
import RuleConfiguration from './ruleConfiguration.vue';
import detailInfo from './detailInfo.vue';

defineOptions({
  name: 'GridConnectionIntelligentReview',
});

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
});
const ruleConRef = ref();
const addRuleConRef = ref();
const activeTab = ref('gridList');
const isAddRuleTab = ref(false);
// const activeTab = ref('ruleConfiguration');

const loading = ref(false);
const systemCategoryMap = {
  '1': '一类关键信息系统',
  '2': '二类关键信息系统',
  '3': '三类关键信息系统',
  '4': '一般信息系统',
};
const systemTypeMap = {
  1: '网级机房部署',
  2: '省级机房部署',
  3: '网省两级机房部署',
  4: '地市级机房部署',
  5: '省地两级机房部署',
};
const stageMap = {
  '1': '并网前期(规划立项)阶段',
  '2': '并网前期(需求设计)阶段',
  '3': '并网前期(详细设计)阶段',
  '4': '并网准备阶段',
  '5': '并网启动阶段',
  '6': '并网前期(设计)阶段',
};
const queryFormRef = ref();
const queryForm = reactive({
  id: '',
  systemCode: '',
  belongUnitName: '',
  manageDept: '',
  stageId: '',
  systemCategory: '',
  systemName: '',
  systemTypeId: '',
});

const resetQueryForm = () => {
  queryFormRef.value?.resetFields();
  query();
};
const stepTable = ref();
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);
const table = ref(null);
const tableData = ref([]);
const selectedRows = ref([]);
const modalTableData = ref([
  [
    {
      similarityPercent: null,
      id: '1',
      systemName: '应用系统-数据开放共享风险量化和防护原型系统',
      systemCode: 'CSG-BIZ-AP-SUBAP-000000001',
      isCodeDuplicate: true,
      belongUnitName: '广西电网有限责任公司',
      lastApplyTime: '2025-03-21T15:17:03',
    },
    {
      similarityPercent: '90%',
      id: '2',
      systemName: '应用系统-数据开放共享风险量化和防护原型',
      systemCode: 'CSG-BIZ-AP-SUBAP-000000002',
      isCodeDuplicate: false,
      belongUnitName: '广西电网有限责任公司',
      lastApplyTime: '2025-03-21T15:17:03',
    },
    {
      similarityPercent: null,
      id: '3',
      systemName: '应用系统',
      systemCode: 'CSG-BIZ-AP-SUBAP-000000001',
      isCodeDuplicate: true,
      belongUnitName: '广西电网有限责任公司',
      lastApplyTime: '2025-03-21T15:17:03',
    },
  ],
  [
    {
      similarityPercent: null,
      id: '4',
      systemName: '云盾',
      systemCode: 'CSG-BIZ-AP-SUBAP-000000005',
      isCodeDuplicate: false,
      belongUnitName: '广西电网有限责任公司',
      lastApplyTime: '2025-03-21T15:17:03',
    },
  ],
]);

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
    const result = await queryGridConnectDataListApi(params);
    tableData.value = result.records;
    total.value = result.total;
  } catch {}
  loading.value = false;
};

const getNameSimilarity = async () => {
  modalApi.open();
  try {
    modalTableData.value = await getNameSimilarityApi();
  } catch {}
};

const saveGridConnectConfig = async (ruleConRef) => {
  if (ruleConRef) {
    await ruleConRef.saveGridConnectConfig();
    // removeTab('addRuleConfig');
  }
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

const editableTabs = ref([]);

const showAddRuleTab = () => {
  isAddRuleTab.value = true;
  activeTab.value = 'addRuleConfig';
};

const addTab = (targetTitle: string) => {
  editableTabs.value.push({
    title: targetTitle,
    name: targetTitle,
    id: targetTitle,
  });
  activeTab.value = targetTitle;
};
const removeTab = (targetTitle) => {
  // 删除新建规则tab
  if (targetTitle === 'addRuleConfig') {
    isAddRuleTab.value = false;
    activeTab.value = 'ruleConfiguration';
    return;
  }
  const tabs = editableTabs.value;
  let activeName = activeTab.value;
  if (activeName === targetTitle) {
    tabs.forEach((tab, index) => {
      if (tab.name === targetTitle) {
        const nextTab = tabs[index + 1] || tabs[index - 1];
        if (nextTab) {
          activeName = nextTab.name;
        } else {
          activeName = 'ruleConfiguration';
        }
      }
    });
  }

  activeTab.value = activeName;
  editableTabs.value = tabs.filter((tab) => tab.name !== targetTitle);
};

const exportData = async () => {
  try {
    await downloadFile(
      import.meta.env.VITE_NSOSFS + '/gridConnect/nameSimilarityExport',
      {},
      '并网审查-命名筛查结果.xlsx',
    );
  } catch {}
};

// 设置首行背景色
const setFirstRowStyle = ({ row, rowIndex }) => {
  if (rowIndex === 0) {
    return {
      backgroundColor: '#ccc',
    };
  }
  return {}; // 其他行返回空对象
};

const getRowStyle = (row) => {
  const baseLightness = 38; // #c00000 的原始亮度
  const darkness = 40 * (1 - (parseFloat(row.similarityPercent) / 100));
  return {
    padding: '10px 40px',
    backgroundColor: `hsl(0, 100%, ${baseLightness + darkness}%)`,
    color: '#fff',
  };
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
