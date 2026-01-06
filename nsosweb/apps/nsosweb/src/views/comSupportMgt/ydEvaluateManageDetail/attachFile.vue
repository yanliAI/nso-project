<template>
  <div class="w-full">
    <div class="mb-1">
      <el-upload
        class="upload-demo"
        :action="uploadUrl"
        :show-file-list="false"
        :http-request="fileUpload"
        :on-progress="uploadProgress">
        <el-button type="primary" :icon="Upload" size="small" class="btn">上传</el-button>
      </el-upload>
    </div>
    <div class="flex items-center mt-1">
      <div class="primary text-xs">上传列表</div>
      <div class="kkl-b"></div>
    </div>
    <div ref="uploadList" class="ifnobody">
        <div v-for="(itm,index) in data.progressData" class="jindu-d" :key="'press'+index">
            <div v-if="typeContains(itm.contenttype, 'xlsx')" class="execls"></div>
            <div v-else-if="typeContains(itm.contenttype, 'mp3apewavflacwmampegogg')" class="yy"></div>
            <div v-else-if="typeContains(itm.contenttype, 'mp4aviwmvrmvbflv')" class="sp"></div>
            <div v-else-if="typeContains(itm.contenttype, 'rarzip7zgztar')" class="ys"></div>
            <div v-else-if="typeContains(itm.contenttype, 'docxrtf')" class="word"></div>
            <div v-else-if="typeContains(itm.contenttype, 'txt')" class="txt"></div>
            <div v-else-if="typeContains(itm.contenttype, 'pdf')" class="pdf"></div>
            <div v-else-if="typeContains(itm.contenttype, 'pngjpgjpeggifsvg')" class="tp"></div>
            <div v-else-if="typeContains(itm.contenttype, 'htmlcssjs')" class="html"></div>
            <div v-else-if="typeContains(itm.contenttype, 'exe')" class="exe"></div>
            <div v-else class="qt"></div>
            <div class="jinduttxt">{{itm.name}}</div>
            <div class="jindutiao">
              <el-progress :percentage="itm.percent" :status="itm.status"></el-progress>
            </div>
        </div>
    </div>
    <div class="flex items-center mt-1">
      <div class="primary text-xs">附件信息</div>
      <div class="kkl-b"></div>
    </div>
    <div class="attach-table mt-1">
      <AttachList ref="attachListRef" :parentId="parentId?parentId.value: null" :showPreview="false"></AttachList>
    </div>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue';
import axios from 'axios';
import { useAccessStore } from '@vben/stores';
import { ElMessage, ElProgress, ElUpload, ElMessageBox } from 'element-plus'; 
import { Upload } from '@element-plus/icons-vue';
import AttachList from './attachList.vue'

const parentId = defineModel('parentId')

const uploadList = ref()
const attachListRef = ref()
const data = reactive({
  uploadUrl: import.meta.env.VITE_BASIC + '/attachFileInfo/fileUpload',
  progressData:[],
  progTemp: [],
});

function formatToken(token) {
  return token ? `Bearer ${token}` : null;
}
function fileUpload(fileInfo) {
  let file = fileInfo.file;
  // 检查文件大小，不能超过500MB
  if (file.size > 1024 * 1024 * 200) {
    ElMessage({ type: 'warning', message: '上传的文件大小不能超过200Mb' });
    return;
  }
  let fileType = file.name
    .substring(file.name.lastIndexOf('.') + 1, file.name.length)
    .toLowerCase();
  let progress = {
    name: file.name,
    percent: 0,
    contenttype: fileType,
    uid: file.uid,
  };
  data.progressData.push(progress);

  let params = new FormData();
  params.append('file', file);
  params.append('uid', file.uid);
  params.append('parentId', parentId.value);

  const accessStore = useAccessStore();
  
  axios({
    url: import.meta.env.VITE_BASIC + '/attachFileInfo/fileUpload',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': formatToken(accessStore.accessToken),
    },
    onUploadProgress: function (progressEvent) {
      if (progressEvent.lengthComputable) {
        uploadProgress(progressEvent, file);
      }
    },
    data: params,
  })
    .then((rs) => {
      uploadComplate(rs, file);
    })
}
function uploadComplate(rs, file) {
  let code = rs.data.code;
  if (code == 0) {
    ElMessage({ type: 'success', message: '上传成功' });
    attachListRef.value.queryData();
    for (let i = 0; i < data.progressData.length; i++) {
      if (data.progressData[i].uid == file.uid) {
        data.progressData[i].status = 'success';
        data.progressData[i].percent = 100;
        break;
      }
    }
    uploadList.value.scrollTop = uploadList.value.scrollHeight;
  } else {
    ElMessage({ type: 'error', message: '上传失败' });
    for (var i = 0; i < data.progressData.length; i++) {
      if (data.progressData[i].uid == file.uid) {
        data.progressData[i].status = 'exception';
        break;
      }
    }
  }
  data.progTemp = data.progressData;
  data.progressData = [];
  data.progressData = data.progTemp;
}
const uploadProgress = (event, file) => {
  let percent = parseInt((event.loaded / event.total) * 100);
  if (percent == 100) {
    percent = 99;
  }
  for (var i = 0; i < data.progressData.length; i++) {
    if (data.progressData[i].uid == file.uid) {
      data.progressData[i].percent = percent;
      break;
    }
  }
}

function typeContains(type, types){
  return types.indexOf(type) >= 0
}

</script>
<style scoped>
.ifnobody{
  width:100%;
  height: 85px;
  overflow: auto;
}

.jindu-d{
    position: relative;
    float: left;
    width: 50%;
    height: 40px;
}

.yy{
    position: absolute;
    top: 9px;
    left: 0;
    width: 26px;
    height: 26px;
    cursor: default;
    background: url("/images/attach/yy.png") center no-repeat;
}

.sp{
    position: absolute;
    top: 9px;
    left: 0;
    width: 26px;
    height: 26px;
    cursor: default;
    background: url("/images/attach/sp.png") center no-repeat;
}

.ys{
    position: absolute;
    top: 9px;
    left: 0;
    width: 26px;
    height: 26px;
    cursor: default;
    background: url("/images/attach/ys.png") center no-repeat;
}

.exe{
    position: absolute;
    top: 9px;
    left: 0;
    width: 26px;
    height: 26px;
    cursor: default;
    background: url("/images/attach/exe.png") center no-repeat;
}

.word{
    position: absolute;
    top: 9px;
    left: 0;
    width: 26px;
    height: 26px;
    cursor: default;
    background: url("/images/attach/word.png") center no-repeat;
}

.execls{
    position: absolute;
    top: 9px;
    left: 0;
    width: 26px;
    height: 26px;
    cursor: default;
    background: url("/images/attach/excel.png") center no-repeat;
}

.txt{
    position: absolute;
    top: 9px;
    left: 0;
    width: 26px;
    height: 26px;
    cursor: default;
    background: url("/images/attach/txt.png") center no-repeat;
}

.pdf{
    position: absolute;
    top: 9px;
    left: 0;
    width: 26px;
    height: 26px;
    cursor: default;
    background: url("/images/attach/pdf.png") center no-repeat;
}

.tp{
    position: absolute;
    top: 9px;
    left: 0;
    width: 26px;
    height: 26px;
    cursor: default;
    background: url("/images/attach/tp.png") center no-repeat;
}

.qt{
    position: absolute;
    top: 9px;
    left: 0;
    width: 26px;
    height: 26px;
    cursor: default;
    background: url("/images/attach/qt.png") center no-repeat;
}

.html{
    position: absolute;
    top: 9px;
    left: 0;
    width: 26px;
    height: 26px;
    cursor: default;
    background: url("/images/attach/html.png") center no-repeat;
}

.jinduttxt{
    height: 24px;
    padding-right: 20px;
    overflow: hidden;
    font-size: 12px;
    line-height: 24px;
    color:#888;
    text-indent: 31px;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: default;
}

.jindutiao{
    padding-left: 31px;
}

.abgh{
  cursor: pointer;
}

.primary{
  color: hsl(var(--primary));
}

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

.kkl-b{
  flex:1;
  margin-left: 5px;
  border-top: 1px solid #c4dbf5;
}

.attach-table{
  width: 100%;
  height: 400px;
}
</style>
