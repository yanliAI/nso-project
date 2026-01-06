<template>
  <div class="fill-whole-white gzfpxq-page">
    <component :is="mydetail.layout" :title="mydetail.title" :anchors="anchors">
      <!-- 顶部标题栏和操作栏 -->
      <template #head>
        <div class="gzfpxq-operate-bar">
          <div class="gzfpxq-operate-bar-gzdh">
            <label>故障单号：</label>
            <span class="primary">{{ mydata.faultCode }}</span>
          </div>
          <div class="gzfpxq-operate-bar-wtly">
            <label>问题来源：</label>
            <span>{{ mydata.faultFrom }}</span>
          </div>
          <div class="gzfpxq-operate-bar-btn">
            <el-button type="primary" plain size="small" :icon="Finished" @click="">复盘完成</el-button>
          </div>
        </div>
      </template>

      <!-- 故障信息 -->
      <template #modhead1>
        <div class="gzfpxq-modhead-slot">
          <el-button type="primary" plain size="small" :icon="DocumentChecked" @click="">保存</el-button>
        </div>
      </template>
      <template #modarea1>
        <div class="gzfpxq-modarea-slot">1111111</div>
      </template>

      <!-- 技术复盘 -->
      <template #modhead2>
        <div class="gzfpxq-modhead-slot">
          <el-button type="primary" plain size="small" :icon="DocumentChecked" @click="">保存</el-button>
          <el-button type="primary" plain size="small" :icon="Download" @click="">导出到报告</el-button>
        </div>
      </template>
      <template #modarea2>
        <div class="gzfpxq-modarea-slot">1111111</div>
      </template>

      <!-- 故障简报 -->
      <template #modhead3>
        <div class="gzfpxq-modhead-slot">
          <el-button type="primary" plain size="small" :icon="DocumentChecked" @click="">保存</el-button>
          <el-button type="primary" plain size="small" :icon="RefreshLeft" @click="">刷新</el-button>
        </div>
      </template>
      <template #modarea3>
        <div class="gzfpxq-modarea-slot">1111111</div>
      </template>

      <!-- 故障分析报告 -->
      <template #modhead4>
        <div class="gzfpxq-modhead-slot">
          <el-button type="primary" plain size="small" :icon="DocumentChecked" @click="">保存</el-button>
          <el-button type="primary" plain size="small" :icon="RefreshLeft" @click="">刷新</el-button>
        </div>
      </template>
      <template #modarea4>
        <div class="gzfpxq-modarea-slot">1111111</div>
      </template>

      <!-- 故障整改 -->
      <template #modhead5>
        <div class="gzfpxq-modhead-slot">
          <el-button type="primary" plain size="small" :icon="DocumentChecked" @click="">保存</el-button>
          <el-button type="primary" plain size="small" :icon="Upload" @click="">导入措施</el-button>
        </div>
      </template>
      <template #modarea5>
        <div class="gzfpxq-modarea-slot">1111111</div>
      </template>
    </component>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Finished, RefreshLeft, DocumentChecked, Upload, Download, Plus, Edit, Delete } from '@element-plus/icons-vue'
import detailLayout from '/src/component/common/detailLayout.vue'

const props = defineProps({
  faultId: String
})

const anchors = ref(['故障信息', '技术复盘', '故障简报', '故障分析报告', '故障整改'])
const mydetail = reactive({
  layout: null,
  title: '故障复盘详情',
  formdata: {}
})
const mydata = reactive({
  faultCode: 'GZ20250430001',
  faultFrom: '网级运调监测'
})

onMounted(async () => {
  queryFaultDetail()
})

// 查询详情
const queryFaultDetail = async () => {
  // mydetail.title = props.faultId
  mydetail.layout = detailLayout
}
</script>
<style scoped>
.primary {
  color: hsl(var(--primary));
}

.gzfpxq-page {
  font-size: 12px;
}

.gzfpxq-operate-bar {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

.gzfpxq-operate-bar-gzdh {
  width: 25%;
}

.gzfpxq-operate-bar-wtly {
  width: 50%;
}

.gzfpxq-operate-bar-wtly > span {
  color: #8e8e93;
}

.gzfpxq-operate-bar-btn {
  flex-grow: 1;
  text-align: right;
}

.gzfpxq-modhead-slot {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: end;
}

.gzfpxq-modarea-slot {
  width: 100%;
}
</style>
