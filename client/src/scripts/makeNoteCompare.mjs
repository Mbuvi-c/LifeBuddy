import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const learnDir = path.join(__dirname, '../../public/images/learn')

const note50  = path.join(learnDir, 'note_50.jpg')
const note1000 = path.join(learnDir, 'note_1000.jpg')
const output   = path.join(learnDir, 'note_compare.jpg')

const [img50, img1000] = await Promise.all([
  sharp(note50).resize({ height: 300, fit: 'inside' }).raw().toBuffer({ resolveWithObject: true }),
  sharp(note1000).resize({ height: 300, fit: 'inside' }).raw().toBuffer({ resolveWithObject: true }),
])

const gap = 40
const totalWidth = img50.info.width + gap + img1000.info.width
const totalHeight = 300

await sharp({
  create: {
    width: totalWidth,
    height: totalHeight,
    channels: 4,
    background: { r: 14, g: 15, b: 26, alpha: 1 },
  }
})
.composite([
  { input: img50.data,   raw: img50.info,   left: 0,                          top: Math.round((totalHeight - img50.info.height) / 2) },
  { input: img1000.data, raw: img1000.info, left: img50.info.width + gap,     top: Math.round((totalHeight - img1000.info.height) / 2) },
])
.jpeg({ quality: 90 })
.toFile(output)

console.log('note_compare.jpg created at', output)
