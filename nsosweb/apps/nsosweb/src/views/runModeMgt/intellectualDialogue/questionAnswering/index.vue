<script setup lang="ts">
import {
  ElTable,
  ElTableColumn,
  ElContainer,
  ElFormItem,
  ElDialog,
  ElForm,
  ElInput,
  ElButton,
  ElSelect,
  ElRow,
  ElCol,
  ElPagination,
  ElMessage,
  ElMessageBox,
  type FormInstance,
} from 'element-plus';
import {
  Search,
  RefreshLeft,
  Delete,
  Download,
  Monitor,
  CirclePlus,
  CircleCheck,
  DocumentCopy,
} from '@element-plus/icons-vue';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import VueMarkdown from 'markdown-it';
import { v4 as uuidv4 } from 'uuid';
import { reactive, ref, onMounted, nextTick } from 'vue';
import iconAnswer from '#/assets/images/intellectualDialogue/answer.png';
import iconQuestion from '#/assets/images/intellectualDialogue/question.png';
import iconAnswerLittle from '#/assets/images/intellectualDialogue/answerLittle.png';
import iconSubmit from '#/assets/images/intellectualDialogue/submit.png';
import IconHuaTong from '#/assets/images/intellectualDialogue/huaTong.png';
import LeftDrawer from '../components/leftDrawer.vue';
import SpeechToText from '../components/speechToText.vue';
import axios from 'axios';

const loading = ref(false);
const questionList = reactive([]);
const textContent = ref(null); // 输入内容
const height = ref(null); // 问答界面高度
const content = ref('请在此处向AI提问');
const historyList = reactive([
  {
    id: '1',
    intelligentTitle: '今天的日期是什么',
    questionList: [
      {
        id: 'sss',
        content: '今天的日期是什么',
        type: 'question',
      },
      {
        id: 'tttt',
        content: '今天是 2025 年 5 月 12 日，星期一',
        type: 'answer',
      },
    ],
  },
  {
    id: '2',
    intelligentTitle: 'SQL注入攻击解释',
    questionList: [
      {
        id: 'sss',
        content: 'SQL注入攻击解释',
        type: 'question',
      },
      {
        id: 'tttt',
        content:
          'SQL注入攻击是通过在用户输入中插入恶意SQL代码，欺骗数据库执行非预期命令的攻击手段，可导致数据泄露、篡改或删除',
        type: 'answer',
      },
    ],
  },
]);
const myAudio = ref(null);
const SpeechText = ref(null); // 创建模板引用
const inputTextarea = ref(null);

onMounted(() => {
  myAudio.value = document.getElementById('myAudio');
  if (!navigator.getUserMedia) {
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;
  }
});

/**
 *以下markdown配置
 */
const md = new VueMarkdown({
  // 可以在这里配置 markdown-it 的选项
  linkify: true, // 自动将 URL 转换为链接
  typographer: true,
  html: true,
});
function renderMarkdown(markdownText) {
  // this.md.use(markdownItKatex);
  // 自定义渲染规则，例如为a链接添加点击事件
  md.renderer.rules.link_open = (tokens, idx) => {
    const hrefIndex = tokens[idx].attrIndex('href');
    if (hrefIndex !== -1) {
      //找到了链接地址
      const href = tokens[idx].attrs[hrefIndex][1];
      return `<a href="${href}" target="_blank">`;
    }
    return '<a>';
  };
  // return this.md.render('[访问示例网站](https://www.example.com)')
  return md.render(markdownText); // 将Markdown转换为HTML
}

const submit = async () => {
  const question = textContent.value;
  if (!question) {
    ElMessage.warning('请输入问题内容');
    return;
  }

  // 添加用户问题到列表
  const questionNode = {
    id: uuidv4(),
    type: 'question',
    content: question,
  };
  questionList.push(questionNode);

  // 添加初始回答节点
  const answerId = uuidv4();
  const answerNode = {
    id: answerId,
    type: 'answer',
    content: '',
  };
  questionList.push(answerNode);
  textContent.value = '';
  // loading.value = true;

  try {
    await fetchEventSource('http://127.0.0.1:5000/sse-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }), // 只传递question参数
      onmessage(ev) {
        if (ev.data) {
          // 直接使用返回的文本内容（非JSON格式）
          // console.log('接收内容', ev.data)
          // answer.content += ev.data;
          const answer = questionList.find((item) => item.id === answerId);
          if (answer) {
            answer.content += ev.data;
            // 自动滚动到底部
            nextTick(() => {
              // height.value = document.getElementById('questionList').scrollHeight
              // console.log('高度', height.value)
              const questionList = document.getElementById('questionList');
              questionList.scrollTop = questionList.scrollHeight;
            });
          }
        }
      },
      onclose() {
        loading.value = false;
        const answer = questionList.find((item) => item.id === answerId);
        if (answer) answer.loading = false;
      },
      onerror(err) {
        console.error('SSE请求错误:', err);
        loading.value = false;
        const answer = questionList.find((item) => item.id === answerId);
        if (answer) {
          answer.content = '回答生成失败，请重试';
          answer.loading = false;
        }
      },
    });
  } catch (error) {
    console.error('请求异常:', error);
    loading.value = false;
  }
};
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
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const success = document.execCommand('copy');
    textArea.remove();
    if (success) {
      ElMessage.success('复制成功');
    } else {
      throw new Error('execCommand failed');
    }
  } catch (err) {
    ElMessage.warning('无法复制文字到剪贴板，请尝试手动复制');
  }
};

// 清除回答
function deleteAnswer(item) {
  console.log(item);
  // IntellectualHistoryApi.deleteHistoryInfo(item.id).then((res) => {
  //   if (res) {
  //     this.showDetail(this.chat_id)
  //   }
  // })
}

/**
 * 下面是语音输入方法
 */
function touchstart() {
  content.value = '正在聆听';
  SpeechText.value?.startRecorder(); // 使用可选链操作符确保安全调用
}
function touchend() {
  content.value = '聆听结束';
  SpeechText.value?.stopRecorder();
}
function dataFromChild(val) {
  inputTextarea.value = val;
}

/**
 * 历史对话方法
 */

function toTest() {}

/**
 * 历史对话方法
 */
// 展示历史对话
function showDetail(chat_id) {
  const chat_item = historyList.find((item) => item.id === chat_id);
  questionList.length = 0; // 清空数组
  questionList.push(...chat_item.questionList); // 添加新内容
}

function addChat() {
  // if (this.currentIsAnswering) {
  //   useMessage().warning('请先等待当前对话回答结束')
  //   return
  // }
  // chat_id = null
  // currentConversationId = null
  questionList.length = 0;
}
</script>
<template>
  <div>
    <!-- <div
      style="
        height: 40px;
        width: 60px;
        position: fixed;
        right: 0;
        bottom: 200px;
        z-index: 1100;
      "
    >
      <img
        :src="iconAnswerLittle"
        title="智能问答"
        style="cursor: pointer; margin-right: 20px"
        @click="toTest"
      />
    </div> -->
    <el-row
      style="height: 90vh"
      v-loading="loading"
      element-loading-text="正在生成，请稍后..."
    >
      <el-col :span="4">
        <left-drawer
          ref="child"
          :historyList="historyList"
          :currentIsAnswering="currentIsAnswering"
          @showDetail="showDetail"
          @deleteChat="deleteChat"
        />
      </el-col>
      <el-col :span="20" class="el-container">
        <div class="container-main">
          <div class="card">
            <div id="questionList" style="height: 100%; overflow-y: auto">
              <div
                :class="{
                  'gpt-cm': item.type == 'answer',
                  'my-cm': item.type == 'question',
                }"
                v-for="(item, index1) in questionList"
                :key="index1"
              >
                <img
                  class="avater-head"
                  :src="iconAnswer"
                  v-if="item.type == 'answer'"
                />
                <!--                文字转语音-->
                <div
                  :class="{
                    'info-content': item.type == 'answer',
                    'my-info-content': item.type == 'question',
                  }"
                >
                  <!--                      <vue-markdown class="markdowm" :source="item.content" :html="true"></vue-markdown>-->
                  <div
                    v-html="renderMarkdown(item.content)"
                    style="padding-left: 10px"
                  ></div>
                  <el-icon
                    style="cursor: pointer; margin-right: 10px"
                    title="复制"
                    @click="documentCopy(item.content)"
                  >
                    <DocumentCopy />
                  </el-icon>
                  <el-icon
                    style="cursor: pointer; margin-right: 10px"
                    title="清除当前问答"
                    @click="deleteAnswer(item)"
                    v-if="item.type == 'answer'"
                  >
                    <Delete />
                  </el-icon>
                </div>
                <img
                  class="avater-head1"
                  style="margin-right: 2vh"
                  :src="iconQuestion"
                  v-if="item.type == 'question'"
                />
              </div>
            </div>
          </div>
          <audio ref="myAudio" style="display: none" controls></audio>
        </div>
        <div style="position: absolute; bottom: 1vh">
          <!-- <div style="display: inline-block; margin-left: 20px">
            <input
              type="file"
              @change="handleImageChange"
              ref="imageInput"
              style="display: none"
              accept="image/*"
            />
            <el-button
              type="primary"
              color="#347fc8"
              @click="triggerImageInput"
              style="margin-bottom: 1vh; margin-right: 1vh"
              title="点击上传"
            >
              <el-icon>
                <Upload />
              </el-icon>
              图像
            </el-button>
            <span style="font-weight: lighter; color: #909399">
              {{
                selectedImage ? selectedImage.name + '......' : '暂未上传图像'
              }}
              <el-icon
                class="custom-icon"
                @click="deleteImage"
                v-if="selectedImage"
                ><CircleClose
              /></el-icon>
            </span>
          </div> -->
          <div class="input-card">
            <div class="header">
              <div
                style="display: flex; align-items: center; padding-left: 20px"
              >
                <img :src="iconAnswerLittle" style="margin-right: 20px" />
                <span>{{ content }}</span>
              </div>
              <div class="item" @click="addChat()" style="margin-right: 20px">
                {{ '+新建对话' }}
              </div>
            </div>
            <div class="wrapper">
              <img
                :src="IconHuaTong"
                @mousedown="touchstart"
                @mouseup="touchend"
                style="width: 21px; margin-left: 2vh; cursor: pointer"
              />
              <div class="yourClass">
                <audio-enter></audio-enter>
              </div>
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
                style="width: 63px; cursor: pointer"
                @click="submit"
              />
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <speech-to-text ref="SpeechText" @dataFromChild="dataFromChild" />
  </div>
</template>

<style lang="less" scoped>
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
  width: 50vw;
  margin: 0px auto;
  border-radius: 10px;
  background: #ffffff;
  border-radius: 26px;
  border: 1px solid #2378ff;
}

.header {
  docke: 46px;
  background: rgb(52 127 200);
  border-radius: 28px 28px 0px 0px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #ffffff;
}

.wrapper {
  display: flex;
  align-items: center;
  margin: 2vh;
}

.gpt-cm {
  margin-left: 2vh;
  margin-top: 2vh;
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
  width: 8vh;
  height: 8vh;
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
  max-width: 76%;
  font-size: 16px;
  font-weight: 600;
  position: relative;
  margin-top: 8px;
  background: #ffffff;
  border-radius: 4px;
  padding-bottom: 0;
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
  max-width: 76%;
  font-size: 16px;
  font-weight: 500;
  background: rgb(191, 211, 243);
  position: relative;
  margin-top: 8px;
  background: rgb(191, 211, 243);
  border-radius: 4px;
  padding-bottom: 0;
  background: rgb(52 127 200);
  box-shadow: 0px 5px 20px 0px rgba(75, 105, 171, 0.04);
  border-radius: 8px;
  opacity: 0.9;
  color: #ffffff;
}

:deep(p) {
  margin-bottom: 0.5rem;
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
</style>
