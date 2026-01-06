<template>
  <div class="w-full h-full overflow-auto">
    <el-card class="mian-cd card-bg" v-for="(item,index) in data.dataList" :key="'zyjk'+index"> 
      <div class="w-full h-6 flex items-center">
        <div class="text-sm primary">{{ item.oid }}</div>
        <div class="text-sm primary pl-4">{{ item.title }}</div>
        <div class="pl-4">
          <el-tag :type="item.riskLevel === '4' ? 'danger' : (item.riskLevel === '3') ? 'warning' : 'info'">
            <span class="text-sm">{{ (dropList.NSOS_WORK_RISK_LEVEL.find(i => i.value === item.riskLevel)?.label) ? dropList.NSOS_WORK_RISK_LEVEL.find(i => i.value === item.riskLevel)?.label : item.riskLevel }}</span>
          </el-tag>
        </div>
        <div class="pl-4" v-if="data.zbList?.includes(item.oid)">
          <el-tag type="danger">
            <span class="text-sm">保</span>
          </el-tag>
        </div>
        <div class="pl-4" v-if="item.planType === '4'">
          <el-tag type="danger">
            <span class="text-sm">临</span>
          </el-tag>
        </div>
        <div class="pl-4" v-if="item.operationType === '3'">
          <el-tag type="danger">
            <span class="text-sm">紧</span>
          </el-tag>
        </div>
      </div>
      <div class="w-full flex text-xs text-[#666666] pt-2">
        <div class="w-[10%]">作业类型：{{ item.workTypeName }}</div>
        <div class="w-[15%]">作业开始时间：{{ formatDateTime(item.startTime) }}</div>
        <div class="w-[15%]">作业结束时间：{{ formatDateTime(item.endTime) }}</div>
        <div class="w-[10%]">作业环境：{{ (dropList.NSOS_WORK_TICKET_ENV.find(i => i.value === item.networkenv)?.label) ? dropList.NSOS_WORK_TICKET_ENV.find(i => i.value === item.networkenv)?.label : item.networkenv }}</div>
        <div class="w-[10%]">作业负责人：{{ item.workLeader }}</div>
        <div class="w-[18%] truncate">工作班成员：
          <el-tooltip :content="item.workMember" placement="bottom" effect="light">
            {{ item.workMember }}
          </el-tooltip>
        </div>
        <div class="w-[2%]"></div>
        <div class="w-[10%]">作业风险等级：{{ (dropList.NSOS_WORK_RISK_LEVEL.find(i => i.value === item.riskLevel)?.label) ? dropList.NSOS_WORK_RISK_LEVEL.find(i => i.value === item.riskLevel)?.label : item.riskLevel }}</div>
        <div class="w-[10%]">风险值：{{ item.riskLevelSum }}</div>
      </div>
      <div class="w-full flex text-xs text-[#666666] pt-2">
        <div class="w-[48%] truncate">作业内容：
          <el-tooltip :content="item.operationContent" placement="bottom" effect="light">
            {{ item.operationContent }}
          </el-tooltip>
        </div>
        <div class="w-[2%]"></div>
        <div class="w-[48%] truncate">作业单位：
          <el-tooltip :content="item.unitName" placement="bottom" effect="light">
            {{ item.unitName }}
          </el-tooltip>
        </div>
        <div class="w-[2%]"></div>
      </div>
    </el-card>
  </div>
</template>
<script setup>
import { Right, HelpFilled, DArrowRight, Check } from '@element-plus/icons-vue';
import { onMounted, reactive, inject } from 'vue';
import { queryZyData } from './workbenchMethod.ts'
import { formatDrop, formatDateTime, getHoursDifference } from '#/utils/commonUtil.ts';
import { useDropStore } from '#/store';

const updateTabTitle = inject('updateTabTitle');
const data = reactive({
  dataList: [],
  zbList: []
})
const dropList = reactive({});
onMounted(async () => {
  const dropStore = useDropStore();
  const dropType = ['NSOS_WORK_TICKET_ENV', 'NSOS_WORK_RISK_LEVEL'];
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);
  const { zydata, zbList } = await queryZyData({params: ''});
  data.dataList = zydata
  data.zbList = zbList
});
const queryData = async (params) => {
  const { zydata } = await queryZyData({params: params});
  data.dataList = zydata
  updateTabTitle({'zy': data.dataList.length});
}

defineExpose({
  queryData
});
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

.gjjcys{
  width: 18px;
  height: 18px;
  line-height: 17px;
  color:#fff;
  text-align: center;
  border-radius: 2px;
}

:deep(.el-card__body) {
  height: 100%;
  padding: 10px;
}

/* :deep(.el-card) {
  border-color: #9adcf9;
} */

.title {
  position: absolute;
  top: 0px;
  color: blue;
  font-weight: bold;
  background-color: #fff
}

.card-bg {
  background: linear-gradient(180deg,rgba(250,251,254,0)8%,#F2F5FD 100%);
}
</style>
