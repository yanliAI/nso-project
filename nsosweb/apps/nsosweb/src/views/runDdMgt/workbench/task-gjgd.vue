<template>
  <div class="w-full h-full overflow-auto">
    <el-card class="mian-cd card-bg" v-for="(item,index) in data.dataList" :key="'gzjk'+index"> 
      <div class="w-full h-6 flex items-center">
        <div class="flex-1 flex items-center">
          <div class="text-sm primary cursor-pointer">{{ item.num }}</div>
          <div class="text-sm primary pl-4">{{ item.title }}</div>
          <el-tag type="success" class="ml-20">
            <!-- <span class="text-sm">{{ dropList.NSOS_FAULT_TYPE.find(i => i.value === item.faultType)?.label }}</span> -->
            {{ item.state }}
          </el-tag>
        </div>
      </div>
      <!-- <div v-if="showPro == 1" class="w-full h-6 flex pt-3 items-center text-sm">
        <div>处置进度：</div>
        <div v-for="(cts, idx) in data.wfList[item.id]" :key="'wf'+idx" class="flex items-center">
          <DArrowRight v-if="idx!=0" :class="cts.isCurTache=='1'? 'arrow-done' : (cts.isCurTache=='2' ? 'arrow-doing':'arrow-todo')" class="w-4 h-4 ml-2"></DArrowRight>
          <el-tag :class="cts.isCurTache=='1'? 'pro-done' : (cts.isCurTache=='2' ? 'pro-doing':'pro-todo')" 
            class="ml-2" size="large">&nbsp;&nbsp;&nbsp;{{cts.label}}&nbsp;&nbsp;&nbsp;</el-tag>
        </div>
      </div> -->
      <div class="w-full text-xs text-[#666666] pt-4 flex">
        <div class="w-[100%] truncate">工单描述：
          <el-tooltip :content="item.description" placement="bottom" effect="light">
            {{ item.description }}
          </el-tooltip>
        </div>
      </div>
      <div class="w-full text-xs text-[#666666] pt-2 flex">
        <div class="w-[15%]">当前节点：{{ item.place }}</div>
        <div class="w-[15%]">工单开始时间：{{ formatDate(item.startTime) }}</div>
        <div class="w-[15%]">当前审批人：{{ item.review }}</div>
        <div class="w-[15%]">联系人：{{ item.contact }}</div>
        <div class="w-[15%]">创建人：{{ item.creatorName }}</div>
      </div>
    </el-card>
  </div>
</template>
<script setup>
import { Right, DArrowRight } from '@element-plus/icons-vue';
import { onMounted, reactive, inject } from 'vue';
import { formatDate, queryGjgdData, getHoursDifference } from './workbenchMethod.ts'
import { useDropStore } from '#/store';
import { useVbenModal } from '@vben/common-ui';
import FaultDetail from '/src/views/runDdMgt/faultMgt/faultLogDetail/index.vue';
import { useRouter } from 'vue-router';

const updateTabTitle = inject('updateTabTitle');
const showPro = defineModel('showPro')
const data = reactive({
  dataList: [],
  wfList: {},
  serverTime: null,
})
const router = useRouter()
const dropList = reactive({});
onMounted(async () => {
  const dropStore = useDropStore();
  const dropType = [];
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);
  const { gdList, wfdata } = await queryGjgdData();
  data.dataList = gdList
  data.wfList = wfdata
  data.serverTime = new Date()
});
const queryData = async (params) => {
  const { gdList, wfdata } = await queryGjgdData({params: params});
  data.dataList = gdList
  data.wfList = wfdata
  updateTabTitle({'gjgd': data.dataList.length});
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
