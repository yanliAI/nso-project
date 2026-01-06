<template>
  <el-dialog :model-value="true" :title="props.title" @close="closeDialog">
    <el-form
      :inline="false"
      :model="form"
      label-position="right"
      style="padding: 0px 0px 0px 20px; text-align: center"
    >
      <el-form-item label="协同流程编码:">
        <el-input v-model="form.workflowCode" style="width: 300px;margin-left: 14px" maxlength="6" show-word-limit clearable />
      </el-form-item>
      <el-form-item label="协同流程名称:">
        <el-input v-model="form.workflowName" style="width: 300px;margin-left: 14px" maxlength="20" show-word-limit clearable />
      </el-form-item>
      <el-form-item label="业务流程排序号:">
        <el-input
          v-model="form.workflowOrder"
          style="width: 300px;"
          maxlength="5"
          show-word-limit
          clearable
          @input="handleInput"
        />
      </el-form-item>
      <!-- <el-form-item label="流程类型:">
        <el-select
          v-model="form.flowClassify"
          style="width: 300px; margin-left: 28px"
          placeholder="请选择流程类型"
        >
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <div style="width: 100%; height: 100%;">
          <el-button type="primary" @click="save">保存</el-button>
          <el-button type="primary" @click="closeDialog">取消</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  ElFormItem,
  ElForm,
  ElInput,
  ElButton,
  ElDialog,
} from 'element-plus';
import { onMounted, reactive } from 'vue';
import { requestClient } from '#/api/request';

const props = defineProps({
  title: String,
  rowInfo: Object
})

const emit = defineEmits(['switchDialog', 'query']);
const closeDialog = () => {
  emit('switchDialog', false);
  clear();
};
const form = reactive({
  workflowCode: '',
  workflowName: '',
  workflowOrder: undefined,
});

interface param {
  id: string;
  workflowCode: string;
  workflowName: string;
  workflowOrder: number;
}
async function saveDataApi(param: param) {
  return requestClient.post(
    import.meta.env.VITE_NSOSGZ + '/synWorkflowInfo/saveOrUpdate',
    param,
  );

}

const params: param = {
  id: '',
  workflowCode: '',
  workflowName: '',
  workflowOrder: undefined,
};

const save = async () => {
  if( props.title == '编辑'){
  params.id = props.rowInfo.id;
  }
  params.workflowCode = form.workflowCode;
  params.workflowName = form.workflowName;
  params.workflowOrder = form.workflowOrder;
  await saveDataApi(params);
  emit('switchDialog', false);
  emit('query');
  clear();
};

const clear = () => {
  form.workflowCode='';
  form.workflowName='';
  form.workflowOrder= undefined;
}

onMounted( () => {
  if( props.title == '编辑'){
    form.workflowCode = props.rowInfo.workflowCode;
    form.workflowName = props.rowInfo.workflowName;
    form.workflowOrder = props.rowInfo.workflowOrder;
  }
})

const handleInput = (value) => {
  form.workflowOrder = value.replace(/[^\d]/g, ''); // 确保只保留数字
}
</script>
