<template>
  <Page auto-content-height>
    <el-container>
      <el-form :inline="true" :model="queryForm" label-position="right" style="padding: 16px 20px 0">
        <el-form-item label="规则名称:">
          <el-input v-model="queryForm.ruleName" clearable maxlength="200" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="query">查询</el-button>
          <el-button type="info" @click="reset">重置</el-button>
          <el-button type="primary" @click="openInsertDialog()">新增</el-button>
        </el-form-item>
      </el-form>
      <el-main>
        <el-table border stripe ref="table" :data="tableData" @selection-change="handleSelectionChange" style="width: 100%; height: 700px">
          <el-table-column type="index" align="center" />
          <el-table-column prop="ruleName" label="规则名称" align="center" width="200">
            <template #default="scope">
              <el-tooltip effect="light" :content="scope.row.ruleName" placement="bottom" popper-class="custom-tooltip">
                <span class="max-lines">{{ scope.row.ruleName }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="规则说明" align="center">
            <template #default="scope">
              <el-tooltip effect="light" :content="scope.row.description" placement="bottom" popper-class="custom-tooltip">
                <span class="max-lines">{{ scope.row.description }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="effectiveStartTime" label="有效期开始时间" align="center" width="200"></el-table-column>
          <el-table-column prop="effectiveEndTime" label="有效期结束时间" align="center" width="200"></el-table-column>
          <el-table-column label="是否启用" align="center" width="100">
            <template #default="scope">
              <el-switch v-model="scope.row.enabled" inline-prompt active-value="1" inactive-value="0" active-text="是" inactive-text="否" disabled/>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="200">
            <template #default="scope">
              <el-button type="primary" link @click="openEditDialog(scope.row)">编辑</el-button>
              <el-button type="primary" link @click="getRulesById(scope.row)">详情</el-button>
              <el-button type="primary" link @click="batchDeleteRule(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <el-pagination :current-page="currentPage" :page-size="pageSize" :total="total" @size-change="handleSizeChange" @current-change="handlePageChange" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </el-footer>
      <el-dialog v-model="insertDialog" title="新增规则" width="80%" top="50px">
        <el-form ref="insertFormRef" :model="insertForm" :rules="insertRules" label-width="auto" style="margin: 10px 0 0 20px">
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item label="规则名称:" prop="taskAuditRule.ruleName" required>
                <el-input v-model="insertForm.taskAuditRule.ruleName" maxlength="100"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否启用:" prop="taskAuditRule.enabled" required>
                <el-switch v-model="insertForm.taskAuditRule.enabled" inline-prompt active-value="1" inactive-value="0" active-text="是" inactive-text="否" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item label="有效期开始时间:" prop="taskAuditRule.effectiveStartTime" required>
                <el-date-picker v-model="insertForm.taskAuditRule.effectiveStartTime" type="date" placeholder="选择开始日期" style="width: 100%" format="YYYY-MM-DD hh:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="有效期结束时间:" prop="taskAuditRule.effectiveEndTime" required>
                <el-date-picker v-model="insertForm.taskAuditRule.effectiveEndTime" type="date" format="YYYY-MM-DD hh:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" placeholder="选择结束日期" style="width: 100%" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="规则说明:" prop="taskAuditRule.description" required>
            <el-input v-model="insertForm.taskAuditRule.description" type="textarea" :rows="3" maxlength="1000"></el-input>
          </el-form-item>
          <el-form-item label="审查不通过回复:" prop="taskAuditRule.rejectReply" required>
            <el-input v-model="insertForm.taskAuditRule.rejectReply" type="textarea" :rows="2" maxlength="1000" ></el-input>
          </el-form-item>
          <el-form-item label="规则项:" required>
              <template #label>
                <span>规则项:</span>
                <el-tooltip
                  :content='tipContent'
                  placement="top"
                  effect="tooltipCustomWidth"
                >
                  <el-icon style="color: #e6a23c; margin-left: 4px;">
                    <QuestionFilled />
                  </el-icon>
                </el-tooltip>
              </template>
            <el-table :data="insertForm.taskAuditDetailRuleList" border height="400px">
              <el-table-column type="index" align="center" />
              <el-table-column prop="field" label="比较字段" align="center">
                <template #default="{ row, $index }">
                  <div v-if="row.edit === true">
                    <el-select v-model="row.field" placeholder="请选择比较字段"  @change="updateOtherVal(row)">
                      <el-option v-for="item in ruleDict" :key="item.id" :label="item.field" :value="item.field" />
                    </el-select>
                  </div>
                  <div v-else>
                    {{row.field}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="type" label="比较方式" align="center">
                <template #default="{ row, $index }">
                  <div v-if="row.edit === true">
                    <el-select v-model="row.type" placeholder="请选择比较字段">
                      <el-option v-for="item in compareType" :key="item.value" :label="item.lable" :value="item.value" />
                    </el-select>
                  </div>
                  <div v-else>
                    {{compareType.find((item) => item.value === row.type).lable || ''}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="matchValue" label="比较内容" align="center">
                <template #default="{ row, $index }">
                  <div v-if="row.edit === true">
                    <span v-if="row.dictType === '1'">
                      <el-input v-model="row.matchValue" maxlength="300" type="textarea" :rows="1"></el-input>
                    </span>
                    <span v-else-if="row.dictType === '2'">
                      <el-select v-model="row.matchValue" placeholder="请选择比较字段" multiple>
                        <el-option v-for="item in row.matchDict" :key="item.value" :label="item.lable" :value="item.lable" />
                      </el-select>
                    </span>
                    <span v-if="row.dictType === '3'">
                      <el-date-picker v-model="row.matchValue" type="datetime" placeholder="选择日期和时间" format="YYYY-MM-DD hh:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" />
                    </span>
                  </div>
                  <div v-else>
                    {{ row.matchValue }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="是否组合" align="center">
                <template #default="{ row, $index }">
                  <div v-if="row.edit === true">
                    <el-select v-model="row.merged" placeholder="请选择比较字段" @change="resetMergeCode(row)">
                      <el-option label="是" value="1" />
                      <el-option label="否" value="0" />
                    </el-select>
                  </div>
                  <div v-else>
                    {{ row.merged === '1' ? '是' : '否' }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="mergeCode" label="组合序号" align="center">
                <template #default="{ row, $index }">
                  <div v-if="row.edit === true">
                    <span v-if="row.merged === '1'">
                      <el-input v-model="row.mergeCode" maxlength="10" placeholder="例如:1,2..."></el-input>
                    </span>
                  </div>
                  <div v-else>
                    {{ row.mergeCode }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center">
                <template #header>
                  <el-button type="primary" size="small" @click="handleAdd('insert')">新增</el-button>
                </template>
                <template #default="scope">
                  <el-button v-if="scope.row.edit === true" size="small" type="primary" link @click="saveEdit(scope.$index, scope.row)">保存</el-button>
                  <el-button v-else="scope.row.edit === false" size="small" type="primary" link @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                  <el-button size="small" type="danger" link @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="insertDialog = false">取消</el-button>
          <el-button type="primary" @click="handelInsert()">确定</el-button>
        </template>
      </el-dialog>
      <el-dialog v-model="editDialog" title="编辑规则" width="80%" top="50px">
        <el-form ref="editFormRef" :model="editForm" :rules="insertRules" label-width="auto" style="margin: 10px 0 0 20px">
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item label="规则名称:" prop="taskAuditRule.ruleName" required>
                <el-input v-model="editForm.taskAuditRule.ruleName" maxlength="100"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否启用:" prop="taskAuditRule.enabled" required>
                <el-switch v-model="editForm.taskAuditRule.enabled" inline-prompt active-value="1" inactive-value="0" active-text="是" inactive-text="否" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item label="有效期开始时间:" prop="taskAuditRule.effectiveStartTime" required>
                <el-date-picker v-model="editForm.taskAuditRule.effectiveStartTime" type="datetime" placeholder="选择开始日期" style="width: 100%" format="YYYY-MM-DD hh:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="有效期结束时间:" prop="taskAuditRule.effectiveEndTime" required>
                <el-date-picker v-model="editForm.taskAuditRule.effectiveEndTime" type="datetime" format="YYYY-MM-DD hh:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" placeholder="选择结束日期" style="width: 100%" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="规则说明:" prop="taskAuditRule.description" required>
            <el-input v-model="editForm.taskAuditRule.description" type="textarea" :rows="3" maxlength="1000"></el-input>
          </el-form-item>
          <el-form-item label="审查不通过回复:" prop="taskAuditRule.rejectReply" required>
            <el-input v-model="editForm.taskAuditRule.rejectReply" type="textarea" :rows="2" maxlength="1000"></el-input>
          </el-form-item>
          <el-form-item label="规则项:" required>
            <template #label>
                <span>规则项:</span>
                <el-tooltip
                  :content='tipContent'
                  placement="top"
                  effect="tooltipCustomWidth"
                >
                  <el-icon style="color: #e6a23c; margin-left: 4px;">
                    <QuestionFilled />
                  </el-icon>
                </el-tooltip>
              </template>
            <el-table :data="editForm.taskAuditDetailRuleList" border height="400px">
              <el-table-column type="index" align="center" />
              <el-table-column prop="field" label="比较字段" align="center">
                <template #default="{ row, $index }">
                  <div v-if="row.edit === true">
                    <el-select filterable v-model="row.field" placeholder="请选择比较字段" @change="updateOtherVal(row)">
                      <el-option v-for="item in ruleDict" :key="item.id" :label="item.field" :value="item.field" />
                    </el-select>
                  </div>
                  <div v-else>
                    {{row.field}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="type" label="比较方式" align="center">
                <template #default="{ row, $index }">
                  <div v-if="row.edit === true">
                    <el-select v-model="row.type" placeholder="请选择比较字段">
                      <el-option v-for="item in compareType" :key="item.value" :label="item.lable" :value="item.value" />
                    </el-select>
                  </div>
                  <div v-else>
                    <!-- {{ compareType.find((item) => item.value === row.type).label || '' }} -->
                    {{compareType.find((item) => item.value === row.type).lable || ''}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="matchValue" label="比较内容" align="center">
                <template #default="{ row, $index }">
                  <div v-if="row.edit === true">
                    <span v-if="row.dictType === '1'">
                      <!-- <el-input v-model="row.matchValue" maxlength="300" type="textarea" :rows="1"></el-input> -->
                       <ElTagInput v-model="row.matchValue" placeholder="输入多项按Enter键分隔"> </ElTagInput>
                    </span>
                    <span v-else-if="row.dictType === '2'">
                      <el-select v-model="row.matchValue" placeholder="请选择比较字段" multiple>
                        <el-option v-for="item in row.matchDict" :key="item.value" :label="item.lable" :value="item.lable" />
                      </el-select>
                    </span>
                    <span v-if="row.dictType === '3'">
                      <el-date-picker v-model="row.matchValue" type="datetime" placeholder="选择日期和时间" format="YYYY-MM-DD hh:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" />
                    </span>
                  </div>
                  <div v-else>
                    <!-- {{ row.matchValue }} -->
                    <ElTagInput v-model="row.matchValue" disabled> </ElTagInput>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="是否组合" align="center">
                <template #default="{ row, $index }">
                  <div v-if="row.edit === true">
                    <el-select v-model="row.merged" placeholder="请选择比较字段" @change="resetMergeCode(row)">
                      <el-option label="是" value="1" />
                      <el-option label="否" value="0" />
                    </el-select>
                  </div>
                  <div v-else>
                    {{ row.merged === '1' ? '是' : '否' }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="mergeCode" label="组合序号" align="center">
                <template #default="{ row, $index }">
                  <div v-if="row.edit === true">
                    <span v-if="row.merged === '1'">
                      <el-input v-model="row.mergeCode" maxlength="10" placeholder="例如:1,2..." ></el-input>
                    </span>
                  </div>
                  <div v-else>
                    {{ row.mergeCode }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center">
                <template #header>
                  <el-button type="primary" size="small" @click="handleAdd('edit')">新增</el-button>
                </template>
                <template #default="scope">
                  <el-button v-if="scope.row.edit === true" size="small" type="primary" link @click="saveEdit(scope.$index, scope.row)">保存</el-button>
                  <el-button v-else="scope.row.edit === false" size="small" type="primary" link @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                  <el-button size="small" type="danger" link @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="editDialog = false">取消</el-button>
          <el-button type="primary" @click="handelEdit()">确定</el-button>
        </template>
      </el-dialog>
      <el-dialog v-model="ruleDetail" title="规则详情" width="80%" top="50px">
        <el-form ref="editFormRef" :model="detailData" label-width="auto" style="margin: 10px 0 0 20px">
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item label="规则名称:" prop="taskAuditRule.ruleName" required>
                <el-input v-model="detailData.taskAuditRule.ruleName" maxlength="100" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否启用:" prop="taskAuditRule.enabled" required>
                <el-switch v-model="detailData.taskAuditRule.enabled" inline-prompt active-value="1" inactive-value="0" active-text="是" inactive-text="否" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item label="有效期开始时间:" prop="taskAuditRule.effectiveStartTime" required>
                <el-date-picker v-model="detailData.taskAuditRule.effectiveStartTime" type="date" placeholder="选择开始日期" style="width: 100%" format="YYYY-MM-DD hh:mm:ss" value-format="YYYY-MM-DD HH:mm:ss"  disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="有效期结束时间:" prop="taskAuditRule.effectiveEndTime" required>
                <el-date-picker v-model="detailData.taskAuditRule.effectiveEndTime" type="date" format="YYYY-MM-DD hh:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" placeholder="选择结束日期" style="width: 100%"  disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="规则说明:" prop="taskAuditRule.description" required>
            <el-input v-model="detailData.taskAuditRule.description" type="textarea" :rows="3" maxlength="1000" disabled ></el-input>
          </el-form-item>
          <el-form-item label="审查不通过回复:" prop="taskAuditRule.rejectReply" required>
            <el-input v-model="detailData.taskAuditRule.rejectReply" type="textarea" :rows="2" maxlength="1000" disabled ></el-input>
          </el-form-item>
          <el-form-item label="规则项:" required>
            <template #label>
                <span>规则项:</span>
                <el-tooltip
                  :content='tipContent'
                  placement="top"
                  effect="tooltipCustomWidth"
                >
                  <el-icon style="color: #e6a23c; margin-left: 4px;">
                    <QuestionFilled />
                  </el-icon>
                </el-tooltip>
              </template>
            <el-table :data="detailData.taskAuditDetailRuleList" border height="400px">
              <el-table-column type="index" align="center" />
              <el-table-column prop="field" label="比较字段" align="center">
                <template #default="{ row, $index }">
                  <div>
                    {{row.field}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="type" label="比较方式" align="center">
                <template #default="{ row, $index }">
                  <div>
                    {{compareType.find((item) => item.value === row.type).lable || ''}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="matchValue" label="比较内容" align="center">
                <template #default="{ row, $index }">
                  <div>
                    {{ row.matchValue }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="是否组合" align="center">
                <template #default="{ row, $index }">
                  <div>
                    {{ row.merged === '1' ? '是' : '否' }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="mergeCode" label="组合序号" align="center">
                <template #default="{ row, $index }">
                  <div>
                    {{ row.mergeCode }}
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="ruleDetail = false">关闭</el-button>
        </template>
      </el-dialog>
    </el-container>
  </Page>
</template>

<script lang="ts" setup>
import { ElTable, ElTableColumn, ElPopconfirm, ElFormItem, ElForm, ElInput, ElButton, ElSelect, ElOption, ElPagination, ElContainer, ElHeader, ElMain, ElFooter, ElDialog, ElMessage, ElMessageBox, ElText, ElLink, ElTag, ElTooltip } from 'element-plus'
import { Search, Download, Aim, CircleCheck, Setting,Warning,QuestionFilled } from '@element-plus/icons-vue'
import { Page } from '@vben/common-ui'
import { ref, reactive, computed, onMounted } from 'vue'
import { getydTodoTasksApi, getTaskAuditApi, deleteRuleApi, getCompareContentDictApi, getRulesByIdApi, saveOrUpdateRuleApi, getRuleDictListApi } from '#/api'
import { useRouter } from 'vue-router'
import { useAccessStore, useUserStore } from '@vben/stores'
import ElTagInput from './elTagInput.vue'
const router = useRouter()
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)
const table = ref(null)
const tableData = ref([])
const selectedRows = ref([])
const insertFormRef = ref()
const editFormRef = ref()
const userStore = useUserStore()
const queryForm = reactive({
  ruleName: ''
})

const tipContent = `用于审查作业工单，支持多条规则组合。规则之间的关系为：同属一个组合序号的规则是"或"关系，不同组合序号之间是"与"关系。
可用的比较方式包括：包含、不包含、等于、不等于、正则匹配、大于、小于。`

const ruleDict = ref([]) //规则项字典

// 新增弹窗
const insertDialog = ref(false)
const insertForm = ref({
  taskAuditDetailRuleList: [],
  taskAuditRule: {
    createTime: '',
    description: '',
    effectiveEndTime: '',
    effectiveStartTime: '',
    enabled: '0',
    ruleName: '',
    rejectReply:''
  }
})

// 编辑弹窗
const editDialog = ref(false)
const editForm = ref({})

// 详情弹窗
const ruleDetail = ref(false)
const detailData = ref({})
// 比较方式字典
const compareType = [
  {
    value: '1',
    lable: '包含'
  },
  {
    value: '2',
    lable: '不包含'
  },
  {
    value: '3',
    lable: '等于'
  },
  {
    value: '4',
    lable: '不等于'
  },
  {
    value: '5',
    lable: '正则匹配'
  },
  {
    value: '6',
    lable: '大于'
  },
  {
    value: '7',
    lable: '小于'
  }
]

/**
 * 查询
 */
const query = async () => {
  try {
    const response = await getTaskAuditApi({
      pageSize: pageSize.value,
      pageNo: currentPage.value,
      ...queryForm
    })
    tableData.value = response.records
    total.value = response.total

    // tableData.value = date11.data
    // total.value = date11.count
  } catch {}
}

/**
 * 根据Id 获取规则细则
 */

async function getRulesById(row) {
  try {
    const res = await getRulesByIdApi({
      id: row.id
    })
    detailData.value = res
    ruleDetail.value = true
  } catch (error) {}
}

/**
 * 获取规则项字典
 */
async function getRuleDictList() {
  try {
    const res = await getRuleDictListApi()
    ruleDict.value = res
  } catch (error) {}
}

/**
 * 删除规则
 */

async function deleteRule(id) {
  try {
    await deleteRuleApi([id])
    ElMessage.success('删除成功!')
    query()
  } catch (error) {}
}

function batchDeleteRule(id) {
  ElMessageBox.confirm('确定要删除这条规则吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      deleteRule(id)
    })
    .catch(() => {
      // ElMessage.info('已取消删除')
    })
}

/**
 * 新增或编辑规则细则
 */

// 打开新增弹窗
function openInsertDialog() {
  insertDialog.value = true
}

// 打开编辑弹窗
async function openEditDialog(row) {
  try {
    const res = await getRulesByIdApi({
      id: row.id
    })
    editForm.value = res
    editDialog.value = true
  } catch (error) {}
}

// 编辑规则
async function handelEdit() {
  try {
    const isValid = await editFormRef.value.validate()
    if (!isValid) return
    if (!vaildSaveRows(editForm.value.taskAuditDetailRuleList)) return

    const res = await saveOrUpdateRuleApi(editForm.value)
    ElMessage.success('更新成功!')
    editDialog.value = false
    query()
  } catch (error) {}
}

const insertRules = {
  'taskAuditRule.ruleName': [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
  'taskAuditRule.effectiveStartTime': [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  'taskAuditRule.effectiveEndTime': [{ required: true, message: '请选择结束时间', trigger: 'change' }],
  'taskAuditRule.description': [{ required: true, message: '请输入规则说明', trigger: 'blur' }],
  'taskAuditRule.rejectReply': [{ required: true, message: '请输入回复内容', trigger: 'blur' }],
}

// 新增规则
async function handelInsert() {
  try {
    const isValid = await insertFormRef.value.validate()
    if (!isValid) return
    if (!vaildSaveRows(insertForm.value.taskAuditDetailRuleList)) return

    const res = await saveOrUpdateRuleApi(insertForm.value)
    ElMessage.success('新增成功!')
    insertDialog.value = false
    query()
  } catch (error) {}
}

// 校验匹配内容字段，修改格式
function formatValue(val) {
  // 如果是数组，用英文冒号连接
  if (Array.isArray(val)) {
    return val.join('&&')
  }
  // 如果是字符串，直接返回
  else if (typeof val === 'string') {
    return val
  }
  // 其他类型返回空字符串
  return ''
}

// 校验所有的新增行是否保存
function vaildSaveRows(data) {
  for (const item of data) {
    item.matchValue = formatValue(item.matchValue)
    if (item.edit === true) {
      ElMessage.warning('请保存所有规则项！')
      return false
    }
  }
  return true
}

// 选择比较字段，更新其他附加值
async function updateOtherVal(row) {
  try {
    const selectedRow = findItemById(ruleDict.value, row.field)
    if (!selectedRow) return
    row.vars = selectedRow.vars
    row.dictType = selectedRow.type
    row.matchValue = ''
    // row.ruleId = detailData.value.taskAuditRule.id
    row.dictId = selectedRow.id
    if (selectedRow.type === '2') {
      // 根据字典id获取获取比较内容字典
      row.matchDict = await getCompareContentDictApi({ id: selectedRow.id })
    }
  } catch (error) {}
}

//置空
function resetMergeCode(row) {
  row.mergeCode = ''
}

// 删除行
function handleDelete(index, row, type) {
  if(type==='insert'){
    insertForm.value.taskAuditDetailRuleList.splice(index, 1)
  } else{
    editForm.value.taskAuditDetailRuleList.splice(index, 1)
  }
  
}
// 新增行
function handleAdd(type) {
  if(type==='insert'){
    insertForm.value.taskAuditDetailRuleList.push({
      dictId: '',
      dictType: '',
      field: '',
      matchValue: '',
      mergeCode: '',
      merged: '0',
      ruleId: '',
      type: '',
      vars: '',
      matchDict: '',
      edit: true
    })
  } else{
      editForm.value.taskAuditDetailRuleList.push({
      dictId: '',
      dictType: '',
      field: '',
      matchValue: '',
      mergeCode: '',
      merged: '0',
      ruleId: editForm.value.taskAuditRule.id,
      type: '',
      vars: '',
      matchDict: '',
      edit: true
    })

  }

}

// 编辑行 
async function handleEdit(index, row){
try {
    if (row.dictType === '2') {
    const selectedRow = findItemById(ruleDict.value, row.field)
      // 根据字典id获取获取比较内容字典
    row.matchDict = await getCompareContentDictApi({ id: selectedRow.id })
  }
  row.edit = true
} catch (error) {
  
}
}

// 单行保存校验
function saveEdit(index, row) {
  // || row.matchValue === '' || row.matchValue === []
  // 放开比较内容，允许为空
  if (row.field === '' || row.type === '') {
    ElMessage.warning('请检查比较字段、比较方式、比较内容等必填项是否填写!')
    return
  }
  if (row.merged === '1' && row.mergeCode === '') {
    ElMessage.warning('请填写组合序号!')
    return
  }
  row.edit = false
}

// 匹配选中的元组
function findItemById(dataList, targetId) {
  if (!Array.isArray(dataList)) {
    return null
  }
  const foundItem = dataList.find((item) => {
    return String(item.field) === String(targetId)
  })
  return foundItem || null
}

/**
 * 跳转
 */
// 跳转
const toWorkOrderDetail = (oid, tid) => {
  router.push({
    path: '/workPlanBalance/jobInfo',
    query: { oid: oid, tid: tid, type: '3' }
  })
}

const reset = () => {
  queryForm.ruleName = ''
  query()
}

const handleSelectionChange = (val) => {
  selectedRows.value = val
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  query()
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  query()
}

onMounted(() => {
  query()
  getRuleDictList()
})
</script>

<style scoped>

:deep(.el-popper__tooltip){
  width: 200px !important;
}

.el-main {
  padding-top: 0;
}
.cell {
  text-align: center;
}
.max-lines {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5; /* 限制显示行数 */
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

<style>

.el-popper.is-tooltipCustomWidth {
  padding: 6px 12px;
  background: #ffffff;
  box-shadow: 0px 4px 12px 0px rgba(0, 17, 59, 0.25);
  border-radius: 4px 4px 4px 4px;
  font-weight: 400;
  font-size: 12px;
  color: #515151;
  min-width: 10px;
  max-width: 300px;
}

.el-popper.is-tooltipCustomWidth .el-popper__arrow::before {
  background: #ffffff;
  right: 0;
}
</style>
