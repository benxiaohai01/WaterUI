<script setup lang="ts">
import { ref } from 'vue'

const checked = ref(true)
const indeterminate = ref(false)
</script>

<template>
  <wt-space wrap :size="18">
    <wt-checkbox v-model="checked">已选中</wt-checkbox>
    <wt-checkbox v-model="indeterminate" indeterminate>半选状态</wt-checkbox>
    <wt-checkbox disabled>禁用</wt-checkbox>
  </wt-space>
</template>
