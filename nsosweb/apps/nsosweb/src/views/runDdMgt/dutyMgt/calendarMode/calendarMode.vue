<template>
  <Page auto-content-height>
    <div class="w-full h-full bg-white">
      <div class="h-[53px] pt-[10px]">
        <el-form label-width="100px" ref="ruleFormRef" :model="data.formData" :inline="true" label-position="right" class="demo-form-inline">
          <el-row>
            <el-col :span="4">
              <el-form-item label="排班模式:">
                <el-select v-model="data.formData.pbModal" @change="pbChange" filterable clearable>
                  <el-option v-for="item in dropList.NSOS_PB_MODAL" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="排班日期:" filterable clearable>
                <el-date-picker v-model="data.formData.pbTime" @change="rqChange" type="daterange" value-format="YYYY-MM-DD" start-placeholder="开始时间" end-placeholder="结束时间" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-button type="primary" class="ml-4" :icon="Search" @click="query()">查询</el-button>
              <el-button type="primary" class="ml-4" :icon="Plus" @click="generateClick()">生成</el-button>
            </el-col>
          </el-row>
        </el-form>
        <div class="shoux1 text-center"></div>
      </div>

      <div ref="tableDivRef" v-show="data.formData.pbModal">
        <div :class="{ expand: isExpanded, 'pt-[5px]': !isExpanded }">
          <table class="pb-table">
            <tr v-for="(da, index) in pbData.zzList" :key="'zz' + index">
              <td v-if="index == 0" :rowspan="pbData.zzList.length" class="la">值长：</td>
              <td class="lb">{{ dropList.NSOS_PB_SHIFT.filter((d) => d.value == da.label)[0]?.label }}：</td>
              <td class="lc">
                <el-select v-model="da.p1" multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="1" reserve-keyword clearable filterable>
                  <el-option v-for="item in data.zzDrop" :key="item.loginCode" :label="item.loginName" :value="item.loginCode" />
                </el-select>
              </td>
              <td class="ld">>></td>
              <td class="lc">
                <el-select v-model="da.p2" multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="1" reserve-keyword filterable clearable>
                  <el-option v-for="item in data.zzDrop" :key="item.loginCode" :label="item.loginName" :value="item.loginCode" />
                </el-select>
              </td>
              <td class="ld">>></td>
              <td class="lc">
                <el-select v-model="da.p3" multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="1" reserve-keyword filterable clearable>
                  <el-option v-for="item in data.zzDrop" :key="item.loginCode" :label="item.loginName" :value="item.loginCode" />
                </el-select>
              </td>
              <td class="ld" v-if="data.formData.pbModal == '2' || data.formData.pbModal == '3' || data.formData.pbModal == '5' || data.formData.pbModal == '6'">>></td>
              <td class="lc" v-if="data.formData.pbModal == '2' || data.formData.pbModal == '3' || data.formData.pbModal == '5' || data.formData.pbModal == '6'">
                <el-select v-model="da.p4" multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="1" reserve-keyword filterable clearable>
                  <el-option v-for="item in data.zzDrop" :key="item.loginCode" :label="item.loginName" :value="item.loginCode" />
                </el-select>
              </td>
              <td class="ld" v-if="data.formData.pbModal == '3' || data.formData.pbModal == '6'">>></td>
              <td class="lc" v-if="data.formData.pbModal == '3' || data.formData.pbModal == '6'">
                <el-select v-model="da.p5" multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="1" reserve-keyword filterable clearable>
                  <el-option v-for="item in data.zzDrop" :key="item.loginCode" :label="item.loginName" :value="item.loginCode" />
                </el-select>
              </td>
            </tr>
          </table>
          <table class="pb-table mt-[2px]">
            <tr v-for="(da, index) in pbData.ddList" :key="'zz' + index">
              <td v-if="index == 0" :rowspan="pbData.ddList.length" class="la">运行调度：</td>
              <td class="lb">{{ dropList.NSOS_PB_SHIFT.filter((d) => d.value == da.label)[0]?.label }}：</td>
              <td class="lc">
                <el-select v-model="da.p1" multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="1" reserve-keyword filterable clearable>
                  <el-option v-for="item in data.ydDrop" :key="item.loginCode" :label="item.loginName" :value="item.loginCode" />
                </el-select>
              </td>
              <td class="ld">>></td>
              <td class="lc">
                <el-select v-model="da.p2" multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="1" reserve-keyword filterable clearable>
                  <el-option v-for="item in data.ydDrop" :key="item.loginCode" :label="item.loginName" :value="item.loginCode" />
                </el-select>
              </td>
              <td class="ld">>></td>
              <td class="lc">
                <el-select v-model="da.p3" multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="1" reserve-keyword filterable clearable>
                  <el-option v-for="item in data.ydDrop" :key="item.loginCode" :label="item.loginName" :value="item.loginCode" />
                </el-select>
              </td>
              <td class="ld" v-if="data.formData.pbModal == '2' || data.formData.pbModal == '3' || data.formData.pbModal == '5' || data.formData.pbModal == '6'">>></td>
              <td class="lc" v-if="data.formData.pbModal == '2' || data.formData.pbModal == '3' || data.formData.pbModal == '5' || data.formData.pbModal == '6'">
                <el-select v-model="da.p4" multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="1" reserve-keyword filterable clearable>
                  <el-option v-for="item in data.ydDrop" :key="item.loginCode" :label="item.loginName" :value="item.loginCode" />
                </el-select>
              </td>
              <td class="ld" v-if="data.formData.pbModal == '3' || data.formData.pbModal == '6'">>></td>
              <td class="lc" v-if="data.formData.pbModal == '3' || data.formData.pbModal == '6'">
                <el-select v-model="da.p5" multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="1" reserve-keyword filterable clearable>
                  <el-option v-for="item in data.ydDrop" :key="item.loginCode" :label="item.loginName" :value="item.loginCode" />
                </el-select>
              </td>
            </tr>
          </table>
          <table class="pb-table mt-[2px]">
            <tr v-for="(da, index) in pbData.jcList" :key="'zz' + index">
              <td v-if="index == 0" :rowspan="pbData.jcList.length" class="la">运行监测：</td>
              <td class="lb">{{ dropList.NSOS_PB_SHIFT.filter((d) => d.value == da.label)[0]?.label }}：</td>
              <td class="lc">
                <el-select v-model="da.p1" multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="1" reserve-keyword filterable clearable>
                  <el-option v-for="item in data.yjDrop" :key="item.loginCode" :label="item.loginName" :value="item.loginCode" />
                </el-select>
              </td>
              <td class="ld">>></td>
              <td class="lc">
                <el-select v-model="da.p2" multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="1" reserve-keyword filterable clearable>
                  <el-option v-for="item in data.yjDrop" :key="item.loginCode" :label="item.loginName" :value="item.loginCode" />
                </el-select>
              </td>
              <td class="ld">>></td>
              <td class="lc">
                <el-select v-model="da.p3" multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="1" reserve-keyword filterable clearable>
                  <el-option v-for="item in data.yjDrop" :key="item.loginCode" :label="item.loginName" :value="item.loginCode" />
                </el-select>
              </td>
              <td class="ld" v-if="data.formData.pbModal == '2' || data.formData.pbModal == '3' || data.formData.pbModal == '5' || data.formData.pbModal == '6'">>></td>
              <td class="lc" v-if="data.formData.pbModal == '2' || data.formData.pbModal == '3' || data.formData.pbModal == '5' || data.formData.pbModal == '6'">
                <el-select v-model="da.p4" multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="1" reserve-keyword filterable clearable>
                  <el-option v-for="item in data.yjDrop" :key="item.loginCode" :label="item.loginName" :value="item.loginCode" />
                </el-select>
              </td>
              <td class="ld" v-if="data.formData.pbModal == '3' || data.formData.pbModal == '6'">>></td>
              <td class="lc" v-if="data.formData.pbModal == '3' || data.formData.pbModal == '6'">
                <el-select v-model="da.p5" multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="1" reserve-keyword filterable clearable>
                  <el-option v-for="item in data.yjDrop" :key="item.loginCode" :label="item.loginName" :value="item.loginCode" />
                </el-select>
              </td>
            </tr>
          </table>
        </div>

        <div class="shoux text-center pt-[2px]">
          <span class="primary inline-flex text-[12px] cursor-pointer" @click="isExpanded = !isExpanded"><DArrowRight :class="isExpanded ? 'nhdgx' : 'nhdg'"></DArrowRight>{{ isExpanded ? '展开' : '隐藏' }}</span>
        </div>
      </div>
      <div>
        <el-calendar v-model="calendarvValue">
          <template #date-cell="{ data }">
            <p :class="data.isSelected ? 'is-selected' : ''">
              {{ data.day.split('-')[2] }}
            </p>
            <div class="overflow-y-auto text-[12px]" v-for="(item, index) in curDayData(data.day)" style="height: calc(100% - 18.36px)">
              <div v-if="item.length >= 2" class="flex items-center pb-[4px]">
                <div class="w-[38px]"></div>
                <div :class="item[1].l2 || item[2].l2 || item[3].l2 ? 'mnjhx3' : 'mnjhx2'">{{ item[0].l1 }}</div>
                <div class="mnjhx3" v-if="item[1].l2 || item[2].l2 || item[3].l2">{{ item[0].l2 }}</div>
                <div :class="item[1].l2 || item[2].l2 || item[3].l2 ? 'mnjhx3' : 'mnjhx2'">{{ item[0].l3 }}</div>
              </div>
              <div v-if="item.length >= 2" class="flex items-center pb-[7px]">
                <div class="zzhj">{{ item[1].l0 }}</div>
                <el-tooltip :content="item[1].l1" placement="top">
                  <div :class="item[1].l2 ? 'ujjfg3' : 'ujjfg2'" @click="editPbClick(item[1].s1)">{{ item[1].l1 }}</div>
                </el-tooltip>
                <el-tooltip :content="item[1].l2" placement="top">
                  <div class="ujjfg3" v-if="item[1].l2" @click="editPbClick(item[1].s2)">{{ item[1].l2 }}</div>
                </el-tooltip>
                <el-tooltip :content="item[1].l3" placement="top">
                  <div :class="item[1].l2 ? 'ujjfg3' : 'ujjfg2'" @click="editPbClick(item[1].s3)">{{ item[1].l3 }}</div>
                </el-tooltip>
              </div>
              <div v-if="item.length >= 3" class="flex items-center pb-[7px]">
                <div class="zzhj huj">{{ item[2].l0 }}</div>
                <el-tooltip :content="item[2].l1" placement="top">
                  <div :class="item[2].l2 ? 'ujjfg3' : 'ujjfg2'" @click="editPbClick(item[2].s1)">{{ item[2].l1 }}</div>
                </el-tooltip>
                <el-tooltip :content="item[2].l2" placement="top">
                  <div class="ujjfg3" v-if="item[2].l2" @click="editPbClick(item[2].s2)">{{ item[2].l2 }}</div>
                </el-tooltip>
                <el-tooltip :content="item[2].l3" placement="top">
                  <div :class="item[2].l2 ? 'ujjfg3' : 'ujjfg2'" @click="editPbClick(item[2].s3)">{{ item[2].l3 }}</div>
                </el-tooltip>
              </div>
              <div v-if="item.length >= 4" class="flex items-center">
                <div class="zzhj plj">{{ item[3].l0 }}</div>
                <el-tooltip :content="item[3].l1" placement="top">
                  <div :class="item[3].l2 ? 'ujjfg3' : 'ujjfg2'" @click="editPbClick(item[3].s1)">{{ item[3].l1 }}</div>
                </el-tooltip>
                <el-tooltip :content="item[3].l2" placement="top">
                  <div class="ujjfg3" v-if="item[3].l2" @click="editPbClick(item[3].s2)">{{ item[3].l2 }}</div>
                </el-tooltip>
                <el-tooltip :content="item[3].l3" placement="top">
                  <div :class="item[3].l2 ? 'ujjfg3' : 'ujjfg2'" @click="editPbClick(item[3].s3)">{{ item[3].l3 }}</div>
                </el-tooltip>
              </div>
            </div>
          </template>
        </el-calendar>
      </div>
    </div>
    <Modal class="w-[450px] h-[355px] top-[25vh]" title="编辑排班人员" :footer="false" :closeOnClickModal="false" :draggable="true" headerClass="head-md">
      <el-tabs v-model="data.tabIndex" ref="myTab" type="card" @tab-change="tabChange" class="w-full h-full bg-white">
        <el-tab-pane v-for="(item,index) in data.curPbList" :key="index" :label="item.dutyName" :name="index">
          <el-form label-width="100px" ref="ruleFormRef" :model="data.curPb" :inline="true" label-position="right" class="demo-form-inline mt-1">
            <el-row>
              <el-col :span="24">
                <el-form-item label="值班日期:">
                  <el-date-picker v-model="data.curPb.dutyRiqi" value-format="YYYY-MM-DD" type="date" disabled />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="值班班次:">
                  <el-select v-model="data.curPb.dutyShift" disabled clearable>
                    <el-option v-for="item in dropList.NSOS_PB_SHIFT" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="值班岗位:">
                  <el-select v-model="data.curPb.postType" disabled clearable>
                    <el-option v-for="item in dropList.NSOS_PB_POST" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="值班人员:">
                  <el-select v-if="data.curPb.postType == '1'" v-model="data.curPb.rmpCode" filterable>
                    <el-option v-for="item in data.zzDrop" :key="item.loginCode" :label="item.loginName" :value="item.loginCode" />
                  </el-select>
                  <el-select v-if="data.curPb.postType == '2'" v-model="data.curPb.rmpCode" filterable>
                    <el-option v-for="item in data.ydDrop" :key="item.loginCode" :label="item.loginName" :value="item.loginCode" />
                  </el-select>
                  <el-select v-if="data.curPb.postType == '3'" v-model="data.curPb.rmpCode" filterable>
                    <el-option v-for="item in data.yjDrop" :key="item.loginCode" :label="item.loginName" :value="item.loginCode" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div class="text-center pt-[10px] pb-[15px]">
            <el-button type="primary" class="ml-4" :icon="Tickets" @click="saveEditPbData">保存</el-button>
            <el-button type="info" class="ml-4" :icon="Close" @click="modalApi.close()">取消</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </Modal>
  </Page>
</template>
<script setup>
import { Page } from '@vben/common-ui'
import { onMounted, reactive, ref } from 'vue'
import { ElForm, ElCol, ElRow, ElCalendar, ElMessage, ElMessageBox, ElNotification, ElTabs, ElTabPane } from 'element-plus'
import { Search, Plus, DArrowRight, Tickets, Close } from '@element-plus/icons-vue'
import { useDropStore } from '#/store'
import { requestClient } from '#/api/request'
import { formatDate } from '#/utils/commonUtil.ts'
import { useVbenModal } from '@vben/common-ui'

const dropList = reactive({})
const data = reactive({
  curPb: {},
  formData: {},
  caData: [],
  zzDrop: null,
  ydDrop: [],
  yjDrop: [],
  curPbList: [],
  tabIndex: null,
})
const pbData = reactive({
  zzList: [],
  ddList: [],
  jcList: []
})
const isExpanded = ref(false)
const calendarvValue = ref(new Date())
const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close()
  }
})

onMounted(async () => {
  const dropStore = useDropStore()
  let dropType = ['NSOS_USER_NAME', 'NSOS_PB_MODAL', 'NSOS_PB_POST', 'NSOS_PB_SHIFT']
  await dropStore.initDrops(dropType)
  dropStore.get(dropList, dropType)
  initQuery()
})
const initQuery = async () => {
  const { caData, zzDrop, ydDrop, yjDrop } = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/workforceManager/initQueryData')
  data.caData = caData
  data.zzDrop = zzDrop
  data.ydDrop = ydDrop
  data.yjDrop = yjDrop
}
const query = async () => {
  if (!data.formData.pbTime) {
    ElMessage.error('请选择排班日期！')
    return
  }
  calendarvValue.value = new Date(data.formData.pbTime[0])
  data.formData.startDutyRiqi = data.formData.pbTime?.[0]
  data.formData.endDutyRiqi = data.formData.pbTime?.[1]
  data.caData = await requestClient.post(import.meta.env.VITE_NSOSGZ + '/workforceManager/queryData', data.formData)
}
const editPbClick = (item) => {
  data.curPbList = item
  if (item && item.length> 0) {
    data.tabIndex = 0
    data.curPb = item[0]
    data.curPb.dutyRiqi = formatDate(data.curPb.dutyRiqi)
  }
  
  modalApi.open()
}
const saveEditPbData = async () => {
  try {
    await requestClient.post(import.meta.env.VITE_NSOSGZ + '/workforceManager/saveEditPbData', data.curPb)
    if (data.formData.pbTime) {
      query()
    } else {
      initQuery()
    }
    modalApi.close()
    ElNotification({
      title: '提示',
      message: '保存成功！',
      type: 'success'
    })
  } catch {
    ElMessage.error('保存失败！')
  }
}
const curDayData = (dstr) => {
  let zzzalist = data.caData.filter((d) => dstr == formatDate(d.dutyRiqi) && '1' == d.dutyShift && '1' == d.postType)
  let zzzblist = data.caData.filter((d) => dstr == formatDate(d.dutyRiqi) && '2' == d.dutyShift && '1' == d.postType)
  let zzwblist = data.caData.filter((d) => dstr == formatDate(d.dutyRiqi) && '3' == d.dutyShift && '1' == d.postType)

  let ydzalist = data.caData.filter((d) => dstr == formatDate(d.dutyRiqi) && '1' == d.dutyShift && '2' == d.postType)
  let ydzblist = data.caData.filter((d) => dstr == formatDate(d.dutyRiqi) && '2' == d.dutyShift && '2' == d.postType)
  let ydwblist = data.caData.filter((d) => dstr == formatDate(d.dutyRiqi) && '3' == d.dutyShift && '2' == d.postType)

  let yjzalist = data.caData.filter((d) => dstr == formatDate(d.dutyRiqi) && '1' == d.dutyShift && '3' == d.postType)
  let yjzblist = data.caData.filter((d) => dstr == formatDate(d.dutyRiqi) && '2' == d.dutyShift && '3' == d.postType)
  let yjwblist = data.caData.filter((d) => dstr == formatDate(d.dutyRiqi) && '3' == d.dutyShift && '3' == d.postType)

  let rsList = []
  rsList.push({ l0: '', l1: '早班', l2: '中班', l3: '晚班' })
  if (zzzalist.length > 0 && zzwblist.length > 0) {
    let tm = { l0: '值长', l1: '', l2: '', l3: '' }
    if (zzzalist && zzzalist.length > 0) {
      zzzalist.forEach((d) => (tm.l1 += d.dutyName + ';'))
      tm.s1 = zzzalist
    }
    if (zzzblist && zzzblist.length > 0) {
      zzzblist.forEach((d) => (tm.l2 += d.dutyName + ';'))
      tm.s2 = zzzblist
    }
    if (zzwblist && zzwblist.length > 0) {
      zzwblist.forEach((d) => (tm.l3 += d.dutyName + ';'))
      tm.s3 = zzwblist
    }
    rsList.push(tm)
  }
  if (ydzalist.length > 0 && ydwblist.length > 0) {
    let tm1 = { l0: '运调', l1: '', l2: '', l3: '' }
    if (ydzalist && ydzalist.length > 0) {
      ydzalist.forEach((d) => (tm1.l1 += d.dutyName + ';'))
      tm1.s1 = ydzalist
    }
    if (ydzblist && ydzblist.length > 0) {
      ydzblist.forEach((d) => (tm1.l2 += d.dutyName + ';'))
      tm1.s2 = ydzblist
    }
    if (ydwblist && ydwblist.length > 0) {
      ydwblist.forEach((d) => (tm1.l3 += d.dutyName + ';'))
      tm1.s3 = ydwblist
    }
    rsList.push(tm1)
  }
  if (yjzalist.length > 0 && yjwblist.length > 0) {
    let tm2 = { l0: '运监', l1: '', l2: '', l3: '' }
    if (yjzalist && yjzalist.length > 0) {
      yjzalist.forEach((d) => (tm2.l1 += d.dutyName + ';'))
      tm2.s1 = yjzalist
    }
    if (yjzblist && yjzblist.length > 0) {
      yjzblist.forEach((d) => (tm2.l2 += d.dutyName + ';'))
      tm2.s2 = yjzblist
    }
    if (yjwblist && yjwblist.length > 0) {
      yjwblist.forEach((d) => (tm2.l3 += d.dutyName + ';'))
      tm2.s3 = yjwblist
    }
    rsList.push(tm2)
  }

  return [rsList]
}
const isSameMonth = (date1, date2) => {
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth()
}
const rqChange = (r) => {
  if (r) {
    if (!isSameMonth(new Date(r[0]), new Date(r[1]))) {
      data.formData.pbTime = null
      ElMessage.error('排班日期不能跨月选择！')
    }
  }
}
const pbChange = (m) => {
  isExpanded.value = false
  pbData.zzList = []
  pbData.ddList = []
  pbData.jcList = []
  if (m == '1' || m == '2' || m == '3') {
    ;(pbData.zzList = [{ label: '1' }, { label: '3' }]), (pbData.ddList = [{ label: '1' }, { label: '3' }]), (pbData.jcList = [{ label: '1' }, { label: '3' }])
  }
  if (m == '4' || m == '5' || m == '6') {
    ;(pbData.zzList = [{ label: '1' }, { label: '2' }, { label: '3' }]), (pbData.ddList = [{ label: '1' }, { label: '2' }, { label: '3' }]), (pbData.jcList = [{ label: '1' }, { label: '2' }, { label: '3' }])
  }
}
const generateClick = async () => {
  if (!data.formData.pbModal) {
    ElMessage.error('请选择排班模式！')
    return
  }
  if (!data.formData.pbTime) {
    ElMessage.error('请选择排班日期！')
    return
  }
  if (validData(pbData.zzList) == false) {
    ElMessage.error('值长排班存在未填项！所有数据必填！')
    return
  }
  if (validData(pbData.ddList) == false) {
    ElMessage.error('运行调度排班存在未填项！所有数据必填！')
    return
  }
  if (validData(pbData.jcList) == false) {
    ElMessage.error('运行监测排班存在未填项！所有数据必填！')
    return
  }
  try {
    pbData.pbModal = data.formData.pbModal
    pbData.startTime = data.formData.pbTime?.[0]
    pbData.endTime = data.formData.pbTime?.[1]
    await requestClient.post(import.meta.env.VITE_NSOSGZ + '/workforceManager/genPbData', JSON.stringify(pbData))
    query()
    ElNotification({
      title: '提示',
      message: '生成排班数据成功！',
      type: 'success'
    })
  } catch {
    ElMessage.error('生成排班数据失败！')
  }
}
const validData = (list) => {
  let flag = true
  list.forEach((d) => {
    if (data.formData.pbModal == '2' || data.formData.pbModal == '5') {
      flag = d.p1 != null && d.p2 != null && d.p3 != null && d.p4 != null
    } else if (data.formData.pbModal == '3' || data.formData.pbModal == '6') {
      flag = d.p1 != null && d.p2 != null && d.p3 != null && d.p4 != null && d.p5 != null
    } else {
      flag = d.p1 != null && d.p2 != null && d.p3 != null
    }
  })
  return flag
}
const tabChange = (index) => {
  if (data.curPbList) {
    // data.curPbList.forEach(p => {
    //   if (p.id = index) {
    //     data.curPb = p
    //     data.curPb.dutyRiqi = formatDate(data.curPb.dutyRiqi)
    //   }
    // })
    data.curPb = data.curPbList[index]
    data.curPb.dutyRiqi = formatDate(data.curPb.dutyRiqi)
  }
}
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

.el-date-editor.el-input,
.el-date-editor.el-input__wrapper {
  width: 100%;
}

:deep(.el-form--inline .el-form-item) {
  width: calc(100% - 20px);
  margin-right: 20px;
  margin-bottom: 10px;
}

.el-form--inline .el-form-item {
  width: calc(100% - 20px);
  margin-right: 20px;
  margin-bottom: 15px;
}

:deep(.el-calendar-table .el-calendar-day) {
  --el-calendar-cell-width: 140px;
}

.pb-table {
  border-right: 1px solid #e4e4e7;
  border-bottom: 1px solid #e4e4e7;
}

.pb-table td {
  height: 35px;
  border-top: 1px solid #e4e4e7;
  border-left: 1px solid #e4e4e7;
}

.pb-table .la {
  width: 150px;
  text-align: right;
  background: #e6e6e6;
}

.pb-table .lb {
  width: 80px;
  text-align: right;
}

.pb-table .lc {
  width: 200px;
  text-align: center;
}

.pb-table .ld {
  width: 60px;
  text-align: center;
}

.expand {
  max-height: 0; /* 你可以根据需要调整这个值 */
  overflow: hidden;
  transition: max-height 0.5s ease-out;
}

.expand.v-enter-active,
.expand.v-leave-active {
  transition: max-height 0.5s ease-out;
}

.primary {
  color: hsl(var(--primary));
}

.expand.v-enter,
.expand.v-leave-to {
  max-height: 0;
}

.nhdg {
  width: 14px;
  height: 14px;
  padding-right: 2px;
  margin-top: -1px;
  transform: rotate(-90deg);
}

.nhdgx {
  width: 14px;
  height: 14px;
  padding-right: 2px;
  margin-top: 1px;
  transform: rotate(90deg);
}

.shoux {
  margin-top: 5px;
  border-top: 1px solid #efefef;
}

.shoux1 {
  border-top: 1px solid #efefef;
}

.zzhj {
  padding: 5px 7px;
  color: #fff;
  background: #995efd;
  border-radius: 3px;
}

.huj {
  background: #00cbb8;
}

.plj {
  background: #ffaa10;
}

.mnjhx2 {
  flex: 0.5;
  margin: 0 0 0 5px;
  color: hsl(var(--primary));
  text-align: center;
}

:deep(.el-calendar-table thead th) {
  color: #fff;
  background: #32c8c8;
}

.mnjhx3 {
  flex: 0.33;
  margin: 0 0 0 5px;
  color: hsl(var(--primary));
  text-align: center;
}

.ujjfg2 {
  flex: 0.5;
  padding: 5px 2px;
  margin: 0 0 0 5px;
  overflow: hidden;
  color: #333;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  background: #f2f2f2;
}

.ujjfg3 {
  flex: 0.33;
  padding: 5px 2px;
  margin: 0 0 0 5px;
  overflow: hidden;
  color: #333;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  background: #f2f2f2;
}

.ujjfg2:hover {
  text-decoration: underline;
}

.ujjfg3:hover {
  text-decoration: underline;
}
</style>
