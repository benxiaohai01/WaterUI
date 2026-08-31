<script setup lang="ts">
import { computed } from 'vue'
import type { RadioProps } from './props'

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
  <label :class="classes">
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
.wt-radio {
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
  /* 次高光尺寸 */
  --wt-highlight-small-size: 5px;
  /* 次高光顶部定位 */
  --wt-highlight-small-top: min(var(--wt-highlight-offset), 3px);
  /* 次高光右侧定位 */
  --wt-highlight-small-right: min(var(--wt-highlight-offset), 3px);
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
  /* 动画 */
  animation: wt-liquid-flow var(--wt-motion-normal) ease-in-out infinite;
  /* 动画性能提示 */
  will-change: border-radius;
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
  top: var(--wt-highlight-small-top);
  /* 右侧偏移 */
  right: var(--wt-highlight-small-right);
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
  transition: transform 0.18s ease;
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

.wt-radio:focus-visible .wt-radio__dot {
  /* 焦点轮廓 */
  outline: 2px solid var(--wt-primary);
  /* 焦点轮廓偏移 */
  outline-offset: 2px;
}
</style>