<template>
  <el-container>
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="queryForm"
      label-position="right"
      style="padding: 16px 20px 0"
    >
      <el-form-item label="图纸编号:" prop="drawingCode">
        <el-input
          style="width: 180px"
          v-model="queryForm.drawingCode"
          maxlength="50"
        />
      </el-form-item>
      <el-form-item label="图纸名称:" prop="drawingName">
        <el-input
          style="width: 180px"
          v-model="queryForm.drawingName"
          maxlength="50"
        />
      </el-form-item>
      <el-form-item label="图纸质量:" prop="drawingQuality">
        <el-select
          v-model="queryForm.drawingQuality"
          style="width: 180px"
          placeholder="请选择"
          clearable
          filterable
        >
          <el-option label="无异常" value="0"></el-option>
          <el-option label="有异常" value="1"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :icon="Search" @click="query">查询</el-button>
        <el-button type="primary" :icon="Upload" @click="modalApi.open()"
          >上传</el-button
        >
        <el-button type="primary" :icon="CircleCheck" @click="drawingValid('')"
          >质量核查</el-button
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
        height="720"
      >
        <el-table-column type="selection" />
        <el-table-column type="index" align="center" />

        <el-table-column prop="drawingCode" label="图纸编号" align="center">
        </el-table-column>
        <el-table-column prop="drawingName" label="图纸名称" align="center">
        </el-table-column>
        <el-table-column prop="drawingSize" label="图纸大小" align="center">
        </el-table-column>

        <el-table-column prop="drawingQuality" label="图纸质量" align="center">
          <template #default="scope">
            <el-link
              v-if="scope.row.drawingQuality == 0"
              :underline="false"
              class="always-underline"
              @click="lookValidResult(scope.row)"
              >无异常</el-link
            >
            <el-link
              v-else-if="scope.row.drawingQuality == 1"
              type="danger"
              :underline="false"
              class="always-underline"
              @click="lookValidResult(scope.row)"
              >有异常</el-link
            ><span v-else>—</span>
          </template>
        </el-table-column>
        <el-table-column prop="creatorId" label="创建人" align="center">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center">
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button type="primary" link @click="lookDrawingFile(scope.row)"
              >查看</el-button
            >
            <el-button type="primary" link @click="drawingValid(scope.row)"
              >质量核查</el-button
            >
            <el-button type="danger" link @click="deleteDrawingInfo(scope.row)"
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

    <Modal
      class="custom-modal w-[1300px]"
      title="上传图纸"
      :footer="false"
      :closeOnClickModal="false"
      :draggable="true"
    >
      <el-form
        ref="modalFormRef"
        :inline="true"
        :model="modalFormData"
        :rules="rules"
        label-position="right"
        label-width="auto"
        style="padding: 16px 0 0"
      >
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="图纸名称：" prop="drawingName">
              <el-input
                v-model="modalFormData.drawingName"
                clearable
                style="width: 100%"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item label="所属系统：" prop="systemName">
              <el-input
                v-model="modalFormData.systemName"
                clearable
                style="width: 100%"
              />
            </el-form-item>
          </el-col> -->
        </el-row>

        <el-upload
          ref="uploadRef"
          class="upload-con"
          drag
          :limit="1"
          :auto-upload="false"
          :on-exceed="handleExceed"
          :on-change="handleChange"
          accept=".svg"
        >
          <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
          <div class="el-upload__text">
            将svg文件拖放到这里或 <em>点击选择</em>
          </div>
          <!-- <template #tip>
            <div class="el-upload__tip">
              jpg/png files with a size less than 500kb
            </div>
          </template> -->
        </el-upload>
      </el-form>

      <div class="my-10 flex" style="justify-content: center">
        <ElButton @click="modalApi.close()">关闭</ElButton>
        <ElButton type="primary" @click="saveDrawingInfo">保存</ElButton>
      </div>
    </Modal>

    <ModalB
      class="custom-modal w-[1300px]"
      title="图纸详情"
      :footer="false"
      :closeOnClickModal="false"
      :draggable="true"
    >
      <div v-loading="loading" class="drawing-con">
        <div ref="wheelConRef" @wheel="wheel" style="height: 100%">
          <div id="svg" ref="svgConRef" style="height: 100%"></div>
        </div>
      </div>
    </ModalB>

    <ModalC
      class="custom-modal w-[1300px]"
      title="核查结果"
      :footer="false"
      :closeOnClickModal="false"
      :draggable="true"
    >
      <ValidResult :drawingId="selectDrawingId"> </ValidResult>
    </ModalC>
  </el-container>
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
  ElUpload,
  ElMain,
  ElFooter,
  ElMessage,
  ElMessageBox,
  genFileId,
} from 'element-plus';
import {
  Search,
  RefreshLeft,
  Delete,
  Download,
  Upload,
  UploadFilled,
  Monitor,
  CirclePlus,
  CircleCheck,
} from '@element-plus/icons-vue';
import { Page } from '@vben/common-ui';
import { ref, reactive, computed, onMounted } from 'vue';
import { useVbenModal } from '@vben/common-ui';
// 引入插件
import Panzoom from '@panzoom/panzoom';
import {
  queryDrawingInfoListApi,
  uploadDrawingFileApi,
  saveDrawingInfoApi,
  deleteDrawingFileApi,
  deleteDrawingInfoApi,
  downloadDrawingFileApi,
  drawingValidApi,
} from '#/api';
import ValidResult from './validResult.vue';

defineOptions({
  name: 'DrawingInfoList',
});

const modalFormRef = ref();
const modalFormData = ref({});
const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
});

const [ModalB, modalBApi] = useVbenModal({
  onCancel() {
    modalBApi.close();
  },
});

const [ModalC, modalCApi] = useVbenModal({
  onCancel() {
    modalCApi.close();
  },
});

const queryFormRef = ref();
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);
const table = ref(null);
const tableData = ref([]);
const selectedRows = ref([]);
const queryForm = reactive({});
const loading = ref(false);
const svgConRef = ref();
const svgContent = ref('');
const selectDrawingId = ref('');

const svgTransform = reactive({
  scaleX: 1,
  scaleY: 1,
});
// 拖拽、缩放对象
const panzoom = ref(null);
const wheelConRef = ref();

const rules = reactive({
  drawingName: [{ required: true, message: '请输入图纸名称' }],
  // systemName: [{ required: true, message: '请输入系统名称' }],
});

const uploadRef = ref();
const uploadFileList = ref([]);

// 超出限制执行函数
const handleExceed = (files) => {
  uploadRef.value!.clearFiles();
  const file = files[0];
  file.uid = genFileId();
  uploadRef.value!.handleStart(file);
};
const handleChange = (uploadFile, uploadFiles) => {
  uploadFileList.value = uploadFiles;
};

const saveDrawingInfo = () => {
  if (!modalFormRef.value) return false;
  modalFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      if (!uploadFileList.value || uploadFileList.value.length <= 0) {
        ElMessage.warning('请选择图纸文件！');
        return;
      }
      try {
        let params = new FormData();
        params.append('file', uploadFileList.value[0]?.raw);
        let result = await uploadDrawingFileApi(params);
        if (result) {
          let params = {
            drawingName: modalFormData.value.drawingName,
            drawingSize: result.fileSize,
            drawingPath: result.filePath,
          };
          result = await saveDrawingInfoApi(params);
          ElMessage.success('保存成功！');
          modalApi.close();
          query();
        }
      } catch {}
    } else {
      ElMessage.warning('请输入必填项！');
    }
  });
};

const lookDrawingFile = async (row) => {
  try {
    loading.value = true;
    modalBApi.open();
    let result = await downloadDrawingFileApi(row.drawingPath);
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
};

const lookValidResult = (row) => {
  selectDrawingId.value = row.id;
  modalCApi.open();
};

const deleteDrawingInfo = (row) => {
  ElMessageBox.confirm('确定要删除这条图纸信息吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        let result = await deleteDrawingFileApi({ filePath: row.drawingPath });
        if (result) {
          result = await deleteDrawingInfoApi([row.id]);
          if (result) {
            ElMessage.success('删除成功');
            query();
          } else {
            ElMessage.error('删除失败');
          }
        } else {
          ElMessage.error('删除失败');
        }
      } catch {}
    })
    .catch(() => {
      // ElMessage.info('已取消删除');
    });
};

// 图纸质量核查
const drawingValid = (row) => {
  if (selectedRows.value.length === 0 && !row) {
    ElMessage.warning('请选择要核查的数据');
    return;
  }
  let message = '';
  if (row) {
    message = '确认核查此图纸吗？';
  } else {
    message = '确认核查已选图纸吗？';
  }
  ElMessageBox.confirm(message, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    let ids = [];
    if (row) {
      ids = [row.id];
    } else {
      ids = selectedRows.value.map((item) => item.id);
    }
    try {
      let result = await drawingValidApi(ids);
      ElMessage.success('核查成功');
      query();
    } catch (e) {}
  });
};

/**
 * 查询
 */
const query = async () => {
  let params = {
    pageNo: currentPage.value,
    pageSize: pageSize.value,
    ...queryForm,
  };
  try {
    const result = await queryDrawingInfoListApi(params);
    tableData.value = result.records;
    total.value = result.total;
  } catch {}
};

const handleSelectionChange = (val) => {
  selectedRows.value = val;
};

const resetQueryForm = () => {
  // 重置查询表单
  queryFormRef.value?.resetFields();
  query();
};

const handleSizeChange = (size: number) => {
  pageSize.value = size;
  query();
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  query();
};

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
    // console.log('panzoomchange', event);
  });
};
// 监听鼠标滚轮
const wheel = (event) => {
  event.preventDefault();
  panzoom.value.zoomWithWheel(event);
};

onMounted(async () => {
  query();
});
</script>

<style scoped>
.custom-modal {
  .el-row {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
  .el-form-item {
    width: 100%;
    margin-right: 0;
  }
}
.el-main {
  padding-top: 0;
}
.cell {
  text-align: center;
}

.always-underline :deep(.el-link__inner) {
  text-decoration: underline !important;
}
</style>

<style>
.drawing-con {
  height: calc(100vh - 10vh - 150px);
}
</style>
