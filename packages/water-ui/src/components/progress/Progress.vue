<script setup lang="ts">
import { computed } from 'vue'
import type { ProgressProps, ProgressStatus } from './props'
import { useHighlightStyle } from '../../utils/highlight'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtProgress' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<ProgressProps>(), {
  percentage: 0,
  type: 'line',
  status: 'normal',
  strokeWidth: 8,
  size: 96,
  showText: true,
  customClass: ''
})

/* 状态 → 语义色映射（同时用于进度条颜色与辉光混色） */
const statusColor: Record<ProgressStatus, string> = {
  normal: 'var(--wt-primary)',
  success: 'var(--wt-success)',
  warning: 'var(--wt-warning)',
  danger: 'var(--wt-danger)'
}

/* 组件级高光参数（优先级高于全局配置） */
const highlightStyle = useHighlightStyle(props)

/* 进度数值钳制在 0-100（无效值退化为 0） */
const clamped = computed(() => {
  const raw = Number(props.percentage)
  if (!Number.isFinite(raw)) return 0
  return Math.min(100, Math.max(0, raw))
})
/* 当前状态色 */
const color = computed(() => statusColor[props.status])
/* 圆形进度：半径、中心点与 viewBox（与 size 同步，避免裁切或缩放） */
const radius = computed(() => (props.size - props.strokeWidth) / 2)
const center = computed(() => props.size / 2)
const viewBox = computed(() => `0 0 ${props.size} ${props.size}`)
const circumference = computed(() => 2 * Math.PI * radius.value)
const arcOffset = computed(() => circumference.value * (1 - clamped.value / 100))
</script>

<template>
  <div
    :class="['wt-progress', `wt-progress--${type}`, props.customClass]"
    :style="[highlightStyle, { '--wt-progress-status-color': color }]"
  >
    <div v-if="type === 'line'" class="wt-progress__line">
      <div
        class="wt-progress__bar"
        :style="{
          width: `${clamped}%`,
          height: `${strokeWidth}px`,
          background: color
        }"
      />
      <span v-if="showText" class="wt-progress__text">{{ clamped }}%</span>
    </div>
    <div v-else class="wt-progress__circle">
      <svg :width="size" :height="size" :viewBox="viewBox">
        <circle
          :cx="center"
          :cy="center"
          :r="radius"
          fill="none"
          stroke="color-mix(in srgb, var(--wt-text-secondary) 12%, transparent)"
          :stroke-width="strokeWidth"
        />
        <circle
          :cx="center"
          :cy="center"
          :r="radius"
          fill="none"
          :stroke="color"
          :stroke-width="strokeWidth"
          stroke-linecap="round"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="arcOffset"
          :transform="`rotate(-90 ${center} ${center})`"
        />
      </svg>
      <span v-if="showText" class="wt-progress__circle-text">{{ clamped }}%</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wt-progress__line {
  /* 盒模型显示方式 */
  display: flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 间隙 */
  gap: var(--wt-space-sm);
  /* 宽度 */
  width: 100%;
}

.wt-progress__bar {
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-xs);
  /* 水滴内外部阴影层次（辉光随状态色变化） */
  box-shadow:
    inset 1px 2px 4px rgba(0, 0, 0, 0.12),
    0 2px 6px color-mix(in srgb, var(--wt-progress-status-color) 24%, transparent);
  /* 过渡 */
  transition: width var(--wt-motion-base) ease;
}

.wt-progress__text {
  /* 文本颜色 */
  color: var(--wt-text-secondary);
  /* 字号 */
  font-size: 13px;
  /* 最小宽度 */
  min-width: 40px;
}

.wt-progress__circle {
  /* 位置 */
  position: relative;
  /* 盒模型显示方式 */
  display: inline-flex;
}

.wt-progress__circle-text {
  /* 位置 */
  position: absolute;
  /* 顶部偏移 */
  top: 50%;
  /* 左侧偏移 */
  left: 50%;
  /* 形变 */
  transform: translate(-50%, -50%);
  /* 文本颜色 */
  color: var(--wt-text);
  /* 字号 */
  font-size: 15px;
  /* 字重 */
  font-weight: 600;
}
</style>
