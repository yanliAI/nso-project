<template>
  <div class="w-full h-full">
    <div class="flex items-center h-8 part-b mb-2">
      <Expand class="primary w-3.5 h-3.5"></Expand>
      <span class="primary pl-1">措施内容</span>
    </div>
    <el-form label-width="auto" ref="ruleFormRef" :model="formData" :inline="true" size="small" label-position="right" class="demo-form-inline">
      <el-row>
        <el-col :span="24">
          <el-form-item label="范围:" prop="faultSys">
            <el-select v-model="formData.faultSys" filterable>
              <el-option v-for="item in dropList.NSOS_SYSTEM_INFO" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="组件类型:" prop="faultSys">
            <el-col :span="6">
              <el-radio-group>
                <el-radio :value="1">选择</el-radio>
                <el-radio :value="2">其他</el-radio>
              </el-radio-group>
            </el-col>
            <el-col :span="18">
              <el-select v-model="formData.faultSys" filterable>
                <el-option v-for="item in dropList.NSOS_SYSTEM_INFO" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="组件名称:" prop="faultSys">
            <el-col :span="6">
              <el-radio-group >
                <el-radio :value="1">选择</el-radio>
                <el-radio :value="2">其他</el-radio>
              </el-radio-group>
            </el-col>
            <el-col :span="18">
              <el-select v-model="formData.faultSys" filterable>
                <el-option v-for="item in dropList.NSOS_SYSTEM_INFO" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="组件IP:" prop="faultSys">
            <el-col :span="6">
              <el-radio-group>
                <el-radio :value="1">选择</el-radio>
                <el-radio :value="2">其他</el-radio>
              </el-radio-group>
            </el-col>
            <el-col :span="18">
              <el-select v-model="formData.faultSys" filterable>
                <el-option v-for="item in dropList.NSOS_SYSTEM_INFO" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="操作类型:" prop="faultSys">
            <el-col :span="6">
              <el-radio-group>
                <el-radio :value="1">选择</el-radio>
                <el-radio :value="2">其他</el-radio>
              </el-radio-group>
            </el-col>
            <el-col :span="18">
              <el-select v-model="formData.faultSys" filterable>
                <el-option v-for="item in dropList.NSOS_SYSTEM_INFO" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="其他:" prop="faultInfo">
            <el-input v-model="formData.faultInfo" :rows="3" maxlength="256" show-word-limit type="textarea" placeholder="请输入其他信息" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="mb-1">
        <el-button type="primary" plain :icon="View" size="small">措施内容预览</el-button>
      </div>
      <el-row>
        <el-col :span="24">
          <el-form-item label="" prop="faultInfo">
            <el-input v-model="formData.faultInfo" :rows="5" maxlength="256" show-word-limit type="textarea" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="text-center">
        <el-button type="primary" class="ml-4" :icon="Tickets" size="small">保存措施</el-button>
        <el-button type="primary" class="ml-4" :icon="EditPen" size="small" @click="releaseClick">生成指令</el-button>
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
const formData:any = reactive({});
const ruleFormRef:any = ref<FormInstance>()
const emit = defineEmits(['close','release'])

onMounted(async () => {
  const dropStore = useDropStore();
  const dropType = ['NSOS_SYS_LEVEL', 'NSOS_OPERATE_SCHEMA', 'NSOS_FAULT_TYPE', 'NSOS_OPERATE_ORG', 'NSOS_SYSTEM_INFO']
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);
});
const releaseClick = (r) => {
  emit('release')
}
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

.part-b{
  border-top: 1px solid #c4dbf5;
  border-bottom: 1px solid #c4dbf5;
}
</style>
