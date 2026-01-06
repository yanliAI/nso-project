<template>
  <div style="padding: 20px">
    <el-card shadow="never" style="width: 100%; height: 710px; overflow-y: auto">
      <div class="title-box">
        <div style="font-weight: 500; font-size: 18px; margin-bottom: 10px">审查概览</div>
        <div style="margin-top: 10px; display: flex; justify-content: left;">
          <div style="width:50%">并网阶段: &nbsp; {{ reviewResult.stage }}</div>
          <div>并网类型: &nbsp; {{ reviewResult.category }}</div>
        </div>
      </div>
      <!-- 总体结论 -->
      <div class="box-title">审查结论</div>
      <div style="padding: 15px; margin-bottom: 15px; font-size: 14px; color: black; line-height: 1.5; white-space: pre-line; background-color: #f1f5f8">
        {{ reviewConclusion.aiConclusion }}
      </div>

      <div class="box-title">审查项详情</div>
      <el-table border stripe :data="mergeResult.list" default-expand-all>
        <el-table-column type="index" label="序号" align="center" width="60" />
        <el-table-column label="详情" prop="审查附件" width="100" align="center" type="expand">
          <template #default="props">
            <div style="padding: 10px">
              <div class="section-title">附件列表</div>
              <div class="flex items-center" style="flex-wrap: wrap; gap: 10px; padding: 10px; background-color: #f9fcf8">
                <div v-for="item in props.row.attachInfoList" v-if="props.row.attachInfoList && props.row.attachInfoList.length > 0" style="width: 100%; overflow-x: auto; padding: 5px; border: 1px solid #d8dbdc; background-color: #f5f5f5">
                  <div class="flex items-center">
                    <div style="margin-right: 15px">{{ item.name }}</div>
                    <span style="cursor: pointer; color: #0067ff" v-if="isReviewFileExtension(item)" @click="reviewItem(item, props.row.keywords)">审查</span>
                    <span style="cursor: pointer; color: #0067ff" v-if="isReviewZipExtension(item.name)" @click="reviewZipItem(item, oidData.oid, props.row.keywords)">审查</span>
                    <span style="cursor: pointer; color: #0067ff" @click="previewAttach(item.name, item.fileId, JSON.stringify(item.idate), oidData.oid, props.row.keywords)" v-show="isValidFileExtension(item.name)">预览</span>
                    <span style="margin-left: 5px; cursor: pointer; color: #0067ff" @click="downloadAttach(item.name, item.fileId, JSON.stringify(item.idate), oidData.oid)">下载</span>
                  </div>
                  <div>
                    <div v-if="item.zipList && item.zipList.length > 0">
                      <div class="zip-list-container" style="width: calc(100% - 60px)">
                        <div class="tags-scroll-wrapper">
                          <div v-for="[key, value] in Object.entries(summarizeKeywordMatchResults(item.zipList))" :key="key" class="tag-item">
                            <el-tag :type="value ? 'success' : 'danger'"> {{ key }}: {{ value ? '✓' : '✗' }} </el-tag>
                          </div>
                        </div>
                        <div v-if="item.state && item.state === 'fold'" @click="changeState(item)" style="width: 60px; cursor: pointer">收起</div>
                        <div v-else @click="changeState(item)" style="width: 60px; cursor: pointer">展开</div>
                      </div>
                      <div v-if="item.state && item.state === 'fold'" style="padding: 15px">
                        <div v-for="itemFile in item.zipList" style="margin: 10px 0; background-color: #f9fcf8; border: 1px solid #A3F676; padding: 5px;">
                          <div style="margin-bottom: 5px;">{{ itemFile.entryPath }}</div>
                          <div style="display: flex; align-items: center; width: 100%; flex-wrap: nowrap; overflow-x: auto;">
                            <div v-if="itemFile.hasReview === true" v-for="[key, value] in Object.entries(itemFile.keywordMatchResults)" :key="key">
                              <el-tag :type="value ? 'success' : 'danger'"> {{ key }}: {{ value ? '✓' : '✗' }} </el-tag>
                            </div>
                            <div v-else style="color: grey;">
                              {{ itemFile.unReviewReason || '' }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-else>
                      <div style="display: flex; align-items: center; width: 100%; overflow-x: auto; flex-wrap: nowrap; margin-top: 5px;">
                        <div v-if="item.hasReview === true" v-for="[key, value] in Object.entries(item.keywordMatchResults)" :key="key" style="margin-right: 5px;">
                            <el-tag :type="value ? 'success' : 'danger'"> {{ key }}: {{ value ? '✓' : '✗' }} </el-tag>
                          </div>
                          <div v-else style="color: grey;">
                            {{ item.unReviewReason || '' }}
                          </div>
                      </div>
 
                    </div>
                  </div>
                </div>
                <div v-else>暂无附件</div>
              </div>

              <div class="section-title" style="margin-top: 15px">
                文档匹配详情
                <span class="pass-result" v-if="props.row.reviewStatus === 'PASS'">通过</span>
                <span class="fail-result" v-else>缺失</span>
                <div
                  :style="{
                    color: props.row.reviewStatus === 'PASS' ? '#59EC1C' : '#EC481B'
                  }"
                  style="font-weight: 400; margin-left: 15px; width: 500px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
                >
                  {{ props.row.reviewMessage }}
                </div>
              </div>
              <div style="padding: 10px; background-color: #f9fcf8">
                <div v-for="item in props.row.documentMatchResults" class="flex items-center" style="margin-bottom: 10px; padding: 2px 0">
                  <div style="color: #52c41a" v-if="item.matched">✓</div>
                  <div style="color: red" v-else>✗</div>
                  <div style="margin-left: 10px">《{{ item.requiredDocument }}》</div>
                  <div>&nbsp; → &nbsp;</div>
                  <div>{{ item.matchedFileName }}</div>
                  <div style="margin-left: 10px; background: #e6f7ff; padding: 2px 6px" v-if="item.matched">相似度: {{ (item.matchScore * 100).toFixed(2) || 0 }} %</div>
                  <div style="margin-left: 10px; background: #ffdcdc; padding: 2px 6px" v-else>无匹配附件</div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="审查项" prop="optionName" align="center">
          <template #default="scope">
            <el-tooltip effect="light" :content="scope.row.optionName" placement="bottom" popper-class="custom-tooltip">
              <span class="max-lines">{{ scope.row.optionName }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="审查点" prop="pointName" align="center">
          <template #default="scope">
            <el-tooltip effect="light" :content="scope.row.pointName" placement="bottom" popper-class="custom-tooltip">
              <span class="max-lines">{{ scope.row.pointName }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="审查要求" prop="checkRequire" align="center">
          <template #default="scope">
            <el-tooltip effect="light" :content="scope.row.checkRequire" placement="bottom" popper-class="custom-tooltip">
              <span class="max-lines">{{ scope.row.checkRequire }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="审查文档" prop="docName" align="center">
          <template #default="scope">
            <el-tooltip effect="light" :content="scope.row.docName" placement="bottom" popper-class="custom-tooltip">
              <span class="max-lines">{{ scope.row.docName }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="审查章节" prop="docChapter" align="center">
          <template #default="scope">
            <el-tooltip effect="light" :content="scope.row.docChapter" placement="bottom" popper-class="custom-tooltip">
              <span class="max-lines">{{ scope.row.docChapter }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="审查关键字" prop="keywords" align="center">
          <template #default="scope">
            <el-tooltip effect="light" :content="scope.row.keywords" placement="bottom" popper-class="custom-tooltip">
              <div class="max-lines">
                <div v-for="(item, index) in scope.row.keywords?.split('&&')">
                  <span>{{ item }} <br /></span>
                </div>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 附件审查结果 -->
    <el-dialog v-model="reviewDialog" title="附件审查" width="70%" top="50px">
      <el-row style="height: 750px">
        <el-col :span="8" style="border: 1px solid grey; border-right: none; padding: 10px">
          <div style="font-size: 16px; margin-bottom: 10px">章节审查:</div>
          <el-table border stripe :data="reviewDocChapters" height="300">
            <el-table-column label="审查章节名" prop="keyword" align="center"></el-table-column>
            <el-table-column label="审查结果" align="center">
              <template #default="scope">
                  <div v-if="scope.row.keyword" class="search-content"
                    ><div>匹配: {{ childCurrentKeyword === scope.row.keyword ? childCurrentMatch : '0' }} /{{ getValueByKey(childKeywordCounts, scope.row.keyword) || 0 }}</div>
                    <div>
                      <button @click="findPrev(scope.row.keyword)" class="nav-btn">
                        ◀
                      </button>
                      <button @click="findNext(scope.row.keyword)" class="nav-btn">
                         ▶
                      </button>
                    </div> 
                </div>
                <div v-else class="empty-result">-</div>
              </template>
            </el-table-column>
          </el-table>
          <div style="font-size: 16px; margin: 10px 0">内容审查:</div>
          <el-table border stripe :data="reviewItemResult" height="350">
            <el-table-column label="审查关键字" prop="keyword" align="center"></el-table-column>
            <el-table-column label="审查结果" align="center">
              <template #default="scope">
                <div v-if="scope.row.keyword" class="search-content"
                    ><div>匹配: {{ childCurrentKeyword === scope.row.keyword ? childCurrentMatch : '0' }} /{{ getValueByKey(childKeywordCounts, scope.row.keyword) || 0 }}</div>
                    <div>
                      <button @click="findPrev(scope.row.keyword)" class="nav-btn">
                        ◀
                      </button>
                      <button @click="findNext(scope.row.keyword)" class="nav-btn">
                        ▶
                      </button>
                    </div> 
                </div>
                <div v-else class="empty-result">-</div>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="16" style="border: 1px solid grey; height: 750px">
          <!-- <FilePreview v-if="reviewDialog" :fileData="previewFileData" isZipFile="false"></FilePreview> -->
          <ExcelPreview v-if="fileType === 'xls' || fileType === 'xlsx'" ref="excelRef" :keywordList="keywordList" :fileData="previewFileData" isZipFile="true" @change="updateFindMatch"></ExcelPreview>
          <WordPreview v-if="fileType === 'doc' || fileType === 'docx' || fileType === 'txt'" ref="wordRef" :keywordList="keywordList" :fileData="previewFileData" isZipFile="false" @change="updateFindMatch"></WordPreview>
          <PdfPreview v-if="fileType === 'pdf'" ref="pdfRef" :keywordList="keywordList" isZipFile="true" @change="updateFindMatch"></PdfPreview>
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 文件预览 -->
    <el-dialog v-model="previewDialog" title="文件预览" width="70%" top="50px" style="height: calc(100vh - 100px)">
      <FilePreview v-if="previewDialog" :fileData="previewFileData" isZipFile="false"></FilePreview>
    </el-dialog>

    <!-- 压缩包文件预览 -->
    <el-dialog v-model="previewZipDialog" title="文件预览" width="85%" top="50px">
      <ReviewZIP v-if="previewZipDialog" isZipFile="true" :isUnderReview="isReview" :fileData="previewFileData" :keyword="currentKeyword" :docChapters="currentDocChapters"></ReviewZIP>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ElTable, ElTableColumn, ElRow, ElAutocomplete, ElCard, ElCol, ElFormItem, ElForm, ElInput, ElButton, ElSelect, ElOption, ElContainer, ElAside, ElHeader, ElMain, ElFooter, ElDialog, ElMessage, ElMessageBox, ElText, ElLink, ElCollapse, ElCollapseItem, ElTag } from 'element-plus'
import { Search, Download, Monitor, Operation, Document, Back, CircleCheck, ArrowLeftBold, ArrowRightBold } from '@element-plus/icons-vue'
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
import { getGridCheckResultApi, getKeywordsAndChaptersApi, getGridCheckConclusionApi, reviewGridZipFileApi } from '#/api'
import { downloadFile } from '#/utils/download.ts'
import FilePreview from './filePreview.vue'
import ReviewZIP from './reviewzip.vue'
import PdfPreview from './pdfPreview.vue'
import WordPreview from './wordPreview.vue'
import ExcelPreview from './excelPreview.vue'
// import ImagePreview from './imagePreview.vue'
const oidData = defineModel('oidData')

// 文件审查
const reviewResult = ref([])
const reviewConclusion = ref([])
const reviewItemResult = ref([])
const reviewDialog = ref(false)
const currentFileName = ref('')
const currentKeyword = ref('')
const currentDocChapters = ref('')
const isReview = ref(false)
const reviewDocChapters = ref([])
const mergeResult = ref([])

// 文件预览
const previewDialog = ref(false)
const previewAndCheck = ref(false)
const previewZipDialog = ref(false)
const previewFileData = ref({
  name: '',
  fileId: '',
  iDate: '',
  oid: '',
  bkUsername:''
})

// 文件预览/定位相关
const fileType = ref('') // 文件类型
const keywordList = ref([]) //查询关键词
const pdfRef = ref(null) // pdf容器
const wordRef = ref(null)
const excelRef = ref(null)

// 新增：接收子组件同步的参数
const childKeywordCounts = ref({}) // 子组件关键词统计
const childCurrentKeyword = ref('') // 子组件当前选中关键词
const childCurrentMatch = ref(0)

function updateFindMatch(val) {
  childKeywordCounts.value = val.KeywordCounts
  childCurrentKeyword.value = val.CurrentKeyword
  childCurrentMatch.value = val.CurrentMatch
}

onMounted(async()=>{
  await getCheckResult()
  await getCheckConclusion()
})

watch(
  oidData,
  async (newVal, oldVal) => {
    try {
      // 先执行 getCheckResult
      await getCheckResult()
      await getCheckConclusion()
    } catch (error) {
      console.error('执行失败:', error)
    }
  },
  {
    immediate: true,
    deep: true
  }
)

function changeState(item) {
  if (!item.state || item.state === 'collapse') {
    item.state = 'fold'
  } else {
    item.state = 'collapse'
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
  } else if (currentFileName.value.split('.').pop().toLowerCase() === 'doc' || currentFileName.value.split('.').pop().toLowerCase() === 'docx' || currentFileName.value.split('.').pop().toLowerCase() === 'txt') {
    if (childCurrentKeyword.value === '' || childCurrentKeyword.value !== key) {
      wordRef.value.switchToKeyword(key)
      wordRef.value.searchQuery()
    }
    wordRef.value.prevMatch()
  } else if (currentFileName.value.split('.').pop().toLowerCase() === 'xls' || currentFileName.value.split('.').pop().toLowerCase() === 'xlsx') {
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
  } else if (currentFileName.value.split('.').pop().toLowerCase() === 'doc' || currentFileName.value.split('.').pop().toLowerCase() === 'docx' || currentFileName.value.split('.').pop().toLowerCase() === 'txt') {
    if (childCurrentKeyword.value === '' || childCurrentKeyword.value !== key) {
      wordRef.value.switchToKeyword(key)
      wordRef.value.searchQuery()
    }
    wordRef.value.nextMatch()
  } else if (currentFileName.value.split('.').pop().toLowerCase() === 'xls' || currentFileName.value.split('.').pop().toLowerCase() === 'xlsx') {
    if (childCurrentKeyword.value === '' || childCurrentKeyword.value !== key) {
      excelRef.value.switchToKeyword(key)
      excelRef.value.searchQuery()
    }
    excelRef.value.nextMatch()
  }
}


/**
 * 获取审查项附件校验结果
 */

async function getCheckResult() {
  try {
    if (!oidData.value) return
    const res = await getGridCheckResultApi({ data: oidData.value.oid })
    reviewResult.value = res
  } catch (e) {}
}




/**
 * 获取审查结论
 */

async function getCheckConclusion() {
  try {
    if (!oidData.value) return
    const res = await getGridCheckConclusionApi({ data: oidData.value.oid })
    reviewConclusion.value = res

    mergeResult.value = mergeData(reviewResult.value, reviewConclusion.value)
  } catch (e) {
    mergeResult.value = reviewResult.value
  }
}

/**
 * 审查附件
 */
// 非zip文件审查
async function reviewItem(item, keywords) {
  try {
    fileType.value = ''
    // 仅支持100M之内的文件审查预览
    const isAllowSize = isFileSizeExceedLimit(item.size)
    if (!isAllowSize) {
      ElMessage.warning('不支持文件大于100M的文件审查!')
      return
    }

    reviewDialog.value = true
    keywordList.value = keywords.split('&&')
    try {
      Object.assign(previewFileData.value, {
        name: item.name,
        fileId: item.fileId,
        iDate: item.idate,
        oid: oidData.value.oid,
        bkUsername:oidData.value.userId
        
      })
      // 1.获取审查信息
      const res = await getKeywordsAndChaptersApi({
        keywords: keywords,
        docChapters: item.docChapters
      })
      currentFileName.value = item.name || ''
      reviewItemResult.value =  res.keyWordList.map(item => ({keyword:item}))
      reviewDocChapters.value = res.docChapterList.map(item => ({keyword:item}))
    } catch (e) {
      fileType.value = item.name.split('.').pop().toLowerCase()
      if (fileType.value === 'xlsx' || fileType.value === 'xls') {
        nextTick(() => {
          if (excelRef.value && keywordList.value.length > 0) {
            excelRef.value.loadFile()
          }
        })
      } else if (fileType.value === 'pdf') {
        nextTick(() => {
          if (pdfRef.value && keywordList.value.length > 0) {
            pdfRef.value.loadFile1(previewFileData.value)
          }
        })
      } else if (fileType.value === 'docx' || fileType.value === 'doc' || fileType.value === 'txt') {
        nextTick(() => {
          if (wordRef.value && keywordList.value.length > 0) {
            wordRef.value.loadFileFromServer(previewFileData.value)
          }
        })
      }
    }
    // 2. 文件预览
    if (reviewDocChapters.value && reviewDocChapters.value.length > 0) {
      reviewDocChapters.value.forEach((item) => {
        keywordList.value.push(item.keyword)
      })
    }
    fileType.value = item.name.split('.').pop().toLowerCase()
    if (fileType.value === 'xlsx' || fileType.value === 'xls') {
      nextTick(() => {
        if (excelRef.value && keywordList.value.length > 0) {
          excelRef.value.loadFile()
        }
      })
    } else if (fileType.value === 'pdf') {
      nextTick(() => {
        if (pdfRef.value && keywordList.value.length > 0) {
          pdfRef.value.loadFile1(previewFileData.value)
        }
      })
    } else if (fileType.value === 'docx' || fileType.value === 'doc' || fileType.value === 'txt') {
      nextTick(() => {
        if (wordRef.value && keywordList.value.length > 0) {
          wordRef.value.loadFileFromServer(previewFileData.value)
        }
      })
    }
  } catch (error) {}
}

// zip内文件审查
// async function reviewItem1(item) {
//   try {
//     // 仅支持100M之内的文件审查预览
//     const isAllowSize = isFileSizeExceedLimit(item.size)
//     if (!isAllowSize) {
//       ElMessage.warning('不支持文件大于100M的文件审查!')
//       return
//     }

//     reviewDialog.value = true
//     const res = await reviewGridZipFileApi({
//       downloadFile: {
//         fileId: item.fileId,
//         idate: item.idate,
//         oid: oidData.value.oid,
//         entryPath: item.entryPath,
//         bkUsername:oidData.value.userId
//       },
//       keywords: item.keywords
//     })
//     currentFileName.value = item.name || ''
//     reviewItemResult.value = transformData(res.keywordMatchResults)
//   } catch (error) {}
// }

/**
 * 附件相关
 */

// 下载附件
async function downloadAttach(name: string, fileId: string, iDate: string, oid: string) {
  try {
    console.log(oidData.value)
    await downloadFile(import.meta.env.VITE_NSOSFS + `/ydCommon/downloadFile`, { fileId: fileId, idate: iDate, oid: oid, bkUsername:oidData.value.userId }, name, 'post')
  } catch {}
}

// 附件预览
function previewAttach(name: string, fileId: string, iDate: string, oid: string, keywords: any) {
  previewFileData.value.name = name
  previewFileData.value.fileId = fileId
  previewFileData.value.iDate = iDate
  previewFileData.value.oid = oid
  previewFileData.value.bkUsername = oidData.value.userId
  const extension = name.split('.').pop().toLowerCase()
  currentKeyword.value = keywords

  isReview.value = false
  if (extension === 'zip' || extension === '7z') {
    previewZipDialog.value = true
  } else {
    previewDialog.value = true
  }
}

// 审查zip文件
function reviewZipItem(item: any, oid: string, keywords: any) {
  previewFileData.value.name = item.name
  previewFileData.value.fileId = item.fileId
  previewFileData.value.iDate = item.idate
  previewFileData.value.oid = oid
  previewFileData.value.bkUsername = oidData.value.userId
  currentKeyword.value = keywords
  currentDocChapters.value = item.docChapters
  isReview.value = true
  previewZipDialog.value = true
}

/**
 * 工具函数
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

// 合并数据的方法
function mergeData(data1, data2) {
  // 创建data2的索引，按checkPointId分组
  const data2Index = {}

  // 遍历data2的pointList，按checkPointId建立索引
  if (data2 && data2.pointList && Array.isArray(data2.pointList)) {
    data2.pointList.forEach((point) => {
      const checkPointId = point.checkPointId

      if (checkPointId) {
        if (!data2Index[checkPointId]) {
          data2Index[checkPointId] = []
        }
        data2Index[checkPointId].push(point)
      }
    })
  }

  // 深度克隆data1，避免修改原始数据
  const mergedData = JSON.parse(JSON.stringify(data1))

  // 如果没有list数组，直接返回
  if (!mergedData.list || !Array.isArray(mergedData.list)) {
    return mergedData
  }

  // 遍历data1的list
  mergedData.list.forEach((item1) => {
    const checkPointId = item1.checkPointId

    // 如果没有checkPointId，跳过
    if (!checkPointId) {
      return
    }

    // 查找data2中匹配的检查点
    const matchedPoints = data2Index[checkPointId] || []

    if (matchedPoints.length === 0) {
      return
    }

    // 处理attachInfoList
    if (item1.attachInfoList && Array.isArray(item1.attachInfoList)) {
      item1.attachInfoList.forEach((attachInfo) => {
        const fileId1 = attachInfo.fileId

        if (!fileId1) {
          return
        }

        // 在匹配的data2检查点中查找相同fileId的文件
        const matchedResults = []

        // 遍历所有匹配的检查点
        matchedPoints.forEach((point) => {
          if (point.resultList && Array.isArray(point.resultList)) {
            point.resultList.forEach((result) => {
              if (result.fileId === fileId1) {
                matchedResults.push(result)
              }
            })
          }
        })

        // 如果有匹配结果
        if (matchedResults.length > 0) {
          if (matchedResults.length === 1) {
            // 单个匹配，将data2的结果合并到attachInfo
            Object.assign(attachInfo, matchedResults[0])
          } else {
            // 多个匹配，添加zipList数组
            attachInfo.zipList = [...matchedResults]

            // 同时可以添加一个标记字段
            attachInfo.hasMultipleMatches = true
            attachInfo.matchCount = matchedResults.length
          }
        }

        // 添加匹配标记
        attachInfo.isMatched = matchedResults.length > 0
      })
    }
  })

  return mergedData
}

function summarizeKeywordMatchResults(dataList) {
  if (!Array.isArray(dataList) || dataList.length === 0) {
    return {}
  }

  const result = {}

  // 遍历所有元组
  dataList.forEach((item) => {
    // 只处理hasReview为true的元组
    if (item.hasReview === true && item.keywordMatchResults) {
      const keywordResults = item.keywordMatchResults

      // 遍历当前元组的keywordMatchResults
      Object.entries(keywordResults).forEach(([key, value]) => {
        // 如果key不存在于结果中，或者当前结果为true，则更新
        if (!(key in result) || value === true) {
          result[key] = value
        }
        // 如果result中已经是true，就不需要再更新了（true优先级最高）
        // 如果result中是false，但当前是true，则更新为true
        if (result[key] === false && value === true) {
          result[key] = true
        }
      })
    }
  })

  return result
}

// 转换格式
function transformData(matchResults) {
  return Object.entries(matchResults).map(([key, result]) => {
    // 去除 \\Q 和 \\E 包裹符
    const keyword = key.replace(/^\\Q|\\E$/g, '')
    return { keyword, result }
  })
}

// 解析附件路径
function safeParseAttachInfo(jsonString) {
  if (!jsonString) return []

  try {
    const parsed = JSON.parse(jsonString)
    if (!Array.isArray(parsed)) {
      console.warn('附件信息不是数组格式:', jsonString)
      return []
    }
    return parsed
  } catch (e) {
    console.error('解析附件信息失败:', {
      error: e,
      jsonString: jsonString
    })
    return []
  }
}

function typeContains(type, types) {
  return types.indexOf(type) >= 0
}

// 判断文件大小是否大于100M
function isFileSizeExceedLimit(size) {
  if (typeof size !== 'number' || size <= 0) {
    return false // 无效的size
  }
  return size < 100 * 1024 * 1024 // 100MB = 100 * 1024 * 1024 bytes
}

// 判断文件格式是否允许预览
function isValidFileExtension(filename) {
  if (!filename || typeof filename !== 'string') return false

  const validExtensions = ['jpg', 'png', 'jpeg', 'gif', 'svg']
  const extension = filename.split('.').pop().toLowerCase()
  return validExtensions.includes(extension)
}

// 判断文件格式是否允许审查
function isReviewFileExtension(data) {
  const filename = data.name
  if (!filename || typeof filename !== 'string') return false

  const validExtensions = ['xls', 'pdf', 'doc', 'docx', 'xlsx', 'txt']
  const extension = filename.split('.').pop().toLowerCase()
  return validExtensions.includes(extension)
}

// 判断压缩包格式是否允许审查
function isReviewZipExtension(filename) {
  if (!filename || typeof filename !== 'string') return false

  const validExtensions = ['zip', '7z']
  const extension = filename.split('.').pop().toLowerCase()
  return validExtensions.includes(extension)
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
</script>
<style lang="scss" scoped>
.search-content{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.nav-buttons {
  display: flex;
  gap: 8px;
}

.nav-btn {
  padding: 2px 6px;
  background: #6c757d;
  color: white;
  border: none;
  margin-right: 5px;
  border-radius: 4px;
  font-size: 10px;
  cursor: pointer;
  transition: background 0.2s;
}
.zip-list-container {
  width: 100%;
  max-width: 100%;
  padding-top: 4px;
  overflow-x: auto; /* 水平滚动 */
  overflow-y: hidden; /* 垂直方向隐藏 */
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
/* 内层容器，使用flex布局，不换行 */
.tags-scroll-wrapper {
  display: flex;
  flex-wrap: nowrap; /* 关键：不换行 */
  align-items: center;
  gap: 6px; /* 标签间距 */
  padding: 0 8px;
  min-width: min-content; /* 保证容器有最小宽度 */
}

/* 每个标签项的样式 */
.tag-item {
  flex: 0 0 auto; /* 不拉伸，不收缩，自动宽度 */
  white-space: nowrap; /* 标签内文字不换行 */
}

.title-box {
  margin: 15px 0;
  font-size: 16px;
  height: fit-content;
  background-color: #f0f7ff;
  padding: 20px;
  border-radius: 5px;
  position: relative;
  &::before {
    position: absolute;
    content: '';
    width: 5px;
    height: 100%;
    background-color: #52c41a;
    top: 0px;
    left: 0px;
    border-radius: 5px 0 0 5px;
  }
}

.result-content {
  text-align: right;
}
.box-title {
  font-weight: 500;
  font-size: 16px;
  margin-bottom: 10px;
}
.box-title::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 14px;
  background: #ddbe0e;
  margin-right: 8px;
  border-radius: 2px;
}

// 附件列表
.section-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #262626;
  display: flex;
  align-items: center;
  .pass-result {
    font-size: 12px;
    font-weight: 400;
    margin-left: 15px;
    padding: 2px;
    background-color: #f6ffed;
    color: #52c41a;
    border: 1px solid #b7eb8f;
  }
  .fail-result {
    font-size: 12px;
    font-weight: 400;
    margin-left: 15px;
    padding: 2px;
    background-color: #ffeded;
    color: #ef1c0d;
    border: 1px solid #eb928f;
  }
}
.section-title::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 14px;
  background: #1890ff;
  margin-right: 8px;
  border-radius: 2px;
}

// 附件匹配

.max-lines {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3; /* 限制显示行数 */
  overflow: hidden;
  text-overflow: ellipsis;
}

//高亮重复项
.result-content {
  max-width: 300px;
  line-height: 1.6;
  text-align: left;
}

.keyword-highlight {
  color: #d63031;
  background-color: #ffeaa7;
  padding: 1px 4px;
  border-radius: 3px;
  font-weight: 600;
  border: 1px solid #fab1a0;
}

.normal-result {
  color: #333;
}

.empty-result {
  color: #999;
  font-style: italic;
}

:deep(.el-table .cell) {
  padding: 8px 12px;
}

:deep(.el-table td) {
  vertical-align: top;
}
</style>
