<script setup lang="ts">
import { reactive, ref, onMounted, nextTick } from 'vue';
import {
  Search,
  RefreshLeft,
  Refresh,
  Delete,
  Download,
  Monitor,
  CirclePlus,
  CircleCheck,
} from '@element-plus/icons-vue';
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
  queryMonthCollectTemplate,
  insertMonthCollectTemplate,
  auditMonthCollectTemplate,
  updateMonthCollectTemplate,
  getCollectionTypes,
} from '#/api';

import axios from 'axios';
import { downloadFile } from '#/utils/download.ts';
import { useAccessStore, useUserStore } from '@vben/stores';
const accessStore = useAccessStore();

const defaultTime1 = new Date(2000, 1, 1, 12, 0, 0);
const collectionTypes = ref([]);
// 提交表单
const submitFormRef = ref<FormInstance>();
const openDialog = ref(false); // 新增弹窗
const openUpdateDialog = ref(false); // 新增弹窗
const openAuditDialog = ref(false); // 审核弹窗
const loading = ref(false);
// 头部表单
const queryForm = reactive({
  auditStatus: '',
  createEndTime: '',
  createStartTime: '',
  pageNo: 1,
  pageSize: 10,
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

// 新增模板表单
const submitForm = reactive({
  dateRange2: [],
  attRoute: '',
  attName: '',
  auditStatus: '',
  bureauCode: '',
  collectionType: '',
  createTime: '',
  creatorId: '',
  lastUpdateTime: '',
  lastUpdaterId: '',
  remarks: '',
  templateBeginTime: '',
  templateEndTime: '',
  templateId: '',
  templateName: '',
  unitList: [],
});
// 暂存更新时得附件路径和名称
const originRoute = ref('');
const originName = ref('');
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
// function getProvinceLabel(code) {
//   const province = provinceOptions.find((item) => item.value === code);
//   return province ? province.label : code; // 如果找不到则显示原始code
// }

interface FileItem {
  uid: string;
  name?: string;
  status?: string;
  response?: string;
  url?: string;
}
const fileList = ref<FileItem[]>([]);

// 表格
const data = reactive({
  tableData: [],
  auditTabelData: [],
  pageInfo: {
    pageSize: 5,
    pageNo: 1,
    total: 10,
  },
});

onMounted(() => {
  queryData();
  queryCollectionTypes();
});

/**
 * 数据管理
 */

// 查询数据
async function queryData() {
  try {
    const res = await queryMonthCollectTemplate(queryForm);
    if (res) {
      data.tableData = res.records;
      queryForm.total = res.total;
    }
  } catch (error) {
    console.error('查询数据失败:', error);
  }
}


// 查询收资类型
async function queryCollectionTypes() {
  try {
    const res = await getCollectionTypes();
    if (res) {
      collectionTypes.value = res;
    }
  } catch (error) {
    console.error('查询数据失败:', error);
  }
}

// 重置表单方法
function reset() {
  Object.assign(queryForm, {
    auditStatus: '',
    createEndTime: '',
    createStartTime: '',
    pageNo: 1,
    pageSize: 10,
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
  dateRange.value = [];
  dateRange1.value = [];
  // 可选：手动触发一次查询（根据需求决定）
  queryData();
}
// 更新数据
async function updateData(row: string) {
  openUpdateDialog.value = true;
  Object.assign(submitForm, {
    ...row,
    dateRange2: [], // 确保是数组
  });
  submitForm.dateRange2.push(row.templateBeginTime);
  submitForm.dateRange2.push(row.templateEndTime);
  //保留原始的文件
  originName.value = row.attName;
  originRoute.value = row.attRoute;
  submitForm.attName = '';
  submitForm.attRoute = '';
}

// 审核模板
async function auditTempl(row: any) {
  // 1. 打开弹窗
  openAuditDialog.value = true;

  // 2. 获取审核数据
  data.auditTabelData = [];
  data.auditTabelData.push(row);
}

// 有效期赋值
const dateRange = ref([]);

function handleDateChange(val: any) {
  queryForm.templateBeginTime = val?.[0] || '';
  queryForm.templateEndTime = val?.[1] || '';
}

// 上传时间赋值
const dateRange1 = ref([]);

function handleDateChange1(val: any) {
  queryForm.createStartTime = val?.[0] || '';
  queryForm.createEndTime = val?.[1] || '';
}

function handleDateChange2(val: any) {
  submitForm.templateBeginTime = val?.[0] || '';
  submitForm.templateEndTime = val?.[1] || '';
}

// 换页查询
function currentChange(val: number) {
  queryForm.pageNo = val;
  queryData();
}

function handleSizeChange(val: number) {
  queryForm.pageSize = val;
  queryData();
}

// 打开弹窗
function insertSq() {
  openDialog.value = true;
  // submitFormRef.value?.resetFields();
  Object.assign(submitForm, {
    dateRange2: [],
    attRoute: '',
    attName: '',
    auditStatus: '',
    bureauCode: '',
    collectionType: '',
    createTime: '',
    creatorId: '',
    lastUpdateTime: '',
    lastUpdaterId: '',
    remarks: '',
    templateBeginTime: '',
    templateEndTime: '',
    templateId: '',
    templateName: '',
    unitList: [],
  });
  fileList.value = [];
}

// 取消弹窗
function cancel() {
  // submitFormRef.value?.resetFields();
  Object.assign(submitForm, {
    dateRange2: [],
    attRoute: '',
    attName: '',
    auditStatus: '',
    bureauCode: '',
    collectionType: '',
    createTime: '',
    creatorId: '',
    lastUpdateTime: '',
    lastUpdaterId: '',
    remarks: '',
    templateBeginTime: '',
    templateEndTime: '',
    templateId: '',
    templateName: '',
    unitList: [],
  });
  fileList.value = [];
  openDialog.value = false;
  openUpdateDialog.value = false;
  openAuditDialog.value = false;
}
// 自定义验证规则
const formRules: FormRules = {
  templateName: [
    { required: true, message: '模板名称未填写', trigger: 'blur' },
  ],
  unitList: [{ required: true, message: '组织未选中', trigger: 'change' }],
  collectionType: [
    { required: true, message: '收资类型未选择', trigger: 'change' },
  ],
  dateRange2: [
    {
      required: true,
      message: '请选择完整的有效期',
      trigger: 'change',
    },
  ],
};

/**
 * 上传文件
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


// 更新数据 上传前处理

function beforeUpload1(file: FileItem) {
  fileList.value = []
  // 获取文件后缀
  const fileExtension = file.name.split('.').pop().toLowerCase()
  // 检查文件类型和后缀
  const isValidType = ['.xls', '.xlsx', '.doc', '.docx'].includes(`.${fileExtension}`)

  if (!isValidType) {
    fileList.value = [];
    ElMessage.warning('不支持上传该文件格式，请上传.xls,.xlsx,.doc,.docx格式文件')
    return false // 阻止上传
  }
  fileList.value = [file]
  return true // 允许上传
}


// function beforeUpload1(file: FileItem) {
//   fileList.value = [];
//   deleteFile();
//   // fileList.value = [file];
//   return true;
// }

function handleRemove() {
  deleteFile();
  fileList.value = [];
}

// 获取用户token
function formatToken(token: string) {
  return token ? `Bearer ${token}` : null;
}

// 时间转成(yyyy-mm-dd HH:MM:SS)
function dateFormat(backendDateStr: string) {
  // backendDateStr.replace('T', ' ');
  return backendDateStr;
}

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
      data: { filePath: submitForm.attRoute },
    }).then((res) => {
      submitForm.attName = '';
      submitForm.attRoute = '';
    });
  } catch { }
}

// 下载文件
async function downloadAttachment(row: any) {
  try {
    const fileNameWithExt = row.attRoute.split('/').pop();
    await downloadFile(
      import.meta.env.VITE_NSOSFS +
      `/commonFile/download?filePath=${row.attRoute}`,
      {},
      fileNameWithExt,
      'get',
    );
  } catch { }
}

/**
 * 提交表单
 */

// 提交表单
async function handleSubmit() {
  if (!submitFormRef.value) return;
  try {
    const isValid = await submitFormRef.value.validate();
    if (!isValid) return;
    if (fileList.value.length === 0 || submitForm.attRoute === '') {
      ElMessage.warning('请上传附件!');
      return;
    }
    // const now = moment();
    submitForm.auditStatus = '1'; // 待审核状态
    // submitForm.createTime = now.format('YYYY-MM-DD hh:mm:ss');
    // 验证通过，执行提交逻辑
    await insertMonthCollectTemplate(submitForm);
    cancel();
    await queryData();
    ElMessage.success('提交成功');
  } catch {
    // 这里不会执行，因为验证错误已被捕获
    console.log('提交失败');
  }
}

// 更新表单提交
async function handleUpdateSubmit() {
  if (!submitFormRef.value) return;
  try {
    const isValid = await submitFormRef.value.validate();
    if (!isValid) return;
    if (submitForm.attRoute === '') {
      if (originRoute.value === '') {
        ElMessage.error('请添加附件!');
      } else {
        submitForm.attRoute = originRoute.value;
        submitForm.attName = originName.value;
      }
    }
    // 验证通过，执行提交逻辑
    await updateMonthCollectTemplate(submitForm);
    cancel();
    ElMessage.success('提交成功');
    queryData();
  } catch {
    // 这里不会执行，因为验证错误已被捕获
    console.log('提交失败');
  }
}

// 审核表单提交
async function handleAuditubmit() {
  try {
    // 验证通过，执行提交逻辑
    await auditMonthCollectTemplate(data.auditTabelData[0]);
    openAuditDialog.value = true;
    ElMessage.success('提交成功');
    queryData();
    openAuditDialog.value = false;
  } catch {
    // 这里不会执行，因为验证错误已被捕获
    console.log('提交失败');
  }
}
</script>
<template>
  <div class="h-full">
    <div style="padding: 30px 20px 0 20px">
      <el-form :inline="true" :model="queryForm" label-position="right">
        <el-form-item label="模板ID:">
          <!-- <el-select
                v-model="queryForm.resourceId"
              /> -->
          <el-input v-model="queryForm.templateCode" clearable />
        </el-form-item>
        <el-form-item label="模板名称:">
          <el-input v-model="queryForm.templateName" clearable />
        </el-form-item>
        <el-form-item label="模板审核状态:">
          <el-select v-model="queryForm.auditStatus" style="width: 200px" clearable>
            <el-option label="待审核" value="1" />
            <el-option label="已审核" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="模板有效期:">
          <el-date-picker v-model="dateRange" type="daterange" start-placeholder="开始时间" end-placeholder="结束时间"
            format="YYYY-MM-DD" value-format="YYYY-MM-DD" @change="handleDateChange" style="width: 180px" />
        </el-form-item>
        <el-form-item label="上传时间:">
          <el-date-picker v-model="dateRange1" type="daterange" start-placeholder="开始时间" end-placeholder="结束时间"
            format="YYYY-MM-DD" value-format="YYYY-MM-DD" @change="handleDateChange1" style="width: 180px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="queryData">查询</el-button>
          <el-button type="info" :icon="Refresh" @click="reset">重置</el-button>
          <el-button type="success" @click="insertSq">上传模板</el-button>
        </el-form-item>
        <el-form-item> </el-form-item>
      </el-form>
    </div>
    <div style="padding: 0 20px">
      <el-table ref="tab" border stripe :data="data.tableData" height="680px">
        <el-table-column type="index" align="center" />
        <el-table-column type="selection" />
        <el-table-column prop="templateCode" align="center" label="模板ID">
        </el-table-column>
        <el-table-column prop="templateName" align="center" label="模板名称" />
        <el-table-column align="center" label="审核状态">
          <template #default="scope">
            <span>
              {{ scope.row.auditStatus === '0' ? '已审核' : '待审核' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="模板有效期">
          <template #default="scope">
            <span>
              {{ scope.row.templateBeginTime }} -
              {{ scope.row.templateEndTime }}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="收资类型">
          <template #default="scope">
            <span>
              {{
                collectionTypes?.find(
                  (item) => item.code === scope.row.collectionType,
                )?.description || ''
              }}
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="creatorId" align="center" label="上传人" />
        <!-- <el-table-column prop="provinceCode" align="center" label="组织单位">
          <template #default="scope">
            {{ getProvinceLabel(scope.row.provinceCode) }}
          </template>
        </el-table-column> -->
        <el-table-column prop="createTime" align="center" label="上传时间">
          <template #default="scope">
            <span> {{ scope.row.createTime }} </span>
          </template>
        </el-table-column>
        <el-table-column prop="remarks" align="center" label="备注" />
        <el-table-column align="center" label="操作">
          <template #default="scope">
            <el-button type="primary" link @click="updateData(scope.row)">编辑</el-button>
            <el-button type="primary" link @click="auditTempl(scope.row)">模板审核</el-button>
            <!-- <el-button type="danger" link>删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="padding: 10px 0 0 20px; display: flex">
      <ElPagination v-model:current-page="queryForm.pageNo" v-model:page-size="queryForm.pageSize"
        :total="queryForm.total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
        @current-change="currentChange" />
    </div>
    <ElDialog v-model="openDialog" title="新增模板" width="600" class="system-detail-dialog" @close="cancel">
      <div style="padding-left: 15px" v-loading="loading">
        <ElForm ref="submitFormRef" :model="submitForm" :rules="formRules" label-width="auto">
          <ElFormItem label="模板名称:" prop="templateName" required style="width: 500px">
            <ElInput v-model="submitForm.templateName" placeholder="请输入名称" clearable :maxlength="30" />
          </ElFormItem>
          <ElFormItem label="适用组织:" prop="unitList" required style="width: 500px">
            <ElSelect v-model="submitForm.unitList" placeholder="请选择组织" multiple>
              <el-option v-for="(item, index) in provinceOptions" :key="index" :label="item.label"
                :value="item.value" />
            </ElSelect>
          </ElFormItem>
          <ElFormItem label="收资类型:" prop="collectionType" required style="width: 500px">
            <ElSelect v-model="submitForm.collectionType" placeholder="请选择">
              <el-option v-for="(item, index) in collectionTypes" :key="index" :label="item.description"
                :value="item.code" />
            </ElSelect>
          </ElFormItem>
          <ElFormItem label="有效期:" prop="dateRange2" style="width: 500px" required>
            <el-date-picker v-model="submitForm.dateRange2" type="datetimerange" start-placeholder="开始时间"
              end-placeholder="结束时间" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss"
              @change="handleDateChange2" />
          </ElFormItem>
          <ElFormItem label="备注:" prop="remarks" style="width: 500px">
            <el-input v-model="submitForm.remarks" :rows="2" type="textarea" :maxlength="100" placeholder="请输入" />
          </ElFormItem>
          <ElRow>
            <el-upload v-model:file-list="fileList" ref="upload" class="upload-demo" :limit="1"
              :before-upload="beforeUpload" :on-remove="handleRemove" :show-file-list="true" :http-request="uploadFile"
              accept=".xls,.xlsx,.doc,.docx">
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
    <ElDialog v-model="openUpdateDialog" title="更新模板" width="600" class="system-detail-dialog" @close="cancel">
      <div v-loading="loading">
        <ElForm ref="submitFormRef" :model="submitForm" :rules="formRules" label-width="auto">
          <ElFormItem label="模板名称:" prop="templateName" required style="width: 500px">
            <ElInput v-model="submitForm.templateName" placeholder="请输入名称" clearable :maxlength="50" />
          </ElFormItem>
          <ElFormItem label="适用组织:" prop="unitList" required style="width: 500px">
            <ElSelect v-model="submitForm.unitList" placeholder="请选择组织" multiple>
              <el-option v-for="(item, index) in provinceOptions" :key="index" :label="item.label"
                :value="item.value" />
            </ElSelect>
          </ElFormItem>
          <ElFormItem label="收资类型:" prop="collectionType" required style="width: 500px">
            <ElSelect v-model="submitForm.collectionType" placeholder="请选择">
              <el-option v-for="(item, index) in collectionTypes" :key="index" :label="item.description"
                :value="item.code" />
            </ElSelect>
          </ElFormItem>
          <ElFormItem label="有效期:" prop="dateRange2" style="width: 500px" required>
            <el-date-picker v-model="submitForm.dateRange2" type="datetimerange" start-placeholder="开始时间"
              end-placeholder="结束时间" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss"
              @change="handleDateChange2" />
          </ElFormItem>
          <ElFormItem label="备注:" prop="remarks" style="width: 500px">
            <el-input v-model="submitForm.remarks" :rows="2" type="textarea" :maxlength="500" placeholder="请输入" />
          </ElFormItem>
          <ElRow>
            <el-upload ref="upload" class="upload-demo" v-model:file-list="fileList" :limit="1"
              :on-remove="handleRemove" :before-upload="beforeUpload1" :show-file-list="true"
              :http-request="uploadFile"
              accept=".xls,.xlsx,.doc,.docx">
              <el-button type="success">更新附件</el-button>
               <template #tip>
                <div class="el-upload__tip">支持上传.xls,.xlsx,.doc,.docx格式文件</div>
              </template>
            </el-upload>
            <!-- <span style="margin-left: 15px; height: 30px; line-height: 30px;">{{ submitForm.attRoute?.split('/').pop() }}</span> -->
          </ElRow>
        </ElForm>
      </div>
      <div style="display: flex; margin-right: 10px">
        <div style="margin-top: 10px; margin-left: auto">
          <ElButton type="primary" @click="handleUpdateSubmit">确定</ElButton>
          <ElButton @click="cancel">取消</ElButton>
        </div>
      </div>
    </ElDialog>
    <ElDialog v-model="openAuditDialog" title="审核模板" width="1200" class="system-detail-dialog" @close="cancel">
      <el-table ref="tab" border stripe :data="data.auditTabelData" height="450px">
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

        <el-table-column prop="creatorId" align="center" label="上传人" />
        <el-table-column prop="createTime" align="center" label="上传时间" />
        <el-table-column align="center" label="审核状态">
          <template #default="scope">
            <el-switch v-model="scope.row.auditStatus" class="ml-2" width="60" inline-prompt active-value="0"
              inactive-value="1" active-text="已审核" inactive-text="待审核" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template #default="scope">
            <el-button type="primary" link @click="downloadAttachment(scope.row)">下载附件</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex; margin-right: 10px">
        <div style="margin-top: 10px; margin-left: auto">
          <ElButton type="primary" @click="handleAuditubmit">确定</ElButton>
          <ElButton @click="cancel">取消</ElButton>
        </div>
      </div>
    </ElDialog>
  </div>
</template>
<style lang="less" scoped>
:deep(.el-upload-list__item) {
  width: 300px;
}

.file-item {
  color: red;
}

// .file-item--success {
//   background-color: #f0f9eb;
// }
</style>
