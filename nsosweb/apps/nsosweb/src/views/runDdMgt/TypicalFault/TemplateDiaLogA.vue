<template>
  <div style="width: 100%; height: 100%;">
    <div style="height: calc(100% - 1px)">
      <el-row>
      <span class="text-[14px]">导入模板</span>
    </el-row>
    <el-row class="mt-1">
      <el-button link type="primary" size="small" @click="downloadTemplate"> 点击下载导入模板文件 </el-button>
    </el-row>
    <el-row class="mt-5">
      <span class="text-[14px]">上传文件</span>
    </el-row>
    <el-row class="my-1">
      <el-row :span="20">
        <el-upload ref="uploadRef" class="w-[350px]" v-model:file-list="fileList" action="" :auto-upload="false" multiple :on-change="handleFileChange" accept=".xlsx">
          <template #trigger>
            <el-button type="primary">请选择导入文件</el-button>
          </template>
          <!-- <el-button class="ml-3" type="success" @click="submitUpload"> 导入 </el-button> -->
          <template #tip>
            <div class="el-upload__tip">只支持.xlsx类型文件上传</div>
          </template>
        </el-upload>
      </el-row>
    </el-row>
      <div style="width: 100%; height: 20px">
      </div>
      <div style=" justify-content: center;height: 35px" class="flex">
        <el-button type="primary" @click="submitUpload">保存</el-button>
        <el-button @click="attachClose">取消</el-button>
      </div>
    </div>

    <!-- <Modal class="w-[700px] " title="附件编辑" :footer="false" :closeOnClickModal="false" :draggable="true">
      <AttachFile :parentId="formData.id" @afterUpload="attachFileRef.queryData()" close="addClose"></AttachFile>
    </Modal> -->
  </div>
</template>

<script setup lang="ts">
import { ElRow, ElCol, ElButton, ElMessage, ElProgress, ElUpload, ElMessageBox, ElTooltip } from 'element-plus'
import type { UploadInstance, UploadProps, UploadUserFile, UploadRawFile } from 'element-plus'
import { reactive, ref, onMounted, defineExpose, defineEmits, defineProps } from 'vue'
import { formatDate, formatDateTime, formatToken } from '#/utils/commonUtil.ts'
import { useUserStore, useAccessStore } from '@vben/stores'
import axios from 'axios'
import { downloadFile } from '#/utils/download.ts';

const accessStore = useAccessStore()
const uploadRef = ref<UploadInstance>()
const fileList = ref<UploadUserFile[]>([])
const emit = defineEmits(['closeDiaLog','query'])


defineExpose({
  submitUpload
})
onMounted(async () => {})

// 下载导入模板
async function downloadTemplate() {
  toExcel("典型故障库导入模板.xlsx")
}

async function toExcel( excelName: string) {
  return downloadFile(import.meta.env.VITE_NSOSGZ + '/typicalFault/downloadDutyTaskTemplate',{}, excelName);
}

/**
 * 手动上传
 */
async function submitUpload() {
  if (!fileList.value.length) {
    ElMessage.warning('请先选择文件')
    return
  }

  const formData = new FormData()
  fileList.value.forEach((file) => {
    formData.append('files', file.raw) // 多文件 key 要一致
  })
  formData.append('dutyTaskId', '')
  formData.append('unitId', '')
  formData.forEach((value, key) => {
    //console.log(key, value)
  })

  try {
    const res = await axios.post(import.meta.env.VITE_NSOSGZ + '/typicalFault/importTemplateData', formData,  {
      headers: {
        Authorization: formatToken(accessStore.accessToken)
      }
    })

    if (res.data.ok) {
      ElMessage.success(`导入成功!`)
      emit('closeDiaLog');
      emit('query');
    } else {
      ElMessage.error(`导入失败!`)
    }

    // 清空文件
    uploadRef.value.clearFiles()
    fileList.value = []
  } catch (err) {
    ElMessage.success(`导入失败!`)
    console.log('导入失败 :>>', err)
  }
}

/**
 * 文件列表变化时进行文件校验
 */
const handleFileChange = (file, fileList) => {
  // 校验类型
  // const isExcel = file.raw.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  // 校验大小 (单位：字节)
  const isLt10M = file.size / 1024 / 1024 < 10
  // if (!isExcel) {
  //   ElMessage.error('只能上传 .xlsx 格式的文件')
  //   resetFileList()
  //   return
  // }
  if (!isLt10M) {
    ElMessage.error('文件大小不能超过 10MB')
    resetFileList()
    return
  }
}

const resetFileList = () => {
  // 清空上传列表
  if (uploadRef.value) {
    uploadRef.value.clearFiles()
  }
}

const attachClose =() => {
  emit('closeDiaLog');
}


const handleSubmit = async () => {
  try {
    // 验证通过后提交逻辑
    save();
  } catch (error) {
    ElMessage.error('请检查表单填写是否正确')
  }
}

const save = async () => {
  try{
    //const response = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/typicalFault/add2', formData.value);
  }catch {
    ElMessage.error('保存失败')
  }finally{
    emit('closeDiaLog');
    emit('query');
  }

}
</script>

<style></style>

