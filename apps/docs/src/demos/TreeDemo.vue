<script setup lang="ts">
import { ref } from 'vue'
import type { TreeNode } from '@water-ui/components'

const data = ref<TreeNode[]>([
  {
    key: '1',
    label: '前端开发',
    children: [
      { key: '1-1', label: 'Vue 3' },
      {
        key: '1-2',
        label: 'React',
        children: [
          { key: '1-2-1', label: 'Hooks' },
          { key: '1-2-2', label: '状态管理' }
        ]
      }
    ]
  },
  {
    key: '2',
    label: '后端开发',
    children: [
      { key: '2-1', label: 'Node.js' },
      { key: '2-2', label: 'Go' }
    ]
  }
])
</script>

<template>
  <wt-tree :data="data" default-expand-all show-line />
</template>
