<template>
  <div class="top-1">
    <div class="wang-gs"></div>
  </div>
  <div class="top-2">
    <div class="gs-headquarters" v-if="headquarterData.length !== 0">
      <div class="gs-headquarters-head">
        <img src="/images/staff/组169.png" />
        <span class="gs-headquarters-title">
          {{ headquarterData.orgRole }}
        </span>
      </div>
      <div class="gs-headquarters-bottom flex">
        <div class="gs-headquarters-item flex" v-for="(value, key, index) in headquarterData.dutyPersonVOs">
          <div class="headquarters-bottom-content">
            <el-popover placement="right" :width="350" trigger="click">
              <template #reference>
                <div class="headquarters-content-head">{{ value[0]?.posRole }}</div>
              </template>
              <el-table :data="value" size="small">
                <el-table-column width="100"  property="posRole" label="岗位" align="center"/>
                <el-table-column width="100"  property="dutyPerson" label="人员名称" align="center"/>
                <el-table-column width="150" property="dutyPhone" label="电话号码" align="center"/>
              </el-table>
            </el-popover>
            <div class="headquarters-content-name">{{ value[0]?.dutyPerson }}</div>
            <!-- <div class="headquarters-content-phone">{{ item.dutyPhone }}</div> -->
          </div>
          <div class="headquarters-bottom-line" v-if="index !== headquarterData.dutyPersonVOs.length - 1"></div>
        </div>
      </div>
    </div>
    <div class="headquarters-middle">
      <div class="headquarters-line" v-if="officeData.length !== 0 && headquarterData.length !== 0"></div>
    </div>
    <div class="headquarter-center flex" v-if="centerData.length !== 0">
      <div class="headquarter-center-head">
        <span class="headquarter-center-title">{{ centerData.orgRole }}</span>
      </div>
      <div class="headquarter-center-main">
        <div class="headquarter-center-item" v-for="(value, key, index) in centerData.dutyPersonVOs">
          <div class="headquarter-center-content">
            <el-popover placement="right" :width="350" trigger="click">
              <template #reference>
                <div class="center-content-head">{{ value[0]?.posRole }}</div>
              </template>
              <el-table :data="value" size="small">
                <el-table-column width="100"  property="posRole" label="岗位" align="center"/>
                <el-table-column width="100"  property="dutyPerson" label="人员名称" align="center"/>
                <el-table-column width="150" property="dutyPhone" label="电话号码" align="center"/>
              </el-table>
            </el-popover>
            <div class="center-content-name">{{ value[0]?.dutyPerson }}</div>
            <div class="center-content-phone">{{ value[0]?.dutyPhone }}</div>
          </div>
          <div class="headquarters-bottom-line" v-if="index != centerData.dutyPersonVOs.length - 1"></div>
        </div>
      </div>
    </div>
  </div>
  <div class="top-3">
    <div class="headquarter-office flex" v-if="officeData.length !== 0">
      <div class="headquarter-office-head">
        <span class="headquarter-office-title">{{ officeData.orgRole }}</span>
      </div>
      <div class="headquarter-office-main">
        <div class="headquearter-office-input" v-for="(value, key, index) in officeData.dutyPersonVOs">
          <el-popover placement="right" :width="350" trigger="click">
              <template #reference>
                <div class="office-input-title">{{ value[0]?.posRole }}</div>
              </template>
              <el-table :data="value" size="small">
                <el-table-column width="100"  property="posRole" label="岗位" align="center"/>
                <el-table-column width="100"  property="dutyPerson" label="人员名称" align="center"/>
                <el-table-column width="150" property="dutyPhone" label="电话号码" align="center"/>
              </el-table>
            </el-popover>
          <div class="office-input-info">
            <span class="office-input-name">{{ value[0]?.dutyPerson }}</span>
            <span class="office-input-phone">{{ value[0]?.dutyPhone }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const headquarterData = defineModel('headquarterData')
const centerData = defineModel('centerData')
const officeData = defineModel('officeData')

onMounted(async () => {})
</script>

<style scoped>
.wang-gs {
  width: 135px;
  height: 128px;
  background: url('/images/staff/wang.png') no-repeat;
  background-size: 100% 100%;
}

.top-1 {
  width: 30%;
  padding-left: 1%;
}

.top-2 {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40%;
}

.top-3 {
  width: 30%;
}

.gs-headquarters {
  position: relative;
  width: 339px;
  height: 55%;
  background: url('/images/staff/组55.png') no-repeat;
  background-size: 100% 100%;
}

.gs-headquarters::after {
  position: absolute;
  bottom: -24px; /* 从父节点底部延伸 */
  left: 50%;
  width: 2px;
  height: 24px;
  content: '';
  background: linear-gradient(to bottom, #26c5f9, #80eaff);
  transform: translateX(-50%);
}

.gs-headquarters-head {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 30%;
  background: url('/images/staff/路径.png') no-repeat;
}

.gs-headquarters-title {
  margin-left: 2px;
  font-size: 18px;
  font-weight: bold;
  background: linear-gradient(to bottom, #fff, #2caeff);
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-fill-color: transparent;
}

.gs-headquarters-bottom {
  height: 70%;
}

.gs-headquarters-item {
  width: calc(33% + 2px);
  height: 100%;
}

.headquarters-middle {
  position: relative;
  display: flex;
  justify-content: end;
  width: 100%;
  height: 26px;
}

.headquarters-line::before {
  position: absolute;
  top: 50%;
  bottom: 0;
  left: 50%;
  width: 50%;
  height: 2px;
  content: '';
  background: linear-gradient(to bottom, #26c5f9, #80eaff);
}

.headquarters-line {
  width: 100%;
  height: 100%;
}

.headquarters-bottom-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(100% - 2px);
  padding-top: 10px;
}

.headquarters-bottom-line {
  width: 2px;
  height: 100%;
  background: url('/images/staff/直线16.png') no-repeat;
  background-position: bottom;
}

.headquarters-content-head {
  width: 96px;
  height: 33%;
  font-size: 14px;
  color: #80eaff;
  text-align: center;
  cursor: pointer;
  background: url('/images/staff/矩形140.png') no-repeat;
}

.headquarters-content-name {
  height: 33%;
  margin-top: 10px;
  font-size: 14px;
  color: #fff;
}

.headquarters-content-phone {
  height: 33%;
  font-size: 12px;
  color: #fff;
}

.headquarter-center {
  width: 500px;
  height: 40%;
  background: url('/images/staff/组56.png') no-repeat;
  background-size: 100% 100%;
}

.headquarter-center-head {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 11%;
  height: 100%;
  background: url('/images/staff/top-2-2-head.png') no-repeat;
  background-size: 100% 100%;
}

.headquarter-center-main {
  display: flex;
  width: 89%;
  height: 100%;
}

.headquarter-center-item {
  display: flex;
  width: calc(33% + 2px);
  height: 100%;
}

.headquarter-center-title {
  max-width: 2em;
  font-size: 18px;
  font-weight: bold;
  word-break: break-all;
  background: linear-gradient(to bottom, #fff, #2caeff);
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-fill-color: transparent;
}

.center-content-head {
  width: 90%;
  height: 30%;
  margin-top: 10px;
  color: #80eaff;
  text-align: center;
  cursor: pointer;
  background: url('/images/staff/矩形139.png') no-repeat;
}

.headquarter-center-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(100% - 2px);
  font-size: 14px;
}

.center-content-name {
  height: 30%;
  font-size: 14px;
  color: #bff1ff;
}

.center-content-phone {
  height: 30%;
  font-size: 14px;
  color: #fff;
}

.headquarter-office {
  position: relative;
  width: 238px;
  height: 75%;
  margin-top: 30px;
  background: url('/images/staff/top-3.png') no-repeat;
  background-size: 100% 100%;
}

.headquarter-office-head {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20%;
  height: 100%;
  text-align: center;
  background: url('/images/staff/top-3-head.png') no-repeat;
  background-size: 100% 100%;
}

.headquarter-office-title {
  font-size: 18px;
  font-weight: bold;
  background: linear-gradient(to bottom, #fff, #2caeff);
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-fill-color: transparent;
}

.headquarter-office-main {
  display: flex;
  flex-direction: column;
  gap: 4%;
  align-items: center;
  width: 80%;
  height: 100%;
  padding-top: 4%;
}

.headquearter-office-input {
  display: flex;
  flex-direction: column;
  width: 88%;
  height: 28%;
  background: url('/images/staff/top-3-content.png') no-repeat;
  background-size: 100% 100%;
}

.office-input-title {
  font-size: 14px;
  color: #80eaff;
  cursor: pointer;
}

.office-input-info {
  display: grid;
  grid-template-columns: 1fr 50px 1fr;
  margin-top: 2%;
  font-size: 14px;
}

.office-input-name {
  grid-column: 1;
  color: #bff1ff;
}

.office-input-phone {
  grid-column: 2;
  color: #fff;
}
</style>
<style>
.el-popper{
  background: rgb(0 44 100 / 85%)!important;
  border: 1px solid #0d5fc0!important;
}

.el-popper.is-light, .el-popper.is-light>.el-popper__arrow::before{
  background: rgb(0 44 100 / 85%)!important;
  border-bottom: 1px solid #0d5fc0!important;
  border-left: 1px solid #0d5fc0!important;
}

.el-table {
  --el-table-border-color: rgb(20 48 133 / 100%)!important;
  --el-table-header-bg-color: transparent!important;
  --el-table-bg-color: transparent!important;
  --el-table-tr-bg-color: transparent!important;
}

/* 表头样式 */
.el-table__header th {
  color: white !important; /* 表头文字颜色 */
  background: linear-gradient(to bottom, rgb(107 144 255 / 0%), rgb(107 144 255 / 30%)) !important; /* 表头背景色 */
}

/* 表体样式 */
.el-table__body tr {
  color: #fff!important; /* 表体文字颜色 */
  background-color: rgb(20 48 133 / 20%) !important; /* 表体背景色 */
}

/* 鼠标悬停行样式 */
.el-table__body tr:hover > td {
  background-color: rgb(20 48 133 / 80%) !important;
}

/* 斑马纹表格样式 */
.el-table__body tr.el-table__row--striped {
  background-color: rgb(20 48 133 / 100%)!important;
}

.el-table th.el-table__cell{
  background: linear-gradient(to bottom, rgb(107 144 255 / 0%), rgb(107 144 255 / 30%)) !important; /* 表头背景色 */
}
</style>
