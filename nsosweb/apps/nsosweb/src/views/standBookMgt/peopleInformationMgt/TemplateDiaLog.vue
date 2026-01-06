<template>
  <div style="width: 100%; height: 100%;">
    <div style="height: calc(100% - 1px)">
      <el-form label-width="auto" ref="formRef" :model="formData" :rules="formRules" :inline="true"
        label-position="right" class="demo-form-inline">
        <el-row >
          <el-col :span="12">
              <el-form-item label="专家组:" prop="expertId" style="margin-bottom: 18px">
                <el-select v-model="formData.expertId" clearable>
                <el-option v-for="item in dropList.NSOS_PIM_NAME" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
              </el-form-item>
            </el-col>
          <el-col :span="12">
            <el-form-item label="姓名:" prop="expertName" style="margin-bottom: 18px">
              <el-select v-model="formData.expertName" clearable>
                <el-option v-for="item in dropList.NSOS_USER_NAME" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="关联系统:" prop="systemName">
              <el-select v-model="formData.systemName" clearable>
                <el-option v-for="item in dropList.NSOS_SYSTEM_INFO" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机:" prop="telPhone" style="margin-bottom: 18px">
              <el-input v-model="formData.telPhone"  clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="单位路由:" prop="orgName" style="margin-bottom: 18px">
              <el-input v-model="formData.orgName"  clearable />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="width: 100%; height: 20px">
      </div>
      <div style=" justify-content: center;height: 35px" class="flex">
        <el-button type="primary" @click="handleSubmit">保存</el-button>
        <el-button @click="attachClose">取消</el-button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, reactive,ref } from 'vue';
import { useDropStore } from '#/store';
import { requestClient } from '#/api/request';
import { ElMessage } from 'element-plus';
import AttachFile from '../../basic/attach/attachFile.vue'
import AttachList from '../../basic/attach/attachList.vue'
import { Search, Delete, Plus, Download, Upload } from '@element-plus/icons-vue';
import { useVbenModal } from '@vben/common-ui';
const formData = defineModel('formData');
const emit = defineEmits(['closeDiaLog','query'])
const dropList = reactive({});

const formRef = ref(null)
const attachFileRef = ref()
// 验证规则
const formRules = reactive({

})

onMounted(async () => {
  const dropStore = useDropStore();
  const dropType = ['NSOS_PIM_NAME','NSOS_CMD_FL','NSOS_USER_NAME','NSOS_SYSTEM_INFO']
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);
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
  console.log(formData.value);
  try{
    const response = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/expertInfo/add', formData.value);
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
