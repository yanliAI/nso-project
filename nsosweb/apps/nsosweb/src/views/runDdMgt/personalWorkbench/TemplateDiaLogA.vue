<template>
  <div style="width: 100%; height: 100%;">
    <div style="height: calc(100% - 1px)">
      <el-form label-width="auto" ref="formRef" :model="formData" :rules="formRules" :inline="true" label-position="right" class="demo-form-inline">
        <el-row>
          <el-col :span="24">
            <el-form-item label="反馈内容:" prop="feedbackContent">
              <el-input v-model="formData.feedbackContent" type="textarea" :rows="2" clearable :disabled=flag.flag />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="反馈人:" prop="feedbackMan">
              <el-select v-model="formData.feedbackMan" disabled>
                <el-option v-for="item in dropList.NSOS_USER_NAME" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
              <!-- <el-input v-model="formData.feedbackMan" :disabled="true" /> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="反馈时间:" prop="feedbackTime">
              <el-date-picker v-model="formData.feedbackTime"  type="datetime" :disabled="true" :formatter="tDateTimeFormat"/>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <div style="width: 100%; height: 20px">
      </div>
      <div style=" justify-content: center;height: 35px" class="flex">

        <el-button type="primary" @click="handleSubmit" :disabled=flag.flag>保存</el-button>
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
import { tDateTimeFormat } from '#/utils/commonUtil.ts'
import { useVbenModal } from '@vben/common-ui';
import { useAccessStore, useUserStore } from '@vben/stores';
const formData = defineModel('formData');
const formData2 = defineModel('formData2');
const flag = defineModel('flag');
const emit = defineEmits(['closeDiaLog','query'])
const dropList = reactive({});
const userStore = useUserStore();


const formRef = ref(null)
const attachFileRef = ref()
// 验证规则
const formRules = reactive({
  feedbackContent: [
    { required: true, message: '反馈内容不能为空', trigger: 'blur' },
  ]
})


onMounted(async () => {
  const dropStore = useDropStore();
  const dropType = ['NSOS_USER_NAME']
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);
  formData.value.feedbackMan = userStore.userInfo?.logincode;
  formData.value.feedbackTime = new Date();
  formData.value.feedbackContent = formData2.value.feedbackContent

  console.log(flag.value.flag)
});

const attachClick = () => {
  modalApi.open()
}

const attachClose = async() => {
  try{
    const parm = {
      "id": formData.value.id,
    }
    console.log(parm)
    const response = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/notifyRecord/add2', parm);
  }catch {
    ElMessage.error('保存失败')
  }finally{
    emit('closeDiaLog');
    emit('query');
  }
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
    const parm = {
      "id": formData.value.id,
      "feedbackMan": formData.value.feedbackMan,
      "feedbackContent": formData.value.feedbackContent,
    }
    console.log(parm)
    const response = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/notifyRecord/add2', parm);
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
