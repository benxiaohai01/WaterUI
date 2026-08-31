<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
</script>

<template>
  <wt-space direction="vertical" :size="12">
    <wt-button type="primary" @click="visible = true">打开对话框</wt-button>
    <wt-text type="secondary">支持自定义标题、内容与底部操作区。</wt-text>
    <wt-dialog v-model="visible" title="水滴对话框" width="468px">
      <p>这是对话框内容区域，可以放置表单、说明或任意组件。</p>
      <template #footer>
        <wt-button @click="visible = false">取消</wt-button>
        <wt-button type="primary" @click="visible = false">确认</wt-button>
      </template>
    </wt-dialog>
  </wt-space>
</template>
