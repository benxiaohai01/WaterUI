<script setup lang="ts">
import { ref } from 'vue'

const rate = ref(3.5)
</script>

<template>
  <wt-rate v-model="rate" allow-half />
</template>
