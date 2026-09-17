<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { TabPaneProps } from './props'
import { useTabs } from './context'
import { useUid } from '../../utils/uid'

/* 组件注册名（供全局组件与 DevTools 识别） */
defineOptions({ name: 'WtTabPane' })

/* 声明组件入参与默认值 */
const props = withDefaults(defineProps<TabPaneProps>(), {
  label: '',
  name: undefined,
  disabled: false,
  lazy: false,
  customClass: ''
})

const tabs = useTabs()
const fallbackName = useUid('wt-tabpane')

/* 派生状态：选项卡标识（默认取实例 uid，挂载前后保持稳定） */
const paneName = computed<string | number>(() => props.name ?? fallbackName)

/* 派生状态：面板与标签的关联 id */
const panelId = computed(() => `${tabs?.id ?? 'wt-tabs'}-panel-${String(paneName.value)}`)
const tabId = computed(() => `${tabs?.id ?? 'wt-tabs'}-tab-${String(paneName.value)}`)

/* 响应式状态：是否已激活过（懒渲染用） */
const rendered = ref(false)

/* 派生状态：是否激活 */
const active = computed(() => tabs?.activeName === paneName.value)

/* 注册到父级 Tabs */
onMounted(() => {
  tabs?.register({
    label: props.label,
    name: paneName.value,
    disabled: props.disabled,
    lazy: props.lazy
  })
})

/* 标题与禁用状态变化时同步到父级注册信息 */
watch(
  () => [props.label, props.disabled],
  () => {
    tabs?.update(paneName.value, { label: props.label, disabled: props.disabled })
  }
)

onBeforeUnmount(() => {
  tabs?.unregister(paneName.value)
})

/* 懒渲染：激活后永久渲染 */
watch(
  active,
  (value) => {
    if (value) rendered.value = true
  },
  { immediate: true }
)

/* 派生状态：内容是否渲染（仅由自身 lazy 决定） */
const shouldRender = computed(() => {
  if (!tabs) return true
  if (active.value) return true
  return !props.lazy || rendered.value
})

/* 派生状态：面板类名 */
const classes = computed(() => [
  'wt-tab-pane',
  { 'is-active': active.value },
  props.customClass
])
</script>

<template>
  <div
    v-if="shouldRender"
    :id="panelId"
    :class="classes"
    role="tabpanel"
    :aria-hidden="!active"
    :aria-labelledby="tabId"
  >
    <slot />
  </div>
</template>

<style scoped lang="scss">
.wt-tab-pane {
  /* 盒模型显示方式 */
  display: none;
  /* 文本颜色 */
  color: var(--wt-text);
}

.wt-tab-pane.is-active {
  /* 盒模型显示方式 */
  display: block;
}
</style>
