<!-- 日历部分组件 -->
<template>
  <div class="h-full rounded-2xl bg-white p-1 shadow">
    <div class="rounded-lg border shadow-md">
      <el-calendar v-model="calendarValue" ref="calendar">
        <template #date-cell="{ data }">
          <el-tooltip placement="top" :content="toolTipContent(data.day)" raw-content>
            <div style="position: relative" class="h-full">
              <p :class="data.isSelected ? 'is-selected' : ''">
                {{ data.day.split('-')[2] }}
                {{ data.isSelected ? '✔️' : '' }}
              </p>
              <!-- 排班内容 -->
              <div class="overflow-y-auto" style="height: calc(100% - 18.36px)" v-if="!isEmptyDuty(data.day)" @click="openEdit(data.day)">
                <p
                  v-for="(item, index) in getDuty(data.day).slice(0, 2)"
                  :key="data.day + index"
                  class="ellipsis legend-common mt-2 w-3/4 p-1"
                  :style="{
                    backgroundColor: item.cellStyle.backgroundColor,
                    color: item.cellStyle.color,
                    borderLeft: item.cellStyle.borderLeft
                  }"
                >
                  {{ item.value }}
                </p>
              </div>
              <div style="height: calc(100% - 18.36px)" class="overflow-y-auto italic" v-else>
                <p class="text-center text-xs text-gray-400" v-if="data.day >= formatDate(props.taskData.dutyStartTime) && data.day < formatDate(props.taskData.dutyEndTime)">暂无排班</p>
              </div>

              <span class="calendar-today small-icon" v-if="data.day === ts.getCurDate()">今</span>

              <div class="absolute bottom-0 right-0 opacity-50 transition-opacity hover:opacity-100">
                <el-icon v-if="data.day >= formatDate(props.taskData.dutyStartTime) && data.day <= formatDate(props.taskData.dutyEndTime)" :size="15" class="cursor-pointer text-gray-500 transition-all duration-150 ease-out hover:scale-[1.12] hover:text-blue-500 group-hover:text-blue-600" @click="openDuty(data.day)">
                  <Edit />
                </el-icon>
              </div>
            </div>
          </el-tooltip>
        </template>
      </el-calendar>
    </div>
    <div class="mt-2 flex items-center gap-2">
      <!-- 注图标 -->
      <div class="flex items-center gap-1 font-medium text-gray-600">
        <span class="inline-block flex h-6 w-6 items-center justify-center rounded-full bg-gray-500 text-xs text-white"> 注 </span>
      </div>
      <div class="flex items-center gap-8">
        <!-- <p class="content-1 p-1">现场指挥中心</p>
        <p class="content-2 p-1">指挥办公室</p> -->
        <div
          v-for="(item, index) in calendarData.allOrgRoles"
          :key="item.value"
          :style="{
            backgroundColor: activeOrgRole.includes(item.value) ? item.backgroundColor : '#f5f5f5',
            color: activeOrgRole.includes(item.value) ? item.color : '#b0b0b0',
            borderLeft: activeOrgRole.includes(item.value) ? item.borderLeft : '4px solid #b0b0b0'
          }"
          class="legend-common cursor-pointer select-none rounded-full p-1 text-center hover:scale-[1.08]"
          @click="toggleOrgRole(item.value)"
        >
          <p>
            {{ item.value }}
          </p>
        </div>
      </div>
    </div>
    <!-- 弹窗 -->
    <el-dialog v-model="dialogVisible" title="编辑排班信息" width="750px">
      <el-form ref="formRef" :model="form" label-width="auto" label-position="right">
        <el-form-item v-for="(duty, index) in form.dutyItems" :key="duty.key">
          <div class="flex items-center">
            <el-form-item
              :label="duty.key + '：'"
              :prop="'dutyItems.' + index + '.dutyPerson'"
              :rules="{
                required: true,
                message: '必填项: 值班人姓名',
                trigger: 'blur'
              }"
            >
              <el-input v-model="duty.dutyPerson" />
            </el-form-item>
            <el-form-item :label="'电话：'" :prop="'dutyItems.' + index + '.dutyPhone'" label-width="80px">
              <el-input v-model="duty.dutyPhone" />
            </el-form-item>
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveEdit">保存</el-button>
      </template>
    </el-dialog>
    <Modal class="w-[90%] h-[100%]" title="手动排班" :closeOnClickModal="false" :draggable="true" :closeOnPressEscape="false" headerClass="head-md" footerClass="modal-footer" :showConfirmButton="false" :showCancelButton="false">
      <AutoDutyModel ref="autoDutyModel" :taskData="taskData" :editFlag="true"></AutoDutyModel>
      <template #footer>
        <el-button type="primary" :icon="Tickets" @click="handleAutoGen()">生成</el-button>
        <el-button type="info" :icon="Close" @click="modalApi.close()">取消</el-button>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ElCalendar, ElDialog, ElForm, ElButton, ElInput, ElMessage } from 'element-plus'
import { ref, computed, defineEmits, watch, onMounted, reactive, defineProps, defineExpose } from 'vue'
import { requestClient } from '#/api/request'
import { Edit, InfoFilled, Upload, Tickets, Close } from '@element-plus/icons-vue'
import type { CalendarDateType, CalendarInstance } from 'element-plus'
import ts from './calendarFillUtils'
import { useVbenModal } from '@vben/common-ui'
import AutoDutyModel from './autoDutyModel.vue'
import { getDutyCalendarInfo, saveBatchRosterData } from '../dutyTaskFillMethods.ts'
import { formatDate, formatDateTime } from '#/utils/commonUtil.ts'
import { useUserStore } from '@vben/stores'
const props = defineProps({
  taskData: {
    type: Object,
    default: {}
  }
})

const calendarData = reactive({
  allDataList: [],
  dutyMap: {},
  allOrgRoles: [],
  filteredDutyMap: {},
  dataMap: {},
  filteredDataMap: {},
  dateStr: null
})
defineExpose({
  getRosterDataList,
  calendarData
})

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close()
  }
})
const userStore = useUserStore()
const calendar = ref<CalendarInstance>()
// 自定义头部按钮组
const selectDate = (val: CalendarDateType) => {
  if (!calendar.value) return
  calendar.value.selectDate(val)
}
const calendarValue = ref(new Date())
const autoDutyModel = ref()
const dialogVisible = ref(false)
const editingDate = ref('')
const formRef = ref()
// 日历单元格表单数据
const form = reactive<{
  dutyItems: DutyItem[]
}>({
  dutyItems: [
    {
      key: '1',
      id: '',
      dutyPerson: '',
      dutyPhone: '',
      date: '',
      orgRole: '',
      posRole: ''
    }
  ]
})
interface DutyItem {
  key: string
  id: string
  dutyPerson: string
  dutyPhone: string
  date: string
  orgRole: string
  posRole: string
}
const dutyTaskId = defineModel('dutyTaskId')
const colorList = [
  { backgroundColor: '#FFF5E5', color: '#FF8C00' }, // 浅米色背景 + 橙色文字
  { backgroundColor: '#F0F9FF', color: '#1E90FF' }, // 超浅蓝背景 + 蓝色文字
  { backgroundColor: '#F5FFF5', color: '#32CD32' }, // 浅绿背景 + 青绿色文字
  { backgroundColor: '#FFF0F5', color: '#DB7093' }, // 浅粉背景 + 粉红色文字
  { backgroundColor: '#F5F5DC', color: '#6B8E23' }, // 米黄色背景 + 橄榄绿文字
  { backgroundColor: '#E6F7FF', color: '#1890FF' }, // 淡蓝背景 + 正蓝色
  { backgroundColor: '#FFF7E6', color: '#FFA940' } // 奶油背景 + 明亮橙
]
const activeOrgRole = ref([])
const emit = defineEmits(['getActiveOrgRoles', 'refreshCalendar'])

// 监听激活的组织角色标签
watch(
  () => activeOrgRole.value.length, // 监听 length
  (newLength, oldLength) => {
    // emit('getActiveOrgRoles', activeOrgRole.value)
    let dutyMap = calendarData.dutyMap
    calendarData.filteredDutyMap = {}
    for (const date in dutyMap) {
      const sameDateItems = dutyMap[date]
      calendarData.filteredDutyMap[date] = {}
      for (const orgRole in sameDateItems) {
        const sameOrgItems = dutyMap[date][orgRole]
        if (activeOrgRole.value.includes(orgRole)) {
          calendarData.filteredDutyMap[date][orgRole] = sameOrgItems
        }
      }
    }
    let dataMap = calendarData.dataMap
    calendarData.filteredDataMap = {}
    for (const date in dataMap) {
      const sameDateItems = dataMap[date]
      calendarData.filteredDataMap[date] = {}
      for (const orgRole in sameDateItems) {
        const sameOrgItems = dataMap[date][orgRole]
        if (activeOrgRole.value.includes(orgRole)) {
          calendarData.filteredDataMap[date][orgRole] = sameOrgItems
        }
      }
    }
  }
)
onMounted(() => {
  console.log('护网排班任务数据 :>>', props.taskData)
  getRosterDataList(props.taskData)
  console.log('当前用户信息 :>>', userStore.userInfo)
})
/**
 * 获取值班表信息
 */
async function getRosterDataList(taskData) {
  calendarData.dutyMap = {}
  calendarData.dataMap = {}
  calendarData.allDataList = []
  let queryInfo = {
    dutyTaskId: taskData.id,
    unitId: taskData.receiveDeptCode
  }
  let dataList = await getDutyCalendarInfo(queryInfo)
  calendarData.allOrgRoles = getAllOrgRoles(dataList)
  activeOrgRole.value = calendarData.allOrgRoles.map((item) => item.value)

  dataList.forEach((item) => {
    item.startDate = formatDate(item.startTime)
    item.endDate = formatDate(item.endTime)
  })
  calendarData.allDataList = dataList
  // 按值班时间分类
  let dataGroupByDate = dataList.reduce((acc, item) => {
    const startKey = item.startDate
    // const endKey = item.endDate
    if (!acc[startKey]) {
      acc[startKey] = []
    }
    // if (!acc[endKey]) {
    //   acc[endKey] = []
    // }
    acc[startKey].push(item)
    // 值班时间不在同一天
    // if (startKey !== endKey) {
    //   acc[endKey].push(item)
    // }
    return acc
  }, {})

  let resultMap = {}
  let dataMap = {}
  // 思路: 按值班日期分类->按组织角色分类->按人员角色分类
  for (const dateKey in dataGroupByDate) {
    const sameDateItems = dataGroupByDate[dateKey]
    resultMap[dateKey] = {}
    dataMap[dateKey] = {}
    // 按组织角色分类
    let dataGroupByOrgRole = sameDateItems.reduce((acc, item) => {
      const key = item.orgRole ?? '无组织角色'
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(item)
      return acc
    }, {})

    for (const orgRoleKey in dataGroupByOrgRole) {
      if (!activeOrgRole.value.includes(orgRoleKey)) continue
      const sameDateOrgRoleItems = dataGroupByOrgRole[orgRoleKey]
      resultMap[dateKey][orgRoleKey] = {}
      dataMap[dateKey][orgRoleKey] = {}
      // 按人员角色分类
      let dataGroupByPosRole = sameDateOrgRoleItems.reduce((acc, item) => {
        const key = item.posRole
        if (!acc[key]) {
          acc[key] = []
        }
        acc[key].push(item)
        return acc
      }, {})
      for (const posRoleKey in dataGroupByPosRole) {
        const sameDateOrgRolePosRoleItems = dataGroupByPosRole[posRoleKey]

        let peopleStr = sameDateOrgRolePosRoleItems.map((item) => (item = item.dutyPerson)).join(',')
        let displayValue = {
          value: posRoleKey + ': ' + peopleStr,
          orgRole: orgRoleKey
        }
        resultMap[dateKey][orgRoleKey][posRoleKey] = displayValue
        dataMap[dateKey][orgRoleKey][posRoleKey] = sameDateOrgRolePosRoleItems
      }
    }
  }
  console.log('dataMap :>>', dataMap)
  calendarData.dutyMap = resultMap
  calendarData.dataMap = dataMap
}
// 获取值班表全部组织角色数据
const getAllOrgRoles = (dataList) => {
  const allOrgRoles = [...new Set(dataList.map((item) => item.orgRole).filter((item) => item))]
  const allOrgRoleColors = allOrgRoles.map(
    (item, index) =>
      (item = {
        value: item,
        backgroundColor: colorList[index % colorList.length].backgroundColor,
        color: colorList[index % colorList.length].color,
        borderLeft: '4px solid' + colorList[index % colorList.length].color
      })
  )
  // console.log('allOrgRoleColors :>>', allOrgRoleColors);
  return allOrgRoleColors
}

/**
 * 获取不同组织角色所属样式
 */
function getDutyDateStyle(value) {
  return calendarData.allOrgRoles.find((item) => item.value === value)
}
/**
 * 获取指定日期排班
 */
function getDuty(dateStr: string | number) {
  const sameDateItems = calendarData.filteredDutyMap[dateStr]
  let resultArr = []
  for (const key in sameDateItems) {
    const sameOrgItems = sameDateItems[key]
    for (const posKey in sameOrgItems) {
      const samePosObj = sameOrgItems[posKey]
      // 设置显示样式
      samePosObj.cellStyle = getDutyDateStyle(samePosObj.orgRole)
      resultArr.push(samePosObj)
    }
  }
  resultArr.sort((a, b) => a.orgRole.localeCompare(b.orgRole))
  // console.log('获取指定日期排班 :>>', dateStr, resultArr)
  return resultArr || []
}
// 每日信息弹出提示内容
const toolTipContent = (dateStr) => {
  let dataList = getDuty(dateStr)
  if (dataList.length === 0) {
    return '暂无排班'
  }
  let content = ''
  dataList.forEach((item) => {
    content += `${item.orgRole}-${item.value} <br/>`
  })
  return content
}

// 下方组织角色图例点击方法
function toggleOrgRole(value) {
  const index = activeOrgRole.value.indexOf(value)
  if (index > -1) {
    // 已经存在，移除
    activeOrgRole.value.splice(index, 1)
  } else {
    // 不存在，添加
    activeOrgRole.value.push(value)
  }
}

// 判断某天是否无排班信息
function isEmptyDuty(dateStr: string | number) {
  const duty = calendarData.dutyMap[dateStr] || {}
  return Object.keys(duty).length === 0
}
// 编辑排班信息
function openEdit(dateStr: string) {
  editingDate.value = dateStr
  const cellData = calendarData.filteredDataMap[dateStr] || {}
  console.log('cellData :>>', cellData)
  let dutyItems = []
  for (const orgKey in cellData) {
    const sameOrgValue = cellData[orgKey]
    for (const posKey in sameOrgValue) {
      const samePosValue = sameOrgValue[posKey]
      samePosValue.forEach((item, index) => {
        dutyItems.push({
          key: orgKey + '-' + posKey + (index + 1),
          id: item.id,
          dutyPerson: item.dutyPerson,
          dutyPhone: item.dutyPhone,
          date: item.startDate,
          orgRole: orgKey,
          posRole: posKey
        })
      })
    }
  }
  form.dutyItems = dutyItems
  dialogVisible.value = true
}

function openDuty(dateStr: string) {
  calendarData.dateStr = dateStr
  modalApi.open()
}
// 保存排班信息
async function saveEdit() {
  // formRef.value.validate((valid) => {
  //   if (valid) {

  //   } else {
  //     ElMessage({ type: 'error', message: '表单存在必填项未填!' })
  //   }
  // })
  try {
    const isValid = await formRef.value.validate()
    if (!isValid || form.dutyItems.length === 0) return

    let date = form.dutyItems[0].date
    let dutyItemsGroupById = form.dutyItems.reduce((acc, item) => {
      if (!acc[item.id]) {
        acc[item.id] = []
      }
      acc[item.id].push(item)
      return acc
    }, {})

    let filteredItems = calendarData.allDataList.filter((item) => item.startDate === date)
    let saveItems = []
    filteredItems.forEach((item) => {
      let formItem = dutyItemsGroupById[item.id][0]
      if (formItem) {
        item.dutyPerson = formItem.dutyPerson
        item.dutyPhone = formItem.dutyPhone
        item.updateTime = new Date().getTime()
        item.updatorId = userStore.userInfo?.logincode
        saveItems.push(item)
      }
    })

    console.log('保存排班信息 :>>', saveItems)
    await saveBatchRosterData(saveItems)
    emit('refreshCalendar')
    ElMessage({ type: 'success', message: '保存成功!' })
    dialogVisible.value = false
  } catch (error) {
    ElMessage({ type: 'error', message: '表单存在必填项未填!' })
  }
}
function handleAutoGen() {
  genRosterData()
}

async function genRosterData() {
  if (autoDutyModel.value) {
    const result = await autoDutyModel.value.getFormData2(calendarData.dateStr)
    console.log('自动生成结果 :>>', result)
    if (result) {
      // await calendarPart.value.getRosterDataList(props.taskData)
      emit('refreshCalendar')
      modalApi.close()
    }
  }
}
</script>

<style scoped="scoped" lang="less">
:deep(.el-calendar) {
  .el-calendar__header {
    font-size: 18px;
    font-weight: 700;
    color: #000000;
    line-height: 24px;
    border-bottom: 0;
    padding: 12px;
  }
  .el-calendar__body {
    padding: 12px;
    thead {
      tr {
        background-color: #32c8c8;
      }
      th {
        color: #ffffff;
        font-weight: 600;
        font-size: 14px;
      }
    }
    .el-calendar-table__row {
      .el-calendar-day {
        width: 100%;
        height: 105px;
      }
    }
  }
}
.is-selected {
  color: #1989fa;
}
.content-1 {
  font-size: 15px;
  background-color: #e1efff;
  color: hsl(var(--primary));
  border-left: 4px solid hsl(var(--primary));
  border-radius: 4px;
}
.content-2 {
  font-size: 15px;
  background-color: #fffaf5;
  color: #f59a24;
  border-left: 4px solid #f50958;
  border-radius: 4px;
}
.legend-common {
  font-size: 15px;
  border-radius: 4px;
}

.calendar-today {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  position: absolute;
  top: 2px;
  right: 2px;
}
.small-icon {
  border-radius: 4px;
  padding: 3px;
  font-size: 14px;
}
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
