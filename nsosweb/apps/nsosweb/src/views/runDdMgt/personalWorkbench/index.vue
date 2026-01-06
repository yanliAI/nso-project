<template>
  <Page auto-content-height>
    <el-tabs type="card" v-model="activeName" class="w-full h-full bg-white demo-tabs">
      <el-tab-pane label="待办" :icon="Checked" name="first" :closable="false">
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><Checked /></el-icon>
            <span>待办（{{data.num1}}）</span>
          </span>
        </template>
        <!-- <ToDo @updateTitle="updateTatol1"/> -->
      </el-tab-pane>
      <el-tab-pane label="已办" name="second" :icon="Reading" :closable="false">
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><Reading /></el-icon>
            <span>已办（{{data.num2}}）</span>
          </span>
        </template>
        <!-- <AlreadyDone @updateTitle="updateTatol2"/> -->
      </el-tab-pane>
    </el-tabs>
  </Page>
</template>

<script  setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { ElTabs, ElTabPane} from 'element-plus';
import { Checked, Reading } from '@element-plus/icons-vue';
import { Page } from '@vben/common-ui';
import ToDo from './toDo.vue'
import AlreadyDone from './alreadyDone.vue'


const activeName = ref('first');

const data = reactive({
  num1: 0,
  num2: 0,
})

const updateTatol1 = (val) => {
  data.num1 = val;
}
const updateTatol2 = (val) => {
  data.num2 = val;
}
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
