<template>
  <div class="main-bd">
    <el-tabs v-model="activeTab" @tab-click="query(activeTab)" class="demo-tabs">
      <el-tab-pane label="待填报" name="DTB">
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><Position /></el-icon>
            <span>待填报（{{data.num1}}）</span>
          </span>
        </template>
        <DutyTaskDtb ref="DTBRef" @updateTatol=updateTatol />
      </el-tab-pane>
      <el-tab-pane label="已上报" name="YSB">
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><DocumentChecked /></el-icon>
            <span>已上报（{{data.num2}}）</span>
          </span>
        </template>
        <DutyTaskYsb ref="YSBRef" @updateTatol=updateTatol />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import { ref, watch, onMounted, nextTick, reactive } from 'vue'
import { ElTabs, ElTabPane } from 'element-plus'
import { Page } from '@vben/common-ui'
import DutyTaskDtb from './dutyTask-DTB.vue'
import DutyTaskYsb from './dutyTask-YSB.vue'
import { Position, DocumentChecked } from '@element-plus/icons-vue';

const activeTab = ref('DTB')
const DTBRef = ref()
const YSBRef = ref()
const data = reactive({
  num1: 0,
  num2: 0,
})
onMounted(() => {
  query('DTB');
})
function query(moduleName) {
  if (moduleName === 'DTB') {
    if (DTBRef.value) {
      DTBRef.value.query()
    }
  } else if (moduleName === 'YSB') {
    if (YSBRef.value) {
      YSBRef.value.query()
    }
  }
}

const updateTatol = (type, val) => {
  eval('data.num'+type+' = ' + val)
}
</script>
<style scoped>
.main-bd {
  width: 100%;
  height: 100%;
}

.demo-tabs .custom-tabs-label .el-icon {
  vertical-align: middle;
}

.demo-tabs .custom-tabs-label span {
  margin-left: 4px;
  vertical-align: middle;
}

:deep(.el-tabs) {
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

</style>
