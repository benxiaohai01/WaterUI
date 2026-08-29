<script setup lang="ts">
import { ref } from 'vue'

const value = ref(45)
const step = ref(30)
</script>

<template>
  <div class="slider-demo">
    <wt-slider v-model="value" show-value />
    <wt-slider v-model="step" :min="0" :max="100" :step="10" />
    <wt-slider :model-value="65" disabled />
  </div>
</template>

<style scoped>
.slider-demo {
  display: flex;
  flex-direction: column;
  gap: 18px;
  max-width: 420px;
}
</style>
