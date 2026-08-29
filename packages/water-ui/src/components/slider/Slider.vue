<script setup lang="ts">
import { computed } from 'vue'
import type { SliderProps } from './props'

defineOptions({ name: 'WtSlider' })

const props = withDefaults(defineProps<SliderProps>(), {
  modelValue: 0,
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
  showValue: false
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
  change: [value: number]
}>()

// --wt-slider-progress：滑块已填充区域的百分比，用于绘制水滴渐变进度。
const progress = computed(() => {
  const range = props.max - props.min
  return range ? `${((props.modelValue - props.min) / range) * 100}%` : '0%'
})

const handleInput = (event: Event) => {
  const next = Number((event.target as HTMLInputElement).value)
  emit('update:modelValue', next)
}

const handleChange = (event: Event) => {
  emit('change', Number((event.target as HTMLInputElement).value))
}
</script>

<template>
  <div class="wt-slider" :class="{ 'is-disabled': disabled }">
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
  display: inline-flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-width: 0;
}

.wt-slider__native {
  width: 100%;
  height: 8px;
  margin: 0;
  border-radius: 999px;
  appearance: none;
  -webkit-appearance: none;
  background: linear-gradient(
    to right,
    color-mix(in srgb, var(--wt-primary) 72%, white) 0 var(--wt-slider-progress),
    color-mix(in srgb, var(--wt-surface-strong) 82%, transparent) var(--wt-slider-progress) 100%
  );
  box-shadow:
    inset 2px 3px 6px rgba(0, 0, 0, 0.16),
    inset -1px -1px 3px var(--wt-shadow-light);
  cursor: pointer;
}

.wt-slider__native::-webkit-slider-thumb {
  width: 20px;
  height: 20px;
  appearance: none;
  -webkit-appearance: none;
  border: 0;
  border-radius: 52% 48% 46% 54% / 50% 46% 54% 50%;
  background: linear-gradient(145deg, var(--wt-primary), color-mix(in srgb, var(--wt-primary) 72%, white));
  box-shadow:
    inset 2px 3px 5px rgba(255, 255, 255, 0.38),
    inset -2px -2px 5px rgba(0, 0, 0, 0.22),
    2px 3px 8px color-mix(in srgb, var(--wt-primary) 36%, transparent);
  cursor: grab;
}

.wt-slider__native:active::-webkit-slider-thumb {
  cursor: grabbing;
  transform: scale(1.08);
}

.wt-slider__value {
  min-width: 32px;
  color: var(--wt-text-secondary);
  font-size: 12px;
  text-align: right;
}

.wt-slider.is-disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.wt-slider.is-disabled .wt-slider__native {
  cursor: not-allowed;
}
</style>
