<template>
  <div>
    <div class="flex items-center" style="margin: 10px 0">
      <h2 style="margin: 0 20px; font-weight: bold; color: #333">
        关联信息系统清单：
      </h2>
      <el-button
        type="success"
        @click="addRow(formData.taskRelateOSList, tableRef1)"
        v-if="!disabledValue"
        :icon="Plus"
        >新增</el-button
      >
    </div>
    <el-table
      border
      stripe
      ref="tableRef1"
      :data="formData.taskRelateOSList"
      max-height="300"
    >
      <el-table-column type="index" label="#" align="center" />
      <el-table-column
        v-if="!disabledValue"
        label="操作"
        prop="operation"
        align="center"
        width="120"
        fixed
      >
        <template #default="{ row, $index }">
          <!-- <el-button type="primary" link @click="">查看</el-button> -->
          <el-button
            type="primary"
            link
            @click="editRow(row)"
            v-if="!row.updateable"
            >编辑</el-button
          >
          <el-button
            type="primary"
            link
            @click="row.updateable = false"
            v-if="row.updateable"
            >完成</el-button
          >

          <el-button
            type="danger"
            link
            @click="deleteData(formData.taskRelateOSList, $index)"
            >删除</el-button
          >
        </template>
      </el-table-column>
      <el-table-column
        prop="systemName"
        label="系统名称"
        align="center"
        width="160"
      >
        <template #default="{ row }">
          <el-tooltip
            v-if="row.updateable"
            :content="row.systemName"
            :disabled="!row.systemName"
          >
            <el-input v-model="row.systemName" maxlength="32"> </el-input>
          </el-tooltip>
          <!-- <el-select
            v-if="row.updateable"
            v-model="row.systemName"
            clearable
            style="width: 100%"
          >
            <el-option label="电子商城" value="电子商城"></el-option>
            <el-option label="南网云平台" value="南网云平台"></el-option>
            <el-option label="4A系统" value="4A系统"></el-option>
          </el-select> -->
          <span v-else>{{ row.systemName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="deviceOwner"
        label="设备主人"
        align="center"
        width="160"
      >
        <template #default="{ row }">
          <el-tooltip
            v-if="row.updateable"
            :content="row.deviceOwner"
            :disabled="!row.deviceOwner"
          >
            <el-input v-model="row.deviceOwner" maxlength="32"> </el-input>
          </el-tooltip>
          <!-- <el-select
            v-if="row.updateable"
            v-model="row.deviceOwner"
            clearable
            style="width: 100%"
          >
            <el-option label="张三" value="张三"></el-option>
            <el-option label="李四" value="李四"></el-option>
            <el-option label="王五" value="王五"></el-option>
          </el-select> -->
          <span v-else>{{ row.deviceOwner }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="deviceOwnerAccount"
        label="设备主人数认账号"
        align="center"
        width="160"
      >
        <template #default="{ row }">
          <el-tooltip
            v-if="row.updateable"
            :content="row.deviceOwnerAccount"
            :disabled="!row.deviceOwnerAccount"
          >
            <el-input v-model="row.deviceOwnerAccount" maxlength="32">
            </el-input>
          </el-tooltip>
          <span v-else>{{ row.deviceOwnerAccount }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="businessOwner"
        label="业务负责人"
        align="center"
        width="160"
      >
        <template #default="{ row }">
          <el-tooltip
            v-if="row.updateable"
            :content="row.businessOwner"
            :disabled="!row.businessOwner"
          >
            <el-input v-model="row.businessOwner" maxlength="32"> </el-input>
          </el-tooltip>
          <!-- <el-select
            v-if="row.updateable"
            v-model="row.businessOwner"
            clearable
            style="width: 100%"
          >
            <el-option label="张三" value="张三"></el-option>
            <el-option label="李四" value="李四"></el-option>
            <el-option label="王五" value="王五"></el-option>
          </el-select> -->
          <span v-else>{{ row.businessOwner }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="businessOwnerAccount"
        label="业务负责人数认账号"
        align="center"
        width="160"
      >
        <template #default="{ row }">
          <el-tooltip
            v-if="row.updateable"
            :content="row.businessOwnerAccount"
            :disabled="!row.businessOwnerAccount"
          >
            <el-input v-model="row.businessOwnerAccount" maxlength="32">
            </el-input>
          </el-tooltip>
          <span v-else>{{ row.businessOwnerAccount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="影响开始/结束时间" align="center" width="320">
        <template #default="{ row, $index }">
          <el-date-picker
            v-if="row.updateable"
            v-model="row.rangeTime"
            type="datetimerange"
            start-placeholder="请选择"
            end-placeholder="请选择"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm"
            style="width: 100%"
            @change="($event) => onTimechange($event, $index)"
          />
          <div v-else>
            <p>{{ row.startTime }}</p>
            <p>{{ row.endTime }}</p>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        prop="userTotal"
        label="影响用户数"
        align="center"
        min-width="150"
      >
        <template #default="{ row, $index }">
          <el-input
            v-if="row.updateable"
            v-model="row.userTotal"
            @input="($event) => handleInput($event, $index, 'userTotal')"
            maxlength="8"
          />
          <span v-else>{{ row.userTotal }}</span>
        </template>
      </el-table-column>
    </el-table>

    <div class="flex items-center" style="margin: 18px 0 10px 18px">
      <span style="font-weight: bold; color: #333">作业风险：</span>
      <el-select
        v-if="!disabledValue"
        v-model="formData.riskLevel"
        clearable
        style="width: 200px"
      >
        <el-option label="高" value="2"></el-option>
        <el-option label="中" value="1"></el-option>
        <el-option label="低" value="0"></el-option>
      </el-select>
      <span v-else :class="levelClass">{{
        riskLevelMap[formData.riskLevel]
      }}</span>
    </div>
    <div class="table-title">
      <span style="margin: 20px">基准风险管控措施</span>

      <el-button
        type="success"
        @click="addRow(formData.taskRiskControlList, tableRef2)"
        v-if="!disabledValue"
        :icon="Plus"
        >新增</el-button
      >
    </div>
    <el-table
      border
      stripe
      ref="tableRef2"
      :data="formData.taskRiskControlList"
      max-height="300"
    >
      <el-table-column
        v-if="!disabledValue"
        label="操作"
        prop="operation"
        align="center"
        width="120"
        fixed
      >
        <template #default="{ row, $index }">
          <!-- <el-button type="primary" link @click="">查看</el-button> -->
          <el-button
            type="primary"
            link
            @click="row.updateable = true"
            v-if="!row.updateable"
            >编辑</el-button
          >
          <el-button
            type="primary"
            link
            @click="row.updateable = false"
            v-if="row.updateable"
            >完成</el-button
          >

          <el-button
            type="danger"
            link
            @click="deleteData(formData.taskRiskControlList, $index)"
            >删除</el-button
          >
        </template>
      </el-table-column>
      <el-table-column prop="workType" label="作业类型" align="center">
        <template #default="{ row }">
          <el-tooltip
            v-if="row.updateable"
            :content="row.workType"
            :disabled="!row.workType"
          >
            <el-input v-model="row.workType" maxlength="32"> </el-input>
          </el-tooltip>
          <span v-else>{{ row.workType }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="workTasks" label="作业内容" align="center">
        <template #default="{ row }">
          <el-tooltip
            v-if="row.updateable"
            :content="row.workTasks"
            :disabled="!row.workTasks"
          >
            <el-input v-model="row.workTasks" maxlength="200"> </el-input>
          </el-tooltip>
          <span v-else>{{ row.workTasks }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="isAuthorize"
        label="预授权作业"
        align="center"
        width="120"
      >
        <template #default="{ row }">
          <el-select
            v-if="row.updateable"
            v-model="row.isAuthorize"
            clearable
            style="width: 100%"
          >
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="2"></el-option>
          </el-select>
          <span v-else>{{ row.isAuthorize == 1 ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="riskDescribe" label="风险描述" align="center">
        <template #default="{ row }">
          <el-tooltip
            v-if="row.updateable"
            :content="row.riskDescribe"
            :disabled="!row.riskDescribe"
          >
            <el-input v-model="row.riskDescribe" maxlength="200"> </el-input>
          </el-tooltip>
          <span v-else>{{ row.riskDescribe }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="riskMeasure"
        label="作业风险管控措施"
        align="center"
      >
        <template #default="{ row }">
          <el-tooltip
            v-if="row.updateable"
            :content="row.riskMeasure"
            :disabled="!row.riskMeasure"
          >
            <el-input v-model="row.riskMeasure" maxlength="200"> </el-input>
          </el-tooltip>
          <span v-else>{{ row.riskMeasure }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import {
  ElRow,
  ElCol,
  ElFormItem,
  ElForm,
  ElDatePicker,
  ElTable,
  ElTableColumn,
  ElInput,
  ElSelect,
  ElOption,
  ElDialog,
  ElMessage,
  ElMessageBox,
  ElText,
  ElLink,
  ElTag,
} from 'element-plus';
import { Search, Download, Plus, CircleCheck } from '@element-plus/icons-vue';
import { ref, reactive, computed, onMounted, nextTick } from 'vue';

defineOptions({
  name: 'BalanceMgtLinkSystemList',
});
const orderId = defineModel('orderId');
const disabledValue = defineModel('disabled');
const formData = defineModel('detailData');
const tableRef1 = ref();
const tableRef2 = ref();

const onTimechange = (value, index) => {
  if (!value || value.length < 2) {
    formData.value.taskRelateOSList[index].startTime = '';
    formData.value.taskRelateOSList[index].endTime = '';
  } else {
    formData.value.taskRelateOSList[index].startTime = value[0];
    formData.value.taskRelateOSList[index].endTime = value[1];
  }
};

const editRow = (row) => {
  row.updateable = true;
  row.rangeTime = [row.startTime, row.endTime];
};

const riskLevelMap = {
  '0': '低',
  '1': '中',
  '2': '高',
};

const addRow = (source, tableRef) => {
  source.push({
    updateable: true,
  });
  scrollToTableBottom(tableRef);
};

const deleteData = (source, index) => {
  ElMessageBox.confirm('确定要删除此项吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      source.splice(index, 1);
    })
    .catch(() => {});
};

const scrollToTableBottom = (tableRef) => {
  if (!tableRef) {
    return;
  }
  // 等待 DOM 更新后滚动到底部
  nextTick(() => {
    const tableEl = tableRef.$el; // 获取表格的根 DOM 元素
    const tableBodyWrapper = tableEl.querySelector('.el-scrollbar__wrap'); // 获取表格内容区域的 DOM 元素
    if (tableBodyWrapper) {
      tableBodyWrapper.scrollTop = tableBodyWrapper.scrollHeight; // 滚动到底部
    }
  });
};

const handleInput = (value, index, key) => {
  // 实时过滤非数字字符
  try {
    formData.value.taskRelateOSList[index][key] = value.replace(/[^\d]/g, '');
  } catch {}
};

const levelClass = computed(() => {
  const { riskLevel } = formData.value;
  if (riskLevel == '2') {
    return 'level-high';
  } else if (riskLevel == '1') {
    return 'level-middle';
  } else {
    return 'level-low';
  }
});
defineExpose({
  formData,
});
onMounted(() => {});
</script>

<style scoped>
.level-high {
  color: #f5222d;
  background-color: #fef0ef;
  border: 1px solid #ffa39e;
  border-radius: 5px;
  padding: 1px 8px;
}
.level-middle {
  color: #fa541c;
  background-color: #fff2e8;
  border: 1px solid #ffbb96;
  border-radius: 5px;
  padding: 1px 8px;
}
.level-low {
  color: #1890ff;
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 5px;
  padding: 1px 8px;
}
.table-title {
  padding: 10px;
  color: #333;
  font-weight: bold;
  text-align: center;
  background: #f9f9f9;
}
</style>
