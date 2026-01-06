<template>
  <el-form>
    <el-form-item>
      <el-row>
        <el-col :span="12"><el-select></el-select></el-col>
        <el-col :span="12"><el-select></el-select></el-col>
      </el-row>
    </el-form-item>
    <el-form-item>
      <el-upload> </el-upload>
    </el-form-item>
  </el-form>
</template>
<script setup>
import { ElRow, ElCol, ElUpload, ElSelect, ElFormItem, ElForm } from 'element-plus';
</script>
<style scoped></style>
