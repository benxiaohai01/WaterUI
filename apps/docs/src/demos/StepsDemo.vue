<script setup lang="ts">
import { ref } from 'vue'

const active = ref(1)
</script>

<template>
  <div class="steps-demo">
    <wt-steps v-model:active="active">
      <wt-step title="填写信息" description="基础资料" />
      <wt-step title="确认订单" description="核对明细" />
      <wt-step title="完成支付" description="等待到账" />
    </wt-steps>

    <div class="steps-demo__actions">
      <wt-button type="primary" :disabled="active >= 3" @click="active += 1">下一步</wt-button>
      <wt-button :disabled="active <= 0" @click="active -= 1">上一步</wt-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.steps-demo {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.steps-demo__actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}
</style>
