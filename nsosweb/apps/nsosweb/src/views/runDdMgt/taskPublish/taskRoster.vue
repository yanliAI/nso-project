<template>
  <div class="task-roster-comp">
    <div class="task-roster-condition-area">
      <el-form :model="data.formData" :inline="true" label-position="right" label-suffix=":" label-width="80px" class="demo-form-inline mt-2">
        <el-row>
          <el-col :span="6">
            <el-form-item label="单位" prop="unitId">
              <el-select v-model="data.formData.unitId" placeholder="选择单位" collapse-tags collapse-tags-tooltip remote reserve-keyword clearable filterable :disabled="!selectable">
                <el-option v-for="item in dropList.NSOS_ORG_NAME_SJ" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="组织角色" prop="orgRole">
              <el-input v-model="data.formData.orgRole" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="人员角色" prop="emRole">
              <el-input v-model="data.formData.emRole" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8" style="padding-left: 10px">
            <el-button type="primary" class="ml-4" :icon="Search" @click="query">查询</el-button>
            <el-button type="primary" class="ml-4" :icon="Download" @click="exportClick">导出</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="task-roster-table-area">
      <table cellpadding="0" cellspacing="0" border="0" :style="'width: ' + tableWidth + 'px;'">
        <colgroup>
          <col v-for="(item, i) in tableData.heads" :width="i < 3 ? tableData.width[i] : 200" />
        </colgroup>
        <thead>
          <tr>
            <td align="center" v-for="(item, i) in tableData.heads">
              <div class="task-roster-table-head-cell">
                <span v-html="item"></span>
                <!-- <span v-if="i === tableData.todayIndex" class="task-roster-table-head-todaytag">今</span> -->
              </div>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in tableData.rows">
            <td v-for="(item, i) in row.cols">
              <div v-html="item" class="task-roster-table-cell"></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup>
import { Search, Delete, Plus, Download } from '@element-plus/icons-vue'
import { ElForm, ElFormItem, ElRow, ElCol, ElMessage } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
import { requestClient } from '#/api/request'
import { useDropStore } from '#/store'
import { useAccessStore } from '@vben/stores'
import { formatToken } from '#/utils/commonUtil.ts'

const props = defineProps({
  taskId: String,
  unitId: String
})

const dropList = reactive({})
const selectable = ref(true)
onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = ['NSOS_ORG_NAME_SJ']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)
  if (props.unitId) {
    data.formData.unitId = props.unitId
    selectable.value = false
  }
  query()
})

const data = reactive({
  formData: {
    unitId: ''
  }
})
const tableData = reactive({
  heads: [],
  rows: [],
  todayIndex: 3,
  width: [300, 180, 180]
})
const tableWidth = ref()

// 查询
const query = async () => {
  const res = await requestClient.get(import.meta.env.VITE_NSOSGZ + '/dutyTasksInfo/queryDutyRosterInfoList?dutyTaskId=' + props.taskId + '&unitId=' + data.formData.unitId + '&orgRole=' + data.formData.orgRole + '&emRole=' + data.formData.emRole)
  tableWidth.value = 660 + (res.heads.length - 3) * 200 + (res.heads.length + 1)
  tableData.todayIndex = res.todayIndex
  tableData.heads = res.heads
  tableData.rows = res.rows
}

// 导出
const exportClick = async () => {
  const accessStore = useAccessStore()
  const reqUrl = import.meta.env.VITE_NSOSGZ + '/dutyTasksInfo/exportRosterList?dutyTaskId=' + props.taskId + '&unitId=' + data.formData.unitId + '&orgRole=' + data.formData.orgRole + '&emRole=' + data.formData.emRole
  const filename = '护网值班排班信息.xlsx'
  let xhr = new XMLHttpRequest()
  xhr.open('GET', reqUrl, true)
  xhr.setRequestHeader('Authorization', formatToken(accessStore.accessToken))
  xhr.responseType = 'blob'
  xhr.onload = function () {
    if (this.status === 200) {
      let blob = this.response
      let reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onload = function (e) {
        let a = document.createElement('a')
        a.download = filename
        a.href = e.target.result
        document.body.appendChild(a)
        a.click()
        a.remove()
      }
    } else {
      ElMessage.error('导出失败！')
    }
  }
  xhr.send()
}
</script>
<style scoped>
.primary {
  color: hsl(var(--primary));
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

:deep(.el-main) {
  padding: 0;
}

.task-roster-comp {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-size: 12px;
}

.task-roster-condition-area {
  height: 50px;
}

.task-roster-table-area {
  position: relative;
  flex-grow: 1;
  padding-bottom: 20px;
  overflow: auto;
}

.task-roster-table-area table {
  border-left: 1px solid #e2e2e2;
}

.task-roster-table-area table > thead {
  position: sticky;
  top: 0;
  z-index: 9;
  font-weight: 700;
  color: #909399;
  background: #f4f4f5;
}

.task-roster-table-area table > thead > tr > td {
  height: 60px;
  padding: 4px 8px;
  border-right: 1px solid #e2e2e2;
  border-bottom: 1px solid #e2e2e2;
}

.task-roster-table-head-cell {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.task-roster-table-head-todaytag {
  position: absolute;
  top: 0;
  right: 0;
  padding: 2px;
  color: #fff;
  background: #1e90ff;
  border-radius: 5px;
}

.task-roster-table-area table > tbody > tr > td {
  height: 60px;
  padding: 4px 8px;
  border-right: 1px solid #e2e2e2;
  border-bottom: 1px solid #e2e2e2;
}

.task-roster-table-cell {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
}
</style>
