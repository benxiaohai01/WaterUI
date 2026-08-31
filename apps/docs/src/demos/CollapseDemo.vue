<script setup lang="ts">
import { ref } from 'vue'

const activeKey = ref(['panel-1'])
</script>

<template>
  <wt-collapse v-model="activeKey">
    <wt-collapse-item name="panel-1" title="什么是 Water UI？">
      <p>一套以水滴为视觉语言的 Vue 3 组件库。</p>
    </wt-collapse-item>
    <wt-collapse-item name="panel-2" title="如何切换主题？">
      <p>通过 data-theme 属性在亮色与暗黑模式间切换。</p>
    </wt-collapse-item>
    <wt-collapse-item name="panel-3" title="如何贡献组件？">
      <p>遵循 SKILL.md 规范，三件套 + 水滴视觉 token。</p>
    </wt-collapse-item>
  </wt-collapse>
</template>
