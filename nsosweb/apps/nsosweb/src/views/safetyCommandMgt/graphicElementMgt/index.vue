<template>
  <el-container>
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="queryForm"
      label-position="right"
      style="padding: 16px 20px 0"
    >
      <el-form-item label="图元名称:" prop="graphicName">
        <el-input style="width: 180px" v-model="queryForm.graphicName" />
      </el-form-item>
      <el-form-item label="图元类型:" prop="sysName">
        <el-select
          v-model="queryForm.graphicType"
          style="width: 180px"
          placeholder="请选择"
          clearable
          filterable
        >
          <el-option label="攻击源" value="0"></el-option>
          <el-option label="设备/系统" value="1"></el-option>
          <el-option label="省级公司" value="2"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :icon="Search" @click="query">查询</el-button>
        <el-button type="info" :icon="RefreshLeft" @click="resetQueryForm"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <el-main>
      <el-table
        border
        stripe
        ref="table"
        :data="tableData"
        style="width: 100%; height: 480px"
      >
        <el-table-column type="index" align="center" />
        <el-table-column prop="id" label="图元ID" align="center" width="80">
        </el-table-column>
        <el-table-column
          prop="graphElementName"
          label="图元名称"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="devType"
          label="图元类型"
          align="center"
          width="120"
        >
          <template #default="scope">
            <span v-if="scope.row.devType == 0">攻击源</span>
            <span v-else-if="scope.row.devType == 1">设备/系统</span>
            <span v-else-if="scope.row.devType == 2">省级公司</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="applicationSystemName"
          label="所属系统"
          align="center"
        >
          <!-- <template #default="{ row }">
            <el-select
              v-if="row.updateable"
              v-model="row.systemInfo"
              placeholder="请选择"
              @change="handleBindSystem(row)"
              clearable
              filterable
            >
              <el-option
                v-for="item in systemList"
                :key="item.value"
                :label="item.name"
                :value="`${item.value}-${item.name}`"
              ></el-option>
            </el-select>
            <span v-else>{{ row.applicationSystemName }}</span>
          </template> -->
        </el-table-column>
        <el-table-column prop="cmdbUnitName" label="所属单位" align="center">
          <template #default="{ row }">
            <el-select
              v-if="row.updateable"
              v-model="row.cmdbUnitInfo"
              placeholder="请选择"
              clearable
              filterable
            >
              <el-option
                v-for="item in unitList"
                :key="item.value"
                :label="item.name"
                :value="`${item.value}-${item.name}`"
              ></el-option>
            </el-select>
            <span v-else>{{ row.cmdbUnitName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="labelList"
          label="系统标签"
          align="center"
          width="300"
        >
          <template #default="{ row, $index }">
            <el-input
              v-if="row.updateable"
              v-model="row.labelList"
              placeholder='多个用","分割'
              type="textarea"
              :rows="2"
              :autosize="{ maxRows: 3 }"
            />
            <span v-else>{{ row.labelList }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="ipV4List"
          label="IPV4/IPV4段"
          align="center"
          width="300"
        >
          <template #default="{ row, $index }">
            <el-input
              v-if="row.updateable"
              v-model="row.ipV4List"
              placeholder='IP或IP段，如 192.168.1.1或192.168.1.1~32。用","分割'
              type="textarea"
              :rows="2"
              :autosize="{ maxRows: 3 }"
              @keyup.enter="handleEnter($index, row)"
              @blur="handleBlur($index, row)"
            />
            <span v-else>{{ row.ipV4List }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="ipV6List"
          label="IPV6/IPV6段"
          align="center"
          width="300"
        >
          <template #default="{ row, $index }">
            <el-input
              v-if="row.updateable"
              v-model="row.ipV6List"
              placeholder='IP或IP段，如 2001::8a2e:370:7334 或 2001::8a2e:370:30~50。用","分割'
              type="textarea"
              :rows="2"
              :autosize="{ maxRows: 3 }"
              @keyup.enter="handleEnter($index, row)"
              @blur="handleBlur($index, row)"
            />
            <span v-else>{{ row.ipV6List }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="120">
          <template #default="scope">
            <el-button
              v-if="!scope.row.updateable"
              type="primary"
              link
              @click="scope.row.updateable = true"
              >编辑</el-button
            >
            <el-button
              v-if="scope.row.updateable"
              type="primary"
              link
              @click="scope.row.updateable = false"
              >取消</el-button
            >
            <el-button
              v-if="scope.row.updateable"
              type="primary"
              link
              @click="updateData(scope.row)"
              >保存</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        :page-sizes="[20, 50, 100, 200]"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </el-footer>
  </el-container>
</template>

<script lang="ts" setup>
import {
  ElTable,
  ElTableColumn,
  ElFormItem,
  ElForm,
  ElInput,
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
import {
  Search,
  RefreshLeft,
  Delete,
  Download,
  Monitor,
  CirclePlus,
  CircleCheck,
} from '@element-plus/icons-vue';
import { Page } from '@vben/common-ui';
import { ref, reactive, computed, onMounted } from 'vue';
import {
  queryGraphElementListApi,
  updateGraphElementApi,
  querySystemListApi,
  queryUnitListApi,
} from '#/api';

defineOptions({
  name: 'GraphicElementMgt',
});
const topoId = defineModel('topoId');
console.log('topoId==', topoId.value);
const queryFormRef = ref();
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);
const table = ref(null);
const tableData = ref([]);
const queryForm = reactive({
  graphicName: '',
  graphicType: '',
});

const systemList = ref([]);

const unitList = ref([]);

/**
 * 查询
 */
const query = async () => {
  let params = {
    pageNo: currentPage.value,
    pageSize: pageSize.value,
    topoId: topoId.value,
    graphElementName: queryForm.graphicName,
    devType: queryForm.graphicType,
  };
  const result = await queryGraphElementListApi(params);
  tableData.value = result.records.map((item) => {
    if (item.cmdbUnitId && item.cmdbUnitName) {
      item.cmdbUnitInfo = item.cmdbUnitId + '-' + item.cmdbUnitName;
    }
    if (item.applicationSystemId && item.applicationSystemName) {
      item.systemInfo =
        item.applicationSystemId + '-' + item.applicationSystemName;
    }
    return item;
  });
  total.value = result.total;
};

/**
 * 修改图元信息
 * @param row
 */
const updateData = async (row) => {
  console.log('保存图元信息：', row);
  let ipStr = row.ipV4List;
  let ipV4List = [];
  if (ipStr) {
    // 判断是否有逗号
    if (ipStr.includes(',')) {
      // 以逗号分割并校验每个IP
      const ipList = ipStr.split(',');
      for (const ip of ipList) {
        if (!ip.trim()) {
          continue;
        }
        const isValid = validateIP(ip);
        if (!isValid) {
          ElMessage.error(`"${ip.trim()}" 不是有效的IPv4地址或地址段`);
          return; // 这里可以直接退出整个函数
        }
        ipV4List.push(ip.trim());
      }
    } else {
      // 单个IP校验
      const isValid = validateIP(ipStr);
      if (!isValid) {
        ElMessage.error('请输入有效的IPv4或IPv4段格式');
        return;
      }
      ipV4List.push(ipStr);
    }
  }
  let ipV6List = [];
  ipStr = row.ipV6List;
  if (ipStr) {
    // 判断是否有逗号
    if (ipStr.includes(',')) {
      // 以逗号分割并校验每个IP
      const ipList = ipStr.split(',');
      for (const ip of ipList) {
        if (!ip.trim()) {
          continue;
        }
        const isValid = validateIPv6(ip);
        if (!isValid) {
          ElMessage.error(`"${ip.trim()}" 不是有效的IPv6地址或地址段`);
          return; // 这里可以直接退出整个函数
        }
        ipV6List.push(ip.trim());
      }
    } else {
      // 单个IP校验
      const isValid = validateIPv6(ipStr);
      if (!isValid) {
        ElMessage.error('请输入有效的IPv6或IPv6段格式');
        return;
      }
      ipV6List.push(ipStr);
    }
  }
  let cmdbUnitInfo = row.cmdbUnitInfo;
  let cmdbUnitId = '';
  let cmdbUnitName = '';
  if (cmdbUnitInfo) {
    cmdbUnitId = cmdbUnitInfo.split('-')[0];
    cmdbUnitName = cmdbUnitInfo.split('-')[1];
  }
  let systemInfo = row.systemInfo;
  let applicationSystemId = '';
  let applicationSystemName = '';
  if (systemInfo) {
    applicationSystemId = systemInfo.split('-')[0];
    applicationSystemName = systemInfo.split('-')[1];
  }

  const params = {
    topoId: topoId.value,
    id: row.id,
    cmdbUnitId,
    cmdbUnitName,
    applicationSystemId,
    applicationSystemName,
    ipV4List: ipV4List,
    ipV6List: ipV6List,
    labelList: row.labelList.split(','),
  };
  const updateResult = await updateGraphElementApi(params);
  if (updateResult) {
    ElMessage.success('修改成功！');
    row.updateable = false;
    setTimeout(() => {
      query();
    }, 100);
  }
};

const resetQueryForm = () => {
  // 重置查询表单
  queryFormRef.value?.resetFields();
  query();
};

// IP验证正则
const validateIP = (ip) => {
  // 去除前后空格
  ip = ip.trim();
  if (!ip) return false;

  // 简单IPV4验证正则
  const ipRegex =
    /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)(\~(25[0-5]|2[0-4]\d|[01]?\d\d?))?$/;

  // 校验IP或IP段
  const result = ipRegex.test(ip);
  if (!result) {
    return false;
  }

  const parts = ip.split('~');
  // 如果没有CIDR部分，视为有效
  if (parts.length === 1) {
    return true;
  }
  const ipParts = parts[0].split('.').map(Number);
  const lastIpPart = ipParts[3];
  const cidr = parseInt(parts[1], 10);

  // 检查CIDR是否大于最后一个IP段
  if (cidr < lastIpPart) {
    // return {
    //   isValid: false,
    //   message: `CIDR值(${cidr})必须大于最后一个IP段的值(${lastIpPart})`,
    // };
    return false;
  }
  return true;
};

// IPv6 校验函数
const validateIPv6 = (ip) => {
  // 去除前后空格
  ip = ip.trim();
  if (!ip) return false;
  // IPv6 正则表达式（支持完整格式和压缩格式）
  const ipv6Regex =
    /^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/;

  // IPv6 带 CIDR 的正则表达式
  const ipv6WithCidrRegex =
    /^(((([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?))|(::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?))|(([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?))|(([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?))|(([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?))|(([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?))|(([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4})|(:((:[\da-fA-F]{1,4}){1,6}|:))|([\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:))|(([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:))|(([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:))|(([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:))|(([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?)|(([\da-fA-F]{1,4}:){6}:))~([\da-fA-F]{1,4}))$/;

  // 先检查基本格式
  const basicCheck = ipv6Regex.test(ip) || ipv6WithCidrRegex.test(ip);
  if (!basicCheck) {
    return false;
  }

  // 检查 CIDR 部分
  const parts = ip.split('~');
  if (parts.length === 1) {
    return true; // 没有 CIDR 部分，直接返回有效
  }

  // const cidr = parseInt(parts[1], 10);

  // // IPv6 的 CIDR 范围是 0-128
  // if (cidr < 0 || cidr > 128) {
  //   return false;
  //   // 也可以返回更详细的错误信息
  //   // return {
  //   //   isValid: false,
  //   //   message: `IPv6 CIDR值必须在0-128之间(当前值: ${cidr})`
  //   // };
  // }

  return true;
};

// 回车事件处理
const handleEnter = (index, row) => {};

// 失焦事件处理
const handleBlur = (index, row) => {};

const handleBindSystem = (row) => {
  console.log('bindSystem==', row.bindSystem);
};

const handleSizeChange = (size: number) => {
  pageSize.value = size;
  query();
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  query();
};

onMounted(async () => {
  query();
  try {
    const result = await querySystemListApi();
    systemList.value = result.map((item) => {
      return {
        name: item.applicationSystemName,
        value: item.applicationSystemId,
      };
    });
  } catch {}

  try {
    const result2 = await queryUnitListApi();
    console.log('result2=', result2);
    unitList.value = result2.map((item) => {
      return {
        name: item.cmdbUnitName,
        value: item.cmdbUnitId,
      };
    });
  } catch {}
});
</script>

<style scoped>
.el-main {
  padding-top: 0;
}
.cell {
  text-align: center;
}
</style>
