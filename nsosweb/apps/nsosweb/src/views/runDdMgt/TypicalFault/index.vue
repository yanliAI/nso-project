<template>
  <Page auto-content-height>
    <el-tabs v-model="activeName" @tab-click="query(activeName)" class="demo-tabs">
      <el-tab-pane label="故障信息综合查询"  name="establishing">
        <ZhcxList  ref="DTBRef" />
      </el-tab-pane>
      <el-tab-pane label="典型故障库"  name="waitingFill" >
        <DxgzkList ref="DSHRef" />
      </el-tab-pane>
    </el-tabs>
  </Page>
</template>
<script setup>
import { ref, reactive } from 'vue';
import { ElTabs, ElTabPane } from 'element-plus';
import { Page } from '@vben/common-ui';
import ZhcxList from './zhcxList.vue';
import DxgzkList from './dxgzkList.vue';
import { Tickets, Position, ChatLineSquare, CircleCheck, Delete, DocumentChecked } from '@element-plus/icons-vue';

const activeName = ref('establishing');
const data = reactive({
  tabName: null,
})

const DTBRef = ref()
const DSHRef = ref()

function query(activeName) {
  if (activeName === 'establishing') {
    if (DTBRef.value) {
      DTBRef.value.query()
      DSHRef.value.query()
    }
  } else if (activeName === 'waitingFill') {
    if (DSHRef.value) {
      DSHRef.value.query()
      DTBRef.value.query()
    }
  }
  console.log(activeName)
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

:deep(.el-tabs__header) {
  margin: 0 0 5px;
}
:deep(.el-tabs__nav-scroll) {
    background-color: #fff;
    padding: 10px 0;
}
:deep(.el-tabs__nav) {
  margin: 0 10px;
}
:deep(.el-tabs--top .el-tabs__item.is-top:nth-child(2)) {
  padding-left: 20px;
}
:deep(.el-tabs--top .el-tabs__item.is-top:last-child) {
  padding-right: 20px;
}

/*基础样式*/
:deep(.el-tabs__item) {
  color: #666666;
  background-color: #f0f2f6;
  border-radius: 10px;
  transform: scale(0.95);
}
/*悬浮样式*/
:deep(.el-tabs__item:hover) {
  color: #3e7eff !important;
}
/*选中样式*/
:deep(.el-tabs__item.is-active) {
  color: #fff !important;
  font-weight: bold;
  background-color: #3e7eff;
  border-radius: 8px;
}
/*隐藏tab下面的一横*/
:deep(.el-tabs__active-bar) {
  display: none;
}

.demo-tabs .custom-tabs-label .el-icon {
  vertical-align: middle;
}

.demo-tabs .custom-tabs-label span {
  margin-left: 4px;
  vertical-align: middle;
}
</style>
