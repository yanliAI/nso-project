<template>
  <div>
    <el-input v-model="labelDesc" :rows="5" type="textarea" maxlength="500" show-word-limit></el-input>
    <div v-if="showBtnFlag" style="display: flex; justify-content: center" class="mt-3">
      <el-button type="primary" @click="confirm">确定</el-button>
      <el-button type="info" @click="cancel">返回</el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue"

const labelDesc: any = defineModel('labelDesc')
const assessData: any = defineModel('assessData')
const showBtn: any = defineModel('showBtn')
const showBtnFlag: any = ref(true)
const emit = defineEmits(['labelConfirm', 'labelCancel'])

const confirm = () => {
  emit('labelConfirm', labelDesc,assessData)
}
onMounted( () => {
  if (showBtn.value) {
    showBtnFlag.value = (showBtn.value == '1')
  }
})
const cancel = () => {
  emit('labelCancel')
}
</script>
