<script setup lang="ts">
withDefaults(
  defineProps<{
    wrapped?: boolean
  }>(),
  {
    wrapped: false
  }
)

const icons = ['search', 'home', 'github', 'copy', 'check', 'menu', 'moon', 'sun', 'code', 'external', 'arrow-right', 'close'] as const
</script>

<template>
  <div class="icon-demo">
    <div v-for="icon in icons" :key="icon" class="icon-demo__item">
      <wt-icon :name="icon" :size="24" :wrapped="wrapped" />
      <span>{{ icon }}</span>
    </div>
  </div>
</template>

<style scoped>
.icon-demo {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(88px, 1fr));
  gap: 12px;
}

.icon-demo__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 18px 10px;
  border-radius: var(--wt-radius-sm);
  color: var(--wt-text-secondary);
  background: color-mix(in srgb, var(--wt-surface) 70%, transparent);
  box-shadow: inset 1px 2px 4px rgba(0, 0, 0, 0.06);
}
</style>
