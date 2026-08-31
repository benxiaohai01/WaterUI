<script setup lang="ts">
import { ref } from 'vue'

const color = ref('#3d7eff')
</script>

<template>
  <div class="demo">
    <wt-color-picker v-model="color" />
  </div>
</template>

<style scoped>
.demo { max-width: 260px; }
</style>
