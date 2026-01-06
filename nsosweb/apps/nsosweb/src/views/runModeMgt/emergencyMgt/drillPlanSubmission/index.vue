<template>
  <Page auto-content-height>
    <el-tabs
      ref="myTab"
      v-model="tabData.tabIndex"
      @tab-remove="removeTab"
      type="card"
      class="h-full w-full bg-white"
    >
      <el-tab-pane label="应急演练任务管理" name="list" :closable="false">
        <el-container>
          <el-form
            ref="queryFormRef"
            :inline="true"
            :model="queryForm"
            label-position="right"
            style="padding: 16px 20px 0"
          >
            <el-form-item label="应急演练名称:" prop="drillName">
              <el-input
                style="width: 180px"
                v-model="queryForm.drillName"
                clearable
              />
            </el-form-item>
            <el-form-item label="计划演练时间:" prop="planDrillTime">
              <el-date-picker
                v-model="queryForm.planDrillTime"
                type="date"
                placeholder="请选择日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                @change="handleChangeDate"
                style="width: 180px"
              />
            </el-form-item>
            <el-form-item label="系统名称:" prop="sysName">
              <el-input
                style="width: 180px"
                v-model="queryForm.sysName"
                clearable
              />
            </el-form-item>
            <el-form-item label="设备主人:" prop="deviceOwner">
              <el-input
                style="width: 180px"
                v-model="queryForm.deviceOwner"
                clearable
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" :icon="Search" @click="query"
                >查询</el-button
              >
              <el-button type="primary" :icon="CirclePlus" @click="addDrillPlan"
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
              style="width: 100%; height: 760px"
            >
              <el-table-column type="index" align="center" />
              <el-table-column type="selection" />
              <el-table-column
                prop="drillNo"
                label="应急演练编号"
                align="center"
              >
              </el-table-column>

              <el-table-column
                prop="drillName"
                label="应急演练名称"
                align="center"
              >
              </el-table-column>

              <el-table-column
                prop="sysName"
                label="系统名称"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="status"
                label="填报状态"
                align="center"
                width="120"
              >
                <template #default="scope">
                  <el-tag
                    v-if="scope.row.status == 1"
                    type="success"
                    size="large"
                    >已填报
                    <!-- <CircleCheck style="width: 1em; display: inline; margin-left: 5px"/> -->
                  </el-tag>
                  <el-tag
                    v-else-if="scope.row.status == 2"
                    type="primary"
                    size="large"
                    >待审批</el-tag
                  >
                </template>
              </el-table-column>

              <el-table-column
                prop="deviceOwner"
                label="设备主人"
                align="center"
                width="120"
              ></el-table-column>
              <el-table-column
                prop="planDrillTime"
                label="计划演练时间"
                align="center"
              >
              </el-table-column>
              <el-table-column prop="drillTime" label="演练时间" align="center">
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template #default="scope">
                  <el-button
                    type="primary"
                    link
                    @click="editDrillPlan(scope.row)"
                    >填报</el-button
                  >
                  <el-button type="primary" link @click="lookDetail(scope.row)"
                    >查看</el-button
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
      </el-tab-pane>
      <el-tab-pane
        v-for="item in tabData.tabArr"
        :key="item.name"
        :label="item.title"
        :name="item.name"
        closable
      >
        <AddPlanSubmission
          v-if="item.type == 'add'"
          :planId="item.id"
          :tabName="item.name"
          @removeTab="removeTab"
        ></AddPlanSubmission>
        <AddPlanSubmission
          v-if="item.type == 'edit'"
          :planId="item.id"
          :tabName="item.name"
          @removeTab="removeTab"
        ></AddPlanSubmission>
        <DrillPlanDetail
          v-if="item.type == 'detail'"
          :planId="item.id"
          :tabName="item.name"
          @removeTab="removeTab"
        ></DrillPlanDetail>
      </el-tab-pane>
    </el-tabs>
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
  ElDialog,
  ElMessage,
  ElMessageBox,
  ElTag,
} from 'element-plus';
import {
  Search,
  RefreshLeft,
  Delete,
  Download,
  Monitor,
  CirclePlus,
  CircleCheck,
} from '@element-plus/icons-vue';
import { Page } from '@vben/common-ui';
import { ref, reactive, computed, onMounted } from 'vue';
import AddPlanSubmission from './addPlanSubmission.vue';
import DrillPlanDetail from './drillPlanDetail.vue';
import { requestClient } from '#/api/request';

defineOptions({
  name: 'DrillPlanSubmission',
});
const queryFormRef = ref();
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);
const table = ref(null);
const tableData = ref([
  {
    id: '1',
    drillNo: 'wew939202',
    drillName: '电网管理平台（人资域）应急',
    sysName: '电网管理平台（人资域）',
    status: 1,
    deviceOwner: '张明明',
    planDrillTime: '2025-12-23',
    drillTime: '2025-12-23',
  },
  {
    id: '2',
    drillNo: 'wew939202',
    drillName: '电网管理平台（人资域）应急',
    sysName: '电网管理平台（人资域）',
    status: 1,
    deviceOwner: '张明明',
    planDrillTime: '2025-12-23',
    drillTime: '2025-12-23',
  },
]);
const selectedRows = ref([]);
const queryForm = reactive({
  drillName: '',
  planDrillTime: '',
  sysName: '',
  deviceOwner: '',
});

const tabData = reactive({
  tabIndex: 'list',
  tabArr: [],
});

const initTab = (type, id) => {
  let tab = {};
  tab.name = new Date().getTime() + '';
  tab.type = type;
  tab.id = id;
  if (type == 'add') {
    tab.title = '新增应急演练计划';
  } else if (type == 'edit') {
    tab.title = '填报演练计划';
  } else if (type == 'detail') {
    tab.title = '演练计划详情';
  }
  return tab;
};

/**
 * 新增演练计划
 */
const addDrillPlan = () => {
  let tab = initTab('add', '');
  tabData.tabArr.push(tab);
  // 切换到新增页面
  tabData.tabIndex = tab.name;
};

/**
 * 填报演练计划
 */
const editDrillPlan = (row) => {
  let tab = initTab('edit', row.id);
  tabData.tabArr.push(tab);
  // 切换到新增页面
  tabData.tabIndex = tab.name;
};

/**
 * 查看计划详情
 */
const lookDetail = (row) => {
  let tab = initTab('detail', row.id);
  tabData.tabArr.push(tab);
  // 切换到新增页面
  tabData.tabIndex = tab.name;
};

/**
 * 移除标签页
 * @param targetName
 */
const removeTab = (targetName) => {
  let tabArr = tabData.tabArr;

  let tabIndex = tabData.tabIndex;
  if (tabIndex === targetName) {
    tabIndex = 'list';
    tabArr.forEach((tab, index) => {
      // 如果关闭当前tab，则打开它前面或者后面的tab页
      if (tab.name === targetName) {
        const nextTab = tabArr[index + 1] || tabArr[index - 1];
        if (nextTab) {
          tabIndex = nextTab.name;
        }
      }
    });
  }
  tabData.tabIndex = tabIndex;
  tabData.tabArr = tabData.tabArr.filter((tab) => tab.name !== targetName);
};

/**
 * 查询
 */
const query = async () => {
  // const response = await requestClient.post(
  //   import.meta.env.VITE_NSOSGZ +
  //     '/odWorkbenchClassTemplate/mHQueryDataListByPagePagination',
  //   {
  //     pageNo: currentPage.value,
  //     pageSize: pageSize.value,
  //"sortFieldName": 'workbenceClassOrder',
  //"sortType": 'asc',
  // workbenceClassName: queryForm.workbenceClassName,
  // provinceCode: queryForm.provinceCode,
  // bureauCode: queryForm.bureauCode,
  //   },
  // );
  // tableData.value = response.list;
  // total.value = response.count;
};

const resetQueryForm = () => {
  // 重置查询表单
  queryFormRef.value?.resetFields();
  query();
};

// 选择日期后的回调
const handleChangeDate = (value) => {
  queryForm.planDrillTime = value;
  console.log(queryForm);
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
</style>
