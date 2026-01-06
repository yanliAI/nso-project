<template>
  <Page auto-content-height>
    <div class="main-dg">
      <div class="gbzjd">
        <el-anchor
          class="jknb"
          :offset="90"
          type="default"
          :container="containerRef"
          direction="vertical"
          @click="handleClick"
        >
          <el-anchor-link href="#part1" title="基本信息"></el-anchor-link>
          <el-anchor-link href="#part2" title="应急处置卡片"></el-anchor-link>
        </el-anchor>
      </div>
      <div class="ma-tabm">
        <div class="head-d">
          <div class="mt-2 text-center text-lg font-bold">应急预案管理</div>
          <div class="flex h-6 items-center">
            <div>编号：<span class="primary font-bold">jfsifjsif232</span></div>
            <div class="primary flex items-center" style="padding-left: 30%">
              <DataAnalysis class="h-3.5 w-3.5"></DataAnalysis>
              <span>应急预案管理</span>
            </div>
            <div class="flex-1 pr-2 text-right">
              <el-button
                type="info"
                class="ml-4"
                :icon="Back"
                size="small"
                @click="closeTab"
                >返回</el-button
              >
            </div>
          </div>
        </div>

        <div ref="containerRef" class="btm-d">
          <el-collapse v-model="activeNames">
            <el-collapse-item name="1">
              <template #title>
                <div class="primary flex items-center">
                  <Expand class="h-3.5 w-3.5"></Expand>
                  <div class="ml-1 font-bold">基本信息</div>
                </div>
              </template>
              <div id="part1" class="part-b">
                <el-form
                  ref="addForm"
                  label-width="auto"
                  :model="addFormData"
                  :rules="addFormRules"
                  label-position="right"
                  style="padding: 16px 20px 0"
                >
                  <el-row :gutter="50">
                    <el-col :span="8">
                      <el-form-item label="系统名称：" prop="sysName">
                        <el-select v-model="addFormData.sysName" disabled>
                        </el-select>
                      </el-form-item>
                    </el-col>

                    <el-col :span="8">
                      <el-form-item label="应急预案名称：" prop="planName">
                        <el-input
                          v-model="addFormData.planName"
                          placeholder="请输入应急预案名称"
                          disabled
                        />
                      </el-form-item>
                    </el-col>

                    <el-col :span="8">
                      <el-form-item label="应急预案版本号：" prop="versionName">
                        <el-input
                          v-model="addFormData.versionName"
                          placeholder="请输入应急预案版本号"
                          disabled
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="50">
                    <el-col :span="8">
                      <el-form-item label="预案类型：" prop="planType">
                        <el-select
                          v-model="addFormData.planType"
                          placeholder="请选择预案类型"
                          disabled
                        >
                        </el-select>
                      </el-form-item>
                    </el-col>

                    <el-col :span="8">
                      <el-form-item label="颁布日期：" prop="enactmentDate">
                        <el-date-picker
                          v-model="addFormData.enactmentDate"
                          type="date"
                          placeholder="请选择颁布日期"
                          format="YYYY-MM-DD"
                          value-format="YYYY-MM-DD"
                          style="width: 100%"
                          disabled
                        />
                      </el-form-item>
                    </el-col>

                    <el-col :span="8">
                      <el-form-item label="修订日期：" prop="updateDate">
                        <el-date-picker
                          v-model="addFormData.updateDate"
                          type="date"
                          placeholder="请选择修订日期"
                          format="YYYY-MM-DD"
                          value-format="YYYY-MM-DD"
                          style="width: 100%"
                          disabled
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row :gutter="50">
                    <el-col :span="8">
                      <el-form-item label="设备主人：" prop="deviceOwner">
                        <el-select
                          v-model="addFormData.deviceOwner"
                          placeholder="请选择设备主人"
                          disabled
                        >
                        </el-select>
                      </el-form-item>
                    </el-col>

                    <el-col :span="16">
                      <el-form-item label="补充信息：" prop="remark">
                        <el-input
                          v-model="addFormData.remark"
                          placeholder="请输入补充信息"
                          disabled
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
            </el-collapse-item>
            <el-collapse-item name="2">
              <template #title>
                <div class="primary flex items-center">
                  <Expand class="h-3.5 w-3.5"></Expand>
                  <div class="ml-1 font-bold">应急处置卡片</div>
                </div>
              </template>
              <div id="part2" class="part-b">
                <el-table border stripe :data="tableData" style="width: 100%">
                  <el-table-column type="index" align="center" />
                  <el-table-column
                    prop="cardName"
                    label="卡片名称"
                    align="center"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="riskType"
                    label="风险类型"
                    align="center"
                  >
                  </el-table-column>
                  <el-table-column prop="leader" label="负责人" align="center">
                  </el-table-column>
                  <el-table-column
                    prop="attachments"
                    label="附件"
                    align="center"
                  >
                    <!-- <template #default="scope">
                      
                    </template> -->
                  </el-table-column>
                  <el-table-column label="操作" align="center">
                    <template #default="scope">
                      <el-button
                        type="primary"
                        link
                        @click="lookDetail(scope.row)"
                        >查看详情</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-collapse-item>
          </el-collapse>
          <div style="height: 150px"></div>
        </div>
      </div>
      <div class="gbzjd"></div>
    </div>

    <!-- 调整弹框 -->
    <el-dialog v-model="dialogVisible" title="应急处置卡片详情" width="1400">
      <el-table border stripe :data="dialogTableData" style="width: 100%">
        <el-table-column type="index" align="center" label="序号" width="80" />
        <el-table-column prop="processSteps" label="流程步骤" align="center">
        </el-table-column>
        <el-table-column
          prop="disposalMeasure"
          label="系统处置措施"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="leader" label="负责人" align="center">
        </el-table-column>
        <el-table-column prop="assets" label="资源" align="center">
        </el-table-column>
        <el-table-column prop="attachments" label="附件" align="center">
          <!-- <template #default="scope">
                      
                    </template> -->
        </el-table-column>
      </el-table>
    </el-dialog>
  </Page>
</template>

<script setup lang="ts">
import { Page } from '@vben/common-ui';
import {
  ElAnchor,
  ElAnchorLink,
  ElCollapse,
  ElCollapseItem,
  ElFormItem,
  ElForm,
  ElTable,
  ElTableColumn,
  ElInput,
  ElButton,
  ElSelect,
  ElOption,
  ElRow,
  ElCol,
  ElDialog,
  ElMessage,
  ElMessageBox,
} from 'element-plus';
import {
  DataAnalysis,
  Back,
  CaretRight,
  Expand,
  Monitor,
  DocumentChecked,
  Close,
  RefreshLeft,
} from '@element-plus/icons-vue';
import { ref, reactive, computed, onMounted } from 'vue';
import { requestClient } from '#/api/request';

defineOptions({
  name: 'PlanDetail',
});

const containerRef = ref<HTMLElement | null>(null);
const activeNames = ref(['1', '2']);

const tabName = defineModel('tabName');
const emit = defineEmits(['removeTab']);

const addForm = ref();
// 新增预案表单数据
const addFormData = reactive({
  sysName: '电网管理平台一',
  planName: '应急预案xxx',
  versionName: 'V2.0.2',
  planType: '应急',
  enactmentDate: '2025-01-23',
  updateDate: '2025-01-27',
  deviceOwner: '张明明',
  remark: '无',
});

const addFormRules = reactive({
  sysName: [{ required: true, message: '请选择系统名称' }],
  planName: [{ required: true, message: '请输入应急预案名称' }],
  versionName: [{ required: true, message: '请输入应急预案版本号' }],
  planType: [{ required: true, message: '请选择预案类型' }],
  deviceOwner: [{ required: true, message: '请选择设备主人' }],
});

const tableData = ref([
  {
    cardName: 'TPM-0riskType0-20240828-00642',
    riskType: '网络安全',
    leader: '张明明',
    attachments: 'xxx.png',
  },
  {
    cardName: 'TPM-0riskType0-20240828-00642',
    riskType: '网络安全',
    leader: '张明明',
    attachments: 'xxx.png',
  },
]);

const dialogTableData = ref([
  {
    processSteps: '监测及事件征兆',
    disposalMeasure:
      '通过互联网安全监控系统、内容管理系统操作日志等，发现服务器用户异常登录或出现新用户，应用目录文件被改。',
    leader: '张明明',
    assets: '堡垒机账户xx',
    attachments: '操作图例xx',
  },
  {
    processSteps: '监测及事件征兆',
    disposalMeasure:
      '通过互联网安全监控系统、内容管理系统操作日志等，发现服务器用户异常登录或出现新用户，应用目录文件被改。',
    leader: '张明明',
    assets: '堡垒机账户xx',
    attachments: '操作图例xx',
  },
]);

const dialogVisible = ref(false);
const lookDetail = (row) => {
  dialogVisible.value = true;
};

const handleClick = (e: MouseEvent) => {
  e.preventDefault();
};

// 关闭标签页
const closeTab = () => {
  emit('removeTab', tabName.value);
};
</script>

<style lang="less" scoped>
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

.primary {
  color: hsl(var(--primary));
}

.grey {
  color: #8e8e93;
}

.main-dg {
  display: flex;
  width: 100%;
  height: 100%;
  background: #fff;
}

.ma-tabm {
  flex: 1;
  height: 100%;
  margin: auto;
  overflow: hidden;
  font-size: 12px;
  background: #fff;
}

.gbzjd {
  width: 20%;
}

.jknb {
  width: 200px;
  margin: auto;
  margin-top: 100px;
}

.head-d {
  width: 100%;
  height: 52px;
}

.btm-d {
  width: 100%;
  height: calc(100% - 62px);
  padding-top: 10px;
  overflow: auto;
}

.part-d {
  height: 300px;
}

.part-b {
  border-top: 1px solid #c4dbf5;
}
</style>
