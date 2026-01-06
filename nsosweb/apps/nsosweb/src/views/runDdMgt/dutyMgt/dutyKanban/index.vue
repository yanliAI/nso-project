<template>
  <Page auto-content-height>
    <el-tabs ref="myTab" v-model="data.tabIndex" @tab-remove="removeTab" type="card" @tab-change="tabChange" class="w-full h-full bg-white demo-tabs">
      <el-tab-pane label="个人看板" name="list" :icon="Tickets" :closable="false">
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><Tickets /></el-icon>
            <span>个人看板</span>
          </span>
        </template>
        <CalendarKanban @transToList="transToList"></CalendarKanban>
      </el-tab-pane>
      <el-tab-pane label="换班记录" name="list1" :closable="false">
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><CircleCheck /></el-icon>
            <span>换班记录</span>
          </span>
        </template>
        <ChangeList ref="changeListRef"></ChangeList>
      </el-tab-pane>
    </el-tabs>
  </Page>
</template>
<script setup>
import { Page } from '@vben/common-ui';
import { onMounted, reactive, ref, watch } from 'vue';
import { ElTabs, ElTabPane} from 'element-plus';
import { Tickets, Position, ChatLineSquare, CircleCheck, Delete, DocumentChecked } from '@element-plus/icons-vue';
import CalendarKanban from './calendarKanban.vue'
import ChangeList from './changeList.vue'

const faultHandle1 = ref()
const faultHandle2 = ref()

const changeListRef = ref()

const data = reactive({
  tabIndex: 'list',
  tabArr: [],
})

onMounted(() => {

})

const transToList = (swapCode) => {
  changeListRef.value.data.formData = {status: "P", swapCode: swapCode}
  changeListRef.value.query()
  data.tabIndex = 'list1'
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
