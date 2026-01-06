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
          <h1 class="title">{{ !orderId ? '新增作业' : '作业详细' }}</h1>

          <el-form :inline="true">
            <el-row :gutter="20">
              <el-col :span="18">
                <el-form-item
                  label="工单编号:"
                  style="margin-left: 150px"
                  v-if="orderNo"
                >
                  <el-text type="primary">{{ orderNo }}</el-text>
                </el-form-item>
              </el-col>
              <el-col
                :span="6"
                style="display: flex; justify-content: flex-end"
              >
                <el-form-item>
                  <el-button
                    v-if="!disabled"
                    type="primary"
                    :icon="Operation"
                    @click="saveOrUpdateTask(0)"
                    >保存</el-button
                  >
                  <el-button
                    v-if="!disabled"
                    type="primary"
                    :icon="Monitor"
                    @click="sendToYunDun"
                    >发送云盾</el-button
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
                :disabled="disabled"
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
                :disabled="disabled"
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
                :disabled="disabled"
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
                :disabled="disabled"
              />
            </el-collapse-item>
          </el-collapse>
        </el-main>
      </el-container>
    </el-container>

    <!-- 审查结果弹框 -->
    <el-dialog v-model="dialogData.visible" title="审查结果" width="1100">
      <el-table border stripe :data="checkResultList">
        <el-table-column type="index" label="序号" align="center" width="100" />
        <el-table-column
          prop="checkItem"
          label="审查内容"
          align="center"
        ></el-table-column>
        <el-table-column prop="checkResult" label="审查结论" align="center">
          <template #default="scope">
            <span
              style="color: #ff0000"
              v-if="scope.row.checkResult == '不通过'"
              >不通过</span
            >
            <span v-else>通过</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="errorReason"
          label="审查结果"
          align="center"
        ></el-table-column>
      </el-table>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogData.visible = false">关闭</el-button>
        </div>
      </template>
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
  taskCheckExecuteApi,
  getTaskDetailApi,
  saveOrUpdateTaskApi,
  sendTaskToYunDunApi,
} from '#/api';
import BaseInfo from './baseInfo.vue';
import AccountsList from './accountsList.vue';
import JobSystem from './jobSystem.vue';
import LinkSystemList from './linkSystemList.vue';

defineOptions({
  name: 'IntelligentAllocationJobDetail',
});
const orderNo = defineModel('orderNo');
const orderId = defineModel('orderId');
const disabled = defineModel('disabled');
// 审查结果
const checkResultList = defineModel('checkResult');
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
const dialogData = ref({
  visible: false,
});

/**
 * 保存作业信息
 */
const saveOrUpdateTask = async (type) => {
  let valid = await baseInfoRef.value.validateForm();
  if (!valid) {
    ElMessage.warning('请输入必填项！');
    return;
  }
  let valid2 = await accountsListRef.value.validateForm();
  if (!valid2) {
    return;
  }
  let baseFormData = baseInfoRef.value.formData;
  let accountsListFormData = accountsListRef.value.formData;
  let jobSystemFormData = jobSystemRef.value.formData;
  let linkSystemListFormData = linkSystemListRef.value.formData;
  let params = { ...baseFormData };

  params.startTime = accountsListFormData.startTime;
  params.endTime = accountsListFormData.endTime;
  params.haltStartTime = accountsListFormData.haltStartTime;
  params.haltEndTime = accountsListFormData.haltEndTime;
  params.taskLedgerList = accountsListFormData.taskLedgerList;

  params.stopStatTime = jobSystemFormData.stopStatTime;
  params.stopEndTime = jobSystemFormData.stopEndTime;
  params.taskWorkOSList = jobSystemFormData.taskWorkOSList;
  params.systemName = [
    ...new Set(jobSystemFormData.taskWorkOSList.map((item) => item.systemName)),
  ].join(',');

  params.riskLevel = linkSystemListFormData.riskLevel;
  params.taskRiskControlList = linkSystemListFormData.taskRiskControlList;
  params.taskRelateOSList = linkSystemListFormData.taskRelateOSList;

  try {
    let result = await saveOrUpdateTaskApi(params);
    if (result) {
      if (type == 1) {
        result = await sendTaskToYunDunApi([orderId.value]);
        if (result) {
          ElMessage.success('发送成功');
          emit('closeDetailPage', { refresh: true });
        } else {
          ElMessage.error('发送失败');
        }
      } else {
        ElMessage.success('保存成功');
        emit('closeDetailPage', { refresh: true });
      }
    } else {
      if (type == 1) {
        ElMessage.success('发送失败');
      } else {
        ElMessage.success('保存失败');
      }
    }
  } catch {}
};

const sendToYunDun = async () => {
  let valid = await baseInfoRef.value.validateForm();
  let valid2 = await accountsListRef.value.validateForm();
  if (!valid || !valid2) {
    return;
  }
  ElMessageBox.confirm('确定要发送到云盾吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      saveOrUpdateTask(1);
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
