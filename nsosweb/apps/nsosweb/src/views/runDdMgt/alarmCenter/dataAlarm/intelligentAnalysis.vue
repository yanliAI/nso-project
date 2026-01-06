<template>
  <div class="markdown-container" v-auto-scroll="{ behavior: 'smooth' }" v-loading="loading" element-loading-text="研判中..." element-loading-background="rgba(122, 122, 122, 0.1)">
    <div class="w-full h-full flex">
      <div class="w-[70px]">
        <div class="jqr"></div>
      </div>
      <div class="flex-1  gbcdd">
        <div v-for="(item, index) in messages" :key="index" class="message-item">
          <div v-if="item.type === 'text'" class="text-content" v-html="item.content" v-auto-scroll="{ behavior: 'smooth' }" :data-text-content-index="index"></div>
          <div v-else-if="item.type === 'mermaid'" class="mermaid-content">
            <div class="mermaid" ref="mermaidCharts">{{ item.content }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { DocumentCopy } from '@element-plus/icons-vue'

import mermaid from 'mermaid' //引用mermaid

import { ref, reactive, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useAccessStore, useUserStore } from '@vben/stores'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { marked } from 'marked'

defineOptions({
  name: 'WallChartLoudongDetail'
})
const emit = defineEmits(['afterDisplayText'])
// 父组件传入的系统名称
const alertData = defineModel('alertData')
const openType = defineModel('openType')
const czjyText = ref('')
const loading = ref(false)

// 响应数据
const messages = ref([])
const mermaidCharts = ref([])
let controller = null

// 初始化渲染器
const initRender = () => {
  mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    flowchart: { useMaxWidth: true },
    securityLevel: 'loose'
  })
}

const renderedMermaid = ref(false)

// 渲染Mermaid图表
const renderMermaidCharts = async () => {
  if (renderedMermaid.value) {
    return
  }
  await nextTick()
  const charts = mermaidCharts.value

  for (const chart of charts) {
    try {
      const graphDefinition = chart.textContent?.trim() || ''
      if (graphDefinition) {
        const { svg } = await mermaid.render(`mermaid-${Math.random().toString(36).slice(2, 9)}`, graphDefinition)
        chart.innerHTML = svg
      }
    } catch (error) {
      return
    }
  }
  renderedMermaid.value = true
}

let typingInterval = null
const currentChar = ref(0)
const startTyping = () => {
  if (openType.value == 1) {
    const parts = mockSSEData.split(/---/g)
    messages.value = []
    for (let i = 0; i < parts.length; i++) {
      // 普通文本
      if (parts[i].trim()) {
        messages.value.push({
          type: 'text',
          content: marked.parse(parts[i])
        })
      }
    }
    return
  }
  currentChar.value = 0
  typingInterval = setInterval(() => {
    if (currentChar.value > mockSSEData.length) {
      clearInterval(typingInterval)
      emit('afterDisplayText')
      const element = document.querySelector('[data-text-content-index="1"]')
      if (element) {
        const textContent = element.textContent
        czjyText.value = textContent
      }
      return
    }
    currentChar.value++
    const parts = mockSSEData.slice(0, currentChar.value).split(/---/g)
    messages.value = []
    for (let i = 0; i < parts.length; i++) {
      // 普通文本
      if (parts[i].trim()) {
        messages.value.push({
          type: 'text',
          content: marked.parse(parts[i])
        })
      }
    }
  }, 10) // 调整打字速度
}

const formatToken = (token) => {
  return token ? `Bearer ${token}` : null
}

// 模拟SSE响应
const simulateSSE = async () => {
  console.log(alertData.value);
  // 模拟SSE数据流
  // startTyping();
  // return;
  controller = new AbortController()
  const accessStore = useAccessStore()
  loading.value = true
  await fetchEventSource(import.meta.env.VITE_NSOSGZ + '/dwt/chatAlertInfo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: formatToken(accessStore.accessToken)
    },
    body: JSON.stringify({
      id: alertData.value.id,
      alertDesc: alertData.value.alertDesc
    }),
    signal: controller.signal,
    openWhenHidden: true,
    onmessage(newMesssage) {
      loading.value = false
      if (newMesssage.event != 'answer-qw') {
        return
      }

      try {
        let dataInfo = JSON.parse(newMesssage.data)
        let answerContent = dataInfo?.choices[0].delta.content
        let indexOfThink = answerContent.indexOf('</think>')
        // 删除think部分
        if (indexOfThink !== -1) {
          answerContent = answerContent.substring(indexOfThink + '</think>'.length).trim()
        }
        // 替换markdown代码块
        answerContent = answerContent.replace(/^```markdown\s*|\s*```$/g, '')
        // 处置建议后添加 ---，截取对应内容
        answerContent = answerContent.replace('处置建议', '处置建议---')
        const parts = answerContent.split(/---/g)
        messages.value = []
        for (let i = 0; i < parts.length; i++) {
          // 普通文本
          if (parts[i].trim()) {
            messages.value.push({
              type: 'text',
              content: marked.parse(parts[i])
            })
          }
        }
      } catch {}
    },

    onclose() {
      console.log('SSE连接关闭', messages.value)
      emit('afterDisplayText')
      const element = document.querySelector('[data-text-content-index="1"]')
      if (element) {
        const textContent = element.textContent?.replace('处置建议', '').trim()
        czjyText.value = textContent?.replace(/\n{3}/g, '\n\n')
      }
    },

    onerror(err) {
      ElMessage.error('智能研判失败' + err)
      loading.value = false
    }
  })
}

const startSSE = () => {
  messages.value = []
  simulateSSE()
}

const stopSSE = () => {
  if (controller) {
    controller.abort()
    controller = null
  }
}

onMounted(() => {
  initRender()
  startSSE()
})
onUnmounted(() => {
  stopSSE()
})
// 暴露给父组件
defineExpose({ czjyText })
</script>

<style scoped lang="less">
.el-main {
  padding-top: 0;
}

.tag-line {
  margin-right: 5px;
  width: 3px;
  height: 14px;
  background-color: #2585dc;
}

.alarm-analysis,
.disposal-proposal,
.attack-lines {
  padding: 0 0 15px 10px;
  color: white;
  font-size: 16px;
  border: 1px solid #a5a3a3;
  border-radius: 3px;
  background: linear-gradient(to bottom, #1c233a, #182c4e);

  p {
    margin-top: 10px;
    font-size: 14px;
    color: #eee;
  }
}
.disposal-proposal,
.attack-lines {
  // min-height: 200px;
  margin-top: 10px;
}

.pic-analysis {
  margin-top: 10px;
  padding: 10px;
  color: white;
  font-size: 16px;
  border: 1px solid #a5a3a3;
  border-radius: 3px;
  background: linear-gradient(to bottom, #1c233a, #182c4e);

  .aggressor,
  .victim {
    position: relative;
    height: 100%;
    color: white;
    font-size: 14px;
    border: 1px solid #f3f0f0;
    border-radius: 3px;
    background: linear-gradient(to bottom, #1c233a, #182c4e);

    .pic-item-con {
      margin: 15px 15px 15px 30px;
      color: #666;
      font-size: 12px;

      .pic-item {
        margin-bottom: 20px;
        align-items: center;

        p {
          width: 80px;
          text-align: right;
        }

        .pic-item-ip {
          margin-left: 10px;
          padding: 2px 8px;
          color: #999;
          background-color: #333c3c;
          border-radius: 3px;
        }
      }
    }
  }

  .tag-name {
    position: absolute;
    padding: 3px 10px;
    left: 0;
    top: 0;
    background-color: #ee3c3e;
    border-radius: 3px;
  }
}
</style>

<style>
.markdown-container {
  min-height: 605px;
  max-height: calc(100vh - var(--el-dialog-margin-top, 15vh) - 132px);
  padding: 0 10px;
  margin-top: 15px;
  overflow: auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.6;
  color: #06071f;
  background-color: #f4f6fc;
  border-radius: 3px;
}

.py-1 {
  padding-top: 0;
  padding-bottom: 0;
}

.jqr {
  width: 40px;
  height: 40px;
  margin-left: 20px;
  background-image: url('/src/assets/images/intellectualDialogue/answerLittle.png');
}

.gbcdd{
  padding: 28px;
  background: #fdfdfe;
  border: 1px solid #6a737d;
  border: 1px solid rgb(0 23 144 / 7%);
  border-radius: 16px;
  box-shadow: 0 16px 20px 0 rgb(174 167 223 / 6%);
}

.px-3 {
  padding-right: 0;
  padding-left: 0;
}

.markdown-container > :first-child {
  margin-top: 0 !important;
}

.mermaid {
  background-color: #f6f8fa;
}

.markdown-container h1,
.markdown-container h2,
.markdown-container h3 {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  font-weight: 600;
}

.markdown-container h1 {
  padding-bottom: 0.3em;
  font-size: 2em;
  border-bottom: 1px solid #eaecef;
}

.markdown-container h2 {
  padding-bottom: 0.3em;
  font-size: 1.5em;
  border-bottom: 1px solid #eaecef;
}

.markdown-container h3 {
  font-size: 1.25em;
}

.markdown-container p {
  margin: 0 0 16px;
}

.markdown-container ul,
.markdown-container ol {
  padding-left: 2em;
  margin-bottom: 16px;
}

.markdown-container li {
  margin-bottom: 0.5em;
}

.markdown-container blockquote {
  padding: 0 1em;
  margin: 0 0 16px;
  color: #6a737d;
  border-left: 4px solid #dfe2e5;
}

.markdown-container pre {
  padding: 16px;
  margin-bottom: 16px;
  overflow: auto;
  background-color: #f6f8fa;
  border-radius: 3px;
}

.markdown-container code {
  padding: 0.2em 0.4em;
  font-family: SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace;
  background-color: rgb(27 31 35 / 5%);
  border-radius: 3px;
}

.markdown-container table {
  width: 100%;
  margin: 1em 0;
  border-collapse: collapse;
}

.markdown-container th,
.markdown-container td {
  padding: 6px 13px;
  border: 1px solid #dfe2e5;
}

.markdown-container th {
  font-weight: 600;
  background-color: #f6f8fa;
}
</style>
