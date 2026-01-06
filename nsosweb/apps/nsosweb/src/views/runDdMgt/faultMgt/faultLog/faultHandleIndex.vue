<template>
  <Page auto-content-height>
    <el-tabs ref="myTab" v-model="data.tabIndex" @tab-remove="removeTab" type="card" @tab-change="tabChange" class="w-full h-full bg-white demo-tabs">
      <el-tab-pane label="编辑中" name="list" :icon="Tickets" :closable="false">
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><Tickets /></el-icon>
            <span>处置中（{{data.num1}}）</span>
          </span>
        </template>
        <FaultHandle ref="faultHandle1" :queryState="'1'" @refreshList="refreshList1" @updateTatol="updateTatol"></FaultHandle>
      </el-tab-pane>
      <el-tab-pane label="已发布" name="list1" :closable="false">
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><CircleCheck /></el-icon>
            <span>已恢复（{{data.num2}}）</span>
          </span>
        </template>
        <FaultHandle ref="faultHandle2" :queryState="'2'" @refreshList="refreshList2" @updateTatol="updateTatol"></FaultHandle>
      </el-tab-pane>
    </el-tabs>
  </Page>
</template>
<script setup>
import { Page } from '@vben/common-ui';
import { onMounted, reactive, ref, watch } from 'vue';
import { ElTabs, ElTabPane} from 'element-plus';
import { Tickets, Position, ChatLineSquare, CircleCheck, Delete, DocumentChecked } from '@element-plus/icons-vue';
import FaultHandle from './faultHandle.vue'
import { useRoute } from 'vue-router';

const faultHandle1 = ref()
const faultHandle2 = ref()

const data = reactive({
  tabIndex: 'list',
  tabArr: [],
  num1: 0,
  num2: 0,
})
const refreshList1 = (showmask) => {
  faultHandle1.value.query(showmask)
  faultHandle2.value.query(showmask)
}
const refreshList2 = (showmask) => {
  
}
const updateTatol = (type, val) => {
  eval('data.num'+type+' = ' + val)
}

// 接收运调工作台跳转参数
const route = useRoute();

onMounted(() => {
  if (route.query.id) {
    data.tabIndex = 'list'
    faultHandle1.value.showDetailForWorkbench(route.query)
  }  
})
</script>
<style scoped>
:deep(.el-tab-pane) {
  width: 100%;
  height: 100%;
}

:deep(.el-tabs__header){
  margin-bottom: 4px;
}

.demo-tabs > .el-tabs__content {
  padding: 32px;
  font-size: 32px;
  font-weight: 600;
  color: #6b778c;
}

.demo-tabs .custom-tabs-label .el-icon {
  vertical-align: middle;
}

.demo-tabs .custom-tabs-label span {
  margin-left: 4px;
  vertical-align: middle;
}
</style>
