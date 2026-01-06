<template>
  <div class="el-tag-input" :style="{ '--tag-height': tagHeight + 'px' }">
    <div 
      class="input-container" 
      :class="{ 
        'is-disabled': disabled, 
        'is-readonly': readonly, 
        'is-error': error,
        'is-focus': inputVisible || isFocused
      }" 
      @click="containerClick"
    >
      <div class="tags-wrapper">
        <el-tag
          v-for="(tag, index) in displayTags"
          :key="index"
          :type="tagType"
          :effect="tagEffect"
          :size="tagSize"
          :style="tagStyle"
          :closable="!readonly && !disabled"
          :disable-transitions="false"
          @close.stop="handleRemoveTag(index)"
        >
          {{ tag }}
        </el-tag>
        <input
          v-if="inputVisible"
          ref="inputRef"
          v-model="inputValue"
          class="tag-input-inner"
          :disabled="disabled"
          @keyup.enter="handleInputConfirm"
          @keyup.esc="cancelInput"
          @blur="handleBlur"
          @focus="handleFocus"
          @input="handleInputChange"
        />
        <span v-else-if="!disabled && !readonly" class="input-placeholder" @click.stop="showInput">{{ placeholder }}</span>
      </div>
      
      <el-icon 
        v-if="allowClear && tags.length > 0 && !disabled && !readonly"
        class="clear-icon"
        @click.stop="clearTags"
      >
        <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zM288 512a38.4 38.4 0 0 0 38.4 38.4h371.2a38.4 38.4 0 0 0 0-76.8H326.4A38.4 38.4 0 0 0 288 512z"></path>
        </svg>
      </el-icon>
      
      <el-tooltip 
        v-if="showMoreTags" 
        placement="top" 
        :effect="tagEffect"
      >
        <template #content>
          <div class="hidden-tags-tooltip">
            <div v-for="(tag, index) in hiddenTags" :key="index" class="hidden-tag">
              <span class="hidden-tag-text">{{ tag }}</span>
              <el-icon v-if="!readonly && !disabled" class="hidden-tag-close" @click.stop="removeHiddenTag(index)">
                <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"></path></svg>
              </el-icon>
            </div>
          </div>
        </template>
        <div class="more-tags">
          +{{ hiddenTags.length }}
        </div>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue'
import { ElTag, ElTooltip, ElIcon } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  maxTagCount: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0
  },
  tagType: {
    type: String,
    default: ''
  },
  tagEffect: {
    type: String,
    default: 'light'
  },
  tagSize: {
    type: String,
    default: 'default'
  },
  tagHeight: {
    type: Number,
    default: 32
  },
  tagWidth: {
    type: Number,
    default: 0
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  error: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: '添加标签'
  },
  allowClear: {
    type: Boolean,
    default: false
  },
  retainInputValue: {
    type: Boolean,
    default: false
  },
  inputDebounce: {
    type: Number,
    default: 300
  }
})

const emit = defineEmits([
  'update:modelValue',
  'change',
  'input-value-change',
  'press-enter',
  'remove',
  'clear',
  'focus',
  'blur'
])

// 数据
const tags = ref([])
const inputVisible = ref(false)
const inputValue = ref('')
const inputRef = ref(null)
const isFocused = ref(false)
let inputTimer = null

// 监听
watch(
  () => props.modelValue,
  (newVal) => {
    const val = normalizeToArray(newVal)
    tags.value = [...val]
  },
  { immediate: true, deep: true }
)

// 计算属性
const displayTags = computed(() => {
      // 如果是字符串，转换为数组
  tags.value = normalizeToArray(tags.value)
  return props.maxTagCount > 0 ? tags.value.slice(0, props.maxTagCount) : tags.value
})

const hiddenTags = computed(() => {
  return props.maxTagCount > 0 ? tags.value.slice(props.maxTagCount) : []
})

const showMoreTags = computed(() => {
  return props.maxTagCount > 0 && tags.value.length > props.maxTagCount
})

const tagStyle = computed(() => {
  const style = {}
  if (props.tagHeight) {
    style.height = `${props.tagHeight}px`
    style.lineHeight = `${props.tagHeight - 2}px`
  }
  if (props.tagWidth) {
    style.width = `${props.tagWidth}px`
    style.overflow = 'hidden'
    style.textOverflow = 'ellipsis'
    style.whiteSpace = 'nowrap'
  }
  return style
})

// 方法


// 标准化值为数组的辅助函数
function normalizeToArray(value) {
  if (value === null || value === undefined || value === '') {
    return []
  }
  
  if (Array.isArray(value)) {
    return [...value]
  }
  
  if (typeof value === 'string') {
    // 处理 && 分隔的字符串
    if (value.includes('&&')) {
      return value.split('&&')
                  .map(item => item.trim())
                  .filter(item => item !== '')
    }
    // 普通字符串
    return value ? [value] : []
  }
  
  if (typeof value === 'number' || typeof value === 'boolean') {
    return [String(value)]
  }
  
  return []
}


const showInput = () => {
  if (props.disabled) return
  inputVisible.value = true
  nextTick(() => {
    inputRef.value?.focus()
  })
}

const containerClick = () => {
  if (!inputVisible.value && !props.disabled && !props.readonly) {
    showInput()
  }
}

const cancelInput = () => {
   inputValue.value = ''
  inputVisible.value = false
 
}

const handleInputChange = (e) => {
  clearTimeout(inputTimer)
  inputTimer = setTimeout(() => {
    emit('input-value-change', inputValue.value, e)
  }, props.inputDebounce)
}

const handleFocus = (e) => {
  isFocused.value = true
  emit('focus', inputValue.value, e)
}

const handleBlur = (e) => {
  isFocused.value = false
  emit('blur', inputValue.value, e)
  handleInputConfirm()
}


 // 修改handleInputConfirm方法
const handleInputConfirm = () => {
  if (inputValue.value) {
    if (!tags.value.includes(inputValue.value)) {
      const newTags = [...tags.value, inputValue.value]
      tags.value = newTags
      emit('update:modelValue', newTags)
      emit('change', newTags)
      emit('press-enter', {
        value: inputValue.value,
        tags: newTags
      })
    }
    
    // 清空输入值但保留焦点
    inputValue.value = ''
    
    // 保持输入框可见和聚焦状态
    if (!props.retainInputValue) {
      nextTick(() => {
        inputRef.value?.focus()
      })
    }
  } else {
    // 如果输入为空，则关闭输入框
    inputVisible.value = false
  }
}
 

const handleRemoveTag = (index) => {
  if (props.disabled || props.readonly) return
  
  const removedTag = tags.value[index]
  const newTags = [...tags.value]
  newTags.splice(index, 1)
  
  tags.value = newTags
  emit('update:modelValue', newTags)
  emit('change', newTags)
  emit('remove', {
    value: removedTag,
    index,
    tags: newTags
  })
}

const removeHiddenTag = (index) => {
  if (props.disabled || props.readonly) return
  const actualIndex = index + props.maxTagCount
  const removedTag = tags.value[actualIndex]
  const newTags = [...tags.value]
  newTags.splice(actualIndex, 1)
  
  tags.value = newTags
  emit('update:modelValue', newTags)
  emit('change', newTags)
  emit('remove', {
    value: removedTag,
    index: actualIndex,
    tags: newTags
  })
}

const clearTags = () => {
  if (props.disabled || props.readonly) return
  
  const oldTags = [...tags.value]
  tags.value = []
  emit('update:modelValue', [])
  emit('change', [])
  emit('clear', {
    oldTags,
    tags: []
  })
}

// 暴露方法
defineExpose({
  addTag: (tag) => {
    if (!tags.value.includes(tag)) {
      const newTags = [...tags.value, tag]
      tags.value = newTags
      emit('update:modelValue', newTags)
      emit('change', newTags)
      return true
    }
    return false
  },
  clearTags: () => {
    const oldTags = [...tags.value]
    tags.value = []
    emit('update:modelValue', [])
    emit('change', [])
    emit('clear', {
      oldTags,
      tags: []
    })
    return oldTags
  },
  getTags: () => {
    return [...tags.value]
  },
  setTags: (newTags) => {
    tags.value = [...newTags]
    emit('update:modelValue', tags.value)
    emit('change', tags.value)
    return tags.value
  },
  removeTagByIndex: (index) => {
    if (index >= 0 && index < tags.value.length) {
      const removedTag = tags.value[index]
      const newTags = [...tags.value]
      newTags.splice(index, 1)
      
      tags.value = newTags
      emit('update:modelValue', newTags)
      emit('change', newTags)
      emit('remove', {
        value: removedTag,
        index,
        tags: newTags
      })
      return removedTag
    }
    return null
  },
  getInputValue: () => {
    return inputValue.value
  },
  setInputValue: (value) => {
    inputValue.value = value
    return inputValue.value
  },
  focus: () => {
    showInput()
    return true
  },
  blur: () => {
    if (inputRef.value) {
      inputRef.value.blur()
    }
    return true
  }
})
</script>

<style scoped>
.el-tag-input {
  width: 100%;
  position: relative;
}

.input-container {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  min-height: var(--tag-height);
  padding: 1px 8px;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  background-color: var(--el-fill-color-blank);
  transition: all 0.2s;
  cursor: text;
  box-sizing: border-box;
}

.input-container:hover {
  border-color: var(--el-border-color-hover);
}

.input-container:focus-within,
.input-container.is-focus {
  border-color: var(--el-color-primary);
  outline: 0;
  box-shadow: 0 0 0 2px rgba(var(--el-color-primary-rgb), 0.2);
}

.input-container.is-disabled {
  background-color: var(--el-disabled-bg-color);
  border-color: var(--el-border-color-light);
  color: var(--el-disabled-text-color);
  cursor: not-allowed;
}

.input-container.is-readonly {
  background-color: var(--el-fill-color-light);
  border-color: var(--el-border-color);
  color: var(--el-text-color-regular);
  cursor: default;
}

.input-container.is-error {
  border-color: var(--el-color-danger);
}

.input-container.is-error:focus-within,
.input-container.is-error.is-focus {
  box-shadow: 0 0 0 2px rgba(var(--el-color-danger-rgb), 0.2);
}

.tags-wrapper {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  min-height: calc(var(--tag-height) - 2px);
}

.tag-input-inner {
  flex: 1;
  min-width: 80px;
  height: calc(var(--tag-height) - 8px);
  margin: 2px 0;
  padding: 0;
  font-size: 14px;
  border: none;
  outline: none;
  background: transparent;
}

.input-placeholder {
  color: var(--el-text-color-placeholder);
  font-size: 14px;
  cursor: text;
}

.clear-icon {
  margin-left: 8px;
  color: var(--el-text-color-placeholder);
  cursor: pointer;
  font-size: 14px;
  transition: color 0.2s;
}

.clear-icon:hover {
  color: var(--el-color-danger);
}

.more-tags {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  padding: 0 6px;
  margin-left: auto;
  cursor: pointer;
}

.hidden-tags-tooltip {
  max-width: 200px;
  max-height: 200px;
  overflow-y: auto;
}

.hidden-tag {
  padding: 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.hidden-tag-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hidden-tag-close {
  margin-left: 6px;
  cursor: pointer;
  font-size: 14px;
  color: var(--el-text-color-secondary);
  transition: color 0.2s;
}

.hidden-tag-close:hover {
  color: var(--el-color-danger);
}

:deep(.el-tag) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 2px 0;
  color:rgb(56, 57, 58)
}
</style>
