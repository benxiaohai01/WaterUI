<script setup lang="ts">
import { ref } from 'vue'
import type { TreeNode, TreeProps } from './props'
import TreeNodeComp from './TreeNode.vue'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtTree' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<TreeProps>(), {
  data: () => [],
  multiple: false,
  defaultExpandAll: false,
  showLine: false,
  customClass: ''
})

/* 响应式状态：选中节点 key 列表 */
const selectedKeys = ref<string[]>([])

/* 交互处理逻辑：节点点击（单选/多选切换） */
const handleNodeClick = (node: TreeNode) => {
  if (node.disabled) return
  if (props.multiple) {
    selectedKeys.value = selectedKeys.value.includes(node.key)
      ? selectedKeys.value.filter((key) => key !== node.key)
      : [...selectedKeys.value, node.key]
  } else {
    selectedKeys.value = [node.key]
  }
}
</script>

<template>
  <div :class="['wt-tree', props.customClass]">
    <TreeNodeComp
      v-for="node in data"
      :key="node.key"
      :node="node"
      :level="0"
      :selected-keys="selectedKeys"
      :default-expand-all="defaultExpandAll"
      :show-line="showLine"
      :multiple="multiple"
      @node-click="handleNodeClick"
    />
  </div>
</template>

<style scoped lang="scss">
.wt-tree {
  /* 盒模型显示方式 */
  display: flex;
  /* 主轴方向 */
  flex-direction: column;
  /* 用户选择 */
  user-select: none;
}
</style>
