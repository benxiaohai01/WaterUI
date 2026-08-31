<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(true)

setTimeout(() => {
  loading.value = false
}, 2500)
</script>

<template>
  <wt-skeleton :loading="loading" avatar :title-rows="1" :paragraph-rows="3" animated>
    <wt-card title="加载完成">
      <p>骨架屏加载完毕，这里是真实内容。</p>
    </wt-card>
  </wt-skeleton>
</template>
