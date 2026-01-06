<template>
  <div class="h-full overflow-hidden">
    <el-form ref="formRef" :model="form" :inline="true" label-position="right">
      <el-form-item label="选择组织角色：" class="ml-[15px] mt-[10px]">
        <el-checkbox-group v-model="form.orgRoleNames" @change="orgRoleChange">
          <el-checkbox v-for="item in allOrgInDept" :key="item" :label="item">
            {{ item }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-divider />
      <div class="overflow-auto h-[530px]">
        <div class="scroll-wrapper flex flex-col gap-5" v-for="(item, index) in form.relationData" :key="item.id">
          <div class="flex items-start">
            <table class="pb-table">
              <tbody>
                <tr>
                  <td class="la">{{ item.orgName }}</td>
                  <td class="laa">{{ item.manName }}：</td>
                  <td class="lb" v-if="!editFlag">排班模式：</td>
                  <td class="lc" v-if="!editFlag">
                    <el-form-item label="" label-width="100px">
                      <el-select v-model="item.shiftModeValue" @change="shiftModeChange(index)" style="width: 150px" clearable>
                        <el-option v-for="option in shiftModeOptions" :key="option.value" :label="option.label" :value="option.value" />
                      </el-select>
                    </el-form-item>
                  </td>
                  <td class="lb">值班人员：</td>
                  <td class="lc">
                    <div class="w-[990px] gap-2">
                      <div class="w-full flex h-full" :class="daoIndex != item.personData.length - 1 ? 'mebhgdh' : ''" v-for="(dao, daoIndex) in item.personData" :key="'lmh' + daoIndex">
                        <div class="w-[70px] h-full">
                          <div class="text-right mt-[15px]" v-if="item.personData.length == 1">全日：</div>
                          <div class="text-right mt-[15px]" v-else-if="item.personData.length > 1 && daoIndex == 0">早班：</div>
                          <div class="text-right mt-[15px]" v-else-if="item.personData.length > 1 && daoIndex == 1">晚班：</div>
                          <div class="primary dianji text-center" @click="mebAddClick(index, daoIndex)">+ 添加</div>
                        </div>
                        <div style="width: calc(100% - 70px)">
                          <div class="float-left flex" v-for="(ban, banIndex) in dao" :key="'loh' + banIndex">
                            <div>
                              <div class="w-[150px]" v-for="(meb, mebindex) in ban" :key="'mebk' + mebindex">
                                <div class="flex items-center">
                                  <div class="w-[150px]">
                                    <el-form-item style="margin-right: 0">
                                      <el-input v-model="meb.personName" placeholder="姓名" style="width: 150px"> </el-input>
                                    </el-form-item>
                                    <el-form-item style="margin-right: 0">
                                      <el-input v-model="meb.phoneNumber" placeholder="电话" style="width: 150px"></el-input>
                                    </el-form-item>
                                  </div>
                                  <div v-if="ban.length > 1 && mebindex > 0" class="float-left w-[60px] h-[66px] flex items-center pl-[2px] z-[50]">
                                    <span class="delcss flex items-center dianji" @click="mebDeleteClick(index, daoIndex, banIndex, mebindex)"><Delete class="h-[12px] w-[12px]" /></span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <span class="mx-1 mt-[24px]" v-if="banIndex != dao.length - 1"> >> </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script setup>
import { ElRow, ElCol, ElCheckbox, ElCheckboxGroup, ElForm, ElFormItem, ElButton, ElInput, ElSelect, ElOption, ElDivider, ElMessage } from 'element-plus'
import { reactive, ref, onMounted, defineExpose, defineProps, defineEmits } from 'vue'
import { getHwDutyTaskOrgRelation, saveBatchRosterData, autoDutyRoster } from '../dutyTaskFillMethods.ts'
import { queryTemplateApi } from '../../taskPublish/taskPublishMethod.ts'
import { formatDate, formatDateTime } from '#/utils/commonUtil.ts'
import { shiftModeOptions } from './options.ts'
import { useUserStore } from '@vben/stores'
import { Delete } from '@element-plus/icons-vue'
const props = defineProps({
  activeOrgRole: {
    type: Array,
    default: []
  },
  taskData: {
    type: Object,
    default: {}
  }
})
const editFlag = defineModel('editFlag')
const allOrgInDept = ref([])
const emit = defineEmits([])
const userStore = useUserStore()
const formRef = ref()
const form = reactive({
  orgRoleNames: [],
  relationData: []
})
const data = reactive({})
onMounted(async () => {
  query(props.taskData)
})
const query = async (taskData) => {
  let queryInfo = {
    dutyTaskId: taskData.id,
    deptCode: taskData.receiveDeptCode
  }
  let dataList = await getHwDutyTaskOrgRelation(queryInfo)
  // 根据模板id 获取组织-人员关联信息
  // const list = await queryTemplateApi({ templateId: taskData.templateId })
  // let listByDeptCode = list.filter((item) => item.deptCode === taskData.receiveDeptCode)

  allOrgInDept.value = [...new Set(dataList.map((item) => (item = item.orgName)))]

  // allOrgInDept.value = listByDeptCode.map((item) => (item = item.orgName))

  // 根据人员角色数组展开 dataList(因为是后修改的且接口返回数据结构原因, 所以做如下处理)
  // let expandList = []
  // listByDeptCode.forEach((item) => {
  //   item.manName.forEach((manName, manIdx) => {
  //     let temp = { ...item }
  //     temp.manName = null
  //     temp.manName = manName
  //     temp.manCode = null
  //     temp.manCode = item.manCode[manIdx]
  //     temp.posRoleSort = item.posRoleSort[manIdx]
  //     expandList.push(temp)
  //   })
  // })
  // 按组织角色名称分组
  let dataGroupByOrgName = dataList.reduce((acc, item) => {
    const key = item.orgName
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(item)
    return acc
  }, {})
  data.dataGroupByOrgName = dataGroupByOrgName
}
// 组织角色多选框改变
function orgRoleChange() {
  let tempItems = []
  form.orgRoleNames.forEach((item) => {
    tempItems = [...tempItems, ...data.dataGroupByOrgName[item]]
  })
  // 设置排班模式, 初始化人员设置
  tempItems.forEach((item) => {
    item.shiftModeValue = item.shiftModeValue ? item.shiftModeValue : '1'
    item.ban = item.ban ? item.ban : 1
    item.dao = item.dao ? item.dao : 1
    if (!item.personData) {
      item.personData = []
      item.personData.push([[{ personName: '', phoneNumber: '' }]])
    }
  })
  // data.relationData = tempItems;
  form.relationData = tempItems
}
// 排班模式改变
function shiftModeChange(index) {
  let item = form.relationData[index]
  let value = item.shiftModeValue
  if (value === '1') {
    item.ban = 1
    item.dao = 1
    item.personData = []
    item.personData.push([[{ personName: '', phoneNumber: '' }]])
  } else {
    let bandao = value.split('-')
    item.ban = Number(bandao[0])
    item.dao = Number(bandao[1])
    item.personData = []
    for (let i = 0; i < item.dao; i++) {
      item.personData.push([])
      for (let j = 0; j < item.ban; j++) {
        item.personData[i].push([{ personName: '', phoneNumber: '' }])
      }
    }
  }
}
const mebAddClick = (index, daoIndex, banIndex) => {
  let item = form.relationData[index]
  item.personData[daoIndex].forEach((d) => {
    d.push({ personName: '', phoneNumber: '' })
  })
}
const mebDeleteClick = (index, daoIndex, banIndex, mebindex) => {
  let item = form.relationData[index]
  item.personData[daoIndex][banIndex].splice(mebindex, 1)
}
/**
 * 获取自动排班表单数据, 并生成
 */
async function getFormData() {
  let formData = form.relationData || []
  let isChecked = true
  formData.forEach((item) => {
    if (!isChecked) return
    item.personData.forEach((shift) => {
      if (!isChecked) return
      for (let i = 0; i < shift.length; i++) {
        let tempArr = shift[i]
        for (let j = 0; j < tempArr.length; j++) {
          let temp = tempArr[j]
          // console.log('temp :>>', temp, temp.personName === '',  (temp.personName === '' || item.phoneNumber === ''))
          if (temp.personName === '' || temp.phoneNumber === '') {
            isChecked = false
            break
          }
        }
      }
    })
  })
  if (!isChecked) {
    ElMessage.error(`检测到有数据未填写, 请检查表单数据!`)
    return false
  }

  const taskData = props.taskData
  const dutyTaskId = taskData.id
  const loginCode = userStore.userInfo?.logincode
  let dutyStartTime = new Date(taskData.dutyStartTime)
  let dutyEndTime = new Date(taskData.dutyEndTime)
  let now = new Date().getTime()
  let voList = []
  const fixedShift = '3'
  formData.forEach((item) => {
    // dutyShiftIndex班次, 1: 早班 2:晚班 3:固定式
    let isFixedShift = false
    if (item.personData.length === 1) {
      isFixedShift = true
    }
    item.personData.forEach((shift, shiftIndex) => {
      let dayIndex = 0
      let currentTime = new Date(dutyStartTime)
      while (currentTime < dutyEndTime) {
        let startTime1 = new Date(currentTime).setHours(8, 0, 0, 0)
        let endTime1 = new Date(currentTime).setHours(18, 0, 0, 0)
        let startTime2 = new Date(currentTime).setHours(18, 0, 0, 0)
        let endTime2 = new Date(currentTime)
        endTime2.setDate(currentTime.getDate() + 1)
        endTime2.setHours(8, 0, 0, 0)
        endTime2 = endTime2.getTime()
        let fixedStartTime = new Date(currentTime).setHours(0, 0, 0, 0)
        let fixedEndTime = new Date(currentTime).setHours(23, 59, 59, 999)

        let finalStartTime = isFixedShift ? fixedStartTime : shiftIndex === 0 ? startTime1 : startTime2
        let finalEndTime = isFixedShift ? fixedEndTime : shiftIndex === 0 ? endTime1 : endTime2

        const personArr = shift[dayIndex % shift.length]
        for (let j = 0; j < personArr.length; j++) {
          const personInfo = personArr[j]
          let tempVo = {
            dutyTaskId: dutyTaskId,
            unitId: item.deptCode,
            unitName: item.deptName,
            orgRole: item.orgName,
            posRole: item.manName,
            dutyPerson: personInfo.personName,
            dutyShift: isFixedShift ? fixedShift : shiftIndex + 1 + '',
            startTime: finalStartTime,
            endTime: finalEndTime,
            creatorId: loginCode,
            createTime: now,
            updatorId: loginCode,
            updateTime: now,
            dutyPhone: personInfo.phoneNumber,
            deptType: item.deptType,
            orgRoleSort: item.orgRoleSort,
            posRoleSort: item.posRoleSort,
            deptSort: item.deptSort,
            dayString: ''
          }
          voList.push(tempVo)
        }
        dayIndex++
        currentTime.setDate(currentTime.getDate() + 1)
      }
    })
  })
  console.log('排班生成列表 :>>', voList)
  const result = await autoDutyRoster(voList)
  console.log('result :>>', result)
  if (result) {
    ElMessage.success(`生成成功!`)
    return true
  } else {
    ElMessage.error(`生成失败!`)
    return false
  }
}

/**
 * 获取自动排班表单数据, 并生成
 */
async function getFormData2(dayString) {
  let formData = form.relationData || []
  let isChecked = true
  formData.forEach((item) => {
    if (!isChecked) return
    item.personData.forEach((shift) => {
      if (!isChecked) return
      for (let i = 0; i < shift.length; i++) {
        let temp = shift[i]
        // console.log('temp :>>', temp, temp.personName === '',  (temp.personName === '' || item.phoneNumber === ''))
        if (temp.personName === '' || temp.phoneNumber === '') {
          isChecked = false
          break
        }
      }
    })
  })
  if (!isChecked) {
    ElMessage.error(`检测到有数据未填写, 请检查表单数据!`)
    return false
  }

  const taskData = props.taskData
  const dutyTaskId = taskData.id
  const loginCode = userStore.userInfo?.logincode
  let now = new Date().getTime()
  let voList = []
  const fixedShift = '3'
  formData.forEach((item) => {
    // dutyShiftIndex班次, 1: 早班 2:晚班 3:固定式
    let isFixedShift = false
    if (item.personData.length === 1) {
      isFixedShift = true
    }
    item.personData.forEach((shift, shiftIndex) => {
      let dayIndex = 0
      let currentTime = new Date(dayString)
      let startTime1 = new Date(currentTime).setHours(8, 0, 0, 0)
      let endTime1 = new Date(currentTime).setHours(18, 0, 0, 0)
      let startTime2 = new Date(currentTime).setHours(18, 0, 0, 0)
      let endTime2 = new Date(currentTime)
      endTime2.setDate(currentTime.getDate() + 1)
      endTime2.setHours(8, 0, 0, 0)
      endTime2 = endTime2.getTime()
      let fixedStartTime = new Date(currentTime).setHours(0, 0, 0, 0)
      let fixedEndTime = new Date(currentTime).setHours(23, 59, 59, 999)

      let finalStartTime = isFixedShift ? fixedStartTime : shiftIndex === 0 ? startTime1 : startTime2
      let finalEndTime = isFixedShift ? fixedEndTime : shiftIndex === 0 ? endTime1 : endTime2

      const personArr = shift[dayIndex % shift.length]
      for (let j = 0; j < personArr.length; j++) {
        const personInfo = personArr[j]
        let tempVo = {
          dutyTaskId: dutyTaskId,
          unitId: item.deptCode,
          unitName: item.deptName,
          orgRole: item.orgName,
          posRole: item.manName,
          dutyPerson: personInfo.personName,
          dutyShift: isFixedShift ? fixedShift : shiftIndex + 1 + '',
          startTime: finalStartTime,
          endTime: finalEndTime,
          creatorId: loginCode,
          createTime: now,
          updatorId: loginCode,
          updateTime: now,
          dutyPhone: personInfo.phoneNumber,
          deptType: item.deptType,
          orgRoleSort: item.orgRoleSort,
          posRoleSort: item.posRoleSort,
          deptSort: item.deptSort,
          dayString: dayString
        }
        voList.push(tempVo)
      }
      dayIndex++
    })
  })
  console.log('排班生成列表 :>>', voList)
  const result = await autoDutyRoster(voList)
  console.log('result :>>', result)
  if (result) {
    ElMessage.success(`生成成功!`)
    return true
  } else {
    ElMessage.error(`生成失败!`)
    return false
  }
}
defineExpose({
  getFormData2,
  getFormData,
  allOrgInDept
})
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

/* 针对 Webkit 内核浏览器，比如 Chrome、Edge */
.scroll-wrapper {
  padding-bottom: 2px; /* 给滚动条一点空间 */
  overflow-x: auto;
}

:deep(.el-divider--horizontal) {
  margin: 0 0 10px;
}

:deep(.el-form-item) {
  margin-bottom: 10px;
}

:deep(.el-form--inline .el-form-item) {
  margin-right: 0 !important;
  margin-bottom: 0 !important;
}

.scroll-wrapper::-webkit-scrollbar {
  height: 6px;
}

.scroll-wrapper::-webkit-scrollbar-thumb {
  background-color: rgb(144 147 153 / 50%);
  border-radius: 3px;
}

.scroll-wrapper::-webkit-scrollbar-thumb:hover {
  background-color: rgb(144 147 153 / 80%);
}

.pb-table {
  font-size: 14px;
  border-right: 1px solid #e4e4e7;
  border-bottom: 1px solid #e4e4e7;
}

.mebhgdh {
  border-bottom: 1px solid #e4e4e7;
}

.jkuss {
  border-right: 1px solid #e4e4e7;
}

.pb-table td {
  height: 35px;
  border-top: 1px solid #e4e4e7;
  border-left: 1px solid #e4e4e7;
}

.pb-table .la {
  width: 120px;
  text-align: center;
  background: #e6e6e6;
  border-right: 2px solid #fff;
}

.pb-table .laa {
  width: 120px;
  text-align: right;
  background: #e6e6e6;
}

.pb-table .lb {
  width: 120px;
  font-size: 14px;
  text-align: right;
}

.pb-table .lc {
  width: 150px;
  text-align: center;
}

.pb-table .ld {
  width: 60px;
  text-align: center;
}

.delcss {
  color: red;
  cursor: pointer;
}

.primary {
  color: hsl(var(--primary));
}

.dianji {
  font-weight: normal;
  cursor: pointer;
}

.dianji:hover {
  text-decoration: underline;
}
</style>
