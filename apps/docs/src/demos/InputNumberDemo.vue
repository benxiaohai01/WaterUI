<script setup lang="ts">
import { ref } from 'vue'

const value = ref(12)
</script>

<template>
  <div class="demo">
    <wt-input-number v-model="value" :min="0" :max="100" :step="2" />
  </div>
</template>

<style scoped>
.demo { max-width: 240px; }
</style>
