<template>
  <el-container class="h-full bg-white">
    <el-header height="45px">
      <div class="flex-1 pr-2 text-right">
        <el-button type="primary" class="ml-4" :icon="Bottom" @click="saveRec" :disabled="(evaluateStatus === '3' || (!data.canOper && evaluateStatus === '2')) ? true : false">保存</el-button>
        <el-button type="primary" class="ml-4" :icon="Tickets" @click="commit" :disabled="(evaluateStatus === '3' || (!data.canOper && evaluateStatus === '2')) ? true : false">提交</el-button>
        <el-button type="info" plain class="ml-4" :icon="Back" @click="back">返回</el-button>
      </div>
    </el-header>
    <el-main style="height: calc(100% - 90px)">
      <el-table :data="data.tableData" style="width: 100%; height: 100%" border size="small" @row-click="onClickEdit" :row-class-name="evaluateRow">
        <el-table-column type="index" label="#" align="center" />
        <!-- <el-table-column prop="evaluateItemCode" label="评价项编号" align="center" /> -->
        <el-table-column prop="evaluateItemName" label="评价项目" width="120" align="center" />
        <el-table-column prop="normalizeRequire" label="规范化要求" width="150" align="center" />
        <el-table-column prop="normalScore" label="标准分" width="80" align="center" />
        <el-table-column prop="evaluateWay" label="评价方法" width="250px" align="center" />
        <el-table-column prop="evaluateAccording" label="评分依据" width="200px" align="center" />
        <el-table-column prop="selfEvaluateDeadline" label="自评截止时间" :formatter="tDateTimeFormat" width="130px" align="center" />
        <el-table-column prop="selfEvaluateScore" label="自评得分" width="80" align="center">
          <template #default="scope">
            <span v-show="scope.$index !== data.editIndex || evaluateStatus !== '1'">
              {{ scope.row.selfEvaluateScore }}
            </span>
            <el-input type="number" v-show="scope.$index === data.editIndex && evaluateStatus === '1'" v-model.number="scope.row.selfEvaluateScore" @change="handleChange(scope.row)"> </el-input>
          </template>
        </el-table-column>
        <el-table-column prop="selfEvaluateOption" label="自评说明" align="center">
          <template #default="scope">
            <span v-show="scope.$index !== data.editIndex || evaluateStatus !== '1'">
              {{ scope.row.selfEvaluateOption }}
            </span>
            <el-input v-show="scope.$index === data.editIndex && evaluateStatus === '1'" v-model="scope.row.selfEvaluateOption" @change="handleChange(scope.row)"> </el-input>
          </template>
        </el-table-column>
        <el-table-column prop="attachment" label="附件信息" align="center" width="100">
          <template #default="scope">
            <el-button type="primary" size="small" class="btn" link @click="attachClick(scope.row.id)" v-if="scope.row.evaluateItemLevel !== 1">附件</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="selfEvaluateTime" label="自评时间" :formatter="tDateTimeFormat" width="130px" align="center" />
        <el-table-column v-if="evaluateStatus !== '1'" prop="finalScore" label="最终评分" width="80" align="center">
          <template #default="scope">
            <span v-show="scope.$index !== data.editIndex || evaluateStatus !== '2'">
              {{ scope.row.finalScore }}
            </span>
            <el-input type="number" v-show="scope.$index === data.editIndex && evaluateStatus === '2' && data.canOper" v-model.number="scope.row.finalScore" @change="handleChange(scope.row)"> </el-input>
          </template>
        </el-table-column>
        <el-table-column v-if="evaluateStatus !== '1'" prop="scoreOpinion" label="最终评分意见/说明" align="center">
          <template #default="scope">
            <span v-show="scope.$index !== data.editIndex || evaluateStatus !== '2'">
              {{ scope.row.scoreOpinion }}
            </span>
            <el-input v-show="scope.$index === data.editIndex && evaluateStatus === '2' && data.canOper" v-model="scope.row.scoreOpinion" @change="handleChange(scope.row)"> </el-input>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
  <Modal class="w-[700px]" title="附件编辑" :footer="false" :closeOnClickModal="false" :draggable="true" headerClass="head-md">
    <AttachFile :parentId="data.selectedId" :moduleId="'evaluateManage'" @close="addClose"></AttachFile>
  </Modal>
</template>
<script lang="ts" setup>
import { Page } from '@vben/common-ui'
import { onMounted, reactive, ref, nextTick } from 'vue'
import { ElRow, ElCol, ElTable, ElTableColumn, ElMain, ElContainer, ElHeader, ElFooter, ElMessage, ElMessageBox } from 'element-plus'
import AttachFile from '/src/views/basic/attach/attachFile.vue'
import AttachList from '/src/views/basic/attach/attachList.vue'
import { useUserStore } from '@vben/stores'
import { useVbenModal } from '@vben/common-ui'
import { queryData, saveData, saveRecord } from './evaluateDetailMethod.ts'
import { tDateFormat, tDateTimeFormat } from '#/utils/commonUtil.ts'

const data = reactive({
  tableData: [],
  updateList: [],
  editIndex: -1,
  formData: {},
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0
  },
  canOper: false,
  selectedId: null,
})

const userStore = useUserStore()

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close()
  }
})

const userDept = defineModel<string>('userDept')
const provinceCode = defineModel<string>('provinceCode')
const evaluateCode = defineModel<string>('evaluateCode')
const evaluateUini = defineModel<string>('evaluateUini')
const tabName = defineModel('name')
const evaluateStatus = defineModel<string>('evaluateStatus')
const emit = defineEmits(['removeTab', 'query'])

const evaluateRow = ({ row }: { row: any }) => {
  if (row.evaluateItemLevel === 1) {
    return 'level1-row'
  } else if (row.evaluateItemLevel === 2) {
    return 'level2-row'
  }
  return ''
}

const countScore = () => {
  let score = 0
  if (data.tableData.length === 0) return 0
  data.tableData.forEach((item) => {
    if (item.evaluateItemLevel !== 1) {
      if (evaluateStatus.value === '1') {
        score = score + Number(item.selfEvaluateScore)
      } else if (evaluateStatus.value === '2') {
        score = score + Number(item.finalScore)
      }
    }
  })
  return score
}

const attachClick = (id) => {
  data.selectedId = id
  modalApi.open()
}

const save = () => {
  data.editIndex = -1
}

const saveRec = () => {
  try {
    saveRecord(data.updateList)
    save()
    ElMessage.success('保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

const commit = async () => {
  if (!validate(data.tableData)) {
    return
  }
  let score = countScore()
  ElMessageBox.confirm(`当前评价的总得分为 ${score}，提交后评分将不能修改，请确认是否提交！`, '提示', {
    confirmButtonText: '提交',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        // 处理根节点
        let topData = data.tableData.filter(i => i.evaluateItemLevel === 1)?.[0]
        if (evaluateStatus.value === '1') {
          topData.selfEvaluateScore = score
        } else if (evaluateStatus.value === '2') {
          topData.finalScore = score
        }
        // data.updateList.push(topData)

        await saveData(data.tableData, {
          evaluateCode: evaluateCode,
          evaluateStatus: evaluateStatus
        })
        save()
        back()
        emit('query')
        ElMessage.success('提交成功')
      } catch (error) {
        ElMessage.error('提交失败')
      }
    })
    .catch(() => {
      ElMessage.info('已取消')
    })
}

const validate = (tableData: Object[]) => {
  if (evaluateStatus.value === '1') {
    for (const item of tableData) {
      if (item.selfEvaluateScore === 0) break
      if (item.selfEvaluateScore && item.evaluateItemLevel !== 1 && item.selfEvaluateScore > item.normalScore) {
        ElMessage.error('自评得分不得高于标准分')
        return false
      }
      if (!item.selfEvaluateScore && item.evaluateItemLevel !== 1) {
        ElMessage.error('请完成所有自评项')
        return false
      }
    }
  } else if (evaluateStatus.value === '2') {
    for (const item of tableData) {
      if (item.finalScore === 0) break
      if (item.finalScore && item.evaluateItemLevel !== 1 && item.finalScore > item.normalScore) {
        ElMessage.error('最终评分不得高于标准分')
        return false
      }
      if (!item.finalScore && item.evaluateItemLevel !== 1) {
        ElMessage.error('请完成所有终评项')
        return false
      }
    }
  }
  return true
}

const back = () => {
  emit('removeTab', tabName.value)
}

function onClickEdit(row: any, column: any, event: any) {
  if (row.evaluateItemLevel !== 1) {
    data.editIndex = data.tableData.indexOf(row)
  }
  // data.editIndex = data.tableData.indexOf(row)
}

function handleChange(row: any) {
  if (!data.updateList.includes(row)) {
    data.updateList.push(row)
  }
}

onMounted(async () => {
  data.tableData = await queryData({
    evaluateCode: evaluateCode.value,
    evaluateUini: evaluateUini.value,
    sortFieldName: 'evaluateItemCode',
    sortType: 'asc',
    evaluateType: '1'
  })
  // data.tableData = list
  // data.pageInfo.pageNo = pageNo
  // data.pageInfo.total = count
  data.canOper = provinceCode.value === userDept.value
  countScore()
})

const query = async () => {
  const {list, count, pageNo} = await queryData({
    evaluateCode: evaluateCode.value,
    evaluateUini: evaluateUini.value,
    sortFieldName: 'evaluateItemCode',
    sortType: 'asc',
    evaluateType: '1',
    pageNo: data.pageInfo.pageNo,
    pageSize: data.pageInfo.pageSize,
  })
  data.tableData = list
  data.pageInfo.pageNo = pageNo
  data.pageInfo.total = count
}

const handleSizeChange = (size) => {
  data.pageInfo.pageSize = size
  query()
}

const handlePageChange = (newPage) => {
  data.pageInfo.pageNo = newPage
  query()
}
</script>
<style scoped>
:deep(.el-table .level1-row) {
  --el-table-tr-bg-color: rgb(248, 220, 193);
}

:deep(.el-table .level2-row) {
  /* --el-table-tr-bg-color: rgb(160, 193, 111); */
}

:deep(.el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell) {
  background-color: transparent;
}
</style>
