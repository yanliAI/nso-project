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
      </el-aside>
      <el-container>
        <el-header>
          <h1 class="title">作业详细</h1>

          <el-form :inline="true">
            <el-row :gutter="20">
              <el-col :span="18">
                <el-form-item label="工单编号:" style="margin-left: 150px">
                  <el-text type="primary">{{ localOrderNo }}</el-text>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-button
                    type="primary"
                    :icon="Operation"
                    @click="dialogVisible = true"
                    >保存</el-button
                  >
                  <el-button type="primary" :icon="Monitor">发送云盾</el-button>
                  <el-button type="info" :icon="Back" @click="closeDetailPage()"
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
              <BaseInfo />
            </el-collapse-item>

            <el-collapse-item name="second" ref="second">
              <template #title>
                <div class="primary flex items-center">
                  <Monitor class="h-3.5 w-3.5" />
                  <div class="ml-1 font-bold">作业台账清单</div>
                </div>
              </template>
              <AccountsList />
            </el-collapse-item>
          </el-collapse>
        </el-main>
      </el-container>
    </el-container>

    <!-- 调整弹框 -->
    <el-dialog v-model="dialogVisible" title="调整" width="1400">
      <el-form
        :inline="true"
        style="display: flex; flex-direction: row-reverse"
      >
        <el-form-item>
          <el-button @click="dialogVisible = false">取消</el-button>
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
        :model="dialogData"
        label-position="right"
        label-width="auto"
        style="padding: 0 20px"
      >
        <el-row :gutter="100">
          <el-col :span="8">
            <el-form-item label="作业计划开始时间：">
              <el-date-picker
                v-model="dialogData.preWorkStartTime"
                type="dateTime"
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
                v-model="dialogData.preWorkEndTime"
                type="dateTime"
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
              <span style="color: #ff0000">{{
                dialogData.preWorkTotalTime
              }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="100">
          <el-col :span="8">
            <el-form-item label="停机开始时间：">
              <el-date-picker
                v-model="dialogData.downStartTime"
                type="dateTime"
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
                v-model="dialogData.downEndTime"
                type="dateTime"
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
              <span style="color: #ff0000">{{ dialogData.downTotalTime }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="100">
          <el-col :span="8">
            <el-form-item label="停服开始时间：">
              <el-date-picker
                v-model="dialogData.stopStartTime"
                type="dateTime"
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
                v-model="dialogData.stopEndTime"
                type="dateTime"
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
              <span style="color: #ff0000">{{ dialogData.stopTotalTime }}</span>
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
        :model="dialogData"
        label-position="right"
        label-width="auto"
        style="padding: 0 20px"
      >
        <el-row :gutter="100">
          <el-col :span="8">
            <el-form-item label="作业计划开始时间：">
              <el-date-picker
                v-model="dialogData.preWorkStartTimeLast"
                type="dateTime"
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
                v-model="dialogData.preWorkEndTimeLast"
                type="dateTime"
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
                dialogData.preWorkTotalTimeLast
              }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="100">
          <el-col :span="8">
            <el-form-item label="停机开始时间：">
              <el-date-picker
                v-model="dialogData.downStartTimeLast"
                type="dateTime"
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
                v-model="dialogData.downEndTimeLast"
                type="dateTime"
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
                dialogData.downTotalTimeLast
              }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="100">
          <el-col :span="8">
            <el-form-item label="停服开始时间：">
              <el-date-picker
                v-model="dialogData.stopStartTimeLast"
                type="dateTime"
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
                v-model="dialogData.stopEndTimeLast"
                type="dateTime"
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
                dialogData.stopTotalTimeLast
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
import { requestClient } from '#/api/request';
import BaseInfo from './baseInfo.vue';
import AccountsList from './accountsList.vue';

defineOptions({
  name: 'JobDetail',
});
interface Props {
  orderNo: string;
  closeDetailPage: Function;
}
const props = withDefaults(defineProps<Props>(), {
  orderNo: '',
  closeDetailPage: () => {},
});
console.log('props orderNo', props.orderNo);
const localOrderNo = ref(props.orderNo);
// 控制调整弹窗是否显示
const dialogVisible = ref(false);
// 弹窗数据
const dialogData = reactive({
  // 调整前数据
  preWorkStartTime: '2024-10-24 19:00',
  preWorkEndTime: '2024-10-26 19:00',
  preWorkTotalTime: '48小时0分钟',
  downStartTime: '2024-10-24 19:00',
  downEndTime: '2024-10-26 19:00',
  downTotalTime: '48小时0分钟',
  stopStartTime: '2024-10-24 19:00',
  stopEndTime: '2024-10-26 19:00',
  stopTotalTime: '48小时0分钟',
  // 调整后数据
  preWorkStartTimeLast: '2024-10-24 19:00',
  preWorkEndTimeLast: '2024-10-26 19:00',
  preWorkTotalTimeLast: '48小时0分钟',
  downStartTimeLast: '2024-10-24 19:00',
  downEndTimeLast: '2024-10-26 19:00',
  downTotalTimeLast: '48小时0分钟',
  stopStartTimeLast: '2024-10-24 19:00',
  stopEndTimeLast: '2024-10-26 19:00',
  stopTotalTimeLast: '48小时0分钟',
});
// 确认保存弹窗
const confirmSave = () => {
  ElMessageBox.confirm('确定要保存这些数据吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // 保存
    })
    .catch(() => {
      ElMessage.info('已取消保存');
    });
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
