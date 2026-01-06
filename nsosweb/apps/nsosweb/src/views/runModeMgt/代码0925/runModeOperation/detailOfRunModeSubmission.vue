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
  name: '',
  state: '',
  type: '',
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
  submitVisible: false, // 填报情况
});

for (let i = 0; i < 11; i++) {
  data.tableData.push({
    id: i + 1,
    name: '模板1',
    content: '内容1',
    type: '月收资',
    creator: '张三',
    deadlineTime: '2025-02-25 12:39:54',
    submitState: false,
  });
}

/**
 * 以下是弹窗方法
 */
const submitParams = reactive({
  name: '',
  tableName: [
    {
      oneLevelName: '数字化应用及平台隐患消缺',
      twoLevelName: '基础设置升级改造安排',
      taskContent: '12月26日电网管理平台',
      notes: '无',
      completionStatus: '',
    },
    {
      oneLevelName: '数字化应用及平台隐患消缺',
      twoLevelName: '基础设置升级改造安排',
      taskContent: '12月26日电网管理平台',
      notes: '无',
      completionStatus: '',
    },
    {
      oneLevelName: '数字化应用及平台隐患消缺',
      twoLevelName: '基础设置升级改造安排',
      taskContent: '12月26日电网管理平台',
      notes: '无',
      completionStatus: '',
    },
  ],
});

// 填报弹窗 完成情况输入

function statusSubmit() {
  console.log('测试', submitParams.tableName);
}

// 填报
function submitIncome() {
  dialogData.submitVisible = true;
}

const selectedValues = ref([]);
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
          <el-input v-model="queryForm.name" style="width: 150px" clearable />
        </el-form-item>
        <el-form-item label="方式类型:">
          <el-input v-model="queryForm.type" style="width: 150px" clearable />
        </el-form-item>
        <el-form-item label="填报状态:">
          <el-input v-model="queryForm.state" style="width: 150px" clearable />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :icon="Search" @click="query"
            >搜索</el-button
          >
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table ref="tab" :data="data.tableData" size="small">
        <el-table-column type="selection" />
        <el-table-column type="index" label="序号" />
        <el-table-column prop="name" align="center" label="方式名称" />
        <el-table-column prop="content" align="center" label="方式内容" />
        <el-table-column prop="type" align="center" label="收资类型" />
        <el-table-column prop="creator" align="center" label="创建人" />
        <el-table-column
          prop="deadlineTime"
          align="center"
          label="填报截止时间"
        />
        <el-table-column align="center" label="填报状态">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.submitState">已填报</el-tag>
            <el-tag type="danger" v-else>待填报</el-tag>
            <!-- <button v-if="scope.row.submitState" class="taskPublish">
              已填报
            </button>
            <button v-else class="taskPublish">待填报</button> -->
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150px">
          <template #default="scope">
            <el-button type="primary" link @click="submitIncome()"
              >填报</el-button
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
        v-model="dialogData.submitVisible"
        title="运行方式收资填报"
        width="750"
        class="system-detail-dialog"
      >
        <el-form
          ref="queryForm"
          :model="submitParams"
          :rules="rules"
          label-width="auto"
          style="margin: 10px 0 0 20px"
        >
          <el-form-item
            label="方式名称:"
            prop="name"
            style="width: 100%"
            required
          >
            <el-input
              v-model="submitParams.name"
              placeholder="请输入方式名称"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="" prop="tableName" style="width: 100%">
            <el-table :data="submitParams.tableName" size="small">
              <el-table-column type="index" label="序号" />
              <el-table-column
                prop="oneLevelName"
                align="center"
                label="一级任务"
              />
              <el-table-column
                prop="twoLevelName"
                align="center"
                label="二级任务"
              />
              <el-table-column
                prop="taskContent"
                align="center"
                label="任务内容"
              />
              <el-table-column prop="notes" align="center" label="备注" />
              <el-table-column label="操作" align="center">
                <template #default="scope">
                  <el-input
                    v-model="scope.row.completionStatus"
                    placeholder="请填报"
                    @change="statusSubmit"
                  ></el-input>
                </template>
              </el-table-column>
            </el-table>
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

:deep(.el-tag.el-tag--success) {
  // --el-tag-bg-color: var(--el-color-success-light-9);
  --el-tag-border-color: #A7E7C4;
  // --el-tag-hover-color: var(--el-color-success);
}
:deep(.el-tag.el-tag--danger) {
  // --el-tag-bg-color: var(--el-color-success-light-9);
  --el-tag-border-color: #EA879A;
}
:deep(.el-tag) {
  --el-tag-border-radius: 0px;
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
