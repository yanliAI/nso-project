<template>
  <el-container>
    <div>
      <el-form
        :inline="true"
        :model="queryForm"
        label-position="right"
        style="padding: 20px 0px 0px 20px"
      >
        <el-form-item label="所属单位:">
          <el-input v-model="queryForm.unitName" clearable maxlength="50" />
        </el-form-item>
        <!-- <el-form-item label="分类排序号:">
          <el-select v-model="queryForm.workbenceClassOrder" style="width: 150px" placeholder="请选择排序号">
          </el-select>
        </el-form-item> -->
        <el-form-item label="姓名:">
          <el-input v-model="queryForm.name" clearable maxlength="50" />
        </el-form-item>
        <el-form-item label="手机号:">
          <el-input
            v-model="queryForm.phoneNo"
            clearable
            type="number"
            @input="limitPhoneNoLength"
          />
        </el-form-item>
        <el-form-item label="资质类型:">
          <el-select
            v-model="queryForm.existingQualify"
            style="width: 200px"
            placeholder="请选择"
            multiple
            clearable
            filterable
          >
            <el-option label="签发人" value="签发人"></el-option>
            <el-option label="负责人" value="负责人"></el-option>
            <el-option label="许可人" value="许可人"></el-option>
            <el-option label="安规" value="安规"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="性别:">
          <el-select
            v-model="queryForm.sex"
            style="width: 150px"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文化程度:">
          <el-select
            v-model="queryForm.degreeCode"
            style="width: 200px"
            placeholder="请选择"
            clearable
            filterable
            multiple
          >
            <el-option label="小学" value="小学"></el-option>
            <el-option label="初中" value="初中"></el-option>
            <el-option label="高中" value="高中"></el-option>
            <el-option label="大专" value="大专"></el-option>
            <el-option label="本科" value="本科"></el-option>
            <el-option label="硕士研究生" value="硕士研究生"></el-option>
            <el-option label="博士研究生" value="博士研究生"></el-option>
          </el-select>
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
    </div>
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
        <el-table-column prop="name" label="人员姓名" align="center">
          <template #default="scope">
            <el-link
              type="primary"
              :underline="false"
              @click="lookProfile(scope.row)"
              >{{ scope.row.name }}</el-link
            >
          </template>
        </el-table-column>
        <el-table-column prop="sex" label="性别" align="center" width="80">
          <template #default="scope">
            <el-tag
              :type="scope.row.sex == 1 ? 'success' : 'warning'"
              size="large"
              >{{ scope.row.sex == 1 ? '男' : '女' }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="phoneNumber"
          label="手机号"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="degreeCode"
          label="文化程度"
          align="center"
          width="100"
        ></el-table-column>
        <el-table-column prop="qualifyTypeList" label="资质类型" align="center">
          <template #default="scope">
            {{ scope.row.qualifyTypeList?.join(',') }}
          </template>
        </el-table-column>
        <el-table-column
          prop="unitName"
          label="所属单位"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="idNumber"
          label="身份证号"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button type="primary" link @click="lookProfile(scope.row)"
              >查看详细</el-button
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
} from 'element-plus';
import { Search, Download, Setting } from '@element-plus/icons-vue';
import { ref, reactive, computed, onMounted } from 'vue';
import { getPortraitPageListApi } from '#/api';
import { useRouter } from 'vue-router';
import { downloadFile } from '#/utils/download.ts';

defineOptions({
  name: 'AbilityProfile',
});

const qualifyTypeMap = {
  '1': '签发人',
  '2': '负责人',
  '3': '许可人',
  '4': '安规',
};

const router = useRouter();
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);
const table = ref(null);
const tableData = ref([]);
const selectedRows = ref([]);
const queryForm = reactive({
  unitName: '',
  name: '',
  phoneNo: '',
  existingQualify: [],
  idCard: '',
  educationalLevel: '',
  sex: '',
  degreeCode: [],
});

/**
 * 查询
 */
const query = async () => {
  const response = await getPortraitPageListApi({
    pageNo: currentPage.value,
    pageSize: pageSize.value,
    name: queryForm.name,
    phoneNumber: queryForm.phoneNo,
    qualifyType: queryForm.existingQualify,
    unitName: queryForm.unitName,
    sex: queryForm.sex,
    degreeCodeList: queryForm.degreeCode,
  });
  tableData.value = response.records;
  total.value = response.total;
};

const transformQualifyType = (qualifyTypes) => {
  if (!qualifyTypes) {
    return '';
  }
  return qualifyTypes
    ?.map((item) => {
      return qualifyTypeMap[item];
    })
    ?.join(',');
};

/**
 * 导出数据
 */
const exportData = async () => {
  // if (selectedRows.value.length <= 0) {
  //   ElMessage.warning('请选择需要导出的数据');
  //   return;
  // }
  let params = {
    pageNo: currentPage.value,
    pageSize: pageSize.value,
    name: queryForm.name,
    phoneNumber: queryForm.phoneNo,
    qualifyType: queryForm.existingQualify,
    unitName: queryForm.unitName,
    sex: queryForm.sex,
    degreeCodeList: queryForm.degreeCode,
  };

  try {
    await downloadFile(
      import.meta.env.VITE_NSOSFS + '/portraitBasic/exportPortraitList',
      params,
      '作业人员列表.xlsx',
    );
  } catch {}
};

const reset = () => {
  queryForm.unitName = '';
  queryForm.name = '';
  queryForm.phoneNo = '';
  queryForm.existingQualify = [];
  queryForm.idCard = '';
  queryForm.educationalLevel = '';
  queryForm.sex = '';
  queryForm.degreeCode = [];
  query();
};

const lookProfile = (row) => {
  router.push({
    path: '/workPlanBalance/profileDetail',
    query: { id: row.id },
  });
};

const limitPhoneNoLength = () => {
  if (queryForm.phoneNo && queryForm.phoneNo.length > 11) {
    queryForm.phoneNo = queryForm.phoneNo.slice(0, 11);
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

.dialog-bottom {
  flex: 1;
  height: 100%;
  line-height: 35px;
  text-align: center;
  border-right: 1px solid #ccc;
}
</style>
