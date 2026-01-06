<template>
  <div class="professional-body flex">
    <div class="title"></div>
    <div class="professional-stage flex">
      <div class="professional-div" v-for="(item, index) in professionalData" :class="{ selected: selectedItems.includes(index) }" @click="toggleSelection(index)" :key="index">
        <div class="professional-head">
          <span class="professional-head-text">{{ item.unitName }}</span>
        </div>
        <div class="professional-main flex">
          <div class="professional-input" v-for="(value, key, index1) in item.professionalContent">
            <el-popover placement="right" :width="350" trigger="click">
              <template #reference>
                <div class="input-head" @click.stop="">{{ value[0]?.posRole }}</div>
              </template>
              <el-table :data="value" size="small">
                <el-table-column width="100" property="posRole" label="岗位" align="center" />
                <el-table-column width="100" property="dutyPerson" label="人员名称" align="center" />
                <el-table-column width="150" property="dutyPhone" label="电话号码" align="center" />
              </el-table>
            </el-popover>
            <div class="input-main">
              <div class="input-name">{{ value[0]?.dutyPerson }}</div>
              <div class="input-phone">
                {{ value[0]?.dutyPhone }}
              </div>
            </div>
          </div>
          <!-- <div class="professional-input" v-if="item.professionalContent[1]">
            <div class="input-head">{{ item.professionalContent[1].posRole }}</div>
            <div class="input-main">
              <div class="input-name">{{ item.professionalContent[1].dutyPerson }}</div>
              <div class="input-phone">
                {{ item.professionalContent[1].dutyPhone }}
              </div>
            </div>
          </div>
          <div class="professional-input" v-if="item.professionalContent[2]">
            <div class="input-head">{{ item.professionalContent[2].posRole }}</div>
            <div class="input-main">
              <div class="input-name">{{ item.professionalContent[2].dutyPerson }}</div>
              <div class="input-phone">
                {{ item.professionalContent[2].dutyPhone }}
              </div>
            </div>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

const emit = defineEmits(['selectionChange'])
const professionalData = defineModel('professionalData')
const selectAllFGK = defineModel('selectAllFGK')
const selectedItems = ref([])
const data = reactive({
  isSelected: false
})

function toggleSelection(index) {
  const currentIndex = selectedItems.value.indexOf(index)
  if (currentIndex === -1) {
    selectedItems.value.push(index)
  } else {
    selectedItems.value.splice(currentIndex, 1)
  }
}

watch(professionalData, (newVal) => {
  selectedItems.value = []
})

watch(
  selectedItems,
  (newVal) => {
    const selected = newVal.map((index) => professionalData.value[index])
    emit('selectionChange', 'FGKUnit', selected)
  },
  { deep: true }
)

watch(selectAllFGK, (newVal) => {
  if (selectAllFGK.value) {
    for (let i = 0; i < professionalData.value.length; i++) {
      const currentIndex = selectedItems.value.indexOf(i)
      if (currentIndex === -1) {
        selectedItems.value.push(i)
      }
    }
  } else {
    for (let i = 0; i < professionalData.value.length; i++) {
      const currentIndex = selectedItems.value.indexOf(i)
      if (currentIndex !== -1) {
        selectedItems.value.splice(currentIndex, 1)
      }
    }
  }
})
</script>

<style scoped>
.professional-body {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  padding-left: 7%;
}

.professional-stage {
  gap: 8px;
  justify-content: center;
  width: 98%;
  height: 100%;
  padding: 0 0 10px 20px;
  background: url('/images/staff/stage-1.png') no-repeat;
  background-position: bottom;
  background-size: 100% 50%;
}

.title {
  position: absolute;
  top: 70%;
  left: 1%;
  z-index: 1;
  width: 141.43px;
  height: 128px;
  background: url('/images/staff/专业公司.png') no-repeat;
  background-size: 100% 100%;
}

.professional-div {
  position: relative;
  z-index: 2;
  width: 76px;
  height: 88%;
  cursor: pointer;
  background: url('/images/staff/professional-body.png') no-repeat;
  background-size: 100% 100%;
}

.professional-div.selected {
  background: url('/images/staff/professional-body-checked.png') no-repeat;
  background-size: 100% 100%;
}

.professional-head {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 12%;
  background: url('/images/staff/professional-head.png') no-repeat;
  background-size: 100% 100%;
}

.professional-head-text {
  font-size: 12px;
  font-weight: bold;
  background: linear-gradient(to bottom, #fff, #2caeff);
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-fill-color: transparent;
}

.professional-main {
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 88%;
  padding-left: 4px;
}

.professional-input {
  width: 30%;
  height: 95%;
}

.input-head {
  display: flex;
  align-items: center;
  width: 80%;
  height: 38%;
  font-size: 12px;
  color: #fff;
  text-align: center;
  cursor: pointer;
  background: url('/images/staff/professional-content-head.png') no-repeat;
  background-size: 100% 100%;
}

.input-main {
  width: 80%;
  height: 62%;
  padding-top: 2px;
  text-align: center;
  background: url('/images/staff/professional-content-main.png') no-repeat;
  background-size: 100% 100%;
}

.input-name {
  height: auto;
  font-size: 12px;
  color: #2cf8ff;
}

.input-phone {
  width: 100%;
  height: auto;
  font-size: 12px;
  color: #fff;
  writing-mode: vertical-lr;
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
