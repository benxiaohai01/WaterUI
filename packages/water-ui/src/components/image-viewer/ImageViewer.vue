<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { ImageViewerProps } from './props'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtImageViewer' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<ImageViewerProps>(), {
  modelValue: false,
  imageList: () => [],
  current: 0,
  closable: true,
  zoomRate: 0.5,
  maxZoom: 3,
  minZoom: 0.2,
  customClass: ''
})

/* 声明组件事件 */
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'update:current': [index: number]
  change: [index: number]
  close: []
}>()

/* 响应式状态：缩放与旋转 */
const scale = ref(1)
const rotate = ref(0)
const index = ref(0)

/* 派生状态：当前图片 */
const currentImage = computed(() => props.imageList[index.value])

/* 派生状态：图片变换样式 */
const imageStyle = computed(() => ({
  transform: `scale(${scale.value}) rotate(${rotate.value}deg)`,
  transition: 'transform 0.25s ease'
}))

/* 派生状态：是否可切换上/下一张 */
const canPrev = computed(() => index.value > 0)
const canNext = computed(() => index.value < props.imageList.length - 1)

/* 重置视图 */
const reset = () => {
  scale.value = 1
  rotate.value = 0
}

/* 关闭预览 */
const close = () => {
  emit('update:modelValue', false)
  emit('close')
  reset()
}

/* 切换图片 */
const goTo = (nextIndex: number) => {
  if (nextIndex < 0 || nextIndex >= props.imageList.length) return
  index.value = nextIndex
  emit('update:current', nextIndex)
  emit('change', nextIndex)
  reset()
}

/* 缩放 */
const zoomIn = () => {
  scale.value = Math.min(props.maxZoom, scale.value + props.zoomRate)
}
const zoomOut = () => {
  scale.value = Math.max(props.minZoom, scale.value - props.zoomRate)
}

/* 旋转 */
const rotateRight = () => {
  rotate.value = (rotate.value + 90) % 360
}
const rotateLeft = () => {
  rotate.value = (rotate.value - 90 + 360) % 360
}

/* 键盘操作 */
const handleKeydown = (event: KeyboardEvent) => {
  if (!props.modelValue) return
  switch (event.key) {
    case 'Escape':
      close()
      break
    case 'ArrowLeft':
      goTo(index.value - 1)
      break
    case 'ArrowRight':
      goTo(index.value + 1)
      break
    case '+':
    case '=':
      zoomIn()
      break
    case '-':
      zoomOut()
      break
  }
}

watch(
  () => props.modelValue,
  (value) => {
    if (value) {
      index.value = Math.min(Math.max(props.current, 0), Math.max(props.imageList.length - 1, 0))
      reset()
    }
  }
)

watch(
  () => props.current,
  (value) => {
    if (value !== index.value) index.value = value
  }
)

onMounted(() => document.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition name="wt-image-viewer">
      <div v-if="modelValue" class="wt-image-viewer" :class="props.customClass">
        <!-- 遮罩 -->
        <div class="wt-image-viewer__mask" @click="close" />
        <!-- 图片区域 -->
        <div class="wt-image-viewer__stage">
          <img v-if="currentImage" :src="currentImage" :style="imageStyle" alt="预览图片" />
          <div v-else class="wt-image-viewer__empty">暂无图片</div>
        </div>

        <!-- 关闭按钮 -->
        <button
          v-if="closable"
          class="wt-image-viewer__close"
          type="button"
          aria-label="关闭预览"
          @click="close"
        >
          <wt-icon name="close" :size="20" />
        </button>

        <!-- 左右切换 -->
        <button
          v-if="canPrev"
          class="wt-image-viewer__arrow wt-image-viewer__arrow--prev"
          type="button"
          aria-label="上一张"
          @click="goTo(index - 1)"
        >
          <wt-icon name="arrow-left" :size="22" />
        </button>
        <button
          v-if="canNext"
          class="wt-image-viewer__arrow wt-image-viewer__arrow--next"
          type="button"
          aria-label="下一张"
          @click="goTo(index + 1)"
        >
          <wt-icon name="arrow-right" :size="22" />
        </button>

        <!-- 底部工具栏 -->
        <div class="wt-image-viewer__toolbar">
          <button type="button" title="缩小" aria-label="缩小" @click="zoomOut">
            <wt-icon name="minus" :size="16" />
          </button>
          <span class="wt-image-viewer__zoom">{{ Math.round(scale * 100) }}%</span>
          <button type="button" title="放大" aria-label="放大" @click="zoomIn">
            <wt-icon name="plus" :size="16" />
          </button>
          <button type="button" title="左旋转" aria-label="左旋转" @click="rotateLeft">
            <wt-icon name="refresh-left" :size="16" />
          </button>
          <button type="button" title="右旋转" aria-label="右旋转" @click="rotateRight">
            <wt-icon name="refresh-right" :size="16" />
          </button>
          <button v-if="props.imageList.length > 1" type="button" title="重置" aria-label="重置" @click="reset">
            <wt-icon name="fullscreen" :size="16" />
          </button>
        </div>

        <!-- 页码指示器 -->
        <div v-if="props.imageList.length > 1" class="wt-image-viewer__indicator">
          {{ index + 1 }} / {{ props.imageList.length }}
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.wt-image-viewer {
  /* 定位方式 */
  position: fixed;
  /* 层叠层级 */
  z-index: 9999;
  /* 上下左右偏移合成属性 */
  inset: 0;
  /* 盒模型显示方式 */
  display: flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 主轴内容分配方式 */
  justify-content: center;
}

.wt-image-viewer__mask {
  /* 定位方式 */
  position: absolute;
  /* 上下左右偏移合成属性 */
  inset: 0;
  /* 背景 */
  background: rgba(0, 0, 0, 0.78);
  /* 背景滤镜 */
  backdrop-filter: blur(3px);
}

.wt-image-viewer__stage {
  /* 定位方式 */
  position: relative;
  /* 最大宽度 */
  max-width: 88vw;
  /* 最大高度 */
  max-height: 86vh;
  /* 盒模型显示方式 */
  display: flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 主轴内容分配方式 */
  justify-content: center;
}

.wt-image-viewer__stage img {
  /* 最大宽度 */
  max-width: 86vw;
  /* 最大高度 */
  max-height: 82vh;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-md);
  /* 水滴内外部阴影层次 */
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  /* 用户选择 */
  user-select: none;
}

.wt-image-viewer__empty {
  /* 文本颜色 */
  color: rgba(255, 255, 255, 0.6);
  /* 字号 */
  font-size: 16px;
}

.wt-image-viewer__close {
  /* 定位方式 */
  position: absolute;
  /* 顶部偏移 */
  top: 24px;
  /* 右侧偏移 */
  right: 24px;
  /* 宽度 */
  width: 42px;
  /* 高度 */
  height: 42px;
  /* 圆角 */
  border-radius: 50%;
  /* 边框 */
  border: 0;
  /* 背景 */
  background: rgba(255, 255, 255, 0.12);
  /* 文本颜色 */
  color: #fff;
  /* 鼠标指针样式 */
  cursor: pointer;
  /* 盒模型显示方式 */
  display: flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 主轴内容分配方式 */
  justify-content: center;
  /* 过渡 */
  transition: background 0.2s ease, transform 0.2s ease;
}

.wt-image-viewer__close:hover {
  /* 背景 */
  background: rgba(255, 255, 255, 0.24);
  /* 形变 */
  transform: rotate(90deg);
}

.wt-image-viewer__arrow {
  /* 定位方式 */
  position: absolute;
  /* 顶部偏移 */
  top: 50%;
  /* 形变 */
  transform: translateY(-50%);
  /* 宽度 */
  width: 46px;
  /* 高度 */
  height: 46px;
  /* 圆角 */
  border-radius: 50%;
  /* 边框 */
  border: 0;
  /* 背景 */
  background: rgba(255, 255, 255, 0.12);
  /* 文本颜色 */
  color: #fff;
  /* 鼠标指针样式 */
  cursor: pointer;
  /* 盒模型显示方式 */
  display: flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 主轴内容分配方式 */
  justify-content: center;
  /* 过渡 */
  transition: background 0.2s ease;
}

.wt-image-viewer__arrow:hover {
  /* 背景 */
  background: rgba(255, 255, 255, 0.24);
}

.wt-image-viewer__arrow--prev {
  /* 左侧偏移 */
  left: 24px;
}

.wt-image-viewer__arrow--next {
  /* 右侧偏移 */
  right: 24px;
}

.wt-image-viewer__toolbar {
  /* 定位方式 */
  position: absolute;
  /* 底部偏移 */
  bottom: 28px;
  /* 左侧偏移 */
  left: 50%;
  /* 形变 */
  transform: translateX(-50%);
  /* 盒模型显示方式 */
  display: flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 元素间距 */
  gap: 6px;
  /* 内边距 */
  padding: 8px 14px;
  /* 圆角 */
  border-radius: 999px;
  /* 背景 */
  background: rgba(255, 255, 255, 0.14);
  /* 背景滤镜 */
  backdrop-filter: blur(8px);
}

.wt-image-viewer__toolbar button {
  /* 宽度 */
  width: 34px;
  /* 高度 */
  height: 34px;
  /* 圆角 */
  border-radius: 50%;
  /* 边框 */
  border: 0;
  /* 背景 */
  background: transparent;
  /* 文本颜色 */
  color: #fff;
  /* 鼠标指针样式 */
  cursor: pointer;
  /* 盒模型显示方式 */
  display: flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 主轴内容分配方式 */
  justify-content: center;
  /* 过渡 */
  transition: background 0.2s ease;
}

.wt-image-viewer__toolbar button:hover {
  /* 背景 */
  background: rgba(255, 255, 255, 0.2);
}

.wt-image-viewer__zoom {
  /* 文本颜色 */
  color: #fff;
  /* 字号 */
  font-size: 13px;
  /* 最小宽度 */
  min-width: 52px;
  /* 文本对齐方式 */
  text-align: center;
}

.wt-image-viewer__indicator {
  /* 定位方式 */
  position: absolute;
  /* 顶部偏移 */
  top: 28px;
  /* 左侧偏移 */
  left: 50%;
  /* 形变 */
  transform: translateX(-50%);
  /* 文本颜色 */
  color: rgba(255, 255, 255, 0.85);
  /* 字号 */
  font-size: 14px;
}

.wt-image-viewer-enter-active,
.wt-image-viewer-leave-active {
  /* 过渡动画 */
  transition: opacity 0.25s ease;
}

.wt-image-viewer-enter-from,
.wt-image-viewer-leave-to {
  /* 透明度 */
  opacity: 0;
}
</style>
