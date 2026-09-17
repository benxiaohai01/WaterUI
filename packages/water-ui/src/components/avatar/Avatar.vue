<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { AvatarProps } from './props'
import { resolveSize } from '../config-provider/context'
import { useHighlightStyle } from '../../utils/highlight'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtAvatar' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<AvatarProps>(), {
  size: 'medium',
  shape: 'liquid',
  alt: '',
  fallbackText: '',
  customClass: ''
})

/* 响应式状态：图片是否加载失败 */
const imgError = ref(false)

/* 组件级高光参数（优先级高于全局配置） */
const highlightStyle = useHighlightStyle(props)

/* 图片地址变化时重置失败状态，保证新图可重新加载 */
watch(
  () => props.src,
  () => {
    imgError.value = false
  }
)

/* 解析组件尺寸配置（数字尺寸保持原逻辑，命名尺寸支持全局配置） */
const size = resolveSize(() => (typeof props.size === 'number' ? undefined : props.size))

/* 派生状态：尺寸像素值 */
const sizePx = computed(() => {
  if (typeof props.size === 'number') return `${props.size}px`
  const map: Record<string, string> = {
    small: '36px',
    medium: '48px',
    large: '64px'
  }
  return map[size.value] ?? '48px'
})

/* 派生状态：字号 */
const fontPx = computed(() => {
  const px = parseFloat(sizePx.value)
  return `${Math.round(px * 0.42)}px`
})

/* 派生状态：容器类名 */
const classes = computed(() => [
  'wt-avatar',
  `wt-avatar--${props.shape}`,
  props.customClass
])

/* 派生状态：图片是否展示 */
const showImage = computed(() => Boolean(props.src) && !imgError.value)

/* 派生状态：回退文本 */
const fallback = computed(() => {
  if (props.fallbackText) return props.fallbackText
  return props.alt ? props.alt.charAt(0).toUpperCase() : ''
})

/* 图片加载失败时切换为文字占位 */
const handleError = () => {
  imgError.value = true
}
</script>

<template>
  <span :class="classes" :style="[highlightStyle, { width: sizePx, height: sizePx, fontSize: fontPx }]">
    <img
      v-if="showImage"
      class="wt-avatar__img"
      :src="src"
      :alt="alt"
      @error="handleError"
    />
    <span v-else-if="$slots.default" class="wt-avatar__text">
      <slot />
    </span>
    <span v-else class="wt-avatar__text">{{ fallback }}</span>
  </span>
</template>

<style scoped lang="scss">
@use '@water-ui/theme/src/mixins/index.scss' as wt;

.wt-avatar {
  /* 定位方式 */
  position: relative;
  /* 盒模型显示方式 */
  display: inline-flex;
  /* 主轴对齐方式 */
  justify-content: center;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 溢出裁剪 */
  overflow: hidden;
  /* 水滴表面：背景渐变 + 内外阴影层次 + 文本阴影 */
  @include wt.wt-liquid-surface;
  /* 文本颜色 */
  color: var(--wt-text);
  /* 字重 */
  font-weight: 600;
  /* 文本选中行为 */
  user-select: none;
}

.wt-avatar--circle {
  /* 圆角 */
  border-radius: 50%;
}

.wt-avatar--square {
  /* 圆角 */
  border-radius: var(--wt-radius-sm);
}

.wt-avatar--liquid {
  /* 水滴圆角令牌 */
  border-radius: var(--wt-radius-md);
  /* 动画 */
  animation: wt-liquid-flow-subtle var(--wt-motion-normal) ease-in-out infinite;
}

.wt-avatar__img {
  /* 宽度 */
  width: 100%;
  /* 高度 */
  height: 100%;
  /* 对象填充 */
  object-fit: cover;
  /* 显示方式 */
  display: block;
}

.wt-avatar__text {
  /* 文本对齐 */
  text-align: center;
  /* 行高 */
  line-height: 1;
  /* 溢出裁剪 */
  overflow: hidden;
  /* 文本溢出 */
  text-overflow: ellipsis;
  /* 空白处理 */
  white-space: nowrap;
  /* 内边距 */
  padding: 0 4px;
  /* 最大宽度 */
  max-width: 90%;
}
</style>
