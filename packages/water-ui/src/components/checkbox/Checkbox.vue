<script setup lang="ts">
import { computed } from 'vue'
import type { CheckboxProps } from './props'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtCheckbox' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<CheckboxProps>(), {
  modelValue: false,
  disabled: false,
  indeterminate: false,
  customClass: ''
})

/* 声明组件事件 */
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  change: [value: boolean]
}>()

/* 派生状态（计算属性） */
const classes = computed(() => [
  'wt-checkbox',
  {
    'is-checked': props.modelValue,
    'is-disabled': props.disabled,
    'is-indeterminate': props.indeterminate
  },
  props.customClass
])

/* 交互处理逻辑 */
const handleChange = (event: Event) => {
  const next = (event.target as HTMLInputElement).checked
  emit('update:modelValue', next)
  emit('change', next)
}
</script>

<template>
  <label :class="classes">
    <input
      class="wt-checkbox__input"
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      :indeterminate.prop="indeterminate"
      @change="handleChange"
    >
    <span class="wt-checkbox__box" aria-hidden="true">
      <span class="wt-checkbox__mark" />
    </span>
    <span class="wt-checkbox__label"><slot /></span>
  </label>
</template>
<style scoped lang="scss">
.wt-checkbox {
  /* 次高光尺寸 */
  --wt-highlight-small-size: 5px;
  /* 次高光顶部定位 */
  --wt-highlight-small-top: min(var(--wt-highlight-offset), 3px);
  /* 次高光右侧定位 */
  --wt-highlight-small-right: min(var(--wt-highlight-offset), 3px);
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

.wt-checkbox__input {
  /* 定位方式 */
  position: absolute;
  /* 透明度 */
  opacity: 0;
  /* 是否响应鼠标事件 */
  pointer-events: none;
}

.wt-checkbox__box {
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
    2px 3px 8px rgba(0, 0, 0, 0.08);
  /* 动画 */
  animation: wt-liquid-flow var(--wt-motion-normal) ease-in-out infinite;
  /* 动画性能提示 */
  will-change: border-radius;
}

.wt-checkbox__box::after {
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

.wt-checkbox__mark {
  /* 宽度 */
  width: 9px;
  /* 高度 */
  height: 5px;
  /* 边框 */
  border: 2px solid #fff;
  /* 顶部边框 */
  border-top: 0;
  /* 右侧边框 */
  border-right: 0;
  /* 形变 */
  transform: rotate(-45deg) scale(0);
  /* 过渡动画 */
  transition: transform 0.18s ease;
}

.wt-checkbox.is-checked .wt-checkbox__box {
  /* 背景 */
  background: linear-gradient(145deg, color-mix(in srgb, var(--wt-primary) 78%, white), var(--wt-primary));
}

.wt-checkbox.is-checked .wt-checkbox__mark {
  /* 形变 */
  transform: rotate(-45deg) scale(1);
}

.wt-checkbox.is-indeterminate .wt-checkbox__mark {
  /* 宽度 */
  width: 10px;
  /* 高度 */
  height: 2px;
  /* 边框 */
  border: 0;
  /* 背景 */
  background: #fff;
  /* 形变 */
  transform: none;
}

.wt-checkbox.is-disabled {
  /* 鼠标指针样式 */
  cursor: not-allowed;
  /* 透明度 */
  opacity: 0.55;
}

.wt-checkbox:focus-visible .wt-checkbox__box {
  /* 焦点轮廓 */
  outline: 2px solid var(--wt-primary);
  /* 焦点轮廓偏移 */
  outline-offset: 2px;
}
</style>