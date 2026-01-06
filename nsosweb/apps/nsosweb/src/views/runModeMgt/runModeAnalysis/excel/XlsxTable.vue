<script setup lang='ts'>
import { computed, nextTick, onMounted, ref, watch, onUnmounted } from 'vue'
import { HotTable } from '@handsontable/vue3'
// 导入Handsontable语言包和样式（确保样式完整）
import Handsontable from 'handsontable'
import 'handsontable/dist/handsontable.full.css' // 新增：导入完整样式，避免布局错乱
// 导入Worker相关
import { cellKey } from './util'
import type { SheetDefinition, SheetModel } from './worker/type'
import { ExcelJsWorker, SheetJsWorker } from './worker'
import './render'
import { useWorker } from './useWorker'

// 定义props，支持本地文件和外部数据
const props = defineProps<{
  data?: ArrayBuffer, // 可选，支持本地文件加载
  type: string // 外部传入的文件类型（xml/binary）
}>()

// 响应式数据：使用props.type初始化，而非硬编码
const fileType = ref(props.type)
const table = ref<typeof HotTable | null>(null)
const sheets = ref<SheetDefinition[]>([]) // 存储所有sheet
const sheetIndex = ref(0)
const currentData = ref<ArrayBuffer | null>(null) // 存储本地文件的ArrayBuffer
const loading = ref(true) // 手动管理loading状态，替代useWorker的loading（避免状态不一致）

// 虚拟滚动相关配置（针对Handsontable）
const viewportOffset = ref(5) // 可视区域外额外渲染的单元格数量（平衡流畅度和性能）

let sheetData: undefined | SheetModel

// 修复：表格设置改为computed，确保依赖变化时更新
const hotSettings = computed(() => ({
  language: 'zh-CN',
  theme: 'modern', // 解决主题弃用警告
  colHeaders: true,
  rowHeaders: true,
  autoRowSize: false,
  autoColumnSize: false,
  height: '100%',
  width: '100%', // 新增：设置宽度，避免布局错乱
  manualColumnResize: true, // 保留列宽拖动功能
  // // ========== 核心：开启单元格虚拟滚动 ==========
  // // 列虚拟滚动：只渲染可视区域+offset列
  // viewportColumnRenderingOffset: viewportOffset.value,
  // // 行虚拟滚动：只渲染可视区域+offset行
  // viewportRowRenderingOffset: viewportOffset.value,
  // // 可选：限制最大渲染的行列数（进一步优化）
  // maxVisibleRows: 100,
  // maxVisibleColumns: 50,
  // renderAllRows: false, // 关键：关闭全量渲染，启用虚拟滚动
  // =============================================
  // 核心：渲染单元格样式
  cells(row: number, column: number) {
    const props = sheetData?.cell
    if (props && Object.keys(props).length) {
      return props[cellKey(row, column)] || {} // 读取Worker解析的样式
    }
    return {}
  },
  columns(index: number) {
    const value = sheetData?.columns
    return value?.length ? value[index] : {}
  },
  colWidths(index: number) {
    const value = sheetData?.colWidths
    if (typeof value === 'number') {
      return value
    }
    // 新增：添加默认值，避免undefined
    return value && value[index] || sheetData?.defaults.colWidth || 100
  },
  rowHeights(index: number) {
    const value = sheetData?.rowHeights
    if (typeof value === 'number') {
      return value
    }
    // 新增：添加默认值，避免undefined
    return value && value[index] || sheetData?.defaults.rowHeight || 30
  },
  outsideClickDeselects: false,
  licenseKey: 'non-commercial-and-evaluation'
}))

const tableInstance = computed(() => table.value?.hotInstance)

// 组合后的Worker工厂
const compositeWorkerFactory = () => {
  return fileType.value === 'binary' ? SheetJsWorker.create() : ExcelJsWorker.create()
}

// 使用Worker：移除原有的loading，改用手动管理的loading
const { worker, onWorkerEvent, cleanup } = useWorker(compositeWorkerFactory)

// 切换sheet
const handleSheet = (index: number) => {
  if (sheetIndex.value !== index) {
    loading.value = true // 切换sheet时显示加载状态
    sheetIndex.value = index
    worker.emit('parseSheet', { sheet: sheetIndex.value ?? sheets.value[0].id })
  }
}

// 更新表格（修复：移除不存在的refreshViewport，使用正确的刷新方法）
const updateTable = () => nextTick(() => {
  setTimeout(() => {
    if (sheetData && tableInstance.value) {
      // 先更新数据和合并单元格
      tableInstance.value.updateSettings({
        data: sheetData.data,
        mergeCells: sheetData.merge || [] // 新增：处理mergeCells为undefined的情况
      })
      // 正确的刷新逻辑：先刷新维度，再渲染（支持虚拟滚动刷新）
      tableInstance.value.refreshDimensions()
      tableInstance.value.render()
    }
    loading.value = false // 关闭加载状态
  }, 0)
})

// 处理工作表列表
onWorkerEvent('sheets', ({ sheets: list }) => {
  sheets.value = list // 存储所有sheet（可能数量极大）
  if (list.length) {
    const [{ id: firstSheet }] = list
    sheetIndex.value = firstSheet
    worker.emit('parseSheet', { sheet: sheetIndex.value })
  }
})

// 处理单个工作表解析结果（包含样式）
onWorkerEvent('parseSheet', ({ sheetData: ws }) => {
  sheetData = ws
  updateTable()
})

// 监听外部数据变化（恢复并优化）
watch(() => props.data, (newData) => {
  if (newData) {
    loading.value = true
    currentData.value = newData
    worker.emit('parseWorkbook', { workbook: newData })
  }
}, { immediate: true })

// 加载本地Excel文件
const loadLocalExcel = async () => {
  try {
    loading.value = true
    const localExcelPath = '/信息系统并网管理审核标准指南-智能审查关键字.xlsx'
    const name = '信息系统并网管理审核标准指南-智能审查关键字.xlsx'
    const extension = name.split(".").pop()?.toLowerCase()
    // 修复：使用props.type优先，其次根据扩展名判断
    if (extension === "xlsx") {
      fileType.value = props.type || "xml"
    } else {
      fileType.value = props.type || "binary"
    }

    const response = await fetch(localExcelPath)
    if (!response.ok) {
      throw new Error(`加载本地文件失败：${response.statusText}`)
    }
    const buffer = await response.arrayBuffer()
    currentData.value = buffer
    worker.emit('parseWorkbook', { workbook: buffer })
  } catch (error) {
    console.error('加载本地Excel文件出错：', error)
    alert(`加载文件失败：${(error as Error).message}`)
    loading.value = false // 出错时关闭加载状态
  }
}

// 挂载完成
onMounted(() => {
  // 优先使用外部数据，否则加载本地文件
  if (!props.data) {
    loadLocalExcel()
  }
})

// 组件卸载时清理Worker
onUnmounted(() => {
  cleanup()
})
</script>

<template>
  <div class='excel-wrapper'>
    <div class='loading' v-if='loading'>
      <img class='lg' src='./xlsx.png' alt='xlsx' />
      <img class='sm' src='./loading.gif' alt='loading' />
      加载中，请耐心等待...
    </div>
    <div class='table-wrapper'>
      <hot-table ref='table' :settings='hotSettings' />
    </div>
    <!-- Sheet列表虚拟滚动（针对大量sheet） -->
    <div class='sheet-virtual-list'>
      <div class='btn-group' style='overflow-x: auto; white-space: nowrap;'>
        <button
          v-for='sheet in sheets'
          :key='sheet.id'
          style='padding: 0 30px; display: inline-block;'
          :class='{active: sheetIndex === sheet.id}'
          @click='handleSheet(sheet.id)'
        >
          {{ sheet.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<style>
.handsontable {
  font-size: 13px;
  color: #222;
}
/* 优化虚拟滚动的滚动条样式 */
.handsontable .htViewport {
  overflow: auto;
}
</style>
<style scoped>
.excel-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex; /* 新增：使用flex布局，避免高度计算问题 */
  flex-direction: column;
}

.excel-wrapper img {
  height: auto;
  display: block;
}

.excel-wrapper img.lg {
  width: 200px;
  margin: 20px auto;
}

.excel-wrapper img.sm {
  width: 80px;
  margin: 2px auto;
}

.table-wrapper {
  position: relative;
  width: 100%;
  flex: 1; /* 修复：使用flex:1替代固定高度，适配不同屏幕 */
  min-height: 200px;
}

.loading {
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  text-align: center;
  justify-content: center;
  flex-direction: column;
  margin: 0 auto;
  width: 100%;
  height: 100%;
  background: white;
  font-size: 18px;
  font-weight: bold;
  z-index: 999;
  color: #0c9d0c;
}

/* Sheet列表样式（支持横向滚动） */
.sheet-virtual-list {
  height: 50px;
  overflow: hidden;
  flex-shrink: 0; /* 新增：固定高度，不被flex压缩 */
}

.btn-group {
  height: 100%;
  line-height: 50px;
  border-bottom: 1px solid grey;
  background-color: lightgray;
  white-space: nowrap; /* 禁止换行 */
  overflow-x: auto; /* 横向滚动 */
  overflow-y: hidden;
  scrollbar-width: thin; /* 优化滚动条 */
}

.btn-group button {
  outline: 0;
  border: 0;
  border-radius: 5px;
  color: #0c9d0c;
  margin: 0 5px;
  background: transparent;
  cursor: pointer;
  transition: background 0.2s; /* 新增：过渡效果，提升体验 */
  padding: 0 20px; /* 新增：内边距，扩大点击区域 */
}

.btn-group button:hover {
  background: rgba(12, 157, 12, 0.1); /* 新增：hover效果 */
}

.btn-group button.active {
  background: #0c9d0c;
  color: white;
}

/* 优化滚动条样式 */
.btn-group::-webkit-scrollbar {
  height: 4px;
}

.btn-group::-webkit-scrollbar-thumb {
  background: #0c9d0c;
  border-radius: 2px;
}
</style>