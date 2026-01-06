<template>
  <div class="fill-whole-white notify-page">
    <div class="notify-page-header">
      <div class="data-display">
        <span class="data-item">
          <span class="label">业务类型：</span>
          <span class="value blue-text">{{ props.recordType === '1' ? '通知' : '催办' }}</span>
        </span>
        <span class="data-item">
          <span class="label">业务单号：</span>
          <span class="value blue-text">{{ props.busiCode }}</span>
        </span>
        <span class="data-item">
          <span class="label">业务环节：</span>
          <span class="value blue-text">{{ props.tacheName }}</span>
        </span>
      </div>

      <el-form label-width="auto" :model="data.formData" :inline="true" label-position="right" class="demo-form-inline mt-1">
        <el-row>
          <el-col :span="8">
            <el-form-item :label="props.recordType === '1' ? '通知时间:' : '催办时间:'">
              <el-date-picker v-model="data.formData.timeRange" type="datetimerange" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" range-separator="-" start-placeholder="开始" end-placeholder="结束" style="width: 100%" @clear="clearTime"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="联系方式:" filterable>
              <el-input v-model="data.formData.contact" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item :label="props.recordType === '1' ? '通知内容:' : '催办内容:'" filterable>
              <el-input v-model="data.formData.notifyContent" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" class="ml-4" :icon="Search" @click="query">查询</el-button>
            <el-button v-if="props.addable" type="primary" class="ml-4" :icon="Plus" @click="addRec">新增</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="notify-page-main">
      <el-table show-overflow-tooltip border size="small" :data="data.tableData" height="100%" style="width: 100%">
        <el-table-column type="index" fixed label="#" width="45" align="center"></el-table-column>
        <el-table-column prop="busiCode" label="业务单号" width="180" align="center"></el-table-column>
        <el-table-column prop="recordType" label="业务类型" width="65" align="center" column-key="NSOS_RECORD_TYPE" :formatter="formatDrop"></el-table-column>
        <el-table-column prop="module" :label="props.recordType === '1' ? '通知模块' : '催办模块'" width="100" align="center" column-key="NSOS_NOTIFY_MODULE" :formatter="formatDrop"></el-table-column>
        <el-table-column prop="tacheName" :label="props.recordType === '1' ? '通知环节' : '催办环节'" width="100" align="center"></el-table-column>
        <el-table-column prop="notifyType" :label="props.recordType === '1' ? '通知方式' : '催办方式'" width="65" align="center" column-key="NSOS_NOTIFY_TYPE" :formatter="formatDrop"></el-table-column>
        <el-table-column prop="notifyTime" :label="props.recordType === '1' ? '通知时间' : '催办时间'" :formatter="tDateTimeFormat" width="130" align="center"></el-table-column>
        <el-table-column prop="notifyTarget" label="接收人" width="80" align="center" column-key="NSOS_USER_NAME" :formatter="formatDrop"></el-table-column>
        <el-table-column prop="contact" label="联系方式" width="100" align="center"></el-table-column>
        <el-table-column prop="notifyContent" :label="props.recordType === '1' ? '通知内容' : '催办内容'" header-align="center"></el-table-column>
        <!-- <el-table-column prop="feedbackMan" label="反馈人" width="80" align="center"></el-table-column>
        <el-table-column prop="feedbackTime" label="反馈时间" :formatter="tDateTimeFormat" width="130" align="center"></el-table-column>
        <el-table-column prop="feedbackContent" label="反馈内容" width="160" header-align="center"></el-table-column> -->
        <el-table-column prop="creatorId" label="创建人" column-key="NSOS_USER_NAME" :formatter="formatDrop" align="center" width="80" />
        <el-table-column prop="createTime" label="创建时间" :formatter="tDateTimeFormat" align="center" width="130" />
      </el-table>
    </div>
    <div class="notify-page-footer">
      <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" class="mt-1" :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="currentChange"></el-pagination>
    </div>

    <Modal class="w-[800px] h-[300px] top-[260px]" :title="props.recordType === '1' ? '通知详情' : '催办详情'" :footer="false" :closeOnClickModal="false" :draggable="true">
      <TemplateDiaLog :data="data.notifyData" @close="modalApi.close()" @query="query" />
    </Modal>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref, nextTick } from 'vue'
import { ElIcon, ElRow, ElCol, ElTable, ElTableColumn, ElFormItem, ElForm, ElInput, ElButton, ElSelect, ElPagination, ElMessage } from 'element-plus'
import { useDropStore } from '#/store'
import { requestClient } from '#/api/request'
import AttachFile from '../../basic/attach/attachFile.vue'
import AttachList from '../../basic/attach/attachList.vue'
import { Search, Delete, Plus, Download, Upload } from '@element-plus/icons-vue'
import { useVbenModal } from '@vben/common-ui'
import { tDateFormat, tDateTimeFormat, formatDrop, lookFlow } from '#/utils/commonUtil.ts'
import { useAccessStore, useUserStore } from '@vben/stores'
import { queryData2 } from './cmdMgtMethod.ts'
import TemplateDiaLog from './TemplateDiaLog.vue'

// 组件参数
const props = defineProps({
  // 业务类型: 1通知，2催办
  recordType: {
    type: String,
    required: true
  },
  // 模块: 1运调工作台，2指令管理，3故障管理
  module: {
    type: String,
    required: true
  },
  // 业务子模块: 运调工作台（1故障，2漏洞，3指令，4 作业，5重保） 故障管理（1故障处置，2故障复盘）
  subModule: {
    type: String,
    required: true
  },
  // 业务单号，如指令编号、故障单号等
  busiCode: {
    type: String,
    required: true
  },
  // 业务环节编号
  tacheCode: {
    type: String,
    required: true
  },
  // 业务环节名称
  tacheName: {
    type: String,
    required: true
  },
  // 通知对象
  notifyTarget: {
    type: String,
    required: true
  },
  // 联系方式
  contact: {
    type: String,
    default: ''
  },
  // 通知内容
  content: {
    type: String,
    default: ''
  },
  // 是否可新增
  addable: {
    type: Boolean,
    default: true
  },
  // 是否默认打开新增弹窗
  openAdd: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['close'])

const data = reactive({
  tableData: [],
  formData: {},
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0
  },
  notifyData: {}
})
const userStore = useUserStore()
const dropList = reactive({})
onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = ['NSOS_REPORT_TYPE', 'NSOS_RECORD_TYPE', 'NSOS_NOTIFY_TYPE', 'NSOS_NOTIFY_RESULT', 'NSOS_USER_NAME', 'NSOS_NOTIFY_MODULE']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)
  query()
  await nextTick()
  if (props.openAdd) {
    addRec()
  }
})

// 查询
const query = async () => {
  data.formData.pageSize = data.pageInfo.pageSize
  data.formData.pageNo = data.pageInfo.pageNo

  if (data.formData.timeRange) {
    data.formData.startTime = data.formData.timeRange[0]
    data.formData.endTime = data.formData.timeRange[1]
  } else {
    data.formData.startTime = null
    data.formData.endTime = null
  }

  data.formData.recordType = props.recordType
  data.formData.module = props.module
  data.formData.subModule = props.subModule
  data.formData.busiCode = props.busiCode
  data.formData.tacheCode = props.tacheCode
  data.formData.notifyTarget = props.notifyTarget

  const { list, count, pageNo } = await queryData2(data.formData)
  data.tableData = list
  data.pageInfo.pageNo = pageNo
  data.pageInfo.total = count
}

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close()
  }
})
const addRec = () => {
  data.notifyData = {
    recordType: props.recordType,
    module: props.module,
    busiCode: props.busiCode,
    tacheCode: props.tacheCode,
    tacheName: props.tacheName,
    subModule: props.subModule,
    notifyTarget: props.notifyTarget,
    contact: props.contact,
    notifyContent: props.content,
    notifyType: '1'
  }
  modalApi.open()
}

const handleSizeChange = (val) => {
  data.pageInfo.pageSize = val
  query()
}
const currentChange = (val) => {
  data.pageInfo.pageNo = val
  query()
}
</script>
<style scoped>
.notify-page {
  overflow: hidden;
}

.notify-page-header {
  width: 100%;
  height: 80px;
  overflow: hidden;
}

.notify-page-main {
  width: 100%;
  height: calc(100% - 130px);
}

.notify-page-footer {
  width: 100%;
  height: 50px;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.data-item {
  font-size: 14px;
  display: flex;
  align-items: center;
  margin-right: 80px; /* 调整间隔 */
}

.data-item:last-child {
  margin-right: 0; /* 最后一个项不需要右边距 */
}

.blue-text {
  font-size: 12px;
  color: #409eff; /* 蓝色字体 */
}

.data-display {
  display: flex;
  align-items: center;
  margin: 5px 0 15px 0;
}
</style>
