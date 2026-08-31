<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
const message = ref('尚未操作')

const handleCommand = (command: string | number) => {
  message.value = `点击了：${command}`
}
</script>

<template>
  <div class="dropdown-demo">
    <wt-dropdown trigger="click" @command="handleCommand" @visible-change="(v: boolean) => (visible = v)">
      <wt-button type="primary">点击展开 ▾</wt-button>
      <template #menu>
        <wt-dropdown-menu>
          <wt-dropdown-item command="edit">编辑</wt-dropdown-item>
          <wt-dropdown-item command="copy">复制</wt-dropdown-item>
          <wt-dropdown-item command="delete" divided>删除</wt-dropdown-item>
          <wt-dropdown-item disabled>禁用项</wt-dropdown-item>
        </wt-dropdown-menu>
      </template>
    </wt-dropdown>

    <span class="dropdown-demo__result">{{ message }}</span>
  </div>
</template>

<style scoped lang="scss">
.dropdown-demo {
  display: flex;
  align-items: center;
  gap: 16px;
}

.dropdown-demo__result {
  color: var(--wt-text-secondary);
  font-size: 13px;
}
</style>
