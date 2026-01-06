<script lang="ts" setup>
import IconFillin from '#/assets/images/specialRunMode/icon-fill-in.png';
import IconSubmit from '#/assets/images/specialRunMode/icon-submit.png';
import IconDrawUp from  '#/assets/images/specialRunMode/icon-drawUp.png'; 
import IconSubmission from  '#/assets/images/specialRunMode/icon-submission.png'; 
import IconTask from '#/assets/images/specialRunMode/icon-task.png'; 
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
  ElPagination,
  ElMessage,
  ElMessageBox,
  ElCard,
  ElTabs,
  type FormInstance,
} from 'element-plus';
import { ref } from 'vue';
import DetailOfMonthlyPublish from './detailOfMonthlyPublish.vue';
import DetailOfIncomeSubmission from './detailOfIncomeSubmission.vue';
import DetailOfAnnualTask from './detailOfAnnualTask.vue';
import DetailOfMonthlyTask from './detailOfMonthlyTask.vue';
import DetailOfRunModeSubmission from './detailOfRunModeSubmission.vue';
import DetailOfEstablishment from './detailOfEstablishment.vue';

// Define all possible tab types
type TabType = 'filled' | 'published' | 'task' | 'submited' | 'establishment';
const currentPublishItem = ref('monthlyIncome'); // 收资发布
const currentFillInItem = ref('incomeFillIn'); // 收资填报
const currentTaskItem = ref('monthlyTask'); // 任务
const currentSubmitItem = ref('runModeFillIn'); // 年月运行方式填报
const currentestablishItem = ref('establishment');

const selectedTab = ref<TabType>('filled');

const incomeSubmissionValue = ref('');

const handleTabClick = (tab: TabType) => {
  selectedTab.value = tab;
};
</script>
<template>
  <div class="main-bd">
    <el-card class="w-full">
      <div class="header-nav bg-white">
        <!-- First Tab -->
        <div
          class="header-box"
          :class="{ selected: selectedTab === 'published' }"
          @click="handleTabClick('published')"
        >
          <div class="icon-box">
            <img :src="IconFillin" />
          </div>
          <div class="nav-text">
            <span>运行方式收资发布</span>
            <!-- <span style="font-size: 20px; font-weight: 400">2</span> -->
          </div>
        </div>

        <!-- Second Tab -->
                 <div
          class="header-box"
          :class="{ selected: selectedTab === 'filled' }"
          @click="handleTabClick('filled')"
        >
          <div class="icon-box">
            <img :src="IconSubmit" />
          </div>
          <div class="nav-text">
            <span>运行方式收资填报</span>
            <!-- <span style="font-size: 20px; font-weight: 400">{{incomeSubmissionValue}}</span> -->
          </div>
        </div>


        <!-- Third Tab -->
        <!-- <div
          class="header-box"
          :class="{ selected: selectedTab === 'submited' }"
          @click="handleTabClick('submited')"
        >
          <div class="icon-box">
            <img :src="IconSubmission" />
          </div>
          <div class="nav-text">
            <span>年月运行方式填报</span>
            <span style="font-size: 20px; font-weight: 400">4</span>
          </div>
        </div> -->
        <!-- Fourth Tab -->
        <!-- <div
          class="header-box"
          :class="{ selected: selectedTab === 'task' }"
          @click="handleTabClick('task')"
        >
          <div class="icon-box">
            <img :src="IconTask" />
          </div>
          <div class="nav-text">
            <span>年月运行方式任务</span>
            <span style="font-size: 20px; font-weight: 400">3</span>
          </div>
        </div> -->
        <!-- Five Tab -->
        <!-- <div
          class="header-box"
          :class="{ selected: selectedTab === 'establishment' }"
          @click="handleTabClick('establishment')"
        >
          <div class="icon-box">
            <img :src="IconDrawUp" />
          </div>
          <div class="nav-text">
            <span>运行方式自动编制</span>
            <span style="font-size: 20px; font-weight: 400">4</span>
          </div>
        </div> -->
      </div>
    </el-card>
    <ElCard class="content"style="margin-top: 5px">
      <!-- Content for each tab -->
      <div v-if="selectedTab === 'filled'">
        <el-tabs
          ref="myTab"
          v-model="currentFillInItem"
          type="card"
          class="h-full w-full bg-white"
        >
          <el-tab-pane
            label="运行方式收资填报"
            name="incomeFillIn"
            :closable="false"
          >
            <DetailOfIncomeSubmission v-model="incomeSubmissionValue"></DetailOfIncomeSubmission>
          </el-tab-pane>
        </el-tabs>
      </div>

      <div v-else-if="selectedTab === 'published'">
        <el-tabs
          ref="myTab"
          v-model="currentPublishItem"
          type="card"
          class="h-full w-full bg-white"
        >
          <el-tab-pane label="月收资" name="monthlyIncome" :closable="false">
            <DetailOfMonthlyPublish :dateType="1"></DetailOfMonthlyPublish>
          </el-tab-pane>
          <el-tab-pane label="年收资" name="annualIncome" :closable="false">
            <DetailOfMonthlyPublish :dateType="2"></DetailOfMonthlyPublish>
          </el-tab-pane>
        </el-tabs>
      </div>

      <div v-else-if="selectedTab === 'task'">
        <el-tabs
          ref="myTab"
          v-model="currentTaskItem"
          type="card"
          class="h-full w-full bg-white"
        >
          <el-tab-pane label="月方式" name="monthlyTask" :closable="false">
            <DetailOfMonthlyTask></DetailOfMonthlyTask>
          </el-tab-pane>
          <el-tab-pane label="年方式" name="annualTask" :closable="false">
            <DetailOfAnnualTask></DetailOfAnnualTask>
          </el-tab-pane>
        </el-tabs>
      </div>

      <div v-else-if="selectedTab === 'submited'">
        <!-- Content for "已拒绝" (rejected) tab -->
        <el-tabs
          ref="myTab"
          type="card"
          v-model="currentSubmitItem"
          class="h-full w-full bg-white"
        >
          <el-tab-pane
            label="年月运行方式填报"
            name="runModeFillIn"
            :closable="false"
          >
            <DetailOfRunModeSubmission></DetailOfRunModeSubmission>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div v-else>
        <!-- Content for "已拒绝" (rejected) tab -->
        <el-tabs
          ref="myTab"
          type="card"
          v-model="currentestablishItem"
          class="h-full w-full bg-white"
        >
          <el-tab-pane
            label="年月运行方式填报"
            name="establishment"
            :closable="false"
          >
          <DetailOfEstablishment></DetailOfEstablishment>
          </el-tab-pane>
        </el-tabs>
      </div>
    </ElCard>
  </div>
</template>
<style lang="less" scoped>
:deep(.el-card__body){
  padding: 15px;
}
.main-bd {
  width: 100%;
  height: 100%;
  padding: 5px;
}
.header-nav {
  // height: 100px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px; /* Better spacing between tabs */
  //   padding: 0px;
  .header-box {
    height: 70px;
    width: 220px;
    border-radius: 5%;
    display: flex;
    // justify-content: center;
    align-items: center;
    padding: 5px 10px;
    .icon-box {
      height: 50px;
      width: 50px;
      border-radius: 50%;
      //   background-color: rgb(160, 179, 77);
    }
    .nav-text {
      padding: 10px;
      display: flex;
      flex-direction: column;
    }
  }
  .header-box:hover {
    background-color: #f5f5f5;
  }

  .header-box.selected {
    background-color: #e6f7ff;
    // border: 1px solid #1890ff;
  }
}
</style>
