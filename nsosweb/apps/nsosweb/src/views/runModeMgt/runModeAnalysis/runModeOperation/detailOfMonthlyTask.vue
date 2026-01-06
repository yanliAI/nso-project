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
  insertVisible: false, // 新增任务
  detailVisible: false, // 查看详情
  publishVisible: false, // 发布任务
  submitVisible: false, // 填报情况
});

for (let i = 0; i < 10; i++) {
  data.tableData.push({
    id: i + 1,
    name: '2025年2月运行方式收资',
    publisher: '张三',
    publishTime: '2025-02-25 12:39:54',
    taskNumber: 15,
    completedTaskNumber: 10,
    incompletedTaskNumber: 5,
    taskState: true,
  });
}

/**
 * 以下是弹窗方法
 */
const insertParams = reactive({
  name: '',
  tableName: [
    {
      oneLevelName: '数字化应用及平台隐患消缺',
      twoLevelName: '基础设置升级改造安排',
      taskContent: '为解决现有内外网平台定制协议系统',
      company: '新通公司',
      taskInCharge: '新通公司',
    },
    {
      oneLevelName: '数字化应用及平台隐患消缺',
      twoLevelName: '基础设置升级改造安排',
      taskContent: '为解决iv区安全接入区流量',
      company: '新通公司',
      taskInCharge: '新通公司',
    },
  ],
  taskDescription: '',
});
const detailParams = reactive({
  name: '',
  tableName: [
    {
      oneLevelName: '数字化应用及平台隐患消缺',
      twoLevelName: '基础设置升级改造安排',
      taskContent: '为解决现有内外网平台定制协议系统',
      company: '新通公司',
      taskInCharge: '新通公司',
    },
    {
      oneLevelName: '数字化应用及平台隐患消缺',
      twoLevelName: '基础设置升级改造安排',
      taskContent: '为解决iv区安全接入区流量',
      company: '新通公司',
      taskInCharge: '新通公司',
    },
  ],
  taskDescription: '',
});
const submitParams = reactive({
  tableName: [
    {
      oneLevelTask: '数字化应用及平台隐患消缺',
      twoLevelTask: '1.电网管理平台（人资域）故障技术整改',
      taskContent: '12月26日电网管理平台',
      completeTime: '2025年2月28日',
      company: '数字企业',
      completionStatus: '70%',
      notes: 'TPM-00-202',
    },
    {
      oneLevelTask: '数字化应用及平台隐患消缺',
      twoLevelTask: '1.电网管理平台（人资域）故障技术整改',
      taskContent: '12月26日电网管理平台',
      completeTime: '2025年2月28日',
      company: '数字企业',
      completionStatus: '70%',
      notes: 'TPM-00-202',
    },
    {
      oneLevelTask: '数字化应用及平台隐患消缺',
      twoLevelTask: '1.电网管理平台（人资域）故障技术整改',
      taskContent: '12月26日电网管理平台',
      completeTime: '2025年2月28日',
      company: '数字企业',
      completionStatus: '70%',
      notes: 'TPM-00-202',
    },
  ],
});

const unitAndPersonOption = [
  {
    label: '单位1',
    value: '1',
  },
  {
    label: '单位2',
    value: '2',
  },
  {
    label: '单位3',
    value: '3',
  },
];
const presenterOption = [
  {
    label: '填报1',
    value: '1',
  },
  {
    label: '填报2',
    value: '2',
  },
  {
    label: '填报3',
    value: '3',
  },
];

// 新增数据
function insert() {
  dialogData.insertVisible = true;
}

// 查看详情
function showDetial(val: any) {
  dialogData.detailVisible = true;
  detailParams.name = val.name;
}

// 填报详情
function submitDetail() {
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
        <el-form-item label="收资名称:">
          <el-input v-model="queryForm.name" style="width: 150px" clearable />
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
        <el-table-column prop="name" align="center" label="收资名称" />
        <el-table-column prop="publisher" align="center" label="发布人" />
        <el-table-column prop="publishTime" align="center" label="发布时间" />
        <el-table-column prop="taskNumber" align="center" label="总任务数" />
        <el-table-column
          prop="completedTaskNumber"
          align="center"
          label="已完成任务数"
        />
        <el-table-column
          prop="incompletedTaskNumber"
          align="center"
          label="未完成任务数"
        />

        <el-table-column align="center" label="任务状态">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.taskState">已完成</el-tag>
            <el-tag type="danger" v-else>未完成</el-tag>
            <!-- <button v-if="scope.row.taskState" class="taskPublish">
              已完成
            </button>
            <button v-else class="taskPublish">未完成</button> -->
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="300px">
          <template #default="scope">
            <el-button type="primary" link @click="showDetial(scope.row)"
              >查看详情</el-button
            >
            <el-popconfirm width="220"  icon-color="#626AEF"
                  title="提示" >
                  <template #reference>
                    <el-button type="primary" link @click=""
                      >任务发布</el-button
                    >
                  </template>
                  <template #actions="{ confirm, cancel }">
                    <div>
                      <div>运行方式任务是否确认发布？</div>
                      <div style="display: flex; justify-content: flex-end; margin-top: 10px;">
                        <el-button size="small" @click="cancel">取消</el-button>
                        <el-button
                          type="success"
                          size="small"
                          @click=""
                        >
                          确认
                        </el-button>
                      </div>
                    </div>
                  </template>
                </el-popconfirm>

            <el-button type="primary" link @click="submitDetail()">
              填报情况
            </el-button>
            <el-button type="danger" link @click=""> 删除 </el-button>
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
        title="年月运行方式任务"
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
            label="任务名称:"
            prop="name"
            style="width: 100%"
            required
          >
            <el-input
              v-model="insertParams.name"
              placeholder="请输入任务名称"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item
            label="任务编辑:"
            prop="tableName"
            style="width: 100%"
            required
          >
            <el-table :data="insertParams.tableName" size="small">
              <el-table-column type="index" label="序号" />
              <el-table-column prop="oneLevelName" align="center" label="一级任务名称" />
              <el-table-column prop="twoLevelName" align="center" label="二级任务名称" />
              <el-table-column prop="taskContent" align="center" label="任务内容" />
              <el-table-column prop="company" align="center" label="负责单位" />
              <el-table-column prop="taskInCharge" align="center" label="负责人" />
              <el-table-column label="操作" align="center">
                <template #default="scope">
                  <el-button type="danger" link @click="">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button type="primary" style="margin-top: 10px"
              >导入任务</el-button
            >
            <el-button type="success" style="margin-top: 10px"
              >新增任务</el-button
            >
          </el-form-item>
          <el-form-item
            label="任务说明:"
            prop="taskDescription"
            style="width: 100%"
            required
          >
            <el-input
              v-model="insertParams.taskDescription"
              placeholder="请输入任务名称"
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 4 }"
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
      <el-dialog
        v-model="dialogData.detailVisible"
        title="年月运行方式任务"
        width="750"
        class="system-detail-dialog"
      >
        <el-form
          ref="queryForm"
          :model="detailParams"
          :rules="rules"
          label-width="auto"
          style="margin: 10px 0 0 20px"
        >
          <el-form-item
            label="任务名称:"
            prop="name"
            style="width: 100%"
            required
          >
            <el-input
              v-model="detailParams.name"
              placeholder="请输入任务名称"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item
            label="任务编辑:"
            prop="tableName"
            style="width: 100%"
            required
          >
            <el-table :data="detailParams.tableName" size="small">
              <el-table-column type="index" label="序号" />
              <el-table-column prop="oneLevelName" align="center" label="一级任务名称" />
              <el-table-column prop="twoLevelName" align="center" label="二级任务名称" />
              <el-table-column prop="taskContent" align="center" label="任务内容" />
              <el-table-column prop="company" align="center" label="负责单位" />
              <el-table-column prop="taskInCharge" align="center" label="负责人" />
              <el-table-column label="操作" align="center">
                <template #default="scope">
                  <el-button type="danger" link @click="">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button type="primary" style="margin-top: 10px"
              >导入任务</el-button
            >
            <el-button type="success" style="margin-top: 10px"
              >新增任务</el-button
            >
          </el-form-item>
          <el-form-item
            label="任务说明:"
            prop="taskDescription"
            style="width: 100%"
            required
          >
            <el-input
              v-model="detailParams.taskDescription"
              placeholder="请输入任务名称"
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 4 }"
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
      <el-dialog
        v-model="dialogData.submitVisible"
        title="年月运行填报情况"
        width="850"
        class="system-detail-dialog"
      >
        <el-form
          ref="queryForm"
          :model="submitParams"
          :rules="rules"
          label-width="auto"
          style="margin: 10px 0 0 20px"
        >
          <el-form-item label="" prop="tableName" style="width: 100%">
            <el-table :data="submitParams.tableName" size="small">
              <el-table-column type="index" label="序号" />
              <el-table-column prop="oneLevelTask" align="center" label="一级任务" />
              <el-table-column prop="twoLevelTask" align="center" label="二级任务" />
              <el-table-column prop="taskContent" align="center" label="任务内容" />
              <el-table-column prop="completeTime" align="center" label="计划完成时间" />
              <el-table-column prop="company" align="center" label="负责单位" />
              <el-table-column prop="completionStatus" align="center" label="完成情况" />
              <el-table-column prop="notes" align="center" label="备注" />
            </el-table>
            <el-button type="primary" :icon="Histogram" style="margin-top: 10px"
              >导出</el-button
            >
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
