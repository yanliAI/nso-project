<script lang="ts" setup>
import { ref } from 'vue'
import { ElTabs, ElTabPane } from 'element-plus'
import { Page } from '@vben/common-ui'
import PublishPatch from './publishPatch.vue'
import PatchBank from './patchBank.vue'

const activeName = ref('first')
</script>

<template>
  <Page auto-content-height>
    <el-tabs type="border-card" v-model="activeName" style="height: 100%; width: 100%">
      <el-tab-pane label="发布补丁" name="first" style="height: 100%; width: 100%">
        <PublishPatch />
      </el-tab-pane>
      <el-tab-pane label="补丁库" name="second" style="height: 100%; width: 100%">
        <PatchBank />
      </el-tab-pane>
    </el-tabs>
  </Page>
</template>

<style scoped></style>
