<template>
  <div>
    <div style="margin: 0 0 10px 18px">
      <el-text type="danger"
        >说明：停服指信息系统对外服务全部或部分中断</el-text
      >
    </div>

    <el-form
      :inline="true"
      :model="formData"
      label-position="right"
      label-width="auto"
      style="padding: 0 20px"
    >
      <el-row :gutter="100">
        <el-col :span="8">
          <el-form-item label="停服开始时间：">
            <el-date-picker
              v-model="formData.stopStatTime"
              type="datetime"
              placeholder="请选择停服开始时间"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm"
              style="width: 100%"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="停服结束时间：">
            <el-date-picker
              v-model="formData.stopEndTime"
              type="datetime"
              placeholder="请选择停服结束时间"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm"
              style="width: 100%"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="停服总时长：">
            <span style="color: #ff0000">{{
              calculateDuration(formData.stopStatTime, formData.stopEndTime)
            }}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div class="flex items-center" style="margin: 10px 0">
      <h2 style="margin: 0 20px; font-weight: bold; color: #333">作业系统</h2>
      <el-button
        type="success"
        @click="addRow"
        v-if="!disabledValue"
        :icon="Plus"
        >新增</el-button
      >
    </div>

    <el-table
      border
      stripe
      ref="tableRef"
      :data="formData.taskWorkOSList"
      max-height="300"
    >
      <el-table-column type="index" label="#" align="center" />
      <el-table-column
        v-if="!disabledValue || timeEditable"
        label="操作"
        prop="operation"
        align="center"
        width="120"
        fixed
      >
        <template #default="{ row, $index }">
          <!-- <el-button type="primary" link @click="">查看</el-button> -->
          <div v-if="!timeEditable">
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

            <el-button type="danger" link @click="deleteData($index)"
              >删除</el-button
            >
          </div>
          <div v-if="timeEditable">
            <el-button
              type="primary"
              link
              @click="editRow(row)"
              v-if="!row.timeEnable"
              >调整</el-button
            >
            <el-button
              type="primary"
              link
              @click="updateTime(row)"
              v-if="row.timeEnable"
              >保存</el-button
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="systemName"
        label="系统名称"
        align="center"
        width="150"
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
        width="150"
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
        width="150"
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
        width="150"
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
      <el-table-column label="停服开始/结束时间" align="center" width="330">
        <template #default="{ row, $index }">
          <el-date-picker
            v-if="row.updateable || row.timeEnable"
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
            <p>{{ row.stopStatTime }}</p>
            <p>{{ row.stopEndTime }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="stopTotalTime"
        label="停服总时长"
        align="center"
        width="100"
      >
        <template #default="scope">
          {{ calculateDuration(scope.row.stopStatTime, scope.row.stopEndTime) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="isInterDay"
        label="跨天作业"
        align="center"
        width="100"
      >
        <template #default="{ row }">
          <el-select
            v-if="row.updateable"
            v-model="row.isInterDay"
            clearable
            style="width: 100%"
          >
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="2"></el-option>
          </el-select>
          <span v-else>{{ row.isInterDay == 1 ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="userTotal"
        label="影响用户数"
        align="center"
        width="100"
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
    <el-form
      :inline="true"
      :model="formData"
      label-position="right"
      label-width="auto"
      style="padding: 0 20px"
    >
      <el-row :gutter="100">
        <el-col :span="8">
          <el-form-item label="涉及核心功能：" style="margin: 10px 0 0">
            <el-select
              v-if="!disabledValue"
              v-model="isCore"
              clearable
              style="width: 100%"
            >
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="2"></el-option>
            </el-select>
            <span v-else>{{ isCore }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="影响业务：" style="margin: 10px 0 0">
            <el-select
              v-if="!disabledValue"
              v-model="isEffectService"
              clearable
              style="width: 100%"
            >
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="2"></el-option>
            </el-select>
            <span v-else>{{ isEffectService }}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
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
  ElTooltip,
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
import { saveBatchAdjustApi } from '#/api';
import { calculateDuration } from '#/utils/commonUtil.ts';

defineOptions({
  name: 'IntelligentReviewJobSystem',
});

const formData = defineModel('detailData');
const disabledValue = defineModel('disabled');
const timeEditable = defineModel('timeEditable');
const orderId = defineModel('orderId');
const tableRef = ref();

const editRow = (row) => {
  if (timeEditable.value) {
    row.timeEnable = true;
  } else {
    row.updateable = true;
  }
  row.rangeTime = [row.stopStatTime, row.stopEndTime];
};

const updateTime = async (row) => {
  ElMessageBox.confirm('确定要保存调整后时间吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      // 保存
      try {
        let params = {
          id: orderId.value,
          adjustStopStatTime: formData.value.stopStatTime,
          adjustStopEndTime: formData.value.stopEndTime,
        };
        let result = await saveBatchAdjustApi(params);
        if (result) {
          ElMessage.success('保存成功');
          row.timeEnable = false;
        }
      } catch {}
    })
    .catch(() => {});
};

const isCore = computed({
  get: () => {
    if (
      !formData.value.taskWorkOSList ||
      formData.value.taskWorkOSList.length <= 0
    ) {
      return '';
    }
    return formData.value.taskWorkOSList[0].isCore == 1 ? '是' : '否';
  },
  set: (newValue) => {
    if (formData.value.taskWorkOSList) {
      formData.value.taskWorkOSList.forEach((item) => {
        item.isCore = newValue;
      });
    }
  },
});
const isEffectService = computed({
  get: () => {
    if (
      !formData.value.taskWorkOSList ||
      formData.value.taskWorkOSList.length <= 0
    ) {
      return '';
    }
    return formData.value.taskWorkOSList[0].isEffectService == 1 ? '是' : '否';
  },
  set: (newValue) => {
    if (formData.value.taskWorkOSList) {
      formData.value.taskWorkOSList.forEach((item) => {
        item.isEffectService = newValue;
      });
    }
  },
});

const handleInput = (value, index, key) => {
  // 实时过滤非数字字符
  try {
    formData.value.taskWorkOSList[index][key] = value.replace(/[^\d]/g, '');
  } catch {}
};


const onTimechange = (value, index) => {
  if (!value || value.length < 2) {
    formData.value.taskWorkOSList[index].stopStatTime = '';
    formData.value.taskWorkOSList[index].stopEndTime = '';
  } else {
    formData.value.taskWorkOSList[index].stopStatTime = value[0];
    formData.value.taskWorkOSList[index].stopEndTime = value[1];
  }
  // 最小开始时间
  let minStatTime = '';
  // 最大结束时间
  let maxEndTime = '';
  formData.value.taskWorkOSList.forEach((item) => {
    if (!minStatTime) {
      minStatTime = item.stopStatTime;
    } else {
      if (
        item.stopStatTime &&
        new Date(minStatTime) > new Date(item.stopStatTime)
      ) {
        minStatTime = item.stopStatTime;
      }
    }
    if (!maxEndTime) {
      maxEndTime = item.stopEndTime;
    } else {
      if (
        item.stopEndTime &&
        new Date(maxEndTime) < new Date(item.stopEndTime)
      ) {
        maxEndTime = item.stopEndTime;
      }
    }
  });
  formData.value.stopStatTime = minStatTime;
  formData.value.stopEndTime = maxEndTime;
};
const deleteData = (index) => {
  ElMessageBox.confirm('确定要删除此项吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      formData.value.taskWorkOSList.splice(index, 1);
    })
    .catch(() => {});
};

const addRow = () => {
  formData.value.taskWorkOSList.push({
    updateable: true,
  });
  // 等待 DOM 更新后滚动到底部
  nextTick(() => {
    const tableEl = tableRef.value.$el; // 获取表格的根 DOM 元素
    const tableBodyWrapper = tableEl.querySelector('.el-scrollbar__wrap'); // 获取表格内容区域的 DOM 元素
    if (tableBodyWrapper) {
      tableBodyWrapper.scrollTop = tableBodyWrapper.scrollHeight; // 滚动到底部
    }
  });
};
defineExpose({
  formData,
});

onMounted(() => {});
</script>

<style scoped>
::v-deep .el-form-item {
  width: 100%;
}
</style>
