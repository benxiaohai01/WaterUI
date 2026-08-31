<script setup lang="ts">
import { ref } from 'vue'

const files = ref<Array<{ name: string; size?: number; status?: string }>>([])
</script>

<template>
  <div class="demo">
    <wt-upload v-model="files" multiple accept=".png,.jpg,.pdf" />
  </div>
</template>

<style scoped>
.demo { max-width: 360px; }
</style>
