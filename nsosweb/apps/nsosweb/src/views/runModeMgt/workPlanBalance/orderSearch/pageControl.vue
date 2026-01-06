<template>
  <div >
    <div style="margin-bottom: 10px; display: flex; align-items: center;">
      <div style="font-weight: 500; font-size: 18px; width: calc(100% - 100px); text-align: center;">
          {{isOrderDetail==='1'?'工单详情':isOrderDetail==='2'?'流程详情':'计划详情'}}
      </div>
      <div style="width: 100px;">
        <el-button v-if="isOrderDetail === '1'" type="success" @click="isOrderDetail = '2'" size="small">流程详情</el-button>
        <el-button v-if="isOrderDetail === '2'" type="success" @click="isOrderDetail = '1'" size="small">工单详情</el-button>
        <el-button v-if="isOrderDetail === '3'" type="success" @click="isOrderDetail = '1'" size="small">工单详情</el-button>
      </div>
    </div>
    <div style="height:calc(100vh - 200px); overflow-y: auto;">
      <div v-if="orderType==='信息两票'" >
        <OperationOrder v-if="isOrderDetail==='1'" sourceType="1" :oid="oid"  @custom-event="toWorkPlanPage" @sendPid="getPidVal"></OperationOrder>
        <OperationFlow v-if="isOrderDetail==='2'" :oid="oid" :pid="pid" ></OperationFlow>
        <OperationPlanOrder v-if="isOrderDetail==='3'" :oid="oid" :workPlanOid="workPlanOid" @custom-event="toWorkPlanPage" @sendParam="getPidVal" ></OperationPlanOrder>
      </div>
      <div v-if="orderType==='并网管控'">
        <NetOrder v-if="isOrderDetail==='1'"  sourceType="1"  :oid="oid" @custom-event="toWorkPlanPage" @sendPid="getPidVal"></NetOrder>
        <NetFlow v-if="isOrderDetail==='2'" :oid="oid" :pid="pid" ></NetFlow>
        <NetPlanOrder v-if="isOrderDetail==='3'" :nid="workPlanOid" @custom-event="toWorkPlanPage" @sendPid="getPidVal"></NetPlanOrder>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">

import { ElTable,ElAffix, ElTableColumn, ElFormItem, ElForm, ElInput, ElButton, ElSelect, ElOption, ElPagination, ElContainer, ElHeader, ElMain, ElFooter, ElDialog, ElMessage, ElMessageBox, ElText, ElLink, ElTag, ElTooltip } from 'element-plus'
import { ref, reactive, computed, onMounted } from 'vue'

import OperationOrder from '../jobInfo/oidDetails.vue'
import OperationPlanOrder from '../jobInfo/workPlanDetail.vue'
import OperationFlow from '../jobInfo/flowDetail.vue'   
import NetOrder from '../../gridConnectionAnalysis/gridOrderDetails/gridOrderDetail.vue'
import NetPlanOrder from '../../gridConnectionAnalysis/gridOrderDetails/gridPlanDetail.vue'
import NetFlow from '../../gridConnectionAnalysis/gridOrderDetails/flowDetail.vue'

const orderType = defineModel('orderType') // 工单类型
const oid =  defineModel('oid') 
const pid = ref('')
const workPlanOid = ref('')

const isOrderDetail = ref('1')  // 切换工单详情/流程详情





// 获取作业详情pid
function getPidVal(val){
  pid.value = val.pid,
  workPlanOid.value = val.wid 
}

// 切换到计划页面
function toWorkPlanPage(){
  isOrderDetail.value = '3'
}
</script>
