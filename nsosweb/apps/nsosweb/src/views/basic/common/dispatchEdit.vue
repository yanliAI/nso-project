<template>
  <div>
    <el-select v-model="handleCode" style="width: 200px" clearable>
      <el-option v-for="item in dropList.NSOS_DISPATCH_PERSON" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
    <div style="display: flex; justify-content: center">
      <el-button type="primary" @click="confirm">确定</el-button>
      <el-button type="info" @click="cancel">返回</el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, onMounted } from 'vue';
import { useDropStore } from '#/store';

const handleCode: any = defineModel('handleCode')
const dropList: any = reactive({})

onMounted(async () => {
  const dropStore = useDropStore();
  await dropStore.initDrops(['NSOS_DISPATCH_PERSON']);
  dropStore.get(dropList, ['NSOS_DISPATCH_PERSON']);
});

const emit = defineEmits(['dispatchConfirm', 'dispatchCancel'])

const confirm = () => {
  emit('dispatchConfirm', handleCode.value, dropList['NSOS_DISPATCH_PERSON'].find(i => i.value == handleCode.value)?.label)
}

const cancel = () => {
  emit('dispatchCancel')
}
</script>
