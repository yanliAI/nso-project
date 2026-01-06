<template>
  <Page auto-content-height>
    <div ref="mainCmdRef" style="z-index: 500; width: 100%; height: 100%" class="main-div-z">
      <div style="width: 100%; height: 12%" class="head flex">
        <div style="width: 40%; height: 100%">
          <div style="width: 100%; height: 30%"></div>
          <div style="width: 100%; height: 20%; margin-left: 60px" class="flex">
            <el-checkbox label="全部" v-model="data.checkSlAll" size="small" @change="slAllChange"></el-checkbox>
            <el-checkbox label="网络安全" v-model="data.checkGkAll" size="small" @change="gkAllChange"></el-checkbox>
            <el-checkbox label="信息运行" v-model="data.checkFgkAll" size="small" @change="fgkAllChange"></el-checkbox>
          </div>
        </div>
        <div style="width: 20%; height: 100%">
          <div style="width: 100%; height: 80%" class="head-title-text flex items-center">
            <div class="text-center flex-1">指令可视化</div>
          </div>
        </div>
        <div style="width: 40%; height: 100%" class="flex">
          <div class="flex-1"></div>
          <div class="flex items-center h-[80%] mt-[0rem]">
            <div class="head-date-tp"></div>
            <div class="head-date pr-[20px]">{{ formattedDate }}</div>
            <el-tooltip content="点击立即刷新" placement="bottom">
              <div class="timeer flex items-center" @click="timingClick">
                <Refresh class="w-[18px] f-[18px] font-bold"></Refresh>
                （{{ timing }}）
              </div>
            </el-tooltip>
            <!-- <div class="w-[30px] pr-[40px]">
              <div :class="isFull ? 'is-full' : 'not-full'" :title="isFull ? '取消全屏' : '全屏'" @click.stop="setFullScreen"></div>
            </div> -->
          </div>
        </div>
      </div>
      <div style="width: 100%; height: calc(100% - 16%)">
        <div style="width: 100%; height: 50%" class="middle flex">
          <div class="flex-1 ml-[60px] mr-[15px]">
            <div style="width: 100%" class="middle-left-one flex items-center">
              <div style="height: 100%" class="flex items-center">
                <div><div class="tb8s ml-[15px] mr-[10px]"></div></div>
                <div class="zxzzl mt-[2px]">执行中指令</div>
              </div>
              <div style="width: 17%; height: 100%"></div>
              <!-- <div style="width: 6%; height: 100%">
                <div style="width: 100%; height: calc(100% - 4px)" class="xz flex items-center" @click="changeNum(filteredList)">
                  <div :class="{ 'year-active': activeIndex2 === 3 }" @click="activeIndex2 = 3" style="flex: 1; text-align: center; cursor: pointer">
                    已到期&nbsp;<span class="text-[16px] font-bold">{{ addNum }}</span>
                  </div>
                </div>
                <div v-if="activeIndex2 === 3" class="dfhtroi"></div>
              </div>
              <div style="width: 3%; height: 100%"></div> -->
              <div style="width: 8%; height: 100%">
                <div style="width: 100%; height: calc(100% - 4px)" class="qt flex items-center" @click="changeNum(zxzList)">
                  <div :class="{ 'year-active': activeIndex2 === 0 }" @click="activeIndex2 = 0" style="flex: 1; text-align: center; cursor: pointer">
                    总数&nbsp;<span class="text-[16px] font-bold">{{ qtNum }}</span>
                  </div>
                </div>
                <div v-if="activeIndex2 === 0" class="dfhtroi"></div>
              </div>
              <div style="width: 3%; height: 100%"></div>
              <div style="width: 7%; height: 100%">
                <div style="width: 100%; height: calc(100% - 4px)" class="dbh flex items-center" @click="changeNum(todayDqList)">
                  <div :class="{ 'year-active': activeIndex2 === 2 }" @click="activeIndex2 = 2" style="flex: 1; text-align: center; cursor: pointer">
                    今日到期&nbsp;<span class="text-[16px] font-bold">{{ dbhNum }}</span>
                  </div>
                </div>
                <div v-if="activeIndex2 === 2" class="dfhtroi"></div>
              </div>
              <div style="width: 3%; height: 100%"></div>
              <div style="width: 8%; height: 100%">
                <div style="width: 100%; height: calc(100% - 4px)" class="ybh flex items-center" @click="changeNum(tomorrowDqList)">
                  <div :class="{ 'year-active': activeIndex2 === 1 }" @click="activeIndex2 = 1" style="flex: 1; text-align: center; cursor: pointer">
                    明日到期&nbsp;<span class="text-[16px] font-bold">{{ ybhNum }}</span>
                  </div>
                </div>
                <div v-if="activeIndex2 === 1" class="dfhtroi"></div>
              </div>
            </div>

            <div style="width: 100%; height: calc(100% - 44px); overflow-y: auto; scrollbar-color: #03488f #052d55; scrollbar-width: thin">
              <!-- <div style="width: 100%; height: 3%;"></div> -->
              <div style="width: 100%; height: 180px" class="middle-left-two" v-for="(item, index) in divCount" :key="index">
                <div style="width: 100%; height: 10%"></div>
                <div style="width: 100%; height: 15%" class="flex">
                  <div style="width: 3%; height: 100%"></div>
                  <div style="width: 26%; height: 100%" class="flex">
                    <div style="width: 100%; height: 100%; cursor: pointer" class="sldw" @click="toTabDetail(item)">
                      <div style="width: 100%; height: 20%"></div>
                      {{ item.commandTitle }}
                    </div>
                  </div>
                  <div style="width: 3%; height: 100%"></div>
                  <div style="width: 15%; height: 100%" class="middle-left-two-two flex">
                    <div style="width: 13%; height: 100%"></div>
                    <div style="width: 63%; height: 100%" class="topxwz">
                      <div style="width: 100%; height: 15%"></div>
                      受令单位数量
                    </div>
                    <div style="width: 24%; height: 100%" class="sldw dsagsz">
                      <div style="width: 100%; height: 15%"></div>
                      {{ item.slDept ? JSON.parse(item.slDept).length : 0 }}
                    </div>
                  </div>
                </div>
                <div style="width: 100%; height: 8%"></div>
                <div style="width: 100%; height: 55%" class="flex">
                  <div style="width: 3%; height: 100%"></div>
                  <div class="flex items-center">
                    <div>
                      <div class="cmndtp"></div>
                      <div class="mjgi">发令</div>
                    </div>
                    <div class="hosudg">
                      <div class="dw mt-[20px] ml-[38px]">发令单位：{{ item.flDeptName }}</div>
                      <div class="sj mt-[12px] ml-[38px]">发令时间：{{ formatDateTime(item.flTime) }}</div>
                    </div>
                  </div>
                  <div style="width: 3%; height: 100%"></div>
                  <div class="flex items-center">
                    <div>
                      <div class="mjddtp"></div>
                      <div class="qianshou">签收</div>
                    </div>
                    <div class="ojshgwe ml-[20px]">
                      <div style="width: 100%; text-align: center; cursor: pointer" class="mt-[22px] sl fghfd" @click="queryDealTask(item.id, '1')">
                        {{ QsArray[index] }}
                      </div>
                      <div style="width: 100%" class="qsbt1 text-center mt-[26.5px]">已签收单位</div>
                    </div>
                    <div class="ojshgwe ml-[10px]">
                      <div style="width: 100%; text-align: center; cursor: pointer" class="mt-[22px] sl fghfd" @click="queryDealTask2(item.id, '1')">
                        {{ item.slDept ? JSON.parse(item.slDept).length - QsArray[index] : 0 }}
                      </div>
                      <div style="width: 100%" class="qsbt1 text-center mt-[26.5px]">未签收单位</div>
                    </div>
                  </div>

                  <div style="width: 3%; height: 100%"></div>

                  <div class="flex items-center">
                    <div>
                      <div class="inhdtp"></div>
                      <div class="fuling">复令</div>
                    </div>

                    <div class="ljhifhg ml-[20px]">
                      <div style="width: 100%; text-align: center; cursor: pointer" class="mt-[22px] sl2 fghfd" @click="queryDealTask(item.id, '2')">
                        {{ FlArray[index] }}
                      </div>
                      <div style="width: 100%" class="qsbt1 text-center mt-[26px]">已复令单位</div>
                    </div>
                    <div class="ljhifhg ml-[10px]">
                      <div style="width: 100%; text-align: center; cursor: pointer" class="mt-[22px] sl2 fghfd" @click="queryDealTask2(item.id, '2')">
                        {{ item.slDept ? JSON.parse(item.slDept).length - FlArray[index] : 0 }}
                      </div>
                      <div style="width: 100%" class="qsbt1 text-center mt-[26px]">未复令单位</div>
                    </div>
                    <div class="ljhifhg ml-[10px]">
                      <div style="width: 100%; text-align: center; cursor: pointer" class="mt-[22px] sl2 fghfd" @click="queryDealTask3(item.id, '2')">
                        {{ flcsArray[index] }}
                      </div>
                      <div style="width: 100%" class="qsbt1 text-center mt-[26px]">超时</div>
                    </div>
                  </div>
                </div>
                <div style="width: 100%; height: 10%"></div>
              </div>
            </div>
          </div>
          <div class="middle-right-one mr-[60px]">
            <div class="middle-right-one-head flex items-center">
              <div><div class="bhtbs"></div></div>
              <div class="zxzzl">今日闭环</div>
            </div>
            <div style="width: 100%; height: 3%"></div>
            <div style="width: 100%; height: 84.5%; overflow-y: auto; scrollbar-color: #03488f #052d55; scrollbar-width: thin" class="px-[13px]">
              <div style="width: 100%; height: 100%">
                <div style="width: 100%" class="middle-right-one-one px-[15px] mb-[15px]" v-for="(item, index) in jrbhLists" :key="index">
                  <div style="height: 20%" class="jrbhtitle flex pt-[12px]">
                    {{ item.commandTitle }}
                  </div>

                  <div style="height: 30%; cursor: pointer" v-if="getCommandTypeLabel(item.commandType) == '漏洞排查'" class="nr flex content-bh pt-[5px]" @click="toTabDetail(item)">内容：{{ item.remark }}</div>
                  <div style="height: 30%; cursor: pointer" v-else class="nr flex content-bh pt-[5px]" @click="toTabDetail(item)">{{ getSldwLabel(item.slDept, item.commandType) }}</div>
                  <div style="width: 100%; height: 18%" class="flex">
                    <div class="nr flex pt-[5px] flex-[0.5]">要求完成时间：{{ formatDateTime(item.wcTime) }}</div>
                    <div class="nr flex pt-[5px] flex-[0.5]">实际完成时间：{{ formatDateTime(item.doneTime) }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div style="width: 100%; height: 4.5%"></div>
          </div>
        </div>
        <div style="width: 100%; height: 50%" class="bottom flex">
          <div style="width: 29.3%; height: 100%" class="ml-[60px] mr-[15px]">
            <div class="bottom-right-one mt-[15px]">
              <div class="middle-right-one-head mt-[15px] flex items-center">
                <div><div class="bhtbs"></div></div>
                <div class="zxzzl">今年指令概览</div>
              </div>
            </div>
            <div style="width: 100%; height: calc(100% - 59px)" class="bottom-right-two">
              <Three />
            </div>
          </div>
          <div style="height: 100%" class="flex-1 mr-[60px]">
            <div class="bnkhsdg6 mt-[15px] flex items-center">
              <div><div class="bhtbs"></div></div>
              <div class="zxzzl">指令统计</div>
              <div style="flex: 1; height: 100%" class="flex items-center">
                <div style="width: 22%; height: 100%"></div>
                <div style="width: 10%; height: 100%"></div>
                <div style="width: 7%; height: 100%">
                  <div style="width: 100%; height: calc(100% - 4px)" class="jr" @click="getDayNum">
                    <div :class="{ 'year-active': activeIndex === 3 }" @click="activeIndex = 3" style="flex: 1; text-align: center; cursor: pointer">今日</div>
                  </div>
                  <div v-if="activeIndex === 3" class="dfhtroi1"></div>
                </div>
                <div style="width: 7%; height: 100%">
                  <div style="width: 100%; height: calc(100% - 4px)" class="jr" @click="getWeekNum">
                    <div :class="{ 'year-active': activeIndex === 2 }" @click="activeIndex = 2" style="flex: 1; text-align: center; cursor: pointer">本周</div>
                  </div>
                  <div v-if="activeIndex === 2" class="dfhtroi1"></div>
                </div>
                <div style="width: 7%; height: 100%">
                  <div style="width: 100%; height: calc(100% - 4px)" class="jr" @click="getMonthNum">
                    <div :class="{ 'year-active': activeIndex === 1 }" @click="activeIndex = 1" style="flex: 1; text-align: center; cursor: pointer">本月</div>
                  </div>
                  <div v-if="activeIndex === 1" class="dfhtroi1"></div>
                </div>
                <div style="width: 7%; height: 100%">
                  <div style="width: 100%; height: calc(100% - 4px)" class="jr" @click="getYearNum">
                    <div :class="{ 'year-active': activeIndex === 0 }" @click="activeIndex = 0" style="flex: 1; text-align: center; cursor: pointer">今年</div>
                  </div>
                  <div v-if="activeIndex === 0" class="dfhtroi1"></div>
                </div>
              </div>
            </div>
            <div style="width: 100%; height: calc(100% - 59px)" class="bottomLeft">
              <div style="width: 100%; height: 93px" class="flex pt-[13px]">
                <div style="width: 2%; height: 100%"></div>
                <div class="bottom-left-head-one flex">
                  <div style="width: 55%; height: 100%"></div>
                  <div style="width: 45%; height: 100%">
                    <div style="width: 100%; height: 16%"></div>
                    <div style="width: 100%; height: 60%" class="cs">
                      <div style="width: 80%; height: 100%">
                        <div style="width: 100%; height: 60%">发令数量</div>
                        <div style="width: 100%; height: 40%" class="flex items-center">
                          <span class="zltjNum">{{ zltjfbNum }}</span>
                          <span class="mt-[-1px]">条</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div style="width: 2%; height: 100%"></div>
                <div class="bottom-left-head-two flex">
                  <div style="width: 55%; height: 100%"></div>
                  <div style="width: 45%; height: 100%">
                    <div style="width: 100%; height: 16%"></div>
                    <div style="width: 100%; height: 60%" class="cs flex">
                      <div style="width: 80%; height: 100%">
                        <div style="width: 100%; height: 60%">执行中</div>
                        <div style="width: 100%; height: 40%" class="flex items-center">
                          <span class="zltjNum">{{ zltjdbhNum }}</span>
                          <span class="mt-[-1px]">条</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div style="width: 2%; height: 100%"></div>
                <div class="bottom-left-head-three flex">
                  <div style="width: 55%; height: 100%"></div>
                  <div style="width: 45%; height: 100%">
                    <div style="width: 100%; height: 16%"></div>
                    <div style="width: 100%; height: 60%" class="cs flex">
                      <div style="width: 80%; height: 100%">
                        <div style="width: 100%; height: 60%">已闭环</div>
                        <div style="width: 100%; height: 40%" class="flex items-center">
                          <span class="zltjNum">{{ zltjybhNum }}</span>
                          <span class="mt-[-1px]">条</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div style="width: 2%; height: 100%"></div>
                <div class="bottom-left-head-four flex">
                  <div style="width: 55%; height: 100%"></div>
                  <div style="width: 45%; height: 100%">
                    <div style="width: 100%; height: 16%"></div>
                    <div style="width: 100%; height: 60%" class="cs flex">
                      <div style="width: 80%; height: 100%">
                        <div style="width: 100%; height: 60%">超时</div>
                        <div style="width: 100%; height: 40%" class="flex items-center">
                          <span class="zltjNum">{{ zltjcsNum }}</span>
                          <span class="mt-[-1px]">条</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div style="width: 100%; height: calc(100% - 93px)" class="flex">
                <div style="width: 100%; height: 100%">
                  <div style="width: 100%; height: 25px; margin-left: 40px" class="flex items-center">
                    <span class="text-[#fff] text-[14px] mr-[15px]">复令超时情况</span>
                    <el-checkbox label="全网" v-model="data.flqkqw" size="small" @change="qwChange"></el-checkbox>
                    <el-checkbox label="数字集团" v-model="data.flqksz" size="small" @change="szjtChange"></el-checkbox>
                  </div>
                  <div style="width: 100%; height: calc(100% - 25px)">
                    <One ref="oneRef" @openFlqk="openFlqkClick" />
                  </div>
                  <!-- <div style="width: 100%; height: 13%" class="flex">
                    <div style="width: 48%; height: 100%"></div>
                    <el-button-group>
                      <el-button type="text" :icon="ArrowLeftBold" @click="left"></el-button>
                      <el-button type="text" @click="next">
                        <el-icon class="el-icon--right">
                          <ArrowRightBold />
                        </el-icon>
                      </el-button>
                    </el-button-group>
                  </div> -->
                </div>
                <!-- <div style="width: 32%; height: 100%">
                  <Two />
                </div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalA wrapClassName="custom-modal" ref="modalARef" class="w-[800px] h-[500px] top-[28vh] bg-[rgba(0,44,100,0.85)]" contentClass="bg-transparent" headerClass="bg-transparent text-white" :bordered="false" :darkCss="true" title="签收情况" :footer="false" :closeOnClickModal="false" :draggable="true">
        <el-table :data="data.taskHqList" size="small" style="width: 100%; height: 100%; background: transparent; background-color: transparent; border-color: #00538d">
          <el-table-column type="index" width="40" label="#" align="center" />
          <el-table-column prop="signDwName" label="受令单位" width="250" align="center" />
          <el-table-column prop="signManName" label="签收人" align="center" />
          <el-table-column label="签收时间" align="center">
            <template #default="props">
              <span v-if="props.row.isComplate == 'Y'">{{ formatDateTime(props.row.opTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="isComplate" label="是否签收" align="center">
            <template #default="props">
              <span v-if="props.row.isComplate == 'Y'" class="primary">已签收</span>
              <span v-else class="text-red-600">未签收</span>
            </template>
          </el-table-column>
        </el-table>
      </ModalA>
      <ModalB class="w-[800px] h-[500px] top-[28vh] bg-[rgba(0,44,100,0.85)]" contentClass="bg-transparent" headerClass="bg-transparent text-white" :bordered="false" :darkCss="true" title="复令情况" :footer="false" :closeOnClickModal="false" :draggable="true">
        <el-table :data="data.taskFlList" size="small" style="height: 100%; background: transparent; background-color: transparent; border-color: #00538d">
          <el-table-column type="index" width="40" label="#" align="center" />
          <el-table-column prop="signDwName" label="复令单位" align="center" />
          <el-table-column prop="signManName" label="复令人" align="center" />
          <el-table-column label="复令时间" align="center">
            <template #default="props">
              <span v-if="props.row.isComplate == 'Y'">{{ formatDateTime(props.row.opTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="isComplate" label="是否复令" width="100" align="center">
            <template #default="props">
              <span v-if="props.row.isComplate == 'Y'" class="primary">已复令</span>
              <span v-else class="text-red-600">未复令</span>
            </template>
          </el-table-column>
        </el-table>
      </ModalB>
      <ModalC class="w-[1400px] h-[650px] bg-[rgba(0,44,100,0.85)]" title="复令超时情况" contentClass="bg-transparent" headerClass="bg-transparent text-white" :bordered="false" :darkCss="true" :footer="false" :closeOnClickModal="false" :draggable="true">
        <CmdSignList :activeIndex="activeIndex" :dwbm="dwbm"></CmdSignList>
      </ModalC>
    </div>
  </Page>
</template>

<script setup>
import { Page } from '@vben/common-ui'
import { ref, onMounted, onUnmounted, reactive, computed, nextTick } from 'vue'
import { tDateFormat, formatDateTime, tDateTimeFormat, formatDrop, lookFlow } from '#/utils/commonUtil.ts'
import { ElForm, ElFormItem, ElRow, ElCol, ElTable, ElTableColumn, ElPopover, ElPagination, ElMain, ElContainer, ElHeader, ElFooter, ElTabs, ElTabPane } from 'element-plus'

import { useDropStore } from '#/store'
import { useVbenModal } from '@vben/common-ui'
import One from './one.vue'
import Two from './two.vue'
import Three from './three.vue'
import { AnalysisChartCard } from '@vben/common-ui'
import { ArrowLeftBold, ArrowRightBold, Delete, Edit, List, Share, Refresh } from '@element-plus/icons-vue'
import AnalyticsVisitsData from '../../dashboard/analytics/analytics-visits-data.vue'
import { requestClient } from '#/api/request'
import { querySignList } from './cmdMgtMethod.ts'
import screenfull from 'screenfull'
import { useRouter } from 'vue-router'
import CmdSignList from './cmdSignList.vue'

const [ModalA, modalApiA] = useVbenModal({
  onCancel() {
    modalApi.close()
  }
})
const [ModalB, modalApiB] = useVbenModal({
  onCancel() {
    modalApi.close()
  }
})
const [ModalC, modalApiC] = useVbenModal({
  onCancel() {
    modalApi.close()
  }
})
const mainCmdRef = ref()
const oneRef = ref()
const isFull = ref(false)
const dropList = reactive({})
const divCount = ref([])
const jrbhLists = ref([])
const filteredList = ref([])
const todayDqList = ref([])
const tomorrowDqList = ref([])
const zxzList = ref([])
const QsArray = ref([0])
const FlArray = ref([0])
const dqQsArray = ref([0])
const dqFlArray = ref([0])
const jtdqQsArray = ref([0])
const jtdqFlArray = ref([0])
const mtdqQsArray = ref([0])
const mtdqFlArray = ref([0])
const zxzQsArray = ref([0])
const zxzFlArray = ref([0])

const lddwArray = ref([0])
const ldxtArray = ref([0])
const ldsbArray = ref([0])
const ldzgArray = ref([0])

const lddwArray1 = ref([0])
const ldxtArray1 = ref([0])
const ldsbArray1 = ref([0])
const ldzgArray1 = ref([0])

const lddwArray2 = ref([0])
const ldxtArray2 = ref([0])
const ldsbArray2 = ref([0])
const ldzgArray2 = ref([0])

const lddwArray3 = ref([0])
const ldxtArray3 = ref([0])
const ldsbArray3 = ref([0])
const ldzgArray3 = ref([0])

const lddwArray4 = ref([0])
const ldxtArray4 = ref([0])
const ldsbArray4 = ref([0])
const ldzgArray4 = ref([0])

const qscsArray = ref([0])
const flcsArray = ref([0])
const qscsArray1 = ref([0])
const flcsArray1 = ref([0])
const qscsArray2 = ref([0])
const flcsArray2 = ref([0])
const qscsArray3 = ref([0])
const flcsArray3 = ref([0])
const qscsArray4 = ref([0])
const flcsArray4 = ref([0])

const map = new Map()
const map1 = new Map()
const map2 = new Map()
const map3 = new Map()
const map4 = new Map()

const index = ref(0)
const activeIndex = ref(3) // 默认选中第一个（今日）
const activeIndex2 = ref(0) // 默认选中第一个（今日）
const dwbm = ref()
const addNum = ref(0)
const dbhNum = ref(0)
const ybhNum = ref(0)
const qtNum = ref(0)
const zltjfbNum = ref(0)
const zltjdbhNum = ref(0)
const zltjybhNum = ref(0)
const zltjcsNum = ref(0)

const deptCounts = ref({}) // 统计dept出现次数
const parentData = ref(null) // 初始为 null

const data = reactive({
  formData: {},
  oprateFlow: false,
  operList: {},
  selectAllGK: false,
  selectAllFGK: false,
  checkSlAll: true,
  checkGkAll: false,
  checkFgkAll: false,
  flqkqw: true,
  flqksz: false,
  flqkfw: 'qw'
})

const router = useRouter()
const timing = ref(60)
function setTime() {
  if (timing.value == 0) {
    timing.value = 60
    csh()
  } else {
    timing.value--
  }
}

function timingClick() {
  timing.value = 60
  csh()
}

const handleOprate = (item) => {
  if (item.commandStatus != '0') {
    data.oprateFlow = data.operList[item.id]
  }
}
const toTabDetail = (item) => {
  handleOprate(item)
  window.open(
    router.resolve({
      path: '/cmdMgt/cmdRelease',
      query: { ...item, oprateFlow: data.oprateFlow }
    }).href,
    'zlPage'
  )
}
const openFlqkClick = (bm) => {
  dwbm.value = bm
  modalApiC.open()
}
const getSldwLabel = (slDept, cmdType) => {
  let sldw = eval(slDept)
  if (sldw.length == 27) {
    return '全网已完成' + getCommandTypeLabel(cmdType)
  } else {
    let l = ''
    if (sldw && sldw.length > 0) {
      sldw.forEach((d) => {
        dropList.NSOS_ORG_NAME_SLDW.forEach((o) => {
          if (d == o.value) {
            l += o.label + '、'
          }
        })
      })
    }
    if (l.length > 0) {
      l = l.substring(0, l.length - 1)
    }
    return l + '已完成' + getCommandTypeLabel(cmdType)
  }
}
// 响应式时间变量
const currentTime = ref(new Date())

// 格式化日期函数
const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const weekday = weekdays[date.getDay()]

  return `${year}年${month}月${day}日 ${weekday}`
}
/**
 * 设置内容全屏 隐藏aside、header
 */
const fullContent = () => {
  // 设置内容全屏
  let aside = document.querySelector(`aside`)
  let header = document.querySelector(`header`)
  if (aside) {
    aside.style.display = 'none'
    // 获取前一个同级元素
    const prevDiv = aside.previousElementSibling
    // 检查是否是 div 元素
    if (prevDiv && prevDiv.tagName === 'DIV') {
      prevDiv.style.display = 'none'
    }
  }
  if (header) {
    // 获取父元素
    const parent = header.parentElement
    if (parent) {
      parent.style.display = 'none'
    }
    const mainEle = document.getElementById('__vben_main_content')
    if (mainEle) {
      mainEle.classList.add('no-margin')
    }
  }
}
// 计算属性格式化后的时间
const formattedDate = ref(formatDate(currentTime.value))
const modalARef = ref()
// 定时器更新
let timer = null

onMounted(async () => {
  fullContent()
  const dropStore = useDropStore()
  const dropType = ['NSOS_ORG_SHORTNAME', 'NSOS_ORG_NAME_SLDW', 'NSOS_CMD_TYPE']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)

  setInterval(setTime, 1000)

  await csh()
})

// 组件卸载时清除定时器
onUnmounted(() => {
  clearInterval(timer)
})
function getCommandTypeLabel(code) {
  let l = ''
  dropList.NSOS_CMD_TYPE.forEach((d) => {
    if (d.value === code) {
      l = d.label
    }
  })
  return l
}
function setFullScreen() {
  // isFull.value = !isFull.value
  // const elem = mainCmdRef.value // 获取你想要全屏的元素
  // if (!document.fullscreenElement) {
  //   if (elem.requestFullscreen) {
  //     elem.requestFullscreen()
  //   } else if (elem.mozRequestFullScreen) {
  //     /* Firefox */
  //     elem.mozRequestFullScreen()
  //   } else if (elem.webkitRequestFullscreen) {
  //     /* Chrome, Safari & Opera */
  //     elem.webkitRequestFullscreen()
  //   } else if (elem.msRequestFullscreen) {
  //     /* IE/Edge */
  //     elem.msRequestFullscreen()
  //   }
  // } else {
  //   if (document.exitFullscreen) {
  //     document.exitFullscreen()
  //   } else if (document.mozCancelFullScreen) {
  //     /* Firefox */
  //     document.mozCancelFullScreen()
  //   } else if (document.webkitExitFullscreen) {
  //     /* Chrome, Safari and Opera */
  //     document.webkitExitFullscreen()
  //   } else if (document.msExitFullscreen) {
  //     /* IE/Edge */
  //     document.msExitFullscreen()
  //   }
  // }
  if (screenfull.isEnabled) {
    let element = document.querySelector('.main-div-z')
    screenfull.toggle(element)
  }
  isFull.value = !isFull.value
}
const left = () => {
  index.value = -1
}
const next = () => {
  index.value = 1
}

const changeNum = (num) => {
  if (activeIndex2.value === 3) {
    QsArray.value = [...dqQsArray.value]
    FlArray.value = [...dqFlArray.value]
    lddwArray.value = [...lddwArray1.value]
    ldxtArray.value = [...ldxtArray1.value]
    ldsbArray.value = [...ldsbArray1.value]
    ldzgArray.value = [...ldzgArray1.value]
    qscsArray.value = [...qscsArray1.value]
    flcsArray.value = [...flcsArray1.value]

    map.clear()
    for (const [key, value] of map1) {
      map.set(key, value)
    }
  }
  if (activeIndex2.value === 2) {
    QsArray.value = [...jtdqQsArray.value]
    FlArray.value = [...jtdqFlArray.value]
    lddwArray.value = [...lddwArray2.value]
    ldxtArray.value = [...ldxtArray2.value]
    ldsbArray.value = [...ldsbArray2.value]
    ldzgArray.value = [...ldzgArray2.value]
    qscsArray.value = [...qscsArray2.value]
    flcsArray.value = [...flcsArray2.value]

    map.clear()
    for (const [key, value] of map2) {
      map.set(key, value)
    }
  }
  if (activeIndex2.value === 1) {
    QsArray.value = [...mtdqQsArray.value]
    FlArray.value = [...mtdqFlArray.value]
    lddwArray.value = [...lddwArray3.value]
    ldxtArray.value = [...ldxtArray3.value]
    ldsbArray.value = [...ldsbArray3.value]
    ldzgArray.value = [...ldzgArray3.value]
    qscsArray.value = [...qscsArray3.value]
    flcsArray.value = [...flcsArray3.value]

    map.clear()
    for (const [key, value] of map3) {
      map.set(key, value)
    }
  }
  if (activeIndex2.value === 0) {
    QsArray.value = [...zxzQsArray.value]
    FlArray.value = [...zxzFlArray.value]
    lddwArray.value = [...lddwArray4.value]
    ldxtArray.value = [...ldxtArray4.value]
    ldsbArray.value = [...ldsbArray4.value]
    ldzgArray.value = [...ldzgArray4.value]
    qscsArray.value = [...qscsArray4.value]
    flcsArray.value = [...flcsArray4.value]

    map.clear()
    for (const [key, value] of map4) {
      map.set(key, value)
    }
  }
  divCount.value = num
}
const szjtChange = () => {
  data.flqkqw = false
  data.flqksz = true
  data.flqkfw = 'sz'
  if (activeIndex.value == '0') {
    getYearNum()
  } else if (activeIndex.value == '1') {
    getMonthNum()
  } else if (activeIndex.value == '2') {
    getWeekNum()
  } else if (activeIndex.value == '3') {
    getDayNum()
  }
}
const qwChange = () => {
  data.flqkqw = true
  data.flqksz = false
  data.flqkfw = 'qw'
  if (activeIndex.value == '0') {
    getYearNum()
  } else if (activeIndex.value == '1') {
    getMonthNum()
  } else if (activeIndex.value == '2') {
    getWeekNum()
  } else if (activeIndex.value == '3') {
    getDayNum()
  }
}
const getYearNum = async () => {
  const { zbData, zzmcData, zzbmData, csData, wcsData, cslData } = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/command/getYearNums', data.formData, { params: { flqkfw: data.flqkfw } })
  nextTick(async () => {
    oneRef.value.refreshEcharts(zzmcData, zzbmData, csData, wcsData, cslData)
  })
  zltjfbNum.value = zbData[0].YEARNUM
  const response2 = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/command/getYjxzNums', data.formData)
  zltjdbhNum.value = response2[0].YEARNUM
  const response3 = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/command/getYybhNums', data.formData)
  zltjybhNum.value = response3[0].YEARNUM
  const response4 = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/command/getYcsNums', data.formData)
  zltjcsNum.value = response4[0].YEARNUM
}
const getMonthNum = async () => {
  const { zbData, zzmcData, zzbmData, csData, wcsData, cslData } = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/command/getMonthNums', data.formData, { params: { flqkfw: data.flqkfw } })
  nextTick(async () => {
    oneRef.value.refreshEcharts(zzmcData, zzbmData, csData, wcsData, cslData)
  })

  zltjfbNum.value = zbData[0].MONTHNUM
  const response2 = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/command/getMjxzNums', data.formData)
  zltjdbhNum.value = response2[0].MONTHNUM
  const response3 = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/command/getMybhNums', data.formData)
  zltjybhNum.value = response3[0].MONTHNUM
  const response4 = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/command/getMcsNums', data.formData)
  zltjcsNum.value = response4[0].MONTHNUM
}
const getWeekNum = async () => {
  const { zbData, zzmcData, zzbmData, csData, wcsData, cslData } = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/command/getWeekNums', data.formData, { params: { flqkfw: data.flqkfw } })
  nextTick(async () => {
    oneRef.value.refreshEcharts(zzmcData, zzbmData, csData, wcsData, cslData)
  })

  zltjfbNum.value = zbData[0].WEEKNUM
  const response2 = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/command/getWjxzNums', data.formData)
  zltjdbhNum.value = response2[0].WEEKNUM
  const response3 = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/command/getWybhNums', data.formData)
  zltjybhNum.value = response3[0].WEEKNUM
  const response4 = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/command/getWcsNums', data.formData)
  zltjcsNum.value = response4[0].WEEKNUM
}
const getDayNum = async () => {
  const { zbData, zzmcData, zzbmData, csData, wcsData, cslData } = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/command/getDayNums', data.formData, { params: { flqkfw: data.flqkfw } })
  nextTick(async () => {
    oneRef.value.refreshEcharts(zzmcData, zzbmData, csData, wcsData, cslData)
  })

  zltjfbNum.value = zbData[0].TODAYNUM
  const response2 = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/command/getDjxzNums', data.formData)
  zltjdbhNum.value = response2[0].TODAYNUM
  const response3 = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/command/getDybhNums', data.formData)
  zltjybhNum.value = response3[0].TODAYNUM
  const response4 = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/command/getDcsNums', data.formData)
  zltjcsNum.value = response4[0].TODAYNUM
}

const queryDealTask = async (id, type) => {
  if (type == '1') {
    modalApiA.open()
  } else {
    modalApiB.open()
  }
  let params = { cmdId: id, opType: type }
  let list = await querySignList(params)
  const filteredList = list.filter((item) => item.isComplate === 'Y')
  if (type == '1') {
    data.taskHqList = filteredList
  } else {
    data.taskFlList = filteredList
  }
}

const queryDealTask2 = async (id, type) => {
  if (type == '1') {
    modalApiA.open()
  } else {
    modalApiB.open()
  }
  let params = { cmdId: id, opType: type }
  let list = await querySignList(params)
  const filteredList = list.filter((item) => item.isComplate === 'N')
  if (type == '1') {
    data.taskHqList = filteredList
  } else {
    data.taskFlList = filteredList
  }
}

const queryDealTask3 = async (id, type) => {
  if (type == '1') {
    modalApiA.open()
  } else {
    modalApiB.open()
  }
  let list = map.get(id)
  const filteredList = list.filter((item) => item.opType == '1')
  const filteredList2 = list.filter((item) => item.opType == '2')
  if (type == '1') {
    data.taskHqList = filteredList
  } else {
    data.taskFlList = filteredList2
  }
}

const slAllChange = async (value) => {
  data.formData.commandFlArray = null
  if (value) {
    data.checkGkAll = false
    data.checkFgkAll = false

    data.selectAllGK = true
    data.selectAllFGK = true
  } else {
    data.selectAllGK = false
    data.selectAllFGK = false
  }
  await csh()
}

const gkAllChange = async (value) => {
  data.formData.commandFlArray = ['3', '4']
  if (value) {
    data.checkSlAll = false
    data.checkFgkAll = false

    data.selectAllGK = true
    data.selectAllFGK = false
  } else {
    data.selectAllGK = false
  }
  await csh()
}

const fgkAllChange = async (value) => {
  data.formData.commandFlArray = ['1', '2']
  if (value) {
    data.checkSlAll = false
    data.checkGkAll = false

    data.selectAllGK = false
    data.selectAllFGK = true
  } else {
    data.selectAllFGK = false
  }
  await csh()
}

const csh = async () => {
  const response0 = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/command/queryVisualData', data.formData)

  // 原始数据
  const list = response0.cmdList
  const signList = response0.signMap
  const flqkList = response0.flqkMap
  const csRulesList = response0.csRulesList
  const serverTime = response0.serverTime

  //到期
  filteredList.value = list.filter((item) => {
    // 注意：这里假设 wctime 是毫秒级时间戳
    return item.wcTime < Date.now() && ['3', '4', '5'].includes(item.commandStatus)
  })

  let i = 0
  let j = 0
  let k = 0
  let l = 0
  let m = 0
  let n = 0
  let s = 0
  let p = 0

  const nums = filteredList.value.filter((item) => {
    //if((Date.now() - item.flTime) > 2*60*60*1000)
    let signArray = signList[item.id]
    if (signArray) {
      let count = signArray.filter((items) => items.opType === '1' && items.isComplate === 'Y').length
      let counts = signArray.filter((items) => items.opType === '2' && items.isComplate === 'Y').length
      dqQsArray.value[i++] = count
      dqFlArray.value[j++] = counts

      let qscsnum = 0
      let flcsnum = 0
      const num = csRulesList.find((items) => items.commandTypeCode === item.commandType)?.timeoutLimit ?? 2
      const qsList = []
      for (const items of signArray) {
        if (items.opType === '1') {
          //签收
          if (items.isComplate === 'Y') {
            if (items.opTime - item.flTime > num * 60 * 60 * 1000) {
              qscsnum += 1
              qsList.push(items)
            }
          } else {
            if (serverTime - item.flTime > num * 60 * 60 * 1000) {
              qscsnum += 1
              qsList.push(items)
            }
          }
        } else {
          //复令
          if (items.isComplate === 'Y') {
            if (items.opTime > item.wcTime) {
              flcsnum += 1
              qsList.push(items)
            }
          } else {
            if (serverTime > item.wcTime) {
              flcsnum += 1
              qsList.push(items)
            }
          }
        }
      }
      qscsArray1.value[s++] = qscsnum
      flcsArray1.value[p++] = flcsnum

      map1.set(item.id, qsList)
    }

    let flqkArray = flqkList[item.id]
    if (flqkArray) {
      let xt = 0
      let sb = 0
      let zg = 0
      for (const item of flqkArray) {
        xt += item.sjSysNum
        sb += item.sjDeviceNum
        zg += item.wwcZgnum
      }
      lddwArray1.value[k++] = flqkArray.length
      ldxtArray1.value[l++] = xt
      ldsbArray1.value[m++] = sb
      ldzgArray1.value[n++] = zg
    } else {
      lddwArray1.value[k++] = 0
      ldxtArray1.value[l++] = 0
      ldsbArray1.value[m++] = 0
      ldzgArray1.value[n++] = 0
    }
    return signArray
  })

  //今日到期
  const getTodayRange = () => {
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    return { startOfDay, endOfDay }
  }

  const { startOfDay, endOfDay } = getTodayRange()

  todayDqList.value = list.filter((item) => {
    return item.wcTime >= startOfDay.getTime() && item.wcTime < endOfDay.getTime() && ['3', '4', '5'].includes(item.commandStatus)
  })

  let i1 = 0
  let j1 = 0
  let k1 = 0
  let l1 = 0
  let m1 = 0
  let n1 = 0
  let s1 = 0
  let p1 = 0
  const nums2 = todayDqList.value.filter((item) => {
    let signArray = signList[item.id]
    if (signArray) {
      let count = signArray.filter((items) => items.opType === '1' && items.isComplate === 'Y').length
      let counts = signArray.filter((items) => items.opType === '2' && items.isComplate === 'Y').length
      jtdqQsArray.value[i1++] = count
      jtdqFlArray.value[j1++] = counts

      let qscsnum = 0
      let flcsnum = 0
      const num = csRulesList.find((items) => items.commandTypeCode === item.commandType)?.timeoutLimit ?? 2
      const qsList = []
      for (const items of signArray) {
        if (items.opType === '1') {
          //签收
          if (items.isComplate === 'Y') {
            if (items.opTime - item.flTime > num * 60 * 60 * 1000) {
              qscsnum += 1
              qsList.push(items)
            }
          } else {
            if (serverTime - item.flTime > num * 60 * 60 * 1000) {
              qscsnum += 1
              qsList.push(items)
            }
          }
        } else {
          //复令
          if (items.isComplate === 'Y') {
            if (items.opTime > item.wcTime) {
              flcsnum += 1
              qsList.push(items)
            }
          } else {
            if (serverTime > item.wcTime) {
              flcsnum += 1
              qsList.push(items)
            }
          }
        }
      }
      qscsArray2.value[s1++] = qscsnum
      flcsArray2.value[p1++] = flcsnum

      map2.set(item.id, qsList)
    }

    let flqkArray = flqkList[item.id]
    if (flqkArray) {
      let xt = 0
      let sb = 0
      let zg = 0
      for (const item of flqkArray) {
        xt += item.sjSysNum
        sb += item.sjDeviceNum
        zg += item.wwcZgnum
      }
      lddwArray2.value[k1++] = flqkArray.length
      ldxtArray2.value[l1++] = xt
      ldsbArray2.value[m1++] = sb
      ldzgArray2.value[n1++] = zg
    } else {
      lddwArray2.value[k1++] = 0
      ldxtArray2.value[l1++] = 0
      ldsbArray2.value[m1++] = 0
      ldzgArray2.value[n1++] = 0
    }
    return signArray
  })

  //明天到期
  const getTomorrowRange = () => {
    const now = new Date()
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    const startOfTomorrow = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate())
    const endOfTomorrow = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate() + 1)
    return { startOfTomorrow, endOfTomorrow }
  }

  const { startOfTomorrow, endOfTomorrow } = getTomorrowRange()

  tomorrowDqList.value = list.filter((item) => {
    return item.wcTime >= startOfTomorrow.getTime() && item.wcTime < endOfTomorrow.getTime() && ['3', '4', '5'].includes(item.commandStatus)
  })

  let i2 = 0
  let j2 = 0
  let k2 = 0
  let l2 = 0
  let m2 = 0
  let n2 = 0
  let s2 = 0
  let p2 = 0
  const nums3 = tomorrowDqList.value.filter((item) => {
    let signArray = signList[item.id]
    if (signArray) {
      let count = signArray.filter((items) => items.opType === '1' && items.isComplate === 'Y').length
      let counts = signArray.filter((items) => items.opType === '2' && items.isComplate === 'Y').length
      mtdqQsArray.value[i2++] = count
      mtdqFlArray.value[j2++] = counts

      let qscsnum = 0
      let flcsnum = 0
      const num = csRulesList.find((items) => items.commandTypeCode === item.commandType)?.timeoutLimit ?? 2
      const qsList = []
      for (const items of signArray) {
        if (items.opType === '1') {
          //签收
          if (items.isComplate === 'Y') {
            if (items.opTime - item.flTime > num * 60 * 60 * 1000) {
              qscsnum += 1
              qsList.push(items)
            }
          } else {
            if (serverTime - item.flTime > num * 60 * 60 * 1000) {
              qscsnum += 1
              qsList.push(items)
            }
          }
        } else {
          //复令
          if (items.isComplate === 'Y') {
            if (items.opTime > item.wcTime) {
              flcsnum += 1
              qsList.push(items)
            }
          } else {
            if (serverTime > item.wcTime) {
              flcsnum += 1
              qsList.push(items)
            }
          }
        }
      }
      qscsArray3.value[s2++] = qscsnum
      flcsArray3.value[p2++] = flcsnum

      map3.set(item.id, qsList)
    }

    let flqkArray = flqkList[item.id]
    if (flqkArray) {
      let xt = 0
      let sb = 0
      let zg = 0
      for (const item of flqkArray) {
        xt += item.sjSysNum
        sb += item.sjDeviceNum
        zg += item.wwcZgnum
      }
      lddwArray3.value[k2++] = flqkArray.length
      ldxtArray3.value[l2++] = xt
      ldsbArray3.value[m2++] = sb
      ldzgArray3.value[n2++] = zg
    } else {
      lddwArray3.value[k2++] = 0
      ldxtArray3.value[l2++] = 0
      ldsbArray3.value[m2++] = 0
      ldzgArray3.value[n2++] = 0
    }
    return signArray
  })

  //执行中
  zxzList.value = list.filter((item) => {
    return ['3', '4', '5'].includes(item.commandStatus)
  })

  let i3 = 0
  let j3 = 0
  let k3 = 0
  let l3 = 0
  let m3 = 0
  let n3 = 0
  let s3 = 0
  let p3 = 0
  const nums4 = zxzList.value.filter((item) => {
    let signArray = signList[item.id]
    if (signArray) {
      let count = signArray.filter((items) => items.opType === '1' && items.isComplate === 'Y').length
      let counts = signArray.filter((items) => items.opType === '2' && items.isComplate === 'Y').length
      zxzQsArray.value[i3++] = count
      zxzFlArray.value[j3++] = counts

      let qscsnum = 0
      let flcsnum = 0
      const num = csRulesList.find((items) => items.commandTypeCode === item.commandType)?.timeoutLimit ?? 2
      const qsList = []
      for (const items of signArray) {
        if (items.opType === '1') {
          //签收
          if (items.isComplate === 'Y') {
            if (items.opTime - item.flTime > num * 60 * 60 * 1000) {
              qscsnum += 1
              qsList.push(items)

              //统计各个单位超时数
              /* const dept = items.signDwCode
              deptCounts.value[dept] = (deptCounts.value[dept] || 0) + 1 */
            }
          } else {
            if (serverTime - item.flTime > num * 60 * 60 * 1000) {
              qscsnum += 1
              qsList.push(items)

              //统计各个单位超时数
              /* const dept = items.signDwCode
              deptCounts.value[dept] = (deptCounts.value[dept] || 0) + 1 */
            }
          }
        } else {
          //复令
          if (items.isComplate === 'Y') {
            if (items.opTime > item.wcTime) {
              flcsnum += 1
              qsList.push(items)

              //统计各个单位超时数
              const dept = items.signDwCode
              deptCounts.value[dept] = (deptCounts.value[dept] || 0) + 1
            }
          } else {
            if (serverTime > item.wcTime) {
              flcsnum += 1
              qsList.push(items)

              //统计各个单位超时数
              const dept = items.signDwCode
              deptCounts.value[dept] = (deptCounts.value[dept] || 0) + 1
            }
          }
        }
      }
      qscsArray4.value[s3++] = qscsnum
      flcsArray4.value[p3++] = flcsnum

      map4.set(item.id, qsList)
      parentData.value = {
        /* 加载完成后的数据 */
        deptCount: { '0156': 2, '0159': 1 }
      }
    }

    let flqkArray = flqkList[item.id]
    if (flqkArray) {
      let xt = 0
      let sb = 0
      let zg = 0
      for (const item of flqkArray) {
        xt += item.sjSysNum
        sb += item.sjDeviceNum
        zg += item.wwcZgnum
      }
      lddwArray4.value[k3++] = flqkArray.length
      ldxtArray4.value[l3++] = xt
      ldsbArray4.value[m3++] = sb
      ldzgArray4.value[n3++] = zg
    } else {
      lddwArray4.value[k3++] = 0
      ldxtArray4.value[l3++] = 0
      ldsbArray4.value[m3++] = 0
      ldzgArray4.value[n3++] = 0
    }
    return signArray
  })

  /* const response = await requestClient.get(import.meta.env.VITE_NSOSGZ + '/command/getJxzNums')
  qtNum.value = response[0].YEARNUM
  const response2 = await requestClient.get(import.meta.env.VITE_NSOSGZ + '/command/getDqNums')
  addNum.value = response2[0].TODAYNUM
  const response3 = await requestClient.get(import.meta.env.VITE_NSOSGZ + '/command/getrdqtNums')
  dbhNum.value = response3[0].TODAYNUM
  const response4 = await requestClient.get(import.meta.env.VITE_NSOSGZ + '/command/getMtdqNums')
  ybhNum.value = response4[0].TODAYNUM */
  addNum.value = filteredList.value.length
  dbhNum.value = todayDqList.value.length
  ybhNum.value = tomorrowDqList.value.length
  qtNum.value = zxzList.value.length

  const response5 = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/command/getTodaybhLists', {})

  getDayNum()
  //divCount.value = filteredList;
  //divCount.value = [...filteredList.value];
  divCount.value = [...zxzList.value]
  jrbhLists.value = [...response5]
  //changeNum(filteredList)
  //changeNum([...filteredList.value])
  changeNum([...zxzList.value])
  timer = setInterval(() => {
    currentTime.value = new Date()
    formattedDate.value = formatDate(currentTime.value)
  }, 1000) // 每秒更新一次
}
</script>

<style scoped>
.main-div-z {
  margin: 0;
  background: url('/images/zlksh/background.png') top center no-repeat !important;
  background-size: 100% 100% !important;
}

/* 修改弹窗内容区域 */
:deep(.custom-modal .ant-modal-content) {
  background: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%) !important;
  border-radius: 12px;
}

/* 修改遮罩层 */
:deep(.ant-modal-mask) {
  background-color: rgb(0 0 0 / 60%) !important;
}

:deep(.bg-overlay) {
  z-index: 3000 !important;
}

.head {
  background: url('/images/zlksh/top.png') !important;
  background-size: 100% 100% !important;
}

.xz {
  font-family: Aldrich;
  font-size: 12px;
  color: #fff;
}

.dbh {
  font-family: Aldrich;
  font-size: 12px;
  color: #fff;
}

.ybh {
  font-family: Aldrich;
  font-size: 12px;
  color: #fff;
}

.qt {
  font-family: Aldrich;
  font-size: 12px;
  color: #fff;
}

.cs {
  font-size: 14px;
  color: #fff;
  letter-spacing: 0.8px;
}

.jr {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #fff;
  letter-spacing: 0.04em;
}

.jrbhtitle {
  font-size: 14px;
  color: #6ed6f9;
}

.nr {
  font-size: 12px;
  color: #fff;
}

.year-active {
  font-size: 12px;
  font-weight: bold; /* 设置字体加粗 */
  color: #3fcfff;
}

.sldw {
  font-size: 14px;
  font-weight: 500; /* 设置字体加粗 */
  color: #fff982;
}

.dw {
  font-size: 12px;
  font-weight: bold; /* 设置字体加粗 */
  color: #99dfff;
}

.sl {
  font-size: 14px;
  font-weight: bold; /* 设置字体加粗 */
  color: #22c79f;
}

.sl2 {
  font-size: 14px;
  font-weight: bold; /* 设置字体加粗 */
  color: #d6beff;
}

.sj {
  font-size: 12px;
  color: rgb(193 199 209);
}

.zltjNum {
  padding-right: 5px;
  font-family: Aldrich;
  font-size: 18px;
  font-weight: normal;
  line-height: normal;
  letter-spacing: normal;
  background: linear-gradient(180deg, #fff 0%, #21c6fd 100%);
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.qsbt {
  font-size: 14px;
  font-weight: 500; /* 设置中粗体 */
  color: #84fdf0;
  letter-spacing: 2px;
}

.flbt {
  font-size: 14px;
  font-weight: 600; /* 设置中粗体 */
  color: #61d7fe;
  letter-spacing: 2px;
}

.fulbt {
  font-size: 14px;
  font-weight: 600; /* 设置中粗体 */
  color: #cdc9ff;
  letter-spacing: 2px;
}

.zlbt {
  font-size: 14px;
  font-weight: 600; /* 设置中粗体 */
  color: #fff982;
  letter-spacing: 2px;
}

.qsbt1 {
  font-size: 12px;
  color: #fff;
  _letter-spacing: 1px;
}

.topxwz {
  font-size: 12px;
  color: #fff;
  letter-spacing: 1px;
}

.dsagsz {
  font-family: Aldrich;
  font-size: 20px;
  font-weight: normal;
  line-height: 10px;
  color: #fcff32;
  letter-spacing: normal;
}

.fghfd {
  font-family: Aldrich;
  font-size: 21px;
  font-weight: normal;
  line-height: 10px;
  letter-spacing: normal;
}

.zxzzl {
  font-family: ReeJiBigRuixainBlackGBV;
  font-size: 18px;
  font-weight: normal;
  line-height: normal;
  letter-spacing: normal;
  background: linear-gradient(180deg, #fff 16%, #98deff 61%);
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.head-title-text {
  font-family: YouSheBiaoTiHei;
  font-size: 44px;
  font-weight: normal;
  line-height: normal;
  color: #fff;
  text-align: center;
  text-shadow: 2px 2px 0 #03218a;
  letter-spacing: 0.04em;
}

.head-date {
  font-size: 14px;
  font-weight: 250;
  color: #fff;
  letter-spacing: 0.04em;
}

.head-date-tp {
  width: 17px;
  height: 17px;
  margin-right: 8px;
  background: url('/images/zlksh/ljrq3.png') !important;
  background-size: 100% 100% !important;
}

.middle-left-one {
  height: 44px;
  background: url('/images/zlksh/bjbk4.png') !important;
  background-size: 100% 100% !important;
}

.tb8s {
  width: 18px;
  height: 20px;
  background: url('/images/zlksh/tb11.png') !important;
  background-size: 100% 100% !important;
}

.middle-left-two {
  margin-top: 15px;
  background: url('/images/zlksh/middleLeftTwo.png') !important;
  background-size: 100% 100% !important;
}

.middle-left-three {
  background: url('/images/zlksh/middleLeftTwo.png') !important;
  background-size: 100% 100% !important;
}

.middle-right-one {
  width: 618px;
  height: 100%;
  background: url('/images/zlksh/middleRightOne.png') !important;
  background-size: 100% 100% !important;
}

.bottomLeft {
  background: url('/images/zlksh/jx6.png') !important;
  background-size: 100% 100% !important;
}

.bottom-right-one {
  width: 100%;
  height: 44px;
  background: url('/images/zlksh/ttj7.png') !important;
  background-size: 100% 100% !important;
}

.bottom-right-two {
  background: url('/images/zlksh/bottomRightTwo.png') !important;
  background-size: 100% 100% !important;
}

.middle-left-two-two {
  background: url('/images/zlksh/middleLeftTwo2.png') !important;
  background-size: 100% 100% !important;
}

.middle-left-two-fl {
  width: 210px;
  height: 90px;
  background: url('/images/zlksh/middleLeftTwoFl.png') !important;
  background-size: 100% 100% !important;
}

.middle-left-three-one {
  background: url('/images/zlksh/middleLeftThree1.png') !important;
  background-size: 100% 100% !important;
}

.middle-right-one-one {
  background: url('/images/zlksh/middleRightOne1.png') !important;
  background-size: 100% 100% !important;
}

.middle-right-one-two {
  background: url('/images/zlksh/middleRightOne2.png') !important;
  background-size: 100% 100% !important;
}

.middle-right-one-head {
  width: 100%;
  height: 44px;
  background: url('/images/zlksh/zlksh_t7.png') !important;
  background-size: 100% 100% !important;
}

.bnkhsdg6 {
  width: 100%;
  height: 44px;
  background: url('/images/zlksh/bty9.png') !important;
  background-size: 100% 100% !important;
}

.bottom-left-head-one {
  width: 220px;
  height: 72px;
  background: url('/images/zlksh/bottomLeftHeadOne.png') !important;
  background-size: 100% 100% !important;
}

.bottom-left-head-two {
  width: 220px;
  height: 72px;
  background: url('/images/zlksh/bottomLeftHeadTwo.png') !important;
  background-size: 100% 100% !important;
}

.bottom-left-head-three {
  width: 220px;
  height: 72px;
  background: url('/images/zlksh/bottomLeftHeadThree.png') !important;
  background-size: 100% 100% !important;
}

.bottom-left-head-four {
  width: 174px;
  height: 72px;
  background: url('/images/zlksh/bottomLeftHeadFour.png') !important;
  background-size: 100% 100% !important;
}

.bhtbs {
  width: 22px;
  height: 25px;
  margin-left: 6px;
  background: url('/images/zlksh/tb10.png') !important;
  background-size: 100% 100% !important;
}

.is-full {
  width: 24px;
  height: 24px;
  margin: auto;
  cursor: pointer;
  background: url('/images/zlksh/dpoc_pd_fqp.png') no-repeat top center;
  background-size: 100% 100%;
}

.not-full {
  width: 24px;
  height: 24px;
  margin: auto;
  cursor: pointer;
  background: url('/images/zlksh/dpoc_pd_qp.png') no-repeat top center;
  background-size: 100% 100%;
}

.cmndtp {
  width: 70px;
  height: 78px;
  margin: auto;
  background: url('/images/zlksh/zlksh-nt1.png') no-repeat top center;
  background-size: 100% 100%;
}

.mjddtp {
  width: 70px;
  height: 78px;
  margin: auto;
  background: url('/images/zlksh/zlksh-nt3.png') no-repeat top center;
  background-size: 100% 100%;
}

.inhdtp {
  width: 70px;
  height: 78px;
  margin: auto;
  background: url('/images/zlksh/zlksh-nt6.png') no-repeat top center;
  background-size: 100% 100%;
}

.hosudg {
  width: 296px;
  height: 78px;
  margin: auto;
  background: url('/images/zlksh/zlksh-nt2.png') no-repeat top center;
  background-size: 100% 100%;
}

.ojshgwe {
  width: 87px;
  height: 82px;
  background: url('/images/zlksh/zlksh-nt4.png') no-repeat top center;
  background-size: 100% 100%;
}

.ljhifhg {
  width: 87px;
  height: 84px;
  background: url('/images/zlksh/zlksh-nt5.png') no-repeat top center;
  background-size: 100% 100%;
}

.mjgi {
  width: 70px;
  margin-top: 8px;
  font-size: 14px;
  font-weight: 600;
  line-height: normal;
  text-align: center;
  letter-spacing: normal;
  background: linear-gradient(180deg, #fff 0%, #79d9ff 100%);
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.qianshou {
  width: 70px;
  margin-top: 8px;
  font-size: 14px;
  font-weight: 600;
  line-height: normal;
  color: #84fdf0;
  text-align: center;
  letter-spacing: normal;
}

.timeer {
  width: 72px;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
}

.fuling {
  width: 70px;
  margin-top: 8px;
  font-size: 14px;
  font-weight: 600;
  line-height: normal;
  color: #cdc9ff;
  text-align: center;
  letter-spacing: normal;
}

.dfhtroi {
  width: 45px;
  height: 4px;
  margin: auto;
  background: #52b8ff;
  border-radius: 4px;
}

.dfhtroi1 {
  width: 25px;
  height: 4px;
  margin: auto;
  background: #52b8ff;
  border-radius: 4px;
}

.is-full:hover {
  width: 26px;
  height: 26px;
}

.not-full:hover {
  width: 26px;
  height: 26px;
}

.primary {
  color: hsl(var(--primary));
}

/* 分割线颜色 */
.el-table {
  --el-table-border: 1px solid #00538d !important;
  --el-table-border-color: #00538d !important;
  --el-table-header-bg-color: transparent;
  --el-table-bg-color: transparent;
  --el-table-tr-bg-color: transparent;
}

:deep(.p-1) {
  padding: 0 !important;
}

/* 表头样式 */
:deep(.el-table__header) th {
  color: white; /* 表头文字颜色 */
  background: linear-gradient(to bottom, rgb(107 144 255 / 0%), rgb(107 144 255 / 30%)) !important; /* 表头背景色 */
}

/* 表体样式 */
:deep(.el-table__body) tr {
  color: #fff; /* 表体文字颜色 */
  background-color: transparent !important; /* 表体背景色 */
}

/* 空白表格背景色 */
:deep(.el-table__empty-block) {
  background-color: transparent !important;
}

/* 鼠标悬停行样式 */
:deep(.el-table__body) tr:hover > td {
  background-color: rgb(20 48 133 / 80%) !important;
}

/* 斑马纹表格样式 */
:deep(.el-table__body) tr.el-table__row--striped {
  background-color: rgb(20 48 133 / 100%);
}

:deep(.el-dialog__title) {
  color: white;
}

:deep(.head-d) {
  color: #fff;
}

:deep(.el-collapse) {
  border: none;
}

:deep(.el-collapse-item__header) {
  margin-top: 10px;
  background-color: transparent;
  border-radius: 5px 5px 0 0;
}

:deep(.el-collapse-item__wrap) {
  background-color: transparent;
  border: none;
  border-radius: 0 0 5px 5px;
}

:deep(.el-table--border .el-table__cell) {
  border-right: #002d68 !important;
}

:deep(.el-scrollbar__wrap--hidden-default) {
  color: #002d68;
  scrollbar-width: none;
  background-color: transparent;
}

:deep(.el-collapse-item:last-child) {
  margin: 0;
}

:deep(.el-form-item__label) {
  color: white;
}

:deep(.el-input__count) {
  background: unset !important;
}

:deep(.el-input__inner),
:deep(.el-textarea__inner),
:deep(.el-select__selected-item),
:deep(.el-range-input),
:deep(.el-range-separator) {
  color: white !important;
}

:deep(.el-select__placeholder.is-transparent) {
  color: var(--el-text-color-placeholder) !important;
}

:deep(.text-foreground) {
  color: white;
}

.content-bh {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

:deep(.el-checkbox) {
  margin-right: 15px;
}

/* :deep(.el-checkbox__input) {
  border: 1px solid #78d2ff;
  border-radius: 50%;
} */

:deep(.el-checkbox__label) {
  color: #d9f0ff;
}

:deep(.el-checkbox__input .el-checkbox__inner) {
  background-color: transparent;
  border: 1px solid #78d2ff;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: transparent;
}

/* :deep(.el-checkbox__input.is-checked .el-checkbox__inner::after) {
  width: 11px;
  height: 11px;
  background-color: #78d2ff;
  border-radius: 50%;
  position: absolute;
  left: 0px;
  top: 0px;
} */

:deep(.el-checkbox.is-checked .el-checkbox__label) {
  color: #d9f0ff;
}
</style>
<style>
.no-margin {
  margin-top: 0 !important;
}
</style>
