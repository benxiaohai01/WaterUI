<script setup lang="ts">
import { computed, onBeforeUnmount, reactive } from 'vue'
import type { StepsProps } from './props'
import { provideSteps } from './context'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtSteps' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<StepsProps>(), {
  active: 0,
  direction: 'horizontal',
  processStatus: 'process',
  finishStatus: 'finish',
  length: 0,
  readonly: false,
  customClass: ''
})

/* 声明组件事件 */
const emit = defineEmits<{
  select: [index: number]
  'update:active': [index: number]
}>()

/* 响应式状态：已注册的步骤实例 */
const steps = reactive<unknown[]>([])

/* 派生状态：有效步骤数量 */
const stepLength = computed(() => (props.length > 0 ? props.length : steps.length))

/* 提供上下文给子步骤 */
provideSteps({
  get active() {
    return props.active
  },
  get direction() {
    return props.direction
  },
  get processStatus() {
    return props.processStatus
  },
  get finishStatus() {
    return props.finishStatus
  },
  get length() {
    return stepLength.value
  },
  get readonly() {
    return props.readonly
  },
  register: (step) => {
    if (!steps.includes(step)) steps.push(step)
  },
  unregister: (step) => {
    const index = steps.indexOf(step)
    if (index !== -1) steps.splice(index, 1)
  },
  indexOf: (step) => steps.indexOf(step),
  onSelect: (index) => {
    emit('select', index)
    emit('update:active', index)
  }
})

/* 派生状态：容器类名 */
const classes = computed(() => [
  'wt-steps',
  `wt-steps--${props.direction}`,
  props.customClass
])

onBeforeUnmount(() => {
  steps.splice(0)
})
</script>

<template>
  <ol :class="classes">
    <slot />
  </ol>
</template>

<style scoped lang="scss">
.wt-steps {
  /* 外边距 */
  margin: 0;
  /* 内边距 */
  padding: 0;
  /* 盒模型显示方式 */
  display: flex;
  /* 列表样式 */
  list-style: none;
}

.wt-steps--horizontal {
  /* 排列方向 */
  flex-direction: row;
  /* 交叉轴对齐方式 */
  align-items: flex-start;
  /* 元素间距 */
  gap: 0;
}

.wt-steps--vertical {
  /* 排列方向 */
  flex-direction: column;
  /* 元素间距 */
  gap: 8px;
}
</style>
