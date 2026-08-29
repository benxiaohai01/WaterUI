<script setup lang="ts">
import { ref } from 'vue'

const enabled = ref(true)
const small = ref(false)
const disabled = ref(false)
</script>

<template>
  <wt-space wrap :size="18">
    <wt-switch v-model="enabled" active-text="开启" inactive-text="关闭" />
    <wt-switch v-model="small" size="small" />
    <wt-switch v-model="disabled" size="large" disabled />
  </wt-space>
</template>
