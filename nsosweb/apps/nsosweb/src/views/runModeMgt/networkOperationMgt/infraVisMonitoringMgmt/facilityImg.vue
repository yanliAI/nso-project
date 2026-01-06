<script setup lang="ts">

import { Download, Search, Refresh } from '@element-plus/icons-vue';
import {
  ElButton,
  ElCol,
  ElForm,
  ElFormItem,
  ElInput,
  ElPagination,
  ElRow,
  ElSelect,
  ElTable,
   ElEmpty,
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
import { onMounted, reactive, ref } from 'vue'
const accessStore = useAccessStore();

const queryFormRef = ref();
const queryForm = reactive({});

// 拖拽、缩放对象
const panzoom = ref(null);
const wheelConRef = ref();
const svgTransform = reactive({
  scaleX: 1,
  scaleY: 1,
});
const loading = ref(false);
const svgContent = ref('');
const svgConRef = ref('');
const isEmpty = ref(true)

const emptyDesc = ref('待查询');
// 查询数据
async function queryData() {
  try {
    const res = await getmonitorSq({pageNo:1,pageSize:1000,...queryForm})
    if (res) {
      // data.tableData = res.list;
      if(res.list.length === 0){
        isEmpty.value = true;
        emptyDesc.value = '无设施图纸'
        return
      }
      showImg(res.list[0])
    }
  } catch (error) {
    console.error('查询数据失败:', error)
  }
}

// 重置
function reset(){
    // 重置查询表单
  queryFormRef.value?.resetFields();
} 

// 下载图片
async function showImg(row: any){
  try {
    loading.value = true;
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
    isEmpty.value = false
  } catch (error) {
    console.log('error==', error);
    loading.value = false;
  }
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
    origin: "0 0", // 位置
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
      <ElForm
        :inline="true"
        :model="queryForm"
        ref="queryFormRef"
        label-position="right"
      >
        <ElFormItem prop="sqId" label="设施ID:" style="width: 300px">
          <ElInput v-model="queryForm.sqId" clearable />
        </ElFormItem>

        <ElFormItem prop="sqIp" label="设施IP:" style="width: 300px">
          <ElInput v-model="queryForm.sqIp" clearable />
        </ElFormItem>
        <ElFormItem style="width: auto">
          <ElButton type="primary" :icon="Search" @click="queryData"
            >查询</ElButton
          >
          <ElButton type="info" :icon="Refresh" @click="reset"
            >重置</ElButton
          >
        </ElFormItem>
      </ElForm>
    </div>
    <div style="width: 100%; height: 100%; padding:0 20px; position: relative;">
      <!-- <el-image style="width: 100%; height: 100%" :src="url" :fit="fit" /> -->
       <div v-loading="loading" style="height: 710px; margin-top: 20px; "  class="bg-white">
        <div ref="wheelConRef" @wheel="wheel" style="height: 100%" v-show="!isEmpty">
          <div id="svg" ref="svgConRef" style="height: 100%"></div>
        </div>
        <div v-show="isEmpty" style="height: 100%" class="my-empty-con">
            <el-empty :description="emptyDesc" :image-size="100" />
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>

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
</style>
