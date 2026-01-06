<template>
  <div class="search-highlighter">
    <div class="search-controls">
      <input
        type="text"
        v-model="searchTerm"
        @input="performSearch"
        @keydown.esc="clearSearch"
        placeholder="输入搜索内容或按 Ctrl+F"
        ref="searchInput"
        class="search-input"
      >
      <div class="search-info" v-if="searchTerm && matchCount > 0">
        <span class="match-count">{{ currentMatch }} / {{ matchCount }} 个匹配项</span>
        <div class="search-navigation">
          <button @click="prevMatch" :disabled="matchCount <= 1" class="nav-button">上一个</button>
          <button @click="nextMatch" :disabled="matchCount <= 1" class="nav-button">下一个</button>
        </div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  keyword: {
    type: String,
    default: ''
  },
  rootSelector: {
    type: String,
    default: null
  },
  caseSensitive: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:keyword'])

const searchTerm = ref(props.keyword)
const matchCount = ref(0)
const currentMatchIndex = ref(-1)
const searchInput = ref(null)
const matches = ref([])

// 获取搜索根节点
const getSearchRoot = () => {
  return props.rootSelector 
    ? document.querySelector(props.rootSelector)
    : document.body // 默认搜索整个文档
}

// 转义正则表达式特殊字符
const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// 执行搜索
const performSearch = () => {
  emit('update:keyword', searchTerm.value)
  
  const searchRoot = getSearchRoot()
  if (!searchRoot) return
  
  // 清除之前的高亮
  clearHighlights(searchRoot)
  
  if (!searchTerm.value) {
    matchCount.value = 0
    currentMatchIndex.value = -1
    return
  }
  
  // 创建正则表达式
  const flags = props.caseSensitive ? 'g' : 'gi'
  const regex = new RegExp(`(${escapeRegExp(searchTerm.value)})`, flags)
  
  // 搜索整个文档
  searchAndHighlight(searchRoot, regex)
  
  // 如果有匹配项，高亮第一个
  if (matches.value.length > 0) {
    currentMatchIndex.value = 0
    highlightCurrentMatch()
  } else {
    currentMatchIndex.value = -1
  }
}

// 递归搜索并高亮节点
const searchAndHighlight = (node, regex) => {
  // 跳过script、style等元素
  if (node.nodeType === Node.ELEMENT_NODE && 
      ['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA'].includes(node.tagName)) {
    return
  }
  
  if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
    const parent = node.parentNode
    if (parent && parent.nodeName !== 'MARK') {
      const text = node.textContent
      const newText = text.replace(regex, '<mark class="highlight">$1</mark>')
      
      if (newText !== text) {
        const newElement = document.createElement('span')
        newElement.innerHTML = newText
        parent.replaceChild(newElement, node)
        
        // 收集所有高亮元素
        const newMatches = newElement.querySelectorAll('mark.highlight')
        matches.value = [...matches.value, ...Array.from(newMatches)]
      }
    }
  } 
  else if (node.nodeType === Node.ELEMENT_NODE) {
    // 递归处理子节点
    const children = Array.from(node.childNodes)
    children.forEach(child => searchAndHighlight(child, regex))
  }
}

// 高亮当前匹配项
const highlightCurrentMatch = () => {
  if (matches.value.length === 0) return
  
  matches.value.forEach((match, index) => {
    match.classList.remove('current-highlight')
    if (index === currentMatchIndex.value) {
      match.classList.add('current-highlight')
      // 滚动到当前匹配项
      match.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  })
  
  matchCount.value = matches.value.length
}

// 清除高亮
const clearHighlights = (root) => {
  const highlights = root.querySelectorAll('mark.highlight')
  highlights.forEach(highlight => {
    const parent = highlight.parentNode
    if (parent) {
      parent.textContent = parent.textContent
    }
  })
  matches.value = []
}

// 下一个匹配项
const nextMatch = () => {
  if (matches.value.length === 0) return
  currentMatchIndex.value = (currentMatchIndex.value + 1) % matches.value.length
  highlightCurrentMatch()
}

// 上一个匹配项
const prevMatch = () => {
  if (matches.value.length === 0) return
  currentMatchIndex.value = (currentMatchIndex.value - 1 + matches.value.length) % matches.value.length
  highlightCurrentMatch()
}

// 清除搜索
const clearSearch = () => {
  searchTerm.value = ''
  performSearch()
  searchInput.value.blur()
}

// 键盘事件处理
const handleKeyDown = (event) => {
  if (event.ctrlKey && event.key === 'f') {
    event.preventDefault()
    searchInput.value.focus()
  }
  
  if (event.key === 'Enter' && document.activeElement === searchInput.value) {
    if (matches.value.length > 0) {
      nextMatch()
    }
  }
}

// 监听keyword变化
watch(() => props.keyword, (newVal) => {
  searchTerm.value = newVal
  performSearch()
})

onMounted(() => {
  // document.addEventListener('keydown', handleKeyDown)
  if (props.keyword) {
    performSearch()
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
  clearHighlights(getSearchRoot())
})
</script>

<style scoped>
.search-highlighter {
  width: 100%;
}

.search-controls {
  position: sticky;
  top: 0;
  background: white;
  padding: 15px;
  border-bottom: 1px solid #eaeef5;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.search-input {
  width: 100%;
  max-width: 500px;
  padding: 10px 15px;
  border: 1px solid #d1d9e6;
  border-radius: 6px;
  font-size: 16px;
  transition: border 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #4a6ee0;
  box-shadow: 0 0 0 2px rgba(74, 110, 224, 0.1);
}

.search-info {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 10px;
  font-size: 14px;
  color: #666;
  justify-content: center;
}

.match-count {
  background: #f0f2f5;
  padding: 2px 8px;
  border-radius: 10px;
}

.search-navigation {
  display: flex;
  gap: 5px;
}

.nav-button {
  padding: 5px 10px;
  background: #f0f2f5;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.nav-button:hover {
  background: #e4e6eb;
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

<style>
.highlight {
  background-color: #ffeb3b;
  padding: 0 2px;
  border-radius: 2px;
}

.current-highlight {
  background-color: #ff9800;
  box-shadow: 0 0 0 2px rgba(255, 152, 0, 0.3);
}
</style>
