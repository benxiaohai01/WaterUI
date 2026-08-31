<script setup lang="ts">
import { ref } from 'vue'

const value = ref('vue')
const options = [
  { label: 'Vue 3', value: 'vue' },
  { label: 'React', value: 'react' },
  { label: 'Svelte', value: 'svelte' }
]
</script>

<template>
  <div class="demo">
    <wt-select v-model="value" :options="options" placeholder="请选择框架" clearable />
  </div>
</template>

<style scoped>
.demo { max-width: 320px; }
</style>
