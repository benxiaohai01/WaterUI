<template>
  <div class="watermark-demo">
    <wt-watermark text="Water UI\n机密文件" :font-size="15" :opacity="0.12">
      <div class="watermark-content">
        <p>这是一段受水印保护的内容区域。</p>
        <p>水印以 SVG 平铺，文字或图片均可，不会影响内容交互。</p>
        <p>可通过 opacity / color / width / height 自定义水印密度与样式。</p>
      </div>
    </wt-watermark>
  </div>
</template>

<style scoped>
.watermark-demo {
  width: 100%;
}

.watermark-content {
  height: 180px;
  padding: 20px;
  border-radius: var(--wt-radius-md);
  background: color-mix(in srgb, var(--wt-surface) 60%, transparent);
  color: var(--wt-text-secondary);
  font-size: 14px;
  line-height: 2;
}
</style>
