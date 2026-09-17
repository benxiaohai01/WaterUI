<script setup lang="ts">
import { computed } from 'vue'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtRow' })

/* 声明组件入参与默认值 */
const props = withDefaults(
  defineProps<{
    gutter?: number | [number, number]
    justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
    align?: 'start' | 'center' | 'end' | 'stretch'
    wrap?: boolean
    customClass?: string
  }>(),
  {
    gutter: 0,
    justify: 'start',
    align: 'stretch',
    wrap: true,
    customClass: ''
  }
)

/* 派生状态（计算属性） */
const style = computed(() => {
  const horizontal = Array.isArray(props.gutter) ? props.gutter[0] : props.gutter
  const vertical = Array.isArray(props.gutter) ? props.gutter[1] : props.gutter
  return {
    '--wt-row-gutter': horizontal ? `${horizontal}px` : '0px',
    marginLeft: horizontal ? `-${horizontal / 2}px` : undefined,
    marginRight: horizontal ? `-${horizontal / 2}px` : undefined,
    rowGap: vertical ? `${vertical}px` : undefined
  }
})
</script>

<template>
  <div
    class="wt-row"
    :class="[`wt-row--${justify}`, `wt-row--align-${align}`, { 'is-wrap': wrap }, customClass]"
    :style="style"
  >
    <slot />
  </div>
</template>
<style scoped lang="scss">
.wt-row {
  /* 盒模型显示方式 */
  display: flex;
  /* 最小宽度 */
  min-width: 0;
}

.wt-row.is-wrap {
  /* 弹性项是否换行 */
  flex-wrap: wrap;
}

.wt-row--start {
/* 主轴内容分配方式 */
justify-content: flex-start;
}
.wt-row--center {
/* 主轴内容分配方式 */
justify-content: center;
}
.wt-row--end {
/* 主轴内容分配方式 */
justify-content: flex-end;
}
.wt-row--between {
/* 主轴内容分配方式 */
justify-content: space-between;
}
.wt-row--around {
/* 主轴内容分配方式 */
justify-content: space-around;
}
.wt-row--evenly {
/* 主轴内容分配方式 */
justify-content: space-evenly;
}
.wt-row--align-start {
/* 交叉轴对齐方式 */
align-items: flex-start;
}
.wt-row--align-center {
/* 交叉轴对齐方式 */
align-items: center;
}
.wt-row--align-end {
/* 交叉轴对齐方式 */
align-items: flex-end;
}
.wt-row--align-stretch {
/* 交叉轴对齐方式 */
align-items: stretch;
}
</style>