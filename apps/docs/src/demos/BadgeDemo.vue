<script setup lang="ts">
import { ref } from 'vue'

const count = ref(5)
</script>

<template>
  <wt-space :size="28" wrap>
    <wt-badge :value="count" :max="99">
      <wt-button type="primary" size="small" @click="count++">消息</wt-button>
    </wt-badge>
    <wt-badge value="new" type="success">
      <wt-button size="small">动态</wt-button>
    </wt-badge>
    <wt-badge :value="100" type="warning">
      <wt-button size="small">超上限</wt-button>
    </wt-badge>
    <wt-badge dot>
      <wt-icon name="bell" size="22" />
    </wt-badge>
  </wt-space>
</template>
