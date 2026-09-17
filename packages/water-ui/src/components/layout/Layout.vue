<script setup lang="ts">
import { computed, useSlots, type VNode } from 'vue'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtLayout' })

/* 声明组件入参与默认值：direction 未显式传入时按子元素自动推断 */
const props = withDefaults(
  defineProps<{
    /** 排列方向：默认按子元素推断（含 Aside 为横向，否则纵向） */
    direction?: 'horizontal' | 'vertical'
    customClass?: string
  }>(),
  {
    direction: undefined,
    customClass: ''
  }
)

const slots = useSlots()

/* 收集插槽内子组件名 */
const collectNames = (nodes: VNode[], names: Set<string>) => {
  nodes.forEach((node) => {
    const type = node.type as { name?: string } | string | undefined
    if (type && typeof type !== 'string' && type.name) names.add(type.name)
    if (Array.isArray(node.children)) collectNames(node.children as VNode[], names)
  })
}

/* 派生状态：实际排列方向（含 Aside 推断为横向，其余纵向） */
const layoutDirection = computed<'horizontal' | 'vertical'>(() => {
  if (props.direction) return props.direction
  const names = new Set<string>()
  collectNames(slots.default?.() ?? [], names)
  return names.has('WtAside') ? 'horizontal' : 'vertical'
})
</script>

<template>
  <section class="wt-layout" :class="[`wt-layout--${layoutDirection}`, customClass]">
    <slot />
  </section>
</template>
<style scoped lang="scss">
.wt-layout {
  /* 盒模型显示方式 */
  display: flex;
  /* 最小宽度 */
  min-width: 0;
}

.wt-layout--horizontal {
  /* 弹性布局主轴方向 */
  flex-direction: row;
}

.wt-layout--vertical {
  /* 弹性布局主轴方向 */
  flex-direction: column;
}
</style>