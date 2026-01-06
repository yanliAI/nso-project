<template>
  <div class="main-bd">
    <el-card class="m-3">
      <h1 class="mb-2 font-bold">附件</h1>
      <el-button type="primary" class="ml-0" @click="attachClick">附件上传</el-button>
      <AttachList :parentId="'565656565656'"></AttachList>
    </el-card>
    
    <Modal class="w-[700px]" title="附件编辑" :footer="false" :closeOnClickModal="false" :draggable="true" headerClass="head-md">
      <AttachFile :parentId="'565656565656'" @close="addClose"></AttachFile>
    </Modal>

    <el-card class="m-3">
      <h1 class="mb-2 font-bold">下拉组件</h1>
      <div>
      <div class="my-2">系统多选下拉</div>
      <el-select v-model="data.value1" multiple placeholder="选择系统信息" collapse-tags collapse-tags-tooltip :max-collapse-tags="2" clearable filterable class="ml-0" @change="changeSystem" style="width: 500px">
        <el-option v-for="item in dropList.NSOS_SYSTEM_INFO" :key="item.value" :label="item.label" :value="item.value"/>
      </el-select>
      <div class="my-2">系统多选下拉（远程加载模式）</div>
      <el-select v-model="data.value2" multiple placeholder="选择系统信息" clearable filterable class="ml-0" remote reserve-keyword collapse-tags collapse-tags-tooltip :max-collapse-tags="2" :remote-method="systemRemoteMethod" style="width: 500px">
        <el-option v-for="item in data.systemOptions" :key="item.value" :label="item.label" :value="item.value"/>
      </el-select>
      <div class="my-2">用户多选下拉（远程加载模式）</div>
      <el-select v-model="data.value3" multiple placeholder="选择用户" collapse-tags collapse-tags-tooltip :max-collapse-tags="5" remote reserve-keyword clearable filterable class="ml-0" :remote-method="userRemoteMethod" @change="changeSystem" style="width: 500px">
        <el-option v-for="item in data.userOptions" :key="item.value" :label="item.label" :value="item.value"/>
      </el-select>
    </div> 
    </el-card>

    <el-card class="m-3">
      <testWorkflow></testWorkflow>
    </el-card>
  </div>
</template>
<script setup>
import { onMounted, reactive } from 'vue';
import AttachFile from './attachFile.vue'
import AttachList from './attachList.vue'
import testWorkflow from './testWorkflow.vue'
import { ElDialog,ElCard } from 'element-plus';
import { useVbenModal } from '@vben/common-ui';
import { useDropStore } from '#/store';
import { requestClient } from '#/api/request';

const data = reactive({
  dialogAddVisible: false,
  userOptions: [],
  systemOptions: [],
  value1: [
      "CSG-BIZ-AP-SUBAP-000001121",
      "CSG-BIZ-AP-SUBAP-000001103",
      "CSG-BIZ-AP-AP-000000031"
  ],
    value2: [
      "CSG-BIZ-AP-SUBAP-000001121",
      "CSG-BIZ-AP-SUBAP-000001103",
      "CSG-BIZ-AP-AP-000000031"
  ],
  value3: [
      "zhoukunhe",
      "zhourichu",
      "zhouqingmei"
  ],
})
const dropList = reactive({});
onMounted(async () => {
  const dropStore = useDropStore();
  const dropType = ['NSOS_USER_INFO', 'NSOS_SYSTEM_INFO']
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);

  data.systemOptions = dropList['NSOS_SYSTEM_INFO'] // 初始下拉赋值
  data.userOptions = dropList['NSOS_USER_INFO'] // 初始下拉赋值

});
const systemRemoteMethod = (query) => {
  if (query) {
    data.systemOptions = dropList['NSOS_SYSTEM_INFO'].filter((item) => {
      return item.label.toLowerCase().includes(query.toLowerCase())
    })
  } else {
    data.systemOptions = []
  }
}
const userRemoteMethod = (query) => {
  if (query) {
    data.userOptions = dropList['NSOS_USER_INFO'].filter((item) => {
      return item.label.toLowerCase().includes(query.toLowerCase())
    })
  } else {
    data.userOptions = []
  }
}
const seedTaskClick = async () => {
  await requestClient.get(import.meta.env.VITE_BASIC + '/workflowOrder/sendTask')
}
const backTaskClick = async () => {
  await requestClient.get(import.meta.env.VITE_BASIC + '/workflowOrder/backTask')
}
const lookFlowClick = () => {
  let width = 800
  let height = 700
  // 获取屏幕宽度和高度
  var screenWidth = window.screen.width;
  var screenHeight = window.screen.height;

  // 计算新窗口的左边缘和上边缘位置，以使其居中
  var left = (screenWidth - width) / 2;
  var top = (screenHeight - height) / 2;
  var url = 'http://localhost:8199/bpmp/engine/bpms/flex/BpmsTrackC5.html?processId=Pro_1741587511733&processInsId=15119024e7064c46803e67f21d21ba48_1&webRoot=/bpmp/engine'
  // 使用 window.open 打开新窗口，并设置其位置和大小
  window.open(url, '_blank', `width=${width},height=${height},top=${top},left=${left}`);
}
const attachClick = () => {
  modalApi.open()
}
const changeSystem = () => {
  console.log(data.value3);
}
const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
});
</script>
<style scoped>
:deep(.head-md h2){
  font-size: 14px;
}
</style>
