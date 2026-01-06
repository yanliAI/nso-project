<template>
  <div class="sheng-left">
    <div class="sheng-gs"></div>
  </div>
  <div
    class="sheng-right flex"
    :style="{
      '--child-count': provincalData.length,
      '--child-width': '210px' /* 子节点固定宽度 */
    }"
  >
    <div class="whole-sheng" v-for="(item, index) in provincalData">
      <div class="sheng-main" :class="{ selected: !item.target && selectedItems.includes(index), 'target-selected': item.target && selectedItems.includes(index), 'default-bg': !item.target && !selectedItems.includes(index), 'target-bg': item.target && !selectedItems.includes(index) }" @click="toggleSelection(index)" :key="index">
        <div class="sheng-head" :class="{ 'default-head': !item.target, 'target-head': item.target }">
          <div class="sheng-icon" :class="{ 'default-icon': !item.target, 'target-icon': item.target }"></div>
          <span class="sheng-head-title" :class="{ 'default-title': !item.target, 'target-title': item.target }">{{ item.unitName }}</span>
          <div class="sheng-target" v-if="item.target"></div>
        </div>
        <div class="sheng-content flex">
          <div class="content-left" v-if="item.orgContent[0]" :class="{ 'default-content': !item.target, 'target-content': item.target }">
            <div class="content-top" :class="{ 'default-top': !item.target, 'target-top': item.target }">
              <span class="sheng-content-unit" :class="{ 'default-unit': !item.target, 'target-unit': item.target }"> {{ item.orgContent[0].orgRole }}</span>
            </div>
            <div class="content-input" v-for="(value, key) in item.orgContent[0].dutyPersonVOs" :class="{ 'default-input': !item.target, 'target-input': item.target }">
              <div class="sheng-explain">
                <el-popover placement="right" :width="350" trigger="click">
                  <template #reference>
                    <span class="sheng-explain-role" @click.stop="">{{ value[0]?.posRole }}</span>
                  </template>
                  <el-table :data="value" size="small">
                    <el-table-column width="100" property="posRole" label="岗位" align="center" />
                    <el-table-column width="100" property="dutyPerson" label="人员名称" align="center" />
                    <el-table-column width="150" property="dutyPhone" label="电话号码" align="center" />
                  </el-table>
                </el-popover>
                <span class="sheng-explain-name" :class="{ 'default-name': !item.target, 'target-name': item.target }">{{ value[0]?.dutyPerson }}</span>
              </div>
              <div class="sheng-inner">{{ value[0]?.dutyPhone }}</div>
            </div>
          </div>
          <div class="content-left" v-if="item.orgContent[1]" :class="{ 'default-content': !item.target, 'target-content': item.target }">
            <div class="content-top" :class="{ 'default-top': !item.target, 'target-top': item.target }">
              <span class="sheng-content-unit" :class="{ 'default-unit': !item.target, 'target-unit': item.target }">{{ item.orgContent[1].orgRole }}</span>
            </div>
            <div class="content-input" v-for="(value, key) in item.orgContent[1].dutyPersonVOs" :class="{ 'default-input': !item.target, 'target-input': item.target }">
              <div class="sheng-explain">
                <el-popover placement="right" :width="350" trigger="click">
                  <template #reference>
                    <span class="sheng-explain-role" @click.stop="">{{ value[0]?.posRole }}</span>
                  </template>
                  <el-table :data="value" size="small">
                    <el-table-column width="100" property="posRole" label="岗位" align="center" />
                    <el-table-column width="100" property="dutyPerson" label="人员名称" align="center" />
                    <el-table-column width="150" property="dutyPhone" label="电话号码" align="center" />
                  </el-table>
                </el-popover>
                <span class="sheng-explain-name" :class="{ 'default-name': !item.target, 'target-name': item.target }">{{ value[0]?.dutyPerson }}</span>
              </div>
              <div class="sheng-inner">{{ value[0]?.dutyPhone }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { bg } from 'element-plus/es/locales.mjs'
import { ref, reactive, watch } from 'vue'

const emit = defineEmits(['selectionChange'])
const provincalData = defineModel('provincalData')
const selectAllGK = defineModel('selectAllGK')

const data = reactive({
  isSelected: false
})
const selectedItems = ref([])

function toggleSelection(index) {
  const currentIndex = selectedItems.value.indexOf(index)
  if (currentIndex === -1) {
    selectedItems.value.push(index)
  } else {
    selectedItems.value.splice(currentIndex, 1)
  }
}

watch(provincalData, (newVal) => {
  selectedItems.value = []
})

watch(
  selectedItems,
  (newVal) => {
    const selected = newVal.map((index) => provincalData.value[index])
    emit('selectionChange', 'GKUnit', selected)
  },
  { deep: true }
)

watch(selectAllGK, (newVal) => {
  if (selectAllGK.value) {
    for (let i = 0; i < provincalData.value.length; i++) {
      const currentIndex = selectedItems.value.indexOf(i)
      if (currentIndex === -1) {
        selectedItems.value.push(i)
      }
    }
  } else {
    for (let i = 0; i < provincalData.value.length; i++) {
      const currentIndex = selectedItems.value.indexOf(i)
      if (currentIndex !== -1) {
        selectedItems.value.splice(currentIndex, 1)
      }
    }
  }
})
</script>

<style scoped>
.sheng-left {
  position: absolute;
  left: 1%;
  width: 8%;
  height: 16%;
}

.sheng-right {
  position: relative;
  display: flex;
  gap: 4px;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.sheng-right::before {
  position: absolute;
  top: -10px;
  left: 50%;
  width: calc((var(--child-count) - 1) * var(--child-width) + (var(--child-count) - 1) * 12px /* gap宽度 */);
  max-width: 100%; /* 不超过容器宽度 */
  height: 2px;
  content: '';
  background: linear-gradient(to bottom, #26c5f9, #80eaff);
  transform: translateX(-50%); /* 水平居中 */
}

.whole-sheng {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 218px;
  height: 100%;
  cursor: pointer;
}

.whole-sheng::before {
  position: absolute;
  top: -10px;
  left: 50%;
  width: 2px;
  height: 10px;
  content: '';
  background: linear-gradient(to bottom, #26c5f9, #80eaff);
  transform: translateX(-50%);
}

.sheng-gs {
  width: 128.49px;
  height: 128px;
  background: url('/images/staff/sheng.png') no-repeat;
  background-size: 100% 100%;
}

.ver-line {
  width: 1px;
  height: 8px;
  background: url('/images/staff/ver-line.png') no-repeat;
  background-size: 100% 100%;
}

.sheng-main {
  width: 100%;
  height: calc(100% - 8px);
}

.sheng-main.selected {
  background: url('/images/staff/sheng-main-checked.png') no-repeat;
  background-size: 100% 100%;
}

.target-bg {
  background: url('/images/staff/targetUnit.png') no-repeat;
  background-size: 100% 100%;
}

.target-selected {
  background: url('/images/staff/targetUnit-selected.png') no-repeat;
  background-size: 100% 100%;
}

.default-bg {
  background: url('/images/staff/sheng-main.png') no-repeat;
  background-size: 100% 100%;
}

.target-head {
  background: url('/images/staff/target-head.png') no-repeat;
  background-size: 100% 100%;
}

.default-head {
  background: url('/images/staff/组90.png') no-repeat;
  background-size: 100% 100%;
}

.sheng-head {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 18%;
}

.sheng-target {
  position: absolute;
  top: 30%;
  left: 70%;
  width: 32px;
  height: 32px;
  background: url('/images/staff/target.png') no-repeat;
  background-position: center;
  background-size: 100% 100%;
}

.default-icon {
  background: url('/images/staff/sheng-icon.png') no-repeat;
}

.target-icon {
  background: url('/images/staff/target-icon.png') no-repeat;
}

.sheng-icon {
  width: 20px;
  height: 100%;
  background-position: center;
}

.default-title {
  background: linear-gradient(to bottom, #fff, #2caeff);
}

.target-title {
  background: linear-gradient(to bottom, #fff, #f6bd16);
}

.sheng-head-title {
  font-size: 14px;
  font-weight: bold;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-fill-color: transparent;
}

.sheng-content {
  gap: 4px;
  justify-content: center;
  width: 100%;
  height: 82%;
}

.default-content {
  background: url('/images/staff/sheng-content-left.png') no-repeat;
  background-size: 100% 100%;
}

.target-content {
  background: url('/images/staff/target-content.png') no-repeat;
  background-size: 100% 100%;
}

.content-left {
  width: 46%;
  height: 94%;
  margin-top: 1%;
}

.default-top {
  background: url('/images/staff/sheng-content-top.png') no-repeat;
  background-size: 100% 100%;
}

.target-top {
  background: url('/images/staff/target-head.png') no-repeat;
  background-size: 100% 100%;
}

.content-top {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20%;
}

.default-unit {
  background: linear-gradient(to bottom, #fff, #2ce3ff);
}

.target-unit {
  background: linear-gradient(to bottom, #fff, #f6bd16);
}

.sheng-content-unit {
  font-size: 12px;
  font-weight: bold;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-fill-color: transparent;
}

.default-input {
  background: url('/images/staff/content-input.png') no-repeat;
}

.target-input {
  background: url('/images/staff/target-input.png') no-repeat;
}

.content-input {
  width: 100%;
  height: 23%;
  margin-top: 3%;
  background-size: 100% 100%;
}

.sheng-explain {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 4px;
  align-items: center;
  justify-content: start;
  width: 100%;
  height: 44%;
}

.sheng-explain-role {
  grid-column: 1;
  justify-self: start;
  font-size: 12px;
  color: #fff;
  cursor: pointer;
}

.default-name {
  color: #2ce3ff;
}

.target-name {
  color: #f6bd16;
}

.sheng-explain-name {
  grid-column: 2;
  justify-self: start;
  font-size: 12px;
}

.sheng-inner {
  display: flex;
  align-items: center;
  width: 100%;
  height: 55%;
  margin-top: 1px;
  font-size: 12px;
  color: #fff;
}
</style>
<style>
.el-popper {
  background: rgb(0 44 100 / 85%) !important;
  border: 1px solid #0d5fc0 !important;
}

.el-popper.is-light,
.el-popper.is-light > .el-popper__arrow::before {
  background: rgb(0 44 100 / 85%) !important;
  border-bottom: 1px solid #0d5fc0 !important;
  border-left: 1px solid #0d5fc0 !important;
}

.el-table {
  --el-table-border-color: rgb(20 48 133 / 100%) !important;
  --el-table-header-bg-color: transparent !important;
  --el-table-bg-color: transparent !important;
  --el-table-tr-bg-color: transparent !important;
}

/* 表头样式 */
.el-table__header th {
  color: white !important; /* 表头文字颜色 */
  background: linear-gradient(to bottom, rgb(107 144 255 / 0%), rgb(107 144 255 / 30%)) !important; /* 表头背景色 */
}

/* 表体样式 */
.el-table__body tr {
  color: #fff !important; /* 表体文字颜色 */
  background-color: rgb(20 48 133 / 20%) !important; /* 表体背景色 */
}

/* 鼠标悬停行样式 */
.el-table__body tr:hover > td {
  background-color: rgb(20 48 133 / 80%) !important;
}

/* 斑马纹表格样式 */
.el-table__body tr.el-table__row--striped {
  background-color: rgb(20 48 133 / 100%) !important;
}

.el-table th.el-table__cell {
  background: linear-gradient(to bottom, rgb(107 144 255 / 0%), rgb(107 144 255 / 30%)) !important; /* 表头背景色 */
}
</style>
