<template>
  <div class="w-full h-full">
    <div v-if="!disabled" class="h-8 flex items-center ">
      <!-- <div class="czjlds">处置记录</div> -->
      <div class="flex-1 text-right">
        <el-button type="primary" plain class="ml-4" :icon="Plus" v-if="faultData&&faultData.id" size="small" @click="addClick">添加指令</el-button>
        <!-- <el-button type="primary" plain class="ml-4" :icon="Delete" v-if="faultData&&faultData.id" size="small" :loading="data.delLoading" @click="deleteClick">删除</el-button> -->
        <!-- <el-button type="primary" plain class="ml-4" :icon="Download" v-if="faultData&&faultData.id" size="small">导出</el-button> -->
      </div>
    </div>
    <div :class="disabled ? 'flex items-center mb-1 mt-[8px]' : 'flex items-center mb-1 mt-[-8px]'">
      <div class="primary">故障指令</div>
      <div class="kkl-b"></div>
    </div>
    <el-table :data="data.cmdList" show-overflow-tooltip border size="small" style="width: 100%;">
      <el-table-column type="index" width="40" label="#" align="center"/>
      <el-table-column prop="commandCode" label="指令编号" width="170" align="center"/>
      <el-table-column prop="commandTitle" label="指令名称" align="left" header-align="center"/>
      <el-table-column prop="slDept" label="受令单位" width="140" align="center"/>
      <el-table-column prop="flTime" :formatter="tDateTimeFormat"  label="发令时间" width="130" align="center"/>
      <el-table-column label="编辑" width="45" align="center">
        <template #default="scope">
          <div>
            <CircleCheck :class="scope.row.commandStatus == 0 ? 'mr djk' : scope.row.commandStatus > 0 ? 'mr gljk' : 'mr'"/>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="审核" width="45" align="center">
        <template #default="scope">
          <div>
            <CircleCheck :class="scope.row.commandStatus == 1 ? 'mr djk' : scope.row.commandStatus > 1 ? 'mr gljk' : 'mr'"/>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="发布" width="45" align="center">
        <template #default="scope">
          <div>
            <CircleCheck :class="scope.row.commandStatus == 2 ? 'mr djk' : scope.row.commandStatus > 2 ? 'mr gljk' : 'mr'"/>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="签收" width="45" align="center">
        <template #default="scope">
          <div>
            <CircleCheck :class="scope.row.commandStatus == 3 ? 'mr djk' : scope.row.commandStatus > 3 ? 'mr gljk' : 'mr'"/>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="复令" width="45" align="center">
        <template #default="scope">
          <div>
            <CircleCheck :class="scope.row.commandStatus == 4 ? 'mr djk' :  scope.row.commandStatus > 4 ? 'mr gljk' : 'mr'"/>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="复核" width="45" align="center">
        <template #default="scope">
          <div>
            <CircleCheck :class="scope.row.commandStatus == 5 ? 'mr djk' :  scope.row.commandStatus > 5 ? 'mr gljk' : 'mr'"/>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="终结" width="45" align="center">
        <template #default="scope">
          <div>
            <CircleCheck :class="scope.row.commandStatus >= 6 ? 'mr gljk' : 'mr'"/>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="50" align="center">
        <template #default="scope">
          <div class="flex items-center">
            <el-tooltip content="编辑" placement="bottom" effect="light">
              <Edit v-if="scope.row.commandStatus == 0" class="abgh primary m-auto" style="width:18px;height:18px" @click="editCmd(scope.row.id)"/>
            </el-tooltip>
            <el-tooltip content="查看" placement="bottom" effect="light">
              <View v-if="scope.row.commandStatus > 0" class="abgh primary m-auto" style="width:18px;height:18px" @click="editCmd(scope.row.id)"></View>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <Modal class="w-[1200px] h-[700px]" :title="' '" :footer="false" :closeOnClickModal="false" :draggable="true" :bordered="false" headerClass="head-md">
      <CmdDetail :cmdId="data.curCmdId" :cmdFl="'1'" :faultCode="data.faultData.faultCode" :cmdType="'BM202504220009'" :oprateFlow="false" @afterAdd="refreshList" @refreshList="refreshList" @removeTab="addClose"></CmdDetail>
    </Modal>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { ElTable, ElTableColumn, ElMessageBox, ElNotification, ElMessage} from 'element-plus';
import { Link, Edit, CircleCheck, Delete, Plus, Download, View } from '@element-plus/icons-vue';
import { useDropStore } from '#/store';
import { queryDisposeRecord, queryCmdByFaultCode, deleteDispose } from './faultDetailMethod.ts'
import { formatDateTime, tDateTimeFormat, formatDrop} from '#/utils/commonUtil.ts';
import { useVbenModal } from '@vben/common-ui';
import CmdDetail from '#/views/runDdMgt/cmdMgt/cmdDetail.vue';

const dropList = reactive({});
const disabled = defineModel('disabled')
const faultData = defineModel('faultData')
const disposeTableRef = ref()
const data = reactive({
  faultData: {},
  dialogAddVisible: false,
  disposeList: [],
  cmdList: [],
  curRecId: null,
  delLoading: false,
  curCmdId: null,
})
const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
});

onMounted(async () => {
  const dropStore = useDropStore();
  const dropType = ['NSOS_COMMAND_STATE', 'NSOS_SYSTEM_INFO', 'NSOS_ORG_NAME']
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);
});
watch(faultData, async (val) => {
  data.faultData = faultData.value
  if (faultData.value.faultCode) {
    refreshList()
  }
})
const formatEntity = () => {
  if (!data.cmdList) return
  data.cmdList.forEach(r => {
    let sldw = eval(r.slDept)
    let l = ''
    if (sldw && sldw.length > 0) {
      sldw.forEach(d => {
        dropList.NSOS_ORG_NAME.forEach(o => {
          if (d == o.value) {
            l += o.label + '；'
          }
        })
      })
    }
    r.slDept = l
  })
}
const refreshList = async () => {
  data.cmdList = await queryCmdByFaultCode({faultCode: faultData.value.faultCode})
  formatEntity()
}
const editDispose = (id) => {
  modalApi.open()
  data.curRecId = id
}
const addClick = () => {
  data.curCmdId = null
  modalApi.open()
}
const addClose = () => {
  modalApi.close()
}
const csTypeTran = (row) => {
  if (row.csType == '1') {
    return '编辑中'
  }
}
const deleteClick = () => {
  let rows = disposeTableRef.value.getSelectionRows()
  if (rows.length == 0) {
    ElMessage.warning('请勾选处置记录！');
    return 
  }
  
  ElMessageBox.confirm(
    '确认是否删除选中的处置记录? ',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      data.delLoading = true
      let ids = ''
      rows.forEach(r => {
        ids += r.id + ','
      });
      await deleteDispose({ids: ids.substring(0, ids.length-1)})
      ElNotification({
        title: '提示',
        message: '删除成功！',
        type: 'success',
      })
      data.delLoading = false
      refreshList()
    })
}
const editCmd = (id) => {
  data.curCmdId = id
  modalApi.open()
}
defineExpose({
  
});
</script>
<style scoped>
.abgh{
  cursor: pointer;
}

.primary{
  color: hsl(var(--primary));
}

.kkl-b{
  flex:1;
  margin-left: 5px;
  border-top: 1px solid #c4dbf5;
}

.gljk{
  color: #52c41a !important;
}

.djk{
  color: red !important;
}

.mr{
  width: 20px;
  height: 20px;
  margin: auto;
  color: #9b9898;
}

.hkd{
  border-bottom: 1px solid #c4dbf5;
}

.czjlds{
  width:100px;
  height: 28px;
  line-height: 28px;
  color:#fff;
  text-align: center;
  background: #199ed8;
}
</style>
