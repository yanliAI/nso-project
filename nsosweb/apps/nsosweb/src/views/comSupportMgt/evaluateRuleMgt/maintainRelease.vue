<template>
  <Page auto-content_height>
    <div class="main-dg">
      <div class="ma-tabm">
        <div ref="containerRef" class="btm-d">
          <div class="flex items-center primary text-base">
            <Expand class="w-5 h-5"></Expand>
            <div class="ml-1 font-bold">发布内容</div>
          </div>
          <div id="part1" class="part-b">
            <div class="w-full h-full pt-2">
              <el-form label-width="auto" ref="ruleFormRef" :model="formData" :rules="formRules" :inline="true" label-position="right" class="demo-form-inline">
                <el-row class="row-space">
                  <el-col :span="8">
                    <el-form-item label="评价维度:" prop="evaluateTimeType">
                      <el-select v-model="formData.evaluateTimeType" filterable clearable>
                        <el-option v-for="item in dropList.NSOS_EVALUATE_TIMETYPE" :key="item.value" :label="item.label" :value="item.value"/>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="评价年月:" prop="evaluateMonth">
                      <el-date-picker v-model="formData.evaluateMonth" :type="formData.evaluateTimeType == '1' ? 'month' : 'year'" :disabled-date="disabledDate" clearable/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="自评截止时间:" prop="selfEvaluateDeadline">
                      <el-date-picker v-model="formData.selfEvaluateDeadline" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" clearable/>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="row-space">
                  <el-col :span="24">
                    <el-form-item label="评价名称:" prop="evaluateName">
                      <el-input v-model="formData.evaluateName" clearable/>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="row-space">
                  <el-col :span="24">
                    <el-form-item label="评价单位:" prop="evaluateUnit">
                      <el-select v-model="formData.evaluateUnit" multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="5" clearable filterable class="ml-0">
                        <el-option v-for="item in dropList.NSOS_ORG_NAME" :key="item.value" :label="item.label" :value="item.value"/>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="row-space">
                  <el-col :span="24">
                    <el-form-item label="备注说明:" prop="remark">
                      <el-input v-model="formData.remark" :rows="2" maxlength="256" show-word-limit type="textarea" clearable/>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <div style="display: flex; justify-content: center">
              <el-button type="primary" @click="confirm">发布</el-button>
              <el-button type="info" @click="cancel">返回</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Page>
</template>

<script setup>
import { Page } from '@vben/common-ui';
import { ElNotification, ElMessage } from 'element-plus';
import { Expand } from '@element-plus/icons-vue';
import { ref, reactive, onMounted } from 'vue'
import { useDropStore } from '#/store';
import { requestClient } from '#/api/request';
const formData = reactive({
  evaluateTimeType: null,
  evaluateMonth: null,
  selfEvaluateDeadline: null,
  evaluateName: null,
  evaluateUnit: null,
  remark: null,
})
const ruleFormRef = ref()
const formRules = reactive({
  evaluateTimeType: [
    { required: true, message: '请选择评价维度', trigger: 'change' },
  ],
  evaluateMonth: [
    { required: true, message: '请选择评价年月', trigger: 'blur' },
  ],
  selfEvaluateDeadline: [
    { required: true, message: '请选择自评截止时间', trigger: 'blur' },
  ],
  evaluateName: [
    { required: true, message: '请输入评价名称', trigger: 'blur' },
  ],
  evaluateUnit: [
    { required: true, message: '请选择评价单位', trigger: 'change' },
  ],
})
const dropList = reactive({});
onMounted(async () => {
  const dropStore = useDropStore();
  await dropStore.initDrops(['NSOS_EVALUATE_TIMETYPE', 'NSOS_ORG_NAME']);
  dropStore.get(dropList, ['NSOS_EVALUATE_TIMETYPE', 'NSOS_ORG_NAME']);
});

const emit = defineEmits(['releaseConfirm', 'releaseCancel'])
const confirm = async () => {
  let count = 0;
  await ruleFormRef.value.validate(async (valid) => {
    if (count > 0) return
    count++
    if (valid) {
      handleReleaseBefore()
      releaseApi()
      handleReleaseAfter()
      emit('releaseCancel');
      ElNotification({
        title: '提示',
        message: '发布成功！',
        type: 'success',
      })
    } else {
      ElMessage.warning('请输入必填项！')
      return false
    }
  })
}

const cancel = () => {
  emit('releaseCancel');
} 

const disabledDate = (time) => {
  const month = time.getMonth() + 1;
  return month !== 1 && month !== 4 && month !== 7 && month !== 9;
}

const releaseApi = async () => {
  console.log(formData.evaluateMonth)
  return requestClient.post(
    import.meta.env.VITE_NSOSZH + '/evaluateMaintainRule/release',
    formData,
  );
}

const handleReleaseBefore = () => {
  formData.evaluateMonth = formData.evaluateMonth.getTime();
  formData.evaluateUnit = formData.evaluateUnit.join(',')
}

const handleReleaseAfter = () => {
  formData.evaluateUnit = formData.evaluateUnit.split(',')
}

</script>
<style scoped>
.primary{
  color: hsl(var(--primary));
}

.main-dg{
  display: flex;
  width: 100%;
  height: 100%;
  background: #fff;
}

.ma-tabm{
  flex: 1;
  height: 100%;
  margin: auto;
  overflow: hidden;
  font-size: 12px;
  background: #fff;
}

.btm-d{
  width: 100%;
  height: calc(100% - 62px);
  padding-top: 10px;
  overflow: auto;
}

.part-b{
  border-top: 1px solid #c4dbf5;
}

.row-space{
  margin-bottom: 10px;
}
</style>
