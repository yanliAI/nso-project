<template>
  <el-dialog title="资源申请情况" :model-value="visible" width="80%" :before-close="handleClose" custom-class="custom-dialog">
    <div style="background-color: white;">
      <!-- 查询条件部分 -->
      <el-form :model="searchForm">
        <el-row>
          <el-col :span="4">
            <div>
              <el-form-item label="资源类型：">
                <el-select v-model="searchForm.deviceModel" filterable>
                  <el-option v-for="item in dropList.NSOS_DEVICE_MODEL" :key="item.value" :label="item.label"
                    :value="item.value" />
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="16">
            <div>
            </div>
          </el-col>
          <el-col :span="4">
            <div>
              <el-button type="primary" @click="onSearch">查询</el-button>
              <el-button type="info" plain @click="reset">重置</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>

      <!-- 表格部分 -->
      <el-table border ref="workflowTab" :data="tableData" @selection-change="handleSelectionChange"
        style="width: 100%;height: 100%">
        <el-table-column type="index" label="#" />
        <el-table-column prop="bkRequestType" label="需求类型" column-key="NSOS_BK_REQUEST_TYPE" :formatter="formatDrop" width="200"></el-table-column>
        <el-table-column prop="deviceModel" label="资源类型"  column-key="NSOS_DEVICE_MODEL" :formatter="formatDrop" width="120"></el-table-column>
        <el-table-column prop="ciName" label="配置项名称"></el-table-column>
        <el-table-column prop="netSplit" label="网络分区" column-key="NSOS_NET_SPLIT" :formatter="formatDrop" width="120"></el-table-column>
        <el-table-column prop="bkCpu" label="CPU逻辑核心数(个)" width="150"></el-table-column>
        <el-table-column prop="bkMem" label="内存容量(MB)" width="150"></el-table-column>
        <el-table-column prop="bkDisk" label="磁盘容量(GB)" width="150"></el-table-column>
        <el-table-column prop="bkOsType" label="操作系统类型" column-key="NSOS_BK_OS_TYPE" :formatter="formatDrop" width="120"></el-table-column>
        <el-table-column prop="ciEnv" label="环境" column-key="NSOS_CI_ENV" :formatter="formatDrop" width="100"></el-table-column>
      </el-table>

      <!-- 分页部分 -->
      <el-pagination :current-page="currentPage" :page-size="pageSize" :total="total" @size-change="handleSizeChange"
        @current-change="handlePageChange" :page-sizes="[10, 50, 100, 200]"
        layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    </div>
  </el-dialog>
</template>

<script>
import { ref, reactive, onMounted, watch } from 'vue';
import {ElTable,ElTableColumn,ElFormItem,ElForm,ElInput,ElButton,ElSelect,ElPagination,ElContainer,ElHeader,ElMain,ElFooter,ElDialog,ElMessage,ElMessageBox,ElLink, SIZE_INJECTION_KEY} from 'element-plus';
import { requestClient } from '#/api/request';
import { tDateFormat, tDateTimeFormat, formatDrop } from '#/utils/commonUtil.ts';
import { useDropStore } from '#/store';


export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  }, 
  emits: ['update:visible'],
  setup(props, { emit }) {
    const searchForm = reactive({
      deviceModel: '',
    });

    const tableData = ref([]);
    const total = ref(0);
    const pageSize = ref(10);
    const currentPage = ref(1);


    const handleSelectionChange = (val) => {
      selectedRows.value = val;
    };

    const fetchTableData = async () => {
      // 模拟从服务器获取数据
      // 这里可以替换为实际的 API 请求
      const response = await requestClient.post(import.meta.env.VITE_NSOSZH + '/itResourceRequestInfo/mHQueryDataListByPagePagination', {
        "pageNo": currentPage.value,
        "pageSize": pageSize.value,
        "deviceModel": searchForm.deviceModel,
      });
      tableData.value = response.list;
      total.value = response.count;
    };

    const onSearch = () => {
      // 实现查询逻辑
      console.log('查询条件:', searchForm);
      // 这里可以添加查询逻辑，比如发送请求到服务器
      fetchTableData();
      ElMessage.success('查询成功');
    };

    const reset = () => {
      searchForm.deviceModel = '';
      fetchTableData();
    }

    const handleClose = () => {
      emit('update:visible', false);
    };

    const handleSizeChange = (size) => {
      pageSize.value = size;
      fetchTableData();
    }

    const handlePageChange = (newPage) => {
      currentPage.value = newPage;
      fetchTableData();
    };

    watch(
      () => props.visible,
      (newVal) => {
        if (newVal) {
          fetchTableData();
        }
      }
    );

    const dropList = reactive({});
    onMounted(async () => {
      const dropStore = useDropStore();
      const dropType = ['NSOS_CI_ENV', 'NSOS_DEVICE_MODEL', 'NSOS_BK_REQUEST_TYPE', 'NSOS_NET_SPLIT','NSOS_BK_OS_TYPE']
      await dropStore.initDrops(dropType);
      dropStore.get(dropList, dropType);
      if (props.visible) {
        fetchTableData();
      }
    });

    return {
      searchForm,
      tableData,
      total,
      pageSize,
      currentPage,
      onSearch,
      handleSelectionChange,
      handleClose,
      handleSizeChange,
      handlePageChange,
      reset,
      dropList,
      formatDrop,
    };
  },
};
</script>

<style scoped>
 :deep (.cell) {
    text-align: center;
  }
</style>

