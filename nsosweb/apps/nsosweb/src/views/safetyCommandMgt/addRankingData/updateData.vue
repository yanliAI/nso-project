<script setup lang="ts">
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
  ElCard,
  ElMessageBox,
  type FormInstance,
} from 'element-plus';
import { reactive, ref, onMounted, nextTick } from 'vue';
import {
  searchRankingData,
  deleteRankingData,
  searchScoreItem,
  updateRankingData,
  searchPersonScoreItem,
} from '#/api';
const emit = defineEmits(['submit-success', 'submit-cancel']);
defineExpose({ getOriginData });
const props = defineProps({
  type: {
    type: Number,
    default: 1, // 默认值
  },
});
const queryForm = ref<FormInstance>();
const queryParams = reactive({
  id: '',
  name: '',
  company: '',
  score: '',
  type: props.type,
});
const detailParams = reactive({
  name: '',
  tableName: [],
});

const rules = reactive({
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' },
  ],
  company: [
    { required: true, message: '请输入公司名称', trigger: 'blur' },
    { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' },
  ],
  score: [
    { required: true, message: '请输入得分', trigger: 'blur' },
    { type: 'number', message: '得分必须为数字', trigger: 'blur' },
  ],
});

async function updateData(obj) {
  try {
    await updateRankingData(obj);
    return true; // 返回成功状态
  } catch (error) {
    console.error('请求失败:', error);
    return false; // 返回失败状态
  }
}
function mergeData(originalData, scoreData) {
  // 遍历原始数据，匹配 scoreItemId 并合并 score 和 remark
  const  mergedData = originalData.map((item) => {
    // 在 scoreData 中查找匹配项（scoreItemId 对应原始数据的 id）
    const matchedScore = scoreData.find(
      (scoreItem) => scoreItem.scoreItemId === item.id,
    );
    // 如果找到匹配项，则合并 score 和 remark
    if (matchedScore) {
      return {
        ...item, // 保留原始数据的所有字段
        score: matchedScore.score, // 合并 score
        remark: matchedScore.remark, // 合并 remark
      };
    }
    // 无匹配项则返回原始数据
    return item;
  });
  return mergedData;
}

function  transformData() {
// 过滤出包含 score 的项，并映射为目标格式
const recordDTOList = detailParams.tableName
  .filter(item => item.score !== undefined) // 仅保留有 score 的项
  .map(item => ({
    scoreItemId: item.id,
    score: item.score,
    remark: item.remark
  }));
  return recordDTOList;
}

const originalData = ref([]);
async function getScoreItem() {
  const obj = {
    pageNo: 1,
    pageSize: 100,
    attackDefense: props.type === 1 ? '1' : '2',
  };

  try {
    const res = await searchScoreItem(obj); // 确保 await 等待插入完成
    originalData.value = res.list;
    getPersonScoreItem();
    return true; // 返回成功状态
  } catch (error) {
    console.error('请求失败:', error);
    return false; // 返回失败状态
  }
}
async function getPersonScoreItem() {
  const obj = {
    pageNo: 1,
    pageSize: 100,
    rankId: queryParams.id,
  };
  try {
    const res = await searchPersonScoreItem(obj); // 确保 await 等待插入完成
    detailParams.tableName = mergeData(originalData.value, res.list);

    return true; // 返回成功状态
  } catch (error) {
    console.error('请求失败:', error);
    return false; // 返回失败状态
  }
}

// 表格得分输入校验，只允许为正整数
function handleScoreInput(value, row) {
  if (isNaN(value) || value < 0) {
    row.score = row._lastValidScore || '';
    ElMessage.warning('得分必须为数字类型,且大于0')
    return;
  }

}

async function submitForm() {
  if (!queryForm.value) return;
  // 单独处理验证
  const isValid = await queryForm.value.validate().catch(() => false);
  if (!isValid) return;
  try {
    const list = transformData();
    queryParams.recordDTOList = list;
    const isSuccess = await updateData(queryParams);
    if (isSuccess) {
      ElMessage.success('修改成功!');
      emit('submit-success');
    } else {
      ElMessage.success('修改失败!');
    }
  } catch (error) {}
};

function getOriginData(val) {
  queryParams.id = val.id;
  queryParams.name = val.name;
  queryParams.company = val.company;
  queryParams.score = Number(val.score);
  getScoreItem();
}

const cancelForm = () => {
  emit('submit-cancel');
};

// 处理表格项合并
const handleSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
  const data = detailParams.tableName;
  const prop = column.property; // 当前列的prop属性

  // 需要合并的列（可根据实际需求调整）
  const mergeColumns = ['type', 'examine'];

  if (mergeColumns.includes(prop)) {
    let prevRow = data[rowIndex - 1];
    const currentValue = row[prop];

    // 如果当前值与上一行相同，则隐藏
    if (prevRow && prevRow[prop] === currentValue) {
      return { rowspan: 0, colspan: 0 };
    }

    // 计算连续相同值的行数
    let count = 1;
    while (
      rowIndex + count < data.length &&
      data[rowIndex + count][prop] === currentValue
    ) {
      count++;
    }
    return { rowspan: count, colspan: 1 };
  }
};
</script>
<template>
  <div>
    <el-card style="margin: 0px 10px 0 10px" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>基础信息</span>
        </div>
      </template>
      <div>
        <el-form
          ref="queryForm"
          :model="queryParams"
          :rules="rules"
          label-width="auto"
        >
          <el-row>
            <el-col :span="8" v-if="props.type === 1">
              <el-form-item
                label="姓名:"
                prop="name"
                style="width: 100%"
                required
                v-if="props.type === 1"
              >
                <el-input
                  v-model="queryParams.name"
                  placeholder="请输入姓名"
                  clearable
                  style="width: 250px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="公司:"
                prop="company"
                style="width: 100%"
                required
              >
                <el-input
                  v-model="queryParams.company"
                  placeholder="请输入公司名称"
                  clearable
                  style="width: 250px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8"> </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
    <el-card
      style="margin: 20px 10px 0 10px"
      shadow="hover"
      class="scoring-card"
    >
      <template #header>
        <div class="card-header">
          <span>评分细则</span>
        </div>
      </template>
      <el-table
        :data="detailParams.tableName"
        border
        size="small"
        height="450px"
        :span-method="handleSpanMethod"
        class="scoring-table"
      >
        <el-table-column
          type="index"
          align="center"
          label="序号"
          width="60px"
        />
        <el-table-column prop="type" align="center" label="类别" />
        <el-table-column prop="examine" align="center" label="考核" />
        <el-table-column prop="itemName" align="center" label="细项" />
        <el-table-column
          prop="description"
          align="center"
          label="考核方式(各单位基础分1000分)"
        />
        <el-table-column prop="score" align="center" label="得分" width="80px">
          <template #default="{ row }">
            <el-input
              v-model.number="row.score"
              size="small"
              @input="(val) => handleScoreInput(val, row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="remark" align="center" label="备注" width="80px">
          <template #default="{ row }">
            <el-input v-model.number="row.remark" size="small" />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <div style="display: flex; margin-right: 10px">
      <div style="margin-top: 10px; margin-left: auto">
        <el-button type="primary" @click="submitForm()"
          >确定</el-button
        >
        <el-button @click="cancelForm()">取消</el-button>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
// :deep(.el-form-item__label){
//     width: 100px;
//     text-align: right;
//     vertical-align: middle;
//     float: left;
//     font-size: 14px;
//     color: #4a4b4d;
//     padding-top: 5px;
// }
// :deep(.el-input__wrapper){
//   height: 40px;
// }
// :deep(.el-input__inner){
//     padding: 0px 15px;
// }
</style>
