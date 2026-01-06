<template>
  <div class="fill-whole-white zbrybgxq-page">
    <component :is="mydetail.layout" :title="mydetail.title" :anchors="anchors">
      <!-- 顶部标题栏和操作栏 -->
      <template #head>
        <div class="zbrybgxq-operate-bar">
          <div class="zbrybgxq-operate-bar-col1">
            <label>变更单号：</label>
            <span class="primary">{{ mydetail.formdata.sheetNo }}</span>
            <el-icon class="primary" style="margin-left: 3px; cursor: pointer" title="复制" @click="copySheetNo(mydetail.formdata.sheetNo)"><CopyDocument /></el-icon>
          </div>
          <div class="zbrybgxq-operate-bar-col2">
            <label>流程状态：</label>
            <span v-if="mydetail.formdata.flowState === 0" style="color: #bebebe">待提交</span>
            <span v-if="mydetail.formdata.flowState === 1" style="color: #ffa500">待审核</span>
            <span v-if="mydetail.formdata.flowState === 2" style="color: #32cd32">已审核</span>
            <span v-else></span>
          </div>
          <div class="zbrybgxq-operate-bar-col3">
            <el-button type="primary" text plain size="small" :icon="View" @click="showWorkflow">流程跟踪</el-button>
          </div>
          <div class="zbrybgxq-operate-bar-col4">
            <el-button type="primary" size="small" :icon="DocumentChecked" @click="saveTable" v-if="right.save">保存</el-button>
            <el-button type="danger" plain size="small" :icon="Close" @click="withdraw" v-if="right.withdraw">撤回</el-button>
            <el-button type="primary" size="small" :icon="Position" @click="commit" v-if="right.commit && right.table">提交</el-button>
            <el-button type="primary" size="small" :icon="Position" @click="trans" v-if="right.commit && right.form">传递</el-button>
            <el-button type="danger" size="small" :icon="Back" @click="reject" v-if="right.reject">退回</el-button>
          </div>
        </div>
      </template>

      <!-- 工单信息 -->
      <template #modarea1>
        <div class="zbrybgxq-modarea-slot">
          <el-form label-width="100px" :model="mydetail.formdata" :inline="true" label-position="right" label-suffix=":" class="demo-form-inline">
            <el-row>
              <el-col :span="24">
                <el-form-item label="值班任务" style="width: 100%">
                  <el-input v-model="mydetail.formdata.dutyTaskName" disabled />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="发起人" style="width: 100%">
                  <el-input v-model="mydetail.formdata.creatorName" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="发起时间" style="width: 100%">
                  <el-date-picker v-model="mydetail.formdata.createTime" type="datetime" disabled style="width: 100%" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="变更信息" style="width: 100%" class="zbrybgxq-form-item">
                  <el-input v-model="mydetail.formdata.changeInfo" type="textarea" :rows="3" resize="none" disabled />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </template>

      <!-- 附件信息 -->
      <template #modarea2>
        <div class="zbrybgxq-modarea-slot" style="height: 240px">
          <AttachList ref="attachListRef" :parentId="mydetail.formdata.id" :moduleId="'dutyChange'"  @afterDelete="afterDelete" :showPreview="showPreview" :showDelete="showDelete"></AttachList>
        </div>
      </template>

      <!-- 变更详情 -->
      <template #modarea3>
        <div class="zbrybgxq-modarea-slot" style="height: 240px">
          <el-table
            :data="mydetail.tableData"
            border
            size="small"
            style="height: 100%"
            stripe
            :header-cell-style="{
              backgroundColor: '#F2F3F5',
              color: '#666666',
              fontSize: '14px',
              height: '40px',
              textAlign: 'center'
            }"
          >
            <el-table-column type="index" label="#" align="center" width="40" />
            <!-- <el-table-column prop="taskName" label="值班任务" width="200" /> -->
            <el-table-column prop="dutyDay" label="值班日期" align="center" width="100" />
            <el-table-column prop="dutyShift" label="班次" align="center" width="70" />
            <el-table-column label="变更前">
              <el-table-column prop="oldPerson" label="姓名" align="center" width="80" />
              <el-table-column prop="oldPhone" label="电话" align="center" width="100" />
            </el-table-column>
            <el-table-column label="变更后">
              <el-table-column label="姓名" align="center" width="80">
                <template #default="scope">
                  <el-input v-if="right.table" v-model="scope.row.newPerson" />
                  <span v-else>{{ scope.row.newPerson }}</span>
                </template>
              </el-table-column>
              <el-table-column label="电话" align="center" width="100">
                <template #default="scope">
                  <el-input v-if="right.table" v-model="scope.row.newPhone" />
                  <span v-else>{{ scope.row.newPhone }}</span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column prop="orgRole" label="组织角色" align="center" width="120" />
            <el-table-column prop="posRole" label="人员角色" align="center" width="120" />
            <el-table-column prop="unitName" label="单位" />
          </el-table>
        </div>
      </template>

      <!-- 审批信息 -->
      <template #modarea4>
        <div class="zbrybgxq-modarea-slot">
          <div class="zbrybgxq-modarea-slot">
            <div class="zbrybgxq-spxx-headbar">
              <div class="zbrybgxq-spxx-dot"></div>
              <div class="zbrybgxq-spxx-text">审批记录</div>
            </div>
            <div class="zbrybgxq-modarea-slot" style="height: 200px">
              <el-table
                :data="mydetail.auditList"
                border
                size="small"
                style="height: 100%"
                stripe
                :header-cell-style="{
                  backgroundColor: '#F2F3F5',
                  color: '#666666',
                  fontSize: '14px',
                  height: '40px',
                  textAlign: 'center'
                }"
              >
                <el-table-column type="index" label="#" align="center" width="40" />
                <el-table-column prop="auditorName" label="审批人" align="center" width="120" />
                <el-table-column prop="auditTime" label="审批时间" :formatter="tDateTimeFormat" align="center" width="160" />
                <el-table-column prop="auditType" label="操作" align="center" width="100" />
                <el-table-column prop="auditOpinion" label="审批意见" />
              </el-table>
            </div>
          </div>

          <div class="zbrybgxq-modarea-slot" v-if="right.form">
            <div class="zbrybgxq-spxx-headbar" style="margin-top: 10px">
              <div class="zbrybgxq-spxx-dot"></div>
              <div class="zbrybgxq-spxx-text">审批意见</div>
            </div>
            <div class="zbrybgxq-modarea-slot">
              <el-form label-width="100px" ref="myform" :rules="formRules" :model="mydetail.formdata" :inline="true" label-position="right" label-suffix=":" class="demo-form-inline">
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="意见" prop="opinion" style="width: 100%" class="zbrybgxq-form-item2">
                      <el-input v-model="mydetail.formdata.opinion" type="textarea" :rows="2" resize="none" :disabled="!right.form" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </div>
        </div>
      </template>
    </component>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { View, Position, Close, Back, DocumentChecked, CopyDocument } from '@element-plus/icons-vue'
import detailLayout from '/src/component/common/detailLayout.vue'
import { getDetail, undoData, transData, foreData, backData, saveChange } from './dutyChangeMethod.ts'
import { lookFlow, tDateTimeFormat, copyText } from '#/utils/commonUtil.ts'
import { ElMessage, ElMessageBox } from 'element-plus'
import AttachList from '/src/views/basic/attach/attachList.vue'

const emit = defineEmits(['refreshList'])
const props = defineProps({
  wfId: String
})

const anchors = ref(['工单信息', '附件信息', '变更详情', '审批信息'])
const mydetail = reactive({
  layout: null,
  title: '值班人员变更信息',
  formdata: {},
  tableData: [],
  auditList: []
})
const right = reactive({
  form: false,
  withdraw: false,
  commit: false,
  reject: false,
  table: false,
  save: false
})

const myform = ref(null)
const formRules = reactive({
  opinion: [{ required: true, message: '请填写审批意见', trigger: 'blur' }]
})

onMounted(async () => {
  queryDetail()
})

// 查询详情
const queryDetail = async () => {
  mydetail.layout = detailLayout
  const data = await getDetail(props.wfId)
  mydetail.formdata = data.info
  mydetail.tableData = data.detailList
  mydetail.auditList = data.auditList

  right.form = data.formRight
  right.withdraw = data.withdrawRight
  right.commit = data.commitRight
  right.reject = data.rejectRight
  right.table = data.tableRight
  right.save = data.saveRight
}

// 复制单号
const copySheetNo = async (text) => {
  if (copyText(text)) {
    ElMessage.success(text + '已复制到剪切板！')
  }
}

// 流程跟踪
const showWorkflow = async () => {
  lookFlow(mydetail.formdata.processId, mydetail.formdata.processInsId)
}

// 撤回
const withdraw = async () => {
  try {
    const res = await undoData(mydetail.formdata)
    ElMessage.success('撤回成功！')
    queryDetail()
    emit('refreshList')
  } catch {
    ElMessage.error('撤回失败！')
  }
}

// 提交
const commit = async () => {
  const valid = await validMytable()
  if (valid) {
    try {
      const data = {
        info: mydetail.formdata,
        detailList: mydetail.tableData
      }
      const res = await foreData(data)
      ElMessage.success('提交成功！')
      queryDetail()
      emit('refreshList')
    } catch {
      ElMessage.error('提交失败！')
    }
  }
}

// 通过/传递
const trans = async () => {
  try {
    await myform.value.validate()
    transRequest()
  } catch (error) {
    ElMessage.error('请填写审批意见！')
  }
}
const transRequest = async () => {
  try {
    const res = await transData(mydetail.formdata)
    ElMessage.success('传递成功！')
    queryDetail()
    emit('refreshList')
  } catch {
    ElMessage.error('传递失败！')
  }
}

// 退回
const reject = async () => {
  try {
    await myform.value.validate()
    rejectRequest()
  } catch (error) {
    ElMessage.error('请填写审批意见！')
  }
}
const rejectRequest = async () => {
  try {
    const res = await backData(mydetail.formdata)
    ElMessage.success('退回成功！')
    queryDetail()
    emit('refreshList')
  } catch {
    ElMessage.error('退回失败！')
  }
}

// 保存列表数据
const saveTable = async () => {
  const valid = await validMytable()
  if (valid) {
    try {
      const res = await saveChange(mydetail.tableData)
      ElMessage.success('保存成功！')
      queryDetail()
    } catch {
      ElMessage.error('保存失败！')
    }
  }
}

// 表格数据校验
const validMytable = async () => {
  let msg = ''
  mydetail.tableData.forEach((item, rowIndex) => {
    if (!item.newPerson || !item.newPhone) {
      if (msg) {
        msg += '</br>'
      }
      msg += '第' + (rowIndex + 1) + '行：'
      if (!item.newPerson) {
        msg += '变更后值班人员，'
      }
      if (!item.newPhone) {
        msg += '变更后值班人员电话，'
      }
      msg = msg.substring(0, msg.length - 1)
    }
  })
  if (msg) {
    ElMessageBox.alert(msg, '请填写变更详情', {
      type: 'error',
      dangerouslyUseHTMLString: true,
      buttonSize: 'small',
      showClose: false
    })
    return false
  } else {
    return true
  }
}
</script>
<style scoped>
.primary {
  color: hsl(var(--primary));
}

.zbrybgxq-page {
  font-size: 12px;
}

.zbrybgxq-operate-bar {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

.zbrybgxq-operate-bar-col1 {
  width: 23%;
}

.zbrybgxq-operate-bar-col2 {
  width: 23%;
}

.zbrybgxq-operate-bar-col2 > span {
  color: #8e8e93;
}

.zbrybgxq-operate-bar-col3 {
  width: 23%;
}

.zbrybgxq-operate-bar-col4 {
  flex-grow: 1;
  text-align: right;
  padding-right: 20px;
}

.zbrybgxq-modhead-slot {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: end;
}

.zbrybgxq-modarea-slot {
  width: 100%;
}

.zbrybgxq-form-item :deep(.el-form-item__label) {
  line-height: 73px;
}

.zbrybgxq-form-item2 :deep(.el-form-item__label) {
  line-height: 52px;
}

.zbrybgxq-spxx-headbar {
  width: 100%;
  height: 20px;
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.zbrybgxq-spxx-dot {
  height: 8px;
  width: 8px;
  border-radius: 8px;
  background: #00bfff;
  margin-left: 5px;
  margin-right: 2px;
  margin-top: 2px;
}

.zbrybgxq-spxx-text {
  font-weight: 700;
  color: #666666;
}
</style>
