import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const learnDir = path.join(__dirname, '../../public/images/learn')

async function composite(leftFile, rightFile, outputFile) {
  const [imgL, imgR] = await Promise.all([
    sharp(leftFile).resize({ height: 260, fit: 'inside' }).raw().toBuffer({ resolveWithObject: true }),
    sharp(rightFile).resize({ height: 260, fit: 'inside' }).raw().toBuffer({ resolveWithObject: true }),
  ])
  const gap = 30
  const totalWidth = imgL.info.width + gap + imgR.info.width
  const totalHeight = 260
  await sharp({
    create: { width: totalWidth, height: totalHeight, channels: 4, background: { r: 14, g: 15, b: 26, alpha: 1 } }
  })
  .composite([
    { input: imgL.data, raw: imgL.info, left: 0, top: Math.round((totalHeight - imgL.info.height) / 2) },
    { input: imgR.data, raw: imgR.info, left: imgL.info.width + gap, top: Math.round((totalHeight - imgR.info.height) / 2) },
  ])
  .jpeg({ quality: 90 })
  .toFile(outputFile)
  console.log('Created', outputFile)
}

await composite(
  path.join(learnDir, 'note_50.jpg'),
  path.join(learnDir, 'note_100.jpg'),
  path.join(learnDir, 'notes_small.jpg')
)

await composite(
  path.join(learnDir, 'note_500.png'),
  path.join(learnDir, 'note_1000.jpg'),
  path.join(learnDir, 'notes_large.jpg')
)
