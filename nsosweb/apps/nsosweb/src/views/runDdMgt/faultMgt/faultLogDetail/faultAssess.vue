<template>
  <div class="w-full h-full">
    <div class="text-right pt-1" v-if="!disabled">
      <el-button type="primary" plain class="ml-0" :icon="DataLine" size="small" @click="analysisClick">研判分析</el-button>
    </div>
    <div class="flex items-center mt-[6px]">
      <div class="w-24 text-center">研判结果:</div>
      <div class="flex-1">
        <el-input :rows="5" v-model="faultData.assessResult" show-word-limit type="textarea" disabled clearable/>
      </div>
    </div>
    <!-- <div class="flex items-center mt-2">
      <div class="w-24 text-center">研判结果:</div>
      <div class="flex-1 pr-5">
        <div>
          <el-radio-group v-model="data.planAction">
            <el-radio-button label="方案一：切换灾备环境" value="1" />
            <el-radio-button label="方案二：回滚系统版本" value="2" />
            <el-radio-button label="方案三：重启节点" value="3" />
          </el-radio-group>
        </div>
        <div class="mt-1">
          <el-table :data="data.tableData" border size="small" style="width: 100%;height: 150px;">
            <el-table-column type="index" width="40" label="#" align="center"/>
            <el-table-column prop="context" label="措施内容"  align="center"/>
            <el-table-column prop="csType" label="措施状态" width="120" :formatter="csTypeTran" align="center"/>
            <el-table-column label="操作" width="150" align="center">
              <template #default="scope">
                <div>
                  <span class="abgh" @click="editClick(scope.row)">编辑</span>
                  <span class="abgh" @click="grnerateClick(scope.row)">生成指令</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div> -->
    <!-- <el-dialog v-model="data.dialogEditVisible" title="措施编辑" width="800">
      <MeasureEdit @close="editClose" @release="releaseClick"></MeasureEdit>
    </el-dialog>
    <el-dialog v-model="data.dialogZlVisible" title="指令编辑" width="800">
      <GenerateInstruct @close="grnerateClose"></GenerateInstruct>
    </el-dialog> -->
    <Modal class="w-[1400px] h-[800px]" title="研判分析" :footer="false" :fullscreen="true" :closeOnClickModal="false" :draggable="true" headerClass="head-md">
      <AssessAnalysis :faultData="faultData" @analysisOk="analysisOk"></AssessAnalysis>
    </Modal>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue';
import { ElTable,ElTableColumn} from 'element-plus';
import { DataLine } from '@element-plus/icons-vue';
import { useDropStore } from '#/store';
import AssessAnalysis from './dialog/assessAnalysis.vue'
import { useVbenModal } from '@vben/common-ui';
import { useRouter } from 'vue-router';

const dropList = reactive({});
const faultData = defineModel('faultData')
const disabled = defineModel('disabled')
const router = useRouter()
const data = reactive({
  assessResult: null,
  planAction: '1',
  dialogEditVisible: false,
  dialogZlVisible: false,
  tableData: [],
})
const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
});

onMounted(async () => {
  const dropStore = useDropStore();
  const dropType = ['NSOS_SYS_LEVEL', 'NSOS_OPERATE_SCHEMA', 'NSOS_FAULT_TYPE', 'NSOS_OPERATE_ORG', 'NSOS_SYSTEM_INFO']
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);

  window.addEventListener('message', function(event) {
    if (event.origin !== location.origin) {
        return; // 确保消息来自正确的来源
    }
    console.log(event.data); // 显示从新窗口发送的消息
    faultData.value.assessResult = event.data
});
});
const analysisClick = () => {
  // modalApi.open()
  window.open(router.resolve({
    path: '/faultManage/assessAnalysis',
    query: {faultCode: faultData.value.faultCode, assessResult: faultData.value.assessResult}
  }).href, 'nsos-assessAnalysis');
}
const analysisOk = (result) => {
  data.assessResult = result
  modalApi.close()
}

defineExpose({
  
});
</script>
<style scoped>

.abgh{
  padding: 0 8px;
  color: hsl(var(--primary));
  cursor: pointer;
}
</style>
