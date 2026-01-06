<template>
  <div class="fill-whole-white" style="overflow: hidden">
    <div class="mypage-condition-area">
      <el-form label-width="90px" label-suffix=":" :model="data.formdata" label-position="right" class="demo-form-inline mt-2">
        <el-row>
          <el-col :span="4">
            <el-form-item label="单位" label-width="50px" prop="unitId">
              <el-select v-model="data.formdata.unitId" placeholder="选择单位" collapse-tags collapse-tags-tooltip remote reserve-keyword disabled filterable>
                <el-option v-for="item in dropList.NSOS_ORG_NAME_SJ" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="组织角色" prop="orgRole">
              <el-input v-model="data.formdata.orgRole" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="姓名" label-width="70px" prop="dutyPerson">
              <el-input v-model="data.formdata.dutyPerson" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="电话" label-width="70px" prop="dutyPhone">
              <el-input v-model="data.formdata.dutyPhone" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="值班日期" prop="dutyTime">
              <el-date-picker format="YYYY-MM-DD" value-format="YYYY-MM-DD" v-model="data.formdata.dutyTime" type="date" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" class="ml-4" :icon="Search" @click="query">查询</el-button>
            <el-button type="primary" class="ml-4" :icon="Position" @click="startChange">发起变更</el-button>
            <div style="float: right; padding-top: 8px; padding-right: 20px">
              <el-icon v-show="showAsGrid" class="display-switch-icon" @click="showAsGrid = !showAsGrid" title="日历视图"><Calendar /></el-icon>
              <el-icon v-show="!showAsGrid" class="display-switch-icon" @click="showAsGrid = !showAsGrid" title="列表视图"><Grid /></el-icon>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="mypage-table-area">
      <el-table
        ref="mytable"
        :data="data.tableData"
        border
        size="small"
        @selection-change="handleSelectionChange"
        style="height: 100%"
        stripe
        :header-cell-style="{
          backgroundColor: '#F2F3F5',
          color: '#666666',
          height: '40px',
          textAlign: 'center'
        }"
      >
        <el-table-column type="selection" align="center" />
        <el-table-column type="index" label="#" align="center" width="40" />
        <el-table-column prop="unitName" label="单位" />
        <el-table-column prop="orgRole" label="组织角色" align="center" width="180" />
        <el-table-column prop="posRole" label="人员角色" align="center" width="180" />
        <el-table-column prop="dutyPerson" label="姓名" align="center" width="120" />
        <el-table-column prop="dutyPhone" label="电话" align="center" width="150" />
        <el-table-column prop="dutyTime" label="值班日期" align="center" width="130" />
        <el-table-column prop="dutyShift" label="班次" align="center" width="120" />
        <el-table-column prop="updatorName" label="最后修改人" align="center" width="140" />
        <el-table-column prop="updateTime" label="最后修改时间" :formatter="tDateTimeFormat" align="center" width="160" />
      </el-table>
    </div>
    <div class="mypage-pagebar-area">
      <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" class="mt-1" :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="currentChange"></el-pagination>
    </div>

    <!-- 值班变更 -->
    <Modal class="h-[600px] w-[1200px] top-[160px]" title="值班变更" :footer="false" :closeOnClickModal="false" :draggable="true">
      <duty-change-record :data="data.changeList" @refresh="query" @close="close" />
    </Modal>
  </div>
</template>

<script setup>
import { Search, Position, Calendar, Grid } from '@element-plus/icons-vue'
import { ElForm, ElFormItem, ElRow, ElCol, ElTable, ElTableColumn, ElPagination, ElMain, ElContainer, ElHeader, ElFooter, ElMessageBox, ElMessage } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
import { tDateFormat, tDateTimeFormat, formatDate } from '#/utils/commonUtil.ts'
import { queryByPage } from './dutyDetailList.ts'
import { useDropStore } from '#/store'
import { useVbenModal } from '@vben/common-ui'
import dutyChangeRecord from './dutyChangeRecord.vue'

const props = defineProps({
  taskId: String,
  unitId: String,
  status: String
})
const data = reactive({
  formdata: {
    dutyTaskId: '',
    unitId: '',
    orgRole: '',
    dutyPerson: '',
    dutyPhone: '',
    dutyTime: '',
    sortNames: ['startTime'],
    sortTypes: ['asc']
  },
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0
  },
  tableData: [],
  changeList: []
})
const showAsGrid = ref(true)
const mytable = ref()
const selectedRows = ref([])
const dropList = reactive({})
onMounted(async () => {
  data.formdata.dutyTaskId = props.taskId
  data.formdata.unitId = props.unitId
  // data.formdata.dutyTime = formatDate(new Date().getTime())
  const dropStore = useDropStore()
  const dropType = ['NSOS_ORG_NAME_SJ']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)
  query()
})

// 查询
const query = async () => {
  data.formdata.pageSize = data.pageInfo.pageSize
  data.formdata.pageNo = data.pageInfo.pageNo
  const { list, pageNo, count } = await queryByPage(data.formdata)
  data.tableData = list
  data.pageInfo.pageNo = pageNo
  data.pageInfo.total = count
}

const handleSelectionChange = (val) => {
  selectedRows.value = val
}

const handleSizeChange = (val) => {
  data.pageInfo.pageSize = val
  query()
}

const currentChange = (val) => {
  data.pageInfo.pageNo = val
  query()
}

// 发起变更
const startChange = () => {
  if (props.status != '4') {
    ElMessage.warning('任务未归档，不能发起变更流程，如要修改，请联系任务发布人退回后再操作！')
  } else {
    const arr = JSON.parse(JSON.stringify(selectedRows.value))
    if (arr.length === 0) {
      ElMessage.warning('请先选择需要变更的值班信息')
      return
    }
    data.changeList = arr
    modalApi.open()
  }
}

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close()
  }
})

const close = () => {
  modalApi.close()
}
</script>
<style scoped>
.display-switch-icon {
  color: hsl(var(--primary));
  cursor: pointer;
}

.display-switch-icon:hover {
  color: #00bfff;
}

.mypage-condition-area {
  width: 100%;
  height: 40px;
}

.mypage-table-area {
  width: 100%;
  height: calc(100% - 90px);
  overflow: auto;
}

.mypage-pagebar-area {
  width: 100%;
  height: 50px;
}
</style>
