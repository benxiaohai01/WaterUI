<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
const result = ref('')
</script>

<template>
  <wt-space direction="vertical" :size="12">
    <wt-button type="primary" @click="visible = true">打开消息弹框</wt-button>
    <wt-text v-if="result" type="secondary">结果：{{ result }}</wt-text>
    <wt-message-box
      v-model="visible"
      title="删除确认"
      message="删除后数据无法恢复，是否继续？"
      type="warning"
      @confirm="result = '已确认'"
      @cancel="result = '已取消'"
    />
  </wt-space>
</template>
