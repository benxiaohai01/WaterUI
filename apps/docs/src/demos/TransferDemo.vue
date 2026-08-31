<script setup lang="ts">
import { ref } from 'vue'

const selected = ref<Array<string | number>>(['vue'])
const data = [
  { key: 'vue', label: 'Vue 3' },
  { key: 'react', label: 'React' },
  { key: 'svelte', label: 'Svelte' },
  { key: 'solid', label: 'SolidJS' }
]
</script>

<template>
  <wt-transfer v-model="selected" :data="data" />
</template>
