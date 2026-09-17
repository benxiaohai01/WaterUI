<script setup lang="ts">
import { computed, ref } from 'vue'
import type { TreeNode, TreeEmits, TreeProps } from './props'
import TreeNodeComp from './TreeNode.vue'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtTree' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<TreeProps>(), {
  data: () => [],
  selectedKeys: undefined,
  multiple: false,
  defaultExpandAll: false,
  showLine: false,
  customClass: ''
})

/* 声明组件事件 */
const emit = defineEmits<TreeEmits>()

/* 响应式状态：内部选中节点 key 列表（非受控兜底） */
const innerSelectedKeys = ref<string[]>([])

/* 派生状态：选中节点 key 列表（外部传入时以外部为准） */
const currentSelectedKeys = computed(() => props.selectedKeys ?? innerSelectedKeys.value)

/* 交互处理逻辑：节点点击（单选/多选切换） */
const handleNodeClick = (node: TreeNode) => {
  if (node.disabled) return
  emit('nodeClick', node)
  const current = currentSelectedKeys.value
  let next: string[]
  if (props.multiple) {
    next = current.includes(node.key)
      ? current.filter((key) => key !== node.key)
      : [...current, node.key]
  } else {
    next = current.length === 1 && current.includes(node.key) ? current : [node.key]
  }
  innerSelectedKeys.value = next
  if (next !== current) {
    emit('update:selectedKeys', next)
    emit('change', next)
  }
}
</script>

<template>
  <div
    :class="['wt-tree', props.customClass]"
    role="tree"
    :aria-multiselectable="multiple"
  >
    <TreeNodeComp
      v-for="node in data"
      :key="node.key"
      :node="node"
      :level="0"
      :selected-keys="currentSelectedKeys"
      :default-expand-all="defaultExpandAll"
      :show-line="showLine"
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
