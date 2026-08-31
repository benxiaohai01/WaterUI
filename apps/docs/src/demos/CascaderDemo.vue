<script setup lang="ts">
import { ref } from 'vue'

const value = ref<Array<string | number>>(['guangdong', 'shenzhen'])
const options = [
  {
    label: '广东',
    value: 'guangdong',
    children: [
      { label: '深圳', value: 'shenzhen' },
      { label: '广州', value: 'guangzhou' }
    ]
  },
  {
    label: '浙江',
    value: 'zhejiang',
    children: [{ label: '杭州', value: 'hangzhou' }]
  }
]
</script>

<template>
  <div class="demo">
    <wt-cascader v-model="value" :options="options" clearable />
  </div>
</template>

<style scoped>
.demo { max-width: 320px; }
</style>
