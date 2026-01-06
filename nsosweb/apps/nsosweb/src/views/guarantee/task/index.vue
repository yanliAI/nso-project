<template>
  <div style="height: 100%">
    <el-container class="h-full bg-white">
      <el-header height="45px">
        <el-row :gutter="26" class="mt-3">
          <el-col :span="4" class="col">
            <el-input
              v-model="input"
              style="width: 100%"
              placeholder="输入重保标题"
              :suffix-icon="Search"
              @change="handleClick"
            />
          </el-col>
          <el-col :span="4">
            <el-date-picker placeholder="Pick a day" v-model="datePickerValue" @clear ="closeDatePicker">
            </el-date-picker>
          </el-col>
          <el-col :span="3">
            <el-select v-model="guaranteeLevelValue" placeholder="选择保障类别" :width="240">
              <el-option
                v-for="item in dropList.NSOS_GUARANTEE_LEVEL"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" @click="getListData()">查询</el-button>
            <el-button type="info" @click="reset()">重置</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-main style="height: calc(100% - 395px);">
        <div class="h-[22px] ">重要保障列表</div>
        <el-table
          ref="singleTableRef" size="small"
          style="height: calc(100% - 22px)"
          :data="guaranteeData"
          :border="true"
          highlight-current-row
          @row-click="getGuaranteeLiveData">

          <el-table-column type="index" label="#" width="35"/>
          <!-- <el-table-column type="selection" label="" width="60"/> -->
          <el-table-column prop="guaranteeTitle" label="重要保障名称" width="180"/>
          <el-table-column prop="guaranteeStartTime" label="重要保障开始时间" width="145" :formatter="formatTimestamp_Date"/>
          <el-table-column prop="guaranteeEndTime" label="重要保障结束时间" width="145" :formatter="formatTimestamp_Date"/>
          <el-table-column prop="guaranteeLevel" label="保障级别" width="120" :formatter="dropLabel_GuaranteeLevel"/>
          <el-table-column prop="checkStatus" label="最近巡检结果" width="115" :formatter="dropLabel_CheckStatus"/>
          <el-table-column prop="emAlarmNum" label="紧急告警数"/>
          <el-table-column prop="majorAlarmNum" label="重大告警数"/>
          <el-table-column prop="faultNum" label="故障异常数"/>
          <el-table-column prop="finishedTask" label="实时作业(单)"/>
        </el-table>
      </el-main>
      <el-footer height="350px">
        <div class="h-[22px] ">保障实况</div>
        <el-table :data="guaranteeLiveData" style="height: calc(100% - 30px)" :border="true" size="small">
          <el-table-column type="index" label="#" width="35"/>
          <el-table-column prop="systemName" label="保障系统"/>
          <el-table-column prop="guaranteeStartTime" label="重要保障开始时间" width="145" :formatter="formatTimestamp_Date"/>
          <el-table-column prop="guaranteeEndTime" label="重要保障结束时间" width="145" :formatter="formatTimestamp_Date"/>
          <el-table-column prop="guaranteeDate" label="保障日期" width="145" :formatter="formatTimestamp_Date"/>
          <el-table-column prop="inspectionResult" label="本轮巡检结果" width="115" :formatter="dropLabel_CheckStatus"/>
          <el-table-column prop="inspectionMan" label="巡检人"/>
          <el-table-column prop="inspectionProgress" label="巡检进度"/>
          <el-table-column prop="nextCheckTime" label="下次巡检时间" :formatter="formatTimestamp"/>
          <el-table-column prop="emAlarmNum" label="紧急告警" width="85"/>
          <el-table-column prop="majorAlarmNum" label="重大告警" width="85"/>
          <el-table-column prop="faultNum" label="故障异常" width="85"/>
          <el-table-column prop="finishedTask" label="实时作业" width="85"/>
          <!-- <el-table-column label="操作">
            <template #default="scope">
              <span class="caozuo" @click="openNotifyDialog(1, scope.row)">通知</span>
              <span class="caozuo" @click="openNotifyDialog(2, scope.row)">催办</span>
            </template>
          </el-table-column>
          <el-table-column label="巡检记录">
            <template #default="scope">
              <el-button
              circle
              :icon="Document"
              @click="openDialog(scope.row)"
              ></el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </el-footer>
    </el-container>

    
    <el-dialog v-model="dialogTableVisible" :title="dialogTitle + '巡检报告'" width="800">
      <el-table :data="dialogTableData" size="small">
        <el-table-column type="index" label="#" width="60"/>
        <el-table-column prop="systemName" label="保障系统"/>
        <el-table-column prop="guaranteeDate" label="保障日期" :formatter="formatTimestamp_Date"/>
        <el-table-column prop="inspectionPeriod" label="巡检结果" :formatter="dropLabel_CheckStatus"/>
        <el-table-column prop="checkMan" label="巡检人"/>
        <el-table-column prop="checkTime" label="巡检时间" :formatter="formatTimestamp"/>
        <el-table-column prop="inspectionReport" label="巡检报告"/>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" text type="primary">
              下载（未实现）
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog v-model="dialogNotifyVisible" :title="'通知/催办信息'" width="70%">
      <div class="flex items-center w-full space-x-16">
        <div>
          保障系统：{{selectedNotifyRow.systemName}}
        </div>
        <div>
          保障日期：{{formatTimestamp_Date(null, null, selectedNotifyRow.guaranteeDate)}}
        </div>
        <div>
          通知类型：{{dropLabel_RecordType(null, null, selectedNotifyRow.recordType)}}
        </div>
      </div>
      <div class="pt-4">
        重要保障列表
        <el-table :data="dialogNotifyTableData" border>
          <el-table-column type="index" label="#" width="35"/>
          <el-table-column prop="sysName" label="保障系统"/>
          <el-table-column prop="guaranteeDate" label="保障日期" :formatter="formatTimestamp_Date"/>
          <el-table-column prop="recordType" label="记录类型" :formatter="dropLabel_RecordType"/>
          <el-table-column prop="notifyMan" label="通知人"/>
          <el-table-column prop="notifyTime" label="通知时间" :formatter="formatTimestamp"/>
          <el-table-column prop="notifyComtent" label="联系内容"/>
          <el-table-column prop="notifyResult" label="联系结果" :formatter="dropLabel_NotifyResult"/>
          <el-table-column prop="notifyTarget" label="联系人"/>
          <el-table-column prop="notifyType" label="通知方式" :formatter="dropLabel_NotifyType"/>
          <el-table-column prop="contact" label="联系方式"/>
        </el-table>
      </div>
      <div class="pt-4 w-full">
        <div class="border-b-2" style="border-color: hsl(var(--primary))">
          通知/催办详情
        </div>
        <div class="flex justify-center w-full">
          <el-form :model="dialogNotifyFormData" :rules="rules" ref="formRef" label-width="auto" class="grid grid-cols-3 grid-rows-4 pt-4 w-4/5 gap-x-4">
            <el-form-item prop="notifyTarget" label="联系人">
              <el-input v-model="dialogNotifyFormData.notifyTarget" />
            </el-form-item>
            <el-form-item prop="notifyType" label="通知方式">
              <el-select v-model="dialogNotifyFormData.notifyType"  placeholder="请选择通知方式">
                <el-option
                  v-for="item in dropList.NSOS_NOTIFY_TYPE"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="contact" label="联系方式">
              <el-input v-model="dialogNotifyFormData.contact"/>
            </el-form-item>
            <el-form-item prop="notifyComtent" label="联系内容" class="col-span-3 row-span-2 items-center">
              <el-input v-model="dialogNotifyFormData.notifyComtent" type="textarea"/>
            </el-form-item>
            <el-form-item prop="notifyResult" label="通知结果">
              <el-select v-model="dialogNotifyFormData.notifyResult"  placeholder="请选择通知结果">
                <el-option
                  v-for="item in dropList.NSOS_NOTIFY_RESULT"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="通知人">
              <el-input model-value='xxx' disabled></el-input>
            </el-form-item>
            <el-form-item label="通知时间">
              <el-input model-value='系统自动生成' disabled></el-input>
            </el-form-item>
            <el-form-item class="col-start-2 col-span-1">
              <el-button type="primary" @click="onSubmit">发送</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>
        </div>

      </div>

    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {ElRow, ElCol,ElInput,ElTable, ElTableColumn, ElDialog, ElForm, ElFormItem, ElMessage, ElMain, ElContainer, ElHeader, ElFooter} from 'element-plus';
import {Document} from '@element-plus/icons-vue';
import { requestClient } from '#/api/request';
import {ref, onMounted, reactive} from 'vue';
import { useDropStore } from '#/store';

const dropList: any = reactive({});

const guaranteeLevelValue = ref()
const input = ref()
const datePickerValue = ref(new Date())
const guaranteeData = ref()
const guaranteeLiveData = ref()
const singleTableRef = ref()
const dialogTableVisible = ref(false)
const dialogTitle = ref()
const dialogTableData = ref()

const dialogNotifyVisible = ref(false)
const selectedNotifyRow = ref()
const dialogNotifyTableData = ref()
const dialogNotifyFormData = ref({
  notifyTarget: '',
  contact:'',
  notifyType: '',
  notifyComtent: '',
  notifyResult: '',
})
const formRef = ref(null);
// 表单验证规则
const rules = ref({
  notifyTarget: [
    { required: true, message: '请输入联系人', trigger: 'blur' }
  ],
  contact: [
    { required: true, message: '请输入联系方式', trigger: 'blur' }
  ],
  notifyComtent: [
    { required: true, message: '请输入联系内容', trigger: 'blur' }
  ]
});

const setCurrent = (row?: Object) => {
  singleTableRef.value!.setCurrentRow(row)
}

function openNotifyDialog(type, row){
  selectedNotifyRow.value = row
  selectedNotifyRow.value.recordType = type
  getNotifyList(selectedNotifyRow.value)
  dialogNotifyVisible.value = true
}

function getNotifyList(row){
  requestClient.post(import.meta.env.VITE_NSOSGZ + '/insNotifyRecord/getNotifyList', {
    guaranteeDate: row.guaranteeDate,
    systemNo: row.systemNo
  }).then(result => {
    if(result !== null && result != undefined){
      dialogNotifyTableData.value = result
    }
  })
}

function reset(){
  input.value = ""
  datePickerValue.value = new Date()
  guaranteeLevelValue.value = ""
}

function onSubmit(){
  formRef.value.validate((valid) => {
    if (valid) {
      requestClient.post(import.meta.env.VITE_NSOSGZ + '/insNotifyRecord/insertNotifyRecord', {
        ...dialogNotifyFormData.value,
        guaranteeDate: selectedNotifyRow.value.guaranteeDate,
        systemNo: selectedNotifyRow.value.systemNo,
        recordType: selectedNotifyRow.value.recordType,
        inspectionCode: selectedNotifyRow.value.inspectionCode
      }).then(result => {
        ElMessage({
          message: dropLabel_RecordType(null, null, selectedNotifyRow.value.recordType) +'成功',
          type: 'success',
        })
        getNotifyList(selectedNotifyRow.value)
      })
      // console.log(dialogNotifyFormData.value);
      formRef.value.resetFields();
    }
  });
}

function formatTimestamp(row, column, cellValue) {
  if(cellValue === null || cellValue === undefined){
    return cellValue
  }
  const date = new Date(cellValue);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function formatTimestamp_Date(row, column, cellValue) {
  if(cellValue === null || cellValue === undefined){
    return cellValue
  }
  const date = new Date(cellValue);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}年${month}月${day}日`;
}

function openDialog(row){
  dialogTableVisible.value = true
  dialogTitle.value = row.systemName
  requestClient.post(import.meta.env.VITE_NSOSGZ + '/inspectionRecord/common_queryDataListNoPaging', {
    "guaranteeNo" : row.guaranteeNo,
    "guaranteeDate" : transformDate2String(datePickerValue.value),
    "systemNo" : row.systemNo
  }).then(result => {
    if(result !== null && result !== undefined){
      dialogTableData.value = result
    }
  })
}

function getListData(){
  requestClient.post(import.meta.env.VITE_NSOSGZ + '/guaranteeInfo/common_queryDataListNoPaging', {
    "guaranteeStartTime" : transformDate2String(datePickerValue.value),
    "guaranteeEndTime" : transformDate2String(datePickerValue.value),
    "guaranteeTitle" : input.value,
    "guaranteeLevel": guaranteeLevelValue.value
  }).then(result => {
    // if(result !== null && result !== undefined && result.length > 0){
      result.forEach(obj => {
        const finish = obj.realTimeTaskNum === undefined ? 0 : obj.realTimeTaskNum
        const total = obj.taskNum === undefined ? 0 : obj.taskNum
        obj.finishedTask = finish + '/' + total
      })
      guaranteeData.value = result
      singleTableRef.value.setCurrentRow(result?.[0])
      getGuaranteeLiveData(result?.[0])
    // }
  })
}

function getGuaranteeLiveData(row){
  requestClient.post(import.meta.env.VITE_NSOSGZ + '/dayInfo/getGuaranteeLiveData', {
    "guaranteeNo" : row?.guaranteeNo,
    "guaranteeDate" : transformDate2String(datePickerValue.value)
  }).then(result => {
    // if(result !== null && result !== undefined && result.length > 0){
      guaranteeLiveData.value = result
    // }
  })
}

function transformDate2String(date: Date){
  return `${date.getFullYear()}-${clockFactory(date.getMonth() + 1)}-${clockFactory(date.getDate())}`
}

function clockFactory(time: number): string {
  //${}：这是模板字符串中嵌入表达式的方式。
  return `${time >= 10 ? time : '0' + time}`;
}

function dropLabel_GuaranteeLevel(row, column, value){
  const option = dropList.NSOS_GUARANTEE_LEVEL.find(option => option.value === value);
  return option ? option.label : value;
}
function dropLabel_CheckStatus(row, column, value){
  const option = dropList.NSOS_CHECK_STATUS.find(option => option.value == value);
  return option ? option.label : value;
}
function dropLabel_NotifyType(row, column, value){
  const option = dropList.NSOS_NOTIFY_TYPE.find(option => option.value == value);
  return option ? option.label : value;
}
function dropLabel_NotifyResult(row, column, value){
  const option = dropList.NSOS_NOTIFY_RESULT.find(option => option.value == value);
  return option ? option.label : value;
}
function dropLabel_RecordType(row, column, value){
  const option = dropList.NSOS_RECORD_TYPE.find(option => option.value == value);
  return option ? option.label : value;
}

onMounted(async () => {
  const dropStore = useDropStore();
  await dropStore.initDrops(['NSOS_GUARANTEE_LEVEL', 'NSOS_CHECK_STATUS','NSOS_NOTIFY_TYPE','NSOS_NOTIFY_RESULT','NSOS_RECORD_TYPE']);
  dropStore.get(dropList, ['NSOS_GUARANTEE_LEVEL', 'NSOS_CHECK_STATUS','NSOS_NOTIFY_TYPE','NSOS_NOTIFY_RESULT','NSOS_RECORD_TYPE']);
  getListData();
})

</script>

<style>
.tableClass{
  height: 46.5%;
  margin: 0 1.5%;
  overflow: auto
}

.caozuo{
  margin: 5px 10px;
  font-size: 12px;
  color: hsl(var(--primary));
  cursor: pointer
}

.main {
    margin: 1% 1.5%;
    background-color: hsl(var(--sidebar));
  }
</style>
