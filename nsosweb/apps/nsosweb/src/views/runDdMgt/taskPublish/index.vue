<template>
  <Page auto-content-height>
    <el-tabs v-model="activeName" @tab-click="query" class="demo-tabs">
      <el-tab-pane label="编制" name="establishing">
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><Tickets /></el-icon>
            <span>编制（{{data.num1}}）</span>
          </span>
        </template>
        <Establishing ref="BZRef" @updateTatol="updateTatol" @refreshList="refreshList" />
      </el-tab-pane>
      <el-tab-pane label="待填报" name="waitingFill" >
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><Position /></el-icon>
            <span>待填报（{{data.num2}}）</span>
          </span>
        </template>
        <WaitingFill ref="DTBRef" @updateTatol="updateTatol" />
      </el-tab-pane>
      <el-tab-pane label="待审核" name="waitingExamine" >
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><DocumentChecked /></el-icon>
            <span>待审核（{{data.num3}}）</span>
          </span>
        </template>
        <WaitingExamine ref="DSHRef" @updateTatol="updateTatol" @refreshList="refreshList"/>
      </el-tab-pane>
      <el-tab-pane label="归档" name="archive" >
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><CircleCheck /></el-icon>
            <span>归档（{{data.num4}}）</span>
          </span>
        </template>
        <Archive ref="GDRef" @updateTatol="updateTatol"/>
      </el-tab-pane>
    </el-tabs>
  </Page>
</template>
<script setup>
import { ref, reactive } from 'vue';
import { ElTabs, ElTabPane } from 'element-plus';
import { Page } from '@vben/common-ui';
import Establishing from './establishing.vue';
import WaitingFill from './waitingFill.vue';
import WaitingExamine from './waitingExamine.vue';
import Archive from './archive.vue';
import { queryExamine, queryEstablish, queryFilling, queryArchive } from './taskPublishMethod.ts'
import { Tickets, Position, ChatLineSquare, CircleCheck, Delete, DocumentChecked } from '@element-plus/icons-vue';

const activeName = ref('establishing');
const data = reactive({
  tabName: null,
  num1: 0,
  num2: 0,
  num3: 0,
  num4: 0,
})

const BZRef = ref()
const DTBRef = ref()
const DSHRef = ref()
const GDRef = ref()

function query(tab) {
  if (tab.paneName === 'establishing') {
    if (BZRef.value) {
      BZRef.value.query()
    }
  } else if (tab.paneName === 'waitingFill') {
    if (DTBRef.value) {
      DTBRef.value.query()
    }
  } else if (tab.paneName === 'waitingExamine') {
    if (DSHRef.value) {
      DSHRef.value.query()
    }
  } else if (tab.paneName === 'archive') {
    if (GDRef.value) {
      GDRef.value.query()
    }
  }
}

function refreshList(actionType) {
  if(actionType === 'save') {
    BZRef.value.query();
  }else if(actionType === 'publish') {
    DTBRef.value.query();
  }else if(actionType === 'examine') {
    GDRef.value.query();
  }
}

const updateTatol = (type, val) => {
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
