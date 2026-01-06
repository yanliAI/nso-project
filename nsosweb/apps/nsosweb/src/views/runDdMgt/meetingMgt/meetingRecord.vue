<template>
  <div class="fill-whole-white notify-page">
    <div class="notify-page-header">
      <el-form label-width="auto" :model="data.formData" :inline="true" label-position="right" class="demo-form-inline mt-1">
        <el-row>
          <el-col :span="6">
            <el-form-item label="群名称:" filterable>
              <el-input v-model="data.formData.groupName" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="群状态:" filterable>
              <el-select v-model="data.formData.state" collapse-tags collapse-tags-tooltip :max-collapse-tags="1" clearable filterable class="ml-0" style="width: 200px">
                <el-option v-for="item in groupState" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建时间:">
              <el-date-picker v-model="data.formData.timeRange" type="datetimerange" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" range-separator="-" start-placeholder="开始" end-placeholder="结束" style="width: 100%" @clear="clearTime"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" class="ml-4" :icon="Search" @click="query">查询</el-button>
            <!-- <el-button v-if="props.addable" type="primary" class="ml-4" :icon="Plus" @click="addRec">新增</el-button> -->
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="notify-page-main">
      <el-table show-overflow-tooltip fit border size="small" :data="data.tableData" height="100%" style="width: 100%">
        <el-table-column type="index" fixed label="#" width="45" align="center"></el-table-column>
        <el-table-column prop="groupName" label="群名称" align="left"></el-table-column>
        <!-- <el-table-column prop="conferenceNumber" label="会议号"  width="180" align="center"></el-table-column> -->
        <el-table-column prop="groupMain" label="群主"  align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" :formatter="tDateTimeFormat" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
          <template #default="scope">
            <span v-if="scope.row.state == '1'">{{ '正常' }}</span>
            <span v-if="scope.row.state == '0'" >{{ '已解散' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="userCount" label="群成员数" align="center"></el-table-column>
        <el-table-column prop="faultCode" label="关联故障单" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template #default="scope">
            <!-- <el-button link type="primary" size="small" @click="edit(scope.row)">详情</el-button> -->
            <el-button link type="danger" size="small" @click="batchDeleteOne(scope.row)" :disabled="scope.row.state == '0'">解散</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="notify-page-footer">
      <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" class="mt-1" :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="currentChange"></el-pagination>
    </div>

    <!-- <Modal class="w-[800px] h-[300px] top-[260px]" :title="props.recordType === '1' ? '通知详情' : '催办详情'" :footer="false" :closeOnClickModal="false" :draggable="true">
      <TemplateDiaLog :data="data.notifyData" @close="modalApi.close()" @query="query" />
    </Modal> -->
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
import { queryData2 } from './meetingMgt.ts'

// 组件参数
const props = defineProps({

  // 业务单号，如指令编号、故障单号等
  busiCode: {
    type: String,
    required: true
  },
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
const groupState = reactive(
  [
    {
      "value": "1",
      "label": "正常",
      "filter": null,
    },
    {
      "value": "0",
      "label": "已解散",
      "filter": null,
    },
  ]
)
const userStore = useUserStore()
const dropList = reactive({})
onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = ['NSOS_REPORT_TYPE', 'NSOS_RECORD_TYPE', 'NSOS_NOTIFY_TYPE', 'NSOS_NOTIFY_RESULT', 'NSOS_USER_NAME', 'NSOS_NOTIFY_MODULE','NSOS_SYSTEM_INFO']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)
  query()
  await nextTick()
})

// 查询
const query = async () => {
  data.formData.pageSize = data.pageInfo.pageSize
  data.formData.pageNo = data.pageInfo.pageNo

  if (data.formData.timeRange) {
    data.formData.startCreateTime = data.formData.timeRange[0]
    data.formData.endCreateTime = data.formData.timeRange[1]
  } else {
    data.formData.startCreateTime = null
    data.formData.endCreateTime = null
  }

  data.formData.faultCode = props.busiCode

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

const handleSizeChange = (val) => {
  data.pageInfo.pageSize = val
  query()
}
const currentChange = (val) => {
  data.pageInfo.pageNo = val
  query()
}

const batchDeleteOne = async (row) => {
  try {
    console.log(row)
    await requestClient.post(import.meta.env.VITE_NSOSGZ + '/faultElinkGroup/disband', row)
    query()
    ElMessage.success('解散成功！')
  } catch (error) {
    console.error('解散失败:', error)
    query()
    ElMessage.error('解散失败！')
  }
}
</script>
<style scoped>
.notify-page {
  overflow: hidden;
}

.notify-page-header {
  width: 100%;
  height: 60px;
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

/* 状态标签基础样式 - 增加了边框宽度 */
.status-tag {
  display: inline-block;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  border-width: 2px; /* 加粗边框，默认通常是1px */
  border-style: solid; /* 确保边框样式为实线 */
}

/* 正常状态样式 - 绿色系 */
.status-normal {
  background-color: #f0f9eb;
  color: #52c41a;
  border-color: #52c41a; /* 使用与文字相同的颜色作为边框色 */
  padding: 3px 16px;
}

/* 已解散状态样式 - 灰色系 */
.status-dissolved {
  background-color: #f5f5f5;
  color: #8c8c8c;
  border-color: #8c8c8c; /* 使用与文字相同的颜色作为边框色 */
  padding: 3px 10px;
}
</style>

