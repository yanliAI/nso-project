<template>

  <div style="background-color: white;">
    <!-- 查询条件部分 -->
    <el-form :model="searchForm" label-width="80px" style="padding-top: 10px;">
      <el-row :gutter="20">
        <el-col :span="4">
          <div>
            <el-form-item label="故障编号">
              <el-input v-model="searchForm.faultCode"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="4">
          <div>
            <el-form-item label="故障名称">
              <el-input v-model="searchForm.faultInfo"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="4">
          <div>
            <el-form-item label="故障状态">
              <el-select v-model="searchForm.faultStatus" filterable>
                <el-option v-for="item in dropList.NSOS_FAULT_STATUS" :key="item.value" :label="item.label"
                  :value="item.value" />
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="8">
          <div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="21">
          <div>
          </div>
        </el-col>
        <el-col :span="3" style="padding-bottom: 20px">
          <div class="more-and-buttons">
            <div class="buttons">
              <el-button type="primary" @click="onSearch">查询</el-button>
              <el-button type="info" @click="reset">重置</el-button>
            </div>
          </div>
        </el-col>
      </el-row>

    </el-form>

    <!-- 表格部分 -->
    <el-table border ref="workflowTab" :data="tableData" @selection-change="handleSelectionChange"
      style="width: 100%;height: 630px">
      <el-table-column type="selection" />
      <el-table-column type="index" label="序号" width="55"/>
      <el-table-column prop="faultCode" label="故障编号" align="center" width="135">
      </el-table-column>
      <el-table-column prop="faultInfo" label="故障名称" align="center" />
      <el-table-column prop="faultStatus" label="故障状态" align="center" width="100">
        <template #default="scope">
            {{ dropList['NSOS_FAULT_STATUS'].find(i => i.value == scope.row.faultStatus)?.label }}
          </template>
      </el-table-column>
      <el-table-column label="故障进程时间" align="center" width="200">
        <template #default="scope">
          发生：{{ formatTimestamp(scope.row, scope.column, scope.row.faultOccurTime) }}<br />
          填报：{{ formatTimestamp(scope.row, scope.column, scope.row.fillTime) }}<br />
          验证：{{ formatTimestamp(scope.row, scope.column, scope.row.faultVerifyTime) }}<br />
          恢复：{{ formatTimestamp(scope.row, scope.column, scope.row.faultRestoreTime) }}<br />
        </template>
      </el-table-column>
      <el-table-column prop="effectRange" label="故障影响范围及程度" align="center" width="100" />
      <el-table-column prop="faultSys" label="故障系统/平台/设施" align="center" width="180">
        <template #default="scope">
          {{ dropList['NSOS_SYS_NAME'].find(i => i.value == scope.row.faultSys)?.label }}
        </template>
      </el-table-column>
      <el-table-column prop="sysLevel" label="故障系统/设备级别" align="center" width="140">
        <template #default="scope">
          {{ dropList['NSOS_SYS_LEVEL'].find(i => i.value == scope.row.sysLevel)?.label }}
        </template>
      </el-table-column>
      <el-table-column prop="operateSchema" label="运维模式" align="center" width="100">
        <template #default="scope">
          {{ dropList['NSOS_OPERATE_SCHEMA'].find(i => i.value == scope.row.operateSchema)?.label }}
        </template>
      </el-table-column>
      <el-table-column prop="operateOrg" label="运维单位" align="center" width="120">
        <template #default="scope">
          {{ dropList['NSOS_OPERATE_ORG'].find(i => i.value == scope.row.operateOrg)?.label }}
        </template>
      </el-table-column>
      <el-table-column prop="deviceOwner" label="设备主人" align="center" width="90" />
      <el-table-column label="故障持续时间" align="center" width="120">
        <template #default="scope">
          {{ getHoursDifference(scope.row.faultRestoreTime, scope.row.faultOccurTime) }} 小时
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页部分 -->
    <el-pagination :current-page="currentPage" :page-size="pageSize" :total="total" @size-change="handleSizeChange"
      @current-change="handlePageChange" :page-sizes="[20, 50, 100, 200]"
      layout="total, sizes, prev, pager, next, jumper"></el-pagination>
  </div>

</template>

<script>
import { ref, reactive, onMounted, watch } from 'vue';
import {ElTable,ElRow,ElCol,ElTableColumn,ElFormItem,ElForm,ElInput,ElButton,ElSelect,ElPagination,ElContainer,ElHeader,ElMain,ElFooter,ElDialog,ElMessage,ElMessageBox,ElLink, SIZE_INJECTION_KEY} from 'element-plus';
import { requestClient } from '#/api/request';
import { useDropStore } from '#/store';


export default {
  setup() {
    const searchForm = reactive({
      faultCode: '',
      faultInfo: '',
      faultStatus: '',
    });

    const tableData = ref([]);
    const total = ref(0);
    const pageSize = ref(10);
    const currentPage = ref(1);
    const index = ref(-1);
    const dropList = reactive({});

    const fetchTableData = async () => {
      // 模拟从服务器获取数据
      // 这里可以替换为实际的 API 请求
      const response = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/info/queryTwo', {
        "pageNo": currentPage.value,
        "pageSize": pageSize.value,
        "faultCode": searchForm.faultCode,
        "faultInfo": searchForm.faultInfo,
        "faultStatus": searchForm.faultStatus,
      });
      tableData.value = response.list;
      total.value = response.count;
    };

    const toggleAdvancedSearch = () => {
      // 切换更多查询条件的显示状态
      // 这里可以添加逻辑来控制更多查询条件的显示
    };



    const reset = () => {
      searchForm.faultCode = '';
      searchForm.faultInfo = '';
      searchForm.faultStatus = '';
      fetchTableData();
    }

    function formatTimestamp(row, column, cellValue) {
      if (cellValue) {
        const date = new Date(cellValue);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      } else {
        var s = '----------------------';
        return s;
      }
    }


    const handleSelectionChange = (val) => {
      selectedRows.value = val;
    };

    const handleSizeChange = (size) => {
      pageSize.value = size;
      fetchTableData();
    }

    const handlePageChange = (newPage) => {
      currentPage.value = newPage;
      fetchTableData();
    };

    function getHoursDifference(date1time, date2time) {
      const date1 = new Date(date1time ? date1time : new Date().toString())
      const date2 = new Date(date2time)
      // 确保传入的是 Date 对象
      if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
        throw new Error('Arguments must be instances of Date');
      }

      // 计算时间差（以毫秒为单位）
      const diffInMilliseconds = Math.abs(date2 - date1);

      // 将毫秒转换为秒
      const diffInSeconds = diffInMilliseconds / 1000;

      // 将秒转换为分钟
      const diffInMinutes = diffInSeconds / 60;

      // 将分钟转换为小时
      const diffInHours = diffInMinutes / 60;

      // 返回时间差（以小时为单位）

      return diffInHours.toFixed(2);
    }

    const onSearch = () => {
      // 实现查询逻辑
      console.log('查询条件:', searchForm);
      // 这里可以添加查询逻辑，比如发送请求到服务器
      fetchTableData();
      ElMessage.success('查询成功');
    };

    onMounted(async () => {
      const dropStore = useDropStore();
      await dropStore.initDrops(['NSOS_FAULT_STATUS', 'NSOS_SYS_NAME', 'NSOS_SYS_LEVEL', 'NSOS_OPERATE_SCHEMA', 'NSOS_OPERATE_ORG', 'NSOS_DISPATCH_PERSON']);
      dropStore.get(dropList, ['NSOS_FAULT_STATUS', 'NSOS_SYS_NAME', 'NSOS_SYS_LEVEL', 'NSOS_OPERATE_SCHEMA', 'NSOS_OPERATE_ORG', 'NSOS_DISPATCH_PERSON']);
      fetchTableData();
    });

    return {
      searchForm,
      tableData,
      total,
      pageSize,
      currentPage,
      toggleAdvancedSearch,
      onSearch,
      formatTimestamp,
      handleSelectionChange,
      handleSizeChange,
      handlePageChange,
      reset,
      index,
      dropList,
      getHoursDifference,
    };
  },
};
</script>

<style scoped>
 :deep .cell {
    text-align: center;
  }

.more-and-buttons {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.more-text {
  font-weight: bold;
  color: #409EFF; /* 蓝色字体 */
  cursor: pointer;
}

.buttons {
  display: flex;
  align-items: center;
}

.buttons .el-button {
  margin-left: 10px;
}

.buttons .el-button:first-child {
  margin-left: 0;
}
</style>

