<template>
  <Page auto-content-height>
    <el-tabs v-model="activeTab" type="card" class="my-tabs">
      <el-tab-pane label="用户管理" name="userMgt" lazy>
        <UserMgt></UserMgt>
      </el-tab-pane>
      <el-tab-pane label="用户组管理" name="userGroupMgt" lazy>
        <UserGroupMgt></UserGroupMgt>
      </el-tab-pane>
    </el-tabs>
  </Page>
</template>

<script lang="ts" setup>
import { ElTabs, ElTabPane } from 'element-plus';
import { Page } from '@vben/common-ui';
import { ref, onMounted, nextTick } from 'vue';
import UserMgt from './userMgt.vue';
import UserGroupMgt from './userGroupMgt.vue';

defineOptions({
  name: 'FlowUserMgt',
});

const activeTab = ref('userMgt');

onMounted(() => {});
</script>

<style scoped>
.my-tabs {
  height: 100%;
}
.el-main {
  padding-top: 0;
}
.cell {
  text-align: center;
}
</style>
