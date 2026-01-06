<template>
  <div class="main-bd">
    <el-card class="w-full h-[15%] flex condition-bg">
      <div class="flex text-sm items-center -mt-[8px]">
        <div class="flex cursor-pointer pl-2 w-[100px]">
          <List class="icon-cd" />
          <span class="pl-1" @click="modalApiB.open()">值班日志</span>
        </div>
        <div class="flex cursor-pointer pl-4 w-[80px]" v-if="dutyRole.isCurDuty || dutyRole.isNextDuty">
          <UserFilled class="icon-cd" />
          <span class="pl-1" @click="modalApiA.open()" v-if="dutyRole.isCurDuty && !dutyRole.isNextDuty">交班</span>
          <span class="pl-1" @click="modalApiA.open()" v-else-if="dutyRole.isCurDuty && dutyRole.isNextDuty">接班</span>
          <span class="pl-1" @click="modalApiA.open()" v-else-if="!dutyRole.isCurDuty && dutyRole.isNextDuty">接班</span>
        </div>
        <div class="flex cursor-pointer pl-4 w-[100px]" @click="openCmd('3')">
          <Promotion class="icon-cd" />
          <!-- <el-dropdown @command="openCmd" class="items-center"> -->
            <span class="pl-1">指令发布</span>
            <!-- <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="1">指令</el-dropdown-item>
                <el-dropdown-item command="2">通知</el-dropdown-item>
              </el-dropdown-menu>
            </template> -->
          <!-- </el-dropdown> -->
        </div>
        <div class="flex items-center justify-end" style="width: calc(100% - 280px)">
          <span class="">单位：</span>
          <el-select v-model="data.formData.statsDept" class="pl-2" style="width: 150px" @change="query" :disabled="!deptRight" filterable>
            <el-option v-for="item in dropList.NSOS_ORG_NAME_SJJC" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-radio-group v-model="data.formData.statsType" class="pl-10" @change="query">
            <el-radio value="1">当班</el-radio>
            <el-radio value="2">本周</el-radio>
            <el-radio value="3">自定义时间</el-radio>
          </el-radio-group>
          <el-date-picker v-model="data.formData.startTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" 
            style="width: 200px" class="pl-4" :clearable="false" :disabled="data.formData.statsType !== '3'"/>
          <span class="pl-4">-</span>
          <el-date-picker v-model="data.formData.endTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" 
            style="width: 200px" class="pl-4" :clearable="false" :disabled="data.formData.statsType !== '3'"/>
          <el-button type="primary" size="small" class="ml-4" @click="query">查询</el-button>
        </div>
      </div>
    </el-card>
    <el-card class="w-full h-[85%] mt-[0.6%] stats-bg">
      <div class="title-bd">
        <DataAnalysis class="icon-cd mt-[-2px]"></DataAnalysis>
        <span class="title-text">当前任务统计展示</span>
        <RefreshRight class="icon-cd refrsh-icon mt-[-1px]"></RefreshRight>
      </div>
      <div class="dis-card">
        <div class="w-full h-1/2 flex items-center stats-top">
          <div class="stats-type">
            <div class="wlaq"></div>
            <div class="text-center">网络安全</div>
          </div>
          <div class="card-div-long">
            <el-card class="stats-card stats-card-tp card-aqgj">
              <div class="card-left">
                <div class="left-name">告警总数（{{ data.dldata.AQGJ?.total }}）</div>
              </div>
              <div class="card-right">
                <div class="w-full flex">
                  <div class="xl-two-row">
                    <div class="xl-right-border">
                      <div class="right-name">自动清洗</div>
                      <div class="right-value">{{ data.dldata.AQGJ?.qx }}</div>
                    </div>
                  </div>
                  <div class="xl-two-row">
                    <div class="xl-right-border">
                      <div class="right-name">自动封堵</div>
                      <div class="right-value">{{ data.dldata.AQGJ?.fd }}</div>
                    </div>
                  </div>
                  <div class="xl-two-row">
                    <div class="xl-right-border canClick" @click="changeTab('gj')">
                      <div class="right-name">已研判</div>
                      <div class="right-value">
                         {{ data.dldata.AQGJ?.yyp }}<span v-if="data.dldata.AQGJ?.yyp > 0">（ <span class="first-value">{{ data.dldata.AQGJ?.cz }}</span> ）</span>
                      </div>
                    </div>
                  </div>
                   <div class="xl-two-row">
                    <div class="xl-right-last canClick" @click="toGtzz">
                      <div class="right-name">待研判</div>
                      <div class="right-value">{{ data.dldata.AQGJ?.dyp }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </div>
          <div class="card-div">
            <el-card class="stats-card stats-card-tp card-ld">
              <div class="card-left">
                <div class="left-name">安全隐患（{{ data.dldata.AQYH?.total }}）</div>
              </div>
              <div class="card-right">
                <div class="w-full flex">
                  <div class="xl-two-row">
                    <div class="xl-right-border canClick" @click="changeTab('ld')">
                      <div class="right-name">执行中
                        <span class="right-value first-value">{{ data.dldata.AQYH?.zxz }}</span>
                      </div>
                    </div>
                  </div>
                   <div class="xl-two-row">
                    <div class="xl-right-last">
                      <div class="right-name">已闭环
                        <span class="right-value">{{ data.dldata.AQYH?.ybh }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </div>
          <div class="card-div">
            <el-card class="stats-card stats-card-tp card-zl">
              <div class="card-left">
                <div class="left-name">指令（{{ data.dldata.ZL?.total }}）</div>
              </div>
              <div class="card-right">
                <div class="w-full flex">
                  <div class="xl-two-row">
                    <div class="xl-right-border canClick" @click="changeTab('zl')">
                      <div class="right-name">执行中
                        <span class="right-value first-value">{{ data.dldata.ZL?.zxz }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="xl-two-row">
                    <div class="xl-right-last">
                      <div class="right-name">已闭环
                        <span class="right-value">{{ data.dldata.ZL?.ybh }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </div>
          <div class="card-div">
            <el-card class="stats-card stats-card-tp card-tsyxfs">
              <div class="card-left-last">
                <div class="left-name">特殊运行方式（{{ data.dldata.TSFS?.total }}）</div>
              </div>
              <div class="card-right">
                <div class="w-full flex">
                  <div class="xl-two-row">
                    <div class="xl-right-border canClick" @click="changeTab('yxfs')">
                      <div class="right-name">未处置
                        <span class="right-value first-value">{{ data.dldata.TSFS?.zxz }}</span>
                      </div>
                    </div>
                  </div>
                   <div class="xl-two-row">
                    <div class="xl-right-last">
                      <div class="right-name">已处置
                        <span class="right-value">{{ data.dldata.TSFS?.ybh }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </div>
        </div>
        <div class="w-full h-1/2 flex items-center">
          <div class="stats-type">
            <div class="xxyx"></div>
            <div class="text-center">信息运行</div>
          </div>
          <div class="card-div">
            <el-card class="stats-card stats-card-bm card-yxgj">
              <div class="card-left">
                <div class="left-name">告警工单（{{ data.dldata.GJGD?.total }}）</div>
              </div>
              <div class="card-right">
                <div class="w-full flex">
                  <div class="xl-two-row">
                    <div class="xl-right-border">
                      <div class="right-name">待研判
                        <span class="right-value">{{ data.dldata.GJGD?.dyp }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="xl-two-row">
                    <div class="xl-right-border canClick" @click="changeTab('gjgd')">
                      <div class="right-name">处置中
                        <span class="right-value first-value">{{ data.dldata.GJGD?.zxz }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="xl-two-row">
                    <div class="xl-right-last">
                      <div class="right-name">已闭环
                        <span class="right-value">{{ data.dldata.GJGD?.ybh }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </div>
          <div class="card-div">
            <el-card class="stats-card stats-card-bm card-gz">
              <div class="card-left">
                <div class="left-name">故障（{{ data.dldata.GZ?.total }}）</div>
              </div>
              <div class="card-right">
                <div class="w-full flex">
                  <div class="xl-two-row">
                    <div class="xl-right-border canClick" @click="changeTab('gz')">
                      <div class="right-name">处置中
                        <span class="right-value first-value">{{ data.dldata.GZ?.czz }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="xl-two-row">
                    <div class="xl-right-last">
                      <div class="right-name">已恢复
                        <span class="right-value">{{ data.dldata.GZ?.yhf }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </div>
          <div class="card-div-long">
            <el-card class="stats-card stats-card-bm card-zy">
              <div class="card-left">
                <div class="left-name">作业（{{ data.dldata.ZY?.total }}）</div>
              </div>
              <div class="card-right">
                <div class="w-full flex">
                  <div class="xl-two-row">
                    <div class="xl-right-border">
                      <div class="right-name">待签发
                        <span class="right-value">{{ data.dldata.ZY?.dqf }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="xl-two-row">
                    <div class="xl-right-border">
                      <div class="right-name">待许可
                        <span class="right-value">{{ data.dldata.ZY?.dxk }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="xl-two-row">
                    <div class="xl-right-border canClick" @click="changeTab('zy')">
                      <div class="right-name">执行中
                        <span class="right-value first-value">{{ data.dldata.ZY?.zxz }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="xl-two-row">
                    <div class="xl-right-last">
                      <div class="right-name">已完成
                        <span class="right-value">{{ data.dldata.ZY?.ywc }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </div>
          <div class="card-div">
            <el-card class="stats-card stats-card-bm card-zb">
              <div class="card-left-last">
                <div class="left-name">重保（{{ data.dldata.ZB?.total }}）</div>
              </div>
              <div class="card-right">
                <div class="w-full flex">
                  <div class="xl-two-row">
                    <div class="xl-right-border canClick" @click="changeTab('zb')">
                      <div class="right-name">执行中
                        <span class="right-value first-value">{{ data.dldata.ZB?.zxz }}</span>
                      </div>
                    </div>
                  </div>
                   <div class="xl-two-row">
                    <div class="xl-right-last">
                      <div class="right-name">已完成
                        <span class="right-value">{{ data.dldata.ZB?.ywc }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </div>
        </div>
      </div>
    </el-card>

    <Modal class="w-[1200px] h-[800px]" :footer="false" :closeOnClickModal="false" :bordered="false" :draggable="true">
      <CmdDetail :cmdFl="data.cmdFl" @removeTab="addClose"></CmdDetail>
    </Modal>
    <ModalA class="w-[1000px] h-[620px]" title="交接班" :footer="false" :closeOnClickModal="false" :draggable="true">
      <HandoverShifts @close="modalApiA.close()" @afterShiftDuty="afterShiftDuty"></HandoverShifts>
    </ModalA>
    <ModalB class="w-[1400px]" title="值班日志" :footer="false" :closeOnClickModal="false" :draggable="true">
      <ShiftHandoverLog></ShiftHandoverLog>
    </ModalB>
  </div>
</template>
<script setup>
import { ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus';
import { DataAnalysis, RefreshRight, Document, UserFilled, Promotion, List } from '@element-plus/icons-vue';
import { ElCard } from 'element-plus';
import { onMounted, reactive, watch, ref } from 'vue';
import { queryDlData, queryZlData, queryDutyRole } from './workbenchMethod.ts';
import { formatDateTime } from '#/utils/commonUtil.ts';
import { useDropStore } from '#/store';
import { useVbenModal } from '@vben/common-ui';
import CmdDetail from '/src/views/runDdMgt/cmdMgt/cmdDetail.vue'
import HandoverShifts from '#/views/runDdMgt/dutyMgt/handoverShifts/index.vue';
import ShiftHandoverLog from '#/views/runDdMgt/dutyMgt/shiftHandoverLog.vue';

const data = reactive({
  formData: {},
  dldata: {},
  cmdFl: null,
  curDuty: null,
  shiftZzName: null,
  shiftYdName: null,
});
const dutyRole = ref({})
const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
});

const [ModalA, modalApiA] = useVbenModal({
  onCancel() {
    modalApiA.close();
  },
});

const [ModalB, modalApiB] = useVbenModal({
  onCancel() {
    modalApiB.close();
  },
});

const deptCode = defineModel('deptCode')
const deptRight = defineModel('deptRight')
const emit = defineEmits(['statsQuery', 'changeTab'])
const dropList = reactive({});
onMounted(async () => {
  const dropStore = useDropStore();
  const dropType = ['NSOS_ORG_NAME_SJJC'];
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);
  data.formData.statsDept = deptCode;
  data.formData.statsType = '1';
  init();
});

watch(() => data.formData.statsType, (newVal, oldVal) => {
  if (newVal === '1') {
    const today = new Date();
    const start = new Date(today);
    start.setHours(0,0,0,0);
    const end = new Date(today);
    end.setHours(23,59,59,999);
    data.formData.startTime = formatDateTime(start);
    data.formData.endTime = formatDateTime(end);
  } else if (newVal === '2') {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const start = new Date(today.setDate(diff));
    start.setHours(0,0,0,0);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23,59,59,999);
    data.formData.startTime = formatDateTime(start);
    data.formData.endTime = formatDateTime(end);
  }
})

const init = async () => {
  data.dldata = await queryDlData({params : JSON.stringify(data.formData)})
  
  queryDutyInfo()
};

const query = async () => {
  data.dldata = await queryDlData({params : JSON.stringify(data.formData)})
  emit('statsQuery', JSON.stringify(data.formData))
};
const queryDutyInfo = async () => {
  const { curDuty, dutyRoleMap } = await queryDutyRole();
  dutyRole.value = dutyRoleMap
  data.curDuty = curDuty
}
const changeTab = async (type) => {
  emit('changeTab', type)
}

const openCmd = (val) => {
  data.cmdFl = val;
  modalApi.open();
}

const addClose = () => {
  modalApi.close();
}

const toGtzz = () => {
  window.open('/safetyCommandMgt/wallChartOperation', '_blank');
}

const afterShiftDuty = async () => {
  modalApiA.close();
  queryDutyInfo();
}
</script>
<style scoped>
:deep(.el-card__body) {
  width: 100%;
  height: 100%;
  padding: 10px 15px;
}

.main-bd {
  width: 100%;
  height: 100%;
  padding: 10px 15px;
}

.title-bd {
  display: flex;
  height: 30px;
  padding-left: 9px;
}

.dis-card {
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

.card-div {
  width: 20%;
  height: 100%;
  padding: 0 0 0 25px;
}

.card-div-last {
  width: 16%;
  height: 100%;
  padding: 0 0 0 25px;
}

.card-div-long {
  width: 30%;
  height: 100%;
  padding: 0 0 0 25px;
}

:deep(.stats-card .el-card__body) {
  width: 100%;
}

.stats-card {
  width: 100%;
  height: 100%;
  background-color: #d8d9dc;
}

.stats-card-tp {
  margin-top: -1%;
}

.stats-card-bm {
  margin-top: 1%;
}

.stats-type {
  width: 85px;
  padding-left: 5px;
  font-weight: bold;
  color: #0b388d;
  letter-spacing: 1px;
}

.stats-top {
  border-bottom: 1px solid #f0f0f0;
}

.card-left {
  width: 100%;
  height: 40%;
  font-weight: bold;
  border-bottom: 1px solid hsl(var(--border));
}

.card-right {
  display: flex;
  width: 100%;
  height: 60%;
  margin-top: 5px;
}

.card-left-last {
  width: 100%;
  height: 40%;
  font-weight: bold;
  border-bottom: 1px solid hsl(var(--border));
}

.card-right-last {
  display: flex;
  width: 100%;
  height: 60%;
  margin-top: 5px;
}

.right-l {
  width: 50%;
  height: 100%;
}

.right-border {
  height: 100%;
  border-right: 1px solid hsl(var(--border));
}

.right-last {
  height: 100%;
}

.right-top, .right-bottom {
  width: 100%;
  height: 50%;
}

.right-top {
  text-align: center;
}

.right-bottom {
  display: flex;
}

.rb-left {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 50%;
  height: 100%;
  text-align: center;
}

.xl-two-row {
  width: 50%;
  height: 100%;
}

.xl-one-row {
  width: 100%;
  height: 100%;
}

.xl-right-border {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  text-align: center;
  border-right: 1px solid hsl(var(--border));
}

.xl-right-last {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  text-align: center;
}

.left-value {
  color: #439fe1;
}

.high-value {
  font-size: 14px;
  color: #fff;
  background-color: #f54051;
  border-color: #f54051;
}

.mid-value {
  font-size: 14px;
  color: #fff;
  background-color: #dc8538;
  border-color: #dc8538;
}

.first-value {
  color: #f54051;
}

.right-name, .right-value {
  font-size: 13px;
}

.right-value {
  font-weight: bold;
}

.xdl-title {
  font-size: 13px;
}

.card-aqgj {
  background: url("/images/ydgzt/bg-aqgj-2.png") no-repeat;
  background-size: 100% 100%;
}

.card-ld {
  background: url("/images/ydgzt/bg-ld-2.png") no-repeat;
  background-size: 100% 100%;
}

.card-zl {
  background: url("/images/ydgzt/bg-zl-2.png") no-repeat;
  background-size: 100% 100%;
}

.card-tsyxfs {
  background: url("/images/ydgzt/bg-tsyxfs-2.png") no-repeat;
  background-size: 100% 100%;
}

.card-yxgj {
  background: url("/images/ydgzt/bg-yxgj-2.png") no-repeat;
  background-size: 100% 100%;
}

.card-gz {
  background: url("/images/ydgzt/bg-gz-2.png") no-repeat;
  background-size: 100% 100%;
}

.card-zy {
  background: url("/images/ydgzt/bg-zy-2.png") no-repeat;
  background-size: 100% 100%;
}

.card-zb {
  background: url("/images/ydgzt/bg-zb-2.png") no-repeat;
  background-size: 100% 100%;
}

.left-name {
  padding-top: 1px;
  font-size: 13px;
  color: #0b388d;
  text-align: center;
}

.canClick:hover {
  cursor: pointer;
  background-color: #cce1fa;
}

:deep(.el-tooltip__trigger:focus-visible) {
  outline: unset;
}

.condition-bg {
  background-color: #eff2f9;
}

.stats-bg {
  background: url("/images/ydgzt/workbench-bg.png") no-repeat;
  background-size: 100% 100%;
}

.wlaq {
  width: 40px;
  height: 40px;
  margin: 0 auto;
  background: url("/images/ydgzt/wlaq.png") center no-repeat;
  background-size: 90% 90%;
}

.xxyx {
  width: 40px;
  height: 40px;
  margin: 0 auto;
  background: url("/images/ydgzt/xxyx.png") center no-repeat;
  background-size: 90% 90%;
}

.right-top {
  align-content: center;
}
</style>
