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

// 评分细则信息和合并
function mergeData(originalData, scoreData) {
  // 过滤并合并：只保留有匹配的项
  const mergedData = originalData
    .map((item) => {
      const matchedScore = scoreData.find(
        (scoreItem) => scoreItem.scoreItemId === item.id
      );
      // 只有匹配时才返回合并后的对象
      if (matchedScore) {
        return {
          ...item,
          score: matchedScore.score,
          remark: matchedScore.remark,
        };
      }
      return null; // 无匹配时返回 null
    })
    .filter(Boolean); // 过滤掉 null 值

  return mergedData;
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
    console.log('sss', detailParams.tableName);

    return true; // 返回成功状态
  } catch (error) {
    console.error('请求失败:', error);
    return false; // 返回失败状态
  }
}

function getOriginData(val) {
  queryParams.id = val.id;
  queryParams.name = val.name;
  queryParams.company = val.company;
  queryParams.score = Number(val.score);
  getScoreItem();
}

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
    <el-table
        :data="detailParams.tableName"
        border
        size="small"
        height="650px"
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
        <el-table-column prop="score" align="center" label="得分" width="80px" />
        <el-table-column prop="remark" align="center" label="备注" />
      </el-table>
  </div>
</template>

<style lang="less" scoped>
.scoring-table {
  /* 表头样式 */
  :deep(.el-table__header) th {
    background-color: #f3f3f3; /* 表头背景色 */
    font-size: 14px;
    height: 50px !important;
    color: black;
    font-family: Microsoft YaHei;
  }

  // 表体
  // :deep(.el-table__body) tr {
  //   font-size: 14px;
  //   font-family: Microsoft YaHei;
  // }
  :deep(.el-table) td {
    border-right: none !important;
    /* 设置列的边框颜色和粗细 */
    font-size: 14px;
    font-weight: 500;
    font-family: Microsoft YaHei;
  }

  :deep(.el-table .cell) {
    word-break: break-all;
    line-height: 23px;
    padding: 10px;
  }
  // 整表外侧
  :deep(.el-table) {
    border-left: 1px solid #fff;
  }
}

</style>
