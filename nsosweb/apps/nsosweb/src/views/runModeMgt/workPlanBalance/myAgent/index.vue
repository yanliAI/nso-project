<script setup lang="ts">
import { ref, provide, watch} from 'vue'
import DoneOrder from './doneOrder.vue'
import TodoOrder from './todoOrder.vue'
import DoingOrder from './doingOrder.vue'
import ExpediteOrder from './expediteOrder.vue'
import WarningOrder from './warningOrder.vue'
import TimeoutOrder from './timeoutOrder.vue'
import { ElTable, ElTableColumn, ElContainer, ElFormItem, ElDialog, ElForm, ElCard, ElInput, ElButton, ElSelect, ElRow, ElCol, ElTabs, ElPagination, ElMessage, ElMessageBox, type FormInstance } from 'element-plus'

const currentSelectedItem = ref('todo')
const todoOrderNumber = ref(0) // 代办数
const doingOrderNumber = ref(0) // 在办数
const doneOrderNumber = ref(0) // 已办数
const expediteOrderNumber = ref(0) // 被催办
const warningOrderNumber = ref(0) // 预警
const timeoutOrderNumber = ref(0) // 超时

const todoOrderRef = ref(null)
const doingOrderRef = ref(null)
const doneOrderRef = ref(null)
const expediteOrderRef = ref(null)
const warningOrderRef = ref(null)
const timeoutOrderRef = ref(null)

// 祖先参数，工单提交，应刷新全部记录tab页
const submitAllState = ref('wait')
provide('submitAllState', submitAllState)

watch(submitAllState, (newData) => {
  if (newData === 'success') {
    todoOrderRef.value.query()
    doingOrderRef.value.query()
    doneOrderRef.value.query()
    expediteOrderRef.value.query()
    warningOrderRef.value.query()
    timeoutOrderRef.value.query()
    submitAllState.value = 'wait'

  }
})

// 更新各个工单Tab数量
async function updateCount(val) {
  try {
    switch (val.type) {
      case 'todo':
        todoOrderNumber.value = val.count
        break
      case 'doing':
        doingOrderNumber.value = val.count
        break
      case 'done':
        doneOrderNumber.value = val.count
        break
      case 'warning':
        warningOrderNumber.value = val.count
        break
      case 'timeout':
        timeoutOrderNumber.value = val.count
        break
      case 'expedite':
        expediteOrderNumber.value = val.count
        break
      default:
        break
    }
  } catch (error) {}
}
</script>
<style scoped >
:deep(.el-tabs__header){
  margin: 0 0 5px;
}
.agent-container{
  margin: 5px;
  width: 100%;
}
</style>
<template>
  <div class="agent-container bg-white">
    <ElTabs ref="myTab" v-model="currentSelectedItem" type="card">
      <el-tab-pane label="待认领（待办）" name="todo" :closable="false">
        <template #label>
          <span class="custom-tab-label" v-if="todoOrderNumber > 0">
            待认领（待办）
            <span class="tab-count">{{ todoOrderNumber < 100 ? todoOrderNumber : '99+' }}</span>
          </span>
          <span class="custom-tab-label" v-else> 待认领（待办） </span>
        </template>
        <TodoOrder ref="todoOrderRef" @sendCount="updateCount" />
      </el-tab-pane>
      <el-tab-pane label="已认领（在办）" name="doing" :closable="false">
        <template #label>
          <span class="custom-tab-label" v-if="doingOrderNumber > 0">
            已认领（在办）
            <span class="tab-count">{{ doingOrderNumber < 100 ? doingOrderNumber : '99+' }}</span>
          </span>
          <span class="custom-tab-label" v-else> 已认领（在办） </span>
        </template>
        <DoingOrder ref="doingOrderRef" @sendCount="updateCount" />
      </el-tab-pane>
      <el-tab-pane label="已处理（流转中）" name="done" :closable="false">
        <template #label>
          <span class="custom-tab-label" v-if="doneOrderNumber > 0">
            已处理（流转中）
            <span class="tab-count">{{ doneOrderNumber < 100 ? doneOrderNumber : '99+' }}</span>
          </span>
          <span class="custom-tab-label" v-else> 已处理（流转中） </span>
        </template>
        <DoneOrder ref="doneOrderRef" @sendCount="updateCount" />
      </el-tab-pane>
      <el-tab-pane label="预警" name="warning" :closable="false">
        <template #label>
          <span class="custom-tab-label" v-if="warningOrderNumber > 0">
            预警
            <span class="tab-count">{{ warningOrderNumber < 100 ? warningOrderNumber : '99+' }}</span>
          </span>
          <span class="custom-tab-label" v-else> 预警 </span>
        </template>
        <WarningOrder ref="warningOrderRef" @sendCount="updateCount" />
      </el-tab-pane>
      <el-tab-pane label="超时" name="timeout" :closable="false">
        <template #label>
          <span class="custom-tab-label" v-if="timeoutOrderNumber > 0">
            超时
            <span class="tab-count">{{ timeoutOrderNumber < 100 ? timeoutOrderNumber : '99+' }}</span>
          </span>
          <span class="custom-tab-label" v-else> 超时 </span>
        </template>
        <TimeoutOrder ref="timeoutOrderRef" @sendCount="updateCount" />
      </el-tab-pane>
      <el-tab-pane label="被催办" name="expedite" :closable="false">
        <template #label>
          <span class="custom-tab-label" v-if="expediteOrderNumber > 0">
            被催办
            <span class="tab-count">{{ expediteOrderNumber < 100 ? expediteOrderNumber : '99+' }}</span>
          </span>
          <span class="custom-tab-label" v-else> 被催办 </span>
        </template>
        <ExpediteOrder ref="expediteOrderRef" @sendCount="updateCount" />
      </el-tab-pane>
    </ElTabs>
  </div>
</template>
<style scoped>
.custom-tab-label {
  position: relative;
  padding-right: 10px;
}

.tab-count {
  position: absolute;
  top: -8px;
  right: 0;
  background: #f56c6c;
  color: white;
  border-radius: 10px;
  min-width: 18px;
  height: 18px;
  line-height: 18px;
  text-align: center;
  font-size: 10px;
  padding: 0 4px;
}
</style>
