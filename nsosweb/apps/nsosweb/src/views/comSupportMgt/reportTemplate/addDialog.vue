<template>
  <el-dialog :model-value="true" @close="closeDialog" >
    <el-form
      ref="addForm"
      label-width="auto"
      :inline="true"
      :model="form"
      :rules="rules"
      label-position="right"
      class="addForm-inline"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="模板编号:" prop="templateCode">
            <el-input v-model="form.templateCode" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="模板名称:" prop="templateName">
            <el-input v-model="form.templateName" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="dialogRow">
        <el-col :span="12">
          <el-form-item label="报表维度:" prop="dimension">
            <el-select v-model="form.dimension" filterable clearable>
              <el-option v-for="item in dropList.NSOS_REPORT_DIMENSION" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="年月:" prop="reportMon">
            <el-date-picker v-if="form.dimension === 'Y'" v-model="form.reportMon"type="year" @change="handleDateChange"/>
            <el-date-picker v-if="form.dimension !== 'Y'" v-model="form.reportMon" type="month" @change="handleDateChange"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="dialogRow">
        <el-col :span="12">
          <el-form-item label="适用单位:" prop="suitUnit">
            <el-select v-model="form.suitUnit" filterable clearable>
              <el-option
                v-for="item in suitUnit"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否启用:" prop="isEnable">
            <el-select v-model="form.isEnable" filterable clearable>
              <el-option v-for="item in dropList.NSOS_REPORT_ISENABLE" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="dialogRow">
        <el-col :span="12">
          <el-form-item label="创建时间:" prop="createTime">
            <el-input v-model="form.createTime" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建人:" prop="creatorId">
            <el-input v-model="form.creatorId" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="dialogRow">
        <el-col :span="12">
          <el-form-item label="修改时间:" prop="updateTime">
            <el-input v-model="form.updateTime" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="修改人:" prop="updatorId">
            <el-input v-model="form.updatorId" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="dialogRow">
        <el-col :span="24">
          <el-form-item label="备注:" prop="remark">
            <el-input v-model="form.remark" type="textarea" resize="none" :rows="3" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="dialogRow">
        <el-col>
            <el-form-item label="附件:">
              <el-button type="primary" class="ml-0" :icon="Upload" @click="attachClick">附件上传</el-button>
            </el-form-item>
        </el-col>
      </el-row>
      <div style="width: 100%; height: 130px">
        <AttachList ref="attachFileRef" :parentId="form.templateCode" :showPreview="false"></AttachList>
      </div>
      <el-row>
        <el-col :span="6" :offset="10">
          <el-form-item>
            <el-button type="primary" @click="save(addForm)">保存</el-button>
            <el-button type="primary" @click="closeDialog">取消</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

  </el-dialog>

    <Modal class="w-[700px] " title="附件编辑" :footer="false" :closeOnClickModal="false" :draggable="true">
      <AttachFile :parentId="form.templateCode" @afterUpload="attachFileRef.queryData()" close="addClose"></AttachFile>
    </Modal>
</template>

<script lang="ts" setup>
import {
  ElSelect,
  ElFormItem,
  ElForm,
  ElInput,
  ElButton,
  ElDialog,
  ElUpload,
  ElMessage,
  ElRow,
  ElCol,
  ElDatePicker,
} from 'element-plus';
import { onMounted, reactive, ref, nextTick } from 'vue';
import { requestClient } from '#/api/request';
import { genFileId } from 'element-plus';
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus';
import type { ComponentSize, FormInstance, FormRules } from 'element-plus';
import dayjs from 'dayjs';
import { useDropStore } from '#/store';
import AttachFile from '../../basic/attach/attachFile.vue'
import AttachList from '../../basic/attach/attachList.vue'
import { Search, Delete, Plus, Download, Upload } from '@element-plus/icons-vue';
import { useVbenModal } from '@vben/common-ui';

const dropList: any = reactive({});
const attachFileRef = ref()

onMounted(async () => {
  const dropStore = useDropStore();
  await dropStore.initDrops(['NSOS_REPORT_DIMENSION', 'NSOS_REPORT_ISENABLE']);
  dropStore.get(dropList, ['NSOS_REPORT_DIMENSION', 'NSOS_REPORT_ISENABLE']);
  if (props.rowInfo.createTime) {
    form.createTime = dayjs(new Date(props.rowInfo.createTime)).format(
      'YYYY-MM-DD HH:mm:ss',
    );
  }
  if (props.rowInfo.updateTime) {
    form.updateTime = dayjs(new Date(props.rowInfo.createTime)).format(
      'YYYY-MM-DD HH:mm:ss',
    );
  }
});

const upload = ref<UploadInstance>();
const addForm = ref<FormInstance>();

const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value!.handleStart(file);
};
const submitUpload = () => {
  upload.value!.submit();
};

const props = defineProps({
  rowInfo: Object,
});
const emit = defineEmits(['switchDialog', 'query']);

const form = reactive(Object.assign({}, props.rowInfo));

const closeDialog = () => {
  emit('switchDialog', false);
};

const rules = reactive<FormRules<any>>({
  templateName: [
    {
      required: true,
      message: '请输入名称',
      trigger: 'change',
    },
  ],
  dimension: [
    {
      required: true,
      message: '请选择维度',
      trigger: 'change',
    },
  ],
  reportMon: [
    {
      required: true,
      message: '请选择年月',
      trigger: 'change',
    },
  ],
  // suitUnit: [
  //   {
  //     required: true,
  //     message: '请选择适用单位',
  //     trigger: 'change',
  //   },
  // ],
  isEnable: [
    {
      required: true,
      message: '请选择是否启用',
      trigger: 'change',
    },
  ],
  // upload: [{ required: true, message: '请上传附件', trigger: 'change' }],
});

async function saveDataApi(param: Object) {
  return requestClient.post(
    import.meta.env.VITE_NSOSZH + '/reportTemplate/save',
    param,
  );
}

const handleDateChange = () => {
  form.reportMon = form.reportMon.getTime();
};

const save = (addForm: FormInstance | undefined) => {
  if (!addForm) return;
  addForm.validate((valid, fields) => {
    if (valid) {
      saveDataApi(form);
      emit('query');
      emit('switchDialog', false);
    } else {
      ElMessage.warning('请检查必填项');
    }
  });
};

const attachClick = () => {
  modalApi.open()
}

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
});
</script>

<style scoped>
.dialogRow {
  margin-top: 6px;
}
</style>
