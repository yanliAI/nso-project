<script setup lang='ts'>
import { onMounted, ref, watch, onUnmounted } from 'vue'
import { getDocument, GlobalWorkerOptions, version } from 'pdfjs-dist/legacy/build/pdf'
import { EventBus, GenericL10n, PDFFindController, PDFLinkService, PDFViewer } from 'pdfjs-dist/legacy/web/pdf_viewer'
import PDFWorker from './work.js'

const props = defineProps<{
  data?: ArrayBuffer,    // 二进制数据（优先级更高）
  url?: string           // PDF 链接（备用）
}>()

// 容器
const container = ref<HTMLDivElement | null>(null)

// 上下文
const context = {
  viewer: null as null | PDFViewer,
  search: '' as string,
  pdf_scale: 1.0 as number,
  isLoading: ref(false),
  error: ref<string | null>(null)
}

// 初始化 Worker（适配 3.11.174 版本）
if (!GlobalWorkerOptions.workerPort && typeof window !== 'undefined' && 'Worker' in window) {
  GlobalWorkerOptions.workerPort = PDFWorker.create();
}
// 兜底 Worker 地址
if (!GlobalWorkerOptions.workerSrc) {
  GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/legacy/build/pdf.worker.min.js`;
}

// 获取 PDF 数据（支持 URL/二进制）
async function getPDFData(): Promise<ArrayBuffer> {
  if (props.data) {
    return props.data;
  } else if (props.url) {
    context.isLoading.value = true;
    try {
      const response = await fetch(props.url, {
        mode: 'cors',
        credentials: 'same-origin'
      });
      if (!response.ok) throw new Error(`HTTP 错误: ${response.status}`);
      const buffer = await response.arrayBuffer();
      if (buffer.byteLength === 0) throw new Error('PDF 数据为空');
      return buffer;
    } catch (err) {
      context.error.value = err instanceof Error ? err.message : '加载 PDF 失败';
      throw err;
    } finally {
      context.isLoading.value = false;
    }
  } else {
    throw new Error('必须传入 data 或 url 参数');
  }
}

// 加载 PDF 文件
async function loadFile() {
  if (!container.value) return;
  
  // 清空容器
  container.value.innerHTML = '';
  // 重置错误
  context.error.value = null;

  try {
    // 初始化核心实例（适配 3.11.174 版本）
    const eventBus = new EventBus();
    const pdfLinkService = new PDFLinkService({ eventBus });
    // 移除 3.x 不支持的 updateMatchesCountOnProgress 参数
    const pdfFindController = new PDFFindController({
      eventBus,
      linkService: pdfLinkService
    });
    // 简化 GenericL10n 初始化
    const l10n = new GenericL10n();
    l10n.setLanguage('zh-CN');

    // 创建 PDF 查看器
    const pdfViewer = new PDFViewer({
      container: container.value,
      eventBus,
      linkService: pdfLinkService,
      findController: pdfFindController,
      l10n,
      enableXfa: true,
      useOnlyCssZoom: true
    });
    pdfLinkService.setViewer(pdfViewer);

    // 页面初始化完成后调整缩放
    eventBus.on('pagesinit', () => {
      const viewport = pdfViewer.getPageView(0)?.viewport;
      if (viewport?.width > window.innerWidth) {
        pdfViewer.currentScaleValue = '0.5';
      } else {
        pdfViewer.currentScaleValue = '1';
      }
      // 执行搜索（如有）
      if (context.search) {
        eventBus.dispatch('find', { type: '', query: context.search });
      }
    });

    // 加载 PDF 文档
    const pdfData = await getPDFData();
    const loadingTask = getDocument({
      data: pdfData,
      cMapUrl: `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/cmaps/`,
      useWorkerFetch: false, // 3.x 版本关闭该参数
      cMapPacked: true,
      enableXfa: true
    });
    const pdfDocument = await loadingTask.promise;
    pdfViewer.setDocument(pdfDocument);
    pdfLinkService.setDocument(pdfDocument, null);
    context.viewer = pdfViewer;

  } catch (err) {
    console.error('加载 PDF 失败:', err);
    context.error.value = err instanceof Error ? err.message : '加载 PDF 失败';
  }
}

// 放大
function scaleD() {
  if (!context.viewer) return;
  const scale = context.viewer.currentScale;
  const max = window.screen.width > 1440 ? 1.4 : 1.2;
  if (scale >= max) return;
  context.viewer.currentScale = parseFloat((scale + 0.1).toFixed(2));
}

// 缩小
function scaleX() {
  if (!context.viewer) return;
  const scale = context.viewer.currentScale;
  const min = 0.5;
  if (scale <= min) return;
  context.viewer.currentScale = parseFloat((scale - 0.1).toFixed(2));
}

// 监听 props 变化重新加载
watch([() => props.data, () => props.url], () => {
  if (container.value) loadFile();
}, { immediate: false });

// 挂载后加载
onMounted(() => {
  // 延迟执行确保 DOM 就绪
  setTimeout(loadFile, 50);
});

// 卸载时清理
onUnmounted(() => {
  if (context.viewer) {
    context.viewer.cleanup();
  }
  PDFWorker.destroy();
});
</script>

<template>
  <div class='container'>
    <!-- 加载状态 -->
    <div v-if="context.isLoading" class="loading">
      <div class="spinner"></div>
      <span>加载中...</span>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="context.error" class="error">
      <span>{{ context.error }}</span>
      <button @click="loadFile()">重试</button>
    </div>

    <!-- 缩放按钮 -->
    <div v-else class='pdf_down'>
      <div class='pdf_set_left' @click='scaleD()'>➕</div>
      <div class='pdf_set_middle' @click='scaleX()'>➖</div>
    </div>

    <!-- PDF 容器 -->
    <div 
      ref='container' 
      class='pdf-wrapper'
      v-show="!context.isLoading && !context.error"
    >
      <div id='viewer' class='pdfViewer' />
    </div>
  </div>
</template>

<style scoped>
.container {
  position: relative;
  width: 100%;
  height: 100vh; /* 全屏显示 */
  background: #f5f5f5;
}

.pdf-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.pdfViewer {
  width: 100%;
  height: 100%;
  position: relative;
}

/* 缩放按钮 */
.pdf_down {
  position: fixed;
  display: flex;
  z-index: 20;
  right: 26px;
  bottom: 7%;
}

.pdf_set_left, .pdf_set_middle {
  width: 30px;
  height: 40px;
  color: #408FFF;
  font-size: 15px;
  padding-top: 25px;
  text-align: center;
  margin-right: 5px;
  cursor: pointer;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.2s;
}

.pdf_set_left:hover, .pdf_set_middle:hover {
  background: #408FFF;
  color: white;
}

/* 加载状态 */
.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #408FFF;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(64, 143, 255, 0.3);
  border-radius: 50%;
  border-top-color: #408FFF;
  animation: spin 1s ease-in-out infinite;
}

/* 错误状态 */
.error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #ff4444;
}

.error button {
  padding: 6px 16px;
  background: #408FFF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>

<!-- PDF.js 全局样式 -->
<style>
.pdfViewer .page {
  margin: 10px auto;
  border: 1px solid #ccc;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  background-color: white;
  position: relative;
}

.pdfViewer .canvasWrapper {
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.pdfViewer .textLayer {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  opacity: 0.2;
  line-height: 1.0;
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
