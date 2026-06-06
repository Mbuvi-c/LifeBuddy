import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const learnDir = path.join(__dirname, '../../public/images/learn')

async function compositeCoins(files, outputFile) {
  const imgs = await Promise.all(
    files.map(f => sharp(path.join(learnDir, f)).resize({ height: 220, fit: 'inside' }).raw().toBuffer({ resolveWithObject: true }))
  )
  const gap = 20
  const totalWidth = imgs.reduce((sum, img) => sum + img.info.width, 0) + gap * (imgs.length - 1)
  const totalHeight = 220
  const composites = []
  let x = 0
  for (const img of imgs) {
    composites.push({
      input: img.data,
      raw: img.info,
      left: x,
      top: Math.round((totalHeight - img.info.height) / 2),
    })
    x += img.info.width + gap
  }
  await sharp({
    create: { width: totalWidth, height: totalHeight, channels: 4, background: { r: 14, g: 15, b: 26, alpha: 1 } }
  })
  .composite(composites)
  .jpeg({ quality: 90 })
  .toFile(outputFile)
  console.log('Created', path.basename(outputFile))
}

// exact_45.jpg — KES 20 + KES 20 + KES 5
await compositeCoins(
  ['coin_20.jpg', 'coin_20.jpg', 'coin_5.jpg'],
  path.join(learnDir, 'exact_45.jpg')
)

// exact_30.jpg — KES 20 + KES 10
await compositeCoins(
  ['coin_20.jpg', 'coin_10.jpg'],
  path.join(learnDir, 'exact_30.jpg')
)

// change_45.jpg — same as exact_45
await compositeCoins(
  ['coin_20.jpg', 'coin_20.jpg', 'coin_5.jpg'],
  path.join(learnDir, 'change_45.jpg')
)

console.log('All done.')
