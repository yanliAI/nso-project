<template>
  <div>
    <div class="mt-[10px]">
      <div class="hsihdg flex items-center primary">
        <div class="mnjkg mt-[-1px] mr-[2px]"></div>
        <div class="ml-1 font-bold">设置值</div>
      </div>
      <el-form label-width="90px" :model="data.curDuty" :inline="true" label-position="right" class="demo-form-inline mt-[10px]">
        <el-row>
          <el-col :span="6">
            <el-form-item label="选择班次:" prop="commandCode">
              <el-select v-model="data.shiftId" @change="shiftChange" filterable clearable :disabled="data.cmdType">
                <el-option v-for="item in data.shiftDrop" :key="item.SHIFT_ID" :label="item.SHIFT_NAME" :value="item.SHIFT_ID" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="值长:" prop="commandTitle">
              <el-input v-model="data.shiftzz" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table ref="tableDataRef" :data="data.shiftOperList" size="small"  show-overflow-tooltip style="height: 280px" stripe>
        <el-table-column type="selection" width="40" fixed align="center" />
        <el-table-column type="index" fixed width="45" label="#" align="center" />
        <el-table-column prop="dutyName" label="值班员" align="center" header-align="center" />
        <el-table-column prop="postType" label="岗位" column-key="NSOS_PB_POST" :formatter="formatDrop" align="center" header-align="center" />
        <el-table-column prop="startTime" label="值班开始时间" align="center" :formatter="tDateTimeFormat" header-align="center" />
        <el-table-column prop="endTime" label="值班结束时间" align="center" :formatter="tDateTimeFormat" header-align="center" />
      </el-table>
    </div>
    <div class="text-center pt-[25px]">
      <el-button type="primary" class="ml-4" @click="comfirmShiftClick" :icon="Promotion">确定</el-button>
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
  shiftOperList: [],
  shiftId: null,
  shiftzz: null,
  shiftDrop: null
})
const dutyRole = ref({})
const dropList = reactive({})
onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = ['NSOS_PB_POST']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)

  query()
})
const query = async () => {
  data.shiftDrop  = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/workforceManager/queryShiftDrop')
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
  if (data.shiftId == '') {
    ElMessage.error('请选择班次！')
    return;
  }
  ElMessageBox.confirm('确认是否设置当前值? 此次操作会把当前值班和交班中的记录设为非当值，请谨慎操作！', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await requestClient.get(import.meta.env.VITE_NSOSGZ + '/handoverList/setCurDuty', { params: { shiftId: data.shiftId } })

      ElNotification({
        title: '提示',
        message: '设置当前值成功！',
        type: 'success'
      })
      emit('afterShiftDuty')
    } catch (error) {
      ElMessage.error('设置当前值失败！')
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

.mnjkg {
  width: 4px;
  height: 13px;
  background: #4266ff;
  border-radius: 4px;
  box-shadow: 3px 2px 1px #b2c2ff;
}

.hsihdg {
  height: 35px;
  padding-left: 8px;
  font-size: 14px;
  background: #d9e9fc;
}

.blinking-text {
  animation: blink 1.5s infinite;
}

.primary {
  color: hsl(var(--primary));
}

@keyframes blink {
  0% { opacity: 1; }

  50% { opacity: 0.4; }

  100% { opacity: 1; }
}
</style>
