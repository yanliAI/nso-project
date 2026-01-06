<!-- 日历填报组件 -->
<template>
  <div class="h-full w-full overflow-hidden">
    <div class="h-full p-1">
      <div style="height: 45px; padding: 0 3px">
        <div class="bg-white p-0">
          <el-row class="mb-2 mt-2 items-center">
            <el-col :span="12">
              <span class="w-20 text-right text-sm text-gray-700">排班时间：</span>
              <el-date-picker v-model="dutyStartTime" type="datetime" readonly> </el-date-picker>
              <span class="w-10 text-right text-sm text-gray-700"> - </span>
              <el-date-picker v-model="dutyEndTime" type="datetime" readonly> </el-date-picker>
            </el-col>
            <el-col :span="12" style="display: flex; justify-content: flex-end">
              <el-button type="primary" style="min-width: 120px" :icon="Tickets" @click="openAutoDuty()">自动排班</el-button>
              <el-button type="primary" style="min-width: 100px" :icon="Position" @click="upReportTask()">上报</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
      <div style="height: 550px; overflow: auto">
        <CalendarPart ref="calendarPart" :dutyTaskId="dutyTaskId" :taskData="taskData" v-if="showCalendar" :key="calendarKey" @refreshCalendar="refreshCalendar"></CalendarPart>
      </div>
    </div>
    <!-- 自动排班弹窗 -->
    <Modal class="w-[90%] h-[100%]" title="自动排班" :closeOnClickModal="false" :draggable="true" :closeOnPressEscape="false" headerClass="head-md" footerClass="modal-footer" :showConfirmButton="false" :showCancelButton="false">
      <AutoDutyModel ref="autoDutyModel" :taskData="taskData"></AutoDutyModel>
      <template #footer>
        <el-button type="primary" :icon="Tickets" @click="handleAutoGen()">生成</el-button>
        <el-button type="info" :icon="Close" @click="modalApi.close()">取消</el-button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ElCheckbox, ElCheckboxGroup, ElRow, ElCol, ElButtonGroup, ElDialog, ElForm, ElButton, ElInput, ElContainer, ElHeader, ElMain, ElDatePicker, ElMessage } from 'element-plus'
import { Page } from '@vben/common-ui'
import { ref, reactive, onMounted, defineProps, defineEmits } from 'vue'
import { Search, Position, Tickets, Close } from '@element-plus/icons-vue'
import { queryTemplateApi } from '../../taskPublish/taskPublishMethod.ts'
import CalendarPart from './CalendarPart.vue'
import ts from './calendarFillUtils'
import { useVbenModal } from '@vben/common-ui'
import { shiftModeOptions, groupRoleOptions, personRoleOptions } from './options.ts'
import { upReport } from '../dutyTaskFillMethods.ts'
import { formatDate, formatDateTime } from '#/utils/commonUtil.ts'
import AutoDutyModel from './autoDutyModel.vue'
const props = defineProps({
  taskData: {
    type: Object,
    default: {}
  }
})
const emit = defineEmits(['refreshList'])
const autoDutyModel = ref()
const calendarPart = ref()
// 用于刷新日历部分
const showCalendar = ref(true)
const calendarKey = ref(0)
const dutyTaskId = defineModel('dutyTaskId')
const input = ref('')
const bigTitle = ref('2025年护网排班')
// const activeOrgRole = ref([])

const dutyStartTime = ref(null)
const dutyEndTime = ref(null)

onMounted(async () => {
  dutyStartTime.value = props.taskData.dutyStartTime
  dutyEndTime.value = props.taskData.dutyEndTime
})

// 弹窗弹出控制
const openAutoDuty = () => {
  modalApi.open()
}
const [Modal, modalApi] = useVbenModal({
  // onCancel() {
  //   modalApi.close()
  // },
  // onConfirm() {
  //   genRosterData()
  //   modalApi.close()
  // }
})
// function getActiveOrgRoles(orgRoles) {
//   activeOrgRole.value = orgRoles
// }
function handleAutoGen() {
  genRosterData()
}
// 上报
async function upReportTask() {
  let calendarData = calendarPart.value.calendarData
  //校验是否填报了所有日期
  let dutyDay = Math.ceil((dutyEndTime.value - dutyStartTime.value) / (1000 * 60 * 60 * 24))
  let haveFilledDay = Object.keys(calendarData.dataMap).length
  if (haveFilledDay < dutyDay) {
    ElMessage({ type: 'error', message: '上报失败! 请完成所有排班时间填报' })
    return
  }

  // 根据模板id 获取组织名称信息
  const list = await queryTemplateApi({ templateId: props.taskData.templateId })
  let listByDeptCode = list.filter((item) => item.deptCode === props.taskData.receiveDeptCode)
  let allOrgInDept = listByDeptCode.map((item) => (item = item.orgName))

  //校验是否所有组织和人员都填报好
  let allOrgRoles = [...allOrgInDept].sort()
  for (let day in calendarData.dataMap) {
    if (calendarData.dataMap.hasOwnProperty(day)) {
      //校验排班日期是否填报正确
      if (Date.parse(day + ' 23:59:59') < dutyStartTime.value || Date.parse(day) >= dutyEndTime.value) {
        ElMessage({ type: 'error', message: `上报失败! ${day}日值班信息未填报` })
        return
      }

      let DayData = calendarData.dataMap[day]
      let orgRoles = []
      for (let org in DayData) {
        orgRoles.push(org)
        //校验排班人员是否填报正确
        let manNameList = listByDeptCode.filter((item) => item.orgName === org)[0].manName
        for (let man of manNameList) {
          console.log(DayData[org][man])
          if (!DayData[org][man] || DayData[org][man].dutyPerson === null || !DayData[org][man].dutyPhone === null || !DayData[org][man].dutyShift === null) {
            ElMessage({ type: 'error', message: `上报失败! ${day}日，${org}的${man}值班信息未填报` })
            return
          }
        }
      }
      //校验排班组织是否填报正确
      let orgRolesSorted = [...orgRoles].sort()
      if (allOrgInDept.length !== orgRoles.length && !allOrgRoles.every((value, index) => value === orgRolesSorted[index])) {
        ElMessage({ type: 'error', message: '上报失败! 有待填报的组织值班信息' })
        return
      }
    }
  }

  const taskData = props.taskData
  let updateVo = {
    dutyTaskId: taskData.id,
    deptCode: taskData.receiveDeptCode
  }
  const result = await upReport(updateVo)
  if (result) {
    emit('refreshList')
    ElMessage({ type: 'success', message: '上报成功!' })
  } else {
    ElMessage({ type: 'error', message: '上报失败! 请确认是否填报数据' })
  }
}
async function genRosterData() {
  if (autoDutyModel.value) {
    const result = await autoDutyModel.value.getFormData()
    console.log('自动生成结果 :>>', result)
    if (result && calendarPart.value) {
      // await calendarPart.value.getRosterDataList(props.taskData)
      calendarKey.value++
      modalApi.close()
    }
  }
}
function refreshCalendar() {
  calendarKey.value++
}
</script>

<style scope>
:deep(.head-md h2) {
  font-size: 14px;
}

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

.modal-footer {
  justify-content: center;
}
</style>
