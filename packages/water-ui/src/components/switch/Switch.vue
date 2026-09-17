<script setup lang="ts">
import { computed } from 'vue'
import type { SwitchProps } from './props'
import { resolveSize } from '../config-provider/context'
import { useHighlightStyle } from '../../utils/highlight'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtSwitch' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<SwitchProps>(), {
  modelValue: false,
  disabled: false,
  activeText: '',
  inactiveText: ''
})

/* 声明组件事件 */
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  change: [value: boolean]
}>()

/* 解析组件尺寸配置 */
const size = resolveSize(() => props.size)

/* 组件级高光参数（优先级高于全局配置） */
const highlightStyle = useHighlightStyle(props)

/* 派生状态（计算属性） */
const isChecked = computed(() => props.modelValue)

/* 交互处理逻辑 */
const toggle = () => {
  if (props.disabled) return
  const next = !props.modelValue
  emit('update:modelValue', next)
  emit('change', next)
}
</script>

<template>
  <button
    class="wt-switch"
    :class="[`wt-switch--${size}`, { 'is-checked': isChecked, 'is-disabled': disabled }]"
    :style="highlightStyle"
    type="button"
    role="switch"
    :aria-checked="isChecked"
    :aria-disabled="disabled"
    @click="toggle"
  >
    <span class="wt-switch__track">
      <span class="wt-switch__thumb" />
    </span>
    <span v-if="activeText || inactiveText" class="wt-switch__label">
      {{ isChecked ? activeText : inactiveText }}
    </span>
  </button>
</template>
<style scoped lang="scss">
@use '@water-ui/theme/src/mixins/index.scss' as wt;

.wt-switch {
  /* 高光尺寸（随全局基准等比缩放，11px / 12px）：声明在根元素，便于组件 props 覆盖 */
  --wt-highlight-size: calc(var(--wt-highlight-size-base) * 0.9167);
  /* 次高光尺寸（随全局基准等比缩放，6px / 12px） */
  --wt-highlight-small-size: calc(var(--wt-highlight-size-base) * 0.5);
  /* 主次高光间距 */
  --wt-highlight-group-gap: 4px;
  /* 高光内边距（随全局偏移等比缩放，3px / 8px） */
  --wt-highlight-inset: calc(var(--wt-highlight-offset) * 0.375);
  /* 高光顶部定位（min 仅用于收束到轨道内，不钳制全局基准） */
  --wt-highlight-top: min(var(--wt-highlight-inset), calc(100% - var(--wt-highlight-size) - 3px));
  /* 高光右侧定位（min 仅用于收束到轨道内，不钳制全局基准） */
  --wt-highlight-right: min(var(--wt-highlight-inset), calc(100% - var(--wt-highlight-size) - 3px));
  /* 次高光顶部定位 */
  --wt-highlight-small-top: min(calc(min(var(--wt-highlight-inset), calc(100% - var(--wt-highlight-size) - 4px)) + var(--wt-highlight-size) + var(--wt-highlight-group-gap)), calc(100% - var(--wt-highlight-small-size) - 3px));
  /* 次高光右侧定位 */
  --wt-highlight-small-right: min(calc(min(var(--wt-highlight-inset), calc(100% - var(--wt-highlight-size) - 4px)) + var(--wt-highlight-size) + var(--wt-highlight-group-gap)), calc(100% - var(--wt-highlight-small-size) - 3px));
  /* 盒模型显示方式 */
  display: inline-flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 元素间距 */
  gap: 10px;
  /* 边框 */
  border: 0;
  /* 内边距 */
  padding: 0;
  /* 背景 */
  background: transparent;
  /* 鼠标指针样式 */
  cursor: pointer;
  /* 字体族 */
  font-family: inherit;
}

.wt-switch__track {
  /* 定位方式 */
  position: relative;
  /* 创建独立层叠上下文，隔离内部元素 */
  isolation: isolate;
  /* 盒模型显示方式 */
  display: inline-flex;
  /* 宽度 */
  width: 56px;
  /* 高度 */
  height: 32px;
  /* 溢出裁剪方式 */
  overflow: hidden;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: 22px 18px 24px 20px / 18px 22px 20px 24px;
  /* 背景 */
  background: linear-gradient(
    145deg,
    rgba(0, 0, 0, calc(var(--wt-shadow-dark-alpha) + 0.04)),
    rgba(0, 0, 0, calc(var(--wt-shadow-dark-alpha-strong) + 0.06))
  );
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 2px 3px 6px rgba(0, 0, 0, 0.12),
    inset -1px -1px 3px var(--wt-shadow-light),
    2px 3px 8px rgba(0, 0, 0, 0.08),
    0 1px 3px rgba(0, 0, 0, 0.05);
  /* 液体形变动画（含 will-change: border-radius） */
  @include wt.wt-liquid-animation(wt-liquid-flow, var(--wt-motion-normal), border-radius);
  /* 过渡动画 */
  transition: background var(--wt-motion-base) ease, box-shadow var(--wt-motion-base) ease;
}

.wt-switch__track::after {
  /* 伪元素内容 */
  content: '';
  /* 定位方式 */
  position: absolute;
  /* 宽度 */
  width: var(--wt-highlight-size);
  /* 高度 */
  height: var(--wt-highlight-size);
  /* 顶部偏移 */
  top: min(var(--wt-highlight-inset), calc(100% - var(--wt-highlight-size) - 4px));
  /* 右侧偏移 */
  right: min(var(--wt-highlight-inset), calc(100% - var(--wt-highlight-size) - 4px));
  /* 背景 */
  background: var(--wt-highlight);
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-highlight-radius);
  /* 是否响应鼠标事件 */
  pointer-events: none;
  /* 动画 */
  animation: wt-highlight-float var(--wt-motion-normal) ease-in-out infinite;
  /* 透明度 */
  opacity: var(--wt-highlight-opacity);
}

.wt-switch__track::before {
  /* 伪元素内容 */
  content: '';
  /* 定位方式 */
  position: absolute;
  /* 宽度 */
  width: var(--wt-highlight-small-size);
  /* 高度 */
  height: var(--wt-highlight-small-size);
  /* 顶部偏移 */
  top: min(calc(var(--wt-highlight-inset) + var(--wt-highlight-size) + var(--wt-highlight-group-gap)), calc(100% - var(--wt-highlight-small-size) - 4px));
  /* 右侧偏移 */
  right: min(calc(var(--wt-highlight-inset) + var(--wt-highlight-size) + var(--wt-highlight-group-gap)), calc(100% - var(--wt-highlight-small-size) - 4px));
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
}

.wt-switch__thumb {
  /* 定位方式 */
  position: absolute;
  /* 顶部偏移 */
  top: 3px;
  /* 左侧偏移 */
  left: 3px;
  /* 宽度 */
  width: 26px;
  /* 高度 */
  height: 26px;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: 50% 46% 54% 48% / 52% 48% 46% 54%;
  /* 背景 */
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.28));
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 2px 3px 6px rgba(0, 0, 0, 0.2),
    inset -2px -2px 5px rgba(255, 255, 255, 0.25),
    2px 3px 8px rgba(0, 0, 0, 0.2);
  /* 过渡动画 */
  transition: left var(--wt-motion-base) cubic-bezier(0.34, 1.56, 0.64, 1), background var(--wt-motion-base) ease;
}

.wt-switch.is-checked .wt-switch__track {
  /* 背景 */
  background: linear-gradient(
    145deg,
    color-mix(in srgb, var(--wt-success) 72%, white),
    color-mix(in srgb, var(--wt-success) 88%, black)
  );
}

.wt-switch.is-checked .wt-switch__thumb {
  /* 左侧偏移 */
  left: 27px;
  /* 背景 */
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.42));
}

.wt-switch__label {
  /* 文本颜色 */
  color: var(--wt-text);
  /* 字号 */
  font-size: 14px;
}

.wt-switch--small {
  /* 高光尺寸（随全局基准等比缩放，8px / 12px）：声明在根元素，便于组件 props 覆盖 */
  --wt-highlight-size: calc(var(--wt-highlight-size-base) * 0.6667);
  /* 次高光尺寸（随全局基准等比缩放，5px / 12px） */
  --wt-highlight-small-size: calc(var(--wt-highlight-size-base) * 0.4167);
}
.wt-switch--small .wt-switch__track {
  /* 宽度 */
  width: 42px;
  /* 高度 */
  height: 24px;
}
.wt-switch--small .wt-switch__thumb {
/* 宽度 */
width: 18px;
  /* 高度 */
  height: 18px;
}
.wt-switch--small.is-checked .wt-switch__thumb {
/* 左侧偏移 */
left: 21px;
}
.wt-switch--large {
  /* 高光尺寸（随全局基准等比缩放，13px / 12px）：声明在根元素，便于组件 props 覆盖 */
  --wt-highlight-size: calc(var(--wt-highlight-size-base) * 1.0833);
  /* 次高光尺寸（随全局基准等比缩放，7px / 12px） */
  --wt-highlight-small-size: calc(var(--wt-highlight-size-base) * 0.5833);
}
.wt-switch--large .wt-switch__track {
  /* 宽度 */
  width: 68px;
  /* 高度 */
  height: 38px;
}
.wt-switch--large .wt-switch__thumb {
/* 宽度 */
width: 32px;
  /* 高度 */
  height: 32px;
}
.wt-switch--large.is-checked .wt-switch__thumb {
/* 左侧偏移 */
left: 33px;
}

.wt-switch:focus-visible {
  /* 焦点轮廓 */
  outline: 2px solid var(--wt-primary);
  /* 焦点轮廓偏移 */
  outline-offset: 3px;
}

.wt-switch.is-disabled {
  /* 鼠标指针样式 */
  cursor: not-allowed;
  /* 透明度 */
  opacity: 0.55;
}
</style>