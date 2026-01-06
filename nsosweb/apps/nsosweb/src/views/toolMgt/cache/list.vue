<template>
  <div class="app-container p-4">
    <el-row :gutter="10">
      <el-col :span="8">
        <el-card style="height: calc(100vh - 125px)">
          <template #header>
            <span
              ><el-icon><Collection /></el-icon> 缓存列表</span
            >
            <el-button
              style="float: right; padding: 3px 0"
              type="primary"
              link
              @click="refreshCacheNames()"
            >
              <el-icon><RefreshRight /></el-icon>
            </el-button>
          </template>
          <el-table
            v-loading="loading"
            :data="cacheNames"
            :height="tableHeight"
            highlight-current-row
            @row-click="getCacheKeys"
            style="width: 100%"
          >
            <el-table-column
              label="序号"
              width="60"
              type="index"
            ></el-table-column>

            <el-table-column
              label="缓存名称"
              align="center"
              prop="cacheName"
              :show-overflow-tooltip="true"
              :formatter="nameFormatter"
            ></el-table-column>

            <el-table-column
              label="备注"
              align="center"
              prop="remark"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="操作"
              width="60"
              align="center"
              class-name="small-padding fixed-width"
            >
              <template #default="scope">
                <el-button
                  type="primary"
                  link
                  @click="handleClearCacheName(scope.row)"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card style="height: calc(100vh - 125px)">
          <template #header>
            <span
              ><el-icon><Key /></el-icon> 键名列表</span
            >
            <el-button
              style="float: right; padding: 3px 0"
              type="primary"
              link
              @click="refreshCacheKeys()"
            >
              <el-icon><RefreshRight /></el-icon>
            </el-button>
          </template>
          <el-table
            v-loading="subLoading"
            :data="cacheKeys"
            :height="tableHeight"
            highlight-current-row
            @row-click="handleCacheValue"
            style="width: 100%"
          >
            <el-table-column
              label="序号"
              width="60"
              type="index"
            ></el-table-column>
            <el-table-column
              label="缓存键名"
              align="center"
              :show-overflow-tooltip="true"
              :formatter="keyFormatter"
            >
            </el-table-column>
            <el-table-column
              label="操作"
              width="60"
              align="center"
              class-name="small-padding fixed-width"
            >
              <template #default="scope">
                <el-button
                  type="primary"
                  link
                  @click="handleClearCacheKey(scope.row)"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card :bordered="false" style="height: calc(100vh - 125px)">
          <template #header>
            <span
              ><el-icon><Document /></el-icon> 缓存内容</span
            >
            <el-button
              style="float: right; padding: 3px 0"
              type="primary"
              link
              @click="handleClearCacheAll()"
            >
              <el-icon><RefreshRight /></el-icon>
              清理全部
            </el-button>
          </template>
          <el-form :model="cacheForm">
            <el-row :gutter="32">
              <el-col :offset="1" :span="22">
                <el-form-item label="缓存名称:" prop="cacheName">
                  <el-input v-model="cacheForm.cacheName" :readonly="true" />
                </el-form-item>
              </el-col>
              <el-col :offset="1" :span="22">
                <el-form-item label="缓存键名:" prop="cacheKey">
                  <el-input v-model="cacheForm.cacheKey" :readonly="true" />
                </el-form-item>
              </el-col>
              <el-col :offset="1" :span="22">
                <el-form-item label="缓存内容:" prop="cacheValue">
                  <el-input
                    v-model="cacheForm.cacheValue"
                    type="textarea"
                    :rows="8"
                    :readonly="true"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import {
  ElRow,
  ElCol,
  ElCard,
  ElTable,
  ElTableColumn,
  ElButton,
  ElIcon,
  ElForm,
  ElFormItem,
  ElInput,
} from 'element-plus';
import {
  Collection,
  RefreshRight,
  Delete,
  Key,
  Document,
} from '@element-plus/icons-vue';
import {
  getCacheNameListApi,
  getCacheKeysApi,
  getCacheValueApi,
  clearCacheNameApi,
  clearCacheKeyApi,
  clearCacheAllApi,
} from '#/api';

// Reactive data
const cacheNames = ref([]);
const cacheKeys = ref([]);
const cacheForm = ref({});
const loading = ref(true);
const subLoading = ref(false);
const nowCacheName = ref('');
const tableHeight = ref(window.innerHeight - 200);

// Methods
const getCacheNames = async () => {
  loading.value = true;
  try {
    const response = await getCacheNameListApi();
    cacheNames.value = response;
  } finally {
    loading.value = false;
  }
};

const refreshCacheNames = () => {
  getCacheNames();
  ElMessage.success('刷新缓存列表成功');
};

const handleClearCacheName = async (row) => {
  await clearCacheNameApi(row.cacheName);
  ElMessage.success(`清理缓存名称[${row.cacheName}]成功`);
  getCacheKeys();
};

const getCacheKeys = async (row) => {
  const cacheName = row !== undefined ? row.cacheName : nowCacheName.value;
  if (cacheName === '') {
    return;
  }
  subLoading.value = true;
  try {
    const response = await getCacheKeysApi(cacheName);
    cacheKeys.value = response;
    nowCacheName.value = cacheName;
  } finally {
    subLoading.value = false;
  }
};

const refreshCacheKeys = () => {
  getCacheKeys();
  ElMessage.success('刷新键名列表成功');
};

const handleClearCacheKey = async (cacheKey) => {
  await clearCacheKeyApi(cacheKey);
  ElMessage.success(`清理缓存键名[${cacheKey}]成功`);
  getCacheKeys();
};

const nameFormatter = (row) => {
  return row.cacheName.replace(':', '');
};

const keyFormatter = (cacheKey) => {
  return cacheKey.replace(nowCacheName.value, '');
};

const handleCacheValue = async (cacheKey) => {
  const response = await getCacheValueApi(nowCacheName.value, cacheKey);
  cacheForm.value = response;
};

const handleClearCacheAll = async () => {
  await clearCacheAllApi();
  ElMessage.success('清理全部缓存成功');
};

// Lifecycle hooks
onMounted(() => {
  getCacheNames();
});
</script>
