<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { CarouselProps, CarouselEmits } from './props'
import { provideCarousel, type CarouselItemInstance } from './context'
import { useHighlightStyle } from '../../utils/highlight'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtCarousel' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<CarouselProps>(), {
  activeIndex: 0,
  autoplay: true,
  interval: 4000,
  indicator: true,
  arrow: true,
  loop: true,
  customClass: ''
})

/* 声明组件事件 */
const emit = defineEmits<CarouselEmits>()

/* 组件级高光参数（优先级高于全局配置） */
const highlightStyle = useHighlightStyle(props)

/* 响应式状态：当前索引（受控） */
const current = ref(props.activeIndex)
/* 响应式状态：轮播项注册表（按 DOM 顺序维护） */
const items = ref<CarouselItemInstance[]>([])
/* 派生状态：轮播项数量 */
const itemCount = computed(() => items.value.length)
/* 响应式状态：自动播放定时器 */
let timer: ReturnType<typeof setInterval> | null = null

/* 同步外部 activeIndex */
watch(
  () => props.activeIndex,
  (value) => {
    current.value = value
  }
)

/* 派生状态：最大索引 */
const maxIndex = computed(() => Math.max(0, itemCount.value - 1))

/* 交互处理逻辑：切换到指定索引 */
const goTo = (index: number) => {
  let target = index
  if (props.loop) {
    target = (index + itemCount.value) % Math.max(1, itemCount.value)
  } else {
    target = Math.min(maxIndex.value, Math.max(0, index))
  }
  if (target === current.value) return
  current.value = target
  emit('change', target)
  emit('update:activeIndex', target)
}

/* 交互处理逻辑：上一张/下一张 */
const prev = () => goTo(current.value - 1)
const next = () => goTo(current.value + 1)

/* 交互处理逻辑：按 DOM 顺序重排索引并写回每一项（动态增删项后立即生效） */
const syncIndexes = () => {
  items.value.sort((a, b) => {
    if (!a.el || !b.el || a.el === b.el) return 0
    const position = a.el.compareDocumentPosition(b.el)
    if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1
    if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1
    return 0
  })
  items.value.forEach((item, index) => item.setIndex(index))
  /* 项数减少后修正越界的激活项 */
  if (itemCount.value > 0 && current.value > maxIndex.value) goTo(maxIndex.value)
}

/* 自动播放控制 */
const startTimer = () => {
  stopTimer()
  if (!props.autoplay) return
  timer = setInterval(() => {
    if (props.loop) {
      next()
    } else if (current.value < maxIndex.value) {
      next()
    }
  }, props.interval)
}

const stopTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

/* 提供上下文 */
provideCarousel({
  get activeIndex() {
    return current.value
  },
  register: (item) => {
    if (!items.value.includes(item)) items.value.push(item)
    syncIndexes()
  },
  unregister: (item) => {
    const index = items.value.indexOf(item)
    if (index !== -1) items.value.splice(index, 1)
    syncIndexes()
  }
})

/* 运行时变更自动播放配置：重启定时器 */
watch(
  () => [props.autoplay, props.interval],
  () => {
    startTimer()
  }
)

/* 交互处理逻辑：页面隐藏时暂停自动播放，恢复可见时重启 */
const handleVisibilityChange = () => {
  if (document.hidden) {
    stopTimer()
  } else {
    startTimer()
  }
}

onMounted(() => {
  startTimer()
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onBeforeUnmount(() => {
  stopTimer()
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<template>
  <div
    class="wt-carousel"
    :class="props.customClass"
    :style="highlightStyle"
    @mouseenter="stopTimer"
    @mouseleave="startTimer"
  >
    <div class="wt-carousel__track">
      <slot />
    </div>
    <button
      v-if="arrow && itemCount > 1"
      type="button"
      class="wt-carousel__arrow wt-carousel__arrow--prev"
      :disabled="!loop && current <= 0"
      aria-label="上一张"
      @click="prev"
    >
      ‹
    </button>
    <button
      v-if="arrow && itemCount > 1"
      type="button"
      class="wt-carousel__arrow wt-carousel__arrow--next"
      :disabled="!loop && current >= maxIndex"
      aria-label="下一张"
      @click="next"
    >
      ›
    </button>
    <div v-if="indicator && itemCount > 1" class="wt-carousel__indicators">
      <button
        v-for="i in itemCount"
        :key="i"
        type="button"
        class="wt-carousel__dot"
        :class="{ 'is-active': i - 1 === current }"
        :aria-label="`第 ${i} 张`"
        @click="goTo(i - 1)"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@water-ui/theme/src/mixins/index.scss' as wt;

.wt-carousel {
  /* 位置 */
  position: relative;
  /* 宽度 */
  width: 100%;
  /* 高度 */
  height: 220px;
  /* 背景 */
  background: color-mix(in srgb, var(--wt-surface) 76%, transparent);
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-md);
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 3px 4px 10px rgba(0, 0, 0, 0.05),
    inset -2px -2px 6px var(--wt-shadow-light),
    0 10px 26px rgba(0, 0, 0, 0.05);
  /* 溢出隐藏 */
  overflow: hidden;
  /* 液体形变动画（含 will-change: border-radius） */
  @include wt.wt-liquid-animation(wt-liquid-flow-subtle, var(--wt-motion-slow), border-radius);
}

.wt-carousel__track {
  /* 宽度 */
  width: 100%;
  /* 高度 */
  height: 100%;
}

.wt-carousel__arrow {
  /* 位置 */
  position: absolute;
  /* 顶部偏移 */
  top: 50%;
  /* 形变 */
  transform: translateY(-50%);
  /* 宽度 */
  width: 32px;
  /* 高度 */
  height: 32px;
  /* 盒模型显示方式 */
  display: flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 主轴对齐方式 */
  justify-content: center;
  /* 边框 */
  border: none;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-xs);
  /* 背景 */
  background: color-mix(in srgb, var(--wt-surface) 72%, transparent);
  /* 文本颜色 */
  color: var(--wt-text-secondary);
  /* 字号 */
  font-size: 20px;
  /* 鼠标指针样式 */
  cursor: pointer;
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 2px 3px 6px rgba(0, 0, 0, 0.06),
    inset -1px -1px 4px var(--wt-shadow-light),
    0 4px 12px rgba(0, 0, 0, 0.08);
  /* 过渡 */
  transition: color var(--wt-motion-fast) ease;
}

.wt-carousel__arrow:hover:not(:disabled) {
  /* 文本颜色 */
  color: var(--wt-primary);
}

.wt-carousel__arrow:disabled {
  /* 鼠标指针样式 */
  cursor: not-allowed;
  /* 透明度 */
  opacity: 0.4;
}

.wt-carousel__arrow--prev {
  /* 左侧偏移 */
  left: 14px;
}

.wt-carousel__arrow--next {
  /* 右侧偏移 */
  right: 14px;
}

.wt-carousel__indicators {
  /* 位置 */
  position: absolute;
  /* 底部偏移 */
  bottom: 14px;
  /* 左侧偏移 */
  left: 50%;
  /* 形变 */
  transform: translateX(-50%);
  /* 盒模型显示方式 */
  display: flex;
  /* 间隙 */
  gap: 6px;
}

.wt-carousel__dot {
  /* 宽度 */
  width: 8px;
  /* 高度 */
  height: 8px;
  /* 圆角 */
  border-radius: 50%;
  /* 边框 */
  border: none;
  /* 背景 */
  background: color-mix(in srgb, var(--wt-text-secondary) 30%, transparent);
  /* 鼠标指针样式 */
  cursor: pointer;
  /* 过渡 */
  transition:
    width var(--wt-motion-fast) ease,
    background var(--wt-motion-fast) ease;
}

.wt-carousel__dot.is-active {
  /* 宽度 */
  width: 20px;
  /* 圆角 */
  border-radius: 4px;
  /* 背景 */
  background: var(--wt-primary);
}
</style>
