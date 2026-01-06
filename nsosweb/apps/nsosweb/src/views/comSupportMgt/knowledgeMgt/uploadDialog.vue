<template>
  <el-form :inline="true" ref="ruleFormRef" :rules="formRules" :model="data.formData" label-position="right" style="padding: 0px 0px 0px 20px; text-align: center" class="demo-form-inline mt-1">
    <el-row>
      <el-col :span="12">
        <el-form-item label="上传目录：" prop="saveDirectory">
          <el-select v-model="data.formData.saveDirectory" clearable>
            <el-option v-for="item in dropList.NSOS_KNOW_CONTEN" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="资料类型：" prop="dataType">
          <el-select v-model="data.formData.dataType" clearable>
            <el-option v-for="item in dropList.NSOS_KNOW_DATATYPE" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row style="margin-top: 12px">
      <el-col :span="24"
        ><el-form-item prop="file">
          <el-upload class="upload-demo" ref="uploadRef" :file-list="fileList" drag :action="data.uploadUrl" :show-file-list="true" :http-request="fileUpload" :on-progress="uploadProgress" :on-change="handleFileChange" :auto-upload="false" :limit="1" :on-exceed="handleExceed" style="width: 100%">
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">拖拽文件或 <em>点击上传</em></div>
            <template #tip>
              <div class="el-upload__tip">jpg/png 文件大小小于200mb</div>
            </template>
          </el-upload>
        </el-form-item></el-col
      >
    </el-row>

    <el-form-item>
      <div style="width: 100%; height: 100%">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="primary" @click="closeDialog">取消</el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { ElUpload, ElFormItem, ElForm, ElInput, ElButton, ElDialog, ElRow, ElCol, ElMessage, genFileId } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import { onMounted, reactive, ref } from 'vue'
import axios from 'axios'
import { useAccessStore } from '@vben/stores'
import { requestClient } from '#/api/request'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'
import { useDropStore } from '#/store'

const formRules = reactive({
  saveDirectory: [{ required: true, message: '请选择上传目录', trigger: 'change' }],
  dataType: [{ required: true, message: '请选择资料类型', trigger: 'change' }],
  file: [
    { required: true, message: '请上传文件', trigger: 'change' },
    {
      validator: (rule, value, callback) => {
        if (!value || fileList.value.length === 0) {
          callback(new Error('请上传文件'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ]
})
onMounted(async () => {
  const dropStore = useDropStore()
  await dropStore.initDrops(['NSOS_KNOW_CONTEN', 'NSOS_KNOW_DATATYPE'])
  dropStore.get(dropList, ['NSOS_KNOW_CONTEN', 'NSOS_KNOW_DATATYPE'])
})

const props = defineProps({})

const emit = defineEmits(['closeUpload', 'query'])
const closeDialog = () => {
  emit('closeUpload')
}

const uploadRef = ref<UploadInstance>()
const dropList: any = reactive({})
const ruleFormRef = ref()
const uploadList = ref()
const attachListRef = ref()
const fileList = ref([])
const data = reactive({
  uploadUrl: import.meta.env.VITE_NSOSZH + '/knowAttachment/fileUpload',
  formData: {
    saveDirectory: '',
    dataType: '',
    file: null
  },
  progressData: [],
  progTemp: []
})

function formatToken(token) {
  return token ? `Bearer ${token}` : null
}
async function fileUpload(fileInfo) {
  let file = fileInfo.file
  // 检查文件大小，不能超过500MB
  if (file.size > 1024 * 1024 * 200) {
    ElMessage({ type: 'warning', message: '上传的文件大小不能超过200Mb' })
    return
  }
  let fileType = file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length).toLowerCase()
  let progress = {
    name: file.name,
    percent: 0,
    contenttype: fileType,
    uid: file.uid
  }
  data.progressData.push(progress)

  let params = new FormData()
  params.append('file', file)
  params.append('uid', file.uid)
  params.append('saveDirectory', data.formData.saveDirectory)
  params.append('dataType', data.formData.dataType)

  const accessStore = useAccessStore()

  axios({
    url: import.meta.env.VITE_NSOSZH + '/knowAttachment/fileUpload',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: formatToken(accessStore.accessToken)
    },
    onUploadProgress: function (progressEvent) {
      if (progressEvent.lengthComputable) {
        uploadProgress(progressEvent, file)
      }
    },
    data: params
  }).then((rs) => {
    uploadComplate(rs, file)
  })
}

async function uploadComplate(rs, file) {
  let code = rs.data.code
  if (code == 0) {
    await emit('query')
    ElMessage({ type: 'success', message: '上传成功' })
  } else {
    ElMessage({ type: 'error', message: '上传失败' })
  }
}

const uploadProgress = (event, file) => {
  let percent = parseInt((event.loaded / event.total) * 100)
  if (percent == 100) {
    percent = 99
  }
  for (var i = 0; i < data.progressData.length; i++) {
    if (data.progressData[i].uid == file.uid) {
      data.progressData[i].percent = percent
      break
    }
  }
}

const handleExceed: UploadProps['onExceed'] = (files) => {
  uploadRef.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  uploadRef.value!.handleStart(file)
}

const handleFileChange = (file,files) => {
  fileList.value = files
  data.formData.file = file
}

const save = async () => {
  await ruleFormRef.value.validate(async(valid, fields) => {
    if (valid) {
      await uploadRef.value!.submit()
      emit('closeUpload')
      emit('query')
    } else {
      ElMessage.warning('请检查必填项')
    }
  })
}
</script>
<style scoped>
.demo-form-inline .el-input {
  --el-input-width: 100%;
}

.demo-form-inline .el-select {
  --el-select-width: 100%;
}

:deep(.el-form--inline .el-form-item) {
  width: calc(100% - 20px);
  margin-right: 20px;
  margin-bottom: 12px;
}

:deep(.el-form-item) {
  width: calc(100% - 20px);
  margin-right: 20px;
  margin-bottom: 12px;
}
</style>
