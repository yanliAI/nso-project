<template>
  <div style="padding: 5px;">
    <el-tabs v-model="editableTabsValue" type="card" class="demo-tabs bg-white" @tab-remove="removeTab">
      <el-tab-pane v-for="item in editableTabs" :key="item.name" :label="item.title" :name="item.name" :closable="item.name !== '1'">
        <div v-if="item.name === '1'" style="padding:0 20px 20px;">
          <el-form :inline="true" :model="queryForm" label-position="right" style="padding: 16px 20px 0">
            <el-form-item label="并网系统名称:">
              <el-input v-model="queryForm.systemName" clearable maxlength="100" />
            </el-form-item>
            <el-form-item label="工单号:">
              <el-input v-model="queryForm.oid" clearable maxlength="100" />
            </el-form-item>
            <el-form-item label="系统编码:">
              <el-input v-model="queryForm.systemCode" clearable maxlength="100" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :icon="Search" @click="query">查询</el-button>
              <el-button type="info" @click="reset">重置</el-button>
            </el-form-item>
          </el-form>
          <el-table border stripe ref="table" :data="tableData" @selection-change="handleSelectionChange" style="width: 100%; height: 680px">
            <el-table-column type="index" align="center" fixed label="#" />
            <el-table-column label="工单号" prop="oid" align="center" width="200">
              <template #default="scope">
                <span style="color: #0000ed; cursor: pointer" @click="addTab(scope.row.oid, scope.row.netPlanOid, 'net')">{{ scope.row.oid }}</span>
              </template>
            </el-table-column>
            <el-table-column label="关联并网计划工单" prop="netPlanOid" align="center" width="200">
              <template #default="scope">
                <span style="color: #0000ed; cursor: pointer" @click="addTab(scope.row.oid, scope.row.netPlanOid, 'plan')">{{ scope.row.netPlanOid }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="systemName" label="并网系统名称" align="center" width="200"> </el-table-column>
            <el-table-column prop="systemCode" label="系统编码" align="center" width="200"> </el-table-column>
            <el-table-column label="部署方式" align="center" width="200">
              <template #default="scope">
                <span>{{ getLabelByValue('systemTypeId', scope.row.systemTypeId) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="系统分级分类" align="center" width="200">
              <template #default="scope">
                <span>{{ getLabelByValue('systemCategory', scope.row.systemCategory) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="投运负责人" prop="managerName" align="center" width="200"> </el-table-column>
            <el-table-column label="投运类型" align="center" width="200">
              <template #default="scope">
                <span>{{ getLabelByValue('operationType', scope.row.operationType) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="并网计划类型字段" align="center" width="200">
              <template #default="scope">
                <span>{{ getLabelByValue('planType', scope.row.planType) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="流程所属单位" prop="flowUnitName" align="center" width="200"> </el-table-column>
            <el-table-column label="当前节点" prop="taskName" align="center" width="200"> </el-table-column>
            <el-table-column label="版本号" prop="systemVersion" align="center" width="200"> </el-table-column>
            <el-table-column label="项目名称" prop="projectName" align="center" width="200"></el-table-column>
            <el-table-column label="项目类型" align="center" width="200">
              <template #default="scope">
                <span>{{ getLabelByValue('projectType', scope.row.projectType) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="形式审查次数" prop="formCheckCount" align="center" width="200"> </el-table-column>
            <el-table-column label="并网确认次数" prop="netConfirmCount" align="center" width="200"> </el-table-column>
            <el-table-column label="专家审查次数" prop="netConfirmCount" align="center" width="200"> </el-table-column>
            <el-table-column label="申请单位" prop="unitName" align="center" width="200"> </el-table-column>
            <el-table-column label="申请人" prop="userName" align="center" width="200"> </el-table-column>
            <el-table-column label="所属单位" prop="belongUnitName" align="center" width="200"> </el-table-column>
            <el-table-column label="业务部门" prop="manageDept" align="center" width="200"> </el-table-column>
            <el-table-column label="并网类型" align="center" width="200">
              <template #default="scope">
                <span>{{ getLabelByValue('categoryId', scope.row.categoryId) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="并网阶段" prop="stage" align="center" width="200"> </el-table-column>
            <el-table-column label="接收材料时间" prop="createTime" align="center" width="200"> </el-table-column>
            <el-table-column label="受理时间" prop="formCheckTime" align="center" width="200"> </el-table-column>
            <el-table-column label="末期提交整改材料时间" prop="lastApplyTime" align="center" width="200"> </el-table-column>
            <el-table-column label="到期时间" prop="checkRequireTime" align="center" width="200"> </el-table-column>
            <el-table-column label="审查完成时间" prop="closeTime" align="center" width="200"> </el-table-column>
            <el-table-column label="形式审查" prop="formCheckOpinion" align="center" width="200"> </el-table-column>
            <el-table-column label="并网确认意见" prop="netConfirmOpinion" align="center" width="200"> </el-table-column>
            <el-table-column label="并网确认时间" prop="netConfirmTime" align="center" width="200"> </el-table-column>
            <el-table-column label="调度专业审核" align="center">
              <el-table-column label="审核用户" prop="groupOne.userName" align="center" width="200"> </el-table-column>
              <el-table-column label="审核状态" align="center" width="200">
                <template #default="scope">
                  <span v-if="scope.row.groupOne?.result === 0">已反馈意见</span>
                  <span v-else-if="scope.row.groupOne?.result === 1">已完成</span>
                  <span v-else-if="scope.row.groupOne?.result === 3">{{ scope.row.groupOne?.checkCount > 1 ? '已整改待审核' : '未审核过' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="处理时限" align="center" width="200">
                <template #default="scope">
                  <span v-if="scope.row.groupOne?.checkStatus === 1">正常</span>
                  <span v-else-if="scope.row.groupOne?.checkStatus !== undefined && scope.row.groupOne?.checkStatus !== null">超时</span>
                </template>
              </el-table-column>
              <el-table-column label="反馈意见" prop="groupOne.record" align="center" width="200"> </el-table-column>
            </el-table-column>
            <el-table-column label="方式专业审核" align="center">
              <el-table-column label="审核用户" prop="groupTwo.userName" align="center" width="200"> </el-table-column>
              <el-table-column label="审核状态" prop="groupTwo.result" align="center" width="200">
                <template #default="scope">
                  <span v-if="scope.row.groupTwo?.result === 0">已反馈意见</span>
                  <span v-else-if="scope.row.groupTwo?.result === 1">已完成</span>
                  <span v-else-if="scope.row.groupTwo?.result === 3">{{ scope.row.groupTwo?.checkCount > 1 ? '已整改待审核' : '未审核过' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="处理时限" prop="groupTwo.checkStatus" align="center" width="200">
                <template #default="scope">
                  <span v-if="scope.row.groupTwo?.checkStatus === 1">正常</span>
                  <span v-else-if="scope.row.groupTwo?.checkStatus !== undefined && scope.row.groupOne?.checkStatus !== null">超时</span>
                </template>
              </el-table-column>
              <el-table-column label="反馈意见" prop="groupTwo.record" align="center" width="200"> </el-table-column>
            </el-table-column>
            <el-table-column label="安全专业审核" align="center">
              <el-table-column label="审核用户" prop="groupThree.userName" align="center" width="200"> </el-table-column>
              <el-table-column label="审核状态" prop="groupThree.result" align="center" width="200">
                <template #default="scope">
                  <span v-if="scope.row.groupThree?.result === 0">已反馈意见</span>
                  <span v-else-if="scope.row.groupThree?.result === 1">已完成</span>
                  <span v-else-if="scope.row.groupThree?.result === 3">{{ scope.row.groupThree?.checkCount > 1 ? '已整改待审核' : '未审核过' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="处理时限" prop="groupThree.checkStatus" align="center" width="200">
                <template #default="scope">
                  <span v-if="scope.row.groupThree?.checkStatus === 1">正常</span>
                  <span v-else-if="scope.row.groupThree?.checkStatus !== undefined && scope.row.groupOne?.checkStatus !== null">超时</span>
                </template>
              </el-table-column>
              <el-table-column label="反馈意见" prop="groupThree.record" align="center" width="200"> </el-table-column>
            </el-table-column>
            <el-table-column label="软件专业审核" align="center">
              <el-table-column label="审核用户" prop="groupFour.userName" align="center" width="200"> </el-table-column>
              <el-table-column label="审核状态" prop="groupFour.result" align="center" width="200">
                <template #default="scope">
                  <span v-if="scope.row.groupFour?.result === 0">已反馈意见</span>
                  <span v-else-if="scope.row.groupFour?.result === 1">已完成</span>
                  <span v-else-if="scope.row.groupFour?.result === 3">{{ scope.row.groupFour?.checkCount > 1 ? '已整改待审核' : '未审核过' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="处理时限" align="center" width="200">
                <template #default="scope">
                  <span v-if="scope.row.groupFour?.checkStatus === 1">正常</span>
                  <span v-else-if="scope.row.groupFour?.checkStatus !== undefined && scope.row.groupOne?.checkStatus !== null">超时</span>
                </template>
              </el-table-column>
              <el-table-column label="反馈意见" prop="groupFour.record" align="center" width="200"> </el-table-column>
            </el-table-column>
            <el-table-column label="硬件专业审核" align="center">
              <el-table-column label="审核用户" prop="groupFive.userName" align="center" width="200"> </el-table-column>
              <el-table-column label="审核状态" prop="groupFive.result" align="center" width="200">
                <template #default="scope">
                  <span v-if="scope.row.groupFive?.result === 0">已反馈意见</span>
                  <span v-else-if="scope.row.groupFive?.result === 1">已完成</span>
                  <span v-else-if="scope.row.groupFive?.result === 3">{{ scope.row.groupFive?.checkCount > 1 ? '已整改待审核' : '未审核过' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="处理时限" align="center" width="200">
                <template #default="scope">
                  <span v-if="scope.row.groupFive?.checkStatus === 1">正常</span>
                  <span v-else-if="scope.row.groupFive?.checkStatus !== undefined && scope.row.groupOne?.checkStatus !== null">超时</span>
                </template>
              </el-table-column>
              <el-table-column label="反馈意见" prop="groupFive.record" align="center" width="200"> </el-table-column>
            </el-table-column>
            <el-table-column label="运服专业审核" align="center">
              <el-table-column label="审核用户" prop="groupSix.userName" align="center" width="200"> </el-table-column>
              <el-table-column label="审核状态" prop="groupSix.result" align="center" width="200">
                <template #default="scope">
                  <span v-if="scope.row.groupSix?.result === 0">已反馈意见</span>
                  <span v-else-if="scope.row.groupSix?.result === 1">已完成</span>
                  <span v-else-if="scope.row.groupSix?.result === 3">{{ scope.row.groupSix?.checkCount > 1 ? '已整改待审核' : '未审核过' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="处理时限" align="center" width="200">
                <template #default="scope">
                  <span v-if="scope.row.groupSix?.checkStatus === 1">正常</span>
                  <span v-else-if="scope.row.groupSix?.checkStatus !== undefined && scope.row.groupOne?.checkStatus !== null">超时</span>
                </template>
              </el-table-column>
              <el-table-column label="反馈意见" prop="groupSix.record" align="center" width="200"> </el-table-column>
            </el-table-column>
            <el-table-column label="运维专业审核" align="center">
              <el-table-column label="审核用户" prop="groupEight.userName" align="center" width="200"> </el-table-column>
              <el-table-column label="审核状态" align="center" width="200">
                <template #default="scope">
                  <span v-if="scope.row.groupEight?.result === 0">已反馈意见</span>
                  <span v-else-if="scope.row.groupEight?.result === 1">已完成</span>
                  <span v-else-if="scope.row.groupEight?.result === 3">{{ scope.row.groupEight?.checkCount > 1 ? '已整改待审核' : '未审核过' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="处理时限" align="center" width="200">
                <template #default="scope">
                  <span v-if="scope.row.groupEight?.checkStatus === 1">正常</span>
                  <span v-else-if="scope.row.groupEight?.checkStatus !== undefined && scope.row.groupOne?.checkStatus !== null">超时</span>
                </template>
              </el-table-column>
              <el-table-column label="反馈意见" prop="groupEight.record" align="center" width="200"> </el-table-column>
            </el-table-column>
            <el-table-column label="并网遗留问题" prop="netQuestion" align="center" width="200"> </el-table-column>
            <el-table-column label="审查进展" align="center" width="200">
              <template #default="scope">
                <span v-if="scope.row.status === 2">未完成</span>
                <span v-if="scope.row.status === 5">已完成</span>
              </template>
            </el-table-column>
            <el-table-column label="系统是否完成审查" align="center" width="200">
              <template #default="scope">
                <span v-if="scope.row.isNetStart === true">是</span>
                <span v-if="scope.row.isNetStart === false">否</span>
              </template>
            </el-table-column>
            <el-table-column label="是否已签订并网协议" prop="netAgreementCount" align="center" width="200">
              <template #default="scope">
                <span v-if="scope.row.netAgreementCount === 1">是</span>
                <span v-if="scope.row.netAgreementCount === 0">否</span>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top: 15px">
            <el-pagination :current-page="currentPage" :page-size="pageSize" :total="total" @size-change="handleSizeChange" @current-change="handlePageChange" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
          </div>
        </div>
        <div v-else style="padding-top: 10px;">
          <pageControl :orderType="item.orderType" :oid="item.name" :pid="item.pid" :type="item.type"></pageControl>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { ElTable, ElTableColumn, ElFormItem, ElForm, ElInput, ElButton, ElSelect, ElOption, ElPagination, ElContainer, ElHeader, ElMain, ElFooter, ElDialog, ElMessage, ElMessageBox, ElText, ElLink, ElTag, ElTooltip } from 'element-plus'
import { Search, Download, Aim, CircleCheck, Setting } from '@element-plus/icons-vue'
import { Page } from '@vben/common-ui'
import { ref, reactive, computed, onMounted } from 'vue'
import { getGridListApi } from '#/api'
import dictMap from './dictMap.js'
import { useRouter } from 'vue-router'
import pageControl from './pageControl.vue'
import { useAccessStore, useUserStore } from '@vben/stores'
const router = useRouter()
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)
const table = ref(null)
const tableData = ref([])
const selectedRows = ref([])
const pid = ref() // 并网计划id
const AllDicts = ref({}) // 获取字典值
const userStore = useUserStore()
const queryForm = reactive({
  systemName: '',
  systemCode: '',
  oid: ''
})
AllDicts.value = getAllDicts()

// tab参数
const editableTabsValue = ref('1')
const editableTabs = ref([
  {
    title: '全部记录',
    name: '1',
    content: 'Tab 1 content'
  }
])

/**
 * 查询并网列表数据
 */

const query = async () => {
  try {
    const oidCondition = [
      {
        key: 'systemName',
        name: '系统名称',
        type: 'like',
        value: queryForm.systemName
      },
      {
        key: 'oid',
        name: '工单号',
        type: 'like',
        value: queryForm.oid
      },
      {
        key: 'systemCode',
        name: '系统编码',
        type: 'like',
        value: queryForm.systemCode
      }
    ]
    let param = {
      data: {
        orderList: [
          {
            key: 'id',
            order: 'desc'
          }
        ],
        pageSize: 10,
        pageNum: 1,
        paramList: oidCondition
      }
    }
    param.data.pageSize = pageSize.value
    param.data.pageNum = currentPage.value
    const res = await getGridListApi(param)
    tableData.value = res.data.data
    total.value = res.data.count
    // total.value = res.count
    // tableData.value = res.data
  } catch {}
}

// 重置
const reset = () => {
  queryForm.systemName = ''
  queryForm.systemCode = ''
  queryForm.oid = ''
  query()
}

//分页
const handleSelectionChange = (val) => {
  selectedRows.value = val
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  query()
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  query()
}

/**
 * 查看工单详情、新增工单详情页
 */

// 新增/跳转详情页
function addTab(targetName: string, planid:string, ordertype:string) {
  const hasTab = editableTabs.value.find((tab) => tab.name === targetName)
  if (hasTab) {
    editableTabsValue.value = targetName
    return
  }

  editableTabs.value.push({
    title: targetName,
    name: targetName,
    orderType: '并网管控',
    pid: planid,
    type: ordertype
  })
  editableTabsValue.value = targetName
}

// 删除tab页
function removeTab(targetName: TabPaneName) {
  const tabs = editableTabs.value
  let activeName = editableTabsValue.value
  if (activeName === targetName) {
    tabs.forEach((tab, index) => {
      if (tab.name === targetName) {
        const nextTab = tabs[index + 1] || tabs[index - 1]
        if (nextTab) {
          activeName = nextTab.name
        }
      }
    })
  }
  editableTabsValue.value = activeName
  editableTabs.value = tabs.filter((tab) => tab.name !== targetName)
}

/**
 * 跳转计划详情页面
 * @param oid  // 工单号/计划工单号
 * @param type  // 1: 工单号(仅查看)，4: 计划工单号(仅查看)
 */
function toOrderDetails(oid, nid, type) {
  if (type === '1') {
    router.push({
      path: '/gridConnectionAnalysis/gridOrderDetails',
      query: { oid: oid, type: type }
    })
  } else {
    router.push({
      path: '/gridConnectionAnalysis/gridOrderDetails',
      query: { nid: nid, oid: oid, type: type }
    })
  }
}

// function getPidVal(val){
//    pid.value = val.pid
//    addTab(val.pid,3)
// }

// function toPlanDetail(val){
//    pid.value = val
// }

onMounted(() => {
  query()
})

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
</script>

<style scoped>
:deep(.el-tabs__header) {
  margin: 0 0 0px !important;
}
.el-main {
  padding-top: 0;
}

.cell {
  text-align: center;
}

.max-lines {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  /* 限制显示行数 */
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
