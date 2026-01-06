<template>
  <div class="flex" style="width: 100%; height: 100%; flex-direction: column">
    <el-container>
      <el-form
        ref="queryFormRef"
        :inline="true"
        :model="queryForm"
        label-position="right"
        style="padding: 16px 20px 0"
      >
        <el-form-item label="单位名称:" prop="unitName">
          <el-input
            style="width: 180px"
            v-model="queryForm.unitName"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="query"
            >查询</el-button
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
          v-loading="loading"
          :element-loading-text="loadingText"
          :data="tableData"
          style="width: 100%; height: 720px"
        >
          <el-table-column type="index" align="center" />
          <el-table-column
            prop="unitName"
            label="单位名称"
            align="center"
            width="220"
          >
          </el-table-column>
          <el-table-column prop="topoName" label="布防图名称" align="center">
          </el-table-column>
          <el-table-column prop="adminId" label="创建人" align="center">
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center">
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间" align="center">
          </el-table-column>

          <el-table-column label="操作" align="center">
            <template #default="scope">
              <el-button
                v-if="scope.row.path"
                type="primary"
                link
                @click="lookSvg(scope.row)"
                >查看</el-button
              >
              <el-button
                v-if="scope.row.path"
                type="primary"
                link
                @click="editGraphicEle(scope.row)"
                >图元管理</el-button
              >
              <el-button type="primary" link @click="makePic(scope.row)"
                >作图</el-button
              >
              <el-button
                v-if="scope.row.path"
                type="danger"
                link
                @click="deleteTopo(scope.row)"
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
    <!-- 布防图详情 -->
    <el-dialog
      v-model="dialogData.visible"
      :title="dialogData.title"
      width="1250"
    >
      <div v-show="dialogData.visible" v-loading="loading">
        <div style="min-height: 600px" ref="wheelConRef" @wheel="wheel">
          <div id="svg" ref="svgConRef" style="height: 100%"></div>
        </div>
      </div>
      <!-- <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="dialogData.visible = false">
            关闭
          </el-button>
        </div>
      </template> -->
    </el-dialog>

    <!-- 图元管理 -->
    <el-dialog
      v-model="graphicMgtDialogData.visible"
      :title="graphicMgtDialogData.title"
      width="1800"
    >
      <GraphicElementMgt
        v-if="graphicMgtDialogData.visible"
        :topoId="graphicMgtDialogData.topoId"
      ></GraphicElementMgt>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            type="primary"
            @click="graphicMgtDialogData.visible = false"
          >
            关闭
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
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
  ElMessage,
  ElDialog,
  ElMessageBox,
} from 'element-plus';
import {
  Search,
  RefreshLeft,
  Delete,
  Download,
  Monitor,
  CirclePlus,
  CircleCheck,
} from '@element-plus/icons-vue';
import { Page } from '@vben/common-ui';
import {
  ref,
  reactive,
  computed,
  onMounted,
  onBeforeUnmount,
  nextTick,
} from 'vue';
import { useAccessStore, useUserStore } from '@vben/stores';
import axios from 'axios';
import drawioEmbed from 'drawio-embed';
// 引入插件
import Panzoom from '@panzoom/panzoom';
import {
  queryDeploymentMapListApi,
  saveElementSystemApi,
  getTopoFileContentApi,
  deleteTopoViewApi,
  getDrawioServicePathApi,
} from '#/api';
import GraphicElementMgt from '#/views/safetyCommandMgt/graphicElementMgt/index.vue';

defineOptions({
  name: 'DeploymentMapMgt',
});

// 初始化 drawio
let openDrawio = null;
// 记录打开drawio次数
const openDrawioCount = ref(0);
// 确保注册一次
let isListenerRegistered = false;
const queryFormRef = ref();
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);
const table = ref(null);
const tableData = ref([]);
const queryForm = reactive({
  unitName: '',
});
const uploadData = reactive({
  fileName: '',
  id: '',
});
const dialogData = ref({
  title: '',
  visible: false,
});
// 拖拽、缩放对象
const panzoom = ref(null);
const wheelConRef = ref();
const loading = ref(false);
const loadingText = ref('Loading...');
const svgConRef = ref();
const svgContent = ref('');
const svgContentMap = new Map();

const graphicMgtDialogData = ref({
  title: '',
  visible: false,
  topoId: '',
});

// 开始作图
const makePic = async (row) => {
  if (!openDrawio) {
    try {
      // let drawioPath = 'http://localhost:8777?dev=1';
      let drawioPath = await getDrawioServicePathApi();
      openDrawio = drawioEmbed(drawioPath);
    } catch {
      ElMessage.error('获取drawio服务地址失败！');
      return;
    }
  }
  uploadData.fileName =
    row.unitName?.replace('电网有限责任公司', '省公司') + '布防图';
  uploadData.id = row.id;
  loading.value = true;
  loadingText.value = 'Loading...';
  try {
    // 先从缓存取
    let content = svgContentMap.get(row.id);
    if (!content) {
      content = await getSvgContent(row.id);
    }
    openDrawioView(content);
  } catch {
    loading.value = false;
  }
};

/**
 * 尝试打开drawio编辑器
 * @param content 布防图文件内容
 */
const openDrawioView = async (content: string) => {
  if (openDrawioCount.value >= 5) {
    console.log('超时关闭');
    loading.value = false;
    openDrawioCount.value = 0;
    ElMessage.error('布防图编辑器打开失败，请重试');
    return;
  }
  openDrawioCount.value++;
  try {
    let result = openDrawio(content);
    if (result) {
      result.catch(() => {
        setTimeout(() => {
          openDrawioView(content);
        }, 1000);
      });
      return;
    }
    loading.value = false;
    openDrawioCount.value = 0;
  } catch {
    loading.value = false;
    openDrawioCount.value = 0;
  }
};

/**
 * 查看布防图
 * @param row
 */
const lookSvg = async (row) => {
  loading.value = true;
  loadingText.value = 'Loading...';
  dialogData.value.visible = true;
  dialogData.value.title = row.topoName;
  try {
    // 先从缓存取
    svgContent.value = svgContentMap.get(row.id);
    if (!svgContent.value) {
      svgContent.value = await getSvgContent(row.id);
    }
    loading.value = false;
    nextTick(() => {
      if (svgConRef.value) {
        svgConRef.value.innerHTML = svgContent.value;
      }
    });
  } catch (error) {
    loading.value = false;
    ElMessage.error('查看布防图失败');
  }
  getPanzoomElement();
};
// 获取布防图文件内容
const getSvgContent = async (topoId) => {
  try {
    // 默认获取网级布防图 id为 101
    let res = await getTopoFileContentApi(topoId);
    let status = res.status;
    if (status >= 200 && status < 400) {
      // 缓存布防图
      svgContentMap.set(topoId, res.data);
      // downloadStringAsFile(res.data, '挂图作战', 'image/svg+xml');
      return res.data;
    } else {
      return null;
    }
  } catch {}
  return null;
};

const downloadStringAsFile = (content, filename, mimeType = 'text/plain') => {
  // 创建 Blob 对象
  const blob = new Blob([content], { type: mimeType });

  // 创建下载链接
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;

  // 触发下载
  document.body.append(a);
  a.click();

  // 清理
  setTimeout(() => {
    a.remove();
    URL.revokeObjectURL(url);
  }, 100);
};

/**
 * 图元管理
 * @param row
 */
const editGraphicEle = (row) => {
  graphicMgtDialogData.value.visible = true;
  graphicMgtDialogData.value.title =
    row.topoName.replace('.svg', '') + '-图元管理';
  graphicMgtDialogData.value.topoId = row.id;
};

/**
 * 删除布防图数据
 * @param row 删除行
 */
const deleteTopo = (row) => {
  ElMessageBox.confirm(
    '删除后，布防图图元关联的IP、系统也一并删除！',
    '确认删除该布防图吗? ',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
    .then(async () => {
      try {
        let result = await deleteTopoViewApi({ id: row.id });
        if (result) {
          // 删除成功后，清空缓存
          svgContentMap.delete(uploadData.id);
          svgContent.value = '';
          ElMessage.success('删除成功！');
          query();
        }
      } catch {}
    })
    .catch((error) => {});
};

/**
 * 查询
 */
const query = async () => {
  loading.value = true;
  loadingText.value = 'Loading...';
  let params = {
    pageNo: currentPage.value,
    pageSize: pageSize.value,
    unitName: queryForm.unitName,
  };
  try {
    const result = await queryDeploymentMapListApi(params);
    tableData.value = result.list;
    total.value = result.total;
  } catch {}
  loading.value = false;
};

const formatToken = (token) => {
  return token ? `Bearer ${token}` : null;
};

/**
 * 保存布防图数据
 */
const updateData = async (imageContent: string) => {
  const blob = new Blob([imageContent], { type: 'image/svg+xml' });
  const svgFile = new File([blob], uploadData.fileName, {
    type: 'image/svg+xml',
  });
  let params = new FormData();
  params.append('file', svgFile);
  params.append('id', uploadData.id);
  params.append('fileName', uploadData.fileName);
  const accessStore = useAccessStore();
  try {
    const response = await axios({
      url: import.meta.env.VITE_NSOSSECURITY + '/topoViewData/uploadSvg',
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: formatToken(accessStore.accessToken),
      },
      data: params,
    });
    const { data: responseData, status } = response;
    const { code, data } = responseData;
    if (status >= 200 && status < 400 && (code === 0 || code == 200)) {
      // 保存成功后，清空缓存
      svgContentMap.delete(uploadData.id);
      // 保存后查询
      query();
    } else {
      throw new Error(responseData.msg || '上传失败');
    }
  } catch (error) {
    throw error;
  }
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

// 拖动方法
const getPanzoomElement = () => {
  // 存放Panzoom用于后面的其他操作
  panzoom.value = Panzoom(wheelConRef.value, {
    // origin: "0 0", // 位置
    // maxScale: 3, // 最大比例,默认值：4
    // minScale: 0, // 最小比例,默认值：0.125
    cursor: 'auto',
    disableZoom: false, // 禁止缩放
    disablePan: false, //禁止平移
    // startScale: 1.5,
    // startX: 240,
    // startY: 50,
    overflow: 'hidden', // 溢出
    canvas: true, // 是否视为canvas
    setTransform: (elem, { scale, x, y }) => {
      // elem.style.transform = `translate(${x}px, ${y}px) scaleX(${scale})`;
      // elem.style.transform = `scaleX(${svgTransform.scaleX}) scaleY(${svgTransform.scaleY})`;

      // elem.style.transformOrigin = 'left top';
      // elem.style.height = '100%';
      panzoom.value.setStyle(
        'transform',
        `scale(${scale}) translate(${x}px, ${y}px)`,
      );
    },
  });
};
// 监听鼠标滚轮
const wheel = (event) => {
  event.preventDefault();
  panzoom.value.zoomWithWheel(event);
};

/**
 * drawio布防图保存回调事件
 */
const onDrawioImageCreated = async ({ imageType, imageContent, xml }) => {
  if (imageType === 'svg') {
    // svgContent.value = imageContent;
    loading.value = true;
    loadingText.value = '正在保存...';
    try {
      await updateData(imageContent);
    } catch {
      ElMessage.error('保存失败');
      loading.value = false;
      return;
    }

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');
    const allElementsOfSvg = xmlDoc.querySelectorAll('*');
    // 获取图元id和名称的对应关系
    const mapData = [...allElementsOfSvg]
      .filter(
        (item) =>
          item.hasAttribute('name') &&
          item.hasAttribute('type') &&
          item.hasAttribute('id'),
      )
      .map((item) => ({
        topoId: uploadData.id,
        id: item.getAttribute('id'),
        devType: item.getAttribute('type'),
        graphElementName: item.getAttribute('name'),
      }));
    try {
      // 保存
      const result = await saveElementSystemApi(mapData);
      if (result) {
        ElMessage.success('保存成功');
      }
      loading.value = false;
    } catch {
      loading.value = false;
      ElMessage.success('保存失败');
    }
  }
};

onMounted(() => {
  query();
  if (!isListenerRegistered) {
    // 监听绘制完毕事件
    window.addEventListener('drawioImageCreated', onDrawioImageCreated);
    isListenerRegistered = true;
  }
});
onBeforeUnmount(() => {
  window.removeEventListener('drawioImageCreated', onDrawioImageCreated);
  isListenerRegistered = false;
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
