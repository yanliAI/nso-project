<template>
  <div class="w-full h-full">
    <el-tree-select ref="treeRef" style="width: 100%" v-model="modelValue" :filterable="filterable" :clearable="clearable" :disabled="disabled" node-key="orgId" @node-click="nodeClick" :data="treeData" :default-expanded-keys="expandedKeys" :props="treeProps" :cache-data="cacheData" :load="loadNode" lazy>
      <template #default="{ node }">
        <el-icon class="node-icon" :class="{ 'is-leaf': node.isLeaf }">
          <Document v-if="node.isLeaf" />
          <Folder v-else-if="!node.expanded" />
          <FolderOpened v-else />
        </el-icon>
        <span>{{ node.label }}</span>
      </template>
    </el-tree-select>
  </div>
</template>
<script setup>
import { reactive, onMounted, ref, watch } from 'vue'
import { requestClient } from '#/api/request'
import { Search, Document, Folder, FolderOpened } from '@element-plus/icons-vue'
import { ElTreeSelect } from 'element-plus'

const emit = defineEmits(['update:modelValue'])
const modelValue = defineModel()
// 定义接受的props
const props = defineProps({
  // modelValue: String,
  filterable: Boolean,
  clearable: Boolean,
  disabled: Boolean
})
const treeData = ref([])
const expandedKeys = ref([])
const treeRef = ref()
const orgIdkey = ref()
const treeProps = ref({
  label: 'orgName',
  children: 'childList',
  isLeaf: 'isLeaf'
})
const cacheData = ref([])
onMounted(async () => {
  treeData.value = await requestClient.get(import.meta.env.VITE_NSOSGZ + '/orgTree/initOrgTree')
  if (treeData.value && treeData.value.length > 0) {
    expandedKeys.value = [treeData.value[0].orgId]
  }

  if (modelValue.value) {
    const node = treeRef.value.getNode(modelValue.value)
    if (node == null) {
      const orgInfo = await requestClient.get(import.meta.env.VITE_NSOSGZ + '/topOrganization2/getOrgInfoById', { params: { id: modelValue.value }, showmask: false })
      cacheData.value.push(orgInfo)
    }
  }
})
watch(modelValue, async (val) => {
  const node = treeRef.value.getNode(val)
  if (val != null && node == null) {
    const orgInfo = await requestClient.get(import.meta.env.VITE_NSOSGZ + '/topOrganization2/getOrgInfoById', { params: { id: val }, showmask: false })
    cacheData.value.push(orgInfo)
  }
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
  // orgIdkey.value = data.orgId
  // 触发事件，并传递新的值
  emit('update:modelValue', data.orgId)
  emit('updateName', data.orgName)
  cacheData.value.push(data)
}
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
