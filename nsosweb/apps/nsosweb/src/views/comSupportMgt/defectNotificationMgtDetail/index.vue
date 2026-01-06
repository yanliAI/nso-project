<template>
  <Page auto-content-height>
    <div class="main-dg">
      <div class="gbzjd">
        <el-anchor class="jknb" :offset="90" type="default" :container="containerRef" direction="vertical" @click="handleClick">
          <el-anchor-link href="#part1" title="缺陷信息填报"></el-anchor-link>
          <el-anchor-link href="#part2" title="现场签收处理"></el-anchor-link>
          <el-anchor-link href="#part3" title="签收与归档"></el-anchor-link>
        </el-anchor>
      </div>
      <div class="ma-tabm">
        <div class="head-c">
          <div class="head-d">
            <div class="text-center font-bold text-lg mt-2">缺陷通知管理</div>
            <div class="flex items-center h-6">
              <div>
                单号：<span class="primary font-bold">{{ data.faultData.defectCode }}</span>
              </div>
              <div class="ml-5">数据来源：<span class="grey">人工记录</span></div>
              <div class="flex-1 text-right pr-2">
                <el-button type="primary" class="ml-4" :icon="Bottom" @click="cdData" v-if="data.faultData.defectStatus === '3' && data.faultData.isSign === 'Y' && !data.disabled">归档</el-button>
                <el-button type="primary" class="ml-4" :icon="Bottom" @click="cdData" v-if="(data.faultData.defectStatus === '1' || data.faultData.defectStatus === null) && data.disabled">传递</el-button>
                <el-button type="primary" class="ml-4" :icon="Bottom" @click="cdData" v-if="data.faultData.defectStatus === '2' && data.faultData.isSign === 'Y' && !data.disabled">传递</el-button>
                <el-button type="primary" class="ml-4" :icon="Tickets" @click="saveData" v-if="(data.faultData.defectStatus === '1' || data.faultData.defectStatus === null) && data.disabled">保存</el-button>
                <el-button type="primary" class="ml-4" :icon="Tickets" @click="saveData" v-if="(data.faultData.defectStatus === '2' || data.faultData.defectStatus === '3') && !data.disabled && data.faultData.isSign === 'Y'">保存</el-button>

                <el-button type="primary" class="ml-4" :icon="Tickets" @click="signData" v-if="(data.faultData.defectStatus === '2' || data.faultData.defectStatus === '3') && !data.disabled && data.faultData.isSign === 'N'">签收</el-button>
                <el-button type="primary" class="ml-4" :icon="Tickets" @click="fallback" v-if="(data.faultData.defectStatus === '2' || data.faultData.defectStatus === '3') && !data.disabled && data.faultData.isSign === 'Y'">回退</el-button>

                <el-button type="info" plain class="ml-4" :icon="Back" @click="back">返回</el-button>
              </div>
            </div>
          </div>
        </div>
        <div ref="containerRef" class="btm-d">
          <el-collapse v-model="activeNames">
            <el-collapse-item title="缺陷信息填报" :icon="CaretRight" name="1">
              <template #title>
                <div class="flex items-center primary">
                  <Expand class="w-3.5 h-3.5"></Expand>
                  <div class="ml-1 font-bold">缺陷信息填报</div>
                </div>
              </template>
              <div id="part1" class="part-b">
                <FaultFillIn ref="faultFillIn" :formData="data.faultData" :disabled="data.disabled1"></FaultFillIn>
              </div>
            </el-collapse-item>
            <el-collapse-item title="现场签收处理" :icon="CaretRight" name="2">
              <template #title>
                <div class="flex items-center primary">
                  <Expand class="w-3.5 h-3.5"></Expand>
                  <div class="ml-1 font-bold">现场签收处理</div>
                </div>
              </template>
              <div id="part2" class="part-b">
                <FaultAssess :formData="data.faultData" :disabled="data.disabled2"></FaultAssess>
              </div>
            </el-collapse-item>
            <el-collapse-item title="签收与归档" :icon="CaretRight" name="3">
              <template #title>
                <div class="flex items-center primary">
                  <Expand class="w-3.5 h-3.5"></Expand>
                  <div class="ml-1 font-bold">签收与归档</div>
                </div>
              </template>
              <div id="part3" class="part-b">
                <FaultDispose :formData="data.faultData" :disabled="data.disabled3"></FaultDispose>
              </div>
            </el-collapse-item>
          </el-collapse>
          <div style="height: 150px"></div>
        </div>
      </div>
      <div class="gbzjd"></div>
    </div>
  </Page>
</template>
<script lang="ts" setup>
import { Page } from '@vben/common-ui'
import { ElAnchor, ElAnchorLink, ElCollapse, ElCollapseItem, ElNotification, ElMessage } from 'element-plus'
import { Tickets, Back, Bottom, CaretRight } from '@element-plus/icons-vue'
import { ref, reactive, onMounted } from 'vue'
import FaultFillIn from './faultFillIn.vue'
import FaultAssess from './faultAssess.vue'
import FaultDispose from './faultDispose.vue'
import { initFaultInfo, saveFaultInfo, fallbackData, formatDate } from './faultDetailMethod.ts'
import { useAccessStore, useUserStore } from '@vben/stores'

const userStore = useUserStore()

const faultId: any = defineModel('faultId')
const flag: any = defineModel('flag')
const name: any = defineModel('name')
const emit = defineEmits(['removeTab', 'onSearch'])
const containerRef = ref<HTMLElement | null>(null)
const activeNames = ref(['1'])

const data = reactive({
  faultData: {},
  disabled1: false,
  disabled2: false,
  disabled3: false,
  disabled: false
})
const faultFillIn = ref()
onMounted(async () => {
  init()
})

const init = async () => {
  data.faultData = await initFaultInfo({ id: faultId.value })
  data.faultData.faultOccurTime = formatDate(data.faultData.faultOccurTime)
  data.faultData.deadLine = formatDate(data.faultData.deadLine)
  
  if (flag.value === '1') {
    data.disabled = true
  }
  if (data.faultData.defectStatus === '1' || data.faultData.defectStatus === null) {
    activeNames.value = ['1']
    data.disabled1 = false
    data.disabled2 = true
    data.disabled3 = true
  } else if (data.faultData.defectStatus === '2') {
    activeNames.value = ['1', '2']
    if (data.disabled || data.faultData.isSign != 'Y') {
      data.disabled1 = true
      data.disabled2 = true
      data.disabled3 = true
    } else {
      data.disabled1 = true
      data.disabled2 = false
      data.disabled3 = true
    }
  } else if (data.faultData.defectStatus === '3') {
    activeNames.value = ['1', '2', '3']
    if (data.disabled || data.faultData.isSign != 'Y') {
      data.disabled1 = true
      data.disabled2 = true
      data.disabled3 = true
    } else {
      data.disabled1 = true
      data.disabled2 = true
      data.disabled3 = false
    }
  } else {
    activeNames.value = ['1', '2', '3']
    data.disabled1 = true
    data.disabled2 = true
    data.disabled3 = true
  }
}

const signData = async () => {
  data.faultData.isSign = 'Y'
  await saveFaultInfo(data.faultData)
  newquery()
  ElNotification({
    title: '提示',
    message: '签收成功！',
    type: 'success'
  })
  init()
}

const cdData = async () => {
  // 校验填报表单
  let count = 0
  await faultFillIn.value.validateForm(async (valid: any) => {
    if (count > 0) return
    count++
    if (valid) {
      if (data.faultData.defectStatus === '1' || data.faultData.defectStatus === null) {
        data.faultData.defectStatus = '2'
        data.faultData.isSign = 'N'
        await saveFaultInfo(data.faultData)
        newquery()
        emit('removeTab', name.value)
        ElNotification({
          title: '提示',
          message: '传递成功！',
          type: 'success'
        })
      } else if (data.faultData.defectStatus === '2') {
        data.faultData.defectStatus = '3'
        data.faultData.isSign = 'N'
        await saveFaultInfo(data.faultData)
        newquery()
        emit('removeTab', name.value)
        ElNotification({
          title: '提示',
          message: '传递成功！',
          type: 'success'
        })
      } else if (data.faultData.defectStatus === '3') {
        data.faultData.defectStatus = '4'
        await saveFaultInfo(data.faultData)
        newquery()
        emit('removeTab', name.value)
        ElNotification({
          title: '提示',
          message: '流程已结束',
          type: 'success'
        })
      }
    } else {
      ElMessage.warning('请输入必填项！')
    }
  })
}

const saveData = async () => {
  await saveFaultInfo(data.faultData)
  newquery()
  ElNotification({
    title: '提示',
    message: '保存成功！',
    type: 'success'
  })
}
const handleClick = (e: MouseEvent) => {
  e.preventDefault()
}

const back = () => {
  emit('removeTab', name.value)
}

const newquery = () => {
  emit('onSearch')
}

const fallback = async () => {
  data.faultData.isSign = 'N'
  await fallbackData(data.faultData)
  newquery()
  back()
  ElNotification({
    title: '提示',
    message: '回退成功！',
    type: 'success'
  })
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

.primary {
  color: hsl(var(--primary));
}

.grey {
  color: #8e8e93;
}

.main-dg {
  display: flex;
  width: 100%;
  height: 100%;
  background: #fff;
}

.ma-tabm {
  flex: 1;
  height: 100%;
  margin: auto;
  overflow: hidden;
  font-size: 12px;
  background: #fff;
}

.gbzjd {
  width: 20%;
}

.jknb {
  width: 200px;
  margin: auto;
  margin-top: 100px;
}

.head-d {
  width: 100%;
  height: 52px;
}

.head-c{
  width: 100%;
  height: 62px;
}

.btm-d {
  width: 100%;
  height: calc(100% - 62px);
  padding-top: 10px;
  overflow: auto;
}

.part-d {
  height: 300px;
}

.part-b {
  border-top: 1px solid #c4dbf5;
}
</style>
