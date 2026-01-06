<script setup>
import { onMounted, ref } from 'vue'

import { useAccessStore } from '@vben/stores'

import { Bell, ChatLineRound } from '@element-plus/icons-vue'
import { useToggle } from '@vueuse/core'
import { ElEmpty, ElMessage, ElNotification, ElPopover, ElTabPane, ElTabs } from 'element-plus'

import { requestClient } from '#/api/request'
import { formatDateTime } from '#/utils/commonUtil.ts'

const emit = defineEmits()
const tabIndex = ref('list1')
const [open, toggle] = useToggle()
const unreadMesList = ref([])
const readMesList = ref([])
const subTemplateList = ref([])
const subscribeList = ref([])
const accessStore = useAccessStore()
const pageInfo = ref({
  pageSize: 20,
  pageNo: 1,
  total: 0
})

onMounted(() => {
  queryUnreadMess()
  queryReadMess()
  querySubTemplate()
  querySubscribe()

  // setInterval(() => {
  //   queryUnreadMess()
  // }, 15000)
})
const queryUnreadMess = async () => {
  if (!accessStore.accessToken) {
    return
  }
  unreadMesList.value = await requestClient.get(`${import.meta.env.VITE_NSOSGZ}/vMsNotify/queryUnreadMess`, { showmask: false })
}
const queryReadMess = async () => {
  const formData = {}
  formData.pageSize = pageInfo.value.pageSize
  formData.pageNo = pageInfo.value.pageNo
  const { list, count, pageNo } = await requestClient.post(`${import.meta.env.VITE_NSOSGZ}/notifyRead/queryReadMess`, formData, { showmask: false })
  readMesList.value = list
  pageInfo.value.pageNo = pageNo
  pageInfo.value.total = count
}
const handleSizeChange = (val) => {
  pageInfo.value.pageSize = val
  queryReadMess()
}
const currentChange = (val) => {
  pageInfo.value.pageNo = val
  queryReadMess()
}
const querySubTemplate = async () => {
  subTemplateList.value = await requestClient.get(`${import.meta.env.VITE_NSOSGZ}/notifySubModle/querySubTemplate`, { showmask: false })
}
const querySubscribe = async () => {
  subscribeList.value = await requestClient.get(`${import.meta.env.VITE_NSOSGZ}/notifySubscription/querySubscribe`, { showmask: false })
  if (subscribeList.value && subscribeList.value.length > 0) {
    subscribeList.value.forEach((s) => (s.switch = true))
  }
}
const switchClick = async (id) => {
  try {
    await requestClient.get(`${import.meta.env.VITE_NSOSGZ}/notifySubModle/subscribeToMess`, { params: { id }, showmask: true })
    ElNotification({
      title: '提示',
      message: '订阅成功！',
      type: 'success'
    })
    querySubTemplate()
    querySubscribe()
  } catch {
    ElMessage.error('订阅失败！')
  }
}
const delSubscribeClick = async (id) => {
  try {
    await requestClient.get(`${import.meta.env.VITE_NSOSGZ}/notifySubscription/delSubscribe`, { params: { id }, showmask: true })
    ElNotification({
      title: '提示',
      message: '取消订阅成功！',
      type: 'success'
    })
    querySubTemplate()
    querySubscribe()
  } catch {
    ElMessage.error('取消订阅失败！')
  }
}
const readMessClick = async (data) => {
  try {
    await requestClient.post(`${import.meta.env.VITE_NSOSGZ}/notifyRead/readMess`, data, { showmask: false })
    queryUnreadMess()
    queryReadMess()
  } catch {
    ElMessage.error('设置消息已读失败！')
  }
}
</script>
<template>
  <ElPopover :visible="open" placement="bottom" :width="500">
    <template #reference>
      <div class="flex-center mr-2 h-full" @click.stop="toggle()">
        <el-button circle class="relative" plain text>
          <span v-if="unreadMesList && unreadMesList.length > 0" class="bg-primary absolute right-0.5 top-0.5 h-2 w-2 rounded blinking-text"></span>
          <Bell class="size-4 font-bold text-[#323639]" />
        </el-button>
      </div>
    </template>
    <div class="w-full h-[600px]">
      <ElTabs ref="myTab" v-model="tabIndex" size="small" class="w-full h-full bg-white demo-tabs">
        <ElTabPane label="未读消息" name="list1" :icon="Tickets" :closable="false">
          <ElEmpty v-if="unreadMesList == null || unreadMesList.length === 0" description="暂无未读消息" />
          <div v-else class="w-full h-full">
            <div class="pb-[5px] flex">
              <ChatLineRound class="w-[14px] f-[14px] ml-[6px] mr-[4px] text-[#006be6]" />
              <span>您有{{ unreadMesList ? unreadMesList.length : 0 }}条新消息</span>
            </div>
            <div style="height: 545px" class="overflow-auto">
              <el-card v-for="(item, index) in unreadMesList" :key="`tmp${index}`" class="mb-[10px] mx-[6px]">
                <div class="xzhang cursor-pointer hover:text-[#006be6]" @click="readMessClick(item)">
                  <el-tooltip content="点击已读" placement="bottom" effect="light">
                    {{ item.msContent }}
                  </el-tooltip>
                </div>
                <div class="mt-[10px] flex">
                  <div v-if="item.msType == 1" class="flex-[0.5] text-[#a1a2a7]">消息类型：指令</div>
                  <div v-if="item.msType == 2" class="flex-[0.5] text-[#a1a2a7]">消息类型：消息通知和催办</div>
                  <div class="flex-[0.5] text-[#a1a2a7]">消息时间：{{ formatDateTime(item.msTime) }}</div>
                </div>
              </el-card>
            </div>
          </div>
        </ElTabPane>
        <ElTabPane label="已读消息" name="list2" :icon="Tickets" :closable="false">
          <ElEmpty v-if="readMesList == null || readMesList.length === 0" description="暂无已读消息" />
          <div v-else class="w-full h-full">
            <div style="height: 538px" class="overflow-auto pt-[5px]">
              <el-card v-for="(item, index) in readMesList" :key="`tmp${index}`" class="mb-[10px] mx-[6px]">
                <div class="xzhang">
                  {{ item.msInfo }}
                </div>
                <div class="mt-[10px] flex">
                  <div v-if="item.msType == 1" class="flex-[0.5] text-[#a1a2a7]">消息类型：指令</div>
                  <div v-if="item.msType == 2" class="flex-[0.5] text-[#a1a2a7]">消息类型：消息通知和催办</div>
                  <div class="flex-[0.5] text-[#a1a2a7]">已读时间：{{ formatDateTime(item.readTime) }}</div>
                </div>
              </el-card>
            </div>
            <div class="h-[25px] ml-[6px]">
              <el-pagination :current-page="pageInfo.pageNo" size="small" :page-size="pageInfo.pageSize" class="mt-1" :total="pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="currentChange" />
            </div>
          </div>
        </ElTabPane>
        <ElTabPane label="已订阅" name="list3" :icon="Tickets" :closable="false">
          <ElEmpty v-if="subscribeList == null || subscribeList.length === 0" description="暂无已订阅" />
          <div v-else class="overflow-auto">
            <div class="item-d mt-[10px]" v-for="(item, index) in subscribeList" :key="`tmp${index}`">
              <div class="flex items-center border-dashed border-[#e4e4e7] border-b-[1px]">
                <div class="w-[90px] text-[#5f6477] text-right">取消订阅：</div>
                <el-switch v-model="item.switch" @click="delSubscribeClick(item.id)" class="ml-2" size="large" />
              </div>
              <div class="flex pt-[10px]">
                <div class="w-[90px] text-[#5f6477] text-right">消息类型：</div>
                <div class="text-[#000] flex-1">{{ item.msName }}</div>
              </div>
              <div class="flex pt-[10px]">
                <div class="w-[90px] text-[#5f6477] text-right">消息描述：</div>
                <div class="text-[#000] flex-1">{{ item.msDescribe }}</div>
              </div>
            </div>
          </div>
        </ElTabPane>
        <ElTabPane label="未订阅" name="list4" :icon="Tickets" :closable="false">
          <ElEmpty v-if="subTemplateList == null || subTemplateList.length === 0" description="暂无可订阅" />
          <div v-else class="overflow-auto">
            <div class="item-d mt-[10px]" v-for="(item, index) in subTemplateList" :key="`tmp${index}`">
              <div class="flex items-center border-dashed border-[#e4e4e7] border-b-[1px]">
                <div class="w-[90px] text-[#5f6477] text-right">订阅：</div>
                <el-switch v-model="item.switch" @click="switchClick(item.id)" class="ml-2" size="large" />
              </div>
              <div class="flex pt-[10px]">
                <div class="w-[90px] text-[#5f6477] text-right">消息类型：</div>
                <div class="text-[#000] flex-1">{{ item.msName }}</div>
              </div>
              <div class="flex pt-[10px]">
                <div class="w-[90px] text-[#5f6477] text-right">消息描述：</div>
                <div class="text-[#000] flex-1">{{ item.msDescribe }}</div>
              </div>
            </div>
          </div>
        </ElTabPane>
      </ElTabs>
    </div>
  </ElPopover>
</template>

<style scoped>
@keyframes blink {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

:deep(.el-tabs) {
  --el-tabs-header-height: 30px;
}

:deep(.el-tabs__item) {
  font-size: 12px;
}

:deep(.el-tabs__header) {
  margin-bottom: 4px;
}

.item-d {
  padding: 10px;
  border: 1px solid #e4e4e7;
}

:deep(.el-card__body) {
  padding: 10px 12px;
}

.xzhang {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

:deep(.el-tabs__content) {
  _overflow: auto;
}

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

.blinking-text {
  animation: blink 1s infinite;
}
</style>
