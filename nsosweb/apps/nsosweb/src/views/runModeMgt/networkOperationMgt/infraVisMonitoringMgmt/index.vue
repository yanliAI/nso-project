<script setup lang="ts">
import { ref } from 'vue'
import alertLogs from './alertLogs.vue'
import facilityRecord from './facilityRecord .vue'
import investmentWithdrawalRecord from './investmentWithdrawalRecord.vue'
import facilityImg from './facilityImg.vue'
import {
  ElTable,
  ElTableColumn,
  ElContainer,
  ElFormItem,
  ElDialog,
  ElForm,
  ElCard,
  ElInput,
  ElButton,
  ElSelect,
  ElRow,
  ElCol,
  ElTabs,
  ElPagination,
  ElMessage,
  ElMessageBox,
  type FormInstance,
} from 'element-plus';


const currentSelectedItem = ref('facilityRecord')
</script>
<script scoped lang="less"></script>
<template>
  <div class="h-full">
    <ElTabs ref="myTab" v-model="currentSelectedItem" type="card">
      <el-tab-pane label="设施台账" name="facilityRecord" :closable="false">
        <facilityRecord />
      </el-tab-pane>
      <el-tab-pane label="告警记录" name="alertLogs" :closable="false">
        <alertLogs />
      </el-tab-pane>
      <el-tab-pane label="投退记录" name="investmentWithdrawalRecord" :closable="false">
        <investmentWithdrawalRecord />
      </el-tab-pane>
      <el-tab-pane label="设施图纸" name="maintenanceUnit " :closable="false">
        <facilityImg/>
      </el-tab-pane>
    </ElTabs>
  </div>
</template>
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

:deep(.el-upload-list__item){
  width: 500px;
}

/* :deep(.el-form-item) {
  width: 300px;
  .el-form-item__content {
    display: flex;
    justify-content: flex-end;
  }
  .el-form-item__label {
    width: 100px;
    text-align: right;
    font-size: 14px;
    font-weight: 500;

    color: #515a6e;
  }
} */
:deep(.el-form-item__label) {
    width: 100px;
  }
</style>
