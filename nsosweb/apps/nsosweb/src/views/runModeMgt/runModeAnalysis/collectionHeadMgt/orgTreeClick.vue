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
            <span class="span-ellipsis"  :title="node.label">{{ node.label }}</span>
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
import {initOrgApi, getOrgChildrenApi} from '#/api'
// 定义假数据
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
  treeData.value = await initOrgApi()
  // treeData.value = mockData.initOrgTree
  if (treeData.value && treeData.value.length > 0) {
    // expandedKeys.value = [treeData.value[0].orgId]
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
    const children = await getOrgChildrenApi({ orgId: node.data.orgId }) || []

    console.log('子节点数据:', children);
    resolve(children)
    // resolve(mockData.children || [])

    // const children = mockData.children[node.data.orgId] || [];
    // console.log('子节点数据:', children);
    // resolve(children);
  }
}


const nodeClick = (data, node) => {
  node.expanded = true
  emit('selectOk', data)
}
</script>
<style scoped>

.span-ellipsis {
  width:calc(100% - 80px);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
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
