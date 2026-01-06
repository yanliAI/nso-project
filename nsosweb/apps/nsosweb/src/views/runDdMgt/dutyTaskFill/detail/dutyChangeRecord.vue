<template>
  <div class="fill-whole-white" style="overflow: hidden">
    <div class="mytable-area">
      <el-table
        ref="mytable"
        :data="mydata.tableData"
        border
        size="small"
        style="height: 100%"
        stripe
        :header-cell-style="{
          backgroundColor: '#F2F3F5',
          color: '#666666',
          height: '40px',
          textAlign: 'center'
        }"
      >
        <el-table-column type="index" label="#" align="center" width="40" />
        <el-table-column prop="orgRole" label="组织角色" align="center" />
        <el-table-column prop="posRole" label="人员角色" align="center" width="180" />
        <el-table-column prop="dutyPerson" label="姓名" align="center" width="100" />
        <el-table-column prop="dutyPhone" label="电话" align="center" width="150" />
        <el-table-column prop="dutyTime" label="值班日期" align="center" width="130" />
        <el-table-column prop="dutyShift" label="班次" align="center" width="80" />
        <el-table-column label="变更后值班人员姓名" align="center" width="150">
          <template #default="scope">
            <el-input v-model="scope.row.newPerson" />
          </template>
        </el-table-column>
        <el-table-column label="变更后值班人员电话" align="center" width="150">
          <template #default="scope">
            <el-input v-model="scope.row.newPhone" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="myupload-area mt-2">
      <AttachFileA ref="attachFileARef" :parentId="mydata.bakId" :moduleId="'dutyChange'" :inAdvance="true" :showPreview="true" @afterUpload="afterUpload" @afterDelete="afterDelete" />
    </div>
    <div class="myoperate-area">
      <el-button type="primary" :icon="Position" @click="startWf">提交</el-button>
      <el-button :icon="Close" @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script setup>
import { Close, Position } from '@element-plus/icons-vue'
import { ElTable, ElTableColumn, ElMessageBox, ElMessage, ElInput } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
import { requestClient } from '#/api/request'
import AttachFileA from '/src/views/basic/attach/attachFileA.vue'

const emit = defineEmits(['refresh', 'close'])
const props = defineProps({
  data: Array
})

const mytable = ref()
const mydata = reactive({
  tableData: [],
  bakId: '',
})
const attachFileARef = ref()
onMounted(async () => {
  mydata.tableData = props.data
  mydata.bakId = 'DUTY_CHANGE_' + new Date().getTime();
})

// 提交
const startWf = async () => {
  const attachList = attachFileARef.value.getAttachList()
  if (attachList.length == 0) {
    ElMessage.warning('请上传附件！')
    return
  }
  const arr = []
  let flag = true
  mydata.tableData.forEach((item, rowIndex) => {
    if (item.newPerson && item.newPhone) {
      arr.push({
        dutyTaskId: item.dutyTaskId,
        rosterInfoId: item.id,
        oldPerson: item.dutyPerson,
        oldPhone: item.dutyPhone,
        newPerson: item.newPerson,
        newPhone: item.newPhone
      })
    } else {
      flag = false
    }
  })
  if (flag) {
    try {
      await requestClient.post(import.meta.env.VITE_NSOSGZ + '/dutyManChange/startWf', arr, { params: { bakId: mydata.bakId } })
      ElMessage.success('提交成功！')
      emit('close')
      emit('refresh')
    } catch {
      ElMessage.error('提交失败！')
    }
  } else {
    ElMessage.warning('请填写变更后的值班人员及电话！')
  }
}

// 取消
const cancel = () => {
  emit('close')
}
</script>
<style scoped>
.mytable-area {
  width: 100%;
  height: calc(50% - 50px);
}

.myoperate-area {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.myupload-area {
  width: 100%;
  height: 50%;
}
</style>
