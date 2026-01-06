<template>
  <div class="main-bd">
    <el-button type="primary" class="ml-0" :size="size?size: null" :icon="Upload" @click="attachClick">附件上传</el-button>
    
    <Modal class="w-[700px]" title="附件编辑" :footer="false" :closeOnClickModal="false" :draggable="true" headerClass="head-md" :zIndex="zIndex">
      <AttachFile :parentId="parentId" :moduleId="moduleId" :inAdvance="inAdvance" @afterUpload="emit('afterUpload')"></AttachFile>
    </Modal>
  </div>
</template>
<script setup>
import { onMounted, reactive } from 'vue';
import AttachFile from './attachFile.vue'
import { Upload } from '@element-plus/icons-vue';
import { useVbenModal } from '@vben/common-ui';
const parentId = defineModel('parentId')
const moduleId = defineModel('moduleId')
const inAdvance = defineModel('inAdvance') // 预上传标志
const size = defineModel('size')
const zIndex = defineModel('zIndex')
const emit = defineEmits(['afterUpload'])
const attachClick = () => {
  modalApi.open()
}
onMounted(()=>{
  console.log(parentId);
})
const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
});
</script>
<style scoped>
:deep(.head-md h2){
  font-size: 14px;
}
</style>
