<template>
  <div style="padding: 0 20px; height: 100%" class="bg-white">
      <el-affix position="top" :offset="50"  style="width: 100%; ">
        <el-card shadow="never" class="main-card" style="margin-bottom: 20px; width: 100%; ">
          <div style="background-color: white; padding: 15px 0;" v-if="isOrderDetail === '1'">
            <div style="font-size: 20px; color: black; font-weight: 500; text-align: center">并网工单详情</div>
            <div style="text-align: end">
              <el-button type="success" @click="isOrderDetail = '2'" >并网工单流程</el-button>
              <el-button type="info" @click="returnOrder">返回</el-button>
            </div>
          </div>
          <div style="background-color: white; padding: 15px 0;" v-if="isOrderDetail === '2'">
            <div style="font-size: 20px; color: black; font-weight: 500; text-align: center">并网工单流程</div>
            <div style="text-align: end">
              <el-button type="success" @click="isOrderDetail = '1'" >并网工单详情</el-button>
              <el-button type="info" @click="returnOrder" >返回</el-button>
            </div>
          </div>
          <div style="background-color: white; padding: 15px 0;" v-if="isOrderDetail === '3'">
            <div style="font-size: 20px; color: black; font-weight: 500; text-align: center">并网工单计划详情</div>
            <div style="text-align: end">
              <el-button type="success" @click="isOrderDetail = '1'" >并网工单详情</el-button>
              <el-button type="info" @click="returnOrder" >返回</el-button>
            </div>
          </div>
          </el-card>
      </el-affix>
    <div v-if="isOrderDetail === '1'">
      <GridOrderDetail v-if="oid && sourceType" :oid="oid" :tid="tid" :sourceType="sourceType" @custom-event="toWorkPlanPage" @sendPid="getParamVal" ></GridOrderDetail>
    </div>
    <div v-if="isOrderDetail === '2'">
      <FlowDeatil :oid="oid" :pid="pid" ></FlowDeatil>
    </div>
    <div v-if="isOrderDetail === '3'">
      <GridPlanDetail :nid="workPlanOid"></GridPlanDetail>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ElTable, ElAffix, ElTableColumn, ElRow, ElCard, ElCol, ElFormItem, ElForm, ElInput, ElButton, ElSelect, ElOption, ElContainer, ElAside, ElHeader, ElMain, ElFooter, ElDialog, ElMessage, ElMessageBox, ElText, ElLink, ElCollapse, ElCollapseItem, ElTag } from 'element-plus'
import { Search, Download, Monitor, Operation, Document, Back, CircleCheck } from '@element-plus/icons-vue'
import { Page } from '@vben/common-ui'
import { ref, reactive, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import GridOrderDetail from './gridOrderDetail.vue'
import GridPlanDetail from './gridPlanDetail.vue'
import FlowDeatil from './flowDetail.vue'
const router = useRouter()
const pid = ref('')
const workPlanOid = ref('')
const route = useRoute()
const oid = route.query.oid
const sourceType = route.query.type
const tid = route.query.tid
const data = ref({}) // 信息两票工单详情信息
const isOrderDetail = ref('1')  // 切换1:工单详情/2:计划工单详情/ 3:流程详情

/**
 * 当前页面跳转来源：我的代办/并网清单
 * 我的待办 @param oid: 并网单号，@param type '2': 显示审核,'3':'不显示审核' @param tid: 工单id
 * 并网清单  @param oid:并网单号, @param type '1': 并网清单跳转当前页面 '4' 关联计划跳转当前页面  @param nid: 关联计划工单号  
 */

// 监听路由变化，更新参数
watch(() => route.query, (newQuery) => {
  if (newQuery.type === '4') {
    isOrderDetail.value = '3'
    workPlanOid.value = newQuery.nid
  } 
}, { immediate: true });

// 返回工单页面
function returnOrder() {
  if (sourceType === '1' || sourceType === '4' ) {
    router.push({
      path: '/gridConnectionAnalysis/gridList'
    })
  } else {
    router.push({
      path: '/workPlanBalance/myAgent'
    })
  }
}

// 切换到作业详情页面
function toWorkPlanPage(){
  isOrderDetail.value = '3'
}

// 获取并网计划工单详情oid
function getParamVal(val){
  workPlanOid.value = val.wid
  pid.value = val.pid
}

</script>
<style scoped>
.main-card{
  :deep(.el-card__body){
    padding-top:0
  }
}
:deep(.el-form-item__label) {
  align-items: center; /* 修改为居中 */
  box-sizing: border-box;
  color: var(--el-text-color-regular);
  display: inline-flex;
  flex: 0 0 auto;
  font-size: var(--el-form-label-font-size);
  height: auto; /* 改为自动高度以适应多行 */
  justify-content: flex-end;
  line-height: 1.2; /* 设置行间距为1 */
  padding: 0 12px 0 0;
  white-space: normal; /* 允许换行 */
  word-break: break-word; /* 单词换行 */
  min-height: 32px; /* 最小高度保持32px */
  text-align: right;
}
.title-box {
  padding: 20px;
  height: 20px;
  width: 100%;
  background-color: #f4f4f5;
}
.title-icon {
  width: 4px;
  background-color: rgb(169, 162, 162);
  height: 20px;
  margin-right: 5px;
}

.file-name {
  flex: 1;
  min-width: 0; /* 关键：允许内容收缩 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-name:hover {
  color: var(--el-color-primary);
}
.dialog-title {
  width: 150px;
  text-align: right;
  padding-right: 15px;
}
.box1 {
  border: 1px solid #eeeeee;
  height: 40px;
  line-height: 40px;
  font-weight: 500;
  padding: 0 20px;
  background-color: #fafafa;
}
.box2 {
  border: 1px solid #eeeeee;
  padding: 0 20px;
  height: auto;
  background-color: #fafafa;
  display: flex;
  align-items: center;
}
.box3 {
  border: 1px solid #eeeeee;
  padding: 0 20px;
  height: auto;
  height: 40px;
  background-color: #fafafa;
  display: flex;
  align-items: center;
}
.download-icon {
  margin-left: 10px;
  vertical-align: middle;
  color: #606266; /* 默认灰色 */
  transition: color 0.3s ease; /* 添加过渡效果 */
}

.download-icon:hover {
  color: #409eff; /* Element Plus 的蓝色 */
  cursor: pointer; /* 鼠标悬停时显示手型指针 */
}
</style>
