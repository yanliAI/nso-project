<template>
  <Page auto-content-height>
    <el-container class="h-full bg-white">
      <el-aside width="20%">
        <el-tree style="max-width: 600px" :data="data.treeData" :default-expanded-keys="data.defaultExpandedKeys" node-key="label" @node-click="nodeClick"/>
      </el-aside>
      <el-main width="80%">
        <el-container class="h-full bg-white">
          <el-header height="45px">
            <el-button type="primary" @click="save">保存</el-button>
          </el-header>
          <el-main style="height: calc(100% - 50px)">
            <el-input v-model="data.disposalStrategy" :rows="20" maxlength="2000" show-word-limit type="textarea" placeholder="请输入缺陷类型处置策略" clearable />
          </el-main>
        </el-container>
      </el-main>
    </el-container>
  </Page>
</template>

<script setup>
import { Page } from '@vben/common-ui';
import { ElInput, ElButton, ElMessage, ElNotification, ElContainer, ElAside,  ElHeader, ElMain, ElTree} from 'element-plus';
import { reactive, ref, onMounted, nextTick } from 'vue';
import { requestClient } from '#/api/request';

const data = reactive({
  treeData: [],
  defaultExpandedKeys: [],
  disposalStrategy: null,
  selectedId: null,
});

onMounted(() => {
  nextTick().then(() => {
    queryTree();
  });
});

const queryTree = async () => {
  data.treeData = await getTreeDataApi();
  if (data.treeData.length > 0) {
    data.defaultExpandedKeys = [data.treeData[0].label];
  }
}

const getTreeDataApi = async () => {
  return requestClient.post(
    import.meta.env.VITE_NSOSZH + '/defectTypeManage/queryTree',
  );
}

const nodeClick = async (node) => {
  data.selectedId = node.id
  data.disposalStrategy = await queryApi(data.selectedId)
}

const queryApi = async (id) => {
  let params = { params: { id: id } }
  return requestClient.get(
    import.meta.env.VITE_NSOSZH + '/defectTypeManage/query',
    params
  );
}

const save = async () => {
  if (!data.selectedId) {
    ElMessage.warning("请选择缺陷类型")
    return
  }
  await saveApi(data.selectedId, data.disposalStrategy)
  ElNotification({
    title: '提示',
    message: '保存成功！',
    type: 'success'
  })
}

const saveApi = async (id, content) => {
  let params = { params: { id: id, content: content } }
  return requestClient.get(
    import.meta.env.VITE_NSOSZH + '/defectTypeManage/save',
    params
  );
}
</script>
<style scoped>
</style>
