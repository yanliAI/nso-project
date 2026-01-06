<template>
  <div style="width: 100%; height: 100%" class="bg-white">
    <div>
      <el-card shadow="never" style="margin-bottom: 20px">
        <!-- <template #header>
          <span style="font-weight: 500; font-size: 18px">工单详情</span>
        </template> -->
        <el-form ref="formRef" :inline="true" label-position="right" label-width="200px" :model="data">
          <!-- 基础信息 -->
          <div class="primary flex items-center title-box" style="margin-bottom: 20px">
            <div class="title-icon"></div>
            <div class="ml-1 font-bold">基础信息</div>
          </div>
          <el-row :gutter="80">
            <el-col :span="12">
              <el-form-item label="工单号:" required style="width: 100%">
                <span v-if="data.oid">{{ data.oid }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="lastCheckOrder">
              <el-form-item label="最后审查单号:" required style="width: 100%">
                <span>{{ lastCheckOrder }}</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="80">
            <el-col :span="24">
              <el-form-item label="关联并网计划:" required style="width: 100%">
                <span v-if="data.netPlanOid" style="color: #0000ff; cursor: pointer" @click="toNetPlanDetail(data.netPlanOid)">{{ data.netPlanOid }}</span>
                <span v-else style="color: #a6aebe">未关联</span>
              </el-form-item>
            </el-col>

          </el-row>

          <el-form-item label="标题:" required style="width: 100%">
            <el-input v-model="data.title" :disabled="true" />
          </el-form-item>

          <el-form-item label="项目名称:" required style="width: 100%">
            <el-input v-model="data.projectName" :disabled="true" />
          </el-form-item>

          <el-row :gutter="40">
            <el-col :span="8">
              <el-form-item label="系统名称:" required style="width: 100%">
                <el-input v-model="data.systemName" :disabled="true" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="并网类型:" required style="width: 100%">
                <el-input v-model="categoryType" :disabled="true" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="并网阶段:" style="width: 100%">
                <el-input v-model="data.stage" :disabled="true" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="8">
              <el-form-item label="并网计划类型:" style="width: 100%">
                <el-select v-model="data.planType" :disabled="true" placeholder="">
                  <el-option v-for="item in AllDicts['planType']" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="计划开始时间:" style="width: 100%">
                <el-input v-model="data.startTime" :disabled="true" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="计划结束时间:" style="width: 100%">
                <el-input v-model="data.endTime" :disabled="true" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="8">
              <el-form-item label="完成当前阶段:" style="width: 100%">
                <el-select v-model="data.isCompleteStage" :disabled="true" placeholder="">
                  <el-option v-for="item in AllDicts['isCompleteStage']" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="系统版本号:" style="width: 100%" required>
                <el-input v-model="data.systemVersion" :disabled="true" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="投运类型:" style="width: 100%">
                <el-select v-model="data.operationType" :disabled="true" placeholder="">
                  <el-option v-for="item in AllDicts['operationType']" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="8">
              <el-form-item label="部署方式:" style="width: 100%">
                <el-select v-model="data.systemTypeId" :disabled="true" placeholder="">
                  <el-option v-for="item in AllDicts['systemTypeId']" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="生产环境部署区域:" style="width: 100%">
                <el-select v-model="data.systemAreaId" :disabled="true" placeholder="" multiple>
                  <el-option v-for="item in AllDicts['systemAreaId']" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="系统分类分级:" style="width: 100%">
                <el-select v-model="data.systemCategory" :disabled="true" placeholder="">
                  <el-option v-for="item in AllDicts['systemCategory']" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="8">
              <el-form-item label="并网系统编码:" style="width: 100%" required>
                <el-input v-model="data.systemCode" :disabled="true" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="项目类型:" style="width: 100%" required>
                <el-select v-model="data.projectType" :disabled="true" placeholder="">
                  <el-option v-for="item in AllDicts['projectType']" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="调管单位:" style="width: 100%" required>
                <el-input v-model="data.changeUnitName" :disabled="true" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="8">
              <el-form-item label="是否互联网应用:" style="width: 100%" required>
                <el-select v-model="data.isNetAppId" :disabled="true" placeholder="">
                  <el-option v-for="item in AllDicts['isNetAppId']" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="项目描述:" style="width: 100%" required>
            <el-input v-model="data.remarks" :disabled="true" type="textarea" :rows="4" />
          </el-form-item>
          <el-row :gutter="40">
            <el-col :span="8">
              <el-form-item label="项目经理:" style="width: 100%">
                <el-input v-model="data.managerName" :disabled="true"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系方式:" style="width: 100%">
                <el-input v-model="data.managerPhone" :disabled="true"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="8">
              <el-form-item label="联系人:" style="width: 100%">
                <el-input v-model="data.contactName" :disabled="true"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="座机号码:" style="width: 100%">
                <el-input v-model="data.contactTelephone" :disabled="true"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系方式:" style="width: 100%">
                <el-input v-model="data.contactPhone" :disabled="true"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="关联工单号:" style="width: 100%" required>
            <span style="color: #3184fc; cursor: pointer"></span>
            <span style="color: #a6aebe">未关联</span>
          </el-form-item>
          <el-form-item label="所属单位:" style="width: 100%" required>
            <el-input v-model="data.belongUnitName" :disabled="true"> </el-input>
          </el-form-item>
          <el-form-item label="业务部门:" style="width: 100%" required>
            <el-input v-model="data.manageDept" :disabled="true"> </el-input>
          </el-form-item>
          <el-form-item label="建设部门:" style="width: 100%" required>
            <el-input v-model="data.developDept" :disabled="true"> </el-input>
          </el-form-item>

          <el-form-item label="项目成员:" style="width: 100%" required>
            <el-input :disabled="true" v-model="data.relatedPerson"> </el-input>
          </el-form-item>
          <el-form-item label="申请人:" style="width: 100%" required>
            <el-input :disabled="true" v-model="applicant"> </el-input>
          </el-form-item>
          <el-form-item label="修改附件清单:" style="width: 100%" required>
            <el-input :disabled="true" v-model="data.attachRemarks"> </el-input>
          </el-form-item>
          <div style="padding-left: 100px">
            <el-row>
              <span style="font-weight: 500; margin: 20px">附件:</span>
            </el-row>
            <el-row :gutter="20" style="max-height: 400px; overflow-y: auto">
              <el-col v-for="(file, index) in attachList" :key="file.id" :span="12" style="height: 45px; line-height: 45px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; color: black; font-size: 14px; font-weight: 400">
                <div class="file-name" :title="file.name" style="background-color: #f6f6f8; height: 45px; padding-left: 20px">
                  <el-icon color="grey" style="margin-right: 10px"> <Document /> </el-icon>{{ file.name }}
                </div>
                <div style="width: 100px; background-color: #f6f6f8; height: 45px">
                  {{ formatFileSize(file.size) }}
                  <el-icon color="grey" class="download-icon" @click="downloadAttach(file.name, file.fileId, JSON.stringify(file.iDate), data.oid)">
                    <Download />
                  </el-icon>
                  <el-icon color="grey" v-show="isValidFileExtension(file.name)" class="download-icon" @click="previewAttach(file.size, file.name, file.fileId, JSON.stringify(file.iDate), data.oid)">
                    <View />
                  </el-icon>
                </div>
              </el-col>
            </el-row>
          </div>

          <!-- 并网管控自查 -->
          <div class="primary flex items-center title-box" style="margin: 20px 0">
            <div class="title-icon"></div>
            <div class="ml-1 font-bold">并网管控自查</div>
            <el-button type="primary" size="small" style="margin-left: auto; margin-right: 20px" @click="openReviewDialog()">并网审查</el-button>
          </div>
          <el-form-item style="width: 100%" required>
            <el-table border stripe :data="data.checkItems" max-height="600" style="width: 100%; overflow-x: auto">
              <el-table-column label="序号" type="index" width="60" align="center" />
              <el-table-column label="详情" prop="operationItem" width="100" align="center" type="expand">
                <template #default="props">
                  <div style="display: flex; align-items: center; justify-content: start" v-if="props.row.expertList" v-for="item in props.row.expertList">
                    <!-- 0 不通过 1 通过 -->
                    <p style="width: 400px; text-align: center">审查专业: {{ getLabelByValue('optionGroup', Number(item.optionGroup)) }}</p>
                    <p style="width: 400px; text-align: center">审查人: {{ item.userName }}</p>
                    <p style="width: 400px; text-align: center">
                      审查结果:
                      <el-icon style="vertical-align: -4px; font-size: 16px"><circle-check-filled :color="item.result === 0 ? 'red' : '#17781B'" /></el-icon>
                      {{ item.result === 0 ? '不通过' : '通过' }}
                    </p>
                    <p style="width: 400px; text-align: center">分配时间: {{ item.arriveTime }}</p>
                    <p style="width: 400px; text-align: center">审查时间: {{ item.closeTime }}</p>
                    <p style="width: 400px; text-align: center">审查时限: 正常</p>
                    <p style="width: 400px; text-align: center">审查意见: {{ item.record }}</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="审查项" prop="optionName" align="center" width="200" />
              <el-table-column label="审查点" prop="pointName" width="200" align="center" />
              <el-table-column label="审查要点" prop="checkRequire" width="500" align="center">
                <template #default="scope">
                  <el-tooltip effect="light" :content="scope.row.checkRequire" placement="bottom" popper-class="custom-tooltip">
                    <span class="max-lines">{{ scope.row.checkRequire }}</span>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column label="审查专业" width="200" align="center">
                <template #default="{ row, $index }">
                  <span v-if="taskName !== '形式审查'">{{ taskName }}</span>
                  <span v-else>
                    <el-select v-model="row.optionGroup">
                      <el-option v-for="item in getDictByKey('new_optionGroup')" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="建议审查文档" prop="docName" width="200" align="center" />
              <el-table-column label="对应文档章节" prop="docChapter" width="300" align="center" />
              <el-table-column label="关联附件" prop="docChapter" width="200" align="center">
                <template #default="{ row, $index }">
                  <span v-for="(item, index) in safeParseAttachInfo(row.attachInfoJson)">
                    <p style="color: #3184fc; cursor: pointer" @click="downloadAttach(item.name, item.fileId, JSON.stringify(item.iDate), data.oid)">{{ `${index + 1}. ${item.name}` }}</p>
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="自查结果" width="200" align="center">
                <template #default="{ row, $index }">
                  <span v-if="row.checkOpinion === '1'">
                    <el-icon style="margin-right: 10px; vertical-align: middle; font-size: 18px"><circle-check-filled color="#17781B" /></el-icon>
                    通过
                  </span>
                  <span v-if="row.checkOpinion === '2'">
                    <el-icon style="margin-right: 10px; vertical-align: middle; font-size: 18px"><circle-check-filled color="red" /></el-icon>
                    不通过
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="审查统计" align="center">
                <el-table-column label="通过" width="150" prop="checkPass" align="center"> </el-table-column>
                <el-table-column label="不通过" prop="checkUnPass" width="150" align="center">
                  <template #default="{ row, $index }">
                    <span :style="{ color: row.checkUnPass > 0 ? 'red' : 'inherit' }">{{ row.checkUnPass }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="不涉及" prop="checkUnUse" width="150" align="center"> </el-table-column>
                <el-table-column label="未审查" prop="checkUnCheck" width="150" align="center"> </el-table-column>
              </el-table-column>
              <el-table-column label="专家审查结果" width="200" align="center">
                <template #default="{ row, $index }">
                  <span v-if="row.result === 0">
                    <el-icon style="margin-right: 10px; vertical-align: middle; font-size: 18px"><circle-check-filled color="red" /></el-icon>
                    不通过
                  </span>
                  <span v-else-if="row.result === 1">
                    <el-icon style="margin-right: 10px; vertical-align: middle; font-size: 18px"><circle-check-filled color="#17781B" /></el-icon>
                    通过
                  </span>
                  <span v-else-if="row.result === 2"> 不涉及 </span>
                  <span v-else-if="row.result === 3">
                    <el-icon style="margin-right: 10px; vertical-align: middle; font-size: 18px"><circle-check-filled color="grey" /></el-icon>
                    未审查
                  </span>
                </template>
              </el-table-column>

              <el-table-column label="专家审查意见" width="200" align="center" :fixed="sourceType === '2' ? (hasReviewItem ? 'right' : false) : false">
                <template #default="{ row, $index }">
                  <span v-if="row.expertList && sourceType !== '2'" v-for="item in row.expertList">
                    <p>{{ `${item.userName}:${item.record}` }}</p>
                  </span>
                  <span v-if="row.userId === userStore.userInfo.logincode">
                    <el-input v-model="currentUserRecords[row.id]" @change="handleRecordChange(row, $event)" type="textarea" :rows="4"></el-input>
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="250" align="center" :fixed="sourceType === '2' ? (hasReviewItem ? 'right' : false) : false">
                <template #default="{ row, $index }">
                  <el-radio-group v-model="currentUserResults[row.id]" size="small" v-if="row.userId === userStore.userInfo.logincode" @change="handleResultChange(row, $event)">
                    <el-radio-button label="通过" :value="1" />
                    <el-radio-button label="不通过" :value="0" />
                    <el-radio-button label="不涉及" :value="2" />
                  </el-radio-group>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
      </el-card>
      <!--  -->
      <TaskConfig v-if="taskId && sourceType === '2' && data && data.taskName === '形式审查'" :orderData="data" :taskname="taskName" :taskId="taskId" :oid="data.oid" :tid="tid"></TaskConfig>
    </div>
    <!-- 文件预览 -->
    <el-dialog v-model="previewDialog" title="文件预览" width="70%" top="50px">
      <div style="height: 750px; overflow-y: auto">
        <FilePreview v-if="previewDialog" :fileData="previewFileData" isZipFile="false"></FilePreview>
      </div>
    </el-dialog>

    <!-- ZIP文件预览 -->
    <el-dialog v-model="previewZipDialog" title="文件预览" width="80%" top="50px">
      <PreviewZip v-if="previewZipDialog" :fileData="previewFileData" isZipPreview="true"></PreviewZip>
    </el-dialog>

    <!-- 并网审查 -->
    <el-dialog v-model="reviewDialog" title="并网审查列表" width="80%" top="50px">
      <ReviewFile v-if="reviewDialog" :oidData="data"></ReviewFile>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ElTable, ElAffix, ElTableColumn, ElRow, ElCard, ElCol, ElFormItem, ElForm, ElInput, ElButton, ElSelect, ElOption, ElContainer, ElAside, ElHeader, ElMain, ElFooter, ElDialog, ElMessage, ElMessageBox, ElText, ElLink, ElCollapse, ElCollapseItem, ElTag } from 'element-plus'
import { Search, Download, View, Monitor, Operation, Document, Back, CircleCheck, CircleCheckFilled } from '@element-plus/icons-vue'
import { Page } from '@vben/common-ui'
import { ref, reactive, computed, onMounted, nextTick, watch } from 'vue'
import { calculateDuration } from '#/utils/commonUtil.ts'
import { downloadFile } from '#/utils/download.ts'
import dictMap from './dictMap.js'
import TaskConfig from './taskConfig.vue'
import FilePreview from './filePreview.vue'
import ReviewFile from './reviewFiles.vue'
import ReviewZIP from './reviewzip.vue'
import PreviewZip from './previewZip.vue'
import { getworkPlanTaskDetailApi, getydTodoTasksApi, getLastCheckApi, getworkPlanTaskApi, getGridListDetailApi } from '#/api'
import { useRoute, useRouter } from 'vue-router'
import { useAccessStore, useUserStore } from '@vben/stores'
const emit = defineEmits(['custom-event', 'sendPid'])
const router = useRouter()
const oid = defineModel('oid')
const sourceType = defineModel('sourceType')
const tid = defineModel('tid')
const taskId = ref('')
const taskName = ref('形式审核')
const attachList = ref([]) // 信息两票工单详情信息中的附件
const data = ref({}) // 信息两票工单详情信息
const AllDicts = ref({}) // 获取字典值
const userStore = useUserStore()
const currentUserResults = reactive({}) // 存储每个行的当前用户结果
const currentUserRecords = reactive({}) // 存储每个行的当前用户审批意见
const applicant = ref('') //申请人
const lastCheckOrder = ref('') // 最后审查单号

// 获取中文名称
const categoryType = ref('') // 并网类型
const stageName = ref('') // 并网阶段

const autoHandler = ref({})
AllDicts.value = getAllDicts()

//文件预览
const previewDialog = ref(false)
const previewZipDialog = ref(false)
const previewFileData = ref({
  name: '',
  fileId: '',
  iDate: '',
  oid: '',
  bkUsername: ''
})

// 并网审查
const reviewDialog = ref(false)

// 是否允许审查操作
const hasReviewItem = ref(false)

onMounted(async () => {
  // if(oid.value){
  //   query()
  // }
  query()
  getworkPlanTask()
})

watch(oid, (newVal) => {
  query()
  
})

watch(tid, (newVal) => {
  getworkPlanTask()
})

// 并网工单详情
async function query() {
  try {
    if (!oid.value) return
    const res = await getGridListDetailApi({ data: oid.value })
    data.value = res

    getLastCheck()

    categoryType.value = getLabelByValue('categoryId', data.value?.categoryId)
    data.value.attach = JSON.parse(data.value.attach)
    if (data.value.attach['1']) {
      attachList.value = data.value.attach['1']
    }
    if (data.value.systemAreaId) {
      data.value.systemAreaId = JSON.parse(data.value.systemAreaId)
    }
    hasReviewItem.value = data.value.checkItems.some((checkItem) => checkItem.userId === userStore.userInfo.logincode)
    emit('sendPid', { pid: data.value?.pid, wid: data.value?.netPlanOid })
    applicant.value = `${data.value.deptName}/${data.value.userName}`
  } catch (err) {}
}

// 获取taskId的接口
async function getworkPlanTask() {
  try {
    if (!tid.value) return
    const res = await getworkPlanTaskApi({
      data: {
        id: tid.value
      }
    })
    taskId.value = res.data.data.taskid
    taskName.value = res.data.data.taskname
  } catch (error) {}
}


// 获取最后审查单号
async function getLastCheck() {
  try {
    if (!oid.value) return
    const res = await getLastCheckApi({
      data: {
        netSystemId: JSON.stringify(data.value.systemId),
        oid: oid.value
      }
    })
    if(res.data.data && res.data.data.oid) {
      lastCheckOrder.value =`${res.data.data.oid} (${res.data.data.taskName})`
    }

  } catch (error) {}
}

//跳转到计划详情页面
function toNetPlanDetail(pid) {
  emit('custom-event')
}

// 下载附件
async function downloadAttach(name: string, fileId: string, iDate: string, oid: string) {
  try {
    await downloadFile(import.meta.env.VITE_NSOSFS + `/ydCommon/downloadFile`, { fileId: fileId, idate: iDate, oid: oid, bkUsername: data.value.userId }, name, 'post')
  } catch {}
}

// 附件预览
function previewAttach(size: number, name: string, fileId: string, iDate: string, oid: string) {
  const isAllowSize = isFileSizeExceedLimit(size)
  if (!isAllowSize) {
    ElMessage.warning('不支持文件大于100M的文件审查!')
    return
  }
  previewFileData.value.name = name
  previewFileData.value.fileId = fileId
  previewFileData.value.iDate = iDate
  previewFileData.value.oid = oid
  previewFileData.value.bkUsername = data.value.userId
  const extension = name.split('.').pop().toLowerCase()
  if (extension === 'zip' || extension === '7z') {
    previewZipDialog.value = true
  } else {
    previewDialog.value = true
  }
}

// 并网审查
function openReviewDialog() {
  reviewDialog.value = true
}

// 解析附件路径
function safeParseAttachInfo(jsonString) {
  if (!jsonString) return []

  try {
    const parsed = JSON.parse(jsonString)
    if (!Array.isArray(parsed)) {
      console.warn('附件信息不是数组格式:', jsonString)
      return []
    }
    return parsed
  } catch (e) {
    console.error('解析附件信息失败:', {
      error: e,
      jsonString: jsonString
    })
    return []
  }
}

// 判断是否支持的预览格式
function isValidFileExtension(filename) {
  if (!filename || typeof filename !== 'string') return false

  const validExtensions = ['xls', 'pdf', 'doc', 'docx', 'xlsx', 'txt', 'jpg', 'png', 'jpeg', 'gif', 'svg', 'zip', '7z']
  const extension = filename.split('.').pop().toLowerCase()
  return validExtensions.includes(extension)
}

/**
 * 用户判断当前用户是否有审批权限，动态获取审批意见
 * @param expertList
 * @param loginCode
 */

// 专家列表中是否存在当前用户
const checkUserExists = (expertList, loginCode) => {
  if (!Array.isArray(expertList) || !loginCode) {
    return false
  }
  return expertList.some((expert) => expert.userId === loginCode)
}

// 处理结果变更
const handleResultChange = (row, value) => {
  const loginCode = userStore.userInfo?.logincode
  if (!loginCode) return

  // 找到当前用户的专家记录
  // const currentExpert = row.expertList?.find(expert => expert.userId === loginCode)
  // if (currentExpert) {
  //   // 更新记录
  //   currentExpert.result = value
  //   currentExpert.record = value===0?'不通过': value===1?'通过':'不涉及';
  //   currentUserRecords[row.id]= currentExpert.record
  // }
  row.result = value
  row.record = value === 0 ? '不通过' : value === 1 ? '通过' : '不涉及'
  currentUserRecords[row.id] = row.record
  row.userName = userStore.userInfo?.username
  row.lastCheckResult = [0, 0, 0, 0, '']
  if (!row.expertList) {
    row.checkCount = 1
  }
  row.optionGroupBoolan = true
  row.taskId = taskId.value
  row.taskName = '软件审查'
}

// 处理审批意见变更
const handleRecordChange = (row, value) => {
  row.record = value
  // const loginCode = userStore.userInfo?.logincode
  // if (!loginCode) return

  // // 找到当前用户的专家记录
  // const currentExpert = row.expertList?.find(expert => expert.userId === loginCode)
  // if (currentExpert) {
  //   // 更新记录
  //   currentExpert.record = value
  // }
}

/**
 * 获取所有字典键值对
 * @returns {Object} 以key为键的字典对象
 */
function getAllDicts() {
  return dictMap.reduce((acc, cur) => {
    if (cur.dictMap) {
      acc[cur.key] = cur.dictMap
    }
    return acc
  }, {})
}

/**
 * 根据key获取字典项
 * @param {string} key 字典key
 * @returns {Array} 字典项数组
 */
function getDictByKey(key) {
  const item = dictMap.find((d) => d.key === key)
  return item?.dictMap || []
}

/**
 * 根据key和value获取label
 * @param {string} key 字典key
 * @param {*} value 要查找的值
 * @returns {string} 对应的label
 */
function getLabelByValue(key, value) {
  const dict = getDictByKey(key)
  const item = dict.find((d) => d.value === value)
  return item?.label || ''
}

// 转换附件的大小
function formatFileSize(size) {
  if (size < 1024) return size + ' B'
  if (size < 1024 * 1024) return Math.round(size / 1024) + ' KB'
  return Math.round(size / (1024 * 1024)) + ' MB'
}

// 判断文件大小是否大于100M
function isFileSizeExceedLimit(size) {
  if (typeof size !== 'number' || size <= 0) {
    return false // 无效的size
  }
  return size < 100 * 1024 * 1024 // 100MB = 100 * 1024 * 1024 bytes
}
</script>
<style scoped>
.max-lines {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3; /* 限制显示行数 */
  overflow: hidden;
  text-overflow: ellipsis;
}

.main-card {
  :deep(.el-card__body) {
    padding-top: 0;
  }
}

.pass-circle {
  margin-right: 10px;
  display: inline-block;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: aqua;
  vertical-align: middle;
}

:deep(.el-form-item__label) {
  align-items: center;
  /* 修改为居中 */
  box-sizing: border-box;
  color: var(--el-text-color-regular);
  display: inline-flex;
  flex: 0 0 auto;
  font-size: var(--el-form-label-font-size);
  height: auto;
  /* 改为自动高度以适应多行 */
  justify-content: flex-end;
  line-height: 1.2;
  /* 设置行间距为1 */
  padding: 0 12px 0 0;
  white-space: normal;
  /* 允许换行 */
  word-break: break-word;
  /* 单词换行 */
  min-height: 32px;
  /* 最小高度保持32px */
  text-align: right;
}

.title-box {
  padding: 20px;
  height: 20px;
  width: 100%;
  background-color: #f4f4f5;
}

.title-icon {
  width: 4px;
  background-color: rgb(169, 162, 162);
  height: 20px;
  margin-right: 5px;
}

.file-name {
  flex: 1;
  min-width: 0;
  /* 关键：允许内容收缩 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-name:hover {
  color: var(--el-color-primary);
}

.file-name1 {
  flex: 1;
  min-width: 0;
  /* 关键：允许内容收缩 */
}

.file-list:hover {
  color: var(--el-color-primary);
}

.file-list {
  width: calc(100% - 50px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  /* 确保块级元素特性 */
  background-color: #f6f6f8;
  height: 25px;
  padding: 5px;
  margin-bottom: 5px;
}

.dialog-title {
  width: 150px;
  text-align: right;
  padding-right: 15px;
}

.box1 {
  border: 1px solid #eeeeee;
  height: 40px;
  line-height: 40px;
  font-weight: 500;
  padding: 0 20px;
  background-color: #fafafa;
}

.box2 {
  border: 1px solid #eeeeee;
  padding: 0 20px;
  height: auto;
  background-color: #fafafa;
  display: flex;
  align-items: center;
}

.box3 {
  border: 1px solid #eeeeee;
  padding: 0 20px;
  height: auto;
  height: 40px;
  background-color: #fafafa;
  display: flex;
  align-items: center;
}

.download-icon {
  margin-left: 10px;
  vertical-align: middle;
  color: #606266;
  /* 默认灰色 */
  transition: color 0.3s ease;
  /* 添加过渡效果 */
}

.download-icon:hover {
  color: #409eff;
  /* Element Plus 的蓝色 */
  cursor: pointer;
  /* 鼠标悬停时显示手型指针 */
}
:deep(.el-tag.el-tag--info) {
  --el-tag-bg-color: white;
}
</style>
