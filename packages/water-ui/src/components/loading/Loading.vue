<script setup lang="ts">
import type { LoadingProps } from './props'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtLoading' })

/* 声明组件入参与默认值 */
withDefaults(defineProps<LoadingProps>(), {
  modelValue: false,
  text: '',
  fullscreen: false,
  size: 'medium',
  customClass: ''
})

</script>

<template>
  <Teleport to="body" :disabled="!fullscreen">
    <div
      v-if="modelValue"
      class="wt-loading"
      :class="[
        `wt-loading--${size}`,
        { 'is-fullscreen': fullscreen },
        customClass
      ]"
      role="status"
      aria-live="polite"
    >
      <span class="wt-loading__drop" aria-hidden="true" />
      <span v-if="text" class="wt-loading__text">{{ text }}</span>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.wt-loading {
  /* 盒模型显示方式 */
  display: inline-flex;
  /* 弹性布局主轴方向 */
  flex-direction: column;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 主轴内容分配方式 */
  justify-content: center;
  /* 元素间距 */
  gap: 12px;
  /* 文本颜色 */
  color: var(--wt-text-secondary);
  /* 文本方向 */
  text-align: center;
}

.wt-loading.is-fullscreen {
  /* 定位方式 */
  position: fixed;
  /* 层叠层级 */
  z-index: 3000;
  /* 上下左右偏移合成属性 */
  inset: 0;
  /* 背景 */
  background: color-mix(in srgb, var(--wt-bg) 74%, transparent);
  /* 背景滤镜 */
  backdrop-filter: blur(3px);
}

.wt-loading__drop {
  /* 定位方式 */
  position: relative;
  /* 盒模型显示方式 */
  display: block;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: 52% 48% 70% 30% / 46% 38% 62% 54%;
  /* 背景 */
  background: linear-gradient(
    145deg,
    color-mix(in srgb, var(--wt-primary) 82%, white),
    color-mix(in srgb, var(--wt-primary) 72%, black)
  );
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 2px 3px 6px rgba(0, 0, 0, 0.18),
    inset -2px -2px 5px rgba(255, 255, 255, 0.24),
    0 6px 16px color-mix(in srgb, var(--wt-primary) 30%, transparent);
  /* 动画 */
  animation: wt-loading-drop 1.6s ease-in-out infinite;
  /* 动画性能提示 */
  will-change: transform, border-radius;
}

.wt-loading__drop::after,
.wt-loading__drop::before {
  /* 伪元素内容 */
  content: '';
  /* 定位方式 */
  position: absolute;
  /* 背景 */
  background: var(--wt-highlight);
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-highlight-radius);
  /* 是否响应鼠标事件 */
  pointer-events: none;
  /* 动画 */
  animation: wt-highlight-float var(--wt-motion-normal) ease-in-out infinite;
}

.wt-loading__drop::after {
  /* 顶部偏移 */
  top: 20%;
  /* 左侧偏移 */
  left: 22%;
  /* 宽度 */
  width: 32%;
  /* 高度 */
  height: 32%;
}

.wt-loading__drop::before {
  /* 顶部偏移 */
  top: 48%;
  /* 左侧偏移 */
  left: 34%;
  /* 宽度 */
  width: 16%;
  /* 高度 */
  height: 16%;
  /* 动画 */
  animation-name: wt-highlight-float-small;
}

.wt-loading--small .wt-loading__drop {
  /* 宽度 */
  width: 28px;
  /* 高度 */
  height: 28px;
}

.wt-loading--medium .wt-loading__drop {
  /* 宽度 */
  width: 42px;
  /* 高度 */
  height: 42px;
}

.wt-loading--large .wt-loading__drop {
  /* 宽度 */
  width: 56px;
  /* 高度 */
  height: 56px;
}

.wt-loading__text {
  /* 字号 */
  font-size: 14px;
  /* 行高 */
  line-height: 1.4;
}

@keyframes wt-loading-drop {
  0% {
    /* 形变 */
    transform: scale(0.92) rotate(0deg);
    /* 圆角，塑造水滴/液体轮廓 */
    border-radius: 52% 48% 70% 30% / 46% 38% 62% 54%;
  }

  50% {
    /* 形变 */
    transform: scale(1.08) rotate(8deg);
    /* 圆角，塑造水滴/液体轮廓 */
    border-radius: 64% 36% 58% 42% / 42% 56% 44% 58%;
  }

  100% {
    /* 形变 */
    transform: scale(0.92) rotate(0deg);
    /* 圆角，塑造水滴/液体轮廓 */
    border-radius: 52% 48% 70% 30% / 46% 38% 62% 54%;
  }
}
</style>
