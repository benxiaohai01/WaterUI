<template>
  <wt-scrollbar :height="160">
    <p v-for="i in 12" :key="i" style="margin: 0 0 8px">
      第 {{ i }} 行：Water UI 滚动条组件，支持拖拽滑块、悬停显示轨道，内容超高时自动出现。
    </p>
  </wt-scrollbar>
</template>
