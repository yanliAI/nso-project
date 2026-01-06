<template>
  <el-container>
    <el-header>
      <el-form
        :inline="true"
        :model="queryForm"
        label-position="right"
        style="padding: 20px 0px 0px 20px"
      >
        <el-form-item label="所属单位:">
          <el-input
            v-model="queryForm.unitName"
            style="width: 150px"
            clearable
          />
        </el-form-item>
        <!-- <el-form-item label="分类排序号:">
          <el-select v-model="queryForm.workbenceClassOrder" style="width: 150px" placeholder="请选择排序号">
          </el-select>
        </el-form-item> -->
        <el-form-item label="姓名:">
          <el-input v-model="queryForm.name" style="width: 150px" clearable />
        </el-form-item>
        <el-form-item label="手机号:">
          <el-input
            v-model="queryForm.phoneNo"
            style="width: 150px"
            clearable
          />
        </el-form-item>
        <el-form-item label="资质类型:">
          <el-select
            v-model="queryForm.qualifyType"
            style="width: 150px"
            placeholder="请选择资质类型"
            clearable
            filterable
          >
            <el-option label="安规" value="0"></el-option>
            <el-option label="签发人" value="1"></el-option>
            <el-option label="许可人" value="2"></el-option>
            <el-option label="负责人" value="3"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="资质生效时间:">
          <el-date-picker
            v-model="queryForm.startTime"
            type="datetime"
            placeholder="请选择生效时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            :default-time="defaultTime"
            @change="(value) => handleChangeTime(value, 0)"
          />
        </el-form-item>
        <el-form-item label="资质失效时间:">
          <el-date-picker
            v-model="queryForm.endTime"
            type="datetime"
            placeholder="请选择失效时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            :default-time="defaultTime"
            @change="(value) => handleChangeTime(value, 1)"
          />
        </el-form-item>
        <el-form-item label="适用单位:">
          <el-input
            v-model="queryForm.applicableUnit"
            style="width: 150px"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="query"
            >查询</el-button
          >
          <el-button type="primary" :icon="Download" @click="exportData"
            >导出</el-button
          >
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-header>
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
          prop="unit"
          label="所属单位"
          align="center"
        ></el-table-column>
        <el-table-column prop="name" label="姓名" align="center">
          <template #default="scope">
            <el-link type="primary" @click="lookProfile(scope.row)">{{
              scope.row.name
            }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="sex" label="性别" align="center" width="80">
          <template #default="scope">
            <el-tag
              :type="scope.row.sex == 0 ? 'success' : 'warning'"
              size="large"
              >{{ scope.row.sex == 0 ? '男' : '女' }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="phoneNo"
          label="手机号"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="idCard"
          label="身份证号"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="bljh"
          label="堡垒机号"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="zzlx"
          label="资质类型"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="zzsxsj"
          label="资质生效时间"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="zzsxsj2"
          label="资质失效时间"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="fz"
          label="分值"
          align="center"
        ></el-table-column>
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
  ElLink,
  ElTag,
  ElDatePicker,
} from 'element-plus';
import { Search, Download } from '@element-plus/icons-vue';
import { ref, reactive, computed, onMounted } from 'vue';
import { getPortraitPageListApi } from '#/api';
import { useRouter } from 'vue-router';

defineOptions({
  name: 'AbilityAssessment',
});

const router = useRouter();
const defaultTime = ref(new Date());
// 设置默认时间为00:00:00
defaultTime.value.setHours(0, 0, 0);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);
const table = ref(null);
const tableData = ref([
  { unit: '广东电网有限公司/临时机构', name: '张三', sex: 0 },
  { unit: '广东电网有限公司/临时机构', name: '李四', sex: 1 },
]);
const selectedRows = ref([]);
const queryForm = reactive({
  unitName: '',
  name: '',
  phoneNo: '',
  qualifyType: '',
  startTime: '',
  endTime: '',
  applicableUnit: '',
});

/**
 * 查询
 */
const query = async () => {
  try {
    const response = await getPortraitPageListApi({
      pageNo: currentPage.value,
      pageSize: pageSize.value,
      sortFieldName: 'workbenceClassOrder',
      sortType: 'asc',
      workbenceClassName: queryForm.workbenceClassName,
      provinceCode: queryForm.provinceCode,
      bureauCode: queryForm.bureauCode,
    });
    tableData.value = response.records;
    total.value = response.total;
  } catch {}
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

const reset = () => {
  queryForm.unitName = '';
  queryForm.name = '';
  queryForm.phoneNo = '';
  queryForm.qualifyType = '';
  queryForm.startTime = '';
  queryForm.endTime = '';
  queryForm.applicableUnit = '';
  query();
};

const lookProfile = (row) => {
  console.log('点击了', row.name);
  router.push({ path: '/workPlanBalance/profileDetail', query: { ...row } });
};

// 选择生效时间/失效时间的回调
const handleChangeTime = (value, timeType) => {
  if (timeType == 0) {
    queryForm.startTime = value;
  }
  if (timeType == 1) {
    queryForm.endTime = value;
  }
  console.log(queryForm);
  if (
    queryForm.startTime &&
    queryForm.endTime &&
    new Date(queryForm.startTime) > new Date(queryForm.endTime)
  ) {
    ElMessage.warning('生效时间不能大于失效时间');
    return;
  }
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
.el-header {
  height: 100px;
}
.cell {
  text-align: center;
}
</style>
