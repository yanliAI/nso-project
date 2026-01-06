<template>
  <div class="main-body">
    <el-card class="card-div task-bg">
      <div class="title-bd">
        <Operation class="icon-cd mt-[-2px]"></Operation>
        <span class="title-text">任务概况查询展示</span>
        <RefreshRight class="icon-cd refrsh-icon mt-[-1px]"></RefreshRight>
      </div>
      <div class="tools-div">
        <!-- <span style="font-size: 13px">类型：</span>
        <el-select v-model="busiType" clearable style="width: 150px">
          <el-option v-for="item in dropList.NSOS_WORKBENCEH_BUSI_TYPE" :key="item.value" :label="item.label" :value="item.value" />
        </el-select> -->
        <el-input v-model="serachText" class="-mt-2" style="width: 280px; margin-right:20px" placeholder="请输入关键字检索" clearable>
          <template #append>
            <el-button :icon="Search" @click="searchData"/>
          </template>  
        </el-input>
        <el-popover :visible="data.moreVisible" placement="bottom" trigger="click" width="500px">
          <template #reference>
            <el-button type="primary" @click="data.moreVisible = !data.moreVisible" text style="margin-left: 10px; font-size: 12px">更多>></el-button>
          </template>
          <el-row v-if="activeName == 'gj'">
            <el-col :span="11">
              <el-form-item label="一级分类:">
                <el-input v-model="data.formData.alertCatLevel1Name" clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="2" />
            <el-col :span="11">
              <el-form-item label="二级分类:">
                <el-input v-model="data.formData.alertCatLevel2Name" clearable/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="activeName == 'gjgd'">
            <el-col :span="11">
              <el-form-item label="工单编号:">
                <el-input v-model="data.formData.num" clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="2" />
            <el-col :span="11">
              <el-form-item label="当前节点:">
                <el-input v-model="data.formData.place" clearable/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="activeName == 'ld'">
            <el-col :span="11">
              <el-form-item label="漏洞名称:">
                <el-input v-model="data.formData.vulnerabilityName" clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="2" />
            <el-col :span="11">
              <el-form-item label="IPV4:">
                <el-input v-model="data.formData.ipv4" clearable/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="activeName == 'gz'">
            <el-col :span="11">
              <el-form-item label="工单编号:">
                <el-input v-model="data.formData.faultCode" clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="2" />
            <el-col :span="11">
              <el-form-item label="故障类别:">
                <el-select v-model="data.formData.faultType" filterable clearable>
                  <el-option v-for="item in dropList.NSOS_FAULT_TYPE" :key="item.value" :label="item.label" :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="activeName == 'zl'">
            <el-col :span="11">
              <el-form-item label="工单编号:">
                <el-input v-model="data.formData.commandCode" clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="2" />
            <el-col :span="11">
              <el-form-item label="指令分类:">
                <el-select v-model="data.formData.commandFl" filterable clearable>
                  <el-option v-for="item in dropList.NSOS_CMD_FL" :key="item.value" :label="item.label" :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="activeName == 'zy'">
            <el-col :span="11">
              <el-form-item label="工单编号:">
                <el-input v-model="data.formData.oid" clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="2" />
            <el-col :span="11">
              <el-form-item label="作业类型:">
                <el-input v-model="data.formData.workTypeName" clearable/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="activeName == 'yxfs'">
            <el-col :span="11">
              <el-form-item label="系统责任人:">
                <el-input v-model="data.formData.businessDeptSystemResponsible" clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="2" />
            <el-col :span="11">
              <el-form-item label="设备主人:">
                <el-input v-model="data.formData.deviceOwner" clearable/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="activeName == 'zb'">
            <el-col :span="11">
              <el-form-item label="保障级别:">
                <el-select v-model="data.formData.guaranteeLevel" filterable clearable>
                  <el-option v-for="item in dropList.NSOS_GUARANTEE_LEVEL" :key="item.value" :label="item.label" :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="2" />
            <el-col :span="11">
              <el-form-item label="巡检状态:">
                <el-select v-model="data.formData.checkStatus" filterable clearable>
                  <el-option v-for="item in dropList.NSOS_CHECK_STATUS" :key="item.value" :label="item.label" :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-popover>
        <span style="padding: 0 10px 0 20px; font-size: 13px">进度图</span>
        <el-radio-group v-model="radioJdt" size="small">
          <el-radio-button label="显示" :value="1" />
          <el-radio-button label="隐藏" :value="0" />
        </el-radio-group>
      </div>
      <div class="dis-card">
        <el-tabs v-model="activeName" class="main-tabs" @tab-change="tabChange">
          <el-tab-pane :label="tabTitles.gj" name="gj" :lazy="false" v-if="['YDZZ','AQ'].includes(role)">
            <TaskGj ref="taskGjRef" :showPro="radioJdt"></TaskGj>
          </el-tab-pane>
          <el-tab-pane :label="tabTitles.gjgd" name="gjgd" :lazy="true" v-if="['YDZZ','YX'].includes(role)">
            <TaskGjgd ref="taskGjgdRef" :showPro="radioJdt"></TaskGjgd>
          </el-tab-pane>
          <el-tab-pane :label="tabTitles.ld" name="ld" :lazy="true" v-if="['YDZZ','AQ'].includes(role)">
            <TaskLd ref="taskLdRef" :showPro="radioJdt"></TaskLd>
          </el-tab-pane>
          <el-tab-pane :label="tabTitles.gz" name="gz" :lazy="false" v-if="['YDZZ','YX'].includes(role)">
            <TaskGz ref="taskGzRef" :showPro="radioJdt"></TaskGz>
          </el-tab-pane>
          <el-tab-pane :label="tabTitles.zl" name="zl" :lazy="false">
            <TaskZl ref="taskZlRef" :showPro="radioJdt"></TaskZl>
          </el-tab-pane>
          <el-tab-pane :label="tabTitles.zy" name="zy" :lazy="false" v-if="['YDZZ','YX'].includes(role)">
            <TaskZy ref="taskZyRef"></TaskZy>
          </el-tab-pane>
          <el-tab-pane :label="tabTitles.yxfs" name="yxfs" :lazy="false" v-if="role === 'YDZZ'">
            <TaskYxfs ref="taskYxfsRef" :showPro="radioJdt"></TaskYxfs>
          </el-tab-pane>
          <el-tab-pane :label="tabTitles.zb" name="zb">
            <TaskZb ref="taskZbRef"></TaskZb>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, provide } from 'vue';
import TaskZb from './task-zb.vue';
import TaskGj from './task-gj.vue';
import TaskGjgd from './task-gjgd.vue';
import TaskGz from './task-gz.vue';
import TaskLd from './task-ld.vue';
import TaskZl from './task-zl.vue';
import TaskTz from './task-tz.vue';
import TaskZy from './task-zy.vue';
import TaskYxfs from './task-yxfs.vue';
import {
  DataAnalysis,
  Operation,
  RefreshRight,
  Search,
  Expand,
} from '@element-plus/icons-vue';
import { ElCard, ElTabs, ElTabPane, ElForm, ElFormItem } from 'element-plus';
import { queryZbData, countData } from './workbenchMethod.ts'
import { useDropStore } from '#/store';

const statsParams = defineModel('statsParams');
const role = defineModel('role');
const activeName = ref('zl');
const tabTitles = reactive({
  gj: '安全告警（0）',
  gjgd: '告警工单（0）',
  ld: '安全隐患（0）',
  gz: '故障（0）',
  zl: '指令（0）',
  zy: '作业（0）',
  yxfs: '特殊运行方式（0）',
  zb: '重保（0）',
});

const taskGjRef = ref()
const taskGzRef = ref()
const taskLdRef = ref()
const taskZlRef = ref()
const taskZyRef = ref()
const taskZbRef = ref()
const taskGjgdRef = ref()
const taskYxfsRef = ref()

const data = reactive({
  gjcxVisible: false,
  formData: {},
});
const serachText = ref(null);
const radioJdt = ref(1);
const busiType = ref(null);

const deptCode = defineModel('deptCode')
const dropList = reactive({});
onMounted(async () => {
  const dropStore = useDropStore();
  const dropType = ['NSOS_WORKBENCEH_BUSI_TYPE', 'NSOS_FAULT_TYPE', 'NSOS_CMD_FL', 'NSOS_GUARANTEE_LEVEL', 'NSOS_CHECK_STATUS'];
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);
  const deptParams = ref({
    statsDept : deptCode
  });
  const count = await countData({params: JSON.stringify(deptParams.value)});
  updateTabTitle(count)
});
const searchData = () => {
  let params = statsParams.value
  let json = 'string' === typeof(params) ? JSON.parse(params) : params
  json.keyword = serachText.value
  let mergedJson = {...json, ...data.formData}
  if (activeName.value == 'zb') {
    taskZbRef.value.queryData(JSON.stringify(mergedJson))
  }
  if (activeName.value == 'gz') {
    taskGzRef.value.queryData(JSON.stringify(mergedJson))
  }
  if (activeName.value == 'ld') {
    taskLdRef.value.queryData(JSON.stringify(mergedJson))
  }
  if (activeName.value == 'zl') {
    taskZlRef.value.queryData(JSON.stringify(mergedJson))
  }
  if (activeName.value == 'gj') {
    taskGjRef.value.queryData(JSON.stringify(mergedJson))
  }
  if (activeName.value == 'zy') {
    taskZyRef.value.queryData(JSON.stringify(mergedJson))
  }
  if (activeName.value == 'gjgd') {
    taskGjgdRef.value.queryData(JSON.stringify(mergedJson))
  }
  if (activeName.value == 'yxfs') {
    taskYxfsRef.value.queryData(JSON.stringify(mergedJson))
  }
}
const updateTabTitle = (count) => {
  if (count['zb'] != null) tabTitles.zb = '重保（'+count['zb']+'）'
  if (count['gz'] != null) tabTitles.gz = '故障（'+count['gz']+'）'
  if (count['ld'] != null) tabTitles.ld = '安全隐患（'+count['ld']+'）'
  if (count['zl'] != null) tabTitles.zl = '指令（'+count['zl']+'）'
  if (count['gj'] != null) tabTitles.gj = '安全告警（'+count['gj']+'）'
  if (count['zy'] != null) tabTitles.zy = '作业（'+count['zy']+'）'
  if (count['gjgd'] != null) tabTitles.gjgd = '告警工单（'+count['gjgd']+'）'
  if (count['yxfs'] != null) tabTitles.yxfs = '特殊运行方式（'+count['yxfs']+'）'
}
const seniorQuery = () => {
  data.gjcxVisible = false;
}

provide('updateTabTitle', updateTabTitle);

const statsQuery = async (params) => {
  taskZlRef.value?.queryData(params)
  taskGzRef.value?.queryData(params)
  taskGjRef.value?.queryData(params)
  taskZbRef.value?.queryData(params)
  taskZyRef.value?.queryData(params)
  taskZbRef.value?.queryData(params)
  taskGjgdRef.value?.queryData(params)
  taskYxfsRef.value?.queryData(params)
  taskLdRef.value?.queryData(params)
}
const changeTab = async (type) => {
  activeName.value = type;
}

const tabChange = () => {
  serachText.value = null;
  data.moreVisible = false;
  data.formData = {};
}

defineExpose({
  statsQuery, changeTab
});
</script>
<style scoped>
:deep(.el-tab-pane) {
  width: 100%;
  height: 100%;
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

/* :deep(.el-tabs__content){
  overflow: auto;
} */

.main-body {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 10px 15px;
}

:deep(.el-card__body) {
  height: 100%;
  padding: 10px 15px;
}

:deep(.el-radio) {
  margin-right: 8px;
}

:deep(.el-form--inline .el-form-item) {
  margin-right: 18px;
  margin-bottom: 15px;
}

.card-div {
  width: 100%;
  height: 100%;
}

.main-tabs {
  width: 100%;
  height: 100%;
}

.title-bd {
  display: flex;
  height: 22px;
  padding-left: 9px;
}

.dis-card {
  display: flex;
  width: 100%;
  height: calc(100% - 40px);
  padding: 0 15px;
}

.icon-cd {
  width: 18px;
  height: 18px;
  margin-left: 6px;
  color: hsl(var(--primary));
}

.title-text {
  padding-left: 6px;
  font-size: 14px;
  font-weight: bold;
}

.refrsh-icon {
  cursor: pointer;
}

.tlco {
  color: hsl(var(--destructive));
}

.tools-div {
  position: absolute;
  top: 52px;
  right: 46px;
  z-index: 1000;
  display: flex;
  align-items: center;
  height: 32px;
}

.demo-form-inline .el-input {
  --el-input-width: 180px;
}

.demo-form-inline .el-select {
  --el-select-width: 180px;
}

.demo-form-inline .el-date-editor {
  --el-date-editor-width: 180px;
}

:deep(.el-date-editor.el-input, .el-date-editor.el-input__wrapper){
    width: 180px;
}

.task-bg {
  background: linear-gradient(180deg, #EFF4FF 0%,rgb(255 255 255 / 95%)17%,rgb(255 255 255 / 72%)100%);
}
</style>
