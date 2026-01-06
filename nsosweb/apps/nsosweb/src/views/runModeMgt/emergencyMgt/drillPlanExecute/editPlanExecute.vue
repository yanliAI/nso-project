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
          <el-anchor-link href="#part1" title="应急演练执行"></el-anchor-link>
          <el-anchor-link href="#part2" title="演练总结"></el-anchor-link>
        </el-anchor>
      </div>
      <div class="ma-tabm">
        <div class="head-d">
          <div class="mt-2 text-center text-lg font-bold">应急演练执行</div>
          <div class="flex h-6 items-center">
            <div>编号：<span class="primary font-bold">jfsifjsif232</span></div>
            <div class="primary flex items-center" style="padding-left: 30%">
              <DataAnalysis class="h-3.5 w-3.5"></DataAnalysis>
              <span>应急演练执行</span>
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
                  <div class="ml-1 font-bold">应急演练执行</div>
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
                      <el-form-item label="应急演练时间：" prop="drillTime">
                        <el-date-picker
                          v-model="addFormData.drillTime"
                          type="date"
                          placeholder="请选择应急演练时间"
                          format="YYYY-MM-DD"
                          value-format="YYYY-MM-DD"
                          style="width: 100%"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="负责人：" prop="leader">
                        <el-select
                          v-model="addFormData.leader"
                          placeholder="请选择"
                          filterable
                          disabled
                        >
                          <el-option
                            v-for="item in leaderList"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="50">
                    <el-col :span="12">
                      <el-form-item label="附件：">
                        <el-upload
                          ref="uploadRef"
                          :file-list="addFormData.files"
                          action="#"
                          :auto-upload="false"
                          :on-change="handleFileChange"
                          :on-remove="handleRemove"
                          :before-upload="beforeUpload"
                          :http-request="uploadFile"
                          style="width: 50%"
                        >
                          <template #trigger>
                            <el-button type="primary" link>
                              <el-icon> <Plus /> </el-icon>附件
                            </el-button>
                          </template>
                        </el-upload>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-form-item label="演练计划：">
                    <el-table
                      ref="sceneTableRef"
                      border
                      stripe
                      :data="tableData"
                      style="width: 100%"
                      max-height="400"
                    >
                      <el-table-column
                        type="index"
                        align="center"
                        label="序号"
                        width="80"
                      />
                      <el-table-column
                        prop="drillScene"
                        label="演练场景"
                        align="center"
                      >
                      </el-table-column>
                      <el-table-column
                        prop="leader"
                        label="负责人"
                        align="center"
                      >
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
                        <template #default="{ row }">
                          <el-select
                            v-model="row.status"
                            placeholder="请选择"
                            filterable
                          >
                            <el-option label="已完成" value="1" />
                            <el-option label="未完成" value="2" />
                          </el-select>
                        </template>
                      </el-table-column>

                      <el-table-column label="操作" align="center">
                        <template #default="scope">
                          <el-button
                            type="warning"
                            link
                            @click="applyExtension(scope.row)"
                            >申请延期</el-button
                          >
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-form-item>
                  <div class="flex" style="justify-content: right">
                    <el-button type="primary" @click="updateStatus"
                      >确认</el-button
                    >
                  </div>
                </el-form>
              </div>
            </el-collapse-item>
            <el-collapse-item name="2">
              <template #title>
                <div class="primary flex items-center">
                  <Expand class="h-3.5 w-3.5"></Expand>
                  <div class="ml-1 font-bold">演练总结</div>
                </div>
              </template>
              <div id="part2" class="part-b">
                <el-form
                  label-width="auto"
                  label-position="right"
                  style="padding: 16px 20px 0"
                >
                  <el-form-item label="上传演练汇总报告：">
                    <el-upload
                      ref="uploadRef"
                      :file-list="reportfiles"
                      action="#"
                      :auto-upload="false"
                      :on-change="handleFileChange"
                      :http-request="uploadFile"
                      style="width: 50%"
                      :limit="1"
                    >
                      <template #trigger>
                        <el-button type="primary" link>
                          <el-icon> <Plus /> </el-icon>附件
                        </el-button>
                      </template>
                    </el-upload>
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

    <!-- 申请延期弹框 -->
    <el-dialog v-model="dialogData.visible" title="申请延期" width="500">
      <el-form label-position="right" label-width="auto">
        <el-form-item label="延期时间：" prop="drillTime">
          <el-date-picker
            v-model="dialogData.delayTime"
            type="datetime"
            placeholder="请选择延期时间"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="申请原因：" prop="applyReason">
          <el-input v-model="dialogData.applyReason"> </el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogData.visible = false">取消</el-button>
          <el-button type="primary" @click="applyExtensionSure">
            确认
          </el-button>
        </div>
      </template>
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
  ElTag,
  ElDialog,
  ElMessage,
  ElMessageBox,
} from 'element-plus';
import {
  DataAnalysis,
  Back,
  Plus,
  Expand,
  Monitor,
  DocumentChecked,
  Close,
  RefreshLeft,
} from '@element-plus/icons-vue';
import type {
  UploadInstance,
  UploadProps,
  UploadRawFile,
  UploadUserFile,
} from 'element-plus';
import { ref, reactive, computed, onMounted } from 'vue';
import { requestClient } from '#/api/request';

defineOptions({
  name: 'EditPlanExecute',
});

const containerRef = ref<HTMLElement | null>(null);
const activeNames = ref(['1', '2']);

const tabName = defineModel('tabName');
const emit = defineEmits(['removeTab']);

const addForm = ref();
const uploadRef = ref<UploadInstance>();
// 附件列表
const reportfiles = ref<UploadUserFile[]>([]);
// 新增预案表单数据
const addFormData = reactive({
  drillName: '',
  drillTime: '',
  leader: '',
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
  leader: [{ required: true, message: '请选择负责人' }],
  drillTime: [{ required: true, message: '请选择应急演练时间' }],
});

const leaderList = reactive([
  { name: '张三', value: '张三' },
  { name: '张三', value: '张三' },
  { name: '张三', value: '张三' },
]);

const tableData = ref([
  {
    id: '1',
    drillScene: 'DDoS事件',
    leader: '张明明',
    planTime: '2025-01-02 12:30 - 2025-01-03 12:30',
    status: '1',
  },
  {
    id: '2',
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

const dialogData = reactive({
  visible: false,
  applyId: '',
  delayTime: '',
  applyReason: '',
});

/**
 * 申请延期
 */
const applyExtension = (row) => {
  dialogData.visible = true;
  dialogData.applyId = row.id;
};

const applyExtensionSure = () => {
  if (!dialogData.delayTime) {
    ElMessage.error('请选择延期时间');
    return;
  }
  if (!dialogData.applyReason) {
    ElMessage.error('请输入申请原因');
    return;
  }
};

/**
 * 批量更新状态
 */
const updateStatus = () => {
  let mapData = tableData.value.map((item) => {
    return {
      id: item.id,
      status: item.status,
    };
  });
};

const handleClick = (e: MouseEvent) => {
  e.preventDefault();
};

const handleFileChange = (uploadFile, uploadFiles) => {
  console.log('uploadFile==', uploadFile);
  console.log('uploadFiles==', uploadFiles);
  addFormData.files = uploadFiles;
  console.log('files==', addFormData.files.length);
};

// 文件上传之前判断
const beforeUpload: UploadProps['beforeUpload'] = (file: UploadRawFile) => {
  console.log('beforeUpload file=', file);
  const isLimit = file.size < 10 * 1024 * 1024;
  if (!isLimit) {
    ElMessage.error(`上传文件大小不能超过10MB!`);
    return false;
  }
};

// 删除上传文件
const handleRemove = (file) => {
  console.log('onRemoveFil==', file);
  const index = addFormData.files.map((f) => f.name).indexOf(file.name);
  if (index > -1) {
    addFormData.files.splice(index, 1);
  }
  console.log('files==', addFormData.files);
};

// 上传文件
const uploadFile = async (options) => {};

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
