<script setup lang="ts">
import { ref } from 'vue'

const clicked = ref(0)
</script>

<template>
  <div class="back-top-demo">
    <p>向下滚动页面，滚动到一定距离后按钮会出现，点击即可回到页面顶部。</p>
    <p v-if="clicked > 0">已点击返回顶部 {{ clicked }} 次。</p>

    <div class="back-top-demo__filler">
      <p v-for="n in 24" :key="n" class="back-top-demo__line">
        页面内容 {{ n }}：继续向下滚动，观察右下角出现的返回顶部按钮。
      </p>
    </div>

    <wt-back-top :visibility-height="200" @click="clicked += 1" />
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

.back-top-demo__filler {
  margin-top: 12px;
  padding: 16px;
  border-radius: var(--wt-radius-sm);
  background: color-mix(in srgb, var(--wt-surface) 70%, transparent);
}

.back-top-demo__line {
  margin: 12px 0;
  font-size: 13px;
}
</style>
