<template>
  <div class="w-full h-full pt-2">
    <el-form label-width="110px" ref="ruleFormRef" :model="data.formData" :rules="formRules" :inline="true" label-position="right" class="demo-form-inline">
      <el-row>
        <el-col>
          <el-form-item label="人员:" prop="userName">
            <!-- <el-select v-model="data.formData.loginCode" filterable @change="selectUser($event)">
              <el-option v-for="item in userDrop" :key="item.loginCode" :label="item.loginName" :value="item.loginCode" />
            </el-select> -->
            <el-input v-model="data.formData.userName" readonly>
              <template #append>
                <el-button :icon="Plus" @click="userAddClick('loginCode', 'userName')"/>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="手机号码:" prop="mobileTel">
            <el-input v-model="data.formData.mobileTel" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="数认账号:" prop="loginCode">
            <el-input v-model="data.formData.loginCode" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="所属单位:" prop="orgName">
            <el-input v-model="data.formData.orgName" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="备注:" prop="userDesc">
            <el-input v-model="data.formData.userDesc" :rows="5" maxlength="200" show-word-limit type="textarea" placeholder="请输入备注" clearable />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="text-center pt-[10px]">
      <el-button type="primary" class="ml-4" :icon="Tickets" @click="saveData">确定</el-button>
      <el-button type="info" class="ml-4" :icon="Close" @click="emit('close')">取消</el-button>
    </div>
    <ModalB class="w-[1200px] h-[650px]" title="人员选择" :footer="false" :closeOnClickModal="false" :draggable="true">
      <UserSelect @selectOk="userSelectOk"></UserSelect>
    </ModalB>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { ElForm, ElFormItem, ElRow, ElCol, ElMessage, ElNotification } from 'element-plus'
import { useDropStore } from '#/store'
import { Tickets, Close, Plus } from '@element-plus/icons-vue'
import { initUser, saveUser } from './smsMgtMethod.ts'
import { useVbenModal } from '@vben/common-ui'
import UserSelect from '#/views/basic/common/userSelect.vue'

const dropList = reactive({})
const contactId = defineModel('contactId')
const userDrop = defineModel('userDrop')
const emit = defineEmits('close')
const ruleFormRef = ref()
const data = reactive({
  formData: {},
  curProp: null,
})

const formRules = reactive({
  userName: [
    { required: true, message: '请选择人员', trigger: 'blur' },
  ],
  mobileTel: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3456789]\d{9}$/, message: '请输入有效的手机号码', trigger: 'blur' },
  ],
  loginCode: [
    { required: true, message: '请输入数认账号', trigger: 'blur' },
  ],
  orgName: [
    { required: true, message: '请输入所属单位', trigger: 'blur' },
  ],
  orgId: [
    { required: true, message: '请输入所属单位ID', trigger: 'blur' },
  ],
  userDesc: [
    { min: 0, max: 200, message: '内容长度最大不能超过200', trigger: 'blur' },
  ],
})
onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = []
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)
  data.formData = await initUser({ id: contactId.value })
})

const saveData = async () => {
  await ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      try{
        await saveUser(data.formData)
      } catch {
        ElMessage.error('保存失败！')
        return
      }
      ElNotification({
        title: '提示',
        message: '保存成功！',
        type: 'success'
      })
      emit('ok')
    } else {
      ElMessage.warning('请输入必填项！')
    }
  })
}

const selectUser = (val) => {
  const userData = userDrop.value.filter(item => item.loginCode === val)?.[0]
  data.formData.userName = userData.loginName
  data.formData.mobileTel = userData.mobileTel
  data.formData.orgId = userData.provinceCode
  const lastIndex = userData.orgFullPath.lastIndexOf('/')
  data.formData.orgName = userData.orgFullPath.substring(lastIndex + 1)
}

const [ModalB, modalApiB] = useVbenModal({
  onCancel() {
    modalApiB.close()
  }
})

const userSelectOk = (user) => {
  data.formData.userName = user.employeeName
  data.formData.loginCode = user.employeeAccount
  data.formData.orgId = user.orgCode
  const lastIndex = user.nameFullPath.lastIndexOf('/')
  data.formData.orgName = user.nameFullPath.substring(lastIndex + 1)
  modalApiB.close()
}
const userAddClick = (codeProp, nameProp) => {
  data.curUserProp = codeProp
  data.curUserNameProp = nameProp
  
  modalApiB.open()
}
</script>
<style scoped>
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
  width: 100% !important;
  margin-right: 0 !important;
  margin-bottom: 15px !important;
}

:deep(.el-input-number) {
  width: 100%;
}
</style>
