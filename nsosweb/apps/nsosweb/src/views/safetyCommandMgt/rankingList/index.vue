<script setup lang="ts">
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
  ElCard,
  type FormInstance,
} from 'element-plus';
import { searchRankingData, deleteRankingData, updateRankingData } from '#/api';
import { reactive, ref, onMounted, nextTick, onUnmounted } from 'vue';
import DetailsData from './DetailsData.vue';
const data = reactive({
  attackTable: [],
  PersonalDefendTable: [],
  CompanyDefendTable: [],
  form: {
    pageSize: 100,
    pageNo: 1,
    type: 1,
    name: '',
    company: '',
  },
});

onMounted(() => {
  getData();
});

onUnmounted(() => {
  stopAllAutoScroll();
});

// 获取榜单数据
async function getData() {
  try {
    data.form.type = 1;
    const res = await searchRankingData(data.form);
    // const res = { list: [] };
    // const res1 = { list: [] };
    // const res2 = { list: [] };
    // for (let i = 0; i < 11; i++) {
    //   res.list.push({
    //     name: '张三',
    //     company: '移动',
    //     score: i,
    //   });
    // }
    // for (let i = 0; i < 11; i++) {
    //   res1.list.push({
    //     name: '张三',
    //     company: '移动',
    //     score: i,
    //   });
    //   res2.list.push({
    //     name: '张三',
    //     company: '移动',
    //     score: i,
    //   });
    // }
    data.attackTable = res.list.map((item, index) => ({
      ...item,
      ranking: index + 1,
    }));
    data.form.type = 2;
    const res1 = await searchRankingData(data.form);
    data.CompanyDefendTable = res1.list.map((item, index) => ({
      ...item,
      ranking: index + 1,
    }));

    data.form.type = 3;
    const res2 = await searchRankingData(data.form);
    data.PersonalDefendTable = res2.list.map((item, index) => ({
      ...item,
      ranking: index + 1,
    }));
    nextTick(() => {
      startAllAutoScroll();
      // stopAllAutoScroll()
    });
  } catch (error) {
    console.error('请求失败:', error);
  }
}

/**
 * 实现自动滚动
 */
const mainRef1 = ref(null);
const mainRef2 = ref(null);
const mainRef3 = ref(null);

// 为每个表格维护独立的滚动状态
const scrollStates = {
  attackTable: { isAutoScrolling: true, animationId: null },
  CompanyDefendTable: { isAutoScrolling: true, animationId: null },
  PersonalDefendTable: { isAutoScrolling: true, animationId: null },
};

// 停止特定表格的滚动
// const stopAutoScroll = (tableKey) => {
//   if (scrollStates[tableKey]) {
//     scrollStates[tableKey].isAutoScrolling = false;
//     if (scrollStates[tableKey].animationId) {
//       cancelAnimationFrame(scrollStates[tableKey].animationId);
//       scrollStates[tableKey].animationId = null;
//     }
//   }
// };

const stopAutoScroll = (tableKey) => {
  if (scrollStates[tableKey]) {
    clearTimeout(scrollStates[tableKey].animationId); // 改用clearTimeout
    scrollStates[tableKey].animationId = null;
  }
};

// 自动滚动函数 - 修改为滚动到底部后回到顶部
// const autoScroll = (mainRef, tableKey) => {
//   if (!scrollStates[tableKey]?.isAutoScrolling || !mainRef.value) return;

//   const mainEl = mainRef.value;
//   const scrollSpeed = 0.25; // 滚动速度

//   const contentHeight = mainEl.scrollHeight; // 实际内容高度
//   const viewportHeight = mainEl.clientHeight; // 可视区域高度

//   if (mainEl.scrollHeight < contentHeight + viewportHeight) {
//     mainEl.style.paddingBottom = `${viewportHeight}px`; // 添加底部空白
//   }

//   // 累积小数部分
//   if (!scrollStates[tableKey].scrollAccumulator) {
//     scrollStates[tableKey].scrollAccumulator = 0;
//   }
//   scrollStates[tableKey].scrollAccumulator += scrollSpeed;

//   // 如果累积足够，调整 scrollTop
//   if (scrollStates[tableKey].scrollAccumulator >= 1) {
//     const scrollAmount = Math.floor(scrollStates[tableKey].scrollAccumulator);
//     mainEl.scrollTop += scrollAmount;
//     scrollStates[tableKey].scrollAccumulator -= scrollAmount;
//   }

//   // 检查是否滚动到底部
//   // if (mainEl.scrollTop >= mainEl.scrollHeight - mainEl.clientHeight) {
//   //   // 回到顶部
//   //   mainEl.scrollTop = 0;
//   // }
//   // 如果滚动到空白区域（超过实际内容高度），则回到顶部
//   if (mainEl.scrollTop >= mainEl.scrollHeight - mainEl.clientHeight) {
//     mainEl.scrollTop = 0; // 无缝跳回顶部
//   }

//   scrollStates[tableKey].animationId = requestAnimationFrame(() => autoScroll(mainRef, tableKey));
// };

const autoScroll = (mainRef, tableKey) => {
  if (!scrollStates[tableKey]?.isAutoScrolling || !mainRef.value) return;

  const mainEl = mainRef.value;
  const scrollSpeed = 1; // 改为固定像素值（老版本兼容）

  const contentHeight = mainEl.scrollHeight; // 实际内容高度
  const viewportHeight = mainEl.clientHeight; // 可视区域高度

  if (mainEl.scrollHeight < contentHeight + viewportHeight) {
    mainEl.style.paddingBottom = `${viewportHeight}px`; // 添加底部空白
  }

  // 老版本浏览器使用更简单的滚动逻辑
  mainEl.scrollTop += scrollSpeed;

  // 检查是否滚动到底部
  if (mainEl.scrollTop >= mainEl.scrollHeight - mainEl.clientHeight) {
    mainEl.scrollTop = 0; // 回到顶部
  }

  // 使用setTimeout替代requestAnimationFrame
  scrollStates[tableKey].animationId = setTimeout(
    () => autoScroll(mainRef, tableKey),
    100,
  );
};

// 启动特定表格的滚动
const startAutoScroll = (tableKey) => {
  if (!scrollStates[tableKey]) return;

  scrollStates[tableKey].isAutoScrolling = true;

  if (tableKey === 'attackTable' && data.attackTable.length > 10) {
    autoScroll(mainRef1, 'attackTable');
  } else if (
    tableKey === 'CompanyDefendTable' &&
    data.CompanyDefendTable.length > 10
  ) {
    autoScroll(mainRef2, 'CompanyDefendTable');
  } else if (
    tableKey === 'PersonalDefendTable' &&
    data.PersonalDefendTable.length > 10
  ) {
    autoScroll(mainRef3, 'PersonalDefendTable');
  }
};

// 启动所有表格的滚动
const startAllAutoScroll = () => {
  if (data.attackTable.length > 10) {
    startAutoScroll('attackTable');
  }
  if (data.CompanyDefendTable.length > 10) {
    startAutoScroll('CompanyDefendTable');
  }
  if (data.PersonalDefendTable.length > 10) {
    startAutoScroll('PersonalDefendTable');
  }
};

// 停止所有表格的滚动
const stopAllAutoScroll = () => {
  stopAutoScroll('attackTable');
  stopAutoScroll('CompanyDefendTable');
  stopAutoScroll('PersonalDefendTable');
};

/**
 * 得分详情弹窗
 */
const detailsDialogVisible = ref(false);
const childDialog1 = ref();
const rankingType = ref('1');
function openDetailsDialog(item: any, type: string) {
  detailsDialogVisible.value = true;
  rankingType.value = type;
  nextTick(() => {
    childDialog1.value.getOriginData(item);
  });
}

/**
 * 榜单切换
 */

// 新增响应式数据
const currentTableIndex = ref(0);
const tableNames = ref([
  'attackTable',
  'CompanyDefendTable',
  'PersonalDefendTable',
]);
const tableTitles = ref([
  '攻击贡献榜',
  '防守贡献榜(管制单位)',
  '防守贡献榜(非管制单位)',
]);
// 切换榜单函数
function switchTable(direction) {
  stopAllAutoScroll();
  if (direction === 'prev') {
    currentTableIndex.value =
      (currentTableIndex.value - 1 + tableNames.value.length) %
      tableNames.value.length;
  } else {
    currentTableIndex.value =
      (currentTableIndex.value + 1) % tableNames.value.length;
  }
  nextTick(() => {
    startAllAutoScroll();
  });
}
</script>
<template>
  <div class="main flex flex-col">
    <div class="header">
      <div class="header-title"></div>
    </div>
    <div class="content">
      <div class="content-column" v-if="currentTableIndex === 0">
        <div
          class="left-img"
          @click="switchTable('prev')"
          v-if="currentTableIndex !== 0"
        ></div>
        <div
          class="right-img"
          @click="switchTable('next')"
          v-if="currentTableIndex !== 2"
        ></div>
        <div class="item-title">攻击贡献榜</div>
        <div class="item-box">
          <div class="item-littleTitle">
            <div>排名</div>
            <div>人员</div>
            <div>得分</div>
          </div>
          <div
            class="clean-main"
            ref="mainRef1"
            @mouseenter="stopAutoScroll('attackTable')"
            @mouseleave="startAutoScroll('attackTable')"
          >
            <div
              class="item-content"
              v-for="(item, index) in data.attackTable"
              :key="index"
            >
              <div>
                <div class="item-rank" :data-ranking="item.ranking">
                  {{ item.ranking }}
                </div>
              </div>
              <div>
                {{ item.name
                }}<span style="font-weight: 500">({{ item.company }})</span>
              </div>
              <div
                class="underlined-text"
                @click="openDetailsDialog(item, '1')"
              >
                {{ Math.floor(item.score) }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="content-column" v-if="currentTableIndex === 1">
        <div
          class="left-img"
          @click="switchTable('prev')"
          v-if="currentTableIndex !== 0"
        ></div>
        <div
          class="right-img"
          @click="switchTable('next')"
          v-if="currentTableIndex !== 2"
        ></div>
        <div class="item-title">
          <span>防守贡献榜</span>
          <br />
          <span style="font-size: 20px">(管制单位)</span>
        </div>
        <div class="item-box">
          <div class="item-littleTitle">
            <div>排名</div>
            <div>单位</div>
            <div>得分</div>
          </div>
          <div
            class="clean-main"
            ref="mainRef2"
            @mouseenter="stopAutoScroll('CompanyDefendTable')"
            @mouseleave="startAutoScroll('CompanyDefendTable')"
          >
            <div
              class="item-content"
              v-for="(item, index) in data.CompanyDefendTable"
              :key="index"
            >
              <div>
                <div class="item-rank" :data-ranking="item.ranking">
                  {{ item.ranking }}
                </div>
              </div>
              <div>{{ item.company }}</div>
              <div
                class="underlined-text"
                @click="openDetailsDialog(item, '2')"
              >
                {{ Math.floor(item.score) }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="content-column" v-if="currentTableIndex === 2">
        <div
          class="left-img"
          @click="switchTable('prev')"
          v-if="currentTableIndex !== 0"
        ></div>
        <div
          class="right-img"
          @click="switchTable('next')"
          v-if="currentTableIndex !== 2"
        ></div>
        <div class="item-title">
          <span>防守贡献榜</span>
          <br />
          <span style="font-size: 20px">(非管制单位)</span>
        </div>
        <div class="item-box">
          <div class="item-littleTitle">
            <div>排名</div>
            <div>单位</div>
            <div>得分</div>
          </div>
          <div
            class="clean-main"
            ref="mainRef3"
            @mouseenter="stopAutoScroll('PersonalDefendTable')"
            @mouseleave="startAutoScroll('PersonalDefendTable')"
          >
            <div
              class="item-content"
              v-for="(item, index) in data.PersonalDefendTable"
              :key="index"
            >
              <div>
                <div class="item-rank" :data-ranking="item.ranking">
                  {{ item.ranking }}
                </div>
              </div>
              <div>
                {{ item.company }}
                <!-- <span style="font-weight: 500;">({{ item.company }})</span> -->
              </div>
              <div
                class="underlined-text"
                @click="openDetailsDialog(item, '3')"
              >
                {{ Math.floor(item.score) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      v-model="detailsDialogVisible"
      title="得分详情"
      width="1350"
      top="20px"
      class="system-detail-dialog"
    >
      <DetailsData ref="childDialog1" :type="rankingType"></DetailsData>
    </el-dialog>
  </div>
</template>
<style lang="less" scoped>
.underlined-text {
  text-decoration: underline;
  cursor: pointer;
  /* 可选：悬停效果 */
  &:hover {
    color: #3dacff; /* 悬停时变蓝色 */
  }
}
:deep(.el-pagination button) {
  border: 1px solid #efefef;
  color: #2074c9;
  // box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.clean-main {
  overflow-y: scroll;
  height: 700px;
  margin-top: 15px;
  scrollbar-width: none; /* Firefox隐藏滚动条 */
  -ms-overflow-style: none; /* IE和Edge隐藏滚动条 */
  overflow: -moz-scrollbars-none; /* Firefox老版本 */
  /* Chrome和Safari隐藏滚动条 */
  &::-webkit-scrollbar {
    display: none;
  }
}
.main {
  width: 100%;
  height: 100vh;
  background: url('../../../assets/images/rankingList/bg.png') no-repeat;
  background-size: 100% 100%;
  .header {
    height: 200px;
    width: 100%;
    display: flex;
    justify-content: center; // 水平居中
    .header-title {
      margin-top: 7px;
      width: 385px;
      height: 168px;
      background: url('../../../assets/images/rankingList/title.png') no-repeat;
      background-size: cover;
    }
  }
  .content {
    display: flex;
    // justify-content: space-around; // 均匀分布三列
    justify-content: center;
    // margin: 1px 98px;
    // gap: 40px; // 列之间的间距
    // flex-wrap: wrap;
    .content-column {
      // flex: 1; // 每列等宽
      width: 560px;
      // min-width: 500px;
      // max-width: 700px;
      // min-width: 0; // 防止内容溢出
      // min-height: 850px; // 设置最小高度
      background: url('../../../assets/images/rankingList/bg-ranking.png')
        no-repeat;
      background-size: 100% 100%;
      position: relative;
      .item-title {
        text-align: center;
        margin-top: 44px;
        font-size: 25px;
        display: block;
        color: #9d3430;
        font-weight: 800;
        height: 40px;
      }
      .item-box {
        margin: 45px 45px 0px 45px;
        .item-littleTitle {
          font-size: 20px;
          font-weight: 750;
          color: #872c29;
          display: flex;
          div {
            &:nth-child(1) {
              flex: 1; // 第一列占1份
              text-align: center;
            }
            &:nth-child(2) {
              flex: 3; // 第二列占2份
              text-align: center;
            }
            &:nth-child(3) {
              flex: 1; // 第三列占1份
              text-align: center;
            }
          }
        }
        .item-content {
          min-height: 40px;
          line-height: 1.1; // 改为相对行高，适应多行文本
          margin-bottom: 13px;
          background-color: #f8e5ad;
          font-size: 20px;
          font-weight: 750;
          color: #872c29;
          display: flex;
          flex-wrap: wrap; // 允许flex项目换行
          align-items: center; // 垂直居中
          // padding: px 0; // 添加上下内边距
          //   justify-content: space-between; // 三列均匀分布
          div {
            &:nth-child(1) {
              flex: 1; // 第一列占1份
              text-align: center;
              z-index: 1000;
              padding-top: 10px;
              // display: flex;
              // align-items: center; // 垂直居中
              // justify-content: center;
              position: relative;
            }
            &:nth-child(2) {
              flex: 3; // 第二列占2份
              text-align: center;
            }
            &:nth-child(3) {
              flex: 1; // 第三列占1份
              text-align: center;
              font-size: 20px;
              font-weight: 750;
            }
          }
          .item-rank {
            position: absolute;
            top: 0px;
            left: 50%; // 先移动到父元素50%位置
            transform: translateX(-50%); // 再向左移动自身宽度的一半
            height: 42px;
            width: 30px;
            &[data-ranking='1'] {
              color: white;
              background: url('../../../assets/images/rankingList/bg-first.png')
                no-repeat;
              background-size: 100% 100%;
            }
            &[data-ranking='2'] {
              color: white;
              background: url('../../../assets/images/rankingList/bg-second.png')
                no-repeat;
              background-size: 100% 100%;
            }
            &[data-ranking='3'] {
              color: white;
              background: url('../../../assets/images/rankingList/bg-third.png')
                no-repeat;
              background-size: 100% 100%;
            }
          }
          //   .item-rank {
          //     &[data-ranking='1'],
          //     &[data-ranking='2'],
          //     &[data-ranking='3'] {
          //       color: white;
          //     }
          //   }
        }
      }
      .left-img {
        position: absolute;
        width: 50px;
        height: 40px;
        top: 35px;
        left: 10px;
        background: url('../../../assets/images/rankingList/bg-left.png')
          no-repeat;
        background-size: 100% 100%;
      }
      .right-img {
        position: absolute;
        width: 50px;
        height: 40px;
        top: 35px;
        right: 10px;
        background: url('../../../assets/images/rankingList/bg-right.png')
          no-repeat;
        background-size: 100% 100%;
      }
    }
  }
}
</style>
