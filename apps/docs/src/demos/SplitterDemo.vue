<script setup lang="ts">
import { ref } from 'vue'

const size = ref(240)
</script>

<template>
  <wt-splitter v-model="size" :min="120" :max="480" style="height: 220px">
    <template #first>
      <wt-card title="左面板" shadow="never">
        <p>拖动中间分隔条调整面板宽度，当前：{{ size }}px</p>
      </wt-card>
    </template>
    <template #second>
      <wt-card title="右面板" shadow="never">
        <p>右侧内容区自动占满剩余空间。</p>
      </wt-card>
    </template>
  </wt-splitter>
</template>
