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
  name: 'WallChartLoudongDetail',
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
      return;
    }
  }
  renderedMermaid.value = true;
};

// 模拟SSE数据源
const mockSSEData = `### 漏洞解读

#### 漏洞名称：SQL注入漏洞
#### 漏洞类型：注入类漏洞（SQL注入）
#### 风险等级：高

#### 漏洞描述：
在 \`/user/profile?id=1\` 接口中，\`id\` 参数未做任何过滤或转义处理，攻击者可以通过构造恶意输入（如 \`1' OR '1'='1\`）绕过正常查询逻辑，直接获取数据库中的敏感信息。此类漏洞可能导致以下风险：
1. **数据泄露**：攻击者可读取数据库中的用户信息、密码哈希、个人隐私数据等。
2. **数据篡改或删除**：通过注入恶意SQL语句，攻击者可能修改或删除数据库内容。
3. **权限提升**：结合其他漏洞，攻击者可能获取系统管理员权限。

#### 触发条件：
- 攻击者能够访问存在漏洞的接口（\`/user/profile\`）。
- 接口未对输入参数（\`id\`）进行安全过滤或预编译处理。

---

### 处置建议

#### 1. 临时缓解措施（立即执行）
- **禁用接口访问**：如果业务允许，暂时关闭 \`/user/profile\` 接口的对外访问权限，或限制仅内网可访问。
- **WAF防护**：通过Web应用防火墙（WAF）添加规则，拦截包含 \`'\`、\`OR\`、\`UNION\` 等SQL注入特征的请求。

#### 2. 彻底修复方案（长期解决）
- **参数化查询（Prepared Statements）**：修改代码，使用预编译语句处理SQL查询，确保用户输入始终作为数据而非SQL指令执行。
- **输入验证**：对 \`id\` 参数进行强类型校验（如强制转换为整数），或使用正则表达式限制输入格式（如仅允许数字）。
- **最小权限原则**：确保数据库连接账户仅具有必要权限，避免使用高权限账户（如 \`root\`）。

#### 3. 安全检测与监控
- **漏洞扫描**：对全站接口进行SQL注入漏洞扫描，排查类似问题。
- **日志审计**：检查访问日志，确认是否有攻击尝试（如异常 \`id\` 参数请求），并溯源攻击者IP。

#### 4. 后续跟进
- **回归测试**：修复后需通过自动化测试或手动注入测试验证漏洞是否彻底修复。
- **开发规范**：对开发团队进行安全编码培训，避免同类漏洞再次出现。`;

let typingInterval = null;
const currentChar = ref(0);
const startTyping = () => {
  if (openType.value == 1) {
    const parts = mockSSEData.split(/---/g);
    messages.value = [];
    for (let i = 0; i < parts.length; i++) {
      // 普通文本
      if (parts[i].trim()) {
        messages.value.push({
          type: 'text',
          content: marked.parse(parts[i]),
        });
      }
    }
    return;
  }
  currentChar.value = 0;
  typingInterval = setInterval(() => {
    if (currentChar.value > mockSSEData.length) {
      clearInterval(typingInterval);
      emit('afterDisplayText');
      const element = document.querySelector('[data-text-content-index="1"]');
      if (element) {
        const textContent = element.textContent;
        czjyText.value = textContent;
      }
      return;
    }
    currentChar.value++;
    const parts = mockSSEData.slice(0, currentChar.value).split(/---/g);
    messages.value = [];
    for (let i = 0; i < parts.length; i++) {
      // 普通文本
      if (parts[i].trim()) {
        messages.value.push({
          type: 'text',
          content: marked.parse(parts[i]),
        });
      }
    }
  }, 10); // 调整打字速度
};

const formatToken = (token) => {
  return token ? `Bearer ${token}` : null;
};

// 模拟SSE响应
const simulateSSE = async () => {
  // 模拟SSE数据流
  // startTyping();
  // return;
  controller = new AbortController();
  const accessStore = useAccessStore();
  loading.value = true;
  await fetchEventSource(
    import.meta.env.VITE_NSOSSECURITY + '/dwt/chatVulnInfo',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: formatToken(accessStore.accessToken),
      },
      body: JSON.stringify({
        vulnIds: alertId.value,
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
          // 处置建议后添加 ---，截取对应内容
          answerContent = answerContent.replace('处置建议', '处置建议---');
          const parts = answerContent.split(/---/g);
          messages.value = [];
          for (let i = 0; i < parts.length; i++) {
            // 普通文本
            if (parts[i].trim()) {
              messages.value.push({
                type: 'text',
                content: marked.parse(parts[i]),
              });
            }
          }
        } catch {}
      },

      onclose() {
        console.log('SSE连接关闭', messages.value);
        emit('afterDisplayText');
        const element = document.querySelector('[data-text-content-index="1"]');
        if (element) {
          const textContent = element.textContent
            ?.replace('处置建议', '')
            .trim();
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
