<script setup lang="ts">
import { computed } from 'vue'
import type { StepProps, StepStatus } from './props'
import { useSteps } from './context'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtStep' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<StepProps>(), {
  title: '',
  description: '',
  status: undefined,
  customClass: ''
})

/* 获取父级 Steps 上下文 */
const steps = useSteps()

/* 派生状态：当前步骤索引 */
const index = computed(() => {
  if (!steps) return 0
  return steps.length > 0 ? steps.length - 1 : 0
})

/* 派生状态：步骤状态 */
const status = computed<StepStatus>(() => {
  if (props.status) return props.status
  if (!steps) return 'wait'
  if (index.value < steps.active) return steps.finishStatus
  if (index.value === steps.active) return steps.processStatus
  return 'wait'
})

/* 派生状态：是否最后一项 */
const isLast = computed(() => (steps ? index.value === steps.length - 1 : false))

/* 派生状态：容器类名 */
const classes = computed(() => [
  'wt-step',
  `wt-step--${steps?.direction ?? 'horizontal'}`,
  `is-${status.value}`,
  { 'is-last': isLast.value, 'is-clickable': Boolean(steps && !steps.readonly) },
  props.customClass
])

/* 交互处理逻辑：点击步骤 */
const handleClick = () => {
  if (steps && !steps.readonly) steps.onSelect(index.value)
}

/* 派生状态：图标内容 */
const iconText = computed(() => {
  if (status.value === 'finish') return '✓'
  if (status.value === 'error') return '!'
  return String(index.value + 1)
})
</script>

<template>
  <li :class="classes" role="listitem" @click="handleClick">
    <span class="wt-step__tail" aria-hidden="true" />

    <span class="wt-step__head">
      <span class="wt-step__icon">
        <slot name="icon" :status="status" :index="index">{{ iconText }}</slot>
      </span>
    </span>

    <span class="wt-step__body">
      <span class="wt-step__title">
        <slot name="title">{{ title }}</slot>
      </span>
      <span v-if="description || $slots.description" class="wt-step__description">
        <slot name="description">{{ description }}</slot>
      </span>
    </span>
  </li>
</template>

<style scoped lang="scss">
.wt-step {
  /* 定位方式 */
  position: relative;
  /* 盒模型显示方式 */
  display: flex;
  /* 交叉轴对齐方式 */
  align-items: flex-start;
  /* 弹性布局中的伸缩比例 */
  flex: 1;
  /* 最小宽度 */
  min-width: 0;
  /* 文本颜色 */
  color: var(--wt-text-secondary);
  /* 鼠标指针样式 */
  cursor: default;
  /* 文本选中行为 */
  user-select: none;
}

.wt-step.is-clickable {
  /* 鼠标指针样式 */
  cursor: pointer;
}

.wt-step__head {
  /* 定位方式 */
  position: relative;
  /* 盒模型显示方式 */
  display: inline-flex;
  /* 宽度 */
  width: 32px;
  /* 高度 */
  height: 32px;
}

.wt-step__icon {
  /* 盒模型显示方式 */
  display: inline-flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 主轴内容分配方式 */
  justify-content: center;
  /* 宽度 */
  width: 30px;
  /* 高度 */
  height: 30px;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-sm);
  /* 背景 */
  background: linear-gradient(
    145deg,
    rgba(0, 0, 0, var(--wt-shadow-dark-alpha)),
    rgba(0, 0, 0, var(--wt-shadow-dark-alpha-strong))
  );
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 2px 3px 6px rgba(0, 0, 0, 0.12),
    inset -2px -2px 5px var(--wt-shadow-light),
    2px 3px 8px rgba(0, 0, 0, 0.08);
  /* 文本颜色 */
  color: var(--wt-text-secondary);
  /* 字号 */
  font-size: 14px;
  /* 字重 */
  font-weight: 600;
  /* 过渡动画 */
  transition:
    background 0.25s ease,
    color 0.25s ease,
    transform 0.25s ease;
}

.wt-step__tail {
  /* 定位方式 */
  position: absolute;
  /* 盒模型显示方式 */
  display: block;
  /* 高度 */
  height: 2px;
  /* 顶部偏移 */
  top: 15px;
  /* 左侧偏移 */
  left: 32px;
  /* 右侧偏移 */
  right: 8px;
  /* 圆角 */
  border-radius: 1px;
  /* 背景 */
  background: color-mix(in srgb, var(--wt-text-placeholder) 30%, transparent);
}

.wt-step__body {
  /* 盒模型显示方式 */
  display: flex;
  /* 排列方向 */
  flex-direction: column;
  /* 元素间距 */
  gap: 2px;
  /* 顶部外边距 */
  margin-top: 2px;
  /* 左侧外边距 */
  margin-left: 10px;
  /* 最小宽度 */
  min-width: 0;
}

.wt-step__title {
  /* 文本颜色 */
  color: inherit;
  /* 字号 */
  font-size: 14px;
  /* 字重 */
  font-weight: 500;
}

.wt-step__description {
  /* 文本颜色 */
  color: var(--wt-text-placeholder);
  /* 字号 */
  font-size: 12px;
  /* 行高 */
  line-height: 1.5;
}

.wt-step.is-finish .wt-step__icon {
  /* 背景 */
  background: color-mix(in srgb, var(--wt-primary) 16%, transparent);
  /* 文本颜色 */
  color: var(--wt-primary);
}

.wt-step.is-finish .wt-step__tail {
  /* 背景 */
  background: color-mix(in srgb, var(--wt-primary) 55%, transparent);
}

.wt-step.is-process .wt-step__icon {
  /* 背景 */
  background: linear-gradient(
    145deg,
    color-mix(in srgb, var(--wt-primary) 78%, white),
    var(--wt-primary)
  );
  /* 文本颜色 */
  color: #fff;
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 2px 3px 8px rgba(255, 255, 255, 0.25),
    inset -2px -2px 6px rgba(0, 0, 0, 0.18),
    3px 5px 14px color-mix(in srgb, var(--wt-primary) 45%, transparent);
}

.wt-step.is-process .wt-step__title {
  /* 文本颜色 */
  color: var(--wt-text);
}

.wt-step.is-error .wt-step__icon {
  /* 背景 */
  background: linear-gradient(
    145deg,
    color-mix(in srgb, var(--wt-danger) 78%, white),
    var(--wt-danger)
  );
  /* 文本颜色 */
  color: #fff;
}

.wt-step.is-error .wt-step__title {
  /* 文本颜色 */
  color: var(--wt-danger);
}

.wt-step.is-clickable:hover .wt-step__icon {
  /* 形变 */
  transform: translateY(-1px) scale(1.05);
}

/* 垂直方向布局 */
.wt-step--vertical {
  /* 盒模型显示方式 */
  display: flex;
  /* 排列方向 */
  flex-direction: row;
  /* 弹性布局中的伸缩比例 */
  flex: none;
  /* 最小高度 */
  min-height: 64px;
}

.wt-step--vertical .wt-step__tail {
  /* 定位方式 */
  position: absolute;
  /* 宽度 */
  width: 2px;
  /* 高度 */
  height: auto;
  /* 顶部偏移 */
  top: 32px;
  /* 左侧偏移 */
  left: 15px;
  /* 右侧偏移 */
  right: auto;
  /* 底部偏移 */
  bottom: 0;
}

.wt-step--vertical .wt-step__body {
  /* 顶部外边距 */
  margin-top: 4px;
}
</style>
