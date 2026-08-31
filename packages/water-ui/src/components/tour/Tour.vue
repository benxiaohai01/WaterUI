<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { TourProps } from './props'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtTour' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<TourProps>(), {
  modelValue: false,
  steps: () => [],
  current: 0,
  mask: true,
  maskColor: 'rgba(0, 0, 0, 0.5)',
  prevText: '上一步',
  nextText: '下一步',
  doneText: '完成',
  customClass: ''
})

/* 声明组件事件 */
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'update:current': [index: number]
  change: [index: number]
  close: []
}>()

/* 响应式状态：目标元素位置 */
const targetRect = ref<DOMRect | null>(null)
const stepIndex = ref(0)

/* 派生状态：当前步骤 */
const currentStep = computed(() => props.steps[stepIndex.value])

/* 派生状态：是否为最后一步 */
const isLast = computed(() => stepIndex.value >= props.steps.length - 1)

/* 派生状态：气泡定位样式 */
const popupStyle = computed(() => {
  const rect = targetRect.value
  if (!rect) return {}
  const placement = currentStep.value?.placement ?? 'bottom'
  const gap = 12
  switch (placement) {
    case 'top':
      return { left: `${rect.left}px`, top: `${rect.top - gap}px`, transform: 'translateY(-100%)' }
    case 'right':
      return { left: `${rect.right + gap}px`, top: `${rect.top}px` }
    case 'bottom':
      return { left: `${rect.left}px`, top: `${rect.bottom + gap}px` }
    case 'left':
      return { left: `${rect.left - gap}px`, top: `${rect.top}px`, transform: 'translateX(-100%)' }
    default:
      return { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }
  }
})

/* 派生状态：目标元素高亮框样式 */
const highlightStyle = computed(() => {
  const rect = targetRect.value
  if (!rect) return {}
  return {
    left: `${rect.left - 4}px`,
    top: `${rect.top - 4}px`,
    width: `${rect.width + 8}px`,
    height: `${rect.height + 8}px`
  }
})

/* 定位当前目标元素 */
const locateTarget = () => {
  const step = currentStep.value
  if (!step?.target) {
    targetRect.value = null
    return
  }
  const el = document.querySelector<HTMLElement>(step.target)
  if (!el) {
    targetRect.value = null
    return
  }
  targetRect.value = el.getBoundingClientRect()
}

/* 打开引导 */
const open = () => {
  stepIndex.value = Math.min(Math.max(props.current, 0), Math.max(props.steps.length - 1, 0))
  emit('update:current', stepIndex.value)
  nextTick(locateTarget)
  document.body.style.overflow = 'hidden'
}

/* 关闭引导 */
const close = () => {
  emit('update:modelValue', false)
  emit('close')
  document.body.style.overflow = ''
}

/* 切换到指定步骤 */
const goTo = (index: number) => {
  const next = Math.min(Math.max(index, 0), props.steps.length - 1)
  stepIndex.value = next
  emit('update:current', next)
  emit('change', next)
  nextTick(locateTarget)
}

/* 下一步 */
const next = () => {
  if (isLast.value) {
    close()
    return
  }
  goTo(stepIndex.value + 1)
}

/* 上一步 */
const prev = () => {
  goTo(stepIndex.value - 1)
}

/* 键盘：ESC 关闭，左右方向键切换 */
const handleKeydown = (event: KeyboardEvent) => {
  if (!props.modelValue) return
  if (event.key === 'Escape') {
    close()
  } else if (event.key === 'ArrowRight') {
    next()
  } else if (event.key === 'ArrowLeft') {
    prev()
  }
}

/* 窗口尺寸变化时重新定位 */
const handleResize = () => {
  if (props.modelValue) locateTarget()
}

watch(
  () => props.modelValue,
  (value) => {
    if (value) open()
    else {
      document.body.style.overflow = ''
    }
  }
)

watch(
  () => props.current,
  (value) => {
    if (value !== stepIndex.value) {
      stepIndex.value = value
      nextTick(locateTarget)
    }
  }
)

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  window.addEventListener('resize', handleResize)
  if (props.modelValue) open()
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('resize', handleResize)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="wt-tour">
      <div v-if="modelValue" class="wt-tour" :class="props.customClass">
        <!-- 遮罩 -->
        <div
          v-if="mask"
          class="wt-tour__mask"
          :style="{ background: maskColor }"
          @click="close"
        />
        <!-- 目标高亮框 -->
        <div
          v-if="mask && targetRect"
          class="wt-tour__highlight"
          :style="highlightStyle"
        />
        <!-- 步骤气泡 -->
        <div class="wt-tour__popup" :style="popupStyle">
          <span v-if="props.steps.length > 1" class="wt-tour__step-count">
            {{ stepIndex + 1 }} / {{ props.steps.length }}
          </span>
          <h4 v-if="currentStep?.title" class="wt-tour__title">
            {{ currentStep.title }}
          </h4>
          <p v-if="currentStep?.description" class="wt-tour__description">
            {{ currentStep.description }}
          </p>
          <slot v-if="currentStep?.slot" :name="currentStep.slot" />
          <div class="wt-tour__footer">
            <wt-button
              v-if="stepIndex > 0"
              size="small"
              plain
              @click="prev"
            >
              {{ prevText }}
            </wt-button>
            <wt-button type="primary" size="small" @click="next">
              {{ isLast ? doneText : nextText }}
            </wt-button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.wt-tour {
  /* 定位方式 */
  position: fixed;
  /* 层叠层级 */
  z-index: 5200;
  /* 上下左右偏移合成属性 */
  inset: 0;
}

.wt-tour__mask {
  /* 定位方式 */
  position: absolute;
  /* 上下左右偏移合成属性 */
  inset: 0;
  /* 背景 */
  background: rgba(0, 0, 0, 0.5);
}

.wt-tour__highlight {
  /* 定位方式 */
  position: absolute;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-md);
  /* 边框 */
  border: 2px solid var(--wt-primary);
  /* 水滴内外部阴影层次 */
  box-shadow:
    0 0 0 9999px v-bind('maskColor'),
    0 8px 30px rgba(0, 0, 0, 0.4);
  /* 过渡 */
  transition: all 0.3s ease;
  /* 是否响应鼠标事件 */
  pointer-events: none;
}

.wt-tour__popup {
  /* 定位方式 */
  position: absolute;
  /* 最大宽度 */
  max-width: 320px;
  /* 内边距 */
  padding: 18px 20px;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-md);
  /* 背景 */
  background: linear-gradient(
    145deg,
    color-mix(in srgb, var(--wt-surface) 96%, white),
    var(--wt-surface)
  );
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 3px 4px 10px rgba(0, 0, 0, 0.06),
    inset -2px -2px 6px var(--wt-shadow-light),
    0 20px 50px rgba(0, 0, 0, 0.2);
  /* 动画 */
  animation: wt-liquid-flow-subtle var(--wt-motion-slow) ease-in-out infinite;
  /* 过渡 */
  transition: all 0.3s ease;
}

.wt-tour__step-count {
  /* 显示方式 */
  display: inline-block;
  /* 字号 */
  font-size: 12px;
  /* 文本颜色 */
  color: var(--wt-text-placeholder);
  /* 底部外边距 */
  margin-bottom: 6px;
}

.wt-tour__title {
  /* 外边距 */
  margin: 0 0 6px;
  /* 文本颜色 */
  color: var(--wt-text);
  /* 字号 */
  font-size: 17px;
}

.wt-tour__description {
  /* 外边距 */
  margin: 0;
  /* 文本颜色 */
  color: var(--wt-text-secondary);
  /* 字号 */
  font-size: 14px;
  /* 行高 */
  line-height: 1.6;
}

.wt-tour__footer {
  /* 盒模型显示方式 */
  display: flex;
  /* 主轴内容分配方式 */
  justify-content: flex-end;
  /* 元素间距 */
  gap: 10px;
  /* 顶部外边距 */
  margin-top: 14px;
}

.wt-tour-enter-active,
.wt-tour-leave-active {
  /* 过渡动画 */
  transition: opacity 0.28s ease;
}

.wt-tour-enter-from,
.wt-tour-leave-to {
  /* 透明度 */
  opacity: 0;
}
</style>
