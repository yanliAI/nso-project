<template>
  <div class="fill-whole-white gzfpxq-page">
    <component :is="mydetail.layout" :title="mydetail.title" :anchors="anchors">
      <!-- 顶部标题栏和操作栏 -->
      <template #head>
        <div class="gzfpxq-operate-bar">
          <div class="gzfpxq-operate-bar-gzdh">
            <label>故障单号：</label>
            <span class="primary">{{ mydata.faultCode }}</span>
            <el-icon class="primary" style="margin-left: 3px; cursor: pointer" title="复制" @click="copyFaultCode(mydata.faultCode)"><CopyDocument /></el-icon>
          </div>
          <div class="gzfpxq-operate-bar-wtly">
            <label>问题来源：</label>
            <span>{{ mydata.faultFrom }}</span>
          </div>
          <div class="gzfpxq-operate-bar-btn">
            <el-button type="primary" plain size="small" :icon="Finished" @click="testbtn">复盘完成</el-button>
          </div>
        </div>
      </template>

      <!-- 故障信息 -->
      <template #modhead1>
        <div class="gzfpxq-modhead-slot">
          <el-button type="primary" plain size="small" :icon="DocumentChecked" @click="saveGzxx">保存</el-button>
        </div>
      </template>
      <template #modarea1>
        <div class="gzfpxq-modarea-slot">
          <el-form label-width="100px" label-suffix=":" ref="myform" :rules="formRules" :model="mydetail.formdata" label-position="right" class="demo-form-inline mt-2">
            <el-row>
              <el-col :span="24">
                <el-form-item label="故障关键字" prop="keyword">
                  <fault-keyword-select v-model:value="mydetail.formdata.keyword" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
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
import { Finished, RefreshLeft, DocumentChecked, Upload, Download, Plus, Edit, Delete, CopyDocument } from '@element-plus/icons-vue'
import { copyText } from '#/utils/commonUtil.ts'
import { ElMessage } from 'element-plus'
import detailLayout from '/src/component/common/detailLayout.vue'
import faultKeywordSelect from '/src/views/runDdMgt/faultMgt/faultKeyword/faultKeywordSelect.vue'

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

const myform = ref(null)
const formRules = reactive({
  keyword: [{ required: true, message: '请选择故障关键字', trigger: 'blur' }]
})

onMounted(async () => {
  queryFaultDetail()
})

// 复制单号
const copyFaultCode = async (text) => {
  if (copyText(text)) {
    ElMessage.success(text + '已复制到剪切板！')
  }
}

// 查询详情
const queryFaultDetail = async () => {
  // mydetail.title = props.faultId
  mydetail.layout = detailLayout
}

const testbtn = async () => {
  console.log('keyword:', mydetail.formdata.keyword)
}

const saveGzxx = async () => {
  try {
    await myform.value.validate()
    ElMessage.success('校验通过！')
  } catch (error) {
    ElMessage.error('请检查表单填写是否正确！')
  }
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
  padding-right: 20px;
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
  height: 100px;
}
</style>
