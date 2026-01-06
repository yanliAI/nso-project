<template>
  <div>
    <div class="alarm-analysis">
      <div class="flex items-center" style="margin-top: 10px">
        <div class="tag-line"></div>
        <span>告警解读</span>
        <el-icon style="margin-left: 5px"><DocumentCopy /></el-icon>
      </div>
      <div>
        <p
          v-for="(line, index) in displayedGjjdText"
          :key="index"
          v-html="line"
        ></p>
        <!-- <p class="title">
          告警标题：{{ alertDetail.alertName }} 警告类型：{{
            alertDetail.alertCatLevel1Name
          }}
          源IP地址：{{ alertDetail.attackerIp }} 源端口： 告警次数：{{
            alertDetail.alertCount
          }}
          目标IP地址：{{ alertDetail.victimIp }} 目标端口： 设备主人：{{
            alertDetail.deviceOwner
          }}
          设备名称：{{ alertDetail.deviceName }} 首次告警时间：{{
            alertDetail.firstAlertTime
          }}
          最后告警时间：{{ alertDetail.latestAlertTime }} 处置状态：{{
            statusMap[alertDetail.disposeStatusCd]
          }}
        </p>
        <p>根据提供的告警信息，我们可以进行以下分析：</p>
        <p>
          {{ alertDetail.alertDesc }}
        </p> -->
      </div>
    </div>
    <!-- 画像分析删除 -->
    <!-- <div class="pic-analysis">
      <div class="flex items-center">
        <div class="tag-line"></div>
        <span>画像分析</span>
      </div>

      <el-row :gutter="30" style="margin-top: 10px">
        <el-col :span="12">
          <div class="aggressor flex">
            <div class="tag-name">攻击者画像</div>

            <el-image
              src="/images/person.jpeg"
              style="width: 30px; height: 30px; margin: 35px 15px"
            ></el-image>

            <div class="pic-item-con">
              <div class="pic-item flex">
                <p>攻击组织</p>
                <span style="color: #999"></span>
              </div>
              <div class="pic-item flex">
                <p>情报置信度</p>
                <span style="color: #999"></span>
              </div>
              <div class="pic-item flex">
                <p>攻击者IP</p>
                <span class="pic-item-ip"> {{ alertDetail.attackerIp }}</span>
              </div>
              <div class="pic-item flex">
                <p>地理位置</p>
                <span style="color: #999">
                  {{ alertDetail.attackerCountryName }}
                  {{ alertDetail.attackerProvinceName }}
                  {{ alertDetail.attackerDistrictMame }}
                </span>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="victim flex">
            <div class="tag-name" style="background-color: #79838e">
              受害者画像
            </div>

            <el-image
              src="/images/person.jpeg"
              style="width: 30px; height: 30px; margin: 35px 15px"
            ></el-image>

            <div class="pic-item-con">
              <div class="pic-item flex">
                <p>资产域</p>
                <span style="color: #999; margin-left: 5px"></span>
              </div>
              <div class="pic-item flex">
                <p>资产名称</p>
                <span style="color: #999; margin-left: 5px">
                  {{ alertDetail.victimAssetName }}
                </span>
              </div>
              <div class="pic-item flex">
                <p>受害者IP</p>
                <span class="pic-item-ip">{{ alertDetail.victimIp }}</span>
              </div>
              <div class="pic-item flex">
                <p>漏洞描述</p>
                <span style="color: #999; margin-left: 5px"></span>
              </div>
              <div class="pic-item flex">
                <p>历史攻击事件</p>
                <span style="color: #999; margin-left: 5px"></span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div> -->

    <div class="attack-lines" v-if="linesVisible">
      <div class="flex items-center" style="margin-top: 10px">
        <div class="tag-line"></div>
        <span>攻击路径</span>
        <el-icon style="margin-left: 5px"><DocumentCopy /></el-icon>
      </div>
      <div class="container">
        <pre class="mermaid"></pre>
      </div>
    </div>
    <div class="disposal-proposal" v-if="czjyVisible">
      <div class="flex items-center" style="margin-top: 10px">
        <div class="tag-line"></div>
        <span>处置建议</span>
        <el-icon style="margin-left: 5px"><DocumentCopy /></el-icon>
      </div>
      <div>
        <p
          v-for="(line, index) in displayedCzjyText"
          :key="index"
          v-html="line"
        ></p>
        <!-- <p>
          1.<span>隔离源IP：</span>立即隔离{{
            alertDetail.attackerIp
          }}，防止进一步的恶意活动。
        </p>
        <p>
          2.<span>分析源IP：</span>分析源IP:对源IP进行详细的安全审核，查找其他恶意活动迹象，如异常进程、文件篡改等。
        </p>
        <p>
          3.<span>保护目标IP：</span>保护目标IP:对目标IP
          {{
            alertDetail.victimIp
          }}进行紧急安全检查，查找webshel并清除，同时检查是否有数据泄露。
        </p>
        <p>
          4.<span>修复漏洞：</span>修复漏洞:确保所有系统都已更新补丁，防止类似攻击再次发生。
        </p>
        <p>
          5.<span>加强监控：</span>加强监控:增加对关键资产的监控，以便及时发现并响应未来攻击。
        </p> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  ElTabs,
  ElTabPane,
  ElTable,
  ElTableColumn,
  ElFormItem,
  ElForm,
  ElInput,
  ElRow,
  ElImage,
  ElCol,
  ElButton,
  ElSelect,
  ElOption,
  ElPagination,
  ElContainer,
  ElMain,
  ElFooter,
  ElMessage,
  ElMessageBox,
} from 'element-plus';
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
import { getAlertDetailApi } from '#/api';

defineOptions({
  name: 'WallChartAlarmDetail',
});
const emit = defineEmits(['afterDisplayText']);
// 父组件传入的系统名称
const alertId = defineModel('alertId');
const openType = defineModel('openType');
const alertDetail = ref({
  attackerIp: '',
  victimIp: '',
});
const statusMap = {
  1: '待处置',
  2: '处置中',
  3: '不处置',
  4: '误报',
  5: '已处置',
};
// 告警解读
const displayedGjjdText = ref([]);
// 处置建议
const displayedCzjyText = ref([]);
const currentLine = ref(0);
const currentChar = ref(0);
const linesVisible = ref(false);
const czjyVisible = ref(false);
let typingInterval = null;

const gjjdText = ref([]);
const czjyText = ref([]);
// 攻击路径代码
const mermaidCode = ref(`

graph TD
    subgraph 攻击路径
        A[攻击者IP 114.132.249.151] --> B[DMZ区天眼分析平台#2 10.90.130.104]
        B --> C[受害者IP 14.23.143.236]
        D[攻击者IP 47.100.227.174] --> E[天眼分析平台 10.92.205.50]
        E --> C
        F[攻击者IP 47.116.45.95] --> E
        G[攻击者IP 47.113.151.69] --> B
    end

    %% 路径样式
    linkStyle 0 stroke:#ff0000
    linkStyle 1 stroke:#ff0000
    linkStyle 2 stroke:#ff0000
    linkStyle 3 stroke:#ff0000
    linkStyle 4 stroke:#ff0000
    linkStyle 5 stroke:#ff0000

`);

watch(
  alertDetail,
  (newVal) => {
    const alertName = newVal.alertName ?? '';
    const alertCatLevel1Name = newVal.alertCatLevel1Name ?? '';
    const attackerIp = newVal.attackerIp ?? '';
    const alertCount = newVal.alertCount ?? '';
    const victimIp = newVal.victimIp ?? '';
    const deviceOwner = newVal.deviceOwner ?? '';
    const deviceName = newVal.deviceName ?? '';
    const firstAlertTime = newVal.firstAlertTime ?? '';
    const latestAlertTime = newVal.latestAlertTime ?? '';
    const status = statusMap[newVal.disposeStatusCd] ?? '';
    const alertDesc = newVal.alertDesc ?? '';

    gjjdText.value = [
      //   `告警标题：${alertName} 警告类型：${alertCatLevel1Name} 源IP地址：${attackerIp} 源端口：告警次数：${alertCount}
      // 目标IP地址：${victimIp} 目标端口：设备主人：${deviceOwner} 设备名称：${deviceName} 首次告警时间：${firstAlertTime}
      // 最后告警时间：${latestAlertTime} 处置状态：${status}`,
      `1. 告警解读:本次告警涉及多起​​SQL注入攻击​​事件，攻击者通过构造恶意SQL语句尝试非法访问或篡改数据库。`,
      ` ​​攻击特征​​：攻击者利用未严格过滤的SQL查询参数，通过远程方式向目标系统（受害者IP 14.23.143.236）发起攻击，部分攻击已失败或被标记为企图。<br/>
 ​​攻击路径​​：攻击者通过不同IP（如114.132.249.151、47.100.227.174等）发起攻击，均经过中间设备（如DMZ区天眼分析平台#2、天眼分析平台），最终指向受害者IP。<br/>
关键风险​​：中间设备（如10.90.130.104、10.92.205.50）可能被作为跳板，需检查其安全配置；受害者系统（14.23.143.236）存在潜在漏洞，需紧急排查。`,
    ];
    czjyText.value = [
      `1. ​​紧急封堵措施​​： ​​封锁攻击者IP​​：立即在防火墙或WAF中阻断114.132.249.151、47.100.227.174、47.116.45.95、47.113.151.69的访问。<br/>
    ​​检查中间设备​​：对DMZ区天眼分析平台#2 (10.90.130.104)和天眼分析平台 (10.92.205.50)进行日志审计，确认是否被植入后门或存在配置漏洞。`,
      `2.受害者系统加固​​： ​​输入过滤与参数化查询​​：在应用程序中强制使用参数化查询（如Prepared Statements），并对用户输入进行严格过滤（如过滤'、;等特殊字符）。<br/>漏洞扫描与修复​​：对受害者IP 14.23.143.236关联的数据库和Web应用进行全面漏洞扫描，修复已知SQL注入漏洞。`,
      `3.长期防护建议​​：​​强化访问控制​​：限制DMZ区设备的公网暴露面，仅允许必要IP访问数据库服务。<br/>
    ​​启用WAF规则​​：在Web应用防火墙中启用SQL注入防护规则，并定期更新规则库。<br/>
    ​​安全培训与演练​​：对开发人员和运维团队进行安全编码培训，定期模拟攻击演练以提升应急响应能力。`,
      `4.溯源与监控​​：日志留存与分析​​：保留攻击期间的完整日志，结合威胁情报分析攻击者归属及潜在关联攻击。<br/>
    ​​部署探针监控​​：利用天眼探针加强对异常流量的实时监控，设置告警阈值以便快速响应后续攻击。`,
    ];
  },
  { immediate: true },
); // immediate: true 确保在初始时也会执行一次

const startGjjdTyping = () => {
  // 初始化显示空行
  displayedGjjdText.value = Array(gjjdText.value.length).fill('');

  typingInterval = setInterval(() => {
    if (currentLine.value >= gjjdText.value.length) {
      currentLine.value = 0;
      currentChar.value = 0;
      clearInterval(typingInterval);
      linesVisible.value = true;
      nextTick(() => {
        mermaid.initialize({ startOnLoad: false });
        // 渲染所有Mermaid图表
        const elements = document.querySelectorAll('.mermaid');
        elements.forEach(async (element) => {
          try {
            const { svg } = await mermaid.render(
              'mermaid-svg',
              mermaidCode.value,
            );
            element.innerHTML = svg;
          } catch (error) {
            console.error('Mermaid渲染错误:', error);
          }
        });
        czjyVisible.value = true;
        startCzjyTyping();
      });

      return;
    }

    // 当前行未完成
    if (currentChar.value < gjjdText.value[currentLine.value].length) {
      displayedGjjdText.value[currentLine.value] +=
        gjjdText.value[currentLine.value][currentChar.value];
      currentChar.value++;
    }
    // 当前行已完成，转到下一行
    else {
      currentLine.value++;
      currentChar.value = 0;
    }
  }, 10); // 调整打字速度
};

const startCzjyTyping = () => {
  // 初始化显示空行
  displayedCzjyText.value = Array(czjyText.value.length).fill('');

  typingInterval = setInterval(() => {
    if (currentLine.value >= czjyText.value.length) {
      clearInterval(typingInterval);
      emit('afterDisplayText');
      return;
    }

    // 当前行未完成
    if (currentChar.value < czjyText.value[currentLine.value].length) {
      displayedCzjyText.value[currentLine.value] +=
        czjyText.value[currentLine.value][currentChar.value];
      currentChar.value++;
    }
    // 当前行已完成，转到下一行
    else {
      currentLine.value++;
      currentChar.value = 0;
    }
  }, 10); // 调整打字速度
};

const queryDetail = async () => {
  try {
    alertDetail.value = await getAlertDetailApi(alertId.value[0]);
    if (openType.value == 0) {
      await startGjjdTyping();
    } else {
      displayedGjjdText.value = gjjdText.value;
      displayedCzjyText.value = czjyText.value;
    }
  } catch {
    displayedGjjdText.value = gjjdText.value;
    displayedCzjyText.value = czjyText.value;
    emit('afterDisplayText');
  }
};

onMounted(() => {
  queryDetail();
});
onUnmounted(() => {
  clearInterval(typingInterval);
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
  max-height: 280px;
  padding: 0 0 15px 10px;
  color: white;
  font-size: 16px;
  border: 1px solid #a5a3a3;
  border-radius: 3px;
  overflow: scroll;
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
