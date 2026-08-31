<script setup lang="ts">
import { computed } from 'vue'
import type { RateProps } from './props'
import { WtIcon } from '../icon'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtRate' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<RateProps>(), {
  modelValue: 0,
  max: 5,
  disabled: false,
  allowHalf: false,
  customClass: ''
})

/* 声明组件事件 */
const emit = defineEmits<{
  'update:modelValue': [value: number]
  change: [value: number]
}>()

/* 派生状态（计算属性） */
const items = computed(() => Array.from({ length: props.max }, (_, index) => index + 1))

/* 交互处理逻辑 */
const select = (value: number) => {
  if (props.disabled) return
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<template>
  <div class="wt-rate" :class="[{ 'is-disabled': disabled }, customClass]">
    <button
      v-for="item in items"
      :key="item"
      class="wt-rate__item"
      type="button"
      :class="{ 'is-active': modelValue >= item }"
      :aria-label="`评分 ${item}`"
      :disabled="disabled"
      @click="select(item)"
    >
      <wt-icon name="star" :size="22" color="var(--wt-text-placeholder)" />
      <span
        class="wt-rate__fill"
        :style="{
          width: modelValue >= item ? '100%' : modelValue > item - 1 && allowHalf ? '50%' : '0%'
        }"
      >
        <wt-icon name="star" :size="22" color="var(--wt-warning)" />
      </span>
    </button>
  </div>
</template>
<style scoped lang="scss">
.wt-rate {
  /* 定位方式 */
  position: relative;
  /* 创建独立层叠上下文，隔离内部元素 */
  isolation: isolate;
  /* 高光尺寸 */
  --wt-highlight-size: min(var(--wt-highlight-size-base), 9px);
  /* 次高光尺寸 */
  --wt-highlight-small-size: min(calc(var(--wt-highlight-size-base) * 0.5), 4px);
  /* 高光内边距 */
  --wt-highlight-inset: 3px;
  /* 高光顶部定位 */
  --wt-highlight-top: var(--wt-highlight-inset);
  /* 高光右侧定位 */
  --wt-highlight-right: var(--wt-highlight-inset);
  /* 次高光顶部定位 */
  --wt-highlight-small-top: calc(var(--wt-highlight-top) + var(--wt-highlight-size) + var(--wt-highlight-group-gap));
  /* 次高光右侧定位 */
  --wt-highlight-small-right: calc(var(--wt-highlight-right) + var(--wt-highlight-size) + var(--wt-highlight-group-gap));
  /* 盒模型显示方式 */
  display: inline-flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 元素间距 */
  gap: 4px;
}

.wt-rate::after,
.wt-rate::before {
  /* 伪元素内容 */
  content: '';
  /* 定位方式 */
  position: absolute;
  /* 是否响应鼠标事件 */
  pointer-events: none;
  /* 层叠层级 */
  z-index: 2;
}

.wt-rate::after {
  /* 宽度 */
  width: var(--wt-highlight-size);
  /* 高度 */
  height: var(--wt-highlight-size);
  /* 顶部偏移 */
  top: var(--wt-highlight-top);
  /* 右侧偏移 */
  right: var(--wt-highlight-right);
  /* 背景 */
  background: var(--wt-highlight);
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-highlight-radius);
  /* 动画 */
  animation: wt-highlight-float var(--wt-motion-normal) ease-in-out infinite;
  /* 透明度 */
  opacity: var(--wt-highlight-opacity);
}

.wt-rate::before {
  /* 宽度 */
  width: var(--wt-highlight-small-size);
  /* 高度 */
  height: var(--wt-highlight-small-size);
  /* 顶部偏移 */
  top: var(--wt-highlight-small-top);
  /* 右侧偏移 */
  right: var(--wt-highlight-small-right);
  /* 背景 */
  background: var(--wt-highlight-small);
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-highlight-small-radius);
  /* 动画 */
  animation: wt-highlight-float-small var(--wt-motion-slow) ease-in-out infinite;
  /* 透明度 */
  opacity: var(--wt-highlight-small-opacity);
}

.wt-rate__item {
  /* 定位方式 */
  position: relative;
  /* 盒模型显示方式 */
  display: inline-flex;
  /* 边框 */
  border: 0;
  /* 内边距 */
  padding: 2px;
  /* 背景 */
  background: transparent;
  /* 鼠标指针样式 */
  cursor: pointer;
  /* 溢出裁剪方式 */
  overflow: hidden;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: 14px 10px 16px 11px / 11px 14px 10px 16px;
  /* 动画 */
  animation: wt-rate-liquid var(--wt-motion-normal) ease-in-out infinite;
  /* 动画性能提示 */
  will-change: border-radius;
  /* 过渡动画 */
  transition:
    transform 0.2s ease,
    background 0.25s ease,
    box-shadow 0.25s ease;
}

.wt-rate__item:hover {
  /* 形变 */
  transform: translateY(-1px);
  /* 背景 */
  background: color-mix(in srgb, var(--wt-primary) 8%, transparent);
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 1px 2px 4px rgba(0, 0, 0, 0.08),
    0 3px 10px color-mix(in srgb, var(--wt-primary) 14%, transparent);
}

.wt-rate__fill {
  /* 定位方式 */
  position: absolute;
  /* 上下左右偏移合成属性 */
  inset: 2px auto 2px 2px;
  /* 溢出裁剪方式 */
  overflow: hidden;
  /* 是否响应鼠标事件 */
  pointer-events: none;
}

.wt-rate.is-disabled {
  /* 鼠标指针样式 */
  cursor: not-allowed;
  /* 透明度 */
  opacity: 0.55;
}

@keyframes wt-rate-liquid {
  0% {
    /* 圆角，塑造水滴/液体轮廓 */
    border-radius: 14px 10px 16px 11px / 11px 14px 10px 16px;
  }

  50% {
    /* 圆角，塑造水滴/液体轮廓 */
    border-radius: 17px 12px 14px 15px / 15px 13px 17px 12px;
  }

  100% {
    /* 圆角，塑造水滴/液体轮廓 */
    border-radius: 14px 10px 16px 11px / 11px 14px 10px 16px;
  }
}
</style>