<script setup lang="ts">
import { ref } from 'vue'

const active = ref('anchor-1')
</script>

<template>
  <div class="anchor-demo">
    <div class="anchor-demo__nav">
      <wt-anchor v-model="active" :offset="20">
        <wt-anchor-link href="anchor-1" title="简介" />
        <wt-anchor-link href="anchor-2" title="特性" />
        <wt-anchor-link href="anchor-3" title="用法" />
      </wt-anchor>
    </div>

    <div class="anchor-demo__content">
      <section id="anchor-1" class="anchor-demo__section">
        <h3>简介</h3>
        <p>Water UI 是一套以水滴为视觉语言的 Vue 3 组件库。</p>
      </section>
      <section id="anchor-2" class="anchor-demo__section">
        <h3>特性</h3>
        <p>支持明暗双主题、可组合 API 与按需引入。</p>
      </section>
      <section id="anchor-3" class="anchor-demo__section">
        <h3>用法</h3>
        <p>通过 wt-anchor 与 wt-anchor-link 快速构建页面内导航。</p>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
.anchor-demo {
  display: flex;
  gap: 24px;
}

.anchor-demo__nav {
  width: 140px;
  flex-shrink: 0;
}

.anchor-demo__content {
  flex: 1;
  min-width: 0;
}

.anchor-demo__section {
  height: 240px;
  padding: 20px;
  margin-bottom: 12px;
  border-radius: var(--wt-radius-md);
  background: color-mix(in srgb, var(--wt-surface) 60%, transparent);
}

.anchor-demo__section h3 {
  margin: 0 0 8px;
  color: var(--wt-text);
}

.anchor-demo__section p {
  margin: 0;
  color: var(--wt-text-secondary);
}
</style>
