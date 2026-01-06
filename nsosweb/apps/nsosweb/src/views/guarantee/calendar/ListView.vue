<template>
  <div style="height: 100%">

      <el-tabs v-model="tabValue" type="border-card" class="h-full w-full">
        <el-tab-pane :label="'待执行('+count1+')'" name="1" class="h-full w-full">
          <el-container class="h-full bg-white">
            <el-main style="height: calc(100% - 35px);">
              <el-table :data="tableData" style="height: 100%;" :border="true" size="small">
                <el-table-column type="index" label="序号" width="60"/>
                <el-table-column prop="guaranteeTitle" label="重保名称"/>
                <el-table-column prop="guaranteeStatus" label="执行状态"/>
                <el-table-column prop="guaranteeStartTime" label="重保开始时间" :formatter="formatTimestamp"/>
                <el-table-column prop="guaranteeEndTime" label="重保结束时间" :formatter="formatTimestamp"/>
                <el-table-column label="重保涉及系统">
                  <!-- <el-table-column prop="systemTitle" label="重保涉及系统"/> -->
                  <el-table-column label="重保涉及系统">
                    <template v-slot="scope">
                      <ul>
                        <li v-for="(systemInfo, index) in scope.row.systemInfoList" :key="index">
                          {{ systemInfo.systemName }}
                        </li>
                      </ul>
                      <!-- <div v-for="(systemTitle, index) in scope.row.systemTitleList" :key="index">
                        {{ systemTitle }}
                      </div> -->
                    </template>
                  </el-table-column>
                  <el-table-column prop="systemLevel" label="系统等级"/>
                </el-table-column>
                <el-table-column prop="guaranteeLevel" label="保障等级"/>
                <el-table-column prop="inspectionPeriod" label="巡检时段"/>
              </el-table>
            </el-main>
            <el-footer height="35px">
              <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="pageSizes"
                :disabled="disabled"
                :background="background"
                layout="total, sizes, prev, pager, next, jumper"
                :total="count1"
                @size-change="getList"
                @current-change="getList"
              />
            </el-footer>
          </el-container>
        </el-tab-pane>

        <el-tab-pane :label="'执行中('+count2+')'" name="2" class="h-full w-full">
          <el-container class="h-full bg-white">
            <el-main style="height: calc(100% - 35px);">
              <el-table :data="tableData" style="height: 100%" :border="true" size="small">
                <el-table-column type="index" label="序号" width="60"/>
                <el-table-column prop="guaranteeTitle" label="重保名称"/>
                <el-table-column prop="guaranteeStatus" label="执行状态"/>
                <el-table-column prop="guaranteeStartTime" label="重保开始时间" :formatter="formatTimestamp"/>
                <el-table-column prop="guaranteeEndTime" label="重保结束时间" :formatter="formatTimestamp"/>
                <el-table-column label="重保涉及系统">
                  <!-- <el-table-column prop="systemTitle" label="重保涉及系统"/> -->
                  <el-table-column label="重保涉及系统">
                    <template v-slot="scope">
                      <ul>
                        <li v-for="(systemInfo, index) in scope.row.systemInfoList" :key="index">
                          {{ systemInfo.systemName }}
                        </li>
                      </ul>
                      <!-- <div v-for="(systemTitle, index) in scope.row.systemTitleList" :key="index">
                        {{ systemTitle }}
                      </div> -->
                    </template>
                  </el-table-column>
                  <el-table-column prop="systemLevel" label="系统等级"/>
                </el-table-column>
                <el-table-column prop="guaranteeLevel" label="保障等级"/>
                <el-table-column prop="inspectionPeriod" label="巡检时段"/>
              </el-table>
            </el-main>
            <el-footer height="35px">
              <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="pageSizes"
                :disabled="disabled"
                :background="background"
                layout="total, sizes, prev, pager, next, jumper"
                :total="count2"
                @size-change="getList"
                @current-change="getList"
              />
            </el-footer>
          </el-container>
        </el-tab-pane>

        <el-tab-pane :label="'已完成('+count3+')'" name="3" class="h-full w-full">
          <el-container class="h-full bg-white">
            <el-main style="height: calc(100% - 35px);">
              <el-table :data="tableData" style="height: 100%" :border="true" size="small">
                <el-table-column type="index" label="序号" width="60"/>
                <el-table-column prop="guaranteeTitle" label="重保名称"/>
                <el-table-column prop="guaranteeStatus" label="执行状态"/>
                <el-table-column prop="guaranteeStartTime" label="重保开始时间" :formatter="formatTimestamp"/>
                <el-table-column prop="guaranteeEndTime" label="重保结束时间" :formatter="formatTimestamp"/>
                <el-table-column label="重保涉及系统">
                  <!-- <el-table-column prop="systemTitle" label="重保涉及系统"/> -->
                  <el-table-column label="重保涉及系统">
                    <template v-slot="scope">
                      <ul>
                        <li v-for="(systemInfo, index) in scope.row.systemInfoList" :key="index">
                          {{ systemInfo.systemName }}
                        </li>
                      </ul>
                      <!-- <div v-for="(systemTitle, index) in scope.row.systemTitleList" :key="index">
                        {{ systemTitle }}
                      </div> -->
                    </template>
                  </el-table-column>
                  <el-table-column prop="systemLevel" label="系统等级"/>
                </el-table-column>
                <el-table-column prop="guaranteeLevel" label="保障等级"/>
                <el-table-column prop="inspectionPeriod" label="巡检时段"/>
              </el-table>
            </el-main>
            <el-footer height="35px">
              <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="pageSizes"
                :disabled="disabled"
                :background="background"
                layout="total, sizes, prev, pager, next, jumper"
                :total="count3"
                @size-change="getList"
                @current-change="getList"
              />
            </el-footer>
          </el-container>
        </el-tab-pane>
      </el-tabs>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, watch, toRefs} from 'vue'
import { requestClient } from '#/api/request';
import { ElTabs, ElTabPane, ElButton, ElTable, ElTableColumn, ElPagination, ElMain, ElContainer, ElFooter} from 'element-plus';
const tabValue = ref("1")
const count1 = ref(1)
const count2 = ref(1)
const count3 = ref(1)
const currentPage = ref(1)
const pageSize = ref(20)
const pageSizes = [20,50,100,200]
const count = ref(50)
const tableData = ref()
const props = defineProps({
  beginTime: {
    type: Date,
    default: new Date()
  },
  endTime: {
    type: Date,
    default: new Date()
  },
  title:{
    type: String,
    default: ""
  }
})

function getList(){
  requestClient.post(import.meta.env.VITE_NSOSGZ + '/guaranteeInfo/getList', {
    "guaranteeStartTime" : transformDate2String(props.beginTime),
    "guaranteeEndTime" : transformDate2String(props.endTime),
    "guaranteeStatus" : tabValue.value,
    "guaranteeTitle" : props.title,
    "pageNo" : currentPage.value,
    "pageSize" : pageSize.value
  }).then(result => {
    tableData.value = result?.list
    if(tabValue.value === "1"){
      count1.value = result == null ? 0 : result.count
    }else if(tabValue.value === "2"){
      count2.value = result == null ? 0 : result.count
    }else{
      count3.value = result == null ? 0 : result.count
    }
  })
}

function formatTimestamp(row, column, cellValue) {
  const date = new Date(cellValue);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function getEachCount(){
  requestClient.post(import.meta.env.VITE_NSOSGZ + '/guaranteeInfo/countEachStatus', {
    "guaranteeStartTime" : transformDate2String(props.beginTime),
    "guaranteeEndTime" : transformDate2String(props.endTime),
    "guaranteeTitle" : props.title
  }).then(result => {
    if(result !== null && result !== undefined){
      // console.log(result)
      count1.value = result.count1
      count2.value = result.count2
      count3.value = result.count3
    }
  })
}

function transformDate2String(date: Date){
  return `${date.getFullYear()}-${clockFactory(date.getMonth() + 1)}-${clockFactory(date.getDate())}`
}

function clockFactory(time: number): string {
  //${}：这是模板字符串中嵌入表达式的方式。
  return `${time >= 10 ? time : '0' + time}`;
}

const {beginTime,endTime,title} = toRefs(props)
watch(
  [beginTime, endTime, tabValue],
  () => {
    getEachCount()
    getList()
    currentPage.value = 1
  }
)

onMounted(() => {
  getEachCount()
  getList()
})
</script>

<style scoped>
.cell {
  text-align: center;
}

:deep(.el-tab-pane) {
  width: 100%;
  height: 100%;
}

:deep(.el-tabs--border-card>.el-tabs__content){
  padding: 2px;
}
</style>
