<template>
  <div class="text-demo">
    <wt-text size="large" strong>Water UI 大标题</wt-text>
    <wt-text size="medium" type="secondary">这是一段次要文本，用于说明内容层级。</wt-text>
    <wt-space :size="10">
      <wt-text type="success">成功</wt-text>
      <wt-text type="warning">警告</wt-text>
      <wt-text type="danger">危险</wt-text>
      <wt-text type="info">信息</wt-text>
    </wt-space>
    <wt-text block truncate type="secondary">
      这是一段会被截断的文本，用来展示 Text 组件的 truncate 属性。
    </wt-text>
  </div>
</template>

<style scoped>
.text-demo {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 360px;
}
</style>
