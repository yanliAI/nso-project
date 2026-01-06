<template>
  <el-container>
    <div>
      <el-form
        :inline="true"
        :model="queryForm"
        label-position="right"
        style="padding: 20px 0px 0px 20px"
      >
        <el-form-item label="规则编号:">
          <el-input v-model="queryForm.ruleCode" clearable />
        </el-form-item>
        <el-form-item label="规则名称:">
          <el-input v-model="queryForm.ruleName" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="query"
            >查询
          </el-button>
          <el-button type="primary" :icon="Plus" @click="addData"
            >新增
          </el-button>
          <el-button type="danger" :icon="Delete" @click="deleteData"
            >删除
          </el-button>
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
        style="width: 100%; height: 500px"
      >
        <el-table-column type="index" align="center" />
        <el-table-column type="selection" :selectable="selectable" />

        <!-- <el-table-column prop="sex" label="规则编号" align="center" width="80">
          <template #default="scope">
            <el-tag
              :type="scope.row.sex == 1 ? 'success' : 'warning'"
              size="large"
              >{{ scope.row.sex == 1 ? '男' : '女' }}</el-tag
            >
          </template>
        </el-table-column> -->
        <el-table-column prop="ruleCode" label="规则编号" align="center">
          <template #default="{ row, $index }">
            <el-input
              v-if="row.updateable"
              v-model="row.ruleCode"
              clearable
              maxlength="50"
            ></el-input>
            <span v-else>{{ row.ruleCode }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ruleName" label="规则名称" align="center">
          <template #default="{ row, $index }">
            <el-input
              v-if="row.updateable"
              v-model="row.ruleName"
              clearable
              maxlength="50"
            ></el-input>
            <span v-else>{{ row.ruleName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ruleVale" label="规则阈值" align="center">
          <template #default="{ row, $index }">
            <el-input
              v-if="row.updateable"
              v-model="row.ruleValue"
              clearable
              maxlength="50"
            ></el-input>
            <span v-else style="color: #3296fa">{{ row.ruleValue }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ruleDesc" label="规则说明" align="center">
          <template #default="{ row, $index }">
            <el-input
              v-if="row.updateable"
              v-model="row.ruleDesc"
              clearable
              maxlength="50"
            ></el-input>
            <span v-else>{{ row.ruleDesc }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remarks" label="备注" align="center">
          <template #default="{ row, $index }">
            <el-input
              v-if="row.updateable"
              v-model="row.remarks"
              clearable
              maxlength="200"
            ></el-input>
            <el-tooltip
              v-else
              effect="light"
              :content="row.remarks"
              placement="bottom"
              popper-class="custom-tooltip"
            >
              <span class="max-lines">{{ row.remarks }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template #default="{ row, $index }">
            <el-button
              type="primary"
              link
              @click="row.updateable = true"
              v-if="!row.updateable"
              >编辑
            </el-button>
            <el-button
              type="primary"
              link
              @click="saveData(row)"
              v-if="row.updateable"
              >保存
            </el-button>
            <el-button
              type="primary"
              link
              @click="row.updateable = false"
              v-if="row.updateable"
              >取消
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
import { Search, Plus, Delete, Check } from '@element-plus/icons-vue';
import { ref, reactive, computed, onMounted } from 'vue';
import {
  getExportAssessPageListApi,
  saveOrUpdateExportAssessApi,
  deleteExportAssessApi,
} from '#/api';
import { useRouter } from 'vue-router';

defineOptions({
  name: 'ZJKSetting',
});

const router = useRouter();
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);
const table = ref(null);
const tableData = ref([]);
const selectedRows = ref([]);
const queryForm = reactive({
  ruleCode: '',
  ruleName: '',
});

/**
 * 查询
 */
const query = async () => {
  const response = await getExportAssessPageListApi({
    pageNo: currentPage.value,
    pageSize: pageSize.value,
    ruleCode: queryForm.ruleCode,
    ruleName: queryForm.ruleName,
  });
  tableData.value = response.records;
  total.value = response.total;
};

const reset = () => {
  queryForm.ruleCode = '';
  queryForm.ruleName = '';
  query();
};

/**
 * 添加规则
 */
const addData = () => {
  tableData.value.push({
    updateable: true,
    isAdd: true,
  });
};
const selectable = (row) => !row.isAdd;

/**
 * 删除规则
 */
const deleteData = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要删除的数据');
    return;
  }
  ElMessageBox.confirm('确定要删除所选规则吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      let ids = selectedRows.value.map((item) => item.id);
      let result = await deleteExportAssessApi(ids);
      if (result) {
        ElMessage.success('删除成功');
        query();
      }
    })
    .catch(() => {});
};

/**
 * 保存规则
 */
const saveData = async (row) => {
  if (!row.ruleCode) {
    ElMessage.warning('请输入规则编号');
    return;
  }
  if (!row.ruleName) {
    ElMessage.warning('请输入规则名称');
    return;
  }
  if (!row.ruleValue) {
    ElMessage.warning('请输入规则阈值');
    return;
  }
  try {
    let result = await saveOrUpdateExportAssessApi({
      id: row.id,
      remarks: row.remarks,
      ruleCode: row.ruleCode,
      ruleDesc: row.ruleDesc,
      ruleName: row.ruleName,
      ruleValue: row.ruleValue,
    });
    if (result) {
      ElMessage.success('保存成功');
      query();
    }
  } catch {}
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
.max-lines {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4; /* 限制显示行数 */
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
