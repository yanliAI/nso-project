<template>
  <div class="w-full h-full overflow-auto">
    <el-card class="mian-cd card-bg" v-for="(item,index) in data.dataList" :key="'gzjk'+index"> 
      <div class="w-full h-6 flex items-center">
        <div class="flex-1 flex items-center">
          <div class="text-sm primary cursor-pointer" @click="toTabDetail(item)">{{ item.faultCode }}</div>
          <div class="text-sm primary pl-4">{{ item.faultInfo }}</div>
          <el-tag type="danger" class="ml-20">
            <span class="text-sm">{{ dropList.NSOS_FAULT_TYPE.find(i => i.value === item.faultType)?.label }}</span>
          </el-tag>
        </div>
        <div class="text-right pr-[40%] pt-2">
          <div v-if="(item.faultOccurTime + 2*60*60*1000) > data.serverTime && (item.faultOccurTime + 2*60*60*1000) - data.serverTime < 2*60*60*1000" class="pt-2">
            <el-progress type="circle" width="40" stroke-width="2" :color="data.progressColors" :percentage="getHoursDifference(data.serverTime, (item.faultOccurTime + 2*60*60*1000)) > 0 ? 
              ((1-(getHoursDifference(data.serverTime, (item.faultOccurTime + 2*60*60*1000))/2))*100 > 100 ? 100 : (1-(getHoursDifference(data.serverTime, (item.faultOccurTime + 2*60*60*1000))/2))*100) : 0">
              <el-tooltip :content="'距离到期时间还有' + getHoursDifference(data.serverTime, (item.faultOccurTime + 2*60*60*1000)) + '小时'" placement="bottom" effect="light">
                <span style=" margin-left: -10px;font-size: xx-small; cursor: pointer">{{ getHoursDifference(data.serverTime, (item.faultOccurTime + 2*60*60*1000)) }}</span>
              </el-tooltip>
            </el-progress>
          </div>
        </div>
      </div>
      <div v-if="showPro == 1" class="w-full h-6 flex pt-3 items-center text-sm">
        <div>处置进度：</div>
        <div v-for="(cts, idx) in data.wfList[item.id]" :key="'wf'+idx" class="flex items-center">
          <DArrowRight v-if="idx!=0" :class="cts.isCurTache=='1'? 'arrow-done' : (cts.isCurTache=='2' ? 'arrow-doing':'arrow-todo')" class="w-4 h-4 ml-2"></DArrowRight>
          <el-tag :class="cts.isCurTache=='1'? 'pro-done' : (cts.isCurTache=='2' ? 'pro-doing':'pro-todo')" 
            class="ml-2" size="large">&nbsp;&nbsp;&nbsp;{{cts.label}}&nbsp;&nbsp;&nbsp;</el-tag>
        </div>
      </div>
      <div class="w-full text-xs text-[#666666] pt-4 flex">
        <div class="w-[15%]">系统：<span @click="showSvg()" class="cursor-pointer">{{ dropList.NSOS_SYSTEM_INFO.find(i => i.value === item.faultSys)?.label }}</span></div>
        <div class="w-[15%]">系统等级：{{ item.sysLevel }}</div>
        <div class="w-[18%]">故障发生时间：{{ formatDate(item.faultOccurTime) }}</div>
        <div class="w-[15%]">报障来源：{{ dropList.NSOS_PROBLEM_SOURCE.find(i => i.value === item.problemSource)?.label }}</div>
        <div class="w-[20%] truncate">影响范围：
          <el-tooltip :content="item.effectRange" placement="bottom" effect="light">
            {{ item.effectRange }}
          </el-tooltip>
        </div>
        <div class="w-[2%]"></div>
        <div class="w-[15%]">持续时间：<span class="px-3 py-0.5 text-xm text-orange-400 border border-current rounded">{{getHoursDifference(item.faultOccurTime, data.serverTime)}}</span></div>
      </div>
      <div class="w-full text-xs text-[#666666] pt-2 flex">
        <div class="w-[30%]">运维单位：{{ item.operateOrg }}</div>
        <div class="w-[18%]">系统设备主人：{{ item.deviceOwnerName }}</div>
        <div class="w-[15%]">用户报障统计：{{ item.userFaultNum == null ? '-' : item.userFaultNum + '单' }}</div>
      </div>
    </el-card>

    <Modal class="w-[1450px] h-[650px]" title="故障详情" :footer="false" :closeOnClickModal="false" :draggable="true">
      <FaultDetail :faultId="data.faultId"></FaultDetail>
    </Modal>
    <ModalB class="w-[1450px] h-[650px]" title="系统drawio图" :footer="false" :closeOnClickModal="false" :draggable="true">
      <div ref="svgRef" class="svgcss" v-html="data.svgdata"></div>
    </ModalB>
  </div>
</template>
<script setup>
import { Right, DArrowRight } from '@element-plus/icons-vue';
import { onMounted, reactive, inject, ref } from 'vue';
import { formatDate, queryGzData, downLoadSvg } from './workbenchMethod.ts'
import { getHoursDifference } from '#/utils/commonUtil.ts';
import { useDropStore } from '#/store';
import { useVbenModal } from '@vben/common-ui';
import FaultDetail from '/src/views/runDdMgt/faultMgt/faultLogDetail/index.vue';
import { useRouter } from 'vue-router';

const updateTabTitle = inject('updateTabTitle');
const showPro = defineModel('showPro')
const data = reactive({
  dataList: [],
  wfList: {},
  zlList: {},
  faultId: '',
  serverTime: null,
  svgdata: null,
  progressColors: [
    { color: '#67c23a', percentage: 30 },
    { color: '#e6a23c', percentage: 60 },
    { color: '#f56c6c', percentage: 100 }]
})
const router = useRouter()
const dropList = reactive({});
const svgRef = ref()
onMounted(async () => {
  const dropStore = useDropStore();
  const dropType = ['NSOS_FAULT_TYPE', 'NSOS_SYSTEM_INFO', 'NSOS_PROBLEM_SOURCE'];
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);
  const { gzdata, wfdata, zldata } = await queryGzData();
  data.dataList = gzdata
  data.wfList = wfdata
  data.zlList = zldata
  data.serverTime = new Date()
});
const queryData = async (params) => {
  const { gzdata, wfdata, zldata } = await queryGzData({params: params});
  data.dataList = gzdata
  data.wfList = wfdata
  data.zlList = zldata
  updateTabTitle({'gz': data.dataList.length});
}
defineExpose({
  queryData
});

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
});
const [ModalB, modalApiB] = useVbenModal({
  onCancel() {
    modalApiB.close();
  },
});
const detailClick = (id) => {
  data.faultId = id
  modalApi.open()
}

const toTabDetail = (item) => {
  window.open(router.resolve({
    path: '/faultManage/faultHandle',
    query: { ...item }
  }).href, 'gzPage');
}

const showSvg = async () => {
  data.svgdata = await downLoadSvg()
  modalApiB.open()
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

.gjjcys{
  width: 18px;
  height: 18px;
  line-height: 17px;
  color:#fff;
  text-align: center;
  border-radius: 2px;
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

.arrow-done {
  color: #9eb1d8;
}

.arrow-doing {
  color: #e8a480;
}

.arrow-todo {
  color: #bbbec4;
}

.card-bg {
  background: linear-gradient(180deg,rgb(250 251 254 / 0%)8%,#F2F5FD 100%);
}
</style>
