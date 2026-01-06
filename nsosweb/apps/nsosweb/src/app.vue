<script lang="ts" setup>
import { useElementPlusDesignTokens } from '@vben/hooks';

import { ElConfigProvider } from 'element-plus';

import { elementLocale } from '#/locales';
import Loading from '#/views/basic/common/Loading.vue';

import { onMounted, ref } from 'vue';
import { initSzrz } from './utils/szrz';
import { useAccessStore, useUserStore } from '@vben/stores';
import iconAnswerLittle from '#/assets/images/intellectualDialogue/answerLittle.png';
import intelligentAssistant from '#/views/runModeMgt/intellectualDialogue/questionAnswering/intelligentAssistant.vue';
import { getIntelDialUrlApi } from '#/api';

const userStore = useUserStore();

defineOptions({ name: 'App' });

useElementPlusDesignTokens();

const accessStore = useAccessStore();
onMounted(() => {
  initSzrz();
});

const dialogueDialog = ref(false);
// function toDialogue() {
//   dialogueDialog.value = true
// }

async function toDialogue() {
  try {
    const baseUrl = await getIntelDialUrlApi();
    const params = new URLSearchParams({
      uesrName: userStore?.userInfo?.username,
    });
    window.open(`${baseUrl}?${params.toString()}`, '_blank'); // 新标签页打开
  } catch {}
}
function resetDialogueDialog() {
  dialogueDialog.value = false;
}
</script>

<template>
  <ElConfigProvider :locale="elementLocale">
    <div
      style="
        position: fixed;
        right: 0;
        bottom: 200px;
        z-index: 1100;
        width: 40px;
        height: 40px;
      "
      v-if="accessStore.accessToken"
    >
      <img
        :src="iconAnswerLittle"
        title="智能问答"
        style="cursor: pointer"
        @click="toDialogue"
      />
    </div>
    <intelligentAssistant
      v-if="dialogueDialog"
      :open-dialog="dialogueDialog"
      @close-dialog="resetDialogueDialog"
    />
    <RouterView />
    <Loading></Loading>
  </ElConfigProvider>
</template>
