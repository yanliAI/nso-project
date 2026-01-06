<template>
  <el-dialog :model-value="true" :title="dialogTitle" @close="closeDialog">
      <el-form :model="data.formData" label-width="100px">
        <el-row >
          <el-col :span="24">
        <el-form-item label="专家组名称：">
          <el-input v-model="data.formData.groupName"></el-input>
        </el-form-item>
            </el-col>
        </el-row>
        <el-row >
          <el-col :span="12">
        <el-form-item label="创建人：">
          <el-input v-model="data.formData.creatorId"></el-input>
        </el-form-item>
            </el-col>
            <el-col :span="12">
        <el-form-item label="创建时间：">
          <el-input v-model="data.formData.createTime"></el-input>
        </el-form-item>
            </el-col>
        </el-row>
      </el-form>
      <div style="text-align: center;">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </el-dialog>
</template>
<script setup lang="ts">
import { reactive, onMounted, ref } from 'vue';
import {ElTable,ElTableColumn,ElFormItem,ElForm,ElInput,ElButton,ElRow, ElCol,ElSelect,ElPagination,ElContainer,ElHeader,ElMain,ElFooter,ElDialog,ElMessage,ElMessageBox, SIZE_INJECTION_KEY} from 'element-plus';
import { Search, Delete, Plus } from '@element-plus/icons-vue';
import { queryConten, addConten, deleteConten } from './knowledgeMgt.ts';
import { requestClient } from '#/api/request';
import { useAccessStore, useUserStore } from '@vben/stores';

const userStore = useUserStore();
const emit = defineEmits(['switchCatalog', 'query','treeChange']);
const closeDialog = () => {
  emit('switchCatalog', false);
};

const contenTab = ref();
const dialogTitle = ref('新增分组');
const data = reactive({
  formData: {
    groupName: '',
    creatorId: userStore.userInfo?.username,
    createTime: new Date().toLocaleString(),
  },
});

const submitForm = async () => {
  const parm = {
    "groupName": data.formData.groupName,
    "creatorId": data.formData.creatorId,
    "createTime": null,
  }
  const response = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/expertGroup/add', parm);
  emit('treeChange')
  closeDialog();
};


</script>
<style scoped>
 .cell {
    text-align: center;
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

:deep(.el-main) {
  padding: 0;
}

.primary {
  color: hsl(var(--primary));
}

:deep(.el-dialog__footer) {
    text-align: center;
}
</style>
