<template>
  <Page auto-content-height>
    <div class="main-dg">
      <div class="gbzjd">
        <el-anchor class="jknb" :offset="90" type="default" :container="containerRef" direction="vertical" @click="handleClick">
          <el-anchor-link href="#part1" title="威胁信息"></el-anchor-link>
          <el-anchor-link href="#part2" title="威胁审核"></el-anchor-link>
          <el-anchor-link href="#part3" title="威胁处理"></el-anchor-link>
          <el-anchor-link href="#part4" title="确认归档"></el-anchor-link>
        </el-anchor>
      </div>
      <div class="ma-tabm">
        <div class="head-d">
          <div class="text-center font-bold text-lg mt-2">终端威胁管理</div>
          <div class="flex items-center h-6">
            <div>编号：<span class="primary font-bold">{{ data.loopholeData.infoCode }}</span></div>
            <div class="flex items-center primary" style="padding-left: 30%">
              <DataAnalysis class="w-3.5 h-3.5"></DataAnalysis>
              <span>威胁填报</span>
            </div>
            <div class="flex-1 text-right pr-2">
              <el-button type="primary" class="ml-4" :icon="Finished" size="small">提交</el-button>
              <el-button type="primary" class="ml-4" :icon="Tickets" @click="saveData" size="small">保存</el-button>
              <el-button type="info" class="ml-4" :icon="Back" size="small">返回</el-button>
            </div>
          </div>
        </div>
        <div ref="containerRef" class="btm-d">
          <el-collapse v-model="activeNames" >
            <el-collapse-item title="威胁信息" :icon="CaretRight" name="1">
              <template #title>
                <div class="flex items-center primary">
                  <Expand class="w-3.5 h-3.5"></Expand>
                  <div class="ml-1 font-bold">威胁信息</div>
                </div>
              </template>
              <div id="part1" class="part-b">
                <ThreatInfo ref="loopholeInfo" :formData="data.loopholeData"></ThreatInfo>
              </div>
            </el-collapse-item>
            <el-collapse-item title="威胁审核" :icon="CaretRight" name="2">
              <template #title>
                <div class="flex items-center primary">
                  <Expand class="w-3.5 h-3.5"></Expand>
                  <div class="ml-1 font-bold">威胁审核</div>
                </div>
              </template>
              <div id="part2" class="part-b">
                <ThreatVerify :formData="data.loopholeData"></ThreatVerify>
              </div>
            </el-collapse-item>
            <el-collapse-item title="威胁处理" :icon="CaretRight" name="3">
              <template #title>
                <div class="flex items-center primary">
                  <Expand class="w-3.5 h-3.5"></Expand>
                  <div class="ml-1 font-bold">威胁处理</div>
                </div>
              </template>
              <div id="part3" class="part-b">
                <ThreatHandle :formData="data.loopholeData"></ThreatHandle>
              </div>
            </el-collapse-item>
            <el-collapse-item title="确认归档" :icon="CaretRight" name="4">
              <template #title>
                <div class="flex items-center primary">
                  <Expand class="w-3.5 h-3.5"></Expand>
                  <div class="ml-1 font-bold">确认归档</div>
                </div>
              </template>
              <div id="part5" class="part-b">
                <ConfirmAchive :formData="data.loopholeData"></ConfirmAchive>
              </div>
            </el-collapse-item>
          </el-collapse>
          <div style="height: 150px;"></div>
        </div>
      </div>
      <div class="gbzjd"></div>
    </div>
  </Page>
</template>
<script lang="ts" setup>
import { Page } from '@vben/common-ui';
import { ElAnchor, ElAnchorLink, ElCollapse, ElCollapseItem, ElNotification, ElMessage } from 'element-plus';
import { Tickets, Finished, Expand, CaretRight, Back, DataAnalysis } from '@element-plus/icons-vue';
import { ref, reactive, onMounted } from 'vue'
import { requestClient } from '#/api/request';
import ThreatInfo from './threatInfo.vue'
import ThreatVerify from './threatVerify.vue'
import ThreatHandle from './threatHandle.vue'
import ConfirmAchive from './confirmAchive.vue'

const id = defineModel('id')
const containerRef = ref<HTMLElement | null>(null)
const activeNames = ref(['1','2','3','4'])

const data: any = reactive({
  loopholeData: {}
})

onMounted(async () => {
  data.loopholeData = await initLoophole({id: id.value, type: '1'})
  data.loopholeData.discoverTime = formatDate(data.loopholeData.discoverTime)
});

async function initLoophole(params: any) {
  return requestClient.get(import.meta.env.VITE_NSOSGZ + '/loopholeDetail/initLoophole', { params });
}

const loopholeInfo = ref();

const saveData = async () => {
  // 校验填报表单
  let count = 0;
  await loopholeInfo.value.validateForm(async (valid: any) => {
    if (count > 0) return;
    count++
    if (valid) {
      await saveLoophole(data.loopholeData);
      ElNotification({
        title: '提示',
        message: '保存成功！',
        type: 'success',
      })
    } else {
      ElMessage.warning('请输入必填项！');
    }
  })
}

async function saveLoophole(loopholeData: any) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/loopholeDetail/saveLoophole', loopholeData);
}

function formatDate(longtime: any) {
  if (!longtime) return ''
  const date = new Date(longtime)
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const handleClick = (e: MouseEvent) => {
  e.preventDefault()
}
</script>
<style scoped>
/* 滚动条样式 **/
div::-webkit-scrollbar {
  width: 6px;
}

div::-webkit-scrollbar-track {
  border-radius: 4px;
}

div::-webkit-scrollbar-thumb {
  border-radius: 10px;
}

.primary{
  color: hsl(var(--primary));
}

.grey{
  color: #8E8E93;
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

.gbzjd{
  width: 20%;
  
}

.jknb{
  width: 200px;
  margin: auto;
  margin-top: 100px;
}

.head-d{
  width: 100%;
  height: 52px;
}

.btm-d{
  width: 100%;
  height: calc(100% - 62px);
  padding-top: 10px;
  overflow: auto;
}

.part-d{
  height: 300px;
}

.part-b{
  border-top: 1px solid #c4dbf5;
}
</style>
