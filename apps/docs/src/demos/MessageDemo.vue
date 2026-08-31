<script setup lang="ts">
import { message } from '@water-ui/components'
</script>

<template>
  <wt-space :size="12">
    <wt-button type="primary" @click="message.success('保存成功')">成功消息</wt-button>
    <wt-button type="warning" @click="message.warning('请确认后再继续')">警告消息</wt-button>
    <wt-button type="danger" @click="message.error('操作失败')">错误消息</wt-button>
    <wt-button @click="message.info('这是一条普通消息')">普通消息</wt-button>
  </wt-space>
</template>
