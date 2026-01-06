<template>
  <div style="width: 100%">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>{{ configTitle }}</span>
        </div>
      </template>
      <el-form ref="formRef" :inline="true" :rules="formRules" label-position="right" label-width="200px" :model="configData">
        <el-form-item :label="subTitle" required style="width: 100%">
          <el-radio-group v-model="configData.selectedChoice" @change="radioChange">
            <el-radio v-for="choice in currentConfig.choices" :key="choice.key" :label="choice.value" :value="choice.key"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="工作实施:" required style="width: 100%" v-if="configData.selectedChoice === -1">
          <!-- <el-select v-model="userNames" multiple :disabled="true" >
             <el-option v-for="item in configData.userList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select> -->
          <el-input v-model="userNames" disabled></el-input>
        </el-form-item>
        <el-form-item label="处理人:" required style="width: 100%" v-if="configData.selectedChoice === -3" prop="selectedSigner">
          <el-select filterable v-model="configData.selectedSigner" multiple>
            <el-option v-for="item in signerList" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="处理意见/内容:" required style="width: 100%" prop="content">
          <!-- <el-select v-model="configData.content">
            <el-option  v-for="item in responseList" :label=item.content :value=item.content />
          </el-select> -->
          <el-autocomplete v-model="configData.content" :fetch-suggestions="querySearch" :trigger-on-focus="true" clearable class="inline-input w-50" placeholder="请输入" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="primary" @click="submitData()">提交</el-button>
          <el-button type="primary" @click="signFor()">签收</el-button>
          <el-button @click="returnOrder">取消</el-button>
          <!-- <el-button type="primary" @click="checkTaskConfig()">智能审查</el-button> -->
        </el-form-item>
      </el-form>
    </el-card>

    <el-dialog v-model="reviewDialog" title="审查结果" width="1100">
      <div v-loading="loading">
        <el-row style="margin: 15px 0; font-size: 16px">
          <span>信息两票审查结果:</span>
          <span style="margin-left: 10px; color: red" v-if="isPassed">不通过</span>
          <span style="margin-left: 10px; color: #32c622" v-else>通过</span>
        </el-row>
        <el-table border stripe :data="reviewTable" height="400">
          <el-table-column align="center" type="expand" width="60">
            <template #default="scopes">
              <el-table :data="scopes.row.fieldDetails" border>
                <el-table-column type="index" label="序号" align="center" width="60" />
                <el-table-column label="比较字段" prop="fieldName" align="center"></el-table-column>
                <el-table-column label="比较方式" prop="typeName" align="center"></el-table-column>
                <el-table-column label="比较内容" prop="matchValue" align="center"></el-table-column>
                <el-table-column label="实际内容" prop="actualValue" align="center"></el-table-column>
                <el-table-column label="组合序号" prop="mergeCode" align="center"></el-table-column>
                <el-table-column label="比较结论" prop="typeName" width="100" align="center">
                  <template #default="scope">
                    <span style="color: red" v-if="scope.row.hit">命中</span>
                    <span style="color: #32c622" v-else>未命中</span>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column type="index" label="序号" align="center" width="60" />

          <el-table-column prop="ruleName" label="审查规则名称" align="center" width="150"></el-table-column>
          <el-table-column prop="description" label="审查规则描述" align="center"></el-table-column>
          <el-table-column prop="errorReason" label="审查结果" align="center" width="100">
            <template #default="scope">
              <span style="color: red" v-if="scope.row.passed">不通过</span>
              <span style="color: #32c622" v-else>通过</span>
            </template>
          </el-table-column>
        </el-table>
        <el-row style="margin: 15px 0; font-size: 16px">
          <span style="width: 150px; height: 100px; line-height: 100px">信息两票审查结论:</span>
          <span style="width: calc(100% - 150px)"><el-input v-model="reviewResult" type="textarea" :rows="4"></el-input></span>
        </el-row>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="reviewDialog = false">关闭</el-button>
        </div>
      </template>

      <!-- reviewTable -->
    </el-dialog>
  </div>
</template>
<script setup>
import { ElTable, ElTableColumn, ElRow, ElAutocomplete, ElCard, ElCol, ElFormItem, ElForm, ElInput, ElButton, ElSelect, ElOption, ElContainer, ElAside, ElHeader, ElMain, ElFooter, ElDialog, ElMessage, ElMessageBox, ElText, ElLink, ElCollapse, ElCollapseItem, ElTag } from 'element-plus'
import { Search, Download, Monitor, Operation, Document, Back, CircleCheck } from '@element-plus/icons-vue'
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
import { getworkTaskConfigApi, transferTaskApi, getworkTaskNextConfigApi, signForOrderApi, checkTaskConfigApi, getworkTaskUserListApi, submitWorkTaskConfigApi, getCommonRespnseListApi, checkWorkTaskConfigApi } from '#/api'
import { useRouter } from 'vue-router'
import { useAccessStore, useUserStore } from '@vben/stores'
const userStore = useUserStore()
const router = useRouter()
const taskId = defineModel('taskId')
const oid = defineModel('oid')
const tid = defineModel('tid')
const orderData = defineModel('orderData')
const taskName = defineModel('taskname')
const checkUserInfo = ref('')
const userNames = ref('')
const checkTypes = ref({})

const formRef = ref(null)
const configData = reactive({ selectedChoice: '', content: '', userList: [], selectedSigner: '' })

const subTitle = ref('结果:')
const configTitle = ref('')
const currentConfig = ref('')
const nextConfig = ref('')

const responseList = ref([]) // 常用审批回复列表

const reviewDialog = ref(false)
const tableData = ref([])
const reviewTable = ref([]) // 智能审查规则描述

const userList = ref([]) // 工单申请同意用户列表
const nextusers = ref([])

const isPassed = ref(false) // 判断智能审查是否通过
const reviewResult = ref('') // 智能审查结论
const loading = ref(false)
const signerList = ref([]) // 转送给他人，处理人员选择列表
const prefid = ref('')
// userStore.userInfo.logincode = 'liuxi@csg.cn'
// userStore.userInfo.username = '刘溪'
onMounted(() => {
  getTaskConfig()
  queryRespnseData()
  // getSignerUserList()
})

// 获取常用回复数据
async function queryRespnseData() {
  try {
    // queryForm.userid = userStore.userInfo.logincode
    const res = await getCommonRespnseListApi({
      mid: '1',
      userid: userStore.userInfo.logincode
    })
    responseList.value = res
  } catch (error) {
    console.error('查询数据失败:', error)
  }
}

const suggestions = computed(() => {
  return responseList.value.map((item) => ({
    value: item.content, // 直接显示 content
    rawData: item // 保留原始数据
  }))
})

// 搜索建议方法（始终返回所有建议）
const querySearch = (queryString, cb) => {
  cb(suggestions.value) // 忽略 queryString，始终返回全部
}

watch(orderData, (newVal) => {
  if (newVal) {
    console.log('sss11111')
    checkUserInfo.value = extractUserInfo(orderData.value.formCheckOpinion)
    userNames.value = checkUserInfo.value.username
  }
})

watch(taskId, (newVal) => {
  getTaskConfig()
})

//  根据审查规则配置，审查作业详情
async function checkTaskConfig() {
  try {
    if (!oid.value) return
    loading.value = true
    reviewDialog.value = true
    const res = await checkTaskConfigApi({
      data: {
        oid: oid.value
      }
    })
    loading.value = false
    reviewTable.value = res.auditRules
    isPassed.value = res.passed
    reviewResult.value = res.comment
  } catch (error) {
    loading.value = false
  }
}

// 工单签收按钮
async function signFor() {
  try {
    const res = await signForOrderApi({
      data: {
        taskid: taskId.value
      }
    })
    ElMessage.success('签收成功!')
    returnOrder()
  } catch (error) {}
}

// 查询流程处理信息
async function getTaskConfig() {
  try {
    if (!taskId.value) return
      const res = await getworkTaskConfigApi({
        data: {
          taskid: taskId.value
        }
      })
    currentConfig.value = res
    configData.selectedChoice = res.choices[0].key
    configTitle.value = `当前处理信息【${currentConfig.value.name}】`
    subTitle.value = `${currentConfig.value.name}结果`

    await fetchNextConfig()
  } catch (e) {}
}


// 获取下一个流程节点信息
async function fetchNextConfig() {
  try {
    configData.userList = []
    const res = await getworkTaskNextConfigApi({
      data: {
        tid: taskId.value,
        choice: configData.selectedChoice
      }
    })
    nextConfig.value = res
    prefid.value = nextConfig.value[0].prefid
    nextusers.value = nextConfig.value[0].userlist
  } catch (e) {}
}

// 单选框切换
function radioChange(val) {
  fetchNextConfig()
}

const formRules = {
  content: [
    { required: true, message: '请输入处理意见内容', trigger: 'blur' },
    { max: 200, message: '内容不能超过200字', trigger: 'blur' }
  ],
  selectedSigner: [{ required: true, message: '请选择处理人', trigger: 'change' }]
}
const res2 = [
  {
    account: 'zhouhj1@csg.cn',
    baseOrg: 189412,
    baseOrgName: '南方电网数字电网集团有限公司\\运调中心',
    cmnt: '1号楼337',
    dep: 189415,
    depid: '2133-0003',
    depname: '运行方式分部',
    elink: 'zhouhj1@csg.cn',
    email: '154975432@qq.com',
    entrustUser: '',
    extinfo: '{"sms":"1","elk":"1","orgList":[],"entrustUser":"","elink":""}',
    extinfoJson: {
      elk: '1',
      sms: '1',
      entrustUser: '',
      orgList: [],
      elink: ''
    },
    faceId: '0b200ace14d34ee6b07e1c2ff17aa60c',
    fullOrgPath: '南方电网数字电网集团有限公司\\运调中心\\运行方式分部',
    id: 155423,
    menuPermission: ' ',
    mobile: '',
    name: '周红娟',
    notfinish: 18,
    operid: 'zhouhj1@csg.cn',
    org: 189412,
    orgid: '2133',
    orgname: '运调中心',
    password: '',
    phone: '13826285458',
    proworkMean: 1,
    recstatus: 1,
    role: 0,
    rz_uuid: '4e2ea00174f84dfcbc1d3541e75f2633',
    signature: '[{"fileId":"21_zhouhj1_110145_10384228","iDate":20251105,"name":"周红娟（签名）.jpg"},{"fileId":"21_zhouhj1_110300_10385646","iDate":20251105,"name":"周红娟（签名）.jpg"}]',
    state: 1,
    tid: 21,
    unit: 189415,
    unitId: '2133',
    unitname: '南方电网数字电网集团有限公司\\运调中心\\运行方式分部',
    userid: 'zhouhj1@csg.cn',
    userkind: 1,
    username: '专责',
    usertype: 1,
    uuid: 'f27b65dd9c68e6bf7dcb7308bab0ca11'
  }
]
// 获取用户信息(审核提交时调用)
async function getworkTaskUserList() {
  try {
    const param = {
      data: {
        pageNum: 1,
        pageSize: 1,
        paramList: [
          {
            key: 'userid',
            type: 'eq',
            value: checkUserInfo.value.account
          }
        ]
      }
    }
    // const res = await getworkTaskUserListApi(param)
    userList.value = res2
  } catch (error) {}
}

// 获取用户信息(转发给他人时，获取转发人列表) 此处页面加载时调用
async function getSignerUserList() {
  try {
    const param = {
      data: {
        pageSize: 1000,
        pageNum: 1,
        showSwipe: true,
        paramList: [
          {
            key: 'state',
            value: '1',
            type: 'eq'
          },
          {
            key: 'dep',
            value: '189414,189415,900618,189413,189418,189419,189416,189417,189420,189412',
            type: 'in'
          },
          {
            key: 'id',
            value: '-1',
            type: 'gt'
          }
        ]
      }
    }
    const res = await getworkTaskUserListApi(param)
    signerList.value = res.map((item) => ({ value: item.account, label: `${item.name}(${item.account}) ` }))
  } catch (error) {}
}

// 提交流程处理
async function submitData() {
  try {
    const isValid = await formRef.value.validate()
    if (!isValid) {
      ElMessage.warning('请完善信息')
      return
    }
    if (!configData.content.trim()) {
      ElMessage.warning('处理意见内容不能为空或纯空格')
      return
    }
    const hasEmptyResult = orderData.value.checkItems.some((checkItem) => checkItem.userId === userStore.userInfo.logincode && (checkItem.result === 3 || !checkItem.record || checkItem.record === ''))
    if (hasEmptyResult) {
      ElMessage.warning('工单审批意见不允许为空!')
      return
    }
    // 2. 准备提交参数
    // 判断是否是转发给他人
    if (configData.selectedChoice === -3) {
      await transferTaskApi({
        tid: taskId.value,
        content: configData.content,
        nextuser: configData.selectedSigner.join(',')
      })
      ElMessage.success('签收成功')
    } else {

      // 转化字段取值格式
      const checkedItem = (orderData.value.checkItems || [])
        .filter((item) => {
          if (!item) return false
          return item.userId === userStore.userInfo.logincode
        })
        .map((item) => ({
          ...item,
          id: 0,
          style: 3,
          write: true,
          taskName: taskName.value
        }))
      // const checkedItem = orderData.value.checkItems.filter((item) => item.userId === userStore.userInfo.logincode )
      checkTypes.value = transformCheckItems(orderData.value.checkItems)
      const transformedCheckItems = (orderData.value?.checkItems || []).map(item => ({
        ...item,
        optionGroup: item.optionGroup ? [parseInt(item.optionGroup)] : [],
        attachInfo: item.attachInfoJson && item.attachInfoJson.trim() !== '' 
          ? {'1': JSON.parse(item.attachInfoJson) } 
          : {}
      }))

      // 获取用户信息
      await getworkTaskUserList()

      // 构建接口参数
      let param = {
        data: {
          order: '',
          roid: '',
          taskid: taskId.value,
          oid: oid.value,
          tid: taskId.value,
          userName: userStore.userInfo.username,
          taskName: taskName.value,
          content: configData.content,
          choice: configData.selectedChoice,
          result: getChoiceByKey(currentConfig.value.choices, configData.selectedChoice)?.value,
          procuser: '',
          nextuser: '',
          checkTypes: checkTypes.value,
          checkItems: checkedItem,
          checkUsers: {},
          attach: {},
          isRecord: 1,
          experViewList: [4],
          procid: JSON.stringify(orderData.value.pid),
          stageId: orderData.value?.stageId,
          categoryId: orderData.value?.categoryId,
          optionGroup: orderData.value?.optionGroup,
          systemTypeId:orderData.value?.systemTypeId,
          isNetAppId: orderData.value?.isNetAppId,
          systemCategory: orderData.value?.systemCategory,
          systemAreaId: orderData.value?.systemAreaId,
          operationType: orderData?.value?.operationType,
          deptId: orderData.value?.deptId,
          userkind: orderData.value?.userkind,
          action: 'handle',
          isAllPass: orderData.value?.isAllPass,
          isSkip: orderData.value?.isSkip,
          isShow: true,
          procInfo: {
            vars: {}
          },
          checkCount: orderData.value?.checkCount,
          updateCheckItems: transformedCheckItems,
          pid: orderData.value.pid,
          status: 1,
          state: 0,
          gids: '',
          mid: 109,
          type: currentConfig.value.nid,
          prefid: currentConfig.value.prefid,
          nodeStyle: currentConfig.value.nodeStyle,
          subProcs: [],
          procusers: [],
          extinfo: JSON.stringify({
            order: '',
            roid: '',
            oid: oid.value,
            taskid: taskId.value,
            tid: tid.value,
            taskName: taskName.value,
            userName: userStore.userInfo.username,
            content: configData.content,
            choice: configData.selectedChoice,
            result: getChoiceByKey(currentConfig.value.choices, configData.selectedChoice)?.value,
            procuser: [],
            attach: {},
            nextuser: [checkUserInfo.value.account],
            checkTypes: checkTypes.value,
            pid: orderData.value.pid,
            status: 1,
            state: 0,
            gids: '',
            mid: 109,
            type: currentConfig.value.nid,
            prefid: currentConfig.value.prefid,
            nodeStyle: currentConfig.value.nodeStyle,
            nextusers: nextusers.value,
            subProcs: []
          }),
          nextusers: nextusers.value,
          ...(nextusers.value.length > 0 && {
            [`nextuser_${nextusers.value[0].nid}`]: userList.value
          }),
          vars: currentConfig.value?.vars || {} // 安全访问vars
        }
      }
      param.data.vars = convertVarsAuto(param.data.vars)
      const res = await submitWorkTaskConfigApi(param)
      ElMessage.success('提交成功')
    }
    returnOrder()
  } catch (error) {}
}

// 返回工单页面
function returnOrder() {
  router.push({
    path: '/workPlanBalance/myAgent'
  })
}

function getChoiceByKey(choices, key) {
  if (!choices || !key) return null
  const result = choices.filter((item) => item.key === key)
  return result.length > 0 ? result[0] : null
}

function convertVarsAuto(vars) {
  if (!vars || typeof vars !== 'object') {
    return {}
  }

  const result = { ...vars } // 浅拷贝原对象

  Object.keys(result).forEach((key) => {
    const value = result[key]
    if (key === 'objectType') return // 排除
    // 只处理字符串类型的值
    if (typeof value === 'string') {
      // 排除空字符串和纯空格
      if (value.trim() === '') {
        return
      }
      // 尝试转换为数字
      const numValue = Number(value)

      // 检查是否为有效数字（排除NaN、Infinity等）
      if (!isNaN(numValue) && isFinite(numValue)) {
        // 检查转换后的数字与原始字符串是否等价
        // 避免将 "123abc" 这样的字符串转为数字
        if (numValue.toString() === value.trim()) {
          result[key] = numValue
        }
      }
    }
  })

  return result
}

// 转换工单检查项的格式
function transformCheckItems(checkItems) {
  const result = {}

  checkItems.forEach((item) => {
    const key = item.optionId.toString()

    result[key] = {
      optionName: item.optionName,
      pointName: item.pointName,
      checkPass: item.expertList ? JSON.stringify(item.checkPass || 0) : item.checkPass || 0,
      checkUnPass: item.expertList ? JSON.stringify(item.checkUnPass || 0) : item.checkUnPass || 0,
      checkUnUse: item.expertList ? JSON.stringify(item.checkUnUse || 0) : item.checkUnUse || 0,
      checkUnCheck: item.expertList ? JSON.stringify(item.checkUnCheck || 0) : item.checkUnCheck || 0,
      expertList: item.expertList || '',
      checkUserCheck:
        item.expertList && Array.isArray(item.expertList)
          ? item.expertList
              .map((expert) => expert?.userName || '')
              .filter((name) => name.trim())
              .join(',')
          : '',
      optionGroup: item.optionGroup
    }
  })

  return result
}

// 提取所有用户的方法
function extractUserInfo(formCheckOpinion) {
  if (!formCheckOpinion || typeof formCheckOpinion !== 'string') {
    return null
  }

  const pattern = /^([^(]+)\(([^)]+)\)/
  const match = formCheckOpinion.match(pattern)

  if (match && match.length >= 3) {
    const username = match[1].trim()
    const account = match[2].trim()

    if (username && account) {
      return { username, account }
    }
  }

  return null
}
</script>
<style scoped></style>
