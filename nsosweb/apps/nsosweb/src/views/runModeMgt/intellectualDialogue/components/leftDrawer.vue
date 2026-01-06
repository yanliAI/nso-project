<template>
  <div class="left-card-below-model">
    <ul class="talk-list">
      <li
        :class="{ 'active-background': currentHistoryItemId == item.id }"
        class="talk-item"
        v-for="(item, index) in historyList"
        :key="index"
      >
        <p class="content" :title="item.intelligentTitle"
           @click="showDetail(item.id)">{{ item.intelligentTitle }}</p>
        <el-icon style="cursor: pointer;margin-right: 10px" @click="deleteChat(item)"
                 title="删除当前对话">
          <Delete/>
        </el-icon>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { Search, RefreshLeft, Delete, Download, Monitor, CirclePlus, CircleCheck, DocumentCopy } from '@element-plus/icons-vue'
import { ref } from 'vue'
// import { useMessage } from 'path/to/your/message/utils' // 请替换为实际路径

const props = defineProps({
  historyList: {
    type: Array,
    required: true,
    default: () => []
  },
  currentIsAnswering: {
    type: Boolean,
    required: true,
    default: false
  }
})

const emit = defineEmits(['showDetail', 'deleteChat'])

const userInfo = ref({})
const drawerLeft = ref(true)
const currentHistoryItemId = ref(null)

const showDetail = (id) => {
  if (props.currentIsAnswering) {
    // useMessage().warning('请先等待当前对话回答结束')
    return
  }
  currentHistoryItemId.value = id
  emit('showDetail', id)
}

const deleteChat = (item) => {
  if (props.currentIsAnswering) {
    // useMessage().warning('请先等待当前对话回答结束')
    return
  }
  emit('deleteChat', item)
}
</script>



<style scoped>
/* @import "@/communalStyle/scrollBar.scss";
@import "@/communalStyle/blue-title.scss"; */

.leftCardBelow {
  background-color: white;
  height: 100%;
}

.talk-list {
  list-style: none;
  padding-left: 0;
  text-align: left;
  height: 100%;
  overflow: auto;

  .talk-item {
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;

    .content {
      width: 210px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin: 0;
    }
  }
}


.left-card-below-model {
  border: 1px solid #e3eaef;
  border-radius: 10px;
  padding: 20px 20px 5px 20px;
  background-color: white;
  height: 100vh;
}

.active-background {
  background: #ecf4ff;
  border-radius: 8px;
}
</style>
