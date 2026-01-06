<template>
  <Page auto-content-height>
    <el-container class="h-full bg-white">
      <el-aside style="width: 12%">
        <el-tree
          style="max-width: 600px"
          :data="data.treeData"
          :default-expanded-keys="data.defaultExpandedKeys"
          node-key="id"
          @node-click="handleNodeClick"
        />
      </el-aside>
      <el-main>
        <el-container class="h-full">
          <el-header height="45px" style="padding-top: 6px">
            <el-form
              label-width="auto"
              ref="ruleFormRef"
              :model="data.formData"
              :inline="true"
              label-position="right"
              class="demo-form-inline"
            >
              <el-row>
                <el-col :span="4">
                  <el-form-item label="所属单位:" prop="orgId">
                    <el-select v-model="data.formData.orgId" clearable>
                      <el-option v-for="item in dropList.NSOS_DCP_ORG" :key="item.value" :label="item.label" :value="item.value"/>
                      </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="姓名:" prop="personName">
                    <el-input
                      v-model="data.formData.personName"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="电话:" prop="phone">
                    <el-input
                      v-model="data.formData.phone"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-button
                    type="primary"
                    class="ml-4"
                    :icon="Search"
                    @click="onQueryClick"
                    >查询</el-button
                  >
                  <el-button
                    type="primary"
                    class="ml-4"
                    :icon="Plus"
                    @click="add"
                    >新增</el-button
                  >
                  <el-button
                    type="primary"
                    class="ml-4"
                    :icon="Finished"
                    @click="save"
                    >保存</el-button
                  >
                </el-col>
              </el-row>
            </el-form>
          </el-header>
          <el-main style="height: calc(100% - 90px)">
            <el-table
              :data="data.tableData"
              border
              size="small"
              style="height: 100%"
              stripe :header-cell-style="{ backgroundColor: '#F2F3F5', color: '#666666', fontSize: '14px', height: '40px', textAlign: 'center' }"
            >
              <el-table-column
                type="index"
                fixed
                width="40"
                label="#"
                align="center"
              />
              <el-table-column prop="positionName" label="小组名" fixed align="center"> 
              </el-table-column>
              <el-table-column prop="personName" label="姓名" fixed align="center">
                <template #default="scope">
                  <span v-show="scope.$index !== data.editIndex">
                    {{ scope.row.personName }}
                  </span>
                  <el-input
                    v-show="scope.$index === data.editIndex"
                    v-model="scope.row.personName"
                    maxlength="10"
                    @change="handleChange(scope.row)"
                  >
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column prop="phone" label="电话" fixed align="center">
                <template #default="scope">
                  <span v-show="scope.$index !== data.editIndex">
                    {{ scope.row.phone }}
                  </span>
                  <el-input
                    v-show="scope.$index === data.editIndex"
                    v-model="scope.row.phone"
                    maxlength="11"
                    @input="handleNumberInput(scope.row)"
                    @change="handleChange(scope.row)"
                  >
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column prop="updatorId"label="最后修改人" fixed align="center">
              </el-table-column>
              <el-table-column prop="updateTime" label="最后修改时间" :formatter="tDateTimeFormat" fixed align="center">
              </el-table-column>
              <el-table-column prop="orgId" label="所属单位" fixed align="center" column-key="NSOS_DCP_ORG" :formatter="formatDrop">
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template #default="scope">
                  <span style="color: #006be6;cursor: pointer;" @click="edit(scope.row)">修改记录</span>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
          <el-footer height="45px">
            <el-pagination
              :current-page="data.pageInfo.pageNo"
              :page-size="data.pageInfo.pageSize"
              class="mt-1"
              :total="data.pageInfo.total"
              :page-sizes="[20, 50, 100, 200]"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="currentChange"
            ></el-pagination>
          </el-footer>
        </el-container>
      </el-main>
    </el-container>
  </Page>
</template>

<script lang="ts" setup>
import { Page } from '@vben/common-ui';
import { onMounted, reactive, ref } from 'vue';
import { Search, Plus,Finished, Position  } from '@element-plus/icons-vue';
import {
  ElForm,
  ElFormItem,
  ElRow,
  ElCol,
  ElTable,
  ElTableColumn,
  ElPagination,
  ElMain,
  ElContainer,
  ElAside,
  ElHeader,
  ElFooter,
  ElMessage,
  ElMessageBox,
  ElTree
} from 'element-plus';
import { useDropStore } from '#/store';
import { tDateTimeFormat, formatDrop } from '#/utils/commonUtil.ts';
import { getTreeData, getDataList, saveDataList } from './commandMgtMethod.ts'

const data = reactive({
  formData: {},
  tableData: [],
  treeData: [],
  updateList: [],
  defaultExpandedKeys: [],
  hasUnsavedRow: false,
  editIndex: -1,
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0,
  },
});
const dropList = reactive({});

onMounted( async() => {
  const dropStore = useDropStore();
  const dropType = ['NSOS_DCP_ORG']
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);
  query();
  data.treeData = await getTreeData();
})

const query = async () => {
  if(data.hasUnsavedRow) {
    ElMessage.warning('数据未保存');
    return;
  }
  data.editIndex = -1;
  data.formData.pageSize = data.pageInfo.pageSize;
  data.formData.pageNo = data.pageInfo.pageNo;
  const { list, count, pageNo } = await getDataList(data.formData);
  data.tableData = list;
  data.pageInfo.pageNo = pageNo;
  data.pageInfo.total = count;
}

function onQueryClick() {
  data.formData.positionName = null;
  query();
}

function add(){
  // if(data.hasUnsavedRow) {
  //   ElMessage.warning('数据未保存');
  //   return;
  // }
  if(!data.formData.orgId) {
    ElMessage.warning('请选择所属单位');
    return;
  }
  if (!data.tableData) {
    data.tableData = [
      {
        orgId: data.formData.orgId,
        positionName: data.formData.positionName,
        key: JSON.stringify(new Date()),
      },
    ];
  } else {
    data.tableData.push({
      orgId: data.formData.orgId,
      positionName: data.formData.positionName,
      key: JSON.stringify(new Date()),
    });
  }
  data.hasUnsavedRow = true;
  data.editIndex = data.tableData.length-1;
}

const save = async () => {
  let errors = [];
  data.updateList.forEach((row) => {
    if(!row.personName || row.personName.length < 2 || row.personName.length >10) {
      errors.push(`第${row.rowId+1}行：姓名必须为2-10个字符`);
    }
    if(!row.phone || row.phone.toString().length != 11) {
      errors.push(`第${row.rowId+1}行：请输入正确的手机号码`);
    }
  })
  if(errors.length > 0) {
    ElMessage.error({
      message: errors.join('<br>'),
      dangerouslyUseHTMLString: true,
    })
  }else {
    await saveDataList(data.updateList);
    data.updateList = [];
    data.hasUnsavedRow = false;
    query();
  }
}

function edit(row) {
  data.editIndex = data.tableData.indexOf(row);
  data.hasUnsavedRow = true;
}

function handleChange(row) {
  if (!data.updateList.includes(row)) {
    row.rowId = data.tableData.indexOf(row);
    data.updateList.push(row);
  }
}

const handleSizeChange = (val) => {
  data.pageInfo.pageSize = val;
  query();
}

const currentChange = (val) => {
  data.pageInfo.pageNo = val;
  query();
}

const handleNodeClick = async (node: Tree) => {
  if(data.hasUnsavedRow) {
    ElMessage.warning('数据未保存');
    return;
  }
  if( node.parentId === '1') {
    data.formData.orgId = node.id;
    data.formData.positionName = null;
  }
  else if( node.children.length === 0) {
    data.formData.orgId = node.parentId;
    data.formData.positionName = node.label;
  }
  query();
};

const handleNumberInput = (row) => {
  row.phone = row.phone.replace(/[^\d]/g,'');
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
