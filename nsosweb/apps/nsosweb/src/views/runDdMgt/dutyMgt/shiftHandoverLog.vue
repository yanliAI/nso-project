<template>
  <div class="main-dg">
    <div class="gbzjd">
      <el-anchor class="jknb" type="default" :container="containerRef" direction="vertical" @click="handleClick">
        <el-anchor-link href="#gj" title="安全告警"></el-anchor-link>
        <el-anchor-link href="#gjgd" title="告警工单"></el-anchor-link>
        <el-anchor-link href="#ld" title="安全隐患"></el-anchor-link>
        <el-anchor-link href="#gz" title="故障"></el-anchor-link>
        <el-anchor-link href="#zl" title="指令"></el-anchor-link>
        <el-anchor-link href="#zy" title="作业"></el-anchor-link>
        <el-anchor-link href="#yxfs" title="特殊运行方式"></el-anchor-link>
        <el-anchor-link href="#zb" title="重保"></el-anchor-link>
        <el-anchor-link href="#qt" title="其他"></el-anchor-link>
      </el-anchor>
    </div>
    <div class="ma-tabm">
      <div class="head-d">
        <div class="text-center font-bold text-lg mt-0">交接班日志</div>
        <div class="flex items-center h-6">
          <span class="ml-2 w-[130px]">班次：{{ data.curDuty.shiftName }}</span>
          <span class="ml-2">值长：{{ data.curzz }}</span>
          <div class="flex-1 text-right pr-2">
            <el-button type="primary" plain class="ml-4" @click="backCurClick" :icon="Back" :disabled="data.backDsiabled" size="small">返回当值</el-button>
            <el-button type="primary" class="ml-4" v-if="!shiftId" @click="saveDutyLogClick" :icon="Tickets" :disabled="data.saveDsiabled" size="small">保存</el-button>
            <el-button type="primary" class="ml-4" v-if="!shiftId" @click="genDutyLogClick" :icon="EditPen" :disabled="data.genDsiabled" size="small">生成日志</el-button>
            <el-button type="primary" class="ml-4" @click="queryUpperClick" :icon="Search" size="small">上班次日志</el-button>
          </div>
        </div>
      </div>
      <div ref="containerRef" class="btm-d">
        <div id="gj" name="gj">
          <div class="hsihdg flex items-center primary">
            <div class="mnjkg mt-[-1px] mr-[2px]"></div>
            <div class="ml-1 font-bold">安全告警</div>
          </div>
          <div  class="mt-2 mb-2">
            <el-input v-model="data.curDutyLog.aqWarming" type="textarea" :rows="6" maxlength="2600" show-word-limit/>
          </div>
        </div>
        <div id="gjgd" name="gjgd">
          <div class="hsihdg flex items-center primary">
            <div class="mnjkg mt-[-1px] mr-[2px]"></div>
            <div class="ml-1 font-bold">告警工单</div>
          </div>
          <div class="mt-2 mb-2">
            <el-input v-model="data.curDutyLog.gjOrder" type="textarea" :rows="6" maxlength="2600" show-word-limit/>
          </div>
        </div>
        <div id="ld" name="ld">
          <div class="hsihdg flex items-center primary">
            <div class="mnjkg mt-[-1px] mr-[2px]"></div>
            <div class="ml-1 font-bold">安全隐患</div>
          </div>
          <div class="mt-2 mb-2">
            <el-input v-model="data.curDutyLog.aqDanger" type="textarea" :rows="6" maxlength="2600" show-word-limit/>
          </div>
        </div>
        <div id="gz" name="gz">
          <div class="hsihdg flex items-center primary">
            <div class="mnjkg mt-[-1px] mr-[2px]"></div>
            <div class="ml-1 font-bold">故障</div>
          </div>
          <div class="mt-2 mb-2">
            <el-input v-model="data.curDutyLog.gzReport" type="textarea" :rows="6" maxlength="2600" show-word-limit/>
          </div>
        </div>
        <div id="zl" name="zl">
          <div class="hsihdg flex items-center primary">
            <div class="mnjkg mt-[-1px] mr-[2px]"></div>
            <div class="ml-1 font-bold">指令</div>
          </div>
          <div class="mt-2 mb-2">
            <el-input v-model="data.curDutyLog.command" type="textarea" :rows="6" maxlength="2600" show-word-limit/>
          </div>
        </div>
        <div id="zy" name="zy">
          <div class="hsihdg flex items-center primary">
            <div class="mnjkg mt-[-1px] mr-[2px]"></div>
            <div class="ml-1 font-bold">作业</div>
          </div>
          <div class="mt-2 mb-2">
            <el-input v-model="data.curDutyLog.zyWork" type="textarea" :rows="6" maxlength="2600" show-word-limit/>
          </div>
        </div>
        <div id="yxfs" name="yxfs">
          <div class="hsihdg flex items-center primary">
            <div class="mnjkg mt-[-1px] mr-[2px]"></div>
            <div class="ml-1 font-bold">特殊运行方式</div>
          </div>
          <div class="mt-2 mb-2">
            <el-input v-model="data.curDutyLog.operationMode" type="textarea" :rows="6" maxlength="2600" show-word-limit/>
          </div>
        </div>
        <div id="zb" name="zb">
          <div class="hsihdg flex items-center primary">
            <div class="mnjkg mt-[-1px] mr-[2px]"></div>
            <div class="ml-1 font-bold">重保</div>
          </div>
          <div class="mt-2 mb-2">
            <el-input v-model="data.curDutyLog.guarantee" type="textarea" :rows="6" maxlength="2600" show-word-limit/>
          </div>
        </div>
        <div id="qt" name="qt">
          <div class="hsihdg flex items-center primary">
            <div class="mnjkg mt-[-1px] mr-[2px]"></div>
            <div class="ml-1 font-bold">其他</div>
          </div>
          <div  class="mt-2 mb-2">
            <el-input v-model="data.curDutyLog.remark" type="textarea" :rows="6" maxlength="2600" show-word-limit/>
          </div>
        </div>
        <div style="height: 100px"></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { Page } from '@vben/common-ui'
import { ElAnchor, ElAnchorLink, ElCollapse, ElCollapseItem, ElNotification, ElMessage, ElMessageBox } from 'element-plus'
import { Search, Tickets, Back, EditPen } from '@element-plus/icons-vue'
import { ref, reactive, onMounted } from 'vue'
import { useDropStore } from '#/store'
import { tDateFormat, formatDateTime, tDateTimeFormat, formatDrop } from '#/utils/commonUtil.ts'
import { requestClient } from '#/api/request'

const shiftId = defineModel('shiftId')
const containerRef = ref(null)

const data = reactive({
  curDuty: {},
  curzz: null,
  curDutyLog: {},
  curDutyLogBak: {},
  backDsiabled: true,
  saveDsiabled: false,
  genDsiabled: false,
})
const dutyLog = reactive({})
const faultFillIn = ref()
onMounted(async () => {
  query()
})
const query = async () => {
  const { curDuty, dutyOperList } = await requestClient.get(import.meta.env.VITE_NSOSGZ + '/handoverList/queryDuty', {params: {shiftId: shiftId.value}})
  data.curDuty = curDuty
  data.dutyOperList = dutyOperList

  if (data.curDuty) data.curDuty.shiftTime = formatDateTime(data.curDuty.shiftTime)
  if (dutyOperList && dutyOperList.length > 0) {
    data.curzz = ''
    dutyOperList.forEach((d) => {
      if (d.postType == '1') {
        data.curzz += d.dutyName + ','
      }
    })
    if (data.curzz.length > 0) {
      data.curzz = data.curzz.substring(0, data.curzz.length - 1)
    }
  }
  queryDutyLog()
}
const queryDutyLog = async () => {
  const dutyLog = await requestClient.get(import.meta.env.VITE_NSOSGZ + '/handoverLog/queryDutyLog', { params: { curShiftId: data.curDuty.shiftId } })
  if (dutyLog) {
    data.curDutyLog = dutyLog
  }
}
const saveDutyLogClick = async () => {
  try {
    await requestClient.post(import.meta.env.VITE_NSOSGZ + '/handoverLog/saveDutyLog', data.curDutyLog)
    ElNotification({
      title: '提示',
      message: '保存成功！',
      type: 'success'
    })
  } catch (error) {
    ElMessage.error('保存失败！')
  }
}
const genDutyLogClick = async () => {
  if (data.curDutyLog && Object.keys(data.curDutyLog).length > 0) {
    ElMessageBox.confirm('已生成值班日志，重复生成会覆盖当前日志，是否继续? ', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      try {
        data.curDutyLog = await requestClient.get(import.meta.env.VITE_NSOSGZ + '/handoverLog/genDutyLog', { params: { curShiftId: data.curDuty.shiftId } })

        ElNotification({
          title: '提示',
          message: '值班日志生成成功！',
          type: 'success'
        })
      } catch (error) {
        ElMessage.error('班日志生成失败！')
      }
    })
  } else {
    try {
      data.curDutyLog = await requestClient.get(import.meta.env.VITE_NSOSGZ + '/handoverLog/genDutyLog', { params: { curShiftId: data.curDuty.shiftId } })

      ElNotification({
        title: '提示',
        message: '值班日志生成成功！',
        type: 'success'
      })
    } catch (error) {
      ElMessage.error('值班日志生成失败！')
    }
  }
}

const backCurClick = () => {
  data.curDutyLog = data.curDutyLogBak
  data.backDsiabled = true
  data.saveDsiabled = false
  data.genDsiabled = false
}
const queryUpperClick = async () => {
  const upDutyLog = await requestClient.get(import.meta.env.VITE_NSOSGZ + '/handoverLog/queryDutyLog', { params: { curShiftId: data.curDuty.lastShiftId } })
  data.curDutyLogBak = {...data.curDutyLog}
  data.curDutyLog = upDutyLog ? upDutyLog : {}
  console.log(data.curDutyLog);
  console.log(data.curDutyLogBak);
  data.backDsiabled = false
  data.saveDsiabled = true
  data.genDsiabled = true
}
const handleClick = (e) => {
  e.preventDefault()
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

:deep(.el-textarea__inner::-webkit-scrollbar) {
  width: 3px;
}

:deep(.el-textarea__inner::-webkit-scrollbar-track) {
  border-radius: 4px;
}

:deep(.el-textarea__inner::-webkit-scrollbar-thumb) {
  border-radius: 10px;
}

.primary {
  color: hsl(var(--primary));
}

.main-dg {
  width: 100%;
  height: 100%;
  background: #fff;
}

.ma-tabm {
  width: calc(100% - 120px);
  height: 100%;
  margin-left: 120px;
  overflow: hidden;
  font-size: 12px;
  background: #fff;
}

.gbzjd {
  position: absolute;
  width: 10%;
  width: 120px;
}

.jknb {
  width: 100px;
  margin: auto;
  margin-top: 100px;
}

.head-d {
  width: 100%;
  height: 52px;
}

.btm-d {
  width: 100%;
  height: 550px;
  padding-top: 7px;
  overflow: auto;
}

.title {
  background-color: #dfeafa;
}

.hsihdg {
  height: 36px;
  padding-left: 8px;
  font-size: 14px;
  background: #d9e9fc;
  border-bottom: 1px solid #c4dbf5;
}

.mnjkg {
  width: 4px;
  height: 13px;
  background: #4266ff;
  border-radius: 4px;
  box-shadow: 3px 2px 1px #b2c2ff;
}
</style>
