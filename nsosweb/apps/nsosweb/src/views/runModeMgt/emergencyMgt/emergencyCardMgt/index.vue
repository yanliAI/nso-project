<template>
  <Page auto-content-height>
    <el-container>
      <el-form
        ref="queryFormRef"
        :inline="true"
        :model="queryForm"
        label-position="right"
        style="padding: 16px 20px 0"
      >
        <el-form-item label="应急卡片名称:" prop="cardName">
          <el-input
            style="width: 180px"
            v-model="queryForm.cardName"
            clearable
          />
        </el-form-item>
        <el-form-item label="应急预案:" prop="planName">
          <el-select
            v-model="queryForm.planName"
            style="width: 180px"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option
              v-for="item in planNameList"
              :key="item.name"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统名称:" prop="sysName">
          <el-input
            style="width: 180px"
            v-model="queryForm.sysName"
            clearable
          />
        </el-form-item>
        <el-form-item label="设备主人:" prop="deviceOwner">
          <el-input
            style="width: 180px"
            v-model="queryForm.deviceOwner"
            clearable
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :icon="Search" @click="query"
            >查询</el-button
          >
          <el-button type="primary" :icon="CirclePlus" @click="addCard"
            >新增</el-button
          >
          <el-button type="info" :icon="RefreshLeft" @click="resetQueryForm"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
      <el-main>
        <el-table
          border
          stripe
          ref="table"
          :data="tableData"
          @selection-change="handleSelectionChange"
          style="width: 100%; height: 760px"
        >
          <el-table-column type="index" align="center" />
          <el-table-column type="selection" />
          <el-table-column prop="cardName" label="应急卡片名称" align="center">
            <!-- <template #default="scope">
              <el-link type="primary" @click="lookJobDetail(scope.row)">{{
                scope.row.planNo
              }}</el-link>
            </template> -->
          </el-table-column>

          <el-table-column prop="planName" label="应急预案名称" align="center">
          </el-table-column>

          <el-table-column
            prop="sysName"
            label="系统名称"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="riskType"
            label="风险类型"
            align="center"
            width="120"
          >
            <template #default="scope">
              <span v-if="scope.row.riskType == 1">网络风险</span>
              <span v-else-if="scope.row.riskType == 2">数据风险</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            align="center"
            width="120"
          >
            <template #default="scope">
              <el-tag v-if="scope.row.status == 1" type="success" size="large"
                >已发布
                <!-- <CircleCheck style="width: 1em; display: inline; margin-left: 5px"/> -->
              </el-tag>
              <el-tag
                v-else-if="scope.row.status == 2"
                type="primary"
                size="large"
                >待审批</el-tag
              >
            </template>
          </el-table-column>

          <el-table-column
            prop="deviceOwner"
            label="设备主人"
            align="center"
            width="120"
          ></el-table-column>
          <el-table-column prop="attachments" label="附件" align="center">
            <template #default="scope">
              <el-link type="primary" @click="filePreviewClick(scope.row)">
                {{ scope.row.attachments }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <el-button type="primary" link @click="editCard(scope.row)"
                >编辑</el-button
              >
              <el-button type="danger" link @click="deleteCard(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
          :page-sizes="[20, 50, 100, 200]"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </el-footer>
    </el-container>

    <!-- 新增/编辑弹框 -->
    <el-dialog
      v-model="dialogData.visible"
      :title="dialogData.title"
      width="1000"
    >
      <el-form label-position="right" label-width="auto">
        <el-row>
          <el-col :span="8">
            <el-form-item label="关联应急预案:" prop="planName">
              <el-select
                v-model="dialogData.planName"
                style="width: 180px"
                placeholder="请选择"
                clearable
                filterable
              >
                <el-option
                  v-for="item in planNameList"
                  :key="item.name"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="风险类型:">
              <el-select
                v-model="dialogData.riskType"
                style="width: 180px"
                placeholder="请选择"
                clearable
                filterable
              >
                <el-option
                  v-for="item in riskTypeList"
                  :key="item.name"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="卡片名称:">
              <el-input
                style="width: 180px"
                v-model="dialogData.cardName"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="处置步骤列表:">
              <el-table
                ref="stepTable"
                border
                stripe
                :data="dialogTableData"
                style="width: 100%"
                max-height="300"
              >
                <el-table-column
                  type="index"
                  align="center"
                  label="序号"
                  width="80"
                />
                <el-table-column
                  prop="processSteps"
                  label="流程步骤"
                  align="center"
                >
                  <template #default="{ row }">
                    <el-input v-model="row.processSteps" placeholder="请输入" />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="disposalMeasure"
                  label="系统处置措施"
                  align="center"
                >
                  <template #default="{ row }">
                    <el-input
                      v-model="row.disposalMeasure"
                      placeholder="请输入"
                    />
                  </template>
                </el-table-column>
                <el-table-column prop="leader" label="负责人" align="center">
                  <template #default="{ row }">
                    <el-select
                      v-model="row.leader"
                      placeholder="请选择"
                      filterable
                    >
                      <el-option
                        v-for="item in leaderList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="assets" label="资源" align="center">
                </el-table-column>
                <el-table-column prop="attachments" label="附件" align="center">
                  <template #default="{ row }">
                    <el-upload
                      action=""
                      :on-change="(file) => handleStepFileChange(file, row)"
                      :limit="1"
                    >
                      <el-button type="primary" link>{{
                        row.attachments || '请选择'
                      }}</el-button>
                    </el-upload>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                  <template #default="scope">
                    <el-button type="danger" link @click="deleteStep(scope.row)"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label=" ">
          <el-button type="success" :icon="Plus" @click="addStep"
            >添加处置步骤</el-button
          >
        </el-form-item>

        <el-form-item label="附件：">
          <el-upload action="" :on-change="handleCardFileChange" :limit="1">
            <el-button type="primary" link>
              <el-icon v-if="!dialogData.file">
                <Plus />
              </el-icon>
              {{ (dialogData.file && dialogData.file.name) || '附件' }}
            </el-button>
          </el-upload>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogData.visible = false">取消</el-button>
          <el-button type="primary" @click="saveCard"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 预览附件窗口 -->
    <Modal
      class="h-[650px] w-[1000px]"
      title="预览"
      :footer="false"
      :closeOnClickModal="false"
      :draggable="true"
    >
      <FilePreview
        :url="data.curPreviewUrl"
        :fileType="data.curFileType"
      ></FilePreview>
    </Modal>
  </Page>
</template>

<script lang="ts" setup>
import {
  ElTable,
  ElTableColumn,
  ElFormItem,
  ElForm,
  ElInput,
  ElButton,
  ElSelect,
  ElOption,
  ElPagination,
  ElContainer,
  ElMain,
  ElFooter,
  ElRow,
  ElCol,
  ElDialog,
  ElMessage,
  ElMessageBox,
  ElLink,
  ElTag,
} from 'element-plus';
import {
  Plus,
  Search,
  RefreshLeft,
  Download,
  Monitor,
  CirclePlus,
  CircleCheck,
} from '@element-plus/icons-vue';
import { Page } from '@vben/common-ui';
import { ref, reactive, computed, onMounted, nextTick } from 'vue';
import { requestClient } from '#/api/request';
import { useVbenModal } from '@vben/common-ui';
import FilePreview from '#/views/basic/attach/filePreview.vue';

defineOptions({
  name: 'EmergencyCardMgt',
});

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
});
const data = reactive({
  curPreviewUrl: '',
  curFileType: '',
  showPreview: true,
});

const dialogData = reactive({
  visible: false,
  title: '',
  planName: '',
  riskType: '',
  cardName: '',
  file: null,
});

// 默认对象
const defaultStepBean = {
  id: '',
  processSteps: '',
  disposalMeasure: '',
  leader: '',
  assets: '',
  attachments: '',
};
let dialogTableData = ref([]);

const queryFormRef = ref();
const queryForm = reactive({
  cardName: '',
  planName: '',
  sysName: '',
  deviceOwner: '',
});

// 缓存所有应急预案
const planNameList = reactive([
  {
    name: '预案一',
    value: '1',
  },
  {
    name: '预案二',
    value: '2',
  },
  {
    name: '预案三',
    value: '3',
  },
]);

const riskTypeList = reactive([
  {
    name: '网络安全',
    value: '1',
  },
  {
    name: '数据安全',
    value: '2',
  },
  {
    name: '风险安全',
    value: '3',
  },
]);

const leaderList = reactive([
  { name: '张三', value: '张三' },
  { name: '张三', value: '张三' },
  { name: '张三', value: '张三' },
]);

const resetQueryForm = () => {
  queryFormRef.value?.resetFields();
  query();
};
const stepTable = ref();
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);
const table = ref(null);
const tableData = ref([
  {
    cardName: '网页恶意篡改事件应急卡',
    planName: '电网管理平台（人资域）应急预案',
    sysName: '电网管理平台（人资域）',
    status: 1,
    deviceOwner: '张明明',
    attachments: 'xxx流程图.jpg',
    riskType: '1',
  },
  {
    cardName: '网页恶意篡改事件应急卡',
    planName: '电网管理平台（人资域）应急预案',
    sysName: '电网管理平台（人资域）',
    status: 2,
    deviceOwner: '张明明',
    attachments: 'xxx流程图.jpg',
    riskType: '2',
  },
]);
const selectedRows = ref([]);

/**
 * 查询
 */
const query = async () => {
  // const response = await requestClient.post(
  //   import.meta.env.VITE_NSOSGZ +
  //     '/odWorkbenchClassTemplate/mHQueryDataListByPagePagination',
  //   {
  //     pageNo: currentPage.value,
  //     pageSize: pageSize.value,
  //"sortFieldName": 'workbenceClassOrder',
  //"sortType": 'asc',
  // workbenceClassName: queryForm.workbenceClassName,
  // provinceCode: queryForm.provinceCode,
  // bureauCode: queryForm.bureauCode,
  //   },
  // );
  // tableData.value = response.list;
  // total.value = response.count;
};

/**
 * 添加应急卡片
 */
const addCard = () => {
  dialogData.visible = true;
  dialogData.title = '新增应急卡片';
  dialogData.planName = '';
  dialogData.riskType = '';
  dialogData.cardName = '';
  dialogData.file = null;
  // 清空步骤
  dialogTableData.value = [];
  addStep();
};

/**
 * 添加处置步骤
 */
const addStep = () => {
  // 创建一个默认步骤对象的副本
  const newStep = { ...defaultStepBean };
  newStep.id = new Date().getTime() + '';
  dialogTableData.value.push(newStep);

  // 等待 DOM 更新后滚动到底部
  nextTick(() => {
    const tableEl = stepTable.value.$el; // 获取表格的根 DOM 元素
    const tableBodyWrapper = tableEl.querySelector('.el-scrollbar__wrap'); // 获取表格内容区域的 DOM 元素
    if (tableBodyWrapper) {
      tableBodyWrapper.scrollTop = tableBodyWrapper.scrollHeight; // 滚动到底部
    }
  });
};

/**
 * 删除步骤
 */
const deleteStep = (row) => {
  dialogTableData.value = dialogTableData.value.filter(
    (item) => item.id !== row.id,
  );
};

/**
 * 编辑卡片
 */
const editCard = (row) => {
  dialogData.visible = true;
  dialogData.title = '编辑应急卡片';
  dialogData.planName = row.planName;
  dialogData.riskType = row.riskType;
  dialogData.cardName = row.cardName;
  // 获取附件
  dialogData.file = null;
  // 获取步骤列表
  dialogTableData.value = [];
};

/**
 * 删除卡片
 */
const deleteCard = (row) => {
  ElMessageBox.confirm('确认删除该应急卡片吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    // 删除逻辑
  });
};

const saveCard = () => {
  dialogData.visible = false;
};

const filePreviewClick = (row) => {
  modalApi.open();
  data.curPreviewUrl =
    import.meta.env.VITE_BASIC +
    '/attachFileInfo/preview?objectId=' +
    '89075557A72D4E59BEB031D4D8BFDF03';
  data.curFileType = 'jpg';
};

/**
 * 选择处置步骤列表中的附件回调
 */
const handleStepFileChange = (file, row) => {
  console.log('选择的步骤附件:', file);
  row.attachments = file.name;
};

const handleCardFileChange = (file) => {
  dialogData.file = file;
  console.log('dialogFile==', dialogData.file);
};

const handleSelectionChange = (val) => {
  selectedRows.value = val;
};

const handleSizeChange = (size: number) => {
  pageSize.value = size;
  query();
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  query();
};

onMounted(() => {
  query();
});
</script>

<style scoped>
.el-main {
  padding-top: 0;
}
.cell {
  text-align: center;
}
</style>
