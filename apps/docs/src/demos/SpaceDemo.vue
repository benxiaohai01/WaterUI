<template>
  <div class="space-demo">
    <wt-space :size="8">
      <wt-button size="small">按钮 1</wt-button>
      <wt-button size="small">按钮 2</wt-button>
      <wt-button size="small">按钮 3</wt-button>
    </wt-space>
    <wt-divider />
    <wt-space direction="vertical" :size="10">
      <wt-tag>标签 1</wt-tag>
      <wt-tag type="primary">标签 2</wt-tag>
      <wt-tag type="success">标签 3</wt-tag>
    </wt-space>
  </div>
</template>

<style scoped>
.space-demo {
  display: flex;
  flex-direction: column;
}
</style>
