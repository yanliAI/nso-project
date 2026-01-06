<template>
  <Page auto-content_height>
    <div style="float: right">
      <el-button type="primary"  @click="confirm">确认</el-button>
    </div>
    <div class="main-dg">
      <div class="ma-tabm">
        <div ref="containerRef" class="btm-d">
          <div class="flex items-center primary text-base">
            <Expand class="w-5 h-5"></Expand>
            <div class="ml-1 font-bold">故障信息</div>
          </div>
          <div id="part1" class="part-b">
            <FaultFillIn ref="faultFillIn" :formData="formData"></FaultFillIn>
          </div>
        </div>
      </div>
    </div>
  </Page>
</template>
<script setup>
import { Page } from '@vben/common-ui';
import { Expand } from '@element-plus/icons-vue';
import FaultFillIn from '../faultMgt/faultLogDetail/faultFillIn.vue'
const formData = defineModel('formData')
const confirm = () => {
  
}
</script>
<style scoped>
.primary{
  color: hsl(var(--primary));
}

.main-dg{
  display: flex;
  width: 100%;
  height: 100%;
  background: #fff;
}

.ma-tabm{
  flex: 1;
  height: 100%;
  margin: auto;
  overflow: hidden;
  font-size: 12px;
  background: #fff;
}

.btm-d{
  width: 100%;
  height: calc(100% - 62px);
  padding-top: 10px;
  overflow: auto;
}

.part-b{
  border-top: 1px solid #c4dbf5;
}
</style>
