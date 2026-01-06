<template>
  <div class="w-full h-full overflow-auto">
    <el-card v-if="data.dataList.length > 0" class="mian-cd card-bg" v-for="(item,index) in data.dataList" :key="'gjjk'+index"> 
      <div class="w-full h-6 flex items-center">
        <div class="flex-1 flex items-center">
          <div class="text-sm primary">{{ item.alertName }}</div>
          <div class="text-sm primary pl-4">最后告警时间：{{ formatDate(item.latestAlertTime) }}</div>
          <div class="text-sm primary pl-4 cursor-pointer" @click="toTabDetail(item.relateCmd)">{{ item.relateCmd?.commandCode }}</div>
        </div>
      </div>
      <div v-if="showPro == 1" class="w-full h-6 flex pt-3 items-center text-sm">
        <div>处置进度：</div>
        <div v-for="(cts, idx) in data.wfList[item.alertId]" :key="'wf'+idx" class="flex items-center">
          <DArrowRight v-if="idx!=0" :class="cts.isCurTache=='1'? 'arrow-done' : (cts.isCurTache=='2' ? 'arrow-doing':'arrow-todo')" class="w-4 h-4 ml-2"></DArrowRight>
          <el-tag :class="cts.isCurTache=='1'? 'pro-done' : (cts.isCurTache=='2' ? 'pro-doing':'pro-todo')" 
            class="ml-2" size="large">&nbsp;&nbsp;&nbsp;{{cts.label}}&nbsp;&nbsp;&nbsp;</el-tag>
        </div>
      </div>
      <div class="w-full text-xs text-[#666666] pt-4 flex">
        <div>告警描述：{{ item.alertDesc }}</div>
      </div>
      <div class="w-full text-xs text-[#666666] pt-2 flex">
        <div class="w-[16%]">首次告警时间：{{ formatDate(item.firstAlertTime) }}</div>
        <div class="w-[16%]">告警一级分类：{{ item.alertCatLevel1Name }}</div>
        <div class="w-[16%]">告警二级分类：{{ item.alertCatLevel2Name }}</div>
        <div class="w-[16%]">受害者单位：{{ item.victimCompanyName }}</div>
        <div class="w-[20%]">攻击者IP：{{ item.attackerIp }}</div>
        <div class="w-[16%]">攻击次数：{{ item.attackCount }}</div>
      </div>
    </el-card>
    <el-empty v-else :image-size="100" description="暂无数据" />
  </div>
</template>
<script setup>
import { Right, DArrowRight } from '@element-plus/icons-vue';
import { ElEmpty } from 'element-plus';
import { onMounted, reactive, inject } from 'vue';
import { formatDate, queryGjData, getHoursDifference } from './workbenchMethod.ts'
import { useRouter } from 'vue-router';

const updateTabTitle = inject('updateTabTitle');
const showPro = defineModel('showPro')
const data = reactive({
  dataList: [],
  wfList: {},
  zlList: {},
})
const router = useRouter()
onMounted(async () => {
  const { gjdata, wfdata } = await queryGjData({params: ''});
  data.dataList = gjdata
  data.wfList = wfdata
});
const queryData = async (params) => {
  const { gjdata, wfdata } = await queryGjData({params: params});
  data.dataList = gjdata
  data.wfList = wfdata
  updateTabTitle({'gj': data.dataList.length});
}

const toTabDetail = (item) => {
  window.open(router.resolve({
    path: '/cmdMgt/cmdRelease',
    query: { ...item, 'oprateFlow': false }
  }).href, 'zlPage');
}

defineExpose({
  queryData
});
</script>
<style scoped>
.mian-cd {
  width: 99%;
  padding-bottom: 10px;
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
  background: url("/images/ydgzt/process_done_2.png") no-repeat;
  background-size: 100% 100%;
  color: #fefeff;
}

.pro-doing {
  background: url("/images/ydgzt/process_doing_2.png") no-repeat;
  background-size: 100% 100%;
  color: #fefeff;
}

.pro-todo {
  background: url("/images/ydgzt/process_todo_2.png") no-repeat;
  background-size: 100% 100%;
  color: #fefeff;
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
  background: linear-gradient(180deg,rgba(250,251,254,0)8%,#F2F5FD 100%);
}
</style>
