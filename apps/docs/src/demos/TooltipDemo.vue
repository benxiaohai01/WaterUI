<script setup lang="ts">
import { ref } from 'vue'

const trigger = ref<'hover' | 'click'>('hover')
</script>

<template>
  <wt-space direction="vertical" :size="14">
    <wt-space :size="12">
      <wt-text type="secondary">触发方式：</wt-text>
      <wt-radio v-model="trigger" value="hover">悬浮</wt-radio>
      <wt-radio v-model="trigger" value="click">点击</wt-radio>
    </wt-space>
    <wt-space :size="18">
      <wt-tooltip content="顶部提示" placement="top" :trigger="trigger">
        <wt-button>上</wt-button>
      </wt-tooltip>
      <wt-tooltip content="右侧提示" placement="right" :trigger="trigger">
        <wt-button>右</wt-button>
      </wt-tooltip>
      <wt-tooltip content="底部提示" placement="bottom" :trigger="trigger">
        <wt-button>下</wt-button>
      </wt-tooltip>
      <wt-tooltip content="左侧提示" placement="left" :trigger="trigger">
        <wt-button>左</wt-button>
      </wt-tooltip>
    </wt-space>
  </wt-space>
</template>
