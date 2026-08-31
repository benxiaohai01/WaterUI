<script setup lang="ts">
import { ref } from 'vue'

const active = ref('tab-1')
</script>

<template>
  <div class="tabs-demo">
    <wt-tabs v-model="active">
      <wt-tab-pane label="水滴" name="tab-1">
        <p>水滴是 Water UI 的核心视觉语言。</p>
      </wt-tab-pane>
      <wt-tab-pane label="主题" name="tab-2">
        <p>支持亮色与暗黑双主题切换。</p>
      </wt-tab-pane>
      <wt-tab-pane label="禁用" name="tab-3" disabled>
        <p>该选项卡已禁用。</p>
      </wt-tab-pane>
    </wt-tabs>
  </div>
</template>

<style scoped lang="scss">
.tabs-demo p {
  margin: 0;
  padding: 16px 8px;
  color: var(--wt-text-secondary);
}
</style>
