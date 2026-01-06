<template>
  <div class="w-full h-full pt-2">
    <el-form ref="addForm" label-width="auto" :inline="true" :model="data.form" :rules="rules" label-position="right" class="demo-form-inline" :disabled="!canOper">
      <el-row>
        <el-col :span="12">
          <el-form-item label="补丁类型:" prop="patchType">
            <el-select v-model="data.form.patchType" filterable clearable>
              <el-option v-for="item in dropList.NSOS_PATCH_TYPE" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="补丁名称:" prop="patchName">
            <el-input v-model="data.form.patchName" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="补丁版本:" prop="patchVersion">
            <el-input v-model="data.form.patchVersion" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发布范围:" prop="range">
            <el-select v-model="data.form.range" filterable clearable>
              <el-option v-for="item in range" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="规则:" prop="updateRuler">
            <el-input v-model="data.form.updateRuler" type="textarea" :rows="3" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="关联漏洞:" prop="relationLoophole">
            <el-input v-model="data.form.relationLoophole" type="textarea" :rows="3" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <!-- <el-form-item label="上传补丁:" prop="file">
            <el-upload ref="upload" class="upload" :action="uploadUrl" :file-list="fileList" :show-file-list="true" :http-request="fileUpload" :auto-upload="false" :limit="1" :on-change="handleFileChange" :on-exceed="handleExceed">
              <template #trigger>
                <el-button type="primary" link>选择附件</el-button>
              </template>
            </el-upload>
          </el-form-item> -->
          <div v-if="data.form.patchStatus">
            <AttachFileA ref="attachListRef" :disabled="!canOper" :parentId="data.form.id" moduleId="PATCH_INFO">
              <template v-slot:title>
                <span style="font-size: 14px">补丁附件：</span>
              </template>
            </AttachFileA>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <div class="text-center pt-[10px] pb-[20px]">
      <el-button type="primary" @click="release" :disabled="data.form.patchStatus !== '0'">发布</el-button>
      <el-button type="primary" @click="save(addForm)" :disabled="!canOper">保存</el-button>
      <el-button type="primary" @click="closeDialog">取消</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElSelect, ElFormItem, ElForm, ElInput, ElButton, ElDialog, ElUpload, ElMessage, ElRow, ElCol, ElNotification } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import { requestClient } from '#/api/request'
import { genFileId } from 'element-plus'
import axios from 'axios'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'
import { useAccessStore } from '@vben/stores'
import { useDropStore } from '#/store'
import AttachFileA from '#/views/basic/attach/attachFileA.vue'

const attachListRef = ref()
const selectedForm = defineModel('selectedForm')
const canOper = defineModel('canOper')
const upload = ref<UploadInstance>()
const addForm = ref<FormInstance>()

const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}

const uploadUrl = import.meta.env.VITE_NSOSZH + '/patchInfo/save'
const fileList = ref([])
const progressData = ref([])
const props = defineProps({})

const emit = defineEmits(['closeUpload', 'query'])
const closeDialog = () => {
  emit('closeUpload')
  // clear()
}

const data = reactive({
  form: {},
})

const rules = reactive({
  patchType: [
    {
      required: true,
      message: '请选择类型',
      trigger: 'change'
    }
  ],
  patchName: [
    {
      required: true,
      message: '请输入名称',
      trigger: 'change'
    }
  ],
  patchVersion: [
    {
      required: true,
      message: '请输入版本',
      trigger: 'change'
    }
  ],
  range: [
    {
      required: true,
      message: '请选择范围',
      trigger: 'change'
    }
  ],
  updateRuler: [
    {
      required: true,
      message: '请输入规则',
      trigger: 'change'
    }
  ],
  relationLoophole: [
    {
      required: true,
      message: '请关联漏洞',
      trigger: 'change'
    }
  ],
  // file: [
  //   { required: true, message: '请上传附件', trigger: 'change' },
  //   {
  //     validator: (rule, value, callback) => {
  //       if (!value || fileList.value.length === 0) {
  //         callback(new Error('请上传附件'))
  //       } else {
  //         callback()
  //       }
  //     },
  //     trigger: 'change'
  //   }
  // ]
})

async function saveDataApi(params: any) {
  return requestClient.post(import.meta.env.VITE_NSOSZH + '/patchInfo/save', params)
}
const range = [
  {
    value: '全网',
    label: '全网'
  },
  {
    value: '内部',
    label: '内部'
  }
]

async function fileUpload(fileInfo) {
  let file = fileInfo.file
  // 检查文件大小，不能超过500MB
  if (file.size > 1024 * 1024 * 200) {
    ElMessage({ type: 'warning', message: '上传的文件大小不能超过200Mb' })
    return
  }
  let fileType = file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length).toLowerCase()

  let params = new FormData()
  params.append('file', file)
  params.append('uid', file.uid)
  data.form.file = null
  params.append('data', JSON.stringify(data.form))

  const accessStore = useAccessStore()

  axios({
    url: import.meta.env.VITE_NSOSZH + '/patchInfo/save',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: formatToken(accessStore.accessToken)
    },
    data: params
  }).then((rs) => {
    uploadComplate(rs, file)
  })
}

function formatToken(token) {
  return token ? `Bearer ${token}` : null
}

async function uploadComplate(rs, file) {
  let code = rs.data.code
  if (code == 0) {
    ElMessage({ type: 'success', message: '上传成功' })
    await emit('query')
  } else {
    ElMessage({ type: 'error', message: '上传失败' })
  }
}

const save = async (addForm: FormInstance | undefined) => {
  if (!addForm) return
  await addForm.validate(async (valid, fields) => {
    if (valid) {
      // await upload.value!.submit()
      data.form = await requestClient.post(import.meta.env.VITE_NSOSZH + '/patchInfo/saveNew', data.form)
      // emit('closeUpload')
      emit('query')
    } else {
      ElMessage.warning('请检查必填项')
    }
  })
  // clear()
}

const handleFileChange = (file, files) => {
  fileList.value = files
  data.form.file = file
}

const clear = () => {
  data.form.patchType = ''
  data.form.patchName = ''
  data.form.patchVersion = ''
  data.form.range = ''
  data.form.updateRuler = ''
  data.form.relationLoophole = ''
  data.form.file = null
}

onMounted(async () => {
  const dropStore = useDropStore()
  await dropStore.initDrops(['NSOS_PATCH_TYPE'])
  dropStore.get(dropList, ['NSOS_PATCH_TYPE'])
  
  if (selectedForm.value) {
    data.form = selectedForm.value
  }
})
const dropList: any = reactive({})

const release = async() => {
  const attachList = attachListRef.value.getAttachList()
  if (attachList.length == 0) {
    ElMessage.warning('请上传附件！')
    return
  }
  await requestClient.post(import.meta.env.VITE_NSOSZH + '/patchInfo/release', data.form)
  emit('closeUpload')
  emit('query')
  ElNotification({
    title: '提示',
    message: '发布成功！',
    type: 'success'
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

.upload {
  width: -webkit-fill-available
}
</style>
