<template>
  <div class="selectTree-wapper">
    <el-select v-model="selectlabel" placeholder="请选择" popper-class="custom-el-select-class" ref="selectRef" multiple
      collapse-tags clearable @clear="clearHanlde" @remove-tag="removeTag" style="width: 300px">
      <el-option :value="selectValue">
        <div class="search-input-container" @click.stop>
          <el-input v-model="searchValue" placeholder="请输入搜索内容" clearable>
            <template #append>
              <el-button :icon="Search" @click="handleSearch" />
            </template>
          </el-input>
        </div>
        <el-tree :data="displayTreeData" :props="defaultProps" default-expand-all node-key="id" show-checkbox
          :check-strictly="false" :expand-on-click-node="true" ref="treeRef" @check-change="handleCheckChange">
          <template #default="{ node, data }">
            <span :class="{ 'special-node': data.id === selectValue }">
              {{ node.label }}
            </span>
          </template>
        </el-tree>
      </el-option>
    </el-select>
    <el-select v-model="testvalue" multiple @click="openSelectOrgDailog" :teleported='false' class="custom-el-select-class1">
      <el-option v-for="item in testLabel" :label="item.label" :value="item.value"></el-option>
    </el-select>
  </div>
</template>

<script setup>
import { Search } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { ref, computed, onMounted } from 'vue';

const selectlabel = ref([]); // 选项label
const selectValue = ref([]); // 选项value
const searchValue = ref('');
const selectRef = ref(null);
const treeRef = ref(null);
const displayTreeData = ref([]); // 显示用的树数据

const testvalue = ref([])
const testLabel = ref([])

onMounted(() => {
  setTimeout(() => {
    testvalue.value = [
      'a40ebc699ebc4345bb92aadc6921e0a7',
      'a40ebc699ebc4345bb92aadc6921e0a7'
    ]
    testLabel.value = [
      {
        label: "研发建设部",
        value: 'a40ebc699ebc4345bb92aadc6921e0a7',
      },
      {
        label: '111',
        value: '6051e932c76f47dbae68d5dc1b3e75bf'
      }

    ]
  }, 10000)
})

function openSelectOrgDailog() {
  ElMessage.success('测光红')
}
const treeData = ref([
  {
    id: "1",
    name: "一级 1",
    children: [
      {
        id: "2",
        name: "二级 1-1",
        children: [
          {
            id: "3",
            name: "三级 1-1-1",
          },
        ],
      },
    ],
  },
  {
    id: "4",
    name: "一级 2",
    children: [
      {
        id: "5",
        name: "二级 2-1",
        children: [
          {
            id: "6",
            name: "三级 2-1-1",
          },
        ],
      },
      {
        id: "7",
        name: "二级 2-2",
        children: [
          {
            id: "8",
            name: "三级 2-2-1",
          },
        ],
      },
    ],
  },
]);

const defaultProps = {
  children: "children",
  label: "name",
};

// 初始化显示数据
displayTreeData.value = JSON.parse(JSON.stringify(treeData.value));

/**
 * 处理搜索输入
 */
const handleSearch = () => {
  if (!searchValue.value) {
    displayTreeData.value = JSON.parse(JSON.stringify(treeData.value));
    return;
  }

  const filterNodes = (nodes) => {
    return nodes.filter(node => {
      // 如果当前节点匹配，保留整个节点
      if (node.name.includes(searchValue.value)) {
        return true;
      }

      // 如果有子节点且子节点中有匹配的，保留当前节点
      if (node.children && node.children.length) {
        const filteredChildren = filterNodes(node.children);
        if (filteredChildren.length > 0) {
          // 创建一个新对象避免修改原始数据
          return {
            ...node,
            children: filteredChildren
          };
        }
      }

      return false;
    });
  };

  displayTreeData.value = filterNodes(JSON.parse(JSON.stringify(treeData.value)));
};

/**
 * 选择改变
 */
const handleCheckChange = () => {
  // 获取所有选中的节点
  const selectNodes = treeRef.value.getCheckedNodes();
  // 只要叶子节点数据
  const nodes = selectNodes.filter(
    (node) => !(node.children && node.children.length)
  );
  selectValue.value = nodes.map((node) => node.id);
  selectlabel.value = nodes.map((node) => node.name);
};

/**
 * 清除
 */
const clearHanlde = () => {
  selectlabel.value = [];
  selectValue.value = [];
  searchValue.value = '';
  displayTreeData.value = JSON.parse(JSON.stringify(treeData.value));
  treeRef.value.setCheckedKeys(selectValue.value);
};

/**
 * 移除
 */
const removeTag = (tag) => {
  selectValue.value.shift();  // 使用 collapse-tags 后，移除的是第一个
  treeRef.value.setCheckedKeys(selectValue.value);
};

</script>

<style lang='scss' scoped>
.custom-el-select-class {
  .el-select-dropdown__list {
    height: fit-content;
    max-height: 274px;

    .el-select-dropdown__item {
      height: auto;
      overflow: visible;
      padding: 0px 10px;
    }
  }

  .el-select-dropdown__item.hover,
  .el-select-dropdown__item:hover {
    background-color: #ffffff;
  }

  .special-node {
    color: red;
  }
}

.custom-el-select-class1 {
  :deep(.el-select-dropdown) {
    display: none;
  }
  :deep(el-popper__arrow:before){
    display: none;
  }
}


.search-input-container {
  padding: 8px;
  background-color: #fff;
  position: sticky;
  top: 0;
  z-index: 1;
}
</style>
