<script setup lang="ts">
import { ref } from 'vue'

const tags = ref([
  { id: 1, label: '设计', type: 'default' as const },
  { id: 2, label: '灵感', type: 'primary' as const },
  { id: 3, label: '创意', type: 'success' as const },
  { id: 4, label: '极简', type: 'warning' as const }
])

const closeTag = (id: number) => {
  tags.value = tags.value.filter((tag) => tag.id !== id)
}
</script>

<template>
  <wt-space wrap :size="12">
    <wt-tag v-for="tag in tags" :key="tag.id" :type="tag.type" closable @close="closeTag(tag.id)">
      {{ tag.label }}
    </wt-tag>
    <wt-tag type="danger">危险标签</wt-tag>
    <wt-tag type="info">信息标签</wt-tag>
    <wt-tag type="primary" round>圆形标签</wt-tag>
  </wt-space>
</template>
