<template>
  <div class="w-full h-full">
    <div class="flex items-center h-8 part-b mb-2">
      <Expand class="primary w-3.5 h-3.5"></Expand>
      <span class="primary pl-1">指令内容</span>
    </div>
    <el-form label-width="auto" ref="ruleFormRef" :model="formData" :inline="true" size="small" label-position="right" class="demo-form-inline">
      <el-row>
        <el-col :span="24">
          <el-form-item label="措施内容" prop="faultInfo">
            <el-input v-model="formData.faultInfo" :rows="5" show-word-limit disabled type="textarea" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="指令编号:" prop="effectRange">
            <el-input v-model="formData.effectRange" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发令人:" prop="effectRange">
            <el-input v-model="formData.effectRange" disabled clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发令时间:" prop="faultOccurTime">
            <el-date-picker v-model="formData.faultOccurTime" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" disabled clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="范围:" prop="faultOccurTime">
            <el-select v-model="formData.faultSys" filterable>
              <el-option v-for="item in dropList.NSOS_SYSTEM_INFO" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="指令执行类型:" prop="effectRange">
            <el-col :span="9">
              <el-select v-model="formData.commandExecType" filterable>
                <el-option label="立即执行" value="1"></el-option>
                <el-option label="计划执行" value="2"></el-option>
              </el-select>
            </el-col>
            <el-col :span="1" class="text-center" v-if="formData.commandExecType == 2">-</el-col>
            <el-col :span="14">
              <el-date-picker v-if="formData.commandExecType == 2" v-model="formData.planExecTime" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" clearable/>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="指令内容:" prop="faultInfo">
            <el-input v-model="formData.faultInfo" :rows="6" maxlength="256" show-word-limit type="textarea" placeholder="请输入指令内容" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="text-center">
        <el-button type="primary" class="ml-4" :icon="EditPen" size="small">发布指令</el-button>
        <el-button type="info" plain class="ml-4" :icon="Close" size="small" @click="close">取消</el-button>
      </div>
    </el-form>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { ElForm, ElFormItem, ElRow, ElCol} from 'element-plus';
import { Expand, View, Tickets, EditPen, Close } from '@element-plus/icons-vue';
import type { FormInstance } from 'element-plus'
import { useDropStore } from '#/store';

const dropList: any = reactive({});

//const formData:any = defineModel('formData')
const formData:any = reactive({
  commandExecType: '1',
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
}

.primary{
  color: hsl(var(--primary));
}

.part-b{
  border-top: 1px solid #c4dbf5;
  border-bottom: 1px solid #c4dbf5;
}
</style>
