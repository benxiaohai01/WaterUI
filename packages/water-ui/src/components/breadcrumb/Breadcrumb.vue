<script setup lang="ts">
import { computed, ref } from 'vue'
import type { BreadcrumbProps } from './props'
import { provideBreadcrumb } from './context'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtBreadcrumb' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<BreadcrumbProps>(), {
  separator: '/',
  customClass: ''
})

/* 响应式状态：子项注册顺序 */
const items = ref<object[]>([])

/* 交互处理逻辑：子项注册 / 注销，供子项判定自身是否为最后一项 */
const registerItem = (item: object) => {
  items.value = [...items.value, item]
}

const unregisterItem = (item: object) => {
  items.value = items.value.filter((current) => current !== item)
}

/* 向子项提供分隔符与顺序上下文（getter 保证 props 变化实时生效） */
provideBreadcrumb({
  get separator() {
    return props.separator
  },
  items,
  registerItem,
  unregisterItem
})

/* 派生状态：容器类名 */
const classes = computed(() => ['wt-breadcrumb', props.customClass])
</script>

<template>
  <nav :class="classes" aria-label="面包屑导航">
    <ol class="wt-breadcrumb__list">
      <slot />
    </ol>
  </nav>
</template>

<style scoped lang="scss">
.wt-breadcrumb {
  /* 盒模型显示方式 */
  display: inline-flex;
  /* 交叉轴对齐方式 */
  align-items: center;
}

.wt-breadcrumb__list {
  /* 外边距 */
  margin: 0;
  /* 内边距 */
  padding: 0;
  /* 盒模型显示方式 */
  display: flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 元素间距 */
  gap: 4px;
  /* 列表样式 */
  list-style: none;
}
</style>
