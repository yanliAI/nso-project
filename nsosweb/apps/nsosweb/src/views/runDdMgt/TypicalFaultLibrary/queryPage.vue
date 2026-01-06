<template>
  <div style="background-color: white;">
    <!-- 查询条件部分 -->
    <el-form :model="searchForm" label-width="80px">
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
            <el-form-item label="故障信息">
              <el-input v-model="searchForm.faultName"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="4">
          <div>
            <el-form-item label="系统名称">
              <el-input v-model="searchForm.faultSys"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="8">
          <div>
          </div>
        </el-col>
        <el-col :span="4" style="padding-top: 20px">
          <div class="more-and-buttons">
            <div class="buttons">
              <el-popover placement="bottom" :width="800" trigger="click" content="更多查询条件">
                <template #reference>
                  <span class="more-text" @click="toggleAdvancedSearch">更多</span>
                </template>
                <el-form :model="searchForm">
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <div>
                        <el-form-item label="故障处置过程">
                          <el-input v-model="searchForm.faultDisposeProgress"></el-input>
                        </el-form-item>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div>
                        <el-form-item label="处置措施">
                          <el-input v-model="searchForm.disposeMeasure"></el-input>
                        </el-form-item>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="24">
                      <div>
                        <el-form-item label="故障恢复时间">
                          <el-date-picker v-model="searchForm.timeRange2" type="datetimerange"
                            format="YYYY-MM-DD HH:mm:ss.SSS" value-format="YYYY-MM-DD HH:mm:ss.SSS" range-separator="-"
                            start-placeholder="开始时间" end-placeholder="结束时间" style="width: 100%;" />
                        </el-form-item>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <div>
                        <el-form-item label="处置指令">
                          <el-input v-model="searchForm.disposeCommand"></el-input>
                        </el-form-item>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div>
                        <el-form-item label="影响业务时长">
                          <el-input v-model="searchForm.effectBusiDuration"></el-input>
                        </el-form-item>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <div>
                        <el-form-item label="故障原因分类">
                          <!-- <el-input v-model="searchForm.faultReasonType"></el-input> -->
                          <el-select v-model="searchForm.faultReasonType" filterable >
                            <el-option v-for="item in dropList.NSOS_FAULT_REASON_TYPE" :key="item.value" :label="item.label"
                              :value="item.value" />
                          </el-select>
                        </el-form-item>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div>
                        <el-form-item label="作业导致故障描述">
                          <el-input v-model="searchForm.faultDesc"></el-input>
                        </el-form-item>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <div>
                        <el-form-item label="事件级别">
                          <!-- <el-input v-model="searchForm.eventLevel"></el-input> -->
                          <el-select v-model="searchForm.eventLevel"  filterable>
                            <el-option v-for="item in dropList.NSOS_EVENT_LEVEL" :key="item.value" :label="item.label"
                              :value="item.value" />
                          </el-select>
                        </el-form-item>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div>
                        <el-form-item label="直接原因">
                          <el-input v-model="searchForm.directReason"></el-input>
                        </el-form-item>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <div>
                        <el-form-item label="根本原因">
                          <el-input v-model="searchForm.radicallyReason"></el-input>
                        </el-form-item>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div>
                        <el-form-item label="根本原因大类">
                          <!-- <el-input v-model="searchForm.radicallyReasonClass"></el-input> -->
                          <el-select v-model="searchForm.radicallyReasonClass" filterable >
                            <el-option v-for="item in dropList.NSOS_RADICALLY_REASON_CLASS" :key="item.value" :label="item.label"
                              :value="item.value" />
                          </el-select>
                        </el-form-item>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <div>
                        <el-form-item label="根本原因小类">
                          <!-- <el-input v-model="searchForm.radicallyReasonType"></el-input> -->
                          <el-select v-model="searchForm.radicallyReasonType" filterable >
                            <el-option v-for="item in dropList.NSOS_RADICALLY_REASON_TYPE" :key="item.value" :label="item.label"
                              :value="item.value" />
                          </el-select>
                        </el-form-item>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div>
                        <el-form-item label="根因共性问题提炼">
                          <!-- <el-input v-model="searchForm.similarityProblem"></el-input> -->
                          <el-select v-model="searchForm.similarityProblem" filterable >
                            <el-option v-for="item in dropList.NSOS_SIMILARITY_PROBLEM" :key="item.value" :label="item.label"
                              :value="item.value" />
                          </el-select>
                        </el-form-item>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <div>
                        <el-form-item label="故障责任单位">
                          <el-input v-model="searchForm.faultDutyOrg"></el-input>
                        </el-form-item>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div>
                        <el-form-item label="故障跟进单位">
                          <el-input v-model="searchForm.faultFollowOrg"></el-input>
                        </el-form-item>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <div>
                        <el-form-item label="故障跟进人">
                          <el-input v-model="searchForm.faultFollowPeople"></el-input>
                        </el-form-item>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div>
                        <el-form-item label="是否涉及反措">
                          <!-- <el-input v-model="searchForm.isInvolveReaverse"></el-input> -->
                          <el-select v-model="searchForm.isInvolveReaverse" filterable >
                            <el-option v-for="item in dropList.NSOS_IS_INVOLVE_REAVERSE" :key="item.value" :label="item.label"
                              :value="item.value" />
                          </el-select>
                        </el-form-item>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <div>
                        <el-form-item label="反措是否完成">
                          <!-- <el-input v-model="searchForm.isReaversed"></el-input> -->
                          <el-select v-model="searchForm.isReaversed" filterable >
                            <el-option v-for="item in dropList.NSOS_IS_REAVERSED" :key="item.value" :label="item.label"
                              :value="item.value" />
                          </el-select>
                        </el-form-item>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div>
                        <el-form-item label="技术整改措施">
                          <el-input v-model="searchForm.rectificationMeasure"></el-input>
                        </el-form-item>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <div>
                        <el-form-item label="备注">
                          <el-input v-model="searchForm.remark"></el-input>
                        </el-form-item>
                      </div>
                    </el-col>
                  </el-row>
                </el-form>
              </el-popover>
              <el-button type="primary" @click="onSearch">查询</el-button>
              <el-button type="primary" @click="onSave">保存</el-button>
              <el-button type="info" @click="reset">重置</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="4">
          <div>
            <el-form-item label="发生时间">
              <el-date-picker v-model="searchForm.timeRange" type="datetimerange" format="YYYY-MM-DD HH:mm:ss.SSS"
                value-format="YYYY-MM-DD HH:mm:ss.SSS" range-separator="-" start-placeholder="开始时间"
                end-placeholder="结束时间" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>

    <!-- 表格部分 -->
    <el-table border ref="workflowTab" :data="tableData" @selection-change="handleSelectionChange"
      style="width: 100%;height: 630px">
      <el-table-column type="index" />
      <el-table-column type="selection" />
      <el-table-column prop="faultName" label="故障信息" width="220"></el-table-column>
      <el-table-column prop="faultCode" label="故障编号" width="120"></el-table-column>
      <el-table-column prop="faultSys" label="系统名称" width="220"></el-table-column>
      <el-table-column prop="faultDisposeProgress" label="故障处置过程" width="220"></el-table-column>
      <el-table-column prop="disposeMeasure" label="处置措施" width="220"></el-table-column>
      <el-table-column prop="disposeCommand" label="处置指令" width="220"></el-table-column>
      <el-table-column prop="faultOccurTime" label="故障发生时间" width="220" :formatter="formatTimestamp"></el-table-column>
      <el-table-column prop="faultRestoreTime" label="故障恢复时间" width="220"
        :formatter="formatTimestamp"></el-table-column>
      <el-table-column prop="effectBusiDuration" label="影响业务时长" width="220"></el-table-column>
      <el-table-column prop="faultReasonType" label="故障原因分类(标准)" width="220">
        <template #default="scope">
          {{ getfaultReasonTypeLabel(scope.row.faultReasonType) }}
        </template>
      </el-table-column>
      <el-table-column prop="faultDesc" label="作业导致故障描述" width="220"></el-table-column>
      <el-table-column prop="eventLevel" label="事件级别" width="220">
        <template #default="scope">
          {{ geteventLevelLabel(scope.row.eventLevel) }}
        </template>
      </el-table-column>
      <el-table-column prop="directReason" label="直接原因" width="220"></el-table-column>
      <el-table-column prop="radicallyReason" label="根本原因" width="220"></el-table-column>
      <el-table-column prop="radicallyReasonClass" label="根本原因大类" width="220">
        <template #default="scope">
          {{ getradicallyReasonClassLabel(scope.row.radicallyReasonClass) }}
        </template>
      </el-table-column>
      <el-table-column prop="radicallyReasonType" label="根本原因小类" width="220">
        <template #default="scope">
          {{ getradicallyReasonTypeLabel(scope.row.radicallyReasonType) }}
        </template>
      </el-table-column>
      <el-table-column prop="similarityProblem" label="根因共性问题提炼" width="220">
        <template #default="scope">
          {{ getsimilarityProblemLabel(scope.row.similarityProblem) }}
        </template>
      </el-table-column>
      <el-table-column prop="faultDutyOrg" label="故障责任单位" width="220"></el-table-column>
      <el-table-column prop="faultFollowOrg" label="故障跟进单位" width="220"></el-table-column>
      <el-table-column prop="faultFollowPeople" label="故障跟进人" width="220"></el-table-column>
      <el-table-column prop="isInvolveReaverse" label="是否涉及反措" width="220">
        <template #default="scope">
          {{ getisInvolveReaverseLabel(scope.row.isInvolveReaverse) }}
        </template>
      </el-table-column>
      <el-table-column prop="isReaversed" label="反措是否完成" width="220">
        <template #default="scope">
          {{ getisReaversedLabel(scope.row.isReaversed) }}
        </template>
      </el-table-column>
      <el-table-column prop="rectificationMeasure" label="技术整改措施" width="220"></el-table-column>
      <el-table-column prop="remark" label="备注" width="220">
        <template #default="scope">
          <el-input v-if="scope.row.isEditing" v-model="scope.row.remark" type="textarea" :rows="2"
            @blur="scope.row.isEditing = false"></el-input>
          <span v-else @click="scope.row.isEditing = true; index = scope.row.id;">{{ scope.row.remark }}</span>
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
      faultName: '',
      faultSys: '',
      timeRange: [],
      faultDisposeProgress: '',
      disposeMeasure: '',
      disposeCommand: '',
      timeRange2: [],
      effectBusiDuration: '',
      faultReasonType: '',
      faultDesc: '',
      eventLevel: '',
      directReason: '',
      radicallyReason: '',
      radicallyReasonClass: '',
      radicallyReasonType: '',
      similarityProblem: '',
      faultDutyOrg: '',
      faultFollowOrg: '',
      faultFollowPeople: '',
      isInvolveReaverse: '',
      isReaversed: '',
      rectificationMeasure: '',
      remark: '',
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
      const response = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/typicalFault/mHQueryDataListByPagePagination', {
        "pageNo": currentPage.value,
        "pageSize": pageSize.value,
        "faultCode": searchForm.faultCode,
        "faultName": searchForm.faultName,
        "faultSys": searchForm.faultSys,
        "startTime": searchForm.timeRange[0],
        "endTime": searchForm.timeRange[1],
        "faultDisposeProgress": searchForm.faultDisposeProgress,
        "disposeMeasure": searchForm.disposeMeasure,
        "disposeCommand": searchForm.disposeCommand,
        "sstartTime": searchForm.timeRange2[0],
        "sendTime": searchForm.timeRange2[1],
        "effectBusiDuration": searchForm.effectBusiDuration,
        "faultReasonType": searchForm.faultReasonType,
        "faultDesc": searchForm.faultDesc,
        "eventLevel": searchForm.eventLevel,
        "directReason": searchForm.directReason,
        "radicallyReason": searchForm.radicallyReason,
        "radicallyReasonClass": searchForm.radicallyReasonClass,
        "radicallyReasonType": searchForm.radicallyReasonType,
        "similarityProblem": searchForm.similarityProblem,
        "faultDutyOrg": searchForm.faultDutyOrg,
        "faultFollowOrg": searchForm.faultFollowOrg,
        "faultFollowPeople": searchForm.faultFollowPeople,
        "isInvolveReaverse": searchForm.isInvolveReaverse,
        "isReaversed": searchForm.isReaversed,
        "rectificationMeasure": searchForm.rectificationMeasure,
        "remark": searchForm.remark,
      });
      tableData.value = response.list;
      total.value = response.count;
    };

    const toggleAdvancedSearch = () => {
      // 切换更多查询条件的显示状态
      // 这里可以添加逻辑来控制更多查询条件的显示
    };

    const onSearch = () => {
      // 实现查询逻辑
      console.log('查询条件:', searchForm);
      // 这里可以添加查询逻辑，比如发送请求到服务器
      fetchTableData();
      ElMessage.success('查询成功');
    };

    const onSave = async () => {
      // 实现保存逻辑
      // 这里可以添加保存逻辑，比如发送请求到服务器
      if(index.value === -1){
        ElMessage.error('没有要保存的数据');
        return;
      }
      const response = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/typicalFault/add', tableData.value[index.value-1]);
      ElMessage.success('保存成功');
    };

    const reset = () => {
      searchForm.faultCode = '';
      searchForm.faultName = '';
      searchForm.faultSys = '';
      searchForm.timeRange = '';
      searchForm.faultDisposeProgress = '';
      searchForm.disposeMeasure = '';
      searchForm.disposeCommand = '';
      searchForm.timeRange2 = '';
      searchForm.effectBusiDuration = '';
      searchForm.faultReasonType = '';
      searchForm.faultDesc = '';
      searchForm.eventLevel = '';
      searchForm.directReason = '';
      searchForm.radicallyReason = '';
      searchForm.radicallyReasonClass = '';
      searchForm.radicallyReasonType = '';
      searchForm.similarityProblem = '';
      searchForm.faultDutyOrg = '';
      searchForm.faultFollowOrg = '';
      searchForm.faultFollowPeople = '';
      searchForm.isInvolveReaverse = '';
      searchForm.isReaversed = '';
      searchForm.rectificationMeasure = '';
      searchForm.remark = '';
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
      }
    }

    const getfaultReasonTypeLabel = (value) => {
      const option = dropList.NSOS_FAULT_REASON_TYPE.find(option => option.value === value);
      return option ? option.label : '';
    };

    const geteventLevelLabel = (value) => {
      const option = dropList.NSOS_EVENT_LEVEL.find(option => option.value === value);
      return option ? option.label : '';
    };

    const getradicallyReasonClassLabel = (value) => {
      const option = dropList.NSOS_RADICALLY_REASON_CLASS.find(option => option.value === value);
      return option ? option.label : '';
    };

    const getradicallyReasonTypeLabel = (value) => {
      const option = dropList.NSOS_RADICALLY_REASON_TYPE.find(option => option.value === value);
      return option ? option.label : '';
    };

    const getsimilarityProblemLabel = (value) => {
      const option = dropList.NSOS_SIMILARITY_PROBLEM.find(option => option.value === value);
      return option ? option.label : '';
    };

    const getisInvolveReaverseLabel = (value) => {
      const option = dropList.NSOS_IS_INVOLVE_REAVERSE.find(option => option.value === value);
      return option ? option.label : '';
    };

    const getisReaversedLabel = (value) => {
      const option = dropList.NSOS_IS_REAVERSED.find(option => option.value === value);
      return option ? option.label : '';
    };

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

    onMounted(async() => {
      const dropStore = useDropStore();
      await dropStore.initDrops(['NSOS_FAULT_REASON_TYPE','NSOS_EVENT_LEVEL','NSOS_RADICALLY_REASON_CLASS','NSOS_RADICALLY_REASON_TYPE','NSOS_SIMILARITY_PROBLEM','NSOS_IS_INVOLVE_REAVERSE','NSOS_IS_REAVERSED']);
      dropStore.get(dropList, ['NSOS_FAULT_REASON_TYPE','NSOS_EVENT_LEVEL','NSOS_RADICALLY_REASON_CLASS','NSOS_RADICALLY_REASON_TYPE','NSOS_SIMILARITY_PROBLEM','NSOS_IS_INVOLVE_REAVERSE','NSOS_IS_REAVERSED']);
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
      onSave,
      formatTimestamp,
      handleSelectionChange,
      handleSizeChange,
      handlePageChange,
      reset,
      index,
      dropList,
      getfaultReasonTypeLabel,
      geteventLevelLabel,
      getradicallyReasonClassLabel,
      getradicallyReasonTypeLabel,
      getsimilarityProblemLabel,
      getisInvolveReaverseLabel,
      getisReaversedLabel,
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
  cursor: pointer;
  font-weight: bold;
  color: #409EFF; /* 蓝色字体 */
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

