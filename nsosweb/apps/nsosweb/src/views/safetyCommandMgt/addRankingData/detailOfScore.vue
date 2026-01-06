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
  ElCard,
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
} from '@element-plus/icons-vue';
import { reactive, ref, onMounted, nextTick, computed } from 'vue';
import InsertDialog from './insertData.vue'
import UpdateDialog from './updateData.vue'
import {searchRankingData, deleteRankingData, updateRankingData} from '#/api'
import {searchScoreItem } from '#/api';

const childDialog = ref();

const data = reactive({
  tableData: [],
  form: {
    pageSize: 10,
    pageNo: 1,
    type: 1,
    name: '',
    company: '',
    total: 10,
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
    // console.log(res.list)
  } catch (error) {
    console.error("请求失败:", error);
  }
}

async function deleteData(row) {
  try {
    const obj = { id: row.id };
    await deleteRankingData(obj);
    getData();
    ElMessage.success('删除成功!');
  } catch (error) {
    console.error("请求失败:", error);
  }

}


function resetData() {
  data.form.company = '';
  data.form.name = '';
  getData();
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
  getData();
  // setTimeout(() => {
  //   getData();
  // }, 500);
}
function handleSubmitCancel() {
  dialogData.value.updateDialogVisible = false;
  dialogData.value.insertDialogVisible = false;
}

function currentChange(val){
  data.form.pageNo = val;
  getData();
}

onMounted(() => {
  getData();
})

/**
 * 评分细则
 */
// 配置得分详情弹窗
const dialogVisible = ref(true);
function showDetails(item) {
  dialogVisible.value = true;
} 


// // 添加筛选功能
// // 1.自动生成考核列的筛选项
// const categoryFilters = computed(() => {
//   const categorys = [...new Set(detailParams.tableName.map(item => item.category))];
//   return categorys.map(category => ({
//     text: category,
//     value: category
//   }));
// });

// // 2. 筛选事件
// // 标准筛选处理器
// const filterHandler = (value, row, column) => {
//     const property = column.property
//     return property ? row[property] === value : true
//   }

</script>
<template>
  <div>
    <el-container class="h-full bg-white">
      <el-header class="header-box">
        <el-form
          ref="form"
          :inline="true"
          :model="data.form"
          label-position="right"
          class="demo-form-inline mt-2"
        >
          <el-form-item label="姓名:" prop="name">
            <el-input v-model="data.form.name" placeholder="请输入姓名" clearable></el-input>
          </el-form-item>
          <el-form-item label="公司:" prop="company">
            <el-input v-model="data.form.company" placeholder="请选择公司名称" clearable></el-input>
            </el-form-item>
          <el-form-item>
            <el-button
                type="primary"
                class="ml-4 btn-search"
                :icon="Search"
                @click="getData"
            >搜索</el-button>
            <el-button
               type="primary"
               class="ml-4 btn-search"
               :icon="CirclePlus"
               @click="insertData"
            >新增</el-button>
            <el-button
                type="primary"
                class="ml-4 btn-reset"
                :icon="RefreshLeft"
                @click="resetData"
             >重置</el-button>
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
          <!-- <el-table-column type="index" label="序号" /> -->
          <el-table-column 
            label="序号" 
          >
            <template #default="{ $index }">
              {{ (data.form.pageNo - 1) * data.form.pageSize + $index + 1 }}
            </template>
          </el-table-column>
          <el-table-column prop="name" align="center" label="姓名" />
          <el-table-column prop="company" align="center" label="公司名称" />
          <el-table-column prop="score" align="center" label="得分" />
          <el-table-column label="操作" align="center" width="200px">
            <template #default="scope">
              <el-button class="btn-link" link @click="deleteData(scope.row)" >删除</el-button>
              <el-button class="btn-link" link @click="updateData(scope.row)" >修改</el-button>
              <el-button class="btn-link" link @click="showDetails(scope.row)" >评分细则</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer height="45px">
        <el-pagination
          v-model:current-page="data.form.pageNo"
          v-model:page-size="data.form.pageSize"
          :total="data.form.total"
          layout="total, prev, pager, next"
          prev-text="上一项"
          next-text="下一项"
          @current-change="currentChange"
        ></el-pagination>
      </el-footer>
    </el-container>
  </div>
</template>
<style lang="less" scoped>
.header-box{
  height: 60px;
  padding: 10px 20px 10px 20px;
  // display: flex;
  // align-items: center;
  // border-bottom: 1px solid #E4E4E7;
}
.custom-table{
  /* 表头样式 */
  :deep(.el-table__header) th {
    background-color: #F3F3F3; /* 表头背景色 */
    font-size: 14px;
    height: 50px !important;
    color: #515A6E;
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
.scoring-table{
  /* 表头样式 */
  :deep(.el-table__header) th {
    background-color: #F3F3F3; /* 表头背景色 */
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

// 卡片内部样式
.ranking-Info {
  font-size: 16px;
  & > span:first-child {
    width: 50px;
    display: inline-block;
  }
  & > span:second-child {
    color: black;
  }
}
.card-header {
  padding: 10px;
  font-size: 16px;
  font-weight: bold;
}
:deep(.el-card__header) {
  padding: 0;
}
</style>