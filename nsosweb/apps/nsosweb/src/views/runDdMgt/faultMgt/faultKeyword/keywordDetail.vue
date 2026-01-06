<template>
  <div style="width: 100%; height: 100%">
    <div style="height: calc(100% - 50px); overflow: hidden">
      <el-form label-width="100px" ref="formRef" :model="mydata.formdata" :rules="formRules" :inline="true" label-position="right" class="demo-form-inline">
        <el-row style="margin-top: 20px">
          <el-col :span="24">
            <el-form-item label="故障关键字:" prop="keywordContent" style="margin-bottom: 18px">
              <el-input v-model="mydata.formdata.keywordContent" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="创建人:" prop="creatorName">
              <el-input v-model="mydata.formdata.creatorName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间:" prop="createTime">
              <el-date-picker v-model="mydata.formdata.createTime" type="datetime" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="mydata.formdata.id" style="margin-top: 5px">
          <el-col :span="12">
            <el-form-item label="修改人:" prop="updatorName">
              <el-input v-model="mydata.formdata.updatorName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="修改时间:" prop="updateTime">
              <el-date-picker v-model="mydata.formdata.updateTime" type="datetime" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div style="height: 50px; justify-content: center" class="flex">
      <el-button type="primary" :icon="DocumentChecked" @click="handleSubmit">保存</el-button>
      <el-button :icon="Close" @click="cancel">取消</el-button>
    </div>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { DocumentChecked, Close } from '@element-plus/icons-vue'
import { getDetail, save } from './faultKeywordSelectMethod.ts'
const currentId = defineModel('id')
const emit = defineEmits(['close', 'refresh'])

const formRef = ref(null)
// 验证规则
const formRules = reactive({
  keywordContent: [{ required: true, message: '请填写故障关键字', trigger: 'blur' }]
})
const mydata = reactive({
  formdata: {}
})
onMounted(async () => {
  queryDetail()
})

const queryDetail = async () => {
  const data = await getDetail(currentId.value)
  mydata.formdata = data
}

const handleSubmit = async () => {
  try {
    // 执行表单验证
    await formRef.value.validate()

    // 验证通过后提交逻辑
    addData()
  } catch (error) {
    ElMessage.error('请检查表单填写是否正确')
  }
}

const addData = async () => {
  try {
    await save(mydata.formdata)
    ElMessage.success('保存成功！')
    emit('close')
    emit('refresh')
  } catch {
    ElMessage.error('保存失败！')
  }
}

const cancel = () => {
  emit('close')
}
</script>
<style scoped>
.head-d {
  width: 100%;
  height: 55px;
  border-bottom: 1px solid #ebebeb;
}
</style>
