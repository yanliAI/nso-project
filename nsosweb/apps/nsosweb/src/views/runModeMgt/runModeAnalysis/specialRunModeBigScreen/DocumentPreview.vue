<template>
  <div class="wrap">
    <div v-if="fileType === 'docx'" id="docContainer" style="width: 100%; height: 700px;overflow-y: auto;"></div>
    <iframe v-if="fileType === 'pdf'" src="https://501351981.github.io/vue-office/examples/dist/static/test-files/test.pdf#toolbar=0" style="height: 100%; width: 100%; background: white;"></iframe>
    
    <!-- 使用自定义Excel预览组件 -->
    <div v-if="fileType === 'xlsx'" class="excel-preview-wrapper">
      <div class="excel-preview">
        <div class="preview-content" v-if="workbook">       
          <div class="table-container" ref="tableContainer" @scroll="handleTableScroll">
            <div v-if="currentSheetData && currentSheetData.length > 0" class="table-wrapper" ref="tableWrapper">
              <table ref="tableElement">
                <thead>
                  <tr>
                    <th class="header-corner"></th>
                    <th 
                      v-for="(_, colIndex) in currentSheetData[0]" 
                      :key="colIndex"
                      class="header-cell"
                      :style="getColumnStyle(colIndex)"
                      :class="{ resizing: isResizing && resizeColumnIndex === colIndex }"
                    >
                      <div class="header-content">
                        {{ getColumnName(colIndex) }}
                      </div>
                      <div 
                        class="column-resize-handle"
                        @mousedown="startResize(colIndex, $event)"
                      ></div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <!-- 渲染所有数据行 -->
                  <tr v-for="(row, rowIndex) in currentSheetData" :key="rowIndex">
                    <td class="row-header">{{ rowIndex + 1 }}</td>
                    <td 
                      v-for="(cell, colIndex) in row" 
                      :key="colIndex"
                      :class="getCellClass(cell)"
                      :style="getCellStyle(cell, rowIndex, colIndex)"
                      :rowspan="getRowSpan(cell, rowIndex, colIndex)"
                      :colspan="getColSpan(cell, rowIndex, colIndex)"
                    >
                      <div class="cell-content">
                        {{ formatCellValue(cell) }}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="sheet-controls">
            <div class="sheet-tabs">
              <div 
                v-for="(sheetName, index) in sheetNames" 
                :key="index"
                class="sheet-tab" 
                :class="{ active: currentSheetIndex === index }"
                @click="switchSheet(index)"
              >
                {{ sheetName }}
              </div>
            </div>
            <div class="sheet-info">
              工作表 {{ currentSheetIndex + 1 }} / {{ sheetNames.length }}
              <span class="data-info">
                (共 {{ currentSheetData.length }} 行 × {{ currentSheetData[0] ? currentSheetData[0].length : 0 }} 列)
              </span>
            </div>
          </div>
        </div>
        
        <div v-else class="loading-section">
          <div class="loading-content">
            <div class="loading-spinner"></div>
            <p>正在加载Excel文件...</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 保留原有的vue-office-excel作为备选 -->
    <vue-office-excel 
      v-if="fileType === 'xlsx' && useFallback" 
      :src="pathUrl" 
      style="height: 78vh" 
      @rendered="rendered" 
      @error="handleExcelError" 
      :options="excelOptions"
    >
    </vue-office-excel>
  </div>
</template>

<script setup>
import VueOfficeExcel from '@vue-office/excel'
import { nextTick, onMounted, onUnmounted, reactive, ref, computed } from 'vue'
import { renderAsync } from 'docx-preview'
import * as XLSX from 'xlsx'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import '@vue-office/excel/lib/index.css'

const pathUrl = defineModel('fileUrl')
const fileType = ref('')
const useFallback = ref(false)
const loading = ref(true)

// Excel预览相关数据
const workbook = ref(null)
const sheetNames = ref([])
const currentSheetIndex = ref(0)
const currentSheetData = ref([])
const currentWorksheet = ref(null)
const mergedCells = ref([])
const columnWidths = ref({})
const containerWidth = ref(0)

// DOM引用
const tableContainer = ref(null)
const tableWrapper = ref(null)
const tableElement = ref(null)

// 列宽拖拽相关变量
const isResizing = ref(false)
const resizeColumnIndex = ref(-1)
const startX = ref(0)
const startWidth = ref(0)

// 性能配置
const performanceConfig = {
  maxRows: 5000,
  maxCols: 100,
  maxCells: 100000,
  timeout: 10000
}

// 计算属性
const columnStyles = computed(() => {
  const styles = {}
  const maxCols = currentSheetData.value[0] ? currentSheetData.value[0].length : 0
  
  for (let colIndex = 0; colIndex < maxCols; colIndex++) {
    const width = columnWidths.value[colIndex] || 80
    styles[colIndex] = { 
      minWidth: `${width}px`, 
      width: `${width}px`,
      maxWidth: `${Math.min(width, 500)}px`
    }
  }
  return styles
})

const excelOptions = reactive({
  renderAsHTML: false,
  textSelectable: false,
  showGridLines: false,
  showRowColHeaders: false,
  showFormulaBar: false,
  selectable: false,
  copyable: false,
})

// 生命周期
onMounted(async () => {
  await loadFile()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleResizeMove)
  document.removeEventListener('mouseup', stopResize)
  document.removeEventListener('selectstart', preventSelect)
  window.removeEventListener('resize', handleResize)
})

// 主加载函数
async function loadFile() {
  try {
    await nextTick()
    loading.value = true
    
    const { type } = detectFileType(pathUrl.value)
    fileType.value = type

    if (type === 'docx') {
      await loadDocx(pathUrl.value)
    } else if (type === 'xlsx') {
      await loadExcelOptimized(pathUrl.value)
    } else if (type === 'pdf') {
      loading.value = false
    }
    
  } catch (error) {
    console.error('文件加载失败:', error)
    loading.value = false
    ElMessage.error(`文件加载失败: ${error.message}`)
  }
}

// 优化的Excel加载函数
async function loadExcelOptimized(url) {
  try {
    loading.value = true
    console.log('开始加载Excel文件...')

    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()
    
    // 检查文件大小
    if (arrayBuffer.byteLength > 20 * 1024 * 1024) {
      throw new Error(`文件过大(${(arrayBuffer.byteLength / (1024 * 1024)).toFixed(2)}MB)，建议下载后查看`)
    }

    // 使用简化配置读取
    workbook.value = XLSX.read(arrayBuffer, {
      type: 'array',
      cellText: false,
      cellDates: false,
      cellStyles: false,
      sheetStubs: false
    })
    
    sheetNames.value = workbook.value.SheetNames.slice(0, 10)
    currentSheetIndex.value = 0
    
    await nextTick()
    updateContainerWidth()
    
    // 使用优化的工作表切换
    await optimizedSwitchSheet(0)
    loading.value = false
    
    console.log('Excel文件加载完成')
    
  } catch (error) {
    console.error('Excel加载失败:', error)
    
    if (error.message.includes('文件过大')) {
      ElMessage.warning(error.message)
      provideDownloadOption(url)
    } else if (error.message.includes('超时')) {
      ElMessage.warning('文件处理时间较长，已启用简化模式')
      useFallback.value = true
    } else {
      ElMessage.error('Excel文件加载失败')
      useFallback.value = true
    }
    
    loading.value = false
  }
}

// 性能保护包装器
const withPerformanceGuard = (operationName, operation, timeLimit = 10000) => {
  return async function(...args) {
    const startTime = Date.now()
    console.time(operationName)
    
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`${operationName} 操作超时`))
      }, timeLimit)
    })
    
    try {
      const result = await Promise.race([
        operation(...args),
        timeoutPromise
      ])
      
      const endTime = Date.now()
      console.log(`✅ ${operationName} 完成，耗时: ${endTime - startTime}ms`)
      console.timeEnd(operationName)
      
      return result
    } catch (error) {
      const endTime = Date.now()
      console.error(`❌ ${operationName} 失败，耗时: ${endTime - startTime}ms`, error)
      throw error
    }
  }
}

// 优化的工作表切换
const optimizedSwitchSheet = withPerformanceGuard('切换工作表', async (index) => {
  currentSheetIndex.value = index
  const sheetName = sheetNames.value[index]
  const worksheet = workbook.value.Sheets[sheetName]
  currentWorksheet.value = worksheet
  
  // 限制合并单元格处理
  mergedCells.value = (worksheet['!merges'] || []).slice(0, 1000)
  
  // 优化列宽处理
  if (worksheet['!cols']) {
    columnWidths.value = {}
    worksheet['!cols'].forEach((col, index) => {
      if (col && col.width && index < performanceConfig.maxCols) {
        columnWidths.value[index] = Math.min(col.width * 7 + 5, 300)
      }
    })
  }
  
  // 获取工作表范围，限制处理范围
  const range = worksheet['!ref'] ? XLSX.utils.decode_range(worksheet['!ref']) : { 
    s: { r: 0, c: 0 }, 
    e: { r: performanceConfig.maxRows - 1, c: performanceConfig.maxCols - 1 }
  }
  
  // 限制实际处理范围
  const maxRows = Math.min(range.e.r + 1, performanceConfig.maxRows)
  const maxCols = Math.min(range.e.c + 1, performanceConfig.maxCols)
  
  console.log(`处理范围限制: ${maxRows}行 x ${maxCols}列`)
  
  // 使用更高效的数据转换方式
  const jsonData = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: '',
    blankrows: false,
    raw: true,
    range: { 
      s: { r: 0, c: 0 }, 
      e: { r: maxRows - 1, c: maxCols - 1 } 
    }
  })
  
  // 检查数据量
  checkDataSize(jsonData)
  
  // 优化数据处理
  const processedData = processSheetDataOptimized(jsonData, maxRows, maxCols)
  currentSheetData.value = processedData
  
  // 延迟添加空白列
  setTimeout(() => {
    addEmptyColumnsOptimized(currentSheetData.value[0]?.length || 0)
  }, 100)
  
  await nextTick()
  updateContainerWidth()
  checkHorizontalScroll()
})

// 优化的数据处理
const processSheetDataOptimized = (jsonData, maxRows, maxCols) => {
  const result = []
  let actualMaxCols = 0
  
  // 找到实际有数据的最大列数
  for (let rowIndex = 0; rowIndex < Math.min(jsonData.length, maxRows); rowIndex++) {
    const row = jsonData[rowIndex] || []
    actualMaxCols = Math.max(actualMaxCols, row.length)
  }
  
  // 限制列数
  actualMaxCols = Math.min(actualMaxCols, maxCols)
  
  console.log(`实际数据范围: ${jsonData.length}行 x ${actualMaxCols}列`)
  
  // 处理数据
  for (let rowIndex = 0; rowIndex < Math.min(jsonData.length, maxRows); rowIndex++) {
    const row = jsonData[rowIndex] || []
    const newRow = []
    
    for (let colIndex = 0; colIndex < actualMaxCols; colIndex++) {
      const cellValue = row[colIndex]
      
      // 简化单元格数据结构
      newRow.push({
        value: cellValue,
        formattedValue: formatCellValueOptimized(cellValue),
        type: typeof cellValue === 'number' ? 'n' : 's',
        row: rowIndex,
        col: colIndex,
        isEmpty: !cellValue && cellValue !== 0
      })
    }
    
    result.push(newRow)
  }
  
  return result
}

// 数据量检查
const checkDataSize = (data) => {
  const rowCount = data.length
  const colCount = data[0] ? data[0].length : 0
  const totalCells = rowCount * colCount
  
  console.log(`数据量检查: ${rowCount}行 x ${colCount}列 = ${totalCells}个单元格`)
  
  if (totalCells > performanceConfig.maxCells) {
    throw new Error(`数据量过大(${totalCells}个单元格)，建议下载后查看`)
  }
  
  if (rowCount > 1000) {
    ElMessage.info(`文件包含${rowCount}行数据，渲染可能需要一些时间`)
  }
}

// 优化的空白列添加
const addEmptyColumnsOptimized = (currentColCount) => {
  if (!tableContainer.value || currentColCount === 0) return
  
  const containerWidth = tableContainer.value.clientWidth
  if (containerWidth <= 0) return
  
  // 计算当前表格宽度
  const currentTableWidth = calculateTableWidthSimplified(currentColCount)
  
  if (currentTableWidth < containerWidth) {
    const emptyColumnsNeeded = Math.max(1, Math.floor((containerWidth - currentTableWidth) / 80))
    
    if (emptyColumnsNeeded > 0 && emptyColumnsNeeded < 50) {
      console.log(`添加 ${emptyColumnsNeeded} 个空白列`)
      
      currentSheetData.value = currentSheetData.value.map((row, rowIndex) => {
        const newRow = [...row]
        for (let i = 0; i < emptyColumnsNeeded; i++) {
          const colIndex = currentColCount + i
          newRow.push({
            value: '',
            formattedValue: '',
            type: 's',
            row: rowIndex,
            col: colIndex,
            isEmpty: true
          })
          if (!columnWidths.value[colIndex]) {
            columnWidths.value[colIndex] = 80
          }
        }
        return newRow
      })
    }
  }
  
  nextTick(() => {
    checkHorizontalScroll()
  })
}

// 工具函数
const formatCellValueOptimized = (value) => {
  if (value === null || value === undefined) return ''
  if (typeof value === 'number') return String(value)
  if (typeof value === 'string') return value
  if (value instanceof Date) return value.toLocaleDateString()
  return String(value)
}

const calculateTableWidthSimplified = (colCount) => {
  let totalWidth = 100
  for (let colIndex = 0; colIndex < colCount; colIndex++) {
    totalWidth += columnWidths.value[colIndex] || 80
  }
  return totalWidth
}

// 列宽调整功能
const startResize = (colIndex, event) => {
  isResizing.value = true
  resizeColumnIndex.value = colIndex
  startX.value = event.clientX
  startWidth.value = columnWidths.value[colIndex] || 80
  
  document.body.classList.add('resizing')
  document.addEventListener('mousemove', handleResizeMove)
  document.addEventListener('mouseup', stopResize)
  document.addEventListener('selectstart', preventSelect)
  
  event.preventDefault()
}

const handleResizeMove = (event) => {
  if (!isResizing.value) return
  
  const currentX = event.clientX
  const deltaX = currentX - startX.value
  const newWidth = Math.max(40, startWidth.value + deltaX)
  
  columnWidths.value[resizeColumnIndex.value] = newWidth
  syncMergedColumnsWidth(resizeColumnIndex.value, newWidth)
  columnWidths.value = { ...columnWidths.value }
  
  nextTick(() => {
    checkHorizontalScroll()
  })
}

const stopResize = () => {
  isResizing.value = false
  resizeColumnIndex.value = -1
  document.body.classList.remove('resizing')
  document.removeEventListener('mousemove', handleResizeMove)
  document.removeEventListener('mouseup', stopResize)
  document.removeEventListener('selectstart', preventSelect)
  nextTick(() => {
    checkHorizontalScroll()
  })
}

const syncMergedColumnsWidth = (colIndex, newWidth) => {
  for (const merge of mergedCells.value) {
    if (colIndex >= merge.s.c && colIndex <= merge.e.c) {
      for (let col = merge.s.c; col <= merge.e.c; col++) {
        columnWidths.value[col] = newWidth
      }
      break
    }
  }
}

// 表格滚动处理
const handleTableScroll = (event) => {
  // 这里可以添加滚动处理逻辑，如果需要的话
}

// 其他工具函数
const updateContainerWidth = () => {
  if (tableContainer.value) {
    containerWidth.value = tableContainer.value.clientWidth
  }
}

const handleResize = () => {
  if (fileType.value === 'xlsx' && workbook.value) {
    updateContainerWidth()
    const currentColCount = currentSheetData.value[0] ? currentSheetData.value[0].length : 0
    if (currentColCount > 0) {
      addEmptyColumnsOptimized(currentColCount)
    }
  }
}

const checkHorizontalScroll = () => {
  if (!tableWrapper.value || !tableElement.value) return
  
  const tableWidth = tableElement.value.scrollWidth + 100
  const containerWidth = tableContainer.value ? tableContainer.value.clientWidth : 0
  
  if (tableWidth > containerWidth) {
    tableWrapper.value.style.minWidth = `${tableWidth}px`
    tableWrapper.value.style.width = 'auto'
  } else {
    tableWrapper.value.style.minWidth = '100%'
    tableWrapper.value.style.width = '100%'
  }
}

const preventSelect = (event) => {
  if (isResizing.value) {
    event.preventDefault()
  }
}

const getColumnName = (index) => {
  let result = ''
  while (index >= 0) {
    result = String.fromCharCode(65 + (index % 26)) + result
    index = Math.floor(index / 26) - 1
  }
  return result
}

const getColumnStyle = (colIndex) => {
  const baseStyle = {
    minWidth: '60px',
    width: 'auto',
    whiteSpace: 'nowrap',
    position: 'relative'
  }
  
  if (columnStyles.value[colIndex]) {
    return { ...baseStyle, ...columnStyles.value[colIndex] }
  }
  
  return baseStyle
}

const getCellClass = (cell) => {
  const classes = ['excel-cell']
  if (cell.isEmpty) classes.push('empty-column')
  if (!cell || cell.value === '' || cell.value === null) classes.push('empty-cell')
  if (cell.type === 'n') classes.push('number-cell')
  if (cell.type === 'd') classes.push('date-cell')
  return classes.join(' ')
}

const getCellStyle = (cell, rowIndex, colIndex) => {
  const styles = {
    minWidth: '60px',
    width: 'auto',
    position: 'relative'
  }
  
  if (columnStyles.value[colIndex]) {
    Object.assign(styles, columnStyles.value[colIndex])
  }
  
  if (isInMergeRange(rowIndex, colIndex)) {
    styles.display = 'none'
  }
  
  return styles
}

const isInMergeRange = (rowIndex, colIndex) => {
  for (const merge of mergedCells.value) {
    if (rowIndex >= merge.s.r && rowIndex <= merge.e.r && 
        colIndex >= merge.s.c && colIndex <= merge.e.c) {
      if (rowIndex !== merge.s.r || colIndex !== merge.s.c) {
        return true
      }
    }
  }
  return false
}

const getRowSpan = (cell, rowIndex, colIndex) => {
  for (const merge of mergedCells.value) {
    if (rowIndex === merge.s.r && colIndex === merge.s.c) {
      return merge.e.r - merge.s.r + 1
    }
  }
  return 1
}

const getColSpan = (cell, rowIndex, colIndex) => {
  for (const merge of mergedCells.value) {
    if (rowIndex === merge.s.r && colIndex === merge.s.c) {
      return merge.e.c - merge.s.c + 1
    }
  }
  return 1
}

const formatCellValue = (cell) => {
  if (!cell || cell.value === null || cell.value === undefined) return ''
  if (isInMergeRange(cell.row, cell.col)) return ''
  return cell.formattedValue || String(cell.value || '')
}

// DOCX加载函数
async function loadDocx(url) {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    const container = document.getElementById('docContainer')

    if (container) {
      container.innerHTML = ''
      await renderAsync(blob, container, null, {
        className: 'docx',
        inWrapper: true,
        ignoreWidth: false,
        ignoreHeight: false,
        ignoreFonts: false,
        breakPages: true,
        ignoreLastRenderedPageBreak: false
      })
      fixLineHeight()
    }
    loading.value = false
  } catch (error) {
    console.error('DOCX加载失败:', error)
    loading.value = false
  }
}

const fixLineHeight = () => {
  setTimeout(() => {
    const container = document.getElementById('docContainer')
    if (container) {
      const elements = container.querySelectorAll('p, div, span, li, td')
      elements.forEach((el) => {
        const computedStyle = window.getComputedStyle(el)
        const currentLineHeight = parseFloat(computedStyle.lineHeight)
        const fontSize = parseFloat(computedStyle.fontSize)

        if (currentLineHeight < fontSize * 1.2) {
          el.style.lineHeight = '1.5'
        }
      })
    }
  }, 100)
}

const provideDownloadOption = (url) => {
  const downloadBtn = document.createElement('button')
  downloadBtn.textContent = '下载文件'
  downloadBtn.style.cssText = `
    position: fixed; top: 20px; right: 20px; z-index: 1000;
    padding: 10px 20px; background: #409eff; color: white;
    border: none; border-radius: 4px; cursor: pointer;
  `
  downloadBtn.onclick = () => {
    const a = document.createElement('a')
    a.href = url
    a.download = 'download.xlsx'
    a.click()
  }
  document.body.appendChild(downloadBtn)
}

const rendered = () => {
  loading.value = false
}

const handleExcelError = (errorInfo) => {
  console.error('Excel预览失败:', errorInfo)
  loading.value = false
}

function detectFileType(filename) {
  if (!filename) return { extension: '', type: 'unknown' }
  
  const extension = filename.split('.').pop().toLowerCase()

  const types = {
    jpg: 'image', jpeg: 'image', png: 'image', gif: 'image', bmp: 'image', webp: 'image',
    pdf: 'pdf', doc: 'docx', docx: 'docx', xls: 'xlsx', xlsx: 'xlsx', ppt: 'ppt', pptx: 'ppt',
    txt: 'text', csv: 'text', json: 'text', xml: 'text', zip: 'archive', rar: 'archive',
    '7z': 'archive', tar: 'archive', gz: 'archive', mp3: 'audio', wav: 'audio', ogg: 'audio',
    mp4: 'video', webm: 'video', mov: 'video', avi: 'video'
  }

  return {
    extension,
    type: types[extension] || 'unknown'
  }
}

// 兼容性函数
const switchSheet = optimizedSwitchSheet
</script>

<style scoped>
.wrap {
  width: 100%;
  height: 700px;
  overflow: auto;
}

.excel-preview-wrapper {
  height: 78vh;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.excel-preview {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.preview-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.loading-section {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: #f8f9fa;
}

.loading-content {
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4b6cb7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.sheet-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: #ececec;
  border-bottom: 1px solid #e0e0e0;
  border-top: 1px solid #dbdada;
  flex-wrap: wrap;
  gap: 12px;
}

.sheet-tabs {
  display: flex;
  flex-wrap: wrap;
  max-width: 60%;
  overflow-x: auto;
}

.sheet-tab {
  padding: 6px 12px;
  border: 1px solid #d0d0d0;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
  color: #0f0e0e;
  white-space: nowrap;
}

.sheet-tab:hover {
  background: #f0f0f0;
  border-color: #c0c0c0;
}

.sheet-tab.active {
  background: white;
  color: rgb(9, 135, 36);
  font-weight: 500;
  border-color: rgb(200, 202, 204);
}

.sheet-info {
  font-size: 13px;
  color: #666;
  font-weight: 500;
}

.data-info {
  font-size: 12px;
  color: #999;
}

.table-container {
  flex: 1;
  overflow: auto;
  background: white;
  width: 100%;
  min-height: 200px;
  position: relative;
}

.table-wrapper {
  min-width: fit-content;
  width: auto;
  display: inline-block;
}

table {
  border-collapse: collapse;
  width: auto;
  font-size: 13px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  table-layout: auto;
}

th, td {
  border: 1px solid #e0e0e0;
  padding: 6px 12px;
  text-align: left;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 60px !important;
  width: auto;
}

.excel-cell {
  min-height: 24px;
  vertical-align: middle;
  text-align: left;
  padding: 6px 12px;
  min-width: 60px !important;
  width: auto !important;
}

.empty-column {
  background-color: #f9f9f9 !important;
  border: 1px dashed #ddd !important;
}

.cell-content {
  width: 100%;
  min-width: 0;
  text-align: left;
  white-space: normal !important;
  word-break: break-word !important;
  overflow-wrap: break-word !important;
  hyphens: auto;
  line-height: 1.4;
}

/* 关键修复：标题行固定 */
.header-cell {
  background-color: #ececec !important;
  height: 40px;
  text-align: center;
  font-weight: 600;
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 2px solid #cbcbcbae;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 60px !important;
  width: auto !important;
  position: relative;
  user-select: none;
}

.header-corner {
  background-color: #ececec;
  font-weight: 600;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 2000;
  border-bottom: 2px solid #9b9b9bae;
  border-right: 2px solid #9b9b9bae;
  width: 60px;
  text-align: center;
  white-space: nowrap;
}

/* 行号列固定 */
.row-header {
  background-color: #ececec;
  font-weight: 600;
  position: sticky;
  left: 0;
  z-index: 500;
  border-right: 2px solid #9b9b9bae;
  text-align: center;
  width: auto;
  min-width: 80px !important;
  max-width: 80px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-content {
  padding: 0 12px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.column-resize-handle {
  position: absolute;
  top: 0;
  right: -2px;
  width: 6px;
  height: 100%;
  background-color: transparent;
  cursor: col-resize;
  z-index: 1001;
  transition: background-color 0.2s;
}

.column-resize-handle:hover {
  background-color: #4b6cb7;
}

.header-cell.resizing .column-resize-handle {
  background-color: #4b6cb7;
}

body.resizing {
  cursor: col-resize;
  user-select: none;
}

.empty-cell {
  background-color: #f9f9f9;
}

.number-cell {
  text-align: right;
  font-family: 'Courier New', monospace;
}

.date-cell {
  font-family: 'Segoe UI', sans-serif;
  color: #2c5aa0;
}

tr:hover {
  background-color: #f0f6ff;
}

tr:hover .row-header {
  background-color: #e6f0ff;
}

@media (max-width: 768px) {
  .sheet-controls {
    padding: 12px 16px;
    flex-direction: column;
    align-items: flex-start;
  }
  
  .sheet-tabs {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 8px;
  }
  
  table {
    font-size: 12px;
  }
  
  th, td {
    padding: 4px 8px;
  }
  
  .header-corner,
  .row-header {
    width: 60px;
  }
  
  .cell-content {
    font-size: 12px;
    line-height: 1.3;
  }
  
  .column-resize-handle {
    width: 8px;
  }
  
  .header-cell {
    min-width: 40px !important;
  }
}

.docx > section {
  background: white;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
