<script lang="ts">
/* 模块级引用计数：多个引导实例共享 body 滚动锁，避免互相提前解锁 */
let bodyLockCount = 0
/* 首次加锁时保存的 body 溢出原值 */
let originalBodyOverflow = ''
</script>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { TourProps, TourStep } from './props'

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
  finish: []
  close: []
}>()

/* 响应式状态：目标元素位置 */
const targetRect = ref<DOMRect | null>(null)
const stepIndex = ref(0)

/* 当前实例是否持有 body 滚动锁（保证加锁/解锁成对） */
let bodyLocked = false

/* 派生状态：当前步骤 */
const currentStep = computed(() => props.steps[stepIndex.value])

/* 派生状态：是否为最后一步 */
const isLast = computed(() => stepIndex.value >= props.steps.length - 1)

/* 派生状态：气泡居中样式（无目标元素或放置方式为 center 时使用） */
const centerStyle = {
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)'
}

/* 视口安全边距与气泡间距 */
const viewportMargin = 12
const popupGap = 12

/* 响应式状态：气泡元素引用与实际尺寸（受 CSS 最大宽高约束，超长内容在气泡内部滚动） */
const popupEl = ref<HTMLElement>()
const popupSize = ref({ width: 0, height: 0 })

/* 测量气泡渲染尺寸：目标与步骤内容变化后都需要重新测量，用于视口夹取 */
const measurePopup = () => {
  const el = popupEl.value
  if (!el) return
  const width = el.offsetWidth
  const height = el.offsetHeight
  if (width === popupSize.value.width && height === popupSize.value.height) return
  popupSize.value = { width, height }
}

/* 数值夹取 */
const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), Math.max(min, max))

/* 派生状态：气泡定位样式（先按 placement 定位，再翻转/夹取到视口内） */
const popupStyle = computed(() => {
  const rect = targetRect.value
  const placement = currentStep.value?.placement ?? 'bottom'
  if (!rect || placement === 'center') return centerStyle

  const { width, height } = popupSize.value
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  /* 主方向放不下时翻转：上下互转、左右互转 */
  let direction: NonNullable<TourStep['placement']> = placement
  if (placement === 'top' && rect.top - popupGap - height < viewportMargin) {
    direction = 'bottom'
  } else if (placement === 'bottom' && rect.bottom + popupGap + height > viewportHeight - viewportMargin) {
    direction = 'top'
  } else if (placement === 'left' && rect.left - popupGap - width < viewportMargin) {
    direction = 'right'
  } else if (placement === 'right' && rect.right + popupGap + width > viewportWidth - viewportMargin) {
    direction = 'left'
  }

  let left = rect.left
  let top = rect.top
  switch (direction) {
    case 'top':
      top = rect.top - popupGap - height
      break
    case 'right':
      left = rect.right + popupGap
      break
    case 'left':
      left = rect.left - popupGap - width
      break
    default:
      top = rect.bottom + popupGap
  }

  /* 目标贴边时继续夹取，保证气泡完整可见 */
  return {
    left: `${clamp(left, viewportMargin, viewportWidth - viewportMargin - width)}px`,
    top: `${clamp(top, viewportMargin, viewportHeight - viewportMargin - height)}px`
  }
})

/* 派生状态：目标元素高亮框样式（相对视口定位，并夹取在视口内） */
const highlightStyle = computed(() => {
  const rect = targetRect.value
  if (!rect) return {}
  const inset = 4
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const width = Math.min(rect.width + inset * 2, viewportWidth)
  const height = Math.min(rect.height + inset * 2, viewportHeight)
  return {
    left: `${clamp(rect.left - inset, 0, viewportWidth - width)}px`,
    top: `${clamp(rect.top - inset, 0, viewportHeight - height)}px`,
    width: `${width}px`,
    height: `${height}px`
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

/* 重新定位并测量气泡：步骤内容或目标变化都会影响气泡尺寸与位置 */
const refreshPosition = () => {
  locateTarget()
  measurePopup()
}

/* 交互处理逻辑：锁定 body 滚动（引用计数，首次锁定时记录原值） */
const lockBodyScroll = () => {
  if (bodyLocked) return
  bodyLocked = true
  if (bodyLockCount === 0) originalBodyOverflow = document.body.style.overflow
  bodyLockCount += 1
  document.body.style.overflow = 'hidden'
}

/* 交互处理逻辑：解除 body 滚动锁（计数归零时还原原值） */
const unlockBodyScroll = () => {
  if (!bodyLocked) return
  bodyLocked = false
  bodyLockCount = Math.max(0, bodyLockCount - 1)
  if (bodyLockCount === 0) document.body.style.overflow = originalBodyOverflow
}

/* 打开引导 */
const open = () => {
  stepIndex.value = Math.min(Math.max(props.current, 0), Math.max(props.steps.length - 1, 0))
  emit('update:current', stepIndex.value)
  nextTick(refreshPosition)
  lockBodyScroll()
}

/* 关闭引导 */
const close = () => {
  emit('update:modelValue', false)
  emit('close')
  unlockBodyScroll()
}

/* 切换到指定步骤 */
const goTo = (index: number) => {
  const next = Math.min(Math.max(index, 0), props.steps.length - 1)
  stepIndex.value = next
  emit('update:current', next)
  emit('change', next)
  nextTick(refreshPosition)
}

/* 下一步 */
const next = () => {
  if (isLast.value) {
    /* 最后一步：先抛出完成事件，再关闭引导 */
    emit('finish')
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
  if (props.modelValue) refreshPosition()
}

watch(
  () => props.modelValue,
  (value) => {
    if (value) open()
    else unlockBodyScroll()
  }
)

watch(
  () => props.current,
  (value) => {
    if (value !== stepIndex.value) {
      stepIndex.value = value
      nextTick(refreshPosition)
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
  /* 卸载时解除滚动锁，避免残留锁定 */
  unlockBodyScroll()
})
</script>

<template>
  <Teleport to="body">
    <Transition name="wt-tour">
      <div v-if="modelValue" class="wt-tour" :class="props.customClass">
        <!-- 遮罩：默认放行指针事件，使高亮目标可点击；无高亮时保留拦截以便点击关闭 -->
        <div
          v-if="mask"
          class="wt-tour__mask"
          :style="{ background: maskColor, pointerEvents: targetRect ? 'none' : 'auto' }"
          @click="close"
        />
        <!-- 目标高亮框 -->
        <div
          v-if="mask && targetRect"
          class="wt-tour__highlight"
          :style="highlightStyle"
        />
        <!-- 步骤气泡 -->
        <div ref="popupEl" class="wt-tour__popup" :style="popupStyle">
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
  /* 层叠层级 */
  z-index: 0;
  /* 背景 */
  background: rgba(0, 0, 0, 0.5);
  /* 是否响应鼠标事件：放行指针，避免拦截高亮目标的点击 */
  pointer-events: none;
}

.wt-tour__highlight {
  /* 定位方式 */
  position: absolute;
  /* 层叠层级：置于遮罩之上，保证高亮区域可见 */
  z-index: 1;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-md);
  /* 边框 */
  border: 2px solid var(--wt-primary);
  /* 水滴内外部阴影层次 */
  box-shadow:
    0 0 0 9999px v-bind('maskColor'),
    0 8px 30px rgba(0, 0, 0, 0.4);
  /* 过渡 */
  transition: all var(--wt-motion-base) ease;
  /* 是否响应鼠标事件 */
  pointer-events: none;
}

.wt-tour__popup {
  /* 定位方式 */
  position: absolute;
  /* 层叠层级：气泡始终位于遮罩与高亮框之上 */
  z-index: 2;
  /* 最大宽度：预留视口安全边距，避免气泡被屏幕裁切 */
  max-width: min(360px, calc(100vw - 24px));
  /* 最大高度：超出视口时改为气泡内部滚动 */
  max-height: calc(100vh - 24px);
  /* 溢出处理方式：长内容在气泡内部滚动 */
  overflow: auto;
  /* 滚动边界行为：滚到边界不带动外层容器 */
  overscroll-behavior: contain;
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
  transition: all var(--wt-motion-base) ease;
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
  transition: opacity var(--wt-motion-base) ease;
}

.wt-tour-enter-from,
.wt-tour-leave-to {
  /* 透明度 */
  opacity: 0;
}
</style>
