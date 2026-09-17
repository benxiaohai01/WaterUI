<script setup lang="ts">
import { computed } from 'vue'
import type { SliderProps } from './props'
import { useHighlightStyle } from '../../utils/highlight'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtSlider' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<SliderProps>(), {
  modelValue: 0,
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
  showValue: false
})

/* 声明组件事件 */
const emit = defineEmits<{
  'update:modelValue': [value: number]
  change: [value: number]
}>()

/* 组件级高光参数（优先级高于全局配置）：滑动条暂无高光伪元素，仅提供统一的内联变量接线 */
const highlightStyle = useHighlightStyle(props)

// --wt-slider-progress：滑块已填充区域的百分比，用于绘制水滴渐变进度。
const progress = computed(() => {
  const range = props.max - props.min
  return range ? `${((props.modelValue - props.min) / range) * 100}%` : '0%'
})

/* 交互处理逻辑 */
const handleInput = (event: Event) => {
  const next = Number((event.target as HTMLInputElement).value)
  emit('update:modelValue', next)
}

/* 交互处理逻辑 */
const handleChange = (event: Event) => {
  emit('change', Number((event.target as HTMLInputElement).value))
}
</script>

<template>
  <div class="wt-slider" :class="{ 'is-disabled': disabled }" :style="highlightStyle">
    <input
      class="wt-slider__native"
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :value="modelValue"
      :disabled="disabled"
      :style="{ '--wt-slider-progress': progress }"
      @input="handleInput"
      @change="handleChange"
    >
    <span v-if="showValue" class="wt-slider__value">{{ modelValue }}</span>
  </div>
</template>
<style scoped lang="scss">
.wt-slider {
  /* 盒模型显示方式 */
  display: inline-flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 元素间距 */
  gap: 10px;
  /* 宽度 */
  width: 100%;
  /* 最小宽度 */
  min-width: 0;
}

.wt-slider__native {
  /* 宽度 */
  width: 100%;
  /* 高度 */
  height: 8px;
  /* 外边距 */
  margin: 0;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: 999px;
  /* 原生控件外观 */
  appearance: none;
  /* 原生控件外观 */
  -webkit-appearance: none;
  /* 背景 */
  background: linear-gradient(
    to right,
    color-mix(in srgb, var(--wt-primary) 72%, white) 0 var(--wt-slider-progress),
    color-mix(in srgb, var(--wt-surface-strong) 82%, transparent) var(--wt-slider-progress) 100%
  );
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 2px 3px 6px rgba(0, 0, 0, 0.16),
    inset -1px -1px 3px var(--wt-shadow-light);
  /* 鼠标指针样式 */
  cursor: pointer;
}

.wt-slider__native::-webkit-slider-thumb {
  /* 宽度 */
  width: 20px;
  /* 高度 */
  height: 20px;
  /* 原生控件外观 */
  appearance: none;
  /* 原生控件外观 */
  -webkit-appearance: none;
  /* 边框 */
  border: 0;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: 52% 48% 46% 54% / 50% 46% 54% 50%;
  /* 背景 */
  background: linear-gradient(145deg, var(--wt-primary), color-mix(in srgb, var(--wt-primary) 72%, white));
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 2px 3px 5px rgba(255, 255, 255, 0.38),
    inset -2px -2px 5px rgba(0, 0, 0, 0.22),
    2px 3px 8px color-mix(in srgb, var(--wt-primary) 36%, transparent);
  /* 鼠标指针样式 */
  cursor: grab;
}

.wt-slider__native:active::-webkit-slider-thumb {
  /* 鼠标指针样式 */
  cursor: grabbing;
  /* 形变 */
  transform: scale(1.08);
}

.wt-slider__value {
  /* 最小宽度 */
  min-width: 32px;
  /* 文本颜色 */
  color: var(--wt-text-secondary);
  /* 字号 */
  font-size: 12px;
  /* 文本对齐方式 */
  text-align: right;
}

.wt-slider.is-disabled {
  /* 鼠标指针样式 */
  cursor: not-allowed;
  /* 透明度 */
  opacity: 0.55;
}

.wt-slider.is-disabled .wt-slider__native {
  /* 鼠标指针样式 */
  cursor: not-allowed;
}
</style>