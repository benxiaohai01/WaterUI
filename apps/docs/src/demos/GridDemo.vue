<template>
  <div class="grid-demo">
    <wt-row :gutter="12">
      <wt-col :span="24"><div class="grid-demo__cell">24</div></wt-col>
    </wt-row>
    <wt-row :gutter="12">
      <wt-col :span="12"><div class="grid-demo__cell">12</div></wt-col>
      <wt-col :span="12"><div class="grid-demo__cell">12</div></wt-col>
    </wt-row>
    <wt-row :gutter="12">
      <wt-col :span="8"><div class="grid-demo__cell">8</div></wt-col>
      <wt-col :span="8"><div class="grid-demo__cell">8</div></wt-col>
      <wt-col :span="8"><div class="grid-demo__cell">8</div></wt-col>
    </wt-row>
    <wt-row :gutter="12">
      <wt-col :span="6"><div class="grid-demo__cell">6</div></wt-col>
      <wt-col :span="6"><div class="grid-demo__cell">6</div></wt-col>
      <wt-col :span="6"><div class="grid-demo__cell">6</div></wt-col>
      <wt-col :span="6"><div class="grid-demo__cell">6</div></wt-col>
    </wt-row>
  </div>
</template>

<style scoped>
.grid-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.grid-demo__cell {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  border-radius: var(--wt-radius-sm);
  color: var(--wt-primary);
  font-size: 13px;
  font-weight: 600;
  background: color-mix(in srgb, var(--wt-primary) 14%, transparent);
}
</style>
