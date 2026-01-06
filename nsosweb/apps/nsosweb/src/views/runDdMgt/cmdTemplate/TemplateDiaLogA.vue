<template>
  <div style="width: 100%; height: 100%;">
    <div style="height: calc(100% - 1px)">
      <el-form label-width="auto" ref="formRef" :model="formData" :rules="formRules" :inline="true"
        label-position="right" class="demo-form-inline">
        <el-row>
          <el-col :span="12">
              <el-form-item label="类型:" prop="commandFl2">
                <el-select v-model="formData.commandFl2" disabled>
                <el-option v-for="item in dropList.NSOS_CMD_FL" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
              </el-form-item>
            </el-col>
          <el-col :span="12">
            <el-form-item label="模板名称:" prop="templateName">
              <el-input v-model="formData.templateName" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="主要内容:" prop="cmdContent">
              <el-input v-model="formData.cmdContent" type="textarea" :rows="5" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="接受单位:" prop="slDept">
              <el-select v-model="formData.slDept" multiple  collapse-tags collapse-tags-tooltip
                :max-collapse-tags="3" remote reserve-keyword disabled filterable style="width: 100%">
                <el-option v-for="item in dropList.NSOS_ORG_NAME_SLDW" :key="item.value" :label="item.label"
                  :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="完成时限(小时):" prop="finishLimit">
              <el-input placeholder="请输入数字" @input="handleNumberInput" v-model="formData.finishLimit" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="24">
            <el-form-item label="附件:">
              <el-button type="primary" class="ml-0" :icon="Upload" @click="attachClick" disabled>附件上传</el-button>
            </el-form-item>
          </el-col>
        </el-row> -->
      </el-form>
      <!-- <div style="width: 100%; height: 130px">
        <AttachList ref="attachFileRef" :parentId="formData.id" :showPreview="false"></AttachList>
      </div> -->
      <div style="width: 100%; height: 20px">
      </div>
    </div>

    <!-- <Modal class="w-[700px] " title="附件编辑" :footer="false" :closeOnClickModal="false" :draggable="true">
      <AttachFile :parentId="formData.id" @afterUpload="attachFileRef.queryData()" close="addClose"></AttachFile>
    </Modal> -->
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
  commandFl2: [
    { required: true, message: '类型不能为空', trigger: 'blur' },
  ],
  templateName: [
    { required: true, message: '模板名称不能为空', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  cmdContent: [
    { required: true, message: '指令内容不能为空', trigger: 'blur' },
    { min: 1, message: '至少需要1个字符', trigger: 'blur' }
  ],
  finishLimit: [
    { pattern: /^\d+$/, message: '只能输入数字', trigger: 'blur' }
  ]
})

// 输入过滤：实时限制只能输入数字
const handleNumberInput = (value) => {
  formData.finishLimit = value.replace(/[^\d]/g, '');
};

onMounted(async () => {
  const dropStore = useDropStore();
  const dropType = ['NSOS_ORG_NAME_SLDW','NSOS_CMD_FL']
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);
  console.log(111)
  console.log(formData.value.slDept)
  formData.value.slDept = eval(formData.value.slDept)
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
    let fd = JSON.parse(JSON.stringify(formData.value))
    console.log(fd)
    fd.slDept = JSON.stringify(fd.slDept)
    console.log(fd)
    const response = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/commandTemplate/add', fd);
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
