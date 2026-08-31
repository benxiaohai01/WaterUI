<script setup lang="ts">
import { computed } from 'vue'
import type { PageHeaderProps } from './props'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtPageHeader' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<PageHeaderProps>(), {
  title: '',
  subtitle: '',
  breadcrumbSeparator: '/',
  showBack: true,
  customClass: ''
})

/* 声明组件事件 */
const emit = defineEmits<{
  back: []
}>()

/* 派生状态：容器类名 */
const classes = computed(() => ['wt-page-header', props.customClass])

/* 交互处理逻辑：返回 */
const handleBack = () => {
  emit('back')
}
</script>

<template>
  <header :class="classes">
    <div v-if="$slots.breadcrumb" class="wt-page-header__breadcrumb">
      <slot name="breadcrumb" />
    </div>

    <div class="wt-page-header__main">
      <button
        v-if="showBack"
        type="button"
        class="wt-page-header__back"
        aria-label="返回"
        @click="handleBack"
      >
        <slot name="back-icon">
          <span class="wt-page-header__back-arrow" aria-hidden="true">‹</span>
        </slot>
      </button>

      <div class="wt-page-header__heading">
        <h1 v-if="title" class="wt-page-header__title">{{ title }}</h1>
        <slot name="title">{{ title }}</slot>
        <p v-if="subtitle" class="wt-page-header__subtitle">{{ subtitle }}</p>
      </div>

      <div v-if="$slots.extra" class="wt-page-header__extra">
        <slot name="extra" />
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.wt-page-header {
  /* 盒模型显示方式 */
  display: flex;
  /* 排列方向 */
  flex-direction: column;
  /* 元素间距 */
  gap: 12px;
}

.wt-page-header__breadcrumb {
  /* 盒模型显示方式 */
  display: flex;
  /* 交叉轴对齐方式 */
  align-items: center;
}

.wt-page-header__main {
  /* 盒模型显示方式 */
  display: flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 元素间距 */
  gap: 14px;
}

.wt-page-header__back {
  /* 定位方式 */
  position: relative;
  /* 盒模型显示方式 */
  display: inline-flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 主轴内容分配方式 */
  justify-content: center;
  /* 宽度 */
  width: 34px;
  /* 高度 */
  height: 34px;
  /* 边框 */
  border: 0;
  /* 鼠标指针样式 */
  cursor: pointer;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-sm);
  /* 背景 */
  background: linear-gradient(
    145deg,
    rgba(0, 0, 0, var(--wt-shadow-dark-alpha)),
    rgba(0, 0, 0, var(--wt-shadow-dark-alpha-strong))
  );
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 2px 3px 6px rgba(0, 0, 0, 0.12),
    inset -2px -2px 5px var(--wt-shadow-light),
    2px 3px 8px rgba(0, 0, 0, 0.08);
  /* 文本颜色 */
  color: var(--wt-text);
  /* 过渡动画 */
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.wt-page-header__back:hover {
  /* 形变 */
  transform: translateY(-1px) scale(1.04);
}

.wt-page-header__back:active {
  /* 形变 */
  transform: scale(0.92);
}

.wt-page-header__back-arrow {
  /* 字号 */
  font-size: 22px;
  /* 行高 */
  line-height: 1;
}

.wt-page-header__heading {
  /* 最小宽度 */
  min-width: 0;
  /* 弹性布局中的伸缩比例 */
  flex: 1;
}

.wt-page-header__title {
  /* 外边距 */
  margin: 0;
  /* 文本颜色 */
  color: var(--wt-text);
  /* 字号 */
  font-size: 22px;
  /* 字重 */
  font-weight: 700;
  /* 行高 */
  line-height: 1.3;
}

.wt-page-header__subtitle {
  /* 外边距 */
  margin: 4px 0 0;
  /* 文本颜色 */
  color: var(--wt-text-secondary);
  /* 字号 */
  font-size: 13px;
}

.wt-page-header__extra {
  /* 盒模型显示方式 */
  display: flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 元素间距 */
  gap: 8px;
}
</style>
