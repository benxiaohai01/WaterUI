import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const componentsDir = resolve(__dirname, 'src/components')
const entry = Object.fromEntries(
  readdirSync(componentsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => [dirent.name, resolve(componentsDir, dirent.name, 'index.ts')])
)

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'dist/components',
    emptyOutDir: false,
    lib: {
      entry,
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`
    },
    rollupOptions: {
      external: ['vue', /^@water-ui\/theme/],
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return assetInfo.name
          }
          return '[name][extname]'
        }
      }
    },
    cssCodeSplit: true
  }
})
