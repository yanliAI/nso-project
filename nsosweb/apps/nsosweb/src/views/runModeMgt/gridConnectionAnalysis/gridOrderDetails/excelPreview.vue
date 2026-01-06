<template>
  <div class="wrap">
    <!-- 加载状态 -->
    <div v-if="showLoading" v-loading="loading" element-loading-text="正在加载..." :element-loading-spinner="loadSvg" style="width: 100%; height: 100%">
      <el-empty description="加载Excel文件失败!" style="vertical-align: middle;" />
    </div>
    
    <!-- Excel预览区域 -->
    <div v-if="fileType === 'xlsx'" class="excel-preview-wrapper" :class="{ 'multiple-keywords': searchCompleted }">
      <div class="excel-preview">
        <div class="preview-content" v-if="workbook">
          <div class="table-container" ref="tableContainer" @scroll="handleTableScroll">
            <div v-if="currentSheetData && currentSheetData.length > 0" class="table-wrapper" ref="tableWrapper">
              <!-- 添加key强制刷新表格 -->
              <table ref="tableElement" :key="tableRefreshKey">
                <thead>
                  <tr>
                    <th class="header-corner"></th>
                    <th v-for="(_, colIndex) in currentSheetData[0]" :key="colIndex" class="header-cell" :style="getColumnStyle(colIndex)" :class="{ resizing: isResizing && resizeColumnIndex === colIndex }">
                      <div class="header-content">
                        {{ getColumnName(colIndex) }}
                      </div>
                      <div class="column-resize-handle" @mousedown="startResize(colIndex, $event)"></div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, rowIndex) in currentSheetData" :key="rowIndex">
                    <td class="row-header">{{ rowIndex + 1 }}</td>
                    <td v-for="(cell, colIndex) in row" :key="colIndex" :class="getCellClass(cell)" :style="getCellStyle(cell, rowIndex, colIndex)" :rowspan="getRowSpan(cell, rowIndex, colIndex)" :colspan="getColSpan(cell, rowIndex, colIndex)">
                      <div class="cell-content" v-html="getHighlightedCellValue(cell, rowIndex, colIndex)"></div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="sheet-controls">
            <div class="sheet-tabs">
              <div v-for="(sheetName, index) in sheetNames" :key="index" class="sheet-tab" :class="{ active: currentSheetIndex === index }" @click="switchSheet(index)">
                {{ sheetName }}
              </div>
            </div>
            <div class="sheet-info">
              工作表 {{ currentSheetIndex + 1 }} / {{ sheetNames.length }}
              <span class="data-info"> (共 {{ currentSheetData.length }} 行 × {{ currentSheetData[0] ? currentSheetData[0].length : 0 }} 列) </span>
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
  </div>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, watch, reactive, ref, computed } from 'vue'
import * as XLSX from 'xlsx'
import axios from 'axios'
import { useAccessStore } from '@vben/stores'
import { ElMessage, ElEmpty } from 'element-plus'


// 定义模型
const keywordList = defineModel('keywordList', { default: [] })
const emit = defineEmits(['change']);

// 预览参数
const previewFileData = defineModel('fileData')
const isZipFile = defineModel('isZipFile', { default: false })

const fileType = ref('xlsx')
const showLoading = ref(false)
const loading = ref(false)
const accessStore = useAccessStore()

// 搜索相关状态
const currentKeyword = ref('');
const keywordCounts = reactive({});
const currentMatch = ref(0);
const currentMatchIndex = ref(-1);
const searchResults = reactive({}); // 存储匹配的单元格位置
const searchCompleted = ref(false);

// 存储当前跳转的匹配项信息
const currentJumpMatch = reactive({
  keyword: '',
  row: -1,
  col: -1,
  matchIndex: -1
});

// 新增：表格刷新key，用于强制刷新DOM
const tableRefreshKey = ref(0);

// 加载图标SVG
const loadSvg = `<svg t="1740446666718" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7580" width="48" height="48"><path d="M546.462897 266.292966c-73.410207 0-133.15531-59.727448-133.155311-133.137656C413.307586 59.762759 473.05269 0 546.462897 0c73.410207 0 133.12 59.727448 133.12 133.15531 0 73.410207-59.709793 133.137655-133.12 133.137656z m-283.453794 105.736827c-67.054345 0-121.626483-54.554483-121.626482-121.644138s54.572138-121.644138 121.626482-121.644138a121.767724 121.767724 0 0 1 121.608828 121.644138c0 67.054345-54.554483 121.644138-121.608828 121.644138zM142.547862 647.185655A107.343448 107.343448 0 0 1 35.310345 539.895172a107.343448 107.343448 0 0 1 107.237517-107.237517 107.343448 107.343448 0 0 1 107.219862 107.237517 107.343448 107.343448 0 0 1-107.219862 107.272828z m120.461241 272.595862a91.047724 91.047724 0 0 1-90.941793-90.959448 91.065379 91.065379 0 0 1 90.924138-90.941793 91.065379 91.065379 0 0 1 90.941793 90.941793c0 50.14069-40.783448 90.959448-90.924138 90.959448zM546.462897 1024a79.518897 79.518897 0 0 1-79.448276-79.448276c0-43.820138 35.645793-79.448276 79.448276-79.448276a79.518897 79.518897 0 0 1 79.43062 79.448276c0 43.820138-35.628138 79.448276-79.448276 79.448276z m287.744-134.285241a64.194207 64.194207 0 0 1-64.123587-64.123587 64.194207 64.194207 0 0 1 64.123587-64.123586 64.194207 64.194207 0 0 1 64.123586 64.123586 64.194207 64.194207 0 0 1-64.123586 64.123587z m117.848275-296.695173a52.683034 52.683034 0 0 1-52.612413-52.612414 52.683034 52.683034 0 0 1 52.612413-52.630069 52.70069 52.70069 0 0 1 52.630069 52.612414 52.718345 52.718345 0 0 1-52.630069 52.630069z m-158.667034-338.696827a40.818759 40.818759 0 1 0 81.655172 0.017655 40.818759 40.818759 0 0 0-81.655172 0z" fill="#389BFF" p-id="7581"></path></svg>`

onMounted(() => {
  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
  // loadFile()
  // 监听关键字列表变化
  // watch(() => keywordList.value, (newVal) => {
  //   if (newVal && newVal.length > 0 && workbook.value) {

  //     setTimeout(() => {
  //       startBatchSearch();
  //     }, 300);
  //   }
  // }, { deep: true })
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleResizeMove)
  document.removeEventListener('mouseup', stopResize)
  document.removeEventListener('selectstart', preventSelect)
  window.removeEventListener('resize', handleResize)
})

// 格式化token
function formatToken(token) {
  return token ? `Bearer ${token}` : null
}

watch(previewFileData, async (newVal) => {
  if (!newVal) return
  await nextTick() // 等待 DOM 更新
  if (tableContainer.value) {
    await loadFile()
  }
}, { immediate: true })

// 主加载函数（仅加载Excel）
async function loadFile() {
  try {
    // 重置搜索状态
    resetSearchState();
    
    showLoading.value = true
    loading.value = true
    
    const response = await axios({
      method: 'post',
      responseType: 'blob',
      url: import.meta.env.VITE_NSOSFS + `/ydCommon/previewFile`,
      data: { 
        fileId: previewFileData.value.fileId, 
        idate: previewFileData.value.iDate, 
        oid: previewFileData.value.oid,
        bkUsername: previewFileData.value.bkUsername 
      },
      headers: {
        Authorization: formatToken(accessStore.accessToken)
      }
    })
    // const response = await fetch('/人员权限配置表.xlsx')
    // const blob = await response.blob()
    
    showLoading.value = false
    loading.value = false
    
    // 加载Excel文件
    await loadExcel(response.data)
    
    // 如果有关键字列表，自动开始搜索
    if (keywordList.value && keywordList.value.length > 0) {
      setTimeout(() => {
        startBatchSearch();
      }, 500);
    }
  } catch (error) {
    loading.value = false
    showLoading.value = false
    ElMessage.error('Excel文件加载失败：' + (error.message || '未知错误'))
    console.error('Excel加载失败:', error)
  }
}


// zip文件中的Excel加载函数
async function loadZipFile(fileData) {
  try {
    console.log()
    // 重置搜索状态
    resetSearchState();
    
    showLoading.value = true
    loading.value = true
    
    const response = await axios({
      method: 'post',
      responseType: 'blob',
      url: import.meta.env.VITE_NSOSFS + `/ydCommon/previewZipEntry`,
      data: { 
        fileId: fileData.fileId, 
        idate: fileData.iDate, 
        oid: fileData.oid, 
        entryPath: fileData.entryPath,
        bkUsername: fileData.bkUsername 
      },
      headers: {
        Authorization: formatToken(accessStore.accessToken)
      }
    })
    
    showLoading.value = false
    loading.value = false
    
    // 加载Excel文件
    await loadExcel(response.data)
    
    // 如果有关键字列表，自动开始搜索
    if (keywordList.value && keywordList.value.length > 0) {
      setTimeout(() => {
        startBatchSearch();
      }, 500);
    }
  } catch (error) {
    loading.value = false
    showLoading.value = false
    ElMessage.error('Excel文件加载失败：' + (error.message || '未知错误'))
    console.error('Excel加载失败:', error)
  }
}

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
  maxRows: 1000,
  maxCols: 200,
  maxCells: 100000,
  timeout: 10000
}

// 计算属性 - 列样式
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

// 计算属性 - 当前匹配结果
const currentResults = computed(() => {
  return currentKeyword.value && searchResults[currentKeyword.value] 
    ? searchResults[currentKeyword.value] 
    : [];
});

const hasCurrentResults = computed(() => {
  return currentResults.value && currentResults.value.length > 0;
});

// 加载Excel函数
function loadExcel(file) {
  return new Promise(async function (resolve, reject) {
    try {
      // 检查文件大小
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('文件过大（超过10MB），建议下载后查看')
      }

      if (file.size === 0) {
        throw new Error('Excel文件内容为空')
      }

      // 转换为ArrayBuffer
      const arrayBuffer = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsArrayBuffer(file)
      })

      // 读取Excel
      workbook.value = XLSX.read(arrayBuffer, {
        type: 'array',
        cellText: false,
        cellDates: false,
        cellStyles: false,
        sheetStubs: false
      })

      sheetNames.value = workbook.value.SheetNames
      currentSheetIndex.value = 0

      await nextTick()
      updateContainerWidth()
      await switchSheet(0)

      resolve()
    } catch (error) {
      ElMessage.error(error.message)
      reject(error)
    }
  })
}

// 性能保护包装器
const withPerformanceGuard = (operationName, operation, timeLimit = 10000) => {
  return async function (...args) {
    const startTime = Date.now()
    console.time(operationName)

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`${operationName} 操作超时`))
      }, timeLimit)
    })

    try {
      const result = await Promise.race([operation(...args), timeoutPromise])

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
  const range = worksheet['!ref']
    ? XLSX.utils.decode_range(worksheet['!ref'])
    : {
        s: { r: 0, c: 0 },
        e: { r: performanceConfig.maxRows - 1, c: performanceConfig.maxCols - 1 }
      }

  // 限制实际处理范围
  if(range.e.r + 1 > performanceConfig.maxRows){
    ElMessage.warning(`内容超过${performanceConfig.maxRows}行,限制显示${performanceConfig.maxRows}行数据`,)
  }
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
  // setTimeout(() => {
  //   addEmptyColumnsOptimized(currentSheetData.value[0]?.length || 0)
  // }, 100)

  await nextTick()
  updateContainerWidth()
  checkHorizontalScroll()
  
  // 切换工作表后重新搜索
  if (keywordList.value && keywordList.value.length > 0) {
    setTimeout(() => {
      startBatchSearch();
    }, 300);
  }
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
        isEmpty: !cellValue && cellValue !== 0,
        highlighted: false,
        highlightKeyword: '',
        highlightClass: ''
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
            isEmpty: true,
            highlighted: false,
            highlightKeyword: '',
            highlightClass: ''
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

// 工具函数 - 格式化单元格值
const formatCellValueOptimized = (value) => {
  if (value === null || value === undefined) return ''
  if (typeof value === 'number') return String(value)
  if (typeof value === 'string') return value
  if (value instanceof Date) return value.toLocaleDateString()
  return String(value)
}

// 计算表格宽度
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

// 同步合并列的宽度
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
  // 滚动处理逻辑（如需扩展可在此添加）
}

// 更新容器宽度
const updateContainerWidth = () => {
  if (tableContainer.value) {
    containerWidth.value = tableContainer.value.clientWidth
  }
}

// 窗口大小调整处理
const handleResize = () => {
  updateContainerWidth()
  const currentColCount = currentSheetData.value[0] ? currentSheetData[0].length : 0
  if (currentColCount > 0) {
    addEmptyColumnsOptimized(currentColCount)
  }
}

// 检查水平滚动
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

// 阻止选择文本
const preventSelect = (event) => {
  if (isResizing.value) {
    event.preventDefault()
  }
}

// 获取列名（A, B, C...）
const getColumnName = (index) => {
  let result = ''
  while (index >= 0) {
    result = String.fromCharCode(65 + (index % 26)) + result
    index = Math.floor(index / 26) - 1
  }
  return result
}

// 获取列样式
const getColumnStyle = (colIndex) => {
  const baseStyle = {
    minWidth: '60px',
    width: 'auto',
    whiteSpace: 'nowrap'
  }

  if (columnStyles.value[colIndex]) {
    return { ...baseStyle, ...columnStyles.value[colIndex] }
  }

  return baseStyle
}

// 获取单元格样式类
const getCellClass = (cell) => {
  const classes = ['excel-cell']
  if (cell.isEmpty) classes.push('empty-column')
  if (!cell || cell.value === '' || cell.value === null) classes.push('empty-cell')
  if (cell.type === 'n') classes.push('number-cell')
  if (cell.type === 'd') classes.push('date-cell')
  if (cell.highlighted) {
    classes.push('highlighted-cell', cell.highlightClass)
  }
  return classes.join(' ')
}

// 获取单元格样式
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

// 检查是否在合并范围内
const isInMergeRange = (rowIndex, colIndex) => {
  for (const merge of mergedCells.value) {
    if (rowIndex >= merge.s.r && rowIndex <= merge.e.r && colIndex >= merge.s.c && colIndex <= merge.e.c) {
      if (rowIndex !== merge.s.r || colIndex !== merge.s.c) {
        return true
      }
    }
  }
  return false
}

// 获取行合并数
const getRowSpan = (cell, rowIndex, colIndex) => {
  for (const merge of mergedCells.value) {
    if (rowIndex === merge.s.r && colIndex === merge.s.c) {
      return merge.e.r - merge.s.r + 1
    }
  }
  return 1
}

// 获取列合并数
const getColSpan = (cell, rowIndex, colIndex) => {
  for (const merge of mergedCells.value) {
    if (rowIndex === merge.s.r && colIndex === merge.s.c) {
      return merge.e.c - merge.s.c + 1
    }
  }
  return 1
}

// 获取当前关键字在单元格中的匹配项索引
const getCurrentMatchIndexInCell = (rowIndex, colIndex) => {
  if (!currentKeyword.value || !searchResults[currentKeyword.value]) return -1;
  
  const matches = searchResults[currentKeyword.value];
  const cellMatches = [];
  
  // 收集当前单元格中该关键字的所有匹配项
  for (let i = 0; i < matches.length; i++) {
    if (matches[i].row === rowIndex && matches[i].col === colIndex) {
      cellMatches.push(i);
    }
  }
  
  // 如果当前匹配项索引在单元格匹配项范围内
  if (currentJumpMatch.matchIndex >= 0 && 
      currentJumpMatch.matchIndex < cellMatches.length) {
    return cellMatches[currentJumpMatch.matchIndex];
  }
  
  return -1;
}

// 检查是否是当前跳转的匹配项
const isCurrentJumpMatch = (rowIndex, colIndex) => {
  return (currentJumpMatch.row === rowIndex && 
          currentJumpMatch.col === colIndex && 
          currentJumpMatch.keyword === currentKeyword.value);
};

// 获取高亮后的单元格值
const getHighlightedCellValue = (cell, rowIndex, colIndex) => {
  if (!cell || cell.value === null || cell.value === undefined || isInMergeRange(cell.row, cell.col)) {
    return '';
  }

  let cellValue = cell.formattedValue || String(cell.value || '');
  
  // 如果没有搜索结果，直接返回原值
  if (!searchCompleted.value || !keywordList.value || keywordList.value.length === 0) {
    return cellValue;
  }

  // 对每个关键字进行高亮处理
  keywordList.value.forEach((keyword, index) => {
    if (keyword && keyword.trim() && cellValue.includes(keyword)) {
      const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const reg = new RegExp(`(${escapedKeyword})`, 'gi');
      const classIndex = getKeywordClassIndex(keyword);
      
      // 检查是否是当前跳转的单元格
      const isJumpCell = isCurrentJumpMatch(rowIndex, colIndex);
      const isCurrentKeyword = keyword === currentKeyword.value;
      
      if (isJumpCell && isCurrentKeyword) {
        // 如果是当前跳转的单元格，找到当前匹配项的索引
        const globalMatchIndex = getCurrentMatchIndexInCell(rowIndex, colIndex);
        let matchCount = 0;
        
        // 只对当前跳转的匹配项添加特殊样式
        cellValue = cellValue.replace(reg, (match, p1) => {
          if (matchCount === globalMatchIndex) {
            return `<mark class="search-highlight keyword-${classIndex} current-jump-match">${p1}</mark>`;
          } else {
            return `<mark class="search-highlight keyword-${classIndex}">${p1}</mark>`;
          }
        });
      } else {
        // 其他情况，所有匹配项都使用普通高亮
        cellValue = cellValue.replace(reg, `<mark class="search-highlight keyword-${classIndex}">$1</mark>`);
      }
    }
  });

  return cellValue;
}

// 格式化单元格显示值（备用）
const formatCellValue = (cell) => {
  if (!cell || cell.value === null || cell.value === undefined) return ''
  if (isInMergeRange(cell.row, cell.col)) return ''
  return cell.formattedValue || String(cell.value || '')
}

// 切换工作表方法（对外暴露）
const switchSheet = optimizedSwitchSheet

// 搜索相关方法
// 获取关键字的匹配数量
const getMatchCount = (keyword) => {
  if (keyword && searchResults[keyword]) {
    return searchResults[keyword].length;
  }
  return 0;
};

// 获取关键字对应的CSS类名索引
const getKeywordClassIndex = (keyword) => {
  if (!keyword || !keywordList.value) return 0;
  const index = keywordList.value.indexOf(keyword);
  return index !== -1 ? index : 0;
};

// 更新关键词统计
const updateKeywordCounts = () => {
  console.log('开始更新关键词统计');
  console.log('当前关键字列表:', keywordList.value);
  console.log('当前搜索结果:', searchResults);
  
  // 清空之前的统计
  Object.keys(keywordCounts).forEach(key => {
    delete keywordCounts[key];
  });
  
  // 重新统计
  if (keywordList.value && keywordList.value.length > 0) {
    keywordList.value.forEach((keyword) => {
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
};

// 重置搜索状态
const resetSearchState = () => {
  Object.keys(keywordCounts).forEach(key => delete keywordCounts[key]);
  Object.keys(searchResults).forEach(key => delete searchResults[key]);
  currentKeyword.value = '';
  currentMatch.value = 0;
  currentMatchIndex.value = -1;
  searchCompleted.value = false;
  currentJumpMatch.keyword = '';
  currentJumpMatch.row = -1;
  currentJumpMatch.col = -1;
  currentJumpMatch.matchIndex = -1;
  
  // 重置单元格高亮状态
  if (currentSheetData.value.length > 0) {
    currentSheetData.value.forEach(row => {
      row.forEach(cell => {
        if (cell) {
          cell.highlighted = false;
          cell.highlightKeyword = '';
          cell.highlightClass = '';
        }
      });
    });
  }
};

// 开始批量搜索
const startBatchSearch = () => {
  if (!keywordList.value || keywordList.value.length === 0) {
    ElMessage.warning('关键字列表为空');
    return;
  }
  
  if (!workbook.value || currentSheetData.value.length === 0) {
    ElMessage.warning('暂无Excel数据可搜索');
    return;
  }
  
  performBatchSearch();
};

// 执行批量搜索
const performBatchSearch = () => {
  // 重置搜索结果
  Object.keys(searchResults).forEach(key => delete searchResults[key]);
  resetSearchState();
  
  console.log('开始执行批量搜索，关键字列表:', keywordList.value);
  
  // 遍历每个关键字
  keywordList.value.forEach((keyword, index) => {
    if (!keyword || !keyword.trim()) return;
    
    const keywordResults = [];
    const escapedKeyword = keyword.toLowerCase();
    const classIndex = getKeywordClassIndex(keyword);
    
    // 遍历所有单元格
    currentSheetData.value.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell && !cell.isEmpty && !isInMergeRange(rowIndex, colIndex)) {
          const cellValue = (cell.formattedValue || String(cell.value || '')).toLowerCase();
          
          // 检查是否包含关键字
          if (cellValue.includes(escapedKeyword)) {
            // 标记单元格高亮状态
            cell.highlighted = true;
            cell.highlightKeyword = keyword;
            cell.highlightClass = `keyword-${classIndex}`;
            
            // 添加到搜索结果
            keywordResults.push({
              row: rowIndex,
              col: colIndex,
              cell: cell,
              value: cell.formattedValue || String(cell.value || '')
            });
          }
        }
      });
    });
    
    // 保存搜索结果
    searchResults[keyword] = keywordResults;
    console.log(`关键字 "${keyword}" 找到 ${keywordResults.length} 个匹配项`);
  });
  
  searchCompleted.value = true;
  
  // 更新关键词统计
  updateKeywordCounts();
  
  // 默认选择第一个有关键字匹配的结果
  if (keywordList.value && keywordList.value.length > 0) {
    const firstKeywordWithResults = keywordList.value.find(keyword => 
      searchResults[keyword] && searchResults[keyword].length > 0
    );
    
    if (firstKeywordWithResults) {
      switchToKeyword(firstKeywordWithResults);
    } else {
      // ElMessage.info('没有找到任何关键字的匹配内容');
    }
  }
};

// 切换到指定关键字
const switchToKeyword = (keyword) => {
  console.log('切换到关键字:', keyword);
  currentKeyword.value = keyword;
  currentMatch.value = 1; // 从1开始计数
  
  // 重置跳转匹配信息
  currentJumpMatch.keyword = keyword;
  currentJumpMatch.row = -1;
  currentJumpMatch.col = -1;
  currentJumpMatch.matchIndex = 0;
  
  // 触发事件
  triggerChangeEvent();
  highlightCurrentMatch();
};

// 高亮当前匹配项
const highlightCurrentMatch = async () => {
  if (!currentKeyword.value || !hasCurrentResults.value || currentResults.value.length === 0) return;
  
  console.log('高亮当前匹配项，当前关键字:', currentKeyword.value, '结果数量:', currentResults.value.length);
  
  // 获取当前匹配单元格
  const currentMatchCell = currentResults.value[currentJumpMatch.matchIndex];
  if (currentMatchCell) {
    console.log('找到当前匹配元素:', currentMatchCell);
    
    // 记录当前跳转的匹配项信息
    currentJumpMatch.row = currentMatchCell.row;
    currentJumpMatch.col = currentMatchCell.col;
    currentMatchIndex.value = currentJumpMatch.matchIndex;
    
    // 强制更新单元格并刷新DOM
    forceUpdateCell(currentMatchCell.row, currentMatchCell.col);
    
    // 强制刷新表格DOM
    tableRefreshKey.value += 1;
    
    // 等待DOM更新完成后再滚动
    await nextTick();
    
    // 滚动到当前匹配项
    scrollToCell(currentMatchCell.row, currentMatchCell.col);
  } else {
    console.log('未找到匹配元素');
  }
};

// 强制更新指定单元格
const forceUpdateCell = (row, col) => {
  // 通过修改数据来触发响应式更新
  if (currentSheetData.value[row] && currentSheetData.value[row][col]) {
    // 创建一个新对象来触发更新
    const cell = currentSheetData.value[row][col];
    currentSheetData.value[row][col] = { ...cell };
    
    // 同时更新整个行的引用，确保触发更新
    currentSheetData.value[row] = [...currentSheetData.value[row]];
  }
  
  // 更新整个数据引用
  currentSheetData.value = [...currentSheetData.value];
};

// 上一个匹配项
const prevMatch = async () => {
  if (hasCurrentResults.value && currentJumpMatch.matchIndex > 0) {
    // 清除前一个单元格的高亮
    const previousRow = currentJumpMatch.row;
    const previousCol = currentJumpMatch.col;
    if (previousRow >= 0 && previousCol >= 0) {
      forceUpdateCell(previousRow, previousCol);
    }
    
    currentJumpMatch.matchIndex--;
    currentMatchIndex.value = currentJumpMatch.matchIndex;
    currentMatch.value = currentJumpMatch.matchIndex + 1; // 更新当前匹配序号
    
    await highlightCurrentMatch();
    
    // 触发事件
    triggerChangeEvent();
  } else if (hasCurrentResults.value && currentJumpMatch.matchIndex === 0) {
    // 循环到最后一个
    const previousRow = currentJumpMatch.row;
    const previousCol = currentJumpMatch.col;
    if (previousRow >= 0 && previousCol >= 0) {
      forceUpdateCell(previousRow, previousCol);
    }
    
    currentJumpMatch.matchIndex = currentResults.value.length - 1;
    currentMatchIndex.value = currentJumpMatch.matchIndex;
    currentMatch.value = currentResults.value.length;
    
    await highlightCurrentMatch();
    triggerChangeEvent();
  }
};

// 下一个匹配项
const nextMatch = async () => {
  if (hasCurrentResults.value && currentJumpMatch.matchIndex < currentResults.value.length - 1) {
    // 清除前一个单元格的高亮
    const previousRow = currentJumpMatch.row;
    const previousCol = currentJumpMatch.col;
    if (previousRow >= 0 && previousCol >= 0) {
      forceUpdateCell(previousRow, previousCol);
    }
    
    currentJumpMatch.matchIndex++;
    currentMatchIndex.value = currentJumpMatch.matchIndex;
    currentMatch.value = currentJumpMatch.matchIndex + 1; // 更新当前匹配序号
    
    await highlightCurrentMatch();
    
    // 触发事件
    triggerChangeEvent();
  } else if (hasCurrentResults.value && currentJumpMatch.matchIndex === currentResults.value.length - 1) {
    // 循环到第一个
    const previousRow = currentJumpMatch.row;
    const previousCol = currentJumpMatch.col;
    if (previousRow >= 0 && previousCol >= 0) {
      forceUpdateCell(previousRow, previousCol);
    }
    
    currentJumpMatch.matchIndex = 0;
    currentMatchIndex.value = 0;
    currentMatch.value = 1;
    
    await highlightCurrentMatch();
    triggerChangeEvent();
  }
};

// 滚动到指定单元格
const scrollToCell = (rowIndex, colIndex) => {
  if (!tableContainer.value || !tableElement.value) return;
  
  // 等待DOM更新完成
  nextTick(() => {
    // 找到对应的单元格元素
    const cellElements = tableElement.value?.querySelectorAll(`tbody tr:nth-child(${rowIndex + 1}) td`);
    if (cellElements && cellElements[colIndex + 1]) { // +1 因为第一列是行号
      const cellElement = cellElements[colIndex + 1];
      cellElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest"
      });
      
      // 额外添加高亮闪烁效果
      cellElement.classList.add('flash-highlight');
      setTimeout(() => {
        cellElement.classList.remove('flash-highlight');
      }, 1000);
    }
  });
};

// 清除所有高亮
const clearAllHighlights = () => {
  resetSearchState();
  // 重置刷新key
  tableRefreshKey.value = 0;
  triggerChangeEvent();
};

// 暴露方法供外部调用
defineExpose({
  loadZipFile,
  switchSheet,
  loadFile,
  startBatchSearch,
  clearAllHighlights,
  switchToKeyword,
  prevMatch,
  nextMatch
})
</script>

<style scoped>
.wrap {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.excel-preview-wrapper {
  height: 100%;
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
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
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
  padding-top: 10px;
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
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

th,
td {
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
  transition: all 0.3s ease;
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

/* 标题行固定 */
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
  user-select: none;
}

.header-corner {
  background-color: #ececec;
  font-weight: 600;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 2000;
  border-bottom: 2px solid #dcd9d9;
  border-right: 2px solid #dcd9d9;
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

/* 关键字高亮样式 */
:deep(.multiple-keywords .search-highlight.keyword-0) {
  background-color: #ffeb3b !important;
  color: #000 !important;
  padding: 1px 3px !important;
  border-radius: 2px !important;
  position: relative;
}

:deep(.multiple-keywords .search-highlight.keyword-1) {
  background-color: #c8e6c9 !important;
  color: #000 !important;
  padding: 1px 3px !important;
  border-radius: 2px !important;
  position: relative;
}

:deep(.multiple-keywords .search-highlight.keyword-2) {
  background-color: #bbdefb !important;
  color: #000 !important;
  padding: 1px 3px !important;
  border-radius: 2px !important;
  position: relative;
}

:deep(.multiple-keywords .search-highlight.keyword-3) {
  background-color: #ffcdd2 !important;
  color: #000 !important;
  padding: 1px 3px !important;
  border-radius: 2px !important;
  position: relative;
}

:deep(.multiple-keywords .search-highlight.keyword-4) {
  background-color: #e1bee7 !important;
  color: #000 !important;
  padding: 1px 3px !important;
  border-radius: 2px !important;
  position: relative;
}

/* 当前跳转匹配项样式 */
:deep(.multiple-keywords .search-highlight.current-jump-match) {
  position: relative;
  z-index: 10;
  animation: jump-match-border 1.5s infinite;
  box-shadow: 0 0 0 2px rgba(255, 87, 34, 0.8) !important;
  color: red !important;
  border-radius: 3px;
  display: inline-block;
  margin: -1px;
  padding: 1px 3px !important;
  line-height: 1.2;
  transform: translateZ(0);
}

/* 高亮单元格样式 */
:deep(.highlighted-cell) {
  background-color: rgba(255, 235, 59, 0.1) !important;
}

/* 跳转匹配项边框动画 */
@keyframes jump-match-border {
  0% { 
    box-shadow: 0 0 0 0 rgba(255, 87, 34, 0.8), 0 0 0 0 rgba(255, 87, 34, 0.8) !important;
  }
  70% { 
    box-shadow: 0 0 0 4px rgba(255, 87, 34, 0), 0 0 0 4px rgba(255, 87, 34, 0) !important;
  }
  100% { 
    box-shadow: 0 0 0 0 rgba(255, 87, 34, 0), 0 0 0 0 rgba(255, 87, 34, 0) !important;
  }
}

/* 新增：闪烁高亮效果 */
:deep(.flash-highlight) {
  animation: flash 1s ease;
}

@keyframes flash {
  0% { background-color: rgba(255, 255, 0, 0.3); }
  50% { background-color: rgba(255, 255, 0, 0.6); }
  100% { background-color: transparent; }
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

  th,
  td {
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
</style>
