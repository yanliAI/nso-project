<template>
  <div class="w-full h-full overflow-auto">
    <el-card class="mian-cd card-bg" v-for="(item,index) in data.dataList" :key="'gzjk'+index"> 
      <div class="w-full h-6 flex items-center">
        <div class="flex-1 flex items-center">
          <div class="text-sm primary cursor-pointer">{{ item.categoryCode }}</div>
          <div class="text-sm primary pl-4">{{ item.systemName }}</div>
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
        <div class="w-[15%]">系统负责部门名称：{{ item.businessDeptSystemResponsibleDeptName }}</div>
        <div class="w-[15%]">系统责任人：{{ item.businessDeptSystemResponsible }}</div>
        <div class="w-[15%]">系统负责人电话：{{ item.businessDeptSystemResponsiblePhone }}</div>
        <div class="w-[15%]">所属单位名称：{{ item.businessDeptSystemResponsiblePhone }}</div>
        <div class="w-[15%]">运维设备主人：{{ item.deviceOwner }}</div>
        <div class="w-[15%]">运维部门名称：{{ item.deviceOwnerDeptName }}</div>
      </div>
      <div class="w-full text-xs text-[#666666] pt-2 flex">
        <div class="w-[15%]">运维单位名称：{{ item.deviceOwnerUnitName }}</div>
        <div class="w-[15%]">是否为互联网应用：{{ item.isInternetApplication == 1 ? '是' : '否' }}</div>
        <div class="w-[15%]">特殊运行方式：{{ item.specialRunMode }}</div>
        <div class="w-[15%]">特殊运行方式描述：{{ item.specialRunModeDescription }}</div>
        <div class="w-[15%]">探测结果：{{ item.probeResult }}</div>
        <div class="w-[15%]">探测时间：{{ formatDate(item.probeTime)}}</div>
      </div>
    </el-card>
  </div>
</template>T
<script setup>
import { Right, DArrowRight } from '@element-plus/icons-vue';
import { onMounted, reactive, inject } from 'vue';
import { formatDate, queryTsyxfsData, getHoursDifference } from './workbenchMethod.ts'
import { useDropStore } from '#/store';
import { useVbenModal } from '@vben/common-ui';
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
  const { tsdata, wfdata } = await queryTsyxfsData();
  data.dataList = tsdata
  data.wfList = wfdata
  data.serverTime = new Date()
});
const queryData = async (params) => {
  const { tsdata, wfdata } = await queryTsyxfsData({params: params});
  data.dataList = tsdata
  data.wfList = wfdata
  updateTabTitle({'yxfs': data.dataList.length});
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
