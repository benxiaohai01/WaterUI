<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import type { AnchorLinkProps } from './props'
import { useAnchor } from './context'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtAnchorLink' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<AnchorLinkProps>(), {
  href: '',
  title: '',
  customClass: ''
})

const anchor = useAnchor()

/* 派生状态：是否激活 */
const active = computed(() => anchor?.activeHref === props.href)

/* 派生状态：类名 */
const classes = computed(() => [
  'wt-anchor-link',
  { 'is-active': active.value },
  props.customClass
])

/* 注册到父级 Anchor */
onMounted(() => anchor?.register(props.href))
onBeforeUnmount(() => anchor?.unregister(props.href))

/* 交互处理逻辑：点击锚点 */
const handleClick = () => {
  anchor?.onClick(props.href)
}
</script>

<template>
  <li :class="classes">
    <a :href="`#${href.replace(/^#/, '')}`" :class="{ 'is-active': active }" @click.prevent="handleClick">
      <slot>{{ title || href }}</slot>
    </a>
  </li>
</template>

<style scoped lang="scss">
.wt-anchor-link {
  /* 定位方式 */
  position: relative;
  /* 列表样式 */
  list-style: none;
}

.wt-anchor-link::before {
  /* 伪元素内容 */
  content: '';
  /* 定位方式 */
  position: absolute;
  /* 左侧偏移 */
  left: 0;
  /* 顶部偏移 */
  top: 50%;
  /* 形变 */
  transform: translateY(-50%);
  /* 宽度 */
  width: 3px;
  /* 高度 */
  height: 0;
  /* 圆角 */
  border-radius: 2px;
  /* 背景 */
  background: var(--wt-primary);
  /* 过渡动画 */
  transition: height 0.2s ease;
}

.wt-anchor-link.is-active::before {
  /* 高度 */
  height: 60%;
}

.wt-anchor-link a {
  /* 盒模型显示方式 */
  display: block;
  /* 内边距 */
  padding: 5px 0 5px 14px;
  /* 文本装饰 */
  text-decoration: none;
  /* 文本颜色 */
  color: var(--wt-text-secondary);
  /* 字号 */
  font-size: 14px;
  /* 行高 */
  line-height: 1.5;
  /* 过渡动画 */
  transition:
    color 0.2s ease,
    transform 0.2s ease;
}

.wt-anchor-link a:hover {
  /* 文本颜色 */
  color: var(--wt-text);
}

.wt-anchor-link a.is-active {
  /* 文本颜色 */
  color: var(--wt-primary);
  /* 字重 */
  font-weight: 600;
  /* 形变 */
  transform: translateX(2px);
}
</style>
