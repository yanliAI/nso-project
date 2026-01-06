<template>
  <Page auto-content-height>
    <div class="w-full h-full">
      <el-container class="h-full bg-white">
        <el-header height="53px">
          <el-form label-width="100px" :model="data.formData" :inline="true" label-position="right" class="demo-form-inline mt-[10px]">
            <el-row>
              <el-col :span="4">
                <el-form-item label="核查对象:" prop="ruleTableName">
                  <el-select v-model="data.formData.ruleTableName" filterable>
                    <el-option v-for="item in hcObject" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="核查字段:" prop="ruleColumnName">
                  <el-select v-model="data.formData.ruleColumnName" filterable>
                    <el-option v-for="item in hcColumn" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="核查结果:" prop="checkResult">
                  <el-select v-model="data.formData.checkResult" filterable>
                    <el-option v-for="item in hcResult" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="核查时间:" filterable>
                  <el-date-picker v-model="data.formData.hcTime" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" start-placeholder="开始时间" end-placeholder="结束时间" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-button type="primary" class="ml-4" :icon="Search" @click="query(null)">查询</el-button>
                <el-button type="primary" class="ml-4" :icon="Position" @click="onlineCheckClick(null)">发起审批</el-button>
                <el-button type="info" plain class="ml-4" :icon="RefreshLeft" @click="refreshClick">重置</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-header>
        <el-main style="height: calc(100% - 93px)">
          <el-table ref="tableDataRef" :data="data.tableData" border show-overflow-tooltip style="height: 100%" stripe>
            <el-table-column type="selection" width="40" fixed :selectable="selectable" align="center" />
            <el-table-column type="index" fixed width="45" label="#" align="center" />
            <el-table-column prop="ruleName" label="规则名称" width="200" align="center" />
            <el-table-column prop="ruleTableName" label="核查对象" width="120" align="center">
              <template #default="scope">
                {{ hcObject.filter((d) => d.value == scope.row.ruleTableName)[0]?.label }}
              </template>
            </el-table-column>
            <el-table-column prop="ruleColumnName" label="核查字段" width="120" align="center">
              <template #default="scope">
                {{ hcColumn.filter((d) => d.value == scope.row.ruleColumnName)[0]?.label }}
              </template>
            </el-table-column>
            <el-table-column prop="checkContent" label="核查内容" width="250" align="center" />
            <el-table-column prop="zcbm" label="资产编码" width="150" align="center" />
            <el-table-column prop="zcmc" label="资产名称" width="150" align="center" />
            <el-table-column prop="zcxx" label="资产信息" width="100" align="center" />
            <el-table-column prop="ruleContent" label="核查规则(正则表达式)" width="250" align="left" header-align="center" />
            <el-table-column prop="ruleDescribe" label="规则说明" width="250" align="left" header-align="center" />
            <el-table-column prop="checkResult" label="核查结果" fixed="right" width="100" align="center" />
            <el-table-column prop="checkTime" label="核查时间" fixed="right" :formatter="tDateTimeFormat" width="160" align="center" />
          </el-table>
        </el-main>
        <ElFooter height="40px">
          <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" class="mt-1" :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="currentChange"></el-pagination>
        </ElFooter>
      </el-container>
    </div>
    <ModalA class="w-[700px] h-[510px]" title="发起审批" :footer="false" :closeOnClickModal="false" :draggable="true">
      <el-form label-width="110px" ref="ruleFormRef" :model="data.orderData" :rules="formRules" :inline="true" label-position="right" class="demo-form-inline mt-2">
        <el-row>
          <el-col :span="12">
            <el-form-item label="工单号:" prop="sheetNo">
              <el-input v-model="data.orderData.sheetNo" clearable disabled />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="工单类型:" prop="sheetType">
              <el-select v-model="data.orderData.sheetType" filterable>
                <el-option v-for="item in orderType" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="工单标题:" prop="sheetTitle">
              <el-input v-model="data.orderData.sheetTitle" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="工单内容:" prop="sheetContent">
              <el-input v-model="data.orderData.sheetContent" :rows="2" maxlength="1600" show-word-limit type="textarea" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="变更内容:" prop="bgnr">
              <el-input v-model="data.orderData.bgnr" :rows="2" maxlength="1600" show-word-limit type="textarea" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="变更原因:" prop="bgyy">
              <el-input v-model="data.orderData.bgyy" :rows="2" maxlength="1600" show-word-limit type="textarea" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="变更目的:" prop="bgmd">
              <el-input v-model="data.orderData.bgmd" :rows="2" maxlength="1600" show-word-limit type="textarea" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="发起人:" prop="sendMan">
              <el-select v-model="data.orderData.sendMan" disabled>
                <el-option v-for="item in dropList.NSOS_USER_NAME" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发起时间:" prop="sendTime">
              <el-date-picker v-model="data.orderData.sendTime" type="datetime" disabled clearable />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="text-center pt-[10px] pb-[20px]">
        <el-button type="primary" class="ml-4" :icon="Tickets" @click="saveData">提交</el-button>
        <el-button type="info" class="ml-4" :icon="Close" @click="modalApiA.close()">取消</el-button>
      </div>
    </ModalA>
  </Page>
</template>
<script setup>
import { Page } from '@vben/common-ui'
import { onMounted, reactive, ref, watch, nextTick } from 'vue'
import { ElForm, ElFormItem, ElRow, ElCol, ElTable, ElTableColumn, ElPagination, ElMain, ElContainer, ElHeader, ElFooter, ElMessageBox, ElMessage, ElNotification } from 'element-plus'
import { Search, RefreshLeft, Plus, Delete, Download, Operation, Notification, Position, Tickets, Close } from '@element-plus/icons-vue'
import { tDateFormat, formatDateTime, tDateTimeFormat, formatDrop } from '#/utils/commonUtil.ts'
import { useDropStore } from '#/store'
import { useVbenModal } from '@vben/common-ui'
import { requestClient } from '#/api/request'
import { useRouter } from 'vue-router'
const router = useRouter()
const queryState = defineModel('queryState')
const [ModalA, modalApiA] = useVbenModal({
  onCancel() {
    modalApiA.close()
  }
})
const ruleFormRef = ref()
const hcResult = [
  { label: '合规', value: '合规' },
  { label: '不合规', value: '不合规' }
]
const hcObject = [
  { label: '系统信息', value: '1' },
  { label: '物理机', value: '2' },
  { label: '容器', value: '3' },
  { label: '组件信息', value: '4' }
]
const hcColumn = [
  { label: '系统名称', value: 'SYSTEM_NAME' },
  { label: 'IP', value: 'IP' }
]
const data = reactive({
  tableData: [],
  orderData: {},
  formData: {},
  sysId: null,
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0
  }
})
const orderType = [
  { label: '台账异常', value: '1' },
  { label: '资产变更', value: '2' }
]
const formRules = reactive({
  sheetContent: [
    { required: true, message: '请输入工单内容', trigger: 'blur' },
    { min: 0, max: 500, message: '内容长度最大不能超过500', trigger: 'blur' }
  ],
  sheetTitle: [
    { required: true, message: '请输入工单标题', trigger: 'blur' },
    { min: 0, max: 80, message: '内容长度最大不能超过80', trigger: 'blur' }
  ]
})
const selectable = (row) => !['合规'].includes(row.checkResult)

const tableDataRef = ref()
const dropList = reactive({})
onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = ['NSOS_SYS_LEVEL', 'NSOS_ORG_NAME', 'NSOS_USER_NAME']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)

  query(true)
})

const query = async (showmask) => {
  data.formData.pageSize = data.pageInfo.pageSize
  data.formData.pageNo = data.pageInfo.pageNo

  data.formData.startCheckTime = data.formData.hcTime?.[0]
  data.formData.endCheckTime = data.formData.hcTime?.[1]

  const { list, count, pageNo } = await requestClient.post(import.meta.env.VITE_BASIC + '/filesCheckResult/queryData', data.formData)
  data.tableData = list
  data.pageInfo.pageNo = pageNo
  data.pageInfo.total = count
}
const refreshClick = () => {
  data.formData = {}
}
const onlineCheckClick = async () => {
  let rows = tableDataRef.value.getSelectionRows()

  if (rows.length == 0) {
    ElMessage.warning('请勾选记录！')
    return
  }

  data.orderData = await requestClient.get(import.meta.env.VITE_BASIC + '/filesWorksheet/addOrder')
  modalApiA.open()
}
const saveData = async () => {
  let rows = tableDataRef.value.getSelectionRows()

  if (rows.length == 0) {
    ElMessage.warning('请勾选记录！')
    return
  }
  let ids = ''
  rows.forEach((r) => {
    if (r.id) {
      ids += r.id + ','
    }
  })
  await ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        data.orderData = await requestClient.post(import.meta.env.VITE_BASIC + '/filesWorksheet/genOrder', data.orderData, { params: { ids: ids.substring(0, ids.length - 1) } })
      } catch {
        ElMessage.error('提交失败！')
        return
      }
      modalApiA.close()
      ElNotification({
        title: '提示',
        message: '提交成功！',
        type: 'success'
      })
      if (data.orderData) {
        window.open(
          router.resolve({
            path: '/tzDataMgt/tzChangeOrder',
            query: { id: data.orderData.id, sheetNo: data.orderData.sheetNo }
          }).href,
          'nsos-assessAnalysis'
        )
      }
    } else {
      ElMessage.warning('请输入必填项！')
    }
  })
}
const handleSizeChange = (val) => {
  data.pageInfo.pageSize = val
  query()
}
const currentChange = (val) => {
  data.pageInfo.pageNo = val
  query()
}

defineExpose({})
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
  width: calc(100% - 20px);
  margin-right: 20px;
  margin-bottom: 12px;
}

:deep(.el-form-item) {
  width: calc(100% - 20px);
  margin-right: 20px;
  margin-bottom: 12px;
}

:deep(.el-main) {
  padding: 0;
}

:deep(.el-tabs) {
  --el-tabs-header-height: 30px;
}

:deep(.el-tabs__item) {
  font-size: 12px;
}

:deep(.el-tabs__header) {
  margin-bottom: 4px;
}

:deep(.el-popper) {
  max-width: 600px !important;
}

.primary {
  color: hsl(var(--primary));
}

.cmdcode {
  cursor: pointer;
}

.cmdcode:hover {
  text-decoration: underline;
}
</style>
