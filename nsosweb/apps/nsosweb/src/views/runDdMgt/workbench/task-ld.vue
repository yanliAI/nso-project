<template>
  <div class="w-full h-full overflow-auto">
    <el-card class="mian-cd card-bg" v-for="(item, index) in data.dataList" :key="'ldjk' + index">
      <div class="w-full h-6 flex items-center">
        <div class="flex-1 flex items-center">
          <!-- <div class="text-sm primary font-bold">{{ item.id }}</div> -->
          <div class="text-sm primary font-bold">{{ item.vulnerabilityName }}</div>
          <el-tag type="primary" class="ml-4" size="small">{{ item.vulnerabilityType }}</el-tag>
          <el-tag type="danger" class="ml-4" size="small">{{ item.riskLevel }}</el-tag>
        </div>
        <!-- <div class="text-right pr-3 text-sm" style="width: 150px;">
          当前处理人：{{ data.wfList[item.instanceid].find(i => i.isCurTache == '2')?.curHandler }}
        </div> -->
      </div>
      <div v-if="showPro == 1" class="w-full h-6 flex pt-3 flex items-center text-sm">
        <!-- <HelpFilled class="w-4 h-4"></HelpFilled> -->
        <div>处置进度：</div>
        <div v-for="(cts, idx) in data.wfList[item.id]" :key="'wf' + idx" class="flex items-center">
          <DArrowRight v-if="idx != 0" :class="cts.isCurTache == '1' ? 'arrow-done' : cts.isCurTache == '2' ? 'arrow-doing' : 'arrow-todo'" class="w-4 h-4 ml-2"></DArrowRight>
          <el-tag :class="cts.isCurTache == '1' ? 'pro-done' : cts.isCurTache == '2' ? 'pro-doing' : 'pro-todo'" class="ml-2" size="large">&nbsp;&nbsp;&nbsp;{{ cts.label }}&nbsp;&nbsp;&nbsp;</el-tag>
        </div>
      </div>
      <div class="w-full text-xs text-gray-400 pt-2 flex flex-col">
        <div>
          <div class="float-left pt-2 pr-10">发现时间：{{ formatDate(item.discoveryDate) }}</div>
          <div class="float-left pt-2 pr-10">IPv4：{{ item.ipv4 }}</div>
          <div class="float-left pt-2 pr-10">IPv6：{{ item.ipv6 }}</div>
        </div>
        <div>
          <div class="float-left pt-2 pr-10">漏洞信息：{{ item.description }}</div>
        </div>
        <!-- <div class="float-left w-3/5 pt-2 pr-10">{{ item.infoType == 1 ? '威胁内容' : '漏洞信息' }}：{{ item.infoDescribe }}</div>
        <div class="flex-1 text-right">
          <span class="float-left pr-20">发现人：{{ item.discoverMan }}</span>
          <span class="float-left pr-3">{{ item.infoType == 1 ? '威胁范围' : '影响范围' }}：{{ item.range }}</span>
        </div> -->
      </div>
    </el-card>
  </div>
</template>
<script setup>
import { Right, HelpFilled, DArrowRight, Check } from '@element-plus/icons-vue'
import { onMounted, reactive } from 'vue'
import { inject } from 'vue'
import { formatDate, queryLdData } from './workbenchMethod.ts'
import { useDropStore } from '#/store'

const updateTabTitle = inject('updateTabTitle')
const showPro = defineModel('showPro')
const data= reactive({
  dataList: [],
  wfList: {}
})
const dropList = reactive({})
onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = ['NSOS_LOOPHOLE_LEVEL']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)
  const { lddata, wfdata } = await queryLdData({ params: '' })
  data.dataList = lddata
  data.wfList = wfdata
})
const queryData = async (params) => {
  const { lddata, wfdata } = await queryLdData({ params: params })
  data.dataList = lddata
  data.wfList = wfdata
  updateTabTitle({'ld': data.dataList.length})
}

defineExpose({
  queryData
})
</script>

<style scoped>
.mian-cd {
  width: 99%;
  margin-bottom: 10px;
}

.danger {
  color: hsl(var(--destructive));
}

.primary {
  color: hsl(var(--primary));
}

.pro-done {
  color: #fefeff;
  background: url('/images/ydgzt/process_done_2.png') no-repeat;
  background-size: 100% 100%;
}

.pro-doing {
  color: #fefeff;
  background: url('/images/ydgzt/process_doing_2.png') no-repeat;
  background-size: 100% 100%;
}

.pro-todo {
  color: #fefeff;
  background: url('/images/ydgzt/process_todo_2.png') no-repeat;
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

:deep(.el-card__body) {
  height: 100%;
  padding: 10px;
}
</style>
