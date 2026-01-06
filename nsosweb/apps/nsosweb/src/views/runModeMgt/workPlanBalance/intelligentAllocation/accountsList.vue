<template>
  <div>
    <div style="margin: 0 0 10px 18px">
      <el-text type="danger"
        >说明：系统根据作业台账清单的时间自动计算开始时间和结束时间；停机：指主机、中间件、数据库等提供的服务中断</el-text
      >
    </div>

    <el-form
      ref="formRef"
      :inline="true"
      :model="formData"
      label-position="right"
      label-width="auto"
      style="padding: 0 20px"
    >
      <el-row :gutter="100">
        <el-col :span="8">
          <el-form-item label="作业计划开始时间：">
            <el-date-picker
              v-model="formData.startTime"
              type="datetime"
              placeholder="请选择作业计划开始时间"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm"
              style="width: 100%"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="作业计划结束时间：">
            <el-date-picker
              v-model="formData.endTime"
              type="datetime"
              placeholder="请选择作业计划结束时间"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm"
              style="width: 100%"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="作业计划总时长：">
            <span style="color: #ff0000">{{ preWorkTotalTime }}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="100">
        <el-col :span="8">
          <el-form-item label="停机开始时间：">
            <el-date-picker
              v-model="formData.haltStartTime"
              type="datetime"
              placeholder="请选择停机开始时间"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm"
              style="width: 100%"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="停机结束时间：">
            <el-date-picker
              v-model="formData.haltEndTime"
              type="datetime"
              placeholder="请选择停机结束时间"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm"
              style="width: 100%"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="停机总时长：">
            <span style="color: #ff0000">{{ downTotalTime }}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div class="flex items-center" style="margin: 10px 0">
      <h2 style="margin: 0 20px; font-weight: bold; color: #333">
        作业台账清单
      </h2>
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
      :data="formData.taskLedgerList"
      max-height="300"
    >
      <el-table-column type="index" label="#" align="center" />
      <el-table-column
        v-if="!disabledValue || timeEditable"
        fixed
        label="操作"
        prop="operation"
        align="center"
        width="120"
      >
        <template #default="{ row, $index }">
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
              @click="finishEdit(row)"
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
        label="所属信息系统名称"
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
          <span v-else>{{ row.systemName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="configName"
        label="配置项名称"
        align="center"
        width="150"
      >
        <template #default="{ row }">
          <el-tooltip
            v-if="row.updateable"
            :content="row.configName"
            :disabled="!row.configName"
          >
            <el-input v-model="row.configName" maxlength="32"> </el-input>
          </el-tooltip>
          <!-- <el-select
            v-if="row.updateable"
            v-model="row.configName"
            clearable
            style="width: 100%"
          >
            <el-option label="数据库服务器1" value="数据库服务器1"></el-option>
            <el-option label="数据库服务器2" value="数据库服务器2"></el-option>
            <el-option label="数据库服务器3" value="数据库服务器3"></el-option>
          </el-select> -->
          <span v-else>{{ row.configName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ipAddress" label="ip" align="center" width="150">
        <template #default="{ row }">
          <el-tooltip
            v-if="row.updateable"
            :content="row.ipAddress"
            :disabled="!row.ipAddress"
          >
            <el-input v-model="row.ipAddress" maxlength="32"> </el-input>
          </el-tooltip>
          <span v-else>{{ row.ipAddress }}</span>
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
      <el-table-column label="作业开始/结束时间" align="center" width="330">
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
            <p>{{ row.statTime }}</p>
            <p>{{ row.endTime }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="停机开始/结束时间" align="center" width="330">
        <template #default="{ row, $index }">
          <el-date-picker
            v-if="row.updateable || row.timeEnable"
            v-model="row.rangeTime2"
            type="datetimerange"
            start-placeholder="请选择"
            end-placeholder="请选择"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm"
            style="width: 100%"
            @change="($event) => onTimechange2($event, $index)"
          />
          <div v-else>
            <p>{{ row.haltStartTime }}</p>
            <p>{{ row.haltEndTime }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="downTotalTime"
        label="停机时长"
        align="center"
        width="100"
      >
        <template #default="scope">
          {{
            calculateDuration(scope.row.haltStartTime, scope.row.haltEndTime)
          }}
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
import { validateIP, validateIPv6 } from '#/utils/validateUtil';

defineOptions({
  name: 'IntelligentReviewAccountsList',
});

const formData = defineModel('detailData');
const disabledValue = defineModel('disabled');
const timeEditable = defineModel('timeEditable');
const orderId = defineModel('orderId');
const formRef = ref();
const tableRef = ref();
// const formData = ref({
//   startTime: '2025-05-21 19:00',
//   endTime: '2025-05-22 19:00',
//   haltStartTime: '2025-05-21 19:00',
//   haltEndTime: '2025-05-22 19:00',
//   startTime2: '2025-05-21 19:00',
//   endTime2: '2025-05-22 19:00',
//   haltStartTime2: '2025-05-21 19:00',
//   haltEndTime2: '2025-05-22 19:00',
//   tableData: [
//     {
//       sysName: '电子商城',
//       configName: '数据库服务器1',
//       ip: '127.0.0.1',
//       leaderName: '张山',
//     },
//     {
//       sysName: '电子商城',
//       configName: '数据库服务器1',
//       ip: '127.0.0.1',
//       leaderName: '张山',
//     },
//     {
//       sysName: '电子商城',
//       configName: '数据库服务器1',
//       ip: '127.0.0.1',
//       leaderName: '张山',
//     },
//   ],
// });

const editRow = (row) => {
  if (timeEditable.value) {
    row.timeEnable = true;
  } else {
    row.updateable = true;
  }
  row.rangeTime = [row.statTime, row.endTime];
  row.rangeTime2 = [row.haltStartTime, row.haltEndTime];
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
          adjustStartTime: formData.value.startTime,
          adjustEndTime: formData.value.endTime,
          adjustHaltEndTime: formData.value.haltEndTime,
          adjustHaltStartTime: formData.value.haltStartTime,
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

// 计算预工作总时长
const preWorkTotalTime = computed(() => {
  if (!formData.value.startTime || !formData.value.endTime) {
    return '';
  }
  return calculateDuration(formData.value.startTime, formData.value.endTime);
});

// 计算停机总时长
const downTotalTime = computed(() => {
  if (!formData.value.haltStartTime || !formData.value.haltEndTime) {
    return '';
  }
  return calculateDuration(
    formData.value.haltStartTime,
    formData.value.haltEndTime,
  );
});

const onTimechange = (value, index) => {
  if (!value || value.length < 2) {
    formData.value.taskLedgerList[index].statTime = '';
    formData.value.taskLedgerList[index].endTime = '';
  } else {
    formData.value.taskLedgerList[index].statTime = value[0];
    formData.value.taskLedgerList[index].endTime = value[1];
  }
  // 最小开始时间
  let minStatTime = '';
  // 最大结束时间
  let maxEndTime = '';
  formData.value.taskLedgerList.forEach((item) => {
    if (!minStatTime) {
      minStatTime = item.statTime;
    } else {
      if (item.statTime && new Date(minStatTime) > new Date(item.statTime)) {
        minStatTime = item.statTime;
      }
    }
    if (!maxEndTime) {
      maxEndTime = item.endTime;
    } else {
      if (item.endTime && new Date(maxEndTime) < new Date(item.endTime)) {
        maxEndTime = item.endTime;
      }
    }
  });
  formData.value.startTime = minStatTime;
  formData.value.endTime = maxEndTime;
};

const onTimechange2 = (value, index) => {
  if (!value || value.length < 2) {
    formData.value.taskLedgerList[index].haltStartTime = '';
    formData.value.taskLedgerList[index].haltEndTime = '';
  } else {
    formData.value.taskLedgerList[index].haltStartTime = value[0];
    formData.value.taskLedgerList[index].haltEndTime = value[1];
  }
  // 最小开始时间
  let minStatTime = '';
  // 最大结束时间
  let maxEndTime = '';
  formData.value.taskLedgerList.forEach((item) => {
    if (!minStatTime) {
      minStatTime = item.haltStartTime;
    } else {
      if (
        item.haltStartTime &&
        new Date(minStatTime) > new Date(item.haltStartTime)
      ) {
        minStatTime = item.haltStartTime;
      }
    }
    if (!maxEndTime) {
      maxEndTime = item.haltEndTime;
    } else {
      if (
        item.haltEndTime &&
        new Date(maxEndTime) < new Date(item.haltEndTime)
      ) {
        maxEndTime = item.haltEndTime;
      }
    }
  });
  formData.value.haltStartTime = minStatTime;
  formData.value.haltEndTime = maxEndTime;
};
const deleteData = (index) => {
  ElMessageBox.confirm('确定要删除此项吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      formData.value.taskLedgerList.splice(index, 1);
    })
    .catch(() => {});
};

const addRow = () => {
  formData.value.taskLedgerList.push({
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

const handleInput = (value, index, key) => {
  // 实时过滤非数字字符
  try {
    formData.value.taskLedgerList[index][key] = value.replace(/[^\d]/g, '');
  } catch {}
};

const finishEdit = (row) => {
  if (row.ipAddress) {
    if (!validateIP(row.ipAddress) && !validateIPv6(row.ipAddress)) {
      ElMessage.warning('请输入正确的ip地址');
      return;
    }
  }
  row.updateable = false;
};

const validateForm = async () => {
  if (!formRef.value) return false;
  for (let i = 0; i < formData.value.taskLedgerList?.length; i++) {
    let ip = formData.value.taskLedgerList[i].ipAddress;
    if (ip) {
      if (!validateIP(ip) && !validateIPv6(ip)) {
        ElMessage.warning('请输入正确的ip地址:' + ip);
        return false;
      }
    }
  }
  let result = false;
  await formRef.value.validate((valid, fields) => {
    result = valid;
  });
  return result;
};

defineExpose({
  formData,
  validateForm,
});
onMounted(() => {});
</script>

<style scoped>
::v-deep .el-form-item {
  width: 100%;
}
</style>
