<template>
  <div class="fault-keyword-comp">
    <el-select v-model="data.keyword" multiple placeholder="选择关键字" collapse-tags collapse-tags-tooltip :max-collapse-tags="props.maxCollapseTags" remote reserve-keyword :clearable="props.clearable" :disabled="props.disabled" filterable>
      <el-option v-for="item in data.items" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
    <el-button type="primary" plain style="margin-left: 30px" @click="openDiaLog" :disabled="props.disabled" >关键字维护</el-button>

    <Modal class="h-[560px] w-[800px]" title="故障关键字" :footer="false" :closeOnClickModal="false" :draggable="true">
      <keyword-list @close="closeDiaLog" @refresh="getOptions" />
    </Modal>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { getFaultKeywordItems } from './faultKeywordSelectMethod.ts'
import { useVbenModal } from '@vben/common-ui'
import keywordList from './keywordList.vue'
const emit = defineEmits(['update:value'])

const props = defineProps({
  value: {
    type: Array,
    default: []
  },
  maxCollapseTags: {
    type: Number,
    default: 6
  },
  clearable: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const data = reactive({
  keyword: [],
  items: []
})

onMounted(async () => {
  await getOptions()
  if (props.value) {
    data.keyword = JSON.parse(JSON.stringify(props.value))
  }
})

watch(
  () => data.keyword,
  (nv, ov) => {
    emit('update:value', nv)
  },
  { immediate: false }
)

const getOptions = async () => {
  const options = await getFaultKeywordItems('')
  data.items = options
}

const openDiaLog = () => {
  modalApi.open()
}

const closeDiaLog = () => {
  modalApi.close()
}

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close()
  }
})
</script>
<style scoped>
.fault-keyword-comp {
  display: flex;
  width: 100%;
}
</style>
