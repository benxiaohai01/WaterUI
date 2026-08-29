<script setup lang="ts">
import { computed, ref } from 'vue'
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

const previewStyle = computed(() => ({
  '--wt-ripple-enabled': rippleEnabled.value ? 1 : 0,
  '--wt-ripple-opacity': rippleOpacity.value,
  '--wt-ripple-scale': rippleScale.value
}))

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
          <label class="token-control token-control--switch">
            <span>按钮扩散效果</span>
            <wt-switch v-model="rippleEnabled" />
          </label>

          <label class="token-control">
            <span>扩散透明度</span>
            <wt-slider v-model="rippleOpacity" :min="0.1" :max="0.9" :step="0.05" show-value />
          </label>

          <label class="token-control">
            <span>扩散范围</span>
            <wt-slider v-model="rippleScale" :min="4" :max="16" :step="1" show-value />
          </label>
        </div>

        <div v-else class="token-panel__grid">
          <label class="token-control token-control--switch">
            <span>水滴包裹</span>
            <wt-switch v-model="iconWrapped" />
          </label>
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
    inset 2px 3px 8px rgba(0, 0, 0, 0.07),
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
    inset 3px 4px 10px rgba(0, 0, 0, 0.08),
    inset -2px -2px 6px var(--wt-shadow-light),
    0 12px 30px rgba(0, 0, 0, 0.06);
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
