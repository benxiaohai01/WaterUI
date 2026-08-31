<script setup lang="ts">
import { ref } from 'vue'

const clicked = ref(0)
</script>

<template>
  <div class="back-top-demo">
    <p>向下滚动页面，右下角会出现返回顶部按钮。</p>
    <p v-if="clicked > 0">已点击返回顶部 {{ clicked }} 次。</p>

    <wt-back-top :visibility-height="120" @click="clicked += 1" />
  </div>
</template>

<style scoped lang="scss">
.back-top-demo {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: var(--wt-text-secondary);
  font-size: 14px;
}
</style>
