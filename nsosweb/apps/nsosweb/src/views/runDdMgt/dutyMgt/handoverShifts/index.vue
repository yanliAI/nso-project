<template>
  <div>
    <div>
      <div class="hsihdg flex items-center primary">
        <div class="mnjkg mt-[-1px] mr-[2px]"></div>
        <div class="ml-1 font-bold">当前值</div>
      </div>
      <el-form label-width="90px" :model="data.curDuty" :inline="true" label-position="right" class="demo-form-inline gbhj mt-[10px]">
        <el-row>
          <el-col :span="6">
            <el-form-item label="当前班次:" prop="commandCode">
              <el-input v-model="data.curDuty.shiftName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="当前值长:" prop="commandTitle">
              <el-input v-model="data.curzz" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="7" v-if="data.curDuty.state == 'J'">
            <el-form-item label="交班时间:">
              <el-date-picker v-model="data.curDuty.shiftTime" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table ref="tableDataRef" :data="data.dutyOperList" size="small" show-overflow-tooltip style="height: 150px" stripe>
        <el-table-column type="selection" width="40" fixed align="center" />
        <el-table-column type="index" fixed width="45" label="#" align="center" />
        <el-table-column prop="dutyName" label="值班员" align="center" header-align="center" />
        <el-table-column prop="postType" label="岗位" column-key="NSOS_PB_POST" :formatter="formatDrop" align="center" header-align="center" />
        <el-table-column prop="startTime" label="值班开始时间" align="center" :formatter="tDateTimeFormat" header-align="center" />
        <el-table-column prop="endTime" label="值班结束时间" align="center" :formatter="tDateTimeFormat" header-align="center" />
      </el-table>
    </div>
    <div class="mt-[10px]">
      <div class="hsihdg flex items-center primary">
        <div class="mnjkg mt-[-1px] mr-[2px]"></div>
        <div class="ml-1 font-bold">接班值</div>
        <div class="flex-1 text-right blinking-text text-[red]" v-if="data.curDuty.state == 'Y' && data.resultFlag == '1'">警告：未查询到下一接班值，无法交班！</div>
        <div class="flex-1 text-right blinking-text text-[red]" v-if="data.curDuty.state == 'Y' && data.resultFlag == '2'">警告：当前时间已超过下一班次的值班结束时间，无法交班！请联系管理员！</div>
      </div>
      <el-form label-width="90px" :model="data.curDuty" :inline="true" label-position="right" class="demo-form-inline mt-[10px]">
        <el-row>
          <el-col :span="6">
            <el-form-item label="接班班次:" prop="commandCode">
              <!-- <el-select v-if="data.curDuty.state == 'Y'" v-model="data.shiftId" @change="shiftChange" filterable clearable :disabled="data.cmdType">
                <el-option v-for="item in data.shiftDrop" :key="item.SHIFT_ID" :label="item.SHIFT_NAME" :value="item.SHIFT_ID" />
              </el-select> -->
              <el-input disabled :value="data.nextDuty?.shiftName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="接班值长:" prop="commandTitle">
              <el-input v-model="data.shiftzz" disabled />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="7" v-if="data.curDuty.state == 'J'">
            <el-form-item label="交班时间:">
              <el-date-picker v-model="data.nextDuty.shiftTime" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" disabled />
            </el-form-item>
          </el-col> -->
        </el-row>
      </el-form>
      <el-table ref="tableDataRef" :data="data.shiftOperList" size="small"  show-overflow-tooltip style="height: 150px" stripe>
        <el-table-column type="selection" width="40" fixed align="center" />
        <el-table-column type="index" fixed width="45" label="#" align="center" />
        <el-table-column prop="dutyName" label="值班员" align="center" header-align="center" />
        <el-table-column prop="postType" label="岗位" column-key="NSOS_PB_POST" :formatter="formatDrop" align="center" header-align="center" />
        <el-table-column prop="startTime" label="值班开始时间" align="center" :formatter="tDateTimeFormat" header-align="center" />
        <el-table-column prop="endTime" label="值班结束时间" align="center" :formatter="tDateTimeFormat" header-align="center" />
      </el-table>
    </div>
    <div class="text-center pt-[25px]">
      <el-button type="primary" class="ml-4" v-if="data.curDuty.state == 'Y'" @click="comfirmShiftClick" :icon="Promotion" :disabled="data.nextDuty == null || dutyRoles.isCurDuty == false">确认交班</el-button>
      <el-button type="primary" class="ml-4" v-if="data.curDuty.state == 'J'" @click="comfirmReceive" :icon="Promotion" :disabled="data.nextDuty == null || dutyRoles.isNextDuty === false">确认接班</el-button>
      <el-button type="info" class="ml-4" :icon="Close" @click="emit('close')">取消</el-button>
    </div>
  </div>
</template>
<script setup>
import { Promotion, Close } from '@element-plus/icons-vue'
import { onMounted, reactive, ref, watch } from 'vue'
import { requestClient } from '#/api/request'
import { useDropStore } from '#/store'
import { tDateFormat, formatDateTime, tDateTimeFormat, formatDrop } from '#/utils/commonUtil.ts'
import { ElMessageBox, ElMessage, ElNotification } from 'element-plus'

const emit = defineEmits(['close', 'afterShiftDuty'])
const data = reactive({
  curDuty: {},
  nextDuty: {},
  curzz: null,
  dutyOperList: [],
  shiftOperList: [],
  shiftId: null,
  shiftzz: null,
  shiftDrop: null
})
const dutyRoles = ref({})
const dropList = reactive({})
onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = ['NSOS_PB_POST']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)

  query()
})
const query = async () => {
  const { curDuty, dutyOperList, resultFlag, nextDuty, nextDutyOperList, dutyRole } = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/handoverList/queryDuty')
  dutyRoles.value = dutyRole
  data.curDuty = curDuty
  data.dutyOperList = dutyOperList
  data.resultFlag = resultFlag
  data.nextDuty = nextDuty

  data.shiftOperList = nextDutyOperList
  if (data.curDuty) data.curDuty.shiftTime = formatDateTime(data.curDuty.shiftTime)
  if (data.nextDuty) data.nextDuty.shiftTime = formatDateTime(data.nextDuty.shiftTime)
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
  if (nextDutyOperList && nextDutyOperList.length > 0) {
    data.shiftzz = ''
    nextDutyOperList.forEach((d) => {
      if (d.postType == '1') {
        data.shiftzz += d.dutyName + ','
      }
    })
    if (data.shiftzz.length > 0) {
      data.shiftzz = data.shiftzz.substring(0, data.shiftzz.length - 1)
    }
  }
}
const shiftChange = async () => {
  if (data.shiftId == null) {
    data.shiftzz = ''
    data.shiftOperList = null
    return;
  }
  data.shiftOperList = await requestClient.get(import.meta.env.VITE_NSOSGZ + '/workforceManager/queryOperByShiftId', { params: { shiftId: data.shiftId } })
  if (data.shiftOperList && data.shiftOperList.length > 0) {
    data.shiftzz = ''
    data.shiftOperList.forEach((d) => {
      if (d.postType == '1') {
        data.shiftzz += d.dutyName + ','
      }
    })
    if (data.shiftzz.length > 0) {
      data.shiftzz = data.shiftzz.substring(0, data.shiftzz.length - 1)
    }
  }
}
const comfirmShiftClick = async () => {
  if (data.nextDuty == null || data.shiftId == '') {
    ElMessage.error('请选择接班班次！')
    return;
  }
  ElMessageBox.confirm('确认是否交班? 如果未生成值班日志，系统会默认生成当前班次的日志！', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await requestClient.get(import.meta.env.VITE_NSOSGZ + '/handoverList/comfirmShift', { params: { curShiftId: data.curDuty.shiftId, nextShiftId: data.nextDuty.shiftId } })

      ElNotification({
        title: '提示',
        message: '交班成功！',
        type: 'success'
      })
      emit('afterShiftDuty')
    } catch (error) {
      ElMessage.error('交班失败！')
    }
  })
}
const comfirmReceive = async () => {
  ElMessageBox.confirm('确认是否接班? ', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await requestClient.get(import.meta.env.VITE_NSOSGZ + '/handoverList/comfirmReceive', { params: { curShiftId: data.curDuty.shiftId, nextShiftId: data.nextDuty.shiftId } })

      ElNotification({
        title: '提示',
        message: '接班成功！',
        type: 'success'
      })
      emit('afterShiftDuty')
    } catch (error) {
      ElMessage.error('接班失败！')
    }
  })
}
</script>
<style scoped>
.demo-form-inline .el-input {
  --el-input-width: 100%;
}

.demo-form-inline .el-select {
  --el-select-width: 100%;
}

:deep(.el-input.is-disabled .el-input__inner) {
  color: #006be6 !important;
  -webkit-text-fill-color: #006be6 !important;
}

:deep(.el-input.is-disabled .el-input__wrapper) {
  background-color: #fff;
}

:deep(.el-date-editor.el-input, .el-date-editor.el-input__wrapper) {
  width: 100%;
}

:deep(.el-form--inline .el-form-item) {
  width: 100% !important;
  margin-right: 0 !important;
  margin-bottom: 10px !important;
}

:deep(.el-input__wrapper){
  box-shadow: none!important;
}

.primary {
  color: hsl(var(--primary));
}

.mnjkg {
  width: 4px;
  height: 13px;
  background: #4266ff;
  border-radius: 4px;
  box-shadow: 3px 2px 1px #b2c2ff;
}

.hsihdg {
  height: 36px;
  padding-left: 8px;
  font-size: 14px;
  background: #d9e9fc;
  border-bottom: 1px solid #c4dbf5;
}

.blinking-text {
  animation: blink 1.5s infinite;
}
 
@keyframes blink {
  0% { opacity: 1; }

  50% { opacity: 0.4; }

  100% { opacity: 1; }
}
</style>
