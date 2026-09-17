<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import type { DropdownProps } from './props'
import { provideDropdown } from './context'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtDropdown' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<DropdownProps>(), {
  trigger: 'hover',
  placement: 'bottom',
  disabled: false,
  customClass: ''
})

/* 声明组件事件 */
const emit = defineEmits<{
  command: [command: string | number]
  visibleChange: [visible: boolean]
}>()

/* 响应式状态：是否展开 */
const visible = ref(false)

/* 响应式状态：根节点引用 */
const rootRef = ref<HTMLElement>()

/* 提供上下文 */
provideDropdown({
  get trigger() {
    return props.trigger
  },
  get placement() {
    return props.placement
  },
  get visible() {
    return visible.value
  },
  onCommand: (command) => {
    emit('command', command)
  },
  onItemClick: () => {
    setVisible(false)
  }
})

/* 派生状态：容器类名 */
const classes = computed(() => [
  'wt-dropdown',
  { 'is-disabled': props.disabled, 'is-open': visible.value },
  props.customClass
])

/* 交互处理逻辑：展开/收起 */
const setVisible = (value: boolean) => {
  if (props.disabled && value) return
  if (visible.value === value) return
  visible.value = value
  emit('visibleChange', value)
}

/* 交互处理逻辑：点击外部关闭 */
const handleOutside = (event: PointerEvent) => {
  if (rootRef.value && !rootRef.value.contains(event.target as Node)) {
    setVisible(false)
  }
}

/* 交互处理逻辑：Esc 关闭 */
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') setVisible(false)
}

/* 生命周期：仅在展开时注册全局监听，避免实例常驻 */
watch(visible, (value) => {
  if (typeof document === 'undefined') return
  if (value) {
    document.addEventListener('pointerdown', handleOutside)
    document.addEventListener('keydown', handleKeydown)
  } else {
    document.removeEventListener('pointerdown', handleOutside)
    document.removeEventListener('keydown', handleKeydown)
  }
})

/* 生命周期：卸载时移除全局监听 */
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleOutside)
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div ref="rootRef" :class="classes" @mouseenter="trigger === 'hover' && setVisible(true)" @mouseleave="trigger === 'hover' && setVisible(false)">
    <div class="wt-dropdown__trigger" @click="trigger === 'click' && setVisible(!visible)">
      <slot />
    </div>
    <slot name="menu" />
  </div>
</template>

<style scoped lang="scss">
.wt-dropdown {
  /* 定位方式 */
  position: relative;
  /* 盒模型显示方式 */
  display: inline-flex;
  /* 垂直对齐方式 */
  vertical-align: middle;
}

.wt-dropdown__trigger {
  /* 盒模型显示方式 */
  display: inline-flex;
  /* 交叉轴对齐方式 */
  align-items: center;
}

.wt-dropdown.is-disabled {
  /* 鼠标指针样式 */
  cursor: not-allowed;
  /* 透明度 */
  opacity: 0.6;
}

.wt-dropdown.is-disabled .wt-dropdown__trigger {
  /* 鼠标指针样式 */
  cursor: not-allowed;
}
</style>
