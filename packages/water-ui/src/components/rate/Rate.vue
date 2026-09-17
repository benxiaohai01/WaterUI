<script setup lang="ts">
import { computed } from 'vue'
import type { RateProps } from './props'
import { WtIcon } from '../icon'
import { useHighlightStyle } from '../../utils/highlight'

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

/* 组件级高光参数（优先级高于全局配置） */
const highlightStyle = useHighlightStyle(props)

/* 派生状态（计算属性）：最大评分值收敛为 1~10 的整数，避免极大值渲染海量节点 */
const max = computed(() => {
  const value = Math.trunc(Number(props.max))
  if (!Number.isFinite(value)) return 5
  return Math.min(10, Math.max(1, value))
})

/* 派生状态（计算属性） */
const items = computed(() => Array.from({ length: max.value }, (_, index) => index + 1))

/* 交互处理逻辑：allowHalf 时按点击位置判定左半（x.5）/右半（x） */
const select = (event: MouseEvent, item: number) => {
  if (props.disabled) return
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const isHalf = props.allowHalf && rect.width > 0 && event.clientX - rect.left < rect.width / 2
  const value = isHalf ? item - 0.5 : item
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<template>
  <div class="wt-rate" :class="[{ 'is-disabled': disabled }, customClass]" :style="highlightStyle">
    <button
      v-for="item in items"
      :key="item"
      class="wt-rate__item"
      type="button"
      :class="{ 'is-active': modelValue >= item }"
      :aria-label="`评分 ${item}`"
      :disabled="disabled"
      @click="select($event, item)"
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
@use '@water-ui/theme/src/mixins/index.scss' as wt;

.wt-rate {
  /* 水滴高光：定位方式 + 独立层叠上下文 + 主/次高光伪元素（层叠层级 2） */
  @include wt.wt-liquid-highlights(2);
  /* 高光尺寸（随全局基准等比缩放，9px / 12px） */
  --wt-highlight-size: calc(var(--wt-highlight-size-base) * 0.75);
  /* 次高光尺寸（随全局基准等比缩放，4px / 12px） */
  --wt-highlight-small-size: calc(var(--wt-highlight-size-base) * 0.5 * 0.6667);
  /* 高光内边距（随全局偏移等比缩放，3px / 8px） */
  --wt-highlight-inset: calc(var(--wt-highlight-offset) * 0.375);
  /* 高光顶部定位 */
  --wt-highlight-top: var(--wt-highlight-inset);
  /* 高光右侧定位 */
  --wt-highlight-right: var(--wt-highlight-inset);
  /* 次高光顶部定位 */
  --wt-highlight-small-top: calc(min(var(--wt-highlight-inset), calc(100% - var(--wt-highlight-size) - 4px)) + var(--wt-highlight-size) + var(--wt-highlight-group-gap));
  /* 次高光右侧定位 */
  --wt-highlight-small-right: calc(min(var(--wt-highlight-inset), calc(100% - var(--wt-highlight-size) - 4px)) + var(--wt-highlight-size) + var(--wt-highlight-group-gap));
  /* 盒模型显示方式 */
  display: inline-flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 元素间距 */
  gap: 4px;
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
  /* 液体形变动画（自定义动画名 wt-rate-liquid，含 will-change: border-radius） */
  @include wt.wt-liquid-animation(wt-rate-liquid, var(--wt-motion-normal), border-radius);
  /* 过渡动画 */
  transition:
    transform var(--wt-motion-fast) ease,
    background var(--wt-motion-fast) ease,
    box-shadow var(--wt-motion-fast) ease;
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