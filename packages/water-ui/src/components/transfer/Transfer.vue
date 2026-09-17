<script setup lang="ts">
import { computed } from 'vue'
import type { TransferItem, TransferProps } from './props'
import { useHighlightStyle } from '../../utils/highlight'

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

/* 组件级高光参数（优先级高于全局配置） */
const highlightStyle = useHighlightStyle(props)

/* 派生状态（计算属性）：按 key 去重（统一字符串比较，避免重复 key 造成告警与条目丢失） */
const uniqueData = computed(() => {
  const seen = new Set<string>()
  return props.data.filter((item) => {
    const key = String(item.key)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
})

/* 派生状态（计算属性）：已选 key 集合（统一字符串比较，兼容 key 类型不一致） */
const selectedKeys = computed(() => new Set(props.modelValue.map((key) => String(key))))

/* 派生状态（计算属性）：禁用项保留渲染并置灰，仅不可移动 */
const leftItems = computed(() => uniqueData.value.filter((item) => !selectedKeys.value.has(String(item.key))))

/* 派生状态（计算属性） */
const rightItems = computed(() => uniqueData.value.filter((item) => selectedKeys.value.has(String(item.key))))

/* 交互处理逻辑 */
const move = (item: TransferItem, toRight: boolean) => {
  if (props.disabled || item.disabled) return
  /* 以 data 中实际存在的已选 key 为基准，顺带清理残留 key */
  const current = rightItems.value.map((entry) => entry.key)
  const next = toRight
    ? [...current, item.key]
    : current.filter((key) => String(key) !== String(item.key))
  emit('update:modelValue', next)
  emit('change', next)
}
</script>

<template>
  <div class="wt-transfer" :class="[customClass, { 'is-disabled': disabled }]" :style="highlightStyle">
    <section class="wt-transfer__panel">
      <h3 class="wt-transfer__title">{{ titles[0] }}</h3>
      <ul class="wt-transfer__list">
        <li v-if="!leftItems.length" class="wt-transfer__empty">暂无数据</li>
        <li
          v-for="item in leftItems"
          :key="String(item.key)"
          class="wt-transfer__item"
          :class="{ 'is-disabled': item.disabled }"
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
          :class="{ 'is-disabled': item.disabled }"
          @click="move(item, false)"
        >
          {{ item.label }}
        </li>
      </ul>
    </section>
  </div>
</template>
<style scoped lang="scss">
@use '@water-ui/theme/src/mixins/index.scss' as wt;

.wt-transfer {
  /* 高光尺寸（随全局基准等比缩放，声明在根元素以便内联参数生效） */
  --wt-highlight-size: calc(var(--wt-highlight-size-base) * 0.8333);
  /* 次高光尺寸（随全局基准等比缩放） */
  --wt-highlight-small-size: calc(var(--wt-highlight-size-base) * 0.5 * 0.8333);
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
  /* 水滴高光：定位方式 + 独立层叠上下文 + 主/次高光伪元素（层叠层级 2） */
  @include wt.wt-liquid-highlights(2);
  /* 高光顶部定位 */
  --wt-highlight-top: min(var(--wt-highlight-inset), calc(100% - var(--wt-highlight-size) - 4px));
  /* 高光右侧定位 */
  --wt-highlight-right: min(var(--wt-highlight-inset), calc(100% - var(--wt-highlight-size) - 4px));
  /* 次高光顶部定位 */
  --wt-highlight-small-top: min(calc(min(var(--wt-highlight-inset), calc(100% - var(--wt-highlight-size) - 4px)) + var(--wt-highlight-size) + var(--wt-highlight-group-gap)), calc(100% - var(--wt-highlight-small-size) - 4px));
  /* 次高光右侧定位 */
  --wt-highlight-small-right: min(calc(min(var(--wt-highlight-inset), calc(100% - var(--wt-highlight-size) - 4px)) + var(--wt-highlight-size) + var(--wt-highlight-group-gap)), calc(100% - var(--wt-highlight-small-size) - 4px));
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
  /* 液体形变动画（含 will-change: border-radius） */
  @include wt.wt-liquid-animation(wt-liquid-flow-subtle, var(--wt-motion-slow));
  /* 溢出裁剪方式 */
  overflow: hidden;
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

.wt-transfer__item.is-disabled {
  /* 鼠标指针样式 */
  cursor: not-allowed;
  /* 透明度 */
  opacity: 0.5;
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