<template>
  <div class="main-dg">
    <div class="gbzjd">
      <el-anchor class="jknb" :offset="90" type="default" :container="containerRef" direction="vertical" @click="handleClick">
        <el-anchor-link href="#part1" title="故障信息"></el-anchor-link>
        <el-anchor-link href="#part2" title="故障研判"></el-anchor-link>
        <el-anchor-link href="#part3" title="故障处置"></el-anchor-link>
        <el-anchor-link href="#part4" title="故障验证与恢复"></el-anchor-link>
      </el-anchor>
    </div>
    <div class="ma-tabm">
      <div class="head-c">
        <div class="head-d">
          <div class="text-center font-bold text-lg mb-1">故障工单详情</div>
          <div class="flex items-center h-6">
            <div class="w-[160px]">故障单号：<span class="primary font-bold">{{ data.faultData.faultCode }}</span></div>
            <div class="ml-5 w-[150px]">问题来源：<span class="grey" v-if="dropList.NSOS_PROBLEM_SOURCE">{{ dropList.NSOS_PROBLEM_SOURCE.filter((d) => d.value == data.faultData.problemSource)[0]?.label }}</span></div>
            <div class="primary ml-[164px] flex items-center dianji" @click="disposeLogClick"><Postcard class="w-[14px] h-[14px] mr-[2px]"/>处置日志</div>
            <div class="flex-1 text-right pr-2">
              <el-button type="primary" v-if="data.faultData.faultStatus == '1'" class="ml-4" :icon="Tickets" @click="saveData" size="small">保存</el-button>
              <el-button type="primary" v-if="data.faultData.id && data.faultData.faultStatus == '1'" @click="complateClick" class="ml-4" :icon="Finished" size="small">处置完成</el-button>
              <!-- <el-button type="danger" v-if="data.faultData.id && data.faultData.faultStatus == '1'" :icon="Delete" @click="deleteClick" size="small">删除</el-button> -->
            </div>
          </div>
        </div>
      </div>
      <div ref="containerRef" class="btm-c">
        <div class="btm-d">
          <el-collapse v-model="activeNames" >
            <el-collapse-item title="故障信息" :icon="CaretRight" name="1">
              <template #title>
                <div class="flex items-center primary">
                  <div class="mnjkg mt-[-1px] mr-[2px]"></div>
                  <div class="ml-1 font-bold">故障信息</div>
                </div>
              </template>
              <div id="part1" class="part-b">
                <FaultFillIn ref="faultFillIn" :formData="data.faultData" :disabled="data.disabled"></FaultFillIn>
              </div>
            </el-collapse-item>
            <el-collapse-item title="故障研判" :icon="CaretRight" name="2">
              <template #title>
                <div class="flex items-center primary">
                  <div class="mnjkg mt-[-1px] mr-[2px]"></div>
                  <div class="ml-1 font-bold">故障研判</div>
                </div>
              </template>
              <div id="part2" class="part-b">
                <FaultAssess :faultData="data.faultData" :disabled="data.disabled"></FaultAssess>
              </div>
            </el-collapse-item>
            <el-collapse-item title="故障处置" :icon="CaretRight" name="3">
              <template #title>
                <div class="flex items-center primary">
                  <div class="mnjkg mt-[-1px] mr-[2px]"></div>
                  <div class="ml-1 font-bold">故障处置</div>
                </div>
              </template>
              <div id="part3" class="part-b">
                <FaultDispose :faultData="data.faultData" :disabled="data.disabled"></FaultDispose>
              </div>
            </el-collapse-item>
            <el-collapse-item title="故障验证与恢复" :icon="CaretRight" name="4">
              <template #title>
                <div class="flex items-center primary">
                  <div class="mnjkg mt-[-1px] mr-[2px]"></div>
                  <div class="ml-1 font-bold">故障验证与恢复</div>
                </div>
              </template>
              <div id="part4" class="part-b">
                <FaultVerify ref="faultVerifyRef" :faultData="data.faultData" :disabled="data.disabled"></FaultVerify>
              </div>
            </el-collapse-item>
          </el-collapse>
          <div style="height: 150px;"></div>
        </div>
      </div>
    </div>
    <ModalA class="w-[1000px] h-[550px] top-[15vh]" title="处置日志" :footer="false" :closeOnClickModal="false" :draggable="true">
      <el-table :data="data.disposeData" border size="small" style="height: calc(100% - 30px);">
        <el-table-column type="index" width="40" label="#" align="center"/>
        <el-table-column prop="disposeStep" label="环节" column-key="NSOS_FAULT_DEAL_JD" :formatter="formatDrop" width="100" align="center"/>
        <el-table-column prop="processLog" label="内容" align="left" header-align="center"/>
        <el-table-column prop="handledByName" label="操作人" width="100" align="center"/>
        <el-table-column prop="disposeTime" label="时间" v-if="queryState != '0'" :formatter="tDateTimeFormat" width="130" align="center"/>
        <el-table-column label="操作" width="70" align="center">
          <template #default="props">
            <div>
              <div class="flex items-center m-auto">
                <el-tooltip content="编辑" placement="bottom" effect="light">
                  <Edit class="dianji primary m-auto" @click="editLogClick(props.$index, props.row)" style="width:16px;height:16px"/>
                </el-tooltip>
                <el-tooltip content="删除" placement="bottom" effect="light">
                  <Delete class="dianji text-red-500 m-auto" @click="deleteDisLog(props.$index)" style="width:16px;height:16px"/>
                </el-tooltip>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="dianji primary flex items-center h-[30px]" @click="dealLogToExcelClick">
        <div class="flex-1"></div>
        <div class="w-[16px] h-[16px] mt-[0px] mr-[2px] excel-dc"></div>
        <span class="text-[13px] mt-[2px]">导出Excel</span>
      </div>
    </ModalA>
    <ModalB class="w-[500px] h-[300px] top-[18vh]" title="编辑日志" :footer="false" :closeOnClickModal="false" :draggable="true">
      <el-input :rows="9" v-model="data.editLog" maxlength="500" show-word-limit type="textarea" clearable/>
      <div class="text-center pt-[12px]">
        <el-button type="primary" class="ml-4" :icon="Tickets" @click="saveEditLog" size="small">保存</el-button>
        <el-button type="info" class="ml-4" :icon="Tickets" @click="modalApiB.close()" size="small">取消</el-button>
      </div>
    </ModalB>
  </div>
</template>
<script setup>
import { Page } from '@vben/common-ui';
import { ElAnchor, ElAnchorLink, ElCollapse, ElCollapseItem, ElNotification, ElMessage, ElMessageBox } from 'element-plus';
import { Tickets, Finished, Expand, CaretRight, Delete, Postcard, Edit } from '@element-plus/icons-vue';
import { ref, reactive, onMounted } from 'vue'
import FaultFillIn from './faultFillIn.vue'
import FaultAssess from './faultAssess.vue'
import FaultDispose from './faultDispose.vue'
import FaultVerify from './faultVerify.vue'
import { initFaultInfo, saveFaultInfo, formatDate, complateFault, deleteFault, queryDisposeRecord, saveDispose, deleteDispose, dealLogToExcel } from './faultDetailMethod.ts'
import { useVbenModal } from '@vben/common-ui';
import { tDateFormat, formatDateTime, tDateTimeFormat, formatDrop } from '#/utils/commonUtil.ts';
import { useDropStore } from '#/store';

const faultId = defineModel('faultId')
const emit = defineEmits(['afterAdd', 'refreshList', 'removeTab'])
const tabName = defineModel('tabName')
const containerRef = ref(null)
const faultVerifyRef = ref(null)
const activeNames = ref(['1','2','3','4'])
const dropList = reactive({});
const data = reactive({
  faultData: {
    faultSys: null,
    sysLevel: null,
    operateOrg: null,
    faultType: null,
  },
  disposeData: [],
  editLog: null,
  curEditIndex: null,
  disabled: false,
})
const [ModalA, modalApiA] = useVbenModal({
  onCancel() {
    modalApiA.close();
  },
});
const [ModalB, modalApiB] = useVbenModal({
  onCancel() {
    modalApiB.close();
  },
});
const faultFillIn = ref()
onMounted(async () => {
  const dropStore = useDropStore();
  const dropType = ['NSOS_FAULT_DEAL_JD', 'NSOS_PROBLEM_SOURCE']
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);

  data.faultData = await initFaultInfo({id: faultId.value})
  data.faultData.faultOccurTime = formatDate(data.faultData.faultOccurTime)
  data.faultData.faultDwTime = formatDate(data.faultData.faultDwTime)
  if (data.faultData.id && data.faultData.faultStatus == '2') {
    data.disabled = true
  }
});
const disposeLogClick = async () => {
  modalApiA.open()
  data.disposeData = await queryDisposeRecord({faultCode: data.faultData.faultCode})
}
const saveEditLog = async () => {
  data.disposeData[data.curEditIndex].processLog = data.editLog
  await saveDispose(data.disposeData[data.curEditIndex])
  ElMessage.success('保存成功！');
  modalApiB.close()
}
const deleteDisLog = async (index) => {
  await deleteDispose({ids: data.disposeData[index].id})
  ElMessage.success('删除成功！');
  data.disposeData.splice(index, 1)
}
const editLogClick = async (index, row) => {
  modalApiB.open()
  data.curEditIndex = index
  data.editLog = row.processLog
}
const saveData = async () => {
  // 校验填报表单
  let count = 0;
  await faultFillIn.value.validateForm(async (valid) => {
    if (count > 0) return;
    count++
    if (valid) {
      try {
        data.faultData = await saveFaultInfo(data.faultData);
        data.faultData.faultOccurTime = formatDate(data.faultData.faultOccurTime)
        data.faultData.faultDwTime = formatDate(data.faultData.faultDwTime)
        ElNotification({
          title: '提示',
          message: '保存成功！',
          type: 'success',
        })
        emit('afterAdd', data.faultData)
        emit('refreshList', false)
      } catch (error) {
        ElMessage.error('保存失败！');
      }
    } else {
      ElMessage.warning('请输入必填项！');
    }
  })
}
const complateClick = async () => {
  ElMessageBox.confirm(
    '确认是否处置完成?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      try {
        await complateFault({id: data.faultData.id})
        ElNotification({
          title: '提示',
          message: '处置完成！',
          type: 'success',
        })
        emit('removeTab', tabName.value)
        emit('refreshList', false)
      } catch (error) {
        ElMessage.error('处置完成失败！');
      }
    })
}
const deleteClick = async () => {
  ElMessageBox.confirm(
    '确认是否删除工单?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      try {
        await deleteFault({id: data.faultData.id})
        ElNotification({
          title: '提示',
          message: '删除成功！',
          type: 'success',
        })
        emit('removeTab', tabName.value)
        emit('refreshList', false)
      } catch (error) {
        ElMessage.error('删除失败！');
      }
    })
}
const dealLogToExcelClick = () => {
  dealLogToExcel({faultCode: data.faultData.faultCode}, data.faultData.faultCode+'_处置日志.xlsx')
}
const handleClick = (e) => {
  e.preventDefault()
}
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

:deep(.el-collapse-item__header){
  height: 35px;
  padding-left: 8px;
  background: #d9e9fc;
}

.primary{
  color: hsl(var(--primary));
}

.mnjkg{
  width: 4px;
  height: 13px;
  background: #4266ff;
  border-radius: 4px;
  box-shadow: 3px 2px 1px #b2c2ff;
}

.grey{
  color: #8E8E93;
}

:deep(.el-popper) {
  max-width: 600px!important;
}

.main-dg{
  display: flex;
  width: 100%;
  height: 100%;
  background: #fff;
}

.excel-dc{
  background: url('/images/common/excel.png') center no-repeat;
  background-size: 100% 100%;
}

.ma-tabm{
  width:100%;
  height: 100%;
  margin: auto;
  overflow: hidden;
  font-size: 12px;
  background: #fff;
}

.gbzjd{
  position: absolute;
  top:0;
  left:0;
  width: 20%;
}

.jknb{
  width: 60%;
  margin: auto;
  margin-top: 100px;
}

.head-d{
  width: 1050px;
  height: 100%;
  margin:auto;
}

.head-c{
  width: 100%;
  height: 62px;
}

.btm-d{
  width: 1050px;
  height: 100%;
  margin:auto;
}

.btm-c{
  width: 100%;
  height: calc(100% - 62px);
  overflow: auto;
}

.part-d{
  height: 300px;
}

.part-b{
  border-top: 1px solid #c4dbf5;
}

.dianji{
  font-weight: normal;
  cursor: pointer;
}

.dianji:hover{
  text-decoration: underline;
}
</style>
