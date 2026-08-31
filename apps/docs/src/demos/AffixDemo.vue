<script setup lang="ts">
import { ref } from 'vue'

const fixed = ref(false)
</script>

<template>
  <div class="affix-demo">
    <wt-affix :offset="16" @change="(v: boolean) => (fixed = v)">
      <wt-button type="primary">固定定位按钮（滚动窗口查看）</wt-button>
    </wt-affix>

    <p class="affix-demo__hint">滚动页面时该按钮将吸附在视口顶部下方 {{ fixed ? '，当前已固定' : '' }}。</p>
  </div>
</template>

<style scoped lang="scss">
.affix-demo__hint {
  margin-top: 24px;
  color: var(--wt-text-secondary);
  font-size: 13px;
}
</style>
