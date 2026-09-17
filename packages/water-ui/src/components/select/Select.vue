<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import type { SelectOption, SelectProps } from './props'
import { provideSelectOptions, type SelectOptionValue } from './context'
import { resolveSize } from '../config-provider/context'
import { useHighlightStyle } from '../../utils/highlight'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtSelect' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<SelectProps>(), {
  modelValue: undefined,
  options: () => [],
  placeholder: '请选择',
  disabled: false,
  clearable: false,
  customClass: ''
})

/* 声明组件事件 */
const emit = defineEmits<{
  'update:modelValue': [value: string | number | boolean]
  change: [value: string | number | boolean]
  visibleChange: [visible: boolean]
  clear: []
}>()

const registeredOptions = reactive<SelectOptionValue[]>([])

/* 响应式状态 */
const open = ref(false)
const selectRef = ref<HTMLDivElement>()

/* 解析组件尺寸配置 */
const size = resolveSize(() => props.size)

/* 组件级高光参数（优先级高于全局配置） */
const highlightStyle = useHighlightStyle(props)

provideSelectOptions({
  register: (option) => {
    registeredOptions.push(option)
  },
  unregister: (option) => {
    const index = registeredOptions.indexOf(option)
    if (index !== -1) registeredOptions.splice(index, 1)
  }
})

const mergedOptions = computed<SelectOption[]>(() => {
  if (props.options.length) return props.options
  return registeredOptions
})

/* 派生状态（计算属性） */
const display = computed(() => {
  const selected = mergedOptions.value.find((option) => option.value === props.modelValue)
  return selected?.label || ''
})

/* 派生状态（计算属性） */
const classes = computed(() => [
  'wt-select',
  `wt-select--${size.value}`,
  {
    'is-disabled': props.disabled,
    'is-open': open.value
  },
  props.customClass
])

/* 可键盘导航的选项列表（跳过禁用项） */
const enabledOptions = computed(() => mergedOptions.value.filter((option) => !option.disabled))
const activeIndex = ref(-1)

/* 交互处理逻辑 */
const toggle = () => {
  if (props.disabled) return
  open.value = !open.value
  activeIndex.value = -1
  emit('visibleChange', open.value)
}

/* 交互处理逻辑 */
const close = () => {
  if (!open.value) return
  open.value = false
  activeIndex.value = -1
  emit('visibleChange', false)
}

/* 交互处理逻辑 */
const select = (option: SelectOption) => {
  if (props.disabled || option.disabled) return
  if (option.value !== props.modelValue) {
    emit('update:modelValue', option.value)
    emit('change', option.value)
  }
  close()
}

/* 交互处理逻辑：移动键盘高亮 */
const moveActive = (step: number) => {
  const list = enabledOptions.value
  if (!list.length) return
  const base = activeIndex.value
  activeIndex.value =
    base < 0 ? (step > 0 ? 0 : list.length - 1) : (base + step + list.length) % list.length
}

/* 交互处理逻辑：键盘操作触发器 */
const handleTriggerKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault()
      if (open.value && activeIndex.value >= 0) {
        select(enabledOptions.value[activeIndex.value])
      } else {
        toggle()
      }
      break
    case 'ArrowDown':
      event.preventDefault()
      if (!open.value) {
        toggle()
      } else {
        moveActive(1)
      }
      break
    case 'ArrowUp':
      event.preventDefault()
      if (!open.value) {
        toggle()
      } else {
        moveActive(-1)
      }
      break
    case 'Escape':
      close()
      break
  }
}

/* 交互处理逻辑 */
const clear = () => {
  if (props.disabled) return
  emit('update:modelValue', '')
  emit('change', '')
  emit('clear')
}

/* 交互处理逻辑 */
const handleOutside = (event: PointerEvent) => {
  if (!open.value) return
  if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
    close()
  }
}

onMounted(() => document.addEventListener('pointerdown', handleOutside))
onBeforeUnmount(() => document.removeEventListener('pointerdown', handleOutside))
</script>

<template>
  <div ref="selectRef" :class="classes" :style="highlightStyle">
    <div class="wt-select__shadow" aria-hidden="true">
      <slot />
    </div>

    <div
      class="wt-select__trigger"
      role="button"
      tabindex="0"
      aria-haspopup="listbox"
      :aria-expanded="open"
      :aria-disabled="disabled"
      @click="toggle"
      @keydown="handleTriggerKeydown"
    >
      <span class="wt-select__value" :class="{ 'is-placeholder': !display }">
        {{ display || placeholder }}
      </span>
      <button
        v-if="clearable && !disabled && modelValue !== undefined && String(modelValue) !== ''"
        class="wt-select__clear"
        type="button"
        aria-label="清空"
        @click.stop="clear"
      >
        ×
      </button>
      <span class="wt-select__caret" aria-hidden="true" />
    </div>

    <div v-if="open" class="wt-select__dropdown">
      <ul class="wt-select__list" role="listbox">
        <li v-if="!mergedOptions.length" class="wt-select__empty">暂无选项</li>
        <li
          v-for="option in mergedOptions"
          :key="String(option.value)"
          class="wt-select__option"
          role="option"
          :aria-selected="option.value === modelValue"
          :aria-disabled="option.disabled"
          :class="{
            'is-selected': option.value === modelValue,
            'is-disabled': option.disabled,
            'is-active': option === enabledOptions[activeIndex]
          }"
          @click="select(option)"
        >
          <slot name="option" :option="option">{{ option.label }}</slot>
        </li>
      </ul>
    </div>
  </div>
</template>
<style scoped lang="scss">
@use '@water-ui/theme/src/mixins/index.scss' as wt;

.wt-select {
  /* 高光尺寸（随全局基准等比缩放，11px / 12px） */
  --wt-highlight-size: calc(var(--wt-highlight-size-base) * 0.9167);
  /* 次高光尺寸（随全局基准等比缩放，6px / 12px） */
  --wt-highlight-small-size: calc(var(--wt-highlight-size-base) * 0.5);
  /* 高光内边距（随全局偏移等比缩放，6px / 8px） */
  --wt-highlight-inset: calc(var(--wt-highlight-offset) * 0.75);
  /* 水滴高光：定位方式 + 独立层叠上下文 + 主/次高光伪元素（层叠层级 1） */
  @include wt.wt-liquid-highlights(1);
  /* 层叠层级 */
  z-index: 1;
  /* 宽度 */
  width: 100%;
  /* 最小宽度 */
  min-width: 0;
}

.wt-select.is-open {
  /* 层叠层级 */
  z-index: 40;
}

.wt-select__trigger {
  /* 定位方式 */
  position: relative;
  /* 盒模型显示方式 */
  display: flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 元素间距 */
  gap: 8px;
  /* 宽度 */
  width: 100%;
  /* 最小高度 */
  min-height: 42px;
  /* 内边距 */
  padding: 0 16px;
  /* 边框 */
  border: 0;
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
  /* 文本颜色 */
  color: var(--wt-text);
  /* 字体族 */
  font-family: inherit;
  /* 字号 */
  font-size: 15px;
  /* 文本对齐方式 */
  text-align: left;
  /* 鼠标指针样式 */
  cursor: pointer;
  /* 动画 */
  animation: wt-liquid-flow-subtle var(--wt-motion-slow) ease-in-out infinite;
}

.wt-select__value {
  /* 弹性布局中的伸缩比例 */
  flex: 1;
  /* 最小宽度 */
  min-width: 0;
  /* 溢出裁剪方式 */
  overflow: hidden;
  /* 文本溢出省略方式 */
  text-overflow: ellipsis;
  /* 空白与换行处理 */
  white-space: nowrap;
}

.wt-select__value.is-placeholder {
  /* 文本颜色 */
  color: var(--wt-text-placeholder);
}

.wt-select__clear {
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
  /* 层叠层级 */
  z-index: 2;
}

.wt-select__caret {
  /* 宽度 */
  width: 0;
  /* 高度 */
  height: 0;
  /* 左侧外边距 */
  margin-left: 2px;
  /* 左侧边框 */
  border-left: 5px solid transparent;
  /* 右侧边框 */
  border-right: 5px solid transparent;
  /* 顶部边框 */
  border-top: 6px solid var(--wt-text-secondary);
  /* 过渡动画 */
  transition: transform var(--wt-motion-fast) ease;
}

.wt-select.is-open .wt-select__caret {
  /* 形变 */
  transform: rotate(180deg);
}

.wt-select__dropdown {
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
  max-height: 240px;
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

.wt-select__list {
  /* 外边距 */
  margin: 0;
  /* 内边距 */
  padding: 0;
  /* 列表样式 */
  list-style: none;
}

.wt-select__option,
.wt-select__empty {
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

.wt-select__option:hover,
.wt-select__option.is-selected,
.wt-select__option.is-active {
  /* 背景 */
  background: color-mix(in srgb, var(--wt-primary) 14%, transparent);
  /* 文本颜色 */
  color: var(--wt-primary);
}

/* 隐藏的默认插槽容器：仅用于挂载 WtOption 完成注册 */
.wt-select__shadow {
  /* 盒模型显示方式 */
  display: none;
}

.wt-select__option.is-disabled {
  /* 鼠标指针样式 */
  cursor: not-allowed;
  /* 透明度 */
  opacity: 0.5;
}

.wt-select__empty {
  /* 文本颜色 */
  color: var(--wt-text-placeholder);
  /* 鼠标指针样式 */
  cursor: default;
  /* 文本对齐方式 */
  text-align: center;
}

.wt-select.is-disabled .wt-select__trigger {
  /* 鼠标指针样式 */
  cursor: not-allowed;
  /* 透明度 */
  opacity: 0.6;
}
</style>