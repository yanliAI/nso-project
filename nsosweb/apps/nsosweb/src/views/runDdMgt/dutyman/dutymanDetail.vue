<template>
  <div style="width: 100%; height: 100%">
    <div style="height: calc(100% - 50px)">
      <el-form label-width="auto" ref="formRef" :model="formdata" :rules="formRules" :inline="true" label-position="right" class="demo-form-inline">
        <el-row>
          <el-col :span="24">
            <el-form-item label="人员角色名称:" prop="manName" style="margin-bottom: 18px">
              <el-input v-model="formdata.manName" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="人员角色说明:" prop="manRemark">
              <el-input v-model="formdata.manRemark" type="textarea" :rows="5" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="值班方式:" prop="dutyType">
              <el-select v-model="formdata.dutyType" placeholder="选择值班方式" clearable filterable>
                <el-option v-for="item in dropList.NSOS_DUTY_TYPE" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
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
import { useUserStore } from '@vben/stores'
import { onMounted, reactive, ref } from 'vue'
import { useDropStore } from '#/store'
import { requestClient } from '#/api/request'
import { ElMessage } from 'element-plus'
import { DocumentChecked, Close } from '@element-plus/icons-vue'
import { useVbenModal } from '@vben/common-ui'
import { getDetail } from './dutymanMethod.ts'
const currentId = defineModel('id')
const emit = defineEmits(['closeDiaLog', 'query'])
const dropList = reactive({})

const formRef = ref(null)
// 验证规则
const formRules = reactive({
  manName: [
    { required: true, message: '人员角色名称不能为空', trigger: 'blur' },
    { max: 50, message: '长度不能超过100个字符', trigger: 'blur' }
  ],
  manRemark: [],
  dutyType: [
  { required: true, message: '请选择值班方式', trigger: 'blur' },
  ]
})
const formdata = reactive({})
onMounted(async () => {
  const dropStore = useDropStore();
  const dropType = ['NSOS_DUTY_TYPE']
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);
  queryDetail()
})

const queryDetail = async () => {
  const data = await getDetail(currentId.value)
  Object.assign(formdata, data)
}

const handleSubmit = async () => {
  try {
    // 执行表单验证
    await formRef.value.validate()

    // 验证通过后提交逻辑
    save()
  } catch (error) {
    ElMessage.error('请检查表单填写是否正确')
  }
}

const save = async () => {
  try {
    await requestClient.post(import.meta.env.VITE_NSOSGZ + '/dutyMan/add', formdata)
    ElMessage.success('保存成功！')
    emit('closeDiaLog')
    emit('query')
  } catch {
    ElMessage.error('保存失败！')
  }
}

const cancel = () => {
  emit('closeDiaLog')
}
</script>
<style scoped>
.head-d {
  width: 100%;
  height: 55px;
  border-bottom: 1px solid #ebebeb;
}
</style>

<style>
.el-popper {
  max-width: unset;
}
</style>
