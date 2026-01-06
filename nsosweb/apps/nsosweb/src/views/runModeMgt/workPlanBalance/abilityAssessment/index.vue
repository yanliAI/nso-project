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
        <el-form-item style="float: right">
          <el-button type="primary" link @click="paramsSetting">
            <el-icon :size="24"> <Setting style="margin-right: 5px" /> </el-icon
            >参数设置</el-button
          >
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
          prop="abilityScore"
          label="能力得分"
          align="center"
          width="100"
          :formatter="(row) => parseFloat(row.abilityScore).toFixed(2)"
        ></el-table-column>
        <el-table-column
          prop="qualificationScore"
          label="资质得分"
          align="center"
          width="100"
          :formatter="(row) => parseFloat(row.qualificationScore).toFixed(2)"
        ></el-table-column>
        <el-table-column
          prop="degreeCode"
          label="文化程度"
          align="center"
          width="100"
        ></el-table-column>

        <el-table-column
          prop="capHandWorkload"
          label="可承担工作量"
          align="center"
        ></el-table-column>

        <el-table-column prop="qualifyType" label="资质类型" align="center">
          <template #default="scope">
            <!-- {{ transformQualifyType(scope.row.qualifyType) }} -->
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

    <!-- 参数设置弹框 -->
    <el-dialog
      v-model="paramDialogData.visible"
      title="人员能力评估规则设置"
      width="1100"
    >
      <el-form :inline="true" style="padding: 20px 0px 0px 20px">
        <el-form-item label="最后修改人:">
          <el-input
            v-model="paramDialogData.modifier"
            style="width: 150px"
            disabled
          />
        </el-form-item>
        <el-form-item label="最后修改时间:">
          <el-input
            v-model="paramDialogData.updateTime"
            style="width: 150px"
            disabled
          />
        </el-form-item>
      </el-form>
      <el-table
        ref="paramDataTableRef"
        border
        stripe
        :data="paramDialogData.tableData"
        :span-method="customSpanMethod"
      >
        <el-table-column
          prop="customTag"
          label="类别"
          align="center"
        ></el-table-column>
        <el-table-column prop="weight" label="权重" align="center">
          <template #default="{ row, $index }">
            <el-input
              v-model="row.weight"
              placeholder="请输入"
              @input="($event) => handleDecimalInput($event, $index)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="recommValue"
          label="建议值"
          align="center"
        ></el-table-column>
        <el-table-column prop="remarks" label="备注" align="center">
          <template #default="{ row, $index }">
            <el-input
              v-model="row.remarks"
              placeholder="请输入"
              maxlength="100"
            />
          </template>
        </el-table-column>
      </el-table>

      <div
        class="flex items-center"
        style="border: solid 1px #eee; margin-top: 20px; height: 40px"
      >
        <p class="dialog-bottom" style="background: #f4f4f4">模型校验</p>
        <p class="dialog-bottom">人员</p>
        <div style="flex: 1; padding: 0 10px">
          <el-select
            v-model="paramDialogData.persion"
            placeholder="请选择"
            clearable
            filterable
            @change="handlePersionChange"
          >
            <el-option
              v-for="item in personnelList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>

        <p
          class="dialog-bottom"
          style="border-left: 1px solid #ccc; color: #ff0000"
        >
          可承接工作量评估工作结果
        </p>
        <p class="dialog-bottom">
          {{ paramDialogData.assessCode }}
        </p>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="paramDialogData.visible = false">关闭</el-button>
          <el-button type="primary" @click="saveAssessParameter"
            >保存
          </el-button>
        </div>
      </template>
    </el-dialog>
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
import {
  getAbilityPageListApi,
  getAssessParameterConfigApi,
  getPersonnelListApi,
  getAssessApi,
  saveAssessParameterApi,
} from '#/api';
import { useRouter } from 'vue-router';
import { downloadFile } from '#/utils/download.ts';

defineOptions({
  name: 'AbilityAssessment',
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
const paramDataTableRef = ref();
const personnelList = ref([]);
const paramDialogData = ref({
  visible: false,
  modifier: '',
  updateTime: '',
  tableData: [],
  persion: '',
  assessCode: '',
});
const tableData = ref([{ name: '张三' }]);
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
  const response = await getAbilityPageListApi({
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
      import.meta.env.VITE_NSOSFS + '/portraitBasic/exportAbilityList',
      params,
      '作业人员列表.xlsx',
    );
  } catch {}
};

const paramsSetting = async () => {
  paramDialogData.value.visible = true;
  paramDialogData.value.persion = '';
  paramDialogData.value.assessCode = '';
  // 获取人员列表
  personnelList.value = await getPersonnelListApi();
  try {
    let result = await getAssessParameterConfigApi();
    paramDialogData.value.modifier = result.updaterId;
    paramDialogData.value.updateTime = result.updateTime;
    paramDialogData.value.tableData = result.configs;
  } catch {}
};

const customSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
  if (columnIndex === 0) {
    // 获取当前单元格的值
    const currentValue = row[column.property];
    // 获取当前表格数据
    let tableData = paramDataTableRef.value?.store?.states?.data.value;
    // 获取上一行相同列的值
    const preRow = tableData[rowIndex - 1];
    const preValue = preRow ? preRow[column.property] : null;

    // 如果当前值和上一行的值相同，则将当前单元格隐藏
    if (currentValue === preValue) {
      return { rowspan: 0, colspan: 0 };
    } else {
      // 否则计算当前单元格应该跨越多少行
      let rowspan = 1;
      for (let i = rowIndex + 1; i < tableData.length; i++) {
        const nextRow = tableData[i];
        const nextValue = nextRow[column.property];
        if (nextValue === currentValue) {
          rowspan++;
        } else {
          break;
        }
      }
      return { rowspan, colspan: 1 };
    }
  }
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

const handleDecimalInput = (value, index) => {
  // 数字和最多2位小数
  const regex = /^\d*\.?\d{0,2}$/;
  const numericValue = parseFloat(value);

  if (!regex.test(value) || numericValue > 1) {
    // 截取有效部分
    const match = value.match(/^\d*\.?\d{0,2}/);
    let validValue = match ? match[0] : '';

    // 确保数值不超过1
    if (validValue && parseFloat(validValue) > 1) {
      validValue = '1.00';
    }

    paramDialogData.value.tableData[index].weight = validValue;
  }
};

const limitPhoneNoLength = () => {
  if (queryForm.phoneNo && queryForm.phoneNo.length > 11) {
    queryForm.phoneNo = queryForm.phoneNo.slice(0, 11);
  }
};

// const getPersonnelList = async () => {
//   try {
//     personnelList.value = await getPersonnelListApi();
//   } catch {}
// };

const handlePersionChange = async () => {
  if (!paramDialogData.value.persion) {
    paramDialogData.value.assessCode = '';
    return;
  }
  try {
    paramDialogData.value.assessCode = await getAssessApi(
      paramDialogData.value.persion,
      paramDialogData.value.tableData,
    );
  } catch {}
};

/**
 * 保存参数设置
 */
const saveAssessParameter = async () => {
  const totalCode = paramDialogData.value.tableData.reduce(
    (total, item) => total + parseFloat(item.weight),
    0,
  );
  if (totalCode > 1) {
    ElMessage.warning('权重超出限制范围');
    return;
  }
  try {
    let result = await saveAssessParameterApi(paramDialogData.value.tableData);
    if (result) {
      ElMessage.success('保存成功');
      paramDialogData.value.visible = false;
      query();
    }
  } catch {
    ElMessage.error('保存失败');
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
