<template>
  <el-container class="h-full">
    <el-header height="150px">
      <el-form label-width="auto" ref="formRef" :model="formdata" :rules="formRules" :inline="true" label-position="right" class="demo-form-inline">
        <el-row>
          <el-col :span="12">
            <el-form-item label="组织角色名称:" prop="orgName" style="margin-bottom: 18px">
              <el-input v-model="formdata.orgName" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序号:" prop="orgRoleSort" style="margin-bottom: 18px">
              <el-input v-model="formdata.orgRoleSort" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="组织角色说明:" prop="orgRemark">
              <el-input v-model="formdata.orgRemark" type="textarea" :rows="2" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="关联人员角色:" prop="manCode">
              <el-select v-model="formdata.manCode" multiple placeholder="选择人员角色" collapse-tags collapse-tags-tooltip :max-collapse-tags="6" remote reserve-keyword clearable filterable style="width: 100%" @change="handleManChange">
                <el-option v-for="item in dutymanItems" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-main style="height: calc(100% - 200px)">
      <el-table :data="tableData" border size="small" style="height: 100%">
        <el-table-column type="index" width="40" label="#" align="center" />
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="manCode" label="人员角色" :formatter="formatManDrop" align="center" />
        <el-table-column prop="posRoleSort" align="center">
          <template #header>
            <span>人员排序号 <span style="color: red">*</span></span>
          </template>
          <template #default="scope">
            <el-input v-model="scope.row.posRoleSort" @change="handleChange(scope.row)"> </el-input>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer height="40px" style="justify-content: center; align-items: center" class="flex">
      <el-button type="primary" :icon="DocumentChecked" @click="handleSubmit">保存</el-button>
      <el-button :icon="Close" @click="cancel">取消</el-button>
    </el-footer>
  </el-container>
</template>
<script lang="ts" setup>
import { useUserStore } from '@vben/stores'
import { onMounted, reactive, ref } from 'vue'
import { useDropStore } from '#/store'
import { formatDrop } from '#/utils/commonUtil.ts'
import { requestClient } from '#/api/request'
import { ElMessage, ElMessageBox } from 'element-plus'
import { DocumentChecked, Close } from '@element-plus/icons-vue'
import { useVbenModal } from '@vben/common-ui'
import { getDetail, getDutyManItems, getManSort } from './dutyorgMethod.ts'
const currentId = defineModel('id')
const emit = defineEmits(['closeDiaLog', 'query'])

const dutymanItems = reactive([])

const formRef = ref(null)
// 验证规则
const formRules = reactive({
  orgName: [
    { required: true, message: '组织角色名称不能为空', trigger: 'blur' },
    { max: 50, message: '长度不能超过100个字符', trigger: 'blur' }
  ],
  orgRoleSort: [{ required: true, message: '请输入组织角色排序号', trigger: 'blur' }],
  manCode: [{ required: true, message: '请选择人员角色', trigger: 'blur' }],
  orgRemark: []
})

const formdata = reactive({})
const tableData = ref([])
const updateList = ref([])

onMounted(async () => {
  queryDetail()
  await queryManItems()
})

const queryDetail = async () => {
  const data = await getDetail(currentId.value)
  tableData.value = data.dutyManInfoList
  Object.assign(formdata, data)
}

const queryManItems = async () => {
  const data = await getDutyManItems()
  Object.assign(dutymanItems, data)
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

function handleChange(row) {
  if (!updateList.value.includes(row)) {
    updateList.value.push(row)
  }
}

function handleManChange(value) {
  if(!tableData.value) {
    tableData.value = []
  }
  if (value.length > tableData.value.length) {
    const manCodeList = tableData.value.map(item => item.manCode);
    value.forEach(item => {
      if(!manCodeList.includes(item)) {
        tableData.value.push({manCode: item})
      }
    });
  } else if (value.length < tableData.value.length) {
    for(let i = tableData.value.length-1; i>=0 ; i--) {
      if(!value.includes(tableData.value[i].manCode)) {
        tableData.value.splice(i,1);
      }
    }
  }
}

function formatManDrop(row: any, column: any, cellValue: any) {
  const option = dutymanItems.find((opt) => opt.value == cellValue)
  return option ? option.label : ''
}

const save = async () => {
  try {
    formdata.dutyManInfoList = tableData.value;
    if(formdata.dutyManInfoList) {
      const posRoleList= [];
      for (const item of formdata.dutyManInfoList) {
        if(item.manCode && !item.posRoleSort){
          ElMessage.error("请输入人员排序号");
          return;
        }
        if(posRoleList.includes(item.posRoleSort)){
          ElMessage.error("人员排序号重复");
          return;
        }else {
          posRoleList.push(item.posRoleSort);
        }
      }
    }
    await requestClient.post(import.meta.env.VITE_NSOSGZ + '/dutyOrg/add', formdata)
    ElMessage.success('保存成功！')
    emit('closeDiaLog')
    emit('query')
  } catch {
    ElMessage.error('保存失败！')
  }
}

const cancel = () => {
  emit('closeDiaLog')
}
</script>
<style scoped>
.head-d {
  width: 100%;
  height: 55px;
  border-bottom: 1px solid #ebebeb;
}
</style>
