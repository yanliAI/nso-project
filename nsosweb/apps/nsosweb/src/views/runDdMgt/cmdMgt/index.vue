<template>
  <Page auto-content-height>
    <el-tabs ref="myTab" v-model="data.tabIndex" @tab-remove="removeTab" type="card" @tab-change="tabChange" class="w-full h-full bg-white demo-tabs">
      <el-tab-pane label="草稿" name="list" :icon="Tickets" :closable="false">
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><Tickets /></el-icon>
            <span>草稿（{{data.num0}}）</span>
          </span>
        </template>
        <CmdList ref="cmdListRef1" :queryState="'0'" @refreshList="refreshList1" @afterNullify="afterNullify" @updateTatol="updateTatol"></CmdList>
      </el-tab-pane>
      <el-tab-pane label="待审核" name="list1" :icon="Tickets" :closable="false">
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><Postcard /></el-icon>
            <span>待审核（{{data.num1}}）</span>
          </span>
        </template>
        <CmdList ref="cmdListRef2" :queryState="'1'" @refreshList="refreshList2" @afterBack="afterBack1" @afterNullify="afterNullify" @updateTatol="updateTatol"></CmdList>
      </el-tab-pane>
      <el-tab-pane label="待发布" name="list2" :icon="Tickets" :closable="false">
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><Notebook /></el-icon>
            <span>待发布（{{data.num2}}）</span>
          </span>
        </template>
        <CmdList ref="cmdListRef3" :queryState="'2'" @refreshList="refreshList3" @afterBack="afterBack2" @afterNullify="afterNullify" @updateTatol="updateTatol"></CmdList>
      </el-tab-pane>
      <el-tab-pane label="已发布" name="list3" :closable="false">
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><Position /></el-icon>
            <span>已发布（{{data.num3}}）</span>
          </span>
        </template>
        <CmdList ref="cmdListRef4" :queryState="'3'" @afterNullify="afterNullify" @updateTatol="updateTatol"></CmdList>
      </el-tab-pane>
      <el-tab-pane label="复令中" name="list4" :closable="false">
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><ChatLineSquare /></el-icon>
            <span>复令中（{{data.num4}}）</span>
          </span>
        </template>
        <CmdList ref="cmdListRef5" :queryState="'4'" @afterNullify="afterNullify" @updateTatol="updateTatol"></CmdList>
      </el-tab-pane>
      <el-tab-pane label="待复核" name="list5" :closable="false">
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><DocumentChecked /></el-icon>
            <span>待复核（{{data.num5}}）</span>
          </span>
        </template>
        <CmdList ref="cmdListRef6" :queryState="'5'" @refreshList="refreshList4" @afterNullify="afterNullify" @updateTatol="updateTatol"></CmdList>
      </el-tab-pane>
      <el-tab-pane label="已终结" name="list6" :closable="false">
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><CircleCheck /></el-icon>
            <span>已终结（{{data.num6}}）</span>
          </span>
        </template>
        <CmdList ref="cmdListRef7" :queryState="'6'" @afterNullify="afterNullify" @updateTatol="updateTatol"></CmdList>
      </el-tab-pane>
      <el-tab-pane label="作废" name="list7" :closable="false">
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><Delete /></el-icon>
            <span>作废（{{data.num7}}）</span>
          </span>
        </template>
        <CmdList ref="cmdListRef8" :queryState="'7'" @updateTatol="updateTatol"></CmdList>
      </el-tab-pane>
    </el-tabs>
  </Page>
</template>
<script setup>
import { Page } from '@vben/common-ui';
import { onMounted, reactive, ref, watch } from 'vue';
import { ElTabs, ElTabPane} from 'element-plus';
import { Tickets, Position, ChatLineSquare, CircleCheck, Delete, DocumentChecked, Postcard, Notebook } from '@element-plus/icons-vue';
import CmdList from './cmdList.vue'
import CmdDetail from './cmdDetail.vue'
import { useRoute } from 'vue-router';

const cmdListRef1 = ref()
const cmdListRef2 = ref()
const cmdListRef3 = ref()
const cmdListRef4 = ref()
const cmdListRef5 = ref()
const cmdListRef6 = ref()
const cmdListRef7 = ref()
const cmdListRef8 = ref()

const data = reactive({
  tabIndex: 'list',
  tabArr: [],
  num0: 0,
  num1: 0,
  num2: 0,
  num3: 0,
  num4: 0,
  num5: 0,
})
const refreshList1 = (showmask) => {
  cmdListRef2.value.query(showmask)
}
const refreshList2 = (showmask) => {
  cmdListRef2.value.query(showmask)
  cmdListRef3.value.query(showmask)
}
const refreshList3 = (showmask) => {
  cmdListRef3.value.query(showmask)
  cmdListRef4.value.query(showmask)
}
const refreshList4 = (showmask) => {
  cmdListRef5.value.query(showmask)
  cmdListRef6.value.query(showmask)
  cmdListRef7.value.query(showmask)
}
const afterBack1 = (showmask) => {
  cmdListRef1.value.query(showmask)
  cmdListRef2.value.query(showmask)
}
const afterBack2 = (showmask) => {
  cmdListRef2.value.query(showmask)
  cmdListRef3.value.query(showmask)
}
const afterNullify = (showmask) => {
  cmdListRef8.value.query(showmask)
}
const updateTatol = (type, val) => {
  eval('data.num'+type+' = ' + val)
}
const tabChange = () => {
  cmdListRef1.value.data.moreVisible = false
  cmdListRef2.value.data.moreVisible = false
  cmdListRef3.value.data.moreVisible = false
  cmdListRef4.value.data.moreVisible = false
  cmdListRef5.value.data.moreVisible = false
  cmdListRef6.value.data.moreVisible = false
  cmdListRef7.value.data.moreVisible = false
  cmdListRef8.value.data.moreVisible = false
}

// 接收运调工作台跳转参数
const route = useRoute();
const workbenchData = ref(route.query);

onMounted(() => {
  if (route.query.id) {
    let status = route.query.commandStatus
    let ref = eval('cmdListRef' + (parseInt(status) + 1))
    data.tabIndex = 'list' + (status === '0' ? '' : status)
    ref.value.showDetailForWorkbench(route.query, route.query.commandFl)
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
