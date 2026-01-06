<template>
  <div style="width: 100%; height: 100%">
    <div style="height: calc(100% - 50px)">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="值班模板信息" name="1">
          <template #title>
            <div class="primary flex items-center">
              <Expand class="h-3.5 w-3.5"></Expand>
              <div class="ml-1 font-bold">值班模板信息</div>
            </div>
          </template>
          <el-form label-width="auto" ref="formRef" :model="mydata.formdata" :rules="formRules" :inline="true" label-position="right" class="demo-form-inline" style="margin-top: 10px">
            <el-row>
              <el-col :span="24">
                <el-form-item label="模板名称:" prop="templateName" style="margin-bottom: 18px">
                  <el-input v-model="mydata.formdata.templateName" clearable />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="创建人:" prop="creatorName">
                  <el-input v-model="mydata.formdata.creatorName" :disabled="true" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="创建时间:" prop="createTime">
                  <el-date-picker v-model="mydata.formdata.createTime" type="datetime" :disabled="true" :formatter="tDateTimeFormat" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-collapse-item>
        <el-collapse-item title="关联单位组织角色" name="2">
          <template #title>
            <div class="primary flex items-center">
              <Expand class="h-3.5 w-3.5"></Expand>
              <div class="ml-1 font-bold">关联单位组织角色</div>
            </div>
          </template>
          <div class="dutytemplate-rela-layout">
            <div class="dutytemplate-rela-op">
              <el-button type="primary" size="small" class="ml-4" :icon="Plus" @click="addRela">添加</el-button>
              <el-button type="primary" size="small" class="ml-4" :icon="Delete" @click="batchDelete">批量删除</el-button>
            </div>
            <div class="dutytemplate-rela-table">
              <el-table
                ref="mytable"
                :data="mydata.tableData"
                border
                size="small"
                @selection-change="handleSelectionChange"
                style="height: 100%"
                stripe
                :header-cell-style="{
                  backgroundColor: '#F2F3F5',
                  color: '#666666',
                  fontSize: '14px',
                  height: '40px',
                  textAlign: 'center'
                }"
              >
                <el-table-column type="selection" align="center" />
                <el-table-column type="index" label="#" align="center" width="40" />
                <el-table-column prop="deptName" label="单位名称" width="240" />
                <el-table-column prop="orgName" label="组织角色" width="150" />
                <el-table-column prop="manName" label="关联人员角色" width="280" />
                <el-table-column label="操作" align="center" width="60">
                  <template #default="scope">
                    <el-button link type="danger" size="small" @click="removeRela(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div style="height: 50px; justify-content: center" class="flex">
      <el-button type="primary" :icon="DocumentChecked" @click="handleSubmit">保存</el-button>
      <el-button :icon="Close" @click="cancel">取消</el-button>
    </div>

    <Modal class="top-[180px] h-[450px] w-[760px]" title="单位组织角色关联信息" :footer="false" :closeOnClickModal="false" :draggable="true">
      <div style="width: 100%; height: 100%; overflow: hidden">
        <div style="height: calc(100% - 50px)">
          <el-form label-width="auto" ref="formRef2" :model="formdata2" :rules="formRules2" :inline="true" label-position="right" class="demo-form-inline" style="margin-top: 3px">
            <el-collapse v-model="activeNames2">
              <el-collapse-item title="选择单位信息" name="1">
                <template #title>
                  <div class="primary flex items-center">
                    <Expand class="h-3.5 w-3.5"></Expand>
                    <div class="ml-1 font-bold">选择单位信息</div>
                  </div>
                </template>
                <div style="width: 100%; height: 30px; margin-top: 25px; margin-bottom: 5px">
                  <el-form-item label="单位名称:" prop="deptCode" style="width: 100%">
                    <el-select v-model="formdata2.deptCode" multiple placeholder="选择单位" collapse-tags collapse-tags-tooltip :max-collapse-tags="2" remote reserve-keyword clearable filterable>
                      <el-option v-for="item in dropList.NSOS_ORG_NAME_SJ" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                  </el-form-item>
                </div>
              </el-collapse-item>
              <el-collapse-item title="选择组织角色信息" name="2">
                <template #title>
                  <div class="primary flex items-center">
                    <Expand class="h-3.5 w-3.5"></Expand>
                    <div class="ml-1 font-bold">选择组织角色信息</div>
                  </div>
                </template>
                <div style="width: 100%; height: 170px; overflow: auto">
                  <el-form-item label="组织角色:" prop="orgCode">
                    <el-checkbox-group v-model="formdata2.orgCode">
                      <el-checkbox v-for="(item, index) in dutyorgItems" :value="item.value" :label="item.value">{{ item.label }}</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-form>
        </div>
        <div style="height: 50px; justify-content: center" class="flex">
          <el-button type="primary" :icon="DocumentChecked" @click="handleSubmit2">保存</el-button>
          <el-button :icon="Close" @click="close">取消</el-button>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script setup>
import { useUserStore } from '@vben/stores'
import { onMounted, reactive, ref } from 'vue'
import { useDropStore } from '#/store'
import { requestClient } from '#/api/request'
import { ElAnchor, ElAnchorLink, ElCollapse, ElCollapseItem, ElNotification, ElMessage, ElMessageBox, ElTable, ElTableColumn, ElPagination, ElMain, ElContainer, ElHeader, ElFooter, ElCheckboxGroup, ElCheckbox } from 'element-plus'
import { DocumentChecked, Close, Tickets, Finished, Expand, CaretRight, Bottom, Plus, Edit, Delete } from '@element-plus/icons-vue'
import { useVbenModal } from '@vben/common-ui'
import { tDateTimeFormat } from '#/utils/commonUtil.ts'
import { getDetail, getDutyOrgItems } from './dutytemplateMethod.ts'
const activeNames = ref(['1', '2'])
const activeNames2 = ref(['1', '2'])
const currentId = defineModel('id')
const templateId = ref('')
const emit = defineEmits(['closeDiaLog', 'query'])
const dropList = reactive({})
const dutyorgItems = reactive([])

const mytable = ref()
const selectedRows = ref([])

const formRef = ref(null)
// 验证规则
const formRules = reactive({
  templateName: [
    { required: true, message: '模板名称不能为空', trigger: 'blur' },
    { max: 50, message: '长度不能超过100个字符', trigger: 'blur' }
  ],
  templateRemark: [
    { required: true, message: '模板描述不能为空', trigger: 'blur' },
    { max: 200, message: '长度不能超过200个字符', trigger: 'blur' }
  ]
})
const formRef2 = ref(null)
// 验证规则
const formRules2 = reactive({
  deptCode: [{ required: true, message: '单位名称不能为空', trigger: 'blur' }],
  orgCode: [{ required: true, message: '组织角色不能为空', trigger: 'blur' }]
})

const mydata = reactive({
  formdata: {},
  tableData: []
})
const formdata2 = reactive({
  deptCode: [],
  orgCode: []
})
onMounted(async () => {
  const dropStore = useDropStore()
  const dropType = ['NSOS_ORG_NAME_SJ']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)
  templateId.value = currentId.value
  queryDetail()
  queryOrgItems()
})

const queryDetail = async () => {
  const data = await getDetail(templateId.value)
  mydata.formdata = data.template
  mydata.tableData = data.relaList
}

const queryOrgItems = async () => {
  const data = await getDutyOrgItems()
  Object.assign(dutyorgItems, data)
}

const handleSubmit = async () => {
  try {
    // 执行表单验证
    await formRef.value.validate()

    // 验证通过后提交逻辑
    save()
  } catch (error) {
    ElMessage.error('请检查表单填写是否正确')
  }
}

const save = async () => {
  try {
    await requestClient.post(import.meta.env.VITE_NSOSGZ + '/dutyTemplate/add', mydata.formdata)
    ElMessage.success('保存成功！')
    emit('closeDiaLog')
    emit('query')
  } catch {
    ElMessage.error('保存失败！')
  }
}

const handleSelectionChange = (val) => {
  selectedRows.value = val
}

const batchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要删除的数据')
    return
  }
  ElMessageBox.confirm('确定要删除这些数据吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      delRela(selectedRows.value)
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}

const handleSubmit2 = async () => {
  try {
    // 执行表单验证
    await formRef.value.validate()
    await formRef2.value.validate()

    // 验证通过后提交逻辑
    save2()
  } catch (error) {
    ElMessage.error('请检查表单填写是否正确')
  }
}

const save2 = async () => {
  try {
    let data = {
      template: mydata.formdata,
      deptCode: formdata2.deptCode,
      orgCode: formdata2.orgCode
    }
    const id = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/dutyTemplate/addRela', data)
    ElMessage.success('保存成功！')
    close()
    templateId.value = id
    queryDetail()
    emit('query')
  } catch {
    ElMessage.error('保存失败！')
  }
}

const removeRela = (row) => {
  ElMessageBox.confirm('确定要删除吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      let arr = []
      arr.push(row)
      delRela(arr)
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}
const delRela = async (arr) => {
  try {
    await requestClient.post(import.meta.env.VITE_NSOSGZ + '/dutyTemplateOrgRela/delRela', arr)
    ElMessage.success('删除成功！')
    queryDetail()
  } catch (error) {
    ElMessage.error('删除失败！')
  }
}

const cancel = () => {
  emit('closeDiaLog')
}

const addRela = async () => {
  try {
    // 执行表单验证
    await formRef.value.validate()

    modalApi.open()
  } catch (error) {
    ElMessage.error('请检查表单填写是否正确')
  }
}

const close = () => {
  modalApi.close()
  formdata2.deptCode = []
  formdata2.orgCode = []
}

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close()
    formdata2.deptCode = []
    formdata2.orgCode = []
  }
})
</script>
<style scoped>
:deep(.el-collapse-item__header) {
  height: 35px;
  padding-left: 8px;
  line-height: normal;
  background: #d9e9fc;
}

.primary {
  color: hsl(var(--primary));
}

.dutytemplate-rela-layout {
  width: 100%;
  height: 300px;
}

.dutytemplate-rela-op {
  width: 100%;
  height: 40px;
  padding: 6px 0;
}

.dutytemplate-rela-table {
  width: 100%;
  height: calc(100% - 40px);
}
</style>
