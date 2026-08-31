<script setup lang="ts">
import { ref } from 'vue'

const value = ref('Water UI')
</script>

<template>
  <div class="demo">
    <wt-textarea v-model="value" rows="4" placeholder="请输入内容" show-word-limit />
  </div>
</template>

<style scoped>
.demo { max-width: 420px; }
</style>
