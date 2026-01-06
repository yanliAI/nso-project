<template>
  <el-container class="h-full bg-white">
    <el-header height="100px">
      <el-form label-position="left" label-width="auto" :model="data.formData" :rules="formRules" style="max-width: 700px">
        <!-- <el-form-item label="会议号或链接:" prop="meetingNumber" style="width: 320px" label-position="right">
          <el-input v-model="data.formData.meetingNumber" />
        </el-form-item> -->
        <div class="flex">
          <el-form-item label="群名称:" prop="topic" style="width: 370px" label-position="right">
            <el-input v-model="data.formData.topic" />
          </el-form-item>
          <el-form-item label="群主:" prop="userName" style="width: 320px" label-position="right">
            <el-input v-model="data.formData.userName" disabled />
          </el-form-item>
        </div>
        <div class="flex-container">
          <el-form-item label="选择专家组:" prop="participants" style="width: 370px" label-position="right">
            <el-select v-model="data.expertId" multiple placeholder="选择专家组" collapse-tags collapse-tags-tooltip remote reserve-keyword clearable filterable style="width: 100%">
              <el-option v-for="item in dropList.NSOS_PIM_NAME" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <div style="display: flex; justify-content: flex-end; flex: 1; padding-bottom:20px;padding-right:10px">
            <el-button type="primary" @click="userAddClick('', '')">选择人员</el-button>
            <el-button type="success" @click="inviteNumber">发起群聊</el-button>
          </div>
        </div>
      </el-form>
    </el-header>
    <el-main>
      <!-- <div style="margin-left: 24px; height: 5%">
        总人数：<span style="font-weight: bold; color: #0ea9db">{{ participantsNum }}</span>
      </div> -->
      <el-table :data="data.tableData" border size="small" style="height: 95%">
        <el-table-column type="index" label="#" width="40" align="center"/>
        <el-table-column prop="expertName" label="姓名" align="center" />
        <el-table-column prop="telPhone" label="电话" align="center" />
        <el-table-column prop="expertId" label="所属专家组" align="center" column-key="NSOS_PIM_NAME" :formatter="formatDrop" />
        <el-table-column label="操作" width="160" align="center">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="removeNumber(scope.row)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
  <ModalB class="w-[1200px] h-[650px]" title="人员选择" :footer="false" :closeOnClickModal="false" :draggable="true">
    <UserSelect @selectOk="userSelectOk"></UserSelect>
  </ModalB>
  <SelectNumber v-if="data.dialogShow" @switchDialog="switchDialog" @addNumber="addNumber" style="width: 1000px; height: 600px" />
</template>
<script setup>
import { Page } from '@vben/common-ui'
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { ElButton, ElForm, ElFormItem, ElInput, ElContainer, ElHeader, ElMain, ElSelect, ElTable, ElTableColumn, ElFooter, ElRow, ElCol, ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useDropStore, useAuthStore } from '#/store'
import { tDateTimeFormat, formatDrop } from '#/utils/commonUtil.ts'
import { sendMeetingMsg, getExpertInfo, queryUserData,createGroup } from './meetingMgt.ts'
import { useVbenModal } from '@vben/common-ui'
import UserSelect from '#/views/basic/common/userSelect.vue'

const dropList = reactive({})
const emit = defineEmits(['closeModal'])
const faultCode = defineModel('faultCode');
const faultInfo = defineModel('faultInfo');
const data = reactive({
  formData: {},
  tableData: [],
  expertId: [],
  dialogShow: false
})
const participantsNum = computed(() => data.tableData.length)

const formRules = reactive({
  userName: [
    { required: true, message: '请输入群主', trigger: 'blur' },
  ],
  topic: [
    { required: true, message: '请输入群名称', trigger: 'blur' },
  ],
})

onMounted(async () => {
  data.formData.faultCode = faultCode.value
  data.formData.faultInfo = faultInfo.value
  const authStore = useAuthStore();
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const userInfo = await authStore.fetchUserInfo(token);
  console.log(userInfo)
  data.formData.userName = userInfo.username

  const queryVo = {}
  queryVo.loginCode = userInfo.logincode
  queryVo.pageSize = 1
  queryVo.pageNo = 1
  query(queryVo).then(telPhone => {
     data.formData.telPhone = telPhone;

  }).catch(error => {
    console.error("获取电话号码失败:", error);
  });
  const dropStore = useDropStore()
  const dropType = ['NSOS_PIM_NAME','NSOS_USER_NAME']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)
})

const inviteNumber = () => {
  if (data.tableData.length === 0) {
    ElMessage.warning('请选择加群人员或专家')
    return
  }
  if (!data.formData.topic || !data.formData.userName) {
    ElMessage.warning('请填写群名称和群主')
    return
  }
  createGroup({
    formData: data.formData,
    tableData: data.tableData
  })
  emit('closeModal')
}

const removeNumber = (row) => {
  ElMessageBox.confirm(`确定要移除 "${row.expertName}" 吗？`, '确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      data.tableData = data.tableData.filter((item) => item.id !== row.id)
      ElMessage({
        type: 'success',
        message: '已移除'
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消移除'
      })
    })
}

const addNumber = (selectedMap) => {
  const newData = Array.from(selectedMap.values())
  data.tableData = [...data.tableData, ...newData.filter((newItem) => !data.tableData.some((existingItem) => existingItem.id === newItem.id))]
}

watch(() => [...data.expertId],async(newValues,oldValues = []) => {
  console.log(data.expertId)
  const newSet = new Set(newValues)
  const oldSet = new Set(oldValues)
  const added = [...newValues.filter(x => !oldSet.has(x))]
  const remove = [...oldValues.filter(x => !newSet.has(x))]

  if (added.length > 0) {
    const expertData = await getExpertInfo({expertId: added[0]})
    data.tableData = [...data.tableData,...expertData]
  }

  if (remove.length > 0) {
    data.tableData = data.tableData.filter(item => !remove.includes(item.expertId))
  }
  
})

const [ModalB, modalApiB] = useVbenModal({
  onCancel() {
    modalApiB.close()
  }
})

const userSelectOk = (user) => {
  const info = {}
  const queryVo = {}
  info.expertName = user.employeeName
  queryVo.loginCode = user.employeeAccount
  queryVo.pageSize = 1
  queryVo.pageNo = 1

  query(queryVo).then(telPhone => {
    info.telPhone = telPhone;
    data.tableData.push(info);
    modalApiB.close();  // 关闭模态框
  }).catch(error => {
    console.error("获取电话号码失败:", error);
  });
  modalApiB.close()
}
const userAddClick = (codeProp, nameProp) => {
  modalApiB.open()
}

const query = async  (queryVo) => {
  const { list, count, pageNo } = await  queryUserData(queryVo)
  if(count > 0){
    console.log(list[0].mobileTel)
    return list[0].mobileTel
  }
  return null
}
</script>
<style scoped>
:deep(.el-header) {
  margin: 0;
  --el-header-padding: 8px;
}

:deep(.el-main) {
  padding: 0;
}

.flex-container {
  display: flex;
  align-items: center; /* 垂直居中对齐 */
  width: 100%; /* 确保容器占满宽度 */
}
</style>
