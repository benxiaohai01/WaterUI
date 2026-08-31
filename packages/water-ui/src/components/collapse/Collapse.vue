<script setup lang="ts">
import { ref, watch } from 'vue'
import type { CollapseProps, CollapseEmits } from './props'
import { provideCollapse } from './context'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtCollapse' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<CollapseProps>(), {
  activeKey: '',
  accordion: false,
  customClass: ''
})

/* 声明组件事件 */
const emit = defineEmits<CollapseEmits>()

/* 响应式状态：内部激活 key（受控） */
const innerActive = ref<string | string[]>(props.activeKey)

/* 同步外部 activeKey 变化 */
watch(
  () => props.activeKey,
  (value) => {
    innerActive.value = value
  }
)

/* 派生状态：是否激活 */
const isActive = (name: string) => {
  if (Array.isArray(innerActive.value)) return innerActive.value.includes(name)
  return innerActive.value === name
}

/* 交互处理逻辑：切换面板 */
const toggle = (name: string) => {
  if (props.accordion) {
    innerActive.value = isActive(name) ? '' : name
  } else {
    const list = Array.isArray(innerActive.value) ? [...innerActive.value] : innerActive.value ? [innerActive.value] : []
    innerActive.value = isActive(name) ? list.filter((key) => key !== name) : [...list, name]
  }
  emit('change', innerActive.value)
  emit('update:activeKey', innerActive.value)
}

/* 提供上下文 */
provideCollapse({
  get activeKey() {
    return innerActive.value
  },
  get accordion() {
    return props.accordion
  },
  isActive,
  toggle
})
</script>

<template>
  <div :class="['wt-collapse', props.customClass]">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.wt-collapse {
  /* 盒模型显示方式 */
  display: flex;
  /* 主轴方向 */
  flex-direction: column;
  /* 间隙 */
  gap: var(--wt-space-sm);
}
</style>
