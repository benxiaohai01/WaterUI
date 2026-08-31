<script setup lang="ts">
import { ref } from 'vue'

const current = ref(1)
const total = 200

const handleChange = (page: number) => {
  current.value = page
}
</script>

<template>
  <wt-pagination :current="current" :total="total" show-total show-jumper @change="handleChange" />
</template>
