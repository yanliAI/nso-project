<template>
  <div class="main-d">
    <div class="head-d">
      <div class="flex items-center h-6">
        <div class="w-[493px] font-bold text-lg">网级运调中心{{data.cmdData.commandFl == '2' ? '通知' : '指令'}}</div>
        <div class="flex items-center cursor-pointer primary delcss" v-if="data.cmdData.flowState != 0 && data.cmdData.processInsId" @click="lookFlow(data.cmdData.processId, data.cmdData.processInsId)">
          <Operation class="w-[12px] h-[12px]"></Operation>流程跟踪
        </div>
        <div class="flex-1 text-right pr-2">
          <el-button type="primary" :icon="Tickets" v-if="data.cmdData.flowState == 0" @click="saveData" size="small">保存</el-button>
          <el-button type="primary" :icon="Promotion" v-if="data.cmdData.flowState == 0 && data.owner" @click="releaseCmdClick" size="small">提交</el-button>
          <el-button type="primary" :icon="Promotion" v-if="data.cmdData.flowState > 0 && hqPermission() && data.cmdData.id && data.oprateFlow" @click="signTaskClick" size="small">签收</el-button>
          <el-button type="primary" :icon="Promotion" v-if="data.cmdData.flowState > 0 && flPermission() && data.cmdData.id && data.oprateFlow" @click="sendClick('fl')" size="small">复令</el-button>
          <el-button type="primary" :icon="Promotion" v-if="data.cmdData.flowState > 0 && data.cmdData.nodeId == 'Task_5_1d5kjt0' && data.cmdData.id && data.oprateFlow" @click="sendClick('fh')" size="small">复核</el-button>
          <el-button type="primary" :icon="Back" v-if="data.cmdData.flowState > 0 && data.cmdData.nodeId == 'Task_5_1d5kjt0' && data.cmdData.id && data.oprateFlow" @click="backClick" size="small">回退</el-button>
          <el-button type="danger" v-if="data.cmdData.id && data.cmdData.flowState == 0 && data.owner" :icon="Delete" @click="deleteClick" size="small">删除</el-button>
          <el-button type="danger" v-if="data.cmdData.id && data.cmdData.flowState > 0 && data.cmdData.commandStatus < 4 && data.owner" :icon="Delete" @click="nullifyClick" size="small">作废</el-button>
        </div>
      </div>
    </div>
    <div class="body-d">
      <div class="body-c">
        <el-collapse v-model="activeNames" >
          <el-collapse-item title="故障填报" :icon="CaretRight" name="1">
            <template #title>
              <div class="flex items-center primary">
                <Expand class="w-3.5 h-3.5"></Expand>
                <div class="ml-1 font-bold">指令信息</div>
              </div>
            </template>
            <div class="part-b">
              <el-form label-width="110px" ref="ruleFormRef" :model="data.cmdData" :rules="formRules" :disabled="data.cmdData.flowState > 0" :inline="true" label-position="right" class="demo-form-inline mt-2">
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="指令编号:" prop="commandCode">
                      <el-input v-model="data.cmdData.commandCode" disabled clearable/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="data.cmdData.commandFl == '2' ? '通知类别:' : '指令类别:'" prop="commandType" filterable>
                      <el-select v-model="data.cmdData.commandType" @change="zlChange" :disabled="data.cmdType">
                        <el-option v-for="item in commandTypeFilterList" :key="item.value" :label="item.label" :value="item.value"/>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="完成时限:" prop="wcTime">
                      <el-date-picker v-model="data.cmdData.wcTime" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" clearable/>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="指令名称:" prop="commandTitle">
                      <el-input v-model="data.cmdData.commandTitle" clearable/>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="受令单位:" prop="slDept">
                      <el-select v-model="sldw" multiple placeholder="选择单位" @change="sldwChange" collapse-tags collapse-tags-tooltip :max-collapse-tags="8" remote reserve-keyword clearable filterable  style="width: 100%">
                        <template #header>
                          <el-checkbox v-model="data.checkSlAll" @change="orgCheckAll">全选</el-checkbox>
                          <el-checkbox v-model="data.checkGkAll" @change="orgGkCheckAll">管制单位</el-checkbox>
                          <el-checkbox v-model="data.checkFgkAll" @change="orgFgkCheckAll">非管制单位</el-checkbox>
                        </template>
                        <el-option v-for="item in dropList.NSOS_ORG_NAME" :key="item.value" :label="item.label" :value="item.value"/>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="发令单位:" prop="flDept">
                      <el-select v-model="data.cmdData.flDept" disabled>
                        <el-option v-for="item in dropList.NSOS_ORG_NAME" :key="item.value" :label="item.label" :value="item.value"/>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="发令人:" prop="commander">
                      <el-select v-model="data.cmdData.commander" disabled>
                        <el-option v-for="item in dropList.NSOS_USER_NAME" :key="item.value" :label="item.label" :value="item.value"/>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="创建时间:" prop="createTime">
                      <el-date-picker v-model="data.cmdData.createTime" type="datetime" disabled clearable/>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="关联信息:" prop="faultCode">
                      <el-input v-model="data.cmdData.faultCode" disabled clearable/>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="具体内容:" prop="cmdContent">
                      <el-input v-model="data.cmdData.cmdContent" :rows="5" maxlength="1600" show-word-limit type="textarea" placeholder="请输入具体内容" clearable/>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <div class="mb-1">
                    <AttachUpload :parentId="data.cmdData.id ? data.cmdData.id : data.bakId" :moduleId="data.cmdData.commandCode" :inAdvance="data.cmdData.id ? false : true"
                     @afterUpload="attachListRef.queryData()" v-if="data.cmdData.flowState == 0" :size="'small'"></AttachUpload>
                  </div>
                  <AttachList ref="attachListRef" :parentId="data.cmdData.id ? data.cmdData.id : data.bakId" :moduleId="data.cmdData.commandCode" :showPreview="false" :showDelete="data.cmdData.flowState != 0"></AttachList>
                </el-row>
              </el-form>
            </div>
          </el-collapse-item>
          <el-collapse-item v-if="data.cmdData.flowState > 0 && data.oprateFlow && (flPermission() || data.cmdData.nodeId == 'Task_5_1d5kjt0')" :icon="CaretRight" name="2">
            <template #title>
              <div class="flex items-center primary">
                <Expand class="w-3.5 h-3.5"></Expand>
                <div class="ml-1 font-bold">{{data.cmdData.nodeName == '复核'? '复核':'复令'}}</div>
              </div>
            </template>
            <div class="part-b" >
              <el-form label-width="110px" ref="opinionFormRef" :model="data.opinionData" :rules="formRules" :inline="true" label-position="right" class="demo-form-inline mt-2">
                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="data.cmdData.nodeName == '复核'? '复核信息':'复令信息'" prop="opinion">
                      <el-input v-model="data.opinionData.opinion" :rows="3" maxlength="1000" show-word-limit type="textarea" placeholder="请输入复令信息" clearable/>
                    </el-form-item>
                  </el-col>
                </el-row>
                <div v-if="data.cmdData.nodeId != 'Task_5_1d5kjt0' && data.commandTypeLabel == '漏洞排查'">
                  <el-row>
                    <el-col :span="6">
                      <div class="text-right h-[32px] leading-[32px] pr-3">是否使用相关产品:</div>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="" prop="isUseXgcp">
                        <el-radio-group v-model="data.opinionData.isUseXgcp">
                          <el-radio value="Y">是</el-radio>
                          <el-radio value="N">否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row v-if="data.opinionData.isUseXgcp == 'Y'">
                    <el-col :span="6">
                      <div class="text-right h-[32px] leading-[32px] pr-3">产品版本号/型号是否在影响范围内:</div>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="" prop="isCpyxfw">
                        <el-radio-group v-model="data.opinionData.isCpyxfw">
                          <el-radio value="Y">是</el-radio>
                          <el-radio value="N">否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row v-if="data.opinionData.isCpyxfw == 'Y'">
                    <el-col :span="8">
                      <el-form-item label="涉及系统数量（套）:" prop="sjSysNum">
                        <el-input-number v-model="data.opinionData.sjSysNum" :min="1" :max="1000000" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="涉及设备数量（台）:" prop="sjDeviceNum">
                        <el-input-number v-model="data.opinionData.sjDeviceNum" :min="1" :max="1000000" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="未完成整改数量（台/套）:" prop="wwcZgnum">
                        <el-input-number v-model="data.opinionData.wwcZgnum" :min="1" :max="1000000"/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row v-if="data.opinionData.isCpyxfw == 'Y' && data.opinionData.wwcZgnum > 0">
                    <el-col :span="24">
                      <el-form-item label="为整改部分应对措施:" prop="zgydcs">
                        <el-input v-model="data.opinionData.zgydcs" :rows="5" maxlength="1000" show-word-limit type="textarea" placeholder="请输入整改部分应对措施" clearable/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </el-form>
              <div v-if="data.cmdData.nodeId != 'Task_5_1d5kjt0'" class="mt-1 mb-1">
                <AttachUpload :parentId="data.cmdData.id" :moduleId="data.flBakId" :inAdvance="true" v-show="data.oprateFlow" @afterUpload="flAttachListRef.queryData()" :size="'small'"></AttachUpload>
              </div>
              <AttachList ref="flAttachListRef" v-if="data.flBakId" :parentId="data.cmdData.id" :moduleId="data.flBakId" :showPreview="false" :showDelete="data.cmdData.flowState != 0"></AttachList>
            </div>
          </el-collapse-item>
          <el-collapse-item title="复令情况" v-if="(data.cmdData.flowState > 0 && !data.oprateFlow) || data.cmdData.nodeId == 'Task_5_1d5kjt0'" :icon="CaretRight" name="3">
            <template #title>
              <div class="flex items-center primary">
                <Expand class="w-3.5 h-3.5"></Expand>
                <div class="ml-1 font-bold">复令情况</div>
              </div>
            </template>
            <div class="part-b">
              <el-table :data="data.taskFlList" border size="small" style="height: 100%;">
                <el-table-column type="index" width="40" label="#" fixed align="center"/>
                <el-table-column prop="fldw" label="受令单位" fixed column-key="NSOS_ORG_NAME" :formatter="formatDrop" width="150" align="center"></el-table-column>
                <el-table-column prop="flMan" label="操作人" fixed column-key="NSOS_USER_NAME" :formatter="formatDrop" width="80" align="center"/>
                <el-table-column prop="opTime" label="操作时间" :formatter="tDateTimeFormat" width="130" align="center"/>
                <el-table-column header-align="center" width="80" label="是否超时" align="center">
                  <template #default="scope">
                    <span v-if="scope.row.opTime > new Date(data.cmdData.wcTime)" class="text-red-600">是</span>
                    <span v-else>否</span>
                  </template>
                </el-table-column>
                <el-table-column prop="opinion" label="复令信息" width="250" align="center"/>
                <el-table-column label="附件信息" width="320" align="left">
                  <template #header>
                    <div class="flex items-center">
                      <div class="flex-1">附件信息</div>
                      <div class="primary flex items-center text-right dianji" v-if="!doneFlag" @click="downAllClick"><Download class="w-[14px] h-[14px]"></Download>下载全部附件</div>
                    </div>
                  </template>
                  <template #default="scope">
                    <div v-for="(item,index) in getNodeAttachFile(scope.row)" :key="'ath'+index" class="flex items-center">
                      <div v-if="typeContains(item.fileType, 'xlsx')" class="file-icon execls"></div>
                      <div v-else-if="typeContains(item.fileType, 'mp3apewavflacwmampegogg')" class="file-icon yy"></div>
                      <div v-else-if="typeContains(item.fileType, 'mp4aviwmvrmvbflv')" class="file-icon sp"></div>
                      <div v-else-if="typeContains(item.fileType, 'rarzip7zgztar')" class="file-icon ys"></div>
                      <div v-else-if="typeContains(item.fileType, 'docxrtf')" class="file-icon word"></div>
                      <div v-else-if="typeContains(item.fileType, 'txt')" class="file-icon txt"></div>
                      <div v-else-if="typeContains(item.fileType, 'pdf')" class="file-icon pdf"></div>
                      <div v-else-if="typeContains(item.fileType, 'pngjpgjpeggifsvg')" class="file-icon tp"></div>
                      <div v-else-if="typeContains(item.fileType, 'htmlcssjs')" class="file-icon html"></div>
                      <div v-else-if="typeContains(item.fileType, 'exe')" class="file-icon exe"></div>
                      <div v-else class="file-icon qt"></div>
                      <div class="flex-1 ml-1">{{ item.name }}.{{item.fileType}}</div>
                      <el-tooltip content="下载" placement="bottom" effect="light">
                        <Download class="w-[16px] h-[16px] dianji primary ml-0" @click="downloadClick(item)" />
                      </el-tooltip>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column v-if="data.commandTypeLabel == '漏洞排查'" prop="isUseXgcp" label="是否使用相关产品" column-key="NSOS_YES_OR_NO" :formatter="formatDrop" width="150" align="center"/>
                <el-table-column v-if="data.commandTypeLabel == '漏洞排查'" prop="isCpyxfw" label="产品版本号/型号是否在影响范围内" column-key="NSOS_YES_OR_NO" :formatter="formatDrop" width="150" align="center"/>
                <el-table-column v-if="data.commandTypeLabel == '漏洞排查'" prop="sjSysNum" label="涉及系统数量（套）"  width="150" align="center"/>
                <el-table-column v-if="data.commandTypeLabel == '漏洞排查'" prop="sjDeviceNum" label="涉及设备数量（台）"  width="150" align="center"/>
                <el-table-column v-if="data.commandTypeLabel == '漏洞排查'" prop="wwcZgnum" label="未完成整改数量（台/套）"  width="160" align="center"/>
                <el-table-column v-if="data.commandTypeLabel == '漏洞排查'" prop="zgydcs" label="为整改部分应对措施"  width="350" align="center"/>
              </el-table>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
    <Modal class="w-[800px] h-[650px]" title="选择用户" :footer="false" :closeOnClickModal="false" :draggable="true">
      <WfBackUserSelect :nodeUserInfo="data.nodeUserInfo" @close="selectUserClose" @ok="selectUserOk"></WfBackUserSelect>
    </Modal>
    <ModalB class="w-[1200px] h-[350px]" :title="'选择' + (data.cmdData.commandFl == '2' ? '通知' : '指令') + '模板内容'" :footer="false" :closeOnClickModal="false" :draggable="true">
      <CmdTemplateDialog :commandType="data.cmdData.commandType" :createTime="data.cmdData.createTime" @afterSelectTemplate="afterSelectTemplate"></CmdTemplateDialog>
    </ModalB>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref, watch, computed } from 'vue';
import { CaretRight, Expand, Tickets, HelpFilled, Operation, Finished, Download, Promotion, Back, Checked, Comment, SuccessFilled, List, Delete, BottomRight, Check, Close, Plus, MuteNotification } from '@element-plus/icons-vue';
import { ElNotification, ElMessage, ElMessageBox ,ElCollapse, ElCollapseItem, ElTable, ElTableColumn, ElCheckbox} from 'element-plus';
import { initCmd, saveCmdInfo, queryTaskList, deleteCmd, nullifyCmd, signTask, flTask, fhTask, releaseTask, cmdSyncTempFile, countTemplateData, queryTemplateData, getSysId, queryFlSituationList } from './cmdMgtMethod.ts'
import { formatDateTime, lookFlow, tDateTimeFormat, formatDateZw, numberToChinese, formatToken, formatDrop } from '#/utils/commonUtil.ts';
import { useDropStore } from '#/store';
import axios from 'axios';
import { useAccessStore } from '@vben/stores';
import AttachList from '#/views/basic/attach/attachList.vue';
import AttachUpload from '#/views/basic/attach/attachUpload.vue';
import { useUserStore } from '@vben/stores';
import { useVbenModal } from '@vben/common-ui';
import { requestClient } from '#/api/request';
import WfBackUserSelect from '#/views/basic/workflow/wfBackUserSelect.vue'
import CmdTemplateDialog from './cmdTemplateDialog.vue'

const dropList = reactive({});
const cmdId = defineModel('cmdId')
const cmdFl = defineModel('cmdFl')
const oprateFlow = defineModel('oprateFlow')
const doneFlag = defineModel('doneFlag')
const faultCode = defineModel('faultCode')
const cmdType = defineModel('cmdType')
const tabName = defineModel('tabName')
const emit = defineEmits(['afterAdd', 'refreshList', 'removeTab'])
const activeNames = ref(['1','2','3','4','5','6'])
const attachListRef = ref()
const flAttachListRef = ref()
const userStore = useUserStore();
const sldw = ref()
const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
});
const [ModalB, modalApiB] = useVbenModal({
  onCancel() {
    modalApiB.close();
  },
});
const commandTypeFilterList = computed(() => {
  return dropList.NSOS_CMD_TYPE?.filter(option => option.filter === data.cmdData.commandFl);
});
const data = reactive({
  cmdData: {
    commandType: null,
  },
  bakId: null,
  opinionData: {},
  taskHqList: [],
  taskFlList: null,
  tableData: [],
  userOptions: [],
  attachList: [],
  editIndex: null,
  updateList: [],
  oprateFlow: null,
  nullifyLoading: false,
  owner: false,
  nodeUserInfo: null,
  checkSlAll: false,
  checkGkAll: false,
  checkFgkAll: false,
  commandTypeLabel: null,
  gkdw: ['0161','0171','0126','0156','0166','0133','0198']
})
const formData = reactive({

})
const ruleFormRef = ref()
const opinionFormRef = ref()
const isDisabled = defineModel('isDisabled')
const formRules = reactive({
  wcTime: [
    { required: true, message: '请选择完成时间', trigger: 'change' },
  ],
  commandType: [
    { required: true, message: '请选择指令类型', trigger: 'change' },
  ],
  slDept: [
    { required: true, message: '请选择受令单位', trigger: 'change' },
  ],
  commandTitle: [
    { required: true, message: '请输入指令标题', trigger: 'blur' },
    { min: 0, max: 300, message: '内容长度最大不能超过300', trigger: 'blur' },
  ],
  cmdContent: [
    { required: true, message: '请输入指令内容', trigger: 'blur' },
    { min: 0, max: 1600, message: '内容长度最大不能超过1600', trigger: 'blur' },
  ],
  zgydcs: [
    { required: true, message: '请输入为整改部分应对措施', trigger: 'blur' },
    { min: 0, max: 1000, message: '内容长度最大不能超过1000', trigger: 'blur' },
  ],
  opinion: [
    { required: true, message: '请输入信息', trigger: 'blur' },
    { min: 0, max: 1000, message: '内容长度最大不能超过1000', trigger: 'blur' },
  ],
})
onMounted(async () => {
  data.oprateFlow = oprateFlow.value;
  data.cmdType = cmdType.value
  const userStore = useUserStore();
  const dropStore = useDropStore();
  const dropType = ['NSOS_ORG_NAME', 'NSOS_USER_NAME', 'NSOS_CMD_TYPE', 'NSOS_NOTICE_TYPE', 'NSOS_YES_OR_NO']
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);

  let rs = await initCmd({id: cmdId.value, cmdFl: cmdFl.value})
  data.cmdData = rs.cmdData
  data.bakId = rs.bakId
  console.log(data.cmdData);
  if (faultCode.value) {
    data.cmdData.faultCode = faultCode.value
  }
  if (cmdType.value) {
    data.cmdData.commandType = cmdType.value
  }
  if (data.cmdData.commandType) {
    dropList.NSOS_CMD_TYPE.forEach(d => {
      if (d.value == data.cmdData.commandType) {
        data.commandTypeLabel = d.label
      }
    });
  }
  if (flPermission() && data.commandTypeLabel == '漏洞排查') {
    data.opinionData.sjSysNum = 5
    data.opinionData.sjDeviceNum = 2
    data.opinionData.wwcZgnum = 3
  }
  if (flPermission()) {
    data.flBakId = await getSysId()
  }
  if (data.cmdData.flowState > 0) {
    queryDeal()
  }

  if (data.cmdData.id == null && data.cmdData.commandTitle == null) {
    getCmdTitle('')
  }
  if (userStore.userInfo.logincode == data.cmdData.commander) {
    data.owner = true
  }
  formatEntity()

  // document.body.addEventListener('click', ()=>{data.editIndex = null});
});
watch(sldw, (val) => {
  data.cmdData.slDept = sldw.value
  if (!val) return
  if (val.length === 0) {
    data.checkSlAll = false
    data.checkGkAll = false
    data.checkFgkAll = false
  } else if (val.length === dropList.NSOS_ORG_NAME.length) {
    data.checkSlAll = true
    data.checkGkAll = false
    data.checkFgkAll = false
  } else if (val.length == 7) {
    let num = 0
    for (let i = 0; i < val.length; i++) {
      if (data.gkdw.includes(val[i])) {
        num++
      }
    }
    if (num == 7) {
      data.checkSlAll = false
      data.checkGkAll = true
      data.checkFgkAll = false
    }
  } else if (val.length === (dropList.NSOS_ORG_NAME.length - 7)) {
    for (let i = 0; i < val.length; i++) {
      let fg = true
      if (data.gkdw.includes(val[i])) {
        fg = false
        break
      }
      if (fg) {
        data.checkSlAll = false
        data.checkGkAll = false
        data.checkFgkAll = true
      }
    }
  } else {
    data.checkSlAll = false
    data.checkGkAll = false
    data.checkFgkAll = false
  }
})
const queryDeal = async () => {
  if (data.oprateFlow && data.cmdData.nodeId != "Task_5_1d5kjt0") {
    return;
  }
  // 查询所有附件
  let params = {params:{parentId: data.cmdData.id}}
  data.attachList = await requestClient.get(import.meta.env.VITE_BASIC + '/attachFileInfo/queryAttachList', params, {showmask: false})
  params = {processId: data.cmdData.processId, processInsId: data.cmdData.processInsId}

  data.taskFlList = await queryFlSituationList({cmdId: data.cmdData.id, personal: doneFlag.value})
}
const getNodeAttachFile = (row) => {
  let flist = data.attachList.filter(f => {return f.moduleId == row.id})
  console.log(row.id);
  return flist
}
function typeContains(type, types){
  return types.indexOf(type) >= 0
}
const formatEntity = () => {
  data.cmdData.createTime = formatDateTime(data.cmdData.createTime)
  data.cmdData.wcTime = formatDateTime(data.cmdData.wcTime)
  sldw.value = eval(data.cmdData.slDept)
}
const attachClick = () => {
  modalApi.open()
}
const saveData = async () => {
  let count = 0;
  await ruleFormRef.value.validate(async (valid) => {
    if (count > 0) return;
    count++
    if (valid) {
      data.cmdData.slDept = JSON.stringify(sldw.value)
      let fd = JSON.parse(JSON.stringify(data.cmdData))

      try {
        data.cmdData = await saveCmdInfo(fd, {params: {bakId: data.bakId}});
      } catch (error) {
        ElMessage.error('保存失败！');
        return
      }
      formatEntity()
      ElNotification({
        title: '提示',
        message: '保存成功！',
        type: 'success',
      })
      if (attachListRef.value) attachListRef.value.queryData()
      emit('afterAdd', data.cmdData)
      return true
    } else {
      ElMessage.warning('请输入必填项！');
      return false
    }
  })
}
const backClick = async () => {
  modalApi.open()
  let params = {workId: data.cmdData.id}
  data.nodeUserInfo = await requestClient.get(import.meta.env.VITE_NSOSGZ + '/command/queryBackTransNodeAndTransUser', {params})
}
const selectUserClose = () => {
  modalApi.close()
}
const selectUserOk = async (nodeInfo, opinion) => {
  let params = {
    workId: data.cmdData.id,
    targetNodeInfos: nodeInfo,
    opinion: opinion,
  }
  try {
    await requestClient.post(import.meta.env.VITE_NSOSGZ + '/command/backTaskAndUser', params)
  } catch (error) {
    ElMessage.error('回退失败！');
    return
  }
  modalApi.close()
  ElNotification({
    title: '提示',
    message: '回退成功！',
    type: 'success',
  })
  emit('removeTab', tabName.value)
  emit('refreshList', false)
}
const formatDeptName = (acs, flag) => {
  if (acs.length > 1) {
    if (flag == 1) {
      return acs.substring(0, acs.length - 2)
    }
    if (flag == 2) {
      return acs.substring(acs.length - 2, acs.length)
    }
  }
  if (acs == '复核') {
    return data.cmdData.flDept
  }
}
const sldwChange = () => {
  data.cmdData.slDept = sldw.value
}
const orgCheckAll = (val) => {
  if (val) {
    sldw.value = dropList.NSOS_ORG_NAME.map((_) => _.value)
  } else {
    sldw.value = []
  }
  data.cmdData.slDept = sldw.value
}
const orgGkCheckAll = (val) => {
  if (val) {
    sldw.value = dropList.NSOS_ORG_NAME.filter((n) => data.gkdw.includes(n.value)).map((_) => _.value)
  } else {
    sldw.value = []
  }
  data.cmdData.slDept = sldw.value
}
const orgFgkCheckAll = (val) => {
  if (val) {
    sldw.value = dropList.NSOS_ORG_NAME.filter((n) => !data.gkdw.includes(n.value)).map((_) => _.value)
  } else {
    sldw.value = []
  }
  data.cmdData.slDept = sldw.value
}
const zlChange = async () => {
  dropList.NSOS_CMD_TYPE.forEach(d => {
    if (d.value == data.cmdData.commandType) {
      getCmdTitle(d.label)
      data.commandTypeLabel = d.label
    }
  });
  handleTemplateData();
}
const downAllClick = () => {
  const accessStore = useAccessStore();
  axios.defaults.headers.post['Authorization'] = formatToken(accessStore.accessToken);
  let params = {parentId: data.cmdData.id}
  axios({
    method: 'post',
    url: import.meta.env.VITE_BASIC + '/attachFileInfo/downLoadAll',
    responseType: 'blob',
    params: params,
  }).then((res) => {
      var blob = new Blob([res.data], {
          type: "application/x-msdownload;charset=UTF-8",
      });
      // 创建一个blob的对象链接
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      // 设置下载文件名
      link.setAttribute('download', data.cmdData.commandCode + '_复令情况.zip');
      document.body.appendChild(link);

      link.click();
      link.remove()
      window.URL.revokeObjectURL(url)
  })
}
const handleTemplateData = async () => {
  let templateFormData = {commandTypeCode: data.cmdData.commandType}
  const templateCount = await countTemplateData(templateFormData)
  if (templateCount == 1) {
    const { list } = await queryTemplateData(templateFormData)
    if (list.length > 0) {
      const templateData = list[0];
      data.cmdData.cmdContent = templateData.cmdContent;
      sldw.value = eval(templateData.slDept);
      let newWcTime = new Date(data.cmdData.createTime);
      newWcTime.setHours(newWcTime.getHours() + templateData.finishLimit);
      data.cmdData.wcTime = formatDateTime(newWcTime);
      cmdSyncTempFile(templateData.id)
    }
  } else if (templateCount > 1) {
    modalApiB.open();
  } else {
    cmdSyncTempF(null)
  }
}
const afterSelectTemplate = (templateData) => {
  data.cmdData.cmdContent = templateData.cmdContent;
  sldw.value = eval(templateData.slDept);
  let newWcTime = new Date(data.cmdData.createTime);
  newWcTime.setHours(newWcTime.getHours() + templateData.finishLimit);
  data.cmdData.wcTime = formatDateTime(newWcTime);
  modalApiB.close();
  cmdSyncTempF(templateData.id)
}
const cmdSyncTempF = async (tempId) => {
  await cmdSyncTempFile({cmdId: data.cmdData.id ? data.cmdData.id : data.bakId, cmdCode: data.cmdData.commandCode, tempId: tempId})
  attachListRef.value.queryData()
}
const getCmdTitle = (commandType) => {
  let bh = data.cmdData.commandCode.substring(data.cmdData.commandCode.length-4, data.cmdData.commandCode.length)
  data.cmdData.commandTitle = formatDateZw(data.cmdData.createTime) + '第' + numberToChinese(parseInt(bh)) + '号' + (data.cmdData.commandFl == '2' ? '通知' : '指令【') + commandType + '】'
}
const releaseCmdClick = () => {
  ElMessageBox.confirm(
    '确认是否发令? 流程启动后，无法撤回！',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      let count = 0;
      await ruleFormRef.value.validate(async (valid) => {
        if (count > 0) return;
        count++
        if (valid) {
          data.cmdData.slDept = JSON.stringify(sldw.value)
          let fd = JSON.parse(JSON.stringify(data.cmdData))

          try {
            data.cmdData = await saveCmdInfo(fd, {params: {bakId: data.bakId}});
          } catch (error) {
            ElMessage.error('保存失败！');
            return
          }
          formatEntity()
          ElNotification({
            title: '提示',
            message: '保存成功！',
            type: 'success',
          })
          // if (attachListRef.value) attachListRef.value.queryData()

          try {
            let params = {workId: data.cmdData.id, opinion: data.opinionData.opinion}
            let rsdata = await releaseTask(params)
            if (rsdata.todo) {
              data.cmdData = rsdata.todo
            } else {
              data.cmdData.flowState = rsdata.flowState
              data.cmdData.processInsId = rsdata.processInsId
              data.cmdData.processId = rsdata.processId
              data.oprateFlow = false
            }
            ElNotification({
              title: '提示',
              message: '发令成功！',
              type: 'success',
            })
            emit('removeTab', tabName.value)
            emit('afterAdd', data.cmdData)
            emit('refreshList', false)
          } catch (error) {
            ElMessage.error('发令失败！');
          }
        } else {
          ElMessage.warning('请输入必填项！');
        }
      })
    }).catch(error => {
      console.log(error);
    })
}

const signTaskClick = async () => {
  try {
    let params = {workId: data.cmdData.id}
    let rsdata = await signTask(params)
    if (rsdata.todo) {
      data.cmdData = rsdata.todo
    } else {
      data.oprateFlow = false
    }
    ElNotification({
      title: '提示',
      message: '签收成功！',
      type: 'success',
    })
    queryDeal()
    emit('removeTab', tabName.value)
    emit('refreshList', false)
  } catch (error) {
    ElMessage.error('签收失败！');
  }
}
const sendClick = async (optype) => {
  let count = 0;
  await opinionFormRef.value.validate(async (valid) => {
    if (count > 0) return;
    count++
    if (valid) {
      ElMessageBox.confirm(
      '确认是否提交? 提交后，无法撤回！',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
      .then(async () => {
        try {
          let params = {workId: data.cmdData.id, opinion: data.opinionData.opinion}
          if (optype == 'fl') {
            // 判断是否存在模板，如果有模板，则必须上传附件
            if (data.commandTypeLabel == '漏洞排查' && attachListRef.value.data.tableData.length > 0 && flAttachListRef.value.data.tableData.length == 0) {
              ElMessage.error('当指令存在模板，复令时必须上传附件！');
              return
            }
            params.flBakId = data.flBakId
            await flTask(data.opinionData, params)
          } else if (optype == 'fh') {
            await fhTask(params)
          }

          ElNotification({
            title: '提示',
            message: '提交成功！',
            type: 'success',
          })
          emit('removeTab', tabName.value)
          emit('refreshList', false)
        } catch (error) {
          ElMessage.error('提交失败！');
        }
      })
    } else {
      ElMessage.warning('请输入必填项！');
    }
  })

}
const deleteClick = () => {
  ElMessageBox.confirm(
    '确认是否删除指令?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      try {
        await deleteCmd({id: data.cmdData.id})
        ElNotification({
          title: '提示',
          message: '删除成功！',
          type: 'success',
        })
        emit('removeTab', tabName.value)
        emit('refreshList', false)
      } catch (error) {
        ElMessage.error('删除失败！');
      }
    })
}
const nullifyClick = () => {
  ElMessageBox.confirm(
    '确认是否作废指令?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      try {
        await nullifyCmd({id: data.cmdData.id})
        ElNotification({
          title: '提示',
          message: '作废成功！',
          type: 'success',
        })
        emit('removeTab', tabName.value)
        emit('afterNullify', false)
      } catch (error) {
        ElMessage.error('作废失败！');
      }
    })
}
const downloadClick = (row) => {
  const accessStore = useAccessStore();
  axios.defaults.headers.post['Authorization'] = formatToken(accessStore.accessToken);
  axios({
    method: 'post',
    url: import.meta.env.VITE_BASIC + '/attachFileInfo/downLoad',
    responseType: 'blob',
    params: {objectId: row.id},
  }).then((res) => {
      var blob = new Blob([res.data], {
          type: "application/x-msdownload;charset=UTF-8",
      });
      // 创建一个blob的对象链接
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      // 设置下载文件名
      link.setAttribute('download', row.name+'.'+row.fileType);
      document.body.appendChild(link);

      link.click();
      link.remove()
      window.URL.revokeObjectURL(url)
  })
}
const flPermission = () => {
  if (data.cmdData.nodeId == 'Task_56_1kl9nav' || data.cmdData.nodeId == 'Task_54_000rlah' ||
      data.cmdData.nodeId == 'Task_52_1s0enlx' || data.cmdData.nodeId == 'Task_50_0bb8a3r' ||
      data.cmdData.nodeId == 'Task_48_1w7y7xk' || data.cmdData.nodeId == 'Task_46_1y7mjhu' ||
      data.cmdData.nodeId == 'Task_44_0z35v1j' || data.cmdData.nodeId == 'Task_42_1m0rgza' ||
      data.cmdData.nodeId == 'Task_21_193j49h' || data.cmdData.nodeId == 'Task_20_0lm0cki' ||
      data.cmdData.nodeId == 'Task_19_0yrl9xg' || data.cmdData.nodeId == 'Task_17_0v9xqfh' ||
      data.cmdData.nodeId == 'Task_16_15ny0fh' || data.cmdData.nodeId == 'Task_15_0j2rwxm' ||
      data.cmdData.nodeId == 'Task_14_1yzqdas' || data.cmdData.nodeId == 'Task_13_0qv1onx' ||
      data.cmdData.nodeId == 'Task_12_0no1gy2' || data.cmdData.nodeId == 'Task_11_16rvz79' ||
      data.cmdData.nodeId == 'Task_10_0b01ka0' || data.cmdData.nodeId == 'Task_9_1fclttz' ||
      data.cmdData.nodeId == 'Task_8_0025dfn' || data.cmdData.nodeId == 'Task_2_1texg3r' ||
      data.cmdData.nodeId == 'Task_4_18bjdq4' || data.cmdData.nodeId == 'Task_3_10jfudi' ||
      data.cmdData.nodeId == 'Task_6_1pfepa9' || data.cmdData.nodeId == 'Task_7_12p47ba' ||
      data.cmdData.nodeId == 'Task_18_0m33zju'
  ) {
    return true
  } else {
    return false
  }
}
const hqPermission = () => {
  if (data.cmdData.nodeId == 'Task_22_0h5aklf' || data.cmdData.nodeId == 'Task_23_1h8khnu' ||
    data.cmdData.nodeId == 'Task_24_0hz92jw' || data.cmdData.nodeId == 'Task_25_15mpwsx' ||
    data.cmdData.nodeId == 'Task_26_0fxjrs6' || data.cmdData.nodeId == 'Task_27_1yhrbph' ||
    data.cmdData.nodeId == 'Task_28_1mwdy2u' || data.cmdData.nodeId == 'Task_29_1albez7' ||
    data.cmdData.nodeId == 'Task_30_0rpbzxj' || data.cmdData.nodeId == 'Task_31_0leoi9c' ||
    data.cmdData.nodeId == 'Task_32_05cra4r' || data.cmdData.nodeId == 'Task_33_0qrykmv' ||
    data.cmdData.nodeId == 'Task_34_080tci2' || data.cmdData.nodeId == 'Task_35_1lupfxl' ||
    data.cmdData.nodeId == 'Task_36_094zpeg' || data.cmdData.nodeId == 'Task_37_0emjygo' ||
    data.cmdData.nodeId == 'Task_38_1emnbii' || data.cmdData.nodeId == 'Task_39_1ao7iq0' ||
    data.cmdData.nodeId == 'Task_40_17hyd9r' || data.cmdData.nodeId == 'Task_41_1tryi45' ||
    data.cmdData.nodeId == 'Task_43_14h3ic0' || data.cmdData.nodeId == 'Task_45_1fn9wnh' ||
    data.cmdData.nodeId == 'Task_47_16mi367' || data.cmdData.nodeId == 'Task_49_19r2drn' ||
    data.cmdData.nodeId == 'Task_51_0mayvcc' || data.cmdData.nodeId == 'Task_53_0rhbsfs' ||
    data.cmdData.nodeId == 'Task_55_1nfzuz1'
  ) {
    return true
  } else {
    return false
  }
}
defineExpose({data})
</script>
<style scoped>
/* 滚动条样式 **/
div::-webkit-scrollbar {
  width: 6px;
}

div::-webkit-scrollbar-track {
  border-radius: 4px;
}

div::-webkit-scrollbar-thumb {
  border-radius: 10px;
}

.part-b{
  border-top: 1px solid #c4dbf5;
}

.delcss{
  color: red;
  cursor: pointer;
}

.delcss:hover{
  text-decoration: underline;
}

.main-d{
  width: 100%;
  height: 100%;
  font-size: 12px;
}

.head-d{
  width: 1050px;
  height: 31px;
  padding-top: 5px;
  margin: auto;
}

.body-d{
  width: 100%;
  height: calc(100% - 40px);
  padding-top: 4px;
  overflow: auto;
}

.body-c{
  width: 1050px;
  height: 100%;
  margin: auto;
}

.primary{
  color: hsl(var(--primary));
}

.cmd-table tr td{
    height: 35px;
    text-align: center;
    border: 1px solid rgb(200 203 206 / 40%);
}

.demo-form-inline .el-input {
  --el-input-width: 100%;
}

.demo-form-inline .el-select {
  --el-select-width: 100%;
}

:deep(.el-date-editor.el-input, .el-date-editor.el-input__wrapper){
  width: 100%;
}

:deep(.el-form--inline .el-form-item){
  width: 100%!important;
  margin-right: 0!important;
  margin-bottom: 15px !important;
}

.required::before {
  margin-right: 1px;
	color: red;
	content: "*";
}

.iconfg{
  width: 20px;
  height: 20px;
  margin: auto;
}

.zhi{
  color: #52c41a;
}

.mh{
  color: red;
}

.mr {
  color: #909399;
}

.file-icon{
  width: 16px;
  height: 16px;
  margin-top: -1px;
  cursor: default;
}

.yy{
    background: url("/images/attach/yy.png") center no-repeat;
    background-size: 100% 100%;
}

.sp{
    background: url("/images/attach/sp.png") center no-repeat;
    background-size: 100% 100%;
}

.ys{
    background: url("/images/attach/ys.png") center no-repeat;
    background-size: 100% 100%;
}

.exe{
    background: url("/images/attach/exe.png") center no-repeat;
    background-size: 100% 100%;
}

.word{
    background: url("/images/attach/word.png") center no-repeat;
    background-size: 100% 100%;
}

.execls{
    background: url("/images/attach/excel.png") center no-repeat;
    background-size: 100% 100%;
}

.txt{
    background: url("/images/attach/txt.png") center no-repeat;
    background-size: 100% 100%;
}

.pdf{
    background: url("/images/attach/pdf.png") center no-repeat;
    background-size: 100% 100%;
}

.tp{
    background: url("/images/attach/tp.png") center no-repeat;
    background-size: 100% 100%;
}

.qt{
    background: url("/images/attach/qt.png") center no-repeat;
}

.html{
    background: url("/images/attach/html.png") center no-repeat;
    background-size: 100% 100%;
}

.dianji{
  font-weight: normal;
  cursor: pointer;
}

.dianji:hover{
  text-decoration: underline;
}

:deep(.el-form-item__label){
  align-items: center;
  line-height: normal;
  text-align: right;
}

:deep(.el-input-number){
  width:100%;
}

:deep(.el-collapse-item__header){
  height: 35px;
  padding-left: 8px;
  background: #d9e9fc;
}
</style>
