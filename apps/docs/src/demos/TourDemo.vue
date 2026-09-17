<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)

const steps = [
  {
    title: '欢迎使用 Water UI',
    description: '这是分步引导组件，可带领用户快速了解页面功能。',
    placement: 'center'
  },
  {
    title: '主题切换',
    description: '点击右上角按钮可在明暗主题间切换。',
    target: '.docs-theme-toggle',
    placement: 'bottom'
  },
  {
    title: '组件导航',
    description: '在这里浏览全部组件分类与示例。',
    target: '.docs-sidebar',
    placement: 'right'
  }
]
</script>

<template>
  <wt-button type="primary" @click="visible = true">开始引导</wt-button>

  <wt-tour v-model="visible" :steps="steps" :current="0" />
</template>
