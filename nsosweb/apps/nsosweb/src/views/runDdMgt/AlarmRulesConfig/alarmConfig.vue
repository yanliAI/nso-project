<template>
  <el-container class="h-full bg-white">
    <el-header height="45px">
      <el-form label-width="auto" :inline="true" label-position="right" class="demo-form-inline">
        <el-row>
          <el-col :span="8" class="" style="margin-left: 83%;">
            <el-button type="primary" class="ml-4" :icon="SuccessFilled" @click="save">保存</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-main style="height: calc(100% - 45px);">
      <el-table border size="small" style="height: 100%;" :data="alarmConfigData" >
        <el-table-column type="index" fixed width="40" label="#" align="center" />
        <el-table-column type="selection" />
        <el-table-column prop="content" label="内容" width="200" align="center"></el-table-column>
        <el-table-column prop="isAutoJudge" label="是否启用" width="200" align="center">
          <el-switch v-model="isAutoJudgmentEnabled" style="--el-switch-on-color: #13ce66" @change="toggleAutoJudgment"
            inline-prompt active-text="&nbsp是&nbsp&nbsp&nbsp" inactive-text="&nbsp&nbsp&nbsp否&nbsp">
          </el-switch>
        </el-table-column>
        <el-table-column prop="isAutoJudgeValue" label="是否有效" width="200" align="center"></el-table-column>
        <el-table-column prop="updatorId" label="最后修改人"  align="center"/>
        <el-table-column prop="updateTime" label="最后修改时间" :formatter="formatTimestamp"  align="center"/>
      </el-table>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import {ElTable,ElTableColumn,ElFormItem,ElForm,ElInput,ElButton,ElSelect,ElPagination,ElContainer,ElHeader,ElMain,ElFooter,ElDialog,ElMessage,ElMessageBox, SIZE_INJECTION_KEY} from 'element-plus';
import { ref, reactive, computed, onMounted } from 'vue';
import { requestClient } from '#/api/request';
import { findRootMenuByPath } from '@vben/utils';
import { SuccessFilled } from '@element-plus/icons-vue';

const isAutoJudgmentEnabled = ref(false);
const alarmConfigData = ref([{content: '系统自动判研',isAutoJudge: '',isAutoJudgeValue: '是',updatorId: '',updateTime: ''}]);

const form = reactive({
  id: '1',
  content: '系统自动判研',
  isAutoJudge: '',
  isAutoJudgeValue: '',
  updatorId: '',
  updateTime: ''
});

var responses = ref({});

const query = async () => {
  const response = await requestClient.get(import.meta.env.VITE_NSOSGZ + '/alarmConfig/queryDataById/1');
  responses = response;
  if (response.isAutoJudge === "Y"){
    isAutoJudgmentEnabled.value = true;
  }
  else{
    isAutoJudgmentEnabled.value = false;
  }
  alarmConfigData.value[0].updatorId = response.updatorId;
  alarmConfigData.value[0].updateTime = response.updateTime;
};

const toggleAutoJudgment = async (value) => {
      try {
        if (value === true){
          responses.isAutoJudge = 'Y';
        }
        else{
          responses.isAutoJudge = 'N';
        }
        ElMessage.success('状态已改变');
      } catch (error) {
        console.error('Error toggling auto judgment status:', error);
        ElMessage.error('Failed to update auto judgment status');
        isAutoJudgmentEnabled.value = !value;
      }
    };

function formatTimestamp(row, column, cellValue) {
  const date = new Date(cellValue);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


const save = async () => {
  const respone = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/alarmConfig/saveDataTo',responses);
  if(respone === '1'){
    ElMessage.success('保存成功!');
  }else{
    ElMessage.error('保存失败!');
  }
  query();
};

onMounted( () => {
  query();
});
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
</style>

