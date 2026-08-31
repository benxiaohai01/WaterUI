<script setup lang="ts">
const data = Array.from({ length: 1000 }, (_, i) => `第 ${i + 1} 条数据`)
</script>

<template>
  <wt-virtual-list :data="data" :item-size="40" :height="260" :buffer="3">
    <template #default="{ item, index }">
      <div class="list-row" :class="{ 'is-even': index % 2 === 0 }">
        <span class="list-index">{{ index + 1 }}</span>
        <span>{{ item }}</span>
      </div>
    </template>
  </wt-virtual-list>
</template>

<style scoped>
.list-row {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 100%;
  padding: 0 16px;
  font-size: 14px;
  color: var(--wt-text-secondary);
  border-bottom: 1px solid color-mix(in srgb, var(--wt-text-secondary) 8%, transparent);
}

.list-row.is-even {
  background: color-mix(in srgb, var(--wt-primary) 4%, transparent);
}

.list-index {
  color: var(--wt-text-placeholder);
  font-size: 12px;
  min-width: 32px;
}
</style>
