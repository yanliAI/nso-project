<template>
  <Page auto-content-height>
    <SelectQuery style="width:100%;height: 100%;"/>
  </Page>
</template>

<script>
import SelectQuery from './selectQuery.vue';
import { Page } from '@vben/common-ui';

export default {
  components: {
    SelectQuery,
  },
};
</script>

<style>
/* 添加一些基本样式 */
</style>
