<template>
  <el-table :data="data.tableData" border size="small" style="height: calc(100% - 50px)">
    <el-table-column type="index" fixed width="40" label="#" align="center" />
    <el-table-column prop="orgName" label="单位名称" align="center" />
    <el-table-column prop="sortNo" label="排序号" width="120px" align="center">
      <template #default="scope">
            <el-input v-model="scope.row.sortNo" @change="handleChange(scope.row)"> </el-input>
          </template>
    </el-table-column>
  </el-table>
  <div style="justify-content: center; align-items: center;height: 40px;margin-top: 10px" class="flex">
      <el-button type="primary" :icon="DocumentChecked" @click="save">保存</el-button>
      <el-button :icon="Close" @click="cancel">取消</el-button>
    </div>
</template>
<script setup>
import { ref, reactive, onMounted, defineEmits, computed } from 'vue'
import { ElTable } from 'element-plus'
import { querySortApi, queryUnitSortApi } from './taskPublishMethod.ts'

const emit = defineEmits(['cancleSort','saveSort'])
const taskInfo = defineModel('taskInfo')

onMounted(async () => {
  if (taskInfo.value.sortData.length !== 0) {
    data.tableData = taskInfo.value.sortData;
  }else if (taskInfo.value.sortData.length === 0) {
    if (taskInfo.value.tasksInfoVO.status === '1') {
      data.tableData = await queryUnitSortApi({ dutyTaskId: taskInfo.value.tasksInfoVO.id})
    }else {
      data.tableData = await querySortApi({ templateId: taskInfo.value.tasksInfoVO.templateId })
    }
  }
})

const data = reactive({
  tableData: [],
  isChange: 'N'
})

function handleChange() {
  data.isChange = 'Y'
}

function save() {
  emit('saveSort',data.tableData,data.isChange)
}

function cancel() {
  emit('cancleSort')
}
</script>
