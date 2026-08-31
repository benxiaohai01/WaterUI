<script setup lang="ts">
import { ref } from 'vue'

const value = ref('left')
</script>

<template>
  <wt-space wrap :size="18">
    <wt-radio v-model="value" value="left">左对齐</wt-radio>
    <wt-radio v-model="value" value="center">居中</wt-radio>
    <wt-radio v-model="value" value="right" disabled>禁用</wt-radio>
  </wt-space>
</template>
