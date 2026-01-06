<template>
  <Page auto-content-height>
    <div class="w-full h-full flex p-1 bg-white">
      <DrawingBoard v-if="false" class="drawing-board" :width="1920" :height="1000" @onExit="handleExitDrawingBoard"></DrawingBoard>
      <div class="w-[22%] h-full">
        <!-- <div class="w-full h-[30%] pb-1">
          <el-card class="w-full h-full">
            <div class="w-full h-full">
              <div class="title flex items-center">
                <div class="mnjkg mr-[6px]"></div>
                告警
              </div>
              <div class="conbody"></div>
            </div>
          </el-card>
        </div> -->
        <div class="w-full h-[50%] pb-1">
          <el-card class="w-full h-full">
            <div class="w-full h-full">
              <div class="title flex items-center">
                <div class="mnjkg mr-[6px]"></div>
                系统作业
              </div>
              <div class="conbody"></div>
            </div>
          </el-card>
        </div>
        <div class="w-full h-[50%]">
          <el-card class="w-full h-full">
            <div class="w-full h-full">
              <div class="title flex items-center">
                <div class="mnjkg mr-[6px]"></div>
                历史故障
              </div>
              <div class="conbody">
                <el-table :data="data.historyData" ref="flawAssetTableRef" :show-header="false" :border="false" size="small" style="width: 100%; height: calc(100% - 30px)">
                  <el-table-column type="index" width="35" label="" align="center" />
                  <el-table-column prop="faultCode" label="故障编号" width="70" align="center" />
                  <el-table-column prop="faultInfo" label="故障名称" align="left" header-align="center" />
                  <el-table-column prop="faultStatus" label="故障状态" column-key="NSOS_FAULT_STATUS" :formatter="formatDrop" align="center" width="60" />
                  <el-table-column prop="faultOccurTime" label="故障发生时间" :formatter="tDateTimeFormat" align="center" width="80" />
                </el-table>
                <div class="flex h-[25px] pl-[5px]">
                  <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" size="small" class="mt-1" :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="currentChange"> </el-pagination>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </div>
      <div class="w-[56%] h-full">
        <div class="h-[40px] flex">
          <div class="m-auto h-full flex items-center">
            <el-input v-model="filterText" :prefix-icon="Search" class="ml-[8px]" style="width: 250px" placeholder="搜索关键字" />
            <el-button type="primary" class="ml-4" :icon="Tickets" @click="saveAssessResultClick" size="small">保存</el-button>
            <el-button type="primary" class="ml-4" :icon="ChatDotRound" @click="faultMeetingClick" size="small">一键拉群</el-button>
            <el-link type="primary" class="ml-4" @click="meetingRecordClick" style="font-size: 12px">群记录</el-link>
          </div>
        </div>
        <div class="svg-main">
          <div ref="svgRef" class="svgcss" @wheel="svgWheel" v-html="data.svgdata"></div>
        </div>
      </div>
      <div class="w-[22%] h-full">
        <div class="w-full h-[35%] pb-1">
          <el-card class="w-full h-full">
            <div class="w-full h-full">
              <div class="title flex items-center">
                <div class="mnjkg mr-[6px]"></div>
                研判结果
              </div>
              <div class="conbody">
                <el-input v-model="data.analysisResult" maxlength="1500" show-word-limit type="textarea" placeholder="请输入研判结果" clearable />
              </div>
            </div>
          </el-card>
        </div>
        <div class="w-full h-[65%] pb-1">
          <el-card class="w-full h-full">
            <div class="w-full h-full">
              <div class="title flex items-center">
                <div class="mnjkg mr-[6px]"></div>
                辅助决策
              </div>
              <div class="conbody">
                <div class="h-8 flex items-center">
                  <div class="flex-1 text-right">
                    <el-button type="primary" plain class="ml-4" :icon="Plus" size="small" @click="addRowClick">添加</el-button>
                    <el-button type="primary" plain class="ml-4" :icon="Delete" size="small" @click="deleteClick">删除</el-button>
                  </div>
                </div>
                <el-table :data="data.fzjcData" ref="fzjcDataRef" :show-header="false" border size="small" @row-click="onClickEdit" style="height: calc(100% - 32px)">
                  <el-table-column type="selection" width="35" align="center" />
                  <el-table-column prop="content" label="内容" align="left">
                    <template #default="scope">
                      <span v-show="scope.$index !== data.editIndex">
                        {{ scope.row.content }}
                      </span>
                      <el-input v-show="scope.$index === data.editIndex" v-model="scope.row.content" clearable></el-input>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-card>
        </div>
      </div>
      <Modal class="w-[800px] h-[600px]" title="一键拉群" :footer="false" :closeOnClickModal="false" :draggable="true" headerClass="head-md">
        <MeetingCreate :faultCode="data.faultCode" :faultInfo="data.faultInfo" @closeModal="closeModal"></MeetingCreate>
      </Modal>
      <ModalB class="w-[1200px] h-[800px]" title="群记录" :footer="false" :closeOnClickModal="false" :draggable="true" headerClass="head-md">
        <MeetingRecord :recordType="data.noticeParams.recordType" :module="data.noticeParams.module" :subModule="data.noticeParams.subModule" :busiCode="data.noticeParams.busiCode" :tacheCode="data.noticeParams.tacheCode" :tacheName="data.noticeParams.tacheName" :addable="false" @closeModalB="closeModalB"></MeetingRecord>
      </ModalB>
    </div>
  </Page>
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElForm, ElFormItem, ElRow, ElCol, ElCard, ElNotification, ElMessage, ElImage, ElPagination, ElLink } from 'element-plus'
import { Expand, View, Tickets, EditPen, Close, Plus, Delete, ChatDotRound, Search, Message } from '@element-plus/icons-vue'
import { useDropStore } from '#/store'
import { faultMeeting, saveAssessResult, queryHistoryFault, downLoadSvg } from '../faultDetailMethod.ts'
import { useVbenModal } from '@vben/common-ui'
import MeetingCreate from '#/views/runDdMgt/meetingMgt/meetingCreate.vue'
import MeetingRecord from  '#/views/runDdMgt/meetingMgt/MeetingRecord.vue'
import { tDateTimeFormat, formatDrop } from '#/utils/commonUtil.ts'
import DrawingBoard from '#/views/basic/common/drawingBoard.vue'
import Panzoom from '@panzoom/panzoom'
import { useRoute } from 'vue-router'

const route = useRoute()
const emit = defineEmits(['analysisOk', 'close'])
const faultData = defineModel('faultData')
const fzjcDataRef = ref()
const dropList = reactive({})
const svgRef = ref()
const panzoom = ref(null)
const data = reactive({
  analysisResult: null,
  faultCode: null,
  svgdata: null,
  fzjcData: [],
  editIndex: null,
  historyData: [],
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0
  },
  noticeParams: {
    recordType: '1',
    module: '3',
    subModule: '1',
    busiCode: '',
    tacheCode: '',
    tacheName: '故障处置'
  },
  moreVisible: false
})
const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close()
  }
})

const [ModalB, modalApiB] = useVbenModal({
  onCancel() {
    modalApiB.close()
  }
})
onMounted(async () => {
  if (route.query.faultCode) {
    data.faultCode = route.query.faultCode
  }
  if (route.query.assessResult) {
    data.analysisResult = route.query.assessResult
  }
  fullContent()
  const dropStore = useDropStore()
  const dropType = ['NSOS_FAULT_STATUS']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)
  let w = svgRef.value.clientWidth
  let h = window.innerHeight

  queryHistoryData()
  await initSvg()
  svgRef.value.children[0].style.width = w + 'px'
  svgRef.value.children[0].style.height = h - 48 + 'px'
  initPanzoom()
  document.body.addEventListener('click', function (event) {
    data.editIndex = null
  })
})
const initSvg = async () => {
  data.svgdata = await downLoadSvg()
}
const initPanzoom = () => {
  panzoom.value = Panzoom(svgRef.value, {
    cursor: 'auto',
    bounds: true,
    overflow: 'hidden', // 溢出
    canvas: true // 是否视为canvas
  })
}
// 监听鼠标滚轮
const svgWheel = (event) => {
  event.preventDefault()
  panzoom.value.zoomWithWheel(event)
  // currentScale.value = panzoom.value.getScale();
}
/**
 * 设置内容全屏 隐藏aside、header
 */
const fullContent = () => {
  // 设置内容全屏
  let aside = document.querySelector(`aside`)
  let header = document.querySelector(`header`)
  if (aside) {
    aside.style.display = 'none'
    // 获取前一个同级元素
    const prevDiv = aside.previousElementSibling
    // 检查是否是 div 元素
    if (prevDiv && prevDiv.tagName === 'DIV') {
      prevDiv.style.display = 'none'
    }
  }
  if (header) {
    // 获取父元素
    const parent = header.parentElement
    if (parent) {
      parent.style.display = 'none'
    }
    const mainEle = document.getElementById('__vben_main_content')
    if (mainEle) {
      mainEle.classList.add('no-margin')
    }
  }
}
const queryHistoryData = async () => {
  let query = {
    faultCode: data.faultCode
    //faultSys: faultData.value.faultSys,
    // endFaultOccurTime: faultData.value.faultOccurTime
  }
  query.pageSize = data.pageInfo.pageSize
  query.pageNo = data.pageInfo.pageNo

  const { list, count, pageNo } = await queryHistoryFault(query, { showmask: false })
  data.historyData = list
  data.pageInfo.pageNo = pageNo
  data.pageInfo.total = count
}
const handleSizeChange = (val) => {
  data.pageInfo.pageSize = val
  queryFlawAllByPage()
}
const currentChange = (val) => {
  data.pageInfo.pageNo = val
  queryFlawAllByPage()
}
const faultMeetingClick = async () => {
  await faultMeeting({ faultCode: data.faultCode })
  modalApi.open()
}

const meetingRecordClick = async () => {
  data.noticeParams.busiCode = data.faultCode
  data.moreVisible = false
  modalApiB.open()
}

const saveAssessResultClick = async () => {
  try {
    await saveAssessResult({ faultCode: data.faultCode, assessResult: data.analysisResult })
    window.opener.postMessage(data.analysisResult, location.origin)
    ElNotification({
      title: '提示',
      message: '保存成功！',
      type: 'success'
    })
  } catch (error) {
    ElMessage.error('保存失败！')
  }
}

const addRowClick = async () => {
  data.fzjcData.push({ key: new Date().getTime().toString(), faultCode: data.faultCode })
  data.editIndex = data.fzjcData.length - 1
  event.stopPropagation()
}
const deleteClick = () => {
  let rows = fzjcDataRef.value.getSelectionRows()
  console.log(rows)
  if (rows.length == 0) {
    ElMessage.warning('请勾选记录！')
    return
  }
  rows.forEach((r) => {
    for (let i = 0; i < data.fzjcData.length; i++) {
      if ((r.id && data.fzjcData[i].id == r.id) || (r.key && data.fzjcData[i].key == r.key)) {
        data.fzjcData.splice(i, 1)
      }
    }
  })
}
const onClickEdit = (row, column, event) => {
  if (column.label != '操作') {
    data.editIndex = data.fzjcData.indexOf(row)
  }
  event.stopPropagation()
}
const saveData = () => {
  emit('analysisOk', data.analysisResult)
}
const handleExitDrawingBoard = () => {}
const close = () => {
  emit('close')
}
const closeModal = () => {
  modalApi.close()
}

const closeModalB = () => {
  modalApiB.close()
}

defineExpose({})
</script>
<style scoped>
.primary {
  color: hsl(var(--primary));
}

:deep(.el-card__body) {
  height: 100%;
  padding: 0;
}

:deep(.el-textarea__inner) {
  min-height: 100% !important;
}

:deep(.el-textarea) {
  height: 100% !important;
}

:deep(.el-table-column--selection .cell) {
  padding: 0;
}

:deep(.el-table .cell) {
  line-height: normal;
}

.popover {
  display: flex;
  align-items: center;
  margin-right: 16px;
  font-size: 13px;
  cursor: pointer;
}

.title {
  height: 30px;
  padding-left: 10px;
  font-size: 12px;
  font-weight: bold;
  line-height: 30px;
  color: hsl(var(--primary));
  background: #d9e9fc;
}

.mnjkg {
  width: 4px;
  height: 13px;
  background: #4266ff;
  border-radius: 4px;
  box-shadow: 3px 2px 1px #b2c2ff;
}

.conbody {
  height: calc(100% - 30px);
}

.drawing-board {
  position: absolute;
  top: 15px;
  left: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
}

.svg-main {
  width: 100%;
  height: calc(100% - 40px);
}

.svgcss {
  width: 100%;
  height: 100%;
}

svg {
  width: 100px;
  height: 100px;
}
</style>
<style>
.no-margin {
  margin-top: 0 !important;
}

.svgcss svg {
  width: 100%;
  height: 100%;
}
</style>
