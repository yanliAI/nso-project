<template>
  <div class="fill-whole-white zbryqrxq-page">
    <component :is="mydetail.layout" :title="mydetail.title" :anchors="anchors">
      <!-- 顶部标题栏和操作栏 -->
      <template #head>
        <div class="zbryqrxq-operate-bar">
          <div class="zbryqrxq-operate-bar-col1">
            <label>确认单号：</label>
            <span class="primary">{{ mydetail.formdata.orderCode }}</span>
            <el-icon class="primary" style="margin-left: 3px; cursor: pointer" title="复制" @click="copySheetNo(mydetail.formdata.orderCode)"><CopyDocument /></el-icon>
          </div>
          <div class="zbryqrxq-operate-bar-col2">
            <label>流程状态：</label>
            <span v-if="mydetail.formdata.status === '1'" style="color: #ffa500">待确认</span>
            <span v-if="mydetail.formdata.status === '2'" style="color: #32cd32">已确认</span>
            <span v-else></span>
          </div>
          <!-- <div class="zbryqrxq-operate-bar-col3">
            <el-button type="primary" text plain size="small" :icon="View" @click="showWorkflow">流程跟踪</el-button>
          </div> -->
          <div class="zbryqrxq-operate-bar-col4">
            <el-button type="primary" size="small" :icon="DocumentChecked" @click="confirmDuty" v-if="mydetail.formdata.status === '1'">确认</el-button>
          </div>
        </div>
      </template>

      <!-- 基础信息 -->
      <template #modarea1>
        <div class="zbryqrxq-modarea-slot">
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
                  <el-date-picker v-model="mydetail.formdata.initiationTime" type="datetime" disabled style="width: 100%" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="备注信息" style="width: 100%" class="zbryqrxq-form-item">
                  <el-input v-model="mydetail.formdata.remark" type="textarea" :rows="3" resize="none" disabled />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </template>

      <!-- 值班人员 -->
      <template #modarea2>
        <div class="zbryqrxq-modarea-slot" style="height: 240px">
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
              height: '20px',
              textAlign: 'center'
            }"
          >
            <el-table-column type="index" label="#" align="center" width="40" />
            <!-- <el-table-column prop="taskName" label="值班任务" width="200" /> -->
            <el-table-column prop="unitName" label="单位" align="center" />
            <el-table-column prop="orgRole" label="组织角色" align="center" width="180" />
            <el-table-column prop="posRole" label="人员角色" align="center" width="180" />
            <el-table-column prop="dutyPerson" label="姓名" align="center" width="130" />
            <el-table-column prop="dutyPhone" label="电话" align="center" width="130" />
            <el-table-column prop="posRole" label="值班日期" align="center" width="130" />
            <el-table-column prop="dutyShift" label="班次" align="center" column-key="NSOS_DUTY_SHIFT" :formatter="formatDrop"  width="130" :key/>
          </el-table>
        </div>
      </template>

      <!-- 确认情况 -->
      <template #modarea3>
        <div class="zbryqrxq-modarea-slot">
          <div class="zbryqrxq-modarea-slot">
            <div class="zbryqrxq-modarea-slot" style="height: 200px">
              <el-form label-width="100px" :rules="formRules" :model="mydetail.formdata" :inline="true" label-position="right" label-suffix=":" class="demo-form-inline">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="确认人" style="width: 100%" prop="confirmName">
                      <el-input v-model="mydetail.formdata.confirmName" disabled />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="确认时间" style="width: 100%" prop="confirmTime">
                      <el-date-picker v-model="mydetail.formdata.confirmTime" type="datetime" disabled style="width: 100%" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="确认情况" style="width: 100%" prop="confirmState">
                      <el-select v-model="mydetail.formdata.confirmState" filterable clearable :disabled="mydetail.formdata.status === '2'">
                      <el-option v-for="item in dropList.NSOS_DUTYCONFIRM_STATUS" :key="item.value" :label="item.label" :value="item.value"/>
                    </el-select>
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
import { useDropStore } from '#/store';
import { getDetail, confirmDutyApi } from './dutyConfirmMethod.ts'
import { lookFlow, tDateTimeFormat, copyText, formatDrop } from '#/utils/commonUtil.ts'
import { ElMessage, ElMessageBox } from 'element-plus'

const emit = defineEmits(['refreshList','removeTab'])
const props = defineProps({
  orderCode: String,
  name: String
})

const dropList = reactive({});
const anchors = ref(['基础信息', '值班人员', '确认情况'])
const mydetail = reactive({
  layout: null,
  title: '值班人员确认信息',
  formdata: {},
  tableData: [],
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
  confirmName: [{ required: true, message: '请填写确认人', trigger: 'blur' }],
  confirmTime: [{ required: true, message: '请填写确认时间', trigger: 'blur' }],
  confirmState: [{ required: true, message: '请填写确认情况', trigger: 'blur' }]
})

onMounted(async () => {
  const dropStore = useDropStore();
  const dropType = ['NSOS_DUTYFLOW_STATUS','NSOS_DUTYCONFIRM_STATUS','NSOS_DUTY_SHIFT']
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);

  queryDetail()
})

// 查询详情
const queryDetail = async () => {
  mydetail.layout = detailLayout
  const data = await getDetail({orderCode : props.orderCode})
  mydetail.formdata = data.formData
  mydetail.tableData = data.manList

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

// 确认
const confirmDuty = async () => {
  await confirmDutyApi(mydetail.formdata)
  emit('removeTab',props.name)
  emit('refreshList')
}

</script>
<style scoped>
.primary {
  color: hsl(var(--primary));
}

.zbryqrxq-page {
  font-size: 12px;
}

.zbryqrxq-operate-bar {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

.zbryqrxq-operate-bar-col1 {
  width: 23%;
}

.zbryqrxq-operate-bar-col2 {
  width: 23%;
}

.zbryqrxq-operate-bar-col2 > span {
  color: #8e8e93;
}

.zbryqrxq-operate-bar-col3 {
  width: 23%;
}

.zbryqrxq-operate-bar-col4 {
  flex-grow: 1;
  text-align: right;
  padding-right: 20px;
}

.zbryqrxq-modhead-slot {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: end;
}

.zbryqrxq-modarea-slot {
  width: 100%;
}

.zbryqrxq-form-item :deep(.el-form-item__label) {
  line-height: 73px;
}

.zbryqrxq-form-item2 :deep(.el-form-item__label) {
  line-height: 52px;
}

.zbryqrxq-spxx-headbar {
  width: 100%;
  height: 20px;
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.zbryqrxq-spxx-dot {
  height: 8px;
  width: 8px;
  border-radius: 8px;
  background: #00bfff;
  margin-left: 5px;
  margin-right: 2px;
  margin-top: 2px;
}

.zbryqrxq-spxx-text {
  font-weight: 700;
  color: #666666;
}
</style>
