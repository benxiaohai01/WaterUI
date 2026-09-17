<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
</script>

<template>
  <wt-popover
    v-model:visible="visible"
    title="水滴气泡"
    content="气泡卡片适合承载更多信息与操作。"
    placement="bottom"
  >
    <wt-button type="primary">打开气泡</wt-button>
    <template #actions>
      <wt-button size="small" @click="visible = false">知道了</wt-button>
    </template>
  </wt-popover>
</template>
