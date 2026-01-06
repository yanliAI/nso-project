<template>
  <div class="app-container p-4">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="用户组名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入用户组名"
          clearable
          style="width: 200px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleQuery"
          >查询</el-button
        >
        <el-button type="primary" :icon="Plus" @click="handleAddGroup('')"
          >新增</el-button
        >
        <el-button
          type="danger"
          :icon="Delete"
          :disabled="multiple"
          @click="handleDelete('')"
          >删除</el-button
        >

        <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table
      ref="tables"
      :data="list"
      border
      stripe
      @selection-change="handleSelectionChange"
      height="700px"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column type="index" width="50" align="center" />
      <el-table-column
        label="用户组ID"
        align="center"
        prop="id"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="用户组名"
        align="center"
        prop="name"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="用户组类型" align="center" prop="type" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-button
            type="primary"
            link
            :icon="Edit"
            @click="handleAddGroup(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="primary"
            link
            :icon="SetUp"
            @click="handleAllocateUser(scope.row)"
            >分配用户</el-button
          >
          <el-button
            type="danger"
            link
            :icon="Delete"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <div class="mt-2">
      <el-pagination
        v-model:current-page="queryParams.pageNo"
        v-model:page-size="queryParams.pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <Modal
      class="w-[600px]"
      :title="dialogTitle"
      :footer="false"
      :draggable="true"
    >
      <el-form
        class="mt-4"
        ref="addFormRef"
        :model="dialogData"
        :rules="addFormRules"
        label-position="right"
        label-width="auto"
      >
        <el-form-item label="用户组名:" prop="name">
          <el-input
            style="width: 100%"
            v-model="dialogData.name"
            clearable
            maxlength="50"
          />
        </el-form-item>
        <el-form-item label="用户组类型:" prop="type">
          <el-input
            style="width: 100%"
            v-model="dialogData.type"
            clearable
            maxlength="50"
          />
        </el-form-item>
      </el-form>
      <div class="my-2 flex justify-end">
        <el-button type="" @click="modalApi.close">取消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确认</el-button>
      </div>
    </Modal>

    <ModalB
      class="w-[1000px]"
      title="分配用户"
      :footer="false"
      :draggable="true"
    >
      <AllocateUsers
        ref="allocateUsersRef"
        :groupId="editGroupBean.id"
      ></AllocateUsers>
      <div class="my-2 flex justify-end">
        <el-button type="" @click="modalBApi.close">取消</el-button>
        <el-button type="primary" @click="saveMembership">确认</el-button>
      </div>
    </ModalB>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useVbenModal } from '@vben/common-ui';
import {
  getHandlerGroupApi,
  updateHandlerGroupApi,
  deleteHandlerGroupApi,
  saveHandlerGroupUsersApi,
  updateHandlerGroupUsersApi,
} from '#/api';

import {
  ElForm,
  ElFormItem,
  ElInput,
  ElSelect,
  ElOption,
  ElDatePicker,
  ElButton,
  ElRow,
  ElCol,
  ElTable,
  ElTableColumn,
  ElDialog,
  ElMessage,
  ElMessageBox,
  ElPagination,
  ElTransfer,
} from 'element-plus';
import {
  Search,
  Refresh,
  Delete,
  Download,
  Edit,
  View,
  Plus,
  SetUp
} from '@element-plus/icons-vue';

import AllocateUsers from './allocateUsers.vue';

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
});
const [ModalB, modalBApi] = useVbenModal({
  onCancel() {
    modalBApi.close();
  },
});

// 选中数组
const ids = ref([]);
// 非多个禁用
const multiple = ref(true);
// 总条数
const total = ref(0);
// 表格数据
const list = ref([]);
// 查询参数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 20,
});

// 表单引用
const queryForm = ref(null);
const tables = ref(null);

const dialogTitle = ref('');
const addFormRef = ref();
const dialogData = ref({});
const editGroupBean = ref({});
const addFormRules = ref({
  name: [{ required: true, message: '请输入用户组名' }],
  type: [{ required: true, message: '请输入用户组类型' }],
});

const allocateUsersRef = ref();

async function getList() {
  try {
    let result = await getHandlerGroupApi(queryParams);
    list.value = result.records;
    total.value = result.total;
  } catch {}
}

/** 删除按钮操作 */
async function handleDelete(row) {
  let operIds = undefined;
  let tips = '';
  if (row) {
    operIds = [row.id];
    tips = '是否确认删除此用户组？';
  } else {
    operIds = ids.value;
    tips = '是否确认删除选中的用户组？';
  }
  ElMessageBox.confirm(tips, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      let result = await deleteHandlerGroupApi(operIds);
      if (result) {
        getList();
        ElMessage.success('删除成功！');
      }
    })
    .catch(() => {});
}

const saveMembership = async () => {
  let usrIds = allocateUsersRef.value.selectUsers;
  console.log('userIds=', usrIds);
  try {
    const result = await updateHandlerGroupUsersApi({
      groupId: editGroupBean.value.id,
      usrIds,
    });
    if (result) {
      ElMessage.success('保存成功！');
      modalBApi.close();
      getList();
    }
  } catch {}
};

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.pageNo = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  resetForm(queryForm.value);
  queryParams.pageNo = 1;
  getList();
}

const handleSizeChange = (val) => {
  queryParams.pageSize = val;
  getList();
};

const handleCurrentChange = (val) => {
  queryParams.pageNo = val;
  getList();
};

// 重置表单
function resetForm(formEl) {
  if (!formEl) return;
  formEl.resetFields();
}

const handleAddGroup = (row) => {
  if (row) {
    dialogTitle.value = '修改流程管理用户组';
    dialogData.value = { ...row };
  } else {
    dialogTitle.value = '新增流程管理用户组';
    dialogData.value = {};
  }
  modalApi.open();
};

const handleAllocateUser = (row) => {
  editGroupBean.value = row;
  modalBApi.open();
};

const saveOrUpdate = async () => {
  if (!addFormRef.value) {
    return;
  }
  await addFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      const params = { ...dialogData.value };
      try {
        const result = await updateHandlerGroupApi(params);
        if (result) {
          ElMessage.success('保存成功！');
          modalApi.close();
          getList();
        }
      } catch {}
    } else {
      ElMessage.warning('请输入必填项！');
    }
  });
};

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.id);
  multiple.value = !selection.length;
}

onMounted(() => {
  getList();
});
</script>

<style scoped lang="less">
.dialog-form .el-form-item {
  width: 100%;
}
</style>
