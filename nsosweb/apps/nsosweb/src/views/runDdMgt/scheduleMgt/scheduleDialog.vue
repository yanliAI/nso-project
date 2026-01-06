<template>
  <div>
    <div class="head-d">
      <div class="text-center font-bold text-lg">新增排班计划</div>
      <div class="float-right -mt-3">
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </div>
    <div>
      <div class="w-full h-full pt-5">
        <el-form label-width="auto" ref="ruleFormRef" :model="formData" :rules="formRules" :inline="true" label-position="right" class="demo-form-inline">
          <el-row>
            <el-col :span="8">
              <el-form-item label="班次名称:" prop="shiftName">
                <el-input v-model="formData.shiftName" clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="开始时间:" prop="startTime">
                <el-date-picker v-model="formData.startTime" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="结束时间:" prop="endTime">
                <el-date-picker v-model="formData.endTime" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" clearable/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="值长:" prop="shiftSupervisor">
                <el-select v-model="formData.shiftSupervisor" multiple placeholder="选择用户" collapse-tags collapse-tags-tooltip :max-collapse-tags="2" clearable filterable class="ml-0">
                  <el-option v-for="item in dropList.NSOS_USER_INFO" :key="item.value" :label="item.label" :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="安全检测:" prop="securityCheck">
                <el-select v-model="formData.securityCheck" multiple placeholder="选择用户" collapse-tags collapse-tags-tooltip :max-collapse-tags="2" clearable filterable class="ml-0">
                  <el-option v-for="item in dropList.NSOS_USER_INFO" :key="item.value" :label="item.label" :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="值班员:" prop="shiftPeople">
                <el-select v-model="formData.shiftPeople" multiple placeholder="选择用户" collapse-tags collapse-tags-tooltip :max-collapse-tags="2" clearable filterable class="ml-0">
                  <el-option v-for="item in dropList.NSOS_USER_INFO" :key="item.value" :label="item.label" :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, reactive } from 'vue';
import { useDropStore } from '#/store';
const formData = defineModel('formData');
const dropList = reactive({});
onMounted(async () => {
  const dropStore = useDropStore();
  const dropType = ['NSOS_USER_INFO']
  await dropStore.initDrops(dropType);
  dropStore.get(dropList, dropType);
});

const save = () => {

}
</script>
<style scoped>
.head-d{
  width: 100%;
  height: 55px;
  border-bottom: 1px solid #ebebeb;
}
</style>
