<script setup lang="ts">
import { computed } from 'vue'
import type { TransferItem, TransferProps } from './props'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtTransfer' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<TransferProps>(), {
  modelValue: () => [],
  data: () => [],
  titles: () => ['待选择', '已选择'],
  disabled: false,
  customClass: ''
})

/* 声明组件事件 */
const emit = defineEmits<{
  'update:modelValue': [value: Array<string | number>]
  change: [value: Array<string | number>]
}>()

/* 派生状态（计算属性） */
const leftItems = computed(() => props.data.filter((item) => !props.modelValue.includes(item.key) && !item.disabled))

/* 派生状态（计算属性） */
const rightItems = computed(() => props.data.filter((item) => props.modelValue.includes(item.key)))

/* 交互处理逻辑 */
const move = (item: TransferItem, toRight: boolean) => {
  if (props.disabled || item.disabled) return
  const next = toRight
    ? [...props.modelValue, item.key]
    : props.modelValue.filter((key) => key !== item.key)
  emit('update:modelValue', next)
  emit('change', next)
}
</script>

<template>
  <div class="wt-transfer" :class="[customClass, { 'is-disabled': disabled }]">
    <section class="wt-transfer__panel">
      <h3 class="wt-transfer__title">{{ titles[0] }}</h3>
      <ul class="wt-transfer__list">
        <li v-if="!leftItems.length" class="wt-transfer__empty">暂无数据</li>
        <li
          v-for="item in leftItems"
          :key="String(item.key)"
          class="wt-transfer__item"
          @click="move(item, true)"
        >
          {{ item.label }}
        </li>
      </ul>
    </section>

    <section class="wt-transfer__panel">
      <h3 class="wt-transfer__title">{{ titles[1] }}</h3>
      <ul class="wt-transfer__list">
        <li v-if="!rightItems.length" class="wt-transfer__empty">暂无数据</li>
        <li
          v-for="item in rightItems"
          :key="String(item.key)"
          class="wt-transfer__item is-checked"
          @click="move(item, false)"
        >
          {{ item.label }}
        </li>
      </ul>
    </section>
  </div>
</template>
<style scoped lang="scss">
.wt-transfer {
  /* 盒模型显示方式 */
  display: grid;
  /* 栅格列轨道 */
  grid-template-columns: repeat(2, minmax(0, 1fr));
  /* 元素间距 */
  gap: 12px;
  /* 宽度 */
  width: 100%;
  /* 最小宽度 */
  min-width: 0;
}

.wt-transfer__panel {
  /* 定位方式 */
  position: relative;
  /* 创建独立层叠上下文，隔离内部元素 */
  isolation: isolate;
  /* 高光尺寸 */
  --wt-highlight-size: min(var(--wt-highlight-size-base), 10px);
  /* 次高光尺寸 */
  --wt-highlight-small-size: min(calc(var(--wt-highlight-size-base) * 0.5), 5px);
  /* 高光顶部定位 */
  --wt-highlight-top: min(var(--wt-highlight-inset), calc(100% - var(--wt-highlight-size) - 4px));
  /* 高光右侧定位 */
  --wt-highlight-right: min(var(--wt-highlight-inset), calc(100% - var(--wt-highlight-size) - 4px));
  /* 次高光顶部定位 */
  --wt-highlight-small-top: min(calc(var(--wt-highlight-top) + var(--wt-highlight-size) + var(--wt-highlight-group-gap)), calc(100% - var(--wt-highlight-small-size) - 4px));
  /* 次高光右侧定位 */
  --wt-highlight-small-right: min(calc(var(--wt-highlight-right) + var(--wt-highlight-size) + var(--wt-highlight-group-gap)), calc(100% - var(--wt-highlight-small-size) - 4px));
  /* 溢出裁剪方式 */
  overflow: hidden;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-md);
  /* 背景 */
  background: color-mix(in srgb, var(--wt-surface) 90%, transparent);
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 3px 4px 10px rgba(0, 0, 0, 0.08),
    inset -2px -2px 6px var(--wt-shadow-light),
    3px 6px 16px rgba(0, 0, 0, 0.06);
  /* 动画 */
  animation: wt-liquid-flow-subtle var(--wt-motion-slow) ease-in-out infinite;
  /* 动画性能提示 */
  will-change: border-radius;
  /* 溢出裁剪方式 */
  overflow: hidden;
}

.wt-transfer__panel::after,
.wt-transfer__panel::before {
  /* 伪元素内容 */
  content: '';
  /* 定位方式 */
  position: absolute;
  /* 是否响应鼠标事件 */
  pointer-events: none;
  /* 层叠层级 */
  z-index: 2;
}

.wt-transfer__panel::after {
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

.wt-transfer__panel::before {
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

.wt-transfer__title {
  /* 外边距 */
  margin: 0;
  /* 内边距 */
  padding: 12px 14px;
  /* 文本颜色 */
  color: var(--wt-text);
  /* 字号 */
  font-size: 14px;
  /* 背景 */
  background: color-mix(in srgb, var(--wt-surface-strong) 60%, transparent);
}

.wt-transfer__list {
  /* 外边距 */
  margin: 0;
  /* 内边距 */
  padding: 8px;
  /* 列表样式 */
  list-style: none;
  /* 最小高度 */
  min-height: 160px;
  /* 溢出裁剪方式 */
  overflow: auto;
}

.wt-transfer__item,
.wt-transfer__empty {
  /* 内边距 */
  padding: 10px 12px;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-sm);
  /* 文本颜色 */
  color: var(--wt-text);
  /* 字号 */
  font-size: 14px;
  /* 鼠标指针样式 */
  cursor: pointer;
}

.wt-transfer__item:hover {
  /* 背景 */
  background: color-mix(in srgb, var(--wt-primary) 12%, transparent);
}

.wt-transfer__item.is-checked {
  /* 文本颜色 */
  color: var(--wt-primary);
}

.wt-transfer__empty {
  /* 文本颜色 */
  color: var(--wt-text-placeholder);
  /* 文本对齐方式 */
  text-align: center;
  /* 鼠标指针样式 */
  cursor: default;
}

.wt-transfer.is-disabled {
  /* 鼠标指针样式 */
  cursor: not-allowed;
  /* 透明度 */
  opacity: 0.6;
}
</style>