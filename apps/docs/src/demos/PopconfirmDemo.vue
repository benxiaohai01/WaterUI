<script setup lang="ts">
import { ref } from 'vue'

const result = ref('')
</script>

<template>
  <wt-space direction="vertical" :size="12">
    <wt-popconfirm
      title="删除确认"
      content="删除后不可恢复，是否继续？"
      @confirm="result = '已删除'"
      @cancel="result = '已取消'"
    >
      <wt-button type="danger">删除项目</wt-button>
    </wt-popconfirm>
    <wt-text v-if="result" type="secondary">结果：{{ result }}</wt-text>
  </wt-space>
</template>
