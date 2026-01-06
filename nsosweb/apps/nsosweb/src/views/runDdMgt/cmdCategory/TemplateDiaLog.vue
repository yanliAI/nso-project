<template>
  <div style="width: 100%; height: 100%;">
    <div style="width: 100%; height: 10%;"></div>
    <div style="width: 100%; height: 50%;" >
        <el-form label-width="auto" ref="formRef"  :model="formData" :rules="formRules"  :inline="true" label-position="right" class="demo-form-inline">
          <el-row>
            <el-col :span="8">
              <el-form-item label="类型:" prop="commandFl" >
                <el-select v-model="formData.commandFl" clearable>
                <el-option v-for="item in dropList.NSOS_CMD_FL" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="类别:" prop="templateName">
                <el-input v-model="formData.templateName" clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="3"/>
            <el-col :span="5">
              <el-form-item label="是否启用挂图作战:" prop="isGtzz">
                <el-checkbox v-model="formData.isGtzz" true-label="Y" false-label="N" clearable/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="关联模板:" prop="glTemplateName">
                <el-select v-model="formData.glTemplateName" multiple placeholder="请点击选择模板" collapse-tags collapse-tags-tooltip :max-collapse-tags="3"   clearable filterable class="ml-0" style="width: 100%">
                  <el-option v-for="item in dropList.NSOS_CMD_TEMPLATE" :key="item.value" :label="item.label"
                    :value="item.value" />
                </el-select>
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

    <Modal class="w-[700px]" title="附件编辑" :footer="false" :closeOnClickModal="false" :draggable="true">
      <AttachFile :parentId="formData.id" close="addClose"></AttachFile>
    </Modal>
  </div>
</template>
<script setup>
import { onMounted, reactive,ref } from 'vue';
import { useDropStore } from '#/store';
import { requestClient } from '#/api/request';
import { ElMessage } from 'element-plus';
import AttachFile from '../../basic/attach/attachFile.vue'
import { useVbenModal } from '@vben/common-ui';
const formData = defineModel('formData');
const emit = defineEmits(['closeDiaLog','query'])
const dropList = reactive({});

const formRef = ref(null)
// 验证规则
const formRules = reactive({
  templateName: [
    { required: true, message: '指令类别不能为空', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  commandFl: [
    { required: true, message: '指令类型不能为空', trigger: 'blur' },
  ]
})

// 输入过滤：实时限制只能输入数字
const handleNumberInput = (value) => {
  formData.finishLimit = value.replace(/[^\d]/g, '');
};

onMounted(async () => {
  const dropStore = useDropStore();
  const dropType = ['NSOS_CMD_FL','NSOS_CMD_TEMPLATE']
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);
  formData.value.glTemplateName = eval(formData.value.glTemplateName)
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
    let fd = JSON.parse(JSON.stringify(formData.value))
    fd.glTemplateName = JSON.stringify(fd.glTemplateName)
    const response = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/disposeCommandType/add', fd);
  }catch {
    ElMessage.error('保存失败')
  }finally{
    emit('closeDiaLog');
    emit('query');
  }

}
</script>
<style scoped>
.head-d{
  width: 100%;
  height: 55px;
  border-bottom: 1px solid #ebebeb;
}
</style>
