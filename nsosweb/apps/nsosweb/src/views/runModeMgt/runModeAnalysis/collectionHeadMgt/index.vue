<script lang="ts" setup>
import { Search, Plus, RefreshLeft, Delete, Download, Monitor, CirclePlus, CircleCheck, SuccessFilled, Histogram } from '@element-plus/icons-vue'
import { ElButton, ElCard, ElCol, ElDialog, ElForm, ElFormItem,ElMessageBox, ElEmpty, ElImageViewer, ElPopconfirm, ElInput, ElMessage, ElPagination, ElRow, ElSelect, ElTable, ElTableColumn } from 'element-plus'
import { reactive, ref, computed, watch, onMounted, nextTick } from 'vue'
import moment from 'moment'
import { useVbenModal } from '@vben/common-ui'
import { getDeptHeadListApi, SaveAccountToLocalApi,DeleteAccountofLocalApi, getUserInfoByNameApi, getAllOrgApi, getPersonsByDeptApi, updateHeadApi, getOrgRelateApi } from '#/api'
import OrgTreeClick from './orgTreeClick.vue'
const queryFormRef = ref()
const queryForm = reactive({
  orgName: '',
  username: ''
})
const data = reactive({
  tableData: [],
  pageInfo: {
    pageSize: 10,
    pageNo: 1,
    total: 0
  }
})
const personData = reactive({
  serachForm: {
    orgId: '',
    userName: '',
    loginCode: ''
  },
  tableData: [],
  pageInfo: {
    pageSize: 10,
    pageNo: 1,
    total: 0
  }
})

// 树形组件


const tableRef = ref(null)
const selectedIds = ref(new Set())

// 弹窗状态
const insertDialog = ref(false)
const insertUserDialog = ref(false)

// Tree区域
const searchValue = ref('')
const searchUserValue = ref('')
const selectlabel = ref([]) // 选项label
const selectValue = ref([]) // 选项value
const selectRef = ref(null)
const treeRef = ref(null)
const displayTreeData = ref([]) // 显示用的树数据
const displayTreeData1 = ref([]) // 选择人员 显示用的树数据
// 删除存储选中的行
const selectedRows = ref([])
const selectedAccounts = ref([])

const treeData = ref([])

const defaultProps = {
  children: 'children',
  label: 'name'
}

/**
 * 编辑负责人数据
 */

async function openInsertDialog() {
  insertUserDialog.value = true;
  resetSerachForm();

}

// 获取列表数据
async function getDeptHeadList() {
  try {
    const res = await getOrgRelateApi({
      ...data.pageInfo,
      ...queryForm
    })

    data.tableData = res.records
    data.pageInfo.total = res.total
  } catch (error) {}
}


// 删除选择变化事件
const handleSelectionChange = (selection) => {
  selectedRows.value = selection.map((row) => row.id)
}

// 同步用户（数认与收资数据库）选择变化事件
// const handleSelectionChange = (selection) => {
//   selectedRows.value = selection.map((row) => row.id)
// }
selectedAccounts

// 删除负责人数据
async function deleteAccount(){
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选中待删除数据')
    return
  }

  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedRows.value.length} 条数据吗？`, '批量删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await DeleteAccountofLocalApi(selectedRows.value)

    selectedRows.value = []
    ElMessage.success('删除成功!')
    getDeptHeadList()
  } catch (error) {
    console.error('删除操作取消或失败:', error)
  }

}

// 按单位、姓名等查找人员
async function getPersonsByDept() {
  try {
    const res = await getUserInfoByNameApi({
      ...personData.serachForm,
      ...personData.pageInfo
    })
    personData.tableData = res.records
    personData.pageInfo.total = res.total
  } catch (error) {}
}
// 弹窗-查询
function getPersonList() {
  personData.pageInfo.pageNo = 1
  getPersonsByDept()
}

// 查询
function searchCollection() {
  data.pageInfo.pageNo = 1
  getDeptHeadList()
}

// 重置
function reset() {
  queryFormRef.value.resetFields()
  searchValue.value = ''
  displayTreeData.value = JSON.parse(JSON.stringify(treeData.value))
  getDeptHeadList()
}

// 获取所有的组织
// async function getAllOrgList() {
//   try {
//     const res = await getAllOrgApi()
//     treeData.value = res
//     displayTreeData.value = JSON.parse(JSON.stringify(treeData.value))
//      displayTreeData1.value = JSON.parse(JSON.stringify(treeData.value))
//   } catch (error) {}
// }


/**
 * selection相关方法
 */

// // 处理选中变化
// function handleSelectionChange(selection) {
//   selectedIds.value = new Set(selection.map((item) => item.id))
// }

// // 设置默认选中
// async function setDefaultSelections() {
//   await nextTick() // 等待表格渲染完成
//   if (!tableRef.value) return
//   try {
//     // 先清除所有选中
//     tableRef.value.clearSelection()
//     // 选中isAppoint=1的行
//     personData.tableData.forEach((row) => {
//       if (row.isAppoint === '1') {
//         tableRef.value.toggleRowSelection(row, true)
//         selectedIds.value.add(row.id) // 加入选中集合
//       }
//     })
//   } catch (e) {
//     console.error('设置选中状态出错:', e)
//   }
// }

/**
 * 分页
 */
// 人员分页
const handleSizeChange = (val) => {
  personData.pageInfo.pageSize = val
  getPersonsByDept()
}

const handleCurrentChange = (val) => {
  personData.pageInfo.pageNo = val
  getPersonsByDept()
}

const handleSizeChange1 = (val) => {
  data.pageInfo.pageSize = val
  getDeptHeadList()
}

const handleCurrentChange1 = (val) => {
  data.pageInfo.pageNo = val
  getDeptHeadList()
}

onMounted(() => {
  getDeptHeadList()
  // getAllOrgList()
})

/**
 * Tree方法
 */

// 处理顶部查询框搜索输入
function handleSearch() {
  if (!searchValue.value) {
    displayTreeData.value = JSON.parse(JSON.stringify(treeData.value))
    return
  }
  // 如果子节点匹配但父节点不匹配，提升子节点层级
  const flattenMatchedNodes = (nodes) => {
    let result = []
    nodes.forEach((node) => {
      if (node.name.includes(searchValue.value)) {
        result.push(node)
      } else if (node.children?.length) {
        result = result.concat(flattenMatchedNodes(node.children))
      }
    })
    return result
  }

  displayTreeData.value = flattenMatchedNodes(JSON.parse(JSON.stringify(treeData.value)))
}

function handleSearch1() {
  if (!searchUserValue.value) {
    displayTreeData1.value = JSON.parse(JSON.stringify(treeData.value))
    return
  }
  // 如果子节点匹配但父节点不匹配，提升子节点层级
  const flattenMatchedNodes = (nodes) => {
    let result = []
    nodes.forEach((node) => {
      if (node.name.includes(searchUserValue.value)) {
        result.push(node)
      } else if (node.children?.length) {
        result = result.concat(flattenMatchedNodes(node.children))
      }
    })
    return result
  }

  displayTreeData1.value = flattenMatchedNodes(JSON.parse(JSON.stringify(treeData.value)))
}



// 查询
function handleCheckChange(val) {
  if (!val.children || !val.children.length) {
    queryForm.orgName = val.name
    getDeptHeadList()
  }
}

// 查询用户账号
function handleClick(val) {
  if (!val.children || !val.children.length) {
    personData.serachForm.orgId = val.id
    getPersonsByDept()
  }
}

// 账户新增页面  重置
function resetSerachForm(){
  Object.assign(personData.serachForm,{
    orgId: '',
    userName: '',
    loginCode: ''
  })
  displayTreeData1.value = JSON.parse(JSON.stringify(treeData.value))
   getPersonsByDept()
}

// 添加数认账号到收资数据库
async function synchronizeAccount(){

}

async function selectAccount(row) {
  try {
    const res = await SaveAccountToLocalApi({
      isAppoint: '1',
      loginCode: row.logincode,
      orgCode: row.orgCode,
      orgFullName: row.orgFullName,
      orgId: row.orgId,
      orgName: row.orgName,
      userId: row.userId,
      userName: row.username
    })
    ElMessage.success('新增成功')
    insertUserDialog.value = false;

    // 重置变量，刷新
    Object.assign(personData.serachForm,{
      orgId: '',
      userName: '',
      loginCode: ''
    })
    displayTreeData1.value = JSON.parse(JSON.stringify(treeData.value))
    await getDeptHeadList()
    searchUserValue.value = ''

  } catch (error) {}
}

// 取消/设置负责人
async function HandleSwitchChange(row){
    try {
    const res = await SaveAccountToLocalApi({
      id: row.id,
      isAppoint: row.isAppoint,
      loginCode: row.logincode,
      orgCode: row.orgCode,
      orgFullName: row.orgFullName,
      orgId: row.orgId,
      orgName: row.orgName,
      userId: row.userId,
      userName: row.username
    })
    ElMessage.success('修改成功')
    await getDeptHeadList()


  } catch (error) {}
}

// 存储选中的组织信息
const selectedOrg = ref(null)

// 处理组织选择事件
async function handleOrgSelect(orgData) {
  selectedOrg.value = orgData
  if(orgData.isLeaf){
    console.log('选择的组织数据:', orgData)
  }
  
  // 这里可以添加其他业务逻辑，如：
  // 1. 根据选择的组织加载相关数据
  // 2. 更新表单字段
  // 3. 触发其他组件更新
}
</script>
<template>
  <div style="padding: 10px">
    <el-row :gutter="10">
      <el-col :span="6">
        <div class="bg-white" style="height: 100%; padding: 20px">
          <div style="margin-bottom: 20px">
            <el-input v-model="searchValue" placeholder="请输入查询内容" clearable maxlength="50" @keyup.enter="handleSearch">
              <template #append>
                <el-button :icon="Search" @click="handleSearch" />
              </template>
            </el-input>
          </div>
          <div style="height: 750px; width: 100%; max-width: 370px; padding: 5px; overflow: auto; border: 1px solid #e0e0e0">
            <OrgTreeClick @selectOk="handleOrgSelect" />
          </div>
        </div>
      </el-col>
      <el-col :span="18">
        <div style="padding: 20px" class="bg-white">
          <el-form ref="queryFormRef" :inline="true" :model="queryForm" label-position="right"  >
            <el-form-item label="单位名称:" prop="orgName">
              <el-input v-model="queryForm.orgName" style="width: 200px" clearable />
            </el-form-item>
            <el-form-item label="人员名称:" prop="appointedUserName">
              <el-input v-model="queryForm.username" style="width: 200px" clearable />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="searchCollection()">查询</el-button>
              <el-button type="info" @click="reset">重置</el-button>
              <el-button type="primary" @click="openInsertDialog">新增</el-button>
              <el-button type="danger" @click="deleteAccount">删除</el-button>
              
            </el-form-item>
          </el-form>
          <el-table :data="data.tableData" border stripe height="710px" width="100%" @selection-change="handleSelectionChange">
            <el-table-column type="index" label="#" align="center" />
            <el-table-column type="selection" />
            <el-table-column prop="orgFullName" align="center" label="所属单位">
              <template #default="scope">
                <el-tooltip effect="light" :content="scope.row.orgFullName" placement="bottom" popper-class="custom-tooltip">
                  <span class="max-lines">{{ scope.row.orgFullName }}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="userName" align="center" label="姓名" />

            <el-table-column prop="loginCode" align="center" label="账号" />
                        <el-table-column prop="userName" align="center" label="是否负责人" >
                        <template #default="scope">
                        <el-switch
                            v-model="scope.row.isAppoint"
                            inline-prompt
                            active-text="是"
                            inactive-text="否"
                            active-value="1"
                            inactive-value="0"
                            @change="HandleSwitchChange(scope.row)"
                          />
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top: 10px">
            <el-pagination v-model:current-page="data.pageInfo.pageNo" v-model:page-size="data.pageInfo.pageSize" :total="data.pageInfo.total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange1" @current-change="handleCurrentChange1"></el-pagination>
          </div>
          <!-- 弹窗区域 -->
          <div>
            <el-dialog v-model="insertUserDialog" title="新增账户" width="1400" class="system-detail-dialog">
              <el-row :gutter="30">
                <el-col :span="8">
                  <div class="bg-white" style="height: 100%; padding: 20px">
                    <div style="margin-bottom: 20px">
                      <el-input v-model="searchUserValue" placeholder="请输入查询内容" clearable maxlength="50" @keyup.enter="handleSearch1">
                        <template #append>
                          <el-button :icon="Search" @click="handleSearch1" />
                        </template>
                      </el-input>
                    </div>
                    <div style="height: 500px; width: 100%; max-width: 400px; padding: 5px; overflow: auto; border: 1px solid #e0e0e0">
                      <el-tree :data="displayTreeData1" :props="defaultProps" default-expand-all node-key="id" :check-strictly="false" :expand-on-click-node="true" ref="treeRef" @node-click="handleClick">
                        <template #default="{ node, data }">
                          <span class="span-ellipsis" slot-scope="{ node, data }">
                            <span :title="node.label">{{ node.label }}</span>
                          </span>
                        </template>
                      </el-tree>
                    </div>
                  </div>
                </el-col>
                <el-col :span="16">
                  <el-form :inline="true" :model="personData.serachForm" label-position="right" style="padding-top: 15px">
                    <el-form-item label="姓名:" prop="personName">
                      <el-input v-model="personData.serachForm.userName" style="width: 200px" clearable />
                    </el-form-item>
                    <el-form-item label="账号:" prop="personName">
                      <el-input v-model="personData.serachForm.loginCode" style="width: 200px" clearable />
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" :icon="Search" @click="getPersonList()">查询</el-button>
                      <el-button type="info" @click="resetSerachForm()">重置</el-button>
                      <!-- <el-button type="info" @click="synchronizeAccount()">账号同步</el-button> -->
                    </el-form-item>
                  </el-form>
                  <el-table ref="tableRef" row-key="id" :data="personData.tableData" border stripe height="500px" >
                    <el-table-column type="index" label="#" align="center" />
                    <!-- <el-table-column type="selection" :reserve-selection="true" /> -->

                    <el-table-column prop="orgFullName" align="center" label="所属单位">
                      <template #default="scope">
                        <el-tooltip effect="light" :content="scope.row.orgFullName" placement="bottom" popper-class="custom-tooltip">
                          <span class="max-lines">{{ scope.row.orgFullName }}</span>
                        </el-tooltip>
                      </template>
                    </el-table-column>
                    <el-table-column prop="username" align="center" label="姓名" />
                    <el-table-column prop="logincode" align="center" label="账号" />
                    <el-table-column label="操作" align="center" width="150px">
                      <template #default="scope">
                        <el-button type="primary" link @click="selectAccount(scope.row)">选择</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div style="margin-top: 10px">
                    <el-pagination v-model:current-page="personData.pageInfo.pageNo" v-model:page-size="personData.pageInfo.pageSize" :total="personData.pageInfo.total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
                  </div>
                </el-col>
              </el-row>

              <template #footer>
                <span class="dialog-footer">
                  <el-button @click="insertUserDialog = false">关闭</el-button>
                </span>
              </template>
            </el-dialog>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="less" scoped>
.span-ellipsis {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.max-lines {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /* 限制显示行数 */
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
