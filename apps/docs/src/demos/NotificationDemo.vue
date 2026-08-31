<script setup lang="ts">
import { notification } from '@water-ui/components'
</script>

<template>
  <wt-space :size="12">
    <wt-button type="primary" @click="notification.success('操作成功', { title: '完成' })">
      成功通知
    </wt-button>
    <wt-button type="warning" @click="notification.warning('资源即将到期', { title: '提醒' })">
      警告通知
    </wt-button>
    <wt-button type="danger" @click="notification.error('连接失败', { title: '错误' })">
      错误通知
    </wt-button>
    <wt-button @click="notification.info('欢迎使用 Water UI', { title: '信息' })">
      信息通知
    </wt-button>
  </wt-space>
</template>
