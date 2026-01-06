<template>
  <div style="width: 100%">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>{{ configTitle }}</span>
        </div>
      </template>
      <el-form ref="formRef" :inline="true" :rules="formRules" label-position="right" label-width="200px" :model="configData">
        <el-form-item label="处理方式:" required style="width: 100%">
          <el-radio-group v-model="configData.selectedChoice" @change="radioChange">
            <el-radio v-for="choice in currentConfig.choices" :key="choice.key" :label="choice.value" :value="choice.key"></el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-for="(item, index) in handlerUserList" v-if="configData.selectedChoice === -1">
          <div style="color: grey; margin-left: 200px; font-size: 14px; margin-bottom: 5px">{{ item.name }}</div>
          <el-form-item :label="item.utitle" required style="width: 100%">
            <el-select filterable v-model="item.selectUsers" multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="4">
              <el-option v-for="user in userList" :label="user.name" :value="user.userid" />
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="处理意见/内容:" required style="width: 100%" prop="content">
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
import { ref, inject, reactive, computed, onMounted, watch, nextTick } from 'vue'
import { getworkTaskConfigApi, transferTaskApi, getworkTaskNextConfigApi, signForOrderApi, checkTaskConfigApi, getworkTaskUserListApi, submitWorkTaskConfigApi, getCommonRespnseListApi, checkWorkTaskConfigApi } from '#/api'
import { useRouter } from 'vue-router'
import {processDataSafe} from './dataHandlerTools.js'
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

const configTitle = ref('')
const currentConfig = ref('')
const nextConfig = ref('')
const handlerUserList = ref([]) // 形式审查处理人列表

const responseList = ref([]) // 常用审批回复列表

const reviewDialog = ref(false)
const tableData = ref([])
const reviewTable = ref([]) // 智能审查规则描述

const userList = ref([]) // 工单申请同意用户列表

const isPassed = ref(false) // 判断智能审查是否通过
const reviewResult = ref('') // 智能审查结论
const loading = ref(false)
const signerList = ref([]) // 转送给他人，处理人员选择列表
const prefid = ref('')

const submitState = inject('submitState') // 后代组件
const submitAllState = inject('submitAllState')

onMounted(() => {
  getTaskConfig()
  queryRespnseData()
})

watch(orderData, (newVal) => {
  if (newVal && orderData.value.formCheckOpinion) {
    checkUserInfo.value = extractUserInfo(orderData.value.formCheckOpinion)
    userNames.value = checkUserInfo.value.username
  }
})

watch(taskId, (newVal) => {
  getTaskConfig()
})



/**
 * 获取常用回复选项
 */

// 获取常用回复列表
async function queryRespnseData() {
  try {
    // queryForm.userid = userStore.userInfo.logincode
    const res = await getCommonRespnseListApi({
      mid: '2',
      userid: userStore.userInfo.logincode
    })
    responseList.value = res
  } catch (error) {
    console.error('查询数据失败:', error)
  }
}

// 渲染
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



/**
 * 工单签收
 */
async function signFor() {
  try {
    const res = await signForOrderApi({
      data: {
        taskid: taskId.value
      }
    })
    ElMessage.success('签收成功!')
    submitState.value = 'success'
    submitAllState.value = 'success'
    returnOrder()
  } catch (error) {}
}

/**
 * 获取流程处理信息
 */
// 1. 获取当前流程处理信息
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
    await fetchNextConfig()
  } catch (e) {}
}

// 2. 获取下一个流程节点信息
async function fetchNextConfig() {
  try {
    // 1. 获取下一流程处理人账号信息
    configData.userList = []
    const res = await getworkTaskNextConfigApi({
      data: {
        tid: taskId.value,
        choice: configData.selectedChoice,
        vars:{ ...currentConfig.value?.vars, optionGroup:  orderData.value.optionGroup }
      }
    })
    nextConfig.value = res
    if (nextConfig.value && nextConfig.value.length > 0) {
      configTitle.value = `当前处理信息【${currentConfig.value.name}】>>> 下一步处理信息【${nextConfig.value.map((item) => item.nextname).join(',')}】`
    } else {
      configTitle.value = `当前处理信息【${currentConfig.value.name}】`
    }
    handlerUserList.value = nextConfig.value.map((item) => ({
      userlist: item.userlist || [],
      utitle: item.utitle || '处理人',
      name: item.name || '',
      selectUsers: item.users || [],
      nid: item.refid
    }))

    prefid.value = nextConfig.value[0].prefid
    // nextusers.value = nextConfig.value.map((item) => item.userlist)

    // 2. 根据处理人账号获取完整的用户信息(中文名)
    const userParamList =  combineUserIds(nextConfig.value)
    const param = {
        data: {
          paramList: [
            {
              key: 'state',
              type: 'eq',
              value: '1'
            },
            {
              key: 'userid',
              type: 'in',
              value: userParamList
            }
          ]
        }
    }
    const rs = await getworkTaskUserListApi(param)
    userList.value = rs

  } catch (e) {}
}


/**
 * 
 * 填写表单处理
 */
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


// 提交流程处理
async function submitData() {
  try {
    const isValid = await formRef.value.validate()
    if (!isValid) {
      ElMessage.warning('请完善信息')
      return
    }
    // 同意时，处理人必选
    if(configData.selectedChoice === -1){
       const isEmpty = handlerUserList.value.some((item)=>item.selectUsers.length === 0)
       if(isEmpty){
        ElMessage.warning('处理人不得为空!')
        return
       }

    }
    // 2. 准备提交参数
    // 构建接口参数
    let param = buildSubmitParam()
    const res = await submitWorkTaskConfigApi(param)
    ElMessage.success('提交成功')
    submitState.value = 'success'
    submitAllState.value = 'success'
    
  } catch (error) {}
}

// 返回工单页面
function returnOrder() {
  router.push({
    path: '/workPlanBalance/myAgent'
  })
}

/**
 * 工具函数
 * @param choices
 * @param key
 */
// 合并所有待请求的用户组账号
function combineUserIds(data, separator = ',') {
  // 1. 提取所有users数组
  const allUsers = data.flatMap(item => item.users || []);

  // 2. 去重
  const uniqueUsers = [...new Set(allUsers)];

  // 3. 连接成字符串
  const result = uniqueUsers.join(separator);
  return result;
}


// 汇总 optionGroup字段
function summarizeOptionGroups(checkItems) {
    if (!checkItems || !Array.isArray(checkItems) || checkItems.length === 0) {
        return '';
    }
    
    // 使用 Set 去重
    const optionGroups = new Set();
    
    checkItems.forEach(item => {
        if (item.optionGroup && item.optionGroup.trim() !== '') {
            optionGroups.add(item.optionGroup.trim());
        }
    });
    
    // 转换为数组并排序（如果需要的话）
    const sortedGroups = Array.from(optionGroups).sort((a, b) => a.localeCompare(b));
    
    // 用逗号连接
    return sortedGroups.join(',');
}

function getChoiceByKey(choices, key) {
  if (!choices || !key) return null
  const result = choices.filter((item) => item.key === key)
  return result.length > 0 ? result[0] : null
}

// 构建审核提交请求参数
function buildSubmitParam() {
  // 1. 提前计算重复使用的值
  const nextuser_nid = transformNextuser(handlerUserList.value)
  const nextusers = transformUserList(handlerUserList.value)
  const nextuserIds = [...new Set(handlerUserList.value.flatMap(item => item.selectUsers || []))];
  const updateCheckItems =  processDataSafe(orderData.value?.checkItems)
  // 2. 提取公共配置数据
  const commonConfig = {
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
    checkTypes: {},
    checkItems: [],
    checkUsers: {},
    attach: {},
    isRecord: '',
    experViewList: [],
    procid: orderData.value.pid,
    stageId: orderData.value?.stageId,
    categoryId: orderData.value?.categoryId,
    optionGroup: orderData.value?.optionGroup,
    systemTypeId: orderData.value?.systemTypeId,
    isNetAppId: orderData.value?.isNetAppId,
    systemCategory: orderData.value?.systemCategory,
    systemAreaId: orderData.value?.systemAreaId,
    operationType: orderData.value?.operationType, 
    deptId: orderData.value?.deptId,
    userkind: orderData.value?.userkind,
    action: 'handle',
    isAllPass: orderData.value?.isAllPass,
    isSkip: orderData.value?.isSkip,
    isShow: true,
    checkCount: orderData.value?.checkCount,
    updateCheckItems: updateCheckItems,
    pid: orderData.value.pid,
    status: 1,
    state: 0,
    gids: '',
    mid: 109,
    type: currentConfig.value.nid,
    prefid: currentConfig.value.prefid,
    nodeStyle: currentConfig.value.nodeStyle,
    subProcs: [],
    procusers: []
  }
  // 3. 提取 extinfo 配置（避免重复代码）
  const extinfoData = {
    ...commonConfig, // 复用公共配置
    procuser: [], // extinfo 特有的配置
    nextuser: nextuserIds,
    pid: orderData.value.pid,
    status: 1,
    state: 0,
    gids: '',
    mid: 109,
    type: currentConfig.value.nid,
    prefid: currentConfig.value.prefid,
    nodeStyle: currentConfig.value.nodeStyle,
    nextusers: nextusers, // 使用预计算的值
    subProcs: []
  }
  // 4. 构建主参数对象
  let param = {
    data: {
      ...commonConfig,
      procInfo: {
        vars: {}
      },
      extinfo: JSON.stringify(extinfoData),
      nextusers: nextusers, // 避免重复调用 transformUserList
      ...nextuser_nid,
      vars: {
        ...(currentConfig.value?.vars || {}), // 安全访问并展开
        choice: configData.selectedChoice,
        isAllPass: orderData.value?.isAllPass,
        isSkip: orderData.value?.isSkip,
        netAgreementCount: orderData.value?.netAgreementCount,
        sysClassification: orderData.value?.sysClassification,
        optionGroup: orderData.value?.optionGroup,
        mid: 109
      }
    }
  }

  // 5. 转换 vars（如果需要特殊处理）
  param.data.vars = convertVarsAuto(param.data.vars)
  return param
}

// 将数据转成数字格式
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

// 提交参数合并获取nextusers
function transformUserList(data) {
  let result = []
  data.forEach((item) => {
    const key = `nextuser_${item.nid}`;
    const targetUserIds = new Set(item.selectUsers);
    const matchedUsers = userList.value
      .filter(user => targetUserIds.has(user.userid))
      .map(user => ({
        nid: item.nid,
        userid: user.userid,
        type: user.usertype
      }));
    
    result.push(...matchedUsers);
  });
  return result
}

// 获取nextuser_3825963列表
function transformNextuser(data) {
  let result = {}
  data.forEach((item) => {
    const key = `nextuser_${item.nid}`
    const targetUserIds = new Set(item.selectUsers);
    const matchedUsers = userList.value.filter(user => targetUserIds.has(user.userid)); 
    // item.userlist.menuPermission = ''
    // item.userlist.key = item.userlist.key || ''
    // item.userlist.label = item.userlist.name || ''
    // item.userlist.disabled = true
    // item.userlist.type = 1
    result[key] = matchedUsers || []
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
<style scoped>
:deep(.el-tag.el-tag--info) {
  --el-tag-bg-color: #d5d8d96a !important;
  --el-tag-text-color: rgba(0, 0, 0, 0.808) !important;
  /* --el-tag-border-color:#2224246a; */
}
</style>
