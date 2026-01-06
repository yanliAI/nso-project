<template>
  <el-container>
    <el-header>
      <h1 class="title">作业人员能力画像</h1>
      <el-button type="info" :icon="Back" @click="router.back">返回</el-button>
    </el-header>
    <el-divider />

    <el-container>
      <!-- 左侧基本信息 -->
      <el-aside>
        <div class="avatar-con">
          <el-avatar
            src="/images/person.jpeg"
            :size="100"
            shape="circle"
          ></el-avatar>
          <div style="margin-left: 15px">
            <p style="font-size: 16px; font-weight: 900; color: #333">
              {{ detailData.name }}
            </p>
            <p style="margin-top: 10px; font-size: 12px" v-if="detailData.sex">
              {{ detailData.sex == 1 ? '男' : '女' }} {{ detailData.age }}岁
            </p>
          </div>
        </div>
        <div class="baseinfo-con">
          <div
            v-for="(item, index) in memberBaseInfos"
            :key="index"
            style="margin-top: 25px"
          >
            <el-text type="primary">{{ item.label }}: </el-text>
            <el-text>{{ item.value }}</el-text>
          </div>
        </div>
      </el-aside>
      <el-divider direction="vertical" />

      <el-main>
        <!-- 多维信息 -->
        <div class="multi-info">
          <div class="sub-title">
            <div class="line-tag"></div>
            <span>多维信息</span>
          </div>
          <el-row :gutter="40" style="margin-top: 16px">
            <el-col :span="4" v-for="(item, index) in multiInfos" :key="index">
              <div
                class="multi-item"
                :style="`background: linear-gradient(to right, ${item.colorStart}, ${item.colorEnd});`"
              >
                <p v-html="item.label.replace(/\n/g, '<br>')"></p>
                <p v-if="item.hasOwnProperty('value')">{{ item.value }}</p>
              </div>
            </el-col>
          </el-row>
        </div>

        <el-tabs type="border-card" v-model="activeTab" class="main-tabs">
          <el-tab-pane label="作业资质信息" name="workQualification">
            <WorkQualification
              v-if="
                detailData.qualifyFfectiveList ||
                detailData.qualifyExpirationList
              "
              :effective-data="detailData.qualifyFfectiveList"
              :expiration-data="detailData.qualifyExpirationList"
            />
          </el-tab-pane>
          <el-tab-pane label="个人违章记录" name="grwzjl">
            <div class="empty flex items-center">暂无数据</div>
          </el-tab-pane>
          <el-tab-pane label="历史作业记录" name="lszyjl">
            <OperationRecord
              v-if="detailData.portraitHistoryWorkList"
              :record-data="detailData.portraitHistoryWorkList"
            />
          </el-tab-pane>
          <el-tab-pane label="安规资质成绩" name="agzzcj">
            <div class="empty flex items-center">暂无数据</div>
          </el-tab-pane>
          <el-tab-pane label="人员动态记录" name="rydtjl">
            <div class="empty flex items-center">暂无数据</div>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import {
  ElTabs,
  ElTabPane,
  ElContainer,
  ElHeader,
  ElMain,
  ElAvatar,
  ElText,
  ElRow,
  ElCol,
} from 'element-plus';
import { Back } from '@element-plus/icons-vue';
import { ref, reactive, computed, onMounted, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import WorkQualification from './workQualification.vue';
import OperationRecord from './operationRecord.vue';
import { getPortraitBasicDetailApi } from '#/api';

defineOptions({
  name: 'ProfileDetail',
});

const route = useRoute();
const router = useRouter();
// 接受query参数
const queryParams = route.query;
const detailData = ref({});

const politicalStatusMap = {
  '1': '党员',
  '2': '团员',
  '3': '群众',
};

const baseLabelKeys = {
  phoneNumber: '手机号',
  idNumber: '证件号',
  birthday: '出生日期',
  politicalStatus: '政治面貌',
  unitName: '所属单位',
  deptName: '部门',
  workRole: '作业角色',
  fortressAccount: '堡垒机号',
};
const memberBaseInfos = ref([]);
// 初始化显示的基础信息
Object.keys(baseLabelKeys).map((item) => {
  memberBaseInfos.value.push({
    label: baseLabelKeys[item],
    value: '',
  });
});

// 多维信息数据
const multiInfos = ref([
  {
    label: '累计作业单数',
    value: 0,
    colorStart: '#00A8FF',
    colorEnd: '#4B82FF',
  },
  {
    label: '当年累计扣分',
    value: 0,
    colorStart: '#9933CC',
    colorEnd: '#4B82FF',
  },
  {
    label: '近三年累计扣分',
    value: 0,
    colorStart: '#FFB177',
    colorEnd: '#FFCCCC',
  },
  {
    label: '当前违章记录',
    value: 0,
    colorStart: '#00A8FF',
    colorEnd: '#4B82FF',
  },
  {
    label: '',
    colorStart: '#FFB177',
    colorEnd: '#FFCCCC',
  },
  {
    label: '',
    colorStart: '#FFB177',
    colorEnd: '#FFCCCC',
  },
]);

const activeTab = ref('workQualification');

/**
 * 查询
 */
const query = async () => {
  try {
    const response = await getPortraitBasicDetailApi(queryParams.id);
    detailData.value = response;
    memberBaseInfos.value = [];
    Object.keys(baseLabelKeys).map((item) => {
      let value = response[item];
      if (item === 'politicalStatus') {
        value = politicalStatusMap[response[item]];
      }
      memberBaseInfos.value.push({
        label: baseLabelKeys[item],
        value,
      });
    });
    multiInfos.value = multiInfos.value.map((item, index) => {
      switch (index) {
        case 0:
          return { ...item, value: response.totalWorkOrders || 0 };
        case 1:
          return { ...item, value: response.currentYearDeductionScore || 0 };
        case 2:
          return { ...item, value: response.threeYearDeductionScore || 0 };
        case 3:
          return { ...item, value: response.currentYearViolations || 0 };
        case 4:
          return {
            ...item,
            label: response.participatedInLastThreeMonths
              ? '近三个月内\n参加过作业'
              : '近三个月内未\n参加过作业',
          };
        case 5:
          return {
            ...item,
            label: response.participatedInSouthernGrid
              ? '在南网范围内\n参加过作业'
              : '在南网范围内\n未参加过作业',
          };
      }
      return item;
    });
  } catch {}
};

onMounted(() => {
  query();
});
</script>

<style scoped lang="less">
.el-container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
}
.el-aside {
  width: 260px;
}
.title {
  flex: 1;
  margin-top: 10px;
  font-weight: 900;
}
.el-divider--horizontal {
  margin: 0 20px;
}

.avatar-con {
  display: flex;
  align-items: center;
  padding: 10px 10px 20px 20px;
}
.baseinfo-con {
  padding: 5px 20px;
}
.el-divider--vertical {
  height: 100%;
  margin: 0;
}

.multi-info {
}

.sub-title {
  display: flex;
  color: #333;
  font-size: 16px;
  font-weight: 900;

  .line-tag {
    margin-right: 8px;
    width: 5px;
    height: 20px;
    background-color: #3296fa;
  }
}
.multi-item {
  padding: 5px 10px;
  color: white;
  font-size: 15px;
  font-weight: bold;
  border-radius: 5px;

  p {
    text-align: center;
    line-height: 2rem;
  }
}

.main-tabs {
  width: 100%;
  height: calc(100% - 120px);
  margin: 10px 0 0;
}

.empty {
  height: 400px;
  color: #666;
  justify-content: center;
  background-color: #f4f4f4;
  margin: 20px;
}
</style>
