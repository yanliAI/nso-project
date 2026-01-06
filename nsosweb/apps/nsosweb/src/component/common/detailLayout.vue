/** @description 详情页面布局组件 @author wangjun 参数说明： title: 详情页面顶部标题，字符串类型，如"xxx详情" anchors: 锚点分组，字符串数组，如['A', 'B', 'C'] 插槽说明： 顶部标题下面的操作栏插槽名: head 每一个模块标题栏插槽名: 从模块1至模块N，插槽名称为modhead1/modhead2.... 每一个模块内容区域插槽名: 从模块1至模块N，插槽名称为modarea1/modarea2.... */
<template>
  <div class="custom-detail-comp">
    <div class="custom-detail-headbar">
      <div class="custom-detail-title">{{ layout.title }}</div>
      <div class="custom-detail-headbar-slot">
        <slot name="head"></slot>
      </div>
    </div>
    <div class="custom-detail-layout">
      <div class="custom-detail-side-area">
        <el-anchor type="default" :container="contentLayout" direction="vertical" @click="handleClick">
          <el-anchor-link v-for="(item, index) in layout.anchors" :href="'#' + item.id" @click="scrollTo(item.id)" :title="item.title" />
        </el-anchor>
      </div>
      <div class="custom-detail-content-area" ref="contentLayout">
        <el-collapse v-model="layout.activeNames">
          <el-collapse-item v-for="(item, index) in layout.anchors" :title="item.title" :name="item.name">
            <template #title>
              <div class="flex items-center">
                <div class="custom-detail-modicon"></div>
                <div class="custom-detail-content-title">{{ item.title }}</div>
              </div>
              <div class="mr-[10px] mt-[1px] flex-1 text-right">
                <slot :name="'modhead' + item.name"></slot>
              </div>
            </template>
            <div :id="item.id" class="custom-detail-content-slot">
              <slot :name="'modarea' + item.name"></slot>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="custom-detail-side-area"></div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElAnchor, ElAnchorLink, ElCollapse, ElCollapseItem } from 'element-plus'
const props = defineProps({
  title: String,
  anchors: Array
})
const contentLayout = ref(null)

const layout = reactive({
  title: props.title,
  anchors: [],
  activeNames: []
})
onMounted(async () => {
  const currentTime = new Date().getTime() + ''
  initAnchors(currentTime)
})

const handleClick = (e) => {
  e.preventDefault()
}

/**
 * 初始化anchors
 */
const initAnchors = (time) => {
  let actives = []
  let arr = []
  let idx
  props.anchors.forEach((item, index) => {
    idx = index + 1
    actives.push(idx + '')
    arr.push({
      id: time + '_' + idx,
      name: idx + '',
      title: item
    })
  })
  layout.activeNames = actives
  layout.anchors = arr
}

const scrollTo = (id) => {
  const element = document.getElementById(id)
  if (element) {
    if (id.indexOf('_1') != -1) {
      contentLayout.value.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }
}
</script>
<style scoped>
:deep(.el-collapse-item) {
  margin-bottom: 10px;
}

:deep(.el-collapse-item__header) {
  height: 35px;
  padding-left: 8px;
  line-height: normal;
  border-radius: 3px;
  border: 0;
  background: -webkit-linear-gradient(left, #f7f9ff, #e6eeff);
  background: -o-linear-gradient(right, #f7f9ff, #e6eeff);
  background: -moz-linear-gradient(right, #f7f9ff, #e6eeff);
  background: linear-gradient(to right, #f7f9ff, #e6eeff);
}

:deep(.el-collapse) {
  border: 0;
}

.primary {
  color: hsl(var(--primary));
}

.custom-detail-comp {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.custom-detail-headbar {
  width: 100%;
  height: 60px;
  position: relative;
  overflow: hidden;
}

.custom-detail-modicon {
  width: 4px;
  height: 13px;
  border-radius: 4px;
  background: #4266ff;
  box-shadow: 3px 2px 1px #b2c2ff;
}

.custom-detail-title {
  width: 100%;
  height: 30px;
  text-align: center;
  line-height: 30px;
  font-weight: 700;
  font-size: 16px;
  color: #666666;
}

.custom-detail-headbar-slot {
  width: calc(100% - 560px);
  height: calc(100% - 30px);
  margin-left: 280px;
  overflow: hidden;
}

.custom-detail-layout {
  width: 100%;
  height: calc(100% - 60px);
  overflow: hidden;
}

.custom-detail-side-area {
  height: 100%;
  width: 280px;
  float: left;
  display: flex;
  justify-content: center;
  align-items: start;
}

.custom-detail-content-area {
  width: calc(100% - 565px);
  height: 100%;
  float: left;
  padding-right: 5px;
  overflow: auto;
}

.custom-detail-content-title {
  color: #666666;
  margin-left: 8px;
  font-size: 14px;
  font-weight: 700;
}

.custom-detail-content-slot {
  margin: 10px 0;
}
</style>
