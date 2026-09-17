<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { AutocompleteOption, AutocompleteProps } from './props'
import { resolveSize } from '../config-provider/context'
import { useHighlightStyle } from '../../utils/highlight'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtAutocomplete' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<AutocompleteProps>(), {
  modelValue: '',
  suggestions: () => [],
  placeholder: '',
  disabled: false,
  clearable: false,
  customClass: ''
})

/* 声明组件事件 */
const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  input: [value: string | number]
  select: [value: string | number]
  change: [value: string | number]
  clear: []
}>()

/* 响应式状态 */
const open = ref(false)
const rootRef = ref<HTMLDivElement>()
const activeIndex = ref(-1)

/* 解析组件尺寸配置 */
const size = resolveSize(() => props.size)

/* 组件级高光参数（优先级高于全局配置） */
const highlightStyle = useHighlightStyle(props)

const normalize = (item: string | AutocompleteOption): AutocompleteOption => {
  return typeof item === 'string' ? { label: item, value: item } : item
}

/* 派生状态（计算属性） */
const filtered = computed(() => {
  const keyword = String(props.modelValue)
  if (!keyword) return props.suggestions.map(normalize)
  return props.suggestions
    .map(normalize)
    .filter((option) => option.label.toLowerCase().includes(keyword.toLowerCase()))
})

/* 派生状态（计算属性） */
const classes = computed(() => [
  'wt-autocomplete',
  `wt-autocomplete--${size.value}`,
  {
    'is-disabled': props.disabled,
    'is-open': open.value
  },
  props.customClass
])

/* 交互处理逻辑 */
const handleInput = (event: Event) => {
  const next = (event.target as HTMLInputElement).value
  emit('update:modelValue', next)
  emit('input', next)
  open.value = true
  activeIndex.value = -1
}

/* 交互处理逻辑 */
const select = (option: AutocompleteOption) => {
  emit('update:modelValue', option.value)
  emit('select', option.value)
  emit('change', option.value)
  open.value = false
  activeIndex.value = -1
}

/* 交互处理逻辑 */
const clear = () => {
  emit('update:modelValue', '')
  emit('clear')
  open.value = false
  activeIndex.value = -1
}

/* 交互处理逻辑：下拉开启 */
const handleFocus = () => {
  open.value = true
  activeIndex.value = -1
}

/* 交互处理逻辑：失焦（选项面板已阻止 mousedown 默认行为，不会误关） */
const handleBlur = () => {
  open.value = false
  activeIndex.value = -1
}

/* 交互处理逻辑：键盘移动高亮项（循环） */
const moveActive = (delta: number) => {
  if (!open.value) open.value = true
  const total = filtered.value.length
  if (!total) {
    activeIndex.value = -1
    return
  }
  const next = activeIndex.value + delta
  activeIndex.value = next < 0 ? total - 1 : next >= total ? 0 : next
}

/* 交互处理逻辑：最小键盘可达性（上下移动、回车选中、Esc 关闭） */
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    moveActive(1)
    return
  }
  if (event.key === 'ArrowUp') {
    event.preventDefault()
    moveActive(-1)
    return
  }
  if (event.key === 'Enter' && open.value && activeIndex.value >= 0) {
    const option = filtered.value[activeIndex.value]
    if (option) {
      event.preventDefault()
      select(option)
    }
    return
  }
  if (event.key === 'Escape' && open.value) {
    event.preventDefault()
    open.value = false
    activeIndex.value = -1
  }
}

/* 交互处理逻辑 */
const handleOutside = (event: PointerEvent) => {
  if (rootRef.value && !rootRef.value.contains(event.target as Node)) {
    open.value = false
    activeIndex.value = -1
  }
}

onMounted(() => document.addEventListener('pointerdown', handleOutside))
onBeforeUnmount(() => document.removeEventListener('pointerdown', handleOutside))
</script>

<template>
  <div ref="rootRef" :class="classes" :style="highlightStyle">
    <div class="wt-autocomplete__field">
      <input
        class="wt-autocomplete__native"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        role="combobox"
        aria-autocomplete="list"
        :aria-expanded="open"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
      >
      <button
        v-if="clearable && String(modelValue).length && !disabled"
        class="wt-autocomplete__clear"
        type="button"
        aria-label="清空"
        @click="clear"
      >
        ×
      </button>
    </div>

    <div v-if="open" class="wt-autocomplete__dropdown">
      <ul class="wt-autocomplete__list" role="listbox">
        <li v-if="!filtered.length" class="wt-autocomplete__empty">无匹配结果</li>
        <li
          v-for="(option, index) in filtered"
          :key="String(option.value)"
          class="wt-autocomplete__option"
          :class="{ 'is-active': index === activeIndex }"
          role="option"
          tabindex="-1"
          :aria-selected="index === activeIndex"
          @mousedown.prevent
          @click="select(option)"
        >
          {{ option.label }}
        </li>
      </ul>
    </div>
  </div>
</template>
<style scoped lang="scss">
@use '@water-ui/theme/src/mixins/index.scss' as wt;

.wt-autocomplete {
  /* 高光尺寸（随全局基准等比缩放，11px / 12px） */
  --wt-highlight-size: calc(var(--wt-highlight-size-base) * 0.9167);
  /* 次高光尺寸（随全局基准等比缩放，6px / 12px） */
  --wt-highlight-small-size: calc(var(--wt-highlight-size-base) * 0.5);
  /* 高光内边距（随全局偏移等比缩放，6px / 8px） */
  --wt-highlight-inset: calc(var(--wt-highlight-offset) * 0.75);
  /* 定位方式 */
  position: relative;
  /* 创建独立层叠上下文，隔离内部元素 */
  isolation: isolate;
  /* 层叠层级 */
  z-index: 1;
  /* 宽度 */
  width: 100%;
  /* 最小宽度 */
  min-width: 0;
}

.wt-autocomplete.is-open {
  /* 层叠层级 */
  z-index: 40;
}

.wt-autocomplete__field {
  /* 水滴高光：定位方式 + 独立层叠上下文 + 主/次高光伪元素（层叠层级 2） */
  @include wt.wt-liquid-highlights(2);
  /* 盒模型显示方式 */
  display: inline-flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 宽度 */
  width: 100%;
  /* 溢出裁剪方式 */
  overflow: hidden;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-md);
  /* 背景 */
  background: linear-gradient(
    145deg,
    rgba(0, 0, 0, var(--wt-shadow-dark-alpha)),
    rgba(0, 0, 0, var(--wt-shadow-dark-alpha-strong))
  );
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 3px 4px 8px rgba(0, 0, 0, 0.15),
    inset -2px -2px 5px var(--wt-shadow-light),
    3px 4px 12px rgba(0, 0, 0, 0.1),
    0 1px 4px rgba(0, 0, 0, 0.06);
  /* 动画 */
  animation: wt-liquid-flow-subtle var(--wt-motion-slow) ease-in-out infinite;
}

.wt-autocomplete__native {
  /* 弹性布局中的伸缩比例 */
  flex: 1;
  /* 最小宽度 */
  min-width: 0;
  /* 边框 */
  border: 0;
  /* 焦点轮廓 */
  outline: 0;
  /* 背景 */
  background: transparent;
  /* 文本颜色 */
  color: var(--wt-text);
  /* 字体族 */
  font-family: inherit;
  /* 字号 */
  font-size: 15px;
  /* 内边距 */
  padding: 11px 16px;
  /* 文本阴影 */
  text-shadow: var(--wt-text-shadow);
}

.wt-autocomplete--small .wt-autocomplete__native {
/* 内边距 */
padding: 7px 12px;
  /* 字号 */
  font-size: 13px;
}
.wt-autocomplete--large .wt-autocomplete__native {
/* 内边距 */
padding: 14px 20px;
  /* 字号 */
  font-size: 17px;
}

.wt-autocomplete__clear {
  /* 右侧外边距 */
  margin-right: 8px;
  /* 边框 */
  border: 0;
  /* 背景 */
  background: transparent;
  /* 文本颜色 */
  color: var(--wt-text-placeholder);
  /* 字号 */
  font-size: 18px;
  /* 鼠标指针样式 */
  cursor: pointer;
}

.wt-autocomplete__dropdown {
  /* 定位方式 */
  position: absolute;
  /* 顶部偏移 */
  top: calc(100% + 6px);
  /* 左侧偏移 */
  left: 0;
  /* 层叠层级 */
  z-index: 30;
  /* 宽度 */
  width: 100%;
  /* 最大高度 */
  max-height: 220px;
  /* 溢出裁剪方式 */
  overflow: auto;
  /* 内边距 */
  padding: 6px;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-md);
  /* 背景 */
  background: color-mix(in srgb, var(--wt-surface) 94%, transparent);
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 2px 3px 8px rgba(0, 0, 0, 0.08),
    inset -2px -2px 5px var(--wt-shadow-light),
    3px 6px 16px rgba(0, 0, 0, 0.12);
}

.wt-autocomplete__list {
  /* 外边距 */
  margin: 0;
  /* 内边距 */
  padding: 0;
  /* 列表样式 */
  list-style: none;
}

.wt-autocomplete__option,
.wt-autocomplete__empty {
  /* 内边距 */
  padding: 9px 12px;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-sm);
  /* 文本颜色 */
  color: var(--wt-text);
  /* 字号 */
  font-size: 14px;
  /* 鼠标指针样式 */
  cursor: pointer;
}

.wt-autocomplete__option:hover,
.wt-autocomplete__option.is-active {
  /* 背景 */
  background: color-mix(in srgb, var(--wt-primary) 14%, transparent);
  /* 文本颜色 */
  color: var(--wt-primary);
}

.wt-autocomplete__empty {
  /* 文本颜色 */
  color: var(--wt-text-placeholder);
  /* 鼠标指针样式 */
  cursor: default;
  /* 文本对齐方式 */
  text-align: center;
}

.wt-autocomplete.is-disabled {
  /* 鼠标指针样式 */
  cursor: not-allowed;
  /* 透明度 */
  opacity: 0.6;
}
</style>