<script lang="ts" setup>
import {
  Search,
  Plus,
  RefreshLeft,
  Delete,
  Download,
  Monitor,
  CirclePlus,
  CircleCheck,
  SuccessFilled,
  Histogram,
} from '@element-plus/icons-vue';
import { reactive, ref, computed } from 'vue';

const queryForm = reactive({
  runModeName: '',
  incomeName: '',
});
const data = reactive({
  tableData: [],
  pageInfo: {
    pageSize: 5,
    pageNo: 1,
    total: 10,
  },
});

const dialogData = reactive({
  insertVisible: false, // 新增收资
  detailVisible: false, // 查看详情
  publishVisible: false, // 发布任务
  submitVisible: false, // 填报情况
});

for (let i = 0; i < 10; i++) {
  data.tableData.push({
    id: i + 1,
    runModeName: '2025年3月网络安全运行方式',
    incomeName: '2025年3月收资',
    runModeType: '月收资',
    creator: '张三',
    createTime: '2025-02-25 12:39:54',
  });
}

/**
 * 以下是弹窗方法
 */
const insertParams = reactive({
  incomeName: '',
  runModeName: '',
});

const incomeOption = [
  {
    label: '收资1',
    value: '1',
  },
  {
    label: '收资2',
    value: '2',
  },
  {
    label: '收资3',
    value: '3',
  },
];

// 新增数据
function insert() {
  dialogData.insertVisible = true;
}

// 编辑信息
function editData(val: any) {
  // dialogData.detailVisible = true;
  // detailParams.name = val.name;
}

// 下载数据
function downloadData() {
  dialogData.publishVisible = true;
}

const handleSelectionChange = (newValues) => {
  console.log('选择项', newValues);
};
</script>
<template>
  <div>
    <div>
      <el-form
        :inline="true"
        :model="queryForm"
        label-position="right"
        style="padding: 20px 0px 0px 20px"
      >
        <el-form-item label="方式名称:">
          <el-input
            v-model="queryForm.runModeName"
            style="width: 150px"
            clearable
          />
        </el-form-item>
        <el-form-item label="收资名称:">
          <el-input
            v-model="queryForm.incomeName"
            style="width: 150px"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="query"
            >搜索</el-button
          >
          <el-button type="success" :icon="Plus" @click="insert"
            >新增</el-button
          >
          <el-button type="danger" :icon="Delete" @click="deleteData"
            >删除</el-button
          >
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table ref="tab" :data="data.tableData" size="small">
        <el-table-column type="selection" />
        <el-table-column type="index" label="序号" />
        <el-table-column prop="runModeName" align="center" label="方式名称" />
        <el-table-column prop="incomeName" align="center" label="收资名称" />
        <el-table-column prop="runModeType" align="center" label="方式类型" />
        <el-table-column prop="creator" align="center" label="创建人" />
        <el-table-column prop="createTime" align="center" label="创建时间" />
        <el-table-column label="操作" align="center" width="300px">
          <template #default="scope">
            <el-button type="primary" link @click="editData(scope.row)"
              >编辑</el-button
            >
            <el-button type="primary" link @click="downloadData()"
              >下载</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-pagination
        v-model:current-page="data.pageInfo.pageNo"
        v-model:page-size="data.pageInfo.pageSize"
        :total="data.pageInfo.total"
        layout="total, prev, pager, next"
        prev-text="上一项"
        next-text="下一项"
        @current-change="currentChange"
      ></el-pagination>
    </div>
    <!-- 弹窗区域 -->
    <div>
      <el-dialog
        v-model="dialogData.insertVisible"
        title="运行方式自动编制"
        width="750"
        class="system-detail-dialog"
      >
        <el-form
          ref="queryForm"
          :model="insertParams"
          :rules="rules"
          label-width="auto"
          style="margin: 10px 0 0 20px"
        >
          <el-form-item
            label="选择收资:"
            prop="name"
            style="width: 100%"
            required
          >
            <el-select
              v-model="insertParams.incomeName"
              placeholder="请选择收资"
              style="width: 100%"
              @change="handleSelectionChange"
            >
              <el-option
                v-for="item in incomeOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="方式名称:"
            prop="runModeName"
            style="width: 100%"
            required
          >
            <el-input
              v-model="insertParams.runModeName"
              placeholder="请输入方式名称"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item class="dialog-footer">
            <el-button type="primary" @click="submitForm(queryForm)"
              >确定</el-button
            >
            <el-button @click="cancelForm(queryForm)">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<style lang="less" scoped>
.taskPublish {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px 2px 5px; /* 右侧多留点空间给图标 */
  border: 1px solid #a7e7c4;
  background-color: #f2f2f2;
  color: #66cb81;
  // border-radius: 4px;       /* 可选：圆角 */
  // font-size: 12px;          /* 可选：字体大小 */
  .el-icon {
    margin-left: 3px; /* 图标与文字间距 */
    font-size: 14px; /* 图标大小 */
  }
}

.dialog-footer {
  margin-left: calc(100% - 135px);
  // margin-top: 20px;
}

:deep(.el-dialog__title) {
  color: black;
  font-size: 20px;
  font-weight: 500;
}

// 多项选择框
.dual-select-popper {
  width: 400px !important;
}

.dual-options-container {
  display: flex;
  padding: 8px;
}

.options-column {
  flex: 1;
  border-right: 1px solid #eee;
  padding: 0 8px;
}

.options-column:last-child {
  border-right: none;
}

.column-header {
  padding: 0 10px 8px;
  font-size: 12px;
  color: #909399;
  text-align: center;
  font-weight: bold;
}

.el-select-dropdown__item {
  padding: 0 10px !important;
  height: 34px;
  line-height: 34px;
}

// .btn-link{
//   color: #64A8C5;
// }
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
// :deep(.el-table) {
//   border-left: 1px solid #fff;
// }

:deep(.el-pagination button) {
  border: 1px solid #efefef;
  color: #2074c9;
  // box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
// :deep(.el-pagination>.is-first){
//   border-right: none;
// }
:deep(.el-pagination > .is-last) {
  border-left: none;
}
:deep(.el-pager li.is-active) {
  background: #169bd5;
  color: #fff;
}
:deep(.el-pager li) {
  border: 1px solid #efefef;
  border-left: none;
  color: #027db4;
}
</style>
