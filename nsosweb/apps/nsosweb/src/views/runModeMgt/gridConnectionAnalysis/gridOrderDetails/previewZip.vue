<template>
  <div>
    <el-card shadow="never" style="width: 100%">
      <el-row style="width: 100%" v-loading="loading" element-loading-text="压缩包解析中...">
        <el-col :span="6" style="height: 720px; background-color: #f5f5f5; border-right: 1px solid #e4e4e7; padding-top: 60px">
          <div style="position: absolute; top: 0; padding: 15px; font-size: 18px; width: 25%; font-weight: 450; border-bottom: 1px solid rgb(228, 224, 224)">文件列表</div>
          <div style="height: 650px; overflow-y: auto">
            <div v-for="(item, index) in fileList" class="item">
              <div class="file-item" :class="{ active: item.fileName === clickFileName }" @click="handleFileClick(item)" :title="item.fileName">{{ item.fileName }}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="18">
          <div class="file-title">{{ clickFileName }}</div>

          <el-row>
            <el-col :span="24" style="height: 680px;"> 
              <FilePreview ref="filePreviewRef1" :fileData="previewFileData" isZipFile="true"></FilePreview>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import { ElTable, ElTableColumn, ElRow, ElAutocomplete, ElCard, ElCol, ElFormItem, ElForm, ElInput, ElButton, ElSelect, ElOption, ElContainer, ElAside, ElHeader, ElMain, ElFooter, ElDialog, ElMessage, ElMessageBox, ElText, ElLink, ElCollapse, ElCollapseItem, ElTag } from 'element-plus'
import { Search, Download, Monitor, Operation, Document, Back, CircleCheck, ArrowLeftBold, ArrowRightBold } from '@element-plus/icons-vue'
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
import { previewZipFileApi, getZipFilesApi, reviewGridZipFileApi } from '#/api'
import { downloadFile } from '#/utils/download.ts'
import FilePreview from './filePreview.vue'
import PdfPreview from './pdfPreview.vue'
import WordPreview from './wordPreview.vue'
import ExcelPreview from './excelPreview.vue'

const previewFileData = defineModel('fileData')
const keyword = defineModel('keyword')
const docChapters = defineModel('docChapters')
const isZipPreview =defineModel('isZipPreview')
const fileList = ref([]) // 文件列表
const clickFileName = ref('') //当前激活的文件名
const activeIndex = ref(0) // 当前激活的文件索引
const reviewItemResult = ref([])
const reviewDocChapters = ref([])
const currentFileName = ref('')
const loading = ref(false)

const filePreviewRef = ref(null)
const filePreviewRef1 = ref(null)
const FileParam = ref(previewFileData.value)

// 文件预览/定位相关
const fileType = ref('') // 文件类型
const keywordList = ref([]) //查询关键词
const pdfRef = ref(null) // pdf容器
const wordRef = ref(null)
const excelRef =ref(null)

// 新增：接收子组件同步的参数
const childKeywordCounts = ref({}) // 子组件关键词统计
const childCurrentKeyword = ref('') // 子组件当前选中关键词
const childCurrentMatch = ref(0)

onMounted(() => {
  getZipFiles()
})

function updateFindMatch(val){
  childKeywordCounts.value = val.KeywordCounts;
  childCurrentKeyword.value = val.CurrentKeyword;
  childCurrentMatch.value = val.CurrentMatch

}

/**
 * 请求zip解析文件列表
 */

async function getZipFiles() {
  try {
    loading.value = true
    const res = await getZipFilesApi({
      fileId: previewFileData.value.fileId,
      idate: previewFileData.value.iDate,
      oid: previewFileData.value.oid,
      bkUsername:previewFileData.value.bkUsername
    })
    loading.value = false
    fileList.value = res.fileList
    if (fileList.value.length > 0) {
      handleFileClick(fileList.value[0], 0)
    }
  } catch (error) {
    loading.value = false
  }
}

/**
 * 处理文件点击事件
 */
async function handleFileClick(item, index = null) {
  // 1. 文件关键词匹配
  clickFileName.value = item.fileName
  activeIndex.value = index !== null ? index : fileList.value.findIndex((file) => file.fileName === item.fileName)
  FileParam.value.entryPath = item.filePath

  if(isZipPreview.value){
    if(isPreviewFileExtension(item.fileName)){
        setTimeout(()=>{
           filePreviewRef1.value.loadZipFile(FileParam.value) 
        },500)
        
      } else{
       ElMessage.warning('不支持的预览格式!')
    }
    return
  }
  currentFileName.value = clickFileName.value
  // if (isReviewFileExtension(item.fileName)) {
  //   reviewFiles(item, keyword.value, docChapters.value)
  // }

  // 2.文件预览加载
 keywordList.value = keyword.value.split('&&')
  if(reviewDocChapters.value && reviewDocChapters.value.length>0){
    reviewDocChapters.value.forEach(item=>{
      keywordList.value.push(item.keyword)
    })
  }
  fileType.value = item.fileName.split('.').pop().toLowerCase()
  previewFileData.value.name= clickFileName.value 
  if (fileType.value === 'pdf') {
    nextTick(() => {
      if (pdfRef.value && keywordList.value.length>0) {
        pdfRef.value.loadFile(FileParam.value)
      }
    })
  } else if (fileType.value === 'xlsx' || fileType.value === 'xls') {
      nextTick(() => {
        if (excelRef.value && keywordList.value.length > 0) {
          excelRef.value.loadZipFile(previewFileData.value)
        }
      })
   } else if(typeContains(fileType.value, 'pngjpgjpeggifsvg')){
      filePreviewRef.value.loadZipFile(previewFileData.value)
    } else if(fileType.value === 'docx' || fileType.value === 'doc' || fileType.value === 'txt'){
      nextTick(() => {
        if (wordRef.value && keywordList.value.length > 0) {
          wordRef.value.loadZipFileFromServer(previewFileData.value)
        }
      })
      
    }


  
}

/**
 * 关键词高亮跳转
 */

function findPrev(key) {
  if (currentFileName.value.split('.').pop().toLowerCase() === 'pdf') {

    if (childCurrentKeyword.value === '' || childCurrentKeyword.value !== key) {
      pdfRef.value.selectKeyword(key)
      pdfRef.value.searchQuery()
    }
    pdfRef.value.findPrev()
  } else if(currentFileName.value.split('.').pop().toLowerCase() === 'doc' || currentFileName.value.split('.').pop().toLowerCase() === 'docx' || currentFileName.value.split('.').pop().toLowerCase() === 'txt'){
      if (childCurrentKeyword.value === '' || childCurrentKeyword.value !== key) {
      wordRef.value.switchToKeyword(key)
      wordRef.value.searchQuery()
    }
    wordRef.value.prevMatch()
  } else if(currentFileName.value.split('.').pop().toLowerCase() === 'xls' || currentFileName.value.split('.').pop().toLowerCase() === 'xlsx'){
      if (childCurrentKeyword.value === '' || childCurrentKeyword.value !== key) {
      excelRef.value.switchToKeyword(key)
      excelRef.value.searchQuery()
    }
    excelRef.value.prevMatch()
  }
}

function findNext(key) {
  if (currentFileName.value.split('.').pop().toLowerCase() === 'pdf') {
    if (childCurrentKeyword.value === '' || childCurrentKeyword.value !== key) {
      pdfRef.value.selectKeyword(key)
      pdfRef.value.searchQuery()
    }
    pdfRef.value.findNext()
  } else if(currentFileName.value.split('.').pop().toLowerCase() === 'doc' || currentFileName.value.split('.').pop().toLowerCase() === 'docx' || currentFileName.value.split('.').pop().toLowerCase() === 'txt'){
    console.log('当前选择',childCurrentKeyword)
    if (childCurrentKeyword.value === '' || childCurrentKeyword.value !== key) {
      wordRef.value.switchToKeyword(key)
      wordRef.value.searchQuery()
    }
    wordRef.value.nextMatch()
  } else if(currentFileName.value.split('.').pop().toLowerCase() === 'xls' || currentFileName.value.split('.').pop().toLowerCase() === 'xlsx'){
    console.log('当前选择',childCurrentKeyword)
    if (childCurrentKeyword.value === '' || childCurrentKeyword.value !== key) {
      excelRef.value.switchToKeyword(key)
      excelRef.value.searchQuery()
    }
    excelRef.value.nextMatch()
  }
}


/**
 * 获取审查结果
 */

// async function reviewFiles(item, keywords, docChapters) {
//   try {
//     console.log('item=',item)
//     const res = await reviewGridZipFileApi({
//       downloadFile: {
//         fileId: previewFileData.value.fileId,
//         idate:  previewFileData.value.iDate,
//         oid: previewFileData.value.oid,
//         entryPath: item.filePath,
//         bkUsername: previewFileData.value.bkUsername
//       },
//       keywords: keywords,
//       docChapters:docChapters
//     })
//     currentFileName.value = clickFileName.value
//     reviewDocChapters.value = transformData(res.chapterMatchResults)
//     reviewItemResult.value = transformData(res.keywordMatchResults)
//   } catch (error) {}
// }

/**
 *工具函数
 */
// 高亮函数
function highlightResult(text, keywords) {
  if (!text || !keywords) return text || ''

  try {
    const keywordList = keywords
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k && k.length > 0)

    if (keywordList.length === 0) return text

    // 转义HTML
    let result = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

    // 对每个关键字进行高亮
    keywordList.forEach((keyword) => {
      const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const regex = new RegExp(`(${escapedKeyword})`, 'gi')
      result = result.replace(regex, '<mark class="keyword-highlight">$1</mark>')
    })

    return result
  } catch (error) {
    console.error('高亮处理错误:', error)
    return text
  }
}

function typeContains(type, types) {
  return types.indexOf(type) >= 0
}

// 判断文件格式是否允许审查
function isReviewFileExtension(filename) {
  if (!filename || typeof filename !== 'string') return false

  const validExtensions = ['xls', 'pdf', 'doc', 'docx', 'xlsx', 'txt']
  const extension = filename.split('.').pop().toLowerCase()
  return validExtensions.includes(extension)
}

// 转换格式
function transformData(matchResults) {
  return Object.entries(matchResults).map(([key, result]) => {
    // 去除 \\Q 和 \\E 包裹符
    const keyword = key.replace(/^\\Q|\\E$/g, '')
    return { keyword, result }
  })
}

/**
 * 根据key从统计对象中获取对应值
 * @param statsObj 关键词统计对象（如 { "数据": 32, "系统拓扑图": 0, ... }）
 * @param key 要查询的关键词（如 "数据"、"IT资产清单"）
 * @returns 对应值（未找到返回0）
 */
function getValueByKey(statsObj: Record<string, number>, key: string): number {
  // 基础校验：避免空值/非对象导致报错
  if (!statsObj || typeof statsObj !== 'object' || Array.isArray(statsObj)) {
    return 0
  }
  // 严格匹配key，未找到返回0（可根据需求改为undefined）
  return statsObj[key] ?? 0
}

function isPreviewFileExtension(filename) {
  if (!filename || typeof filename !== 'string') return false 
  const validExtensions = ['xls', 'pdf', 'doc', 'docx', 'xlsx', 'txt', 'jpg', 'png', 'jpeg', 'gif', 'svg']
  const extension = filename.split('.').pop().toLowerCase()
  return validExtensions.includes(extension)
}
</script>
<style scoped>
.result-content{
  text-align: right;
}
:deep(.el-card__body) {
  padding: 0;
}

.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-right: 15px;
  margin-left: 15px;
  border-bottom: 1px solid rgb(228, 224, 224);
}

.file-item {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 15px 10px 10px 20px;
  font-size: 14px;
  padding: 10px 0;
  cursor: pointer;
}
.file-item:hover {
  /* background-color: #e6f7ff;
  color: #1890ff; */
  border: 1px solid #1890ff;
}

.file-item.active {
  background-color: #c2d5f25e;
  /* color: rgb(61, 242, 255); */
  /* font-weight: 500; */
}

.file-title {
  padding: 10px;
  border-bottom: 1px solid rgb(228, 224, 224);
}
</style>
