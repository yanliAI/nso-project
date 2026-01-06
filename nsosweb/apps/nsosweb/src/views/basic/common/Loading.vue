<template>
  <div class="w-full h-full basc-loading" v-if="loading">
    <div class="h-full flex items-center">
      <div class="grid-blockWaitMask"></div>
      <!-- <svg class="circular m-auto" viewBox="0 0 20 20">
        <g
          class="path2 loading-path"
          stroke-width="0"
          style=" stroke: none;animation: none"
        >
          <circle r="3.375" class="dot1" rx="0" ry="0" />
          <circle r="3.375" class="dot2" rx="0" ry="0" />
          <circle r="3.375" class="dot4" rx="0" ry="0" />
          <circle r="3.375" class="dot3" rx="0" ry="0" />
        </g>
      </svg> -->
    </div>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref,watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useLoadingStore } from '#/store';
const { loading } = storeToRefs(useLoadingStore())
// watch(loading, (newval) => {
//   console.log(newval);
// })
</script>
<style scoped>

.basc-loading{
  position: absolute;
  top: 50%;
  left: 50%; 
  z-index: 999999;
  overflow: hidden;
  filter: alpha(opacity=100);
	-moz-opacity: .75;
	opacity: .70;
  transform: translate(-50%, -50%);
}

.grid-blockWaitMask {
	width: 202px;
	height: 42px;
	margin: auto;
	background-image: url("/images/basic/dataLoading.gif");
	border: 1px solid #aaa;
	border-radius: 3px;
}

.circular {
  display: inline;
  width: 30px;
  height: 30px;
  animation: loading-rotate 2s linear infinite;
}

.path {
  stroke: var(--el-color-primary);
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  stroke-linecap: round;
  stroke-width: 2;
  animation: loading-dash 1.5s ease-in-out infinite;
}

.loading-path .dot1 {
  opacity: 0.3;
  fill: var(--el-color-primary);
  transform: translate(3.75px, 3.75px);
  animation: custom-spin-move 1s infinite linear alternate;
}

.loading-path .dot2 {
  opacity: 0.3;
  fill: var(--el-color-primary);
  transform: translate(calc(100% - 3.75px), 3.75px);
  animation: custom-spin-move 1s infinite linear alternate;
  animation-delay: 0.4s;
}

.loading-path .dot3 {
  opacity: 0.3;
  fill: var(--el-color-primary);
  transform: translate(3.75px, calc(100% - 3.75px));
  animation: custom-spin-move 1s infinite linear alternate;
  animation-delay: 1.2s;
}

.loading-path .dot4 {
  opacity: 0.3;
  fill: var(--el-color-primary);
  transform: translate(calc(100% - 3.75px), calc(100% - 3.75px));
  animation: custom-spin-move 1s infinite linear alternate;
  animation-delay: 0.8s;
}

@keyframes loading-rotate {
  to {
    transform: rotate(360deg);
  }
}

@keyframes loading-dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -40px;
  }

  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -120px;
  }
}

@keyframes custom-spin-move {
  to {
    opacity: 1;
  }
}
</style>
