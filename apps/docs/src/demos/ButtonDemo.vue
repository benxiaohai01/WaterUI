<template>
  <div class="demo-grid">
    <wt-space wrap :size="12">
      <wt-button>默认按钮</wt-button>
      <wt-button type="primary">主要按钮</wt-button>
      <wt-button type="success">成功按钮</wt-button>
      <wt-button type="warning">警告按钮</wt-button>
      <wt-button type="danger">危险按钮</wt-button>
      <wt-button type="info">信息按钮</wt-button>
    </wt-space>
    <wt-divider />
    <wt-space wrap :size="12">
      <wt-button size="small">小尺寸</wt-button>
      <wt-button type="primary">中尺寸</wt-button>
      <wt-button type="primary" size="large">大尺寸</wt-button>
      <wt-button type="primary" round>圆形按钮</wt-button>
      <wt-button type="primary" loading>加载中</wt-button>
      <wt-button type="primary" disabled>禁用状态</wt-button>
    </wt-space>
    <wt-divider />
    <wt-space wrap :size="12">
      <wt-button plain>朴素按钮</wt-button>
      <wt-button type="primary" plain>朴素主要</wt-button>
      <wt-button type="success" plain>朴素成功</wt-button>
      <wt-button type="danger" plain>朴素危险</wt-button>
      <wt-button type="primary" plain block>块级朴素按钮</wt-button>
    </wt-space>
    <wt-divider />
    <wt-space wrap :size="12">
      <wt-button type="primary">默认高光</wt-button>
      <wt-button type="primary" :highlight-size="20" :highlight-offset="4" :highlight-opacity="0.95">
        组件级高光
      </wt-button>
      <wt-button type="primary" :highlight-size="10" :highlight-opacity="0.5">小高光</wt-button>
    </wt-space>
  </div>
</template>

<style scoped>
.demo-grid {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
</style>
