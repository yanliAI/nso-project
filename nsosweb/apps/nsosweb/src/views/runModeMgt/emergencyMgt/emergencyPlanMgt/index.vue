<template>
  <Page auto-content-height>
    <el-tabs
      ref="myTab"
      v-model="tabData.tabIndex"
      @tab-remove="removeTab"
      type="card"
      class="h-full w-full bg-white"
    >
      <el-tab-pane label="应急预案管理" name="list" :closable="false">
        <el-container>
          <el-form
            ref="queryFormRef"
            :inline="true"
            :model="queryForm"
            label-position="right"
            style="padding: 16px 20px 0"
          >
            <el-form-item label="应急预案名称:" prop="planName">
              <el-input
                v-model="queryForm.planName"
                clearable
                style="width: 180px"
              />
            </el-form-item>
            <el-form-item label="颁布日期:" prop="enactmentDate">
              <el-date-picker
                v-model="queryForm.enactmentDate"
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
                v-model="queryForm.sysName"
                clearable
                style="width: 180px"
              />
            </el-form-item>
            <el-form-item label="设备主人:" prop="deviceOwner">
              <el-input
                v-model="queryForm.deviceOwner"
                clearable
                style="width: 180px"
              />
            </el-form-item>
            <el-form-item label="应急预案类型:" prop="planType">
              <el-select
                v-model="queryForm.planType"
                style="width: 180px"
                placeholder="请选择"
                clearable
                filterable
              >
                <el-option label="专项" value="1"></el-option>
                <el-option label="综合" value="2"></el-option>
                <el-option label="应急" value="3"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" :icon="Search" @click="query"
                >查询</el-button
              >
              <el-button
                type="primary"
                :icon="CirclePlus"
                @click="addPlanMethod"
                >新增</el-button
              >
              <el-button type="info" :icon="RefreshLeft" @click="reset"
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
                prop="planNo"
                label="应急预案编号"
                align="center"
              >
                <!-- <template #default="scope">
              <el-link type="primary" @click="lookJobDetail(scope.row)">{{
                scope.row.planNo
              }}</el-link>
            </template> -->
              </el-table-column>
              <el-table-column
                prop="versionName"
                label="应急预案版本号"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="planName"
                label="应急预案名称"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="planType"
                label="应急预案类型"
                align="center"
                width="120"
              >
                <template #default="scope">
                  <span v-if="scope.row.planType == 1">专项</span>
                  <span v-else-if="scope.row.planType == 2">综合</span>
                  <span v-else-if="scope.row.planType == 3">应急</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="sysName"
                label="系统名称"
                align="center"
                width="120"
              ></el-table-column>
              <el-table-column
                prop="status"
                label="状态"
                align="center"
                width="120"
              >
                <template #default="scope">
                  <el-tag
                    v-if="scope.row.status == 1"
                    type="success"
                    size="large"
                    >已发布
                    <CircleCheck
                      style="width: 1em; display: inline; margin-left: 5px"
                    />
                  </el-tag>
                  <el-tag
                    v-if="scope.row.status == 2"
                    type="primary"
                    size="large"
                    >未发布
                    <CircleCheck
                      style="width: 1em; display: inline; margin-left: 5px"
                    />
                  </el-tag>
                </template>
              </el-table-column>

              <el-table-column
                prop="deviceOwner"
                label="设备主人"
                align="center"
                width="120"
              ></el-table-column>
              <el-table-column prop="startDate" label="颁布日期" align="center">
              </el-table-column>
              <el-table-column
                prop="updateDate"
                label="修订日期"
                align="center"
              >
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template #default="scope">
                  <el-button
                    type="primary"
                    link
                    @click="lookPlanDetail(scope.row)"
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
        <add-plan
          v-if="item.type == 'add'"
          :tabName="item.name"
          @removeTab="removeTab"
        ></add-plan>
        <PlanDetail
          v-if="item.type == 'detail'"
          :tabName="item.name"
          @removeTab="removeTab"
        ></PlanDetail>
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
  ElHeader,
  ElMain,
  ElFooter,
  ElRow,
  ElCol,
  ElDialog,
  ElMessage,
  ElMessageBox,
  ElText,
  ElLink,
  ElTag,
} from 'element-plus';
import {
  Search,
  RefreshLeft,
  Download,
  Monitor,
  CirclePlus,
  CircleCheck,
} from '@element-plus/icons-vue';
import { Page } from '@vben/common-ui';
import { ref, reactive, computed, onMounted } from 'vue';
import AddPlan from './addPlan.vue';
import PlanDetail from './planDetail.vue';
import { requestClient } from '#/api/request';

defineOptions({
  name: 'EmergencyPlanMgt',
});
const queryFormRef = ref();
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);
const table = ref(null);
const tableData = ref([
  {
    planNo: 'TPM-00-20240828-00642',
    status: 1,
    startDate: '2024-9-23',
    updateDate: '2024-9-24',
    planType: 2,
  },
  {
    planNo: 'TPM-00-20240828-00642',
    status: 1,
    startDate: '2024-9-23',
    updateDate: '2024-9-24',
  },
]);
const selectedRows = ref([]);
const queryForm = reactive({
  planName: '',
  enactmentDate: '',
  sysName: '',
  deviceOwner: '',
  planType: '',
});

const tabData = reactive({
  tabIndex: 'list',
  tabArr: [],
});

/**
 * 新增预案
 */
const addPlanMethod = () => {
  let tab = {};
  tab.name = new Date().getTime() + '';
  tab.title = '新增预案';
  tab.id = null;
  tab.type = 'add';
  tabData.tabArr.push(tab);
  // 切换到新增页面
  tabData.tabIndex = tab.name;
};

/**
 * 查看预案详情
 */
const lookPlanDetail = (row) => {
  let tab = {};
  tab.name = new Date().getTime() + '';
  tab.title = '预案详情';
  tab.id = null;
  tab.type = 'detail';
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

/**
 * 导出数据
 */
const exportData = async () => {
  if (selectedRows.value.length <= 0) {
    ElMessage.warning('请选择需要导出的数据');
    return;
  }
  console.log('导出的数据', selectedRows.value);
};
/**
 * 查看详情
 */
const preview = (item) => {
  console.log(item);
};

const reset = () => {
  // 重置查询表单
  queryFormRef.value?.resetFields();
  query();
};

// 选择日期后的回调
const handleChangeDate = (value) => {
  queryForm.enactmentDate = value;
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
