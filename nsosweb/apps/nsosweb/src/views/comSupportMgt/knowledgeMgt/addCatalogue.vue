<template>
  <el-dialog :model-value="true" title="上传文件" @close="closeDialog">
    <el-container class="h-full bg-white">
      <el-header height="30px">
        <el-form
          label-width="auto"
          ref="ruleFormRef"
          :model="data.formData"
          :inline="true"
          label-position="right"
          class="demo-form-inline"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item label="名称：">
                <el-input v-model="data.formData.contenName" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-button
                type="primary"
                class="ml-4"
                :icon="Search"
                @click="query"
                >查询</el-button
              >
              <el-button
                type="primary"
                class="ml-4"
                :icon="Plus"
                @click="addCatalogue"
                >新增</el-button
              >
              <el-button
                type="primary"
                class="ml-4"
                :icon="Delete"
                @click="delCatalogue"
                >删除</el-button
              >
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <el-main style="height: calc(100%-25px)" class="mt-2">
        <el-table
          :data="data.tableData"
          border
          size="small"
          style="height: 100%"
          ref="contenTab"
        >
          <el-table-column
            type="index"
            fixed
            width="40"
            label="#"
            align="center"
          />
          <el-table-column type="selection" width="40" align="center" />
          <el-table-column prop="contenName" label="名称" align="center" />
          <el-table-column prop="parentId" label="上级目录" align="center" />
          <el-table-column prop="createTime" label="创建时间" align="center" />
          <el-table-column prop="creator" label="创建人" align="center" />
        </el-table>
      </el-main>
    </el-container>
  </el-dialog>
</template>
<script setup lang="ts">
import { reactive, onMounted, ref } from 'vue';
import {
  ElDialog,
  ElTableColumn,
  ElContainer,
  ElHeader,
  ElForm,
  ElRow,
  ElCol,
  ElFormItem,
  ElInput,
  ElMain,
  ElTable,
  ElMessage,
  ElMessageBox,
} from 'element-plus';
import { Search, Delete, Plus } from '@element-plus/icons-vue';
import { queryConten, addConten, deleteConten } from './knowledgeMgt.ts';

const emit = defineEmits(['switchCatalog', 'query']);
const closeDialog = () => {
  emit('switchCatalog', false);
};

const contenTab = ref();
const data = reactive({
  formData: {
    contenName: '',
  },
  tableData: [],
});

const query = async () => {
  data.tableData = await queryConten(data.formData.contenName);
};

const addCatalogue = async () => {
  data.tableData.push({});
};

const delCatalogue = async () => {
  ElMessageBox.confirm('确认是否删除?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    let delList = contenTab.value.getSelectionRows();
    let ids = [];
    for (let i = 0; i < delList.length; i++) {
      ids.push(delList[i].id);
    }
    await deleteConten(ids);
    query();
    ElMessage({
      title: '提示',
      message: '删除成功！',
      type: 'success',
    });
  });
};

onMounted(async () => {
  query();
});
</script>
<style scoped>
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

:deep(.el-main) {
  padding: 0;
}
</style>
