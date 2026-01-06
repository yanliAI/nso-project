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
import { reactive, ref, computed, watch, onMounted } from 'vue';
import moment from 'moment';
import { useVbenModal } from "@vben/common-ui";
import {
  getSelfFillListApi,
  getAllCollectionInfo,
  setCollectTable,
  getCollectionTmplDetail,
  saveCollectionTmplDetail,
  publishSearchTask,
  getCollectionTmplField,
  getCollectTableFields,
  getHistoryTask,
  getFillListApi,
  getDistributablePersons,
  distributableTaskApi,
  getColAssigneeListApi,
  ColTaskAssigneeApi,
} from '#/api';
import { downloadFile } from '#/utils/download.ts'
import { ElMessage } from 'element-plus';
import CollectionFillModal from './collectionFillModal.vue';

const queryFormRef = ref();
const queryForm = reactive({
  taskName: '',
  status: '',
  taskType: '',
});

const data = reactive({
  pageInfo: {
    pageSize: 10,
    pageNo: 1,
    total: 0,
  },
});

const tableData = ref([]);
const now = moment().format('YYYY-MM-DD HH:mm:ss');
const fillModalVisible = ref(false);
const distributeVisible = ref(false);
const currentTask = ref<any>(null);
const modalType = ref('fill'); // 'fill' or 'view'

// 获取列表数据
async function getData(params) {
  try {
    const res = await getFillListApi(params);
    tableData.value = res.list;
    data.pageInfo.total = res.total;
  } catch (error) {}
}

onMounted(() => {
  getData({
    pageNo: data.pageInfo.pageNo,
    pageSize: data.pageInfo.pageSize,
    ...queryForm,
  });
});

// 处理填报
function handleFill(val: any) {
  currentTask.value = val;
  modalType.value = 'fill';
  fillModalVisible.value = true;
}

// 处理查看
function handleView(val: any) {
  currentTask.value = val;
  modalType.value = 'view';
  fillModalVisible.value = true;
}

// 处理模态框关闭
function handleModalClose() {
  fillModalVisible.value = false;
  currentTask.value = null;
}

// 处理提交成功
function handleSubmitSuccess() {
  fillModalVisible.value = false;
  getData({
    pageNo: data.pageInfo.pageNo,
    pageSize: data.pageInfo.pageSize,
    ...queryForm,
  });
}

/**
 * 分发填报任务
 */

// 打开填报任务分发
const DistributableTable = ref([]);
const selectedIds = ref<string[]>([]);
const currentTaskId = ref('')
const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map(item => item.personId);
};
async function handleDistribute(row) {
  distributeVisible.value = true;
  DistributableTable.value = [];
  try {
    const res = await getColAssigneeListApi({taskId: row.taskId})
    DistributableTable.value = res.collectionPersonMes;
    currentTaskId.value = res.taskId
  } catch (error) {
  }
}

// 任务分发提交
async function DistributableTask() {
  try {
    if(selectedIds.value.length ===0){
      ElMessage.warning('分发人员不可为空!')
      return
    }
    await ColTaskAssigneeApi({
      personIds: selectedIds.value,
      taskId: currentTaskId.value
    })
    ElMessage.success('分发成功!')
    distributeVisible.value = false;
  } catch (error) {
    
  }
}
 
/**
 * 分页查询
 */
const handleSizeChange = (val) => {
  data.pageInfo.pageSize = val;
  getData({
    pageNo: data.pageInfo.pageNo,
    pageSize: data.pageInfo.pageSize,
    ...queryForm,
  });
};

const handleCurrentChange = (val) => {
  data.pageInfo.pageNo = val;
  getData({
    pageNo: data.pageInfo.pageNo,
    pageSize: data.pageInfo.pageSize,
    ...queryForm,
  });
};

// 判断是否过期
function isTimeExpired(backendTime: string) {
  const backendMoment = moment(backendTime, 'YYYY-MM-DD HH:mm:ss');
  const nowMoment = moment();
  return backendMoment.isSameOrBefore(nowMoment);
}

/**
 * 导出任务模板
 */

 async function exportCollectionTask(row: any) {
  try {
    const fileNameWithExt = `${row.taskName}.zip`
    await downloadFile(`${import.meta.env.VITE_NSOSFS}/collectionBase/templateTaskDownload`, fileNameWithExt, {taskId: row.taskId}, 'post')
  } catch {}
}
/**
 * 搜索栏
 */
// 1. 查询
function searchCollection() {
  getData({
    pageNo: data.pageInfo.pageNo,
    pageSize: data.pageInfo.pageSize,
    ...queryForm,
  });
}

// 2. 重置
function reset() {
   Object.assign(queryForm, {
    taskName: '',
    status: '',
    taskType: '',
  });
  data.pageInfo.pageNo = 1;
  data.pageInfo.pageSize = 10;
  getData({
    pageNo: data.pageInfo.pageNo,
    pageSize: data.pageInfo.pageSize,
    ...queryForm,
  });
}
</script>

<template>
  <div>
    <div>
      <el-form
        ref="queryFormRef"
        :inline="true"
        :model="queryForm"
        label-position="right"
      >
        <el-form-item label="模板名称:" prop="name">
          <el-input
            v-model="queryForm.taskName"
            style="width: 200px"
            clearable
          />
        </el-form-item>
        <el-form-item label="填报状态:" prop="state">
          <el-select
            v-model="queryForm.status"
            style="width: 200px"
            clearable
          >
            <el-option label="待填报" value="0" />
            <el-option label="已填报" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="收资类型:" prop="type">
          <el-select
            v-model="queryForm.taskType"
            style="width: 200px"
            clearable
          >
            <el-option label="月收资" value="1" />
            <el-option label="年收资" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="searchCollection()"
            >搜索</el-button
          >
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table :data="tableData" border stripe height="565px">
        <el-table-column type="index" label="#" align="center" />
        <el-table-column type="selection" />
        <el-table-column prop="taskName" align="center" label="收资名称" />
        <el-table-column align="center" label="收资类型">
          <template #default="scope">
            <span v-if="scope.row.type === '1'">月收资</span>
            <span v-else>年收资</span>
          </template>
        </el-table-column>
        <el-table-column prop="creatorId" align="center" label="创建人" />
        <el-table-column
          prop="deadlineTime"
          align="center"
          label="填报截止时间"
        />
        <el-table-column prop="status" align="center" label="填报状态">
          <template #default="scope">
            <el-tag type="warning" v-if="scope.row.status === '0' "
              >待填报</el-tag
            >
            <el-tag type="success" v-else-if="scope.row.status !== '0'">已填报</el-tag>
            <!-- <el-tag type="danger" v-else> 已过期</el-tag>  -->
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200px">
          <template #default="scope">
              <el-button  v-if="scope.row.status === '0'" type="primary" link @click="handleFill(scope.row)"
                >填报</el-button
              >
              <el-button v-if="scope.row.isAppoint === '1'" type="primary" link @click="handleDistribute(scope.row)">分发</el-button>
              <el-button v-if="scope.row.status !== '0'" type="primary" link @click="handleView(scope.row)">查看</el-button>
              <el-button @click="exportCollectionTask(scope.row)"  type="primary" link>下载模板</el-button>
            
            
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin-top: 5px">
      <el-pagination
        v-model:current-page="data.pageInfo.pageNo"
        v-model:page-size="data.pageInfo.pageSize"
        :total="data.pageInfo.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <el-dialog v-model="distributeVisible" title="填报任务分发">
      <el-table :data="DistributableTable" border height="500px"  @selection-change="handleSelectionChange" >
        <el-table-column type="index" label="#" align="center" />
          <el-table-column type="selection" :selectable="(row) => row.status !== '1'" />
          <el-table-column prop="personName" align="center" label="姓名" />
          <el-table-column prop="status" align="center" label="填报状态">
          <template #default="scope">
            <span v-if="scope.row.status === '1'"
              >已分发</span
            >
            <span v-else>分发</span>
          </template>
        </el-table-column>
        </el-table>
        <template #footer>
            <el-button @click="distributeVisible = false">取消</el-button>
            <el-button type="primary" @click="DistributableTask()">
              分发
            </el-button>
        </template>
        <!-- DistributableTask -->
    </el-dialog>
    <!-- 收资填报模态框 -->
    <CollectionFillModal
      v-model:visible="fillModalVisible"
      :task="currentTask"
      :type="modalType"
      @close="handleModalClose"
      @submit-success="handleSubmitSuccess"
    />
  </div>
</template>

<style lang="less" scoped>
.taskPublish {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px 2px 5px;
  border: 1px solid #a7e7c4;
  background-color: #f2f2f2;
  color: #66cb81;
  
  .el-icon {
    margin-left: 3px;
    font-size: 14px;
  }
}

:deep(.el-tag.el-tag--success) {
  --el-tag-border-color: #a7e7c4;
  --el-tag-hover-color: var(--el-color-success);
}

:deep(.el-tag.el-tag--danger) {
  --el-tag-border-color: #ea879a;
}

:deep(.el-tag) {
  --el-tag-border-radius: 0px;
}

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
</style>
