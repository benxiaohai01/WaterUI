<script setup lang="ts">
import { ref } from 'vue'

const date = ref('2026-08-31')
</script>

<template>
  <div class="demo">
    <wt-date-picker v-model="date" clearable />
  </div>
</template>

<style scoped>
.demo { max-width: 260px; }
</style>
