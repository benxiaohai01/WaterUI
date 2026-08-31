<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { AutocompleteOption, AutocompleteProps } from './props'
import { resolveSize } from '../config-provider/context'

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

/* 解析组件尺寸配置 */
const size = resolveSize(() => props.size)

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
}

/* 交互处理逻辑 */
const select = (option: AutocompleteOption) => {
  emit('update:modelValue', option.value)
  emit('select', option.value)
  emit('change', option.value)
  open.value = false
}

/* 交互处理逻辑 */
const clear = () => {
  emit('update:modelValue', '')
  emit('clear')
  open.value = false
}

/* 交互处理逻辑 */
const handleOutside = (event: PointerEvent) => {
  if (rootRef.value && !rootRef.value.contains(event.target as Node)) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('pointerdown', handleOutside))
onBeforeUnmount(() => document.removeEventListener('pointerdown', handleOutside))
</script>

<template>
  <div ref="rootRef" :class="classes">
    <div class="wt-autocomplete__field">
      <input
        class="wt-autocomplete__native"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="handleInput"
        @focus="open = true"
      >
      <button
        v-if="clearable && String(modelValue).length"
        class="wt-autocomplete__clear"
        type="button"
        aria-label="清空"
        @click="clear"
      >
        ×
      </button>
    </div>

    <div v-if="open" class="wt-autocomplete__dropdown">
      <ul class="wt-autocomplete__list">
        <li v-if="!filtered.length" class="wt-autocomplete__empty">无匹配结果</li>
        <li
          v-for="option in filtered"
          :key="String(option.value)"
          class="wt-autocomplete__option"
          @click="select(option)"
        >
          {{ option.label }}
        </li>
      </ul>
    </div>
  </div>
</template>
<style scoped lang="scss">
.wt-autocomplete {
  /* 高光尺寸 */
  --wt-highlight-size: min(var(--wt-highlight-size-base), 11px);
  /* 次高光尺寸 */
  --wt-highlight-small-size: min(calc(var(--wt-highlight-size-base) * 0.5), 6px);
  /* 高光内边距 */
  --wt-highlight-inset: min(var(--wt-highlight-offset), 6px);
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
  /* 定位方式 */
  position: relative;
  /* 创建独立层叠上下文，隔离内部元素 */
  isolation: isolate;
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

.wt-autocomplete__field::after,
.wt-autocomplete__field::before {
  /* 伪元素内容 */
  content: '';
  /* 定位方式 */
  position: absolute;
  /* 是否响应鼠标事件 */
  pointer-events: none;
  /* 层叠层级 */
  z-index: 2;
}

.wt-autocomplete__field::after {
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

.wt-autocomplete__field::before {
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

.wt-autocomplete__option:hover {
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