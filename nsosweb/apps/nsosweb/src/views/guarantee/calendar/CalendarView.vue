<template>
  <div style="margin: 0 1.5%" class="h-full">
    <el-calendar v-model="changeDateValue" fit>
      <template #date-cell="{ data }">
        <div style="position: relative" class="h-full">
          <p :class="data.isSelected ? 'is-selected' : ''">
            {{ data.day.split('-').slice(1).join('-') }}
            {{ data.isSelected ? '✔️' : '' }}
          </p>
          <div class="overflow-y-auto" style="height: calc(100% - 18.36px)" @click="openTask">
            <p v-for="item in guaranteeData[data.day]" class="m-2 pl-1" style="font-size: 15px; color: hsl(var(--primary)); background-color: hsl(var(--background-deep)); border-left: 5px solid hsl(var(--primary))">
              {{ item.guaranteeTitle }}
              <span class="isZuo small-icon" v-if="item.hasTask === true">作</span>
            </p>
          </div>
          <span class="calendar-today small-icon" v-if="data.day === transformDate2String(new Date())">今</span>
        </div>
      </template>
    </el-calendar>
  </div>

  <!-- <div class="t-calendar">
      <div class="t-calendar-main">
          <div class="t-calendar-operation">
            <h3>{{datePickerValue.getFullYear()}}年{{datePickerValue.getMonth()+1}}月{{datePickerValue.getDate()}}日</h3>
            </div>
          <div class="t-calendar-style">
              <ul class="t-calendar-header">
                  <li style="color: #f62b2b;">星期日SUN</li>
                  <li>星期一MON</li>
                  <li>星期二TUE</li>
                  <li>星期三WED</li>
                  <li>星期四THU</li>
                  <li>星期五FRI</li>
                  <li style="color: #f62b2b;">星期六SAT</li>
              </ul>
              <div class="t-calendar-day">
                  <template v-if="true">
                      <div
                          class="t-calendar-row"
                          v-for="(item, index) in TBody"
                          :key="index"
                      >
                          <div
                              class="t-calendar-col"
                              v-for="(col, colIdx) in item"
                              :key="colIdx"
                          >
                              <CalendarItem
                                  :col="col"
                                  :time="currentDate"
                                  @changeTargetDate = "changeDate"
                              ></CalendarItem>
                          </div>
                          
                      </div>
                  </template>
                  <template v-else>
                      <div class="no-date">抱歉,暂无数据</div>
                  </template>
              </div>
          </div>
      </div>
  </div> -->
</template>

<script setup lang="ts">
import { ElCalendar } from 'element-plus'
import { ref, computed, defineEmits, watch, onMounted } from 'vue'
import { requestClient } from '#/api/request'
import CalendarItem from './calendarItem.vue'
import ts from './Calendar'
import { useRouter } from 'vue-router';

const router = useRouter()

const props = defineProps({
  datePickerValue: {
    type: Date,
    default: new Date()
  },
  title: {
    type: String,
    default: ''
  },
  statusList: {
    type: Array,
    default: []
  }
})
const emit = defineEmits(['changeDate', 'update:datePickerValue'])
const guaranteeData = ref({})
const currentDate = ref(`${props.datePickerValue.getFullYear()}-${ts.clockFactory(props.datePickerValue.getMonth() + 1)}-${ts.clockFactory(props.datePickerValue.getDate())}`)
// const TBody = ref(ts.table([props.datePickerValue.getFullYear(), props.datePickerValue.getMonth()+1, props.datePickerValue.getDate()], guaranteeData.value))
const TBody = computed(() => {
  return ts.table([props.datePickerValue.getFullYear(), props.datePickerValue.getMonth() + 1, props.datePickerValue.getDate()], guaranteeData.value)
})
const changeDateValue = computed({
  get() {
    return props.datePickerValue
  },
  set(value) {
    emit('update:datePickerValue', value)
  }
})
const openTask = () => {
  window.open(
    router.resolve({
      path: '/guarantee/guaranteeTask',
      query: {}
    }).href,
    'nsos-assessAnalysis'
  )
}

function getCurrentMonthData(date: string) {
  let statusList = props.statusList
  requestClient
    .post(import.meta.env.VITE_NSOSGZ + '/guaranteeInfo/getCurrentMonthData', {
      title: props.title,
      statusList: props.statusList.length === 0 ? [1, 2, 3] : props.statusList,
      date: date
    })
    .then((result) => {
      if (result !== null) {
        guaranteeData.value = result
      } else {
        guaranteeData.value = {}
      }
    })
}

function changeDate(dateBaseObj) {
  let split_currentDate = currentDate.value.split('-')
  let split_dateBaseObj = dateBaseObj.date.split('-')
  //判断change的日期是不是当月的日期，如果不是就要再次请求后端获取作业信息
  // if (split_currentDate[0] !== split_dateBaseObj[0] || split_currentDate[1] !== split_dateBaseObj[1]){
  //   getCurrentMonthData(dateBaseObj.date)
  // }
  currentDate.value = dateBaseObj.date
  console.log('currentDate.value:' + currentDate.value)
  let chosenDate = new Date(currentDate.value)
  emit('changeDate', chosenDate)
}

function transformDate2String(date: Date) {
  return `${date.getFullYear()}-${ts.clockFactory(date.getMonth() + 1)}-${ts.clockFactory(date.getDate())}`
}

watch(
  () => props.datePickerValue,
  (newValue, oldValue) => {
    //如果不是本月的日期
    if (newValue.getFullYear() !== oldValue.getFullYear() || newValue.getMonth() !== oldValue.getMonth()) {
      getCurrentMonthData(transformDate2String(newValue))
      // TBody.value = ts.table([props.datePickerValue.getFullYear(), props.datePickerValue.getMonth()+1, props.datePickerValue.getDate()], guaranteeData.value)
    }
    currentDate.value = transformDate2String(props.datePickerValue)
  }
)

onMounted(() => {
  getCurrentMonthData(transformDate2String(new Date()))
})

// 暴露方法
defineExpose({
  getCurrentMonthData
})
</script>

<style scoped="scoped" lang="less">
.responsive-calendar {
  max-width: 100%; /* 最大宽度为父容器的 100% */
  max-height: 100%; /* 最大高度为父容器的 100% */
}

.calendar-today {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  position: absolute;
  top: 2px;
  right: 2px;
}

.isZuo {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  position: absolute;
  top: 2px;
  right: 20px;
}

.small-icon {
  border-radius: 4px;
  padding: 1px;
  font-size: 14px;
}

@light-line: #ebeef5;
.t-calendar {
  position: relative;

  width: 100%;
  height: 80%;
  display: flex;
  & > div {
    position: relative;
    height: 100%;

    box-sizing: border-box;
  }
  .t-calendar-main {
    // border: 2px solid #409eff;

    margin: 0% 1.5%;
    background-color: hsl(var(--sidebar));
    flex: 1;
    .t-calendar-operation {
      position: relative;

      width: 100%;
      height: 46px;
      display: flex;
      justify-content: space-between;
      box-sizing: border-box;
      border-bottom: 1px solid @light-line;
      h3 {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        padding: 0 10px;

        font-size: 22px;
        font-weight: bold;
      }
    }
    .t-calendar-style {
      position: relative;

      width: 100%;
      height: calc(~'100% - 46px');
      .t-calendar-header {
        position: relative;

        display: flex;
        width: 100%;
        height: 42px;
        padding: 0;
        box-sizing: border-box;
        li {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;

          flex: 1;
          font-size: 0.95rem;
        }
      }
      .t-calendar-day {
        position: relative;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: calc(~'100% - 42px');

        .t-calendar-row {
          position: relative;
          width: 100%;
          height: 60px;
          display: flex;
          flex: 1;
          z-index: 10;

          border-bottom: 1px solid @light-line;
          .t-calendar-col {
            position: relative;
            box-sizing: border-box;
            flex: 1;
            border-left: 1px solid @light-line;
            padding: 2px;

            font-size: 16px;
            transition: all 0.2s;
          }
          .t-calendar-col:last-child {
            border-right: 1px solid @light-line;
          }
          // .t-calendar-col:hover {
          //     cursor: pointer;
          //     background-color: #ecf5ff;
          // }
        }
        .t-calendar-row:first-child {
          border-top: 1px solid @light-line;
        }
        .no-date {
          position: relative;

          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .t-calendar-mark {
          position: absolute;
          // top: 50%;
          // left: 50%;
          // transform: translate(-50%, -50%);

          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          box-sizing: border-box;

          font-size: 20rem;
          color: #ebeef5;
          opacity: 0.5;
          // font-style: italic;
          // background: #000;

          z-index: 0;
        }
      }
    }
  }
}
</style>
