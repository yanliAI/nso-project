<template>
  <Page auto-content-height>
    <el-container class="h-full bg-white">
    <el-header height="50px">
      <el-row :gutter="26" class="mt-2">
        <el-col :span="5" class="col">
          <div class="flex items-center">
            <span class="w-[120px]">重保标题：</span>
            <el-input
              v-model="input"
              style="width: 100%"
              placeholder="输入重保标题"
              :suffix-icon="Search"
              @change="handleClick"
            />
          </div>
        </el-col>
        <el-col :span="5" class="col" v-if="showCalendarPage">
          <el-checkbox-group v-model="choice">
            <el-checkbox v-for="box in boxlist"  :label="box.lable" :value="box.value">
            </el-checkbox>
          </el-checkbox-group>
        </el-col>
        <el-col :span="4" v-if="showCalendarPage">
          <!-- {{datePickerValue}} -->
          <el-date-picker placeholder="Pick a day" v-model="datePickerValue" @clear ="closeDatePicker" >
          </el-date-picker>
          <!-- {{dateRangeValue[0]}}{{dateRangeValue[1]}} -->
        </el-col>
        <el-col :span="6" v-if="!showCalendarPage">
          <div class="flex items-center">
            <span class="w-[160px]">重保开始时间：</span>
            <el-date-picker v-model="dateRangeValue" type="daterange">
            </el-date-picker>
          </div>
          <!-- {{dateRangeValue[0]}}{{dateRangeValue[1]}} -->
        </el-col>
        <el-col :span="1">
          <el-button type="primary" @click="handleClick()">查询</el-button>
        </el-col>
        <el-col :span="4" style="margin-left: auto" class="text-right">
          <el-radio-group v-model="action">
            <el-radio-button label="日历视图" @click="showPageMethod('calendar')" value="1" />
            <el-radio-button label="列表视图" @click="showPageMethod('list')" value="2" />
          </el-radio-group>
        </el-col>
      </el-row>
      </el-header>
      <el-main style="height: calc(100% - 50px);">
        <CalendarView v-if="showCalendarPage" 
          ref="calendarView"
          v-model:datePickerValue="datePickerValue"
          @changeDate = "changeDatePickerValue" 
          :statusList = "choice"
          :title = "input"
          >
          <!-- :datePickerValue="datePickerValue" -->
        </CalendarView>
        <ListView v-if="!showCalendarPage"
          :beginTime="dateRangeValue[0]"
          :endTime="dateRangeValue[1]"
          :title = "input"
        >
        </ListView>
      </el-main>
    </el-container>
  </Page>
</template>

<script setup lang="ts">
import { Page } from '@vben/common-ui';
import { ElRow, ElCol, ElCheckbox, ElCheckboxGroup, ElButtonGroup, ElButton, ElInput, ElMain, ElContainer, ElHeader} from 'element-plus'
import { ref, onMounted } from 'vue'
import CalendarView from "./CalendarView.vue"
import ListView from "./ListView.vue"
import { Search } from '@element-plus/icons-vue';

const input = ref()
const showCalendarPage = ref(true)
const boxlist = [{lable:'待执行', value: 1},{lable:'执行中', value: 2},{lable:'已完成', value: 3}]
const datePickerValue = ref(new Date())
const dateRangeValue = ref()
const choice = ref([2])
const calendarView = ref(null)
const action = ref('1')

onMounted(() => {
  let first = getFirstDayOfMonth();
  dateRangeValue.value = [first, new Date()]
})

function handleClick(){
  // console.log("input:" + input.value + "  choice:" + choice.value)
  if(calendarView.value){
    calendarView.value.getCurrentMonthData(datePickerValue.value)
  }
  
}
function getFirstDayOfMonth() {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
function changeDatePickerValue(date: Date){
  datePickerValue.value = date
}
function showPageMethod(pageName){
  if("calendar".match(pageName)){
    showCalendarPage.value = true
  } else if ("list".match(pageName)){
    showCalendarPage.value = false
  }
  // console.log(showCalendarPage.value)
}
function closeDatePicker(){
  datePickerValue.value = new Date()
}

function inputchange(){
  // console.log('change')
}

</script>

<style scoped>
  .main {
    margin: 1% 1.5%;
    background-color: hsl(var(--sidebar));
  }


  :deep(.el-main){
    padding: 0;
  }
</style>
