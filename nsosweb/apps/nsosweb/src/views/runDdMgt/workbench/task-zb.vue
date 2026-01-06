<template>
  <div class="w-full h-full overflow-auto">
    <el-card class="mian-cd card-bg" v-for="(item,index) in data.dataList" :key="'zbjk'+index"> 
      <div class="w-full h-7 flex items-center">
        <div class="w-2/5 flex items-center text-[#666666]">
          <div class="w-2 h-2 bg-red-300"></div>
          <div class="text-sm pl-1" v-if="item.guaranteeLevel == '1'">I级保障</div>
          <div class="text-sm pl-1" v-if="item.guaranteeLevel == '2'">Ⅱ级保障</div>
          <div class="text-sm pl-1" v-if="item.guaranteeLevel == '3'">Ⅲ级保障</div>
          <div class="text-sm pl-4 primary cursor-pointer" @click="toDetail">{{item.guaranteeTitle}}</div>
          <div class="flex items-center">
            <el-tag type="success" class="ml-4" v-if="item.checkStatus == '1'">巡检正常</el-tag>
            <el-tag type="info" class="ml-4" v-if="item.checkStatus == '2'">巡检结束</el-tag>
            <el-tag type="danger" class="ml-4" v-if="item.checkStatus == '3'">巡检异常</el-tag>
            <el-tag type="info" class="ml-4" v-if="item.guaranteeStatus == '1'">待执行</el-tag>
            <el-tag type="danger" class="ml-4" v-if="item.guaranteeStatus == '2'">执行中</el-tag>
            <el-tag type="success" class="ml-4" v-if="item.guaranteeStatus == '3'">已完成</el-tag>
          </div>
        </div>
        <!-- <div class="items-center text-right" style="flex:1">
          <span class="text-sm font-bold">最近巡检：</span>
          <span class="text-sm ">{{formatDate(item.lastCheckTime)}}</span>
        </div> -->
      </div>
      <div class="w-full flex pt-2 items-center text-[#666666]">
        <div class="w-[25%] text-xs">
          <div>保障开始时间：{{formatDate(item.guaranteeStartTime)}}</div>
        </div>
        <div class="w-[25%] text-xs">
          <div>保障结束时间：{{formatDate(item.guaranteeEndTime)}}</div>
        </div>
        <div class="w-[10%] text-xs">
          <div>系统总数<span class="text-lg primary font-bold pl-6">{{item.systemTotalNum}}</span></div>
        </div>
        <div class="w-[10%] text-xs">
          <div>实时作业数<span class="text-lg primary font-bold pl-6">{{item.realTimeTaskNum}}</span></div>
        </div>
        <!-- <div class="w-24 text-sm text-center">
          <div class="">巡检时段</div>
          <div class="text-gray-500 text-xs" style="width: 60px;margin: auto;">{{item.inspectionPeriod}}</div>
        </div> -->
        <div class="w-[10%] text-xs">
          <div>紧急告警<span class="text-lg primary font-bold pl-6">{{item.emAlarmNum}}</span></div>
        </div>
        <div class="w-[10%] text-xs">
          <div>重大告警<span class="text-lg primary font-bold pl-6">{{item.majorAlarmNum}}</span></div>
        </div>
        <div class="w-[10%] text-xs">
          <div>故障异常<span class="text-lg primary font-bold pl-6">{{item.faultNum}}</span></div>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script setup>
import { Right } from '@element-plus/icons-vue';
import { onMounted, reactive, inject } from 'vue';
import { formatDate, queryZbData } from './workbenchMethod.ts'

const updateTabTitle = inject('updateTabTitle');
const data = reactive({
  dataList: []
})
onMounted(async () => {
  data.dataList = await queryZbData();
});
const queryData = async (params) => {
  data.dataList = await queryZbData({params: params});
  updateTabTitle({'zb': data.dataList.length});
}
const toDetail = () => {
  window.open('/guarantee/guaranteeTask', '_blank');
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

.primary{
  color: hsl(var(--primary));
}

:deep(.el-card__body) {
  height: 100%;
  padding: 10px;
}

.card-bg {
  background: linear-gradient(180deg,rgba(250,251,254,0)8%,#F2F5FD 100%);
}

:deep(.el-tag) {
  font-size: 14px;
}
</style>
