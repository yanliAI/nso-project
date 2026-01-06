<template>
  <div style="width: 100%; height: 100%" class="bg-white">
    <div>
      <el-card shadow="never" style="margin-bottom: 20px">
        <!-- <template #header>
          <span style="font-weight: 500; font-size: 18px">并网计划工单详情</span>
        </template> -->
        <el-form ref="formRef" :inline="true" label-position="right" label-width="200px" :model="data">
          <!-- 基础信息 -->
          <div class="primary flex items-center title-box" style="margin-bottom: 20px">
            <div class="title-icon"></div>
            <div class="ml-1 font-bold">基础信息</div>
          </div>

          <el-form-item label="工单号:" style="width: 100%">
            <el-input v-model="data.oid" :disabled="true" />
          </el-form-item>
          <el-form-item label="工单标题:" required style="width: 100%">
            <el-input v-model="data.title" :disabled="true" />
          </el-form-item>
          <el-row :gutter="40">
            <el-col :span="8">
              <el-form-item label="并网计划类型:" style="width: 100%">
                <el-select v-model="data.planType" :disabled="true" placeholder="">
                  <el-option v-for="item in AllDicts['planType']" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="项目名称:" required style="width: 100%">
                <el-input v-model="data.projectName" :disabled="true" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="并网类型:" required style="width: 100%">
                <el-input v-model="categoryType" :disabled="true" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="8">
              <el-form-item label="项目类型:" style="width: 100%">
                <el-select v-model="data.projectType" :disabled="true" placeholder="">
                  <el-option v-for="item in AllDicts['projectType']" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="投运类型:" required style="width: 100%">
                <el-select v-model="data.operationType" :disabled="true" placeholder="">
                  <el-option v-for="item in AllDicts['operationType']" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="系统名称:" required style="width: 100%">
                <el-input v-model="data.systemName" :disabled="true" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="40">
            <el-col :span="8">
              <el-form-item label="业务部门:" style="width: 100%" required>
                <el-input v-model="data.manageDept" :disabled="true"> </el-input>
              </el-form-item>
            </el-col>
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
          </el-row>

          <el-row :gutter="40">
            <el-col :span="8">
              <el-form-item label="系统分类分级:" style="width: 100%">
                <el-select v-model="data.systemCategory" :disabled="true" placeholder="">
                  <el-option v-for="item in AllDicts['systemCategory']" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否互联网应用:" style="width: 100%" required>
                <el-select v-model="data.isNetAppId" :disabled="true" placeholder="">
                  <el-option v-for="item in AllDicts['isNetAppId']" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="系统上一版本号:" style="width: 100%" required>
                <el-input v-mode="data.systemPreVersion" :disabled="true"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="40">
            <el-col :span="8">
              <el-form-item label="当前版本号:" style="width: 100%" required>
                <el-input v-model="data.systemVersion" :disabled="true" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="建设部门:" style="width: 100%" required>
                <el-input v-model="data.developDept" :disabled="true"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="项目负责人:" style="width: 100%">
                <el-input v-model="data.managerName" :disabled="true"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="40">
            <el-col :span="8">
              <<el-form-item label="调管单位:" style="width: 100%" required>
                <el-input v-model="data.changeUnitName" :disabled="true" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="项目描述:" style="width: 100%" required>
            <el-input v-model="data.remarks" :disabled="true" type="textarea" :rows="4" />
          </el-form-item>
          <span style="font-size: 14px; margin-left: 80px; color: red; height: 30px; line-height: 30px">如果属于月度并网计划,请在每月25日前提交下个月的并网计划;如果属于临时并网计划, 则并网计划流程上需要经过数字化管理部门专向审批</span>
          <el-row :gutter="40">
            <el-col :span="8">
              <el-form-item label="计划开始试运行日:" style="width: 100%">
                <el-input v-model="data.runDate" :disabled="true" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="计划正式上线时间:" style="width: 100%">
                <el-input v-model="data.onlineDate" :disabled="true" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="计划时间:" style="width: 100%" required>
            <el-table border stripe :data="data.netPlanSubs" style="width: 100%; overflow-x: auto; max-height: 600px; overflow-y: auto">
              <el-table-column label="序号" type="index" width="60" align="center" />
              <el-table-column label="并网阶段" align="center">
                <template #default="{ row, $index }">
                  <span>{{ getLabelByValue('stageId', Number(row.status)) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="计划开始时间" prop="startTime" align="center" />
              <el-table-column label="计划结束时间" prop="endTime" align="center" />

              <el-table-column label="操作" width="200" align="center">
                <template #default="{ row, $index }">
                  <el-button type="primary" size="small" @click="viewDeatils(row)">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>

          <div style="padding-left: 100px">
            <el-row>
              <span style="font-weight: 500; margin: 20px">附件:</span>
            </el-row>
            <el-row :gutter="20">
              <el-col v-for="(file, index) in attachList" :key="file.id" :span="12" style="height: 45px; line-height: 45px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; color: black; font-size: 14px; font-weight: 400">
                <div class="file-name" :title="file.name" style="background-color: #f6f6f8; height: 45px; padding-left: 20px">
                  <el-icon color="grey" style="margin-right: 10px"> <Document /> </el-icon>{{ file.name }}
                </div>
                <div style="width: 100px; background-color: #f6f6f8; height: 45px">
                  {{ formatFileSize(file.size) }}
                  <el-icon color="grey" class="download-icon" @click="downloadAttach(file.name, file.fileId, JSON.stringify(file.iDate), data.oid)">
                    <Download />
                  </el-icon>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </el-card>
      <el-dialog v-model="viewDeatilsVisible" title="查看详情" width="30%">
        <el-form ref="formRef" :inline="true" label-position="right" label-width="150px" :model="detailData">
          <el-form-item label="并网阶段:" style="width: 100%" required>
            <el-select v-model="detailData.status" :disabled="true" placeholder="">
              <el-option v-for="item in AllDicts['stageId']" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="计划开始时间:" style="width: 100%" required>
            <el-date-picker v-model="detailData.startTime" type="date" placeholder="选择日期" style="width: 100%" disabled />
          </el-form-item>
          <el-form-item label="计划结束时间:" style="width: 100%" required>
            <el-date-picker v-model="detailData.endTime" type="date" placeholder="选择日期" style="width: 100%" disabled />
          </el-form-item>
        </el-form>

        <template #footer>
          <el-button @click="viewDeatilsVisible = false">关闭</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ElTable, ElAffix, ElTableColumn, ElRow, ElCard, ElCol, ElFormItem, ElForm, ElInput, ElButton, ElSelect, ElOption, ElContainer, ElAside, ElHeader, ElMain, ElFooter, ElDialog, ElMessage, ElMessageBox, ElText, ElLink, ElCollapse, ElCollapseItem, ElTag } from 'element-plus'
import { Search, Download, Monitor, Operation, Document, Back, CircleCheck, CircleCheckFilled } from '@element-plus/icons-vue'
import { Page } from '@vben/common-ui'
import { ref, reactive, computed, onMounted, nextTick, watch } from 'vue'
import { calculateDuration } from '#/utils/commonUtil.ts'
import { downloadFile } from '#/utils/download.ts'
import dictMap from './dictMap.js'
import {  getGridPlanDetailApi } from '#/api'
import { useRoute, useRouter } from 'vue-router'
const emit = defineEmits(['custom-event', 'sendPid'])
const router = useRouter()
const oid = defineModel('nid')
const attachList = ref([]) // 信息两票工单详情信息中的附件
const data = ref({}) // 信息两票工单详情信息
const AllDicts = ref({}) // 获取字典值

const viewDeatilsVisible = ref(false) // 计划时间详情
const detailData = ref([]) // 计划时间详情数据

// 获取中文名称
const categoryType = ref('') // 并网类型

AllDicts.value = getAllDicts()

onMounted(() => {
  query()
})

watch(oid, (newVal) => {
  query()
})

// 查询信息两票详情
async function query() {
  try {
    console.log('oid=',oid)
    if(!oid.value) return
    const res = await getGridPlanDetailApi({ data: oid.value })
    data.value = res

    categoryType.value = getLabelByValue('categoryId', data.value?.categoryId)
    data.value.attach = JSON.parse(data.value.attach)
    if (data.value.attach['1']) {
      attachList.value = data.value.attach['1']
    }
    if (data.value.systemAreaId) {
      data.value.systemAreaId = JSON.parse(data.value.systemAreaId)
    }
  } catch (err) {}
}

// 查看计划时间详情
function viewDeatils(row) {
  viewDeatilsVisible.value = true
  detailData.value = row
}

// //跳转到计划详情页面
// function toNetPlanDetail(pid) {
//   emit('sendPid', { pid: pid })
// }

// 下载附件
async function downloadAttach(name: string, fileId: string, iDate: string, oid: string) {
  try {
    await downloadFile(import.meta.env.VITE_NSOSFS + `/ydCommon/downloadFile`, { fileId: fileId, idate: iDate, oid: oid, bkUsername:data.value.bkUsername }, name, 'post')
  } catch {}
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

/**
 * input 输入动态标签
 */
</script>
<style scoped>
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
