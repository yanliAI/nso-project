<template>
  <div style="width: 100%">
    <el-card shadow="always">
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
        <el-form-item label="工作实施:" required style="width: 100%" v-if="configData.userList.length>0">
          <el-input v-model="userNames" :disabled="true" />
        </el-form-item>
        <el-form-item label="处理意见/内容:" required style="width: 100%" prop="content">
          <el-input v-model="configData.content" type="textarea" :rows="3" maxlength="200" />
        </el-form-item>
        <el-form-item style="float: right;">
          <el-button type="primary" @click="submitData()">提交</el-button>
          <el-button type="primary">签收</el-button>
          <el-button @click="returnOrder">取消</el-button>
          <el-button type="success">流程详情</el-button>
          <el-button type="primary" @click="review()">智能审查</el-button>
        </el-form-item>
      </el-form>
    </el-card>

      <el-dialog v-model="reviewDialog" title="审查结果" width="1100">
        <el-table border stripe :data="tableData">
          <el-table-column type="index" label="序号" align="center" width="100" />
          <el-table-column
            prop="checkItem"
            label="审查内容"
            align="center"
          ></el-table-column>
          <el-table-column prop="checkResult" label="审查结论" align="center">
            <template #default="scope">
              <span
                style="color: #ff0000"
                v-if="scope.row.checkResult == '不通过'"
                >不通过</span
              >
              <span v-else>通过</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="errorReason"
            label="审查结果"
            align="center"
          ></el-table-column>
        </el-table>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="reviewDialog = false">关闭</el-button>
          </div>
        </template>
      </el-dialog>
  </div>
</template>
<script setup>
import { ElTable, ElTableColumn, ElRow, ElCard, ElCol, ElFormItem, ElForm, ElInput, ElButton, ElSelect, ElOption, ElContainer, ElAside, ElHeader, ElMain, ElFooter, ElDialog, ElMessage, ElMessageBox, ElText, ElLink, ElCollapse, ElCollapseItem, ElTag } from 'element-plus'
import { Search, Download, Monitor, Operation, Document, Back, CircleCheck } from '@element-plus/icons-vue'
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
import { getworkTaskConfigApi, getworkTaskNextConfigApi,submitWorkTaskConfigApi,checkWorkTaskConfigApi } from '#/api'
import { useRouter } from 'vue-router'
const router = useRouter()
const taskId = defineModel('taskId')
const oid = defineModel('oid')
const formRef = ref(null)
const configData = reactive({ selectedChoice: '', content: '', userList: [] })
onMounted(() => {
  getTaskConfig()
})

const subTitle = ref('结果:')
const configTitle = ref('')
const currentConfig = ref('')
const nextConfigTitle = ref('')

const userNames = ref('')

const reviewDialog  = ref(false);
const tableData = ref([])

// 查询流程处理信息
async function getTaskConfig() {
  try {
    const res = await getworkTaskConfigApi({
      data: {
        taskid: taskId.value
      }
    })
    currentConfig.value = res
    configData.selectedChoice = res.choices[0].key
    configTitle.value = `当前处理信息【${currentConfig.value.name}】`
    subTitle.value =  `${currentConfig.value.name}结果`
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
    }
    // 赋值工程实施
    if (nextConfigTitle.value[0].userlist.length > 0) {
      configData.userList = nextConfigTitle.value[0].userlist
    } else if (nextConfigTitle.value.taskusers[0].length > 0) {
      configData.userList = nextConfigTitle.value[0].taskusers
    }
    userNames.value = configData.userList.map((item) => item.userid).join(', ')
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
  ]
}

// 提交流程处理
async function submitData() {
  try {
    const isValid = await formRef.value.validate();
    if (!isValid) {
      ElMessage.warning('请完善信息');
      return;
    }
   if (!configData.content.trim()) {
      ElMessage.warning('处理意见内容不能为空或纯空格');
      return;
    }

    // 2. 准备提交参数
    const param = {
      data: {
        oid: oid.value,
        tid: taskId.value,
        content: configData.content,
        choice: configData.selectedChoice,
        result: '提交确认',
        nextusers: configData.userList,
        subProcs: [],
        procusers: [],
        vars: currentConfig.value?.vars || {} // 安全访问vars
      }
    };

    const res = await submitWorkTaskConfigApi(param);
    if (res) {
      ElMessage.success('提交成功');
      returnOrder()
    } else {
      ElMessage.error(res.message || '提交失败');
    }
    
  } catch (error) {
  }
}

// 智能审查 oid.value
async function review(){
  try {
    const res  = await checkWorkTaskConfigApi({
      data:{
        oid:oid.value
      }
    })
    tableData.value = res.data
     reviewDialog.value = true;


  } catch (error) {
    
  }

}

// 返回工单页面
function returnOrder(){
  router.push({
    path: '/workPlanBalance/myAgent'
  })
}
</script>
<style scoped></style>
