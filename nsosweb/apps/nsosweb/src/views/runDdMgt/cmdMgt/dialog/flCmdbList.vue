<template>
  <div>
    <div class="flex pb-1">
      <span>漏洞涉及cmdb资产：</span>
      <el-button plain type="primary" class="ml-2" size="small" :icon="Search">关联cmdb资产</el-button>
      <el-button plain type="primary" class="ml-4" size="small" :icon="Plus" @click="addFlawAssetClick(null)">手工补录</el-button>
      <el-button plain type="primary" class="ml-4" size="small" :icon="Upload" @click="modalApiA.open()">Excel导入</el-button>
      <el-button plain type="danger" class="ml-4" size="small" :icon="Delete" @click="batchDelFlawAssetClick(null)">批量删除</el-button>
    </div>
    <el-table :data="data.flawAssetData" ref="flawAssetTableRef" show-overflow-tooltip border size="small" style="width: 100%; height: 470px">
      <el-table-column type="selection" fixed width="40" align="center" />
      <el-table-column type="index" fixed width="40" label="#" align="center" />
      <el-table-column prop="affUnit" label="所属单位" width="160" align="center" />
      <el-table-column prop="affSys" label="所属系统" width="160" align="center" />
      <el-table-column prop="assetName" label="资产名称" width="250" align="center" />
      <el-table-column prop="assetType" label="资产类型" width="90" align="center">
        <template #default="scope">
          {{ scope.row.assetType == '1' ? '系统' : scope.row.assetType == '2' ? '设备' : '' }}
        </template>
      </el-table-column>
      <el-table-column prop="ipAddress" label="IP地址" width="100" align="center" />
      <el-table-column prop="assetVersion" label="版本号" width="100" align="center" />
      <el-table-column prop="isRestore" label="是否完成整改" column-key="NSOS_YES_OR_NO" :formatter="formatDrop" width="100" align="center" />
      <el-table-column prop="planTime" label="计划完成整改时间" :formatter="tDateTimeFormat" width="140" align="center" />
      <el-table-column prop="counterMeasures" label="应对措施" width="300" align="center" />
      <el-table-column label="操作" width="80" fixed="right" align="center">
        <template #default="scope">
          <div class="flex items-center">
            <span class="cursor-pointer flex primary ml-2" @click="addFlawAssetClick(scope.row.id)">编辑</span>
            <span class="delcss flex items-center m-auto" @click="delFlawAssetClick(scope.$index)"><Delete class="h-[12px] w-[12px]" /></span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" class="mt-1" :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="currentChange"> </el-pagination>
    <ModalA class="w-[400px]" title="导入cmdb资产" :footer="false" :closeOnClickModal="false" :draggable="true">
      <CmdbImport :cmdCode="cmdCode" @close="modalApiA.close()" @ok="cmdImportOk"></CmdbImport>
    </ModalA>
    <ModalD class="w-[700px] top-[20vh]" :title="data.curFlawAssetId ? '添加cmdb资产' : '编辑cmdb资产'" :footer="false" :closeOnClickModal="false" :draggable="true">
      <AddFlawAsset :id="data.curFlawAssetId" :cmdCode="cmdCode" @close="addFlawAssetClose" @ok="addFlawAssetOk"></AddFlawAsset>
    </ModalD>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref} from 'vue'
import { useVbenModal } from '@vben/common-ui'
import { Search, Delete, Upload, Plus, } from '@element-plus/icons-vue'
import { ElNotification, ElMessage, ElMessageBox, ElTable, ElTableColumn } from 'element-plus'
import { saveFlawAsset, queryFlawAsset, initFlawAsset, deleteFlawAsset, queryFlawAssetByPage } from '../cmdMgtMethod.ts'
import { tDateTimeFormat, formatDrop } from '#/utils/commonUtil.ts'
import CmdbImport from './cmdbImport.vue'
import AddFlawAsset from './addFlawAsset.vue'
import { useDropStore } from '#/store'

const emit = defineEmits(['afterQuery'])
const cmdCode = defineModel('cmdCode')
const dropList = reactive({})
const data = reactive({
  curFlawAssetId: null,
  flawAssetData: [],
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0
  }
})
const [ModalA, modalApiA] = useVbenModal({
  onCancel() {
    modalApiA.close()
  }
})
const [ModalD, modalApiD] = useVbenModal({
  onCancel() {
    modalApiD.close()
  }
})
const flawAssetTableRef = ref()

onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = ['NSOS_YES_OR_NO']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)
})
const queryFlawAssetClick = async () => {
  let d = { commandCode: cmdCode.value }
  d.pageSize = data.pageInfo.pageSize
  d.pageNo = data.pageInfo.pageNo

  const { list, count, pageNo, info } = await queryFlawAssetByPage(d, { params: { personal: true }})
  data.flawAssetData = list
  data.pageInfo.pageNo = pageNo
  data.pageInfo.total = count

  emit('afterQuery', info)
}
const addFlawAssetClick = async (id) => {
  data.curFlawAssetId = id
  modalApiD.open()
}
const delFlawAssetClick = async (index) => {
  let ids = data.flawAssetData[index].id
  ElMessageBox.confirm('确认是否删除选中的记录? ', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    if (ids != '') {
      await deleteFlawAsset({ ids: ids })
    }
    ElNotification({
      title: '提示',
      message: '删除成功！',
      type: 'success'
    })
    queryFlawAssetClick()
  })
}
const batchDelFlawAssetClick = async () => {
  let rows = flawAssetTableRef.value.getSelectionRows()

  if (rows.length == 0) {
    ElMessage.warning('请勾选记录！')
    return
  }
  let ids = ''
  rows.forEach((r) => {
    if (r.id) {
      ids += r.id + ','
    }
  })
  ElMessageBox.confirm('确认是否删除选中的记录? ', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    if (ids != '') {
      await deleteFlawAsset({ ids: ids.substring(0, ids.length - 1) })
    }
    ElNotification({
      title: '提示',
      message: '删除成功！',
      type: 'success'
    })
    queryFlawAssetClick()
  })
}
const handleSizeChange = (val) => {
  data.pageInfo.pageSize = val;
  queryFlawAllByPage();
};
const currentChange = (val) => {
  data.pageInfo.pageNo = val;
  queryFlawAllByPage();
};
const cmdImportOk = async () => {
  queryFlawAssetClick()
  modalApiA.close()
}
const addFlawAssetClose = async () => {
  modalApiD.close()
}
const addFlawAssetOk = async () => {
  queryFlawAssetClick()
  modalApiD.close()
}
defineExpose({queryFlawAssetClick})
</script>
<style scoped>
.primary {
  color: hsl(var(--primary));
}

.delcss {
  color: red;
  cursor: pointer;
}

.delcss:hover {
  text-decoration: underline;
}

:deep(.el-popper) {
  max-width: 600px!important;
}
</style>
