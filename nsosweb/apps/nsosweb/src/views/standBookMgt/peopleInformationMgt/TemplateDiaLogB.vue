<template>
  <div style="width: 100%; height: 100%;">
    <div style="height: calc(100% - 1px)">
      <el-form label-width="auto" ref="formRef" :model="formData" :rules="formRules" :inline="true"
        label-position="right" class="demo-form-inline">
        <el-row >
          <el-col :span="24">
              <el-form-item label="专家组名称:" prop="groupName" style="margin-bottom: 18px">
                <el-input v-model="formData.groupName" clearable />
              </el-form-item>
            </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="创建人:" prop="creatorId" style="margin-bottom: 18px">
              <el-input v-model="formData.creatorId"  disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间:" prop="createTime" style="margin-bottom: 18px">
              <el-input v-model="formData.createTime"  disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="最后修改人:" prop="updatorId" style="margin-bottom: 18px">
              <el-input v-model="formData.updatorId"  disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最后修改时间:" prop="updateTime" style="margin-bottom: 18px">
              <el-input v-model="formData.updateTime"  disabled />
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
import { tDateFormat, tDateTimeFormat, formatDrop, lookFlow } from '#/utils/commonUtil.ts';
import { useVbenModal } from '@vben/common-ui';
const formData = defineModel('formData');
const emit = defineEmits(['closeDiaLog','query','treeChange'])
const dropList = reactive({});

const formRef = ref(null)
const attachFileRef = ref()
// 验证规则
const formRules = reactive({

})

onMounted(async () => {
  const dropStore = useDropStore();
  const dropType = ['NSOS_PIM_NAME','NSOS_CMD_FL']
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
    const response = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/expertGroup/add', formData.value);
  }catch {
    ElMessage.error('保存失败')
  }finally{
    emit('closeDiaLog');
    emit('query');
    emit('treeChange');
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
