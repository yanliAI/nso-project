<template>
  <Page auto-content-height>
    <el-tabs v-model="activeName" type="card" class="w-full h-full bg-white demo-tabs">
      <el-tab-pane label="通讯录管理" name="userContacts">
        <SmsUserContacts ref="userRef"/>
      </el-tab-pane>
      <!-- <el-tab-pane label="发送模板维护" name="templateList">
        <SmsTemplateList ref="templateRef"/>
      </el-tab-pane> -->
    </el-tabs>
  </Page>
</template>
<script setup>
import { ref, reactive } from 'vue';
import { ElTabs, ElTabPane } from 'element-plus';
import { Page } from '@vben/common-ui';
import SmsUserContacts from './smsUserContacts.vue'
import SmsTemplateList from './smsTemplateList.vue'
const activeName = ref('userContacts');
const data = reactive({
  tabName: null,
})

const userRef = ref()
const templateRef = ref()
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
</style>
