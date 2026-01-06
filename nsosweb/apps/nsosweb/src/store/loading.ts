import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLoadingStore = defineStore('nsos-loading', () => {
  
  const loading = ref(false)

  async function open() {
    loading.value = true
  }

  async function close() {
    loading.value = false
  }

  function $reset() {

  }
  return {loading, open, close, $reset};
});
