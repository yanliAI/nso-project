<script setup lang="ts">
import {
  ElTable,
  ElTableColumn,
  ElContainer,
  ElFormItem,
  ElDialog,
  ElForm,
  ElInput,
  ElButton,
  ElSelect,
  ElRow,
  ElCol,
  ElPagination,
  ElMessage,
  ElMessageBox,
  type FormInstance,
} from 'element-plus';
import {
  Search,
  RefreshLeft,
  Delete,
  Download,
  Monitor,
  CirclePlus,
  CircleCheck,
  InfoFilled,
} from '@element-plus/icons-vue';
import { reactive, ref, onMounted, nextTick, computed } from 'vue';
import InsertDialog from './insertData.vue';
import UpdateDialog from './updateData.vue';
import DetailsData from './detailsData.vue';
import {
  searchRankingData,
  deleteRankingData,
  updateRankingData,
  searchScoreItem,
  insertScoreItem,
  updateScoreItem,
  deleteScoreItem,
} from '#/api';

const childDialog = ref();
const childDialog1 = ref();

const data = reactive({
  tableData: [],
  form: {
    pageSize: 10,
    pageNo: 1,
    type: 3,
    name: '',
    company: '',
    total: 0,
  },
});

const dialogData = ref({
  insertDialogVisible: false,
  updateDialogVisible: false,
});

/**
 * 数据管理
 * @param row
 */

// 查询表单
async function getData() {
  try {
    const res = await searchRankingData(data.form);
    data.tableData = res.list;
    data.form.total = res.total;
  } catch (error) {
    console.error('请求失败:', error);
  }
}

function resetData() {
  data.form.company = '';
  data.form.name = '';
  getData();
}

async function deleteData(row) {
  try {
    const obj = { id: row.id };
    await deleteRankingData(obj);
    getData();
    ElMessage.success('删除成功!');
  } catch (error) {
    console.error('请求失败:', error);
  }
}

async function insertData() {
  dialogData.value.insertDialogVisible = true;
}

async function updateData(val) {
  dialogData.value.updateDialogVisible = true;
  nextTick(() => {
    childDialog.value.getOriginData(val);
  });
}

function handleSubmitSuccess() {
  dialogData.value.updateDialogVisible = false;
  dialogData.value.insertDialogVisible = false;
  // 刷新表格
  setTimeout(() => {
    getData();
  }, 500);
}
function handleSubmitCancel() {
  dialogData.value.updateDialogVisible = false;
  dialogData.value.insertDialogVisible = false;
}
function currentChange(val: number) {
  data.form.pageNo = val;
  getData();
}
function handleSizeChange(val: number) {
  data.form.pageSize = val;
  getData();
}

onMounted(() => {
  getData();
});

/**
 * 评分细则管理页面
 */
// 配置得分详情弹窗
const dialogVisible = ref(false);
const tableData = ref([]);

function showDetails() {
  dialogVisible.value = true;
  getItem();
}

// 评分详情
async function scoreDetail(val) {
  dialogData.value.detailsDialogVisible = true;
  nextTick(() => {
    childDialog1.value.getOriginData(val);
  });
}
// 查询评分细则模板
async function getItem() {
  const obj = {
    pageNo: 1,
    pageSize: 1000,
    attackDefense: '2', // 攻击评分细则 1 ；防守 2
  };
  try {
    const res = await searchScoreItem(obj);
    tableData.value = res.list.map((item) => ({
      ...item,
      isEditing: false,
      isNew: false,
      editData: { ...item },
    }));
    // tableData.value = res.list;
  } catch (error) {
    console.error('查询评分细则失败:', error);
  }
}

// 插入评分细则
async function insertItem(obj) {
  try {
    await insertScoreItem(obj);
    getItem();
    ElMessage.success('新增成功!');
  } catch (error) {
    console.error('插入评分细则失败:', error);
  }
}

// 更新评分细则
async function updateItem(obj) {
  try {
    await updateScoreItem(obj);
    getItem();
    ElMessage.success('修改成功!');
  } catch (error) {
    console.error('更新评分细则:', error);
  }
}

// 删除评分细则
async function deleteItem(id) {
  try {
    await deleteScoreItem(id);
    getItem();
    ElMessage.success('删除成功!');
  } catch (error) {
    console.error('删除评分细则失败:', error);
  }
}

// 添加控制合并的状态变量
const enableSpan = ref(true);
// 处理表格项合并
const handleSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
  // 如果不启用合并，直接返回不合并
  if (!enableSpan.value) {
    return { rowspan: 1, colspan: 1 };
  }
  const data = tableData.value;
  const prop = column.property; // 当前列的prop属性

  // 需要合并的列（可根据实际需求调整）
  const mergeColumns = ['type', 'examine'];

  if (mergeColumns.includes(prop)) {
    let prevRow = data[rowIndex - 1];
    const currentValue = row[prop];

    // 如果当前值与上一行相同，则隐藏
    if (prevRow && prevRow[prop] === currentValue) {
      return { rowspan: 0, colspan: 0 };
    }

    // 计算连续相同值的行数
    let count = 1;
    while (
      rowIndex + count < data.length &&
      data[rowIndex + count][prop] === currentValue
    ) {
      count++;
    }
    return { rowspan: count, colspan: 1 };
  }
};

// 生成唯一ID
const generateId = () => {
  return Math.max(...tableData.value.map((item) => item.id), 0) + 1;
};

// 控制评分列是否显示
const isEditingOrNew = computed(() => {
  return tableData.value.some((row) => row.isEditing || row.isNew);
});

// 新增响应事件
const handleAdd = () => {
  // 如果已经有新增行正在编辑，则不添加
  if (tableData.value.some((item) => item.isNew && item.isEditing)) {
    ElMessage.warning('请先完成当前新增操作');
    return;
  }
  enableSpan.value = false;
  const newRow = {
    id: generateId(),
    type: '',
    examine: '',
    itemName: '',
    description: '',
    calType: '',
    isEditing: true,
    isNew: true,
    editData: {
      type: '',
      examine: '',
      itemName: '',
      description: '',
      calType: '0',
    },
  };
  tableData.value.unshift(newRow); // 添加到表格顶部
};

// 编辑响应事件
const handleEdit = (row) => {
  enableSpan.value = false;
  row.isEditing = true;
  // 深拷贝当前行数据到 editData
  row.editData = JSON.parse(
    JSON.stringify({
      type: row.type,
      examine: row.examine,
      itemName: row.itemName,
      description: row.description,
      calType: row.calType,
    }),
  );
};

// 新增/编辑保存事件
const handleSave = (row) => {
  // 校验逻辑：允许部分为空，但不能全部为空
  const { type, examine, itemName, description } = row.editData;
  const allFieldsEmpty = [type, examine, itemName, description].every(
    (field) => !field || field.trim() === '',
  );

  if (allFieldsEmpty) {
    ElMessage.error('输入为空，请添加内容');
    return; // 阻止保存
  }
  // 更新原始数据
  row.type = row.editData.type;
  row.examine = row.editData.examine;
  row.itemName = row.editData.itemName;
  row.description = row.editData.description;
  row.calType = row.editData.calType;
  const obj = {
    type: row.type,
    examine: row.examine,
    itemName: row.itemName,
    description: row.description,
    calType: row.calType,
    attackDefense: '2',
  };
  if (row.isNew) {
    insertItem(obj);
  } else {
    obj.id = row.id;
    updateItem(obj);
  }
  row.isEditing = false;
  row.isNew = false;
  enableSpan.value = true;
};

const handleCancel = (row) => {
  row.isEditing = false;
  enableSpan.value = true;
  getItem();
};

// 弹窗打开时触发,刷新数据
const insertDialogRef = ref(null);
const handleDialogOpen = () => {
  if (insertDialogRef.value) {
    insertDialogRef.value.initData(); // 调用子组件方法
  }
};

const handleCancelNew = () => {
  // 移除新增的行
  tableData.value = tableData.value.filter((item) => !item.isNew);
  getItem();
};

const handleDelete = async (row) => {
  deleteItem({ id: row.id });
};
</script>
<template>
  <div class="flex flex-col">
    <el-container class="h-full bg-white">
      <el-header class="header-box">
        <el-form
          ref="form"
          :inline="true"
          :model="data.form"
          label-position="right"
          class="demo-form-inline mt-2"
        >
          <!-- <el-form-item label="姓名:" prop="name">
            <el-input v-model="data.form.name" placeholder="请输入姓名" clearable></el-input>
          </el-form-item> -->
          <el-form-item label="公司:" prop="company">
            <el-input
              v-model="data.form.company"
              placeholder="请选择公司名称"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              class="btn-search ml-4"
              :icon="Search"
              @click="getData"
              >搜索</el-button
            >
            <el-button
              type="primary"
              class="btn-search ml-4"
              :icon="CirclePlus"
              @click="insertData"
              >新增</el-button
            >
            <el-button
              type="info"
              class="btn-reset ml-4"
              :icon="RefreshLeft"
              @click="resetData"
              >重置</el-button
            >
          </el-form-item>
          <el-form-item style="float: right">
            <el-button
              type="primary"
              link
              :icon="InfoFilled"
              @click="showDetails"
              >评分细则</el-button
            >
          </el-form-item>
        </el-form>
      </el-header>
      <el-main>
        <el-table
          ref="tab"
          :data="data.tableData"
          size="small"
          class="custom-table"
        >
          <el-table-column type="selection" />
          <el-table-column label="序号">
            <template #default="{ $index }">
              {{ (data.form.pageNo - 1) * data.form.pageSize + $index + 1 }}
            </template>
          </el-table-column>
          <!-- <el-table-column prop="name" align="center" label="姓名" /> -->
          <el-table-column prop="company" align="center" label="公司名称" />
          <el-table-column
            prop="score"
            align="center"
            label="得分"
            :formatter="(row) => Math.floor(row.score)"
          />
          <el-table-column label="操作" align="center" width="200px">
            <template #default="scope">
              <el-button type="primary" link @click="deleteData(scope.row)"
                >删除</el-button
              >
              <el-button type="primary" link @click="updateData(scope.row)"
                >修改</el-button
              >
              <el-button type="primary" link @click="scoreDetail(scope.row)"
                >得分详情</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer height="45px">
        <el-pagination
          v-model:current-page="data.form.pageNo"
          v-model:page-size="data.form.pageSize"
          :total="data.form.total"
          :size ="data.form.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="currentChange"
        ></el-pagination>
      </el-footer>
    </el-container>

    <el-dialog
      v-model="dialogData.insertDialogVisible"
      title="新增数据"
      width="1350"
      top="20px"
      class="system-detail-dialog"
      @open="handleDialogOpen"
    >
      <InsertDialog
        ref="insertDialogRef"
        :type="3"
        @submit-success="handleSubmitSuccess"
        @submit-cancel="handleSubmitCancel"
      ></InsertDialog>
    </el-dialog>
    <el-dialog
      v-model="dialogData.updateDialogVisible"
      title="更新数据"
      width="1350"
      top="20px"
      class="system-detail-dialog"
    >
      <UpdateDialog
        ref="childDialog"
        :type="3"
        @submit-success="handleSubmitSuccess"
        @submit-cancel="handleSubmitCancel"
      ></UpdateDialog>
    </el-dialog>
    <el-dialog
      v-model="dialogVisible"
      title="评分细则"
      width="1350"
      top="20px"
      class="system-detail-dialog"
      :span-method="handleSpanMethod"
    >
      <div style="display: flex; margin-bottom: 5px">
        <el-button type="primary" @click="handleAdd" style="margin-left: auto"
          >新增</el-button
        >
      </div>
      <el-table
        :data="tableData"
        border
        size="small"
        height="600px"
        :span-method="handleSpanMethod"
        class="scoring-table"
      >
        <el-table-column
          type="index"
          align="center"
          label="序号"
          width="100px"
        />
        <el-table-column prop="type" align="center" label="类别">
          <template #default="{ row }">
            <el-input v-if="row.isEditing" v-model="row.editData.type" />
            <span v-else>{{ row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="examine" align="center" label="考核">
          <template #default="{ row }">
            <el-input v-if="row.isEditing" v-model="row.editData.examine" />
            <span v-else>{{ row.examine }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="itemName" align="center" label="细项">
          <template #default="{ row }">
            <el-input v-if="row.isEditing" v-model="row.editData.itemName" />
            <span v-else>{{ row.itemName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" align="center" label="考核方式">
          <template #default="{ row }">
            <el-input v-if="row.isEditing" v-model="row.editData.description" />
            <span v-else>{{ row.description }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="calType"
          align="center"
          label="评分"
          v-if="isEditingOrNew"
        >
          <template #default="{ row }">
            <el-select v-model="row.editData.calType" placeholder="请选择类型">
              <el-option label="扣分项" value="0" />
              <el-option label="加分项" value="1" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="180px">
          <template #default="{ row }">
            <div v-if="row.isEditing">
              <el-button type="primary" size="small" @click="handleSave(row)"
                >保存</el-button
              >
              <el-button type="primary" size="small" @click="handleCancel(row)"
                >取消</el-button
              >
            </div>
            <div v-else>
              <el-button
                size="small"
                type="primary"
                link
                @click="handleEdit(row)"
                >编辑</el-button
              >
              <el-button
                type="primary"
                size="small"
                link
                @click="handleDelete(row)"
                >删除</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog
      v-model="dialogData.detailsDialogVisible"
      title="得分详情"
      width="1350"
      class="system-detail-dialog"
      top="20px"
    >
      <DetailsData
        ref="childDialog1"
        :type="2"
        @submit-success="handleSubmitSuccess"
        @submit-cancel="handleSubmitCancel"
      ></DetailsData>
    </el-dialog>
  </div>
</template>
<style lang="less" scoped>
.header-box {
  height: 60px;
  padding: 10px 20px 10px 20px;
  // display: flex;
  // align-items: center;
  // border-bottom: 1px solid #E4E4E7;
}
.custom-table {
  /* 表头样式 */
  :deep(.el-table__header) th {
    background-color: #f3f3f3; /* 表头背景色 */
    font-size: 14px;
    height: 50px !important;
    color: #515a6e;
    border-right: none !important;
    font-family: Microsoft YaHei;
  }

  // 表体
  // :deep(.el-table__body) tr {
  //   font-size: 14px;
  //   font-family: Microsoft YaHei;
  // }
  :deep(.el-table) td {
    border-right: none !important;
    /* 设置列的边框颜色和粗细 */
    font-size: 14px;
    font-weight: 500;
    font-family: Microsoft YaHei;
  }

  :deep(.el-table .cell) {
    word-break: break-all;
    line-height: 23px;
    padding: 10px;
  }
  // 整表外侧
  :deep(.el-table) {
    border-left: 1px solid #fff;
  }
}
.scoring-table {
  /* 表头样式 */
  :deep(.el-table__header) th {
    background-color: #f3f3f3; /* 表头背景色 */
    font-size: 14px;
    height: 50px !important;
    color: black;
    font-family: Microsoft YaHei;
  }

  // 表体
  // :deep(.el-table__body) tr {
  //   font-size: 14px;
  //   font-family: Microsoft YaHei;
  // }
  :deep(.el-table) td {
    border-right: none !important;
    /* 设置列的边框颜色和粗细 */
    font-size: 14px;
    font-weight: 500;
    font-family: Microsoft YaHei;
  }

  :deep(.el-table .cell) {
    word-break: break-all;
    line-height: 23px;
    padding: 10px;
  }
  // 整表外侧
  :deep(.el-table) {
    border-left: 1px solid #fff;
  }
}

// 弹窗
.dialog-footer {
  margin-left: calc(100% - 135px);
  // margin-top: 20px;
}
:deep(.el-dialog__title) {
  color: black;
  font-size: 20px;
  font-weight: 500;
}

:deep(.el-overlay),
:deep(.el-overlay-dialog) {
  width: 100%;
}
</style>
