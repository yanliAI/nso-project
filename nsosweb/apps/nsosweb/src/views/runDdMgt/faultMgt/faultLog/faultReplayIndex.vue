<template>
  <Page auto-content-height>
    <el-tabs type="card" v-model="activeTab" @tab-click="changeTab" class="w-full h-full bg-white demo-tabs">
      <el-tab-pane label="复盘中" :icon="Checked" name="FPZ" :closable="false">
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><Checked /></el-icon>
            <span>复盘中（{{ data.num1 }}）</span>
          </span>
        </template>
        <fault-replay-list ref="fpzRef" :replay-status="2" @amount="refreshAmount" @refresh="refresh" />
      </el-tab-pane>
      <el-tab-pane label="已复盘" name="YFP" :icon="Reading" :closable="false">
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><Reading /></el-icon>
            <span>已复盘（{{ data.num2 }}）</span>
          </span>
        </template>
        <fault-replay-list ref="yfpRef" :replay-status="3" @amount="refreshAmount" @refresh="refresh" />
      </el-tab-pane>
    </el-tabs>
  </Page>
</template>

<script setup>
import { Page } from '@vben/common-ui'
import { onMounted, reactive, ref } from 'vue'
import { ElTabs, ElTabPane } from 'element-plus'
import { Checked, Reading } from '@element-plus/icons-vue'
import faultReplayList from './faultReplayList.vue'

const activeTab = ref('FPZ')
const fpzRef = ref()
const yfpRef = ref()
const data = reactive({
  num1: 0,
  num2: 0
})
onMounted(() => {
  refresh()
})

const changeTab = async (tab) => {
  const active = tab.props.name
  if (active === 'FPZ' && fpzRef.value) {
    fpzRef.value.query()
  } else if (active === 'YFP' && yfpRef.value) {
    yfpRef.value.query()
  }
}

const refreshAmount = async (tab, count) => {
  if (tab === 'FPZ') {
    data.num1 = count
  } else if (tab === 'YFP') {
    data.num2 = count
  }
}

const refresh = async () => {
  if (fpzRef.value) {
    fpzRef.value.query()
  }
  if (yfpRef.value) {
    yfpRef.value.query()
  }
}
</script>

<style scoped>
:deep(.el-tab-pane) {
  width: 100%;
  height: 100%;
}

:deep(.el-tabs__header) {
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
