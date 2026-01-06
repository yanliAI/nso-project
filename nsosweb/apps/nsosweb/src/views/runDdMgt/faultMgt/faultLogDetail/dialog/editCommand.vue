<template>
  <div class="w-full h-full">
    <el-form label-width="auto" ref="ruleFormRef" :model="formData" :inline="true" size="small" label-position="right" class="demo-form-inline">
      <el-row>
        <el-col :span="8">
          <el-form-item label="时间:" prop="faultOccurTime">
            <el-date-picker v-model="formData.faultOccurTime" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" disabled clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="调度员:" prop="effectRange">
            <el-input v-model="formData.effectRange" disabled clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8" class="text-right">
          <el-button type="primary" class="ml-4" :icon="Tickets" size="small">保存</el-button>
          <el-button type="info" plain class="ml-4" :icon="Close" size="small" @click="close">取消</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="环节:" prop="faultSys">
            <el-col :span="24">
              <el-radio-group>
                <el-radio :value="1">选择</el-radio>
                <el-radio :value="2">其他</el-radio>
              </el-radio-group>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="backg mb-1">
        <div class="primary pl-2 text-xs font-bold">处置进程</div>
      </div>
      <el-row>
        <el-col :span="24">
          <el-form-item label="日志内容:" prop="faultInfo">
            <el-input v-model="formData.faultInfo" :rows="4" maxlength="256" show-word-limit type="textarea" placeholder="请输入指令内容" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="backg mb-1">
      <div class="primary pl-2 text-xs font-bold">指令信息</div>
    </div>
    <el-table :data="data.tableData" size="small" style="width: 100%;height: 150px;">
      <el-table-column type="index" width="40" label="#" align="center"/>
      <el-table-column prop="jd" label="指令编号" width="150" align="center"/>
      <el-table-column prop="log" label="指令内容" align="left"/>
      <el-table-column prop="jbr" label="受令人" width="120" align="center"/>
    </el-table>
    <div class="backg mb-1">
      <div class="primary pl-2 text-xs font-bold">全部进程</div>
    </div>
    <el-table :data="data.tableData" size="small" style="width: 100%;height: 200px;">
      <el-table-column type="index" width="40" label="#" align="center"/>
      <el-table-column prop="jd" label="阶段" width="120" align="center"/>
      <el-table-column prop="sj" label="时间" width="120" align="center"/>
      <el-table-column prop="jbr" label="经办人" width="80" align="center"/>
      <el-table-column prop="log" label="进程日志" align="left"/>
    </el-table>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { ElForm, ElFormItem, ElRow, ElCol, ElTable, ElTableColumn} from 'element-plus';
import { Tickets, Close } from '@element-plus/icons-vue';
import type { FormInstance } from 'element-plus'
import { useDropStore } from '#/store';

const dropList: any = reactive({});

//const formData:any = defineModel('formData')
const formData:any = reactive({
  commandExecType: '1',
});
const data:any = reactive({
  tableData: [{
    jd:'故障处置',
    sj:'2025-01-02',
    jbr: 'xxx',
    log: 'dsfngoajgohdgog',
    csType: '1',
  }],
});
const ruleFormRef:any = ref<FormInstance>()
const emit = defineEmits(['close'])

onMounted(async () => {
  const dropStore = useDropStore();
  const dropType = ['NSOS_SYS_LEVEL', 'NSOS_OPERATE_SCHEMA', 'NSOS_FAULT_TYPE', 'NSOS_OPERATE_ORG', 'NSOS_SYSTEM_INFO']
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);
});

const close = () => {
  emit('close')
}
defineExpose({
  
});
</script>
<style scoped>

.demo-form-inline .el-input {
  --el-input-width: 100%;
}

.demo-form-inline .el-select {
  --el-select-width: 100%;
}

:deep(.el-date-editor.el-input, .el-date-editor.el-input__wrapper){
  width: 100%;
}

:deep(.el-form--inline .el-form-item){
  width: calc(100% - 20px);
  margin-right: 20px;
  margin-bottom: 12px;
}

.primary{
  color: hsl(var(--primary));
}

.backg{
  display: flex;
  align-items: center;
  height: 24px;
  background: #eef5ff;
}

.part-b{
  border-top: 1px solid #c4dbf5;
  border-bottom: 1px solid #c4dbf5;
}
</style>
