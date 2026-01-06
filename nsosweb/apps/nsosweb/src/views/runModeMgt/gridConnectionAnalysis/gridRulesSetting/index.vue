<template>
  <div>
    <el-container>
      <el-form :inline="true" :model="queryForm" label-position="right" style="padding: 20px 20px 0">
        <el-form-item label="并网阶段:">
          <el-select v-model="queryForm.stageList" style="width: 200px" placeholder="" multiple>
            <el-option v-for="item in stages" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="并网类型:">
          <el-select v-model="queryForm.categoryIdList" style="width: 200px" placeholder="" multiple>
            <el-option v-for="item in categories" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统分级分类:">
          <el-select v-model="queryForm.systemCategoryList" style="width: 200px" placeholder="" multiple>
            <el-option v-for="item in systemCategories" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生产环境部署区域:">
          <el-select v-model="queryForm.systemBelongAreaList" style="width: 200px" placeholder="" multiple>
            <el-option v-for="item in systemBelongAreas" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审查专业:">
          <el-select v-model="queryForm.optionGroupList" style="width: 200px" placeholder="" multiple>
            <el-option v-for="item in optionGroups" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属单位:">
          <el-select v-model="queryForm.unitIds" style="width: 200px" placeholder="" multiple>
            <el-option v-for="item in unitOptions" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="query">查询</el-button>
          <el-button type="primary" @click="openInsertDialog">新增</el-button>
          <el-button type="danger" @click="handleDelete">删除</el-button>

          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-main>
        <el-table border stripe ref="table" :data="tableData" @selection-change="handleSelectionChange" style="width: 100%; height: 680px">
          <el-table-column type="selection" width="40" align="center" />
          <el-table-column type="index" align="center" />
          <el-table-column prop="stage" label="并网审查阶段" align="center" width="120px"> </el-table-column>
          <el-table-column prop="category" label="并网类型" align="center" width="120px" />
          <el-table-column prop="systemCategory" label="系统分级分类" align="center" >
            <template #default="scope">
              {{ getLabels(systemCategories, scope.row.systemCategory) }}
            </template>
          </el-table-column>
          <el-table-column prop="systemBelongArea" label="生产环境部署区域" align="center" >
            <template #default="scope">
              {{ getLabels(systemBelongAreas, scope.row.systemBelongArea) }}
            </template>
          </el-table-column>
          <el-table-column prop="unitName" label="所属单位" align="center"> </el-table-column>
          <el-table-column prop="optionGroup" label="审查专业" align="center" width="100px">
            <template #default="scope">
              {{ getLabels(optionGroups, scope.row.optionGroup) }}
            </template>
          </el-table-column>
          <el-table-column prop="optionName" label="审查项" align="center" > </el-table-column>
          <el-table-column prop="pointName" label="审查点" align="center">
            <template #default="scope">
              <el-tooltip effect="light" :content="scope.row.pointName" placement="bottom" popper-class="custom-tooltip">
                <span class="max-lines">{{ scope.row.pointName }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="checkRequire" label="审查要求" align="center" width="400px">
            <template #default="scope">
              <el-tooltip effect="light" :content="scope.row.checkRequire" placement="bottom" popper-class="custom-tooltip">
                <span class="max-lines">{{ scope.row.checkRequire }}</span>
              </el-tooltip>
            </template>
          </el-table-column> -->
          <el-table-column prop="docName" label="建议审查文档" align="center" width="120px"> </el-table-column>
          <!-- <el-table-column prop="aiPrompt" label="AI提示词" align="center" width="120px"></el-table-column> -->
          <el-table-column prop="keywords" label="审查关键词" align="center" width="120px"> 
            <template #default="scope">
              <div v-if="scope.row.keywords">
                <div v-for="(item, index) in scope.row.keywords.split('&&')" :key="index">
                  <span>{{ item }} <br /></span>
                </div>
              </div>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="120px">
            <template #default="scope">
              <el-button type="primary" link @click="openEditDialog(scope.row)"> 编辑</el-button>
              <el-button type="primary" link @click="openDetialsDialog(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <el-pagination :current-page="currentPage" :page-size="pageSize" :total="total" @size-change="handleSizeChange" @current-change="handlePageChange" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </el-footer>
    </el-container>
    <el-dialog v-model="insertDialogVisible" width="1200" title="新增审查项">
      <el-form ref="insertFormRef" :inline="true" :rules="rules" :model="insertForm" label-position="right" label-width="150px" style="padding: 16px 20px 0">
        <el-row>
          <el-col :span="12">
            <el-form-item label="并网阶段:" prop="stageId" style="width: 100%" required>
              <el-select v-model="insertForm.stageId" @change="handleStageChange">
                <el-option v-for="item in stages" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="并网类型:" prop="categoryId" style="width: 100%" required>
              <el-select v-model="insertForm.categoryId" @change="handleCategoryChange">
                <el-option v-for="item in categories" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="系统所属区域:" prop="systemBelongArea" style="width: 100%" required>
              <el-select v-model="insertForm.systemBelongArea" multiple>
                <el-option v-for="item in systemBelongAreas" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="系统分级分类:" prop="systemCategory" style="width: 100%" required>
              <el-select v-model="insertForm.systemCategory" multiple>
                <el-option v-for="item in systemCategories" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属单位:" prop="unitId" style="width: 100%" required>
              <el-select v-model="insertForm.unitId" @change="handleUnitChange">
                <el-option v-for="item in unitOptions" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审查专业:" prop="optionGroup" style="width: 100%" required>
              <el-select v-model="insertForm.optionGroup">
                <el-option v-for="item in optionGroups" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="审查项:" prop="optionName" style="width: 100%" required>
              <el-input v-model="insertForm.optionName" show-word-limit type="textarea" maxlength="125" :rows="3"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审查点:" prop="pointName" style="width: 100%" required>
              <el-input v-model="insertForm.pointName" show-word-limit type="textarea" maxlength="125" :rows="3"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="建议审查文档:" prop="docName" style="width: 100%" required>
              <el-input v-model="insertForm.docName" show-word-limit type="textarea" maxlength="125" :rows="3"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审查要求:" prop="checkRequire" style="width: 100%" required>
              <el-input v-model="insertForm.checkRequire" show-word-limit type="textarea" maxlength="1024" :rows="3"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="审查关键词:" prop="keywords" style="width: 100%" required>
          <ElTagInput v-model="insertForm.keywords" placeholder="输入多项按Enter键分隔"> </ElTagInput>
          <!-- <el-input v-model="insertForm.keywords" show-word-limit type="textarea" maxlength="125" :rows="3"></el-input> -->
        </el-form-item>
        <el-form-item label="AI提示词:" prop="aiPrompt" style="width: 100%">
          <!-- <ElTagInput v-model="insertForm.aiPrompt" placeholder="输入多项按Enter键分隔"> </ElTagInput> -->
          <el-input v-model="insertForm.aiPrompt" show-word-limit type="textarea" maxlength="125" :rows="3"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="insertDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleInsert()">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="editDialogVisible" width="1200" title="编辑审查项">
      <el-form ref="editFormRef" :inline="true" :rules="rules" :model="editForm" label-position="right" label-width="150px" style="padding: 16px 20px 0">
        <el-row>
          <el-col :span="12">
            <el-form-item label="并网阶段:" prop="stageId" style="width: 100%" required>
              <el-select v-model="editForm.stageId" @change="handleStageEditChange">
                <el-option v-for="item in stages" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="并网类型:" prop="categoryId" style="width: 100%" required>
              <el-select v-model="editForm.categoryId" @change="handleCategoryEditChange">
                <el-option v-for="item in categories" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="系统所属区域:" prop="systemBelongArea" style="width: 100%" required>
              <el-select v-model="editForm.systemBelongArea" multiple>
                <el-option v-for="item in systemBelongAreas" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="系统分级分类:" prop="systemCategory" style="width: 100%" required>
              <el-select v-model="editForm.systemCategory" multiple>
                <el-option v-for="item in systemCategories" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属单位:" prop="unitId" style="width: 100%" required>
              <el-select v-model="editForm.unitId" @change="handleUnitEditChange">
                <el-option v-for="item in unitOptions" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审查专业:" prop="optionGroup" style="width: 100%" required>
              <el-select v-model="editForm.optionGroup">
                <el-option v-for="item in optionGroups" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="审查项:" prop="optionName" style="width: 100%" required>
              <el-input v-model="editForm.optionName" show-word-limit type="textarea" maxlength="125" :rows="3"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审查点:" prop="pointName" style="width: 100%" required>
              <el-input v-model="editForm.pointName" show-word-limit type="textarea" maxlength="125" :rows="3"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="建议审查文档:" prop="docName" style="width: 100%" required>
              <el-input v-model="editForm.docName" show-word-limit type="textarea" maxlength="125" :rows="3"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审查要求:" prop="checkRequire" style="width: 100%" required>
              <el-input v-model="editForm.checkRequire" show-word-limit type="textarea" maxlength="1024" :rows="3"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="审查关键词:" prop="keywords" style="width: 100%" required>
          <ElTagInput v-model="editForm.keywords" placeholder="输入多项按Enter键分隔"> </ElTagInput>
          <!-- <el-input v-model="insertForm.keywords" show-word-limit type="textarea" maxlength="125" :rows="3"></el-input> -->
        </el-form-item>
        <el-form-item label="AI提示词:" prop="aiPrompt" style="width: 100%">
          <!-- <ElTagInput v-model="insertForm.aiPrompt" placeholder="输入多项按Enter键分隔"> </ElTagInput> -->
          <el-input v-model="editForm.aiPrompt" show-word-limit type="textarea" maxlength="125" :rows="3"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleEdit()">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="detailDialogVisible" width="1200" title="审查项详情">
      <el-form ref="editFormRef" :inline="true" :rules="rules" :model="editForm" label-position="right" label-width="150px" style="padding: 16px 20px 0">
        <el-row>
          <el-col :span="12">
            <el-form-item label="并网阶段:" prop="stageId" style="width: 100%" required>
              <el-select v-model="editForm.stageId" @change="handleStageEditChange" disabled>
                <el-option v-for="item in stages" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="并网类型:" prop="categoryId" style="width: 100%" required>
              <el-select v-model="editForm.categoryId" @change="handleCategoryEditChange" disabled>
                <el-option v-for="item in categories" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="系统所属区域:" prop="systemBelongArea" style="width: 100%" required>
              <el-select v-model="editForm.systemBelongArea" multiple disabled>
                <el-option v-for="item in systemBelongAreas" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="系统分级分类:" prop="systemCategory" style="width: 100%" required>
              <el-select v-model="editForm.systemCategory" multiple disabled>
                <el-option v-for="item in systemCategories" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属单位:" prop="unitId" style="width: 100%" required>
              <el-select v-model="editForm.unitId" @change="handleUnitEditChange" disabled>
                <el-option v-for="item in unitOptions" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审查专业:" prop="optionGroup" style="width: 100%" required>
              <el-select v-model="editForm.optionGroup" disabled>
                <el-option v-for="item in optionGroups" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="审查项:" prop="optionName" style="width: 100%" required>
              <el-input v-model="editForm.optionName" show-word-limit type="textarea" maxlength="125" :rows="3" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审查点:" prop="pointName" style="width: 100%" required>
              <el-input v-model="editForm.pointName" show-word-limit type="textarea" maxlength="125" :rows="3" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="建议审查文档:" prop="docName" style="width: 100%" required>
              <el-input v-model="editForm.docName" show-word-limit type="textarea" maxlength="125" :rows="3" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="AI提示词:" prop="aiPrompt" style="width: 100%">
              <!-- <ElTagInput v-model="insertForm.aiPrompt" placeholder="输入多项按Enter键分隔"> </ElTagInput> -->
              <el-input v-model="editForm.aiPrompt" show-word-limit type="textarea" maxlength="125" :rows="3" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="审查关键词:" prop="keywords" style="width: 100%" required>
          <ElTagInput v-model="editForm.keywords" placeholder="输入多项按Enter键分隔" disabled='disabled'> </ElTagInput>
        </el-form-item>
        <el-form-item label="审查要求:" prop="checkRequire" style="width: 100%" required>
          <el-input v-model="editForm.checkRequire" show-word-limit type="textarea" maxlength="1024" :rows="3" disabled></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleEdit()">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ElTable, ElTableColumn, ElFormItem, ElForm, ElInput, ElButton, ElSelect, ElOption, ElPagination, ElContainer, ElHeader, ElMain, ElFooter, ElDialog, ElMessage, ElMessageBox, ElText, ElLink, ElTag, ElTooltip } from 'element-plus'
import { Search, Download, Aim, CircleCheck, Setting } from '@element-plus/icons-vue'
import { ref, reactive, computed, onMounted } from 'vue'
import { getGridCheckPointApi, updateGridCheckPointApi, deleteGridCheckPointApi } from '#/api'
import { useRouter } from 'vue-router'
import ElTagInput from './elTagInput.vue'
import { stages, systemCategories, systemBelongAreas, unitOptions, categories, optionGroups } from './fieldDict.js'
import { useAccessStore, useUserStore } from '@vben/stores'
const emit = defineEmits(['custom-event', 'sendCount'])
const router = useRouter()
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)
const table = ref(null)
const tableData = ref([])
const selectedRows = ref([])

const insertDialogVisible = ref(false)
const insertFormRef = ref()
const insertForm = reactive({
  aiPrompt: '',
  category: '',
  categoryId: '',
  checkExplain: '',
  checkRequire: '',
  docChapter: '',
  docName: '',
  keywords: '',
  optionGroup: '',
  optionName: '',
  pointName: '',
  provinceCode: '',
  remarks: '',
  stage: '',
  stageId: '',
  systemBelongArea: '',
  systemCategory: '',
  unitId: '',
  unitName: ''
})

const editDialogVisible = ref(false)
const editFormRef = ref()
const editForm = reactive({
  id: '',
  deviceOwnerId: '',
  cmdbId: '',
  url: '',
  deploySystemName: '',
  deviceOwner: '',
  deviceOwnerDeptName: '',
  primarySystemName: '',
  secondarySystemName: ''
})

const detailDialogVisible = ref(false)

const queryForm = reactive({
  categoryIdList: [],
  optionGroupList: [],
  stageList: [],
  subUnit: true,
  unitIds: [],
  systemBelongAreaList: [],
  systemCategoryList: []
})

/**
 * 查询列表
 */
const query = async () => {
  try {
    const response = await getGridCheckPointApi({
      ...queryForm,
      pageSize: pageSize.value,
      pageNo: currentPage.value
    })
    tableData.value = response.records
    total.value = response.total
  } catch {}
}

/**
 *
 *新增/编辑
 */

// 打开新增弹窗
function openInsertDialog() {
  Object.assign(insertForm, {
    aiPrompt: '',
    category: '',
    categoryId: '',
    checkExplain: '',
    checkRequire: '',
    docChapter: '',
    docName: '',
    keywords: '',
    optionGroup: '',
    optionName: '',
    pointName: '',
    provinceCode: '',
    remarks: '',
    stage: '',
    stageId: '',
    systemBelongArea: '',
    systemCategory: '',
    unitId: '',
    unitName: ''
  })
  insertDialogVisible.value = true
}

// 打开编辑弹窗
function openEditDialog(row) {
  editDialogVisible.value = true
  Object.assign(editForm, row)
  editForm.systemBelongArea = row.systemBelongArea.split(',')
  editForm.systemCategory = row.systemCategory.split(',')
}

// 打开详情弹窗
function openDetialsDialog(row) {
  detailDialogVisible.value = true
  Object.assign(editForm, row)
  editForm.systemBelongArea = row.systemBelongArea.split(',')
  editForm.systemCategory = row.systemCategory.split(',')
}

const rules = {
  stageId: [{ required: true, message: '请选择并网阶段', trigger: 'change' }],
  categoryId: [{ required: true, message: '请选择并网类型', trigger: 'change' }],
  systemBelongArea: [{ required: true, message: '请选择系统所属区域', trigger: 'change' }],
  systemCategory: [{ required: true, message: '请选择系统分级分类', trigger: 'change' }],
  unitId: [{ required: true, message: '请选择所属单位', trigger: 'change' }],
  optionGroup: [{ required: true, message: '请选择审查专业', trigger: 'change' }],
  optionName: [
    { required: true, message: '请输入审查项名称', trigger: 'blur' },
    { min: 1, max: 125, message: '审查项名称长度在 1 到 125 个字符', trigger: 'blur' }
  ],
  pointName: [
    { required: true, message: '请输入审查点名称', trigger: 'blur' },
    { min: 1, max: 125, message: '审查点名称长度在 1 到 125 个字符', trigger: 'blur' }
  ],
  docName: [
    { required: true, message: '请输入建议审查文档名称', trigger: 'blur' },
    { min: 1, max: 125, message: '文档名称长度在 1 到 125 个字符', trigger: 'blur' }
  ],
  aiPrompt: [{ min: 1, max: 125, message: 'AI提示词长度在 1 到 125 个字符', trigger: 'blur' }],
  keywords: [{ required: true, message: '请输入审查关键词', trigger: 'blur' }],
  checkRequire: [
    { required: true, message: '请输入审查要求', trigger: 'blur' },
    { min: 1, max: 1024, message: '审查要求长度在 1 到 1024 个字符', trigger: 'blur' }
  ]
}

// 新增数据提交
async function handleInsert() {
  try {
    insertFormRef.value.validate(async (valid) => {
      if (valid) {
        insertForm.systemBelongArea = insertForm.systemBelongArea.join(',')
        insertForm.systemCategory = insertForm.systemCategory.join(',')
        insertForm.keywords = insertForm.keywords.join('&&')
        const res = await updateGridCheckPointApi(insertForm)
        ElMessage.success('新增成功!')
        insertDialogVisible.value = false
        query()
      }
    })
  } catch (error) {}
}

// 编辑数据提交
async function handleEdit() {
  try {
    editFormRef.value.validate(async (valid) => {
      if (valid) {
        editForm.systemBelongArea = editForm.systemBelongArea.join(',')
        editForm.systemCategory = editForm.systemCategory.join(',')
        editForm.keywords = editForm.keywords.join('&&')
        const res = await updateGridCheckPointApi(editForm)
        ElMessage.success('更新成功!')
        editDialogVisible.value = false
        query()
      }
    })
  } catch (error) {}
}

/**
 *
 * 批量删除
 */

function handleDelete() {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择一条数据!')
    return
  }
  ElMessageBox.confirm('确定要删除选中的数据吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await deleteGridCheckPointApi(selectedRows.value)
      ElMessage.success('删除成功!')
      query()
    })
    .catch(() => {
      // ElMessage.info('已取消删除')
    })
}

/**
 * 分页/重置
 * @param val
 */
const handleSelectionChange = (val) => {
  selectedRows.value = val.map((item) => item.id)
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  query()
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  query()
}

function reset() {
  Object.assign(queryForm, {
    categoryIdList: [],
    optionGroupList: [],
    stageList: [],
    subUnit: true,
    unitIds: [],
    systemBelongAreaList: [],
    systemCategoryList: []
  })
  query()
}
onMounted(() => {
  query()
})

/**
 * 获取字段多个label
 * @param dicts
 * @param val
 */
function getLabels(dicts, val) {
  if (!val) return ''

  return val
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item)
    .map((value) => {
      const dict = dicts.find((item) => item.value === value)
      return dict ? dict.label : ''
    })
    .filter((label) => label) // 过滤空值
    .join('、')
}

/**
 * 监听选择更新
 */

// 新增
function handleStageChange(selectedValue) {
  const selectedStage = stages.find((item) => item.value === selectedValue)
  if (selectedStage) {
    insertForm.stage = selectedStage.label
  }
}

function handleCategoryChange(selectedValue) {
  const selectedVal = categories.find((item) => item.value === selectedValue)
  if (selectedVal) {
    insertForm.category = selectedVal.label
  }
}

function handleUnitChange(selectedValue) {
  const selectedVal = unitOptions.find((item) => item.value === selectedValue)
  if (selectedVal) {
    insertForm.unitName = selectedVal.label
  }
}

// 编辑
function handleStageEditChange(selectedValue) {
  const selectedStage = stages.find((item) => item.value === selectedValue)
  if (selectedStage) {
    editForm.stage = selectedStage.label
  }
}

function handleCategoryEditChange(selectedValue) {
  const selectedVal = categories.find((item) => item.value === selectedValue)
  if (selectedVal) {
    editForm.category = selectedVal.label
  }
}

function handleUnitEditChange(selectedValue) {
  const selectedVal = unitOptions.find((item) => item.value === selectedValue)
  if (selectedVal) {
    editForm.unitName = selectedVal.label
  }
}
</script>

<style scoped>
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
