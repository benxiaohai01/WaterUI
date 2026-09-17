<script setup lang="ts">
import { computed, ref } from 'vue'
import type { TreeNode } from './props'
import TreeNodeComp from './TreeNode.vue'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtTreeNode' })

interface TreeNodeCompProps {
  node: TreeNode
  level: number
  selectedKeys: string[]
  defaultExpandAll: boolean
  showLine: boolean
}

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<TreeNodeCompProps>(), {
  level: 0
})

/* 声明组件事件 */
const emit = defineEmits<{
  nodeClick: [node: TreeNode]
}>()

/* 响应式状态：是否展开 */
const expanded = ref(props.defaultExpandAll || props.node.defaultExpanded)

/* 派生状态：是否有子节点 */
const hasChildren = computed(() => Array.isArray(props.node.children) && props.node.children.length > 0)

/* 派生状态：是否选中 */
const isSelected = computed(() => props.selectedKeys.includes(props.node.key))

/* 交互处理逻辑：展开/折叠 */
const toggle = () => {
  if (hasChildren.value) expanded.value = !expanded.value
}

/* 交互处理逻辑：节点点击 */
const handleClick = () => {
  emit('nodeClick', props.node)
}

/* 交互处理逻辑：键盘操作（Enter/Space 选中，左右方向键展开/收起） */
const handleKeydown = (event: KeyboardEvent) => {
  if (props.node.disabled) return
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    handleClick()
  } else if (event.key === 'ArrowRight' && hasChildren.value && !expanded.value) {
    event.preventDefault()
    expanded.value = true
  } else if (event.key === 'ArrowLeft' && hasChildren.value && expanded.value) {
    event.preventDefault()
    expanded.value = false
  }
}
</script>

<template>
  <div class="wt-tree-node">
    <div
      class="wt-tree-node__row"
      :class="{
        'is-selected': isSelected,
        'is-disabled': node.disabled
      }"
      role="treeitem"
      :tabindex="node.disabled ? -1 : 0"
      :aria-expanded="hasChildren ? expanded : undefined"
      :aria-selected="isSelected"
      :style="{ paddingLeft: `${level * 20}px` }"
      @click="handleClick"
      @keydown="handleKeydown"
    >
      <span
        v-if="hasChildren"
        class="wt-tree-node__switcher"
        :class="{ 'is-expanded': expanded }"
        aria-hidden="true"
        @click.stop="toggle"
      >
        ▸
      </span>
      <span v-else class="wt-tree-node__switcher wt-tree-node__switcher--leaf" />
      <span class="wt-tree-node__label">{{ node.label }}</span>
    </div>
    <div
      v-if="hasChildren && expanded"
      class="wt-tree-node__children"
      :class="{ 'has-line': showLine }"
      role="group"
    >
      <TreeNodeComp
        v-for="child in node.children"
        :key="child.key"
        :node="child"
        :level="level + 1"
        :selected-keys="selectedKeys"
        :default-expand-all="defaultExpandAll"
        :show-line="showLine"
        @node-click="emit('nodeClick', $event)"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.wt-tree-node__row {
  /* 盒模型显示方式 */
  display: flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 高度 */
  height: 34px;
  /* 内边距 */
  padding-right: 10px;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-xs);
  /* 鼠标指针样式 */
  cursor: pointer;
  /* 过渡 */
  transition: background var(--wt-motion-fast) ease;
}

.wt-tree-node__row:hover {
  /* 背景 */
  background: color-mix(in srgb, var(--wt-primary) 8%, transparent);
}

.wt-tree-node__row.is-selected {
  /* 背景 */
  background: color-mix(in srgb, var(--wt-primary) 14%, transparent);
}

.wt-tree-node__row.is-disabled {
  /* 鼠标指针样式 */
  cursor: not-allowed;
  /* 透明度 */
  opacity: 0.5;
}

.wt-tree-node__switcher {
  /* 宽度 */
  width: 20px;
  /* 高度 */
  height: 20px;
  /* 盒模型显示方式 */
  display: inline-flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 主轴对齐方式 */
  justify-content: center;
  /* 文本颜色 */
  color: var(--wt-text-secondary);
  /* 字号 */
  font-size: 12px;
  /* 过渡 */
  transition: transform var(--wt-motion-fast) ease;
}

.wt-tree-node__switcher.is-expanded {
  /* 形变 */
  transform: rotate(90deg);
}

.wt-tree-node__switcher--leaf {
  /* 宽度 */
  width: 20px;
  /* 高度 */
  height: 20px;
}

.wt-tree-node__label {
  /* 文本颜色 */
  color: var(--wt-text);
  /* 字号 */
  font-size: 14px;
}

.wt-tree-node__children.has-line {
  /* 位置 */
  position: relative;
}

.wt-tree-node__children.has-line::before {
  /* 内容 */
  content: '';
  /* 位置 */
  position: absolute;
  /* 左侧偏移 */
  left: 9px;
  /* 顶部偏移 */
  top: 0;
  /* 底部偏移 */
  bottom: 4px;
  /* 宽度 */
  width: 1px;
  /* 背景 */
  background: color-mix(in srgb, var(--wt-text-secondary) 16%, transparent);
}
</style>
