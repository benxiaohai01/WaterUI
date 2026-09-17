<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const loading = ref(true)

/* 定时器句柄，卸载时清理，避免离开页面后仍修改状态 */
let timer: number | undefined

onMounted(() => {
  timer = window.setTimeout(() => {
    loading.value = false
  }, 2500)
})

onBeforeUnmount(() => {
  window.clearTimeout(timer)
})
</script>

<template>
  <wt-skeleton :loading="loading" avatar :title-rows="1" :paragraph-rows="3" animated>
    <wt-card title="加载完成">
      <p>骨架屏加载完毕，这里是真实内容。</p>
    </wt-card>
  </wt-skeleton>
</template>
