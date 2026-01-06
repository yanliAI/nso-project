<template>
  <el-container class="h-full bg-white">
    <el-header height="30px">
      <el-form label-width="100px" label-suffix=":" ref="myform" :model="mydata.form" :inline="true" label-position="right" class="demo-form-inline">
        <table width="100%" cellpadding="0" cellspacing="1" border="0">
          <colgroup>
            <col width="300" />
            <col width="300" />
            <col width="300" />
            <col width="220" />
            <col width="220" />
            <col width="" />
          </colgroup>
          <tbody>
            <tr>
              <td>
                <el-form-item label="故障编号" prop="faultCode" style="width: 100%; margin: 0">
                  <el-input v-model="mydata.form.faultCode" clearable />
                </el-form-item>
              </td>
              <td>
                <el-form-item label="故障名称" prop="faultInfo" style="width: 100%; margin: 0">
                  <el-input v-model="mydata.form.faultInfo" clearable />
                </el-form-item>
              </td>
              <td>
                <el-form-item label="系统名称" prop="faultSys" filterable style="width: 100%; margin: 0">
                  <el-select v-model="mydata.form.faultSys" clearable>
                    <el-option v-for="item in dropList.NSOS_SYS_NAME" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </td>
              <td>
                <el-form-item label-width="80px" label="状态" prop="faultStatus" filterable style="width: 100%; margin: 0">
                  <el-select v-model="mydata.form.faultStatus" clearable>
                    <el-option v-for="item in dropList.NSOS_FAULT_STATUS_FP" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </td>
              <td>
                <el-form-item label-width="130px" label="是否影响业务" prop="aa" filterable style="width: 100%; margin: 0">
                  <el-select v-model="mydata.form.aa" clearable>
                    <el-option v-for="item in dropList.NSOS_YES_OR_NO" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </td>
              <td>
                <el-popover :visible="mydata.moreVisible" placement="bottom" trigger="click" width="600px">
                  <template #reference>
                    <a class="my-text-link" @click="mydata.moreVisible = !mydata.moreVisible">更多>></a>
                  </template>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="典型故障" prop="isTipical" filterable>
                        <el-select v-model="mydata.form.isTipical" clearable>
                          <el-option v-for="item in dropList.NSOS_YES_OR_NO" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="事件级别" prop="eventLevel" filterable>
                        <el-select v-model="mydata.form.eventLevel" clearable>
                          <el-option v-for="item in dropList.NSOS_EVENT_LEVEL" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="运维单位" prop="operateOrg" filterable>
                        <el-select v-model="mydata.form.operateOrg" clearable>
                          <el-option v-for="item in dropList.NSOS_OPERATE_ORG" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="影响范围" prop="effectRange">
                        <el-input v-model="mydata.form.effectRange" clearable />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="系统等级" prop="sysLevel" filterable>
                        <el-select v-model="mydata.form.sysLevel" clearable>
                          <el-option v-for="item in dropList.NSOS_SYS_LEVEL" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="直接原因" prop="directReason">
                        <el-input v-model="mydata.form.directReason" clearable />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="根本原因" prop="radicallyReason">
                        <el-input v-model="mydata.form.radicallyReason" clearable />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="根因共性问题" prop="similarityProblem" filterable>
                        <el-select v-model="mydata.form.similarityProblem" clearable>
                          <el-option v-for="item in dropList.NSOS_SIMILARITY_PROBLEM" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-popover>
                <el-button type="primary" :icon="Search" @click="query">查询</el-button>
                <el-button type="info" :icon="RefreshLeft" @click="reset">重置</el-button>
              </td>
            </tr>
          </tbody>
        </table>
      </el-form>
    </el-header>
    <el-main style="height: calc(100% - 90px)">
      <el-table ref="mytable" :data="mydata.tableData" border size="small" style="height: 100%">
        <el-table-column type="index" fixed label="序号" align="center" width="45" />
        <el-table-column prop="faultCode" fixed label="故障编号" align="center" width="140">
          <template #default="scope">
            <a @click="showDetail(scope.row)" class="my-text-link">
              {{ scope.row.faultCode }}
            </a>
          </template>
        </el-table-column>
        <el-table-column prop="faultInfo" label="故障名称" width="300" align="center" />
        <el-table-column prop="replayStatus" label="故障状态" column-key="NSOS_FAULT_STATUS_FP" :formatter="formatDrop" align="center" width="100" />
        <el-table-column prop="faultSys" label="故障系统" column-key="NSOS_SYS_NAME" :formatter="formatDrop" align="center" width="200" />
        <el-table-column prop="effectRange" label="故障影响范围及程度" align="center" width="200" />
        <el-table-column prop="isTipical" label="是否典型故障" column-key="NSOS_YES_OR_NO" :formatter="formatDrop" align="center" width="90" />
        <el-table-column prop="sysLevel" label="故障系统/设备级别" column-key="NSOS_SYS_LEVEL" :formatter="formatDrop" align="center" width="150" />
        <el-table-column prop="operateOrg" label="运维单位" column-key="NSOS_OPERATE_ORG" :formatter="formatDrop" align="center" width="150" />
        <el-table-column prop="eventLevel" label="事件级别" column-key="NSOS_EVENT_LEVEL" :formatter="formatDrop" align="center" width="90" />
        <el-table-column prop="directReason" label="直接原因" align="center" width="200" />
        <el-table-column prop="radicallyReason" label="根本原因" align="center" width="200" />
        <el-table-column prop="similarityProblem" label="根因共性问题提炼" column-key="NSOS_SIMILARITY_PROBLEM" :formatter="formatDrop" align="center" width="200" />
      </el-table>
    </el-main>
    <el-footer height="45px">
      <el-pagination :current-page="mydata.pageInfo.pageNo" :page-size="mydata.pageInfo.pageSize" class="mt-1" :total="mydata.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="currentChange"></el-pagination>
    </el-footer>
  </el-container>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElTable, ElTableColumn, ElFormItem, ElForm, ElInput, ElButton, ElPagination, ElMessage, ElMessageBox, ElRow, ElCol, ElMain, ElContainer, ElHeader, ElFooter, ElTabs, ElTabPane, ElPopover } from 'element-plus'
import { requestClient } from '#/api/request'
import { useDropStore } from '#/store'
import { formatDrop } from '#/utils/commonUtil.ts'
import { Search, RefreshLeft } from '@element-plus/icons-vue'
import { queryByPage } from './faultReviewMethod.ts'
const emit = defineEmits(['detail'])

const dropList = reactive({})
const mytable = ref()
const myform = ref()

onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = ['NSOS_FAULT_STATUS_FP', 'NSOS_SYS_NAME', 'NSOS_SYS_LEVEL', 'NSOS_OPERATE_SCHEMA', 'NSOS_OPERATE_ORG', 'NSOS_YES_OR_NO', 'NSOS_EVENT_LEVEL', 'NSOS_SIMILARITY_PROBLEM']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)

  mydata.form.faultStatus = '2'
  query()
})

const mydata = reactive({
  tableData: [],
  form: {},
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0
  },
  moreVisible: false
})

const query = async () => {
  mydata.moreVisible = false
  mydata.form.pageSize = mydata.pageInfo.pageSize
  mydata.form.pageNo = mydata.pageInfo.pageNo
  const { list, pageNo, count } = await queryByPage(mydata.form)
  mydata.tableData = list
  mydata.pageInfo.pageNo = pageNo
  mydata.pageInfo.total = count
}

const reset = () => {
  mydata.form = {}
  query()
}

const handleSizeChange = (val) => {
  mydata.pageInfo.pageSize = val
  query()
}

const currentChange = (val) => {
  mydata.pageInfo.pageNo = val
  query()
}

const showDetail = (row) => {
  emit('detail', row)
}
</script>
<style scoped>
.my-text-link {
  font-size: 12px;
  margin: 0 10px;
  color: var(--el-color-primary);
  cursor: pointer;
}

.my-text-link:hover {
  text-decoration: underline;
}
</style>
