<script setup lang="ts">
import { computed, ref } from 'vue'
import type { UploadFile, UploadProps } from './props'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtUpload' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<UploadProps>(), {
  modelValue: () => [],
  accept: '',
  multiple: false,
  disabled: false,
  customClass: ''
})

/* 声明组件事件 */
const emit = defineEmits<{
  'update:modelValue': [files: UploadFile[]]
  change: [files: UploadFile[]]
  remove: [file: UploadFile, index: number]
}>()

const inputRef = ref<HTMLInputElement>()

/* 派生状态（计算属性） */
const classes = computed(() => [
  'wt-upload',
  {
    'is-disabled': props.disabled
  },
  props.customClass
])

/* 交互处理逻辑 */
const handleFiles = (event: Event) => {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files || []).map<UploadFile>((file) => ({
    name: file.name,
    size: file.size,
    status: 'ready'
  }))
  const next = props.multiple ? [...props.modelValue, ...files] : files
  emit('update:modelValue', next)
  emit('change', next)
  input.value = ''
}

/* 交互处理逻辑 */
const removeFile = (file: UploadFile, index: number) => {
  const next = props.modelValue.filter((_, itemIndex) => itemIndex !== index)
  emit('update:modelValue', next)
  emit('remove', file, index)
}

/* 交互处理逻辑 */
const formatSize = (size?: number) => {
  if (!size) return ''
  return size > 1024 * 1024 ? `${(size / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(size / 1024))} KB`
}
</script>

<template>
  <div :class="classes">
    <label class="wt-upload__trigger">
      <input
        ref="inputRef"
        class="wt-upload__input"
        type="file"
        :accept="accept"
        :multiple="multiple"
        :disabled="disabled"
        @change="handleFiles"
      >
      <span>选择文件</span>
    </label>

    <ul v-if="modelValue.length" class="wt-upload__list">
      <li v-for="(file, index) in modelValue" :key="`${file.name}-${index}`" class="wt-upload__item">
        <span class="wt-upload__name">{{ file.name }}</span>
        <span v-if="file.size" class="wt-upload__size">{{ formatSize(file.size) }}</span>
        <button type="button" aria-label="移除文件" @click="removeFile(file, index)">×</button>
      </li>
    </ul>
  </div>
</template>
<style scoped lang="scss">
.wt-upload {
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
  /* 宽度 */
  width: 100%;
  /* 最小宽度 */
  min-width: 0;
}

.wt-upload__trigger {
  /* 定位方式 */
  position: relative;
  /* 创建独立层叠上下文，隔离内部元素 */
  isolation: isolate;
  /* 溢出裁剪方式 */
  overflow: hidden;
  /* 盒模型显示方式 */
  display: inline-flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 主轴内容分配方式 */
  justify-content: center;
  /* 最小高度 */
  min-height: 42px;
  /* 内边距 */
  padding: 0 20px;
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
  /* 字号 */
  font-size: 14px;
  /* 鼠标指针样式 */
  cursor: pointer;
  /* 动画 */
  animation: wt-liquid-flow-subtle var(--wt-motion-slow) ease-in-out infinite;
}

.wt-upload__trigger::after,
.wt-upload__trigger::before {
  /* 伪元素内容 */
  content: '';
  /* 定位方式 */
  position: absolute;
  /* 是否响应鼠标事件 */
  pointer-events: none;
  /* 层叠层级 */
  z-index: 2;
}

.wt-upload__trigger::after {
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

.wt-upload__trigger::before {
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

.wt-upload__input {
  /* 定位方式 */
  position: absolute;
  /* 透明度 */
  opacity: 0;
  /* 是否响应鼠标事件 */
  pointer-events: none;
}

.wt-upload__list {
  /* 外边距 */
  margin: 12px 0 0;
  /* 内边距 */
  padding: 0;
  /* 列表样式 */
  list-style: none;
  /* 盒模型显示方式 */
  display: grid;
  /* 元素间距 */
  gap: 8px;
}

.wt-upload__item {
  /* 盒模型显示方式 */
  display: flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 元素间距 */
  gap: 10px;
  /* 内边距 */
  padding: 9px 12px;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-sm);
  /* 背景 */
  background: color-mix(in srgb, var(--wt-surface-strong) 60%, transparent);
  /* 文本颜色 */
  color: var(--wt-text);
  /* 字号 */
  font-size: 14px;
}

.wt-upload__name {
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

.wt-upload__size {
  /* 文本颜色 */
  color: var(--wt-text-placeholder);
  /* 字号 */
  font-size: 12px;
}

.wt-upload__item button {
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

.wt-upload.is-disabled {
  /* 鼠标指针样式 */
  cursor: not-allowed;
  /* 透明度 */
  opacity: 0.6;
}
</style>