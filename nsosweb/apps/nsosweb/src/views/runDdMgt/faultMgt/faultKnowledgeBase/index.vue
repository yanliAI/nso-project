<template>
  <Page auto-content-height>
    <FkbList ></FkbList>
  </Page>
</template>

<script setup>
import { Page } from '@vben/common-ui';
import FkbList from './fkbList.vue'
</script>

<style scoped>
:deep(.el-tab-pane) {
  width: 100%;
  height: 100%;
}
</style>
