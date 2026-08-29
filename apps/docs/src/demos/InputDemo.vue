<script setup lang="ts">
import { ref } from 'vue'

const keyword = ref('')
const password = ref('')
const disabled = ref('不可编辑内容')
</script>

<template>
  <div class="input-demo">
    <wt-input v-model="keyword" placeholder="请输入关键词" clearable>
      <template #prefix>
        <wt-icon name="search" :size="18" />
      </template>
    </wt-input>
    <wt-input v-model="password" type="password" placeholder="请输入密码" />
    <wt-input v-model="disabled" disabled />
  </div>
</template>

<style scoped>
.input-demo {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 420px;
}
</style>
