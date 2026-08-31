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
const uid = useUid('wt-tabpane')

/* 派生状态：选项卡标识（默认取注册序号，使用 uid 保证稳定） */
const paneName = computed<string | number>(() => {
  if (props.name !== undefined) return props.name
  return tabs ? `${uid}-${tabs.panes.length}` : uid
})

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

onBeforeUnmount(() => {
  tabs?.unregister(paneName.value)
})

/* 懒渲染：激活后永久渲染 */
watch(active, (value) => {
  if (value) rendered.value = true
})

/* 派生状态：内容是否渲染 */
const shouldRender = computed(() => {
  if (!tabs) return true
  if (active.value) return true
  return !(props.lazy || tabs.panes.some((p) => p.lazy)) || rendered.value
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
    :class="classes"
    role="tabpanel"
    :aria-hidden="!active"
    :aria-labelledby="`${uid}-tab`"
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
