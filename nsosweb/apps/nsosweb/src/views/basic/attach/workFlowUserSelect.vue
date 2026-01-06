<template>
  <div class="w-full h-full">
    <div class="h-[50%] flex">
      <div class="gjasjg">
        <el-input v-model="filterText" class="ml-[8px] mt-[8px]" style="width: calc(100% - 16px)" placeholder="搜索关键字"/>
        <el-tree
          ref="treeRef"
          style="max-width: 600px"
          class="filter-tree"
          :data="data.nodeData"
          :props="defaultProps" 
          default-expand-all highlight-current	
          :filter-node-method="filterNode"
          @node-click="nodeClick"
        />
      </div>
      <div class="gjasjg">
        <div class="flex text-sm pt-1 px-2" v-for="(item,index) in data.selectUser" :key="index">
          <div class="flex-[1] dhxz">{{item.userName}}({{item.deptPath}})[{{item.postName}}]</div>
          <div class="pl-2 text-right text-red-600 flex items-center cursor-pointer gbnhj" @click="deleteClick(item)">
            <Delete class="abgh ml-2 text-red-600" style="width:16px;height:16px"/>删除
          </div>
        </div>
      </div>
    </div>
    <div class="flex mx-[10px] mb-[10px]" style="height: calc(50% - 60px);">
      <el-input v-model="data.opinion" maxlength="256" show-word-limit type="textarea" placeholder="请输入审批意见" clearable/>
    </div>
    <div class="text-center h-[50px]">
      <el-button type="info" plain class="ml-0" @click="cancelClick">取消</el-button>
      <el-button type="primary" class="ml-0" @click="selectOkClick">确定</el-button>
    </div>
  </div>
</template>
<script setup>
import { onMounted, reactive, watch, ref } from 'vue';
import { ElDialog,ElCard } from 'element-plus';
import { requestClient } from '#/api/request';
import { ElMessage, ElTable, ElTableColumn, ElMessageBox, ElNotification, ElTabs, ElTabPane, ElPagination, ElTree } from 'element-plus';
import { Delete } from '@element-plus/icons-vue';

const nodeUserInfo = defineModel('nodeUserInfo')
const emit = defineEmits(['close','ok'])
const treeRef = ref()
const filterText = ref('')
const data = reactive({
  nodeData: null,
  selectUser: [],
  opinion: '',
})
const defaultProps = {
  children: 'users',
  label: 'userName',
}
onMounted(async () => {
  
});
const filterNode = (value, data) => {
  if (!value) return true
  return data.userName.includes(value)
}
watch(nodeUserInfo, (newVal, oldVal) => {
  data.nodeData = newVal
  if (data.nodeData) {
    data.nodeData.forEach(n => {
      n.userName = n.nodeName
      if (n.users) {
        n.users.forEach(u => {
          u.nodeName = n.nodeName
        })
      }
    });
  }
})
watch(filterText, (val) => {
  treeRef.value.filter(val)
})
const deleteClick = (su) => {
  data.nodeData.forEach(n => {
    if (n.users) {
      n.users.forEach(u => {
        if (u.userId == su.userId && u.postName == su.postName && u.deptPath == su.deptPath && u.nodeName == su.nodeName) {
          u.mark = false
        }
      })
    }
  })
  data.selectUser = data.selectUser.filter(u => !(u.userId == su.userId && u.postName == su.postName && u.deptPath == su.deptPath && u.nodeName == su.nodeName))
}
const nodeClick = (node) => {
  data.selectUser.push(node)
}
const cancelClick = async () => {
  emit('close')
}
const selectOkClick = async () => {
  if (data.selectUser.length == 0) {
    ElMessage.warning('请选择用户！');
    return
  }

  data.selectUser.forEach(su => {
    data.nodeData.forEach(n => {
      if (n.users) {
        n.users.forEach(u => {
          if (u.userId == su.userId && u.postName == su.postName && u.deptPath == su.deptPath && u.nodeName == su.nodeName) {
            u.mark = true
          }
        })
      }
    })
  })
  let newData = JSON.parse(JSON.stringify(data.nodeData));
  newData.forEach(n => {
    if (n.users) {
      n.users = n.users.filter(u => u.mark == true)
    }
  })
  emit('ok', newData, data.opinion);
}
</script>
<style scoped>
.gjasjg{
  flex: 0.5;
  margin: 10px;
  border: 1px solid #dcdfe6;
}

:deep(.el-textarea__inner){
  min-height: 100%!important;
}

:deep(.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content){
  background-color: #d3e4f9;
}

.dhxz{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gbnhj:hover{
  text-decoration: underline;
}
</style>
