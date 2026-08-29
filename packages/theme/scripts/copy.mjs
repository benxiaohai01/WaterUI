import { cp, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(root, 'dist')

await mkdir(dist, { recursive: true })
await cp(resolve(root, 'src'), dist, { recursive: true })
console.log('Theme styles copied to packages/theme/dist')
