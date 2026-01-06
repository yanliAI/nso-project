<template>
  <div class="app-container p-4">
    <el-transfer
      v-model="selectUsers"
      style="text-align: left; display: inline-block"
      filterable
      :titles="['所有用户', '已添加']"
      :button-texts="['移除', '添加']"
      :format="{
        noChecked: '${total}',
        hasChecked: '${checked}/${total}',
      }"
      :data="allFlowUserList"
      @change="handleChange"
    >
    </el-transfer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, computed } from 'vue';
import { getFlowUserListApi, getUsersByGroupIdApi } from '#/api';

// Element Plus components
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElSelect,
  ElOption,
  ElDatePicker,
  ElButton,
  ElRow,
  ElCol,
  ElTable,
  ElTableColumn,
  ElDialog,
  ElMessage,
  ElMessageBox,
  ElPagination,
  ElTransfer,
} from 'element-plus';

// Icons
import { Search, Refresh, Plus } from '@element-plus/icons-vue';
const groupId = defineModel('groupId');

const allFlowUserList = ref([]);
const selectUsers = ref([]);

// 遮罩层
const loading = ref(true);

const getUserList = async () => {
  loading.value = true;
  try {
    const result = await getUsersByGroupIdApi(groupId.value);
    selectUsers.value = result.map((item) => item.id);

    loading.value = false;
  } catch (e) {
    loading.value = false;
  }
};

async function getAllFlowUserList() {
  loading.value = true;
  try {
    let result = await getFlowUserListApi({ pageNo: 1, pageSize: 999999 });
    allFlowUserList.value = result.records.map((item) => {
      let label = item.firstName;
      if (item.lastName) {
        const parts = item.lastName.split('/');
        label += '/' + parts[parts.length - 1];
      }
      return { key: item.id, label };
    });
    loading.value = false;
  } catch {}
}

const handleChange = (value, direction, movedKeys) => {
  console.log(value, direction, movedKeys);
  console.log('selectUsers=', selectUsers.value);
};

defineExpose({selectUsers})

onMounted(() => {
  getAllFlowUserList();
  getUserList();
});
</script>

<style scoped lang="less">
.dialog-form .el-form-item {
  width: 100%;
}

:deep(.el-transfer-panel) {
  width: 360px;
}
</style>
