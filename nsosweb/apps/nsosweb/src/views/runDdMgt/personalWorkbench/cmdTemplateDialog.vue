<template>
  <div class="w-full h-full">
    <div style="height: calc(100% - 40px)">
      <el-table :data="data.tableData" border size="small" style="height: 100%" class="template-table" @selection-change="selectTemplate" @row-dblclick="clickTemplate">
        <el-table-column type="selection" align="center" width="40"/>
        <el-table-column type="index" width="40" label="#" align="center"/>
        <el-table-column prop="templateName" label="模板名称" width="150" align="center"/>
        <el-table-column prop="cmdContent" label="内容" align="center"/>
        <el-table-column prop="slDeptStr" label="受令单位" width="350" align="center"/>
        <el-table-column prop="finishLimit" label="完成时限（小时）" width="150" align="center"/>
      </el-table>
    </div>
    <div style="height: 40px">
      <el-pagination :current-page="data.pageInfo.pageNo" :page-size="data.pageInfo.pageSize" class="mt-1"
          :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange" @current-change="currentChange"></el-pagination>
    </div>
  </div>
</template>
<script setup>
import { Page } from '@vben/common-ui';
import { onMounted, reactive, ref } from 'vue';
import { ElTable, ElTableColumn, ElPagination } from 'element-plus';
import { formatDateTime, formatDrop } from '#/utils/commonUtil.ts';
import { useDropStore } from '#/store';
import { queryTemplateData } from './cmdMgtMethod.ts';

const commandType = defineModel('commandType')
const createTime = defineModel('createTime')
const data = reactive({
  tableData: [],
  formData: {},
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0,
  },
})
const dropList = reactive({});
const emit = defineEmits('afterSelectTemplate')
onMounted(async () => {
  const dropStore = useDropStore();
  const dropType = ['NSOS_ORG_NAME']
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);
  query()
});

const query = async () => {
  data.formData.commandTypeCode = commandType.value
  const { list, count, pageNo } = await queryTemplateData(data.formData)
  data.tableData = list
  data.pageInfo.pageNo = pageNo;
  data.pageInfo.total = count;
  formatEntity();
}

const getWcTime = (hours) => {
  let wcTime = new Date(createTime.value);
  wcTime.setHours(wcTime.getHours() + hours);
  return formatDateTime(wcTime);
}

const selectTemplate = (row) => {
  emit('afterSelectTemplate', row[0])
}

const clickTemplate = (row) => {
  emit('afterSelectTemplate', row)
}

const formatEntity = () => {
  if (!data.tableData) return
  data.tableData.forEach(r => {
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
    r.slDeptStr = l
  })
}
</script>
<style scoped>
:deep(.template-table thead .el-table-column--selection .cell) {
    display: none;
}

</style>
