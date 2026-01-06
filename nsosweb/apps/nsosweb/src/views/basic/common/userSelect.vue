<template>
  <div class="w-full h-full flex overflow-hidden">
    <div class="h-full w-[400px]">
      <div>
        <el-input v-model="filterText" class="mb-2" style="width: 98%" :prefix-icon="Search" placeholder="请输入组织名称" />
      </div>
      <div class="h-full overflow-y-auto">
        <el-tree ref="treeRef" style="width: 98%" v-model="orgIdkey" node-key="orgId" @node-click="nodeClick" :data="treeData" :props="props" :default-expanded-keys="expandedKeys" :filter-node-method="filterNode" highlight-current :load="loadNode" lazy>
          <template #default="{ node }">
            <el-icon class="node-icon" :class="{ 'is-leaf': node.isLeaf }">
              <Document v-if="node.isLeaf" />
              <Folder v-else-if="!node.expanded" />
              <FolderOpened v-else />
            </el-icon>
            <span>{{ node.label }}</span>
          </template>
        </el-tree>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, onMounted, ref, watch } from 'vue'
import { requestClient } from '#/api/request'
import { Search, Document, Folder, FolderOpened } from '@element-plus/icons-vue'
import { ElForm, ElFormItem, ElRow, ElCol, ElTable, ElTableColumn, ElPagination } from 'element-plus'

const emit = defineEmits()

const treeData = ref()
const expandedKeys = ref([])
const filterText = ref()
const treeRef = ref()
const orgIdkey = ref()
const props = ref({
  label: 'orgName',
  children: 'childList',
  isLeaf: 'isLeaf'
})
onMounted(async () => {
  treeData.value = await requestClient.get(import.meta.env.VITE_NSOSGZ + '/orgTree/initOrgTree')
  if (treeData.value && treeData.value.length > 0) {
    expandedKeys.value = [treeData.value[0].orgId]
  }
})

watch(filterText, (val) => {
  treeRef.value.filter(val)
})

const filterNode = (value, data) => {
  if (!value) return true
  return data.orgName.includes(value)
}
const loadNode = async (node, resolve) => {
  if (node.level >= 1) {
    resolve(await requestClient.get(import.meta.env.VITE_NSOSGZ + '/orgTree/children', { params: { orgId: node.data.orgId }, showmask: false }))
  }
}
const nodeClick = (data, node) => {
  node.expanded = true
  emit('selectOk', data)
  // orgIdkey.value = data.orgId;
  // queryUserInfo()
}
// const selectClick = (row) => {
//   emit('selectOk', row)
// }
</script>
<style scoped>
/* 滚动条样式 **/
div::-webkit-scrollbar {
  width: 6px;
}

div::-webkit-scrollbar-track {
  border-radius: 4px;
}

div::-webkit-scrollbar-thumb {
  border-radius: 10px;
}

:deep(.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content) {
  background-color: #d9e9fc;
}

.demo-form-inline .el-input {
  --el-input-width: 100%;
}

.demo-form-inline .el-select {
  --el-select-width: 100%;
}

:deep(.el-date-editor.el-input, .el-date-editor.el-input__wrapper) {
  width: 100%;
}

:deep(.el-form--inline .el-form-item) {
  width: calc(100% - 20px);
  margin-right: 20px;
  margin-bottom: 12px;
}

:deep(.el-form-item) {
  width: calc(100% - 20px);
  margin-right: 20px;
  margin-bottom: 12px;
}

.dianji {
  font-weight: normal;
  color: #4266ff;
  cursor: pointer;
}

.dianji:hover {
  text-decoration: underline;
}

.node-icon {
  margin-right: 5px;
  color: #4266ff;
}
</style>
