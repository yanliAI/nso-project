<template>
  <Page auto-content-height>
    <el-tabs type="card" class="w-full h-full bg-white"  @tab-click="query" v-model="editableTabsValue" @tab-remove="removeTab">
      <el-tab-pane label="文件列表" name="fileList">
        <FileList @addTab="addTab" @setPreview="setPreview" ref="filelistRef" />
      </el-tab-pane>
      <el-tab-pane label="我的收藏" name="myCollect">
        <MyCollect @addTab="addTab" @setPreview="setPreview" ref="collectRef" />
      </el-tab-pane>
      <!-- <el-tab-pane label="全局搜索" name="globalSearch">
        <GlobalSearch />
      </el-tab-pane> -->
      <!-- <el-tab-pane label="文件预览" name="filePreview">
        <FilePreview />
      </el-tab-pane> -->
      <!-- <el-tab-pane v-for="item in editableTabs" :key="item.name" :label="item.title" :name="item.name">
        <FilePreview :url="data.curPreviewUrl" :fileType="data.curFileType"></FilePreview>
      </el-tab-pane> -->
    </el-tabs>
  </Page>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { ElTabs, ElTabPane, ElButton } from 'element-plus';
import { Page } from '@vben/common-ui';
import FileList from './fileList.vue';
import MyCollect from './myCollect.vue';
import GlobalSearch from './globalSearch.vue';
import FilePreview from './filePreview.vue';
import type { TabPaneName } from 'element-plus'


let tabIndex = 0
const editableTabsValue = ref('fileList')
const editableTabs = ref([])

const data = reactive({
  curPreviewUrl: '',
  curFileType: null,
})

const filelistRef = ref()
const collectRef = ref()

function query(tab) {
  if (tab.paneName === 'fileList') {
    if (filelistRef.value) {
      filelistRef.value.query()
    }
  } else if (tab.paneName === 'myCollect') {
    if (collectRef.value) {
      collectRef.value.query()
    }
  }
}

const setPreview = (id,curFileType) => {
  data.curPreviewUrl =
    import.meta.env.VITE_NSOSZH + '/knowAttachment/preview?objectId=' + id;
  data.curFileType = curFileType;
}

const addTab = (targetName: string) => {
  const newTabName = `${++tabIndex}`
  editableTabs.value.push({
    title: '文件预览',
    name: newTabName,
  })
  editableTabsValue.value = newTabName
}
const removeTab = (targetName: TabPaneName) => {
  const tabs = editableTabs.value
  let activeName = editableTabsValue.value
  if (activeName === targetName) {
    tabs.forEach((tab, index) => {
      if (tab.name === targetName) {
        const nextTab = tabs[index + 1] || tabs[index - 1]
        if (nextTab) {
          activeName = nextTab.name
        }
      }
    })
  }

  editableTabsValue.value = activeName
  editableTabs.value = tabs.filter((tab) => tab.name !== targetName)

  editableTabsValue.value = 'fileList';
}

</script>

<style scoped>
:deep(.el-tab-pane) {
  width: 100%;
  height: 100%;
}
</style>

<!-- <template>
  <div style="margin-bottom: 20px">
    <el-button size="small" @click="addTab(editableTabsValue)">
      add tab
    </el-button>
  </div>
  <el-tabs v-model="editableTabsValue" type="card" class="demo-tabs" closable @tab-remove="removeTab">
    <el-tab-pane v-for="item in editableTabs" :key="item.name" :label="item.title" :name="item.name">
      {{ item.content }}
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import type { TabPaneName } from 'element-plus'


let tabIndex = 2
const editableTabsValue = ref('2')
const editableTabs = ref([
  {
    title: 'Tab 1',
    name: '1',
    content: 'Tab 1 content',
  },
  {
    title: 'Tab 2',
    name: '2',
    content: 'Tab 2 content',
  },
])

const addTab = (targetName: string) => {
  const newTabName = `${++tabIndex}`
  editableTabs.value.push({
    title: 'New Tab',
    name: newTabName,
    content: 'New Tab content',
  })
  editableTabsValue.value = newTabName
}
const removeTab = (targetName: TabPaneName) => {
  const tabs = editableTabs.value
  let activeName = editableTabsValue.value
  if (activeName === targetName) {
    tabs.forEach((tab, index) => {
      if (tab.name === targetName) {
        const nextTab = tabs[index + 1] || tabs[index - 1]
        if (nextTab) {
          activeName = nextTab.name
        }
      }
    })
  }

  editableTabsValue.value = activeName
  editableTabs.value = tabs.filter((tab) => tab.name !== targetName)
}
</script>

<style>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>

 -->
