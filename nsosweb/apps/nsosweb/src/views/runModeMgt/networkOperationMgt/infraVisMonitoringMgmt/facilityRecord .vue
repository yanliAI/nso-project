<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';

import { onMounted, reactive, ref } from 'vue';
import { validateIP } from '#/utils/validateUtil.ts';
import {
  Search,
  Plus,
  Download,
  Delete,
  Refresh,
} from '@element-plus/icons-vue';
import {
  ElButton,
  ElCol,
  ElDialog,
  ElForm,
  ElFormItem,
  ElEmpty,
  ElImageViewer,
  ElPopconfirm,
  ElInput,
  ElMessage,
  ElPagination,
  ElRow,
  ElSelect,
  ElTable,
  ElTableColumn,
} from 'element-plus';

import {
  deleteMonitorSq,
  getmonitorSq,
  insertMonitorSq,
  downloadDrawingApi,
} from '#/api';
import moment from 'moment';
import axios from 'axios';
import { downloadFile } from '#/utils/download.ts';
import { useVbenModal } from '@vben/common-ui';
import { useAccessStore, useUserStore } from '@vben/stores';
import Panzoom from '@panzoom/panzoom';
const accessStore = useAccessStore();
// 暂存更新时得附件路径和名称
const originRoute = ref('');
const originName = ref('');
// 头部表单
const queryForm = reactive({
  facilityType: '',
  manufacturer: '',
  pageNo: 1,
  pageSize: 10,
  total: 0,
  permissionIds: [],
  sqId: '',
  sqIp: '',
  sqName: '',
  sqStatus: '',
  subUnit: true,
  timeRange: [],
  unit: '',
  unitId: '',
  unitIds: [],
  upSqId: '',
});
const [ModalB, modalBApi] = useVbenModal({
  onCancel() {
    modalBApi.close();
  },
});
// 拖拽、缩放对象
const panzoom = ref(null);
const wheelConRef = ref();
const svgTransform = reactive({
  scaleX: 1,
  scaleY: 1,
});
const loading = ref(false);
const uploading = ref(false)
const svgContent = ref('');
const svgConRef = ref();
interface FileItem {
  uid: string;
  name?: string;
  status?: string;
  response?: string;
  url?: string;
}
const fileList = ref<FileItem[]>([]);

// 提交表单
const submitFormRef = ref<FormInstance>();
const openDialog = ref(false);
const openUpdateDialog = ref(false);
const openDetailDialog = ref(false);

const submitForm = reactive({
  drawingName: '',
  drawingRoute: '',
  area: '',
  facilityType: '',
  manufacturer: '',
  operationTime: '',
  sqIp: '',
  sqName: '',
  sqStatus: '',
  unit: '',
  upSqId: '',
  upSqName: '',
  upSqType: '',
});

// 自定义验证规则
const formRules: FormRules = {
  area: [{ required: true, message: '设施所属区域未填写', trigger: 'blur' }],
  facilityType: [
    { required: true, message: '设施类型未填写', trigger: 'blur' },
  ],
  manufacturer: [
    { required: true, message: '生产厂家未填写', trigger: 'blur' },
  ],
  operationTime: [
    { required: true, message: '投运时间未填写', trigger: 'blur' },
  ],
  sqIp: [{ required: true, message: '设施IP未填写', trigger: 'blur' }],
  sqName: [{ required: true, message: '设施名称未填写', trigger: 'blur' }],
  sqStatus: [{ required: true, message: '设施状态未选择', trigger: 'blur' }],
  unit: [{ required: true, message: '运维单位未填写', trigger: 'blur' }],
};

// 表格
const data = reactive({
  tableData: [],
  pageInfo: {
    pageSize: 5,
    pageNo: 1,
    total: 10,
  },
});

// 设施类型枚举示例
const facilitiesTypes = [
  { label: '服务器', value: '1' },
  { label: '存储器', value: '2' },
  { label: '网络交换机', value: '3' },
  { label: '防火墙', value: '4' },
  { label: '负载均衡', value: '5' },
  { label: '中间件', value: '6' },
  { label: '数据库', value: '7' },
];

const unitOptions = ['通信公司', '大数据公司'];
const statusOptions = ['正常运行', '运行异常'];

// 查询数据
async function queryData() {
  try {
    const res = await getmonitorSq(queryForm);
    if (res) {
      data.tableData = res.list;
      queryForm.total = res.total;
    }
  } catch (error) {
    console.error('查询数据失败:', error);
  }
}

// 重置查询
function reset() {
  Object.assign(queryForm, {
    facilityType: '',
    manufacturer: '',
    pageNo: 1,
    pageSize: 10,
    total: 0,
    permissionIds: [],
    sqId: '',
    sqIp: '',
    sqName: '',
    sqStatus: '',
    subUnit: true,
    timeRange: [],
    unit: '',
    unitId: '',
    unitIds: [],
    upSqId: '',
  });
  queryData();
}
// 删除设施
// 选中的行数据
const selectedRows = ref<any[]>([]);
// 处理选中行变化
const handleSelectionChange = (val: any[]) => {
  selectedRows.value = val;
};
// 删除选中行
async function deleteSelected() {
  try {
    // 执行删除逻辑
    const selectedIds = selectedRows.value.map((row) => row.sqId);
    for (const id of selectedIds) {
      await deleteMonitorSq({ sqId: id });
    }
    await queryData();
    ElMessage.success('删除成功');
    selectedRows.value = [];
  } catch (error) {
    console.log('删除失败', error);
  }
}

// 查看图纸
async function showImg(row: any) {
  try {
    loading.value = true;
    modalBApi.open();
    let result = await downloadDrawingApi(row.drawingRoute);
    const { data, status } = result;

    if (status >= 200 && status < 400) {
      // 将 &quot; 转为 "
      svgContent.value = data.replace(/&quot;/g, '"');
      if (svgConRef.value) {
        svgConRef.value.innerHTML = svgContent.value;
      }
      caleSvgScale();
    } else {
      ElMessage.error('图纸获取失败');
    }
    loading.value = false;
    getPanzoomElement();
  } catch (error) {
    console.log('error==', error);
    loading.value = false;
  }
}

/**
 * 新增设施
 */
// 新增打开弹窗
function insertSq() {
  openDialog.value = true;
  Object.assign(submitForm, {
    drawingName: '',
    drawingRoute: '',
    area: '',
    facilityType: '',
    manufacturer: '',
    operationTime: '',
    sqIp: '',
    sqName: '',
    sqStatus: '',
    unit: '',
    upSqId: '',
    upSqName: '',
    upSqType: '',
  });
}

// 新增设施 提交表单
async function handleSubmit() {
  if (!submitFormRef.value) return;
  try {
    const isValid = await submitFormRef.value.validate();
    if (!isValid) return;
    if (!validateIP(submitForm.sqIp)) {
      ElMessage.error('请检查设施IP!');
      return;
    }
    if (submitForm.drawingRoute === '') {
      ElMessage.error('请添加附件!');
      return;
    }
    // 验证通过，执行提交逻辑
    await insertMonitorSq(submitForm);
    ElMessage.success('提交成功');
    openDialog.value = false;
    fileList.value = [];
    submitFormRef.value.resetFields();
    queryData();
  } catch {
    // 这里不会执行，因为验证错误已被捕获
    console.log('提交失败');
  }
}

/**
 * 更新设施
 */

function updateData(row: any) {
  openUpdateDialog.value = true;
  Object.assign(submitForm, row);
  //保留原始的文件
  originName.value = row.drawingName;
  originRoute.value = row.drawingRoute;
  submitForm.drawingName = '';
  submitForm.drawingRoute = '';
}

// 展示细节
function showDetail(row: any) {
  openDetailDialog.value = true;
  Object.assign(submitForm, row);
}
async function handleUpdateSubmit() {
  if (!submitFormRef.value) return;
  try {
    const isValid = await submitFormRef.value.validate();
    if (!isValid) return;
    if (submitForm.drawingRoute === '') {
      if (originRoute.value === '') {
        ElMessage.error('请添加附件!');
        return;
      } else {
        submitForm.drawingRoute = originRoute.value;
        submitForm.drawingName = originName.value;
      }
    }
    // 验证通过，执行提交逻辑
    await insertMonitorSq(submitForm);
    ElMessage.success('更新成功');
    openUpdateDialog.value = false;
    fileList.value = [];
    // submitFormRef.value.resetFields();
    queryData();
  } catch {
    // 这里不会执行，因为验证错误已被捕获
    console.log('提交失败');
  }
}

// 取消弹窗
const cancel = () => {
  submitFormRef.value?.resetFields();
  fileList.value = [];
  openDialog.value = false;
  openUpdateDialog.value = false;
};

onMounted(() => {
  queryData();
});

/**
 *  文件上传
 */
function beforeUpload(file: FileItem) {
  // 获取文件后缀
  const fileExtension = file.name.split('.').pop().toLowerCase()
  // 检查文件类型和后缀
  const isValidType = ['.svg'].includes(`.${fileExtension}`)

  if (!isValidType) {
    fileList.value = [];
    ElMessage.warning('不支持上传该文件格式，请上传.svg格式文件')
    return false // 阻止上传
  }
  return true // 允许上传
}

function beforeUpload1(file: FileItem) {
  fileList.value = [];
  // 获取文件后缀
  const fileExtension = file.name.split('.').pop().toLowerCase()
  // 检查文件类型和后缀
  const isValidType = ['.svg'].includes(`.${fileExtension}`)

  if (!isValidType) {
    fileList.value = [];
    ElMessage.warning('不支持上传该文件格式，请上传.svg格式文件')
    return false // 阻止上传
  }
  fileList.value = [file]
  return true // 允许上传
}

// 更新数据 上传前处理
// function beforeUpload1(file: FileItem) {
//   fileList.value = [];
//   deleteFile();
//   fileList.value = [file];
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

// 上传文件
async function uploadFile() {
  if (!fileList.value || fileList.value.length <= 0) {
    ElMessage.warning('请选择上传文件！');
    return;
  }
  uploading.value = true;
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
      uploading.value = false
      return
    }
    if (
      res.status !== 200 ||
      !res.data?.data?.fileName ||
      !res.data?.data?.filePath
    ) {
      uploading.value = false
      fileList.value = []
      ElMessage.error('上传失败!')
      return;
    }

    // 上传成功
    submitForm.drawingName = res.data.data.fileName;
    submitForm.drawingRoute = res.data.data.filePath;
    uploading.value = false
  } catch (error) {
    console.error('上传失败:', error);
    uploading.value = false
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
      data: { filePath: submitForm.drawingRoute },
    }).then((res) => {
      submitForm.drawingName = '';
      submitForm.drawingRoute = '';
    });
  } catch {}
}

// 下载文件
async function downloadAttachment(row: any) {
  try {
    await downloadFile(
      import.meta.env.VITE_NSOSFS + '/monitorSq/facilitySearchExport',
      queryForm,
      '设施台账.xlsx',
      'post',
    );
  } catch {}
}

// 换页查询
function currentChange(val) {
  queryForm.pageNo = val;
  queryData();
}

function handleSizeChange(val: number) {
  queryForm.pageSize = val;
  queryData();
}

const caleSvgScale = () => {
  if (!svgContent.value) {
    return;
  }

  const matchWidth = svgContent.value.match(/width="([^"]*)"/);
  const matchHeight = svgContent.value.match(/height="([^"]*)"/);
  if (matchWidth && matchHeight) {
    let widthStr = matchWidth[1]?.replace('px', ''); // "1215px"
    let heightStr = matchHeight[1]?.replace('px', ''); // "615px"
    let rect = wheelConRef.value.getBoundingClientRect();
    console.log('rect==', rect);
    // 计算缩放比例
    let scaleX = rect.width / Number(widthStr);
    let scaleY = rect.height / Number(heightStr);
    console.log('scaleX==', scaleX, 'scaleY==', scaleY);
    svgTransform.scaleX = scaleX;
    svgTransform.scaleY = scaleY;
  }
};

// 拖动方法
const getPanzoomElement = () => {
  // 存放Panzoom用于后面的其他操作
  panzoom.value = Panzoom(wheelConRef.value, {
    origin: '0 0', // 位置
    // maxScale: 3, // 最大比例,默认值：4
    // minScale: 0, // 最小比例,默认值：0.125
    cursor: 'auto',
    disableZoom: false, // 禁止缩放
    disablePan: false, //禁止平移
    startScale: Math.max(svgTransform.scaleX, svgTransform.scaleY),
    startX: 0,
    startY: 0,
    overflow: 'hidden', // 溢出
    canvas: true, // 是否视为canvas
    setTransform: (elem, { scale, x, y }) => {
      // elem.style.transform = `translate(${x}px, ${y}px) scaleX(${scale})`;
      // elem.style.transform = `scaleX(${svgTransform.scaleX}) scaleY(${svgTransform.scaleY})`;

      // elem.style.transformOrigin = 'left top';

      panzoom.value.setStyle(
        'transform',
        `scale(${scale}) translate(${x}px, ${y}px)`,
      );
    },
  });
  // event 事件监听
  const elem = wheelConRef.value;
  elem.addEventListener('panzoomchange', (event) => {
    console.log('panzoomchange', event);
  });
};
// 监听鼠标滚轮
const wheel = (event) => {
  event.preventDefault();
  panzoom.value.zoomWithWheel(event);
};
</script>
<template>
  <div>
    <div style="padding: 0 20px">
      <el-form :inline="true" :model="queryForm" label-position="right">
        <el-form-item label="设施ID:" style="width: 300px">
          <el-input v-model="queryForm.sqId" clearable />
        </el-form-item>
        <el-form-item label="设施名称:" style="width: 300px">
          <el-input v-model="queryForm.sqName" clearable />
        </el-form-item>
        <el-form-item label="设施IP:" style="width: 300px">
          <el-input v-model="queryForm.sqIp" clearable />
        </el-form-item>
        <el-form-item label="上游节点ID:" style="width: 300px">
          <el-input v-model="queryForm.upSqId" clearable />
        </el-form-item>
        <el-form-item label="投运时间:" style="width: 320px">
          <el-date-picker
            v-model="queryForm.timeRange"
            type="daterange"
            :size="size"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="生产厂家:" style="width: 300px">
          <el-input v-model="queryForm.manufacturer" clearable />
        </el-form-item>
        <el-form-item label="运维单位:" style="width: 300px">
          <ElSelect
            v-model="queryForm.unit"
            placeholder="请选择运维单位"
            clearable
          >
            <el-option
              v-for="(item, index) in unitOptions"
              :key="index"
              :label="item"
              :value="item"
            />
          </ElSelect>
        </el-form-item>
        <el-form-item label="设施类型:" style="width: 300px">
          <ElSelect
            v-model="queryForm.facilityType"
            placeholder="请选择设施类型"
            clearable
          >
            <el-option
              v-for="(item, index) in facilitiesTypes"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </ElSelect>
        </el-form-item>
        <el-form-item label="设施状态:" style="width: 300px">
          <ElSelect
            v-model="queryForm.sqStatus"
            placeholder="请选择设施状态"
            clearable
          >
            <el-option
              v-for="(item, index) in statusOptions"
              :key="index"
              :label="item"
              :value="item"
            />
          </ElSelect>
        </el-form-item>
        <el-form-item style="width: auto">
          <ElButton type="primary" :icon="Search" @click="queryData"
            >查询</ElButton
          >
          <ElButton type="primary" @click="insertSq" :icon="Plus"
            >新增</ElButton
          >
          <ElButton type="primary" @click="downloadAttachment" :icon="Download"
            >导出</ElButton
          >
          <el-popconfirm
            title="确认要删除选中的数据吗?"
            @confirm="deleteSelected"
            width="150px"
            confirm-button-text="确认"
            cancel-button-text="取消"
          >
            <template #reference>
              <ElButton
                type="danger"
                :disabled="selectedRows.length === 0"
                :icon="Delete"
                >删除</ElButton
              >
            </template>
          </el-popconfirm>

          <ElButton type="info" @click="reset" :icon="Refresh">重置</ElButton>
        </el-form-item>
      </el-form>
    </div>
    <div style="padding: 0 20px 10px 20px">
      <ElTable
        ref="tab"
        border
        stripe
        :data="data.tableData"
        height="660px"
        @selection-change="handleSelectionChange"
      >
        <ElTableColumn type="index" align="center" />
        <ElTableColumn type="selection" align="center" />
        <ElTableColumn prop="sqId" align="center" label="设施ID">
          <template #default="scope">
            <span
              style="color: #32b0f2 !important; cursor: pointer"
              @click="showDetail(scope.row)"
              >{{ scope.row.sqId }}</span
            >
          </template>
        </ElTableColumn>
        <ElTableColumn prop="sqName" align="center" label="设施名称" />
        <ElTableColumn align="center" label="设施状态">
          <template #default="scope">
            <el-tag
              effect="dark"
              type="success"
              v-if="scope.row.sqStatus === '正常运行'"
            >
              {{ scope.row.sqStatus }}
            </el-tag>
            <el-tag effect="dark" type="warning" v-else>
              {{ scope.row.sqStatus }}
            </el-tag>
          </template>
        </ElTableColumn>
        <ElTableColumn align="center" label="上游节点ID">
          <template #default="scope">
            <span style="color: #32b0f2 !important">{{
              scope.row.upSqId
            }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="facilityType" align="center" label="设施类型">
          <template #default="scope">
            <span>{{
              facilitiesTypes.find(
                (item) => item.value === scope.row.facilityType,
              )?.label || ''
            }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="manufacturer" align="center" label="生产厂家" />
        <ElTableColumn prop="unit" align="center" label="运维单位" />
        <ElTableColumn prop="area" align="center" label="设施所属区域" />
        <ElTableColumn prop="upSqName" align="center" label="上游节点名称" />
        <ElTableColumn prop="sqIp" align="center" label="设备IP" />
        <ElTableColumn prop="operationTime" align="center" label="投运时间" />
        <ElTableColumn align="center" label="操作">
          <template #default="scope">
            <el-button link type="primary" @click="updateData(scope.row)"
              >编辑</el-button
            >
            <el-button link type="primary" @click="showImg(scope.row)"
              >查看图纸</el-button
            >
          </template>
        </ElTableColumn>
      </ElTable>
    </div>
    <div style="padding-left: 20px; display: flex">
      <ElPagination
        v-model:current-page="queryForm.pageNo"
        v-model:page-size="queryForm.pageSize"
        :total="queryForm.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="currentChange"
      />
    </div>
    <ElDialog
      v-model="openDialog"
      @close="cancel"
      title="新增设施"
      width="1000"
      class="system-detail-dialog"
    >
      <div v-load="uploading">
      <ElForm
        ref="submitFormRef"
        :model="submitForm"
        :rules="formRules"
        label-width="auto"
      >
        <ElRow>
          <ElCol :span="8">
            <ElFormItem
              label="设施名称:"
              prop="sqName"
              style="width: 100%"
              required
            >
              <ElInput
                v-model="submitForm.sqName"
                placeholder="请输入设施名称"
                clearable
                :maxlength="50"
                style="width: 250px"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem
              label="设施类型:"
              prop="facilityType"
              style="width: 100%"
              required
            >
              <ElSelect
                v-model="submitForm.facilityType"
                placeholder="请选择设施类型"
              >
                <el-option
                  v-for="(item, index) in facilitiesTypes"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </ElSelect>
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem
              label="生产厂家:"
              prop="manufacturer"
              style="width: 100%"
              required
            >
              <ElInput
                v-model="submitForm.manufacturer"
                placeholder="请输入生产厂家"
                clearable
                :maxlength="50"
                style="width: 250px"
              />
            </ElFormItem>
          </ElCol>
        </ElRow>
        <ElRow>
          <ElCol :span="8">
            <ElFormItem
              label="投运时间:"
              prop="operationTime"
              style="width: 100%"
              required
            >
              <el-date-picker
                v-model="submitForm.operationTime"
                type="datetime"
                value-format="YYYY-MM-DD hh:mm:ss"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem
              label="运维单位:"
              prop="unit"
              style="width: 100%"
              required
            >
              <ElSelect v-model="submitForm.unit" placeholder="请选择运维单位">
                <el-option
                  v-for="(item, index) in unitOptions"
                  :key="index"
                  :label="item"
                  :value="item"
                />
              </ElSelect>
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem
              label="设施IP:"
              prop="sqIp"
              style="width: 100%"
              required
            >
              <ElInput
                v-model="submitForm.sqIp"
                placeholder="请输入设施IP"
                clearable
                :maxlength="20"
                style="width: 250px"
              />
            </ElFormItem>
          </ElCol>
        </ElRow>
        <ElRow>
          <ElCol :span="8">
            <ElFormItem
              label="设施所属区域:"
              prop="area"
              style="width: 100%"
              required
            >
              <ElSelect v-model="submitForm.area" placeholder="请选择区域">
                <el-option label="Ⅳ区" value="Ⅳ区" />
                <el-option label="Ⅴ区" value="Ⅴ区" />
              </ElSelect>
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem
              label="设施状态:"
              prop="sqStatus"
              style="width: 100%"
              required
            >
              <ElSelect
                v-model="submitForm.sqStatus"
                placeholder="请输入设施状态"
              >
                <el-option label="正常运行" value="正常运行" />
                <el-option label="运行异常" value="运行异常" />
              </ElSelect>
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem
              label="上游设施类型:"
              prop="upSqType"
              style="width: 100%"
            >
              <ElSelect
                v-model="submitForm.upSqType"
                placeholder="请选择设施类型"
              >
                <el-option
                  v-for="(item, index) in facilitiesTypes"
                  :key="index"
                  :label="item.label"
                  :value="item.label"
                />
              </ElSelect>
            </ElFormItem>
          </ElCol>
        </ElRow>
        <ElRow>
          <ElCol :span="8">
            <ElFormItem label="上游设施ID:" prop="upSqId" style="width: 100%">
              <ElInput
                v-model="submitForm.upSqId"
                placeholder=""
                clearable
                :maxlength="50"
                style="width: 250px"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem
              label="上游设施名称:"
              prop="upSqName"
              style="width: 100%"
            >
              <ElInput
                v-model="submitForm.upSqName"
                placeholder=""
                clearable
                :maxlength="50"
                style="width: 250px"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8" />
        </ElRow>
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
            accept=".svg"
          >
            <el-button type="success">上传图纸</el-button>
            <template #tip>
              <div class="el-upload__tip">支持上传SVG格式图像</div>
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
      v-model="openUpdateDialog"
      title="更新设施"
      width="1000"
      class="system-detail-dialog"
    >
     <div v-load="uploading">
      <ElForm
        ref="submitFormRef"
        :model="submitForm"
        :rules="formRules"
        label-width="auto"
      >
        <ElRow>
          <ElCol :span="8">
            <ElFormItem
              label="设施名称:"
              prop="sqName"
              style="width: 100%"
              required
            >
              <ElInput
                v-model="submitForm.sqName"
                placeholder="请输入设施名称"
                clearable
                :maxlength="50"
                style="width: 250px"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem
              label="设施类型:"
              prop="facilityType"
              style="width: 100%"
              required
            >
              <ElSelect
                v-model="submitForm.facilityType"
                placeholder="请选择设施类型"
              >
                <el-option
                  v-for="(item, index) in facilitiesTypes"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </ElSelect>
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem
              label="生产厂家:"
              prop="manufacturer"
              style="width: 100%"
              required
            >
              <ElInput
                v-model="submitForm.manufacturer"
                placeholder="请输入生产厂家"
                clearable
                :maxlength="50"
                style="width: 250px"
              />
            </ElFormItem>
          </ElCol>
        </ElRow>
        <ElRow>
          <ElCol :span="8">
            <ElFormItem
              label="投运时间:"
              prop="operationTime"
              style="width: 100%"
              required
            >
              <el-date-picker
                v-model="submitForm.operationTime"
                type="datetime"
                value-format="YYYY-MM-DD hh:mm:ss"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem
              label="运维单位:"
              prop="unit"
              style="width: 100%"
              required
            >
              <ElSelect v-model="submitForm.unit" placeholder="请选择运维单位">
                <el-option
                  v-for="(item, index) in unitOptions"
                  :key="index"
                  :label="item"
                  :value="item"
                />
              </ElSelect>
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem
              label="设施IP:"
              prop="sqIp"
              style="width: 100%"
              required
            >
              <ElInput
                v-model="submitForm.sqIp"
                placeholder="请输入设施IP"
                clearable
                :maxlength="20"
                style="width: 250px"
              />
            </ElFormItem>
          </ElCol>
        </ElRow>
        <ElRow>
          <ElCol :span="8">
            <ElFormItem
              label="设施所属区域:"
              prop="area"
              style="width: 100%"
              required
            >
              <ElSelect v-model="submitForm.area" placeholder="请选择区域">
                <el-option label="Ⅳ区" value="Ⅳ区" />
                <el-option label="Ⅴ区" value="Ⅴ区" />
              </ElSelect>
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem
              label="设施状态:"
              prop="sqStatus"
              style="width: 100%"
              required
            >
              <ElSelect
                v-model="submitForm.sqStatus"
                placeholder="请输入设施状态"
              >
                <el-option label="正常运行" value="正常运行" />
                <el-option label="运行异常" value="运行异常" />
              </ElSelect>
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem
              label="上游设施类型:"
              prop="upSqType"
              style="width: 100%"
            >
              <ElSelect
                v-model="submitForm.upSqType"
                placeholder="请选择设施类型"
              >
                <el-option
                  v-for="(item, index) in facilitiesTypes"
                  :key="index"
                  :label="item.label"
                  :value="item.label"
                />
              </ElSelect>
            </ElFormItem>
          </ElCol>
        </ElRow>
        <ElRow>
          <ElCol :span="8">
            <ElFormItem label="上游设施ID:" prop="upSqId" style="width: 100%">
              <ElInput
                v-model="submitForm.upSqId"
                placeholder=""
                clearable
                :maxlength="50"
                style="width: 250px"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem
              label="上游设施名称:"
              prop="upSqName"
              style="width: 100%"
            >
              <ElInput
                v-model="submitForm.upSqName"
                placeholder=""
                clearable
                :maxlength="50"
                style="width: 250px"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8" />
        </ElRow>
        <ElRow>
          <el-upload
            ref="upload"
            class="upload-demo"
            v-model:file-list="fileList"
            :limit="1"
            :before-upload="beforeUpload1"
            :on-remove="handleRemove"
            :show-file-list="true"
            :http-request="uploadFile"
            accept=".svg"
          >
            <el-button type="success">更新图纸</el-button>
            <template #tip>
              <div class="el-upload__tip">支持上传SVG格式图像</div>
            </template>
          </el-upload>
        </ElRow>
      </ElForm>
      </div>
      <div style="display: flex; margin-right: 10px">
        <div style="margin-top: 10px; margin-left: auto">
          <ElButton type="primary" @click="handleUpdateSubmit">确定</ElButton>
          <ElButton @click="openUpdateDialog = false">取消</ElButton>
        </div>
      </div>
    </ElDialog>
    <ElDialog
      v-model="openDetailDialog"
      title="设施详情"
      width="1000"
      class="system-detail-dialog"
    >
      <ElForm
        ref="submitFormRef"
        :model="submitForm"
        :rules="formRules"
        label-width="auto"
      >
        <ElRow>
          <ElCol :span="8">
            <ElFormItem label="设施名称:" prop="sqName" style="width: 100%">
              <ElInput
                v-model="submitForm.sqName"
                placeholder="请输入设施名称"
                clearable
                style="width: 250px"
                disabled
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem
              label="设施类型:"
              prop="facilityType"
              style="width: 100%"
            >
              <ElSelect
                v-model="submitForm.facilityType"
                placeholder="请选择设施类型"
                disabled
              >
                <el-option
                  v-for="(item, index) in facilitiesTypes"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </ElSelect>
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem
              label="生产厂家:"
              prop="manufacturer"
              style="width: 100%"
            >
              <ElInput
                v-model="submitForm.manufacturer"
                placeholder="请输入生产厂家"
                clearable
                style="width: 250px"
                disabled
              />
            </ElFormItem>
          </ElCol>
        </ElRow>
        <ElRow>
          <ElCol :span="8">
            <ElFormItem
              label="投运时间:"
              prop="operationTime"
              style="width: 100%"
            >
              <el-date-picker
                v-model="submitForm.operationTime"
                type="datetime"
                value-format="YYYY-MM-DD hh:mm:ss"
                disabled
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="运维单位:" prop="unit" style="width: 100%">
              <ElSelect
                v-model="submitForm.unit"
                placeholder="请选择运维单位"
                disabled
              >
                <el-option
                  v-for="(item, index) in unitOptions"
                  :key="index"
                  :label="item"
                  :value="item"
                />
              </ElSelect>
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="设施IP:" prop="sqIp" style="width: 100%">
              <ElInput
                v-model="submitForm.sqIp"
                placeholder="请输入设施IP"
                clearable
                style="width: 250px"
                disabled
              />
            </ElFormItem>
          </ElCol>
        </ElRow>
        <ElRow>
          <ElCol :span="8">
            <ElFormItem label="设施所属区域:" prop="area" style="width: 100%">
              <ElInput
                v-model="submitForm.area"
                placeholder="请输入区域"
                clearable
                style="width: 250px"
                disabled
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="设施状态:" prop="sqStatus" style="width: 100%">
              <ElSelect
                v-model="submitForm.sqStatus"
                placeholder="请输入设施状态"
                disabled
              >
                <el-option label="正常运行" value="正常运行" />
                <el-option label="运行异常" value="运行异常" />
              </ElSelect>
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem
              label="上游设施类型:"
              prop="upSqType"
              style="width: 100%"
            >
              <ElInput
                v-model="submitForm.upSqType"
                placeholder=""
                clearable
                style="width: 250px"
                disabled
              />
            </ElFormItem>
          </ElCol>
        </ElRow>
        <ElRow>
          <ElCol :span="8">
            <ElFormItem label="上游设施ID:" prop="upSqId" style="width: 100%">
              <ElInput
                v-model="submitForm.upSqId"
                placeholder=""
                clearable
                style="width: 250px"
                disabled
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem
              label="上游设施名称:"
              prop="upSqName"
              style="width: 100%"
            >
              <ElInput
                v-model="submitForm.upSqName"
                placeholder=""
                clearable
                style="width: 250px"
                disabled
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8" />
        </ElRow>
      </ElForm>
    </ElDialog>
    <ModalB
      class="custom-modal-b w-[1300px]"
      title="图纸详情"
      :footer="false"
      :closeOnClickModal="false"
      :draggable="true"
    >
      <div v-loading="loading" style="height: 650px">
        <div ref="wheelConRef" @wheel="wheel" style="height: 100%">
          <div id="svg" ref="svgConRef" style="height: 100%"></div>
        </div>
        <div v-if="!svgContent" class="my-empty-con">
          <el-empty description="未加载到图纸" :image-size="100" />
        </div>
      </div>
    </ModalB>
  </div>
</template>
<style lang="less" scoped>
// :deep(.el-form-item) {
//   width: 270px;
//   .el-form-item__content {
//     display: flex;
//     justify-content: flex-end;
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
.my-empty-con {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  // background-color: #bebcbc;
  :deep(.el-empty) {
    height: 100%;
  }
  :deep(.el-empty__description) p {
    font-size: 20px;
    color: #666;
  }
}
// 弹窗
:deep(.el-dialog__title) {
  color: black;
  font-size: 20px;
  font-weight: 500;
}
</style>
