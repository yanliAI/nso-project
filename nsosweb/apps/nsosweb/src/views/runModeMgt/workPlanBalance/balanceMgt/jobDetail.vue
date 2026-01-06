<template>
  <Page auto-content-height class="child-page">
    <el-container>
      <el-aside>
        <div class="link-con">
          <el-link type="primary" @click="scrollToPosition('first')"
            ><Monitor style="width: 1em; display: inline; margin-right: 5px" />
            基础信息
          </el-link>
        </div>
        <div class="link-con">
          <el-link type="primary" @click="scrollToPosition('second')"
            ><Monitor style="width: 1em; display: inline; margin-right: 5px" />
            作业台账清单
          </el-link>
        </div>
        <div class="link-con">
          <el-link type="primary" @click="scrollToPosition('third')"
            ><Monitor style="width: 1em; display: inline; margin-right: 5px" />
            作业系统
          </el-link>
        </div>
        <div class="link-con">
          <el-link type="primary" @click="scrollToPosition('fourth')"
            ><Monitor style="width: 1em; display: inline; margin-right: 5px" />
            关联信息系统清单
          </el-link>
        </div>
      </el-aside>
      <el-container>
        <el-header>
          <h1 class="title">作业详细</h1>

          <el-form :inline="true">
            <el-row :gutter="20">
              <el-col :span="18">
                <el-form-item label="工单编号:" style="margin-left: 150px">
                  <el-text type="primary">{{ orderNo }}</el-text>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-button
                    type="primary"
                    :icon="Operation"
                    @click="editTimeDialogData.visible = true"
                    >调整</el-button
                  >
                  <el-button
                    type="primary"
                    :icon="Monitor"
                    @click="publishTaskBalance"
                    >发布</el-button
                  >
                  <el-button
                    type="info"
                    :icon="Back"
                    @click="emit('closeDetailPage')"
                    >返回</el-button
                  >
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-header>
        <el-main>
          <el-collapse v-model="activeNames">
            <el-collapse-item name="first" ref="first">
              <template #title>
                <div class="primary flex items-center">
                  <Monitor class="h-3.5 w-3.5" />
                  <div class="ml-1 font-bold">基础信息</div>
                </div>
              </template>
              <BaseInfo
                ref="baseInfoRef"
                :detailData="detailData"
                :orderId="orderId"
                :disabled="true"
              />
            </el-collapse-item>

            <el-collapse-item name="second" ref="second">
              <template #title>
                <div class="primary flex items-center">
                  <Monitor class="h-3.5 w-3.5" />
                  <div class="ml-1 font-bold">作业台账清单</div>
                </div>
              </template>
              <AccountsList
                ref="accountsListRef"
                :detailData="detailData"
                :orderId="orderId"
                :disabled="true"
                :timeEditable="true"
              />
            </el-collapse-item>

            <el-collapse-item name="third" ref="third">
              <template #title>
                <div class="primary flex items-center">
                  <Monitor class="h-3.5 w-3.5" />
                  <div class="ml-1 font-bold">作业系统</div>
                </div>
              </template>
              <JobSystem
                ref="jobSystemRef"
                :detailData="detailData"
                :orderId="orderId"
                :disabled="true"
                :timeEditable="true"
              />
            </el-collapse-item>
            <el-collapse-item name="fourth" ref="fourth">
              <template #title>
                <div class="primary flex items-center">
                  <Monitor class="h-3.5 w-3.5" />
                  <div class="ml-1 font-bold">关联信息系统清单</div>
                </div>
              </template>
              <LinkSystemList
                ref="linkSystemListRef"
                :detailData="detailData"
                :orderId="orderId"
                :disabled="true"
              />
            </el-collapse-item>
          </el-collapse>
        </el-main>
      </el-container>
    </el-container>

    <!-- 调整弹框 -->
    <el-dialog v-model="editTimeDialogData.visible" title="调整" width="1400">
      <el-form
        :inline="true"
        style="display: flex; flex-direction: row-reverse"
      >
        <el-form-item>
          <el-button @click="editTimeDialogData.visible = false"
            >取消</el-button
          >
          <el-button type="primary" @click="confirmSave">保存</el-button>
        </el-form-item>
      </el-form>
      <div class="sub-title">
        <div class="line-tag"></div>
        <span>调整前时间</span>
      </div>
      <div class="line-h"></div>
      <el-form
        :inline="true"
        label-position="right"
        label-width="auto"
        style="padding: 0 20px"
      >
        <el-row :gutter="100">
          <el-col :span="8">
            <el-form-item label="作业计划开始时间：">
              <el-date-picker
                v-model="detailData.startTime"
                type="datetime"
                placeholder="请选择作业计划开始时间"
                format="YYYY-MM-DD HH:mm"
                value-format="YYYY-MM-DD HH:mm"
                style="width: 100%"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="作业计划结束时间：">
              <el-date-picker
                v-model="detailData.endTime"
                type="datetime"
                placeholder="请选择作业计划结束时间"
                format="YYYY-MM-DD HH:mm"
                value-format="YYYY-MM-DD HH:mm"
                style="width: 100%"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="作业计划总时长：">
              <span style="color: #ff0000">
                {{
                  calculateDuration(detailData.startTime, detailData.endTime)
                }}
              </span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="100">
          <el-col :span="8">
            <el-form-item label="停机开始时间：">
              <el-date-picker
                v-model="detailData.haltStartTime"
                type="datetime"
                placeholder="请选择停机开始时间"
                format="YYYY-MM-DD HH:mm"
                value-format="YYYY-MM-DD HH:mm"
                style="width: 100%"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="停机结束时间：">
              <el-date-picker
                v-model="detailData.haltEndTime"
                type="datetime"
                placeholder="请选择停机结束时间"
                format="YYYY-MM-DD HH:mm"
                value-format="YYYY-MM-DD HH:mm"
                style="width: 100%"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="停机总时长：">
              <span style="color: #ff0000">
                {{
                  calculateDuration(
                    detailData.haltStartTime,
                    detailData.haltEndTime,
                  )
                }}
              </span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="100">
          <el-col :span="8">
            <el-form-item label="停服开始时间：">
              <el-date-picker
                v-model="detailData.stopStatTime"
                type="datetime"
                placeholder="请选择停服开始时间"
                format="YYYY-MM-DD HH:mm"
                value-format="YYYY-MM-DD HH:mm"
                style="width: 100%"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="停服结束时间：">
              <el-date-picker
                v-model="detailData.stopEndTime"
                type="datetime"
                placeholder="请选择停服结束时间"
                format="YYYY-MM-DD HH:mm"
                value-format="YYYY-MM-DD HH:mm"
                style="width: 100%"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="停服总时长：">
              <span style="color: #ff0000">
                {{
                  calculateDuration(
                    detailData.stopStatTime,
                    detailData.stopEndTime,
                  )
                }}
              </span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div class="sub-title">
        <div class="line-tag"></div>
        <span>调整后时间</span>
      </div>
      <div class="line-h"></div>
      <el-form
        :inline="true"
        label-position="right"
        label-width="auto"
        style="padding: 0 20px"
      >
        <el-row :gutter="100">
          <el-col :span="8">
            <el-form-item label="作业计划开始时间：">
              <el-date-picker
                v-model="editTimeDialogData.timeData.adjustStartTime"
                type="datetime"
                placeholder="请选择作业计划开始时间"
                format="YYYY-MM-DD HH:mm"
                value-format="YYYY-MM-DD HH:mm"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="作业计划结束时间：">
              <el-date-picker
                v-model="editTimeDialogData.timeData.adjustEndTime"
                type="datetime"
                placeholder="请选择作业计划结束时间"
                format="YYYY-MM-DD HH:mm"
                value-format="YYYY-MM-DD HH:mm"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="作业计划总时长：">
              <span style="color: #ff0000">{{
                calculateDuration(
                  editTimeDialogData.timeData.adjustStartTime,
                  editTimeDialogData.timeData.adjustEndTime,
                )
              }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="100">
          <el-col :span="8">
            <el-form-item label="停机开始时间：">
              <el-date-picker
                v-model="editTimeDialogData.timeData.adjustHaltStartTime"
                type="datetime"
                placeholder="请选择停机开始时间"
                format="YYYY-MM-DD HH:mm"
                value-format="YYYY-MM-DD HH:mm"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="停机结束时间：">
              <el-date-picker
                v-model="editTimeDialogData.timeData.adjustHaltEndTime"
                type="datetime"
                placeholder="请选择停机结束时间"
                format="YYYY-MM-DD HH:mm"
                value-format="YYYY-MM-DD HH:mm"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="停机总时长：">
              <span style="color: #ff0000">{{
                calculateDuration(
                  editTimeDialogData.timeData.adjustHaltStartTime,
                  editTimeDialogData.timeData.adjustHaltEndTime,
                )
              }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="100">
          <el-col :span="8">
            <el-form-item label="停服开始时间：">
              <el-date-picker
                v-model="editTimeDialogData.timeData.adjustStopStatTime"
                type="datetime"
                placeholder="请选择停服开始时间"
                format="YYYY-MM-DD HH:mm"
                value-format="YYYY-MM-DD HH:mm"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="停服结束时间：">
              <el-date-picker
                v-model="editTimeDialogData.timeData.adjustStopEndTime"
                type="datetime"
                placeholder="请选择停服结束时间"
                format="YYYY-MM-DD HH:mm"
                value-format="YYYY-MM-DD HH:mm"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="停服总时长：">
              <span style="color: #ff0000">{{
                calculateDuration(
                  editTimeDialogData.timeData.adjustStopStatTime,
                  editTimeDialogData.timeData.adjustStopEndTime,
                )
              }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </Page>
</template>

<script lang="ts" setup>
import {
  ElTable,
  ElTableColumn,
  ElRow,
  ElCol,
  ElFormItem,
  ElForm,
  ElInput,
  ElButton,
  ElSelect,
  ElOption,
  ElContainer,
  ElAside,
  ElHeader,
  ElMain,
  ElFooter,
  ElDialog,
  ElMessage,
  ElMessageBox,
  ElText,
  ElLink,
  ElCollapse,
  ElCollapseItem,
  ElTag,
} from 'element-plus';
import {
  Search,
  Download,
  Monitor,
  Operation,
  Back,
  CircleCheck,
} from '@element-plus/icons-vue';
import { Page } from '@vben/common-ui';
import { ref, reactive, computed, onMounted, nextTick } from 'vue';
import {
  getTaskDetailApi,
  saveBatchAdjustApi,
  publishTaskBalanceApi,
} from '#/api';
import { calculateDuration } from '#/utils/commonUtil.ts';
import BaseInfo from '../intelligentAllocation/baseInfo.vue';
import AccountsList from '../intelligentAllocation/accountsList.vue';
import JobSystem from '../intelligentAllocation/jobSystem.vue';
import LinkSystemList from '../intelligentAllocation/linkSystemList.vue';

defineOptions({
  name: 'JobDetail',
});
const orderNo = defineModel('orderNo');
const orderId = defineModel('orderId');
const emit = defineEmits(['closeDetailPage']);

const baseInfoRef = ref();
const accountsListRef = ref();
const jobSystemRef = ref();
const linkSystemListRef = ref();
const detailData = ref({
  taskLedgerList: [],
  taskRelateOSList: [],
  taskRiskControlList: [],
  taskWorkOSList: [],
});
const editTimeDialogData = ref({
  visible: false,
  timeData: {
    // 调整后数据
    adjustStartTime: '',
    adjustEndTime: '',
    adjustHaltStartTime: '',
    adjustHaltEndTime: '',
    adjustStopStatTime: '',
    adjustStopEndTime: '',
  },
});

// 确认保存弹窗
const confirmSave = () => {
  ElMessageBox.confirm('确定要保存调整后时间吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      // 保存
      try {
        let params = {
          id: orderId.value,
          ...editTimeDialogData.value.timeData,
          startTime: detailData.value.startTime,
          endTime: detailData.value.endTime,
          haltEndTime: detailData.value.haltEndTime,
          haltStartTime: detailData.value.haltStartTime,
          stopEndTime: detailData.value.stopEndTime,
          stopStatTime: detailData.value.stopStatTime,
        };
        let result = await saveBatchAdjustApi(params);
        if (result) {
          ElMessage.success('保存成功');
          editTimeDialogData.value.visible = false;
        } else {
          return;
        }
        if (accountsListRef.value) {
          const newTaskLedgerList =
            accountsListRef.value.formData.taskLedgerList.map((item) => {
              return {
                ...item,
                timeEnable: false,
                statTime: editTimeDialogData.value.timeData.adjustStartTime,
                endTime: editTimeDialogData.value.timeData.adjustEndTime,
                haltStartTime:
                  editTimeDialogData.value.timeData.adjustHaltStartTime,
                haltEndTime:
                  editTimeDialogData.value.timeData.adjustHaltEndTime,
              };
            });
          accountsListRef.value.formData.taskLedgerList = newTaskLedgerList;
          accountsListRef.value.formData.startTime =
            editTimeDialogData.value.timeData.adjustStartTime;
          accountsListRef.value.formData.endTime =
            editTimeDialogData.value.timeData.adjustEndTime;
          accountsListRef.value.formData.haltStartTime =
            editTimeDialogData.value.timeData.adjustHaltStartTime;
          accountsListRef.value.formData.haltEndTime =
            editTimeDialogData.value.timeData.adjustHaltEndTime;
        }
        if (jobSystemRef.value) {
          const newTaskWorkOSList =
            jobSystemRef.value.formData.taskWorkOSList.map((item) => {
              return {
                ...item,
                timeEnable: false,
                stopStatTime:
                  editTimeDialogData.value.timeData.adjustStopStatTime,
                stopEndTime:
                  editTimeDialogData.value.timeData.adjustStopEndTime,
              };
            });
          jobSystemRef.value.formData.taskWorkOSList = newTaskWorkOSList;
          jobSystemRef.value.formData.stopStatTime =
            editTimeDialogData.value.timeData.adjustStopStatTime;
          jobSystemRef.value.formData.stopEndTime =
            editTimeDialogData.value.timeData.adjustStopEndTime;
        }
      } catch {}
    })
    .catch(() => {});
};

const publishTaskBalance = () => {
  ElMessageBox.confirm('确定要发布作业吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        let result = await publishTaskBalanceApi([orderId.value]);
        if (result) {
          ElMessage.success('发布成功');
        }
      } catch {}
    })
    .catch(() => {});
};

/**
 * 获取作业详情
 */
const getTaskDetail = async () => {
  if (!orderId.value) {
    return;
  }
  try {
    detailData.value = await getTaskDetailApi(orderId.value);
  } catch {}
};

const activeNames = ref(['first', 'second', 'third', 'fourth']);
const first = ref();
const second = ref();
const third = ref();
const fourth = ref();
const scrollToPosition = (position) => {
  activeNames.value.push(position);
  nextTick(() => {
    setTimeout(() => {
      if (position == 'first') {
        console.log('first.value=', first.value.$el);
        first.value.$el.scrollIntoView({ behavior: 'smooth' });
      } else if (position == 'second') {
        second.value.$el.scrollIntoView({ behavior: 'smooth' });
      } else if (position == 'third') {
        third.value.$el.scrollIntoView({ behavior: 'smooth' });
      } else if (position == 'fourth') {
        fourth.value.$el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  });
};

onMounted(() => {
  getTaskDetail();
});
</script>

<style scoped lang="less">
.child-page {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
  background: #fff;
}
.el-container {
  height: 100%;
}
.el-aside {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 200px;
  padding-left: 50px;
  border-right: 1px solid #ccc;
}

.link-con {
  margin-top: 20px;
}
.title {
  margin-bottom: 8px;
  text-align: center;
  font-weight: bold;
}

.sub-title {
  display: flex;
  color: #333;
  font-size: 16px;
  font-weight: 900;

  .line-tag {
    margin-right: 8px;
    width: 5px;
    height: 20px;
    background-color: #3296fa;
  }
}
.line-h {
  margin: 15px 20px;
  border-bottom: 1px solid #ccc;
}

.primary {
  color: hsl(var(--primary));
}
</style>
