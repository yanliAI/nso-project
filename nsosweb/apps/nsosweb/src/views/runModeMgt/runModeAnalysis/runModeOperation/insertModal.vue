<script lang="ts" setup>
import { reactive, ref } from 'vue'

import { useVbenModal } from '@vben/common-ui'
import { useAccessStore } from '@vben/stores'

import axios from 'axios'
import { ElMessage } from 'element-plus'

import { getCollectionTasksApi, getCollectionTmplDetail, getColTaskDetailApi, insertCollectionTaskApi, getCollectionTmplField, getHistoryTask, saveCollectionTmplDetail } from '#/api'

const props = defineProps({
  dateType: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['refresh'])
const accessStore = useAccessStore()
const [ModalA, modalAApi] = useVbenModal({
  onCancel() {
    modalAApi.close()
  }
})

const detailParams = reactive({
  collectionTask: { taskName: '' },
  tableAndFiledList: []
})

const tableTempl = reactive({
  currentTableName: '',
  currentTableId: '',
  currentTable: []
})
// 枚举值更新
const currentValues = ref([])

const isDetailEdit = ref(false)
const currentFieldTableId = ref('')
const loading = ref(false)
const fileList = ref([])
const history = ref([])
const historyVisible = ref(false)
const tableHeight = ref('50vh')

const open = () => {
  modalAApi.open()
  Object.assign(detailParams, {
    collectionTask: { taskName: '' },
    tableAndFiledList: []
  })
}

const close = () => {
  modalAApi.close()
  detailParams.collectionTask = { taskName: '' }
  detailParams.tableAndFiledList = []
  isDetailEdit.value = false
}

/**
 * 导入历史收资方法
 */

// 获取历史收资
async function getHistory() {
  historyVisible.value = true
  try {
    const res = await getCollectionTasksApi({
      pageNo:1,
      pageSize:10,
    })
    history.value = res.list
  } catch {}
}

// 启用历史收资
async function selectHistory(val) {
  detailParams.collectionTask = val
  historyVisible.value = false
  try {
    // const res = await getCollectionTmplDetail({ taskId: val.id })
    detailParams.tableAndFiledList = []
    const res = await getColTaskDetailApi({taskId:val.id})
    detailParams.tableAndFiledList = res.tableAndFiledList;
    // for (const item of res.list) {
    //   try {
    //     const fieldRes = await getCollectionTmplField({ tableId: item.id })
    //     detailParams.tableAndFiledList.push({
    //       collectionTableInfo: item,
    //       fieldList: fieldRes.list || []
    //     })
    //   } catch (error) {
    //     console.error('获取字段列表失败:', error)
    //     detailParams.tableAndFiledList.push({
    //       collectionTableInfo: item,
    //       fieldList: []
    //     })
    //   }
    // }
  } catch {
    console.log('系统异常')
  }
}


/**
 * 更新收资表格方法
 */

// 添加表格
function addTable() {
  const id = Date.now()
  const newTable = {
    collectionTableInfo: {
      tableId: id,
      tableName: '',
      isEditing: true
    },
    fieldList: []
  }
  detailParams.tableAndFiledList.push(newTable)
}

// 保存表格
function saveTable(row) {
  if (!row.collectionTableInfo.tableName) {
    ElMessage.warning('请填写内容!')
    return
  }
  row.collectionTableInfo.isEditing = false
}

// 取消添加表格
function cancelAdd(row, index) {
  detailParams.tableAndFiledList.splice(index, 1)
}

// 编辑表格
async function editTable1(row) {
  currentFieldTableId.value = row.collectionTableInfo.tableId
  tableTempl.currentTable = row.fieldList
  isDetailEdit.value = true
}

// 删除表格
function deleteTable(row) {
  const index = detailParams.tableAndFiledList.findIndex((item) => item.collectionTableInfo.tableId === row.collectionTableInfo.tableId)
  if (index !== -1) {
    detailParams.tableAndFiledList.splice(index, 1)
  }
}

/**
 * 导入excel
 * @description 两种导入方式 1. 全量导入，根据上传excel中sheet数量自动创建表格记录，导入字段。2 单表导入，创建表格记录后，导入
 */

// 上传前校验
function beforeUpload(file: FileItem) {
  fileList.value = []
  // 获取文件后缀
  const fileExtension = file.name.split('.').pop().toLowerCase()
  // 检查文件类型和后缀
  const isValidType = ['.xls', '.xlsx'].includes(`.${fileExtension}`)

  if (!isValidType) {
    fileList.value = []
    ElMessage.warning('不支持上传该文件格式，请上传.xls或.xlsx格式文件')
    return false // 阻止上传
  }
  return true // 允许上传
}

// 单表导入
async function uploadFile(options, row, index) {
  const file = options.file // 直接使用 options.file 获取上传的文件
  if (!file) {
    ElMessage.warning('请选择上传文件！')
    return
  }

  const fileData = new FormData()
  fileData.append('file', file) // 直接使用 file，无需 file.name

  loading.value = true

  try {
    const res = await axios({
      url: `${import.meta.env.VITE_NSOSFS}/collectionBase/importTable`,
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: formatToken(accessStore.accessToken)
      },
      data: fileData
    })

    // 只取第一个sheet表
    row.fieldList = res.data.data[0].fieldList
    row.fieldList.forEach((item, index) => {
      item.tableId = row.collectionTableInfo.tableId
    })

    fileList.value = [] // 清空文件列表
    loading.value = false
    ElMessage.success('导入成功!')
  } catch (error) {
    ElMessage.error('上传失败，请重试！')
    loading.value = false
  }
}

// 全量导入
async function loadExcel(options) {
  const file = options.file
  if (!file) {
    ElMessage.warning('请选择上传文件！')
    return
  }

  const fileData = new FormData()
  fileData.append('file', file)

  loading.value = true

  try {
    const res = await axios({
      url: `${import.meta.env.VITE_NSOSFS}/collectionBase/importTable`,
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: formatToken(accessStore.accessToken)
      },
      data: fileData
    })
    res.data.data.forEach((item) => {
      const id = Date.now()
      const newTable = {
        collectionTableInfo: {
          tableId: id,
          tableName: item.collectionTable.tableName,
          isEditing: false
        },
        fieldList: item.fieldList
      }
      detailParams.tableAndFiledList.push(newTable)
    })
    // row.fieldList = res.data.fieldList
    // row.fieldList.forEach((item, index) => {
    //   item.tableId = row.collectionTableInfo.tableId
    // })

    fileList.value = [] // 清空文件列表
    loading.value = false
  } catch (error) {
    ElMessage.error('上传失败，请重试！')
    loading.value = false
  }
}

// 获取用户token
function formatToken(token: string) {
  return token ? `Bearer ${token}` : null
}

/**
 * 编辑表格字段方法
 */

// 添加字段
function addFiled() {
  const newNode = {
    creatorId: null,
    createTime: null,
    updateTime: null,
    updatorId: null,
    fieldNameFirst: '',
    fieldNameSecond: '',
    fieldType: '1',
    tableId: currentFieldTableId.value,
    parentFieldId: null,
    level: 2,
    sort: tableTempl.currentTable.length + 1,
    des: '',
    provinceCode: null,
    bureauCode: null,
    enumContents: null,
    editing: true,
    error1: null,
    error2: null
  }
  tableTempl.currentTable.push(newNode)
}

// 字段单行校验
function filedValidate(row) {
  // 先清空之前的错误
  row.error1 = null
  row.error2 = null
  if (row.fieldType === '3' && !row.enumContents?.trim()) {
    row.error2 = '枚举值选项不允许为空'
  }
  if (!row.fieldNameFirst) {
    row.error1 = '填报字段不允许为空'
  }
}

// // 编辑字段行
// function editRow(row) {
//   row.originalValues = {
//     fieldNameFirst: row.fieldNameFirst,
//     fieldNameSecond: row.fieldNameSecond,
//     des: row.des
//   }
//   row.editing = true
// }

// // 保存字段行
// function saveRow(row) {
//   if (row.fieldType === '3' && !row.enumContents?.trim()) {
//     ElMessage.warning('枚举值选项不允许为空')
//     return
//   }
//   if (!row.fieldNameFirst) {
//     ElMessage.warning('填报字段不允许为空')
//     return
//   }
//   row.editing = false
//   delete row.originalValues
// }

// // 取消编辑字段
// function cancelEdit(row, index) {
//   if (row.isNew) {
//     tableTempl.currentTable.splice(index, 1)
//   } else {
//     if (row.originalValues) {
//       Object.assign(row, row.originalValues)
//       delete row.originalValues
//     }
//     row.editing = false
//   }
// }

// 删除字段
function deleteRow(index) {
  tableTempl.currentTable.splice(index, 1)
  ElMessage.success('删除成功')
}

/**
 * 编辑字段枚举值
 */

// 更新枚举值
function getOptions(enumStr) {
  return enumStr ? enumStr.split(',').filter((item) => item.trim()) : []
}
const isAdding = ref(false)
const optionName = ref('')

// 处理删除标签
function removeTag(row, removedTag) {
  const curList = getOptions(row.enumContents)
  const index = curList.indexOf(removedTag)
  if (index !== -1) {
    curList.splice(index, 1)
  }
  row.enumContents = curList.join(',')
  currentValues.value = ''
  filedValidate(row)
}

// 新增标签
function onConfirm(row) {
  if (optionName.value) {
    const curList = getOptions(row.enumContents)
    curList.push(optionName.value)
    row.enumContents = curList.join(',')
    clear()
  }
  filedValidate(row)
}

function clear() {
  optionName.value = ''
  isAdding.value = false
}


/**
 * 收资任务提交
 */

// 提交所有字段修改
function submitField() {
  let hasError = false
  // 校验字段数据
  for (const row of tableTempl.currentTable) {
    filedValidate(row)
    if (row.error1 || row.error2) {
      hasError = true
    }
  }
  if (hasError) {
    ElMessage.warning('请修正表单中的错误')
    return
  }

  const foundItem = detailParams.tableAndFiledList.find((item) => item.collectionTableInfo?.tableId === currentFieldTableId.value)
  foundItem.fieldList = tableTempl.currentTable
  isDetailEdit.value = false
  ElMessage.success('保存成功')
}

// 提交收资任务
async function submitInsertForm() {
  try {
    delete detailParams.collectionTask.id
    detailParams.collectionTask.type = props.dateType
    const validationResult = validateDetailParams(detailParams)
    if (!validationResult.valid) {
      ElMessage.warning(validationResult.message)
      return
    }
    await insertCollectionTaskApi(detailParams)
    ElMessage.success('提交成功')
    close()
    emit('refresh')
  } catch {}
}

// 收资任务信息提交校验
function validateDetailParams(detailParams: any) {
  // 检查收资任务名称是否为空
  if (detailParams.collectionTask.taskName === '' ) {
    return {
      valid: false,
      message: '收资任务名称不允许为空!'
    }
  }
  // 检查 tableAndFiledList 是否为空
  if (!detailParams.tableAndFiledList || detailParams.tableAndFiledList.length === 0) {
    return {
      valid: false,
      message: '请上传或编辑模板!'
    }
  }

  for (const item of detailParams.tableAndFiledList) {
    if (item.collectionTableInfo?.isEditing === true) {
      return {
        valid: false,
        message: `表格${item.collectionTableInfo.tableName || ''}处于编辑状态，请先保存`
      }
    }
    if (!item.fieldList || item.fieldList.length === 0) {
      return {
        valid: false,
        message: `表格${item.collectionTableInfo.tableName || ''}的模板信息不能为空`
      }
    }
  }

  // 所有检查通过
  return {
    valid: true,
    message: '验证通过'
  }
}

// 返回新增
function returnInsert() {
  isDetailEdit.value = false
}

// 更新表格高度
function handleFullscreenChange(isFullscreen) {
  tableHeight.value = isFullscreen ? '80vh' : '50vh'
}

defineExpose({
  open,
  close
})
</script>

<template>
  <div>
    <ModalA class="custom-modal-b w-[1300px]" title="新增收资" :footer="false" :close-on-click-modal="false" @fullscreen-change="handleFullscreenChange">
      <div v-if="!isDetailEdit">
        <el-form ref="queryForm" :model="detailParams" label-width="auto" style="margin: 10px 0 0 20px" v-loading="loading" element-loading-text="上传中...">
          <el-form-item label="创建收资模板:" style="width: 100%" required>
            <el-button type="primary" @click="getHistory" style="margin-right: 20px">导入历史收资</el-button>
            <el-upload v-model:file-list="fileList" ref="upload" :limit="1" :before-upload="beforeUpload" :show-file-list="false" :http-request="(options) => loadExcel(options)">
              <el-button type="primary">导入</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="收资名称:" style="width: 100%" required>
            <el-input v-model="detailParams.collectionTask.taskName" placeholder="请输入收资名称" clearable />
          </el-form-item>
          <el-form-item label="表格名称:" style="width: 100%" required>
            <el-table :data="detailParams.tableAndFiledList" border stripe :height="tableHeight">
              <el-table-column type="index" />
              <el-table-column prop="collectionTableInfo.tableName" align="center" label="表格名称">
                <template #default="scope">
                  <el-input v-if="scope.row.collectionTableInfo.isEditing" v-model="scope.row.collectionTableInfo.tableName" placeholder="请输入表格名称" />
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template #default="scope">
                  <div v-if="scope.row.collectionTableInfo.isEditing">
                    <el-button type="success" link @click="saveTable(scope.row)">保存</el-button>
                    <el-button type="danger" link @click="cancelAdd(scope.row, scope.$index)">取消</el-button>
                  </div>
                  <div v-else>
                    <el-space :size="8">
                      <el-button type="primary" link @click="editTable1(scope.row)">编辑</el-button>
                      <el-upload v-model:file-list="fileList" ref="upload" :limit="1" :before-upload="beforeUpload" :show-file-list="false" :http-request="(options) => uploadFile(options, scope.row, scope.$index)">
                        <el-button type="primary" link>导入</el-button>
                      </el-upload>
                      <el-button type="danger" link @click="deleteTable(scope.row)">删除</el-button>
                    </el-space>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <el-button type="primary" style="margin-top: 10px" @click="addTable()">添加表格</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-else>
        <el-button type="primary" @click="addFiled()" style="margin: 20px 0 10px 0">新增字段</el-button>
        <el-table :data="tableTempl.currentTable" border stripe :height="tableHeight">
          <el-table-column type="index" />
          <el-table-column prop="fieldNameFirst" align="center" label="填报字段">
            <template #default="scope">
              <el-input v-model="scope.row.fieldNameFirst" @blur="filedValidate(scope.row)" placeholder="请输入填报字段" />
              <div v-if="scope.row.error1" class="error-message">{{ scope.row.error1 }}</div>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="fieldNameSecond" align="center" label="填报要求">
            <template #default="scope">
              <el-input v-model="scope.row.fieldNameSecond" placeholder="请输入填报要求" />
            </template>
          </el-table-column> -->
          <el-table-column prop="fieldType" align="center" label="填报类型">
            <template #default="scope">
              <el-select v-model="scope.row.fieldType" @change="filedValidate(scope.row)">
                <el-option value="1" label="文本" />
                <el-option value="2" label="日期" />
                <el-option value="3" label="枚举" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="enumContents" label="枚举值">
            <template #default="scope">
              <el-select v-model="scope.row.enumContents" placeholder="查看" v-if="scope.row.fieldType === '3'" @change="filedValidate(scope.row)">
                <el-option v-for="item in getOptions(scope.row.enumContents)" :key="item" :label="item" :value="item">
                  <div style="display: flex; justify-content: space-between" @click.stop="() => {}">
                    <span>{{ item }}</span>
                    <span
                      ><el-icon @click="removeTag(scope.row, item)"> <Close /> </el-icon
                    ></span>
                  </div>
                </el-option>
                <template #footer>
                  <el-button v-if="!isAdding" text bg size="small" @click="isAdding = true"> 新增 </el-button>
                  <template v-else>
                    <el-input v-model="optionName" size="small" style="margin-bottom: 10px" />
                    <el-button type="primary" size="small" @click="onConfirm(scope.row)"> 确认 </el-button>
                    <el-button size="small" @click="clear">取消</el-button>
                  </template>
                </template>
              </el-select>
              <div v-if="scope.row.error2" class="error-message">{{ scope.row.error2 }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="des" align="center" label="说明">
            <template #default="scope">
              <el-input v-if="scope.row.editing" v-model="scope.row.des" placeholder="请输入说明" />
              <span v-else>{{ scope.row.des || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150">
            <template #default="scope">
              <el-button type="danger" size="small" link @click="deleteRow(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template #footer v-if="!isDetailEdit">
        <el-button @click="close()">取消</el-button>
        <el-button type="primary" @click="submitInsertForm">确定</el-button>
      </template>
      <template #footer v-else>
        <el-button @click="returnInsert()">取消</el-button>
        <el-button type="primary" @click="submitField()">确定</el-button>
      </template>
    </ModalA>
    <el-dialog v-model="historyVisible" title="历史收资" width="1200" class="system-detail-dialog">
      <el-table ref="tab" :data="history" border stripe height="400px">
        <el-table-column type="index" />
        <el-table-column prop="taskName" align="center" label="收资名称" />
        <el-table-column prop="creatorName" align="center" label="创建人" />
        <el-table-column prop="createTime" align="center" label="创建时间" />
        <el-table-column prop="tableCount" align="center" label="表格数量" />
        <el-table-column align="center" label="状态">
          <template #default="scope">
            <el-tag type="danger" v-if="scope.row.status === '0'">待发布</el-tag>
            <el-tag type="success" v-if="scope.row.status === '1'">收资中</el-tag>
            <el-tag type="success" v-if="scope.row.status === '2'">收资完成</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="300px">
          <template #default="scope">
            <el-button type="primary" link @click="selectHistory(scope.row)">启用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
/* 样式可以根据需要添加 */
.error-message {
  color: rgb(248, 64, 64);
  font-size: 12px;
}
</style>
