<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)

const images = [
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80'
]
</script>

<template>
  <wt-button type="primary" @click="visible = true">打开图片预览</wt-button>

  <wt-image-viewer v-model="visible" :image-list="images" :current="0" />
</template>
