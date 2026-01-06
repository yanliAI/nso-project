<template>
  <div class="main-dg">
    <div class="gbzjd">
      <el-anchor class="jknb" :offset="90" type="default" :container="containerRef" direction="vertical" @click="handleClick">
        <el-anchor-link href="#part1" title="故障信息"></el-anchor-link>
        <el-anchor-link ref="anchorLink2" href="#part2" title="技术复盘"></el-anchor-link>
        <el-anchor-link href="#part3" title="故障简报"></el-anchor-link>
        <el-anchor-link href="#part4" title="故障分析报告"></el-anchor-link>
        <el-anchor-link href="#part5" title="故障整改"></el-anchor-link>
      </el-anchor>
    </div>
    <div class="ma-tabm">
      <div class="head-c">
        <div class="head-d">
          <div class="text-center font-bold text-lg mb-1">故障工单详情</div>
          <div class="flex items-center h-6">
            <div>
              故障单号：<span class="primary">{{ data.faultData.faultCode }}</span>
              <el-icon class="primary" style="margin-left: 3px; cursor: pointer" title="复制" @click="copyFaultCode(data.faultData.faultCode)"><CopyDocument /></el-icon>
            </div>
            <div class="ml-10">问题来源：<span class="grey">运维报障</span></div>
            <div class="flex-1 text-right pr-2" v-if="right.operate">
              <el-button type="primary" class="ml-4" :icon="Finished" @click="complateReplayClick" size="small">完成复盘</el-button>
            </div>
          </div>
        </div>
      </div>
      <div ref="containerRef" class="btm-c">
        <div class="btm-d">
          <el-collapse v-model="activeNames">
            <el-collapse-item title="故障信息" :icon="CaretRight" name="1">
              <template #title>
                <div class="flex items-center h-full primary flex-1">
                  <div class="mnjkg mt-[-1px] mr-[2px]"></div>
                  <div class="ml-1 font-bold">故障信息</div>
                  <div class="flex-1 text-right mt-[1px]" v-if="right.operate">
                    <el-button type="primary" class="mr-0" :icon="Tickets" @click="saveGzxx($event)" size="small">保存</el-button>
                  </div>
                </div>
              </template>
              <div id="part1" class="part-b">
                <FaultFillIn ref="basicInfoRef" :formData="data.faultData" :disabled="!right.operate" />
              </div>
            </el-collapse-item>
            <el-collapse-item title="技术复盘" :icon="CaretRight" name="2">
              <template #title>
                <div class="flex items-center primary h-full flex-1">
                  <div class="mnjkg mt-[-1px] mr-[2px]"></div>
                  <div class="ml-1 font-bold">技术复盘</div>
                  <div class="flex-1 text-right mt-[1px]">
                    <el-button type="primary" class="mr-0" :icon="Tickets" @click="jsfpSaveData($event)" size="small" v-if="right.operate">保存</el-button>
                    <el-button type="primary" class="mr-0" :icon="Bottom" @click.stop="genReport($event)" size="small" v-if="right.operate">生成报告</el-button>
                    <!-- <el-button type="primary" class="mr-0" :icon="Bottom" @click.stop="simpleReportClick($event)" size="small" v-if="right.operate">生成简报</el-button> -->
                  </div>
                </div>
              </template>
              <div id="part2" class="part-b">
                <SkillReplay ref="skillReplayRef" :faultData="data.faultData" :disabled="!right.operate" />
              </div>
            </el-collapse-item>
            <el-collapse-item title="故障简报" :icon="CaretRight" name="3">
              <template #title>
                <div class="flex items-center primary h-full flex-1">
                  <div class="mnjkg mt-[-1px] mr-[2px]"></div>
                  <div class="ml-1 font-bold">故障简报</div>
                  <div class="flex-1 text-right mt-[1px]">
                    <!-- <el-button type="primary" class="mr-0" :icon="Bottom" @click.stop="analyseReportClick($event)" size="small" v-if="right.operate">同步到故障报告</el-button> -->
                  </div>
                </div>
              </template>
              <div id="part3" class="part-b">
                <FaultBriefing ref="faultBriefingRef" :formData="data.faultData" :disabled="!right.operate" />
              </div>
            </el-collapse-item>
            <el-collapse-item title="故障分析报告" :icon="CaretRight" name="4">
              <template #title>
                <div class="flex items-center primary h-full flex-1">
                  <div class="mnjkg mt-[-1px] mr-[2px]"></div>
                  <div class="ml-1 font-bold">故障分析报告</div>
                </div>
              </template>
              <div id="part4" class="part-b">
                <AnalysisReport ref="analysisReportRef" :formData="data.faultData" :disabled="!right.operate" />
              </div>
            </el-collapse-item>
            <el-collapse-item title="故障整改" :icon="CaretRight" name="5">
              <template #title>
                <div class="flex items-center primary h-full flex-1">
                  <div class="mnjkg mt-[-1px] mr-[2px]"></div>
                  <div class="ml-1 font-bold">故障整改</div>
                  <div class="flex-1 text-right mt-[2px]" v-if="right.operate">
                    <el-button type="primary" class="mr-2" :icon="Download" @click="importMeasure($event)" size="small">导入措施</el-button>
                  </div>
                </div>
              </template>
              <div id="part5" class="part-b">
                <FaultCorrection ref="faultCorrectionRef" :formData="data.faultData" :disabled="!right.operate" />
              </div>
            </el-collapse-item>
          </el-collapse>
          <div style="height: 150px"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ElAnchor, ElAnchorLink, ElCollapse, ElCollapseItem, ElNotification, ElMessage, ElMessageBox } from 'element-plus'
import { Tickets, Finished, Expand, CaretRight, Bottom, Download, CopyDocument } from '@element-plus/icons-vue'
import { ref, reactive, onMounted, nextTick } from 'vue'
import FaultFillIn from '../faultLogDetail/faultFillIn.vue'
import SkillReplay from './skillReplay.vue'
import FaultCorrection from './faultCorrection.vue'
import FaultBriefing from './faultBriefing.vue'
import AnalysisReport from './analysisReport.vue'
import { initFaultInfo, saveFaultInfo, formatDate } from '../faultLogDetail/faultDetailMethod.ts'
import { complateReplay, generateSimpleReport, generateAnalyseReport, generateReport } from './replayDetailMethod.ts'
import { useUserStore } from '@vben/stores'
import { copyText } from '#/utils/commonUtil.ts'

const props = defineProps({
  faultId: {
    type: String,
    required: true,
    default: ''
  },
  readonly: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['refreshList', 'close'])
const containerRef = ref(null)
const activeNames = ref(['1', '2', '3', '4', '5'])
const basicInfoRef = ref()
const skillReplayRef = ref()
const faultBriefingRef = ref()
const analysisReportRef = ref()
const faultCorrectionRef = ref()

const anchorRef = ref(null)

const data = reactive({
  faultData: {}
})
const userStore = useUserStore()

// 权限设置
const right = reactive({
  operate: false
})
const setRight = async (status) => {
  // 1.如果页面参数readonly指定为只读，或者该故障单已复盘，则整个页面不可编辑，不作其它判断
  if (!props.readonly && status === '2') {
    // 判断当前登录人岗位是否包含”网级运调中心“
    if (userStore.userInfo && userStore.userInfo.rolecodes && userStore.userInfo.rolecodes.includes('1001')) {
      right.operate = true
    }
  }
}

onMounted(async () => {
  const res = await initFaultInfo({ id: props.faultId })
  setRight(res.replayStatus)
  data.faultData = res
  data.faultData.faultOccurTime = formatDate(data.faultData.faultOccurTime)
})

const complateReplayClick = async (e) => {
  ElMessageBox.confirm('确认是否完成复盘?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await complateReplay({ id: data.faultData.id })
      ElNotification({
        title: '提示',
        message: '完成复盘成功！',
        type: 'success'
      })
      emit('refreshList', false)
      emit('close')
    } catch (error) {
      console.error('完成复盘失败！', error)
    }
  })
}

// 保存故障信息
const saveGzxx = async (e) => {
  basicInfoRef.value.saveData()
  e.stopPropagation()
}

const jsfpSaveData = async (e) => {
  skillReplayRef.value.saveData()
  emit('refreshList', false)
  e.stopPropagation()
}
const gzjbSaveData = async (e) => {
  faultBriefingRef.value.saveData()
  e.stopPropagation()
}
const fxbgSaveData = async (e) => {
  analysisReportRef.value.saveData()
  e.stopPropagation()
}

// 生成简报
const simpleReportClick = async (e) => {
  ElMessageBox.confirm('若简报已生成，该操作将会覆盖已有的简报，确认生成?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await generateSimpleReport(data.faultData.id)
      ElMessage.success('故障简报已生成！')
      faultBriefingRef.value.refreshAttachmentList()
    })
    .catch((err) => {})
  e.stopPropagation()
}

// 生成故障分析报告
const analyseReportClick = async (e) => {
  ElMessageBox.confirm('若分析报告已生成，该操作将会覆盖已有的分析报告，确认生成?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await generateAnalyseReport(data.faultData.id)
      ElMessage.success('故障分析报告已生成！')
      analysisReportRef.value.refreshAttachmentList()
    })
    .catch((err) => {})
  e.stopPropagation()
}

// 生成报告（包括简报和分析报告）
const genReport = async (e) => {
  ElMessageBox.confirm('若报告已生成，该操作将会覆盖已有的报告，确认生成?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await generateReport(data.faultData.id)
      ElMessage.success('故障简报和故障分析报告已生成！')
      faultBriefingRef.value.refreshAttachmentList()
      analysisReportRef.value.refreshAttachmentList()
    })
    .catch((err) => {})
  e.stopPropagation()
}

const handleClick = (e) => {
  e.preventDefault()
}

// 导入措施
const importMeasure = async (e) => {
  faultCorrectionRef.value.importMeasure()
  e.stopPropagation()
}

// 复制故障单号
const copyFaultCode = async (text) => {
  if (copyText(text)) {
    ElMessage.success(text + '已复制到剪切板！')
  }
}
</script>
<style scoped>
/* 滚动条样式 **/
div::-webkit-scrollbar {
  width: 6px;
}

div::-webkit-scrollbar-track {
  border-radius: 4px;
}

div::-webkit-scrollbar-thumb {
  border-radius: 10px;
}

:deep(.el-collapse-item__header) {
  height: 35px;
  padding-left: 8px;
  line-height: normal;
  background: #d9e9fc;
}

.primary {
  color: hsl(var(--primary));
}

.grey {
  color: #8e8e93;
}

.main-dg {
  display: flex;
  width: 100%;
  height: 100%;
  background: #fff;
}

.ma-tabm {
  width: 100%;
  height: 100%;
  margin: auto;
  font-size: 12px;
  background: #fff;
}

.gbzjd {
  position: absolute;
  top: 0;
  left: 0;
  width: 20%;
}

.jknb {
  width: 60%;
  margin: auto;
  margin-top: 100px;
}

.head-d {
  width: 1050px;
  height: 100%;
  margin: auto;
}

head-c {
  width: 100%;
  height: 62px;
}

.btm-d {
  width: 1050px;
  height: 100%;
  margin: auto;
}

.btm-c {
  width: 100%;
  height: calc(100% - 62px);
  overflow: auto;
}

.part-d {
  height: 300px;
}

.mnjkg {
  width: 4px;
  height: 13px;
  background: #4266ff;
  border-radius: 4px;
  box-shadow: 3px 2px 1px #b2c2ff;
}

.part-b {
  border-top: 1px solid #c4dbf5;
}
</style>
