<template>
  <div class="fill-whole-white notify-form-page">
    <div class="notify-form-data">
      <el-form :inline="true" :model="mydata.form" :rules="rules" ref="myform" label-width="auto" label-position="right" class="demo-form-inline mt-1">
        <el-row>
          <el-col :span="8">
            <el-form-item label="联系人：" prop="notifyTarget">
              <el-select v-model="mydata.form.notifyTarget" :disabled="mydata.form.notifyTarget">
                <el-option v-for="item in dropList.NSOS_USER_NAME" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="通知方式：" prop="notifyType">
              <el-select v-model="mydata.form.notifyType">
                <el-option v-for="item in dropList.NSOS_NOTIFY_TYPE" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系方式：" prop="contact">
              <el-input v-model="mydata.form.contact"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0">
          <el-col :span="24">
            <el-form-item label="联系内容：" prop="notifyContent">
              <el-input v-model="mydata.form.notifyContent" type="textarea" :rows="2"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="创建人：">
              <el-select v-model="mydata.form.creatorId" disabled>
                <el-option v-for="item in dropList.NSOS_USER_NAME" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间：">
              <el-date-picker v-model="mydata.form.createTime" type="datetime" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="notify-form-btn">
      <el-button type="primary" @click="handleSubmit">提交</el-button>
      <el-button @click="emit('close')">取消</el-button>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref, onMounted, watch, nextTick } from 'vue'
import { useDropStore } from '#/store'
import { requestClient } from '#/api/request'
import { ElMessage } from 'element-plus'
import { useVbenModal } from '@vben/common-ui'
import { formatDateTime } from '#/utils/commonUtil.ts'
import { useUserStore } from '@vben/stores'

const props = defineProps({
  data: {
    type: Object,
    default: {}
  }
})
const mydata = reactive({
  form: {}
})
const emit = defineEmits(['close', 'query'])
const dropList = reactive({})

const myform = ref(null)
// 验证规则
const rules = reactive({
  notifyTarget: [{ required: true, message: '请选择联系人', trigger: 'blur' }],
  notifyType: [{ required: true, message: '请选择通知方式', trigger: 'blur' }],
  contact: [{ required: true, message: '请填写联系方式', trigger: 'blur' }],
  notifyContent: [{ required: true, message: '请填写通知内容', trigger: 'blur' }]
})
const userStore = useUserStore()
onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = ['NSOS_NOTIFY_TYPE', 'NSOS_USER_NAME']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)
  mydata.form = JSON.parse(JSON.stringify(props.data))
  mydata.form.createTime = formatDateTime(new Date().getTime())
  mydata.form.creatorId = userStore.userInfo.logincode
})

const handleSubmit = async () => {
  try {
    // 执行表单验证
    await myform.value.validate()

    // 验证通过后提交逻辑
    save()
  } catch (error) {
    ElMessage.error('请检查表单填写是否正确')
  }
}

const save = async () => {
  try {
    await requestClient.post(import.meta.env.VITE_NSOSGZ + '/notifyRecord/add', mydata.form)
    ElMessage.success('保存成功！')
    emit('close')
    emit('query')
  } catch {
    console.error('保存失败！')
  }
}
</script>
<style scoped>
.notify-form-page {
  display: flex;
  flex-direction: column;
}

.notify-form-data {
  flex-grow: 1;
  padding-top: 15px;
}

.notify-form-btn {
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.demo-form-inline .el-input {
  --el-input-width: 100%;
}

.demo-form-inline .el-select {
  --el-select-width: 100%;
}

:deep(.el-date-editor.el-input, .el-date-editor.el-input__wrapper) {
  width: 100%;
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
