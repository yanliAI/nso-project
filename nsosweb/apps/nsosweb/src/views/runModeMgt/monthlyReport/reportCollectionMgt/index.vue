<script setup lang="ts">
import { reactive, ref, onMounted, nextTick } from 'vue';
import {
  Search,
  RefreshLeft,
  Delete,
  Download,
  Refresh,
  Monitor,
  CirclePlus,
  CircleCheck,
} from '@element-plus/icons-vue';
import { downloadFile } from '#/utils/download.ts';
import axios from 'axios';
import {
  ElTable,
  ElTableColumn,
  ElContainer,
  ElFormItem,
  ElDialog,
  ElForm,
  ElInput,
  ElButton,
  ElSelect,
  ElRow,
  ElCol,
  ElTabs,
  ElPagination,
  ElMessage,
  ElMessageBox,
  type FormInstance,
} from 'element-plus';
import {
  queryMonthCollect,
  queryMonthCollectTemplate,
  insertMonthCollect,
} from '#/api';
import { useAccessStore, useUserStore } from '@vben/stores';
const accessStore = useAccessStore();
interface FileItem {
  uid: string;
  name?: string;
  status?: string;
  response?: string;
  url?: string;
}
const fileList = ref<FileItem[]>([]);
// 头部表单
const queryForm = reactive({
  collectionType: '',
  endTime: '',
  fileName: '',
  pageNo: 1,
  pageSize: 10,
  total: 0,
  permissionIds: [],
  recordCode: '',
  startTime: '',
  subUnit: true,
  unitId: '',
  unitIds: [],
});

// 新增资料表单
const submitForm = reactive({
  collectionDate: '',
  collectionType: '',
  fileName: '',
  fileRoute: '',
  templateId: '',
  templateName: '',
  provinceCode: '',
});
// 分省选项
const provinceOptions = [
  {
    value: '210000',
    label: '南网总部',
  },
  {
    value: '010000',
    label: '超高压',
  },
  {
    value: '030000',
    label: '广东电网',
  },
  {
    value: '040000',
    label: '广西电网',
  },
  {
    value: '050000',
    label: '云南电网',
  },
  {
    value: '060000',
    label: '贵州电网',
  },
  {
    value: '070000',
    label: '海南电网',
  },
  {
    value: '080000',
    label: '深圳供电局',
  },
  {
    value: '020000',
    label: '储能公司',
  },
  {
    value: '120000',
    label: '鼎和保险',
  },
];

// 收资类型
const collectionTypes = [
  { label: '重要任务', value: '1' },
  { label: '故障异常', value: '2' },
  { label: '并网审查', value: '3' },
  { label: '数字化应用及平台隐患消缺', value: '4' },
  { label: 'IT基础设施运行方式安排', value: '5' },
  { label: '安全运行保障', value: '6' },
  { label: '网络安全方式安排', value: '7' },
  { label: '数字化应用及平台并网计划', value: '8' },
  { label: '数字化应用及平台隐患消缺计划', value: '9' },
  { label: 'IT基础设施运行方式安排', value: '10' },
  { label: '安全运行保障计划', value: '11' },
  { label: '网络安全方式安排', value: '12' },
  { label: '资源平衡', value: '13' },
];
function getCollectionLabel(code) {
  const collections = collectionTypes.find((item) => item.value === code);
  return collections ? collections.label : ''; // 如果找不到则显示原始code
}

// 表格
const data = reactive({
  tableData: [],
  auditTabelData: [],
});

// 提交表单
const submitFormRef = ref<FormInstance>();
const openDialog = ref(false);
const openTemplDialog = ref(false);
const dateRange = ref([]);

const loading = ref(false)
onMounted(() => {
  queryData();
});

/**
 * 数据管理
 */

// 查询资料数据
async function queryData() {
  try {
    const res = await queryMonthCollect(queryForm);
    if (res) {
      data.tableData = res.list;
      queryForm.total = res.total;
    }
  } catch (error) {
    console.error('查询数据失败:', error);
  }
}

function handleDateChange(val: any) {
  queryForm.startTime = val?.[0] || '';
  queryForm.endTime = val?.[1] || '';
}

// 查询模板数据
async function queryTemplData() {
  try {
    const res = await queryMonthCollectTemplate({
      auditStatus: 0,
      createEndTime: '',
      createStartTime: '',
      pageNo: 1,
      pageSize: 100,
      total: 0,
      permissionIds: [],
      subUnit: true,
      templateBeginTime: '',
      templateEndTime: '',
      templateId: '',
      templateName: '',
      unitId: '',
      unitIds: [],
    });
    if (res) {
      data.auditTabelData = res.records;
    }
  } catch (error) {
    console.error('查询数据失败:', error);
  }
}

// 重置表单方法
function reset() {
  Object.assign(queryForm, {
    collectionType: '',
    endTime: '',
    fileName: '',
    pageNo: 1,
    pageSize: 10,
    total: 0,
    permissionIds: [],
    recordCode: '',
    startTime: '',
    subUnit: true,
    unitId: '',
    unitIds: [],
  });
  dateRange.value = [];
  // 可选：手动触发一次查询（根据需求决定）
  queryData();
}
// 打开模板弹窗
function queryTempl() {
  queryTemplData();
  openTemplDialog.value = true;
}

// 打开上传弹窗
function insertSq() {
  // 1. 打开弹窗
  openDialog.value = true;

  // 2.准备数据
  queryTemplData();
}

// 自定义验证规则
const formRules: FormRules = {
  fileName: [{ required: true, message: '资料名称未填写', trigger: 'blur' }],
  collectionType: [
    { required: true, message: '收资类型未选择', trigger: 'change' },
  ],
  collectionDate: [
    { required: true, message: '请选择收资日期', trigger: 'change' },
  ],
  provinceCode: [
    { required: true, message: '请选择组织单位', trigger: 'change' },
  ],
  templateId: [
    { required: true, message: '请选择填报模板', trigger: 'change' },
  ],
};

// 取消弹窗
function cancel() {
  submitFormRef.value?.resetFields();
  fileList.value = [];
  openDialog.value = false;
}
// 新增资料提交
async function handleSubmit() {
  if (!submitFormRef.value) return;
  try {
    const isValid = await submitFormRef.value.validate();
    if (!isValid) return;
    if (fileList.value.length === 0 || !submitForm.fileRoute) {
      ElMessage.warning('请上传附件!');
      return;
    }
    // 验证通过，执行提交逻辑
    const item = data.auditTabelData.find(
      (item) => item.templateId === submitForm.templateId,
    );
    submitForm.templateName = item.templateName;
    await insertMonthCollect(submitForm);
    queryData();
    cancel();
    ElMessage.success('提交成功');
  } catch {
    // 这里不会执行，因为验证错误已被捕获
    console.log('提交失败');
  }
}

/**
 * 分页
 */
function currentChange(val: number) {
  queryForm.pageNo = val;
  queryData();
}

function handleSizeChange(val: number) {
  queryForm.pageSize = val;
  queryData();
}

/**
 * 通用上传下载
 */

function beforeUpload(file: FileItem) {
  // 获取文件后缀
  const fileExtension = file.name.split('.').pop().toLowerCase()
  // 检查文件类型和后缀
  const isValidType = ['.xls', '.xlsx', '.doc', '.docx'].includes(`.${fileExtension}`)

  if (!isValidType) {
    fileList.value = [];
    ElMessage.warning('不支持上传该文件格式，请上传.xls,.xlsx,.doc,.docx格式文件')
    return false // 阻止上传
  }
  return true // 允许上传
}

function handleRemove() {
  deleteFile();
  fileList.value = [];
}

// 获取用户token
function formatToken(token: string) {
  return token ? `Bearer ${token}` : null;
}

// 下载文件
async function downloadAttachment(row: any) {
  try {
    const fileNameWithExt = row.attRoute.split('/').pop();
    await downloadFile(
      import.meta.env.VITE_NSOSFS + `/commonFile/download?filePath=${row.attRoute}`,
      {},
      fileNameWithExt,
      'get',
    );
  } catch {}
}

// 上传文件
// 上传文件
async function uploadFile() {
  if (!fileList.value || fileList.value.length <= 0) {
    ElMessage.warning('请选择上传文件！');
    return;
  }
  loading.value = true;
  const file = fileList.value[0]

  const fileData = new FormData();
  fileData.append('file', file?.raw, file?.raw.name);
  try {
    const res = await axios({
      url: import.meta.env.VITE_NSOSFS + '/commonFile/upload',
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: formatToken(accessStore.accessToken),
      },
      data: fileData,
    });

    // 验证响应状态和数据  415为后端接收的文件不支持
    if (res.data.code === 415){
      ElMessage.error('不支持上传该文件格式!')
      fileList.value = []
      loading.value = false
      return
    }
    if (
      res.status !== 200 ||
      !res.data?.data?.fileName ||
      !res.data?.data?.filePath
    ) {
      loading.value = false
      fileList.value = []
      ElMessage.error('上传失败!')
      return;
    }

    // 上传成功
    submitForm.attName = res.data.data.fileName;
    submitForm.attRoute = res.data.data.filePath;
    loading.value = false
  } catch (error) {
    console.error('上传失败:', error);
    loading.value = false
  }
};

// 删除上传文件
async function deleteFile() {
  try {
    axios({
      url: import.meta.env.VITE_NSOSFS + '/commonFile/delete',
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: formatToken(accessStore.accessToken),
      },
      data: { filePath: submitForm.fileRoute },
    }).then((res) => {
      submitForm.fileName = '';
      submitForm.fileRoute = '';
    });
  } catch {}
}
</script>
<template>
  <div class="h-full">
    <div style="padding: 30px 20px 0 20px">
      <el-form :inline="true" :model="queryForm" label-position="right">
        <el-form-item label="资料ID:">
          <el-input v-model="queryForm.recordCode" clearable />
        </el-form-item>
        <el-form-item label="资料名称:">
          <el-input v-model="queryForm.fileName" clearable />
        </el-form-item>
        <el-form-item label="收资日期:">
          <!-- <el-input
                v-model="queryForm.collectionDate"
                clearable
              /> -->
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            start-placeholder="请选择"
            end-placeholder="请选择"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            @change="handleDateChange"
            style="width: 200px"
          />
        </el-form-item>
        <!-- <el-form-item label="上传人:">
          <el-input v-model="queryForm.uploader" clearable />
        </el-form-item>
        <el-form-item label="上传时间:">
          <el-input v-model="queryForm.uploadTime" clearable />
        </el-form-item> -->
        <el-form-item label="资料类型:">
          <ElSelect
            v-model="queryForm.collectionType"
            placeholder="请选择"
            style="width: 180px;"
          >
            <el-option
              v-for="(item, index) in collectionTypes"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </ElSelect>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="queryData"
            >查询</el-button
          >
          <el-button type="info" :icon="Refresh" @click="reset"
            >重置</el-button
          >
          <el-button type="primary" @click="queryTempl">收资模板下载</el-button>
          <el-button type="success" @click="insertSq">上传资料</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="padding: 0 20px">
      <el-table ref="tab" border stripe :data="data.tableData" height="710px">
        <el-table-column type="index"  align="center"/>
        <el-table-column type="selection"  align="center"/>
        <el-table-column prop="recordCode" align="center" label="资料ID">
        </el-table-column>
        <el-table-column prop="fileName" align="center" label="资料名称" />
        <el-table-column
          prop="collectionDate"
          align="center"
          label="收资日期"
        />
        <el-table-column prop="creatorId" align="center" label="上传人" />
        <el-table-column prop="collectionType" align="center" label="资料类型">
          <template #default="scope">
            {{ getCollectionLabel(scope.row.collectionType) }}
          </template>
        </el-table-column>
        <el-table-column prop="provinceCode" align="center" label="上传组织">
          <template #default="scope">
            {{ provinceOptions?.find(item => item.value === scope.row.provinceCode )?.label || ''  }}
          </template>
        </el-table-column>

        <el-table-column prop="createTime" align="center" label="上传时间" />
      </el-table>
    </div>
    <div style="padding: 10px 0 0 20px; display: flex">
      <ElPagination
        v-model:current-page="queryForm.pageNo"
        v-model:page-size="queryForm.pageSize"
        :total="queryForm.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="currentChange"
      />
      <!-- <div style="margin-left: auto; padding-bottom: 10px; padding-right: 20px">
      </div> -->
    </div>
    <ElDialog
      v-model="openDialog"
      title="上传资料"
      width="1000"
      class="system-detail-dialog"
      @close="cancel"
    >
      <div style="padding-left: 15px" v-loading="loading">
        <ElForm
          ref="submitFormRef"
          :model="submitForm"
          :rules="formRules"
          label-width="auto"
        >
          <el-row>
            <el-col :span="12">
              <ElFormItem
                label="资料名称:"
                prop="fileName"
                required
                style="width: 400px"
              >
                <ElInput
                  v-model="submitForm.fileName"
                  placeholder="请输入名称"
                  clearable
                  :maxlength="50"
                />
              </ElFormItem>
            </el-col>
            <el-col :span="12">
              <ElFormItem
                label="收资类型:"
                prop="collectionType"
                required
                style="width: 400px"
              >
                <ElSelect
                  v-model="submitForm.collectionType"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(item, index) in collectionTypes"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </ElSelect>
              </ElFormItem>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <ElFormItem
                label="收资日期:"
                prop="collectionDate"
                required
                style="width: 400px"
              >
                <el-date-picker
                  v-model="submitForm.collectionDate"
                  type="date"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  placeholder="请选择时间"
                  style="width: 350px"
                />
              </ElFormItem>
            </el-col>
            <el-col :span="12">
              <ElFormItem
                label="模板名称:"
                prop="templateId"
                required
                style="width: 400px"
              >
                <ElSelect v-model="submitForm.templateId" placeholder="请选择">
                  <el-option
                    v-for="(item, index) in data.auditTabelData"
                    :key="index"
                    :label="item.templateName"
                    :value="item.templateId"
                  />
                </ElSelect>
              </ElFormItem>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <ElFormItem
                label="上传组织:"
                prop="provinceCode"
                required
                style="width: 400px"
              >
                <ElSelect
                  v-model="submitForm.provinceCode"
                  placeholder="请选择组织"
                >
                  <el-option
                    v-for="(item, index) in provinceOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </ElSelect>
              </ElFormItem>
            </el-col>
          </el-row>
          <ElRow>
            <el-upload
              ref="upload"
              class="upload-demo"
              v-model:file-list="fileList"
              :limit="1"
              :before-upload="beforeUpload"
              :on-remove="handleRemove"
              :show-file-list="true"
              :http-request="uploadFile"
              accept=".xls,.xlsx,.doc,.docx"
            >
              <el-button type="success">上传附件</el-button>
              <template #tip>
                <div class="el-upload__tip">支持上传.xls,.xlsx,.doc,.docx格式文件</div>
              </template>
            </el-upload>
          </ElRow>
        </ElForm>
      </div>
      <div style="display: flex; margin-right: 10px">
        <div style="margin-top: 10px; margin-left: auto">
          <ElButton type="primary" @click="handleSubmit">确定</ElButton>
          <ElButton @click="cancel">取消</ElButton>
        </div>
      </div>
    </ElDialog>
    <ElDialog
      v-model="openTemplDialog"
      title="下载模板"
      width="1000"
      class="system-detail-dialog"
    >
      <el-table
        ref="tab"
        border
        stripe
        :data="data.auditTabelData"
        height="450px"
      >
        <el-table-column type="index" />
        <el-table-column prop="templateCode" align="center" label="模板ID" />
        <el-table-column prop="templateName" align="center" label="模板名称" />
        <el-table-column align="center" label="模板有效期">
          <template #default="scope">
            <span>
              {{ scope.row.templateBeginTime }} -
              {{ scope.row.templateEndTime }}
            </span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="provinceCode" align="center" label="组织单位">
          <template #default="scope">
            {{ getProvinceLabel(scope.row.provinceCode) }}
          </template>
        </el-table-column> -->
        <el-table-column align="center" label="操作">
          <template #default="scope">
            <el-button
              type="primary"
              link
              @click="downloadAttachment(scope.row)"
              >下载附件</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex; margin-right: 10px">
        <div style="margin-top: 10px; margin-left: auto">
          <ElButton @click="openTemplDialog = false">取消</ElButton>
        </div>
      </div>
    </ElDialog>
  </div>
</template>
<style lang="less" scoped>
:deep(.el-upload-list__item) {
  width: 500px;
}
// :deep(.el-form-item) {
//   // width: 270px;
//   .el-form-item__content {
//     display: flex;
//     // justify-content: flex-end;
//   }
//   .el-form-item__label {
//     width: 100px;
//     text-align: right;
//     font-size: 14px;
//     font-weight: 500;
//     // line-height: 32px;
//     color: #515a6e;
//   }
// }

// 弹窗
// :deep(.el-dialog__title) {
//   color: black;
//   font-size: 20px;
//   font-weight: 500;
// }
</style>
