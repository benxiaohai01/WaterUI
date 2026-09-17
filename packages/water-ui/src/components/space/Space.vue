<script setup lang="ts">
import { computed } from 'vue'
import type { SpaceProps } from './props'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtSpace' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<SpaceProps>(), {
  direction: 'horizontal',
  size: 12,
  wrap: false,
  align: 'center',
  justify: 'start'
})

/* 派生状态（计算属性） */
const classes = computed(() => [
  'wt-space',
  `wt-space--${props.direction}`,
  `wt-space--align-${props.align}`,
  `wt-space--justify-${props.justify}`,
  { 'is-wrap': props.wrap },
  props.customClass
])

/* 派生状态：间距（纯数字字符串自动补 px，避免生成非法 CSS） */
const gap = computed(() => {
  if (typeof props.size === 'number') return `${props.size}px`
  const text = String(props.size).trim()
  return /^\d+(\.\d+)?$/.test(text) ? `${text}px` : text
})
</script>

<template>
  <div :class="classes" :style="{ gap }">
    <slot />
  </div>
</template>
<style scoped lang="scss">
.wt-space {
  /* 盒模型显示方式 */
  display: flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 主轴内容分配方式 */
  justify-content: flex-start;
}

.wt-space--vertical {
  /* 弹性布局主轴方向 */
  flex-direction: column;
  /* 交叉轴对齐方式 */
  align-items: flex-start;
}

.wt-space.is-wrap {
  /* 弹性项是否换行 */
  flex-wrap: wrap;
}

.wt-space--align-start {
/* 交叉轴对齐方式 */
align-items: flex-start;
}
.wt-space--align-center {
/* 交叉轴对齐方式 */
align-items: center;
}
.wt-space--align-end {
/* 交叉轴对齐方式 */
align-items: flex-end;
}
.wt-space--align-baseline {
/* 交叉轴对齐方式 */
align-items: baseline;
}
.wt-space--justify-start {
/* 主轴内容分配方式 */
justify-content: flex-start;
}
.wt-space--justify-center {
/* 主轴内容分配方式 */
justify-content: center;
}
.wt-space--justify-end {
/* 主轴内容分配方式 */
justify-content: flex-end;
}
.wt-space--justify-between {
/* 主轴内容分配方式 */
justify-content: space-between;
}
.wt-space--justify-around {
/* 主轴内容分配方式 */
justify-content: space-around;
}
.wt-space--justify-evenly {
/* 主轴内容分配方式 */
justify-content: space-evenly;
}
</style>