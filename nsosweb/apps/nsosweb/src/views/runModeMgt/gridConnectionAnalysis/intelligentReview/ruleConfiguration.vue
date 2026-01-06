<template>
  <div class="rule-con">
    <el-form
      ref="formRef"
      :inline="true"
      :model="formData"
      :rules="rules"
      label-position="right"
      label-width="auto"
      style="padding: 16px 20px 0"
    >
      <div class="mb-4">
        <h2 class="sub-title flex items-center">配置文件信息</h2>
        <el-button
          v-if="!addTag"
          class="ml-4"
          type="primary"
          @click="getGridConnectOtherConfig"
          >加载其他配置</el-button
        >
      </div>
      <el-row :gutter="30">
        <el-col :span="6">
          <el-form-item label="配置文件名称：" prop="configName">
            <el-input v-model="formData.configName" clearable maxlength="50" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="30">
        <el-col :span="6">
          <el-form-item label="创建人：">
            <el-input v-model="formData.creatorId" clearable disabled />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="创建时间：">
            <el-date-picker
              v-model="formData.createTime"
              type="datetime"
              placeholder="请选择"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              style="width: 100%"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="最后更新人：">
            <el-input v-model="formData.updaterId" clearable disabled />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="最后更新时间：">
            <el-date-picker
              v-model="formData.updateTime"
              type="datetime"
              placeholder="请选择"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              style="width: 100%"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider />
      <div class="mb-4">
        <h2 class="sub-title flex items-center">命名相似度配置</h2>
      </div>
      <el-form-item label="相似度筛查：" prop="similarRange">
        <el-input
          v-model="formData.similarBegin"
          placeholder="开始值"
          clearable
          style="width: 200px"
          maxlength="6"
          @input="($event) => handleDecimalInput($event, 'similarBegin')"
        >
          <template #append>%</template>
        </el-input>
        <span class="ml-2 mr-2">~</span>
        <el-input
          v-model="formData.similarEnd"
          placeholder="结束值"
          clearable
          style="width: 200px"
          maxlength="6"
          @input="($event) => handleDecimalInput($event, 'similarEnd')"
        >
          <template #append>%</template>
        </el-input>
      </el-form-item>
      <div class="mb-4">
        <h2 class="sub-title flex items-center">命名不校验词过滤配置</h2>
        <el-form-item>
          <el-button
            class="ml-4"
            type="primary"
            :icon="Plus"
            @click="addKeywordFilterRule"
            >添加</el-button
          >
          <el-button
            class="ml-4"
            type="danger"
            :icon="Delete"
            @click="deleteFilterRules"
            >删除</el-button
          >
          <el-button type="primary" @click="toggleFilterRules">{{
            switchState == '1' ? '一键停止' : '一键启用'
          }}</el-button>
        </el-form-item>
      </div>
      <el-table
        border
        stripe
        ref="table"
        :data="formData.tableData"
        @selection-change="handleSelectionChange"
        max-height="300"
      >
        <el-table-column type="selection" />
        <el-table-column type="index" align="center" />
        <el-table-column prop="keywordContent" label="过滤词" align="center">
          <template #default="{ row }">
            <el-input
              v-if="row.editable"
              v-model="row.keywordContent"
              clearable
              style="width: 200px"
            >
            </el-input>
            <span v-else>{{ row.keywordContent }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="creatorId" label="添加人" align="center">
          <template #default="{ row }">
            <!-- <el-input
              v-if="row.editable"
              v-model="row.creatorId"
              clearable
              style="width: 200px"
            >
            </el-input>
            <span v-else>{{ row.creatorId }}</span> -->
            {{ row.creatorId }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="添加时间" align="center">
          <template #default="{ row }">
            <!-- <el-date-picker
              v-if="row.editable"
              v-model="row.createTime"
              type="datetime"
              placeholder="请选择"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              style="width: 100%"
            />
            <span v-else>{{ row.createTime }}</span> -->
            {{ row.createTime }}
          </template>
        </el-table-column>
        <el-table-column prop="useFlag" label="规则启用" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.useFlag"
              :disabled="!row.editable"
              style="--el-switch-on-color: #13ce66"
              active-value="1"
              inactive-value="0"
            />
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template #default="{ row }">
            <el-button
              v-if="!row.editable"
              type="primary"
              link
              @click="row.editable = true"
              >编辑</el-button
            >
            <el-button
              v-if="row.editable"
              type="primary"
              link
              @click="row.editable = false"
              >取消</el-button
            >
            <el-button
              v-if="row.editable"
              type="primary"
              link
              @click="row.editable = false"
              >保存</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <div class="mb-4 mt-4 flex">
        <h2 class="sub-title mr-2 flex items-center">编码校验配置</h2>
        <el-tooltip placement="bottom" effect="light">
          <template #content>
            编码校验规则<br />
            1、重复性校验启
          </template>
          <el-icon><QuestionFilled style="color: #999" /> </el-icon>
        </el-tooltip>
      </div>
      <el-form-item label="编码校验：" prop="numCheck">
        <el-switch
          v-model="formData.numCheck"
          style="--el-switch-on-color: #13ce66"
          active-value="1"
          inactive-value="0"
        />
      </el-form-item>

      <div class="mb-4 mt-4 flex">
        <h2 class="sub-title mr-2 flex items-center">附件审查配置</h2>
        <el-tooltip placement="bottom" effect="light">
          <template #content>
            附件审查:<br />
            1、附件数量;<br />
            2、附件名称与表格文档名称是否能对应上,
          </template>
          <el-icon><QuestionFilled style="color: #999" /> </el-icon>
        </el-tooltip>
      </div>
      <el-row>
        <el-col :span="4">
          <el-form-item label="附件缺失校验：" prop="attCheck">
            <el-switch
              v-model="formData.attCheck"
              style="--el-switch-on-color: #13ce66"
              active-value="1"
              inactive-value="0"
            />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="附件章节审查：" prop="wordCheck">
            <el-switch
              v-model="formData.wordCheck"
              style="--el-switch-on-color: #13ce66"
              active-value="1"
              inactive-value="0"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <div class="mb-4 mt-4 flex">
        <h2 class="sub-title mr-2 flex items-center">其他工单信息</h2>
        <el-tooltip placement="bottom" effect="light">
          <template #content>
            其他信息审查:<br />
            1、并网工单的基本信息与台账进行比对(新系统的分级分类、新建or续建、业务部门、版本号、名称等)。<br />
            2、并网系统是否报送运行方式(年度/月度)
          </template>
          <el-icon><QuestionFilled style="color: #999" /> </el-icon>
        </el-tooltip>
      </div>
      <el-row>
        <el-col :span="4">
          <el-form-item label="台账比对校验：" prop="ledgerCheck">
            <el-switch
              v-model="formData.ledgerCheck"
              style="--el-switch-on-color: #13ce66"
              active-value="1"
              inactive-value="0"
            />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="方式报送：" prop="reportCheck">
            <el-switch
              v-model="formData.reportCheck"
              style="--el-switch-on-color: #13ce66"
              active-value="1"
              inactive-value="0"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <Modal
      class="h-[650px] w-[1200px]"
      title="规则配置列表"
      :footer="false"
      :closeOnClickModal="false"
      :draggable="true"
    >
      <el-table border stripe :data="ruleTableData" max-height="500">
        <el-table-column type="index" align="center" />
        <el-table-column prop="configName" label="文件名称" align="center">
        </el-table-column>
        <el-table-column prop="similarBegin" label="相似度范围" align="center">
          <template #default="{ row }">
            {{ `${row.similarBegin}% ~ ${row.similarEnd}%` }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="过滤词" align="center">
          <template #default="{ row }">
            {{ row.keywords }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center">
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template #default="{ row }">
            <el-button type="primary" link @click="enableConfig(row)"
              >启用</el-button
            >
            <el-button type="danger" link @click="deleteGridConnectConfig(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import {
  ElTable,
  ElTableColumn,
  ElFormItem,
  ElForm,
  ElInput,
  ElButton,
  ElSelect,
  ElOption,
  ElRow,
  ElCol,
  ElDialog,
  ElMessage,
  ElMessageBox,
  ElLink,
  ElTag,
  ElDivider,
} from 'element-plus';
import {
  Plus,
  Delete,
  Search,
  RefreshLeft,
  Download,
  Monitor,
  CirclePlus,
  CircleCheck,
  QuestionFilled,
} from '@element-plus/icons-vue';
import { Page } from '@vben/common-ui';
import { ref, reactive, computed, onMounted, nextTick } from 'vue';
import { useVbenModal } from '@vben/common-ui';
import {
  getGridConnectDefaultConfigApi,
  saveGridConnectConfigApi,
  deleteGridConnectConfigApi,
  getGridConnectOtherConfigApi,
  enableGridConnectConfigApi,
} from '#/api';
import { useUserStore } from '@vben/stores';
import dayjs from 'dayjs';

defineOptions({
  name: 'GridConnectionRuleCon',
});

const emit = defineEmits(['removeTab']);
const addTag = defineModel('addTag');
const formRef = ref();
const formData = ref({
  tableData: [],
  numCheck: '1',
  attCheck: '1',
  wordCheck: '1',
  ledgerCheck: '1',
  reportCheck: '1',
  similarBegin: '',
  similarEnd: '',
});
const switchState = ref('1');
const ruleTableData = ref([]);
const selectedRows = ref([]);
const configId = ref('');
const nowTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
const userStore = useUserStore();

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
});
// 自定义校验规则 - 验证相似度两个输入框都不为空
const validateSimilarRange = (rule, value, callback) => {
  if (
    (parseFloat(formData.value.similarBegin) !== 0 &&
      !formData.value.similarBegin) ||
    (parseFloat(formData.value.similarEnd) !== 0 && !formData.value.similarEnd)
  ) {
    callback(new Error('相似度不能为空'));
  } else if (
    parseFloat(formData.value.similarBegin) >
    parseFloat(formData.value.similarEnd)
  ) {
    callback(new Error('相似度开始值不能大于结束值'));
  } else if (
    parseFloat(formData.value.similarBegin) > 100 ||
    parseFloat(formData.value.similarEnd) > 100
  ) {
    callback(new Error('相似度不能大于100'));
  } else {
    callback();
  }
};
const rules = reactive({
  configName: [{ required: true, message: '请输入配置文件名称' }],
  similarRange: [
    { required: true, validator: validateSimilarRange, trigger: 'blur' },
  ],
  numCheck: [{ required: true }],
  attCheck: [{ required: true }],
  wordCheck: [{ required: true }],

  ledgerCheck: [{ required: true }],
  reportCheck: [{ required: true }],
});

const handleDecimalInput = (value, inputKey) => {
  // 数字和最多2位小数
  const regex = /^\d*\.?\d{0,2}$/;
  if (!regex.test(value)) {
    // 不符合规则时截取有效部分
    const match = value.match(/^-?\d*\.?\d{0,2}/);
    formData.value[inputKey] = match ? match[0] : '';
  }
};

const addKeywordFilterRule = () => {
  formData.value.tableData.push({
    unitId: new Date().getTime() + '',
    editable: true,
    useFlag: '1',
    creatorId: userStore.userInfo?.username,
    createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  });
};
const deleteFilterRules = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要删除的数据');
    return;
  }
  ElMessageBox.confirm('确认是否删除?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    formData.value.tableData = formData.value.tableData.filter(
      (item) => !selectedRows.value.includes(item),
    );
  });
};

const toggleFilterRules = () => {
  formData.value.tableData = formData.value.tableData.map((item) => {
    item.useFlag = switchState.value == '1' ? '0' : '1';
    return { ...item };
  });
  switchState.value = switchState.value == '1' ? '0' : '1';
};
const handleSelectionChange = (val) => {
  selectedRows.value = val;
};

const getDefaultConfig = async () => {
  try {
    let result = await getGridConnectDefaultConfigApi();
    formData.value = result;
    formData.value.tableData = result.filterWordList;
    configId.value = result.id;
  } catch {}
};

const saveGridConnectConfig = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid, fields) => {
    if (valid) {
      let params = { ...formData.value };
      params.tableData = '';
      params.filterWordList = formData.value.tableData;
      try {
        let result = await saveGridConnectConfigApi(params);
        ElMessage.success('保存成功！');
        getDefaultConfig();
        emit('removeTab', 'addRuleConfig');
      } catch {}
    } else {
      ElMessage.warning('请输入必填项！');
    }
  });
};

const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields();
    formData.value.tableData = [];
    formData.value.similarBegin = '';
    formData.value.similarEnd = '';
  }
};

const deleteGridConnectConfig = (row) => {
  ElMessageBox.confirm('确认删除此规则吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      let params = { configId: configId.value };
      if (row?.id) {
        params.configId = row?.id;
      }

      let result = await deleteGridConnectConfigApi(params);
      ElMessage.success('删除成功！');
      getDefaultConfig();
      if (row?.id) {
        getGridConnectOtherConfig();
      }
    } catch {}
  });
};

const getGridConnectOtherConfig = async () => {
  modalApi.open();
  try {
    let result = await getGridConnectOtherConfigApi();
    ruleTableData.value = result.map((item) => {
      let keywords = item.filterWordList
        .map((filterWord) => filterWord.keywordContent)
        ?.join(',');
      return { ...item, keywords };
    });
  } catch {}
};

const enableConfig = async (row) => {
  ElMessageBox.confirm('确认启用此规则吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      let result = await enableGridConnectConfigApi({
        configId: row.id,
      });
      ElMessage.success('启用成功！');
      modalApi.close();
      getDefaultConfig();
    } catch {}
  });
};

defineExpose({ saveGridConnectConfig, deleteGridConnectConfig, resetForm });

onMounted(() => {
  if (!addTag.value) {
    getDefaultConfig();
  } else {
    formData.value.creatorId = userStore.userInfo?.username;
    formData.value.createTime = nowTime;
  }
});
</script>

<style scoped lang="scss">
.rule-con {
  max-height: calc(100vh - 180px);
  overflow: auto;

  // scrollbar-width: none; /* Firefox隐藏滚动条 */
  // -ms-overflow-style: none; /* IE和Edge隐藏滚动条 */
  // /* Chrome和Safari隐藏滚动条 */
  // &::-webkit-scrollbar {
  //   display: none;
  // }
}
.el-form {
  width: calc(100% - var(--scrollbar-width));
  --scrollbar-width: 17px;
}
.el-form-item {
  width: 100%;
}
.sub-title {
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: bold;
}
.sub-title::before {
  content: ' ';
  display: inline-block;
  width: 5px;
  height: 16px;
  margin-right: 10px;
  background: #3296fa;
}
</style>
