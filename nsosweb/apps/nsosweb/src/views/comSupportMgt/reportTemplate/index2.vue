<template>
  <Page auto-content-height>
    <el-container class="h-full bg-white">
      <el-header height="50px">
        <el-form
          ref="form"
          :inline="true"
          :model="data.form"
          label-position="right"
          class="demo-form-inline mt-2"
        >
          <el-row>
            <el-col :span="4">
              <el-form-item label="模板编号:" prop="templateCode">
                <el-input v-model="data.form.templateCode" clearable>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="模板名称:" prop="templateName">
                <el-input v-model="data.form.templateName" clearable>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="报表维度：" prop="dimension">
                <el-select v-model="data.form.dimension" placeholder="请选择报表维度">
                  <el-option v-for="item in dropList.NSOS_REPORT_DIMENSION" :key="item.value" :label="item.label" :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="是否启用：" prop="isEnable">
                <el-select  v-model="data.form.isEnable"  placeholder="请选择是否启用"  >
                  <el-option v-for="item in dropList.NSOS_REPORT_ISENABLE" :key="item.value" :label="item.label"  :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item>
                <el-button type="primary" class="ml-4" :icon="Search" @click="query">查询</el-button >
                <el-button type="primary" class="ml-4" :icon="Plus" @click="add">添加模板</el-button >
                <el-button type="info" class="ml-4" :icon="RefreshLeft" @click="reset" >重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <el-main style="height: calc(100% - 95px)">
        <el-table
          border
          ref="tab"
          :data="data.tableData"
          size="small"
          style="width: 100%; height: 100%"
        >
          <el-table-column type="index" />
          <el-table-column type="selection" />
          <el-table-column prop="templateCode" label="模板编号" />
          <el-table-column prop="templateName" label="模板名称" />
          <el-table-column prop="reportMon" label="年月">
            <template #default="scope">
              {{
                scope.row.dimension === 'Y'
                  ? dayjs(new Date(scope.row.reportMon)).format('YYYY')
                  : dayjs(new Date(scope.row.reportMon)).format('YYYY-MM')
              }}
            </template>
          </el-table-column>
          <el-table-column prop="dimension" label="维度" column-key="NSOS_REPORT_DIMENSION" :formatter="formatDrop" />
          <el-table-column prop="suitUnit" label="适用单位" />
          <el-table-column prop="createTime" label="创建时间" :formatter="tDateTimeFormat"/>
          <el-table-column prop="creatorId" label="创建人" />
          <el-table-column prop="updateTime" label="修改时间" :formatter="tDateTimeFormat"/>
          <el-table-column prop="updatorId" label="修改人" />
          <el-table-column prop="isEnable" label="是否启用" column-key="NSOS_REPORT_ISENABLE" :formatter="formatDrop" />
          <el-table-column prop="remark" label="备注" />
          <el-table-column label="操作" align="center" width="200px">
            <template #default="{ row }">
              <el-button link @click="" class="pubp-button">下载</el-button>
              <el-button link @click="" class="pubp-button">预览</el-button>
              <el-button link @click="edit(row)" class="pubp-button">修改</el-button>
              <el-button link @click="del(row.id)" class="pubp-button">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer height="45px">
        <el-pagination
          v-model:current-page="data.pageInfo.pageNo"
          v-model:page-size="data.pageInfo.pageSize"
          :total="data.pageInfo.total"
          :page-sizes="[20, 50, 100, 200]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="currentChange"
        ></el-pagination>
        <addDialog
          v-if="data.dialogShow"
          :title="data.title"
          :rowInfo="data.rowInfo"
          @switchDialog="switchDialog"
          @query="query"
          style="width: 700px; height: 620px"
        />
      </el-footer>

    <Modal class="w-[800px] h-[400px]" title="模板信息" :footer="false" :closeOnClickModal="false" :draggable="true">
      <TemplateDiaLog :formData="data.selectedRow" @close="addClose" @closeDiaLog="closeDiaLog" @query="query"></TemplateDiaLog>
    </Modal>
    </el-container>
  </Page>
</template>

<script lang="ts" setup>
import {
  ElTable,
  ElTableColumn,
  ElContainer,
  ElFormItem,
  ElForm,
  ElInput,
  ElButton,
  ElSelect,
  ElRow,
  ElCol,
  ElPagination,
  ElMessage,
  ElMessageBox,
  type FormInstance,
} from 'element-plus';
import { tDateTimeFormat, formatDrop } from '#/utils/commonUtil.ts';
import { Page } from '@vben/common-ui';
import { Plus, Search, RefreshLeft } from '@element-plus/icons-vue';
import { reactive, ref, onMounted, nextTick } from 'vue';
import dayjs from 'dayjs';
import { requestClient } from '#/api/request';
import addDialog from './addDialog.vue';
import { useDropStore } from '#/store';

const dropList: any = reactive({});
onMounted(async () => {
  const dropStore = useDropStore();
  await dropStore.initDrops(['NSOS_REPORT_DIMENSION', 'NSOS_REPORT_ISENABLE']);
  dropStore.get(dropList, ['NSOS_REPORT_DIMENSION', 'NSOS_REPORT_ISENABLE']);
  nextTick().then(() => {
    query();
  });
});

const tab = ref();
const form = ref<FormInstance>();

const data = reactive({
  dialogShow: false,
  tableData: [],
  form: {
    templateName: '',
    templateCode: '',
    dimension: '',
    isEnable: '',
  },
  pageInfo: {
    pageSize: 20,
    pageNo: 1,
    total: 0,
  },
  title: '',
  rowInfo: [],
});

interface queryParams {
  templateName: string;
  templateCode: string;
  dimension: string;
  isEnable: string;
  pageNo: number;
  pageSize: number;
}

const params: queryParams = reactive({
  templateName: '',
  templateCode: '',
  dimension: '',
  isEnable: '',
  pageNo: data.pageInfo.pageNo,
  pageSize: data.pageInfo.pageSize,
});

async function getTableApi(params: queryParams) {
  return requestClient.post(
    import.meta.env.VITE_NSOSZH + '/reportTemplate/query',
    params,
  );
}

const query = async () => {
  params.templateName = data.form.templateName;
  params.templateCode = data.form.templateCode;
  params.dimension = data.form.dimension;
  params.isEnable = data.form.isEnable;
  const { list, pageNo, count } = await getTableApi(params);
  data.tableData = list;
  data.pageInfo.pageNo = pageNo;
  data.pageInfo.total = count;
};

const reset = () => {
  data.form.templateName = '';
  data.form.templateCode = '';
  data.form.dimension = '';
  data.form.isEnable = '';
};

const add = () => {
  data.rowInfo = [];
  data.title = '添加模板';
  switchDialog(true);
};

const edit = (val: any) => {
  data.rowInfo = val;
  data.title = '编辑模板';
  switchDialog(true);
};

function delItemApi(id: String) {
  return requestClient.post(
    import.meta.env.VITE_NSOSZH + '/reportTemplate/del',
    { id },
  );
}

const del = (val: any) => {
  ElMessageBox.confirm('确定要删除此项吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      try {
        delItemApi(val);
        query();
        ElMessage.success('删除成功');
      } catch (error) {
        console.error('删除失败:', error);
        ElMessage.error('删除失败');
      }
    })
    .catch(() => {
      ElMessage.info('已取消删除');
    });
};

const handleSizeChange = (val: number) => {
  data.pageInfo.pageSize = val;
  params.pageSize = val;
  query();
};

const currentChange = (val: number) => {
  data.pageInfo.pageNo = val;
  params.pageNo = val;
  query();
};

function formatTimestamp(row, column, cellValue) {
  return dayjs(new Date(cellValue)).format('YYYY-MM-DD HH:mm:ss');
}

function formateDimension(row, column, cellValue) {
  for (let i = 0; i < dropList.NSOS_REPORT_DIMENSION.length; i++) {
    if (cellValue === dropList.NSOS_REPORT_DIMENSION[i].value) {
      return dropList.NSOS_REPORT_DIMENSION[i].label;
    }
  }
}

function formateIsEnable(row, column, cellValue) {
  for (let i = 0; i < dropList.NSOS_REPORT_ISENABLE.length; i++) {
    if (cellValue === dropList.NSOS_REPORT_ISENABLE[i].value) {
      return dropList.NSOS_REPORT_ISENABLE[i].label;
    }
  }
}

const switchDialog = (isOpen: boolean) => {
  data.dialogShow = isOpen;
};
</script>
<style scoped>
.demo-form-inline .el-input {
  --el-input-width: 100%;
}

.demo-form-inline .el-select {
  --el-select-width: 100%;
}

:deep(.el-date-editor.el-input, .el-date-editor.el-input__wrapper) {
  width: 100%;
}

:deep(.el-form--inline .el-form-item) {
  width: calc(100% - 20px);
  margin-right: 20px;
  margin-bottom: 12px;
}

:deep(.el-main) {
  padding: 0;
}

.pubp-button {
  color: #006be6;
  font-size: small;
}
</style>
