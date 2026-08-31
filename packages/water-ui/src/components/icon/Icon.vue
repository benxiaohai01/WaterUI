<script setup lang="ts">
import { computed } from 'vue'
import type { IconName, IconProps } from './props'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtIcon' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<IconProps>(), {
  size: 20,
  color: 'currentColor',
  wrapped: false
})

const paths: Record<IconName, string> = {
  search:
    'M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Zm6-1.5 5 5',
  'arrow-right': 'M4 12h16m-7-7 7 7-7 7',
  'arrow-left': 'M20 12H4m7 7-7-7 7-7',
  menu: 'M4 6h16M4 12h16M4 18h16',
  moon: 'M21 12.8A8.5 8.5 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z',
  sun: 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-15v2m0 16v2M4.2 4.2l1.4 1.4m12.8 12.8 1.4 1.4M2 12h2m16 0h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4',
  github:
    'M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 3 .8.1-.6.3-1.1.6-1.4-2.2-.2-4.6-1.1-4.6-5A3.9 3.9 0 0 1 6 9.2a3.6 3.6 0 0 1 .1-2.7s.9-.3 2.8 1a9.5 9.5 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1a3.6 3.6 0 0 1 .1 2.7 3.9 3.9 0 0 1 1 2.7c0 3.9-2.4 4.8-4.6 5 .4.3.7.9.7 1.8v2.7c0 .3.2.6.7.5A10 10 0 0 0 12 2Z',
  copy:
    'M9 9h11v11H9zM5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1',
  check: 'm5 12 5 5 9-11',
  'chevron-right': 'm9 18 6-6-6-6',
  'chevron-down': 'm6 9 6 6 6-6',
  close: 'M6 6l12 12M18 6 6 18',
  code: 'm8 8-4 4 4 4m8-8 4 4-4 4',
  external: 'M14 4h6v6m0-6L10 14m-5 6h12a2 2 0 0 0 2-2v-4',
  home: 'm3 11 9-8 9 8v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9Z',
  star: 'm12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z',
  info:
    'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 6h.01M12 10v6',
  warning: 'M12 2 21 20H3L12 2Zm0 7v5m0 3v.01',
  error: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-3 7 6 6m0-6-6 6',
  question:
    'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-2.9 7a3 3 0 1 1 4.24 3.49c-.68.34-.84.99-.84 1.51H12m0 3h.01',
  notification:
    'M6 8a6 6 0 0 1 12 0c0 7 2 8 2 8H4s2-1 2-8Zm3 12h6',
  loading: 'M12 3a9 9 0 1 0 9 9',
  minus: 'M6 12h12',
  plus: 'M12 6v12m6-6H6',
  'refresh-left': 'M4 10a8 8 0 1 1 2 7m-2-3v4h4',
  'refresh-right': 'M20 10a8 8 0 1 0-2 7m2-3v4h-4',
  fullscreen: 'M8 3H3v5m13-5h5v5M8 21H3v-5m13 5h5v-5',
  bell: 'M6 8a6 6 0 0 1 12 0c0 7 2 8 2 8H4s2-1 2-8Zm3 12h6'
}

/* 派生状态（计算属性） */
const viewBox = computed(() => '0 0 24 24')

/* 派生状态（计算属性） */
const pathData = computed(() => paths[props.name] ?? paths.search)

/* 派生状态（计算属性） */
const sizeStyle = computed(() => {
  const value = typeof props.size === 'number' ? `${props.size}px` : props.size
  return {
    width: value,
    height: value
  }
})
</script>

<template>
  <span v-if="wrapped" class="wt-icon" :style="sizeStyle">
    <svg
      :width="size"
      :height="size"
      :viewBox="viewBox"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      :style="{ color }"
      aria-hidden="true"
      focusable="false"
    >
      <path :d="pathData" />
    </svg>
  </span>
  <svg
    v-else
    :width="size"
    :height="size"
    :viewBox="viewBox"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    :style="{ color }"
    aria-hidden="true"
    focusable="false"
  >
    <path :d="pathData" />
  </svg>
</template>
<style scoped lang="scss">
.wt-icon {
  /* 定位方式 */
  position: relative;
  /* 创建独立层叠上下文，隔离内部元素 */
  isolation: isolate;
  /* 盒模型显示方式 */
  display: inline-flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 主轴内容分配方式 */
  justify-content: center;
  /* 弹性布局中的伸缩比例 */
  flex: 0 0 auto;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: 52% 48% 46% 54% / 50% 46% 54% 50%;
  /* 背景 */
  background: linear-gradient(
    145deg,
    color-mix(in srgb, var(--wt-surface) 84%, var(--wt-primary) 8%),
    color-mix(in srgb, var(--wt-surface) 60%, var(--wt-primary) 16%)
  );
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 2px 3px 6px rgba(0, 0, 0, 0.14),
    inset -1px -1px 3px var(--wt-shadow-light),
    2px 3px 8px rgba(0, 0, 0, 0.08);
  /* 动画 */
  animation: wt-liquid-flow var(--wt-motion-slow) ease-in-out infinite;
  /* 动画性能提示 */
  will-change: transform;
}

.wt-icon::after {
  /* 伪元素内容 */
  content: '';
  /* 定位方式 */
  position: absolute;
  /* 宽度 */
  width: var(--wt-highlight-size);
  /* 高度 */
  height: var(--wt-highlight-size);
  /* 顶部偏移 */
  top: var(--wt-highlight-top);
  /* 右侧偏移 */
  right: var(--wt-highlight-right);
  /* 背景 */
  background: var(--wt-highlight);
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-highlight-radius);
  /* 是否响应鼠标事件 */
  pointer-events: none;
  /* 动画 */
  animation: wt-highlight-float var(--wt-motion-slow) ease-in-out infinite;
  /* 透明度 */
  opacity: var(--wt-highlight-opacity);
  /* 层叠层级 */
  z-index: 2;
}

.wt-icon::before {
  /* 伪元素内容 */
  content: '';
  /* 定位方式 */
  position: absolute;
  /* 宽度 */
  width: var(--wt-highlight-small-size);
  /* 高度 */
  height: var(--wt-highlight-small-size);
  /* 顶部偏移 */
  top: var(--wt-highlight-small-top);
  /* 右侧偏移 */
  right: var(--wt-highlight-small-right);
  /* 背景 */
  background: var(--wt-highlight-small);
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-highlight-small-radius);
  /* 是否响应鼠标事件 */
  pointer-events: none;
  /* 动画 */
  animation: wt-highlight-float-small var(--wt-motion-slow) ease-in-out infinite;
  /* 透明度 */
  opacity: var(--wt-highlight-small-opacity);
  /* 层叠层级 */
  z-index: 2;
}

.wt-icon svg {
  /* 定位方式 */
  position: relative;
  /* 层叠层级 */
  z-index: 3;
}
</style>
