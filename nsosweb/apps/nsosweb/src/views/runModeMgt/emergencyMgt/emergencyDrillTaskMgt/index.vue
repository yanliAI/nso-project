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
                v-model="queryForm.drillName"
                clearable
                style="width: 180px"
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

            <el-form-item label="演练形式:" prop="drillForm">
              <el-select
                v-model="queryForm.drillForm"
                style="width: 180px"
                placeholder="请选择"
                clearable
                filterable
              >
                <el-option label="实战演练" value="1"></el-option>
                <el-option label="线上演练" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态:" prop="status">
              <el-select
                v-model="queryForm.status"
                style="width: 180px"
                placeholder="请选择"
                clearable
                filterable
              >
                <el-option label="已发布" value="1"></el-option>
                <el-option label="未发布" value="2"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" :icon="Search" @click="query"
                >查询</el-button
              >
              <el-button type="primary" :icon="CirclePlus" @click="addDrillTask"
                >新增</el-button
              >
              <el-button type="danger" :icon="Delete" @click="deleteTask"
                >删除</el-button
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
                prop="drillNo"
                label="应急演练编号"
                align="center"
              >
                <!-- <template #default="scope">
              <el-link type="primary" @click="lookJobDetail(scope.row)">{{
                scope.row.planNo
              }}</el-link>
            </template> -->
              </el-table-column>
              <el-table-column
                prop="drillName"
                label="应急演练名称"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="drillForm"
                label="演练形式"
                align="center"
                width="120"
              >
                <template #default="scope">
                  <span v-if="scope.row.drillForm == 1">实战演练</span>
                  <span v-else-if="scope.row.drillForm == 2">线上演练</span>
                </template>
              </el-table-column>
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
                </template>
              </el-table-column>

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
                  <el-button type="primary" link @click="lookDetail(scope.row)"
                    >查看</el-button
                  >
                  <el-button type="danger" link @click="revocation(scope.row)"
                    >撤回</el-button
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
        <AddDrillTask
          v-if="item.type == 'add'"
          :tabName="item.name"
          @removeTab="removeTab"
        ></AddDrillTask>
        <DrillTaskDetail
          v-if="item.type == 'detail'"
          :tabName="item.name"
          @removeTab="removeTab"
        ></DrillTaskDetail>
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
import AddDrillTask from './addDrillTask.vue';
import DrillTaskDetail from './drillTaskDetail.vue';
import { requestClient } from '#/api/request';

defineOptions({
  name: 'EmergencyDrillTaskMgt',
});
const queryFormRef = ref();
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);
const table = ref(null);
const tableData = ref([
  {
    drillNo: 'TPM-00-20240828-00642',
    drillName: '电网管理平台（人资域）应急演练',
    drillForm: 1,
    status: 1,
    planDrillTime: '2024-9-23',
    drillTime: '2024-9-24',
  },
  {
    drillNo: 'TPM-00-20240828-00642',
    drillName: '电网管理平台（人资域）应急演练',
    drillForm: 2,
    status: 2,
    planDrillTime: '2024-9-23',
    drillTime: '2024-9-24',
  },
]);
const selectedRows = ref([]);
const queryForm = reactive({
  drillName: '',
  planDrillTime: '',
  drillForm: '',
  status: '',
});

const tabData = reactive({
  tabIndex: 'list',
  tabArr: [],
});

/**
 * 新增演练任务
 */
const addDrillTask = () => {
  let tab = {};
  tab.name = new Date().getTime() + '';
  tab.title = '新增应急演练任务';
  tab.id = null;
  tab.type = 'add';
  tabData.tabArr.push(tab);
  // 切换到新增页面
  tabData.tabIndex = tab.name;
};

/**
 * 查看预案详情
 */
const lookDetail = (row) => {
  let tab = {};
  tab.name = new Date().getTime() + '';
  tab.title = '任务详情';
  tab.id = null;
  tab.type = 'detail';
  tabData.tabArr.push(tab);
  // 切换到新增页面
  tabData.tabIndex = tab.name;
};

const revocation = (row) => {
  ElMessageBox.confirm('是否确认撤回?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    console.log('撤回：', row);
  });
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
 * 删除任务
 */
const deleteTask = () => {
  if (selectedRows.value.length <= 0) {
    ElMessage.warning('请选择需要删除的数据');
    return;
  }
  ElMessageBox.confirm('是否确认删除这些演练任务?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    console.log('删除：', selectedRows.value);
  });
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
