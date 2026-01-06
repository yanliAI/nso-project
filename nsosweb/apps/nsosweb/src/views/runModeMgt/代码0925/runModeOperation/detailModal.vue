<script lang="ts" setup>
import { reactive, ref } from 'vue'

import { useVbenModal } from '@vben/common-ui'

import axios from 'axios'
import { ElMessage } from 'element-plus'

import { getColTaskDetailApi, insertCollectionTaskApi } from '#/api'
const props = defineProps({
  dateType: {
    type: String,
    default: ''
  }
})

// const ruleForm = reactive({
//    'collectionTask.taskName': [{ required: true, message: '请填写收资名称', trigger: 'blur' }],
// })

const emit = defineEmits(['refresh'])
// 枚举值更新
const currentValues = ref([])
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

const isDetailEdit = ref(false)
const currentFieldTableId = ref('')
const loading = ref(false)
const fileList = ref([])
const tableHeight = ref('50vh')

async function open(row) {
  modalAApi.open()
  detailParams.collectionTask = row
  isDetailEdit.value = false
  try {
    detailParams.tableAndFiledList = []
    const res = await getColTaskDetailApi({ taskId: row.id })
    detailParams.tableAndFiledList = res.tableAndFiledList
  } catch {
    console.log('系统异常')
  }
}

function close() {
  modalAApi.close()
  detailParams.collectionTask = { taskName: '' }
  detailParams.tableAndFiledList = []
  isDetailEdit.value = false
}

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
async function editTable(row) {
  currentFieldTableId.value = row.collectionTableInfo.tableId
  if (row.fieldList && row.fieldList.length > 0) {
    tableTempl.currentTable = row.fieldList
    isDetailEdit.value = true
  } else {
    try {
      row.fieldList = [];
      isDetailEdit.value = true;
    } catch {}
  }
}

// 删除表格
function deleteTable(row) {
  const index = detailParams.tableAndFiledList.findIndex((item) => item.collectionTableInfo.tableId === row.collectionTableInfo.tableId)
  if (index !== -1) {
    detailParams.tableAndFiledList.splice(index, 1)
  }
}

/**
 * 表格导入
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

// 获取用户token
function formatToken(token: string) {
  return token ? `Bearer ${token}` : null
}

// 添加字段
function addFiled() {
  const newNode = {
    id: `field_${tableTempl.currentTable.length}`,
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
    isNew: true
  }
  tableTempl.currentTable.push(newNode)
}

// 编辑字段行
function editRow(row) {
  row.originalValues = {
    fieldNameFirst: row.fieldNameFirst,
    fieldNameSecond: row.fieldNameSecond,
    fieldType: row.fieldType,
    enumContents: row.enumContents,
    des: row.des
  }
  row.isNew = false
  row.editing = true
}

// 保存字段行
function saveRow(row) {
  if (row.fieldType === '3' && !row.enumContents?.trim()) {
    ElMessage.warning('枚举值选项不允许为空')
    return
  }
  if (!row.fieldNameFirst) {
    ElMessage.warning('填报字段不允许为空')
    return
  }
  row.editing = false
  row.isNew = false
  delete row.originalValues
}

// 取消编辑字段
function cancelEdit(row, index) {
  if (row.isNew) {
    tableTempl.currentTable.splice(index, 1)
  } else {
    if (row.originalValues) {
      Object.assign(row, row.originalValues)
      delete row.originalValues
    }
    row.editing = false
  }
}

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
}

// 新增标签
function onConfirm(row) {
  if (optionName.value) {
    const curList = getOptions(row.enumContents)
    curList.push(optionName.value)
    row.enumContents = curList.join(',')
    clear()
  }
}

const clear = () => {
  optionName.value = ''
  isAdding.value = false
}

// 提交所有字段修改
function submitField() {
  const editingRow = tableTempl.currentTable.find((row) => row.editing)
  if (editingRow) {
    ElMessage.warning('请先保存正在编辑的行')
    return
  }
  const foundItem = detailParams.tableAndFiledList.find((item) => item.collectionTableInfo?.tableId === currentFieldTableId.value)
  foundItem.fieldList = tableTempl.currentTable
  isDetailEdit.value = false
  ElMessage.success('保存成功')
}

// 提交详情表单修改
async function submitDetailForm() {
  try {
    if (detailParams.collectionTask.taskName === '') {
      ElMessage.warning('收资名称不允许为空')
      return
    }
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

// 提交表单数据校验
function validateDetailParams(detailParams) {
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
  <ModalA class="custom-modal-b w-[1300px]" title="查看详情" :footer="false" :close-on-click-modal="false" @fullscreen-change="handleFullscreenChange">
    <div v-if="!isDetailEdit">
      <el-form ref="queryForm" :model="detailParams" label-width="auto" :rule="ruleForm" style="margin: 10px 0 0 20px" v-loading="loading" element-loading-text="上传中...">
        <el-form-item label="收资名称:" prop="collectionTask.taskName" style="width: 100%" required>
          <el-input v-model="detailParams.collectionTask.taskName" placeholder="请输入收资名称" clearable  :disabled="detailParams.collectionTask.status !== '0'" />
        </el-form-item>
        <el-form-item label="表格名称:" style="width: 100%" required>
          <el-table :data="detailParams.tableAndFiledList" border stripe :height="tableHeight">
            <el-table-column type="index" />
            <el-table-column prop="collectionTableInfo.tableName" align="center" label="表格名称">
              <template #default="scope">
                <el-input v-if="scope.row.collectionTableInfo?.isEditing" v-model="scope.row.collectionTableInfo.tableName" placeholder="请输入表格名称" />
                <span v-else>{{ scope.row.collectionTableInfo.tableName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" v-if="detailParams.collectionTask.status === '0'">
              <template #default="scope">
                <div v-if="scope.row.collectionTableInfo.isEditing">
                  <el-button type="danger" link @click="cancelAdd(scope.row, scope.$index)">取消</el-button>
                  <el-button type="success" link @click="saveTable(scope.row)">保存</el-button>
                </div>
                <div v-else>
                  <el-space :size="8">
                    <el-button type="primary" link @click="editTable(scope.row)">编辑</el-button>
                    <el-upload v-model:file-list="fileList" ref="upload" :limit="1" :before-upload="beforeUpload" :show-file-list="false" :http-request="(options) => uploadFile(options, scope.row, scope.$index)">
                      <el-button type="primary" link>导入</el-button>
                    </el-upload>
                    <el-button type="danger" link @click="deleteTable(scope.row, scope.$index)">删除</el-button>
                  </el-space>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" v-else>
              <template #default="scope">
                <el-button type="primary" link @click="editTable(scope.row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary" style="margin-top: 10px" @click="addTable()" v-if="detailParams.collectionTask.status === '0'"> 添加表格 </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-else>
      <el-button type="primary" @click="addFiled()" style="margin: 20px 0 10px 0" v-if="detailParams.collectionTask.status === '0'"> 新增字段 </el-button>
      <el-table :data="tableTempl.currentTable" border stripe :height="tableHeight">
        <el-table-column type="index" />
        <el-table-column prop="fieldNameFirst" align="center" label="填报字段">
          <template #default="scope">
            <el-input v-if="scope.row.editing" v-model="scope.row.fieldNameFirst" placeholder="请输入填报字段" />
            <span v-else>{{ scope.row.fieldNameFirst }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="fieldNameSecond" align="center" label="填报要求">
          <template #default="scope">
            <el-input v-if="scope.row.editing" v-model="scope.row.fieldNameSecond" placeholder="请输入填报要求" />
            <span v-else>{{ scope.row.fieldNameSecond }}</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="fieldType" align="center" label="填报类型">
          <template #default="scope">
            <el-select v-model="scope.row.fieldType" v-if="scope.row.editing">
              <el-option value="1" label="文本" />
              <el-option value="2" label="日期" />
              <el-option value="3" label="枚举" />
            </el-select>
            <span v-else>{{ scope.row.fieldType === '1' ? '文本' : scope.row.fieldType === '2' ? '日期' : '枚举' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="enumContents" label="枚举值">
          <template #default="scope">
            <el-select v-model="scope.row.enumContents" placeholder="查看" v-if="scope.row.editing && scope.row.fieldType === '3'">
              <el-option v-for="item in getOptions(scope.row.enumContents)" :key="item" :label="item" :value="item">
                <div style="display: flex; justify-content: space-between" @click.stop="() => {}">
                  <span>{{ item }}</span>
                  <span><el-icon @click="removeTag(scope.row, item)"> <Close /> </el-icon></span>
                </div>
              </el-option>
              <template #footer>
                <el-button v-if="!isAdding" text bg size="small" @click="isAdding = true"> 新增 </el-button>
                <template v-else>
                  <el-input v-model="optionName" size="small" style="margin-bottom: 10px" />
                  <el-button size="small" @click="clear">取消</el-button>
                  <el-button type="primary" size="small" @click="onConfirm(scope.row)"> 确认 </el-button>
                </template>
              </template>
            </el-select>
            <span v-else>{{ scope.row.enumContents === null ? '无' : scope.row.enumContents }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="des" align="center" label="说明">
          <template #default="scope">
            <el-input v-if="scope.row.editing" v-model="scope.row.des" placeholder="请输入说明" />
            <span v-else>{{ scope.row.des || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150" v-if="detailParams.collectionTask.status === '0'">
          <template #default="scope">
            <template v-if="scope.row.editing">
              <el-button type="info" size="small" link @click="cancelEdit(scope.row, scope.$index)">取消</el-button>
              <el-button type="success" size="small" link @click="saveRow(scope.row)">保存</el-button>
            </template>
            <template v-else>
              <el-button type="primary" size="small" link @click="editRow(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" link @click="deleteRow(scope.$index)">删除</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <template #footer v-if="!isDetailEdit">
      <el-button @click="close()">取消</el-button>
      <el-button type="primary" @click="submitDetailForm">确定</el-button>
    </template>
    <template #footer v-else>
      <el-button @click="isDetailEdit = false">取消</el-button>
      <el-button type="primary" @click="submitField()">确定</el-button>
    </template>
  </ModalA>
</template>

<style lang="less" scoped>
/* 样式可以根据需要添加 */
</style>
