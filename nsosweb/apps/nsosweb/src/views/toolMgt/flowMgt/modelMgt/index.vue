<template>
  <div class="contain">
    <el-form :inline="true" :model="searchParams" label-position="right">
      <el-form-item label="模型标识:">
        <el-input
          v-model="searchParams.key"
          clearable
          style="width: 200px"
        ></el-input>
      </el-form-item>
      <el-form-item label="模型名称:">
        <el-input
          v-model="searchParams.name"
          style="width: 200px"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search" :icon="Search"
          >搜索</el-button
        >
        <el-button type="default" @click="reset" :icon="Refresh"
          >重置</el-button
        >
        <el-button type="primary" @click="addDialog" :icon="Plus"
          >新建模型</el-button
        ></el-form-item
      >
    </el-form>
    <div class="c-model__content">
      <el-table border :data="tableData" height="650px">
        <el-table-column prop="key" label="模型标识" width="180">
        </el-table-column>
        <el-table-column prop="name" label="模型名称" width="180">
        </el-table-column>
        <el-table-column prop="category" label="分类"> </el-table-column>
        <el-table-column prop="version" label="版本"> </el-table-column>
        <el-table-column
          width="320"
          prop="lastUpdateTime"
          :formatter="handleDateTime"
          label="创建时间"
        >
        </el-table-column>
        <el-table-column prop="address" width="320" label="操作">
          <template #default="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleDesign(scope.$index, scope.row)"
              >设计</el-button
            >
            <el-button
              v-if="!scope.row.deploymentId"
              size="mini"
              type="text"
              @click="handlePublish(scope.$index, scope.row)"
              >发布</el-button
            >
            <el-button
              size="mini"
              type="text"
              @click="handleExport(scope.$index, scope.row)"
              >导出</el-button
            >
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="padding-left: 20px; display: flex; margin-top: 20px">
      <ElPagination
        v-model:current-page="searchParams.pageNum"
        v-model:page-size="searchParams.pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="currentChange"
      />
    </div>
    <el-dialog title="新建模型" v-model="showAddDialog" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="模型标识" prop="key">
          <el-input
            v-model="form.key"
            style="width: 300px"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="模型名称" prop="name" required>
          <el-input
            v-model="form.name"
            style="width: 300px"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-input
            v-model="form.category"
            style="width: 300px"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            type="textarea"
            v-model="form.description"
            style="width: 300px"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleAddModel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  getModelLists,
  addModel,
  publishModelById,
  deleteModelById,
} from '#/api';
import {
  ElTable,
  ElTableColumn,
  ElContainer,
  ElFormItem,
  ElDialog,
  ElForm,
  ElInput,
  ElButton,
  ElSelect,
  ElRow,
  ElCol,
  ElPagination,
  ElMessage,
  ElMessageBox,
  ElCard,
  type FormInstance,
} from 'element-plus';
import {
  Search,
  Plus,
  Download,
  Delete,
  Refresh,
} from '@element-plus/icons-vue';
import {
  objectToFormData,
  normalizeDateTimeString,
  openWindow,
} from '#/utils/commonUtil.ts';

// 响应式数据
const tableData = ref([]);
const total = ref(0);
const showAddDialog = ref(false);

const formRef = ref();
const form = ref({
  key: '',
  name: '',
  category: '',
  description: '',
});
const searchParams = ref({
  name: '',
  key: '',
  pageSize: 10,
  pageNum: 1,
  orderByColumn: 'modelSort',
  isAsc: 'asc',
});

const rules = ref({
  name: [{ required: true, message: '模型名称不能为空', trigger: 'blur' }],
});
// 生命周期
onMounted(() => {
  getModelByParams(searchParams.value);
});

// 获取模型
const getModelByParams = async (params) => {
  try {
    await getModelLists(params).then((res) => {
      tableData.value = res.records;
      total.value = res.total;
    });
  } catch (error) {}
};

// 新增模型
const addDialog = () => {
  showAddDialog.value = true;
  formRef.value?.resetFields();
};

const handleAddModel = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      const formData = objectToFormData(form.value);
      addModel(formData).then((res) => {
        showAddDialog.value = false;
        getModelByParams(searchParams.value);
        ElMessage.success('添加成功!');
        form.value = {
          key: '',
          name: '',
          category: '',
          description: '',
        };
      });
    } else {
      // 验证失败，自动显示错误信息
      return false;
    }
  });
};

const handleDateTime = (row) => {
  const { createTime } = row;
  return normalizeDateTimeString(createTime);
};

// 设计
const handleDesign = (index, row) => {
  const path = '/editor?modelId=' + row.id;
  openWindow(path);
};

// 发布
const handlePublish = async (index, row) => {
  const id = row.id;
  await publishModelById(id).then((res) => {
    ElMessage.success('部署成功!');
    getModelByParams(searchParams.value);
  });
};

// 导出
const handleExport = (index, row) => {
  const { key, id } = row;
  const a = document.createElement('a');
  const url = `${import.meta.env.VITE_NSOSFS}/model/manage/export/` + id;
  a.href = url;
  a.click();
};

// 删除
const handleDelete = async (index, row) => {
  ElMessageBox.confirm('确定删除该条模型信息吗？', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    const id = row.id;
    deleteModelById(id).then((res) => {
      ElMessage.success('删除成功!');
      getModelByParams(searchParams.value);
    });
  });
};

const search = () => {
  getModelByParams(searchParams.value);
};

const reset = () => {
  searchParams.value.name = '';
  searchParams.value.key = '';
  getModelByParams(searchParams.value);
};

function currentChange(val: number) {
  searchParams.pageNum = val;
  getModelByParams(searchParams.value);
}

function handleSizeChange(val: number) {
  searchParams.pageSize = val;
  getModelByParams(searchParams.value);
}
</script>

<style scoped>
.contain {
  padding: 20px;
}
label {
  font-size: 14px;
  color: #606266;
  margin-right: 8px;
}
.search-bar {
  display: flex;
  margin-top: 8px;
  margin-left: 8px;
}
/* .el-input {
  display: inline-block;
  width: 300px;
  margin-right: 10px;
} */
/* .el-textarea {
  width: 300px;
} */
</style>
