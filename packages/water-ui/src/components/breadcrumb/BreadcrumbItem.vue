<script setup lang="ts">
import { computed, inject } from 'vue'
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

/* 获取父级 Breadcrumb 提供的分隔符 */
const breadcrumb = inject(breadcrumbKey, null)

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
      :aria-current="replace ? undefined : 'page'"
      class="wt-breadcrumb__inner"
    >
      <slot />
    </a>
    <span v-else class="wt-breadcrumb__inner" aria-current="page">
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
  transition: color 0.2s ease;
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
