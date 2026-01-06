<template>
  <el-dialog :model-value="true" :title="props.title" @close="closeDialog">
    <el-form
      :inline="true"
      :model="form"
      style="
        width: 100%;
        height: 100%;
        padding: 0px 0px 0px 20px;
        text-align: left;
      "
    >
      <el-form-item label="业务环节编码：">
        <el-input v-model="form.busiTacheCode" style="width: 120px" maxlength="6" show-word-limit clearable />
      </el-form-item>
      <el-form-item label="业务环节名称：">
        <el-input v-model="form.busiTacheName" style="width: 120px" maxlength="20" show-word-limit clearable />
      </el-form-item>
      <!-- <el-form-item label="协同流程编码：">
          <el-input
            v-model="form.workflowCode"
            style="width: 120px"
            clearable
          />
        </el-form-item> -->
      <el-form-item label="协同流程名称：">
        <el-select v-model="form.workflowCode" placeholder="输入" style="width: 120px" clearable>
          <el-option
            v-for="item in dropList.NSOS_WORKFLOW_NAME"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="排序号：">
        <el-input
          v-model="form.busiTacheOrder"
          style="width: 120px; margin-left: 42px"
          maxlength="5"
          show-word-limit
          clearable
          @input="handleInput"
        />
      </el-form-item>
      <el-form-item label="处理时长：">
        <el-input
          v-model="form.processTime"
          style="width: 120px; margin-left: 28px"
          maxlength="3"
          show-word-limit
          clearable
          @input="handleProcessInput"
        />
      </el-form-item>
      <el-form-item label="已办理环节显示颜色：">
        <el-color-picker v-model="form.processedColour" clearable />
      </el-form-item>
      <el-form-item label="办理中环节显示颜色：">
        <el-color-picker v-model="form.processingColour" clearable />
      </el-form-item>
      <el-form-item label="未办理环节显示颜色：" style="margin-left: 46px">
        <el-color-picker v-model="form.unprocessedColour" clearable />
      </el-form-item>
      <div style="text-align: center">
        <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
          <el-button type="primary" @click="closeDialog">取消</el-button>
        </el-form-item>
      </div>
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
  ElColorPicker,
} from 'element-plus';
import { reactive, onMounted } from 'vue';
import { requestClient } from '#/api/request';
import { useDropStore } from '#/store';


const dropList: any = reactive({});
const props = defineProps({
  title: String,
  rowInfo: Object,
});
const emit = defineEmits(['switchDialog', 'query']);
const closeDialog = () => {
  emit('switchDialog', false);
  clear();
};
const form = reactive({
  busiTacheName: '',
  busiTacheCode: '',
  workflowCode: '',
  busiTacheOrder: undefined,
  processTime: undefined,
  processedColour: '',
  processingColour: '',
  unprocessedColour: '',
});

interface param {
  id: string;
  busiTacheName: string;
  busiTacheCode: string;
  workflowCode: string;
  busiTacheOrder: number;
  processedColour: string;
  processingColour: string;
  unprocessedColour: string;
  processTime: number;
}
async function saveDataApi(param: param) {
  return requestClient.post(
    import.meta.env.VITE_NSOSGZ + '/synWorkflowTache/saveOrUpdate',
    param,
  );
}

const params: param = {
  id: '',
  busiTacheName: '',
  busiTacheCode: '',
  workflowCode: '',
  processedColour: '',
  processingColour: '',
  unprocessedColour: '',
  processTime: undefined,
  busiTacheOrder: undefined,
};

const save = async () => {
  if( props.title == '编辑'){
  params.id = props.rowInfo.id;
  }
  params.busiTacheName = form.busiTacheName;
  params.busiTacheCode = form.busiTacheCode;
  params.workflowCode = form.workflowCode;
  params.processedColour = form.processedColour;
  params.processingColour = form.processingColour;
  params.unprocessedColour = form.unprocessedColour;
  params.processTime = form.processTime;
  params.busiTacheOrder = form.busiTacheOrder;
  await saveDataApi(params);
  emit('switchDialog', false);
  emit('query');
  clear();
};

const clear = () => {
  form.busiTacheName = '';
  form.busiTacheCode = '';
  form.workflowCode = '';
  form.processedColour = '';
  form.processingColour = '';
  form.unprocessedColour = '';
  form.processTime = undefined;
  form.busiTacheOrder = undefined;
};

onMounted( async() => {
  const dropStore = useDropStore();
  await dropStore.initDrops(['NSOS_WORKFLOW_NAME']);
  dropStore.get(dropList, ['NSOS_WORKFLOW_NAME']);
  if (props.title == '编辑') {
    form.busiTacheName = props.rowInfo.busiTacheName;
    form.busiTacheCode = props.rowInfo.busiTacheCode;
    form.workflowCode = props.rowInfo.workflowCode;
    form.processedColour = props.rowInfo.processedColour;
    form.processingColour = props.rowInfo.processingColour;
    form.unprocessedColour = props.rowInfo.unprocessedColour;
    form.processTime = props.rowInfo.processTime;
    form.busiTacheOrder = props.rowInfo.busiTacheOrder;
  }
});

const handleInput = (value) => {
  form.busiTacheOrder = value.replace(/[^\d]/g, ''); // 确保只保留数字
}

const handleProcessInput = (value) => {
  form.processTime = value.replace(/[^\d]/g, ''); // 确保只保留数字
}
</script>
