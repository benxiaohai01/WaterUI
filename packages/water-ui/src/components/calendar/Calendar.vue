<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { CalendarProps, CalendarEmits } from './props'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtCalendar' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<CalendarProps>(), {
  modelValue: '',
  showExtra: false,
  customClass: ''
})

/* 声明组件事件 */
const emit = defineEmits<CalendarEmits>()

/* 响应式状态：当前显示的年月 */
const today = new Date()
const viewYear = ref(props.year || today.getFullYear())
const viewMonth = ref(props.month || today.getMonth() + 1)

/* 响应式状态：选中日期（YYYY-MM-DD） */
const selected = ref(props.modelValue)

/* 同步外部 modelValue */
watch(
  () => props.modelValue,
  (value) => {
    selected.value = value
  }
)

/* 派生状态：当月第一天星期几（0=周日） */
const firstDay = computed(() => new Date(viewYear.value, viewMonth.value - 1, 1).getDay())

/* 派生状态：当月天数 */
const daysInMonth = computed(() => new Date(viewYear.value, viewMonth.value + 1 - 1, 0).getDate())

/* 派生状态：日历格子（含前后月补位） */
interface CalendarCell {
  day: number
  inMonth: boolean
  date: string
}

const cells = computed<CalendarCell[]>(() => {
  const prevDays = new Date(viewYear.value, viewMonth.value - 1, 0).getDate()
  const list: CalendarCell[] = []
  for (let i = firstDay.value - 1; i >= 0; i -= 1) {
    const day = prevDays - i
    const date = `${viewYear.value}-${String(viewMonth.value - 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    list.push({ day, inMonth: false, date })
  }
  for (let day = 1; day <= daysInMonth.value; day += 1) {
    const date = `${viewYear.value}-${String(viewMonth.value).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    list.push({ day, inMonth: true, date })
  }
  const remain = (7 - (list.length % 7)) % 7
  for (let day = 1; day <= remain; day += 1) {
    const date = `${viewYear.value}-${String(viewMonth.value + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    list.push({ day, inMonth: false, date })
  }
  return list
})

/* 派生状态：今天日期字符串 */
const todayStr = computed(() => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
})

/* 交互处理逻辑：选择日期 */
const selectDate = (cell: CalendarCell) => {
  if (!cell.inMonth) return
  selected.value = cell.date
  emit('update:modelValue', cell.date)
}

/* 交互处理逻辑：切换月份 */
const goMonth = (delta: number) => {
  viewMonth.value += delta
  if (viewMonth.value > 12) {
    viewMonth.value = 1
    viewYear.value += 1
  } else if (viewMonth.value < 1) {
    viewMonth.value = 12
    viewYear.value -= 1
  }
  emit('change', viewYear.value, viewMonth.value)
}

/* 交互处理逻辑：回到今天 */
const goToday = () => {
  viewYear.value = today.getFullYear()
  viewMonth.value = today.getMonth() + 1
  selected.value = todayStr.value
  emit('update:modelValue', todayStr.value)
  emit('change', viewYear.value, viewMonth.value)
}

/* 星期表头 */
const weekdays = ['日', '一', '二', '三', '四', '五', '六']
</script>

<template>
  <div :class="['wt-calendar', props.customClass]">
    <div class="wt-calendar__header">
      <button type="button" class="wt-calendar__nav" aria-label="上个月" @click="goMonth(-1)">‹</button>
      <div class="wt-calendar__title">{{ viewYear }} 年 {{ viewMonth }} 月</div>
      <button type="button" class="wt-calendar__nav" aria-label="下个月" @click="goMonth(1)">›</button>
      <button type="button" class="wt-calendar__today" @click="goToday">今天</button>
    </div>
    <div class="wt-calendar__weekdays">
      <span v-for="weekday in weekdays" :key="weekday" class="wt-calendar__weekday">{{ weekday }}</span>
    </div>
    <div class="wt-calendar__grid">
      <button
        v-for="cell in cells"
        :key="cell.date"
        type="button"
        class="wt-calendar__cell"
        :class="{
          'is-outside': !cell.inMonth,
          'is-selected': cell.date === selected,
          'is-today': cell.date === todayStr
        }"
        @click="selectDate(cell)"
      >
        {{ cell.day }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wt-calendar {
  /* 宽度 */
  width: 100%;
  /* 最大宽度 */
  max-width: 420px;
  /* 背景 */
  background: color-mix(in srgb, var(--wt-surface) 76%, transparent);
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-md);
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 3px 4px 10px rgba(0, 0, 0, 0.05),
    inset -2px -2px 6px var(--wt-shadow-light),
    0 10px 26px rgba(0, 0, 0, 0.05);
  /* 内边距 */
  padding: 18px;
  /* 动画 */
  animation: wt-liquid-flow-subtle var(--wt-motion-slow) ease-in-out infinite;
  /* 动画性能提示 */
  will-change: border-radius;
}

.wt-calendar__header {
  /* 盒模型显示方式 */
  display: flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 间隙 */
  gap: var(--wt-space-xs);
  /* 底部外边距 */
  margin-bottom: var(--wt-space-md);
}

.wt-calendar__title {
  /* 弹性 */
  flex: 1;
  /* 文本对齐方式 */
  text-align: center;
  /* 文本颜色 */
  color: var(--wt-text);
  /* 字号 */
  font-size: 15px;
  /* 字重 */
  font-weight: 600;
}

.wt-calendar__nav {
  /* 宽度 */
  width: 30px;
  /* 高度 */
  height: 30px;
  /* 盒模型显示方式 */
  display: inline-flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 主轴对齐方式 */
  justify-content: center;
  /* 边框 */
  border: none;
  /* 背景 */
  background: color-mix(in srgb, var(--wt-surface-strong) 50%, transparent);
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-xs);
  /* 文本颜色 */
  color: var(--wt-text-secondary);
  /* 字号 */
  font-size: 16px;
  /* 鼠标指针样式 */
  cursor: pointer;
}

.wt-calendar__nav:hover {
  /* 文本颜色 */
  color: var(--wt-primary);
}

.wt-calendar__today {
  /* 边框 */
  border: none;
  /* 背景 */
  background: transparent;
  /* 文本颜色 */
  color: var(--wt-primary);
  /* 字号 */
  font-size: 13px;
  /* 鼠标指针样式 */
  cursor: pointer;
}

.wt-calendar__weekdays {
  /* 盒模型显示方式 */
  display: grid;
  /* 网格模板列 */
  grid-template-columns: repeat(7, 1fr);
  /* 文本对齐方式 */
  text-align: center;
  /* 底部外边距 */
  margin-bottom: var(--wt-space-xs);
}

.wt-calendar__weekday {
  /* 内边距 */
  padding: 6px 0;
  /* 文本颜色 */
  color: var(--wt-text-placeholder);
  /* 字号 */
  font-size: 12px;
}

.wt-calendar__grid {
  /* 盒模型显示方式 */
  display: grid;
  /* 网格模板列 */
  grid-template-columns: repeat(7, 1fr);
  /* 间隙 */
  gap: 4px;
}

.wt-calendar__cell {
  /* 高度 */
  height: 38px;
  /* 盒模型显示方式 */
  display: inline-flex;
  /* 交叉轴对齐方式 */
  align-items: center;
  /* 主轴对齐方式 */
  justify-content: center;
  /* 边框 */
  border: none;
  /* 背景 */
  background: transparent;
  /* 圆角，塑造水滴/液体轮廓 */
  border-radius: var(--wt-radius-xs);
  /* 文本颜色 */
  color: var(--wt-text);
  /* 字号 */
  font-size: 13px;
  /* 鼠标指针样式 */
  cursor: pointer;
  /* 过渡 */
  transition:
    background 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease;
}

.wt-calendar__cell:hover {
  /* 背景 */
  background: color-mix(in srgb, var(--wt-primary) 10%, transparent);
}

.wt-calendar__cell.is-outside {
  /* 文本颜色 */
  color: var(--wt-text-placeholder);
}

.wt-calendar__cell.is-today {
  /* 文本颜色 */
  color: var(--wt-primary);
  /* 字重 */
  font-weight: 600;
}

.wt-calendar__cell.is-selected {
  /* 背景 */
  background: color-mix(in srgb, var(--wt-primary) 16%, transparent);
  /* 文本颜色 */
  color: var(--wt-primary);
  /* 字重 */
  font-weight: 600;
  /* 水滴内外部阴影层次 */
  box-shadow:
    inset 2px 3px 6px rgba(0, 0, 0, 0.06),
    inset -1px -1px 4px var(--wt-shadow-light),
    0 4px 12px color-mix(in srgb, var(--wt-primary) 22%, transparent);
}
</style>
