<template>
  <Page auto-content-height>
    <div class="main-div h-full">
      <div class="top-div" style="display: flex; text-align: center">
        <div class="top-content">
          <el-button style="background: transparent" type="primary" :icon="Setting" size="small" @click="modalApiA.open()"></el-button>
        </div>
        <div class="top-content">{{ data.tasksName }}</div>
        <div class="top-content flex">
          <el-checkbox label="全网" v-model="data.checkSlAll" size="small" @change="slAllChange"></el-checkbox>
          <el-checkbox label="管制单位" v-model="data.checkGkAll" size="small" @change="gkAllChange"></el-checkbox>
          <el-checkbox label="非管制单位" v-model="data.checkFgkAll" size="small" @change="fgkAllChange"></el-checkbox>

          <!-- <el-dropdown @command="openInstruction">
            <div class="top-rec">发布指令</div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="3">指令</el-dropdown-item>
                <el-dropdown-item command="2">通知</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown> -->
          <div class="top-rec" @click="openInstruction">发布指令</div>
          <!-- <div class="w-[30px] pr-[40px]" style="margin-left: auto">
            <div :class="isFull ? 'is-full' : 'not-full'" :title="isFull ? '取消全屏' : '全屏'" @click.stop="setFullScreen"></div>
          </div> -->
        </div>
      </div>
      <div class="bottom-div">
        <div class="bottom-content flex">
          <WangCompany :headquarterData="data.headquarterData" :centerData="data.centerData" :officeData="data.officeData" />
        </div>
        <div class="bottom-content flex">
          <Group :groupData="data.groupData" :safeData="data.safeData" />
        </div>
        <div class="bottom-content flex">
          <ShengCompany :provincalData="data.provincalData" :selectAllGK="data.selectAllGK" @selectionChange="selectionChange" />
        </div>
        <div class="bottom-content flex">
          <ProfessionalCompany :professionalData="data.professionalData" :selectAllFGK="data.selectAllFGK" @selectionChange="selectionChange" />
        </div>
      </div>
    </div>
    <ModalA class="h-[500px] w-[1200px] bg-[rgba(0,44,100,0.85)]" title="选择任务" :footer="false" :closeOnClickModal="false" :draggable="true" contentClass="bg-transparent" headerClass="bg-transparent text-white" :bordered="false" :darkCss="true">
      <SelectTask @query="query" />
    </ModalA>

    <ModalB class="h-[650px] w-[1200px] bg-[rgba(0,44,100,0.85)]" :footer="false" :closeOnClickModal="false" :draggable="true" contentClass="bg-transparent" headerClass="bg-transparent text-white" :bordered="false" :darkCss="true">
      <CmdDetail :cmdFl="data.cmdFl" :sldwParams="data.selectedUnit" @removeTab="addClose"></CmdDetail>
    </ModalB>
  </Page>
</template>
<script setup>
import { ElRadio, ElRadioGroup, ElButton, ElMessage, ElDropdown, ElCheckbox, ElCheckboxGroup } from 'element-plus'
import { ref, reactive, onMounted, watch } from 'vue'
import { useVbenModal } from '@vben/common-ui'
import { Setting } from '@element-plus/icons-vue'
import ShengCompany from './shengCompany.vue'
import WangCompany from './wangCompany.vue'
import Group from './group.vue'
import ProfessionalCompany from './professionalCompany.vue'
import CmdDetail from '#/views/runDdMgt/cmdMgt/cmdDetail.vue'
import { queryData } from './staffVisualisationMethod.ts'
import SelectTask from './selectTask.vue'
import screenfull from 'screenfull'

const data = reactive({
  radioData: [],
  groupData: [],
  headquarterData: [],
  centerData: [],
  officeData: [],
  provincalData: [],
  professionalData: [],
  safeData: [],
  tasksName: '',
  selectItems: {
    GKUnit: [],
    FGKUnit: []
  },
  selectedUnit: [],
  selectAllGK: false,
  selectAllFGK: false,
  checkSlAll: false,
  checkGkAll: false,
  checkFgkAll: false,
  cmdFl: null
})

const [ModalA, modalApiA] = useVbenModal({
  onCancel() {
    modalApiA.close()
  }
})

const [ModalB, modalApiB] = useVbenModal({
  onCancel() {
    modalApiB.close()
  },
  onBeforeClose() {
    data.selectedUnit = []
  }
})

const selectionChange = (type, items) => {
  data.selectItems[type] = items
}

const addClose = () => {
  modalApiB.close()
}

onMounted(async () => {
  fullContent()
  await query(null)
})

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

const query = async (dutyTaskId) => {
  data.radioData = null
  const { groupData, headquarterData, centerData, officeData, provincalData, professionalData, safeData, tasksName } = await queryData({ dutyTaskId: dutyTaskId })
  data.groupData = groupData
  data.headquarterData = headquarterData
  data.centerData = centerData
  data.officeData = officeData
  data.provincalData = provincalData
  data.professionalData = professionalData
  data.tasksName = tasksName
  data.safeData = safeData
  modalApiA.close()
}

const openInstruction = (command) => {
  data.selectItems['GKUnit'].forEach((element) => {
    data.selectedUnit.push(element.unitId)
  })
  data.selectItems['FGKUnit'].forEach((element) => {
    data.selectedUnit.push(element.unitId)
  })
  if (data.selectedUnit.length === 0) {
    data.selectedUnit = null
  }
  data.cmdFl = '3'
  modalApiB.open()
}

const handleRadioChange = (value) => {
  if (value === '1') {
    data.selectAllGK = true
    data.selectAllFGK = true
  } else if (value === '2') {
    data.selectAllFGK = false
    data.selectAllGK = true
  } else if (value === '3') {
    data.selectAllFGK = true
    data.selectAllGK = false
  }
}

const slAllChange = (value) => {
  if (value) {
    data.checkGkAll = false
    data.checkFgkAll = false

    data.selectAllGK = true
    data.selectAllFGK = true
  } else {
    data.selectAllGK = false
    data.selectAllFGK = false
  }
}

const gkAllChange = (value) => {
  if (value) {
    data.checkSlAll = false
    data.checkFgkAll = false

    data.selectAllGK = true
    data.selectAllFGK = false
  } else {
    data.selectAllGK = false
  }
}

const fgkAllChange = (value) => {
  if (value) {
    data.checkSlAll = false
    data.checkGkAll = false

    data.selectAllGK = false
    data.selectAllFGK = true
  } else {
    data.selectAllFGK = false
  }
}

function setFullScreen() {
  // isFull.value = !isFull.value
  // const elem = mainCmdRef.value // 获取你想要全屏的元素
  // if (!document.fullscreenElement) {
  //   if (elem.requestFullscreen) {
  //     elem.requestFullscreen()
  //   } else if (elem.mozRequestFullScreen) {
  //     /* Firefox */
  //     elem.mozRequestFullScreen()
  //   } else if (elem.webkitRequestFullscreen) {
  //     /* Chrome, Safari & Opera */
  //     elem.webkitRequestFullscreen()
  //   } else if (elem.msRequestFullscreen) {
  //     /* IE/Edge */
  //     elem.msRequestFullscreen()
  //   }
  // } else {
  //   if (document.exitFullscreen) {
  //     document.exitFullscreen()
  //   } else if (document.mozCancelFullScreen) {
  //     /* Firefox */
  //     document.mozCancelFullScreen()
  //   } else if (document.webkitExitFullscreen) {
  //     /* Chrome, Safari and Opera */
  //     document.webkitExitFullscreen()
  //   } else if (document.msExitFullscreen) {
  //     /* IE/Edge */
  //     document.msExitFullscreen()
  //   }
  // }
  if (screenfull.isEnabled) {
    let element = document.querySelector('.main-div')
    screenfull.toggle(element)
  }
  isFull.value = !isFull.value
}
</script>
<style scoped>
@font-face {
  font-family: YouSheBiaoTiHei; /* 定义字体的名称 */
  src: url('/images/staff/YouSheBiaoTiHei-2.ttf') format('truetype'); /* 指定字体文件的路径和格式 */
}

.main-div {
  margin: 0;
  background: url('/images/staff/background.png') top center no-repeat !important;
  background-size: 100% 100% !important;
}

.top-div {
  width: 100%;
  height: 12%;
  background: url('/images/staff/top.png');
  background-size: 100% 100%;
}

.bottom-div {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 88%;
}

.top-content:nth-child(1) {
  width: 35%;
  height: calc(100% - 2.5vh);
  padding: 2.5vh 0 0 1%;
}

.top-content:nth-child(3) {
  width: 34%;
  height: calc(100% - 2.5vh);
  padding: 2.5vh 0 0 11%;
}

.top-content:nth-child(2) {
  width: 29%;
  height: 100%;
  padding-top: 1vh;
  font-family: YouSheBiaoTiHei;
  font-size: 3.6vmin;
  color: #fff;
  background-size: 100% 100%;
}

.top-rec {
  align-items: center;
  width: 3.5vw;
  height: 2.3vh;
  padding-top: 3px;
  margin-left: 10px;
  font-size: 1.3vmin;
  color: white;
  text-align: center;
  cursor: pointer;
  background: url('/images/staff/top-rec.png');
  background-size: 100% 100%;
}

.bottom-content:nth-child(1) {
  position: relative;
  height: 25%;
}

.bottom-content:nth-child(1)::after {
  position: absolute;
  bottom: -8px; /* 从父节点底部延伸 */
  left: 50%;
  width: 2px;
  height: 8px;
  content: '';
  background: linear-gradient(to bottom, #26c5f9, #80eaff);
  transform: translateX(-50%);
}

.bottom-content:nth-child(2) {
  position: relative;
  height: 15%;
  margin-top: 15px;
}

.bottom-content:nth-child(2)::after {
  position: absolute;
  bottom: 0px; /* 从父节点底部延伸 */
  left: 50%;
  width: 2px;
  height: 12px;
  content: '';
  background: linear-gradient(to bottom, #26c5f9, #80eaff);
  transform: translateX(-50%);
}

.bottom-content:nth-child(3) {
  height: 22%;
  margin-top: 10px;
}

.bottom-content:nth-child(4) {
  height: 36%;
  margin-top: 4px;
}

.hor-line {
  width: 50%;
  height: 1px;
  background: url('/images/staff/hor-line.png') no-repeat;
  background-size: 100% 100%;
}

.ver-line {
  width: 1px;
  height: 50%;
  background: url('/images/staff/ver-line.png') no-repeat;
  background-size: 100% 100%;
}

.is-full {
  width: 24px;
  height: 24px;
  margin: auto;
  cursor: pointer;
  background: url('/images/zlksh/dpoc_pd_fqp.png') no-repeat top center;
  background-size: 100% 100%;
}

.not-full {
  width: 24px;
  height: 24px;
  margin: auto;
  cursor: pointer;
  background: url('/images/zlksh/dpoc_pd_qp.png') no-repeat top center;
  background-size: 100% 100%;
}

:deep(.el-checkbox) {
  margin-right: 15px;
}

/* :deep(.el-checkbox__input) {
  border: 1px solid #78d2ff;
  border-radius: 50%;
} */

:deep(.el-checkbox__label) {
  color: #d9f0ff;
}

:deep(.el-checkbox__input .el-checkbox__inner) {
  background-color: transparent;
  border: 1px solid #78d2ff;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: transparent;
}

/* :deep(.el-checkbox__input.is-checked .el-checkbox__inner::after) {
  width: 11px;
  height: 11px;
  background-color: #78d2ff;
  border-radius: 50%;
  position: absolute;
  left: 0px;
  top: 0px;
} */

:deep(.el-checkbox.is-checked .el-checkbox__label) {
  color: #d9f0ff;
}

.el-main {
  padding-top: 0;
}

:deep(.el-table) {
  --el-table-border-color: rgba(20, 48, 133, 1);
  --el-table-header-bg-color: transparent;
  --el-table-bg-color: transparent;
  --el-table-tr-bg-color: transparent;
}

/* 表头样式 */
:deep(.el-table__header) th {
  color: white; /* 表头文字颜色 */
  background: linear-gradient(to bottom, rgba(107, 144, 255, 0), rgba(107, 144, 255, 0.3)) !important; /* 表头背景色 */
}

/* 表体样式 */
:deep(.el-table__body) tr {
  color: #fff; /* 表体文字颜色 */
  background-color: rgba(20, 48, 133, 0.2) !important; /* 表体背景色 */
}

/* 鼠标悬停行样式 */
:deep(.el-table__body) tr:hover > td {
  background-color: rgba(20, 48, 133, 0.8) !important;
}

/* 斑马纹表格样式 */
:deep(.el-table__body) tr.el-table__row--striped {
  background-color: rgba(20, 48, 133, 1);
}

:deep(.head-d) {
  color: #fff;
}

:deep(.el-collapse) {
  border: none;
}

:deep(.el-collapse-item__header) {
  margin-top: 10px;
  background-color: transparent;
  border-radius: 5px 5px 0 0;
}

:deep(.el-collapse-item__wrap) {
  background-color: transparent;
  border: none;
  border-radius: 0 0 5px 5px;
}

:deep(.demo-form-inline .el-input) {
  background-color: rgba(0, 83, 141, 0.22);
}

:deep(.el-input__inner) {
  color: white !important;
  background-color: rgba(0, 83, 141, 0.22);
}

:deep(.el-input__wrapper) {
  background-color: rgba(0, 83, 141, 0.22);
  box-shadow: 0 0 0 1px rgba(0, 83, 141, 1) inset;
}

:deep(.el-input.is-disabled .el-input__wrapper) {
  background-color: rgba(0, 83, 141, 0.22);
  box-shadow: 0 0 0 1px rgba(0, 83, 141, 1) inset;
}

:deep(.el-select__wrapper) {
  background-color: rgba(0, 83, 141, 0.22);
  box-shadow: 0 0 0 1px rgba(0, 83, 141, 1) inset;
}

:deep(.el-textarea__inner) {
  color: white !important;
  background-color: rgba(0, 83, 141, 0.22);
  box-shadow: 0 0 0 1px rgba(0, 83, 141, 1) inset;
}

:deep(.el-textarea .el-input__count) {
  color: white;
  background-color: rgba(0, 83, 141, 0.22);
}

:deep(.el-collapse-item:last-child) {
  margin: 0;
}

:deep(.el-tag) {
  background-color: rgba(0, 78, 152, 1);
  color: white;
}

:deep(.el-form-item__label) {
  color: white;
}

:deep(.el-select__placeholder) {
  color: white;
}

/* 滚动条样式 **/
:deep(div::-webkit-scrollbar) {
  width: 3px;
}

:deep(div::-webkit-scrollbar-track) {
  border-radius: 4px;
}

:deep(.body-d::-webkit-scrollbar-thumb) {
  background: #2c3753 !important;
  border-radius: 10px;
}

:deep(div::-webkit-scrollbar-thumb:hover) {
  background: #40a0ff;
}

:deep(.el-input.is-disabled .el-input__inner) {
  -webkit-text-fill-color: #b5b5bd;
  color: #b5b5bd;
}

:deep(.el-select__wrapper.is-disabled .el-select__selected-item) {
  color: #b5b5bd;
}

:deep(.el-textarea.is-disabled .el-textarea__inner) {
  color: #b5b5bd;
}
</style>
<style>
.no-margin {
  margin-top: 0 !important;
}
</style>
