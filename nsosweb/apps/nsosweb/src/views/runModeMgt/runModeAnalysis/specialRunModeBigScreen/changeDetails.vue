<script setup lang="ts">
import {
  ElForm,
  ElFormItem,
  ElTable,
  ElTableColumn,
  ElCalendar,
  ElInput,
  ElButton,
  ElSelect,
  ElOption,
  ElRow,
  ElCol,
  ElIcon,
  ElPagination,
  ElContainer,
  ElHeader,
  ElMain,
  ElFooter,
  ElDialog,
  ElMessage,
  ElMessageBox,
  ElLink,
  ElTag,
  ElRadioGroup,
  ElRadioButton,
} from 'element-plus';
import arrowUp from '#/assets/images/specialRunMode/arrow-up.png';
import iconTriangle from '#/assets/images/specialRunMode/icon-triangle.png';
import { Search,Right, Download } from '@element-plus/icons-vue';
import {
  ref,
  reactive,
  computed,
  onMounted,
  onUnmounted,
  onActivated,
  onDeactivated,
  nextTick,
  watch
} from 'vue';
import iconDown from '#/assets/images/specialRunMode/icon-down.png'
import iconUp from '#/assets/images/specialRunMode/icon-up.png'

const tableData = ref([]); 
const displayType = ref('1')
const data = defineModel('tableData'); // 系统名称
const type = defineModel('type'); // 展示类别

watch(data, (newVal) => {
  tableData.value = data.value
  displayType.value = type.value
});


onMounted(() => {
  tableData.value = data.value
  displayType.value = type.value
});

// 定义运行方式类型
const runModeTypes = ['全部开放','限时开放','白名单开放','']

</script>

<template>
  <div class="custom" >
    <ElTable  :data="tableData" stripe border height="500" style="margin-top: 0px">
      <ElTableColumn label="系统名称" align="center">
        <template #default="scope">
          <el-tooltip effect="dark" :content="scope.row.deploySystemName" placement="top">
            <span class="run-mode-desc">{{ scope.row.deploySystemName }}</span>
          </el-tooltip>
        </template>
      </ElTableColumn>
      <ElTableColumn prop="businessDeptSystemResponsibleDeptName" label="业务部门" align="center">
        <template #header>
            <span style="height: 40px;">业务部门</span>
        </template>
        <template #default="scope">
          <el-tooltip effect="dark" :content="scope.row.businessDeptSystemResponsibleDeptName" placement="top">
            <span class="run-mode-desc">{{ scope.row.businessDeptSystemResponsibleDeptName }}</span>
          </el-tooltip>
        </template>
      </ElTableColumn>
      <ElTableColumn prop="isNetwork" align="center" label="是否互联网" width="100">
        <template #default="{ row, $index }">
          <span v-if="row.isInternetApplication === 1">是</span>
          <span v-else>否</span>
        </template>
      </ElTableColumn>
      <ElTableColumn prop="changeType" label="变化类型" align="center"  v-if="displayType === '1'" width="400" class="custom-header-cell">
        <template #header>
          <div style="display: flex; align-items: center; height: 40px;">
            <span style="width: 200px; height: 40px;line-height: 40px;">原运行方式</span>
            <span style="width: 200px; height: 40px;line-height: 40px;  border-left: 1px solid #154D97 !important;">当前运行方式</span>
          </div>
        </template>
        <template #default="{ row, $index }">
          <div style="display: flex; align-items: center;">
            <span style="width: 185px;">{{row.originalModeName}}</span>
            <span style="width: 30px;"><el-icon style="width: 30px; font-size: 20px; font-weight: 700;" :style="{'color': row.changeType === 1? '#FF4242':'#38FF53'}"><right /></el-icon></span>
            <span style="width: 185px;">{{row.currentModeName}}</span>
          </div>
        </template>
      </ElTableColumn>
      <ElTableColumn prop="specialRunModeDescription" align="center" width="300">
        <template #header>
          <div style="white-space: normal; line-height: 1.5">运行方式描述</div>
        </template>
        <template #default="scope">
          <el-tooltip effect="dark" :content="scope.row.specialRunModeDescription" placement="top">
            <span class="run-mode-desc" style="padding-right: 5px;">{{ scope.row.specialRunModeDescription }}</span>
          </el-tooltip>
        </template>
      </ElTableColumn>
    </ElTable>
  </div>
</template>
<style lang="less" scoped>

.run-mode-desc {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5; /* 限制显示行数 */
  overflow: hidden;
  text-overflow: ellipsis;
}

// 表格弹窗样式
.custom-table :deep(.warning-row) {
  color: #e6a23c !important; /* Element Plus 的 warning 颜色 */
  font-weight: bold;
}

// 单独配置单元格padding
:deep(.el-table__header-wrapper .el-table__cell) {
  padding: 0 !important;
  height: 40px;
}

.el-table--fit {
  background-color: #0d2461;
  border: 1px solid #0245a3 !important;
}

.dialog-header {
  padding: 5px !important;
  margin-bottom: 10px;
  width: 100%;
  height: 50px;
  background-color: #002d78;
  background: url('../../../../assets/images/specialRunMode/header-bg.png') 100%
    no-repeat;
  background-size: 100% 100%;
  .dialog-title {
    margin: 5px 0px 0 5px;
    font-size: 24px;
    font-weight: 500;
    text-align: center;
    color: white;
  }
}
.dialog-content {
  padding: 16px;
  // height: 460px;
}

.run-mode-desc {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4; /* 限制显示行数 */
  overflow: hidden;
  text-overflow: ellipsis;
}

:deep(.el-dialog .el-dialog__header) {
  padding: 0 !important;
}

.system-detail-dialog1 {
  :deep(.el-dialog) {
    padding: 40px !important;
  }
}

.custom {
  padding: 20px;
  /* 表头样式 */
  :deep(.el-table__header) th {
    background-color: #002d78 !important; /* 表头背景色 */
    // box-shadow: inset 0px -25px 38px 0px rgba(0, 132, 255, 0.67);
    color: white; /* 表头文字颜色 */
  }
  /* 表体样式 */
  :deep(.el-table__body) tr {
    background-color: #012462; /* 表体背景色 */
    color: #fff; /* 表体文字颜色 */
    border-bottom: #cccdd0 1px solid !important;
  }
  /* 单元格样式 - 添加上下边框 */
  :deep(.el-table__body) td {
    border-top: 1px solid #0e4a9784 !important;     /* 上边框 */
    border-bottom: 1px solid #0e4a9784 !important;  /* 下边框 */
    border-left: none !important;
    border-right: none !important;
  }
  :deep(.el-table__body) tr:first-child td {
    border-top: 1px solid #0a5bc470 !important;
  }
}

.truncate-text {
  white-space: nowrap; /* 禁止换行 */
  overflow: hidden; /* 隐藏超出部分 */
  text-overflow: ellipsis; /* 超出部分显示省略号 */
  max-width: 90px; /* 限制最大宽度（可调整） */
  display: inline-block; /* 确保宽度生效 */
}
</style>
