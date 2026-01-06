<template>
  <Page auto-content-height>
      <el-tabs type="card" v-model="activeTab" class="w-full h-full bg-white">
        <el-tab-pane label="大类管理" name="category">
          <CategoryTemplateManager @update:selectedCategoryId="selectedCategoryId = $event" />
        </el-tab-pane>
        <el-tab-pane label="子类管理" name="subcategory">
          <SubcategoryTemplateManager :selectedCategoryId="selectedCategoryId" />
        </el-tab-pane>
      </el-tabs>
  </Page>
</template>

<script>
import { ref } from 'vue';
import { ElTabs, ElTabPane, ElButton } from 'element-plus';
import CategoryTemplateManager from './categoryTemplateManager.vue';
import SubcategoryTemplateManager from './subcategoryTemplateManager.vue';
import { Page } from '@vben/common-ui';

export default {
  components: {
    ElTabs,
    ElTabPane,
    ElButton,
    CategoryTemplateManager,
    SubcategoryTemplateManager,
  },
  setup() {
    const activeTab = ref('category');
    const selectedCategoryId = ref(null);

    return {
      activeTab,
      selectedCategoryId,
    };
  },
};
</script>

<style scoped>
:deep(.el-tab-pane) {
  width: 100%;
  height: 100%;
}
</style>
