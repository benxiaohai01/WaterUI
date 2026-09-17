<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted } from 'vue'
import type { BreadcrumbItemProps } from './props'
import { breadcrumbKey } from './context'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtBreadcrumbItem' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<BreadcrumbItemProps>(), {
  to: undefined,
  target: '_self',
  replace: false,
  customClass: ''
})

/* 获取父级 Breadcrumb 提供的分隔符与顺序上下文 */
const breadcrumb = inject(breadcrumbKey, null)

/* 当前子项标识，用于父级统计顺序 */
const self: object = {}

/* 派生状态：是否为最后一项（仅最后一项标记 aria-current） */
const isLast = computed(() => {
  const list = breadcrumb?.items.value ?? []
  if (!list.length) return !breadcrumb
  return list[list.length - 1] === self
})

/* 注册 / 注销子项，保证父级顺序信息最新 */
onMounted(() => breadcrumb?.registerItem(self))
onBeforeUnmount(() => breadcrumb?.unregisterItem(self))

/* 派生状态：内容类名 */
const classes = computed(() => [
  'wt-breadcrumb__item',
  { 'is-link': Boolean(props.to) },
  props.customClass
])
</script>

<template>
  <li :class="classes">
    <a
      v-if="to"
      :href="to"
      :target="target"
      :aria-current="isLast ? 'page' : undefined"
      class="wt-breadcrumb__inner"
    >
      <slot />
    </a>
    <span v-else class="wt-breadcrumb__inner" :aria-current="isLast ? 'page' : undefined">
      <slot />
    </span>
    <span v-if="breadcrumb?.separator" class="wt-breadcrumb__separator" aria-hidden="true">
      {{ breadcrumb.separator }}
    </span>
  </li>
</template>

<style scoped lang="scss">
.wt-breadcrumb__item {
  /* 盒模型显示方式 */
  display: inline-flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 元素间距 */
  gap: 8px;
  /* 列表样式 */
  list-style: none;
}

.wt-breadcrumb__inner {
  /* 文本颜色 */
  color: var(--wt-text-secondary);
  /* 字号 */
  font-size: 14px;
  /* 行高 */
  line-height: 1.6;
  /* 过渡动画 */
  transition: color var(--wt-motion-fast) ease;
}

a.wt-breadcrumb__inner {
  /* 文本装饰 */
  text-decoration: none;
  /* 鼠标指针样式 */
  cursor: pointer;
}

a.wt-breadcrumb__inner:hover {
  /* 文本颜色 */
  color: var(--wt-primary);
}

.wt-breadcrumb__item:last-child .wt-breadcrumb__inner {
  /* 文本颜色 */
  color: var(--wt-text);
  /* 字重 */
  font-weight: 600;
}

.wt-breadcrumb__item:last-child .wt-breadcrumb__separator {
  /* 盒模型显示方式 */
  display: none;
}

.wt-breadcrumb__separator {
  /* 文本颜色 */
  color: var(--wt-text-placeholder);
  /* 字号 */
  font-size: 13px;
}
</style>
