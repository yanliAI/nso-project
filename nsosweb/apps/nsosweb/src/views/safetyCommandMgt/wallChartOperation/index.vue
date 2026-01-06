<template>
  <div class="flex" style="width: 100%; height: 100%; flex-direction: column">
    <DrawingBoard
      v-if="imageWidth > 0"
      class="drawing-board"
      :width="imageWidth"
      :height="imageHeight"
      @onExit="handleExitDrawingBoard"
    />
    <div
      ref="pageCon"
      style="width: 100%; height: 100%"
      v-loading="loading"
      element-loading-text="Loading..."
      element-loading-background="rgba(122, 122, 122, 0.8)"
    >
      <div ref="formConRef" class="header" v-if="svgContent">
        <div class="topo-name-con">{{ topoName }}</div>
        <el-image
          ref="headerImg"
          class="background-image"
          src="/images/gtzz/bg-zzt.png"
        />
        <div class="legend-con flex">
          <div>
            <div class="flex items-center">
              <div class="dot"></div>
              <span>告警数量</span>
            </div>
            <div class="mt-2 flex items-center">
              <div class="dot" style="background-color: #ffd666"></div>
              <span>隐患数量</span>
            </div>
            <div class="mt-2 flex items-center">
              <div class="solid-red-arrow"></div>
              <span>攻击路径</span>
            </div>
            <div class="mt-2 flex items-center">
              <div class="dashed-gray-arrow"></div>
              <span>推演攻击路径</span>
            </div>
          </div>
          <!-- <div class="ml-4">
            <div class="flex items-center">
              <div class="solid-red-arrow"></div>
              <span>攻击路径</span>
            </div>
            <div class="mt-2 flex items-center">
              <div class="dashed-gray-arrow"></div>
              <span>推演攻击路径</span>
            </div>
          </div> -->
        </div>
        <div class="btn-con flex items-center">
          <!-- <el-button link @click="makePic" style="color: #eee"
            ><el-icon style="width: 1em; height: 1em; margin-right: 6px"
              ><Edit /></el-icon
            >作图</el-button
          > -->
          <el-button
            link
            @click="zuoZhanZH"
            style="color: #eee"
            v-if="imageWidth <= 0"
            ><el-icon style="width: 1em; height: 1em; margin-right: 6px"
              ><EditPen /></el-icon
            >作战指挥</el-button
          >
          <el-button
            link
            @click="loadTopoPic('-1')"
            style="color: #eee"
            v-if="!isZBTopoPic && zbTopoId"
            >网级布防图</el-button
          >
        </div>
      </div>

      <div
        ref="mainCon"
        class="mainCon"
        :style="{
          height: `calc(100% - ${formHeight}px)`,
        }"
      >
        <div ref="wheelConRef" @wheel="wheel" class="wheel-con">
          <div id="svg" ref="svgCon" style="height: 100%"></div>
        </div>
        <div v-if="!svgContent" class="my-empty-con">
          <el-empty :description="emptyDesc" :image-size="100" />
        </div>

        <div
          v-if="alertTotalData.num >= 0"
          class="flex"
          :style="{
            position: 'absolute',
            width: `${alertTotalData.width}px`,
            height: `${alertTotalData.height}px`,
            left: `${alertTotalData.x}px`,
            top: `${alertTotalData.y}px`,
            paddingTop: '1.5rem',
            color: 'white',
            fontSize: '10px',
            justifyContent: 'center',
            alignItems: 'baseline',
            '--scale-factor': currentScale, // 动态绑定 CSS 变量
          }"
        >
          <span class="gjzs-con">{{ alertTotalData.num }}</span> 条
        </div>
        <!-- 漏洞角标 动态标签（HTML 绝对定位层） -->
        <div
          v-for="(item, index) in louDongBadgeData"
          :key="index"
          class="dynamic-label"
          :style="{
            left: `${item.labelPosition.x}px`,
            top: `${item.labelPosition.y}px`,
            '--scale-factor': currentScale, // 动态绑定 CSS 变量
          }"
          @click="loudongDetail(item)"
        >
          <div
            class="label-bg"
            style="background-color: #ffd666; color: #1a1a1a"
          >
            <span class="label-text">{{ item.labelText }}</span>
          </div>
        </div>
        <!-- 动态标签（HTML 绝对定位层） -->
        <div
          v-for="(item, index) in badgeData"
          :key="index"
          class="dynamic-label"
          :style="{
            left: `${item.labelPosition.x}px`,
            top: `${item.labelPosition.y}px`,
            '--scale-factor': currentScale, // 动态绑定 CSS 变量
          }"
          :ref="(el) => (badgeRefs[index] = el)"
          @click="warningDetail(item)"
          @mouseenter="
            (event) =>
              handleMouseEnterBadge(
                event,
                item.criticalSeverityCount,
                item.highSeverityCount,
                item.mediumSeverityCount,
              )
          "
        >
          <div class="label-bg">
            <span class="label-text">{{ item.labelText }}</span>
          </div>
        </div>

        <el-popover
          popper-class="wall-chart-popover"
          v-for="(item, index) in badgeData"
          :key="'popover-' + index"
          :virtual-ref="badgeRefs[index]"
          width="fitContent"
          trigger="hover"
          virtual-triggering
        >
          <div class="tooltip">
            <div
              v-if="tooltip.criticalSeverityCount >= 0"
              style="color: #ea0303"
            >
              危急个数：{{ tooltip.criticalSeverityCount }}
            </div>
            <div
              v-if="tooltip.highSeverityCount >= 0"
              style="color: #ff5c5c; margin-top: 10px"
            >
              高危个数：{{ tooltip.highSeverityCount }}
            </div>
            <div
              v-if="tooltip.mediumSeverityCount >= 0"
              style="color: #ff9a5c; margin-top: 10px"
            >
              中危个数：{{ tooltip.mediumSeverityCount }}
            </div>
          </div>
        </el-popover>

        <!-- 左上角数据 -->
        <div
          v-if="leftTopData.visible"
          :style="{
            width: `${leftTopData.width}px`,
            height: `${leftTopData.height}px`,
            left: `${leftTopData.position.x}px`,
            top: `${leftTopData.position.y}px`,
            transform: `scaleX(${leftTopData.scaleX}) scaleY(${leftTopData.scaleY})`,
            transformOrigin: 'left top',
          }"
          class="left-top"
        >
          <!-- <div class="flex" style="margin-bottom: 15px">
          <el-input
            v-model="queryData"
            class="query"
            type="text"
            placeholder="请输入查询内容"
          />
          <el-image
            src="/images/gtzz/icon-search.png"
            style="width: 40px; height: 40px"
          />
        </div> -->

          <div class="flex flex-col items-center">
            <div class="ysgj flex">
              <span class="item-title">原始告警</span>
              <div class="item-data">
                <span class="data-title">告警总数：</span>
                {{ leftTopData.originalAlertCount }}
              </div>
            </div>
            <el-image :src="imgRow" style="height: 24px; margin-top: 2px" />
            <div class="gjqx">
              <div class="flex items-center">
                <span class="item-title">告警清洗</span>
                <div class="item-data">
                  <span class="data-title">清洗率：</span>
                  {{ leftTopData.cleaningRate }}
                </div>
              </div>
              <div class="mt-2 flex items-center">
                <div class="item-data flex-1">
                  <span class="data-title">自动清洗数：</span>
                  {{ leftTopData.filteredCount }}
                </div>
                <div class="item-data ml-8">
                  <span class="data-title">剩余告警数：</span>
                  {{ leftTopData.filteredAlertCount }}
                </div>
              </div>
            </div>
            <el-image :src="imgRow" style="height: 24px; margin-top: 2px" />
            <div class="zdfd">
              <div class="flex items-center">
                <span class="item-title">自动封堵</span>
                <div class="item-data">
                  <span class="data-title">封堵率：</span>
                  {{ leftTopData.blockingRate }}
                </div>
              </div>

              <div class="mt-2 flex items-center">
                <div class="item-data flex-1">
                  <span class="data-title">自动封堵数：</span>
                  {{ leftTopData.blacklistCount }}
                </div>
                <div class="item-data ml-8">
                  <span class="data-title">剩余告警数：</span>
                  {{ leftTopData.blacklistFilteredCount }}
                </div>
              </div>
            </div>
            <el-image :src="imgRow" style="height: 24px; margin-top: 2px" />
            <div class="sgyp">
              <div class="flex items-center">
                <span
                  class="item-title"
                  @click="sgypDialogData.visible = true"
                  style="cursor: pointer"
                  >手工研判</span
                >
                <!-- <div class="item-data">
                  <span class="data-title">研判率：</span>
                  {{ leftTopData.reviewRate }}
                </div> -->
                <div class="item-data">
                  <span class="data-title">总数：</span>
                  {{ leftTopData.blacklistFilteredCount }}
                </div>
              </div>
              <div class="mt-2 flex items-center">
                <!-- <div class="item-data">
                  <span class="data-title">总数：</span>
                  {{ leftTopData.blacklistFilteredCount }}
                </div> -->
                <div class="item-data flex-1">
                  <span class="data-title">已研判数：</span>
                  {{ leftTopData.manualReviewedCount }}
                </div>
                <div class="item-data">
                  <span class="data-title">待研判数：</span>
                  {{ leftTopData.unReviewedCount }}
                </div>
              </div>
              <div class="flex">
                <div class="dash-line-v" style="margin-left: 20px"></div>
                <div class="dash-line-h" style="margin-top: 41px"></div>
                <div
                  class="dash-line-v"
                  style="margin-top: 25px; height: 32px"
                ></div>
                <div>
                  <div class="dash-line-h" style="margin-top: 22px"></div>
                  <div class="dash-line-h" style="margin-top: 35px"></div>
                </div>
                <!-- <svg width="60" height="70" viewBox="0 0 60 70">
                  <path
                    d="M20 0 L20 41"
                    stroke="white"
                    stroke-dasharray="5,3"
                    stroke-width="1"
                  />
                  <path
                    d="M20 41 L40 41"
                    stroke="white"
                    stroke-dasharray="5,3"
                    stroke-width="1"
                  />
                  <path
                    d="M40 20 L40 65"
                    stroke="white"
                    stroke-dasharray="5,3"
                    stroke-width="1"
                  />
                  <path
                    d="M40 20 L60 20"
                    stroke="white"
                    stroke-dasharray="5,3"
                    stroke-width="1"
                  />
                  <path
                    d="M40 65 L60 65"
                    stroke="white"
                    stroke-dasharray="5,3"
                    stroke-width="1"
                  />
                </svg> -->
                <div style="width: 100%">
                  <div
                    class="cz-num-con flex items-center"
                    @click.stop="gjjdDialogData.visible = true"
                  >
                    <div>下令处置</div>
                    <div class="item-data ml-2 flex items-center">
                      <div
                        class="data-title"
                        style="text-align: center; margin: 6px 0"
                      >
                        总数：
                      </div>
                      <div style="text-align: center">
                        {{ leftTopData.researchedOrderedCount }}
                      </div>
                    </div>
                    <div class="item-data ml-2 flex items-center">
                      <div
                        class="data-title"
                        style="text-align: center; margin: 6px 0"
                      >
                        占比：
                      </div>
                      <div style="text-align: center">
                        {{ leftTopData.handlingRate1 }}
                      </div>
                    </div>
                  </div>

                  <div class="cz-num-con2 flex items-center">
                    <div>无需处置</div>
                    <div class="item-data ml-2 flex items-center">
                      <div
                        class="data-title"
                        style="text-align: center; margin: 6px 0"
                      >
                        总数：
                      </div>
                      <div style="text-align: center">
                        {{ leftTopData.researchedNoOrderCount }}
                      </div>
                    </div>
                    <div class="item-data ml-2 flex items-center">
                      <div
                        class="data-title"
                        style="text-align: center; margin: 6px 0"
                      >
                        占比：
                      </div>
                      <div style="text-align: center">
                        {{ leftTopData.handlingRate2 }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- <el-image :src="imgRow" style="height: 24px; margin-top: 2px" />

            <div class="handle-con flex">
              <div class="flex-1">
                <div class="handle-item">
                  <div class="item-title" style="text-align: center">
                    已研判(已下令)
                  </div>
                  <div class="flex">
                    <div class="item-data flex flex-1 items-center">
                      <div
                        class="data-title"
                        style="text-align: center; margin: 8px 0"
                      >
                        总数：
                      </div>
                      <div
                        class="xlcz-num"
                        style="text-align: center"
                        @click="gjjdDialogData.visible = true"
                      >
                        {{ leftTopData.researchedOrderedCount }}
                      </div>
                    </div>
                    <div class="item-data flex items-center" style="flex: 1.2">
                      <div
                        class="data-title"
                        style="text-align: center; margin: 8px 0"
                      >
                        占比：
                      </div>
                      <div style="text-align: center">
                        {{ leftTopData.handlingRate1 }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex-1">
                <div class="handle-item">
                  <div class="item-title" style="text-align: center">
                    已研判(无需下令)
                  </div>
                  <div class="flex">
                    <div class="item-data flex flex-1 items-center">
                      <div
                        class="data-title"
                        style="text-align: center; margin: 8px 0"
                      >
                        总数：
                      </div>
                      <div style="text-align: center">
                        {{ leftTopData.researchedNoOrderCount }}
                      </div>
                    </div>
                    <div class="item-data flex items-center" style="flex: 1.2">
                      <div
                        class="data-title"
                        style="text-align: center; margin: 8px 0"
                      >
                        占比：
                      </div>
                      <div style="text-align: center">
                        {{ leftTopData.handlingRate2 }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> -->

            <!-- <el-image :src="imgRow" style="height: 24px; margin-top: 2px" />

            <div class="fkbh flex">
              <span class="item-title">反馈闭环</span>
              <div class="item-data">
                <span class="data-title">闭环总数：</span>
                {{ leftTopData.feedbackClosedCount }}
              </div>
              <div class="item-data">
                <span class="data-title">闭环率：</span>
                {{ leftTopData.closureRate }}
              </div>
            </div> -->
          </div>
        </div>
      </div>
    </div>

    <!-- 告警列表弹框 -->
    <el-dialog
      v-model="dialogData.visible"
      title="告警概况"
      width="1200"
      :z-index="1000"
    >
      <!-- <template #header="{ close, titleId, titleClass }">
        <div class="custom-dialog-header">
          <h4 :id="titleId" :class="titleClass">告警概况</h4>
          <div>
            <el-button type="primary" @click="alarmListRef?.handleBatch">
              一键处置
            </el-button>
          </div>
        </div>
      </template> -->
      <AlarmList
        ref="alarmListRef"
        :graphicId="graphicId"
        :topoId="topoId"
        @afterChangeState="queryCount"
        v-if="dialogData.visible"
      ></AlarmList>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogData.visible = false">关闭</el-button>
          <el-button type="primary" @click="alarmListRef?.handleBatch">
            一键处置
          </el-button>
          <el-button type="primary" @click="toggleAggregationState">
            {{ !isAggregation ? '智能聚合' : '还原' }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 漏洞列表弹框 -->
    <el-dialog
      v-model="louDongDialogData.visible"
      title="漏洞概况"
      width="1200"
      :z-index="1000"
    >
      <LouDongList
        ref="alarmListRef"
        :graphicId="graphicId"
        :topoId="topoId"
        @afterChangeState="queryCount"
        v-if="louDongDialogData.visible"
      ></LouDongList>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="louDongDialogData.visible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 手工研判条件筛选弹框 -->
    <el-dialog
      v-model="sgypDialogData.visible"
      title="手工研判条件筛选"
      width="1200"
    >
      <el-form
        ref="queryFormRef"
        :inline="true"
        :model="queryForm"
        label-position="right"
        label-width="auto"
        style="padding: 16px 20px 0"
        class="sgyp-dialog-form"
      >
        <el-row>
          <el-col :span="24">
            <el-input
              v-model="queryForm.advanced"
              placeholder="支持全文检索和复杂检索条件查询;全文检索示例:192.168.2.10、sq1注入;语法简介:1)等于“:”2)不等于“NOT”3)存在“_exists_:字段名称”"
              class="input-with-select"
            >
              <template #prepend>
                <el-select
                  v-model="queryForm.queryType"
                  class="input-prepend-select"
                >
                  <el-option label="高级模式" :value="1" />
                  <el-option label="简单模式" :value="2" />
                </el-select>
                <!-- <el-button type="primary">高级模式</el-button> -->
              </template>

              <template #append>
                <el-button
                  :icon="Search"
                  style="
                    background-color: #409eff;
                    color: white;
                    border-radius: 0 6px 6px 0;
                  "
                  @click="queryCount"
                  >搜索</el-button
                >
              </template>
            </el-input>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 20px">
          <el-col :span="10">
            <el-form-item label="首次告警时间:" prop="firstAlarmTime">
              <el-date-picker
                v-model="queryForm.firstAlarmTime"
                type="datetimerange"
                placeholder="请选择日期"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                start-placeholder="请选择"
                end-placeholder="请选择"
              />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="研判状态:" prop="statusCode">
              <el-select
                v-model="queryForm.statusCode"
                placeholder="请选择"
                filterable
                clearable
              >
                <el-option label="已研判" value="1" />
                <el-option label="未研判" value="0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="危害等级:" prop="diskLevel">
              <el-select
                v-model="queryForm.diskLevel"
                placeholder="请选择"
                multiple
                filterable
                clearable
              >
                <el-option label="危急" value="5" />
                <el-option label="高危" value="4" />
                <el-option label="中危" value="3" />
                <el-option label="低危" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="源IP:" prop="sourceIp">
              <el-input
                v-model="queryForm.sourceIp"
                placeholder="请输入源IP"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="目的IP:" prop="targetIp">
              <el-input
                v-model="queryForm.targetIp"
                placeholder="请输入目的IP"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="告警分类:" prop="alarmGravity">
              <el-select
                v-model="queryForm.alarmGravity"
                placeholder="请选择"
                filterable
                clearable
              >
                <el-option label="一级分类" value="1" />
                <el-option label="二级分类" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="告警名称:" prop="alarmName">
              <el-input
                v-model="queryForm.alarmName"
                placeholder="请输入告警名称"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="攻击结果:" prop="attackResult">
              <el-select
                v-model="queryForm.attackResult"
                placeholder="请选择"
                multiple
                filterable
                clearable
              >
                <el-option label="不涉及" value="0" />
                <el-option label="成功" value="1" />
                <el-option label="企图" value="2" />
                <el-option label="失陷" value="3" />
                <el-option label="拦截" value="4" />
                <el-option label="未知" value="5" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="攻击者地域:" prop="attackerArea">
              <el-select
                v-model="queryForm.attackerArea"
                placeholder="请选择"
                multiple
                filterable
                clearable
              >
                <el-option label="境内" value="中国" />
                <el-option label="境外" value="其他" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <!-- <el-button @click="dialogData.visible = false">取消</el-button> -->
        </div>
      </template>
    </el-dialog>

    <!-- 告警处置进度弹框 -->
    <el-dialog
      v-model="gjjdDialogData.visible"
      title="告警处置进度"
      width="1200"
      :z-index="1000"
    >
      <div class="dialog-con">
        <TaskGJ :showPro="1" v-if="gjjdDialogData.visible"></TaskGJ>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="gjjdDialogData.visible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import {
  computed,
  onMounted,
  ref,
  reactive,
  onBeforeUnmount,
  onUnmounted,
  onActivated,
  onDeactivated,
  nextTick,
  watch,
} from 'vue';
import drawioEmbed from 'drawio-embed';
import LeaderLine from 'leader-line';
import html2canvas from 'html2canvas';
// 引入插件
import Panzoom from '@panzoom/panzoom';
import { Page } from '@vben/common-ui';
import { useRouter } from 'vue-router';
import {
  ElFormItem,
  ElForm,
  ElRow,
  ElCol,
  ElButton,
  ElInput,
  ElSelect,
  ElOption,
  ElDatePicker,
  ElMessage,
  ElDialog,
  ElImage,
  ElEmpty,
} from 'element-plus';
import { Edit, EditPen, Search, Back } from '@element-plus/icons-vue';
import gtzzSvgFile from '#/assets/images/gtzz.svg';
import imgRow from '#/assets/images/gtzz/img-row.png';
import {
  saveElementSystemApi,
  queryAlarmsStatisticsApi,
  getTopoViewFileApi,
  getTopoFileContentApi,
  getDrawioServicePathApi,
  getVulnerabilityStatisticsDataApi,
  getAlertInfoStatisticsCountApi,
  getTopoViewIdApi,
} from '#/api';
// import AlarmList from './alarmList.vue';
import AlarmList from './alarmList.vue';
import LouDongList from './loudongList.vue';
import DrawingBoard from './drawingBoard.vue';
import TaskGJ from '#/views/runDdMgt/workbench/task-gj.vue';

defineOptions({
  name: 'WallChartOperation',
});

let openDrawio = null;
const formConRef = ref();
const mainCon = ref();
const imageUrl = ref('');
const imageData = ref('');
const imageWidth = ref(0);
const imageHeight = ref(0);
const headerImg = ref();
const pageCon = ref();
const loading = ref(false);
const svgCon = ref();
const wheelConRef = ref();
const queryData = ref('');
const formHeight = ref(0);
// 地球图元id
const earthElementId = ref('');
// 当前布防图id
const topoId = ref('');
// 网级布防图id
const zbTopoId = ref('');
// 是否为总部布防图
const isZBTopoPic = ref(false);
const topoName = ref('');
const emptyDesc = ref('');
const handlerClicks = ref({});

const router = useRouter();

const queryForm = reactive({
  advanced: '',
  queryType: 1,
  firstAlarmTime: '',
  statusCode: '',
  diskLevel: '',
  sourceIp: '',
  targetIp: '',
  alarmGravity: '',
  alarmName: '',
  attackResult: '',
  attackerArea: '',
});

// 告警总数相关数据
const alertTotalData = ref({
  width: 0,
  height: 0,
  x: 0,
  y: 0,
  num: -1,
});
const badgeRefs = ref([]);
// 告警角标数据
let badgeData = ref([]);
// 漏洞角标数据
let louDongBadgeData = ref([]);
// 拖拽、缩放对象
const panzoom = ref(null);
// 当前缩放比例
const currentScale = ref(1);
// 告警图元列表
const tipIds = ref([
  {
    id: '86',
    number: 2478,
    type: '',
    criticalSeverityCount: 0,
    highSeverityCount: 0,
    mediumSeverityCount: 0,
  },
  {
    id: '132',
    number: 8,
    type: '',
    criticalSeverityCount: 0,
    highSeverityCount: 0,
    mediumSeverityCount: 0,
  },
  {
    id: '76',
    number: 50,
    type: '',
    criticalSeverityCount: 2,
    highSeverityCount: 5,
    mediumSeverityCount: 3,
  },
  {
    id: '109',
    number: 2345,
    type: '',
    criticalSeverityCount: 1,
    highSeverityCount: 3,
    mediumSeverityCount: 5,
  },
  // { id: '1902', number: '99+' },
]);

// 漏洞图元列表
const louDongTipIds = ref([
  {
    id: '273',
    number: 24,
    type: '',
    criticalSeverityCount: 0,
    highSeverityCount: 0,
    mediumSeverityCount: 0,
  },
]);

const attachLineIds = ref([
  { deviceId: '1546', targetId: '1718' },
  { deviceId: '1544', targetId: '1718' },
  { deviceId: '1548', targetId: '1718' },
]);
const tooltip = ref({
  // 危急数量
  criticalSeverityCount: 0,
  // 高危数量
  highSeverityCount: 0,
  // 中危数量
  mediumSeverityCount: 0,
});
// 可点击图元id列表
const clickableGraphicIdList = ref([]);

let initScaleXLeftTopView = 0.64;
let initScaleYLeftTopView = 0.72;
let initTop = 24;
const leftTopData = ref({
  visible: false,
  width: 322,
  height: 368,
  scaleX: initScaleXLeftTopView,
  scaleY: initScaleYLeftTopView,
  position: { x: 6, y: initTop },
  // 封堵总数
  blacklistCount: 0,
  // 封堵后总数
  blacklistFilteredCount: 0,
  // 自动封堵率
  blockingRate: 0,
  // 告警清洗率
  cleaningRate: 0,
  // 清洗后总数
  filteredAlertCount: 0,
  // 清洗总数
  filteredCount: 0,
  // 已研判（已下令）-处置率
  handlingRate1: 0,
  // 已研判（无需下令）-处置率
  handlingRate2: 0,
  // 手工研判总数
  manualReviewedCount: 0,
  // 原始告警总数
  originalAlertCount: 0,
  // 已研判（无需下令）数
  researchedNoOrderCount: 0,
  // 已研判（已下令）数
  researchedOrderedCount: 0,
  // 研判率
  reviewRate: 0,
  // 待研判总数
  unReviewedCount: 0,
});

const alarmListRef = ref();
const dialogData = reactive({
  visible: false,
});
const louDongDialogData = reactive({
  visible: false,
});

const gjjdDialogData = reactive({
  visible: false,
});

const sgypDialogData = reactive({
  visible: false,
});
const attackLines = ref([]);
const attackLines2 = ref([]);

const svgContent = ref('');
// 点击图元id
const graphicId = ref('');

// 开始作图
const makePic = async () => {
  if (!openDrawio) {
    try {
      let drawioPath = await getDrawioServicePathApi();
      openDrawio = drawioEmbed(drawioPath);
    } catch {
      return;
    }
  }
  openDrawio(svgContent.value).catch(() => {
    console.log('drawio编辑器正在加载...');
    setTimeout(() => {
      makePic();
    }, 1000);
  });
};
// 是否聚合
const isAggregation = ref(false);
/**
 * 修改告警列表聚合状态
 */
const toggleAggregationState = () => {
  isAggregation.value = !isAggregation.value;
  alarmListRef.value?.toggleAggregationState();
};

const zuoZhanZH = async () => {
  imageWidth.value = pageCon.value.clientWidth;
  imageHeight.value = pageCon.value.clientHeight;
  // loading.value = true;
  // try {
  //   const canvas = await html2canvas(pageCon.value, {
  //     scale: 1, // 缩放比例，1为原始大小
  //     logging: false, // 关闭日志
  //     useCORS: true, // 允许跨域图片
  //     allowTaint: true, // 允许污染画布
  //     onclone: (clonedDoc) => {
  //       loading.value = false;
  //       // 在克隆文档中修复样式
  //       const labels = clonedDoc.querySelectorAll('.label-text');
  //       const btnCon = clonedDoc.querySelector('.btn-con');
  //       btnCon?.remove();
  //       labels?.forEach((label) => {
  //         label.style.marginBottom = '8px';
  //       });
  //     },
  //   });
  //   console.log('canvas width ==', canvas.width);
  //   imageWidth.value = canvas.width;
  //   imageHeight.value = canvas.height;
  //   // 获取base64数据
  //   imageData.value = canvas.toDataURL('image/jpeg', 1);
  // } catch (error) {
  //   loading.value = false;
  //   console.error('获取作战图片失败:', error);
  // }
};

const updateBadgeData = () => {
  badgeData.value = [];
  if (!svgCon.value) {
    return;
  }
  // 更新告警总数数据
  let earthData = tipIds.value.find((item) => item.id == earthElementId.value);
  if (earthData) {
    const targetG = svgCon.value.querySelector(
      `g[data-cell-id="${earthData.id}"]`,
    );
    const parentRect = mainCon.value.getBoundingClientRect();
    if (targetG) {
      const gEles = targetG.querySelectorAll('g');
      const rect = gEles[0].getBoundingClientRect();
      alertTotalData.value.width = rect.width;
      alertTotalData.value.height = rect.height;
      alertTotalData.value.x = Number.parseFloat(rect.left - parentRect.left);
      alertTotalData.value.y = Number.parseFloat(rect.top - parentRect.top);
      alertTotalData.value.num = earthData.number;
    }
  }
  // 更新告警角标数据
  badgeData.value = tipIds.value
    .filter((item) => {
      return (
        svgCon.value.querySelector(`g[data-cell-id="${item.id}"]`) &&
        item.id != earthElementId.value
      );
    })
    .map((item) => {
      // 查找指定g标签
      const targetG = svgCon.value.querySelector(
        `g[data-cell-id="${item.id}"]`,
      );
      if (targetG) {
        handlerClicks.value[item.id] = () =>
          warningDetail({ id: item.id, type: item.type });
        targetG.addEventListener('click', handlerClicks.value[item.id]);
        targetG.style.cursor = 'pointer';
      }
      let position = {};
      const parentRect = mainCon.value.getBoundingClientRect();
      const gEles = targetG.querySelectorAll('g');
      const rect = gEles[0].getBoundingClientRect();
      let x = Number.parseFloat(rect.left - parentRect.left) - 8;
      let y = Number.parseFloat(rect.top - parentRect.top) - 4;
      if (gEles.length > 1) {
        x -= 2 * (item.number + '').length;
        // y += 5;
      }
      if (item.id == earthElementId.value) {
        x -= 24;
      }
      const width = Number.parseFloat(rect.width);
      position = {
        x: x + width,
        y: y,
      };
      return {
        showLabel: true,
        // labelText: item.number > 99 ? '99+' : item.number,
        labelText: item.number,
        labelPosition: position,
        id: item.id,
        type: item.type,
        // 危急数量
        criticalSeverityCount: item.criticalSeverityCount,
        // 高危数量
        highSeverityCount: item.highSeverityCount,
        // 中危数量
        mediumSeverityCount: item.mediumSeverityCount,
      };
    });
};

const updateLouDongBadgeData = () => {
  louDongBadgeData.value = [];
  if (!svgCon.value) {
    return;
  }
  louDongBadgeData.value = louDongTipIds.value
    .filter((item) => {
      return svgCon.value.querySelector(`g[data-cell-id="${item.id}"]`);
    })
    .map((item) => {
      // 查找指定g标签
      const targetG = svgCon.value.querySelector(
        `g[data-cell-id="${item.id}"]`,
      );
      let position = {};
      const parentRect = mainCon.value.getBoundingClientRect();
      const gEles = targetG.querySelectorAll('g');
      const rect = gEles[0].getBoundingClientRect();
      let x = Number.parseFloat(rect.left - parentRect.left) - 4;
      let y = Number.parseFloat(rect.top - parentRect.top) - 4;
      if (gEles.length > 1) {
        x -= 4;
        // y += 5;
      }
      const width = Number.parseFloat(rect.width);
      position = {
        x: x,
        y: y,
      };
      return {
        showLabel: true,
        labelText: item.number > 99 ? '99+' : item.number,
        labelPosition: position,
        id: item.id,
        type: item.type,
        // 危急数量
        criticalSeverityCount: item.criticalSeverityCount,
        // 高危数量
        highSeverityCount: item.highSeverityCount,
        // 中危数量
        mediumSeverityCount: item.mediumSeverityCount,
      };
    });
};

/**
 * 给分省图元添加点击事件
 */
const addClickEventToGraphic = () => {
  if (!svgCon.value) {
    return;
  }
  clickableGraphicIdList.value.forEach((element) => {
    // 查找指定g标签
    const targetG = svgCon.value.querySelector(`g[data-cell-id="${element}"]`);
    if (targetG) {
      targetG.addEventListener('click', handleGClick);
      targetG.classList.add('clickable-group');
    }
  });
};

// 点击分省图元
const handleGClick = async (event) => {
  let clickGraphicId = event.currentTarget.getAttribute('data-cell-id');
  if (!clickGraphicId) {
    return;
  }
  loadTopoPic(clickGraphicId);
};

const updateLeftTopData = () => {
  if (!svgCon.value) {
    return;
  }
  // 查找指定g标签
  const targetG = svgCon.value.querySelector(`g[data-cell-id="1920"]`);

  if (targetG) {
    const parentRect = mainCon.value.getBoundingClientRect();
    const rect = targetG.getBoundingClientRect();
    const x = Number.parseFloat(rect.left - parentRect.left);
    const y = Number.parseFloat(rect.top - parentRect.top);
    const width = Number.parseFloat(rect.width);
    const height = Number.parseFloat(rect.height);
    leftTopData.value.position = {
      x: x,
      y: y,
    };
    leftTopData.value.rect = {
      width,
      height,
    };
  }
};

const handleMouseEnterBadge = (
  event,
  criticalSeverityCount,
  highSeverityCount,
  mediumSeverityCount,
) => {
  tooltip.value.criticalSeverityCount = criticalSeverityCount;
  tooltip.value.highSeverityCount = highSeverityCount;
  tooltip.value.mediumSeverityCount = mediumSeverityCount;
};

const lineTargetMap = ref(new WeakMap());

const createAttackLine = (attackerEle, targetEle, option) => {
  // 创建攻击线
  const attackLine = new LeaderLine(attackerEle, targetEle, {
    // color: 'orange',
    size: 3,
    path: option.path, // 流体路径
    // path: 'fluid', // 流体路径
    // startSocket: 'right',
    // endSocket: 'bottom',
    // startPlug: 'behind',
    // endPlug: 'arrow1',
    // startSocketGravity: 1,
    // endSocketGravity: [-1, -2],

    startPlugColor: option.startColor, // 渐变色开始色
    endPlugColor: option.endColor, // 渐变色结束色
    gradient: true, // 使用渐变色
    dash: option.isDash
      ? {
          // 虚线样式
          animation: true, // 让线条滚动起来
        }
      : false,
    dropShadow: { color: 'blue', dx: 0, dy: 0 },
    hide: true,
  });
  return attackLine;
};

const clearAttackLines = () => {
  console.log('移除攻击线');
  attackLines.value.forEach((line) => line.remove());
  attackLines.value = [];

  attackLines2.value.forEach((line) => line.remove());
  attackLines2.value = [];
};

const showHitEffect = (targetEle) => {
  targetEle.classList.add('hit');
  console.log('targetEle.classList==', targetEle.classList);
  setTimeout(() => {
    targetEle.classList.remove('hit');
  }, 500);
};

const showLine = (line, delayTime) => {
  if (!attackLines.value.includes(line) && !attackLines2.value.includes(line)) {
    return;
  }
  line.show('draw', {
    duration: delayTime,
    timing: 'ease-in',
  });

  // 设置消失时间
  setTimeout(() => {
    if (
      !attackLines.value.includes(line) &&
      !attackLines2.value.includes(line)
    ) {
      return;
    }
    line.hide('fade', {
      duration: 800 + Math.random() * 200,
    });
    const targetEle = lineTargetMap.value.get(line);
    // 显示被攻击动画
    // if (targetEle) {
    //   showHitEffect(targetEle);
    // }
    setTimeout(() => {
      showLine(line, delayTime);
    }, 5500);
  }, delayTime);
};

const showAttackLines = () => {
  if (!svgCon.value) {
    return;
  }
  const attackerG = svgCon.value.querySelector(
    `g[data-cell-id="${earthElementId.value}"]`,
  );
  if (!attackerG) {
    return;
  }
  // 清空攻击线
  clearAttackLines();
  lineTargetMap.value = new WeakMap();

  for (let i = 0; i < attachLineIds.value.length; i++) {
    const deviceId = attachLineIds.value[i].deviceId;
    const deviceG = svgCon.value.querySelector(`g[data-cell-id="${deviceId}"]`);
    if (deviceG) {
      const option = {
        path: 'arc',
        startColor: '#ff0000',
        endColor: '#ff0000',
        isDash: false,
      };
      const line = createAttackLine(attackerG, deviceG, option);
      lineTargetMap.value.set(line, deviceG);
      attackLines.value.push(line);

      const targetId = attachLineIds.value[i].targetId;
      if (targetId) {
        const targetG = svgCon.value.querySelector(
          `g[data-cell-id="${targetId}"]`,
        );
        if (targetG) {
          const option2 = {
            path: 'fluid',
            startColor: '#666',
            endColor: '#999',
            isDash: true,
          };
          const line = createAttackLine(deviceG, targetG, option2);
          lineTargetMap.value.set(line, targetG);
          attackLines2.value.push(line);
        }
      }
    }
  }

  attackLines.value.forEach((line) => {
    // 为每条线设置随机延迟
    const delay = Math.random() * 3000;

    setTimeout(() => showLine(line, 2000 + Math.random() * 2400), delay);
  });

  attackLines2.value.forEach((line) => {
    // 为每条线设置随机延迟
    const delay = Math.random() * 3000 + 2000;
    setTimeout(() => showLine(line, 2000 + Math.random() * 2400), delay);
  });
};

const svgTransform = reactive({
  left: 0,
  top: 0,
  scaleX: 1.396,
  scaleY: 1.18,
});

// 拖动方法
const getPanzoomElement = () => {
  // 存放Panzoom用于后面的其他操作
  panzoom.value = Panzoom(wheelConRef.value, {
    // origin: "0 0", // 位置
    // maxScale: 3, // 最大比例,默认值：4
    // minScale: 0, // 最小比例,默认值：0.125
    cursor: 'auto',
    disableZoom: true, // 禁止缩放
    disablePan: true, //禁止平移
    // startScale: 1.5,
    // startX: 240,
    // startY: 50,
    overflow: 'hidden', // 溢出
    canvas: true, // 是否视为canvas
    setTransform: (elem, { scale, x, y }) => {
      // elem.style.transform = `translate(${x}px, ${y}px) scaleX(${scale})`;
      elem.style.transform = `scaleX(${svgTransform.scaleX}) scaleY(${svgTransform.scaleY})`;

      elem.style.transformOrigin = 'left top';
      // elem.style.height = '100%';
      // panzoom.value.setStyle(
      //   'transform',
      //   `scale(${scale}) translate(${x}px, ${y}px)`,
      // );
    },
  });
  // event 事件监听
  const elem = wheelConRef.value;
  elem.addEventListener('panzoomchange', (event) => {
    console.log('panzoomchange', event);
  });
};
// 监听鼠标滚轮
const wheel = (event) => {
  event.preventDefault();
  panzoom.value.zoomWithWheel(event);
  currentScale.value = panzoom.value.getScale();
};
// 告警角标点击
const warningDetail = (item) => {
  // 攻击源告警角标点击不响应
  if (item.type === '0') {
    return;
  }
  isAggregation.value = false;
  graphicId.value = item.id;
  dialogData.visible = true;
};
// 漏洞角标点击
const loudongDetail = (item) => {
  graphicId.value = item.id;
  louDongDialogData.visible = true;
};

/**
 * 查询告警信息
 */
const queryCount = async () => {
  if (loading.value) {
    return;
  }
  loading.value = true;
  getVulnerabilityStatisticsData();
  let params = { topoId: topoId.value };
  if (queryForm.queryType == 1) {
    params.sqlStr = queryForm.advanced;
  } else {
    if (queryForm.firstAlarmTime) {
      params.startTime = queryForm.firstAlarmTime[0];
      params.endTime = queryForm.firstAlarmTime[1];
    }
    if (queryForm.diskLevel) {
      params.severityList = queryForm.diskLevel;
    }
    params.attackerIp = queryForm.sourceIp;
    params.victimIp = queryForm.targetIp;
    // 告警分类
    if (queryForm.alarmGravity) {
      params.alertCatLevel1CdList = queryForm.alarmGravity;
    }
    params.alertName = queryForm.alarmName;
    params.newDisposeStatus = queryForm.statusCode;
    // 攻击结果
    if (queryForm.attackResult) {
      params.attackResultCdList = queryForm.attackResult;
    }
  }
  let result;
  try {
    result = await queryAlarmsStatisticsApi(params);
    loading.value = false;
  } catch {
    loading.value = false;
  }
  getAlertInfoStatisticsCount();
  if (!result) {
    return;
  }
  sgypDialogData.visible = false;
  // if (result.count) {
  //   let count = result.count;
  //   leftTopData.value.blacklistCount = count.blacklistCount;
  //   leftTopData.value.blacklistFilteredCount = count.blacklistFilteredCount;
  //   leftTopData.value.filteredCount = count.filteredCount;
  //   leftTopData.value.filteredAlertCount = count.filteredAlertCount;
  //   leftTopData.value.manualReviewedCount = count.manualReviewedCount;
  //   leftTopData.value.originalAlertCount = count.originalAlertCount;
  //   leftTopData.value.researchedNoOrderCount = count.researchedNoOrderCount;
  //   leftTopData.value.researchedOrderedCount = count.researchedOrderedCount;
  //   leftTopData.value.unReviewedCount = count.unReviewedCount;
  //   leftTopData.value.blockingRate =
  //     (count.blockingRate * 100).toFixed(1) + '%';
  //   leftTopData.value.cleaningRate =
  //     (count.cleaningRate * 100).toFixed(1) + '%';
  //   leftTopData.value.handlingRate1 =
  //     (count.handlingRate1 * 100).toFixed(2) + '%';
  //   leftTopData.value.handlingRate2 =
  //     (count.handlingRate2 * 100).toFixed(2) + '%';
  //   leftTopData.value.reviewRate = (count.reviewRate * 100).toFixed(1) + '%';
  // }

  if (result.records) {
    // 先移除所有旧的监听器
    tipIds.value.forEach((item) => {
      const targetG = svgCon.value.querySelector(
        `g[data-cell-id="${item.id}"]`,
      );
      if (targetG) {
        targetG.removeEventListener('click', handlerClicks.value[item.id]);
        targetG.style.cursor = 'auto';
        delete handlerClicks.value[item.id];
      }
    });
    tipIds.value = [];
    attachLineIds.value = [];

    let records = result.records
      // 过滤告警数量大于0的
      .filter((item) => item.info.alertCount > 0 || item.info.devtype == 0);
    // 或者使用传统for循环
    for (let i = 0; i < records.length; i++) {
      let item = records[i];
      tipIds.value.push({
        id: item.info.elementId,
        number: item.info.alertCount,
        type: item.info.devtype,
        criticalSeverityCount: item.info.criticalSeverityCount,
        highSeverityCount: item.info.highSeverityCount,
        mediumSeverityCount: item.info.mediumSeverityCount,
      });
      // 地球图元
      if (item.info.devtype == 0) {
        earthElementId.value = item.info.elementId;
      }
      if (item.attackPaths) {
        item.attackPaths.forEach((path) => {
          if (path.pathId == path.targetId) {
            attachLineIds.value.push({ deviceId: path.pathId, targetId: '' });
          } else {
            attachLineIds.value.push({
              deviceId: path.pathId,
              targetId: path.targetId,
            });
          }
        });
      }
    }
  }
  if (result.provincialCompanys) {
    clickableGraphicIdList.value = result.provincialCompanys.map(
      (item) => item.id,
    );
    // 分省图元添加点击事件
    addClickEventToGraphic();
  }

  // 更新动态数据
  updateDynamicData();
};

const getVulnerabilityStatisticsData = async () => {
  let result;
  try {
    result = await getVulnerabilityStatisticsDataApi({
      topoId: topoId.value,
    });
  } catch {
    return;
  }
  if (result.vulnerabilityElementVOList) {
    louDongTipIds.value = [];
    let records = result.vulnerabilityElementVOList
      // 过滤漏洞数量大于0的
      .filter((item) => item.vulnerabilityCount > 0);
    for (let i = 0; i < records.length; i++) {
      let item = records[i];
      louDongTipIds.value.push({
        id: item.elementId,
        number: item.vulnerabilityCount,
      });
    }
    updateLouDongBadgeData();
  }
};

// 获取左上角告警数据
const getAlertInfoStatisticsCount = async () => {
  let result;
  try {
    result = await getAlertInfoStatisticsCountApi({
      topoId: topoId.value,
    });
  } catch {
    return;
  }

  if (result) {
    let count = result;
    leftTopData.value.blacklistCount = count.blacklistCount;
    leftTopData.value.blacklistFilteredCount = count.blacklistFilteredCount;
    leftTopData.value.filteredCount = count.filteredCount;
    leftTopData.value.filteredAlertCount = count.filteredAlertCount;
    leftTopData.value.manualReviewedCount = count.manualReviewedCount;
    leftTopData.value.originalAlertCount = count.originalAlertCount;
    leftTopData.value.researchedNoOrderCount = count.researchedNoOrderCount;
    leftTopData.value.researchedOrderedCount = count.researchedOrderedCount;
    leftTopData.value.unReviewedCount = count.unReviewedCount;
    leftTopData.value.blockingRate =
      (count.blockingRate * 100).toFixed(1) + '%';
    leftTopData.value.cleaningRate =
      (count.cleaningRate * 100).toFixed(1) + '%';
    leftTopData.value.handlingRate1 =
      (count.handlingRate1 * 100).toFixed(2) + '%';
    leftTopData.value.handlingRate2 =
      (count.handlingRate2 * 100).toFixed(2) + '%';
    leftTopData.value.reviewRate = (count.reviewRate * 100).toFixed(1) + '%';
  }
};

/**
 * 更新动态数据
 */
const updateDynamicData = () => {
  setTimeout(() => {
    updateBadgeData();
    showAttackLines();
    updateLouDongBadgeData();
  }, 1000);
};

const handleExitDrawingBoard = () => {
  imageData.value = '';
  imageWidth.value = 0;
  imageHeight.value = 0;
};

let queryCountIntervalId: any;
let observer: any;

onActivated(() => {
  // queryCount();
});

onDeactivated(() => {
  // 清空攻击线
  clearAttackLines();
});

/**
 * 判断元素是否可见
 * @param element 页面元素
 */
const checkVisibility = (element) => {
  if (!element) {
    return false;
  }

  const style = window.getComputedStyle(element);
  if (
    style.display === 'none' ||
    style.visibility === 'hidden' ||
    parseFloat(style.opacity) === 0
  ) {
    return false;
  }

  const rect = element.getBoundingClientRect();
  return (
    rect.bottom > 0 &&
    rect.right > 0 &&
    rect.top < window.innerHeight &&
    rect.left < window.innerWidth
  );
};

const caleSvgScale = () => {
  if (!svgContent.value) {
    return;
  }
  let aside = document.querySelector(`aside`);
  let asideWidth = 0;
  let header = document.querySelector(`header`);
  let headerHeight = 0;
  if (aside && checkVisibility(aside)) {
    asideWidth = aside.offsetWidth;
  }
  if (header && checkVisibility(header)) {
    headerHeight = header.offsetHeight;
  }
  const matchWidth = svgContent.value.match(/width="([^"]*)"/);
  const matchHeight = svgContent.value.match(/height="([^"]*)"/);
  if (matchWidth && matchHeight) {
    let widthStr = matchWidth[1]?.replace('px', ''); // "1215px"
    let heightStr = matchHeight[1]?.replace('px', ''); // "615px"
    // 计算缩放比例
    let scaleX = (window.innerWidth - asideWidth) / Number(widthStr);
    let scaleY =
      (window.innerHeight - formHeight.value - headerHeight) /
      Number(heightStr);
    console.log('scaleX==', scaleX, 'scaleY==', scaleY);
    svgTransform.scaleX = scaleX;
    svgTransform.scaleY = scaleY;

    leftTopData.value.scaleX = initScaleXLeftTopView * scaleX;
    leftTopData.value.scaleY = initScaleYLeftTopView * scaleY;
    // if (isZBTopoPic.value) {
    //   initTop = 24;
    // } else {
    //   initTop = 48;
    // }
    leftTopData.value.position.y = Math.floor(initTop * scaleY);
  }
};

/**
 * 加载布防图
 * @param clickGraphicId  分省图元id
 */
const loadTopoPic = async (clickGraphicId: string) => {
  // if (!clickGraphicId) {
  //   return;
  // }
  loading.value = true;
  emptyDesc.value = '加载中...';
  let params = { topoId: topoId.value };
  if (clickGraphicId == '-1') {
    params.topoId = zbTopoId.value;
  }
  if (clickGraphicId && clickGraphicId != '-1') {
    params.id = clickGraphicId;
  }
  // 加载挂图作战图
  try {
    let res = await getTopoViewFileApi(params);
    const { data: responseData, status } = res;
    const { code, data } = responseData;
    if (status >= 200 && status < 400 && (code === 0 || code == 200)) {
      // 缓存布防图id
      topoId.value = data.topoId;
      topoName.value = data.topoName;
      svgContent.value = data.svgFile;
      isZBTopoPic.value = data.isZB;
    } else {
      ElMessage.error(responseData.msg || '布防图不存在');
      loading.value = false;
      emptyDesc.value = '布防图不存在，请联系管理员上传!';
      return;
    }
  } catch {
    ElMessage.error('布防图不存在');
    loading.value = false;
    emptyDesc.value = '布防图不存在，请联系管理员上传!';
    return;
  }
  // 清空攻击路径
  attachLineIds.value = [];
  clearAttackLines();
  // 清空告警数据
  tipIds.value = [];
  updateBadgeData();
  louDongTipIds.value = [];
  updateLouDongBadgeData();

  loading.value = false;
  if (svgCon.value) {
    svgCon.value.innerHTML = svgContent.value;
    if (svgContent.value) {
      leftTopData.value.visible = true;
      fullContent();
    } else {
      leftTopData.value.visible = false;
    }
    caleSvgScale();
  }
  getPanzoomElement();
  if (svgContent.value) {
    queryCount();
  } else {
    ElMessage.warning('布防图不存在，请联系管理员上传!');
    emptyDesc.value = '布防图不存在，请联系管理员上传!';
  }
};
/**
 * 加载本地布防图
 */
const loadWangJiTopo = async () => {
  loading.value = true;
  // 加载本地默认布防图文件
  const response = await fetch(gtzzSvgFile);
  svgContent.value = await response.text();

  loading.value = false;
  if (svgCon.value) {
    svgCon.value.innerHTML = svgContent.value;
    leftTopData.value.visible = true;
    caleSvgScale();
  }
  getPanzoomElement();
};

/**
 * 设置内容全屏 隐藏aside、header
 */
const fullContent = () => {
  // 设置内容全屏
  let aside = document.querySelector(`aside`);
  let header = document.querySelector(`header`);
  if (aside) {
    aside.style.display = 'none';
    // 获取前一个同级元素
    const prevDiv = aside.previousElementSibling;
    // 检查是否是 div 元素
    if (prevDiv && prevDiv.tagName === 'DIV') {
      prevDiv.style.display = 'none';
    }
  }
  if (header) {
    // 获取父元素
    const parent = header.parentElement;
    if (parent) {
      parent.style.display = 'none';
    }
    const mainEle = document.getElementById('__vben_main_content');
    if (mainEle) {
      mainEle.classList.add('no-margin');
    }
  }
};

onMounted(async () => {
  try {
    loading.value = true;
    let result = await getTopoViewIdApi();
    loading.value = false;
    topoId.value = result.topoId;
    isZBTopoPic.value = result.isZB;
    if (result.isZB) {
      // 缓存初始网级布防图id
      zbTopoId.value = result.topoId;
    }
  } catch {
    loading.value = false;
    return;
  }

  await loadTopoPic('');

  // loadWangJiTopo();
  observer = new ResizeObserver((entries) => {
    for (let entry of entries) {
      if (entry.target.className === 'wheel-con') {
        caleSvgScale();
        if (wheelConRef.value) {
          wheelConRef.value.style.transform = `scaleX(${svgTransform.scaleX}) scaleY(${svgTransform.scaleY})`;
        }
        // 更新动态数据
        updateDynamicData();
      } else if (entry.target.className === 'header') {
        formHeight.value = entry.contentRect.height;
      }
    }
  });
  if (wheelConRef.value) {
    observer.observe(wheelConRef.value);
  }
  if (formConRef.value) {
    observer.observe(formConRef.value);
  }
  if (svgContent.value) {
    queryCountIntervalId = setInterval(
      () => {
        queryCount();
      },
      15 * 1000 * 60,
    );
  }
});

onUnmounted(() => {
  // 清空攻击线
  clearAttackLines();
  clearInterval(queryCountIntervalId);
  if (observer) {
    observer.disconnect();
  }
});
// 监听绘制完毕事件
window.addEventListener(
  'drawioImageCreated',
  async ({ imageType, imageContent, xml }) => {
    // if (imageType === 'png') imageUrl.value = imageContent;
    if (imageType === 'svg') {
      svgContent.value = imageContent;
      if (svgCon.value) {
        nextTick(() => {
          svgCon.value.innerHTML = svgContent.value;
        });
      }

      updateDynamicData();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, 'text/xml');
      const allElementsOfSvg = xmlDoc.querySelectorAll('*');
      // 获取图元id和名称的对应关系
      const mapData = [...allElementsOfSvg]
        .filter(
          (item) =>
            item.hasAttribute('name') &&
            item.hasAttribute('type') &&
            item.hasAttribute('id'),
        )
        .map((item) => ({
          id: item.getAttribute('id'),
          devType: item.getAttribute('type'),
          graphElementName: item.getAttribute('name'),
        }));

      // 保存
      const result = await saveElementSystemApi(mapData);
      if (result) {
        ElMessage.success('保存成功');
      }
    }
  },
);

// 监听绘制完毕事件
window.addEventListener('drawioClosed', () => {
  console.log('drawioClosed');
});
</script>

<style scoped lang="less">
:deep(.p-1) {
  padding: 0;
}

.header {
  position: relative;
  z-index: 2;

  .topo-name-con {
    position: absolute;
    top: 24px;
    left: 40px;
    height: 30px;
    min-width: 200px;
    padding: 0 50px;
    line-height: 30px;
    background: url('../../../assets/images/gtzz/bg2.png') center/cover;
    color: white;
    font-style: italic;
    font-weight: 700;
    font-size: 16px;
    text-align: center;
    z-index: 1;
  }

  .background-image {
    position: relative;
    // margin: -6px 0;
    display: unset;
    top: 0;
    left: 0;
    width: 100%;
    pointer-events: none;
    object-fit: cover;
  }

  .btn-con {
    position: absolute;
    top: 24px;
    right: 20px;
  }

  .legend-con {
    position: absolute;
    top: 110%;
    right: 16px;
    color: white;
    font-size: 12px;
    // margin-right: 60px;
    z-index: 2;

    .dot {
      width: 10px;
      height: 10px;
      margin-right: 5px;
      background-color: red;
      border-radius: 100%;
    }

    .solid-red-arrow {
      position: relative;
      width: 20px;
      height: 2px;
      margin-right: 12px;
      background-color: red;
    }
    .solid-red-arrow::after {
      content: '';
      position: absolute;
      right: -3px;
      top: -3px;
      width: 8px;
      height: 8px;
      border-right: 2px solid red;
      border-top: 2px solid red;
      transform: rotate(45deg);
    }

    .dashed-gray-arrow {
      position: relative;
      width: 20px;
      height: 2px;
      margin-right: 12px;
      background: repeating-linear-gradient(
        to right,
        gray 0,
        gray 5px,
        transparent 5px,
        transparent 10px
      );
    }
    .dashed-gray-arrow::after {
      content: '';
      position: absolute;
      right: -3px;
      top: -3px;
      width: 8px;
      height: 8px;
      border-right: 2px solid gray;
      border-top: 2px solid gray;
      transform: rotate(45deg);
    }
  }
}

.mainCon {
  position: relative;

  .my-empty-con {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #bebcbc;
    :deep(.el-empty) {
      height: 100%;
    }
    :deep(.el-empty__description) p {
      font-size: 20px;
      color: #666;
    }
  }
}

.left-top {
  position: absolute;
  padding: 0 4px 10px;
  /* background: #1065d8; */
  color: #fff;
}

.query {
  flex: 1;
  height: 32px;
  padding: 5px;
  background: #001752;
  border-radius: 1rem;
  border: 1px solid #004fb4;
  color: white;
  font-size: 12px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
  :deep(.el-input__wrapper) {
    padding: 0 5px;
    background-color: #001752; /* 背景色 */
    box-shadow: none !important;
    border-radius: 0;
  }

  :deep(.el-input__wrapper.is-focus) {
    background-color: #001752; /* 焦点背景色 */
  }

  :deep(.el-input__inner) {
    color: white;
    &::placeholder {
      color: #ccc;
    }
  }
}

.gjzs-con {
  display: inline-block;
  font-size: 20px;
  font-weight: 600;
  color: #fac990;
  /* 文字渐变色 */
  background: linear-gradient(to bottom, #fac990, #c79156);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.ysgj,
.gjqx,
.zdfd,
.sgyp,
.xlcz,
.handle-item,
.fkbh {
  width: 100%;
  padding: 10px 10px;
  background: url('../../../assets/images/gtzz/bg-item.png') center/cover;
  font-size: 13px;
  border-radius: 2px;
  .item-title {
    flex: 1;
    font-size: 14px;
  }
  .item-data {
    // margin-left: 12px;
    font-size: 12px;
    text-shadow:
      0 1px 0 #000,
      0 2px 0 #000,
      0 4px 3px #000;

    .data-title {
      font-weight: bold;
      color: #90caf8;
    }
  }
}

.gjqx {
  margin-top: -5px;
  width: 97%;
}
.zdfd {
  margin-top: -5px;
  width: 94%;
}
.sgyp {
  margin-top: -5px;
  width: 91%;
  // cursor: pointer;
}
.xlcz {
  margin-top: -5px;
  width: 88%;
}
.fkbh {
  margin-top: -5px;
  width: 85%;
}
.handle-con {
  width: 91%;
  margin-top: -5px;
  gap: 5px;
}
.handle-item {
  margin-right: 0;
  padding: 10px 0 0;

  .xlcz-num {
    cursor: pointer;
  }
}

.dash-line-v {
  width: 1px;
  height: 41px;
  border-left: 1px dashed #72ade9;
}

.dash-line-h {
  width: 15px;
  height: 1px;
  border-top: 1px dashed #72ade9;
}

.cz-num-con {
  margin-top: 10px;
  padding: 0 5px;
  border: 1px solid #72ade9;
  border-radius: 5px;
  background: linear-gradient(#022e77 0%, #1c64cc 100%);
  cursor: pointer;
}
.cz-num-con2 {
  margin-top: 8px;
  padding: 0 5px;
  border: 1px solid #69e6f1;
  border-radius: 5px;
  // background: linear-gradient(0deg #03387B 0%, #2B9AC5 100%);
}

.tooltip {
  min-width: 155px;
  padding: 15px 20px;
  pointer-events: none; /* 防止鼠标事件干扰 */
  background: #1065d8;
  color: #fff;
  font-size: 18px;
  border-radius: 5px;
  box-shadow: 0 0 15px #023f91;
}

/* 动态标签样式 */
.dynamic-label {
  position: absolute;
  /* 避免遮挡 SVG 交互 */
  /* pointer-events: none; */
  cursor: pointer;
}

.label-bg {
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  min-width: calc(12px * var(--scale-factor)); /* 基础尺寸 14px × 缩放比例 */
  height: calc(12px * var(--scale-factor));
  padding: 4px 4px;
  background: red;
  border-radius: 12px;
  font-size: calc(9px * var(--scale-factor, 1));
  color: white;

  // display: flex;
  // align-items: center;
  // justify-content: center;
  // width: calc(18px * var(--scale-factor, 1)); /* 固定宽高相同 */
  // height: calc(18px * var(--scale-factor, 1));
  // background: red;
  // border-radius: 50%;
  // font-size: calc(9px * var(--scale-factor, 1));
  // line-height: 1;
  // color: white;
  // box-sizing: border-box;
}

// .label-text {
//   display: inline-block;
//   color: white;
//   font-size: calc(10px * var(--scale-factor));
//   line-height: 1;
// }

:deep(.el-dialog) {
  background-color: #363f5c;
}
:deep(.el-dialog__title) {
  color: white;
}

:deep(.el-card) {
  background: unset;
  color: white;

  .text-xs {
    color: white !important;
  }
}

.sgyp-dialog-form {
  :deep(.el-form-item__label) {
    color: white;
  }
  :deep(.el-form-item) {
    width: 100%;
  }

  .input-prepend-select {
    width: 115px;
    background-color: #409eff;
    color: white;
    border-radius: 6px 0 0 6px;
    :deep(.el-select__caret) {
      color: white;
    }

    :deep(.el-select__placeholder) {
      color: white;
    }
  }

  /* 统一修改所有输入组件 */
  :deep(.el-input__wrapper),
  :deep(.el-select__wrapper),
  .el-date-editor .el-input__wrapper,
  .el-textarea__inner {
    background-color: #2a324b;
    box-shadow: 0 0 0 1px #4a556f inset;

    &:hover {
      box-shadow: 0 0 0 1px #5d6b8f inset;
    }

    &.is-focus {
      box-shadow: 0 0 0 1px #409eff inset;
    }
  }
  :deep(.el-input__inner),
  :deep(.el-select__selected-item),
  :deep(.el-range-input),
  :deep(.el-range-separator) {
    color: white !important;
  }
  :deep(.el-select__placeholder.is-transparent) {
    color: var(--el-text-color-placeholder) !important;
  }
}

.wheel-con {
  height: 100%;
  transform-origin: left top;
}

.drawing-board {
  position: absolute;
  left: 0;
  top: 15px;
  width: 100%;
  height: 100%;
  z-index: 10;
}
:deep(.el-empty__description) p {
  color: white;
}

:deep(.el-overlay),
:deep(.el-overlay-dialog) {
  width: 100%;
}

.custom-dialog-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
}
</style>

<style>
.hit {
  animation: hitShake 0.5s infinite;
}

@keyframes hitShake {
  0% {
    filter: drop-shadow(0 0 0 rgba(255, 100, 100, 0.7));
  }
  50% {
    filter: drop-shadow(0 0 10px rgba(255, 50, 50, 0.9));
  }
  100% {
    filter: drop-shadow(0 0 0 rgba(255, 100, 100, 0.7));
  }
}
</style>

<style>
.wall-chart-popover {
  padding: 0;
}
.wall-chart-popover.is-light,
.wall-chart-popover.is-light > .el-popper__arrow:before {
  padding: 0;
  border: none;
  background-color: #1065d8;
}

.clickable-group {
  cursor: pointer;
  pointer-events: all;
}

.no-margin {
  margin-top: 0 !important;
}
.dialog-con {
  max-height: calc(100vh - var(--el-dialog-margin-top, 15vh) - 180px);
  min-height: 200px;
  overflow: auto;
}
</style>
