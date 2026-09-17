<script setup lang="ts">
import { computed } from 'vue'
import type { RadioProps } from './props'
import { useHighlightStyle } from '../../utils/highlight'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtRadio' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<RadioProps>(), {
  name: '',
  disabled: false,
  customClass: ''
})

/* 声明组件事件 */
const emit = defineEmits<{
  'update:modelValue': [value: string | number | boolean]
  change: [value: string | number | boolean]
}>()

/* 组件级高光参数（优先级高于全局配置） */
const highlightStyle = useHighlightStyle(props)

/* 派生状态（计算属性） */
const classes = computed(() => [
  'wt-radio',
  {
    'is-checked': props.modelValue === props.value,
    'is-disabled': props.disabled
  },
  props.customClass
])

/* 交互处理逻辑 */
const handleChange = () => {
  if (props.disabled) return
  emit('update:modelValue', props.value)
  emit('change', props.value)
}
</script>

<template>
  <label :class="classes" :style="highlightStyle">
    <input
      class="wt-radio__input"
      type="radio"
      :name="name || undefined"
      :checked="modelValue === value"
      :disabled="disabled"
      @change="handleChange"
    >
    <span class="wt-radio__dot" aria-hidden="true" />
    <span class="wt-radio__label"><slot /></span>
  </label>
</template>
<style scoped lang="scss">
@use '@water-ui/theme/src/mixins/index.scss' as wt;

.wt-radio {
  /* 次高光尺寸（随全局基准等比缩放，5px / 12px）：声明在根元素，便于组件 props 覆盖 */
  --wt-highlight-small-size: calc(var(--wt-highlight-size-base) * 0.4167);
  /* 次高光顶部定位（随全局偏移等比缩放，3px / 8px） */
  --wt-highlight-small-top: calc(var(--wt-highlight-offset) * 0.375);
  /* 次高光右侧定位（随全局偏移等比缩放，3px / 8px） */
  --wt-highlight-small-right: calc(var(--wt-highlight-offset) * 0.375);
  /* 盒模型显示方式 */
  display: inline-flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 元素间距 */
  gap: 9px;
  /* 鼠标指针样式 */
  cursor: pointer;
  /* 文本颜色 */
  color: var(--wt-text);
  /* 字号 */
  font-size: 14px;
  /* 文本选中行为 */
  user-select: none;
}

.wt-radio__input {
  /* 定位方式 */
  position: absolute;
  /* 透明度 */
  opacity: 0;
  /* 是否响应鼠标事件 */
  pointer-events: none;
}

.wt-radio__dot {
  /* 定位方式 */
  position: relative;
  /* 创建独立层叠上下文，隔离内部元素 */
  isolation: isolate;
  /* 宽度 */
  width: 20px;
  /* 高度 */
  height: 20px;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: 52% 48% 46% 54% / 50% 46% 54% 50%;
  /* 背景 */
  background: linear-gradient(
    145deg,
    rgba(0, 0, 0, var(--wt-shadow-dark-alpha)),
    rgba(0, 0, 0, var(--wt-shadow-dark-alpha-strong))
  );
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 2px 3px 6px rgba(0, 0, 0, 0.14),
    inset -1px -1px 3px var(--wt-shadow-light),
    2px 2px 7px rgba(0, 0, 0, 0.07);
  /* 液体形变动画（含 will-change: border-radius） */
  @include wt.wt-liquid-animation(wt-liquid-flow, var(--wt-motion-normal), border-radius);
}

.wt-radio__dot::before {
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
  background: var(--wt-highlight);
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-highlight-small-radius);
  /* 是否响应鼠标事件 */
  pointer-events: none;
  /* 透明度 */
  opacity: var(--wt-highlight-small-opacity);
}

.wt-radio__dot::after {
  /* 伪元素内容 */
  content: '';
  /* 定位方式 */
  position: absolute;
  /* 上下左右偏移合成属性 */
  inset: 5px;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: 50% 46% 54% 48% / 52% 48% 46% 54%;
  /* 背景 */
  background: var(--wt-primary);
  /* 形变 */
  transform: scale(0);
  /* 过渡动画 */
  transition: transform var(--wt-motion-fast) ease;
}

.wt-radio.is-checked .wt-radio__dot::after {
  /* 形变 */
  transform: scale(1);
}

.wt-radio.is-disabled {
  /* 鼠标指针样式 */
  cursor: not-allowed;
  /* 透明度 */
  opacity: 0.55;
}

.wt-radio__input:focus-visible + .wt-radio__dot {
  /* 焦点轮廓 */
  outline: 2px solid var(--wt-primary);
  /* 焦点轮廓偏移 */
  outline-offset: 2px;
}
</style>