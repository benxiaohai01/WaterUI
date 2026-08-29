<template>
  <div class="layout-demo">
    <wt-layout class="layout-demo__outer">
      <wt-header class="layout-demo__header">Header</wt-header>
      <wt-layout>
        <wt-aside class="layout-demo__aside" width="120px">Aside</wt-aside>
        <wt-layout direction="vertical">
          <wt-main class="layout-demo__main">Main</wt-main>
          <wt-footer class="layout-demo__footer">Footer</wt-footer>
        </wt-layout>
      </wt-layout>
    </wt-layout>
  </div>
</template>

<style scoped>
.layout-demo__outer {
  min-height: 240px;
  overflow: hidden;
  border-radius: var(--wt-radius-md);
  background: color-mix(in srgb, var(--wt-surface) 78%, transparent);
  box-shadow: inset 2px 3px 8px rgba(0, 0, 0, 0.08);
}

.layout-demo__header,
.layout-demo__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--wt-text-secondary);
  font-size: 13px;
}

.layout-demo__header {
  height: 48px;
  border-bottom: 1px solid color-mix(in srgb, var(--wt-text-secondary) 14%, transparent);
}

.layout-demo__footer {
  height: 40px;
  border-top: 1px solid color-mix(in srgb, var(--wt-text-secondary) 14%, transparent);
}

.layout-demo__aside {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--wt-text-secondary);
  font-size: 13px;
  border-right: 1px solid color-mix(in srgb, var(--wt-text-secondary) 14%, transparent);
}

.layout-demo__main {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--wt-text);
}
</style>
