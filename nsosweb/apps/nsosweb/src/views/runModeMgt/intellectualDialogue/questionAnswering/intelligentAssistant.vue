<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue';

import { DocumentCopy } from '@element-plus/icons-vue';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { ElCol, ElDialog, ElMessage, ElRow } from 'element-plus';
import VueMarkdown from 'markdown-it';
import { v4 as uuidv4 } from 'uuid';
import { useAccessStore, useUserStore } from '@vben/stores';
import { queryHistory } from '#/api';
import iconAnswer from '#/assets/images/intellectualDialogue/answer.png';
import iconAnswerLittle from '#/assets/images/intellectualDialogue/answerLittle.png';
import iconQuestion from '#/assets/images/intellectualDialogue/question.png';
import iconSubmit from '#/assets/images/intellectualDialogue/submit.png';
import { marked } from 'marked';
const abortController = ref<AbortController | null>(null);
const props = defineProps({
  openDialog: {
    type: Boolean,
    default: false, // 默认值
  },
});
const emit = defineEmits(['closeDialog']);

interface MessageItem {
  id: string;
  role: string;
  content: string;
}

const loading = ref(false);
const questionList = reactive<MessageItem[]>([]); // 当前的对话内容
const textContent = ref(''); // 输入内容
const maxTextareaHeight = '300px'; // 输入框最大高度
const inputTextarea = ref(null);
const content = ref('请在此处向AI提问');
const conversation = reactive({
  currentIsAnswering: false, // 是否正在回答
  answerId: '', // 当前正在回答的问题id
});
onMounted(() => {
  getHistoryChat();
});

/**
 *以下markdown配置
 */
const md = new VueMarkdown({
  // 配置 markdown-it 的选项
  linkify: true, // 自动将 URL 转换为链接
  typographer: true,
  html: true,
});
function renderMarkdown(markdownText) {
  // // 添加 Mermaid 配置（如果检测到图表）
  // if (markdownText.includes('graph') || markdownText.includes('sequenceDiagram')) {
  //   markdownText = `<div class="mermaid-container">${markdownText}</div>`;
  // }

  md.renderer.rules.link_open = (tokens, idx) => {
    const hrefIndex = tokens[idx].attrIndex('href');
    if (hrefIndex !== -1) {
      const href = tokens[idx].attrs[hrefIndex][1];
      return `<a href="${href}" target="_blank">`;
    }
    return '<a>';
  };
  return md.render(markdownText);
}

/**
 * 问答相关方法
 * @param item
 */
// 获取历史对话信息

async function getHistoryChat() {
  try {
    const res = await queryHistory();
    if (res.length === 0) {
      questionList.push({
        role: 'assistant',
        content: '您好,我是大瓦特智能体助手。',
      });
    } else {
      res.forEach((itAiRecordLists) => {
        itAiRecordLists.itAiRecordList.forEach((element) => {
          // 处理所有代码块标记（包括不闭合的情况）
          element.answer = element.answer
            .replace(/```[\s\S]*?```/g, '') // 先删除成对的 ```
            .replace(/```[\s\S]*/g, ''); // 再删除剩余的未闭合 ```
          questionList.push({
            id: uuidv4(),
            role: 'user',
            content: element.question,
          });
          questionList.push({
            id: uuidv4(),
            role: 'assistant',
            content: element.answer,
          });
        });
      });
    }
    // 自动滚动到底部
    nextTick(() => {
      const questionList = document.querySelector('#questionList');
      questionList.scrollTop = questionList.scrollHeight + 100;
    });
  } catch (error) {
    console.log('请求历史会话错误', error);
  }
}

// 清除选中回答
// function deleteAnswer(item) {
//   // console.log(item);
//   // IntellectualHistoryApi.deleteHistoryInfo(item.id).then((res) => {
//   //   if (res) {
//   //     this.showDetail(this.chat_id)
//   //   }
//   // })
// }

// 删除选中问题
// function deleteQuestion(item) {
//   console.log(item);
//   // IntellectualHistoryApi.deleteHistoryInfo(item.id).then((res) => {
//   //   if (res) {
//   //     this.showDetail(this.chat_id)
//   //   }
//   // })
// }

// token 加密
const formatToken = (token) => {
  return token ? `Bearer ${token}` : null;
};

// 提交问题
function submit() {
  // 条件判定
  if (conversation.currentIsAnswering) {
    ElMessage.warning('请等待当前的回答完成!');
    return;
  }
  const question = textContent.value;
  if (!question) {
    ElMessage.warning('请输入问题内容');
    return;
  }
  // 重置输入容器
  textContent.value = '';
  questionList.push({
    id: uuidv4(),
    role: 'user',
    content: question,
  });
  conversation.answerId = uuidv4();
  questionList.push({
    id: conversation.answerId,
    role: 'assistant',
    content: '',
  });
  // 自动滚动到底部
  nextTick(() => {
    const questionList = document.querySelector('#questionList');
    questionList.scrollTop = questionList.scrollHeight;
  });
  getChat(question);
}
async function getChat(question: string) {
  let retryCount = 0;
  const maxRetries = 3;
  abortController.value = new AbortController();
  try {
    const accessStore = useAccessStore();
    conversation.currentIsAnswering = true; // 正在回答
    loading.value = true;
    await fetchEventSource(`${import.meta.env.VITE_NSOSSECURITY}/dwt/chatApi`, {
      method: 'POST',
      signal: abortController.value.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: formatToken(accessStore.accessToken),
      },
      body: JSON.stringify({
        question: question,
        sessionId: accessStore.accessToken,
      }),
      onmessage(event) {
        loading.value = false;
        if (event.data) {
          // 检查是否是结束标记
          if (event.data.trim() === '[DONE]') {
            console.log('SSE流结束');
            conversation.currentIsAnswering = false;
            return;
          }
          const dataInfo = JSON.parse(event.data);
          // 更健壮的数据检查
          if (!dataInfo?.choices?.[0]?.delta?.content) {
            console.warn('Unexpected data format:', dataInfo);
            return;
          }
          let answerContent = dataInfo?.choices[0].delta.content;
          const indexOfThink = answerContent.indexOf('</think>');
          // 删除think部分
          if (indexOfThink !== -1) {
            answerContent = answerContent
              .slice(Math.max(0, indexOfThink + '</think>'.length))
              .trim();
          }
          // 处理所有代码块标记（包括不闭合的情况）
          answerContent = answerContent
            .replace(/```[\s\S]*?```/g, '') // 先删除成对的 ```
            .replace(/```[\s\S]*/g, ''); // 再删除剩余的未闭合 ```
          const answer = questionList.find(
            (item) => item.id === conversation.answerId,
          );
          if (answer) {
            answer.content = answerContent;
            // 自动滚动到底部
            nextTick(() => {
              const questionList = document.querySelector('#questionList');
              questionList.scrollTop = questionList.scrollHeight;
            });
          }
        }
      },
      onclose() {
        console.log('SSE连接关闭');
        conversation.currentIsAnswering = false;
      },
      openWhenHidden: true, // 防止浏览器标签页隐藏时断开
      onerror(err) {
        retryCount++;
        if (retryCount >= maxRetries) {
          console.error('达到最大重试次数，停止尝试');
          loading.value = false;
          conversation.currentIsAnswering = false;
          const answer = questionList.find(
            (item) => item.id === conversation.answerId,
          );
          if (answer) {
            answer.content = '网络不可用，请检查连接后重试';
            nextTick(() => {
              const questionList = document.querySelector('#questionList');
              questionList.scrollTop = questionList.scrollHeight;
            });
          }
          // 抛出错误以阻止进一步重试
          throw err;
        }
        return new Promise((resolve) => {
          // 指数退避重试
          const delay = Math.min(1000 * Math.pow(2, retryCount), 30000);
          setTimeout(resolve, delay);
        });
      },
    });
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('请求异常:', error);
    }
    loading.value = false;
    conversation.currentIsAnswering = false;
  }
}

// 复制粘贴
const documentCopy = async (content: string) => {
  // const message = useMessage()
  try {
    // 优先使用现代 Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(content);
      ElMessage.success('复制成功');
      return;
    }
    // 降级方案：使用 textarea + execCommand
    const textArea = document.createElement('textarea');
    textArea.value = content;
    textArea.style.position = 'absolute';
    textArea.style.opacity = '0';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.append(textArea);
    textArea.focus();
    textArea.select();
    const success = document.execCommand('copy');
    textArea.remove();
    if (success) {
      ElMessage.success('复制成功');
    } else {
      throw new Error('execCommand failed');
    }
  } catch {
    ElMessage.warning('无法复制文字到剪贴板，请尝试手动复制');
  }
};

/**
 * 输入框相关方法
 */

// 输入框 高度自适应
function adjustTextareaHeight() {
  const textarea = inputTextarea.value;
  if (!textarea) return; // 添加防御性检查
  if (textContent.value == '') {
    textarea.style.height = 'auto';
    return;
  }
  textarea.style.height = 'auto';
  textarea.style.height = `${textarea.scrollHeight}px`;
  // 安全检查后再调用endsWith
  if (textContent.value && textContent.value.endsWith('\n')) {
    const currentHeight = Number.parseInt(textarea.style.height, 10) || 0;
    textarea.style.height = `${currentHeight + 20}px`;
  }
  // 最大高度限制
  const maxHeight = Number.parseInt(maxTextareaHeight, 10);
  if (textarea.scrollHeight > maxHeight) {
    textarea.style.height = maxTextareaHeight;
    textarea.style.overflowY = 'auto';
  }
}
// 输入框 快捷键换行
function handleEnter(event) {
  // 检查是否按下了 Ctrl 键
  if (event.ctrlKey) {
    // 如果是 Ctrl+Enter，则添加换行符但不发送信息
    textContent.value += '\n';
    nextTick(() => {
      adjustTextareaHeight();
    });
  } else {
    // 否则，发送信息（假设有一个方法叫 submit 来处理发送）
    submit();
    console.log('发送');
  }
}
const focusTextarea = () => {
  nextTick(() => {
    if (inputTextarea.value) {
      inputTextarea.value.focus();
    }
  });
};

/**
 * 弹窗
 */
// 关闭事件
function closeDialog() {
  // 终止进行中的 SSE 请求
  if (abortController.value) {
    abortController.value.abort();
    console.log('SSE 流已终止');
    loading.value = false;
    conversation.currentIsAnswering = false;
  }
  emit('closeDialog');
}
</script>
<template>
  <ElDialog
    v-model="props.openDialog"
    width="500"
    style="border-radius: 20px"
    :style="{
      position: 'fixed',
      top: '20px',
      right: '50px',
      left: 'auto',
      transform: 'none',
      margin: '0',
      padding: '0',
    }"
    class="unique-setheaderBg"
    custom-class="class1"
    draggable
    @close="closeDialog"
  >
    <template #header>
      <div class="dialog-header">
        <div class="dialog-title">智能小助手</div>
      </div>
    </template>
    <div style="background-color: #f4f5f8">
      <div>
        <ElRow
          style="height: 80vh"
          v-loading="loading"
          element-loading-text="正在生成，请稍后..."
        >
          <ElCol :span="24" class="el-container">
            <div class="container-main">
              <div class="card">
                <div id="questionList" style="height: 100%; overflow-y: auto">
                  <div
                    :class="{
                      'gpt-cm': item.role == 'assistant',
                      'my-cm': item.role == 'user',
                    }"
                    v-for="(item, index1) in questionList"
                    :key="index1"
                  >
                    <img
                      class="avater-head"
                      :src="iconAnswer"
                      v-if="item.role == 'assistant'"
                    />
                    <!--                文字转语音-->
                    <div
                      class="content-wrapper"
                      :class="{
                        'info-content': item.role == 'assistant',
                        'my-info-content': item.role == 'user',
                      }"
                      v-loading="index1 === questionList.length - 1 && loading"
                    >
                      <!--                      <vue-markdown class="markdowm" :source="item.content" :html="true"></vue-markdown>-->
                      <div
                        v-html="renderMarkdown(item.content)"
                        style="padding-left: 10px"
                      ></div>
                      <el-icon
                        class="copy-icon"
                        title="复制"
                        @click="documentCopy(item.content)"
                      >
                        <DocumentCopy />
                      </el-icon>
                      <!-- <el-icon
                        style="cursor: pointer; margin-right: 10px"
                        title="清除当前问答"
                        @click="deleteAnswer(item)"
                        v-if="item.role == 'assistant'"
                      >
                        <Delete />
                      </el-icon> -->
                    </div>
                    <img
                      class="avater-head1"
                      :src="iconQuestion"
                      v-if="item.role == 'user'"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div style="position: absolute; bottom: 1vh">
              <div class="input-card">
                <div class="header">
                  <div
                    style="
                      display: flex;
                      align-items: center;
                      padding-left: 20px;
                    "
                  >
                    <img
                      :src="iconAnswerLittle"
                      style="margin-right: 10px; height: 25px"
                    />
                    <span>{{ content }}</span>
                  </div>
                </div>
                <div class="wrapper">
                  <!-- <img
                :src="IconHuaTong"
                @mousedown="touchstart"
                @mouseup="touchend"
                style="width: 21px; margin-left: 2vh; cursor: pointer"
              /> -->
                  <!-- <div class="yourClass">
                <audio-enter></audio-enter>
              </div> -->
                  <textarea
                    v-model="textContent"
                    @click="focusTextarea"
                    @input="adjustTextareaHeight"
                    rows="1"
                    ref="inputTextarea"
                    style="
                      resize: none;
                      width: 40vw;
                      outline: none;
                      border: none;
                      margin-left: 2vh;
                    "
                    @keydown.enter.prevent="handleEnter"
                  ></textarea>
                  <img
                    :src="iconSubmit"
                    style="width: 60px; cursor: pointer"
                    @click="submit"
                  />
                </div>
              </div>
            </div>
          </ElCol>
        </ElRow>
        <!-- <speech-to-text ref="SpeechText" @dataFromChild="dataFromChild" /> -->
      </div>
    </div>
  </ElDialog>
</template>

<style lang="less" scoped>
.dialog-header {
  width: 100%;
  // background: #3D88F2 !important;
  // border-radius: 20px 0 0 0;
  .dialog-title {
    padding-top: 15px;
    font-size: 20px;
    font-weight: 500;
    text-align: center;
    color: rgb(0, 0, 0);
  }
}
.qieHuanIcon {
  margin-left: 10px;
  color: #347fc8;
  font-size: 18px;
  background-color: #ebf5fe;
  border: 1px solid #347fc8;
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.container-header {
  margin-bottom: 1vh;
  display: flex;
  justify-content: center;
  text-align: center;
  font-size: 25px;
  font-weight: bolder;
  margin-top: 3vh;
}

.container-main {
  width: 95%;
  height: 65vh;
  margin: 0 auto;
  padding: 0;
}

.cueWordTitle {
  font-family: PingFang; /* 设置字体为宋体 */
  color: #2676c4; /* 设置字体颜色为蓝色 */
  font-weight: 800;
  font-size: 20px;
  text-align: center; /* 设置文本居中 */
  margin: 0 10vw;
}

.el-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-size: 100% 100%;
  font-family: PingFangSC-Regular;
  font-weight: 600;
  color: rgba(5, 27, 68, 0.98);
  font-size: 18px;
}

.title p {
  margin: 5px 0;
}

.list {
  list-style: none;
  padding-left: 0;
  display: flex;
  margin-bottom: 0 !important;
}

.item {
  background: white;
  border-radius: 10px;
  padding: 2px 20px;
  margin-right: 10px;
  cursor: pointer;
  color: #2a71c9;
}

.item:hover {
  background: #e1eaf4;
}

.card {
  height: 100%;
  padding: 0;
  border: 0;
  overflow-y: auto;
  //max-height: 65vh;
  background-color: transparent;
}

.input-card {
  width: 450px;
  margin: 0px auto;
  border-radius: 10px;
  background: #ffffff;
  border-radius: 26px;
  border: 1px solid #2378ff;
}

.header {
  height: 30px;
  background: rgb(52 127 200);
  border-radius: 28px 28px 0px 0px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #ffffff;
  font-size: 15px;
}

.wrapper {
  display: flex;
  align-items: center;
  margin: 1vh;
}

.gpt-cm {
  //   margin-left: 2vh;
  margin-top: 1vh;
  vertical-align: top;
  position: relative;
  align-items: flex-start;
  display: flex;
}

.my-cm {
  margin-top: 1vh;
  vertical-align: top;
  position: relative;
  align-items: flex-start;
  display: flex;
  justify-content: flex-end;
}

.avater-head {
  width: 5vh;
  height: 5vh;
}

.avater-head1 {
  width: 5.5vh;
  height: 5.5vh;
}

.tuijian {
  margin-bottom: 1vh;
}

.info-content {
  /* margin-top: 10vh; */
  margin-left: 2vh;
  word-break: break-all;
  display: inline-block;
  padding: 15px;
  max-width: 330px;
  font-size: 16px;
  font-weight: 500;
  position: relative;
  margin-top: 8px;
  background: #ffffff;
  border-radius: 4px;
  padding-bottom: 0;
  line-height: 1.5;
  color: #3b3c3cfb;
}

.info-content::before {
  position: absolute;
  left: -8px;
  top: 8px;
  content: '';
  border-right: 10px solid #ffffff;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
}

.my-info-content {
  margin-right: 2vh;
  text-align: left;
  word-break: break-all;
  display: inline-block;
  padding: 15px;
  max-width: 330px;
  font-size: 16px;
  font-weight: 500;
  background: rgb(191, 211, 243);
  position: relative;
  margin-top: 8px;
  border-radius: 4px;
  padding-bottom: 0;
  background: rgb(52 127 200);
  box-shadow: 0px 5px 20px 0px rgba(75, 105, 171, 0.04);
  border-radius: 8px;
  opacity: 0.9;
  color: #ffffff;

  word-wrap: break-word; /* 强制长单词换行 */
  overflow-wrap: break-word; /* 更智能的换行方式 */
  white-space: normal; /* 覆盖可能的 pre 设置 */
  overflow: hidden; /* 隐藏溢出内容 */
}
.my-info-content::after {
  position: absolute;
  right: -1vh;
  top: 1vh;
  content: '';
  border-left: 10px solid rgb(52 127 200);
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
}
.content-wrapper {
  position: relative;
  padding-bottom: 10px; /* 为图标留出空间 */
}

// 复制图标
.copy-icon {
  position: absolute;
  right: 10px;
  bottom: 0px;
  cursor: pointer;
  opacity: 0;
  // transition:
  //   opacity 0.2s ease-in,       /* 鼠标悬停时，0.2s 淡入 */
  //   opacity 10s ease-out 0.2s;  /* 鼠标离开后，20s 淡出（0.2s 延迟） */
  color: #3b3c3c;
}
.my-info-content:hover .copy-icon {
  opacity: 1;
  transition: opacity 0.2s ease-in;
}
.info-content:hover .copy-icon {
  opacity: 1;
  transition: opacity 0.2s ease-in;
}

:deep(p) {
  margin-bottom: 0.5rem;
}
</style>
<style lang="less">
.unique-setheaderBg {
  .el-dialog__header {
    border-radius: 20px 20px 0 0;
    background: #3d88f2 !important;
    // border-radius: 0 20px 0 0;
    // padding: 0; // 移除默认 padding 确保全覆盖
  }
  .el-dialog__headerbtn {
    padding-top: 15px;
    .el-icon svg {
      color: black;
      font-size: 30px;
    }
  }
}
</style>
