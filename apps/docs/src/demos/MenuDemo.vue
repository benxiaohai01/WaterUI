<script setup lang="ts">
import { ref } from 'vue'

const active = ref('1')
</script>

<template>
  <div class="menu-demo">
    <wt-menu v-model="active" mode="vertical" style="width: 220px">
      <wt-menu-item index="1">仪表盘</wt-menu-item>
      <wt-menu-item index="2">工作台</wt-menu-item>
      <wt-sub-menu index="3" title="组件库">
        <wt-menu-item index="3-1">Button</wt-menu-item>
        <wt-menu-item index="3-2">Tabs</wt-menu-item>
        <wt-menu-item index="3-3">Menu</wt-menu-item>
      </wt-sub-menu>
      <wt-menu-item index="4" disabled>设置（禁用）</wt-menu-item>
    </wt-menu>
  </div>
</template>

<style scoped lang="scss">
.menu-demo {
  display: flex;
  justify-content: center;
}
</style>
