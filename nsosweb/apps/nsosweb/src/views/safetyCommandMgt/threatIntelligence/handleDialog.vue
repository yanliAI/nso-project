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
import { getAlertDetailApi } from '#/api';
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
const mockSSEData = `### **威胁情报解读**

#### **事件概述**
- **涉事公司**：Builder.ai（伦敦AI软件开发公司）
- **泄露原因**：数据库配置错误（公开暴露，未授权访问）
- **泄露数据量**：**300万条记录（1.29 TB）**
- **数据类型**：
  - **客户敏感信息**：发票、NDA（保密协议）、税务文件、电子邮件截图
  - **内部运营数据**：云存储密钥、内部文档
- **风险影响**：
  - **个人身份信息（PII）泄露**：可能导致客户遭受钓鱼攻击、身份盗用、金融欺诈等风险。
  - **商业机密泄露**：NDA、内部文件暴露可能影响企业竞争力，甚至引发法律纠纷。
  - **云存储密钥泄露**：攻击者可利用密钥访问企业云资源，导致数据篡改、勒索攻击或进一步渗透。

#### **暴露时间与发现方式**
- **暴露原因**：数据库未设置访问控制（如防火墙、IP白名单、认证机制）。
- **发现方式**：未明确说明，但可能是安全研究人员扫描发现或内部审计暴露。

---

### **处置建议**

#### **1. 立即应急响应（24小时内）**
✅ **确认并隔离暴露的数据库**
   - 立即下线或限制数据库的公开访问，仅允许授权IP或VPN访问。
   - 检查是否有异常访问日志，确认是否已被恶意利用。

✅ **重置所有泄露的云存储密钥**
   - 更换AWS/Azure/GCP等云服务的API密钥、访问令牌，撤销旧密钥权限。

✅ **通知受影响客户与监管机构（如GDPR适用）**
   - 根据欧盟GDPR等法规，需在72小时内向监管机构报告数据泄露事件。
   - 向受影响的客户发送安全通告，建议更改密码、启用多因素认证（MFA）。

#### **2. 技术加固（短期修复）**
🔒 **数据库安全配置**
   - 启用**TLS加密传输**，禁止明文访问。
   - 配置**严格的访问控制**（如IP白名单、VPC私有网络隔离）。
   - 使用**数据库防火墙**（如AWS RDS安全组、阿里云数据库白名单）。

🔒 **敏感数据保护**
   - 对存储的PII数据（如邮件、NDA）进行**加密存储**（AES-256）。
   - 实施**数据脱敏**（如发票中的银行卡号、税务ID部分隐藏）。

#### **3. 长期安全改进**
📌 **安全审计与监控**
   - 定期进行**渗透测试**和**漏洞扫描**，检查数据库暴露风险。
   - 部署**SIEM（安全信息与事件管理）** 监控异常访问行为（如大量数据下载）。

📌 **员工安全意识培训**
   - 针对运维团队培训**云安全最佳实践**（如最小权限原则、密钥管理）。
   - 建立**数据分类与访问审批流程**，避免高敏感数据公开存储。

#### **4. 法律与合规跟进**
⚖️ **合规审查**
   - 评估是否违反**GDPR、CCPA（加州隐私法）**等法规，准备法律应对方案。
   - 与网络安全保险公司（如有）沟通，确认理赔流程。  `;

let typingInterval = null;
const currentChar = ref(0);
const startTyping = () => {
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
    import.meta.env.VITE_NSOSSECURITY + '/dwt/chatThreatInfo',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: formatToken(accessStore.accessToken),
      },
      body: JSON.stringify({
        threatIds: alertId.value,
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
        } catch (error) {
          console.log('威胁情报-大瓦特error：', error);
        }
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
  /* color: #fff; */
  overflow: auto;
  border: 1px solid #a5a3a3;
  border-radius: 3px;
  /* background: linear-gradient(to bottom, #1c233a, #182c4e); */
}
.markdown-container > :first-child {
  margin-top: 0px !important;
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
