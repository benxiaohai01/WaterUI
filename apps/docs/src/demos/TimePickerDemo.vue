<script setup lang="ts">
import { ref } from 'vue'

const time = ref('09:30')
</script>

<template>
  <div class="demo">
    <wt-time-picker v-model="time" clearable />
  </div>
</template>

<style scoped>
.demo { max-width: 220px; }
</style>
