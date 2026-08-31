<script setup lang="ts">
import { computed } from 'vue'
import type { StatisticProps } from './props'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtStatistic' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<StatisticProps>(), {
  title: '',
  prefix: '',
  suffix: '',
  precision: 0,
  groupSeparator: false,
  color: '',
  customClass: ''
})

/* 派生状态：格式化后的数值 */
const formattedValue = computed(() => {
  const fixed = props.value.toFixed(props.precision)
  if (!props.groupSeparator) return fixed
  const [int, dec] = fixed.split('.')
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return dec ? `${grouped}.${dec}` : grouped
})
</script>

<template>
  <div :class="['wt-statistic', props.customClass]">
    <div v-if="title || $slots.title" class="wt-statistic__title">
      <slot name="title">{{ title }}</slot>
    </div>
    <div class="wt-statistic__content">
      <span v-if="prefix" class="wt-statistic__prefix">{{ prefix }}</span>
      <span class="wt-statistic__value" :style="color ? { color } : undefined">
        <slot>{{ formattedValue }}</slot>
      </span>
      <span v-if="suffix" class="wt-statistic__suffix">{{ suffix }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wt-statistic {
  /* 盒模型显示方式 */
  display: inline-flex;
  /* 主轴方向 */
  flex-direction: column;
}

.wt-statistic__title {
  /* 文本颜色 */
  color: var(--wt-text-secondary);
  /* 字号 */
  font-size: 13px;
  /* 底部外边距 */
  margin-bottom: var(--wt-space-xs);
}

.wt-statistic__content {
  /* 盒模型显示方式 */
  display: inline-flex;
  /* 基线对齐 */
  align-items: baseline;
  /* 间隙 */
  gap: 4px;
}

.wt-statistic__value {
  /* 文本颜色 */
  color: var(--wt-text);
  /* 字号 */
  font-size: 26px;
  /* 字重 */
  font-weight: 600;
  /* 行高 */
  line-height: 1.2;
  /* 文本阴影 */
  text-shadow: var(--wt-text-shadow);
}

.wt-statistic__prefix,
.wt-statistic__suffix {
  /* 文本颜色 */
  color: var(--wt-text-secondary);
  /* 字号 */
  font-size: 14px;
}
</style>
