<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(false)
const size = ref<'small' | 'medium' | 'large'>('medium')
</script>

<template>
  <wt-space direction="vertical" :size="16">
    <wt-space :size="12">
      <wt-button type="primary" @click="loading = !loading">
        {{ loading ? '停止加载' : '开始加载' }}
      </wt-button>
      <wt-text type="secondary">尺寸：</wt-text>
      <wt-radio v-model="size" value="small">小</wt-radio>
      <wt-radio v-model="size" value="medium">中</wt-radio>
      <wt-radio v-model="size" value="large">大</wt-radio>
    </wt-space>
    <wt-space :size="20" align="center">
      <wt-loading v-model="loading" :size="size" text="水滴加载中" />
    </wt-space>
  </wt-space>
</template>
