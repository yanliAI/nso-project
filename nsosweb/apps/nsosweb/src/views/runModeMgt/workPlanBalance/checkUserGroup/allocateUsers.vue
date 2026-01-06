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
import { getHandlerListApi, getHandlersByGroupIdApi } from '#/api';

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
    const result = await getHandlersByGroupIdApi(groupId.value);
    selectUsers.value = result.map((item) => item.userid);

    loading.value = false;
  } catch (e) {
    loading.value = false;
  }
};

async function getAllFlowUserList() {
  loading.value = true;
  try {
  const param = {
      data: {
        pageSize: 999000,
        pageNum: 1,
        showSwipe: true,
        paramList: [
          {
            key: 'state',
            value: '1',
            type: 'eq'
          },
          {
            key: 'dep',
            value: '189414,189415,900618,189413,189418,189419,189416,189417,189420,189412',
            type: 'in'
          },
          {
            key: 'id',
            value: '-1',
            type: 'gt'
          }
        ]
      }
    }
    let result = await getHandlerListApi(param);
    allFlowUserList.value = result.map((item) => {
      let label = item.name;
      // if (item.fullOrgPath) {
      //   const parts = item.fullOrgPath.split('\\');
      //   label += '/' + parts[parts.length - 1];
      // }
      label += `(${item.account})` + '/' + item.orgname 
      return { key: item.userid, label };
    });
    console.log('测试',allFlowUserList.value)
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
