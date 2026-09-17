<script setup lang="ts">
import { computed } from 'vue'
import type { EmptyProps } from './props'
import { useHighlightStyle } from '../../utils/highlight'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtEmpty' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<EmptyProps>(), {
  description: '暂无数据',
  imageSize: 96,
  customClass: ''
})

/* 组件级高光参数（优先级高于全局配置） */
const highlightStyle = useHighlightStyle(props)

/* 派生状态：容器类名 */
const classes = computed(() => ['wt-empty', props.customClass])
</script>

<template>
  <div :class="classes" :style="highlightStyle">
    <div class="wt-empty__image" :style="{ width: `${imageSize}px`, height: `${imageSize}px` }">
      <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M48 8C32 20 24 34 24 50C24 66 34 88 48 88C62 88 72 66 72 50C72 34 64 20 48 8Z"
          fill="color-mix(in srgb, var(--wt-primary) 14%, transparent)"
          stroke="var(--wt-primary)"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M37 42C33 50 33 58 37 66"
          stroke="var(--wt-primary)"
          stroke-width="3"
          stroke-linecap="round"
          opacity="0.5"
        />
        <path
          d="M59 36C55 44 55 52 59 60"
          stroke="var(--wt-primary)"
          stroke-width="3"
          stroke-linecap="round"
          opacity="0.35"
        />
      </svg>
    </div>
    <p v-if="description" class="wt-empty__description">{{ description }}</p>
    <div v-if="$slots.default" class="wt-empty__footer">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@water-ui/theme/src/mixins/index.scss' as wt;

.wt-empty {
  /* 盒模型显示方式 */
  display: flex;
  /* 主轴方向 */
  flex-direction: column;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 内边距 */
  padding: 40px 20px;
  /* 文本对齐方式 */
  text-align: center;
}

.wt-empty__image {
  /* 位置 */
  position: relative;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-md);
  /* 背景 */
  background: color-mix(in srgb, var(--wt-surface) 70%, transparent);
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 3px 4px 10px rgba(0, 0, 0, 0.05),
    inset -2px -2px 6px var(--wt-shadow-light),
    0 8px 20px rgba(0, 0, 0, 0.04);
  /* 液体形变动画（含 will-change: border-radius） */
  @include wt.wt-liquid-animation(wt-liquid-flow-subtle, var(--wt-motion-slow), border-radius);
}

.wt-empty__image svg {
  /* 宽度 */
  width: 100%;
  /* 高度 */
  height: 100%;
  /* 盒模型：内外边距计入尺寸，保证小尺寸与 viewBox 等比缩放 */
  box-sizing: border-box;
  /* 内边距，随外框尺寸等比缩放 */
  padding: 12%;
}

.wt-empty__description {
  /* 外边距 */
  margin: 16px 0 0;
  /* 文本颜色 */
  color: var(--wt-text-secondary);
  /* 字号 */
  font-size: 14px;
}

.wt-empty__footer {
  /* 外边距 */
  margin-top: 20px;
}
</style>
