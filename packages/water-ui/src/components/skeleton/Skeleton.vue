<script setup lang="ts">
import { computed } from 'vue'
import type { SkeletonProps } from './props'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtSkeleton' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<SkeletonProps>(), {
  loading: true,
  avatar: false,
  titleRows: 1,
  paragraphRows: 2,
  animated: true,
  customClass: ''
})

/* 派生状态：骨架块类名 */
const blockClass = computed(() => [
  'wt-skeleton__block',
  { 'is-animated': props.animated }
])

/* 派生数组：标题行 */
const titleArray = computed(() => Array.from({ length: props.titleRows }, (_, i) => i))
/* 派生数组：段落行 */
const paragraphArray = computed(() => Array.from({ length: props.paragraphRows }, (_, i) => i))
</script>

<template>
  <div v-if="loading" :class="['wt-skeleton', props.customClass]" aria-busy="true">
    <div v-if="avatar" class="wt-skeleton__avatar" :class="{ 'is-animated': animated }" />
    <div class="wt-skeleton__content">
      <div
        v-for="i in titleArray"
        :key="`t-${i}`"
        :class="blockClass"
        class="wt-skeleton__title"
        :style="{ width: `${Math.max(20, 100 - i * 12)}%` }"
      />
      <div
        v-for="i in paragraphArray"
        :key="`p-${i}`"
        :class="blockClass"
        class="wt-skeleton__paragraph"
        :style="{ width: `${Math.max(20, 96 - i * 8)}%` }"
      />
    </div>
  </div>
  <slot v-else />
</template>

<style scoped lang="scss">
.wt-skeleton {
  /* 盒模型显示方式 */
  display: flex;
  /* 交叉轴对齐方式 */
  align-items: flex-start;
  /* 间隙 */
  gap: var(--wt-space-md);
}

.wt-skeleton__avatar {
  /* 宽度 */
  width: 40px;
  /* 高度 */
  height: 40px;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-sm);
  /* 背景 */
  background: color-mix(in srgb, var(--wt-text-secondary) 14%, transparent);
}

.wt-skeleton__content {
  /* 弹性 */
  flex: 1;
  /* 盒模型显示方式 */
  display: flex;
  /* 主轴方向 */
  flex-direction: column;
  /* 间隙 */
  gap: var(--wt-space-sm);
}

.wt-skeleton__block {
  /* 高度 */
  height: 14px;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-xs);
  /* 背景 */
  background: color-mix(in srgb, var(--wt-text-secondary) 14%, transparent);
}

.wt-skeleton__title {
  /* 高度 */
  height: 16px;
}

.wt-skeleton__paragraph {
  /* 高度 */
  height: 12px;
}

.wt-skeleton__avatar.is-animated,
.wt-skeleton__block.is-animated {
  /* 背景 */
  background: linear-gradient(
    100deg,
    color-mix(in srgb, var(--wt-text-secondary) 12%, transparent) 30%,
    color-mix(in srgb, var(--wt-text-secondary) 22%, transparent) 50%,
    color-mix(in srgb, var(--wt-text-secondary) 12%, transparent) 70%
  );
  /* 背景尺寸 */
  background-size: 200% 100%;
  /* 动画 */
  animation: wt-skeleton-wave 1.6s ease-in-out infinite;
}

@keyframes wt-skeleton-wave {
  0% {
    /* 背景位置 */
    background-position: 100% 0;
  }

  100% {
    /* 背景位置 */
    background-position: -100% 0;
  }
}
</style>
