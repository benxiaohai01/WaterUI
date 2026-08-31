<script setup lang="ts">
import { ref } from 'vue'

const placement = ref<'left' | 'right' | 'top' | 'bottom'>('right')
const visible = ref(false)
</script>

<template>
  <wt-space direction="vertical" :size="14">
    <wt-space :size="10">
      <wt-radio v-model="placement" value="left">左侧</wt-radio>
      <wt-radio v-model="placement" value="right">右侧</wt-radio>
      <wt-radio v-model="placement" value="top">顶部</wt-radio>
      <wt-radio v-model="placement" value="bottom">底部</wt-radio>
      <wt-button type="primary" @click="visible = true">打开抽屉</wt-button>
    </wt-space>
    <wt-drawer v-model="visible" :placement="placement" title="水滴抽屉" size="300px">
      <p>抽屉内容区域，适合承载详情、设置或长表单。</p>
    </wt-drawer>
  </wt-space>
</template>
