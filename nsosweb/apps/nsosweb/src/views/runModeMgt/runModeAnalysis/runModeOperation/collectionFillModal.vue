<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'

import { useVbenModal } from '@vben/common-ui'

import { ElMessage } from 'element-plus'

import { getColTaskDetailApi, getSelfFillListApi, getCollectionTmplField, getCollectTableFields, setCollectTable } from '#/api'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  task: {
    type: Object,
    default: null
  },
  type: {
    type: String,
    default: 'fill' // 'fill' or 'view'
  }
})


const emit = defineEmits(['update:visible', 'close', 'submit-success'])

const isFieldDetail = ref(false)
const tableHeight = ref('50vh')
const [ModalA, modalAApi] = useVbenModal({
  onCancel() {
    modalAApi.close()
  },
  onClosed() {
    closeModal()
  }
})

const tableTempl = reactive({
  currentTableName: '',
  currentTable: [],
  fillTable: []
})

const currentFieldTableId = ref('')
const submitParams = reactive({
  collectionTask: {},
  tableAndFiledList: []
})

// 监听visible变化
watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      modalAApi.open()
      initModalData()
    } else {
      modalAApi.close()
    }
  }
)

// 初始化模态框数据
async function initModalData() {
  if (!props.task) return

  isFieldDetail.value = false
  submitParams.collectionTask = props.task

  try {
    submitParams.tableAndFiledList = []
    const res = await getColTaskDetailApi({ taskId: props.task.taskId })
    submitParams.tableAndFiledList = res.tableAndFiledList
  } catch {
    console.log('系统异常')
    ElMessage.error('获取数据失败')
  }
}

// 关闭模态框
function closeModal() {
  emit('update:visible', false)
  emit('close')
  resetModalData()
}

// 重置模态框数据
function resetModalData() {
  isFieldDetail.value = false
  tableTempl.currentTable = []
  tableTempl.fillTable = []
  currentFieldTableId.value = ''
  submitParams.collectionTask = {}
  submitParams.tableAndFiledList = []
}

// 获取枚举选项
function getOptions(enumStr) {
  return enumStr ? enumStr.split(',').filter((item) => item.trim()) : []
}

// 填报/修改子表格
async function editTable(row) {
  try {
    currentFieldTableId.value = row.collectionTableInfo.id
    console.log('ssss',row)
    if (props.type === 'view') {
      tableTempl.fillTable = []
      tableTempl.currentTable = row.fieldList
      if (row.fillTable && row.fillTable.length > 0) {
        isFieldDetail.value = true
        tableTempl.fillTable = row.fillTable

      } else {
        const res = await getSelfFillListApi({
          tableId: row.collectionTableInfo.id,
          taskId: row.collectionTableInfo.taskId
        })
        isFieldDetail.value = true
        tableTempl.fillTable = transformData(res)
      }
      
    } else {
      tableTempl.currentTable = row.fieldList
      isFieldDetail.value = true
    }
  } catch (error) {}
}

// 新增行
const handleAddRow = () => {
  if (props.type === 'view') return

  tableTempl.fillTable.push({
    id: `new-row-${Date.now()}`,
    editing: true
  })
}

// 校验并过滤数据
function validateAndFilterRows(rows) {
  return rows.filter((row) => {
    const hasValue = Object.keys(row).some((key) => {
      if (key === 'id' || key === 'editing' || key === 'rowId') {
        return false
      }
      return row[key] !== '' && row[key] !== null && row[key] !== undefined
    })
    return hasValue
  })
}

// 保存子表格
function submitField() {
  if (props.type === 'view') return

  const filterTable = validateAndFilterRows(tableTempl.fillTable)

  if (filterTable.length === 0) {
    ElMessage.warning('请填写表格数据!')
  } else {
    isFieldDetail.value = false
    const index = submitParams.tableAndFiledList.findIndex((item) => item.collectionTableInfo.id === currentFieldTableId.value)
    if (index !== -1) {
      submitParams.tableAndFiledList[index].isFilled = true
      submitParams.tableAndFiledList[index].fillTable = filterTable
    }
  }
}

// 提交所有填报信息
async function submitAllForm() {
  if (props.type === 'view') return
  // 判断表格是否全部填报
  for (const fillItem of submitParams.tableAndFiledList) {
    if (!fillItem.fillTable || fillItem.fillTable.length === 0) {
      ElMessage.warning('存在未填报的表格')
      return
    }
  }
  try {
    const list = processFilledData(submitParams.tableAndFiledList)
    if (list.length === 0) {
      ElMessage.warning('请填写表格')
    } else {
      await setCollectTable(list)
      ElMessage.success('提交成功')
      emit('submit-success')
      closeModal()
    }
  } catch {
    ElMessage.error('提交失败')
  }
}

function processFilledData(dataList) {
  const submitList = []
  const filledItems = dataList.filter((item) => item.isFilled === true)

  if (filledItems.length === 0) {
    return submitList
  }

  filledItems.forEach((filledItem) => {
    const { collectionTableInfo, fillTable } = filledItem

    if (!fillTable) return
    fillTable.forEach((item, index) => {
      const collectionFillRecord = {
        fillTableId: collectionTableInfo.id,
        fillTaskId: collectionTableInfo.taskId,
        rowNumber: index,
        ...(item.rowId && { id: item.rowId })
      }

      const collectionFillData = []
      for (const [fieldId, value] of Object.entries(item)) {
        if (['editing', 'id'].includes(fieldId)) continue
        if (value !== '' && value !== null && value !== undefined) {
          collectionFillData.push({
            fillTaskId: collectionTableInfo.taskId,
            value,
            fieldId
          })
        }
      }

      if (collectionFillData.length > 0) {
        submitList.push({
          collectionFillRecord,
          collectionFillData
        })
      }
    })
  })
  return submitList
}

function transformData(originalData) {
  const result = []
  const withRowNumber = []
  const withoutRowNumber = []
  originalData.forEach((item) => {
    if (item.collectionFillRecord.rowNumber === null) {
      withoutRowNumber.push(item)
    } else {
      withRowNumber.push(item)
    }
  })

  withRowNumber.sort((a, b) => a.collectionFillRecord.rowNumber - b.collectionFillRecord.rowNumber)
  const sortedItems = [...withRowNumber, ...withoutRowNumber]
  sortedItems.forEach((item) => {
    const rowData = {}
    item.collectionFillData.forEach((data) => {
      rowData[data.fieldId] = data.value
      if (item.collectionFillRecord.id) {
        rowData.rowId = item.collectionFillRecord.id
      }
    })
    result.push(rowData)
  })
  return result
}

// 更新表格高度
function handleFullscreenChange(isFullscreen) {
  tableHeight.value = isFullscreen ? '85vh' : '50vh'
}
</script>

<template>
  <ModalA class="custom-modal-b w-[1300px]" :title="type === 'fill' ? '收资填报' : '收资查看'" :footer="false" :close-on-click-modal="false" @fullscreen-change="handleFullscreenChange">
    <div v-if="!isFieldDetail" style="padding: 20px">
      <el-table :data="submitParams.tableAndFiledList" border stripe :height="tableHeight">
        <el-table-column type="index" align="center" label="#" />
        <el-table-column prop="collectionTableInfo.tableName" align="center" label="表格名称" />
        <el-table-column label="操作" align="center" v-if="type === 'fill'">
          <template #default="scope">
            <el-button v-if="scope.row.isFilled" type="warning" link @click="editTable(scope.row)">修改</el-button>
            <el-button v-else type="primary" link @click="editTable(scope.row)">填报</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" v-else>
          <template #default="scope">
            <el-button type="warning" link @click="editTable(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else style="padding: 20px">
      <el-button v-if="type === 'fill'" type="primary" @click="handleAddRow" style="margin-bottom: 15px"> 新增 </el-button>
      <el-table :data="tableTempl.fillTable" border stripe style="width: 100%" :height="tableHeight" row-key="id">
        <el-table-column type="index" width="60" align="center" />
        <el-table-column v-for="(col, index) in tableTempl.currentTable" :key="index" :prop="col.id" :label="col.fieldNameFirst" align="center">
          <template #default="scope">
            <el-input v-if="col.fieldType === '1' && type === 'fill'" v-model="scope.row[col.id]" :disabled="!scope.row.editing" clearable />
            <el-input v-if="col.fieldType === '1' && type === 'view'" :model-value="scope.row[col.id]" disabled />
            <el-select v-if="col.fieldType === '3' && type === 'fill'" v-model="scope.row[col.id]" :disabled="!scope.row.editing">
              <el-option v-for="item in getOptions(col.enumContents)" :key="item" :label="item" :value="item" />
            </el-select>
            <el-select v-if="col.fieldType === '3' && type === 'view'" :model-value="scope.row[col.id]" disabled>
              <el-option v-for="item in getOptions(col.enumContents)" :key="item" :label="item" :value="item" />
            </el-select>
            <el-date-picker v-if="col.fieldType === '2' && type === 'fill'" v-model="scope.row[col.id]" :disabled="!scope.row.editing" type="datetime" placeholder="请选择时间" format="YYYY-MM-DD HH:mm:ss" />
            <el-date-picker v-if="col.fieldType === '2' && type === 'view'" :model-value="scope.row[col.id]" disabled type="datetime" format="YYYY-MM-DD HH:mm:ss" />
          </template>
        </el-table-column>
      </el-table>
    </div>

    <template #footer>
      <div v-if="!isFieldDetail && type === 'fill'" style="margin-top: 10px; display: flex; justify-content: flex-end">
        <el-button @click="closeModal">取消</el-button>
        <el-button type="primary" @click="submitAllForm()">保存</el-button>
      </div>
      <div v-else-if="isFieldDetail && type === 'fill'" style="margin-top: 10px; display: flex; justify-content: flex-end">
        <el-button @click="isFieldDetail = false">返回</el-button>
        <el-button type="primary" @click="submitField()">保存</el-button>
      </div>
      <div v-else style="margin-top: 10px; display: flex; justify-content: flex-end">
        <el-button @click="closeModal()">关闭</el-button>
        <el-button v-if="isFieldDetail" type="primary" @click="isFieldDetail = false">返回</el-button>
      </div>
    </template>
  </ModalA>
</template>

<style scoped>
/* 可以添加子组件特定的样式 */
</style>
