<template>
  <div class="w-full h-full overflow-auto">
    <el-card class="mian-cd"> 
      <div class="w-full h-6 flex items-center">
        <div class="flex-1 flex items-center">
          <div class="text-sm primary font-bold pl-1">GZ24012302</div>
          <div class="text-xs font-bold pl-2">关于开展全网信息系统运行方式数据收集的通知</div>
        </div>
        <div class="text-right pr-3 text-sm" style="width: 150px;">
          当前处理人：张XX
        </div>
      </div>
      <div class="w-full h-6 flex pt-3 flex items-center text-sm">
        <HelpFilled class="w-4 h-4"></HelpFilled>
        <div class="pl-2">处置进度：</div>
        <el-button type="success" class="ml-2" :icon="Check" size="small">下发</el-button>
        <DArrowRight class="w-4 h-4 ml-2 danger"></DArrowRight>
        <el-button type="danger" class="ml-2" :icon="Check" size="small">签收</el-button>
        <DArrowRight class="w-4 h-4 ml-2"></DArrowRight>
        <el-button type="info" class="ml-2" :icon="Check" size="small">复令</el-button>
        <DArrowRight class="w-4 h-4 ml-2"></DArrowRight>
        <el-button type="info" class="ml-2" :icon="Check" size="small">终结</el-button>
      </div>
      <div class="w-full 	flex items-center text-xs text-gray-400 pt-4">
        <div class="pr-14 pl-1">发令人：李四</div>
        <div class="pr-14">发令时间 : 2024-9-25 10:00:00</div>
        <div class="pr-14">受令单位：数字集团</div>
        <div class="pr-14">受令人：</div>
        <div class="pr-14">受令时间:</div>
        <div class="pr-14">闭环时间: 2024-9-26 19:00:00</div>
        <div class="pr-14">是否超时反馈 : 是</div>
        <div class="pr-14">超时单位: XX单位</div>
        <div class="pr-14">超时时长: 0.28小时</div>
      </div>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { Right, HelpFilled, DArrowRight, Check } from '@element-plus/icons-vue';
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
</style>
