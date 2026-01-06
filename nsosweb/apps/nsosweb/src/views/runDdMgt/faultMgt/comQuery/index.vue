<template>
  <Page auto-content-height>
    <ComprehensiveQuery style="width:100%;height: 100%;"/>
  </Page>
</template>

<script>
import ComprehensiveQuery from './comprehensiveQuery.vue';
import { Page } from '@vben/common-ui';

export default {
  components: {
    ComprehensiveQuery,
  },
};
</script>

<style>
/* 添加一些基本样式 */
</style>
