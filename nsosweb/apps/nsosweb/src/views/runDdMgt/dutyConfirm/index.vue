<template>
  <Page auto-content-height>
    <div class="fill-whole-white">
      <el-tabs ref="myTab" v-model="activeTab" @tab-click="changeTab" type="card" class="w-full h-full bg-white demo-tabs">
        <el-tab-pane label="待确认" name="DQR" :closable="false">
          <template #label>
            <span class="custom-tabs-label">
              <el-icon><Position /></el-icon>
              <span>待确认（{{ data.num1 }}）</span>
            </span>
          </template>
          <duty-confirm-list :status="1" @amount="refreshAmount" @refresh="refresh" ref="dqrRef" />
        </el-tab-pane>
        <el-tab-pane label="已确认" name="YQR" :closable="false">
          <template #label>
            <span class="custom-tabs-label">
              <el-icon><Reading /></el-icon>
              <span>已确认（{{ data.num2 }}）</span>
            </span>
          </template>
          <duty-confirm-list :status="2" @amount="refreshAmount" @refresh="refresh" ref="yqrRef" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </Page>
</template>
<script setup>
import { Page } from '@vben/common-ui'
import { ref, onMounted, reactive } from 'vue'
import { ElTabs, ElTabPane } from 'element-plus'
import dutyConfirmList from './dutyConfirmList.vue'
import { Position, Reading } from '@element-plus/icons-vue'

const activeTab = ref('DQR')
const dqrRef = ref()
const yqrRef = ref()
const data = reactive({
  num1: 0,
  num2: 0
})
onMounted(() => {
  refresh()
})

const changeTab = async (tab) => {
  const active = tab.props.name
  console.log(active)
  if (active === 'DQR' && dqrRef.value) {
    dqrRef.value.query()
  } else if (active === 'YQR' && yqrRef.value) {
    yqrRef.value.query()
  }
}

const refreshAmount = async (tab, count) => {
  if (tab === 'DQR') {
    data.num1 = count
  } else if (tab === 'YQR') {
    data.num2 = count
  }
}

const refresh = async () => {
  if (dqrRef.value) {
    dqrRef.value.query()
  }
  if (yqrRef.value) {
    yqrRef.value.query()
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
