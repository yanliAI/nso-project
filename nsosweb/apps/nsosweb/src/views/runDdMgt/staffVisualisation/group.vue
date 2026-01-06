<template>
  <div class="group-body">
    <div class="group-bg"></div>
    <div
      class="stage-one flex"
      :style="{
        '--child-count': groupData.length,
        '--safe-count': safeData.length,
        '--child-width': '170px' /* 子节点固定宽度 */
      }"
    >
      <div class="group-content" v-for="item in groupData">
        <div class="group-body">
          <div class="group-left">
            <div class="group-img"></div>
            <div class="group-name">{{ item.orgRole }}</div>
          </div>
          <div class="group-right">
            <div class="group-input" v-for="(value, key, index) in item.dutyPersonVOs">
              <div class="group-explain" v-if="index <= 1">
                <el-popover placement="right" :width="350" trigger="click">
                  <template #reference>
                    <span class="group-explain-role"> {{ value[0]?.posRole }}</span>
                  </template>
                  <el-table :data="value" size="small">
                    <el-table-column width="100" property="posRole" label="岗位" align="center" />
                    <el-table-column width="100" property="dutyPerson" label="人员名称" align="center" />
                    <el-table-column width="150" property="dutyPhone" label="电话号码" align="center" />
                  </el-table>
                </el-popover>
                <span class="group-explain-name"> {{ value[0]?.dutyPerson }}</span>
              </div>
              <div class="group-inner" v-if="index <= 1">{{ value[0]?.dutyPhone }}</div>
            </div>
            <!-- <div class="group-input" v-if="item.dutyPersonVOs[1]">
              <div class="group-explain">
                <span class="group-explain-role">{{ item.dutyPersonVOs[1][0]?.posRole }}</span>
                <span class="group-explain-name">{{ item.dutyPersonVOs[1][0]?.dutyPerson }}</span>
              </div>
              <div class="group-inner">{{ item.dutyPersonVOs[1][0]?.dutyPhone }}</div>
            </div> -->
          </div>
        </div>
      </div>
      <div class="safe-content flex" v-if="safeData.length !== 0">
        <div class="safe-head">
          <span class="safe-title">{{ safeData[0].orgRole }}</span>
        </div>
        <div class="safe-main">
          <div class="safe-input" v-for="(value, key, index) in safeData[0].dutyPersonVOs">
            <div class="safe-input-title" v-if="index <= 1">
              <el-popover placement="right" :width="350" trigger="click">
                <template #reference>
                  <span class="safe-input-role">{{ value[0]?.posRole }}</span>
                </template>
                <el-table :data="value" size="small">
                  <el-table-column width="100" property="posRole" label="岗位" align="center" />
                  <el-table-column width="100" property="dutyPerson" label="人员名称" align="center" />
                  <el-table-column width="150" property="dutyPhone" label="电话号码" align="center" />
                </el-table>
              </el-popover>
              <span class="safe-input-person">{{ value[0]?.dutyPerson }}</span>
            </div>
            <div class="safe-info" v-if="index <= 1">{{ value[0]?.dutyPhone }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, watch } from 'vue'

const groupData = defineModel('groupData')
const safeData = defineModel('safeData')
onMounted(async () => {
  let a = [1]
  console.log(a.slice(0, 2))
})
</script>
<style scoped>
.group-body {
  display: flex;
  width: 100%;
  height: 100%;
}

.group-bg {
  position: absolute;
  left: 4%;
  width: 100%;
  height: 100%;
  background: url('/images/staff/stage-1.png') no-repeat;
  background-size: 85% 100%;
}

.stage-one {
  position: relative;
  gap: 12px;
  justify-content: center;
  width: 100%;
  height: 100%;

  /* background: url('/images/staff/stage-1.png') no-repeat;
  background-size: 100% 100%; */
  padding-bottom: 25px;
}

.stage-one::before {
  position: absolute;
  top: -8px;
  left: 50%;
  width: calc((var(--child-count) + var(--safe-count) - 1) * var(--child-width) + (var(--child-count) + var(--safe-count) - 1) * 12px);
  max-width: 100%; /* 不超过容器宽度 */
  height: 2px;
  content: '';
  background: linear-gradient(to bottom, #26c5f9, #80eaff);
  transform: translateX(-50%); /* 水平居中 */
}

.group-div {
  width: 100%;
  height: 100%;
}

.group-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 170px;
}

.group-content::before {
  position: absolute;
  top: -8px;
  left: 50%;
  width: 2px;
  height: 6px;
  content: '';
  background: linear-gradient(to bottom, #26c5f9, #80eaff);
  transform: translateX(-50%);
}

.group-left {
  width: 33%;
  height: 100%;
}

.group-right {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  width: 67%;
  height: 100%;
  padding-top: 4px;
  margin-left: 2px;
  background: url('/images/staff/矩形131.png') no-repeat;
  background-size: 100% 100%;
}

.group-input {
  display: flex;
  flex-direction: column;
  width: 95%;
  height: 44%;
}

.group-explain {
  display: grid;
  grid-template-columns: 1fr 4px 1fr;
  width: 95%;
  height: 44%;
}

.group-explain-role {
  grid-column: 1;
  font-size: 12px;
  color: #fff;
  cursor: pointer;
}

.group-explain-name {
  grid-column: 3;
  font-size: 12px;
  color: #78d2ff;
}

.group-inner {
  display: flex;
  align-items: center;
  width: 100%;
  height: 55%;
  font-size: 12px;
  color: #fff;
  background: url('/images/staff/矩形130.png') no-repeat;
  background-size: 100% 100%;
}

.group-img {
  width: 100%;
  height: 60%;
  background: url('/images/staff/底座3.png') no-repeat 100% 100%;
}

.group-name {
  width: 100%;
  height: 40%;
  font-size: 14px;
  color: #aae3ff;
  text-align: center;
}

.safe-content::before {
  position: absolute;
  top: -8px;
  left: 50%;
  width: 2px;
  height: 6px;
  content: '';
  background: linear-gradient(to bottom, #26c5f9, #80eaff);
  transform: translateX(-50%);
}

.safe-content {
  position: relative;
  width: 170px;
  height: 100%;
  background: url('/images/staff/safe-content.png') no-repeat;
  background-size: 100% 100%;
}

.safe-head {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 25%;
  height: 100%;
  text-align: center;
  background: url('/images/staff/safe-head.png') no-repeat;
  background-size: 100% 100%;
}

.safe-title {
  width: 4ch;
  font-size: 14px;
  font-weight: bold;
  white-space: pre-wrap;
  background: linear-gradient(to bottom, #fff, #b9e0ff);
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-fill-color: transparent;
}

.safe-main {
  display: flex;
  flex-direction: column;
  gap: 20%;
  align-items: center;
  width: 75%;
  height: 100%;
  padding-top: 4%;
}

.safe-input {
  display: flex;
  flex-direction: column;
  width: 88%;
  height: 28%;
  background: url('/images/staff/safe-input.png') no-repeat;
  background-size: 100% 100%;
}

.safe-info {
  font-size: 14px;
  color: #80eaff;
}

.safe-input-title {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-top: 2%;
  font-size: 14px;
}

.safe-input-person {
  grid-column: 2;
  color: #bff1ff;
}

.safe-input-role {
  grid-column: 1;
  color: #fff;
  cursor: pointer;
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
