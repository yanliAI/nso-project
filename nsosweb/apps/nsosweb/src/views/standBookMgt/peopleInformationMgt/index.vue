<template>
  <Page auto-content-height>
    <el-tabs ref="myTab" v-model="data.tabIndex"  type="card" class="w-full h-full bg-white">
      <el-tab-pane label="研判专家组管理" name="list" :closable="false">
        <ExpertGroupList ></ExpertGroupList>
      </el-tab-pane>
    </el-tabs>
  </Page>
</template>
<script setup>
import { Page } from '@vben/common-ui';
import { onMounted, reactive, ref } from 'vue';
import { ElTabs, ElTabPane} from 'element-plus';
import ExpertGroupList from './expertGroupList.vue'
const data = reactive({
  tabIndex: 'list',
})

</script>
<style scoped>
:deep(.el-tab-pane) {
  width: 100%;
  height: 100%;
}
</style>
