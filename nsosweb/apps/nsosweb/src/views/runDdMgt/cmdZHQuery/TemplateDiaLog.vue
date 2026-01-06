<template>
  <div style="width: 100%; height: 100%;">
    <div style="width: 100%; height: 10%;"></div>
    <div style="width: 100%; height: 50%;" >
        <el-form label-width="auto" ref="formRef"  :model="formData" :rules="formRules"  :inline="true" label-position="right" class="demo-form-inline">
          <el-row>
            <el-col :span="8">
            <el-form-item label="类型:" prop="cmdLx" style="margin-bottom: 18px">
              <el-select v-model="cmdLx"  filterable clearable>
                <el-option v-for="item in dropList.NSOS_CMD_FL" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="类别名称:" prop="commandTypeCode" filterable>
              <el-select v-model="formData.commandTypeCode" filterable clearable>
                <el-option v-for="item in data.cmdLbDrop" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="指令状态:" prop="commandState" filterable>
              <el-select v-model="formData.commandState" filterable clearable>
                <el-option v-for="item in dropList.NSOS_COMMAND_STATE" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="处置超时时限(小时):" prop="timeoutLimit">
                <el-input-number v-model="formData.timeoutLimit" :min="0" :max="1000000000000000000000000"  />
                <!-- <el-input v-model="formData.timeoutLimit" placeholder="请输入数字" @input="handleNumberInput" clearable /> -->
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="催办时限(小时):" prop="urgingLimit">
                <el-input-number v-model="formData.urgingLimit" :min="0" :max="1000000000000000000000000"  />
                <!-- <el-input v-model="formData.urgingLimit" placeholder="请输入数字" @input="handleNumberInput2" clearable /> -->
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
    </div>
    <div class="flex">
      <div style="width: 40%; height: 100%;"></div>
      <div>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
        <el-button  @click="attachClose">取消</el-button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref, onMounted,watch,nextTick } from 'vue';
import { useDropStore } from '#/store';
import { requestClient } from '#/api/request';
import { ElMessage } from 'element-plus';
import { useVbenModal } from '@vben/common-ui';

const cmdLx = ref('');
const isAdd = ref(1);
const dataF = {
    "commandFl": null,
    "commandTypeCode": null,
    "commandState": null,
    "timeoutLimit": null,
    "urgingLimit": null
}

const formData = defineModel('formData');
const data = reactive({
  cmdLbDrop: [],
});
const emit = defineEmits(['closeDiaLog','query'])
const dropList = reactive({});

const formRef = ref(null)
// 验证规则
const formRules = reactive({
  cmdLx: [
    { required: true, message: '类型不能为空', trigger: 'blur' },
  ],
  commandTypeCode: [
    { required: true, message: '类别名称不能为空', trigger: 'blur' },
  ],
  commandState: [
    { required: true, message: '状态不能为空', trigger: 'blur' },
  ],
  timeoutLimit: [
    { pattern: /^\d+$/, message: '只能输入数字', trigger: 'blur' }
  ],
  urgingLimit: [
    { pattern: /^\d+$/, message: '只能输入数字', trigger: 'blur' }
  ]
})

// 输入过滤：实时限制只能输入数字
const handleNumberInput = (value) => {
  formData.timeoutLimit = value.replace(/[^\d]/g, '');
};

const handleNumberInput2 = (value) => {
  formData.urgingLimit = value.replace(/[^\d]/g, '');
};

onMounted(async () => {
  const dropStore = useDropStore();
  const dropType = ['NSOS_CMD_FL','NSOS_CMD_TYPE','NSOS_COMMAND_STATE']
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);

  if(formData.value.commandFl){
    cmdLx.value = formData.value.commandFl
    isAdd.value = 0;
  }
});

const attachClick = () => {
  modalApi.open()
}

const attachClose =() => {
  emit('closeDiaLog');
}

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
});

const handleSubmit = async () => {
  try {
    // 执行表单验证
    console.log(cmdLx)
    await nextTick();

    await formRef.value.validate()

    // 验证通过后提交逻辑
    save();
  } catch (error) {
    ElMessage.error('请检查表单填写是否正确')
  }
}

const save = async () => {
  try{
    // 执行表单验证
    if(isAdd.value === 1){
      dataF.commandFl = cmdLx.value;
      dataF.commandTypeCode = formData.value.commandTypeCode;
      dataF.commandState = formData.value.commandState;
      dataF.timeoutLimit = formData.value.timeoutLimit;
      dataF.urgingLimit = formData.value.urgingLimit;
      const response = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/disposeCommandRule/add', dataF);
    }else{
      const response = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/disposeCommandRule/add', formData.value);
    }
  }catch {
    ElMessage.error('保存失败')
  }finally{
    emit('closeDiaLog');
    emit('query');
  }

}

watch(cmdLx, (newval) => {
  formData.value.cmdLx = cmdLx
  data.cmdLbDrop = dropList.NSOS_CMD_TYPE?.filter(option => option.filter === newval)
})
</script>
<style scoped>
.head-d{
  width: 100%;
  height: 55px;
  border-bottom: 1px solid #ebebeb;
}
</style>
