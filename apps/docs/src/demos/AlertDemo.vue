<script setup lang="ts">
import { ref } from 'vue'

const alerts = ref([
  { type: 'primary' as const, title: '主要提示', description: '这里展示一条主要提示信息。' },
  { type: 'success' as const, title: '成功提示', description: '操作已成功完成。' },
  { type: 'warning' as const, title: '警告提示', description: '当前操作需要确认。' },
  { type: 'danger' as const, title: '危险提示', description: '该操作不可恢复。' }
])

const closeAlert = (index: number) => alerts.value.splice(index, 1)
</script>

<template>
  <wt-space direction="vertical" :size="12">
    <wt-alert
      v-for="(item, index) in alerts"
      :key="item.title"
      :type="item.type"
      :title="item.title"
      :description="item.description"
      show-icon
      closable
      @close="closeAlert(index)"
    />
    <wt-alert title="默认提示" description="不带图标与关闭按钮的水滴提示。" />
  </wt-space>
</template>
