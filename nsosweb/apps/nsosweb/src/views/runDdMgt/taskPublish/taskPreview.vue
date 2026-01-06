<template>
  <div class="w-full h-full">
    <div class="w-full flex items-center p-[10px] total-bg">
      <div class="title">网级</div>
      <div class="pl-4 flex-container">
        <div v-for="(item, index) in data.wjList" :key="'wj' + index" class="border rounded-lg flex-item single-bg">
          <div class="wj-head border-b">
            <span class="wj-title">
              {{ item.orgName }}
            </span>
          </div>
          <div class="wj-bottom flex">
            <div v-for="(i, index) in item.manName" :key="'wjMan' + index" :class="index > 0 ? 'border-l' : ''">
              <div class="wj-man">{{ i }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full flex items-center mt-4 p-[10px] total-bg">
      <div class="title">省级</div>
      <div class="pl-4 flex-container">
        <div v-for="(value, key, index) in data.sjMap" :key="'sj' + index" class="border rounded-lg flex-item single-bg">
          <div class="sj-head border-b">
            <span class="sj-title">
              {{ key }}
            </span>
          </div>
          <div class="sj-bottom flex">
            <div v-for="(i, index) in value" :key="'sjOrg' + index" :class="index > 0 ? 'border-l' : ''" class="h-full">
              <div class="sj-head border-b h-1/2">
                <div class="sj-org">
                  {{ i.orgName }}
                </div>
              </div>
              <div class="sj-bottom flex h-1/2">
                <div v-for="(j, index) in i.manName" :key="'sjMan' + index" :class="index > 0 ? 'border-l' : ''">
                  <div class="sj-man">{{ j }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full flex items-center mt-4 p-[10px] total-bg">
      <div class="title">专业<br/>公司</div>
      <div class="pl-4 flex-container">
        <div v-for="(value, key, index) in data.zyMap" :key="'zy' + index" class="border rounded-lg flex-item single-bg">
          <div class="sj-head border-b">
            <span class="sj-title">
              {{ key }}
            </span>
          </div>
          <div class="sj-bottom flex">
            <div v-for="(i, index) in value" :key="'zyOrg' + index" :class="index > 0 ? 'border-l' : ''" class="h-full">
              <div class="sj-head border-b h-1/2">
                <div class="sj-org">
                  {{ i.orgName }}
                </div>
              </div>
              <div class="sj-bottom flex h-1/2">
                <div v-for="(j, index) in i.manName" :key="'zyMan' + index" :class="index > 0 ? 'border-l' : ''">
                  <div class="sj-man">{{ j }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="height: 5px" />
  </div>
</template>
<script setup>
import { reactive, onMounted } from 'vue'
import { queryTemplateApi, getTaskPreview } from './taskPublishMethod.ts'

const templateId = defineModel('templateId')
onMounted(async () => {
  query()
})

const data = reactive({
  orgTableData: [],
  wjList: [],
  sjMap: [],
  zyMap: [],
})

const query = async () => {
  const { wjList, sjMap, zyMap } = await getTaskPreview({ templateId: templateId.value })
  data.wjList = wjList
  data.sjMap = sjMap
  data.zyMap = zyMap
}

</script>
<style scoped>
.title {
  font-size: 18px;
  font-weight: bold;
  white-space: nowrap;
  color: #0b388d;
}

.wj-head {
  width: 100%;
  height: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wj-title {
  font-size: 15px;
  font-weight: bold;
  color: #0b388d;
}

.wj-bottom {
  width: 100%;
  height: 50%;
  justify-content: center;
  align-items: center;
}

.wj-man {
  width: 80px;
  font-size: 14px;
  text-align: center;
  color: #0b388d;
}

.sj-head {
  width: 100%;
  height: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sj-title {
  font-size: 15px;
  font-weight: bold;
  color: #0b388d;
}

.sj-bottom {
  width: 100%;
  height: 50%;
  justify-content: center;
  align-items: center;
}

.sj-org {
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  color: #0b388d;
}

.sj-man {
  width: 80px;
  font-size: 14px;
  text-align: center;
  color: #0b388d;
}

.flex-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.flex-item {
  height: 120px;
}

.total-bg {
  background: url("/images/ydgzt/workbench-bg.png") no-repeat;
  background-size: 100% 100%;
}

.single-bg {
  background-color: #f8fafe;
}
</style>
