<template>
  <div>
    <el-card shadow="never">
      <div style="display: flex; align-items: flex-start; margin: 25px">
        <div style="width: 60px">
          <div class="flow-title">1</div>
        </div>
        <div style="font-size: 18px; font-weight: 400">
          <div style="height: 30px; line-height: 30px; color: black">开始</div>
          <div style="height: 30px; line-height: 30px">{{ flowData[0]?.username }}</div>
          <div style="height: 30px; line-height: 30px">创建时间：{{ flowData[0]?.createdtime }}</div>
        </div>
      </div>
      <div v-for="(item, index) in flowData">
        <div style="display: flex; align-items: flex-start; margin: 25px">
          <div style="width: 60px">
            <div class="flow-title" :class="{ 'unfinished-bg': item.statusString !== '已完结' }">
              {{ index + 2 }}
            </div>
          </div>
          <div style="font-size: 18px; font-weight: 400">
            <div style="height: 30px; line-height: 30px; color: black">{{ item.taskname }}</div>
            <div style="height: 30px; line-height: 30px">{{ item.username }}</div>
            <div style="height: 30px; line-height: 30px">到达时间：{{ item.createdtime }}</div>
            <div style="height: 30px; line-height: 30px" v-if="item?.signtime">签收时间：{{ item.signtime }}</div>
            <div style="height: 30px; line-height: 30px" v-if="item?.statusString === '已完结'">处理完成时间：{{ item.closetime }}</div>
            <div style="height: 30px; line-height: 30px"  v-if="item?.statusString === '已完结' && item?.createdtime && item?.closetime && item?.createdtime !== item?.closetime">停留时间：{{ calculateDuration(item.createdtime,   item.closetime)  }}</div>
             <div style="height: 30px; line-height: 30px"  v-if="item?.statusString !== '已完结'">停留时间：{{ calculateDuration(item.createdtime,   now)  }}</div>
            <div style="height: 30px; line-height: 30px" v-if="item.statusString === '已完结'">处理时长：正常</div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script setup>
import { ElTable, ElAffix, ElTableColumn, ElRow, ElCard, ElCol, ElFormItem, ElForm, ElInput, ElButton, ElSelect, ElOption, ElContainer, ElAside, ElHeader, ElMain, ElFooter, ElDialog, ElMessage, ElMessageBox, ElText, ElLink, ElCollapse, ElCollapseItem, ElTag } from 'element-plus'
import { ref, reactive, computed, onMounted, nextTick, watch } from 'vue'
import { calculateDuration } from '#/utils/commonUtil.ts'
import { getydTaskProcessApi } from '#/api'
import moment from 'moment';


const oid = defineModel('oid')
const pid = defineModel('pid')
const flowData = ref([])
const now = ref(moment().format('YYYY-MM-DD HH:mm:ss'));

onMounted(() => {
  getFlowDetail()
  
})

watch(pid, (newVal) => {
  getFlowDetail()
});

// 获取流程详情数据
async function getFlowDetail() {
  if(!pid.value || !oid.value) return
  const res = await getydTaskProcessApi({
    data: {
      paramList: [
        {
          key: 'status',
          value: '1,2,3,7',
          type: 'in'
        },
        {
          conn: 'and',
          conditions: [
            {
              key: 'oid',
              value: oid.value,
              type: 'eq',
              conn: 'or'
            },
            {
              key: 'pid',
              value: pid.value,
              type: 'eq',
              conn: 'or'
            }
          ]
        },
        {
          key: 'type',
          value: '0,1,2,3',
          type: 'in'
        }
      ]
    }
  })
  flowData.value = processTaskDataStrict(res.data.data) 
}

// 流程数据处理，分组聚合
function processTaskDataStrict(data) {
  // 1. 按 taskname + createdtime 联合分组
  const grouped = data.reduce((acc, item) => {
    const groupKey = `${item.taskname}_${item.createdtime}`;
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(item);
    return acc;
  }, {});

  // 2. 处理每个分组
  const result = Object.keys(grouped).map(groupKey => {
    const group = grouped[groupKey];

    // 去重并收集 username
    const usernameSet = new Set();
    group.forEach(item => usernameSet.add(item.username));

    // 检查所有项的状态
    const allFinished = group.every(item => item.statusString === '已完结');
    const finalStatus = allFinished ? '已完结' : '办理中';

    // 取第一个元素作为基础
    const firstItem = { ...group[0] };
    firstItem.username = Array.from(usernameSet).join('，');
    firstItem.statusString = finalStatus;

    return firstItem;
  });

  // 3. 排序：相同 createdtime 的元组，已完结的排在前面
  result.sort((a, b) => {
    if (a.createdtime === b.createdtime) {
      // 如果 createdtime 相同，已完结的排在前面
      if (a.statusString === '已完结' && b.statusString !== '已完结') return -1;
      if (a.statusString !== '已完结' && b.statusString === '已完结') return 1;
    }
    return 0; // 其他情况保持原顺序
  });

  return result;
}
</script>

<style scoped>
.main-card {
  :deep(.el-card__body) {
    padding-top: 0;
  }
}

.flow-title {
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  background-color: #2a71c9;
  border-radius: 50%;
  color: white;
  font-size: 20px;
  font-weight: 500;
}

.unfinished-bg {
  background-color: #e7693a;
}
</style>
