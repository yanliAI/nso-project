<template>
<!-- 'is-current': col.isCurrent, 这里isCurrent指的是是否为当月，Calendar.ts文件中需要处理一下getDateParams函数 -->
  <div
        class="calendar-item-container"
        :class="[
            {
                'is-current': col.isCurrent,
                'is-week': col.isWeek,
                'is-selected': col.date === props.time,
                'is-current-month': isCurrentMonth(col.date),
            },
        ]"
        @click="changeTargetDate(col)"
    >
        <span class="calendar-title">{{ col.theDay }}</span>
        <span class="calendar-today" v-if="col.isToday">今</span>
        <div v-if="col.guaranteeInfo !== undefined">
          <div v-for="(info, index) in col.guaranteeInfo" :key="index"> 
            <span>{{info.guaranteeTitle}}</span>
          </div>
        </div>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits } from 'vue';
// import { dateBase } from './Calendar';
import Calendar from './Calendar';

  const props = defineProps({
    col: {
        type: Object,
        default: () => {
            return {};
        },
    },
    time: {
        type: String,
        default: '',
    },
  });
  const emit = defineEmits(['changeTargetDate'])

  function isCurrentMonth(time: string) {
    const months = time.split('-')[1];
    const a = Calendar.getCurrent()[1] === Number(months);
    return a;
  }

  function changeTargetDate(time) {
    console.log(props.col)
    emit('changeTargetDate', time)
  }
</script>

<style scoped lang="less">
.calendar-today {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  position: absolute;
  top: 2px;
  right: 2px;
}

.calendar-item-container {
    position: relative;

    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    box-sizing: border-box;
    border-radius: 6px;
    border: 2px solid #ffffff;

    .calendar-title {
        font-size: 1.0rem;
        color: #999999;
        position: absolute;
        left: 2px;
        top: 2px
    }
    transition: all 0.2s;
}
.calendar-item-container:hover {
    cursor: pointer;
    border: 2px solid #409eff;
}
.is-selected {
    border: 2px solid #409eff;
}
.is-selected.is-current-month {
    border: 2px solid #409eff;
}
.is-week {
    .calendar-title {
        color: #ffa2a2;
    }
}
.calendar-item-container.is-current {
    .calendar-title {
        color: #333333;
    }
}
.calendar-item-container.is-current.is-week {
    .calendar-title {
        color: #f62b2b;
    }
}

</style>
