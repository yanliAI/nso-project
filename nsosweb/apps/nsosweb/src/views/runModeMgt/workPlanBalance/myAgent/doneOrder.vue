<template>
  <div>
    <el-tabs v-model="editableTabsValue" type="card" class="demo-tabs" @tab-remove="removeTab">
      <el-tab-pane v-for="item in editableTabs" :key="item.name" :label="item.title" :name="item.name" :closable="item.name !== '1'">
        <div v-if="item.name === '1'">
          <el-container>
            <el-form :inline="true" :model="queryForm" label-position="right" style="padding: 0px 20px 0">
              <el-form-item label="工单号:">
                <el-input v-model="queryForm.oid" clearable maxlength="50" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :icon="Search" @click="query">查询</el-button>
                <el-button type="info" @click="reset">重置</el-button>
              </el-form-item>
            </el-form>
            <el-main>
              <el-table border stripe ref="table" :data="tableData" @selection-change="handleSelectionChange" style="width: 100%; height: 680px">
                <el-table-column type="index" align="center" />
                <el-table-column prop="oid" label="工单号" align="center">
                  <template #default="scope">
                    <span style="color: #0000ed; cursor: pointer" @click="addTab(scope.row.oid, scope.row.id, scope.row.procname)">{{ scope.row.oid }}</span>
                  </template>
                </el-table-column>

                <el-table-column prop="procname" label="业务类型" align="center"> </el-table-column>

                <el-table-column prop="title" label="标题" align="center">
                  <template #default="scope">
                    <el-tooltip effect="light" :content="scope.row.title" placement="bottom" popper-class="custom-tooltip">
                      <span class="max-lines">{{ scope.row.title }}</span>
                    </el-tooltip>
                  </template>
                </el-table-column>

                <el-table-column prop="runame" label="提出人" align="center" />

                <el-table-column prop="title" label="提出部门" align="center">
                  <template #default="scope">
                    <el-tooltip effect="light" :content="scope.row.rdname" placement="bottom" popper-class="custom-tooltip">
                      <span class="max-lines">{{ scope.row.rdname }}</span>
                    </el-tooltip>
                  </template>
                </el-table-column>

                <el-table-column prop="creator" label="创建人" align="center" />
                <el-table-column prop="cdepname" label="创建部门" align="center">
                  <template #default="scope">
                    <el-tooltip effect="light" :content="scope.row.cdepname" placement="bottom" popper-class="custom-tooltip">
                      <span class="max-lines">{{ scope.row.cdepname }}</span>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column prop="taskname" label="参与节点" align="center"></el-table-column>
                <el-table-column prop="createdtime" label="待办生成时间" align="center"></el-table-column>
                <el-table-column align="center" label="操作">
                  <template #default="scope">
                    <el-button type="primary" link @click="rollbackTasks(scope.row)">撤回</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-main>
            <el-footer>
              <el-pagination :current-page="currentPage" :page-size="pageSize" :total="total" @size-change="handleSizeChange" @current-change="handlePageChange" :page-sizes="[20, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
            </el-footer>
          </el-container>
        </div>
        <div v-else>
          <pageControl :key="item.name" sourceType="1" :orderType="item.orderType" :oid="item.name" :tid="item.tid"></pageControl>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { ElTable, ElTableColumn, ElFormItem, ElPopconfirm, ElForm, ElInput, ElButton, ElSelect, ElOption, ElPagination, ElContainer, ElHeader, ElMain, ElFooter, ElDialog, ElMessage, ElMessageBox, ElText, ElLink, ElTag, ElTooltip } from 'element-plus'
import { Search, Download, Aim, CircleCheck, Setting } from '@element-plus/icons-vue'
import { Page } from '@vben/common-ui'
import { ref, reactive, provide, watch, computed, onMounted } from 'vue'
import { getydTodoTasksApi, rollbackTasksApi } from '#/api'
import pageControl from './pageControl.vue'
import { useRouter } from 'vue-router'
import { useAccessStore, useUserStore } from '@vben/stores'
const emit = defineEmits(['custom-event', 'sendCount'])
const router = useRouter()
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)
const table = ref(null)
const tableData = ref([])
const selectedRows = ref([])
const userStore = useUserStore()
const queryForm = reactive({
  oid: ''
})

// tab参数
const editableTabsValue = ref('1')
const editableTabs = ref([
  {
    title: '全部记录',
    name: '1',
    content: 'Tab 1 content'
  }
])

// 祖先参数，工单提交，应刷新全部记录tab页
const submitState = ref('wait')
provide('submitState', submitState)

watch(submitState, (newData) => {
  if (newData === 'success') {
    // 删除当前tab页，跳转至全部记录页
    let deleteTab = editableTabsValue.value
    const tabs = editableTabs.value
    editableTabsValue.value = '1'
    editableTabs.value = tabs.filter((tab) => tab.name !== deleteTab)
    query()
    submitState.value = 'wait'
  }
})

// chenxiao3@csg.cn
// {
//   key: 'taskname',
//   value: '方式审核',
//   type: 'like'
// }

const response = {
    "code": 0,
    "count": 258,
    "data": [
        {
            "cdepid": "218607-0049",
            "cdepname": "南方电网数字电网集团有限公司\\南方电网数字电网研究院股份有限公司\\数字运营公司\\架构运营事业部",
            "choice": 0,
            "content": "",
            "createdtime": "2025-11-04 14:53:18",
            "createid": "huanght1@csg.cn",
            "creator": "黄洪涛",
            "depid": "2133-0002",
            "depname": "南方电网数字电网集团有限公司\\运调中心\\运行调度分部",
            "e1": 0,
            "e2": 0,
            "e3": 0,
            "e4": 0,
            "extinfo": "{}",
            "extinfoJson": {},
            "gidx": 0,
            "gqtime": 0,
            "handleTime": 0,
            "id": 170610954,
            "idate": 20251104,
            "lastContent": "请审查。",
            "lastTaskId": 47127277,
            "lastTaskName": "形式审查",
            "limitStatus": 0,
            "mid": 109,
            "oid": "INMC-00-20251103-00381-piYYe",
            "orderOvertime": 0,
            "orderReturn": 2,
            "orderWarn": 0,
            "pid": 14709281,
            "procname": "并网管控",
            "proctime": 0,
            "rdept": 962839,
            "rdname": "南方电网数字电网集团有限公司\\南方电网数字电网研究院股份有限公司\\数字运营公司\\架构运营事业部",
            "refid": 0,
            "result": "",
            "retime": 0,
            "runame": "黄洪涛",
            "runit": 189459,
            "runtype": 0,
            "runtypeName": "已办结",
            "ruser": "huanght1@csg.cn",
            "sdept": 962839,
            "sdname": "南方电网数字电网集团有限公司\\南方电网数字电网研究院股份有限公司\\数字运营公司\\架构运营事业部",
            "state": 0,
            "status": 1,
            "statusString": "处理中",
            "suname": "黄洪涛",
            "sunit": 189459,
            "suser": "huanght1@csg.cn",
            "taskid": 47137361,
            "tasklink": 3,
            "taskname": "调度审查",
            "tid": 0,
            "timeoutTimes": 0,
            "title": "电网管理平台（新兴业务域）-电网管理平台（新兴业务域）-并网前期(规划立项)阶段",
            "type": 0,
            "unit": 189412,
            "urge": 0,
            "userid": "liuxi@csg.cn",
            "username": "刘溪",
            "warnTimes": 0
        },
        {
            "cdepid": "218607-0046",
            "cdepname": "南方电网数字电网集团有限公司\\南方电网数字电网研究院股份有限公司\\数字运营公司\\行政合规事业部",
            "choice": 0,
            "content": "",
            "createdtime": "2025-11-04 13:50:29",
            "createid": "keky@csg.cn",
            "creator": "柯康银",
            "depid": "2133-0002",
            "depname": "南方电网数字电网集团有限公司\\运调中心\\运行调度分部",
            "e1": 0,
            "e2": 0,
            "e3": 0,
            "e4": 1,
            "extinfo": "{}",
            "extinfoJson": {},
            "gidx": 0,
            "gqtime": 0,
            "handleTime": 0,
            "id": 170587940,
            "idate": 20251104,
            "lastContent": "公告已发布。",
            "lastTaskId": 47113817,
            "lastTaskName": "发布作业公告",
            "limitStatus": 0,
            "mid": 879,
            "oid": "CMWT-00-20251103-00403-MkCl0",
            "orderOvertime": 0,
            "orderReturn": 2,
            "orderWarn": 0,
            "pid": 14709805,
            "procname": "信息两票",
            "proctime": 0,
            "rdept": 962835,
            "rdname": "南方电网数字电网集团有限公司\\南方电网数字电网研究院股份有限公司\\数字运营公司\\行政合规事业部",
            "refid": 0,
            "result": "",
            "retime": 0,
            "runame": "柯康银",
            "runit": 189459,
            "runtype": 0,
            "runtypeName": "已办结",
            "ruser": "keky@csg.cn",
            "sdept": 962835,
            "sdname": "南方电网数字电网集团有限公司\\南方电网数字电网研究院股份有限公司\\数字运营公司\\行政合规事业部",
            "state": 0,
            "status": 1,
            "statusString": "处理中",
            "suname": "柯康银",
            "sunit": 189459,
            "suser": "keky@csg.cn",
            "taskid": 47133236,
            "tasklink": 8,
            "taskname": "运调许可",
            "tid": 0,
            "timeoutTimes": 0,
            "title": "【运行方式】行政办公绿色低碳能源管理应用系统运行方式调整作业",
            "type": 0,
            "unit": 189412,
            "urge": 0,
            "userid": "liuxi@csg.cn",
            "username": "刘溪",
            "warnTimes": 0
        },
        {
            "cdepid": "218604-0036",
            "cdepname": "南方电网数字电网集团有限公司\\南方电网数字电网研究院股份有限公司\\数字电网科技公司\\系统运营部",
            "choice": 0,
            "content": "",
            "createdtime": "2025-11-04 13:50:10",
            "createid": "licr3@csg.cn",
            "creator": "李长荣",
            "depid": "2133-0002",
            "depname": "南方电网数字电网集团有限公司\\运调中心\\运行调度分部",
            "e1": 0,
            "e2": 0,
            "e3": 0,
            "e4": 1,
            "extinfo": "{}",
            "extinfoJson": {},
            "gidx": 0,
            "gqtime": 0,
            "handleTime": 0,
            "id": 170587862,
            "idate": 20251104,
            "lastContent": "已按照审批意见发布公告。",
            "lastTaskId": 47122315,
            "lastTaskName": "发布作业公告",
            "limitStatus": 0,
            "mid": 879,
            "oid": "CMWT-00-20251103-00076-zuubZ",
            "orderOvertime": 0,
            "orderReturn": 2,
            "orderWarn": 0,
            "pid": 14701378,
            "procname": "信息两票",
            "proctime": 0,
            "rdept": 189410,
            "rdname": "南方电网数字电网集团有限公司\\南方电网数字电网研究院股份有限公司\\数字电网科技公司\\系统运营部",
            "refid": 0,
            "result": "",
            "retime": 0,
            "runame": "李长荣",
            "runit": 189391,
            "runtype": 0,
            "runtypeName": "已办结",
            "ruser": "licr3@csg.cn",
            "sdept": 189410,
            "sdname": "南方电网数字电网集团有限公司\\南方电网数字电网研究院股份有限公司\\数字电网科技公司\\系统运营部",
            "state": 0,
            "status": 1,
            "statusString": "处理中",
            "suname": "李长荣",
            "sunit": 189391,
            "suser": "licr3@csg.cn",
            "taskid": 47133227,
            "tasklink": 8,
            "taskname": "运调许可",
            "tid": 0,
            "timeoutTimes": 0,
            "title": "网级生产运行支持系统(变电域)-基础功能增量发布作业（版本号为1.0.156）",
            "type": 0,
            "unit": 189412,
            "urge": 0,
            "userid": "liuxi@csg.cn",
            "username": "刘溪",
            "warnTimes": 0
        },
        {
            "cdepid": "218604-0036",
            "cdepname": "南方电网数字电网集团有限公司\\南方电网数字电网研究院股份有限公司\\数字电网科技公司\\系统运营部",
            "choice": 0,
            "content": "",
            "createdtime": "2025-11-04 13:50:01",
            "createid": "licr3@csg.cn",
            "creator": "李长荣",
            "depid": "2133-0002",
            "depname": "南方电网数字电网集团有限公司\\运调中心\\运行调度分部",
            "e1": 0,
            "e2": 0,
            "e3": 0,
            "e4": 1,
            "extinfo": "{}",
            "extinfoJson": {},
            "gidx": 0,
            "gqtime": 0,
            "handleTime": 0,
            "id": 170587850,
            "idate": 20251104,
            "lastContent": "已按照审批意见发布公告。",
            "lastTaskId": 47122496,
            "lastTaskName": "发布作业公告",
            "limitStatus": 0,
            "mid": 879,
            "oid": "CMWT-00-20251103-00090-benJD",
            "orderOvertime": 0,
            "orderReturn": 2,
            "orderWarn": 0,
            "pid": 14701855,
            "procname": "信息两票",
            "proctime": 0,
            "rdept": 189410,
            "rdname": "南方电网数字电网集团有限公司\\南方电网数字电网研究院股份有限公司\\数字电网科技公司\\系统运营部",
            "refid": 0,
            "result": "",
            "retime": 0,
            "runame": "李长荣",
            "runit": 189391,
            "runtype": 0,
            "runtypeName": "已办结",
            "ruser": "licr3@csg.cn",
            "sdept": 189410,
            "sdname": "南方电网数字电网集团有限公司\\南方电网数字电网研究院股份有限公司\\数字电网科技公司\\系统运营部",
            "state": 0,
            "status": 1,
            "statusString": "处理中",
            "suname": "李长荣",
            "sunit": 189391,
            "suser": "licr3@csg.cn",
            "taskid": 47133226,
            "tasklink": 8,
            "taskname": "运调许可",
            "tid": 0,
            "timeoutTimes": 0,
            "title": "生产运行支持系统(配电域)-基础功能增量发布作业（版本号为1.0.156）",
            "type": 0,
            "unit": 189412,
            "urge": 0,
            "userid": "liuxi@csg.cn",
            "username": "刘溪",
            "warnTimes": 0
        },
        {
            "cdepid": "218604-0036",
            "cdepname": "南方电网数字电网集团有限公司\\南方电网数字电网研究院股份有限公司\\数字电网科技公司\\系统运营部",
            "choice": 0,
            "content": "",
            "createdtime": "2025-11-04 13:49:11",
            "createid": "liujr1@csg.cn",
            "creator": "刘钜荣",
            "depid": "2133-0002",
            "depname": "南方电网数字电网集团有限公司\\运调中心\\运行调度分部",
            "e1": 0,
            "e2": 0,
            "e3": 0,
            "e4": 1,
            "extinfo": "{}",
            "extinfoJson": {},
            "gidx": 0,
            "gqtime": 0,
            "handleTime": 0,
            "id": 170587766,
            "idate": 20251104,
            "lastContent": "公告已发布。",
            "lastTaskId": 47122439,
            "lastTaskName": "发布作业公告",
            "limitStatus": 0,
            "mid": 879,
            "oid": "CMWT-00-20251103-00032-6ovb2",
            "orderOvertime": 0,
            "orderReturn": 2,
            "orderWarn": 0,
            "pid": 14700172,
            "procname": "信息两票",
            "proctime": 0,
            "rdept": 189410,
            "rdname": "南方电网数字电网集团有限公司\\南方电网数字电网研究院股份有限公司\\数字电网科技公司\\系统运营部",
            "refid": 0,
            "result": "",
            "retime": 0,
            "runame": "刘钜荣",
            "runit": 189391,
            "runtype": 0,
            "runtypeName": "已办结",
            "ruser": "liujr1@csg.cn",
            "sdept": 189410,
            "sdname": "南方电网数字电网集团有限公司\\南方电网数字电网研究院股份有限公司\\数字电网科技公司\\系统运营部",
            "state": 0,
            "status": 1,
            "statusString": "处理中",
            "suname": "刘钜荣",
            "sunit": 189391,
            "suser": "liujr1@csg.cn",
            "taskid": 47133214,
            "tasklink": 8,
            "taskname": "运调许可",
            "tid": 0,
            "timeoutTimes": 0,
            "title": "统一物联网平台电鸿、重构门户十月第三次小版本发布作业计划-版本号V3.1.10（本次版本发布作业不涉及互联网内容，为10月29日延期作业）",
            "type": 0,
            "unit": 189412,
            "urge": 0,
            "userid": "liuxi@csg.cn",
            "username": "刘溪",
            "warnTimes": 0
        },
        {
            "cdepid": "218604-0036",
            "cdepname": "南方电网数字电网集团有限公司\\南方电网数字电网研究院股份有限公司\\数字电网科技公司\\系统运营部",
            "choice": 0,
            "content": "",
            "createdtime": "2025-11-04 13:49:01",
            "createid": "licr3@csg.cn",
            "creator": "李长荣",
            "depid": "2133-0002",
            "depname": "南方电网数字电网集团有限公司\\运调中心\\运行调度分部",
            "e1": 0,
            "e2": 0,
            "e3": 0,
            "e4": 1,
            "extinfo": "{}",
            "extinfoJson": {},
            "gidx": 0,
            "gqtime": 0,
            "handleTime": 0,
            "id": 170587752,
            "idate": 20251104,
            "lastContent": "公告已发布。",
            "lastTaskId": 47122481,
            "lastTaskName": "发布作业公告",
            "limitStatus": 0,
            "mid": 879,
            "oid": "CMWT-00-20251103-00105-DL7hK",
            "orderOvertime": 0,
            "orderReturn": 2,
            "orderWarn": 0,
            "pid": 14702184,
            "procname": "信息两票",
            "proctime": 0,
            "rdept": 189410,
            "rdname": "南方电网数字电网集团有限公司\\南方电网数字电网研究院股份有限公司\\数字电网科技公司\\系统运营部",
            "refid": 0,
            "result": "",
            "retime": 0,
            "runame": "李长荣",
            "runit": 189391,
            "runtype": 0,
            "runtypeName": "已办结",
            "ruser": "licr3@csg.cn",
            "sdept": 189410,
            "sdname": "南方电网数字电网集团有限公司\\南方电网数字电网研究院股份有限公司\\数字电网科技公司\\系统运营部",
            "state": 0,
            "status": 1,
            "statusString": "处理中",
            "suname": "李长荣",
            "sunit": 189391,
            "suser": "licr3@csg.cn",
            "taskid": 47133211,
            "tasklink": 8,
            "taskname": "运调许可",
            "tid": 0,
            "timeoutTimes": 0,
            "title": "网级生产运行支持系统(输电域)-智能感知功能增量发布作业（版本号为1.0.156）",
            "type": 0,
            "unit": 189412,
            "urge": 0,
            "userid": "liuxi@csg.cn",
            "username": "刘溪",
            "warnTimes": 0
        },
        {
            "cdepid": "218607-0017-0005-0007",
            "cdepname": "南方电网数字电网集团有限公司\\南方电网数字电网研究院股份有限公司\\数字运营公司\\研究中心\\项目管理办公室\\企业架构及全面质量管理项目组",
            "choice": 0,
            "content": "",
            "createdtime": "2025-11-04 13:48:49",
            "createid": "caoqing@csg.cn",
            "creator": "曹青",
            "depid": "2133-0002",
            "depname": "南方电网数字电网集团有限公司\\运调中心\\运行调度分部",
            "e1": 0,
            "e2": 0,
            "e3": 0,
            "e4": 1,
            "extinfo": "{}",
            "extinfoJson": {},
            "gidx": 0,
            "gqtime": 0,
            "handleTime": 0,
            "id": 170587737,
            "idate": 20251104,
            "lastContent": "公告已发布。",
            "lastTaskId": 47113064,
            "lastTaskName": "发布作业公告",
            "limitStatus": 0,
            "mid": 879,
            "oid": "CMWT-00-20251031-00432-DzXOb",
            "orderOvertime": 0,
            "orderReturn": 2,
            "orderWarn": 0,
            "pid": 14694047,
            "procname": "信息两票",
            "proctime": 0,
            "rdept": 947616,
            "rdname": "南方电网数字电网集团有限公司\\南方电网数字电网研究院股份有限公司\\数字运营公司\\研究中心\\项目管理办公室\\企业架构及全面质量管理项目组",
            "refid": 0,
            "result": "",
            "retime": 0,
            "runame": "曹青",
            "runit": 189459,
            "runtype": 0,
            "runtypeName": "已办结",
            "ruser": "caoqing@csg.cn",
            "sdept": 947616,
            "sdname": "南方电网数字电网集团有限公司\\南方电网数字电网研究院股份有限公司\\数字运营公司\\研究中心\\项目管理办公室\\企业架构及全面质量管理项目组",
            "state": 0,
            "status": 1,
            "statusString": "处理中",
            "suname": "曹青",
            "sunit": 189459,
            "suser": "caoqing@csg.cn",
            "taskid": 47133209,
            "tasklink": 8,
            "taskname": "运调许可",
            "tid": 0,
            "timeoutTimes": 0,
            "title": "云燕平台企业架构管理系统V2.2.59小版本发布计划",
            "type": 0,
            "unit": 189412,
            "urge": 0,
            "userid": "liuxi@csg.cn",
            "username": "刘溪",
            "warnTimes": 0
        },
        {
            "cdepid": "218609-0006",
            "cdepname": "南方电网数字电网集团有限公司\\南方电网数字电网研究院股份有限公司\\人工智能公司\\平台技术事业部",
            "choice": 0,
            "content": "",
            "createdtime": "2025-11-04 13:48:09",
            "createid": "renzg@csg.cn",
            "creator": "任正国",
            "depid": "2133-0002",
            "depname": "南方电网数字电网集团有限公司\\运调中心\\运行调度分部",
            "e1": 0,
            "e2": 0,
            "e3": 0,
            "e4": 1,
            "extinfo": "{}",
            "extinfoJson": {},
            "gidx": 0,
            "gqtime": 0,
            "handleTime": 0,
            "id": 170587667,
            "idate": 20251104,
            "lastContent": "同意",
            "lastTaskId": 47117498,
            "lastTaskName": "工作票签发",
            "limitStatus": 0,
            "mid": 879,
            "oid": "CMWT-00-20251030-00537-emAZu",
            "orderOvertime": 0,
            "orderReturn": 2,
            "orderWarn": 0,
            "pid": 14682975,
            "procname": "信息两票",
            "proctime": 0,
            "rdept": 97845,
            "rdname": "南方电网数字电网集团有限公司\\南方电网数字电网研究院股份有限公司\\人工智能公司\\平台技术事业部",
            "refid": 0,
            "result": "",
            "retime": 0,
            "runame": "任正国",
            "runit": 189465,
            "runtype": 0,
            "runtypeName": "已办结",
            "ruser": "renzg@csg.cn",
            "sdept": 97845,
            "sdname": "南方电网数字电网集团有限公司\\南方电网数字电网研究院股份有限公司\\人工智能公司\\平台技术事业部",
            "state": 0,
            "status": 1,
            "statusString": "处理中",
            "suname": "任正国",
            "sunit": 189465,
            "suser": "renzg@csg.cn",
            "taskid": 47133196,
            "tasklink": 8,
            "taskname": "运调许可",
            "tid": 0,
            "timeoutTimes": 0,
            "title": "电力行业人工智能创新平台自研平台服务器上架、安装系统和调试算力服务器作业",
            "type": 0,
            "unit": 189412,
            "urge": 0,
            "userid": "liuxi@csg.cn",
            "username": "刘溪",
            "warnTimes": 0
        },
        {
            "cdepid": "2112-0014",
            "cdepname": "南方电网数字电网集团有限公司\\信通公司\\合作伙伴",
            "choice": 0,
            "content": "",
            "createdtime": "2025-11-04 11:20:36",
            "createid": "wangwen2@csg.cn",
            "creator": "王稳",
            "depid": "2133-0002",
            "depname": "南方电网数字电网集团有限公司\\运调中心\\运行调度分部",
            "e1": 0,
            "e2": 0,
            "e3": 0,
            "e4": 1,
            "extinfo": "{}",
            "extinfoJson": {},
            "gidx": 0,
            "gqtime": 0,
            "handleTime": 0,
            "id": 170554818,
            "idate": 20251104,
            "lastContent": "同意",
            "lastTaskId": 47125242,
            "lastTaskName": "工作票签发",
            "limitStatus": 0,
            "mid": 879,
            "oid": "CMWT-00-20251031-00253-2JeA0",
            "orderOvertime": 0,
            "orderReturn": 2,
            "orderWarn": 0,
            "pid": 14690645,
            "procname": "信息两票",
            "proctime": 0,
            "rdept": 100163,
            "rdname": "南方电网数字电网集团有限公司\\信通公司\\合作伙伴",
            "refid": 0,
            "result": "",
            "retime": 0,
            "runame": "王稳",
            "runit": 44752,
            "runtype": 0,
            "runtypeName": "已办结",
            "ruser": "wangwen2@csg.cn",
            "sdept": 100163,
            "sdname": "南方电网数字电网集团有限公司\\信通公司\\合作伙伴",
            "state": 0,
            "status": 1,
            "statusString": "处理中",
            "suname": "王稳",
            "sunit": 44752,
            "suser": "wangwen2@csg.cn",
            "taskid": 47128082,
            "tasklink": 8,
            "taskname": "运调许可",
            "tid": 0,
            "timeoutTimes": 0,
            "title": "综合基地服务器软硬件消缺作业计划",
            "type": 0,
            "unit": 189412,
            "urge": 0,
            "userid": "liuxi@csg.cn",
            "username": "刘溪",
            "warnTimes": 0
        },
        {
            "cdepid": "2112-0014",
            "cdepname": "南方电网数字电网集团有限公司\\信通公司\\合作伙伴",
            "choice": 0,
            "content": "",
            "createdtime": "2025-11-04 11:12:05",
            "createid": "liangxiang@csg.cn",
            "creator": "梁湘",
            "depid": "2133-0002",
            "depname": "南方电网数字电网集团有限公司\\运调中心\\运行调度分部",
            "e1": 0,
            "e2": 0,
            "e3": 0,
            "e4": 1,
            "extinfo": "{}",
            "extinfoJson": {},
            "gidx": 0,
            "gqtime": 0,
            "handleTime": 0,
            "id": 170549838,
            "idate": 20251104,
            "lastContent": "同意",
            "lastTaskId": 47117547,
            "lastTaskName": "工作票签发",
            "limitStatus": 0,
            "mid": 879,
            "oid": "CMWT-00-20251031-00272-bmeJ5",
            "orderOvertime": 0,
            "orderReturn": 2,
            "orderWarn": 0,
            "pid": 14690808,
            "procname": "信息两票",
            "proctime": 0,
            "rdept": 100163,
            "rdname": "南方电网数字电网集团有限公司\\信通公司\\合作伙伴",
            "refid": 0,
            "result": "",
            "retime": 0,
            "runame": "梁湘",
            "runit": 44752,
            "runtype": 0,
            "runtypeName": "已办结",
            "ruser": "liangxiang@csg.cn",
            "sdept": 100163,
            "sdname": "南方电网数字电网集团有限公司\\信通公司\\合作伙伴",
            "state": 0,
            "status": 1,
            "statusString": "处理中",
            "suname": "梁湘",
            "sunit": 44752,
            "suser": "liangxiang@csg.cn",
            "taskid": 47127216,
            "tasklink": 8,
            "taskname": "运调许可",
            "tid": 0,
            "timeoutTimes": 0,
            "title": "开发区服务器软硬件消缺作业计划",
            "type": 0,
            "unit": 189412,
            "urge": 0,
            "userid": "liuxi@csg.cn",
            "username": "刘溪",
            "warnTimes": 0
        },
        {
            "cdepid": "218607-0046",
            "cdepname": "南方电网数字电网集团有限公司\\南方电网数字电网研究院股份有限公司\\数字运营公司\\行政合规事业部",
            "choice": 0,
            "content": "",
            "createdtime": "2025-11-04 10:37:19",
            "createid": "yezx2@csg.cn",
            "creator": "叶长鑫",
            "depid": "2133-0002",
            "depname": "南方电网数字电网集团有限公司\\运调中心\\运行调度分部",
            "e1": 0,
            "e2": 0,
            "e3": 0,
            "e4": 1,
            "extinfo": "{}",
            "extinfoJson": {},
            "gidx": 0,
            "gqtime": 0,
            "handleTime": 0,
            "id": 170530223,
            "idate": 20251104,
            "lastTaskId": 47115960,
            "lastTaskName": "两票填报",
            "limitStatus": 0,
            "mid": 879,
            "oid": "CMWT-00-20251031-00321-2XCpm",
            "orderOvertime": 0,
            "orderReturn": 2,
            "orderWarn": 0,
            "pid": 14691394,
            "procname": "信息两票",
            "proctime": 0,
            "rdept": 962835,
            "rdname": "南方电网数字电网集团有限公司\\南方电网数字电网研究院股份有限公司\\数字运营公司\\行政合规事业部",
            "refid": 0,
            "result": "",
            "retime": 0,
            "runame": "叶长鑫",
            "runit": 189459,
            "runtype": 0,
            "runtypeName": "已办结",
            "ruser": "yezx2@csg.cn",
            "sdept": 962835,
            "sdname": "南方电网数字电网集团有限公司\\南方电网数字电网研究院股份有限公司\\数字运营公司\\行政合规事业部",
            "state": 0,
            "status": 1,
            "statusString": "处理中",
            "suname": "叶长鑫",
            "sunit": 189459,
            "suser": "yezx2@csg.cn",
            "taskid": 47123884,
            "tasklink": 8,
            "taskname": "运调许可",
            "tid": 0,
            "timeoutTimes": 0,
            "title": "协同办公系统版本发布作业计划V2.1.0.8",
            "type": 0,
            "unit": 189412,
            "urge": 0,
            "userid": "liuxi@csg.cn",
            "username": "刘溪",
            "warnTimes": 0
        },
        {
            "cdepid": "218608-0002-0005",
            "cdepname": "南方电网数字电网集团有限公司\\南方电网数字电网研究院股份有限公司\\电算工程公司\\数据中心事业部\\运维组",
            "choice": 0,
            "content": "",
            "createdtime": "2025-11-04 10:36:34",
            "createid": "huangzf2@csg.cn",
            "creator": "黄遵峰",
            "depid": "2133-0002",
            "depname": "南方电网数字电网集团有限公司\\运调中心\\运行调度分部",
            "e1": 0,
            "e2": 0,
            "e3": 0,
            "e4": 1,
            "extinfo": "{}",
            "extinfoJson": {},
            "gidx": 0,
            "gqtime": 0,
            "handleTime": 0,
            "id": 170529768,
            "idate": 20251104,
            "lastContent": "同意，请注意作业风险管控",
            "lastTaskId": 47117400,
            "lastTaskName": "工作票签发",
            "limitStatus": 0,
            "mid": 879,
            "oid": "CMWT-00-20251103-00200-FXtom",
            "orderOvertime": 0,
            "orderReturn": 2,
            "orderWarn": 0,
            "pid": 14704325,
            "procname": "信息两票",
            "proctime": 0,
            "rdept": 904119,
            "rdname": "南方电网数字电网集团有限公司\\南方电网数字电网研究院股份有限公司\\电算工程公司\\数据中心事业部\\运维组",
            "refid": 0,
            "result": "",
            "retime": 0,
            "runame": "黄遵峰",
            "runit": 189462,
            "runtype": 0,
            "runtypeName": "已办结",
            "ruser": "huangzf2@csg.cn",
            "sdept": 904119,
            "sdname": "南方电网数字电网集团有限公司\\南方电网数字电网研究院股份有限公司\\电算工程公司\\数据中心事业部\\运维组",
            "state": 0,
            "status": 1,
            "statusString": "处理中",
            "suname": "黄遵峰",
            "sunit": 189462,
            "suser": "huangzf2@csg.cn",
            "taskid": 47123824,
            "tasklink": 8,
            "taskname": "运调许可",
            "tid": 0,
            "timeoutTimes": 0,
            "title": "棠下数据中心UPS蓄电池更换作业",
            "type": 0,
            "unit": 189412,
            "urge": 0,
            "userid": "liuxi@csg.cn",
            "username": "刘溪",
            "warnTimes": 0
        },
        {
            "cdepid": "2112-0005",
            "cdepname": "南方电网数字电网集团有限公司\\信通公司\\网络安全事业部",
            "choice": 0,
            "content": "",
            "createdtime": "2025-11-04 10:23:25",
            "createid": "zengzf@csg.cn",
            "creator": "曾子峰",
            "depid": "2133-0002",
            "depname": "南方电网数字电网集团有限公司\\运调中心\\运行调度分部",
            "e1": 0,
            "e2": 0,
            "e3": 0,
            "e4": 1,
            "extinfo": "{}",
            "extinfoJson": {},
            "gidx": 0,
            "gqtime": 0,
            "handleTime": 0,
            "id": 170520772,
            "idate": 20251104,
            "lastContent": "无需发公告。",
            "lastTaskId": 47114313,
            "lastTaskName": "发布作业公告",
            "limitStatus": 0,
            "mid": 879,
            "oid": "CMWT-00-20251031-00055-l2Lfi",
            "orderOvertime": 0,
            "orderReturn": 2,
            "orderWarn": 0,
            "pid": 14685733,
            "procname": "信息两票",
            "proctime": 0,
            "rdept": 96097,
            "rdname": "南方电网数字电网集团有限公司\\信通公司\\网络安全事业部",
            "refid": 0,
            "result": "",
            "retime": 0,
            "runame": "曾子峰",
            "runit": 44752,
            "runtype": 0,
            "runtypeName": "已办结",
            "ruser": "zengzf@csg.cn",
            "sdept": 96097,
            "sdname": "南方电网数字电网集团有限公司\\信通公司\\网络安全事业部",
            "state": 0,
            "status": 1,
            "statusString": "处理中",
            "suname": "曾子峰",
            "sunit": 44752,
            "suser": "zengzf@csg.cn",
            "taskid": 47122361,
            "tasklink": 8,
            "taskname": "运调许可",
            "tid": 0,
            "timeoutTimes": 0,
            "title": "云盾平台（数据安全管理应用V2.1-分级分类、数据透明加密等）系统分类分级策略优化作业",
            "type": 0,
            "unit": 189412,
            "urge": 0,
            "userid": "liuxi@csg.cn",
            "username": "刘溪",
            "warnTimes": 0
        },
        {
            "cdepid": "218604-0036",
            "cdepname": "南方电网数字电网集团有限公司\\南方电网数字电网研究院股份有限公司\\数字电网科技公司\\系统运营部",
            "choice": 0,
            "content": "",
            "createdtime": "2025-11-04 10:21:57",
            "createid": "guojj@csg.cn",
            "creator": "郭基俊",
            "depid": "2133-0002",
            "depname": "南方电网数字电网集团有限公司\\运调中心\\运行调度分部",
            "e1": 0,
            "e2": 0,
            "e3": 0,
            "e4": 1,
            "extinfo": "{}",
            "extinfoJson": {},
            "gidx": 0,
            "gqtime": 0,
            "handleTime": 0,
            "id": 170519757,
            "idate": 20251104,
            "lastContent": "同意",
            "lastTaskId": 47107153,
            "lastTaskName": "工作票签发",
            "limitStatus": 0,
            "mid": 879,
            "oid": "CMWT-00-20251103-00332-FGpGZ",
            "orderOvertime": 0,
            "orderReturn": 2,
            "orderWarn": 0,
            "pid": 14708104,
            "procname": "信息两票",
            "proctime": 0,
            "rdept": 189410,
            "rdname": "南方电网数字电网集团有限公司\\南方电网数字电网研究院股份有限公司\\数字电网科技公司\\系统运营部",
            "refid": 0,
            "result": "",
            "retime": 0,
            "runame": "郭基俊",
            "runit": 189391,
            "runtype": 0,
            "runtypeName": "已办结",
            "ruser": "guojj@csg.cn",
            "sdept": 189410,
            "sdname": "南方电网数字电网集团有限公司\\南方电网数字电网研究院股份有限公司\\数字电网科技公司\\系统运营部",
            "state": 0,
            "status": 1,
            "statusString": "处理中",
            "suname": "郭基俊",
            "sunit": 189391,
            "suser": "guojj@csg.cn",
            "taskid": 47122167,
            "tasklink": 8,
            "taskname": "运调许可",
            "tid": 0,
            "timeoutTimes": 0,
            "title": "南网智瞰系统服务器重启作业计划",
            "type": 0,
            "unit": 189412,
            "urge": 0,
            "userid": "liuxi@csg.cn",
            "username": "刘溪",
            "warnTimes": 0
        },
        {
            "cdepid": "218607-0047",
            "cdepname": "南方电网数字电网集团有限公司\\南方电网数字电网研究院股份有限公司\\数字运营公司\\营销服务事业部",
            "choice": 0,
            "content": "",
            "createdtime": "2025-11-04 10:11:27",
            "createid": "wanghao6@csg.cn",
            "creator": "王浩",
            "depid": "2133-0002",
            "depname": "南方电网数字电网集团有限公司\\运调中心\\运行调度分部",
            "e1": 0,
            "e2": 0,
            "e3": 0,
            "e4": 1,
            "extinfo": "{}",
            "extinfoJson": {},
            "gidx": 0,
            "gqtime": 0,
            "handleTime": 0,
            "id": 170512263,
            "idate": 20251104,
            "lastContent": "同意",
            "lastTaskId": 47120650,
            "lastTaskName": "工作票签发",
            "limitStatus": 0,
            "mid": 879,
            "oid": "CMWT-00-20251103-00552-YKyTk",
            "orderOvertime": 0,
            "orderReturn": 2,
            "orderWarn": 0,
            "pid": 14713275,
            "procname": "信息两票",
            "proctime": 0,
            "rdept": 962836,
            "rdname": "南方电网数字电网集团有限公司\\南方电网数字电网研究院股份有限公司\\数字运营公司\\营销服务事业部",
            "refid": 0,
            "result": "",
            "retime": 0,
            "runame": "王浩",
            "runit": 189459,
            "runtype": 0,
            "runtypeName": "已办结",
            "ruser": "wanghao6@csg.cn",
            "sdept": 962836,
            "sdname": "南方电网数字电网集团有限公司\\南方电网数字电网研究院股份有限公司\\数字运营公司\\营销服务事业部",
            "state": 0,
            "status": 1,
            "statusString": "处理中",
            "suname": "王浩",
            "sunit": 189459,
            "suser": "wanghao6@csg.cn",
            "taskid": 47121003,
            "tasklink": 8,
            "taskname": "运调许可",
            "tid": 0,
            "timeoutTimes": 0,
            "title": "数字服务平台应用系统2025年11月4日至11月9日数据处理作业",
            "type": 0,
            "unit": 189412,
            "urge": 0,
            "userid": "liuxi@csg.cn",
            "username": "刘溪",
            "warnTimes": 0
        }
    ],
    "index": 1,
    "message": "操作成功",
    "pages": 18,
    "result": true,
    "totalCount": 0
}
/**
 * 查询
 */
const query = async () => {
  try {
    const baseParams = [
      {
        key: 'userid',
        value: userStore.userInfo.logincode,
        type: 'eq'
      },
      {
        key: 'status',
        value: '3',
        type: 'in'
      },
      {
        conditions: [
          {
            conn: 'or',
            conditions: [
              {
                key: 'mid',
                value: 879,
                type: 'eq',
                conn: 'and'
              },
              {
                key: 'taskname',
                value: '方式审核',
                type: 'like',
                conn: 'and'
              }
            ]
          },
          {
            key: 'mid',
            value: 109,
            type: 'eq',
            conn: 'or'
          }
        ]
      }
    ]
    const oidCondition = queryForm.oid ? [{ key: 'oid', type: 'eq', value: queryForm.oid }] : []
    let param = {
      data: {
        orderList: [
          {
            key: 'createdtime',
            order: 'desc'
          },
          {
            key: 'taskname',
            order: 'asc'
          }
        ],
        pageSize: 20,
        pageNum: 1,
        showSwipe: true,
        paramList: [...baseParams, ...oidCondition]
      }
    }
    param.data.pageSize = pageSize.value
    param.data.pageNum = currentPage.value

    tableData.value = response.data
    total.value = response.count
    // const response = await getydTodoTasksApi(param)
    // tableData.value = response.data.data
    // total.value = response.data.count
    emit('sendCount', { count: response.data.count, type: 'done' })

  } catch {}
}

/**
 * 工单撤回
 */
function rollbackTasks(row) {
  ElMessageBox.confirm('确定要撤回本工单吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      rollback(row)
    })
    .catch(() => {
      // ElMessage.info('已取消删除')
    })
}

async function rollback(row) {
  try {
    const res = await rollbackTasksApi({
      data: {
        taskid: row.taskid
      }
    })
    await query()
    ElMessage.success('撤回成功!')
  } catch (error) {}
}

/**
 * 查看工单详情、新增工单详情页
 */

// 新增/跳转详情页
function addTab(targetName: string, id: string, procname: string) {
  const hasTab = editableTabs.value.find((tab) => tab.name === targetName)
  if (hasTab) {
    editableTabsValue.value = targetName
    return
  }

  editableTabs.value.push({
    title: targetName,
    name: targetName,
    orderType: procname,
    tid: id
  })
  editableTabsValue.value = targetName
}

// 删除tab页
function removeTab(targetName: TabPaneName) {
  const tabs = editableTabs.value
  let activeName = editableTabsValue.value
  if (activeName === targetName) {
    tabs.forEach((tab, index) => {
      if (tab.name === targetName) {
        const nextTab = tabs[index + 1] || tabs[index - 1]
        if (nextTab) {
          activeName = nextTab.name
        }
      }
    })
  }
  editableTabsValue.value = activeName
  editableTabs.value = tabs.filter((tab) => tab.name !== targetName)
}

/**
 * 跳转
 * @param oid          // 工单号
 * @param tid         // id
 * @param procname   // 业务类型
 */
// const toWorkOrderDetail = (oid, tid, procname) => {
//   if(procname==='并网管控'){
//       router.push({
//         path: '/gridConnectionAnalysis/gridOrderDetails',
//         query: { oid: oid, tid:tid, type: '3' }
//       })
//   } else{
//     router.push({
//       path: '/workPlanBalance/jobInfo',
//       query: { oid: oid, tid:tid, type: '3' }
//     })

//   }
// }

const reset = () => {
  queryForm.oid = ''
  query()
}

const handleSelectionChange = (val) => {
  selectedRows.value = val
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  query()
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  query()
}

onMounted(() => {
  query()
})
defineExpose({query})
</script>

<style scoped>
:deep(.el-tabs__header) {
  margin: 0 0 15px !important;
}
.el-main {
  padding-top: 0;
}
.cell {
  text-align: center;
}
.max-lines {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /* 限制显示行数 */
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
