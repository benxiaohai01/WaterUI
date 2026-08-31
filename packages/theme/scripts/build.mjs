import { mkdir, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { compile } from 'sass'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(root, 'dist')

const outputs = [
  ['src/base.scss', 'dist/base.css'],
  ['src/light.scss', 'dist/light.css'],
  ['src/dark.scss', 'dist/dark.css'],
  ['src/index.scss', 'dist/index.css']
]

await rm(dist, { recursive: true, force: true })
await mkdir(dist, { recursive: true })

for (const [source, target] of outputs) {
  const result = compile(resolve(root, source), {
    style: 'compressed',
    loadPaths: [resolve(root, 'src')]
  })
  await writeFile(resolve(root, target), result.css)
}

console.log('Theme styles compiled to packages/theme/dist')
