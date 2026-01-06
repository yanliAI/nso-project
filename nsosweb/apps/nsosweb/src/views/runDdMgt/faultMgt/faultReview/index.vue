<template>
  <Page auto-content-height>
    <el-tabs ref="myTab" v-model="mydata.activeTab" type="card" @tab-remove="removeTab" class="h-full w-full bg-white">
      <el-tab-pane label="当值全部记录" name="LIST" :closable="false">
        <list-page @detail="showDetail" />
      </el-tab-pane>
      <el-tab-pane v-for="item in mydata.tabArr" :key="item.name" :label="item.title" :name="item.name" closable>
        <component :is="item.comp" :faultId="item.faultId" />
      </el-tab-pane>
    </el-tabs>
  </Page>
</template>
<script setup>
import { Page } from '@vben/common-ui'
import { ElTabs, ElTabPane } from 'element-plus'
import { reactive, onMounted } from 'vue'
import listPage from './listPage.vue'
import detailPage from './detailPage.vue'

const mydata = reactive({
  activeTab: 'LIST',
  tabArr: []
})
onMounted(async () => {})

/**
 * 打开详情
 */
const showDetail = (row) => {
  let tabArr = mydata.tabArr
  let tab
  if (row) {
    tabArr.some((item) => {
      if (item.faultId == row.id) {
        tab = item
        return true
      }
    })
  }

  if (!tab) {
    tab = {}
    tab.name = new Date().getTime() + ''
    if (row) {
      // 已保存工单tab信息
      tab.title = row.faultCode ? row.faultCode : '未编号'
      tab.faultId = row.id
    } else {
      // 新增工单tab信息
      tab.title = '新增'
      tab.faultId = null
    }
    tab.comp = detailPage
    tabArr.push(tab)
  }
  mydata.activeTab = tab.name
  mydata.tabArr = tabArr
}

/**
 * 关闭详情
 */
const removeTab = (targetName) => {
  let tabArr = mydata.tabArr
  let tab

  let tabIndex = mydata.activeTab
  if (tabIndex === targetName) {
    tabIndex = 'LIST'
    let nextTab
    tabArr.forEach(function (tab, index) {
      if (tab.name === targetName) {
        nextTab = tabArr[index + 1] || tabArr[index - 1]
        if (nextTab) {
          tabIndex = nextTab.name
        }
      }
    })
  }
  mydata.activeTab = tabIndex
  for (var i = 0; i < tabArr.length; i++) {
    if (tabArr[i].name == targetName) {
      tabArr.splice(i, 1)
      break
    }
  }
}
</script>
<style scoped>
:deep(.el-tab-pane) {
  width: 100%;
  height: 100%;
}
</style>
