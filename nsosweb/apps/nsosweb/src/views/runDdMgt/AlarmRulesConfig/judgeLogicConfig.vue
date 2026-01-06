<template>
  <Page auto-content-height>
    <el-container class="h-full bg-white">
      <el-aside width="200px">
        <el-tree style="max-width: 600px" :data="data.treeData" :default-expanded-keys="data.defaultExpandedKeys" node-key="label" @node-click="handleNodeClick" />
      </el-aside>
      <el-main>
        <el-container class="h-full bg-white">
          <el-header height="45px">
            <el-form ref="logicForm" :inline="true" :model="data.form" label-position="right" class="demo-form-inline">
              <el-row>
                <el-col :span="6"
                  ><el-form-item label="关键字:" prop="alarmKeywords"> <el-input v-model="data.form.alarmKeywords" clearable /> </el-form-item
                ></el-col>
                <el-col :span="8"
                  ><el-form-item>
                    <el-button type="primary" @click="add">新增</el-button>
                    <el-button type="primary" @click="del">删除</el-button>
                    <el-button type="primary" @click="query">查询</el-button>
                    <el-button type="primary" @click="save">保存</el-button>
                    <el-button type="info" @click="reset">重置</el-button>
                  </el-form-item></el-col
                >
              </el-row>
            </el-form>
          </el-header>
          <el-main style="height: calc(100% - 90px)">
            <el-table border ref="logicTable" :data="data.tableData" style="height: 100%" @row-dblclick="onClickEdit">
              <el-table-column type="index" />
              <el-table-column type="selection" />
              <el-table-column prop="alarmActionType" label="告警动作类型">
                <!-- <template #default="scope">
              <span v-show="scope.$index !== data.editIndex">
                {{ scope.row.alarmActionType }}
              </span>
              <el-input
                v-show="scope.$index === data.editIndex"
                v-model="scope.row.alarmActionType"
              >
              </el-input>
            </template> -->
              </el-table-column>
              <el-table-column prop="resource" label="资源">
                <template #default="scope">
                  <span v-show="scope.$index !== data.editIndex">
                    {{ scope.row.resource }}
                  </span>
                  <el-input v-show="scope.$index === data.editIndex" v-model="scope.row.resource" @change="handleChange(scope.row)"> </el-input>
                </template>
              </el-table-column>
              <el-table-column prop="leftParenthesis" label="左括号">
                <template #default="scope">
                  <span v-show="scope.$index !== data.editIndex">
                    {{ scope.row.leftParenthesis }}
                  </span>
                  <el-select v-if="scope.$index === data.editIndex" v-model="scope.row.leftParenthesis" @change="handleChange(scope.row)" clearable>
                    <el-option v-for="item in data.opt1" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="alarmKeywords" label="告警关键字">
                <template #default="scope">
                  <span v-show="scope.$index !== data.editIndex">
                    {{ scope.row.alarmKeywords }}
                  </span>
                  <!-- <el-input
                    v-show="scope.$index === data.editIndex"
                    v-model="scope.row.alarmKeywords"
                    @change="handleChange(scope.row)"
                  > 
                  </el-input>-->
                  <el-select v-if="scope.$index === data.editIndex" v-model="scope.row.alarmKeywords" @change="handleChange(scope.row)" clearable>
                    <el-option label="攻击次数" value="攻击次数" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="arithmeticOperator" label="算术运算符">
                <template #default="scope">
                  <div v-show="scope.$index !== data.editIndex">
                    <span v-if="scope.row.arithmeticOperator === '>='"> 大于等于 </span>
                    <span v-if="scope.row.arithmeticOperator === '>'"> 大于 </span>
                    <span v-if="scope.row.arithmeticOperator === '='"> 等于 </span>
                    <span v-if="scope.row.arithmeticOperator === '<'"> 小于 </span>
                    <span v-if="scope.row.arithmeticOperator === '<='"> 小于等于 </span>
                  </div>
                  <el-select v-if="scope.$index === data.editIndex" v-model="scope.row.arithmeticOperator" @change="handleChange(scope.row)" clearable>
                    <el-option v-for="item in data.opt2" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="amount" label="值">
                <template #default="scope">
                  <span v-show="scope.$index !== data.editIndex">
                    {{ scope.row.amount }}
                  </span>
                  <el-input v-show="scope.$index === data.editIndex" v-model="scope.row.amount" @change="handleChange(scope.row)"> </el-input>
                </template>
              </el-table-column>
              <el-table-column prop="rightParenthesis" label="右括号">
                <template #default="scope">
                  <span v-show="scope.$index !== data.editIndex">
                    {{ scope.row.rightParenthesis }}
                  </span>
                  <el-select v-if="scope.$index === data.editIndex" v-model="scope.row.rightParenthesis" @change="handleChange(scope.row)" clearable>
                    <el-option v-for="item in data.opt3" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="logicOperator" label="逻辑运算符">
                <template #default="scope">
                  <span v-show="scope.$index !== data.editIndex">
                    {{ scope.row.logicOperator === 'and' ? '并且' : scope.row.logicOperator === 'or' ? '或者' : '' }}
                  </span>
                  <el-select v-if="scope.$index === data.editIndex" v-model="scope.row.logicOperator" @change="handleChange(scope.row)" clearable>
                    <el-option v-for="item in data.opt4" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="updatorId" label="最后修改人" /> -->
              <el-table-column prop="updateTime" label="最后修改时间" :formatter="formatTimestamp" width="160px" />
            </el-table>
          </el-main>
          <el-footer height="45px"><el-pagination v-model:current-page="data.pageInfo.pageNo" v-model:page-size="data.pageInfo.pageSize" :total="data.pageInfo.total" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="currentChange"></el-pagination></el-footer>
        </el-container>
      </el-main>
    </el-container>
  </Page>
</template>

<script lang="ts" setup>
import { ElRow, ElCol, ElTable, ElTableColumn, ElFormItem, ElForm, ElInput, ElButton, ElPagination, ElMessage, ElMessageBox, ElContainer, ElAside, ElMain, ElTree, ElSelect, ElOption, type FormInstance } from 'element-plus'
import { reactive, ref, onMounted, nextTick } from 'vue'
import { requestClient } from '#/api/request'

onMounted(() => {
  nextTick().then(() => {
    queryTree()
  })
})
const logicTable = ref()
const logicForm = ref<FormInstance>()

const data = reactive({
  dialogShow: false,
  tableData: [],
  updateList: [],
  deleteList: [],
  InsertList: [],
  treeData: [],
  alarmActionType: '',
  rowInfo: {},
  defaultExpandedKeys: [],
  title: '',
  form: {
    alarmKeywords: ''
  },
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0
  },
  editIndex: -1,
  opt1: [
    {
      value: '(',
      label: '('
    }
  ],
  opt2: [
    {
      value: '>',
      label: '大于'
    },
    {
      value: '>=',
      label: '大于等于'
    },
    {
      value: '=',
      label: '等于'
    },
    {
      value: '<=',
      label: '小于等于'
    },
    {
      value: '<',
      label: '小于'
    }
  ],
  opt3: [
    {
      value: ')',
      label: ')'
    }
  ],
  opt4: [
    {
      value: 'or',
      label: '或者'
    },
    {
      value: 'and',
      label: '并且'
    }
  ]
})

const switchDialog = (isOpen: boolean) => {
  data.dialogShow = isOpen
}

interface queryParams {
  alarmActionType: string
  alarmKeywords: string
  pageNo: number
  pageSize: number
}

const params: queryParams = reactive({
  alarmActionType: data.alarmActionType,
  alarmKeywords: data.form.alarmKeywords,
  pageNo: data.pageInfo.pageNo,
  pageSize: data.pageInfo.pageSize
})

async function getFlowTableApi(params: queryParams) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/judgeLogicConfig/query', params)
}

async function batchDeleteApi(params: Object[]) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/judgeLogicConfig/batchDelete', params)
}

async function getTreeDataApi() {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/judgeLogicConfig/queryTree')
}

const query = async () => {
  if (!data.alarmActionType) {
    ElMessage.warning('请先选择告警动作类型')
    return
  }
  params.alarmKeywords = data.form.alarmKeywords
  params.alarmActionType = data.alarmActionType
  const { list, pageNo, count } = await getFlowTableApi(params)
  data.tableData = list
  data.pageInfo.pageNo = pageNo
  data.pageInfo.total = count
}

const add = () => {
  if (!data.alarmActionType) {
    ElMessage.warning('请先选择告警动作类型')
    return
  }
  if (!data.tableData) {
    data.tableData = [
      {
        key: JSON.stringify(new Date()),
        alarmActionType: data.alarmActionType
      }
    ]
  } else {
    data.tableData.push({
      key: JSON.stringify(new Date()),
      alarmActionType: data.alarmActionType
    })
  }
  data.editIndex = data.tableData.length - 1
  console.log(data.tableData)
}

async function saveDataApi(param: Object[]) {
  return requestClient.post(import.meta.env.VITE_NSOSGZ + '/judgeLogicConfig/batchSave', param)
}

async function save() {
  try {
    if (data.updateList.length !== 0) {
      await saveDataApi(data.updateList)
    }
    if (data.deleteList.length !== 0) {
      await batchDeleteApi(data.deleteList)
    }
    query()
    data.updateList = []
    data.deleteList = []
  } catch (error) {
    ElMessage.error('保存失败')
  }
  data.editIndex = -1
}

const del = () => {
  const selectedRows = logicTable.value.getSelectionRows()
  data.deleteList = selectedRows
  const selectedIds = selectedRows.filter((row) => row.id).map((row) => row.id)
  const selectedKeys = selectedRows.filter((row) => !row.id).map((row) => row.key)
  if (selectedRows.length === 0) {
    ElMessage.warning('请先选择要删除项')
    return
  }
  ElMessageBox.confirm('确定要删除这些项吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      data.tableData = data.tableData.filter((item) => (item.key ? !selectedKeys.includes(item.key) : !selectedIds.includes(item.id)))
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}

const queryTree = async () => {
  data.treeData = await getTreeDataApi()
  if (data.treeData.length > 0) {
    data.defaultExpandedKeys = [data.treeData[0].label]
  }
}

const reset = () => {
  data.form.alarmKeywords = ''
}

const handleSizeChange = (val: number) => {
  data.pageInfo.pageSize = val
  params.pageSize = val
  query()
}

const currentChange = (val: number) => {
  data.pageInfo.pageNo = val
  params.pageNo = val
  query()
}

function formatTimestamp(row, column, cellValue) {
  if (cellValue === '' || !cellValue) {
    return ''
  }
  const date = new Date(cellValue)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

const handleNodeClick = async (node: Tree) => {
  if (node.label !== '告警动作类型') {
    data.alarmActionType = node.label
    query()
  } else {
    data.alarmActionType = ''
  }
}

function onClickEdit(row, column, event) {
  data.editIndex = data.tableData.indexOf(row)
}

function handleChange(row) {
  if (!data.updateList.includes(row)) {
    data.updateList.push(row)
  }
}
</script>
<style scoped>
.demo-form-inline .el-input {
  --el-input-width: 100%;
}

.demo-form-inline .el-select {
  --el-select-width: 100%;
}

:deep(.el-date-editor.el-input, .el-date-editor.el-input__wrapper) {
  width: 100%;
}

:deep(.el-form--inline .el-form-item) {
  width: calc(100% - 20px);
  margin-right: 20px;
  margin-bottom: 12px;
}

:deep(.el-main) {
  padding: 0;
}
</style>
