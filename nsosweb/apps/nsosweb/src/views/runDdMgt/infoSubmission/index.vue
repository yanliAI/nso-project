<template>
  <Page auto-content-height>
    <el-tabs ref="myTab" v-model="data.tabIndex" @tab-remove="removeTab" type="card" class="w-full h-full bg-white">
      <el-tab-pane label="信息报送" name="list" :closable="false">
        <InfoSubmissionList ref="submissionListRef" @addSubmission="addSubmission" @showDetail="showDetail"></InfoSubmissionList>
      </el-tab-pane>
      <el-tab-pane v-for="item in data.tabArr" :key="item.name" :label="item.title" :name="item.name" closable>
        <InfoSubmissionDetail :submissionId="item.id" :tabName="item.name" @afterAdd="afterAdd($event, item)" @refreshList="refreshList" @removeTab="removeTab" @close="close"></InfoSubmissionDetail>
      </el-tab-pane>
    </el-tabs>
  </Page>
</template>
<script setup>
import { Page } from '@vben/common-ui';
import { onMounted, reactive, ref } from 'vue';
import { ElTabs, ElTabPane } from 'element-plus';
import InfoSubmissionList from './infoSubmissionList.vue';
import InfoSubmissionDetail from './infoSubmissionDetail.vue';
const data = reactive({
  tabIndex: 'list',
  tabArr: [],
})
const submissionListRef = ref()
const addSubmission = () => {
  showDetail(null);
}
const refreshList = () => {
  submissionListRef.value.query()
}
const showDetail = (row) => {
  let tabArr = data.tabArr;
  let tab;
  if (row) {
    tabArr.some((item) => {
      if (item.id == row.id) {
        tab = item;
        return true;
      }
    });
  }

  if (!tab) {
    tab = {}
    tab.name = new Date().getTime() + '';
    if (row) {
      // 已保存工单tab信息
      tab.title = row.infoCode ? row.infoCode : "未编号";
      tab.id = row.id
    } else {
      // 新增工单tab信息
      tab.title = "新增";
      tab.id = null
    }
    tabArr.push(tab);
  }
  data.tabIndex = tab.name;
}
const afterAdd = (row, tabPane) => {
  tabPane.id = row.id;
  tabPane.title = row.infoCode;

  // 更新头部信息
  data.tabArr.some((item) => {
      if (item.name === tabPane.name) {
          item.title = tabPane.title;
          return true;
      }
  });
}
const removeTab = (targetName) => {
  let tabArr = data.tabArr;
  let tab;

  let tabIndex = data.tabIndex;
  if (tabIndex === targetName) {
    tabIndex = 'list';
    let nextTab;
    tabArr.forEach(function(tab, index) {
      if (tab.name === targetName) {
        nextTab = tabArr[index + 1] || tabArr[index - 1];
        if (nextTab) {
          tabIndex = nextTab.name;
        }
      }
    });
  }
  data.tabIndex = tabIndex;
  for (var i = 0; i < tabArr.length; i++) {
    if (tabArr[i].name == targetName) {
      tabArr.splice(i, 1);
      break;
    }
  }
}
const close = (tabName) => {
  removeTab(tabName);
}
</script>
<style scoped>
:deep(.el-tab-pane) {
  width: 100%;
  height: 100%;
}
</style>
