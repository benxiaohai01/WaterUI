<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { componentMeta } from '@/components/catalog'
import { componentDemos } from '@/demos'
import CodeBlock from '@/components/CodeBlock.vue'
import { componentParams } from '@/components/componentParams'

const props = defineProps<{
  name: string
}>()

const meta = computed(() => componentMeta[props.name])
const demos = computed(() => componentDemos[props.name] ?? [])
const params = computed(() => componentParams[props.name] ?? [])
const paramColumns = [
  { key: 'name', title: '参数名', width: '24%' },
  { key: 'type', title: '类型', width: '16%' },
  { key: 'defaultValue', title: '默认值', width: '18%' },
  { key: 'description', title: '说明' }
]

const rippleEnabled = ref(false)
const rippleOpacity = ref(0.45)
const rippleScale = ref(9)
const iconWrapped = ref(false)

/* 支持组件级高光参数的组件（与组件库 props 的 HighlightProps 保持一致） */
const highlightComponents = new Set([
  'affix', 'alert', 'autocomplete', 'avatar', 'back-top', 'badge', 'button', 'calendar', 'card',
  'carousel', 'cascader', 'checkbox', 'collapse', 'color-picker', 'date-picker', 'descriptions',
  'dialog', 'drawer', 'dropdown', 'empty', 'image', 'input', 'input-number', 'loading', 'menu',
  'message', 'message-box', 'notification', 'page-header', 'pagination', 'popconfirm', 'popover',
  'progress', 'radio', 'rate', 'result', 'scrollbar', 'select', 'slider', 'splitter', 'steps',
  'switch', 'table', 'tabs', 'tag', 'textarea', 'time-picker', 'tooltip', 'transfer', 'upload'
])

const supportsHighlight = computed(() => highlightComponents.has(props.name))

/* 组件级高光滑块：未调节时不写入内联变量，保持组件默认与全局配置 */
const highlightSize = ref(12)
const highlightOffset = ref(8)
const highlightOpacity = ref(0.78)
const highlightTouched = ref(false)

const resetHighlight = () => {
  highlightSize.value = 12
  highlightOffset.value = 8
  highlightOpacity.value = 0.78
  highlightTouched.value = false
}

const previewStyle = computed(() => {
  const style: Record<string, string | number> = {}

  if (props.name === 'button') {
    style['--wt-ripple-enabled'] = rippleEnabled.value ? 1 : 0
    style['--wt-ripple-opacity'] = rippleOpacity.value
    style['--wt-ripple-scale'] = rippleScale.value
  }

  if (supportsHighlight.value && highlightTouched.value) {
    /* 覆盖全局基准：组件的高光尺寸/位置均等比派生自基准，因此在示例范围内即等价于组件级参数 */
    style['--wt-highlight-size-base'] = `${highlightSize.value}px`
    style['--wt-highlight-offset'] = `${highlightOffset.value}px`
    style['--wt-highlight-opacity'] = `${highlightOpacity.value}`
    style['--wt-highlight-small-opacity'] = `${Math.max(0, highlightOpacity.value - 0.1)}`
  }

  return style
})

/* 切换组件时重置预览控制状态，避免参数串页 */
watch(
  () => props.name,
  () => {
    rippleEnabled.value = false
    rippleOpacity.value = 0.45
    rippleScale.value = 9
    iconWrapped.value = false
    resetHighlight()
  }
)

const demoProps = computed(() => {
  if (props.name === 'icon') {
    return { wrapped: iconWrapped.value }
  }

  return {}
})
</script>

<template>
  <article v-if="meta" class="component-page">
    <header class="component-page__header">
      <div>
        <wt-text type="secondary" strong>Water UI</wt-text>
        <h1>{{ meta.label }}</h1>
        <p v-if="meta.available">
          使用水滴视觉与可组合 API 构建，支持主题、响应式和暗黑模式。
        </p>
        <p v-else>该组件已列入组件规划，当前版本尚未开放。</p>
      </div>
      <wt-tag v-if="meta.available" type="primary">{{ demos.length }} 个示例</wt-tag>
      <wt-tag v-else type="warning">规划中</wt-tag>
    </header>

    <template v-if="meta.available">
      <section v-if="name === 'button' || name === 'icon'" class="token-panel component-controls">
        <div class="token-panel__heading">
          <wt-text strong>{{ name === 'button' ? '按钮组件参数' : '图标组件参数' }}</wt-text>
          <wt-text type="secondary">
            {{ name === 'button' ? '仅作用于当前 Button 示例。' : '仅作用于当前 Icon 示例。' }}
          </wt-text>
        </div>

        <div v-if="name === 'button'" class="token-panel__grid">
          <div class="token-control token-control--switch">
            <span>按钮扩散效果</span>
            <wt-switch v-model="rippleEnabled" />
          </div>

          <div class="token-control">
            <span>扩散透明度</span>
            <wt-slider v-model="rippleOpacity" :min="0.1" :max="0.9" :step="0.05" show-value />
          </div>

          <div class="token-control">
            <span>扩散范围</span>
            <wt-slider v-model="rippleScale" :min="4" :max="16" :step="1" show-value />
          </div>
        </div>

        <div v-else class="token-panel__grid">
          <div class="token-control token-control--switch">
            <span>水滴包裹</span>
            <wt-switch v-model="iconWrapped" />
          </div>
        </div>
      </section>

      <section v-if="supportsHighlight" class="token-panel component-controls">
        <div class="token-panel__heading">
          <div>
            <wt-text strong>{{ meta.label }} 高光参数</wt-text>
            <wt-text type="secondary">仅作用于当前示例，覆盖全局配置；组件 props 与全局配置等价。</wt-text>
          </div>
          <wt-button size="small" @click="resetHighlight()">恢复默认</wt-button>
        </div>

        <div class="token-panel__grid">
          <div class="token-control">
            <span>高光尺寸</span>
            <wt-slider
              v-model="highlightSize"
              :min="4"
              :max="24"
              :step="1"
              show-value
              @update:model-value="highlightTouched = true"
            />
          </div>

          <div class="token-control">
            <span>高光偏移</span>
            <wt-slider
              v-model="highlightOffset"
              :min="0"
              :max="16"
              :step="1"
              show-value
              @update:model-value="highlightTouched = true"
            />
          </div>

          <div class="token-control">
            <span>高光透明度</span>
            <wt-slider
              v-model="highlightOpacity"
              :min="0.2"
              :max="1"
              :step="0.05"
              show-value
              @update:model-value="highlightTouched = true"
            />
          </div>
        </div>
      </section>

      <section v-for="demo in demos" :key="demo.title" class="demo-section">
        <h2>{{ demo.title }}</h2>
        <p>{{ demo.description }}</p>

        <div class="demo-section__preview" :style="previewStyle">
          <component :is="demo.component" v-bind="demoProps" />
        </div>

        <CodeBlock :code="demo.code" language="vue" />
      </section>

      <section v-if="params.length" class="params-section">
        <h2>参数说明</h2>
        <wt-table :columns="paramColumns" :data="params" striped />
      </section>
    </template>

    <section v-else class="planned-state">
      <wt-icon name="code" :size="36" color="var(--wt-text-placeholder)" />
      <h2>组件开发中</h2>
      <p>我们会在后续阶段补齐该组件。</p>
      <wt-button type="primary" @click="$router.push('/components')">
        返回组件列表
      </wt-button>
    </section>
  </article>

  <div v-else class="not-found">
    <h1>组件不存在</h1>
    <wt-button type="primary" @click="$router.push('/components')">返回组件列表</wt-button>
  </div>
</template>

<style scoped lang="scss">
.component-page {
  max-width: 1080px;
  margin: 0 auto;
}

.component-page__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding-bottom: 26px;
  border-bottom: 1px solid color-mix(in srgb, var(--wt-text-secondary) 14%, transparent);
}

.component-page__header h1 {
  margin: 10px 0 12px;
  color: var(--wt-text);
  font-size: clamp(28px, 4vw, 44px);
  line-height: 1.1;
}

.component-page__header p {
  max-width: 620px;
  margin: 0;
  color: var(--wt-text-secondary);
  line-height: 1.7;
}

.token-panel {
  margin: 28px 0;
  padding: 20px;
  border-radius: var(--wt-radius-md);
  background: color-mix(in srgb, var(--wt-surface) 72%, transparent);
  box-shadow:
    inset 2px 3px 8px var(--wt-shadow-dark),
    inset -2px -2px 5px var(--wt-shadow-light);
}

.token-panel__heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.token-panel__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(150px, 1fr));
  gap: 16px;
}

.token-control {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 8px 10px;
  color: var(--wt-text-secondary);
  font-size: 13px;
}

.token-control em {
  color: var(--wt-text);
  font-style: normal;
  font-size: 12px;
  white-space: nowrap;
}

.token-control .wt-slider {
  grid-column: 1 / -1;
}

.token-control--switch {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.token-color-input {
  grid-column: 1 / -1;
  max-width: 96px;
}

.token-color-input :deep(.wt-input__native) {
  height: 28px;
  padding: 2px 4px;
  cursor: pointer;
}

.demo-section {
  padding: 34px 0;
  border-bottom: 1px solid color-mix(in srgb, var(--wt-text-secondary) 14%, transparent);
}

.demo-section h2 {
  margin: 0 0 8px;
  color: var(--wt-text);
  font-size: 22px;
}

.demo-section > p {
  margin: 0 0 18px;
  color: var(--wt-text-secondary);
}

.demo-section__preview {
  min-height: 180px;
  padding: clamp(18px, 4vw, 38px);
  margin-bottom: 16px;
  border-radius: var(--wt-radius-lg);
  background: color-mix(in srgb, var(--wt-bg) 92%, var(--wt-surface));
  box-shadow:
    inset 3px 4px 10px var(--wt-shadow-dark),
    inset -2px -2px 6px var(--wt-shadow-light),
    0 12px 30px color-mix(in srgb, var(--wt-shadow-dark) 60%, transparent);
}

.params-section {
  padding: 34px 0;
}

.params-section h2 {
  margin: 0 0 18px;
  color: var(--wt-text);
  font-size: 22px;
}

.planned-state,
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 440px;
  text-align: center;
}

.planned-state h2,
.not-found h1 {
  margin: 16px 0 8px;
  color: var(--wt-text);
}

.planned-state p {
  margin: 0 0 20px;
  color: var(--wt-text-secondary);
}

@media (max-width: 920px) {
  .token-panel__grid {
    grid-template-columns: repeat(2, minmax(150px, 1fr));
  }
}

@media (max-width: 560px) {
  .token-panel__heading {
    flex-direction: column;
  }

  .token-panel__grid {
    grid-template-columns: 1fr;
  }
}
</style>
