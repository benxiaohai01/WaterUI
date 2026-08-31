<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
const suggestions = ['Water UI', 'Vue 3', 'TypeScript', 'Vue Router', 'Vite']
</script>

<template>
  <div class="demo">
    <wt-autocomplete v-model="value" :suggestions="suggestions" placeholder="输入 v 试试" clearable />
  </div>
</template>

<style scoped>
.demo { max-width: 360px; }
</style>
