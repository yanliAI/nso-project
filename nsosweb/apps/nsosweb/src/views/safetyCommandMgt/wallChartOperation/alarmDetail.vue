<template>
  <div
    class="markdown-container"
    v-auto-scroll="{ behavior: 'smooth' }"
    v-loading="loading"
    element-loading-text="研判中..."
    element-loading-background="rgba(122, 122, 122, 0.1)"
  >
    <div v-for="(item, index) in messages" :key="index" class="message-item">
      <div
        v-if="item.type === 'text'"
        class="text-content"
        v-html="item.content"
        v-auto-scroll="{ behavior: 'smooth' }"
        :data-text-content-index="index"
      ></div>
      <div v-else-if="item.type === 'mermaid'" class="mermaid-content">
        <div class="mermaid" ref="mermaidCharts">{{ item.content }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus';
import { DocumentCopy } from '@element-plus/icons-vue';

import mermaid from 'mermaid'; //引用mermaid
import { Page } from '@vben/common-ui';

import {
  ref,
  reactive,
  computed,
  onMounted,
  onUnmounted,
  nextTick,
  watch,
} from 'vue';
import { useAccessStore, useUserStore } from '@vben/stores';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { marked } from 'marked';

defineOptions({
  name: 'WallChartAlarmDetail',
});
const emit = defineEmits(['afterDisplayText']);
// 父组件传入的系统名称
const alertId = defineModel('alertId');
const openType = defineModel('openType');
const czjyText = ref('');
const loading = ref(false);

interface MessageItem {
  type: 'text' | 'mermaid';
  content: string;
}

// 响应数据
const messages = ref<MessageItem[]>([]);
const mermaidCharts = ref<HTMLElement[]>([]);
let controller: AbortController | null = null;

// 初始化渲染器
const initRender = () => {
  mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    flowchart: { useMaxWidth: true },
    securityLevel: 'loose',
  });
};

const renderedMermaid = ref(false);

// 渲染Mermaid图表
const renderMermaidCharts = async () => {
  if (renderedMermaid.value) {
    return;
  }
  await nextTick();
  const charts = mermaidCharts.value;

  for (const chart of charts) {
    try {
      const graphDefinition = chart.textContent?.trim() || '';
      if (graphDefinition) {
        const { svg } = await mermaid.render(
          `mermaid-${Math.random().toString(36).slice(2, 9)}`,
          graphDefinition,
        );
        chart.innerHTML = svg;
      }
    } catch (error) {
      console.log('mermaid error:', error);
      return;
    }
  }
  renderedMermaid.value = true;
};

// 模拟SSE数据源
const mockSSEData = [
  {
    type: 'text',
    content: `### 内容1：告警解读信息
1. **攻击性质**：
   - 告警类型为 **有害程序（高危）**，攻击结果均为 **企图（代码2）**，表明攻击行为被检测但未成功入侵。
   - 攻击方向为 **远程到远程（R2R）**，攻击者通过远程手段尝试渗透受害者系统。
2. **攻击源分析**：
   - 攻击者IP：\`47.100.227.174\`（上海）、\`47.116.45.95\`（上海）、\`47.113.151.69\`（深圳）。
   - 攻击者地理位置集中在中国上海和深圳，可能为协同攻击或分布式来源。
3. **受害者信息**：
   - 受害者IP均为 **\`14.23.142.147\`**，属于南网总部五区（V区）的边界防线设备 **k01**（IP：\`10.92.33.34\`）。
   - 标签包含 **白名单**，但告警仍被触发，需验证白名单策略是否被绕过。
4. **检测设备**：
   - 设备 **k01**（网盾）在边界防线拦截攻击，告警来源为内部安全监测系统（代码55）。
### 内容2：攻击图`,
  },
  {
    type: 'mermaid',
    content: `graph TD\n    A["攻击者240e:960:1410:1::b"] --> B["DMZ区天眼分析平台#2(10.90.130.104)"]\n    B --> C["受害者14.23.143.236"]\n    A --> D["天眼分析平台(10.92.205.50)"]\n    D --> C`,
  },
  {
    type: 'text',
    content: `### 内容3：处置建议

1. **紧急封堵**：
   - 在防火墙/WAF（k01）上临时封锁攻击者IP \`47.100.227.174\`、\`47.116.45.95\`、\`47.113.151.69\`，并分析其是否为代理IP或跳板机。
2. **日志溯源**：
   - 提取k01设备完整日志，确认攻击路径、载荷及是否涉及其他未告警的关联行为。
   - 检查白名单策略是否异常，排查标签误报或策略漏洞。
3. **系统加固**：
   - 对受害者IP \`14.23.142.147\` 进行漏洞扫描，重点检查边界防线设备的配置（如端口开放、协议安全性）。
   - 更新网盾k01的威胁情报库和检测规则，提升对新型有害程序的拦截能力。
4. **持续监控**：
   - 对南网总部五区（V区）的流量实施7×24小时监控，设置异常行为阈值告警。
   - 针对未研判告警（NEW_DISPOSE_STATUS=0），需人工复核并补充处置记录。
5. **应急响应**：
   - 若攻击链阶段（KILLCHAIN）升级，启动网络安全应急预案，联动终端防线和主机安全系统进行横向排查。`,
  },
];
const formatToken = (token) => {
  return token ? `Bearer ${token}` : null;
};

// 模拟SSE响应
const simulateSSE = async () => {
  // 模拟SSE数据流
  // for (const item of mockSSEData) {
  //   await new Promise((resolve) => setTimeout(resolve, 1000));
  //   messages.value.push({
  //     type: item.type,
  //     content: item.type === 'text' ? marked.parse(item.content) : item.content,
  //   });

  //   if (item.type === 'mermaid') {
  //     await renderMermaidCharts();
  //   }
  // }
  // return;
  controller = new AbortController();
  const accessStore = useAccessStore();
  loading.value = true;
  await fetchEventSource(
    import.meta.env.VITE_NSOSSECURITY + '/dwt/chatAlertInfo',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: formatToken(accessStore.accessToken),
      },
      body: JSON.stringify({
        alertIds: alertId.value,
        question: 'test',
        sessionId: '',
        userId: '',
      }),
      signal: controller.signal,
      openWhenHidden: true,
      onmessage(newMesssage) {
        loading.value = false;
        if (newMesssage.event != 'answer-qw') {
          return;
        }
        try {
          let dataInfo = JSON.parse(newMesssage.data);
          let answerContent = dataInfo?.choices[0].delta.content;
          let indexOfThink = answerContent.indexOf('</think>');
          // 删除think部分
          if (indexOfThink !== -1) {
            answerContent = answerContent
              .substring(indexOfThink + '</think>'.length)
              .trim();
          }
          // 替换markdown代码块
          answerContent = answerContent.replace(/^```markdown\s*|\s*```$/g, '');
          const parts = answerContent.split(/```mermaid([\s\S]*?)```/g);
          messages.value = [];
          for (let i = 0; i < parts.length; i++) {
            if (i !== 1) {
              // 普通文本
              if (parts[i].trim()) {
                messages.value.push({
                  type: 'text',
                  content: marked.parse(parts[i]),
                });
              }
            } else {
              // Mermaid 代码
              let code = parts[i]
                .trim()
                .replace(/\[/g, '["')
                .replace(/\]/g, '"]');
              messages.value.push({
                type: 'mermaid',
                content: code,
              });
              renderMermaidCharts();
            }
          }
        } catch {}
      },

      onclose() {
        console.log('SSE连接关闭', messages.value);
        emit('afterDisplayText');
        const element = document.querySelector('[data-text-content-index="2"]');
        if (element) {
          const textContent = element.textContent
            ?.replace('处置建议', '')
            .trim();
          console.log('找到的内容:', textContent);
          czjyText.value = textContent?.replace(/\n{3}/g, '\n\n');
        }
      },

      onerror(err) {
        ElMessage.error('智能研判失败' + err);
        loading.value = false;
      },
    },
  );
};

const startSSE = () => {
  messages.value = [];
  simulateSSE();
};

const stopSSE = () => {
  if (controller) {
    controller.abort();
    controller = null;
  }
};

onMounted(() => {
  initRender();
  startSSE();
});
onUnmounted(() => {
  stopSSE();
});
// 暴露给父组件
defineExpose({ czjyText });
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
  min-height: 300px;
  max-height: calc(100vh - var(--el-dialog-margin-top, 15vh) - 132px);
  padding: 0 10px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
    Arial, sans-serif;
  line-height: 1.6;
  color: #fff;
  overflow: auto;
  border: 1px solid #a5a3a3;
  border-radius: 3px;
  background: linear-gradient(to bottom, #1c233a, #182c4e);
}
.markdown-container > :first-child {
  margin-top: 0px !important;
}

.mermaid {
  display: flex;
  justify-content: center;
  min-height: 300px;
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
  font-size: 2em;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
}

.markdown-container h2 {
  font-size: 1.5em;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
}

.markdown-container h3 {
  font-size: 1.25em;
}

.markdown-container p {
  margin: 0 0 16px 0;
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
  border-left: 4px solid #dfe2e5;
  color: #6a737d;
  padding: 0 1em;
  margin: 0 0 16px 0;
}

.markdown-container pre {
  background-color: #f6f8fa;
  border-radius: 3px;
  padding: 16px;
  overflow: auto;
  margin-bottom: 16px;
}

.markdown-container code {
  background-color: rgba(27, 31, 35, 0.05);
  border-radius: 3px;
  padding: 0.2em 0.4em;
  font-family: SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace;
}

.markdown-container table {
  border-collapse: collapse;
  margin: 1em 0;
  width: 100%;
}

.markdown-container th,
.markdown-container td {
  border: 1px solid #dfe2e5;
  padding: 6px 13px;
}

.markdown-container th {
  background-color: #f6f8fa;
  font-weight: 600;
}
</style>
