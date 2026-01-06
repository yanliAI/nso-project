<template>
  <div class="main-bd h-[400px]">
    <el-tabs ref="myTab" v-model="data.tabIndex" @tab-remove="removeTab" type="card" class="w-full h-full bg-white">
      <el-tab-pane label="我的工单" name="list" >
        <div>
          <el-button type="primary" class="ml-0" @click="queryAllOrder">刷新</el-button>
          <el-button type="primary" plain class="ml-0" :icon="Plus"  @click="addOrderClick">添加业务单</el-button>
        </div>
        <el-table :data="data.orderList" size="small" style=" height: 280px;">
          <el-table-column type="index" fixed width="40" label="#" align="center"/>
          <el-table-column prop="id" label="业务单ID"  width="300" align="center"></el-table-column>
          <el-table-column prop="nodeName" label="当前环节"  width="150" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <el-button type="primary" class="ml-0" v-if="scope.row.flowState == 0" @click="seedTaskClick(scope.row.id)">提交流程</el-button>
              <el-button type="primary" class="ml-0" v-if="scope.row.flowState != 0" @click="lookFlowClick(scope.row.processId, scope.row.processInsId)">查看流程图</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination :current-page="data.pageInfo1.pageNo" size="small" :page-size="data.pageInfo1.pageSize" class="mt-1"
        :total="data.pageInfo1.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange" @current-change="currentChange"></el-pagination>
      </el-tab-pane>
      <el-tab-pane label="待办工单" name="todolist" >
        <div>
          <el-button type="primary" class="ml-0" @click="queryTodo">刷新</el-button>
        </div>
        <el-table :data="data.todoList" size="small" style="width:100%; height: 280px;">
          <el-table-column type="index" fixed width="40" label="#" align="center"/>
          <el-table-column prop="id" label="业务单ID"  width="300" align="center"></el-table-column>
          <el-table-column prop="nodeName" label="当前环节"  width="200" align="center"></el-table-column>
          <el-table-column label="审批意见" align="center" width="400">
            <template #default="scope">
              <el-input v-model="scope.row.opinion"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <el-button type="primary" class="ml-0" v-if="scope.row.flowState != 0" @click="seedTaskClick(scope.row.id, scope.row.opinion)">传递</el-button>
              <el-button type="primary" class="ml-0" v-if="scope.row.flowState != 0" @click="selectUserClick(scope.row, 'send')">指定传递</el-button>
              <el-button type="primary" class="ml-0" v-if="scope.row.flowState != 0" @click="selectUserClick(scope.row, 'back')">指定回退</el-button>
              <el-button type="primary" class="ml-0" v-if="scope.row.flowState != 0" @click="backTaskClick(scope.row.id, scope.row.opinion)">退回</el-button>
              <el-button type="primary" class="ml-0" v-if="scope.row.flowState != 0" @click="lookFlowClick(scope.row.processId, scope.row.processInsId)">查看流程图</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" size="small" class="mt-1"
        :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange" @current-change="currentChange"></el-pagination>
      </el-tab-pane>
    </el-tabs>
    <Modal class="w-[800px] h-[650px]" title="选择用户" :footer="false" :closeOnClickModal="false" :draggable="true">
      <WorkFlowUserSelect :nodeUserInfo="data.nodeUserInfo" @close="selectUserClose" @ok="selectUserOk"></WorkFlowUserSelect>
    </Modal>
  </div>
</template>
<script setup>
import { onMounted, reactive } from 'vue';
import { ElDialog,ElCard } from 'element-plus';
import { useVbenModal } from '@vben/common-ui';
import { useDropStore } from '#/store';
import { requestClient } from '#/api/request';
import { ElMessage, ElTable, ElTableColumn, ElMessageBox, ElNotification, ElTabs, ElTabPane, ElPagination } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import WorkFlowUserSelect from './workFlowUserSelect.vue'

const data = reactive({
  tabIndex: 'list',
  dialogAddVisible: false,
  formData: {},
  formData1: {},
  orderList: [],
  todoList: [],
  nodeUserInfo: [],
  curOrder: null,
  curOperate: null,
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0,
  },
  pageInfo1: {
    pageSize: 20,
    pageNo: 1,
    total: 0,
  },
})
const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
});
onMounted(async () => {
  queryAllOrder()
  queryTodo()
});
/**
 * 查询我的工单
 */
const queryAllOrder = async () => {
  data.formData1.pageSize = data.pageInfo1.pageSize
  data.formData1.pageNo = data.pageInfo1.pageNo
  const {list,pageNo,count} = await requestClient.post(import.meta.env.VITE_BASIC + '/workflowOrder/queryAllOrder', data.formData1)
  data.orderList = list
  data.pageInfo1.pageNo = pageNo;
  data.pageInfo1.total = count;
}
const handleSizeChange1 = (val) => {
  data.pageInfo1.pageSize = val;
  queryAllOrder();
};
const currentChange1 = (val) => {
  data.pageInfo1.pageNo = val;
  queryAllOrder();
};
/**
 * 查询待办工单
 */
const queryTodo = async () => {
  data.formData.pageSize = data.pageInfo.pageSize
  data.formData.pageNo = data.pageInfo.pageNo
  const {list,pageNo,count} = await requestClient.post(import.meta.env.VITE_BASIC + '/workflowOrder/queryTodo', data.formData)
  data.todoList = list
  data.pageInfo.pageNo = pageNo;
  data.pageInfo.total = count;
}
const handleSizeChange = (val) => {
  data.pageInfo.pageSize = val;
  queryTodo();
};
const currentChange = (val) => {
  data.pageInfo.pageNo = val;
  queryTodo();
};
/**
 * 新增工单
 */
const addOrderClick = async () => {
  await requestClient.get(import.meta.env.VITE_BASIC + '/workflowOrder/addOrder')
  queryAllOrder()
  ElNotification({ title: '提示', type: 'success', message: '添加成功' });
}
/**
 * 传递
 * @param {*业务单ID} id
 * @param {*审批意见} option 
 */
const seedTaskClick = async (id, opinion) => {
  let params = {workId: id, opinion: opinion}
  await requestClient.get(import.meta.env.VITE_BASIC + '/workflowOrder/sendTask', {params})
  ElNotification({ title: '提示', type: 'success', message: '传递成功' });
  queryTodo();
  queryAllOrder();
}
/**
 * 回退
 * @param {*业务单ID} id 
 * @param {*审批意见} option 
 */
const backTaskClick = async (id, opinion) => {
  let params = {workId: id, opinion: opinion}
  await requestClient.get(import.meta.env.VITE_BASIC + '/workflowOrder/backTask', {params})
  queryTodo();
  ElNotification({ title: '提示', type: 'success', message: '回退成功' });
}

const selectUserClick = async (row, operate) => {
  modalApi.open()
  let params = {workId: row.id}
  if (data.curOperate == 'send') {
    data.nodeUserInfo = await requestClient.get(import.meta.env.VITE_BASIC + '/workflowOrder/queryForeTransNodeAndTransUser', {params})
  } else if (data.curOperate == 'back') {
    data.nodeUserInfo = await requestClient.get(import.meta.env.VITE_BASIC + '/workflowOrder/queryBackTransNodeAndTransUser', {params})
  }
  data.curOrder = row 
  data.curOperate = operate
}

/**
 * 流程跟踪
 * @param {*流程ID} processId 
 * @param {*流程实例ID} processInsId 
 */
const lookFlowClick = (processId, processInsId) => {
  let width = 800
  let height = 700
  // 获取屏幕宽度和高度
  var screenWidth = window.screen.width;
  var screenHeight = window.screen.height;

  // 计算新窗口的左边缘和上边缘位置，以使其居中
  var left = (screenWidth - width) / 2;
  var top = (screenHeight - height) / 2;
  var url = 'http://localhost:8199/bpmp/engine/bpms/flex/BpmsTrackC5.html?processId='+processId+'&processInsId='+processInsId+'&webRoot=/bpmp/engine'
  // 使用 window.open 打开新窗口，并设置其位置和大小
  window.open(url, '_blank', `width=${width},height=${height},top=${top},left=${left}`);
}
const selectUserClose = () => {
  modalApi.close()
}
const selectUserOk = async (nodeInfo, opinion) => {
  let params = {
    workId: data.curOrder.id,
    targetNodeInfos: nodeInfo,
    opinion: opinion,
  }
  if (data.curOperate == 'send') {
    await requestClient.post(import.meta.env.VITE_BASIC + '/workflowOrder/sendTaskAndUser', params)
  } else if (data.curOperate == 'back') {
    await requestClient.post(import.meta.env.VITE_BASIC + '/workflowOrder/backTaskAndUser', params)
  }
  modalApi.close()
}
defineExpose({ selectUserClose, selectUserOk })
</script>
<style scoped>
:deep(.head-md h2){
  font-size: 14px;
}
</style>
