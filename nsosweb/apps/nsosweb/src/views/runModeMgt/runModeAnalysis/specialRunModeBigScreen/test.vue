<template>
  <div class="excel-previewer">
    <!-- Excel预览区域 -->
    <div v-if="workbook" class="excel-container">


      <!-- Excel表格 -->
      <div class="table-container" ref="tableContainer"
        @wheel="handleWheel"
        @mouseenter="onTableMouseEnter"
        @mouseleave="onTableMouseLeave"
        >
        <div class="table-wrapper" ref="tableWrapper" :style="getTableContainerStyle()">
          <table ref="tableElement">
            <thead>
              <tr>
                <th class="header-corner">#</th>
                <th
                  v-for="(colIndex) in getRenderColumnCount()"
                  :key="colIndex"
                  class="header-cell"
                  :style="getColumnStyle(colIndex)"
                >
                  {{ getColumnName(colIndex) }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, rowIndex) in currentSheetData" :key="rowIndex" v-if="currentSheetData.length>0">
                <td class="row-header" :style="getRowHeaderStyle()">{{ rowIndex + 1 }}</td>
                <td
                  v-for="(_, colIndex) in getRenderColumnCount()" 
                  :key="colIndex"
                  :class="getCellClass(row[colIndex] || { isEmpty: true })"
                  :style="getCellStyle(row[colIndex] || { isEmpty: true }, rowIndex, colIndex)"
                  :rowspan="getRowSpan(row[colIndex] || { isEmpty: true }, rowIndex, colIndex)"
                  :colspan="getColSpan(row[colIndex] || { isEmpty: true }, rowIndex, colIndex)"
                >
                  <div class="cell-content">{{ getCellValue(row[colIndex] || { isEmpty: true }) }}</div>
                </td>
              </tr>
              <tr v-else>
                  <td colspan="100%" style="width: 100%; text-align: center;">
                    <el-empty description="无表格数据" />
                  </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- 工作表信息 -->
      <div class="sheet-info">
        工作表 {{ currentSheetIndex + 1 }} / {{ sheetNames.length }}
        <span class="data-info">
          (共 {{ currentSheetData.length }} 行 × {{ currentSheetData[0] ? currentSheetData[0].length : 0 }} 列)
        </span>
        <div class="zoom-controls" v-if="zoomLevel !== 1 ">
          <button @click="zoomOut" class="zoom-btn" title="缩小 (Ctrl + 滚轮下)" :disabled="zoomLevel <= 0.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13H5v-2h14v2z"/>
            </svg>
          </button>
          <span class="zoom-level">{{ Math.round(zoomLevel * 100) }}%</span>
          <button @click="zoomIn" class="zoom-btn" title="放大 (Ctrl + 滚轮上)" :disabled="zoomLevel >= 2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </button>
          <button @click="resetZoom" class="zoom-reset-btn" title="重置缩放 (Ctrl + 0)">
            重置
          </button>
        </div>
      </div>
      <!-- 工作表标签页 -->
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
      <!-- 表格操作 -->
      <!-- <div class="table-actions">
        <button @click="reloadFile" class="action-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
          </svg>
          重新加载
        </button>
      </div> -->
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>正在加载 Excel 文件...</p>
      <div v-if="loadingProgress" class="loading-progress">
        {{ loadingProgress }}
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="error-container">
      <div class="error-icon">❌</div>
      <p class="error-message">{{ error }}</p>
      <button @click="reloadFile" class="retry-btn">重新加载</button>
    </div>

    <!-- 空状态 -->
    <div v-if="!workbook && !loading && !error" class="empty-state">
      <div class="empty-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="#ccc">
          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
        </svg>
      </div>
      <h3>Excel 文件未加载</h3>
      <p>点击重新加载按钮开始加载文件</p>
      <button @click="reloadFile" class="reload-btn">重新加载文件</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick,computed } from 'vue'
import * as XLSX from 'xlsx'

// 配置
const excelFilePath = '/信息系统并网管理审核标准指南-智能审查关键字.xlsx'

// 响应式数据
const loading = ref(false)
const error = ref('')
const loadingProgress = ref('')
const workbook = ref(null)
const sheetNames = ref([])
const currentSheetIndex = ref(0)
const currentSheetData = ref([])
const currentWorksheet = ref(null)
const mergedCells = ref([]) // 存储合并单元格信息
const columnWidths = ref({})
const columnStyles = ref({})
const currentColumnCount = ref(0) // 存储当前表格的实际列数（用于判断是否补全到10列）

// DOM 引用
const tableContainer = ref(null)
const tableWrapper = ref(null)
const tableElement = ref(null)

// 快捷键缩放
// 缩放相关状态
const zoomLevel = ref(1)
const isZooming = ref(false)
const isCtrlPressed = ref(false)
const isMouseOverTable = ref(false)


// 计算属性
const scaledFontSize = computed(() => 13)
const scaledCellPadding = computed(() => 8)



/**
 * 主加载函数
 */
const loadFile = async () => {
  try {
    loading.value = true
    loadingProgress.value = '开始加载文件...'
    error.value = ''
    
    // 获取Excel文件
    const response = await fetch(excelFilePath)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    loadingProgress.value = '读取文件内容...'
    const blob = await response.blob()
    await loadExcel(blob)
    
  } catch (err) {
    console.error('Excel文件加载失败:', err)
    error.value = `Excel文件加载失败: ${err.message || '未知错误'}`
  } finally {
    loading.value = false
    loadingProgress.value = ''
  }
}

/**
 * 
 * 执行解析Excel
 */
const loadExcel = async (file) => {
  try {
    loadingProgress.value = '解析Excel文件...'
    
    // 读取文件为 ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    
    // 使用 xlsx 库解析 Excel
    const wb = XLSX.read(arrayBuffer, {
      type: 'array',
      cellText: false,
      cellDates: true,
      cellStyles: true, // 启用样式支持
      cellFormula: false
    })
    
    workbook.value = wb
    sheetNames.value = wb.SheetNames
    currentSheetIndex.value = 0
    
    loadingProgress.value = '准备渲染表格...'
    // 切换第一个工作表
    await switchSheet(0)
    
  } catch (err) {
    console.error('Excel文件解析失败:', err)
    error.value = `文件解析失败: ${err.message || '未知错误'}`
    workbook.value = null
  }
}

/**
 * 
 * 切换工作表 
 */
const switchSheet = async (index) => {
  if (!workbook.value || index < 0 || index >= sheetNames.value.length) return
  
  try {
    loading.value = true
    loadingProgress.value = '处理工作表数据...'
    currentSheetIndex.value = index
    
    const sheetName = sheetNames.value[index]
    const worksheet = workbook.value.Sheets[sheetName]
    currentWorksheet.value = worksheet
    
    // 获取合并单元格信息
    mergedCells.value = worksheet['!merges'] || []
    
    // 获取列宽信息
    if (worksheet['!cols']) {
      columnWidths.value = {}
      worksheet['!cols'].forEach((col, colIndex) => {
        if (col && col.width) {
          // Excel中的列宽单位转换为像素
          columnWidths.value[colIndex] = Math.min(col.width * 7 + 5, 300)
        }
      })
    }
    
    // 获取工作表的范围
    const range = worksheet['!ref'] ? XLSX.utils.decode_range(worksheet['!ref']) : null
    if (!range) {
      currentSheetData.value = []
      return
    }
    
    // 限制处理的行数和列数（性能优化）
    const maxRows = Math.min(range.e.r + 1, 2000)
    const maxCols = Math.min(range.e.c + 1, 200)
    
    loadingProgress.value = '转换表格数据...'
    // 转换为 JSON 数据，保留合并单元格信息
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: '',
      raw: true, // 保持原始数据
      dateNF: 'yyyy-mm-dd',
      range: {
        s: { r: 0, c: 0 },
        e: { r: maxRows - 1, c: maxCols - 1 }
      }
    })
    
    loadingProgress.value = '处理单元格格式...'
    // 处理数据格式，包含合并单元格信息
    const processedData = processSheetData(jsonData, maxRows, maxCols)
    currentSheetData.value = processedData
    
    // 计算列样式
    calculateColumnStyles()
    
    // 等待 DOM 更新后调整表格
    await nextTick()
    adjustTableLayout()
    
  } catch (err) {
    console.error('切换工作表失败:', err)
    error.value = `切换工作表失败: ${err.message || '未知错误'}`
  } finally {
    loading.value = false
    loadingProgress.value = ''
  }
}

/**
 * 处理工作表数据，支持复杂xlsx, 合并单元格
 * @param jsonData 
 * @param maxRows 
 * @param maxCols 
 */
const processSheetData = (jsonData, maxRows, maxCols) => {
  const result = []
  
  // 创建合并单元格映射表，方便快速查找
  const mergeMap = new Map()
  mergedCells.value.forEach(merge => {
    for (let r = merge.s.r; r <= merge.e.r; r++) {
      for (let c = merge.s.c; c <= merge.e.c; c++) {
        const key = `${r},${c}`
        mergeMap.set(key, {
          isMerged: true,
          isMainCell: r === merge.s.r && c === merge.s.c,
          mergeRange: merge
        })
      }
    }
  })
  
  for (let rowIndex = 0; rowIndex < Math.min(jsonData.length, maxRows); rowIndex++) {
    const row = jsonData[rowIndex] || []
    const newRow = []
    
    for (let colIndex = 0; colIndex < maxCols; colIndex++) {
      const cellValue = row[colIndex]
      const mergeKey = `${rowIndex},${colIndex}`
      const mergeInfo = mergeMap.get(mergeKey)
      
      // 如果是合并单元格的一部分但不是主单元格，则跳过
      if (mergeInfo && !mergeInfo.isMainCell) {
        newRow.push({
          value: '',
          formattedValue: '',
          type: 'merged',
          isEmpty: true,
          isMergedPart: true,
          mergeRange: mergeInfo.mergeRange
        })
        continue
      }
      
      // 获取单元格样式信息
      const cellRef = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex })
      const xlCell = currentWorksheet.value[cellRef]
      let cellStyle = {}
      
      if (xlCell && xlCell.s) {
        cellStyle = {
          bold: xlCell.s.font && xlCell.s.font.bold,
          italic: xlCell.s.font && xlCell.s.font.italic,
          color: xlCell.s.font && xlCell.s.font.color,
          bgColor: xlCell.s.fill && xlCell.s.fill.fgColor,
          alignment: xlCell.s.alignment,
          border: xlCell.s.border
        }
      }
      
      newRow.push({
        value: cellValue,
        formattedValue: formatCellValue(cellValue),
        type: typeof cellValue === 'number' ? 'number' : 'string',
        isEmpty: cellValue === null || cellValue === undefined || cellValue === '',
        isMerged: mergeInfo ? true : false,
        mergeRange: mergeInfo ? mergeInfo.mergeRange : null,
        style: cellStyle
      })
    }
    
    result.push(newRow)
  }
  
  return result
}

// 格式化单元格值
const formatCellValue = (value) => {
  if (value === null || value === undefined) return ''
  if (typeof value === 'number') {
    // 如果是日期数字（Excel日期格式）
    if (value > 25568 && value < 50000) { // 1970-2099
      const date = new Date((value - 25568) * 86400 * 1000)
      return date.toLocaleDateString()
    }
    // 保留数字格式，不强制转换
    return value
  }
  if (typeof value === 'string') return value.trim()
  if (value instanceof Date) return value.toLocaleDateString()
  return String(value)
}

// 获取表格样式
const getTableStyle = () => {
  return {
    fontSize: `${scaledFontSize.value}px`,
    '--zoom-level': zoomLevel.value
  }
}

// 获取tbody样式
const getTbodyStyle = () => {
  return {
    transform: `scale(${zoomLevel.value})`,
    transformOrigin: '0 0',
    // 调整缩放后的布局
    display: 'block',
    width: '100%',
    // 反向调整高度，避免内容被压缩
    height: zoomLevel.value !== 1 ? `calc(100% / ${zoomLevel.value})` : 'auto'
  }
}

// 获取列样式
const getColumnStyle = (colIndex) => {
  const baseStyle = {
    minWidth: '80px',
    maxWidth: '500px',
    width: 'auto',
    fontSize: `${scaledFontSize.value}px`,
    padding: `${scaledCellPadding.value}px ${scaledCellPadding.value + 4}px`,
    // 标题行适应缩放
    minHeight: `${Math.round(36 * zoomLevel.value)}px`
  }
  
  if (columnStyles.value[colIndex]) {
    const originalStyle = columnStyles.value[colIndex]
    // 调整列宽以适应缩放
    if (originalStyle.width) {
      const originalWidth = parseFloat(originalStyle.width)
      baseStyle.width = `${originalWidth * zoomLevel.value}px`
    }
    if (originalStyle.minWidth) {
      const originalMinWidth = parseFloat(originalStyle.minWidth)
      baseStyle.minWidth = `${originalMinWidth * zoomLevel.value}px`
    }
  }
  
  return baseStyle
}

// 计算列样式
const calculateColumnStyles = () => {
  if (!currentSheetData.value.length) return
  const baseMinCellWidth = 80
  const baseMaxCellWidth = 250
  // 获取需要渲染的总列数（不足10列补到10列）
  const renderCount = getRenderColumnCount()
  const actualCount = currentSheetData.value[0]?.length || 0
  const newStyles = {}
  for (let colIndex = 0; colIndex < renderCount; colIndex++) {
    // 实际列数内的列：按原有逻辑计算宽度
    if (colIndex < actualCount) {
      let maxWidth = baseMinCellWidth 

      // 检查表头
      const headerWidth = getColumnName(colIndex).length * 8 + 20
      maxWidth = Math.max(maxWidth, headerWidth)

      // 检查前50行数据
      const rowsToCheck = Math.min(currentSheetData.value.length, 50)
      for (let rowIndex = 0; rowIndex < rowsToCheck; rowIndex++) {
        const cell = currentSheetData.value[rowIndex][colIndex]
        if (cell && cell.formattedValue) {
          let cellText = String(cell.formattedValue)
          if (cell.isMerged && cell.mergeRange) {
            const colSpan = cell.mergeRange.e.c - cell.mergeRange.s.c + 1
            cellText = cellText.padEnd(cellText.length + colSpan * 3)
          }
          const cellWidth = cellText.length * 16 + 20
          maxWidth = Math.max(maxWidth, cellWidth)
        }
      }

      const finalWidth = Math.min(maxWidth, baseMaxCellWidth)
      newStyles[colIndex] = {
        minWidth: `${finalWidth}px`,
        width: `${finalWidth}px`,
        maxWidth: `${baseMaxCellWidth}px`
      }
    } else {
      // 补全的列（超过实际列数）：使用默认宽度
      newStyles[colIndex] = {
        minWidth: `${baseMinCellWidth}px`,
        width: `${baseMinCellWidth}px`,
        maxWidth: `${baseMaxCellWidth}px`
      }
    }
  }
  columnStyles.value = newStyles
}

const getTableContainerStyle = () => {
  return {
    transform: `scale(${zoomLevel.value})`,
    transformOrigin: '0 0',
    overflow: 'auto',
    minWidth: '100%',
    minHeight: '100%'
  }
}

// 获取行标题样式
const getRowHeaderStyle = () => {
  // return {
  //   fontSize: `${scaledFontSize.value}px`,
  //   padding: `${scaledCellPadding.value}px`,
  //   minWidth: `${40 * zoomLevel.value}px`,   
  //   width: `${40 * zoomLevel.value}px`,     
  //   // 确保行标题在缩放时仍然固定
  //   position: 'sticky',
  //   left: 0,
  //   zIndex: 1,
  //   boxSizing: 'border-box'  
  // }
}

// 获取单元格样式
const getCellStyle = (cell, rowIndex, colIndex) => {
  const styles = {
    minWidth: '60px',
    maxWidth: '250px',
    position: 'relative',
    fontSize: `${scaledFontSize.value}px`,
    padding: `${scaledCellPadding.value}px ${scaledCellPadding.value + 4}px`,
    minHeight: `${Math.round(36 * zoomLevel.value)}px`,
    // 适应缩放后的列宽
    ...getScaledColumnStyle(colIndex)
  }
  
  // 如果是合并单元格的一部分但不是主单元格，隐藏显示
  if (cell.isMergedPart) {
    styles.display = 'none'
  }
  
  // 应用单元格样式
  if (cell.style) {
    if (cell.style.bold) {
      styles.fontWeight = 'bold'
    }
    if (cell.style.italic) {
      styles.fontStyle = 'italic'
    }
    if (cell.style.color && cell.style.color.rgb) {
      styles.color = `#${cell.style.color.rgb}`
    }
    if (cell.style.alignment) {
      if (cell.style.alignment.horizontal) {
        styles.textAlign = cell.style.alignment.horizontal
      }
      if (cell.style.alignment.vertical) {
        styles.verticalAlign = cell.style.alignment.vertical
      }
    }
  }
  
  // 如果是合并单元格的主单元格，应用合并效果
  if (cell.isMerged && cell.mergeRange) {
    const rowSpan = cell.mergeRange.e.r - cell.mergeRange.s.r + 1
    const colSpan = cell.mergeRange.e.c - cell.mergeRange.s.c + 1
    
    if (colSpan > 1) {
      let totalWidth = 0
      for (let c = cell.mergeRange.s.c; c <= cell.mergeRange.e.c; c++) {
        const colStyle = getScaledColumnStyle(c)
        if (colStyle && colStyle.width) {
          const width = parseFloat(colStyle.width)
          totalWidth += width
        } else {
          totalWidth += 60 * zoomLevel.value
        }
      }
      // 减去边框宽度（每列1px）
      totalWidth -= (colSpan - 1) * zoomLevel.value
      styles.width = `${totalWidth}px`
    }
  }
  
  return styles
}

// 获取缩放后的列样式
const getScaledColumnStyle = (colIndex) => {
  const styles = {}
  
  if (columnStyles.value[colIndex]) {
    const originalStyle = columnStyles.value[colIndex]
    // 直接用原始尺寸，不乘 zoomLevel
    styles.width = originalStyle.width
    styles.minWidth = originalStyle.minWidth
    styles.maxWidth = originalStyle.maxWidth
  } else {
    styles.minWidth = '60px'
    styles.width = '80px'
    styles.maxWidth = '250px'
  }
  
  return styles
}



// 获取单元格内容样式
const getCellContentStyle = () => {
  return {
    fontSize: `${scaledFontSize.value}px`,
    lineHeight: 1.4 * zoomLevel.value,
    // 缩放时调整内边距
    padding: `${2 * zoomLevel.value}px 0`
  }
}

// 获取单元格类名
const getCellClass = (cell) => {
  const classes = ['excel-cell']
  
  if (cell.isEmpty) classes.push('empty-cell')
  // if (cell.type === 'number') classes.push('number-cell')
  // if (cell.type === 'date') classes.push('date-cell')
  if (cell.isMerged) classes.push('merged-cell')
  if (cell.isMergedPart) classes.push('merged-part-cell')
  
  return classes.join(' ')
}

// 获取行合并数
const getRowSpan = (cell, rowIndex, colIndex) => {
  // 如果是合并单元格的主单元格，返回行合并数
  if (cell.isMerged && cell.mergeRange) {
    const rowSpan = cell.mergeRange.e.r - cell.mergeRange.s.r + 1
    return rowSpan > 1 ? rowSpan : undefined
  }
  return undefined
}

// 获取列合并数
const getColSpan = (cell, rowIndex, colIndex) => {
  // 如果是合并单元格的主单元格，返回列合并数
  if (cell.isMerged && cell.mergeRange) {
    const colSpan = cell.mergeRange.e.c - cell.mergeRange.s.c + 1
    return colSpan > 1 ? colSpan : undefined
  }
  return undefined
}

// 获取单元格显示值
const getCellValue = (cell) => {
  if (!cell || cell.isEmpty || cell.isMergedPart) return ''
  return cell.formattedValue
}

// 调整表格布局
const adjustTableLayout = () => {
  if (!tableWrapper.value || !tableElement.value || isZooming.value) return
  
  const tableWidth = tableElement.value.scrollWidth
  const containerWidth = tableContainer.value ? tableContainer.value.clientWidth : 0
  
  // 仅在 1倍缩放时调整 minWidth
  if (zoomLevel.value === 1) {
    if (tableWidth > containerWidth) {
      tableWrapper.value.style.minWidth = `${tableWidth}px`
    } else {
      tableWrapper.value.style.minWidth = '100%'
    }
  }
}

// 获取列名（A, B, C...）- 兼容最少20列逻辑
const getColumnName = (index) => {
  let result = ''
  let colIndex = index
  while (colIndex >= 0) {
    result = String.fromCharCode(65 + (colIndex % 26)) + result
    colIndex = Math.floor(colIndex / 26) - 1
  }
  return result
}

// 获取需要渲染的总列数（不足20列则补到20列）
const getRenderColumnCount = () => {
  // currentSheetData[0] 是表头行数据，若无数据则默认10列
  const actualCount = currentSheetData.value[0]?.length || 0
  // 记录实际列数（用于后续单元格渲染判断）
  currentColumnCount.value = actualCount
  // 不足20列则返回20列，否则返回实际列数
  return Math.max(actualCount, 20)
}

// 重新加载文件
const reloadFile = () => {
  loadFile()
}

// 监听窗口大小变化
const handleResize = () => {
  if (workbook.value) {
    adjustTableLayout()
  }
}


/**
 * 增加快捷键实现页面缩放
 */
// 缩放功能
// 放大
const zoomIn = () => {
  if (zoomLevel.value >= 2) return
  
  isZooming.value = true
  zoomLevel.value = Math.min(2, Math.round((zoomLevel.value + 0.1) * 10) / 10)
  
  // 重新计算布局
  nextTick(() => {
    adjustTableLayout()
  })
  
  setTimeout(() => {
    isZooming.value = false
  }, 200)
}

// 缩小
const zoomOut = () => {
  if (zoomLevel.value <= 0.5) return
  
  isZooming.value = true
  zoomLevel.value = Math.max(0.5, Math.round((zoomLevel.value - 0.1) * 10) / 10)
  
  // 重新计算布局
  nextTick(() => {
    adjustTableLayout()
  })
  
  setTimeout(() => {
    isZooming.value = false
  }, 200)
}

// 重置缩放
const resetZoom = () => {
  isZooming.value = true
  zoomLevel.value = 1
  
  // 关键：重置 tableWrapper 的 minWidth 为初始值
  nextTick(() => {
    if (tableWrapper.value) {
      tableWrapper.value.style.minWidth = '100%' // 还原初始值
    }
    adjustTableLayout()
  })
  
  setTimeout(() => {
    isZooming.value = false
  }, 200)
}

// 处理滚轮事件
const handleWheel = (event) => {
  if (!event.ctrlKey && !isCtrlPressed.value) {
    return
  }
  
  event.preventDefault()
  
  if (event.deltaY < 0) {
    zoomIn()
  } else {
    zoomOut()
  }
}

// 鼠标进入表格区域
const onTableMouseEnter = () => {
  isMouseOverTable.value = true
}

// 鼠标离开表格区域
const onTableMouseLeave = () => {
  isMouseOverTable.value = false
}

// 键盘事件监听
const handleKeyDown = (event) => {
  if (event.key === 'Control' || event.key === 'Meta') {
    isCtrlPressed.value = true
  }
  
  if ((event.ctrlKey || event.metaKey) && event.key === '0') {
    event.preventDefault()
    resetZoom()
  }
  
  if ((event.ctrlKey || event.metaKey) && (event.key === '+' || event.key === '=')) {
    event.preventDefault()
    zoomIn()
  }
  
  if ((event.ctrlKey || event.metaKey) && event.key === '-') {
    event.preventDefault()
    zoomOut()
  }
}

const handleKeyUp = (event) => {
  if (event.key === 'Control' || event.key === 'Meta') {
    isCtrlPressed.value = false
  }
}

// 阻止页面缩放
const preventPageZoom = (event) => {
  if (event.ctrlKey && isMouseOverTable.value) {
    event.preventDefault()
  }
}

// 生命周期
onMounted(() => {
  window.addEventListener('resize', handleResize)
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
  window.addEventListener('wheel', preventPageZoom, { passive: false })
  
  loadFile()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
  window.removeEventListener('wheel', preventPageZoom)
})

</script>

<style scoped>
.excel-previewer {
  width: 100%;
  height: 100%;
  padding: 20px;
  background: #f5f7fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 加载状态样式 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: white;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #409eff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

.file-path {
  margin-top: 10px;
  font-size: 12px;
  color: #909399;
  background: #f5f7fa;
  padding: 8px 12px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
}

.loading-progress {
  margin-top: 15px;
  font-size: 14px;
  color: #409eff;
  font-weight: 500;
}

/* 缩放控制样式 */
.zoom-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f5f7fa;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  margin-left: auto;
}

.zoom-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: white;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  color: #606266;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
  padding: 0;
}

.zoom-btn:hover:not(:disabled) {
  background: #409eff;
  color: white;
  border-color: #409eff;
}

.zoom-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.zoom-level {
  font-size: 12px;
  font-weight: 600;
  color: #409eff;
  min-width: 40px;
  text-align: center;
  user-select: none;
}

.zoom-reset-btn {
  padding: 4px 8px;
  background: white;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  color: #606266;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
  margin-left: 8px;
}

.zoom-reset-btn:hover {
  background: #409eff;
  color: white;
  border-color: #409eff;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 错误提示样式 */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: white;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #f56c6c;
  text-align: center;
}

.error-icon {
  font-size: 48px;
  color: #f56c6c;
  margin-bottom: 20px;
}

.error-message {
  color: #f56c6c;
  font-size: 16px;
  margin-bottom: 20px;
  max-width: 600px;
  word-break: break-word;
}

.retry-btn {
  padding: 8px 20px;
  background: #f56c6c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.retry-btn:hover {
  background: #f78989;
}

/* Excel 容器样式 */
.excel-container {
  background: white;
  border-radius: 8px;
  overflow: hidden; /* 拦截普通溢出 */
  contain: paint; /* 关键：拦截合成层（transform）的溢出 */
  position: relative; /* 配合 contain: paint 生效 */
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

/* 工作表标签页样式 */
.sheet-tabs {
  display: flex;
  align-items: center;
  background: #f5f7fa;
  border-bottom: 1px solid #dcdfe6;
  padding: 0 20px;
  overflow-x: auto;
  white-space: nowrap;
}

.sheet-tab {
  padding: 12px 20px;
  cursor: pointer;
  font-size: 14px;
  color: #606266;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
  width: fit-content; 
  text-align: center;
}

.sheet-tab:hover {
  color: #409eff;
  background: rgba(64, 158, 255, 0.1);
}

.sheet-tab.active {
  color: #409eff;
  border-bottom-color: #409eff;
  font-weight: 500;
  background: white;
}

/* 工作表信息样式 */
.sheet-info {
  padding: 12px 20px;
  background: white;
  border-bottom: 1px solid #dcdfe6;
  border-top: 1px solid #dcdfe6;
  font-size: 14px;
  color: #606266;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.data-info {
  font-size: 12px;
  color: #909399;
  margin-left: 8px;
}

.merge-info {
  color: #409eff;
  font-weight: 500;
}

/* 表格容器样式 */
.table-container {
  overflow: auto;
  max-height: 600px;
  min-height: 600px;
  background: white;
  position: relative;
}

.table-wrapper {
  min-width: 100%;
  display: inline-block;
}

table {
  border-collapse: collapse;
  width: 100%;
  font-size: 13px;
  table-layout: auto;
  /* table-layout: fixed; */
  min-width: 100%;
}

th, td {
  border: 1px solid #dcdfe6;
  padding: 8px 12px;
  text-align: left;
  box-sizing: border-box;
  overflow: hidden;
  /* text-overflow: ellipsis; */
  text-overflow: clip;
  white-space: normal;
  word-break: break-word;
  min-width: 60px;
  max-width: 250px;
}

.header-corner {
  background: #f0f0f0;
  font-weight: 600;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 10;
  border-right: 2px solid #dcdfe6;
  border-bottom: 2px solid #dcdfe6;
  width: 60px;
  min-width: 60px;
  text-align: center;
}

.row-header {
  background: #f0f0f0;
  font-weight: 600;
  position: sticky;
  left: 0;
  z-index: 1;
  /* border-right: 2px solid #dcdfe6; */
  box-shadow: inset -1px 0 0 0 #dcdfe6; 
  will-change: transform;
  width: 40px;
  min-width: 40px;
  text-align: center;
}

.header-cell {
  background: #f0f0f0;
  font-weight: 600;
  position: sticky;
  top: 0;
  z-index: 1;
  border-bottom: insert -1px solid #dcdfe6;
  min-width: 60px;
  text-align: center;
  white-space: nowrap;
}

.excel-cell {
  min-height: 36px;
  vertical-align: middle;
  min-width: 60px;
  text-align: center;
  background-color: white;
  transition: background-color 0.2s;
}

.excel-cell:hover {
  background: #f0f7ff;
}

/* 合并单元格样式 */
.merged-cell {
  background-color: white;
  font-weight: 500;
  text-align: center;
}

.merged-cell:hover {
  background-color: #e6f7ff;
}

.merged-part-cell {
  display: none;
  max-width: 250px;
}

/* 单元格内容样式 */
.cell-content {
  padding: 5px ;
  white-space: normal;
  /* overflow: hidden; */
  /* text-overflow: ellipsis; */
  text-overflow: clip;
  max-width: 100%;
  line-height: 1.4;
  /* display: -webkit-box; */
  width: 100%;
  text-align: center;

  /* -webkit-line-clamp: 3; */
  /* -webkit-box-orient: vertical; */
}

/* 特殊单元格类型 */
.empty-cell {
  background-color: white;
}

.number-cell {
  text-align: left;
  font-family: 'Courier New', monospace;
  color: #0066cc;
}

.date-cell {
  color: #009688;
}

/* 表格操作样式 */
.table-actions {
  padding: 16px 20px;
  background: white;
  border-top: 1px solid #dcdfe6;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: white;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  color: #606266;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.action-btn:hover:not(:disabled) {
  background: #409eff;
  color: white;
  border-color: #409eff;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: #f9f9f9;
  border-radius: 8px;
  text-align: center;
  color: #909399;
}

.empty-icon {
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 500;
  color: #606266;
}

.empty-state p {
  margin: 0 0 20px 0;
  font-size: 14px;
}

.reload-btn {
  padding: 10px 24px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.reload-btn:hover {
  background: #66b1ff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .excel-previewer {
    padding: 10px;
  }
  
  .sheet-tabs {
    padding: 0 10px;
  }
  
  .sheet-tab {
    padding: 8px 12px;
    min-width: 80px;
    font-size: 12px;
  }
  
  th, td {
    padding: 6px 8px;
    font-size: 12px;
  }
  
  .table-container {
    max-height: 400px;
  }
  
  .action-btn {
    padding: 6px 12px;
    font-size: 12px;
  }
  
  .cell-content {
    -webkit-line-clamp: 2;
  }
}
</style>
