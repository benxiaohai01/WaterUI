<script setup lang="ts">
const goBack = () => {
  /* 演示：跳回首页 */
  window.history.back()
}
</script>

<template>
  <wt-page-header title="订单详情" subtitle="订单号 #WU-20260831" show-back @back="goBack">
    <template #breadcrumb>
      <wt-breadcrumb separator="/">
        <wt-breadcrumb-item to="/">首页</wt-breadcrumb-item>
        <wt-breadcrumb-item to="/components">组件</wt-breadcrumb-item>
        <wt-breadcrumb-item>订单详情</wt-breadcrumb-item>
      </wt-breadcrumb>
    </template>
    <template #extra>
      <wt-button type="primary">导出</wt-button>
      <wt-button>打印</wt-button>
    </template>
  </wt-page-header>
</template>
