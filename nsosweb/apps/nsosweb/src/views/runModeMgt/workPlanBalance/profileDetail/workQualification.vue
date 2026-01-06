<template>
  <div>
    <!-- 生效资质 -->
    <div class="multi-info">
      <div class="sub-title">
        <div class="line-tag"></div>
        <span>生效资质</span>
      </div>
      <el-row
        :gutter="30"
        style="margin-top: 16px"
        v-if="effectiveList.length > 0"
      >
        <el-col :span="6" v-for="(item, index) in effectiveList" :key="index">
          <el-card shadow="always">
            <div class="qualification-item">
              <div v-for="(info, i) in item" :key="i" class="info-item">
                <span>{{ info.label }}：</span>
                <span
                  v-if="info.color"
                  :style="`color: ${info.color}; background-color: ${info.backColor};
                  border: 1px solid ${info.borderColor}; border-radius: 5px; padding: 1px 8px`"
                >
                  {{ info.value }}
                </span>
                <span v-else>{{ info.value }}</span>
              </div>
              <div class="corner-label">生效中</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <div v-else class="empty flex items-center">暂无数据</div>
    </div>

    <!-- 失效资质 -->
    <div class="multi-info" style="margin-top: 20px">
      <div class="sub-title">
        <div class="line-tag"></div>
        <span>失效资质</span>
      </div>
      <el-row
        :gutter="30"
        style="margin-top: 16px"
        v-if="expirationList.length > 0"
      >
        <el-col :span="6" v-for="(item, index) in expirationList" :key="index">
          <el-card shadow="always">
            <div class="qualification-item">
              <div v-for="(info, i) in item" :key="i" class="info-item">
                <span>{{ info.label }}：</span>
                <span
                  v-if="info.color"
                  :style="`color: ${info.color}; background-color: ${info.backColor};
                  border: 1px solid ${info.borderColor}; border-radius: 5px; padding: 1px 8px`"
                >
                  {{ info.value }}
                </span>
                <span v-else>{{ info.value }}</span>
              </div>
              <div class="corner-label" style="background-color: #d81e06">
                已失效
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <div v-else class="empty flex items-center">暂无数据</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElCard, ElRow, ElCol } from 'element-plus';
import { ref, reactive, computed, onMounted, toRefs } from 'vue';
defineOptions({
  name: 'WorkQualification',
});

const effectiveData = defineModel('effectiveData');
const expirationData = defineModel('expirationData');

const baseLabelKeys = {
  qualifyType: '资质类型',
  qualifyFfectiveTime: '生效日期',
  qualifyExpirationTime: '失效日期',
  issueUnitName: '颁发单位',
  adaptiveUnitName: '适用单位',
  attachments: '附件',
};
const qualifyTypeMap = {
  签发人: {
    color: '#722ED1',
    borderColor: '#d3adf7',
    backColor: '#f9f0ff',
  },
  负责人: {
    color: '#722ED1',
    borderColor: '#d3adf7',
    backColor: '#f9f0ff',
  },
  许可人: {
    color: '#1890FF',
    borderColor: '#91d5ff',
    backColor: '#e6f7ff',
  },
  安规: {
    color: '#F5317F',
    borderColor: '#ffadd2',
    backColor: '#fff0f6',
  },
};

const effectiveList = effectiveData.value?.map((item) => {
  let result = Object.keys(baseLabelKeys).map((key) => {
    let itemInfo = {
      label: baseLabelKeys[key],
      value: item[key] || '无',
    };
    if (key === 'qualifyType') {
      itemInfo.color = qualifyTypeMap[item[key]].color;
      itemInfo.borderColor = qualifyTypeMap[item[key]].borderColor;
      itemInfo.backColor = qualifyTypeMap[item[key]].backColor;
    }
    return itemInfo;
  });
  return result;
});

const expirationList = expirationData.value?.map((item) => {
  let result = Object.keys(baseLabelKeys).map((key) => {
    let itemInfo = {
      label: baseLabelKeys[key],
      value: item[key] || '无',
    };
    if (key === 'qualifyType') {
      itemInfo.color = '#000000a5';
      itemInfo.borderColor = '#d9d9d9';
      itemInfo.backColor = '#f5f5f5';
    }
    return itemInfo;
  });
  return result;
});

// const effectiveList = ref([
//   [
//     {
//       label: '资质类型',
//       value: '安规',
//       color: '#F5317F',
//       borderColor: '#ffadd2',
//       backColor: '#fff0f6',
//     },
//     { label: '生效日期', value: '2024-01-01' },
//     { label: '失效日期', value: '2025-01-01' },
//     { label: '颁发单位', value: '广东电网有限公司' },
//     { label: '适用单位', value: '广东电网有限公司/临时机构' },
//     { label: '附件', value: '无' },
//   ],
//   [
//     {
//       label: '资质类型',
//       value: '许可人',
//       color: '#1890FF',
//       borderColor: '#91d5ff',
//       backColor: '#e6f7ff',
//     },
//     { label: '生效日期', value: '2024-01-01' },
//     { label: '失效日期', value: '2025-01-01' },
//     { label: '颁发单位', value: '广东电网有限公司' },
//     { label: '适用单位', value: '广东电网有限公司/临时机构' },
//     { label: '附件', value: '无' },
//   ],
//   [
//     {
//       label: '资质类型',
//       value: '签发人',
//       color: '#722ED1',
//       borderColor: '#d3adf7',
//       backColor: '#f9f0ff',
//     },
//     { label: '生效日期', value: '2024-01-01' },
//     { label: '失效日期', value: '2025-01-01' },
//     { label: '颁发单位', value: '广东电网有限公司' },
//     { label: '适用单位', value: '广东电网有限公司/临时机构' },
//     { label: '附件', value: '无' },
//   ],
//   // {
//   //   type: {
//   //     label: '资质类型',
//   //     value: '安规',
//   //     color: '#F5317F',
//   //     borderColor: '#ffadd2',
//   //     backColor: '#fff0f6',
//   //   },
//   //   effectiveDate: { label: '生效日期', value: '2024-01-01' },
//   //   expirationDate: { label: '失效日期', value: '广东电网有限公司' },
//   //   applicableUnit: { label: '适用单位', value: '广东电网有限公司/临时机构' },
//   //   attachments: { label: '附件', value: '无' },
//   // },
// ]);
// const expirationList = ref([
//   [
//     {
//       label: '资质类型',
//       value: '安规',
//       color: '#000000a5',
//       borderColor: '#d9d9d9',
//       backColor: '#f5f5f5',
//     },
//     { label: '生效日期', value: '2024-01-01' },
//     { label: '失效日期', value: '2025-01-01' },
//     { label: '颁发单位', value: '广东电网有限公司' },
//     { label: '适用单位', value: '广东电网有限公司/临时机构' },
//     { label: '附件', value: '无' },
//   ],
// ]);
</script>

<style scoped lang="less">
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
::v-deep .el-card__body {
  padding: 0;
}
.qualification-item {
  position: relative;
  padding-left: 10px;
  padding-bottom: 10px;

  .info-item {
    margin-top: 20px;
  }

  .info-item:first-of-type {
    margin-top: 30px;
  }
  .corner-label {
    position: absolute;
    top: -35px;
    right: -24px;
    transform: rotate(45deg);
    background-color: #00bc86;
    color: white;
    padding: 20px 20px 4px;
    font-size: 12px;
    white-space: nowrap;
    z-index: 10;
  }
}

.empty {
  height: 200px;
  color: #666;
  justify-content: center;
  background-color: #f4f4f4;
  margin: 20px;
}
</style>
