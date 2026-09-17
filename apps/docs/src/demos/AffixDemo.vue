<script setup lang="ts">
import { ref } from 'vue'

const fixed = ref(false)
</script>

<template>
  <div class="affix-demo">
    <wt-affix :offset="16" @change="(v: boolean) => (fixed = v)">
      <wt-button type="primary">固定定位按钮（滚动窗口查看）</wt-button>
    </wt-affix>

    <p class="affix-demo__hint">
      滚动页面时该按钮会自然吸附在视口顶部下方，并遮盖下方滚动的内容{{ fixed ? '，当前已固定' : '' }}。
    </p>

    <div class="affix-demo__filler">
      <p v-for="n in 14" :key="n" class="affix-demo__line">页面内容 {{ n }}：向下滚动观察按钮的吸附效果。</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.affix-demo__hint {
  margin-top: 24px;
  color: var(--wt-text-secondary);
  font-size: 13px;
}

.affix-demo__filler {
  margin-top: 16px;
  padding: 16px;
  border-radius: var(--wt-radius-sm);
  background: color-mix(in srgb, var(--wt-surface) 70%, transparent);
}

.affix-demo__line {
  margin: 12px 0;
  color: var(--wt-text-secondary);
  font-size: 13px;
}
</style>
