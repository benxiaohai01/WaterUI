<script setup lang="ts">
import { computed } from 'vue'
import type { TimelineItemProps, TimelineItemType } from './props'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtTimelineItem' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<TimelineItemProps>(), {
  timestamp: '',
  type: 'default',
  hollow: false,
  customClass: ''
})

/* 节点类型 → 语义色映射 */
const typeColor: Record<TimelineItemType, string> = {
  default: 'var(--wt-text-secondary)',
  success: 'var(--wt-success)',
  warning: 'var(--wt-warning)',
  danger: 'var(--wt-danger)',
  primary: 'var(--wt-primary)'
}

/* 派生状态：节点颜色 */
const color = computed(() => typeColor[props.type])
</script>

<template>
  <li :class="['wt-timeline-item', props.customClass]">
    <div class="wt-timeline-item__tail" />
    <div
      class="wt-timeline-item__node"
      :class="{ 'is-hollow': hollow }"
      :style="{ borderColor: color, background: hollow ? 'transparent' : color }"
    />
    <div class="wt-timeline-item__content">
      <div class="wt-timeline-item__timestamp" v-if="timestamp || $slots.timestamp">
        <slot name="timestamp">{{ timestamp }}</slot>
      </div>
      <div class="wt-timeline-item__body">
        <slot />
      </div>
    </div>
  </li>
</template>

<style scoped lang="scss">
.wt-timeline-item {
  /* 位置 */
  position: relative;
  /* 内边距 */
  padding: 0 0 24px 24px;
}

.wt-timeline-item:last-child {
  /* 底部内边距 */
  padding-bottom: 4px;
}

.wt-timeline-item__tail {
  /* 位置 */
  position: absolute;
  /* 左侧偏移 */
  left: 5px;
  /* 顶部偏移 */
  top: 14px;
  /* 底部偏移 */
  bottom: -2px;
  /* 宽度 */
  width: 2px;
  /* 背景 */
  background: color-mix(in srgb, var(--wt-text-secondary) 18%, transparent);
}

.wt-timeline-item:last-child .wt-timeline-item__tail {
  /* 隐藏 */
  display: none;
}

.wt-timeline-item__node {
  /* 位置 */
  position: absolute;
  /* 左侧偏移 */
  left: 0;
  /* 顶部偏移 */
  top: 4px;
  /* 宽度 */
  width: 12px;
  /* 高度 */
  height: 12px;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-xs);
  /* 边框 */
  border: 2px solid;
  /* 水滴内外部阴影层次 */
  box-shadow:
    0 0 8px color-mix(in srgb, var(--wt-primary) 20%, transparent),
    inset 1px 1px 3px rgba(255, 255, 255, 0.4);
}

.wt-timeline-item__node.is-hollow {
  /* 背景 */
  background: transparent;
}

.wt-timeline-item__content {
  /* 文本颜色 */
  color: var(--wt-text);
  /* 字号 */
  font-size: 14px;
  /* 行高 */
  line-height: 1.7;
}

.wt-timeline-item__timestamp {
  /* 文本颜色 */
  color: var(--wt-text-placeholder);
  /* 字号 */
  font-size: 12px;
  /* 底部外边距 */
  margin-bottom: 2px;
}
</style>
