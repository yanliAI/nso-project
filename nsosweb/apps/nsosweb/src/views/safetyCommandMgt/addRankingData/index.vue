<script lang="ts" setup>
import {
  ElTable,
  ElTableColumn,
  ElContainer,
  ElFormItem,
  ElDialog,
  ElForm,
  ElInput,
  ElButton,
  ElSelect,
  ElRow,
  ElCol,
  ElTabs,
  ElPagination,
  ElMessage,
  ElMessageBox,
  type FormInstance,
} from 'element-plus';
import {
  Search,
  RefreshLeft,
  Delete,
  Download,
  Monitor,
  CirclePlus,
  CircleCheck,
} from '@element-plus/icons-vue';
import { reactive, ref, onMounted, nextTick } from 'vue';
import detailOfAttackRankingList from './detailOfAttackRankingList.vue';
import detailOfdefendRankingListCompany from './detailOfdefendRankingListCompany.vue';
import detailOfdefendRankingListPersonal from './detailOfdefendRankingListPersonal.vue';

const currentRankingList = ref('attackRankingList');
</script>
<template>
  <div class="h-full bg-white">
    <el-tabs ref="myTab" v-model="currentRankingList"  type="card" class="w-full h-full bg-white">
      <el-tab-pane label="攻击贡献榜" name="attackRankingList" :closable="false">
        <detailOfAttackRankingList></detailOfAttackRankingList>
      </el-tab-pane>
      <el-tab-pane label="防守贡献榜(管制单位)" name="defendRankingListCompany" :closable="false">
        <detailOfdefendRankingListCompany></detailOfdefendRankingListCompany>
      </el-tab-pane>
      <el-tab-pane label="防守贡献榜(非管制单位)" name="defendRankingListPersonal" :closable="false">
        <detailOfdefendRankingListPersonal></detailOfdefendRankingListPersonal>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<style lang="less" scoped>

// @import "../../../../../public/index.css"; 
.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.demo-form-inline .el-select {
  --el-select-width: 220px;
}

.header-box{
  height: 80px;
  padding: 30px 20px 10px 20px;
  // display: flex;
  // align-items: center;
  // border-bottom: 1px solid #E4E4E7;
}

// :deep(.el-form){
//   padding: 0 0 20px 0;
// }
:deep(.el-form-item__label){
  font-size: 14px;
  font-weight: 500;
  line-height: 32px;
  color: #515A6E;
}
// :deep(.el-select__wrapper){
//   height: 40px;
// }
// :deep(.el-pagination button) {
//   border: 1px solid #EFEFEF;
//   color: #2074c9;
//   // box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
// }
// // :deep(.el-pagination>.is-first){
// //   border-right: none;
// // }
// :deep(.el-pagination>.is-last){
//   border-left: none;
// }
// :deep(.el-pager li.is-active ){
//   background: #169BD5;
//   color: #fff;
// }
// :deep(.el-pager li){
//   border: 1px solid #EFEFEF;
//   border-left: none;
//   color: #027DB4;
// }

// :deep(.el-button.is-link){
//   color: #18ACFF;
//   font-size: 16px;
//   // font-family: Microsoft YaHei;
// }
.btn-reset{
  background: #F2F3F5;
  border:none;
  color: #616162;
  font-size: 14px;
}
.btn-reset:hover{
  background: #bac2c9 !important;
}

.btn-search{
  background: #1890FF;
}

// /* 表头样式 */
// :deep(.el-table__header) th {
//   background-color: #F3F3F3; /* 表头背景色 */
//   font-size: 14px;
//   height: 50px !important;
//   color: #515A6E;
//   border-right: none !important;
//   font-family: Microsoft YaHei;
// }

// // 表体
// // :deep(.el-table__body) tr {
// //   font-size: 14px;
// //   font-family: Microsoft YaHei;
// // }
// :deep(.el-table) td {
//   border-right: none !important;
//   /* 设置列的边框颜色和粗细 */
//   font-size: 14px;
//   font-weight: 500;
//   font-family: Microsoft YaHei;
// }

// :deep(.el-table .cell){
//   word-break: break-all;
//   line-height: 23px;
//   padding: 10px;
// }
// // 整表外侧
// :deep(.el-table) {
//   border-left: 1px solid #fff;
// }

:deep(.el-dialog) {
  // --el-dialog-bg-color: #0d2461 !important;
  border-radius: 1px;

  .el-dialog__title {
    // height: 50px !important;
    // font-weight: bold;
    font-size: 18px;
    line-height: 24px;
    color: #303133;
    // line-height: 21px;
    // color: transparent; /* 文字透明 */
    // background: linear-gradient(180deg, #31BEFF 0%, #FFFFFF 40%);
    // -webkit-background-clip: text; /* 仅渐变作用于文字 */
    // background-clip: text; /* 标准语法 */
    // background: linear-gradient(90.00000000000014deg, #31BEFF 0%, #FFFFFF 40%);
  }
  .el-dialog__headerbtn .el-dialog__close{
    color: #0c0b0b;
    padding-top: 30px;
    margin-right: 20px;
  }
  .el-dialog__header{
    padding: 10px;
    padding-bottom: 10px;
  }
  .el-dialog__body{
    padding: 30px 20px;
  }
}
</style>
