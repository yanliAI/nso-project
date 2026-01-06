<template>
  <Page auto-content-height>
    <el-tabs ref="myTab" v-model="data.tabIndex" @tab-remove="removeTab" type="card" @tab-change="tabChange" class="w-full h-full bg-white demo-tabs">
      <el-tab-pane label="待确认" name="list1" :closable="false">    
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><Tickets /></el-icon>
            <span>待确认（{{ data.num1 }}）</span>
          </span>
        </template>
        <TransportFault ref="transFault1" :queryState="'1'" @refreshList="refreshList1" @updateTotal="updateTotal"/>
      </el-tab-pane>
      <el-tab-pane label="已确认" name="list2" :closable="false">    
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><CircleCheck /></el-icon>
            <span>已确认（{{ data.num2 }}）</span>
          </span>
        </template>
        <TransportFault ref="transFault2" :queryState="'2'" @refreshList="refreshList2" @updateTotal="updateTotal"/>
      </el-tab-pane>
    </el-tabs>
  </Page>
</template>
<script setup>
import { Page } from '@vben/common-ui';
import { reactive, ref } from 'vue';
import { ElTabs, ElTabPane } from 'element-plus';
import { Tickets, CircleCheck } from '@element-plus/icons-vue';
import TransportFault from './transportFault.vue'

const transFault1 = ref()
const transFault2 = ref()
const data = reactive({
  tabIndex: 'list1',
  tabArr: [],
  num1: 0,
  num2: 0,
})
const refreshList1 = (showmask) => {
  transFault1.value.query(showmask)
}
const refreshList2 = (showmask) => {
  transFault2.value.query(showmask)
}
const updateTotal = (type, val) => {
  eval('data.num'+type+' = ' + val)
}
</script>
<style scoped>
:deep(.el-tabs){
  width: 100%;
  height: 100%;
}

:deep(.el-tab-pane) {
  width: 100%;
  height: 100%;
}

:deep(.el-tabs--border-card>.el-tabs__content){
  padding: 0 10px;
}

.demo-tabs > .el-tabs__content {
  padding: 32px;
  font-size: 32px;
  font-weight: 600;
  color: #6b778c;
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
