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
          <el-anchor-link
            href="#part1"
            title="应急演练任务管理"
          ></el-anchor-link>
          <el-anchor-link href="#part2" title="演练计划查看"></el-anchor-link>
          <el-anchor-link href="#part3" title="演练总结"></el-anchor-link>
        </el-anchor>
      </div>
      <div class="ma-tabm">
        <div class="head-d">
          <div class="mt-2 text-center text-lg font-bold">应急演练任务管理</div>
          <div class="flex h-6 items-center">
            <div>编号：<span class="primary font-bold">jfsifjsif232</span></div>
            <div class="primary flex items-center" style="padding-left: 30%">
              <DataAnalysis class="h-3.5 w-3.5"></DataAnalysis>
              <span>应急演练任务管理</span>
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
                  <div class="ml-1 font-bold">应急演练任务管理</div>
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
                      <el-form-item label="演练名称：" prop="drillName">
                        <el-input v-model="addFormData.drillName" disabled>
                        </el-input>
                      </el-form-item>
                    </el-col>

                    <el-col :span="8">
                      <el-form-item label="演练目的：" prop="drillPurpose">
                        <el-input v-model="addFormData.drillPurpose" disabled />
                      </el-form-item>
                    </el-col>

                    <el-col :span="8">
                      <el-form-item label="演练形式：" prop="drillForm">
                        <el-select
                          v-model="addFormData.drillForm"
                          placeholder="请选择演练形式"
                          disabled
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="50">
                    <el-col :span="8">
                      <el-form-item label="风险类型：" prop="riskType">
                        <el-select
                          v-model="addFormData.riskType"
                          placeholder="请选择风险类型"
                          disabled
                        >
                        </el-select>
                      </el-form-item>
                    </el-col>

                    <el-col :span="8">
                      <el-form-item label="应急演练时间：" prop="drillTime">
                        <el-date-picker
                          v-model="addFormData.drillTime"
                          type="date"
                          placeholder="请选择应急演练时间"
                          format="YYYY-MM-DD"
                          value-format="YYYY-MM-DD"
                          style="width: 100%"
                          disabled
                        />
                      </el-form-item>
                    </el-col>

                    <el-col :span="8">
                      <el-form-item label="演练范围" prop="drillRange">
                        <el-input v-model="addFormData.drillRange" disabled />
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row :gutter="50">
                    <el-col :span="8">
                      <el-form-item label="演练内容：" prop="drillContent">
                        <el-input v-model="addFormData.drillContent" disabled />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="50">
                    <el-col :span="12">
                      <el-form-item label="附件：">
                        <div
                          v-for="item in addFormData.files"
                          :key="item.id"
                          style="width: 100%"
                        >
                          <el-button type="primary" link>{{
                            item.name
                          }}</el-button>
                        </div>
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
                  <div class="ml-1 font-bold">演练计划查看</div>
                </div>
              </template>
              <div id="part2" class="part-b">
                <el-table border stripe :data="tableData" style="width: 100%">
                  <el-table-column type="index" align="center" />
                  <el-table-column
                    prop="sysName"
                    label="演练系统"
                    align="center"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="drillScene"
                    label="演练场景"
                    align="center"
                  >
                  </el-table-column>
                  <el-table-column prop="leader" label="负责人" align="center">
                  </el-table-column>
                  <el-table-column
                    prop="planTime"
                    label="计划时间"
                    align="center"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="status"
                    label="完成状态"
                    align="center"
                  >
                    <template #default="scope">
                      <el-tag
                        v-if="scope.row.status == 1"
                        type="success"
                        size="large"
                        >已完成
                      </el-tag>
                      <el-tag
                        v-if="scope.row.status == 2"
                        type="danger"
                        size="large"
                        >未完成
                      </el-tag>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-collapse-item>

            <el-collapse-item name="3">
              <template #title>
                <div class="primary flex items-center">
                  <Expand class="h-3.5 w-3.5"></Expand>
                  <div class="ml-1 font-bold">演练总结</div>
                </div>
              </template>
              <div id="part3" class="part-b">
                <el-form
                  label-width="auto"
                  label-position="right"
                  style="padding: 16px 20px 0"
                >
                  <el-form-item label="演练总结报告：">
                    <div style="width: 100%">
                      <el-button type="primary" link>{{
                        reportFile.name
                      }}</el-button>
                    </div>
                  </el-form-item>
                </el-form>
              </div>
            </el-collapse-item>
          </el-collapse>
          <div style="height: 150px"></div>
        </div>
      </div>
      <div class="gbzjd"></div>
    </div>
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
  ElTag,
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
const activeNames = ref(['1', '2', '3']);

const tabName = defineModel('tabName');
const emit = defineEmits(['removeTab']);

const addForm = ref();
// 新增预案表单数据
const addFormData = reactive({
  drillName: '',
  drillForm: '',
  riskType: '',
  drillPurpose: '',
  drillContent: '',
  drillTime: '',
  drillRange: '',
  files: [
    {
      name: '附件一.png',
      id: '111',
    },
    {
      name: '附件二.docx',
      id: '222',
    },
  ],
});

const addFormRules = reactive({
  drillName: [{ required: true, message: '请输入演练名称' }],
  drillForm: [{ required: true, message: '请选择演练形式' }],
  riskType: [{ required: true, message: '请选择风险类型' }],
  drillTime: [{ required: true, message: '请选择应急演练时间' }],
});

const tableData = ref([
  {
    sysName: '电网管理平台',
    drillScene: 'DDoS事件',
    leader: '张明明',
    planTime: '2025-01-02 12:30 - 2025-01-03 12:30',
    status: '1',
  },
  {
    sysName: '电网管理平台',
    drillScene: 'DDoS事件',
    leader: '张明明',
    planTime: '2025-01-02 12:30 - 2025-01-03 12:30',
    status: '2',
  },
]);

const reportFile = reactive({
  name: 'xxx应急演练汇总报告.docx',
  id: '123',
});

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
