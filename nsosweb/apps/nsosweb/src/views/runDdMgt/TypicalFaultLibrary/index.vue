<template>
  <Page auto-content-height>
    <QueryPage style="width:100%;height: 100%;"/>
  </Page>
</template>

<script>
import { Page } from '@vben/common-ui';
import QueryPage from './queryPage.vue';

export default {
  components: {
    QueryPage,
  },
};
</script>

<style>
/* 添加一些基本样式 */
</style>
