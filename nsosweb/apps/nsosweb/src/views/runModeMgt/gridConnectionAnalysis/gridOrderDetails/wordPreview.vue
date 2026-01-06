<template>
  <div style="width: 100%; height: 100%;">
    <div
      ref="word"
      id="fileShow"
      class="words"
      :class="{ 'text-file': fileType === 'txt', 'multiple-keywords': searchCompleted }"
      v-if="hasFile || showLoading"
    >
      <div v-if="showLoading" style="text-align: center; padding: 50px; color: #666;">
        <el-icon class="is-loading" style="font-size: 24px;">
          <Loading />
        </el-icon>
        <div style="margin-top: 10px;">文件加载中...</div>
      </div>
    </div>
    <!-- 无文件时显示占位，避免 DOM 空节点问题 -->
    <div v-else style="text-align: center; padding: 50px; color: #999;">
      请从服务器加载文件
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick, watch, reactive, onUnmounted, defineExpose } from "vue";
import { ElMessage, ElLoading } from "element-plus";
import { Search, Download, Monitor, Operation, Document, Back, CircleCheck, Loading } from '@element-plus/icons-vue'
import axios from "axios";
import { useAccessStore } from "@vben/stores";
import { renderAsync } from "docx-preview";

const accessStore = useAccessStore();
const emit = defineEmits(['change']);

// 定义props
interface Props {
  keywordList?: string[];
}
const props = withDefaults(defineProps<Props>(), {
  keywordList: () => []
});

const fileData = defineModel('fileData')
const isZipFile = defineModel('isZipFile', { default: true })
// 当前选中的关键词
const currentKeyword = ref('');
// 关键词统计对象
const keywordCounts = reactive<Record<string, number>>({});
// 当前匹配序号
const currentMatch = ref(0);
// 当前匹配索引
const currentMatchIndex = ref(-1);

// 文件相关状态
const fileType = ref('');
const fileContent = ref('');
const loading = ref(false);
const showLoading = ref(false);
const hasFile = ref(false);

const word = ref<HTMLElement | null>(null)
// 搜索状态
const searchResults = reactive<Record<string, HTMLElement[]>>({}); // 改为对象，key为关键字
const searchCompleted = ref(false);

// 计算属性
const currentResults = computed(() => {
  return currentKeyword.value && searchResults[currentKeyword.value]
    ? searchResults[currentKeyword.value]
    : [];
});

const hasCurrentResults = computed(() => {
  return currentResults.value.length > 0;
});

/**
 * 加载word和txt文件
 */
async function loadFileFromServer() {
  try {
    // 重置状态（先标记为加载中，让 DOM 稳定）
    resetSearchState();
    loading.value = true;
    showLoading.value = true;
    hasFile.value = false; // 先置为false，触发v-if重建DOM

    const { type } = detectFileType(fileData.value.name);
    fileType.value = type;

    const response = await axios({
      method: 'post',
      responseType: 'blob',
      url: import.meta.env.VITE_NSOSFS + `/ydCommon/previewFile`,
      data: {
        fileId: fileData.value.fileId,
        idate: fileData.value.iDate,
        oid: fileData.value.oid,
        bkUsername: fileData.value.bkUsername
      },
      headers: {
        Authorization: formatToken(accessStore.accessToken)
      }
    });

    await nextTick(); // 等待DOM重建完成
    if (type === 'docx' || type === 'doc') {
      await loadDocxFromBlob(response.data);
    } else if (type === 'txt') {
      await loadTxtFromBlob(response.data);
    } else {
      ElMessage.warning(`不支持的文件格式: ${type}`);
      return;
    }

    showLoading.value = false;
    loading.value = false;
    hasFile.value = true;

  } catch (error) {
    console.error('文件加载失败:', error);
    loading.value = false;
    showLoading.value = false;
    hasFile.value = false; // 加载失败也重置DOM
    ElMessage.error('文件加载失败，请重试');
  }
};

async function loadZipFileFromServer() {
  try {
    // 重置状态（关键：先让DOM脱离Vue响应式更新周期）
    resetSearchState();
    loading.value = true;
    showLoading.value = true;
    hasFile.value = false;

    const { type } = detectFileType(fileData.value.name);
    fileType.value = type;
    
    await nextTick(); // 等待DOM更新完成
    const response = await axios({
      method: 'post',
      responseType: 'blob',
      url: import.meta.env.VITE_NSOSFS + `/ydCommon/previewZipEntry`,
      data: {
        fileId: fileData.value.fileId,
        idate: fileData.value.iDate,
        oid: fileData.value.oid,
        entryPath: fileData.value.entryPath,
        bkUsername: fileData.value.bkUsername
      },
      headers: {
        Authorization: formatToken(accessStore.accessToken)
      }
    });

    if (type === 'docx' || type === 'doc') {
      await loadDocxFromBlob(response.data);
    } else if (type === 'txt') {
      await loadTxtFromBlob(response.data);
    } else {
      ElMessage.warning(`不支持的文件格式: ${type}`);
      return;
    }

    showLoading.value = false;
    loading.value = false;
    hasFile.value = true;

  } catch (error) {
    console.error('文件加载失败:', error);
    loading.value = false;
    showLoading.value = false;
    hasFile.value = false;
    ElMessage.error('文件加载失败，请重试');
  }
};

/**
 *  监听执行
 */
watch(fileData, async (newVal) => {
  if (!newVal) return;
  // 关键：等待DOM完全更新后再加载文件，避免周期冲突
  await nextTick(); 
  if (word.value && isZipFile.value === false) {
    await loadFileFromServer();
  } else if (word.value && isZipFile.value === true) {
    await loadZipFileFromServer();
  }
}, { immediate: true, flush: 'post' }); // 关键：flush: 'post' 确保在DOM更新后执行

onUnmounted(() => {
  // 清理资源（安全方式）
  resetSearchState();
  if (word.value) {
    // 避免直接清空innerHTML，改用Vue状态控制
    hasFile.value = false;
  }
})

/**
 * 工具函数
 */
// 重置搜索状态（核心：避免DOM操作冲突）
const resetSearchState = () => {
  Object.keys(keywordCounts).forEach(key => delete keywordCounts[key]);
  Object.keys(searchResults).forEach(key => delete searchResults[key]);
  currentKeyword.value = '';
  currentMatch.value = 0;
  currentMatchIndex.value = -1;
  searchCompleted.value = false;
};

// 获取关键字的匹配数量
const getMatchCount = (keyword: string) => {
  if (keyword && searchResults[keyword]) {
    return searchResults[keyword].length;
  }
  return 0;
};

// 获取关键字对应的CSS类名索引
const getKeywordClassIndex = (keyword: string) => {
  if (!keyword || !props.keywordList) return 0;
  const index = props.keywordList.indexOf(keyword);
  return index !== -1 ? index : 0;
};

// 更新关键词统计
const updateKeywordCounts = () => {
  console.log('开始更新关键词统计');
  console.log('当前关键字列表:', props.keywordList);
  console.log('当前搜索结果:', searchResults);

  // 清空之前的统计
  Object.keys(keywordCounts).forEach(key => {
    delete keywordCounts[key];
  });

  // 重新统计
  if (props.keywordList && props.keywordList.length > 0) {
    props.keywordList.forEach((keyword) => {
      if (searchResults[keyword]) {
        keywordCounts[keyword] = searchResults[keyword].length;
      } else {
        keywordCounts[keyword] = 0;
      }
    });
  }

  console.log('更新后的关键词统计:', keywordCounts);

  // 触发事件给父组件
  triggerChangeEvent();
};

// 触发change事件
const triggerChangeEvent = () => {
  emit('change', {
    CurrentKeyword: currentKeyword.value,
    KeywordCounts: { ...keywordCounts },
    CurrentMatch: currentMatch.value
  });
  console.log('触发change事件:', {
    CurrentKeyword: currentKeyword.value,
    KeywordCounts: { ...keywordCounts },
    CurrentMatch: currentMatch.value
  });
};

// 格式化token
function formatToken(token: string) {
  return token ? `Bearer ${token}` : null;
}

// 开始批量搜索
const startBatchSearch = () => {
  if (!props.keywordList || props.keywordList.length === 0) {
    ElMessage.warning('关键字列表为空');
    return;
  }
  // 关键：使用requestIdleCallback确保在浏览器空闲时执行，避免阻塞Vue更新
  if (window.requestIdleCallback) {
    requestIdleCallback(performBatchSearch, { timeout: 2000 });
  } else {
    setTimeout(performBatchSearch, 0); // 降级方案
  }
};

// 执行批量搜索（核心修改：避免直接替换innerHTML，改用遍历文本节点高亮）
const performBatchSearch = () => {
  const main = word.value; // 改用ref引用，避免getElementById的不确定性
  if (!main) {
    console.warn('未找到文档容器');
    return;
  }

  // 清除之前的高亮（安全方式：只移除高亮节点，不破坏原文本结构）
  clearAllHighlights();

  console.log('开始执行批量搜索，关键字列表:', props.keywordList);

  // 核心修改：遍历文本节点，逐个替换，避免innerHTML暴力替换
  props.keywordList.forEach((keyword, index) => {
    if (!keyword || !keyword.trim()) return;
    
    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const reg = new RegExp(escapedKeyword, 'gi');
    const classIndex = getKeywordClassIndex(keyword);

    // 遍历所有文本节点（跳过已高亮的节点）
    const textNodes = getTextNodes(main, (node) => {
      return !node.parentElement || !node.parentElement.classList.contains('search-highlight');
    });

    textNodes.forEach(node => {
      const text = node.textContent || '';
      if (reg.test(text)) {
        // 分割文本并创建高亮节点
        splitTextNodeWithHighlight(node, reg, classIndex, keyword);
      }
    });
  });

  // 收集搜索结果（延迟执行，确保DOM稳定）
  setTimeout(() => {
    props.keywordList.forEach((keyword) => {
      if (keyword && keyword.trim()) {
        const classIndex = getKeywordClassIndex(keyword);
        searchResults[keyword] = Array.from(
          main.querySelectorAll(`mark.search-highlight.keyword-${classIndex}[data-keyword="${keyword}"]`)
        ) as HTMLElement[];
      }
    });

    searchCompleted.value = true;
    updateKeywordCounts();

    // 默认选择第一个有关键字匹配的结果
    if (props.keywordList && props.keywordList.length > 0) {
      const firstKeywordWithResults = props.keywordList.find(keyword =>
        searchResults[keyword] && searchResults[keyword].length > 0
      );

      if (firstKeywordWithResults) {
        switchToKeyword(firstKeywordWithResults);
      } else {
        ElMessage.warning('没有找到任何关键字的匹配内容');
      }
    }
  }, 100);
};

// 工具函数：获取所有文本节点（过滤条件）
const getTextNodes = (element: HTMLElement, filter?: (node: Text) => boolean): Text[] => {
  const textNodes: Text[] = [];
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        if (filter && !filter(node as Text)) return NodeFilter.FILTER_SKIP;
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  let node;
  while ((node = walker.nextNode())) {
    textNodes.push(node as Text);
  }
  return textNodes;
};

// 工具函数：分割文本节点并创建高亮
const splitTextNodeWithHighlight = (
  node: Text,
  reg: RegExp,
  classIndex: number,
  keyword: string
) => {
  const text = node.textContent || '';
  let match;
  let lastIndex = 0;
  const parent = node.parentElement;
  if (!parent) return;

  // 重置正则lastIndex
  reg.lastIndex = 0;

  while ((match = reg.exec(text)) !== null) {
    const [matchedText] = match;
    const matchStart = match.index;
    const matchEnd = reg.lastIndex;

    // 1. 添加匹配前的普通文本
    if (matchStart > lastIndex) {
      const beforeText = document.createTextNode(text.slice(lastIndex, matchStart));
      parent.insertBefore(beforeText, node);
    }

    // 2. 创建高亮节点
    const highlightNode = document.createElement('mark');
    highlightNode.className = `search-highlight keyword-${classIndex}`;
    highlightNode.dataset.keyword = keyword;
    highlightNode.textContent = matchedText;
    parent.insertBefore(highlightNode, node);

    lastIndex = matchEnd;
  }

  // 3. 添加剩余文本
  if (lastIndex < text.length) {
    const afterText = document.createTextNode(text.slice(lastIndex));
    parent.insertBefore(afterText, node);
  }

  // 4. 删除原文本节点
  parent.removeChild(node);
};

// 切换到指定关键字
const switchToKeyword = (keyword: string) => {
  console.log('切换到关键字:', keyword);
  currentKeyword.value = keyword;
  currentMatchIndex.value = 0;
  currentMatch.value = 1; // 从1开始计数

  // 触发事件
  triggerChangeEvent();
  // 延迟高亮，确保DOM稳定
  setTimeout(highlightCurrentMatch, 0);
};

// 高亮当前匹配项
const highlightCurrentMatch = () => {
  if (!currentKeyword.value || !hasCurrentResults.value) return;

  console.log('高亮当前匹配项，当前关键字:', currentKeyword.value, '结果数量:', currentResults.value.length);

  // 清除所有当前高亮
  Object.keys(searchResults).forEach(key => {
    searchResults[key]?.forEach(result => {
      result.classList.remove('current-highlight');
    });
  });

  // 高亮当前关键字的当前匹配项
  const currentMatchElement = currentResults.value[currentMatchIndex.value];
  if (currentMatchElement) {
    console.log('找到当前匹配元素:', currentMatchElement);
    currentMatchElement.classList.add('current-highlight');
    scrollToMatch(currentMatchElement);
  } else {
    console.log('未找到匹配元素');
  }
};

// 上一个匹配项
const prevMatch = () => {
  if (hasCurrentResults.value && currentMatchIndex.value > 0) {
    currentMatchIndex.value--;
    currentMatch.value = currentMatchIndex.value + 1; // 更新当前匹配序号
    highlightCurrentMatch();
    triggerChangeEvent();
  }
};

// 下一个匹配项
const nextMatch = () => {
  if (hasCurrentResults.value && currentMatchIndex.value < currentResults.value.length - 1) {
    currentMatchIndex.value++;
    currentMatch.value = currentMatchIndex.value + 1; // 更新当前匹配序号
    highlightCurrentMatch();
    triggerChangeEvent();
  }
};

// 滚动到匹配项
const scrollToMatch = (element: HTMLElement) => {
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest"
    });

    // 添加闪烁效果
    element.style.transition = 'all 0.3s';
    element.style.boxShadow = '0 0 0 3px rgba(255, 152, 0, 0.5)';
    setTimeout(() => {
      element.style.boxShadow = '';
    }, 1000);
  }
};

// 清除所有高亮（安全方式）
const clearAllHighlights = () => {
  const main = word.value;
  if (!main) return;

  // 关键：只移除高亮节点，恢复原文本，不破坏DOM结构
  const highlights = main.querySelectorAll('mark.search-highlight, mark.current-highlight');
  highlights.forEach(highlight => {
    const parent = highlight.parentElement;
    if (parent) {
      // 创建文本节点替换高亮节点
      const textNode = document.createTextNode(highlight.textContent || '');
      parent.replaceChild(textNode, highlight);
      // 合并相邻文本节点（避免DOM碎片化）
      mergeAdjacentTextNodes(parent);
    }
  });

  // 重置搜索状态
  resetSearchState();
  triggerChangeEvent();
};

// 合并相邻文本节点（优化DOM结构）
const mergeAdjacentTextNodes = (element: HTMLElement) => {
  let child = element.firstChild;
  while (child) {
    const next = child.nextSibling;
    if (child.nodeType === Node.TEXT_NODE && next && next.nodeType === Node.TEXT_NODE) {
      child.textContent += next.textContent;
      element.removeChild(next);
    } else {
      child = next;
    }
  }
};

// 检测文件类型
function detectFileType(filename: string) {
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  let type = '';

  if (extension === 'docx' || extension === 'doc') {
    type = 'docx';
  } else if (extension === 'txt') {
    type = 'txt';
  } else if (extension === 'pdf') {
    type = 'pdf';
  } else if (['xls', 'xlsx'].includes(extension)) {
    type = 'xlsx';
  } else if (['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(extension)) {
    type = 'image';
  } else {
    type = 'unknown';
  }

  return { type, extension };
}

// 加载DOCX文件（核心修改：确保渲染完全稳定）
const loadDocxFromBlob = async (blobData: Blob) => {
  try {
    const blob = new Blob([blobData], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });

    const previewContainer = word.value;
    if (!previewContainer) {
      throw new Error('预览容器不存在');
    }

    console.log('开始渲染DOCX文档');
    
    // 确保容器为空
    previewContainer.innerHTML = '';
    await nextTick(); // 等待Vue更新DOM

    // 使用Promise包装，确保渲染完全完成
    await new Promise<void>((resolve, reject) => {
      renderAsync(blob, previewContainer, null, {
        className: "docx",
        inWrapper: true,
        breakPages: true,
        ignoreWidth: false,
        ignoreHeight: false,
        ignoreFonts: false,
        ignoreLastRenderedPageBreak: false
      }).then(() => {
        // 关键：等待200ms确保DOM完全渲染
        setTimeout(() => {
          fixLineHeight();
          fixDocxLayout(); // 新增：修复docx布局
          fixDocxPageMargins(); // 新增：修复页面边距
          startBatchSearch();
          console.log('DOCX文档渲染完成');
          resolve();
        }, 200);
      }).catch(reject);
    });

  } catch (error) {
    console.error('DOCX渲染失败:', error);
    const previewContainer = word.value;
    if (previewContainer) {
      previewContainer.innerHTML = '<div style="color: red; text-align: center;">文档加载失败</div>';
    }
    throw error;
  }
};

// 新增：修复docx布局
const fixDocxLayout = () => {
  const previewContainer = word.value;
  if (!previewContainer) return;

  // 查找docx生成的元素
  const docxWrapper = previewContainer.querySelector('.docx-wrapper');
  const docxSections = previewContainer.querySelectorAll('.docx-wrapper > section.docx');

  if (docxWrapper) {
    // 1. 修复wrapper的宽度
    (docxWrapper as HTMLElement).style.width = '100%';
    (docxWrapper as HTMLElement).style.maxWidth = '100%';
    (docxWrapper as HTMLElement).style.boxSizing = 'border-box';
    
    // 2. 修复每个section
    docxSections.forEach(section => {
      const sectionEl = section as HTMLElement;
      
      // 设置相对宽度，而不是固定宽度
      sectionEl.style.width = '100%';
      sectionEl.style.maxWidth = '100%';
      sectionEl.style.margin = '0 auto';
      sectionEl.style.boxSizing = 'border-box';
      sectionEl.style.padding = '0 20px'; // 添加内边距
      
      // 修复表格宽度
      const tables = sectionEl.querySelectorAll('table');
      tables.forEach(table => {
        (table as HTMLElement).style.maxWidth = '100%';
        (table as HTMLElement).style.tableLayout = 'auto';
      });
      
      // 修复图片宽度
      const images = sectionEl.querySelectorAll('img');
      images.forEach(img => {
        (img as HTMLElement).style.maxWidth = '100%';
        (img as HTMLElement).style.height = 'auto';
      });
      
      // 修复列表和段落
      const paragraphs = sectionEl.querySelectorAll('p');
      paragraphs.forEach(p => {
        (p as HTMLElement).style.maxWidth = '100%';
        (p as HTMLElement).style.wordBreak = 'break-word';
        (p as HTMLElement).style.overflowWrap = 'break-word';
      });
    });
  }
};

// 新增：专门修复docx页面边距，确保所有页面等宽
const fixDocxPageMargins = () => {
  const previewContainer = word.value;
  if (!previewContainer) return;

  // 查找所有页面
  const docxSections = previewContainer.querySelectorAll('section.docx');
  if (docxSections.length === 0) return;

  console.log(`找到 ${docxSections.length} 个docx页面`);
  
  // 获取容器宽度
  const containerWidth = previewContainer.clientWidth;
  console.log('容器宽度:', containerWidth);
  
  // 计算合适的页面宽度（留出左右内边距）
  const pageWidth = Math.min(containerWidth, 800); // 最大800px，但不超过容器宽度
  const pageMargin = Math.max((containerWidth - pageWidth) / 2, 20); // 计算边距，最小20px
  
  console.log('计算后的页面宽度:', pageWidth, '边距:', pageMargin);
  
  // 统一设置所有页面的宽度和边距
  docxSections.forEach((section, index) => {
    const sectionEl = section as HTMLElement;
    
    // 重置所有边距和内边距
    sectionEl.style.margin = '0';
    sectionEl.style.padding = '0';
    sectionEl.style.paddingLeft = '0';
    sectionEl.style.paddingRight = '0';
    sectionEl.style.marginLeft = '0';
    sectionEl.style.marginRight = '0';
    
    // 统一设置页面宽度
    sectionEl.style.width = `${pageWidth}px`;
    sectionEl.style.maxWidth = `${pageWidth}px`;
    sectionEl.style.minWidth = `${pageWidth}px`;
    sectionEl.style.margin = '0 auto';
    sectionEl.style.boxSizing = 'border-box';
    
    // 添加统一的内边距
    sectionEl.style.padding = '20px 40px';
    
    // 设置背景色和阴影
    sectionEl.style.backgroundColor = 'white';
    sectionEl.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    sectionEl.style.borderRadius = '4px';
    
    // 强制设置页面的页面边距
    sectionEl.style.pageBreakAfter = 'always';
    sectionEl.style.pageBreakBefore = index === 0 ? 'auto' : 'always';
    sectionEl.style.pageBreakInside = 'avoid';
    
    // 特殊处理：修复第一页的左边距
    if (index === 0) {
      // 第一页可能需要特殊处理
      console.log('第一页的特殊处理');
      const firstChild = sectionEl.firstElementChild as HTMLElement;
      if (firstChild && getComputedStyle(firstChild).marginLeft !== '0px') {
        firstChild.style.marginLeft = '0';
      }
    }
    
    // 特殊处理：修复最后一页
    if (index === docxSections.length - 1) {
      sectionEl.style.pageBreakAfter = 'auto';
    }
    
    console.log(`页面 ${index + 1} 设置完成:`, {
      width: sectionEl.style.width,
      margin: sectionEl.style.margin,
      padding: sectionEl.style.padding
    });
  });
  
  // 处理wrapper
  const docxWrapper = previewContainer.querySelector('.docx-wrapper') as HTMLElement;
  if (docxWrapper) {
    docxWrapper.style.width = '100%';
    docxWrapper.style.maxWidth = '100%';
    docxWrapper.style.boxSizing = 'border-box';
    docxWrapper.style.padding = '0';
    docxWrapper.style.margin = '0';
    
    // 修复子元素布局
    const children = docxWrapper.children;
    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement;
      if (child.tagName.toLowerCase() !== 'section') {
        child.style.margin = '0 auto';
        child.style.maxWidth = `${pageWidth}px`;
      }
    }
  }
  
  // 添加一个全局样式来覆盖docx-preview的默认样式
  const styleId = 'docx-custom-styles';
  let styleEl = document.getElementById(styleId) as HTMLStyleElement;
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = styleId;
    document.head.appendChild(styleEl);
  }
  
  // 设置全局样式，强制所有页面等宽
  styleEl.textContent = `
    /* 强制所有docx页面等宽 */
    .docx-wrapper > section.docx {
      width: ${pageWidth}px !important;
      max-width: ${pageWidth}px !important;
      min-width: ${pageWidth}px !important;
      margin: 0 auto !important;
      box-sizing: border-box !important;
      padding: 20px 40px !important;
    }
    
    /* 移除所有可能的边距和内边距 */
    .docx-wrapper > section.docx * {
      box-sizing: border-box !important;
    }
    
    /* 确保表格不溢出 */
    .docx-wrapper > section.docx table {
      max-width: 100% !important;
      table-layout: auto !important;
      width: auto !important;
    }
    
    /* 修复第一页的特殊样式 */
    .docx-wrapper > section.docx:first-child {
      margin-top: 0 !important;
    }
    
    /* 修复最后一页的特殊样式 */
    .docx-wrapper > section.docx:last-child {
      margin-bottom: 0 !important;
    }
  `;
};

// 加载TXT文件
const loadTxtFromBlob = async (blobData: Blob) => {
  try {
    const txtBlob = new Blob([blobData], {
      type: 'text/plain; charset=utf-8'
    });

    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          fileContent.value = content;

          const previewContainer = word.value;
          if (previewContainer) {
            previewContainer.innerHTML = formatTextContent(content);
            console.log('TXT文件加载完成');
            // 延迟执行搜索，确保DOM稳定
            setTimeout(startBatchSearch, 100);
            resolve(true);
          }
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = (err) => {
        console.error('TXT文件读取失败:', err);
        const previewContainer = word.value;
        if (previewContainer) {
          previewContainer.innerHTML = '<div style="color: red; text-align: center; margin-top: 20px;">TXT 文件解析失败（编码不兼容或文件损坏），请下载查看</div>';
        }
        reject(err);
      };

      reader.readAsText(txtBlob, 'utf-8');
    });
  } catch (error) {
    console.error('TXT处理失败:', error);
    throw error;
  }
};

// 修正行高
const fixLineHeight = () => {
  const previewContainer = word.value;
  if (!previewContainer) return;

  const paragraphs = previewContainer.querySelectorAll('p');
  paragraphs.forEach(p => {
    p.style.lineHeight = '1.5';
  });
};

// 格式化文本内容
const formatTextContent = (content: string): string => {
  if (!content.trim()) {
    return '<div style="color: #999; text-align: center; padding: 20px;">文件内容为空</div>';
  }

  const formatted = content
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\r\n|\r|\n/g, '<br>')
    .replace(/ /g, '&nbsp;')
    .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');

  return `<div class="text-content">${formatted}</div>`;
};

// 清除文件（改用状态控制，避免直接操作DOM）
const clearFile = () => {
  resetSearchState();
  fileContent.value = '';
  fileType.value = '';
  hasFile.value = false; // 通过v-if控制DOM显示
};

// 暴露方法
defineExpose({
  loadFileFromServer,
  clearFile,
  startBatchSearch,
  clearAllHighlights,
  switchToKeyword,
  loadZipFileFromServer,
  prevMatch,
  nextMatch
});
</script>

<style scoped>
.words {
  height: 700px;
  width: 100%;
  border: 1px solid #ddd;
  overflow: auto;
  /* 允许水平滚动，但不强制 */
  overflow-x: auto;
  /* 关键：让内容能够自然扩展 */
  overflow-y: auto;
  box-sizing: border-box;
}

/* 修复docx-preview生成的样式 */
:deep(.docx-wrapper) {
  width: 100% !important;
  max-width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  box-sizing: border-box !important;
  /* 允许水平滚动 */
  overflow-x: visible !important;
  overflow-y: visible !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
}

:deep(.docx-wrapper > section.docx) {
  /* 关键：使用固定宽度，而不是auto */
  width: 800px !important; /* 或者使用计算宽度: 100% */
  max-width: 100% !important;
  min-width: 800px !important;
  margin: 0 auto !important; /* 居中显示 */
  box-sizing: border-box !important;
  /* 添加统一的padding */
  padding: 20px 40px !important;
  /* 允许内容适应容器 */
  overflow-wrap: break-word !important;
  word-break: break-word !important;
  /* 移除固定尺寸限制 */
  /* height: auto !important; */
  page-break-after: always !important;
  background: white !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
  border-radius: 4px !important;
  margin-bottom: 20px !important;
  /* 确保所有页面等宽 */
  display: block !important;
  position: relative !important;
}

/* 修复第一页的特殊样式 */
:deep(.docx-wrapper > section.docx:first-child) {
  margin-top: 0 !important;
  /* 确保第一页也没有额外边距 */
  padding-top: 20px !important;
  padding-left: 40px !important;
  padding-right: 40px !important;
}

/* 修复最后一页的特殊样式 */
:deep(.docx-wrapper > section.docx:last-child) {
  margin-bottom: 0 !important;
  page-break-after: auto !important;
}

/* 修复文档内容的内部边距 */
:deep(.docx-wrapper > section.docx .docx-content) {
  width: 100% !important;
  max-width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  box-sizing: border-box !important;
}

/* 特殊处理：修复docx-preview生成的内部div的边距 */
:deep(.docx-wrapper > section.docx > div) {
  width: 100% !important;
  max-width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  box-sizing: border-box !important;
}

/* 特殊处理：修复docx-preview生成的内部span */
:deep(.docx-wrapper > section.docx span) {
  max-width: 100% !important;
  display: inline-block !important;
  word-break: break-word !important;
}

/* 修复表格布局 */
:deep(.docx-wrapper > section.docx table) {
  width: 100% !important;
  max-width: 100% !important;
  table-layout: fixed !important; /* 使用固定布局 */
  overflow-x: auto !important;
  border-collapse: collapse !important;
  border-spacing: 0 !important;
  margin: 10px 0 !important;
  display: table !important;
  box-sizing: border-box !important;
}

:deep(.docx-wrapper > section.docx table td),
:deep(.docx-wrapper > section.docx table th) {
  min-width: 50px !important;
  max-width: none !important;
  padding: 4px 8px !important;
  border: 1px solid #e0e0e0 !important;
  word-break: break-word !important;
  white-space: normal !important;
  box-sizing: border-box !important;
}

/* 修复图片 */
:deep(.docx-wrapper > section.docx img) {
  max-width: 100% !important;
  height: auto !important;
  display: block !important;
  margin: 10px auto !important;
  box-sizing: border-box !important;
}

/* 修复段落 */
:deep(.docx-wrapper > section.docx p) {
  width: 100% !important;
  max-width: 100% !important;
  margin: 8px 0 !important;
  padding: 0 !important;
  line-height: 1.5 !important;
  word-break: break-word !important;
  overflow-wrap: break-word !important;
  box-sizing: border-box !important;
}

/* 修复列表 */
:deep(.docx-wrapper > section.docx ul),
:deep(.docx-wrapper > section.docx ol) {
  width: 100% !important;
  max-width: 100% !important;
  margin: 8px 0 !important;
  padding-left: 24px !important;
  box-sizing: border-box !important;
  overflow-wrap: break-word !important;
}

/* 修复标题 */
:deep(.docx-wrapper > section.docx h1),
:deep(.docx-wrapper > section.docx h2),
:deep(.docx-wrapper > section.docx h3),
:deep(.docx-wrapper > section.docx h4),
:deep(.docx-wrapper > section.docx h5),
:deep(.docx-wrapper > section.docx h6) {
  width: 100% !important;
  max-width: 100% !important;
  margin: 16px 0 8px 0 !important;
  padding: 0 0 4px 0 !important;
  border-bottom: 1px solid #f0f0f0 !important;
  overflow-wrap: break-word !important;
  word-break: break-word !important;
  box-sizing: border-box !important;
}

/* 修复超链接 */
:deep(.docx-wrapper > section.docx a) {
  word-break: break-all !important;
  overflow-wrap: break-word !important;
  display: inline-block !important;
  max-width: 100% !important;
}

/* 修复代码块 */
:deep(.docx-wrapper > section.docx pre) {
  width: 100% !important;
  max-width: 100% !important;
  overflow-x: auto !important;
  margin: 10px 0 !important;
  padding: 10px !important;
  background: #f5f5f5 !important;
  border-radius: 4px !important;
  font-family: 'Courier New', monospace !important;
  font-size: 12px !important;
  line-height: 1.4 !important;
  white-space: pre !important;
  word-break: normal !important;
  word-wrap: normal !important;
  box-sizing: border-box !important;
}

/* 修复块引用 */
:deep(.docx-wrapper > section.docx blockquote) {
  width: 100% !important;
  max-width: 100% !important;
  margin: 10px 0 !important;
  padding: 10px 20px !important;
  background: #f9f9f9 !important;
  border-left: 4px solid #ddd !important;
  font-style: italic !important;
  overflow-wrap: break-word !important;
  box-sizing: border-box !important;
}

/* 特殊处理：确保内部所有元素都有正确的box-sizing */
:deep(.docx-wrapper > section.docx *:not(img)) {
  box-sizing: border-box !important;
}

.keyword-stats {
  margin: 15px 0;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.keyword-stats h4 {
  margin: 0 0 10px 0;
  color: #303133;
  font-size: 14px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: white;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.stat-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 4px rgba(64, 158, 255, 0.1);
}

.stat-item.active {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.stat-item .keyword {
  font-size: 12px;
  color: #606266;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.stat-item .count {
  font-size: 12px;
  font-weight: bold;
  color: #409eff;
  background: #f0f7ff;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 30px;
  text-align: center;
}

/* 多关键字高亮样式 */
:deep(.multiple-keywords .search-highlight.keyword-0) {
  background-color: #ffeb3b !important;
  color: #000 !important;
}

:deep(.multiple-keywords .search-highlight.keyword-1) {
  background-color: #c8e6c9 !important;
  color: #000 !important;
}

:deep(.multiple-keywords .search-highlight.keyword-2) {
  background-color: #bbdefb !important;
  color: #000 !important;
}

:deep(.multiple-keywords .search-highlight.keyword-3) {
  background-color: #ffcdd2 !important;
  color: #000 !important;
}

:deep(.multiple-keywords .search-highlight.keyword-4) {
  background-color: #e1bee7 !important;
  color: #000 !important;
}

/* 当前高亮样式 */
:deep(.current-highlight) {
  box-shadow: 0 0 0 3px rgba(255, 152, 0, 0.5) !important;
  z-index: 10;
  position: relative;
  font-weight: bold !important;
  background-color: #ff9800 !important;
  color: white !important;
}

/* 基础样式保持不变 */
:deep(.search-highlight) {
  padding: 2px 4px !important;
  border-radius: 3px !important;
  font-style: normal !important;
  transition: all 0.3s ease;
}

:deep(.text-file .text-content) {
  font-family: 'Courier New', monospace;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 4px;
}

/* 加载动画 */
:deep(.is-loading) {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
