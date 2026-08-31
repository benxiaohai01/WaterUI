<script setup lang="ts">
import { ref } from 'vue'

const activeIndex = ref(0)
</script>

<template>
  <wt-carousel v-model="activeIndex" :interval="3500">
    <wt-carousel-item v-for="(item, index) in 3" :key="item">
      <div class="slide" :style="{ background: `color-mix(in srgb, var(--wt-primary) ${28 - index * 6}%, transparent)` }">
        第 {{ index + 1 }} 张幻灯片
      </div>
    </wt-carousel-item>
  </wt-carousel>
</template>

<style scoped>
.slide {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--wt-text);
  font-size: 16px;
}
</style>
