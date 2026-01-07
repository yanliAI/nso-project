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
          <el-input v-model="userNames" :disabled="true" />
        </el-form-item>
        <el-form-item label="处理人:" required style="width: 100%" v-if="configData.selectedChoice === -3" prop="selectedSigner">
          <el-row style="width: 100%">
            <el-select filterable v-model="configData.selectedSigner" multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="4" style="width: calc(100% - 80px)" class="handler">
              <el-option v-for="item in signerList" :label="item.label" :value="item.value"> </el-option>
            </el-select>
            <el-button class="btn" type="primary" @click="getGroupList">用户组</el-button>
          </el-row>
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
          <el-button type="primary" @click="checkTaskConfig()">智能审查</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-dialog v-model="handlerGroupDialog" title="选择用户组" width="700px">
      <div>
        <el-card shadow="never" class="card-item">
          <template #header>
            <div class="card-header">
              <span>用户组</span>
            </div>
          </template>
          <el-row>
            <el-col :span="12" style="border-right: 1px solid #e4e4e7">
              <div style="margin: 20px; height: 400px; overflow: auto">
                <el-radio-group v-model="selectedGroupId" @change="getGroupUsers">
                  <div v-for="item in handerGroupList" :key="item.id" class="radio-item">
                    <el-radio :label="item.id">
                      {{ item.name }}
                    </el-radio>
                  </div>
                </el-radio-group>
              </div>
            </el-col>
            <el-col :span="12">
              <div style="margin: 20px; height: 400px; overflow: auto">
                <div v-for="item in handlerList" v-if="handlerList && handlerList.length>0">
                  <div style="color: black; height: 40px; line-height: 40px; border-bottom: 1px solid #e4e4e7">{{ item.label }}</div>
                </div>
                <div v-else>
                  <el-empty description="用户组未添加用户" />
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handlerGroupDialog = false">取消</el-button>
          <el-button type="primary" @click="selectGroup">确认</el-button>
        </div>
      </template>
    </el-dialog>

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
import { ref, inject,reactive, computed, onMounted, watch, nextTick } from 'vue'
import { getworkTaskConfigApi, getHandlerGroupApi, getHandlersByGroupIdApi, transferTaskApi, getworkTaskNextConfigApi, signForOrderApi, checkTaskConfigApi, getworkTaskUserListApi, submitWorkTaskConfigApi, getCommonRespnseListApi, checkWorkTaskConfigApi } from '#/api'
import { useRouter } from 'vue-router'
import { useAccessStore, useUserStore } from '@vben/stores'
const userStore = useUserStore()
const router = useRouter()
const taskId = defineModel('taskId')
const oid = defineModel('oid')
const tid = defineModel('tid')
const pid = defineModel('pid')
const taskName = defineModel('taskName')
const autoHandler = defineModel('autoHandler')
const signerUserId = defineModel('signerUserId')
const signerUser = defineModel('signerUser')

const formRef = ref(null)
const configData = reactive({ selectedChoice: '', content: '', userList: [], selectedSigner: '' })

const subTitle = ref('结果:')
const configTitle = ref('')
const currentConfig = ref('')
const nextConfigTitle = ref('')
const userNames = ref('')
const responseList = ref([]) // 常用审批回复列表

const reviewDialog = ref(false)
const tableData = ref([])
const reviewTable = ref([]) // 智能审查规则描述

const userList = ref([]) // 工单申请同意用户列表

const isPassed = ref(false) // 判断智能审查是否通过
const reviewResult = ref('') // 智能审查结论
const loading = ref(false)
const signerList = ref([]) // 转送给他人，处理人员选择列表

// 用户组弹窗
const handlerGroupDialog = ref(false)
const handerGroupList = ref([]) // 处理人组列表
const handlerList = ref([]) // 处理人列表
const selectedGroupId = ref('') // 选中的用户组

const submitState = inject('submitState') // 后代组件
const submitAllState = inject('submitAllState')

onMounted(async () => {
  getTaskConfig()
  queryRespnseData()
  getSignerUserList()
})

// 查询数据
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

watch(
  signerUser,
  (newVal) => {
    if (newVal) {
      userNames.value = newVal
    }
  },
  { immediate: true }
)

watch(taskId, (newVal) => {
  getTaskConfig()
})

// watch(oid, (newVal) => {
//   checkTaskConfig()
// })

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
    configData.content = res.comment
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
    submitState.value = 'success'
    submitAllState.value = 'success'
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
    fetchNextConfig()
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
    nextConfigTitle.value = res
    if (nextConfigTitle.value[0].nextname) {
      configTitle.value = `当前处理信息【${currentConfig.value.name}】>>> 下一步处理信息【${nextConfigTitle.value[0].nextname}】`
    } else {
      configTitle.value = `当前处理信息【${currentConfig.value.name}】`
    }
    // 赋值工程实施
    if (nextConfigTitle.value[0].userlist.length > 0) {
      configData.userList = nextConfigTitle.value[0].userlist
    } else if (nextConfigTitle.value.taskusers[0].length > 0) {
      configData.userList = nextConfigTitle.value[0].taskusers
    }
    // userNames.value = configData.userList.map((item) => item.userid).join(', ')
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
            value: signerUserId.value
          }
        ]
      }
    }
    const res = await getworkTaskUserListApi(param)
    userList.value = res
    if (userList.value[0].menuPermission) {
      userList.value[0].menuPermission = ''
    }
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
    // const res = res1
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

    // 2. 准备提交参数
    // 判断是否是转发给他人
    if (configData.selectedChoice === -3) {
      await transferTaskApi({
        data: {
          tid: taskId.value,
          content: configData.content,
          nextuser: configData.selectedSigner.join(',')
        }
      })
      ElMessage.success('提交成功')
      submitState.value = 'success'
      submitAllState.value = 'success'
    } else {
      const uniqueUsers = (autoHandler.value?.signerUserAuto ?? []).filter((user, index, self) => index === self.findIndex((u) => u.nid === user.nid && u.userid === user.userid))
      await getworkTaskUserList()
      let param = {
        data: {
          oid: oid.value,
          tid: taskId.value,
          pid: pid.value,
          taskid: taskId.value,
          mid: 879,

          attach: {},
          nextuser: '',
          procuser: '',
          nid: '',
          rid: '',
          rtid: '',
          acrosssys: 0,
          icode: 0,
          refoid: '',
          riskProcInfo: {},
          userName: userStore.userInfo.username,
          taskName: taskName.value,
          status: 1,
          state: 0,
          gids: '',
          subProcs: [],
          procusers: [],

          extinfo: JSON.stringify({
            oid: oid.value,
            taskid: taskId.value,
            tid: tid.value,
            attach: {},
            nextuser: [signerUserId.value],
            procuser: [],
            mid: 879,
            nid: '',
            rid: '',
            rtid: '',
            acrosssys: 0,
            icode: 0,
            refoid: '',
            riskProcInfo: {},
            pid: pid.value,
            userName: userStore.userInfo.username,
            taskName: '方式审核',
            status: 1,
            state: 0,
            gids: '',
            choice: configData.selectedChoice,
            type: currentConfig.value.nid,
            prefid: currentConfig.value.prefid,
            nextusers: uniqueUsers,
            subProcs: [],
            content: configData.content,
            info: getChoiceByKey(currentConfig.value.choices, configData.selectedChoice)?.info
          }),

          content: configData.content,
          choice: configData.selectedChoice,
          prefid: currentConfig.value.prefid,
          type: currentConfig.value.nid,
          result: getChoiceByKey(currentConfig.value.choices, configData.selectedChoice)?.value,
          nextusers: uniqueUsers,
          // nextuser_342267: userList.value,
          ...(uniqueUsers.length > 0 && {
            [`nextuser_${uniqueUsers[0].nid}`]: userList.value
          }),
          vars: currentConfig.value?.vars || {}, // 安全访问vars

          info: currentConfig.value.info || {}
        }
      }
      param.data.vars.choice = configData.selectedChoice
      Object.assign(param.data.vars, JSON.parse(currentConfig.value.info || '{}')?.vars || {}, JSON.parse(getChoiceByKey(currentConfig.value.choices, configData.selectedChoice)?.info || '{}')?.vars || {})
      param.data.vars = convertVarsAuto(param.data.vars)
      const res = await submitWorkTaskConfigApi(param)
      ElMessage.success('提交成功')
      submitState.value = 'success'
      submitAllState.value = 'success'
    }
    returnOrder()
  } catch (error) {}
}

// 智能审查 oid.value
async function review() {
  reviewDialog.value = true
  // try {
  //   const res = await checkWorkTaskConfigApi({
  //     data: {
  //       oid: oid.value
  //     }
  //   })
  //   tableData.value = res.data
  //   reviewDialog.value = true
  // } catch (error) {}
}

/**获取处理人用户组 */
async function getGroupList() {
  try {
    selectedGroupId.value = ''
    handlerList.value = []
    handlerGroupDialog.value = true
    let result = await getHandlerGroupApi({
      pageNo: 1,
      pageSize: 999999
    })
    handerGroupList.value = result.records
  } catch {}
}

/**获取当前用户组用户列表 */
async function getGroupUsers() {
  try {
    let res = await getHandlersByGroupIdApi(selectedGroupId.value)
    handlerList.value = res.map((item) => ({
      value: item.userid,
      label: `${item.name}(${item.userid})`
    }))
  } catch (e) {}
}

/**合并选择 */
function selectGroup() {
  signerList.value = [...new Map([...signerList.value, ...handlerList.value].map((item) => [item.value, item])).values()]
  const handlers = handlerList.value.map((item) => item.value)
  configData.selectedSigner = [...new Set([...configData.selectedSigner, ...handlers])]
  handlerGroupDialog.value = false
 
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

// // 数据格式转换。转成数字类型
// const numberFields = [
//   'choice', 'planType', 'preAuthorizeTasks', 'networkenv', 'userKind',
//   'operationType', 'planSrc', 'runChange', 'heavyLevel', 'riskLevel',
//   'metadataChange', 'affectBusiness', 'replenishTicket', 'effectApp',
//   'isPublishJob', 'isFloodPeriod', 'involveSynergy', 'involveBasicsApp',
//   'isCompliance', 'isWorkGplot', 'involveAdjust', 'safetyChange',
//   'involveDefineChange', 'involveSystem', 'involveAdjustMessage', 'autoWork',
//   'isHalt', 'isServe', 'noHaltServe', 'testVerify', 'isWindowsHost', 'mid'
// ];

// // 转换函数
// function convertVarsToNumberFormat(vars) {
//   if (!vars || typeof vars !== 'object') {
//     return {};
//   }

//   const result = { ...vars }; // 浅拷贝原对象

//   numberFields.forEach(field => {
//     if (field in result) {
//       const value = result[field];
//       // 只转换可以转为数字的字符串（非空且可转为有效数字）
//       if (typeof value === 'string' && value.trim() !== '' && !isNaN(Number(value))) {
//         result[field] = Number(value);
//       }
//       // 注意：布尔字符串如 "false"/"true" 保持原样，不转换
//     }
//   });

//   return result;
// }
</script>
<style scoped>
.card-item {
  :deep(.el-card__body) {
    padding: 0px;
  }
}
.handler {
  :deep(.el-select__wrapper) {
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
  }
}
.btn {
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
}
.radio-item {
  width: 100%;
  /* border: 1px solid #dcdfe6; */
  border-radius: 4px;
  overflow: hidden;
}
</style>
