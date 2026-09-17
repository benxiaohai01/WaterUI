<script setup lang="ts">
import { ref } from 'vue'

const value = ref('vue')
const options = [
  { label: 'Vue 3', value: 'vue' },
  { label: 'React', value: 'react' },
  { label: 'Svelte', value: 'svelte' }
]

const framework = ref('vite')
</script>

<template>
  <div class="demo">
    <wt-select v-model="value" :options="options" placeholder="请选择框架" clearable />
    <wt-select v-model="framework" placeholder="声明式选项">
      <wt-option label="Vite" value="vite" />
      <wt-option label="Rollup" value="rollup" />
      <wt-option label="Rspack" value="rspack" disabled />
    </wt-select>
  </div>
</template>

<style scoped>
.demo { max-width: 320px; display: flex; flex-direction: column; gap: 12px; }
</style>
