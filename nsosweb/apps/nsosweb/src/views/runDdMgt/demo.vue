<template>
  <div class="main-bd">
    <el-select placeholder="输入" clearable>
      <el-option v-for="item in dropList.NSOS_YES_OR_NO" :key="item.value" :label="item.label" :value="item.value"/>
    </el-select>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, reactive } from 'vue';
import { useDropStore } from '#/store';

const dropList: any = reactive({});

onMounted(async () => {
  const dropStore = useDropStore();
  await dropStore.initDrops(['NSOS_YES_OR_NO', 'NSOS_USER_STATE']);
  dropStore.get(dropList, ['NSOS_YES_OR_NO', 'NSOS_USER_STATE']);
});
</script>
<style scoped></style>
