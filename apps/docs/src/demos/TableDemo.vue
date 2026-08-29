<script setup lang="ts">
const columns = [
  { key: 'name', title: '名称', width: '30%' },
  { key: 'type', title: '类型', width: '20%' },
  { key: 'value', title: '默认值', width: '20%' },
  { key: 'description', title: '说明' }
]

const rows = [
  {
    name: 'type',
    type: 'string',
    value: 'default',
    description: '按钮类型'
  },
  {
    name: 'size',
    type: 'string',
    value: 'medium',
    description: '按钮尺寸'
  },
  {
    name: 'disabled',
    type: 'boolean',
    value: 'false',
    description: '是否禁用'
  }
]
</script>

<template>
  <wt-table :columns="columns" :data="rows" striped />
</template>
