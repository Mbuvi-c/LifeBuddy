import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const learnDir = path.join(__dirname, '../../public/images/learn')
const tasksDir = path.join(__dirname, '../../public/images/tasks')

const note50  = path.join(learnDir, 'note_50.jpg')
const note100 = path.join(learnDir, 'note_100.jpg')
const output  = path.join(tasksDir, 'note_100_vs_50.jpg')

const [img50, img100] = await Promise.all([
  sharp(note50).resize({ height: 280, fit: 'inside' }).raw().toBuffer({ resolveWithObject: true }),
  sharp(note100).resize({ height: 280, fit: 'inside' }).raw().toBuffer({ resolveWithObject: true }),
])

const gap = 30
const totalWidth = img50.info.width + gap + img100.info.width
const totalHeight = 280

await sharp({
  create: {
    width: totalWidth,
    height: totalHeight,
    channels: 4,
    background: { r: 14, g: 15, b: 26, alpha: 1 },
  }
})
.composite([
  { input: img50.data,  raw: img50.info,  left: 0,                         top: Math.round((totalHeight - img50.info.height) / 2) },
  { input: img100.data, raw: img100.info, left: img50.info.width + gap,    top: Math.round((totalHeight - img100.info.height) / 2) },
])
.jpeg({ quality: 90 })
.toFile(output)

console.log('note_100_vs_50.jpg created at', output)
