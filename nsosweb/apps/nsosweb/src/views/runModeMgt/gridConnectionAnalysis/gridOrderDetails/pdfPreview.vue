<template>
  <div>
    <!-- PDF查看器 -->
    <div class="container" v-loading="loading"  element-loading-text="正在加载..." >
      <div class="pdf_down">
        <div class="pdf_set_left" @click="scaleD()">➕</div>
        <div class="pdf_set_middle" @click="scaleX()">➖</div>
      </div>
      <div ref="container" class="pdf-wrapper">
        <div id="viewer" class="pdfViewer" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick,reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import { useAccessStore } from '@vben/stores'
// 正确导入 PDF.js
import { getDocument, GlobalWorkerOptions, version } from 'pdfjs-dist/legacy/build/pdf'
import { EventBus, GenericL10n, PDFFindController, PDFLinkService, PDFViewer } from 'pdfjs-dist/legacy/web/pdf_viewer'
// import './pdf.css'

const accessStore = useAccessStore()
const loading = ref(false)
const emit = defineEmits([
  'change', 
])

// 接收参数
const keywordList = defineModel('keywordList')  // 关键词数组

// const keywordList = ref(['合同', '租赁'])
// 当前选中的关键词
const currentKeyword = ref<string>('')

// 设置 worker
import worker from 'pdfjs-dist/legacy/build/pdf.worker?url'
GlobalWorkerOptions.workerSrc = worker

// 容器
const container = ref<HTMLDivElement | null>(null)

// 状态
const currentMatch = ref(0)
const totalMatches = ref(0)

// 关键词统计
interface KeywordStats {
  [key: string]: number
}
const keywordCounts = reactive<KeywordStats>({})

// 计算总关键词匹配数
const totalKeywordCount = computed(() => {
  return Object.values(keywordCounts).reduce((sum, count) => sum + count, 0)
})


// 是否执行过全部查询
const hasAutoSearched = ref(false)

// 上下文
const context = {
  viewer: null as PDFViewer | null,
  findController: null as PDFFindController | null,
  eventBus: null as EventBus | null,
  pdfLinkService: null as PDFLinkService | null,
  currentSearchKeyword: '' as string,
  isDocumentReady: false as boolean,
  matchesCache: [] as Array<{ pageIdx: number; matchIdx: number }>,
  isScrolling: false as boolean,
  lastMatchIndex: -1 as number
}

function formatToken(token) {
  return token ? `Bearer ${token}` : null
}

// onMounted(() => {
//   loadFile()
  
//   // 默认选择第一个关键词
//   if (keywordList.value.length > 0) {
//     currentKeyword.value = keywordList.value[0]
//   }
// })

// 选择关键词
function selectKeyword(keyword: string) {
   if (!keyword || !keyword.trim()) {
    ElMessage.warning('关键词不能为空');
    return;
  }
  currentKeyword.value = keyword.trim()
  emit('change', {CurrentKeyword: currentKeyword.value,KeywordCounts:keywordCounts,CurrentMatch:currentMatch.value});
}

// 加载PDF文件
async function loadFile(fileData) {
  loading.value =true
  if (!container.value) {
    console.error('Container not found')
    return
  }
    // 重置所有状态
  resetAllStates()
  
  // 清理之前的 PDF 资源
  cleanupPreviousPDF()

  try {
    const response = await axios({
      method: 'post',
      responseType: 'blob',
      url: import.meta.env.VITE_NSOSFS + `/ydCommon/previewZipEntry`,
      data: { fileId: fileData.fileId, idate: fileData.iDate, oid: fileData.oid,entryPath:fileData.entryPath, bkUsername: fileData.bkUsername },
      headers: {
        Authorization: formatToken(accessStore.accessToken)
      }
    })
    loading.value =false

    const pdfBlob = new Blob([response.data], { type: 'application/pdf' })
    const blobUrl = URL.createObjectURL(pdfBlob)

    const eventBus = new EventBus()
    const pdfLinkService = new PDFLinkService({ eventBus })
    const pdfFindController = new PDFFindController({
      eventBus,
      linkService: pdfLinkService
    })

    const pdfViewer = new PDFViewer({
      container: container.value,
      eventBus,
      linkService: pdfLinkService,
      findController: pdfFindController,
      l10n: new GenericL10n('zh-CN')
    })

    pdfLinkService.setViewer(pdfViewer)
    context.viewer = pdfViewer
    context.findController = pdfFindController
    context.eventBus = eventBus
    context.pdfLinkService = pdfLinkService

    // 监听查找结果更新
    eventBus.on('updatetextlayermatches', (data: any) => {
      if (data.matchesCount?.total > 0) {
        totalMatches.value = data.matchesCount.total
        setTimeout(() => collectMatches(), 100)
      }
    })

    // 监听页面初始化
    eventBus.on('pagesinit', () => {
      pdfViewer.currentScaleValue = 'page-width'
      context.isDocumentReady = true
    })

    eventBus.on('pagesloaded', async () => {
      // 等待DOM渲染完成 + 避免重复执行
      await nextTick()
      if (context.isDocumentReady && !hasAutoSearched.value) {
        // 延迟800ms：确保文本层、高亮层完全渲染（可根据实际调整）
        setTimeout(() => {
          console.log('PDF所有页面加载完成，自动执行全关键词搜索')
          searchAllKeywords()
          hasAutoSearched.value = true 
        }, 800)
      }
    })


    // 监听页面渲染完成
    eventBus.on('pagerendered', (data: any) => {
      if (context.currentSearchKeyword && context.isDocumentReady) {
        setTimeout(() => {
          executeSearch(context.currentSearchKeyword, false)
          searchAllKeywords()
          
        }, 100)
      }
    })

    // 监听滚动事件
    if (container.value) {
      container.value.addEventListener('scroll', () => {
        if (context.isScrolling) {
          context.isScrolling = false
        }
      })
    }

    // 加载 PDF 文档
    const loadingTask = getDocument({
      url: blobUrl,
      cMapUrl: `../../../../../node_modules/pdfjs-dist/cmaps`,
      cMapPacked: true,
      disableStream: true,
      disableRange: true
    })

    const pdfDocument = await loadingTask.promise
    pdfViewer.setDocument(pdfDocument)
    pdfLinkService.setDocument(pdfDocument, null)
  } catch (error) {
    loading.value =false
    console.error('加载PDF失败:', error)
    ElMessage.error('PDF加载失败，请刷新重试')
  }
}

async function loadFile1(fileData) {

  if (!container.value) {
    console.error('Container not found')
    return
  }
  loading.value =true
    // 重置所有状态
  resetAllStates()
  
  // 清理之前的 PDF 资源
  cleanupPreviousPDF()

  try {
    const response = await axios({
      method: 'post',
      responseType: 'blob',
      url: import.meta.env.VITE_NSOSFS + `/ydCommon/previewFile`,
      data: { fileId: fileData.fileId, idate: fileData.iDate, oid: fileData.oid , bkUsername: fileData.bkUsername },
      headers: {
        Authorization: formatToken(accessStore.accessToken)
      }
    })
   loading.value =false
    const pdfBlob = new Blob([response.data], { type: 'application/pdf' })
    const blobUrl = URL.createObjectURL(pdfBlob)

    const eventBus = new EventBus()
    const pdfLinkService = new PDFLinkService({ eventBus })
    const pdfFindController = new PDFFindController({
      eventBus,
      linkService: pdfLinkService
    })

    const pdfViewer = new PDFViewer({
      container: container.value,
      eventBus,
      linkService: pdfLinkService,
      findController: pdfFindController,
      l10n: new GenericL10n('zh-CN')
    })

    pdfLinkService.setViewer(pdfViewer)
    context.viewer = pdfViewer
    context.findController = pdfFindController
    context.eventBus = eventBus
    context.pdfLinkService = pdfLinkService

    // 监听查找结果更新
    eventBus.on('updatetextlayermatches', (data: any) => {
      if (data.matchesCount?.total > 0) {
        totalMatches.value = data.matchesCount.total
        setTimeout(() => collectMatches(), 100)
      }
    })

    // 监听页面初始化
    eventBus.on('pagesinit', () => {
      pdfViewer.currentScaleValue = 'page-width'
      context.isDocumentReady = true
    })

    eventBus.on('pagesloaded', async () => {
      // 等待DOM渲染完成 + 避免重复执行
      await nextTick()
      if (context.isDocumentReady && !hasAutoSearched.value) {
        // 延迟800ms：确保文本层、高亮层完全渲染（可根据实际调整）
        setTimeout(() => {
          console.log('PDF所有页面加载完成，自动执行全关键词搜索')
          searchAllKeywords()
          hasAutoSearched.value = true 
        }, 800)
      }
    })


    // 监听页面渲染完成
    eventBus.on('pagerendered', (data: any) => {
      if (context.currentSearchKeyword && context.isDocumentReady) {
        setTimeout(() => {
          executeSearch(context.currentSearchKeyword, false)
          searchAllKeywords()
          
        }, 100)
      }
    })

    // 监听滚动事件
    if (container.value) {
      container.value.addEventListener('scroll', () => {
        if (context.isScrolling) {
          context.isScrolling = false
        }
      })
    }

    // 加载 PDF 文档
    const loadingTask = getDocument({
      url: blobUrl,
      cMapUrl: `../../../../../node_modules/pdfjs-dist/cmaps`,
      cMapPacked: true,
      disableStream: true,
      disableRange: true
    })

    const pdfDocument = await loadingTask.promise
    pdfViewer.setDocument(pdfDocument)
    pdfLinkService.setDocument(pdfDocument, null)
  } catch (error) {
    loading.value =false
    console.error('加载PDF失败:', error)
    ElMessage.error('PDF加载失败，请刷新重试')
  }
}

// 收集所有匹配项
function collectMatches() {
  if (!context.viewer) return

  context.matchesCache = []
  const pagesCount = context.viewer.pagesCount

  for (let pageIdx = 0; pageIdx < pagesCount; pageIdx++) {
    const pageView = context.viewer.getPageView(pageIdx)
    if (!pageView || !pageView.textLayer) continue

    const highlightElements = pageView.textLayer.div?.querySelectorAll('.highlight')
    if (highlightElements) {
      highlightElements.forEach((el, matchIdx) => {
        context.matchesCache.push({ pageIdx, matchIdx })
      })
    }
  }

  totalMatches.value = context.matchesCache.length

  // 统计当前关键词的匹配数
  if (context.currentSearchKeyword) {
    keywordCounts[context.currentSearchKeyword] = context.matchesCache.length
  }
  emit('change', {CurrentKeyword: currentKeyword.value,KeywordCounts:keywordCounts,CurrentMatch:currentMatch.value});
}

// 智能滚动到匹配项
function scrollToMatch(pageIdx: number, matchIdx: number) {
  if (!context.viewer || !container.value || context.isScrolling) return

  const pageView = context.viewer.getPageView(pageIdx)
  if (!pageView || !pageView.renderingState) return

  context.isScrolling = true
  const pageElement = pageView.div
  if (!pageElement) {
    context.isScrolling = false
    return
  }

  setTimeout(() => {
    const textLayer = pageView.textLayer?.div
    if (textLayer) {
      const highlightElements = textLayer.querySelectorAll('.highlight, .findHighlight')

      if (highlightElements.length > matchIdx) {
        const targetElement = highlightElements[matchIdx] as HTMLElement
        if (targetElement) {
          // 移除其他高亮
          document.querySelectorAll('.highlight.active, .findHighlight.active').forEach((el) => {
            el.classList.remove('active')
          })

          // 高亮当前匹配项
          targetElement.classList.add('active')

          // 检查元素是否在视口内
          const elementRect = targetElement.getBoundingClientRect()
          const containerRect = container.value!.getBoundingClientRect()

          const isInViewport = elementRect.top >= containerRect.top && elementRect.bottom <= containerRect.bottom && elementRect.left >= containerRect.left && elementRect.right <= containerRect.right

          // 如果不在视口内，再滚动
          if (!isInViewport) {
            const pageTop = pageElement.offsetTop
            const elementTop = targetElement.offsetTop
            const scrollTop = pageTop + elementTop - containerRect.height / 2 + elementRect.height / 2

            container.value!.scrollTo({
              top: scrollTop,
              behavior: 'smooth'
            })
          }
        }
      }
    }

    setTimeout(() => {
      context.isScrolling = false
    }, 300)
  }, 50)
}

// 查找并跳转到匹配项
function navigateToMatch(direction: 'next' | 'prev') {
  if (!context.eventBus || !context.currentSearchKeyword.trim()) {
    ElMessage.warning('请先执行搜索')
    return
  }

  if (totalMatches.value === 0) {
    ElMessage.info('无匹配项')
    return
  }

  // 计算新的匹配项索引
  let newIndex: number
  if (direction === 'next') {
    newIndex = (currentMatch.value % totalMatches.value) + 1
  } else {
    newIndex = currentMatch.value <= 1 ? totalMatches.value : currentMatch.value - 1
  }

  if (newIndex === context.lastMatchIndex && newIndex === currentMatch.value) {
    return
  }

  currentMatch.value = newIndex
  context.lastMatchIndex = newIndex
  emit('change', {CurrentKeyword: currentKeyword.value,KeywordCounts:keywordCounts,CurrentMatch:currentMatch.value});
  // 查找匹配项
  context.eventBus.dispatch('find', {
    type: 'again',
    query: context.currentSearchKeyword,
    findPrevious: direction === 'prev',
    highlightAll: true,
    caseSensitive: false,
    phraseSearch: true
  })

  // 获取匹配项位置并滚动
  const matchIndex = Math.max(0, Math.min(newIndex - 1, context.matchesCache.length - 1))
  if (context.matchesCache[matchIndex]) {
    const match = context.matchesCache[matchIndex]
    setTimeout(() => {
      scrollToMatch(match.pageIdx, match.matchIdx)
    }, 100)
  }
  
}

// 下一个匹配项
function findNext() {
  navigateToMatch('next')
}

// 上一个匹配项
function findPrev() {
  navigateToMatch('prev')
}

// 清空高亮
function clearHighlight() {
  if (context.eventBus) {
    context.eventBus.dispatch('find', {
      type: 'find',
      query: '',
      highlightAll: false
    })
    context.currentSearchKeyword = ''
    context.matchesCache = []
    currentMatch.value = 0
    totalMatches.value = 0
    context.lastMatchIndex = -1

    // 清空统计
    keywordList.value.forEach((keyword) => {
      keywordCounts[keyword] = 0
    })

    // 移除所有高亮
    document.querySelectorAll('.findHighlight, .highlight').forEach((el) => {
      el.classList.remove('active', 'findHighlight', 'highlight')
    })
  }
}

// 执行搜索
function executeSearch(query: string, resetPosition: boolean = true) {
  if (!context.eventBus || !query.trim()) {
    clearHighlight()
    return
  }

  if (resetPosition) {
    currentMatch.value = 0
    context.matchesCache = []
    context.lastMatchIndex = -1
  }

  context.eventBus.dispatch('find', {
    type: 'find',
    query: query.trim(),
    caseSensitive: false,
    highlightAll: true,
    findPrevious: false,
    phraseSearch: true
  })

  context.currentSearchKeyword = query.trim()

  // 延迟收集匹配项
  setTimeout(() => {
    collectMatches()
    if (resetPosition && totalMatches.value > 0) {
      currentMatch.value = 1
      context.lastMatchIndex = 1
      setTimeout(() => {
        const match = context.matchesCache[0]
        if (match) {
          scrollToMatch(match.pageIdx, match.matchIdx)
        }
      }, 200)
    }
  }, 300)
}

// 搜索当前选中的关键词
function searchQuery() {
  if (!context.viewer || !context.isDocumentReady) {
    ElMessage.warning('PDF尚未加载完成，请稍后再试')
    return
  }

  if (!currentKeyword.value) {
    ElMessage.warning('请先选择一个关键词')
    return
  }

  if (!currentKeyword.value.trim()) {
    ElMessage.info('请输入搜索关键字')
    clearHighlight()
    return
  }

  executeSearch(currentKeyword.value, true)
  // ElMessage.success(`搜索: ${currentKeyword.value}`)
}

// 搜索所有关键词
function searchAllKeywords() {
  if (!context.viewer || !context.isDocumentReady) {
    ElMessage.warning('PDF尚未加载完成，请稍后再试')
    return
  }

  clearHighlight()

  // 遍历所有关键词进行搜索
  keywordList.value.forEach((keyword, index) => {
    if (keyword.trim()) {
      // 为每个关键词设置不同的高亮颜色
      setTimeout(() => {
        executeSearch(keyword, false)
        // 统计这个关键词的匹配数
        setTimeout(() => {
          console.log(`关键词"${keyword}"匹配数:`, totalMatches.value)
        }, 500)
      }, index * 1000) // 间隔1秒搜索下一个关键词
    }
  })

  // ElMessage.success('开始搜索所有关键词...')
}

// 新增：重置所有状态的函数
function resetAllStates() {
  // 重置响应式状态
  currentKeyword.value = ''
  currentMatch.value = 0
  totalMatches.value = 0
  hasAutoSearched.value = false
  
  // 清空关键词统计
  Object.keys(keywordCounts).forEach(key => {
    delete keywordCounts[key]
  })
  
  
  // 移除所有高亮
  document.querySelectorAll('.findHighlight, .highlight').forEach(el => {
    el.classList.remove('active', 'findHighlight', 'highlight')
  })
  
  // 通知父组件状态已重置
  emit('change', {
    CurrentKeyword: '',
    KeywordCounts: {},
    CurrentMatch: 0
  })
}

// 新增：清理之前 PDF 资源
function cleanupPreviousPDF() {
  // 清理之前的 blob URL
  if (context.currentBlobUrl) {
    try {
      URL.revokeObjectURL(context.currentBlobUrl)
    } catch (e) {
      console.warn('清理 blob URL 失败:', e)
    }
    context.currentBlobUrl = null
  }
  
  // 清理之前的 PDF 文档
  if (context.viewer) {
    try {
      // 清理 PDF.js 内部资源
      context.viewer.setDocument(null)
      context.viewer = null
    } catch (e) {
      console.warn('清理 PDF viewer 失败:', e)
    }
  }
}

// // 放大
// function scaleD() {
//   if (!context.viewer) return
//   const scale = context.viewer.currentScale
//   context.viewer.currentScale = parseFloat((scale + 0.1).toFixed(2))
// }

// // 缩小
// function scaleX() {
//   if (!context.viewer) return
//   const scale = context.viewer.currentScale
//   if (scale <= 0.5) return
//   context.viewer.currentScale = parseFloat((scale - 0.1).toFixed(2))
// }

// 放大
function scaleD() {
  if (!context.viewer) return
  
  // 先禁用滚动动画
  const container = context.viewer.container
  if (container) {
    container.style.scrollBehavior = 'auto'
  }
  
  const scale = context.viewer.currentScale
  context.viewer.currentScale = parseFloat((scale + 0.2).toFixed(2))
  
  // 恢复滚动行为
  setTimeout(() => {
    if (container) {
      container.style.scrollBehavior = 'smooth'
    }
  }, 300)
}

// 缩小
function scaleX() {
  if (!context.viewer) return
  
  // 先禁用滚动动画
  const container = context.viewer.container
  if (container) {
    container.style.scrollBehavior = 'auto'
  }
  
  const scale = context.viewer.currentScale
  if (scale <= 0.2) return
  context.viewer.currentScale = parseFloat((scale - 0.2).toFixed(2))
  
  // 恢复滚动行为
  setTimeout(() => {
    if (container) {
      container.style.scrollBehavior = 'smooth'
    }
  }, 300)
}

// 暴露方法
defineExpose({
  loadFile,
  loadFile1,
  searchAllKeywords,
  selectKeyword,
  searchQuery,
  clearHighlight,
  findNext,
  findPrev
})
</script>

<style scoped>
.container {
  position: relative;
  padding: 0 !important;
  width: 100%;
  height: 600px;
  /* border: 1px solid greenyellow; */
  margin-top: 10px;
}

.pdf-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.pdf_down {
  position: absolute;
  display: flex;
  z-index: 20;
  right: 10px;
  bottom: 10px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.pdf_set_left,
.pdf_set_middle {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  color: #408fff;
  border: 1px solid #eee;
}

.pdf_set_left:hover,
.pdf_set_middle:hover {
  background: #f5f5f5;
}

/* 关键词选择器样式 */
.keyword-container {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.keyword-btn {
  min-width: 100px;
  position: relative;
}

.keyword-count {
  font-size: 12px;
  color: #666;
  margin-left: 4px;
}

.control-container {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.stats-container {
  margin-bottom: 16px;
  padding: 12px;
  background-color: #f5f5f5;
  border-radius: 4px;
  font-size: 14px;
}

.stats-container > div {
  margin-bottom: 4px;
}

.keyword-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-weight: 500;
}

.stat-item {
  background-color: #e8f4ff;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}
</style>

<style>
/* 高亮样式 */
.highlight {
  background-color: #03314e !important;
  border-radius: 2px;
  padding: 1px 0;
  margin: -1px 0;
  position: relative;
  z-index: 1;
}

/* 当前活动的高亮 */
.highlight.active {
  background-color: rgb(255, 221, 2) !important;
  box-shadow: 0 0 0 2px rgb(234, 250, 15);
  z-index: 2;
}

/* 页面容器 */
.pdfViewer .page {
  position: relative;
  margin: 10px auto;
  border: 1px solid #ccc;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: white;
}

/* 文本层 */
.pdfViewer .textLayer {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  opacity: 0.2;
  line-height: 1;
  pointer-events: none;
}

.pdfViewer .textLayer span {
  color: transparent;
  position: absolute;
  white-space: pre;
  cursor: text;
  transform-origin: 0% 0%;
  pointer-events: auto;
}
</style>
