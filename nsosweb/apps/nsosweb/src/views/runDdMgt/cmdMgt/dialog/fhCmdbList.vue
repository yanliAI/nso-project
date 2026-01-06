<template>
  <div>
    <el-form label-width="auto" :inline="true" label-position="right" class="demo-form-inline mt-2">
      <el-row>
        <el-col :span="24">
          <el-form-item label="结果汇总:" prop="opinion">
            <el-input v-model="data.resultInfo" :rows="2" type="textarea" disabled />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="pt-[2px] pb-[6px]">
      <el-table :data="data.flawAllData" ref="flawAssetTableRef" show-overflow-tooltip border size="small" style="width: 100%; height: 500px">
        <el-table-column type="index" width="50" label="#" fixed align="center" />
        <el-table-column prop="affUnit" label="所属单位" width="160" align="center" />
        <el-table-column prop="affSys" label="所属系统" width="160" align="center" />
        <el-table-column prop="assetName" label="资产名称" width="250" align="center" />
        <el-table-column prop="assetType" label="资产类型" width="90" align="center" column-key="NSOS_ASSET_TYPE" :formatter="formatDrop"></el-table-column>
        <el-table-column prop="ipAddress" label="IP地址" width="100" align="center" />
        <el-table-column prop="assetVersion" label="版本号" width="100" align="center" />
        <el-table-column prop="isRestore" label="是否完成整改" column-key="NSOS_YES_OR_NO" :formatter="formatDrop" width="100" align="center" />
        <el-table-column prop="planTime" label="计划完成整改时间" :formatter="tDateTimeFormat" width="140" align="center" />
        <el-table-column prop="counterMeasures" label="应对措施" width="300" align="center" />
      </el-table>
      <div class="flex">
        <div class="flex-1">
          <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" class="mt-1" :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="currentChange"> </el-pagination>
        </div>
        <div class="dianji primary flex items-center" @click="flawAssetToExcelClick">
          <div class="w-[16px] h-[16px] mt-[1px] mr-[2px] excel-dc"></div>
          导出Excel
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue'
import { Search, Delete, Upload, Plus } from '@element-plus/icons-vue'
import { ElNotification, ElMessage, ElMessageBox, ElTable, ElTableColumn } from 'element-plus'
import { flawAssetToExcel, queryFlawAssetByPage } from '../cmdMgtMethod.ts'
import { tDateTimeFormat, formatDrop } from '#/utils/commonUtil.ts'
import { useUserStore } from '@vben/stores'
import { useDropStore } from '#/store'

const cmdCode = defineModel('cmdCode')
const doneFlag = defineModel('doneFlag')
const dropList = reactive({})
const data = reactive({
  resultInfo: null,
  flawAllData: [],
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0
  }
})

const flawAssetTableRef = ref()
const userStore = useUserStore()

onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = ['NSOS_YES_OR_NO', 'NSOS_ASSET_TYPE']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)
})
const queryFlawAllByPage = async (showmask) => {
  let d = { commandCode: cmdCode.value }
  d.pageSize = data.pageInfo.pageSize
  d.pageNo = data.pageInfo.pageNo

  const { list, count, pageNo, info } = await queryFlawAssetByPage(d, { params: { personal: doneFlag.value }, showmask: showmask })
  data.flawAllData = list
  data.pageInfo.pageNo = pageNo
  data.pageInfo.total = count

  data.resultInfo = info
}
const handleSizeChange = (val) => {
  data.pageInfo.pageSize = val;
  queryFlawAllByPage();
};
const currentChange = (val) => {
  data.pageInfo.pageNo = val;
  queryFlawAllByPage();
};
const flawAssetToExcelClick = () => {
  let d = { commandCode: cmdCode.value }
  console.log(userStore.userInfo.orgcode);
  if (doneFlag.value == true) {
    d.flDept = userStore.userInfo.orgcode
  }
  flawAssetToExcel(d, cmdCode.value +'_涉及cmdb资产.xlsx')
}
defineExpose({queryFlawAllByPage, data})
</script>
<style scoped>
.primary {
  color: hsl(var(--primary));
}

.excel-dc{
  background: url('/images/common/excel.png') center no-repeat;
  background-size: 100% 100%;
}
</style>
