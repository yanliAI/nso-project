<template>
  <div class="main-con">
    <h1 class="title">{{ detailInfo.systemName }}</h1>

    <el-form :inline="true">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="并网流程编号：" style="margin-left: 150px">
            <el-text type="primary">{{ detailInfo.id }}</el-text>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="IOS系统CMDB系统编码：">
            <span>{{ detailInfo.systemCode }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="并网流程环节：">
            <el-text type="primary">{{ stageMap[detailInfo.stageId] }}</el-text>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-card>
      <template #header>
        <div class="card-header">
          <span>命名及编号</span>
        </div>
      </template>
      <el-button type="danger"
        >未通过：{{ detailInfo.namingFailedCount }}</el-button
      >
      <el-divider></el-divider>
      <div v-for="(item, index) in detailInfo.namingRepetitions" :key="index">
        <div class="flex items-center">
          <span>命名重复性：</span>

          <span :style="getRowStyle(item.similarityPercent)">
            {{ item.similarityPercent }}</span
          >
          <span>{{ item.systemName }}</span>
        </div>
        <el-divider></el-divider>
      </div>
    </el-card>

    <el-card>
      <template #header>
        <div class="card-header">
          <span>附件名称与表格文档名称</span>
        </div>
      </template>
      <el-button type="danger"
        >未通过：{{ detailInfo.attachmentNameCount }}</el-button
      >
      <el-divider></el-divider>
      <div v-for="(item, index) in detailInfo.attachmentName" :key="index">
        <div class="flex items-center">
          <div class="flex flex-1">
            <span>异常名称：</span>
            <span style="color: #3296fa"> {{ item.exceptionName }}</span>
          </div>
          <div class="flex flex-1">
            <span>规范名称：</span>
            <span style="color: #3296fa">{{ item.abnormalName }}</span>
          </div>
        </div>
        <el-divider></el-divider>
      </div>
    </el-card>

    <el-card>
      <template #header>
        <div class="card-header">
          <span>附件及内容</span>
        </div>
      </template>
      <el-button type="danger"
        >未通过：{{ detailInfo.attachmentFailedCount }}</el-button
      >
      <el-divider></el-divider>
      <div v-for="(item, index) in detailInfo.attachmentIssues" :key="index">
        <div class="flex items-center">
          <span>{{
            item.missingAttachments?.length > 0
              ? '附件缺失：'
              : '附件内容规范：'
          }}</span>
          <template v-if="item.missingAttachments?.length > 0">
            <span v-for="missFile in item.missingAttachments">
              {{ missFile }}</span
            >
          </template>
          <div v-else class="flex">
            <span style="color: #3296fa">{{ item.documentName }}</span>
            <ul class="custom-circle-list flex">
              <li
                v-for="(section, i) in item.sectionAnomalies"
                class="ml-8"
                :data-count="i + 1"
                :key="i"
              >
                <span>章节异常：{{ section }}</span>
              </li>
            </ul>
          </div>
        </div>
        <el-divider></el-divider>
      </div>
    </el-card>

    <el-card>
      <template #header>
        <div class="card-header">
          <span>台账信息对比</span>
        </div>
      </template>
      <el-button type="danger"
        >未通过：{{ detailInfo.accountComparisonFailedCount }}</el-button
      >
      <el-divider></el-divider>
      <div v-for="(item, index) in detailInfo.accountComparisons" :key="index">
        <div class="flex items-center">
          <span style="min-width: 180px" class="ml-10">{{
            item.comparisonItem
          }}</span>
          <span style="min-width: 180px" class="ml-10 flex-1"
            >申请信息：{{ item.applicationInfo }}</span
          >
          <span style="min-width: 180px" class="ml-10 flex-1"
            >台账信息：{{ item.accountInfo }}</span
          >
        </div>
        <el-divider></el-divider>
      </div>
    </el-card>

    <div class="flex" style="justify-content: center">
      <el-button type="primary" @click="exportData">结果导出</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  ElTable,
  ElTableColumn,
  ElRow,
  ElCol,
  ElFormItem,
  ElForm,
  ElCard,
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
  ElDivider,
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
import { getGridConnectDetailApi } from '#/api';
import { downloadFile } from '#/utils/download.ts';

defineOptions({
  name: 'GridConnectDetailInfo',
});
const orderId = defineModel('orderId');
const detailInfo = ref({});

const stageMap = {
  '1': '并网前期(规划立项)阶段',
  '2': '并网前期(需求设计)阶段',
  '3': '并网前期(详细设计)阶段',
  '4': '并网准备阶段',
  '5': '并网启动阶段',
  '6': '并网前期(设计)阶段',
};

const getDetailData = async () => {
  try {
    let result = await getGridConnectDetailApi(orderId.value);
    detailInfo.value = result;
  } catch (error) {
    console.log('并网审查详情获取失败：', error);
  }
};

const exportData = async () => {
  try {
    await downloadFile(
      import.meta.env.VITE_NSOSFS +
        `/gridConnect/detailExport/${orderId.value}`,
      {},
      '并网审查详情.xlsx',
      'get',
    );
  } catch {}
};

const getRowStyle = (similarityPercent) => {
  const baseLightness = 38; // #c00000 的原始亮度
  const darkness = 40 * (1 - parseFloat(similarityPercent) / 100);
  return {
    margin: '0 20px',
    padding: '10px 40px',
    backgroundColor: `hsl(0, 100%, ${baseLightness + darkness}%)`,
    color: '#fff',
    borderRadius: '5px',
  };
};

onMounted(() => {
  getDetailData();
});
</script>

<style scoped lang="less">
.main-con {
  max-height: calc(100vh - 120px);
  padding: 0 20px;
  overflow: scroll;

  // scrollbar-width: none; /* Firefox隐藏滚动条 */
  // -ms-overflow-style: none; /* IE和Edge隐藏滚动条 */
  // /* Chrome和Safari隐藏滚动条 */
  // &::-webkit-scrollbar {
  //   display: none;
  // }
}
:deep(.el-card__header) {
  background: linear-gradient(to bottom, #02a7f0, #7fd3f8);
  font-weight: bold;
}
:deep(.el-card) {
  margin-bottom: 20px;
  // width: calc(100% - var(--scrollbar-width));
  // --scrollbar-width: 17px;
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

.custom-circle-list li {
  position: relative;
  padding-left: 1.5em;
}

.custom-circle-list li::before {
  content: attr(data-count);
  position: absolute;
  left: 0;
  width: 1.5em;
  height: 1.5em;
  border: 1px solid #ccc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8em;
}
</style>
