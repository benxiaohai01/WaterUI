<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { ImageProps } from './props'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtImage' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<ImageProps>(), {
  alt: '',
  width: '100%',
  height: 'auto',
  fit: 'fill',
  radius: 'medium',
  preview: false,
  customClass: ''
})

/* 响应式状态：加载状态 */
const loaded = ref(false)
const error = ref(false)

/* 响应式状态：预览遮罩 */
const previewVisible = ref(false)

/* 圆角映射 */
const radiusMap: Record<string, string> = {
  none: '0',
  small: 'var(--wt-radius-xs)',
  medium: 'var(--wt-radius-md)',
  large: 'var(--wt-radius-lg)',
  round: '50%'
}

/* 派生状态：容器样式 */
const containerStyle = computed(() => ({
  width: props.width,
  height: props.height,
  borderRadius: radiusMap[props.radius]
}))

/* 派生状态：图片样式 */
const imageStyle = computed(() => ({ objectFit: props.fit }))

/* 键盘预览关闭 */
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') previewVisible.value = false
}

onMounted(() => document.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <div class="wt-image" :class="[props.customClass, { 'is-round': radius === 'round' }]" :style="containerStyle">
    <img
      v-if="!error"
      :src="src"
      :alt="alt"
      :style="imageStyle"
      class="wt-image__inner"
      @load="loaded = true"
      @error="error = true"
      @click="preview && (previewVisible = true)"
    />
    <div v-else class="wt-image__error">
      <span>图片加载失败</span>
    </div>

    <Teleport to="body">
      <Transition name="wt-image-fade">
        <div v-if="previewVisible" class="wt-image__preview" @click="previewVisible = false">
          <img :src="src" :alt="alt" class="wt-image__preview-img" />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped lang="scss">
.wt-image {
  /* 位置 */
  position: relative;
  /* 溢出隐藏 */
  overflow: hidden;
  /* 盒模型显示方式 */
  display: inline-block;
  /* 背景 */
  background: color-mix(in srgb, var(--wt-surface) 70%, transparent);
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 2px 3px 8px rgba(0, 0, 0, 0.05),
    inset -2px -2px 5px var(--wt-shadow-light),
    0 8px 20px rgba(0, 0, 0, 0.05);
  /* 垂直对齐方式 */
  vertical-align: middle;
}

.wt-image__inner {
  /* 宽度 */
  width: 100%;
  /* 高度 */
  height: 100%;
  /* 盒模型显示方式 */
  display: block;
  /* 鼠标指针样式 */
  cursor: default;
  /* 过渡 */
  transition: transform 0.3s ease;
}

.wt-image:not(.is-round) .wt-image__inner {
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: inherit;
}

.wt-image__inner:hover {
  /* 形变 */
  transform: scale(1.02);
}

.wt-image.is-round .wt-image__inner {
  /* 圆角 */
  border-radius: 50%;
}

.wt-image__error {
  /* 盒模型显示方式 */
  display: flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 主轴对齐方式 */
  justify-content: center;
  /* 宽度 */
  width: 100%;
  /* 高度 */
  height: 100%;
  /* 文本颜色 */
  color: var(--wt-text-placeholder);
  /* 字号 */
  font-size: 13px;
}

.wt-image__preview {
  /* 位置 */
  position: fixed;
  /* 顶部偏移 */
  top: 0;
  /* 左侧偏移 */
  left: 0;
  /* 宽度 */
  width: 100vw;
  /* 高度 */
  height: 100vh;
  /* 背景 */
  background: rgba(0, 0, 0, 0.72);
  /* 盒模型显示方式 */
  display: flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 主轴对齐方式 */
  justify-content: center;
  /* 层叠层级 */
  z-index: 9999;
  /* 鼠标指针样式 */
  cursor: zoom-out;
}

.wt-image__preview-img {
  /* 最大宽度 */
  max-width: 88vw;
  /* 最大高度 */
  max-height: 88vh;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-md);
  /* 水滴内外部阴影层次 */
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.wt-image-fade-enter-active,
.wt-image-fade-leave-active {
  /* 过渡 */
  transition: opacity 0.25s ease;
}

.wt-image-fade-enter-from,
.wt-image-fade-leave-to {
  /* 透明度 */
  opacity: 0;
}
</style>
