<template>
  <div class="w-full h-full overflow-auto">
    <el-card class="mian-cd card-bg" v-for="(item,index) in data.dataList" :key="'zljk'+index"> 
      <div class="w-full h-6 flex items-center">
        <div class="flex-1 flex items-center">
          <div class="text-sm text-[#f6bd17] border border-current rounded">&nbsp;&nbsp;{{ dropList.NSOS_CMD_FL.find(i => i.value === item.commandFl)?.label }}&nbsp;&nbsp;</div>
          <div class="text-sm primary cursor-pointer" @click="toTabDetail(item)">{{ item.commandCode }}</div>
          <div class="text-sm pl-2">{{ item.commandTitle }}</div>
        </div>
        <div class="text-right pr-[40%] pt-2">
          <div v-if="item.wcTime > data.serverTime && item.wcTime - data.serverTime < 2*60*60*1000" class="pt-2">
            <el-progress type="circle" width="40" stroke-width="2" :color="data.progressColors" :percentage="getHoursDifference(data.serverTime, item.wcTime) > 0 ? 
              ((1-(getHoursDifference(data.serverTime, item.wcTime)/2))*100 > 100 ? 100 : (1-(getHoursDifference(data.serverTime, item.wcTime)/2))*100) : 0">
              <el-tooltip :content="'距离到期时间还有' + getHoursDifference(data.serverTime, item.wcTime) + '小时'" placement="bottom" effect="light">
                <span style=" margin-left: -10px;font-size: xx-small; cursor: pointer">{{ getHoursDifference(data.serverTime, item.wcTime) }}</span>
              </el-tooltip>
            </el-progress>
          </div>
        </div>
        <div class="text-right pr-4 pt-10">
          <div v-if="item.commandStatus == '4' && item.wcTime < data.serverTime" class="chaoshi" style=" margin-right: 5%;margin-left: auto"></div>
        </div>
        <div :class="item.commandStatus == '3' || item.commandStatus == '4' ? '' : 'pr-4'"></div>
        <div class="text-right click-btn pr-4">
          <el-tooltip content="催办" placement="bottom" effect="light">
            <div v-if="item.commandStatus == '3' || item.commandStatus == '4'" 
              class="abgh cursor-pointer m-auto cuiban" style="width:18px;height:18px" @click="urge(item)"/>
          </el-tooltip>
        </div>
        <div class="text-right click-btn">
          <el-tooltip content="催办记录" placement="bottom" effect="light">
            <Tickets class="abgh cursor-pointer primary m-auto" style="width:18px;height:18px" @click="showUrgeRecord(item)"/>
          </el-tooltip>
        </div>
      </div>
      <div v-if="showPro == 1" class="w-full h-6 pt-3 flex items-center text-sm">
        <div>处置进度：</div>
        <div v-for="(cts, idx) in data.wfList[item.id]" :key="'wf'+idx" class="flex items-center">
          <DArrowRight v-if="idx!=0" :class="cts.isCurTache=='1'? 'arrow-done' : (cts.isCurTache=='2' ? 'arrow-doing':'arrow-todo')" class="w-4 h-4 ml-2"></DArrowRight>
          <el-tag v-if="cts.isCurTache=='1'" class="ml-2" size="large" 
            :class="(cts.label=='签收' && (data.serverTime - item.flTime) > findCsLimit(item.commandType, '3')) || 
              (cts.label=='复令' && data.serverTime > item.wcTime) ? 'pro-done cursor-pointer' : 
              (cts.label=='签收' || cts.label=='复令') ? 'pro-done cursor-pointer' : 'pro-done'"
            @click="(cts.label=='签收' || cts.label=='复令') ? queryDealTask(item.id, cts.label=='签收'?'1':'2') : ''">
            <div style="display: inline-flex; align-items: center">
              <div :style="(cts.label=='签收' || cts.label=='复令') ? 'margin-left: 10px' : ''">&nbsp;&nbsp;&nbsp;{{cts.label}}&nbsp;&nbsp;&nbsp;</div>
              <div v-if="(cts.label=='签收' || cts.label=='复令')" :class="findIsCb(item.id, cts.label) ? 'isUrge' : ''" style="width: 12px"></div>
            </div>
          </el-tag>
          <el-tag v-else-if="cts.isCurTache=='2'" class="ml-2 cursor-pointer" size="large" 
            :class="(cts.label=='签收' && (data.serverTime - item.flTime) > findCsLimit(item.commandType, '3')) || 
              (cts.label=='复令' && data.serverTime > item.wcTime) ? 'pro-doing' : 'pro-doing'"
            @click="(cts.label=='签收' || cts.label=='复令') ? queryDealTask(item.id, cts.label=='签收'?'1':'2') : cts.label=='复核' ? toTabDetail(item) : ''">
            <div style="display: inline-flex; align-items: center">
              <div :style="(cts.label=='签收' || cts.label=='复令') ? 'margin-left: 10px' : ''">&nbsp;&nbsp;&nbsp;{{cts.label}}&nbsp;&nbsp;&nbsp;</div>
              <div v-if="(cts.label=='签收' || cts.label=='复令')" :class="findIsCb(item.id, cts.label) ? 'isUrge' : ''" style="width: 12px"></div>
            </div>
          </el-tag>
          <el-tag v-else class="ml-2" size="large" 
            :class="(cts.label=='签收' && (data.serverTime - item.flTime) > findCsLimit(item.commandType, '3')) || 
              (cts.label=='复令' && data.serverTime > item.wcTime) ? 'pro-todo' : 'pro-todo'">
            <div style="display: inline-flex; align-items: center">
              <div :style="(cts.label=='签收' || cts.label=='复令') ? 'margin-left: 10px' : ''">&nbsp;&nbsp;&nbsp;{{cts.label}}&nbsp;&nbsp;&nbsp;</div>
              <div v-if="(cts.label=='签收' || cts.label=='复令')" style="width: 12px"></div>
            </div>
          </el-tag>
        </div>
      </div>
      <div class="w-full flex items-center text-xs text-[#666666] pt-4">
        <div class="w-[15%]">发令时间：{{ formatDate(item.flTime) }}</div>
        <div class="w-[15%]">发令单位：{{ item.flDeptName }}</div>
        <div class="w-[15%]">发令人：{{ item.commanderName }}</div>
        <div class="w-[38%] truncate">受令单位：
          <el-tooltip :content="item.slDept" placement="bottom" effect="light">
            {{ item.slDept }}
          </el-tooltip>
        </div>
        <div class="w-[2%]"></div>
        <div class="w-[15%]">到期时限：{{ formatDate(item.wcTime) }}</div>
      </div>
    </el-card>

    <Modal class="w-[1450px] h-[650px]" :title="data.cmdCode + ' 详情'" :footer="false" :closeOnClickModal="false" :draggable="true">
      <CmdDetail :cmdId="data.cmdId" :cmdFl="data.cmdFl" :oprateFlow="data.oprateFlow"></CmdDetail>
    </Modal>
    <ModalA class="w-[800px] h-[500px]" title="签收情况" :footer="false" :closeOnClickModal="false" :draggable="true">
      <el-table :data="data.taskHqList" border size="small" style="height: 100%;">
        <el-table-column type="index" width="40" label="#" align="center"/>
        <el-table-column prop="signDwName" label="受令单位" width="250" align="center"/>
        <el-table-column prop="signManName" label="签收人" align="center"/>
        <el-table-column label="签收时间" align="center">
          <template #default="props">
            <span v-if="props.row.isComplate == 'Y'">{{formatDateTime(props.row.opTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="isComplate" label="是否签收" align="center">
          <template #default="props">
            <span v-if="props.row.isComplate == 'Y'" class="primary">已签收</span>
            <span v-else class="text-red-600">未签收</span>
          </template>
        </el-table-column>
      </el-table>
    </ModalA>
    <ModalB class="w-[800px] h-[500px]" title="复令情况" :footer="false" :closeOnClickModal="false" :draggable="true">
      <el-table :data="data.taskFlList" border size="small" style="height: 100%;">
        <el-table-column type="index" width="40" label="#" align="center"/>
        <el-table-column prop="signDwName" label="复令单位" align="center"/>
        <el-table-column prop="signManName" label="复令人" align="center"/>
        <el-table-column label="复令时间"   align="center">
          <template #default="props">
            <span v-if="props.row.isComplate == 'Y'">{{formatDateTime(props.row.opTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="isComplate" label="是否复令" width="100" align="center">
          <template #default="props">
            <span v-if="props.row.isComplate == 'Y'" class="primary">已复令</span>
            <span v-else class="text-red-600">未复令</span>
          </template>
        </el-table-column>
      </el-table>
    </ModalB>
    <ModalC class="w-[1800px] h-[800px]" title="催办记录" :footer="false" :closeOnClickModal="false" :draggable="true">
      <NotificationDialog :recordType="data.noticeParams.recordType" :module="data.noticeParams.module" :subModule="data.noticeParams.subModule" 
        :busiCode="data.noticeParams.busiCode" :tacheCode="data.noticeParams.tacheCode" :tacheName="data.noticeParams.tacheName" :addable="false"></NotificationDialog>
    </ModalC>
    <ModalD class="w-[900px] h-[600px]" title="批量催办信息" :footer="false" :closeOnClickModal="false" :draggable="true">
      <BatchNoticeDialog :addFlag="false" :delFlag="false" :cmdData="data.cmdData" @closeDiaLog="closeDiaLog" @query="queryData" />
    </ModalD>
  </div>
</template>
<script setup>
import { Right, HelpFilled, DArrowRight, Check, Notification, Tickets } from '@element-plus/icons-vue';
import { onMounted, reactive, inject } from 'vue';
import { formatDate, queryCmdData } from './workbenchMethod.ts'
import { querySignList, cmdUrge } from '/src/views/runDdMgt/cmdMgt/cmdMgtMethod.ts'
import { formatDrop, formatDateTime, getHoursDifference } from '#/utils/commonUtil.ts';
import { useDropStore } from '#/store';
import { useVbenModal } from '@vben/common-ui';
import CmdDetail from '/src/views/runDdMgt/cmdMgt/cmdDetail.vue'
import { useRouter } from 'vue-router';
import { ElNotification, ElProgress } from 'element-plus'
import NotificationDialog from '/src/views/runDdMgt/notifyRecord/NotificationDialog2.vue'
import BatchNoticeDialog from './batchNoticeDialog.vue'

const updateTabTitle = inject('updateTabTitle');
const showPro = defineModel('showPro')
const data = reactive({
  dataList: [],
  wfList: {},
  cmdId: '',
  cmdFl: '',
  cmdCode: '',
  oprateFlow: false,
  operList: {},
  isUrge: false,
  serverTime: null,
  csRulesList: [],
  extList: [],
  noticeParams: {
    recordType: '2',
    module: '1',
    subModule: '3',
    busiCode: '',
    tacheCode: '',
    tacheName: '',
  },
  cmdData: null,
  progressColors: [
    { color: '#67c23a', percentage: 30 },
    { color: '#e6a23c', percentage: 60 },
    { color: '#f56c6c', percentage: 100 }]
})
const router = useRouter()
const dropList = reactive({});
onMounted(async () => {
  const dropStore = useDropStore();
  const dropType = ['NSOS_CMD_FL', 'NSOS_ORG_NAME_SLDW'];
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);
  const { zldata, wfdata, operdata, csRulesList, extList } = await queryCmdData();
  data.dataList = zldata
  data.wfList = wfdata
  data.operList = operdata
  data.csRulesList = csRulesList
  data.extList = extList
  formatEntity()
  data.serverTime = new Date()
});
const queryData = async (params) => {
  const { zldata, wfdata, operdata, csRulesList, extList } = await queryCmdData({params: params});
  data.dataList = zldata
  data.wfList = wfdata
  data.operList = operdata
  data.csRulesList = csRulesList
  data.extList = extList
  formatEntity()
  updateTabTitle({'zl': data.dataList.length});
}
const formatEntity = () => {
  data.dataList.forEach(r => {
    let sldw = eval(r.slDept)
    let l = ''
    if (sldw && sldw.length > 0) {
      sldw.forEach(d => {
        dropList.NSOS_ORG_NAME_SLDW.forEach(o => {
          if (d == o.value) {
            l += o.label + '；'
          }
        })
      })
    }
    r.slDept = l.slice(0, -1)
  })
}
defineExpose({
  queryData
});

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
});
const detailClick = (item) => {
  data.cmdId = item.id
  data.cmdFl = item.commandFl
  data.cmdCode = item.commandCode
  handleOprate(item)
  modalApi.open()
}

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
const queryDealTask = async (id, type) => {
  if (type == '1') {
    modalApiA.open()
  } else {
    modalApiB.open()
  }
  let params = {cmdId: id, opType: type}
  let list = await querySignList(params)
  if (type == '1') {
    data.taskHqList = list
  } else {
    data.taskFlList = list
  }
}
const handleOprate = (item) => {
  if (item.commandStatus != '0') {
    data.oprateFlow = data.operList[item.id]
  }
}
const toTabDetail = (item) => {
  handleOprate(item);
  window.open(router.resolve({
    path: '/cmdMgt/cmdRelease',
    query: { ...item, 'oprateFlow': data.oprateFlow }
  }).href, 'zlPage');
}
const urge = async (item) => {
  data.cmdData = item
  modalApiD.open()
}

const findCsLimit = (commandType, commandStatus) => {
  if (data.csRulesList) {
    let csList = data.csRulesList.filter((c) => c.commandTypeCode == commandType && c.commandState == commandStatus)
    if (csList && csList.length > 0) {
      return csList[0].timeoutLimit ? csList[0].timeoutLimit*60*60*1000 : 2*60*60*1000
    }
  }
  return 2*60*60*1000
}

const findCbLimit = (commandType, commandStatus) => {
  if (data.csRulesList) {
    let csList = data.csRulesList.filter((c) => c.commandTypeCode == commandType && c.commonState == commandStatus)
    if (csList && csList.length > 0) {
      return csList[0].urgingLimit ? csList[0].urgingLimit*60*60*1000 : 2*60*60*1000
    }
  }
  return 2*60*60*1000
}

const findIsCb = (id, type) => {
  let cbList = [];
  if (data.extList) {
    if (type === '签收') {
      cbList = data.extList.filter((e) => e.commandId == id && e.isSignUrge == 'Y')
    } else if (type === '复令') {
      cbList = data.extList.filter((e) => e.commandId == id && e.isReplyUrge == 'Y')
    }
  }
  return cbList.length > 0 ? true : false;
}

const [ModalC, modalApiC] = useVbenModal({
  onCancel() {
    modalApiC.close();
  },
});
const showUrgeRecord = (item) => {
  data.noticeParams.busiCode = item.commandCode;
  // if (item.commandStatus == '3') {
  //   data.noticeParams.tacheCode = 'QS';
  //   data.noticeParams.tacheName = '签收';
  // } else if (item.commandStatus == '4') {
  //   data.noticeParams.tacheCode = 'FL';
  //   data.noticeParams.tacheName = '复令';
  // } else {
  //   data.noticeParams.tacheCode = '';
  //   data.noticeParams.tacheName = '';
  // }
  modalApiC.open();
}

const [ModalD, modalApiD] = useVbenModal({
  onCancel() {
    modalApiD.close();
  },
});

const closeDiaLog = () => {
  modalApiD.close();
}
</script>
<style scoped>
.mian-cd {
  width: 99%;
  margin-bottom: 10px;
}

.danger{
  color: hsl(var(--destructive));
}

.primary{
  color: hsl(var(--primary));
}

:deep(.el-card__body) {
  height: 100%;
  padding: 10px;
}

.pro-done {
  color: #fefeff;
  background: url("/images/ydgzt/process_done_2.png") no-repeat;
  background-size: 100% 100%;
}

.pro-doing {
  color: #fefeff;
  background: url("/images/ydgzt/process_doing_2.png") no-repeat;
  background-size: 100% 100%;
}

.pro-todo {
  color: #fefeff;
  background: url("/images/ydgzt/process_todo_2.png") no-repeat;
  background-size: 100% 100%;
}

.pro-done-alarm {
  color: #fefeff;
  background: url("/images/ydgzt/process_done_2_alarm.png") no-repeat;
  background-size: 100% 100%;
}

.pro-doing-alarm {
  color: #fefeff;
  background: url("/images/ydgzt/process_doing_2_alarm.png") no-repeat;
  background-size: 100% 100%;
}

.pro-todo-alarm {
  color: #fefeff;
  background: url("/images/ydgzt/process_todo_2_alarm.png") no-repeat;
  background-size: 100% 100%;
}

.arrow-done {
  color: #9eb1d8;
}

.arrow-doing {
  color: #e8a480;
}

.arrow-todo {
  color: #bbbec4;
}

.chaoshi {
  width: 120px;
  height: 120px;
  background: url("/images/ydgzt/chaoshi.png") center no-repeat;
}

.isUrge {
  width: 15px;
  height: 15px;
  background: url("/images/ydgzt/dagou.png") center no-repeat;
}

.click-btn {
  z-index: 99;
}

.card-bg {
  background: linear-gradient(180deg,rgb(250 251 254 / 0%)8%,#F2F5FD 100%);
}

.cuiban {
  background: url("/images/ydgzt/cuiban.png") center no-repeat;
  background-size: 100% 100%;
}
</style>
